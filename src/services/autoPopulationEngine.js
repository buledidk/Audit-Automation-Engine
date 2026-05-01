/**
 * AutoPopulationEngine
 * Auto-populates audit working paper sections with SPECIFIC, DETAILED procedures.
 * Every procedure includes: id, isaReference, accountingStandard, assertion, title,
 * objective, steps, evidence, sampleSize, exceptionDefinition, riskRelevance.
 */

export class AutoPopulationEngine {
  constructor(mlEngine = null) {
    this.mlEngine = mlEngine;
    this.sectionPopulators = new Map([
      ['revenue',               this._populateRevenue.bind(this)],
      ['trade_debtors',         this._populateTradDebtors.bind(this)],
      ['ppe',                   this._populatePPE.bind(this)],
      ['cash_bank',             this._populateCashBank.bind(this)],
      ['trade_creditors',       this._populateTradeCreditors.bind(this)],
      ['provisions',            this._populateProvisions.bind(this)],
      ['payroll',               this._populatePayroll.bind(this)],
      ['tax',                   this._populateTax.bind(this)],
      ['inventory',             this._populateInventory.bind(this)],
      ['intangibles',           this._populateIntangibles.bind(this)],
      ['leases',                this._populateLeases.bind(this)],
      ['financial_instruments', this._populateFinancialInstruments.bind(this)],
      ['planning',              this._populatePlanning.bind(this)],
      ['acceptance',            this._populateAcceptance.bind(this)],
      ['completion',            this._populateCompletion.bind(this)],
      ['analytics_benford',     this._populateBenford.bind(this)],
      ['analytics_dupont',      this._populateDuPont.bind(this)],
      ['analytics_zscore',      this._populateZScore.bind(this)],
      ['analytics_mscore',      this._populateMScore.bind(this)],
      ['analytics_journal_entries', this._populateJournalEntries.bind(this)],
      ['analytics_regression',  this._populateRegression.bind(this)],
      ['analytics_benchmarking',this._populateBenchmarking.bind(this)],
      ['analytics_related_parties', this._populateRelatedParties.bind(this)],
    ]);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  populateSection(section, context = {}) {
    const populator = this.sectionPopulators.get(section);
    if (!populator) return this._getGenericSection(section, context);
    return populator(context);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  _calculateSampleSize(riskLevel, population) {
    const baseSize = { low: 25, medium: 50, high: 75, significant: 100 };
    const base = baseSize[riskLevel] || 50;
    if (population && population < 200) {
      return Math.min(base, Math.ceil(population * 0.4));
    }
    return base;
  }

  _fmt(context) {
    const m  = context.materiality  || '[PM]';
    const pm = context.materiality  ? Math.round(context.materiality * 0.5) : '[PM × 50%]';
    const ss = context.sampleSize   || this._calculateSampleSize(context.riskLevel, null);
    const rl = context.riskLevel    || 'medium';
    const fw = context.framework    || 'IFRS';
    const ind = context.industry    || 'general';
    return { m, pm, ss, rl, fw, ind };
  }

  _signOff(roles) {
    return roles.map(r => ({ role: r.role, timing: r.timing, requirement: r.requirement }));
  }

  // ─── REVENUE ───────────────────────────────────────────────────────────────

  _populateRevenue(context) {
    const { m, pm, ss, _rl } = this._fmt(context);
    return {
      title: 'Revenue Recognition',
      isaReferences: [
        { ref: 'ISA 240 para 26', description: 'Revenue is a presumed fraud risk — must be rebutted or addressed' },
        { ref: 'ISA 315 para 19', description: 'Understand entity revenue streams and recognition policies' },
        { ref: 'ISA 330 para 18', description: 'Substantive procedures required for significant risks' },
        { ref: 'ISA 540 para 6',  description: 'Accounting estimates in revenue (% completion, variable consideration)' },
        { ref: 'ISA 530',         description: 'Audit sampling — monetary unit sampling for invoice testing' },
      ],
      accountingStandards: [
        'IFRS 15 Revenue from Contracts with Customers',
        'FRS 102 Section 23 Revenue',
        'IAS 8 Accounting Policies, Changes in Accounting Estimates and Errors',
      ],
      objectives: [
        'Confirm revenue is recognised only when/as performance obligations are satisfied (IFRS 15 step 5)',
        'Confirm revenue is complete — no material omissions',
        'Confirm revenue is recorded in the correct accounting period (cut-off)',
        'Confirm revenue is accurately measured at transaction price (IFRS 15 step 3)',
        'Identify indicators of fraudulent revenue overstatement',
      ],
      assertions: ['Occurrence', 'Completeness', 'Accuracy', 'Cutoff', 'Classification'],
      procedures: [
        {
          id: 'REV-001',
          isaReference: 'ISA 530 / ISA 500 para 7',
          accountingStandard: 'IFRS 15 paras 31–38 / FRS 102 s23.14',
          assertion: ['Occurrence', 'Accuracy', 'Cutoff'],
          title: 'Sales Invoice Sample Trace',
          objective: 'Verify that selected sales invoices represent genuine transactions with performance obligations satisfied before/at recognition date, and that amounts are accurately recorded.',
          steps: [
            `(1) Extract the complete population of sales invoices from the accounting system for the audit period. Stratify by value band: identify the top 20% of invoices by value — select all material items above £${m} individually; apply monetary unit sampling (MUS) to the remainder to select a total sample of ${ss} invoices. Document the sampling frame, random seed, and selection methodology on the evidence schedule.`,
            `(2) For each selected invoice, obtain and inspect all of the following — tick each as obtained: (a) The signed customer contract or purchase order — verify: customer name matches invoice, goods/services description matches invoice line items, agreed price matches invoiced amount, payment terms consistent with entity policy. (b) Delivery note or proof of shipment (for goods) or completion certificate/timesheet/client sign-off (for services) — verify: delivery/completion date is on or before the invoice date, quantity delivered matches quantity invoiced, signatory is an authorised person at the customer. (c) The sales invoice itself — verify: sequential numbering, correct VAT treatment, correct customer details. (d) Subsequent cash receipt — agree to bank statement; or, if outstanding, agree to aged debtor listing and assess recoverability.`,
            `(3) For any invoice where the delivery/completion date falls within 14 days either side of the period-end date, perform enhanced cut-off testing: obtain the underlying delivery note or completion certificate showing the precise date. If delivery/completion is after year-end, verify that revenue has been deferred (trace to deferred income balance or confirm invoice was not posted until next period). If delivery/completion is before year-end but invoice is dated after, verify revenue has been accrued. Cross-reference to the year-end accrued income schedule.`,
            `(4) For any contract that spans multiple periods (subscription, retainer, staged delivery), apply the IFRS 15 five-step model: (i) identify the contract — verify written agreement exists; (ii) identify performance obligations — verify entity has documented separate obligations; (iii) determine transaction price — verify any variable consideration (rebates, discounts, returns) has been constrained per IFRS 15 para 56; (iv) allocate transaction price — verify allocation method (relative standalone selling price) if multiple obligations; (v) recognise revenue as obligation satisfied — verify timing. Document each step.`,
            `(5) Summarise results on the sample testing schedule. For each exception — defined as: documentation missing, performance obligation not yet satisfied at recognition date, incorrect period, incorrect amount — raise an audit difference and quantify. Conclude whether the revenue balance as a whole is free from material misstatement.`,
          ],
          evidence: [
            'Signed customer contracts / purchase orders',
            'Delivery notes / proof of shipment / completion certificates / timesheets',
            'Sales invoices (original)',
            'Bank statements or aged debtor listing (post-year-end cash receipts)',
            'Deferred income / accrued income schedules',
            'Sampling frame and MUS selection workpaper',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any invoice where: (a) the five-step IFRS 15 model cannot be verified by supporting documentation; (b) revenue was recognised before performance obligation was satisfied; (c) amount differs from supporting documentation by more than £' + pm + '; (d) invoice relates to a different accounting period.',
          riskRelevance: 'all',
        },
        {
          id: 'REV-002',
          isaReference: 'ISA 330 para 18 / ISA 500 para 7',
          accountingStandard: 'IFRS 15 para 38 / FRS 102 s23.28',
          assertion: ['Cutoff', 'Occurrence', 'Completeness'],
          title: 'Revenue Cut-off Testing',
          objective: 'Confirm that revenue is recorded in the correct accounting period — transactions before year-end are included and transactions after year-end are excluded.',
          steps: [
            `(1) Obtain the sales day book / revenue journal. Identify: the last 20 sales invoices raised before year-end (by posting date) and the first 20 sales invoices raised after year-end. Record each invoice number, date, customer, and amount on the cut-off testing schedule.`,
            `(2) For each of the last 20 pre-year-end invoices: obtain the corresponding delivery note, completion certificate, or service sign-off. Record the delivery/completion date. If delivery/completion date is after year-end, investigate: has revenue been deferred? If revenue was recognised pre-year-end and delivery/completion is post-year-end, this is an overstatement — quantify and raise audit difference.`,
            `(3) For each of the first 20 post-year-end invoices: obtain the corresponding delivery note/completion certificate. Record the delivery/completion date. If delivery/completion occurred before year-end, investigate: has revenue been accrued in the correct period? If revenue should have been recognised pre-year-end but was posted post-year-end, this is an understatement — quantify and raise audit difference. Also verify whether there are accrued income journals at year-end that capture this.`,
            `(4) Cross-reference cut-off test results to the year-end cut-off journal entry. Agree the accrued income balance on the balance sheet to the schedule of invoices issued post-year-end for pre-year-end services. Agree the deferred income balance to the schedule of invoices issued pre-year-end for post-year-end services. Verify journal entry has appropriate authorisation and supporting documentation.`,
            `(5) Document all cut-off exceptions on the audit differences schedule. Conclude on the adequacy of the entity's cut-off controls and whether any further sample extension is required.`,
          ],
          evidence: [
            'Sales day book / revenue journal (extract around year-end)',
            'Delivery notes / completion certificates for pre- and post-year-end invoices',
            'Accrued income schedule and supporting breakdown',
            'Deferred income schedule and supporting breakdown',
            'Year-end cut-off journal entry with authorisation',
          ],
          sampleSize: '20 pre-year-end + 20 post-year-end invoices',
          exceptionDefinition: 'Any invoice where the period of recognition does not match the period of delivery/performance, resulting in revenue recorded in the wrong accounting period.',
          riskRelevance: 'all',
        },
        {
          id: 'REV-003',
          isaReference: 'ISA 520 para 5',
          accountingStandard: 'IFRS 15 / IAS 8',
          assertion: ['Completeness', 'Accuracy', 'Occurrence'],
          title: 'Analytical Procedures — Monthly Revenue Trend Analysis',
          objective: 'Identify unexpected fluctuations in revenue that may indicate misstatement, fraud, or unusual transactions requiring further investigation.',
          steps: [
            `(1) Obtain monthly revenue data disaggregated by product line / revenue stream / geographical segment for the current year and prior year. Build a comparison table showing: prior year monthly amount, current year monthly amount, £ variance, % variance. Where the entity has budgets/forecasts, include a third column for budget vs actual variance.`,
            `(2) Identify all months where either: (a) year-on-year variance exceeds 10% or £${m} (whichever is lower); or (b) current year vs budget variance exceeds 15%. For each flagged month, obtain management's written explanation. Explanations to consider: new contracts commenced, price increases, volume changes, one-off items, seasonal factors, lost customers, product discontinuation.`,
            `(3) Corroborate each management explanation with independent evidence: price increases — inspect revised price lists, contract amendments, or RPI/CPI data; volume increases — inspect dispatch records, order confirmations, or production records; new contracts — inspect signed contract documents and verify contract start date; one-off items — inspect board minutes, correspondence, or invoices; seasonal factors — compare to 3-year trend if available. Document evidence reference for each explanation.`,
            `(4) Perform seasonality analysis: plot monthly revenue as a percentage of full-year revenue for current year and prior year. Identify any months where the seasonal pattern has broken. A break in pattern without a credible explanation is a red flag for: fictitious revenue, pulled-forward revenue, or revenue omission. For any unexplained pattern breaks, extend substantive testing by selecting additional invoice samples from that month.`,
            `(5) Calculate the following ratios and compare to prior year and industry benchmarks: (a) Revenue growth rate %; (b) Revenue per employee (if headcount data available); (c) Revenue / total assets (asset turnover); (d) Revenue concentration — top 5 customers as % of total (obtain from CRM/debtors analysis). Flag any ratios outside expected range (±20% of prior year) for further investigation. Document all conclusions.`,
          ],
          evidence: [
            'Monthly revenue report by product line/segment (current and prior year)',
            'Management explanations for variances (written)',
            'Corroborating evidence: price lists, contract amendments, dispatch records, board minutes',
            'Budget/forecast data (if available)',
            'Industry benchmark data',
          ],
          sampleSize: 'All 12 months (full population analytical review)',
          exceptionDefinition: 'Any month or segment where a variance exceeding 10% or £' + m + ' cannot be adequately explained and corroborated by independent evidence.',
          riskRelevance: 'all',
        },
        {
          id: 'REV-004',
          isaReference: 'ISA 540 para 8 / ISA 330 para 18',
          accountingStandard: 'IFRS 15 paras 35–37 (over-time recognition) / IAS 11 (legacy)',
          assertion: ['Accuracy', 'Cutoff', 'Occurrence'],
          title: 'Percentage-of-Completion / Over-Time Revenue Recognition Testing',
          objective: 'Verify that long-term contracts with over-time performance obligations have revenue recognised in the correct period and amount, based on a reliable measure of completion.',
          steps: [
            `(1) Obtain management's schedule of all long-term contracts in progress at year-end (including contracts commenced in the year and carried forward from prior year). For each contract exceeding £${m} in value: obtain the original signed contract, any approved variations/change orders, the project cost schedule, and management's completion assessment. Agree total contract value to signed contract.`,
            `(2) Independently recalculate the completion percentage using the input method (costs-based): Costs incurred to date ÷ Total estimated costs at completion × 100 = Completion %. Compare to management's stated completion percentage. Investigate any variance > 5 percentage points. Obtain project manager's or engineer's written sign-off confirming total estimated cost to complete is reasonable.`,
            `(3) Verify total estimated costs are appropriately supported: obtain the cost to complete estimate signed by the project manager; for significant contracts, consider whether an independent quantity surveyor's report is available; verify that cost overruns known at year-end are included in the total estimated cost (not deferred). Investigate any situation where estimated costs at completion appear understated relative to progress observed.`,
            `(4) Recalculate revenue to recognise: Completion % × Total contract value = Cumulative revenue to date. Deduct revenue recognised in prior periods. The result is current period revenue. Compare to amount posted in the accounts. Investigate variances > £${pm}. Also recalculate the contract asset (work in progress) or contract liability (advance billing) balance: cumulative revenue recognised less amounts billed to customer. Agree to balance sheet.`,
            `(5) Test for onerous contracts: for each contract, compare total expected revenue to total estimated costs. Where total estimated costs exceed total contract revenue (loss-making contract), verify that a provision for the full expected loss has been recognised immediately per IAS 37 / IFRS 15. Inspect board reports or project reviews for any indication of expected losses not yet recognised. Document conclusions on each contract.`,
          ],
          evidence: [
            'Long-term contracts schedule (management prepared)',
            'Signed contracts and approved variations',
            'Project cost schedules and cost-to-complete estimates',
            'Engineer / project manager sign-off on completion %',
            'Contract asset / contract liability reconciliation',
            'Board project review reports',
          ],
          sampleSize: `All contracts > £${m} (individually significant); sample of smaller contracts`,
          exceptionDefinition: 'Any contract where independently calculated completion % differs from management\'s by more than 5 percentage points, or where a loss-making contract has not had a full loss provision recognised immediately.',
          riskRelevance: 'high',
        },
        {
          id: 'REV-005',
          isaReference: 'ISA 240 para 32 / ISA 520',
          accountingStandard: 'IFRS 15 / IAS 8',
          assertion: ['Occurrence', 'Accuracy', 'Completeness'],
          title: "Benford's Law Analysis on Revenue Transactions",
          objective: "Apply Benford's Law to identify statistically anomalous patterns in revenue transactions that may indicate manipulation, fraud, or systematic error.",
          steps: [
            `(1) Export all individual sales transaction records for the audit period from the accounting system. Ensure the dataset includes: transaction date, invoice number, customer code, amount (net of VAT), revenue stream/nominal code, and posting user ID. Confirm the dataset contains a minimum of 1,000 transactions for statistical validity of Benford's Law. If fewer transactions exist, note limitation and consider whether analysis is still informative.`,
            `(2) Apply first-digit Benford's Law analysis: for each transaction extract the first significant digit (1–9). Calculate the observed frequency of each digit as a percentage of total transactions. Compare to the expected Benford distribution: 1=30.1%, 2=17.6%, 3=12.5%, 4=9.7%, 5=7.9%, 6=6.7%, 7=5.8%, 8=5.1%, 9=4.6%. Build a comparison table and bar chart showing observed vs expected frequencies.`,
            `(3) Run the chi-square goodness-of-fit test: χ² = Σ [(Observed − Expected)² ÷ Expected] for each digit. Compare calculated χ² to critical value at 0.05 significance level with 8 degrees of freedom (critical value = 15.51). A result exceeding the critical value indicates statistically significant deviation from Benford's distribution. Also apply the Mean Absolute Deviation (MAD) test: MAD < 0.006 = close conformity; 0.006–0.012 = acceptable; > 0.015 = non-conformity.`,
            `(4) For any digit where actual vs expected deviation exceeds 5 percentage points, or where the chi-square test flags significance: extract all transactions starting with that digit. Analyse for patterns: (a) clustering around specific amounts (e.g., multiple transactions just below an approval threshold — indicates splitting); (b) same customer appearing repeatedly; (c) same journal posting user; (d) transactions posted outside business hours or on weekends; (e) round-number transactions (e.g., exactly £10,000). Document each pattern identified.`,
            `(5) For any patterns identified in step 4, select a judgement sample of flagged transactions and trace to supporting documentation (contracts, delivery notes, bank receipts). Report findings. Conclude whether anomalies represent a fraud risk, a control weakness, or an acceptable feature of the entity's business (e.g., price-list-driven transactions may naturally cluster). Document statistical output, chi-square result, MAD score, and all follow-up procedures.`,
          ],
          evidence: [
            'Complete sales transaction data export (CSV/Excel)',
            "Benford's Law analysis workbook (chi-square, MAD, frequency table, chart)",
            'Supporting documentation for flagged transactions',
            'Documentation of patterns investigated and conclusions',
          ],
          sampleSize: 'Full population (minimum 1,000 transactions)',
          exceptionDefinition: "MAD score > 0.015, chi-square result exceeding 15.51, or any digit with > 5 percentage point deviation from Benford's expected frequency that cannot be explained by legitimate business characteristics.",
          riskRelevance: 'high',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Sign each procedure as complete, document results and exceptions' },
        { role: 'Manager', timing: 'Within 5 business days of fieldwork completion', requirement: 'Review all revenue procedures, approve sample selections, review exceptions' },
        { role: 'Partner / Director', timing: 'Before audit report sign-off', requirement: 'Review significant risks, review audit differences, approve final conclusion' },
      ]),
      guidanceNotes: [
        'Revenue is a presumed fraud risk under ISA 240 para 26 — the presumption can only be rebutted if the auditor concludes that the risk is not present, which must be documented.',
        'For first-year audits, extend the cut-off sample to 30 pre- and 30 post-year-end invoices.',
        'Where the entity operates multiple revenue streams, ensure REV-001 sample is stratified across all material streams.',
        'If the entity has bill-and-hold arrangements, apply specific IFRS 15 criteria: customer has requested arrangement, asset separately identified, asset ready for transfer, entity cannot direct asset elsewhere.',
        "For variable consideration (rebates, returns, volume discounts): verify the entity has applied the 'most likely amount' or 'expected value' method consistently and has constrained the estimate sufficiently to avoid significant reversal.",
      ],
      riskConsiderations: context.riskLevel === 'high' || context.riskLevel === 'significant'
        ? [
            'HIGH RISK: Extend sample to 100+ invoices. Perform cut-off on 30+30 transactions.',
            'Consider engaging forensic procedures or data analytics across full transaction population.',
            "Perform journal entry testing specifically targeting manual journals to revenue accounts (ISA 240 fraud risk).",
            'Obtain management representation letter specifically addressing revenue recognition policies and any judgements made.',
          ]
        : [
            'Ensure analytical procedures are sufficiently precise to detect material misstatement.',
            'Consider whether any revenue streams have inherent estimation uncertainty requiring ISA 540 procedures.',
          ],
      evidenceChecklist: [
        '[ ] Customer contracts / purchase orders (sample)',
        '[ ] Delivery notes / completion certificates (sample)',
        '[ ] Sales invoices (sample)',
        '[ ] Bank statements (post-year-end receipts)',
        '[ ] Aged debtor listing',
        '[ ] Monthly revenue report (current + prior year)',
        '[ ] Cut-off journal entry',
        '[ ] Accrued income schedule',
        '[ ] Deferred income schedule',
        '[ ] Long-term contracts schedule (if applicable)',
        "[ ] Benford's Law analysis output",
        '[ ] Management representations on revenue',
      ],
      smartAnalytics: [
        { type: 'analytics_benford',     reason: "Revenue transactions are a primary candidate for Benford's Law analysis to detect manipulation" },
        { type: 'analytics_regression',  reason: 'Predictive analytics can model expected revenue based on volume drivers (units, prices, customers)' },
        { type: 'analytics_benchmarking',reason: 'Compare revenue growth, gross margin, and revenue per employee to industry peers' },
        { type: 'analytics_journal_entries', reason: 'Journal entry testing on manual postings to revenue accounts is required for significant risk' },
      ],
    };
  }

  // ─── TRADE DEBTORS ─────────────────────────────────────────────────────────

  _populateTradDebtors(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Trade Debtors / Accounts Receivable',
      isaReferences: [
        { ref: 'ISA 505', description: 'External Confirmations — debtor circularisation' },
        { ref: 'ISA 540', description: 'Auditing accounting estimates — ECL provisions' },
        { ref: 'ISA 550', description: 'Related parties — related party debtors' },
        { ref: 'ISA 315', description: 'Understanding the entity — credit control process' },
      ],
      accountingStandards: [
        'IFRS 9 Financial Instruments (ECL model)',
        'IFRS 15 Revenue recognition (contract assets)',
        'FRS 102 Section 11 Basic Financial Instruments',
        'FRS 102 Section 21 Provisions',
      ],
      objectives: [
        'Confirm trade debtors exist (existence)',
        'Confirm all amounts owed to the entity are recorded (completeness)',
        'Confirm debtors are stated at net realisable value after ECL provision (valuation)',
        'Confirm debtors are properly classified as current/non-current',
        'Confirm cut-off is correct — only amounts earned before year-end included',
      ],
      assertions: ['Existence', 'Completeness', 'Valuation', 'Rights', 'Cutoff', 'Classification'],
      procedures: [
        {
          id: 'TDR-001',
          isaReference: 'ISA 500 para 7 / ISA 315',
          accountingStandard: 'IFRS 9 / FRS 102 s11',
          assertion: ['Existence', 'Valuation', 'Completeness'],
          title: 'Aged Debtor Analysis and Reconciliation',
          objective: 'Confirm the aged debtor listing is complete and accurate; identify overdue and potentially irrecoverable amounts.',
          steps: [
            `(1) Obtain the aged debtor listing as at year-end. Cast the listing (verify arithmetic) and agree the total to the trade debtors balance in the trial balance. If there is a difference, investigate and resolve before proceeding. Agree the listing to the sales ledger control account reconciliation.`,
            `(2) Analyse the aging profile: calculate total amounts in each bucket (current, 30 days, 60 days, 90 days, >90 days overdue) as a percentage of total debtors. Compare the aging profile to prior year. Identify any deterioration (shift toward older buckets). Obtain management's written explanation for any deterioration.`,
            `(3) Identify all individual debtor balances exceeding £${m}. For each: obtain a breakdown of invoices comprising the balance; obtain details of post-year-end cash receipts (agree to bank statements); obtain management's written assessment of recoverability. Note customers with breached payment terms, financial difficulty, or disputed invoices.`,
            `(4) For balances >90 days overdue: perform specific recoverability procedures: (a) inspect post-year-end cash receipts — if fully collected, no provision required; (b) obtain aged correspondence evidencing active collection pursuit; (c) inspect any credit notes issued post-year-end (may indicate dispute or return); (d) search Companies House/credit reference agency for debtor financial health indicators; (e) for disputed balances, obtain management's estimate of outcome and supporting correspondence.`,
            `(5) Conclude on the overall adequacy of the trade debtors balance. Cross-reference to ECL procedure TDR-003. Document total identified overdue/impaired amounts and assess against provision held. Prepare a summary table: balance by aging bucket, provision held, net recoverable amount, auditor's assessment.`,
          ],
          evidence: [
            'Aged debtor listing as at year-end',
            'Sales ledger control account reconciliation',
            'Post-year-end cash receipts report',
            'Correspondence with overdue debtors',
            'Companies House / credit searches for significant debtors',
          ],
          sampleSize: 'Full population analytical; individual testing of all balances > £' + m,
          exceptionDefinition: 'Any balance > 90 days overdue without post-year-end cash receipt or adequate provision, or any balance where credit risk indicators suggest impairment but no provision has been recorded.',
          riskRelevance: 'all',
        },
        {
          id: 'TDR-002',
          isaReference: 'ISA 505 paras 7–15',
          accountingStandard: 'IFRS 9 / FRS 102 s11',
          assertion: ['Existence', 'Rights', 'Accuracy'],
          title: 'Debtor Circularisation (External Confirmations — ISA 505)',
          objective: 'Obtain independent third-party confirmation of debtor balances to provide high-quality audit evidence of existence and accuracy.',
          steps: [
            `(1) Agree total debtors per the aged debtor listing to the trial balance. Select the confirmation sample: (a) all individual balances exceeding £${m} — positive confirmation is mandatory; (b) a random sample of remaining balances to bring total to ${ss} debtors; (c) any nil balances or credit balances on the ledger (to detect unrecorded liabilities or overstatements). Determine with the audit manager whether positive confirmations (explicit reply required) or negative confirmations are appropriate — positive confirmations are required for all significant risk areas.`,
            `(2) Prepare confirmation requests on the audit firm's letterhead — NOT the client's letterhead. Each request must state: the debtor's balance as at [year-end date]; a request to confirm agreement or provide details of differences; the firm's address as the return address. Obtain client authorisation to contact customers. Send confirmations directly to customers by post or secure email — do NOT allow the client to send or handle responses.`,
            `(3) Monitor response rates. After 14 days without response, send a second confirmation request. Maintain a log recording: date sent, date of first follow-up, date of second follow-up if needed, date response received, response outcome (agreed / disagreed with details / no response). Target response rate of at least 70% of sample value.`,
            `(4) For persistent non-responses after two requests: apply alternative procedures for each non-responding debtor: (a) trace the balance to post-year-end cash receipts in bank statements (most reliable alternative — if fully received post-year-end, existence is confirmed); (b) agree outstanding invoices to signed delivery notes and customer contracts; (c) agree to subsequent correspondence acknowledging the debt; (d) for related party non-responses, escalate to partner — this may indicate the balance is not genuine.`,
            `(5) Reconcile all confirmation replies to the aged debtor listing. For any disagreements: obtain the debtor's breakdown and reconcile differences: payments in transit — verify receipt by entity in post-year-end bank statement; disputed invoices — obtain management explanation and assess whether balance is overstated; invoices not received by debtor — verify the invoices and assess whether revenue recognition is appropriate. Document all exceptions; raise audit differences where applicable. Assess whether overall response rate and coverage is sufficient to conclude on the debtors balance.`,
          ],
          evidence: [
            'Confirmation request letters (firm copy)',
            'Signed confirmation replies (originals filed)',
            'Non-response log and second-request evidence',
            'Alternative procedure evidence for non-responders',
            'Reconciliation schedule for disputed amounts',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Confirmed balance differs from entity records by > £' + pm + ' that cannot be reconciled to a timing difference, or any indication that a debtor balance does not exist.',
          riskRelevance: 'all',
        },
        {
          id: 'TDR-003',
          isaReference: 'ISA 540 paras 8–21',
          accountingStandard: 'IFRS 9 paras 5.5.1–5.5.20 / FRS 102 s11.21',
          assertion: ['Valuation'],
          title: 'Expected Credit Loss (ECL) Assessment under IFRS 9',
          objective: 'Verify that the bad debt provision is calculated in accordance with IFRS 9 ECL model and represents a reasonable estimate of irrecoverable amounts.',
          steps: [
            `(1) Obtain management's ECL provision calculation and provision matrix. For trade debtors without a significant financing component, the simplified approach applies: provision rates are applied by aging bucket. Agree the provision matrix total to the bad debt provision in the trial balance. Verify the provision movement (opening balance + new provisions - utilised - released = closing balance).`,
            `(2) Challenge the provision rates: verify rates are derived from the entity's own historical default/write-off experience by aging bucket over a minimum 3-year historical period. Obtain the entity's historical write-off records. Independently calculate implied historical default rates by bucket. Compare to rates applied in the provision matrix. Investigate any rates lower than historical experience without clear justification.`,
            `(3) Assess forward-looking macro adjustments required under IFRS 9 para 5.5.17: management must adjust historical rates for current and forward-looking macroeconomic conditions. Evaluate: (a) current economic environment — sector-specific stresses (rising interest rates, industry downturns) that increase credit risk vs. historical periods; (b) entity-specific factors — has customer mix changed toward less creditworthy customers; (c) post-year-end information — significant debtors in administration or payment difficulties. Document assessment and whether adjustments are adequate.`,
            `(4) For individually significant debtors (balances > £${m}): perform individual ECL assessment independent of the matrix. Assess objective evidence of impairment: payment >90 days overdue without explanation; debtor in administration/receivership/liquidation; disputed invoices; CCJs or negative credit reports; breach of payment terms for >3 consecutive months. For each impaired debtor, verify provision = balance × probability of default × (1 − recovery rate), or management's specific estimate if supported.`,
            `(5) Re-perform the overall ECL calculation using the provision matrix rates. Compare to management's provision. Investigate variances > £${pm}. Assess whether the provision is: within an acceptable range of outcomes (±20% of re-performed amount); consistent with prior year methodology (changes require IAS 8 disclosure and explanation); adequately disclosed in the financial statements (provision movement table, credit risk disclosures per IFRS 7). Document conclusion.`,
          ],
          evidence: [
            'ECL provision calculation and provision matrix',
            'Historical write-off / default rate data (3+ years)',
            'Forward-looking macroeconomic data used by management',
            'Individual assessment workings for debtors > £' + m,
            'Credit reports / correspondence for impaired debtors',
            'Prior year provision matrix',
          ],
          sampleSize: 'Full population for matrix review; individual assessment for all balances > £' + m,
          exceptionDefinition: 'Re-performed ECL provision exceeds management provision by > £' + pm + ', or provision rates demonstrably lower than historical default experience without adequate forward-looking adjustment.',
          riskRelevance: 'medium',
        },
        {
          id: 'TDR-004',
          isaReference: 'ISA 500 / ISA 330',
          accountingStandard: 'IFRS 15 / IFRS 9 / FRS 102 s23',
          assertion: ['Cutoff', 'Completeness'],
          title: 'Debtors Cut-off and Completeness',
          objective: 'Confirm all amounts owed at year-end are included in trade debtors and no post-year-end amounts are included.',
          steps: [
            `(1) Cross-reference cut-off results from revenue testing (REV-002) to the trade debtors balance. Any pre-year-end revenue not yet invoiced should appear as accrued income — agree to accrued income schedule and trace to supporting completion evidence. Any post-year-end revenue incorrectly included in trade debtors should be excluded — quantify.`,
            `(2) Obtain the last 10 goods despatched notes (GDNs) / service completion records before year-end. Agree each to an invoice posted to trade debtors before year-end in the sales ledger. Any despatch/completion without a corresponding debtor entry represents a potential omission — quantify and raise audit difference.`,
            `(3) Review post-year-end credit notes raised in the first 30 days after year-end. For credit notes > £${pm}: obtain the supporting reason; assess whether the underlying transaction should have been excluded from year-end debtors (e.g., goods returned before year-end, dispute known at year-end, invoice incorrectly raised). Quantify any overstatement of debtors.`,
            `(4) Confirm completeness of the debtors listing by agreeing to the nominal ledger sales/debtors control account. Investigate reconciling items between the sales ledger and control account — each item must be explained and resolved.`,
            `(5) Conclude on cut-off and completeness, documenting all exceptions and quantifying the effect on the debtors balance.`,
          ],
          evidence: [
            'Last 10 GDNs / service completion records pre-year-end',
            'Post-year-end credit notes (30 days)',
            'Sales ledger to control account reconciliation',
            'Accrued income schedule',
          ],
          sampleSize: '10 pre-year-end despatch records; full 30-day post-year-end credit note review',
          exceptionDefinition: 'Any amount incorrectly included or excluded from trade debtors at year-end resulting in misstatement > £' + pm,
          riskRelevance: 'all',
        },
        {
          id: 'TDR-005',
          isaReference: 'ISA 550 paras 13–22',
          accountingStandard: 'IAS 24 / FRS 102 s33',
          assertion: ['Existence', 'Valuation', 'Disclosure'],
          title: 'Related Party Debtors (ISA 550)',
          objective: "Identify debtor balances with related parties, confirm they are on arm's length terms, appropriately valued, and properly disclosed.",
          steps: [
            `(1) Obtain the complete list of related parties identified during planning (directors, shareholders >20%, group/associate companies, key management personnel and their close family). Cross-reference the aged debtor listing against each related party. Identify all balances with related parties, however described in the listing.`,
            `(2) For each related party debtor: obtain the underlying agreement, intercompany recharge schedule, or loan documentation. Verify the transaction is on arm's length terms — compare pricing to equivalent third-party transactions. Document the basis of the relationship and transaction. If not arm's length, assess the nature of the difference (potential director benefit, dividend surrogate, etc.) and consider disclosure and tax implications.`,
            `(3) Assess the recoverability of related party debts: apply the same ECL criteria as for third-party debtors — do not assume recoverability based on the related-party relationship alone. Where a related party entity is in financial difficulty, a provision may be required regardless of the relationship.`,
            `(4) Verify the financial statements disclosure: IAS 24 para 18 requires disclosure of the nature of the relationship, description of transactions, amounts outstanding, terms and conditions including security, and the expense recognised. Review the draft related party note for adequacy. Identify any undisclosed related party balances.`,
            `(5) Obtain a specific written management representation confirming completeness of related party disclosures and that all transactions are at arm's length unless otherwise stated.`,
          ],
          evidence: [
            'Related party list from planning',
            'Aged debtor listing cross-referenced to related parties',
            "Intercompany agreements / recharge schedules",
            'Draft financial statements — related party note',
            'Management representation on related parties',
          ],
          sampleSize: 'All identified related party balances (full population)',
          exceptionDefinition: "Any related party debtor balance not on arm's length terms that is undisclosed, or any irrecoverable related party balance without an adequate provision.",
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all TDR procedures, document exceptions' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review circularisation results, review ECL assessment' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review significant debtors and related party conclusions' },
      ]),
      guidanceNotes: [
        'Where debtor circularisation response rate is below 70% by value, document whether sufficient alternative evidence has been obtained or whether the sample should be extended.',
        'IFRS 9 ECL is a point-in-time estimate — ensure management has considered macroeconomic conditions at the balance sheet date, not just historical data.',
        'For FRS 102 entities, the incurred loss model under s11.21 applies — provision is required only when there is objective evidence of impairment.',
        'Always obtain a management representation confirming no debtors have been factored, assigned, or used as security without disclosure.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Extend circularisation to all balances > £' + pm + '.', 'Perform journal entry testing on year-end debtor adjustments and provisions.']
        : ['Standard sample and analytical procedures appropriate.'],
      evidenceChecklist: [
        '[ ] Aged debtor listing agreed to TB',
        '[ ] Circularisation — letters sent',
        '[ ] Circularisation — replies filed',
        '[ ] Alternative procedures for non-responses documented',
        '[ ] ECL provision workings reviewed and re-performed',
        '[ ] Post-year-end cash receipts tested',
        '[ ] Related party debtors identified and reviewed',
        '[ ] Cut-off testing completed (cross-ref REV-002)',
      ],
      smartAnalytics: [
        { type: 'analytics_benford', reason: 'Test debtor balances and invoice amounts for statistical anomalies' },
        { type: 'analytics_related_parties', reason: 'Automated detection of related party transactions in the debtor ledger' },
      ],
    };
  }

  // ─── PPE ───────────────────────────────────────────────────────────────────

  _populatePPE(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Property, Plant and Equipment (PPE)',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on PPE balances' },
        { ref: 'ISA 501 para 4', description: 'Physical inventory attendance — applicable to PPE' },
        { ref: 'ISA 540', description: 'Accounting estimates — useful lives, residual values, impairment' },
      ],
      accountingStandards: [
        'IAS 16 Property, Plant and Equipment',
        'IAS 36 Impairment of Assets',
        'IAS 8 Accounting Policies, Changes in Estimates',
        'FRS 102 Section 17 Property, Plant and Equipment',
        'FRS 102 Section 27 Impairment of Assets',
      ],
      objectives: [
        'Confirm PPE assets exist and are owned/controlled by the entity',
        'Confirm additions are capital in nature and correctly capitalised',
        'Confirm depreciation is calculated on an appropriate and consistent basis',
        'Confirm no material impairment indicators exist, or impairment is appropriately recognised',
        'Confirm disposals are complete and correctly accounted for',
      ],
      assertions: ['Existence', 'Rights', 'Completeness', 'Valuation', 'Accuracy'],
      procedures: [
        {
          id: 'PPE-001',
          isaReference: 'ISA 500 para 7 / ISA 501',
          accountingStandard: 'IAS 16 para 7 / FRS 102 s17.4',
          assertion: ['Existence', 'Rights'],
          title: 'Physical Verification and Existence Testing',
          objective: 'Confirm that PPE assets recorded in the fixed asset register physically exist and are in use by the entity.',
          steps: [
            `(1) Obtain the fixed asset register (FAR) as at year-end. Cast the FAR and agree the total net book value to the PPE balance in the trial balance. Investigate any reconciling differences before proceeding.`,
            `(2) Select a sample from the FAR for physical inspection: (a) all assets with net book value > £${m} — mandatory individual inspection; (b) a risk-based random sample of lower-value assets to bring total to ${ss} items, stratified by asset class (property, plant, fixtures, vehicles, IT). For each selected asset, record: asset description, asset ID/tag number, stated location, and NBV per FAR.`,
            `(3) Physically inspect each sampled asset: confirm the asset is physically present at the stated location; confirm the asset tag/ID number matches the FAR record; confirm the asset is in active use (not abandoned, mothballed, or in disrepair without write-down); record the condition of the asset. For assets not found or not in use, raise an exception and quantify potential impairment or disposal.`,
            `(4) Perform the reciprocal completeness test: from a walk-through of the entity's premises, select a sample of physical assets observed and trace each back to the FAR. Any assets present but absent from the FAR may represent unrecorded acquisitions or off-balance-sheet assets — investigate each.`,
            `(5) Verify legal title for significant assets: for land and buildings — inspect Land Registry title deeds and verify entity's name; for motor vehicles — inspect V5C registration documents; for assets subject to hire purchase or finance lease — inspect agreements confirming entity has substantially all risks and rewards. Document evidence of ownership/rights for each significant asset tested.`,
          ],
          evidence: [
            'Fixed asset register (year-end)',
            'Physical inspection attendance notes (signed and dated)',
            'Asset tag photographs where applicable',
            'Title deeds / V5C / hire purchase / finance lease agreements',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any asset recorded in the FAR that cannot be physically located, or any asset observed to be no longer in use that has not been written down or reclassified.',
          riskRelevance: 'all',
        },
        {
          id: 'PPE-002',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 16 paras 7–14 / FRS 102 s17.5',
          assertion: ['Existence', 'Accuracy', 'Valuation'],
          title: 'Additions Testing',
          objective: 'Verify that capital additions are genuine, capital in nature, correctly valued, and properly recorded in the period.',
          steps: [
            `(1) Obtain the additions schedule for the year. Agree total additions per the schedule to: (a) movements in the FAR; (b) the cash flow statement (capital expenditure line). If the entity has a capital expenditure budget/board approval, compare actual additions to authorised amounts and investigate significant unauthorised overruns.`,
            `(2) For all additions above £${m}, and a risk-based sample of smaller additions to bring total to ${ss} items: obtain and inspect the purchase invoice. Verify: supplier name, invoice date falls within the period, amount agrees to FAR, description is consistent with the asset capitalised. For assets constructed or developed internally, obtain the cost schedule listing each cost component.`,
            `(3) Verify the capital vs. revenue distinction for each tested addition: apply IAS 16 para 7 recognition criteria — (a) probable that future economic benefits will flow to the entity; (b) cost can be measured reliably. Any expenditure that merely maintains the asset's existing performance capability (routine repairs and maintenance) must be expensed. For borderline items, obtain management's written justification and assess against IAS 16 criteria.`,
            `(4) For internally constructed assets: verify that only directly attributable costs are capitalised — direct materials, direct labour, and directly attributable overheads. Specifically verify that general administrative overheads are NOT capitalised; borrowing costs are capitalised only under IAS 23 with proper documentation of the qualifying asset; abnormal costs (waste, rework, idle time) are NOT included. Agree total capitalised costs to supporting timesheets, material requisitions, and overhead allocation schedules.`,
            `(5) Verify additions are placed in service: confirm in the FAR that the depreciation start date corresponds to the date the asset was available for use (IAS 16 para 55 — not when purchased but when ready for intended use). For additions placed in service within 60 days of year-end, verify partial-period depreciation calculation is correct. Confirm all additions are appropriately authorised (board minutes, CapEx approval forms).`,
          ],
          evidence: [
            'Additions schedule (year-end)',
            'Purchase invoices for sampled additions',
            'Internal cost schedules for self-constructed assets',
            'Board minutes / CapEx approval forms',
            'FAR showing depreciation commencement dates',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any addition that is revenue in nature but capitalised, any addition not supported by a valid purchase invoice or authorisation, or any addition where depreciation has not commenced from the correct date.',
          riskRelevance: 'all',
        },
        {
          id: 'PPE-003',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IAS 16 paras 50–62 / FRS 102 s17.18',
          assertion: ['Valuation', 'Accuracy'],
          title: 'Depreciation Re-performance',
          objective: 'Verify that the depreciation charge is calculated correctly and consistently using appropriate useful economic lives and methods.',
          steps: [
            `(1) Obtain the fixed asset register with full depreciation workings by asset. Select a stratified sample of ${ss} assets across all asset classes (land and buildings, plant and machinery, fixtures and fittings, motor vehicles, IT equipment). For each selected asset, extract: cost or WDV b/f, depreciation method, rate or useful life, residual value, depreciation charge for the year, accumulated depreciation, closing NBV.`,
            `(2) Re-perform the depreciation calculation for each sampled asset: Straight-line method: (Cost − Residual value) ÷ Useful life in years = Annual charge; Reducing balance method: WDV b/f × Rate% = Annual charge. Compare re-performed depreciation to the amount in the FAR for each asset. Investigate variances > £${pm} per asset. Agree total depreciation charge per FAR to the depreciation nominal ledger code in the P&L.`,
            `(3) Assess reasonableness of useful economic lives (UELs) for each asset class: compare stated UELs to (a) IAS 16 / FRS 102 guidance and industry norms; (b) manufacturer specifications where available; (c) the entity's actual replacement cycle for that category; (d) prior year UELs — any change must be treated as a change in accounting estimate per IAS 8 para 36, requiring prospective application and disclosure. Flag and document any UEL that appears inconsistent with the asset's observable condition or the entity's replacement practices.`,
            `(4) For assets with NBV = nil (fully depreciated) still appearing in the FAR as active: enquire of management whether each asset is still in active service. If genuinely still in use beyond its expected life, the UEL should have been extended at the point it became apparent — obtain explanation for why it was not. Consider whether this pattern indicates that UELs across the asset class are systematically too short (leading to understated NBV across the class).`,
            `(5) Verify the total annual depreciation charge: reconcile FAR total depreciation charge to the P&L. Verify allocation between: income statement charge, OCI (for revalued assets per IAS 16 para 41), and any amounts capitalised (depreciation on assets under construction). For revalued assets, verify depreciation is based on the revalued amount over the remaining useful life, and the excess depreciation transfer from revaluation reserve to retained earnings has been made. Document conclusion on accuracy and consistency.`,
          ],
          evidence: [
            'Fixed asset register with depreciation workings',
            'P&L nominal ledger depreciation account',
            'Prior year FAR (for UEL consistency check)',
            'Manufacturer specifications or industry useful-life guides if consulted',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Depreciation variance > £' + pm + ' per asset between re-performance and FAR, or UELs demonstrably inconsistent with asset usage patterns or industry norms without adequate disclosure.',
          riskRelevance: 'all',
        },
        {
          id: 'PPE-004',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IAS 36 / FRS 102 s27',
          assertion: ['Valuation'],
          title: 'Impairment Assessment (IAS 36)',
          objective: 'Assess whether impairment indicators exist for PPE; where indicators exist, verify the recoverable amount has been correctly determined and impairment recognised.',
          steps: [
            `(1) Perform a structured impairment indicator review across all asset classes and cash-generating units (CGUs). External indicators (IAS 36 para 12): significant market value decline; adverse changes in technology, market, economic, or legal environment; increase in market interest rates affecting discount rates; entity market capitalisation below net asset value. Internal indicators: physical damage; asset idle or being discontinued; evidence of worse economic performance than expected (e.g., actual cash flows significantly below forecast). Document each indicator assessed and conclude: present / not present.`,
            `(2) For any CGU or asset where an impairment indicator is identified: obtain management's formal impairment test. Verify the recoverable amount is correctly defined as the higher of (a) Fair value less costs of disposal (FVLCD) and (b) Value in use (VIU). For VIU: obtain the discounted cash flow model, Board-approved projections, discount rate used, and terminal value assumptions.`,
            `(3) Challenge the key VIU assumptions: revenue growth rate — compare to actual recent performance and independent economic forecasts for the sector; discount rate — verify it is a pre-tax risk-adjusted rate (often entity WACC converted to pre-tax equivalent); terminal/long-term growth rate — verify it does not exceed the long-term GDP growth rate for the relevant market (typically 2–3%). For listed companies or significant goodwill: verify sensitivity analysis is prepared and will be disclosed showing the amount by which an assumption must change to eliminate headroom.`,
            `(4) If an impairment loss is identified: verify it is recognised immediately in P&L (or reduces revaluation surplus in OCI first if the asset is on a revaluation model). Verify impairment allocation within a CGU: first reduce goodwill allocated to the CGU to nil; then reduce other assets on a pro-rata basis (but do not reduce any individual asset below the highest of its FVLCD, its VIU on a standalone basis, or nil). Verify revised NBV is used as the basis for all future depreciation calculations.`,
            `(5) Document the outcome for each CGU reviewed: (a) no indicators present — state basis for conclusion and cross-reference to evidence; (b) indicators present, recoverable amount > carrying amount — state the headroom amount and key sensitivity; (c) impairment recognised — state amount, which assets affected, and confirm adequate disclosure in financial statements per IAS 36 para 130.`,
          ],
          evidence: [
            'Impairment indicator review (documented with conclusions)',
            "Management's impairment test / VIU DCF model",
            'Board-approved cash flow projections (usually 5 years)',
            'WACC / discount rate supporting calculation',
            'Sensitivity analysis output',
          ],
          sampleSize: 'All CGUs where impairment indicators are present',
          exceptionDefinition: "Any CGU or individual asset where carrying value exceeds recoverable amount and no impairment has been recognised, or where VIU model key assumptions are not supported by evidence.",
          riskRelevance: 'medium',
        },
        {
          id: 'PPE-005',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 16 paras 67–72 / FRS 102 s17.27',
          assertion: ['Completeness', 'Accuracy', 'Occurrence'],
          title: 'Disposals and Retirements Testing',
          objective: 'Verify that all disposals of PPE are complete, correctly authorised, and that the gain or loss on disposal is accurately calculated.',
          steps: [
            `(1) Obtain the disposals schedule for the year. Agree: total proceeds per schedule to cash receipts in bank statements (or disposal documentation if scrapped/donated); cost of disposed assets to FAR opening balances; accumulated depreciation to FAR; resulting NBV at disposal date. Agree net gain/loss on disposals to the P&L nominal ledger disposal account.`,
            `(2) For all disposals with proceeds or NBV > £${pm}: verify authorisation — inspect board minutes or capital disposal approval forms authorising the specific disposal. For assets sold to third parties, inspect the sale agreement confirming buyer, date, and agreed price. Agree proceeds to the bank statement deposit.`,
            `(3) Recalculate the gain or loss on disposal for each sampled item: Proceeds received − NBV at date of disposal = Gain/(Loss). Note: NBV at date of disposal must reflect depreciation calculated to the exact date of disposal (not year-end). Compare to amount in P&L. Investigate any variance > £${pm}.`,
            `(4) Confirm asset removal from FAR: verify the disposed asset no longer appears in the FAR as an active asset. If the FAR shows the asset with NBV = nil or marked as disposed, confirm it is not generating further depreciation charges and is excluded from physical verification samples.`,
            `(5) Completeness of disposals: obtain the register of all capital disposal authorisations issued in the year. Agree each to the disposals schedule. Any authorised disposal not reflected — investigate. Additionally, consider whether any assets observed as absent during physical inspection (PPE-001) should be investigated as unrecorded disposals.`,
          ],
          evidence: [
            'Disposals schedule',
            'Board minutes / disposal authorisation forms',
            'Sale agreements / scrap/donation receipts',
            'Bank statements confirming proceeds received',
            'FAR confirming removal of disposed assets',
          ],
          sampleSize: 'All disposals > £' + pm + '; judgemental sample of smaller disposals',
          exceptionDefinition: 'Any disposal where the gain/loss is misstated by > £' + pm + ', or any disposal not authorised by appropriate management.',
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all PPE procedures, document exceptions' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review physical inspection notes, depreciation re-performance, impairment assessment' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review significant impairments and any revaluation assessments' },
      ]),
      guidanceNotes: [
        'For first-year audits, agree opening PPE balances and accumulated depreciation to prior year audited financial statements or predecessor auditor working papers.',
        'If the entity revalues assets, confirm the revaluation is performed by a qualified independent valuer; verify the effective date and methodology; ensure the revaluation surplus is correctly recorded in OCI and equity.',
        'Review whether any additions should be reclassified as right-of-use assets under IFRS 16 — check contracts for lease terms embedded in service agreements.',
        'For entities with significant land and buildings: obtain independent property valuations where carrying values may be materially different from market value.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Extend physical inspection sample and consider attending a site visit.', 'Obtain independent property valuation if carrying values appear potentially inflated.', 'Perform journal entry testing on year-end PPE journals.']
        : ['Standard sample is appropriate. Focus additions testing and impairment indicator review.'],
      evidenceChecklist: [
        '[ ] FAR agreed to TB',
        '[ ] Physical inspection attendance notes signed',
        '[ ] Additions tested to invoices and authorisations',
        '[ ] Depreciation re-performed for sample',
        '[ ] Impairment indicator review documented',
        '[ ] Disposals agreed to proceeds and FAR updated',
        '[ ] Title documents inspected for significant assets',
      ],
      smartAnalytics: [
        { type: 'analytics_dupont', reason: 'Asset turnover analysis identifies potentially under-utilised assets that may require impairment testing' },
        { type: 'analytics_benchmarking', reason: 'Compare NBV/total assets ratio and capex/depreciation ratio to industry peers' },
      ],
    };
  }

  // ─── CASH & BANK ───────────────────────────────────────────────────────────

  _populateCashBank(context) {
    const { _m, pm, _ss } = this._fmt(context);
    return {
      title: 'Cash and Bank Balances',
      isaReferences: [
        { ref: 'ISA 505', description: 'External confirmations — direct bank confirmation' },
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on cash balances' },
        { ref: 'ISA 240', description: 'Fraud risk — cash is highest-risk asset for misappropriation' },
      ],
      accountingStandards: [
        'IAS 7 Statement of Cash Flows',
        'IFRS 9 Financial Instruments',
        'FRS 102 Section 7 Statement of Cash Flows',
        'FRS 102 Section 11 Basic Financial Instruments',
      ],
      objectives: [
        'Confirm cash and bank balances exist at year-end',
        'Confirm all bank accounts are disclosed and included',
        'Confirm bank reconciliations are complete and accurate',
        'Confirm correct cut-off for cash receipts and payments',
        'Confirm cash and bank is properly classified (restricted vs unrestricted)',
      ],
      assertions: ['Existence', 'Completeness', 'Accuracy', 'Cutoff', 'Rights'],
      procedures: [
        {
          id: 'CASH-001',
          isaReference: 'ISA 505 paras 7–15',
          accountingStandard: 'IAS 7 / IFRS 9 / FRS 102 s11',
          assertion: ['Existence', 'Completeness', 'Rights'],
          title: 'Bank Confirmation (ISA 505 Direct Confirmation)',
          objective: 'Obtain independent confirmation from the bank of all balances held and facilities in place at year-end.',
          steps: [
            `(1) Obtain the complete list of all bank accounts held by the entity including all currencies, all banking institutions, and all account types (current, deposit, loan, overdraft, foreign currency). Cross-reference to prior year bank accounts. Investigate any accounts closed during the year and verify proper accounting treatment.`,
            `(2) Prepare bank confirmation letters on the audit firm's letterhead addressed directly to each bank's confirmation department. Do NOT route through the client or use client letterhead. Each letter must request confirmation of: (a) all account balances as at [year-end date]; (b) all accounts held in the entity's name (to detect undisclosed accounts); (c) overdraft facilities — limit, amount drawn, security provided; (d) loan facilities — balance outstanding, interest rate, repayment terms, security/charges; (e) guarantees given by the bank on behalf of the entity; (f) securities or assets held by the bank on behalf of the entity; (g) any contingent liabilities known to the bank.`,
            `(3) Send confirmation letters directly to the bank. Follow up non-responses after 14 days. Agree confirmed balances to the entity's bank reconciliations. For any differences between confirmed balance and reconciliation balance, investigate and resolve — the standard reconciling items should be: outstanding lodgements (deposits in transit) and unpresented cheques only.`,
            `(4) For each bank reconciliation, verify: outstanding lodgements — trace each to the post-year-end bank statement (should clear within 3–5 business days; items outstanding >10 business days are exceptional and require explanation); unpresented cheques — trace each to the post-year-end bank statement (should clear within 30 days; items outstanding >60 days may indicate stale cheques or fictitious entries); investigate any reconciling items that do not fit these two categories — they may indicate fraud or error.`,
            `(5) Verify cash in hand by physical count (attend at year-end or on the first day of the audit with a rollback reconciliation). Count all petty cash floats and undeposited cash. Agree to the petty cash book balance. Investigate any shortfalls. Verify the entity has obtained a receipt for all petty cash payments > £${pm}.`,
          ],
          evidence: [
            'Bank confirmation letters (copies sent)',
            'Bank confirmation replies (originals)',
            'Bank reconciliations as at year-end',
            'Post-year-end bank statements (for outstanding items verification)',
            'Petty cash count sheets (signed)',
          ],
          sampleSize: 'All bank accounts (full population)',
          exceptionDefinition: 'Any bank account not confirmed or where the confirmed balance differs from the bank reconciliation for reasons other than normal outstanding lodgements/unpresented cheques.',
          riskRelevance: 'all',
        },
        {
          id: 'CASH-002',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 7 / FRS 102 s7',
          assertion: ['Accuracy', 'Completeness'],
          title: 'Bank Reconciliation Testing',
          objective: 'Verify the completeness and accuracy of the bank reconciliations and that all reconciling items are legitimate and clear within a reasonable timeframe.',
          steps: [
            `(1) Obtain the signed bank reconciliations for all accounts as at year-end. Agree the bank statement balance per each reconciliation to the bank confirmation letter (or bank statement). Agree the book balance per each reconciliation to the cash and bank nominal ledger account in the trial balance.`,
            `(2) For each reconciliation, obtain the post-year-end bank statement (covering at least 30 days post year-end). Trace every outstanding lodgement to the post-year-end bank statement. Record: the date it was paid in (should be within 5 business days for normal items), the amount agreed, and whether it matches. Flag any lodgements not appearing within 10 business days.`,
            `(3) For each unpresented cheque / outstanding BACS payment: trace to the post-year-end bank statement. Flag any payments not presented within 60 days (possible stale cheque, or cheque raised to create timing difference to inflate the apparent bank balance). Obtain explanation for any item > £${pm} outstanding for more than 60 days.`,
            `(4) Investigate any reconciling items that are not standard outstanding lodgements or unpresented cheques: errors or adjustments on the bank reconciliation must be examined and explained. Items such as 'bank errors', 'unallocated receipts', 'suspense items', or 'adjustments' are red flags for potential manipulation.`,
            `(5) Assess the completeness and accuracy of the bank reconciliation overall. Confirm the reconciliation was prepared by a person independent of the cashier/bank payment function and reviewed/signed by a manager. Document conclusion on whether cash and bank balances are fairly stated.`,
          ],
          evidence: [
            'Year-end bank reconciliations (signed)',
            'Post-year-end bank statements (30 days)',
            'Year-end bank statements',
            'Cash and bank nominal ledger accounts',
          ],
          sampleSize: 'All bank accounts (full population)',
          exceptionDefinition: 'Any bank reconciliation item that does not clear in post-year-end bank statements within a reasonable time frame, or any unusual reconciling item that cannot be explained.',
          riskRelevance: 'all',
        },
        {
          id: 'CASH-003',
          isaReference: 'ISA 500 / ISA 330',
          accountingStandard: 'IAS 7 / FRS 102 s7',
          assertion: ['Cutoff'],
          title: 'Cash Cut-off Testing',
          objective: 'Confirm that cash receipts and payments are recorded in the correct accounting period.',
          steps: [
            `(1) Obtain the cash book / bank nominal ledger for the last 5 business days of the period and the first 5 business days after year-end. Compare to the bank statement for the same period.`,
            `(2) For cash receipts: any receipt appearing on the bank statement before year-end should be in the cash book before year-end (cut-off breach if not). Any receipt on the bank statement after year-end but posted to the cash book before year-end — investigate as a potential overstatement of cash.`,
            `(3) For cash payments: any payment leaving the bank account before year-end should be posted in the cash book before year-end. Any payment posted pre-year-end but not cleared the bank until after year-end — verify the unpresented cheque treatment in the bank reconciliation.`,
            `(4) Cross-reference cash cut-off to revenue and trade debtor cut-off: ensure receipts from customers in the final days match invoices recorded in debtors (not recognised as revenue before the invoice was raised).`,
            `(5) Document exceptions and quantify the effect of any cut-off errors on cash and bank balances.`,
          ],
          evidence: [
            'Cash book / bank nominal ledger (final and opening 5 days)',
            'Bank statements (year-end and post-year-end)',
            'Bank reconciliation',
          ],
          sampleSize: 'Last 5 and first 5 business days of period',
          exceptionDefinition: 'Any cash item recorded in the wrong period resulting in misstatement of cash and bank balances > £' + pm,
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all CASH procedures, file bank confirmation replies' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review bank confirmations, review reconciliations, approve exceptions' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Confirm all bank accounts identified and confirmed' },
      ]),
      guidanceNotes: [
        'Bank confirmation letters must be sent by the audit firm directly — never allow the client to send or intercept them.',
        'Where a client has numerous bank accounts, consider whether a standard standing letter arrangement (SLA) with the bank is in place.',
        'For foreign currency accounts, verify the year-end exchange rate applied and agree to published rates (e.g., ECB or HMRC rates).',
        'Restricted cash (e.g., security deposits, escrow accounts) must be disclosed separately and excluded from unrestricted cash per IAS 7.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Perform surprise cash count.', 'Extend cut-off testing to 10 days either side of year-end.', 'Obtain confirmations from ALL banks including those holding security.']
        : ['Standard bank confirmation and reconciliation procedures are sufficient.'],
      evidenceChecklist: [
        '[ ] Bank confirmation letters sent to all institutions',
        '[ ] Bank confirmation replies received and filed',
        '[ ] All bank reconciliations agreed to confirmations',
        '[ ] Outstanding items traced to post-year-end statements',
        '[ ] Petty cash count performed',
        '[ ] Cut-off testing completed',
        '[ ] Foreign currency translation rates verified',
      ],
      smartAnalytics: [
        { type: 'analytics_benford', reason: "Apply to cash payments to detect round-number payments or patterns indicative of fraud" },
        { type: 'analytics_journal_entries', reason: 'Test manual journals to bank/cash accounts — high fraud risk area' },
      ],
    };
  }

  // ─── TRADE CREDITORS ───────────────────────────────────────────────────────

  _populateTradeCreditors(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Trade Creditors / Accounts Payable',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on creditors' },
        { ref: 'ISA 505', description: 'External confirmations — supplier statement reconciliation' },
        { ref: 'ISA 315', description: 'Understanding controls over purchase-to-pay cycle' },
      ],
      accountingStandards: [
        'IAS 37 Provisions, Contingent Liabilities and Contingent Assets',
        'IFRS 9 Financial Instruments',
        'FRS 102 Section 11 Basic Financial Instruments',
        'FRS 102 Section 21 Provisions',
      ],
      objectives: [
        'Confirm trade creditors are complete — no unrecorded liabilities',
        'Confirm trade creditors exist and represent genuine obligations',
        'Confirm creditors are accurately stated',
        'Confirm correct cut-off — liabilities for pre-year-end goods/services are included',
        'Confirm creditors are properly classified',
      ],
      assertions: ['Completeness', 'Existence', 'Accuracy', 'Cutoff', 'Classification'],
      procedures: [
        {
          id: 'TCR-001',
          isaReference: 'ISA 500 para 7 / ISA 530',
          accountingStandard: 'IFRS 9 / FRS 102 s11',
          assertion: ['Existence', 'Accuracy', 'Occurrence'],
          title: 'Purchase Invoice Sample Testing',
          objective: 'Verify that recorded trade creditor balances represent genuine, accurately valued obligations for goods or services received.',
          steps: [
            `(1) Obtain the purchase ledger / trade creditors listing as at year-end. Cast the listing and agree the total to the trade creditors balance in the trial balance. Agree to the purchase ledger control account.`,
            `(2) Select a sample: all individual supplier balances > £${m} (mandatory), plus a random sample of smaller balances to bring total to ${ss} items. For each sampled creditor balance, obtain a breakdown of the individual invoices comprising the balance.`,
            `(3) For each invoice within the sampled creditor balance: obtain the original purchase invoice; obtain the corresponding purchase order (verify authorisation); obtain the goods received note (GRN) confirming physical receipt of goods or services acceptance documentation. Verify three-way match: PO quantity and price = GRN quantity = Invoice quantity and price.`,
            `(4) For each invoice, verify: the invoice date is within the period (or correctly accrued if received after year-end for pre-year-end goods); the amount on the invoice matches the purchase ledger; the invoice is addressed to the entity; VAT treatment is correct.`,
            `(5) Summarise exceptions on the testing schedule. Calculate total tested and exception rate. Conclude on whether the creditors balance is free from material misstatement of existence or accuracy.`,
          ],
          evidence: [
            'Purchase ledger / creditors listing agreed to TB',
            'Purchase invoices for sampled items',
            'Purchase orders (authorised)',
            'Goods received notes',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any invoice in the purchase ledger without a corresponding PO and GRN, or where the amount recorded differs from the purchase invoice by > £' + pm,
          riskRelevance: 'all',
        },
        {
          id: 'TCR-002',
          isaReference: 'ISA 505 / ISA 330',
          accountingStandard: 'IFRS 9 / FRS 102 s11',
          assertion: ['Completeness', 'Accuracy'],
          title: 'Supplier Statement Reconciliation',
          objective: "Reconcile supplier statements to the entity's purchase ledger to identify unrecorded invoices, disputed items, or timing differences.",
          steps: [
            `(1) Identify major suppliers: select the top 20 suppliers by total annual spend, all suppliers with a year-end balance > £${m}, and any suppliers where the purchase ledger shows a nil or credit balance (unusual — may indicate unrecorded invoices or unrecorded credits). Request supplier statements from each supplier directly where possible (request from supplier, not via client).`,
            `(2) For each supplier statement obtained: reconcile the statement balance to the purchase ledger balance as at year-end. Categorise each reconciling difference: (a) unrecorded invoices on statement but not on purchase ledger — potential understatement of creditors; investigate and post if valid; (b) invoices on purchase ledger but not on statement — investigate whether these are disputed or duplicated; (c) payments in transit — entity has paid but bank debit not yet reflected on supplier statement — verify payment in bank statement; (d) invoices in transit — supplier has raised but entity has not received — verify receipt/accrual.`,
            `(3) For any unrecorded invoices identified on supplier statements: obtain the original invoice. Verify whether goods/services were received before year-end. If so, determine whether (a) an accrual exists in the accounts or (b) the invoice should be posted to trade creditors. Assess materiality and raise audit difference if required.`,
            `(4) For any supplier from whom a statement cannot be obtained: apply alternative procedures — agree the purchase ledger balance to the most recent purchase invoices and GRNs; review post-year-end payments to the supplier and verify they relate to pre-year-end invoices.`,
            `(5) Document the supplier statement reconciliation working papers. Record for each supplier: statement balance, purchase ledger balance, reconciling items, conclusion. Note any recurring suppliers with persistent unexplained differences — this may indicate a control weakness.`,
          ],
          evidence: [
            'Supplier statements (originals)',
            'Purchase ledger balances by supplier',
            'Bank statements (payment evidence)',
            'Purchase invoices for unrecorded items found',
          ],
          sampleSize: 'Top 20 suppliers by spend + all balances > £' + m,
          exceptionDefinition: 'Any unrecorded invoice on a supplier statement that represents a genuine pre-year-end liability > £' + pm + ' not accrued in the financial statements.',
          riskRelevance: 'all',
        },
        {
          id: 'TCR-003',
          isaReference: 'ISA 500 / ISA 330',
          accountingStandard: 'IAS 37 / FRS 102 s21',
          assertion: ['Completeness', 'Cutoff'],
          title: 'Search for Unrecorded Liabilities (SUL)',
          objective: 'Identify liabilities that existed at year-end but have not been recorded in the financial statements.',
          steps: [
            `(1) Review cash payments made in the 30–45 days after year-end for items potentially relating to pre-year-end goods or services. For each payment > £${pm}: obtain the invoice and assess whether the goods/services were received before year-end. If so, verify whether a creditor or accrual was recorded at year-end. Raise an audit difference for any payment relating to pre-year-end obligations that was not accrued.`,
            `(2) Review purchase invoices received by the entity in the first 30 days post-year-end that are dated before year-end: for each invoice > £${pm}, verify whether it was correctly recorded as a creditor or accrual at year-end. If not, quantify as a potential understatement. Also review invoices dated post-year-end but for services that span the year-end period (e.g., insurance, rent, utilities) — verify appropriate time-apportionment accrual.`,
            `(3) Inspect goods received notes (GRNs) for goods delivered before year-end: obtain the GRN log for the 10 business days before year-end. For any GRN without a matching posted purchase invoice — verify whether a creditor accrual (goods received not invoiced — GRNI) has been recorded. Agree total GRNI accrual to the outstanding GRN list.`,
            `(4) Enquire of management and review board minutes: ask specifically whether management is aware of any liabilities at year-end not yet invoiced (e.g., professional fees, bonuses, pension contributions, utility bills, maintenance contracts). Review board minutes for discussion of known commitments or contractual obligations. Review any significant contracts for accrual provisions.`,
            `(5) Perform analytical review of the accruals balance: compare the year-end accruals total to prior year and to the current year expense run rate (accruals should be approximately 1/12 of annual costs for monthly expenses). Any significant reduction in accruals vs. prior year in the absence of a business explanation is a potential indicator of understatement of liabilities. Investigate and document.`,
          ],
          evidence: [
            'Post-year-end payments (30–45 days) with invoices',
            'Post-year-end invoices dated before year-end',
            'GRN log for last 10 business days pre-year-end',
            'Board minutes (year-end and post-year-end)',
            'Accruals schedule (current and prior year)',
          ],
          sampleSize: 'All post-year-end payments > £' + pm + ' (first 45 days)',
          exceptionDefinition: 'Any pre-year-end obligation > £' + pm + ' not recorded as a creditor or accrual in the financial statements at year-end.',
          riskRelevance: 'all',
        },
        {
          id: 'TCR-004',
          isaReference: 'ISA 315 / ISA 330',
          accountingStandard: 'IFRS 9 / FRS 102 s11',
          assertion: ['Completeness', 'Accuracy', 'Occurrence'],
          title: 'Three-Way Match Testing',
          objective: 'Test the purchase-to-pay control by verifying the three-way match between purchase orders, goods received notes, and purchase invoices.',
          steps: [
            `(1) Select a sample of ${ss} purchase invoices posted in the period, stratified by value (top 20% by value selected individually, remainder by systematic sampling). For each selected invoice, obtain: (a) the corresponding purchase order (PO); (b) the goods received note (GRN) or services acceptance confirmation; (c) the purchase invoice.`,
            `(2) Perform the three-way match for each sample item: Verify PO authorisation — is the PO signed by an authorised person within the appropriate approval limit? Verify quantity agreement — GRN quantity = PO quantity = Invoice quantity (within agreed tolerance). Verify price agreement — Invoice price = PO price (within ±5% tolerance or agreed variation order). Verify supplier — invoice supplier matches PO supplier.`,
            `(3) Flag exceptions and classify: (a) Invoice without PO — potential unauthorised purchase; obtain management explanation and assess adequacy of internal controls; (b) Invoice without GRN — potential fictitious invoice or goods/services not yet received; (c) Price variance > 5% between PO and invoice without a change order — potential overbilling; (d) Quantity variance — potential short delivery or over-invoicing.`,
            `(4) For each exception: obtain management's explanation; assess whether the exception represents a one-off breakdown or a systemic control weakness. If systemic, expand the sample size and consider whether internal control reliance should be modified in the audit approach.`,
            `(5) Conclude on the effectiveness of the three-way match control and the completeness and accuracy of trade creditors. Document any control deficiencies identified for communication to management (ISA 265 significant deficiencies).`,
          ],
          evidence: [
            'Sample purchase invoices',
            'Corresponding purchase orders (signed)',
            'Goods received notes / services acceptance records',
            'Exception schedule with management explanations',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any invoice without an authorised PO, any invoice without a GRN, or any price/quantity variance > 5% between PO and invoice without an approved change order.',
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all TCR procedures, document SUL results' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review supplier reconciliations, review SUL, approve exceptions' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review completeness conclusion and significant payables' },
      ]),
      guidanceNotes: [
        'The primary assertion risk for trade creditors is COMPLETENESS — focus procedures on finding unrecorded liabilities rather than testing what is already recorded.',
        'Analytical review of accruals is a highly effective procedure for identifying understated liabilities — a sudden reduction in accruals without explanation is a significant red flag.',
        'Consider whether the entity has any liabilities that might be reclassified as provisions (IAS 37) — uncertain timing or amount does not make them trade creditors.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Extend SUL to 60 days post-year-end.', 'Increase supplier statement reconciliation coverage.', 'Perform detailed review of all accruals vs prior year.']
        : ['Standard SUL and supplier reconciliation procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] Purchase ledger agreed to TB',
        '[ ] Supplier statements obtained and reconciled',
        '[ ] SUL procedures performed (45-day post-year-end review)',
        '[ ] GRN log reviewed for unrecorded liabilities',
        '[ ] Three-way match testing completed',
        '[ ] Accruals analytical review performed',
        '[ ] Board minutes reviewed for commitments',
      ],
      smartAnalytics: [
        { type: 'analytics_benford', reason: "Apply to purchase invoices — detect split transactions, fictitious amounts, and duplicate payments" },
        { type: 'analytics_related_parties', reason: 'Detect payments to related parties or connected persons in purchase ledger' },
        { type: 'analytics_regression', reason: 'Predict expected accruals based on run-rate expenses and compare to actual' },
      ],
    };
  }

  // ─── PROVISIONS ────────────────────────────────────────────────────────────

  _populateProvisions(context) {
    const { m, pm, _ss } = this._fmt(context);
    return {
      title: 'Provisions and Contingent Liabilities',
      isaReferences: [
        { ref: 'ISA 540 paras 8–21', description: 'Auditing accounting estimates — provisions involve significant estimation' },
        { ref: 'ISA 501 para 9', description: 'Litigation and claims — legal confirmation procedures' },
        { ref: 'ISA 580', description: 'Written representations on provisions and contingencies' },
      ],
      accountingStandards: [
        'IAS 37 Provisions, Contingent Liabilities and Contingent Assets',
        'FRS 102 Section 21 Provisions and Contingencies',
        'IAS 8 Accounting Policies, Changes in Estimates',
      ],
      objectives: [
        'Confirm all provisions are recognised where there is a present obligation, probable outflow, and reliable estimate',
        'Confirm provisions are measured at the best estimate of expenditure required to settle',
        'Confirm contingent liabilities are disclosed where outflow is possible but not probable',
        'Confirm no provisions are recognised for future losses without a present obligation (prohibited by IAS 37)',
      ],
      assertions: ['Completeness', 'Valuation', 'Existence', 'Disclosure'],
      procedures: [
        {
          id: 'PROV-001',
          isaReference: 'ISA 540 para 8 / ISA 500',
          accountingStandard: 'IAS 37 paras 14–36 / FRS 102 s21',
          assertion: ['Existence', 'Completeness', 'Valuation'],
          title: 'Management Provisions Schedule Review',
          objective: 'Verify the completeness and accuracy of all provisions recognised, including the movement table.',
          steps: [
            `(1) Obtain management's provisions schedule showing all provisions: opening balance, new provisions in year, provisions utilised, provisions released, unwinding of discount (if applicable), closing balance. Agree closing balances to trial balance for each provision category. Cast and cross-check the movement table.`,
            `(2) For each provision, verify IAS 37 para 14 three-fold recognition criteria: (a) Present obligation — the entity has a legal or constructive obligation arising from a past event. Review the underlying event; (b) Probable outflow — it is more likely than not (>50%) that an outflow of economic benefits will occur; (c) Reliable estimate — the amount can be reliably estimated. Document the basis for each criterion being met. If any criterion is not met, the provision should not be recognised (or should be a contingent liability disclosure).`,
            `(3) For prior-year provisions: trace through the movement — verify each utilisation amount is supported by actual payments or settlement documentation; verify each release is supported by a change in circumstances (obligation no longer probable). Specifically investigate provisions released close to year-end that could indicate earnings management — obtain management's explanation and assess whether release was appropriate.`,
            `(4) Verify the measurement of each provision at the 'best estimate': for warranty provisions — obtain historical claims rate data and projected claims; for restructuring — obtain board-approved restructuring plan and cost schedule; for legal provisions — obtain legal counsel assessment; for onerous contracts — obtain contract and cost-to-complete schedule. Re-perform or challenge the calculation. Assess whether the estimate is conservative, mid-point, or aggressive.`,
            `(5) Review for completeness of provisions: consider whether any of the following require a provision that is not included: (a) pending litigation or claims (cross-reference to legal confirmation results); (b) warranty obligations on products sold; (c) decommissioning or restoration obligations; (d) onerous contracts (where unavoidable costs exceed economic benefits); (e) restructuring (where formal plan exists and announced). Document assessment for each.`,
          ],
          evidence: [
            'Provisions movement schedule',
            'Supporting calculations for each provision',
            'Board minutes approving provisions',
            'Prior year provisions schedule (for opening balance agreement)',
          ],
          sampleSize: 'All individually material provisions (> £' + m + '); overview of smaller provisions',
          exceptionDefinition: 'Any provision where the IAS 37 recognition criteria are not met, or where the measurement is not based on the best estimate and the difference is > £' + pm,
          riskRelevance: 'all',
        },
        {
          id: 'PROV-002',
          isaReference: 'ISA 501 para 9',
          accountingStandard: 'IAS 37 paras 86–92 / FRS 102 s21.11',
          assertion: ['Completeness', 'Valuation', 'Disclosure'],
          title: 'Legal Confirmation Letters',
          objective: "Obtain independent confirmation from the entity's lawyers of all pending legal matters and their assessment of likely outcomes.",
          steps: [
            `(1) Obtain management's list of all current and pending legal cases, regulatory investigations, employment tribunal claims, and other litigation involving the entity. Obtain the client's authorisation to contact their lawyers directly.`,
            `(2) Prepare legal confirmation letters addressed directly to each law firm acting for the entity. Requests must ask: (a) all legal matters of which they are aware as at [year-end date]; (b) an assessment of the likely outcome and probability of an adverse result; (c) an estimate of the potential financial exposure or loss range; (d) any material developments between year-end and the date of signing the letter.`,
            `(3) Send letters directly to law firms. Follow up non-responses after 21 days. Agree lawyer responses to management's provisions schedule. For any cases where lawyer's assessment of probable loss exceeds the provision held — quantify the difference and raise audit difference. For cases where lawyer assessment is 'possible' (not probable) — verify disclosed as contingent liability.`,
            `(4) Enquire of management whether there are any legal matters handled internally (not by external lawyers) or where lawyers have been engaged but not notified to the auditor. Review board minutes, insurance correspondence, and management accounts for references to legal or regulatory matters. Cross-reference to any regulatory filings (if applicable — FCA, CQC, Environment Agency, etc.).`,
            `(5) Assess the adequacy of financial statements disclosures for contingencies: IAS 37 para 86 requires disclosure of the nature of the obligation, an estimate of financial effect, and indication of uncertainties. For matters where the entity invokes the 'seriously prejudicial' exemption from disclosure, assess whether the exemption is genuinely applicable and document conclusion.`,
          ],
          evidence: [
            'Management list of legal matters',
            'Legal confirmation request letters (copies)',
            'Signed legal confirmation replies from lawyers (originals)',
            'Board minutes references to legal matters',
            'Insurance schedule (to identify insured matters)',
          ],
          sampleSize: 'All law firms acting for the entity at year-end',
          exceptionDefinition: "Any legal matter where lawyer's assessment of probable loss exceeds the provision held by > £" + pm + ", or any matter not disclosed as a contingent liability where probability of outflow is > remote.",
          riskRelevance: 'all',
        },
        {
          id: 'PROV-003',
          isaReference: 'ISA 540 paras 8–21',
          accountingStandard: 'IAS 37 / IAS 8 / FRS 102 s21',
          assertion: ['Valuation'],
          title: 'Estimation Uncertainty Assessment (ISA 540)',
          objective: 'Assess and respond to the estimation uncertainty inherent in all material provisions.',
          steps: [
            `(1) Identify all provisions that involve significant management judgement or estimation: warranty provisions, legal provisions, restructuring provisions, onerous contract provisions, decommissioning provisions, environmental provisions. For each, assess the level of estimation uncertainty: LOW (outcome and amount highly predictable, based on historical data with low variance), MODERATE (some uncertainty in outcome or amount), HIGH (significant uncertainty — wide range of possible outcomes).`,
            `(2) For HIGH uncertainty provisions: apply enhanced ISA 540 procedures. Develop an independent range of outcomes using alternative assumptions. Compare management's point estimate to the auditor's range. Assess whether management's estimate is within, at the edge of, or outside the auditor's reasonable range. If outside, the difference is a likely misstatement.`,
            `(3) For warranty provisions: obtain the warranty terms in the product/service contracts. Obtain 3 years of historical warranty claims data by product line — claims rate (% of revenue), average claims cost. Verify management's provision rate reflects the historical claims rate, adjusted for: changes in product quality, changes in product mix, changes in warranty terms, current economic conditions affecting customers' propensity to claim. Re-perform the calculation: Revenue in warranty period × Claims rate % × Average cost per claim = Provision.`,
            `(4) Assess whether management has any incentive to bias the estimate: provisions can be used to 'smooth' earnings — a large provision in a good year can be released in a poor year. Specifically examine: provisions that exactly offset other unusual gains; provisions released in periods where profits are below target; provisions that are consistently either fully used or fully released (suggesting they are set to be reversed rather than genuinely estimated).`,
            `(5) Evaluate adequacy of disclosures under IAS 37 para 84–89: provision movement table (opening, charged, utilised, released, closing); description of obligation and expected timing; key assumptions and sensitivities for high-uncertainty provisions; contingent liabilities (possible obligations). Review draft financial statements and assess whether disclosures are informative and complete.`,
          ],
          evidence: [
            'Provisions calculation workings for each material provision',
            'Historical claims/utilisation data',
            'Sensitivity analysis (auditor-prepared or management-provided)',
            'Draft financial statements — provisions note',
          ],
          sampleSize: 'All provisions classified as HIGH uncertainty; overview of MODERATE and LOW',
          exceptionDefinition: "Management's estimate falls outside the auditor's independently determined reasonable range by > £" + pm + ", or disclosure is insufficient to allow users to understand the estimation uncertainty.",
          riskRelevance: 'high',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all PROV procedures, file legal confirmation replies' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review legal confirmations, assess estimation uncertainty' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review all significant provisions and contingent liabilities; approve disclosure adequacy' },
      ]),
      guidanceNotes: [
        'Legal confirmation letters must be sent by the audit firm directly to the law firm — the client should not handle them.',
        'A provision must not be recognised for future operating losses — this is prohibited by IAS 37 para 63.',
        'Where a provision involves significant estimation uncertainty, ensure the requirement for a sensitivity analysis disclosure is discussed with management.',
        'For first-year audits, review the prior year provisions for appropriateness — misstatements in opening provisions affect current year P&L.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Engage internal specialist (actuary, engineer) to independently assess significant provisions.', 'Extend legal confirmation procedures to all lawyers, including those handling routine matters.']
        : ['Focus on high-uncertainty provisions and legal matters.'],
      evidenceChecklist: [
        '[ ] Provisions movement schedule agreed to TB',
        '[ ] IAS 37 recognition criteria assessed for each provision',
        '[ ] Legal confirmation letters sent and replies filed',
        '[ ] Warranty/other provision calculations re-performed',
        '[ ] Prior year provision releases investigated',
        '[ ] Contingent liability disclosures reviewed',
      ],
      smartAnalytics: [
        { type: 'analytics_zscore', reason: 'Altman Z-Score assesses financial distress probability — relevant context for going concern provisions' },
        { type: 'analytics_mscore', reason: 'Beneish M-Score detects potential earnings manipulation including provision manipulation' },
      ],
    };
  }

  // ─── PAYROLL ───────────────────────────────────────────────────────────────

  _populatePayroll(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Payroll and Employee Costs',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on payroll' },
        { ref: 'ISA 240', description: 'Fraud risk — ghost employees, fictitious payroll' },
        { ref: 'ISA 550', description: 'Related parties — directors remuneration' },
        { ref: 'ISA 540', description: 'Estimates — IAS 19 employee benefits' },
      ],
      accountingStandards: [
        'IAS 19 Employee Benefits',
        'FRS 102 Section 28 Employee Benefits',
        'IAS 24 Related Party Disclosures (directors remuneration)',
        'CA 2006 s412 Directors Remuneration Disclosure',
      ],
      objectives: [
        'Confirm payroll costs are accurate and relate to genuine employees',
        'Confirm PAYE/NIC compliance',
        'Confirm employee benefit obligations are accurately accrued',
        'Confirm directors remuneration is properly disclosed',
        'Confirm no ghost employees or fictitious payroll entries',
      ],
      assertions: ['Occurrence', 'Completeness', 'Accuracy', 'Cutoff'],
      procedures: [
        {
          id: 'PAYROLL-001',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 19 / FRS 102 s28',
          assertion: ['Accuracy', 'Completeness', 'Occurrence'],
          title: 'Gross Payroll Reconciliation',
          objective: 'Verify the accuracy of total payroll costs by reconciling to HMRC RTI submissions and re-performing key calculations.',
          steps: [
            `(1) Obtain the employer's P35 or RTI full payment submissions (FPS) to HMRC for the year. Agree total gross pay per RTI submissions to total gross pay per payroll records. Agree total PAYE and employee NIC deducted per RTI to payroll records. Agree total employer NIC per RTI to payroll records. Investigate any differences — note that the RTI must match the payroll records exactly as HMRC will flag discrepancies.`,
            `(2) Select a sample of ${ss} employees across a minimum of 3 months (including the year-end month, a mid-year month, and a peak month if applicable). For each selected employee-month: cast the payroll for that month; agree individual gross pay breakdown — (a) basic salary: agree to the signed employment contract (verify current contract on file — check for variations); (b) overtime: agree to authorised overtime timesheets; (c) bonus/commission: agree to board-approved bonus schedule or commission agreement; (d) benefits in kind: verify any taxable benefits are coded correctly.`,
            `(3) Re-perform PAYE and NIC calculations for the sampled employees: obtain HMRC PAYE tax tables for the tax year; agree tax code to P60 / latest P9 coding notice; recalculate PAYE = (Gross pay annualised − Personal allowance) × tax rate − tax already paid in year. Recalculate Class 1 employee NIC: Primary Threshold (£12,570 p.a. for 2023/24) and Upper Earnings Limit (£50,270). Compare to payroll deductions. Investigate variances.`,
            `(4) Agree HMRC PAYE settlement: agree total PAYE/NIC per the employer payment summary (EPS) for each tax month to the PAYE creditor account on the balance sheet. Verify HMRC payments are made on time (19th of month if paper, 22nd if electronic) — late payments attract penalties and interest which should be accrued. Agree year-end PAYE liability on balance sheet to the final month's RTI submission.`,
            `(5) Reconcile the year-end payroll accruals: (a) holiday pay accrual — obtain HR records of untaken holiday at year-end, multiply by daily pay rate per employee; agree total to accrual in accounts; (b) bonus accrual — agree to board minutes approving bonus and individual schedules; (c) pension accrual — verify employer contributions due but not yet paid; agree to pension schedule. Agree all accruals to trial balance. Document conclusion on completeness and accuracy of payroll costs.`,
          ],
          evidence: [
            'RTI Full Payment Submissions (FPS) for the year',
            'Payroll records (monthly payslips or payroll run reports)',
            'Employment contracts for sampled employees',
            'Overtime authorisation timesheets',
            'Board-approved bonus schedule',
            'HMRC PAYE payment evidence (bank statements)',
            'Holiday pay accrual calculation',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any employee where recalculated PAYE or NIC differs from payroll by > £50 per employee, or any bonus/overtime payment lacking authorisation, or any HMRC payment made late.',
          riskRelevance: 'all',
        },
        {
          id: 'PAYROLL-002',
          isaReference: 'ISA 240 paras 32–33',
          accountingStandard: 'IAS 19 / FRS 102 s28',
          assertion: ['Occurrence', 'Accuracy'],
          title: 'Joiner / Leaver Testing and Ghost Employee Detection',
          objective: 'Verify that payroll contains only genuine current employees and that starters and leavers are processed correctly.',
          steps: [
            `(1) Obtain from HR: the complete joiners list (employees who started during the year) and leavers list (employees who left during the year), with names, employee IDs, start/leaving dates, and pay rates. Agree totals to payroll records. The year-end headcount per payroll must reconcile to year-end headcount per HR records — document any unexplained differences.`,
            `(2) For leavers: select a sample of ${Math.ceil(ss / 2)} leavers. For each: (a) verify the final salary payment date corresponds to the last working day or contractual notice period end date; (b) verify the employee was removed from payroll from the correct date (no payments after the leaving date); (c) inspect the leaver form and P45 issued; (d) investigate any payments made after the leaving date — obtain management explanation and verify whether a contractual obligation (notice pay, gardening leave, settlement) justifies the payment.`,
            `(3) For joiners: select a sample of ${Math.ceil(ss / 2)} joiners. For each: (a) verify the first payment on payroll corresponds to the employment start date in the offer letter/contract; (b) verify a P45 from previous employer was obtained (or emergency tax code applied and reason documented); (c) verify a signed employment contract is on file; (d) verify the pay rate on payroll matches the contract; (e) verify the employee was set up with appropriate HR authorisation.`,
            `(4) Ghost employee test — completeness and existence: (a) from the year-end payroll, select a random sample of 20 employees currently on payroll; (b) for each, inspect the physical or electronic HR file — verify a signed employment contract exists; verify the pay rate on payroll matches the contract; verify a National Insurance number is recorded and appears plausible; (c) for a sub-sample, verify the employee actually works at the entity (reference to swipe card records, IT access logs, or manager confirmation); (d) agree the bank account details for payment to a separate HR-held record (segregation of duties test — payroll administrator should not maintain bank details).`,
            `(5) Verify headcount reconciliation: agree year-end headcount per payroll to HR records. Agree total wage cost per payroll to nominal ledger wages account. Perform an analytical review: average wage cost per employee × headcount = expected total wages. Compare to actual total wages in the P&L. Investigate variances > 10% or £${m}. Document conclusion on existence and completeness of payroll.`,
          ],
          evidence: [
            'HR joiners and leavers lists',
            'Employment contracts for sampled employees',
            'Payroll records showing first/last payment dates',
            'P45s issued to leavers',
            'Ghost employee test — HR file inspection notes',
            'Bank detail confirmation (HR-maintained vs payroll)',
          ],
          sampleSize: ss + ' employees (split between joiners, leavers, and continuing)',
          exceptionDefinition: 'Any payment made after an employee leaving date without contractual justification, any employee on payroll without a signed employment contract, or any ghost employee indicator (no HR file, bank details set by payroll admin, no NI number).',
          riskRelevance: 'all',
        },
        {
          id: 'PAYROLL-003',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IAS 19 paras 7–153 / FRS 102 s28',
          assertion: ['Valuation', 'Completeness'],
          title: 'IAS 19 / FRS 102 s28 Employee Benefits',
          objective: 'Verify the completeness and accuracy of employee benefit obligations including pensions, holiday pay, and long-term employee benefits.',
          steps: [
            `(1) Identify all employee benefit obligations: defined contribution pensions, defined benefit pensions, holiday pay, long-service awards, medical/insurance benefits, share-based payments (IFRS 2). Agree each to the balance sheet and P&L.`,
            `(2) For defined contribution pensions: verify contributions payable at year-end agree to the pension schedule (employer contribution rate × pensionable pay × employees enrolled). Agree to a recent pension statement. Verify any outstanding contributions at year-end are accrued. Verify pension provider regulatory compliance (auto-enrolment obligations).`,
            `(3) For defined benefit pension schemes: obtain the most recent actuarial valuation (typically triennial, with annual updates). Verify the net pension liability/asset recorded in the balance sheet agrees to the IAS 19 actuarial report. Challenge key actuarial assumptions: discount rate (AA corporate bond yield), inflation rate (RPI/CPI), mortality rates. Assess whether assumptions are within a reasonable range by comparison to industry benchmarks.`,
            `(4) Holiday pay accrual: obtain HR's calculation of untaken holiday at year-end per employee. Verify the daily rate used is the correct rate under Working Time Regulations (including regular overtime, commission, and other elements required by case law post-Bear Scotland judgment). Re-perform the total accrual for a sample of employees. Agree total to balance sheet accrual.`,
            `(5) Verify IAS 19 disclosures (for defined benefit schemes): expected benefit payments for next 5+ years; weighted average duration of obligation; actuarial assumptions used (and sensitivity analysis); breakdown of plan assets by category; reconciliation of defined benefit obligation and plan assets.`,
          ],
          evidence: [
            'Pension contribution schedule',
            'IAS 19 actuarial report (for DB schemes)',
            'HR holiday pay accrual calculation',
            'Pension fund accounts (if available)',
          ],
          sampleSize: 'All material employee benefit categories',
          exceptionDefinition: 'Any pension accrual understated by > £' + pm + ', or defined benefit obligation/asset differing from IAS 19 actuarial report without explanation.',
          riskRelevance: 'medium',
        },
        {
          id: 'PAYROLL-004',
          isaReference: 'ISA 550 / ISA 500',
          accountingStandard: 'IAS 24 / CA 2006 s412',
          assertion: ['Accuracy', 'Disclosure'],
          title: "Directors' Remuneration Disclosure",
          objective: "Verify that directors' remuneration is accurately stated and fully disclosed in accordance with the Companies Act 2006 and applicable accounting standards.",
          steps: [
            `(1) Obtain the complete directors' remuneration schedule for the year: list each director, their remuneration components (salary, fees, bonus, benefits in kind, pension contributions, share-based payments, compensation for loss of office). Cast and cross-check the schedule.`,
            `(2) Agree each director's total remuneration to payroll records, P60, and/or board minutes approving the remuneration. For directors who are also shareholders receiving dividends, ensure dividends are not disguised as salary (and vice versa) — verify the correct classification and tax treatment.`,
            `(3) Verify the disclosure in the financial statements: for all companies — aggregate directors' emoluments, aggregate pension contributions, and identification of the highest-paid director; for quoted companies — full directors' remuneration report requirements. Compare to draft financial statements. Identify any understatements or omissions.`,
            `(4) For any loans to directors or connected persons: obtain details and verify Companies Act compliance. Under CA 2006 s197–214, loans to directors >£10,000 require shareholder approval (for public companies, always; for private companies where applicable). Verify interest rate is at least official rate (or imputed benefit in kind arises). Agree balance to intercompany/related party schedule.`,
            `(5) Obtain a specific management representation confirming completeness of directors' remuneration disclosure and that all transactions with directors have been disclosed.`,
          ],
          evidence: [
            "Directors' remuneration schedule",
            'Payroll records / P60s for directors',
            'Board minutes approving remuneration',
            'Draft financial statements — directors remuneration note',
            'Loans to directors documentation (if applicable)',
          ],
          sampleSize: 'All directors (full population)',
          exceptionDefinition: "Any director's remuneration misstated by > £" + pm + " or any omission from the directors' remuneration disclosure.",
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all PAYROLL procedures, document exceptions' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review ghost employee test, directors remuneration disclosure' },
        { role: 'Partner', timing: 'Before sign-off', requirement: "Review directors' remuneration disclosure completeness" },
      ]),
      guidanceNotes: [
        "The ghost employee fraud risk is significant in payroll. Always check that payroll bank accounts are maintained by HR and not by the payroll administrator.",
        'For businesses with high staff turnover (retail, hospitality), the joiner/leaver sample may need to be increased.',
        'IR35 / off-payroll working rules: for entities using contractors, assess whether any should be treated as employees for tax purposes.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Extend ghost employee testing to 50 employees.', 'Perform data analytics across full payroll population to identify anomalies (duplicate NI numbers, bank account mismatches).']
        : ['Standard sample procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] RTI submissions agreed to payroll records',
        '[ ] Sample payroll re-performed',
        '[ ] Joiners and leavers tested',
        '[ ] Ghost employee test completed',
        '[ ] Holiday pay accrual verified',
        "[ ] Directors' remuneration disclosure reviewed",
        '[ ] Pension contributions verified',
      ],
      smartAnalytics: [
        { type: 'analytics_benford', reason: 'Apply to salary amounts and payment values to detect ghost employees or manipulation' },
        { type: 'analytics_journal_entries', reason: 'Journal entry testing on payroll journals — high-risk area for override' },
      ],
    };
  }

  // ─── TAX ───────────────────────────────────────────────────────────────────

  _populateTax(context) {
    const { _m, pm, _ss } = this._fmt(context);
    return {
      title: 'Taxation (Current and Deferred)',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on tax balances' },
        { ref: 'ISA 540', description: 'Accounting estimates — deferred tax, uncertain tax positions' },
        { ref: 'ISA 580', description: 'Representations on tax positions and open enquiries' },
      ],
      accountingStandards: [
        'IAS 12 Income Taxes',
        'FRS 102 Section 29 Income Tax',
        'IFRIC 23 Uncertainty over Income Tax Treatments',
        'TCGA 1992 / CTA 2009 / CTA 2010 (UK corporation tax)',
      ],
      objectives: [
        'Confirm the current tax charge and creditor are accurately stated',
        'Confirm deferred tax is recognised on all material temporary differences',
        'Confirm deferred tax assets are only recognised to the extent recovery is probable',
        'Confirm uncertain tax positions are adequately provided or disclosed',
      ],
      assertions: ['Accuracy', 'Completeness', 'Valuation'],
      procedures: [
        {
          id: 'TAX-001',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 12 paras 46–57 / FRS 102 s29 / CTA 2009',
          assertion: ['Accuracy', 'Completeness'],
          title: 'Corporation Tax Computation Review',
          objective: 'Verify the accuracy of the current year corporation tax computation and ensure the current tax charge and liability are correctly stated.',
          steps: [
            `(1) Obtain the corporation tax computation (or draft computation if not yet finalised). Agree the profit before tax per the computation to the profit before tax per the financial statements. The starting point of the computation must agree to the financial statements — investigate any differences.`,
            `(2) Review all permanent differences (add-backs and deductions): (a) disallowable expenditure — verify entertaining (s1298 CTA 2009: disallowed), fines/penalties (s1304: disallowed), depreciation (add back — capital allowances claimed instead), legal costs relating to capital items (disallowed); (b) exempt income — verify dividends received from qualifying companies (exempt per CTA 2009 Part 9A), group relief received (if applicable); (c) any specific statutory adjustments relevant to the entity's industry.`,
            `(3) Verify capital allowances: agree annual investment allowance (AIA) claims to the additions schedule (verify additions qualify — not cars over threshold, not integral features unless s38B applies); verify first-year allowance (FYA) claims for qualifying items; re-perform writing down allowance (WDA) on main pool (18%) and special rate pool (6%); verify any short life asset elections are appropriate; agree pool closing balances to prior year computation.`,
            `(4) Agree the tax charge per computation to the P&L income tax line. Verify the closing current tax creditor: opening current tax creditor + charge in P&L − tax payments made = closing current tax creditor. Agree closing creditor to balance sheet. Verify HMRC tax payments have been made on time (large companies: quarterly instalment payments; small companies: 9 months and 1 day after year-end).`,
            `(5) For groups: verify group relief claims — obtain signed consent form from the surrendering company; agree surrendered loss to surrendering company's computation; verify the claim is within the statutory time limit; verify intercompany consideration for group relief is correctly treated. For R&D tax credits: verify the qualifying R&D expenditure is identified and documented; re-perform the enhanced deduction or credit calculation; agree to HMRC claim submitted.`,
          ],
          evidence: [
            'Corporation tax computation (draft or final)',
            'Capital allowances schedules (main pool, special rate pool)',
            'Tax payment evidence (bank statements)',
            'Group relief consent forms (if applicable)',
            'R&D tax credit claim and supporting documentation (if applicable)',
          ],
          sampleSize: 'Full review of tax computation',
          exceptionDefinition: 'Any permanent difference incorrectly treated resulting in tax misstatement > £' + pm + ', or any capital allowances claim that appears unsupported or incorrect.',
          riskRelevance: 'all',
        },
        {
          id: 'TAX-002',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IAS 12 paras 15–45 / FRS 102 s29.9–29.22',
          assertion: ['Accuracy', 'Completeness', 'Valuation'],
          title: 'Deferred Tax Calculation (IAS 12 / FRS 102 s29)',
          objective: 'Verify the deferred tax balance is accurately calculated on all material temporary differences at the appropriate tax rate.',
          steps: [
            `(1) Obtain the deferred tax calculation schedule. Agree the total deferred tax balance (asset/liability) to the trial balance. Identify all temporary differences included in the schedule: accelerated capital allowances (tax WDV less accounting NBV); provisions not deductible until paid (warranty provisions, legal provisions); share-based payments (if applicable); lease liabilities and ROU assets (IFRS 16); losses carried forward; other timing differences.`,
            `(2) Verify each temporary difference: (a) Accelerated capital allowances — agree the tax written down value (WDV) per capital allowances computation to the deferred tax schedule; agree the accounting NBV per the fixed asset register; calculate the temporary difference; (b) Provisions — agree the provision balance per the accounts to the deferred tax schedule; confirm the provision is not deductible until paid (most provisions qualify); (c) Losses — agree the loss carried forward to the corporation tax computation.`,
            `(3) Re-perform the deferred tax calculation: for each temporary difference, multiply by the applicable tax rate. The tax rate must be the rate enacted or substantively enacted by the balance sheet date that is expected to apply when the timing difference reverses (IAS 12 para 47). Verify the rate used: check the current UK corporation tax rate and any announced future rate changes. For deferred tax assets and liabilities expected to reverse at different rates, verify appropriate rates are used.`,
            `(4) Verify recoverability of any deferred tax asset: management must demonstrate it is probable that sufficient future taxable profits will be available against which the asset can be utilised. Obtain evidence: board-approved profit forecasts for the relevant period; assess whether the entity has a history of recent taxable profits; consider whether there are tax planning opportunities. For losses carried forward, verify there is no time limit on utilisation (UK losses carried forward: post-April 2017 losses can be offset against future profits of the same activity, subject to 50% restriction above £5m annual profits).`,
            `(5) Agree the movement in deferred tax: reconcile opening balance + charge to P&L + charge to OCI (for revaluation) + acquisition/disposal movements = closing balance. Verify the deferred tax charge in P&L is correctly split: (a) amounts relating to items recognised in P&L; (b) amounts relating to items recognised in OCI (e.g., revaluation of assets, pension remeasurements); (c) amounts relating to items recognised directly in equity. Verify IAS 12 disclosures including the deferred tax balance by component and the expected reversal timing.`,
          ],
          evidence: [
            'Deferred tax calculation schedule',
            'Corporation tax computation (for WDV)',
            'Fixed asset register (for accounting NBV)',
            'Provisions schedule',
            'Management profit forecasts (for DTA recoverability)',
          ],
          sampleSize: 'Full review of deferred tax calculation',
          exceptionDefinition: 'Deferred tax balance differs from re-performed calculation by > £' + pm + ', or deferred tax asset recognised without adequate evidence of probable recoverability.',
          riskRelevance: 'medium',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete TAX procedures, document tax computation review' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review full tax computation, deferred tax, uncertain tax positions' },
        { role: 'Partner / Tax specialist', timing: 'Before sign-off', requirement: 'Review any complex tax positions and IFRIC 23 uncertain tax treatments' },
      ]),
      guidanceNotes: [
        'Where the tax computation is prepared by the entity without specialist advice, more detailed review procedures are required.',
        'Consider IFRIC 23: where the entity has taken a tax position that may be challenged by HMRC, a provision or disclosure may be required.',
        'For entities with significant overseas operations, consider transfer pricing risks and country-by-country reporting obligations.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Engage tax specialist to review the computation.', 'Consider whether any open HMRC enquiries require provision under IFRIC 23.']
        : ['Standard computation review procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] Tax computation agreed to P&L profit',
        '[ ] Capital allowances recalculated',
        '[ ] Deferred tax calculation re-performed',
        '[ ] Deferred tax rate verified',
        '[ ] DTA recoverability assessed',
        '[ ] Tax payments agreed to bank statements',
        '[ ] Group relief documentation (if applicable)',
      ],
      smartAnalytics: [
        { type: 'analytics_dupont', reason: 'Effective tax rate analysis compared to statutory rate highlights potential misstatements' },
        { type: 'analytics_benchmarking', reason: 'Compare effective tax rate to industry peers to identify aggressive tax positions' },
      ],
    };
  }

  // ─── INVENTORY ─────────────────────────────────────────────────────────────

  _populateInventory(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Inventories',
      isaReferences: [
        { ref: 'ISA 501 paras 4–8', description: 'Attendance at physical inventory counting — mandatory unless impracticable' },
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on inventory valuation' },
        { ref: 'ISA 540', description: 'Accounting estimates — NRV provisions, standard cost variances' },
      ],
      accountingStandards: [
        'IAS 2 Inventories',
        'FRS 102 Section 13 Inventories',
      ],
      objectives: [
        'Confirm inventory physically exists (existence)',
        'Confirm all inventory owned is recorded (completeness)',
        'Confirm inventory is stated at the lower of cost and NRV (valuation)',
        'Confirm correct cost determination method (FIFO or weighted average)',
        'Confirm correct cut-off for inventory movements at year-end',
      ],
      assertions: ['Existence', 'Completeness', 'Valuation', 'Cutoff'],
      procedures: [
        {
          id: 'INV-001',
          isaReference: 'ISA 501 paras 4–8',
          accountingStandard: 'IAS 2 / FRS 102 s13',
          assertion: ['Existence', 'Completeness'],
          title: 'Inventory Count Attendance (ISA 501)',
          objective: 'Attend the physical inventory count to observe procedures and perform independent test counts, obtaining evidence of inventory existence and completeness.',
          steps: [
            `(1) Plan the attendance: obtain the client's written inventory count instructions in advance. Review for adequacy: (a) segregation of counted and uncounted inventory (use of tags or marking); (b) recording procedures (count sheets, pre-numbered); (c) cut-off controls (last GRN and despatch note recorded); (d) management of inventory movements during count (freeze procedures or recording of movements). Assess the risk profile of the count — high-value or complex inventory may require a specialist.`,
            `(2) Attend the count on the count date. Perform independent test counts: select a sample of ${ss} inventory lines, risk-weighted to include: all individual lines with value > £${m} (count every item in these lines); a random sample of lines across all warehouse locations. For each selected line, count independently before the client counts (or use a blind count procedure). Record results on the attendance notes. Compare to client count sheets. Investigate any discrepancies > [threshold] or > 5% of line value.`,
            `(3) Observe and document the client's counting procedures: verify two-person counting teams are used; verify items are tagged/marked after counting to prevent double-counting or omission; verify cut-off controls are operating (last GRN and despatch note numbers are recorded at the start and end of count); verify inventory movements during the count are separately tracked and not counted twice. Note any deviations from the count instructions.`,
            `(4) Perform the reciprocal test: select a sample of count sheet lines and physically locate the inventory at its stated location. Verify existence. Also walk through warehouse areas not covered by the planned sample to identify any inventory not appearing on count sheets (completeness risk).`,
            `(5) Record cut-off information: note the number of the last goods received note (GRN) received before the count and the last despatch note raised before the count. This is essential for cut-off testing (INV-003). Record the condition of inventory observed — note any damaged, obsolete, or slow-moving items (relevant to NRV testing — INV-002). Retain signed attendance notes as evidence.`,
          ],
          evidence: [
            'Inventory count instructions (client prepared)',
            'Attendance notes (signed and dated)',
            'Test count results (independent)',
            'Client count sheets (for comparison)',
            'Cut-off information (last GRN/despatch note numbers)',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any test count discrepancy > 5% of line value or > £' + pm + ', or any material deviation from count procedures that compromises the reliability of the count.',
          riskRelevance: 'all',
        },
        {
          id: 'INV-002',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IAS 2 paras 6–33 / FRS 102 s13.4',
          assertion: ['Valuation'],
          title: 'Net Realisable Value (NRV) Testing',
          objective: 'Verify that inventory is stated at the lower of cost and NRV, with appropriate write-downs for slow-moving, obsolete, or damaged items.',
          steps: [
            `(1) Obtain the aged inventory report / inventory analysis. Identify: (a) items with no movement in the last 6 months (potential slow-moving); (b) items with no movement in the last 12 months (potential obsolete); (c) items specifically flagged as damaged or obsolete by the warehouse team during the count attendance. For each identified item, record the line, description, units, cost per unit, and total carrying value.`,
            `(2) For each slow-moving or potentially obsolete item: compare the carrying value to NRV. NRV = estimated selling price in the ordinary course of business − estimated costs of completion − estimated costs to make the sale. Obtain evidence of NRV: (a) post-year-end actual sales at what price; (b) current price list if the item is still actively sold; (c) scrap/disposal value if no further sales are expected. Any item where NRV < cost — a write-down to NRV is required.`,
            `(3) Obtain management's NRV write-down schedule. Challenge the assumptions: selling prices used — corroborate to post-year-end sales invoices or current price lists; costs to complete — agree to job costing records or production cost cards; selling costs — agree to standard selling cost allocation rates. Re-perform management's NRV calculation for a sample of items. Investigate variances.`,
            `(4) Agree the total NRV write-down per management's schedule to the trial balance inventory provision. Verify the provision is consistent with the prior year methodology (any change requires IAS 8 disclosure). Assess the overall adequacy: consider whether any items observed as damaged at the count attendance (but not on management's schedule) should be written down.`,
            `(5) For standard cost inventory: verify standard costs are updated at least annually to reflect current input prices (materials, labour, overheads). Obtain the standard cost update schedule. For any items where standard costs differ significantly from actual costs (>5% variance): investigate whether carrying value is at actual cost or an outdated standard. Verify variance accounts have been properly disposed of (not buried in other nominal accounts).`,
          ],
          evidence: [
            'Aged inventory report',
            'NRV write-down schedule (management prepared)',
            'Post-year-end sales evidence (prices)',
            'Scrap/disposal quotes for obsolete items',
            'Standard cost update schedule',
          ],
          sampleSize: 'All items flagged as slow-moving/obsolete; sample of standard cost items',
          exceptionDefinition: 'Any inventory item where NRV < cost by > £' + pm + ' but no write-down has been recorded, or standard costs materially outdated versus actual input costs.',
          riskRelevance: 'all',
        },
        {
          id: 'INV-003',
          isaReference: 'ISA 500 / ISA 330',
          accountingStandard: 'IAS 2 para 6 / FRS 102 s13',
          assertion: ['Cutoff', 'Completeness'],
          title: 'Inventory Cut-off',
          objective: 'Confirm that inventory movements at year-end are recorded in the correct period — goods received before year-end are included in inventory and goods despatched before year-end are excluded.',
          steps: [
            `(1) Use the cut-off information recorded during the inventory count attendance (INV-001 step 5): last GRN number before count and last despatch note number before count. Obtain the GRN log and despatch note log around year-end.`,
            `(2) For the last 10 GRNs before year-end: verify the corresponding inventory was included in the inventory count and is included in the closing inventory balance. Verify the corresponding purchase invoice is accrued/posted as a creditor at year-end.`,
            `(3) For the first 10 GRNs after year-end: verify the goods are excluded from closing inventory. Verify any corresponding purchase invoice received before year-end has not been accrued (or if it has, that inventory was also included — verify matching treatment).`,
            `(4) For the last 10 despatch notes before year-end: verify the goods are excluded from closing inventory (despatched = sold = revenue recognised = inventory removed). Verify the corresponding revenue/debtor is recorded in the correct period.`,
            `(5) For the first 10 despatch notes after year-end: verify the goods are included in closing inventory (not yet despatched at year-end = still owned = should be in inventory). Document all cut-off exceptions and quantify.`,
          ],
          evidence: [
            'GRN log and despatch note log (around year-end)',
            'Inventory count sheets (cut-off items)',
            'Purchase invoices for last/first GRNs',
            'Sales invoices for last/first despatch notes',
          ],
          sampleSize: '10 pre-year-end GRNs + 10 post-year-end GRNs + 10 pre-year-end despatch notes + 10 post-year-end despatch notes',
          exceptionDefinition: 'Any inventory item incorrectly included or excluded from year-end inventory resulting in misstatement > £' + pm,
          riskRelevance: 'all',
        },
        {
          id: 'INV-004',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 2 paras 10–22 / FRS 102 s13.8–13.12',
          assertion: ['Valuation', 'Accuracy'],
          title: 'Inventory Valuation — Cost Determination',
          objective: 'Verify that inventory is valued at cost, using an appropriate cost formula (FIFO or weighted average), including all costs of purchase, conversion, and other costs to bring inventory to its present location and condition.',
          steps: [
            `(1) Obtain the inventory valuation methodology from management. Verify the cost formula used: FIFO (first-in, first-out) or weighted average cost (IAS 2 para 25 — LIFO is prohibited under IAS 2 and FRS 102). Confirm the method is consistently applied year-on-year (any change requires IAS 8 disclosure).`,
            `(2) For purchased goods: select a sample of ${ss} inventory lines. For each, agree the unit cost on the inventory system to a recent purchase invoice. Verify freight, import duties, and other directly attributable costs are included. Verify trade discounts and rebates are deducted from cost.`,
            `(3) For manufactured inventory: obtain the product cost cards for a sample of finished goods lines. Verify costs included: direct materials (agree to purchase invoices); direct labour (agree to wage rates × labour hours per product); directly attributable production overheads (verify allocation basis — typically machine hours or labour hours). Verify that: selling costs are NOT included in cost; abnormal waste is NOT included; administrative overheads are NOT included (unless directly attributable to production).`,
            `(4) For work-in-progress: verify the stage of completion assessment is reasonable; verify costs include appropriate proportion of materials, labour, and overheads; verify no profit is included in WIP cost.`,
            `(5) Agree total inventory at cost per valuation workings to the inventory balance on the trial balance (before NRV write-downs). Document conclusion on whether cost determination methodology is compliant with IAS 2 and consistently applied.`,
          ],
          evidence: [
            'Inventory valuation methodology documentation',
            'Product cost cards for manufactured goods',
            'Purchase invoices for purchased goods (sample)',
            'Overhead allocation schedule',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any inventory line where cost is materially overstated (includes prohibited items like selling costs or abnormal waste) or understated (excludes required costs like freight), resulting in misstatement > £' + pm,
          riskRelevance: 'medium',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'Count attendance on count date; valuation procedures during fieldwork', requirement: 'Attend count, complete all INV procedures, document NRV assessment' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review count attendance notes, NRV adequacy, cut-off results' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review significant NRV write-downs and count discrepancies' },
      ]),
      guidanceNotes: [
        'ISA 501 para 4 requires attendance at the physical count unless impracticable — document the justification if attendance is not possible (e.g., overseas location) and perform alternative procedures.',
        'Where inventory is held at third-party warehouses (consignment stock, public warehouses), consider whether direct confirmation from the third party is required per ISA 501 para 8.',
        'For entities with inventory at multiple locations, risk-assess which locations require attendance and which can be covered by alternative procedures.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Extend test count sample to 100+ lines.', 'Attend all significant count locations.', 'Commission independent specialist valuation for complex or technical inventory.']
        : ['Standard attendance and NRV procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] Count attendance notes (signed)',
        '[ ] Test counts completed and compared to client sheets',
        '[ ] NRV write-down schedule reviewed',
        '[ ] Inventory cut-off tested',
        '[ ] Inventory valuation methodology verified',
        '[ ] Aged inventory report reviewed for slow-moving items',
      ],
      smartAnalytics: [
        { type: 'analytics_benchmarking', reason: 'Compare inventory days (DIO) to industry peers to identify potential overstatement' },
        { type: 'analytics_dupont', reason: 'Inventory turnover analysis identifies slow-moving or excessive inventory' },
      ],
    };
  }

  // ─── INTANGIBLES ───────────────────────────────────────────────────────────

  _populateIntangibles(context) {
    const { m, pm, ss } = this._fmt(context);
    return {
      title: 'Intangible Assets',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on intangible assets' },
        { ref: 'ISA 540', description: 'Accounting estimates — goodwill impairment, amortisation periods' },
      ],
      accountingStandards: [
        'IFRS 3 Business Combinations (goodwill)',
        'IAS 36 Impairment of Assets',
        'IAS 38 Intangible Assets',
        'FRS 102 Section 18 Intangible Assets other than Goodwill',
        'FRS 102 Section 19 Business Combinations and Goodwill',
        'FRS 102 Section 27 Impairment of Assets',
      ],
      objectives: [
        'Confirm intangible assets meet the recognition criteria',
        'Confirm goodwill is not amortised (IFRS) or is amortised over a supportable useful life (FRS 102)',
        'Confirm impairment testing is performed annually for goodwill and indefinite-life intangibles',
        'Confirm development costs capitalisation criteria are met',
        'Confirm amortisation is calculated correctly and consistently',
      ],
      assertions: ['Existence', 'Rights', 'Valuation', 'Accuracy'],
      procedures: [
        {
          id: 'INT-001',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IFRS 3 / IAS 36 / FRS 102 s19–s27',
          assertion: ['Valuation'],
          title: 'Goodwill Impairment Test (IAS 36 / FRS 102 s27)',
          objective: 'Verify that goodwill is subject to annual impairment testing and that any required impairment is recognised.',
          steps: [
            `(1) Obtain the goodwill impairment test prepared by management. Agree opening goodwill to prior year financial statements. Verify no amortisation has been charged in the year (IFRS — goodwill is not amortised per IFRS 3 para 54; exception for FRS 102 entities — amortise over useful life or 10-year maximum if life not reliably estimated). Verify any goodwill acquired in the year is from a properly accounted business combination.`,
            `(2) Verify the CGU allocation: confirm that goodwill is allocated to the smallest CGU(s) that are expected to benefit from the synergies of the combination and that represent the lowest level at which goodwill is monitored for management purposes. Agree the CGU structure to management's reporting framework. Any change in CGU allocation from prior year requires explanation.`,
            `(3) Obtain the VIU model for each CGU carrying goodwill: Board-approved cash flow projections (maximum 5 years — IAS 36 para 33); terminal value using a stable or declining growth rate; risk-adjusted pre-tax discount rate. Challenge key assumptions as per PPE-004 step 3. For acquisitions in the current year, also verify the initial purchase price allocation (PPA) was done correctly: goodwill = consideration paid − FMV of net identifiable assets acquired.`,
            `(4) Perform headroom analysis: calculate the excess of recoverable amount over carrying value (headroom). Assess the sensitivity: by how much would (a) the discount rate need to increase, (b) the long-term growth rate need to decrease, or (c) the forecast EBITDA need to decline, before impairment would be required? If headroom is less than 20%, a sensitivity analysis disclosure is required.`,
            `(5) If impairment is identified: verify it is recognised immediately and cannot be reversed in future periods (IAS 36 para 124 — goodwill impairment reversals are prohibited). Verify disclosure: CGU description, carrying amount of goodwill, key assumptions, discount rate, sensitivity analysis. For FRS 102 entities with amortised goodwill, also verify residual value assumption (typically nil) and review for additional impairment indicators.`,
          ],
          evidence: [
            'Goodwill impairment test (management prepared)',
            'VIU DCF model with projections',
            'Board-approved forecasts',
            'WACC / discount rate calculation',
            'Prior year impairment test (for comparison)',
          ],
          sampleSize: 'All CGUs carrying goodwill (full population)',
          exceptionDefinition: 'Recoverable amount of any CGU carrying goodwill is less than its carrying value and no impairment has been recognised, or key VIU assumptions are not supportable by evidence.',
          riskRelevance: 'high',
        },
        {
          id: 'INT-002',
          isaReference: 'ISA 500 para 7 / ISA 540',
          accountingStandard: 'IAS 38 paras 57–67 / FRS 102 s18.8',
          assertion: ['Existence', 'Valuation', 'Rights'],
          title: 'Development Costs Capitalisation (IAS 38)',
          objective: 'Verify that capitalised development costs meet all IAS 38 recognition criteria and are properly measured.',
          steps: [
            `(1) Obtain the schedule of development projects capitalised in the year. For each project where amounts capitalised exceed £${m}: verify that management has documented their assessment of each IAS 38 para 57 criterion: (a) technical feasibility of completing the asset; (b) intention to complete the asset and use/sell it; (c) ability to use or sell the asset; (d) existence of a market or internal use; (e) availability of adequate resources (technical, financial) to complete; (f) ability to reliably measure expenditure during development.`,
            `(2) Obtain evidence for each IAS 38 criterion: (a) Technical feasibility — engineering sign-off, successful prototype, or technical review document; (b) Intention to complete — board minutes specifically approving the project and budget; (c) Market/use — market research report, letters of intent from customers, or signed contracts; (d) Resources — cash flow forecast showing funding available; (e) Reliable measurement — project cost tracking system showing actual vs budgeted.`,
            `(3) Verify the composition of capitalised expenditure for each project: only direct development-phase costs may be capitalised under IAS 38 — direct employee costs (using timesheets), direct materials, directly attributable overheads. The following must be expensed: research-phase costs (prior to demonstration of technical feasibility); selling and marketing costs; general and administrative overhead; training costs; start-up costs. Verify the split between research (expensed) and development (capitalised) phases is clearly documented.`,
            `(4) Verify amortisation: confirm amortisation begins when the asset is available for use (IAS 38 para 97). Verify useful life is supportable (commercial life of the product/platform, considering technology obsolescence). If entity uses an indefinite useful life, verify annual impairment testing is performed. Re-perform amortisation calculation for a sample.`,
            `(5) Assess whether any previously capitalised development costs should be impaired: has the project been abandoned or discontinued? Are projected revenues still sufficient to recover the carrying value? Apply IAS 36 impairment indicators. Any project where future economic benefits are no longer expected should be fully written off immediately. Document conclusion per project.`,
          ],
          evidence: [
            'Development project schedule',
            'IAS 38 criteria assessment (management documentation)',
            'Board minutes approving projects',
            'Engineering/technical feasibility sign-off',
            'Market research / customer letters of intent',
            'Project cost timesheets and overhead allocation',
          ],
          sampleSize: 'All projects with capitalised costs > £' + m,
          exceptionDefinition: 'Any development project where one or more IAS 38 criteria are not met and development costs have been capitalised, or where research-phase costs have been incorrectly included in the capitalised amount.',
          riskRelevance: 'high',
        },
        {
          id: 'INT-003',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IAS 38 paras 97–110 / FRS 102 s18.20',
          assertion: ['Valuation', 'Accuracy'],
          title: 'Amortisation Re-performance',
          objective: 'Verify amortisation of intangible assets is calculated correctly and on an appropriate basis.',
          steps: [
            `(1) Obtain the intangible assets register with amortisation workings. For a sample of ${ss} intangible assets (excluding goodwill — covered in INT-001): extract cost, amortisation method, useful life, amortisation charge for the year, accumulated amortisation, NBV.`,
            `(2) Re-perform the amortisation calculation: (Cost − Residual value) ÷ Useful life × months in use = Annual/partial year charge. Compare to amount in the register. Investigate variances > £${pm}.`,
            `(3) Assess reasonableness of useful lives: for customer lists — compare to customer churn rate; for patents/licences — compare to legal protection period; for software — compare to expected technology cycle; for brands — assess whether truly indefinite life or should have finite life. Document assessment.`,
            `(4) Verify that intangibles with indefinite useful lives are not amortised but are subject to annual impairment testing. Confirm impairment test has been performed and documented.`,
            `(5) Agree total amortisation per register to P&L amortisation charge. Verify consistency of method and rates with prior year. Document conclusion.`,
          ],
          evidence: [
            'Intangible assets register',
            'P&L amortisation account',
            'Prior year register (consistency check)',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Amortisation variance > £' + pm + ' per asset, or useful lives inconsistent with economic reality of the asset.',
          riskRelevance: 'medium',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete all INT procedures, document goodwill impairment review' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review goodwill impairment test, development cost criteria' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review goodwill impairment conclusion — key area of judgement' },
      ]),
      guidanceNotes: [
        'Goodwill impairment testing is a key area of estimation uncertainty — document the audit evidence obtained to support or challenge the key assumptions in detail.',
        'For FRS 102 entities, if management cannot estimate the useful life of goodwill with reasonable certainty, the maximum is 10 years (FRS 102 para 19.23).',
        'Internally generated brands, mastheads, customer lists, and similar items cannot be capitalised (IAS 38 para 63) — check that any intangible additions are from external acquisition or qualify as development costs.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Engage valuation specialist for significant goodwill impairment tests.', 'Perform sensitivity analysis on VIU assumptions independently.']
        : ['Standard impairment testing review procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] Goodwill impairment test reviewed',
        '[ ] VIU model assumptions challenged',
        '[ ] Development cost criteria assessed per project',
        '[ ] Amortisation re-performed for sample',
        '[ ] Indefinite life intangibles impairment test reviewed',
      ],
      smartAnalytics: [
        { type: 'analytics_zscore', reason: 'Financial distress indicators affect goodwill recoverability assessment' },
        { type: 'analytics_benchmarking', reason: 'Compare goodwill as % of total assets to peer acquisitions' },
      ],
    };
  }

  // ─── LEASES ────────────────────────────────────────────────────────────────

  _populateLeases(context) {
    const { _m, pm, ss } = this._fmt(context);
    return {
      title: 'Leases (IFRS 16 / FRS 102 s20)',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on lease balances' },
        { ref: 'ISA 540', description: 'Accounting estimates — lease term, incremental borrowing rate' },
      ],
      accountingStandards: [
        'IFRS 16 Leases',
        'FRS 102 Section 20 Leases (finance/operating distinction)',
        'IFRIC 4 Determining whether an Arrangement contains a Lease',
        'IAS 7 Statement of Cash Flows (lease payments presentation)',
      ],
      objectives: [
        'Confirm all leases are identified and correctly accounted for',
        'Confirm ROU assets and lease liabilities are accurately measured',
        'Confirm the discount rate (IBR) used is appropriate',
        'Confirm lease modifications are correctly accounted for',
        'Confirm IFRS 16 / FRS 102 disclosures are complete',
      ],
      assertions: ['Completeness', 'Accuracy', 'Valuation', 'Existence'],
      procedures: [
        {
          id: 'LEASE-001',
          isaReference: 'ISA 500 para 7 / ISA 315',
          accountingStandard: 'IFRS 16 paras 9–11 / FRS 102 s20.5',
          assertion: ['Completeness', 'Existence'],
          title: 'IFRS 16 / FRS 102 s20 Lease Identification',
          objective: 'Verify that all contracts containing leases have been identified and that the lease/non-lease distinction has been correctly applied.',
          steps: [
            `(1) Obtain management's complete lease schedule and all underlying lease contracts. Verify the schedule includes: all property leases, equipment leases, vehicle leases, technology leases, and any service contracts that may contain embedded leases. Cross-reference to: (a) prior year lease schedule; (b) accounts payable for regular periodic payments that may represent lease payments; (c) contracts reviewed during the audit for other purposes.`,
            `(2) For a sample of ${ss} contracts including any new contracts entered into in the year: apply the IFRS 16 lease identification criteria — does the contract convey the right to control the use of an identified asset for a period of time in exchange for consideration? Test: (a) Identified asset: is the supplier able to substitute the asset throughout the period of use? If supplier has substantive substitution right, there is no identified asset and the contract is a service; (b) Right to substantially all economic benefits: does the lessee obtain substantially all the output/benefits? (c) Right to direct use: does the lessee have the right to direct how and for what purpose the asset is used?`,
            `(3) For any service contracts or contracts classified as 'not a lease' by management: independently apply the IFRS 16 criteria. Flag any contract that appears to contain a lease element that has not been recognised. Document assessment for each contract reviewed, with specific reference to the IFRS 16 criteria.`,
            `(4) For each recognised lease: verify the lease term determination — agree the non-cancellable period to the contract; assess renewal options — verify management's assessment of whether it is 'reasonably certain' that renewal options will be exercised (consider: significance of leasehold improvements, strategic importance of location, penalties for not renewing, business history); agree to terms of the lease modification if applicable.`,
            `(5) Verify the short-term lease and low-value asset exemptions: (a) Short-term (lease term ≤12 months) — verify lease term at commencement, including renewal options; (b) Low-value assets (underlying asset value ≤ approx. USD 5,000 / £4,000 when new) — verify individual asset value qualifies. Document all exemptions applied.`,
          ],
          evidence: [
            'Lease schedule (management prepared)',
            'Underlying lease contracts (sample)',
            'Service contracts reviewed for embedded leases',
            'Prior year lease schedule',
          ],
          sampleSize: ss,
          exceptionDefinition: 'Any contract containing a lease that has not been recognised (except for valid short-term or low-value exemptions), resulting in unrecognised ROU asset and lease liability > £' + pm,
          riskRelevance: 'all',
        },
        {
          id: 'LEASE-002',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IFRS 16 paras 22–50 / FRS 102 s20 (finance leases)',
          assertion: ['Accuracy', 'Valuation'],
          title: 'ROU Asset and Lease Liability Calculations',
          objective: 'Re-perform the ROU asset and lease liability calculations to verify accuracy of initial recognition and subsequent measurement.',
          steps: [
            `(1) For each new lease commenced in the year (and a sample of ongoing leases): obtain the lease liability calculation. Re-perform the initial recognition: Lease liability = present value of future lease payments (fixed payments; payments for optional periods if reasonably certain to exercise; residual value guarantees; payments to exercise a purchase option if reasonably certain). Discount using the rate implicit in the lease (if determinable) or the lessee's incremental borrowing rate (IBR). Verify the IBR applied is reasonable: it should reflect the rate a lessee would have to pay to borrow the funds to obtain an asset of similar value in a similar economic environment over the lease term. Compare to the entity's actual borrowing rates.`,
            `(2) Re-perform the ROU asset initial measurement: ROU asset = Lease liability at commencement + Initial direct costs (e.g., legal fees directly related to lease) + Lease payments made at or before commencement − Lease incentives received (e.g., rent-free periods, landlord contributions). Verify each component is supported by documentation. Compare to management's calculation.`,
            `(3) Re-perform subsequent measurement for ongoing leases: (a) ROU asset depreciation: ROU asset cost ÷ shorter of lease term and useful life of underlying asset. Verify depreciation commenced on the commencement date. Agree depreciation charge to P&L. (b) Lease liability unwinding: opening lease liability × effective interest rate = interest charge. Verify interest charged to P&L. Agree cash lease payments to bank statements. Reconcile closing lease liability: opening balance + new leases + interest accrual − cash payments − early terminations = closing balance. Agree to trial balance.`,
            `(4) Verify lease modifications: for any lease where terms changed during the year (rent reviews, extensions exercised, partial terminations, lease surrenders): (a) Identify the modification type; (b) For modifications that increase scope (add assets or extend term): remeasure lease liability at revised discount rate; adjust ROU asset accordingly; (c) For modifications that decrease scope (early termination, partial return): derecognise the portion terminated; recognise gain/loss; (d) For rent review clauses: remeasure lease liability at revised lease payments using the original IBR (unless contract specifies use of a revised rate).`,
            `(5) Verify IFRS 16 disclosures: (a) Maturity analysis of undiscounted lease liabilities (split <1 year, 1–5 years, >5 years); (b) Depreciation on ROU assets by asset class; (c) Interest expense on lease liabilities; (d) Total cash outflow for leases (split: principal repayments, interest payments, short-term, low-value); (e) Carrying amount of ROU assets by class at year-end; (f) Additions to ROU assets in the year; (g) Current/non-current split of lease liability. Compare draft financial statements disclosures to these requirements.`,
          ],
          evidence: [
            'Lease liability schedule (management prepared)',
            'IBR calculation or confirmation',
            'Lease contracts (commencement date, payments, term)',
            'Bank statements (lease payment verification)',
            'Lease modification documentation',
            'Draft financial statements IFRS 16 note',
          ],
          sampleSize: 'All new leases in the year; sample of ongoing leases from prior year',
          exceptionDefinition: 'ROU asset or lease liability differs from re-performed calculation by > £' + pm + ', or IBR applied is not supportable as a reasonable approximation of borrowing cost.',
          riskRelevance: 'medium',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete LEASE procedures, document IBR assessment' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review lease identification completeness, review IBR reasonableness' },
        { role: 'Partner', timing: 'Before sign-off', requirement: 'Review IFRS 16 disclosures and significant lease modifications' },
      ]),
      guidanceNotes: [
        'For FRS 102 entities (not applying IFRS 16): apply the operating/finance lease distinction under FRS 102 s20 — consider whether the risks and rewards of ownership are substantially transferred.',
        'Incremental borrowing rate assessment requires judgement — document the specific evidence used (e.g., recent bank loan rate, commercial mortgage rate, credit-adjusted risk-free rate).',
        'Leaseback transactions: verify the sale-and-leaseback treatment — if the transfer qualifies as a sale under IFRS 15, the lessee recognises a ROU asset as a proportion of the previous carrying amount and a lease liability.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Engage treasury specialist to independently validate IBR.', 'Obtain independent legal review of complex lease contracts (e.g., break clauses, renewal options).']
        : ['Standard lease identification and re-performance procedures are appropriate.'],
      evidenceChecklist: [
        '[ ] All leases identified and documented',
        '[ ] Lease identification criteria applied to service contracts',
        '[ ] ROU asset and lease liability re-performed for sample',
        '[ ] IBR validated',
        '[ ] Lease modifications reviewed',
        '[ ] IFRS 16 disclosures reviewed against requirements',
      ],
      smartAnalytics: [
        { type: 'analytics_benchmarking', reason: 'Compare lease liability/total assets to industry peers to assess lease intensity' },
      ],
    };
  }

  // ─── FINANCIAL INSTRUMENTS ─────────────────────────────────────────────────

  _populateFinancialInstruments(context) {
    const { _m, pm } = this._fmt(context);
    return {
      title: 'Financial Instruments',
      isaReferences: [
        { ref: 'ISA 500 para 7', description: 'Substantive procedures on financial instruments' },
        { ref: 'ISA 540', description: 'Accounting estimates — fair value measurements' },
        { ref: 'ISA 620', description: 'Using the work of an auditor\'s expert for complex valuations' },
      ],
      accountingStandards: [
        'IFRS 9 Financial Instruments',
        'IFRS 7 Financial Instruments: Disclosures',
        'IFRS 13 Fair Value Measurement',
        'IAS 32 Financial Instruments: Presentation',
        'FRS 102 Section 11 Basic Financial Instruments',
        'FRS 102 Section 12 Other Financial Instruments Issues',
      ],
      objectives: [
        'Confirm financial instruments are correctly classified (amortised cost, FVOCI, FVTPL)',
        'Confirm fair values are measured in accordance with IFRS 13 hierarchy',
        'Confirm hedge accounting documentation meets IAS 39 / IFRS 9 requirements',
        'Confirm derivatives are recognised on balance sheet at fair value',
      ],
      assertions: ['Existence', 'Valuation', 'Completeness', 'Accuracy'],
      procedures: [
        {
          id: 'FI-001',
          isaReference: 'ISA 540 para 8 / ISA 620',
          accountingStandard: 'IFRS 9 / IFRS 13 / FRS 102 s11–12',
          assertion: ['Valuation', 'Accuracy'],
          title: 'Fair Value Measurement (IFRS 9 / IFRS 13)',
          objective: 'Verify that financial instruments measured at fair value are valued in accordance with the IFRS 13 three-level hierarchy.',
          steps: [
            `(1) Obtain the schedule of all financial instruments held, classified by category: amortised cost (basic financial assets/liabilities), FVOCI (equity instruments or debt instruments held to collect and sell), FVTPL (trading, designated, or mandatory). Agree total carrying values to trial balance. Verify classification is consistent with the business model for managing the instruments and the contractual cash flow characteristics (SPPI test for debt instruments).`,
            `(2) For Level 1 instruments (quoted prices in active markets): agree the fair value to observable market prices as at year-end date (Bloomberg, Reuters, stock exchange data). Verify the date of the price used is the year-end date, not a date close to year-end.`,
            `(3) For Level 2 instruments (observable inputs, not quoted prices): verify the valuation model used (e.g., discounted cash flows for bonds, Black-Scholes for options). Verify all inputs are observable: interest rates (LIBOR/SONIA curves), credit spreads (from market data), foreign exchange rates. Re-perform or sense-check the valuation using independently sourced inputs.`,
            `(4) For Level 3 instruments (unobservable inputs — significant estimation uncertainty): obtain management's valuation model and all assumptions. Consider whether an auditor's expert (ISA 620) is required. Develop an independent estimate or range of values. Compare to management's valuation — if outside the auditor's range, this is a likely misstatement. Verify sensitivity disclosures under IFRS 13 para 93(h).`,
            `(5) Verify IFRS 7 disclosures: fair value hierarchy classification by level; reconciliation of Level 3 movements; qualitative and quantitative information about risks (credit, liquidity, market); sensitivity analysis for Level 3; transfer between levels during the year. Review draft financial statements disclosures for completeness.`,
          ],
          evidence: [
            'Financial instruments schedule by category',
            'Market price data at year-end (Level 1)',
            'Valuation models and observable inputs (Level 2)',
            'Level 3 valuation model and assumptions documentation',
            "Auditor's expert report (if engaged)",
          ],
          sampleSize: 'All Level 3 instruments; sample of Level 1 and 2',
          exceptionDefinition: 'Fair value differs from independently determined value by > £' + pm + ', or Level 3 valuation where unobservable assumptions are not adequately supported.',
          riskRelevance: 'high',
        },
        {
          id: 'FI-002',
          isaReference: 'ISA 500 para 7',
          accountingStandard: 'IFRS 9 Chapter 6 / IAS 39',
          assertion: ['Existence', 'Accuracy', 'Completeness'],
          title: 'Hedge Accounting Documentation',
          objective: 'Verify that hedge accounting designation and documentation meets IFRS 9 requirements and that hedge effectiveness is demonstrated.',
          steps: [
            `(1) Obtain the list of all hedging relationships designated by the entity. For each relationship, obtain the formal hedge designation documentation prepared at inception (or at the start of the audit period if hedge was previously designated): identifies the hedging instrument; identifies the hedged item; states the risk being hedged; states the hedge ratio; explains the sources of hedge ineffectiveness.`,
            `(2) Verify IFRS 9 hedge effectiveness criteria: (a) Economic relationship — verify that the hedging instrument and hedged item have values that move in opposite directions due to the same risk; (b) Credit risk does not dominate the value change — assess credit risk of counterparty; (c) Hedge ratio — verify the ratio of hedging instrument to hedged item reflects the actual quantities being hedged.`,
            `(3) Re-perform the hedge effectiveness calculation for a sample of hedging relationships: calculate the change in fair value of the hedging instrument vs the change in fair value of the hedged item attributable to the hedged risk. The effective portion goes to OCI (for cash flow hedges) or adjusts carrying value (for fair value hedges). Any ineffective portion goes to P&L. Verify amounts in accounts agree to re-performance.`,
            `(4) For cash flow hedges: verify the hedging reserve in OCI — opening balance + effective gains/losses transferred in − amounts reclassified to P&L = closing balance. Verify reclassifications: amounts in the hedging reserve are reclassified to P&L in the same period the hedged item affects P&L. Verify amounts agree to the scheduled cash flows being hedged.`,
            `(5) Verify IFRS 9 hedge accounting disclosures: risk management strategy; nature and extent of hedging relationships; amounts in OCI related to hedging; effects of hedges on balance sheet and income statement; hedge ineffectiveness recognised in P&L; maturity profile of hedging instruments.`,
          ],
          evidence: [
            'Hedge designation documentation (all relationships)',
            'Hedge effectiveness test calculations',
            'Fair value of hedging instruments at year-end',
            'OCI hedging reserve reconciliation',
          ],
          sampleSize: 'All material hedging relationships',
          exceptionDefinition: 'Any hedging relationship lacking valid designation documentation, failing the effectiveness test, or where hedge accounting has been applied without meeting IFRS 9 criteria.',
          riskRelevance: 'high',
        },
        {
          id: 'FI-003',
          isaReference: 'ISA 540 para 8',
          accountingStandard: 'IFRS 9 / IFRS 13 / IAS 32',
          assertion: ['Valuation', 'Completeness', 'Existence'],
          title: 'Derivatives Valuation',
          objective: 'Verify that all derivatives are recognised on the balance sheet at fair value, and that fair values are accurately measured.',
          steps: [
            `(1) Obtain a complete schedule of all derivative instruments held: interest rate swaps, currency forwards, currency options, commodity derivatives, credit derivatives. Agree fair values to trial balance. Verify all derivatives are on balance sheet — off-balance-sheet derivatives are not permitted under IAS 39 / IFRS 9.`,
            `(2) For interest rate swaps: obtain the swap valuation report from the bank counterparty. Independently re-perform or verify using a discounted cash flow approach: calculate the present value of fixed leg payments less present value of floating leg payments using the yield curve as at year-end. Compare to bank's valuation — investigate differences > £${pm}.`,
            `(3) For foreign currency forwards: verify fair value = (Forward rate − Contracted forward rate) × Notional amount × Discount factor. Obtain the year-end forward rate from a financial data service. Compare to management's valuation.`,
            `(4) Verify classification: are derivatives designated as hedging instruments (fair value hedge or cash flow hedge)? Or held for trading (FVTPL)? Verify that IFRS 9 hedge accounting criteria are met for any hedge-designated derivatives (see FI-002). Non-hedge derivatives must be marked to market through P&L — verify all fair value changes are in P&L, not OCI.`,
            `(5) Obtain bank confirmations of derivative fair values and notional amounts directly from counterparties. This provides independent evidence of both existence and valuation. Agree confirmed values to management's schedule. Document any differences.`,
          ],
          evidence: [
            'Derivatives schedule with fair values',
            'Bank/counterparty confirmation of fair values',
            'Yield curve / forward rate data at year-end',
            'Derivative valuation models and inputs',
          ],
          sampleSize: 'All derivative instruments (full population given individually significant nature)',
          exceptionDefinition: 'Any derivative not on balance sheet, or any fair value that differs from independently sourced value by > £' + pm,
          riskRelevance: 'high',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion of fieldwork', requirement: 'Complete FI procedures, obtain bank confirmations' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review fair value assessments, hedge effectiveness' },
        { role: 'Partner / Expert', timing: 'Before sign-off', requirement: 'Review Level 3 valuations — may require engagement of ISA 620 expert' },
      ]),
      guidanceNotes: [
        'For Level 3 fair values or complex derivatives, consider whether an auditor\'s expert (ISA 620) should be engaged.',
        'Obtain counterparty confirmations of derivative fair values directly — client-provided valuations are not sufficient as sole evidence.',
        'For FRS 102 entities: if the entity applies s11 (basic instruments only), verify no complex instruments are held; if s12 is applied, full fair value accounting for other instruments is required.',
      ],
      riskConsiderations: context.riskLevel === 'high'
        ? ['Engage valuation specialist for all Level 3 instruments.', 'Obtain counterparty confirmations for all derivatives.', 'Perform independent re-performance of all hedge effectiveness tests.']
        : ['Standard procedures are appropriate for entities with limited financial instruments.'],
      evidenceChecklist: [
        '[ ] Financial instruments classified and agreed to TB',
        '[ ] Fair values verified (Level 1/2/3 appropriate evidence)',
        '[ ] Hedge designation documents reviewed',
        '[ ] Hedge effectiveness tests verified',
        '[ ] Derivatives confirmed with counterparties',
        '[ ] IFRS 7 disclosures reviewed',
      ],
      smartAnalytics: [
        { type: 'analytics_benchmarking', reason: 'Compare derivatives exposure relative to revenue/assets to peers' },
      ],
    };
  }

  // ─── PLANNING ──────────────────────────────────────────────────────────────

  _populatePlanning(context) {
    const { m, pm, _rl, fw, ind } = this._fmt(context);
    return {
      title: 'Audit Planning — ISA 300',
      isaReferences: [
        { ref: 'ISA 300', description: 'Planning an Audit of Financial Statements' },
        { ref: 'ISA 315 (Revised 2019)', description: 'Identifying and Assessing Risks of Material Misstatement' },
        { ref: 'ISA 320', description: 'Materiality in Planning and Performing an Audit' },
        { ref: 'ISA 240', description: 'The Auditor\'s Responsibilities Relating to Fraud' },
        { ref: 'ISA 570 (Revised)', description: 'Going Concern' },
        { ref: 'ISA 550', description: 'Related Parties' },
        { ref: 'ISQM 1 / ISQM 2', description: 'Quality Management' },
      ],
      accountingStandards: [fw === 'FRS 102' ? 'FRS 102 The Financial Reporting Standard applicable in the UK and Republic of Ireland' : 'International Financial Reporting Standards (IFRS) as adopted'],
      objectives: [
        'Establish the overall audit strategy',
        'Develop the detailed audit plan',
        'Assess risks of material misstatement at financial statement and assertion level',
        'Determine materiality',
        'Identify and address fraud risks',
        'Assess going concern risks',
        'Assign appropriately qualified team',
      ],
      assertions: ['N/A — Planning stage'],
      procedures: [
        {
          id: 'PLAN-001',
          isaReference: 'ISA 300 para 7–11',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Overall Audit Strategy',
          objective: 'Document the overall audit strategy setting out the scope, timing, and direction of the audit.',
          steps: [
            `(1) Define the scope: entities and components included in the audit; applicable financial reporting framework (${fw}); statutory reporting requirements; regulatory requirements; reporting deadlines. Document any components excluded from scope and the reason.`,
            `(2) Assess the characteristics of the engagement: complexity of the entity and its transactions; use of service organisations (ISA 402); involvement of other auditors (ISA 600); use of internal audit function (ISA 610); nature of the entity's IT environment (automated controls, ERP systems). Document how each characteristic affects the audit approach.`,
            `(3) Determine the audit approach: controls reliance approach (test controls and reduce substantive testing) vs. fully substantive approach. For each significant FSLI: state whether controls will be tested. Justify the choice. For a fully substantive approach, document why controls reliance is not appropriate or efficient.`,
            `(4) Establish the timing of the audit: interim procedures (period, scope); year-end procedures (dates); expected reporting date. Document resource requirements: estimated total hours by grade, specialist requirements, component auditor instructions.`,
            `(5) Document the overall strategy conclusion: key risk areas identified; areas requiring particular attention; significant changes from prior year approach; preliminary materiality; audit timeline and milestones.`,
          ],
          evidence: ['Engagement letter', 'Prior year audit file', 'Entity financial statements (draft/management accounts)', 'Client understanding documentation'],
          sampleSize: 'N/A — planning document',
          exceptionDefinition: 'N/A — planning document',
          riskRelevance: 'all',
        },
        {
          id: 'PLAN-002',
          isaReference: 'ISA 315 (Revised 2019) para 19–24',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Entity Understanding — ISA 315 Eight Components of Internal Control',
          objective: 'Document understanding of the entity, its environment, and its system of internal controls across all eight components of the ISA 315 (2019) framework.',
          steps: [
            `(1) CONTROL ENVIRONMENT: Document: entity's governance structure (board composition, audit committee); management's philosophy and operating style; assignment of authority and responsibility; human resources policies; entity's commitment to competence; oversight by those charged with governance. Assess whether the control environment provides an appropriate foundation for internal control.`,
            `(2) ENTITY'S RISK ASSESSMENT PROCESS: How does management identify and respond to business risks? Document: process for identifying risks relevant to financial reporting objectives; management's response to identified risks (accept, mitigate, transfer). Assess whether the risk assessment process is appropriate for the entity's size and complexity.`,
            `(3) INFORMATION SYSTEM AND COMMUNICATION: Document: classes of transactions and how they are initiated, recorded, processed; accounting records and supporting documents; IT systems used (ERP, accounting software); how the system captures events and conditions that affect financial statements; financial reporting process; how information is communicated within the entity.`,
            `(4) CONTROL ACTIVITIES: Document controls over each significant class of transactions and balances: authorization procedures; performance reviews; information processing controls; physical controls; segregation of duties. Identify any significant control deficiencies noted.`,
            `(5) MONITORING OF CONTROLS: Document: how management monitors the functioning of controls; internal audit function (if any); self-assessment procedures; how management addresses control deficiencies. Also document: ${['CONTROL ENVIRONMENT', 'RISK ASSESSMENT', 'INFORMATION SYSTEM', 'CONTROL ACTIVITIES', 'MONITORING'].map((c, i) => `(${i + 6}) ENTITY-LEVEL CONTROLS / IT GENERAL CONTROLS / FRAUD RISK ASSESSMENT`).join('; ')}.`,
          ],
          evidence: ['Management interviews', 'Walkthrough documentation', 'Organisational charts', 'Process flowcharts', 'IT system documentation'],
          sampleSize: 'N/A — understanding document',
          exceptionDefinition: 'Significant deficiency in internal control — defined as a deficiency or combination of deficiencies in internal control that, in the auditor\'s professional judgement, is of sufficient importance to merit the attention of those charged with governance (ISA 265 para 6).',
          riskRelevance: 'all',
        },
        {
          id: 'PLAN-003',
          isaReference: 'ISA 315 (Revised 2019) para 25–37',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Risk Assessment Matrix',
          objective: 'Identify and assess risks of material misstatement at the financial statement level and at the assertion level for each significant FSLI.',
          steps: [
            `(1) Financial statement level risks: assess risks that pervasively affect financial statements — weak control environment; significant management override risk; going concern uncertainty; complex transactions or estimates; significant changes in the business or accounting policies; first-year audit (opening balances risk — ISA 510). Assess overall risk level: LOW / MEDIUM / HIGH.`,
            `(2) For each significant FSLI: complete the risk assessment grid: FSLI | Inherent Risk (H/M/L) | Reason for Inherent Risk Assessment | Control Risk (H/M/L) | Key Controls Identified | Planned Response (nature/timing/extent of testing). Apply ISA 315 inherent risk factors: complexity, subjectivity, change, uncertainty, susceptibility to management bias, susceptibility to fraud.`,
            `(3) Significant risks: identify all significant risks (risks requiring special audit consideration). At minimum, document: revenue recognition as a presumed fraud risk (ISA 240 para 26 — rebuttable presumption); management override of controls (ISA 240 para 31 — non-rebuttable). For each significant risk, document the specific substantive procedure(s) designed to address the risk.`,
            `(4) For each risk, determine the planned response: increase sample size; perform procedures closer to year-end; obtain more reliable evidence; engage specialists; increase unpredictability of procedures. Document the linkage between the risk and the planned procedure.`,
            `(5) Complete the risk assessment summary table for the current engagement, confirming: all material FSLIs have been assessed; all assertions for each FSLI have been addressed; significant risks are identified and specific responses documented; the risk assessment is consistent with the overall audit strategy.`,
          ],
          evidence: ['Risk assessment matrix (completed)', 'Prior year risk assessment', 'Entity understanding documentation', 'Analytical review results'],
          sampleSize: 'N/A — risk assessment document',
          exceptionDefinition: 'N/A — risk assessment document',
          riskRelevance: 'all',
        },
        {
          id: 'PLAN-004',
          isaReference: 'ISA 320 paras 9–14',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Materiality Calculation Worksheet',
          objective: 'Calculate and document planning materiality, performance materiality, and the clearly trivial threshold.',
          steps: [
            `(1) Select the appropriate benchmark: for profit-oriented entities — profit before tax (PBT) is typically used; if PBT is volatile, abnormal, or near nil, use normalised PBT or an alternative benchmark (revenue, gross profit, total assets, or total equity). Document the reason for benchmark selection. Obtain the benchmark figure from the draft/management accounts.`,
            `(2) Apply the materiality percentage to the benchmark: (a) PBT benchmark: typically 5–10% (use 5% for higher risk, 7–8% as midpoint, 10% for lower risk/stable entity); (b) Revenue benchmark: typically 0.5–2%; (c) Total assets benchmark: typically 1–2%; (d) Gross profit: typically 2–5%. Apply the selected percentage. Document the basis. Calculate planning materiality (PM) = £${m}.`,
            `(3) Set performance materiality (PM): performance materiality is set below planning materiality to reduce the risk that aggregate uncorrected misstatements exceed materiality. Typical range: 50–75% of planning materiality. For higher risk engagements, use 50%; for lower risk, 75%. Calculate: PM = £${pm}. Document the basis.`,
            `(4) Set the clearly trivial threshold: amounts below which misstatements are regarded as clearly trivial and need not be accumulated. Typically set at 3–5% of planning materiality. Calculate clearly trivial = £[3–5% × PM]. Misstatements below this threshold need not be communicated to those charged with governance.`,
            `(5) For components (if applicable): set component materiality below group materiality to provide assurance at the group level. Typical component materiality = 50–75% of group planning materiality. Document and communicate to component auditors. Agree total of component materialities does not exceed group materiality.`,
          ],
          evidence: ['Draft financial statements / management accounts', 'Materiality calculation worksheet', 'Prior year materiality (for comparison)'],
          sampleSize: 'N/A — planning calculation',
          exceptionDefinition: 'N/A — planning calculation',
          riskRelevance: 'all',
        },
        {
          id: 'PLAN-005',
          isaReference: 'ISA 240 paras 14–24',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Fraud Risk Brainstorming Session (ISA 240)',
          objective: 'Conduct a structured team discussion to identify fraud risks and share information about how the financial statements might be susceptible to material misstatement due to fraud.',
          steps: [
            `(1) Hold a team brainstorming session at the start of the engagement (all team members should attend). Document: date, attendees, facilitator. Session agenda: (a) Review prior year fraud risk assessment and any prior findings; (b) Discuss how management could commit fraud: override of controls, manipulation of accounting estimates, fictitious transactions, channel stuffing; (c) Discuss how employees could commit fraud: misappropriation of assets, payroll fraud, expense fraud, inventory theft; (d) Discuss industry-specific fraud risks for a ${ind} entity.`,
            `(2) Assess management fraud risk: consider the fraud triangle — incentive/pressure (earnings targets, debt covenants, bonus schemes); opportunity (weak controls, complex transactions, related parties); rationalisation (management's attitude toward controls and ethical standards). Document assessment.`,
            `(3) Mandatory fraud risks (per ISA 240): (a) Revenue recognition — presumed fraud risk per ISA 240 para 26; document whether the presumption is rebutted and why (if rebutted, must document compelling reasons); (b) Management override — non-rebuttable fraud risk per ISA 240 para 31; must address with: journal entry testing, review of accounting estimates for bias, evaluation of unusual transactions.`,
            `(4) Document responses to identified fraud risks: for each fraud risk identified, state the specific audit procedure designed to address it; assign responsibility for the procedure to a named team member; set the timing of the procedure.`,
            `(5) Communicate fraud risks to team: ensure all team members are aware of identified fraud risks and understand their responsibility to remain alert to fraud indicators throughout the engagement. Obtain signatures of all team members confirming attendance and awareness.`,
          ],
          evidence: ['Brainstorming session minutes (signed by all attendees)', 'Fraud risk assessment documentation'],
          sampleSize: 'N/A — planning document',
          exceptionDefinition: 'N/A — planning document',
          riskRelevance: 'all',
        },
        {
          id: 'PLAN-006',
          isaReference: 'ISA 570 (Revised) paras 9–14',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Going Concern Assessment — Initial Planning Assessment',
          objective: 'Assess going concern risk at the planning stage and determine whether enhanced going concern procedures are required.',
          steps: [
            `(1) Review management accounts, latest cash flow forecasts, and any bank covenants. Consider: (a) Financial indicators: net liability position, current liabilities exceeding current assets, fixed-term borrowings approaching maturity, substantial operating losses, inability to pay dividends, adverse key financial ratios, substantial borrowings overdue. (b) Operating indicators: loss of key management, major customer/supplier loss, labour difficulties, significant restructuring. (c) Other indicators: non-compliance with statutory capital requirements, legal proceedings that may result in adverse outcome.`,
            `(2) Obtain management's going concern assessment: review period — minimum 12 months from the expected date of the auditor's report. Verify management has prepared cash flow forecasts for the period. Assess whether the forecasts are based on realistic assumptions.`,
            `(3) If going concern risk indicators are present: document the indicators; determine whether enhanced procedures are required (ISA 570 para 16 procedures); discuss with partner.`,
            `(4) Document the initial going concern risk assessment: LOW (no indicators, entity is financially stable); MEDIUM (some indicators present — enhanced monitoring required); HIGH (significant indicators — ISA 570 enhanced procedures mandatory, discuss basis of preparation with management and TCWG).`,
            `(5) Plan going concern procedures proportionate to the assessed risk. Note: the final going concern conclusion is documented at the completion stage (COMP-003). This is the preliminary assessment only.`,
          ],
          evidence: ['Management accounts (latest)', 'Cash flow forecasts (12 months forward)', 'Bank covenants and facility agreements', 'Board minutes (financial discussions)'],
          sampleSize: 'N/A — planning assessment',
          exceptionDefinition: 'Presence of material uncertainty about going concern identified at planning stage — requires immediate escalation to partner.',
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'In-charge / Senior', timing: 'Before fieldwork commences', requirement: 'Complete entity understanding, risk assessment, materiality' },
        { role: 'Manager', timing: 'Before fieldwork commences', requirement: 'Review and approve overall strategy, risk assessment, materiality, team assignment' },
        { role: 'Partner', timing: 'Before fieldwork commences', requirement: 'Approve overall audit strategy; review significant risks; confirm team competence' },
      ]),
      guidanceNotes: [
        'The audit plan must be updated and revised as the audit progresses — if conditions change significantly, update the risk assessment and document the revision.',
        'For recurring engagements, review the prior year audit file but do not assume prior year procedures are appropriate without reassessment.',
        'Team assignment should ensure that more complex areas are assigned to more experienced team members.',
      ],
      riskConsiderations: [
        'Planning is the foundation of the entire audit — insufficient planning leads to inadequate procedures and audit quality failures.',
        'The risk assessment must be sufficiently documented to demonstrate that the auditor understood the entity and its environment before designing audit procedures.',
      ],
      evidenceChecklist: [
        '[ ] Engagement acceptance/continuance confirmed',
        '[ ] Engagement letter signed',
        '[ ] Entity understanding documented (ISA 315)',
        '[ ] Risk assessment matrix completed',
        '[ ] Materiality calculated and approved',
        '[ ] Fraud brainstorming session held and documented',
        '[ ] Going concern initial assessment documented',
        '[ ] Team assigned and briefed',
        '[ ] Audit plan approved by partner',
      ],
      smartAnalytics: [
        { type: 'analytics_zscore', reason: 'Altman Z-Score at planning stage provides early warning of going concern risk' },
        { type: 'analytics_mscore', reason: 'Beneish M-Score at planning stage identifies potential earnings manipulation risk' },
        { type: 'analytics_dupont', reason: 'DuPont analysis at planning provides understanding of financial performance drivers' },
      ],
    };
  }

  // ─── ACCEPTANCE ────────────────────────────────────────────────────────────

  _populateAcceptance(context) {
    const { fw } = this._fmt(context);
    return {
      title: 'Client Acceptance and Continuance — ISA 210 / ISA 220',
      isaReferences: [
        { ref: 'ISA 210', description: 'Agreeing the Terms of Audit Engagements' },
        { ref: 'ISA 220 (Revised)', description: 'Quality Management for an Audit of Financial Statements' },
        { ref: 'ISQM 1', description: 'Quality Management for Firms that Perform Audits or Reviews' },
        { ref: 'ES 1–5 (FRC)', description: 'Ethical Standards — independence requirements (UK)' },
      ],
      accountingStandards: ['ICAEW Code of Ethics', 'IESBA Code of Ethics', 'FRC Ethical Standard'],
      objectives: [
        'Confirm it is appropriate to accept or continue the engagement',
        'Confirm independence threats are identified and safeguards applied',
        'Confirm AML/KYC obligations are met',
        'Confirm engagement letter is in place',
      ],
      assertions: ['N/A — acceptance stage'],
      procedures: [
        {
          id: 'ACC-001',
          isaReference: 'ISA 220 paras 25–30 / ISQM 1',
          accountingStandard: 'ICAEW Code of Ethics',
          assertion: ['N/A'],
          title: 'Client Acceptance / Continuance Checklist (24 Items)',
          objective: 'Assess whether the engagement should be accepted or continued by evaluating the risk profile of the client.',
          steps: [
            `(1) INTEGRITY OF MANAGEMENT (items 1–6): (1) Are there any known concerns about the integrity or honesty of the entity's management or directors? (2) Are there any reported instances of fraud, regulatory sanctions, or legal proceedings involving management? (3) Is management known for aggressive accounting or pushing the boundaries of standards? (4) Has management previously disagreed with or pressured auditors? (5) Is there any evidence of management override of internal controls? (6) Does management provide complete and open responses to auditor inquiries?`,
            `(2) LEGAL AND REGULATORY ISSUES (items 7–10): (7) Is the entity in compliance with applicable laws and regulations? (8) Are there any known regulatory investigations or inquiries in progress? (9) Has the entity been subject to enforcement action by a regulator in the past 3 years? (10) Are there any known issues with the entity's tax affairs (open HMRC enquiries, offshore arrangements)?`,
            `(3) INDEPENDENCE AND THREATS (items 11–15): (11) Does any partner or senior employee hold a financial interest in the entity? (12) Has any partner or senior employee been employed by the entity in the past 2 years? (13) Does the firm provide non-audit services to the entity that may impair independence? (14) Is the engagement fee more than 10% of the firm's total revenues (key client threat)? (15) Has the audit partner been on the engagement for more than 5 years (rotation requirement)?`,
            `(4) COMPETENCE AND RESOURCES (items 16–20): (16) Does the engagement team have appropriate technical knowledge of the entity's industry (${context.industry || 'relevant sector'})? (17) Does the team have appropriate experience with the applicable reporting framework (${fw})? (18) Are there any specialist requirements (actuarial, valuation, IT, tax) and are specialists available? (19) Are there any timing or resource constraints that may compromise audit quality? (20) For group audits: are component auditors appropriately qualified and accessible?`,
            `(5) GENERAL RISK ASSESSMENT (items 21–24): (21) Are there any going concern concerns that may affect the risk profile of the engagement? (22) Is the entity in a high-risk industry or jurisdiction (e.g., financial services, crypto, high-cash business, offshore)? (23) Have prior year financial statements been restated? (24) Is this a new client (higher risk — predecessor auditor communication required per ISA 510 and ISA 300)? CONCLUSION: Based on the above 24 items, state whether acceptance/continuance is: APPROVED / APPROVED WITH CONDITIONS / DECLINED. Partner sign-off required.`,
          ],
          evidence: ['Completed acceptance checklist', 'Partner approval', 'Background searches (Companies House, internet, regulatory registers)'],
          sampleSize: 'N/A — acceptance checklist',
          exceptionDefinition: 'Any item answered adversely that, individually or in combination, makes acceptance inappropriate.',
          riskRelevance: 'all',
        },
        {
          id: 'ACC-002',
          isaReference: 'ES 1 (FRC) / IESBA Code Section 290',
          accountingStandard: 'ICAEW Code of Ethics',
          assertion: ['N/A'],
          title: 'Independence Assessment — Five Threats',
          objective: 'Identify and evaluate all independence threats and confirm that adequate safeguards are in place.',
          steps: [
            `(1) SELF-INTEREST THREAT: Does any partner, manager, or senior employee (or their close family member) hold: a direct financial interest in the client (shares, bonds, options)? An indirect financial interest (through investment funds)? A loan or guarantee from the client? Any other financial relationship with the client? For each identified interest: assess whether it is clearly insignificant (no threat) or whether a safeguard is required. Safeguards: dispose of the interest; remove the person from the engagement team.`,
            `(2) SELF-REVIEW THREAT: Has the firm prepared accounting records, financial statements, or management accounts for the client? Has the firm provided tax advice that has been incorporated into the financial statements? Has the firm designed or implemented internal controls or IT systems? Has a team member joined the client from the firm in the past 2 years? For each identified situation: assess significance. Safeguard: use a separate team for non-audit services; do not audit your own firm's work.`,
            `(3) ADVOCACY THREAT: Is the firm acting as an advocate for the client in legal proceedings or regulatory disputes? Is the firm promoting the client's shares or securities? Assess significance. Safeguard: prohibit the advocacy activity or resign from the audit.`,
            `(4) FAMILIARITY THREAT: Has the engagement partner or manager been on the engagement for more than: 5 years (UK listed entities — mandatory rotation per ES 3); 7 years (other entities — best practice)? Is any team member a close family member of a director, officer, or key management of the client? Safeguard: rotate the engagement partner; remove the close family member from the team.`,
            `(5) INTIMIDATION THREAT: Has the client threatened to replace the audit firm if the auditor issues a qualified opinion or raises a specific issue? Has management expressed displeasure with the auditor's findings in a way that creates pressure? Is the client a key client (fees > 10% of firm revenue — creates economic dependence)? For any intimidation threat: escalate to ethics partner; document the threat and response; consider whether resignation is necessary. OVERALL INDEPENDENCE CONCLUSION: document the overall conclusion with partner signature.`,
          ],
          evidence: ['Independence declaration (all team members)', 'Partner sign-off on independence assessment', 'Non-audit services schedule and fee analysis'],
          sampleSize: 'All engagement team members (full population)',
          exceptionDefinition: 'Any independence threat that cannot be reduced to an acceptable level through the application of available safeguards.',
          riskRelevance: 'all',
        },
        {
          id: 'ACC-003',
          isaReference: 'MLRO / POCA 2002 / MLR 2017',
          accountingStandard: 'MLR 2017 / ICAEW AML guidance',
          assertion: ['N/A'],
          title: 'AML / KYC Checklist',
          objective: 'Comply with anti-money laundering obligations under the Money Laundering Regulations 2017 by conducting appropriate customer due diligence.',
          steps: [
            `(1) BENEFICIAL OWNERSHIP: Identify and verify the ultimate beneficial owner(s) of the entity — all persons who directly or indirectly hold >25% of shares or voting rights, or who otherwise exercise control. For corporate entities: obtain the current confirmation statement from Companies House confirming PSC (Persons with Significant Control). Verify ID of each UBO: photographic ID (passport or driving licence) + proof of address (utility bill or bank statement, dated within 3 months). Record in the client file.`,
            `(2) SOURCE OF FUNDS: Assess whether the entity's source of funds and wealth is consistent with its stated business activities. For new clients: obtain financial statements or bank statements confirming the entity's turnover and financial activity is consistent with the nature of the business. For clients with unusual cash flows, complex structures, or offshore elements: obtain additional evidence of the legitimacy of the business and its funding.`,
            `(3) PEP AND SANCTIONS SCREENING: Screen all directors, UBOs, and key controllers of the entity against: (a) Politically Exposed Persons (PEP) databases; (b) UK and international sanctions lists (HM Treasury Consolidated List, OFAC SDN list, EU Consolidated List); (c) Adverse media (search for news articles linking individuals to criminal activity, fraud, or corruption). Document search results and dates. For PEPs: enhanced due diligence is required — senior management approval; verify source of wealth and funds.`,
            `(4) ENHANCED DUE DILIGENCE: Apply enhanced due diligence (EDD) where higher risk indicators are present: (a) entity is based or has operations in a high-risk jurisdiction (FATF blacklist or greylist); (b) entity is in a high-risk sector (cash-intensive business, crypto assets, gambling, precious metals); (c) complex or unusual ownership structure without apparent legitimate reason; (d) any PEPs identified. Document the additional steps taken under EDD.`,
            `(5) ONGOING MONITORING: AML obligations are continuous — not just at acceptance. For continuing engagements: re-run PEP/sanctions screening annually; update beneficial ownership information if changes occur; be alert to unusual transactions or activities that may be inconsistent with the known client profile and may require a Suspicious Activity Report (SAR) to the NCA. Document the ongoing monitoring performed.`,
          ],
          evidence: ['UBO verification documents (certified copies of ID)', 'Companies House PSC register extract', 'PEP/sanctions screening results (dated)', 'Source of funds documentation', 'EDD documentation (if applicable)'],
          sampleSize: 'All UBOs and directors (full population)',
          exceptionDefinition: "Any director or UBO who cannot be identified and verified; any individual matching a sanctions list; any PEP without completed enhanced due diligence.",
          riskRelevance: 'all',
        },
        {
          id: 'ACC-004',
          isaReference: 'ISA 210 paras 9–12',
          accountingStandard: 'ISA 210',
          assertion: ['N/A'],
          title: 'Engagement Letter — Auto-Generated Template',
          objective: 'Issue a written engagement letter confirming the terms of the audit, scope, responsibilities, and fee arrangements.',
          steps: [
            `(1) Confirm the engagement letter includes the following mandatory elements per ISA 210 para 10: (a) The objective and scope of the audit — confirm this is a statutory audit under ISA/UK auditing standards; (b) The responsibilities of the auditor — to express an opinion on the financial statements; (c) The responsibilities of management — preparation of financial statements giving a true and fair view; maintenance of internal control; provision of all information; unrestricted access; (d) Identification of the applicable financial reporting framework (${fw}); (e) Reference to the expected form and content of any reports to be issued; (f) Fees and billing arrangements.`,
            `(2) Confirm the engagement letter is addressed to management and TCWG (those charged with governance). Verify it is signed by the authorised representative of the entity (director or equivalent). File the signed original.`,
            `(3) For recurring engagements: confirm whether the prior year engagement letter remains appropriate or whether it needs to be reissued (required if: significant change in scope; change in senior management; change in applicable reporting framework; significant lapse of time since last issued; change in fee arrangements).`,
            `(4) Confirm the engagement letter includes any additional terms relevant to the engagement: access to prior auditor's working papers (new engagement); group audit instructions (if applicable); use of experts; other services to be provided by the firm.`,
            `(5) File the signed engagement letter. If the client refuses to sign: consider whether to proceed with the engagement; the refusal must be documented and discussed with the ethics partner.`,
          ],
          evidence: ['Signed engagement letter (original)', 'Prior year engagement letter (continuance review)'],
          sampleSize: 'N/A — single document',
          exceptionDefinition: 'Missing signed engagement letter, or letter that does not cover all mandatory ISA 210 elements.',
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'In-charge / Senior', timing: 'Before engagement commences', requirement: 'Complete AML/KYC checks, obtain engagement letter' },
        { role: 'Manager', timing: 'Before engagement commences', requirement: 'Review acceptance checklist, independence assessment' },
        { role: 'Partner', timing: 'Before engagement commences', requirement: 'Approve acceptance/continuance; sign independence declaration; confirm engagement letter signed' },
      ]),
      guidanceNotes: [
        'AML obligations under the Money Laundering Regulations 2017 are a legal requirement — failure to comply can result in criminal liability for the firm.',
        'For new clients, contact the predecessor auditor before accepting (professional courtesy and ISA 510 requirements).',
        'Independence assessments must be refreshed annually and whenever new non-audit services are proposed.',
      ],
      riskConsiderations: [
        'Do not proceed with any engagement until acceptance procedures are complete and partner approved.',
        'High-risk clients (PEP connections, unusual ownership, high-cash sectors) require enhanced procedures and senior partner review.',
      ],
      evidenceChecklist: [
        '[ ] Acceptance/continuance checklist completed and signed',
        '[ ] Independence assessment completed by all team members',
        '[ ] AML/KYC checks completed (UBO ID, PEP/sanctions screening)',
        '[ ] Engagement letter signed by client',
        '[ ] Partner approval documented',
      ],
      smartAnalytics: [],
    };
  }

  // ─── COMPLETION ────────────────────────────────────────────────────────────

  _populateCompletion(context) {
    const { m, pm, fw } = this._fmt(context);
    return {
      title: 'Audit Completion — ISA 700–720',
      isaReferences: [
        { ref: 'ISA 560', description: 'Subsequent Events' },
        { ref: 'ISA 570 (Revised)', description: 'Going Concern — final assessment' },
        { ref: 'ISA 580', description: 'Written Representations' },
        { ref: 'ISA 700 (Revised)', description: 'Forming an Opinion and Reporting on Financial Statements' },
        { ref: 'ISA 705 (Revised)', description: 'Modifications to the Opinion in the Independent Auditor\'s Report' },
        { ref: 'ISA 706 (Revised)', description: 'Emphasis of Matter and Other Matter Paragraphs' },
        { ref: 'ISA 720 (Revised)', description: 'The Auditor\'s Responsibilities Relating to Other Information' },
        { ref: 'ISQM 2', description: 'Engagement Quality Reviews' },
      ],
      accountingStandards: [fw],
      objectives: [
        'Evaluate the sufficiency and appropriateness of audit evidence obtained',
        'Evaluate unadjusted misstatements and their effect on the audit opinion',
        'Conclude on going concern',
        'Obtain management representations',
        'Issue an appropriate auditor\'s report',
      ],
      assertions: ['N/A — completion stage'],
      procedures: [
        {
          id: 'COMP-001',
          isaReference: 'ISA 450 paras 5–14',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Audit Differences Schedule and Summary of Misstatements',
          objective: 'Record, evaluate, and communicate all misstatements identified during the audit.',
          steps: [
            `(1) Maintain the audit differences schedule throughout the audit: for each identified misstatement, record: (a) description of the misstatement; (b) affected financial statement line item(s); (c) effect on P&L (overstatement/understatement); (d) effect on balance sheet; (e) type: factual (agreed), judgemental (result of auditor's view), or projected (extrapolated from sample).`,
            `(2) At completion, categorise misstatements: ADJUSTED misstatements (management has agreed to correct); UNADJUSTED misstatements (management disagrees or considers immaterial). Calculate the cumulative effect of unadjusted misstatements: total effect on PBT; total effect on net assets. Compare to planning materiality (£${m}) and performance materiality (£${pm}).`,
            `(3) Evaluate unadjusted misstatements: if the cumulative total of unadjusted misstatements exceeds planning materiality — the financial statements are materially misstated; request management to adjust; if management refuses, modify the audit opinion. If below planning materiality — assess whether misstatements are material in context of the specific line items affected and whether disclosure would be required.`,
            `(4) Consider whether there is an indication of bias: are multiple individually immaterial unadjusted misstatements all in the same direction (all overstatements or all understatements)? If so, consider whether the totality indicates a pattern of bias that may indicate management is manipulating the financial statements.`,
            `(5) Request management to adjust all agreed (adjusted) misstatements. Obtain confirmation that financial statements have been updated. Retain the audit differences schedule on file. For unadjusted misstatements, obtain management representation acknowledging awareness and their view that the amounts are immaterial.`,
          ],
          evidence: ['Audit differences schedule (completed)', 'Management representation on unadjusted misstatements'],
          sampleSize: 'N/A — completion document',
          exceptionDefinition: 'Aggregate unadjusted misstatements exceeding planning materiality (£' + m + ').',
          riskRelevance: 'all',
        },
        {
          id: 'COMP-002',
          isaReference: 'ISA 560 paras 6–16',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Subsequent Events Review (ISA 560)',
          objective: 'Identify events occurring between the balance sheet date and the date of the auditor\'s report that require adjustment or disclosure in the financial statements.',
          steps: [
            `(1) Obtain management's subsequent events review: inquire of management whether any events have occurred after year-end that may require adjustment or disclosure. Specific areas to inquire: (a) settlement of litigation at amounts different from amounts recognised; (b) acquisition or disposal of an asset; (c) destruction of a major asset; (d) issue or repurchase of equity or debt; (e) significant changes to exchange rates; (f) amendments to legislation affecting the entity; (g) significant customer losses; (h) significant decline in asset values (e.g., property market decline).`,
            `(2) Review board minutes of meetings held after year-end up to the date of the auditor's report. Note any items discussed that may be adjusting or non-adjusting events. Obtain management accounts for the post-year-end period and review for unusual items or trends inconsistent with the annual financial statements.`,
            `(3) For each subsequent event identified: classify as: (a) ADJUSTING event — a condition that existed at year-end (e.g., customer insolvency after year-end reveals debtor was irrecoverable at year-end); adjust the financial statements; (b) NON-ADJUSTING event — a condition that arose after year-end (e.g., fire destroying an asset after year-end); disclose in the notes to the financial statements if material.`,
            `(4) If the auditor becomes aware of a material subsequent event after the report date (ISA 560 para 14): discuss with management; if financial statements need amendment, determine whether management will amend; if they will amend, extend subsequent event procedures to cover the new report date; if they refuse, issue a modified opinion or resign.`,
            `(5) Document all subsequent events inquiries and the basis for classifying each event as adjusting or non-adjusting. Obtain management representation confirming no material subsequent events have been omitted.`,
          ],
          evidence: ['Management subsequent events inquiry responses', 'Board minutes (post-year-end)', 'Management accounts (post-year-end)', 'Legal correspondence (post-year-end)'],
          sampleSize: 'N/A — full review of subsequent events',
          exceptionDefinition: 'Any material adjusting or non-adjusting subsequent event not reflected in the financial statements.',
          riskRelevance: 'all',
        },
        {
          id: 'COMP-003',
          isaReference: 'ISA 570 (Revised) paras 15–22',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Going Concern — Final Assessment',
          objective: 'Reach a final conclusion on whether the use of the going concern basis of accounting is appropriate and whether material uncertainty disclosure is required.',
          steps: [
            `(1) Review management's going concern assessment for the period to at least 12 months from the expected date of the auditor's report. Obtain the detailed cash flow forecast covering the assessment period. Verify the forecast assumptions are reasonable: (a) revenue assumptions — compare to actual recent performance and backlog/contracted orders; (b) cost assumptions — verify are consistent with recent run rate; (c) capital expenditure — agree to board-approved plans; (d) debt repayments — agree to loan agreements; (e) covenant compliance — recalculate financial covenants using forecast figures.`,
            `(2) Sensitise the cash flow forecast: (a) reduce revenue by 10% — does the entity remain cash positive? (b) increase costs by 5% — does the entity remain cash positive? (c) delay a key contract by 3 months — does this create a liquidity issue? Document results. If the entity has very limited headroom, consider more severe downside scenarios.`,
            `(3) Review available facilities: agree overdraft/revolving credit facility limits to facility letters; verify facilities are not due to expire within the assessment period (or that refinancing is in progress with a reasonable expectation of success); verify no covenant breaches — past or projected; obtain bank confirmation of facilities if not already obtained.`,
            `(4) Evaluate the sufficiency of management's going concern assessment: does it cover the required period? Have all significant risks been considered? Are the assumptions reasonable and supportable? Assess: (a) NO MATERIAL UNCERTAINTY: going concern basis is appropriate; no specific disclosure required (standard going concern statement in notes); (b) MATERIAL UNCERTAINTY: there is a significant doubt — disclosure of the material uncertainty is required in the financial statements; ISA 570 para 22 requires specific emphasis in the auditor's report; (c) GOING CONCERN BASIS INAPPROPRIATE: entity is not a going concern; basis of preparation should be changed; likely material modification to audit opinion.`,
            `(5) Document the going concern conclusion with partner approval. If a material uncertainty exists: ensure the disclosures in the financial statements are adequate; include an Emphasis of Matter paragraph in the auditor's report per ISA 570 para 22 (not a modification — the report is unmodified with emphasis). Obtain management representation confirming completeness of going concern disclosures.`,
          ],
          evidence: ['Management going concern assessment', 'Cash flow forecasts (12+ months)', 'Facility letters / covenant compliance calculations', 'Sensitised forecast analysis', 'Board minutes discussing going concern'],
          sampleSize: 'N/A — going concern assessment',
          exceptionDefinition: 'Material uncertainty about going concern that is not adequately disclosed in the financial statements.',
          riskRelevance: 'all',
        },
        {
          id: 'COMP-004',
          isaReference: 'ISA 580 paras 10–17',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: 'Management Representations Letter (ISA 580)',
          objective: "Obtain written representations from management confirming matters that cannot be verified by other means and acknowledging their responsibilities.",
          steps: [
            `(1) Prepare the management representation letter (MRL) addressed to the audit firm, signed by an appropriate member of management (typically a director). The MRL must be dated as close as practicable to the auditor's report date. The following standard representations are required by ISA 580 para 10: (a) Financial statements prepared in accordance with ${fw} and give a true and fair view; (b) Management has provided all information and access as agreed in the engagement letter; (c) All transactions have been recorded and reflected in the financial statements; (d) Management has disclosed all known instances of fraud or suspected fraud.`,
            `(2) Include specific representations for significant areas of estimation uncertainty and judgement, including: (a) Going concern — management believes the going concern basis is appropriate for the assessment period; (b) Revenue — revenue has been recognised in accordance with ${fw}, all performance obligations are properly accounted for; (c) Provisions — all known provisions and contingent liabilities have been recorded or disclosed; (d) Related parties — all related party transactions and balances have been disclosed; (e) Subsequent events — no material events after the balance sheet date require adjustment or disclosure other than those already reflected.`,
            `(3) Include representations for specific significant risks: (a) Fraud — management has disclosed all known instances of fraud, suspected fraud, or allegations of fraud; (b) Laws and regulations — management is not aware of any non-compliance with laws and regulations that would have a material effect on the financial statements; (c) Litigation — all legal proceedings have been disclosed; (d) Inventory — the basis of valuation (lower of cost and NRV) has been correctly applied.`,
            `(4) If management refuses to provide a required representation: this constitutes a limitation on the scope of the audit; the auditor must disclaim an opinion or issue a qualified opinion (ISA 705) depending on the significance. Document the refusal and obtain partner instructions.`,
            `(5) Obtain the signed MRL before the auditor's report is issued. File the signed original. The MRL must be addressed to the audit firm and signed by the chief executive and finance director (or equivalent). If any required representation is refused, escalate immediately to partner.`,
          ],
          evidence: ['Signed management representations letter (original)'],
          sampleSize: 'N/A — single document',
          exceptionDefinition: 'Refusal to sign any required representation, or any representation that the auditor believes to be inaccurate based on other audit evidence obtained.',
          riskRelevance: 'all',
        },
        {
          id: 'COMP-005',
          isaReference: 'ISA 700 / ISA 705 / ISA 706',
          accountingStandard: fw,
          assertion: ['N/A'],
          title: "Auditor's Report Template and Opinion Determination",
          objective: "Determine the appropriate form of the auditor's report and confirm it meets ISA 700 (Revised) requirements.",
          steps: [
            `(1) UNMODIFIED OPINION (ISA 700): Use when the financial statements give a true and fair view in all material respects in accordance with the applicable framework. Standard report sections: Title; Addressee; Opinion; Basis for Opinion (including statement that the audit was conducted in accordance with ISAs); Going Concern; Key Audit Matters (listed entities only or by choice); Other Information; Responsibilities of Management; Auditor's Responsibilities; Other reporting responsibilities (e.g., Companies Act 2006 reporting obligations); Auditor's signature; Date; Address.`,
            `(2) MODIFIED OPINION (ISA 705): Three types: (a) QUALIFIED OPINION — financial statements are materially misstated in a specific respect, or there is a material limitation on scope, but the matter is not pervasive. Report wording: "In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion paragraph, the financial statements give a true and fair view..."; (b) ADVERSE OPINION — financial statements are materially and pervasively misstated. Wording: "In our opinion, because of the significance of the matters described...the financial statements do not give a true and fair view..."; (c) DISCLAIMER OF OPINION — unable to obtain sufficient appropriate evidence and possible effects are material and pervasive. Wording: "We do not express an opinion...".`,
            `(3) EMPHASIS OF MATTER (ISA 706 para 8): Use to draw users' attention to a matter disclosed in the financial statements that is fundamental to users' understanding, but which does not affect the opinion. Most common use: material uncertainty about going concern (ISA 570). Location: immediately after the Basis for Opinion paragraph. Wording: "We draw attention to Note X of the financial statements, which describes...". Does not modify the opinion.`,
            `(4) OTHER MATTER PARAGRAPH (ISA 706 para 11): Use to communicate a matter relevant to users' understanding of the audit but NOT disclosed in the financial statements. Example: prior period comparative figures audited by a different auditor. Location: after the opinion section.`,
            `(5) QUALITY REVIEW CHECKLIST (ISQM 2): For engagements requiring an engagement quality reviewer (EQR): confirm EQR has been appointed; EQR has reviewed: significant risks, responses to significant risks, significant judgements, misstatements, going concern conclusion, opinion type, final financial statements and report. Obtain EQR sign-off. Note: EQR must be completed before the report is issued.`,
          ],
          evidence: ["Draft auditor's report", 'EQR sign-off (if applicable)', 'Completion checklist signed by partner'],
          sampleSize: 'N/A — completion document',
          exceptionDefinition: 'N/A — completion document',
          riskRelevance: 'all',
        },
      ],
      signOffRequirements: this._signOff([
        { role: 'In-charge / Senior', timing: 'Before partner review', requirement: 'Complete all completion procedures; assemble file; draft MRL' },
        { role: 'Manager', timing: 'Before partner sign-off', requirement: 'Review entire audit file; clear all review points; review financial statements' },
        { role: 'Engagement Quality Reviewer', timing: 'Before report issue (if required)', requirement: 'EQR review of significant risks, judgements, opinion' },
        { role: 'Partner', timing: 'Report date', requirement: 'Approve final financial statements; sign MRL; sign audit report' },
      ]),
      guidanceNotes: [
        "The auditor's report cannot be issued until: (a) the MRL is signed; (b) the going concern assessment is completed; (c) subsequent events review covers up to the report date; (d) all audit differences are resolved or accepted; (e) EQR is complete (if required).",
        'For group audits, ensure all component auditor reports are received before issuing the group report.',
        'The date of the auditor\'s report cannot be earlier than the date on which the auditor has obtained sufficient appropriate evidence to support the opinion.',
      ],
      riskConsiderations: [
        'Never sign the audit report until all completion procedures are finished and documented.',
        'If new information emerges after the report is signed but before the financial statements are issued, apply ISA 560 para 16 procedures.',
      ],
      evidenceChecklist: [
        '[ ] Audit differences schedule completed and reviewed by partner',
        '[ ] Subsequent events review performed to report date',
        '[ ] Going concern final assessment documented',
        '[ ] Management representations letter signed',
        '[ ] Draft financial statements reviewed for accuracy',
        "[ ] Auditor's report drafted and approved",
        '[ ] EQR completed (if applicable)',
        '[ ] Partner sign-off on audit opinion',
      ],
      smartAnalytics: [
        { type: 'analytics_zscore', reason: 'Final Altman Z-Score to corroborate going concern conclusion' },
        { type: 'analytics_mscore', reason: 'Final Beneish M-Score to assess overall earnings quality before signing' },
      ],
    };
  }

  // ─── ANALYTICS SECTIONS ────────────────────────────────────────────────────

  _populateBenford(_context) {
    return {
      title: "Benford's Law Analysis",
      isaReferences: [{ ref: 'ISA 240 para 32', description: 'Unpredictability in audit procedures — data analytics' }],
      accountingStandards: [],
      objectives: ["Apply Benford's Law to detect anomalous patterns in financial data indicating manipulation or error"],
      assertions: ['Occurrence', 'Accuracy'],
      procedures: [{
        id: 'BENV-001', isaReference: 'ISA 240 para 32', accountingStandard: 'N/A',
        assertion: ['Occurrence', 'Accuracy'],
        title: "Benford's Law — Full Setup and Execution",
        objective: 'Statistical test of first-digit frequency distribution against expected Benford distribution to identify anomalies.',
        steps: [
          '(1) Extract data population: minimum 1,000 records. Fields: transaction ID, date, amount, account code, user ID. Verify completeness of extract against control totals.',
          '(2) Calculate first-digit frequency: for each record, extract first significant digit (1–9). Build frequency table: count and % for each digit. Expected: 1=30.1%, 2=17.6%, 3=12.5%, 4=9.7%, 5=7.9%, 6=6.7%, 7=5.8%, 8=5.1%, 9=4.6%.',
          '(3) Run chi-square test: χ² = Σ[(O−E)²/E] for 9 digits. Critical value at 0.05 significance, 8 df = 15.51. Calculate Mean Absolute Deviation (MAD). Classify: <0.006 = close conformity; 0.006–0.012 = acceptable; >0.015 = non-conformity.',
          '(4) For flagged digits (deviation > 5 pp): extract all transactions for that digit. Analyse: clustering around thresholds, same user, post-business-hours, round numbers, duplicate amounts. Select sample for vouching.',
          '(5) Also run second-digit, last-digit, and number-duplication tests. Document all results, chi-square outputs, and follow-up procedures. Conclude on whether anomalies represent fraud risk or benign business characteristics.',
        ],
        evidence: ['Data extract (full population)', "Benford's Law analysis workbook", 'Flagged transactions and follow-up vouching'],
        sampleSize: 'Full population (minimum 1,000 records)',
        exceptionDefinition: 'MAD > 0.015 or chi-square > 15.51 with unexplained deviation from Benford distribution.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'During fieldwork', requirement: 'Run and document analysis; follow up anomalies' }]),
      guidanceNotes: ["Benford's Law is most powerful for large populations of naturally occurring numbers. It is less applicable for data with a constrained range (e.g., all transactions between £100–£999)."],
      riskConsiderations: ['Run on all high-risk transaction populations: revenue, cash payments, payroll, journal entries.'],
      evidenceChecklist: ['[ ] Data extract obtained and complete', "[ ] Benford's Law analysis performed", '[ ] Flagged items investigated'],
      smartAnalytics: [],
    };
  }

  _populateDuPont(_context) {
    return {
      title: 'DuPont Decomposition Analysis',
      isaReferences: [{ ref: 'ISA 520', description: 'Analytical procedures — DuPont used as substantive analytical' }],
      accountingStandards: [],
      objectives: ['Decompose return on equity into component drivers to identify operational, efficiency, or leverage anomalies'],
      assertions: ['Accuracy', 'Completeness'],
      procedures: [{
        id: 'DUP-001', isaReference: 'ISA 520 para 5', accountingStandard: 'N/A',
        assertion: ['Accuracy', 'Completeness'],
        title: 'DuPont Three-Factor and Five-Factor Decomposition',
        objective: 'Identify which components of financial performance have changed year-on-year and assess whether the changes are consistent with audit evidence.',
        steps: [
          '(1) Three-factor DuPont: ROE = Net Profit Margin × Asset Turnover × Equity Multiplier. Calculate each factor for current year and prior year. Build comparison table with £ and % change.',
          '(2) Five-factor DuPont: ROE = (EBIT/Revenue) × (Revenue/Assets) × (Assets/Equity) × (EBT/EBIT) × (Net Income/EBT). This separates: operating efficiency, asset efficiency, leverage, interest burden, tax efficiency.',
          '(3) For each component that changes by >20% year-on-year: identify the cause; corroborate to other audit evidence obtained (e.g., revenue growth — corroborate to REV procedures; margin change — corroborate to cost testing; leverage change — corroborate to financing activities).',
          '(4) Compare all ratios to industry benchmarks. Significant deviations from industry norms without explanation are red flags for misstatement.',
          '(5) Document all components, year-on-year changes, explanations, and corroboration. Conclude on whether the financial performance is consistent with audit evidence.',
        ],
        evidence: ['Financial statements (current and prior year)', 'Industry benchmark data', 'DuPont analysis workbook'],
        sampleSize: 'N/A — analytical procedure',
        exceptionDefinition: 'Any DuPont component changing by >20% year-on-year without a corroborated explanation.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'Planning and completion', requirement: 'Perform DuPont analysis at planning and update at completion' }]),
      guidanceNotes: ['DuPont analysis is most useful for manufacturing and retail entities. For financial services, adapt the ratios accordingly.'],
      riskConsiderations: ['Perform at both planning (to set expectations) and completion (to confirm expectations were met).'],
      evidenceChecklist: ['[ ] DuPont calculated for current and prior year', '[ ] Industry benchmarks obtained', '[ ] Anomalies investigated'],
      smartAnalytics: [],
    };
  }

  _populateZScore(_context) {
    return {
      title: 'Altman Z-Score — Financial Distress Analysis',
      isaReferences: [{ ref: 'ISA 570 (Revised) para 9', description: 'Going concern assessment — quantitative indicators' }],
      accountingStandards: [],
      objectives: ['Quantify the probability of financial distress using the Altman Z-Score model to support the going concern assessment'],
      assertions: ['N/A — analytical tool'],
      procedures: [{
        id: 'ZSCORE-001', isaReference: 'ISA 570 (Revised) para 9', accountingStandard: 'N/A',
        assertion: ['N/A'],
        title: 'Altman Z-Score Calculation and Interpretation',
        objective: 'Calculate the Altman Z-Score and interpret the result in the context of the going concern assessment.',
        steps: [
          '(1) Obtain from the financial statements: Working Capital (WC = Current Assets − Current Liabilities); Retained Earnings (RE); EBIT (Earnings Before Interest and Tax); Market Value of Equity (MVE — use book equity for private companies); Total Sales; Total Assets; Total Liabilities.',
          '(2) Calculate the five ratios: X1 = WC / Total Assets; X2 = RE / Total Assets; X3 = EBIT / Total Assets; X4 = MVE / Total Liabilities; X5 = Sales / Total Assets.',
          '(3) Apply the Z-Score formula: For public manufacturing firms: Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 1.0X5. For private firms: Z\' = 0.717X1 + 0.847X2 + 3.107X3 + 0.420X4 + 0.998X5. For non-manufacturing: Z\'\' = 6.56X1 + 3.26X2 + 6.72X3 + 1.05X4.',
          "(4) Interpret the result: Public firms: Z > 2.99 = Safe zone; 1.81–2.99 = Grey zone; < 1.81 = Distress zone. Private firms: Z' > 2.9 = Safe; 1.23–2.9 = Grey; < 1.23 = Distress. Document the interpretation and its relevance to the going concern assessment.",
          '(5) Compare to prior year Z-Score. Identify the trend. A declining Z-Score across multiple years is a significant going concern indicator. Document the conclusion and cross-reference to the going concern assessment (PLAN-006 / COMP-003).',
        ],
        evidence: ['Financial statements (current and prior year)', 'Z-Score calculation workbook'],
        sampleSize: 'N/A — analytical procedure',
        exceptionDefinition: 'Z-Score in the Distress zone — requires immediate escalation to partner and enhanced going concern procedures.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'Planning and completion', requirement: 'Calculate Z-Score at planning and completion; escalate if in distress zone' }]),
      guidanceNotes: ['The Z-Score is a quantitative indicator only — it must be used alongside qualitative factors in the going concern assessment. It has limitations for financial services and very small entities.'],
      riskConsiderations: ['Any Z-Score in the distress zone triggers mandatory enhanced going concern procedures.'],
      evidenceChecklist: ['[ ] Z-Score calculated for current and prior year', '[ ] Result interpreted and documented', '[ ] Cross-referenced to going concern assessment'],
      smartAnalytics: [],
    };
  }

  _populateMScore(_context) {
    return {
      title: 'Beneish M-Score — Earnings Manipulation Detection',
      isaReferences: [{ ref: 'ISA 240 para 32', description: 'Fraud risk — earnings manipulation detection' }],
      accountingStandards: [],
      objectives: ['Apply the Beneish M-Score model to identify quantitative indicators of earnings manipulation in the financial statements'],
      assertions: ['Occurrence', 'Accuracy'],
      procedures: [{
        id: 'MSCORE-001', isaReference: 'ISA 240 para 32', accountingStandard: 'N/A',
        assertion: ['Occurrence', 'Accuracy'],
        title: 'Beneish M-Score Eight-Variable Model',
        objective: 'Calculate the Beneish M-Score to detect the probability of earnings manipulation.',
        steps: [
          '(1) Obtain from the financial statements (current year = t, prior year = t−1): Receivables (t, t−1); Net Sales (t, t−1); Cost of Goods Sold (t, t−1); Total Assets (t, t−1); PPE gross (t, t−1); Depreciation (t, t−1); Selling/General/Admin expenses (t, t−1); Total long-term debt (t, t−1); Net income before extraordinary (t, t−1); Cash from operations (t, t−1).',
          '(2) Calculate the eight indices: DSRI = (Receivables t / Sales t) / (Receivables t−1 / Sales t−1); GMI = Gross Margin t−1 / Gross Margin t; AQI = (1 − (PPE + CA) / TA) t / (1 − (PPE + CA) / TA) t−1; SGI = Sales t / Sales t−1; DEPI = Depreciation t−1 / (Depreciation t−1 + PPE t−1) / (Depreciation t / (Depreciation t + PPE t)); SGAI = (SGA / Sales) t / (SGA / Sales) t−1; LVGI = Total Debt / Total Assets t / Total Debt / Total Assets t−1; TATA = (Net Income − CFO) / Total Assets.',
          '(3) Apply the M-Score formula: M = −4.84 + 0.920×DSRI + 0.528×GMI + 0.404×AQI + 0.892×SGI + 0.115×DEPI − 0.172×SGAI + 4.679×TATA − 0.327×LVGI.',
          '(4) Interpret: M-Score > −1.78 indicates a likely manipulator. M-Score < −2.22 indicates a non-manipulator. Range between −2.22 and −1.78 is a grey zone requiring further investigation.',
          '(5) For each of the eight indices that drives the M-Score above the threshold: investigate the underlying accounting: DSRI above 1 suggests receivables growing faster than sales (possible revenue overstatement); GMI above 1 suggests deteriorating gross margins (possible cost understatement); TATA above average suggests large accruals (possible earnings management). Document findings and cross-reference to audit procedures for the relevant FSLI.',
        ],
        evidence: ['Financial statements (current and prior year)', 'M-Score calculation workbook', 'Investigation notes for elevated indices'],
        sampleSize: 'N/A — analytical procedure (all financial statement data)',
        exceptionDefinition: 'M-Score > −1.78 indicating likely manipulation — requires escalation to partner and targeted follow-up procedures.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'Planning and completion', requirement: 'Calculate M-Score; escalate if above −1.78' }]),
      guidanceNotes: ['The M-Score requires two years of data — it cannot be calculated for first-year audits without comparative data. It has limitations for financial services entities.'],
      riskConsiderations: ['M-Score above −1.78 triggers targeted investigation of the elevated indices.'],
      evidenceChecklist: ['[ ] M-Score calculated', '[ ] All eight indices computed', '[ ] Result interpreted and documented'],
      smartAnalytics: [],
    };
  }

  _populateJournalEntries(context) {
    const { _m, _pm } = this._fmt(context);
    return {
      title: 'Journal Entry Testing (ISA 240)',
      isaReferences: [
        { ref: 'ISA 240 para 32', description: 'Testing journal entries and other adjustments for fraud risk' },
        { ref: 'ISA 315', description: 'Understanding IT controls over journal entry posting' },
      ],
      accountingStandards: [],
      objectives: ['Identify unusual or fraudulent journal entries — a primary response to management override of controls risk'],
      assertions: ['Occurrence', 'Accuracy', 'Cutoff'],
      procedures: [{
        id: 'JE-001', isaReference: 'ISA 240 para 32', accountingStandard: 'N/A',
        assertion: ['Occurrence', 'Accuracy'],
        title: 'Journal Entry Population Analysis and Risk-Based Testing',
        objective: 'Identify and test journal entries with characteristics indicating management override, fraud, or error.',
        steps: [
          `(1) Extract the complete journal entry population from the general ledger for the audit period. Verify the extract is complete: agree total debit = total credit; agree journal count to system journal log. Fields required: journal ID, date, period, debit account, credit account, amount, description, user ID (preparer), user ID (approver), time of posting.`,
          `(2) Apply automated risk-based filters to identify unusual journal entries: (a) Journals posted outside normal business hours (before 7am, after 7pm, weekends, public holidays) — may indicate entries made without proper oversight; (b) Journals with round numbers (e.g., exactly £10,000, £50,000) — unusual if the entity's normal transactions are not round; (c) Journals posted by senior users (CFO, CEO, IT administrator) — may bypass normal controls; (d) Journals to unusual account combinations (e.g., debit revenue, credit cash — reversing a revenue entry; debit expense, credit equity — unusual); (e) Year-end and period-end journals (posted in the last 3 days of the period) with no reversing entry.`,
          `(3) Journals posted to accounts of particular interest: (a) Manual journals to revenue accounts — highest fraud risk; (b) Manual journals to provisions — manipulation of earnings; (c) Manual journals to intercompany accounts; (d) Journals with descriptions such as 'reclassification', 'adjustment', 'correction', 'per instructions', or no description at all.`,
          `(4) For each selected high-risk journal entry: obtain the journal posting document; obtain supporting documentation (invoice, contract, reconciliation, board minute) justifying the entry; verify the entry was approved by an appropriately authorised person independent of the preparer; assess whether the entry has a plausible business rationale.`,
          `(5) Document all journal entries tested, the evidence obtained, and the conclusion for each. For any journal entry without adequate supporting documentation or approval, raise a finding. Conclude on whether journal entry testing has identified any indicators of management override or fraud.`,
        ],
        evidence: ['Complete journal entry population extract', 'Risk-filter analysis output', 'Supporting documentation for selected journals', 'Approval evidence for selected journals'],
        sampleSize: 'All high-risk filter matches + risk-based sample of remaining population',
        exceptionDefinition: 'Any journal entry lacking supporting documentation or authorisation, or any journal entry with an implausible business rationale.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'During fieldwork', requirement: 'Complete journal entry population analysis and testing' }]),
      guidanceNotes: ['Journal entry testing must be performed on every audit as a response to the non-rebuttable fraud risk of management override (ISA 240 para 31).'],
      riskConsiderations: ['For entities with weak IT controls over journal entry posting, extend the sample and consider whether IT general controls testing is required.'],
      evidenceChecklist: ['[ ] Journal entry population extracted', '[ ] Risk filters applied', '[ ] High-risk entries tested to supporting documentation'],
      smartAnalytics: [{ type: 'analytics_benford', reason: "Apply Benford's Law to journal entry amounts" }],
    };
  }

  _populateRegression(context) {
    const { m } = this._fmt(context);
    return {
      title: 'Predictive Analytics — Regression-Based Substantive Analytical Procedures',
      isaReferences: [{ ref: 'ISA 520 paras 5–7', description: 'Substantive analytical procedures — predictive analysis' }],
      accountingStandards: [],
      objectives: ['Build a predictive model for a financial statement amount and compare the prediction to the recorded amount to detect potential misstatement'],
      assertions: ['Completeness', 'Accuracy', 'Occurrence'],
      procedures: [{
        id: 'REG-001', isaReference: 'ISA 520 paras 5–7', accountingStandard: 'N/A',
        assertion: ['Completeness', 'Accuracy'],
        title: 'Regression-Based Predictive Model for Revenue / Key Balance',
        objective: 'Develop a statistical model predicting the financial statement amount based on independent variables; investigate deviations exceeding the precision threshold.',
        steps: [
          `(1) Select the account to predict: typically revenue, cost of sales, or interest income. Identify the independent variables (drivers): for revenue — units sold, selling price per unit, number of customers, days in period; for interest income — average loan balance × interest rate; for wages — headcount × average salary. Obtain monthly or weekly data for each variable.`,
          '(2) Build the regression model: using a minimum of 24 data points (2 years of monthly data), run an OLS regression of the account balance against the driver variables. Assess model fit: R² should be >0.85 for the model to be useful for audit purposes. If R² < 0.85, the model does not have sufficient precision to be used as a substantive procedure.',
          `(3) Use the model to predict the year-end balance (or monthly balance). Calculate the prediction interval at 95% confidence. If the recorded amount is within the prediction interval, no further investigation is required for this procedure. If the recorded amount is outside the prediction interval, investigate the difference.`,
          `(4) For differences exceeding £${m} outside the prediction interval: obtain management's explanation; corroborate the explanation with independent evidence; if the explanation is not satisfactory, extend other substantive procedures for the account.`,
          '(5) Document the model: independent variables, data period, regression output (coefficients, R², F-statistic, residual standard error), predicted value, recorded value, difference, and conclusion. Conclude on whether the recorded balance is consistent with the predictive model.',
        ],
        evidence: ['Driver data (monthly/weekly)', 'Regression model output (R², coefficients, prediction intervals)', 'Management explanations for deviations', 'Corroborating evidence for explanations'],
        sampleSize: 'N/A — analytical procedure (population-level)',
        exceptionDefinition: 'Recorded amount outside the 95% prediction interval by > £' + m + ' without a corroborated explanation.',
        riskRelevance: 'medium',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'During fieldwork', requirement: 'Build and document predictive model; follow up deviations' }]),
      guidanceNotes: ['Regression-based analytical procedures can replace detailed transaction testing for some accounts where the model has sufficient precision (R² > 0.85). Document the basis for relying on the analytical procedure.'],
      riskConsiderations: ['For high-risk accounts, regression analytics supplement rather than replace substantive testing.'],
      evidenceChecklist: ['[ ] Driver data obtained', '[ ] Regression model built and R² assessed', '[ ] Deviations investigated'],
      smartAnalytics: [],
    };
  }

  _populateBenchmarking(context) {
    const { ind } = this._fmt(context);
    return {
      title: 'Peer Comparison and Industry Benchmarking',
      isaReferences: [{ ref: 'ISA 520', description: 'Analytical procedures — comparison to industry data' }],
      accountingStandards: [],
      objectives: ['Compare key financial ratios to industry peers to identify unexpected deviations that may indicate misstatement'],
      assertions: ['Accuracy', 'Completeness'],
      procedures: [{
        id: 'BENCH-001', isaReference: 'ISA 520', accountingStandard: 'N/A',
        assertion: ['Accuracy', 'Completeness'],
        title: `Industry Benchmarking — ${ind} Sector`,
        objective: 'Compare entity financial ratios to industry benchmarks to identify potential misstatements or unusual positions.',
        steps: [
          `(1) Identify the appropriate peer group: select 5–10 comparable companies in the ${ind} sector with similar size and business model. Sources: Companies House (free), FAME database, Bloomberg, industry reports, trade association statistics.`,
          '(2) Calculate the following key ratios for the entity and each peer: Profitability — Gross margin %, EBITDA margin %, Net margin %, Return on Assets %, Return on Equity %; Efficiency — Debtor days (DSO), Creditor days (DPO), Inventory days (DIO), Asset turnover; Liquidity — Current ratio, Quick ratio, Cash conversion cycle; Leverage — Debt/EBITDA, Interest cover, Net debt/equity.',
          '(3) Identify ratios where the entity is significantly outside the peer range (beyond ±2 standard deviations of the peer group, or outside the 25th–75th percentile range). For each outlier ratio: identify the financial statement line items driving the ratio; assess whether the deviation is explained by the entity\'s specific business model, accounting policy differences, or a genuine anomaly.',
          '(4) For outlier ratios that cannot be explained by business model differences: cross-reference to the relevant FSLI audit procedures. For example: debtor days significantly higher than peers — extend trade debtors testing and ECL assessment; gross margin significantly higher than peers — extend revenue and cost of sales testing; inventory days significantly higher — extend NRV testing.',
          '(5) Document all ratios, peer comparison data, identified outliers, explanations, and cross-references to other audit procedures. Conclude on whether the entity\'s financial ratios are consistent with its business and industry context.',
        ],
        evidence: ['Peer company financial data (sourced independently)', 'Ratio comparison table', 'Explanations for outliers', 'Cross-references to FSLI procedures'],
        sampleSize: 'N/A — analytical procedure',
        exceptionDefinition: 'Any ratio outside the peer range by > 2 standard deviations without a satisfactory explanation.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'Planning and completion', requirement: 'Complete benchmarking analysis; investigate outliers' }]),
      guidanceNotes: ['Industry benchmarking is most powerful at the planning stage to set expectations. Revisit at completion to confirm expectations were met.'],
      riskConsiderations: ['Significant deviations from industry norms in profitability ratios are one of the strongest indicators of financial statement manipulation.'],
      evidenceChecklist: ['[ ] Peer group identified', '[ ] Ratios calculated for entity and peers', '[ ] Outliers investigated and documented'],
      smartAnalytics: [],
    };
  }

  _populateRelatedParties(context) {
    const { m } = this._fmt(context);
    return {
      title: 'Related Party Detection Analytics',
      isaReferences: [
        { ref: 'ISA 550 paras 11–26', description: 'Related party identification procedures' },
        { ref: 'ISA 315', description: 'Understanding related party relationships' },
      ],
      accountingStandards: ['IAS 24 Related Party Disclosures', 'FRS 102 Section 33'],
      objectives: ['Identify related party transactions and balances through data analytics that may not have been disclosed by management'],
      assertions: ['Completeness', 'Disclosure'],
      procedures: [{
        id: 'RP-001', isaReference: 'ISA 550 paras 11–26', accountingStandard: 'IAS 24 / FRS 102 s33',
        assertion: ['Completeness', 'Disclosure'],
        title: 'Automated Related Party Transaction Detection',
        objective: 'Use data analytics to identify transactions with related parties that may not have been captured in the related party schedule.',
        steps: [
          '(1) Obtain the complete list of related parties from management (directors, shareholders >20%, key management, connected persons, group companies). Compile names, registration numbers, addresses, and bank account details (where known) into a reference table.',
          '(2) Run name-matching algorithms against: (a) purchase ledger supplier names — match against related party reference table using exact, phonetic, and fuzzy matching; (b) bank payment beneficiary names — match against reference table; (c) sales ledger customer names — match against reference table; (d) employee names (payroll) — match against directors and key management list.',
          '(3) Run address matching: compare supplier/customer addresses in the ledgers against known addresses of directors and related parties. Flag matches. Common indicator: fictitious supplier at director\'s home address.',
          '(4) Run bank account matching: where bank account numbers for payments are available, compare to any bank accounts of directors or related parties known to the firm. Flag matches.',
          `(5) Review all flagged matches: for each match, obtain the transaction details and supporting documentation; determine whether the transaction is a related party transaction that has been properly disclosed; if not disclosed, raise a finding. Assess materiality (> £${m}) and determine whether financial statement disclosure under IAS 24 is required. Document all matches reviewed and conclusions.`,
        ],
        evidence: ['Related party reference table', 'Name-matching analysis output', 'Address-matching analysis output', 'Transaction details for flagged items', 'Supporting documentation'],
        sampleSize: 'Full transaction population (automated screening)',
        exceptionDefinition: 'Any undisclosed related party transaction identified through data analytics.',
        riskRelevance: 'all',
      }],
      signOffRequirements: this._signOff([{ role: 'Senior / In-charge', timing: 'During fieldwork', requirement: 'Run related party screening; investigate all matches' }]),
      guidanceNotes: ['Related party fraud (payments to fictitious suppliers controlled by insiders) is one of the most common forms of management fraud. Data analytics significantly increases detection probability.'],
      riskConsiderations: ['For entities with weak governance, extend related party screening to all payment transactions rather than a sample.'],
      evidenceChecklist: ['[ ] Related party reference table compiled', '[ ] Name and address matching performed', '[ ] Flagged transactions investigated', '[ ] IAS 24 disclosures confirmed complete'],
      smartAnalytics: [],
    };
  }

  // ─── GENERIC FALLBACK ──────────────────────────────────────────────────────

  _getGenericSection(section, context) {
    const { m, pm, ss, rl } = this._fmt(context);
    return {
      title: `${section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — General Procedures`,
      isaReferences: [{ ref: 'ISA 500', description: 'Audit evidence — general substantive procedures' }],
      accountingStandards: ['Applicable IFRS / FRS 102 standards'],
      objectives: [`Obtain sufficient appropriate audit evidence over the ${section} balance`],
      assertions: ['Existence', 'Completeness', 'Valuation', 'Accuracy', 'Cutoff'],
      procedures: [{
        id: `${section.toUpperCase().substring(0, 4)}-001`,
        isaReference: 'ISA 500 para 7',
        accountingStandard: 'Applicable standard',
        assertion: ['Existence', 'Completeness', 'Valuation'],
        title: `${section} — Substantive Testing`,
        objective: `Verify the ${section} balance is complete, exists, and is accurately stated.`,
        steps: [
          `(1) Obtain the ${section} schedule/listing. Cast and agree total to trial balance.`,
          `(2) Select a sample of ${ss} items, stratified to include all items > £${m} plus a random selection of smaller items.`,
          `(3) For each sampled item: obtain and inspect supporting documentation; verify the item exists, is owned by the entity, and is accurately recorded.`,
          `(4) Perform cut-off procedures: identify transactions around the period-end and verify recording in the correct period.`,
          `(5) Conclude on whether the balance is free from material misstatement. Document exceptions and raise audit differences as applicable.`,
        ],
        evidence: ['Balance listing / schedule', 'Supporting documentation (sample)', 'Cut-off evidence'],
        sampleSize: ss,
        exceptionDefinition: `Any item that cannot be supported by documentation, or any item incorrectly recorded by > £${pm}.`,
        riskRelevance: rl,
      }],
      signOffRequirements: this._signOff([
        { role: 'Senior / In-charge', timing: 'On completion', requirement: 'Complete procedures and document results' },
        { role: 'Manager', timing: 'Within 5 business days', requirement: 'Review and approve' },
      ]),
      guidanceNotes: ['This is a generic procedure template. For a specific FSLI, use the dedicated section populator.'],
      riskConsiderations: [`Risk level assessed as: ${rl}. Adjust sample size and procedures accordingly.`],
      evidenceChecklist: [`[ ] ${section} balance agreed to TB`, '[ ] Sample testing completed', '[ ] Cut-off procedures performed'],
      smartAnalytics: [],
    };
  }
}

// ─── STANDALONE EXPORT ─────────────────────────────────────────────────────

export function getAutoPopulatedContent(section, context = {}) {
  const engine = new AutoPopulationEngine();
  return engine.populateSection(section, context);
}

export default AutoPopulationEngine;
