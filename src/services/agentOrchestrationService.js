/**
 * Agent Orchestration Service
 * Bridge between Agent Framework and Audit Engine
 * Coordinates agent execution with audit context and emits progress events
 */

import { EventEmitter } from 'events';
import { AgentFramework } from '../agents/AgentFramework.js';
import { AgentRegistry } from '../agents/SpecializedAgents.js';
import { v4 as uuidv4 } from 'crypto';

export class AgentOrchestrationService extends EventEmitter {
  constructor(auditPlatformService = null) {
    super();
    this.auditPlatformService = auditPlatformService;
    this.framework = new AgentFramework();
    this.registry = new AgentRegistry(this.framework);
    this.executionHistory = [];
    this.currentWorkflow = null;
    this.setupEventBridge();
  }

  /**
   * Setup event bridge between agent framework and audit platform
   */
  setupEventBridge() {
    // Bridge agent progress events to audit platform service
    this.framework.on('task:started', (data) => {
      this.emit('agent-progress', { ...data, type: 'started' });
      if (this.auditPlatformService) {
        this.auditPlatformService.emit('agent-progress', { ...data, type: 'started' });
      }
    });

    this.framework.on('task:completed', (data) => {
      this.emit('agent-progress', { ...data, type: 'completed' });
      if (this.auditPlatformService) {
        this.auditPlatformService.emit('agent-progress', { ...data, type: 'completed' });
      }
    });

    this.framework.on('task:failed', (data) => {
      this.emit('agent-progress', { ...data, type: 'failed' });
      if (this.auditPlatformService) {
        this.auditPlatformService.emit('agent-progress', { ...data, type: 'failed' });
      }
    });
  }

  /**
   * Initialize agent with audit context
   */
  async initializeAgent(agentName, auditContext) {
    try {
      const agent = this.framework.getAgentStatus(agentName);
      if (!agent) {
        throw new Error(`Agent ${agentName} not registered`);
      }

      // Add audit context to agent's context
      const enrichedContext = {
        ...auditContext,
        compliance: {
          gdprRequired: true,
          auditTrailRequired: true,
          transparencyRequired: true
        }
      };

      return { agent, context: enrichedContext };
    } catch (error) {
      console.error(`Failed to initialize agent ${agentName}:`, error);
      throw error;
    }
  }

  /**
   * Execute a single agent task
   */
  async executeAgentTask(agentName, task, engagement, callback) {
    try {
      const taskId = uuidv4().slice(0, 8);
      const context = { engagement, compliance: { gdprRequired: true } };

      // Emit start event
      this.emit('agent-task-started', { taskId, agentName, task });

      // Execute agent task
      const result = await this.framework.executeAgentTask(agentName, task, context);

      // Record execution
      this.recordExecution({
        taskId,
        agentName,
        task,
        result: result.output,
        duration: result.executionTime,
        tokensUsed: result.tokenUsage.output_tokens
      });

      // Call callback if provided
      if (callback) {
        callback(null, result);
      }

      return result;
    } catch (error) {
      console.error(`Agent task execution failed:`, error);
      if (callback) {
        callback(error, null);
      }
      throw error;
    }
  }

  /**
   * Coordinate multiple agents in sequence with dependencies
   */
  async coordinateAgents(agentSequence, engagement) {
    const workflowId = uuidv4().slice(0, 8);
    this.currentWorkflow = { id: workflowId, agents: agentSequence, status: 'running' };

    try {
      const results = {};

      for (const agentName of agentSequence) {
        const task = this.buildAgentTask(agentName, engagement, results);

        console.log(`\n🤖 Executing ${agentName}...`);

        const result = await this.executeAgentTask(agentName, task, engagement);
        results[agentName] = result;

        // Check for blocking findings
        if (this.isBlockingFinding(result)) {
          console.warn(`\n⚠️  ${agentName} found blocking issue - halting further agents`);
          this.currentWorkflow.status = 'blocked';
          this.currentWorkflow.blockingAgent = agentName;
          break;
        }
      }

      this.currentWorkflow.status = 'completed';
      this.currentWorkflow.results = results;

      return {
        workflowId,
        status: 'completed',
        results,
        blockingAgent: this.currentWorkflow.blockingAgent || null
      };
    } catch (error) {
      this.currentWorkflow.status = 'failed';
      this.currentWorkflow.error = error.message;
      throw error;
    }
  }

