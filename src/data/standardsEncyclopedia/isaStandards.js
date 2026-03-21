/**
 * COMPLETE ISA (UK) STANDARDS ENCYCLOPEDIA
 * International Standards on Auditing (UK) — issued by FRC
 * Based on IAASB ISAs with UK-specific amendments
 * Last updated: March 2026 — reflects ISA (UK) Revised 2024
 *
 * Covers: ISA 200-810, ISQM 1-2, ISRE 2410
 */

// ============================================================================
// QUALITY MANAGEMENT STANDARDS
// ============================================================================
export const QUALITY_MANAGEMENT = {
  ISQM_1: {
    id: 'ISQM_1',
    title: 'Quality Management for Firms that Perform Audits or Reviews of Financial Statements, or Other Assurance or Related Services Engagements',
    effectiveDate: '2022-12-15',
    lastAmended: '2024-01-01',
    objective: 'Firm designs, implements, and operates a system of quality management for audits and other engagements',
    keyRequirements: [
      'Risk-based approach to quality management',
      'Eight components: (1) Firm risk assessment process, (2) Governance and leadership, (3) Relevant ethical requirements, (4) Acceptance and continuance, (5) Engagement performance, (6) Resources, (7) Information and communication, (8) Monitoring and remediation process',
      'Quality objectives: what the firm aims to achieve for each component',
      'Quality risks: conditions, events, actions that may adversely affect quality objectives',
      'Responses: policies and procedures to address quality risks',
      'Annual evaluation of the system of quality management',
      'Conclusion: operates effectively, except for matter(s), or does not operate effectively',
      'Documentation of system design and operating effectiveness'
    ],
    auditPhases: ['all'],
    workingPapers: ['Firm-level QM documentation']
  },

  ISQM_2: {
    id: 'ISQM_2',
    title: 'Engagement Quality Reviews',
    effectiveDate: '2022-12-15',
    lastAmended: '2024-01-01',
    objective: 'Establish requirements for appointment and eligibility of engagement quality reviewer and performance of engagement quality review',
    keyRequirements: [
      'Required for: listed entities, public interest entities, and engagements where firm determines EQR is appropriate response to quality risks',
      'EQ reviewer: must be objective, competent, have sufficient authority',
      'Cooling-off period: at least 2 years after serving as engagement partner',
      'Review scope: significant judgments, significant risks, going concern, independence, consultation on difficult matters, audit report appropriateness',
      'EQ reviewer must discuss significant matters with engagement partner',
      'EQ reviewer conclusion required before audit report dated',
      'Documentation of review and conclusion'
    ],
    auditPhases: ['completion', 'reporting'],
    workingPapers: ['E5-EQR']
  }
};

