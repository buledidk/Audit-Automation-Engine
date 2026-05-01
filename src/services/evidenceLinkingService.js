/**
 * evidenceLinkingService.js
 *
 * Links evidence to agent findings and conclusions
 * Tracks evidence location, type, and relationship to audit work
 * Maintains evidence index for audit documentation
 * Supports ISA 230 evidence retention requirements
 *
 * Version: 1.0.0
 * Created: March 2026
 */

/**
 * In-memory evidence registry
 * In production, connects to file storage (S3, Azure Blob, etc.)
 */
const evidenceRegistry = new Map();

/**
 * Evidence type definitions
 */
const EVIDENCE_TYPES = {
  EMAIL: 'email',
  SPREADSHEET: 'spreadsheet',
  BANK_STATEMENT: 'bank_statement',
  INVOICE: 'invoice',
  SCAN: 'scan',
  SAMPLE_ANALYSIS: 'sample_analysis',
  EXTERNAL_CONFIRMATION: 'external_confirmation',
  SYSTEM_REPORT: 'system_report',
  MANAGEMENT_REPRESENTATION: 'management_representation',
  AUDIT_NOTE: 'audit_note',
  PHOTOGRAPH: 'photograph',
  VIDEO: 'video',
  CALCULATION: 'calculation',
  EXTRACT: 'extract'
};

/**
 * Link evidence file to an audit finding or procedure
 * Creates trackable relationship between evidence and audit work
 * @param {object} linkData - Evidence linking details
 *   - evidenceId: Unique identifier for evidence file
 *   - evidenceType: Type of evidence (from EVIDENCE_TYPES)
 *   - evidenceLocation: File path or URL to evidence
 *   - evidenceTitle: Human-readable title
 *   - evidenceDate: Date of evidence (e.g., bank statement date)
 *   - sectionId: FSLI where evidence applies
 *   - agentId: Agent who linked the evidence
 *   - linkedToAuditItem: What audit item is this evidence supporting
 *   - relevanceRating: 'Critical', 'High', 'Medium', 'Low'
 *   - description: Description of evidence and how it supports conclusion
 *   - amountInvolved: Amount if applicable
 * @returns {object} Evidence link confirmation
 */
