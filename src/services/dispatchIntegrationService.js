/**
 * dispatchIntegrationService.js
 *
 * Multi-platform dispatch integration service
 * Enables audit orchestration access from mobile, web, CLI, and terminal
 * Synchronizes work across devices and platforms in real-time
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import auditOrchestrationEngine from './auditOrchestrationEngine.js';

export class DispatchIntegrationService {
  constructor() {
    this.dispatchQueue = [];
    this.activeDispatch = new Map();
    this.syncState = new Map();
    this.platforms = ['web', 'mobile', 'cli', 'terminal', 'api', 'voice'];
  }

  /**
   * Initialize dispatch session from any platform
   * @param {object} sessionData - Session initialization details
   * @returns {object} Dispatch session ready for operations
   */
  initializeDispatchSession(sessionData) {
    const {
      platform = 'web',
      deviceId,
      userId,
      userName,
      engagementId,
      engagementData
    } = sessionData;

    console.log(`\n📱 DISPATCH: Initializing session`);
    console.log(`   Platform: ${platform}`);
    console.log(`   Device: ${deviceId}`);
    console.log(`   User: ${userName}`);

    const sessionId = `dispatch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      sessionId,
      platform,
      deviceId,
      userId,
      userName,
      engagementId,
      engagementData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active',
      operations: []
    };

    this.activeDispatch.set(sessionId, session);
    this.syncState.set(sessionId, {
      lastSync: new Date().toISOString(),
      pendingSync: false,
      syncedOperations: 0
    });

    console.log(`   ✅ Dispatch Session: ${sessionId}`);

    return {
      success: true,
      sessionId,
      session,
      message: 'Dispatch session initialized'
    };
  }

  /**
   * Queue audit operation from dispatch
   * Supports all platforms with auto-sync
   * @param {object} operationData - Operation details
   * @returns {object} Queued operation confirmation
   */
  queueOperation(operationData) {
    const {
      sessionId,
      operationType,
      operationData: data,
      platform = 'web',
      offline = false
    } = operationData;

    const session = this.activeDispatch.get(sessionId);
    if (!session) {
      return { success: false, message: 'Invalid session ID' };
    }

    const operation = {
      operationId: `op-${Date.now()}`,
      sessionId,
      platform,
      operationType,
      data,
      status: offline ? 'queued_offline' : 'queued',
      createdAt: new Date().toISOString(),
      executedAt: null,
      result: null
    };

    this.dispatchQueue.push(operation);
    session.operations.push(operation.operationId);
    session.lastActivity = new Date().toISOString();

    console.log(`   📋 Operation Queued: ${operationType} (${operation.operationId})`);

    return {
      success: true,
      operationId: operation.operationId,
      status: operation.status,
      message: `Operation queued: ${operationType}`
    };
  }

  /**
   * Execute queued operations from dispatch
   * Executes all pending operations in order
   * @param {string} sessionId - Dispatch session ID
   * @returns {array} Execution results
   */
  async executeQueuedOperations(sessionId) {
    const session = this.activeDispatch.get(sessionId);
    if (!session) {
      return { success: false, message: 'Invalid session ID' };
    }

    console.log(`\n⚙️ DISPATCH: Executing queued operations`);
    console.log(`   Session: ${sessionId}`);

    const pendingOps = this.dispatchQueue.filter(
      op => op.sessionId === sessionId && op.status.startsWith('queued')
    );

    console.log(`   Operations to execute: ${pendingOps.length}`);

    const results = [];

    for (const operation of pendingOps) {
      try {
        let result;

        // Route operation to appropriate handler
        switch (operation.operationType) {
          case 'SECTION_OPEN':
            result = await auditOrchestrationEngine.executeSectionOpen(operation.data);
            break;
          case 'PROCEDURE_EXECUTE':
            result = await auditOrchestrationEngine.executeProcedure(operation.data);
            break;
          case 'EVIDENCE_LINK':
            result = await auditOrchestrationEngine.linkEvidence(operation.data);
            break;
          case 'SECTION_SUBMIT':
            result = await auditOrchestrationEngine.submitForReview(operation.data);
            break;
          default:
            result = { success: false, message: `Unknown operation type: ${operation.operationType}` };
        }

        operation.status = 'executed';
        operation.executedAt = new Date().toISOString();
        operation.result = result;

        results.push({
          operationId: operation.operationId,
          type: operation.operationType,
          success: result.success,
          result
        });

        console.log(`   ✅ ${operation.operationType}: ${result.success ? 'Success' : 'Failed'}`);
      } catch (error) {
        operation.status = 'failed';
        operation.executedAt = new Date().toISOString();
        operation.result = { success: false, message: error.message };

        results.push({
          operationId: operation.operationId,
          type: operation.operationType,
          success: false,
          error: error.message
        });

        console.log(`   ❌ ${operation.operationType}: ${error.message}`);
      }
    }

    // Update sync state
    const syncState = this.syncState.get(sessionId);
    syncState.lastSync = new Date().toISOString();
    syncState.syncedOperations += results.length;

    session.lastActivity = new Date().toISOString();

    return {
      success: true,
      sessionId,
      operationsExecuted: results.length,
      results,
      message: `${results.length} operations executed`
    };
  }

  /**
   * Sync dispatch session with server
   * Handles offline operations and device synchronization
   * @param {string} sessionId - Dispatch session ID
   * @returns {object} Sync confirmation
   */
  async syncDispatchSession(sessionId) {
    const session = this.activeDispatch.get(sessionId);
    if (!session) {
      return { success: false, message: 'Invalid session ID' };
    }

    console.log(`\n🔄 DISPATCH: Syncing session`);
    console.log(`   Platform: ${session.platform}`);
    console.log(`   Engagement: ${session.engagementId}`);

    // Execute any pending operations
    const executionResult = await this.executeQueuedOperations(sessionId);

    // Sync status
    const syncState = this.syncState.get(sessionId);
    syncState.lastSync = new Date().toISOString();
    syncState.pendingSync = false;

    session.lastActivity = new Date().toISOString();

    console.log(`   ✅ Sync completed`);
    console.log(`   Operations synced: ${executionResult.operationsExecuted}`);

    return {
      success: true,
      sessionId,
      syncData: {
        lastSync: syncState.lastSync,
        syncedOperations: syncState.syncedOperations,
        platform: session.platform,
        engagement: session.engagementId
      }
    };
  }

  /**
   * Get dispatch status across all active sessions
   * @returns {array} Status of all active dispatch sessions
   */
  getDispatchStatus() {
    const statuses = [];

    this.activeDispatch.forEach((session, sessionId) => {
      const syncState = this.syncState.get(sessionId);
      const pendingOps = this.dispatchQueue.filter(
        op => op.sessionId === sessionId && op.status.startsWith('queued')
      );

      statuses.push({
        sessionId,
        platform: session.platform,
        user: session.userName,
        engagement: session.engagementId,
        status: session.status,
        operationsQueued: pendingOps.length,
        totalOperations: session.operations.length,
        lastActivity: session.lastActivity,
        lastSync: syncState.lastSync,
        syncState: syncState.pendingSync ? 'pending' : 'current'
      });
    });

    return statuses;
  }

  /**
   * Get real-time engagement updates for dispatch
   * Enables push notifications to multiple platforms
   * @param {string} engagementId - Engagement ID
   * @returns {object} Real-time engagement data
   */
  getRealTimeEngagementUpdates(engagementId) {
    console.log(`\n📡 DISPATCH: Getting real-time updates for ${engagementId}`);

    const engagement = auditOrchestrationEngine.getEngagementStatus(engagementId);

    return {
      success: true,
      engagement,
      timestamp: new Date().toISOString(),
      pushTo: ['web', 'mobile', 'terminal'],
      message: 'Real-time updates available'
    };
  }

  /**
   * Terminal command interface for audit operations
   * Enables CLI/terminal dispatch access
   * @param {string} sessionId - Dispatch session ID
   * @param {string} command - Terminal command
   * @returns {object} Command execution result
   */
  async executeTerminalCommand(sessionId, command) {
    const session = this.activeDispatch.get(sessionId);
    if (!session) {
      return { success: false, message: 'Invalid session ID' };
    }

    console.log(`\n💻 DISPATCH: Terminal command`);
    console.log(`   Command: ${command}`);

    const parts = command.split(' ');
    const action = parts[0];
    const params = parts.slice(1);

    let result = { success: false, message: 'Unknown command' };

    switch (action) {
      case 'open':
        result = await auditOrchestrationEngine.executeSectionOpen({
          engagementId: session.engagementId,
          sectionId: params[0],
          userId: session.userId,
          userName: session.userName
        });
        break;
      case 'export':
        result = await auditOrchestrationEngine.generateAuditExport(
          session.engagementId,
          params[0] || 'both'
        );
        break;
      case 'status':
        result = {
          success: true,
          data: auditOrchestrationEngine.getEngagementStatus(session.engagementId)
        };
        break;
      case 'help':
        result = {
          success: true,
          message: 'Available commands:',
          commands: [
            'open <fsli> - Open FSLI section',
            'export [excel|word|both] - Generate export',
            'status - Get engagement status',
            'sync - Sync dispatch session'
          ]
        };
        break;
      default:
        result = { success: false, message: `Unknown command: ${action}` };
    }

    return {
      success: result.success,
      command,
      result,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Broadcast update to all active dispatch sessions
   * Used for real-time multi-device synchronization
   * @param {string} engagementId - Engagement ID
   * @param {object} updateData - Update data to broadcast
   */
  broadcastUpdate(engagementId, updateData) {
    const affectedSessions = [];

    this.activeDispatch.forEach((session, sessionId) => {
      if (session.engagementId === engagementId) {
        session.lastActivity = new Date().toISOString();
        const syncState = this.syncState.get(sessionId);
        syncState.pendingSync = true;

        affectedSessions.push({
          sessionId,
          platform: session.platform,
          needsSync: true
        });
      }
    });

    console.log(`\n📢 DISPATCH: Broadcasting update to ${affectedSessions.length} sessions`);

    return {
      success: true,
      affectedSessions,
      updateData,
      timestamp: new Date().toISOString(),
      message: 'Update broadcasted to all active sessions'
    };
  }

  /**
   * End dispatch session
   * @param {string} sessionId - Session ID to end
   * @returns {object} Session closure confirmation
   */
  endDispatchSession(sessionId) {
    const session = this.activeDispatch.get(sessionId);
    if (!session) {
      return { success: false, message: 'Invalid session ID' };
    }

    console.log(`\n👋 DISPATCH: Ending session ${sessionId}`);

    session.status = 'closed';
    session.closedAt = new Date().toISOString();

    return {
      success: true,
      sessionId,
      message: 'Dispatch session ended',
      sessionData: {
        duration: new Date(session.closedAt) - new Date(session.createdAt),
        operations: session.operations.length,
        platform: session.platform
      }
    };
  }

  /**
   * Get dispatch version and capabilities
   * @returns {object} Service information
   */
  getServiceInfo() {
    return {
      service: 'Dispatch Integration Service',
      version: '1.0.0',
      status: 'Ready',
      platforms: this.platforms,
      activeSessions: this.activeDispatch.size,
      queuedOperations: this.dispatchQueue.filter(op => op.status.startsWith('queued')).length,
      capabilities: [
        'Multi-platform audit access',
        'Offline-first operation queuing',
        'Real-time sync across devices',
        'Terminal command interface',
        'Mobile & web dispatch',
        'Engagement monitoring',
        'Operation broadcasting'
      ],
      timestamp: new Date().toISOString()
    };
  }
}

export default new DispatchIntegrationService();