// ============================================================================
// ISA 200-299: GENERAL PRINCIPLES AND RESPONSIBILITIES
// ============================================================================
export const ISA_GENERAL_PRINCIPLES = {
  ISA_200: {
    id: 'ISA_200',
    title: 'Overall Objectives of the Independent Auditor and the Conduct of an Audit in Accordance with International Standards on Auditing (UK)',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Obtain reasonable assurance about whether financial statements as a whole are free from material misstatement and report thereon',
    keyRequirements: [
      'Reasonable assurance: high but not absolute level of assurance (para 5)',
      'Professional skepticism: questioning mind, alert to contradictory evidence (para 15)',
      'Professional judgment: application of training, knowledge, experience (para 16)',
      'Sufficient appropriate audit evidence to reduce audit risk to acceptably low level',
      'Audit risk = Inherent risk × Control risk × Detection risk',
      'Comply with ethical requirements including independence',
      'Comply with all ISAs relevant to the audit',
      'Limitations of an audit: sampling, nature of evidence, management representations, fraud, related parties'
    ],
    ukAmendments: [
      'Reference to FRC Ethical Standard rather than IESBA Code',
      'True and fair view requirement per Companies Act 2006'
    ],
    auditPhases: ['all'],
    workingPapers: ['A1-Engagement']
  },

  ISA_210: {
    id: 'ISA_210',
    title: 'Agreeing the Terms of Audit Engagements',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Accept or continue audit engagement only when preconditions established and there is agreement on terms',
    keyRequirements: [
      'Preconditions: acceptable financial reporting framework, management acknowledges responsibilities',
      'Management responsibilities: preparation of FS, internal control, access to all information, no restriction on scope',
      'Engagement letter: mandatory for each new engagement (and recurring if terms change)',
      'Content: objective and scope, auditor responsibilities, management responsibilities, framework, expected form and content of reports',
      'If preconditions not present: not accept engagement (or withdraw if regulations permit)',
      'Change in engagement terms: only if reasonable justification (not to avoid modified opinion)',
      'Group audits: additional terms regarding access to component information'
    ],
    auditPhases: ['planning'],
    workingPapers: ['A1-EngagementLetter']
  },

  ISA_220: {
    id: 'ISA_220',
    title: 'Quality Management for an Audit of Financial Statements',
    effectiveDate: '2022-12-15',
    lastAmended: '2024-01-01',
    objective: 'Engagement partner manages and achieves quality at engagement level',
    keyRequirements: [
      'Engagement partner responsible for overall quality (even if tasks delegated)',
      'Leadership responsibilities: set appropriate tone, emphasise professional skepticism, quality expectations',
      'Ethical requirements: remain alert to non-compliance throughout engagement',
      'Independence: obtain confirmation from all team members',
      'Acceptance and continuance: evaluate appropriateness at engagement level',
      'Engagement resources: sufficient and appropriate team, technological resources, intellectual resources',
      'Engagement performance: direction, supervision, review',
      'Direction: team briefing, audit strategy, responsibilities',
      'Supervision: tracking progress, addressing issues, coaching',
      'Review: work performed meets quality standards, evidence sufficient, conclusions appropriate',
      'Review of significant matters: engagement partner personally reviews',
      'Consultation on difficult or contentious matters',
      'Differences of opinion: resolved before report dated',
      'Documentation: sufficient to demonstrate compliance with quality management'
    ],
    auditPhases: ['all'],
    workingPapers: ['A1-QualityManagement']
  },

  ISA_230: {
    id: 'ISA_230',
    title: 'Audit Documentation',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Prepare documentation providing sufficient record of basis for audit report and evidence of planning and performance',
    keyRequirements: [
      'Experienced auditor test: documentation sufficient for experienced auditor with no prior connection to understand nature/timing/extent of procedures, results, evidence, significant matters, conclusions, professional judgments (para 8)',
      'Document: nature, timing, extent of audit procedures performed',
      'Document: results of procedures and evidence obtained',
      'Document: significant matters and conclusions, professional judgments',
      'Document: discussions of significant matters with management/TCWG/others (who, when, what)',
      'Document: how inconsistencies or contradictions were addressed',
      'Final assembly: within 60 days of audit report date (para A21)',
      'Retention period: at least 5 years from audit report date (UK: 6 years per FRC)',
      'Completion after report date: document circumstances and procedures performed',
      'File must not be deleted or discarded before end of retention period'
    ],
    auditPhases: ['all'],
    workingPapers: ['All']
  },

  ISA_240: {
    id: 'ISA_240',
    title: 'The Auditor\'s Responsibilities Relating to Fraud in an Audit of Financial Statements',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Identify and assess risks of material misstatement due to fraud, obtain sufficient evidence, and respond appropriately',
    keyRequirements: [
      'Two types of fraud: fraudulent financial reporting and misappropriation of assets',
      'Fraud triangle: incentive/pressure, opportunity, attitude/rationalisation',
      'Presumed risks: revenue recognition fraud (rebuttable), management override of controls (not rebuttable)',
      'Engagement team discussion: brainstorm fraud risks, opportunities, management incentives (para 15)',
      'Inquiries of management: awareness of actual/suspected fraud, process for identifying and responding, communication to TCWG',
      `Inquiries of TCWG: oversight of management's anti-fraud processes`,
      'Evaluate fraud risk factors throughout the audit',
      'Responses to assessed risks: overall (unpredictability), specific procedures for identified risks',
      'Management override procedures (MANDATORY): test journal entries and other adjustments, review accounting estimates for bias, evaluate business rationale of unusual transactions (para 32-34)',
      'Journal entry testing: identify and test high-risk journal entries (automated entries, manually adjusted, non-standard)',
      'Communication: to TCWG (all fraud identified), to management (fraud involving employees), to regulators/law enforcement if required',
      'UK: duty to report to appropriate authority if suspected offence under Proceeds of Crime Act 2002 or Terrorism Act 2000',
      'Document: fraud risk brainstorming, assessed fraud risks, responses, communications'
    ],
    fraudRiskIndicators: {
      financialReporting: [
        'Pressure to meet analyst expectations or debt covenants',
        'Significant related party transactions outside normal course',
        'Aggressive accounting policies or unusual period-end adjustments',
        'Complex transactions near period end',
        'Domination by single individual or small group without oversight'
      ],
      assetMisappropriation: [
        'Personal financial pressures of employees',
        'Cash-intensive operations',
        'Small/high-value assets easily converted to cash',
        'Inadequate segregation of duties',
        'Inadequate physical safeguards over assets'
      ]
    },
    auditPhases: ['planning', 'risk', 'interim', 'final', 'completion'],
    workingPapers: ['B4-FraudAssessment', 'D-JournalEntryTesting']
  },

  ISA_250: {
    id: 'ISA_250',
    title: 'Consideration of Laws and Regulations in an Audit of Financial Statements',
    sectionA: 'The Auditor\'s Consideration of Compliance with Laws and Regulations',
    sectionB: 'The Auditor\'s Statutory Right and Duty to Report to Regulators and Third Parties',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Obtain sufficient audit evidence regarding compliance with laws and regulations having direct or indirect effect on FS',
    keyRequirements: [
      'Two categories of laws: (A) direct effect on determination of amounts/disclosures (tax, pension), (B) fundamental to operating ability but do not directly affect FS (operating licences, environmental)',
      'Category A: obtain evidence of compliance through normal audit procedures',
      'Category B: general understanding and inquiry; remain alert to non-compliance',
      'Procedures: inquire of management/legal counsel, inspect correspondence with regulators, review minutes',
      'If non-compliance identified: understand nature, evaluate effect on FS, discuss with management/TCWG',
      'If management/TCWG involved: communicate to audit committee or equivalent',
      'Reporting to regulators: UK-specific obligations under Companies Act s498, Financial Services and Markets Act',
      'Section B (UK): statutory duty to report to certain regulators (FCA, PRA) for regulated entities',
      'Tipping-off provisions: do not alert entity if reporting to law enforcement (Proceeds of Crime Act)',
      'Evaluate impact on audit opinion: material misstatement, scope limitation, going concern',
      'Document: non-compliance matters, discussions, conclusions, reports made'
    ],
    ukSpecificReporting: [
      'Companies Act 2006 s498: duty to report on inadequate accounting records',
      'Financial Services and Markets Act 2000: reporting to FCA/PRA',
      'Proceeds of Crime Act 2002: suspicious activity reports (SARs)',
      'Terrorism Act 2000: duty to report suspected terrorist financing',
      'Money Laundering Regulations 2017: AML obligations',
      'Charity Commission reporting (for charitable entities)'
    ],
    auditPhases: ['planning', 'risk', 'final', 'completion'],
    workingPapers: ['A2-LawsAndRegulations']
  },

  ISA_260: {
    id: 'ISA_260',
    title: 'Communication with Those Charged with Governance',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Communicate clearly with TCWG regarding auditor responsibilities, planned scope/timing, and significant findings',
    keyRequirements: [
      'Identify appropriate persons within governance structure',
      'Communicate: auditor responsibilities under ISAs, planned scope and timing of audit',
      'Communicate significant findings: qualitative aspects of accounting practices, significant difficulties, significant matters discussed with management, written representations requested, other matters arising (para 16)',
      'Independence: for listed/PIE entities — communicate threats and safeguards, fees, non-audit services',
      'Form of communication: in writing for significant matters (para A19)',
      'Timing: on timely basis (planning matters early; findings before report date)',
      'Adequacy of communication process: evaluate whether two-way communication is adequate',
      'If communication process inadequate: consider impact on audit (scope limitation)',
      'UK PIE entities: additional communication of KAMs, going concern assessment, significant matters',
      'Documentation: matters communicated, form, timing, actions resulting from communication'
    ],
    auditPhases: ['planning', 'completion', 'reporting'],
    workingPapers: ['F3-GovernanceLetter', 'F4-ManagementLetter']
  },

  ISA_265: {
    id: 'ISA_265',
    title: 'Communicating Deficiencies in Internal Control to Those Charged with Governance and Management',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Communicate appropriately significant deficiencies in internal control identified during the audit',
    keyRequirements: [
      'Deficiency in internal control: control does not exist, or control designed/operating ineffectively',
      'Significant deficiency: deficiency or combination of deficiencies of sufficient importance to merit attention of TCWG',
      'Indicators of significance: likelihood of material misstatement, susceptibility to loss/fraud, subjectivity/complexity, financial statement amounts affected, volume of activity, importance of affected controls',
      'Communication in writing to TCWG on timely basis',
      'Communication in writing to management of significant deficiencies (and other deficiencies if appropriate)',
      'Include: description of deficiency, explanation of potential effects, sufficient context',
      'No obligation to identify ALL deficiencies (only those noted during audit)',
      'May also communicate to regulators if required'
    ],
    auditPhases: ['interim', 'final', 'completion'],
    workingPapers: ['F4-ManagementLetter']
  }
};

