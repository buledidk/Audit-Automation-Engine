/**
 * Agent Framework Index
 * Central export point for all agent-related modules
 */

export { AgentFramework } from './AgentFramework.js';

// Original Specialized Agents
export {
  SupervisorAgent,
  CodeAnalystAgent,
  SecurityAgent,
  DocumentationAgent,
  ComplianceAgent,
  TestingAgent,
  AgentRegistry
} from './SpecializedAgents.js';

// NEW: Professional Audit Specialist Agents
export {
  TechnicalAccountingLead,
  ControlsAndGovernanceAssessor,
  ComplianceAdvisor,
  TransactionalTestingAgent,
  AuditSpecialistRegistry
} from './AuditSpecializedAgents.js';

export { AgentCLI } from './AgentCLI.js';

// Default export
export { default as AgentIntegration } from './AgentIntegration.js';
