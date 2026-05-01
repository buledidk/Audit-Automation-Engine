// ═══════════════════════════════════════════════════════════════
// Agent Definitions Index — Registry of all available agents
// ═══════════════════════════════════════════════════════════════

import { planningAgent } from './planningAgent.js';
import { riskAssessmentAgent } from './riskAssessmentAgent.js';
import { testingAgent } from './testingAgent.js';
import { completionAgent } from './completionAgent.js';
import { reviewAgent } from './reviewAgent.js';

// Financial Analysis & Specialist Agents
import { solvencyGoingConcernAgent } from './solvencyGoingConcernAgent.js';
import { capitalGearingAgent } from './capitalGearingAgent.js';
import { investorRatiosAgent } from './investorRatiosAgent.js';
import { bankLenderRatiosAgent } from './bankLenderRatiosAgent.js';
import { marketCompetitiveAgent } from './marketCompetitiveAgent.js';
import { fraudRiskAgent } from './fraudRiskAgent.js';
import { regressionPredictiveAgent } from './regressionPredictiveAgent.js';
import { estimationValuationAgent } from './estimationValuationAgent.js';

export const AGENT_DEFINITIONS = {
  // Core audit workflow agents
  planning: planningAgent,
  riskAssessment: riskAssessmentAgent,
  testing: testingAgent,
  completion: completionAgent,
  review: reviewAgent,

  // Financial analysis & specialist agents
  solvencyGoingConcern: solvencyGoingConcernAgent,
  capitalGearing: capitalGearingAgent,
  investorRatios: investorRatiosAgent,
  bankLenderRatios: bankLenderRatiosAgent,
  marketCompetitive: marketCompetitiveAgent,
  fraudRisk: fraudRiskAgent,
  regressionPredictive: regressionPredictiveAgent,
  estimationValuation: estimationValuationAgent,
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