// ============================================================================
// ISA 300-499: RISK ASSESSMENT AND RESPONSE
// ============================================================================
export const ISA_RISK_ASSESSMENT = {
  ISA_300: {
    id: 'ISA_300',
    title: 'Planning an Audit of Financial Statements',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Plan the audit so that it will be performed in an effective manner',
    keyRequirements: [
      'Planning activities: overall audit strategy and detailed audit plan',
      'Overall audit strategy: scope (framework, reporting requirements, locations, materiality), timing (deadlines, key dates, team meetings), direction (resources, team composition, specialist needs)',
      'Audit plan: nature, timing, extent of risk assessment procedures, further audit procedures, other planned procedures',
      'Initial engagement: additional procedures (predecessor auditor, opening balances)',
      'Planning is continuous: update strategy and plan as audit progresses',
      'Engagement partner involvement in planning',
      'Document: overall audit strategy, audit plan, significant changes during engagement'
    ],
    auditPhases: ['planning'],
    workingPapers: ['A1-AuditStrategy', 'A1-AuditPlan']
  },

  ISA_315: {
    id: 'ISA_315',
    title: 'Identifying and Assessing the Risks of Material Misstatement',
    subtitle: '(ISA 315 Revised 2019 — effective December 2022)',
    effectiveDate: '2022-12-15',
    lastAmended: '2024-01-01',
    objective: 'Identify and assess risks of material misstatement at FS level and assertion level through understanding the entity and its environment',
    keyRequirements: [
      'UNDERSTAND: entity and environment, applicable financial reporting framework, entity\'s system of internal control, inherent risk factors',
      'Inherent risk factors (para 12.5): complexity, subjectivity, change, uncertainty, susceptibility to misstatement due to management bias or fraud',
      'Spectrum of inherent risk: ranges from lower to higher based on likelihood and magnitude',
      'Significant risk: identified risk of material misstatement for which assessment of inherent risk is close to upper end of spectrum (para 12.10)',
      'Components of internal control to understand: (1) control environment, (2) entity\'s risk assessment process, (3) entity\'s process to monitor system of internal control, (4) information system and communication, (5) control activities',
      'IT environment: understand IT applications, IT infrastructure, IT processes and personnel relevant to financial reporting',
      'Risk assessment procedures: inquiries, observation, inspection, analytical procedures',
      'Assertions — classes of transactions: occurrence, completeness, accuracy, cutoff, classification',
      'Assertions — account balances: existence, rights and obligations, completeness, valuation and allocation',
      'Assertions — presentation and disclosure: occurrence and rights, completeness, classification and understandability, accuracy and valuation',
      'Identify controls relevant to the audit: required for significant risks; other risks where substantive alone insufficient',
      'Document: discussion among team, key elements of understanding, identified risks and related assertions, significant risks, controls identified'
    ],
    scalabilityConsiderations: [
      'Smaller entities: less formal internal control, owner-manager involvement, simpler IT',
      'Risk factors same but nature of risks may differ',
      'Documentation requirements still apply but may be less extensive'
    ],
    auditPhases: ['planning', 'risk'],
    workingPapers: ['B1-RiskAssessment', 'B2-ControlsUnderstanding', 'B3-InherentRiskMatrix']
  },

  ISA_320: {
    id: 'ISA_320',
    title: 'Materiality in Planning and Performing an Audit',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Apply concept of materiality appropriately in planning and performing the audit',
    keyRequirements: [
      'Materiality for FS as a whole (overall materiality — OM): determined at planning stage',
      'Common benchmarks: profit before tax (5%), revenue (0.5-2%), total assets (1-2%), gross profit (5-10%), equity (2-5%)',
      'Selection of benchmark: consider nature of entity, ownership structure, how users employ FS',
      'Loss-making entities: consider normalised profit, revenue, or total assets',
      'Performance materiality (PM): set to reduce aggregate of uncorrected/undetected misstatements below OM — typically 50-75% of OM',
      'Factors for PM: understanding of entity (errors found in previous audits, assessed risk levels, expectations)',
      'Materiality for particular classes/balances/disclosures: if misstatements below OM could influence users (e.g., related party transactions, director remuneration)',
      'Revision: revise OM during audit if information comes to light that would have caused different determination',
      'If OM revised downward: re-evaluate PM and nature/timing/extent of further procedures',
      'Document: OM for FS as a whole, PM, materiality for specific classes if applicable, basis for determination, any revisions'
    ],
    benchmarkGuidance: {
      profitBeforeTax: { range: '3-5%', typicallyUsedFor: 'Profit-making commercial entities' },
      revenue: { range: '0.5-2%', typicallyUsedFor: 'Entities with volatile profits, not-for-profit, early-stage' },
      totalAssets: { range: '1-2%', typicallyUsedFor: 'Asset-holding entities, investment companies, property companies' },
      grossProfit: { range: '5-10%', typicallyUsedFor: 'Entities with low profit margins (retail, distribution)' },
      netAssets: { range: '2-5%', typicallyUsedFor: 'Charities, membership organisations' },
      totalExpenditure: { range: '1-2%', typicallyUsedFor: 'Not-for-profit, public sector' }
    },
    auditPhases: ['planning'],
    workingPapers: ['A3-Materiality']
  },

  ISA_330: {
    id: 'ISA_330',
    title: 'The Auditor\'s Responses to Assessed Risks',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Obtain sufficient appropriate audit evidence about assessed risks of material misstatement through appropriate responses',
    keyRequirements: [
      'Overall responses: to risks at FS level (staffing, supervision, unpredictability, audit approach)',
      'Further audit procedures: responsive to assessed risks at assertion level',
      'Tests of controls: when (a) plan to rely on controls, or (b) substantive procedures alone cannot provide sufficient evidence',
      'Tests of controls: inquiry + other procedure (inspection, observation, reperformance)',
      'Timing of control tests: during interim period — consider changes since testing, update procedures for remaining period',
      'Substantive procedures: required for each material class/balance/disclosure regardless of assessed risk level (para 18)',
      'Types: tests of detail, substantive analytical procedures',
      'Nature considerations: more persuasive evidence for higher risks',
      'Timing: period-end testing for higher risks; interim testing requires rollforward',
      'Extent: larger samples for higher risks',
      'Adequacy of presentation and disclosure: evaluate compliance with applicable framework',
      'Evaluate overall: step back — sufficient appropriate evidence for all assessed risks?',
      'Document: overall responses, further procedures, results, conclusions on operating effectiveness of controls'
    ],
    auditPhases: ['interim', 'final'],
    workingPapers: ['B5-AuditResponse', 'D-AllWorkingSections']
  },

  ISA_402: {
    id: 'ISA_402',
    title: 'Audit Considerations Relating to an Entity Using a Service Organisation',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Obtain sufficient understanding and evidence when entity uses service organisations for processing',
    keyRequirements: [
      'Understand nature and significance of services provided and effect on internal control',
      'Type 1 report: description and design of controls at a point in time',
      'Type 2 report: description, design, AND operating effectiveness over a period',
      'Evaluate: scope of report, period covered, complementary user entity controls',
      'If Type 2 not available: may need to visit service organisation or use another auditor',
      'Inclusive vs carve-out method: understand sub-service organisations',
      'Document: understanding obtained, conclusions on using service auditor report'
    ],
    auditPhases: ['planning', 'risk', 'interim'],
    workingPapers: ['B2-ServiceOrganisations']
  },

  ISA_450: {
    id: 'ISA_450',
    title: 'Evaluation of Misstatements Identified During the Audit',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    objective: 'Evaluate effect of identified misstatements on the audit and of uncorrected misstatements on the financial statements',
    keyRequirements: [
      'Accumulate all misstatements identified (except clearly trivial)',
      'Clearly trivial: amounts well below trivial threshold (typically 5% of OM)',
      'Communicate misstatements to appropriate level of management on timely basis',
      'Request management to correct all misstatements',
      'Re-evaluate materiality if aggregate of uncorrected misstatements approaches OM',
      'Determine whether uncorrected misstatements are material individually or in aggregate',
      'Consider: nature, circumstances, amount, effect on trends/ratios/covenants, effect on future periods',
      'Communication to TCWG: uncorrected misstatements, effect of uncorrected misstatements, request for correction',
      'Written representation: management believes effect of uncorrected misstatements is immaterial',
      'Document: clearly trivial threshold, all misstatements accumulated, whether corrected, conclusion on materiality of uncorrected'
    ],
    auditPhases: ['interim', 'final', 'completion'],
    workingPapers: ['E1-SummaryOfMisstatements']
  }
};

