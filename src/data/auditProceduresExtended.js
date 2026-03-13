/**
 * AUDIT PROCEDURES EXTENDED - D6 to D14
 * Complete procedures for Payables, Loans, Tax, Provisions, Equity, Cash, JEs, Events, Related Parties
 */

import {
  ASSERTIONS,
  RISK_LEVELS,
  PROCEDURE_TEMPLATE
} from './auditProcedureLibrary';

// ============================================================================
// D6: PAYABLES & ACCRUALS - 20+ PROCEDURES
// ============================================================================
export const PROCEDURE_D6_PAYABLES = [
  {
    procedureId: 'D6.1',
    area: 'PAYABLES',
    title: 'Payable Balance Reconciliation to Supplier Statements',
    description: 'Reconcile major payable balances per GL to supplier statements; investigate and resolve discrepancies.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['CLASSIFICATION'],
    riskRespond: ['Payable misstated amount', 'Unrecorded payables', 'Disputed balances'],
    populationDefinition: 'Trade payables GL account; major suppliers representing 80%+ of balance',
    sampleSize: { HIGH: '80%', MEDIUM: '50%', LOW: '25%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Supplier statements', 'GL payables account', 'Correspondence', 'Remittance advices'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain supplier statements as of year-end for major suppliers',
        expectedResult: 'Statements from key suppliers received',
        documentationLocation: 'D6.1/Supplier Statements'
      },
      {
        step: 2,
        action: 'Reconcile GL payable balance to supplier statement balance',
        expectedResult: 'Reconciliation completed; differences identified',
        documentationLocation: 'D6.1/Reconciliation'
      },
      {
        step: 3,
        action: 'Investigate differences (timing of invoices, credits not recorded, disputed invoices)',
        expectedResult: 'Reconciling items explained',
        documentationLocation: 'D6.1/Reconciling Items'
      },
      {
        step: 4,
        action: 'For significant unreconciled items: Contact supplier or obtain alternative evidence',
        expectedResult: 'Differences resolved or documented as disputed',
        documentationLocation: 'D6.1/Resolution'
      },
      {
        step: 5,
        action: 'Evaluate whether any adjustments are required',
        expectedResult: 'Conclusion: Payable balance is accurate or adjustment proposed',
        documentationLocation: 'D6.1/Conclusion'
      }
    ],

    expectedExceptions: ['In-transit items', 'Disputed invoices', 'Supplier statement disagreement'],
    exceptionHandling: {
      'In-transit': 'Document timing; evaluate whether cut-off is appropriate',
      'Disputed': 'Document dispute; assess impact on financial statements',
      'Disagreement': 'Investigate; determine if GL or supplier record is correct'
    },
    conclusionFramework: 'Payables reconcile to supplier statements; any differences are explained and evaluated',
    evaluationCriteria: '>90% reconciliation without adjustment / 80-90% with minor items / <80% significant issues',
    frsReferences: ['FRS 102 s11 - Liabilities', 'FRS 2 - Measurement basis'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 505 - Confirmations'],
    workingPaperRef: 'D6/D6.1-PayableReconciliation'
  },

  {
    procedureId: 'D6.2',
    area: 'PAYABLES',
    title: 'Unrecorded Liabilities Search - Post Year-End Vouching',
    description: 'Review post-period-end invoices and payments to identify unrecorded payables at year-end.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'CUTOFF'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Unrecorded payables at year-end', 'Expense recognition in wrong period', 'Understated liabilities'],
    populationDefinition: 'Post year-end invoices received (Jan 1 - Feb 28); payments made in Jan-Feb',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '75%' },
    testNature: 'Substantive Detail',
    timing: 'Completion',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Post-period invoices', 'GL entries', 'Delivery documentation', 'Payment records'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all invoices received in Jan-Feb period for goods/services received in December',
        expectedResult: 'Post-period invoice list prepared',
        documentationLocation: 'D6.2/Post-Period Invoices'
      },
      {
        step: 2,
        action: 'For each invoice: Verify when goods/services were received (GRN date, delivery note)',
        expectedResult: 'Receipt date documented',
        documentationLocation: 'D6.2/Receipt Dates'
      },
      {
        step: 3,
        action: 'If received before Dec 31: Verify payable was accrued as of year-end',
        expectedResult: 'All Dec receipts were accrued or explained',
        documentationLocation: 'D6.2/Accrual Verification'
      },
      {
        step: 4,
        action: 'If received after Dec 31: Verify NO accrual was recorded at year-end',
        expectedResult: 'Jan receipts were not accrued in Dec GL',
        documentationLocation: 'D6.2/Cutoff Verification'
      },
      {
        step: 5,
        action: 'Quantify any unrecorded payables; evaluate for materiality',
        expectedResult: 'Exceptions quantified; adjustment proposed if material',
        documentationLocation: 'D6.2/Exception Summary'
      }
    ],

    expectedExceptions: ['Unrecorded payable for Dec receipt', 'Accrued payable for Jan receipt'],
    exceptionHandling: {
      'Unrecorded Dec receipt': 'Propose accrual adjustment at year-end',
      'Accrued Jan receipt': 'Propose reversal of accrual; record in next period',
      'Material omission': 'Evaluate for control deficiency; discuss with management'
    },
    conclusionFramework: 'Post year-end procedures completed; all identified unrecorded liabilities are recorded or evaluated',
    evaluationCriteria: 'No exceptions / Minor exceptions <0.5% of payables / Significant exceptions ≥0.5%',
    frsReferences: ['FRS 102 s2 - Accrual basis and cutoff'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 560 - Subsequent Events'],
    workingPaperRef: 'D6/D6.2-UnrecordedLiabilities'
  },

  {
    procedureId: 'D6.3',
    area: 'PAYABLES',
    title: 'Payables Cutoff Testing - GRNI Accruals',
    description: 'Test GRNI (Goods Received Not Invoiced) accruals; verify items are properly accrued based on receipt date.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'CUTOFF'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Goods in transit not accrued', 'Incorrect cutoff on GRN', 'GRNI provision inadequate'],
    populationDefinition: 'Goods received in final 10 days of period (Dec 22-31) not yet invoiced',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['GRN log', 'Accrual schedule', 'Invoices received post-period', 'Delivery notes'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain list of GRNs issued in final 10 days of period',
        expectedResult: 'GRN list prepared by date',
        documentationLocation: 'D6.3/GRN List'
      },
      {
        step: 2,
        action: 'Verify for each GRN: Invoice has NOT been received as of year-end (GRNI status)',
        expectedResult: 'All listed items are truly not invoiced',
        documentationLocation: 'D6.3/Invoice Status'
      },
      {
        step: 3,
        action: 'Verify GRN-related accrual was recorded (amount estimated based on PO or invoice received post-period)',
        expectedResult: 'GRNI accrual exists for each GRN',
        documentationLocation: 'D6.3/Accrual Verification'
      },
      {
        step: 4,
        action: 'Verify accrual amount is reasonable (compare to subsequent invoice amount)',
        expectedResult: 'Accrual amount is accurate or minor variance explained',
        documentationLocation: 'D6.3/Amount Verification'
      },
      {
        step: 5,
        action: 'Review post-period-end GRNs received before invoices (Jan-Feb); verify no accruals should have been recorded',
        expectedResult: 'Cutoff is accurate',
        documentationLocation: 'D6.3/Post-Period GRNs'
      }
    ],

    expectedExceptions: ['Invoiced item in GRNI', 'Missing accrual for GRN', 'Accrual amount incorrect'],
    exceptionHandling: {
      'Invoiced': 'Remove from GRNI; record as payable',
      'Missing accrual': 'Propose accrual adjustment',
      'Amount variance': 'Propose correction if variance >£threshold'
    },
    conclusionFramework: 'GRNI accruals are complete and accurate; cutoff is appropriate',
    evaluationCriteria: 'No exceptions / Minor exceptions <1% / Significant omissions ≥1%',
    frsReferences: ['FRS 102 s2 - Cutoff and accrual basis'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D6/D6.3-GRNICutoff'
  }

  // Continue with D6.4-D6.20 (accrual testing, intercompany reconciliation, etc.)
];

