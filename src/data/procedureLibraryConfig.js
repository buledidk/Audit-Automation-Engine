/**
 * PROCEDURE LIBRARY CONFIGURATION
 * Complete system configuration, mappings, and integration settings
 */

// ============================================================================
// 1. PROCEDURE LIBRARY METADATA
// ============================================================================
export const LIBRARY_METADATA = {
  version: '1.0.0',
  lastUpdated: '2026-03-13',
  author: 'Audit Automation Engine',
  totalProcedures: 200,
  totalAssertions: 7,
  supportedIndustries: 8,
  compliance: {
    standards: ['ISA', 'FRS 102', 'Companies Act 2006', 'FRC Ethical Standards'],
    jurisdictions: ['UK', 'International (ISA-based)'],
    auditFramework: 'FSLI (Full Scope Audit Framework)'
  }
};

// ============================================================================
// 2. AUDIT AREA CONFIGURATION
// ============================================================================
export const AUDIT_AREA_CONFIG = {
  D3: {
    code: 'D3',
    name: 'Revenue & Receivables',
    materialityBenchmark: 'Revenue 2% or PBT 5%',
    typicalRisk: 'HIGH',
    keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'CUTOFF', 'VALUATION'],
    frsReferences: ['FRS 15 - Revenue', 'FRS 102 s11 - Basic Financial Statements'],
    isaReferences: ['ISA 500', 'ISA 505', 'ISA 540', 'ISA 240 (Fraud)'],
    procedures: 30,
    estimatedHours: 40,
    estimatedCost: '$5,000-8,000',
    typicalSampleSize: '35-50%',
    riskAreas: [
      'Fraudulent revenue recognition',
      'Channel stuffing',
      'Side agreements reducing effective price',
      'Revenue before delivery',
      'Period cutoff errors',
      'Uncollectible AR understatement'
    ]
  },
  D4: {
    code: 'D4',
    name: 'Inventory',
    materialityBenchmark: 'Gross Profit 5-10% or COGS 2%',
    typicalRisk: 'MEDIUM-HIGH',
    keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'VALUATION'],
    frsReferences: ['FRS 102 s13 - Inventories'],
    isaReferences: ['ISA 500', 'ISA 501', 'ISA 540'],
    procedures: 25,
    estimatedHours: 35,
    estimatedCost: '$4,000-6,000',
    typicalSampleSize: '40-60%',
    riskAreas: [
      'Count accuracy errors',
      'Inventory overstatement',
      'Obsolescence provision understatement',
      'NRV testing inadequate',
      'Cost build-up error',
      'WIP classification error'
    ]
  },
  D5: {
    code: 'D5',
    name: 'Fixed Assets',
    materialityBenchmark: 'Assets 2-3% or Total Assets 1%',
    typicalRisk: 'MEDIUM',
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'VALUATION', 'COMPLETENESS', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s16 - PP&E', 'FRS 102 s18 - Intangibles', 'FRS 102 s20 - Leases'],
    isaReferences: ['ISA 500', 'ISA 540'],
    procedures: 28,
    estimatedHours: 32,
    estimatedCost: '$3,500-5,000',
    typicalSampleSize: '30-50%',
    riskAreas: [
      'Capitalization vs expense misclassification',
      'Depreciation calculation error',
      'Useful life change not disclosed',
      'Impairment not recognized',
      'Disposal P&L impact error',
      'Lease classification error'
    ]
  },
  D6: {
    code: 'D6',
    name: 'Payables & Accruals',
    materialityBenchmark: 'Liabilities 2-3% or COGS 1%',
    typicalRisk: 'MEDIUM',
    keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'CUTOFF'],
    frsReferences: ['FRS 102 s11 - Liabilities', 'FRS 102 s2 - Accruals & Cutoff'],
    isaReferences: ['ISA 500', 'ISA 505'],
    procedures: 20,
    estimatedHours: 24,
    estimatedCost: '$2,500-3,500',
    typicalSampleSize: '30-40%',
    riskAreas: [
      'Unrecorded payables',
      'Accrual amount incorrect',
      'Period cutoff error',
      'GRNI accruals incomplete',
      'Liabilities understated'
    ]
  },
  D7: {
    code: 'D7',
    name: 'Loans & Covenants',
    materialityBenchmark: 'Liabilities 2% or Interest Expense 5%',
    typicalRisk: 'MEDIUM-HIGH',
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS', 'VALUATION'],
    frsReferences: ['FRS 102 s11 - Borrowings', 'FRS 102 s1A.10 - Debt Disclosure'],
    isaReferences: ['ISA 500', 'ISA 505', 'ISA 570 (Going Concern)'],
    procedures: 18,
    estimatedHours: 20,
    estimatedCost: '$2,000-3,000',
    typicalSampleSize: '100% (confirmations)',
    riskAreas: [
      'Loan covenant breach',
      'Interest calculation error',
      'Unrecorded loan facility',
      'Going concern implications',
      'Covenant non-disclosure'
    ]
  },
  D8: {
    code: 'D8',
    name: 'Tax',
    materialityBenchmark: 'PBT 5% or Tax Expense 10%',
    typicalRisk: 'MEDIUM',
    keyAssertions: ['ACCURACY', 'COMPLETENESS', 'VALUATION'],
    frsReferences: ['FRS 102 s29 - Income Tax'],
    isaReferences: ['ISA 500', 'ISA 540'],
    procedures: 22,
    estimatedHours: 28,
    estimatedCost: '$2,500-4,000',
    typicalSampleSize: '100% (estimation)',
    riskAreas: [
      'Tax computation error',
      'Non-deductible item allowed',
      'Deferred tax asset overvalued',
      'Capital allowance error',
      'Uncertain tax position'
    ]
  },
  D9: {
    code: 'D9',
    name: 'Provisions',
    materialityBenchmark: 'Liabilities 2% or Net Income 5%',
    typicalRisk: 'HIGH',
    keyAssertions: ['VALUATION', 'COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s21 - Provisions & Contingencies'],
    isaReferences: ['ISA 500', 'ISA 540', 'ISA 580 (Legal Letters)'],
    procedures: 20,
    estimatedHours: 25,
    estimatedCost: '$2,500-3,500',
    typicalSampleSize: '100% (estimation)',
    riskAreas: [
      'Provision understatement',
      'Provision timing (when to recognize)',
      'Legal liability not provided',
      'Obsolescence not assessed',
      'Contingent liability not disclosed'
    ]
  },
  D10: {
    code: 'D10',
    name: 'Equity',
    materialityBenchmark: 'Equity 2-3% or Net Income 5%',
    typicalRisk: 'LOW-MEDIUM',
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s4 - Financial Position (Equity)', 'Companies Act s830'],
    isaReferences: ['ISA 500'],
    procedures: 15,
    estimatedHours: 16,
    estimatedCost: '$1,500-2,000',
    typicalSampleSize: '100% (authorization)',
    riskAreas: [
      'Unauthorized share issue',
      'Dividend exceeding distributable reserves',
      'Share premium miscalculation',
      'Reserve misclassification'
    ]
  },
  D11: {
    code: 'D11',
    name: 'Cash & Bank',
    materialityBenchmark: 'Assets 1-2% or Cash 100%',
    typicalRisk: 'LOW-MEDIUM',
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    frsReferences: ['FRS 102 s11 - Cash'],
    isaReferences: ['ISA 500', 'ISA 505'],
    procedures: 12,
    estimatedHours: 12,
    estimatedCost: '$1,000-1,500',
    typicalSampleSize: '100% (confirmations)',
    riskAreas: [
      'Unrecorded bank account',
      'Bank reconciliation stale items',
      'Cash overstatement',
      'Restricted cash disclosure'
    ]
  },
  D12: {
    code: 'D12',
    name: 'Journal Entries',
    materialityBenchmark: 'N/A (Process control)',
    typicalRisk: 'MEDIUM-HIGH (Fraud)',
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s2 - Measurement & Presentation'],
    isaReferences: ['ISA 240 (Fraud)', 'ISA 330 (Management Override)'],
    procedures: 18,
    estimatedHours: 16,
    estimatedCost: '$1,500-2,000',
    typicalSampleSize: '50-75% (unusual JEs)',
    riskAreas: [
      'Fraudulent JE',
      'Management override',
      'Unauthorized adjustment',
      'Manual JE without support',
      'Post-close manipulation'
    ]
  },
  D13: {
    code: 'D13',
    name: 'Subsequent Events',
    materialityBenchmark: 'Material events only',
    typicalRisk: 'MEDIUM (Disclosure)',
    keyAssertions: ['COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s32 - Events After Reporting Period (IAS 10)'],
    isaReferences: ['ISA 560', 'ISA 570 (Going Concern)'],
    procedures: 12,
    estimatedHours: 10,
    estimatedCost: '$1,000-1,500',
    typicalSampleSize: '100% (all events)',
    riskAreas: [
      'Adjusting event not recorded',
      'Non-adjusting event not disclosed',
      'Going concern event missed',
      'Litigation development post-period'
    ]
  },
  D14: {
    code: 'D14',
    name: 'Related Parties',
    materialityBenchmark: 'Variable by transaction (100% identification)',
    typicalRisk: 'HIGH',
    keyAssertions: ['COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    frsReferences: ['FRS 102 s33 - Related Party Disclosure'],
    isaReferences: ['ISA 550'],
    procedures: 16,
    estimatedHours: 18,
    estimatedCost: '$1,500-2,000',
    typicalSampleSize: '50-80% (arm\'s length)',
    riskAreas: [
      'Related party omitted',
      'RP transaction not disclosed',
      'Non-arm\'s length terms',
      'Unauthorized RP transaction'
    ]
  }
};

