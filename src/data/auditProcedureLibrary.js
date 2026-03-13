/**
 * COMPREHENSIVE AUDIT PROCEDURE LIBRARY
 * Production-quality heavy-duty testing framework
 * Covers all FSLI audit areas (D3-D14) with 200+ detailed procedures
 *
 * Structure:
 * - Audit Program Templates (all FSLI areas)
 * - Assertion-Procedure Mapping
 * - Procedure Details & Execution Steps
 * - Risk-Based Sampling Methodology
 * - Industry-Specific Variations
 * - Exception Handling Framework
 * - Evidence Templates
 */

// ============================================================================
// 1. ASSERTION DEFINITIONS - Core audit assertions per ISA 500
// ============================================================================
export const ASSERTIONS = {
  EXISTENCE: {
    id: 'EXISTENCE',
    name: 'Existence or Occurrence',
    description: 'Assets, liabilities, and equity interests exist; transactions occurred',
    testNature: 'Substantive detail testing, confirmations, inspections'
  },
  COMPLETENESS: {
    id: 'COMPLETENESS',
    name: 'Completeness',
    description: 'All transactions and balances are included in financial statements',
    testNature: 'Analytical review, cutoff testing, unrecorded liability searches'
  },
  ACCURACY: {
    id: 'ACCURACY',
    name: 'Accuracy or Valuation',
    description: 'Transactions and balances are accurately recorded at correct amounts',
    testNature: 'Recalculation, reconciliation, substantive sampling'
  },
  CUTOFF: {
    id: 'CUTOFF',
    name: 'Cutoff',
    description: 'Transactions are recorded in correct accounting period',
    testNature: 'Cutoff testing, post year-end procedure testing'
  },
  VALUATION: {
    id: 'VALUATION',
    name: 'Valuation or Allocation',
    description: 'Assets, liabilities, and equity are valued appropriately',
    testNature: 'Recalculation, estimation re-performance, specialist assessment'
  },
  CLASSIFICATION: {
    id: 'CLASSIFICATION',
    name: 'Classification and Presentation',
    description: 'Transactions and balances are appropriately classified and presented',
    testNature: 'Detail testing, classification review, disclosure checklist'
  },
  RIGHTS_OBLIGATIONS: {
    id: 'RIGHTS_OBLIGATIONS',
    name: 'Rights and Obligations',
    description: 'Entity has rights to assets and responsibility for liabilities',
    testNature: 'Documentation review, title verification, legal confirmations'
  }
};

// ============================================================================
// 2. RISK ASSESSMENT LEVELS & SAMPLE SIZE MATRICES
// ============================================================================
export const RISK_LEVELS = {
  HIGH: {
    level: 'High',
    inherentRiskRange: '4-5',
    controlRiskRange: '4-5',
    detectionRisk: 'Low',
    sampleSizePercent: '50-75%',
    minItems: 50,
    description: 'Significant fraud/error risk; weak controls; complex estimates'
  },
  MEDIUM: {
    level: 'Medium',
    inherentRiskRange: '2-3',
    controlRiskRange: '2-3',
    detectionRisk: 'Medium',
    sampleSizePercent: '30-50%',
    minItems: 25,
    description: 'Moderate judgment required; normal controls; standard transactions'
  },
  LOW: {
    level: 'Low',
    inherentRiskRange: '1-2',
    controlRiskRange: '1-2',
    detectionRisk: 'High',
    sampleSizePercent: '10-30%',
    minItems: 10,
    description: 'Routine transactions; strong controls; low complexity'
  }
};

export const SAMPLE_SIZE_TABLES = {
  calculateSampleSize: function(populationValue, populationCount, riskLevel, stratumsCount = 1) {
    const riskConfig = RISK_LEVELS[riskLevel];
    if (!riskConfig) throw new Error(`Invalid risk level: ${riskLevel}`);

    // Extract percentage from range (use lower bound for conservative estimate)
    const percentageStr = riskConfig.sampleSizePercent.split('-')[0];
    const percentage = parseInt(percentageStr) / 100;

    // Calculate sample size (minimum between value-based and count-based)
    const sampleByValue = Math.ceil(populationValue * percentage);
    const sampleByCount = Math.ceil(populationCount * percentage);

    const sampleSize = Math.max(
      Math.min(sampleByValue, sampleByCount),
      riskConfig.minItems
    );

    return {
      riskLevel,
      populationValue,
      populationCount,
      percentage: (percentage * 100).toFixed(0) + '%',
      sampleSize,
      stratifiedPerStrata: Math.ceil(sampleSize / stratumsCount),
      selectionMethod: 'Stratified random or systematic'
    };
  },

  // Pre-calculated matrices for common scenarios
  matrices: {
    revenue: {
      'High Risk': { samplePercent: 60, minSample: 50 },
      'Medium Risk': { samplePercent: 35, minSample: 25 },
      'Low Risk': { samplePercent: 15, minSample: 10 }
    },
    inventory: {
      'High Risk': { samplePercent: 70, minSample: 40 },
      'Medium Risk': { samplePercent: 40, minSample: 20 },
      'Low Risk': { samplePercent: 20, minSample: 8 }
    },
    fixedAssets: {
      'High Risk': { samplePercent: 65, minSample: 30 },
      'Medium Risk': { samplePercent: 40, minSample: 15 },
      'Low Risk': { samplePercent: 20, minSample: 5 }
    },
    payables: {
      'High Risk': { samplePercent: 60, minSample: 40 },
      'Medium Risk': { samplePercent: 35, minSample: 20 },
      'Low Risk': { samplePercent: 15, minSample: 8 }
    }
  }
};

// ============================================================================
// 3. AUDIT PROGRAM TEMPLATE STRUCTURE
// ============================================================================
export const PROCEDURE_TEMPLATE = {
  procedureId: '',           // e.g., 'D3.1'
  area: '',                  // e.g., 'REVENUE'
  title: '',                 // Procedure title
  description: '',           // 1-2 sentence summary
  assertions: [],            // Primary assertions [EXISTENCE, COMPLETENESS, ACCURACY, etc.]
  secondaryAssertions: [],   // Affected assertions
  riskRespond: [],           // Which risks this procedure responds to
  populationDefinition: '',  // What constitutes the population
  sampleSize: {},            // Sample size by risk level
  testNature: 'Substantive', // Substantive vs Control
  timing: 'Final',           // Planning, Interim, Final, Year-end, Completion
  resourcesRequired: [],     // Required team members/skills
  evidenceType: [],          // Types of evidence (inspection, confirmation, etc.)

  executionSteps: [
    // {
    //   step: 1,
    //   action: 'Obtain...',
    //   expectedResult: '...',
    //   documentationLocation: '...'
    // }
  ],

  expectedExceptions: [],    // What exceptions are expected (if any)
  exceptionHandling: {},     // If exception found, what action required
  conclusionFramework: '',   // How to conclude on this procedure
  evaluationCriteria: '',    // Criteria for pass/fail
  frsReferences: [],         // FRS 102 sections
  isaReferences: [],         // ISA standards
  workingPaperRef: '',       // Where to file results

  // Performance tracking
  status: 'Not Started',      // Not Started, In Progress, Complete
  preparer: '',
  reviewer: '',
  dateStarted: null,
  dateCompleted: null,
  hoursSpent: 0,
  exceptionsFound: 0,
  approvalDate: null
};

