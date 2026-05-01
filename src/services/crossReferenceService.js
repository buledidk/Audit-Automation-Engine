/**
 * crossReferenceService.js
 *
 * INTERLINKING ENGINE — Cross-Reference Service
 * FRC Audit Quality Review Compliant
 *
 * Every finding, misstatement, and judgment raised in any section of an audit file
 * auto-propagates to all related sections. This is critical for FRC AQR compliance.
 *
 * Architecture: Central FindingRegistry (Map) with section-subscriber notifications.
 */

// ---------------------------------------------------------------------------
// CROSS-REFERENCE MAP
// Defines which sections are affected when a finding is raised in each FSLI.
// ---------------------------------------------------------------------------
const CROSS_REFERENCE_MAP = {
  revenue: {
    affects: ['trade_debtors', 'provisions', 'tax', 'audit_differences', 'going_concern', 'related_parties'],
    reason: {
      trade_debtors: 'Revenue misstatement may affect debtor valuation and recoverability',
      provisions: 'Revenue cut-off may create unrecorded liabilities or premature recognition',
      tax: 'Revenue misstatement affects corporation tax computation',
      audit_differences: 'All revenue findings auto-populate audit differences schedule',
      going_concern: 'Significant revenue issues may affect going concern assessment',
      related_parties: 'Revenue from related parties requires ISA 550 scrutiny'
    }
  },
  trade_debtors: {
    affects: ['revenue', 'provisions', 'tax', 'going_concern', 'audit_differences', 'financial_instruments'],
    reason: {
      revenue: 'Debtor issues may indicate revenue recognition problems',
      provisions: 'Bad debt provisions affect both debtors and P&L',
      tax: 'Bad debt deductions require tax treatment assessment',
      going_concern: 'Debtor recoverability directly affects liquidity',
      audit_differences: 'All debtor findings populate differences schedule',
      financial_instruments: 'IFRS 9 ECL model links debtors to financial instruments section'
    }
  },
  inventory: {
    affects: ['trade_creditors', 'tax', 'provisions', 'revenue', 'audit_differences', 'going_concern'],
    reason: {
      trade_creditors: 'Inventory count cut-off links to payables cut-off',
      tax: 'Inventory write-downs affect tax computation',
      provisions: 'Obsolescence provisions link to provisions section',
      revenue: 'Inventory count affects cost of sales and gross margin',
      audit_differences: 'All inventory findings populate differences schedule',
      going_concern: 'Excess/obsolete inventory affects liquidity'
    }
  },
  ppe: {
    affects: ['tax', 'provisions', 'leases', 'intangibles', 'audit_differences', 'going_concern'],
    reason: {
      tax: 'PPE depreciation differs from capital allowances — deferred tax impact',
      provisions: 'Impairment provisions link to IAS 36 impairment section',
      leases: 'ROU assets under IFRS 16 link to PPE presentation',
      intangibles: 'Capitalisation threshold distinguishes PPE from intangibles',
      audit_differences: 'PPE findings auto-populate differences schedule',
      going_concern: 'Asset impairment affects net asset position and going concern'
    }
  },
  trade_creditors: {
    affects: ['inventory', 'provisions', 'tax', 'audit_differences', 'going_concern'],
    reason: {
      inventory: 'Creditor cut-off links to inventory cut-off',
      provisions: 'Accruals may overlap with provisions',
      tax: 'Unrecorded liabilities affect tax computation',
      audit_differences: 'All creditor findings populate differences schedule',
      going_concern: 'Creditor pressure is a going concern indicator'
    }
  },
  provisions: {
    affects: ['trade_creditors', 'tax', 'trade_debtors', 'going_concern', 'audit_differences'],
    reason: {
      trade_creditors: 'Legal provisions may also be accruals in trade creditors',
      tax: 'Provisions timing differences create deferred tax',
      trade_debtors: 'Bad debt provisions link to debtor valuation',
      going_concern: 'Large provisions may indicate going concern risk',
      audit_differences: 'All provision findings populate differences schedule'
    }
  },
  payroll: {
    affects: ['tax', 'provisions', 'going_concern', 'audit_differences', 'related_parties'],
    reason: {
      tax: 'PAYE/NIC liabilities, benefits-in-kind, and payroll taxes',
      provisions: 'Holiday pay accruals and bonus provisions',
      going_concern: 'Payroll represents largest cash outflow for many entities',
      audit_differences: 'Payroll findings populate differences schedule',
      related_parties: "Directors' remuneration is a related party transaction"
    }
  },
  tax: {
    affects: ['ppe', 'provisions', 'trade_debtors', 'going_concern', 'audit_differences'],
    reason: {
      ppe: 'Capital allowances vs depreciation — deferred tax',
      provisions: 'Non-deductible provisions create deferred tax assets',
      trade_debtors: 'Bad debt relief affects tax',
      going_concern: 'Tax liabilities affect cash flow and going concern',
      audit_differences: 'Tax findings populate differences schedule'
    }
  },
  intangibles: {
    affects: ['ppe', 'tax', 'going_concern', 'audit_differences', 'provisions'],
    reason: {
      ppe: 'Capitalisation boundary between PPE and intangibles',
      tax: 'Intangible amortisation may not be tax deductible',
      going_concern: 'Goodwill impairment signals deteriorating business',
      audit_differences: 'Intangible findings populate differences schedule',
      provisions: 'Impairment may create tax timing differences'
    }
  },
  leases: {
    affects: ['ppe', 'trade_creditors', 'tax', 'going_concern', 'audit_differences'],
    reason: {
      ppe: 'ROU assets presented within PPE per IFRS 16',
      trade_creditors: 'Short-term lease payments may be in creditors',
      tax: 'IFRS 16 adjustments affect taxable profit',
      going_concern: 'Lease liabilities affect debt burden and going concern',
      audit_differences: 'Lease findings populate differences schedule'
    }
  },
  financial_instruments: {
    affects: ['trade_debtors', 'trade_creditors', 'provisions', 'tax', 'going_concern', 'audit_differences'],
    reason: {
      trade_debtors: 'IFRS 9 ECL model applies to financial assets including debtors',
      trade_creditors: 'Financial liabilities measurement',
      provisions: 'Expected loss provisions',
      tax: 'Fair value movements may affect tax',
      going_concern: 'Derivative liabilities and net debt affect going concern',
      audit_differences: 'FI findings populate differences schedule'
    }
  },
  going_concern: {
    affects: ['provisions', 'trade_debtors', 'inventory', 'ppe', 'intangibles', 'audit_differences'],
    reason: {
      provisions: 'Going concern doubt requires additional provisions (wind-down costs)',
      trade_debtors: 'Going concern affects recoverability of debtors',
      inventory: 'Going concern affects NRV of inventory',
      ppe: 'Going concern affects asset carrying values (no break-up basis)',
      intangibles: 'Going concern affects goodwill recoverable amount',
      audit_differences: 'Going concern conclusion affects entire audit differences'
    }
  },
  related_parties: {
    affects: ['revenue', 'trade_debtors', 'trade_creditors', 'payroll', 'audit_differences'],
    reason: {
      revenue: "Related party sales must be at arm's length per IAS 24",
      trade_debtors: 'Related party debtors may have different recoverability',
      trade_creditors: 'Related party creditors must be disclosed',
      payroll: "Directors' remuneration is a key related party transaction",
      audit_differences: 'Related party findings populate differences schedule'
    }
  }
};

