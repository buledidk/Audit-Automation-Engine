/**
 * Agent Framework
 * Provides core infrastructure for multi-agent orchestration
 * with compliance, transparency, and performance monitoring
 * Integrated with ModelSelectionService for multi-model support
 */

import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'crypto';
import { EventEmitter } from 'events';
import { modelSelectionService } from '../services/modelSelectionService.js';

export class AgentFramework extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      model: config.model || 'claude-opus-4-6',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    };

    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.agents = new Map();
    this.agentLog = [];
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      averageResponseTime: 0
    };
    this.compliance = {
      gdprCompliant: true,
      auditTrail: [],
      dataMinimization: true
    };
  }

  /**
   * Register a specialized agent
   */
  registerAgent(name, agentConfig) {
    const agentId = uuidv4().slice(0, 8);
    const agent = {
      id: agentId,
      name,
      type: agentConfig.type,
      description: agentConfig.description,
      tools: agentConfig.tools || [],
      systemPrompt: agentConfig.systemPrompt,
      capabilities: agentConfig.capabilities || [],
      createdAt: new Date(),
      status: 'active'
    };

    this.agents.set(name, agent);
    this.emit('agent:registered', { agentId, name });
    this.logAction('AGENT_REGISTERED', { name, agentId });

    return agent;
  }

  /**
   * Execute an agent task with compliance checks and model selection
   */
  async executeAgentTask(agentName, task, context = {}) {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    const taskId = uuidv4().slice(0, 8);
    const startTime = Date.now();

    try {
      // Compliance check before execution
      this.checkCompliance(task, agent);

      this.emit('task:started', { taskId, agentName, task });
      this.logAction('TASK_STARTED', { taskId, agentName, task });

      // Select best model for this agent using ModelSelectionService
      const modelSelection = await modelSelectionService.selectModel(agentName);
      this.logAction('MODEL_SELECTED', { taskId, agentName, modelSelected: modelSelection.key });

      // Prepare the message
      const systemPrompt = this.buildSystemPrompt(agent, context);
      const userMessage = this.buildUserMessage(task, context);

      // Execute with selected model and retries
      const response = await this.executeWithRetry(
        () => {
          if (modelSelection.key === 'primary' && modelSelection.client) {
            // Use selected model client
            return modelSelection.client.messages.create({
              model: modelSelection.config.model,
              max_tokens: modelSelection.config.maxTokens,
              temperature: modelSelection.config.temperature,
              system: systemPrompt,
              messages: [{ role: 'user', content: userMessage }]
            });
          } else {
            // Fallback to primary client
            return this.client.messages.create({
              model: this.config.model,
              max_tokens: this.config.maxTokens,
              system: systemPrompt,
              messages: [{ role: 'user', content: userMessage }]
            });
          }
        }
      );

      const executionTime = Date.now() - startTime;
      this.updateMetrics(response, executionTime);

      const result = {
        taskId,
        agentName,
        status: 'completed',
        output: response.content[0].text,
        executionTime,
        tokenUsage: response.usage,
        modelUsed: modelSelection.key
      };

      this.emit('task:completed', result);
      this.logAction('TASK_COMPLETED', result);

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.metrics.failedRequests++;

      const errorResult = {
        taskId,
        agentName,
        status: 'failed',
        error: error.message,
        executionTime
      };

      this.emit('task:failed', errorResult);
      this.logAction('TASK_FAILED', errorResult);

      throw error;
    }
  }

  /**
   * Build system prompt with agent context
   */
  buildSystemPrompt(agent, context) {
    return `${agent.systemPrompt}

Context:
- Agent ID: ${agent.id}
- Agent Type: ${agent.type}
- Capabilities: ${agent.capabilities.join(', ')}
- Timestamp: ${new Date().toISOString()}

CRITICAL: You must be transparent about:
1. Your limitations and uncertainties
2. Data being processed and why
3. Decisions made and rationale
4. Compliance requirements being followed

${context.compliance ? `Compliance Requirements:\n${JSON.stringify(context.compliance, null, 2)}` : ''}`;
  }

  /**
   * Build user message
   */
  buildUserMessage(task, context) {
    return `Task: ${task}

${context.data ? `Data: ${JSON.stringify(context.data, null, 2)}` : ''}
${context.requirements ? `Requirements: ${context.requirements.join('\n')}` : ''}`;
  }

  /**
   * Execute with exponential backoff retry logic
   */
  async executeWithRetry(fn, attempt = 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        return this.executeWithRetry(fn, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Check compliance before task execution
   */
  checkCompliance(task, agent) {
    // GDPR: Data minimization check
    if (task.includes('PII') || task.includes('personal data')) {
      if (!agent.capabilities.includes('gdpr-compliant')) {
        throw new Error(`Agent '${agent.name}' is not GDPR compliant for handling PII`);
      }
    }

    // Check authorization
    if (agent.capabilities.includes('requires-audit-trail')) {
      this.compliance.auditTrail.push({
        timestamp: new Date(),
        agentId: agent.id,
        action: 'execute',
        status: 'pending'
      });
    }
  }

  /**
   * Update performance metrics
   */
  updateMetrics(response, executionTime) {
    this.metrics.totalRequests++;
    this.metrics.successfulRequests++;
    this.metrics.totalTokensUsed += response.usage.input_tokens + response.usage.output_tokens;

    const avgTime = (this.metrics.averageResponseTime * (this.metrics.successfulRequests - 1) + executionTime)
      / this.metrics.successfulRequests;
    this.metrics.averageResponseTime = avgTime;
  }

  /**
   * Log action for audit trail
   */
  logAction(action, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data,
      userId: process.env.AUDIT_USER_ID || 'system'
    };

    this.agentLog.push(logEntry);
    this.compliance.auditTrail.push(logEntry);

    // Keep audit trail manageable (last 10000 entries)
    if (this.agentLog.length > 10000) {
      this.agentLog.shift();
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentName) {
    const agent = this.agents.get(agentName);
    return agent ? { ...agent, metrics: this.metrics } : null;
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get audit trail
   */
  getAuditTrail(filter = {}) {
    let trail = this.compliance.auditTrail;

    if (filter.agentId) {
      trail = trail.filter(entry => entry.data?.agentId === filter.agentId);
    }

    if (filter.action) {
      trail = trail.filter(entry => entry.action === filter.action);
    }

    if (filter.startTime) {
      trail = trail.filter(entry => new Date(entry.timestamp) >= new Date(filter.startTime));
    }

    return trail;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2) + '%',
      avgTokensPerRequest: (this.metrics.totalTokensUsed / this.metrics.totalRequests).toFixed(0)
    };
  }
}

export default AgentFramework;