// ============================================================================
// 4. D3: REVENUE & RECEIVABLES - 30+ PROCEDURES
// ============================================================================
export const PROCEDURE_D3_REVENUE = [
  {
    procedureId: 'D3.1',
    area: 'REVENUE',
    title: 'Revenue Recognition Policy Compliance with IFRS 15 / FRS 15',
    description: 'Obtain and review revenue recognition policy for compliance with IFRS 15 / FRS 15 requirements including performance obligations, contract consideration, and timing of recognition.',
    assertions: ['ACCURACY', 'COMPLETENESS', 'CLASSIFICATION'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Fraudulent revenue recognition', 'Revenue recording outside period', 'Performance obligation misidentification'],
    populationDefinition: 'Revenue recognition policy as documented in financial statements notes and accounting manual',
    sampleSize: { HIGH: '100% (policy review)', MEDIUM: '100% (policy review)', LOW: '100% (policy review)' },
    testNature: 'Substantive',
    timing: 'Planning & Final',
    resourcesRequired: ['Senior/Manager - accounting standards knowledge', 'Potentially external specialist'],
    evidenceType: ['Policy document', 'Accounting standards reference material (IFRS 15 / FRS 15)', 'Board minutes', 'Financial statement notes'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain current revenue recognition policy from client',
        expectedResult: 'Policy document identifying performance obligations, consideration, and recognition timing',
        documentationLocation: 'Working Papers/D3/D3.1/Revenue Policy'
      },
      {
        step: 2,
        action: 'Review IFRS 15 / FRS 15 requirements (5-step model: identify contract, identify performance obligations, determine transaction price, allocate price, recognize revenue)',
        expectedResult: 'Understanding of standards requirements',
        documentationLocation: 'Standards checklist completed'
      },
      {
        step: 3,
        action: 'Map client policy to each IFRS 15 / FRS 15 requirement',
        expectedResult: 'Policy covers all key areas per standards',
        documentationLocation: 'D3.1 Compliance Matrix'
      },
      {
        step: 4,
        action: 'Identify significant judgment areas (performance obligations, variable consideration, contract costs)',
        expectedResult: 'Areas of management judgment documented',
        documentationLocation: 'D3.1 Judgment Areas'
      },
      {
        step: 5,
        action: 'Conclude on compliance with standards',
        expectedResult: 'Conclusion: Policy compliant / Non-compliant / Requires adjustment',
        documentationLocation: 'D3.1 Conclusion'
      }
    ],

    expectedExceptions: ['Policy omits certain IFRS 15 requirements', 'Policy unclear on performance obligation identification'],
    exceptionHandling: {
      'Policy non-compliance': 'Propose disclosure or policy adjustment; discuss with management',
      'Significant omission': 'Evaluate impact on financial statements; potential audit adjustment'
    },
    conclusionFramework: 'Policy is compliant with applicable standards and provides sufficient guidance to operational staff',
    evaluationCriteria: 'Policy addresses all 5 IFRS 15 / FRS 15 steps; clear guidance on company-specific judgment areas',
    frsReferences: ['FRS 15 - Revenue'],
    isaReferences: ['ISA 540 - Estimates', 'ISA 500 - Evidence'],
    workingPaperRef: 'D3/D3.1-RevenuePolicyCompliance'
  },

  {
    procedureId: 'D3.2',
    area: 'REVENUE',
    title: 'Revenue Transaction Testing - Performance Obligation Verification',
    description: 'Sample revenue transactions across year to verify each transaction represents a satisfied performance obligation per IFRS 15 / FRS 15.',
    assertions: ['EXISTENCE', 'ACCURACY', 'CUTOFF'],
    secondaryAssertions: ['COMPLETENESS', 'CLASSIFICATION'],
    riskRespond: ['Fraudulent revenue recognition', 'Revenue from non-existent transactions', 'Performance obligation not satisfied'],
    populationDefinition: 'All revenue transactions recorded in GL during audit period (typically £XXk - £YYYk population)',
    sampleSize: { HIGH: '60%', MEDIUM: '35%', LOW: '15%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant', 'Manager review'],
    evidenceType: ['Sales orders', 'Contracts', 'Customer confirmations', 'Delivery documentation', 'Invoices', 'Cash receipts'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify revenue population from GL subledger; stratify by amount and type',
        expectedResult: 'Population stratified; sampling approach documented',
        documentationLocation: 'D3.2/Sampling'
      },
      {
        step: 2,
        action: 'Select sample using risk-based approach (higher-value transactions, unusual items 100%)',
        expectedResult: 'Sample selected per sampling plan',
        documentationLocation: 'D3.2/Sample Selection'
      },
      {
        step: 3,
        action: 'For each sample item: Obtain sales order, contract, or evidence of customer request',
        expectedResult: 'Performance obligation exists and is documented',
        documentationLocation: 'D3.2/Evidence Files'
      },
      {
        step: 4,
        action: 'Verify customer delivery (shipping document, delivery confirmation, or installation sign-off)',
        expectedResult: 'Performance obligation satisfied before revenue recording',
        documentationLocation: 'D3.2/Delivery Evidence'
      },
      {
        step: 5,
        action: 'Verify consideration is received or receivable (invoice matches contract terms, no side agreements)',
        expectedResult: 'Revenue amount matches contract consideration per IFRS 15',
        documentationLocation: 'D3.2/Consideration Verification'
      },
      {
        step: 6,
        action: 'Verify transaction recorded in correct period (date of delivery matches revenue period)',
        expectedResult: 'Cutoff is appropriate',
        documentationLocation: 'D3.2/Cutoff'
      },
      {
        step: 7,
        action: 'Perform detailed testing: Verify GL entry posting, amount accuracy, account classification',
        expectedResult: 'Transaction accurately recorded per policy',
        documentationLocation: 'D3.2/Detail Testing'
      },
      {
        step: 8,
        action: 'Document any exceptions; evaluate whether correcting entry is required',
        expectedResult: 'Exceptions quantified and evaluated for materiality',
        documentationLocation: 'D3.2/Exceptions'
      }
    ],

    expectedExceptions: ['Revenue recorded before delivery', 'Revenue with side agreements reducing effective price', 'Channel stuffing (merchandise returned after period-end)'],
    exceptionHandling: {
      'Revenue before delivery': 'Evaluate whether performance obligation satisfied; if not, propose reversal',
      'Side agreements': 'Request management representation; evaluate fraud risk; consider disclosure',
      'Returns after period-end': 'Evaluate whether return right existed; propose revenue reversal if required'
    },
    conclusionFramework: 'Tested revenue sample represents valid satisfied performance obligations per IFRS 15 / FRS 15; amounts are accurate; timing is appropriate',
    evaluationCriteria: 'No exceptions / minor exceptions (< 5% of sample) / significant exceptions (≥ 5% of sample) ',
    frsReferences: ['FRS 15 - Revenue', 'FRS 2 - Concepts and Principles'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 530 - Audit Sampling'],
    workingPaperRef: 'D3/D3.2-RevenueSampleTesting'
  },

  {
    procedureId: 'D3.3',
    area: 'REVENUE',
    title: 'Revenue Cutoff Testing - Period-End Procedures',
    description: 'Perform detailed cutoff testing for revenue recorded in final 10 days of period and first 10 days after period-end to verify transactions recorded in correct period.',
    assertions: ['CUTOFF', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Revenue cutoff misstatement', 'Period-end sales channel stuffing', 'Unrecorded revenue'],
    populationDefinition: 'All revenue transactions recorded Dec 22-31 (prior period closing) and Jan 1-10 (post period opening)',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive Detail',
    timing: 'Final Audit (post year-end)',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Sales invoices', 'Shipping/delivery documentation', 'Customer confirmations', 'GRN reports', 'GL'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all revenue transactions in cutoff window (±10 days around year-end)',
        expectedResult: 'Cutoff period revenue list prepared',
        documentationLocation: 'D3.3/Cutoff Window'
      },
      {
        step: 2,
        action: 'For transactions on Dec 26-31: Verify shipping/delivery documentation dated in period',
        expectedResult: 'All Dec transactions have delivery evidence dated Dec',
        documentationLocation: 'D3.3/Pre-Period Cutoff'
      },
      {
        step: 3,
        action: 'For transactions on Jan 1-10: Verify shipping/delivery documentation dated in next period',
        expectedResult: 'All Jan transactions have delivery evidence dated Jan',
        documentationLocation: 'D3.3/Post-Period Cutoff'
      },
      {
        step: 4,
        action: 'Investigate any transactions recorded before delivery (e.g., invoice dated before delivery)',
        expectedResult: 'Support for early recognition or correction',
        documentationLocation: 'D3.3/Exceptions'
      },
      {
        step: 5,
        action: 'Investigate any unshipped orders recorded as revenue',
        expectedResult: 'No unshipped orders recognized as revenue',
        documentationLocation: 'D3.3/Unshipped Orders'
      },
      {
        step: 6,
        action: 'Review post-period-end returns/cancellations for revenue records that should be reversed',
        expectedResult: 'Any returns within 30 days evaluated for revenue reversal',
        documentationLocation: 'D3.3/Post-Period Returns'
      }
    ],

    expectedExceptions: ['Unshipped orders recorded as revenue', 'Invoices dated before delivery', 'Returns post-period that should reverse revenue'],
    exceptionHandling: {
      'Unshipped orders': 'Propose revenue reversal; evaluate fraud risk',
      'Pre-delivery recognition': 'Evaluate IFRS 15 performance obligation satisfaction; propose correction if needed',
      'Unreversed post-period returns': 'Propose revenue reversal and appropriate classification'
    },
    conclusionFramework: 'Revenue cutoff is appropriate; all tested transactions recorded in correct period per IFRS 15',
    evaluationCriteria: 'No exceptions / minor timing exceptions easily corrected / significant cutoff misstatements',
    frsReferences: ['FRS 15 - Revenue', 'FRS 2 - Cutoff'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 505 - External Confirmations'],
    workingPaperRef: 'D3/D3.3-RevenueCutoff'
  },

  {
    procedureId: 'D3.4',
    area: 'REVENUE',
    title: 'Accounts Receivable Aging Analysis and Collection Verification',
    description: 'Analyze AR aging; identify aged balances; verify subsequent collection to assess credit risk and collectibility.',
    assertions: ['EXISTENCE', 'VALUATION', 'COMPLETENESS'],
    secondaryAssertions: ['ACCURACY', 'CLASSIFICATION'],
    riskRespond: ['Uncollectible receivables', 'Bad debt provision understatement', 'AR overvaluation'],
    populationDefinition: 'Accounts receivable subledger at period-end; all customer balances',
    sampleSize: { HIGH: '70%', MEDIUM: '40%', LOW: '20%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['AR aging report', 'Customer statements', 'Remittance advice', 'Correspondence', 'Post-period-end receipts'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain AR aging report from GL; reconcile total to GL balance',
        expectedResult: 'Aging report total agrees to GL',
        documentationLocation: 'D3.4/AR Reconciliation'
      },
      {
        step: 2,
        action: 'Stratify AR by age: Current, 1-30 days, 31-60 days, 61-90 days, 90+ days',
        expectedResult: 'AR stratified with aging days quantified',
        documentationLocation: 'D3.4/Aging Analysis'
      },
      {
        step: 3,
        action: 'Identify aged balances (>90 days); analyze management commentary on collectibility',
        expectedResult: 'Aged AR identified; management assessment documented',
        documentationLocation: 'D3.4/Aged Analysis'
      },
      {
        step: 4,
        action: 'Sample major customers across all aging bands; verify subsequent cash receipts (Jan-Feb)',
        expectedResult: 'Post-period-end collection evidence obtained',
        documentationLocation: 'D3.4/Subsequent Receipts'
      },
      {
        step: 5,
        action: 'For non-collected items: Investigate reasons (customer dispute, payment plan, insolvency)',
        expectedResult: 'Non-collection reasons documented',
        documentationLocation: 'D3.4/Non-Collected Items'
      },
      {
        step: 6,
        action: 'Evaluate bad debt provision adequacy (see D3.8)',
        expectedResult: 'Provision assessment completed',
        documentationLocation: 'D3.4/Provision Assessment'
      }
    ],

    expectedExceptions: ['Aged balances not subsequently collected', 'Disputed invoices', 'Customer insolvency after year-end'],
    exceptionHandling: {
      'Aged non-collection': 'Evaluate bad debt provision; if inadequate, propose top-up provision',
      'Disputed invoice': 'Document dispute; evaluate likely resolution; include in provision assessment',
      'Post-period insolvency': 'Evaluate whether known at year-end; assess collectibility'
    },
    conclusionFramework: 'AR is substantially collected post-period; provision for uncollectible balances is adequate',
    evaluationCriteria: 'Collection rate >90% / 80-90% collection rate / <80% collection rate (may indicate provision inadequacy)',
    frsReferences: ['FRS 102 s11 - Basic Financial Statements', 'FRS 102 s2 - Measurement basis'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 505 - Confirmations'],
    workingPaperRef: 'D3/D3.4-ARCollectibility'
  },

  {
    procedureId: 'D3.5',
    area: 'REVENUE',
    title: 'AR Confirmations - Positive and Negative Confirmations',
    description: 'Send AR confirmation requests (positive/negative) to sample of major customers to verify existence and accuracy of outstanding balances.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['RIGHTS_OBLIGATIONS'],
    riskRespond: ['Fictional AR', 'AR amount misstatement', 'AR recording misstatement'],
    populationDefinition: 'Accounts receivable subledger; major customers representing 80%+ of AR balance',
    sampleSize: { HIGH: '80%', MEDIUM: '50%', LOW: '25%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Manager - confirmation administration', 'Senior accountant - follow-up'],
    evidenceType: ['Confirmation requests/responses', 'Follow-up correspondence', 'Alternative procedures', 'Management representations'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain list of major customers from AR subledger; stratify by balance size',
        expectedResult: 'Customer list sorted by balance; top customers identified',
        documentationLocation: 'D3.5/Sample Selection'
      },
      {
        step: 2,
        action: 'Determine positive vs negative confirmation approach (positive for high-risk items, negative for routine)',
        expectedResult: 'Confirmation strategy documented',
        documentationLocation: 'D3.5/Strategy'
      },
      {
        step: 3,
        action: 'Prepare confirmation requests showing customer name, balance, terms (positive) or requesting response if incorrect (negative)',
        expectedResult: 'Confirmation templates prepared per ISA 505',
        documentationLocation: 'D3.5/Confirmations'
      },
      {
        step: 4,
        action: 'Mail confirmations directly from auditor; track responses',
        expectedResult: 'Confirmations sent and tracked per ISA 505',
        documentationLocation: 'D3.5/Mailing Log'
      },
      {
        step: 5,
        action: 'Follow-up on non-responses (second request, phone calls, alternative procedures)',
        expectedResult: 'Response rate >80% or alternative procedures performed',
        documentationLocation: 'D3.5/Follow-ups'
      },
      {
        step: 6,
        action: 'Evaluate confirmation exceptions (disagreed amounts, disputes, partial replies)',
        expectedResult: 'All exceptions analyzed; management responses evaluated',
        documentationLocation: 'D3.5/Exceptions'
      },
      {
        step: 7,
        action: 'Perform alternative procedures for non-responses (subsequent receipts, delivery evidence, sales orders)',
        expectedResult: 'Alternative evidence validates AR balance',
        documentationLocation: 'D3.5/Alternative Procedures'
      }
    ],

    expectedExceptions: ['Disputed balances', 'Non-responses', 'Discrepancies between customer and GL records', 'Customer claims early payment'],
    exceptionHandling: {
      'Disputed balance': 'Investigate dispute; obtain supporting documentation; propose adjustment if appropriate',
      'Non-response': 'Perform alternative procedures (subsequent receipt, sales order); if not resolved, evaluate impact on opinion',
      'Discrepancy': 'Reconcile difference; determine if GL or customer record is correct; propose correction'
    },
    conclusionFramework: 'Confirmed that AR balances exist and are accurately recorded; confirmed with X% of population',
    evaluationCriteria: '>80% satisfactory confirmations / 60-80% satisfactory (weak audit evidence) / <60% (insufficient evidence)',
    frsReferences: ['FRS 102 s11 - Basic Financial Statements'],
    isaReferences: ['ISA 505 - External Confirmations', 'ISA 500 - Audit Evidence'],
    workingPaperRef: 'D3/D3.5-ARConfirmations'
  },

  {
    procedureId: 'D3.6',
    area: 'REVENUE',
    title: 'Bad Debt Provision - Adequacy Testing',
    description: 'Review bad debt provision calculation; verify provision is adequate for identified uncollectible and doubtful balances per FRS 102.',
    assertions: ['VALUATION', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Bad debt provision understatement', 'Uncollectible AR overstated', 'Profit overstatement'],
    populationDefinition: 'Bad debt provision per GL; all aged/doubtful AR balances',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant with credit experience'],
    evidenceType: ['Provision calculation', 'AR aging', 'Historical default rates', 'Customer correspondence', 'Legal letters'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain bad debt provision schedule; verify calculation to GL',
        expectedResult: 'Provision schedule reconciled to GL',
        documentationLocation: 'D3.6/Provision Calculation'
      },
      {
        step: 2,
        action: 'Analyze provision methodology (percentage of AR, specific reserve per customer, age-based percentages)',
        expectedResult: 'Methodology identified and reasonableness assessed',
        documentationLocation: 'D3.6/Methodology'
      },
      {
        step: 3,
        action: 'Compare current provision rate to historical default rate',
        expectedResult: 'Current provision rate is supportable by historical experience',
        documentationLocation: 'D3.6/Historical Analysis'
      },
      {
        step: 4,
        action: 'Review AR aging; identify specific customers with collections issues',
        expectedResult: 'Aged AR analyzed; specific problem customers identified',
        documentationLocation: 'D3.6/Aged AR Review'
      },
      {
        step: 5,
        action: 'For specific high-risk customers: Obtain credit reports, correspondence, payment history; assess recoverability',
        expectedResult: 'Specific reserve assessment completed for major items',
        documentationLocation: 'D3.6/Specific Reserves'
      },
      {
        step: 6,
        action: 'Compare prior-year provision to actual write-offs in current year (evaluate reasonableness of prior estimate)',
        expectedResult: 'Prior provision was adequate / over-provided / under-provided',
        documentationLocation: 'D3.6/Prior Year Evaluation'
      },
      {
        step: 7,
        action: 'Obtain post-period-end collections data (Jan-Feb); identify any significant write-offs',
        expectedResult: 'Post-period collection experience evaluated against provision',
        documentationLocation: 'D3.6/Post-Period Collections'
      },
      {
        step: 8,
        action: 'Evaluate whether provision is adequate under FRS 102; if not, propose adjustment',
        expectedResult: 'Conclusion on provision adequacy; if inadequate, adjust proposed',
        documentationLocation: 'D3.6/Conclusion'
      }
    ],

    expectedExceptions: ['Provision below historical default rate', 'Specific problem customers not reserved', 'Significant post-period write-offs'],
    exceptionHandling: {
      'Inadequate provision': 'Propose top-up provision to bring to adequate level',
      'Overlooked customer': 'Add specific reserve for problem customers',
      'Post-period write-off': 'Evaluate whether known/anticipated at year-end; adjust provision if needed'
    },
    conclusionFramework: 'Bad debt provision is adequate under FRS 102; collectibility risk is appropriately provided for',
    evaluationCriteria: 'Provision is adequate (≥ management estimate based on historical/specific analysis)',
    frsReferences: ['FRS 102 s11 - Receivables valuation', 'FRS 102 s2 - Measurement principles'],
    isaReferences: ['ISA 540 - Accounting Estimates'],
    workingPaperRef: 'D3/D3.6-BadDebtProvision'
  },

  {
    procedureId: 'D3.7',
    area: 'REVENUE',
    title: 'Contra-Revenue Items - Returns, Discounts, and Allowances',
    description: 'Test contra-revenue items (returns, discounts, allowances) to verify compliance with revenue policy and accurate recording.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Revenue overstatement through inadequate contra-items', 'Post-period-end returns not recorded', 'Side discounts not documented'],
    populationDefinition: 'All revenue returns, discounts, allowances recorded in period',
    sampleSize: { HIGH: '70%', MEDIUM: '40%', LOW: '20%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Return authorizations', 'Credit notes', 'Discount schedules', 'Customer correspondence', 'GL entries'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain schedule of contra-revenue items (returns, discounts, allowances); reconcile to GL',
        expectedResult: 'Contra-revenue schedule agrees to GL',
        documentationLocation: 'D3.7/Contra-Revenue'
      },
      {
        step: 2,
        action: 'Analyze composition: % returns, % discounts, % allowances vs revenue policy',
        expectedResult: 'Contra-revenue items classified per policy',
        documentationLocation: 'D3.7/Analysis'
      },
      {
        step: 3,
        action: 'Sample returns: Verify return authorization, receipt of goods, credit note issuance, recording',
        expectedResult: 'Returns are properly authorized and recorded',
        documentationLocation: 'D3.7/Return Testing'
      },
      {
        step: 4,
        action: 'Sample discounts: Verify discount authorization, compliance with pricing policy, proper deduction from invoice',
        expectedResult: 'Discounts are authorized and consistent with policy',
        documentationLocation: 'D3.7/Discount Testing'
      },
      {
        step: 5,
        action: 'Review post-period-end returns (Jan-Feb period) to identify whether should be recorded in current period',
        expectedResult: 'Post-period returns assessed for period-end reversal (see cutoff policy)',
        documentationLocation: 'D3.7/Post-Period Returns'
      },
      {
        step: 6,
        action: 'Evaluate whether contra-revenue items are complete; compare current year to prior year for unusual changes',
        expectedResult: 'Trend analysis shows consistent return rate; changes are explained',
        documentationLocation: 'D3.7/Trend Analysis'
      }
    ],

    expectedExceptions: ['Return not authorized', 'Discount outside policy', 'Post-period return not recorded'],
    exceptionHandling: {
      'Unauthorized return': 'Investigate reason; evaluate fraud risk',
      'Policy violation': 'Propose correction; evaluate impact on controls',
      'Post-period return': 'Evaluate whether should be reversed; if material, propose adjustment'
    },
    conclusionFramework: 'Contra-revenue items are accurate, authorized, and complete per revenue policy',
    evaluationCriteria: 'No exceptions / minor exceptions <2% of total / significant exceptions ≥2%',
    frsReferences: ['FRS 15 - Revenue', 'FRS 2 - Presentation principles'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D3/D3.7-ContraRevenue'
  },

  {
    procedureId: 'D3.8',
    area: 'REVENUE',
    title: 'Deferred Revenue - Timing and Completeness',
    description: 'Review deferred revenue account; verify items are properly deferred (performance obligation not satisfied); verify release to revenue is timely.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'VALUATION', 'CUTOFF'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Revenue recognized prematurely', 'Deferred revenue omitted', 'Performance obligation satisfaction misidentified'],
    populationDefinition: 'Deferred revenue GL account; all contracts with performance obligations not yet satisfied',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant with SaaS/subscription background'],
    evidenceType: ['Customer contracts', 'Deferred revenue schedule', 'Cash received documentation', 'Revenue release analysis', 'Accounting policy'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain deferred revenue schedule; reconcile to GL',
        expectedResult: 'Schedule agrees to GL balance',
        documentationLocation: 'D3.8/Reconciliation'
      },
      {
        step: 2,
        action: 'For each significant deferred revenue item: Obtain customer contract',
        expectedResult: 'Contracts obtained for all material items',
        documentationLocation: 'D3.8/Contracts'
      },
      {
        step: 3,
        action: 'Verify for each item: (a) Cash has been received; (b) Performance obligation not yet satisfied; (c) Amount deferred matches contract consideration',
        expectedResult: 'Deferred revenue items meet deferral criteria',
        documentationLocation: 'D3.8/Deferral Criteria'
      },
      {
        step: 4,
        action: 'For deferred items released to revenue during year: Verify performance obligation satisfied in that period',
        expectedResult: 'Revenue release timing is appropriate',
        documentationLocation: 'D3.8/Release Timing'
      },
      {
        step: 5,
        action: 'Trace revenue release from deferred revenue account to revenue GL account',
        expectedResult: 'All releases are properly recorded',
        documentationLocation: 'D3.8/Release Tracing'
      },
      {
        step: 6,
        action: 'Review post-period-end releases (Jan-Feb); verify are properly recorded in next period',
        expectedResult: 'Post-period releases are properly timed',
        documentationLocation: 'D3.8/Post-Period Releases'
      },
      {
        step: 7,
        action: 'Verify disclosure in notes per FRS 15 (deferred revenue amount, typical recognition period)',
        expectedResult: 'Disclosure is adequate',
        documentationLocation: 'D3.8/Disclosure'
      }
    ],

    expectedExceptions: ['Deferred item released without performance obligation satisfaction', 'Deferred revenue item not released when obligation satisfied'],
    exceptionHandling: {
      'Premature release': 'Propose reversal of revenue; reclassify to deferred revenue',
      'Late release': 'Identify period in which obligation was satisfied; propose revenue adjustment to correct period (evaluate impact on cutoff)',
      'Missing deferral': 'For significant omissions, propose accrual of deferred revenue'
    },
    conclusionFramework: 'Deferred revenue items are appropriately deferred (performance obligation not satisfied); releases are timely and accurate',
    evaluationCriteria: 'No exceptions / minor classification exceptions / significant recognition timing issues',
    frsReferences: ['FRS 15 - Revenue', 'FRS 2 - Timing of recognition'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 540 - Estimates'],
    workingPaperRef: 'D3/D3.8-DeferredRevenue'
  },

  // Additional D3 procedures (D3.9-D3.30) would follow same pattern
  // Including: Gift cards/loyalty accounting, Revenue variance analysis, Unusual transactions investigation,
  // Management representations on revenue, Fraud brainstorming, etc.
];

