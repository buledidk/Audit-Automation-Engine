// ═══════════════════════════════════════════════════════════════════════
// AUDITENGINE v10 AURA — AUDIT METHODOLOGY DATA
// ISA (UK) · FRS 102 (Revised 2026) · Companies Act 2006
// This file contains ALL pre-populated content for working papers
// ═══════════════════════════════════════════════════════════════════════

// ─── ENGAGEMENT LETTER CLAUSES (ISA 210) ───
export const ENGAGEMENT_LETTER = {
  objective: "The objective of our audit is to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's report that includes our opinion (ISA 200.11).",
  scope: [
    "An audit of the financial statements for the year ended {FYE} prepared in accordance with {FRAMEWORK} and applicable law",
    "The audit will be conducted in accordance with International Standards on Auditing (UK) (ISAs (UK)) and applicable law (ISA 200.3)",
    "The financial reporting framework is {FRAMEWORK} as issued by the Financial Reporting Council"
  ],
  responsibilities_management: [
    "Preparation of the financial statements that give a true and fair view in accordance with {FRAMEWORK} (ISA 210.6(a))",
    "Such internal control as management determines is necessary to enable the preparation of financial statements that are free from material misstatement (ISA 210.6(a)(ii))",
    "Providing us with access to all information of which management is aware that is relevant to the preparation of the financial statements (ISA 210.6(b)(i))",
    "Additional information that we may request from management for the purpose of the audit (ISA 210.6(b)(ii))",
    "Unrestricted access to persons within the entity from whom we determine it necessary to obtain audit evidence (ISA 210.6(b)(iii))"
  ],
  responsibilities_auditor: [
    "Conduct the audit in accordance with ISAs (UK) which require us to comply with the FRC's Ethical Standard (ISA 210.10)",
    "Obtain reasonable assurance about whether the financial statements are free from material misstatement — reasonable assurance is a high level of assurance but not a guarantee (ISA 200.5)",
    "Communicate to those charged with governance matters required by ISAs (UK) including significant deficiencies in internal control (ISA 260, ISA 265)",
    "Form an opinion on the financial statements based on sufficient appropriate audit evidence (ISA 700)"
  ],
  limitations: "Because of the inherent limitations of an audit, together with the inherent limitations of internal control, there is an unavoidable risk that some material misstatements may not be detected, even though the audit is properly planned and performed in accordance with ISAs (UK) (ISA 200.A53)."
};

// ─── CLIENT ACCEPTANCE & CONTINUANCE (ISA 220) ───
export const ACCEPTANCE_CHECKLIST = [
  { factor: "Independence", criteria: "Firm and engagement team independent per FRC Ethical Standard 2024", isa: "ES 1.2-1.6", evidence: "Independence declaration signed by all team members" },
  { factor: "Competence and resources", criteria: "Firm has competence, capability and resources to perform the engagement", isa: "ISA 220.25", evidence: "Industry expertise assessment, staffing plan reviewed" },
  { factor: "Management integrity", criteria: "No matters indicating lack of integrity of management or TCWG", isa: "ISA 220.24(a)", evidence: "Director searches (Companies House, insolvency register, disqualified directors)" },
  { factor: "AML compliance", criteria: "Customer due diligence completed per MLR 2017", isa: "MLR 2017 Reg 28", evidence: "CDD file: ID verification, source of funds, PEP/sanctions screening" },
  { factor: "Ethical requirements", criteria: "No ethical conflicts or threats that cannot be mitigated", isa: "ES 1.20-1.29", evidence: "Ethical threats assessment documented" },
  { factor: "Predecessor auditor", criteria: "Communication with predecessor (if applicable)", isa: "ISA 510.6", evidence: "Letter sent/received, reasons for change understood" },
  { factor: "Engagement risk", criteria: "Engagement risk assessed and acceptable", isa: "ISQM (UK) 1.30", evidence: "Risk factors documented: complexity, industry, management, reporting deadlines" },
  { factor: "Fee and terms", criteria: "Fee agreed, engagement letter issued and signed", isa: "ISA 210.9", evidence: "Signed engagement letter on file" },
  { factor: "Group audit considerations", criteria: "Component auditor access and communication assessed (if applicable)", isa: "ISA 600.19", evidence: "Component identification, materiality allocation, instructions drafted" },
  { factor: "Quality management", criteria: "Engagement quality review required?", isa: "ISQM (UK) 2.13", evidence: "EQR criteria assessed: PIE, high risk, first year, other criteria" }
];

// ─── MATERIALITY BENCHMARKS (ISA 320) ───
export const MATERIALITY_BENCHMARKS = {
  revenue: { range: "0.5% - 1%", typical: "0.75%", when: "Revenue-driven entities, stable revenue stream, most common benchmark for commercial entities" },
  grossProfit: { range: "1% - 2%", typical: "1.5%", when: "Trading entities where margins are key performance indicator" },
  totalAssets: { range: "1% - 2%", typical: "1%", when: "Asset-intensive industries (property, manufacturing), balance sheet-focused entities" },
  netAssets: { range: "2% - 5%", typical: "2%", when: "Entities where net asset position is the primary focus of users" },
  pbt: { range: "5% - 10%", typical: "5%", when: "Profit-oriented entities with stable earnings — volatile profits make this unreliable" },
  totalExpenditure: { range: "1% - 2%", typical: "1%", when: "Not-for-profit entities, charities (per Charities SORP)" },
  grossIncome: { range: "1% - 2%", typical: "1%", when: "Charities and public benefit entities" }
};

export const MATERIALITY_NOTES = {
  performanceMateriality: "Set at 50-75% of overall materiality (ISA 320.11). Lower percentage where: first year audit, history of misstatements, weak internal controls, high-risk industry, significant estimation uncertainty.",
  trivialThreshold: "Misstatements below this amount are clearly trivial and need not be accumulated (ISA 450.A2). Typically 3-5% of overall materiality.",
  revision: "The auditor shall revise materiality in the event of becoming aware of information during the audit that would have caused the auditor to have determined a different amount initially (ISA 320.12)."
};

// ─── FRAUD RISK (ISA 240) ───
export const FRAUD_PRESUMPTIONS = [
  { risk: "Revenue recognition is presumed to be a fraud risk", isa: "ISA 240.26", rebuttal: "The presumption may be rebutted — the auditor shall document the reasons if concluded not applicable", response: "Test revenue transactions around year end for cut-off, vouch material items to contracts, analytical review of revenue trends" },
  { risk: "Management override of controls", isa: "ISA 240.31", rebuttal: "This presumption cannot be rebutted", response: "Test journal entries (ISA 240.32(a)), review accounting estimates for bias (ISA 240.32(b)), evaluate business rationale for significant unusual transactions (ISA 240.32(c))" }
];

export const JOURNAL_ENTRY_TESTING = {
  criteria: [
    "Entries made at unusual times (weekends, holidays, late at night)",
    "Entries made by individuals who do not normally make journal entries",
    "Entries to seldom-used or unusual accounts",
    "Entries with round-number amounts or consistent ending numbers",
    "Entries with no description or vague descriptions",
    "Entries made to accounts that contain transactions that are complex or unusual in nature",
    "Entries that contain related party transactions",
    "Entries posted after the year end but before audit report date"
  ],
  isa_ref: "ISA 240.32(a) — Test appropriateness of journal entries recorded in the general ledger and other adjustments made in the preparation of the financial statements"
};

// ─── GOING CONCERN (ISA 570) ───
export const GOING_CONCERN = {
  financial_indicators: [
    "Net liability or net current liability position",
    "Fixed-term borrowings approaching maturity without realistic prospects of renewal or repayment",
    "Excessive reliance on short-term borrowings to finance long-term assets",
    "Indications of withdrawal of financial support by creditors",
    "Negative operating cash flows indicated by historical or prospective financial statements",
    "Key financial ratios showing adverse trends",
    "Substantial operating losses or significant deterioration in the value of assets used to generate cash flows",
    "Inability to pay creditors on due dates",
    "Arrears or discontinuance of dividends",
    "Inability to comply with the terms of loan agreements (covenant breaches)"
  ],
  operating_indicators: [
    "Management intentions to liquidate the entity or to cease operations",
    "Loss of key management without replacement",
    "Loss of a major market, key customer, franchise, licence, or principal supplier",
    "Labour difficulties or shortages of important supplies",
    "Emergence of a highly successful competitor"
  ],
  auditor_procedures: [
    "Evaluate management's assessment of going concern (ISA 570.12)",
    "Consider whether all relevant events or conditions have been identified (ISA 570.13)",
    "Review management's plans for future actions and assess feasibility (ISA 570.16(b))",
    "Where cash flow forecasts are prepared, evaluate the reliability of the underlying data (ISA 570.16(c))",
    "Obtain written representations from management regarding their plans for future actions (ISA 570.16(e))",
    "Consider events or conditions beyond the going concern assessment period (ISA 570.15)"
  ],
  assessment_period: "At least 12 months from the date of approval of the financial statements (ISA 570.13). For UK companies, this is 12 months from the date the directors sign the accounts."
};

// ─── AUDIT OPINIONS (ISA 700/705/706) ───
export const AUDIT_OPINIONS = {
  unmodified: {
    title: "Unmodified Opinion (Clean)",
    isa: "ISA 700.35",
    when: "Financial statements are prepared, in all material respects, in accordance with the applicable framework",
    wording: "In our opinion the financial statements:\n• give a true and fair view of the state of the company's affairs as at {FYE} and of its [profit/loss] for the year then ended;\n• have been properly prepared in accordance with {FRAMEWORK}; and\n• have been prepared in accordance with the requirements of the Companies Act 2006."
  },
  qualified_misstatement: {
    title: "Qualified Opinion — Material Misstatement",
    isa: "ISA 705.7(a)",
    when: "Misstatements are material but not pervasive to the financial statements",
    wording: "Except for the effects of the matter described in the Basis for Qualified Opinion section of our report, in our opinion the financial statements give a true and fair view...",
    basis: "Basis for Qualified Opinion: [Describe the matter giving rise to the qualification, including quantification where practicable]"
  },
  qualified_scope: {
    title: "Qualified Opinion — Scope Limitation",
    isa: "ISA 705.7(b)",
    when: "Unable to obtain sufficient appropriate audit evidence, but concluded that possible effects are material but not pervasive",
    wording: "Except for the possible effects of the matter described in the Basis for Qualified Opinion section, in our opinion the financial statements give a true and fair view...",
    basis: "Basis for Qualified Opinion: We were unable to obtain sufficient appropriate audit evidence about [describe]. Consequently, we were unable to determine whether any adjustments to this amount were necessary."
  },
  adverse: {
    title: "Adverse Opinion",
    isa: "ISA 705.8(a)",
    when: "Misstatements are both material and pervasive to the financial statements",
    wording: "In our opinion, because of the significance of the matter described in the Basis for Adverse Opinion section, the financial statements do not give a true and fair view...",
    basis: "Basis for Adverse Opinion: [Describe the matter and quantify the effects on the financial statements, or state that quantification is not practicable]"
  },
  disclaimer: {
    title: "Disclaimer of Opinion",
    isa: "ISA 705.9",
    when: "Unable to obtain sufficient appropriate audit evidence and concluded that possible effects could be both material and pervasive",
    wording: "We do not express an opinion on the financial statements. Because of the significance of the matter described in the Basis for Disclaimer of Opinion section, we have not been able to obtain sufficient appropriate audit evidence to provide a basis for an audit opinion.",
    basis: "Basis for Disclaimer of Opinion: [Describe the matter(s) and explain why sufficient appropriate evidence could not be obtained]"
  },
  going_concern_material_uncertainty: {
    title: "Material Uncertainty Related to Going Concern",
    isa: "ISA 570.22",
    when: "Material uncertainty exists and is adequately disclosed in the financial statements",
    wording: "We draw attention to note [X] in the financial statements, which indicates that the company [describe conditions/events]. As stated in note [X], these events or conditions indicate that a material uncertainty exists that may cast significant doubt on the company's ability to continue as a going concern. Our opinion is not modified in respect of this matter."
  },
  emphasis_of_matter: {
    title: "Emphasis of Matter",
    isa: "ISA 706.8",
    when: "Matter is appropriately presented or disclosed in the FS but is of such importance that it is fundamental to users' understanding",
    wording: "We draw attention to note [X] in the financial statements, which describes [the matter]. Our opinion is not modified in respect of this matter."
  }
};

// ─── COMPLETION CHECKLIST (ISA 220/230) ───
export const COMPLETION_CHECKLIST = [
  { ref: "1", item: "All planned audit procedures have been performed", isa: "ISA 330.25", category: "Evidence" },
  { ref: "2", item: "Sufficient appropriate audit evidence has been obtained to support the opinion", isa: "ISA 500.6", category: "Evidence" },
  { ref: "3", item: "Materiality has been reassessed at completion stage", isa: "ISA 320.12", category: "Materiality" },
  { ref: "4", item: "All identified misstatements have been evaluated individually and in aggregate", isa: "ISA 450.5", category: "Misstatements" },
  { ref: "5", item: "Uncorrected misstatements communicated to management and TCWG", isa: "ISA 450.8-9", category: "Misstatements" },
  { ref: "6", item: "Going concern conclusion reached and documented", isa: "ISA 570.17", category: "Going Concern" },
  { ref: "7", item: "Subsequent events reviewed to date of auditor's report", isa: "ISA 560.10", category: "Subsequent Events" },
  { ref: "8", item: "Related party procedures completed", isa: "ISA 550.25", category: "Related Parties" },
  { ref: "9", item: "Written representations obtained from management", isa: "ISA 580.10", category: "Representations" },
  { ref: "10", item: "Those charged with governance matters communicated", isa: "ISA 260.14", category: "Communication" },
  { ref: "11", item: "Significant deficiencies in internal control communicated in writing", isa: "ISA 265.9", category: "Communication" },
  { ref: "12", item: "Audit report form and content appropriate for engagement", isa: "ISA 700.20", category: "Reporting" },
  { ref: "13", item: "EQCR performed (if applicable)", isa: "ISQM (UK) 2.13", category: "Quality" },
  { ref: "14", item: "Engagement partner has reviewed audit documentation", isa: "ISA 220.32", category: "Quality" },
  { ref: "15", item: "Audit file assembly completed within 60 days of auditor's report", isa: "ISA 230.14", category: "Documentation" }
];

// ─── WRITTEN REPRESENTATIONS (ISA 580) ───
export const REPRESENTATIONS = [
  { ref: "1", text: "Management has fulfilled its responsibility for the preparation of the financial statements in accordance with {FRAMEWORK}", isa: "ISA 580.10(a)", mandatory: true },
  { ref: "2", text: "Management has provided the auditor with all relevant information and access as agreed in the engagement letter", isa: "ISA 580.10(b)", mandatory: true },
  { ref: "3", text: "All transactions have been recorded and are reflected in the financial statements", isa: "ISA 580.11(a)", mandatory: true },
  { ref: "4", text: "Management acknowledges its responsibility for the design, implementation and maintenance of internal control", isa: "ISA 580.10(c)", mandatory: true },
  { ref: "5", text: "Management has disclosed to the auditor all known instances of non-compliance or suspected non-compliance with laws and regulations", isa: "ISA 250.16", mandatory: true },
  { ref: "6", text: "Management has disclosed all known actual or possible fraud affecting the entity involving management, employees with significant roles in internal control, or others where fraud could have a material effect", isa: "ISA 240.39", mandatory: true },
  { ref: "7", text: "Management has disclosed all known related party relationships and transactions", isa: "ISA 550.26", mandatory: true },
  { ref: "8", text: "All known claims, litigation and assessments have been disclosed and accounted for in accordance with {FRAMEWORK}", isa: "ISA 501.12", mandatory: true },
  { ref: "9", text: "Management's plans for future actions and the feasibility thereof, as relevant to going concern, have been disclosed", isa: "ISA 570.16(e)", mandatory: true },
  { ref: "10", text: "The selection and application of accounting policies are appropriate, and accounting estimates are reasonable", isa: "ISA 540.37", mandatory: true },
  { ref: "11", text: "Subsequent events requiring adjustment or disclosure have been properly reflected in the financial statements", isa: "ISA 560.9", mandatory: true },
  { ref: "12", text: "The effects of uncorrected misstatements are immaterial, individually and in aggregate, to the financial statements as a whole (list attached)", isa: "ISA 450.14", mandatory: true }
];

// ─── CONTROLS & TRANSACTION CYCLES (ISA 315.14) ───
export const TRANSACTION_CYCLES = {
  revenue: {
    name: "Revenue & Receivables Cycle",
    isa: "ISA 315.14, ISA 240.26",
    processes: ["Order processing", "Despatch/delivery", "Invoicing", "Revenue recognition", "Credit control", "Cash receipts"],
    key_controls: [
      { control: "Segregation of duties between order processing, despatch, invoicing and cash receipts", assertion: "Occurrence; Rights", risk: "Fictitious revenue" },
      { control: "Authorisation of sales orders and credit limits before despatch", assertion: "Occurrence; Accuracy", risk: "Unapproved sales" },
      { control: "Matching of despatch notes to invoices before revenue recognition", assertion: "Cut-off; Accuracy", risk: "Cut-off errors" },
      { control: "Regular reconciliation of sales ledger control account to individual balances", assertion: "Completeness; Accuracy", risk: "Recording errors" },
      { control: "Independent review and approval of credit notes", assertion: "Occurrence; Valuation", risk: "Fictitious credit notes" }
    ],
    walkthrough_steps: ["Select one transaction from initiation to recording", "Trace through each process step", "Identify controls at each point", "Assess design effectiveness", "Test operating effectiveness for key controls being relied upon"]
  },
  purchases: {
    name: "Purchases & Payables Cycle",
    isa: "ISA 315.14",
    processes: ["Purchase requisition", "Ordering", "Goods receipt", "Invoice processing", "Payment"],
    key_controls: [
      { control: "Purchase orders authorised per delegated authority matrix", assertion: "Occurrence; Rights", risk: "Unauthorised purchases" },
      { control: "Three-way match: PO to GRN to invoice before payment", assertion: "Occurrence; Accuracy", risk: "Payment for goods not received" },
      { control: "Segregation of duties between ordering, receiving, invoice processing and payment", assertion: "Occurrence", risk: "Fraud" },
      { control: "Regular supplier statement reconciliations", assertion: "Completeness; Accuracy", risk: "Unrecorded liabilities" },
      { control: "Authorisation of payments per bank mandate", assertion: "Occurrence; Rights", risk: "Unauthorised payments" }
    ]
  },
  payroll: {
    name: "Payroll Cycle",
    isa: "ISA 315.14",
    processes: ["Starter/leaver processing", "Timesheet/attendance", "Payroll calculation", "Payment", "PAYE/NIC remittance"],
    key_controls: [
      { control: "Starters/leavers authorised by HR independent of payroll", assertion: "Occurrence; Completeness", risk: "Ghost employees" },
      { control: "Timesheets authorised by line manager before payroll processing", assertion: "Occurrence; Accuracy", risk: "Fictitious hours" },
      { control: "Payroll reports reviewed and approved before payment release", assertion: "Accuracy; Completeness", risk: "Calculation errors" },
      { control: "Reconciliation of payroll output to bank payment", assertion: "Completeness; Accuracy", risk: "Payment errors" },
      { control: "Monthly PAYE/NIC reconciliation to RTI submissions", assertion: "Accuracy; Completeness", risk: "Compliance risk" }
    ]
  },
  treasury: {
    name: "Treasury & Cash Cycle",
    isa: "ISA 315.14, ISA 505",
    processes: ["Cash receipts", "Cash payments", "Bank reconciliation", "Investment management", "Borrowing management"],
    key_controls: [
      { control: "Daily bank reconciliation prepared and independently reviewed", assertion: "Existence; Completeness", risk: "Misappropriation" },
      { control: "Dual authorisation for payments above threshold", assertion: "Occurrence; Rights", risk: "Unauthorised payments" },
      { control: "Cash and cheque receipts banked intact daily", assertion: "Completeness; Existence", risk: "Teeming and lading" },
      { control: "Regular review of facility headroom and covenant compliance", assertion: "Presentation; Valuation", risk: "Going concern" }
    ]
  }
};

