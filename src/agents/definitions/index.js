// ═══════════════════════════════════════════════════════════════
// Agent Definitions Index — Registry of all available agents
// 26 agents across 4 categories: Core, Analytical, Operational, Foundational
// ═══════════════════════════════════════════════════════════════

// Core audit workflow agents (5)
import { planningAgent } from './planningAgent.js';
import { riskAssessmentAgent } from './riskAssessmentAgent.js';
import { testingAgent } from './testingAgent.js';
import { completionAgent } from './completionAgent.js';
import { reviewAgent } from './reviewAgent.js';

// Financial analysis & specialist agents (8)
import { solvencyGoingConcernAgent } from './solvencyGoingConcernAgent.js';
import { capitalGearingAgent } from './capitalGearingAgent.js';
import { investorRatiosAgent } from './investorRatiosAgent.js';
import { bankLenderRatiosAgent } from './bankLenderRatiosAgent.js';
import { marketCompetitiveAgent } from './marketCompetitiveAgent.js';
import { fraudRiskAgent } from './fraudRiskAgent.js';
import { regressionPredictiveAgent } from './regressionPredictiveAgent.js';
import { estimationValuationAgent } from './estimationValuationAgent.js';

// Foundational audit lifecycle agents (4)
import { materialityAgent } from './materialityAgent.js';
import { samplingAgent } from './samplingAgent.js';
import { goingConcernAgent } from './goingConcernAgent.js';
import { documentationAgent } from './documentationAgent.js';

// Advisory & quality agents (3)
import { riskEscalationAgent } from './riskEscalationAgent.js';
import { cfoAdvisoryAgent } from './cfoAdvisoryAgent.js';
import { qualityDocumentationAgent } from './qualityDocumentationAgent.js';

// Operational agents — previously unregistered (9)
import { deadlineAgent } from './deadlineAgent.js';
import { evidenceCorroborationAgent } from './evidenceCorroborationAgent.js';
import { evidenceLinkerAgent } from './evidenceLinkerAgent.js';
import { humanInterfaceAgent } from './humanInterfaceAgent.js';
import { learningAgent } from './learningAgent.js';
import { narrativeWriterAgent } from './narrativeWriterAgent.js';
import { orchestratorAgent } from './orchestratorAgent.js';
import { qualityGuardianAgent } from './qualityGuardianAgent.js';
import { riskIntelligenceAgent } from './riskIntelligenceAgent.js';

export const AGENT_DEFINITIONS = {
  // ── Core audit workflow (5) ────────────────────────────────────
  planning: planningAgent,
  riskAssessment: riskAssessmentAgent,
  testing: testingAgent,
  completion: completionAgent,
  review: reviewAgent,

  // ── Financial analysis & specialist (8) ────────────────────────
  solvencyGoingConcern: solvencyGoingConcernAgent,
  capitalGearing: capitalGearingAgent,
  investorRatios: investorRatiosAgent,
  bankLenderRatios: bankLenderRatiosAgent,
  marketCompetitive: marketCompetitiveAgent,
  fraudRisk: fraudRiskAgent,
  regressionPredictive: regressionPredictiveAgent,
  estimationValuation: estimationValuationAgent,

  // ── Foundational audit lifecycle (4) ────────────────────────────
  materiality: materialityAgent,
  sampling: samplingAgent,
  goingConcern: goingConcernAgent,
  documentation: documentationAgent,

  // ── Advisory & quality (3) ──────────────────────────────────────
  riskEscalation: riskEscalationAgent,
  cfoAdvisory: cfoAdvisoryAgent,
  qualityDocumentation: qualityDocumentationAgent,

  // ── Operational agents (9) ─────────────────────────────────────
  deadline: deadlineAgent,
  evidenceCorroboration: evidenceCorroborationAgent,
  evidenceLinker: evidenceLinkerAgent,
  humanInterface: humanInterfaceAgent,
  learning: learningAgent,
  narrativeWriter: narrativeWriterAgent,
  orchestrator: orchestratorAgent,
  qualityGuardian: qualityGuardianAgent,
  riskIntelligence: riskIntelligenceAgent,
};

// Convenience groupings
export const CORE_AGENTS = {
  planning: planningAgent,
  riskAssessment: riskAssessmentAgent,
  testing: testingAgent,
  completion: completionAgent,
  review: reviewAgent,
};

export const ANALYTICAL_AGENTS = {
  solvencyGoingConcern: solvencyGoingConcernAgent,
  capitalGearing: capitalGearingAgent,
  investorRatios: investorRatiosAgent,
  bankLenderRatios: bankLenderRatiosAgent,
  marketCompetitive: marketCompetitiveAgent,
  fraudRisk: fraudRiskAgent,
  regressionPredictive: regressionPredictiveAgent,
  estimationValuation: estimationValuationAgent,
};

export const FOUNDATIONAL_AGENTS = {
  materiality: materialityAgent,
  sampling: samplingAgent,
  goingConcern: goingConcernAgent,
  documentation: documentationAgent,
};

export const ADVISORY_AGENTS = {
  riskEscalation: riskEscalationAgent,
  cfoAdvisory: cfoAdvisoryAgent,
  qualityDocumentation: qualityDocumentationAgent,
};

export const OPERATIONAL_AGENTS = {
  deadline: deadlineAgent,
  evidenceCorroboration: evidenceCorroborationAgent,
  evidenceLinker: evidenceLinkerAgent,
  humanInterface: humanInterfaceAgent,
  learning: learningAgent,
  narrativeWriter: narrativeWriterAgent,
  orchestrator: orchestratorAgent,
  qualityGuardian: qualityGuardianAgent,
  riskIntelligence: riskIntelligenceAgent,
};