// ============================================================================
// 3. SAMPLING METHODOLOGY STANDARDS
// ============================================================================
export const SAMPLING_STANDARDS = {
  selectionMethods: {
    RANDOM: {
      name: 'Random Sampling',
      description: 'Every item has equal chance of selection',
      application: 'General purpose; low bias',
      example: 'Use random number generator to select invoices'
    },
    SYSTEMATIC: {
      name: 'Systematic Sampling',
      description: 'Select every nth item from population',
      application: 'When population is ordered; efficient',
      example: 'Select every 10th GRN from sequential list'
    },
    STRATIFIED: {
      name: 'Stratified Random',
      description: 'Divide into strata; random sample from each',
      application: 'Populations with variation; maximizes precision',
      example: 'Revenue by amount: <£10k (10%), £10-50k (50%), >£50k (100%)'
    },
    INTERVAL: {
      name: 'Interval Sampling',
      description: 'Select items at fixed intervals (e.g., every £1000)',
      application: 'Monetary audit sampling; matches audit objective',
      example: 'Select items totaling £1,000 cumulative'
    },
    BLOCK: {
      name: 'Block Sampling',
      description: 'Select contiguous blocks of items',
      application: 'Controls testing; less preferred for substantive',
      application_note: 'Higher bias risk',
      example: 'All transactions from Jan 1-15'
    }
  },

  evaluationApproach: {
    ATTRIBUTE: {
      name: 'Attribute Sampling',
      purpose: 'Evaluate design/operating effectiveness of controls',
      measure: 'Did control operate as designed?',
      conclusion: 'Percentage control effectiveness rate',
      example: 'In sample of 50 POs, were 48 approved? (96% effectiveness)'
    },
    VARIABLES: {
      name: 'Variables (Monetary) Sampling',
      purpose: 'Estimate monetary amount of misstatement',
      measure: 'What is the amount impact?',
      conclusion: 'Projected misstatement amount',
      example: 'Sample of 30 invoices shows £500 total error; project to population'
    },
    COMBINATIONS: {
      name: 'Combined Approach',
      purpose: 'Evaluate both control and monetary impact',
      measure: 'Both % and £ impact',
      conclusion: 'Control is X% effective; projected error is £Y',
      example: 'PO controls work 90%; estimated overstatement £10k'
    }
  },

  riskBasedSizing: {
    HIGH_RISK: {
      range: '50-75%',
      rationale: 'Significant risk; weak controls; judgment required',
      minItems: 50,
      approach: 'Near 100% for key items; stratified for remainder'
    },
    MEDIUM_RISK: {
      range: '30-50%',
      rationale: 'Moderate risk; reasonable controls; standard judgment',
      minItems: 25,
      approach: 'Stratified sample; major items emphasized'
    },
    LOW_RISK: {
      range: '10-30%',
      rationale: 'Low risk; strong controls; routine',
      minItems: 10,
      approach: 'Random or systematic; limited sample adequate'
    }
  },

  exceptionEvaluation: {
    zeroExceptions: {
      message: 'No exceptions found',
      implication: 'Area supports assertion; accept without qualification',
      action: 'Accept; document conclusion'
    },
    oneException: {
      message: 'Single exception found',
      implication: 'Isolated or indicative of systematic issue?',
      action: 'Investigate cause; expand sample if systematic; document'
    },
    twoExceptions: {
      message: '2 exceptions found',
      implication: 'Likely isolated but warrants investigation',
      action: 'Investigate for pattern; if isolated accept with notation'
    },
    threeOrMoreExceptions: {
      message: '3+ exceptions found',
      implication: 'Suggests possible systematic misstatement',
      action: 'Reject sample; increase to near 100%; propose adjustment'
    }
  }
};

