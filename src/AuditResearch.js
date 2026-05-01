/**
 * AuditResearch.js
 *
 * Comprehensive audit research data aligned with International Standards on
 * Auditing (UK) as adopted by the Financial Reporting Council (FRC).
 * All ISA references are to the UK-adopted versions unless otherwise stated.
 *
 * Exports:
 *   AUDIT_ASSERTIONS
 *   EVIDENCE_HIERARCHY
 *   SAMPLING_GUIDANCE
 *   ESTIMATES_FRAMEWORK
 *   FRAUD_FRAMEWORK
 *   GOING_CONCERN_FRAMEWORK
 *   GROUP_AUDIT_FRAMEWORK
 *   ISA_315_INTERNAL_CONTROL
 *   ISA_330_AUDIT_RESPONSES
 *   ISA_500_EVIDENCE
 *   ISA_505_CONFIRMATIONS
 *   ISA_520_ANALYTICAL_PROCEDURES
 *   ISA_550_RELATED_PARTIES
 *   ISA_560_SUBSEQUENT_EVENTS
 *   ISA_620_EXPERTS
 */

// ---------------------------------------------------------------------------
// 1. AUDIT_ASSERTIONS  (ISA (UK) 315 Revised 2019, paras A190-A192)
//    13 assertions across three categories.
// ---------------------------------------------------------------------------

export const AUDIT_ASSERTIONS = [
  // ── Classes of Transactions & Events (period under audit) ──────────────
  {
    id: "Occurrence",
    category: "Classes of Transactions and Events",
    name: "Occurrence",
    definition:
      "Transactions and events that have been recorded have occurred and pertain to the entity. " +
      "This assertion addresses the risk that the financial statements include transactions that " +
      "did not actually take place — for example, fictitious revenue, fabricated purchases, or " +
      "payroll costs for ghost employees. If the occurrence assertion is not satisfied, the " +
      "financial statements will be overstated.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(i)",
    examplesOfMisstatement: [
      "Recording fictitious revenue transactions to inflate reported turnover.",
      "Including purchases from suppliers with whom no genuine trade occurred.",
      "Recording payroll costs for non-existent (ghost) employees.",
      "Booking intercompany sales that lack genuine commercial substance.",
      "Recognising grant income before the performance conditions attached to a government grant have been met under FRS 102 Section 24.",
    ],
    typicalProcedures: [
      "Vouching a sample of recorded transactions to supporting source documents (sales invoices, delivery notes, signed contracts, purchase orders).",
      "Inspecting goods-received notes and matching to purchase-ledger entries.",
      "Confirming a sample of revenue transactions directly with customers via external confirmation (ISA (UK) 505).",
      "Reviewing journal entries for unusual or non-recurring transactions near the period end.",
      "Performing cut-off testing around the year-end date for both sales and purchases.",
      "Testing for related-party transactions and verifying their commercial substance (FRS 102 Section 33 / IAS 24).",
    ],
  },
  {
    id: "Completeness",
    category: "Classes of Transactions and Events",
    name: "Completeness",
    definition:
      "All transactions and events that should have been recorded have been recorded. This " +
      "assertion addresses the risk that valid transactions have been omitted from the accounting " +
      "records, leading to understatement of financial statement line items. Completeness is " +
      "typically the primary assertion for liabilities and expenses.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(ii)",
    examplesOfMisstatement: [
      "Failure to accrue for goods received before the year-end where invoices have not yet arrived.",
      "Omitting liabilities for outstanding legal claims or warranty provisions that meet recognition criteria under FRS 102 Section 21.",
      "Not recording a purchase of capital equipment received before the period end.",
      "Excluding cash receipts from the bank reconciliation, leading to understated revenue.",
      "Failing to record employee benefit obligations earned but not yet paid (e.g., holiday pay accrual).",
    ],
    typicalProcedures: [
      "Tracing from source documents (delivery notes, purchase orders, goods-received notes) to the accounting records.",
      "Performing a search for unrecorded liabilities by examining post-year-end payments and invoices received after the period end.",
      "Reconciling control accounts to sub-ledgers and investigating reconciling items.",
      "Reviewing bank statements for receipts and payments not recorded in the cash book.",
      "Comparing sequential numbering of source documents (e.g., goods-received notes, despatch notes) to identify gaps.",
      "Testing management representations regarding completeness against third-party confirmations.",
    ],
  },
  {
    id: "Accuracy",
    category: "Classes of Transactions and Events",
    name: "Accuracy",
    definition:
      "Amounts and other data relating to recorded transactions and events have been recorded " +
      "appropriately. This assertion addresses the risk that transactions are recorded at " +
      "incorrect amounts, in the wrong accounts, or with inaccurate descriptions. Accuracy " +
      "differs from valuation in that it relates to the initial recording of transactions " +
      "rather than the carrying amount of balances at the period end.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(iii)",
    examplesOfMisstatement: [
      "Recording a purchase invoice at an incorrect amount due to a data-entry error.",
      "Applying the wrong VAT rate to sales transactions (e.g., standard rate instead of zero rate per HMRC guidance).",
      "Translating foreign-currency transactions at an incorrect exchange rate at the transaction date.",
      "Capitalising an expense that should have been charged to profit or loss.",
      "Misallocating overhead costs between departments or cost centres.",
    ],
    typicalProcedures: [
      "Recalculating invoice totals and checking the arithmetic accuracy of ledger postings.",
      "Agreeing transaction amounts to supporting documentation such as contracts, invoices, and delivery notes.",
      "Testing the mathematical accuracy of journal entries and consolidation adjustments.",
      "Verifying foreign-currency translations against published exchange rates at the transaction date (Bank of England daily rates).",
      "Using CAATs (Computer-Assisted Audit Techniques) to re-perform calculations across large transaction populations.",
      "Checking the correct application of VAT rates per HMRC guidance and the VAT Act 1994.",
    ],
  },
  {
    id: "Cut-off",
    category: "Classes of Transactions and Events",
    name: "Cut-off",
    definition:
      "Transactions and events have been recorded in the correct accounting period. This " +
      "assertion addresses the risk that transactions are shifted between periods — either " +
      "brought forward to inflate current-period results or deferred to improve the next " +
      "period. Cut-off is closely related to occurrence and completeness but focuses " +
      "specifically on the timing of recognition.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(iv)",
    examplesOfMisstatement: [
      "Recording January revenue in the December accounting period to inflate year-end results.",
      "Deferring the recognition of purchase invoices received before year-end into the following period.",
      "Failing to accrue for services consumed but not yet invoiced at the period end.",
      "Recognising revenue on goods despatched after the year-end date as if despatched before.",
      "Recording first-week-of-January payroll costs in the December period to reduce next year's expenditure.",
    ],
    typicalProcedures: [
      "Examining sales and purchase transactions around the year-end date (typically last 5 days before and first 5 days after the period end).",
      "Inspecting goods-despatched notes and delivery records to confirm the period of despatch and transfer of risks and rewards.",
      "Reviewing credit notes issued shortly after the year-end for evidence of period-end sales manipulation.",
      "Testing the last goods-received notes before year-end and the first after year-end to verify correct period of recording.",
      "Reviewing accruals and prepayments schedules for reasonableness against the underlying documentation.",
      "Inspecting bank statements around the year-end to verify the correct recording date of receipts and payments.",
    ],
  },
  {
    id: "Classification",
    category: "Classes of Transactions and Events",
    name: "Classification",
    definition:
      "Transactions and events have been recorded in the proper accounts. This assertion " +
      "addresses the risk that items are misclassified between financial statement line items — " +
      "for example, treating capital expenditure as revenue expenditure, classifying current " +
      "liabilities as non-current, or recording operating activities as investing activities in " +
      "the statement of cash flows.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(v)",
    examplesOfMisstatement: [
      "Classifying a finance lease as an operating lease under FRS 102 Section 20, thereby understating both assets and liabilities.",
      "Recording capital expenditure as repairs and maintenance expense, understating fixed assets.",
      "Classifying a long-term loan repayable within 12 months as a non-current liability.",
      "Misclassifying related-party transactions as arm's-length third-party transactions.",
      "Recording government grants as revenue instead of deferred income when conditions are not yet met (FRS 102 Section 24).",
    ],
    typicalProcedures: [
      "Reviewing the entity's chart of accounts and account coding for appropriateness against the applicable financial reporting framework.",
      "Testing a sample of transactions to verify correct account allocation per FRS 102 or UK-adopted IFRS.",
      "Inspecting lease agreements to determine correct classification as finance or operating leases (or right-of-use assets under IFRS 16).",
      "Reviewing capital expenditure additions to confirm they meet the capitalisation criteria of the entity's accounting policy.",
      "Examining debt agreements to verify correct current / non-current split based on contractual repayment terms.",
      "Discussing classification policies with management and evaluating their reasonableness against the applicable standard.",
    ],
  },
  {
    id: "Presentation",
    category: "Classes of Transactions and Events",
    name: "Presentation",
    definition:
      "Transactions and events are appropriately aggregated or disaggregated and clearly " +
      "described, and related disclosures are relevant and understandable in the context of the " +
      "requirements of the applicable financial reporting framework. This assertion bridges the " +
      "gap between proper recording and proper communication to the users of the financial statements.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(a)(vi)",
    examplesOfMisstatement: [
      "Netting off revenue and cost of sales when gross presentation is required under FRS 102.",
      "Failing to separately disclose material exceptional or non-recurring items as required by FRS 102 or IAS 1.",
      "Omitting the required analysis of expenses by nature or function.",
      "Not providing sufficient disaggregation of revenue streams as required by IFRS 15.",
      "Presenting related-party transactions without the disclosures required by FRS 102 Section 33 / IAS 24.",
    ],
    typicalProcedures: [
      "Reviewing financial statements against the applicable disclosure checklist (e.g., ICAEW / ACCA FRS 102 checklist, IASB IFRS checklist).",
      "Comparing presentation with prior-year financial statements and noting any inconsistencies requiring explanation.",
      "Evaluating whether aggregation levels are appropriate by reference to materiality (both quantitative and qualitative).",
      "Checking that items required to be shown separately (e.g., directors' remuneration under CA 2006 s.412-413) are properly disclosed.",
      "Reviewing the statement of cash flows for correct classification of operating, investing, and financing activities (FRS 102 Section 7 / IAS 7).",
    ],
  },

  // ── Account Balances (at the period end) ───────────────────────────────
  {
    id: "Existence",
    category: "Account Balances",
    name: "Existence",
    definition:
      "Assets, liabilities, and equity interests exist at the period-end date. This assertion " +
      "addresses the risk that balances recorded in the financial statements represent items " +
      "that do not exist or are not held by the entity at the balance-sheet date. Existence is " +
      "typically the primary assertion for assets.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(b)(i)",
    examplesOfMisstatement: [
      "Recording inventory that has already been sold or scrapped before the year-end but has not been removed from the records.",
      "Including a receivable from a customer that does not exist or has been fabricated.",
      "Overstating the cash balance by not recording a bank overdraft position at the period end.",
      "Including assets that were disposed of prior to the year-end in the fixed-asset register.",
      "Recording investment holdings that have been redeemed or matured prior to the year-end.",
    ],
    typicalProcedures: [
      "Attending the physical inventory count and performing test counts (ISA (UK) 501, paras 4-8).",
      "Obtaining direct confirmations from banks, debtors, and solicitors (ISA (UK) 505).",
      "Inspecting title deeds, vehicle registration documents, and share certificates for tangible and financial assets.",
      "Agreeing cash and bank balances to bank confirmation letters and year-end bank statements.",
      "Inspecting fixed-asset items on a sample basis by physically verifying their existence at the entity's premises.",
      "Reviewing post-year-end activity in debtor accounts (e.g., cash receipts) for evidence of existence at the year-end.",
    ],
  },
  {
    id: "Rights_Obligations",
    category: "Account Balances",
    name: "Rights and Obligations",
    definition:
      "The entity holds or controls the rights to assets, and liabilities are the obligations " +
      "of the entity. This assertion addresses the risk that assets recorded in the balance sheet " +
      "do not belong to the entity or that liabilities are not genuine obligations of the entity. " +
      "Rights and obligations is particularly important for assets held under complex arrangements " +
      "such as consignment, sale-and-leaseback, or factoring.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(b)(ii)",
    examplesOfMisstatement: [
      "Recording goods held on consignment from a supplier as the entity's own inventory.",
      "Including leased assets as owned property without appropriate disclosure of the lease arrangement.",
      "Recording assets held in trust for a third party as assets of the reporting entity.",
      "Failing to disclose charges, liens, or encumbrances on assets that restrict the entity's rights.",
      "Recording revenue from a bill-and-hold arrangement before the substantive risks and rewards have passed to the buyer.",
    ],
    typicalProcedures: [
      "Inspecting title deeds, contracts, and registration documents to verify ownership of assets.",
      "Reviewing lease agreements to determine whether the entity holds a right-of-use asset or an ownership interest.",
      "Obtaining legal confirmations from the entity's solicitors regarding pending claims and charges on assets.",
      "Inspecting Companies House filings for any registered charges against the entity's assets (section 859A CA 2006).",
      "Reviewing minutes of board meetings for evidence of asset acquisitions, disposals, and pledges.",
      "Examining loan agreements and security documents for encumbrances over assets.",
    ],
  },
  {
    id: "Completeness_Bal",
    category: "Account Balances",
    name: "Completeness (Balances)",
    definition:
      "All assets, liabilities, and equity interests that should have been recorded have been " +
      "recorded. This assertion addresses the risk that genuine balances at the period end are " +
      "omitted from the financial statements. For liabilities, completeness is often the " +
      "primary assertion — the entity may have an incentive to understate its obligations.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(b)(iii)",
    examplesOfMisstatement: [
      "Omitting a contingent liability for a legal claim that meets the recognition criteria under FRS 102 Section 21 / IAS 37.",
      "Not recognising a provision for restructuring costs when a constructive obligation exists at the period end.",
      "Failing to record all bank accounts, including those held in foreign jurisdictions or in the names of subsidiaries.",
      "Omitting accrued employee bonuses that have been earned by the period end but not yet paid.",
      "Not recording intercompany balances owed to fellow group entities at the consolidation level.",
    ],
    typicalProcedures: [
      "Performing a search for unrecorded liabilities by examining post-year-end payments and invoices received after the period end.",
      "Obtaining confirmation from all banks with which the entity has had dealings during the period (including nil-balance accounts).",
      "Reviewing solicitors' letters for details of contingent liabilities, claims, and assessments not recorded in the financial statements.",
      "Reconciling the fixed-asset register to the general ledger and investigating any reconciling differences.",
      "Examining board minutes and contracts for commitments, contingencies, and guarantees requiring disclosure or recognition.",
      "Reviewing intercompany reconciliations for completeness of balances and investigating unmatched items.",
    ],
  },
  {
    id: "Valuation_Allocation",
    category: "Account Balances",
    name: "Valuation and Allocation",
    definition:
      "Assets, liabilities, and equity interests are included in the financial statements at " +
      "appropriate amounts, and any resulting valuation or allocation adjustments are " +
      "appropriately recorded. This is often the most complex and judgemental assertion, " +
      "requiring the auditor to evaluate accounting estimates, impairment assessments, and " +
      "fair-value measurements.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(b)(iv)",
    examplesOfMisstatement: [
      "Failing to impair a trade receivable that is unlikely to be recovered, overstating debtors.",
      "Overstating inventory by not writing down slow-moving or obsolete stock to net realisable value (FRS 102 Section 13 / IAS 2).",
      "Using inappropriate depreciation rates or useful lives for tangible fixed assets.",
      "Measuring a financial instrument at an incorrect fair value (e.g., using stale data for a Level 2 or Level 3 instrument).",
      "Understating a defined-benefit pension obligation due to inappropriate actuarial assumptions (FRS 102 Section 28 / IAS 19).",
      "Not recognising a revaluation loss on investment property under FRS 102 Section 16 / IAS 40.",
    ],
    typicalProcedures: [
      "Testing the net realisable value of inventory by comparing cost to post-year-end selling prices less estimated costs to complete and sell.",
      "Reviewing the trade receivables ageing and assessing the adequacy of the expected credit loss / bad-debt provision.",
      "Recalculating depreciation charges using the entity's stated policy, useful-life estimates, and residual values.",
      "Engaging an auditor's expert (ISA (UK) 620) to evaluate fair-value measurements of complex financial instruments or investment property.",
      "Reviewing the assumptions underpinning management's impairment assessment for goodwill and other intangible assets (IAS 36 / FRS 102 Section 27).",
      "Testing the recoverability of deferred tax assets by evaluating management's forecasts of future taxable profits.",
      "Assessing the reasonableness of actuarial assumptions (discount rate, inflation rate, mortality tables) used in defined-benefit pension calculations.",
    ],
  },

  // ── Presentation and Disclosure ────────────────────────────────────────
  {
    id: "Occurrence_Rights_Disc",
    category: "Presentation and Disclosure",
    name: "Occurrence and Rights and Obligations (Disclosure)",
    definition:
      "Disclosed events, transactions, and other matters have occurred and pertain to the " +
      "entity. This assertion ensures that disclosures in the notes to the financial statements " +
      "are not fictitious, do not relate to a different entity, and genuinely involve the " +
      "reporting entity.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(c)(i)",
    examplesOfMisstatement: [
      "Disclosing a contingent asset that does not exist or has no genuine basis in fact.",
      "Including capital commitments in the notes that relate to a different group entity rather than the reporting entity.",
      "Disclosing post-balance-sheet events that did not actually occur or were fabricated.",
      "Claiming related-party relationships in the disclosures that are fabricated or misrepresented.",
      "Disclosing government grants received when the funds were not actually received or the conditions have not been met.",
    ],
    typicalProcedures: [
      "Vouching disclosed events and transactions to underlying supporting documentation.",
      "Confirming disclosed contingencies and commitments with the entity's legal advisors via a solicitor's letter.",
      "Verifying that related-party disclosures are supported by evidence of the actual relationships and transactions (e.g., Companies House records, shareholder registers).",
      "Inspecting board minutes and correspondence for post-balance-sheet events disclosed in the financial statements.",
      "Reviewing disclosure of government grant conditions against the underlying grant letters and related correspondence.",
    ],
  },
  {
    id: "Completeness_Disc",
    category: "Presentation and Disclosure",
    name: "Completeness (Disclosure)",
    definition:
      "All disclosures that should have been included in the financial statements have been " +
      "included. This assertion addresses the risk that required or material disclosures have " +
      "been omitted from the notes or other parts of the financial statements. Omitted " +
      "disclosures can be just as misleading as misstated amounts.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(c)(ii)",
    examplesOfMisstatement: [
      "Omitting disclosures of related-party transactions required by FRS 102 Section 33 / IAS 24.",
      "Failing to disclose directors' remuneration as required by the Companies Act 2006, s.412-413.",
      "Not disclosing material contingent liabilities as required by FRS 102 Section 21 / IAS 37.",
      "Omitting the accounting-policy disclosures required by FRS 102 Section 8 / IAS 8.",
      "Failing to disclose subsequent events that require adjustment or disclosure under FRS 102 Section 32 / IAS 10.",
    ],
    typicalProcedures: [
      "Using a comprehensive disclosure checklist (e.g., ICAEW Financial Reporting Faculty checklist for FRS 102 or the IASB checklist for IFRS).",
      "Reviewing the Companies Act 2006 requirements applicable to the entity's size (small, medium, large, or PIE) for mandatory disclosures.",
      "Examining solicitors' letters and board minutes for matters requiring disclosure that may not be reflected in the financial statements.",
      "Comparing disclosures with the prior year to identify any items that may have been inadvertently omitted.",
      "Considering the need for disclosure of key sources of estimation uncertainty under FRS 102 para 8.7 / IAS 1 para 125.",
      "Reviewing the FRC's annual thematic reviews for current-year disclosure focus areas and ensuring compliance.",
    ],
  },
  {
    id: "Classification_Understandability",
    category: "Presentation and Disclosure",
    name: "Classification and Understandability",
    definition:
      "Financial information is appropriately presented and described, and disclosures are " +
      "clearly expressed. This assertion addresses whether the financial statements are presented " +
      "in a manner that is understandable to users and complies with the requirements of the " +
      "applicable financial reporting framework. It encompasses both the technical classification " +
      "of disclosed items and the clarity with which information is communicated.",
    isaRef: "ISA (UK) 315 (Revised 2019), para A190(c)(iii)",
    examplesOfMisstatement: [
      "Using overly technical or vague language in disclosures that obscures the entity's financial position from users.",
      "Aggregating dissimilar items in a note so that a user cannot understand the composition of a material balance.",
      "Failing to distinguish between adjusting and non-adjusting post-balance-sheet events in the disclosures.",
      "Presenting lease liabilities without distinguishing between current and non-current portions.",
      "Including generic boilerplate disclosures that are not specific to the entity's circumstances, contrary to FRC guidance.",
    ],
    typicalProcedures: [
      "Reviewing the financial statements as a whole for clarity, internal consistency, and compliance with the applicable framework.",
      "Assessing whether accounting-policy disclosures are entity-specific rather than generic boilerplate language.",
      "Evaluating the disaggregation of information in the notes against quantitative and qualitative materiality thresholds.",
      "Checking that comparative information is presented consistently with the current period and that any reclassifications are explained.",
      "Considering whether the strategic report and directors' report (where applicable) are consistent with the financial statements (ISA (UK) 720).",
      "Reviewing FRC guidance on clear and concise reporting, including FRC Lab publications on disclosure effectiveness.",
    ],
  },
];