// ============================================================================
// D7: LOANS & COVENANTS - 18+ PROCEDURES
// ============================================================================
export const PROCEDURE_D7_LOANS = [
  {
    procedureId: 'D7.1',
    area: 'LOANS',
    title: 'Bank Confirmation and Loan Terms Verification',
    description: 'Obtain bank confirmation letters for all borrowing accounts; verify loan amounts, interest rates, terms, and covenant requirements.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['VALUATION', 'RIGHTS_OBLIGATIONS'],
    riskRespond: ['Unrecorded loans', 'Loan amount misstatement', 'Unknown covenants'],
    populationDefinition: 'All bank accounts with loan facilities; loan register',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - bank confirmation administration'],
    evidenceType: ['Bank confirmation letters', 'Loan agreements', 'GL loan account', 'Payment records'],

    executionSteps: [
      {
        step: 1,
        action: 'Request bank confirmations for all loan facilities (direct from auditor to bank)',
        expectedResult: 'Bank confirmations received for all accounts',
        documentationLocation: 'D7.1/Bank Confirmations'
      },
      {
        step: 2,
        action: 'Reconcile confirmed loan amount to GL balance',
        expectedResult: 'Balance confirmed; any differences explained',
        documentationLocation: 'D7.1/Reconciliation'
      },
      {
        step: 3,
        action: 'Obtain current loan agreements; verify terms match bank confirmation (interest rate, maturity, repayment schedule)',
        expectedResult: 'Loan terms documented and verified',
        documentationLocation: 'D7.1/Loan Terms'
      },
      {
        step: 4,
        action: 'Identify covenant requirements from loan agreements (LTV, interest cover, leverage ratios, etc.)',
        expectedResult: 'Covenants identified and documented',
        documentationLocation: 'D7.1/Covenants'
      },
      {
        step: 5,
        action: 'Verify no unrecorded loan facilities exist (from bank confirmation)',
        expectedResult: 'All loan facilities recorded in GL',
        documentationLocation: 'D7.1/Completeness'
      }
    ],

    expectedExceptions: ['Confirmation discrepancy', 'Unrecorded facility', 'Covenant non-compliance'],
    exceptionHandling: {
      'Discrepancy': 'Investigate; propose GL adjustment if needed',
      'Unrecorded': 'Propose loan accrual; evaluate for disclosure',
      'Non-compliance': 'See D7.X covenant testing'
    },
    conclusionFramework: 'All loan facilities confirmed; terms are verified; no unrecorded obligations',
    evaluationCriteria: 'All confirmations received and reconciled / All loan terms verified',
    frsReferences: ['FRS 102 s11 - Borrowings', 'FRS 102 s1A.10-1A.14 - Disclosures'],
    isaReferences: ['ISA 505 - External Confirmations', 'ISA 500 - Evidence'],
    workingPaperRef: 'D7/D7.1-BankConfirmation'
  },

  {
    procedureId: 'D7.2',
    area: 'LOANS',
    title: 'Interest Expense Recalculation and Accrual Verification',
    description: 'Recalculate interest expense for all loans; verify accrued interest at year-end is accurate.',
    assertions: ['ACCURACY', 'COMPLETENESS', 'VALUATION'],
    secondaryAssertions: ['CUTOFF'],
    riskRespond: ['Interest miscalculated', 'Interest not accrued', 'Finance charges not recorded'],
    populationDefinition: 'All loans with interest; interest expense GL account',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Loan agreements (interest rate terms)', 'Bank statements', 'Interest calculation', 'GL entries', 'Accrual schedule'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain schedule of all loans with interest rates, maturity dates, payment schedules',
        expectedResult: 'Loan schedule prepared',
        documentationLocation: 'D7.2/Loan Schedule'
      },
      {
        step: 2,
        action: 'For each loan: Recalculate interest expense = Principal × Rate × Time',
        expectedResult: 'Interest calculation verified',
        documentationLocation: 'D7.2/Interest Calculation'
      },
      {
        step: 3,
        action: 'Reconcile calculated interest to GL interest expense',
        expectedResult: 'Reconciliation completed; variances investigated',
        documentationLocation: 'D7.2/Reconciliation'
      },
      {
        step: 4,
        action: 'Verify accrued interest at year-end (from last payment date to Dec 31)',
        expectedResult: 'Accrued interest amount is accurate',
        documentationLocation: 'D7.2/Accrual'
      },
      {
        step: 5,
        action: 'Review bank statement for any unrecorded interest charges (monthly statements)',
        expectedResult: 'All interest charges are recorded',
        documentationLocation: 'D7.2/Bank Statement Review'
      },
      {
        step: 6,
        action: 'Verify no loan origination fees or other financing costs were capitalized (unless appropriate)',
        expectedResult: 'Finance costs properly classified',
        documentationLocation: 'D7.2/Finance Costs'
      }
    ],

    expectedExceptions: ['Interest rate changed during year', 'Accrual amount incorrect', 'Unrecorded interest charge'],
    exceptionHandling: {
      'Rate change': 'Investigate; verify policy; recalculate interest',
      'Accrual error': 'Propose correction',
      'Unrecorded charge': 'Propose accrual; evaluate for materiality'
    },
    conclusionFramework: 'Interest expense is accurately calculated and completely accrued',
    evaluationCriteria: 'No exceptions / Minor exceptions <1% / Significant exceptions ≥1%',
    frsReferences: ['FRS 102 s2 - Finance costs', 'FRS 102 s11 - Borrowing costs'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D7/D7.2-InterestExpense'
  },

  {
    procedureId: 'D7.3',
    area: 'LOANS',
    title: 'Loan Covenant Compliance Testing',
    description: 'Calculate financial ratios required under loan covenants; verify compliance at year-end; assess for disclosure.',
    assertions: ['ACCURACY', 'VALUATION', 'COMPLETENESS'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Covenant breach', 'Going concern implications', 'Non-disclosure of covenant violation'],
    populationDefinition: 'All loan covenants per loan agreements',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - financial analysis', 'Senior accountant'],
    evidenceType: ['Loan agreements', 'Financial statements', 'Covenant calculations', 'Bank correspondence', 'Management representations'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain loan agreements for all facilities; identify all covenant requirements (e.g., LTV, interest cover, leverage)',
        expectedResult: 'Covenants extracted and listed',
        documentationLocation: 'D7.3/Covenant Schedule'
      },
      {
        step: 2,
        action: 'For each covenant: Identify the calculation methodology and measurement date (typically year-end)',
        expectedResult: 'Covenant calculation basis documented',
        documentationLocation: 'D7.3/Calculation Methodology'
      },
      {
        step: 3,
        action: 'Using audited financial statements: Calculate each covenant ratio',
        expectedResult: 'All covenant ratios calculated',
        documentationLocation: 'D7.3/Covenant Calculations'
      },
      {
        step: 4,
        action: 'Compare calculated ratios to covenant thresholds; identify breaches or near-misses',
        expectedResult: 'Compliance status determined for each covenant',
        documentationLocation: 'D7.3/Compliance Assessment'
      },
      {
        step: 5,
        action: 'For any breaches: Obtain evidence of lender waiver or amendment agreement',
        expectedResult: 'Breach resolution documented',
        documentationLocation: 'D7.3/Waivers'
      },
      {
        step: 6,
        action: 'Evaluate whether covenant breach or near-miss indicates going concern risk (see D11.X)',
        expectedResult: 'Impact on going concern assessment noted',
        documentationLocation: 'D7.3/Going Concern Impact'
      },
      {
        step: 7,
        action: 'Verify disclosure of covenant status in financial statement notes',
        expectedResult: 'Disclosure is appropriate (breach, waiver, compliance)',
        documentationLocation: 'D7.3/Disclosure'
      }
    ],

    expectedExceptions: ['Covenant breach', 'Covenant not disclosed', 'Waiver not documented'],
    exceptionHandling: {
      'Breach': 'Evaluate impact on financial statements; assess going concern; ensure disclosure',
      'Non-disclosure': 'Propose disclosure in notes',
      'Missing waiver': 'Obtain evidence of waiver or assess impact on classification of loan'
    },
    conclusionFramework: 'Covenant compliance verified; any breaches are appropriately disclosed and evaluated',
    evaluationCriteria: 'Full compliance / Minor near-miss with management explanation / Breach with waiver / Breach without waiver (significant)',
    frsReferences: ['FRS 102 s1A.10 - Debt covenants', 'FRS 102 s20 - Contingent liabilities'],
    isaReferences: ['ISA 540 - Estimates', 'ISA 570 - Going Concern'],
    workingPaperRef: 'D7/D7.3-CovenantCompliance'
  }

  // Continue with D7.4-D7.18 (principal repayment schedule, related party loans, security verification, etc.)
];