// ============================================================================
// 4. MATERIALITY STANDARDS
// ============================================================================
export const MATERIALITY_STANDARDS = {
  benchmarks: {
    PROFIT_BEFORE_TAX: {
      percentage: 5,
      application: 'Most common; profit-driven entities',
      rationale: 'Users focus on earnings',
      example: 'PBT of £200k × 5% = Materiality of £10k'
    },
    REVENUE: {
      percentage: 2,
      application: 'Revenue-driven or loss-making entities',
      rationale: 'Size and growth drivers',
      example: 'Revenue of £1m × 2% = Materiality of £20k'
    },
    GROSS_PROFIT: {
      percentage: 5,
      application: 'Manufacturing/retail; margin focus',
      rationale: 'Operational profitability',
      example: 'Gross profit £100k × 5% = Materiality of £5k'
    },
    TOTAL_ASSETS: {
      percentage: 1,
      application: 'Asset-focused (banks, insurers, investment firms)',
      rationale: 'Balance sheet integrity',
      example: 'Assets £500k × 1% = Materiality of £5k'
    },
    EQUITY: {
      percentage: 2,
      application: 'Equity-focused (charities, co-ops)',
      rationale: 'Fund adequacy and sustainability',
      example: 'Equity £250k × 2% = Materiality of £5k'
    },
    EBITDA: {
      percentage: 5,
      application: 'Enterprise value focus',
      rationale: 'Operating cash generation',
      example: 'EBITDA £150k × 5% = Materiality of £7.5k'
    }
  },

  thresholds: {
    OVERALL_MATERIALITY: {
      definition: 'Threshold for planning; below which misstatements aren\'t material',
      setting: 'Select most appropriate benchmark; apply percentage',
      documentation: 'Working paper A3 - Materiality'
    },
    PERFORMANCE_MATERIALITY: {
      definition: 'Threshold for detailed testing (typically 75% of OM)',
      purpose: 'Aggregate of undetected errors shouldn\'t exceed PM',
      rationale: 'Conservative allowance for undetected misstatements'
    },
    TRIVIAL_THRESHOLD: {
      definition: 'Below which misstatements need not be evaluated (typically 5% of OM)',
      purpose: 'Avoids accumulating clearly immaterial items',
      rationale: 'Administrative efficiency'
    }
  },

  qualitativeFactors: {
    PROFITABILITY_TREND: 'Is entity profitable/loss-making? Trend?',
    LEVERAGE_POSITION: 'High/medium/low debt? Covenant pressure?',
    REGULATORY_ENVIRONMENT: 'Regulated industry? Compliance focus?',
    MARKET_POSITION: 'Market leader? Competitive pressure?',
    MANAGEMENT_INCENTIVES: 'Bonus structure? Covenant pressure?',
    LITIGATION_RISK: 'Legal claims? Contingencies?',
    PRIOR_MISSTATEMENTS: 'History of adjustments? Control issues?'
  }
};

