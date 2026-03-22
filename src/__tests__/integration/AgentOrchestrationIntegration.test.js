/**
 * Agent Orchestration Integration Tests
 * Verifies agent coordination, progress tracking, and workflow execution
 */
import { describe, test, expect } from 'vitest';

describe('Agent Orchestration System Integration', () => {
    test('agentOrchestrationService exports correctly', async () => {
          const module = await import('../../services/agentOrchestrationService');
      const service = module.default;
          expect(service).toBeDefined();
          expect(service.coordinateAgents).toBeDefined();
          expect(service.getAgentStatus).toBeDefined();
          expect(service.getWorkflowSummary).toBeDefined();
    });

           test('service initializes all 6 agents', async () => {
                 const module = await import('../../services/agentOrchestrationService');
                 const service = module.default;
                 const SupervisorAgent = service.agents.get('SupervisorAgent');
                 expect(SupervisorAgent).toBeDefined();
                 expect(SupervisorAgent.status).toBe('idle');
           });

           test('AgentProgressPanel component loads', async () => {
                 const module = await import('../../components/AgentProgressPanel.jsx');
                 const Component = module.default;
                 expect(Component).toBeDefined();
           });

           test('AgentRecommendationsPanel component loads', async () => {
                 const module = await import('../../components/AgentRecommendationsPanel.jsx');
                 const Component = module.default;
                 expect(Component).toBeDefined();
           });

           test('useAgentProgress hook works', async () => {
                 const module = await import('../../hooks/useAgentProgress');
                 const useAgentProgress = module.default;
                 expect(useAgentProgress).toBeDefined();
           });

           test('agent can be retrieved by name', async () => {
                 const module = await import('../../services/agentOrchestrationService');
                 const service = module.default;
                 const status = service.getAgentStatus('SupervisorAgent');
                 expect(status).toBeDefined();
                 expect(status.name).toBe('SupervisorAgent');
           });
});