// ============================================================================
// D8: TAX - 22+ PROCEDURES
// ============================================================================
export const PROCEDURE_D8_TAX = [
  {
    procedureId: 'D8.1',
    area: 'TAX',
    title: 'Corporation Tax Computation Verification',
    description: 'Obtain tax computation; verify profit before tax reconciliation; test tax rate applied and deductions claimed.',
    assertions: ['ACCURACY', 'COMPLETENESS', 'VALUATION'],
    secondaryAssertions: ['CLASSIFICATION'],
    riskRespond: ['Tax provision misstated', 'Non-deductible items allowed', 'Tax rate incorrect'],
    populationDefinition: 'Tax computation for current year; tax GL account; profit before tax',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - tax specialist or external tax advisor'],
    evidenceType: ['Tax computation', 'GL profit & loss', 'Tax returns', 'Non-deductible item analysis'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain prepared tax computation from client or accountant',
        expectedResult: 'Tax computation obtained',
        documentationLocation: 'D8.1/Tax Computation'
      },
      {
        step: 2,
        action: 'Reconcile starting profit (per financial statements) to taxable profit',
        expectedResult: 'Reconciliation shows all adjustments',
        documentationLocation: 'D8.1/PBT Reconciliation'
      },
      {
        step: 3,
        action: 'Review non-deductible items: Identify expenses not allowable for tax (entertaining, depreciation, provisions)',
        expectedResult: 'Non-deductible items are correct',
        documentationLocation: 'D8.1/Non-Deductible Items'
      },
      {
        step: 4,
        action: 'Verify tax rate applied (corporate tax rate per jurisdiction for relevant year)',
        expectedResult: 'Tax rate is current and correct',
        documentationLocation: 'D8.1/Tax Rate'
      },
      {
        step: 5,
        action: 'Verify capital allowances calculations (AIA, SBA if applicable)',
        expectedResult: 'Capital allowances are correctly claimed',
        documentationLocation: 'D8.1/Capital Allowances'
      },
      {
        step: 6,
        action: 'Verify no disallowed items are included in taxable profit',
        expectedResult: 'Disallowed items assessment is complete',
        documentationLocation: 'D8.1/Disallowed Items'
      },
      {
        step: 7,
        action: 'Reconcile computed tax provision to GL tax expense; investigate variances',
        expectedResult: 'Tax expense reconciled',
        documentationLocation: 'D8.1/GL Reconciliation'
      }
    ],

    expectedExceptions: ['Non-deductible item incorrectly allowed', 'Tax rate outdated', 'Capital allowance error'],
    exceptionHandling: {
      'Non-deductible allowed': 'Propose adjustment to taxable profit; propose tax provision increase',
      'Rate error': 'Propose correction; recalculate tax',
      'CA error': 'Propose correction; recalculate tax'
    },
    conclusionFramework: 'Tax computation is accurate; tax provision is adequate and appropriately provided',
    evaluationCriteria: 'No exceptions / Minor exceptions <£5k / Significant exceptions ≥£5k',
    frsReferences: ['FRS 102 s29 - Income Tax'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 540 - Estimates'],
    workingPaperRef: 'D8/D8.1-TaxComputation'
  },

  {
    procedureId: 'D8.2',
    area: 'TAX',
    title: 'Deferred Tax - Timing Differences and Loss Carry-forwards',
    description: 'Assess temporary timing differences; evaluate deferred tax provision adequacy; review loss carry-forward recoverability.',
    assertions: ['VALUATION', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Deferred tax not provided', 'Deferred tax asset overvalued', 'Loss carry-forward recovery uncertain'],
    populationDefinition: 'Deferred tax account; all timing differences; tax loss position',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - tax specialist'],
    evidenceType: ['Deferred tax schedule', 'Tax computation', 'Forecast', 'Prior year tax returns', 'Profit projections'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all significant timing differences (depreciation, provisions, accruals)',
        expectedResult: 'Timing differences listed',
        documentationLocation: 'D8.2/Timing Differences'
      },
      {
        step: 2,
        action: 'For each timing difference: Calculate deferred tax asset/liability (temporary difference × tax rate)',
        expectedResult: 'DT calculations completed',
        documentationLocation: 'D8.2/DT Calculations'
      },
      {
        step: 3,
        action: 'Assess whether DT asset is recoverable (will entity have sufficient future taxable profits?)',
        expectedResult: 'Recoverability assessment documented',
        documentationLocation: 'D8.2/Recoverability'
      },
      {
        step: 4,
        action: 'If tax loss carry-forwards exist: Verify recoverability per FRS 102 (recovery within what timeframe?)',
        expectedResult: 'Loss asset is appropriately recognized or provided against',
        documentationLocation: 'D8.2/Loss Carry-forwards'
      },
      {
        step: 5,
        action: 'Reconcile DT balance sheet account to calculation; verify GL posting',
        expectedResult: 'DT reconciled to GL',
        documentationLocation: 'D8.2/GL Reconciliation'
      },
      {
        step: 6,
        action: 'Evaluate whether disclosure is adequate per FRS 102 (deferred tax asset/liability by type)',
        expectedResult: 'Disclosure checklist completed',
        documentationLocation: 'D8.2/Disclosure'
      }
    ],

    expectedExceptions: ['Deferred tax asset not provided', 'Unrecoverable loss carry-forward capitalized', 'DT calculation error'],
    exceptionHandling: {
      'Missing DT': 'Propose recognition or clarify non-recognition rationale',
      'Unrecoverable': 'Propose valuation allowance',
      'Calc error': 'Propose correction'
    },
    conclusionFramework: 'Deferred tax is appropriately valued; all timing differences are recognized; loss carry-forwards are assessed for recoverability',
    evaluationCriteria: 'DT appropriately provided / DT calculation within 2% variance / DT material understatement',
    frsReferences: ['FRS 102 s29 - Income Tax (deferred tax)'],
    isaReferences: ['ISA 540 - Estimates'],
    workingPaperRef: 'D8/D8.2-DeferredTax'
  }

  // Continue with D8.3-D8.22 (prior year assessments, R&D credits, transfer pricing, uncertain tax positions, etc.)
];