// ============================================================================
// ISA 500-599: AUDIT EVIDENCE
// ============================================================================
export const ISA_AUDIT_EVIDENCE = {
  ISA_500: {
    id: 'ISA_500',
    title: 'Audit Evidence',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Sufficient (quantity) and appropriate (quality: relevance and reliability)',
      'Audit procedures to obtain evidence: inspection, observation, external confirmation, recalculation, reperformance, analytical procedures, inquiry',
      'Reliability: external > internal, internal controls effective > weak, directly obtained > indirectly, documentary > oral, originals > copies',
      `Information from management's expert: evaluate competence, capabilities, objectivity`,
      'If information inconsistent with other evidence: investigate',
      'Consider cost vs benefit (but difficulty/expense not valid reason to omit necessary procedure)'
    ],
    auditPhases: ['all'],
    workingPapers: ['All']
  },

  ISA_501: {
    id: 'ISA_501',
    title: 'Audit Evidence — Specific Considerations for Selected Items',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Inventory: if material, attend physical count (observe, inspect, perform test counts), if impracticable — alternative procedures',
      'Inventory held by third parties: confirmation and/or inspection',
      'Litigation and claims: inquire of management, review legal correspondence, obtain written confirmation from entity\'s lawyers',
      'Segment information: evaluate in relation to FS as a whole'
    ],
    auditPhases: ['final'],
    workingPapers: ['D-Inventory', 'D-Litigation']
  },

  ISA_505: {
    id: 'ISA_505',
    title: 'External Confirmations',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Design confirmation request: consider assertion being tested, risks, and expected response rates',
      'Positive confirmation: explicit response requested (balances, terms)',
      'Negative confirmation: response only if disagree (less persuasive)',
      'Maintain control over confirmation process: send directly, receive directly',
      'Electronic confirmations: evaluate security and reliability',
      'Management refusal to send: determine whether refusal is reasonable; if not, discuss with TCWG, perform alternative procedures',
      'Non-responses: perform alternative procedures; evaluate implications',
      'Reliability of responses: assess whether genuine (call to verify, match to known contacts)',
      'Exceptions/disagreements: investigate and resolve, determine if misstatement'
    ],
    auditPhases: ['final'],
    workingPapers: ['D-Confirmations']
  },

  ISA_510: {
    id: 'ISA_510',
    title: 'Initial Audit Engagements — Opening Balances',
    effectiveDate: '2016-06-17',
    keyRequirements: [
      'Obtain evidence that opening balances do not contain misstatements materially affecting current period',
      'Determine whether prior period accounting policies consistently applied',
      'Review predecessor auditor workpapers (with permission)',
      'If prior period audited: read predecessor report, evaluate qualifications',
      'If unable to obtain sufficient evidence: qualified or disclaimer of opinion'
    ],
    auditPhases: ['planning'],
    workingPapers: ['A5-OpeningBalances']
  },

  ISA_520: {
    id: 'ISA_520',
    title: 'Analytical Procedures',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Substantive analytical procedures: develop expectation, determine acceptable threshold, compare to recorded amount, investigate significant differences',
      'Suitability: depends on assertions, availability of data, precision, reliability of data',
      'Types: ratio analysis, trend analysis, reasonableness tests, regression analysis',
      'Overall review (ISA 520.6): required at completion — review FS and conclusions are consistent with understanding of entity',
      'If reveal previously unrecognised risk: revise risk assessment and re-evaluate planned procedures',
      'Document: expectation, threshold, comparison, investigation of differences, conclusions'
    ],
    auditPhases: ['planning', 'final', 'completion'],
    workingPapers: ['B1-PreliminaryAnalytics', 'D-SubstantiveAnalytics', 'E1-FinalAnalyticalReview']
  },

  ISA_530: {
    id: 'ISA_530',
    title: 'Audit Sampling',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Statistical or non-statistical sampling: both acceptable',
      'Sample design: purpose (controls or substantive), population definition, stratification, sample size',
      'Sample size factors: acceptable level of sampling risk, tolerable rate of deviation (controls) or tolerable misstatement (substantive), expected deviation rate/misstatement',
      'Selection methods: random, systematic, haphazard (monetary unit sampling for substantive)',
      'Performing procedures: examine all items selected; if item cannot be examined, treat as exception or use alternative',
      'Evaluating results (controls): deviation rate vs tolerable rate; if exceeded, reassess control risk',
      'Evaluating results (substantive): project misstatements to population; compare projected + known + anomalous to tolerable misstatement',
      'Anomalous items: may be excluded from projection if isolated and non-representative',
      'Document: population, sample size basis, selection method, results, conclusions'
    ],
    samplingGuidance: {
      controlTestingSampleSizes: {
        expectedDeviations_0: { tolerableRate_5: 59, tolerableRate_10: 29 },
        expectedDeviations_1: { tolerableRate_5: 93, tolerableRate_10: 39 },
        expectedDeviations_2: { tolerableRate_5: 124, tolerableRate_10: 48 }
      },
      commonApproaches: [
        'Monetary Unit Sampling (MUS): probability proportional to size — biases toward larger items',
        'Random selection: equal probability for all items',
        'Systematic selection: every nth item from random start',
        'Stratified sampling: divide population into homogeneous groups'
      ]
    },
    auditPhases: ['interim', 'final'],
    workingPapers: ['D-SamplingWorkpapers']
  },

  ISA_540: {
    id: 'ISA_540',
    title: 'Auditing Accounting Estimates and Related Disclosures',
    subtitle: '(ISA 540 Revised — effective December 2019)',
    effectiveDate: '2019-12-15',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Risk assessment: understand how management identifies, makes, and discloses estimates',
      `Understand: methods/models, assumptions, data sources, management's selection of point estimate, uncertainty`,
      'Inherent risk factors: estimation uncertainty, complexity, subjectivity',
      'Spectrum of inherent risk for each estimate: consider likelihood and magnitude of misstatement',
      'Responses: (a) obtain evidence from events up to date of auditor report, (b) test how management made estimate, (c) develop auditor point estimate or range',
      `For significant risks: test controls over estimates, test management's process in detail, develop independent estimate`,
      'Evaluate reasonableness of management assumptions (both individually and in combination)',
      'Assess indicators of management bias: consider directional consistency, pattern of revisions, one-sided assumptions',
      'Disclosures: evaluate adequacy and conformity with applicable framework',
      'Communication: significant findings to TCWG regarding estimates (ISA 260)',
      'Document: understanding of estimation process, assessment of risks, nature and results of procedures, indicators of bias, conclusion on reasonableness'
    ],
    commonEstimates: [
      'Bad debt provisions / ECL',
      'Inventory NRV / obsolescence',
      'Warranty provisions',
      'Fair value of financial instruments',
      'Impairment of assets (goodwill, PP&E, intangibles)',
      'Depreciation/amortisation useful lives',
      'Defined benefit pension obligations',
      'Share-based payment valuations',
      'Revenue recognition (percentage of completion)',
      'Deferred tax asset recoverability',
      'Legal provisions',
      'Insurance claim reserves'
    ],
    auditPhases: ['risk', 'final', 'completion'],
    workingPapers: ['B3-AccountingEstimates', 'D-EstimatesTesting']
  },

  ISA_550: {
    id: 'ISA_550',
    title: 'Related Parties',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      `Understand entity's related party relationships and transactions`,
      'Risk assessment: related parties may create increased fraud risk',
      'Inquiries of management: identity of related parties, nature of relationships, transactions entered into',
      'Inspect: board minutes, shareholder registers, contracts, correspondence, tax returns, information from regulators',
      'Evaluate: business rationale of significant transactions, whether terms and conditions are consistent with arms-length basis',
      'Previously undisclosed related parties: communicate to team, reassess risk, evaluate management integrity',
      `Significant transactions outside normal course: evaluate management's assertions about business purpose and authorisation`,
      'Obtain written representations from management regarding completeness of identification and disclosure',
      'Report to TCWG: significant related party matters arising',
      'FRS 102 s33 / IAS 24 disclosure requirements'
    ],
    auditPhases: ['planning', 'risk', 'final', 'completion'],
    workingPapers: ['B5-RelatedParties']
  },

  ISA_560: {
    id: 'ISA_560',
    title: 'Subsequent Events',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Period 1: Between year-end and audit report date — perform active procedures',
      'Procedures: inquire of management, read minutes, review latest interim FS, inquire of legal counsel',
      'Adjusting events: conditions at year-end — adjust FS',
      'Non-adjusting events: disclose if material',
      'Period 2: After audit report date but before FS issued — no obligation to perform procedures, but if fact comes to attention, discuss with management',
      'Period 3: After FS issued — no obligation, but if fact discovered that would have caused different report, take appropriate action',
      'If management does not amend FS when required: modify opinion or take other action'
    ],
    auditPhases: ['completion'],
    workingPapers: ['E3-SubsequentEvents']
  },

  ISA_570: {
    id: 'ISA_570',
    title: 'Going Concern',
    subtitle: '(ISA (UK) 570 Revised — September 2019)',
    effectiveDate: '2019-09-15',
    lastAmended: '2024-01-01',
    keyRequirements: [
      `Evaluate management's assessment of going concern (at least 12 months from FS date)`,
      'UK: management must assess at least 12 months from date of approval of FS',
      `Consider whether management's assessment covers adequate period`,
      `Obtain written representations regarding management's plans for future actions`,
      'Remain alert throughout the audit for events/conditions that may cast significant doubt',
      'Indicators: net liability position, negative operating cash flows, adverse financial ratios, substantial operating losses, inability to pay creditors on time, loss of major customer, arrears of dividends, inability to comply with loan terms, denial of trade credit, change from credit to cash-on-delivery',
      `If events/conditions identified: evaluate management's plans and whether they are feasible`,
      'Reporting implications: (a) GC appropriate, no material uncertainty → unmodified, (b) GC appropriate, material uncertainty → unmodified with material uncertainty section (or EOM), (c) GC inappropriate → adverse opinion',
      'UK-specific: auditor must state whether material uncertainty exists, and if not, explain how conclusion reached',
      'UK-specific: for PIE entities — additional reporting on going concern review under ISA (UK) 570 para 21-22',
      `Document: management's assessment, events/conditions, management's plans, auditor's conclusion`
    ],
    goingConcernIndicators: {
      financial: [
        'Net current liability or net liability position',
        'Fixed-term borrowings approaching maturity without realistic prospect of renewal',
        'Negative operating cash flows',
        'Adverse key financial ratios',
        'Substantial operating losses',
        'Arrears or discontinuance of dividends',
        'Inability to pay creditors on due dates',
        'Inability to comply with terms of loan agreements',
        'Change from credit to cash-on-delivery from suppliers',
        'Inability to obtain financing for essential investment'
      ],
      operating: [
        'Management intentions to liquidate or cease trading',
        'Loss of key management without replacement',
        'Loss of a major market, key customer, franchise, licence, or principal supplier',
        'Labour difficulties',
        'Shortages of important supplies',
        'Emergence of a highly successful competitor'
      ],
      other: [
        'Non-compliance with capital or other statutory requirements',
        'Pending legal or regulatory proceedings that may result in claims unlikely to be satisfied',
        'Changes in law or regulation or government policy',
        'Uninsured or underinsured catastrophes'
      ]
    },
    auditPhases: ['planning', 'risk', 'completion'],
    workingPapers: ['B5-GoingConcern', 'E2-GoingConcernConclusion']
  },

  ISA_580: {
    id: 'ISA_580',
    title: 'Written Representations',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Obtain written representations from management (and TCWG if appropriate)',
      'Required representations: management has fulfilled responsibility for preparation of FS, has provided all information and access, all transactions recorded, effect of uncorrected misstatements is immaterial',
      'Additional representations as deemed necessary (related parties, litigation, subsequent events, fraud)',
      'Date of letter: as near as practicable to (but not after) date of audit report',
      'Addressed to auditor from management with appropriate level of authority',
      'If management does not provide requested representations: discuss, re-evaluate integrity, consider impact on opinion (qualified or disclaimer)',
      'Reliability: representations do not substitute for other audit evidence',
      'Representations contradicted by other evidence: investigate, reconsider reliability of all representations'
    ],
    auditPhases: ['completion'],
    workingPapers: ['E4-WrittenRepresentations']
  }
};

