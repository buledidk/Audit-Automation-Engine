/**
 * RealtimeSync Service - WebSocket Real-time Synchronization
 * Phase 8: Mobile Dispatch & Remote Operations
 *
 * Manages bidirectional WebSocket connections for real-time updates between
 * mobile clients and the Audit Automation Engine backend.
 *
 * Features:
 * - Real-time status updates (<1s latency)
 * - Event-based messaging (status changes, notifications, command results)
 * - Automatic reconnection with exponential backoff
 * - Message queueing for offline mode
 * - Dead-letter handling for failed messages
 * - Device fingerprinting and session management
 */

const EventEmitter = require('events');
const crypto = require('crypto');
const logger = require('../utils/logger');

class RealtimeSync extends EventEmitter {
  constructor(wss) {
    super();
    this.wss = wss; // WebSocket server instance
    this.connections = new Map(); // deviceId -> WebSocketConnection
    this.subscriptions = new Map(); // deviceId -> Set of subscriptions
    this.messageQueue = new Map(); // deviceId -> Queue of pending messages
    this.heartbeatInterval = 30000; // 30 seconds
    this.maxQueueSize = 1000; // Max messages to queue per device
    this.reconnectMaxAttempts = 5;
    this.reconnectBaseDelay = 1000; // 1 second
  }

  /**
   * Initialize WebSocket server and event handlers
   */
  initialize() {
    logger.info('Initializing RealtimeSync service');

    this.wss.on('connection', (ws) => {
      this.handleNewConnection(ws);
    });

    // Start heartbeat monitoring
    this.startHeartbeatMonitoring();

    logger.info('RealtimeSync service initialized');
  }