// ============================================================================
// D9: PROVISIONS - 20+ PROCEDURES
// ============================================================================
export const PROCEDURE_D9_PROVISIONS = [
  {
    procedureId: 'D9.1',
    area: 'PROVISIONS',
    title: 'Warranty Provision - Claims Analysis and Cost Assessment',
    description: 'Review warranty claims history; analyze warranty costs; assess provision adequacy per FRS 102.',
    assertions: ['VALUATION', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Warranty provision understated', 'Warranty claims not provided', 'Excessive provision'],
    populationDefinition: 'Warranty provision GL account; warranty claims received during year and post-period',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Senior accountant', 'Operations/customer service review'],
    evidenceType: ['Warranty claims history', 'Cost analysis', 'Product sales by type', 'Industry benchmarks', 'Warranty policy'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain warranty claims received during current year; analyze by type and cost',
        expectedResult: 'Claims history prepared',
        documentationLocation: 'D9.1/Claims History'
      },
      {
        step: 2,
        action: 'Analyze warranty costs as % of product sales (by product line if applicable)',
        expectedResult: 'Historical warranty cost rate calculated',
        documentationLocation: 'D9.1/Cost Analysis'
      },
      {
        step: 3,
        action: 'Identify any new products or changes in product quality affecting warranty',
        expectedResult: 'Changes documented; impact on provision assessed',
        documentationLocation: 'D9.1/Changes'
      },
      {
        step: 4,
        action: 'Obtain current warranty policy (coverage period, scope, exclusions)',
        expectedResult: 'Warranty policy documented',
        documentationLocation: 'D9.1/Policy'
      },
      {
        step: 5,
        action: 'Identify all products sold in period still under warranty at year-end',
        expectedResult: 'In-warranty product population identified',
        documentationLocation: 'D9.1/In-Warranty'
      },
      {
        step: 6,
        action: 'Calculate provision = In-warranty sales × Historical warranty cost rate',
        expectedResult: 'Provision calculated',
        documentationLocation: 'D9.1/Provision Calc'
      },
      {
        step: 7,
        action: 'Review actual claims paid post-period (Jan-Feb); assess against provision',
        expectedResult: 'Provision adequacy assessed',
        documentationLocation: 'D9.1/Post-Period Claims'
      },
      {
        step: 8,
        action: 'Evaluate whether provision is adequate per FRS 102 s21 (obligation exists; probable cost)',
        expectedResult: 'Conclusion on provision adequacy',
        documentationLocation: 'D9.1/Conclusion'
      }
    ],

    expectedExceptions: ['Warranty cost rate changed', 'New product not accounted for', 'Provision understated'],
    exceptionHandling: {
      'Rate change': 'Document reason; recalculate provision',
      'New product': 'Estimate warranty rate; adjust provision',
      'Understatement': 'Propose increase to provision'
    },
    conclusionFramework: 'Warranty provision is adequate under FRS 102; covers expected warranty costs for products under warranty',
    evaluationCriteria: 'Provision within 10% of historical rate / 10-20% variance (investigate) / >20% variance (adjust)',
    frsReferences: ['FRS 102 s21 - Provisions'],
    isaReferences: ['ISA 540 - Estimates'],
    workingPaperRef: 'D9/D9.1-WarrantyProvision'
  },

  {
    procedureId: 'D9.2',
    area: 'PROVISIONS',
    title: 'Legal Provisions - Solicitor Letters and Litigation Assessment',
    description: 'Obtain solicitor letters for pending litigation; assess provision adequacy; verify disclosure.',
    assertions: ['VALUATION', 'COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['CLASSIFICATION'],
    riskRespond: ['Legal provision understatement', 'Unrecorded legal liability', 'Litigation risk not disclosed'],
    populationDefinition: 'Legal proceedings; solicitor correspondence; litigation provisions',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final & Completion',
    resourcesRequired: ['Manager - in-house counsel review'],
    evidenceType: ['Solicitor letters (ISA 580)', 'Litigation documentation', 'Court filings', 'Legal cost estimates', 'Insurance correspondence'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all pending litigation, claims, and legal proceedings',
        expectedResult: 'Litigation list prepared',
        documentationLocation: 'D9.2/Litigation List'
      },
      {
        step: 2,
        action: 'Request solicitor letters (ISA 580) directly to auditor for each matter',
        expectedResult: 'Solicitor letters received',
        documentationLocation: 'D9.2/Solicitor Letters'
      },
      {
        step: 3,
        action: 'For each matter: Assess probability of loss (probable, possible, remote) per FRS 102',
        expectedResult: 'Probability assessment documented',
        documentationLocation: 'D9.2/Probability'
      },
      {
        step: 4,
        action: 'If probable: Estimate amount of loss per solicitor estimate or legal assessment',
        expectedResult: 'Loss estimate calculated',
        documentationLocation: 'D9.2/Loss Estimate'
      },
      {
        step: 5,
        action: 'Verify provision was recorded for probable losses per FRS 102 s21 criteria',
        expectedResult: 'All probable liabilities provided for',
        documentationLocation: 'D9.2/Provision Assessment'
      },
      {
        step: 6,
        action: 'For possible liabilities: Verify disclosed as contingent liability (not provided)',
        expectedResult: 'Possible liabilities are properly classified',
        documentationLocation: 'D9.2/Contingent'
      },
      {
        step: 7,
        action: 'Review disclosure in notes per FRS 102 (nature, estimate, uncertainty)',
        expectedResult: 'Disclosure is adequate',
        documentationLocation: 'D9.2/Disclosure'
      },
      {
        step: 8,
        action: 'Evaluate insurance recoverability (is there insurance coverage that offsets liability?)',
        expectedResult: 'Net provision amount is accurate',
        documentationLocation: 'D9.2/Insurance'
      }
    ],

    expectedExceptions: ['Provision not recorded for probable loss', 'Possible loss not disclosed', 'Insurance not considered'],
    exceptionHandling: {
      'Missing provision': 'Propose accrual for probable loss',
      'Non-disclosure': 'Propose contingent liability disclosure',
      'Insurance': 'Assess net presentation; may require separate receivable'
    },
    conclusionFramework: 'Legal provisions are adequate; all probable losses are provided; possible losses are disclosed as contingencies',
    evaluationCriteria: 'Full compliance with FRS 102 / Minor disclosure adjustment / Significant under-provisioning',
    frsReferences: ['FRS 102 s21 - Provisions', 'FRS 102 s1A.20 - Contingent Liabilities'],
    isaReferences: ['ISA 580 - Written Representations (solicitor letters)', 'ISA 540 - Estimates'],
    workingPaperRef: 'D9/D9.2-LegalProvisions'
  }

  // Continue with D9.3-D9.20 (dilapidations, environmental, onerous contracts, provision utilization, etc.)
];