// ---------------------------------------------------------------------------
// FINDING TYPE DISPLAY LABELS
// ---------------------------------------------------------------------------
const FINDING_TYPE_LABELS = {
  misstatement: 'Misstatement',
  control_deficiency: 'Control Deficiency',
  risk_indicator: 'Risk Indicator',
  disclosure_issue: 'Disclosure Issue',
  limitation: 'Limitation of Scope'
};


// ---------------------------------------------------------------------------
// HELPER UTILITIES
// ---------------------------------------------------------------------------

/**
 * Generate a short base-36 timestamp suffix.
 * @returns {string}
 */
function shortTimestampId() {
  return Date.now().toString(36).toUpperCase();
}

/**
 * Deep-clone a plain object / array using JSON round-trip.
 * @param {*} value
 * @returns {*}
 */
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Safely retrieve a value from localStorage; returns null on errors or SSR.
 * @param {string} key
 * @returns {*|null}
 */
function localStorageGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Safely persist a value to localStorage.
 * @param {string} key
 * @param {*} value
 */
function localStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently swallow — localStorage may be unavailable (SSR / quota exceeded).
  }
}

// ---------------------------------------------------------------------------
// CROSS-REFERENCE RECORD
// ---------------------------------------------------------------------------

/**
 * Represents a single cross-reference link from a source finding to a target section.
 * @typedef {Object} CrossReferenceRecord
 * @property {string}  findingId       - ID of the originating finding.
 * @property {string}  sourceSection   - FSLI where the finding originated.
 * @property {string}  targetSection   - FSLI that is affected.
 * @property {string}  reason          - Human-readable linkage reason.
 * @property {string}  findingType     - Type of finding.
 * @property {string}  riskLevel       - Risk level of the originating finding.
 * @property {string}  createdAt       - ISO timestamp.
 */

// ---------------------------------------------------------------------------
// CrossReferenceService
// ---------------------------------------------------------------------------

export class CrossReferenceService {
  constructor() {
    /** @type {Map<string, Object>} findingId -> FindingRecord */
    this.findingRegistry = new Map();

    /** @type {Map<string, Set<Function>>} sectionKey -> Set of callbacks */
    this.sectionSubscribers = new Map();

    /** @type {Map<string, Set<string>>} findingId -> Set of affected sectionIds */
    this.crossRefs = new Map();

    /** @type {string|null} */
    this.engagementId = null;
  }

  // -------------------------------------------------------------------------
  // initialize
  // -------------------------------------------------------------------------

  /**
   * Initialise the service for a given engagement.
   * Loads any previously persisted findings from localStorage.
   *
   * @param {string} engagementId - Unique identifier for the audit engagement.
   */
  initialize(engagementId) {
    if (!engagementId || typeof engagementId !== 'string') {
      throw new Error('CrossReferenceService.initialize: engagementId must be a non-empty string.');
    }

    this.engagementId = engagementId;

    // Clear in-memory state before reloading.
    this.findingRegistry.clear();
    this.crossRefs.clear();
    // Preserve subscribers — they are registered at component mount time and
    // should survive a re-initialise (e.g., hot reload / re-login scenario).

    const storageKey = `xref_${engagementId}`;
    const persisted = localStorageGet(storageKey);

    if (persisted && Array.isArray(persisted.findings)) {
      for (const finding of persisted.findings) {
        // Re-hydrate without triggering subscriber notifications or re-saving.
        this._hydrateExistingFinding(finding);
      }
    }
  }