// ---------------------------------------------------------------------------
// 2. EVIDENCE_HIERARCHY  (ISA (UK) 500, paras 5-11, A1-A51)
//    6 types ranked from most to least reliable.
// ---------------------------------------------------------------------------

export const EVIDENCE_HIERARCHY = [
  {
    rank: 1,
    type: "External Confirmation (Direct)",
    reliability: "Highest",
    isaRef: "ISA (UK) 505, paras 2-7, A1-A7",
    description:
      "Audit evidence obtained as a direct written response to the auditor from a third party " +
      "(the confirming party), in paper form, electronic form, or other medium. Direct " +
      "confirmations obtained by the auditor from independent external sources are the most " +
      "reliable form of evidence because they originate outside the entity and are sent directly " +
      "to the auditor, reducing the risk of interception or manipulation by management.",
    examples: [
      "Bank confirmation letters obtained directly from the entity's banks confirming balances, facilities, charges, and guarantees.",
      "Debtor circularisation letters sent to a sample of trade receivables with responses returned directly to the auditor.",
      "Solicitor confirmation letters regarding pending litigation, claims, and assessments (ISA (UK) 501).",
      "Direct confirmation of investment holdings from custodians or fund managers.",
      "Confirmation of insurance policies in force from brokers or underwriters.",
      "Confirmation of intercompany balances from other group entities where the component auditor receives the response directly.",
    ],
    limitations: [
      "Non-response from the confirming party reduces the evidence obtained; alternative procedures must then be performed.",
      "Responses may be intercepted or altered by management if controls over the confirmation process are weak.",
      "The reliability of electronic confirmations depends on the security of the transmission method.",
      "Confirmations address the balance at a point in time only, not the activity during the period.",
      "Negative confirmations provide less persuasive evidence than positive confirmations (ISA (UK) 505, para A18).",
      "Confirmations from related parties may not be truly independent and should be treated with caution.",
    ],
  },
  {
    rank: 2,
    type: "External Documentary Evidence",
    reliability: "Very High",
    isaRef: "ISA (UK) 500, paras A5-A8",
    description:
      "Documentary evidence originating from and held by third parties that the auditor obtains " +
      "indirectly, typically through the entity. This includes supplier invoices, bank statements, " +
      "title deeds, contracts with third parties, and regulatory correspondence. Although still " +
      "external in origin, the reliability is slightly lower than direct confirmations because the " +
      "entity has had custody of the documents, introducing the theoretical possibility of " +
      "alteration or selective presentation.",
    examples: [
      "Supplier invoices and statements obtained from the entity's accounts-payable files.",
      "Bank statements received at the entity's registered office.",
      "Title deeds for freehold property held by the entity or its solicitors.",
      "Signed contracts with customers or suppliers, including terms and conditions.",
      "Valuation reports from independent RICS-qualified surveyors for UK property.",
      "Regulatory correspondence from bodies such as the FCA, HMRC, or Companies House.",
      "Insurance policy schedules and certificates of cover.",
    ],
    limitations: [
      "Documents in the entity's possession could potentially have been altered or fabricated.",
      "The auditor must assess the authenticity and reliability of each document in the circumstances.",
      "Electronic documents require consideration of IT general controls over document-management systems.",
      "Translations of documents in foreign languages may introduce errors or ambiguities.",
      "The relevance of an older document must be assessed — a superseded contract may no longer reflect current terms.",
    ],
  },
  {
    rank: 3,
    type: "Internal Documentary Evidence (Strong Controls)",
    reliability: "High",
    isaRef: "ISA (UK) 500, paras A8-A10; ISA (UK) 330, paras 7-16",
    description:
      "Documentary evidence generated within the entity that has been subject to robust internal " +
      "controls. When the auditor has obtained evidence that internal controls over the " +
      "preparation and maintenance of such documentation are effectively designed and operating " +
      "effectively (through tests of controls under ISA (UK) 330), the reliability of this " +
      "evidence is enhanced. The quality of the control environment is therefore a critical " +
      "factor in determining the weight placed on internally generated documents.",
    examples: [
      "Sales invoices generated by the entity's invoicing system where access controls and sequential numbering are enforced.",
      "Payroll reports produced by a system with appropriate segregation of duties, supervisory review, and reconciliation to HMRC RTI submissions.",
      "Goods-received notes generated at the point of physical receipt with appropriate authorisation.",
      "Board minutes and resolutions that are formally approved, signed, and sequentially maintained.",
      "Budgets and forecasts that have been through a formal approval process by the board or a delegated committee.",
      "Internal audit reports reviewed and acted upon by the audit committee.",
    ],
    limitations: [
      "Reliability depends entirely on the effectiveness of the entity's internal controls; if controls are weak, this evidence ranks lower.",
      "Management override of controls can undermine the reliability of any internally generated document.",
      "IT general controls (access management, change management, IT operations) must also be effective for automated documents.",
      "Automated controls require testing of the underlying IT environment before reliance can be placed on the output.",
      "The auditor must independently assess control design and operating effectiveness before placing reliance (ISA (UK) 330).",
    ],
  },
  {
    rank: 4,
    type: "Internal Documentary Evidence (Weak Controls)",
    reliability: "Moderate",
    isaRef: "ISA (UK) 500, paras A8-A10",
    description:
      "Documentary evidence generated within the entity where internal controls over its " +
      "preparation, review, and maintenance are weak, absent, or have not been tested by the " +
      "auditor. Because the entity both generated and controls the document, and controls are " +
      "not reliably preventing or detecting errors, the auditor places reduced reliance on this " +
      "evidence. Additional corroborating evidence from other sources is usually needed.",
    examples: [
      "Spreadsheet-based calculations prepared by staff with no independent review or version control.",
      "Manual journal entries with no formal approval or documentation process.",
      "Internally prepared schedules of accruals or provisions not subject to management review.",
      "Unaudited management accounts used as a basis for analytical procedures.",
      "Staff timesheets or expense claims without supervisory approval.",
      "Self-certified inventory counts performed without independent observation or reconciliation.",
    ],
    limitations: [
      "High susceptibility to error, omission, or deliberate manipulation.",
      "Cannot be relied upon in isolation — must be corroborated with other forms of evidence.",
      "Increases the need for more extensive substantive testing to compensate for control weaknesses.",
      "The auditor should consider whether the absence of controls is itself a significant deficiency to be communicated under ISA (UK) 265.",
      "Where controls are deficient, the auditor may need to obtain evidence from entirely alternative sources.",
    ],
  },
  {
    rank: 5,
    type: "Oral Evidence (Inquiry)",
    reliability: "Low",
    isaRef: "ISA (UK) 500, paras A2, A22-A27; ISA (UK) 580",
    description:
      "Evidence obtained through inquiry of knowledgeable persons within or outside the entity. " +
      "Inquiry alone is generally insufficient to provide adequate audit evidence, particularly " +
      "for assertions where the risk of material misstatement is higher. However, inquiry is an " +
      "essential audit procedure that is used in combination with other procedures. Responses to " +
      "inquiries may provide the auditor with information not previously possessed or with " +
      "corroborative evidence.",
    examples: [
      "Inquiries of management regarding the basis for accounting estimates and key assumptions.",
      "Discussions with in-house legal counsel about the status of ongoing litigation and potential claims.",
      "Inquiries of warehouse staff regarding inventory-counting procedures, storage conditions, and slow-moving stock.",
      "Discussions with those charged with governance (e.g., audit committee members) about risk areas and control environment.",
      "Inquiries of IT personnel regarding system access controls, change management, and disaster-recovery procedures.",
      "Discussions with the entity's bank relationship manager about facility terms and covenant compliance.",
    ],
    limitations: [
      "Oral evidence is the least reliable form — it is subjective, may be self-serving, and is difficult to corroborate.",
      "Management representations (ISA (UK) 580) formalise oral evidence in writing but do not replace the need for other procedures.",
      "The auditor must evaluate the competence, knowledge, and potential bias of the person providing the information.",
      "Oral evidence should always be corroborated with other forms of audit evidence.",
      "There is a significant risk of bias when inquiring of persons whose interests may conflict with accurate reporting.",
      "Written representations from management are necessary but not sufficient evidence (ISA (UK) 580, para 4).",
    ],
  },
  {
    rank: 6,
    type: "Analytical Evidence",
    reliability: "Variable (Low to Moderate)",
    isaRef: "ISA (UK) 520, paras 4-7, A1-A22",
    description:
      "Evidence obtained through the evaluation of financial information by analysis of plausible " +
      "relationships among both financial and non-financial data. Analytical procedures include " +
      "comparisons with prior periods, budgets, forecasts, industry data, and predictable " +
      "patterns. The reliability depends on the precision of the expectation developed, the " +
      "reliability of the underlying data, and the tolerance (threshold) set by the auditor. " +
      "When used as substantive analytical procedures, the expectation must be sufficiently " +
      "precise to identify misstatements at the relevant materiality level.",
    examples: [
      "Comparing the gross profit margin to prior periods and industry benchmarks to identify unusual fluctuations.",
      "Performing a proof-in-total of payroll costs based on headcount, average salary, and known pay rises.",
      "Analysing the trade receivables collection period month-by-month and comparing to prior-year trends.",
      "Using regression analysis to model the expected relationship between revenue and cost of sales.",
      "Comparing depreciation charges to opening fixed-asset balances and known additions and disposals.",
      "Performing a revenue analytical by multiplying units sold by average selling price and comparing to recorded revenue.",
    ],
    limitations: [
      "Analytical procedures provide indirect evidence and may not detect misstatements at the individual transaction level.",
      "The reliability of the data used to form the expectation must be independently assessed (ISA (UK) 520, para A13).",
      "Overall-level analytical procedures are less precise than assertion-level procedures.",
      "Small misstatements may not be detected if the tolerance threshold is set too high.",
      "Unexpected relationships do not necessarily indicate misstatement — investigation is needed to determine the cause.",
      "Reliance on analytical procedures as substantive procedures requires a sufficiently precise and reliable expectation (ISA (UK) 520, para 5).",
      "The auditor must consider whether analytical procedures alone provide sufficient evidence or whether detailed testing is also required.",
    ],
  },
];


// ---------------------------------------------------------------------------
// 3. SAMPLING_GUIDANCE  (ISA (UK) 530, paras 1-15, A1-A25)
// ---------------------------------------------------------------------------