// ============================================================================
// 5. AUDIT OPINION FRAMEWORKS
// ============================================================================
export const OPINION_FRAMEWORKS = {
  opinionTypes: {
    UNMODIFIED: {
      type: 'Unmodified Opinion',
      symbol: 'Clean',
      criteria: 'Financial statements are true and fair; ISA compliance; no significant deficiencies',
      auditReport: 'Standard 2-3 page report; standard opinion paragraph',
      example: 'We have audited the financial statements... which give a true and fair view...'
    },
    QUALIFIED: {
      type: 'Qualified Opinion ("except for")',
      symbol: 'Except for',
      criteria: 'Scope limitation or material misstatement affecting one/few assertions',
      auditReport: 'Basis for opinion paragraph explains issue; opinion qualified',
      example: 'We were unable to obtain sufficient evidence for inventories... Except for the possible effect...'
    },
    ADVERSE: {
      type: 'Adverse Opinion',
      symbol: 'Do not present fairly',
      criteria: 'Material misstatement or pervasive non-compliance; financial statements misleading',
      auditReport: 'Extensive explanation; adverse opinion stated clearly',
      example: 'In our opinion, the financial statements do not present fairly...'
    },
    DISCLAIMER: {
      type: 'Disclaimer of Opinion',
      symbol: 'Cannot express opinion',
      criteria: 'Scope limitation is so pervasive that opinion cannot be formed',
      auditReport: 'Basis paragraph explains why; disclaimer stated',
      example: 'We were unable to obtain sufficient evidence for the financial statements as a whole...'
    }
  },

  decisionTree: {
    step1: 'Are there misstatements or scope limitations?',
    step2_if_no: 'Issue UNMODIFIED opinion',
    step2_if_yes: 'Are they material?',
    step3_if_no: 'Issue UNMODIFIED opinion (immaterial)',
    step3_if_yes: 'Are they pervasive (affect overall F/S)?',
    step4_if_no: 'Issue QUALIFIED opinion ("except for")',
    step4_if_yes: 'Type of misstatement?',
    step5_if_factual: 'Issue ADVERSE opinion (F/S misleading)',
    step5_if_judgmental: 'Issue DISCLAIMER (cannot form opinion)',
    conclusion: 'Document decision; ensure KAMs covered; report to audit committee'
  },

  keyAuditMatters: {
    selection: 'Areas of higher assessed risk, significant management judgment, or significant transactions',
    disclosure: 'Communicate how matter was addressed; basis for selection',
    examples: [
      'Revenue recognition (complex performance obligations)',
      'Goodwill impairment (judgment-intensive)',
      'Provision for litigation (uncertain outcome)',
      'Lease accounting (classification judgment)',
      'Fair value measurements (specialist input)',
      'Going concern assessment (future assumption)'
    ]
  }
};

