/**
 * agentAssignmentEngine.js
 *
 * Handles automatic and manual agent assignment to audit work/sections
 * Manages assignment tracking, override capability, and validation
 * Integrates with existing agent system and specialization profiles
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import contentMappingService from './contentMappingService.js';
import complianceContentService from './complianceContentService.js';

/**
 * Agent specialization profiles
 * Maps agents to their audit expertise and capabilities
 */
const AGENT_SPECIALIZATIONS = {
  'compliance-advisor': {
    name: 'Compliance Advisor',
    specialties: ['Revenue', 'Payables', 'Regulatory', 'Fraud Risk Assessment'],
    isaFocus: ['ISA 240', 'ISA 250', 'ISA 501', 'ISA 505'],
    fsliPreference: ['D3', 'D6'],
    riskLevel: 'High-Risk',
    industrySpecializations: ['Banking', 'Retail'],
    capabilities: ['External confirmations', 'Completeness testing', 'Regulatory compliance']
  },

  'technical-accounting-lead': {
    name: 'Technical Accounting Lead',
    specialties: ['IFRS/FRS Expertise', 'Complex Judgments', 'Valuation', 'Leases', 'Estimates'],
    isaFocus: ['ISA 540', 'ISA 330'],
    fsliPreference: ['D4', 'D5'],
    riskLevel: 'Complex Areas',
    industrySpecializations: ['Real Estate', 'Manufacturing'],
    capabilities: ['Fair value assessment', 'Lease accounting (IFRS 16)', 'Estimate challenge', 'Impairment testing']
  },

  'controls-assessment-agent': {
    name: 'Controls & Governance Assessor',
    specialties: ['Internal Controls', 'Control Testing', 'Governance', 'Management Override'],
    isaFocus: ['ISA 220', 'ISA 315'],
    fsliPreference: ['D1', 'D2'],
    riskLevel: 'Control-Related',
    industrySpecializations: ['All'],
    capabilities: ['Control design evaluation', 'Walkthroughs', 'Control testing', 'Governance assessment']
  },

  'evidence-agent': {
    name: 'Evidence Collection & Analysis',
    specialties: ['Evidence Collection', 'Audit Trail', 'Documentation', 'Reconciliation'],
    isaFocus: ['ISA 230', 'ISA 500'],
    fsliPreference: ['C1'],
    riskLevel: 'All Areas',
    industrySpecializations: ['All'],
    capabilities: ['Evidence linking', 'Documentation assembly', 'Reconciliation testing', 'Audit trail maintenance']
  },

  'risk-agent': {
    name: 'Risk Assessment & Scoring',
    specialties: ['Risk Assessment', 'Risk Scoring', 'Materiality', 'Risk Prioritization'],
    isaFocus: ['ISA 315', 'ISA 320'],
    fsliPreference: ['D1', 'D3', 'D5'],
    riskLevel: 'High-Risk Areas',
    industrySpecializations: ['All'],
    capabilities: ['Risk prioritization', 'Materiality allocation', 'Risk matrix development', 'Risk re-assessment']
  },

  'transactional-testing-agent': {
    name: 'Transactional Testing Agent',
    specialties: ['Detailed Testing', 'Sample Testing', 'Substantive Procedures', 'Transaction-Level Analysis'],
    isaFocus: ['ISA 330', 'ISA 501'],
    fsliPreference: ['D3', 'D4', 'D5', 'D6'],
    riskLevel: 'Detail Testing',
    industrySpecializations: ['All'],
    capabilities: ['Sample selection', 'Transaction testing', 'Exception analysis', 'Variance investigation']
  }
};

/**
 * Agent-FSLI Automatic Assignment Matrix
 * Determines which agents automatically get assigned to each FSLI
 */
