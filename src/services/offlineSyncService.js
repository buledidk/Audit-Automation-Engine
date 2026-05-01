/**
 * Offline Sync Service
 * Enables offline-first audit work with automatic sync when connectivity restored
 * Implements PWA patterns for mobile support
 */

class OfflineSyncService {
  constructor() {
    this.queue = new Map();
    this.listeners = new Map();
    this.isOnline = navigator.onLine || true;
    this.syncInProgress = false;

    // Monitor connectivity
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Queue action for offline execution
   */
  queueAction(actionId, action) {
    const queueItem = {
      id: actionId,
      action,
      timestamp: new Date().toISOString(),
      status: 'queued',
      retries: 0
    };

    this.queue.set(actionId, queueItem);
    this.emit('action:queued', queueItem);

    // Auto-sync if online
    if (this.isOnline) {
      this.syncQueue();
    }

    return queueItem;
  }

  /**
   * Sync queued actions when back online
   */
  async syncQueue() {
    if (this.syncInProgress || !this.isOnline || this.queue.size === 0) {
      return;
    }

    this.syncInProgress = true;
    this.emit('sync:started', { queueSize: this.queue.size });

    for (const [actionId, item] of this.queue) { // eslint-disable-line no-unused-vars
      try {
        // Execute the queued action against Supabase
        const { createEngagement, updateEngagement, createFinding, logAuditEntry, isSupabaseConfigured } = await import('../lib/supabaseClient.js');

        if (!isSupabaseConfigured()) {
          throw new Error('Supabase not configured');
        }

        const { action } = item;
        switch (action.type) {
          case 'CREATE_ENGAGEMENT':
            await createEngagement(action.data);
            break;
          case 'UPDATE_ENGAGEMENT':
            await updateEngagement(action.id, action.data);
            break;
          case 'CREATE_FINDING':
            await createFinding(action.engagementId, action.data);
            break;
          case 'AUDIT_LOG':
            await logAuditEntry(action.engagementId, action.action, action.details);
            break;
          default:
            // For unknown action types, try a generic API call
            console.warn(`Unknown sync action type: ${action.type}`);
        }

        item.status = 'synced';
        item.syncedAt = new Date().toISOString();

        this.emit('action:synced', item);
      } catch (error) {
        item.retries += 1;
        item.status = item.retries < 3 ? 'retrying' : 'failed';
        item.lastError = error.message;

        if (item.retries >= 3) {
          this.emit('action:failed', item);
        }
      }
    }

    // Clean up synced items
    for (const [actionId, item] of this.queue) {
      if (item.status === 'synced') {
        this.queue.delete(actionId);
      }
    }

    this.syncInProgress = false;
    this.emit('sync:completed', { syncedCount: this.queue.size });
  }

  /**
   * Handle connectivity restored
   */
  async handleOnline() {
    this.isOnline = true;
    this.emit('connectivity:online');

    // Auto-sync pending actions
    if (this.queue.size > 0) {
      await this.syncQueue();
    }
  }

  /**
   * Handle connectivity lost
   */
  handleOffline() {
    this.isOnline = false;
    this.emit('connectivity:offline');
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      queuedCount: this.queue.size,
      syncInProgress: this.syncInProgress,
      pendingActions: Array.from(this.queue.values()).filter(item => item.status !== 'synced')
    };
  }

  /**
   * Get local cache
   */
  getLocalCache(key) {
    try {
      return JSON.parse(localStorage.getItem(`audit_${key}`));
    } catch {
      return null;
    }
  }

  /**
   * Save to local cache
   */
  saveToLocalCache(key, data) {
    try {
      localStorage.setItem(`audit_${key}`, JSON.stringify(data));
      this.emit('cache:saved', { key, size: JSON.stringify(data).length });
    } catch (error) {
      console.error('Cache save failed:', error);
      this.emit('cache:error', { key, error: error.message });
    }
  }

  /**
   * Event emitter methods
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

export default new OfflineSyncService();