export const SAMPLING_GUIDANCE = {
  statisticalMethods: [
    {
      name: "Monetary Unit Sampling (MUS)",
      description:
        "A probability-proportional-to-size (PPS) sampling method in which each individual " +
        "pound sterling in the population has an equal chance of selection. This method is " +
        "particularly effective for testing for overstatement of account balances, as larger " +
        "items have a proportionally greater chance of being selected. MUS is the most widely " +
        "used statistical method in UK audit practice for substantive testing of details.",
      formula:
        "Sample size n = (Reliability Factor at desired confidence level) / (Tolerable Misstatement " +
        "- Expected Misstatement) * Population Value. For example, at 95% confidence with 0 expected " +
        "misstatements, the Reliability Factor = 3.0. If tolerable misstatement = GBP 50,000 and " +
        "expected misstatement = GBP 5,000, then Sampling Interval = (GBP 50,000 - GBP 5,000) / 3.0 " +
        "= GBP 15,000. Sample size = Population value / Sampling interval.",
      whenToUse:
        "Use MUS when: (a) the population consists of items of varying monetary size; (b) the primary " +
        "risk is overstatement of the recorded balance; (c) few or no misstatements are expected in the " +
        "population; (d) the population is large; and (e) a statistical conclusion (quantification of " +
        "sampling risk) is required. Commonly applied to trade receivables, trade payables, revenue " +
        "transactions, inventory listings, and fixed-asset additions.",
    },
    {
      name: "Classical Variables Sampling",
      description:
        "A statistical method that uses normal distribution theory to estimate the total value of " +
        "a population based on a sample. It includes three main subtypes: mean-per-unit estimation, " +
        "ratio estimation, and difference estimation. This method is appropriate when both " +
        "overstatement and understatement risks are significant, or when the auditor expects a " +
        "higher rate of misstatements in the population than MUS can efficiently handle.",
      formula:
        "Sample size n = (Z_alpha * N * S_x / A)^2, where Z_alpha = Z-value for the desired " +
        "confidence level (e.g., 1.96 for 95%), N = population size, S_x = estimated standard " +
        "deviation of the population, and A = acceptable precision (tolerable misstatement less " +
        "expected misstatement). For ratio estimation, the formula incorporates the ratio of audited " +
        "values to book values. Finite population correction may be applied for smaller populations.",
      whenToUse:
        "Use classical variables sampling when: (a) both overstatement and understatement are of " +
        "concern; (b) the population items do not vary greatly in monetary size; (c) a larger number " +
        "of misstatements is expected in the population; or (d) MUS would result in an excessively " +
        "large sample due to the expected error rate. Common applications include payroll testing, " +
        "inventory valuation where many pricing errors are expected, and certain liability populations.",
    },
    {
      name: "Attribute Sampling",
      description:
        "A statistical sampling method used in tests of controls to estimate the rate of deviation " +
        "from a prescribed control procedure in a population. Each item is classified as either a " +
        "deviation or not a deviation. The method allows the auditor to determine, with a specified " +
        "confidence level, whether the actual rate of deviation in the population exceeds the " +
        "tolerable rate of deviation.",
      formula:
        "Sample size is determined from standard attribute-sampling tables based on: (a) the expected " +
        "population deviation rate; (b) the tolerable rate of deviation; and (c) the desired " +
        "confidence level (typically 90% or 95%). For example, if the tolerable deviation rate is 5%, " +
        "the expected deviation rate is 1%, and the desired confidence level is 95%, the required " +
        "sample size is approximately 93. For populations under 250, finite population correction " +
        "may reduce the required sample size.",
      whenToUse:
        "Use attribute sampling for tests of controls (ISA (UK) 330, paras 7-16). It assesses " +
        "whether a control is operating effectively at a rate that supports the planned level of " +
        "reliance. Common applications include: testing authorisation signatures on purchase orders, " +
        "testing whether bank reconciliations are reviewed and signed, testing whether new-supplier " +
        "set-ups follow the approved procedure, and testing approval of journal entries.",
    },
    {
      name: "Stratified Sampling",
      description:
        "A technique that divides the population into sub-populations (strata), each containing " +
        "sampling units with similar characteristics (often monetary value). Stratification can be " +
        "combined with any statistical or non-statistical approach. By stratifying, the auditor " +
        "ensures that high-value items receive appropriate coverage while also obtaining evidence " +
        "from across the full population.",
      formula:
        "The overall sample size is allocated across strata using the Neyman allocation formula: " +
        "n_h = n * (N_h * S_h) / SUM(N_i * S_i), where n_h = sample from stratum h, N_h = " +
        "number of items in stratum h, S_h = standard deviation of stratum h, and n = total " +
        "sample size. Alternatively, the top stratum may be tested 100% (all items above a " +
        "calculated threshold) with sampling applied to items below the threshold.",
      whenToUse:
        "Use stratification when: (a) the population has significant variability in monetary " +
        "amounts; (b) the auditor needs to ensure adequate coverage of high-value items; (c) a more " +
        "efficient (smaller overall) sample is desired. Stratification typically reduces overall " +
        "sample size compared to unstratified sampling. Commonly used in testing trade receivables, " +
        "trade payables, revenue, and inventory. The auditor typically examines all items above a " +
        "key-item threshold and samples from the remainder.",
    },
  ],

  nonStatistical:
    "Non-statistical (judgemental) sampling is permitted under ISA (UK) 530 provided the auditor " +
    "designs a sample that is expected to be representative of the population (para 8). The auditor " +
    "uses professional judgement to determine the sample size and select items. Common selection " +
    "methods include haphazard selection (avoiding deliberate bias or predictability) and block " +
    "selection (where justified by the nature of the population). However, non-statistical sampling " +
    "does not allow the auditor to quantify sampling risk mathematically, which is a significant " +
    "limitation. In UK practice, non-statistical sampling remains common, particularly in smaller " +
    "audits and where the firm's methodology does not mandate statistical methods. The FRC Audit " +
    "Quality Inspection findings consistently note that auditors should ensure non-statistical " +
    "samples are large enough to provide sufficient appropriate evidence. Key principles: (a) the " +
    "sample must be designed so that each sampling unit has a chance of selection; (b) the sample " +
    "size must be sufficient to reduce sampling risk to an acceptably low level; (c) the results " +
    "must be evaluated to determine whether the assessment of the relevant population characteristic " +
    "needs to be revised; and (d) the auditor should project misstatements found in the sample to " +
    "the population. Non-statistical sampling is subject to the same ISA (UK) 530 requirements as " +
    "statistical sampling regarding projection and evaluation of results.",

  sampleSizeFactors: [
    "The assessed risk of material misstatement — higher risk requires a larger sample size (ISA (UK) 530, para A10).",
    "Tolerable misstatement (the application of performance materiality at the individual account level) — a lower tolerable misstatement requires a larger sample.",
    "Expected misstatement — if the auditor expects misstatements in the population, a larger sample is needed to conclude that actual misstatement does not exceed tolerable misstatement.",
    "The desired level of assurance (confidence) from the sample — higher assurance (e.g., 95% vs 90%) requires a larger sample.",
    "The number of sampling units in the population — for very large populations, population size has minimal effect; for small populations a finite correction factor may apply.",
    "Stratification of the population — effective stratification can reduce the required overall sample size by reducing within-stratum variability.",
    "The results of other audit procedures related to the same assertion — corroborative evidence from analytical procedures or tests of controls may allow a smaller substantive sample.",
    "The auditor's assessment of the reliability of internal controls — if controls are effective and tested, a smaller substantive sample may be justified (ISA (UK) 330).",
    "The variability (standard deviation) of the population values — greater variability generally requires a larger sample to achieve the same precision.",
    "Whether the auditor is using a statistical or non-statistical approach — statistical methods allow formal quantification of sampling risk and may influence the minimum sample size calculation.",
  ],

  minimumSamples: [
    {
      populationRange: "1-10 items",
      sampleSize:
        "Test all items (100% examination). For very small populations, sampling is not appropriate; " +
        "the auditor should examine all items as the cost and effort to do so is minimal and this " +
        "eliminates sampling risk entirely.",
    },
    {
      populationRange: "11-52 items",
      sampleSize:
        "Minimum of 5-10 items for substantive tests of details. For tests of controls, a minimum of " +
        "20-25 items is typically required if the control operates more frequently than monthly. " +
        "Professional judgement is required based on the risk assessment and the nature of the control or balance.",
    },
    {
      populationRange: "53-250 items",
      sampleSize:
        "Substantive testing: typically 10-25 items using non-statistical sampling, or as determined " +
        "by formula under statistical sampling. Tests of controls: minimum 25 for controls operating " +
        "at least monthly. If the control operates daily or more frequently, consider 40-60 items. " +
        "FRC guidance suggests a minimum of 25 items for controls testing regardless of population size.",
    },
    {
      populationRange: "251-1,000 items",
      sampleSize:
        "Substantive testing: typically 20-40 items under non-statistical sampling. Under MUS, the " +
        "sample size is calculated mathematically based on the sampling-interval formula. Tests of " +
        "controls: minimum 25-40 items depending on the frequency of the control and the desired " +
        "confidence level.",
    },
    {
      populationRange: "1,001-5,000 items",
      sampleSize:
        "Substantive testing: typically 25-60 items. The sample size is driven primarily by tolerable " +
        "misstatement and expected misstatement rather than by population size. Under MUS, the sampling " +
        "interval determines the mathematical sample. Tests of controls: 25-60 items depending on the " +
        "assessed risk and desired confidence level.",
    },
    {
      populationRange: "5,001+ items",
      sampleSize:
        "Substantive testing: the sample size is effectively independent of population size for " +
        "statistical methods. MUS sample sizes typically range from 30-90+ depending on tolerable " +
        "and expected misstatement. Tests of controls: 25-60+ items. FRC inspection findings emphasise " +
        "that larger populations do not necessarily require proportionally larger samples, but the " +
        "sample must be sufficient to draw valid conclusions about the population characteristic " +
        "being tested.",
    },
  ],

  projectionOfMisstatements:
    "ISA (UK) 530, paras 14-15, A20-A23. The auditor is required to project misstatements found in " +
    "the sample to the population. For substantive tests of details: (a) Under MUS, the projected " +
    "misstatement is calculated by multiplying the tainting percentage of each error by the sampling " +
    "interval, then summing all projected errors. The tainting percentage equals the actual misstatement " +
    "divided by the recorded amount of the sampling unit. (b) Under classical variables sampling, the " +
    "projected misstatement is calculated as the average misstatement in the sample multiplied by the " +
    "population size. (c) Under non-statistical sampling, the auditor should project the misstatements " +
    "found in the sample to the population by multiplying the total misstatement found by the inverse " +
    "of the sampling fraction. For example, if the auditor sampled 30 items from a population of 300 " +
    "and found misstatements totalling GBP 500, the projected misstatement is GBP 500 * (300/30) = " +
    "GBP 5,000. Items tested 100% (e.g., key items above a threshold) should not be included in the " +
    "projection — the actual misstatements in these items are factual misstatements. The total " +
    "misstatement (factual + projected + further possible misstatement for sampling risk) is then " +
    "compared to tolerable misstatement to evaluate the sample result.",

  evaluatingResults:
    "ISA (UK) 530, paras 12-15. The auditor must evaluate: (a) The results of the sample, including " +
    "the nature and cause of each misstatement identified — are the misstatements systemic (indicating " +
    "a process failure), isolated (one-off errors), or indicative of fraud? (b) Whether the projected " +
    "misstatement, together with the results of other audit procedures, provides a reasonable basis " +
    "for conclusions about the population. (c) Whether the aggregate of misstatements (projected + " +
    "factual + judgemental) approaches or exceeds tolerable misstatement — if so, the auditor must " +
    "consider performing additional procedures, requesting management to investigate and make " +
    "adjustments, or assessing the effect on the auditor's opinion. (d) If sampling has not provided " +
    "a reasonable basis for conclusions, the auditor may request management to investigate the " +
    "misstatements, adjust the financial statements accordingly, or the auditor may perform additional " +
    "audit procedures. The FRC emphasises that auditors should document the evaluation of each " +
    "misstatement, including the treatment of anomalous items, and should not dismiss projected " +
    "misstatements without proper justification. Misstatements should be accumulated on the summary " +
    "of audit differences schedule and communicated to those charged with governance (ISA (UK) 450).",
};


// ---------------------------------------------------------------------------
// 4. ESTIMATES_FRAMEWORK  (ISA (UK) 540 Revised, effective for periods
//    commencing on or after 15 December 2019)
// ---------------------------------------------------------------------------

export const ESTIMATES_FRAMEWORK = {
  overview:
    "ISA (UK) 540 (Revised) addresses the auditor's responsibilities relating to accounting " +
    "estimates and related disclosures in an audit of financial statements. The revised standard " +
    "adopts a more granular, risk-based approach, requiring the auditor to consider the degree to " +
    "which an accounting estimate is subject to estimation uncertainty, complexity, and subjectivity, " +
    "which together contribute to the spectrum of inherent risk. The standard introduces a 'stand-back' " +
    "evaluation at the end of the audit process and includes enhanced requirements regarding the " +
    "identification and assessment of management bias. In the UK context, the FRC has emphasised the " +
    "importance of auditor scepticism when challenging management estimates, particularly in areas " +
    "such as expected credit losses (IFRS 9 / FRS 102 Section 11), goodwill impairment (IAS 36 / " +
    "FRS 102 Section 27), fair-value measurements (IFRS 13 / FRS 102 Section 14), and defined-benefit " +
    "pension obligations (IAS 19 / FRS 102 Section 28).",

  spectrumOfInherentRisk: [
    {
      level: "Lower Inherent Risk",
      description:
        "Estimates with low estimation uncertainty, low complexity, and low subjectivity. These " +
        "typically involve well-established methods, observable market data, and limited management " +
        "judgement. Examples include: depreciation of standard tangible assets with well-defined " +
        "useful lives and residual values; straightforward accruals based on known amounts and " +
        "contractual terms; and trade-receivable provisions based on a formulaic approach with " +
        "minimal judgemental overlay. The auditor may respond to lower inherent risk with simpler " +
        "procedures such as analytical review, comparison to prior-period actuals, or re-performance " +
        "of management's calculation. ISA (UK) 540 (Revised), para 13.",
    },
    {
      level: "Moderate Inherent Risk",
      description:
        "Estimates with moderate estimation uncertainty, some complexity, or some subjectivity. " +
        "These may involve established valuation techniques but require a degree of judgement in " +
        "selecting key assumptions or inputs. Examples include: inventory net-realisable-value " +
        "provisions where selling prices are reasonably observable but selling costs require estimation; " +
        "deferred-tax recoverability assessments based on management forecasts of future taxable " +
        "profits; and holiday-pay accruals for organisations with complex shift patterns or variable " +
        "working arrangements. The auditor typically performs a combination of testing management's " +
        "process, evaluating key assumptions against external benchmarks, and performing substantive " +
        "analytical procedures. ISA (UK) 540 (Revised), paras 13-17.",
    },
    {
      level: "Higher Inherent Risk",
      description:
        "Estimates with high estimation uncertainty, high complexity, or high subjectivity. These " +
        "frequently involve forward-looking assumptions, complex valuation models, significant " +
        "management judgement, or unobservable inputs (Level 3 in the IFRS 13 fair-value hierarchy). " +
        "Examples include: goodwill impairment under IAS 36 involving value-in-use calculations with " +
        "long-term cash-flow projections and terminal-value assumptions; expected credit loss " +
        "provisions for complex loan portfolios under IFRS 9; fair value of illiquid financial " +
        "instruments; defined-benefit pension obligations with assumptions for discount rate, " +
        "inflation, and mortality; and insurance claims provisions requiring actuarial techniques. " +
        "The FRC has identified these areas as requiring heightened professional scepticism. The " +
        "auditor must assess each significant assumption individually and evaluate whether " +
        "management's point estimate falls within a reasonable range. ISA (UK) 540 (Revised), " +
        "paras 13-20.",
    },
    {
      level: "Significant Risk (requiring special audit consideration)",
      description:
        "Estimates assessed as giving rise to a significant risk of material misstatement. Per " +
        "ISA (UK) 315, paras 28-29, a significant risk requires special audit consideration, " +
        "including evaluation of the design and implementation of relevant controls. Accounting " +
        "estimates involving significant management judgement — particularly those with forward-looking " +
        "assumptions, complex models, or where the range of reasonable outcomes is very wide — are " +
        "more likely to be assessed as significant risks. Examples include: going-concern assessments " +
        "involving material uncertainties; revenue recognition for complex long-term contracts under " +
        "IFRS 15 / FRS 102 Section 23; expected credit losses for portfolios with limited historical " +
        "default data; fair value of complex structured products; and provisions for major litigation " +
        "where the outcome is highly uncertain. The auditor must design procedures specifically " +
        "responsive to the significant risk. ISA (UK) 540 (Revised), paras 18-20.",
    },
  ],

  riskAssessmentProcedures: [
    "Obtain an understanding of the entity and its environment, including the regulatory framework, that gives rise to the need for accounting estimates (ISA (UK) 540 (Revised), para 10).",
    "Identify the methods, significant assumptions, and data sources used by management in making each accounting estimate, and understand the basis for their selection (para 10(a)).",
    "Evaluate the degree of estimation uncertainty, complexity, and subjectivity associated with each significant estimate to inform the assessment of inherent risk along the spectrum (paras 10-13).",
    "Understand how management identifies, evaluates, and addresses the risk of management bias in its estimates, including oversight by those charged with governance (para 10(c)).",
    "Evaluate the design and implementation of controls over the estimation process, including IT controls where models or automated calculations are used (para 10(b)).",
    "Assess whether management has the competence and expertise to make the estimates, or whether it has appropriately engaged management's experts (para 10(d)).",
    "Review the outcomes or re-estimates of prior-period accounting estimates (retrospective review) to inform the risk assessment for the current period (para 12).",
    "Consider whether the applicable financial reporting framework (FRS 102, UK-adopted IFRS) imposes specific requirements on the measurement, recognition, or disclosure of the estimate.",
    "Determine whether the estimate gives rise to a significant risk and, if so, identify the specific further audit procedures required in response (para 16).",
    "Consider the impact of emerging issues identified in FRC thematic reviews, FRC Audit Quality Review findings, or IESBA guidance on estimation and professional scepticism.",
  ],

  furtherProcedures: {
    method1:
      "Testing management's process for making the estimate (ISA (UK) 540 (Revised), para 18). " +
      "This involves: (a) testing the completeness, accuracy, and relevance of the data used by " +
      "management as inputs to the estimate; (b) evaluating whether the method (model) selected by " +
      "management is appropriate in the context of the applicable financial reporting framework and " +
      "has been consistently applied; (c) testing the significant assumptions for reasonableness, " +
      "including consideration of whether management has considered and evaluated alternative " +
      "assumptions; (d) re-performing the mathematical accuracy of the model or calculation; " +
      "(e) evaluating whether management has appropriately considered and addressed estimation " +
      "uncertainty in its point estimate and related disclosures; and (f) considering whether " +
      "events occurring up to the date of the auditor's report provide evidence regarding the " +
      "estimate. This is the most commonly used approach in UK audit practice.",

    method2:
      "Developing an auditor's point estimate or range (ISA (UK) 540 (Revised), para 19). The " +
      "auditor develops an independent expectation of the estimate using alternative assumptions, " +
      "methods, or data sources. For example, the auditor might use a different discount rate in a " +
      "DCF model, apply alternative growth assumptions, or use independent market data to derive an " +
      "independent estimate of fair value. Where the auditor develops a range, the range must be " +
      "narrow enough to be useful for assessing the reasonableness of management's point estimate. " +
      "The range must comprise only amounts that are supported by the applicable financial reporting " +
      "framework. This approach is particularly useful when management's model is complex and the " +
      "auditor has access to independent data sources or can engage an auditor's expert (ISA (UK) 620).",

    method3:
      "Testing events occurring up to the date of the auditor's report (ISA (UK) 540 (Revised), " +
      "para 20). Subsequent events may provide direct audit evidence about the accounting estimate. " +
      "For example: the settlement of a legal claim after the balance-sheet date may confirm the " +
      "amount of the provision recorded at the year-end; the sale of inventory after the period end " +
      "may provide evidence of net realisable value; the receipt of a debtor balance after the year-end " +
      "may confirm its recoverability. However, the auditor must carefully consider whether the " +
      "subsequent event reflects conditions that existed at the balance-sheet date (an adjusting event " +
      "under FRS 102 Section 32 / IAS 10) or conditions that arose after that date (a non-adjusting " +
      "event). Only adjusting events provide direct evidence about the year-end estimate.",
  },

  retrospectiveReview:
    "ISA (UK) 540 (Revised), para 12. The auditor shall review the outcome of accounting estimates " +
    "included in the prior-period financial statements, or, where applicable, their subsequent " +
    "re-estimation for the purpose of the current period. The objectives are to: (a) obtain audit " +
    "evidence about the effectiveness of management's prior estimation process — does management have " +
    "a track record of producing reliable estimates?; (b) identify potential management bias — do " +
    "estimates consistently err in one direction (e.g., provisions are always understated, or revenue " +
    "estimates are always optimistic)?; (c) obtain audit evidence that may be directly relevant to " +
    "the current-period estimates (e.g., the actual credit-loss rate in the current year informs " +
    "the assessment of the prior-year ECL provision); and (d) identify matters requiring communication " +
    "to those charged with governance. The nature and extent of the retrospective review should be " +
    "proportionate to the assessed risk. For significant estimates with high estimation uncertainty, " +
    "the review should be more rigorous and should cover multiple prior periods where possible. The " +
    "auditor should consider the cumulative effect of any identified bias over multiple periods, as " +
    "this may indicate a systematic tendency that increases the risk of material misstatement.",

  managementBias: [
    "ISA (UK) 540 (Revised), paras 32-33, A136-A142. The auditor shall evaluate whether indicators of possible management bias exist in accounting estimates. Indicators include:",
    "Changes in an accounting estimate or the method for making an estimate where management's subjective assessment of changed circumstances lacks adequate justification or supporting evidence.",
    "Use of assumptions that are consistently optimistic (or consistently pessimistic) rather than reflecting a balanced, neutral view of the range of possible outcomes.",
    "Selection of a point estimate from a range of outcomes that consistently favours a particular reporting objective — e.g., meeting analysts' forecasts, maximising management bonuses, or satisfying debt covenants.",
    "Selection of assumptions that systematically understate liabilities or overstate assets without adequate and documented justification.",
    "Making late adjustments to estimates near the period end that have a significant and favourable effect on reported financial results.",
    "Failure to update estimates in light of changed circumstances when an update would reasonably be expected — for example, not revising a provision when new information becomes available.",
    "Cherry-picking data points or scenarios that support the desired estimate while ignoring contradictory information or less favourable scenarios.",
    "The FRC has noted in multiple Annual Reviews of Audit Quality and Audit Quality Review reports that challenging management bias in accounting estimates remains an area requiring sustained improvement across UK audit firms.",
  ],

  disclosureRequirements: [
    "The auditor shall evaluate whether the disclosures related to accounting estimates in the financial statements are in accordance with the requirements of the applicable financial reporting framework (ISA (UK) 540 (Revised), para 24).",
    "For estimates involving significant estimation uncertainty, the auditor shall evaluate the adequacy of disclosure of the estimation uncertainty, including sensitivity analysis showing how the carrying amounts would be affected by changes in key assumptions (FRS 102, para 8.7; IAS 1, para 125).",
    "The auditor shall evaluate whether disclosures about the methods, assumptions, and data used in making each significant estimate are sufficient for users to understand the basis of the recognised amount.",
    "For estimates measured at fair value, the applicable framework (IFRS 13 or FRS 102 Section 14) typically requires disclosure of the valuation technique, the significant inputs used, and the level in the fair-value hierarchy (Level 1, 2, or 3).",
    "The auditor should consider whether the entity has disclosed the key sources of estimation uncertainty at the balance-sheet date that have a significant risk of causing a material adjustment to the carrying amounts of assets and liabilities within the next financial year.",
    "The auditor should evaluate the overall neutrality, consistency, and completeness of the disclosures relating to estimates, considering whether the disclosures taken together give a balanced picture or whether they are misleading through omission or emphasis.",
  ],
};