const AUTOMATIC_ASSIGNMENT_MATRIX = {
  'C1': [
    { agent: 'evidence-agent', required: true, role: 'Primary' }
  ],
  'D1': [
    { agent: 'controls-assessment-agent', required: true, role: 'Primary' },
    { agent: 'risk-agent', required: true, role: 'Secondary' }
  ],
  'D3': [
    { agent: 'compliance-advisor', required: true, role: 'Primary' },
    { agent: 'risk-agent', required: true, role: 'Secondary' },
    { agent: 'transactional-testing-agent', required: false, role: 'Secondary' }
  ],
  'D4': [
    { agent: 'technical-accounting-lead', required: true, role: 'Primary' },
    { agent: 'evidence-agent', required: false, role: 'Secondary' }
  ],
  'D5': [
    { agent: 'technical-accounting-lead', required: true, role: 'Primary' },
    { agent: 'risk-agent', required: false, role: 'Secondary' }
  ],
  'D6': [
    { agent: 'compliance-advisor', required: true, role: 'Primary' },
    { agent: 'evidence-agent', required: false, role: 'Secondary' }
  ]
};

/**
 * Auto-assign agents to a section based on FSLI and engagement context
 * Returns list of automatically assigned agents
 * @param {string} fsliId - FSLI identifier
 * @param {object} engagementContext - Engagement characteristics
 * @returns {array} Automatically assigned agents with metadata
 */
export function autoAssignAgents(fsliId, engagementContext = {}) {
  const baseAssignments = AUTOMATIC_ASSIGNMENT_MATRIX[fsliId] || [];
  const suggestions = contentMappingService.suggestAgentAssignments(fsliId, engagementContext);

  // Merge automatic matrix with contextual suggestions
  const assignments = baseAssignments.map(assignment => {
    const suggestion = suggestions.find(s => s.agentId === assignment.agent);
    return {
      agentId: assignment.agent,
      agentName: AGENT_SPECIALIZATIONS[assignment.agent]?.name || assignment.agent,
      role: assignment.role,
      required: assignment.required,
      assignedDate: new Date().toISOString(),
      assignedAutomatically: true,
      status: 'assigned',
      rationale: suggestion?.rationale || 'Standard assignment for this FSLI',
      specialties: AGENT_SPECIALIZATIONS[assignment.agent]?.specialties || [],
      canReassign: !assignment.required // Cannot reassign required agents
    };
  });

  return assignments;
}

/**
 * Manually reassign an agent to a different section
 * Validates reassignment and tracks override in audit trail
 * @param {string} sectionId - Current FSLI where agent is assigned
 * @param {string} agentId - Agent ID to reassign
 * @param {string} newSectionId - Target FSLI for reassignment
 * @param {string} reassignedBy - User ID performing reassignment
 * @param {string} reason - Reason for reassignment
 * @returns {object} Reassignment confirmation with audit trail entry
 */
export function reassignAgent(sectionId, agentId, newSectionId, reassignedBy, reason = '') {
  // Validate that agent is assigned to current section
  const currentAssignments = autoAssignAgents(sectionId);
  const currentAssignment = currentAssignments.find(a => a.agentId === agentId);

  if (!currentAssignment) {
    return {
      success: false,
      message: `Agent ${agentId} is not assigned to section ${sectionId}`
    };
  }

  // Validate that reassignment is allowed (not a required agent)
  if (currentAssignment.required) {
    return {
      success: false,
      message: `Cannot reassign required agent ${agentId} from ${sectionId}`
    };
  }

  // Create reassignment record
  const reassignment = {
    reassignmentId: `reassign-${Date.now()}`,
    agentId,
    agentName: currentAssignment.agentName,
    fromSectionId: sectionId,
    toSectionId: newSectionId,
    fromSectionLabel: complianceContentService.getComplianceContentByFSLI(sectionId)?.label,
    toSectionLabel: complianceContentService.getComplianceContentByFSLI(newSectionId)?.label,
    reassignedBy,
    reassignedDate: new Date().toISOString(),
    reason,
    status: 'completed',
    auditTrailEntry: {
      actionType: 'agent_reassignment',
      description: `${currentAssignment.agentName} reassigned from ${sectionId} to ${newSectionId}`,
      reason,
      timestamp: new Date().toISOString(),
      performedBy: reassignedBy
    }
  };

  return {
    success: true,
    message: `Agent ${agentId} successfully reassigned from ${sectionId} to ${newSectionId}`,
    data: reassignment
  };
}

