/**
 * Agent Framework
 * Provides core infrastructure for multi-agent orchestration
 * with compliance, transparency, and performance monitoring
 * Integrated with ModelSelectionService for multi-model support
 */

import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
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
      apiKey: process.env.ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true
    });

    this.agents = new Map();
    this.agentLog = [];
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      averageResponseTime: 0,
      totalCacheCreationTokens: 0,
      totalCacheReadTokens: 0,
      cacheHitRate: 0
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
    const agentId = randomUUID().slice(0, 8);
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

    const taskId = randomUUID().slice(0, 8);
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

      // Build request params with prompt caching + adaptive thinking
      const buildParams = (model, maxTokens, temperature) => {
        const params = {
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }]
        };
        // Enable adaptive thinking for Opus 4.6 and Sonnet 4.6
        if (model === 'claude-opus-4-6' || model === 'claude-sonnet-4-6') {
          params.thinking = { type: 'adaptive' };
        }
        return params;
      };

      // Execute with selected model and retries
      const response = await this.executeWithRetry(
        () => {
          if (modelSelection.key === 'primary' && modelSelection.client) {
            return modelSelection.client.messages.create(
              buildParams(
                modelSelection.config.model,
                modelSelection.config.maxTokens,
                modelSelection.config.temperature
              )
            );
          } else {
            return this.client.messages.create(
              buildParams(
                this.config.model,
                this.config.maxTokens,
                this.config.temperature
              )
            );
          }
        }
      );

      const executionTime = Date.now() - startTime;
      this.updateMetrics(response, executionTime);

      // Extract text from response (skip thinking blocks from adaptive thinking)
      const textBlock = response.content.find(b => b.type === 'text');
      const thinkingBlock = response.content.find(b => b.type === 'thinking');

      const result = {
        taskId,
        agentName,
        status: 'completed',
        output: textBlock?.text || '',
        thinking: thinkingBlock?.thinking || null,
        executionTime,
        tokenUsage: response.usage,
        cacheMetrics: {
          cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
          cacheReadTokens: response.usage.cache_read_input_tokens || 0,
          inputTokens: response.usage.input_tokens || 0
        },
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
   * Build system prompt as structured blocks for prompt caching.
   * Static content (agent persona + audit rules) is cached; dynamic
   * context (compliance, per-request data) goes after the cache boundary.
   */
  buildSystemPrompt(agent, context) {
    const blocks = [];

    // Block 1: Static agent persona — CACHED (reused across all calls for this agent)
    blocks.push({
      type: 'text',
      text: `${agent.systemPrompt}

CRITICAL AUDIT RULES (apply to every response):
1. Be transparent about limitations and uncertainties.
2. Cite the data being processed and why.
3. State decisions made and rationale.
4. Note compliance requirements being followed.
5. Use ISA (UK) terminology and UK English spelling.`,
      cache_control: { type: 'ephemeral' }
    });

    // Block 2: Dynamic per-request context — NOT cached (changes each call)
    const dynamicParts = [
      `Agent: ${agent.name} (${agent.type})`,
      `Capabilities: ${agent.capabilities.join(', ')}`
    ];
    if (context.compliance) {
      dynamicParts.push(`Compliance Requirements:\n${JSON.stringify(context.compliance, null, 2)}`);
    }
    blocks.push({
      type: 'text',
      text: dynamicParts.join('\n')
    });

    return blocks;
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

    // Track prompt caching metrics
    const cacheCreation = response.usage.cache_creation_input_tokens || 0;
    const cacheRead = response.usage.cache_read_input_tokens || 0;
    this.metrics.totalCacheCreationTokens += cacheCreation;
    this.metrics.totalCacheReadTokens += cacheRead;

    const totalCachedOps = this.metrics.totalCacheCreationTokens + this.metrics.totalCacheReadTokens;
    if (totalCachedOps > 0) {
      this.metrics.cacheHitRate = (this.metrics.totalCacheReadTokens / totalCachedOps * 100).toFixed(1);
    }

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
