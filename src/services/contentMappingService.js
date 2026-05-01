/**
 * contentMappingService.js
 *
 * Maps FSLIs to their required compliance content and generates dynamic guidance
 * Adapts guidance based on engagement characteristics (industry, risk, entity size)
 * Creates context-aware compliance requirements
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import complianceContentService from './complianceContentService.js';

/**
 * Map FSLI to critical ISA standards and high-risk areas
 * Used for automatic agent assignment and guidance intensity
 */
const FSLI_CRITICALITY_MAP = {
  'C1': { criticality: 'Medium', isaFocus: ['ISA 500', 'ISA 320'], riskArea: 'accuracy' },
  'D1': { criticality: 'High', isaFocus: ['ISA 220', 'ISA 315'], riskArea: 'controls' },
  'D3': { criticality: 'Critical', isaFocus: ['ISA 240', 'ISA 501', 'ISA 505'], riskArea: 'fraud' },
  'D4': { criticality: 'High', isaFocus: ['ISA 501', 'ISA 540'], riskArea: 'valuation' },
  'D5': { criticality: 'High', isaFocus: ['ISA 540', 'ISA 330'], riskArea: 'valuation' },
  'D6': { criticality: 'High', isaFocus: ['ISA 501', 'ISA 505'], riskArea: 'completeness' }
};

/**
 * Industry-specific risk adjustments
 * Modifies guidance based on client industry
 */
const INDUSTRY_RISK_ADJUSTMENTS = {
  'banking': {
    D3: { riskLevel: 'Critical', additionalProcedures: ['regulatory-compliance', 'loan-loss-analysis'] },
    D6: { riskLevel: 'High', additionalProcedures: ['deposit-liability-testing', 'interest-accrual'] }
  },
  'manufacturing': {
    D4: { riskLevel: 'Critical', additionalProcedures: ['inventory-count-observation', 'allocation-analysis'] },
    D5: { riskLevel: 'High', additionalProcedures: ['asset-impairment', 'depreciation-validation'] }
  },
  'technology': {
    D3: { riskLevel: 'High', additionalProcedures: ['saas-revenue-testing', 'subscription-cutoff'] },
    D5: { riskLevel: 'Medium', additionalProcedures: ['capitalized-development', 'useful-life-assessment'] }
  },
  'retail': {
    D3: { riskLevel: 'High', additionalProcedures: ['sales-transaction-testing', 'return-accrual'] },
    D4: { riskLevel: 'High', additionalProcedures: ['obsolescence-assessment', 'inventory-count'] }
  },
  'real-estate': {
    D5: { riskLevel: 'Critical', additionalProcedures: ['property-valuation', 'lease-classification'] },
    D6: { riskLevel: 'High', additionalProcedures: ['mortgage-liability-testing', 'interest-accrual'] }
  }
};

/**
 * Entity size risk adjustments
 * Modifies guidance based on entity size and complexity
 */
const ENTITY_SIZE_ADJUSTMENTS = {
  'large': {
    controlTesting: 'Extended',
    sampleSize: 'Increased',
    specialization: 'Required'
  },
  'medium': {
    controlTesting: 'Standard',
    sampleSize: 'Standard',
    specialization: 'Recommended'
  },
  'small': {
    controlTesting: 'Risk-based',
    sampleSize: 'Reduced',
    specialization: 'As-needed'
  }
};

/**
 * Get risk-adjusted content for an FSLI based on engagement characteristics
 * @param {string} fsliId - FSLI identifier
 * @param {object} engagementContext - Engagement characteristics
 *   - industry: 'banking', 'manufacturing', 'technology', 'retail', 'real-estate', etc.
 *   - riskProfile: 'low', 'medium', 'high'
 *   - entitySize: 'small', 'medium', 'large'
 *   - complexAccounts: array of account types
 *   - priorYearIssues: array of issue descriptions
 * @returns {object} Risk-adjusted compliance guidance
 */