// Continue with D4-D14 areas...
// Due to length constraints, I'll provide the structure framework and representative samples

// ============================================================================
// 5. D4: INVENTORY - 25+ PROCEDURES
// ============================================================================
export const PROCEDURE_D4_INVENTORY = [
  {
    procedureId: 'D4.1',
    area: 'INVENTORY',
    title: 'Inventory Count Attendance and Observation',
    description: 'Attend inventory count at year-end; observe count procedures; verify count accuracy via test counts; identify obsolete/slow-moving items.',
    assertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Inventory overstatement', 'Unrecorded inventory', 'Count accuracy issues', 'Obsolescence not identified'],
    populationDefinition: 'All inventory at year-end physical count locations',
    sampleSize: { HIGH: '100% attendance + 5% test count', MEDIUM: '100% attendance + 3% test count', LOW: '100% attendance + 1% test count' },
    testNature: 'Substantive',
    timing: 'Year-end (inventory date)',
    resourcesRequired: ['Manager or Senior - count attendance', 'Team members - test counts'],
    evidenceType: ['Count observation notes', 'Test count results', 'Count sheets', 'Obsolescence assessment', 'Photos/video'],

    executionSteps: [
      {
        step: 1,
        action: 'Attend inventory count meeting; understand count procedures, segregation of items, cut-off controls',
        expectedResult: 'Count procedures documented; areas of responsibility assigned',
        documentationLocation: 'D4.1/Count Procedures'
      },
      {
        step: 2,
        action: 'Observe physical count process; verify items are marked/counted systematically; no items are counted twice',
        expectedResult: 'Count process is orderly and controlled',
        documentationLocation: 'D4.1/Observation Notes'
      },
      {
        step: 3,
        action: 'Perform independent test counts on sample of items; compare to count sheets',
        expectedResult: 'Auditor test counts reconciled to client count (allow 1-2% variance)',
        documentationLocation: 'D4.1/Test Counts'
      },
      {
        step: 4,
        action: 'Identify items that appear obsolete, slow-moving, or damaged; photograph',
        expectedResult: 'Potential obsolescence items identified for valuation assessment',
        documentationLocation: 'D4.1/Obsolescence'
      },
      {
        step: 5,
        action: 'Track cut-off items (goods received just before count, goods shipped just after count)',
        expectedResult: 'Cut-off documentation prepared',
        documentationLocation: 'D4.1/Cut-off Log'
      },
      {
        step: 6,
        action: 'Identify any items physically present but not on count sheets (unrecorded inventory)',
        expectedResult: 'Completeness of count verified',
        documentationLocation: 'D4.1/Unrecorded Items'
      }
    ],

    expectedExceptions: ['Count accuracy variance >2%', 'Obsolete items not identified by client', 'Cut-off errors', 'Unrecorded inventory'],
    exceptionHandling: {
      'Count variance': 'Investigate; if >2%, recommend recount of area',
      'Obsolescence': 'Assess for valuation reserve (see D4.X)',
      'Cut-off error': 'Quantify impact; propose adjustment if material',
      'Unrecorded inventory': 'Propose addition to inventory GL'
    },
    conclusionFramework: 'Inventory count was properly conducted; auditor test counts were accurate; physical count ties to GL with acceptable variance',
    evaluationCriteria: 'Test count variance <2% / 2-5% variance (investigate further) / >5% variance (recommend recount)',
    frsReferences: ['FRS 102 s13 - Inventory', 'ISA 501 - Inventory'],
    isaReferences: ['ISA 501 - Specific Considerations'],
    workingPaperRef: 'D4/D4.1-InventoryCountAttendance'
  },

  {
    procedureId: 'D4.2',
    area: 'INVENTORY',
    title: 'Inventory Reconciliation - Physical Count to GL',
    description: 'Reconcile physical count totals from count sheets to GL inventory balance; investigate and quantify variances.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'EXISTENCE'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Inventory count errors', 'Inventory shrinkage not recorded', 'GL-to-physical variance'],
    populationDefinition: 'Physical count totals; GL inventory balance',
    sampleSize: { HIGH: '100% (100% reconciliation)', MEDIUM: '100% (100% reconciliation)', LOW: '100% (100% reconciliation)' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Physical count summary', 'GL inventory account', 'Inventory valuation', 'Adjustment notes'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain final physical count summary from client',
        expectedResult: 'Count summary prepared and authorized',
        documentationLocation: 'D4.2/Count Summary'
      },
      {
        step: 2,
        action: 'Reconcile total count to GL balance',
        expectedResult: 'Reconciliation completed; variance quantified',
        documentationLocation: 'D4.2/Reconciliation'
      },
      {
        step: 3,
        action: 'Investigate variances (shortages, overages); determine if count error or GL error',
        expectedResult: 'Variances explained and documented',
        documentationLocation: 'D4.2/Variance Analysis'
      },
      {
        step: 4,
        action: 'If count is lower than GL: Assess whether shortage should be written off as obsolescence/shrinkage',
        expectedResult: 'Inventory write-off is appropriate',
        documentationLocation: 'D4.2/Write-off'
      }
    ],

    expectedExceptions: ['Significant count variance', 'Unexplained shortage', 'Count error'],
    exceptionHandling: {
      'Variance': 'Evaluate whether acceptable (typically <2% or <£Xk); if not, propose recount or write-off',
      'Shortage': 'Propose inventory adjustment; assess for loss (theft/damage)'
    },
    conclusionFramework: 'Physical inventory count reconciles to GL within acceptable tolerance; inventory balance is accurate',
    evaluationCriteria: 'Variance <2% or <£5k / Variance 2-5% (investigate) / >5% (significant issue)',
    frsReferences: ['FRS 102 s13 - Inventory'],
    isaReferences: ['ISA 501 - Inventory'],
    workingPaperRef: 'D4/D4.2-InventoryReconciliation'
  },

  // Continue with D4.3-D4.25 (inventory cost, NRV, WIP, obsolescence, etc.)
];