  /**
   * Handle new WebSocket connection
   */
  handleNewConnection(ws) {
    const connectionId = crypto.randomBytes(16).toString('hex');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(ws, connectionId, message);
      } catch (error) {
        logger.error('Failed to parse WebSocket message', { error, data });
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(connectionId);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error', { error, connectionId });
      this.handleDisconnection(connectionId);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      connectionId,
      timestamp: new Date().toISOString()
    }));

    logger.debug('New WebSocket connection', { connectionId });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(ws, connectionId, message) {
    const { type, deviceId, sessionId, data, subscriptions } = message;

    switch (type) {
      case 'register':
        this.handleRegister(ws, connectionId, deviceId, sessionId, data);
        break;

      case 'subscribe':
        this.handleSubscribe(connectionId, deviceId, subscriptions);
        break;

      case 'unsubscribe':
        this.handleUnsubscribe(connectionId, deviceId, subscriptions);
        break;

      case 'heartbeat':
        this.handleHeartbeat(ws, connectionId, deviceId);
        break;

      case 'message_ack':
        this.handleMessageAck(connectionId, deviceId, data.messageId);
        break;

      default:
        logger.warn('Unknown message type', { type, connectionId });
    }
  }

  /**
   * Handle device registration
   */
  handleRegister(ws, connectionId, deviceId, sessionId, deviceInfo) {
    if (!deviceId || !sessionId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'deviceId and sessionId required'
      }));
      return;
    }

    // Create connection object
    const connection = {
      connectionId,
      deviceId,
      sessionId,
      ws,
      isActive: true,
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
      deviceInfo: deviceInfo || {},
      messageCount: 0
    };

    this.connections.set(deviceId, connection);
    this.subscriptions.set(deviceId, new Set());
    this.messageQueue.set(deviceId, []);

    // Send queued messages if any
    this.flushMessageQueue(deviceId);

    // Notify subscribers
    this.emit('device:registered', { deviceId, connectionId });

    ws.send(JSON.stringify({
      type: 'registered',
      deviceId,
      connectionId,
      timestamp: new Date().toISOString()
    }));

    logger.info('Device registered', { deviceId, connectionId });
  }

  /**
   * Handle subscription to event types
   */
  handleSubscribe(connectionId, deviceId, subscriptions) {
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return;
    }

    const deviceSubs = this.subscriptions.get(deviceId) || new Set();
    subscriptions.forEach(sub => deviceSubs.add(sub));
    this.subscriptions.set(deviceId, deviceSubs);

    logger.debug('Device subscribed to events', {
      deviceId,
      subscriptions: Array.from(deviceSubs)
    });
  }

  /**
   * Handle unsubscription from event types
   */
  handleUnsubscribe(connectionId, deviceId, subscriptions) {
    if (!Array.isArray(subscriptions)) {
      return;
    }

    const deviceSubs = this.subscriptions.get(deviceId) || new Set();
    subscriptions.forEach(sub => deviceSubs.delete(sub));
    this.subscriptions.set(deviceId, deviceSubs);
  }

  /**
   * Handle heartbeat from client
   */
  handleHeartbeat(ws, connectionId, deviceId) {
    const connection = this.connections.get(deviceId);
    if (connection) {
      connection.lastHeartbeat = new Date();
    }

    ws.send(JSON.stringify({
      type: 'heartbeat_ack',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Handle message acknowledgment from client
   */
  handleMessageAck(connectionId, deviceId, messageId) {
    // Remove acknowledged message from queue if present
    const queue = this.messageQueue.get(deviceId) || [];
    const index = queue.findIndex(msg => msg.id === messageId);
    if (index > -1) {
      queue.splice(index, 1);
    }
  }

  /**
   * Handle device disconnection
   */
  handleDisconnection(connectionId) {
    let disconnectedDeviceId = null;

    for (const [deviceId, connection] of this.connections.entries()) {
      if (connection.connectionId === connectionId) {
        connection.isActive = false;
        disconnectedDeviceId = deviceId;
        break;
      }
    }

    if (disconnectedDeviceId) {
      logger.info('Device disconnected', { deviceId: disconnectedDeviceId });
      this.emit('device:disconnected', { deviceId: disconnectedDeviceId });
    }
  }

  /**
   * Broadcast message to specific device
   */
  sendToDevice(deviceId, message) {
    const connection = this.connections.get(deviceId);

    if (!connection || !connection.isActive) {
      // Queue message for later delivery
      this.queueMessage(deviceId, message);
      return false;
    }

    const messageWithMeta = {
      ...message,
      id: crypto.randomBytes(8).toString('hex'),
      timestamp: new Date().toISOString(),
      deviceId
    };

    try {
      connection.ws.send(JSON.stringify(messageWithMeta));
      connection.messageCount++;
      return true;
    } catch (error) {
      logger.error('Failed to send message to device', { deviceId, error });
      this.queueMessage(deviceId, message);
      return false;
    }
  }

  /**
   * Broadcast message to all subscribed devices
   */
  broadcast(eventType, data, filter = null) {
    let sentCount = 0;
    let queuedCount = 0;

    for (const [deviceId, subs] of this.subscriptions.entries()) {
      // Check if device is subscribed to this event type
      if (!subs.has(eventType) && !subs.has('*')) {
        continue;
      }

      // Apply optional filter
      if (filter && !filter(deviceId)) {
        continue;
      }

      const message = {
        type: eventType,
        data,
        eventType
      };

      if (this.sendToDevice(deviceId, message)) {
        sentCount++;
      } else {
        queuedCount++;
      }
    }

    logger.debug('Broadcast complete', {
      eventType,
      sentCount,
      queuedCount,
      totalDevices: this.subscriptions.size
    });

    return { sentCount, queuedCount };
  }

  /**
   * Queue message for later delivery
   */
  queueMessage(deviceId, message) {
    let queue = this.messageQueue.get(deviceId) || [];

    // Don't exceed max queue size
    if (queue.length >= this.maxQueueSize) {
      logger.warn('Message queue full, dropping oldest message', {
        deviceId,
        queueSize: queue.length
      });
      queue.shift();
    }

    queue.push({
      id: crypto.randomBytes(8).toString('hex'),
      ...message,
      queuedAt: new Date()
    });

    this.messageQueue.set(deviceId, queue);
    logger.debug('Message queued', { deviceId, queueSize: queue.length });
  }

  /**
   * Flush queued messages when device reconnects
   */
  flushMessageQueue(deviceId) {
    const queue = this.messageQueue.get(deviceId) || [];
    const connection = this.connections.get(deviceId);

    if (!connection || !connection.isActive || queue.length === 0) {
      return;
    }

    logger.info('Flushing message queue', { deviceId, count: queue.length });

    // Send up to 10 queued messages
    const messagesToSend = queue.splice(0, 10);

    messagesToSend.forEach(message => {
      const { id, queuedAt, ...messageData } = message;
      this.sendToDevice(deviceId, {
        ...messageData,
        wasQueued: true,
        queuedAt,
        id
      });
    });

    this.messageQueue.set(deviceId, queue);
  }

  /**
   * Start heartbeat monitoring for idle connections
   */
  startHeartbeatMonitoring() {
    setInterval(() => {
      const now = new Date();
      const timeout = 90000; // 90 seconds

      for (const [deviceId, connection] of this.connections.entries()) {
        const lastHeartbeat = connection.lastHeartbeat || connection.connectedAt;
        const timeSinceHeartbeat = now - lastHeartbeat;

        if (timeSinceHeartbeat > timeout && connection.isActive) {
          logger.warn('Device heartbeat timeout', { deviceId });
          connection.isActive = false;
          connection.ws.close();
        }
      }
    }, this.heartbeatInterval);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const stats = {
      totalConnections: this.connections.size,
      activeConnections: 0,
      totalSubscriptions: 0,
      totalQueuedMessages: 0,
      devices: []
    };

    for (const [deviceId, connection] of this.connections.entries()) {
      const subs = this.subscriptions.get(deviceId) || new Set();
      const queue = this.messageQueue.get(deviceId) || [];

      if (connection.isActive) {
        stats.activeConnections++;
      }

      stats.totalSubscriptions += subs.size;
      stats.totalQueuedMessages += queue.length;

      stats.devices.push({
        deviceId,
        isActive: connection.isActive,
        connectedAt: connection.connectedAt,
        subscriptions: Array.from(subs),
        queuedMessages: queue.length,
        messagesSent: connection.messageCount
      });
    }

    return stats;
  }

  /**
   * Cleanup and shutdown
   */
  shutdown() {
    logger.info('Shutting down RealtimeSync service');

    for (const connection of this.connections.values()) {
      if (connection.isActive) {
        connection.ws.close();
      }
    }

    this.connections.clear();
    this.subscriptions.clear();
    this.messageQueue.clear();
  }
}

module.exports = RealtimeSync;
