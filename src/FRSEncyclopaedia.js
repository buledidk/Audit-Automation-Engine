// =============================================================================
// FRS Encyclopaedia - Comprehensive UK Financial Reporting Standards Data
// Source: Financial Reporting Council (FRC)
// Last Verified: 2026-03-12
// =============================================================================

// =============================================================================
// FRS 102 - THE FINANCIAL REPORTING STANDARD APPLICABLE IN THE UK AND ROI
// All 35 Sections - Expanded with paragraph refs, recognition criteria,
// measurement rules, disclosure detail, and 2026 periodic review changes
// =============================================================================

export const FRS_102_SECTIONS = [
  // -------------------------------------------------------------------------
  // SECTION 1: Small Entities
  // -------------------------------------------------------------------------
  {
    section: 1,
    title: "Small Entities",
    scope: "Applies to entities that qualify as small under UK company law or equivalent. Sets out the scope of FRS 102 and the small entities regime.",
    keyRequirements: [
      "Entity must meet the definition of a small entity under applicable legislation",
      "Small entities may apply reduced disclosure requirements throughout FRS 102",
      "Small entities need not present a cash flow statement",
      "Small entities are exempt from certain disclosures including key management personnel compensation"
    ],
    disclosures: [
      "Disclosure of basis of preparation",
      "Statement that small entities regime has been applied",
      "Disclosure of any departures from FRS 102"
    ],
    auditConsiderations: "Auditor must verify that the entity genuinely qualifies as small under applicable legislation and that reduced disclosures applied are permissible under Section 1A of FRS 102. Consider whether the small company audit exemption applies.",
    paragraphRefs: [
      "1.1 - Scope of Section 1A small entities regime",
      "1.2 - Definition of small entity by reference to Companies Act 2006 s382-384",
      "1.3 - Entities excluded from small entities regime (public companies, authorised insurance companies, banking companies)",
      "1.4 - Small entity choosing to apply full FRS 102",
      "1.5 - Presentation requirements for Section 1A",
      "1.6 - Encouraged additional disclosures",
      "1.7 - True and fair override remains available to small entities",
      "1A.1-1A.22 - Detailed Section 1A requirements for small entities"
    ],
    recognitionCriteria: [
      "Entity must meet at least two of three size thresholds for two consecutive years to qualify as small",
      "Turnover not more than £15 million (as amended April 2025)",
      "Balance sheet total not more than £7.5 million (as amended April 2025)",
      "Average number of employees not more than 50",
      "Must not be an excluded entity under Companies Act 2006 s384"
    ],
    measurementRules: [
      "Small entities follow the same measurement rules as full FRS 102 unless specific simplifications apply",
      "No separate measurement regime; the simplifications are disclosure-based",
      "Section 1A permits abridged balance sheet and profit and loss formats under Companies Act 2006",
      "Directors may choose to prepare accounts using the micro-entity provisions instead if eligible"
    ],
    disclosureRequirementsDetail: [
      "1A.16 - Minimum disclosures required: accounting policies, guarantees and commitments, related party advances and credits to directors, financial commitments and contingencies",
      "1A.17 - Encouraged disclosures: turnover analysis, average employees, tax on profit, dividends paid and proposed",
      "1A.18 - Abridged balance sheet permitted combining items preceded by Arabic numbers",
      "1A.19 - Abridged profit and loss account permitted starting with gross profit",
      "1A.20 - Filing exemptions: small entities need not file profit and loss account or directors' report at Companies House"
    ],
    periodicReview2026Changes: [
      "2024/25 amendments updated the small company thresholds upward (turnover £15m, balance sheet £7.5m) effective for periods beginning on or after 6 April 2025",
      "Clarification that digital reporting (iXBRL tagging) obligations do not change small entity status",
      "Enhanced guidance on voluntary adoption of additional disclosures beyond Section 1A minimums",
      "Alignment of Section 1A with revised SI 2008/410 Schedule 1 formats"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 2: Concepts and Pervasive Principles
  // -------------------------------------------------------------------------
  {
    section: 2,
    title: "Concepts and Pervasive Principles",
    scope: "Sets out the concepts and pervasive principles underlying the preparation of financial statements under FRS 102.",
    keyRequirements: [
      "Financial statements must give a true and fair view",
      "Apply the accruals basis of accounting",
      "Apply the going concern assumption unless management intends to liquidate or cease trading",
      "Recognise assets, liabilities, income and expenses using the definitions and recognition criteria",
      "Use measurement bases of historical cost, fair value and other bases as required by specific sections"
    ],
    disclosures: [
      "Disclosure of material departures from FRS 102 required for true and fair view",
      "Description of measurement bases used"
    ],
    auditConsiderations: "Auditor must assess whether the financial statements have been prepared on appropriate bases and whether the true and fair view is achieved. Key starting point for all audit procedures.",
    paragraphRefs: [
      "2.1 - Scope of Section 2",
      "2.2 - Objective of financial statements of small entities",
      "2.3 - Qualitative characteristics: understandability, relevance, materiality, reliability",
      "2.4 - Substance over form",
      "2.5 - Prudence",
      "2.6 - Completeness",
      "2.7 - Comparability",
      "2.8 - Timeliness",
      "2.9 - Balance between benefit and cost",
      "2.10-2.14 - Financial position: assets, liabilities, equity definitions",
      "2.15-2.19 - Performance: income and expense definitions",
      "2.20-2.22 - Recognition criteria for assets and liabilities",
      "2.23-2.26 - Measurement: historical cost, fair value",
      "2.27-2.32 - Pervasive recognition and measurement principles",
      "2.33-2.36 - Accrual basis and offsetting"
    ],
    recognitionCriteria: [
      "An asset is recognised when it is probable that future economic benefits will flow to the entity and the asset has a cost or value that can be measured reliably",
      "A liability is recognised when it is probable that an outflow of resources will be required and the amount can be measured reliably",
      "Income is recognised when an increase in future economic benefits related to an asset increase or liability decrease has arisen and can be measured reliably",
      "An expense is recognised when a decrease in future economic benefits related to an asset decrease or liability increase has arisen and can be measured reliably"
    ],
    measurementRules: [
      "Historical cost: the amount of cash or cash equivalents paid, or the fair value of the consideration given at the time of acquisition",
      "Fair value: the amount for which an asset could be exchanged or a liability settled between knowledgeable, willing parties in an arm's length transaction",
      "Present value: a current estimate of the present discounted value of future net cash flows in the normal course of business",
      "Amortised cost: the amount at which a financial asset or liability is measured at initial recognition minus principal repayments, plus or minus cumulative amortisation"
    ],
    disclosureRequirementsDetail: [
      "Disclosure of measurement bases used in preparing the financial statements",
      "Disclosure of any departure from FRS 102 invoked under the true and fair override",
      "Disclosure of the nature and financial effect of any true and fair override departure"
    ],
    periodicReview2026Changes: [
      "Enhanced guidance on the application of materiality in FRED 82 / amendments effective 2026",
      "Clarification of the interaction between prudence and neutrality following IASB Conceptual Framework developments",
      "Additional guidance on digital-first financial reporting and the qualitative characteristic of understandability in electronic formats"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 3: Financial Statement Presentation
  // -------------------------------------------------------------------------
  {
    section: 3,
    title: "Financial Statement Presentation",
    scope: "Sets out general requirements for the presentation of financial statements including comparatives and the complete set of financial statements.",
    keyRequirements: [
      "Present a complete set of financial statements at least annually",
      "Present comparative information for the preceding period",
      "Clearly identify each financial statement and distinguish from other information",
      "Apply consistent presentation from one period to the next",
      "Disclose when financial statements do not cover a twelve month period"
    ],
    disclosures: [
      "Name of entity and any change in name",
      "Whether financial statements cover an individual entity or group",
      "Reporting period end date",
      "Presentation currency"
    ],
    auditConsiderations: "Auditor checks presentation and comparative information for completeness and consistency. Review identification requirements to ensure financial statements are clearly labelled.",
    paragraphRefs: [
      "3.1 - Scope",
      "3.2 - Fair presentation and true and fair view",
      "3.3 - Complete set of financial statements",
      "3.4 - Statement of financial position",
      "3.5 - Statement of comprehensive income (or income statement and separate statement of comprehensive income)",
      "3.6 - Statement of changes in equity",
      "3.7 - Statement of cash flows",
      "3.8 - Notes to the financial statements",
      "3.9-3.12 - Identification requirements",
      "3.13-3.14 - Comparative information requirements",
      "3.15-3.17 - Frequency of reporting and consistency"
    ],
    recognitionCriteria: [
      "A complete set of financial statements must include: statement of financial position, statement of comprehensive income (single or two-statement approach), statement of changes in equity, statement of cash flows, and notes",
      "Small entities may omit cash flow statement and certain primary statements"
    ],
    measurementRules: [
      "Section 3 deals with presentation, not measurement; measurement rules are contained in relevant individual sections",
      "Presentation currency must be disclosed and consistently applied"
    ],
    disclosureRequirementsDetail: [
      "3.9 - Name of reporting entity or any change since previous reporting period",
      "3.10 - Whether statements cover individual entity or group",
      "3.11 - Date of end of reporting period and period covered",
      "3.12 - Presentation currency as defined in Section 30",
      "3.13 - Level of rounding used in financial statements",
      "3.14 - Comparative information for all amounts reported in current period financial statements"
    ],
    periodicReview2026Changes: [
      "Guidance updated to accommodate software-tagged (iXBRL) financial statements for Companies House filing",
      "Clarification on presentation of alternative performance measures alongside FRS 102 line items",
      "Amendments to reflect updated Companies Act 2006 SI 2008/410 (as amended) balance sheet and profit and loss formats"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 4: Statement of Financial Position
  // -------------------------------------------------------------------------
  {
    section: 4,
    title: "Statement of Financial Position",
    scope: "Sets out requirements for the presentation of the statement of financial position (balance sheet), including minimum line items.",
    keyRequirements: [
      "Present a statement of financial position at the reporting date",
      "Include minimum line items specified in the section",
      "Classify assets and liabilities as current or non-current unless liquidity presentation is more relevant",
      "Present additional line items when relevant to understanding of financial position",
      "Separate deferred tax assets and liabilities from current tax"
    ],
    disclosures: [
      "Description of each class of share capital including rights, restrictions and preferences",
      "Retained earnings and other components of equity",
      "Analysis of financial liabilities between current and non-current"
    ],
    auditConsiderations: "Auditor verifies completeness of balance sheet line items, appropriate classification of assets and liabilities as current or non-current, and accuracy of all amounts presented.",
    paragraphRefs: [
      "4.1 - Scope",
      "4.2 - Minimum line items on the face of the statement of financial position",
      "4.3 - Additional line items, headings and subtotals",
      "4.4-4.6 - Current/non-current distinction",
      "4.7 - Current assets definition",
      "4.8 - Current liabilities definition",
      "4.9-4.11 - Ordering and format of statement of financial position",
      "4.12 - Information to be presented on the face or in the notes"
    ],
    recognitionCriteria: [
      "An asset is current if expected to be realised, sold or consumed within 12 months, held primarily for trading, is cash or cash equivalent, or is unrestricted",
      "A liability is current if expected to be settled within 12 months, held primarily for trading, or the entity does not have an unconditional right to defer settlement beyond 12 months"
    ],
    measurementRules: [
      "Section 4 prescribes presentation, not measurement; each asset and liability is measured according to the relevant FRS 102 section",
      "Companies Act formats (SI 2008/410) require specific ordering of balance sheet items for UK companies"
    ],
    disclosureRequirementsDetail: [
      "4.12(a) - Property, plant and equipment showing classes",
      "4.12(b) - Investment property at fair value through profit or loss",
      "4.12(c) - Intangible assets showing classes",
      "4.12(d) - Financial assets by category",
      "4.12(e) - Investments accounted for using equity method",
      "4.12(f) - Biological assets at cost less accumulated depreciation and at fair value",
      "4.12(g) - Inventories by subcategory",
      "4.12(h) - Trade and other receivables",
      "4.12(i) - Cash and cash equivalents",
      "4.12(j) - Trade and other payables",
      "4.12(k) - Provisions",
      "4.12(l) - Classes of equity"
    ],
    periodicReview2026Changes: [
      "Updated minimum line items to align with 2024 amendments to SI 2008/410",
      "New guidance on presentation of right-of-use assets for entities voluntarily adopting lease capitalisation",
      "Clarification on classification of revolving credit facilities as current or non-current"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 5: Statement of Comprehensive Income and Income Statement
  // -------------------------------------------------------------------------
  {
    section: 5,
    title: "Statement of Comprehensive Income and Income Statement",
    scope: "Sets out requirements for presenting income and expenses in a statement of comprehensive income or two separate statements.",
    keyRequirements: [
      "Present total comprehensive income for the period",
      "Present either a single statement of comprehensive income or two statements",
      "Include minimum line items in the income statement",
      "Present items of other comprehensive income separately",
      "Disclose items of income or expense that are material"
    ],
    disclosures: [
      "Analysis of expenses by either nature or function",
      "Amount of dividends recognised during the period",
      "Items of other comprehensive income grouped by those that will and will not be reclassified"
    ],
    auditConsiderations: "Auditor verifies completeness and accuracy of income and expense recognition, appropriate classification of items between profit or loss and other comprehensive income.",
    paragraphRefs: [
      "5.1 - Scope",
      "5.2 - Single statement or two-statement approach",
      "5.3 - Single statement of comprehensive income approach",
      "5.4 - Two-statement approach: income statement",
      "5.5 - Two-statement approach: statement of comprehensive income",
      "5.6 - Minimum line items on the face of the income statement",
      "5.7 - Additional line items, headings and subtotals",
      "5.8-5.9 - Analysis of expenses by nature or function",
      "5.10 - Items of other comprehensive income",
      "5.11 - Material items disclosed separately"
    ],
    recognitionCriteria: [
      "Revenue recognised when risks and rewards transfer and amount can be measured reliably (per Section 23)",
      "Expenses recognised when a decrease in future economic benefits has arisen that can be measured reliably",
      "Items of OCI include gains/losses on revaluation (Section 17), actuarial gains/losses on defined benefit plans (Section 28), exchange differences on translation of foreign operations (Section 30), and effective portion of hedging gains/losses (Section 12)"
    ],
    measurementRules: [
      "Income and expenses measured according to relevant individual sections",
      "Analysis of expenses by nature (raw materials, staff costs, depreciation, etc.) or by function (cost of sales, distribution, administrative)",
      "Companies Act formats require specific profit and loss account formats under SI 2008/410"
    ],
    disclosureRequirementsDetail: [
      "5.6 - Revenue, finance costs, share of profit/loss of associates and JVs, tax expense, profit or loss, each component of OCI, total comprehensive income",
      "5.7a - Material items of income or expense disclosed separately",
      "5.8 - If analysis by function, additional disclosure of depreciation, amortisation and employee benefits expense",
      "5.9 - Dividends recognised as distributions during the period"
    ],
    periodicReview2026Changes: [
      "Amendments to clarify the presentation of government grants income in profit or loss",
      "New guidance on disaggregation of revenue in the income statement to improve comparability",
      "Alignment with updated Companies Act profit and loss account formats"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 6: Statement of Changes in Equity
  // -------------------------------------------------------------------------
  {
    section: 6,
    title: "Statement of Changes in Equity and Statement of Income and Retained Earnings",
    scope: "Sets out requirements for presenting changes in equity during the reporting period.",
    keyRequirements: [
      "Present a statement of changes in equity showing reconciliation of each component",
      "Small entities may present a statement of income and retained earnings as a simplified alternative",
      "Show total comprehensive income for the period",
      "Show transactions with owners in their capacity as owners",
      "Show dividends and distributions to owners"
    ],
    disclosures: [
      "Dividends declared or paid per share",
      "Effects of changes in accounting policies",
      "Corrections of prior period errors"
    ],
    auditConsiderations: "Auditor traces movements in equity to supporting documentation, verifies dividends are properly authorised and from distributable profits, checks accounting policy changes are correctly applied.",
    paragraphRefs: [
      "6.1 - Scope",
      "6.2 - Statement of changes in equity content requirements",
      "6.3 - Reconciliation of each component of equity",
      "6.4 - Simplified statement of income and retained earnings",
      "6.5 - Conditions for using the simplified statement"
    ],
    recognitionCriteria: [
      "Changes in equity arise from: total comprehensive income, transactions with owners (share issues, buybacks, dividends), changes in accounting policies, and corrections of prior period errors",
      "Dividends recognised as a liability only when declared (not proposed) per Section 32"
    ],
    measurementRules: [
      "Equity movements measured at the amounts of the underlying transactions",
      "Share issues measured at proceeds received",
      "Treasury shares measured at cost and deducted from equity",
      "Prior period adjustments measured using the restated amounts under the corrected policy"
    ],
    disclosureRequirementsDetail: [
      "6.2(a) - Total comprehensive income for the period, showing separately total amounts attributable to owners and non-controlling interests",
      "6.2(b) - Effects of retrospective application or restatement for each component of equity",
      "6.2(c) - Reconciliation of carrying amount at beginning and end of period for each component of equity, showing separately changes from profit or loss, OCI, and transactions with owners"
    ],
    periodicReview2026Changes: [
      "Clarification on presentation of distributable profits information following the 2025 ICAEW Tech Release on realised profits",
      "New example illustrating interaction with Companies Act 2006 distributable profits requirements"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 7: Statement of Cash Flows
  // -------------------------------------------------------------------------
  {
    section: 7,
    title: "Statement of Cash Flows",
    scope: "Sets out requirements for the presentation of a statement of cash flows showing the entity's ability to generate cash and cash equivalents.",
    keyRequirements: [
      "Present cash flows from operating, investing and financing activities",
      "Use direct or indirect method for operating activities (indirect method most common)",
      "Include cash flows relating to taxes separately unless specifically allocated to an activity",
      "Disclose components of cash and cash equivalents",
      "Reconcile closing cash and cash equivalents to the balance sheet"
    ],
    disclosures: [
      "Components of cash and cash equivalents",
      "Significant non-cash transactions",
      "Undrawn borrowing facilities"
    ],
    auditConsiderations: "Auditor agrees cash flow statement to underlying accounting records, tests classification of cash flows between activities, verifies reconciliation of cash and cash equivalents to balance sheet.",
    paragraphRefs: [
      "7.1 - Scope",
      "7.2 - Exemption for small entities from presenting a cash flow statement",
      "7.3 - Cash equivalents definition",
      "7.4-7.6 - Operating activities",
      "7.7-7.8 - Investing activities",
      "7.9-7.10 - Financing activities",
      "7.11 - Interest and dividends classification",
      "7.12 - Tax cash flows",
      "7.13-7.14 - Foreign currency cash flows",
      "7.15 - Non-cash transactions",
      "7.16 - Components of cash and cash equivalents",
      "7.17-7.18 - Other disclosures"
    ],
    recognitionCriteria: [
      "Cash comprises cash on hand and demand deposits",
      "Cash equivalents are short-term highly liquid investments readily convertible to known amounts of cash and subject to insignificant risk of changes in value",
      "Bank overdrafts repayable on demand that form an integral part of cash management may be included in cash and cash equivalents"
    ],
    measurementRules: [
      "Cash flows reported gross, except for items with quick turnover, large amounts and short maturities which may be reported net",
      "Foreign currency cash flows translated at the exchange rate at the date of the cash flow",
      "Unrealised gains and losses on exchange rate changes are not cash flows but reported separately to reconcile opening and closing cash"
    ],
    disclosureRequirementsDetail: [
      "7.15 - Significant non-cash investing and financing transactions (e.g. acquisition by finance lease, conversion of debt to equity)",
      "7.16 - Components of cash and cash equivalents with reconciliation to balance sheet",
      "7.17 - Cash and cash equivalent balances held by the entity that are not available for use",
      "7.18 - Additional encouraged disclosures: undrawn borrowing facilities, aggregate cash flows from acquisitions/disposals of subsidiaries"
    ],
    periodicReview2026Changes: [
      "New illustrative example of indirect method cash flow statement for SMEs",
      "Clarification on treatment of HMRC time-to-pay arrangements in operating vs financing activities",
      "Guidance on classification of lease payments under FRS 102 (operating lease payments as operating; finance lease capital repayments as financing)"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 8: Notes to the Financial Statements
  // -------------------------------------------------------------------------
  {
    section: 8,
    title: "Notes to the Financial Statements",
    scope: "Sets out general requirements for the notes to financial statements including structure and disclosure of accounting policies.",
    keyRequirements: [
      "Present information not presented in the primary statements",
      "Describe each significant accounting policy applied",
      "Disclose judgements made in applying accounting policies with most significant effect on amounts",
      "Disclose key sources of estimation uncertainty",
      "Provide information that enables users to evaluate financial position and performance"
    ],
    disclosures: [
      "Summary of significant accounting policies",
      "Judgements with most significant effect on financial statements",
      "Key assumptions and sources of estimation uncertainty",
      "Information enabling evaluation of objectives, policies and processes for managing capital"
    ],
    auditConsiderations: "Auditor reviews accounting policies for appropriateness and consistency, assesses whether all required disclosures are present, evaluates adequacy of disclosures about judgements and estimates.",
    paragraphRefs: [
      "8.1 - Scope",
      "8.2 - Structure of the notes",
      "8.3 - Cross-referencing from financial statements to notes",
      "8.4 - Disclosure of accounting policies",
      "8.5 - Significant accounting policies to disclose",
      "8.6 - Judgements in applying accounting policies",
      "8.7 - Key sources of estimation uncertainty",
      "8.8 - Capital management disclosures"
    ],
    recognitionCriteria: [
      "Notes must provide information about items recognised in the primary statements and conditions/events that affect their recognition",
      "Notes must include information required by FRS 102 that is not presented elsewhere in the financial statements",
      "Notes must provide additional information not presented in the primary statements but relevant to understanding them"
    ],
    measurementRules: [
      "Section 8 is a presentation section; measurement rules are in individual sections",
      "Accounting policies disclosed must describe the measurement basis (or bases) used",
      "Key sources of estimation uncertainty must describe the assumptions about the future and other major sources of estimation uncertainty that have a significant risk of causing a material adjustment within the next financial year"
    ],
    disclosureRequirementsDetail: [
      "8.2 - Notes normally presented in the following order: statement of compliance with FRS 102, summary of significant accounting policies, supporting information for items in primary statements (in order each statement and line item is presented), any other disclosures",
      "8.5 - Accounting policies must include measurement basis used, other policies relevant to understanding the financial statements",
      "8.6 - Judgements management has made that have the most significant effect on the amounts recognised",
      "8.7 - Information about key assumptions concerning the future and other key sources of estimation uncertainty at the reporting date"
    ],
    periodicReview2026Changes: [
      "Enhanced requirements for disclosure of climate-related judgements and estimates where material",
      "New guidance on disclosure of digital assets (cryptocurrency) accounting policies where applicable",
      "Requirement to disclose material accounting policy information rather than just significant accounting policies, aligning with IAS 1 amendments"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 9: Consolidated and Separate Financial Statements
  // -------------------------------------------------------------------------
  {
    section: 9,
    title: "Consolidated and Separate Financial Statements",
    scope: "Sets out requirements for presenting consolidated financial statements and separate financial statements of a parent.",
    keyRequirements: [
      "A parent must present consolidated financial statements unless exemptions apply",
      "Consolidate all subsidiaries including special purpose entities",
      "Use uniform accounting policies across the group",
      "Eliminate intragroup transactions and balances",
      "Account for non-controlling interests in equity separately from the parent's equity"
    ],
    disclosures: [
      "List of significant subsidiaries including name, country of incorporation and ownership interest",
      "Reason for not consolidating any entity that is a subsidiary",
      "Effect of any changes in ownership interest in subsidiaries"
    ],
    auditConsiderations: "Auditor assesses completeness of group structure, tests elimination of intragroup transactions, verifies uniform accounting policies, considers component auditor work.",
    paragraphRefs: [
      "9.1 - Scope",
      "9.2 - Requirement to prepare consolidated financial statements",
      "9.3 - Exemption from consolidation",
      "9.4-9.5 - Subsidiaries included in consolidation",
      "9.6-9.8 - Consolidation procedures",
      "9.9 - Uniform accounting policies",
      "9.10-9.12 - Acquisition and disposal of subsidiaries",
      "9.13-9.14 - Non-controlling interests",
      "9.15-9.17 - Combined financial statements",
      "9.18-9.19 - Disclosures",
      "9.20-9.24 - Separate financial statements",
      "9.25-9.26 - Investments in subsidiaries in separate financial statements"
    ],
    recognitionCriteria: [
      "A subsidiary is an entity controlled by the parent; control is the power to govern the financial and operating policies so as to obtain benefits",
      "Control is presumed when the parent holds more than half the voting power, unless it can be clearly demonstrated that such ownership does not constitute control",
      "Special purpose entities are consolidated when the substance of the relationship indicates control",
      "Non-controlling interests are measured at their proportionate share of the recognised net assets of the subsidiary"
    ],
    measurementRules: [
      "On acquisition, identifiable assets and liabilities of the subsidiary measured at fair value (Section 19)",
      "Goodwill recognised as the excess of cost of the business combination over the acquirer's share of fair values",
      "Intragroup balances, transactions, income and expenses eliminated in full",
      "Unrealised profits on intragroup transactions eliminated; unrealised losses eliminated unless the transaction provides evidence of impairment",
      "In separate financial statements, investments in subsidiaries measured at cost less impairment or at fair value through profit or loss"
    ],
    disclosureRequirementsDetail: [
      "9.18 - Fact that statements are consolidated; basis for concluding control exists where less than majority voting rights held",
      "9.19 - List of significant subsidiaries: name, country of incorporation/registration, proportion of ownership/voting power",
      "9.23 - In separate financial statements: fact that they are separate, description of methods used to account for investments in subsidiaries, associates and jointly controlled entities",
      "9.24 - Disclosure of dividends received from subsidiaries"
    ],
    periodicReview2026Changes: [
      "Updated exemption conditions for subsidiary companies from preparing consolidated accounts following Companies Act 2006 amendments",
      "New guidance on assessment of control over structured entities and variable interest entities",
      "Clarification on the treatment of crypto-asset holding subsidiaries within consolidation"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 10: Accounting Policies, Estimates and Errors
  // -------------------------------------------------------------------------
  {
    section: 10,
    title: "Accounting Policies, Estimates and Errors",
    scope: "Sets out criteria for selecting and changing accounting policies, accounting for changes in estimates, and corrections of prior period errors.",
    keyRequirements: [
      "Select and apply accounting policies consistently for similar transactions",
      "Change accounting policies only when required by FRS 102 or results in more reliable information",
      "Apply changes in accounting policies retrospectively unless impracticable",
      "Recognise the effect of changes in accounting estimates prospectively",
      "Correct material prior period errors retrospectively"
    ],
    disclosures: [
      "For changes in accounting policy: description, reason for change, amount of adjustment",
      "For changes in estimates: nature and amount of change where material",
      "For prior period errors: description of error, correction amounts, and effect on financial statements"
    ],
    auditConsiderations: "Auditor assesses whether changes in accounting policies are justified and applied correctly, evaluates whether estimates are reasonable, checks corrections of errors are material and appropriately restated.",
    paragraphRefs: [
      "10.1 - Scope",
      "10.2-10.6 - Selection and application of accounting policies",
      "10.7 - Hierarchy for selecting policies when FRS 102 does not specifically address a transaction",
      "10.8-10.9 - Consistency of accounting policies",
      "10.10-10.12 - Changes in accounting policies",
      "10.13-10.14 - Retrospective application",
      "10.15-10.17 - Changes in accounting estimates",
      "10.18-10.20 - Corrections of prior period errors",
      "10.21-10.23 - Disclosures"
    ],
    recognitionCriteria: [
      "A change in accounting policy is required when FRS 102 requires it or when the change results in financial statements providing reliable and more relevant information",
      "A change in accounting estimate results from new information or developments and is not a correction of an error",
      "A prior period error is an omission or misstatement arising from the failure to use, or misuse of, reliable information that was available and could reasonably be expected to have been obtained"
    ],
    measurementRules: [
      "Changes in accounting policies applied retrospectively as if the new policy had always been applied, adjusting opening balances of the earliest period presented",
      "If retrospective application is impracticable, apply prospectively from the earliest date practicable",
      "Changes in accounting estimates applied prospectively in the period of the change and future periods if affected",
      "Prior period errors corrected retrospectively by restating comparative amounts for the prior period in which the error occurred"
    ],
    disclosureRequirementsDetail: [
      "10.21 - For voluntary changes in accounting policy: nature of the change, reasons why applying the new policy provides reliable and more relevant information, amount of adjustment for each period presented, amount of adjustment relating to periods before those presented (to extent practicable)",
      "10.22 - For changes in accounting estimates: nature and amount of a change that has an effect in the current period or is expected to have an effect in future periods",
      "10.23 - For corrections of material prior period errors: nature of the error, amount of correction for each prior period presented, amount of correction at the beginning of the earliest prior period presented"
    ],
    periodicReview2026Changes: [
      "Alignment with IAS 8 amendments on the definition of accounting estimates vs accounting policies",
      "New examples illustrating the distinction between changes in estimates and changes in policies",
      "Guidance on accounting for changes arising from regulatory or tax law changes mid-period"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 11: Basic Financial Instruments
  // -------------------------------------------------------------------------
  {
    section: 11,
    title: "Basic Financial Instruments",
    scope: "Covers the recognition and measurement of basic financial instruments including cash, trade receivables, trade payables, loans and equity investments.",
    keyRequirements: [
      "Recognise financial assets and liabilities when the entity becomes party to the contractual provisions",
      "Initially measure at transaction price including transaction costs",
      "Subsequently measure debt instruments at amortised cost using the effective interest method",
      "Assess at each reporting date whether there is objective evidence of impairment",
      "Derecognise financial liabilities when extinguished"
    ],
    disclosures: [
      "Carrying amounts of each category of financial instrument",
      "Amount of impairment loss recognised",
      "Nature and extent of risks arising from financial instruments",
      "For loans: fair value where significantly different from carrying amount"
    ],
    auditConsiderations: "Auditor tests classification of financial instruments, verifies amortised cost calculations, assesses impairment indicators, confirms adequate disclosures about financial instrument risks.",
    paragraphRefs: [
      "11.1 - Scope and choice between Sections 11/12 or IFRS 9/IAS 39",
      "11.2-11.6 - Choosing the accounting policy",
      "11.7 - Definition of basic financial instruments",
      "11.8 - Conditions for classification as basic",
      "11.9-11.12 - Debt instruments qualifying as basic",
      "11.13 - Initial recognition",
      "11.14-11.15 - Initial measurement",
      "11.16-11.19 - Subsequent measurement",
      "11.20-11.22 - Amortised cost and effective interest method",
      "11.23-11.25 - Impairment",
      "11.26-11.28 - Derecognition",
      "11.29-11.32 - Fair value",
      "11.33-11.42 - Disclosures",
      "11.43-11.48 - Disclosure of risk"
    ],
    recognitionCriteria: [
      "A financial instrument is recognised when, and only when, the entity becomes a party to the contractual provisions of the instrument",
      "Basic financial instruments include: cash, demand and fixed-term deposits, trade receivables and payables, notes receivable and payable, loans to or from subsidiaries/associates, bonds and similar debt instruments, investments in non-convertible preference shares and non-puttable ordinary and preference shares",
      "A debt instrument is basic if returns to the holder are fixed, variable at a quoted or observable rate, or a combination, and there is no contractual provision that could result in the holder losing the principal"
    ],
    measurementRules: [
      "Initial measurement: transaction price (including transaction costs except for instruments measured at fair value through profit or loss)",
      "Financing transactions: present value of future payments discounted at a market rate for a similar debt instrument",
      "Subsequent measurement of debt instruments: amortised cost using the effective interest method",
      "Subsequent measurement of commitments to receive a loan: cost less impairment",
      "Investments in non-convertible and non-puttable shares quoted on a recognised exchange: fair value through profit or loss",
      "Other equity investments: fair value through profit or loss if fair value can be measured reliably; otherwise cost less impairment"
    ],
    disclosureRequirementsDetail: [
      "11.39 - Accounting policies for financial instruments",
      "11.40 - Carrying amounts of each category: financial assets at fair value through P&L, financial assets at amortised cost, financial liabilities at fair value through P&L, financial liabilities at amortised cost",
      "11.41 - Amount of impairment losses for each class of financial asset",
      "11.42 - For loans payable: breaches of terms, carrying amount at reporting date, whether remedied or renegotiated before authorisation date",
      "11.43-11.48 - Nature and extent of risks: credit risk (maximum exposure, collateral held, credit quality), liquidity risk (maturity analysis), market risk (sensitivity analysis)"
    ],
    periodicReview2026Changes: [
      "Updated guidance on expected credit loss considerations for entities choosing to apply the IFRS 9 impairment model under FRS 102",
      "New examples of basic vs non-basic financial instrument classification for common SME instruments",
      "Clarification on treatment of government-backed loans (e.g., CBILS/BBLS legacy instruments) and their classification"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // -------------------------------------------------------------------------
  // SECTION 12: Other Financial Instruments Issues
  // -------------------------------------------------------------------------
  {
    section: 12,
    title: "Other Financial Instruments Issues",
    scope: "Covers financial instruments that do not meet the definition of basic financial instruments under Section 11, including derivatives and complex instruments.",
    keyRequirements: [
      "Recognise complex financial instruments when the entity becomes party to the contract",
      "Measure at fair value through profit or loss",
      "Apply hedge accounting where permitted and documented appropriately",
      "Assess effectiveness of hedging relationships",
      "Derecognise when contractual rights expire or are transferred"
    ],
    disclosures: [
      "Fair value and methods used to determine fair value",
      "Sensitivity analysis for each type of market risk",
      "Description and fair value of hedging instruments",
      "Gains and losses on hedging instruments"
    ],
    auditConsiderations: "Auditor assesses valuation techniques for complex instruments, reviews hedge documentation and effectiveness testing, considers need for specialist input on complex valuations.",
    paragraphRefs: [
      "12.1 - Scope",
      "12.2 - Accounting policy choice between Sections 11/12 or IFRS 9/IAS 39",
      "12.3-12.6 - Scope: instruments covered by Section 12",
      "12.7 - Initial recognition and measurement",
      "12.8 - Subsequent measurement at fair value through profit or loss",
      "12.9 - Fair value determination",
      "12.10-12.14 - Hedge accounting",
      "12.15-12.19 - Fair value hedges",
      "12.20-12.22 - Cash flow hedges",
      "12.23-12.25 - Hedges of a net investment in a foreign operation",
      "12.26-12.29 - Disclosures"
    ],
    recognitionCriteria: [
      "Non-basic financial instruments include: debt instruments with variable returns linked to non-financial variables, derivatives (options, forwards, futures, swaps), instruments with conversion or early settlement features making them non-basic",
      "Hedge accounting is optional but if elected must meet strict documentation and effectiveness requirements",
      "A hedging relationship qualifies for hedge accounting only if: it is formally designated and documented, the hedge is expected to be highly effective, for cash flow hedges the forecasted transaction is highly probable"
    ],
    measurementRules: [
      "All financial instruments within Section 12 scope measured at fair value through profit or loss (except qualifying hedging instruments)",
      "Fair value determined using quoted market prices in an active market, or if not available, a valuation technique",
      "Fair value hedges: the gain or loss on the hedging instrument and on the hedged item attributable to the hedged risk are recognised in profit or loss",
      "Cash flow hedges: the portion of gain or loss on the hedging instrument determined to be an effective hedge is recognised in OCI; the ineffective portion in profit or loss",
      "Net investment hedges: the portion of gain or loss on the hedging instrument determined to be an effective hedge is recognised in OCI"
    ],
    disclosureRequirementsDetail: [
      "12.26 - Carrying amounts of financial instruments at fair value through profit or loss, distinguishing those designated from those classified as held for trading",
      "12.27 - For each type of hedge: description, carrying amount of instruments, nature of risks being hedged",
      "12.28 - For cash flow hedges: periods when cash flows are expected to occur and affect profit or loss, description of any forecast transaction for which hedge accounting was previously used but is no longer expected to occur",
      "12.29 - Fair value changes recognised in profit or loss and in OCI during the period"
    ],
    periodicReview2026Changes: [
      "Consideration of permitting simplified hedge accounting aligned with IFRS 9 hedge accounting model",
      "New guidance on fair value measurement of illiquid instruments in inactive markets",
      "Updated examples of derivative instruments commonly encountered by UK SMEs including interest rate swaps and forward foreign exchange contracts"
    ],
    source: "FRC",
    lastVerified: "2026-03-12"
  },

  // SECTION 13
  { section: 13, title: "Inventories", scope: "Covers the accounting for inventories including recognition, measurement and the cost of inventories.", keyRequirements: ["Measure inventories at the lower of cost and estimated selling price less costs to complete and sell","Include in cost all costs incurred to bring inventories to their present location and condition","Use FIFO or weighted average cost formula consistently","Write down inventories to NRV when NRV is below cost","Reverse write-downs when circumstances that led to write-down no longer exist"], disclosures: ["Accounting policies adopted for measuring inventories","Total carrying amount of inventories and carrying amount by classification","Amount recognised as expense during the period","Amount of any write-down and reversals"], auditConsiderations: "Auditor attends inventory count, tests cost calculations, assesses NRV based on subsequent selling prices, evaluates completeness of write-downs for slow-moving or obsolete stock.", paragraphRefs: ["13.1 - Scope","13.2 - Exclusions: work in progress under construction contracts, financial instruments, biological assets","13.3 - Definition of inventories","13.4 - Measurement at lower of cost and estimated selling price less costs to complete and sell","13.5-13.8 - Cost of inventories: purchase costs, conversion costs, other costs","13.9-13.12 - Cost allocation techniques and cost formulas (FIFO, weighted average)","13.13-13.14 - Impairment and NRV assessment","13.15-13.17 - Recognition as expense","13.18-13.22 - Disclosures"], recognitionCriteria: ["Inventories are assets held for sale in the ordinary course of business, in the process of production for such sale, or in the form of materials or supplies to be consumed in the production process or rendering of services","Cost includes purchase costs, conversion costs and other costs to bring inventories to present location and condition","Costs excluded: abnormal waste, storage costs (unless necessary), administrative overheads unrelated to production, selling costs"], measurementRules: ["Cost includes purchase price, import duties, non-recoverable taxes, transport, handling and other directly attributable costs; trade discounts and rebates deducted","Conversion costs include direct labour plus systematic allocation of fixed and variable production overheads based on normal capacity","Cost formulas: FIFO or weighted average cost; LIFO is prohibited","NRV is estimated selling price less estimated costs of completion and costs necessary to make the sale","Assess NRV on item-by-item basis, or by groups of similar items"], disclosureRequirementsDetail: ["13.18 - Accounting policies for measuring inventories including cost formula","13.19 - Total carrying amount and carrying amount in classifications appropriate to the entity","13.20 - Amount of inventories recognised as an expense during the period","13.21 - Impairment losses recognised or reversed","13.22 - Carrying amount of inventories pledged as security"], periodicReview2026Changes: ["New guidance on accounting for carbon credits held as inventory","Clarification on NRV assessment for long production cycle inventories","Updated examples of overhead allocation during abnormally low production"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 14
  { section: 14, title: "Investments in Associates", scope: "Covers accounting for investments in associates, including the equity method and cost/fair value alternatives.", keyRequirements: ["Apply the equity method to associates in consolidated financial statements","Recognise the investor's share of the associate's profit or loss","Assess for impairment at each reporting date","Discontinue equity method when the investment is reduced to zero","Apply cost or fair value model as permitted in certain circumstances"], disclosures: ["Fair value of investments in associates for which published price quotations exist","Summarised financial information of associates","Reasons for rebuttable presumption that significant influence does not exist"], auditConsiderations: "Auditor verifies equity method calculations, assesses whether significant influence exists, obtains financial information from associates to verify the entity's share of results.", paragraphRefs: ["14.1 - Scope","14.2 - Definition of associate and significant influence","14.3 - Presumption of significant influence at 20% or more voting power","14.4-14.7 - Equity method in consolidated statements and procedures","14.8 - Impairment","14.9 - Separate financial statements: cost, equity method or fair value through P&L","14.10-14.11 - Transactions between investor and associate","14.12-14.15 - Disclosures"], recognitionCriteria: ["An associate is an entity over which the investor has significant influence but not control or joint control","Significant influence is the power to participate in financial and operating policy decisions","Presumed at 20% or more voting power; rebutted when influence clearly cannot be demonstrated","Indicators: board representation, policy-making participation, material transactions, managerial interchange, essential technical information"], measurementRules: ["Equity method: initial at transaction price; subsequently adjusted for share of profit/loss, OCI and distributions","Goodwill included in carrying amount, not separately amortised, tested as part of whole investment impairment","If share of losses exceeds carrying amount, reduce to zero; discontinue unless obligations on associate's behalf","In separate financial statements: cost less impairment, equity method, or fair value through P&L"], disclosureRequirementsDetail: ["14.12 - Accounting policy","14.13 - Fair value where published price quotations exist","14.14 - Summarised aggregated information: total assets, total liabilities, revenue, profit or loss","14.15 - Nature and extent of significant restrictions on ability to transfer funds"], periodicReview2026Changes: ["Clarification on loss of significant influence and remeasurement of retained interest","New guidance when associate's reporting date differs from investor's","Updated examples of significant influence in modern corporate structures"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 15
  { section: 15, title: "Investments in Joint Ventures", scope: "Covers accounting for joint ventures including jointly controlled operations, assets and entities.", keyRequirements: ["Account for interests in joint ventures using the equity method or proportionate consolidation","Recognise assets controlled and liabilities and expenses incurred for jointly controlled assets","Recognise share of jointly controlled operations' income and expenses","Assess for impairment at each reporting date","Disclose commitments in relation to joint ventures"], disclosures: ["Aggregate amounts of assets, liabilities, income and expenses of joint ventures","Commitments relating to joint ventures","Contingent liabilities relating to joint ventures"], auditConsiderations: "Auditor reviews joint venture agreements, confirms accounting method is appropriate for the type of joint venture, verifies the entity's share of joint venture assets, liabilities and results.", paragraphRefs: ["15.1 - Scope","15.2 - Definition of joint venture and joint control","15.3-15.5 - Jointly controlled operations","15.6-15.8 - Jointly controlled assets","15.9-15.12 - Jointly controlled entities and equity method","15.13-15.14 - Transactions between venturer and JV","15.15-15.17 - Separate financial statements","15.18-15.21 - Disclosures"], recognitionCriteria: ["A joint venture is a contractual arrangement subject to joint control","Joint control requires unanimous consent for strategic financial and operating decisions","Three forms: jointly controlled operations, jointly controlled assets, jointly controlled entities"], measurementRules: ["JC operations: recognise assets, liabilities, expenses and share of income","JC assets: recognise share of assets, liabilities, income and expenses","JC entities (equity method): same as associates per Section 14","JC entities (proportionate consolidation): combine venturer's share line-by-line","Separate financial statements: cost, equity method or fair value through P&L"], disclosureRequirementsDetail: ["15.18 - Accounting policy for JCEs","15.19 - Aggregate amounts of assets, liabilities, income and expenses","15.20 - Commitments relating to joint ventures","15.21 - Contingent liabilities from JV interests"], periodicReview2026Changes: ["Consideration of alignment with IFRS 11 classification","Updated guidance on contributions to joint ventures","New examples of joint control assessment in modern arrangements"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 16
  { section: 16, title: "Investment Property", scope: "Covers the recognition and measurement of investment property held to earn rentals or for capital appreciation.", keyRequirements: ["Recognise investment property as an asset when probable future economic benefits will flow","Measure at cost on initial recognition","Subsequently measure at fair value if reliably measurable, with changes in profit or loss","Use cost model if fair value is not reliably measurable","Transfer between investment property and owner-occupied property when use changes"], disclosures: ["Methods and significant assumptions applied in determining fair value","Reconciliation between carrying amounts at beginning and end of period","Extent to which fair value is based on valuation by independent valuer","Rental income and direct operating expenses"], auditConsiderations: "Auditor assesses reliability of fair value measurements, considers need for external valuation expert, tests rental income against lease agreements, evaluates appropriateness of classification.", paragraphRefs: ["16.1 - Scope","16.2 - Definition of investment property","16.3 - Mixed-use property","16.4 - Property held under operating lease as investment property","16.5-16.6 - Initial recognition and measurement","16.7-16.8 - Fair value model","16.9 - Cost model where FV not reliably measurable","16.10 - Transfers between categories","16.11-16.14 - Disclosures"], recognitionCriteria: ["Investment property is land or building held to earn rentals or for capital appreciation or both","Property for use in production/supply or admin is PPE (Section 17)","Property held for sale is inventory (Section 13)","Mixed-use: separate if portions can be sold/leased separately; otherwise investment property only if insignificant portion owner-occupied"], measurementRules: ["Initial at cost including transaction costs","Fair value model: changes in P&L, no depreciation","Cost model: cost less depreciation and impairment per Section 17","If FV reliably measurable without undue cost, must use FV model","Operating lease interest may be classified as investment property if FV model used"], disclosureRequirementsDetail: ["16.11 - Methods and significant assumptions for fair value","16.12 - Whether based on independent valuer","16.13 - Reconciliation: additions, FV gains/losses, transfers, disposals","16.14 - Rental income and direct operating expenses"], periodicReview2026Changes: ["New guidance on FV measurement in illiquid markets","Clarification on mixed-use property including co-working spaces","Updated guidance on FV model and distributable profits interaction"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 17
  { section: 17, title: "Property, Plant and Equipment", scope: "Covers the recognition, measurement and depreciation of property, plant and equipment (PPE).", keyRequirements: ["Recognise PPE when probable future economic benefits will flow to the entity","Initially measure at cost","Apply cost model or revaluation model consistently to each class of PPE","Depreciate each component with a cost significant relative to the total","Review residual values, depreciation methods and useful lives at each reporting date"], disclosures: ["Measurement bases used","Depreciation methods and useful lives or depreciation rates","Gross carrying amount and accumulated depreciation by class","Reconciliation of carrying amount at beginning and end of period","Commitments for acquisition of PPE"], auditConsiderations: "Auditor tests additions for capitalisation appropriateness, verifies depreciation calculations, assesses residual values and useful lives, tests for impairment indicators, reviews revaluation methodology.", paragraphRefs: ["17.1 - Scope","17.2 - Exclusions: biological assets, mineral rights","17.3-17.4 - Recognition criteria","17.5-17.11 - Elements of cost and measurement at recognition","17.12-17.14 - Subsequent costs","17.15 - Cost model","17.16 - Revaluation model","17.17-17.23 - Depreciation: useful life, method, residual value, component depreciation","17.24-17.26 - Impairment (Section 27)","17.27-17.30 - Derecognition","17.31-17.33 - Disclosures"], recognitionCriteria: ["Recognised when probable future economic benefits and cost reliably measurable","Tangible assets held for production/supply, rental, or admin, expected to be used over more than one period","Major spare parts and stand-by equipment qualify if used over more than one period","Subsequent costs capitalised if extending useful life or capacity; day-to-day servicing expensed"], measurementRules: ["Cost: purchase price plus duties, non-refundable taxes, directly attributable costs, dismantling estimate","Cost model: cost less accumulated depreciation and impairment","Revaluation model: FV less subsequent depreciation and impairment; entire class revalued","Revaluation increases in OCI unless reversing previous P&L decrease","Component depreciation required; straight-line, diminishing balance or units of production"], disclosureRequirementsDetail: ["17.31 - Measurement bases, depreciation methods, useful lives, gross carrying amount, accumulated depreciation, reconciliation","17.32 - Restrictions on title, PPE pledged as security","17.33 - Contractual commitments for acquisition"], periodicReview2026Changes: ["Clarification on component depreciation for small entities","New guidance on green capital expenditure (EV charging, solar)","Updated useful life guidance for assets affected by net zero commitments"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 18
  { section: 18, title: "Intangible Assets other than Goodwill", scope: "Covers the recognition and measurement of intangible assets other than goodwill including those acquired separately and developed internally.", keyRequirements: ["Recognise intangible assets only when they meet the identifiability, control and future economic benefit criteria","Research costs must be expensed as incurred","Development costs may be capitalised if specific criteria are met","Amortise intangibles with finite useful life over their useful life","Intangibles with indefinite useful life must be tested for impairment annually"], disclosures: ["Useful lives or amortisation rates used and the reasons for using indefinite useful life","Gross carrying amount and accumulated amortisation by class","Reconciliation of carrying amount at beginning and end of period","Description and carrying amount of individually material intangible assets"], auditConsiderations: "Auditor assesses whether recognition criteria are met for development costs, evaluates amortisation period and method, tests for impairment of intangibles with indefinite lives, reviews disclosures for completeness.", paragraphRefs: ["18.1 - Scope","18.2-18.3 - Definition and identifiability","18.4 - Recognition criteria","18.5-18.9 - Separately acquired, business combination, government grant","18.10-18.14 - Internally generated and R&D","18.15-18.17 - Measurement after recognition","18.18-18.22 - Amortisation and impairment","18.23-18.24 - Retirements and disposals","18.25-18.27 - Disclosures"], recognitionCriteria: ["Identifiable non-monetary asset without physical substance","Identifiable: separable or from contractual/legal rights","Internally generated brands, mastheads, publishing titles, customer lists not recognised","Development capitalised only if: technical feasibility, intention to complete, ability to use/sell, probable benefits, adequate resources, reliably measurable expenditure"], measurementRules: ["Initially at cost; business combinations at FV at acquisition date","Internally generated: cost from date criteria first met","Cost model: cost less amortisation and impairment","Useful life presumed 10 years if cannot be reliably established (FRS 102 specific)","Indefinite life: not amortised, annual impairment test"], disclosureRequirementsDetail: ["18.25 - For each class: useful lives, methods, gross carrying amount, accumulated amortisation","18.26 - Reconciliation: additions (internal, business combinations), amortisation, impairment, disposals","18.27 - Individually material intangible assets: description, carrying amount, remaining amortisation period"], periodicReview2026Changes: ["New guidance on SaaS configuration and customisation costs","Clarification on carbon emission rights recognition","Updated examples of development cost capitalisation for AI and technology"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 19
  { section: 19, title: "Business Combinations and Goodwill", scope: "Covers accounting for business combinations using the acquisition method and subsequent accounting for goodwill.", keyRequirements: ["Apply the acquisition method to all business combinations","Identify the acquirer and determine the acquisition date","Measure identifiable assets and liabilities at fair value at the acquisition date","Recognise goodwill as the excess of consideration over fair value of net assets","Amortise goodwill over its useful economic life or maximum 10 years if not reliably estimable"], disclosures: ["Name and description of acquiree","Acquisition date and percentage of voting equity acquired","Primary reasons for the business combination","Fair value of consideration transferred","Amounts recognised for each class of acquiree's assets and liabilities"], auditConsiderations: "Auditor examines purchase price allocation, assesses fair values of acquired assets and liabilities including whether specialist input is needed, reviews goodwill amortisation period and tests impairment.", paragraphRefs: ["19.1 - Scope","19.2-19.3 - Definition and exclusions","19.4-19.6 - Identifying the acquirer and acquisition date","19.7-19.10 - Cost of business combination","19.11-19.14 - Purchase price allocation","19.15-19.18 - Goodwill","19.19-19.20 - Negative goodwill","19.21-19.24 - Subsequent measurement of goodwill","19.25-19.26 - Staged acquisitions","19.27-19.30 - Disclosures"], recognitionCriteria: ["Business combination: bringing together separate entities into one reporting entity","Identifiable assets and liabilities recognised if criteria met at acquisition date","Contingent liabilities recognised if FV reliably measurable even if not probable","Goodwill: future economic benefits from assets not individually identified"], measurementRules: ["Cost: FV of assets given, liabilities incurred/assumed, equity instruments issued, plus directly attributable costs","Identifiable net assets at FV at acquisition date","Goodwill: excess of cost over acquirer's share of net FV; amortised over useful life (max 10 years if unreliable)","Negative goodwill: P&L immediately after reassessing PPA","Provisional values adjusted within 12 months"], disclosureRequirementsDetail: ["19.27 - Names, descriptions, date, percentage, cost, amounts for each class","19.28 - If goodwill life exceeds 10 years, reasons","19.29 - Reconciliation of goodwill carrying amount","19.30 - Post-period combinations: 19.27 info to extent practicable"], periodicReview2026Changes: ["2026 review of 10-year goodwill cap appropriateness","New guidance on earnout and contingent consideration","Updated guidance on intangible assets in tech acquisitions"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 20
  { section: 20, title: "Leases", scope: "Covers the classification and accounting for finance leases and operating leases by both lessees and lessors.", keyRequirements: ["Classify leases as finance or operating based on whether risks and rewards are transferred","Lessee: capitalise finance leases as an asset and liability at the lower of fair value and PV of minimum lease payments","Lessee: charge operating lease payments to profit or loss on a straight-line basis","Lessor: recognise finance lease receivable for finance leases","Lessor: continue to recognise assets under operating leases and charge depreciation"], disclosures: ["Future minimum lease payments under finance and operating leases","Description of significant leasing arrangements","Contingent rents recognised as expense or income","Sub-lease income recognised in the period"], auditConsiderations: "Auditor reviews lease classification, tests PV calculations for finance leases, verifies straight-line treatment of operating leases, confirms completeness of commitments disclosures.", paragraphRefs: ["20.1 - Scope","20.2-20.4 - Classification and indicators","20.5-20.8 - Lessee: finance leases","20.9-20.12 - Lessee: operating leases","20.13-20.16 - Lessor: finance leases","20.17-20.20 - Lessor: operating leases","20.21-20.24 - Sale and leaseback","20.25-20.35 - Disclosures"], recognitionCriteria: ["Finance lease: transfers substantially all risks and rewards of ownership","Indicators: ownership transfer, bargain purchase option, major part of economic life, PV substantially all of FV, specialised asset","All other leases are operating leases"], measurementRules: ["Lessee FL: lower of FV and PV of minimum payments; effective interest for finance charge","Lessee OL: straight-line unless another systematic basis representative","Lessor FL: receivable at net investment; constant periodic rate of return","Lessor OL: straight-line income; depreciate asset","S&L finance lease: defer excess and amortise; S&L operating at FV: recognise immediately"], disclosureRequirementsDetail: ["20.25 - Lessee FL: net carrying amount by class, future minimums by time bands, contingent rents","20.27 - Lessee OL: future minimums by time bands, payments as expense","20.31 - Lessor FL: gross investment, PV minimums, unearned income, residuals","20.33 - Lessor OL: future minimums under non-cancellable leases by time bands"], periodicReview2026Changes: ["FRS 102 retains IAS 17 model rather than IFRS 16 right-of-use model","New guidance on lease modifications and COVID-era rent concessions","Clarification on straight-lining for stepped rent reviews"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 21
  { section: 21, title: "Provisions and Contingencies", scope: "Covers the recognition and measurement of provisions, contingent liabilities and contingent assets.", keyRequirements: ["Recognise a provision when a present obligation exists, outflow is probable and amount can be estimated reliably","Measure provision at the best estimate of expenditure required to settle the obligation","Review provisions at each reporting date and adjust to current best estimate","Disclose contingent liabilities unless probability of outflow is remote","Recognise contingent assets only when virtually certain"], disclosures: ["Description of nature of obligation and expected timing of outflows","Indication of uncertainties about timing or amount","Amount of any expected reimbursement","Carrying amount at beginning and end of period with movements"], auditConsiderations: "Auditor obtains legal confirmations for legal provisions, challenges management's probability assessments, reviews adequacy of provisions for warranties and restructuring, assesses completeness of contingencies disclosures.", paragraphRefs: ["21.1-21.2 - Scope and exclusions","21.3-21.7 - Recognition: present obligation, probable outflow, reliable estimate","21.8-21.11 - Measurement: best estimate, discounting, expected value","21.12 - Reimbursements","21.13-21.14 - Changes in and use of provisions","21.15-21.17 - Contingent liabilities and contingent assets","21.18-21.21 - Disclosures"], recognitionCriteria: ["Provision: present obligation from past event, probable outflow, reliable estimate","Obligating event: legal or constructive obligation with no realistic alternative","Constructive obligation: entity's actions create valid third-party expectation","Contingent liability: possible obligation or present obligation where outflow not probable/not reliably measurable","Contingent asset: possible asset confirmed by uncertain future events"], measurementRules: ["Best estimate: rational settlement amount at reporting date","Discount to PV where time value material, using pre-tax rate","Large population: expected value (probability-weighted)","Single obligation: most likely outcome, considering other outcomes","Reimbursements: separate asset when virtually certain, not offset"], disclosureRequirementsDetail: ["21.18 - Each class: opening/closing amounts, additions, used, reversed, unwinding of discount","21.19 - Nature and expected timing","21.20 - Uncertainties and major assumptions","21.21 - Expected reimbursement and any asset recognised"], periodicReview2026Changes: ["New guidance on climate-related provisions","Updated restructuring provision examples","Clarification on HMRC investigation provisions"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 22
  { section: 22, title: "Liabilities and Equity", scope: "Covers the classification of financial instruments as liabilities or equity and accounting for compound instruments.", keyRequirements: ["Classify an instrument as liability or equity based on economic substance not legal form","An instrument is equity if no contractual obligation to deliver cash exists","Classify compound instruments by separating the liability and equity components","Measure the liability component at fair value and equity is the residual","Recognise distributions to holders of equity instruments directly in equity"], disclosures: ["Description of each class of equity","Rights, preferences and restrictions attaching to each class","Shares held by the entity or its subsidiaries or associates","Shares reserved for issue under options and contracts"], auditConsiderations: "Auditor reviews terms of financial instruments for correct classification, verifies compound instrument separation, confirms dividends are from distributable reserves, checks share capital disclosures.", paragraphRefs: ["22.1-22.4 - Scope and classification principles","22.5 - Puttable instruments as equity","22.6-22.7 - Obligations imposed by law","22.8-22.9 - Compound instruments","22.10-22.12 - Treasury shares","22.13-22.14 - Distributions","22.15-22.17 - Share issues, bonus issues, splits","22.18-22.20 - Disclosures"], recognitionCriteria: ["Financial liability: contractual obligation to deliver cash or exchange under unfavourable conditions","Equity: residual interest with no contractual cash delivery obligation","Puttable as equity if subordinate, returns based on P&L/net assets, no restricting instrument","Compound: liability at FV of similar liability without conversion feature, equity as residual"], measurementRules: ["Equity instruments at FV of resources received net of issuance costs","Treasury shares at cost deducted from equity; no P&L gains/losses","Compound: liability at FV, equity as residual","Distributions in equity; dividends payable as current liabilities when declared"], disclosureRequirementsDetail: ["22.18 - Each class: authorised/issued shares, par value, reconciliation, rights/restrictions, treasury, reserved","22.19 - Description of each equity reserve","22.20 - Entities without share capital: equivalent information"], periodicReview2026Changes: ["Clarification on ESG-linked variable return instruments","New guidance on share buybacks","Updated guidance on LLP members' interests"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 23
  { section: 23, title: "Revenue", scope: "Covers the recognition of revenue from the sale of goods, rendering of services, construction contracts and use of entity assets.", keyRequirements: ["Measure revenue at the fair value of consideration received or receivable","Recognise revenue from sale of goods when risks and rewards of ownership have transferred","Recognise revenue from services using stage of completion method","Recognise interest on a time proportion basis using the effective interest method","Recognise dividends when the shareholder's right to receive payment is established"], disclosures: ["Accounting policies adopted for recognising revenue","Amount of each category of revenue recognised","For construction contracts: contract revenue, methods used, details of contracts in progress"], auditConsiderations: "Auditor tests revenue recognition criteria are met, checks cut-off at period-end, reviews long-term contract stage of completion assessments, tests for fictitious revenue as a fraud risk.", paragraphRefs: ["23.1-23.2 - Scope and exclusions","23.3-23.4 - Measurement","23.5-23.7 - Multiple-element arrangements","23.8-23.10 - Sale of goods","23.11-23.13 - Rendering of services","23.14-23.16 - Construction contracts","23.17-23.19 - Interest, royalties, dividends","23.24-23.31 - Disclosures"], recognitionCriteria: ["Sale of goods: risks and rewards transferred, no continuing involvement, reliably measurable, probable benefits, costs measurable","Services: stage of completion when outcome reliably estimable; otherwise to extent of recoverable costs","Construction contracts: stage of completion when outcome reliably estimable","Interest: effective interest method; Royalties: accrual basis; Dividends: when right established"], measurementRules: ["FV of consideration net of discounts and rebates","Deferred consideration at PV using imputed rate","Exchange of goods: no revenue if similar; if dissimilar, at FV","Multiple-element: separate identifiable components","Stage of completion: costs incurred to total costs, work surveys, or physical proportion"], disclosureRequirementsDetail: ["23.24 - Policies including stage of completion methods","23.25 - Amount of each revenue category","23.26 - Construction: revenue recognised, methods","23.27 - Contracts in progress: aggregate costs plus profits less losses, advances, retentions"], periodicReview2026Changes: ["FRS 102 retains risks-and-rewards model, not IFRS 15 five-step model","New guidance on subscription and SaaS revenue","Clarification on government-mandated service arrangements"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 24
  { section: 24, title: "Government Grants", scope: "Covers accounting for assistance by government in the form of transfers of resources in exchange for compliance with conditions.", keyRequirements: ["Recognise government grants only when there is reasonable assurance that conditions will be complied with","Recognise grants related to revenue systematically over the periods to match costs","Recognise grants related to assets by reducing the carrying amount or as deferred income","Recognise forgivable loans as grants when there is reasonable assurance of forgiveness","Repayable grants should be recognised as a liability when repayment becomes probable"], disclosures: ["Accounting policy adopted for government grants","Nature and extent of government grants recognised","Unfulfilled conditions and other contingencies attaching to grants"], auditConsiderations: "Auditor verifies conditions attached to grants and compliance therewith, tests that revenue grants match costs they are intended to compensate, reviews capital grants for appropriate accounting.", paragraphRefs: ["24.1 - Scope","24.2-24.3 - Definition and exclusions","24.4-24.5 - Recognition and accrual/performance models","24.6-24.8 - Revenue grants, asset grants, non-monetary grants","24.9 - Forgivable loans","24.10 - Repayment","24.11-24.14 - Disclosures"], recognitionCriteria: ["Recognised when reasonable assurance of compliance and receipt","Compensation for past costs or immediate support: recognised when receivable","Asset-related grant: over expected useful life","Forgivable loans: grant when reasonable assurance of forgiveness terms"], measurementRules: ["FV of asset received or receivable","Accrual model: revenue grants matched to costs; asset grants over asset life","Performance model alternative: recognised when conditions met","Pre-criteria grants as deferred income","Repayment: change in estimate, against deferred credit first then expense"], disclosureRequirementsDetail: ["24.11 - Policy and presentation methods","24.12 - Nature and amounts recognised","24.13 - Unfulfilled conditions and contingencies","24.14 - Other government assistance benefited from"], periodicReview2026Changes: ["Updated guidance on post-pandemic support legacies","New examples for net zero transition grants","Clarification on grants vs government contracts"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 25
  { section: 25, title: "Borrowing Costs", scope: "Covers the accounting treatment for borrowing costs, which under FRS 102 may be expensed or capitalised.", keyRequirements: ["Under Section 25, entities may capitalise borrowing costs directly attributable to qualifying assets","Alternatively, all borrowing costs may be recognised as an expense in the period incurred","Apply chosen policy consistently","Where capitalising, suspend capitalisation during periods when active development is suspended","Cease capitalisation when substantially all activities necessary to prepare asset are complete"], disclosures: ["Accounting policy for borrowing costs","Amount of borrowing costs capitalised during the period","Capitalisation rate used"], auditConsiderations: "Auditor confirms consistency of accounting policy, verifies that capitalised borrowing costs relate directly to qualifying assets, checks that capitalisation ceases when assets are ready for use.", paragraphRefs: ["25.1 - Scope","25.2 - Recognition: expense or capitalise policy choice","25.3 - Qualifying assets definition","25.4-25.6 - Capitalisation: commencement, suspension, cessation","25.7-25.8 - Disclosures"], recognitionCriteria: ["Borrowing costs are interest and other costs incurred in connection with borrowing of funds","A qualifying asset necessarily takes a substantial period to get ready for intended use or sale","Capitalisation begins when expenditure incurred, borrowing costs incurred, and preparation activities in progress"], measurementRules: ["Capitalised: actual borrowing costs on specific borrowings less investment income, or weighted average rate applied to expenditure","Expense model: all borrowing costs in P&L as incurred","Suspended during extended periods of interrupted active development","Cease when substantially all preparation activities complete"], disclosureRequirementsDetail: ["25.7 - Accounting policy adopted","25.8 - Amount capitalised and capitalisation rate"], periodicReview2026Changes: ["Clarification on qualifying assets in large-scale development","Updated interaction guidance with Section 17 and Section 18 capitalisation"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 26
  { section: 26, title: "Share-based Payment", scope: "Covers transactions in which the entity receives goods or services as consideration for equity instruments or cash amounts based on the price of equity instruments.", keyRequirements: ["Recognise goods or services received in share-based payment transactions","Measure equity-settled share-based payments at fair value of equity instruments granted","Measure cash-settled share-based payments at fair value of liability","Recognise expense over the vesting period","Remeasure liability of cash-settled transactions at each reporting date"], disclosures: ["Description of share-based payment arrangements","Number and weighted average exercise prices of share options","Expense recognised for share-based payment transactions","How fair value was measured"], auditConsiderations: "Auditor assesses appropriateness of valuation model used, verifies inputs to fair value calculation, checks vesting assumptions are reasonable, confirms expense calculation and disclosure.", paragraphRefs: ["26.1 - Scope","26.2-26.4 - Recognition of goods or services","26.5-26.8 - Equity-settled transactions","26.9-26.11 - Cash-settled transactions","26.12-26.13 - Transactions with cash alternatives","26.14-26.16 - Group plans","26.17-26.18 - Government mandated plans","26.19-26.23 - Disclosures"], recognitionCriteria: ["Equity-settled: recognise when received; if vesting conditions, over vesting period","Cash-settled: recognise goods/services and liability as services received","If goods/services not specifically identifiable, measure by FV of equity instruments granted","Group plans: receiving entity recognises the expense"], measurementRules: ["Equity-settled: FV at grant date; not subsequently remeasured","Cash-settled: FV of liability remeasured at each reporting date; changes in P&L","If FV not reliably estimable, use intrinsic value with remeasurement","Market conditions in FV estimate; non-market conditions via number adjustment"], disclosureRequirementsDetail: ["26.19 - Description of each type of arrangement","26.20 - Number and weighted average exercise prices: outstanding, granted, forfeited, exercised, expired","26.21 - Weighted average share price at exercise date","26.22 - Expense recognised","26.23 - FV determination: model, inputs, volatility estimation"], periodicReview2026Changes: ["New guidance on EMI options and tax-advantaged schemes","Updated group plan allocation examples","Clarification on modification and cancellation accounting"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 27
  { section: 27, title: "Impairment of Assets", scope: "Covers the identification and measurement of impairment of assets including goodwill, intangibles, PPE and investments.", keyRequirements: ["Assess at each reporting date whether there are indicators of impairment","Perform impairment test when indicators exist by comparing carrying amount to recoverable amount","Recoverable amount is the higher of fair value less costs to sell and value in use","Recognise impairment loss in profit or loss immediately","Test goodwill and intangibles with indefinite lives for impairment at least annually"], disclosures: ["Amount of impairment losses recognised by class of asset","Events and circumstances that led to recognition of impairment","Description of cash-generating units","Key assumptions used in impairment testing"], auditConsiderations: "Auditor critically evaluates management's impairment indicators assessment, challenges assumptions in VIU calculations especially discount rates and long-term growth rates, considers need for specialist valuers.", paragraphRefs: ["27.1 - Scope","27.2-27.4 - Indicators of impairment","27.5-27.8 - Measuring recoverable amount","27.9-27.11 - FV less costs to sell","27.12-27.15 - Value in use","27.16-27.20 - Cash-generating units","27.21-27.24 - Goodwill allocation","27.25-27.28 - Reversal of impairment","27.29-27.33 - Disclosures"], recognitionCriteria: ["External indicators: significant decline in market value, adverse environmental changes, interest rate increases","Internal indicators: obsolescence, physical damage, adverse changes in use, poor performance vs expectations","Impairment when carrying amount exceeds recoverable amount","Reversal permitted for all assets except goodwill"], measurementRules: ["Recoverable amount: higher of FVLCTS and VIU","VIU: PV of future cash flows using pre-tax discount rate","Projections: reasonable assumptions, recent budgets, steady/declining growth for extrapolation","CGU: smallest group of assets with independent cash inflows","Goodwill impairment allocated to goodwill first then pro rata","Reversal: increased carrying amount not exceeding amount without impairment"], disclosureRequirementsDetail: ["27.29 - Impairment losses in P&L by class and line item","27.30 - Reversals by class and line item","27.31 - Events and circumstances","27.32 - Individually material: nature, amount, CGU, whether FVLCTS or VIU","27.33 - Key assumptions for recoverable amount"], periodicReview2026Changes: ["Enhanced climate-related impairment indicator guidance","New examples for technology and digital asset impairment","Clarification on discount rates in current rate environment"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 28
  { section: 28, title: "Employee Benefits", scope: "Covers all forms of consideration given by an entity in exchange for services provided by employees, including short-term benefits, post-employment benefits, and termination benefits.", keyRequirements: ["Recognise short-term employee benefits as an expense when the service is provided","Account for defined contribution plans by recognising the contribution as an expense","Apply projected unit credit method for defined benefit plans","Recognise the deficit or surplus in a defined benefit plan as a net liability or asset","Recognise remeasurements of defined benefit liability immediately in other comprehensive income"], disclosures: ["Description of type of plan and accounting policy","For defined benefit plans: characteristics of the plan and risks associated","Reconciliation from opening to closing balances of plan assets and liabilities","Components of defined benefit cost recognised in profit or loss and OCI","Actuarial assumptions used"], auditConsiderations: "Auditor reviews actuarial assumptions used in defined benefit calculations, assesses the objectivity and competence of the actuary as management's expert, verifies completeness of multi-employer and defined contribution disclosures.", paragraphRefs: ["28.1 - Scope","28.2-28.5 - General recognition principle","28.6-28.8 - Short-term employee benefits","28.9-28.12 - DC plans","28.13-28.28 - DB plans","28.29-28.30 - Other long-term benefits","28.31-28.33 - Termination benefits","28.34-28.38 - Group and multi-employer plans","28.39-28.43 - Disclosures"], recognitionCriteria: ["Short-term: expense when service rendered; accrue unpaid amounts","DC: expense when employee renders service; liability for unpaid contributions","DB: net defined benefit liability or asset on balance sheet","Termination: recognised when demonstrably committed and cannot withdraw","Multi-employer: DC unless sufficient information for DB accounting"], measurementRules: ["Short-term at undiscounted amount","DC at amount payable for the period","DB: PV of obligation less FV of plan assets; projected unit credit method; discount rate from high quality corporate bonds","Plan assets at FV; return based on discount rate applied to net liability","Remeasurements in OCI, not recycled to P&L"], disclosureRequirementsDetail: ["28.39 - General: type, funding policy, regulatory framework","28.40 - DB: reconciliation, cost components in P&L and OCI, actuarial assumptions","28.41 - Multi-employer: description, deficit funding","28.42 - DC: expense recognised","28.43 - Termination: nature, estimated effect, uncertainties"], periodicReview2026Changes: ["Updated mortality assumptions per ONS 2024 projections","New guidance on plan amendments and curtailments","Clarification on multi-employer S75 employer debt obligations"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 29
  { section: 29, title: "Income Tax", scope: "Covers the accounting for current and deferred tax, including the recognition and measurement of tax assets and liabilities.", keyRequirements: ["Recognise current tax for the period based on tax rates and laws enacted or substantively enacted","Recognise deferred tax for all timing differences between tax and accounting","Apply the timing difference plus approach to deferred tax","Measure deferred tax at average rate expected to apply when timing differences reverse","Assess recoverability of deferred tax assets"], disclosures: ["Major components of tax expense","Explanation of relationship between tax expense and accounting profit","Changes in applicable tax rates","Deferred tax assets and liabilities by type of timing difference","Unrecognised deferred tax assets with reasons"], auditConsiderations: "Auditor verifies current tax calculations, reviews deferred tax computations for completeness of timing differences, assesses recoverability of deferred tax assets, checks tax rate reconciliation.", paragraphRefs: ["29.1 - Scope","29.2-29.5 - Current tax","29.6-29.9 - Timing differences","29.10-29.14 - Deferred tax recognition","29.15-29.17 - Measurement","29.18-29.20 - Withholding tax and uncertain positions","29.21-29.24 - Presentation","29.25-29.31 - Disclosures"], recognitionCriteria: ["Current tax: liability for unpaid tax; asset if overpaid","Deferred tax for all timing differences (originate in one period, reverse in subsequent periods)","Timing difference plus approach includes non-reversing differences and those from business combinations","DT asset: only to extent probable that taxable profit will be available"], measurementRules: ["Current tax at enacted/substantively enacted rates","Deferred tax at average rate expected for reversal period; not discounted","Tax on OCI items in OCI; tax on equity items in equity","Uncertain positions at best estimate of amount expected to be paid"], disclosureRequirementsDetail: ["29.25 - Components: current, prior period adjustments, deferred","29.26 - Tax relating to OCI components","29.27 - Reconciliation: expense vs accounting profit x applicable rate","29.28 - Changes in applicable rate","29.29 - DT assets/liabilities by timing difference type","29.30 - Unrecognised DT assets: amount and nature","29.31 - Tax consequences of proposed undeclared dividends"], periodicReview2026Changes: ["Updated for UK corporation tax rate changes","New guidance on Pillar Two global minimum tax implications","Clarification on DT for right-of-use assets and lease liabilities"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 30
  { section: 30, title: "Foreign Currency Translation", scope: "Covers accounting for transactions and balances in foreign currencies, and translating the results and financial position of foreign operations.", keyRequirements: ["Translate foreign currency transactions at the spot rate on the transaction date","Translate monetary items at the closing rate at the reporting date","Recognise exchange differences on monetary items in profit or loss","Translate assets and liabilities of foreign operations at closing rate","Recognise translation differences on foreign operations in other comprehensive income"], disclosures: ["Exchange differences recognised in profit or loss","Net exchange differences in other comprehensive income and cumulative amount","Functional currency and presentation currency where different","Reason for using a presentation currency other than the functional currency"], auditConsiderations: "Auditor tests retranslation of monetary items at year-end rates, verifies exchange differences are recorded in correct period and classified correctly, checks translation of foreign operations.", paragraphRefs: ["30.1 - Scope","30.2-30.4 - Functional currency determination","30.5-30.9 - Reporting foreign currency transactions","30.10-30.12 - Net investment in foreign operation","30.13-30.17 - Change in functional currency","30.18-30.21 - Translation to presentation currency","30.22-30.26 - Disclosures"], recognitionCriteria: ["Foreign currency transaction recorded at functional currency spot rate at transaction date","Monetary items retranslated at closing rate; non-monetary at historical cost at transaction date rate; non-monetary at FV at FV determination date rate","Exchange differences on monetary items in P&L; on net investment in foreign operation in OCI"], measurementRules: ["Spot rate at transaction date or period average if rates stable","Closing rate for monetary items","Historical rate for non-monetary at cost","FV date rate for non-monetary at FV","Foreign operation: A&L at closing rate; I&E at transaction dates or average; differences in OCI","On disposal of foreign operation: cumulative OCI differences recycled to P&L"], disclosureRequirementsDetail: ["30.22 - Exchange differences in P&L","30.23 - Net exchange differences in OCI with cumulative reconciliation","30.24-30.25 - Functional and presentation currency identification and reason","30.26 - Change in functional currency: fact and reason"], periodicReview2026Changes: ["Clarification on functional currency for UK entities with overseas operations","Updated guidance on goodwill/FV adjustment translation for foreign acquisitions","New examples for digital-only cross-border businesses"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 31
  { section: 31, title: "Hyperinflationary Economies", scope: "Covers the restatement of financial statements of entities whose functional currency is the currency of a hyperinflationary economy.", keyRequirements: ["Identify when the functional currency is that of a hyperinflationary economy","Restate the financial statements using a general price index","Restate non-monetary items at current purchasing power","Recognise the gain or loss on the net monetary position","Apply IFRS inflation criteria as guidance for identifying hyperinflationary conditions"], disclosures: ["Fact that financial statements have been restated","Identity and level of the price index at reporting date","Gain or loss on monetary position"], auditConsiderations: "Auditor considers applicability of this section to entities with foreign operations in hyperinflationary economies, verifies restatement calculations and price indices used.", paragraphRefs: ["31.1 - Scope","31.2 - Indicators of hyperinflation","31.3-31.6 - Restatement procedures","31.7-31.9 - Economies ceasing to be hyperinflationary","31.10-31.13 - Disclosures"], recognitionCriteria: ["Indicators: population prefers non-monetary assets or foreign currency, prices quoted in foreign currency, credit prices compensate for expected loss of purchasing power, rates/wages/prices linked to price index, cumulative 3-year inflation approaching or exceeding 100%"], measurementRules: ["Non-monetary items restated by general price index change from acquisition/contribution date","Monetary items not restated","Income/expense restated from original recognition dates","Gain or loss on net monetary position in P&L"], disclosureRequirementsDetail: ["31.10 - Fact of restatement","31.11 - Price index identity, level and movement","31.12 - Gain or loss on net monetary position"], periodicReview2026Changes: ["Updated list of hyperinflationary economies","Guidance for UK groups with hyperinflationary subsidiaries"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 32
  { section: 32, title: "Events after the End of the Reporting Period", scope: "Covers adjusting and non-adjusting events occurring after the reporting date and before the financial statements are authorised for issue.", keyRequirements: ["Adjust financial statements for adjusting events occurring after the reporting period","Do not adjust for non-adjusting events but disclose material ones","Disclose the date on which the financial statements were authorised for issue","Consider going concern implications of post-balance sheet events","Treat dividends declared after the reporting period as non-adjusting events"], disclosures: ["Date financial statements were authorised for issue and who gave that authorisation","For each material non-adjusting event: nature of event and estimate of financial effect"], auditConsiderations: "Auditor performs subsequent events procedures up to the date of the auditor's report, distinguishes adjusting from non-adjusting events, verifies cut-off for dividends declared after year-end.", paragraphRefs: ["32.1 - Scope","32.2-32.3 - Adjusting and non-adjusting definitions","32.4-32.6 - Recognition of adjusting events","32.7-32.8 - Non-adjusting: disclosure only","32.9 - Dividends declared after reporting period","32.10-32.11 - Going concern","32.12-32.14 - Disclosures"], recognitionCriteria: ["Adjusting: evidence of conditions at reporting date (court settlement, fraud discovery, customer bankruptcy)","Non-adjusting: conditions arose after reporting date (market decline, business combination, fire/flood, share transactions)","Going concern: if post-period determination to liquidate/cease, do not use going concern basis"], measurementRules: ["Adjusting: adjust amounts or recognise previously unrecognised items","Non-adjusting: no adjustment; disclose nature and estimate if material","Dividends declared post-period: not a liability at reporting date; disclosed"], disclosureRequirementsDetail: ["32.12 - Authorisation date and who authorised","32.13 - Non-adjusting: nature and estimate (or statement that estimate cannot be made)","32.14 - Update disclosures in light of post-period information"], periodicReview2026Changes: ["Going concern assessment in economic uncertainty","Climate-related post-period events guidance","Updated adjusting vs non-adjusting classification examples"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 33
  { section: 33, title: "Related Party Disclosures", scope: "Covers identification and disclosure of related party relationships, transactions and outstanding balances.", keyRequirements: ["Disclose relationships between parents and subsidiaries regardless of whether transactions have occurred","Disclose transactions between related parties and outstanding balances","Disclose key management personnel compensation by category","Group related party transactions by category for disclosure purposes","Disclose that terms are at arm's length only if this can be substantiated"], disclosures: ["Name of parent entity and ultimate controlling party","For each category of related party: amount of transactions, outstanding balances, terms and conditions","Provisions for doubtful debts and bad debts for related party receivables","Key management personnel compensation"], auditConsiderations: "Auditor performs specific procedures to identify related parties, assesses completeness of related party disclosures, verifies that related party transactions are on an arm's length basis if claimed, considers ISA (UK) 550.", paragraphRefs: ["33.1 - Scope","33.2-33.4 - Related party definitions","33.5-33.8 - Disclosure requirements","33.9 - KMP compensation","33.10 - Government-related entities","33.11-33.14 - Small entity exemptions"], recognitionCriteria: ["Related parties: parent, subsidiaries, fellow subsidiaries, associates, JVs, KMP and close family, entities controlled/jointly controlled/influenced by KMP or family","Government-related entities: reduced disclosure requirements","Small entities (Section 1A) exempt from KMP compensation and certain intra-group disclosures"], measurementRules: ["No specific measurement; transactions disclosed at occurred amounts","Terms and conditions disclosed including security and consideration nature","Outstanding balances and commitments disclosed"], disclosureRequirementsDetail: ["33.5 - Parent-subsidiary relationships regardless of transactions","33.6 - KMP compensation total and by category","33.7 - Transactions: relationship, description, amount, balances, terms, doubtful debts","33.8 - Categories: parent, joint control/significant influence entities, subsidiaries, associates, JVs, KMP, other"], periodicReview2026Changes: ["Clarification on identification in complex group structures","Updated guidance for owner-managed business KMP transactions","New examples for PE/VC investor related party disclosure"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 34
  { section: 34, title: "Specialised Activities", scope: "Covers financial reporting for entities engaged in agriculture, extractive industries, and service concession arrangements.", keyRequirements: ["Agricultural: measure biological assets and agricultural produce at fair value less costs to sell","Agricultural: recognise changes in fair value in profit or loss","Extractive: apply cost less depletion or full cost method consistently","Service concessions: apply financial asset or intangible asset model as appropriate","Disclose accounting policies specific to specialised activities"], disclosures: ["For agriculture: description of biological assets, methods and assumptions for fair values","Gains and losses arising during the period on biological assets","For extractive activities: information about production and reserves"], auditConsiderations: "Auditor considers need for specialist expertise for fair value measurements of biological assets, reviews consistency of accounting policies for extractive activities, assesses service concession arrangement classification.", paragraphRefs: ["34.1 - Scope","34.2-34.8 - Agriculture: biological assets recognition and measurement","34.9-34.10 - Agricultural produce at harvest","34.11-34.16 - Extractive activities","34.17-34.20 - Service concession arrangements","34.21-34.27 - Heritage assets","34.28-34.38 - Disclosures"], recognitionCriteria: ["Biological assets: entity controls, probable future benefits, FV or cost reliably measurable","Agricultural produce at point of harvest at FV less costs to sell","Extractive: capitalise exploration/evaluation per chosen policy","Service concessions: financial asset if right to receive cash; intangible if right to charge users","Heritage assets: tangible fixed assets where cost/value available"], measurementRules: ["Biological assets at FV less costs to sell; if FV not determinable without undue cost then cost less depreciation and impairment","Agricultural produce at FV less costs to sell at harvest; becomes inventory cost","Extractive: successful efforts or full cost; impairment per Section 27","Service concession financial asset at FV of consideration; intangible at FV of right","Heritage assets at cost or valuation; no depreciation if residual value equals or exceeds carrying amount"], disclosureRequirementsDetail: ["34.7 - Agriculture: description, methods, assumptions, reconciliation, restrictions","34.10 - Agricultural produce measurement at harvest","34.16 - Extractive: policy, amounts recognised","34.20 - Service concessions: description, terms, rights","34.27 - Heritage: policies, carrying amounts, explanation if not recognised"], periodicReview2026Changes: ["Precision agriculture and vertical farming measurement guidance","Energy transition stranded asset risks for extractive activities","Heritage asset accounting for charities and museums"], source: "FRC", lastVerified: "2026-03-12" },

  // SECTION 35
  { section: 35, title: "Transition to this FRS", scope: "Covers the requirements for an entity transitioning to FRS 102 from another basis of accounting, including the first-time adoption procedures.", keyRequirements: ["Prepare an opening balance sheet at the date of transition in accordance with FRS 102","Apply FRS 102 accounting policies retrospectively to all periods presented","Apply mandatory exceptions and optional exemptions available on first-time adoption","Disclose how the transition from the previous GAAP has affected financial position and performance","Present reconciliations from previous GAAP to FRS 102 on transition"], disclosures: ["Explanation of how the transition affected reported financial position, performance and cash flows","Reconciliation of equity at date of transition and comparative period end","Reconciliation of total comprehensive income for the comparative period","Explanation of material adjustments made on transition"], auditConsiderations: "Auditor reviews transition adjustments for appropriateness and completeness, assesses whether optional exemptions have been applied correctly, verifies reconciliations and transition disclosures.", paragraphRefs: ["35.1 - Scope","35.2-35.4 - First-time adoption procedures","35.5-35.6 - Opening balance sheet","35.7-35.8 - Accounting policies on transition","35.9 - Mandatory exceptions","35.10 - Optional exemptions","35.11-35.13 - Disclosures and reconciliations"], recognitionCriteria: ["First-time adopter: entity presenting first FRS 102 annual financial statements","Date of transition: beginning of earliest period with full FRS 102 comparative information","Opening balance sheet at date of transition","Recognise all FRS 102 assets/liabilities not previously recognised; derecognise items not meeting FRS 102 definitions"], measurementRules: ["FRS 102 measurement rules applied retrospectively","Mandatory exceptions: derecognition, hedge accounting, estimates, discontinued operations, NCI measurement","Optional exemptions: business combinations before transition, share-based payment, FV/revaluation as deemed cost, compound instruments, dormant companies, service concessions, extractive, leases, decommissioning","Transition adjustments in retained earnings or other equity at date of transition"], disclosureRequirementsDetail: ["35.12 - Equity reconciliation: previous GAAP to FRS 102 at transition date and at end of last previous GAAP period","35.13 - Total comprehensive income reconciliation for last period under previous GAAP; separate errors from policy changes"], periodicReview2026Changes: ["Updated transition guidance for FRS 105 to FRS 102 moves due to growth","New examples for 2024/25 amendment first-time adoption","Clarification on FRS 101 to FRS 102 transition requirements"], source: "FRC", lastVerified: "2026-03-12" }
];
// =============================================================================
// FRS 101 - REDUCED DISCLOSURE FRAMEWORK (Expanded)
// =============================================================================

export const FRS_101_SUMMARY = {
  title: "FRS 101 Reduced Disclosure Framework",
  description: "FRS 101 allows qualifying entities to use IFRS measurement and recognition requirements while availing of significant disclosure exemptions. A qualifying entity is a member of a group where the parent prepares publicly available IFRS-consolidated financial statements. The entity must notify shareholders and no shareholder may object.",
  applicableTo: "Subsidiary and intermediate parent companies within a group that prepares IFRS-based consolidated financial statements. Public benefit entities cannot apply FRS 101.",
  effectiveDate: "Periods beginning on or after 1 January 2015 (with annual improvements since)",
  keyExemptions: [
    "Exemption from presenting a statement of cash flows",
    "Exemption from presenting share-based payment disclosures required by IFRS 2",
    "Exemption from presenting financial instrument disclosures required by IFRS 7",
    "Exemption from IAS 8 disclosures about standards and interpretations not yet effective",
    "Exemption from IAS 24 related party disclosures for intra-group transactions",
    "Exemption from IFRS 13 fair value measurement disclosures",
    "Exemption from presenting comparatives for certain disclosures",
    "Exemption from certain capital management disclosures under IAS 1"
  ],
  scope: "FRS 101 applies to the individual financial statements of a qualifying entity that is a member of a group where the parent of that group prepares publicly available consolidated financial statements which are intended to give a true and fair view of the assets, liabilities, financial position and profit or loss and are prepared in accordance with EU-adopted IFRS or IFRS as issued by the IASB. FRS 101 does not apply to consolidated financial statements.",
  qualifyingConditions: [
    "The entity must be a member of a group where the parent prepares publicly available consolidated financial statements intended to give a true and fair view",
    "The consolidated financial statements must be prepared in accordance with EU-adopted IFRS or IFRS as issued by the IASB",
    "The entity must otherwise apply the recognition, measurement and disclosure requirements of EU-adopted IFRS",
    "The shareholders must be notified in writing about the use of FRS 101 disclosure exemptions and must not object (simple majority of remaining shareholders who have not consented in writing can block)",
    "The entity must disclose in the notes that it is a qualifying entity and has applied FRS 101 disclosure exemptions",
    "The entity must disclose the name of the parent in whose consolidated financial statements the entity is consolidated and where those financial statements may be obtained",
    "Companies Act 2006 requirements continue to apply, including formats and additional disclosures required by statute"
  ],
  exemptionDetails: [
    { standard: "IFRS 2 Share-based Payment", exemptions: "Exempt from paragraphs 45(b) and 46-52 (detailed disclosures about share-based payment arrangements)" },
    { standard: "IFRS 7 Financial Instruments: Disclosures", exemptions: "Fully exempt from all IFRS 7 disclosure requirements" },
    { standard: "IFRS 13 Fair Value Measurement", exemptions: "Exempt from paragraphs 91-99 (detailed fair value measurement disclosures)" },
    { standard: "IFRS 15 Revenue from Contracts with Customers", exemptions: "Exempt from paragraphs 110-129 (detailed revenue disclosures) except for 110 and 113(a)" },
    { standard: "IFRS 16 Leases", exemptions: "Exempt from paragraphs 49-62 (detailed lessee disclosure requirements)" },
    { standard: "IAS 1 Presentation of Financial Statements", exemptions: "Exempt from paragraph 134-136 (capital management disclosures)" },
    { standard: "IAS 7 Statement of Cash Flows", exemptions: "Fully exempt from presenting a statement of cash flows" },
    { standard: "IAS 8 Accounting Policies, Changes in Estimates and Errors", exemptions: "Exempt from paragraphs 30 and 31 (disclosures about standards and interpretations in issue but not yet effective)" },
    { standard: "IAS 24 Related Party Disclosures", exemptions: "Exempt from disclosing key management personnel compensation and transactions between two or more members of a group provided that any subsidiary which is a party to the transaction is wholly owned by such a member" },
    { standard: "IAS 36 Impairment of Assets", exemptions: "Exempt from detailed impairment disclosures where the entity is not a parent with goodwill or indefinite-life intangibles" },
    { standard: "IAS 38 Intangible Assets", exemptions: "Exempt from paragraphs 118(e)(iv), 118(e)(v) and 128-132 (certain reconciliation and development expenditure disclosures)" }
  ],
  prohibitions: [
    "FRS 101 cannot be applied by entities that are not qualifying entities (i.e. entities not part of a group with publicly available IFRS consolidated financial statements)",
    "Public benefit entities cannot use FRS 101",
    "FRS 101 cannot be used for consolidated financial statements, only for individual entity financial statements",
    "Entities cannot cherry-pick FRS 101 exemptions on an IFRS-by-IFRS basis; they must apply it as a complete framework",
    "Companies Act 2006 disclosure requirements cannot be disapplied by FRS 101; statutory disclosures remain mandatory",
    "The exemptions are not available if a shareholder or shareholders holding in aggregate 5% or more of the total allotted shares serve notice objecting to the use of the exemptions"
  ],
  source: "FRC",
  lastVerified: "2026-03-12"
};

// =============================================================================
// FRS 105 - THE MICRO-ENTITIES REGIME (Expanded)
// =============================================================================

export const FRS_105_SUMMARY = {
  title: "FRS 105 The Financial Reporting Standard applicable to the Micro-entities Regime",
  description: "FRS 105 provides a simplified financial reporting standard for the smallest entities. It uses a historical cost measurement basis throughout, has minimal disclosures, and prohibits fair value accounting and revaluation. The standard is based on FRS 102 but significantly simplified. Micro-entities are exempt from audit under s477A Companies Act 2006.",
  applicableTo: "Micro-entities that qualify under the micro-entity provisions in the Companies Act 2006. Not available to public companies, regulated financial services entities, charities, or LLPs.",
  effectiveDate: "Periods beginning on or after 1 January 2016",
  keyRestrictions: [
    "Prohibition on fair value accounting for financial instruments - all measured at cost",
    "Prohibition on revaluation of fixed assets",
    "Prohibition on use of equity method for associates and joint ventures - use cost",
    "No requirement to account for deferred tax",
    "No requirement to apply finance lease accounting by lessees - all leases treated as operating",
    "No requirement to recognise defined benefit pension scheme deficits",
    "No recognition of development costs - all R&D expensed",
    "No requirement to disclose related party transactions with group companies",
    "Minimal required disclosures - only balance sheet required to be filed at Companies House"
  ],
  scope: "FRS 105 applies to entities that qualify as micro-entities under the Companies Act 2006 sections 384A-384B and that choose to apply the micro-entities regime. A micro-entity must meet at least two of the three size thresholds for two consecutive financial years. Entities excluded from the micro-entities regime include: public companies, companies that are authorised insurance companies, banking companies or e-money issuers, UCITS management companies or MiFID investment firms, members of an ineligible group, and charities.",
  simplifications: [
    "Only two primary statements required: balance sheet and profit and loss account (no statement of comprehensive income, no statement of changes in equity, no statement of cash flows, no notes to accounts beyond statutory minimums)",
    "Balance sheet uses the simplified micro-entity format prescribed by SI 2008/410 Schedule 1 as modified by SI 2013/3008",
    "Profit and loss account uses simplified format with only turnover, other income, cost of raw materials and consumables, staff costs, depreciation and other amounts written off, other charges, tax, and profit or loss",
    "No requirement to present comparative information (though recommended)",
    "Financial statements deemed to give a true and fair view if they comply with FRS 105 (the statutory presumption under s396(3A) Companies Act 2006)",
    "Simplified accounting for government grants: recognised in income when received or receivable",
    "No requirement to capitalise borrowing costs (all expensed)",
    "No requirement to account for share-based payments",
    "Simplified employee benefit accounting: no requirement for defined benefit plan actuarial calculations"
  ],
  prohibitions: [
    "Must not apply fair value accounting to any asset or liability",
    "Must not revalue tangible fixed assets above historical cost",
    "Must not capitalise development expenditure; all research and development costs must be written off in the period incurred",
    "Must not apply the equity method for associates or joint ventures",
    "Must not recognise deferred tax assets or liabilities",
    "Must not capitalise finance leases; all leases accounted for as operating leases with payments in P&L on a straight-line basis",
    "Must not recognise actuarial gains and losses or net defined benefit plan liabilities/assets for pension schemes",
    "Must not apply hedge accounting",
    "Must not hold investment property at fair value; all property measured at cost less depreciation",
    "Must not apply the percentage of completion method for long-term contracts; instead recognise revenue only when the right to consideration is established"
  ],
  measurementBasis: [
    "All assets measured at historical cost less any provision for diminution in value (impairment) and less accumulated depreciation for fixed assets",
    "All liabilities measured at the amount expected to be paid to settle the obligation",
    "Financial instruments (both assets and liabilities) measured at cost or transaction price",
    "Inventories at lower of cost (FIFO or weighted average) and estimated selling price less costs to complete and sell",
    "Fixed assets (tangible and intangible) at cost less accumulated depreciation/amortisation and impairment",
    "Goodwill (if arising) amortised over its useful economic life not exceeding 5 years",
    "Government grants recognised in income when received or receivable without matching to related costs",
    "All borrowing costs recognised as an expense when incurred"
  ],
  source: "FRC",
  lastVerified: "2026-03-12"
};

// =============================================================================
// FRS 100 - APPLICATION OF FINANCIAL REPORTING REQUIREMENTS
// =============================================================================

export const FRS_100 = {
  title: "FRS 100 Application of Financial Reporting Requirements",
  scope: "FRS 100 sets out the overall financial reporting framework in the UK and Republic of Ireland. It specifies which financial reporting standard applies to which entities and provides the overarching requirements for the application of accounting standards. It establishes the hierarchy of financial reporting frameworks available to entities reporting under UK and Irish law.",
  effectiveDate: "Periods beginning on or after 1 January 2015 (originally); updated periodically with annual amendments. Current version incorporates amendments to March 2025.",
  keyRequirements: [
    "Entities preparing financial statements under UK GAAP must apply one of: FRS 101, FRS 102, FRS 103, FRS 104, or FRS 105 as appropriate",
    "Entities with securities admitted to trading on a regulated market (main market listed) must apply EU-adopted IFRS for their consolidated financial statements",
    "AIM-listed entities may choose between IFRS and FRS 102 for consolidated financial statements (though AIM rules may require IFRS)",
    "The true and fair override in s393 Companies Act 2006 remains paramount; all financial reporting frameworks are subject to it",
    "Financial statements must comply with the Companies Act 2006 (or equivalent legislation in the Republic of Ireland) in addition to the applicable accounting standard",
    "Entities must select the accounting framework at the level of the entity (individual or group) and apply it consistently",
    "A qualifying entity may apply FRS 101 to its individual financial statements even if the group accounts use IFRS",
    "An entity may voluntarily adopt a more comprehensive standard than required (e.g. FRS 102 instead of FRS 105)",
    "Charities must apply the Charities SORP (FRS 102) for their financial statements",
    "Registered social housing providers must apply the Housing SORP (FRS 102)"
  ],
  frameworkHierarchy: [
    { level: 1, framework: "EU-adopted IFRS (International Financial Reporting Standards)", applicableTo: "Entities with securities on a regulated market (mandatory for consolidated accounts); available to all entities on a voluntary basis", mandate: "Regulation (EC) 1606/2002 as retained in UK law" },
    { level: 2, framework: "FRS 101 Reduced Disclosure Framework", applicableTo: "Qualifying entities (subsidiaries of groups preparing IFRS consolidated accounts) for their individual financial statements only", mandate: "FRC voluntary framework" },
    { level: 3, framework: "FRS 102 The Financial Reporting Standard applicable in the UK and Republic of Ireland", applicableTo: "All entities not required to use IFRS and not electing to use FRS 101 or FRS 105; the default UK GAAP standard", mandate: "FRC; default standard for UK GAAP reporters" },
    { level: 4, framework: "FRS 102 Section 1A Small Entities", applicableTo: "Entities qualifying as small under Companies Act 2006; provides reduced disclosures within FRS 102", mandate: "FRC; optional for qualifying small entities" },
    { level: 5, framework: "FRS 105 The Financial Reporting Standard applicable to the Micro-entities Regime", applicableTo: "Entities qualifying as micro-entities under Companies Act 2006 s384A-384B", mandate: "FRC; optional for qualifying micro-entities" },
    { level: 6, framework: "FRS 103 Insurance Contracts", applicableTo: "Entities issuing insurance contracts and entities holding reinsurance contracts (supplementary to FRS 102)", mandate: "FRC; mandatory for in-scope entities" },
    { level: 7, framework: "FRS 104 Interim Financial Reporting", applicableTo: "Entities preparing interim financial reports under UK GAAP", mandate: "FRC; applicable when interim reports are prepared under UK GAAP" }
  ],
  source: "FRC",
  lastVerified: "2026-03-12"
};

// =============================================================================
// FRS 103 - INSURANCE CONTRACTS
// =============================================================================

export const FRS_103 = {
  title: "FRS 103 Insurance Contracts",
  scope: "FRS 103 applies to insurance contracts (including reinsurance contracts) that an entity issues and to reinsurance contracts that it holds. It does not apply to other assets and liabilities of an insurer, such as financial assets and financial liabilities, which are within the scope of Sections 11 and 12 of FRS 102. FRS 103 is a supplementary standard to FRS 102; entities applying FRS 103 must also comply with FRS 102 for all matters not specifically addressed by FRS 103.",
  effectiveDate: "Periods beginning on or after 1 January 2015 (originally); current version incorporates amendments reflecting developments in insurance accounting including consideration of IFRS 17 Insurance Contracts.",
  keyRequirements: [
    "An entity must identify contracts within the scope of FRS 103 by assessing whether significant insurance risk is transferred",
    "An entity issuing insurance contracts must apply the accounting policies it applied before adopting FRS 103 subject to certain modifications and improvements",
    "Existing accounting policies for insurance contracts may be retained (grandfathering) unless a change results in more relevant and no less reliable information",
    "An insurer must perform a liability adequacy test at each reporting date to assess whether recognised insurance liabilities are adequate using current estimates of future cash flows",
    "If the liability adequacy test shows that liabilities are inadequate, the entire deficiency must be recognised in profit or loss",
    "Insurance contracts acquired in a business combination or portfolio transfer are measured at fair value at the acquisition date",
    "Reinsurance assets must be tested for impairment at each reporting date",
    "An entity must not offset reinsurance assets against related insurance liabilities or income/expense from reinsurance against expense/income from related insurance contracts",
    "Embedded derivatives in insurance contracts must be separated and accounted for under Section 12 of FRS 102 unless the embedded derivative is itself an insurance contract",
    "An entity must disclose information that helps users understand the amount, timing and uncertainty of future cash flows from insurance contracts",
    "Specific requirements exist for with-profits funds in the UK, including the Fund for Future Appropriations (FFA)",
    "Entities must disclose risk management objectives and policies, insurance risk sensitivity analysis, and claims development information"
  ],
  source: "FRC",
  lastVerified: "2026-03-12"
};

// =============================================================================
// FRS 104 - INTERIM FINANCIAL REPORTING
// =============================================================================

export const FRS_104 = {
  title: "FRS 104 Interim Financial Reporting",
  scope: "FRS 104 applies to entities that prepare interim financial reports under UK and Irish GAAP. It does not mandate which entities should publish interim financial reports, how frequently, or how soon after the end of an interim period. It sets out the minimum content and recognition and measurement principles for interim reports. FRS 104 is closely aligned with IAS 34 Interim Financial Reporting.",
  effectiveDate: "Periods beginning on or after 1 January 2015 (originally); current version incorporates amendments aligned with FRS 102 updates.",
  keyRequirements: [
    "An interim financial report must include at minimum: a condensed statement of financial position, a condensed statement of comprehensive income (or income statement and separate statement of comprehensive income), a condensed statement of changes in equity, a condensed statement of cash flows, and selected explanatory notes",
    "If a complete set of financial statements is published in the interim report, the form and content must conform to full FRS 102 requirements",
    "The same accounting policies must be applied in interim financial statements as in the most recent annual financial statements, except for policy changes made after the most recent annual financial statements that will be reflected in the next annual financial statements",
    "Revenue received seasonally, cyclically or occasionally should not be anticipated or deferred at the interim date unless it would be appropriate to anticipate or defer at the annual reporting date",
    "Costs incurred unevenly during the financial year should be anticipated or deferred for interim reporting purposes only if it is appropriate to anticipate or defer that type of cost at the end of the financial year",
    "Income tax expense for the interim period is recognised based on the best estimate of the weighted average annual income tax rate expected for the full financial year",
    "Measurements for interim reporting purposes are made on a year-to-date basis so that the frequency of reporting does not affect the measurement of annual results",
    "The interim report must disclose: a statement that the same accounting policies and methods of computation are followed as in the most recent annual financial statements (or describe changes), the nature and amount of items affecting assets, liabilities, equity, net income or cash flows that are unusual by virtue of their nature, size or incidence",
    "Comparative information must be presented: statement of financial position at end of immediately preceding financial year; statements of comprehensive income, changes in equity and cash flows for the comparable interim period of the immediately preceding financial year",
    "Materiality for interim reports is assessed by reference to the interim period financial data, not the annual data"
  ],
  source: "FRC",
  lastVerified: "2026-03-12"
};

// =============================================================================
// FRAMEWORK DECISION TREE
// Maps entity characteristics to the appropriate financial reporting framework
// =============================================================================

export const FRAMEWORK_DECISION_TREE = {
  thresholds: {
    micro: { turnover: 1000000, assets: 500000, employees: 10 },
    small: { turnover: 15000000, assets: 7500000, employees: 50 },
    medium: { turnover: 54000000, assets: 27000000, employees: 250 }
  },
  thresholdSource: "Companies Act 2006 s382-384 (as amended April 2025)",
  decisionNodes: [
    { id: 1, question: "Is the entity AIM/Main Market listed or a PIE?", yes: "IFRS (mandatory)", no: 2 },
    { id: 2, question: "Is it a qualifying subsidiary of an IFRS/FRS 101 parent?", yes: "FRS 101 option available", no: 3 },
    { id: 3, question: "Is it a charity?", yes: "Charities SORP (FRS 102)", no: 4 },
    { id: 4, question: "Is it a micro-entity (meets s384A criteria)?", yes: "FRS 105 option available", no: 5 },
    { id: 5, question: "Is it a small company (meets s382 criteria)?", yes: "FRS 102 Section 1A option", no: 6 },
    { id: 6, question: "Medium or large private company", yes: "FRS 102 (full)", no: "FRS 102 (full)" }
  ]
};