export function getContextualGuidance(fsliId, engagementContext = {}) {
  const baseContent = complianceContentService.getComprehensiveGuidancePackage(fsliId, engagementContext);

  if (!baseContent.success) {
    return baseContent;
  }

  const guidance = baseContent.data;
  const { industry = 'general', riskProfile = 'medium', entitySize = 'medium', _complexAccounts = [], priorYearIssues = [] } = engagementContext;

  // Apply industry-specific adjustments
  const industryAdjustment = INDUSTRY_RISK_ADJUSTMENTS[industry.toLowerCase()]?.[fsliId];
  if (industryAdjustment) {
    guidance.industryRiskLevel = industryAdjustment.riskLevel;
    guidance.industryAdditionalProcedures = industryAdjustment.additionalProcedures;

    // Enhance procedures checklist with industry-specific items
    industryAdjustment.additionalProcedures.forEach(proc => {
      guidance.proceduresChecklist.push({
        procedure: `[INDUSTRY-SPECIFIC] ${proc.replace('-', ' ')}`,
        priority: 'High',
        phase: 'Final Audit',
        industrySpecific: true
      });
    });
  }

  // Apply entity size adjustments
  const sizeAdjustment = ENTITY_SIZE_ADJUSTMENTS[entitySize.toLowerCase()];
  if (sizeAdjustment) {
    guidance.sizeAdjustments = sizeAdjustment;

    // Modify sample procedures based on entity size
    if (guidance.sampleProcedures) {
      guidance.sampleProcedures.sizeAdjustment = sizeAdjustment;
    }
  }

  // Add risk profile enhancements
  if (riskProfile === 'high') {
    guidance.enhancedRiskProcedures = [
      'Increase sample sizes by 25%',
      'Test all transactions above trivial threshold',
      'Perform surprise testing procedures',
      'Increase specialist involvement',
      'Consider management override testing'
    ];
  }

  // Add prior year issue procedures
  if (priorYearIssues.length > 0) {
    guidance.priorYearFollowUp = priorYearIssues.map(issue => ({
      issue,
      followUpProcedure: `Test remediation and confirm resolution of: ${issue}`
    }));
  }

  return {
    success: true,
    data: guidance
  };
}

/**
 * Determine automatic agent assignments based on FSLI and risk profile
 * Uses agent specialization matching and risk assessment
 * @param {string} fsliId - FSLI identifier
 * @param {object} engagementContext - Engagement characteristics
 * @returns {array} Recommended agent assignments with rationale
 */
export function suggestAgentAssignments(fsliId, engagementContext = {}) {
  const criticality = FSLI_CRITICALITY_MAP[fsliId];
  const { riskProfile = 'medium', industry = 'general' } = engagementContext;

  if (!criticality) {
    return [];
  }

  const assignments = [];

  // Primary assignment based on FSLI type
  const primaryAgentMap = {
    'C1': { agent: 'evidence-agent', reason: 'Trial balance evidence and reconciliation testing' },
    'D1': { agent: 'controls-assessment-agent', reason: 'Control environment and design testing' },
    'D3': { agent: 'compliance-advisor', reason: 'Revenue compliance and fraud risk assessment (ISA 240)' },
    'D4': { agent: 'technical-accounting-lead', reason: 'Complex valuation and obsolescence estimates' },
    'D5': { agent: 'technical-accounting-lead', reason: 'Fixed asset and lease accounting (IFRS 16)' },
    'D6': { agent: 'compliance-advisor', reason: 'Completeness testing and accrual appropriateness' }
  };

  if (primaryAgentMap[fsliId]) {
    assignments.push({
      agentId: primaryAgentMap[fsliId].agent,
      agentRole: 'Primary',
      rationale: primaryAgentMap[fsliId].reason,
      criticality: criticality.criticality,
      required: true
    });
  }

  // Add risk agent if high-risk area
  if (criticality.criticality === 'Critical' || riskProfile === 'high') {
    assignments.push({
      agentId: 'risk-agent',
      agentRole: 'Secondary',
      rationale: 'Risk assessment and high-risk area testing',
      criticality: 'High',
      required: true
    });
  }

  // Add evidence agent for complex areas
  if (['D3', 'D4', 'D5', 'D6'].includes(fsliId) && riskProfile !== 'low') {
    assignments.push({
      agentId: 'evidence-agent',
      agentRole: 'Secondary',
      rationale: 'Evidence collection and linkage to findings',
      criticality: 'Medium',
      required: false
    });
  }

  // Add specialist for specific industries
  if (industry === 'banking') {
    assignments.push({
      agentId: 'compliance-advisor',
      agentRole: 'Specialist',
      rationale: 'Banking and regulatory compliance expertise',
      criticality: 'High',
      required: ['D3', 'D6'].includes(fsliId)
    });
  }

  return assignments;
}

/**
 * Generate enhanced procedures list based on risk assessment
 * Extends base procedures with risk-specific additional procedures
 * @param {string} fsliId - FSLI identifier
 * @param {object} riskAssessment - Risk assessment results
 *   - riskLevel: 'high', 'medium', 'low'
 *   - controlsTestedEffective: boolean
 *   - keyRisks: array of identified risks
 * @returns {array} Enhanced procedures checklist
 */
