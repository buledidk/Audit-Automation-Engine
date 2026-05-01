// ═══════════════════════════════════════════════════════════════════════════════
// SUBSTANTIVE TESTING PROGRAMMES — D1 through D16
// Comprehensive audit procedures per ISA (UK) standards
// ═══════════════════════════════════════════════════════════════════════════════

export const TESTING_PROGRAMMES = {

  // ─────────────────────────────────────────────────────────────────────────────
  // D1 — REVENUE
  // ─────────────────────────────────────────────────────────────────────────────
  d1: {
    title: "Revenue Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that revenue recognised in the financial statements has occurred, is accurately recorded, is complete, is recognised in the correct period, and is properly classified in accordance with the applicable financial reporting framework (FRS 102 Section 23).",
    isaRef: "ISA (UK) 240.26; ISA (UK) 330; ISA (UK) 500; ISA (UK) 520",
    frsRef: "FRS 102 Section 23 — Revenue",
    risksAddressed: [
      "R01 — Revenue recognition: risk that revenue is overstated through premature recognition or fictitious transactions (presumed significant risk per ISA (UK) 240.26)",
      "R02 — Cut-off: risk that revenue is recorded in the wrong accounting period, particularly around the year end",
      "R03 — Completeness: risk that revenue streams are omitted or understated, including deferred revenue not properly released"
    ],
    assertions: ["Occurrence", "Accuracy", "Cut-off", "Classification", "Completeness"],
    population: "All revenue transactions recorded in the general ledger for the period under audit, including deferred revenue balances brought forward and carried forward. Population obtained from the nominal ledger revenue accounts and sales daybook.",
    samplingApproach: "ISA (UK) 530 — Monetary Unit Sampling (MUS) applied to the revenue population stratified by revenue stream. Sampling interval calculated as tolerable misstatement divided by the risk factor. Items exceeding individually significant thresholds tested 100%. Remaining population sampled using systematic MUS with a random start point.",
    procedures: [
      {
        step: 1,
        description: "Obtain the complete revenue listing from the nominal ledger for the period. Cast the listing and reconcile the total to the trial balance and draft financial statements. Investigate any differences exceeding £500.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "Request the full sales daybook / revenue analysis from the client's accounting system. Re-perform the addition. Agree the total to the TB line for turnover. Any variance must be explained and documented."
      },
      {
        step: 2,
        description: "For a sample of revenue transactions selected via MUS, vouch each transaction to the underlying sales invoice, signed customer contract or purchase order, and evidence of delivery (despatch note, proof of delivery, or service completion certificate).",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 500.10; ISA (UK) 240.26",
        detail: "For each sampled item: (a) inspect the sales invoice for customer name, date, amount, and description; (b) agree to signed contract or PO; (c) inspect despatch note or POD confirming goods/services were delivered prior to or on the invoice date; (d) verify the transaction is with a bona fide third party, not a related party disguised as arm's length."
      },
      {
        step: 3,
        description: "Perform cut-off testing by selecting the last 10 revenue transactions before the year end and the first 10 after the year end. For each, verify that revenue was recognised in the correct period by reference to delivery/completion date.",
        assertion: "Cut-off",
        isaRef: "ISA (UK) 330.20",
        detail: "Obtain the sales daybook entries either side of the year end. For the last 10 pre-year-end entries: agree delivery date to despatch note / POD and confirm delivery occurred before the year end. For the first 10 post-year-end entries: confirm delivery occurred after the year end. Any items where delivery date and recognition date fall in different periods represent cut-off errors to be quantified."
      },
      {
        step: 4,
        description: "For material contracts with performance obligations spanning the year end, assess whether the revenue recognition policy complies with FRS 102 Section 23. Evaluate the stage-of-completion method where applicable.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 540; FRS 102 s23.14–23.17",
        detail: "Identify contracts where services are partially complete at the year end. For each: (a) obtain the contract terms and total contract value; (b) determine the method used to measure stage of completion (e.g. cost-to-cost, milestones); (c) recalculate the revenue to be recognised using the stage-of-completion data; (d) compare to the amount recognised and investigate differences exceeding 5% of contract value."
      },
      {
        step: 5,
        description: "Test the deferred revenue balance at the year end. For a sample of items within the deferred revenue schedule, verify that the deferral is appropriate by reference to the contract terms and delivery/performance dates.",
        assertion: "Cut-off",
        isaRef: "ISA (UK) 500.10; FRS 102 s23.10",
        detail: "Obtain the deferred revenue schedule. Select items covering at least 80% of the balance by value. For each: (a) agree the total contract value to the signed agreement; (b) verify the period over which revenue should be released; (c) recalculate the deferred element at the year end; (d) agree the released portion to the P&L. Differences exceeding £250 to be listed as potential misstatements."
      },
      {
        step: 6,
        description: "Perform an analytical review of revenue by month, comparing to prior year and to budget. Investigate fluctuations exceeding 10% from the expected pattern, with particular focus on revenue spikes near the year end.",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 520.5",
        detail: "Plot monthly revenue for the current and prior year. Calculate month-on-month variances and year-on-year variances. Where a month deviates by more than 10% from the expected amount (based on prior year trend adjusted for known factors), obtain explanations from management and corroborate with supporting evidence (e.g. new contracts, seasonal patterns, one-off transactions)."
      },
      {
        step: 7,
        description: "Test the classification of revenue between operating revenue streams in the financial statements. Verify that revenue is not misclassified as other income or vice versa, and that disaggregation in the notes complies with FRS 102.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s23.30",
        detail: "Obtain the revenue disaggregation schedule. For each category: (a) select a sample of transactions and verify the GL coding agrees to the nature of the sale; (b) confirm the descriptions in the financial statements accurately reflect the revenue streams; (c) verify that grants, recharges, or intercompany amounts are not included in turnover unless appropriate."
      },
      {
        step: 8,
        description: "For credit notes and returns processed after the year end, test whether a provision or adjustment is required at the year end. Select all credit notes issued in the first 30 days post year end and trace to the original sale.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 560.6",
        detail: "Obtain the credit note listing for the 30 days following the year end. For each credit note: (a) identify the original invoice date and period; (b) determine whether the credit note relates to a condition that existed at the year end (e.g. faulty goods, pricing dispute); (c) if so, verify whether the financial statements include an adequate provision. Quantify any unrecorded adjustments."
      },
      {
        step: 9,
        description: "Where the entity has bill-and-hold arrangements, consignment sales, or sale-or-return transactions, perform additional procedures to verify that the risks and rewards of ownership have transferred in accordance with FRS 102 Section 23.10.",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 240.26; FRS 102 s23.10",
        detail: "Identify any non-standard revenue arrangements by enquiry of management and review of material contracts. For each: (a) evaluate whether the recognition criteria in FRS 102 s23.10 are met (transfer of significant risks and rewards, reliable measurement, probable economic benefits); (b) if bill-and-hold, verify the buyer has requested the arrangement, the goods are separately identified and ready for delivery; (c) document the conclusion on each arrangement."
      },
      {
        step: 10,
        description: "Agree the revenue figure per the financial statements to the corporation tax computation and VAT returns. Investigate any reconciling items.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the CT computation and the annual VAT reconciliation. Reconcile turnover per the accounts to: (a) turnover per the CT computation — differences should be limited to disallowable items or timing; (b) turnover per cumulative VAT returns — differences should be explained by exempt supplies, zero-rated items, or timing. Any unexplained differences may indicate unrecorded revenue or fictitious revenue."
      }
    ],
    expectedResults: "Revenue per the financial statements agrees to the underlying records, is supported by valid contracts and delivery evidence, is recognised in the correct period, and is properly classified. No material misstatements identified.",
    exceptionHandling: "Any exceptions identified should be recorded on the schedule of unadjusted differences. Extrapolate MUS sample errors to the population in accordance with ISA (UK) 530.14. Discuss exceptions with the engagement partner and, where material, request management to adjust the financial statements. If management declines to adjust, consider the impact on the audit opinion per ISA (UK) 450.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding the revenue balance of £[X] as at [date]. [No material misstatements were identified / The following misstatements were identified: ...]. The revenue recognition policies applied are [consistent / inconsistent] with FRS 102 Section 23. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D2 — RECEIVABLES
  // ─────────────────────────────────────────────────────────────────────────────
  d2: {
    title: "Trade & Other Receivables Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that trade and other receivables recognised in the statement of financial position exist, are accurately valued at the lower of cost and recoverable amount, are complete, and that the entity has rights to the recorded balances, in accordance with FRS 102 Section 11.",
    isaRef: "ISA (UK) 505; ISA (UK) 330; ISA (UK) 500; ISA (UK) 540",
    frsRef: "FRS 102 Section 11 — Basic Financial Instruments",
    risksAddressed: [
      "R04 — Existence: risk that receivable balances recorded at the year end do not represent genuine amounts owed by third parties",
      "R05 — Valuation: risk that receivable balances are not recoverable and the bad debt provision is inadequate or excessive",
      "R06 — Cut-off: risk that receivables include amounts relating to post-year-end sales, or exclude amounts relating to pre-year-end sales"
    ],
    assertions: ["Existence", "Rights & Obligations", "Accuracy/Valuation", "Completeness", "Cut-off"],
    population: "All trade receivable balances per the sales ledger at the year-end date, together with other receivable balances (prepayments, accrued income, VAT receivable, intercompany receivables) per the trial balance.",
    samplingApproach: "ISA (UK) 530 — For circularisation, select all individually material balances (above the individually significant item threshold) plus a random sample from the remaining population using MUS. For subsequent receipts testing, test all balances above the ISI threshold and a further sample using stratified random selection.",
    procedures: [
      {
        step: 1,
        description: "Obtain the aged trade receivables listing at the year end. Cast the listing and reconcile the total to the trial balance and the trade receivables figure in the draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "Request the aged debtor report as at the year-end date. Re-perform the column and grand totals. Agree the grand total to the TB. Investigate any reconciling items (e.g. intercompany balances, credit balances within debtors). Differences exceeding £100 must be explained."
      },
      {
        step: 2,
        description: "Perform direct positive circularisation of trade receivable balances in accordance with ISA (UK) 505. Send confirmation requests to all customers with balances exceeding the individually significant threshold, plus a sample of remaining balances.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505.7–505.12",
        detail: "Prepare confirmation letters on client letterhead (or auditor letterhead where agreed). Post directly to the customer's confirmed address. Maintain control over the process — do not allow the client to send or intercept replies. For each confirmation received: (a) agree the confirmed balance to the ledger; (b) investigate differences exceeding £100; (c) for non-replies, perform alternative procedures (step 3)."
      },
      {
        step: 3,
        description: "For circularisation non-replies and for balances not selected for circularisation, perform subsequent receipts testing. Trace the year-end balance to cash received after the year end by reference to the bank statement and remittance advices.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505.12; ISA (UK) 500.10",
        detail: "For each balance: (a) obtain the post-year-end bank statements and cash receipts listing; (b) trace the specific customer payment(s) received after the year end that clear the year-end balance; (c) if the balance remains unpaid, vouch to the original invoice and supporting delivery documentation; (d) if no evidence of subsequent receipt or supporting documentation, consider whether the balance should be provided for."
      },
      {
        step: 4,
        description: "Review the aged receivables analysis and assess the adequacy of the bad debt provision. Challenge management's assumptions regarding the recoverability of overdue balances.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s11.21–11.22",
        detail: "Analyse the ageing profile: (a) calculate the proportion of debt in each ageing bracket (current, 30, 60, 90, 120+ days); (b) compare the current profile to the prior year and industry benchmarks; (c) for the specific provision, review management's customer-by-customer assessment and corroborate with correspondence, credit reports, or legal proceedings; (d) for the general provision, assess the provision rate against historical write-off rates for the past 3 years; (e) recalculate the total provision and compare to management's figure."
      },
      {
        step: 5,
        description: "Test receivables cut-off by selecting the last 10 sales invoices raised before the year end and the first 10 raised after the year end. For each, verify that the transaction is recorded in the correct period.",
        assertion: "Cut-off",
        isaRef: "ISA (UK) 330.20",
        detail: "For the last 10 pre-year-end invoices: agree the delivery date (per despatch note or POD) to before the year end. For the first 10 post-year-end invoices: confirm the delivery date is after the year end. Any items where delivery falls in a different period from recognition are cut-off errors to be quantified and reported."
      },
      {
        step: 6,
        description: "Review credit balances within the trade receivables ledger. Investigate all credit balances exceeding £500 and assess whether they require reclassification to trade payables.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s4.2",
        detail: "Extract all accounts with credit balances from the sales ledger. For each material credit balance: (a) determine the cause (overpayment, credit note, advance payment); (b) assess whether the balance should be reclassified to creditors; (c) confirm that the net presentation of debtors in the financial statements does not offset credit balances unless a legal right of set-off exists."
      },
      {
        step: 7,
        description: "For prepayments and accrued income included within other receivables, verify the existence and accuracy of the balances by vouching to underlying contracts, invoices, or calculations.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the prepayments and accrued income schedule. For each item exceeding the testing threshold: (a) for prepayments, agree the amount to the original invoice and verify the period covered extends beyond the year end; (b) for accrued income, verify the service has been provided or goods delivered by the year end and agree the amount to the contract; (c) recalculate the time-apportioned balance."
      },
      {
        step: 8,
        description: "Test intercompany receivable balances by confirming balances directly with the counterparty entity. Verify that the corresponding payable is recorded in the other entity's books.",
        assertion: "Existence",
        isaRef: "ISA (UK) 550.16",
        detail: "For each intercompany receivable balance: (a) confirm the balance with the counterparty's finance team or auditor; (b) investigate any differences; (c) verify that intercompany eliminations have been correctly processed for consolidated accounts (if applicable); (d) confirm the balances are on arm's length terms or appropriately disclosed."
      },
      {
        step: 9,
        description: "Review post-year-end write-offs and credit notes for the first 60 days after the year end. Assess whether any indicate conditions existing at the year end that require adjustment.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 560.6",
        detail: "Obtain the listing of write-offs and credit notes processed in the 60 days post year end. For each: (a) determine whether it relates to a year-end balance; (b) assess whether the underlying condition existed at the year end (e.g. dispute, insolvency, returns); (c) if so, verify whether the provision or financial statements have been adjusted accordingly."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for trade and other receivables, verifying compliance with FRS 102 Section 11 and Section 4 (Statement of Financial Position) presentation requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s4.4, s11.40",
        detail: "Check: (a) current vs non-current classification is correct based on expected settlement dates; (b) amounts due from group undertakings are separately disclosed; (c) the bad debt provision policy is disclosed in accounting policies; (d) material prepayments are separately identified if material; (e) any receivables pledged as security are disclosed."
      }
    ],
    expectedResults: "Trade and other receivable balances exist, are accurately valued allowing for adequate provisioning, are complete, and are properly presented in the financial statements. Circularisation responses confirm balances or differences are satisfactorily explained. The bad debt provision is reasonable based on the evidence obtained.",
    exceptionHandling: "Any circularisation differences not satisfactorily resolved should be treated as misstatements. Where subsequent receipts testing does not confirm the balance, consider increasing the bad debt provision. Extrapolate sample errors per ISA (UK) 530.14. Report all unadjusted differences on the schedule of uncorrected misstatements and evaluate materiality.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding trade and other receivables of £[X] as at [date]. [Circularisation responses were satisfactory / The following unresolved differences were noted: ...]. The bad debt provision of £[X] is [adequate / inadequate]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D3 — INVENTORY / WORK IN PROGRESS
  // ─────────────────────────────────────────────────────────────────────────────
  d3: {
    title: "Inventory & Work in Progress Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that inventories and work in progress recognised in the statement of financial position exist, are owned by the entity, are accurately valued at the lower of cost and estimated selling price less costs to complete and sell, and are complete, in accordance with FRS 102 Section 13.",
    isaRef: "ISA (UK) 501.3–501.8; ISA (UK) 330; ISA (UK) 500; ISA (UK) 540",
    frsRef: "FRS 102 Section 13 — Inventories",
    risksAddressed: [
      "R07 — Existence: risk that inventory quantities are overstated, including fictitious stock or inaccurate count records",
      "R08 — Valuation: risk that inventory is held at above net realisable value, cost calculations include inappropriate overheads, or obsolete/slow-moving stock is not provided for",
      "R09 — Completeness: risk that inventory held at third-party locations, goods in transit, or consignment stock is omitted from the records"
    ],
    assertions: ["Existence", "Rights & Obligations", "Accuracy/Valuation", "Completeness", "Cut-off"],
    population: "All inventory items per the stock listing at the year-end date, including raw materials, work in progress, and finished goods held at own premises and at third-party locations. Population includes the perpetual inventory records and the year-end stock count sheets.",
    samplingApproach: "ISA (UK) 530 — For stock count attendance, select test counts covering at least 80% of inventory by value plus a representative sample from each stock category. For valuation testing, use MUS with stratification by inventory category. All items exceeding the individually significant item threshold are tested 100%.",
    procedures: [
      {
        step: 1,
        description: "Attend the year-end physical stock count in accordance with ISA (UK) 501. Observe the count procedures, assess the adequacy of the client's count instructions, and perform independent test counts.",
        assertion: "Existence",
        isaRef: "ISA (UK) 501.4",
        detail: "Prior to the count: (a) review the client's count instructions for adequacy (teams, areas, tags/sheets, cut-off arrangements, movement controls); (b) tour the premises to understand stock locations. During the count: (c) observe counting teams for compliance with instructions; (d) perform at least 20 floor-to-sheet test counts (selecting items on the floor and tracing to the count record) and 20 sheet-to-floor test counts (selecting recorded items and verifying on the floor); (e) note the last GRN and despatch note numbers for cut-off purposes; (f) identify and note any obsolete, damaged, or slow-moving items observed."
      },
      {
        step: 2,
        description: "Obtain the final stock listing used in the financial statements. Reconcile the listing to the stock count records and to the trial balance. Verify that adjustments arising from the stock count have been properly processed.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 501.6; ISA (UK) 500.9",
        detail: "Cast the final stock listing. Agree the total to the TB. Obtain the reconciliation from the count sheets to the final listing and verify: (a) all count adjustments are included; (b) any items counted but excluded (third-party stock, consignment goods) are validly excluded; (c) the test counts performed at step 1 agree to the final listing; (d) the listings of items at third-party locations are included."
      },
      {
        step: 3,
        description: "Test the valuation of raw materials and purchased goods by vouching the unit cost in the stock listing to the most recent purchase invoice or supplier price list.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s13.6",
        detail: "Select a sample of raw material and purchased finished goods lines using MUS. For each: (a) obtain the most recent purchase invoice pre-year-end; (b) compare the unit cost per the invoice to the unit cost in the stock listing; (c) where FIFO is used, verify the layering calculation; (d) where weighted average cost is used, recalculate the weighted average; (e) any difference exceeding 2% of line value to be reported as a potential misstatement."
      },
      {
        step: 4,
        description: "For manufactured goods and work in progress, test the cost build-up including direct materials, direct labour, and production overhead absorption. Verify that overhead absorption rates are based on normal capacity.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s13.8–13.9",
        detail: "Select a sample of WIP and finished goods items. For each: (a) agree the bill of materials to actual material costs; (b) verify labour hours and rates to payroll records or time sheets; (c) check the overhead absorption rate: obtain the total production overheads and divide by normal capacity (not actual if significantly below normal); (d) confirm that selling costs, storage costs (unless necessary in production), and administrative overheads are excluded from inventory cost per FRS 102 s13.10."
      },
      {
        step: 5,
        description: "Perform net realisable value (NRV) testing by comparing the carrying amount of a sample of inventory items to their estimated selling price less costs to complete and sell.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s13.4",
        detail: "For a sample covering all inventory categories: (a) obtain the post-year-end sales prices for each item; (b) deduct estimated costs to complete (for WIP) and estimated costs to sell; (c) compare the NRV to the carrying amount; (d) where NRV is below cost, verify that the stock listing has been written down; (e) assess whether write-downs in aggregate are material. Focus on slow-moving items (identified from the stock-turn analysis) and items observed as damaged at the count."
      },
      {
        step: 6,
        description: "Test inventory cut-off by tracing the last GRN and despatch note numbers recorded at the stock count to the purchase and sales records. Verify that goods received before the count are included in stock and recorded as payables, and goods despatched are excluded from stock and recorded as revenue.",
        assertion: "Cut-off",
        isaRef: "ISA (UK) 501.4; ISA (UK) 330.20",
        detail: "Using the GRN and despatch note numbers noted at step 1: (a) for the last 5 GRNs before the count, verify the goods are included in the stock listing and the purchase is recorded as a creditor; (b) for the first 5 GRNs after the count, verify the goods are excluded from stock; (c) for the last 5 despatch notes before the count, verify the goods are excluded from stock and the sale is recorded; (d) for the first 5 despatch notes after the count, verify the goods are included in stock."
      },
      {
        step: 7,
        description: "Assess the adequacy of the obsolescence and slow-moving inventory provision by analysing stock-turn ratios and ageing of inventory lines.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8",
        detail: "Calculate stock-turn by category (days) for current and prior year. Identify items with stock-turn exceeding 365 days (or the entity's normal cycle, if longer). For these items: (a) enquire of management regarding plans for disposal or use; (b) compare the provision percentage applied to historical write-off experience; (c) recalculate the provision on management's basis and compare to the recorded amount; (d) consider whether additional provision is required for items observed as damaged or obsolete during the stock count."
      },
      {
        step: 8,
        description: "For inventory held at third-party locations (warehouses, consignment stock, goods in transit), obtain direct confirmation from the third party or perform alternative procedures.",
        assertion: "Existence",
        isaRef: "ISA (UK) 501.8; ISA (UK) 505",
        detail: "Identify all inventory held at third-party locations. For each location: (a) send a direct confirmation request to the third party specifying the quantities and descriptions held; (b) agree the confirmed quantities to the stock listing; (c) if confirmation is not received, consider attending a count at the location or vouching to subsequent delivery records; (d) assess the reliability of the third party's records."
      },
      {
        step: 9,
        description: "Review the entity's right to inventory by checking for pledges, liens, retention of title clauses, or consignment arrangements that may affect ownership.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; FRS 102 s13.3",
        detail: "Enquire of management whether any inventory is subject to: (a) charges or pledges (review bank facility letters); (b) retention of title clauses by suppliers; (c) consignment-in arrangements where title has not passed. Where consignment-out stock exists at customer premises, verify it is included in the entity's stock listing. Confirm disclosures of pledged inventory are adequate."
      },
      {
        step: 10,
        description: "Perform an analytical review of inventory by comparing the year-end balance, stock-turn, and gross margin to the prior year and to industry benchmarks. Investigate unexpected movements.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 520.5",
        detail: "Calculate: (a) inventory days (closing stock / cost of sales × 365) and compare to prior year; (b) gross margin percentage by product line and compare to prior year; (c) raw materials, WIP, and finished goods as proportions of total inventory and compare to prior year. Investigate any movements exceeding 10% that are not explained by known business changes. Unexpected improvements in margin or reduction in stock days near the year end may indicate overstatement."
      }
    ],
    expectedResults: "Inventory and WIP per the financial statements are supported by physical count evidence, are valued at the lower of cost and NRV, are complete including third-party locations, and the obsolescence provision is adequate. No material cut-off errors identified.",
    exceptionHandling: "Count discrepancies exceeding the client's tolerance should be investigated and adjusted by the client. Valuation differences should be recorded on the schedule of unadjusted differences. If the stock count was materially misstated and client adjustments are inadequate, consider the impact on the audit opinion. Extrapolate valuation errors per ISA (UK) 530.14.",
    conclusionTemplate: "Based on the substantive procedures performed above, including attendance at the physical stock count on [date], [sufficient / insufficient] appropriate audit evidence has been obtained regarding inventory and WIP of £[X] as at [date]. [No material misstatements were identified / The following misstatements were identified: ...]. Inventory is valued in accordance with FRS 102 Section 13. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D4 — PAYABLES
  // ─────────────────────────────────────────────────────────────────────────────
  d4: {
    title: "Trade & Other Payables Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that trade and other payables recognised in the statement of financial position are complete (the primary assertion for payables), are accurately recorded, exist as genuine obligations, and are presented in accordance with FRS 102 Section 21.",
    isaRef: "ISA (UK) 505; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 21 — Provisions and Contingencies; FRS 102 Section 4",
    risksAddressed: [
      "R10 — Completeness: risk that trade payable balances are understated through the omission of liabilities, particularly around the year end (unrecorded liabilities)",
      "R11 — Cut-off: risk that purchases received before the year end are not recorded as payables, or purchases received after the year end are incorrectly accrued",
      "R12 — Accuracy: risk that accruals are incorrectly estimated, including under-accrual of costs to present a more favourable financial position"
    ],
    assertions: ["Completeness", "Existence", "Accuracy/Valuation", "Cut-off", "Classification"],
    population: "All trade payable balances per the purchase ledger at the year-end date, together with other payables (accruals, VAT payable, other taxation, other creditors, deferred income, intercompany payables) per the trial balance.",
    samplingApproach: "ISA (UK) 530 — For supplier statement reconciliations, select all suppliers with year-end balances exceeding the ISI threshold plus a sample from remaining balances stratified by supplier type. For the unrecorded liabilities search, test all invoices received post year end above the ISI threshold and a further MUS sample.",
    procedures: [
      {
        step: 1,
        description: "Obtain the trade payables listing at the year end. Cast the listing and reconcile the total to the trial balance and the trade payables figure in the draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "Request the aged creditor report as at the year-end date. Re-perform the total. Agree to the TB. Investigate reconciling items — particularly debit balances which may require reclassification to receivables. Any difference exceeding £100 must be explained."
      },
      {
        step: 2,
        description: "Perform supplier statement reconciliations for a sample of trade payable balances. Obtain supplier statements and reconcile to the purchase ledger balance, investigating all reconciling items.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 505.14",
        detail: "For each selected supplier: (a) obtain the supplier statement as close to the year end as possible; (b) reconcile the statement balance to the ledger balance; (c) for each reconciling item, determine whether it represents a timing difference (e.g. goods in transit, payments in transit) or an error; (d) where the statement balance exceeds the ledger balance, assess whether this represents an unrecorded liability; (e) items not satisfactorily reconciled exceeding £250 should be reported as potential misstatements."
      },
      {
        step: 3,
        description: "Perform an unrecorded liabilities search by examining invoices received and payments made after the year end. Identify any items that relate to goods or services received before the year end and verify they are recorded as payables or accruals.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10; ISA (UK) 330.20",
        detail: "Obtain the purchase daybook and cash payments listing for the 30 days (minimum) post year end. For all invoices and payments above the testing threshold: (a) determine whether the goods or services were received before the year end (by inspecting the invoice date, delivery note, or service period); (b) if so, verify the amount is recorded in the year-end trade payables or accruals; (c) any unrecorded items are potential understatements of payables to be reported on the schedule of unadjusted differences."
      },
      {
        step: 4,
        description: "Test accruals for completeness and accuracy. For each material accrual, verify the basis of the estimate and assess reasonableness by reference to actual invoices received post year end.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8",
        detail: "Obtain the accruals schedule. For each accrual exceeding the testing threshold: (a) understand the nature and basis of the estimate; (b) where the actual invoice has been received post year end, compare the accrued amount to the actual; (c) where the invoice has not yet been received, assess the basis of estimation — compare to prior year, to contracts, or to run-rate; (d) verify that prior year accruals have been properly released and any over/under accrual is reasonable; (e) calculate the net over/under accrual position across all accruals."
      },
      {
        step: 5,
        description: "Test payables cut-off by selecting the last 10 GRNs before the year end and the first 10 after the year end. Verify that the purchase and payable are recorded in the correct period.",
        assertion: "Cut-off",
        isaRef: "ISA (UK) 330.20",
        detail: "For the last 10 pre-year-end GRNs: verify the goods received date is before the year end and the purchase is recorded as a payable at the year end. For the first 10 post-year-end GRNs: verify the goods received date is after the year end and the purchase is not recorded as a year-end payable. Any cut-off errors are to be quantified and reported."
      },
      {
        step: 6,
        description: "Perform an analytical review of trade payables by calculating creditor days (closing payables / cost of sales × 365) and comparing to the prior year and to payment terms. Investigate significant movements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 520.5",
        detail: "Calculate creditor days for current and prior year. Where creditor days have decreased significantly (suggesting potential understatement of payables) or increased significantly (suggesting liquidity issues): (a) obtain management's explanation; (b) corroborate with evidence of changes in payment terms, supplier relationships, or purchasing volumes; (c) an unexplained significant reduction in creditor days at the year end is a risk indicator for unrecorded liabilities."
      },
      {
        step: 7,
        description: "Review debit balances within the purchase ledger. Investigate all debit balances exceeding £250 and assess whether reclassification to receivables is required.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s4.2",
        detail: "Extract all accounts with debit balances from the purchase ledger. For each material debit balance: (a) determine the cause (prepayment, duplicate payment, credit note not yet applied); (b) if the balance represents a genuine amount recoverable, consider reclassification to debtors; (c) confirm that netting of debit and credit balances is only applied where a legal right of set-off exists."
      },
      {
        step: 8,
        description: "Test the GRNI (Goods Received Not Invoiced) accrual for completeness and accuracy. Verify that goods received at or before the year end for which no invoice has been recorded are properly accrued.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the GRNI accrual listing. For a sample: (a) trace each item to the GRN evidencing goods were received before the year end; (b) verify the accrued amount to the purchase order value or estimated cost; (c) check post-year-end invoices to verify the accrued amount was reasonable; (d) investigate any material GRNI items from the prior year that have not been cleared — assess whether the accrual is still required."
      },
      {
        step: 9,
        description: "Verify intercompany payable balances by confirming with the counterparty entity. Ensure the corresponding receivable is recorded in the other entity's books.",
        assertion: "Existence",
        isaRef: "ISA (UK) 550.16",
        detail: "For each intercompany payable balance: (a) confirm the balance with the counterparty's finance team or auditor; (b) investigate any differences; (c) verify intercompany eliminations for consolidated accounts; (d) confirm arm's length terms or appropriate disclosure."
      },
      {
        step: 10,
        description: "Review the financial statement presentation and disclosures for trade and other payables. Verify compliance with FRS 102 Section 4 and Section 21 disclosure requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s4.4",
        detail: "Check: (a) current vs non-current classification is based on settlement expected within 12 months; (b) trade payables, taxation, social security, accruals, and deferred income are separately disclosed where material; (c) amounts owed to group undertakings are separately identified; (d) any payables secured on the entity's assets are disclosed; (e) note disclosures include the accounting policy for payables."
      }
    ],
    expectedResults: "Trade and other payable balances are complete, accurately recorded, exist as genuine obligations of the entity, and are properly presented. The unrecorded liabilities search has not identified material omitted liabilities. Accruals are reasonable when compared to actual post-year-end invoices.",
    exceptionHandling: "Any unrecorded liabilities identified through post-year-end testing or supplier statement reconciliations should be quantified and reported on the schedule of unadjusted differences. Given the directional risk of understatement, errors cannot be offset against overstatements in payables. Discuss with the engagement partner whether aggregated omissions are material and require adjustment.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding trade and other payables of £[X] as at [date]. [No material unrecorded liabilities were identified / The following unrecorded liabilities were identified: ...]. Accruals are [reasonable / require adjustment]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D5 — PAYROLL
  // ─────────────────────────────────────────────────────────────────────────────
  d5: {
    title: "Payroll Costs Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that payroll costs recognised in the profit and loss account have occurred, are accurately recorded, are complete, relate to the entity's employees, and that associated liabilities (PAYE, NIC, pensions) are properly recorded at the year end.",
    isaRef: "ISA (UK) 330; ISA (UK) 500; ISA (UK) 520",
    frsRef: "FRS 102 Section 28 — Employee Benefits",
    risksAddressed: [
      "R13 — Occurrence: risk that payroll costs include payments to fictitious employees or ghost workers",
      "R14 — Accuracy: risk that payroll calculations (tax, NIC, pension contributions) are incorrect, leading to misstatement of costs and associated liabilities",
      "R15 — Completeness: risk that accrued holiday pay, bonus accruals, or redundancy costs are not recorded at the year end"
    ],
    assertions: ["Occurrence", "Accuracy", "Completeness", "Cut-off", "Classification"],
    population: "All payroll transactions processed through the payroll system for the period, including gross pay, employer's NIC, pension contributions, and benefits in kind. Associated year-end balances include PAYE/NIC creditor, pension creditor, accrued wages, holiday pay accrual, and bonus accruals.",
    samplingApproach: "ISA (UK) 530 — For individual employee testing, select a stratified sample covering directors, high earners, starters, and leavers plus a random sample from the remaining population. For analytical review procedures, compare monthly payroll costs to expectations based on headcount and average pay rates.",
    procedures: [
      {
        step: 1,
        description: "Perform a proof-in-total analytical review of payroll costs for the year. Calculate expected gross payroll based on average headcount multiplied by average salary, and compare to actual. Investigate differences exceeding 5%.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 520.5",
        detail: "Obtain: (a) average headcount by month from HR records; (b) average salary by grade/department; (c) budgeted payroll. Calculate expected gross pay = sum of (monthly headcount × average monthly salary). Compare to actual gross payroll per the nominal ledger. Investigate the variance — expected causes include pay rises, bonuses, overtime, starters/leavers timing. Where the difference exceeds 5%, obtain detailed explanations and corroborate."
      },
      {
        step: 2,
        description: "For a sample of employees, agree the gross pay per the payroll records to the employment contract or letter of appointment. Verify that the pay rate and hours are correctly applied.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 500.10",
        detail: "Select a sample including all directors, a selection of starters and leavers, and random employees. For each: (a) agree the salary or hourly rate to the signed employment contract or most recent pay rise letter; (b) for salaried employees, verify the monthly gross pay = annual salary ÷ 12; (c) for hourly employees, agree hours to timesheets and verify the gross pay calculation; (d) verify tax code and NIC category are correctly applied per HMRC records."
      },
      {
        step: 3,
        description: "Test starters during the year by selecting a sample and verifying each to a signed employment contract, Companies House appointment (for directors), and that pay commenced from the correct start date.",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the list of starters for the year. For each sampled starter: (a) inspect the signed employment contract for name, role, start date, and salary; (b) verify the first payroll payment aligns with the start date; (c) for directors, verify appointment per Companies House records; (d) verify that the right-to-work documentation has been obtained by the entity; (e) check that opening balances were correctly entered in the payroll system."
      },
      {
        step: 4,
        description: "Test leavers during the year by selecting a sample and verifying the final pay calculation, including any notice pay, holiday pay settlement, and that no further payments were made after the leaving date.",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the list of leavers. For each sampled leaver: (a) agree the leaving date to the resignation letter or termination notice; (b) verify the final pay calculation includes the correct proportion of monthly salary; (c) check that accrued but untaken holiday has been paid (or deducted if overused); (d) verify no payroll payments were made to this individual after the leaving date; (e) for directors, verify cessation per Companies House."
      },
      {
        step: 5,
        description: "Reconcile the PAYE/NIC payable balance per the trial balance to the payroll records and to the amounts reported on the Full Payment Submissions (FPS) to HMRC. Verify that all monthly payments to HMRC have been made.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain: (a) the cumulative FPS submissions for the year from HMRC's online system or the payroll software; (b) the P32 employer payment record. Reconcile: total PAYE + employee NIC + employer NIC per the P32 to the amounts per the nominal ledger. Verify that monthly payments to HMRC agree to the bank statements. The year-end PAYE creditor should equal the December (or final period) PAYE/NIC liability per the FPS less any payments made before the year end."
      },
      {
        step: 6,
        description: "Reconcile the pension creditor balance per the trial balance to the payroll records and to the pension provider's records. Verify that employer and employee contributions have been correctly calculated and paid.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 500.10; FRS 102 s28.3",
        detail: "For each pension scheme: (a) agree the contribution rates to the scheme rules or auto-enrolment requirements; (b) recalculate employer and employee contributions for a sample of months; (c) agree payments to the pension provider to the bank statements; (d) verify the year-end creditor represents the final month(s) unpaid contributions; (e) confirm compliance with auto-enrolment duties (staging date, re-enrolment)."
      },
      {
        step: 7,
        description: "Test the holiday pay accrual at the year end. Verify the calculation of accrued but untaken holiday for a sample of employees and assess the overall reasonableness of the accrual.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 540.8; FRS 102 s28.7",
        detail: "Obtain the holiday pay accrual calculation and supporting holiday records. For a sample of employees: (a) agree the holiday entitlement to the employment contract; (b) agree the days taken to the holiday booking system; (c) calculate the untaken days and multiply by the daily rate; (d) compare to the amount included in the accrual. Assess overall: compare the accrual to total payroll cost and to the prior year accrual. An accrual of nil is unlikely to be acceptable unless the entity operates a use-it-or-lose-it policy with evidence of compliance."
      },
      {
        step: 8,
        description: "Test bonus accruals by vouching to board minutes, remuneration committee minutes, or management's bonus scheme documentation. Verify that accrued amounts are reasonable based on scheme rules and performance.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 540.8; FRS 102 s28.4",
        detail: "For each bonus accrual: (a) obtain the bonus scheme rules or individual contractual entitlements; (b) verify that conditions for entitlement are met (e.g. performance targets achieved, service conditions satisfied); (c) verify the accrued amount is consistent with the scheme rules and performance; (d) for discretionary bonuses, agree to board minutes authorising the amounts; (e) include employer NIC in the accrual where the bonus is to be settled; (f) trace post-year-end payments to verify the accrual was reasonable."
      },
      {
        step: 9,
        description: "Test directors' remuneration by agreeing total remuneration (including salary, bonuses, benefits in kind, pension contributions, and compensation for loss of office) to board minutes and the directors' remuneration note in the financial statements.",
        assertion: "Accuracy",
        isaRef: "ISA (UK) 500.10; CA 2006 s412–413",
        detail: "For each director: (a) agree the salary to the service contract or board resolution; (b) agree bonuses to remuneration committee minutes; (c) agree pension contributions to the scheme records; (d) identify all benefits in kind (car, medical insurance, etc.) and agree to HMRC P11D; (e) verify the directors' remuneration note complies with CA 2006 s412–413 (aggregate emoluments, highest paid director where required); (f) verify that any compensation for loss of office is properly disclosed."
      },
      {
        step: 10,
        description: "Verify the classification of payroll costs between cost of sales, administrative expenses, and distribution costs. Assess whether the allocation basis is reasonable and consistently applied.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain the payroll cost allocation and the basis of apportionment. (a) Verify that direct production employees are allocated to cost of sales; (b) verify that admin staff costs are in administrative expenses; (c) for any staff whose costs are split between categories, assess the basis (e.g. time allocation, departmental coding); (d) compare the allocation to the prior year and investigate significant changes; (e) where payroll costs are capitalised (e.g. development staff per FRS 102 s18), verify the criteria are met."
      }
    ],
    expectedResults: "Payroll costs are accurately calculated, relate to genuine employees of the entity, are complete including all year-end accruals, and are properly classified. PAYE/NIC and pension liabilities at the year end are correctly stated. Directors' remuneration disclosures are compliant.",
    exceptionHandling: "Any fictitious employees identified are a fraud indicator requiring immediate escalation to the engagement partner under ISA (UK) 240. Calculation errors should be extrapolated across the payroll population. Inadequate accruals should be reported on the schedule of unadjusted differences. Discrepancies between payroll records and HMRC filings may require management to submit corrections.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding payroll costs of £[X] for the period ended [date] and associated liabilities of £[X] at that date. [No material misstatements were identified / The following misstatements were identified: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D6 — CASH & BANK
  // ─────────────────────────────────────────────────────────────────────────────
  d6: {
    title: "Cash & Bank Balances Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that cash and bank balances recognised in the statement of financial position exist, are complete, are accurately stated, and that the entity has unrestricted access to the funds, or restrictions are properly disclosed.",
    isaRef: "ISA (UK) 505; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 7 — Statement of Cash Flows; FRS 102 Section 11",
    risksAddressed: [
      "R16 — Existence: risk that cash and bank balances do not exist or have been window-dressed at the year end",
      "R17 — Completeness: risk that bank accounts are not disclosed (hidden accounts) or that overdraft facilities and charges are omitted",
      "R18 — Accuracy: risk that bank reconciliations contain errors or aged/unusual reconciling items that mask misstatements"
    ],
    assertions: ["Existence", "Completeness", "Accuracy/Valuation", "Rights & Obligations", "Cut-off"],
    population: "All bank accounts held by the entity as confirmed by the bank confirmation letter, including current accounts, deposit accounts, foreign currency accounts, and any accounts closed during the year. Cash balances held on the premises.",
    samplingApproach: "ISA (UK) 505 requires direct confirmation for all bank accounts. This is not a sampling exercise — all accounts are confirmed. Bank reconciliation testing covers all accounts with balances exceeding nil. Outstanding items are tested by selecting all items over the ISI threshold plus a sample of smaller items.",
    procedures: [
      {
        step: 1,
        description: "Send bank confirmation letters (standard bank letter) to all banks with which the entity holds accounts. Confirm balances, facilities, charges, and other information as at the year-end date.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505.7",
        detail: "Prepare the standard bank letter (BACs standard form) for each bank. The letter should request: (a) balances on all accounts as at the year end; (b) details of all facilities (overdraft, loan, guarantee); (c) details of assets held as security; (d) any set-off or netting arrangements; (e) accounts closed during the year. Maintain control over the sending and receipt of letters — do not allow the client to intercept."
      },
      {
        step: 2,
        description: "Agree the bank balances per the confirmation letters to the bank reconciliation and to the trial balance. Investigate any differences.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505.10",
        detail: "For each bank account: (a) agree the balance per the bank confirmation to the balance per the bank statement at the year end; (b) agree the balance per bank statement to the starting point of the bank reconciliation; (c) agree the reconciled (book) balance to the trial balance; (d) any discrepancies between the confirmation and the bank statement require investigation — they may indicate unrecorded transactions or errors."
      },
      {
        step: 3,
        description: "Test the bank reconciliation for each account at the year end. Cast the reconciliation, verify the arithmetic, and test outstanding items by tracing to pre- and post-year-end bank statements.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "For each reconciliation: (a) verify the bank statement balance agrees to the confirmation; (b) cast the outstanding items (unpresented cheques and outstanding lodgements); (c) verify the arithmetic of the reconciliation; (d) for unpresented cheques: trace to the post-year-end bank statement to confirm they have cleared — any items not clearing within a reasonable period (e.g. 3 months) may be stale and require reversal; (e) for outstanding lodgements: trace to the post-year-end bank statement to confirm they have been received — any items not clearing promptly should be investigated as they may not be genuine."
      },
      {
        step: 4,
        description: "Review the bank reconciliation for unusual or aged reconciling items. Items outstanding for more than 30 days at the year end should be investigated as they may indicate errors or manipulation.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 240.32",
        detail: "Examine each reconciling item: (a) determine the date of the item and calculate its age at the year end; (b) for cheques unpresented for more than 6 months, assess whether they are stale and should be written back; (c) for lodgements outstanding for more than 5 business days, assess whether they are genuine — late year-end lodgements that do not appear on the post-year-end statement may be an indicator of window-dressing; (d) for any manual adjustments in the reconciliation, understand and verify each one."
      },
      {
        step: 5,
        description: "Verify that all bank accounts held by the entity are included in the financial statements. Cross-reference the accounts confirmed by the bank to the entity's list of accounts and the trial balance.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 505.7; ISA (UK) 500.10",
        detail: "Compare: (a) the list of accounts per the bank confirmations to the list of accounts per the entity's records; (b) check for any accounts disclosed in prior year financial statements that are not present this year — if closed, verify the closure and nil balance; (c) review the Companies House filings for any charges registered that reference bank accounts not in the entity's records; (d) enquire of management whether any accounts are held with banks not included in the confirmation process."
      },
      {
        step: 6,
        description: "For foreign currency bank accounts, verify that the year-end balance has been translated at the closing exchange rate and that exchange differences are correctly recorded.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s30.2",
        detail: "For each foreign currency account: (a) obtain the closing exchange rate from an independent source (Bank of England, XE.com); (b) recalculate the sterling equivalent of the balance; (c) compare to the translated balance in the trial balance; (d) verify exchange differences are recorded in profit or loss (unless they relate to net investment in a foreign operation); (e) any difference exceeding £100 to be reported."
      },
      {
        step: 7,
        description: "Verify the entity's rights over the bank balances. Review the bank confirmation for charges, set-off arrangements, security interests, or restrictions on the balances.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 505.7; FRS 102 s11.6",
        detail: "From the bank confirmation: (a) identify any charges over the entity's assets (fixed or floating); (b) identify any set-off or right of combination clauses; (c) identify any ring-fenced or restricted balances (e.g. escrow, client money); (d) verify that restricted balances are separately disclosed or excluded from cash and cash equivalents; (e) ensure security interests are disclosed in the notes to the financial statements."
      },
      {
        step: 8,
        description: "If the entity holds petty cash or other cash on hand, verify the balance by performing or observing a cash count at or near the year end.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10",
        detail: "Attend the premises and count the petty cash: (a) count all notes and coins and agree to the petty cash book balance; (b) review the petty cash vouchers for the last 10 transactions for proper authorisation and supporting receipts; (c) verify that IOUs or personal cheques are not included in the count; (d) agree the petty cash balance to the trial balance."
      },
      {
        step: 9,
        description: "Review facility letters and overdraft arrangements disclosed in the bank confirmation. Verify that all borrowing facilities are properly disclosed and that the entity is in compliance with any conditions.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 505.7",
        detail: "From the bank confirmation and facility letters: (a) agree the overdraft facility limits to the financial statement disclosures; (b) verify that any overdraft balances are classified as current liabilities (not netted against positive bank balances unless a right of set-off exists); (c) verify compliance with facility conditions (covenants tested under D11); (d) assess whether the facilities are adequate for the entity's ongoing needs — relevant to going concern."
      },
      {
        step: 10,
        description: "Test the bank interest income and charges for reasonableness by performing an analytical calculation based on average balances and known interest rates. Compare to the amounts recorded in the profit and loss account.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 520.5",
        detail: "For interest income: (a) calculate the expected interest = average deposit balance × deposit rate × time period; (b) compare to actual interest received per the nominal ledger; (c) investigate differences exceeding 10%. For bank charges: (a) compare the total charges for the year to the prior year; (b) review the bank statements for any unusual or one-off charges; (c) verify any arrangement fees are correctly amortised over the facility period."
      }
    ],
    expectedResults: "All bank balances confirmed by the bank agree to the financial statements after reconciling items. Bank reconciliations are accurate and contain no unusual or aged items. All bank accounts are disclosed and the entity has unrestricted access to the funds (or restrictions are properly disclosed).",
    exceptionHandling: "Failure to receive a bank confirmation should be followed up with a second request and, if still not received, reported to the engagement partner. Where alternative procedures are performed, document the rationale and evidence obtained. Unexplained reconciling items should be treated as potential misstatements. Any undisclosed bank accounts are a significant finding requiring immediate discussion with the engagement partner.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding cash and bank balances of £[X] as at [date]. Bank confirmations were [received for all accounts / not received for the following accounts: ...]. Bank reconciliations are [satisfactory / unsatisfactory]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D7 — FIXED ASSETS (PPE)
  // ─────────────────────────────────────────────────────────────────────────────
  d7: {
    title: "Property, Plant & Equipment Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that property, plant and equipment recognised in the statement of financial position exist, are owned by or under the control of the entity, are accurately valued at cost less accumulated depreciation (or at valuation where the revaluation model is adopted), and that depreciation policies are appropriate, in accordance with FRS 102 Section 17.",
    isaRef: "ISA (UK) 540; ISA (UK) 330; ISA (UK) 500; ISA (UK) 501",
    frsRef: "FRS 102 Section 17 — Property, Plant and Equipment",
    risksAddressed: [
      "R19 — Existence: risk that fixed assets recorded in the register no longer exist or are not in use by the entity",
      "R20 — Valuation: risk that depreciation rates do not reflect the useful economic life, or that impairment indicators exist but impairment has not been recognised",
      "R21 — Completeness: risk that assets are expensed rather than capitalised, or that additions are incomplete"
    ],
    assertions: ["Existence", "Rights & Obligations", "Accuracy/Valuation", "Completeness", "Cut-off"],
    population: "All tangible fixed assets per the fixed asset register as at the year-end date, including land and buildings, plant and machinery, fixtures and fittings, motor vehicles, and assets under construction. Additions and disposals during the year.",
    samplingApproach: "ISA (UK) 530 — For additions, test all items exceeding the ISI threshold and a MUS sample from the remainder. For disposals, test all items. For depreciation, recalculate for all material asset classes. For existence, select a sample from the register and physically verify.",
    procedures: [
      {
        step: 1,
        description: "Obtain the fixed asset register and reconcile the opening balances (cost, accumulated depreciation, NBV) to the prior year audited financial statements. Reconcile the closing balances to the trial balance and draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "For each asset class: (a) agree the opening cost and accumulated depreciation to the prior year signed accounts; (b) verify the movements (additions, disposals, revaluations, impairments, depreciation charge) cast correctly to give closing balances; (c) agree closing NBV to the TB; (d) agree to the tangible fixed assets note in the draft financial statements."
      },
      {
        step: 2,
        description: "Test additions to fixed assets during the year. For a sample of additions, vouch to the purchase invoice, verify capitalisation is appropriate (the item meets the definition of PPE per FRS 102 s17.4), and verify the amount capitalised.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s17.9–17.10",
        detail: "For each sampled addition: (a) inspect the purchase invoice and confirm the amount agrees to the register; (b) verify the asset meets the recognition criteria (probable future economic benefits, cost can be measured reliably); (c) verify that the cost includes all directly attributable costs (delivery, installation, site preparation) per FRS 102 s17.10; (d) verify that revenue expenditure (e.g. repairs, maintenance) has not been capitalised; (e) confirm that VAT has been excluded from cost (unless irrecoverable); (f) for the capitalisation threshold, verify consistency with the entity's accounting policy."
      },
      {
        step: 3,
        description: "Test disposals of fixed assets during the year. For all disposals, verify the proceeds, recalculate the profit or loss on disposal, and verify the asset has been removed from the register.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s17.28",
        detail: "For each disposal: (a) agree the sales proceeds to the bank statement or sales invoice; (b) verify the original cost and accumulated depreciation per the register; (c) recalculate the NBV at the date of disposal; (d) recalculate the profit or loss on disposal and agree to the P&L; (e) verify the asset has been removed from the register and the insurance schedule; (f) for scrapped assets with nil proceeds, verify authorisation of the write-off."
      },
      {
        step: 4,
        description: "Recalculate the depreciation charge for the year for all material asset classes. Verify that the depreciation policy is appropriate and consistently applied, and that the charge is correctly reflected in the profit and loss account.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s17.18–17.23",
        detail: "For each asset class: (a) confirm the depreciation method (straight-line, reducing balance) and rate/useful life per the accounting policy; (b) recalculate the annual depreciation charge for the class based on the opening NBV, additions (pro-rated), and disposals (pro-rated); (c) compare to the charge per the register and per the nominal ledger; (d) investigate differences exceeding 2%; (e) assess whether the useful economic lives remain appropriate — enquire of management about any assets that are idle, fully depreciated but still in use, or nearing the end of their life."
      },
      {
        step: 5,
        description: "Physically verify the existence of a sample of fixed assets by inspecting the assets on the entity's premises. Select items from the register and locate them physically.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10; ISA (UK) 501",
        detail: "Select a sample of assets from the register covering all categories and locations. For each: (a) physically locate and inspect the asset; (b) verify the condition is consistent with the NBV (e.g. a fully depreciated asset should not have been replaced with a new one without recording the addition); (c) verify the asset is in use by the entity; (d) note the serial number or identifying features where available and agree to the register; (e) any assets not located should be investigated — they may have been disposed of without being removed from the register."
      },
      {
        step: 6,
        description: "Perform a reverse test: select items physically observed on the premises and trace to the fixed asset register to test completeness (assets exist but are not recorded).",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10",
        detail: "During the site visit, identify 10 significant items of plant, equipment, or vehicles and trace each to the fixed asset register. Any items not found in the register may represent: (a) assets below the capitalisation threshold (acceptable if policy is consistently applied); (b) fully expensed items that should have been capitalised; (c) leased or rented assets (verify lease agreement). Document the outcome for each item."
      },
      {
        step: 7,
        description: "Verify the entity's ownership of or rights over the assets. For property, inspect title deeds or Land Registry entries. For vehicles, check V5 documents. For financed assets, confirm HP/finance lease agreements.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; FRS 102 s17.4",
        detail: "For material assets: (a) for freehold property, obtain the title deed or Land Registry search confirming the entity as registered proprietor; (b) for leasehold property, inspect the lease for term, restrictions, and obligations; (c) for motor vehicles, inspect the V5C registration certificate; (d) for assets acquired under HP or finance lease, inspect the agreement and verify the asset is recorded in the register with appropriate disclosure; (e) identify any assets pledged as security (cross-reference to bank confirmations)."
      },
      {
        step: 8,
        description: "Assess whether impairment indicators exist for any class of fixed assets. Where indicators are identified, evaluate management's impairment assessment per FRS 102 Section 27.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s27.7–27.9",
        detail: "Consider the following indicators: (a) significant decline in market value beyond expectations; (b) adverse changes in the technological, market, or economic environment; (c) increases in interest rates affecting value-in-use calculations; (d) the carrying amount of net assets exceeds market capitalisation; (e) physical damage or obsolescence; (f) idle assets or plans to discontinue operations. Where indicators exist: review management's impairment test, verify the recoverable amount (higher of fair value less costs to sell and value in use), and assess the reasonableness of assumptions."
      },
      {
        step: 9,
        description: "Where the entity applies the revaluation model, verify the revaluation has been performed by a suitably qualified valuer, assess the valuer's competence and objectivity, and verify the accounting entries.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; ISA (UK) 500.8; FRS 102 s17.15B",
        detail: "If applicable: (a) obtain the valuation report; (b) assess the valuer's qualifications (RICS membership), independence, and methodology; (c) verify the basis of valuation is appropriate (market value for existing use, or depreciated replacement cost); (d) verify the revaluation surplus/deficit is correctly recorded (surplus to revaluation reserve via OCI, deficit to P&L unless reversing a previous surplus); (e) verify that the entire class of assets has been revalued, not selected items; (f) assess whether the revaluation is sufficiently recent (FRS 102 requires sufficient regularity that carrying amount does not differ materially from fair value)."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for property, plant and equipment. Verify compliance with FRS 102 Section 17 and Companies Act 2006 Schedule 1 requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s17.31",
        detail: "Verify: (a) the note reconciles cost, accumulated depreciation, and NBV from opening to closing for each class; (b) depreciation methods and useful lives are disclosed; (c) any assets pledged as security are disclosed; (d) commitments for the acquisition of PPE are disclosed; (e) for revalued assets, the carrying amount under the cost model, date of revaluation, and valuer's details are disclosed; (f) the distinction between freehold, long leasehold, and short leasehold land and buildings is maintained per CA 2006."
      }
    ],
    expectedResults: "Fixed assets per the register and financial statements exist, are owned by the entity, are accurately valued at cost less depreciation (or valuation), and no unrecorded impairments exist. Additions and disposals are properly recorded. Depreciation rates reflect the useful economic lives of the assets.",
    exceptionHandling: "Assets not physically located should be investigated and, if confirmed as disposed of or missing, the cost and accumulated depreciation should be removed from the register and any loss recognised. Depreciation recalculation differences should be reported if they exceed the testing threshold. Impairment indicators not addressed by management should be raised with the engagement partner and may require a modification to the audit opinion if management refuses to perform an impairment assessment.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding property, plant and equipment with a net book value of £[X] as at [date]. [No material misstatements were identified / The following misstatements were identified: ...]. Depreciation policies are [appropriate / require revision]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D8 — INTANGIBLES & GOODWILL
  // ─────────────────────────────────────────────────────────────────────────────
  d8: {
    title: "Intangible Assets & Goodwill Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that intangible assets and goodwill recognised in the statement of financial position meet the recognition criteria, are accurately valued at cost less accumulated amortisation and impairment, and that amortisation and impairment policies are appropriate, in accordance with FRS 102 Sections 18 and 19.",
    isaRef: "ISA (UK) 540; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 18 — Intangible Assets other than Goodwill; FRS 102 Section 19 — Business Combinations and Goodwill",
    risksAddressed: [
      "R22 — Valuation: risk that development costs are capitalised when the criteria in FRS 102 s18.8H are not met, or that amortisation periods are inappropriate",
      "R23 — Impairment: risk that goodwill or intangible assets are impaired but the carrying amount has not been written down",
      "R24 — Existence: risk that internally generated intangibles that do not meet recognition criteria are recorded as assets"
    ],
    assertions: ["Existence", "Accuracy/Valuation", "Rights & Obligations", "Completeness", "Classification"],
    population: "All intangible assets per the intangible asset register or schedule, including separately acquired intangibles (software licences, patents, trademarks), internally developed intangible assets (capitalised development costs), and goodwill arising on business combinations.",
    samplingApproach: "ISA (UK) 530 — Given the typically small number of intangible asset lines, all material items should be tested individually. For development cost capitalisation, test all projects where costs have been capitalised during the year. Goodwill balances are tested in full.",
    procedures: [
      {
        step: 1,
        description: "Obtain the intangible asset register or schedule. Reconcile opening balances to the prior year audited accounts and closing balances to the trial balance and draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "For each category of intangible: (a) agree opening cost and accumulated amortisation to the prior year signed accounts; (b) verify movements (additions, disposals, amortisation, impairment) cast to give closing balances; (c) agree to the TB and draft accounts. Where goodwill arises from prior year acquisitions, verify the brought-forward balance has not been adjusted other than for amortisation or impairment."
      },
      {
        step: 2,
        description: "For separately acquired intangible assets (software, patents, licences), vouch additions to purchase invoices, licence agreements, or legal assignments. Verify that the cost includes only directly attributable expenditure.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s18.9",
        detail: "For each material addition: (a) inspect the purchase invoice or licence agreement; (b) confirm the amount capitalised agrees to the consideration paid; (c) verify that only directly attributable costs are included (purchase price, import duties, non-refundable taxes, directly attributable preparation costs); (d) verify that ongoing fees (e.g. annual software subscriptions, SaaS licences) are not capitalised — these should be expensed as incurred."
      },
      {
        step: 3,
        description: "For internally generated intangible assets (capitalised development costs), verify that all six criteria in FRS 102 s18.8H are met at the date capitalisation commenced. Assess the ongoing validity of capitalisation.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10; FRS 102 s18.8H",
        detail: "For each development project with capitalised costs: verify (a) technical feasibility of completing the asset; (b) the entity's intention to complete and use or sell it; (c) the entity's ability to use or sell it; (d) how the asset will generate probable future economic benefits (existence of a market or internal usefulness); (e) availability of adequate technical, financial, and other resources; (f) ability to measure reliably the expenditure attributable to the asset during development. Document the evidence for each criterion. If any criterion is not met, the costs should be expensed."
      },
      {
        step: 4,
        description: "Test the nature of costs capitalised within development expenditure. Verify that only permitted costs are included and that research costs have been expensed.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s18.8C–18.8E",
        detail: "For a sample of costs capitalised: (a) vouch to purchase invoices, timesheets, or payroll records; (b) verify costs are directly attributable to developing the asset (materials, services, employee costs, registration fees); (c) verify that overhead costs are excluded unless directly attributable; (d) verify that selling, administrative, and training costs are not capitalised; (e) verify the boundary between research (expensed) and development (capitalised) — the entity should have documentation demonstrating when the project moved from research to development."
      },
      {
        step: 5,
        description: "Test the amortisation charge for intangible assets. Verify that the amortisation period does not exceed the expected useful life and that the method is appropriate. For goodwill under FRS 102, verify the period does not exceed 5 years unless a longer period can be justified.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s18.20–18.21, s19.23",
        detail: "For each intangible asset class: (a) verify the amortisation period per the policy and assess its appropriateness (consider the legal life, contractual period, and expected usage); (b) recalculate the amortisation charge and compare to the nominal ledger; (c) for goodwill, verify the amortisation period — FRS 102 s19.23 presumes a maximum of 5 years unless management can demonstrate a longer period (not exceeding 10 years); (d) if management adopts a period exceeding 5 years, evaluate the justification critically; (e) verify amortisation commences when the asset is available for use."
      },
      {
        step: 6,
        description: "Assess whether impairment indicators exist for intangible assets and goodwill. Where the useful life of goodwill exceeds 5 years, or where the useful life cannot be reliably estimated, an annual impairment review is required.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s27.7–27.9, s19.24",
        detail: "Consider indicators: (a) adverse change in the market for the asset's output; (b) technological obsolescence; (c) the asset becoming idle or plans to discontinue; (d) worse-than-expected performance of the cash-generating unit to which goodwill relates; (e) for goodwill amortised over more than 5 years, perform an annual impairment review regardless of indicators. Where impairment testing is required: (f) identify the CGU; (g) review management's cash flow projections; (h) challenge key assumptions (discount rate, growth rate, terminal value); (i) verify the recoverable amount exceeds the carrying amount."
      },
      {
        step: 7,
        description: "For goodwill arising on business combinations, verify the original calculation of goodwill by reference to the acquisition accounting. Verify that consideration, fair values of identifiable net assets, and resulting goodwill were correctly determined.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s19.11–19.15",
        detail: "For each acquisition (particularly current year): (a) agree the consideration (cash, shares, deferred/contingent consideration) to the sale and purchase agreement; (b) review the fair value exercise for identifiable assets and liabilities acquired; (c) verify that intangible assets meeting recognition criteria were separately identified (customer lists, brands, technology); (d) recalculate goodwill = consideration – fair value of net identifiable assets; (e) for contingent consideration, verify the measurement at the best estimate and subsequent remeasurement through P&L."
      },
      {
        step: 8,
        description: "Verify the entity's rights over the intangible assets. For patents, trademarks, and licences, confirm registration or assignment documentation. For software, inspect licence terms.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; FRS 102 s18.4",
        detail: "For material intangibles: (a) for patents and trademarks, verify registration with the IPO (Intellectual Property Office) or relevant overseas registry; (b) for acquired intangibles, inspect the assignment agreement; (c) for software licences, verify the licence terms — distinguish between perpetual licences (capitalise) and term licences (expense unless they convey a right to use for a substantial period); (d) for internally developed intangibles, verify that the entity owns the IP (consider employment contracts, contractor agreements)."
      },
      {
        step: 9,
        description: "Verify that no internally generated goodwill, brands, mastheads, customer lists, or similar items have been capitalised as assets, which is prohibited under FRS 102 s18.8C.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s18.8C",
        detail: "Review the intangible asset register for any items that appear to be internally generated goodwill or internally generated brands/mastheads/customer lists. These cannot be recognised as assets under FRS 102. If any are identified: (a) determine the original recognition date and rationale; (b) if they do not arise from a business combination or a separate acquisition, they should not be on the balance sheet; (c) quantify the misstatement and discuss with management."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for intangible assets and goodwill. Verify compliance with FRS 102 Section 18.27 and Section 19.25 disclosure requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s18.27, s19.25",
        detail: "Verify: (a) the note shows movements in cost, amortisation, and NBV for each class; (b) amortisation methods and useful lives are disclosed; (c) for goodwill, the period of amortisation and reasons for exceeding 5 years (if applicable) are disclosed; (d) for internally generated development costs, the aggregate amount capitalised is disclosed; (e) any intangible assets pledged as security are disclosed; (f) commitments for future development expenditure are disclosed where material."
      }
    ],
    expectedResults: "Intangible assets meet recognition criteria, are accurately valued at cost less amortisation, and are not impaired. Development costs capitalised meet all six criteria in FRS 102 s18.8H. Goodwill is appropriately amortised and not impaired. No internally generated goodwill or prohibited items are capitalised.",
    exceptionHandling: "Where development costs do not meet the six capitalisation criteria, the full amount should be expensed. If management refuses to adjust, report the misstatement and consider the impact on the audit opinion. Goodwill impairment disagreements are likely to be material and should be escalated to the engagement partner. Any change in amortisation period should be disclosed as a change in accounting estimate per FRS 102 s10.15.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding intangible assets and goodwill with a net book value of £[X] as at [date]. [No material misstatements were identified / The following misstatements were identified: ...]. Amortisation and impairment policies are [appropriate / require revision]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D9 — INVESTMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  d9: {
    title: "Investments Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that investments recognised in the statement of financial position exist, are owned by the entity, are accurately valued in accordance with the applicable measurement basis, and that impairment has been appropriately assessed, in accordance with FRS 102 Sections 14 and 15.",
    isaRef: "ISA (UK) 540; ISA (UK) 500; ISA (UK) 330; ISA (UK) 505",
    frsRef: "FRS 102 Section 14 — Investments in Associates; FRS 102 Section 15 — Investments in Joint Ventures; FRS 102 Section 9 — Consolidated and Separate Financial Statements; FRS 102 Section 11",
    risksAddressed: [
      "R25 — Valuation: risk that the carrying amount of investments exceeds the recoverable amount, particularly for investments in subsidiaries, associates, and unquoted equity investments",
      "R26 — Existence: risk that investments recorded in the accounts no longer exist or are not held by the entity",
      "R27 — Completeness: risk that new investments or disposals during the year have not been recorded"
    ],
    assertions: ["Existence", "Accuracy/Valuation", "Rights & Obligations", "Completeness", "Classification"],
    population: "All investments per the investment schedule, including investments in subsidiaries, associates, joint ventures, and other financial assets (listed and unlisted equity, debt instruments, investment properties). Both current and non-current investment balances.",
    samplingApproach: "ISA (UK) 530 — Given typically limited numbers, all material investment balances are individually tested. For entities with large portfolios of listed investments, a MUS sample may be drawn for valuation testing.",
    procedures: [
      {
        step: 1,
        description: "Obtain the investment schedule from management. Reconcile the opening balances to the prior year audited accounts and the closing balances to the trial balance and draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "For each investment: (a) agree the opening cost/carrying value to the prior year signed accounts; (b) verify movements during the year (additions, disposals, fair value gains/losses, impairment, dividends); (c) verify the schedule casts correctly; (d) agree closing balances to the TB and draft accounts."
      },
      {
        step: 2,
        description: "Verify the existence of investments by inspecting share certificates, custodian statements, or by obtaining direct confirmation from the custodian or registrar.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505; ISA (UK) 500.10",
        detail: "For each investment: (a) for shares held directly, inspect the original share certificate and verify the entity's name as the registered holder; (b) for investments held by a custodian, obtain a direct confirmation from the custodian confirming the holding at the year end; (c) for subsidiary investments, confirm the shareholding to the subsidiary's share register and Companies House filing; (d) for listed investments, verify the holding to a broker statement or CREST confirmation."
      },
      {
        step: 3,
        description: "Verify the entity's rights to the investments. Confirm there are no pledges, charges, or encumbrances on the investments. Check for restrictions on disposal.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.38",
        detail: "For each investment: (a) review the bank confirmation for any investments pledged as security; (b) review loan agreements and facility letters for negative pledges or restrictions; (c) for investments in subsidiaries, check for any shareholder agreements restricting transfer; (d) for investments subject to lock-in periods or escrow, verify appropriate disclosure; (e) confirm the investments are free from any liens or third-party claims."
      },
      {
        step: 4,
        description: "For investments in subsidiaries held at cost in the separate financial statements, compare the carrying amount to the subsidiary's net asset value. Assess whether impairment indicators exist.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s27.7; FRS 102 s9.26",
        detail: "For each subsidiary investment: (a) obtain the subsidiary's latest financial statements or management accounts; (b) compare the carrying amount of the investment to the subsidiary's net assets; (c) where the carrying amount exceeds net assets, this is an impairment indicator — assess whether the recoverable amount (higher of fair value less costs to sell and value in use) supports the carrying amount; (d) consider other indicators: operating losses, negative cash flows, loss of key customer, adverse market conditions; (e) where impairment is required, calculate the amount and verify management has recorded the write-down."
      },
      {
        step: 5,
        description: "For listed investments measured at fair value, verify the year-end valuation by reference to independently sourced quoted market prices at the year-end date.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s11.27",
        detail: "For each listed investment: (a) obtain the closing share price at the year-end date from an independent source (London Stock Exchange, Bloomberg, Financial Times); (b) multiply the number of shares held by the closing price; (c) compare to the carrying amount per the investment schedule; (d) verify that fair value gains and losses are recorded in the correct location (P&L or other comprehensive income, depending on the entity's election); (e) any difference exceeding £100 to be reported."
      },
      {
        step: 6,
        description: "For unlisted or unquoted investments, assess the valuation methodology used by management. Evaluate whether the methodology is appropriate and the inputs are reasonable.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s11.27",
        detail: "For each unlisted investment: (a) understand the valuation methodology (recent transaction price, net asset value, earnings multiple, discounted cash flow); (b) assess whether the methodology is appropriate per IPEV (International Private Equity and Venture Capital) guidelines or FRS 102; (c) verify the key inputs (earnings, multiples, discount rates) to independent sources or management's supporting evidence; (d) consider whether a management expert has been used and, if so, assess competence and objectivity per ISA (UK) 500.8; (e) consider whether the auditor requires an auditor's expert per ISA (UK) 620."
      },
      {
        step: 7,
        description: "Test investment income (dividends received and receivable, interest on debt instruments) for completeness and accuracy. Verify that income is recorded in the correct period.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10",
        detail: "For each investment generating income: (a) for dividends, verify to the investee's dividend announcement and trace the receipt to the bank statement; (b) for accrued dividends at the year end, verify the dividend was declared before the year end; (c) for interest on debt instruments, recalculate the interest based on the coupon rate and the period and compare to the amount recorded; (d) for equity-accounted investments (associates, JVs), verify the share of profit is correctly calculated based on the investee's results and the entity's percentage holding."
      },
      {
        step: 8,
        description: "For investments acquired or disposed of during the year, vouch to supporting documentation and verify the accounting entries are correct.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "For acquisitions: (a) inspect the share purchase agreement; (b) agree the consideration to the bank statement or other evidence of payment; (c) verify the cost is correctly recorded including transaction costs where the investment is measured at cost; (d) verify the classification (subsidiary, associate, trade investment). For disposals: (a) agree the proceeds to the bank statement; (b) recalculate the gain or loss on disposal; (c) verify the investment has been removed from the schedule."
      },
      {
        step: 9,
        description: "Verify the classification of investments between current and non-current, and between the different measurement categories (cost, fair value through P&L, fair value through OCI).",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.14, s14.4, s15.9",
        detail: "For each investment: (a) verify the classification as subsidiary, associate, joint venture, or other based on the level of influence (control, significant influence, joint control, or none); (b) verify the measurement basis is appropriate for the classification and consistent with the accounting policy; (c) verify current vs non-current classification based on management's intention and ability to realise within 12 months; (d) verify that entities meeting the definition of associates (20%+ or significant influence) are not classified as simple investments."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for investments. Verify compliance with FRS 102 Sections 9, 11, 14, and 15 and Companies Act 2006 Schedule 1 requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; CA 2006 s409",
        detail: "Verify: (a) the names and registered offices of subsidiaries, associates, and significant holdings are disclosed per CA 2006 s409; (b) the proportion of shares held and class are disclosed; (c) the accounting policy for each category of investment is stated; (d) for fair-valued investments, the fair value hierarchy level is disclosed; (e) any restrictions on distributions from investees are disclosed; (f) movements in investment carrying amounts are presented in a note."
      }
    ],
    expectedResults: "Investments exist, are owned by the entity free from undisclosed encumbrances, are accurately valued in accordance with the applicable measurement basis, and are not impaired beyond recognised amounts. Investment income is complete and accurately recorded.",
    exceptionHandling: "Where an investment carrying amount exceeds the recoverable amount and management does not recognise an impairment, quantify the potential misstatement and consider the impact on the audit opinion. For fair value disagreements, consider the use of an auditor's expert. Any undisclosed pledges or charges are a significant finding to be raised with the engagement partner immediately.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding investments with a carrying value of £[X] as at [date]. [No material misstatements were identified / The following misstatements were identified: ...]. Impairment has been [appropriately assessed / requires further consideration]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D10 — SHARE CAPITAL & RESERVES
  // ─────────────────────────────────────────────────────────────────────────────
  d10: {
    title: "Share Capital & Reserves Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that share capital and reserves recognised in the statement of financial position are accurately stated, that all share movements during the year are properly authorised and recorded, and that dividends are legally paid and correctly accounted for, in accordance with FRS 102 Section 22.",
    isaRef: "ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 22 — Liabilities and Equity; Companies Act 2006 Parts 17–18",
    risksAddressed: [
      "R28 — Accuracy: risk that share capital movements (allotments, transfers, buy-backs) are not accurately recorded or properly authorised",
      "R29 — Compliance: risk that dividends paid exceed distributable profits in breach of s.830 Companies Act 2006",
      "R30 — Completeness: risk that changes to share capital or reserves are not reflected in the financial statements"
    ],
    assertions: ["Existence", "Accuracy/Valuation", "Completeness", "Rights & Obligations", "Presentation"],
    population: "All equity balances per the trial balance, including called-up share capital, share premium, capital redemption reserve, revaluation reserve, merger reserve, retained earnings, and other reserves. All equity transactions during the year (share issues, buy-backs, dividends, reserve transfers).",
    samplingApproach: "ISA (UK) 530 — All share capital movements are individually tested as they are typically few in number but legally significant. Reserve movements are individually verified. This is not a sampling-based test.",
    procedures: [
      {
        step: 1,
        description: "Verify the called-up share capital balance per the financial statements to the Companies House Confirmation Statement and Annual Return. Confirm the number and class of shares, nominal value, and amounts paid up.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10; CA 2006 s542",
        detail: "Obtain the most recent Confirmation Statement filed at Companies House. Verify: (a) the total number of shares in issue per class; (b) the nominal value per share; (c) the aggregate nominal value agrees to the called-up share capital per the TB; (d) whether shares are fully paid — if partly paid, the amount called-up and the amount paid should be disclosed; (e) any discrepancies require investigation with the company secretary."
      },
      {
        step: 2,
        description: "For any shares issued during the year, verify the allotment to board minutes, shareholder resolutions (ordinary or special as required), and the SH01 return filed at Companies House.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; CA 2006 s549–551",
        detail: "For each share allotment: (a) inspect the board minutes authorising the allotment; (b) verify the directors had authority to allot (s.549 general authority or specific resolution); (c) for pre-emption rights, verify compliance with s.561 or that a disapplication resolution exists (s.570); (d) agree the number of shares, class, and issue price to the SH01 form filed at Companies House; (e) agree the cash received to the bank statement; (f) verify the entries: nominal value to share capital, premium to share premium account."
      },
      {
        step: 3,
        description: "For any share buy-backs or redemptions during the year, verify compliance with the Companies Act 2006 requirements. Verify the capital redemption reserve has been correctly maintained.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; CA 2006 s658–737",
        detail: "For each buy-back: (a) verify the special resolution authorising the purchase (s.694); (b) for market purchases, verify compliance with s.701; (c) verify the purchase was made out of distributable profits or the proceeds of a fresh issue (s.692); (d) verify the capital redemption reserve has been credited with the nominal value of shares cancelled (s.733); (e) verify the payment to the bank statement; (f) verify the SH06 (return of purchase of own shares) was filed at Companies House; (g) verify the shares have been cancelled or held as treasury shares."
      },
      {
        step: 4,
        description: "Test dividends declared and paid during the year. Verify that dividends are legally payable from distributable profits per s.830 Companies Act 2006.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; CA 2006 s829–831",
        detail: "For each dividend: (a) verify authorisation — interim dividends by board resolution, final dividends by ordinary resolution at the AGM; (b) calculate distributable profits per s.830 (accumulated realised profits less accumulated realised losses, less amounts previously distributed); (c) verify the distributable profits calculation is based on relevant accounts (last annual accounts or, for interim, accounts that enable a reasonable judgement); (d) verify the amount per share and total amount paid; (e) trace the payment(s) to the bank statement; (f) if the company has insufficient distributable reserves, the dividend is unlawful and must be reported."
      },
      {
        step: 5,
        description: "Reconcile the retained earnings brought forward to the prior year audited financial statements. Verify that the movement during the year equals the profit/loss for the year less dividends paid, plus or minus any other items correctly taken to reserves.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.9",
        detail: "Retained earnings reconciliation: (a) opening balance per prior year accounts; (b) plus profit/(loss) for the year per the P&L; (c) less dividends declared/paid during the year; (d) plus/minus prior year adjustments (verify nature and compliance with FRS 102 s10); (e) plus/minus other reserve transfers (verify authority and nature); (f) closing balance should agree to the TB. Any differences must be fully investigated."
      },
      {
        step: 6,
        description: "Verify the share premium account balance and movements. Confirm that share premium is only utilised for permitted purposes under s.610 Companies Act 2006.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; CA 2006 s610",
        detail: "Verify: (a) the opening balance agrees to the prior year accounts; (b) additions to share premium arise from shares issued at a premium (verified at step 2); (c) any deductions from share premium are for permitted purposes only (paying up bonus shares, writing off preliminary expenses, writing off share issue expenses, providing for premium payable on redemption); (d) for any court-approved capital reduction, inspect the court order."
      },
      {
        step: 7,
        description: "Verify the PSC (Persons with Significant Control) register is up to date by comparing the entity's records to the Companies House PSC register.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10; CA 2006 s790A–790ZG",
        detail: "Obtain the PSC register from Companies House and compare to the entity's own PSC register. Verify: (a) all individuals or entities with 25%+ shares, voting rights, or significant influence/control are listed; (b) the nature of control for each PSC is correctly stated; (c) any changes during the year have been notified to Companies House within the statutory deadline (14 days); (d) where no PSCs exist, verify an appropriate exemption or statement is filed."
      },
      {
        step: 8,
        description: "Verify the other reserves (revaluation reserve, merger reserve, capital redemption reserve) by reconciling opening to closing balances and verifying the nature and authority for each movement.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "For each reserve: (a) agree opening balance to prior year accounts; (b) identify all movements and verify authority — revaluation reserve movements should arise from revaluations (cross-reference to D7); capital redemption reserve from share buy-backs (step 3); merger reserve from qualifying mergers per s.612 CA 2006; (c) verify any reserve transfers are appropriately disclosed in the statement of changes in equity; (d) verify no unauthorised transfers have been made."
      },
      {
        step: 9,
        description: "Verify that the entity's Articles of Association are consistent with the share capital structure and any rights attaching to different classes of shares.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; CA 2006 s21",
        detail: "Obtain the current Articles of Association. Verify: (a) the authorised share capital (if applicable under old-form articles) is sufficient for the shares in issue; (b) the rights attaching to each class of share (voting, dividend, capital distribution) are as disclosed in the financial statements; (c) any special rights or restrictions are properly disclosed; (d) where special resolutions have amended the articles during the year, verify filing at Companies House."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for share capital and reserves. Verify compliance with FRS 102 Section 22 and Companies Act 2006 requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s22.15A, s4.12",
        detail: "Verify: (a) the statement of changes in equity is presented showing movements in each reserve; (b) the number and nominal value of each class of share is disclosed; (c) rights, preferences, and restrictions attached to each class are described; (d) shares held as own shares (treasury shares) are separately disclosed; (e) dividends declared and paid are disclosed; (f) any shares issued after the year end are disclosed as a non-adjusting post-balance sheet event if material."
      }
    ],
    expectedResults: "Share capital and reserves are accurately stated and agree to statutory filings. All share movements are properly authorised and recorded. Dividends are legally payable from distributable profits. Disclosures comply with the Companies Act 2006 and FRS 102.",
    exceptionHandling: "Any unlawful dividends (paid in excess of distributable profits) must be reported to the engagement partner immediately and may require qualification of the audit opinion. Discrepancies between the entity's records and Companies House filings must be resolved. Any failure to maintain the PSC register is a statutory breach to be reported to those charged with governance.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding share capital and reserves totalling £[X] as at [date]. [All share movements are properly authorised / The following issues were noted: ...]. Dividends are [legally payable / in excess of distributable profits]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D11 — LOANS & BORROWINGS
  // ─────────────────────────────────────────────────────────────────────────────
  d11: {
    title: "Loans & Borrowings Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that loans and borrowings recognised in the statement of financial position are complete, accurately valued, exist as genuine obligations of the entity, and are properly classified between current and non-current liabilities, in accordance with FRS 102 Section 11.",
    isaRef: "ISA (UK) 505; ISA (UK) 330; ISA (UK) 500; ISA (UK) 540",
    frsRef: "FRS 102 Section 11 — Basic Financial Instruments; FRS 102 Section 12 — Other Financial Instruments Issues",
    risksAddressed: [
      "R31 — Completeness: risk that borrowings or facilities are not fully disclosed, including off-balance-sheet arrangements or undisclosed guarantees",
      "R32 — Accuracy: risk that interest charges are incorrectly calculated, or that borrowings are not measured at amortised cost using the effective interest method where required",
      "R33 — Classification: risk that borrowings due within 12 months are incorrectly classified as non-current, or that covenant breaches trigger reclassification"
    ],
    assertions: ["Completeness", "Existence", "Accuracy/Valuation", "Classification", "Rights & Obligations"],
    population: "All borrowings per the trial balance, including bank loans, overdrafts, loan notes, director loans, intercompany loans, hire purchase obligations, and any other debt instruments. Includes both current and non-current portions.",
    samplingApproach: "ISA (UK) 505 — All borrowing facilities are confirmed directly with the lender. All material loan balances are individually tested. This is not a sampling-based test given the typically limited number of facilities.",
    procedures: [
      {
        step: 1,
        description: "Obtain bank confirmation letters for all borrowing facilities. Confirm the outstanding balances, facility limits, interest rates, repayment terms, security provided, and covenant requirements at the year-end date.",
        assertion: "Existence",
        isaRef: "ISA (UK) 505.7",
        detail: "The standard bank confirmation letter (BACs form) should request: (a) balances outstanding on all facilities at the year end; (b) facility limits and expiry dates; (c) interest rates (fixed or variable, and applicable margin); (d) repayment terms and next instalment dates; (e) assets pledged as security; (f) covenants and conditions. Maintain control over sending and receipt. Agree confirmed balances to the TB."
      },
      {
        step: 2,
        description: "Agree the loan balances per the bank confirmations to the loan schedules and to the trial balance. Reconcile any differences.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 505.10; ISA (UK) 500.9",
        detail: "For each facility: (a) agree the balance per the bank confirmation to the ledger balance; (b) where there is a difference, determine whether it relates to accrued interest, unamortised arrangement fees, or timing of payments; (c) verify that the net balance in the TB correctly reflects the principal amount, accrued interest, and any unamortised fees; (d) for loans measured at amortised cost, verify the effective interest rate calculation."
      },
      {
        step: 3,
        description: "For any new borrowings taken out during the year, inspect the loan agreement and verify the accounting entries including the recognition of arrangement fees.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.13",
        detail: "For each new facility: (a) inspect the signed loan agreement for terms (amount, rate, maturity, repayment schedule, covenants); (b) trace the drawdown to the bank statement; (c) identify arrangement fees and verify the accounting treatment — under FRS 102 s11.13, transaction costs are deducted from the initial carrying amount and amortised over the life using the effective interest method; (d) verify the loan is initially recognised at the transaction price (proceeds less transaction costs)."
      },
      {
        step: 4,
        description: "Recalculate the interest charge for the year for all material borrowings. Compare to the interest expense per the profit and loss account and to the accrued interest at the year end.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.15–11.20",
        detail: "For each facility: (a) calculate the expected interest charge = outstanding balance x interest rate x time period (adjusted for any drawdowns or repayments during the year); (b) for variable rate facilities, adjust for rate changes during the year using the dates of change; (c) compare the calculated interest to the P&L charge; (d) calculate the accrued interest at the year end = balance x rate x (days from last payment to year end / 365); (e) compare to the accrued interest balance per the TB; (f) differences exceeding 2% to be investigated."
      },
      {
        step: 5,
        description: "Test compliance with loan covenants at the year-end date. Obtain management's covenant compliance calculations and verify the inputs and calculations.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.44",
        detail: "For each covenant: (a) identify the specific financial metric required (e.g. debt/EBITDA ratio, interest cover, net worth test, cash flow cover); (b) obtain management's calculation of compliance; (c) verify the inputs to the audited figures or agreed management accounts; (d) recalculate the ratio or metric; (e) compare to the covenant threshold; (f) if a covenant breach has occurred or is imminent, assess: whether a waiver has been obtained from the lender; the impact on classification of the loan (entire facility may become current if no waiver); and the going concern implications."
      },
      {
        step: 6,
        description: "Verify the classification of borrowings between current liabilities (due within one year) and non-current liabilities (due after one year) based on the contractual repayment schedule.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s4.7",
        detail: "For each facility: (a) obtain the repayment schedule from the loan agreement; (b) identify the instalments due within 12 months of the year end — these are current; (c) the remaining balance is non-current; (d) where a revolving credit facility is drawn and matures within 12 months, classify as current unless the entity has a committed renewal or refinancing; (e) where a covenant breach has occurred and no waiver has been obtained, the entire facility must be classified as current per FRS 102 s11.45; (f) verify the current/non-current split per the financial statements agrees to this analysis."
      },
      {
        step: 7,
        description: "For director loans or related party loans, verify the terms and assess compliance with Companies Act 2006 Sections 197–214 (loans to directors) and FRS 102 Section 33 disclosure requirements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 550; CA 2006 s197–214",
        detail: "For each director/RP loan: (a) verify whether the loan requires shareholder approval under s.197 (loans to directors exceeding £10,000); (b) if approval is required, inspect the ordinary resolution; (c) verify interest and repayment terms are disclosed; (d) for loans from directors, verify the terms and any subordination agreements; (e) cross-reference to the related parties working paper (D15); (f) verify the loan is disclosed in the notes as required by CA 2006 s413 and FRS 102 s33."
      },
      {
        step: 8,
        description: "Verify the security provided over the entity's assets for borrowings. Cross-reference to the bank confirmation and to Companies House charges register.",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 505; ISA (UK) 500.10",
        detail: "From the bank confirmation and facility letters: (a) list all assets pledged as security (property, debenture, floating charge, specific charges over assets); (b) verify each charge is registered at Companies House within the statutory 21-day period; (c) cross-reference to the fixed assets (D7) and investments (D9) working papers to ensure consistency; (d) verify that the financial statements disclose the security provided; (e) identify any cross-guarantees or cross-collateralisation between group entities."
      },
      {
        step: 9,
        description: "For any borrowings repaid during the year, verify the repayment to the bank statement, verify the derecognition entries, and confirm no early repayment penalties exist that have not been recorded.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s11.36",
        detail: "For each repaid facility: (a) trace the repayment to the bank statement; (b) verify the carrying amount at the date of repayment (including unamortised fees and accrued interest); (c) calculate any gain or loss on derecognition and verify it is recorded in P&L; (d) verify the charge has been released at Companies House (satisfaction of charge); (e) confirm any break costs or early repayment penalties are recorded."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for loans and borrowings. Verify compliance with FRS 102 Section 11 and Companies Act 2006 requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s11.40–11.48A; CA 2006 Sch 1",
        detail: "Verify: (a) maturity analysis showing amounts due within 1 year, 1–2 years, 2–5 years, and over 5 years; (b) interest rates and terms are described; (c) security provided is disclosed; (d) any defaults or covenant breaches are disclosed; (e) the accounting policy for borrowing costs is stated (expensed or capitalised per FRS 102 s25); (f) for complex instruments (convertible loans, compound instruments), verify the accounting treatment and disclosure; (g) the total carrying amount of borrowings agrees to the balance sheet."
      }
    ],
    expectedResults: "All borrowings are confirmed by the lender, are accurately recorded at amortised cost, are complete (no undisclosed facilities), and are properly classified between current and non-current. The entity is in compliance with all loan covenants. Interest charges are accurately calculated. Security disclosures are complete.",
    exceptionHandling: "Covenant breaches are a significant finding with potential going concern implications. If a waiver has not been obtained, the entire facility must be classified as current and going concern must be reassessed. Undisclosed borrowings are a serious matter to be escalated immediately. Interest calculation errors should be reported on the schedule of unadjusted differences.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding loans and borrowings of £[X] as at [date]. Bank confirmations were [received for all facilities / not received for: ...]. Covenant compliance is [confirmed / the following breaches were identified: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D12 — PROVISIONS & CONTINGENCIES
  // ─────────────────────────────────────────────────────────────────────────────
  d12: {
    title: "Provisions & Contingencies Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that provisions recognised in the statement of financial position meet the recognition criteria of FRS 102 Section 21, are measured at the best estimate of the expenditure required to settle the obligation, and that contingent liabilities and contingent assets are appropriately disclosed.",
    isaRef: "ISA (UK) 540; ISA (UK) 501; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 21 — Provisions and Contingencies",
    risksAddressed: [
      "R34 — Completeness: risk that provisions for known obligations are not recorded, or that contingent liabilities requiring disclosure are omitted",
      "R35 — Valuation: risk that provisions are over- or under-estimated, or that the methodology for determining the best estimate is inappropriate",
      "R36 — Existence: risk that provisions are recorded for costs that do not meet the recognition criteria (i.e. no present obligation exists)"
    ],
    assertions: ["Completeness", "Existence", "Accuracy/Valuation", "Presentation", "Rights & Obligations"],
    population: "All provision balances per the trial balance, including warranty provisions, restructuring provisions, dilapidation provisions, onerous contract provisions, legal claims provisions, decommissioning provisions, and any other recognised provisions. All contingent liabilities and contingent assets requiring disclosure.",
    samplingApproach: "ISA (UK) 530 — All material provisions are individually tested as they each involve a unique estimate. This is not a sampling-based test. Each provision is assessed against the three recognition criteria independently.",
    procedures: [
      {
        step: 1,
        description: "Obtain a schedule of all provisions at the year end, showing opening balance, additions, utilisations, releases, unwinding of discount, and closing balance. Reconcile to the trial balance and draft financial statements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "Request the provisions schedule from management. (a) Cast the schedule; (b) verify opening balances to the prior year signed accounts; (c) verify each movement line; (d) agree closing balances to the TB; (e) agree to the provisions note in the draft accounts. Any provision in the prior year that has been released should be scrutinised — was the release genuine or an attempt to manage earnings?"
      },
      {
        step: 2,
        description: "For each material provision, test whether the three recognition criteria in FRS 102 s21.4 are met: (a) a present obligation as a result of a past event; (b) it is probable that a transfer of economic benefits will be required; (c) a reliable estimate can be made.",
        assertion: "Existence",
        isaRef: "ISA (UK) 540.8; FRS 102 s21.4",
        detail: "For each provision: (a) identify the obligating event and determine whether it gives rise to a legal or constructive obligation; (b) assess whether it is more likely than not (>50%) that a transfer of economic benefits will be required — consider legal advice, historical experience, management representations; (c) assess whether a reliable estimate can be made — if not, the item should be disclosed as a contingent liability rather than recognised; (d) document the conclusion for each criterion with supporting evidence."
      },
      {
        step: 3,
        description: "Assess the measurement of each material provision. Verify that the amount represents the best estimate of the expenditure required to settle the obligation at the year-end date.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s21.7",
        detail: "For each provision: (a) understand management's estimation methodology (single most likely outcome, weighted probability, or expected value for large populations); (b) assess the reasonableness of the inputs and assumptions; (c) where applicable, verify that the provision is measured at the present value of the expected expenditure (using a pre-tax discount rate reflecting the time value of money and risks specific to the liability); (d) perform sensitivity analysis on key assumptions; (e) compare the estimate to actual outcomes for similar provisions in prior years to assess management's track record of estimation."
      },
      {
        step: 4,
        description: "Send a solicitor's letter in accordance with ISA (UK) 501 requesting information on outstanding litigation, claims, and contingencies. Evaluate the responses received.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 501.9–501.12",
        detail: "Prepare a letter to the entity's solicitors requesting: (a) details of all outstanding litigation and claims as at the year end; (b) an assessment of the likely outcome and estimated financial exposure for each; (c) any pending claims of which the solicitor is aware; (d) accrued and unbilled legal fees. Review the response: (e) compare the matters disclosed to management's provisions and contingencies schedule; (f) assess whether the amounts provided are consistent with the solicitor's assessment; (g) if the solicitor's response is significantly different from management's assessment, investigate and discuss with the engagement partner."
      },
      {
        step: 5,
        description: "Test the warranty provision by analysing historical warranty claims data and comparing the provision rate to actual claim experience.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540.8; FRS 102 s21.7",
        detail: "Where a warranty provision exists: (a) obtain the warranty claims data for the past 3–5 years; (b) calculate the actual claims rate as a percentage of sales revenue; (c) compare to the rate used in the current year provision; (d) consider any changes in product quality, claims trends, or warranty terms that might affect the rate; (e) recalculate the provision using the auditor's assessed rate and compare to management's figure; (f) assess whether the provision covers the full warranty period for goods sold near the year end."
      },
      {
        step: 6,
        description: "For restructuring provisions, verify that the entity has a detailed formal plan and has raised a valid expectation in those affected that it will carry out the restructuring, per FRS 102 s21.11C.",
        assertion: "Existence",
        isaRef: "ISA (UK) 540.8; FRS 102 s21.11B–21.11C",
        detail: "A restructuring provision can only be recognised when: (a) the entity has a detailed formal plan identifying: the business affected, the principal locations, the approximate number of employees to be compensated for termination, the expenditure to be undertaken, and when the plan will be implemented; (b) the entity has raised a valid expectation in those affected by starting to implement the plan or by announcing its main features. Verify: (c) inspect the board minutes approving the plan; (d) verify that the plan has been communicated to affected employees; (e) verify the provision includes only direct expenditure arising from the restructuring and does not include costs of ongoing activities."
      },
      {
        step: 7,
        description: "Test dilapidation provisions for leased properties. Verify that the provision is based on a reasonable estimate of the cost of restoring the property to its original condition at lease end.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s21.4, s20.9",
        detail: "For each dilapidation provision: (a) review the lease agreement for reinstatement obligations; (b) assess whether the obligation is constructive or legal; (c) where a surveyor's estimate has been obtained, assess the surveyor's competence and objectivity; (d) where management has estimated internally, verify the basis (cost per square foot, comparable quotes, prior lease exits); (e) verify that the provision has been discounted to present value using an appropriate rate if the effect of discounting is material; (f) verify that the unwinding of the discount is charged to finance costs."
      },
      {
        step: 8,
        description: "Review whether any onerous contracts exist that require a provision. An onerous contract is one where the unavoidable costs of meeting the obligations exceed the expected economic benefits.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10; FRS 102 s21.11A",
        detail: "Consider: (a) loss-making contracts identified during the audit; (b) contracts where the selling price has fallen below the entity's cost; (c) vacant property leases where the entity is paying rent without economic benefit; (d) for each onerous contract identified, the provision should be the lower of: the cost of fulfilling the contract, or the penalties from failing to fulfil it; (e) verify that management has identified all onerous contracts by enquiry and review of contract profitability analyses."
      },
      {
        step: 9,
        description: "Assess whether contingent liabilities and contingent assets exist that require disclosure in the financial statements, even though they are not recognised on the balance sheet.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 501; FRS 102 s21.12–21.16",
        detail: "Consider: (a) possible obligations where the probability of outflow is not 'more likely than not' — these are contingent liabilities requiring disclosure; (b) guarantees given by the entity (cross-reference to bank confirmation); (c) warranties beyond those provided for; (d) pending litigation below the provision threshold; (e) tax disputes; (f) environmental claims. For contingent assets: (g) only disclose where inflow is probable (>50%) — do not recognise. Verify that the financial statement disclosures cover all identified contingencies."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for provisions and contingencies. Verify compliance with FRS 102 Section 21.14–21.17.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s21.14–21.17",
        detail: "For each class of provision, verify disclosure of: (a) the carrying amount at the beginning and end of the year; (b) additional provisions, amounts used, and unused amounts reversed; (c) a brief description of the nature and expected timing of outflows; (d) an indication of the uncertainties and any expected reimbursement. For contingent liabilities: (e) a brief description, an estimate of the financial effect, and indication of uncertainties — unless remote. For contingent assets: (f) disclosure only where probable. Verify the rare exemption from disclosure per s21.17 (seriously prejudicial) is not inappropriately applied."
      }
    ],
    expectedResults: "All provisions meet the FRS 102 s21.4 recognition criteria, are measured at the best estimate of the expenditure required, and are complete. Contingent liabilities and contingent assets are appropriately identified and disclosed. The solicitor's letter response is consistent with the provisions and disclosures.",
    exceptionHandling: "Where provisions do not meet the recognition criteria, they should be derecognised. Where material obligations are not provided for, they should be raised on the schedule of unadjusted differences. Failure to receive a solicitor's letter response is a scope limitation that may affect the audit opinion. Any disagreement with legal counsel's assessment should be discussed with the engagement partner and potentially with the entity's solicitor directly.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding provisions of £[X] as at [date]. [All provisions meet the FRS 102 s21.4 criteria / The following provisions do not meet the criteria: ...]. Contingent liabilities are [appropriately disclosed / require additional disclosure]. Solicitor's letter responses were [received and satisfactory / not received for: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D13 — TAXATION
  // ─────────────────────────────────────────────────────────────────────────────
  d13: {
    title: "Taxation Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that the current and deferred tax charges and balances in the financial statements are accurately calculated, complete, and properly presented in accordance with FRS 102 Section 29, and that the corporation tax computation is consistent with the financial statements.",
    isaRef: "ISA (UK) 540; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 29 — Income Tax",
    risksAddressed: [
      "R37 — Accuracy: risk that the corporation tax computation is incorrectly prepared, leading to an over- or under-provision for current tax",
      "R38 — Valuation: risk that the deferred tax balance is incorrectly calculated, particularly in relation to the recognition of deferred tax assets where future taxable profits are uncertain",
      "R39 — Completeness: risk that disallowable expenditure is omitted from the computation, or that timing differences giving rise to deferred tax are not identified"
    ],
    assertions: ["Accuracy/Valuation", "Completeness", "Existence", "Classification", "Presentation"],
    population: "The corporation tax computation for the current year, the current tax liability or asset per the trial balance, the deferred tax balance (asset or liability), and the tax charge in the profit and loss account (current tax and deferred tax components).",
    samplingApproach: "ISA (UK) 530 — Tax is tested primarily through recalculation and analytical procedures rather than sampling. All material adjustments in the computation are individually verified. The deferred tax calculation is recalculated in full.",
    procedures: [
      {
        step: 1,
        description: "Obtain the draft corporation tax computation for the current year. Verify that the starting profit per accounts agrees to the profit before tax per the draft financial statements.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.9",
        detail: "Agree the profit before tax in the CT computation to the draft P&L. If the computation has been prepared by a third-party tax adviser, obtain the computation and verify: (a) the starting figure agrees to the accounts; (b) the computation is mathematically correct; (c) the applicable tax rate is correct for the period (verify to the current Finance Act)."
      },
      {
        step: 2,
        description: "Test the adjustments for disallowable expenditure in the corporation tax computation. For each material adjustment, verify the nature and amount to the nominal ledger and supporting evidence.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10",
        detail: "For each adjustment: (a) depreciation add-back: agree to the depreciation charge per the P&L and fixed asset note; (b) entertaining: verify the amount per the nominal ledger analysis is wholly disallowed; (c) fines and penalties: verify any legal or regulatory fines are disallowed; (d) provisions: verify that non-deductible provisions (e.g. general bad debt provision) are added back; (e) capital items expensed in the accounts: identify and add back; (f) leasing disallowance for high-emission cars (CO2 > 50g/km): verify the restricted amount. Assess whether any disallowable items have been omitted from the computation."
      },
      {
        step: 3,
        description: "Test the capital allowances claim. Verify the capital allowance computations for Annual Investment Allowance (AIA), Writing Down Allowances (WDA), Structures and Buildings Allowance (SBA), and any first-year allowances.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "Verify: (a) AIA claim: the qualifying expenditure agrees to the additions in the fixed asset register (excluding cars, land, and assets for leasing); the AIA limit for the period is correctly applied; (b) WDA: the pool balances brought forward agree to the prior year computation; additions and disposals are correctly allocated between main pool (18%) and special rate pool (6%); the WDA is correctly calculated; (c) SBA: qualifying expenditure on non-residential structures is correctly identified and the 3% flat rate is applied; (d) balancing charges/allowances on disposals are correctly calculated; (e) short accounting period adjustments are applied where the period is less than 12 months."
      },
      {
        step: 4,
        description: "Verify the prior year tax position. Agree the prior year CT provision to the amount actually assessed by HMRC (CT61 or tax portal). Record any over/under provision adjustment.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain: (a) the prior year CT liability per the financial statements; (b) the CT61 or HMRC online assessment for the prior year; (c) calculate the over/under provision = provision per accounts less actual liability per HMRC. Verify: (d) the adjustment is correctly reflected in the current year tax charge (or as a prior year adjustment if material); (e) any enquiries or disputes with HMRC are identified and assessed for their impact on the provision; (f) the pattern of over/under provision over the past 3 years to assess management's estimation track record."
      },
      {
        step: 5,
        description: "Test R&D tax credits (where claimed). Verify that qualifying expenditure meets the criteria under CTA 2009 Part 13 (SME scheme) or Part 13A (RDEC scheme). Verify the credit or deduction calculation.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "Where R&D credits are claimed: (a) verify the entity meets the SME definition (or is claiming under RDEC for large companies); (b) review the qualifying expenditure analysis — staff costs, consumables, software, subcontracted R&D (limited to 65% for connected parties); (c) verify the expenditure relates to projects that seek to achieve an advance in science or technology (not routine development); (d) verify the enhancement rate (for SME: currently 86% additional deduction from April 2023, or merged scheme from April 2024); (e) for surrenderable losses, verify the calculation of the payable credit; (f) verify the R&D claim form has been filed or will be filed with the CT return."
      },
      {
        step: 6,
        description: "Recalculate the corporation tax liability at the applicable rate. Verify marginal relief calculations where applicable. Agree the current tax charge per the computation to the P&L and the creditor to the balance sheet.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s29.4",
        detail: "Recalculate: (a) taxable profit = profit before tax + disallowable items - non-taxable items - capital allowances +/- other adjustments; (b) apply the correct CT rate (verify to Finance Act — from April 2023: 25% for profits over £250k, 19% for profits under £50k, marginal relief for profits between); (c) for marginal relief, recalculate the effective rate using the fraction 3/200; (d) for associated companies, verify the lower and upper limits are divided; (e) agree the tax charge to the P&L and the net creditor/debtor to the BS; (f) prepare or verify the tax reconciliation note."
      },
      {
        step: 7,
        description: "Verify the tax reconciliation note, which reconciles the tax charge to the profit multiplied by the standard rate. Ensure all reconciling items are valid and correctly described.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s29.27",
        detail: "For each line in the reconciliation: (a) profit before tax multiplied by standard rate — verify the rate used; (b) effects of disallowable items — should agree to the computation; (c) effects of capital allowances in excess of depreciation — verify consistency; (d) effect of different tax rates (marginal relief, overseas) — verify; (e) prior year adjustments — agree to step 4; (f) effect of R&D credits — agree to step 5; (g) other items — verify each individually; (h) the total should agree to the tax charge in the P&L."
      },
      {
        step: 8,
        description: "Calculate or verify the deferred tax balance. Identify all timing differences between the accounting carrying amount and the tax base of assets and liabilities. Apply the tax rate expected to apply when the differences reverse.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s29.10–29.17",
        detail: "Identify timing differences: (a) accelerated capital allowances (tax WDV vs accounting NBV for each asset class); (b) provisions and accruals deductible only when paid (short-term timing differences); (c) revaluation gains not yet taxable; (d) tax losses carried forward; (e) pension prepayments or accruals; (f) share-based payment charges. For each: calculate the deferred tax = timing difference x future tax rate. For deferred tax assets: (g) assess whether there are sufficient future taxable profits against which the asset can be recovered — if not, do not recognise; (h) verify the net deferred tax balance agrees to the TB and the notes."
      },
      {
        step: 9,
        description: "Verify the VAT position at the year end. Reconcile the VAT control account to the VAT returns submitted for the year and to the year-end creditor or debtor balance.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10",
        detail: "Obtain: (a) the VAT control account from the nominal ledger; (b) copies of all VAT returns filed during the year. Reconcile: (c) output VAT per the returns to revenue and other taxable supplies per the accounts; (d) input VAT per the returns to expenses per the accounts (adjusted for irrecoverable VAT on entertaining, non-business items, etc.); (e) the year-end balance on the control account to the creditor/debtor in the TB; (f) verify payments to HMRC agree to the bank statements; (g) identify any VAT penalties or interest charges and verify disclosure."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for taxation. Verify compliance with FRS 102 Section 29 and Companies Act 2006 requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s29.24–29.27",
        detail: "Verify: (a) the tax charge is split between current tax and deferred tax in the P&L; (b) the current tax liability/asset is separately disclosed within creditors/debtors; (c) the deferred tax balance is presented as a separate line on the balance sheet (not netted with current tax); (d) the tax reconciliation note is complete and accurate (step 7); (e) the accounting policy for deferred tax is disclosed (full provision method, tax rate used); (f) for deferred tax assets, the nature of the evidence supporting recognition is disclosed; (g) any tax relating to items in OCI is disclosed separately."
      }
    ],
    expectedResults: "The corporation tax computation is consistent with the financial statements, correctly identifies all adjustments, and applies the correct tax rate. The current tax provision and deferred tax balance are accurately calculated. Capital allowances are correctly computed. Disclosures comply with FRS 102 Section 29.",
    exceptionHandling: "Tax computation errors should be discussed with the client's tax adviser and corrected where possible. Where the entity's computation has been prepared by the audit firm's tax department, maintain independence by ensuring the engagement team reviews the work critically. Any HMRC enquiry or dispute should be assessed for its impact on the provision and disclosed as a contingent liability if the outcome is uncertain. Deferred tax asset recognition disagreements should be escalated to the engagement partner.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding the current tax liability of £[X] and deferred tax [asset / liability] of £[X] as at [date]. The total tax charge of £[X] is [consistent / inconsistent] with the corporation tax computation. [No material misstatements were identified / The following misstatements were identified: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D14 — LEASES
  // ─────────────────────────────────────────────────────────────────────────────
  d14: {
    title: "Leases Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that lease arrangements are correctly identified, classified, and accounted for in accordance with FRS 102 Section 20 (or IFRS 16 where applicable), including the recognition and measurement of right-of-use assets and lease liabilities, and that lease-related disclosures are complete and accurate.",
    isaRef: "ISA (UK) 540; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 20 — Leases; IFRS 16 — Leases (where applicable)",
    risksAddressed: [
      "R40 — Classification: risk that leases are incorrectly classified as operating when they are finance leases (or vice versa under FRS 102), affecting balance sheet presentation",
      "R41 — Completeness: risk that lease arrangements are not identified or that the lease schedule is incomplete, leading to off-balance-sheet liabilities",
      "R42 — Valuation: risk that right-of-use assets and lease liabilities are incorrectly measured, including errors in the discount rate, lease term, or variable payments"
    ],
    assertions: ["Completeness", "Accuracy/Valuation", "Classification", "Existence", "Presentation"],
    population: "All lease arrangements entered into by the entity as lessee, including property leases, vehicle leases, equipment leases, and any other contracts containing a lease. The lease schedule should include both finance leases and operating leases (under FRS 102) or all leases other than short-term and low-value (under IFRS 16).",
    samplingApproach: "ISA (UK) 530 — All material leases are individually tested given the typically limited number and the complexity of the accounting. For entities with large vehicle or equipment fleets, a sample of leases within each category may be selected using stratified random sampling.",
    procedures: [
      {
        step: 1,
        description: "Obtain the complete lease schedule from management. Verify completeness by cross-referencing to the previous year's schedule, rent expenses in the nominal ledger, and enquiry of management regarding new or terminated leases.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.9",
        detail: "Obtain the lease schedule showing: asset description, lessor, start date, end date, lease term, annual rental, break clauses, renewal options, and classification. Cross-reference: (a) to the prior year schedule — verify all prior year leases are carried forward or properly terminated; (b) to the rent/lease payment nominal ledger codes — identify any payments not reflected in the schedule; (c) enquire of management about any new leases, lease modifications, or terminations during the year; (d) review board minutes for approval of significant new leases."
      },
      {
        step: 2,
        description: "For each material lease, assess the classification as a finance lease or an operating lease under FRS 102 Section 20. (Under IFRS 16, assess whether the contract contains a lease and whether any exemptions apply.)",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s20.5–20.6",
        detail: "Under FRS 102, a finance lease transfers substantially all the risks and rewards incidental to ownership. Apply the indicators: (a) does the lease transfer ownership by the end of the term? (b) is there a bargain purchase option? (c) does the lease term cover the major part (typically 75%+) of the asset's economic life? (d) does the present value of minimum lease payments amount to substantially all (typically 90%+) of the fair value of the asset? (e) are the leased assets specialised such that only the lessee can use them without major modification? If any indicator is met, the lease should be classified as a finance lease. Document the assessment for each material lease."
      },
      {
        step: 3,
        description: "For finance leases (FRS 102) or right-of-use assets (IFRS 16), verify the initial recognition of the asset and liability. Recalculate the opening balances using the lease terms and discount rate.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s20.9; IFRS 16.23–28",
        detail: "For each finance lease: (a) obtain the original lease agreement and verify the key terms (commencement date, term, payments, residual value guarantees, purchase options); (b) verify the fair value of the asset at inception; (c) verify the discount rate used (the interest rate implicit in the lease, or the entity's incremental borrowing rate if the implicit rate cannot be determined); (d) recalculate the present value of the minimum lease payments using the discount rate; (e) verify the asset was recognised at the lower of fair value and the present value of minimum lease payments (FRS 102) or at the amount of the lease liability plus initial direct costs (IFRS 16); (f) verify the liability was recognised at the same amount."
      },
      {
        step: 4,
        description: "For finance leases, recalculate the interest charge and the apportionment of lease payments between capital and interest for the current year. Verify the closing lease liability.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 540; FRS 102 s20.11",
        detail: "For each finance lease: (a) verify the opening lease liability balance to the prior year accounts; (b) recalculate the interest charge for the year using the actuarial method (opening liability x implicit rate / IBR); (c) verify the total lease payments made during the year to the bank statement; (d) calculate the capital repayment = total payments less interest; (e) verify the closing liability = opening liability + interest - payments; (f) agree the interest to the P&L finance costs; (g) agree the closing liability to the BS; (h) verify the split between current (due within one year) and non-current."
      },
      {
        step: 5,
        description: "For finance lease assets (or right-of-use assets), verify the depreciation charge for the year. Confirm the asset is depreciated over the shorter of the lease term and the asset's useful life (unless ownership transfers).",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s20.12; IFRS 16.31–33",
        detail: "For each leased asset: (a) verify the cost per the fixed asset register agrees to the initial recognition amount; (b) verify the depreciation period — shorter of the lease term and useful life, unless the entity reasonably expects to obtain ownership (then depreciate over useful life); (c) recalculate the depreciation charge for the year; (d) verify the charge is included in the P&L (in the appropriate cost category); (e) verify the closing NBV per the register agrees to the BS."
      },
      {
        step: 6,
        description: "For operating leases, verify that lease payments are charged to the profit and loss account on a straight-line basis over the lease term (or another systematic basis if more representative).",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s20.15",
        detail: "For each material operating lease: (a) agree the annual payment to the lease agreement; (b) where the lease includes rent-free periods, stepped rents, or other incentives, verify that the total cost is spread on a straight-line basis over the lease term; (c) recalculate the prepayment or accrual required at the year end for the straight-line adjustment; (d) verify the charge is correctly classified in the P&L; (e) where an operating lease premium was paid, verify it is being amortised over the lease term."
      },
      {
        step: 7,
        description: "For new leases entered into during the year, inspect the lease agreement and verify that the initial accounting is correct.",
        assertion: "Existence",
        isaRef: "ISA (UK) 500.10",
        detail: "For each new lease: (a) obtain and review the signed lease agreement; (b) identify the key terms: commencement date, duration, break options, renewal options, payment schedule, escalation provisions; (c) verify the classification (finance or operating under FRS 102; or recognition under IFRS 16); (d) verify the initial accounting entries; (e) for property leases, verify whether a dilapidation provision is required (cross-reference to D12)."
      },
      {
        step: 8,
        description: "For lease modifications or terminations during the year, verify that the accounting treatment is correct. Assess whether the modification creates a new lease or changes the existing lease.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s20; IFRS 16.44–46",
        detail: "For each modification: (a) understand the nature of the change (extension, reduction, change in payments, change in scope); (b) under FRS 102, assess whether the change affects the classification; (c) under IFRS 16, determine whether the modification is a separate lease (adds right to use additional assets at a commensurate price) or a remeasurement of the existing lease; (d) for terminations, verify the derecognition of the asset and liability and any gain or loss on termination; (e) verify that any termination penalties paid are correctly recorded."
      },
      {
        step: 9,
        description: "Assess whether any arrangements that are not in the legal form of a lease nevertheless contain a lease under the substance-over-form principle. Consider outsourcing contracts, take-or-pay contracts, and service agreements.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10; FRS 102 s20.3",
        detail: "Review significant contracts identified during the audit for embedded leases: (a) does the arrangement depend on the use of a specific asset? (b) does the arrangement convey the right to control the use of the asset? (c) is the entity obtaining substantially all of the economic benefits from the asset? If yes to all, the arrangement contains a lease that should be accounted for per Section 20 / IFRS 16. Common examples include dedicated servers, managed fleet vehicles, and co-location agreements."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for leases. Verify compliance with FRS 102 Section 20 (or IFRS 16) disclosure requirements.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s20.13–20.16; IFRS 16.47–60",
        detail: "Under FRS 102, verify: (a) for finance leases: the net carrying amount of the asset by class, total minimum lease payments analysed between within 1 year, 2–5 years, and over 5 years, and the related finance charge; (b) for operating leases: the total future minimum lease payments under non-cancellable leases analysed between within 1 year, 2–5 years, and over 5 years; (c) a general description of significant leasing arrangements (renewal, escalation, restrictions). Under IFRS 16, verify additional disclosures: depreciation by class, interest expense, short-term and low-value expense, total cash outflows, maturity analysis of lease liabilities, and reconciliation of opening to closing lease liabilities."
      }
    ],
    expectedResults: "All lease arrangements are identified and correctly classified. Finance lease assets and liabilities (or right-of-use assets and lease liabilities) are accurately measured. Operating lease charges are correctly spread. Disclosures are complete and comply with the applicable standard.",
    exceptionHandling: "Misclassification of a material lease (operating treated as finance or vice versa) will affect the balance sheet, P&L, and key ratios. Quantify the impact and discuss with the engagement partner. If the entity refuses to reclassify, consider the impact on the audit opinion. Any unidentified leases or embedded leases should be raised with management for correction. Disclosure omissions should be reported in the management letter.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding lease obligations. Right-of-use assets / finance lease assets of £[X] and lease liabilities of £[X] are [accurately stated / require adjustment]. Operating lease commitments of £[X] per annum are [correctly disclosed / require correction]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D15 — RELATED PARTIES
  // ─────────────────────────────────────────────────────────────────────────────
  d15: {
    title: "Related Party Transactions & Balances Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that all related party relationships and transactions have been identified, that related party transactions are at arm's length (or appropriately disclosed if not), and that disclosures comply with FRS 102 Section 33 and Companies Act 2006 requirements.",
    isaRef: "ISA (UK) 550; ISA (UK) 330; ISA (UK) 500",
    frsRef: "FRS 102 Section 33 — Related Party Disclosures; Companies Act 2006 s412–413",
    risksAddressed: [
      "R43 — Completeness: risk that related party relationships or transactions are not identified or disclosed, potentially concealing conflicts of interest or non-arm's length dealings",
      "R44 — Accuracy: risk that related party transactions are not conducted on arm's length terms and that the pricing or terms are prejudicial to the entity",
      "R45 — Disclosure: risk that the financial statements do not contain all required disclosures regarding related party relationships, transactions, and outstanding balances"
    ],
    assertions: ["Completeness", "Accuracy/Valuation", "Existence", "Rights & Obligations", "Presentation"],
    population: "All related party relationships, transactions, and outstanding balances during the year. Related parties include directors, key management personnel, close family members, entities controlled or significantly influenced by those individuals, parent entities, subsidiaries, associates, joint ventures, and post-employment benefit plans.",
    samplingApproach: "ISA (UK) 530 — All identified related party transactions and balances are individually tested given their inherent risk and disclosure requirements. This is not a sampling-based test. The focus is on completeness of identification rather than sampling from a known population.",
    procedures: [
      {
        step: 1,
        description: "Identify all related parties by compiling a comprehensive list from multiple sources: directors' declarations, Companies House searches, group structure charts, and enquiry of management and those charged with governance.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 550.13–550.17",
        detail: "Sources for identification: (a) obtain the annual declarations of interest from all directors; (b) search Companies House for each director's other directorships and PSC registrations; (c) obtain the group structure chart showing all subsidiaries, associates, and joint ventures; (d) enquire of management about family members of directors and key management who may have dealings with the entity; (e) review the prior year related party disclosures; (f) review the PSC register; (g) obtain management representations regarding completeness of related party information. Compile a master list of all related parties."
      },
      {
        step: 2,
        description: "Search for related party transactions in the accounting records. Review the nominal ledger for transactions with identified related parties, and scan for transactions with previously unidentified parties that may be related.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 550.18–550.19",
        detail: "Search methods: (a) review the sales and purchase ledger for transactions with entities on the master list; (b) review the directors' loan accounts for movements during the year; (c) scan journal entries for unusual transactions with unfamiliar parties; (d) review minutes of board meetings for references to related party dealings; (e) review contracts and agreements entered into during the year for counterparties on the related party list; (f) review expense claims by directors for payments to related parties; (g) review large or unusual transactions near the year end — ISA (UK) 550 requires heightened scepticism for year-end related party transactions."
      },
      {
        step: 3,
        description: "For each material related party transaction identified, assess whether the transaction was conducted on arm's length terms. Compare the pricing, terms, and conditions to equivalent third-party transactions.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 550.23",
        detail: "For each material transaction: (a) obtain the contract or agreement; (b) identify the price, payment terms, and other conditions; (c) compare to equivalent transactions with unrelated third parties (e.g. compare the sale price to list prices, or the rent to market rent per a surveyor's assessment); (d) where no comparable third-party transaction exists, assess the reasonableness of the terms by reference to market data or independent valuations; (e) if the transaction is not at arm's length, ensure it is appropriately disclosed; (f) for management charges, verify the basis of the charge and assess whether it represents a fair allocation of costs."
      },
      {
        step: 4,
        description: "Test directors' loan accounts. Verify all movements during the year, assess compliance with s.197–214 Companies Act 2006, and verify the year-end balance.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 550; CA 2006 s197–214",
        detail: "For each director's loan account: (a) obtain the account for the year showing all debits and credits; (b) vouch material debits (amounts advanced to the director) to board minutes or shareholder approval where required; (c) vouch credits (repayments by the director) to bank statements; (d) verify that loans to directors exceeding £10,000 have been approved by ordinary resolution per s.197; (e) assess whether any quasi-loans or credit transactions require approval; (f) calculate the s.455 CTA 2010 tax liability if the loan has not been repaid within 9 months of the year end; (g) verify the closing balance and agree to the TB and financial statement disclosure."
      },
      {
        step: 5,
        description: "Verify related party balances at the year end by confirming directly with the related party. Assess whether the balances are recoverable (for receivables) or accurately stated (for payables).",
        assertion: "Existence",
        isaRef: "ISA (UK) 505; ISA (UK) 550",
        detail: "For each material year-end balance with a related party: (a) send a direct confirmation to the counterparty confirming the balance; (b) investigate any differences between the confirmed amount and the ledger balance; (c) for amounts owed by related parties, assess recoverability — consider the financial position of the related party; (d) for amounts owed to related parties, verify the terms (interest rate, repayment, subordination) and whether they affect the entity's going concern assessment; (e) for intercompany balances within a group, verify the corresponding entry in the counterparty's books."
      },
      {
        step: 6,
        description: "Test compliance with Companies Act 2006 requirements for transactions with directors, including s.188 (service contracts), s.190 (substantial property transactions), s.197 (loans), and s.201 (quasi-loans).",
        assertion: "Rights & Obligations",
        isaRef: "ISA (UK) 550; CA 2006 s188–214",
        detail: "Verify: (a) service contracts exceeding 2 years have been approved by ordinary resolution (s.188); (b) substantial property transactions (exceeding £100,000 or 10% of net assets, whichever is lower, subject to a £5,000 minimum) have been approved by ordinary resolution (s.190); (c) loans to directors exceeding £10,000 have been approved (s.197); (d) guarantees for directors' obligations have been approved (s.200); (e) any transactions voidable under s.195 have been identified; (f) where approval was not obtained, assess whether the transaction can be ratified and the implications."
      },
      {
        step: 7,
        description: "For entities within a group, verify the nature and terms of intercompany transactions including management charges, dividends, interest, and transfer pricing arrangements.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 550; FRS 102 s33",
        detail: "For each category of intercompany transaction: (a) management charges — verify the basis of allocation (headcount, revenue, cost-plus) and assess whether it is reasonable and consistently applied; (b) dividends — verify they are within distributable profits and properly authorised (cross-reference to D10); (c) interest on intercompany loans — verify the rate is at arm's length or appropriately disclosed; (d) for cross-border transactions, consider transfer pricing implications under OECD guidelines and UK transfer pricing rules (TIOPA 2010 Part 4); (e) verify that all intercompany transactions are eliminated on consolidation."
      },
      {
        step: 8,
        description: "Review the management representation letter to verify that management has provided representations regarding the completeness of related party information.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 550.26; ISA (UK) 580",
        detail: "Verify that the management representation letter includes specific representations that: (a) all related party relationships and transactions have been disclosed to the auditors; (b) the entity has complied with all statutory requirements regarding transactions with directors and connected persons; (c) there are no related party transactions of which the auditors are unaware; (d) all identified related party transactions have been appropriately disclosed in the financial statements."
      },
      {
        step: 9,
        description: "Assess whether any identified related party transactions give rise to a fraud risk. Consider whether the transactions have a business rationale and whether their terms suggest they may have been entered into to engage in fraudulent financial reporting.",
        assertion: "Occurrence",
        isaRef: "ISA (UK) 550.22–550.23; ISA (UK) 240",
        detail: "Consider: (a) transactions with related parties that have no apparent commercial substance (e.g. round-tripping of funds, sales to related entities with no onward trade); (b) transactions on terms significantly outside the normal course of business; (c) transactions processed at or near the year end that appear designed to influence the financial position; (d) transactions with entities whose principal purpose appears to be to conduct transactions with the audited entity; (e) any such transactions should be discussed with the engagement partner and may require reporting under ISA (UK) 240."
      },
      {
        step: 10,
        description: "Review the financial statement disclosures for related party relationships, transactions, and balances. Verify compliance with FRS 102 Section 33 and Companies Act 2006.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 330.24; FRS 102 s33.5–33.14; CA 2006 s412–413",
        detail: "Verify: (a) the name of the parent entity and the ultimate controlling party are disclosed (s33.5); (b) for each related party with which transactions have occurred: the nature of the relationship, the nature and amount of transactions, and the amount of outstanding balances; (c) directors' remuneration is disclosed as required by CA 2006 s412–413 (aggregate emoluments, pension contributions, compensation for loss of office); (d) loans, quasi-loans, and credit transactions with directors are disclosed with required details (s413); (e) the exemption from disclosing transactions with wholly-owned subsidiaries (s33.11) is applied correctly where claimed; (f) transactions with key management personnel are disclosed in aggregate (s33.6)."
      }
    ],
    expectedResults: "All related party relationships and transactions have been identified and are properly disclosed. Related party transactions are at arm's length or the non-arm's length nature is disclosed. The entity has complied with Companies Act 2006 requirements for transactions with directors. No evidence of fraud through related party arrangements.",
    exceptionHandling: "Undisclosed related party relationships are a significant finding that may indicate management integrity issues. Non-compliance with Companies Act 2006 director transaction requirements should be reported to those charged with governance and may require qualification. Related party transactions without commercial substance should be reported to the engagement partner as a potential fraud indicator under ISA (UK) 240.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding related party relationships, transactions, and balances. [All related parties have been identified and transactions are properly disclosed / The following issues were noted: ...]. Compliance with Companies Act 2006 director transaction requirements is [confirmed / the following breaches were identified: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D16 — CASH FLOW STATEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  d16: {
    title: "Cash Flow Statement Testing Programme",
    objective: "To obtain sufficient appropriate audit evidence that the statement of cash flows is accurately prepared, properly classified between operating, investing, and financing activities, reconciles to the movement in cash and cash equivalents, and complies with FRS 102 Section 7 (or IAS 7 where applicable).",
    isaRef: "ISA (UK) 330; ISA (UK) 500; ISA (UK) 520",
    frsRef: "FRS 102 Section 7 — Statement of Cash Flows; IAS 7 — Statement of Cash Flows",
    risksAddressed: [
      "R46 — Accuracy: risk that the cash flow statement contains mathematical errors or that the reconciliation of profit to operating cash flows is incorrect",
      "R47 — Classification: risk that cash flows are classified in the wrong category (operating, investing, financing), distorting the entity's apparent cash generation",
      "R48 — Completeness: risk that significant non-cash transactions are not disclosed, or that the opening and closing cash reconciliation does not agree to the balance sheet"
    ],
    assertions: ["Accuracy/Valuation", "Classification", "Completeness", "Presentation", "Existence"],
    population: "The statement of cash flows in the draft financial statements, including the reconciliation of profit to operating cash flows (indirect method), and all material components of investing and financing activities. The opening and closing cash and cash equivalents balances.",
    samplingApproach: "ISA (UK) 530 — The cash flow statement is tested primarily through recalculation and reconciliation rather than sampling. Each material line item is individually verified to the financial statements, supporting schedules, or bank records.",
    procedures: [
      {
        step: 1,
        description: "Verify the opening and closing cash and cash equivalents balances in the cash flow statement agree to the balance sheet. Identify and verify the components of cash and cash equivalents.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.9; FRS 102 s7.2",
        detail: "Agree: (a) the opening cash and cash equivalents to the prior year audited balance sheet (cash at bank and in hand, less bank overdrafts repayable on demand, plus short-term highly liquid investments); (b) the closing cash and cash equivalents to the current year draft balance sheet; (c) verify the net movement = closing less opening; (d) confirm that bank overdrafts included as a component of cash equivalents are repayable on demand and form part of the entity's cash management per FRS 102 s7.7; (e) verify the total of the three activity sections equals the net movement."
      },
      {
        step: 2,
        description: "Test the reconciliation of profit before tax to net cash from operating activities (indirect method). Verify each adjustment line item to the financial statements or supporting schedules.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.7",
        detail: "Starting from profit before tax, verify each adjustment: (a) depreciation and amortisation — agree to the P&L charge and fixed asset / intangible asset notes; (b) impairment charges — agree to relevant notes; (c) profit or loss on disposal of fixed assets — agree to the fixed assets working paper (D7); (d) interest receivable — agree to the P&L and verify it appears in investing activities; (e) interest payable — agree to the P&L and verify it appears in financing (or operating) activities; (f) share-based payment charge — agree to the P&L; (g) other non-cash items (e.g. provisions, foreign exchange) — verify each to the relevant schedule."
      },
      {
        step: 3,
        description: "Verify the working capital movements within operating cash flows. Recalculate the movement in trade and other receivables, inventories, and trade and other payables, and agree to the balance sheet movements.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.7",
        detail: "For each working capital line: (a) calculate the movement = closing balance less opening balance per the balance sheet; (b) verify the sign convention (increase in debtors = cash outflow, shown as negative; increase in creditors = cash inflow, shown as positive; increase in stock = cash outflow); (c) if the movement per the cash flow statement does not agree to the simple balance sheet movement, identify the reconciling items (e.g. non-cash movements such as provisions, assets acquired on credit, foreign exchange adjustments); (d) verify each reconciling item is valid; (e) ensure the movements exclude items classified elsewhere (e.g. fixed asset creditors should not be in working capital)."
      },
      {
        step: 4,
        description: "Verify the cash flows from operating activities include the tax paid line. Reconcile the tax paid to the opening tax creditor, the tax charge for the year, and the closing tax creditor.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.14",
        detail: "Tax paid reconciliation: (a) opening tax creditor per the prior year BS; (b) plus current year tax charge per the P&L; (c) less closing tax creditor per the current year BS; (d) equals tax paid during the year; (e) compare to the tax paid line in the cash flow statement; (f) any difference may arise from prior year under/over provisions, deferred tax movements, or R&D credits received; (g) for a sense-check, compare the tax paid to the HMRC payment records or bank statements."
      },
      {
        step: 5,
        description: "Test the investing activities section. Verify the purchase and sale of fixed assets, purchase and sale of investments, and interest received to supporting schedules and bank statements.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.10",
        detail: "For each investing activity line: (a) purchase of tangible fixed assets — agree to the additions per the fixed asset register, adjusted for items acquired on credit (which are non-cash); (b) proceeds of sale of fixed assets — agree to the disposals working paper and trace the cash to the bank statement; (c) purchase of investments — agree to the investments working paper (D9) and bank statement; (d) proceeds of sale of investments — agree to D9 and bank statement; (e) interest received — agree to the P&L and bank statement; (f) verify that only cash payments are included — non-cash items (e.g. assets acquired via finance lease) should be excluded."
      },
      {
        step: 6,
        description: "Test the financing activities section. Verify new loans drawn, loan repayments, finance lease payments, dividends paid, and share capital issued to supporting schedules and bank statements.",
        assertion: "Classification",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.11",
        detail: "For each financing activity line: (a) new borrowings — agree to the loan agreements and drawdowns per bank statements; (b) loan repayments — agree to the loan schedules and bank statements, separating the capital element from interest; (c) finance lease payments (capital element only) — agree to the lease schedules; (d) dividends paid — agree to the bank statement and dividend documentation (cross-reference D10); (e) proceeds from share issues — agree to the SH01 and bank statement; (f) interest paid — agree to the P&L and bank statements (note: FRS 102 allows interest paid to be classified as operating or financing — verify consistency with policy)."
      },
      {
        step: 7,
        description: "Verify the overall arithmetic of the cash flow statement. Confirm that operating + investing + financing cash flows equals the net increase/decrease in cash and cash equivalents.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.9",
        detail: "Cast all three sections: (a) total operating activities; (b) total investing activities; (c) total financing activities; (d) sum of the three = net increase/(decrease) in cash and cash equivalents; (e) opening cash + net movement = closing cash; (f) closing cash per the cash flow statement agrees to the balance sheet; (g) if there are exchange rate effects on cash held in foreign currency, these should be shown as a separate line item."
      },
      {
        step: 8,
        description: "Prepare or verify the reconciliation of net debt (where presented). Verify the opening net debt, cash flows, new finance leases, and other non-cash changes to the closing net debt figure.",
        assertion: "Accuracy/Valuation",
        isaRef: "ISA (UK) 500.10; FRS 102 s7 Appendix",
        detail: "Where a net debt reconciliation is presented (encouraged by FRS 102): (a) agree the opening net debt to the prior year BS (borrowings + finance lease liabilities - cash); (b) agree cash flow movements to the cash flow statement (new borrowings, repayments, finance lease payments); (c) identify non-cash movements (new finance leases entered into, amortisation of loan fees, exchange differences); (d) verify the closing net debt agrees to the current year BS; (e) cast the reconciliation and verify all lines."
      },
      {
        step: 9,
        description: "Identify and verify the disclosure of significant non-cash transactions that do not appear in the cash flow statement but are relevant to understanding the entity's investing and financing activities.",
        assertion: "Completeness",
        isaRef: "ISA (UK) 500.10; FRS 102 s7.18",
        detail: "Non-cash transactions to consider: (a) assets acquired under finance leases (asset and liability recognised but no cash outflow); (b) conversion of debt to equity; (c) acquisition of business in exchange for shares; (d) non-cash dividends (e.g. dividends in specie); (e) property transfers between group entities at book value. For each: verify the transaction is excluded from the cash flow statement but disclosed in the notes as required by FRS 102 s7.18."
      },
      {
        step: 10,
        description: "Perform an overall analytical review of the cash flow statement. Assess whether the cash flows are consistent with the auditor's understanding of the business, and investigate any unexpected patterns.",
        assertion: "Presentation",
        isaRef: "ISA (UK) 520.5; ISA (UK) 330.24",
        detail: "Consider: (a) is operating cash flow positive and consistent with reported profits? A profitable entity with consistently negative operating cash flow is a warning sign for revenue or working capital manipulation; (b) is the level of capital expenditure consistent with the fixed asset additions and the business strategy? (c) are the financing cash flows consistent with the known borrowing and equity transactions? (d) does the cash movement explain the balance sheet change in cash? (e) compare the cash flow statement to the prior year and to budget; (f) verify the overall presentation complies with FRS 102 s7 / IAS 7, including the correct method (indirect) and classification policy."
      }
    ],
    expectedResults: "The cash flow statement is arithmetically correct, reconciles to the balance sheet movements in cash and cash equivalents, and is properly classified between operating, investing, and financing activities. All material non-cash transactions are disclosed. The statement complies with FRS 102 Section 7.",
    exceptionHandling: "Arithmetic errors in the cash flow statement should be corrected before the financial statements are finalised. Classification errors (e.g. capital expenditure in operating activities) should be adjusted. Where the cash flow statement does not reconcile to the balance sheet, investigate and resolve all differences before signing. Any unexplained discrepancies may indicate unrecorded transactions or errors in other areas of the financial statements.",
    conclusionTemplate: "Based on the substantive procedures performed above, [sufficient / insufficient] appropriate audit evidence has been obtained regarding the statement of cash flows. The cash flow statement [reconciles / does not reconcile] to the balance sheet. Cash flows are [properly classified / require reclassification]. [No material misstatements were identified / The following misstatements were identified: ...]. This working paper has been prepared by [preparer] on [date] and reviewed by [reviewer] on [date]."
  }
};