export function linkEvidenceToFinding(linkData) {
  const {
    evidenceId,
    evidenceType,
    evidenceLocation,
    evidenceTitle,
    evidenceDate = new Date().toISOString(),
    sectionId,
    agentId,
    linkedToAuditItem,
    relevanceRating = 'Medium',
    description = '',
    amountInvolved = 0
  } = linkData;

  // Validate required fields
  if (!evidenceId || !sectionId || !linkedToAuditItem) {
    return {
      success: false,
      message: 'Missing required fields: evidenceId, sectionId, linkedToAuditItem'
    };
  }

  // Create evidence link record
  const linkId = `evidence-link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const evidenceLink = {
    linkId,
    evidenceId,
    evidenceType: evidenceType || EVIDENCE_TYPES.AUDIT_NOTE,
    evidenceLocation,
    evidenceTitle,
    evidenceDate,
    sectionId,
    agentId,
    linkedToAuditItem,
    relevanceRating,
    description,
    amountInvolved,
    linkedDate: new Date().toISOString(),
    status: 'active',
    isaCompliant: true, // Supports ISA 230 documentation
    retentionRequirement: '6 years', // Per ISA 230
    auditFileReference: `${sectionId}-${linkedToAuditItem}-${evidenceId}`
  };

  // Store evidence link
  if (!evidenceRegistry.has(sectionId)) {
    evidenceRegistry.set(sectionId, []);
  }
  evidenceRegistry.get(sectionId).push(evidenceLink);

  return {
    success: true,
    message: `Evidence linked to audit finding`,
    data: evidenceLink
  };
}

/**
 * Get all evidence linked to a specific section/FSLI
 * @param {string} sectionId - FSLI identifier
 * @param {object} filters - Optional filters
 *   - evidenceType: Filter by evidence type
 *   - relevanceRating: Filter by relevance
 *   - agentId: Filter by agent who linked
 * @returns {array} Linked evidence records
 */
export function getEvidenceForSection(sectionId, filters = {}) {
  let evidence = evidenceRegistry.get(sectionId) || [];

  // Apply filters
  if (filters.evidenceType) {
    evidence = evidence.filter(e => e.evidenceType === filters.evidenceType);
  }

  if (filters.relevanceRating) {
    evidence = evidence.filter(e => e.relevanceRating === filters.relevanceRating);
  }

  if (filters.agentId) {
    evidence = evidence.filter(e => e.agentId === filters.agentId);
  }

  return evidence;
}

/**
 * Get evidence index for a section
 * Creates organized listing of all evidence with cross-references
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Organized evidence index
 */
export function generateEvidenceIndex(sectionId) {
  const evidence = getEvidenceForSection(sectionId);

  // Organize by type
  const byType = {};
  Object.values(EVIDENCE_TYPES).forEach(type => {
    byType[type] = evidence.filter(e => e.evidenceType === type);
  });

  // Organize by relevance
  const byRelevance = {
    'Critical': evidence.filter(e => e.relevanceRating === 'Critical'),
    'High': evidence.filter(e => e.relevanceRating === 'High'),
    'Medium': evidence.filter(e => e.relevanceRating === 'Medium'),
    'Low': evidence.filter(e => e.relevanceRating === 'Low')
  };

  // Organize by linked audit item
  const byItem = {};
  evidence.forEach(e => {
    if (!byItem[e.linkedToAuditItem]) {
      byItem[e.linkedToAuditItem] = [];
    }
    byItem[e.linkedToAuditItem].push(e);
  });

  return {
    sectionId,
    totalEvidenceItems: evidence.length,
    criticalEvidenceCount: byRelevance['Critical'].length,
    generatedDate: new Date().toISOString(),
    byEvidenceType: byType,
    byRelevanceRating: byRelevance,
    byAuditItem: byItem,
    readyForAuditFile: evidence.length > 0
  };
}

/**
 * Create evidence summary for a procedure
 * Shows what evidence supports a specific procedure conclusion
 * @param {string} sectionId - FSLI identifier
 * @param {string} procedureReference - Procedure identifier
 * @returns {object} Evidence summary for procedure
 */
export function getEvidenceForProcedure(sectionId, procedureReference) {
  const evidence = getEvidenceForSection(sectionId);
  const procedureEvidence = evidence.filter(e =>
    e.linkedToAuditItem === procedureReference ||
    e.description.includes(procedureReference)
  );

  if (procedureEvidence.length === 0) {
    return {
      procedureReference,
      sectionId,
      status: 'NO_EVIDENCE_LINKED',
      warning: 'This procedure has no linked evidence - audit documentation incomplete'
    };
  }

  // Calculate evidence strength
  const criticalCount = procedureEvidence.filter(e => e.relevanceRating === 'Critical').length;
  const highCount = procedureEvidence.filter(e => e.relevanceRating === 'High').length;
  const strengthScore = (criticalCount * 3 + highCount * 2) / procedureEvidence.length;

  return {
    procedureReference,
    sectionId,
    totalEvidenceItems: procedureEvidence.length,
    evidence: procedureEvidence,
    strengthScore: Math.round(strengthScore * 100) / 100, // Scale 0-3
    strengthLevel: strengthScore >= 2.5 ? 'Strong' : strengthScore >= 1.5 ? 'Adequate' : 'Weak',
    readyForAuditFile: procedureEvidence.length >= 1
  };
}

/**
 * Validate evidence sufficiency for a section
 * Ensures adequate evidence is linked for all audit work
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Evidence sufficiency validation
 */
export function validateEvidenceSufficiency(sectionId) {
  const index = generateEvidenceIndex(sectionId);

  const issues = [];

  if (index.totalEvidenceItems === 0) {
    issues.push('No evidence linked to this section');
  }

  if (index.criticalEvidenceCount === 0) {
    issues.push('No critical evidence linked - ensure supporting evidence for major transactions');
  }

  const criticalAndHighCount = index.byRelevance['Critical'].length + index.byRelevance['High'].length;
  if (criticalAndHighCount < Math.ceil(index.totalEvidenceItems * 0.5)) {
    issues.push('Less than 50% of evidence rated critical or high - review relevance ratings');
  }

  return {
    sectionId,
    totalEvidence: index.totalEvidenceItems,
    sufficient: issues.length === 0,
    isaCompliant: issues.length === 0, // ISA 230 requirement
    issues,
    strengthAssessment: criticalAndHighCount > 0 ? 'Acceptable' : 'Needs Strengthening'
  };
}

/**
 * Create evidence cross-reference for working papers
 * Links evidence locations in the audit file structure
 * @param {string} sectionId - FSLI identifier
 * @param {string} evidenceLocation - File path or reference
 * @returns {string} Formatted cross-reference for working paper
 */
export function formatEvidenceCrossReference(sectionId, evidenceLocation) {
  const evidence = getEvidenceForSection(sectionId);
  const matchingEvidence = evidence.find(e => e.evidenceLocation === evidenceLocation);

  if (!matchingEvidence) {
    return null;
  }

  return {
    workingPaperReference: `${sectionId} - ${matchingEvidence.linkedToAuditItem}`,
    evidenceFile: matchingEvidence.evidenceTitle,
    fileLocation: matchingEvidence.evidenceLocation,
    linkId: matchingEvidence.linkId,
    relevance: matchingEvidence.relevanceRating,
    linkedBy: matchingEvidence.agentId,
    linkedDate: matchingEvidence.linkedDate
  };
}

/**
 * Export evidence index for inclusion in Excel/Word documents
 * Creates structured data for document generation
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Exportable evidence index
 */
export function exportEvidenceIndex(sectionId) {
  const index = generateEvidenceIndex(sectionId);
  const evidence = getEvidenceForSection(sectionId);

  const exportData = {
    sectionId,
    exportDate: new Date().toISOString(),
    totalEvidenceItems: evidence.length,
    evidenceItems: evidence.map((e, idx) => ({
      '#': idx + 1,
      'Evidence ID': e.evidenceId,
      'Title': e.evidenceTitle,
      'Type': e.evidenceType,
      'Relevance': e.relevanceRating,
      'Linked To': e.linkedToAuditItem,
      'Location': e.evidenceLocation,
      'Date': e.evidenceDate,
      'Amount': e.amountInvolved > 0 ? `£${e.amountInvolved.toLocaleString()}` : 'N/A',
      'Description': e.description
    })),
    summary: {
      'Critical Evidence': index.byRelevance['Critical'].length,
      'High Relevance': index.byRelevance['High'].length,
      'Medium Relevance': index.byRelevance['Medium'].length,
      'Low Relevance': index.byRelevance['Low'].length,
      'Total Amount': evidence.reduce((sum, e) => sum + e.amountInvolved, 0)
    }
  };

  return exportData;
}

/**
 * Get evidence statistics for section
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Evidence statistics
 */
export function getEvidenceStatistics(sectionId) {
  const evidence = getEvidenceForSection(sectionId);
  const totalAmount = evidence.reduce((sum, e) => sum + e.amountInvolved, 0);
  const byAgent = {};

  evidence.forEach(e => {
    if (!byAgent[e.agentId]) {
      byAgent[e.agentId] = 0;
    }
    byAgent[e.agentId] += 1;
  });

  return {
    sectionId,
    totalEvidenceItems: evidence.length,
    totalAmountInvolved: totalAmount,
    averageAmountPerItem: evidence.length > 0 ? totalAmount / evidence.length : 0,
    evidenceTypeBreakdown: getEvidenceByType(sectionId),
    agentContribution: byAgent,
    dateRange: {
      earliest: evidence.length > 0 ? Math.min(...evidence.map(e => new Date(e.evidenceDate).getTime())) : null,
      latest: evidence.length > 0 ? Math.max(...evidence.map(e => new Date(e.evidenceDate).getTime())) : null
    }
  };
}

/**
 * Get evidence count by type
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Count by evidence type
 */
function getEvidenceByType(sectionId) {
  const evidence = getEvidenceForSection(sectionId);
  const counts = {};

  evidence.forEach(e => {
    counts[e.evidenceType] = (counts[e.evidenceType] || 0) + 1;
  });

  return counts;
}

export default {
  linkEvidenceToFinding,
  getEvidenceForSection,
  generateEvidenceIndex,
  getEvidenceForProcedure,
  validateEvidenceSufficiency,
  formatEvidenceCrossReference,
  exportEvidenceIndex,
  getEvidenceStatistics,
  EVIDENCE_TYPES
};
