/**
 * Operational Agents Index
 * 9 operational agents for AuditEngine workflow automation
 */

export { orchestratorAgent } from './orchestratorAgent.js';
export { riskIntelligenceAgent } from './riskIntelligenceAgent.js';
export { qualityGuardianAgent } from './qualityGuardianAgent.js';
export { evidenceLinkerAgent } from './evidenceLinkerAgent.js';
export { narrativeWriterAgent } from './narrativeWriterAgent.js';
export { deadlineAgent } from './deadlineAgent.js';
export { learningAgent } from './learningAgent.js';
export { humanInterfaceAgent } from './humanInterfaceAgent.js';
export { evidenceCorroborationAgent } from './evidenceCorroborationAgent.js';

// Convenience array of all operational agents
import { orchestratorAgent } from './orchestratorAgent.js';
import { riskIntelligenceAgent } from './riskIntelligenceAgent.js';
import { qualityGuardianAgent } from './qualityGuardianAgent.js';
import { evidenceLinkerAgent } from './evidenceLinkerAgent.js';
import { narrativeWriterAgent } from './narrativeWriterAgent.js';
import { deadlineAgent } from './deadlineAgent.js';
import { learningAgent } from './learningAgent.js';
import { humanInterfaceAgent } from './humanInterfaceAgent.js';
import { evidenceCorroborationAgent } from './evidenceCorroborationAgent.js';

export const OPERATIONAL_AGENTS = [
  orchestratorAgent,
  riskIntelligenceAgent,
  qualityGuardianAgent,
  evidenceLinkerAgent,
  narrativeWriterAgent,
  deadlineAgent,
  learningAgent,
  humanInterfaceAgent,
  evidenceCorroborationAgent
];
