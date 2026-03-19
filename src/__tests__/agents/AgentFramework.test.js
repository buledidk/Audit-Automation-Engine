/**
 * Agent Framework Tests
 * Verify agent registration, execution, and compliance
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentFramework } from '../../agents/AgentFramework.js';

describe('AgentFramework', () => {
  let framework;

  beforeEach(() => {
    framework = new AgentFramework();
  });

  describe('Agent Registration', () => {
    it('should register an agent with unique ID', () => {
      const agent = framework.registerAgent('test-agent', {
        type: 'test',
        description: 'Test agent',
        systemPrompt: 'You are a test agent'
      });

      expect(agent.name).toBe('test-agent');
      expect(agent.id).toBeDefined();
      expect(agent.type).toBe('test');
      expect(agent.status).toBe('active');
    });

    it('should retrieve registered agent', () => {
      framework.registerAgent('test-agent', {
        type: 'test',
        description: 'Test agent',
        systemPrompt: 'You are a test agent'
      });

      const agent = framework.getAgentStatus('test-agent');
      expect(agent).toBeDefined();
      expect(agent.name).toBe('test-agent');
    });

    it('should register multiple agents', () => {
      framework.registerAgent('agent-1', { type: 'type1', description: 'Agent 1', systemPrompt: 'Prompt 1' });
      framework.registerAgent('agent-2', { type: 'type2', description: 'Agent 2', systemPrompt: 'Prompt 2' });

      const agents = framework.getAllAgents();
      expect(agents).toHaveLength(2);
    });
  });

  describe('System Prompt Building', () => {
    it('should build system prompt with agent context', () => {
      const agent = {
        id: 'test-id',
        type: 'test',
        systemPrompt: 'Base prompt',
        capabilities: ['test-capability']
      };

      const context = {
        compliance: { gdprRequired: true }
      };

      const prompt = framework.buildSystemPrompt(agent, context);

      expect(prompt).toContain('Base prompt');
      expect(prompt).toContain('test-id');
      expect(prompt).toContain('test-capability');
      expect(prompt).toContain('GDPR');
    });

    it('should include compliance requirements in prompt', () => {
      const agent = {
        id: 'test-id',
        type: 'test',
        systemPrompt: 'Base prompt',
        capabilities: ['gdpr-compliant']
      };

      const context = {
        compliance: {
          gdprRequired: true,
          dataMinimization: true
        }
      };

      const prompt = framework.buildSystemPrompt(agent, context);
      expect(prompt).toContain('transparent');
      expect(prompt).toContain('Compliance');
    });
  });

  describe('User Message Building', () => {
    it('should build user message with task and context', () => {
      const task = 'Review this code';
      const context = {
        data: { code: 'const x = 1;' }
      };

      const message = framework.buildUserMessage(task, context);

      expect(message).toContain('Task: Review this code');
      expect(message).toContain('const x = 1;');
    });

    it('should include requirements in message', () => {
      const task = 'Build feature';
      const context = {
        requirements: ['Secure', 'Fast', 'GDPR compliant']
      };

      const message = framework.buildUserMessage(task, context);

      expect(message).toContain('Secure');
      expect(message).toContain('Fast');
      expect(message).toContain('GDPR compliant');
    });
  });

  describe('Compliance Checking', () => {
    it('should allow GDPR-compliant agents to handle PII', () => {
      const agent = {
        name: 'gdpr-agent',
        capabilities: ['gdpr-compliant']
      };

      const task = 'Process personal data from user account';

      expect(() => {
        framework.checkCompliance(task, agent);
      }).not.toThrow();
    });

    it('should block non-compliant agents from handling PII', () => {
      const agent = {
        name: 'non-gdpr-agent',
        capabilities: []
      };

      const task = 'Process PII data';

      expect(() => {
        framework.checkCompliance(task, agent);
      }).toThrow('not GDPR compliant');
    });

    it('should track audit trail for agents requiring it', () => {
      const agent = {
        name: 'audit-agent',
        id: 'agent-123',
        capabilities: ['requires-audit-trail']
      };

      framework.checkCompliance('Test task', agent);

      expect(framework.compliance.auditTrail.length).toBeGreaterThan(0);
    });
  });

  describe('Metrics Tracking', () => {
    it('should initialize with zero metrics', () => {
      const metrics = framework.getMetrics();

      expect(metrics.totalRequests).toBe(0);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.totalTokensUsed).toBe(0);
    });

    it('should calculate success rate correctly', () => {
      // Mock response
      const response = {
        usage: {
          input_tokens: 100,
          output_tokens: 50
        }
      };

      framework.updateMetrics(response, 1000);
      framework.updateMetrics(response, 1000);

      const metrics = framework.getMetrics();
      expect(metrics.successRate).toContain('100');
    });

    it('should calculate average response time', () => {
      const response = {
        usage: {
          input_tokens: 100,
          output_tokens: 50
        }
      };

      framework.updateMetrics(response, 1000);
      framework.updateMetrics(response, 3000);

      const metrics = framework.getMetrics();
      expect(metrics.averageResponseTime).toBe(2000);
    });

    it('should track token usage', () => {
      const response = {
        usage: {
          input_tokens: 100,
          output_tokens: 50
        }
      };

      framework.updateMetrics(response, 1000);

      const metrics = framework.getMetrics();
      expect(metrics.totalTokensUsed).toBe(150);
    });
  });

  describe('Action Logging', () => {
    it('should log actions with timestamp', () => {
      framework.logAction('TEST_ACTION', { data: 'test' });

      const log = framework.agentLog[0];
      expect(log.action).toBe('TEST_ACTION');
      expect(log.timestamp).toBeDefined();
      expect(log.data.data).toBe('test');
    });

    it('should add logged actions to audit trail', () => {
      framework.logAction('TEST_ACTION', { data: 'test' });

      const auditTrail = framework.getAuditTrail();
      expect(auditTrail.length).toBeGreaterThan(0);
    });

    it('should filter audit trail by action', () => {
      framework.logAction('ACTION_1', { data: 'test' });
      framework.logAction('ACTION_2', { data: 'test' });
      framework.logAction('ACTION_1', { data: 'test' });

      const filtered = framework.getAuditTrail({ action: 'ACTION_1' });
      expect(filtered).toHaveLength(2);
    });

    it('should maintain manageable log size', () => {
      // Add 11000 entries
      for (let i = 0; i < 11000; i++) {
        framework.logAction('TEST', { index: i });
      }

      expect(framework.agentLog.length).toBeLessThanOrEqual(10000);
    });
  });

  describe('Audit Trail Management', () => {
    beforeEach(() => {
      framework.logAction('ACTION_A', { timestamp: new Date('2026-03-01') });
      framework.logAction('ACTION_B', { timestamp: new Date('2026-03-15') });
      framework.logAction('ACTION_C', { timestamp: new Date('2026-03-19') });
    });

    it('should retrieve full audit trail', () => {
      const trail = framework.getAuditTrail();
      expect(trail.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter by date range', () => {
      const trail = framework.getAuditTrail({
        startTime: new Date('2026-03-10')
      });

      expect(trail.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Compliance Status', () => {
    it('should start GDPR compliant', () => {
      expect(framework.compliance.gdprCompliant).toBe(true);
    });

    it('should enforce data minimization', () => {
      expect(framework.compliance.dataMinimization).toBe(true);
    });

    it('should maintain audit trail', () => {
      expect(Array.isArray(framework.compliance.auditTrail)).toBe(true);
    });
  });

  describe('Event Emitter', () => {
    it('should emit agent registered event', (done) => {
      framework.on('agent:registered', (data) => {
        expect(data.name).toBe('test-agent');
        done();
      });

      framework.registerAgent('test-agent', {
        type: 'test',
        description: 'Test',
        systemPrompt: 'Prompt'
      });
    });
  });
});
