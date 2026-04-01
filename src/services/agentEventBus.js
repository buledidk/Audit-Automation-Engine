/**
 * Agent Event Bus — Singleton Pub/Sub for AuditEngine
 * Browser-compatible (no Node EventEmitter dependency)
 * Connects UI actions to agents via typed events
 */

export const EVENT_TYPES = {
  FINDING_LOGGED: 'FINDING_LOGGED',
  RISK_CHANGED: 'RISK_CHANGED',
  EVIDENCE_UPLOADED: 'EVIDENCE_UPLOADED',
  PROCEDURE_COMPLETED: 'PROCEDURE_COMPLETED',
  MATERIALITY_CHANGED: 'MATERIALITY_CHANGED',
  CONTROL_FAILED: 'CONTROL_FAILED',
  DEADLINE_APPROACHING: 'DEADLINE_APPROACHING',
  AGENT_STATUS_CHANGED: 'AGENT_STATUS_CHANGED',
  ENGAGEMENT_UPDATED: 'ENGAGEMENT_UPDATED',
  FILE_VERSION_CREATED: 'FILE_VERSION_CREATED',
  SIGN_OFF_CHANGED: 'SIGN_OFF_CHANGED'
};

const MAX_LOG_SIZE = 200;

class AgentEventBus {
  constructor() {
    this.listeners = new Map();
    this.wildcardListeners = new Set();
    this.eventLog = [];
  }

  /**
   * Publish an event to all subscribers
   * @param {string} type - Event type from EVENT_TYPES
   * @param {Object} payload - Event data
   */
  publish(type, payload) {
    const event = {
      type,
      payload,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };

    // Circular buffer
    this.eventLog.push(event);
    if (this.eventLog.length > MAX_LOG_SIZE) {
      this.eventLog.shift();
    }

    // Notify type-specific listeners
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(cb => {
        try { cb(event); } catch (e) { console.error(`[EventBus] Listener error for ${type}:`, e); }
      });
    }

    // Notify wildcard listeners
    this.wildcardListeners.forEach(cb => {
      try { cb(event); } catch (e) { console.error('[EventBus] Wildcard listener error:', e); }
    });
  }

  /**
   * Subscribe to a specific event type
   * @param {string} type - Event type
   * @param {Function} cb - Callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(type, cb) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(cb);
    return () => {
      const set = this.listeners.get(type);
      if (set) {
        set.delete(cb);
        if (set.size === 0) this.listeners.delete(type);
      }
    };
  }

  /**
   * Subscribe to all events
   * @param {Function} cb - Callback
   * @returns {Function} Unsubscribe function
   */
  subscribeAll(cb) {
    this.wildcardListeners.add(cb);
    return () => this.wildcardListeners.delete(cb);
  }

  /**
   * Get recent events from the log
   * @param {number} count - Number of events to return
   * @param {string} [filterType] - Optional event type filter
   * @returns {Array} Recent events
   */
  getRecentEvents(count = 20, filterType) {
    const source = filterType
      ? this.eventLog.filter(e => e.type === filterType)
      : this.eventLog;
    return source.slice(-count);
  }

  /**
   * Clear all listeners (for testing/cleanup)
   */
  reset() {
    this.listeners.clear();
    this.wildcardListeners.clear();
    this.eventLog = [];
  }
}

// Singleton instance
export const agentEventBus = new AgentEventBus();

export default AgentEventBus;