// ============================================================================
// ISA 600-699: USING WORK OF OTHERS
// ============================================================================
export const ISA_USING_OTHERS = {
  ISA_600: {
    id: 'ISA_600',
    title: 'Special Considerations — Audits of Group Financial Statements (Including the Work of Component Auditors)',
    subtitle: '(ISA 600 Revised — effective December 2024)',
    effectiveDate: '2024-12-15',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Group engagement partner responsible for direction, supervision, and review',
      'Understand group structure, components, and consolidation process',
      'Identify significant components: financial significance or significant risks',
      'Determine type of work for each component: full audit, specific procedures, analytical',
      'Evaluate competence and independence of component auditors',
      'Communication with component auditors: instructions, access requirements, reporting requirements',
      'Review component auditor work: significant risks, significant findings, conclusions',
      'Consolidation process: test consolidation adjustments, eliminations, reclassifications',
      'Evaluate sufficiency of evidence at group level',
      'Communication with group TCWG',
      'ISA 600 Revised (2024): enhanced requirements for risk-based approach, scalability, use of centralised activities'
    ],
    auditPhases: ['planning', 'risk', 'final', 'completion'],
    workingPapers: ['A1-GroupAudit']
  },

  ISA_610: {
    id: 'ISA_610',
    title: 'Using the Work of Internal Auditors',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Evaluate: objectivity, technical competence, due professional care, effective communication',
      'Determine whether internal audit work can be used: area of work, methodology, findings',
      'External auditor must perform sufficient procedures to be satisfied with work used',
      'Cannot use internal auditors to perform audit procedures on significant risks, significant judgments, or matters requiring significant auditor judgment',
      'UK: additional restriction — internal audit function must not be provided by the audit firm for PIEs',
      'Document: areas where internal audit work used, evaluation of adequacy'
    ],
    auditPhases: ['planning', 'interim'],
    workingPapers: ['B2-InternalAudit']
  },

  ISA_620: {
    id: 'ISA_620',
    title: 'Using the Work of an Auditor\'s Expert',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Determine need for expert: specialized knowledge in field other than accounting or auditing',
      'Evaluate: competence, capabilities, objectivity',
      'Agree: nature/scope/objectives, roles/responsibilities, communication, confidentiality',
      'Evaluate adequacy of expert\'s work: reasonableness of findings, consistency with other evidence, reasonableness of assumptions and methods',
      'If work inadequate: agree additional work, or perform additional audit procedures',
      'Common areas: property valuations, actuarial calculations, environmental liabilities, legal opinions, IT specialists',
      'Document: nature of work, scope, evaluation of adequacy, expert\'s findings and conclusions'
    ],
    auditPhases: ['planning', 'final'],
    workingPapers: ['D-ExpertWork']
  }
};

