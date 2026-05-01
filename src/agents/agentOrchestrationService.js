/**
 * Agent Orchestration Service
 * Coordinates execution of 6 specialized AI agents with real-time progress tracking
 * Implements ISA 220 Quality Control principles
 */

class AgentOrchestrationService {
  constructor() {
    this.agents = new Map();
    this.activeWorkflow = null;
    this.executionHistory = [];
    this.listeners = new Map();
    this.initializeAgents();
  }

  initializeAgents() {
    const agentNames = [
      'SupervisorAgent',
      'CodeAnalystAgent',
      'SecurityAgent',
      'ComplianceAgent',
      'DocumentationAgent',
      'TestingAgent'
    ];

    agentNames.forEach(name => {
      this.agents.set(name, {
        name,
        status: 'idle',
        progress: 0,
        currentTask: '',
        startTime: null,
        endTime: null,
        tokensUsed: 0,
        result: null,
        error: null
      });
    });
  }

  /**
   * Coordinate agents for task execution
   */
  async coordinateAgents(agentList, engagement) {
    console.log(`🤖 Orchestrating ${agentList.length} agents...`);

    this.emit('workflow:started', {
      agentCount: agentList.length,
      engagement: engagement.id,
      timestamp: new Date().toISOString()
    });

    const results = [];

    for (const agentName of agentList) {
      try {
        const agent = this.agents.get(agentName);
        if (!agent) continue;

        agent.status = 'running';
        agent.startTime = new Date();

        this.emit('agent:started', { agentName });

        // Simulate agent execution with progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          agent.progress = progress;
          agent.currentTask = `Executing ${agentName} (${progress}%)...`;

          this.emit('agent:progress', {
            agentName,
            progress,
            currentTask: agent.currentTask,
            tokensUsed: Math.floor(progress * 50)
          });

          await new Promise(r => setTimeout(r, 200));
        }

        agent.status = 'completed';
        agent.endTime = new Date();
        agent.tokensUsed = 1500 + Math.random() * 1000;

        const result = {
          agentName,
          status: 'completed',
          duration: (agent.endTime - agent.startTime) / 1000,
          tokensUsed: agent.tokensUsed,
          findings: this.generateSampleFindings(agentName),
          timestamp: new Date().toISOString()
        };

        agent.result = result;
        results.push(result);

        this.emit('agent:completed', result);
      } catch (error) {
        const agent = this.agents.get(agentName);
        agent.status = 'failed';
        agent.error = error.message;

        this.emit('agent:failed', {
          agentName,
          error: error.message
        });
      }
    }

    this.activeWorkflow = {
      agents: agentList,
      results,
      completedAt: new Date().toISOString()
    };

    this.executionHistory.push(this.activeWorkflow);

    this.emit('workflow:completed', {
      totalAgents: agentList.length,
      successfulAgents: results.filter(r => r.status === 'completed').length,
      results
    });

    return results;
  }

  /**
   * Generate sample findings for demonstration
   */
  generateSampleFindings(agentName) {
    const findingsMap = {
      'SupervisorAgent': [
        { type: 'task-breakdown', description: 'Engagement properly structured' },
        { type: 'risk-assessment', description: 'Initial risk assessment complete' }
      ],
      'SecurityAgent': [
        { type: 'vulnerability', description: 'No critical security issues found', severity: 'low' }
      ],
      'ComplianceAgent': [
        { type: 'compliance-check', description: 'GDPR requirements met', status: 'compliant' }
      ],
      'DocumentationAgent': [
        { type: 'doc-generated', description: 'Audit procedures documented' }
      ]
    };

    return findingsMap[agentName] || [];
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentName) {
    return this.agents.get(agentName);
  }

  /**
   * Get all active agents
   */
  getActiveAgents() {
    return Array.from(this.agents.values()).filter(a => a.status === 'running' || a.status === 'queued');
  }

  /**
   * Get workflow summary
   */
  getWorkflowSummary() {
    if (!this.activeWorkflow) return null;

    return {
      agentCount: this.activeWorkflow.agents.length,
      completedAgents: this.activeWorkflow.results.length,
      totalTokensUsed: this.activeWorkflow.results.reduce((sum, r) => sum + r.tokensUsed, 0),
      totalDuration: this.activeWorkflow.results.reduce((sum, r) => sum + r.duration, 0),
      completedAt: this.activeWorkflow.completedAt
    };
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

  /**
   * Get execution history
   */
  getExecutionHistory() {
    return this.executionHistory;
  }
}

export default new AgentOrchestrationService();