export function generateRiskBasedProcedures(fsliId, riskAssessment = {}) {
  let procedures = complianceContentService.getProceduresChecklist(fsliId) || [];

  const { riskLevel = 'medium', controlsTestedEffective = true, keyRisks = [] } = riskAssessment;

  // Adjust procedures based on risk level and control effectiveness
  if (riskLevel === 'high' && !controlsTestedEffective) {
    // Increase sample sizes
    procedures = procedures.map(p => ({
      ...p,
      riskAdjustment: 'Increase sample size by 25%',
      phase: p.phase === 'Interim' ? 'Interim & Final Audit' : p.phase
    }));
  }

  if (riskLevel === 'low' && controlsTestedEffective) {
    // Reduce extent of testing
    procedures = procedures.map(p => ({
      ...p,
      riskAdjustment: 'Reduce sample size based on control effectiveness',
      phase: p.phase
    }));
  }

  // Add procedures specific to identified key risks
  keyRisks.forEach(risk => {
    procedures.push({
      procedure: `[RISK-SPECIFIC] Address identified risk: ${risk}`,
      priority: 'High',
      phase: 'Final Audit',
      riskSpecific: true,
      relatedRisk: risk
    });
  });

  return procedures;
}

/**
 * Get ISA standard focus areas for a specific FSLI
 * Highlights which ISA standards require most attention
 * @param {string} fsliId - FSLI identifier
 * @returns {object} ISA focus areas with emphasis levels
 */
export function getISAFocusAreas(fsliId) {
  const criticality = FSLI_CRITICALITY_MAP[fsliId];

  if (!criticality) {
    return null;
  }

  return {
    fsliId,
    focusStandards: criticality.isaFocus.map(isa => ({
      standard: isa,
      emphasis: 'Critical',
      rationale: `ISA ${isa} is fundamental to ${fsliId} testing`,
      guidance: complianceContentService.getISAGuidance(fsliId, isa)
    })),
    secondaryStandards: complianceContentService
      .getISAStandardsByFSLI(fsliId)
      .filter(isa => !criticality.isaFocus.includes(isa))
      .map(isa => ({
        standard: isa,
        emphasis: 'Supporting',
        rationale: `ISA ${isa} provides supporting guidance for ${fsliId} testing`
      })),
    keyRiskArea: criticality.riskArea,
    criticalityLevel: criticality.criticality
  };
}

/**
 * Create a compliance checklist for a section/FSLI
 * Combines all ISA requirements into a single checklist
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Compliance checklist items
 */
export function createComplianceChecklist(fsliId) {
  const isaStandards = complianceContentService.getISAStandardsByFSLI(fsliId);
  const checklist = [];

  isaStandards.forEach(isa => {
    const guidance = complianceContentService.getISAGuidance(fsliId, isa);
    if (guidance && guidance.keyRequirements) {
      guidance.keyRequirements.forEach(requirement => {
        checklist.push({
          isaStandard: isa,
          requirement,
          documentationRequired: guidance.documentationRequirements || [],
          status: 'Not Started',
          completedDate: null,
          reviewedDate: null
        });
      });
    }
  });

  return checklist;
}

/**
 * Map engagement risk factors to FSLI procedures
 * Identifies which FSLIs need enhanced procedures based on entity risk factors
 * @param {object} entityRiskFactors - Risk factors from entity assessment
 *   - industryVolatility: 'high', 'medium', 'low'
 *   - managementTurnover: true/false
 *   - weakInternalControls: true/false
 *   - regulatoryPressure: true/false
 *   - significantJudgments: array of judgment areas
 * @returns {array} FSLIs with risk-based procedure enhancements
 */
export function mapRiskFactorsToFSLIProcedures(entityRiskFactors = {}) {
  const allFSLIs = complianceContentService.getAllFSLILabels();
  const adjustedFSLIs = [];

  const {
    industryVolatility = 'medium', // eslint-disable-line no-unused-vars
    managementTurnover = false,
    weakInternalControls = false,
    regulatoryPressure = false,
    significantJudgments = []
  } = entityRiskFactors;

  allFSLIs.forEach(fsli => {
    const adjustments = [];

    if (weakInternalControls && ['D1', 'D3', 'D6'].includes(fsli.id)) {
      adjustments.push('Increase substantive procedure extent - weak controls');
    }

    if (managementTurnover && ['D3', 'D5', 'D6'].includes(fsli.id)) {
      adjustments.push('Enhanced management bias testing');
    }

    if (regulatoryPressure && ['D3', 'D6'].includes(fsli.id)) {
      adjustments.push('Regulatory compliance testing required');
    }

    significantJudgments.forEach(judgment => {
      if (judgment.fsli === fsli.id) {
        adjustments.push(`Challenge estimate: ${judgment.description}`);
      }
    });

    if (adjustments.length > 0) {
      adjustedFSLIs.push({
        ...fsli,
        procedureAdjustments: adjustments,
        enhancedFocus: true
      });
    }
  });

  return adjustedFSLIs;
}

export default {
  getContextualGuidance,
  suggestAgentAssignments,
  generateRiskBasedProcedures,
  getISAFocusAreas,
  createComplianceChecklist,
  mapRiskFactorsToFSLIProcedures
};