// ---------------------------------------------------------------------------
// 5. FRAUD_FRAMEWORK  (ISA (UK) 240, supplemented by UK ethical standards
//    and statutory reporting requirements)
// ---------------------------------------------------------------------------

export const FRAUD_FRAMEWORK = {
  fraudTriangle: {
    opportunity:
      "ISA (UK) 240, paras A25-A27. Opportunity refers to the conditions or circumstances that " +
      "allow fraud to be committed. Even individuals who are otherwise honest may commit fraud " +
      "when the opportunity presents itself and incentives or pressures are present. In the audit " +
      "context, key opportunities arise from: (a) weak or absent internal controls, including poor " +
      "segregation of duties, inadequate supervisory review, and lack of independent checks; " +
      "(b) the nature of the industry or the entity's operations — for example, significant cash " +
      "transactions, complex related-party arrangements, or transactions that are inherently " +
      "difficult to audit; (c) management's ability to override controls, which exists in all " +
      "entities regardless of the quality of the control environment; (d) the use of complex " +
      "corporate structures, special-purpose entities, or offshore arrangements that lack " +
      "transparent governance; and (e) the existence of significant unusual transactions, " +
      "particularly those close to the period end that lack clear business rationale. The UK " +
      "Corporate Governance Code (2018) and the Wates Corporate Governance Principles for Large " +
      "Private Companies emphasise the importance of tone at the top, the control environment, and " +
      "a culture of integrity in reducing fraud opportunities. The auditor should assess the " +
      "entity's control environment as part of the risk assessment (ISA (UK) 315 (Revised 2019)).",

    pressure:
      "ISA (UK) 240, paras A23-A24. Pressure (also referred to as incentive or motivation) is a " +
      "condition that provides a reason for an individual or group to commit fraud. Pressures may " +
      "be financial or non-financial and may arise from: (a) financial stability or profitability " +
      "being threatened by economic conditions, industry changes, declining demand, or technological " +
      "obsolescence; (b) excessive pressure on management or staff to meet expectations of third " +
      "parties — for example, meeting revenue or earnings targets, analysts' forecasts, or debt " +
      "covenants; (c) personal financial pressures on individuals, such as excessive personal debt, " +
      "gambling, substance abuse, or living beyond one's means; (d) bonus or incentive schemes tied " +
      "to financial results that create a direct personal financial incentive to manipulate reported " +
      "figures; (e) threats to the entity's continued existence, giving rise to desperate measures " +
      "to secure funding, hide losses, or present a healthier financial position; and (f) regulatory " +
      "pressures, such as the need to comply with FCA capital adequacy requirements, Charity " +
      "Commission reporting requirements, or HMRC tax-compliance obligations. In the UK, the auditor " +
      "should also consider pressures arising from the requirement to file accounts at Companies " +
      "House within statutory deadlines (s.442 CA 2006) and the reputational consequences of late filing.",

    rationalisation:
      "ISA (UK) 240, paras A28-A29. Rationalisation is the attitude, character, or set of ethical " +
      "values that allows a person to commit a dishonest act, or the ability to rationalise the " +
      "act to themselves. Those involved in fraud typically justify their behaviour through one or " +
      "more of the following rationalisations: (a) 'the entity owes me this' — a sense of " +
      "entitlement, often arising from perceived unfair treatment or inadequate compensation; " +
      "(b) 'everyone does it' — normalising the behaviour by assuming it is widespread; (c) 'it's " +
      "only temporary — I'll reverse it next period' — minimising the severity by treating the " +
      "fraud as a short-term measure; (d) 'the rules are unreasonable' — justifying departure from " +
      "accounting standards or laws; or (e) 'no one gets hurt' — failing to recognise or acknowledge " +
      "the victims of the fraud. The auditor cannot directly observe rationalisation but should be " +
      "alert to attitudes, behaviours, or cultural factors that may indicate a lack of integrity. " +
      "Risk factors include: a history of regulatory violations, a culture that does not emphasise " +
      "ethical behaviour, an aggressive approach to accounting policies, and an attitude by " +
      "management that the financial statements are unimportant or that audit is merely a compliance " +
      "exercise. The FRC Ethical Standard (2019) requires the auditor to maintain professional " +
      "scepticism throughout the engagement, recognising the possibility of fraud regardless of " +
      "the auditor's past experience with the entity or its management.",
  },

  presumedRisks: [
    {
      risk: "Revenue recognition",
      isaRef: "ISA (UK) 240, para 26",
      response:
        "The auditor shall presume that there are risks of fraud in revenue recognition and shall " +
        "determine which types of revenue, revenue transactions, or assertions give rise to such " +
        "risks. If the auditor concludes that the presumption is not applicable in the circumstances, " +
        "the reasons shall be documented in the audit file. Specific audit responses include: " +
        "(a) substantive analytical procedures on revenue using disaggregated data (by product line, " +
        "location, month, or customer segment); (b) testing the cut-off of revenue transactions " +
        "around the year-end, focusing on the last and first days of the accounting periods; " +
        "(c) confirming significant revenue transactions with customers; (d) testing journal entries " +
        "that post to revenue accounts for unusual, unexpected, or round-sum entries; (e) evaluating " +
        "whether the entity's revenue-recognition policies comply with the applicable framework " +
        "(IFRS 15 / FRS 102 Section 23) and are consistently applied; and (f) considering the risk " +
        "of fictitious revenue, side agreements, bill-and-hold arrangements, and channel stuffing. " +
        "The FRC has consistently highlighted revenue recognition as an area requiring robust audit " +
        "procedures in its Annual Review of Audit Quality.",
    },
    {
      risk: "Management override of controls",
      isaRef: "ISA (UK) 240, paras 31-33",
      response:
        "Management override of controls is a presumed risk that cannot be rebutted. Regardless of " +
        "the auditor's overall assessment of fraud risks, the following procedures are mandatory: " +
        "(a) testing the appropriateness of journal entries recorded in the general ledger and other " +
        "adjustments made in the preparation of the financial statements — this includes making " +
        "inquiries of individuals involved in the financial-reporting process, selecting entries " +
        "at the end of the reporting period, and considering the need to test entries throughout " +
        "the period; (b) reviewing accounting estimates for biases that could result in material " +
        "misstatement due to fraud — including a retrospective review of management's prior-period " +
        "judgements and assumptions; and (c) evaluating the business rationale (or lack thereof) for " +
        "significant unusual transactions — particularly those that appear to be outside the normal " +
        "course of business, involve previously unidentified related parties, or lack clear economic " +
        "substance.",
    },
    {
      risk: "Misappropriation of assets",
      isaRef: "ISA (UK) 240, paras A40-A44",
      response:
        "While not a presumed risk in the same mandatory sense as revenue recognition and management " +
        "override, the auditor must consider the risk of misappropriation of assets, especially for " +
        "entities with: (a) large volumes of cash transactions (e.g., retail, hospitality); (b) inventory " +
        "that is small, valuable, and easily converted to cash; (c) fixed assets that are portable and " +
        "desirable (e.g., IT equipment, vehicles, tools); (d) inadequate physical safeguards and access " +
        "controls; and (e) insufficient segregation of duties between custody and record-keeping. Audit " +
        "responses include: physical verification of high-value portable assets, detailed bank-reconciliation " +
        "testing, payroll testing for ghost employees, review of expense claims and corporate credit-card " +
        "statements, and testing of inventory shrinkage. In the UK charity sector, the Charity Commission " +
        "guidance highlights the particular vulnerability of charitable funds to misappropriation.",
    },
  ],

  responseToAssessedRisks: [
    "Design and perform further audit procedures whose nature, timing, and extent are specifically responsive to the assessed risks of material misstatement due to fraud at both the financial-statement level and the assertion level (ISA (UK) 240, paras 28-30).",
    "Incorporate an element of unpredictability in the selection of the nature, timing, and extent of audit procedures — for example, performing substantive procedures on areas or locations not otherwise selected based on materiality, altering the timing of tests from that expected by the entity, or using different sampling methods (ISA (UK) 240, para 29).",
    "Assign more experienced engagement team members, or those with specialist skills, to areas with higher assessed risks of fraud (ISA (UK) 240, para 30(a)).",
    "Increase the extent of procedures performed — for example, increase sample sizes, perform more detailed or disaggregated analytical procedures, or use CAATs to test entire populations rather than samples (ISA (UK) 240, para 30(b)).",
    "Evaluate whether the selection and application of accounting policies, particularly those relating to subjective measurements and complex transactions, may be indicative of fraudulent financial reporting through intentional misapplication of the framework (ISA (UK) 240, para 32).",
    "Consider whether identified misstatements may be indicative of fraud; if so, evaluate the implications for other aspects of the audit, particularly the reliability of management representations and the integrity of management (ISA (UK) 240, para 35).",
    "Obtain written representations from management and, where appropriate, those charged with governance that they have disclosed all known instances of fraud or suspected fraud, and all known allegations of fraud (ISA (UK) 240, paras 39-40).",
    "Where the entity is subject to FRC Audit Quality Review inspection, ensure that the audit file demonstrates a clear and documented linkage between the assessed fraud risks and the specific audit responses designed to address them.",
  ],

  journalEntryTesting: {
    criteria: [
      "Entries made by unexpected or unusual users — for example, senior management making journal entries that are normally processed by junior accounting staff.",
      "Entries made at unusual times — for example, during weekends, bank holidays, or late at night when the office is typically unoccupied.",
      "Entries with round-number amounts or amounts just below authorisation thresholds, lacking supporting documentation.",
      "Entries posting to unusual or infrequently used account combinations — for example, debiting revenue and crediting a balance-sheet account, or posting between unrelated expense categories.",
      "Entries made close to the period end or as post-closing adjustments that are not part of the normal closing process.",
      "Entries with blank, vague, or deliberately non-specific descriptions (e.g., 'adjustment', 'correction', 'miscellaneous').",
      "Entries that adjust previously reported figures or reverse prior-period entries without clear explanations.",
      "Manual journal entries that bypass the normal automated posting process or the standard approval workflow.",
      "Entries posting to accounts associated with significant estimates, complex transactions, or areas of high management judgement.",
      "Entries made to intercompany accounts or related-party accounts that lack supporting intercompany agreements.",
      "Entries involving unusual debit-credit combinations — for example, crediting an asset account and debiting an expense account in a way that does not reflect a normal business transaction.",
    ],
    approach:
      "ISA (UK) 240, para 32(a). The auditor shall design and perform audit procedures to test the " +
      "appropriateness of journal entries recorded in the general ledger and other adjustments made " +
      "in the preparation of the financial statements. The recommended approach is: (1) Inquire of " +
      "individuals involved in the financial-reporting process about inappropriate or unusual activity " +
      "relating to the processing of journal entries and other adjustments. (2) Select journal entries " +
      "and other adjustments made at the end of the reporting period for testing. (3) Consider the " +
      "need to test journal entries and other adjustments throughout the period, not only at year-end. " +
      "(4) Where the entity uses an automated journal-entry system, use CAATs (data analytics) to " +
      "extract and filter the entire population of journal entries against the risk criteria listed " +
      "above. (5) For selected entries, vouch to supporting documentation and evaluate whether the " +
      "entry has a valid business purpose and is accurately recorded. (6) Consider whether the " +
      "entries, individually or in combination, indicate management override of controls. The FRC " +
      "has noted in its inspection findings that journal-entry testing is often insufficient in " +
      "practice and has recommended that auditors: (a) obtain a complete population of journal entries " +
      "from the entity's general ledger; (b) use data analytics to identify entries matching the " +
      "fraud-risk criteria; (c) test a sufficiently large and appropriately targeted sample from the " +
      "identified population; and (d) clearly document the rationale for the selection criteria used " +
      "and the conclusions drawn.",
  },

  managementOverride: [
    "Testing the appropriateness of journal entries and other adjustments made in the preparation of the financial statements (ISA (UK) 240, para 32(a)) — see journalEntryTesting for detailed requirements and criteria.",
    "Reviewing accounting estimates for biases that could result in material misstatement due to fraud (ISA (UK) 240, para 32(b)). This requires the auditor to perform a retrospective review of management's judgements and assumptions related to significant accounting estimates reflected in the prior-period financial statements, evaluating whether estimates have consistently erred in one direction.",
    "Evaluating the business rationale for significant unusual transactions (ISA (UK) 240, para 32(c)). The auditor should consider whether the transactions: (a) are outside the normal course of business for the entity; (b) appear overly complex or structured in a way that obscures their economic substance; (c) involve previously unidentified related parties or parties in unusual jurisdictions; (d) have been processed outside the entity's normal controls; or (e) lack clear commercial rationale.",
    "Evaluating whether the overall presentation of the financial statements, including the disclosures and the tone of the narrative reporting, is consistent with the auditor's understanding of the entity and does not contain information designed to mislead users.",
    "Performing a stand-back assessment at the completion stage of the audit to evaluate whether, taken as a whole, the audit evidence obtained is consistent with the auditor's understanding, or whether there are unexplained anomalies, patterns, or matters that may indicate fraud.",
    "Considering whether information obtained from other audit procedures — such as tests of controls, substantive analytical procedures, communications from regulators or whistleblowers, and observations during site visits — provides any indication of fraud that requires further investigation.",
  ],

  communicationRequirements: [
    "If the auditor has identified fraud or obtained information that indicates fraud may exist, communicate the matter on a timely basis to the appropriate level of management — i.e., at least one level above those involved (ISA (UK) 240, para 40).",
    "If the identified or suspected fraud involves management, communicate the matter to those charged with governance (e.g., the audit committee) as soon as practicable (ISA (UK) 240, para 41). If the fraud involves those charged with governance, the auditor should seek legal advice.",
    "For audits of Public Interest Entities (PIEs), the auditor must communicate identified or suspected fraud to the FRC in certain circumstances, as required by the Statutory Auditors and Third Country Auditors Regulations 2016 (ISA (UK) 240, para 43-1).",
    "Under the Proceeds of Crime Act 2002 (POCA) and the Terrorism Act 2000, the auditor has a legal obligation to report knowledge or suspicion of money laundering to the National Crime Agency (NCA) via a Suspicious Activity Report (SAR). Failure to report is a criminal offence. Crucially, the auditor must not 'tip off' the entity about the submission of a SAR (s.333A POCA).",
    "Under the Companies Act 2006, s.498, the auditor has a duty to report to the members (shareholders) if proper accounting records have not been kept, if the financial statements are not in agreement with the records, or if required information and explanations have not been received — all of which may result from fraud.",
    "The auditor should consider the implications of identified fraud for the auditor's report, including whether a modified opinion (qualified or adverse), an emphasis-of-matter paragraph, a material-uncertainty paragraph, or a key audit matter is appropriate.",
    "For entities regulated by the FCA or PRA, the auditor may have statutory reporting obligations under the Financial Services and Markets Act 2000 (FSMA), s.342, to report to the regulator matters of material significance.",
    "The auditor must document: (a) the assessed risks of material misstatement due to fraud at both the financial-statement and assertion levels; (b) the overall and specific audit responses to those risks; (c) the results of procedures performed to address fraud risks; (d) all communications about fraud to management, those charged with governance, and regulatory or law-enforcement authorities; and (e) the reasons for any rebuttal of the presumed risk of fraud in revenue recognition.",
  ],
};