// ============================================================================
// D10: EQUITY - 15+ PROCEDURES
// ============================================================================
export const PROCEDURE_D10_EQUITY = [
  {
    procedureId: 'D10.1',
    area: 'EQUITY',
    title: 'Share Capital and Share Premium - Movements and Authorization',
    description: 'Review share capital account; verify any share issues are authorized and properly recorded.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['CLASSIFICATION', 'RIGHTS_OBLIGATIONS'],
    riskRespond: ['Unauthorized share issue', 'Share capital misstated', 'Share premium classification error'],
    populationDefinition: 'Share capital account; share premium account; share register',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Planning & Final',
    resourcesRequired: ['Senior accountant', 'Company secretarial review'],
    evidenceType: ['Articles of Association', 'Board minutes', 'Share register', 'Bank confirmations', 'GL entries'],

    executionSteps: [
      {
        step: 1,
        action: 'Reconcile share capital and share premium accounts to opening balances; identify any movements',
        expectedResult: 'Reconciliation prepared',
        documentationLocation: 'D10.1/Reconciliation'
      },
      {
        step: 2,
        action: 'For any share issues during year: Obtain board/shareholder authorization (minutes, resolutions)',
        expectedResult: 'Authorization documented',
        documentationLocation: 'D10.1/Authorization'
      },
      {
        step: 3,
        action: 'Verify share issue terms (number of shares, issue price) per board resolution',
        expectedResult: 'Share terms documented',
        documentationLocation: 'D10.1/Terms'
      },
      {
        step: 4,
        action: 'Verify cash received for share issue per bank confirmation',
        expectedResult: 'Cash receipt confirmed',
        documentationLocation: 'D10.1/Cash'
      },
      {
        step: 5,
        action: 'Verify GL recording: Debit bank, Credit share capital (nominal value), Credit share premium (excess)',
        expectedResult: 'GL entries are accurate',
        documentationLocation: 'D10.1/GL Entries'
      },
      {
        step: 6,
        action: 'Verify share register is updated per board authorization',
        expectedResult: 'Share register reflects all movements',
        documentationLocation: 'D10.1/Share Register'
      },
      {
        step: 7,
        action: 'Verify disclosures in notes (authorized capital, issued capital, share premium)',
        expectedResult: 'Disclosure is complete per FRS 102',
        documentationLocation: 'D10.1/Disclosure'
      }
    ],

    expectedExceptions: ['Unauthorized share issue', 'Share recording incorrect', 'Disclosure incomplete'],
    exceptionHandling: {
      'Unauthorized': 'Evaluate if issue is valid; escalate to management/board',
      'Recording error': 'Propose GL correction',
      'Disclosure': 'Propose note adjustment'
    },
    conclusionFramework: 'Share capital and premium movements are authorized, properly recorded, and disclosed',
    evaluationCriteria: 'All movements authorized and recorded / Minor disclosure adjustment / Significant authorization issue',
    frsReferences: ['FRS 102 s4 - Financial position (equity)'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D10/D10.1-ShareCapital'
  },

  {
    procedureId: 'D10.2',
    area: 'EQUITY',
    title: 'Dividend Legality - Distributable Reserves Assessment',
    description: 'Verify dividends paid are within distributable reserves per Companies Act; assess going concern.',
    assertions: ['ACCURACY', 'COMPLETENESS', 'VALUATION'],
    secondaryAssertions: ['EXISTENCE'],
    riskRespond: ['Dividend paid from capital', 'Breach of Companies Act', 'Going concern issue'],
    populationDefinition: 'Dividend account; retained earnings; distributable reserves',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - legal/company secretarial', 'Finance director'],
    evidenceType: ['Board minutes (dividend declarations)', 'Distributable reserves calculation', 'Bank confirmations', 'Companies House filings'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all dividends paid or proposed during year; obtain board authorization',
        expectedResult: 'Dividend schedule with authorization prepared',
        documentationLocation: 'D10.2/Dividend Schedule'
      },
      {
        step: 2,
        action: 'Calculate distributable reserves = Profit for year + Retained earnings - Accumulated losses',
        expectedResult: 'Distributable reserves calculated',
        documentationLocation: 'D10.2/Distributable Reserves'
      },
      {
        step: 3,
        action: 'Verify total dividends paid ≤ distributable reserves per Companies Act s830',
        expectedResult: 'Dividend legality confirmed or non-compliance identified',
        documentationLocation: 'D10.2/Legality Assessment'
      },
      {
        step: 4,
        action: 'If dividend exceeds distributable reserves: Assess whether director solvency statement prepared',
        expectedResult: 'Solvency assessment documented',
        documentationLocation: 'D10.2/Solvency'
      },
      {
        step: 5,
        action: 'Verify dividend payment per bank confirmation (amount, date paid)',
        expectedResult: 'Dividend payment confirmed',
        documentationLocation: 'D10.2/Payment'
      },
      {
        step: 6,
        action: 'Evaluate whether dividend payment affects going concern (liquidity impact)',
        expectedResult: 'Going concern implication assessed',
        documentationLocation: 'D10.2/Going Concern'
      },
      {
        step: 7,
        action: 'Verify disclosure of dividend in GL and notes',
        expectedResult: 'Dividend disclosure is complete',
        documentationLocation: 'D10.2/Disclosure'
      }
    ],

    expectedExceptions: ['Dividend exceeds distributable reserves', 'Dividend not authorized', 'Payment not made'],
    exceptionHandling: {
      'Exceeds reserves': 'Determine if solvency statement exists; if not, propose dividend reversal',
      'Not authorized': 'Recommend board authorization or reversal',
      'Not paid': 'Verify accrual is recorded'
    },
    conclusionFramework: 'Dividends are within distributable reserves per Companies Act; payment is authorized and confirmed',
    evaluationCriteria: 'Full legal compliance / Minor authorization issue easily resolved / Significant breach of Companies Act',
    frsReferences: ['FRS 102 s4 - Equity transactions', 'Companies Act s830 - Distributable reserves'],
    isaReferences: ['ISA 500 - Evidence', 'ISA 570 - Going Concern'],
    workingPaperRef: 'D10/D10.2-DividendLegality'
  }

  // Continue with D10.3-D10.15 (reserves analysis, treasury shares, share-based payments, etc.)
];