  // -------------------------------------------------------------------------
  // registerFinding
  // -------------------------------------------------------------------------

  /**
   * Register a new finding and propagate cross-references to all affected sections.
   *
   * @param {Object} finding - Finding data object.
   * @returns {Object} The registered finding with cross-references attached.
   */
  registerFinding(finding) {
    this._assertInitialised('registerFinding');
    this._validateFinding(finding);

    // Auto-generate ID if not provided.
    const id = finding.id || this._generateFindingId(finding.sourceSection);

    const record = {
      id,
      sourceSection: finding.sourceSection,
      sourceProcedure: finding.sourceProcedure || '',
      findingType: finding.findingType,
      description: finding.description,
      amount: finding.amount ?? null,
      amountType: finding.amountType ?? null,
      isAdjusted: finding.isAdjusted ?? false,
      isaReference: finding.isaReference || '',
      assertion: Array.isArray(finding.assertion) ? [...finding.assertion] : [],
      riskLevel: finding.riskLevel || 'medium',
      preparedBy: finding.preparedBy || '',
      preparedDate: finding.preparedDate || new Date().toISOString(),
      workingPaperRef: finding.workingPaperRef || '',
      relatedFindings: Array.isArray(finding.relatedFindings) ? [...finding.relatedFindings] : [],
      registeredAt: new Date().toISOString(),
      crossReferences: []
    };

    // Build cross-references.
    const affectedSections = this.getAffectedSections(record.sourceSection, record.findingType);

    const crossReferenceLinks = affectedSections.map(({ sectionId, reason }) => ({
      findingId: record.id,
      sourceSection: record.sourceSection,
      targetSection: sectionId,
      reason,
      findingType: record.findingType,
      riskLevel: record.riskLevel,
      createdAt: record.registeredAt
    }));

    record.crossReferences = crossReferenceLinks;

    // Store in registry.
    this.findingRegistry.set(record.id, record);

    // Update crossRefs map.
    const affectedSet = new Set(affectedSections.map(a => a.sectionId));
    this.crossRefs.set(record.id, affectedSet);

    // Notify subscribers.
    for (const sectionId of affectedSet) {
      this._notifySubscribers(sectionId, { type: 'FINDING_ADDED', finding: record });
    }
    // Also notify source section itself.
    this._notifySubscribers(record.sourceSection, { type: 'FINDING_ADDED', finding: record });

    // Persist.
    this._persist();

    return deepClone(record);
  }

  // -------------------------------------------------------------------------
  // getAffectedSections
  // -------------------------------------------------------------------------

  /**
   * Returns the list of sections affected by a finding in the given source section.
   *
   * @param {string} sourceSection  - The FSLI where the finding originates.
   * @param {string} [findingType]  - Finding type (reserved for future type-based filtering).
   * @returns {Array<{sectionId: string, reason: string}>}
   */
  getAffectedSections(sourceSection, _findingType) {
    const mapping = CROSS_REFERENCE_MAP[sourceSection];
    if (!mapping) {
      return [];
    }

    return mapping.affects.map(sectionId => ({
      sectionId,
      reason: mapping.reason[sectionId] || `Finding in ${sourceSection} may affect ${sectionId}`
    }));
  }

  // -------------------------------------------------------------------------
  // getCrossReferencesForSection
  // -------------------------------------------------------------------------

  /**
   * Returns all findings that reference (affect) the given section,
   * grouped by source section.
   *
   * @param {string} sectionId - The FSLI to look up.
   * @returns {Object} Keys are source section names; values are arrays of findings.
   */
  getCrossReferencesForSection(sectionId) {
    this._assertInitialised('getCrossReferencesForSection');

    const grouped = {};

    for (const [, finding] of this.findingRegistry) {
      const isSource = finding.sourceSection === sectionId;
      const isTarget = this.crossRefs.has(finding.id) && this.crossRefs.get(finding.id).has(sectionId);

      if (isTarget && !isSource) {
        const src = finding.sourceSection;
        if (!grouped[src]) grouped[src] = [];
        grouped[src].push(deepClone(finding));
      }
    }

    return grouped;
  }

  // -------------------------------------------------------------------------
  // getCrossReferenceAlert
  // -------------------------------------------------------------------------

  /**
   * Returns a formatted alert string listing findings that affect this section.
   *
   * @param {string} sectionId
   * @returns {string}
   */
  getCrossReferenceAlert(sectionId) {
    this._assertInitialised('getCrossReferenceAlert');

    const grouped = this.getCrossReferencesForSection(sectionId);
    const sourceKeys = Object.keys(grouped);

    if (sourceKeys.length === 0) {
      return `No cross-referenced findings currently affect the ${sectionId} section.`;
    }

    const totalCount = sourceKeys.reduce((sum, k) => sum + grouped[k].length, 0);
    const sectionList = sourceKeys
      .map(src => `${src.replace(/_/g, ' ')} (${grouped[src].length})`)
      .join(', ');

    return `\u26A0\uFE0F [${totalCount}] finding${totalCount !== 1 ? 's' : ''} in other sections may affect this section: ${sectionList}`;
  }

  // -------------------------------------------------------------------------
  // updateFinding
  // -------------------------------------------------------------------------