/**
 * Get current agent assignments for a section
 * @param {string} fsliId - FSLI identifier
 * @returns {object} Current assignments with details
 */
export function getAssignmentsForFSLI(fsliId) {
  const assignments = autoAssignAgents(fsliId);
  const fsliContent = complianceContentService.getComplianceContentByFSLI(fsliId);

  return {
    fsliId,
    fsliLabel: fsliContent?.label || fsliId,
    assignments,
    totalAssignments: assignments.length,
    requiredAgents: assignments.filter(a => a.required).length,
    optionalAgents: assignments.filter(a => !a.required).length
  };
}

/**
 * Get agent workload summary
 * Shows which agents are assigned to which FSLIs
 * @param {array} engagementFSLIs - Array of FSLI IDs in engagement
 * @returns {object} Agent workload summary
 */
export function getAgentWorkloadSummary(engagementFSLIs = []) {
  const agentWorkload = {};

  // Initialize workload for all agents
  Object.keys(AGENT_SPECIALIZATIONS).forEach(agentId => {
    agentWorkload[agentId] = {
      agentId,
      agentName: AGENT_SPECIALIZATIONS[agentId].name,
      assignments: [],
      totalAssignments: 0,
      workloadScore: 0
    };
  });

  // Populate workload from engagementFSLIs
  engagementFSLIs.forEach(fsliId => {
    const assignments = autoAssignAgents(fsliId);
    assignments.forEach(assignment => {
      if (agentWorkload[assignment.agentId]) {
        agentWorkload[assignment.agentId].assignments.push({
          fsliId,
          fsliLabel: complianceContentService.getComplianceContentByFSLI(fsliId)?.label || fsliId,
          role: assignment.role,
          required: assignment.required
        });
        agentWorkload[assignment.agentId].totalAssignments += 1;
      }
    });
  });

  // Calculate workload scores
  Object.values(agentWorkload).forEach(agent => {
    agent.workloadScore = agent.totalAssignments * 10; // Simple score: 10 points per assignment
    agent.isAvailable = agent.totalAssignments < 5; // Available if < 5 assignments
  });

  return agentWorkload;
}

/**
 * Get agent specialization profile
 * Returns detailed information about an agent's capabilities and preferences
 * @param {string} agentId - Agent identifier
 * @returns {object} Agent specialization profile
 */
export function getAgentProfile(agentId) {
  return AGENT_SPECIALIZATIONS[agentId] || null;
}

/**
 * Find best agent for a task based on characteristics
 * @param {object} taskCharacteristics - Task details
 *   - taskType: 'compliance', 'technical', 'testing', 'evidence', 'risk', 'controls'
 *   - fsliId: FSLI identifier
 *   - riskLevel: 'high', 'medium', 'low'
 *   - requiresSpecialization: boolean
 * @returns {array} Recommended agents ranked by suitability
 */
export function findBestAgentForTask(taskCharacteristics = {}) {
  const { _taskType, fsliId, riskLevel = 'medium', requiresSpecialization = false } = taskCharacteristics;

  // Get suggestions from content mapping service
  const suggestions = contentMappingService.suggestAgentAssignments(fsliId || 'D3', { riskProfile: riskLevel });

  // Filter and rank suggestions
  const rankedAgents = suggestions
    .filter(s => !requiresSpecialization || AGENT_SPECIALIZATIONS[s.agentId]?.capabilities?.length > 0)
    .sort((a, b) => {
      // Prioritize required agents
      if (a.required !== b.required) return b.required - a.required;
      // Then primary role
      if (a.agentRole === 'Primary' && b.agentRole !== 'Primary') return -1;
      if (b.agentRole === 'Primary' && a.agentRole !== 'Primary') return 1;
      return 0;
    })
    .map((suggestion, index) => ({
      ...suggestion,
      rank: index + 1,
      suitabilityScore: (10 - index) * 10 // Higher score for better rank
    }));

  return rankedAgents;
}

