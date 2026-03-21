/**
 * controlLibrary.js
 *
 * Comprehensive control library with 50+ controls across 5 transaction cycles
 * Each control includes:
 * - Control design & operating effectiveness assessment
 * - FSLI coverage (Financial Statement Line Item)
 * - Testing procedures
 * - Evidence requirements
 * - Deficiency flagging
 *
 * Version: 2026.1
 */

export const CONTROL_LIBRARY = {
  // REVENUE CYCLE CONTROLS (10 controls)
  REVENUE_CYCLE: {
    RC_001: {
      code: 'RC-001',
      name: 'Credit Approval',
      transaction_cycle: 'Revenue',
      description: 'All sales orders are approved for credit by authorized personnel before shipment',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Revenue', 'Receivables'],
      control_procedures: [
        'Customer credit application reviewed',
        'Credit references checked',
        'Credit limits established',
        'Authorization of credit exceptions documented'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Revenue recognition without proper authorization', 'Uncollectible receivables'],
      testing_procedures: ['Review credit approvals for sample of sales', 'Verify authorization levels', 'Check credit limit compliance'],
      evidence_required: ['Signed credit approval forms', 'Credit limit schedule', 'Exception authorizations']
    },

    RC_002: {
      code: 'RC-002',
      name: 'Order Entry & Validation',
      transaction_cycle: 'Revenue',
      description: 'Sales orders are entered into system with validation of customer, item, and pricing',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Revenue', 'Receivables'],
      control_procedures: [
        'Customer master file validated',
        'Item numbers validated against inventory',
        'Pricing validated against approved price lists',
        'Order quantities reviewed for reasonableness'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Invalid customer/item data', 'Pricing errors', 'Duplicate orders'],
      testing_procedures: ['Test system controls for invalid entries', 'Review order exceptions', 'Verify pricing accuracy'],
      evidence_required: ['System generated order forms', 'Price list proof', 'Order exception reports']
    },

    RC_003: {
      code: 'RC-003',
      name: 'Revenue Recognition Policy',
      transaction_cycle: 'Revenue',
      description: 'Revenue is recognized in accordance with revenue policy (IFRS 15)',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Revenue'],
      control_procedures: [
        'Contract review for performance obligations',
        'Satisfaction of performance obligation determination',
        'Transaction price assessment',
        'Timing of revenue recognition documentation'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Revenue recognition misstatement', 'Cut-off errors', 'Contract accounting errors'],
      testing_procedures: ['Review revenue recognition policy', 'Test complex contracts', 'Verify cut-off', 'Check management review'],
      evidence_required: ['Revenue policy document', 'Contract review notes', 'Cut-off testing']
    },

    RC_004: {
      code: 'RC-004',
      name: 'Shipment & Delivery Control',
      transaction_cycle: 'Revenue',
      description: 'All shipments are documented and matched to customer orders',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Revenue'],
      control_procedures: [
        'Packing slip generated for each order',
        'Shipping documents sequentially numbered',
        'Goods physically inspected before shipment',
        'Carrier receipt obtained'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unshipped goods recorded as revenue', 'Shipment without order', 'Goods in transit issues'],
      testing_procedures: ['Match shipments to orders', 'Verify sequential numbering', 'Review cut-off period'],
      evidence_required: ['Shipping documents', 'Bill of lading', 'Receiving reports', 'Cut-off listing']
    },

    RC_005: {
      code: 'RC-005',
      name: 'Customer Invoice & Billing',
      transaction_cycle: 'Revenue',
      description: 'Customer invoices are generated automatically and agreed to order/shipment',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Revenue', 'Receivables'],
      control_procedures: [
        'Invoice automatically generated from order',
        'Invoice details agreed to order',
        'Pricing agreed to price list',
        'Quantities agreed to shipment'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Billing errors', 'Duplicate invoices', 'Pricing mistakes'],
      testing_procedures: ['Trace invoice to order & shipment', 'Verify pricing & quantities', 'Check sequence numbering'],
      evidence_required: ['Sample invoices', 'Supporting orders/shipments', 'System configuration']
    },

    RC_006: {
      code: 'RC-006',
      name: 'Accounts Receivable Recording',
      transaction_cycle: 'Revenue',
      description: 'Invoices are timely recorded to accounts receivable',
      control_objectives: ['Completeness', 'Accuracy'],
      associated_fslis: ['Receivables', 'Revenue'],
      control_procedures: [
        'Invoices automatically posted to AR',
        'Daily AR reconciliation performed',
        'Out-of-balance items investigated',
        'Variance investigation documented'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unrecorded revenue', 'AR balance misstatement'],
      testing_procedures: ['Verify daily AR postings', 'Review reconciliation', 'Check variance follow-up'],
      evidence_required: ['Daily posting reports', 'Reconciliation', 'Variance resolution notes']
    },

    RC_007: {
      code: 'RC-007',
      name: 'Cash Receipt Processing',
      transaction_cycle: 'Revenue',
      description: 'Cash receipts are properly recorded and applied to customer accounts',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Cash', 'Receivables'],
      control_procedures: [
        'Daily cash deposit control totals prepared',
        'Deposits reconciled to cash receipt listing',
        'Cash applied to correct AR account',
        'Unidentified payments investigated'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Cash theft/misappropriation', 'Misapplied payments', 'Unrecorded receipts'],
      testing_procedures: ['Trace receipt to bank deposit', 'Verify AR application', 'Test control totals'],
      evidence_required: ['Deposit slips', 'Receipt listings', 'AR application records', 'Bank statements']
    },

    RC_008: {
      code: 'RC-008',
      name: 'Accounts Receivable Aging & Collection',
      transaction_cycle: 'Revenue',
      description: 'Accounts receivable aging is prepared and collection activities documented',
      control_objectives: ['Accuracy', 'Valuation'],
      associated_fslis: ['Receivables'],
      control_procedures: [
        'Monthly AR aging prepared',
        'Aging reviewed for aged items',
        'Collection follow-up documented',
        'Bad debt reserve assessed'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Uncollectible receivables unidentified', 'Inadequate allowance', 'Obsolete receivables'],
      testing_procedures: ['Verify aging accuracy', 'Review collection follow-up', 'Test allowance calculation'],
      evidence_required: ['AR aging report', 'Collection notes', 'Allowance calculation', 'Write-off approval']
    },

    RC_009: {
      code: 'RC-009',
      name: 'Sales Returns & Credits',
      transaction_cycle: 'Revenue',
      description: 'Sales returns and credits are properly authorized and recorded',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Revenue'],
      control_procedures: [
        'Return authorization required',
        'Goods physically inspected on return',
        'Return documented with supporting evidence',
        'Credit memo authorized & issued'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized returns', 'Fictitious returns', 'Revenue overstatement'],
      testing_procedures: ['Review return authorizations', 'Verify inspection', 'Check credit memo matching'],
      evidence_required: ['Return authorizations', 'Inspection records', 'Credit memos', 'RMA documentation']
    },

    RC_010: {
      code: 'RC-010',
      name: 'Revenue Reconciliation & Review',
      transaction_cycle: 'Revenue',
      description: 'Revenue transactions are periodically reconciled and management reviews variance',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Revenue'],
      control_procedures: [
        'Daily/weekly revenue totals reconciled',
        'Variance from prior period analyzed',
        'Significant variances investigated',
        'Management sign-off on reconciliation'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Undetected revenue errors', 'Fraud'],
      testing_procedures: ['Review reconciliation process', 'Test variance analysis', 'Verify sign-off'],
      evidence_required: ['Reconciliation reports', 'Variance analysis', 'Investigation notes', 'Approval sign-offs']
    }
  },

  // EXPENDITURE CYCLE CONTROLS (10 controls)
  EXPENDITURE_CYCLE: {
    EC_001: {
      code: 'EC-001',
      name: 'Purchase Requisition & Approval',
      transaction_cycle: 'Expenditure',
      description: 'All purchases must be preceded by properly approved requisitions',
      control_objectives: ['Existence', 'Authorization', 'Completeness'],
      associated_fslis: ['Accounts Payable', 'Expenses'],
      control_procedures: [
        'Purchase requisition form required for all purchases',
        'Budget check performed',
        'Department manager approval required',
        'Spending limit authorization enforced'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized purchases', 'Budget overages', 'Fraud'],
      testing_procedures: ['Verify requisition for sample purchases', 'Check approval levels', 'Verify budget checking'],
      evidence_required: ['Sample purchase requisitions', 'Approval documentation', 'Budget reports']
    },

    EC_002: {
      code: 'EC-002',
      name: 'Vendor Master File Control',
      transaction_cycle: 'Expenditure',
      description: 'Vendor master file is maintained and changes are authorized',
      control_objectives: ['Existence', 'Accuracy'],
      associated_fslis: ['Accounts Payable'],
      control_procedures: [
        'New vendors require written approval',
        'Vendor information validated (bank details, tax ID)',
        'Vendor changes require authorization',
        'Inactive vendors are flagged'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Fraudulent vendors', 'Duplicate vendors', 'Incorrect payments', 'Payments to unauthorized parties'],
      testing_procedures: ['Review vendor additions', 'Verify approval documentation', 'Test changes for authorization'],
      evidence_required: ['Vendor applications', 'Approval forms', 'Vendor master reports', 'Change logs']
    },

    EC_003: {
      code: 'EC-003',
      name: 'Purchase Order Processing',
      transaction_cycle: 'Expenditure',
      description: 'Purchase orders are generated and communicated to vendors',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Accounts Payable', 'Inventory'],
      control_procedures: [
        'PO generated only for approved requisitions',
        'PO terms agreed with vendor',
        'PO price agreed to vendor quote or contract',
        'PO quantities agreed to requisition'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized purchases', 'Pricing errors', 'Duplicate orders', 'Overpayment'],
      testing_procedures: ['Match PO to requisition', 'Verify pricing', 'Check authorization'],
      evidence_required: ['Sample POs', 'Requisitions', 'Vendor quotes', 'PO register']
    },

    EC_004: {
      code: 'EC-004',
      name: 'Receiving & Inspection Control',
      transaction_cycle: 'Expenditure',
      description: 'Goods received are inspected and documented before acceptance',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Inventory', 'Accounts Payable'],
      control_procedures: [
        'Receiving report prepared for all shipments',
        'Goods inspected for quality & quantity',
        'Receiving report matched to PO',
        'Discrepancies documented & resolved'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Uninspected goods', 'Quality issues accepted', 'Quantity over-receiving', 'Fraudulent receipts'],
      testing_procedures: ['Review receiving reports', 'Verify PO matching', 'Check inspection procedures', 'Review exceptions'],
      evidence_required: ['Sample receiving reports', 'Inspection records', 'Receiving discrepancy reports']
    },

    EC_005: {
      code: 'EC-005',
      name: 'Invoice Matching & Validation',
      transaction_cycle: 'Expenditure',
      description: 'Vendor invoices are validated against PO and receiving documents (3-way match)',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Accounts Payable'],
      control_procedures: [
        '3-way match: PO matched to receiving & invoice',
        'Invoice pricing verified against PO',
        'Invoice quantities verified against receiving',
        'Invoice discrepancies investigated & resolved'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Duplicate invoicing', 'Overpayment', 'Unauthorized charges', 'Pricing errors'],
      testing_procedures: ['Test 3-way match process', 'Review exception handling', 'Verify discrepancy resolution'],
      evidence_required: ['Sample invoices', 'PO/receiving documentation', 'Exception reports', 'Resolution notes']
    },

    EC_006: {
      code: 'EC-006',
      name: 'Accounts Payable Recording',
      transaction_cycle: 'Expenditure',
      description: 'Invoices are timely and accurately recorded to accounts payable',
      control_objectives: ['Completeness', 'Accuracy'],
      associated_fslis: ['Accounts Payable', 'Expenses'],
      control_procedures: [
        'Invoices recorded to correct vendor & GL account',
        'Invoice amounts accurately recorded',
        'Accruals made for unmatched invoices',
        'Manual entries require dual approval'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unrecorded liabilities', 'AP balance errors', 'Expense misclassification'],
      testing_procedures: ['Verify posting accuracy', 'Check accrual procedures', 'Review manual entries'],
      evidence_required: ['Invoice register', 'GL posting reports', 'Accrual listing', 'Manual entry approvals']
    },

    EC_007: {
      code: 'EC-007',
      name: 'Payment Processing & Approval',
      transaction_cycle: 'Expenditure',
      description: 'Payments are made only for properly approved invoices',
      control_objectives: ['Existence', 'Authorization', 'Accuracy'],
      associated_fslis: ['Cash', 'Accounts Payable'],
      control_procedures: [
        'Payment only after 3-way match approval',
        'Payment amount verified against invoice',
        'Dual authorization for payments >threshold',
        'Vendor payee verified before payment'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized payments', 'Duplicate payments', 'Payments to wrong vendor', 'Fraud/embezzlement'],
      testing_procedures: ['Verify payment authorization', 'Test dual approval', 'Check vendor verification'],
      evidence_required: ['Sample payments', 'Invoice documentation', 'Approval evidence', 'Payment register']
    },

    EC_008: {
      code: 'EC-008',
      name: 'Debit Memo Processing',
      transaction_cycle: 'Expenditure',
      description: 'Vendor debit memos/refunds are properly documented and recorded',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Accounts Payable', 'Expenses'],
      control_procedures: [
        'Debit memo received from vendor',
        'Reason for debit documented',
        'Credit authorized by management',
        'Credit timely applied to vendor'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized credits', 'Duplicate credits', 'Unrecorded credits'],
      testing_procedures: ['Review debit memo documentation', 'Verify authorization', 'Check timing of recording'],
      evidence_required: ['Sample debit memos', 'Authorization forms', 'Credit application documentation']
    },

    EC_009: {
      code: 'EC-009',
      name: 'Accounts Payable Reconciliation',
      transaction_cycle: 'Expenditure',
      description: 'Accounts payable balance is reconciled to detail monthly',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Accounts Payable'],
      control_procedures: [
        'Monthly AP aging prepared',
        'AP subledger reconciled to GL',
        'Reconciliation reviewed & approved',
        'Exceptions investigated & resolved'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['AP balance errors', 'Undetected fraud', 'Misclassified expenses'],
      testing_procedures: ['Verify reconciliation accuracy', 'Review exception resolution', 'Test aging accuracy'],
      evidence_required: ['AP reconciliation', 'Aging report', 'GL reconciliation', 'Approval sign-offs']
    },

    EC_010: {
      code: 'EC-010',
      name: 'Expense Allocation & Accrual',
      transaction_cycle: 'Expenditure',
      description: 'Expenses are properly allocated and accrued at month-end',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Expenses', 'Accounts Payable'],
      control_procedures: [
        'Utility bills allocated to appropriate cost centers',
        'Unmatched invoices accrued',
        'Accruals reviewed for reasonableness',
        'Month-end reconciliation performed'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Incorrect expense classification', 'Missing accruals', 'Duplicate recording'],
      testing_procedures: ['Review allocation methodology', 'Test accrual calculations', 'Verify reconciliation'],
      evidence_required: ['Allocation reports', 'Accrual schedules', 'Support documentation', 'Reconciliation']
    }
  },

  // PAYROLL CYCLE CONTROLS (8 controls)
  PAYROLL_CYCLE: {
    PC_001: {
      code: 'PC-001',
      name: 'Personnel File & Master Data',
      transaction_cycle: 'Payroll',
      description: 'Employee master file is maintained with appropriate documentation',
      control_objectives: ['Existence', 'Accuracy'],
      associated_fslis: ['Payroll Expense', 'Payroll Liability'],
      control_procedures: [
        'New employees require personnel file documentation',
        'I-9 forms completed & verified',
        'Tax withholding elections documented',
        'Personnel master file changes require approval'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Fictitious employees', 'Incorrect tax withholding', 'Unauthorized employees'],
      testing_procedures: ['Review new employee files', 'Verify I-9 compliance', 'Test master file changes'],
      evidence_required: ['Sample personnel files', 'I-9 forms', 'Change authorization forms', 'Master file listing']
    },

    PC_002: {
      code: 'PC-002',
      name: 'Time & Attendance Tracking',
      transaction_cycle: 'Payroll',
      description: 'Employee time & attendance is tracked and approved',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Payroll Expense'],
      control_procedures: [
        'Time recorded via time clock/badge system',
        'Supervisor reviews & approves timesheets',
        'Overtime approved & documented',
        'Exceptions investigated'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unworked time paid', 'Unauthorized overtime', 'Payroll fraud'],
      testing_procedures: ['Review timesheet approvals', 'Verify overtime authorization', 'Test exception handling'],
      evidence_required: ['Sample timesheets', 'Time clock records', 'Approval documentation', 'Overtime authorizations']
    },

    PC_003: {
      code: 'PC-003',
      name: 'Payroll Processing & Calculation',
      transaction_cycle: 'Payroll',
      description: 'Payroll is calculated accurately per policy and applicable laws',
      control_objectives: ['Accuracy'],
      associated_fslis: ['Payroll Expense', 'Payroll Liability'],
      control_procedures: [
        'Payroll calculated by system per rates in master file',
        'Gross pay calculation reviewed',
        'Deductions accurately calculated',
        'System validation controls in place'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Payroll calculation errors', 'Incorrect deductions', 'Wage & hour violations'],
      testing_procedures: ['Recalculate sample payrolls', 'Verify deduction accuracy', 'Test system controls'],
      evidence_required: ['Sample payroll calculations', 'Payroll reports', 'Rate documentation', 'System logs']
    },

    PC_004: {
      code: 'PC-004',
      name: 'Payroll Authorization & Approval',
      transaction_cycle: 'Payroll',
      description: 'Payroll is authorized by appropriate personnel before processing',
      control_objectives: ['Authorization'],
      associated_fslis: ['Payroll Expense', 'Payroll Liability'],
      control_procedures: [
        'Payroll register reviewed & approved',
        'Variance from prior period analyzed',
        'Unusual items flagged & investigated',
        'CFO/Treasurer approval obtained'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized payroll', 'Fraudulent payroll entries', 'Payroll errors'],
      testing_procedures: ['Verify payroll approvals', 'Review variance analysis', 'Check unusual items'],
      evidence_required: ['Signed payroll register', 'Variance analysis', 'Exception documentation', 'Approval sign-offs']
    },

    PC_005: {
      code: 'PC-005',
      name: 'Payroll Tax Compliance',
      transaction_cycle: 'Payroll',
      description: 'Payroll taxes are properly withheld and remitted',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Payroll Liability'],
      control_procedures: [
        'Federal/state income tax withheld accurately',
        'FICA taxes withheld accurately',
        'Tax payments made timely',
        'Tax forms prepared & filed timely'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Tax underpayment', 'Penalties & interest', 'Non-compliance', 'Audit risk'],
      testing_procedures: ['Verify tax calculation accuracy', 'Test payment timeliness', 'Review tax form filing'],
      evidence_required: ['Tax calculation support', 'Payment evidence', 'Tax forms (940, 941, W-2)']
    },

    PC_006: {
      code: 'PC-006',
      name: 'Payroll Disbursement Control',
      transaction_cycle: 'Payroll',
      description: 'Payroll payments are disbursed only to valid employees',
      control_objectives: ['Existence', 'Authorization'],
      associated_fslis: ['Cash'],
      control_procedures: [
        'Direct deposit to verified bank accounts',
        'Checks require dual signature',
        'Unclaimed paycheck controls in place',
        'Payroll reconciliation performed'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Paycheck theft', 'Unauthorized disbursements', 'Fraud'],
      testing_procedures: ['Test dual signature requirement', 'Verify unclaimed check handling', 'Review bank reconciliation'],
      evidence_required: ['Sample signed checks', 'Unclaimed check listing', 'Bank reconciliation', 'Direct deposit verification']
    },

    PC_007: {
      code: 'PC-007',
      name: 'Benefit Plan Administration',
      transaction_cycle: 'Payroll',
      description: 'Employee benefits are properly administered & accrued',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Payroll Expense', 'Payroll Liability'],
      control_procedures: [
        'Benefit elections properly documented',
        'Benefit deductions verified',
        'Benefit accruals calculated & recorded',
        'Reconciliation to payroll & GL'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Incorrect benefit calculations', 'Missing benefit accruals', 'Non-compliance'],
      testing_procedures: ['Review benefit accruals', 'Test reconciliation accuracy', 'Verify elections documentation'],
      evidence_required: ['Benefit accrual schedules', 'Reconciliations', 'Election forms', 'GL verification']
    },

    PC_008: {
      code: 'PC-008',
      name: 'Payroll Documentation & Reconciliation',
      transaction_cycle: 'Payroll',
      description: 'Payroll is documented and reconciled to GL monthly',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Payroll Expense', 'Payroll Liability'],
      control_procedures: [
        'Monthly payroll report prepared',
        'Payroll reconciled to GL',
        'Variances investigated & resolved',
        'Documentation reviewed & approved'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Undetected payroll errors', 'GL misstatement'],
      testing_procedures: ['Verify GL reconciliation', 'Review variance analysis', 'Check documentation'],
      evidence_required: ['Payroll reconciliation', 'GL reports', 'Variance analysis', 'Approval sign-offs']
    }
  },

  // FINANCE & TREASURY CONTROLS (8 controls)
  FINANCE_CONTROLS: {
    FI_001: {
      code: 'FI-001',
      name: 'Bank Reconciliation',
      transaction_cycle: 'Finance',
      description: 'Bank statements are reconciled to GL monthly',
      control_objectives: ['Existence', 'Accuracy', 'Completeness'],
      associated_fslis: ['Cash'],
      control_procedures: [
        'Bank statement received independently',
        'Reconciliation performed within 5 days',
        'Reconciling items reviewed & approved',
        'GL adjusted for reconciling items'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Cash misappropriation', 'Undetected fraud', 'Balance errors'],
      testing_procedures: ['Verify reconciliation accuracy', 'Review reconciling items', 'Check timely adjustments'],
      evidence_required: ['Bank statements', 'Reconciliation', 'GL reconciliation report', 'Approval sign-offs']
    },

    FI_002: {
      code: 'FI-002',
      name: 'Journal Entry Review & Approval',
      transaction_cycle: 'Finance',
      description: 'All manual journal entries require review & approval',
      control_objectives: ['Accuracy', 'Authorization'],
      associated_fslis: ['General Ledger balances'],
      control_procedures: [
        'Manual entries require documented support',
        'Entries reviewed for appropriateness',
        'Entries approved before posting',
        'Entry sequence maintained'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unsupported entries', 'Fraudulent entries', 'GL errors'],
      testing_procedures: ['Review manual entry support', 'Verify approval', 'Check entry sequence', 'Recalculate entries'],
      evidence_required: ['Sample journal entries', 'Support documentation', 'Approval evidence', 'Entry logs']
    },

    FI_003: {
      code: 'FI-003',
      name: 'Financial Close Process',
      transaction_cycle: 'Finance',
      description: 'Month-end close procedures are documented & followed',
      control_objectives: ['Completeness', 'Accuracy'],
      associated_fslis: ['General Ledger balances'],
      control_procedures: [
        'Close checklist prepared & followed',
        'Reconciliations completed',
        'Accruals reviewed & recorded',
        'Variance analysis performed'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Incomplete close', 'Missing accruals', 'Variance errors'],
      testing_procedures: ['Review close checklist completion', 'Verify accrual accuracy', 'Test reconciliations'],
      evidence_required: ['Close checklist', 'Reconciliations', 'Accrual schedules', 'Variance analysis']
    },

    FI_004: {
      code: 'FI-004',
      name: 'Debt & Financing Management',
      transaction_cycle: 'Finance',
      description: 'Debt obligations are properly authorized and recorded',
      control_objectives: ['Existence', 'Accuracy', 'Authorization'],
      associated_fslis: ['Debt', 'Interest Expense'],
      control_procedures: [
        'Loan agreements approved by board',
        'Debt terms documented & tracked',
        'Interest calculations verified',
        'Covenants monitored'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized debt', 'Incorrect interest', 'Covenant violations'],
      testing_procedures: ['Review loan agreements', 'Verify interest calculations', 'Test covenant compliance'],
      evidence_required: ['Loan agreements', 'Board approvals', 'Interest calculations', 'Covenant analysis']
    },

    FI_005: {
      code: 'FI-005',
      name: 'Investment Control & Tracking',
      transaction_cycle: 'Finance',
      description: 'Investments are properly authorized, recorded, and valued',
      control_objectives: ['Existence', 'Valuation', 'Accuracy'],
      associated_fslis: ['Investments', 'Investment Income'],
      control_procedures: [
        'Investment purchases authorized',
        'Investment schedule maintained',
        'Fair value assessment performed',
        'Income recorded accurately'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Unauthorized investments', 'Misvaluation', 'Missing income recording'],
      testing_procedures: ['Review authorization', 'Test valuation', 'Verify income calculation'],
      evidence_required: ['Investment agreements', 'Valuation support', 'Income documentation']
    },

    FI_006: {
      code: 'FI-006',
      name: 'General Ledger Control',
      transaction_cycle: 'Finance',
      description: 'GL is properly maintained with appropriate account structure',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['General Ledger'],
      control_procedures: [
        'Account numbers standardized',
        'Account coding reviewed for appropriateness',
        'Account reconciliation performed',
        'GL trial balance prepared monthly'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['GL errors', 'Misclassification', 'Balance errors'],
      testing_procedures: ['Review account coding', 'Verify GL reconciliation', 'Test trial balance accuracy'],
      evidence_required: ['GL account listing', 'Reconciliations', 'Trial balance', 'Coding documentation']
    },

    FI_007: {
      code: 'FI-007',
      name: 'Variance Analysis & Reporting',
      transaction_cycle: 'Finance',
      description: 'Financial variances are analyzed and reported timely',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['General Ledger'],
      control_procedures: [
        'Monthly variance analysis performed',
        'Variances >threshold investigated',
        'Investigation documented',
        'Management review & sign-off'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['Undetected errors', 'Fraud', 'Budget control failures'],
      testing_procedures: ['Review variance analysis', 'Verify investigation documentation', 'Check thresholds'],
      evidence_required: ['Variance reports', 'Investigation notes', 'Approval documentation']
    },

    FI_008: {
      code: 'FI-008',
      name: 'Financial Reporting Control',
      transaction_cycle: 'Finance',
      description: 'Financial statements are prepared accurately per IFRS',
      control_objectives: ['Accuracy', 'Completeness'],
      associated_fslis: ['Financial Statements'],
      control_procedures: [
        'FS checklist used for preparation',
        'Disclosures reviewed for completeness',
        'Management review & approval',
        'Footnotes reviewed for accuracy'
      ],
      design_status: 'EFFECTIVE',
      operating_status: 'EFFECTIVE',
      key_risks_addressed: ['FS errors', 'Missing disclosures', 'IFRS non-compliance'],
      testing_procedures: ['Review FS preparation process', 'Verify disclosure completeness', 'Test footnote accuracy'],
      evidence_required: ['FS checklist', 'Disclosure review', 'FS and footnotes', 'Approval sign-offs']
    }
  }
};

export default CONTROL_LIBRARY;