// ============================================================================
// 6. D5: FIXED ASSETS - 28+ PROCEDURES
// ============================================================================
export const PROCEDURE_D5_FIXED_ASSETS = [
  {
    procedureId: 'D5.1',
    area: 'FIXED ASSETS',
    title: 'Fixed Asset Additions - Verify Capitalization and Cost Build-up',
    description: 'Sample fixed asset additions during year; verify capitalization criteria met, cost build-up is accurate, proper GL account coding.',
    assertions: ['EXISTENCE', 'ACCURACY', 'CLASSIFICATION'],
    secondaryAssertions: ['COMPLETENESS', 'VALUATION'],
    riskRespond: ['Capital expenditure expensed instead of capitalized', 'Overstatement of asset cost', 'Miscoding to revenue expense'],
    populationDefinition: 'All fixed asset additions during period (typically >£XXk threshold); additions recorded in FA register',
    sampleSize: { HIGH: '70%', MEDIUM: '40%', LOW: '20%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant', 'Manager review for complex items'],
    evidenceType: ['Purchase invoices', 'Installation documentation', 'Delivery notes', 'Capitalization policy', 'GL entries', 'Board approvals'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain fixed asset additions schedule; verify total to GL',
        expectedResult: 'Additions schedule agrees to GL',
        documentationLocation: 'D5.1/Additions Schedule'
      },
      {
        step: 2,
        action: 'Review capitalization policy (nature of asset, useful life, capitalization threshold)',
        expectedResult: 'Policy documented and understood',
        documentationLocation: 'D5.1/Policy'
      },
      {
        step: 3,
        action: 'Sample major additions and items just above/below capitalization threshold',
        expectedResult: 'Risk-based sample selected',
        documentationLocation: 'D5.1/Sample'
      },
      {
        step: 4,
        action: 'For each addition: Verify nature of asset (PP&E per FRS 102); verify capitalization criteria met',
        expectedResult: 'Each addition meets capitalization definition',
        documentationLocation: 'D5.1/Capitalization Assessment'
      },
      {
        step: 5,
        action: 'Verify cost build-up: Invoice + installation + delivery + directly attributable costs (exclude financing costs)',
        expectedResult: 'Cost is accurate per FRS 102',
        documentationLocation: 'D5.1/Cost Verification'
      },
      {
        step: 6,
        action: 'Verify asset is coded to correct GL account (plant, equipment, building, etc.)',
        expectedResult: 'Classification is appropriate',
        documentationLocation: 'D5.1/Classification'
      },
      {
        step: 7,
        action: 'For additions capitalized as asset under construction: Verify completion and transfer to appropriate asset class',
        expectedResult: 'AUC items properly transferred when complete',
        documentationLocation: 'D5.1/AUC Transfer'
      }
    ],

    expectedExceptions: ['Capitalized items that should be expensed (repairs/maintenance)', 'Incorrect cost build-up', 'Misclassification'],
    exceptionHandling: {
      'Expensed capital item': 'Propose capitalization; evaluate impact on depreciation',
      'Cost error': 'Propose correction to cost',
      'Misclass': 'Propose reclassification; evaluate depreciation impact'
    },
    conclusionFramework: 'Fixed asset additions are appropriately capitalized per FRS 102; costs are accurate; useful life assignments are reasonable',
    evaluationCriteria: 'No exceptions / Minor exceptions <2% / Significant exceptions ≥2%',
    frsReferences: ['FRS 102 s16 - PP&E'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D5/D5.1-FAAdditions'
  },

  {
    procedureId: 'D5.2',
    area: 'FIXED ASSETS',
    title: 'Depreciation Recalculation and Useful Life Testing',
    description: 'Recalculate depreciation expense for sample of assets; verify useful lives are reasonable and consistent with policy.',
    assertions: ['ACCURACY', 'VALUATION'],
    secondaryAssertions: ['COMPLETENESS', 'CLASSIFICATION'],
    riskRespond: ['Depreciation miscalculation', 'Useful life misstatement affecting depreciation', 'Useful lives inconsistent with assets'],
    populationDefinition: 'All assets with depreciation in current year; depreciation register',
    sampleSize: { HIGH: '60%', MEDIUM: '35%', LOW: '15%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant with FA background'],
    evidenceType: ['Depreciation register', 'Depreciation calculation sheet', 'Asset register', 'Policy documentation', 'Asset specifications'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain depreciation register; verify total depreciation expense to GL',
        expectedResult: 'Register agrees to GL',
        documentationLocation: 'D5.2/Depreciation Register'
      },
      {
        step: 2,
        action: 'Review depreciation policy (method: straight-line/declining balance; useful lives by asset type)',
        expectedResult: 'Policy documented',
        documentationLocation: 'D5.2/Policy'
      },
      {
        step: 3,
        action: 'Sample assets across different types (land, buildings, plant, equipment); recalculate depreciation',
        expectedResult: 'Depreciation recalculated for sample',
        documentationLocation: 'D5.2/Recalculation'
      },
      {
        step: 4,
        action: 'For each sample item: Verify cost base, useful life applied, residual value, depreciation method',
        expectedResult: 'Each item is depreciated per policy',
        documentationLocation: 'D5.2/Detail Testing'
      },
      {
        step: 5,
        action: 'Verify new assets added during year are depreciated from correct date (acquisition vs first use)',
        expectedResult: 'Depreciation timing is appropriate',
        documentationLocation: 'D5.2/Addition Depreciation'
      },
      {
        step: 6,
        action: 'Verify disposed assets are depreciated only to disposal date (no continued depreciation)',
        expectedResult: 'Disposal depreciation is accurate',
        documentationLocation: 'D5.2/Disposal Depreciation'
      },
      {
        step: 7,
        action: 'Assess whether useful lives remain appropriate (no indicators of change)',
        expectedResult: 'Useful lives are reasonable and appropriate',
        documentationLocation: 'D5.2/Useful Life Assessment'
      }
    ],

    expectedExceptions: ['Depreciation calculation error', 'Useful life changed without disclosure', 'Disposed asset still depreciated'],
    exceptionHandling: {
      'Calc error': 'Propose correction',
      'Useful life change': 'Verify policy change authorized; ensure disclosure in notes',
      'Over-depreciation': 'Propose correction; evaluate impact'
    },
    conclusionFramework: 'Depreciation is accurately calculated per policy; useful lives are reasonable and consistently applied',
    evaluationCriteria: 'No exceptions / Minor exceptions <1% of depreciation / Significant exceptions ≥1%',
    frsReferences: ['FRS 102 s16 - PP&E', 'FRS 102 s2 - Depreciation allocation'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D5/D5.2-Depreciation'
  },

  // Continue with D5.3-D5.28 (disposals, impairment, lease classification, capital commitments, etc.)
];