// ============================================================================
// D11: CASH - 12+ PROCEDURES
// ============================================================================
export const PROCEDURE_D11_CASH = [
  {
    procedureId: 'D11.1',
    area: 'CASH',
    title: 'Bank Confirmations - All Accounts and Account Verification',
    description: 'Obtain bank confirmations for all bank accounts (current, savings, deposit, foreign); verify balances and account existence.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['RIGHTS_OBLIGATIONS'],
    riskRespond: ['Bank account misstatement', 'Unrecorded bank account', 'False bank balance'],
    populationDefinition: 'All bank accounts held by entity; cash GL account',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Manager - bank confirmations'],
    evidenceType: ['Bank confirmations (ISA 505)', 'Bank statements', 'GL cash account', 'Bank reconciliation'],

    executionSteps: [
      {
        step: 1,
        action: 'Identify all bank accounts held by entity (checking, savings, deposit, overdraft, foreign currency)',
        expectedResult: 'Complete bank account list prepared',
        documentationLocation: 'D11.1/Account List'
      },
      {
        step: 2,
        action: 'Send bank confirmation requests directly to banks (not through client)',
        expectedResult: 'Bank confirmations sent and tracked',
        documentationLocation: 'D11.1/Confirmations'
      },
      {
        step: 3,
        action: 'Receive confirmations; verify: (a) account exists; (b) balance agrees to GL; (c) authorized signatories',
        expectedResult: 'All confirmations reconciled to GL',
        documentationLocation: 'D11.1/Reconciliation'
      },
      {
        step: 4,
        action: 'Investigate any discrepancies (timing, unrecorded account)',
        expectedResult: 'Discrepancies explained',
        documentationLocation: 'D11.1/Exceptions'
      },
      {
        step: 5,
        action: 'Verify all accounts on bank confirmation are on GL (completeness of GL)',
        expectedResult: 'No unrecorded accounts identified',
        documentationLocation: 'D11.1/Completeness'
      },
      {
        step: 6,
        action: 'Verify no accounts on GL are not confirmed (all accounts have confirmation)',
        expectedResult: 'All GL accounts confirmed',
        documentationLocation: 'D11.1/GL Coverage'
      }
    ],

    expectedExceptions: ['Unrecorded bank account', 'Confirmation discrepancy', 'Non-response from bank'],
    exceptionHandling: {
      'Unrecorded': 'Propose GL entry to record account balance',
      'Discrepancy': 'Investigate; propose correction',
      'Non-response': 'Perform alternative procedures (bank statements, subsequent reconciliation)'
    },
    conclusionFramework: 'All bank accounts confirmed; no unrecorded accounts; balances are accurate',
    evaluationCriteria: 'All confirmations received and reconciled / Minor timing differences explained / Significant issues requiring adjustment',
    frsReferences: ['FRS 102 s11 - Cash and cash equivalents'],
    isaReferences: ['ISA 505 - External Confirmations', 'ISA 500 - Evidence'],
    workingPaperRef: 'D11/D11.1-BankConfirmation'
  },

  {
    procedureId: 'D11.2',
    area: 'CASH',
    title: 'Bank Reconciliation Verification',
    description: 'Review and verify bank reconciliation for all accounts; resolve outstanding items; assess reconciliation control.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS'],
    secondaryAssertions: ['CUTOFF'],
    riskRespond: ['Stale reconciling items', 'Bank error not investigated', 'GL/bank balance misstatement'],
    populationDefinition: 'Bank reconciliation for each bank account',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Senior accountant'],
    evidenceType: ['Bank reconciliation', 'Bank statement', 'GL cash account', 'Subsequent statements', 'Reconciling item documentation'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain bank reconciliation for year-end; verify arithmetical accuracy',
        expectedResult: 'Reconciliation is mathematically correct',
        documentationLocation: 'D11.2/Reconciliation'
      },
      {
        step: 2,
        action: 'Verify: Bank balance per statement + Deposits in transit - Outstanding checks = GL balance',
        expectedResult: 'Reconciliation formula verified',
        documentationLocation: 'D11.2/Verification'
      },
      {
        step: 3,
        action: 'Identify all reconciling items (outstanding checks, deposits in transit); list and verify',
        expectedResult: 'Reconciling items documented',
        documentationLocation: 'D11.2/Reconciling Items'
      },
      {
        step: 4,
        action: 'Review outstanding checks >30 days old; verify if they should be written off as stale (not cleared)',
        expectedResult: 'Stale check assessment completed',
        documentationLocation: 'D11.2/Stale Items'
      },
      {
        step: 5,
        action: 'Trace reconciling items to subsequent bank statements (Jan-Feb); verify they clear as expected',
        expectedResult: 'Outstanding items clear in expected timeframe',
        documentationLocation: 'D11.2/Subsequent Clearing'
      },
      {
        step: 6,
        action: 'Investigate any items that don\'t clear in subsequent statements (unusual items)',
        expectedResult: 'Unusual items explained',
        documentationLocation: 'D11.2/Unusual Items'
      },
      {
        step: 7,
        action: 'Assess bank reconciliation as a control (frequency, review, authorization)',
        expectedResult: 'Control assessment documented',
        documentationLocation: 'D11.2/Control'
      }
    ],

    expectedExceptions: ['Outstanding check not cleared', 'Deposit in transit very old', 'Unusual/unexplained item'],
    exceptionHandling: {
      'Stale check': 'Propose write-off if appropriate; investigate',
      'Old deposit': 'Investigate; may be deposit in transit to wrong account',
      'Unusual': 'Obtain explanation; document'
    },
    conclusionFramework: 'Bank reconciliation is accurate; all reconciling items are appropriate and subsequently clear',
    evaluationCriteria: 'Clean reconciliation / Minor stale items easily resolved / Significant outstanding items not clearing',
    frsReferences: ['FRS 102 s11 - Cash'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D11/D11.2-BankReconciliation'
  }

  // Continue with D11.3-D11.12 (multi-currency translation, CASS compliance, restricted cash, etc.)
];