// ---------------------------------------------------------------------------
// 6. GOING_CONCERN_FRAMEWORK  (ISA (UK) 570 Revised, supplemented by
//    FRC guidance and the UK Corporate Governance Code)
// ---------------------------------------------------------------------------

export const GOING_CONCERN_FRAMEWORK = {
  assessmentPeriod:
    "ISA (UK) 570 (Revised), paras 13-15. The auditor's evaluation shall cover a period of at " +
    "least twelve months from the date of the financial statements. For UK entities, this is " +
    "consistent with the Companies Act 2006 requirement for directors to assess going concern. " +
    "The UK Corporate Governance Code (2018, Provision 30) requires boards of premium-listed " +
    "companies to state whether they consider it appropriate to adopt the going-concern basis and " +
    "to provide a viability statement covering a longer period, typically three to five years. For " +
    "non-listed entities applying FRS 102, directors must consider the going-concern basis when " +
    "preparing financial statements (FRS 102, para 3.8). The FRC has emphasised that auditors " +
    "should challenge management's assessment where the look-forward period is limited to the " +
    "minimum 12 months and should consider whether events or conditions beyond that period ought " +
    "also to be evaluated. For example, where a major loan matures 14 months after the balance-sheet " +
    "date and refinancing is uncertain, the auditor should extend the evaluation. ISA (UK) 570 " +
    "(Revised), para 13-1 (a UK-specific addition) requires the auditor to consider whether events " +
    "or conditions exist that may cast significant doubt on the entity's ability to continue as a " +
    "going concern, regardless of whether the applicable financial reporting framework includes an " +
    "explicit requirement for management to make a going-concern assessment.",

  financialIndicators: [
    {
      indicator: "Net current liability or net liability position",
      significance:
        "A net current liability position may indicate that the entity lacks sufficient liquid " +
        "resources to meet its short-term obligations. A net liability position (total liabilities " +
        "exceeding total assets) raises fundamental questions about long-term solvency. However, " +
        "neither indicator is conclusive on its own — the entity may have access to undrawn " +
        "borrowing facilities, may be able to generate sufficient cash from operations, or may " +
        "receive financial support from a parent company. The auditor must look beyond the " +
        "balance-sheet ratios to the entity's cash-flow forecasts and financing arrangements. " +
        "ISA (UK) 570 (Revised), para A3.",
    },
    {
      indicator: "Inability to pay creditors on normal credit terms or breach of debt covenants",
      significance:
        "Breach of a debt covenant may trigger a cross-default provision, allowing the lender to " +
        "demand immediate repayment of the entire facility. Even without cross-default, a pattern " +
        "of late payments to creditors suggests serious cash-flow difficulties. The auditor should " +
        "review aged-creditor analyses, bank correspondence regarding covenant compliance, and any " +
        "waiver letters obtained from lenders. A waiver letter obtained after the period end but " +
        "before the auditor's report date provides evidence but the auditor must assess whether it " +
        "is a short-term fix or a sustainable solution.",
    },
    {
      indicator: "Significant recurring operating losses or negative operating cash flows",
      significance:
        "Persistent operating losses, particularly when accompanied by negative operating cash flows, " +
        "indicate that the entity is consuming cash faster than it generates it and may be unable to " +
        "sustain operations without external funding. The auditor should analyse the trend over " +
        "recent periods (typically 3 years) and compare management's forward-looking forecasts to " +
        "historical accuracy to assess the reliability of projections.",
    },
    {
      indicator: "Withdrawal of financial support by lenders, creditors, or key counterparties",
      significance:
        "The withdrawal of an overdraft facility, the refusal to renew a revolving credit facility, " +
        "or the loss of a customer accounting for a significant proportion of revenue can immediately " +
        "threaten the entity's viability. The auditor should assess the concentration risk in the " +
        "entity's revenue base and funding sources and consider the availability of alternative " +
        "financing or customers.",
    },
    {
      indicator: "Substantial fixed-term borrowings approaching maturity without realistic refinancing prospects",
      significance:
        "Where material debt is maturing within or shortly after the 12-month assessment period and " +
        "refinancing has not been secured, there is a clear and present risk that the entity will be " +
        "unable to meet its repayment obligations. The auditor should examine correspondence with " +
        "lenders, indicative term sheets, and management's plans for refinancing. Evidence of " +
        "refinancing completed after the year-end but before the auditor's report date may mitigate " +
        "the concern, subject to the terms being sustainable.",
    },
    {
      indicator: "Adverse key financial ratios (e.g., low interest cover, high gearing, declining margins)",
      significance:
        "Financial ratios provide early-warning signals of deteriorating financial health. The " +
        "auditor should consider interest-cover ratios (EBITDA or operating profit / interest " +
        "expense), gearing ratios (net debt / equity or net debt / EBITDA), current and quick " +
        "ratios, and trend analysis of gross and operating margins. These should be compared to " +
        "covenant thresholds in loan agreements and to industry benchmarks where available.",
    },
  ],

  operatingIndicators: [
    {
      indicator: "Loss of key management personnel without adequate replacement",
      significance:
        "The departure of key individuals — CEO, CFO, or specialist technical staff — may impair " +
        "the entity's ability to operate effectively or to execute its business plan, particularly " +
        "in knowledge-intensive industries such as technology, professional services, or life sciences. " +
        "The auditor should consider whether formal succession plans exist, whether the departure " +
        "signals deeper organisational or cultural problems, and whether the entity's ability to " +
        "maintain its operations and controls is affected.",
    },
    {
      indicator: "Loss of a major market, franchise, licence, or key customer",
      significance:
        "If the entity depends heavily on a particular market, franchise, regulatory licence, or " +
        "customer, the loss of that dependency may fundamentally undermine the viability of the " +
        "business model. The auditor should assess the degree of concentration, the likely impact " +
        "on future revenues and cash flows, and whether management has a credible plan to replace " +
        "the lost business or adapt the business model.",
    },
    {
      indicator: "Labour difficulties or shortages of important supplies",
      significance:
        "Sustained labour disputes, inability to recruit skilled staff, or supply-chain disruptions " +
        "can impair the entity's ability to produce goods or deliver services, leading to revenue " +
        "decline and cash-flow problems. In the UK context, sector-specific labour shortages (e.g., " +
        "construction, logistics, healthcare) and supply-chain disruptions may be relevant factors " +
        "that the auditor should evaluate.",
    },
    {
      indicator: "Emergence of a highly successful competitor or disruptive technology",
      significance:
        "Competitive pressures or technological disruption can rapidly erode market share and " +
        "profitability. The auditor should consider whether the entity has a credible strategic " +
        "response and whether the entity's intangible assets (goodwill, brands, customer " +
        "relationships, development costs) may be impaired as a result of changing competitive " +
        "dynamics.",
    },
  ],

  otherIndicators: [
    "Non-compliance with statutory capital or regulatory requirements — for example, FCA capital adequacy, Charity Commission requirements for charities, CQC registration conditions for care providers, or Ofsted requirements for education providers.",
    "Pending legal or regulatory proceedings that, if decided adversely, could result in financial obligations the entity is unlikely to be able to satisfy from its existing resources.",
    "Changes in legislation or government policy expected to adversely affect the entity — for example, changes to tax legislation, environmental regulations (including net-zero transition requirements), sector-specific regulation, or trade and tariff arrangements.",
    "Inability to maintain or renew key licences, permits, or authorisations required to operate the business — for example, premises licences, environmental permits, financial-services authorisations (FCA Part 4A permissions), or sector-specific regulatory approvals.",
    "Events after the reporting period that indicate deterioration in the entity's financial position or operating capability — for example, a major customer entering administration, a fire at a key premises, or the withdrawal of a key product from the market.",
    "Qualified audit reports in prior years on matters that remain unresolved, or unresolved significant matters raised by the auditor in previous management letters or reports to those charged with governance.",
    "Where the entity is a subsidiary, the parent company's willingness and ability to provide ongoing financial support — the auditor should obtain a written letter of comfort or financial support from the parent and independently assess the parent's own financial ability to honour that commitment by reviewing the parent's financial statements and credit standing.",
  ],

  auditProcedures: [
    "Evaluate management's assessment of the entity's ability to continue as a going concern, including whether management has identified events or conditions that may cast significant doubt and, if so, whether management's plans to address them are feasible (ISA (UK) 570 (Revised), para 12).",
    "Obtain and critically review management's cash-flow forecasts covering at least 12 months from the date of the financial statements. Evaluate the key assumptions underpinning the forecasts, including revenue growth rates, cost assumptions, capital expenditure, working-capital movements, and financing assumptions (para 16(a)).",
    "Perform sensitivity analysis ('stress testing') on management's forecasts by modelling adverse scenarios — for example, what happens if revenue declines by 10-20%, if a major customer is lost, if interest rates rise by 200 basis points, or if planned asset disposals do not complete?",
    "Compare prior-period forecasts produced by management to actual results achieved, to assess the historical accuracy and reliability of management's forecasting process.",
    "Review the terms of all material borrowing arrangements, including covenant requirements, maturity dates, and renewal terms. Evaluate whether the entity is in compliance with all financial covenants and whether committed facilities are sufficient to meet forecast cash needs.",
    "Obtain and review post-year-end management accounts, board minutes, and bank statements to identify any deterioration in financial performance or liquidity since the balance-sheet date.",
    "Inquire of management and those charged with governance about their awareness of events or conditions beyond the 12-month assessment period that may affect the going-concern assessment.",
    "Review correspondence with banks, lenders, regulators, HMRC, and other key stakeholders for indications of financial difficulty, threatened enforcement action, or withdrawal of support.",
    "Consider whether additional disclosures about going-concern uncertainties are needed in the financial statements, even where the going-concern basis of preparation remains appropriate.",
    "Where the entity relies on financial support from a parent or other group entity, evaluate the parent's willingness and ability to provide that support: obtain a written letter of support, review the parent's latest financial statements, and assess whether the parent has the financial resources and legal ability to honour the commitment.",
    "Consider the need to obtain specific written representations from management regarding their plans for future actions, the feasibility and sufficiency of those plans, and whether they are aware of any matters beyond those disclosed that may affect going concern (ISA (UK) 570 (Revised), para 16(e)).",
    "If the auditor concludes that a material uncertainty exists related to going concern, evaluate the adequacy and completeness of the related disclosures in the financial statements and determine the appropriate impact on the auditor's report (paras 18-22).",
  ],

  managementAssessment:
    "ISA (UK) 570 (Revised), paras 12-14. The auditor shall evaluate management's assessment of " +
    "the entity's ability to continue as a going concern. Management's assessment requires making " +
    "a judgement, at a particular point in time, about inherently uncertain future events and " +
    "conditions. Under UK company law (Companies Act 2006, s.394C and s.414C), directors are " +
    "required to prepare financial statements on a going-concern basis unless they intend to " +
    "liquidate the entity or to cease operations, or have no realistic alternative but to do so. " +
    "The UK Corporate Governance Code (Provision 30) further requires the board to: (a) state " +
    "whether they consider it appropriate to adopt the going-concern basis of accounting; (b) " +
    "identify any material uncertainties relating to events or conditions that may cast significant " +
    "doubt; and (c) explain how they have assessed the prospects of the company (the 'viability " +
    "statement'). The FRC expects auditors to robustly challenge management's assessment, " +
    "particularly where: (a) the assessment is based on limited analysis, informal discussions, " +
    "or overly optimistic assumptions; (b) the entity is loss-making or has negative operating " +
    "cash flows; (c) the entity operates in a cyclical or volatile industry; or (d) external " +
    "factors (regulatory changes, economic downturn, geopolitical events) may adversely affect the " +
    "entity. The auditor should also consider whether the directors' report and strategic report " +
    "(for qualifying entities) are consistent with the going-concern assessment in the financial " +
    "statements, as required by ISA (UK) 720.",

  reportingImplications: [
    {
      type: "Going concern basis appropriate — no material uncertainty",
      when:
        "The auditor concludes that the going-concern basis of accounting is appropriate and no " +
        "material uncertainty exists relating to events or conditions that may cast significant " +
        "doubt on the entity's ability to continue as a going concern. This is the standard " +
        "outcome for the majority of audit engagements.",
      isaRef: "ISA (UK) 570 (Revised), para 17",
      wording:
        "No specific modification to the auditor's opinion is required. However, the auditor's " +
        "report under ISA (UK) 700 (Revised) includes a conclusion on the appropriateness of " +
        "management's use of the going-concern basis. For PIE audits, the auditor must include a " +
        "conclusion on going concern in a separately identified section of the auditor's report " +
        "(ISA (UK) 570 (Revised), para 22-1). The auditor should verify that the basis of " +
        "preparation note adequately describes the going-concern assessment even where no " +
        "uncertainty exists.",
    },
    {
      type: "Going concern basis appropriate — material uncertainty exists — adequate disclosure",
      when:
        "The auditor concludes that the going-concern basis is appropriate but a material " +
        "uncertainty exists related to events or conditions that may cast significant doubt on the " +
        "entity's ability to continue as a going concern. The financial statements include adequate " +
        "disclosure of the material uncertainty.",
      isaRef: "ISA (UK) 570 (Revised), paras 18-19",
      wording:
        "The auditor shall include a separate section in the auditor's report headed 'Material " +
        "Uncertainty Related to Going Concern'. This section shall: (a) draw attention to the note " +
        "in the financial statements that discloses the events or conditions giving rise to the " +
        "material uncertainty; (b) state that these events or conditions indicate the existence of " +
        "a material uncertainty that may cast significant doubt on the entity's ability to continue " +
        "as a going concern; and (c) state that the auditor's opinion is not modified in respect of " +
        "this matter. This approach provides greater prominence to the going-concern uncertainty " +
        "than the previous emphasis-of-matter approach.",
    },
    {
      type: "Going concern basis appropriate — material uncertainty exists — inadequate disclosure",
      when:
        "The auditor concludes that a material uncertainty exists but the financial statements do " +
        "not include adequate disclosure of the material uncertainty in the notes or elsewhere.",
      isaRef: "ISA (UK) 570 (Revised), para 20",
      wording:
        "The auditor shall express a qualified opinion or an adverse opinion, as appropriate, in " +
        "accordance with ISA (UK) 705. The Basis for Qualified (or Adverse) Opinion section shall " +
        "explain that a material uncertainty exists that may cast significant doubt on the entity's " +
        "ability to continue as a going concern and that the financial statements do not adequately " +
        "disclose this matter, constituting a departure from the applicable financial reporting " +
        "framework.",
    },
    {
      type: "Going concern basis of accounting inappropriate",
      when:
        "The financial statements have been prepared on a going-concern basis but, in the auditor's " +
        "judgement, the use of the going-concern basis is not appropriate — i.e., the entity is " +
        "unable to continue as a going concern and the financial statements should have been " +
        "prepared on an alternative basis (e.g., a break-up or liquidation basis).",
      isaRef: "ISA (UK) 570 (Revised), para 21",
      wording:
        "The auditor shall express an adverse opinion in accordance with ISA (UK) 705. The Basis " +
        "for Adverse Opinion section shall explain that the entity is unable to continue as a going " +
        "concern and that the financial statements have been prepared on a going-concern basis which " +
        "is not appropriate in the circumstances. The measurement bases, classifications, and " +
        "disclosures that would apply under a break-up basis are materially different from those " +
        "under the going-concern basis, resulting in the financial statements being materially " +
        "misstated.",
    },
    {
      type: "Management unwilling to make or extend its assessment",
      when:
        "Management is unwilling to make its assessment of going concern, or to extend its " +
        "assessment to cover the minimum 12-month period from the date of the financial " +
        "statements, when requested by the auditor.",
      isaRef: "ISA (UK) 570 (Revised), para 22",
      wording:
        "The auditor shall consider the implications for the auditor's report. A qualified opinion " +
        "or a disclaimer of opinion may be appropriate due to the inability to obtain sufficient " +
        "appropriate audit evidence about the appropriateness of the going-concern basis. The " +
        "auditor should also consider whether to report to the entity's members under s.498 " +
        "Companies Act 2006, or to relevant regulatory authorities where the entity is regulated.",
    },
  ],
};