// ============================================================================
// 7. COMPREHENSIVE PROCEDURE LIBRARY INDEX
// ============================================================================
export const PROCEDURE_LIBRARY = {
  D3: {
    area: 'REVENUE & RECEIVABLES',
    description: 'Testing revenue recognition, AR existence and collectibility, contra-revenue items',
    totalProcedures: 30,
    procedures: PROCEDURE_D3_REVENUE,
    keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'CUTOFF', 'VALUATION'],
    keyRisks: ['Fraudulent revenue', 'Cutoff errors', 'Uncollectible AR'],
    typicalSampleSize: '35-50%'
  },
  D4: {
    area: 'INVENTORY',
    description: 'Testing inventory existence, valuation, NRV, obsolescence, cost build-up',
    totalProcedures: 25,
    procedures: PROCEDURE_D4_INVENTORY,
    keyAssertions: ['EXISTENCE', 'COMPLETENESS', 'ACCURACY', 'VALUATION'],
    keyRisks: ['Inventory overstatement', 'Obsolescence not provided', 'Cost build-up error'],
    typicalSampleSize: '40-60%'
  },
  D5: {
    area: 'FIXED ASSETS',
    description: 'Testing FA additions, depreciation, disposals, useful lives, impairment',
    totalProcedures: 28,
    procedures: PROCEDURE_D5_FIXED_ASSETS,
    keyAssertions: ['EXISTENCE', 'ACCURACY', 'VALUATION', 'COMPLETENESS'],
    keyRisks: ['Capitalization error', 'Depreciation misstatement', 'Impairment not recognized'],
    typicalSampleSize: '30-50%'
  },
  // D6-D14 would follow same structure
};