  /**
   * Update an existing finding and re-propagate to all affected sections.
   *
   * @param {string} findingId - ID of the finding to update.
   * @param {Object} updates   - Partial finding fields to update.
   * @returns {Object} The updated finding record.
   */
  updateFinding(findingId, updates) {
    this._assertInitialised('updateFinding');

    if (!this.findingRegistry.has(findingId)) {
      throw new Error(`CrossReferenceService.updateFinding: Finding '${findingId}' not found.`);
    }

    const existing = this.findingRegistry.get(findingId);

    // Remove old cross-references so we can re-compute.
    const oldAffected = this.crossRefs.get(findingId) || new Set();

    // Merge updates.
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // ID is immutable.
      updatedAt: new Date().toISOString()
    };

    // Re-compute affected sections.
    const affectedSections = this.getAffectedSections(updated.sourceSection, updated.findingType);
    const newAffectedSet = new Set(affectedSections.map(a => a.sectionId));

    updated.crossReferences = affectedSections.map(({ sectionId, reason }) => ({
      findingId: updated.id,
      sourceSection: updated.sourceSection,
      targetSection: sectionId,
      reason,
      findingType: updated.findingType,
      riskLevel: updated.riskLevel,
      createdAt: updated.registeredAt
    }));

    this.findingRegistry.set(findingId, updated);
    this.crossRefs.set(findingId, newAffectedSet);

    // Notify all previously and newly affected sections.
    const allAffected = new Set([...oldAffected, ...newAffectedSet, updated.sourceSection]);
    for (const sectionId of allAffected) {
      this._notifySubscribers(sectionId, { type: 'FINDING_UPDATED', finding: deepClone(updated) });
    }

    this._persist();