// ─── SUBSTANTIVE PROCEDURES PER AREA ───
export const SUBSTANTIVE_PROCEDURES = {
  d1_revenue: {
    title: "Revenue — Substantive Testing Programme",
    isa: "ISA 240.26, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that revenue is not materially misstated due to fraud or error, and is recognised in accordance with the applicable financial reporting framework (ISA 240.26, ISA 330.6).",
    population: "Sales ledger, sales invoices, contracts, despatch notes, delivery confirmations, credit notes, deferred revenue schedules",
    samplingGuidance: "ISA 530 — stratified monetary unit sampling; items > PM tested 100%, stratified random sample of remainder; emphasis on cut-off and occurrence",
    procedures: [
      { ref: "D1.01", procedure: "Cut-off testing: Select a sample of transactions recorded in the last 10 days before and first 10 days after year end. Vouch to despatch notes/delivery confirmation to verify recording in the correct period.", assertion: "Cut-off", isa: "ISA 240.26; FRS 102 s23", sample: "15-25 items either side of year end" },
      { ref: "D1.02", procedure: "Occurrence testing: Select a sample of revenue transactions from the sales ledger. Vouch to signed contracts, purchase orders, despatch notes, and proof of delivery.", assertion: "Occurrence", isa: "ISA 500.A22", sample: "25-40 items, stratified by value" },
      { ref: "D1.03", procedure: "Completeness testing: Select a sample of despatch notes/delivery records and trace forward to sales invoices and revenue recognition in the general ledger.", assertion: "Completeness", isa: "ISA 330.21", sample: "15-25 items" },
      { ref: "D1.04", procedure: "Accuracy testing: Recalculate invoice totals, verify pricing to contracts/price lists, check VAT treatment, agree to sales ledger posting.", assertion: "Accuracy", isa: "ISA 500", sample: "Included in occurrence sample" },
      { ref: "D1.05", procedure: "Classification: Verify revenue is classified correctly between categories (product/service, domestic/export, by segment).", assertion: "Classification", isa: "ISA 330; FRS 102 s23.30", sample: "Analytical review + sample" },
      { ref: "D1.06", procedure: "Credit note testing: Select sample of credit notes issued post year-end. Assess whether any relate to pre year-end revenue and should be adjusted.", assertion: "Cut-off; Valuation", isa: "ISA 240.26", sample: "All credit notes in first 30 days post YE" },
      { ref: "D1.07", procedure: "Deferred revenue: Obtain schedule of deferred revenue. Test sample to contracts — verify performance obligations and recognition timing under 5-step model.", assertion: "Cut-off; Accuracy", isa: "FRS 102 s23 (Revised 2026)", sample: "All items > PM" },
      { ref: "D1.08", procedure: "Analytical review: Compare revenue by month/product/customer to prior year and budget. Investigate variances > 10% or unexpected trends.", assertion: "Overall reasonableness", isa: "ISA 520.5", sample: "N/A — full population" }
    ],
    expectedResults: "Revenue transactions are supported by valid contracts and delivery evidence, recorded in the correct period, and classified appropriately. No indicators of fictitious revenue or management override.",
    exceptionHandling: "Revenue recorded without supporting delivery evidence or contract to be reported immediately. Cut-off errors to be quantified and extrapolated if from a sample. Unusual revenue patterns or related party transactions to be escalated to engagement partner.",
    conclusionTemplate: "Based on the procedures performed, revenue is [fairly stated/materially misstated] in accordance with FRS 102 Section 23 and is free from [material misstatement due to fraud or error]."
  },
  d2_receivables: {
    title: "Receivables — Substantive Testing Programme",
    isa: "ISA 505, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that trade receivables exist, are complete, are valued at recoverable amounts, and represent rights of the entity at the reporting date.",
    population: "Trade receivables ledger, aged receivables analysis, bad debt provision schedule, subsequent receipts, sales ledger control account",
    samplingGuidance: "ISA 530 — stratified sampling by value; circularisation covering 60%+ of balance; aged debt review for valuation assertion",
    procedures: [
      { ref: "D2.01", procedure: "Circularisation: Send positive confirmations to a sample of trade receivable balances at year end. For non-replies, perform alternative procedures (subsequent receipts, invoice/despatch evidence).", assertion: "Existence; Accuracy", isa: "ISA 505.7", sample: "Select balances covering 60%+ of total receivables value" },
      { ref: "D2.02", procedure: "Subsequent receipts: For the entire receivables ledger, test post year-end cash receipts against outstanding balances to confirm existence and recoverability.", assertion: "Existence; Valuation", isa: "ISA 330.20", sample: "All balances > PM, sample of remainder" },
      { ref: "D2.03", procedure: "Aged debt review: Obtain aged receivables analysis. Identify overdue balances. Discuss recoverability with management. Assess adequacy of bad debt provision.", assertion: "Valuation", isa: "ISA 540; FRS 102 s11.21-22", sample: "All balances > 90 days overdue" },
      { ref: "D2.04", procedure: "Completeness: Reconcile sales ledger control account to list of individual balances. Investigate reconciling items.", assertion: "Completeness", isa: "ISA 330.21", sample: "100% — full reconciliation" },
      { ref: "D2.05", procedure: "Cut-off: Test sales invoices and credit notes around year end for correct period recording.", assertion: "Cut-off", isa: "ISA 240.26", sample: "Last/first 10 days" },
      { ref: "D2.06", procedure: "Intercompany: Confirm intercompany receivable balances. Reconcile and investigate any differences.", assertion: "Existence; Accuracy", isa: "ISA 550.25", sample: "All intercompany balances" },
      { ref: "D2.07", procedure: "Bad debt provision: Assess the methodology and inputs used by management to calculate the bad debt provision. Test the ageing analysis for accuracy, review historical write-off rates, and evaluate whether the provision is adequate and in line with FRS 102 Section 11 ECL requirements.", assertion: "Valuation", isa: "ISA 540.8; FRS 102 s11.21-22", sample: "Review methodology + test all inputs" },
      { ref: "D2.08", procedure: "Analytical review: Compare receivable balances, debtor days, and provision ratios to prior year, budget, and industry norms. Investigate significant or unexpected variances. Corroborate explanations to supporting data.", assertion: "Overall reasonableness", isa: "ISA 520.5", sample: "N/A — full population analytical" }
    ],
    expectedResults: "Receivable balances confirmed by third parties or agreed to subsequent receipts. Bad debt provision adequate based on ageing and historical experience. No material disputed or irrecoverable balances.",
    exceptionHandling: "Confirmation exceptions or non-replies requiring alternative procedures to be documented. Irrecoverable balances identified but not provided for to be quantified and reported to management.",
    conclusionTemplate: "Based on the procedures performed, trade receivables [exist and are recoverable/are materially misstated] at the reporting date in accordance with FRS 102 Section 11."
  },
  d3_inventory: {
    title: "Inventory / WIP — Substantive Testing Programme",
    isa: "ISA 501, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that inventory exists, is complete, is owned by the entity, and is valued at the lower of cost and net realisable value.",
    population: "Perpetual inventory records, stock count sheets, purchase invoices, production records, NRV calculations, third-party stock confirmations",
    samplingGuidance: "ISA 530 — physical count observation with independent test counts; cost testing using stratified sample across categories (raw materials, WIP, finished goods)",
    procedures: [
      { ref: "D3.01", procedure: "Stock count attendance: Attend the entity's physical inventory count. Observe count procedures, perform independent test counts, investigate discrepancies, conclude on reliability of count.", assertion: "Existence", isa: "ISA 501.4", sample: "N/A — attendance and test counts per ISA 501" },
      { ref: "D3.02", procedure: "Cost testing: Select sample of inventory items. Test cost build-up to purchase invoices (raw materials) or production records (WIP/finished goods). Verify overhead absorption rates.", assertion: "Valuation", isa: "ISA 501.4; FRS 102 s13.5-13.8", sample: "20-30 items across categories" },
      { ref: "D3.03", procedure: "NRV testing: For items identified as slow-moving or obsolete, compare carrying value to post year-end selling price less costs to sell.", assertion: "Valuation", isa: "FRS 102 s13.4", sample: "All items with low/no movement in 6+ months" },
      { ref: "D3.04", procedure: "Cut-off: Test goods received notes and despatch notes around year end. Verify correct inclusion/exclusion from inventory and recording in correct period.", assertion: "Cut-off; Existence", isa: "ISA 501.4", sample: "Last/first 5 days GRN + despatch" },
      { ref: "D3.05", procedure: "Provision assessment: Review and challenge management's obsolescence/slow-moving provision methodology. Compare to historical write-off rates.", assertion: "Valuation", isa: "ISA 540; FRS 102 s13.4", sample: "Review methodology + test inputs" },
      { ref: "D3.06", procedure: "Ownership and consignment: Verify no third-party stock included. Confirm stock held at third-party locations is included.", assertion: "Rights; Completeness", isa: "ISA 501.4", sample: "Enquiry + confirmation for material locations" },
      { ref: "D3.07", procedure: "WIP valuation: For work-in-progress items, test the stage of completion assessment. Verify labour hours, material costs, and overhead absorption rates to underlying records. Compare estimated costs to complete against contract terms.", assertion: "Valuation; Accuracy", isa: "ISA 540.8; FRS 102 s13.8-13.13", sample: "All WIP items > PM + sample of remainder" },
      { ref: "D3.08", procedure: "Analytical review: Compare inventory levels, turnover days, and gross margins by category to prior year and industry benchmarks. Investigate slow-moving or obsolete categories. Corroborate explanations with operational management.", assertion: "Overall reasonableness", isa: "ISA 520.5", sample: "N/A — full population analytical" }
    ],
    expectedResults: "Inventory quantities agree to physical count and perpetual records. Cost build-up supported by purchase invoices and production records. NRV exceeds cost for all material items or adequate provision held.",
    exceptionHandling: "Count discrepancies exceeding tolerance to be investigated and resolved before concluding. Items valued above NRV to be quantified for potential write-down. Third-party stock not confirmed to be treated as an exception.",
    conclusionTemplate: "Based on the procedures performed, inventory is [fairly stated/materially misstated] at the lower of cost and NRV in accordance with FRS 102 Section 13."
  },
  d4_payables: {
    title: "Payables — Substantive Testing Programme",
    isa: "ISA 505, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that trade payables and accruals are complete, exist, are accurately recorded, and relate to obligations of the entity at the reporting date.",
    population: "Trade payables ledger, accruals schedule, supplier statements, purchase invoices",
    samplingGuidance: "ISA 530 — stratified sampling by value, focus on completeness assertion",
    procedures: [
      { ref: "D4.01", procedure: "Supplier statement reconciliation: Obtain statements from a sample of major suppliers at year end. Reconcile to purchase ledger balances, investigating all reconciling items including timing differences, disputed amounts, and unrecorded invoices.", assertion: "Completeness; Accuracy", isa: "ISA 505.7; ISA 330.20", sample: "Top 20 suppliers by value + random sample of 10 others" },
      { ref: "D4.02", procedure: "Unrecorded liabilities search: Examine post year-end bank payments, purchase invoices received post year-end, and GRN logs to identify goods/services received before year end but not accrued. Quantify any unrecorded amounts.", assertion: "Completeness", isa: "ISA 330.21; ISA 240.32", sample: "All payments in first 30 days post year end > PM" },
      { ref: "D4.03", procedure: "GRNI (Goods Received Not Invoiced) review: Obtain the GRNI accrual schedule. Test sample of items to GRNs, purchase orders and subsequent invoices. Challenge aged items > 60 days for validity.", assertion: "Completeness; Valuation", isa: "ISA 330.20; FRS 102 s21", sample: "All items > PM + sample of remainder" },
      { ref: "D4.04", procedure: "Cut-off testing: Select purchase invoices and GRNs in the last 5 days before and first 5 days after year end. Verify recording in correct period by reference to delivery dates and terms.", assertion: "Cut-off", isa: "ISA 240.26; ISA 330.20", sample: "15-20 items either side of year end" },
      { ref: "D4.05", procedure: "Supplier circularisation: Send positive confirmations to a sample of supplier balances at year end. For non-replies, perform alternative procedures (statement reconciliation, subsequent payments, invoice matching).", assertion: "Completeness; Existence", isa: "ISA 505.7-12", sample: "Balances covering 50%+ of total payables value" },
      { ref: "D4.06", procedure: "Accruals testing: Obtain accruals schedule. Test each material accrual to supporting documentation (contracts, invoices, calculations). Assess reasonableness of estimates. Compare to prior year and actual outcomes.", assertion: "Completeness; Valuation", isa: "ISA 540.8; FRS 102 s21.4", sample: "All accruals > PM individually + sample below" },
      { ref: "D4.07", procedure: "Purchase ledger reconciliation: Reconcile the purchase ledger control account to the list of individual supplier balances. Investigate all reconciling items. Verify no debit balances requiring reclassification.", assertion: "Accuracy; Classification", isa: "ISA 330.20", sample: "100% — full reconciliation" },
      { ref: "D4.08", procedure: "Analytical review: Compare trade payables and accruals to prior year. Calculate payable days ratio and compare to prior periods and industry norms. Investigate unusual fluctuations > 10%.", assertion: "Overall reasonableness", isa: "ISA 520.5", sample: "N/A — full population" }
    ],
    expectedResults: "All payable balances confirmed or agreed to supporting documentation with no material unrecorded liabilities identified. GRNI and accruals supported by valid obligations.",
    exceptionHandling: "Any unrecorded liabilities identified to be reported to management and quantified for potential adjustment. Disputed balances investigated and conclusion reached on correct treatment.",
    conclusionTemplate: "Based on the procedures performed, trade payables are [complete/materially misstated] and recorded at appropriate amounts in accordance with FRS 102."
  },
  d5_payroll: {
    title: "Payroll — Substantive Testing Programme",
    isa: "ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that payroll costs are accurately recorded, relate to bona fide employees, and that PAYE/NIC liabilities are properly stated.",
    population: "Payroll records, P11Ds, RTI submissions, employment contracts, bonus schedules, pension auto-enrolment records",
    samplingGuidance: "ISA 530 — stratified sampling; separate testing for starters, leavers, and ongoing employees",
    procedures: [
      { ref: "D5.01", procedure: "Analytical review of payroll: Perform month-by-month comparison of gross pay, employer NIC, pension contributions, and headcount to prior year and budget. Investigate variances > 5% or unexpected trends.", assertion: "Overall reasonableness", isa: "ISA 520.5", sample: "N/A — full population analytical" },
      { ref: "D5.02", procedure: "Starters testing: Select a sample of new joiners in the year. Verify to signed employment contracts, agreed salary, HR approval, right-to-work documentation, and correct payroll start date.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20", sample: "10-15 new starters across the year" },
      { ref: "D5.03", procedure: "Leavers testing: Select a sample of employees who left during the year. Verify final pay calculation, holiday pay accrual, P45 issuance, and that no further payments were made after leaving date.", assertion: "Occurrence; Cut-off", isa: "ISA 330.20; ISA 240.32", sample: "10-15 leavers across the year" },
      { ref: "D5.04", procedure: "PAYE/NIC reconciliation: Reconcile PAYE and NIC per payroll summaries to RTI submissions (FPS/EPS) filed with HMRC. Agree year-end liability to HMRC account and post year-end payments.", assertion: "Completeness; Accuracy", isa: "ISA 330.20", sample: "100% — full reconciliation for all periods" },
      { ref: "D5.05", procedure: "Bonus and commission accrual: Obtain bonus/commission calculation. Agree inputs to KPIs/targets, verify calculation methodology to scheme documentation, and test for correct accrual at year end.", assertion: "Completeness; Valuation", isa: "ISA 540.8; FRS 102 s28", sample: "All material bonus schemes + sample of individual calculations" },
      { ref: "D5.06", procedure: "Pension contributions: Verify employer pension contributions to pension scheme correspondence. Confirm auto-enrolment compliance. Test year-end pension creditor to post year-end payment.", assertion: "Completeness; Accuracy", isa: "ISA 330.20; FRS 102 s28.13", sample: "All pension schemes — 12-month reconciliation" },
      { ref: "D5.07", procedure: "Recalculation of net pay: For a sample of employees, recalculate gross to net pay including tax, NIC (employee and employer), pension, student loan, and other deductions using HMRC rates.", assertion: "Accuracy", isa: "ISA 330.20", sample: "5-10 employees per month for 2-3 selected months" },
      { ref: "D5.08", procedure: "Directors' remuneration: Agree all directors' remuneration to board minutes, service contracts, and Companies Act 2006 disclosure requirements. Verify benefits in kind to P11D submissions.", assertion: "Accuracy; Disclosure", isa: "ISA 330.20; CA 2006 s412-413", sample: "100% of directors" }
    ],
    expectedResults: "Payroll costs reconcile to RTI submissions and are supported by valid employment records. PAYE/NIC liabilities correctly stated at year end.",
    exceptionHandling: "Ghost employees or unauthorised payments to be reported immediately. PAYE/NIC discrepancies quantified and discussed with management.",
    conclusionTemplate: "Based on the procedures performed, payroll costs are [fairly stated/materially misstated] and related liabilities are [complete/incomplete] at the reporting date."
  },
  d6_cash: {
    title: "Cash & Bank — Substantive Testing Programme",
    isa: "ISA 505, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that cash and bank balances exist, are complete, accurately recorded, and belong to the entity at the reporting date.",
    population: "Bank statements, bank reconciliations, bank confirmation letters, cash books, petty cash records",
    samplingGuidance: "ISA 530 — all bank accounts tested; sample of reconciling items by value",
    procedures: [
      { ref: "D6.01", procedure: "Bank confirmation: Send standard audit bank confirmation letters to all banks where the entity holds accounts. Agree confirmed balances to bank reconciliation and nominal ledger. Note any facilities, charges, or security disclosed.", assertion: "Existence; Completeness", isa: "ISA 505.7; ISA 505.A5", sample: "100% — all bank accounts" },
      { ref: "D6.02", procedure: "Bank reconciliation testing: Obtain bank reconciliations for all accounts at year end. Agree balance per bank to confirmation/statement, agree balance per books to trial balance. Test all material reconciling items to post year-end clearance.", assertion: "Existence; Accuracy", isa: "ISA 330.20", sample: "100% of accounts; all reconciling items > PM" },
      { ref: "D6.03", procedure: "Outstanding cheques clearance: For unpresented cheques at year end, verify clearance to post year-end bank statements. Investigate any cheques unpresented for > 6 months for possible reversal.", assertion: "Existence; Valuation", isa: "ISA 330.20", sample: "All unpresented cheques > PM" },
      { ref: "D6.04", procedure: "Outstanding lodgements: For deposits in transit at year end, verify clearance to post year-end bank statements within expected timeframes. Investigate items not clearing within 5 working days.", assertion: "Existence", isa: "ISA 330.20", sample: "All outstanding lodgements" },
      { ref: "D6.05", procedure: "Petty cash: Attend surprise count of petty cash (or count at year end). Agree float to nominal ledger. Test sample of petty cash vouchers for proper authorisation and supporting receipts.", assertion: "Existence; Accuracy", isa: "ISA 501.4 (by analogy)", sample: "Physical count + 15-20 vouchers" },
      { ref: "D6.06", procedure: "Bank facility review: Obtain and review all bank facility letters. Confirm facilities, covenants, and security disclosed in financial statements. Assess headroom and going concern implications.", assertion: "Completeness; Disclosure", isa: "ISA 505.A5; ISA 570", sample: "All facilities" },
      { ref: "D6.07", procedure: "Restricted cash: Enquire of management regarding any cash balances subject to restrictions (escrow, ring-fenced, overseas exchange controls). Verify separate disclosure if material.", assertion: "Classification; Disclosure", isa: "ISA 330.20; FRS 102 s7", sample: "All restricted balances identified" },
      { ref: "D6.08", procedure: "Multi-currency bank accounts: For foreign currency accounts, verify the exchange rate used at year end to an independent source (e.g. Bank of England closing rate). Recalculate the sterling equivalent and any exchange gains/losses.", assertion: "Valuation; Accuracy", isa: "ISA 330.20; FRS 102 s30.2", sample: "100% of foreign currency accounts" }
    ],
    expectedResults: "All bank balances confirmed by third-party banks and reconciled to the nominal ledger without material unexplained reconciling items.",
    exceptionHandling: "Unreconciled items or discrepancies with bank confirmations to be investigated immediately. Any undisclosed facilities or security to be raised with management.",
    conclusionTemplate: "Based on the procedures performed, cash and bank balances [exist and are accurately stated/are materially misstated] at the reporting date."
  },
  d7_fixed_assets: {
    title: "Fixed Assets — Substantive Testing Programme",
    isa: "ISA 540, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that property, plant and equipment exist, are owned by the entity, are not impaired, and are accurately recorded at cost less accumulated depreciation.",
    population: "Fixed asset register, purchase invoices, title deeds, lease agreements, depreciation schedules, impairment reviews",
    samplingGuidance: "ISA 530 — test all additions/disposals above PM; sample below PM stratified by asset class",
    procedures: [
      { ref: "D7.01", procedure: "Additions testing: Select a sample of additions in the year. Vouch to purchase invoices, delivery notes, and board/capex approval. Verify capitalisation is appropriate (not revenue expenditure) per FRS 102 s17.4-17.6.", assertion: "Existence; Valuation", isa: "ISA 330.20; FRS 102 s17.4", sample: "All additions > PM + sample of remainder" },
      { ref: "D7.02", procedure: "Disposals testing: Select a sample of disposals in the year. Verify sale proceeds to remittance, recalculate profit/loss on disposal, confirm asset removed from register and ledger.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20; FRS 102 s17.28", sample: "All disposals > PM + sample" },
      { ref: "D7.03", procedure: "Depreciation recalculation: For each asset class, verify depreciation rates to accounting policy. Recalculate the annual depreciation charge for a sample of assets. Agree total to nominal ledger.", assertion: "Accuracy; Valuation", isa: "ISA 330.20; FRS 102 s17.21-22", sample: "Sample of 15-20 assets across all classes" },
      { ref: "D7.04", procedure: "Physical verification: For a sample of assets from the fixed asset register, physically verify existence and condition. Conversely, select assets observed on-site and trace to register.", assertion: "Existence; Completeness", isa: "ISA 501.4 (by analogy)", sample: "10-15 items each direction" },
      { ref: "D7.05", procedure: "Ownership verification: Verify ownership of property through title deeds or Land Registry search. For vehicles, check V5C registration documents. For leased assets, review lease classification (finance vs operating).", assertion: "Rights & Obligations", isa: "ISA 330.20; FRS 102 s17.3", sample: "All properties + sample of vehicles/plant" },
      { ref: "D7.06", procedure: "Impairment review: Enquire of management regarding indicators of impairment per FRS 102 s27. Where indicators exist, assess management's impairment calculation including assumptions on value in use and fair value less costs to sell.", assertion: "Valuation", isa: "ISA 540.8; FRS 102 s27.5-9", sample: "All CGUs with impairment indicators" },
      { ref: "D7.07", procedure: "Capital commitments: Enquire of management and review board minutes, contracts, and capex budgets for capital commitments at year end requiring disclosure.", assertion: "Completeness; Disclosure", isa: "ISA 330.20; FRS 102 s17.32e", sample: "Review all board minutes and contracts" },
      { ref: "D7.08", procedure: "Fixed asset register reconciliation: Reconcile the fixed asset register totals (cost and accumulated depreciation by class) to the nominal ledger. Investigate all reconciling differences.", assertion: "Accuracy; Completeness", isa: "ISA 330.20", sample: "100% — full reconciliation by asset class" }
    ],
    expectedResults: "Fixed asset register reconciles to nominal ledger. Additions supported by valid invoices and approvals. Depreciation rates appropriate and consistently applied.",
    exceptionHandling: "Assets not physically located to be investigated for potential write-off. Revenue expenditure capitalised to be adjusted. Impairment losses not recognised to be quantified.",
    conclusionTemplate: "Based on the procedures performed, property, plant and equipment are [fairly stated/materially misstated] at the reporting date in accordance with FRS 102 s17."
  },
  d8_intangibles: {
    title: "Intangibles & Goodwill — Substantive Testing Programme",
    isa: "FRS 102 s18/19, ISA 540",
    objective: "To obtain sufficient appropriate audit evidence that intangible assets and goodwill are appropriately recognised, measured at cost less accumulated amortisation and impairment, and properly disclosed.",
    population: "Intangible asset register, development cost records, acquisition agreements, amortisation schedules, impairment reviews",
    samplingGuidance: "ISA 530 — all individually material items tested; sample of development projects by value",
    procedures: [
      { ref: "D8.01", procedure: "Development cost capitalisation: For each capitalised development project, verify all six FRS 102 s18.8H criteria are met: technical feasibility, intention to complete, ability to use/sell, probable future economic benefits, adequate resources, ability to measure expenditure reliably.", assertion: "Existence; Valuation", isa: "ISA 330.20; FRS 102 s18.8H", sample: "All projects with capitalised costs in year" },
      { ref: "D8.02", procedure: "Capitalised cost testing: Select sample of costs capitalised to intangible assets. Vouch to timesheets (internal), invoices (external), and verify costs are directly attributable. Challenge any overhead allocations.", assertion: "Accuracy; Valuation", isa: "ISA 330.20; FRS 102 s18.10", sample: "Sample covering 70%+ of costs capitalised in year" },
      { ref: "D8.03", procedure: "Amortisation review: For each class of intangible asset, verify amortisation period and method to accounting policy and FRS 102. Recalculate annual amortisation charge and agree to nominal ledger.", assertion: "Accuracy; Valuation", isa: "ISA 330.20; FRS 102 s18.21-22", sample: "All asset classes — recalculate for each" },
      { ref: "D8.04", procedure: "Goodwill impairment review: Obtain management's impairment review for goodwill and indefinite-life intangibles. Assess reasonableness of cash flow projections, growth rates, and discount rates. Perform sensitivity analysis on key assumptions.", assertion: "Valuation", isa: "ISA 540.8-13; FRS 102 s19.24", sample: "All CGUs to which goodwill is allocated" },
      { ref: "D8.05", procedure: "Useful life assessment: Challenge management's assessment of useful economic life for each class of intangible. Where life exceeds 10 years (FRS 102) or is indefinite, verify additional impairment review performed annually.", assertion: "Valuation", isa: "FRS 102 s18.20-21; s19.23", sample: "All intangible asset classes" },
      { ref: "D8.06", procedure: "Acquired intangibles: For intangibles acquired during the year (including through business combinations), verify to acquisition agreement, independent valuation report, and purchase price allocation.", assertion: "Existence; Valuation", isa: "ISA 540.8; FRS 102 s19.14-15", sample: "All acquisitions in year" },
      { ref: "D8.07", procedure: "Research expenditure: Verify all research phase expenditure has been expensed and not capitalised. Review project documentation to confirm appropriate identification of research vs development phases.", assertion: "Classification; Valuation", isa: "FRS 102 s18.8C-8G", sample: "All R&D projects with expenditure in year" },
      { ref: "D8.08", procedure: "Disclosure review: Verify disclosures for intangible assets meet FRS 102 s18.27-28 including useful lives, amortisation methods, reconciliation of carrying amounts, and any restrictions on title.", assertion: "Disclosure", isa: "FRS 102 s18.27-28; s19.25-26", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "Capitalised development costs meet all six FRS 102 criteria. Amortisation charges correctly calculated. Goodwill subject to annual impairment review with supportable assumptions.",
    exceptionHandling: "Development costs not meeting all six criteria to be expensed. Impairment losses identified but not recognised to be quantified and proposed as adjustments.",
    conclusionTemplate: "Based on the procedures performed, intangible assets and goodwill are [appropriately recognised and measured/materially misstated] in accordance with FRS 102 s18/19."
  },
  d9_investments: {
    title: "Investments — Substantive Testing Programme",
    isa: "FRS 102 s14/15, ISA 540",
    objective: "To obtain sufficient appropriate audit evidence that investments in subsidiaries, associates, and other entities exist, are owned, are measured at cost or fair value as appropriate, and are not impaired.",
    population: "Investment schedule, share certificates, Companies House filings, subsidiary financial statements, fair value reports",
    samplingGuidance: "ISA 530 — all individually material investments tested; smaller holdings by sample",
    procedures: [
      { ref: "D9.01", procedure: "Investment schedule: Obtain management's schedule of investments at year end. Reconcile opening to closing (additions, disposals, revaluations, impairments). Agree closing balances to nominal ledger.", assertion: "Completeness; Accuracy", isa: "ISA 330.20", sample: "100% — full reconciliation" },
      { ref: "D9.02", procedure: "Existence and ownership: For each investment, verify existence through share certificates, Companies House confirmation statements, or custodian confirmations. Confirm the entity is the registered holder.", assertion: "Existence; Rights", isa: "ISA 505.7; ISA 330.20", sample: "All investments" },
      { ref: "D9.03", procedure: "Subsidiary net assets review: For investments in subsidiaries carried at cost, compare the carrying amount to the subsidiary's net assets per audited accounts. Where carrying value exceeds net assets, assess need for impairment.", assertion: "Valuation", isa: "ISA 540.8; FRS 102 s14.8", sample: "All subsidiary investments" },
      { ref: "D9.04", procedure: "Fair value measurement: For investments carried at fair value, assess the valuation methodology and inputs used. For quoted investments, agree to market price. For unquoted, challenge valuation approach and key assumptions.", assertion: "Valuation", isa: "ISA 540.8-13; FRS 102 s14.4-14.5", sample: "All investments at fair value" },
      { ref: "D9.05", procedure: "Impairment indicators: For investments carried at cost less impairment, enquire of management regarding impairment indicators per FRS 102 s27. Consider subsidiary/associate trading performance, net asset position, and market conditions.", assertion: "Valuation", isa: "ISA 540.8; FRS 102 s27.5", sample: "All investments at cost" },
      { ref: "D9.06", procedure: "Dividend income: Verify dividend income received from investments to board minutes/resolutions of investee companies. Confirm treatment as income not capital return (exceeding pre-acquisition profits).", assertion: "Occurrence; Accuracy", isa: "ISA 330.20; FRS 102 s14.8", sample: "All dividends received" },
      { ref: "D9.07", procedure: "Additions and disposals: For investments acquired or disposed of during the year, vouch to sale/purchase agreements, board minutes, and bank transactions. Verify calculation of profit/loss on disposal.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20", sample: "All additions/disposals in year" },
      { ref: "D9.08", procedure: "Disclosure: Verify disclosures for investments meet FRS 102 s14/15 requirements including name of subsidiaries/associates, proportion held, accounting policy, and any restrictions.", assertion: "Disclosure", isa: "FRS 102 s14.12-15; s15.21", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "All investments verified to share certificates or confirmations. Carrying values supported by subsidiary net assets or fair value evidence. No unrecognised impairments.",
    exceptionHandling: "Where carrying value exceeds recoverable amount, impairment to be quantified and proposed as adjustment. Unverified investments to be reported to management.",
    conclusionTemplate: "Based on the procedures performed, investments are [fairly stated/materially misstated] at the reporting date in accordance with FRS 102 s14/15."
  },
  d10_equity: {
    title: "Share Capital & Reserves — Substantive Testing Programme",
    isa: "FRS 102 s22, ISA 330",
    objective: "To obtain sufficient appropriate audit evidence that share capital and reserves are accurately recorded, all movements are properly authorised, and dividends are legally permissible.",
    population: "Companies House records, share register, board minutes, dividend vouchers, articles of association, statutory books",
    samplingGuidance: "ISA 530 — typically full population testing given limited number of transactions",
    procedures: [
      { ref: "D10.01", procedure: "Companies House verification: Agree issued share capital to Companies House confirmation statement. Verify registered share capital, number and class of shares issued, and registered charges.", assertion: "Existence; Accuracy", isa: "ISA 330.20; CA 2006 s542-548", sample: "100% — full verification" },
      { ref: "D10.02", procedure: "Share movements: For any share issues or buybacks during the year, vouch to board minutes, shareholder resolutions, allotment forms (SH01), and Companies House filings. Verify consideration received.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20; CA 2006 s549-551", sample: "All share movements in year" },
      { ref: "D10.03", procedure: "Share premium: Verify any share premium arising on share issues is correctly calculated (excess of issue price over nominal value) and credited to share premium account.", assertion: "Accuracy; Classification", isa: "ISA 330.20; CA 2006 s610", sample: "All issues at premium in year" },
      { ref: "D10.04", procedure: "Dividend legality: For dividends paid or proposed, verify sufficient distributable reserves existed at the date of payment per CA 2006 s830. Agree to board minutes/shareholder approval. Verify payment to dividend vouchers.", assertion: "Occurrence; Rights", isa: "ISA 330.20; CA 2006 s830-831", sample: "All dividends declared in year" },
      { ref: "D10.05", procedure: "Reserves reconciliation: Reconcile all reserve balances from opening to closing, identifying each movement (profit/loss, dividends, revaluation, share premium, other comprehensive income).", assertion: "Accuracy; Completeness", isa: "ISA 330.20; FRS 102 s22.3", sample: "100% — full reconciliation" },
      { ref: "D10.06", procedure: "Distributable reserves calculation: Prepare or review management's distributable reserves calculation per CA 2006 and Tech 02/17BL guidance. Verify accumulated realised profits and losses.", assertion: "Accuracy", isa: "CA 2006 s830; Tech 02/17BL", sample: "N/A — full calculation" },
      { ref: "D10.07", procedure: "Treasury shares: Where the entity holds treasury shares, verify compliance with CA 2006 s724-732. Confirm correctly deducted from equity. Verify no more than 10% held (private company).", assertion: "Accuracy; Compliance", isa: "ISA 330.20; CA 2006 s724", sample: "All treasury share transactions" },
      { ref: "D10.08", procedure: "Disclosure: Verify statement of changes in equity is complete and accurate. Confirm all classes of share capital disclosed with number and nominal value. Verify dividend per share disclosure.", assertion: "Disclosure", isa: "FRS 102 s6.3-6.5; s22.7", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "Share capital agrees to Companies House. All movements properly authorised. Dividends paid from distributable reserves.",
    exceptionHandling: "Unlawful dividends to be reported to those charged with governance. Unauthorised share issues to be investigated. Companies House discrepancies to be resolved.",
    conclusionTemplate: "Based on the procedures performed, share capital and reserves are [correctly stated/materially misstated] in accordance with CA 2006 and FRS 102 s22."
  },
  d11_loans: {
    title: "Loans & Borrowings — Substantive Testing Programme",
    isa: "FRS 102 s11, ISA 505",
    objective: "To obtain sufficient appropriate audit evidence that loans and borrowings are complete, exist, are accurately measured at amortised cost, and that covenant compliance and disclosures are appropriate.",
    population: "Loan agreements, bank confirmations, amortisation schedules, covenant compliance certificates, board minutes",
    samplingGuidance: "ISA 530 — typically full population testing given limited number of facilities; all material loans individually tested",
    procedures: [
      { ref: "D11.01", procedure: "Bank confirmation: Send standard bank confirmation letters requesting details of all loans, overdrafts, facilities, and security held. Agree confirmed balances and terms to accounting records.", assertion: "Completeness; Existence", isa: "ISA 505.7; ISA 505.A5", sample: "All banking relationships" },
      { ref: "D11.02", procedure: "Loan agreement review: Obtain and review all loan and facility agreements. Note key terms including interest rate, repayment schedule, maturity date, security given, and financial covenants.", assertion: "Accuracy; Completeness", isa: "ISA 330.20; FRS 102 s11.15", sample: "All loan agreements" },
      { ref: "D11.03", procedure: "Covenant compliance: For each loan with financial covenants, obtain or prepare the covenant compliance calculation at year end. Verify inputs and assess whether covenants are met. Consider going concern implications of any breach.", assertion: "Disclosure; Going concern", isa: "ISA 570.16; FRS 102 s11.15", sample: "All loans with covenants" },
      { ref: "D11.04", procedure: "Interest recalculation: For each material loan, recalculate the interest charge for the year using the effective interest rate. Agree to nominal ledger. Verify interest accrual at year end.", assertion: "Accuracy", isa: "ISA 330.20; FRS 102 s11.15-20", sample: "All material loans" },
      { ref: "D11.05", procedure: "Classification: Verify correct split between current (due within 12 months) and non-current liabilities based on repayment schedules. Consider impact of covenant breaches on classification per FRS 102.", assertion: "Classification", isa: "FRS 102 s11.13; s4.7", sample: "All loans" },
      { ref: "D11.06", procedure: "New borrowings: For loans drawn down during the year, vouch to signed facility agreement, board approval, and bank statement. Verify any arrangement fees are accounted for as part of effective interest rate.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20; FRS 102 s11.20", sample: "All new borrowings in year" },
      { ref: "D11.07", procedure: "Repayments: For loan repayments made during the year, agree to bank statements and recalculate the impact on outstanding balance. Verify correct treatment of any early repayment penalties.", assertion: "Occurrence; Accuracy", isa: "ISA 330.20", sample: "All repayments in year" },
      { ref: "D11.08", procedure: "Disclosure review: Verify disclosures for borrowings meet FRS 102 s11 requirements including carrying amounts, maturity analysis, interest rates, security given, and undrawn facilities.", assertion: "Disclosure", isa: "FRS 102 s11.41-48", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "All loan balances confirmed by banks and reconciled to accounting records. Covenants complied with or breach impact assessed. Interest charges correctly calculated.",
    exceptionHandling: "Covenant breaches to be assessed for going concern implications and disclosure requirements. Undisclosed facilities or security to be raised with management.",
    conclusionTemplate: "Based on the procedures performed, loans and borrowings are [fairly stated/materially misstated] and [covenant-compliant/in breach] at the reporting date."
  },
  d12_provisions: {
    title: "Provisions & Contingencies — Substantive Testing Programme",
    isa: "FRS 102 s21, ISA 540",
    objective: "To obtain sufficient appropriate audit evidence that provisions represent present obligations arising from past events, are measured at the best estimate of the amount required to settle, and contingencies are appropriately disclosed.",
    population: "Provisions schedule, legal correspondence, warranty claims records, solicitor's letters, board minutes, contracts",
    samplingGuidance: "ISA 530 — all material provisions individually assessed; contingencies assessed for completeness through multiple sources",
    procedures: [
      { ref: "D12.01", procedure: "FRS 102 s21.4 criteria: For each provision, verify all three recognition criteria are met: present obligation from past event, probable outflow of economic benefits, and reliable estimate of amount. Document conclusion for each.", assertion: "Existence; Valuation", isa: "ISA 540.8; FRS 102 s21.4", sample: "All provisions" },
      { ref: "D12.02", procedure: "Solicitor's letter: Send standard audit enquiry letter to the entity's solicitors requesting details of all outstanding litigation, claims, and contingencies. Agree responses to provisions and disclosures.", assertion: "Completeness; Valuation", isa: "ISA 501.9; ISA 540.8", sample: "All solicitors used during the year" },
      { ref: "D12.03", procedure: "Warranty provision: Obtain management's warranty provision calculation. Test methodology (e.g., percentage of sales, claims history). Agree inputs to historical claims data. Perform sensitivity analysis on key assumptions.", assertion: "Valuation", isa: "ISA 540.8-13; FRS 102 s21.7", sample: "N/A — assess methodology and inputs" },
      { ref: "D12.04", procedure: "Restructuring provisions: Where restructuring provision is recognised, verify a detailed formal plan exists, announcement/implementation has commenced per FRS 102 s21.11B-C, and costs are directly related to the restructuring.", assertion: "Existence; Valuation", isa: "FRS 102 s21.11A-11D; ISA 540.8", sample: "All restructuring provisions" },
      { ref: "D12.05", procedure: "Dilapidations provision: For leasehold properties, verify whether a dilapidations provision is required. Where provided, assess reasonableness by reference to surveyor's report, lease terms, and industry benchmarks.", assertion: "Completeness; Valuation", isa: "FRS 102 s21.4; ISA 540.8", sample: "All leasehold properties" },
      { ref: "D12.06", procedure: "Prior year provisions: For provisions recognised in prior year(s), review utilisation and any release in current year. Assess whether release is appropriate and based on changed circumstances rather than over-provisioning.", assertion: "Valuation; Occurrence", isa: "ISA 540.8; FRS 102 s21.10", sample: "All prior year provisions" },
      { ref: "D12.07", procedure: "Contingent liabilities: Review board minutes, legal correspondence, management representations, solicitor's letter, and post year-end events for contingent liabilities requiring disclosure but not recognition.", assertion: "Completeness; Disclosure", isa: "ISA 501.9; FRS 102 s21.15", sample: "Multiple sources — completeness focus" },
      { ref: "D12.08", procedure: "Disclosure review: Verify provisions disclosures meet FRS 102 s21.14 requirements including description of nature, movement schedule, expected timing, and uncertainties. Verify contingent liability disclosures per s21.15.", assertion: "Disclosure", isa: "FRS 102 s21.14-17", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "All provisions meet FRS 102 s21.4 recognition criteria and are measured at best estimate. Solicitor's letter confirms no undisclosed claims. Contingent liabilities appropriately disclosed.",
    exceptionHandling: "Provisions not meeting recognition criteria to be released. Unrecognised present obligations to be proposed as adjustments. Undisclosed contingencies to be raised with management.",
    conclusionTemplate: "Based on the procedures performed, provisions are [appropriately recognised and measured/materially misstated] and contingent liabilities are [completely disclosed/incompletely disclosed]."
  },
  d13_tax: {
    title: "Taxation — Substantive Testing Programme",
    isa: "FRS 102 s29, ISA 540",
    objective: "To obtain sufficient appropriate audit evidence that current and deferred tax charges and balances are accurately calculated, completely recorded, and appropriately disclosed.",
    population: "Corporation tax computations, HMRC correspondence, capital allowance schedules, deferred tax workings, R&D tax credit claims",
    samplingGuidance: "ISA 530 — full review of tax computations; deferred tax calculation verified in full; sample of adjustments",
    procedures: [
      { ref: "D13.01", procedure: "Corporation tax computation review: Obtain the CT600 computation. Verify profit per accounts agrees to trial balance. Test all tax adjustments (disallowable expenditure, non-taxable income) to supporting records. Verify applicable tax rate.", assertion: "Accuracy", isa: "ISA 540.8; FRS 102 s29.4", sample: "Full computation review" },
      { ref: "D13.02", procedure: "Capital allowances: Review the capital allowance computation. Verify pool balances brought forward agree to prior year CT600. Test additions and disposals to fixed asset records. Verify correct categorisation (AIA, main pool, special rate).", assertion: "Accuracy", isa: "ISA 330.20; CAA 2001", sample: "All additions/disposals + pool reconciliation" },
      { ref: "D13.03", procedure: "Deferred tax: Review management's deferred tax calculation. Verify all material timing differences identified (accelerated capital allowances, short-term timing differences, tax losses). Verify rate used and recalculate.", assertion: "Completeness; Accuracy", isa: "ISA 540.8; FRS 102 s29.15-17", sample: "Full calculation review" },
      { ref: "D13.04", procedure: "Tax losses: Where tax losses are carried forward, verify the loss balances to HMRC correspondence or prior computations. Assess recoverability of deferred tax asset — is it probable that future taxable profits will be available?", assertion: "Valuation; Existence", isa: "ISA 540.8; FRS 102 s29.21-22", sample: "All loss-making entities in group" },
      { ref: "D13.05", procedure: "R&D tax credits: Where R&D relief is claimed, verify the entity qualifies as SME or large per HMRC guidelines. Test the qualifying expenditure schedule. Verify claim methodology (enhanced deduction, RDEC, or payable credit).", assertion: "Accuracy; Existence", isa: "ISA 540.8; CTA 2009 Pt 13", sample: "Full R&D claim review" },
      { ref: "D13.06", procedure: "Prior year under/over provisions: Compare prior year tax provision to actual tax liability per filed CT600 or HMRC assessment. Quantify any under/over provision and verify correct treatment in current year.", assertion: "Accuracy", isa: "ISA 330.20; FRS 102 s29.4", sample: "All entities — compare provision to filed return" },
      { ref: "D13.07", procedure: "Tax creditor/debtor: Verify the year-end tax creditor or debtor balance. Agree to cumulative computation less payments on account made to HMRC (verify to bank statements). Confirm instalment payment regime is correctly applied if applicable.", assertion: "Accuracy; Completeness", isa: "ISA 330.20", sample: "All entities — full verification" },
      { ref: "D13.08", procedure: "Tax rate reconciliation and disclosure: Prepare or review the effective tax rate reconciliation. Verify all significant reconciling items are explained. Confirm tax disclosures meet FRS 102 s29.27 requirements.", assertion: "Disclosure; Accuracy", isa: "FRS 102 s29.27; ISA 520.5", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "CT computation consistent with financial statements. All timing differences captured in deferred tax. Tax creditor agrees to computation less payments on account.",
    exceptionHandling: "Computation errors to be quantified and reported. Inappropriate tax positions to be discussed with tax specialists. Uncertain tax positions to be assessed for provisioning under FRS 102.",
    conclusionTemplate: "Based on the procedures performed, the current and deferred tax charges and balances are [fairly stated/materially misstated] in accordance with FRS 102 s29."
  },
  d14_leases: {
    title: "Leases — Substantive Testing Programme",
    isa: "FRS 102 s20/IFRS 16, ISA 540",
    objective: "To obtain sufficient appropriate audit evidence that lease obligations and right-of-use assets (where IFRS 16 applies) or finance/operating lease commitments (FRS 102 s20) are complete, accurately measured, and properly disclosed.",
    population: "Lease agreements, lease schedule, right-of-use asset register, lease liability calculations, rent invoices, board minutes",
    samplingGuidance: "ISA 530 — all material leases individually tested; sample of low-value or short-term leases",
    procedures: [
      { ref: "D14.01", procedure: "Lease schedule completeness: Obtain management's complete lease schedule. Cross-reference to rent/lease payments in the nominal ledger, property list, and board minutes to identify any unrecorded leases.", assertion: "Completeness", isa: "ISA 330.21; IFRS 16.B31", sample: "Review all rent/lease payments in NL + board minutes" },
      { ref: "D14.02", procedure: "Lease classification (FRS 102): For each lease, verify management's classification as finance or operating by reference to FRS 102 s20.5 indicators (transfer of ownership, bargain purchase option, lease term vs useful life, PV of minimum payments).", assertion: "Classification", isa: "FRS 102 s20.5; ISA 330.20", sample: "All leases" },
      { ref: "D14.03", procedure: "Right-of-use asset (IFRS 16): Where IFRS 16 applies, verify initial measurement of ROU asset (lease liability + initial direct costs + prepayments − incentives). Recalculate depreciation charge over the shorter of useful life and lease term.", assertion: "Accuracy; Valuation", isa: "IFRS 16.23-27; ISA 540.8", sample: "All ROU assets above PM" },
      { ref: "D14.04", procedure: "Lease liability recalculation: Recalculate the lease liability for material leases using present value of future lease payments at the incremental borrowing rate (or rate implicit in lease). Verify amortisation table.", assertion: "Accuracy; Valuation", isa: "IFRS 16.26; FRS 102 s20.9; ISA 540.8", sample: "All material lease liabilities" },
      { ref: "D14.05", procedure: "Lease modifications: Identify any lease modifications in the year (rent reviews, extensions, terminations). Verify correct accounting treatment — remeasurement of liability and adjustment to ROU asset (IFRS 16) or revised operating lease commitment.", assertion: "Completeness; Accuracy", isa: "IFRS 16.44-46; FRS 102 s20", sample: "All lease modifications in year" },
      { ref: "D14.06", procedure: "Incremental borrowing rate: Where the interest rate implicit in the lease is not readily determinable, assess the reasonableness of management's incremental borrowing rate used for discounting. Consider entity's credit standing and term.", assertion: "Valuation", isa: "IFRS 16.26; ISA 540.8", sample: "All leases using IBR" },
      { ref: "D14.07", procedure: "Short-term and low-value leases: Where exemptions are applied (IFRS 16.5-8), verify that lease term is 12 months or less (not including purchase options) or underlying asset is low value when new. Confirm expense recognition on straight-line basis.", assertion: "Classification; Accuracy", isa: "IFRS 16.5-8", sample: "All leases claiming exemption" },
      { ref: "D14.08", procedure: "Disclosure review: Verify lease disclosures meet IFRS 16.51-60 or FRS 102 s20.16 requirements including maturity analysis, expense recognition, cash outflows, and commitments. Confirm separate disclosure of finance and operating leases (FRS 102).", assertion: "Disclosure", isa: "IFRS 16.51-60; FRS 102 s20.16", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "All leases identified and recorded. ROU assets and lease liabilities correctly measured. Lease classification appropriate. Disclosures complete.",
    exceptionHandling: "Unrecorded leases to be quantified for adjustment. Incorrect classification to be assessed for potential restatement. Measurement errors to be quantified.",
    conclusionTemplate: "Based on the procedures performed, lease assets and liabilities are [appropriately recognised and measured/materially misstated] in accordance with [IFRS 16/FRS 102 s20]."
  },
  d15_related_parties: {
    title: "Related Parties — Substantive Testing Programme",
    isa: "ISA 550, FRS 102 s33",
    objective: "To obtain sufficient appropriate audit evidence to identify related party relationships and transactions, assess whether they have been appropriately accounted for, and verify that disclosures are complete and accurate.",
    population: "Related party disclosures, director interests, Companies House records, bank confirmations, board minutes, management representations",
    samplingGuidance: "ISA 530 — all identified related party transactions tested; completeness procedures applied to full population",
    procedures: [
      { ref: "D15.01", procedure: "Related party identification: Obtain management's list of related parties (per FRS 102 s33.2 definition). Cross-reference to Companies House directorships, PSC register, group structure chart, and prior year working papers. Verify completeness through independent search.", assertion: "Completeness", isa: "ISA 550.13-17", sample: "All directors and key management personnel" },
      { ref: "D15.02", procedure: "Transaction identification: Search the accounting records for transactions with identified related parties. Review unusual journal entries, non-standard terms, and loans to/from directors. Cross-reference to management's RP disclosure schedule.", assertion: "Completeness; Occurrence", isa: "ISA 550.25; ISA 240.32", sample: "Full NL search + management schedule" },
      { ref: "D15.03", procedure: "Arm's length assessment: For material related party transactions, assess whether terms and conditions are equivalent to those that would prevail in an arm's length transaction. Compare to market rates/prices where available.", assertion: "Accuracy; Valuation", isa: "ISA 550.25; FRS 102 s33.1A", sample: "All material RP transactions" },
      { ref: "D15.04", procedure: "Director loans and advances: Identify all loans to or from directors. Verify compliance with CA 2006 s197-214 (member approval requirements). Assess recoverability and verify disclosure per FRS 102 s33.", assertion: "Existence; Compliance", isa: "ISA 550.25; CA 2006 s197", sample: "All director loans" },
      { ref: "D15.05", procedure: "Intercompany transactions: For group entities, obtain schedule of intercompany transactions and balances. Reconcile with counterparty records. Investigate unreconciled differences.", assertion: "Accuracy; Completeness", isa: "ISA 550.25; ISA 600", sample: "All intercompany balances and material transactions" },
      { ref: "D15.06", procedure: "Board minutes review: Review all board and committee minutes for evidence of related party transactions not previously identified by management. Note any conflicts of interest declared.", assertion: "Completeness", isa: "ISA 550.18-19", sample: "All board minutes for the period" },
      { ref: "D15.07", procedure: "Management representations: Obtain specific written representation from management and those charged with governance regarding completeness of related party identification and disclosure.", assertion: "Completeness", isa: "ISA 550.26; ISA 580.A14", sample: "N/A — management representation letter" },
      { ref: "D15.08", procedure: "Disclosure review: Verify related party disclosures meet FRS 102 s33.9-14 requirements including nature of relationship, description of transactions, amounts, outstanding balances, provisions for doubtful debts, and terms.", assertion: "Disclosure", isa: "FRS 102 s33.9-14; ISA 550.27", sample: "N/A — review of financial statements" }
    ],
    expectedResults: "All related parties identified and transactions completely disclosed. Terms assessed as arm's length where relevant. Director loans comply with CA 2006.",
    exceptionHandling: "Previously undisclosed related parties to be reported to those charged with governance per ISA 550.22. Transactions not at arm's length to be assessed for impact on financial statements.",
    conclusionTemplate: "Based on the procedures performed, related party relationships and transactions are [completely identified and disclosed/incompletely disclosed] in accordance with FRS 102 s33 and ISA 550."
  },
  d16_cashflow: {
    title: "Cash Flow Statement — Substantive Testing Programme",
    isa: "FRS 102 s7, IAS 7",
    objective: "To obtain sufficient appropriate audit evidence that the cash flow statement correctly classifies cash flows between operating, investing, and financing activities and reconciles to the movement in cash and cash equivalents.",
    population: "Cash flow statement working papers, bank statements, nominal ledger, balance sheet comparatives, non-cash transaction schedules",
    samplingGuidance: "ISA 530 — full verification of cash flow statement; sample of individual cash flows to supporting records",
    procedures: [
      { ref: "D16.01", procedure: "Operating activities reconciliation (indirect method): Starting from profit before tax, verify each adjustment for non-cash items (depreciation, amortisation, impairment, share-based payments, profit/loss on disposal). Agree to audited figures.", assertion: "Accuracy", isa: "FRS 102 s7.7-8; ISA 330.20", sample: "All adjustments" },
      { ref: "D16.02", procedure: "Working capital movements: Verify the working capital adjustments (change in receivables, payables, inventory) by agreeing opening and closing balances to the audited balance sheet. Investigate any non-cash movements excluded.", assertion: "Accuracy; Completeness", isa: "FRS 102 s7.7; ISA 330.20", sample: "All working capital lines" },
      { ref: "D16.03", procedure: "Tax and interest cash flows: Verify cash paid for tax by reference to HMRC payments on bank statement and tax creditor movement. Verify interest paid/received to bank statements and interest accrual movements.", assertion: "Accuracy", isa: "FRS 102 s7.14-15", sample: "All tax and interest cash flows" },
      { ref: "D16.04", procedure: "Investing activities: Test material cash flows from investing activities (purchase/sale of fixed assets, investments, subsidiaries) to bank statements, completion statements, and supporting documentation.", assertion: "Occurrence; Accuracy", isa: "FRS 102 s7.10-12", sample: "All investing cash flows > PM" },
      { ref: "D16.05", procedure: "Financing activities: Test material cash flows from financing activities (loan drawdowns/repayments, share issues, dividends paid) to bank statements, loan agreements, and board minutes.", assertion: "Occurrence; Accuracy", isa: "FRS 102 s7.13", sample: "All financing cash flows" },
      { ref: "D16.06", procedure: "Opening to closing cash reconciliation: Verify the cash flow statement reconciles from opening cash and cash equivalents to closing, agreeing both to audited balance sheets. Account for any exchange differences on cash.", assertion: "Accuracy; Completeness", isa: "FRS 102 s7.7; ISA 330.20", sample: "Full reconciliation" },
      { ref: "D16.07", procedure: "Non-cash transactions: Identify and verify that significant non-cash transactions (e.g., acquisition by share exchange, conversion of debt to equity, ROU asset recognition) are excluded from the cash flow statement and disclosed separately.", assertion: "Classification; Disclosure", isa: "FRS 102 s7.18; IAS 7.43", sample: "All identified non-cash transactions" },
      { ref: "D16.08", procedure: "Net debt reconciliation: Where disclosed, verify the net debt reconciliation from opening to closing. Agree all components (cash, borrowings, lease liabilities) to audited balances and cash/non-cash movements.", assertion: "Accuracy; Disclosure", isa: "FRS 102 s7.20A; IAS 7.44A-E", sample: "Full reconciliation" }
    ],
    expectedResults: "Cash flow statement reconciles from opening to closing cash. All classifications correct. Material cash flows traced to bank statements.",
    exceptionHandling: "Classification errors to be corrected. Reconciliation differences to be investigated and resolved. Non-cash transactions incorrectly included to be reclassified.",
    conclusionTemplate: "Based on the procedures performed, the cash flow statement [presents fairly/is materially misstated] the cash flows of the entity in accordance with [FRS 102 s7/IAS 7]."
  }
};

// ─── IFRS 15 REVENUE COMPLIANCE ───
export const IFRS15_REVENUE_COMPLIANCE = [
  {
    id: "RC01",
    topic: "Contract Modifications",
    criteria: [
      "Modification changes the scope of the contract by adding distinct goods or services",
      "Modification changes the price of the contract",
      "The added goods or services are distinct from those transferred before modification",
      "The price increase reflects the standalone selling price of the additional goods or services",
      "Where criteria are not met, modification is accounted for as part of the existing contract",
      "Cumulative catch-up adjustment required for modifications treated as part of existing contract"
    ],
    auditTests: [
      "Review contract modification log for completeness — ensure all amendments, change orders, and side letters are captured",
      "For a sample of modifications, assess whether the additional goods/services are distinct per IFRS 15.27-30",
      "Verify the standalone selling price of added goods/services to price lists or observable evidence per IFRS 15.79",
      "Test the accounting treatment applied — prospective (new contract) vs cumulative catch-up — against IFRS 15.18-21 criteria",
      "Recalculate the transaction price reallocation where modification is treated as part of existing contract",
      "Verify appropriate period of revenue recognition post-modification"
    ]
  },
  {
    id: "RC02",
    topic: "Principal vs Agent",
    criteria: [
      "Entity controls the good or service before it is transferred to the customer (IFRS 15.B34-35)",
      "Entity has the primary responsibility for fulfilment of the promise",
      "Entity has inventory risk before or after transfer to customer",
      "Entity has discretion in establishing the price for the good or service",
      "If entity is agent, revenue recognised as commission/fee only (net basis)",
      "Indicators are assessed for each distinct good or service in the contract"
    ],
    auditTests: [
      "Identify all revenue streams where the entity acts as intermediary and assess control per IFRS 15.B34-38",
      "Evaluate whether the entity has inventory risk, fulfilment responsibility, and pricing discretion for each stream",
      "Test a sample of transactions for correct gross vs net presentation by reviewing underlying contracts and delivery arrangements",
      "Review management's documented assessment of principal vs agent for each significant revenue stream",
      "Recalculate revenue under both gross and net bases and quantify the financial statement impact of any misclassification",
      "Verify consistency of treatment across similar arrangements and with prior period presentation"
    ]
  },
  {
    id: "RC03",
    topic: "Bill-and-Hold",
    criteria: [
      "Customer has requested the bill-and-hold arrangement (substantive reason such as lack of storage space)",
      "Product has been identified separately as belonging to the customer",
      "Product is currently ready for physical transfer to the customer",
      "Entity cannot use the product or direct it to another customer",
      "Entity has the risks of custody including insurance obligation"
    ],
    auditTests: [
      "Identify all bill-and-hold arrangements from management's schedule and revenue contracts",
      "For each arrangement, verify customer's written request and substantive business reason per IFRS 15.B79-82",
      "Physically verify (or obtain confirmation) that goods are segregated and identified as belonging to the specific customer",
      "Test that the entity retains custody risks including insurance coverage for held goods",
      "Verify that revenue is recognised only when control transfers (not at physical delivery) and that delivery performance obligation is separately assessed",
      "Review post year-end deliveries to confirm goods were subsequently shipped to the correct customer"
    ]
  },
  {
    id: "RC04",
    topic: "Consignment",
    criteria: [
      "Product delivered to another party (e.g., dealer) does not result in transfer of control",
      "Entity can require return of the product or transfer to a third party",
      "Dealer does not have an unconditional obligation to pay for the product",
      "IFRS 15.B77-78 indicators of consignment are assessed",
      "Revenue deferred until goods sold through to end customer or control transfers"
    ],
    auditTests: [
      "Identify all consignment arrangements from contracts, distribution agreements, and management enquiry",
      "Assess whether IFRS 15.B77-78 indicators of consignment exist (return rights, payment conditional on resale, entity can require return)",
      "For a sample of consignment relationships, verify the timing of revenue recognition aligns with control transfer to end customer",
      "Test consignment inventory records for accuracy — verify goods on consignment are included in entity's inventory until sold-through",
      "Review third-party confirmations or sell-through reports to verify reported sales from consigned inventory",
      "Verify cut-off at year end — ensure revenue not recognised for goods still held on consignment at reporting date"
    ]
  },
  {
    id: "RC05",
    topic: "Licensing (Right of Use vs Right of Access)",
    criteria: [
      "Right of use: Customer can direct use of and obtain substantially all benefits from IP at point in time (IFRS 15.B58)",
      "Right of access: Entity's ongoing activities significantly affect the IP and customer is exposed to those effects (IFRS 15.B56)",
      "Right of access recognised over time; right of use recognised at point in time",
      "Functional IP (software, media content) vs symbolic IP (brand, franchise) distinction assessed",
      "Sales-based or usage-based royalties on licences of IP recognised as the sale/usage occurs (IFRS 15.B63)"
    ],
    auditTests: [
      "Classify each licence arrangement as functional IP or symbolic IP per IFRS 15.B56-63",
      "Assess whether the entity's ongoing activities significantly affect the IP — evidence of updates, support, or brand-building activities",
      "Verify the revenue recognition pattern (over time vs point in time) is consistent with the licence classification",
      "For royalty-based arrangements, test that sales/usage-based royalties are recognised only when the subsequent sale or usage occurs",
      "Recalculate licence revenue for material arrangements using the appropriate recognition pattern",
      "Review contract terms for bundled arrangements (licence + implementation + support) and test allocation of transaction price to each performance obligation"
    ]
  },
  {
    id: "RC06",
    topic: "Warranties (Assurance vs Service)",
    criteria: [
      "Assurance warranty: Provides assurance the product meets agreed-upon specifications — not a separate performance obligation",
      "Service warranty: Provides a service beyond assurance of agreed-upon specifications — separate performance obligation",
      "Customer has option to purchase warranty separately (indicator of service warranty)",
      "Warranty covers defects existing at time of sale (assurance) vs future failures (service)",
      "Assurance warranties accounted for under IAS 37; service warranties as separate performance obligation under IFRS 15"
    ],
    auditTests: [
      "Review warranty terms in customer contracts to classify each as assurance or service warranty per IFRS 15.B28-33",
      "Test management's assessment of warranty classification against IFRS 15 indicators (separability, customer option, nature of promise)",
      "For assurance warranties, verify provision is accounted for under IAS 37 — test adequacy of provision against claims history",
      "For service warranties, verify standalone selling price allocation and revenue recognition over the warranty period",
      "Recalculate the transaction price allocation between product and warranty service performance obligations for material contracts",
      "Review warranty claims data post year-end for evidence of classification errors or provision inadequacy"
    ]
  },
  {
    id: "RC07",
    topic: "Returns, Refunds and Rebates",
    criteria: [
      "Variable consideration exists where customer has right of return, volume rebate, or price concession",
      "Expected value or most likely amount method used to estimate variable consideration (IFRS 15.53)",
      "Constraining estimate: Include variable consideration only to the extent highly probable no significant reversal (IFRS 15.56)",
      "Refund liability recognised for expected returns; corresponding right to recover returned products recognised as asset",
      "Volume rebates estimated based on expected purchases and accrued progressively"
    ],
    auditTests: [
      "Identify all arrangements involving returns, refunds, or rebates from contract review and management enquiry",
      "Test management's estimate of expected returns using historical return rates and post year-end actual returns data",
      "Verify the constraint on variable consideration is applied — assess whether it is highly probable that a significant reversal will not occur",
      "Recalculate the refund liability and right-of-return asset at year end for material arrangements",
      "For volume rebates, verify the methodology (expected value vs most likely amount), test inputs to customer purchase data, and recalculate year-end accrual",
      "Compare estimated rebates to actual settlements post year-end to assess reliability of estimation process"
    ]
  },
  {
    id: "RC08",
    topic: "Gift Cards and Loyalty Points",
    criteria: [
      "Gift cards and loyalty points represent contract liabilities (deferred revenue) until redeemed or expired",
      "Breakage (estimated non-redemption) recognised proportionally as redemption occurs if entity expects to be entitled to breakage (IFRS 15.B46)",
      "If entity does not expect breakage entitlement, recognise when likelihood of redemption becomes remote",
      "Standalone selling price of loyalty points allocated from the transaction price",
      "Points earned and redeemed tracked through loyalty programme system"
    ],
    auditTests: [
      "Obtain the gift card liability and loyalty points deferred revenue balance at year end and reconcile to system reports",
      "Test breakage estimates by comparing to historical redemption patterns — assess methodology and reasonableness of management's assumptions",
      "Verify the standalone selling price allocation for loyalty points using observable redemption values and adjustment for expected breakage",
      "Recalculate the deferred revenue balance based on points outstanding, standalone selling price, and breakage assumptions",
      "Test a sample of redemptions in the year for correct release of deferred revenue",
      "Review expiry terms and verify appropriate treatment of expired but previously deferred amounts"
    ]
  },
  {
    id: "RC09",
    topic: "Long-Term Contracts (Over Time vs Point in Time)",
    criteria: [
      "Revenue recognised over time if: customer simultaneously receives and consumes benefits (IFRS 15.35a)",
      "Revenue recognised over time if: entity's performance creates or enhances an asset the customer controls (IFRS 15.35b)",
      "Revenue recognised over time if: entity's performance creates an asset with no alternative use and entity has enforceable right to payment for performance to date (IFRS 15.35c)",
      "If none of the over-time criteria are met, revenue is recognised at a point in time when control transfers",
      "Input method (cost-to-cost) or output method used to measure progress towards completion",
      "Contract costs to obtain and fulfil recognised as assets if criteria met (IFRS 15.91-98)"
    ],
    auditTests: [
      "Classify all significant contracts as over-time or point-in-time by assessing IFRS 15.35 criteria for each",
      "For over-time contracts, evaluate the appropriateness of the progress measurement method (input vs output) and consistency of application",
      "Test the cost-to-cost calculation for a sample of contracts: verify costs incurred to date to actual records, and estimated costs to complete to project budgets/engineer reports",
      "Challenge management's estimates of total contract costs and expected profit margins — compare to historical accuracy of estimates on completed contracts",
      "Test contract modifications and scope changes for correct treatment (IFRS 15.18-21) and impact on percentage of completion",
      "Verify contract asset and liability balances at year end — assess for impairment of contract assets and onerous contract provisions"
    ]
  },
  {
    id: "RC10",
    topic: "Variable Consideration and Constraint",
    criteria: [
      "Transaction price includes variable amounts (discounts, incentives, penalties, performance bonuses, price escalation clauses)",
      "Estimated using expected value method (probability-weighted) or most likely amount method — whichever better predicts the outcome",
      "Constrained to amount for which it is highly probable that a significant revenue reversal will not occur (IFRS 15.56)",
      "Reassessed at each reporting date with changes recognised as revenue adjustments",
      "Factors increasing uncertainty: susceptibility to external factors, long resolution period, limited experience, broad range of outcomes (IFRS 15.57)"
    ],
    auditTests: [
      "Identify all contracts containing variable consideration through contract review, management enquiry, and analytical review of revenue trends",
      "Assess management's choice of estimation method (expected value vs most likely amount) for each type of variable consideration and whether it best predicts the outcome",
      "Test the inputs to the variable consideration estimate — verify historical data, customer-specific factors, and market conditions used in the calculation",
      "Evaluate the constraint assessment per IFRS 15.56-58 — verify management has considered the factors that increase the likelihood of a revenue reversal",
      "Perform retrospective review: compare prior period estimates of variable consideration to actual outcomes to assess reliability of management's estimation process",
      "Recalculate the variable consideration amount at year end for a sample of material contracts and verify correct treatment of changes from prior estimates"
    ]
  }
];

// ─── LEAD SCHEDULE STRUCTURE ───
export const LEAD_SCHEDULES = {
  pl: {
    title: "P&L Lead Schedule",
    lines: [
      { item: "Revenue", wpRef: "D1", note: "Test per revenue testing programme" },
      { item: "Cost of sales", wpRef: "D3/D5", note: "Inventory/WIP + direct costs" },
      { item: "Gross profit", wpRef: "", note: "Calculated — review margin %" },
      { item: "Administrative expenses", wpRef: "D5", note: "Payroll analytical + expense sampling" },
      { item: "Depreciation and amortisation", wpRef: "D7/D8", note: "Recalculate per FA register" },
      { item: "Other operating income/(expenses)", wpRef: "D1", note: "Verify nature and classification" },
      { item: "Interest receivable", wpRef: "D6", note: "Recalculate to bank confirmations" },
      { item: "Interest payable", wpRef: "D11", note: "Recalculate to loan agreements" },
      { item: "Taxation", wpRef: "D13", note: "Agree to CT computation" },
      { item: "Profit/(loss) for the financial year", wpRef: "", note: "Calculated — cross-cast check" }
    ]
  },
  bs: {
    title: "Balance Sheet Lead Schedule",
    lines: [
      { item: "Fixed assets (NBV)", wpRef: "C5/D7", note: "Agree to FA register; test additions/disposals" },
      { item: "Intangible assets", wpRef: "D8", note: "Test capitalisation criteria; amortisation" },
      { item: "Investments", wpRef: "D9", note: "Agree to certificates; impairment review" },
      { item: "Inventory / WIP", wpRef: "D3", note: "Stock count; cost testing; NRV" },
      { item: "Trade receivables", wpRef: "D2", note: "Circularisation; ageing; provision" },
      { item: "Other receivables and prepayments", wpRef: "D2", note: "Vouch to supporting documentation" },
      { item: "Cash and bank", wpRef: "D6", note: "Bank confirmation; reconciliation" },
      { item: "Trade payables", wpRef: "D4", note: "Supplier statements; unrecorded liabilities" },
      { item: "Other payables and accruals", wpRef: "D4", note: "Vouch accruals; test completeness" },
      { item: "Taxation", wpRef: "D13", note: "CT computation; deferred tax" },
      { item: "Loans and borrowings", wpRef: "D11", note: "Bank confirmation; covenant testing" },
      { item: "Provisions", wpRef: "D12", note: "Test FRS 102 s21.4 criteria" },
      { item: "Share capital", wpRef: "D10", note: "Verify to Companies House" },
      { item: "Retained earnings", wpRef: "D10", note: "Reconcile movements" }
    ]
  }
};

// ─── ISA ENCYCLOPAEDIA (KEY REFERENCES) ───
export const ISA_ENCYCLOPAEDIA = {
  "ISA 200": { title: "Overall Objectives", keyParas: ["200.5 — Reasonable assurance", "200.11 — Objectives of auditor", "200.15 — Professional scepticism", "200.A53 — Inherent limitations"] },
  "ISA 210": { title: "Agreeing Terms", keyParas: ["210.6 — Preconditions", "210.9 — Engagement letter required", "210.10 — Agree responsibilities"] },
  "ISA 220": { title: "Quality Management", keyParas: ["220.14 — Leadership responsibilities", "220.24 — Acceptance/continuance", "220.25 — Resources", "220.32 — Review"] },
  "ISA 230": { title: "Documentation", keyParas: ["230.7 — Timely preparation", "230.8 — Document nature, timing, extent", "230.14 — Assembly within 60 days"] },
  "ISA 240": { title: "Fraud", keyParas: ["240.12 — Professional scepticism", "240.26 — Revenue presumption", "240.31 — Management override", "240.32 — Journal entry testing", "240.33 — Testing criteria"] },
  "ISA 250": { title: "Laws & Regs", keyParas: ["250.12 — Obtain understanding", "250.14 — Audit procedures", "250.22 — Reporting NOCLAR"] },
  "ISA 300": { title: "Planning", keyParas: ["300.7 — Audit strategy", "300.9 — Audit plan", "300.11 — Changes to planning decisions"] },
  "ISA 315": { title: "Risk Assessment", keyParas: ["315.5 — Understand entity & environment", "315.25 — Identify risks of material misstatement", "315.28 — Significant risks", "315.14 — Internal control"] },
  "ISA 320": { title: "Materiality", keyParas: ["320.10 — Determine materiality for FS as a whole", "320.11 — Performance materiality", "320.12 — Revision during audit", "320.14 — Documentation"] },
  "ISA 330": { title: "Responses to Risk", keyParas: ["330.5 — Overall responses", "330.6 — Further audit procedures", "330.20 — Substantive procedures for significant risks", "330.25 — Adequacy of presentation"] },
  "ISA 450": { title: "Misstatements", keyParas: ["450.5 — Accumulate misstatements", "450.8 — Communicate with management", "450.12 — Communicate with TCWG", "450.A2 — Trivial threshold"] },
  "ISA 500": { title: "Audit Evidence", keyParas: ["500.6 — Design procedures for sufficient appropriate evidence", "500.A5 — Relevance and reliability"] },
  "ISA 501": { title: "Specific Items", keyParas: ["501.4 — Inventory attendance", "501.9 — Litigation and claims", "501.12 — Representations on litigation"] },
  "ISA 505": { title: "Confirmations", keyParas: ["505.7 — Positive vs negative", "505.10 — Non-responses", "505.14 — External confirmation as substantive procedure"] },
  "ISA 520": { title: "Analytical Procedures", keyParas: ["520.5 — Design & perform at planning", "520.6 — Design & perform near completion", "520.7 — Investigate material differences"] },
  "ISA 540": { title: "Estimates", keyParas: ["540.13 — Understand estimation process", "540.18 — Test how management made estimate", "540.23 — Evaluate reasonableness"] },
  "ISA 550": { title: "Related Parties", keyParas: ["550.11 — Identify RP relationships", "550.16 — Assess RP transactions", "550.25 — Evaluate disclosures"] },
  "ISA 560": { title: "Subsequent Events", keyParas: ["560.6 — Date of FS to auditor's report", "560.10 — Adjusting and non-adjusting", "560.14 — After auditor's report"] },
  "ISA 570": { title: "Going Concern", keyParas: ["570.10 — Evaluate management's assessment", "570.13 — Minimum 12-month period", "570.22 — Material uncertainty disclosure"] },
  "ISA 580": { title: "Representations", keyParas: ["580.10 — Management representations required", "580.14 — Date and coverage", "580.19 — Doubts about reliability"] },
  "ISA 600": { title: "Group Audits", keyParas: ["600.12 — Understand the group", "600.19 — Material components", "600.40 — Communication with component auditors"] },
  "ISA 700": { title: "Audit Report", keyParas: ["700.10 — Form the opinion", "700.20 — Auditor's report content", "700.35 — Unmodified opinion wording"] },
  "ISA 705": { title: "Modifications", keyParas: ["705.7 — Qualified opinion", "705.8 — Adverse opinion", "705.9 — Disclaimer", "705.12 — Basis for modified opinion"] },
  "ISA 706": { title: "Emphasis & Other", keyParas: ["706.8 — Emphasis of Matter", "706.10 — Other Matter"] }
};

// ─── RISK TRILOGY: Risk → Control → Test → FSLI → Assertion (ISA 315/330) ───
export const RISK_TRILOGY = {
  construction: [
    {
      riskId: "R01",
      riskDescription: "Revenue recognition on long-term contracts — stage of completion methodology introduces significant estimation uncertainty, with risk of premature or deferred profit recognition and manipulation of contract margins",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Subjective estimation of percentage of completion",
        "Complex contract modifications and variation orders",
        "Incentive for management to manipulate reported profit to meet targets or covenants",
        "Multiple performance obligations within single contracts",
        "Judgement in assessing costs to complete"
      ],
      controlObjectives: [
        "Ensure revenue is recognised only when performance obligations are satisfied",
        "Ensure stage of completion calculations are based on reliable cost data",
        "Ensure contract modifications are approved and reflected accurately",
        "Ensure consistent application of revenue recognition policy across all contracts"
      ],
      controlProcedures: [
        "Monthly project manager review and sign-off of cost-to-complete estimates with documented assumptions",
        "Independent quantity surveyor review of material contract valuations above defined threshold",
        "Segregation of duties between contract negotiation, cost recording, and revenue recognition",
        "Board-level review of contract profitability reports including margin analysis and variance explanations",
        "Formal variation order approval process requiring client written confirmation before revenue recognition"
      ],
      substantiveTests: [
        { test: "For contracts > PM, independently recalculate stage of completion using certified cost data and compare to management's assessment", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Vouch costs included in cost-to-complete estimates to subcontractor quotes, purchase orders, and quantity surveyor reports", wpRef: "D1.02", assertion: "Valuation", isa: "ISA 500.A22" },
        { test: "Test cut-off by examining applications for payment and valuation certificates around year end to verify correct period recognition", wpRef: "D1.03", assertion: "Cut-off", isa: "ISA 240.26" },
        { test: "Compare forecast final margins at year end to prior period forecasts and to outturn on completed contracts to assess estimation bias", wpRef: "D1.04", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Inspect variation order approvals and client correspondence for material variations to confirm entitlement to revenue", wpRef: "D1.05", assertion: "Occurrence", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Revenue", "Amounts due on contracts (asset)", "Amounts due on contracts (liability)", "Work in progress", "Accrued income"],
      assertions: ["Occurrence", "Accuracy", "Cut-off", "Valuation"],
      disclosureRequirements: ["FRS 102 s23.30 — Contract revenue and methods used", "FRS 102 s23.31 — Aggregate costs incurred and recognised profits", "FRS 102 s23.32 — Advances received and retentions"]
    },
    {
      riskId: "R02",
      riskDescription: "WIP valuation and cost allocation — risk that work in progress is overstated due to incorrect overhead absorption, failure to recognise foreseeable losses, or inappropriate capitalisation of costs",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Complexity of overhead absorption methodologies across multiple projects",
        "Judgement in identifying loss-making contracts requiring immediate write-down",
        "Risk of costs being allocated to profitable contracts to mask losses on others",
        "Estimation of costs to complete involving multiple subcontractors and trades"
      ],
      controlObjectives: [
        "Ensure WIP is stated at the lower of cost and net realisable value",
        "Ensure overhead absorption rates are reasonable and consistently applied",
        "Ensure foreseeable losses are identified and provided for in full",
        "Ensure cost allocations between contracts are accurate and supportable"
      ],
      controlProcedures: [
        "Monthly project-by-project WIP review with quantity surveyor sign-off on costs to complete",
        "Formal loss-making contract identification process with immediate board notification",
        "Documented overhead absorption methodology reviewed and approved annually by finance director",
        "Timesheet and cost allocation review by project managers with independent spot-checks by finance team",
        "Quarterly reconciliation of WIP balances to project management system outputs"
      ],
      substantiveTests: [
        { test: "For material contracts, trace cost build-up to purchase invoices, subcontractor certificates, payroll allocations, and plant records", wpRef: "D3.01", assertion: "Valuation", isa: "ISA 501.4" },
        { test: "Recalculate overhead absorption for sample of contracts and compare actual rates to budgeted rates used in WIP valuation", wpRef: "D3.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "For contracts showing declining margins or cost overruns, challenge management's cost-to-complete estimates and assess whether foreseeable loss provision is required", wpRef: "D3.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Test NRV by comparing WIP carrying values to agreed contract values less estimated costs to complete", wpRef: "D3.04", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Verify correct cut-off of costs by testing material invoices and timesheets around year end for allocation to correct contract period", wpRef: "D3.05", assertion: "Cut-off", isa: "ISA 501.4" }
      ],
      fsliImpact: ["Work in progress", "Cost of sales", "Provisions for foreseeable losses", "Amounts due on contracts"],
      assertions: ["Valuation", "Accuracy", "Cut-off", "Completeness"],
      disclosureRequirements: ["FRS 102 s13.22 — Accounting policies for inventories including cost formulas", "FRS 102 s23.31 — Aggregate amount of costs incurred and recognised profits to date", "FRS 102 s21.14 — Provisions for foreseeable contract losses"]
    },
    {
      riskId: "R03",
      riskDescription: "Retentions receivable — risk that retention balances are not recoverable due to contractor insolvency, defective works, or disputes, leading to overstatement of receivables",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Long ageing profile of retentions (typically 12-24 months post-completion)",
        "Recoverability dependent on satisfactory completion of defects liability period",
        "Counterparty credit risk, particularly in supply chain insolvency situations",
        "Disputes over defective work may reduce or eliminate retention recovery"
      ],
      controlObjectives: [
        "Ensure retention balances are accurately recorded and aged",
        "Ensure recoverability is assessed and appropriate provisions are made",
        "Ensure retention releases are processed when defect certificates are issued"
      ],
      controlProcedures: [
        "Monthly aged retention analysis reviewed by commercial director with follow-up on overdue items",
        "Formal process for assessing counterparty credit risk on material retention balances",
        "Tracking system for defects liability periods with automated alerts for release dates",
        "Credit control team follow-up on retentions past contractual release dates"
      ],
      substantiveTests: [
        { test: "Obtain retention ageing analysis and test completeness by tracing to underlying contract terms for sample of contracts", wpRef: "D2.01", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "For retentions > 12 months past completion, assess recoverability through post year-end cash receipts and counterparty credit checks", wpRef: "D2.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Send positive confirmations for material retention balances and perform alternative procedures for non-replies", wpRef: "D2.03", assertion: "Existence", isa: "ISA 505.7" },
        { test: "Review defects liability status and assess whether any claims against the entity reduce the recoverable retention amount", wpRef: "D2.04", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Test cut-off on retention releases around year end by agreeing to defect certificates and contractual milestones", wpRef: "D2.05", assertion: "Cut-off", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Retentions receivable", "Trade receivables", "Bad debt provision", "Revenue"],
      assertions: ["Existence", "Valuation", "Cut-off", "Rights"],
      disclosureRequirements: ["FRS 102 s11.42 — Credit risk disclosures", "FRS 102 s11.48 — Ageing analysis of past due assets", "FRS 102 s23.32 — Retentions on contracts"]
    },
    {
      riskId: "R04",
      riskDescription: "Subcontractor accruals and contra arrangements — risk that subcontractor liabilities are understated or that complex contra and back-charge arrangements are not accurately reflected",
      level: "ELEVATED",
      inherentRiskFactors: [
        "High volume of subcontractor transactions across multiple projects",
        "Informal contra arrangements may not be fully documented",
        "CIS deduction complexity creates risk of misstatement",
        "Timing differences between application for payment and actual certification"
      ],
      controlObjectives: [
        "Ensure all subcontractor liabilities are completely and accurately recorded",
        "Ensure contra arrangements are properly documented and reflected in both receivables and payables",
        "Ensure CIS deductions are correctly calculated and remitted"
      ],
      controlProcedures: [
        "Monthly reconciliation of subcontractor statements to purchase ledger balances",
        "Formal documentation and dual approval of all contra arrangements",
        "CIS verification of subcontractor status before first payment and periodic re-verification",
        "Independent review of CIS monthly returns before submission to HMRC",
        "Accruals review at month-end for work performed but not yet certified"
      ],
      substantiveTests: [
        { test: "Perform unrecorded liabilities search by examining post year-end subcontractor invoices, certificates, and payments for items relating to pre year-end work", wpRef: "D4.01", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Reconcile material subcontractor statement balances to purchase ledger and investigate differences", wpRef: "D4.02", assertion: "Accuracy", isa: "ISA 505.14" },
        { test: "Test CIS deduction calculations for a sample of subcontractor payments and verify correct deduction rates applied", wpRef: "D4.03", assertion: "Accuracy", isa: "ISA 250.14" },
        { test: "For material contra arrangements, inspect documentation and verify both the receivable and payable sides are correctly recorded", wpRef: "D4.04", assertion: "Completeness", isa: "ISA 330.6" },
        { test: "Test accruals for certified but unpaid work at year end by agreeing to interim certificates and valuation reports", wpRef: "D4.05", assertion: "Valuation", isa: "ISA 540.18" }
      ],
      fsliImpact: ["Trade payables", "Subcontractor accruals", "CIS liability", "Cost of sales", "Trade receivables (contra)"],
      assertions: ["Completeness", "Accuracy", "Valuation", "Cut-off"],
      disclosureRequirements: ["FRS 102 s4.12 — Creditors due within one year", "FRS 102 s11.42 — Financial liabilities measurement", "FRS 102 s33.9 — Related party disclosures for connected subcontractors"]
    },
    {
      riskId: "R05",
      riskDescription: "Health and safety provisions and contingent liabilities — risk that provisions for H&S claims, CDM breaches, and building safety obligations are incomplete or inadequately measured",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Inherently hazardous industry with high incidence of workplace injury claims",
        "Building Safety Act 2022 creates new long-tail liabilities for building defects",
        "CDM Regulations 2015 impose duties that create legal exposure",
        "Asbestos and contamination liabilities may be latent and difficult to estimate"
      ],
      controlObjectives: [
        "Ensure all known and probable H&S claims are identified and provided for",
        "Ensure contingent liabilities are assessed for disclosure",
        "Ensure Building Safety Act obligations are identified and measured"
      ],
      controlProcedures: [
        "Centralised H&S incident reporting system with mandatory escalation for reportable incidents",
        "Quarterly review of claims register by health and safety director and legal counsel",
        "Annual review of building safety obligations by compliance team with external legal input",
        "Insurance claims tracking and liaison with brokers for outstanding claim estimates"
      ],
      substantiveTests: [
        { test: "Obtain and review the H&S claims register; for all open claims, assess provision adequacy against legal counsel estimates and insurance coverage", wpRef: "D12.01", assertion: "Completeness", isa: "ISA 540.18" },
        { test: "Send solicitor confirmation letters for all known litigation and claims to obtain independent assessment of likely outcome and quantum", wpRef: "D12.02", assertion: "Valuation", isa: "ISA 501.9" },
        { test: "Review HSE correspondence, enforcement notices, and prosecution files for unrecorded obligations", wpRef: "D12.03", assertion: "Completeness", isa: "ISA 250.14" },
        { test: "Assess Building Safety Act exposure by reviewing portfolio of higher-risk buildings and management's assessment of remediation costs", wpRef: "D12.04", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Evaluate whether provision measurement meets FRS 102 s21.4 criteria: present obligation, probable outflow, and reliable estimate", wpRef: "D12.05", assertion: "Valuation", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Provisions", "Contingent liabilities (note disclosure)", "Administrative expenses", "Cost of sales"],
      assertions: ["Completeness", "Valuation", "Occurrence", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provisions: carrying amount, additions, utilisations, and reversals", "FRS 102 s21.15 — Contingent liabilities: nature, estimate, uncertainties, reimbursement", "FRS 102 s21.17 — Prejudicial disclosure exemption"]
    },
    {
      riskId: "R06",
      riskDescription: "Liquidated damages exposure — risk that contractual LD clauses triggered by project delays are not identified, measured, or disclosed, leading to understated liabilities",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Complex contractual LD clauses with varying calculation bases",
        "Management incentive to delay recognition of LD exposure",
        "Disputes over responsibility for delays complicate measurement",
        "Extension of time claims may reduce or eliminate LD exposure but involve judgement"
      ],
      controlObjectives: [
        "Ensure all contracts with LD clauses are identified and monitored for delay exposure",
        "Ensure LD provisions are recognised when delays trigger contractual obligations",
        "Ensure extension of time claims are assessed objectively"
      ],
      controlProcedures: [
        "Contract register maintained with LD clause details and programme milestone tracking",
        "Monthly project progress reports flagging projects behind programme with LD risk assessment",
        "Formal extension of time claim process with documented evidence of entitlement",
        "Legal review of material LD exposures with external counsel where appropriate"
      ],
      substantiveTests: [
        { test: "Review contract register for all contracts with LD clauses; for projects behind programme, assess whether provision or contingent liability disclosure is required", wpRef: "D12.06", assertion: "Completeness", isa: "ISA 540.13" },
        { test: "For material LD exposures, examine programme reports, client correspondence, and extension of time claims to assess quantum and probability", wpRef: "D12.07", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Test post year-end events for evidence of LD claims crystallising or being resolved", wpRef: "D12.08", assertion: "Valuation", isa: "ISA 560.10" },
        { test: "Assess management bias by comparing historical LD provisions to actual outcomes on completed contracts", wpRef: "D12.09", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Verify completeness of disclosure for contingent LD liabilities where outcome is uncertain", wpRef: "D12.10", assertion: "Presentation", isa: "ISA 330.25" }
      ],
      fsliImpact: ["Provisions", "Contingent liabilities", "Cost of sales", "Amounts due on contracts"],
      assertions: ["Completeness", "Valuation", "Accuracy", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provision disclosures", "FRS 102 s21.15 — Contingent liability disclosures", "FRS 102 s32.10 — Events after the reporting period"]
    }
  ],

  manufacturing: [
    {
      riskId: "R01",
      riskDescription: "Inventory valuation — overhead absorption rates may be inaccurate, standard costs may not reflect actual costs, and the lower of cost and NRV test may not be properly applied, leading to material misstatement of inventory",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Complex overhead absorption methodologies involving multiple production lines and cost centres",
        "Standard cost systems may not be updated for current input prices",
        "Work in progress valuation requires estimation of completion stage",
        "Fluctuating commodity prices affect raw material NRV assessments"
      ],
      controlObjectives: [
        "Ensure inventory is stated at the lower of cost and net realisable value",
        "Ensure overhead absorption rates are reasonable and based on normal production capacity",
        "Ensure standard costs are regularly reviewed and adjusted for material variances",
        "Ensure stock counts are accurate and reconciled to the ledger"
      ],
      controlProcedures: [
        "Annual review and board approval of overhead absorption methodology with quarterly variance monitoring",
        "Monthly standard cost variance analysis with investigation thresholds for price and usage variances",
        "Perpetual inventory system with cycle counting programme covering all lines over 12-month period",
        "Annual full physical count with independent supervision and documented count instructions",
        "Monthly NRV review for slow-moving items comparing carrying value to recent selling prices"
      ],
      substantiveTests: [
        { test: "Attend year-end stock count; perform independent test counts across raw materials, WIP, and finished goods categories; investigate all discrepancies", wpRef: "D3.01", assertion: "Existence", isa: "ISA 501.4" },
        { test: "Select sample of inventory items across all categories and test cost build-up: raw materials to purchase invoices, labour to payroll records, overheads to absorption calculations", wpRef: "D3.02", assertion: "Valuation", isa: "ISA 501.4" },
        { test: "Recalculate overhead absorption rates using actual overhead costs and actual/normal production volume; compare to rates used in inventory valuation", wpRef: "D3.03", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "For items with declining demand or excess quantities, compare carrying value to post year-end selling prices less costs to complete and sell", wpRef: "D3.04", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Test cut-off on goods received notes and despatch notes in the last and first five days around year end to verify correct inclusion/exclusion", wpRef: "D3.05", assertion: "Cut-off", isa: "ISA 501.4" }
      ],
      fsliImpact: ["Inventories — raw materials", "Inventories — work in progress", "Inventories — finished goods", "Cost of sales", "Gross profit"],
      assertions: ["Existence", "Valuation", "Cut-off", "Accuracy"],
      disclosureRequirements: ["FRS 102 s13.22 — Accounting policies including cost formulas used", "FRS 102 s13.22(b) — Total carrying amount of inventories by category", "FRS 102 s13.22(c) — Amount of inventories recognised as an expense"]
    },
    {
      riskId: "R02",
      riskDescription: "Obsolete and slow-moving stock provisions — risk that provisions for inventory obsolescence are inadequate due to management optimism or failure to identify slow-moving lines, overstating current assets",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Rapid product lifecycle changes particularly in electronics and FMCG sectors",
        "Management incentive to understate provisions to improve reported profitability",
        "Difficulty in assessing NRV for bespoke or niche products with limited market",
        "Expiry-dated stock in food and pharmaceutical sectors"
      ],
      controlObjectives: [
        "Ensure obsolete and slow-moving inventory is identified on a timely basis",
        "Ensure provision methodology is consistently applied and produces reliable estimates",
        "Ensure write-offs are properly authorised and recorded"
      ],
      controlProcedures: [
        "Monthly slow-moving stock report generated from ERP system showing items with no movement in 3/6/12 months",
        "Quarterly provision review meeting attended by production, sales, and finance functions",
        "Documented obsolescence provision policy with defined ageing bands and provision percentages",
        "Write-off approval authority matrix requiring production director sign-off above defined threshold",
        "Annual comparison of prior year provision to actual write-offs to assess methodology reliability"
      ],
      substantiveTests: [
        { test: "Obtain inventory ageing report and identify items with no movement in 6+ months; assess adequacy of provision applied to each ageing band", wpRef: "D3.06", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For items provided for, verify NRV by examining post year-end sales, customer orders, and market prices less estimated completion and selling costs", wpRef: "D3.07", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Back-test prior year provision by comparing to actual write-offs and reversals in the current year to assess management estimation accuracy", wpRef: "D3.08", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Inspect items during stock count for evidence of damage, deterioration, or obsolescence not reflected in provision", wpRef: "D3.09", assertion: "Valuation", isa: "ISA 501.4" },
        { test: "Challenge management assumptions on future demand by corroborating to sales forecasts, customer contracts, and industry data", wpRef: "D3.10", assertion: "Valuation", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Inventories", "Inventory obsolescence provision", "Cost of sales", "Gross profit"],
      assertions: ["Valuation", "Accuracy", "Completeness"],
      disclosureRequirements: ["FRS 102 s13.22(d) — Amount of any write-down of inventories", "FRS 102 s13.22(e) — Amount of any reversal of write-down", "FRS 102 s13.4 — Lower of cost and estimated selling price less costs to complete and sell"]
    },
    {
      riskId: "R03",
      riskDescription: "Revenue on bill-and-hold and consignment arrangements — risk that revenue is recognised before transfer of control and significant risks and rewards of ownership, particularly on ex-works and consignment stock arrangements",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Bill-and-hold arrangements create risk of premature revenue recognition",
        "Consignment stock held by customers remains the entity's asset until sale to end consumer",
        "FOB/ex-works terms create ambiguity on transfer of risks at year end",
        "Revenue recognition fraud risk per ISA 240.26 presumption"
      ],
      controlObjectives: [
        "Ensure revenue is recognised only when control has transferred per FRS 102 s23",
        "Ensure consignment stock is tracked and excluded from customer revenue until sold-through",
        "Ensure bill-and-hold criteria are met before revenue recognition"
      ],
      controlProcedures: [
        "Revenue recognition policy documented for each arrangement type with specific criteria for recognition",
        "Consignment stock tracking system with monthly reconciliation to customer sell-through reports",
        "Bill-and-hold checklist completed and approved for each arrangement documenting buyer request and commercial substance",
        "Monthly review of despatch-to-invoice timing and investigation of significant delays"
      ],
      substantiveTests: [
        { test: "Identify all bill-and-hold and consignment arrangements; for each, verify that specific recognition criteria per FRS 102 s23 are met", wpRef: "D1.09", assertion: "Occurrence", isa: "ISA 240.26" },
        { test: "For consignment arrangements, reconcile stock held by customers to entity records and verify no revenue recognised on unsold consignment stock", wpRef: "D1.10", assertion: "Cut-off", isa: "ISA 330.20" },
        { test: "Test cut-off by selecting despatch notes in the last 10 days and verifying delivery/acceptance in the correct period per Incoterms", wpRef: "D1.11", assertion: "Cut-off", isa: "ISA 240.26" },
        { test: "For material bill-and-hold items, confirm with customers that goods are held at their request and verify transfer of title", wpRef: "D1.12", assertion: "Occurrence", isa: "ISA 505.7" },
        { test: "Analytical review of revenue by product line and month, investigating unusual spikes in revenue in the final quarter", wpRef: "D1.13", assertion: "Occurrence", isa: "ISA 520.5" }
      ],
      fsliImpact: ["Revenue", "Trade receivables", "Inventories (consignment)", "Deferred income"],
      assertions: ["Occurrence", "Cut-off", "Accuracy", "Classification"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition policies", "FRS 102 s23.30(b) — Methods used to determine stage of completion", "FRS 102 s13.22 — Inventories held on consignment"]
    },
    {
      riskId: "R04",
      riskDescription: "Capital expenditure — capitalisation boundary for plant and equipment additions, with risk that revenue expenditure is capitalised to improve reported profitability or that assets are impaired",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Significant ongoing capital expenditure programme typical of manufacturing entities",
        "Management incentive to capitalise costs that should be expensed (maintenance vs enhancement)",
        "Useful life estimates require judgement and affect depreciation charges",
        "Impairment indicators may exist for underutilised or technologically obsolete equipment"
      ],
      controlObjectives: [
        "Ensure only expenditure meeting capitalisation criteria is capitalised",
        "Ensure useful lives and residual values are reasonable",
        "Ensure impairment reviews are performed when indicators exist"
      ],
      controlProcedures: [
        "Capital expenditure authorisation matrix with documented business case for items above threshold",
        "Post-investment reviews for major capital projects comparing actual outcomes to approved business cases",
        "Annual review of useful lives and residual values by engineering and finance teams",
        "Capitalisation policy clearly distinguishing maintenance (expense) from enhancement (capitalise)"
      ],
      substantiveTests: [
        { test: "For all additions > PM, vouch to purchase invoice, delivery confirmation, and capital expenditure authorisation; verify capitalisation criteria are met", wpRef: "D7.01", assertion: "Existence", isa: "ISA 500.A22" },
        { test: "Test a sample of repairs and maintenance expenditure for items that should have been capitalised, and vice versa", wpRef: "D7.02", assertion: "Classification", isa: "ISA 330.6" },
        { test: "Recalculate depreciation charge for material asset categories using stated useful lives and compare to management calculation", wpRef: "D7.03", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Assess useful life estimates by comparing depreciation rates to industry norms and actual replacement cycles", wpRef: "D7.04", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Review plant utilisation reports and investigate assets with significantly reduced utilisation for impairment indicators", wpRef: "D7.05", assertion: "Valuation", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Tangible fixed assets", "Depreciation", "Administrative expenses", "Impairment losses"],
      assertions: ["Existence", "Valuation", "Classification", "Accuracy"],
      disclosureRequirements: ["FRS 102 s17.31 — Fixed assets: measurement basis, useful lives, gross carrying amount, depreciation", "FRS 102 s17.31(d) — Reconciliation of carrying amount", "FRS 102 s27.32 — Impairment losses recognised or reversed"]
    },
    {
      riskId: "R05",
      riskDescription: "Environmental and decommissioning provisions — risk that provisions for environmental remediation, site decommissioning, and regulatory compliance costs are not recognised or are materially underestimated",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Long-tail environmental liabilities are inherently difficult to estimate",
        "Evolving environmental legislation creates new obligations",
        "Decommissioning cost estimates are sensitive to discount rates and timing assumptions",
        "Management may lack technical expertise to assess remediation costs"
      ],
      controlObjectives: [
        "Ensure all environmental and decommissioning obligations are identified",
        "Ensure provision amounts reflect best estimate of expenditure required to settle the obligation",
        "Ensure discount rates and timing assumptions are appropriate"
      ],
      controlProcedures: [
        "Annual environmental compliance review with external specialist input",
        "Environmental incident register with formal escalation and remediation tracking",
        "Decommissioning cost estimates updated annually using qualified environmental consultants",
        "Board-level review of environmental provision adequacy as part of year-end close"
      ],
      substantiveTests: [
        { test: "Review environmental compliance reports, regulatory correspondence, and site inspection results for unrecognised obligations", wpRef: "D12.11", assertion: "Completeness", isa: "ISA 250.14" },
        { test: "For material provisions, evaluate management's expert (environmental consultant) in accordance with ISA 500.8 and challenge key assumptions", wpRef: "D12.12", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Verify discount rates used in decommissioning provisions are appropriate pre-tax rates reflecting current market assessments", wpRef: "D12.13", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Back-test prior year environmental provisions against actual remediation expenditure incurred in the current year", wpRef: "D12.14", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Assess whether provisions meet FRS 102 s21.4 recognition criteria: present obligation from past event, probable outflow, reliable measurement", wpRef: "D12.15", assertion: "Valuation", isa: "ISA 330.20" }
      ],
      fsliImpact: ["Provisions", "Contingent liabilities", "Administrative expenses", "Finance costs (unwinding of discount)"],
      assertions: ["Completeness", "Valuation", "Accuracy", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Reconciliation of provision carrying amount", "FRS 102 s21.14(c) — Amounts charged/(credited) to profit or loss", "FRS 102 s21.15 — Contingent liabilities: nature and estimated financial effect"]
    }
  ],

  technology: [
    {
      riskId: "R01",
      riskDescription: "Revenue from multi-element arrangements — risk that transaction prices are not correctly allocated to separate performance obligations, leading to misstated revenue across licence, implementation, and support elements",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Bundled arrangements combining licence, implementation, customisation, and ongoing support",
        "Standalone selling prices may not be directly observable requiring estimation",
        "Variable consideration elements (success fees, usage-based pricing) require constraint assessment",
        "Management judgement in identifying distinct performance obligations"
      ],
      controlObjectives: [
        "Ensure performance obligations are correctly identified in each contract",
        "Ensure transaction price is allocated on a relative standalone selling price basis",
        "Ensure revenue is recognised in the correct period reflecting transfer of control"
      ],
      controlProcedures: [
        "Revenue recognition policy paper updated annually for new product/service offerings",
        "Contract review checklist completed by finance for all contracts above defined value threshold",
        "Standalone selling price matrix maintained and updated quarterly based on actual transaction data",
        "Monthly deferred revenue reconciliation with detailed roll-forward prepared and reviewed by finance director",
        "Segregation between sales team (contract negotiation) and finance (revenue recognition)"
      ],
      substantiveTests: [
        { test: "For material contracts, read the contract and independently identify performance obligations; compare to management's assessment and challenge differences", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 330.20" },
        { test: "Test standalone selling price allocation by comparing to observable prices where available or assessing reasonableness of estimation methodology", wpRef: "D1.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Recalculate deferred revenue roll-forward for the year: opening balance plus billings less recognised revenue equals closing balance", wpRef: "D1.03", assertion: "Cut-off", isa: "ISA 330.21" },
        { test: "For implementation revenue recognised over time, verify percentage of completion by reference to timesheets, milestones, and project manager sign-off", wpRef: "D1.04", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Test a sample of new contracts entered into in the final quarter; verify correct identification of obligations and allocation of transaction price", wpRef: "D1.05", assertion: "Occurrence", isa: "ISA 240.26" }
      ],
      fsliImpact: ["Revenue — licence", "Revenue — SaaS subscription", "Revenue — implementation services", "Deferred revenue", "Accrued income", "Contract assets"],
      assertions: ["Occurrence", "Accuracy", "Cut-off", "Classification"],
      disclosureRequirements: ["FRS 102 s23.30 — Accounting policies for revenue including methods of recognising revenue", "FRS 102 s23.30(b) — For each category of revenue, the amount recognised", "FRS 102 s23.32 — Contract balances: receivables, contract assets, contract liabilities"]
    },
    {
      riskId: "R02",
      riskDescription: "Development cost capitalisation — risk that costs capitalised as intangible assets do not meet all six FRS 102 s18.8H criteria, or that capitalised assets are impaired",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Subjective boundary between research (expense) and development (may capitalise)",
        "Six strict criteria must all be met simultaneously for capitalisation to commence",
        "Management incentive to capitalise to improve reported profitability",
        "Rapid technology change creates impairment risk for previously capitalised costs",
        "Amortisation period requires estimation of useful economic life"
      ],
      controlObjectives: [
        "Ensure only costs meeting all FRS 102 s18.8H criteria are capitalised",
        "Ensure the research/development boundary is correctly identified for each project",
        "Ensure capitalised assets are amortised over appropriate useful lives",
        "Ensure impairment reviews are performed when indicators exist"
      ],
      controlProcedures: [
        "Project initiation document required for all development projects, including technical feasibility assessment",
        "Capitalisation commencement approved by CTO and CFO jointly using documented checklist",
        "Monthly time recording system with project codes distinguishing research from development activities",
        "Quarterly impairment indicator review for all capitalised development projects",
        "Annual useful life review for amortisation purposes with input from product management"
      ],
      substantiveTests: [
        { test: "For each material capitalised project, assess all six FRS 102 s18.8H criteria: technical feasibility, intention to complete, ability to use/sell, probable future economic benefits, adequate resources, ability to measure costs reliably", wpRef: "D8.01", assertion: "Existence", isa: "ISA 540.18" },
        { test: "Test a sample of costs capitalised by vouching to timesheets (labour), purchase invoices (third-party), and overhead allocation schedules; verify directly attributable", wpRef: "D8.02", assertion: "Valuation", isa: "ISA 500.A22" },
        { test: "Challenge useful life assumptions by discussing with CTO/product team and comparing to product roadmaps and technology lifecycle expectations", wpRef: "D8.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Review projects for impairment indicators: cost overruns, launch delays, reduced market expectations, competitor activity, declining user metrics", wpRef: "D8.04", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Recalculate amortisation charge for the year using stated useful lives and verify commencement date (when asset is available for use)", wpRef: "D8.05", assertion: "Accuracy", isa: "ISA 540.18" }
      ],
      fsliImpact: ["Intangible assets — development costs", "Amortisation", "Impairment losses", "Administrative expenses"],
      assertions: ["Existence", "Valuation", "Accuracy", "Classification"],
      disclosureRequirements: ["FRS 102 s18.27 — Intangible assets: useful lives, amortisation methods, gross carrying amount, accumulated amortisation", "FRS 102 s18.27(e) — Reconciliation of carrying amount", "FRS 102 s18.27(c) — Amortisation recognised in profit or loss"]
    },
    {
      riskId: "R03",
      riskDescription: "Deferred revenue accuracy — risk that deferred revenue balances do not accurately reflect remaining performance obligations, leading to incorrect timing of revenue recognition",
      level: "ELEVATED",
      inherentRiskFactors: [
        "High volume of subscription contracts with varying terms and renewal dates",
        "Mid-contract upgrades, downgrades, and cancellations create complexity",
        "Billing in advance creates large deferred revenue balances requiring accurate release",
        "Breakage estimates for unused credits or prepaid usage involve estimation"
      ],
      controlObjectives: [
        "Ensure deferred revenue accurately reflects unearned amounts at the reporting date",
        "Ensure revenue is released from deferred revenue systematically over the performance period",
        "Ensure contract modifications are reflected in deferred revenue calculations"
      ],
      controlProcedures: [
        "Automated deferred revenue scheduling in billing system based on contract start/end dates",
        "Monthly deferred revenue roll-forward reconciliation reviewed by finance manager",
        "Contract modification workflow requiring finance team update of revenue schedules",
        "Quarterly analytical review comparing deferred revenue movement to billings and recognised revenue"
      ],
      substantiveTests: [
        { test: "Select sample of deferred revenue balances at year end; agree to underlying contracts and recalculate the deferred portion based on remaining performance period", wpRef: "D1.06", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Test the deferred revenue roll-forward: opening balance plus amounts billed/deferred less amounts recognised equals closing balance", wpRef: "D1.07", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "For contracts modified during the year, verify that deferred revenue has been adjusted to reflect the modification", wpRef: "D1.08", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Test revenue recognised in the first month post year-end to verify no amounts that should have been deferred were recognised in the current year", wpRef: "D1.09", assertion: "Cut-off", isa: "ISA 240.26" },
        { test: "Perform analytical review of deferred revenue as a percentage of ARR and compare to prior year and expectations based on billing patterns", wpRef: "D1.10", assertion: "Valuation", isa: "ISA 520.5" }
      ],
      fsliImpact: ["Deferred revenue", "Revenue — SaaS subscription", "Revenue — support and maintenance", "Accrued income"],
      assertions: ["Accuracy", "Cut-off", "Completeness", "Valuation"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition policies", "FRS 102 s23.32 — Contract liabilities (deferred revenue)", "FRS 102 s4.12 — Creditors: amounts falling due within one year"]
    },
    {
      riskId: "R04",
      riskDescription: "Share-based payment valuation and expense — risk that share option expense under FRS 102 s26 is misstated due to incorrect option pricing model inputs, vesting condition assessments, or incomplete identification of arrangements",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Option pricing models (Black-Scholes, Monte Carlo) are sensitive to input assumptions",
        "Non-market vesting conditions require estimation of expected forfeitures",
        "Complex scheme structures (EMI, growth shares, phantom options) require different accounting treatments",
        "Frequent scheme modifications in growth-stage technology companies"
      ],
      controlObjectives: [
        "Ensure all share-based payment arrangements are identified and accounted for",
        "Ensure fair value is measured using appropriate model and inputs at grant date",
        "Ensure expense is recognised over the vesting period with appropriate forfeiture adjustments"
      ],
      controlProcedures: [
        "Centralised share option register maintained by company secretary with finance notification of all grants",
        "External valuation obtained for material or complex option grants",
        "Quarterly review of non-market vesting condition assumptions (e.g. expected leavers)",
        "Board minutes reviewed for all equity-related decisions including modifications"
      ],
      substantiveTests: [
        { test: "Obtain complete share option register and reconcile grants, exercises, lapses, and outstanding options; verify completeness against board minutes", wpRef: "D10.01", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "For material grants, independently assess reasonableness of valuation model inputs: volatility, risk-free rate, expected life, dividend yield", wpRef: "D10.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Recalculate the share-based payment expense for the year including truing-up of forfeiture estimates against actual lapses", wpRef: "D10.03", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "For any scheme modifications, verify modification accounting has been applied correctly per FRS 102 s26.12", wpRef: "D10.04", assertion: "Accuracy", isa: "ISA 330.20" },
        { test: "Verify related tax deductions (corporation tax on exercise) are correctly calculated and deferred tax on unexercised options is appropriate", wpRef: "D10.05", assertion: "Accuracy", isa: "ISA 540.23" }
      ],
      fsliImpact: ["Share-based payment expense", "Share option reserve", "Administrative expenses", "Deferred tax asset"],
      assertions: ["Completeness", "Valuation", "Accuracy", "Presentation"],
      disclosureRequirements: ["FRS 102 s26.23 — Description of each type of arrangement", "FRS 102 s26.23(b) — Number and weighted average exercise price of options", "FRS 102 s26.23(d) — Expense recognised for the period"]
    },
    {
      riskId: "R05",
      riskDescription: "R&D tax credit eligibility and measurement — risk that R&D tax credits claimed do not meet qualifying criteria under CTA 2009, leading to overstatement of tax assets or understatement of tax liabilities",
      level: "ELEVATED",
      inherentRiskFactors: [
        "HMRC scrutiny of R&D claims has increased significantly with compliance checks",
        "Qualifying expenditure criteria are technical and require specialist knowledge",
        "Boundary between qualifying R&D and routine software development is subjective",
        "SME scheme vs RDEC scheme selection affects measurement"
      ],
      controlObjectives: [
        "Ensure R&D tax credit claims are based on qualifying activities and expenditure",
        "Ensure the correct scheme (SME or RDEC) is applied",
        "Ensure tax asset recognition criteria are met"
      ],
      controlProcedures: [
        "R&D claim prepared with specialist tax adviser input and documented project-by-project",
        "Technical narrative prepared by CTO describing advances in science or technology sought",
        "Expenditure qualifying analysis with time records supporting staff cost allocation to R&D projects",
        "Annual review of SME/RDEC eligibility considering connected companies and grant funding"
      ],
      substantiveTests: [
        { test: "Review R&D tax credit claim and assess whether claimed projects involve an advance in science or technology per CTA 2009 s1042", wpRef: "D13.01", assertion: "Existence", isa: "ISA 540.18" },
        { test: "Test a sample of qualifying expenditure: staff costs to payroll records and time allocations, consumables to invoices, subcontractor costs to invoices and 65% restriction", wpRef: "D13.02", assertion: "Accuracy", isa: "ISA 500.A22" },
        { test: "Verify correct scheme (SME vs RDEC) is applied by assessing headcount, turnover, and balance sheet size thresholds, considering connected companies", wpRef: "D13.03", assertion: "Classification", isa: "ISA 250.14" },
        { test: "For above-the-line RDEC credits, verify accounting treatment as other income with corresponding tax charge", wpRef: "D13.04", assertion: "Classification", isa: "ISA 330.20" },
        { test: "Assess recoverability of R&D credit receivable: review HMRC correspondence, confirm no open compliance checks, assess payment timeline", wpRef: "D13.05", assertion: "Valuation", isa: "ISA 540.23" }
      ],
      fsliImpact: ["R&D tax credit receivable", "Corporation tax charge", "Tax payable/receivable", "Other income (RDEC)"],
      assertions: ["Existence", "Accuracy", "Valuation", "Classification"],
      disclosureRequirements: ["FRS 102 s29.27 — Components of tax expense", "FRS 102 s29.28 — Tax reconciliation", "FRS 102 s29.27(d) — Tax credits"]
    }
  ],

  financial_services: [
    {
      riskId: "R01",
      riskDescription: "Fair value measurement of financial instruments — risk that Level 2 and Level 3 instruments are mispriced due to model risk, stale inputs, or inappropriate valuation techniques, materially misstating the balance sheet",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Level 3 instruments use unobservable inputs requiring significant management judgement",
        "Model risk where valuation models may not reflect current market conditions",
        "Illiquid markets may result in stale pricing data",
        "Complex structured products with embedded derivatives",
        "Management incentive to overstate asset values or understate liability values"
      ],
      controlObjectives: [
        "Ensure fair values are determined using appropriate valuation techniques and inputs",
        "Ensure independent price verification is performed for material positions",
        "Ensure valuation models are validated and approved",
        "Ensure fair value hierarchy classification is correct"
      ],
      controlProcedures: [
        "Independent price verification (IPV) team separate from front office performing daily/monthly checks",
        "Valuation committee meeting monthly to review and approve Level 3 valuations with documented challenge",
        "Model validation by independent quantitative team before production use and annual re-validation",
        "Escalation process for pricing differences exceeding defined thresholds",
        "Fair value hierarchy classification review at each reporting date"
      ],
      substantiveTests: [
        { test: "For Level 1 instruments, independently verify prices to quoted market prices from independent pricing sources (Bloomberg, Reuters)", wpRef: "D9.01", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For Level 2 instruments, independently revalue using observable market inputs; investigate differences from management valuations exceeding 5%", wpRef: "D9.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For Level 3 instruments, evaluate management's valuation methodology, challenge key assumptions, and where material, engage auditor's valuation expert", wpRef: "D9.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Verify fair value hierarchy classification by assessing observability of inputs used in valuation for a sample of instruments", wpRef: "D9.04", assertion: "Presentation", isa: "ISA 330.25" },
        { test: "Test post year-end transactions for instruments held at fair value to corroborate year-end valuations", wpRef: "D9.05", assertion: "Valuation", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Financial assets at fair value", "Financial liabilities at fair value", "Fair value gains/losses", "Other comprehensive income"],
      assertions: ["Valuation", "Existence", "Presentation", "Rights"],
      disclosureRequirements: ["FRS 102 s11.43 — Fair value disclosures by class of instrument", "FRS 102 s11.48A — Fair value hierarchy disclosures", "FRS 102 s11.48A(c) — Level 3 reconciliation"]
    },
    {
      riskId: "R02",
      riskDescription: "Expected credit loss provisioning — risk that ECL provisions are misstated due to model deficiencies, incorrect staging, inappropriate forward-looking scenarios, or management override of model outputs",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "ECL models are complex and rely on probability of default, loss given default, and exposure at default estimates",
        "Forward-looking macroeconomic scenarios require significant judgement",
        "Staging criteria (significant increase in credit risk) involve subjectivity",
        "Management overlays to model outputs create risk of bias",
        "Data quality issues in loan portfolios can affect model inputs"
      ],
      controlObjectives: [
        "Ensure ECL models produce reliable estimates reflecting current and forward-looking conditions",
        "Ensure staging assessments correctly identify significant increases in credit risk",
        "Ensure management overlays are documented, approved, and supported by evidence",
        "Ensure data inputs to ECL models are complete and accurate"
      ],
      controlProcedures: [
        "ECL model governance framework with independent model validation before implementation",
        "Monthly staging review with documented criteria for migration between Stage 1, 2, and 3",
        "Quarterly management overlay review by credit committee with documented rationale",
        "Annual back-testing of PD, LGD, and EAD model parameters against actual outcomes",
        "Data quality framework with automated controls and exception reporting on loan data feeds"
      ],
      substantiveTests: [
        { test: "Evaluate ECL model methodology against FRS 102 s11.21-22 requirements; assess whether model captures all relevant risk characteristics", wpRef: "D11.01", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Test staging classification for a sample of loans: verify Stage 1 (12-month ECL), Stage 2 (lifetime ECL for significantly deteriorated), and Stage 3 (credit-impaired)", wpRef: "D11.02", assertion: "Classification", isa: "ISA 540.18" },
        { test: "Challenge forward-looking macroeconomic scenarios by comparing to independent forecasts (Bank of England, OBR) and assessing probability weightings", wpRef: "D11.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Back-test prior year ECL provision by comparing expected losses to actual losses experienced; identify systematic over or under-provisioning", wpRef: "D11.04", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Evaluate all management overlays: assess documented rationale, quantify impact, and challenge whether overlay is appropriate and not indicative of model deficiency", wpRef: "D11.05", assertion: "Valuation", isa: "ISA 330.20" }
      ],
      fsliImpact: ["ECL provision (balance sheet)", "Impairment charge (P&L)", "Loans and advances", "Interest income (effective interest)"],
      assertions: ["Valuation", "Accuracy", "Completeness", "Classification"],
      disclosureRequirements: ["FRS 102 s11.42 — Credit risk disclosures", "FRS 102 s11.48 — Ageing analysis of financial assets past due", "FRS 102 s11.48(a) — Information about credit quality"]
    },
    {
      riskId: "R03",
      riskDescription: "Revenue on complex financial products — risk that fee income, commissions, and trading income are not accurately measured or recognised in the correct period",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Multiple revenue streams with different recognition triggers (transaction-based, time-based, AUM-based)",
        "Performance fees with complex calculation bases and clawback provisions",
        "Upfront fees requiring spreading over service period",
        "Commission sharing arrangements with intermediaries"
      ],
      controlObjectives: [
        "Ensure fee income is recognised in accordance with the substance of the arrangement",
        "Ensure upfront fees are deferred and released appropriately",
        "Ensure AUM-based fees are calculated on accurate AUM data"
      ],
      controlProcedures: [
        "Automated fee calculation engines reconciled to custodian AUM data monthly",
        "Independent reconciliation of commission statements to revenue recognised",
        "Performance fee calculations reviewed by compliance and finance independently",
        "Deferred fee schedule maintained for upfront arrangement fees"
      ],
      substantiveTests: [
        { test: "Recalculate management fees for a sample of funds/clients using verified AUM data and contractual fee rates", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "For performance fees, independently recalculate using fund performance data, high-water marks, and hurdle rates per fund documentation", wpRef: "D1.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Test a sample of upfront fees to verify appropriate deferral and release over the service period", wpRef: "D1.03", assertion: "Cut-off", isa: "ISA 330.20" },
        { test: "Reconcile trading income to trade tickets and settlement records for a sample of trading days", wpRef: "D1.04", assertion: "Occurrence", isa: "ISA 500.A22" },
        { test: "Verify commission sharing arrangements for a sample of intermediary relationships and recalculate commissions payable", wpRef: "D1.05", assertion: "Completeness", isa: "ISA 330.21" }
      ],
      fsliImpact: ["Fee income", "Trading income", "Commission income", "Deferred arrangement fees", "Commissions payable"],
      assertions: ["Accuracy", "Occurrence", "Cut-off", "Completeness"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition accounting policies", "FRS 102 s23.30(b) — Revenue by category", "FRS 102 s11.42 — Financial instruments disclosures"]
    },
    {
      riskId: "R05",
      riskDescription: "Client money segregation — risk that client money is not properly segregated from firm money, leading to regulatory breach and potential loss of client assets",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "CASS 7 requirements are prescriptive and breach triggers regulatory action",
        "High volume of daily client money movements across multiple bank accounts",
        "Complex pooling arrangements across multiple clients and jurisdictions",
        "Risk that firm money is temporarily held in client accounts or vice versa"
      ],
      controlObjectives: [
        "Ensure client money is held in designated client money bank accounts",
        "Ensure daily internal client money reconciliation is performed",
        "Ensure client money is not used for firm purposes"
      ],
      controlProcedures: [
        "Daily internal client money reconciliation prepared by operations and reviewed by compliance",
        "Client money bank accounts designated with acknowledgement letters from banks on file",
        "Segregated client money calculation performed daily with any shortfall funded immediately",
        "Monthly CASS resolution pack prepared and reviewed by CASS oversight officer"
      ],
      substantiveTests: [
        { test: "Confirm client money bank balances directly with banks and reconcile to client money records at year end", wpRef: "D6.01", assertion: "Existence", isa: "ISA 505.7" },
        { test: "Test the daily internal client money reconciliation for a sample of dates throughout the year; investigate any breaches or shortfalls", wpRef: "D6.02", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Verify bank acknowledgement letters are in place for all client money accounts and terms comply with CASS 7 requirements", wpRef: "D6.03", assertion: "Rights", isa: "ISA 500.A22" },
        { test: "Recalculate the client money requirement at year end and compare to actual segregated funds", wpRef: "D6.04", assertion: "Completeness", isa: "ISA 330.20" },
        { test: "Review CASS breach log and assess any breaches during the year for impact on auditor's regulatory report (CASS audit)", wpRef: "D6.05", assertion: "Occurrence", isa: "ISA 250.14" }
      ],
      fsliImpact: ["Client money (segregated — off balance sheet)", "Client money creditor (if shortfall)", "Regulatory disclosures"],
      assertions: ["Existence", "Accuracy", "Rights", "Completeness"],
      disclosureRequirements: ["FRS 102 s11.42 — Nature and extent of risks arising from financial instruments", "CASS 7 Client Money Rules — Annual CASS audit report", "FCA SUP 3.10 — CASS auditor reporting requirements"]
    },
    {
      riskId: "R04",
      riskDescription: "Regulatory capital adequacy — risk that regulatory capital ratios are incorrectly calculated or that capital resources are insufficient, with going concern implications",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Complex risk-weighted asset calculations requiring specialist knowledge",
        "Frequent regulatory changes to capital requirements",
        "Going concern implications if minimum capital ratios are breached",
        "Deductions from capital (intangible assets, deferred tax) require careful application"
      ],
      controlObjectives: [
        "Ensure regulatory capital is correctly calculated per applicable requirements",
        "Ensure adequate capital buffer is maintained above minimum requirements",
        "Ensure regulatory returns are accurate and filed on time"
      ],
      controlProcedures: [
        "Monthly capital adequacy calculation prepared by finance and reviewed by risk management",
        "Capital planning process with board-approved ICAAP/ICARA reviewed at least annually",
        "Early warning indicators with escalation triggers set above minimum capital requirements",
        "Quarterly regulatory return preparation with independent review before submission"
      ],
      substantiveTests: [
        { test: "Recalculate capital resources at year end: verify CET1 capital, AT1, Tier 2 components, and required deductions", wpRef: "D10.01", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Verify risk-weighted asset calculations for material exposure categories by recalculating risk weights per applicable rules", wpRef: "D10.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Compare regulatory capital ratios to minimum requirements and internal buffers; assess going concern implications of any shortfalls", wpRef: "D10.03", assertion: "Valuation", isa: "ISA 570.10" },
        { test: "Reconcile regulatory balance sheet to GAAP balance sheet and investigate any adjustments", wpRef: "D10.04", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Review FCA/PRA correspondence for any regulatory action, s166 reviews, or capital add-ons that affect requirements", wpRef: "D10.05", assertion: "Completeness", isa: "ISA 250.14" }
      ],
      fsliImpact: ["Regulatory capital disclosures", "Going concern assessment", "Subordinated debt classification", "Retained earnings"],
      assertions: ["Accuracy", "Completeness", "Valuation", "Presentation"],
      disclosureRequirements: ["FRS 102 s11.48A — Capital disclosures", "FRS 102 s3.24 — Going concern disclosures", "FCA/PRA Pillar 3 disclosure requirements"]
    },
    {
      riskId: "R06",
      riskDescription: "Anti-money laundering compliance — risk that inadequate AML controls result in regulatory penalties, reputational damage, and potential provisions for fines or client remediation costs",
      level: "ELEVATED",
      inherentRiskFactors: [
        "MLR 2017 requirements are extensive and breach carries criminal penalties",
        "Increasing regulatory scrutiny with large fines for AML failures",
        "Complex beneficial ownership structures make CDD challenging",
        "Transaction monitoring systems may fail to detect suspicious patterns"
      ],
      controlObjectives: [
        "Ensure CDD/KYC procedures comply with MLR 2017 requirements",
        "Ensure suspicious activity is identified, escalated, and reported",
        "Ensure adequate provisions exist for any regulatory action or remediation costs"
      ],
      controlProcedures: [
        "Risk-based CDD process with enhanced due diligence for high-risk customers",
        "Automated transaction monitoring with calibrated alerts reviewed by MLRO",
        "Annual firm-wide AML risk assessment reviewed and approved by board",
        "Regular employee AML training with completion tracking and assessment"
      ],
      substantiveTests: [
        { test: "Review entity's AML risk assessment and policies for compliance with MLR 2017; assess whether risk-based approach is appropriate", wpRef: "D15.01", assertion: "Completeness", isa: "ISA 250.14" },
        { test: "Test a sample of customer files for completeness of CDD records: ID verification, source of funds, PEP/sanctions screening, risk rating", wpRef: "D15.02", assertion: "Occurrence", isa: "ISA 250.14" },
        { test: "Review SAR filing register and assess whether suspicious activity is being identified and reported to NCA appropriately", wpRef: "D15.03", assertion: "Completeness", isa: "ISA 250.22" },
        { test: "Assess any pending or threatened regulatory action and evaluate whether provision or contingent liability disclosure is required", wpRef: "D15.04", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Review FCA/OPBAS correspondence and skilled person (s166) reports for AML-related findings or required remediation", wpRef: "D15.05", assertion: "Completeness", isa: "ISA 250.22" }
      ],
      fsliImpact: ["Provisions for regulatory fines", "Contingent liabilities", "Administrative expenses", "Compliance costs"],
      assertions: ["Completeness", "Valuation", "Occurrence", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provisions for regulatory fines or remediation", "FRS 102 s21.15 — Contingent liabilities", "FRS 102 s32.10 — Post balance sheet regulatory events"]
    },
    {
      riskId: "R07",
      riskDescription: "FCA Consumer Duty compliance (PS22/9, Principle 12) — risk that the firm fails to deliver good outcomes for retail customers across the four Consumer Duty outcomes, resulting in regulatory enforcement, redress costs, and reputational damage",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Consumer Duty imposes a higher standard than previous TCF requirements with prescriptive outcome expectations",
        "Four distinct outcome areas each require dedicated monitoring and testing",
        "Fair value assessments require detailed analysis of all cost components and benefits across customer cohorts",
        "Board-level accountability for Consumer Duty compliance introduces governance risk",
        "Closed products brought into scope from 31 July 2024 may lack adequate MI and monitoring infrastructure"
      ],
      controlObjectives: [
        "Ensure products and services are designed and distributed to meet the needs of the identified target market",
        "Ensure fair value is delivered to retail customers with documented value assessments for all products",
        "Ensure customer communications support effective and informed decision-making",
        "Ensure customer support is accessible throughout the product lifecycle without unreasonable barriers"
      ],
      controlProcedures: [
        "Product governance framework with target market assessments and ongoing product reviews",
        "Annual fair value assessments for all products and services reviewed by pricing committee",
        "Consumer understanding testing programme with results reported to customer outcomes committee",
        "Consumer support MI including response times, channel availability, and comparative analysis of purchase vs post-sale support",
        "Quarterly Consumer Duty outcomes dashboard reviewed by executive committee",
        "Annual board Consumer Duty compliance report prepared and approved"
      ],
      substantiveTests: [
        { test: "Obtain and review the firm's product governance framework; for a sample of products launched or materially changed during the year, verify that target market assessments were completed, distribution strategies aligned, and ongoing product reviews performed", wpRef: "D20.01", assertion: "Completeness", isa: "ISA 250.14" },
        { test: "For a sample of products, obtain the fair value assessment and evaluate methodology: verify all cost components are included, assess whether benefits are reasonable relative to price, and test whether differential outcomes across customer cohorts have been considered", wpRef: "D20.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Select a sample of key customer-facing communications (product disclosures, annual statements, fee notifications, terms changes) and evaluate for clarity, prominence of key information, and appropriateness for the identified target market including vulnerable customers", wpRef: "D20.03", assertion: "Presentation", isa: "ISA 250.14" },
        { test: "Evaluate consumer support channels: compare average response times for purchase enquiries vs complaints, switching, and cancellation requests; test for evidence of unreasonable barriers to exit or switching including friction in digital journeys", wpRef: "D20.04", assertion: "Completeness", isa: "ISA 250.14" },
        { test: "Obtain and review the Consumer Duty MI dashboard: assess whether MI covers all four outcome areas with appropriate lead and lag indicators, verify data sources and accuracy for a sample of reported metrics, and evaluate whether adverse trends triggered appropriate escalation and remediation", wpRef: "D20.05", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Obtain the annual board Consumer Duty compliance report: evaluate whether it covers all four outcome areas, assess whether identified shortcomings have documented action plans with clear ownership and deadlines, and verify that board challenge is evidenced in meeting minutes", wpRef: "D20.06", assertion: "Completeness", isa: "ISA 250.22" }
      ],
      fsliImpact: ["Provisions for customer redress or remediation", "Contingent liabilities for regulatory action", "Administrative expenses (compliance costs)", "Revenue (repricing or refund obligations where poor value identified)"],
      assertions: ["Completeness", "Valuation", "Accuracy", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provisions for customer remediation or regulatory fines", "FRS 102 s21.15 — Contingent liabilities for FCA enforcement action", "FRS 102 s32.10 — Post balance sheet regulatory events including Consumer Duty enforcement"]
    }
  ],

  retail: [
    {
      riskId: "R01",
      riskDescription: "Inventory valuation — markdowns, shrinkage, and obsolescence create significant risk of overstatement, particularly for seasonal, fashion, and perishable stock",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "High shrinkage rates typical in retail (1-3% of sales in some sectors)",
        "Seasonal stock requiring markdown at end of season",
        "Perishable goods requiring write-off before or at expiry",
        "Large number of SKUs across multiple locations makes completeness of count difficult",
        "Management incentive to delay markdowns to improve reported margins"
      ],
      controlObjectives: [
        "Ensure inventory is stated at the lower of cost and net realisable value",
        "Ensure shrinkage is accurately estimated and provided for",
        "Ensure markdown decisions are timely and reflected in the valuation"
      ],
      controlProcedures: [
        "Rolling stock count programme across all locations with independent counts supervised by loss prevention team",
        "EPOS system providing real-time stock data with exception reporting for negative stock lines",
        "Automated markdown scheduling for seasonal lines based on sell-through rate triggers",
        "Monthly shrinkage analysis by store and category with investigation of outliers",
        "Year-end full count for material locations with documented count instructions and independent observation"
      ],
      substantiveTests: [
        { test: "Attend stock counts at material locations; perform independent test counts covering high-value and high-risk categories; compare to system records", wpRef: "D3.01", assertion: "Existence", isa: "ISA 501.4" },
        { test: "Test shrinkage provision by comparing to actual shrinkage identified through counts and adjusting for known loss events", wpRef: "D3.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Test NRV by selecting sample of seasonal/aged lines and comparing carrying cost to post year-end selling prices less costs to sell", wpRef: "D3.03", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Verify cost prices for a sample of items to purchase invoices and assess cost formula (weighted average, FIFO) is consistently applied", wpRef: "D3.04", assertion: "Accuracy", isa: "ISA 501.4" },
        { test: "Test cut-off by examining goods received notes and returns around year end at distribution centres and stores", wpRef: "D3.05", assertion: "Cut-off", isa: "ISA 501.4" }
      ],
      fsliImpact: ["Inventories — finished goods", "Inventories — goods in transit", "Cost of sales", "Shrinkage provision", "Gross profit"],
      assertions: ["Existence", "Valuation", "Cut-off", "Accuracy"],
      disclosureRequirements: ["FRS 102 s13.22 — Accounting policies including cost formulas", "FRS 102 s13.22(b) — Total carrying amount by category", "FRS 102 s13.22(d) — Amount of write-down recognised as expense"]
    },
    {
      riskId: "R02",
      riskDescription: "Revenue — loyalty programmes, gift cards, and returns create complexity in determining the amount and timing of revenue recognition, with risk of misstatement of deferred revenue balances",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Loyalty points represent a separate performance obligation requiring deferral",
        "Gift card breakage estimation (proportion never redeemed) requires judgement",
        "High volume of returns particularly in online retail requiring returns provision",
        "Multiple promotional mechanisms create pricing complexity"
      ],
      controlObjectives: [
        "Ensure loyalty point liabilities accurately reflect expected future redemptions",
        "Ensure gift card liabilities are maintained and breakage is estimated appropriately",
        "Ensure returns provisions reflect expected returns based on historical data"
      ],
      controlProcedures: [
        "Loyalty point liability recalculated monthly based on outstanding points and expected redemption rates",
        "Gift card register reconciled to liability account monthly with breakage assumptions reviewed annually",
        "Returns provision calculated monthly using rolling historical return rates by channel and product category",
        "Revenue recognised net of expected returns with provision updated for actual returns processed"
      ],
      substantiveTests: [
        { test: "Recalculate loyalty point deferred revenue using outstanding points at year end multiplied by fair value per point, adjusted for expected breakage/expiry", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Test gift card liability by reconciling: opening balance plus cards sold less cards redeemed less breakage recognised equals closing balance", wpRef: "D1.02", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Assess reasonableness of breakage estimate by analysing historical redemption curves and comparing to prior year assumptions", wpRef: "D1.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Test returns provision by comparing estimated return rates to actual post year-end returns and historical return patterns by category", wpRef: "D1.04", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For online sales, test cut-off by reviewing despatches in the last 5 days and verifying delivery confirmation for recognition timing", wpRef: "D1.05", assertion: "Cut-off", isa: "ISA 240.26" }
      ],
      fsliImpact: ["Revenue", "Loyalty point liability", "Gift card liability", "Returns provision", "Deferred revenue"],
      assertions: ["Accuracy", "Valuation", "Cut-off", "Completeness"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition policies for loyalty and gift cards", "FRS 102 s23.32 — Contract liabilities", "FRS 102 s21.14 — Returns provision"]
    },
    {
      riskId: "R03",
      riskDescription: "Lease accounting for retail store portfolio — risk that right-of-use assets and lease liabilities are misstated due to errors in lease term assessment, discount rate selection, or lease modification accounting",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Large portfolio of store leases with varying terms, break clauses, and options",
        "Lease modifications (rent reviews, regears, surrenders) require remeasurement",
        "Incremental borrowing rate determination requires judgement when implicit rate unavailable",
        "Assessment of whether options to extend or terminate are reasonably certain involves judgement"
      ],
      controlObjectives: [
        "Ensure all leases are identified and correctly classified",
        "Ensure ROU assets and lease liabilities are accurately measured",
        "Ensure lease modifications trigger appropriate remeasurement"
      ],
      controlProcedures: [
        "Centralised lease database maintained by property team with finance review of all new leases and modifications",
        "Lease calculation model with automated generation of ROU asset and liability schedules",
        "Annual review of lease term assumptions including assessment of break clause and extension option reasonability",
        "Incremental borrowing rate methodology documented and approved by finance director annually"
      ],
      substantiveTests: [
        { test: "For a sample of material leases, agree key terms (commencement, term, payments, break clauses, options) to underlying lease agreements", wpRef: "D14.01", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Recalculate ROU asset and lease liability for material leases using agreed terms and entity's discount rate; compare to management's calculation", wpRef: "D14.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Assess incremental borrowing rate by comparing to recent borrowing rates, benchmark data, and credit risk of the entity", wpRef: "D14.03", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Test lease modifications during the year by agreeing to signed deeds/amendments and verifying remeasurement has been performed correctly", wpRef: "D14.04", assertion: "Accuracy", isa: "ISA 330.20" },
        { test: "Verify completeness of lease population by reviewing new store openings, property committee minutes, and rent payment listings for unrecorded leases", wpRef: "D14.05", assertion: "Completeness", isa: "ISA 330.21" }
      ],
      fsliImpact: ["Right-of-use assets", "Lease liabilities", "Depreciation of ROU assets", "Lease interest expense", "Lease payments"],
      assertions: ["Accuracy", "Completeness", "Valuation", "Existence"],
      disclosureRequirements: ["FRS 102 s20.16 — Lessee disclosures: carrying amounts by class", "FRS 102 s20.16(b) — Depreciation charge for ROU assets", "FRS 102 s20.16(d) — Maturity analysis of lease liabilities"]
    },
    {
      riskId: "R04",
      riskDescription: "Impairment of store assets and goodwill — risk that carrying values of store fit-outs, ROU assets, and goodwill allocated to retail CGUs exceed recoverable amounts due to underperforming stores",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Changing consumer behaviour and shift to online reduces store footfall",
        "Individual store profitability volatile and sensitive to local market conditions",
        "Goodwill impairment testing relies on management forecasts with inherent estimation uncertainty",
        "Store fit-out costs have limited alternative use value"
      ],
      controlObjectives: [
        "Ensure impairment indicators are identified on a timely basis",
        "Ensure impairment reviews use reasonable cash flow projections and discount rates",
        "Ensure impairment losses are recognised where recoverable amount is below carrying value"
      ],
      controlProcedures: [
        "Quarterly store profitability reporting with exception reporting for stores below target metrics",
        "Annual impairment review for all CGUs with documented discounted cash flow models",
        "Board approval of key assumptions in impairment models: growth rates, discount rates, long-term margins",
        "Trigger event monitoring through property committee review of lease events, local market changes"
      ],
      substantiveTests: [
        { test: "Review underperforming store analysis and assess whether impairment indicators exist for stores not included in management's impairment review", wpRef: "D7.01", assertion: "Valuation", isa: "ISA 540.13" },
        { test: "For material CGUs, challenge management's cash flow projections by comparing to historical performance, like-for-like trends, and market data", wpRef: "D7.02", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Independently assess discount rates used in value-in-use calculations by comparing to WACC calculations and sector benchmarks", wpRef: "D7.03", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Perform sensitivity analysis on key assumptions to determine the headroom and identify assumptions to which the impairment conclusion is most sensitive", wpRef: "D7.04", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "For stores closed or planned for closure post year-end, verify impairment has been recognised at the reporting date to the extent of the adjusting event", wpRef: "D7.05", assertion: "Valuation", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Tangible fixed assets — store fit-outs", "Right-of-use assets", "Goodwill", "Impairment losses", "Administrative expenses"],
      assertions: ["Valuation", "Accuracy", "Completeness", "Presentation"],
      disclosureRequirements: ["FRS 102 s27.32 — Impairment losses recognised in profit or loss", "FRS 102 s27.33 — Impairment losses reversed", "FRS 102 s27.32(a) — Events and circumstances leading to impairment"]
    },
    {
      riskId: "R05",
      riskDescription: "VAT on mixed supplies — risk that partial exemption calculations are incorrect, leading to over-recovery or under-recovery of input VAT, with potential penalties and interest",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Mixed supplies of standard-rated, zero-rated, reduced-rated, and exempt items",
        "Partial exemption special methods may be complex and require HMRC approval",
        "Capital goods scheme adjustments for major property and IT capital expenditure",
        "Cross-border e-commerce introduces OSS and import VAT complexity"
      ],
      controlObjectives: [
        "Ensure VAT is correctly applied to all supplies",
        "Ensure partial exemption calculations are accurate and compliant",
        "Ensure VAT returns are accurate and filed on time"
      ],
      controlProcedures: [
        "EPOS system programmed with correct VAT rates for all SKUs with regular rate review",
        "Monthly partial exemption calculation prepared by tax team and reviewed by finance director",
        "Annual adjustment calculation prepared and reviewed at year end",
        "Quarterly reconciliation of VAT returns to general ledger"
      ],
      substantiveTests: [
        { test: "Recalculate the partial exemption annual adjustment and compare to management's calculation; investigate material differences", wpRef: "D13.01", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Test input tax allocation between taxable and exempt activities for a sample of material expense items", wpRef: "D13.02", assertion: "Classification", isa: "ISA 250.14" },
        { test: "Verify capital goods scheme adjustments for qualifying assets by recalculating the annual adjustment for each CGS item", wpRef: "D13.03", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Reconcile VAT payable/receivable at year end to the latest VAT return and subsequent payments/refunds", wpRef: "D13.04", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Review HMRC correspondence for assessments, penalties, or enquiries and assess provision requirements", wpRef: "D13.05", assertion: "Completeness", isa: "ISA 250.22" }
      ],
      fsliImpact: ["VAT recoverable/payable", "Irrecoverable VAT (administrative expenses)", "Provisions for VAT assessments", "Cost of sales (VAT on stock)"],
      assertions: ["Accuracy", "Classification", "Completeness", "Valuation"],
      disclosureRequirements: ["FRS 102 s29.27 — Tax expense components", "FRS 102 s21.14 — Provisions for VAT disputes", "FRS 102 s21.15 — Contingent liabilities for HMRC enquiries"]
    }
  ],

  professional_services: [
    {
      riskId: "R01",
      riskDescription: "WIP and unbilled disbursements — risk that work in progress is overstated due to non-recoverable time, excessive lock-up, or failure to write down aged WIP balances to recoverable amounts",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "WIP recovery rates may be significantly below standard charge-out rates",
        "Aged WIP with extended lock-up periods has reduced recoverability",
        "Fee earner time recording may be inflated or inaccurate",
        "Disbursements advanced may not be recoverable from clients",
        "Management reluctance to write off WIP on active matters"
      ],
      controlObjectives: [
        "Ensure WIP is stated at the lower of cost and net realisable value",
        "Ensure recoverability is assessed regularly and provisions are adequate",
        "Ensure time recording is accurate and reviewed"
      ],
      controlProcedures: [
        "Monthly WIP ageing review by practice group leaders with mandatory write-down recommendations for WIP aged > 6 months",
        "Partner sign-off required on all WIP balances at month-end above defined threshold",
        "Time recording compliance monitoring with daily submission targets and exception reporting",
        "Monthly lock-up reporting (WIP days + debtor days) by partner and department",
        "Year-end WIP provision methodology applying write-down percentages by ageing band approved by managing partner"
      ],
      substantiveTests: [
        { test: "Obtain WIP ageing analysis by matter; for aged balances > 6 months, assess recoverability through discussion with responsible partner and review of client correspondence", wpRef: "D3.01", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Test a sample of WIP balances to underlying time records, verifying hours, charge-out rates, and narrative descriptions of work performed", wpRef: "D3.02", assertion: "Existence", isa: "ISA 500.A22" },
        { test: "Back-test prior year WIP realisation by comparing year-end WIP balances to amounts subsequently billed and collected", wpRef: "D3.03", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Test disbursement recoverability by selecting aged disbursements and confirming client agreement to reimburse", wpRef: "D3.04", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Assess WIP provision methodology by comparing provision percentages to actual historical write-off rates by ageing band and department", wpRef: "D3.05", assertion: "Valuation", isa: "ISA 540.23" }
      ],
      fsliImpact: ["Work in progress", "Unbilled disbursements", "WIP provision", "Revenue", "Cost of sales"],
      assertions: ["Valuation", "Existence", "Accuracy", "Cut-off"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition accounting policies", "FRS 102 s23.31 — WIP methodology and carrying amount", "FRS 102 s13.22 — Inventories/WIP disclosures"]
    },
    {
      riskId: "R02",
      riskDescription: "Revenue on fixed-fee engagements — risk that revenue is recognised prematurely or in incorrect amounts where fixed fees do not correlate directly to time expended, requiring estimation of stage of completion",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Stage of completion on fixed-fee work requires estimation of total costs to complete",
        "Scope changes may not be reflected in revenue calculations",
        "Over-runs on fixed-fee work create risk of recognising revenue in excess of recoverable amount",
        "Mixed fixed-fee and hourly-rate arrangements complicate calculation"
      ],
      controlObjectives: [
        "Ensure revenue on fixed-fee work is recognised based on reliable measure of stage of completion",
        "Ensure loss-making engagements are identified and provided for",
        "Ensure scope changes are reflected in revenue calculations"
      ],
      controlProcedures: [
        "Monthly review of fixed-fee engagement profitability by engagement partner comparing time spent to budget",
        "Formal scope change process requiring written client agreement and fee adjustment",
        "Quarterly review of all fixed-fee engagements for potential losses requiring immediate provision",
        "Revenue recognition on fixed-fee work calculated as proportion of budget hours completed at charge rates"
      ],
      substantiveTests: [
        { test: "For material fixed-fee engagements, independently calculate stage of completion using actual hours vs budgeted hours and compare to revenue recognised", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Assess reliability of budget estimates by comparing outturn on completed fixed-fee engagements to original budgets", wpRef: "D1.02", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "For engagements where time costs exceed or approach the fixed fee, assess whether loss provision is required per FRS 102 s23.27", wpRef: "D1.03", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Test cut-off by examining engagements completed close to year end and verifying revenue is recognised in the period the work was performed", wpRef: "D1.04", assertion: "Cut-off", isa: "ISA 240.26" },
        { test: "Verify scope changes for a sample of modified engagements by inspecting client correspondence and amended engagement letters", wpRef: "D1.05", assertion: "Occurrence", isa: "ISA 500.A22" }
      ],
      fsliImpact: ["Revenue", "Accrued income", "Deferred revenue", "Provisions for onerous contracts", "WIP"],
      assertions: ["Accuracy", "Cut-off", "Valuation", "Occurrence"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition methods", "FRS 102 s23.31 — Aggregate amount of costs incurred and recognised profits", "FRS 102 s21.14 — Onerous contract provisions"]
    },
    {
      riskId: "R03",
      riskDescription: "Partner profit shares and capital — risk that partner remuneration, drawings, and capital contributions are not correctly classified or that partnership/LLP accounting does not comply with FRS 102",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Distinction between equity and debt classification of member shares affects presentation",
        "Complex profit-sharing arrangements with multiple tiers and discretionary elements",
        "Partners/members may have significant loan account balances requiring disclosure",
        "Automatic retirement provisions may create obligations"
      ],
      controlObjectives: [
        "Ensure partner/member interests are correctly classified between equity and liabilities",
        "Ensure profit allocations comply with partnership agreement/members' agreement",
        "Ensure partner loan accounts are properly disclosed"
      ],
      controlProcedures: [
        "Annual review of partnership/LLP agreement by finance director to verify profit allocation mechanics",
        "Monthly profit allocation calculation reviewed by managing partner",
        "Partner capital and current account reconciliations prepared monthly",
        "Annual assessment of classification of members' interests per FRS 102 s22 and SORP"
      ],
      substantiveTests: [
        { test: "Review partnership/LLP agreement and verify profit allocation calculations for the year comply with agreement terms", wpRef: "D10.01", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Assess classification of partner/member interests: verify whether amounts are equity or debt per FRS 102 s22.5 criteria", wpRef: "D10.02", assertion: "Classification", isa: "ISA 330.25" },
        { test: "Reconcile partner capital accounts: opening balance plus profit share plus capital introduced less drawings less tax payments equals closing balance", wpRef: "D10.03", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "For any automatic partner retirement obligations, assess whether a liability should be recognised for the present value of expected payments", wpRef: "D10.04", assertion: "Completeness", isa: "ISA 540.18" },
        { test: "Test related party disclosures for partner transactions, loans, and interests in client matters", wpRef: "D10.05", assertion: "Completeness", isa: "ISA 550.25" }
      ],
      fsliImpact: ["Members' remuneration charged as expense", "Members' equity interests", "Members' other interests (liability)", "Profit available for discretionary division"],
      assertions: ["Accuracy", "Classification", "Completeness", "Presentation"],
      disclosureRequirements: ["FRS 102 s22.5 — Classification of members' interests", "FRS 102 s33.9 — Related party transactions with partners/members", "SORP for LLPs — Members' interests and profit allocation"]
    },
    {
      riskId: "R04",
      riskDescription: "Professional indemnity provisions — risk that provisions for PI claims are incomplete or inadequately measured, particularly where claims are in early stages or involve complex litigation",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Long-tail PI claims may take years to resolve with uncertain outcomes",
        "Claim notifications may not capture all potential exposures",
        "Insurance coverage limits, excesses, and exclusions complicate measurement",
        "IBNR (incurred but not reported) claims create completeness risk"
      ],
      controlObjectives: [
        "Ensure all known and probable PI claims are identified and provided for",
        "Ensure insurance recoveries are separately assessed for recoverability",
        "Ensure contingent liabilities are appropriately disclosed"
      ],
      controlProcedures: [
        "Centralised claims register maintained by risk management with mandatory partner notification",
        "Quarterly claims review meeting with external legal advisers assessing quantum and probability",
        "Insurance broker annual renewal review confirming adequate coverage and excess levels",
        "Notifications to insurers tracked with confirmation of coverage for each claim"
      ],
      substantiveTests: [
        { test: "Obtain claims register and for all open claims, assess provision adequacy against independent legal advice and insurance coverage", wpRef: "D12.01", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Send solicitor confirmation letters for material claims to obtain independent assessment of outcome probability and quantum range", wpRef: "D12.02", assertion: "Completeness", isa: "ISA 501.9" },
        { test: "Review complaints register and quality incidents for matters that could give rise to claims but are not yet notified", wpRef: "D12.03", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Verify insurance coverage by confirming policy limits, excesses, and applicable exclusions with insurance brokers", wpRef: "D12.04", assertion: "Valuation", isa: "ISA 505.7" },
        { test: "Review post year-end correspondence for evidence of claims notified or settled after the reporting date requiring adjustment or disclosure", wpRef: "D12.05", assertion: "Completeness", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Provisions for PI claims", "Insurance receivable", "Contingent liabilities", "Administrative expenses"],
      assertions: ["Completeness", "Valuation", "Occurrence", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provision reconciliation", "FRS 102 s21.15 — Contingent liabilities", "FRS 102 s21.17 — Prejudicial disclosure exemption"]
    },
    {
      riskId: "R05",
      riskDescription: "Client account compliance — risk that client money held in solicitor/accountant client accounts is not properly segregated, reconciled, or reported, breaching regulatory requirements",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "SRA Accounts Rules (solicitors) and ICAEW regulations impose strict segregation requirements",
        "High volume of daily client money movements across multiple matter types",
        "Completion monies in conveyancing create high-value transient balances",
        "Regulatory breach can result in intervention, fine, or firm closure"
      ],
      controlObjectives: [
        "Ensure client money is properly segregated from office money",
        "Ensure client account reconciliations are performed and reviewed regularly",
        "Ensure interest is accounted for in accordance with regulatory requirements"
      ],
      controlProcedures: [
        "Daily three-way client account reconciliation: cashbook to client ledger to bank statement",
        "Independent review of reconciliation by COFA/compliance officer with documented sign-off",
        "Automated alerts for client account shortages requiring immediate investigation and resolution",
        "Monthly compliance report to managing partner on client account status"
      ],
      substantiveTests: [
        { test: "Confirm client account bank balances directly with banks at year end and reconcile to client ledger balances", wpRef: "D6.01", assertion: "Existence", isa: "ISA 505.7" },
        { test: "Test three-way reconciliation at year end: verify cashbook agrees to bank, cashbook agrees to total of individual client ledger balances", wpRef: "D6.02", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Review reconciliations for a sample of months during the year for evidence of shortages, unreconciled items, or delayed clearance", wpRef: "D6.03", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Test a sample of client-to-office transfers to verify they are supported by valid bills of costs and comply with regulatory rules", wpRef: "D6.04", assertion: "Occurrence", isa: "ISA 250.14" },
        { test: "Review residual client balances (aged, unclaimed, dormant) and assess compliance with regulatory requirements for handling unclaimed balances", wpRef: "D6.05", assertion: "Completeness", isa: "ISA 330.21" }
      ],
      fsliImpact: ["Client money (held on trust — off balance sheet note)", "Client account bank balances", "Interest earned on client funds"],
      assertions: ["Existence", "Accuracy", "Rights", "Completeness"],
      disclosureRequirements: ["SRA Accounts Rules — Accountant's report requirements", "FRS 102 s11.42 — Financial instrument disclosures", "FRS 102 s33.9 — Related party disclosures for client money held"]
    }
  ],

  property: [
    {
      riskId: "R01",
      riskDescription: "Investment property valuation — risk that fair values determined by management's expert (valuer) are misstated due to inappropriate yield assumptions, ERV estimates, or failure to reflect market conditions",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Valuations are inherently subjective with a range of reasonable outcomes",
        "Small changes in yield assumptions produce large changes in fair value",
        "Market evidence may be limited for specialist or regional properties",
        "Management influence over valuer instructions or assumptions creates bias risk",
        "Mixed-use properties require allocation of value across different uses"
      ],
      controlObjectives: [
        "Ensure valuations are performed by a competent and independent valuer",
        "Ensure valuation inputs reflect current market conditions",
        "Ensure all investment properties are valued at each reporting date"
      ],
      controlProcedures: [
        "Annual independent external valuation by RICS Registered Valuer acting under Red Book standards",
        "Valuation instructions reviewed and approved by board to ensure no undue restrictions on valuer scope",
        "Management challenge of draft valuations with documented evidence for any disagreements",
        "Quarterly review of property portfolio fair values against market indices and comparable transactions",
        "Valuer rotation or tender process at minimum every three years to maintain independence"
      ],
      substantiveTests: [
        { test: "Assess competence, capability, and objectivity of management's valuation expert per ISA 620; verify RICS registration and PI insurance", wpRef: "D7.01", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For material properties, challenge yield assumptions by comparing to market evidence from comparable transactions and published market data", wpRef: "D7.02", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Verify ERV estimates by comparing to actual rents achieved, lease terms on recent lettings, and independent market data", wpRef: "D7.03", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Assess whether valuer instructions contained any restrictions and verify all investment properties in the portfolio are included in the valuation", wpRef: "D7.04", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Test property ownership by verifying Land Registry titles for a sample of properties and checking for charges or restrictions", wpRef: "D7.05", assertion: "Rights", isa: "ISA 500.A22" }
      ],
      fsliImpact: ["Investment properties", "Fair value gains/losses", "Revaluation reserve (if policy choice under FRS 102)", "Deferred tax on revaluation"],
      assertions: ["Valuation", "Existence", "Rights", "Completeness"],
      disclosureRequirements: ["FRS 102 s16.10 — Methods and significant assumptions for fair value", "FRS 102 s16.10(b) — Extent to which based on independent valuer", "FRS 102 s16.10(d) — Contractual obligations to purchase, construct, or develop"]
    },
    {
      riskId: "R02",
      riskDescription: "Development profit recognition — risk that profit on development projects is recognised prematurely or in incorrect amounts, particularly on off-plan sales and phased developments",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Profit recognition requires estimation of total development costs including contingencies",
        "Off-plan sales may not represent unconditional exchange until completion",
        "Phased developments require allocation of costs between completed and uncompleted phases",
        "Affordable housing obligations (s106) reduce margins and create measurement complexity"
      ],
      controlObjectives: [
        "Ensure revenue is recognised only on legal completion (or percentage of completion if applicable)",
        "Ensure cost-to-complete estimates are reliable and regularly updated",
        "Ensure s106 obligations are reflected in profit calculations"
      ],
      controlProcedures: [
        "Monthly development appraisal update for each active scheme reviewed by development director",
        "Revenue recognition trigger documented for each scheme (typically legal completion)",
        "Quantity surveyor certification of costs to complete for material developments",
        "Board review of development profit forecasts including sensitivity analysis on key assumptions"
      ],
      substantiveTests: [
        { test: "For each material development, independently calculate expected profit using certified costs incurred, costs to complete, and contracted/expected selling prices", wpRef: "D1.01", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Verify revenue recognition on completed sales by agreeing to completion statements, Land Registry transfers, and legal completion certificates", wpRef: "D1.02", assertion: "Occurrence", isa: "ISA 330.20" },
        { test: "Test costs to complete by vouching major uncommitted cost items to tender prices, quantity surveyor estimates, and contingency assessments", wpRef: "D1.03", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "For phased developments, assess cost allocation methodology between completed and uncompleted phases for reasonableness", wpRef: "D1.04", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "Verify s106/CIL obligations are reflected in development appraisals by reviewing planning agreements and certificates of compliance", wpRef: "D1.05", assertion: "Completeness", isa: "ISA 330.21" }
      ],
      fsliImpact: ["Revenue — development sales", "Development WIP/land bank", "Cost of sales", "Provisions for s106/CIL", "Accrued income"],
      assertions: ["Occurrence", "Accuracy", "Valuation", "Cut-off"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition policies for development sales", "FRS 102 s23.31 — Amount of revenue recognised", "FRS 102 s13.22 — Development property disclosures"]
    },
    {
      riskId: "R03",
      riskDescription: "Impairment of development land and WIP — risk that development properties carried at cost are impaired due to planning refusals, market downturns, or increased build costs, but write-downs are not recognised",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Land values are sensitive to planning permission status",
        "Build cost inflation may erode development margins",
        "Market downturns reduce achievable selling prices or rental values",
        "Management reluctance to impair land bank holdings"
      ],
      controlObjectives: [
        "Ensure development properties are assessed for impairment indicators at each reporting date",
        "Ensure impairment write-downs are recognised when NRV falls below cost",
        "Ensure the basis of NRV assessment is appropriate and documented"
      ],
      controlProcedures: [
        "Quarterly development appraisal update including NRV assessment for each scheme",
        "Planning status register maintained with immediate escalation of refusals or adverse conditions",
        "Annual review of land bank for sites with no active development programme",
        "Market monitoring of comparable land and house prices in relevant locations"
      ],
      substantiveTests: [
        { test: "For each development property, compare carrying value to NRV (estimated selling price less costs to complete and sell); challenge management's selling price assumptions", wpRef: "D7.06", assertion: "Valuation", isa: "ISA 540.18" },
        { test: "Review planning status for all land holdings; for sites without planning permission, assess whether NRV supports carrying value at hope value", wpRef: "D7.07", assertion: "Valuation", isa: "ISA 330.20" },
        { test: "Test build cost estimates against recent tender prices and published indices (BCIS) to verify cost-to-complete assumptions", wpRef: "D7.08", assertion: "Accuracy", isa: "ISA 540.23" },
        { test: "For sites held for > 2 years without active development, challenge management's intended use and timing and assess whether impairment provision is required", wpRef: "D7.09", assertion: "Valuation", isa: "ISA 540.23" },
        { test: "Compare post year-end sales prices achieved to year-end NRV assumptions for completed units", wpRef: "D7.10", assertion: "Valuation", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Development properties", "Land bank", "Impairment losses", "Cost of sales"],
      assertions: ["Valuation", "Accuracy", "Completeness"],
      disclosureRequirements: ["FRS 102 s27.32 — Impairment losses recognised in profit or loss by class of asset", "FRS 102 s13.22(d) — Write-down of inventories to NRV", "FRS 102 s27.33 — Reversal of impairment losses"]
    },
    {
      riskId: "R04",
      riskDescription: "Service charge accounting — risk that service charge income and expenditure are not properly ring-fenced, that funds are not applied in accordance with lease terms, and that year-end balances are misstated",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Service charge funds are held on trust for tenants and must be properly accounted for",
        "Complex allocation bases across multi-tenanted properties",
        "Timing differences between charges levied and actual expenditure",
        "Void property service charge costs may not be recoverable"
      ],
      controlObjectives: [
        "Ensure service charge funds are properly ring-fenced and reconciled",
        "Ensure service charge budgets are reasonable and properly allocated",
        "Ensure sinking fund provisions are appropriate"
      ],
      controlProcedures: [
        "Separate service charge bank accounts for each property or group of properties",
        "Annual service charge budget prepared by property manager and approved by landlord",
        "Service charge reconciliation prepared annually with tenant right of challenge",
        "Sinking fund contributions assessed by qualified building surveyor"
      ],
      substantiveTests: [
        { test: "For material managed properties, reconcile service charge income to budgets and lease apportionments; verify tenant allocations to lease terms", wpRef: "D1.06", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Test service charge expenditure for a sample of properties by vouching to invoices and verifying costs are properly recoverable under lease terms", wpRef: "D1.07", assertion: "Occurrence", isa: "ISA 500.A22" },
        { test: "Reconcile service charge fund bank balances to service charge creditor/debtor positions in the management company accounts", wpRef: "D1.08", assertion: "Existence", isa: "ISA 505.7" },
        { test: "Review void property service charge exposure and verify that irrecoverable costs are charged to the landlord entity not the service charge fund", wpRef: "D1.09", assertion: "Classification", isa: "ISA 330.25" },
        { test: "For sinking funds, assess adequacy of contributions by reviewing building surveyor reports on major works requirements", wpRef: "D1.10", assertion: "Valuation", isa: "ISA 540.18" }
      ],
      fsliImpact: ["Service charge income", "Service charge expenditure", "Service charge debtors", "Service charge funds held (creditor)"],
      assertions: ["Accuracy", "Occurrence", "Existence", "Classification"],
      disclosureRequirements: ["FRS 102 s23.30 — Revenue recognition policy for service charges", "FRS 102 s4.12 — Creditors including service charge funds held", "RICS Service Charge Code — Disclosure requirements"]
    },
    {
      riskId: "R05",
      riskDescription: "S106/CIL obligations and other planning conditions — risk that obligations arising from planning permissions are not fully identified, measured, or provided for, understating liabilities",
      level: "ELEVATED",
      inherentRiskFactors: [
        "S106 agreements are complex legal documents with multiple trigger points",
        "CIL calculations may be disputed or based on incorrect measurements",
        "Phased development trigger points create timing complexity",
        "Obligations may extend beyond financial contributions to include affordable housing or infrastructure delivery"
      ],
      controlObjectives: [
        "Ensure all s106/CIL obligations are identified from planning agreements",
        "Ensure trigger points are monitored and obligations recognised when due",
        "Ensure provisions accurately reflect the expected cost of meeting obligations"
      ],
      controlProcedures: [
        "S106/CIL register maintained by planning team with detailed trigger points and deadlines",
        "Monthly review of development progress against s106 trigger milestones",
        "Planning solicitor review of complex s106 agreements to confirm obligations",
        "CIL calculations verified at commencement notice stage"
      ],
      substantiveTests: [
        { test: "Obtain and review s106 agreements for all active developments; identify all financial and non-financial obligations and verify completeness of management's register", wpRef: "D12.01", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "For each triggered obligation, verify the provision amount by reference to the s106 agreement terms and assess whether payment has been made or is due", wpRef: "D12.02", assertion: "Accuracy", isa: "ISA 540.18" },
        { test: "Recalculate CIL liabilities using published CIL charging schedules and liable net area calculations", wpRef: "D12.03", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Assess untriggered obligations and determine whether a provision or contingent liability disclosure is required based on development progress", wpRef: "D12.04", assertion: "Completeness", isa: "ISA 540.13" },
        { test: "Review post year-end trigger events and planning decisions for adjusting or non-adjusting events", wpRef: "D12.05", assertion: "Completeness", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Provisions for s106/CIL", "Development WIP (capitalised obligations)", "Cost of sales", "Contingent liabilities"],
      assertions: ["Completeness", "Accuracy", "Valuation", "Presentation"],
      disclosureRequirements: ["FRS 102 s21.14 — Provision reconciliation", "FRS 102 s21.15 — Contingent liabilities for untriggered obligations", "FRS 102 s21.14(b) — Additional provisions made and amounts used"]
    }
  ],

  charities: [
    {
      riskId: "R01",
      riskDescription: "Income recognition — risk that donations, legacies, and grant income are recognised in incorrect periods or amounts, particularly where entitlement, probability, and measurement criteria are not properly assessed",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "Legacy income recognition depends on probate, executor notification, and estate measurement — all uncertain",
        "Grant income conditions may be complex with performance-related and restrictive conditions",
        "Donation income may be received in advance of the accounting period it relates to",
        "Gift Aid claims require accurate donor declarations and timely HMRC submission",
        "Charities SORP recognition criteria differ from general FRS 102 requirements"
      ],
      controlObjectives: [
        "Ensure income is recognised when entitlement, probability, and measurement criteria are all met",
        "Ensure legacy income is recognised at the correct amount and in the correct period",
        "Ensure grant income is matched to conditions and classified between restricted and unrestricted"
      ],
      controlProcedures: [
        "Legacy tracking system from notification through probate to receipt, with recognition criteria assessed at each stage",
        "Grant income recognition checklist completed for each material grant assessing performance vs restrictive conditions",
        "Monthly Gift Aid reconciliation with HMRC claims submission and donation records",
        "Finance team review of income recognition decisions with documented rationale for judgements",
        "Year-end legacy accrual exercise reviewing all notified legacies for recognition criteria"
      ],
      substantiveTests: [
        { test: "For material legacies, review probate documentation, executor correspondence, and estate accounts to verify entitlement, probability (> 50%), and measurement reliability", wpRef: "D1.01", assertion: "Occurrence", isa: "ISA 330.20" },
        { test: "Test grant income recognition by reviewing grant agreements and assessing whether performance conditions have been met or whether income should be deferred", wpRef: "D1.02", assertion: "Cut-off", isa: "ISA 540.18" },
        { test: "Recalculate Gift Aid receivable at year end by agreeing to donation records, verifying valid declarations are held, and checking HMRC claim submission", wpRef: "D1.03", assertion: "Existence", isa: "ISA 330.6" },
        { test: "Test completeness of legacy income by reviewing solicitor notifications, probate registry searches, and post year-end receipts for unrecorded legacies", wpRef: "D1.04", assertion: "Completeness", isa: "ISA 330.21" },
        { test: "Perform analytical review of donation income by campaign, channel, and month comparing to prior year and fundraising activity records", wpRef: "D1.05", assertion: "Occurrence", isa: "ISA 520.5" }
      ],
      fsliImpact: ["Donation income", "Legacy income", "Grant income", "Gift Aid receivable", "Deferred income", "Accrued income"],
      assertions: ["Occurrence", "Cut-off", "Completeness", "Accuracy"],
      disclosureRequirements: ["Charities SORP FRS 102 Module 5 — Income recognition policies", "Charities SORP Module 5.18 — Legacy income accounting policy", "FRS 102 s23.30 — Revenue recognition methods and policies"]
    },
    {
      riskId: "R02",
      riskDescription: "Fund accounting — risk that restricted and unrestricted funds are not correctly classified, that restricted fund conditions are breached, or that transfers between funds lack proper authorisation",
      level: "SIGNIFICANT",
      inherentRiskFactors: [
        "High volume of restricted funds with differing conditions creates tracking complexity",
        "Expenditure may be misallocated between restricted and unrestricted funds",
        "Inter-fund transfers may mask unauthorised use of restricted funds",
        "Endowment fund terms may restrict use of capital as well as income",
        "Donors' intentions may be ambiguous requiring trustee interpretation"
      ],
      controlObjectives: [
        "Ensure funds are correctly classified as restricted, unrestricted, or endowment",
        "Ensure expenditure is allocated to the correct fund",
        "Ensure restricted fund conditions are complied with",
        "Ensure transfers between funds are properly authorised and disclosed"
      ],
      controlProcedures: [
        "Fund register maintained with donor conditions and restrictions documented for each restricted fund",
        "Cost allocation methodology documented and approved by trustees for shared costs across funds",
        "Monthly restricted fund balance review by finance manager with exception reporting for overspent funds",
        "All inter-fund transfers approved by board of trustees with documented rationale",
        "Annual restricted fund compliance review confirming expenditure accords with donor conditions"
      ],
      substantiveTests: [
        { test: "For material restricted funds, review original donor documentation/grant agreements and verify that expenditure charged complies with stated conditions", wpRef: "D10.01", assertion: "Classification", isa: "ISA 330.6" },
        { test: "Test a sample of expenditure items charged to restricted funds by verifying the expenditure falls within the terms of the restriction", wpRef: "D10.02", assertion: "Classification", isa: "ISA 500.A22" },
        { test: "Review inter-fund transfers for the year and verify each transfer is properly authorised by trustees with documented justification", wpRef: "D10.03", assertion: "Occurrence", isa: "ISA 330.20" },
        { test: "Verify fund balances at year end by reconciling opening balance plus income less expenditure plus/minus transfers equals closing balance for each material fund", wpRef: "D10.04", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Assess whether any restricted funds are in deficit (expenditure exceeds income) and verify that the charity has legal right and resources to fund the deficit", wpRef: "D10.05", assertion: "Valuation", isa: "ISA 570.10" }
      ],
      fsliImpact: ["Restricted funds", "Unrestricted funds", "Endowment funds", "Fund transfers", "SOFA (Statement of Financial Activities)"],
      assertions: ["Classification", "Accuracy", "Occurrence", "Valuation"],
      disclosureRequirements: ["Charities SORP FRS 102 Module 2 — Fund accounting", "Charities SORP Module 2.27 — Analysis of fund movements", "Charities SORP Module 2.29 — Material funds individually disclosed"]
    },
    {
      riskId: "R03",
      riskDescription: "Trustee related party transactions — risk that trustee-connected transactions are not identified, not conducted at arm's length, or not properly disclosed, with potential Charities Act 2011 compliance implications",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Trustees may have multiple interests that create undisclosed conflicts",
        "Trustee benefit payments require Charity Commission authorisation unless in governing document",
        "Connected persons of trustees extend the disclosure net widely",
        "Small charities may have less formal governance and conflict management"
      ],
      controlObjectives: [
        "Ensure all trustee interests and connected party relationships are identified",
        "Ensure transactions with trustees/connected parties comply with Charities Act 2011",
        "Ensure proper disclosure of trustee remuneration, expenses, and related party transactions"
      ],
      controlProcedures: [
        "Annual trustee declaration of interests with updates required for changes during the year",
        "Register of interests maintained by company secretary/charity manager and available at board meetings",
        "Conflict of interest policy requiring affected trustees to withdraw from relevant discussions and decisions",
        "All trustee benefit payments reviewed by independent trustees and checked against governing document authority"
      ],
      substantiveTests: [
        { test: "Obtain trustee declarations of interest and connected party details; search purchase ledger, payroll, and bank records for transactions with declared and undeclared connections", wpRef: "D15.01", assertion: "Completeness", isa: "ISA 550.16" },
        { test: "For trustee remuneration or benefit payments, verify authorisation exists in governing document or Charity Commission order per Charities Act 2011 s185", wpRef: "D15.02", assertion: "Occurrence", isa: "ISA 250.14" },
        { test: "Test trustee expense claims for a sample ensuring claims are for legitimate charity business, properly receipted, and approved by independent trustee", wpRef: "D15.03", assertion: "Occurrence", isa: "ISA 330.6" },
        { test: "Verify disclosure completeness: number of trustees, remuneration paid, expenses reimbursed (aggregate and number of trustees), and all material transactions", wpRef: "D15.04", assertion: "Presentation", isa: "ISA 330.25" },
        { test: "Inspect board minutes for evidence of conflict management process being followed for any trustee-connected decisions during the year", wpRef: "D15.05", assertion: "Completeness", isa: "ISA 550.25" }
      ],
      fsliImpact: ["Trustee remuneration", "Trustee expenses", "Related party disclosures", "Governance costs"],
      assertions: ["Completeness", "Occurrence", "Presentation", "Accuracy"],
      disclosureRequirements: ["Charities SORP FRS 102 Module 9 — Trustee remuneration and related party disclosures", "Charities Act 2011 s185 — Trustee benefit disclosures", "FRS 102 s33.9 — Related party transaction disclosures"]
    },
    {
      riskId: "R04",
      riskDescription: "Going concern — funding dependence and reserves adequacy — risk that the charity's reliance on a small number of funders or inadequate reserves creates material uncertainty about ability to continue as a going concern",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Charities often depend on a small number of major funders whose withdrawal would be critical",
        "Grant funding cycles create periods of funding uncertainty",
        "Free reserves may be insufficient to cover committed expenditure during funding gaps",
        "Restricted funds cannot be used for general purposes without express consent"
      ],
      controlObjectives: [
        "Ensure trustees have adequately assessed going concern for at least 12 months from signing",
        "Ensure reserves policy is appropriate and reserves level is adequate",
        "Ensure funding pipeline and commitments are properly assessed"
      ],
      controlProcedures: [
        "Annual reserves policy review by trustees with target range and rationale documented",
        "Rolling 12-month cash flow forecast updated monthly and reviewed by finance committee",
        "Funder concentration analysis maintained with contingency planning for loss of major funders",
        "Committed expenditure register maintained showing contractual and constructive obligations"
      ],
      substantiveTests: [
        { test: "Evaluate trustees' going concern assessment: review cash flow forecasts for 12 months from date of signing, challenge key assumptions, and perform sensitivity analysis", wpRef: "B1.01", assertion: "Valuation", isa: "ISA 570.12" },
        { test: "Assess funder concentration: identify any single funder providing > 25% of income and evaluate risk and impact of funding withdrawal", wpRef: "B1.02", assertion: "Completeness", isa: "ISA 570.16(b)" },
        { test: "Compare free reserves at year end to reserves policy target and committed expenditure to assess adequacy of reserves cover", wpRef: "B1.03", assertion: "Valuation", isa: "ISA 570.13" },
        { test: "Verify status of material grant renewals due in the going concern assessment period through correspondence with funders", wpRef: "B1.04", assertion: "Existence", isa: "ISA 570.16(c)" },
        { test: "Review post year-end income and expenditure patterns and assess whether consistent with going concern assumptions", wpRef: "B1.05", assertion: "Occurrence", isa: "ISA 560.10" }
      ],
      fsliImpact: ["Going concern disclosures", "Reserves policy note", "Free reserves calculation", "Commitments disclosure"],
      assertions: ["Valuation", "Completeness", "Existence", "Presentation"],
      disclosureRequirements: ["Charities SORP FRS 102 Module 3 — Trustees' annual report including reserves policy", "FRS 102 s3.9 — Going concern disclosure", "FRS 102 s32.7 — Events after the end of the reporting period"]
    },
    {
      riskId: "R05",
      riskDescription: "Expenditure allocation methodology — risk that costs are not accurately allocated between charitable activities, fundraising costs, and governance costs, misrepresenting the charity's efficiency and use of funds",
      level: "ELEVATED",
      inherentRiskFactors: [
        "Allocation of shared costs (staff, premises, overheads) requires judgement on appropriate basis",
        "Management incentive to understate fundraising and governance costs to improve charitable spend ratio",
        "SORP requires specific cost categories that may not align with management accounting",
        "Support cost allocation methodology may not be reviewed or updated regularly"
      ],
      controlObjectives: [
        "Ensure expenditure is correctly classified between charitable activities, fundraising, and governance",
        "Ensure support cost allocation methodology is reasonable, documented, and consistently applied",
        "Ensure cost categories comply with Charities SORP requirements"
      ],
      controlProcedures: [
        "Documented cost allocation methodology approved by trustees annually specifying allocation bases for each support cost category",
        "Direct costs coded to specific activities at point of entry in accounting system",
        "Monthly management accounts showing expenditure by activity with comparison to budget",
        "Year-end support cost allocation calculation prepared by finance team and reviewed by finance trustee"
      ],
      substantiveTests: [
        { test: "Review and challenge the support cost allocation methodology: assess whether allocation bases (headcount, floor space, time allocation) are reasonable for each cost type", wpRef: "D5.01", assertion: "Classification", isa: "ISA 330.6" },
        { test: "Recalculate the support cost allocation using management's stated methodology and verify arithmetical accuracy", wpRef: "D5.02", assertion: "Accuracy", isa: "ISA 330.6" },
        { test: "Test a sample of directly allocated costs to verify coding to the correct activity in the SOFA", wpRef: "D5.03", assertion: "Classification", isa: "ISA 500.A22" },
        { test: "Compare charitable spend ratio, fundraising ratio, and governance ratio to prior year and sector benchmarks; investigate significant movements", wpRef: "D5.04", assertion: "Accuracy", isa: "ISA 520.5" },
        { test: "Verify that expenditure categories in the SOFA and notes comply with Charities SORP disclosure requirements including activity-level analysis", wpRef: "D5.05", assertion: "Presentation", isa: "ISA 330.25" }
      ],
      fsliImpact: ["Charitable activity expenditure", "Fundraising costs", "Governance costs", "Support costs allocation", "Total expenditure"],
      assertions: ["Classification", "Accuracy", "Presentation", "Completeness"],
      disclosureRequirements: ["Charities SORP FRS 102 Module 6 — Expenditure analysis by activity", "Charities SORP Module 6.7 — Support costs and basis of allocation", "Charities SORP Module 6.9 — Governance costs disclosure"]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════
// ENHANCED PROCEDURES
// ═══════════════════════════════════════════════════════════════════════

// ─── INVENTORY COUNT PROCEDURES (ISA 501) ───────────────────────────

export const INVENTORY_COUNT_PROCEDURES = {
  standard: 'ISA (UK) 501',
  title: 'Audit Evidence — Specific Considerations for Inventory',
  source: 'frc.org.uk',
  lastVerified: '2026-03-12',
  sections: [
    {
      phase: 'Count Planning',
      procedures: [
        'Obtain management\'s count instructions and review for adequacy',
        'Identify inventory locations and assess need for attendance at each (risk-based)',
        'Determine timing of count attendance — year end or alternative date with rollback/forward procedures',
        'Consider need for specialist involvement (e.g., gemologist, commodities surveyor)',
        'Assess management\'s procedures for controlling count accuracy and completeness',
        'Plan test counts — mix of floor-to-sheet and sheet-to-floor',
        'Identify slow-moving, obsolete, or damaged inventory for NRV assessment',
        'Plan cut-off procedures: last GRN/dispatch note numbers',
      ],
    },
    {
      phase: 'Count Attendance',
      procedures: [
        'Observe count procedures being followed by count teams',
        'Perform independent test counts — record on working paper with location, description, quantity',
        'Verify quantities for high-value items and statistically selected sample',
        'Note last goods received and dispatched for cut-off testing',
        'Identify and note condition issues — damaged, obsolete, slow-moving items',
        'Obtain and photograph count sheets (or confirm electronic count records)',
        'Verify count team follows procedures for re-counts and discrepancy resolution',
        'Test inter-location movements during count period',
      ],
    },
    {
      phase: 'NRV Testing',
      procedures: [
        'Obtain post-year-end sales data for inventory items/categories',
        'Compare selling prices to cost for aged/slow-moving items',
        'Consider costs to complete and costs to sell',
        'Review inventory ageing report for items held >12 months',
        'Assess management\'s NRV provision methodology and adequacy',
        'Test a sample of write-downs to supporting evidence',
        'Consider industry-specific factors affecting realisable value',
      ],
    },
    {
      phase: 'Cut-off Testing',
      procedures: [
        'Test last 5-10 GRNs before and first 5-10 GRNs after year end — verify correct period',
        'Test last 5-10 dispatch notes — verify revenue and inventory movement in correct period',
        'Review goods in transit at year end — verify ownership based on delivery terms',
        'Test purchase invoices around year end for correct accrual/prepayment treatment',
        'Verify intercompany inventory movements at year end are consistently recorded',
      ],
    },
  ],
};

// ─── CONFIRMATION PROCEDURES (ISA 505) ──────────────────────────────

export const CONFIRMATION_PROCEDURES = {
  standard: 'ISA (UK) 505',
  title: 'External Confirmations',
  source: 'frc.org.uk',
  lastVerified: '2026-03-12',
  types: [
    {
      type: 'Bank Confirmations',
      isa: 'ISA 505 / ISA 330',
      procedures: [
        'Request bank confirmation letters for all bank accounts — open and closed during the year',
        'Use standardised bank confirmation letter (CCAB format for UK)',
        'Confirm balances, facilities, security, contingent liabilities, derivatives',
        'Auditor must maintain control over the confirmation process (ISA 505.7)',
        'Send directly to bank — not via client (ISA 505.7)',
        'Follow up non-replies with second request and alternative procedures',
        'Alternative procedures: test bank reconciliation, review post-year-end bank statements',
      ],
    },
    {
      type: 'Receivables Confirmations',
      isa: 'ISA 505.6',
      procedures: [
        'Positive confirmation: request debtor to confirm balance (or state differences)',
        'Negative confirmation: request reply only if debtor disagrees',
        'Select sample based on materiality, risk, and ageing (large/old balances)',
        'Maintain auditor control — send directly, not via client',
        'Follow up non-replies with second request',
        'Alternative procedures for non-replies: test subsequent receipts, review invoices and dispatch records',
        'Consider electronic confirmation platforms for efficiency',
        'Document results: confirmed, exceptions, non-replies, alternatives performed',
      ],
    },
    {
      type: 'Legal Confirmations',
      isa: 'ISA 501 / ISA 505',
      procedures: [
        'Request confirmation from entity\'s solicitors regarding litigation, claims and assessments',
        'Cover: pending/threatened litigation, assessment of likelihood, estimate of financial impact',
        'Send request prepared by management but controlled by auditor',
        'Inquire about unrecorded contingent liabilities',
        'Consider need for separate request to specialist counsel',
        'Follow up non-replies — consider scope limitation if no response',
      ],
    },
    {
      type: 'Payables Confirmations',
      isa: 'ISA 505',
      procedures: [
        'Supplier statement reconciliations as alternative to positive confirmation',
        'Select sample focusing on: major suppliers, unusual balances, nil balances (completeness)',
        'Confirm terms and conditions, accrued liabilities, unrecorded liabilities',
        'Alternative: test subsequent payments and purchase invoices',
      ],
    },
  ],
};

// ─── CUT-OFF TESTING PROCEDURES ────────────────────────────────────

export const CUTOFF_TESTING_PROCEDURES = {
  title: 'Cut-off Testing Procedures',
  isa: 'ISA 330 / ISA 500',
  source: 'frc.org.uk',
  lastVerified: '2026-03-12',
  areas: [
    {
      area: 'Revenue Cut-off',
      procedures: [
        'Select sample of revenue transactions from final 5 days before and first 5 days after year end',
        'Verify delivery/performance occurred in correct period by examining: dispatch notes, proof of delivery, service completion records',
        'For long-term contracts: verify percentage of completion calculation and stage payments',
        'Test credit notes issued post year end — assess whether they relate to pre-year-end transactions',
        'Review large or unusual sales recorded in final days of the year',
        'For FRS 102 (revised) / IFRS 15: verify performance obligations satisfied in correct period',
      ],
      assertions: ['Cut-off', 'Occurrence', 'Accuracy'],
    },
    {
      area: 'Purchase Cut-off',
      procedures: [
        'Select sample of purchase invoices from around year end',
        'Match to GRNs — verify goods/services received in correct period',
        'Review accruals listing — test for completeness by reviewing post-year-end invoices',
        'Identify purchases received but not invoiced (accrued liabilities)',
        'Test purchase commitments and contracted obligations',
        'Review unmatched GRNs at year end for accrual',
      ],
      assertions: ['Cut-off', 'Completeness', 'Accuracy'],
    },
    {
      area: 'Payroll Cut-off',
      procedures: [
        'Verify final payroll run relates to correct period',
        'Test holiday pay accrual calculation',
        'Review bonus accruals — assess when obligation arose',
        'Test PAYE/NIC accrual at year end against RTI submissions',
        'Verify pension contributions accrual',
        'Test redundancy provisions for correct period recognition',
      ],
      assertions: ['Cut-off', 'Completeness', 'Accuracy', 'Valuation'],
    },
  ],
};

// ─── ISQM REQUIREMENTS ─────────────────────────────────────────────

export const ISQM_REQUIREMENTS = {
  title: 'ISQM (UK) 1 & 2 — Quality Management Standards',
  source: 'frc.org.uk',
  lastVerified: '2026-03-12',
  standards: [
    {
      standard: 'ISQM (UK) 1',
      title: 'Quality Management for Firms that Perform Audits or Reviews of Financial Statements',
      effectiveDate: 'Effective 15 December 2022',
      components: [
        {
          component: 'Governance and Leadership',
          description: 'Firm\'s leadership responsible for quality, culture, and accountability.',
          requirements: [
            'Firm leadership demonstrates commitment to quality',
            'Culture that recognises and reinforces quality as essential',
            'Assignment of roles, responsibilities, and authority for quality management',
            'Strategic decisions considering quality implications',
          ],
        },
        {
          component: 'Relevant Ethical Requirements',
          description: 'Firm\'s compliance with FRC Ethical Standard and independence requirements.',
          requirements: [
            'Policies and procedures for compliance with ethical requirements',
            'Independence monitoring and confirmation',
            'Breach identification and remediation processes',
            'Annual independence declarations from all engagement team members',
          ],
        },
        {
          component: 'Acceptance and Continuance',
          description: 'Client and engagement acceptance/continuance processes.',
          requirements: [
            'Risk-based approach to client acceptance',
            'Assessment of management integrity',
            'Competence and resource assessment',
            'Ongoing monitoring of client relationships',
          ],
        },
        {
          component: 'Engagement Performance',
          description: 'Quality at the engagement level.',
          requirements: [
            'Direction, supervision, and review of engagement work',
            'Consultation on difficult or contentious matters',
            'Differences of opinion resolution',
            'Engagement documentation standards',
          ],
        },
        {
          component: 'Resources',
          description: 'Human, technological, and intellectual resources.',
          requirements: [
            'Competent personnel recruited, developed, and retained',
            'Sufficient and appropriate technological resources',
            'Intellectual resources including methodology and guidance',
            'Resource planning for engagement requirements',
          ],
        },
        {
          component: 'Information and Communication',
          description: 'Information system supporting quality management.',
          requirements: [
            'Information exchange with external parties (regulators, network)',
            'Internal communication of quality objectives and responsibilities',
            'Whistleblowing and complaint mechanisms',
          ],
        },
        {
          component: 'Monitoring and Remediation',
          description: 'Ongoing evaluation and continuous improvement.',
          requirements: [
            'Design monitoring activities to assess quality management system',
            'Inspect completed engagements on cyclical basis',
            'Evaluate findings, identify deficiencies, and remediate',
            'Root cause analysis of identified deficiencies',
            'Annual evaluation of the system of quality management',
          ],
        },
      ],
    },
    {
      standard: 'ISQM (UK) 2',
      title: 'Engagement Quality Reviews',
      effectiveDate: 'Effective 15 December 2022',
      requirements: [
        'EQR required for audits of public interest entities (PIEs)',
        'EQR required for other engagements where determined by firm policy',
        'EQR criteria: listed entities, significant public interest, engagement risk assessment',
        'EQR reviewer must be independent of engagement team',
        'EQR reviewer must have competence and authority to perform review',
        'EQR involves evaluation of significant judgements and conclusions',
        'EQR must be completed before issuance of the audit report',
      ],
      eqrScope: [
        'Significant risks identified and auditor\'s responses',
        'Significant judgements including materiality',
        'Going concern assessment',
        'Significant transactions outside normal course of business',
        'Significant deficiencies in internal control communicated to management',
        'Uncorrected misstatements and effect on audit opinion',
        'Matters to be communicated to those charged with governance',
        'Independence considerations',
      ],
    },
  ],
};