// ============================================================================
// ISA 700-810: AUDIT CONCLUSIONS AND REPORTING
// ============================================================================
export const ISA_REPORTING = {
  ISA_700: {
    id: 'ISA_700',
    title: 'Forming an Opinion and Reporting on Financial Statements',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Unmodified opinion: FS prepared in all material respects in accordance with applicable framework',
      'True and fair view (UK) / present fairly in all material respects',
      'Evaluate: sufficient appropriate evidence, uncorrected misstatements material?, FS presentation and disclosure, FS comply with framework',
      'Report elements: title, addressee, opinion section, basis for opinion, going concern (UK), KAM (if applicable), other information, responsibilities of management, responsibilities of auditor, auditor signature, date, address',
      'UK Companies Act: additional opinions on strategic/directors report consistency, proper books of account, FS agree with books, information and explanations obtained',
      'Date of report: date auditor has obtained sufficient evidence (not before FS approved)'
    ],
    auditPhases: ['reporting'],
    workingPapers: ['F2-AuditReport']
  },

  ISA_701: {
    id: 'ISA_701',
    title: 'Communicating Key Audit Matters in the Independent Auditor\'s Report',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Mandatory for listed entities (voluntary for others)',
      'KAMs: matters of most significance in the audit of the current period FS',
      'Determined from matters communicated to TCWG',
      'Consider: areas of higher assessed risk or significant risks, significant auditor judgments on areas of management judgment, effect of significant events/transactions',
      'For each KAM: describe why matter was considered KAM and how it was addressed in the audit',
      'Do not include KAM if: required to modify opinion on the matter, or going concern material uncertainty',
      'UK PIE: must include KAMs',
      'Document: process for identifying KAMs, rationale for each KAM'
    ],
    auditPhases: ['reporting'],
    workingPapers: ['F2-KAMs']
  },

  ISA_705: {
    id: 'ISA_705',
    title: 'Modifications to the Opinion in the Independent Auditor\'s Report',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Three types of modified opinion:',
      'Qualified opinion: material but not pervasive misstatement OR inability to obtain sufficient evidence',
      'Adverse opinion: material AND pervasive misstatement (FS do not give true and fair view)',
      'Disclaimer of opinion: unable to obtain sufficient evidence AND possible effects could be material and pervasive',
      'Pervasive: effects that are not confined to specific elements, represent a substantial proportion of FS, or are fundamental to users understanding',
      'Basis for Qualified/Adverse/Disclaimer Opinion section: describe matter giving rise to modification',
      'If material misstatement: describe and quantify financial effects (or state cannot be determined)',
      'If inability to obtain evidence: describe circumstances'
    ],
    auditPhases: ['reporting'],
    workingPapers: ['F2-AuditReport']
  },

  ISA_706: {
    id: 'ISA_706',
    title: 'Emphasis of Matter Paragraphs and Other Matter Paragraphs in the Independent Auditor\'s Report',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Emphasis of Matter (EOM): matter appropriately presented/disclosed but of such importance that it is fundamental to users understanding (e.g., material uncertainty other than going concern, major subsequent event, early adoption of standard)',
      'EOM does not modify the opinion',
      'Other Matter: matter relevant to users understanding of the audit, auditor responsibilities, or audit report (e.g., predecessor auditor, restriction on distribution)',
      'Placement: after Basis for Opinion (or after Material Uncertainty GC section)',
      'Must not be used as substitute for: modified opinion, going concern material uncertainty, or KAM communication'
    ],
    auditPhases: ['reporting'],
    workingPapers: ['F2-AuditReport']
  },

  ISA_710: {
    id: 'ISA_710',
    title: 'Comparative Information — Corresponding Figures and Comparative Financial Statements',
    effectiveDate: '2016-06-17',
    keyRequirements: [
      'Corresponding figures: prior period included as part of current period FS (most common in UK)',
      'Comparative FS: prior period FS presented alongside current period (rare in UK)',
      'Evaluate: prior period FS consistent with current year, accounting policies consistently applied or properly restated',
      'Modified opinion on prior period: may need to modify current year if matter still relevant',
      'New auditor: prior period audited by predecessor — include Other Matter paragraph referencing predecessor report'
    ],
    auditPhases: ['final', 'completion', 'reporting'],
    workingPapers: ['E1-Comparatives']
  },

  ISA_720: {
    id: 'ISA_720',
    title: 'The Auditor\'s Responsibilities Relating to Other Information',
    effectiveDate: '2016-06-17',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Other information: financial and non-financial information in annual report other than FS and audit report',
      'Examples: directors report, strategic report, chairman statement, corporate governance statement, financial highlights',
      'Read other information: identify material inconsistencies with FS or auditor knowledge',
      'Material inconsistency: if FS correct, other information may need correction (communicate to management/TCWG)',
      'Material misstatement of fact: apparent material misstatement in other information not related to FS',
      'UK Companies Act: auditor must report on consistency of directors/strategic report with FS',
      'Report in audit report: statement that auditor has read other information, describe responsibilities, state whether identified material inconsistencies',
      'Document: procedures performed, conclusions reached'
    ],
    auditPhases: ['completion', 'reporting'],
    workingPapers: ['E6-OtherInformation']
  },

  ISA_800: {
    id: 'ISA_800',
    title: 'Special Considerations — Audits of Financial Statements Prepared in Accordance with Special Purpose Frameworks',
    effectiveDate: '2016-06-17',
    keyRequirements: [
      'Special purpose framework: designed to meet financial information needs of specific users',
      'Examples: tax basis, regulatory basis, contractual basis, cash basis',
      'Acceptance: determine whether framework is acceptable for purpose',
      'Opinion: reference to purpose and intended users',
      'Alert paragraph: FS may not be suitable for another purpose'
    ],
    auditPhases: ['planning', 'reporting'],
    workingPapers: ['F2-AuditReport']
  },

  ISA_805: {
    id: 'ISA_805',
    title: 'Special Considerations — Audits of Single Financial Statements and Specific Elements, Accounts or Items of a Financial Statement',
    effectiveDate: '2016-06-17',
    keyRequirements: [
      'May audit single statement or specific element independently',
      'Considerations: acceptability of framework, materiality for the specific element, effect of interrelationships',
      'Opinion on complete set AND specific element: if modified on complete set, consider impact on element opinion',
      'Materiality: determined by reference to the specific element (not FS as a whole)'
    ],
    auditPhases: ['planning', 'reporting'],
    workingPapers: ['F2-AuditReport']
  },

  ISA_810: {
    id: 'ISA_810',
    title: 'Engagements to Report on Summary Financial Statements',
    effectiveDate: '2016-06-17',
    keyRequirements: [
      'Summary FS derived from audited FS',
      'Opinion: whether summary FS consistent in all material respects with audited FS',
      'Must have audited the FS from which summary derived',
      'Evaluate: criteria applied, whether summary FS adequately discloses summarised nature',
      'If audit opinion modified: consider effect on summary FS opinion'
    ],
    auditPhases: ['reporting'],
    workingPapers: ['F2-SummaryReport']
  }
};