// ============================================================================
// D12: JOURNAL ENTRIES - 18+ PROCEDURES
// ============================================================================
export const PROCEDURE_D12_ENTRIES = [
  {
    procedureId: 'D12.1',
    area: 'JOURNAL ENTRIES',
    title: 'Unusual and Post-Close Journal Entries - Identification and Testing',
    description: 'Identify unusual JEs and post-close entries; test for authorization, appropriateness, and business rationale.',
    assertions: ['EXISTENCE', 'ACCURACY', 'COMPLETENESS', 'CLASSIFICATION'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Fraudulent JE', 'Unauthorized adjustment', 'Management override', 'Cutoff misstatement'],
    populationDefinition: 'All JEs in GL; post-close entries; entries above £XXk threshold',
    sampleSize: { HIGH: '75%', MEDIUM: '50%', LOW: '25%' },
    testNature: 'Substantive Detail',
    timing: 'Final & Completion',
    resourcesRequired: ['Senior accountant / Manager - JE review'],
    evidenceType: ['GL printout filtered by unusual criteria', 'JE forms/documentation', 'Approvals', 'Supporting documents'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain GL listing of all JEs; identify unusual/suspicious criteria: (1) large amount, (2) reversed JEs, (3) journal clearing accounts, (4) post-close entries, (5) manual JEs, (6) entities rarely used',
        expectedResult: 'Filtered JE listing prepared',
        documentationLocation: 'D12.1/JE Filter'
      },
      {
        step: 2,
        action: 'Stratify filtered JEs by risk; sample high-risk items 100%, medium-risk 50%, low-risk 25%',
        expectedResult: 'Risk-based sample selected',
        documentationLocation: 'D12.1/Sample'
      },
      {
        step: 3,
        action: 'For each sample JE: Identify preparer, approver, date, description, accounts affected',
        expectedResult: 'JE details documented',
        documentationLocation: 'D12.1/JE Details'
      },
      {
        step: 4,
        action: 'Verify JE is authorized per company policy (signoff from manager/CFO for large amounts)',
        expectedResult: 'Authorization verified',
        documentationLocation: 'D12.1/Authorization'
      },
      {
        step: 5,
        action: 'Obtain and review supporting documentation (invoice, contract, memo, etc.)',
        expectedResult: 'Business rationale and supporting docs obtained',
        documentationLocation: 'D12.1/Support'
      },
      {
        step: 6,
        action: 'Assess: (a) Is JE appropriate and legitimate? (b) Is amount accurate per support? (c) Is account coding correct? (d) Is period allocation correct?',
        expectedResult: 'JE assessment completed',
        documentationLocation: 'D12.1/Assessment'
      },
      {
        step: 7,
        action: 'For post-close entries: Verify entries are adjusting entries only (no operational JEs post-close)',
        expectedResult: 'Post-close entry appropriateness assessed',
        documentationLocation: 'D12.1/Post-Close'
      },
      {
        step: 8,
        action: 'If JE is management estimate or reversal of estimate: Verify reasonableness and disclosure',
        expectedResult: 'Estimate JEs are appropriate',
        documentationLocation: 'D12.1/Estimates'
      }
    ],

    expectedExceptions: ['JE not authorized', 'JE without supporting documentation', 'Suspicious JE (fraud indicator)', 'Incorrect account coding'],
    exceptionHandling: {
      'Not authorized': 'Escalate to management; determine if retroactive approval; if not, evaluate impact',
      'No support': 'Obtain documentation; if unavailable, investigate JE rationale',
      'Suspicious': 'Flag for management review; assess fraud risk; escalate if needed',
      'Miscoded': 'Propose reversal and re-entry with correct coding'
    },
    conclusionFramework: 'Tested unusual JEs are authorized, supported, appropriate, and accurate; no evidence of unauthorized or fraudulent entries',
    evaluationCriteria: 'No exceptions / Minor authorization exceptions easily resolved / Significant unauthorized entries (fraud risk)',
    frsReferences: ['FRS 102 s2 - Presentation (accuracy of amounts)', 'FRS 102 s3 - Consolidation (if applicable)'],
    isaReferences: ['ISA 240 - Fraud', 'ISA 500 - Evidence', 'ISA 330 - Management override'],
    workingPaperRef: 'D12/D12.1-UnusualJEs'
  },

  {
    procedureId: 'D12.2',
    area: 'JOURNAL ENTRIES',
    title: 'Intercompany Eliminations and Consolidation Adjustments',
    description: 'Review intercompany transactions; verify eliminations in consolidated statements; assess for proper elimination.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Intercompany transaction not eliminated', 'Intercompany profit not adjusted', 'Elimination error'],
    populationDefinition: 'Intercompany transactions (sales, purchases, transfers, loans); consolidation adjustments',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Final',
    resourcesRequired: ['Senior accountant / Manager - consolidation experience'],
    evidenceType: ['Intercompany transaction listing', 'Individual company GL/trial balance', 'Consolidation schedule', 'Supporting documents'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain list of all significant intercompany transactions (sales, purchases, loans, management fees)',
        expectedResult: 'Intercompany transaction schedule prepared',
        documentationLocation: 'D12.2/IC Schedule'
      },
      {
        step: 2,
        action: 'For each major transaction: Verify both sides are recorded (A sells to B; B records purchase)',
        expectedResult: 'Two-way recording verified',
        documentationLocation: 'D12.2/Two-Way'
      },
      {
        step: 3,
        action: 'Prepare consolidation elimination: Dr Revenue, Cr Cost of Sales; Dr AR, Cr AP (mirror entries)',
        expectedResult: 'Elimination entries calculated',
        documentationLocation: 'D12.2/Eliminations'
      },
      {
        step: 4,
        action: 'Verify consolidated GL eliminates all intercompany balances (no residual IC amounts in consolidation)',
        expectedResult: 'Consolidated IC elimination is complete',
        documentationLocation: 'D12.2/IC Elimination'
      },
      {
        step: 5,
        action: 'If intercompany profit exists (IC sales above cost): Calculate and eliminate profit in consolidation',
        expectedResult: 'IC profit eliminated per FRS 102 s3',
        documentationLocation: 'D12.2/IC Profit'
      },
      {
        step: 6,
        action: 'If consolidation, verify minority interest calculation if applicable',
        expectedResult: 'Minority interest properly calculated',
        documentationLocation: 'D12.2/Minority'
      }
    ],

    expectedExceptions: ['Intercompany transaction not eliminated', 'Intercompany profit not removed', 'Consolidation error'],
    exceptionHandling: {
      'Not eliminated': 'Propose elimination entry',
      'Profit not removed': 'Calculate profit; propose adjustment',
      'Consol error': 'Identify error; propose correction'
    },
    conclusionFramework: 'Intercompany transactions are properly eliminated; consolidated amounts are accurate per FRS 102',
    evaluationCriteria: 'Complete elimination / Minor omissions easily corrected / Significant uneliminated balances',
    frsReferences: ['FRS 102 s3 - Consolidation (IC elimination)', 'FRS 10 - Consolidated statements'],
    isaReferences: ['ISA 500 - Evidence'],
    workingPaperRef: 'D12/D12.2-IntercompanyEliminations'
  }

  // Continue with D12.3-D12.18 (consolidation adjustments, fraud risk JEs, JE authorization controls, etc.)
];

// ============================================================================
// D13: POST-BALANCE SHEET EVENTS - 12+ PROCEDURES
// ============================================================================
export const PROCEDURE_D13_EVENTS = [
  {
    procedureId: 'D13.1',
    area: 'SUBSEQUENT EVENTS',
    title: 'Post Year-End Review - Adjusting vs Non-Adjusting Events Identification',
    description: 'Review period from year-end to audit report date; identify events and classify as adjusting or non-adjusting per IAS 10 / FRS 102.',
    assertions: ['COMPLETENESS', 'ACCURACY', 'CLASSIFICATION'],
    secondaryAssertions: ['VALUATION'],
    riskRespond: ['Adjusting event not recorded', 'Non-adjusting event not disclosed', 'Going concern event missed'],
    populationDefinition: 'All events occurring Jan 1 to audit report date',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Completion',
    resourcesRequired: ['Manager - subsequent event review'],
    evidenceType: ['GL post-period', 'Correspondence', 'Board minutes', 'Management representations', 'External news'],

    executionSteps: [
      {
        step: 1,
        action: 'Review GL for Jan-Feb entries; identify non-routine/significant items',
        expectedResult: 'GL post-period review completed',
        documentationLocation: 'D13.1/GL Review'
      },
      {
        step: 2,
        action: 'Review board minutes Jan-Feb for announcements (restructurings, litigation, M&A)',
        expectedResult: 'Board events identified',
        documentationLocation: 'D13.1/Board Minutes'
      },
      {
        step: 3,
        action: 'Obtain management representation letter including statement on subsequent events',
        expectedResult: 'Management representations on events obtained',
        documentationLocation: 'D13.1/Management Rep'
      },
      {
        step: 4,
        action: 'For each identified event: Classify as adjusting (provides evidence of condition at y/e) or non-adjusting (event after y/e)',
        expectedResult: 'Event classification documented',
        documentationLocation: 'D13.1/Classification'
      },
      {
        step: 5,
        action: 'For adjusting events: Verify GL entries were recorded to correct period-end balances',
        expectedResult: 'Adjusting events appropriately recorded',
        documentationLocation: 'D13.1/Adjusting'
      },
      {
        step: 6,
        action: 'For non-adjusting events: Verify disclosure in notes if material (nature, estimate, uncertainty)',
        expectedResult: 'Non-adjusting events disclosed',
        documentationLocation: 'D13.1/Non-Adjusting'
      },
      {
        step: 7,
        action: 'Identify going concern events (liquidity issues, loss of major customer, litigation); assess disclosure',
        expectedResult: 'Going concern impact assessed',
        documentationLocation: 'D13.1/Going Concern'
      }
    ],

    expectedExceptions: ['Adjusting event not recorded', 'Material non-adjusting event not disclosed', 'Going concern event discovered'],
    exceptionHandling: {
      'Adjusting not recorded': 'Propose GL adjustment to prior period balances',
      'Non-disclosed': 'Propose disclosure in notes',
      'Going concern': 'Assess; may require going concern review (ISA 570)'
    },
    conclusionFramework: 'All subsequent events identified and appropriately classified; adjusting events recorded; material non-adjusting events disclosed',
    evaluationCriteria: 'Complete review with appropriate classification / Minor disclosure adjustments / Significant unrecorded adjustments',
    frsReferences: ['FRS 102 s32 - Events after reporting period (IAS 10 equivalent)'],
    isaReferences: ['ISA 560 - Subsequent Events', 'ISA 570 - Going Concern'],
    workingPaperRef: 'D13/D13.1-SubsequentEvents'
  }

  // Continue with D13.2-D13.12 (post-period cash, sales, payables, going concern, regulatory, litigation developments, etc.)
];