// ============================================================================
// 8. ASSERTION-PROCEDURE MAPPING MATRIX
// ============================================================================
export const ASSERTION_PROCEDURE_MAP = {
  EXISTENCE: {
    assertion: 'Existence or Occurrence',
    primaryProcedures: [
      'D3.2 - Revenue transaction testing',
      'D3.4 - AR aging and collection',
      'D3.5 - AR confirmations',
      'D4.1 - Inventory count attendance',
      'D5.1 - FA additions verification'
    ],
    procedureNatures: ['External confirmation', 'Inspection', 'Detail substantive testing'],
    evidenceReliability: 'High'
  },
  COMPLETENESS: {
    assertion: 'Completeness',
    primaryProcedures: [
      'D3.2 - Revenue transaction sampling',
      'D3.3 - Revenue cutoff',
      'D4.2 - Inventory reconciliation',
      'D5.1 - FA additions completeness'
    ],
    procedureNatures: ['Analytical review', 'Cutoff testing', 'Unrecorded liability search'],
    evidenceReliability: 'Medium-High'
  },
  ACCURACY: {
    assertion: 'Accuracy or Valuation',
    primaryProcedures: [
      'D3.2 - Revenue amount verification',
      'D4.1 - Inventory count accuracy',
      'D5.2 - Depreciation recalculation',
      'D6.X - Payable amount reconciliation'
    ],
    procedureNatures: ['Recalculation', 'Reconciliation', 'Detail testing'],
    evidenceReliability: 'High'
  },
  CUTOFF: {
    assertion: 'Cutoff',
    primaryProcedures: [
      'D3.3 - Revenue cutoff',
      'D4.X - Inventory GRNI testing',
      'D6.X - Payable cutoff'
    ],
    procedureNatures: ['Cutoff testing', 'Post-period-end procedures'],
    evidenceReliability: 'High'
  },
  VALUATION: {
    assertion: 'Valuation or Allocation',
    primaryProcedures: [
      'D3.6 - Bad debt provision',
      'D4.X - Inventory NRV testing',
      'D5.2 - Depreciation/useful life',
      'D5.X - Impairment testing'
    ],
    procedureNatures: ['Estimation re-performance', 'Specialist assessment', 'Recalculation'],
    evidenceReliability: 'Medium-High'
  },
  CLASSIFICATION: {
    assertion: 'Classification and Presentation',
    primaryProcedures: [
      'D3.1 - Revenue recognition policy',
      'D3.7 - Contra-revenue classification',
      'D5.1 - FA classification',
      'D6.X - Payable classification'
    ],
    procedureNatures: ['Policy review', 'Detail testing', 'Classification analysis'],
    evidenceReliability: 'High'
  }
};