/**
 * Validate if an agent can be assigned to a section
 * Checks compatibility and capacity
 * @param {string} agentId - Agent to assign
 * @param {string} fsliId - Target FSLI
 * @param {object} agentWorkload - Current agent workload data
 * @returns {object} Validation result
 */
export function validateAgentAssignment(agentId, fsliId, agentWorkload = {}) {
  const agentProfile = AGENT_SPECIALIZATIONS[agentId];

  if (!agentProfile) {
    return {
      valid: false,
      reason: `Agent ${agentId} not found in system`
    };
  }

  // Check if agent prefers this FSLI or is general purpose
  const isPreferredFSLI = agentProfile.fsliPreference.includes(fsliId) ||
                          agentProfile.fsliPreference.length === 0;

  // Check capacity
  const agentAssignments = agentWorkload[agentId]?.totalAssignments || 0;
  const hasCapacity = agentAssignments < 5; // Max 5 assignments

  return {
    valid: isPreferredFSLI && hasCapacity,
    reasons: {
      fsliPreference: isPreferredFSLI ? 'Preferred FSLI' : 'Not in preferred FSLIs',
      capacity: hasCapacity ? 'Has capacity' : 'At capacity limit',
      profile: agentProfile
    }
  };
}

/**
 * Create assignment audit trail entry
 * Records agent assignment for audit documentation (ISA 230)
 * @param {string} agentId - Agent assigned
 * @param {string} fsliId - FSLI assigned to
 * @param {string} assignedBy - User ID who made assignment
 * @param {boolean} automatic - Whether assignment was automatic
 * @returns {object} Audit trail entry
 */
export function createAssignmentAuditTrail(agentId, fsliId, assignedBy, automatic = true) {
  return {
    auditTrailEntryId: `agent-assign-${Date.now()}`,
    actionType: 'agent_assignment',
    agentId,
    agentName: AGENT_SPECIALIZATIONS[agentId]?.name || agentId,
    fsliId,
    fsliLabel: complianceContentService.getComplianceContentByFSLI(fsliId)?.label,
    assignedBy,
    timestamp: new Date().toISOString(),
    assignmentType: automatic ? 'Automatic' : 'Manual',
    isaStandards: complianceContentService.getISAStandardsByFSLI(fsliId),
    description: `${AGENT_SPECIALIZATIONS[agentId]?.name} assigned to ${fsliId}`,
    status: 'active'
  };
}

/**
 * Export assignment configuration for persistence
 * Generates JSON structure for storing assignments
 * @param {array} engagementFSLIs - Array of FSLI IDs
 * @returns {object} Assignment configuration ready for storage
 */
export function exportAssignmentConfiguration(engagementFSLIs = []) {
  const configuration = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    fsliAssignments: {}
  };

  engagementFSLIs.forEach(fsliId => {
    const assignments = autoAssignAgents(fsliId);
    configuration.fsliAssignments[fsliId] = {
      fsliLabel: complianceContentService.getComplianceContentByFSLI(fsliId)?.label,
      assignments: assignments.map(a => ({
        agentId: a.agentId,
        agentName: a.agentName,
        role: a.role,
        required: a.required,
        canReassign: a.canReassign
      }))
    };
  });

  return configuration;
}

export default {
  autoAssignAgents,
  reassignAgent,
  getAssignmentsForFSLI,
  getAgentWorkloadSummary,
  getAgentProfile,
  findBestAgentForTask,
  validateAgentAssignment,
  createAssignmentAuditTrail,
  exportAssignmentConfiguration,
  AGENT_SPECIALIZATIONS,
  AUTOMATIC_ASSIGNMENT_MATRIX
};