// ============================================================================
// ISRE 2410 — REVIEW ENGAGEMENTS (UK)
// ============================================================================
export const ISRE_2410 = {
  id: 'ISRE_2410',
  title: 'Review of Interim Financial Information Performed by the Independent Auditor of the Entity',
  effectiveDate: '2007-01-01',
  lastAmended: '2024-01-01',
  objective: 'Obtain limited assurance that interim financial information is prepared in accordance with applicable framework',
  keyRequirements: [
    'Limited assurance (negative assurance): "nothing has come to our attention..."',
    'Primarily inquiry and analytical procedures (not detailed testing)',
    'Inquire of management: significant events, changes in accounting policies, related party transactions, going concern',
    'Analytical procedures: compare interim to prior period, to expectations, review unusual items',
    'Read minutes, review subsequent events, review compliance with framework',
    'If matter comes to attention: perform additional procedures',
    'Report: negative assurance conclusion',
    'Required for listed entities publishing half-yearly financial reports'
  ],
  auditPhases: ['interim'],
  workingPapers: ['Interim Review File']
};

// ============================================================================
// COMPLETE ISA INDEX
// ============================================================================
export const ISA_STANDARDS_INDEX = {
  // Quality Management
  ...Object.fromEntries(Object.entries(QUALITY_MANAGEMENT).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'Quality Management' }])),
  // General Principles
  ...Object.fromEntries(Object.entries(ISA_GENERAL_PRINCIPLES).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'General Principles (200-299)' }])),
  // Risk Assessment
  ...Object.fromEntries(Object.entries(ISA_RISK_ASSESSMENT).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'Risk Assessment (300-499)' }])),
  // Audit Evidence
  ...Object.fromEntries(Object.entries(ISA_AUDIT_EVIDENCE).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'Audit Evidence (500-599)' }])),
  // Using Others
  ...Object.fromEntries(Object.entries(ISA_USING_OTHERS).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'Using Others (600-699)' }])),
  // Reporting
  ...Object.fromEntries(Object.entries(ISA_REPORTING).map(([k, v]) => [k, { id: v.id, title: v.title, category: 'Reporting (700-810)' }])),
  // Review
  ISRE_2410: { id: 'ISRE_2410', title: ISRE_2410.title, category: 'Review Engagements' }
};