// ============================================================================
// 6. WORKING PAPER REFERENCE STRUCTURE
// ============================================================================
export const WORKING_PAPER_STRUCTURE = {
  section_A: {
    name: 'PLANNING & RISK ASSESSMENT',
    A1: 'Engagement Letter & Acceptance',
    A2: 'Client Risk Assessment',
    A3: 'Materiality Calculation',
    A4: 'Audit Strategy & Plan'
  },
  section_B: {
    name: 'RISK ASSESSMENT & CONTROLS',
    B1: 'Risk Matrix & Risk Identification',
    B2: 'Control Design & Operating Testing',
    B3: 'Accounting Estimates & Judgments',
    B4: 'Fraud Risk Brainstorming',
    B5: 'Going Concern & Related Parties'
  },
  section_D: {
    name: 'SUBSTANTIVE TESTING (by area)',
    D3: 'Revenue & Receivables',
    D4: 'Inventory',
    D5: 'Fixed Assets',
    D6: 'Payables & Accruals',
    D7: 'Loans & Covenants',
    D8: 'Tax',
    D9: 'Provisions & Contingencies',
    D10: 'Equity',
    D11: 'Cash & Banking',
    D12: 'Journal Entries & Consolidation',
    D13: 'Post-Balance Sheet Events',
    D14: 'Related Parties'
  },
  section_E: {
    name: 'COMPLETION & REPORTING',
    E1: 'Completion Procedures & Final Review',
    E2: 'Going Concern Conclusion',
    E3: 'Subsequent Events (Final)',
    E4: 'Management Representations',
    F1: 'Summary of Uncorrected Misstatements',
    F2: 'Audit Report & KAMs',
    F3: 'Governance Letter'
  }
};

