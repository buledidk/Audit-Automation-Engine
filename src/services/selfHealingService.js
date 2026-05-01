/**
 * Self-Healing Service
 * Automatically detects and recovers from failures with circuit breaker pattern,
 * exponential backoff, and escalation to admin when necessary
 */

import EventEmitter from 'events';
import agentMonitoringService from './agentMonitoringService.js';

class SelfHealingService extends EventEmitter {
  constructor() {
    super();
    this.recoveryAttempts = new Map();
    this.circuitBreakers = new Map();
    this.escalationQueue = [];
    this.autoRecoveryEnabled = true;
    this.maxRecoveryAttempts = 3;
    this.baseBackoffMs = 1000;

    // Subscribe to agent failures
    agentMonitoringService.on('agent:failed', this.onAgentFailure.bind(this));
    agentMonitoringService.on('alert:created', this.onAlertCreated.bind(this));
  }

  /**
   * Handle agent failure with auto-recovery
   */
  onAgentFailure(data) {
    if (!this.autoRecoveryEnabled) return;

    const { agentName, error, _executionTime } = data;

    console.log(`🔄 Self-healing triggered for: ${agentName}`);

    // Get recovery attempt count
    const attempts = this.recoveryAttempts.get(agentName) || 0;

    if (attempts >= this.maxRecoveryAttempts) {
      // Escalate to admin after max attempts
      this.escalateToAdmin(agentName, error, attempts);
      return;
    }

    // Attempt recovery with exponential backoff
    this.attemptRecovery(agentName, attempts + 1);
  }