/**
 * Lookup any ISA standard by number (e.g., 315, 'ISA_315', 'ISA 315')
 */
export function lookupISA(isaNumber) {
  const num = String(isaNumber).replace(/[^0-9]/g, '');
  const key = `ISA_${num}`;
  const allStandards = { ...QUALITY_MANAGEMENT, ...ISA_GENERAL_PRINCIPLES, ...ISA_RISK_ASSESSMENT, ...ISA_AUDIT_EVIDENCE, ...ISA_USING_OTHERS, ...ISA_REPORTING };
  return allStandards[key] || null;
}

/**
 * Get all ISAs relevant to a specific audit phase
 */
export function getISAsByPhase(phase) {
  const allStandards = { ...QUALITY_MANAGEMENT, ...ISA_GENERAL_PRINCIPLES, ...ISA_RISK_ASSESSMENT, ...ISA_AUDIT_EVIDENCE, ...ISA_USING_OTHERS, ...ISA_REPORTING };
  return Object.entries(allStandards)
    .filter(([, std]) => std.auditPhases?.includes(phase) || std.auditPhases?.includes('all'))
    .map(([key, std]) => ({ id: key, title: std.title, phase }));
}

/**
 * Search ISA standards by keyword
 */
export function searchISAs(keyword) {
  const lower = keyword.toLowerCase();
  const allStandards = { ...QUALITY_MANAGEMENT, ...ISA_GENERAL_PRINCIPLES, ...ISA_RISK_ASSESSMENT, ...ISA_AUDIT_EVIDENCE, ...ISA_USING_OTHERS, ...ISA_REPORTING };
  return Object.entries(allStandards)
    .filter(([, std]) =>
      std.title?.toLowerCase().includes(lower) ||
      std.objective?.toLowerCase().includes(lower) ||
      std.keyRequirements?.some(r => r.toLowerCase().includes(lower))
    )
    .map(([key, std]) => ({ id: key, ...std }));
}