// ============================================================================
// 7. AUDIT TEAM ROLES & RESPONSIBILITIES
// ============================================================================
export const TEAM_ROLES = {
  ENGAGEMENT_PARTNER: {
    title: 'Engagement Partner / Audit Director',
    responsibilities: [
      'Overall audit strategy & direction',
      'Risk assessment & materiality',
      'Significant judgments & estimates',
      'Audit team review & quality control',
      'Client relationship & communication',
      'Final review before report issuance',
      'Audit opinion formulation',
      'Engagement quality review sign-off'
    ],
    procedures: 'D7-D14 (complex areas)',
    review: 'All significant areas'
  },

  MANAGER: {
    title: 'Audit Manager / Senior Manager',
    responsibilities: [
      'Day-to-day audit management',
      'Procedure execution oversight',
      'Sample selection & testing',
      'Exception evaluation & documentation',
      'Team coordination',
      'Working paper review',
      'Client liaison',
      'Budget management'
    ],
    procedures: 'D3-D6 (major areas)',
    review: 'All detailed testing'
  },

  SENIOR_ACCOUNTANT: {
    title: 'Senior Accountant',
    responsibilities: [
      'Procedure execution',
      'Sample selection',
      'Detail testing & recalculation',
      'Evidence collection',
      'Working paper preparation',
      'Exception documentation',
      'Junior staff supervision'
    ],
    procedures: 'D3-D14 (assigned areas)',
    review: 'Immediate supervisor'
  },

  ACCOUNTANT: {
    title: 'Accountant / Junior Auditor',
    responsibilities: [
      'Procedure execution (routine)',
      'Tracing & recalculation',
      'Data gathering',
      'Observation & testing',
      'Documentation',
      'Support to seniors'
    ],
    procedures: 'D3-D14 (assigned areas)',
    review: 'Senior Accountant'
  },

  SPECIALIST: {
    title: 'Audit Specialist (Valuations, Tax, IT, Legal)',
    responsibilities: [
      'Specialized area testing',
      'Technical guidance',
      'Specialist opinion/reporting',
      'Complex estimate assessment'
    ],
    procedures: 'D5, D8, D9 (specialist areas)',
    review: 'Manager/Partner'
  }
};

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================
export default {
  LIBRARY_METADATA,
  AUDIT_AREA_CONFIG,
  SAMPLING_STANDARDS,
  MATERIALITY_STANDARDS,
  OPINION_FRAMEWORKS,
  WORKING_PAPER_STRUCTURE,
  TEAM_ROLES
};