// ---------------------------------------------------------------------------
// 7. GROUP_AUDIT_FRAMEWORK  (ISA (UK) 600 Revised, effective for periods
//    commencing on or after 15 December 2023)
// ---------------------------------------------------------------------------

export const GROUP_AUDIT_FRAMEWORK = {
  scopingProcess: [
    {
      step: "1. Understand the group structure and its components",
      description:
        "ISA (UK) 600 (Revised), paras 21-26. The group engagement team shall obtain an " +
        "understanding of the group and its environment, the applicable financial reporting " +
        "framework, and the group's system of internal control over financial reporting. This " +
        "includes understanding: (a) the legal and operational group structure, including all " +
        "components (subsidiaries, associates, joint ventures, branches, and other entities " +
        "included in the group financial statements); (b) the activities, business environments, " +
        "and industry sectors of significant components; (c) the group-wide controls established " +
        "by management over financial reporting, including IT general controls over group reporting " +
        "systems and the consolidation software; (d) the consolidation process, including the " +
        "instructions (reporting packages) issued by group management to components; and (e) any " +
        "complex or unusual transactions at the group level, such as intercompany eliminations, " +
        "business combinations, foreign-currency translation, and non-controlling interest " +
        "calculations.",
    },
    {
      step: "2. Identify significant components",
      description:
        "ISA (UK) 600 (Revised), paras 27-29. The group engagement team shall identify components " +
        "that are individually financially significant to the group. A component is likely to be " +
        "significant if: (a) it contributes a significant proportion of group revenue, total " +
        "assets, or profit before tax — in UK practice, a threshold of approximately 15-20% of a " +
        "key benchmark is commonly used, although no bright-line rule exists; (b) it involves " +
        "significant risks of material misstatement of the group financial statements due to its " +
        "nature or circumstances — for example, complex transactions, significant litigation " +
        "exposure, or operations in high-risk jurisdictions; or (c) it holds balances that are " +
        "material to the group even if its overall size is not significant. Components that are " +
        "not individually significant may collectively be material and require targeted procedures.",
    },
    {
      step: "3. Determine the type of work for each component",
      description:
        "ISA (UK) 600 (Revised), paras 27-31. For each component, the group engagement team " +
        "shall determine the appropriate type of work: (a) a full-scope audit of the component's " +
        "financial information using component materiality — typically for financially significant " +
        "components; (b) an audit of specified account balances, classes of transactions, or " +
        "disclosures — typically for components significant due to specific risks; (c) specified " +
        "audit procedures relating to identified risks of material misstatement of the group " +
        "financial statements; or (d) analytical procedures performed at the group level — " +
        "typically for components that are not individually significant. The group engagement team " +
        "must ensure that, in aggregate, sufficient appropriate audit evidence is obtained across " +
        "all components to support the group audit opinion.",
    },
    {
      step: "4. Determine component materiality",
      description:
        "ISA (UK) 600 (Revised), para 32. Component materiality must be set at an amount lower " +
        "than group materiality to reduce the aggregation risk — the risk that the sum of " +
        "uncorrected and undetected misstatements across all components exceeds group materiality. " +
        "Component materiality need not be a proportional allocation and may differ between " +
        "components based on risk. See componentMateriality for detailed guidance on common " +
        "approaches used in UK practice.",
    },
    {
      step: "5. Communicate with component auditors",
      description:
        "ISA (UK) 600 (Revised), paras 40-42. The group engagement team shall communicate with " +
        "component auditors in a timely manner via formal group-audit instructions. The " +
        "instructions should specify: (a) the nature, timing, and extent of work to be performed " +
        "and the component materiality and performance materiality to be applied; (b) identified " +
        "risks of material misstatement at the group level that are relevant to the component; " +
        "(c) the required format and content of the component auditor's reporting to the group; " +
        "(d) a request for confirmation of ethical compliance and independence; and (e) the " +
        "timeline for delivery of the component auditor's deliverables.",
    },
    {
      step: "6. Evaluate the sufficiency and appropriateness of evidence obtained",
      description:
        "ISA (UK) 600 (Revised), paras 44-47. After receiving and reviewing the component " +
        "auditors' reports and work, the group engagement team shall evaluate whether sufficient " +
        "appropriate audit evidence has been obtained from the consolidation procedures and from " +
        "the work on individual components' financial information. This includes: reviewing the " +
        "component auditors' communications and findings; evaluating the significance and " +
        "disposition of identified misstatements; considering whether additional group-level " +
        "procedures are required; and concluding whether the evidence supports the group audit " +
        "opinion. The group engagement partner retains sole responsibility for the group audit " +
        "opinion.",
    },
  ],

  componentMateriality:
    "ISA (UK) 600 (Revised), para 32. Component materiality shall be set lower than group " +
    "materiality to mitigate the aggregation risk across all components. Component materiality " +
    "need not be a simple arithmetic proportion of group materiality and may differ between " +
    "components based on their individual risk profiles. In UK practice, common approaches " +
    "include: (a) allocating group materiality across components on a pro-rata basis (e.g., " +
    "based on each component's share of revenue or total assets), then applying a reduction " +
    "factor — often 50-75% of the allocated amount; (b) setting component materiality as a " +
    "fixed percentage of group materiality, typically in the range of 50-75%, subject to a cap " +
    "that ensures no component's materiality exceeds group materiality; or (c) performing a " +
    "separate materiality calculation for each component using the component's own benchmarks " +
    "(e.g., 1-2% of component revenue or 5-10% of component profit before tax), then capping " +
    "the result at group materiality. The group engagement team must exercise professional " +
    "judgement considering: the relative financial significance of the component, its risk " +
    "profile (including the quality of the control environment), the competence of the component " +
    "auditor, and the aggregation risk across all components. A component performance materiality " +
    "should also be set (typically 50-75% of component materiality), and a threshold for reporting " +
    "misstatements from the component to the group (typically 5-10% of component materiality or " +
    "a de minimis amount set by the group engagement team).",

  communicationRequirements: [
    "Issue detailed group-audit instructions to all component auditors specifying the nature, timing, and extent of work to be performed, the applicable materiality levels, and the format and content of reporting deliverables (ISA (UK) 600 (Revised), para 40).",
    "Request formal confirmation from each component auditor regarding their independence from the entity and compliance with applicable ethical requirements, including the FRC Ethical Standard (para 19-20). Where the component auditor is in a different jurisdiction, compliance with that jurisdiction's ethical standards should also be confirmed.",
    "Communicate all identified risks of material misstatement at the group financial-statement level that are relevant to the component auditor's work, including fraud risks and areas requiring special audit consideration (para 25).",
    "Request component auditors to report on: (a) instances of non-compliance with laws and regulations that could give rise to a material misstatement of the group financial statements; (b) all identified misstatements, both corrected and uncorrected, above the reporting threshold; (c) indicators of possible management bias in accounting estimates; (d) significant deficiencies in internal control identified during the audit; and (e) any other matters relevant to the group audit requiring the group engagement team's attention (para 41).",
    "Establish and communicate a clear timeline for submission of component auditor deliverables to the group engagement team, allowing sufficient time for the group engagement team to review the work, raise queries, and request additional procedures if necessary before the group auditor's report date.",
    "Communicate any additional procedures required as a result of the group engagement team's review of the component auditor's work, findings, or group-level analytical procedures that identify matters requiring investigation at the component level.",
    "Obtain a summary memorandum or completion document from each component auditor summarising the scope of work performed, key findings, misstatements identified, and the component auditor's conclusions.",
    "For entities that are also listed in the United States or subject to other international regulatory requirements, ensure that communications also comply with PCAOB standards or other applicable requirements as relevant.",
  ],

  componentAuditorAssessment: [
    "Assess whether the component auditor has the appropriate competence and capabilities to perform the required work, including: (a) relevant industry or sector expertise; (b) understanding of the applicable financial reporting framework (UK-adopted IFRS, FRS 102, or other framework); (c) familiarity with ISA (UK) standards and UK ethical requirements; and (d) experience with the specific type of work requested (ISA (UK) 600 (Revised), para 19).",
    "Evaluate the component auditor's independence from the entity and compliance with ethical requirements applicable to the group audit. In the UK, this includes compliance with the FRC Ethical Standard (2019), including the non-audit-services restrictions and fee-cap requirements for PIE engagements.",
    "Assess the quality of the component auditor's firm by reviewing its system of quality management under ISQM (UK) 1, and considering external inspection reports from the relevant regulatory body — for example, the FRC's Audit Quality Review team (for UK firms), PCAOB (for US-registered firms), or the equivalent local regulatory body in the component auditor's jurisdiction.",
    "Determine the appropriate level of the group engagement team's involvement in the component auditor's work. For significant components, this should include consideration of: (a) visiting the component auditor (in person or remotely) during the planning and completion phases; (b) reviewing key sections of the component auditor's audit documentation; (c) participating in the component planning meeting and closing meeting; and (d) directing or performing additional procedures on specific risk areas (ISA (UK) 600 (Revised), paras 33-34).",
    "Consider whether there are restrictions on the group engagement team's access to the component auditor's working papers — for example, legal restrictions in certain jurisdictions may prevent cross-border access to audit documentation. Where restrictions exist, assess whether sufficient appropriate evidence can be obtained by alternative means, such as enhanced reporting from the component auditor or direct performance of certain procedures by the group engagement team.",
    "Document the group engagement team's assessment of each component auditor, including the basis for the assessment, any restrictions or limitations encountered, and the planned level of involvement.",
  ],

  consolidationProcedures: [
    "Evaluate whether the consolidation adjustments are appropriate and accurately processed, including: (a) elimination of intercompany transactions and balances (sales, purchases, loans, dividends); (b) elimination of unrealised profits on intercompany transactions (e.g., unrealised profit in closing inventory transferred between group entities); (c) correct accounting for non-controlling interests in accordance with IFRS 10 / FRS 102 Section 9; and (d) equity-method accounting for associates and joint ventures under IAS 28 / FRS 102 Section 14-15 (ISA (UK) 600 (Revised), para 38).",
    "Test the reconciliation of intercompany balances across all components. Investigate and resolve any reconciling differences, particularly those that are material, that have aged for more than one reporting period, or that indicate potential errors in the component financial information.",
    "Evaluate the appropriateness of foreign-currency translation procedures: (a) verify the correct identification of each component's functional currency per IAS 21 / FRS 102 Section 30; (b) check that appropriate exchange rates have been used — closing rates for balance-sheet items and average rates (or transaction-date rates where fluctuations are significant) for income and expense items; and (c) verify that translation differences are correctly classified in other comprehensive income.",
    "Assess the accounting for any business combinations that occurred during the period, including: the identification and measurement of fair values of acquired assets and assumed liabilities, the calculation of goodwill (or bargain-purchase gain), the allocation of the purchase price, and subsequent impairment testing of goodwill (IFRS 3 / FRS 102 Section 19).",
    "Verify the consistency of accounting policies across all components. Where components have applied different accounting policies (e.g., due to operating in different jurisdictions), assess whether appropriate adjustments have been made to align with the group's accounting policies before consolidation.",
    "Test the consolidation model (whether a spreadsheet, dedicated consolidation software, or ERP module) for mathematical accuracy and logical integrity — including verifying that all components are included, that the eliminations net to zero, and that no double-counting has occurred.",
    "Evaluate the adequacy of group-level disclosures, including: segment reporting (IFRS 8), related-party disclosures (IAS 24 / FRS 102 Section 33), disclosures about interests in other entities (IFRS 12 / FRS 102 Section 9), and disclosures about the basis of consolidation.",
    "Perform analytical procedures on the consolidated financial statements as a whole, considering the consistency of the consolidated results with the sum of component results and the reasonableness of key consolidated ratios and trends (ISA (UK) 520).",
  ],

  significantComponents:
    "ISA (UK) 600 (Revised), paras 27-29. A component is considered significant to the group " +
    "when: (a) it is of individual financial significance — in UK practice, a component " +
    "contributing approximately 15-20% or more of a key benchmark (revenue, total assets, or " +
    "profit before tax) is typically considered financially significant, although there is no " +
    "mandatory bright-line threshold and professional judgement is required; or (b) it is likely " +
    "to include significant risks of material misstatement of the group financial statements " +
    "due to its specific nature or circumstances — for example, it holds a complex financial " +
    "instrument portfolio, is involved in major litigation, operates in a high-risk jurisdiction, " +
    "or has experienced control deficiencies. For financially significant components, the group " +
    "engagement team should ensure that an audit (or review) of the component's complete " +
    "financial information is performed using component materiality. For components significant " +
    "due to risk, the group engagement team should direct or perform: (a) an audit of the " +
    "component's financial information; (b) an audit of the specific account balances, classes " +
    "of transactions, or disclosures relating to the identified significant risks; or (c) " +
    "specified audit procedures addressing the identified risks. The group engagement team " +
    "should also evaluate whether the aggregate of components not individually subject to " +
    "audit work (the 'coverage gap') could contain undetected misstatements that, in total, " +
    "could be material to the group financial statements. FRC inspection findings have " +
    "consistently emphasised that group engagement teams must demonstrate a clear and documented " +
    "basis for their scoping decisions, and that coverage of 70-80% or more of key financial " +
    "benchmarks through full-scope or specified-procedure work is generally expected to provide " +
    "sufficient audit coverage.",
};


// ---------------------------------------------------------------------------
// 8. ISA_315_INTERNAL_CONTROL  (ISA 315 Revised 2019)
// ---------------------------------------------------------------------------

export const ISA_315_INTERNAL_CONTROL = {
  title: "ISA 315 (Revised 2019) — Understanding the Entity and Its Environment",
  isa: "ISA 315.12-27",
  overview: "The auditor shall obtain an understanding of the entity and its environment, the applicable financial reporting framework, and the entity's system of internal control, to identify and assess the risks of material misstatement.",
  components: [
    {
      name: "Control Environment",
      isa: "ISA 315.21(a), A77-A92",
      description: "The governance and management functions and the attitudes, awareness, and actions of those charged with governance and management concerning the entity's internal control and its importance in the entity.",
      elements: [
        "Communication and enforcement of integrity and ethical values",
        "Commitment to competence — HR policies, training, performance evaluation",
        "Participation by those charged with governance — independence, experience, oversight",
        "Management's philosophy and operating style — risk appetite, attitude to financial reporting",
        "Organisational structure — assignment of authority and responsibility",
        "Assignment of authority and responsibility — delegation, reporting lines",
        "Human resource policies and practices — hiring, orientation, training, evaluating, counselling, promoting, compensating"
      ],
      auditProcedures: [
        "Enquire of management and TCWG about tone at the top (ISA 315.14)",
        "Observe and inspect policies on ethical conduct, whistleblowing, and anti-fraud",
        "Review board/audit committee minutes for evidence of active oversight",
        "Assess whether the organisational structure is appropriate for the entity's size and complexity",
        "Evaluate HR policies including background checks, performance reviews, and competency requirements"
      ],
      redFlags: [
        "Dominance by a single individual without compensating controls",
        "High staff turnover, especially in finance function",
        "Lack of code of conduct or whistleblowing policy",
        "No audit committee or inactive audit committee",
        "Frequent override of controls by management"
      ]
    },
    {
      name: "Risk Assessment Process",
      isa: "ISA 315.21(b), A93-A98",
      description: "The entity's process for identifying business risks relevant to financial reporting objectives, estimating the significance of risks, assessing the likelihood of their occurrence, and deciding about actions to address those risks.",
      elements: [
        "How management identifies risks relevant to financial reporting",
        "How management estimates the significance of identified risks",
        "How management assesses the likelihood of risk occurrence",
        "How management decides on actions to address risks",
        "Whether the process is appropriate to the nature and size of the entity"
      ],
      auditProcedures: [
        "Enquire whether management has a formal risk assessment process (ISA 315.15)",
        "If formal process exists, review risk registers and risk committee reports",
        "If no formal process, discuss with management how risks are identified and addressed",
        "Evaluate whether the process addresses risks of material misstatement",
        "Consider whether risks identified by the entity align with the auditor's own risk assessment"
      ],
      redFlags: [
        "No formal or informal risk assessment process",
        "Risk assessment does not consider financial reporting risks",
        "Management dismisses or ignores identified risks",
        "No process for monitoring the effectiveness of risk responses"
      ]
    },
    {
      name: "Information System",
      isa: "ISA 315.21(c), A99-A117",
      description: "The information system relevant to financial reporting objectives, which includes the accounting system, consisting of the procedures and records designed and established to initiate, record, process and report entity transactions and maintain accountability for the related assets, liabilities and equity.",
      elements: [
        "The classes of transactions significant to the financial statements",
        "How transactions are initiated, recorded, processed, corrected, and transferred to the general ledger",
        "Accounting records, supporting information, and specific accounts used to initiate, record, process, and report transactions",
        "How the information system captures events and conditions other than transactions",
        "The financial reporting process used to prepare the financial statements including significant estimates and disclosures",
        "IT environment — applications, databases, operating systems, networks"
      ],
      auditProcedures: [
        "Perform walkthroughs of significant transaction classes (ISA 315.A102)",
        "Identify IT applications and databases involved in financial reporting",
        "Understand how journal entries are initiated, authorised, and recorded",
        "Evaluate the IT general controls (access, change management, operations, backups)",
        "Assess whether the chart of accounts is appropriate and correctly used",
        "Review the financial statements close process"
      ],
      redFlags: [
        "Heavily manual processes without compensating controls",
        "Excessive use of spreadsheets for financial reporting",
        "Lack of segregation of duties in IT access",
        "No formal change management process for IT systems",
        "Inadequate backup and disaster recovery procedures"
      ]
    },
    {
      name: "Control Activities",
      isa: "ISA 315.21(d), A118-A135",
      description: "The policies and procedures that help ensure that management directives are carried out. Control activities are performed at all levels of the entity and at various stages within business processes.",
      elements: [
        "Authorisation and approval controls",
        "Performance reviews (budget vs actual, KPI monitoring)",
        "Information processing controls (input, processing, output)",
        "Physical controls (asset safeguarding, inventory counts, access restrictions)",
        "Segregation of duties (authorisation, recording, custody)",
        "General IT controls (access security, change management, operations)"
      ],
      auditProcedures: [
        "Identify controls that address assessed risks of material misstatement (ISA 315.26)",
        "Evaluate the design of identified controls — would they prevent or detect misstatement?",
        "Determine whether controls have been implemented through walkthrough or observation",
        "For controls to be relied upon, plan tests of operating effectiveness per ISA 330",
        "Document the understanding of control activities in working papers"
      ],
      redFlags: [
        "Key controls operate manually with no evidence of performance",
        "Single person performs incompatible duties (e.g., initiates and approves payments)",
        "Management override of established controls",
        "Controls designed but not implemented or not operating effectively",
        "No independent reconciliation of key accounts"
      ]
    },
    {
      name: "Monitoring of Controls",
      isa: "ISA 315.21(e), A136-A145",
      description: "The entity's process for assessing the effectiveness of internal control performance over time. It includes assessing whether controls are operating as intended and that they are modified as appropriate for changes in conditions.",
      elements: [
        "Ongoing monitoring activities (supervisory review, management reporting)",
        "Separate evaluations (internal audit, self-assessments)",
        "Reporting of deficiencies to appropriate levels of management and TCWG",
        "Follow-up on whether deficiencies are remediated timely"
      ],
      auditProcedures: [
        "Enquire about the entity's internal audit function (if any) per ISA 315.23",
        "Review internal audit reports and management's response to findings",
        "Assess whether management monitors controls on an ongoing basis",
        "Consider whether deficiencies identified in prior audits have been remediated",
        "Evaluate the effectiveness of the entity's monitoring activities"
      ],
      redFlags: [
        "No internal audit function and no compensating monitoring",
        "Internal audit findings are ignored by management",
        "Prior year audit points repeatedly remain unresolved",
        "No process for reporting control deficiencies to TCWG",
        "Significant deficiencies identified by auditor that entity was unaware of"
      ]
    }
  ]
};


