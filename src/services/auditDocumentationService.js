/**
 * auditDocumentationService.js
 *
 * FRC-Quality Inline Documentation Service
 * ISA 300 / 315 / 320 / 330 / 450 / 530 / 700 / 705 / 706 Compliant
 *
 * Every procedure, finding, and judgment must be documentable at a standard
 * where an FRC Audit Quality Reviewer can understand everything without
 * asking questions.
 *
 * Documentation Standard — each item must answer:
 *  1. WHAT   — the risk/area being tested
 *  2. WHY    — significance (ISA/accounting standard basis)
 *  3. HOW    — procedures performed (with sample details)
 *  4. WHAT   — evidence obtained and results
 *  5. SO WHAT — conclusion and impact on audit opinion
 *  6. WHO    — preparer, reviewer, dates
 */

// ---------------------------------------------------------------------------
// ISA DOCUMENTATION REQUIREMENTS
// Minimum narrative word counts and required sub-sections per area.
// ---------------------------------------------------------------------------
const ISA_DOCUMENTATION_REQUIREMENTS = {
  planning: {
    minWordCount: 500,
    requiredSections: ['risk_assessment', 'materiality', 'team_briefing', 'fraud_discussion'],
    isaRef: 'ISA 300 para 12'
  },
  revenue: {
    minWordCount: 300,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 315 para 33'
  },
  trade_debtors: {
    minWordCount: 250,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  inventory: {
    minWordCount: 300,
    requiredSections: ['population', 'sampling', 'procedures', 'attendance', 'conclusions'],
    isaRef: 'ISA 501 para 4'
  },
  ppe: {
    minWordCount: 250,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  trade_creditors: {
    minWordCount: 250,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  provisions: {
    minWordCount: 300,
    requiredSections: ['population', 'procedures', 'expert_use', 'conclusions'],
    isaRef: 'ISA 540 para 13'
  },
  payroll: {
    minWordCount: 250,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  tax: {
    minWordCount: 250,
    requiredSections: ['population', 'procedures', 'deferred_tax', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  intangibles: {
    minWordCount: 300,
    requiredSections: ['population', 'procedures', 'impairment', 'conclusions'],
    isaRef: 'ISA 540 para 13'
  },
  leases: {
    minWordCount: 250,
    requiredSections: ['population', 'sampling', 'procedures', 'conclusions'],
    isaRef: 'ISA 330 para 20'
  },
  financial_instruments: {
    minWordCount: 300,
    requiredSections: ['population', 'procedures', 'fair_value', 'ecl_model', 'conclusions'],
    isaRef: 'ISA 540 para 13'
  },
  going_concern: {
    minWordCount: 500,
    requiredSections: ['procedures', 'indicators', 'management_assessment', 'conclusions', 'disclosure_adequacy'],
    isaRef: 'ISA 570 para 16'
  },
  related_parties: {
    minWordCount: 300,
    requiredSections: ['identification', 'procedures', 'arm_length_assessment', 'disclosure_review', 'conclusions'],
    isaRef: 'ISA 550 para 14'
  },
  completion: {
    minWordCount: 1000,
    requiredSections: ['findings_summary', 'going_concern', 'subsequent_events', 'independence', 'opinion_recommendation'],
    isaRef: 'ISA 700 para 26'
  },
  subsequent_events: {
    minWordCount: 200,
    requiredSections: ['procedures', 'events_identified', 'conclusions'],
    isaRef: 'ISA 560 para 6'
  }
};

// ---------------------------------------------------------------------------
// SECTION DISPLAY LABELS
// ---------------------------------------------------------------------------
const SECTION_LABELS = {
  revenue: 'Revenue',
  trade_debtors: 'Trade Debtors / Receivables',
  inventory: 'Inventory / Stock',
  ppe: 'Property, Plant & Equipment',
  trade_creditors: 'Trade Creditors / Payables',
  provisions: 'Provisions & Contingencies',
  payroll: 'Payroll & Employee Costs',
  tax: 'Taxation',
  intangibles: 'Intangible Assets & Goodwill',
  leases: 'Leases (IFRS 16)',
  financial_instruments: 'Financial Instruments (IFRS 9)',
  going_concern: 'Going Concern',
  related_parties: 'Related Parties',
  planning: 'Audit Planning',
  completion: 'Engagement Completion'
};

// ---------------------------------------------------------------------------
// RISK-LEVEL ISA REFERENCES
// ---------------------------------------------------------------------------
const RISK_ISA_CONTEXT = {
  low: 'Risk assessed as LOW. Analytical procedures and limited substantive testing are appropriate responses (ISA 330 para 17).',
  medium: 'Risk assessed as MEDIUM. A combination of tests of controls and substantive procedures is required (ISA 330 para 6).',
  high: 'Risk assessed as HIGH. Primarily substantive procedures are required; controls cannot be solely relied upon (ISA 330 para 7).',
  significant: 'Risk assessed as SIGNIFICANT. The auditor must design specific responses; controls reliance requires testing of operating effectiveness (ISA 315 para 27; ISA 330 para 15).'
};

// ---------------------------------------------------------------------------
// HELPER UTILITIES
// ---------------------------------------------------------------------------

/**
 * Return today's date in UK format (DD Month YYYY).
 * @returns {string}
 */
function ukDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Capitalise the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a snake_case key to human-readable label.
 * @param {string} key
 * @returns {string}
 */
function humanLabel(key) {
  return SECTION_LABELS[key] || capitalise(key.replace(/_/g, ' '));
}

/**
 * Count words in a string.
 * @param {string} text
 * @returns {number}
 */
function wordCount(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Generate a working paper reference code.
 * @param {string} engagementId
 * @param {string} section
 * @param {string} [suffix]
 * @returns {string}
 */
function generateWPRef(engagementId, section, suffix) {
  const engPart = (engagementId || 'ENG').replace(/\s+/g, '').toUpperCase().slice(0, 8);
  const secPart = section.replace(/_/g, '-').toUpperCase().slice(0, 10);
  const year = new Date().getFullYear();
  const suf = suffix ? `-${suffix}` : '';
  return `${engPart}/${year}/${secPart}${suf}`;
}

/**
 * Determine the ISA sampling methodology narrative based on population size.
 * @param {number} populationSize
 * @param {string} riskLevel
 * @returns {{ methodology: string, narrative: string }}
 */
function determineSamplingApproach(populationSize, riskLevel) {
  const riskMultiplier = { low: 0.8, medium: 1.0, high: 1.3, significant: 1.5 };
  const multiplier = riskMultiplier[riskLevel] || 1.0;

  let baseSize, methodology, stratification;

  if (populationSize <= 50) {
    baseSize = populationSize; // 100% testing.
    methodology = '100% testing (population too small to sample)';
    stratification = 'Not applicable — full population tested';
  } else if (populationSize <= 200) {
    baseSize = Math.ceil(25 * multiplier);
    methodology = 'Monetary Unit Sampling (MUS) — ISA 530 para 5';
    stratification = 'Stratified by value: items above 50% of performance materiality tested 100%; remainder sampled';
  } else {
    baseSize = Math.ceil(40 * multiplier);
    methodology = 'Stratified Monetary Unit Sampling (MUS) with systematic selection — ISA 530 para 5';
    stratification = 'Three strata: (1) individually significant items — 100% tested; (2) above performance materiality — MUS; (3) below performance materiality — statistical sample';
  }

  const narrative = `Sample selection was performed in accordance with ISA 530 (Audit Sampling). ${methodology}. The sample of ${baseSize} items was selected to provide a basis for conclusions about the population as a whole (ISA 530 para 8). ${stratification}.`;

  return { size: baseSize, methodology, stratification, narrative };
}

// ---------------------------------------------------------------------------
// AuditDocumentationService
// ---------------------------------------------------------------------------

export class AuditDocumentationService {

  // -------------------------------------------------------------------------
  // generateProcedureDocumentation
  // -------------------------------------------------------------------------

  /**
   * Generate a fully structured documentation record for a given procedure.
   *
   * @param {Object} procedure - The procedure object.
   * @param {Object} context   - Engagement context.
   * @param {Object} context.engagement     - Engagement object.
   * @param {string} context.fsli           - FSLI key.
   * @param {string} context.riskLevel      - Risk level.
   * @param {string} context.framework      - Financial reporting framework.
   * @param {string} context.preparedBy     - Preparer name.
   * @param {string} context.reviewedBy     - Reviewer name.
   * @returns {Object} Fully structured documentation record.
   */
  generateProcedureDocumentation(procedure, context = {}) {
    const {
      engagement = {},
      fsli = 'unknown',
      riskLevel = 'medium',
      framework = 'FRS 102',
      preparedBy = 'Not recorded',
      reviewedBy = 'Not recorded'
    } = context;

    const engagementId = engagement.id || engagement.engagementId || 'UNKNOWN';
    const engagementName = engagement.name || engagement.clientName || engagementId;
    const yearEnd = engagement.yearEnd || engagement.periodEnd || 'Not specified';
    const stage = procedure.stage || 'Fieldwork';
    const wpRef = procedure.wpRef || generateWPRef(engagementId, fsli);
    const now = new Date().toISOString();

    const populationSize = procedure.populationSize || 0;
    const samplingData = determineSamplingApproach(populationSize, riskLevel);

    const isaRefs = this._getISAReferences(fsli, riskLevel);
    const assertions = procedure.assertions || this._getDefaultAssertions(fsli);

    const riskBackground = this._buildRiskBackground(fsli, riskLevel, framework);
    const planningNarrative = this._buildPlanningNarrative(fsli, riskLevel, procedure);
    const populationDescription = this._buildPopulationDescription(fsli, procedure, engagement);
    const workDone = this._buildWorkDoneNarrative(fsli, procedure, riskLevel);
    const evidenceObtained = this._buildEvidenceList(fsli, procedure);
    const conclusionNarrative = this._buildConclusionNarrative(fsli, procedure, riskLevel);
    const impactOnAuditOpinion = this._buildOpinionImpact(fsli, procedure);

    // Exceptions.
    const exceptionsFound = Array.isArray(procedure.exceptions)
      ? procedure.exceptions.map(ex => this.generateExceptionRecord(ex))
      : [];

    // Cross-references.
    const crossReferences = Array.isArray(procedure.crossReferences)
      ? procedure.crossReferences
      : [];

    return {
      header: {
        wpRef,
        engagementName,
        fsli: humanLabel(fsli),
        stage,
        period: yearEnd,
        preparedBy,
        preparedDate: now,
        reviewedBy,
        reviewedDate: procedure.reviewedDate || null,
        isaReferences: isaRefs,
        assertions
      },
      riskBackground,
      planningNarrative,
      populationDescription,
      samplingApproach: samplingData.narrative,
      sampleDetails: {
        size: samplingData.size,
        method: samplingData.methodology,
        stratification: samplingData.stratification
      },
      workDone,
      evidenceObtained,
      exceptionsFound,
      conclusionNarrative,
      impactOnAuditOpinion,
      crossReferences
    };
  }

  // -------------------------------------------------------------------------
  // generateExceptionRecord
  // -------------------------------------------------------------------------

  /**
   * Create a fully documented exception record compliant with FRC standards.
   *
   * @param {Object} exception - Raw exception data.
   * @returns {Object} Fully structured exception record.
   */
  generateExceptionRecord(exception) {
    if (!exception || typeof exception !== 'object') {
      throw new TypeError('generateExceptionRecord: exception must be an object.');
    }

    const ref = exception.ref || `EX-${Date.now().toString(36).toUpperCase()}`;
    const amount = exception.amount ?? null;

    const isaAnalysis = this._buildISAExceptionAnalysis(exception);
    const auditorAssessment = this._buildAuditorAssessment(exception);
    const quantification = amount != null
      ? `Amount determined by ${exception.quantificationMethod || 'direct measurement from source documentation'}. Value: £${Math.abs(amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}.`
      : 'Non-monetary exception — no quantification applicable.';

    const classification = exception.classification || this._classifyException(exception);
    const recommendation = this._buildExceptionRecommendation(exception, classification);
    const requiredFollowUp = exception.requiredFollowUp || this._determineFollowUp(exception, classification);
    const crossRefToAD = classification === 'misstatement'
      ? `AD-${(exception.sourceSection || 'UNKNOWN').toUpperCase()}-${ref}`
      : 'N/A — not a misstatement';

    return {
      ref,
      description: exception.description || 'No description provided.',
      amount,
      isaAnalysis,
      managementExplanation: exception.managementExplanation || null,
      auditorAssessment,
      classification,
      quantification,
      recommendation,
      requiredFollowUp,
      crossReferenceToAD: crossRefToAD
    };
  }

  // -------------------------------------------------------------------------
  // generatePlanningMemorandum
  // -------------------------------------------------------------------------

  /**
   * Auto-generate a complete ISA 300/315/320 planning memorandum.
   *
   * @param {Object} engagement    - Engagement details.
   * @param {Object} planningData  - Planning inputs (risks, materiality, team, etc.)
   * @returns {string} Full professional narrative (minimum 1000 words when populated).
   */
  generatePlanningMemorandum(engagement, planningData = {}) {
    const {
      priorYearFindings = [],
      inherentRisks = [],
      controlEnvironment = {},
      materiality = {},
      significantRisks = [],
      teamMembers = [],
      fraudDiscussion = {},
      goingConcernInitial = {},
      plannedProceduresSummary = []
    } = planningData;

    const engName = engagement.name || engagement.clientName || 'Entity';
    const yearEnd = engagement.yearEnd || engagement.periodEnd || 'Period end not specified';
    const industry = engagement.industry || 'Not specified';
    const framework = engagement.framework || 'FRS 102';
    const engagementPartner = engagement.partner || 'Not specified';
    const auditManager = engagement.manager || 'Not specified';
    const date = ukDate();

    const overallMat = materiality.overall != null
      ? `£${materiality.overall.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`
      : 'Not yet determined';
    const perfMat = materiality.performance != null
      ? `£${materiality.performance.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`
      : 'Not yet determined';
    const trivialMat = materiality.trivial != null
      ? `£${materiality.trivial.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`
      : 'Not yet determined';
    const matBenchmark = materiality.benchmark || 'profit before tax';
    const matPercentage = materiality.percentage || 'Not specified';

    const controlEnvAssessment = controlEnvironment.assessment || 'medium';
    const controlEnvNarrative = controlEnvironment.narrative || 'The control environment has been assessed through enquiry of management and observation of control activities. Our assessment is reflected in the planned substantive testing approach.';

    const fraudDiscussionDate = fraudDiscussion.date ? ukDate(fraudDiscussion.date) : date;
    const fraudParticipants = fraudDiscussion.participants
      ? fraudDiscussion.participants.join(', ')
      : `${engagementPartner}, ${auditManager} and audit team`;
    const fraudRisksIdentified = Array.isArray(fraudDiscussion.risksIdentified)
      ? fraudDiscussion.risksIdentified
      : ['Revenue recognition (ISA 240 para A27)', 'Management override of controls (ISA 240 para 31)'];

    const gcConcern = goingConcernInitial.concern || false;
    const gcNarrative = goingConcernInitial.narrative || 'Initial review of management accounts and business plans has not identified any indicators that cast significant doubt on the entity\'s ability to continue as a going concern for the foreseeable future.';

    const teamLines = teamMembers.length > 0
      ? teamMembers.map(m => `  - ${m.name || 'Team Member'} (${m.role || 'Not specified'}) — ${m.responsibility || 'Responsibilities to be confirmed'}`).join('\n')
      : `  - ${engagementPartner} — Engagement Partner (ISA 220)\n  - ${auditManager} — Engagement Manager`;

    const sigRisksSection = significantRisks.length > 0
      ? significantRisks.map((r, i) =>
          `  ${i + 1}. ${r.area ? humanLabel(r.area) : 'Area not specified'}: ${r.description || 'Description not provided'}.\n     ISA 330 Response: ${r.response || 'Enhanced substantive procedures planned.'}`
        ).join('\n\n')
      : `  1. Revenue Recognition: Revenue has been identified as a significant risk in all audits by default under ISA 240 para A28. Specific procedures include detailed testing of cut-off, journal entry review, and analytical procedures.\n\n  2. Management Override of Controls: This is a significant risk in all audits under ISA 240 para 31. Procedures include unpredictable testing, journal entry review, and review of significant estimates.\n\n  3. Going Concern: Management's use of the going concern basis requires specific audit procedures under ISA 570 para 12.`;

    const inherentRisksSection = inherentRisks.length > 0
      ? inherentRisks.map(r => `  - ${r.area ? humanLabel(r.area) : 'Area'}: ${r.description || 'No description'}. Assessed as ${r.level || 'medium'} risk.`).join('\n')
      : '  Inherent risks have been assessed across all significant account balances and classes of transactions. The industry-specific risks associated with ' + industry + ' have been considered in the context of the entity\'s operations and the applicable financial reporting framework.';

    const priorYearSection = priorYearFindings.length > 0
      ? priorYearFindings.map(f => `  - ${f.description || 'Prior year finding'}: ${f.currentYearStatus || 'Status to be confirmed during current year audit.'}`).join('\n')
      : '  No significant prior year findings have been identified that require follow-up in the current year, or this is the first year of the engagement.';

    const plannedProcSection = plannedProceduresSummary.length > 0
      ? plannedProceduresSummary.map(p => `  - ${p.section ? humanLabel(p.section) : 'Section'}: ${p.approach || 'Substantive procedures'}`).join('\n')
      : '  Planned procedures are detailed in the individual section audit programmes. In summary, our approach is primarily substantive in nature, with limited reliance on controls, reflecting the control environment assessment above.';

    const memo = [
      `AUDIT PLANNING MEMORANDUM`,
      `${'═'.repeat(80)}`,
      ``,
      `ENGAGEMENT:             ${engName}`,
      `YEAR END:               ${yearEnd}`,
      `INDUSTRY:               ${industry}`,
      `FRAMEWORK:              ${framework}`,
      `ENGAGEMENT PARTNER:     ${engagementPartner}`,
      `AUDIT MANAGER:          ${auditManager}`,
      `DATE PREPARED:          ${date}`,
      `ISA REFERENCE:          ISA 300 (Planning an Audit of Financial Statements)`,
      ``,
      `${'═'.repeat(80)}`,
      `1. ENGAGEMENT BACKGROUND`,
      `${'─'.repeat(80)}`,
      ``,
      `${engName} (the "Entity") is engaged in the ${industry} industry. This planning memorandum has been prepared in accordance with ISA 300 para 12 and sets out our approach to the audit of the financial statements for the period ending ${yearEnd}.`,
      ``,
      `The applicable financial reporting framework is ${framework}. The objective of the audit is to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's report (ISA 200 para 3).`,
      ``,
      `PRIOR YEAR FINDINGS AND CONTINUITY MATTERS:`,
      priorYearSection,
      ``,
      `${'═'.repeat(80)}`,
      `2. RISK ASSESSMENT SUMMARY`,
      `${'─'.repeat(80)}`,
      ``,
      `INHERENT RISK ASSESSMENT (ISA 315):`,
      inherentRisksSection,
      ``,
      `CONTROL ENVIRONMENT ASSESSMENT:`,
      `The overall control environment has been assessed as: ${controlEnvAssessment.toUpperCase()}.`,
      ``,
      controlEnvNarrative,
      ``,
      `${'═'.repeat(80)}`,
      `3. MATERIALITY (ISA 320)`,
      `${'─'.repeat(80)}`,
      ``,
      `Materiality has been determined in accordance with ISA 320 (Materiality in Planning and Performing an Audit).`,
      ``,
      `OVERALL MATERIALITY:          ${overallMat}`,
      `BASIS:                        ${matPercentage}% of ${matBenchmark}`,
      `PERFORMANCE MATERIALITY:      ${perfMat}`,
      `CLEARLY TRIVIAL THRESHOLD:    ${trivialMat}`,
      ``,
      `JUSTIFICATION:`,
      `Overall materiality has been set at ${matPercentage}% of ${matBenchmark} as this represents the benchmark most likely to be used by users of the financial statements (ISA 320 para 11). Performance materiality has been set to reduce the probability that the aggregate of uncorrected and undetected misstatements exceeds overall materiality to an appropriately low level (ISA 320 para 11).`,
      ``,
      `Misstatements below ${trivialMat} will be treated as clearly trivial and will not be accumulated unless, in our professional judgment, they warrant accumulation (ISA 450 para 14).`,
      ``,
      `${'═'.repeat(80)}`,
      `4. SIGNIFICANT RISKS (ISA 315 para 27)`,
      `${'─'.repeat(80)}`,
      ``,
      `The following significant risks have been identified based on our risk assessment procedures. For each significant risk, specific substantive procedures have been designed in accordance with ISA 330 para 15:`,
      ``,
      sigRisksSection,
      ``,
      `${'═'.repeat(80)}`,
      `5. RESPONSES TO ASSESSED RISKS (ISA 330 para 5–8)`,
      `${'─'.repeat(80)}`,
      ``,
      `Our overall responses to the assessed risks of material misstatement are as follows:`,
      ``,
      `(a) Professional Scepticism: We have planned the audit with heightened professional scepticism given the identified risk areas. All team members have been briefed on the requirement to maintain professional scepticism throughout the engagement (ISA 200 para 15).`,
      ``,
      `(b) Team Assignment: We have assigned team members whose experience and competence are commensurate with the assessed risks (ISA 220 para 14).`,
      ``,
      `(c) Unpredictability: We have incorporated elements of unpredictability in our audit procedures, including unannounced testing and procedures not communicated in advance to management (ISA 330 para 4).`,
      ``,
      `(d) Timing: For higher risk areas, procedures have been planned at period end rather than at interim (ISA 330 para 22).`,
      ``,
      plannedProcSection,
      ``,
      `${'═'.repeat(80)}`,
      `6. TEAM ASSIGNMENT AND BRIEFING (ISA 220 para 14; ISA 300 para 11)`,
      `${'─'.repeat(80)}`,
      ``,
      `The following team members have been assigned to this engagement and have received an engagement briefing covering: audit objectives, significant risks, materiality, areas requiring professional judgment, and the requirement to maintain independence:`,
      ``,
      teamLines,
      ``,
      `All team members have confirmed their independence from the entity and their compliance with the firm's ethical requirements (IESBA Code; ES1–ES5).`,
      ``,
      `${'═'.repeat(80)}`,
      `7. FRAUD RISK DISCUSSION (ISA 240 para 15)`,
      `${'─'.repeat(80)}`,
      ``,
      `A fraud risk discussion was held on ${fraudDiscussionDate} involving: ${fraudParticipants}.`,
      ``,
      `The discussion covered: (a) the susceptibility of the entity's financial statements to material misstatement due to fraud; (b) the types of fraud that may occur; (c) known or suspected instances of fraud; and (d) management override of controls.`,
      ``,
      `FRAUD RISKS IDENTIFIED:`,
      fraudRisksIdentified.map(r => `  - ${r}`).join('\n'),
      ``,
      `Responses to identified fraud risks are incorporated within the section-level audit programmes. The presumed risk of revenue recognition fraud (ISA 240 para A28) has been specifically addressed in the revenue audit programme.`,
      ``,
      `${'═'.repeat(80)}`,
      `8. GOING CONCERN INITIAL ASSESSMENT (ISA 570)`,
      `${'─'.repeat(80)}`,
      ``,
      `INITIAL ASSESSMENT: ${gcConcern ? 'GOING CONCERN INDICATORS IDENTIFIED' : 'NO MATERIAL GOING CONCERN CONCERNS AT PLANNING STAGE'}`,
      ``,
      gcNarrative,
      ``,
      `A full going concern assessment will be performed at the completion stage in accordance with ISA 570 para 16. Management's assessment of going concern will be reviewed and challenged where appropriate.`,
      ``,
      `${'═'.repeat(80)}`,
      `9. CONCLUSION`,
      `${'─'.repeat(80)}`,
      ``,
      `This planning memorandum has been prepared in accordance with ISA 300 para 12 and provides the basis for our audit approach. All team members are required to read and understand this document before commencing fieldwork. Any significant changes to the planned approach must be approved by the Engagement Partner and documented in an updated planning memorandum.`,
      ``,
      `Prepared by: ______________________ Date: ${date}`,
      `Reviewed by: ______________________ Date: ______________________`,
      `Partner approval: _________________ Date: ______________________`,
      ``,
      `${'═'.repeat(80)}`
    ].join('\n');

    return memo;
  }

  // -------------------------------------------------------------------------
  // generateSectionConclusionMemorandum
  // -------------------------------------------------------------------------

  /**
   * Generate a conclusion memorandum for a single FSLI.
   *
   * @param {string}   section       - FSLI key.
   * @param {Object[]} procedures    - Array of procedure objects performed.
   * @param {Object[]} findings      - Array of findings identified in this section.
   * @param {Object}   materiality   - { overall, performance, trivial }
   * @returns {string} Formatted conclusion memorandum.
   */
  generateSectionConclusionMemorandum(section, procedures = [], findings = [], materiality = {}) {
    const sectionLabel = humanLabel(section);
    const date = ukDate();

    const misstatements = findings.filter(f => f.findingType === 'misstatement');
    const adjustedMis = misstatements.filter(f => f.isAdjusted);
    const unadjustedMis = misstatements.filter(f => !f.isAdjusted);
    const controlDeficiencies = findings.filter(f => f.findingType === 'control_deficiency');

    const totalLikelyUnadjusted = unadjustedMis
      .filter(f => f.amountType === 'likely')
      .reduce((sum, f) => sum + Math.abs(f.amount || 0), 0);

    const assertions = this._getDefaultAssertions(section);

    const proceduresSummary = procedures.length > 0
      ? procedures.map((p, i) => `  ${i + 1}. ${p.name || p.procedure || `Procedure ${i + 1}`}: ${p.description || 'See audit file for full documentation.'}`).join('\n')
      : '  Procedures were performed as detailed in the section audit programme. See individual working papers for full details.';

    const findingsSummary = findings.length > 0
      ? findings.map((f, i) => `  ${i + 1}. [${(f.findingType || 'finding').toUpperCase()}] ${f.description ? f.description.substring(0, 150) + (f.description.length > 150 ? '...' : '') : 'No description.'}`).join('\n')
      : '  No exceptions or findings were identified during the performance of our procedures.';

    const overallMat = materiality.overall;
    const perfMat = materiality.performance;

    let misstatementsAssessment;
    if (misstatements.length === 0) {
      misstatementsAssessment = 'No misstatements were identified in this section. The section is concluded as free from material misstatement.';
    } else {
      const indivMaterial = unadjustedMis.some(f => overallMat && Math.abs(f.amount || 0) > overallMat);
      misstatementsAssessment = [
        `${adjustedMis.length} adjusted misstatement(s) and ${unadjustedMis.length} unadjusted misstatement(s) were identified.`,
        overallMat
          ? `Total likely unadjusted misstatements: £${totalLikelyUnadjusted.toLocaleString('en-GB', { minimumFractionDigits: 2 })} (overall materiality: £${overallMat.toLocaleString('en-GB', { minimumFractionDigits: 0 })}).`
          : `Total likely unadjusted misstatements: £${totalLikelyUnadjusted.toLocaleString('en-GB', { minimumFractionDigits: 2 })}.`,
        indivMaterial
          ? 'One or more unadjusted misstatements are individually material. This has been escalated for partner consideration.'
          : overallMat && totalLikelyUnadjusted > overallMat
            ? 'Cumulative unadjusted misstatements exceed overall materiality. Partner review required.'
            : perfMat && totalLikelyUnadjusted > perfMat
              ? 'Cumulative unadjusted misstatements exceed performance materiality. All items have been reported to management and accumulated in the audit differences schedule.'
              : 'Unadjusted misstatements are below performance materiality; they have been accumulated in the audit differences schedule.'
      ].join(' ');
    }

    const assertionConcluded = assertions.map(a =>
      `  ${a}: ${findings.length === 0 || !findings.some(f => Array.isArray(f.assertion) && f.assertion.includes(a))
        ? 'CONCLUDED — no exceptions noted'
        : 'EXCEPTION NOTED — see findings above'}`
    ).join('\n');

    const outstandingMatters = findings.filter(f => f.requiredFollowUp || f.riskLevel === 'high' || f.riskLevel === 'significant');

    const memo = [
      `SECTION CONCLUSION MEMORANDUM — ${sectionLabel.toUpperCase()}`,
      `${'═'.repeat(80)}`,
      `Section:        ${sectionLabel}`,
      `Date concluded: ${date}`,
      `ISA Basis:      ${(ISA_DOCUMENTATION_REQUIREMENTS[section] || {}).isaRef || 'ISA 330 para 20'}`,
      ``,
      `${'═'.repeat(80)}`,
      `1. SCOPE OF WORK PERFORMED`,
      `${'─'.repeat(80)}`,
      ``,
      `Audit procedures were performed on the ${sectionLabel} section for the purpose of obtaining sufficient appropriate audit evidence to support our conclusions on the relevant assertions. The scope of work was determined by our risk assessment and was designed to respond to the assessed risks of material misstatement in this area.`,
      ``,
      `${'═'.repeat(80)}`,
      `2. SUMMARY OF PROCEDURES`,
      `${'─'.repeat(80)}`,
      ``,
      proceduresSummary,
      ``,
      `${'═'.repeat(80)}`,
      `3. SUMMARY OF FINDINGS / EXCEPTIONS`,
      `${'─'.repeat(80)}`,
      ``,
      findingsSummary,
      ``,
      controlDeficiencies.length > 0
        ? `${controlDeficiencies.length} control deficiency/deficiencies identified. These will be communicated to management and those charged with governance in accordance with ISA 265 para 9.`
        : 'No control deficiencies identified in this section.',
      ``,
      `${'═'.repeat(80)}`,
      `4. ASSESSMENT OF MISSTATEMENTS`,
      `${'─'.repeat(80)}`,
      ``,
      misstatementsAssessment,
      ``,
      `${'═'.repeat(80)}`,
      `5. CONCLUSION ON ASSERTIONS`,
      `${'─'.repeat(80)}`,
      ``,
      `Based on the procedures performed, we conclude as follows for each assertion tested:`,
      ``,
      assertionConcluded,
      ``,
      `${'═'.repeat(80)}`,
      `6. RELIANCE ON PRIOR YEAR`,
      `${'─'.repeat(80)}`,
      ``,
      `Where opening balances have been relied upon, we have satisfied ourselves that they are free from material misstatement in accordance with ISA 510 (Initial Audit Engagements — Opening Balances). No issues have been identified in this area unless noted above.`,
      ``,
      `${'═'.repeat(80)}`,
      `7. OUTSTANDING MATTERS`,
      `${'─'.repeat(80)}`,
      ``,
      outstandingMatters.length > 0
        ? outstandingMatters.map((f, i) => `  ${i + 1}. [${f.id || `OM-${i + 1}`}] ${f.description ? f.description.substring(0, 200) : 'See finding detail.'}`).join('\n')
        : '  No outstanding matters requiring resolution before section sign-off.',
      ``,
      `${'═'.repeat(80)}`,
      `8. RECOMMENDATION FOR REVIEW`,
      `${'─'.repeat(80)}`,
      ``,
      findings.length === 0
        ? `This section is ready for managerial review. No exceptions noted; all assertions are concluded.`
        : misstatements.length > 0
          ? `This section requires partner attention due to identified misstatement(s). Refer to audit differences schedule and findings detail.`
          : `This section requires managerial review. Findings noted are non-misstatement items; see findings summary for detail.`,
      ``,
      `Prepared by: ______________________ Date: ${date}`,
      `Reviewed by: ______________________ Date: ______________________`,
      `${'═'.repeat(80)}`
    ].join('\n');

    return memo;
  }

  // -------------------------------------------------------------------------
  // generateEngagementCompletionMemorandum
  // -------------------------------------------------------------------------

  /**
   * Generate the master engagement completion memorandum.
   *
   * @param {Object}   engagement   - Engagement details.
   * @param {Object}   allSections  - Map of sectionId -> { procedures, findings }.
   * @param {Object[]} findings     - All findings across the engagement.
   * @returns {string} Formal completion memo (2000+ words when populated).
   */
  generateEngagementCompletionMemorandum(engagement, allSections = {}, findings = []) {
    const engName = engagement.name || engagement.clientName || 'Entity';
    const yearEnd = engagement.yearEnd || engagement.periodEnd || 'Period end not specified';
    const partner = engagement.partner || 'Not specified';
    const manager = engagement.manager || 'Not specified';
    const framework = engagement.framework || 'FRS 102';
    const date = ukDate();

    const allMisstatements = findings.filter(f => f.findingType === 'misstatement');
    const allControlDefs = findings.filter(f => f.findingType === 'control_deficiency');
    const allOther = findings.filter(f => !['misstatement', 'control_deficiency'].includes(f.findingType));
    const adjustedMis = allMisstatements.filter(f => f.isAdjusted);
    const unadjustedMis = allMisstatements.filter(f => !f.isAdjusted);

    // Group findings by section.
    const sectionGroups = {};
    for (const f of findings) {
      if (!sectionGroups[f.sourceSection]) sectionGroups[f.sourceSection] = [];
      sectionGroups[f.sourceSection].push(f);
    }

    const findingsBySectionText = Object.keys(sectionGroups).length > 0
      ? Object.entries(sectionGroups).map(([sec, fList]) =>
          `  ${humanLabel(sec).toUpperCase()}: ${fList.length} finding(s) — ${fList.filter(f => f.findingType === 'misstatement').length} misstatement(s), ${fList.filter(f => f.findingType === 'control_deficiency').length} control deficiency(ies).`
        ).join('\n')
      : '  No findings identified across any sections.';

    // Going concern.
    const gcSection = allSections['going_concern'] || {};
    const gcFindings = gcSection.findings || findings.filter(f => f.sourceSection === 'going_concern');
    const gcConclusion = gcFindings.length > 0
      ? `Going concern findings have been identified. See Going Concern section working papers for full assessment. The impact on the audit opinion has been considered below.`
      : `Based on procedures performed in accordance with ISA 570, no events or conditions have been identified that cast significant doubt on the entity's ability to continue as a going concern for a period of at least twelve months from the date of approval of the financial statements.`;

    // Subsequent events.
    const subsequentEventsNarrative = engagement.subsequentEvents
      ? `The following subsequent events have been identified and assessed: ${engagement.subsequentEvents}`
      : `Procedures have been performed up to the date of the auditor's report to identify any events or conditions that may require adjustment or disclosure in the financial statements (ISA 560 para 6). No material subsequent events requiring adjustment to the financial statements have been identified, other than as disclosed in the notes.`;

    // Independence.
    const independenceNarrative = `The engagement team has confirmed independence from ${engName} in accordance with the applicable ethical requirements (IESBA Code of Ethics; FRC Ethical Standard). No threats to independence have been identified that cannot be addressed by appropriate safeguards. The engagement partner has satisfied themselves that the engagement team has maintained independence throughout the audit (ISA 220 para 11).`;

    // Opinion recommendation.
    const opinionRec = this._recommendCompletionOpinion(allMisstatements, findings, engagement);

    // Outstanding matters.
    const outstandingForPartner = findings.filter(f =>
      f.riskLevel === 'significant' || f.riskLevel === 'high' || (f.findingType === 'misstatement' && !f.isAdjusted)
    );

    const sectionsSummaryText = Object.keys(allSections).map(sec => {
      const secData = allSections[sec];
      const secFindings = secData.findings || [];
      return `  ${humanLabel(sec)}: ${secData.procedures ? secData.procedures.length : 0} procedure(s) performed; ${secFindings.length} finding(s) identified.`;
    }).join('\n') || '  See individual section working papers for details.';

    const keyRisksAddressed = this._buildKeyRisksAddressedSection(findings, allSections);

    const totalLikelyUnadjusted = unadjustedMis
      .filter(f => f.amountType === 'likely')
      .reduce((sum, f) => sum + Math.abs(f.amount || 0), 0);
    const totalPossibleUnadjusted = unadjustedMis
      .filter(f => f.amountType === 'possible')
      .reduce((sum, f) => sum + Math.abs(f.amount || 0), 0);

    const memo = [
      `ENGAGEMENT COMPLETION MEMORANDUM`,
      `${'═'.repeat(80)}`,
      `STRICTLY CONFIDENTIAL — FOR INTERNAL AUDIT FILE USE ONLY`,
      `${'═'.repeat(80)}`,
      ``,
      `ENGAGEMENT:                     ${engName}`,
      `YEAR END:                       ${yearEnd}`,
      `FINANCIAL REPORTING FRAMEWORK:  ${framework}`,
      `ENGAGEMENT PARTNER:             ${partner}`,
      `AUDIT MANAGER:                  ${manager}`,
      `DATE OF MEMORANDUM:             ${date}`,
      `ISA REFERENCES:                 ISA 220, ISA 450, ISA 560, ISA 570, ISA 700`,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 1: SUMMARY OF THE AUDIT ENGAGEMENT`,
      `${'─'.repeat(80)}`,
      ``,
      `This memorandum has been prepared to document the conclusions reached at the completion stage of the audit of ${engName} for the period ending ${yearEnd}. It covers all key matters arising during the audit and provides the basis for the auditor's report in accordance with ISA 700 (Forming an Opinion and Reporting on Financial Statements).`,
      ``,
      `The audit was conducted in accordance with International Standards on Auditing (UK) as adopted by the Financial Reporting Council. The engagement team has complied with the relevant ethical requirements, including those pertaining to independence, and has planned and performed the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.`,
      ``,
      `SECTIONS COMPLETED:`,
      sectionsSummaryText,
      ``,
      `FINDINGS SUMMARY:`,
      `  Total findings:              ${findings.length}`,
      `  Misstatements:               ${allMisstatements.length} (${adjustedMis.length} adjusted / ${unadjustedMis.length} unadjusted)`,
      `  Control deficiencies:        ${allControlDefs.length}`,
      `  Other (risk indicators etc): ${allOther.length}`,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 2: KEY RISKS IDENTIFIED AND HOW ADDRESSED`,
      `${'─'.repeat(80)}`,
      ``,
      keyRisksAddressed,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 3: SUMMARY OF FINDINGS BY SECTION`,
      `${'─'.repeat(80)}`,
      ``,
      findingsBySectionText,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 4: AUDIT DIFFERENCES SCHEDULE SUMMARY`,
      `${'─'.repeat(80)}`,
      ``,
      `ADJUSTED MISSTATEMENTS (${adjustedMis.length}):`,
      adjustedMis.length > 0
        ? adjustedMis.map((f, i) => `  ${i + 1}. [${humanLabel(f.sourceSection)}] £${Math.abs(f.amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })} — ${f.description ? f.description.substring(0, 100) + '...' : 'No description.'}`).join('\n')
        : '  None.',
      ``,
      `UNADJUSTED MISSTATEMENTS (${unadjustedMis.length}):`,
      unadjustedMis.length > 0
        ? unadjustedMis.map((f, i) => `  ${i + 1}. [${humanLabel(f.sourceSection)}] £${Math.abs(f.amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })} (${f.amountType || 'unclassified'}) — ${f.description ? f.description.substring(0, 100) + '...' : 'No description.'}`).join('\n')
        : '  None.',
      ``,
      `  Total likely unadjusted misstatements:   £${totalLikelyUnadjusted.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      `  Total possible unadjusted misstatements: £${totalPossibleUnadjusted.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 5: GOING CONCERN CONCLUSION`,
      `${'─'.repeat(80)}`,
      ``,
      gcConclusion,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 6: INDEPENDENCE CONFIRMATION`,
      `${'─'.repeat(80)}`,
      ``,
      independenceNarrative,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 7: SUBSEQUENT EVENTS`,
      `${'─'.repeat(80)}`,
      ``,
      subsequentEventsNarrative,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 8: RECOMMENDED OPINION TYPE`,
      `${'─'.repeat(80)}`,
      ``,
      `RECOMMENDED OPINION:  ${opinionRec.opinionType}`,
      ``,
      `REASONING:`,
      `${opinionRec.reasoning}`,
      ``,
      `ISA BASIS: ${opinionRec.isaRef}`,
      ``,
      `${'═'.repeat(80)}`,
      `SECTION 9: OUTSTANDING MATTERS REQUIRING PARTNER ATTENTION`,
      `${'─'.repeat(80)}`,
      ``,
      outstandingForPartner.length > 0
        ? outstandingForPartner.map((f, i) => [
            `  ${i + 1}. [${f.id || `MATTER-${i + 1}`}] ${humanLabel(f.sourceSection).toUpperCase()}`,
            `     Type: ${f.findingType || 'Not specified'} | Risk: ${f.riskLevel || 'Not specified'}`,
            `     ${f.description ? f.description.substring(0, 200) : 'No description.'}`
          ].join('\n')).join('\n\n')
        : `  No outstanding matters requiring specific partner attention beyond the standard review of this memorandum and the audit file.`,
      ``,
      `${'═'.repeat(80)}`,
      `SIGN-OFF`,
      `${'─'.repeat(80)}`,
      ``,
      `I confirm that I have reviewed this engagement completion memorandum and am satisfied that:`,
      `(a) Sufficient appropriate audit evidence has been obtained to support the audit opinion;`,
      `(b) All significant matters have been appropriately documented and resolved;`,
      `(c) The audit has been conducted in accordance with ISA (UK) and the firm's quality control procedures;`,
      `(d) The recommended opinion type is appropriate given the audit evidence obtained.`,
      ``,
      `Engagement Partner: ______________________ Date: ${date}`,
      ``,
      `${'═'.repeat(80)}`
    ].join('\n');

    return memo;
  }

  // -------------------------------------------------------------------------
  // generateWorkingPaperHeader
  // -------------------------------------------------------------------------

  /**
   * Generate a standard working paper header with all required fields.
   *
   * @param {Object} context
   * @returns {string} Formatted header string.
   */
  generateWorkingPaperHeader(context = {}) {
    const {
      firmName = 'Audit Firm',
      engagementName = 'Engagement',
      yearEnd = 'Not specified',
      refCode = 'N/A',
      preparedBy = 'Not recorded',
      preparedDate = new Date().toISOString(),
      reviewedBy = 'Not recorded',
      reviewedDate = null,
      isaReferences = [],
      accountingStandardRefs = [],
      assertions = [],
      riskLevel = 'medium',
      section = 'Not specified'
    } = context;

    const isaLine = isaReferences.length > 0 ? isaReferences.join('; ') : 'Not specified';
    const accStdLine = accountingStandardRefs.length > 0 ? accountingStandardRefs.join('; ') : 'Not specified';
    const assertionsLine = assertions.length > 0 ? assertions.join(', ') : 'Not specified';

    return [
      `${'═'.repeat(80)}`,
      `FIRM:              ${firmName}`,
      `ENGAGEMENT:        ${engagementName}`,
      `YEAR END:          ${yearEnd}`,
      `WP REFERENCE:      ${refCode}`,
      `SECTION:           ${humanLabel(section)}`,
      `${'─'.repeat(80)}`,
      `PREPARED BY:       ${preparedBy}             DATE: ${ukDate(preparedDate)}`,
      `REVIEWED BY:       ${reviewedBy}             DATE: ${reviewedDate ? ukDate(reviewedDate) : 'Pending'}`,
      `${'─'.repeat(80)}`,
      `ISA REFERENCES:    ${isaLine}`,
      `ACCOUNTING STDS:   ${accStdLine}`,
      `ASSERTIONS:        ${assertionsLine}`,
      `RISK LEVEL:        ${riskLevel.toUpperCase()}`,
      `${'═'.repeat(80)}`
    ].join('\n');
  }

  // -------------------------------------------------------------------------
  // generateSignOffRecord
  // -------------------------------------------------------------------------

  /**
   * Create a formal sign-off record.
   *
   * @param {string} wpRef       - Working paper reference.
   * @param {string} signerName  - Name of the signer.
   * @param {string} signerRole  - Role of the signer.
   * @param {string} signOffType - 'prepare' | 'review' | 'approve'
   * @param {string} [timestamp] - ISO timestamp; defaults to now.
   * @returns {Object} Sign-off record object.
   */
  generateSignOffRecord(wpRef, signerName, signerRole, signOffType, timestamp) {
    const validTypes = ['prepare', 'review', 'approve'];
    if (!validTypes.includes(signOffType)) {
      throw new TypeError(`generateSignOffRecord: signOffType must be one of: ${validTypes.join(', ')}`);
    }

    const ts = timestamp || new Date().toISOString();
    const date = ukDate(ts);

    const isa220Reminder = signOffType === 'approve'
      ? 'PARTNER RESPONSIBILITY REMINDER (ISA 220 para 8): The engagement partner is responsible for the overall quality of the audit engagement. By approving this working paper, you confirm that the work has been performed and documented to a standard consistent with ISA 220 and the firm\'s quality control procedures.'
      : signOffType === 'review'
        ? 'REVIEWER RESPONSIBILITY (ISA 220 para 15): The reviewer is responsible for reviewing the work performed to determine whether sufficient appropriate audit evidence has been obtained to support the conclusions reached.'
        : 'PREPARER RESPONSIBILITY (ISA 230 para 7): The preparer is responsible for ensuring that the working paper is complete, clear, and documents the work performed and conclusions reached.';

    return {
      ref: `SIGNOFF-${wpRef}-${signOffType.toUpperCase()}`,
      wpRef,
      signerName,
      signerRole,
      signOffType,
      timestamp: ts,
      date,
      digitalSignaturePlaceholder: `[DIGITAL SIGNATURE: ${signerName} — ${signOffType.toUpperCase()} — ${date}]`,
      isa220Reminder,
      status: 'SIGNED'
    };
  }

  // -------------------------------------------------------------------------
  // generateFRCReadyDocumentation
  // -------------------------------------------------------------------------

  /**
   * Generate a complete FRC-ready documentation package.
   *
   * @param {Object}   engagement        - Engagement details.
   * @param {Object[]} allWorkingPapers  - Array of working paper objects.
   * @returns {Object} Complete documentation package suitable for export.
   */
  generateFRCReadyDocumentation(engagement, allWorkingPapers = []) {
    const engName = engagement.name || engagement.clientName || 'Entity';
    const yearEnd = engagement.yearEnd || engagement.periodEnd || 'Not specified';
    const engagementId = engagement.id || engagement.engagementId || 'UNKNOWN';

    // Table of contents.
    const tableOfContents = this._buildTableOfContents(allWorkingPapers, engagement);

    // Group WPs by category.
    const planningWPs = allWorkingPapers.filter(wp => wp.stage === 'planning' || wp.section === 'planning');
    const riskWPs = allWorkingPapers.filter(wp => wp.stage === 'risk_assessment');
    const fieldworkWPs = allWorkingPapers.filter(wp => !['planning', 'risk_assessment', 'completion'].includes(wp.stage));
    const completionWPs = allWorkingPapers.filter(wp => wp.stage === 'completion');

    // Validate each WP.
    const validationResults = allWorkingPapers.map(wp => ({
      wpRef: wp.wpRef || wp.ref || 'N/A',
      section: wp.section || 'Unknown',
      validation: this.validateDocumentationCompleteness(wp)
    }));

    const overallScore = validationResults.length > 0
      ? Math.round(validationResults.reduce((sum, r) => sum + r.validation.score, 0) / validationResults.length)
      : 0;

    // Findings register.
    const allFindings = allWorkingPapers
      .flatMap(wp => (wp.exceptionsFound || wp.findings || []))
      .filter(Boolean);

    // Sign-off register.
    const signOffRegister = allWorkingPapers
      .flatMap(wp => (wp.signOffs || []))
      .filter(Boolean);

    return {
      metadata: {
        engagementId,
        engagementName: engName,
        yearEnd,
        framework: engagement.framework || 'FRS 102',
        partner: engagement.partner || 'Not specified',
        generatedAt: new Date().toISOString(),
        generatedBy: 'AuditDocumentationService — FRC-Ready Package'
      },
      tableOfContents,
      overallDocumentationScore: overallScore,
      qualityAlert: overallScore < 70
        ? `WARNING: Overall documentation quality score is ${overallScore}/100. This is below the minimum acceptable threshold for FRC review. Address all issues before engagement sign-off.`
        : overallScore < 85
          ? `ATTENTION: Documentation score ${overallScore}/100. Some working papers require improvement before FRC review.`
          : `Documentation score ${overallScore}/100. Documentation package is of acceptable quality for FRC review.`,
      sections: {
        planning: {
          label: 'Planning Documentation',
          isaRef: 'ISA 300 para 12',
          workingPapers: planningWPs,
          count: planningWPs.length
        },
        riskAssessment: {
          label: 'Risk Assessment Documentation',
          isaRef: 'ISA 315 para 33',
          workingPapers: riskWPs,
          count: riskWPs.length
        },
        fieldwork: {
          label: 'Working Paper Summaries by Section',
          workingPapers: fieldworkWPs,
          count: fieldworkWPs.length
        },
        completion: {
          label: 'Completion Documentation',
          isaRef: 'ISA 700 para 26',
          workingPapers: completionWPs,
          count: completionWPs.length
        }
      },
      findingsRegister: allFindings,
      signOffRegister,
      validationResults,
      exportFormats: ['word', 'excel', 'pdf'],
      exportNotes: 'This structured object is suitable for export to Word/Excel via the auditWordExportService or auditExcelExportService. Call the appropriate export service with this object as input.'
    };
  }

  // -------------------------------------------------------------------------
  // validateDocumentationCompleteness
  // -------------------------------------------------------------------------

  /**
   * Check a working paper against FRC quality standards.
   *
   * @param {Object} workingPaper - The working paper to validate.
   * @returns {{ score: number, issues: string[], recommendations: string[] }}
   */
  validateDocumentationCompleteness(workingPaper) {
    const issues = [];
    const recommendations = [];
    let score = 100;
    const deductionPerIssue = 5;

    if (!workingPaper || typeof workingPaper !== 'object') {
      return { score: 0, issues: ['Working paper is not a valid object.'], recommendations: ['Provide a valid working paper object.'] };
    }

    // 1. Required header fields.
    const requiredHeaderFields = ['wpRef', 'engagementName', 'preparedBy', 'preparedDate'];
    const header = workingPaper.header || workingPaper;
    for (const field of requiredHeaderFields) {
      if (!header[field] || header[field] === 'Not recorded' || header[field] === 'Not specified') {
        issues.push(`Missing or default value for required header field: '${field}'.`);
        recommendations.push(`Populate the '${field}' field with accurate information before sign-off.`);
        score -= deductionPerIssue;
      }
    }

    // 2. Sign-offs.
    const hasPreparedBy = !!(workingPaper.header?.preparedBy || workingPaper.preparedBy);
    const hasReviewedBy = !!(workingPaper.header?.reviewedBy || workingPaper.reviewedBy);
    const hasReviewedDate = !!(workingPaper.header?.reviewedDate || workingPaper.reviewedDate);

    if (!hasPreparedBy) {
      issues.push('Preparer sign-off missing (ISA 230 para 7).');
      recommendations.push('Add preparer name and date before file review.');
      score -= deductionPerIssue;
    }
    if (!hasReviewedBy) {
      issues.push('Reviewer sign-off missing (ISA 220 para 15).');
      recommendations.push('Complete manager review and record reviewer name and date.');
      score -= deductionPerIssue;
    }
    if (hasReviewedBy && !hasReviewedDate) {
      issues.push('Reviewer date missing despite reviewer name being present.');
      recommendations.push('Add the date on which the review was completed.');
      score -= Math.round(deductionPerIssue / 2);
    }

    // 3. Minimum narrative length.
    const section = (workingPaper.header?.fsli || workingPaper.section || '').toLowerCase().replace(/\s+/g, '_');
    const docReqs = ISA_DOCUMENTATION_REQUIREMENTS[section];
    if (docReqs) {
      const narrativeFields = [
        workingPaper.riskBackground,
        workingPaper.planningNarrative,
        workingPaper.conclusionNarrative,
        workingPaper.populationDescription
      ].filter(Boolean).join(' ');
      const wc = wordCount(narrativeFields);
      if (wc < docReqs.minWordCount) {
        issues.push(`Insufficient narrative: ${wc} words found; minimum ${docReqs.minWordCount} required for ${section} section (${docReqs.isaRef}).`);
        recommendations.push(`Expand the narrative to meet the minimum word count. Add detail to the risk background, planning narrative, and/or conclusion.`);
        score -= deductionPerIssue * 2;
      }
    }

    // 4. Cross-references documented.
    const crossRefs = workingPaper.crossReferences || [];
    if (crossRefs.length === 0) {
      issues.push('No cross-references documented. All working papers should cross-reference related sections.');
      recommendations.push('Review the cross-reference map and document all applicable links to related FSLIs.');
      score -= deductionPerIssue;
    }

    // 5. ISA references.
    const isaRefs = workingPaper.header?.isaReferences || workingPaper.isaReferences || [];
    if (!Array.isArray(isaRefs) || isaRefs.length === 0) {
      issues.push('No ISA references documented. Every working paper must cite the applicable ISA(s).');
      recommendations.push('Add ISA references to the working paper header.');
      score -= deductionPerIssue;
    }

    // 6. Placeholder text check.
    const PLACEHOLDER_PATTERNS = [
      /\bto be completed\b/i,
      /\bTBC\b/,
      /\bTBD\b/,
      /\bN\/A\b(?! — )/,
      /\binsert\b.*\bhere\b/i,
      /\bpending\b/i,
      /\bplaceholder\b/i,
      /\bdraft\b/i
    ];

    const fullText = JSON.stringify(workingPaper);
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(fullText)) {
        issues.push(`Placeholder text detected matching pattern: "${pattern.source}". All working papers must be finalised before review.`);
        recommendations.push('Remove all placeholder text and replace with actual audit documentation.');
        score -= deductionPerIssue;
        break; // One deduction for placeholder text regardless of count.
      }
    }

    // 7. Conclusion narrative.
    if (!workingPaper.conclusionNarrative || wordCount(workingPaper.conclusionNarrative) < 30) {
      issues.push('Conclusion narrative is missing or insufficiently detailed (minimum 30 words).');
      recommendations.push('Add a full conclusion paragraph covering what was found, the assertion impact, and effect on the audit opinion.');
      score -= deductionPerIssue;
    }

    // 8. Work done / evidence.
    const workDone = workingPaper.workDone || [];
    const evidence = workingPaper.evidenceObtained || [];
    if (workDone.length === 0) {
      issues.push('Work done section is empty. Document specific procedures performed.');
      recommendations.push('List all audit procedures performed with sufficient detail for an experienced auditor to understand what was done.');
      score -= deductionPerIssue;
    }
    if (evidence.length === 0) {
      issues.push('Evidence obtained section is empty. Document source documents and records inspected.');
      recommendations.push('List all evidence obtained, including document names, dates, and sources.');
      score -= deductionPerIssue;
    }

    score = Math.max(0, score);

    return { score, issues, recommendations };
  }

  // -------------------------------------------------------------------------
  // getDocumentationTemplate
  // -------------------------------------------------------------------------

  /**
   * Return a blank documentation template for any section with guidance notes.
   *
   * @param {string} section    - FSLI key.
   * @param {string} riskLevel  - Risk level.
   * @returns {Object} Blank template with guidance notes.
   */
  getDocumentationTemplate(section, riskLevel = 'medium') {
    const docReqs = ISA_DOCUMENTATION_REQUIREMENTS[section] || {};
    const sectionLabel = humanLabel(section);
    const isaRef = docReqs.isaRef || 'ISA 330 para 20';
    const assertions = this._getDefaultAssertions(section);
    const isaRefs = this._getISAReferences(section, riskLevel);
    const evidenceChecklist = this._buildEvidenceChecklist(section);

    return {
      _guidance: {
        purpose: `This template provides the structure for documenting audit procedures over ${sectionLabel}. All fields marked with [REQUIRED] must be populated before the working paper can be signed off.`,
        minimumWordCount: docReqs.minWordCount || 200,
        isaRef,
        requiredSections: docReqs.requiredSections || ['procedures', 'conclusions'],
        riskContext: RISK_ISA_CONTEXT[riskLevel] || RISK_ISA_CONTEXT.medium
      },
      header: {
        wpRef: '[REQUIRED] Enter WP reference (e.g., ENG2024/REVENUE-001)',
        engagementName: '[REQUIRED] Enter client/engagement name',
        fsli: sectionLabel,
        stage: '[REQUIRED] Planning / Interim / Final',
        period: '[REQUIRED] Year end date',
        preparedBy: '[REQUIRED] Preparer name',
        preparedDate: '[REQUIRED] Date prepared',
        reviewedBy: '[REQUIRED] Reviewer name',
        reviewedDate: '[REQUIRED] Date reviewed',
        isaReferences: isaRefs,
        assertions,
        _guidance: 'All header fields are mandatory. WP references must follow the firm\'s referencing convention.'
      },
      riskBackground: `[REQUIRED — minimum ${Math.round((docReqs.minWordCount || 200) * 0.25)} words] Describe why ${sectionLabel} is a significant area for the audit. Reference the applicable accounting standard and ISA. Consider: inherent risk factors, prior year findings, industry-specific risks, and management judgment areas.`,
      planningNarrative: `[REQUIRED] Describe how the audit of ${sectionLabel} was planned in response to the assessed risk level (${riskLevel.toUpperCase()}). ${RISK_ISA_CONTEXT[riskLevel]}`,
      populationDescription: `[REQUIRED] Describe the full population of ${sectionLabel} transactions/balances. Include: total value, number of items, period covered, data source, and any sub-populations.`,
      samplingApproach: `[REQUIRED] Document the sampling methodology applied in accordance with ISA 530. Include: sample size determination, selection method, stratification approach, and basis for concluding the sample is representative.`,
      sampleDetails: {
        size: '[REQUIRED] Number',
        method: '[REQUIRED] MUS / Systematic / Random / Haphazard / 100%',
        stratification: '[REQUIRED] Describe stratification approach'
      },
      workDone: [
        `[REQUIRED — at least 3 bullet points] Document each specific procedure performed. For each item, state:`,
        `  (a) what was done (e.g., "Selected 25 invoices from the revenue population and agreed to customer purchase orders, delivery notes, and bank receipts");`,
        `  (b) what was examined (document names, dates, references);`,
        `  (c) the result of the procedure.`
      ],
      evidenceObtained: evidenceChecklist,
      exceptionsFound: [
        `[REQUIRED — document all exceptions; if none, state "No exceptions noted."] For each exception, document:`,
        `  - Description of the exception`,
        `  - Amount (if applicable)`,
        `  - Management explanation`,
        `  - Auditor's assessment`,
        `  - Classification (misstatement / limitation / risk indicator)`,
        `  - Required action`
      ],
      conclusionNarrative: `[REQUIRED — minimum 30 words] State your overall conclusion for ${sectionLabel}. Address:`,
      impactOnAuditOpinion: `[REQUIRED] State the impact of your findings on the audit opinion. If no issues: "Based on the procedures performed, we are satisfied that ${sectionLabel} is not materially misstated. No modification to the audit opinion is required on this basis."`,
      crossReferences: `[REQUIRED] List all cross-references to related sections. Use the CROSS_REFERENCE_MAP in crossReferenceService.js to identify applicable links.`,
      _isaRequirementReminders: {
        sampling: 'ISA 530 para 5: The auditor must determine the sample size sufficient to reduce sampling risk to an acceptably low level.',
        conclusions: `${isaRef}: Document conclusions for each assertion tested.`,
        exceptions: 'ISA 450 para 5: All identified misstatements must be accumulated and communicated to management.',
        scepticism: 'ISA 200 para 15: Maintain professional scepticism throughout all procedures.'
      }
    };
  }

  // -------------------------------------------------------------------------
  // PRIVATE METHODS
  // -------------------------------------------------------------------------

  /**
   * Get ISA references applicable to a section and risk level.
   * @param {string} section
   * @param {string} riskLevel
   * @returns {string[]}
   */
  _getISAReferences(section, riskLevel) {
    const base = ['ISA 230 (Audit Documentation)', 'ISA 330 (Responses to Assessed Risks)'];

    const sectionISA = {
      revenue: ['ISA 315 para 33', 'ISA 240 para A27 (fraud presumption)', 'IFRS 15 / FRS 102 s.23'],
      trade_debtors: ['ISA 505 (External Confirmations)', 'IFRS 9 ECL', 'FRS 102 s.11'],
      inventory: ['ISA 501 para 4 (Inventory Observation)', 'IAS 2 / FRS 102 s.13'],
      ppe: ['IAS 16 / FRS 102 s.17', 'IAS 36 (Impairment)', 'ISA 540 (Estimates)'],
      trade_creditors: ['ISA 505 (External Confirmations)', 'FRS 102 s.11'],
      provisions: ['ISA 540 (Accounting Estimates)', 'IAS 37 / FRS 102 s.21'],
      payroll: ['PAYE/NIC regulations', 'FRS 102 s.28'],
      tax: ['IAS 12 / FRS 102 s.29', 'HMRC guidance'],
      intangibles: ['IAS 38 / FRS 102 s.18', 'IAS 36 (Impairment)', 'ISA 540'],
      leases: ['IFRS 16 / FRS 102 s.20A', 'ISA 330 para 20'],
      financial_instruments: ['IFRS 9', 'FRS 102 s.11-12', 'ISA 540'],
      going_concern: ['ISA 570 para 16', 'FRC Practice Note 26'],
      related_parties: ['ISA 550 para 14', 'IAS 24 / FRS 102 s.33'],
      planning: ['ISA 300 para 12', 'ISA 315', 'ISA 320', 'ISA 240 para 15'],
      completion: ['ISA 700 para 26', 'ISA 705', 'ISA 706', 'ISA 560']
    };

    const specific = sectionISA[section] || [];
    if (riskLevel === 'significant' || riskLevel === 'high') {
      specific.push('ISA 330 para 15 (specific risk responses)');
    }

    return [...base, ...specific];
  }

  /**
   * Get default assertions for a section.
   * @param {string} section
   * @returns {string[]}
   */
  _getDefaultAssertions(section) {
    const assertionMap = {
      revenue: ['Occurrence', 'Completeness', 'Accuracy', 'Cut-off', 'Classification'],
      trade_debtors: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations', 'Classification'],
      inventory: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations'],
      ppe: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations', 'Classification'],
      trade_creditors: ['Existence', 'Completeness', 'Accuracy', 'Cut-off', 'Classification'],
      provisions: ['Completeness', 'Valuation', 'Existence', 'Classification'],
      payroll: ['Occurrence', 'Completeness', 'Accuracy', 'Valuation'],
      tax: ['Completeness', 'Valuation', 'Existence', 'Classification'],
      intangibles: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations'],
      leases: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations', 'Classification'],
      financial_instruments: ['Existence', 'Completeness', 'Valuation', 'Rights & Obligations'],
      going_concern: ['Going Concern Basis Appropriateness', 'Disclosure Adequacy'],
      related_parties: ['Completeness', 'Accuracy', 'Disclosure']
    };

    return assertionMap[section] || ['Occurrence', 'Completeness', 'Accuracy', 'Valuation'];
  }

  /**
   * Build risk background narrative for a section.
   * @param {string} section
   * @param {string} riskLevel
   * @param {string} framework
   * @returns {string}
   */
  _buildRiskBackground(section, riskLevel, framework) {
    const sectionLabel = humanLabel(section);
    const riskContext = RISK_ISA_CONTEXT[riskLevel] || RISK_ISA_CONTEXT.medium;

    const sectionRiskNarrative = {
      revenue: `Revenue is considered a significant area of audit focus in all engagements. ISA 240 para A27 establishes a rebuttable presumption that revenue recognition is a fraud risk. The applicable standard is ${framework === 'IFRS' ? 'IFRS 15' : 'FRS 102 Section 23'}, which requires that revenue be recognised when (or as) performance obligations are satisfied. Key risks include premature or delayed cut-off, side agreements affecting the transaction price, and related party transactions at non-arm's-length prices.`,
      trade_debtors: `Trade debtors represent a material balance with significant estimation uncertainty associated with the recoverability assessment. Under ${framework === 'IFRS' ? 'IFRS 9' : 'FRS 102 Section 11'}, an expected credit loss model is applied. Key audit risks include the completeness of the bad debt provision, the accuracy of the aged debtor listing, and the existence of recorded balances.`,
      inventory: `Inventory represents a complex audit area due to the risk of overstatement through incorrect counting, obsolescence, or overvaluation above net realisable value. Physical attendance at the year-end inventory count is required under ISA 501 para 4. The applicable standard is ${framework === 'IFRS' ? 'IAS 2' : 'FRS 102 Section 13'}.`,
      ppe: `Property, Plant and Equipment is typically a material balance involving management judgment in determining useful economic lives, residual values, and assessing assets for impairment under ${framework === 'IFRS' ? 'IAS 36' : 'FRS 102 Section 27'}. Capitalisation vs. expensing decisions also present classification risks.`,
      trade_creditors: `Trade creditors are subject to the risk of understatement through failure to accrue all liabilities at the balance sheet date. Cut-off testing, supplier statement reconciliations, and post period payment testing are key procedures. Under ${framework === 'IFRS' ? 'IFRS 9' : 'FRS 102 Section 11'}, financial liabilities are initially recognised at fair value.`,
      provisions: `Provisions involve the highest degree of management estimation and judgment. Under ${framework === 'IFRS' ? 'IAS 37' : 'FRS 102 Section 21'}, a provision is recognised when there is a present obligation, it is probable that an outflow will be required, and a reliable estimate can be made. ISA 540 (Accounting Estimates) governs our approach.`,
      payroll: `Payroll represents one of the most significant cost items and is subject to compliance risk (PAYE, NIC, benefits-in-kind). Directors' remuneration represents a key related party disclosure requirement. Year-end accruals for holiday pay and bonuses require careful cut-off assessment.`,
      tax: `Taxation involves both current and deferred tax computations. Deferred tax arises from temporary differences between accounting carrying values and tax bases under ${framework === 'IFRS' ? 'IAS 12' : 'FRS 102 Section 29'}. Key risks include the completeness of the tax provision and the recognition criteria for deferred tax assets.`,
      intangibles: `Intangible assets, particularly goodwill, are subject to annual impairment testing under ${framework === 'IFRS' ? 'IAS 36' : 'FRS 102 Section 27'}. The recoverable amount calculation involves significant management judgment regarding future cash flows and discount rates. ISA 540 governs our approach to estimating recoverable amounts.`,
      leases: `Leases under ${framework === 'IFRS' ? 'IFRS 16' : 'FRS 102 Section 20A'} require the recognition of right-of-use assets and lease liabilities. Key risks include the completeness of the lease population, the accuracy of incremental borrowing rates used, and correct treatment of lease modifications.`,
      financial_instruments: `Financial instruments are measured at fair value or amortised cost under ${framework === 'IFRS' ? 'IFRS 9' : 'FRS 102 Sections 11-12'}. The expected credit loss model requires management to apply forward-looking information. Derivative instruments introduce mark-to-market risks.`,
      going_concern: `Going concern is a fundamental assumption underlying the preparation of financial statements. ISA 570 para 16 requires specific procedures to evaluate the appropriateness of management's use of the going concern basis and to identify any events or conditions that may cast significant doubt on the entity's ability to continue.`,
      related_parties: `Related party transactions must be disclosed in accordance with ${framework === 'IFRS' ? 'IAS 24' : 'FRS 102 Section 33'}. ISA 550 requires specific procedures to identify undisclosed related parties and to evaluate whether transactions are conducted on an arm's-length basis.`
    };

    const specific = sectionRiskNarrative[section] || `The ${sectionLabel} section has been identified for audit testing based on our risk assessment. ${riskContext}`;

    return `${specific}\n\n${riskContext}`;
  }

  /**
   * Build planning narrative for a procedure.
   * @param {string} section
   * @param {string} riskLevel
   * @param {Object} procedure
   * @returns {string}
   */
  _buildPlanningNarrative(section, riskLevel, procedure) {
    const sectionLabel = humanLabel(section);
    const approach = riskLevel === 'significant' || riskLevel === 'high'
      ? 'primarily substantive approach with no reliance on controls'
      : riskLevel === 'medium'
        ? 'combined approach of controls testing and substantive procedures'
        : 'substantive analytical procedures with limited detailed testing';

    return `For the ${sectionLabel} section, we have planned a ${approach} in response to the assessed risk level of ${riskLevel.toUpperCase()} (ISA 330 para 5). ${procedure.planningNotes || ''} The planned procedures are designed to address all relevant assertions identified in the risk assessment and are proportionate to the assessed risk of material misstatement.`;
  }

  /**
   * Build population description narrative.
   * @param {string} section
   * @param {Object} procedure
   * @param {Object} engagement
   * @returns {string}
   */
  _buildPopulationDescription(section, procedure, engagement) {
    const sectionLabel = humanLabel(section);
    const total = procedure.populationValue
      ? `£${procedure.populationValue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`
      : 'as per trial balance';
    const size = procedure.populationSize ? `${procedure.populationSize} items` : 'not yet determined';
    const period = engagement.yearEnd || 'the period under audit';

    return `The population for ${sectionLabel} comprises all transactions/balances recorded in the ${sectionLabel} ledger as at ${period}. Total population value: ${total}. Total number of items: ${size}. The population was obtained from the client's accounting system and agreed to the trial balance. ${procedure.populationNotes || 'Any items excluded from the population are documented in the sampling section below.'}`;
  }

  /**
   * Build work done narrative bullets.
   * @param {string} section
   * @param {Object} procedure
   * @param {string} riskLevel
   * @returns {string[]}
   */
  _buildWorkDoneNarrative(section, procedure, _riskLevel) {
    if (Array.isArray(procedure.workDone) && procedure.workDone.length > 0) {
      return procedure.workDone;
    }

    const defaults = {
      revenue: [
        'Agreed total revenue per the trial balance to the management accounts and client-prepared schedules.',
        'Performed analytical procedures on monthly revenue by product/service line to identify unusual fluctuations.',
        'Selected a sample of sales transactions from the population and agreed to: customer purchase orders, delivery notes or service completion records, sales invoices, and bank receipts.',
        'Performed cut-off testing over the last 10 and first 10 business days of the period; agreed invoices to despatch/delivery documentation.',
        'Reviewed journal entries to the revenue account for unusual items, particularly manual journals posted at period end.',
        'Enquired of management regarding any side agreements, rebates, or revenue recognition adjustments not reflected in the ledger.'
      ],
      trade_debtors: [
        'Obtained the aged debtor listing and agreed the total to the trial balance.',
        'Sent external confirmation requests to a sample of debtors in accordance with ISA 505.',
        'Reviewed debtors over 90 days and obtained management explanations for non-payment.',
        'Assessed the adequacy of the bad debt provision by reviewing post-period cash receipts and correspondence with delinquent debtors.',
        'Confirmed that the ECL model (IFRS 9) or specific provision (FRS 102) has been applied consistently with prior periods.',
        'Reviewed credit notes issued after the year end to identify potential overstatement at the balance sheet date.'
      ],
      inventory: [
        'Attended the year-end inventory count in accordance with ISA 501 para 4.',
        'Performed test counts and agreed to the client\'s count sheets; identified any discrepancies.',
        'Agreed a sample of items from the count sheets to the inventory system and vice versa.',
        'Reviewed management\'s NRV assessment for slow-moving and obsolete items.',
        'Agreed inventory valuation to purchase invoices and confirmed cost method consistency.',
        'Tested cut-off by reviewing goods received and despatched in the period immediately before and after the year end.'
      ]
    };

    return defaults[section] || [
      `Obtained and reviewed the ${humanLabel(section)} schedule/listing and agreed to the trial balance.`,
      `Performed analytical procedures to identify unusual movements or balances requiring further investigation.`,
      `Selected a sample of items and agreed to supporting source documentation.`,
      `Reviewed management judgments and estimates for reasonableness.`,
      `Assessed the adequacy of disclosures in the financial statements.`
    ];
  }

  /**
   * Build evidence obtained list.
   * @param {string} section
   * @param {Object} procedure
   * @returns {string[]}
   */
  _buildEvidenceList(section, procedure) {
    if (Array.isArray(procedure.evidenceObtained) && procedure.evidenceObtained.length > 0) {
      return procedure.evidenceObtained;
    }

    const evidenceMap = {
      revenue: ['Sales invoices and corresponding purchase orders', 'Delivery notes / proof of delivery', 'Bank statements / remittance advices', 'Revenue recognition policy documentation', 'Monthly management accounts', 'Journal entry listings'],
      trade_debtors: ['Aged debtor listing from accounting system', 'External confirmation responses (ISA 505)', 'Post-period cash receipts listings', 'Correspondence with debtors regarding disputes', 'Bad debt provision schedule', 'Credit controller reports'],
      inventory: ['Inventory count sheets', 'Inventory listing from system', 'Purchase invoices for valuation', 'NRV assessments and selling price evidence', 'Count observation notes', 'Inventory movement reports'],
      ppe: ['Fixed asset register', 'Purchase invoices for additions', 'Disposal documentation', 'Depreciation schedule', 'Impairment review documentation', 'Asset inspection evidence / photographs'],
      trade_creditors: ['Aged creditor listing', 'Supplier statements', 'Purchase invoices', 'Bank payments post year end', 'Accruals schedule', 'Goods received notes'],
      provisions: ['Provision schedule and prior year comparatives', 'Legal correspondence / solicitor\'s letters', 'Management\'s estimate workings', 'Board minutes discussing provisions', 'Post-period resolution evidence (if applicable)'],
      payroll: ['Payroll summary reports', 'PAYE/NIC reconciliations', 'P60 / P11D submissions', 'Directors\' service contracts and board approval minutes', 'Holiday pay accrual workings', 'Bonus provision calculations'],
      tax: ['Corporation tax computation', 'Deferred tax workings', 'HMRC correspondence', 'Capital allowance computations', 'Tax adviser\'s workings', 'Prior year tax returns'],
      going_concern: ['Management\'s going concern assessment', 'Cash flow forecasts (minimum 12 months)', 'Bank facilities and covenant certificates', 'Board minutes discussing going concern', 'Budgets and business plans', 'Post-period financial information']
    };

    return evidenceMap[section] || [`${humanLabel(section)} trial balance listing`, 'Supporting schedules from management', 'Sample source documents'];
  }

  /**
   * Build conclusion narrative for a section.
   * @param {string} section
   * @param {Object} procedure
   * @param {string} riskLevel
   * @returns {string}
   */
  _buildConclusionNarrative(section, procedure, riskLevel) {
    const sectionLabel = humanLabel(section);
    const exceptionCount = Array.isArray(procedure.exceptions) ? procedure.exceptions.length : 0;

    if (exceptionCount === 0) {
      return `Based on the procedures performed, which we consider sufficient and appropriate in the circumstances, we are satisfied that ${sectionLabel} is not materially misstated. All assertions have been addressed and no exceptions were noted during our testing. No modification to the audit opinion is required on the basis of our work in this section.`;
    }

    return `Based on the procedures performed, ${exceptionCount} exception(s) were identified in the ${sectionLabel} section. These have been documented as findings above and communicated to management. The impact of these exceptions on the audit opinion has been assessed in the findings detail and the audit differences schedule. ${riskLevel === 'significant' || riskLevel === 'high' ? 'Given the high risk assessment, additional procedures were performed and the exceptions have been escalated for partner review.' : 'The exceptions are being accumulated with all other identified misstatements and assessed against materiality.'}`;
  }

  /**
   * Build opinion impact statement.
   * @param {string} section
   * @param {Object} procedure
   * @returns {string}
   */
  _buildOpinionImpact(section, procedure) {
    const exceptionCount = Array.isArray(procedure.exceptions) ? procedure.exceptions.length : 0;
    if (exceptionCount === 0) {
      return `No modification to the audit opinion is required on the basis of procedures performed over ${humanLabel(section)}.`;
    }
    return `The ${exceptionCount} finding(s) identified in ${humanLabel(section)} have been included in the audit differences schedule and will be considered as part of the overall assessment of the audit opinion at the completion stage (ISA 450 para 12; ISA 700 para 35).`;
  }

  /**
   * Build a table of contents for an FRC-ready package.
   * @param {Object[]} workingPapers
   * @param {Object}   engagement
   * @returns {Array<{ref, title, stage, section}>}
   */
  _buildTableOfContents(workingPapers, _engagement) {
    const staticSections = [
      { ref: 'PM-001', title: 'Planning Memorandum', stage: 'planning', section: 'planning' },
      { ref: 'RA-001', title: 'Risk Assessment Summary', stage: 'risk_assessment', section: 'risk_assessment' },
      { ref: 'MAT-001', title: 'Materiality Determination', stage: 'planning', section: 'materiality' },
      { ref: 'GC-001', title: 'Going Concern Assessment', stage: 'fieldwork', section: 'going_concern' },
      { ref: 'AD-001', title: 'Audit Differences Schedule', stage: 'completion', section: 'audit_differences' },
      { ref: 'ECM-001', title: 'Engagement Completion Memorandum', stage: 'completion', section: 'completion' }
    ];

    const wpEntries = workingPapers.map(wp => ({
      ref: wp.wpRef || wp.ref || 'N/A',
      title: wp.title || `${humanLabel(wp.section || wp.fsli || 'Unknown')} — ${wp.stage || 'Fieldwork'}`,
      stage: wp.stage || 'fieldwork',
      section: wp.section || wp.fsli || 'unknown'
    }));

    return [...staticSections, ...wpEntries].sort((a, b) => {
      const stageOrder = { planning: 1, risk_assessment: 2, fieldwork: 3, completion: 4 };
      return (stageOrder[a.stage] || 3) - (stageOrder[b.stage] || 3);
    });
  }

  /**
   * Build an evidence checklist for a section template.
   * @param {string} section
   * @returns {string[]}
   */
  _buildEvidenceChecklist(section) {
    const checklistMap = {
      revenue: [
        '[ ] Sales invoices for sampled transactions',
        '[ ] Proof of delivery / service completion',
        '[ ] Customer purchase orders',
        '[ ] Bank statements confirming receipt',
        '[ ] Cut-off documentation (GDNs around year end)',
        '[ ] Management accounts for analytical review'
      ],
      trade_debtors: [
        '[ ] Aged debtor listing agreed to trial balance',
        '[ ] Confirmation responses from debtors',
        '[ ] Post-period cash receipts listing',
        '[ ] Bad debt provision schedule and justification',
        '[ ] Customer correspondence re disputed balances'
      ],
      going_concern: [
        '[ ] Management\'s going concern assessment document',
        '[ ] 12-month cash flow forecast',
        '[ ] Current banking facilities evidence',
        '[ ] Covenant compliance certificates',
        '[ ] Board minutes discussing going concern',
        '[ ] Post-period financial information (management accounts)'
      ]
    };

    return checklistMap[section] || [
      `[ ] ${humanLabel(section)} schedule agreed to trial balance`,
      `[ ] Source documents for sampled items`,
      `[ ] Management workings/estimates`,
      `[ ] Prior year comparatives`,
      `[ ] Applicable financial statements disclosures`
    ];
  }

  /**
   * Classify an exception based on its properties.
   * @param {Object} exception
   * @returns {string}
   */
  _classifyException(exception) {
    if (exception.amount != null && Math.abs(exception.amount) > 0) return 'misstatement';
    if (exception.isLimitation) return 'limitation';
    return 'risk_indicator';
  }

  /**
   * Build an ISA-referenced analysis of an exception.
   * @param {Object} exception
   * @returns {string}
   */
  _buildISAExceptionAnalysis(exception) {
    const classification = exception.classification || this._classifyException(exception);
    switch (classification) {
      case 'misstatement':
        return `This exception constitutes a misstatement under ISA 450 para 2(a), which defines a misstatement as a difference between the reported amount, classification, presentation, or disclosure of a financial statement item and the amount, classification, presentation, or disclosure required under the applicable financial reporting framework. The misstatement has been quantified, assessed against performance materiality, and accumulated in the audit differences schedule in accordance with ISA 450 para 5.`;
      case 'limitation':
        return `This exception represents a limitation of scope. The auditor has been unable to obtain sufficient appropriate audit evidence in this area (ISA 200 para 5). The impact of this limitation on the audit opinion has been assessed under ISA 705 para 6. Where the possible effects of the limitation are material but not pervasive, a qualified opinion will be issued; where pervasive, a disclaimer of opinion will be considered.`;
      case 'risk_indicator':
        return `This exception has been identified as a risk indicator requiring consideration of whether additional audit procedures are necessary. Under ISA 330 para 6, the auditor is required to reassess the risks of material misstatement in light of evidence obtained and consider whether additional procedures are needed.`;
      default:
        return `This exception requires assessment under ISA 450 to determine its classification and impact on the audit opinion.`;
    }
  }

  /**
   * Build auditor's assessment of management explanation.
   * @param {Object} exception
   * @returns {string}
   */
  _buildAuditorAssessment(exception) {
    if (!exception.managementExplanation) {
      return 'Management has not provided an explanation for this exception. The auditor will follow up to obtain and evaluate management\'s response before concluding on this matter.';
    }

    return `Management has explained that ${exception.managementExplanation}. The auditor has considered this explanation and ${exception.explanationAccepted === true ? 'accepts it as reasonable based on the corroborating evidence obtained.' : exception.explanationAccepted === false ? 'does not accept it as this is inconsistent with the audit evidence obtained.' : 'is in the process of obtaining corroborating evidence to evaluate the explanation.'} ${exception.additionalAssessment || ''}`;
  }

  /**
   * Build a recommendation for an exception.
   * @param {Object} exception
   * @param {string} classification
   * @returns {string}
   */
  _buildExceptionRecommendation(exception, classification) {
    switch (classification) {
      case 'misstatement':
        return `Communicate this misstatement to management and request an adjustment (ISA 450 para 8). If management declines, accumulate in the unadjusted misstatements schedule and assess against materiality at the completion stage.`;
      case 'limitation':
        return `Assess the pervasiveness of this limitation. Consider whether alternative procedures can be performed to mitigate the scope limitation. Document the conclusion on opinion impact.`;
      case 'risk_indicator':
        return `Extend audit procedures in the affected area in response to this risk indicator (ISA 330 para 6). Document the additional procedures performed and re-evaluate whether the risk assessment requires revision.`;
      default:
        return 'Evaluate the impact of this exception on the audit conclusions and document the resolution.';
    }
  }

  /**
   * Determine required follow-up actions.
   * @param {Object} exception
   * @param {string} classification
   * @returns {string|null}
   */
  _determineFollowUp(exception, classification) {
    if (classification === 'misstatement') {
      return `Obtain management response to the identified misstatement. If adjustment is declined, ensure item is included in the audit differences schedule reviewed at partner level.`;
    }
    if (classification === 'limitation') {
      return `Partner to assess impact on audit opinion. Consider whether the scope limitation is pervasive or confined to a specific area.`;
    }
    return null;
  }

  /**
   * Build key risks addressed section for completion memo.
   * @param {Object[]} findings
   * @param {Object}   allSections
   * @returns {string}
   */
  _buildKeyRisksAddressedSection(findings, _allSections) {
    const highRiskFindings = findings.filter(f => f.riskLevel === 'high' || f.riskLevel === 'significant');
    const revenueFindings = findings.filter(f => f.sourceSection === 'revenue');
    const fraudRiskFindings = findings.filter(f =>
      f.isaReference && f.isaReference.toLowerCase().includes('240')
    );

    const lines = [];

    lines.push('Revenue Recognition (ISA 240 para A27 presumptive fraud risk):');
    lines.push(revenueFindings.length > 0
      ? `  ${revenueFindings.length} finding(s) identified in revenue. Enhanced cut-off testing, journal entry review, and analytical procedures were performed. See revenue working papers for full detail.`
      : '  Revenue procedures performed. No exceptions identified. The presumption of fraud risk in revenue recognition has been rebutted for this engagement based on the evidence obtained.'
    );
    lines.push('');

    lines.push('Management Override of Controls (ISA 240 para 31):');
    lines.push(`  Journal entry testing was performed across all significant account balances. Post-period entries and unusual adjustments were specifically reviewed. ${fraudRiskFindings.length > 0 ? `${fraudRiskFindings.length} matter(s) identified and documented.` : 'No material issues identified.'}`);
    lines.push('');

    if (highRiskFindings.length > 0) {
      lines.push('High/Significant Risk Areas:');
      const grouped = {};
      for (const f of highRiskFindings) {
        if (!grouped[f.sourceSection]) grouped[f.sourceSection] = 0;
        grouped[f.sourceSection]++;
      }
      for (const [sec, count] of Object.entries(grouped)) {
        lines.push(`  ${humanLabel(sec)}: ${count} high/significant risk finding(s). Specific responses were designed and performed as documented in the section working papers.`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Determine the recommended completion opinion.
   * @param {Object[]} allMisstatements
   * @param {Object[]} allFindings
   * @param {Object}   engagement
   * @returns {{ opinionType: string, reasoning: string, isaRef: string }}
   */
  _recommendCompletionOpinion(allMisstatements, allFindings, engagement) {
    const limitations = allFindings.filter(f => f.findingType === 'limitation');
    const unadjustedMat = allMisstatements.filter(
      f => !f.isAdjusted && (f.riskLevel === 'significant' || f.riskLevel === 'high')
    );
    const goingConcernIssues = allFindings.filter(
      f => f.sourceSection === 'going_concern' && f.riskLevel !== 'low'
    );

    if (limitations.length > 0 && limitations.some(f => f.riskLevel === 'significant')) {
      return {
        opinionType: 'Disclaimer of Opinion',
        reasoning: 'A significant limitation of scope has been identified that is pervasive to the financial statements. The auditor has been unable to obtain sufficient appropriate audit evidence and cannot express an opinion on the financial statements.',
        isaRef: 'ISA 705 para 9'
      };
    }

    if (unadjustedMat.length > 0) {
      const totalUnadjusted = unadjustedMat.reduce((sum, f) => sum + Math.abs(f.amount || 0), 0);
      const matThreshold = engagement.materiality || 0;
      if (matThreshold > 0 && totalUnadjusted > matThreshold * 2) {
        return {
          opinionType: 'Adverse Opinion',
          reasoning: `Material and pervasive unadjusted misstatements totalling approximately £${totalUnadjusted.toLocaleString('en-GB', { minimumFractionDigits: 0 })} have been identified. These are considered pervasive given their magnitude and the number of affected sections.`,
          isaRef: 'ISA 705 para 8'
        };
      }
      return {
        opinionType: 'Qualified Opinion (Except For)',
        reasoning: `Unadjusted material misstatement(s) have been identified that management has declined to correct. These are material but not pervasive to the financial statements taken as a whole. The opinion is qualified "except for" the effects of the matters described in the Basis for Qualified Opinion paragraph.`,
        isaRef: 'ISA 705 para 7'
      };
    }

    if (limitations.length > 0) {
      return {
        opinionType: 'Qualified Opinion (Limitation of Scope)',
        reasoning: 'A limitation of scope has been identified. The possible effects are material but not pervasive. A qualified opinion "except for the possible effects" of the limitation is recommended.',
        isaRef: 'ISA 705 para 6(b)'
      };
    }

    if (goingConcernIssues.length > 0) {
      return {
        opinionType: 'Unmodified Opinion with Material Uncertainty Related to Going Concern',
        reasoning: 'Going concern matters have been identified. A separate Material Uncertainty Related to Going Concern section is required in the auditor\'s report in accordance with ISA 570 para 22.',
        isaRef: 'ISA 570 para 22; ISA 706'
      };
    }

    if (allFindings.some(f => f.riskLevel === 'significant')) {
      return {
        opinionType: 'Unmodified Opinion (consider Emphasis of Matter)',
        reasoning: 'No material unadjusted misstatements were identified. However, given the significant risk matters identified during the audit, consideration should be given to whether an Emphasis of Matter paragraph is required to draw users\' attention to a matter of fundamental importance (ISA 706 para 8).',
        isaRef: 'ISA 700 para 35; ISA 706 para 8'
      };
    }

    return {
      opinionType: 'Unmodified Opinion',
      reasoning: 'The audit has been completed without identification of material unadjusted misstatements, pervasive limitations of scope, or going concern issues. The financial statements are considered to give a true and fair view in accordance with the applicable financial reporting framework.',
      isaRef: 'ISA 700 para 35'
    };
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

export const auditDocumentationService = new AuditDocumentationService();
export default AuditDocumentationService;