    return deepClone(updated);
  }

  // -------------------------------------------------------------------------
  // removeFinding
  // -------------------------------------------------------------------------

  /**
   * Remove a finding from the registry and all cross-references.
   * Notifies all previously affected subscribers.
   *
   * @param {string} findingId - ID of the finding to remove.
   * @returns {boolean} True if finding was found and removed, false otherwise.
   */
  removeFinding(findingId) {
    this._assertInitialised('removeFinding');

    if (!this.findingRegistry.has(findingId)) {
      return false;
    }

    const finding = this.findingRegistry.get(findingId);
    const affectedSections = this.crossRefs.get(findingId) || new Set();

    this.findingRegistry.delete(findingId);
    this.crossRefs.delete(findingId);

    // Notify all previously affected sections.
    const allToNotify = new Set([...affectedSections, finding.sourceSection]);
    for (const sectionId of allToNotify) {
      this._notifySubscribers(sectionId, { type: 'FINDING_REMOVED', findingId, sourceSection: finding.sourceSection });
    }

    this._persist();

    return true;
  }

  // -------------------------------------------------------------------------
  // subscribeToSection
  // -------------------------------------------------------------------------

  /**
   * Register a callback that fires whenever a cross-reference affecting the
   * given section changes.
   *
   * @param {string}   sectionId - The FSLI to subscribe to.
   * @param {Function} callback  - fn(event) where event = { type, finding?, findingId? }
   * @returns {Function} Unsubscribe function.
   */
  subscribeToSection(sectionId, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('CrossReferenceService.subscribeToSection: callback must be a function.');
    }

    if (!this.sectionSubscribers.has(sectionId)) {
      this.sectionSubscribers.set(sectionId, new Set());
    }

    this.sectionSubscribers.get(sectionId).add(callback);

    // Return unsubscribe function.
    return () => {
      const subscribers = this.sectionSubscribers.get(sectionId);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.sectionSubscribers.delete(sectionId);
        }
      }
    };
  }

  // -------------------------------------------------------------------------
  // getAuditDifferencesSchedule
  // -------------------------------------------------------------------------

  /**
   * Returns all findings flagged as misstatements, sorted by:
   * 1. Adjusted before unadjusted
   * 2. Source section (alphabetical)
   * 3. Amount descending
   *
   * @returns {Array<Object>} Sorted array of misstatement findings.
   */
  getAuditDifferencesSchedule() {
    this._assertInitialised('getAuditDifferencesSchedule');

    const misstatements = [];

    for (const [, finding] of this.findingRegistry) {
      if (finding.findingType === 'misstatement') {
        misstatements.push({
          ...deepClone(finding),
          affectedSectionsList: Array.from(this.crossRefs.get(finding.id) || []),
          isaReference: finding.isaReference,
          auditConclusion: this._deriveAuditConclusion(finding)
        });
      }
    }

    misstatements.sort((a, b) => {
      // 1. Adjusted first.
      if (a.isAdjusted !== b.isAdjusted) {
        return a.isAdjusted ? -1 : 1;
      }
      // 2. Section alphabetical.
      if (a.sourceSection < b.sourceSection) return -1;
      if (a.sourceSection > b.sourceSection) return 1;
      // 3. Amount descending (nulls last).
      const amtA = a.amount ?? 0;
      const amtB = b.amount ?? 0;
      return amtB - amtA;
    });

    return misstatements;
  }

  // -------------------------------------------------------------------------
  // getMaterialityAssessment
  // -------------------------------------------------------------------------

  /**
   * Perform a full materiality assessment across all misstatement findings.
   *
   * @param {number} materiality            - Overall materiality (£).
   * @param {number} performanceMateriality - Performance materiality (£).
   * @param {number} trivialThreshold       - Clearly trivial threshold (£).
   * @returns {Object} Full materiality assessment with totals and recommendations.
   */
  getMaterialityAssessment(materiality, performanceMateriality, trivialThreshold) {
    this._assertInitialised('getMaterialityAssessment');

    if (typeof materiality !== 'number' || materiality <= 0) {
      throw new TypeError('getMaterialityAssessment: materiality must be a positive number.');
    }
    if (typeof performanceMateriality !== 'number' || performanceMateriality <= 0) {
      throw new TypeError('getMaterialityAssessment: performanceMateriality must be a positive number.');
    }
    if (typeof trivialThreshold !== 'number' || trivialThreshold < 0) {
      throw new TypeError('getMaterialityAssessment: trivialThreshold must be a non-negative number.');
    }

    const schedule = this.getAuditDifferencesSchedule();

    let totalLikelyAdjusted = 0;
    let totalLikelyUnadjusted = 0;
    let totalPossibleUnadjusted = 0;

    const itemAssessments = schedule.map(finding => {
      const amount = finding.amount ?? 0;
      const absAmount = Math.abs(amount);
      const isClearlyTrivial = absAmount <= trivialThreshold;
      const isIndividuallyMaterial = absAmount > materiality;
      const isAbovePerformanceMateriality = absAmount > performanceMateriality;

      if (finding.isAdjusted) {
        if (finding.amountType === 'likely') totalLikelyAdjusted += absAmount;
      } else {
        if (finding.amountType === 'likely') totalLikelyUnadjusted += absAmount;
        if (finding.amountType === 'possible') totalPossibleUnadjusted += absAmount;
      }

      let recommendation;
      if (isClearlyTrivial) {
        recommendation = 'Pass as clearly trivial — no further action required (ISA 320 para 14)';
      } else if (isIndividuallyMaterial) {
        recommendation = 'Material individually — require adjustment or qualify opinion (ISA 450 para 12)';
      } else if (isAbovePerformanceMateriality) {
        recommendation = 'Above performance materiality — consider adjustment; accumulate with other findings (ISA 450 para 5)';
      } else {
        recommendation = 'Below performance materiality — accumulate; monitor in aggregate (ISA 450 para 5)';
      }

      return {
        findingId: finding.id,
        sourceSection: finding.sourceSection,
        description: finding.description,
        amount,
        amountType: finding.amountType,
        isAdjusted: finding.isAdjusted,
        isClearlyTrivial,
        isIndividuallyMaterial,
        isAbovePerformanceMateriality,
        recommendation
      };
    });

    const totalLikelyMisstatements = totalLikelyAdjusted + totalLikelyUnadjusted;
    const isCumulativelyMaterial = totalLikelyUnadjusted > materiality;

    let overallRecommendation;
    if (isCumulativelyMaterial) {
      overallRecommendation =
        'Cumulative likely misstatements exceed overall materiality. Require management adjustments or issue qualified/adverse opinion (ISA 450 para 12(b)).';
    } else if (totalLikelyUnadjusted > performanceMateriality) {
      overallRecommendation =
        'Cumulative likely misstatements exceed performance materiality. Reassess whether additional procedures are needed (ISA 450 para 5).';
    } else {
      overallRecommendation =
        'Cumulative likely misstatements are below performance materiality. No qualification required on grounds of misstatement, subject to all other findings.';
    }

    return {
      materiality,
      performanceMateriality,
      trivialThreshold,
      totalLikelyAdjusted,
      totalLikelyUnadjusted,
      totalPossibleUnadjusted,
      totalLikelyMisstatements,
      isCumulativelyMaterial,
      overallRecommendation,
      items: itemAssessments,
      assessedAt: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------------------
  // generateCrossReferenceMatrix
  // -------------------------------------------------------------------------

  /**
   * Generate a 2-D matrix showing cross-reference counts between sections.
   *
   * @returns {{ sections: string[], matrix: number[][], findingsByCell: Map<string, Object[]> }}
   */
  generateCrossReferenceMatrix() {
    this._assertInitialised('generateCrossReferenceMatrix');

    // Collect all section IDs that appear as sources or targets.
    const sectionSet = new Set();
    for (const key of Object.keys(CROSS_REFERENCE_MAP)) {
      sectionSet.add(key);
      for (const affected of CROSS_REFERENCE_MAP[key].affects) {
        sectionSet.add(affected);
      }
    }
    const sections = Array.from(sectionSet).sort();
    const n = sections.length;
    const idx = {};
    sections.forEach((s, i) => { idx[s] = i; });

    // Initialise matrix.
    const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
    // findingsByCell: key = "rowIdx:colIdx", value = array of findings.
    const findingsByCell = new Map();

    for (const [, finding] of this.findingRegistry) {
      const srcIdx = idx[finding.sourceSection];
      if (srcIdx === undefined) continue;

      const affectedSections = this.crossRefs.get(finding.id) || new Set();
      for (const targetSection of affectedSections) {
        const tgtIdx = idx[targetSection];
        if (tgtIdx === undefined) continue;

        matrix[srcIdx][tgtIdx] += 1;
        const cellKey = `${srcIdx}:${tgtIdx}`;
        if (!findingsByCell.has(cellKey)) findingsByCell.set(cellKey, []);
        findingsByCell.get(cellKey).push(deepClone(finding));
      }
    }

    return { sections, matrix, findingsByCell };
  }

  // -------------------------------------------------------------------------
  // generateFindingNarrative
  // -------------------------------------------------------------------------

  /**
   * Auto-generate a complete FRC-quality narrative for a finding.
   *
   * @param {Object} finding - A finding record (from the registry or raw input).
   * @returns {string} Formatted narrative string.
   */
  generateFindingNarrative(finding) {
    const affectedSections = finding.crossReferences || [];
    const crossRefLines = affectedSections
      .map(ref => `  - ${ref.targetSection.replace(/_/g, ' ').toUpperCase()}: ${ref.reason}`)
      .join('\n');

    const assertions = Array.isArray(finding.assertion) && finding.assertion.length > 0
      ? finding.assertion.join(', ')
      : 'Not specified';

    const amountLine = finding.amount != null
      ? `£${Math.abs(finding.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })} (${finding.amountType || 'unclassified'})`
      : 'N/A — non-monetary finding';

    const classification = finding.amountType === 'likely'
      ? 'Likely misstatement'
      : finding.amountType === 'possible'
        ? 'Possible misstatement'
        : FINDING_TYPE_LABELS[finding.findingType] || finding.findingType;

    const requiredAction = this._determineRequiredAction(finding);

    const title = this._deriveFindingTitle(finding);

    return [
      `FINDING ${finding.id}: ${title}`,
      `${'─'.repeat(80)}`,
      `ISA Reference:          ${finding.isaReference || 'Not specified'}`,
      `Section:                ${finding.sourceSection.replace(/_/g, ' ').toUpperCase()}`,
      `Procedure:              ${finding.sourceProcedure || 'Not specified'}`,
      `Assertion(s) Tested:    ${assertions}`,
      ``,
      `Work Done:`,
      `  ${finding.description}`,
      ``,
      `Exception Found:`,
      `  ${finding.description}`,
      ``,
      `Amount:                 ${amountLine}`,
      `Classification:         ${classification}`,
      ``,
      `ISA Conclusion:`,
      `  ${this._deriveISAConclusion(finding)}`,
      ``,
      `Cross-References (${affectedSections.length} section${affectedSections.length !== 1 ? 's' : ''} affected):`,
      crossRefLines || '  None',
      ``,
      `Required Action:        ${requiredAction}`,
      ``,
      `Prepared By: ${finding.preparedBy || 'Not recorded'} | Date: ${finding.preparedDate ? new Date(finding.preparedDate).toLocaleDateString('en-GB') : 'Not recorded'}`,
      `Working Paper Ref:      ${finding.workingPaperRef || 'Not referenced'}`,
      `${'─'.repeat(80)}`
    ].join('\n');
  }

  // -------------------------------------------------------------------------
  // generateCompleteFindingsReport
  // -------------------------------------------------------------------------

  /**
   * Returns a complete findings memorandum covering all sections, cross-references,
   * audit differences, management points, and a recommended audit opinion.
   *
   * @param {string} [engagementId] - Defaults to current engagement.
   * @returns {Object} Complete findings report object.
   */
  generateCompleteFindingsReport(engagementId) {
    const eid = engagementId || this.engagementId;
    this._assertInitialised('generateCompleteFindingsReport');

    const allFindings = Array.from(this.findingRegistry.values());
    const misstatements = allFindings.filter(f => f.findingType === 'misstatement');
    const managementPoints = allFindings.filter(f => f.findingType !== 'misstatement');

    // Group findings by section.
    const findingsBySection = {};
    for (const finding of allFindings) {
      if (!findingsBySection[finding.sourceSection]) {
        findingsBySection[finding.sourceSection] = [];
      }
      findingsBySection[finding.sourceSection].push(deepClone(finding));
    }

    // Cross-reference summary.
    const crossRefSummary = {};
    for (const sectionId of Object.keys(CROSS_REFERENCE_MAP)) {
      const refs = this.getCrossReferencesForSection(sectionId);
      const count = Object.values(refs).reduce((sum, arr) => sum + arr.length, 0);
      if (count > 0) {
        crossRefSummary[sectionId] = { count, sources: Object.keys(refs) };
      }
    }

    // Audit differences schedule.
    const auditDifferences = this.getAuditDifferencesSchedule();

    // Recommended opinion.
    const recommendedOpinion = this._recommendOpinion(misstatements, allFindings);

    // Executive summary.
    const executiveSummary = this._buildExecutiveSummary(allFindings, misstatements, managementPoints, recommendedOpinion);

    return {
      engagementId: eid,
      generatedAt: new Date().toISOString(),
      executiveSummary,
      findingsBySection,
      crossReferenceSummary: crossRefSummary,
      auditDifferencesSchedule: auditDifferences,
      managementPoints: managementPoints.map(f => deepClone(f)),
      recommendedOpinion,
      totals: {
        total: allFindings.length,
        misstatements: misstatements.length,
        managementPoints: managementPoints.length,
        adjusted: misstatements.filter(f => f.isAdjusted).length,
        unadjusted: misstatements.filter(f => !f.isAdjusted).length
      }
    };
  }

  // -------------------------------------------------------------------------
  // PRIVATE METHODS
  // -------------------------------------------------------------------------

  /**
   * Assert that the service has been initialised before calling methods that
   * depend on an engagementId.
   * @param {string} callerName
   */
  _assertInitialised(callerName) {
    if (!this.engagementId) {
      throw new Error(
        `CrossReferenceService.${callerName}: Service must be initialised with an engagementId before use. Call initialize(engagementId) first.`
      );
    }
  }

  /**
   * Validate a finding object before registration.
   * @param {Object} finding
   */
  _validateFinding(finding) {
    if (!finding || typeof finding !== 'object') {
      throw new TypeError('registerFinding: finding must be an object.');
    }
    if (!finding.sourceSection || typeof finding.sourceSection !== 'string') {
      throw new TypeError('registerFinding: finding.sourceSection is required and must be a string.');
    }
    const validTypes = ['misstatement', 'control_deficiency', 'risk_indicator', 'disclosure_issue', 'limitation'];
    if (!validTypes.includes(finding.findingType)) {
      throw new TypeError(`registerFinding: finding.findingType must be one of: ${validTypes.join(', ')}`);
    }
    if (!finding.description || typeof finding.description !== 'string') {
      throw new TypeError('registerFinding: finding.description is required and must be a string.');
    }
    const wordCount = finding.description.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      throw new TypeError(
        `registerFinding: finding.description must be a minimum of 50 words for FRC compliance. Provided: ${wordCount} word(s).`
      );
    }
    const validRiskLevels = ['low', 'medium', 'high', 'significant'];
    if (finding.riskLevel && !validRiskLevels.includes(finding.riskLevel)) {
      throw new TypeError(`registerFinding: finding.riskLevel must be one of: ${validRiskLevels.join(', ')}`);
    }
  }

  /**
   * Generate a unique finding ID based on source section and timestamp.
   * @param {string} sourceSection
   * @returns {string}
   */
  _generateFindingId(sourceSection) {
    return `${sourceSection.toUpperCase()}-F${shortTimestampId()}`;
  }

  /**
   * Hydrate an existing finding without triggering notifications or re-saving.
   * Used when restoring from localStorage.
   * @param {Object} finding
   */
  _hydrateExistingFinding(finding) {
    this.findingRegistry.set(finding.id, finding);
    const affectedSections = this.getAffectedSections(finding.sourceSection, finding.findingType);
    this.crossRefs.set(finding.id, new Set(affectedSections.map(a => a.sectionId)));
  }

  /**
   * Notify all subscribers for a given section.
   * @param {string} sectionId
   * @param {Object} event
   */
  _notifySubscribers(sectionId, event) {
    const subscribers = this.sectionSubscribers.get(sectionId);
    if (!subscribers || subscribers.size === 0) return;

    for (const callback of subscribers) {
      try {
        callback(event);
      } catch (err) {
        console.error(`CrossReferenceService: subscriber error for section '${sectionId}':`, err);
      }
    }
  }

  /**
   * Persist all findings to localStorage.
   */
  _persist() {
    if (!this.engagementId) return;
    const storageKey = `xref_${this.engagementId}`;
    const findings = Array.from(this.findingRegistry.values());
    localStorageSet(storageKey, { findings, savedAt: new Date().toISOString() });
  }

  /**
   * Derive a short human-readable title for a finding.
   * @param {Object} finding
   * @returns {string}
   */
  _deriveFindingTitle(finding) {
    const typeLabel = FINDING_TYPE_LABELS[finding.findingType] || finding.findingType;
    const section = finding.sourceSection.replace(/_/g, ' ');
    const riskLabel = finding.riskLevel
      ? ` [${finding.riskLevel.toUpperCase()}]`
      : '';
    return `${section.charAt(0).toUpperCase()}${section.slice(1)} — ${typeLabel}${riskLabel}`;
  }

  /**
   * Derive an ISA-referenced conclusion for a finding.
   * @param {Object} finding
   * @returns {string}
   */
  _deriveISAConclusion(finding) {
    switch (finding.findingType) {
      case 'misstatement':
        if (finding.isAdjusted) {
          return `This misstatement has been adjusted by management. The revised figures have been verified and the adjustment is reflected in the audit differences schedule (ISA 450 para 5).`;
        }
        return `This represents an unadjusted misstatement under ISA 450. It must be accumulated with all other unadjusted misstatements and assessed against materiality. Management has been informed and has declined to adjust (ISA 450 para 8).`;
      case 'control_deficiency':
        return `A control deficiency has been identified. This will be communicated to those charged with governance in accordance with ISA 265 para 9. The deficiency has been assessed to determine whether it represents a significant deficiency.`;
      case 'risk_indicator':
        return `This matter has been identified as a risk indicator requiring enhanced audit scrutiny. Audit procedures have been extended in response to this indicator in accordance with ISA 330 para 6.`;
      case 'disclosure_issue':
        return `A disclosure issue has been identified. The financial statements must include adequate disclosure in accordance with the applicable financial reporting framework. Failure to disclose may result in a qualified or adverse opinion under ISA 705.`;
      case 'limitation':
        return `A limitation of scope has been identified. The auditor has been unable to obtain sufficient appropriate audit evidence in this area. A qualified opinion or disclaimer of opinion may be required under ISA 705 para 6.`;
      default:
        return `The impact of this finding on the audit opinion requires further assessment in accordance with ISA 450 and ISA 700.`;
    }
  }

  /**
   * Determine the required action for a finding.
   * @param {Object} finding
   * @returns {string}
   */
  _determineRequiredAction(finding) {
    switch (finding.findingType) {
      case 'misstatement':
        return finding.isAdjusted
          ? 'Verify management adjustment has been correctly implemented in final financial statements'
          : 'Request adjustment from management; if declined, accumulate in audit differences schedule and assess against materiality';
      case 'control_deficiency':
        return 'Document in management letter / report to those charged with governance (ISA 265). Assess impact on substantive testing strategy.';
      case 'risk_indicator':
        return 'Extend audit procedures in the affected area. Document enhanced response in audit plan.';
      case 'disclosure_issue':
        return 'Require management to include or correct the relevant disclosure. Review final financial statements before sign-off.';
      case 'limitation':
        return 'Consider the impact on the audit opinion. If pervasive, disclaim opinion; if material but not pervasive, qualify (ISA 705).';
      default:
        return 'Assess impact on audit opinion and document conclusion.';
    }
  }

  /**
   * Derive an audit conclusion label for use in the audit differences schedule.
   * @param {Object} finding
   * @returns {string}
   */
  _deriveAuditConclusion(finding) {
    if (finding.isAdjusted) return 'Adjusted — reflected in financial statements';
    if (finding.riskLevel === 'significant' || finding.riskLevel === 'high') {
      return 'Unadjusted — material risk; assess against overall materiality';
    }
    return 'Unadjusted — accumulate and assess in aggregate';
  }

  /**
   * Build a textual executive summary of all findings.
   * @param {Object[]} allFindings
   * @param {Object[]} misstatements
   * @param {Object[]} managementPoints
   * @param {Object}   recommendedOpinion
   * @returns {string}
   */
  _buildExecutiveSummary(allFindings, misstatements, managementPoints, recommendedOpinion) {
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const adjustedCount = misstatements.filter(f => f.isAdjusted).length;
    const unadjustedCount = misstatements.length - adjustedCount;

    const sectionsSeen = [...new Set(allFindings.map(f => f.sourceSection))];

    return [
      `FINDINGS MEMORANDUM`,
      `Engagement: ${this.engagementId} | Prepared: ${date}`,
      ``,
      `EXECUTIVE SUMMARY`,
      `─`.repeat(60),
      `This memorandum summarises ${allFindings.length} audit finding(s) identified across ${sectionsSeen.length} section(s) of the engagement.`,
      ``,
      `Misstatements identified:   ${misstatements.length} (${adjustedCount} adjusted, ${unadjustedCount} unadjusted)`,
      `Management points raised:   ${managementPoints.length}`,
      `Sections with findings:     ${sectionsSeen.map(s => s.replace(/_/g, ' ')).join(', ')}`,
      ``,
      `RECOMMENDED AUDIT OPINION`,
      `─`.repeat(60),
      `Opinion Type:   ${recommendedOpinion.opinionType}`,
      `Basis:          ${recommendedOpinion.basis}`,
      ``,
      `This memorandum has been prepared in accordance with ISA 450 (Evaluation of Misstatements Identified During the Audit), `,
      `ISA 265 (Communicating Deficiencies in Internal Control), and ISA 700 (Forming an Opinion and Reporting on Financial Statements).`
    ].join('\n');
  }

  /**
   * Determine the recommended audit opinion based on totality of findings.
   * @param {Object[]} misstatements
   * @param {Object[]} allFindings
   * @returns {{ opinionType: string, basis: string }}
   */
  _recommendOpinion(misstatements, allFindings) {
    const limitations = allFindings.filter(f => f.findingType === 'limitation');
    const highRisk = misstatements.filter(f => f.riskLevel === 'significant' || f.riskLevel === 'high');
    const unadjustedMaterial = misstatements.filter(
      f => !f.isAdjusted && (f.riskLevel === 'significant' || f.riskLevel === 'high')
    );

    if (limitations.length > 0 && limitations.some(f => f.riskLevel === 'significant')) {
      return {
        opinionType: 'Disclaimer of Opinion',
        basis: 'Significant limitation(s) of scope prevent the formation of an audit opinion. The possible effects are pervasive (ISA 705 para 9).'
      };
    }

    if (unadjustedMaterial.length > 0) {
      const pervasive = unadjustedMaterial.some(f => this._isPotentiallyPervasive(f));
      if (pervasive) {
        return {
          opinionType: 'Adverse Opinion',
          basis: 'Unadjusted material misstatement(s) are identified that are both material and pervasive to the financial statements (ISA 705 para 8).'
        };
      }
      return {
        opinionType: 'Qualified Opinion (Except For)',
        basis: 'Unadjusted material misstatement(s) are identified that are material but not pervasive. The opinion is qualified "except for" the matters described (ISA 705 para 7).'
      };
    }

    if (limitations.length > 0) {
      return {
        opinionType: 'Qualified Opinion (Limitation of Scope)',
        basis: 'Limitation of scope identified. The possible effects are material but not pervasive (ISA 705 para 6(b)).'
      };
    }

    if (highRisk.length > 0) {
      return {
        opinionType: 'Unmodified Opinion — with Emphasis of Matter',
        basis: 'No material unadjusted misstatements identified, however significant risk matters warrant an Emphasis of Matter paragraph (ISA 706 para 8).'
      };
    }

    return {
      opinionType: 'Unmodified Opinion',
      basis: 'No material unadjusted misstatements or pervasive limitations identified. The financial statements present a true and fair view (ISA 700 para 35).'
    };
  }

  /**
   * Heuristic to assess whether a finding may be pervasive.
   * A finding is treated as potentially pervasive if it affects 3 or more
   * sections (including audit_differences).
   * @param {Object} finding
   * @returns {boolean}
   */
  _isPotentiallyPervasive(finding) {
    const affected = this.crossRefs.get(finding.id);
    return affected ? affected.size >= 3 : false;
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

export const crossReferenceService = new CrossReferenceService();
export { CROSS_REFERENCE_MAP };
export default CrossReferenceService;