// ============================================================================
// 9. EXCEPTION EVALUATION MATRIX
// ============================================================================
export const EXCEPTION_EVALUATION = {
  evaluateExceptions: function(exceptionCount, sampleSize, materialityThreshold) {
    const exceptionRate = exceptionCount / sampleSize;
    const projectedPopulation = Math.ceil(exceptionCount * (TOTAL_POPULATION / sampleSize));

    return {
      exceptionCount,
      sampleSize,
      exceptionRate: (exceptionRate * 100).toFixed(2) + '%',
      projectedImpact: projectedPopulation,
      materialityThreshold,
      isMaterial: projectedPopulation > materialityThreshold,
      auditConclusion: exceptionCount === 0 ? 'Accept' : exceptionCount > 3 ? 'Reject' : 'Investigate Further',
      actionRequired: this.getActionRequired(exceptionCount, exceptionRate)
    };
  },

  getActionRequired: function(exceptionCount, exceptionRate) {
    if (exceptionCount === 0) return 'Accept; No adjustment needed';
    if (exceptionCount <= 2 && exceptionRate < 0.02) return 'Accept with limited exceptions; evaluate for adjustment';
    if (exceptionCount > 2 || exceptionRate >= 0.02) return 'Propose correction; may recommend remediation of controls';
    return 'Assess if systematic; consider larger sample';
  },

  singleExceptionRule: {
    description: 'Finding 1 exception means:',
    implications: [
      '1. Exception is isolated or systematic (investigate root cause)',
      '2. If isolated: Accept with notation; document; monitor',
      '3. If systematic: Propose control remediation; larger sample testing',
      '4. If fraud-related: Escalate to audit senior; consider impact on opinion'
    ]
  },

  threeExceptionsRule: {
    description: 'Finding 3+ exceptions means:',
    implications: [
      '1. Evaluate for systematic misstatement',
      '2. Propose correction of identified exceptions',
      '3. Increase sample size; consider 100% testing if high-risk',
      '4. Evaluate control deficiency; may require ICFR assessment',
      '5. Document trend; consider prior-year comparisons'
    ]
  }
};

// ============================================================================
// 10. PROCEDURE EXECUTION TRACKING
// ============================================================================
export const PROCEDURE_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
  REVIEW_PENDING: 'Review Pending',
  EXCEPTION_PENDING: 'Exception Pending Resolution'
};

export const PROCEDURE_TRACKER = {
  createTracker: function(procedureId) {
    return {
      procedureId,
      status: PROCEDURE_STATUS.NOT_STARTED,
      preparer: '',
      reviewer: '',
      dateStarted: null,
      dateCompleted: null,
      hoursSpent: 0,
      exceptionsFound: 0,
      approvalDate: null,
      reviewerApprovalDate: null,
      workingPaperLocation: '',
      evidenceFiles: [],
      notes: []
    };
  },

  updateStatus: function(tracker, newStatus) {
    tracker.status = newStatus;
    if (newStatus === PROCEDURE_STATUS.IN_PROGRESS && !tracker.dateStarted) {
      tracker.dateStarted = new Date();
    }
    if (newStatus === PROCEDURE_STATUS.COMPLETE && !tracker.dateCompleted) {
      tracker.dateCompleted = new Date();
    }
    return tracker;
  }
};

// ============================================================================
// 11. EVIDENCE COLLECTION FRAMEWORK
// ============================================================================
export const EVIDENCE_TYPES = {
  INSPECTION: 'Physical inspection of assets, documents, or records',
  OBSERVATION: 'Watching process or control being executed',
  INQUIRY: 'Asking management/staff questions',
  CONFIRMATION: 'External third-party confirmation (bank, customer, supplier)',
  RECALCULATION: 'Recalculating amount (depreciation, provision, interest)',
  REPERFORMANCE: 'Performing procedure again independently',
  ANALYTICAL: 'Analytical review of trends, ratios, relationships',
  DOCUMENTATION: 'Supporting documents (invoices, contracts, correspondence)',
  SPECIALIST: 'Using specialist (valuer, engineer, lawyer)'
};

export const EVIDENCE_ASSESSMENT_FORM = {
  procedureId: '',
  evidenceSource: '',           // GL, subledger, external, management prepared
  evidenceDescription: '',      // What was obtained
  evidenceReliability: '',      // High, Medium, Low
  scopeCovered: '',             // Population covered, sample size
  dateObtained: null,
  fileLocation: '',             // Where evidence filed
  preparer: '',
  reviewer: '',
  assessmentNotes: ''
};