  /**
   * Attempt to recover a failed agent
   */
  async attemptRecovery(agentName, attemptNumber) {
    const backoffMs = this.baseBackoffMs * Math.pow(2, attemptNumber - 1);

    console.log(`🔄 Recovery attempt ${attemptNumber}/${this.maxRecoveryAttempts} for ${agentName}`);
    console.log(`   Wait time: ${backoffMs}ms`);

    this.recoveryAttempts.set(agentName, attemptNumber);

    // Create recovery event
    this.emit('recovery:started', {
      agentName,
      attemptNumber,
      backoffMs,
      timestamp: new Date().toISOString()
    });

    // Wait before attempting recovery
    await new Promise(resolve => setTimeout(resolve, backoffMs));

    // Attempt to restart agent
    try {
      await this.restartAgent(agentName);

      // Reset recovery attempts on success
      this.recoveryAttempts.delete(agentName);

      this.emit('recovery:succeeded', {
        agentName,
        attemptNumber,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Recovery succeeded for ${agentName}`);

      // Clear circuit breaker
      this.circuitBreakers.delete(agentName);
    } catch (error) {
      this.emit('recovery:failed', {
        agentName,
        attemptNumber,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      console.error(`❌ Recovery attempt ${attemptNumber} failed for ${agentName}: ${error.message}`);

      // Try next recovery attempt if not exceeded max
      if (attemptNumber < this.maxRecoveryAttempts) {
        this.attemptRecovery(agentName, attemptNumber + 1);
      } else {
        // Escalate after final failure
        this.escalateToAdmin(agentName, error, attemptNumber);
      }
    }
  }

  /**
   * Restart an agent (stub - would call actual agent restart)
   */
  async restartAgent(agentName) {
    // In production, this would call the actual agent restart endpoint
    // For now, simulate restart
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 80% success rate for demo
        if (Math.random() < 0.8) {
          resolve({ agentName, restarted: true });
        } else {
          reject(new Error(`Failed to restart ${agentName}`));
        }
      }, 500);
    });
  }

  /**
   * Escalate unrecoverable failures to admin
   */
  escalateToAdmin(agentName, error, attemptNumber) {
    const escalation = {
      id: `escalation-${Date.now()}`,
      agentName,
      error: error.message,
      attemptsFailed: attemptNumber,
      timestamp: new Date().toISOString(),
      status: 'open',
      severity: 'critical',
      actionRequired: `Agent ${agentName} failed after ${attemptNumber} recovery attempts. Manual intervention required.`,
      suggestedActions: [
        `Check agent logs for error details`,
        `Verify external dependencies (APIs, databases)`,
        `Review agent configuration`,
        `Restart service manually if needed`
      ]
    };

    this.escalationQueue.push(escalation);

    // Set circuit breaker to disable auto-restart
    this.circuitBreakers.set(agentName, {
      open: true,
      failureCount: attemptNumber,
      lastFailure: new Date().toISOString(),
      status: 'Agent disabled - waiting for manual action'
    });

    this.emit('escalation:created', escalation);

    // Log critical alert
    agentMonitoringService.createAlert(
      'critical',
      `Agent ${agentName} requires manual intervention - failed ${attemptNumber} recovery attempts`
    );

    console.error(`🚨 ESCALATION: ${agentName} requires manual action after ${attemptNumber} failed recovery attempts`);

    return escalation;
  }

  /**
   * Handle system alerts and trigger recovery if needed
   */
  onAlertCreated(alert) {
    if (alert.severity === 'error' || alert.severity === 'critical') {
      // Check if alert indicates a recoverable issue
      if (alert.message.includes('timeout') || alert.message.includes('connection')) {
        // Could trigger automatic recovery for connection issues
      }
    }
  }

  /**
   * Get circuit breaker status for agent
   */
  getCircuitBreakerStatus(agentName) {
    return this.circuitBreakers.get(agentName) || null;
  }

  /**
   * Reset circuit breaker (admin action)
   */
  resetCircuitBreaker(agentName) {
    this.circuitBreakers.delete(agentName);
    this.recoveryAttempts.delete(agentName);

    this.emit('circuit-breaker:reset', {
      agentName,
      timestamp: new Date().toISOString()
    });

    console.log(`🔧 Circuit breaker reset for ${agentName}`);

    // Re-enable automatic recovery
    this.attemptRecovery(agentName, 1);
  }

  /**
   * Get escalation queue
   */
  getEscalationQueue() {
    return this.escalationQueue;
  }

  /**
   * Resolve escalation (admin closes ticket)
   */
  resolveEscalation(escalationId, resolution) {
    const escalation = this.escalationQueue.find(e => e.id === escalationId);
    if (!escalation) return null;

    escalation.status = 'resolved';
    escalation.resolution = resolution;
    escalation.resolvedAt = new Date().toISOString();

    this.emit('escalation:resolved', escalation);

    console.log(`✅ Escalation resolved: ${escalationId}`);

    return escalation;
  }

  /**
   * Enable/disable auto-recovery
   */
  setAutoRecovery(enabled) {
    this.autoRecoveryEnabled = enabled;
    this.emit('auto-recovery:toggled', { enabled });
    console.log(`${enabled ? '✅ Enabled' : '❌ Disabled'} automatic recovery`);
  }

  /**
   * Get self-healing status
   */
  getStatus() {
    return {
      timestamp: new Date().toISOString(),
      autoRecoveryEnabled: this.autoRecoveryEnabled,
      activeRecoveries: Array.from(this.recoveryAttempts.entries()).map(([agent, attempt]) => ({
        agent,
        currentAttempt: attempt,
        maxAttempts: this.maxRecoveryAttempts
      })),
      openCircuitBreakers: Array.from(this.circuitBreakers.entries()).map(([agent, status]) => ({
        agent,
        ...status
      })),
      escalationQueue: this.escalationQueue,
      openEscalations: this.escalationQueue.filter(e => e.status === 'open').length,
      totalEscalations: this.escalationQueue.length
    };
  }

  /**
   * Get recovery statistics
   */
  getRecoveryStatistics() {
    // In production, would track recovery success rates, average recovery time, etc.
    return {
      timestamp: new Date().toISOString(),
      totalRecoveryAttempts: Array.from(this.recoveryAttempts.values()).reduce((sum, v) => sum + v, 0),
      totalEscalations: this.escalationQueue.length,
      resolvedEscalations: this.escalationQueue.filter(e => e.status === 'resolved').length,
      openEscalations: this.escalationQueue.filter(e => e.status === 'open').length,
      averageRecoveryAttempts: this.recoveryAttempts.size > 0
        ? Array.from(this.recoveryAttempts.values()).reduce((sum, v) => sum + v, 0) / this.recoveryAttempts.size
        : 0
    };
  }
}

export default new SelfHealingService();