// ============================================================================
// D14: RELATED PARTIES - 16+ PROCEDURES
// ============================================================================
export const PROCEDURE_D14_RELATED_PARTIES = [
  {
    procedureId: 'D14.1',
    area: 'RELATED PARTIES',
    title: 'Related Party Identification and Listing',
    description: 'Identify all related parties per FRS 102 s33; maintain updated related party list; assess completeness.',
    assertions: ['COMPLETENESS', 'ACCURACY'],
    secondaryAssertions: ['CLASSIFICATION'],
    riskRespond: ['Related party transaction omitted', 'RP transaction not disclosed', 'RP not identified'],
    populationDefinition: 'All potential related parties (entities with significant influence, joint control, key management)',
    sampleSize: { HIGH: '100%', MEDIUM: '100%', LOW: '100%' },
    testNature: 'Substantive',
    timing: 'Planning & Final',
    resourcesRequired: ['Senior accountant', 'Finance director interview'],
    evidenceType: ['Company register', 'Director/shareholder register', 'Org chart', 'Management representation', 'Board minutes'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain list of shareholders and directors per Companies House and company records',
        expectedResult: 'Shareholder/director list prepared',
        documentationLocation: 'D14.1/RP List'
      },
      {
        step: 2,
        action: 'Identify entities with significant influence (>20% ownership) and joint control entities',
        expectedResult: 'Significant influence entities listed',
        documentationLocation: 'D14.1/Influence'
      },
      {
        step: 3,
        action: 'Identify key management personnel (directors, CFO, department heads)',
        expectedResult: 'Key management identified',
        documentationLocation: 'D14.1/KMP'
      },
      {
        step: 4,
        action: 'Identify related parties of identified RPs (subsidiaries of major shareholders, etc.)',
        expectedResult: 'Extended RP list completed',
        documentationLocation: 'D14.1/Extended'
      },
      {
        step: 5,
        action: 'Inquire of management whether list is complete and no RPs are omitted',
        expectedResult: 'Management confirmation of completeness obtained',
        documentationLocation: 'D14.1/Management Inquiry'
      },
      {
        step: 6,
        action: 'Review prior-year related party list; verify names and relationships remain current',
        expectedResult: 'Prior relationships updated or removed',
        documentationLocation: 'D14.1/Prior Year'
      },
      {
        step: 7,
        action: 'Distribute final list to RP testing team for transaction testing (D14.2)',
        expectedResult: 'RP list provided to audit team',
        documentationLocation: 'D14.1/Distribution'
      }
    ],

    expectedExceptions: ['RP omitted from list', 'RP status changed during year', 'Management disputes RP status'],
    exceptionHandling: {
      'Omitted': 'Add to RP list; assess for transaction testing',
      'Changed': 'Update RP relationship status',
      'Dispute': 'Assess per FRS 102 definition; document conclusion'
    },
    conclusionFramework: 'Related party list is complete; captures all entities meeting FRS 102 s33 definition; list will be used for transaction testing',
    evaluationCriteria: 'Complete list prepared and validated / Minor additions for completeness / Significant omissions identified',
    frsReferences: ['FRS 102 s33 - Related Party Disclosure'],
    isaReferences: ['ISA 550 - Related Parties'],
    workingPaperRef: 'D14/D14.1-RPIdentification'
  },

  {
    procedureId: 'D14.2',
    area: 'RELATED PARTIES',
    title: 'Related Party Transaction Testing - Arm\'s Length Assessment',
    description: 'Test related party transactions for business rationale, arm\'s length terms, proper authorization, and disclosure.',
    assertions: ['EXISTENCE', 'ACCURACY', 'CLASSIFICATION', 'VALUATION'],
    secondaryAssertions: ['COMPLETENESS'],
    riskRespond: ['RP transaction at non-arm\'s length terms', 'Unauthorized RP transaction', 'RP transaction fraudulently recorded'],
    populationDefinition: 'All transactions with identified related parties during year',
    sampleSize: { HIGH: '80%', MEDIUM: '50%', LOW: '30%' },
    testNature: 'Substantive Detail',
    timing: 'Final',
    resourcesRequired: ['Manager - RP testing', 'Senior accountant'],
    evidenceType: ['RP transaction listing', 'Contracts/agreements', 'Board minutes (approval)', 'Pricing analysis', 'Supporting docs'],

    executionSteps: [
      {
        step: 1,
        action: 'Obtain listing of all RP transactions from GL (obtained from D14.1 RP list filtered through GL)',
        expectedResult: 'RP transaction listing prepared',
        documentationLocation: 'D14.2/RP Transactions'
      },
      {
        step: 2,
        action: 'Stratify by amount; sample major items (>£XXk) at 100%, medium 50%, small 25%',
        expectedResult: 'Risk-based sample selected',
        documentationLocation: 'D14.2/Sample'
      },
      {
        step: 3,
        action: 'For each sampled transaction: Verify legitimate business purpose (e.g., procurement, service, financing)',
        expectedResult: 'Business rationale documented',
        documentationLocation: 'D14.2/Business Purpose'
      },
      {
        step: 4,
        action: 'Assess whether transaction terms are arm\'s length (price, credit terms, interest rate compare to third-party comparables)',
        expectedResult: 'Arm\'s length assessment completed',
        documentationLocation: 'D14.2/Arm\'s Length'
      },
      {
        step: 5,
        action: 'Verify transaction was authorized per company policy (board approval for major transactions)',
        expectedResult: 'Authorization verified',
        documentationLocation: 'D14.2/Authorization'
      },
      {
        step: 6,
        action: 'Verify transaction is properly recorded (correct account, amount, period, RP disclosure indicator)',
        expectedResult: 'Recording verified',
        documentationLocation: 'D14.2/Recording'
      },
      {
        step: 7,
        action: 'Obtain management representation letter confirming RP status and all RP transactions',
        expectedResult: 'Management representations obtained',
        documentationLocation: 'D14.2/Mgmt Rep'
      }
    ],

    expectedExceptions: ['RP transaction not at arm\'s length', 'RP transaction not authorized', 'Non-arm\'s length terms'],
    exceptionHandling: {
      'Non-arm\'s length': 'Assess impact; may require price adjustment; disclosure issue',
      'Not authorized': 'Determine if retroactively approved; if not, escalate',
      'Pricing issue': 'Obtain explanation; assess if adjustment needed'
    },
    conclusionFramework: 'Related party transactions tested are supported by business rationale, authorized, at arm\'s length terms, and properly recorded/disclosed',
    evaluationCriteria: 'No exceptions / Minor arm\'s length variance acceptable / Significant non-arm\'s length terms require adjustment',
    frsReferences: ['FRS 102 s33 - Related Party Disclosure', 'FRS 102 s1A.26 - RP disclosure requirements'],
    isaReferences: ['ISA 550 - Related Parties', 'ISA 500 - Evidence'],
    workingPaperRef: 'D14/D14.2-RPTransactions'
  }

  // Continue with D14.3-D14.16 (directors' loans, KMP compensation, RP balance confirmation, disclosure completeness, etc.)
];

// ============================================================================
// EXPORT
// ============================================================================
export default {
  PROCEDURE_D6_PAYABLES,
  PROCEDURE_D7_LOANS,
  PROCEDURE_D8_TAX,
  PROCEDURE_D9_PROVISIONS,
  PROCEDURE_D10_EQUITY,
  PROCEDURE_D11_CASH,
  PROCEDURE_D12_ENTRIES,
  PROCEDURE_D13_EVENTS,
  PROCEDURE_D14_RELATED_PARTIES
};