// ---------------------------------------------------------------------------
// 9. ISA_330_AUDIT_RESPONSES  (ISA 330)
// ---------------------------------------------------------------------------

export const ISA_330_AUDIT_RESPONSES = {
  title: "ISA 330 — Designing Audit Responses to Assessed Risks",
  isa: "ISA 330",
  overview: "The auditor shall design and implement overall responses to address the assessed risks of material misstatement at the financial statement level, and design and perform further audit procedures whose nature, timing and extent are responsive to the assessed risks at the assertion level.",
  overallResponses: {
    isa: "ISA 330.5-6",
    description: "Responses to pervasive risks at the financial statement level",
    examples: [
      "Assign more experienced staff or specialists to the engagement",
      "Provide additional supervision during the audit",
      "Incorporate additional elements of unpredictability in selecting procedures",
      "Make general changes to the nature, timing, or extent of procedures (e.g., more year-end vs interim testing)",
      "Consider the general IT environment and entity-level controls"
    ]
  },
  testsOfControls: {
    isa: "ISA 330.8-17",
    when: "When the auditor's risk assessment includes an expectation that controls are operating effectively, or when substantive procedures alone cannot provide sufficient appropriate evidence at the assertion level.",
    nature: [
      "Enquiry combined with other procedures (inspection, observation, re-performance)",
      "Enquiry alone is not sufficient to test the operating effectiveness of controls",
      "Re-performance provides the most evidence of operating effectiveness"
    ],
    timing: "Controls should be tested for the period of reliance. If tested at interim, the auditor must obtain evidence about significant changes since interim and extend testing to the remaining period.",
    extent: "More extensive testing when: higher risk of material misstatement, greater reliance on controls, controls are manual (vs automated), changes in volume/complexity of transactions, or significant changes in controls during the period.",
    examples: [
      {
        control: "Purchase order approval for transactions > \u00a35,000",
        riskLevel: "ELEVATED",
        testProcedure: "Select 25 purchase orders > \u00a35,000 across the period. Inspect for evidence of approval by an authorised signatory. Verify approval was obtained before the purchase was committed.",
        sampleSize: "25 items (ISA 530 — frequency of control operation)",
        assertion: "Occurrence; Authorisation"
      },
      {
        control: "Monthly bank reconciliation prepared and reviewed",
        riskLevel: "SIGNIFICANT",
        testProcedure: "Inspect all 12 monthly bank reconciliations. Verify preparation by accounts team and independent review by finance manager. Check reconciling items are reasonable and cleared promptly.",
        sampleSize: "All 12 months (controls operating monthly — test each occurrence)",
        assertion: "Existence; Completeness"
      },
      {
        control: "Automated three-way match (PO, GRN, invoice)",
        riskLevel: "NORMAL",
        testProcedure: "Inspect IT application settings to verify the three-way match is configured correctly. Select sample of 10 transactions and verify the match was performed. Test exception handling for mismatches.",
        sampleSize: "Test configuration once + 10 transactions (automated control — test 1 + IT general controls)",
        assertion: "Accuracy; Occurrence"
      }
    ]
  },
  substantiveProcedures: {
    isa: "ISA 330.18-23",
    categories: [
      {
        type: "Tests of Detail",
        description: "Procedures applied to individual items comprising account balances, classes of transactions, or disclosures.",
        examples: ["Vouching sales invoices to contracts", "Confirming bank balances", "Inspecting title deeds", "Recalculating depreciation", "Tracing source documents to accounting records"],
        when: "Higher risk assertions, testing existence and occurrence, complex estimates"
      },
      {
        type: "Substantive Analytical Procedures",
        description: "Evaluations of financial information through analysis of plausible relationships among both financial and non-financial data (ISA 520).",
        examples: ["Comparing revenue per employee to prior year and industry", "Payroll proof-in-total (headcount \u00d7 average salary)", "Gross margin analysis by product line", "Rent expense \u00d7 months occupied", "Depreciation calculation based on asset register"],
        when: "Lower risk assertions, large homogeneous populations, stable and predictable relationships"
      }
    ],
    decisionFactors: [
      "Assessed risk level (higher risk \u2192 more tests of detail)",
      "Nature of the assertion (existence \u2192 tests of detail; completeness \u2192 analytical + tests)",
      "Population characteristics (homogeneous \u2192 analytical; heterogeneous \u2192 tests of detail)",
      "Availability of data for analytical procedures",
      "Whether sufficient precision can be achieved through analytical procedures"
    ]
  }
};


// ---------------------------------------------------------------------------
// 10. ISA_500_EVIDENCE  (ISA 500, ISA 501)
// ---------------------------------------------------------------------------

export const ISA_500_EVIDENCE = {
  title: "ISA 500-501 — Audit Evidence: Sufficiency and Appropriateness",
  isa: "ISA 500, ISA 501",
  overview: "The auditor shall design and perform audit procedures that are appropriate in the circumstances for the purpose of obtaining sufficient appropriate audit evidence.",
  sufficiency: {
    definition: "The measure of the quantity of audit evidence. The quantity needed is affected by the risk of material misstatement and by the quality of the evidence obtained.",
    factors: [
      "Risk assessment — higher risk requires more evidence",
      "Quality of evidence — higher quality means less quantity needed",
      "Source of evidence — external generally more reliable than internal",
      "Nature of evidence — original documents more reliable than copies",
      "Individual item vs population testing"
    ]
  },
  appropriateness: {
    definition: "The measure of the quality of audit evidence — its relevance and reliability in providing support for the conclusions on which the auditor's opinion is based.",
    relevance: "Evidence must relate to the specific assertion being tested. Evidence about existence does not address valuation.",
    reliabilityHierarchy: [
      { rank: 1, source: "External confirmation obtained directly by auditor", example: "Bank confirmation letter", isa: "ISA 505" },
      { rank: 2, source: "External documentary evidence", example: "Supplier invoices, title deeds", isa: "ISA 500.A31" },
      { rank: 3, source: "Internal documentary evidence with external corroboration", example: "Sales invoice matched to customer PO and delivery note", isa: "ISA 500.A31" },
      { rank: 4, source: "Internal documentary evidence", example: "Journal entries, management accounts", isa: "ISA 500.A31" },
      { rank: 5, source: "Oral representations from management", example: "Enquiry responses, management representations", isa: "ISA 500.A31" },
      { rank: 6, source: "Oral representations from entity personnel", example: "Warehouse staff confirming count procedures", isa: "ISA 500.A31" }
    ]
  },
  decisionTree: [
    { step: 1, question: "What assertion am I testing?", guidance: "Identify the specific assertion (existence, completeness, accuracy, valuation, etc.) — this determines what evidence is relevant." },
    { step: 2, question: "What is the assessed risk for this assertion?", guidance: "Higher risk \u2192 more evidence needed, higher quality required, more persuasive procedures." },
    { step: 3, question: "What is the best available source of evidence?", guidance: "Prefer external over internal, original over copies, direct observation over enquiry." },
    { step: 4, question: "Is the evidence sufficient in quantity?", guidance: "Consider: sample size relative to population, number of exceptions found, consistency of evidence." },
    { step: 5, question: "Is the evidence appropriate in quality?", guidance: "Consider: source reliability, relevance to assertion, corroboration from other sources." },
    { step: 6, question: "Is contradictory evidence present?", guidance: "If yes, investigate and obtain additional evidence to resolve the inconsistency per ISA 500.11." },
    { step: 7, question: "Can I draw a reasonable conclusion?", guidance: "If not, perform additional procedures, modify the approach, or consider the impact on the audit opinion." }
  ],
  isa501_specific: [
    { area: "Inventory (ISA 501.4)", requirement: "Attend physical inventory counting unless impracticable. Perform test counts. Observe management's count procedures.", alternativeProcedures: "If attendance is impracticable, perform or observe counts on an alternative date and test intervening transactions. If neither is possible, perform alternative audit procedures — if none can provide sufficient evidence, modify the opinion." },
    { area: "Litigation and Claims (ISA 501.9)", requirement: "Obtain audit evidence about litigation and claims through enquiry of management, review of board minutes, review of legal expense accounts, and communication with entity's external legal counsel.", alternativeProcedures: "If management refuses to allow communication with legal counsel, this is a scope limitation — consider the impact on the audit opinion." },
    { area: "Segment Information (ISA 501.13)", requirement: "Obtain sufficient appropriate audit evidence regarding the presentation and disclosure of segment information in accordance with the applicable financial reporting framework.", alternativeProcedures: "Agree segment revenue and results to underlying records. Test allocation methodology for reasonableness." }
  ]
};


// ---------------------------------------------------------------------------
// 11. ISA_505_CONFIRMATIONS  (ISA 505)
// ---------------------------------------------------------------------------

export const ISA_505_CONFIRMATIONS = {
  title: "ISA 505 — External Confirmations",
  isa: "ISA 505",
  overview: "External confirmation procedures provide audit evidence obtained as a direct written response to the auditor from a third party, in paper or electronic form.",
  types: [
    {
      type: "Positive Confirmation",
      description: "Requests the confirming party to respond directly to the auditor indicating whether they agree or disagree with the information in the request, or providing the requested information.",
      when: "Higher risk of material misstatement, large or unusual balances, where existence assertion is key",
      advantages: ["Provides direct evidence from third party", "Non-response is a potential indicator of misstatement", "More persuasive than negative confirmation"],
      disadvantages: ["Can be time-consuming to send and follow up", "Non-responses require alternative procedures", "Risk of interception or manipulation"]
    },
    {
      type: "Negative Confirmation",
      description: "Requests the confirming party to respond directly to the auditor only if they disagree with the information provided in the request.",
      when: "Lower assessed risk, large number of small balances, low expected exception rate, no reason to believe respondents will disregard the request",
      advantages: ["Efficient for large populations of small balances", "Cost-effective"],
      disadvantages: ["Non-response does not provide explicit evidence", "Less persuasive than positive", "Cannot be sole source of evidence for material balances"]
    },
    {
      type: "Blank Confirmation",
      description: "A type of positive confirmation that does not state the amount — the confirming party fills in the balance or provides other information.",
      when: "Where there is a higher risk that respondents may confirm incorrect information without verifying it (ISA 505.A7)",
      advantages: ["More reliable as respondent provides the information independently", "Reduces acquiescence bias"],
      disadvantages: ["Lower response rates than standard positive confirmations", "More effort required by respondent"]
    }
  ],
  commonAreas: [
    { area: "Bank balances", type: "Positive (standard bank confirmation letter)", isa: "ISA 505; Practice Note 16" },
    { area: "Trade receivables", type: "Positive for material balances; negative for small homogeneous balances", isa: "ISA 505.7" },
    { area: "Trade payables", type: "Positive (supplier statement reconciliation as alternative)", isa: "ISA 505.7" },
    { area: "Loans and borrowings", type: "Positive (bank or lender confirmation)", isa: "ISA 505.7" },
    { area: "Investments held by custodian", type: "Positive (custodian confirmation)", isa: "ISA 505.7" },
    { area: "Legal claims", type: "Positive (solicitor's letter per ISA 501.9)", isa: "ISA 501.9; ISA 505" },
    { area: "Intercompany balances", type: "Positive (group confirmation)", isa: "ISA 505; ISA 600" },
    { area: "Related party balances", type: "Positive", isa: "ISA 505; ISA 550" }
  ],
  alternativeProcedures: {
    isa: "ISA 505.12",
    description: "When the auditor does not receive a response to a positive confirmation request, the auditor shall perform alternative audit procedures to obtain relevant and reliable audit evidence.",
    procedures: [
      "For receivables: examine subsequent cash receipts, shipping documents, post year-end sales records",
      "For payables: examine subsequent payments, supplier statements, purchase orders and GRNs",
      "For bank balances: obtain additional bank statements, review post year-end transactions",
      "For investments: inspect certificates, custodian statements, or registrar records",
      "For legal claims: review legal invoices, board minutes, management representations"
    ],
    ifAlternativeInsufficient: "If alternative procedures do not provide sufficient appropriate evidence, the auditor should consider the implications for the audit opinion per ISA 705."
  },
  managementRefusal: {
    isa: "ISA 505.8",
    guidance: "If management refuses to allow the auditor to send a confirmation request: (1) enquire as to management's reasons and evaluate the reasonableness and validity of the refusal, (2) evaluate the implications for the assessment of the relevant risks of material misstatement including fraud risk, (3) perform alternative audit procedures, (4) if the refusal is unreasonable or the auditor is unable to obtain sufficient evidence through alternatives, communicate with TCWG and consider the impact on the opinion."
  }
};


// ---------------------------------------------------------------------------
// 12. ISA_520_ANALYTICAL_PROCEDURES  (ISA 520)
// ---------------------------------------------------------------------------