  /**
   * Build task description for agent based on previous results
   */
  buildAgentTask(agentName, engagement, previousResults) {
    let task = '';

    switch (agentName) {
      case 'supervisor':
        task = `Analyze the following engagement and provide a breakdown of key audit areas:
Engagement: ${engagement.entityName}
Industry: ${engagement.sector}
Risk Level: ${engagement.riskAssessment?.combinedRisk || 'Not assessed'}`;
        break;

      case 'code-analyst':
        task = `Review the code and systems for quality and architectural issues.
Focus on: Code quality, maintainability, error handling
Previous findings: ${JSON.stringify(previousResults.supervisor?.result || {})}`;
        break;

      case 'security':
        task = `Perform security audit focusing on vulnerabilities and compliance.
Code findings: ${previousResults['code-analyst']?.output?.substring(0, 500) || 'None'}
Requirements: OWASP Top 10, encryption, access control`;
        break;

      case 'compliance':
        task = `Verify compliance with GDPR and regulatory requirements.
Security findings: ${previousResults.security?.output?.substring(0, 500) || 'None'}
Jurisdiction: ${engagement.jurisdiction || 'UK'}`;
        break;

      case 'documentation':
        task = `Generate documentation for the audit findings.
Findings: ${JSON.stringify(Object.keys(previousResults))} agents completed`;
        break;

      case 'testing':
        task = `Analyze test coverage and recommend improvements.
Code quality: ${previousResults['code-analyst']?.output?.substring(0, 300) || 'Not assessed'}`;
        break;

      default:
        task = `Analyze engagement: ${engagement.entityName}`;
    }

    return task;
  }

  /**
   * Check if findings are blocking
   */
  isBlockingFinding(result) {
    if (!result || !result.output) return false;
    const output = result.output.toLowerCase();
    return output.includes('critical') || output.includes('blocking') || output.includes('must fix');
  }

  /**
   * Record execution in history
   */
  recordExecution(execution) {
    this.executionHistory.push({
      ...execution,
      timestamp: new Date().toISOString()
    });

    // Keep history manageable (last 100 executions)
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }
  }

  /**
   * Subscribe to agent progress
   */
  subscribeToAgentProgress(agentName, callback) {
    const handler = (data) => {
      if (data.agentName === agentName || !agentName) {
        callback(data);
      }
    };

    this.on('agent-progress', handler);

    // Return unsubscribe function
    return () => {
      this.off('agent-progress', handler);
    };
  }

  /**
   * Record agent decision to audit trail
   */
  recordAgentDecision(agentName, decision, impact) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      action: 'DECISION',
      decision,
      impact,
      gdprCompliant: true
    };

    // Emit to audit trail if available
    if (this.auditPlatformService) {
      this.auditPlatformService.emit('audit-trail-entry', auditEntry);
    }

    this.emit('audit-decision', auditEntry);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(filter = {}) {
    let history = this.executionHistory;

    if (filter.agentName) {
      history = history.filter(e => e.agentName === filter.agentName);
    }

    if (filter.startTime) {
      history = history.filter(e => new Date(e.timestamp) >= new Date(filter.startTime));
    }

    return history;
  }

  /**
   * Get current workflow status
   */
  getWorkflowStatus() {
    return this.currentWorkflow;
  }

  /**
   * Get all registered agents
   */
  getAllAgents() {
    return this.framework.getAllAgents();
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.framework.getMetrics(),
      executionHistory: this.executionHistory.length,
      currentWorkflow: this.currentWorkflow
    };
  }
}

export default AgentOrchestrationService;