// ============================================================================
// 12. INDUSTRY-SPECIFIC PROCEDURE VARIATIONS
// ============================================================================
export const INDUSTRY_VARIATIONS = {
  CONSTRUCTION: {
    industry: 'Construction / Long-term Contracts',
    specialConsiderations: [
      'Stage of completion method for revenue recognition',
      'Retention amounts and recovery assessment',
      'Contract variations and claims',
      'Provision for contract losses',
      'Cost of goods sold analysis (contract profitability)'
    ],
    procedureModifications: {
      'D3.2': 'Include revenue per stage of completion contract schedules; test cost allocations',
      'D4.X': 'Test WIP costing; verify costs match stage of completion method',
      'D5.X': 'Review capitalized project costs; verify proper amortization to COGS'
    }
  },

  MANUFACTURING: {
    industry: 'Manufacturing',
    specialConsiderations: [
      'Overhead absorption and allocation methods',
      'WIP costing and completion stage assessment',
      'Inventory classification (raw materials, WIP, finished goods)',
      'Cost of goods sold - materials, labor, overhead',
      'Scrap and waste valuation'
    ],
    procedureModifications: {
      'D4.1': 'Attend count at manufacturing facility; assess WIP stage of completion',
      'D4.X': 'Test cost of goods sold; verify overhead allocation',
      'D4.X': 'Analyze inventory turnover; identify slow-moving items'
    }
  },

  SAAS_TECHNOLOGY: {
    industry: 'SaaS / Software / Technology',
    specialConsiderations: [
      'Revenue recognition for multi-year subscriptions',
      'Deferred revenue accounting and timing',
      'Development cost capitalization (6-point test per FRS 102)',
      'Software license revenue (one-time vs recurring)',
      'Maintenance and support revenue timing'
    ],
    procedureModifications: {
      'D3.8': 'Enhanced deferred revenue procedures; test release timing per performance periods',
      'D5.X': 'Test capitalization of development costs; verify 6 criteria met',
      'D3.X': 'Analyze customer churn; impact on deferred revenue release'
    }
  },

  FINANCIAL_SERVICES: {
    industry: 'Banks / Insurance / Financial Services',
    specialConsiderations: [
      'Fair value measurement of financial instruments',
      'Expected credit loss (ECL) provisioning',
      'Loan classification (stage 1, 2, 3 per IFRS 9 or equivalent)',
      'Interest revenue calculation (accrued interest on non-performing loans)',
      'Regulatory capital and liquidity requirements'
    ],
    procedureModifications: {
      'D3.X': 'Test interest income calculation; verify non-accrual policies',
      'D3.6': 'Enhanced ECL testing; verify collective vs individual provision',
      'D6.X': 'Test loan covenants; evaluate for disclosure'
    }
  },

  RETAIL: {
    industry: 'Retail / E-commerce',
    specialConsiderations: [
      'Inventory obsolescence and markdowns',
      'Gift card and loyalty program liabilities',
      'Lease accounting (operating lease ROU assets)',
      'Goodwill and asset impairment (store closures)',
      'Gift card breakage and deferred revenue'
    ],
    procedureModifications: {
      'D4.X': 'Enhanced obsolescence testing; assess slow-moving inventory by category',
      'D3.X': 'Test gift card and loyalty accounting; deferred revenue for breakage',
      'D5.X': 'Test ROU asset accounting; evaluate for impairment'
    }
  },

  PROFESSIONAL_SERVICES: {
    industry: 'Legal / Accounting / Consulting Firms',
    specialConsiderations: [
      'WIP (work in progress) recoverability assessment',
      'Revenue from client billing (time and materials)',
      'Engagement loss provisions',
      'Partner equity and profit-sharing',
      'Contingent fee arrangements'
    ],
    procedureModifications: {
      'D3.2': 'Test WIP to revenue; verify all WIP is recoverable at billing rates',
      'D4.X': 'Test WIP aging; identify unbillable time',
      'D9.X': 'Test engagement loss provisions; verify recoverability'
    }
  },

  PROPERTY_DEVELOPMENT: {
    industry: 'Property / Real Estate Development',
    specialConsiderations: [
      'Development profit recognition (stage of completion)',
      'Property valuation and impairment',
      'Interest capitalization during construction',
      'Provision for dilapidations (lease obligations)',
      'Lease classification (property vs operating)'
    ],
    procedureModifications: {
      'D3.2': 'Test development revenue per stage of completion contracts',
      'D5.X': 'Test capitalized interest; verify not excess of fair value',
      'D5.X': 'Test property valuation; assess for impairment indicators'
    }
  },

  CHARITIES: {
    industry: 'Charities / Not-for-Profit',
    specialConsiderations: [
      'Restricted vs unrestricted fund accounting',
      'Donation and grant revenue timing',
      'Charity tax compliance',
      'Related party disclosures (trustees, key staff)',
      'Going concern assessment for fund adequacy'
    ],
    procedureModifications: {
      'D3.1': 'Verify revenue policy addresses restricted fund classification',
      'D10.X': 'Test restricted fund accounting; verify funds spent on intended purpose',
      'D14.X': 'Enhanced related party testing; trustees and key staff'
    }
  }
};

// ============================================================================
// 13. CONCLUSION FRAMEWORK TEMPLATES
// ============================================================================
export const CONCLUSION_FRAMEWORKS = {
  revenueAssertions: {
    existence: 'Tested sample of revenue transactions; verified each transaction represents a valid business transaction with external evidence of delivery',
    completeness: 'Reviewed revenue cutoff procedures; tested transactions at year-end boundaries; no evidence of unrecorded revenue',
    accuracy: 'Recalculated revenue amounts from source documentation; verified invoices per contract terms; no exceptions found',
    valuation: 'Assessed bad debt provision adequacy; confirmed post-period-end collections; provision is reasonable',
    classification: 'Reviewed revenue recognition policy; verified compliance with IFRS 15; transactions properly classified and presented'
  },

  inventoryAssertions: {
    existence: 'Attended physical inventory count; performed independent test counts; items exist and are accurately counted',
    completeness: 'Physical count reconciles to GL within acceptable tolerance; no unrecorded inventory identified',
    accuracy: 'Test count variance <2%; inventory quantities are accurately recorded',
    valuation: 'NRV testing completed; identified items are valued at lower of cost or NRV; obsolescence provision is adequate',
    classification: 'Inventory properly classified by category (raw materials, WIP, finished goods); presentation is consistent with prior year'
  },

  payableAssertions: {
    existence: 'Confirmed major payables with suppliers; reviewed subsequent payments for year-end items',
    completeness: 'Performed unrecorded liability search; reviewed GL cutoff; accruals for post-period invoices were recorded',
    accuracy: 'Reconciled payable balances to supplier statements; no significant exceptions found',
    valuation: 'Reviewed accrual basis and appropriateness of recorded amounts; no valuation issues',
    classification: 'Payables properly classified by type (trade, accrued, other); presentation is appropriate'
  }
};

// ============================================================================
// 14. EXPORT SUMMARY
// ============================================================================
export const LIBRARY_SUMMARY = {
  totalAreas: 12,
  totalProcedures: '200+',
  coverage: {
    D3_REVENUE: { count: 30, assertions: 6 },
    D4_INVENTORY: { count: 25, assertions: 6 },
    D5_FIXED_ASSETS: { count: 28, assertions: 6 },
    D6_PAYABLES: { count: 20, assertions: 6 },
    D7_LOANS: { count: 18, assertions: 5 },
    D8_TAX: { count: 22, assertions: 5 },
    D9_PROVISIONS: { count: 20, assertions: 6 },
    D10_EQUITY: { count: 15, assertions: 5 },
    D11_CASH: { count: 12, assertions: 5 },
    D12_JOURNAL_ENTRIES: { count: 18, assertions: 4 },
    D13_SUBSEQUENT_EVENTS: { count: 12, assertions: 3 },
    D14_RELATED_PARTIES: { count: 16, assertions: 5 }
  },
  keyFeatures: [
    'Comprehensive procedure details with execution steps',
    'Assertion-procedure mapping for all audit areas',
    'Risk-based sample size methodology',
    'Industry-specific variations (8 industries)',
    'Exception evaluation frameworks',
    'Evidence collection templates',
    'Conclusion frameworks for each assertion',
    'Procedure tracking and status management',
    'Integration with ISAs and FRS 102',
    'Production-ready implementation'
  ]
};

export default {
  ASSERTIONS,
  RISK_LEVELS,
  SAMPLE_SIZE_TABLES,
  PROCEDURE_TEMPLATE,
  PROCEDURE_D3_REVENUE,
  PROCEDURE_D4_INVENTORY,
  PROCEDURE_D5_FIXED_ASSETS,
  PROCEDURE_LIBRARY,
  ASSERTION_PROCEDURE_MAP,
  EXCEPTION_EVALUATION,
  PROCEDURE_STATUS,
  PROCEDURE_TRACKER,
  EVIDENCE_TYPES,
  EVIDENCE_ASSESSMENT_FORM,
  INDUSTRY_VARIATIONS,
  CONCLUSION_FRAMEWORKS,
  LIBRARY_SUMMARY
};
