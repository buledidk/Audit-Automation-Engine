/**
 * Agent Monitoring Service
 * Real-time tracking of all 9 agents with execution metrics, status indicators,
 * and performance alerts for autonomous operation and self-healing
 */

import EventEmitter from 'events';

class AgentMonitoringService extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.executionHistory = new Map();
    this.performanceMetrics = new Map();
    this.alerts = [];
    this.lastHealthCheck = null;

    // Initialize agent registry
    this.initializeAgents();
  }

  initializeAgents() {
    const agentNames = [
      'SupervisorAgent',
      'CodeAnalystAgent',
      'SecurityAgent',
      'DocumentationAgent',
      'ComplianceAgent',
      'TestingAgent',
      'AIProcedureEngine',
      'ExceptionPredictionEngine',
      'JurisdictionEngine',
      'MaterialityEngine',
      'ReportGenerationAgent',
      'RiskAssessmentAgent',
      'EvidenceAnalysisAgent',
      'WorkflowAssistantAgent'
    ];

    agentNames.forEach(agentName => {
      this.agents.set(agentName, {
        name: agentName,
        status: 'idle', // idle, running, completed, failed, blocked
        progress: 0,
        currentTask: null,
        startTime: null,
        endTime: null,
        tokensUsed: 0,
        lastExecution: null,
        executionCount: 0,
        failureCount: 0,
        averageExecutionTime: 0,
        averageTokensUsed: 0,
        lastError: null,
        healthy: true,
        uptime: 100 // percentage
      });

      this.executionHistory.set(agentName, []);
      this.performanceMetrics.set(agentName, {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        totalTokensUsed: 0,
        totalExecutionTime: 0,
        averageLatency: 0,
        p95Latency: 0,
        p99Latency: 0,
        successRate: 100
      });
    });

    console.log(`✅ Initialized monitoring for ${agentNames.length} agents`);
  }

  /**
   * Record agent execution start
   */
  recordAgentStart(agentName, task) {
    const agent = this.agents.get(agentName);
    if (!agent) {
      console.warn(`⚠️ Unknown agent: ${agentName}`);
      return;
    }

    agent.status = 'running';
    agent.progress = 0;
    agent.currentTask = task;
    agent.startTime = Date.now();
    agent.tokensUsed = 0;

    this.emit('agent:started', { agentName, task, timestamp: new Date().toISOString() });
    console.log(`▶️  Agent started: ${agentName} - Task: ${task}`);
  }

  /**
   * Update agent progress
   */
  updateAgentProgress(agentName, progress, currentTask = null) {
    const agent = this.agents.get(agentName);
    if (!agent) return;

    agent.progress = Math.min(progress, 100);
    if (currentTask) agent.currentTask = currentTask;

    this.emit('agent:progress', {
      agentName,
      progress: agent.progress,
      currentTask: agent.currentTask,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update token usage for current execution
   */
  updateTokenUsage(agentName, tokens) {
    const agent = this.agents.get(agentName);
    if (!agent) return;

    agent.tokensUsed += tokens;
    this.emit('agent:tokens', { agentName, tokens, total: agent.tokensUsed });
  }

  /**
   * Record agent execution completion
   */
  recordAgentCompletion(agentName, result, tokensUsed = 0) {
    const agent = this.agents.get(agentName);
    if (!agent) return;

    agent.status = 'completed';
    agent.progress = 100;
    agent.endTime = Date.now();
    agent.tokensUsed = tokensUsed;
    agent.lastExecution = new Date().toISOString();
    agent.executionCount++;

    const executionTime = agent.endTime - agent.startTime;

    // Record in history
    const history = this.executionHistory.get(agentName);
    history.push({
      timestamp: agent.lastExecution,
      duration: executionTime,
      tokens: tokensUsed,
      status: 'completed',
      result
    });

    // Keep only last 100 executions
    if (history.length > 100) {
      history.shift();
    }

    // Update metrics
    this.updateMetrics(agentName, executionTime, tokensUsed, true);

    this.emit('agent:completed', {
      agentName,
      result,
      executionTime,
      tokensUsed,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Agent completed: ${agentName} - Time: ${executionTime}ms - Tokens: ${tokensUsed}`);
  }

  /**
   * Record agent failure
   */
  recordAgentFailure(agentName, error) {
    const agent = this.agents.get(agentName);
    if (!agent) return;

    agent.status = 'failed';
    agent.endTime = Date.now();
    agent.lastError = error.message;
    agent.failureCount++;

    const executionTime = agent.endTime - agent.startTime;

    // Record in history
    const history = this.executionHistory.get(agentName);
    history.push({
      timestamp: new Date().toISOString(),
      duration: executionTime,
      status: 'failed',
      error: error.message
    });

    // Update metrics
    this.updateMetrics(agentName, executionTime, 0, false);

    // Create alert
    this.createAlert('error', `Agent ${agentName} failed: ${error.message}`);

    this.emit('agent:failed', {
      agentName,
      error: error.message,
      executionTime,
      timestamp: new Date().toISOString()
    });

    console.error(`❌ Agent failed: ${agentName} - Error: ${error.message}`);
  }

  /**
   * Update performance metrics
   */
  updateMetrics(agentName, executionTime, tokensUsed, success) {
    const metrics = this.performanceMetrics.get(agentName);
    if (!metrics) return;

    metrics.totalExecutions++;

    if (success) {
      metrics.successfulExecutions++;
      metrics.totalExecutionTime += executionTime;
      metrics.totalTokensUsed += tokensUsed;
      metrics.averageLatency = Math.round(metrics.totalExecutionTime / metrics.successfulExecutions);
    } else {
      metrics.failedExecutions++;
    }

    metrics.successRate = Math.round((metrics.successfulExecutions / metrics.totalExecutions) * 100);

    // Calculate percentiles (simplified - in production use proper histogram)
    const history = this.executionHistory.get(agentName);
    if (history.length > 0) {
      const times = history
        .filter(h => h.status === 'completed')
        .map(h => h.duration)
        .sort((a, b) => a - b);

      if (times.length > 0) {
        metrics.p95Latency = times[Math.floor(times.length * 0.95)];
        metrics.p99Latency = times[Math.floor(times.length * 0.99)];
      }
    }
  }

  /**
   * Get status of all agents
   */
  getAllAgentStatuses() {
    return Array.from(this.agents.values()).map(agent => ({
      ...agent,
      metrics: this.performanceMetrics.get(agent.name)
    }));
  }

  /**
   * Get single agent status
   */
  getAgentStatus(agentName) {
    const agent = this.agents.get(agentName);
    if (!agent) return null;

    return {
      ...agent,
      metrics: this.performanceMetrics.get(agentName),
      history: this.executionHistory.get(agentName)
    };
  }

  /**
   * Get agent execution history
   */
  getAgentHistory(agentName, limit = 20) {
    const history = this.executionHistory.get(agentName);
    if (!history) return [];

    return history.slice(-limit).reverse();
  }

  /**
   * Get system health summary
   */
  getSystemHealth() {
    const agents = Array.from(this.agents.values());
    const totalAgents = agents.length;
    const healthyAgents = agents.filter(a => a.healthy).length;
    const runningAgents = agents.filter(a => a.status === 'running').length;
    const failedAgents = agents.filter(a => a.status === 'failed').length;

    const totalMetrics = Array.from(this.performanceMetrics.values());
    const avgSuccessRate = Math.round(
      totalMetrics.reduce((sum, m) => sum + m.successRate, 0) / totalMetrics.length
    );

    return {
      timestamp: new Date().toISOString(),
      totalAgents,
      healthyAgents,
      runningAgents,
      failedAgents,
      systemHealth: healthyAgents === totalAgents ? 'healthy' : 'degraded',
      overallSuccessRate: avgSuccessRate,
      alerts: this.alerts.slice(-10), // Last 10 alerts
      agentStatuses: agents.map(a => ({
        name: a.name,
        status: a.status,
        healthy: a.healthy,
        executionCount: a.executionCount,
        failureCount: a.failureCount,
        successRate: this.performanceMetrics.get(a.name).successRate
      }))
    };
  }

  /**
   * Create system alert
   */
  createAlert(severity, message) {
    const alert = {
      id: `alert-${Date.now()}`,
      severity, // info, warning, error, critical
      message,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    this.emit('alert:created', alert);
    console.log(`⚠️  [${severity.toUpperCase()}] ${message}`);

    return alert;
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alert:acknowledged', alert);
    }
  }

  /**
   * Perform health check on all agents
   */
  async performHealthCheck() {
    console.log('🏥 Performing system health check...');
    this.lastHealthCheck = new Date().toISOString();

    const agents = Array.from(this.agents.values());
    const issuesFound = [];

    for (const agent of agents) {
      // Check for stuck agents
      if (agent.status === 'running' && agent.startTime) {
        const runningTime = Date.now() - agent.startTime;
        if (runningTime > 5 * 60 * 1000) { // 5 minutes
          agent.healthy = false;
          issuesFound.push(`Agent ${agent.name} appears stuck (running for ${Math.round(runningTime / 1000)}s)`);
          this.createAlert('warning', `Agent ${agent.name} may be stuck`);
        }
      }

      // Check for high failure rate
      const metrics = this.performanceMetrics.get(agent.name);
      if (metrics && metrics.totalExecutions > 5 && metrics.successRate < 50) {
        agent.healthy = false;
        issuesFound.push(`Agent ${agent.name} has low success rate: ${metrics.successRate}%`);
        this.createAlert('warning', `Agent ${agent.name} has ${metrics.successRate}% success rate`);
      }

      // Update uptime
      if (agent.healthy) {
        agent.uptime = 100;
      } else {
        agent.uptime = Math.max(0, agent.uptime - 20);
      }
    }

    const health = this.getSystemHealth();
    this.emit('health:checked', {
      health,
      issuesFound,
      timestamp: this.lastHealthCheck
    });

    if (issuesFound.length === 0) {
      console.log('✅ System health check: All agents healthy');
    } else {
      console.log('⚠️  System health check: Issues found:');
      issuesFound.forEach(issue => console.log(`   - ${issue}`));
    }

    return health;
  }

  /**
   * Get detailed performance report
   */
  getPerformanceReport() {
    const metrics = Array.from(this.performanceMetrics.entries());
    const report = {
      timestamp: new Date().toISOString(),
      agentMetrics: metrics.map(([name, data]) => ({
        agent: name,
        ...data,
        lastExecution: this.agents.get(name).lastExecution
      })),
      summary: {
        totalExecutions: metrics.reduce((sum, [, m]) => sum + m.totalExecutions, 0),
        totalTokensUsed: metrics.reduce((sum, [, m]) => sum + m.totalTokensUsed, 0),
        overallSuccessRate: Math.round(
          metrics.reduce((sum, [, m]) => sum + m.successRate, 0) / metrics.length
        ),
        topPerformers: metrics
          .sort((a, b) => b[1].successRate - a[1].successRate)
          .slice(0, 3)
          .map(([name]) => name),
        needsAttention: metrics
          .filter(([, m]) => m.successRate < 80)
          .map(([name]) => name)
      }
    };

    return report;
  }

  /**
   * Export monitoring data
   */
  exportMonitoringData() {
    return {
      timestamp: new Date().toISOString(),
      agents: Array.from(this.agents.values()),
      executionHistory: Object.fromEntries(this.executionHistory),
      performanceMetrics: Object.fromEntries(this.performanceMetrics),
      alerts: this.alerts,
      systemHealth: this.getSystemHealth(),
      performanceReport: this.getPerformanceReport()
    };
  }
}

export default new AgentMonitoringService();
