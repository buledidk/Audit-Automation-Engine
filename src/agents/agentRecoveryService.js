/**
 * Agent Recovery Service
 * Tracks agent failure history and implements auto-restart policy:
 * 1st failure: Immediate restart
 * 2nd failure: Wait 5s then restart
 * 3rd failure: Wait 30s then restart
 * 4+ failures: Alert admin, disable agent until manual reset
 */

import EventEmitter from 'events';
import agentMonitoringService from './agentMonitoringService.js';
import selfHealingService from '../services/selfHealingService.js';

class AgentRecoveryService extends EventEmitter {
  constructor() {
    super();
    this.failureHistory = new Map();
    this.recoveryPolicy = {
      1: { waitMs: 0, description: 'Immediate restart' },
      2: { waitMs: 5000, description: 'Wait 5s then restart' },
      3: { waitMs: 30000, description: 'Wait 30s then restart' },
      4: { waitMs: null, description: 'Disable - requires manual reset' }
    };

    // Subscribe to agent failures
    agentMonitoringService.on('agent:failed', this.onAgentFailure.bind(this));
    selfHealingService.on('recovery:succeeded', this.onRecoverySuccess.bind(this));
  }

  /**
   * Handle agent failure and determine recovery action
   */
  onAgentFailure(data) {
    const { agentName, error } = data;

    // Get failure count
    const failures = this.getFailureCount(agentName);
    const nextFailureCount = failures + 1;

    // Record failure
    this.recordFailure(agentName, error);

    // Get recovery policy for this failure count
    const policy = this.recoveryPolicy[nextFailureCount] || this.recoveryPolicy[4];

    console.log(`⚠️  Agent failure #${nextFailureCount} for ${agentName}`);
    console.log(`   Policy: ${policy.description}`);

    if (nextFailureCount >= 4) {
      // Disable agent and escalate
      this.disableAgent(agentName, error);
    } else {
      // Apply recovery policy
      this.applyRecoveryPolicy(agentName, nextFailureCount, policy.waitMs);
    }

    this.emit('failure:recorded', {
      agentName,
      failureCount: nextFailureCount,
      policy: policy.description,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Record failure in history
   */
  recordFailure(agentName, error) {
    if (!this.failureHistory.has(agentName)) {
      this.failureHistory.set(agentName, []);
    }

    const history = this.failureHistory.get(agentName);
    history.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      stackTrace: error.stack
    });

    // Keep only last 50 failures per agent
    if (history.length > 50) {
      history.shift();
    }
  }

  /**
   * Apply recovery policy based on failure count
   */
  async applyRecoveryPolicy(agentName, failureCount, waitMs) {
    if (waitMs !== null) {
      console.log(`🔄 Applying recovery policy for ${agentName}: ${this.recoveryPolicy[failureCount].description}`);

      if (waitMs > 0) {
        console.log(`   Waiting ${waitMs}ms before restart...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }

      // Trigger recovery through self-healing service
      // This will be handled by selfHealingService.attemptRecovery()
      console.log(`   Attempting restart of ${agentName}...`);
    }
  }

  /**
   * Disable agent and escalate to admin
   */
  disableAgent(agentName, _error) {
    console.error(`🚨 DISABLED: ${agentName} - Too many failures`);

    const agent = agentMonitoringService.agents.get(agentName);
    if (agent) {
      agent.healthy = false;
      agent.status = 'disabled';
    }

    agentMonitoringService.createAlert(
      'critical',
      `Agent ${agentName} has been DISABLED after 3 failed recovery attempts. Manual intervention required.`
    );

    this.emit('agent:disabled', {
      agentName,
      reason: 'Too many failures',
      failureCount: this.getFailureCount(agentName),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle successful recovery
   */
  onRecoverySuccess(data) {
    const { agentName } = data;

    // Reset failure count on successful recovery
    this.failureHistory.delete(agentName);

    // Re-enable agent if it was disabled
    const agent = agentMonitoringService.agents.get(agentName);
    if (agent && agent.status === 'disabled') {
      agent.status = 'idle';
      agent.healthy = true;
      console.log(`✅ Re-enabled ${agentName} after successful recovery`);
    }

    this.emit('failure:resolved', {
      agentName,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get failure count for agent
   */
  getFailureCount(agentName) {
    const history = this.failureHistory.get(agentName);
    return history ? history.length : 0;
  }

  /**
   * Get failure history for agent
   */
  getFailureHistory(agentName) {
    return this.failureHistory.get(agentName) || [];
  }

  /**
   * Reset failure count for agent (admin action)
   */
  resetFailureCount(agentName) {
    this.failureHistory.delete(agentName);

    // Re-enable agent
    const agent = agentMonitoringService.agents.get(agentName);
    if (agent) {
      agent.status = 'idle';
      agent.healthy = true;
    }

    // Reset circuit breaker
    selfHealingService.resetCircuitBreaker(agentName);

    this.emit('failure:reset', {
      agentName,
      timestamp: new Date().toISOString()
    });

    console.log(`🔧 Failure count reset for ${agentName}`);
  }

  /**
   * Get recovery statistics for all agents
   */
  getAllFailureStatistics() {
    const stats = [];

    for (const [agentName, history] of this.failureHistory.entries()) {
      stats.push({
        agentName,
        totalFailures: history.length,
        lastFailure: history[history.length - 1]?.timestamp,
        recentFailures: history.slice(-5),
        recoveryPolicy: this.getRecoveryPolicy(history.length)
      });
    }

    return stats;
  }

  /**
   * Get recovery policy description
   */
  getRecoveryPolicy(failureCount) {
    return this.recoveryPolicy[Math.min(failureCount, 4)].description;
  }

  /**
   * Get agents requiring manual intervention
   */
  getDisabledAgents() {
    const failureStats = this.getAllFailureStatistics();
    return failureStats.filter(stat => stat.totalFailures >= 4).map(stat => stat.agentName);
  }

  /**
   * Get recovery status summary
   */
  getRecoverySummary() {
    const failureStats = this.getAllFailureStatistics();

    return {
      timestamp: new Date().toISOString(),
      totalAgents: agentMonitoringService.agents.size,
      agentsWithFailures: failureStats.length,
      disabledAgents: this.getDisabledAgents(),
      failureStatistics: failureStats,
      summary: {
        totalFailures: failureStats.reduce((sum, s) => sum + s.totalFailures, 0),
        failureRate: failureStats.length > 0 ? `${Math.round((failureStats.length / agentMonitoringService.agents.size) * 100)}%` : '0%',
        disabledCount: this.getDisabledAgents().length,
        requiresAttention: this.getDisabledAgents().length > 0
      }
    };
  }

  /**
   * Export recovery data for analysis
   */
  exportRecoveryData() {
    return {
      timestamp: new Date().toISOString(),
      failureHistory: Object.fromEntries(this.failureHistory),
      recoveryPolicies: this.recoveryPolicy,
      summary: this.getRecoverySummary()
    };
  }
}

export default new AgentRecoveryService();
