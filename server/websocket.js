/**
 * WebSocket Server Configuration
 * Real-time agent progress, audit events, and connector status
 */

import { Server } from 'socket.io';

let io;

export function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Agent progress namespace
  io.of('/agent-progress').on('connection', (socket) => {
    console.log(`✅ Client connected to /agent-progress: ${socket.id}`);

    socket.on('subscribe-agent', (agentName) => {
      socket.join(`agent:${agentName}`);
      console.log(`📡 Client subscribed to agent: ${agentName}`);
    });

    socket.on('unsubscribe-agent', (agentName) => {
      socket.leave(`agent:${agentName}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Audit events namespace
  io.of('/audit-events').on('connection', (socket) => {
    console.log(`✅ Client connected to /audit-events: ${socket.id}`);

    socket.on('subscribe-audit', (auditId) => {
      socket.join(`audit:${auditId}`);
      console.log(`📡 Client subscribed to audit: ${auditId}`);
    });

    socket.on('unsubscribe-audit', (auditId) => {
      socket.leave(`audit:${auditId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Connector status namespace
  io.of('/connector-status').on('connection', (socket) => {
    console.log(`✅ Client connected to /connector-status: ${socket.id}`);

    socket.on('get-status', (callback) => {
      // Send current connector status
      callback({ status: 'ok' });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 WebSocket server initialized');
  return io;
}

/**
 * Emit agent progress to connected clients
 */
export function emitAgentProgress(agentName, data) {
  if (io) {
    io.of('/agent-progress').to(`agent:${agentName}`).emit('progress', {
      agentName,
      progress: data.progress,
      currentTask: data.currentTask,
      tokensUsed: data.tokensUsed,
      estimatedTimeRemaining: data.estimatedTimeRemaining,
      timestamp: new Date(),
    });
  }
}

/**
 * Emit audit event
 */
export function emitAuditEvent(auditId, eventType, data) {
  if (io) {
    io.of('/audit-events').to(`audit:${auditId}`).emit(eventType, {
      auditId,
      eventType,
      data,
      timestamp: new Date(),
    });
  }
}

/**
 * Emit connector status update
 */
export function emitConnectorStatus(connectorName, status) {
  if (io) {
    io.of('/connector-status').emit('status-update', {
      connector: connectorName,
      status,
      timestamp: new Date(),
    });
  }
}

/**
 * Broadcast system alert to all connected clients
 */
export function broadcastAlert(message, severity = 'info') {
  if (io) {
    io.emit('system-alert', {
      message,
      severity,
      timestamp: new Date(),
    });
  }
}

/**
 * Get WebSocket instance
 */
export function getIO() {
  return io;
}