export const ISA_520_ANALYTICAL_PROCEDURES = {
  title: "ISA 520 — Analytical Procedures",
  isa: "ISA 520",
  overview: "Analytical procedures are evaluations of financial information through analysis of plausible relationships among both financial and non-financial data. They are required at planning (ISA 315) and completion (ISA 520.6) stages, and may be used as substantive procedures.",
  ratioAnalysis: {
    liquidity: [
      { name: "Current Ratio", formula: "Current Assets \u00f7 Current Liabilities", interpretation: "> 1.0 indicates short-term solvency; < 1.0 may indicate liquidity risk. Industry and seasonal context important.", benchmark: "Generally 1.5-2.0; varies by industry", goingConcernRelevance: "Below 1.0 is a going concern indicator per ISA 570" },
      { name: "Quick Ratio (Acid Test)", formula: "(Current Assets \u2212 Inventory) \u00f7 Current Liabilities", interpretation: "More conservative liquidity measure excluding inventory. Below 1.0 may indicate dependence on inventory liquidation or short-term borrowing.", benchmark: "Generally > 1.0", goingConcernRelevance: "Persistent decline may indicate going concern risk" },
      { name: "Cash Ratio", formula: "Cash and Cash Equivalents \u00f7 Current Liabilities", interpretation: "Most conservative measure. Shows ability to meet obligations from cash alone.", benchmark: "Varies; typically 0.1-0.5", goingConcernRelevance: "Very low ratio combined with no credit facilities is a red flag" },
      { name: "Working Capital", formula: "Current Assets \u2212 Current Liabilities", interpretation: "Positive = net current asset position. Negative may require investigation of going concern and liquidity.", benchmark: "Should be positive unless seasonal/structural", goingConcernRelevance: "Negative working capital is a key ISA 570 indicator" }
    ],
    profitability: [
      { name: "Gross Margin %", formula: "Gross Profit \u00f7 Revenue \u00d7 100", interpretation: "Measures production/trading efficiency. Material changes may indicate pricing issues, cost overruns, or misstatement.", benchmark: "Industry-specific; compare to PY and peers", auditRelevance: "Unexpected change may indicate revenue/cost misstatement" },
      { name: "Operating Margin %", formula: "Operating Profit \u00f7 Revenue \u00d7 100", interpretation: "Measures operational efficiency including overheads.", benchmark: "Industry-specific", auditRelevance: "Decline despite stable gross margin suggests overhead issues" },
      { name: "Net Margin %", formula: "Net Profit \u00f7 Revenue \u00d7 100", interpretation: "Overall profitability after all costs, interest, and tax.", benchmark: "Industry-specific", auditRelevance: "Compare to expectations and investigate significant variances" },
      { name: "Return on Capital Employed (ROCE)", formula: "Operating Profit \u00f7 (Total Assets \u2212 Current Liabilities) \u00d7 100", interpretation: "Measures efficiency of capital deployment.", benchmark: "Should exceed cost of capital", auditRelevance: "Low ROCE may indicate impairment indicators per IAS 36" },
      { name: "Return on Equity (ROE)", formula: "Net Profit \u00f7 Shareholders' Equity \u00d7 100", interpretation: "Return generated for shareholders.", benchmark: "Varies; compare to PY and industry", auditRelevance: "Declining ROE may indicate deteriorating performance" }
    ],
    efficiency: [
      { name: "Debtor Days", formula: "Trade Receivables \u00f7 Revenue \u00d7 365", interpretation: "Average collection period. Increasing trend may indicate collection difficulties or revenue manipulation.", benchmark: "Depends on credit terms; typically 30-60 days", auditRelevance: "Significant increase may indicate bad debt issues or fictitious revenue" },
      { name: "Creditor Days", formula: "Trade Payables \u00f7 Cost of Sales \u00d7 365", interpretation: "Average payment period. Significant increase may indicate cash flow difficulties.", benchmark: "Depends on supplier terms; typically 30-60 days", auditRelevance: "Very high may indicate unrecorded liabilities or cash flow stress" },
      { name: "Stock Turn Days", formula: "Inventory \u00f7 Cost of Sales \u00d7 365", interpretation: "Days of stock held. Increasing trend may indicate obsolescence or slowing sales.", benchmark: "Industry-specific; lower is generally better", auditRelevance: "Increasing stock days may indicate obsolescence provision needed" },
      { name: "Asset Turnover", formula: "Revenue \u00f7 Total Assets", interpretation: "Efficiency of asset utilisation. Declining may indicate overcapacity or impairment.", benchmark: "Industry-specific", auditRelevance: "Low turnover may indicate impairment indicators" },
      { name: "Revenue per Employee", formula: "Revenue \u00f7 Average Number of Employees", interpretation: "Productivity measure. Material changes warrant investigation.", benchmark: "Industry-specific", auditRelevance: "Significant increase without explanation may indicate fictitious revenue" }
    ],
    gearing: [
      { name: "Debt-to-Equity Ratio", formula: "Total Debt \u00f7 Total Equity", interpretation: "Measures financial leverage. Higher ratio = more debt-funded. Very high may indicate financial risk.", benchmark: "Industry-specific; typically 0.5-2.0", goingConcernRelevance: "Very high gearing increases insolvency risk" },
      { name: "Interest Cover", formula: "Operating Profit \u00f7 Finance Costs", interpretation: "Ability to service debt. Below 1.5x is generally concerning.", benchmark: "> 3.0x comfortable; < 1.5x is warning", goingConcernRelevance: "Below 1.0x means profits do not cover interest — critical indicator" },
      { name: "Net Debt / EBITDA", formula: "(Total Borrowings \u2212 Cash) \u00f7 EBITDA", interpretation: "Leverage relative to cash generation. Often used in debt covenants.", benchmark: "Typically < 3.0x; covenant-specific", goingConcernRelevance: "Breach of covenant triggers going concern assessment" },
      { name: "Gearing Ratio", formula: "Total Debt \u00f7 (Total Debt + Equity) \u00d7 100", interpretation: "Proportion of finance from debt. Above 50% is considered highly geared.", benchmark: "Industry-specific; typically 25-50%", goingConcernRelevance: "High and increasing gearing is a going concern indicator" }
    ]
  },
  substantiveAnalytical: {
    isa: "ISA 520.5",
    requirements: [
      "Determine the suitability of particular substantive analytical procedures for given assertions",
      "Evaluate the reliability of data from which the auditor's expectation is developed",
      "Develop an expectation of recorded amounts or ratios and evaluate whether the expectation is sufficiently precise",
      "Determine the amount of any difference from the expected value that is acceptable without further investigation (threshold)"
    ],
    examples: [
      { procedure: "Payroll proof-in-total", calculation: "Average headcount \u00d7 average salary \u00d7 months = expected payroll cost", threshold: "5% of expected value or PM, whichever is lower", assertion: "Completeness; Accuracy" },
      { procedure: "Depreciation analytical", calculation: "Opening NBV \u00d7 weighted average depreciation rate = expected depreciation charge", threshold: "5% of expected or PM", assertion: "Accuracy; Valuation" },
      { procedure: "Rent expense proof", calculation: "Number of properties \u00d7 monthly rent \u00d7 months occupied", threshold: "Exact match expected; investigate any variance", assertion: "Completeness; Accuracy" },
      { procedure: "Interest expense proof", calculation: "Average loan balance \u00d7 interest rate \u00d7 period", threshold: "Within \u00a31,000 or 2% of expected", assertion: "Accuracy; Completeness" }
    ]
  },
  finalAnalytical: {
    isa: "ISA 520.6",
    requirement: "The auditor shall design and perform analytical procedures near the end of the audit that assist the auditor when forming an overall conclusion as to whether the financial statements are consistent with the auditor's understanding of the entity.",
    considerations: [
      "Review the overall financial statements for consistency with the auditor's knowledge of the business",
      "Compare key ratios and trends to prior year and industry data",
      "Consider whether previously unrecognised risks of material misstatement exist",
      "Evaluate whether the financial statements reflect the auditor's understanding of events during the year",
      "If new risks are identified, reconsider the sufficiency of procedures performed"
    ]
  }
};


// ---------------------------------------------------------------------------
// 13. ISA_550_RELATED_PARTIES  (ISA 550)
// ---------------------------------------------------------------------------

export const ISA_550_RELATED_PARTIES = {
  title: "ISA 550 — Related Parties",
  isa: "ISA 550",
  overview: "The auditor shall perform audit procedures to identify, assess and respond to the risks of material misstatement arising from related party relationships and transactions.",
  identificationSources: [
    "Management representations and declarations of interest",
    "Companies House — directorship and PSC searches for all directors and shareholders",
    "Annual return / confirmation statement — shareholdings",
    "Board minutes — director interests disclosed",
    "Bank confirmation letters — related party guarantees",
    "Accounting records — recurring transactions with same counterparties",
    "Prior year working papers — previously identified related parties",
    "Tax returns and computations — connected persons",
    "Legal correspondence — related party contracts",
    "Industry knowledge — known group structures"
  ],
  redFlags: [
    "Transactions at significantly above or below market terms",
    "Complex transactions with no apparent business rationale",
    "Transactions with entities that have no substance or employees",
    "Transactions completed close to year end with unusual terms",
    "Loans to directors or shareholders on interest-free terms",
    "Sales to or purchases from entities controlled by management",
    "Guarantees given for related party obligations without board approval",
    "Transfers of assets at non-market values",
    "Previously undisclosed related party relationships identified during audit",
    "Management reluctance to disclose related party information"
  ],
  disclosureRequirements: {
    frs102: {
      ref: "FRS 102 s33",
      required: [
        "Name of related party and nature of relationship",
        "Description of transactions and outstanding balances",
        "Amounts of transactions during the period",
        "Outstanding balances at the reporting date (including commitments)",
        "Provisions for doubtful debts related to outstanding balances",
        "Terms and conditions including whether they are secured and the nature of consideration to be provided in settlement",
        "Details of guarantees given or received"
      ],
      exemptions: [
        "Transactions between group entities that are eliminated on consolidation",
        "Transactions with entities that provide key management personnel services (disclose total, not individual amounts)",
        "s1A small entity exemption: only disclose directors' advances, credits, guarantees"
      ]
    },
    ias24: {
      ref: "IAS 24",
      required: [
        "Name of the parent and ultimate controlling party",
        "Key management personnel compensation (short-term benefits, post-employment, other long-term, termination, share-based)",
        "Nature of related party relationship",
        "Information about transactions and outstanding balances necessary for users to understand the potential effect",
        "Amounts of transactions, outstanding balances, terms and conditions, provisions for bad debts, expense recognised"
      ]
    }
  },
  auditProcedures: [
    { ref: "ISA 550.11", procedure: "Enquire of management about the identity of related parties, the nature of relationships, and whether any transactions occurred during the period" },
    { ref: "ISA 550.14", procedure: "Perform Companies House searches for all directors — cross-reference directorships and shareholdings" },
    { ref: "ISA 550.15", procedure: "Review board minutes for evidence of related party transactions or new relationships" },
    { ref: "ISA 550.17", procedure: "Be alert throughout the audit to arrangements or information that may indicate previously unidentified related party relationships or transactions" },
    { ref: "ISA 550.22", procedure: "For identified significant transactions outside normal business, evaluate whether the business rationale suggests the transaction may have been entered into for fraudulent financial reporting or to conceal misappropriation" },
    { ref: "ISA 550.25", procedure: "Obtain sufficient appropriate evidence that related party transactions have been appropriately accounted for and disclosed" },
    { ref: "ISA 550.26", procedure: "Obtain written representations from management that they have disclosed all known related party relationships and transactions" }
  ]
};


// ---------------------------------------------------------------------------
// 14. ISA_560_SUBSEQUENT_EVENTS  (ISA 560)
// ---------------------------------------------------------------------------

export const ISA_560_SUBSEQUENT_EVENTS = {
  title: "ISA 560 — Subsequent Events",
  isa: "ISA 560",
  overview: "The auditor shall perform audit procedures designed to obtain sufficient appropriate audit evidence that all events occurring between the date of the financial statements and the date of the auditor's report that require adjustment of, or disclosure in, the financial statements have been identified.",
  classification: [
    {
      type: "Type 1 — Adjusting Events",
      isa: "ISA 560.8; FRS 102 s32.4; IAS 10.3",
      definition: "Events that provide evidence of conditions that existed at the reporting date.",
      examples: [
        "Settlement of a court case that confirms the entity had a present obligation at the reporting date",
        "Bankruptcy of a customer with a receivable balance at year end — confirms impairment existed",
        "Sale of inventory after the reporting date at below carrying value — confirms NRV issue at year end",
        "Determination after the reporting date of the cost of assets purchased or proceeds of assets sold before year end",
        "Discovery of fraud or error that shows the financial statements are incorrect",
        "Subsequent receipts/payments that clarify amounts receivable/payable at year end"
      ],
      accountingTreatment: "Adjust the amounts recognised in the financial statements to reflect the adjusting event."
    },
    {
      type: "Type 2 — Non-Adjusting Events",
      isa: "ISA 560.10; FRS 102 s32.5-10; IAS 10.10",
      definition: "Events that are indicative of conditions that arose after the reporting date.",
      examples: [
        "Decline in market value of investments between reporting date and date accounts are signed",
        "Major business combination or disposal of a subsidiary after the reporting date",
        "Announcement of a plan to discontinue an operation",
        "Major purchases or disposals of assets",
        "Destruction of a major production plant by fire or flood after year end",
        "Announcement or commencement of a major restructuring",
        "Abnormally large changes in asset prices or foreign exchange rates after the reporting date",
        "Changes in tax rates or laws enacted after the reporting date that affect current or deferred tax",
        "Entering into significant commitments or contingent liabilities (e.g., major guarantees)"
      ],
      accountingTreatment: "Do not adjust the financial statements. If material, disclose the nature of the event and an estimate of its financial effect (or state that no estimate can be made)."
    }
  ],
  specialCase: {
    title: "Going Concern Events After Reporting Date",
    isa: "ISA 560.A9; FRS 102 s32.7A; IAS 10.14-16",
    guidance: "If, after the reporting date, management determines that it intends to liquidate the entity or cease trading, or that it has no realistic alternative but to do so, the financial statements shall NOT be prepared on a going concern basis. This is an adjusting event that requires a fundamental change to the basis of preparation."
  },
  auditProcedures: [
    { period: "Between year end and audit report date", isa: "ISA 560.7", procedures: [
      "Obtain and review management's procedures for identifying subsequent events",
      "Read minutes of meetings held after the reporting date (board, shareholders, audit committee)",
      "Read the entity's latest interim financial information (management accounts, budgets, cash flow forecasts)",
      "Enquire of management whether any subsequent events have occurred that might affect the financial statements",
      "Enquire about the current status of items accounted for on the basis of preliminary data",
      "Enquire about new commitments, borrowings, or guarantees entered into",
      "Enquire about sales or acquisitions of assets after year end",
      "Enquire about increases in capital or issuance of new debt instruments",
      "Enquire about developments regarding contingencies and provisions",
      "Read correspondence from legal counsel regarding litigation",
      "Review post year-end bank statements and cash position"
    ]},
    { period: "Facts discovered after the audit report date (before FS issued)", isa: "ISA 560.10-13", procedures: [
      "Discuss the matter with management and TCWG",
      "Determine whether the financial statements need amendment",
      "If amendment is needed, enquire how management intends to address the matter",
      "If management amends, perform necessary procedures on the amendment and issue new auditor's report"
    ]},
    { period: "Facts discovered after the FS have been issued", isa: "ISA 560.14-17", procedures: [
      "Discuss the matter with management and TCWG",
      "Determine whether the financial statements need revision",
      "If management revises, perform procedures on the revision and issue new auditor's report",
      "If management does not take necessary action, take appropriate action to prevent reliance on the auditor's report (notify TCWG, consider legal obligations)"
    ]}
  ]
};


// ---------------------------------------------------------------------------
// 15. ISA_620_EXPERTS  (ISA 620)
// ---------------------------------------------------------------------------

export const ISA_620_EXPERTS = {
  title: "ISA 620 — Using the Work of an Auditor's Expert",
  isa: "ISA 620",
  overview: "When expertise in a field other than accounting or auditing is necessary to obtain sufficient appropriate audit evidence, the auditor shall determine whether to use the work of an auditor's expert.",
  commonAreas: [
    { area: "Property valuations", expert: "RICS Chartered Surveyor", isa: "ISA 540; IAS 40/FRS 102 s16", when: "Investment property at fair value, land and buildings revaluation, impairment assessment" },
    { area: "Actuarial calculations", expert: "Qualified Actuary (IFoA/FIA)", isa: "ISA 540; IAS 19/FRS 102 s28", when: "Defined benefit pension obligations, insurance reserves (IBNR)" },
    { area: "Financial instrument valuation", expert: "Valuation specialist", isa: "ISA 540; IFRS 13/IFRS 9", when: "Level 2/3 fair value measurements, complex derivatives, ECL modelling" },
    { area: "Tax matters", expert: "Tax specialist (CTA)", isa: "ISA 620; ISA 540", when: "Complex tax provisions, R&D tax credits, transfer pricing, international tax" },
    { area: "IT systems", expert: "IT auditor / cybersecurity specialist", isa: "ISA 315", when: "Complex IT environments, IT general controls, cybersecurity risk assessment" },
    { area: "Legal interpretation", expert: "Solicitor / barrister", isa: "ISA 501.9", when: "Litigation provisions, regulatory compliance, contract interpretation" },
    { area: "Environmental / contamination", expert: "Environmental consultant", isa: "ISA 540; IAS 37/FRS 102 s21", when: "Decommissioning provisions, contaminated land remediation, environmental liabilities" },
    { area: "Inventory specialist", expert: "Industry specialist", isa: "ISA 501", when: "Precious metals, diamonds, art, wine, other specialist inventory requiring expertise to value" }
  ],
  competenceAssessment: {
    isa: "ISA 620.9",
    criteria: [
      {
        factor: "Professional qualification and accreditation",
        evidence: "Membership of relevant professional body (RICS, IFoA, CTA, CIMA, etc.)",
        questions: ["What professional qualifications does the expert hold?", "Is the expert subject to professional standards and ethics requirements?", "Is the expert's registration or licence current?"]
      },
      {
        factor: "Experience and reputation",
        evidence: "Track record in the specific field, peer recognition, publications",
        questions: ["How many years of experience does the expert have in this specific area?", "Has the expert worked on similar engagements?", "What is the expert's reputation among peers?"]
      },
      {
        factor: "Objectivity and independence",
        evidence: "No financial interest in the entity, no personal relationships with management",
        questions: ["Does the expert have any financial interest in the entity?", "Is the expert employed by or connected to the entity?", "Are there any other circumstances that might impair objectivity?"]
      },
      {
        factor: "Adequacy of the expert's work",
        evidence: "Methodology, assumptions, data sources, conclusions",
        questions: ["Are the sources of data used appropriate and reliable?", "Are the assumptions reasonable and consistent with the auditor's understanding?", "Is the methodology appropriate for the purpose?", "Are the conclusions consistent with the data and analysis?"]
      }
    ]
  },
  usingExpertWork: {
    isa: "ISA 620.12-13",
    steps: [
      "Agree the nature, scope, and objectives of the expert's work",
      "Agree the respective roles and responsibilities of the auditor and the expert",
      "Agree the nature, timing, and extent of communication between the auditor and the expert",
      "Evaluate the adequacy of the expert's work for the auditor's purposes",
      "Evaluate the relevance and reasonableness of the expert's findings or conclusions",
      "Evaluate the relevance and reasonableness of assumptions and methods used",
      "Consider the significance of the expert's work in relation to the audit",
      "If the expert's work is not adequate, agree additional procedures with the expert or perform additional audit procedures"
    ],
    importantNote: "The auditor has sole responsibility for the audit opinion expressed. That responsibility is not reduced by the auditor's use of the work of an expert (ISA 620.3)."
  }
};
