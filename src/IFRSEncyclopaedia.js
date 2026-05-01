/**
 * IFRSEncyclopaedia.js
 *
 * Comprehensive reference data for all IAS/IFRS standards and
 * IFRIC/SIC interpretations used by the audit engine.
 *
 * Source: IFRS Foundation
 * Last verified: 2026-03-12
 */

// ---------------------------------------------------------------------------
// IFRS & IAS STANDARDS
// ---------------------------------------------------------------------------

export const IFRS_STANDARDS = [
  // =========================================================================
  // IFRS STANDARDS (CURRENT)
  // =========================================================================
  {
    number: "IFRS 1",
    title: "First-time Adoption of International Financial Reporting Standards",
    scope: "Applies to an entity's first IFRS financial statements and interim reports presented under IAS 34 for part of the period covered by the first IFRS financial statements.",
    keyPrinciples: [
      "Full retrospective application of IFRS standards effective at the reporting date of the first IFRS financial statements",
      "Opening IFRS statement of financial position at the date of transition",
      "Optional exemptions and mandatory exceptions to ease transition",
      "Reconciliation disclosures between previous GAAP and IFRS"
    ],
    ukRelevance: "Relevant for UK entities transitioning from UK GAAP (FRS 102) to IFRS, particularly upon AIM or main market listing.",
    objective: "To ensure that an entity's first IFRS financial statements contain high-quality information that is transparent, comparable, and provides a suitable starting point for IFRS accounting.",
    effectiveDate: "2009-07-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise all assets and liabilities whose recognition is required by IFRS",
      "Derecognise items as assets or liabilities if IFRS does not permit such recognition",
      "Reclassify items recognised under previous GAAP as one type but classified differently under IFRS"
    ],
    measurementInitial: [
      "Measure all recognised assets and liabilities at amounts required by IFRS"
    ],
    measurementSubsequent: [
      "Apply IFRS measurement requirements prospectively from the date of transition unless specific exemptions apply"
    ],
    presentationRequirements: [
      "Present at least three statements of financial position (date of transition, end of first IFRS period, comparative period)",
      "Explain how the transition from previous GAAP to IFRS affected reported financial position, performance, and cash flows"
    ],
    disclosureRequirements: [
      "Reconciliation of equity reported under previous GAAP to equity under IFRS at date of transition and end of latest period under previous GAAP",
      "Reconciliation to total comprehensive income under IFRS for latest period under previous GAAP",
      "Recognition or reversal of impairment losses during transition"
    ],
    recentAmendments: [
      { year: 2024, description: "Annual Improvements 2023 cycle — minor editorial amendments" }
    ],
    transitionProvisions: [
      "Mandatory exceptions include estimates, derecognition of financial instruments, hedge accounting, non-controlling interests, and classification of financial instruments",
      "Optional exemptions cover areas such as business combinations, share-based payments, insurance contracts, fair value as deemed cost, leases, and cumulative translation differences"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 2",
    title: "Share-based Payment",
    scope: "Applies to all share-based payment transactions including equity-settled, cash-settled, and transactions with cash alternatives.",
    keyPrinciples: [
      "Recognise goods or services received in share-based payment transactions when obtained",
      "Equity-settled transactions measured at fair value of goods/services received or, if not reliably measurable, at fair value of equity instruments granted",
      "Cash-settled transactions measured at fair value of the liability",
      "Vesting conditions and non-vesting conditions treatment"
    ],
    ukRelevance: "Critical for UK listed companies operating employee share schemes, enterprise management incentive (EMI) plans, and long-term incentive plans (LTIPs).",
    objective: "To specify the financial reporting by an entity when it undertakes a share-based payment transaction, including the effects on profit or loss and financial position.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise goods or services received when obtained",
      "Corresponding increase in equity for equity-settled transactions",
      "Corresponding liability for cash-settled transactions"
    ],
    measurementInitial: [
      "Equity-settled: fair value of equity instruments at grant date",
      "Cash-settled: fair value of the liability at each reporting date",
      "Transactions with employees: fair value of equity instruments granted"
    ],
    measurementSubsequent: [
      "Equity-settled: no remeasurement after vesting date",
      "Cash-settled: remeasure liability at fair value at each reporting date until settlement",
      "Modifications: recognise incremental fair value if beneficial to the employee"
    ],
    presentationRequirements: [
      "Expense recognised in profit or loss over the vesting period",
      "Equity component presented within equity for equity-settled transactions"
    ],
    disclosureRequirements: [
      "Nature and extent of share-based payment arrangements",
      "How the fair value of goods/services or equity instruments was determined",
      "Effect of share-based payment transactions on profit or loss and financial position"
    ],
    recentAmendments: [
      { year: 2018, description: "Classification and Measurement of Share-based Payment Transactions — amendments addressing vesting conditions, modifications, and classification" }
    ],
    transitionProvisions: [
      "Applied retrospectively for equity-settled share-based payments granted after 7 November 2002 and not yet vested at effective date",
      "Encouraged to apply to other equity instruments if fair value information was available"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 3",
    title: "Business Combinations",
    scope: "Applies to transactions or events that meet the definition of a business combination, excluding combinations of entities under common control, formation of joint ventures, and acquisition of assets that do not constitute a business.",
    keyPrinciples: [
      "Acquisition method for all business combinations",
      "Identify the acquirer",
      "Determine the acquisition date",
      "Recognise and measure identifiable assets acquired, liabilities assumed, and any non-controlling interest",
      "Recognise and measure goodwill or a gain from a bargain purchase"
    ],
    ukRelevance: "Key standard for UK M&A activity; interacts with UK Competition and Markets Authority (CMA) considerations and UK Companies Act 2006 group accounting requirements.",
    objective: "To improve the relevance, reliability, and comparability of the information that an entity provides about business combinations and their effects.",
    effectiveDate: "2009-07-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise identifiable assets acquired and liabilities assumed that meet the Framework definition at acquisition date",
      "Recognise goodwill as the excess of consideration over net identifiable assets",
      "Recognise a bargain purchase gain in profit or loss"
    ],
    measurementInitial: [
      "Identifiable assets and liabilities measured at acquisition-date fair value",
      "Non-controlling interests measured at fair value or proportionate share of net assets",
      "Consideration transferred measured at fair value"
    ],
    measurementSubsequent: [
      "Goodwill not amortised but tested for impairment annually under IAS 36",
      "Contingent consideration remeasured at fair value with changes in profit or loss",
      "Measurement period adjustments within 12 months of acquisition date"
    ],
    presentationRequirements: [
      "Consolidated from acquisition date",
      "Goodwill presented as a separate line item on the statement of financial position"
    ],
    disclosureRequirements: [
      "Nature and financial effect of business combinations during and after the reporting period",
      "Consideration transferred, assets acquired, and liabilities assumed at fair value",
      "Goodwill recognised and factors giving rise to it",
      "Gain on bargain purchase and reasons"
    ],
    recentAmendments: [
      { year: 2024, description: "Amendments regarding reference to the Conceptual Framework and updating definitions" },
      { year: 2020, description: "Amendments updating the definition of a business and providing application guidance" }
    ],
    transitionProvisions: [
      "Applied prospectively to business combinations on or after the effective date",
      "Previous business combinations not restated"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 5",
    title: "Non-current Assets Held for Sale and Discontinued Operations",
    scope: "Applies to all non-current assets and disposal groups except deferred tax assets, assets arising from employee benefits, financial assets within the scope of IFRS 9, investment property measured at fair value under IAS 40, and biological assets measured at fair value less costs to sell under IAS 41.",
    keyPrinciples: [
      "Classification of non-current assets (or disposal groups) as held for sale when their carrying amount will be recovered principally through sale rather than continuing use",
      "Measurement at the lower of carrying amount and fair value less costs to sell",
      "Separate presentation in the statement of financial position",
      "Discontinued operations presented separately in the statement of comprehensive income"
    ],
    ukRelevance: "Important for UK corporate restructurings, demergers, and disposal programmes. Interacts with UK Companies Act requirements for group accounts.",
    objective: "To specify the accounting for assets held for sale and the presentation and disclosure of discontinued operations.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Asset must be available for immediate sale in present condition",
      "Sale must be highly probable — management committed to a plan, active programme to locate buyer initiated, and sale expected to be completed within one year"
    ],
    measurementInitial: [
      "Measured at the lower of carrying amount and fair value less costs to sell at the date of classification"
    ],
    measurementSubsequent: [
      "Continue to measure at the lower of carrying amount and fair value less costs to sell",
      "Non-current assets classified as held for sale are not depreciated or amortised",
      "Impairment losses recognised for reductions to fair value less costs to sell"
    ],
    presentationRequirements: [
      "Present assets held for sale separately from other assets in the statement of financial position",
      "Present liabilities of a disposal group separately from other liabilities",
      "Present results of discontinued operations separately in the statement of comprehensive income"
    ],
    disclosureRequirements: [
      "Description of the non-current asset or disposal group",
      "Description of facts and circumstances of the sale",
      "Gain or loss recognised, and the segment in which the asset is reported under IFRS 8"
    ],
    recentAmendments: [
      { year: 2017, description: "Annual Improvements — clarification of scope for assets reclassified from held for sale to held for distribution" }
    ],
    transitionProvisions: [
      "Applied prospectively to non-current assets meeting held-for-sale criteria after the effective date"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 6",
    title: "Exploration for and Evaluation of Mineral Resources",
    scope: "Applies to expenditures incurred in relation to the exploration for and evaluation of mineral resources before the technical feasibility and commercial viability of extracting a mineral resource are demonstrable.",
    keyPrinciples: [
      "Permits entities to develop an accounting policy for exploration and evaluation assets",
      "Exploration and evaluation assets tested for impairment when facts and circumstances suggest carrying amount may exceed recoverable amount",
      "Temporary exemption from certain requirements of IAS 8 in developing accounting policies"
    ],
    ukRelevance: "Relevant for UK-listed mining and oil & gas companies, particularly those with operations in North Sea and international exploration licences.",
    objective: "To specify the financial reporting for the exploration for and evaluation of mineral resources.",
    effectiveDate: "2006-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Exploration and evaluation expenditures recognised as assets when the entity's accounting policy permits",
      "Entity must determine a policy specifying which expenditures are recognised as exploration and evaluation assets"
    ],
    measurementInitial: [
      "Measured at cost"
    ],
    measurementSubsequent: [
      "Entity may apply either the cost model or the revaluation model after recognition",
      "Test for impairment when indicators suggest the carrying amount may not be recoverable"
    ],
    presentationRequirements: [
      "Classify exploration and evaluation assets as tangible or intangible according to their nature",
      "Reclassify when technical feasibility and commercial viability are demonstrable"
    ],
    disclosureRequirements: [
      "Accounting policies for exploration and evaluation expenditures",
      "Amounts of assets, liabilities, income, expense, and cash flows arising from exploration and evaluation"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "If impracticable to apply a particular requirement to comparative information, disclose that fact"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 7",
    title: "Financial Instruments: Disclosures",
    scope: "Applies to all entities for all types of financial instruments, except interests in subsidiaries, associates and joint ventures accounted for under IFRS 10, IAS 27 or IAS 28, and certain other exceptions.",
    keyPrinciples: [
      "Disclose information enabling users to evaluate the significance of financial instruments for financial position and performance",
      "Disclose information enabling users to evaluate the nature and extent of risks arising from financial instruments",
      "Qualitative and quantitative disclosures about credit risk, liquidity risk, and market risk"
    ],
    ukRelevance: "Essential for UK banks, insurance companies, and listed entities. FCA and PRA regulatory requirements build upon IFRS 7 disclosures.",
    objective: "To require disclosures that enable users of financial statements to evaluate the significance of financial instruments and the nature and extent of risks arising from them.",
    effectiveDate: "2007-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [
      "Group financial instruments into classes appropriate to the nature of the information disclosed",
      "Provide sufficient information to permit reconciliation to line items in the statement of financial position"
    ],
    disclosureRequirements: [
      "Carrying amounts of financial assets and liabilities by IFRS 9 category",
      "Fair value of each class of financial assets and liabilities",
      "Credit risk: maximum exposure, credit quality, expected credit losses",
      "Liquidity risk: maturity analysis for financial liabilities",
      "Market risk: sensitivity analysis for each type of market risk",
      "Hedge accounting: risk management strategy, effect on financial statements, amounts and timing of future cash flows"
    ],
    recentAmendments: [
      { year: 2024, description: "Amendments for supplier finance arrangements disclosure requirements" },
      { year: 2020, description: "Interest Rate Benchmark Reform Phase 2 — additional disclosures" }
    ],
    transitionProvisions: [
      "Comparatives not required in first year of application for certain disclosures"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 8",
    title: "Operating Segments",
    scope: "Applies to entities whose debt or equity instruments are traded in a public market or that file financial statements with a securities commission or other regulatory organisation for the purpose of issuing any class of instruments in a public market.",
    keyPrinciples: [
      "Management approach — segments based on internal reports reviewed by the chief operating decision maker (CODM)",
      "Aggregation criteria for operating segments",
      "Quantitative thresholds for reportable segments (10% tests)",
      "Entity-wide disclosures about products/services, geographical areas, and major customers"
    ],
    ukRelevance: "Applicable to all UK-listed entities. The FCA considers segment reporting a key element for transparency.",
    objective: "To require an entity to disclose information to enable users to evaluate the nature and financial effects of the business activities in which it engages and the economic environments in which it operates.",
    effectiveDate: "2009-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "An operating segment is a component of an entity that engages in business activities, whose results are regularly reviewed by the CODM, and for which discrete financial information is available"
    ],
    measurementInitial: [],
    measurementSubsequent: [
      "Report the measure of segment profit or loss and segment assets and liabilities as reported to the CODM"
    ],
    presentationRequirements: [
      "Present reportable segments separately",
      "Reconciliation of segment totals to entity totals"
    ],
    disclosureRequirements: [
      "General information about how operating segments were identified",
      "Types of products and services from which each segment derives revenues",
      "Measure of profit or loss and total assets for each reportable segment",
      "Reconciliations of segment revenues, profit or loss, assets, liabilities to entity amounts",
      "Entity-wide disclosures — revenues from external customers by product/service and by geographical area, and information about major customers"
    ],
    recentAmendments: [
      { year: 2023, description: "Amendments to improve reportable segment disclosures — additional measures of segment profit or loss" }
    ],
    transitionProvisions: [
      "Applied retrospectively; comparative information restated"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 9",
    title: "Financial Instruments",
    scope: "Applies to all financial assets and financial liabilities within the scope of IAS 39, including loan commitments and certain contracts to buy or sell non-financial items.",
    keyPrinciples: [
      "Classification based on business model and contractual cash flow characteristics",
      "Three measurement categories: amortised cost, fair value through other comprehensive income (FVOCI), and fair value through profit or loss (FVTPL)",
      "Expected credit loss (ECL) impairment model",
      "Hedge accounting aligned with risk management activities"
    ],
    ukRelevance: "Fundamental for UK banking sector (PRA supervisory expectations), listed entities, and any entity holding financial instruments. Key focus area for UK audit firms.",
    objective: "To establish principles for the financial reporting of financial assets and financial liabilities that will present relevant and useful information to users of financial statements for their assessment of the amounts, timing, and uncertainty of future cash flows.",
    effectiveDate: "2018-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise a financial asset or liability when the entity becomes party to the contractual provisions of the instrument",
      "Regular way purchases and sales recognised at trade date or settlement date"
    ],
    measurementInitial: [
      "Financial assets: at fair value plus (for items not at FVTPL) transaction costs directly attributable to acquisition",
      "Financial liabilities: at fair value minus (for items not at FVTPL) transaction costs"
    ],
    measurementSubsequent: [
      "Amortised cost: using the effective interest method",
      "FVOCI: fair value changes in OCI, interest and impairment in profit or loss",
      "FVTPL: all changes in fair value in profit or loss",
      "ECL model: 12-month ECL for Stage 1, lifetime ECL for Stage 2 and Stage 3"
    ],
    presentationRequirements: [
      "Offset financial assets and liabilities only when there is a legally enforceable right to set off and intention to settle net",
      "Own credit changes for liabilities designated at FVTPL presented in OCI"
    ],
    disclosureRequirements: [
      "Refer to IFRS 7 for comprehensive disclosure requirements",
      "Transition disclosures including reclassification and remeasurement"
    ],
    recentAmendments: [
      { year: 2024, description: "Amendments for classification of financial instruments with ESG-linked features" },
      { year: 2021, description: "Annual Improvements — fees in the 10% test for derecognition of financial liabilities" },
      { year: 2020, description: "Interest Rate Benchmark Reform Phase 2 — practical expedient for modifications" }
    ],
    transitionProvisions: [
      "Generally applied retrospectively with certain exceptions",
      "Comparative information not required to be restated (permitted but not required)",
      "Transition disclosures required"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 10",
    title: "Consolidated Financial Statements",
    scope: "Applies to entities that control one or more other entities, except as noted in limited exemptions for certain parent entities.",
    keyPrinciples: [
      "Control as the single basis for consolidation",
      "Three elements of control: power over the investee, exposure or rights to variable returns, and ability to use power to affect returns",
      "Consolidation procedures",
      "Investment entities exception"
    ],
    ukRelevance: "Governs UK group accounting. Interacts with UK Companies Act 2006 requirements for consolidated accounts. Relevant for complex UK group structures and SPEs.",
    objective: "To establish principles for the presentation and preparation of consolidated financial statements when an entity controls one or more other entities.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "A parent controls an investee when it has power over the investee, exposure or rights to variable returns, and the ability to use its power to affect those returns"
    ],
    measurementInitial: [],
    measurementSubsequent: [
      "Combine like items of assets, liabilities, equity, income, expenses, and cash flows of the parent with those of its subsidiaries",
      "Eliminate intragroup transactions and balances"
    ],
    presentationRequirements: [
      "Present consolidated financial statements that present the group as a single economic entity",
      "Non-controlling interests presented in equity, separately from equity attributable to the parent"
    ],
    disclosureRequirements: [
      "Refer to IFRS 12 for comprehensive disclosure requirements regarding interests in subsidiaries"
    ],
    recentAmendments: [
      { year: 2022, description: "Sale or Contribution of Assets between an Investor and its Associate or Joint Venture — deferred indefinitely" },
      { year: 2014, description: "Investment Entities: Applying the Consolidation Exception" }
    ],
    transitionProvisions: [
      "Applied retrospectively, subject to certain transitional provisions",
      "If the consolidation conclusion is different on initial application, an entity must retrospectively adjust"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 11",
    title: "Joint Arrangements",
    scope: "Applies to all entities that are a party to a joint arrangement.",
    keyPrinciples: [
      "Classification of joint arrangements as joint operations or joint ventures based on rights and obligations",
      "Joint operators recognise their assets, liabilities, revenues, and expenses",
      "Joint venturers apply the equity method under IAS 28",
      "Structure and legal form of the arrangement as well as contractual terms considered in classification"
    ],
    ukRelevance: "Relevant for UK entities in joint ventures and PPP/PFI arrangements. Common in UK real estate, energy, and infrastructure sectors.",
    objective: "To establish principles for financial reporting by entities that have an interest in arrangements that are controlled jointly.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Joint control exists when decisions about the relevant activities require the unanimous consent of the parties sharing control",
      "Joint operation: parties have rights to the assets and obligations for the liabilities",
      "Joint venture: parties have rights to the net assets of the arrangement"
    ],
    measurementInitial: [],
    measurementSubsequent: [
      "Joint operations: recognise assets, liabilities, revenues, and expenses in accordance with applicable IFRSs",
      "Joint ventures: equity method in accordance with IAS 28"
    ],
    presentationRequirements: [
      "Joint operations: line-by-line inclusion of the entity's share",
      "Joint ventures: single line (equity method) in the statement of financial position"
    ],
    disclosureRequirements: [
      "Refer to IFRS 12 for comprehensive disclosure requirements"
    ],
    recentAmendments: [
      { year: 2017, description: "Annual Improvements — clarification that previously held interests in a joint operation are not remeasured when obtaining joint control" }
    ],
    transitionProvisions: [
      "Applied retrospectively, subject to certain transitional provisions",
      "Joint ventures previously proportionately consolidated must transition to equity method"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 12",
    title: "Disclosure of Interests in Other Entities",
    scope: "Applies to entities that have an interest in subsidiaries, joint arrangements, associates, or unconsolidated structured entities.",
    keyPrinciples: [
      "Disclosure of information to evaluate the nature of and risks associated with interests in other entities",
      "Disclosure of the effects of those interests on financial position, financial performance, and cash flows",
      "Significant judgements and assumptions"
    ],
    ukRelevance: "Important for complex UK group structures, SPVs, and securitisation vehicles. FRC has issued guidance on IFRS 12 disclosure quality.",
    objective: "To require disclosures that enable users to evaluate the nature of, and risks associated with, interests in other entities and the effects of those interests on the entity's financial position, performance, and cash flows.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [
      "Significant judgements and assumptions made in determining the nature of the interest",
      "Information about interests in subsidiaries — composition of the group, NCI, restrictions, consolidation changes",
      "Information about interests in joint arrangements and associates — nature, extent, and financial effects",
      "Information about interests in unconsolidated structured entities — nature of interests, risks, and sponsorship"
    ],
    recentAmendments: [
      { year: 2017, description: "Clarification that disclosure requirements apply to interests classified as held for sale under IFRS 5" }
    ],
    transitionProvisions: [
      "Applied from the first annual period of application; comparatives not required if information is not available"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 13",
    title: "Fair Value Measurement",
    scope: "Applies when another IFRS requires or permits fair value measurements or disclosures about fair value measurements, with certain exceptions such as share-based payment transactions (IFRS 2), leasing transactions (IFRS 16), and net realisable value (IAS 2).",
    keyPrinciples: [
      "Fair value defined as the price to sell an asset or transfer a liability in an orderly transaction between market participants at the measurement date (exit price)",
      "Fair value hierarchy: Level 1 (quoted prices), Level 2 (observable inputs), Level 3 (unobservable inputs)",
      "Highest and best use for non-financial assets",
      "Principal or most advantageous market"
    ],
    ukRelevance: "Critical for UK valuation practice. RICS Red Book valuations interact with IFRS 13. Key for UK investment property, financial instruments, and impairment testing.",
    objective: "To define fair value, set out a framework for measuring fair value, and require disclosures about fair value measurements.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [
      "Fair value at initial recognition is normally the transaction price unless otherwise indicated"
    ],
    measurementSubsequent: [
      "Market approach, income approach, or cost approach",
      "Use of observable market data maximised; unobservable inputs minimised",
      "Consistent application of the fair value hierarchy"
    ],
    presentationRequirements: [],
    disclosureRequirements: [
      "Fair value hierarchy level for recurring and non-recurring fair value measurements",
      "Transfers between Level 1 and Level 2",
      "Valuation techniques and inputs used for Level 2 and Level 3 measurements",
      "Reconciliation of Level 3 fair value measurements",
      "Sensitivity to changes in unobservable inputs for Level 3"
    ],
    recentAmendments: [
      { year: 2022, description: "Minor editorial improvements" }
    ],
    transitionProvisions: [
      "Applied prospectively from the beginning of the annual period in which it is initially applied"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 15",
    title: "Revenue from Contracts with Customers",
    scope: "Applies to all contracts with customers except leases (IFRS 16), insurance contracts (IFRS 17), financial instruments (IFRS 9), and certain non-monetary exchanges between entities in the same line of business.",
    keyPrinciples: [
      "Five-step revenue recognition model",
      "Step 1: Identify the contract with a customer",
      "Step 2: Identify the performance obligations in the contract",
      "Step 3: Determine the transaction price",
      "Step 4: Allocate the transaction price to performance obligations",
      "Step 5: Recognise revenue when (or as) a performance obligation is satisfied"
    ],
    ukRelevance: "Core revenue standard for all UK entities. Significant impact on UK construction, technology, telecommunications, and real estate sectors.",
    objective: "To establish the principles that an entity applies to report useful information about the nature, amount, timing, and uncertainty of revenue and cash flows arising from a contract with a customer.",
    effectiveDate: "2018-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Revenue recognised when (or as) a performance obligation is satisfied by transferring a promised good or service to a customer",
      "Transfer occurs when the customer obtains control of that good or service",
      "Satisfied over time or at a point in time"
    ],
    measurementInitial: [
      "Transaction price: the amount of consideration to which the entity expects to be entitled",
      "Variable consideration constrained to the amount for which it is highly probable a significant reversal will not occur"
    ],
    measurementSubsequent: [
      "Changes in transaction price allocated to performance obligations on the same basis as initial allocation",
      "Contract modifications assessed for whether they create new or modify existing contracts"
    ],
    presentationRequirements: [
      "Contract asset or contract liability presented for each contract",
      "Receivable recognised when the right to consideration is unconditional"
    ],
    disclosureRequirements: [
      "Disaggregation of revenue",
      "Contract balances (receivables, contract assets, contract liabilities)",
      "Performance obligations — description, timing, significant payment terms",
      "Significant judgements — timing of satisfaction, transaction price, allocation",
      "Assets recognised from costs to obtain or fulfil a contract"
    ],
    recentAmendments: [
      { year: 2021, description: "Annual Improvements — clarification regarding identification of performance obligations" }
    ],
    transitionProvisions: [
      "Full retrospective method or modified retrospective method with cumulative effect at date of initial application"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 16",
    title: "Leases",
    scope: "Applies to all leases including subleases, with exceptions for short-term leases, leases of low-value assets, leases to explore for or use minerals/oil/gas, licences of intellectual property (IFRS 15), and biological assets (IAS 41).",
    keyPrinciples: [
      "Single lessee accounting model — right-of-use asset and lease liability recognised for most leases",
      "Lessor accounting substantially carried forward from IAS 17 (finance and operating lease classification)",
      "Lease identification: a contract conveys the right to control the use of an identified asset for a period of time in exchange for consideration",
      "Lease term determination including reasonably certain extension/termination options"
    ],
    ukRelevance: "Major impact on UK retail, transport, and property sectors. Significant implications for UK banking covenants and regulatory capital calculations.",
    objective: "To report information that faithfully represents lease transactions and provides a basis for users to assess the amount, timing, and uncertainty of cash flows arising from leases.",
    effectiveDate: "2019-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Lessee recognises a right-of-use asset and a lease liability at the commencement date",
      "Exemptions available for short-term leases (12 months or less) and leases of low-value assets"
    ],
    measurementInitial: [
      "Right-of-use asset: initial measurement of lease liability plus lease payments made at or before commencement, plus initial direct costs, plus estimated dismantling costs, less lease incentives received",
      "Lease liability: present value of lease payments not paid at commencement date, discounted using the interest rate implicit in the lease or the lessee's incremental borrowing rate"
    ],
    measurementSubsequent: [
      "Right-of-use asset: cost model (unless entity applies fair value model under IAS 40 or revaluation model under IAS 16)",
      "Lease liability: increased by interest, reduced by lease payments, and remeasured for reassessments or modifications"
    ],
    presentationRequirements: [
      "Right-of-use assets either presented separately or disclosed separately from other assets",
      "Lease liabilities either presented separately or disclosed separately from other liabilities",
      "Depreciation and interest presented separately in profit or loss"
    ],
    disclosureRequirements: [
      "Depreciation charge for right-of-use assets by class",
      "Interest expense on lease liabilities",
      "Expense for short-term and low-value leases",
      "Total cash outflow for leases",
      "Maturity analysis of lease liabilities"
    ],
    recentAmendments: [
      { year: 2024, description: "Lease Liability in a Sale and Leaseback — amendments addressing subsequent measurement" },
      { year: 2021, description: "COVID-19-Related Rent Concessions beyond 30 June 2022 — extension of practical expedient" }
    ],
    transitionProvisions: [
      "Full retrospective approach or modified retrospective approach with cumulative catch-up",
      "Practical expedients available at transition (e.g., using hindsight to determine lease term)"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 17",
    title: "Insurance Contracts",
    scope: "Applies to insurance contracts, reinsurance contracts held, and investment contracts with discretionary participation features issued by an entity that also issues insurance contracts.",
    keyPrinciples: [
      "General measurement model (building block approach): fulfilment cash flows plus contractual service margin",
      "Premium allocation approach for short-duration contracts",
      "Variable fee approach for direct participating contracts",
      "Contractual service margin (CSM) represents unearned profit and is released over the coverage period"
    ],
    ukRelevance: "Transformative for the UK insurance sector (Lloyd's of London, major UK insurers). PRA has issued extensive supervisory guidance on IFRS 17 implementation.",
    objective: "To establish principles for the recognition, measurement, presentation, and disclosure of insurance contracts to provide relevant information that faithfully represents those contracts and gives a basis for users to assess the effect of insurance contracts on the entity's financial statements.",
    effectiveDate: "2023-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise a group of insurance contracts from the earliest of: beginning of the coverage period, date when the first payment from a policyholder becomes due, or when the group becomes onerous"
    ],
    measurementInitial: [
      "Fulfilment cash flows: estimates of future cash flows, discount rate adjustment for time value of money and financial risks, and a risk adjustment for non-financial risk",
      "Contractual service margin: expected unearned profit from the group of contracts"
    ],
    measurementSubsequent: [
      "General model: liability = fulfilment cash flows + remaining CSM",
      "CSM adjusted for changes in estimates of future cash flows related to future service and released to profit or loss over the coverage period",
      "Premium allocation approach simplification for eligible contracts"
    ],
    presentationRequirements: [
      "Insurance revenue presented in profit or loss (excludes investment components)",
      "Insurance service expenses and insurance finance income/expenses presented separately",
      "Portfolios in an asset position presented separately from those in a liability position"
    ],
    disclosureRequirements: [
      "Amounts recognised in financial statements from insurance contracts",
      "Significant judgements and changes in judgements",
      "Nature and extent of risks from insurance contracts"
    ],
    recentAmendments: [
      { year: 2025, description: "Amendments addressing the presentation requirements for comparative information upon adoption" },
      { year: 2021, description: "Amendments addressing initial application — comparative information and transition for insurers applying IFRS 9 and IFRS 17 simultaneously" }
    ],
    transitionProvisions: [
      "Full retrospective approach, modified retrospective approach, or fair value approach at transition",
      "Classification overlay for financial assets on transition"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },

  // =========================================================================
  // IFRS STANDARDS (SUPERSEDED / INTERIM)
  // =========================================================================
  {
    number: "IFRS 4",
    title: "Insurance Contracts (Superseded)",
    scope: "Previously applied to all insurance contracts and reinsurance contracts issued, and reinsurance contracts held.",
    keyPrinciples: [
      "Interim standard pending completion of IFRS 17",
      "Permitted entities to continue using existing accounting policies for insurance contracts",
      "Liability adequacy test required",
      "Limited improvements to existing practices"
    ],
    ukRelevance: "Was the primary standard for UK insurers prior to IFRS 17 adoption on 1 January 2023.",
    objective: "To specify the financial reporting for insurance contracts by any entity that issues such contracts, as an interim measure pending completion of the comprehensive insurance contracts project.",
    effectiveDate: "2005-01-01",
    status: "superseded",
    supersededBy: "IFRS 17",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRS 14",
    title: "Regulatory Deferral Accounts",
    scope: "Applies only to first-time adopters of IFRS that conduct rate-regulated activities and recognised amounts for regulatory deferral account balances under their previous GAAP.",
    keyPrinciples: [
      "Interim standard — permits first-time adopters to continue recognising regulatory deferral account balances",
      "Limited to entities conducting rate-regulated activities",
      "Does not mandate or prohibit any particular accounting treatment"
    ],
    ukRelevance: "Limited relevance in the UK as most UK regulated utilities already report under IFRS. Potentially relevant for newly acquired or transitioning entities.",
    objective: "To specify the financial reporting requirements for regulatory deferral account balances that arise when an entity provides goods or services to customers at a price or rate that is subject to rate regulation.",
    effectiveDate: "2016-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Continue to apply previous GAAP accounting policies for the recognition, measurement, impairment, and derecognition of regulatory deferral account balances"
    ],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [
      "Present regulatory deferral account balances as separate line items in the statement of financial position",
      "Present net movement in regulatory deferral account balances as separate line items in the statement of profit or loss"
    ],
    disclosureRequirements: [
      "Nature and risks associated with rate regulation",
      "Effects of rate regulation on the entity's financial statements"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "Applied on first-time adoption of IFRS only"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },

  // =========================================================================
  // IAS STANDARDS (CURRENT)
  // =========================================================================
  {
    number: "IAS 1",
    title: "Presentation of Financial Statements",
    scope: "Applies to all general purpose financial statements prepared and presented in accordance with IFRS.",
    keyPrinciples: [
      "Going concern assessment",
      "Accrual basis of accounting",
      "Materiality and aggregation",
      "No offsetting unless required or permitted",
      "Frequency of reporting (at least annually)",
      "Comparative information for prior period(s)",
      "Consistency of presentation and classification"
    ],
    ukRelevance: "Foundational for all UK IFRS reporters. Interacts with UK Companies Act 2006 and FCA Listing Rules presentation requirements.",
    objective: "To prescribe the basis for presentation of general purpose financial statements to ensure comparability both with the entity's financial statements of previous periods and with the financial statements of other entities.",
    effectiveDate: "2009-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [
      "Complete set of financial statements: statement of financial position, statement of profit or loss and OCI, statement of changes in equity, statement of cash flows, and notes",
      "Current/non-current distinction for assets and liabilities",
      "Minimum line items on the face of the statements",
      "Single statement or two-statement approach for profit or loss and OCI"
    ],
    disclosureRequirements: [
      "Disclosure of accounting policies (material accounting policies following amendments)",
      "Sources of estimation uncertainty",
      "Capital management disclosures",
      "Reclassification adjustments for OCI items"
    ],
    recentAmendments: [
      { year: 2024, description: "Amendments to require classification of liabilities as current or non-current based on covenants and conditions at the reporting date" },
      { year: 2021, description: "Disclosure of Accounting Policies — require disclosure of material rather than significant accounting policies" }
    ],
    transitionProvisions: [
      "Applied retrospectively with restatement of comparative periods"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 2",
    title: "Inventories",
    scope: "Applies to all inventories except financial instruments, biological assets related to agricultural activity, and certain broker-trader inventories measured at fair value less costs to sell.",
    keyPrinciples: [
      "Inventories measured at the lower of cost and net realisable value",
      "Cost includes costs of purchase, conversion, and other costs to bring inventories to their present location and condition",
      "Cost formulas: FIFO or weighted average cost (LIFO not permitted)",
      "Write-down to net realisable value when cost exceeds NRV"
    ],
    ukRelevance: "Applicable to all UK entities holding inventory. Interacts with UK tax rules regarding inventory valuation.",
    objective: "To prescribe the accounting treatment for inventories, providing guidance on the determination of cost and its subsequent recognition as an expense, including any write-down to net realisable value.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise as an asset when it is probable that future economic benefits will flow to the entity and the cost can be measured reliably"
    ],
    measurementInitial: [
      "Cost: purchase costs, conversion costs (direct labour, fixed and variable production overheads), and other costs incurred in bringing inventories to their present location and condition"
    ],
    measurementSubsequent: [
      "Lower of cost and net realisable value",
      "Net realisable value: estimated selling price less estimated costs of completion and estimated costs to make the sale"
    ],
    presentationRequirements: [
      "Carrying amount of inventories by classification (e.g., merchandise, raw materials, work in progress, finished goods)"
    ],
    disclosureRequirements: [
      "Accounting policies adopted for measuring inventories including the cost formula used",
      "Total carrying amount of inventories and carrying amount in classifications",
      "Amount of inventories recognised as expense during the period",
      "Amount of any write-down and reversal of write-down"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 7",
    title: "Statement of Cash Flows",
    scope: "Applies to all entities; all entities that prepare financial statements in conformity with IFRS are required to present a statement of cash flows.",
    keyPrinciples: [
      "Cash flows classified into operating, investing, and financing activities",
      "Direct or indirect method for operating activities",
      "Cash and cash equivalents defined",
      "Non-cash transactions excluded but disclosed"
    ],
    ukRelevance: "Required for all UK IFRS reporters. FRC emphasises the importance of cash flow information for UK users.",
    objective: "To require the provision of information about the historical changes in cash and cash equivalents of an entity by means of a statement of cash flows which classifies cash flows during the period from operating, investing, and financing activities.",
    effectiveDate: "1994-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [
      "Operating activities: direct or indirect method",
      "Investing activities: separate disclosure of major classes of gross cash receipts and payments",
      "Financing activities: separate disclosure of major classes of gross cash receipts and payments",
      "Foreign currency cash flows translated at rates at the dates of the cash flows"
    ],
    disclosureRequirements: [
      "Components of cash and cash equivalents and reconciliation to statement of financial position",
      "Significant non-cash investing and financing transactions",
      "Reconciliation of liabilities arising from financing activities"
    ],
    recentAmendments: [
      { year: 2016, description: "Disclosure Initiative — reconciliation of liabilities arising from financing activities" }
    ],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 8",
    title: "Accounting Policies, Changes in Accounting Estimates and Errors",
    scope: "Applies in selecting and applying accounting policies, and accounting for changes in accounting policies, changes in accounting estimates, and corrections of prior period errors.",
    keyPrinciples: [
      "Hierarchy for selecting accounting policies when no IFRS specifically applies",
      "Changes in accounting policies applied retrospectively unless impracticable",
      "Changes in accounting estimates applied prospectively",
      "Prior period errors corrected retrospectively"
    ],
    ukRelevance: "Key standard for UK IFRS reporters in ensuring consistency and transparency. FRC reviews frequently reference IAS 8 compliance.",
    objective: "To prescribe the criteria for selecting and changing accounting policies, together with the accounting treatment and disclosure of changes in accounting policies, changes in accounting estimates, and corrections of errors.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [
      "When an initial application of an IFRS has an effect on the current or any prior period: title of the IFRS, nature of change, amounts of adjustments",
      "When a voluntary change in accounting policy has an effect: nature of change, reasons, amounts of adjustments",
      "Changes in estimates: nature and amount",
      "Prior period errors: nature, amount of correction for each prior period presented"
    ],
    recentAmendments: [
      { year: 2021, description: "Definition of Accounting Estimates — clarification of the distinction between changes in accounting policies and changes in accounting estimates" }
    ],
    transitionProvisions: [
      "Changes in accounting policies generally applied retrospectively by adjusting opening balances"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 10",
    title: "Events after the Reporting Period",
    scope: "Applies to the accounting for, and disclosure of, events after the reporting period.",
    keyPrinciples: [
      "Adjusting events: events providing evidence of conditions existing at the end of the reporting period — financial statements adjusted",
      "Non-adjusting events: events indicative of conditions arising after the reporting period — disclosed but not adjusted",
      "Going concern assessment after the reporting period",
      "Dividends declared after the reporting period not recognised as a liability"
    ],
    ukRelevance: "Significant for UK audit practice. Extended reporting timelines and UK-specific events (e.g., regulatory changes) require careful assessment.",
    objective: "To prescribe when an entity should adjust its financial statements for events after the reporting period and the disclosures about the date the financial statements were authorised for issue and about events after the reporting period.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Adjusting events recognised by adjusting the amounts in the financial statements",
      "Non-adjusting events not recognised but disclosed if material"
    ],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [
      "Date when the financial statements were authorised for issue and who gave that authorisation",
      "For non-adjusting events: nature of the event and an estimate of its financial effect, or a statement that such an estimate cannot be made"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 12",
    title: "Income Taxes",
    scope: "Applies to accounting for income taxes, including all domestic and foreign taxes based on taxable profits, and withholding taxes payable by a subsidiary, associate or joint arrangement on distributions to the reporting entity.",
    keyPrinciples: [
      "Current tax for the current and prior periods measured at the amount expected to be paid to (or recovered from) taxation authorities",
      "Deferred tax recognised for temporary differences between the tax base and carrying amount of assets and liabilities",
      "Deferred tax assets recognised to the extent it is probable that taxable profit will be available",
      "Tax rates: enacted or substantively enacted rates expected to apply"
    ],
    ukRelevance: "Fundamental for UK IFRS reporters. HMRC tax rules and UK corporation tax rates interact closely with IAS 12 computations. Pillar Two implications increasingly relevant.",
    objective: "To prescribe the accounting treatment for income taxes, addressing how to account for the current and future tax consequences of the future recovery or settlement of the carrying amount of assets and liabilities, and transactions and other events of the current period.",
    effectiveDate: "1998-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Current tax liability (asset) recognised for the tax payable (recoverable) in respect of the taxable profit (loss) for the current and prior periods",
      "Deferred tax liability recognised for all taxable temporary differences, with certain exceptions",
      "Deferred tax asset recognised for deductible temporary differences, unused tax losses and unused tax credits, to the extent probable that taxable profit will be available"
    ],
    measurementInitial: [
      "Current tax: at amounts expected to be paid or recovered using enacted or substantively enacted tax rates",
      "Deferred tax: at the tax rates expected to apply when the asset is realised or the liability is settled"
    ],
    measurementSubsequent: [
      "Reassess unrecognised deferred tax assets at each reporting date",
      "Deferred tax measured using enacted or substantively enacted rates"
    ],
    presentationRequirements: [
      "Tax expense (income) related to profit or loss from ordinary activities presented in the statement of profit or loss",
      "Deferred tax assets and liabilities offset only if legally enforceable right exists and same taxation authority"
    ],
    disclosureRequirements: [
      "Major components of tax expense (income)",
      "Effective tax rate reconciliation",
      "Amount of deductible temporary differences, unused tax losses and unused tax credits for which no deferred tax asset is recognised",
      "Aggregate amount of temporary differences associated with investments in subsidiaries for which deferred tax liabilities have not been recognised"
    ],
    recentAmendments: [
      { year: 2023, description: "International Tax Reform — Pillar Two Model Rules: temporary mandatory exception from deferred tax accounting for Pillar Two income taxes and targeted disclosure requirements" },
      { year: 2023, description: "Deferred Tax related to Assets and Liabilities arising from a Single Transaction — narrowed the initial recognition exception" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 16",
    title: "Property, Plant and Equipment",
    scope: "Applies to the accounting for property, plant and equipment except where another standard requires or permits a different accounting treatment (e.g., IFRS 5, IAS 40, IAS 41, IFRS 6).",
    keyPrinciples: [
      "Recognised when it is probable that future economic benefits will flow to the entity and cost can be measured reliably",
      "Measured initially at cost",
      "Subsequently measured using cost model or revaluation model",
      "Depreciated over useful life; residual value, useful life, and depreciation method reviewed at least annually"
    ],
    ukRelevance: "Major standard for UK entities with significant tangible assets. Interacts with UK capital allowances regime.",
    objective: "To prescribe the accounting treatment for property, plant and equipment so that users can discern information about an entity's investment in its property, plant and equipment and the changes in such investment.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "It is probable that future economic benefits associated with the item will flow to the entity",
      "The cost of the item can be measured reliably",
      "Cost of major inspections or overhauls included if recognition criteria are met"
    ],
    measurementInitial: [
      "Purchase price including import duties and non-refundable taxes, after deducting trade discounts and rebates",
      "Directly attributable costs of bringing the asset to the location and condition necessary for it to be capable of operating",
      "Initial estimate of dismantling and restoration costs"
    ],
    measurementSubsequent: [
      "Cost model: cost less accumulated depreciation and impairment losses",
      "Revaluation model: fair value at date of revaluation less subsequent accumulated depreciation and impairment losses",
      "Depreciation: systematic allocation of depreciable amount over the useful life"
    ],
    presentationRequirements: [
      "Present by class of property, plant and equipment",
      "Revaluation surplus reported in OCI and accumulated in equity"
    ],
    disclosureRequirements: [
      "Measurement bases, depreciation methods, useful lives or depreciation rates",
      "Gross carrying amount and accumulated depreciation at beginning and end of period",
      "Reconciliation of carrying amount at beginning and end of period",
      "Restrictions on title, pledges as security, contractual commitments for acquisition"
    ],
    recentAmendments: [
      { year: 2020, description: "Proceeds before Intended Use — costs and proceeds relating to items produced while bringing PP&E to its intended use recognised in profit or loss" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 19",
    title: "Employee Benefits",
    scope: "Applies to all employee benefits except share-based payment (IFRS 2).",
    keyPrinciples: [
      "Short-term employee benefits recognised as an expense when the employee has rendered service",
      "Post-employment benefits: defined contribution plans (expense as contributions due) and defined benefit plans (net defined benefit liability/asset)",
      "Actuarial gains and losses on defined benefit obligations recognised in OCI",
      "Other long-term benefits and termination benefits"
    ],
    ukRelevance: "Critical for UK entities with defined benefit pension schemes. Interacts with UK Pensions Regulator requirements and the Pension Protection Fund.",
    objective: "To prescribe the accounting and disclosure for employee benefits, requiring an entity to recognise a liability when an employee has provided service in exchange for benefits to be paid in the future and an expense when the entity consumes the economic benefit arising from service provided by an employee.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Recognise a liability for short-term benefits when an employee has rendered service",
      "Defined benefit: recognise net defined benefit liability (asset) on the statement of financial position",
      "Termination benefits recognised at the earlier of when the entity can no longer withdraw the offer and when it recognises related restructuring costs"
    ],
    measurementInitial: [
      "Short-term benefits: undiscounted amount expected to be paid",
      "Defined benefit obligation: projected unit credit method using actuarial assumptions"
    ],
    measurementSubsequent: [
      "Defined benefit: remeasurements (actuarial gains/losses, return on plan assets excluding interest, and changes in asset ceiling) in OCI",
      "Service cost and net interest in profit or loss"
    ],
    presentationRequirements: [
      "Net defined benefit liability/asset on the statement of financial position",
      "Service cost and net interest in profit or loss; remeasurements in OCI"
    ],
    disclosureRequirements: [
      "Characteristics of defined benefit plans and risks associated",
      "Amounts in the financial statements arising from defined benefit plans",
      "Actuarial assumptions used — discount rate, salary growth, mortality",
      "Sensitivity analysis for each significant actuarial assumption",
      "Expected contributions and maturity profile"
    ],
    recentAmendments: [
      { year: 2021, description: "Amendment to the attributability of benefits to periods of service for plans with a flat benefit formula" }
    ],
    transitionProvisions: [
      "Applied retrospectively with certain practical expedients"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 20",
    title: "Accounting for Government Grants and Disclosure of Government Assistance",
    scope: "Applies to the accounting for, and disclosure of, government grants and other forms of government assistance. Does not deal with government assistance in the form of income tax benefits.",
    keyPrinciples: [
      "Government grants recognised when there is reasonable assurance the entity will comply with conditions and the grant will be received",
      "Recognised in profit or loss on a systematic basis over the periods in which the related costs are recognised as expenses",
      "Grants related to assets either deducted from the asset or set up as deferred income",
      "Grants related to income presented as income or deducted from the related expense"
    ],
    ukRelevance: "Relevant for UK entities receiving government grants, R&D tax credits, regional development grants, and post-Brexit UK subsidy regime grants.",
    objective: "To prescribe the accounting for, and disclosure of, government grants and other forms of government assistance.",
    effectiveDate: "1984-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Reasonable assurance that the entity will comply with the conditions attaching to the grant",
      "Reasonable assurance that the grant will be received"
    ],
    measurementInitial: [
      "Non-monetary grants: at fair value or at nominal amount",
      "Monetary grants: at the amount received or receivable"
    ],
    measurementSubsequent: [
      "Recognised in profit or loss on a systematic basis over the periods in which the entity recognises as expenses the related costs which the grants are intended to compensate"
    ],
    presentationRequirements: [
      "Grants related to assets: presented as deferred income or deducted from the carrying amount of the asset",
      "Grants related to income: presented as income (separately or under 'other income') or deducted from the related expense"
    ],
    disclosureRequirements: [
      "Accounting policy adopted for grants, including the method of presentation",
      "Nature and extent of grants recognised in the financial statements",
      "Unfulfilled conditions and other contingencies attaching to recognised grants",
      "Other forms of government assistance from which the entity has directly benefited"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 21",
    title: "The Effects of Changes in Foreign Exchange Rates",
    scope: "Applies to accounting for transactions and balances in foreign currencies (except derivative transactions within the scope of IFRS 9), translating the results and financial position of foreign operations, and translating financial statements into a presentation currency.",
    keyPrinciples: [
      "Functional currency: the currency of the primary economic environment in which the entity operates",
      "Transactions in foreign currencies initially recorded at the spot rate at the date of the transaction",
      "Monetary items retranslated at the closing rate; non-monetary items at historical rate or rate at date of fair value determination",
      "Translation of foreign operations: assets and liabilities at closing rate, income and expenses at transaction dates (or average rate as approximation)"
    ],
    ukRelevance: "Essential for UK multinational groups. Post-Brexit currency volatility has heightened the importance of foreign exchange accounting for UK entities.",
    objective: "To prescribe how to include foreign currency transactions and foreign operations in the financial statements of an entity and how to translate financial statements into a presentation currency.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Foreign currency transaction recognised initially in the functional currency by applying the spot exchange rate"
    ],
    measurementInitial: [
      "Spot exchange rate at the date of the transaction"
    ],
    measurementSubsequent: [
      "Monetary items: closing rate at each reporting date",
      "Non-monetary items at historical cost: exchange rate at the date of the transaction",
      "Non-monetary items at fair value: exchange rate at the date when fair value was determined"
    ],
    presentationRequirements: [
      "Exchange differences on monetary items recognised in profit or loss",
      "Exchange differences on translation of foreign operations recognised in OCI (cumulative translation reserve)",
      "On disposal of a foreign operation, the cumulative exchange differences recognised in OCI are reclassified to profit or loss"
    ],
    disclosureRequirements: [
      "Amount of exchange differences recognised in profit or loss",
      "Net exchange differences recognised in OCI and accumulated in a separate component of equity",
      "Functional currency and reason if the presentation currency is different from the functional currency"
    ],
    recentAmendments: [
      { year: 2021, description: "Lack of Exchangeability — guidance on determining the exchange rate when a currency is not exchangeable" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 23",
    title: "Borrowing Costs",
    scope: "Applies to borrowing costs that are directly attributable to the acquisition, construction or production of a qualifying asset.",
    keyPrinciples: [
      "Borrowing costs directly attributable to the acquisition, construction or production of a qualifying asset are capitalised",
      "A qualifying asset is one that necessarily takes a substantial period of time to get ready for its intended use or sale",
      "Other borrowing costs recognised as an expense in the period incurred",
      "Capitalisation rate based on the weighted average of borrowing costs applicable to general borrowings outstanding"
    ],
    ukRelevance: "Particularly relevant for UK property development, infrastructure, and construction entities. Interacts with UK tax deductibility of interest.",
    objective: "To prescribe the accounting treatment for borrowing costs, requiring the capitalisation of borrowing costs that are directly attributable to the acquisition, construction or production of a qualifying asset.",
    effectiveDate: "2009-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Capitalise borrowing costs that are directly attributable to a qualifying asset",
      "Begin capitalisation when expenditures are being incurred, borrowing costs are being incurred, and activities necessary to prepare the asset are in progress"
    ],
    measurementInitial: [
      "For specific borrowings: actual borrowing costs less investment income on temporary investment of those borrowings",
      "For general borrowings: capitalisation rate applied to expenditures on the qualifying asset"
    ],
    measurementSubsequent: [
      "Suspend capitalisation during extended periods when active development is interrupted",
      "Cease capitalisation when substantially all activities necessary to prepare the asset are complete"
    ],
    presentationRequirements: [],
    disclosureRequirements: [
      "Amount of borrowing costs capitalised during the period",
      "Capitalisation rate used"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "Applied prospectively from the effective date"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 24",
    title: "Related Party Disclosures",
    scope: "Applies to identifying related party relationships and transactions, outstanding balances, including commitments, between an entity and its related parties, and determining the disclosures to be made.",
    keyPrinciples: [
      "Broad definition of related parties including parent, subsidiaries, associates, joint ventures, key management personnel, and close family members",
      "Disclosure of related party transactions and outstanding balances",
      "Disclosure of compensation paid to key management personnel",
      "Government-related entity exemptions for certain disclosures"
    ],
    ukRelevance: "Key for UK corporate governance. Interacts with FCA Listing Rules (LR 11) and UK Companies Act 2006 related party disclosure requirements.",
    objective: "To ensure that an entity's financial statements contain the disclosures necessary to draw attention to the possibility that its financial position and profit or loss may have been affected by the existence of related parties and by transactions and outstanding balances with such parties.",
    effectiveDate: "2011-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [
      "Name of the parent and ultimate controlling party",
      "Key management personnel compensation in total and by category (short-term benefits, post-employment, other long-term, termination, share-based payment)",
      "Nature of the related party relationship and information about the transactions and outstanding balances",
      "Commitments with related parties"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 26",
    title: "Accounting and Reporting by Retirement Benefit Plans",
    scope: "Applies to the financial statements of retirement benefit plans.",
    keyPrinciples: [
      "Reporting by defined contribution plans: statement of net assets available for benefits and a description of the funding policy",
      "Reporting by defined benefit plans: statement of net assets available for benefits and the actuarial present value of promised retirement benefits",
      "Investments reported at fair value",
      "Actuarial valuations for defined benefit plans"
    ],
    ukRelevance: "Relevant for UK pension scheme trustees and their financial reporting. Interacts with The Pensions Regulator requirements.",
    objective: "To specify the accounting and reporting for retirement benefit plans as separate reporting entities.",
    effectiveDate: "1988-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [
      "Investments at fair value",
      "Actuarial present value of promised retirement benefits using either current or projected salary levels"
    ],
    presentationRequirements: [
      "Statement of net assets available for benefits",
      "For defined benefit plans: actuarial present value of promised benefits (either in the statements or in an accompanying actuarial report)"
    ],
    disclosureRequirements: [
      "Statement of changes in net assets available for benefits",
      "Summary of significant accounting policies",
      "Description of the plan and effect of any changes during the period"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 27",
    title: "Separate Financial Statements",
    scope: "Applies to entities that prepare separate financial statements in which investments in subsidiaries, joint ventures and associates are accounted for either at cost, under IFRS 9, or using the equity method.",
    keyPrinciples: [
      "Separate financial statements are those presented in addition to or instead of consolidated financial statements",
      "Investments in subsidiaries, joint ventures, and associates accounted for at cost, in accordance with IFRS 9, or using the equity method",
      "Dividends from subsidiaries, joint ventures, and associates recognised in profit or loss when the right to receive is established"
    ],
    ukRelevance: "Relevant for UK parent entities presenting separate (entity-level) financial statements alongside group accounts. Common in UK private company reporting.",
    objective: "To prescribe the accounting and disclosure requirements for investments in subsidiaries, joint ventures and associates when an entity prepares separate financial statements.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Investments in subsidiaries, joint ventures, and associates recognised at cost, under IFRS 9, or using the equity method in separate financial statements"
    ],
    measurementInitial: [
      "At cost, or in accordance with IFRS 9, or using the equity method"
    ],
    measurementSubsequent: [
      "Same basis as initial measurement",
      "Dividends recognised in profit or loss when the right to receive is established"
    ],
    presentationRequirements: [
      "Identify financial statements as separate financial statements and distinguish from consolidated or individual financial statements"
    ],
    disclosureRequirements: [
      "List of significant investments in subsidiaries, joint ventures, and associates",
      "Method used to account for those investments",
      "Reason for preparing separate financial statements if not required by law"
    ],
    recentAmendments: [
      { year: 2014, description: "Equity Method in Separate Financial Statements — permits equity method as an option" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 28",
    title: "Investments in Associates and Joint Ventures",
    scope: "Applies to entities that have significant influence or joint control over an investee.",
    keyPrinciples: [
      "Significant influence: power to participate in the financial and operating policy decisions of the investee (rebuttable presumption at 20% or more of voting power)",
      "Equity method applied from the date significant influence or joint control is obtained",
      "Share of profit or loss of the investee recognised in profit or loss",
      "Carrying amount adjusted for the investor's share of changes in the investee's equity"
    ],
    ukRelevance: "Key for UK groups with associated companies and joint ventures. Common in UK sectors such as real estate, energy, and financial services.",
    objective: "To prescribe the accounting for investments in associates and joint ventures and to set out the requirements for the application of the equity method when accounting for investments in associates and joint ventures.",
    effectiveDate: "2013-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Significant influence: 20% or more of the voting power (rebuttable presumption)",
      "Joint control: contractually agreed sharing of control (per IFRS 11)"
    ],
    measurementInitial: [
      "Recognised at cost including transaction costs"
    ],
    measurementSubsequent: [
      "Equity method: carrying amount adjusted for the investor's share of profit or loss and OCI of the investee",
      "Distributions received reduce carrying amount",
      "Impairment testing under IAS 36 when indicators exist"
    ],
    presentationRequirements: [
      "Single line in the statement of financial position",
      "Share of profit or loss presented in profit or loss after operating profit"
    ],
    disclosureRequirements: [
      "Fair value of investments in associates and joint ventures for which there are published price quotations",
      "Summarised financial information of associates and joint ventures",
      "Nature and extent of significant restrictions on the ability of associates or joint ventures to transfer funds",
      "Unrecognised share of losses"
    ],
    recentAmendments: [
      { year: 2017, description: "Long-term Interests in Associates and Joint Ventures — clarification that IFRS 9 applies to long-term interests before equity method is applied" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 29",
    title: "Financial Reporting in Hyperinflationary Economies",
    scope: "Applies to the financial statements, including consolidated financial statements, of any entity whose functional currency is the currency of a hyperinflationary economy.",
    keyPrinciples: [
      "Financial statements restated in terms of the measuring unit current at the end of the reporting period",
      "Indicators of hyperinflation (including cumulative inflation rate over three years approaching or exceeding 100%)",
      "Non-monetary items restated using a general price index",
      "Gain or loss on net monetary position recognised in profit or loss"
    ],
    ukRelevance: "Relevant for UK groups with subsidiaries operating in hyperinflationary economies (e.g., Turkey, Argentina, Zimbabwe).",
    objective: "To establish specific standards for entities reporting in the currency of a hyperinflationary economy, so that the financial information provided is meaningful.",
    effectiveDate: "1990-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [
      "Monetary items not restated (already expressed in the measuring unit current at the reporting date)",
      "Non-monetary items restated by applying a general price index from the date of acquisition or contribution",
      "All items in the statement of comprehensive income restated by applying the change in the general price index from the dates when items were initially recorded"
    ],
    presentationRequirements: [
      "All amounts stated in terms of the measuring unit current at the end of the reporting period",
      "Comparative amounts restated similarly"
    ],
    disclosureRequirements: [
      "Fact that financial statements have been restated for changes in the general purchasing power of the functional currency",
      "Whether the financial statements are based on a historical cost or current cost approach",
      "Identity and level of the price index at the reporting date and movements during the period"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 32",
    title: "Financial Instruments: Presentation",
    scope: "Applies to the presentation of financial instruments and related information, including the classification of financial instruments as financial assets, financial liabilities or equity instruments, the classification of related interest, dividends, losses and gains, and the circumstances in which financial assets and financial liabilities should be offset.",
    keyPrinciples: [
      "Classification of instruments as financial liabilities or equity based on the substance of the contractual arrangement",
      "Compound financial instruments split into liability and equity components",
      "Puttable instruments and instruments with obligations arising only on liquidation may be classified as equity",
      "Offsetting financial assets and financial liabilities"
    ],
    ukRelevance: "Essential for UK entities issuing complex financial instruments. Key for UK banking and financial services sectors regarding capital instrument classification.",
    objective: "To establish principles for presenting financial instruments as liabilities or equity and for offsetting financial assets and financial liabilities.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [
      "Compound instruments: allocate the carrying amount between liability component (fair value of similar liability without equity feature) and equity component (residual)"
    ],
    measurementSubsequent: [],
    presentationRequirements: [
      "Financial instruments classified as liabilities or equity in accordance with the substance of the contractual arrangement",
      "Interest, dividends, losses, and gains relating to financial liabilities recognised in profit or loss",
      "Distributions to equity holders recognised directly in equity",
      "Offsetting requires a legally enforceable right of set-off and intention to settle on a net basis"
    ],
    disclosureRequirements: [
      "Refer to IFRS 7 for disclosure requirements",
      "Terms and conditions of compound financial instruments"
    ],
    recentAmendments: [
      { year: 2023, description: "Financial Instruments with Characteristics of Equity — amendments to clarify classification of instruments" }
    ],
    transitionProvisions: [
      "Applied retrospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 33",
    title: "Earnings per Share",
    scope: "Applies to entities whose ordinary shares or potential ordinary shares are publicly traded, and entities in the process of issuing ordinary shares or potential ordinary shares in public securities markets.",
    keyPrinciples: [
      "Basic EPS: profit attributable to ordinary equity holders divided by weighted average number of ordinary shares outstanding",
      "Diluted EPS: adjusts basic EPS for the effects of all dilutive potential ordinary shares",
      "Anti-dilution: potential ordinary shares that would increase EPS or decrease loss per share are excluded",
      "Contingently issuable shares included only when the conditions are met"
    ],
    ukRelevance: "Required for all UK-listed entities. FCA Listing Rules reference EPS as a key metric. UK analysts and investors rely heavily on EPS measures.",
    objective: "To prescribe principles for the determination and presentation of earnings per share amounts to improve performance comparisons between different entities in the same reporting period and between different reporting periods for the same entity.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [
      "Present basic and diluted EPS on the face of the statement of profit or loss for each class of ordinary shares that has a different right to share in profit for the period",
      "Present EPS from continuing operations and discontinued operations"
    ],
    disclosureRequirements: [
      "Amounts used as the numerators in calculating basic and diluted EPS and a reconciliation to profit or loss attributable to the parent",
      "Weighted average number of ordinary shares used as the denominators and a reconciliation of the denominators to each other",
      "Instruments that could potentially dilute EPS in the future but were not included in the diluted EPS calculation because they are anti-dilutive"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 34",
    title: "Interim Financial Reporting",
    scope: "Applies when an entity prepares an interim financial report, without mandating which entities should publish interim reports.",
    keyPrinciples: [
      "Minimum content: condensed statement of financial position, condensed statement of comprehensive income, condensed statement of changes in equity, condensed statement of cash flows, and selected explanatory notes",
      "Same accounting policies as annual financial statements",
      "Discrete period approach: each interim period is a standalone reporting period",
      "Materiality assessed in relation to the interim period financial data"
    ],
    ukRelevance: "UK-listed entities are required by FCA DTR 4.2 to publish half-yearly reports; IAS 34 is the applicable standard.",
    objective: "To prescribe the minimum content of an interim financial report and to prescribe the principles for recognition and measurement in complete or condensed financial statements for an interim period.",
    effectiveDate: "1999-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Same recognition criteria as annual financial statements",
      "Revenues received seasonally, cyclically or occasionally not anticipated or deferred unless it would also be appropriate at the year end"
    ],
    measurementInitial: [],
    measurementSubsequent: [
      "Same measurement principles as annual financial statements",
      "Income tax expense recognised based on the best estimate of the weighted average annual effective tax rate"
    ],
    presentationRequirements: [
      "Condensed or complete set of financial statements",
      "Comparative periods as specified in IAS 1",
      "Minimum line items and selected explanatory notes"
    ],
    disclosureRequirements: [
      "Significant events and transactions including changes in accounting policies",
      "Seasonality or cyclicality of interim period operations",
      "Unusual items, changes in estimates, issuances and repayments of debt and equity, dividends paid, segment revenue and results",
      "Events after the interim period"
    ],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 36",
    title: "Impairment of Assets",
    scope: "Applies to all assets except inventories (IAS 2), contract assets and costs to obtain/fulfil contracts (IFRS 15), deferred tax assets (IAS 12), assets from employee benefits (IAS 19), financial assets (IFRS 9), investment property at fair value (IAS 40), biological assets at fair value less costs to sell (IAS 41), insurance contract assets (IFRS 17), and non-current assets held for sale (IFRS 5).",
    keyPrinciples: [
      "An asset is impaired when its carrying amount exceeds its recoverable amount",
      "Recoverable amount is the higher of fair value less costs of disposal and value in use",
      "Cash-generating units (CGUs) for assets that do not generate independent cash flows",
      "Goodwill allocated to CGUs or groups of CGUs for impairment testing",
      "Reversal of impairment losses (except for goodwill)"
    ],
    ukRelevance: "Key standard for UK entities, especially during economic downturns. FRC has issued specific guidance on IAS 36 disclosure quality. Critical for UK goodwill impairment testing.",
    objective: "To prescribe the procedures that an entity applies to ensure that its assets are carried at no more than their recoverable amount.",
    effectiveDate: "2004-03-31",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Impairment loss recognised when carrying amount exceeds recoverable amount",
      "Goodwill and intangible assets with indefinite useful lives tested annually regardless of indicators",
      "Other assets tested when there are indicators of impairment"
    ],
    measurementInitial: [],
    measurementSubsequent: [
      "Recoverable amount: higher of fair value less costs of disposal and value in use",
      "Value in use: present value of estimated future cash flows using a pre-tax discount rate",
      "CGU level testing when individual asset recoverable amount cannot be determined"
    ],
    presentationRequirements: [
      "Impairment losses recognised in profit or loss (or in OCI to the extent of any revaluation surplus)"
    ],
    disclosureRequirements: [
      "Amount of impairment losses and reversals recognised in profit or loss and OCI during the period",
      "For each material impairment loss: events and circumstances, amount, whether recoverable amount is fair value less costs of disposal or value in use, CGU description",
      "For goodwill and indefinite life intangibles: carrying amount allocated to CGUs, basis of recoverable amount, key assumptions, discount rates, growth rates, sensitivity analysis"
    ],
    recentAmendments: [
      { year: 2024, description: "Amendments regarding the discount rate to be used for value-in-use calculations — pre-tax or post-tax consistency" }
    ],
    transitionProvisions: [
      "Applied prospectively"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 37",
    title: "Provisions, Contingent Liabilities and Contingent Assets",
    scope: "Applies to all provisions, contingent liabilities and contingent assets, except those resulting from executory contracts (unless onerous), and those covered by another standard (e.g., financial instruments, insurance contracts, income taxes, leases, employee benefits).",
    keyPrinciples: [
      "A provision is recognised when: there is a present obligation as a result of a past event, it is probable that an outflow of resources will be required, and a reliable estimate can be made",
      "Contingent liabilities not recognised but disclosed (unless remote)",
      "Contingent assets not recognised but disclosed when an inflow of economic benefits is probable",
      "Best estimate of the expenditure required to settle the present obligation"
    ],
    ukRelevance: "Fundamental for UK entities. Onerous contract provisions, restructuring provisions, and legal provisions are key areas. Interacts with UK court and regulatory proceedings.",
    objective: "To ensure that appropriate recognition criteria and measurement bases are applied to provisions, contingent liabilities and contingent assets, and that sufficient information is disclosed in the notes to enable users to understand their nature, timing and amount.",
    effectiveDate: "1999-07-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "Present obligation (legal or constructive) as a result of a past event",
      "Probable that an outflow of resources embodying economic benefits will be required to settle the obligation",
      "Reliable estimate of the amount of the obligation can be made"
    ],
    measurementInitial: [
      "Best estimate of the expenditure required to settle the present obligation at the end of the reporting period",
      "Risks and uncertainties taken into account",
      "Present value where the effect of the time value of money is material"
    ],
    measurementSubsequent: [
      "Provisions reviewed at each reporting date and adjusted to reflect the current best estimate",
      "Unwinding of the discount recognised as a finance cost",
      "Provisions used only for expenditures for which the provision was originally recognised"
    ],
    presentationRequirements: [],
    disclosureRequirements: [
      "For each class of provision: carrying amount at beginning and end, additional provisions, amounts used, amounts reversed, and increase due to unwinding of discount",
      "Brief description of the nature of the obligation and expected timing of outflows",
      "Indication of uncertainties about the amount or timing of those outflows",
      "For contingent liabilities: brief description of nature and where practicable, estimate of financial effect, uncertainties, and possibility of reimbursement"
    ],
    recentAmendments: [
      { year: 2020, description: "Onerous Contracts — Cost of Fulfilling a Contract: clarification that directly related costs include both incremental and allocated costs" }
    ],
    transitionProvisions: [
      "Applied from the effective date; no restatement of comparatives except as required by the specific amendments"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 38",
    title: "Intangible Assets",
    scope: "Applies to all intangible assets except those within the scope of another standard (financial assets, mineral rights, insurance contract assets, non-current intangible assets held for sale, and deferred tax assets).",
    keyPrinciples: [
      "An intangible asset is an identifiable non-monetary asset without physical substance",
      "Recognition criteria: identifiability, control, and existence of future economic benefits",
      "Research costs expensed; development costs capitalised when strict criteria are met",
      "Amortised over useful life; intangible assets with indefinite useful lives not amortised but tested for impairment annually"
    ],
    ukRelevance: "Critical for UK technology, pharmaceutical, and media companies. Internally generated intangible assets (software development, drug development) are key areas of judgement.",
    objective: "To prescribe the accounting treatment for intangible assets that are not dealt with specifically in another standard, specifying how to measure the carrying amount and requiring specified disclosures about intangible assets.",
    effectiveDate: "2004-03-31",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "It is probable that the expected future economic benefits attributable to the asset will flow to the entity",
      "The cost of the asset can be measured reliably",
      "For internally generated intangible assets: research phase costs expensed; development phase costs capitalised when six criteria are demonstrated"
    ],
    measurementInitial: [
      "Separately acquired: at cost (purchase price, import duties, non-refundable taxes, directly attributable costs)",
      "Acquired in a business combination: at fair value at the acquisition date",
      "Internally generated: directly attributable costs from the date the development criteria are met"
    ],
    measurementSubsequent: [
      "Cost model: cost less accumulated amortisation and impairment losses",
      "Revaluation model: fair value less subsequent amortisation and impairment (only if an active market exists)",
      "Amortisation over the useful life using a method reflecting the pattern of economic benefits"
    ],
    presentationRequirements: [
      "Distinguish between internally generated and other intangible assets"
    ],
    disclosureRequirements: [
      "Useful lives or amortisation rates, amortisation methods, gross carrying amount and accumulated amortisation at beginning and end of period",
      "Reconciliation of carrying amount at beginning and end of period",
      "Intangible assets with indefinite useful lives: carrying amount and reasons supporting indefinite useful life",
      "Research and development expenditure recognised as an expense during the period"
    ],
    recentAmendments: [],
    transitionProvisions: [
      "Applied retrospectively; for business combinations, only those after the effective date"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 40",
    title: "Investment Property",
    scope: "Applies to the recognition, measurement and disclosure of investment property. Investment property is property held to earn rentals or for capital appreciation or both.",
    keyPrinciples: [
      "Investment property: land or a building held to earn rentals or for capital appreciation, not for use in production/supply or for sale in the ordinary course of business",
      "Choice of fair value model or cost model (applied to all investment property)",
      "Fair value model: changes in fair value recognised in profit or loss",
      "Transfers to or from investment property when there is a change in use"
    ],
    ukRelevance: "Major importance for UK real estate sector, REITs, and investment funds. RICS Red Book valuations used for fair value measurement.",
    objective: "To prescribe the accounting treatment for investment property and related disclosure requirements.",
    effectiveDate: "2005-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "It is probable that the future economic benefits associated with the investment property will flow to the entity",
      "The cost of the investment property can be measured reliably"
    ],
    measurementInitial: [
      "At cost including transaction costs"
    ],
    measurementSubsequent: [
      "Fair value model: investment property measured at fair value with changes recognised in profit or loss (no depreciation)",
      "Cost model: measured at cost less accumulated depreciation and impairment losses (IAS 16 requirements); fair value disclosed"
    ],
    presentationRequirements: [
      "Investment property presented separately from owner-occupied property and property held for sale"
    ],
    disclosureRequirements: [
      "Whether the fair value model or cost model is applied",
      "For the fair value model: methods and significant assumptions used in determining fair value, extent to which fair value is based on independent valuer, amounts recognised in profit or loss",
      "For the cost model: depreciation methods, useful lives, gross carrying amount, accumulated depreciation, and fair value",
      "Restrictions on realisability of investment property or remittance of income and proceeds of disposal"
    ],
    recentAmendments: [
      { year: 2021, description: "Annual Improvements — clarification of measurement of investment property being constructed" }
    ],
    transitionProvisions: [
      "Applied retrospectively; fair value model adopted for the first time — effect in the period of adoption only"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 41",
    title: "Agriculture",
    scope: "Applies to biological assets (except bearer plants), agricultural produce at the point of harvest, and government grants related to biological assets.",
    keyPrinciples: [
      "Biological assets measured at fair value less costs to sell at each reporting period",
      "Agricultural produce measured at fair value less costs to sell at the point of harvest",
      "Gain or loss from changes in fair value less costs to sell recognised in profit or loss",
      "Bearer plants accounted for under IAS 16 (not IAS 41)"
    ],
    ukRelevance: "Relevant for UK agricultural entities and entities with biological assets. The UK agricultural sector post-Brexit has specific grant and valuation considerations.",
    objective: "To prescribe the accounting treatment and disclosures related to agricultural activity.",
    effectiveDate: "2003-01-01",
    status: "current",
    supersededBy: null,
    recognitionCriteria: [
      "The entity controls the asset as a result of past events",
      "It is probable that future economic benefits will flow to the entity",
      "The fair value or cost of the asset can be measured reliably"
    ],
    measurementInitial: [
      "Fair value less costs to sell, unless fair value cannot be measured reliably"
    ],
    measurementSubsequent: [
      "Fair value less costs to sell at each reporting date",
      "Agricultural produce measured at fair value less costs to sell at the point of harvest (this becomes the cost under IAS 2 or another applicable standard)"
    ],
    presentationRequirements: [],
    disclosureRequirements: [
      "Aggregate gain or loss during the current period from initial recognition and changes in fair value less costs to sell",
      "Description of each group of biological assets, distinguishing consumable and bearer biological assets, or mature and immature",
      "Nature of activities and non-financial measures of quantities",
      "Methods and significant assumptions used in determining fair value"
    ],
    recentAmendments: [
      { year: 2014, description: "Bearer Plants — bearer plants moved from IAS 41 to IAS 16" }
    ],
    transitionProvisions: [
      "Applied from the beginning of the first period for which the entity adopts IAS 41"
    ],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },

  // =========================================================================
  // IAS STANDARDS (SUPERSEDED)
  // =========================================================================
  {
    number: "IAS 3",
    title: "Consolidated Financial Statements (Superseded)",
    scope: "Previously dealt with consolidated financial statements.",
    keyPrinciples: ["Originally prescribed accounting for consolidated financial statements"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe the accounting for consolidated financial statements.",
    effectiveDate: "1977-01-01",
    status: "superseded",
    supersededBy: "IAS 27",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 4",
    title: "Depreciation Accounting (Superseded)",
    scope: "Previously dealt with depreciation accounting for all depreciable assets.",
    keyPrinciples: ["Originally prescribed depreciation methods and the disclosure of depreciation policies"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe the accounting for depreciation of depreciable assets.",
    effectiveDate: "1977-01-01",
    status: "superseded",
    supersededBy: "IAS 16 / IAS 38",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 5",
    title: "Information to Be Disclosed in Financial Statements (Superseded)",
    scope: "Previously dealt with minimum disclosure requirements in financial statements.",
    keyPrinciples: ["Originally prescribed minimum information to be disclosed in financial statements"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe the minimum information to be disclosed in financial statements.",
    effectiveDate: "1977-01-01",
    status: "superseded",
    supersededBy: "IAS 1",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 6",
    title: "Accounting Responses to Changing Prices (Superseded)",
    scope: "Previously dealt with reflecting the effects of changing prices in financial statements.",
    keyPrinciples: ["Originally addressed accounting for the effects of changing prices"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe accounting responses to the effects of changing prices.",
    effectiveDate: "1977-01-01",
    status: "superseded",
    supersededBy: "IAS 15",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 9",
    title: "Research and Development Costs (Superseded)",
    scope: "Previously dealt with accounting for research and development costs.",
    keyPrinciples: ["Originally prescribed the accounting treatment for research and development expenditures"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe the accounting for research and development costs.",
    effectiveDate: "1978-01-01",
    status: "superseded",
    supersededBy: "IAS 38",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 11",
    title: "Construction Contracts (Superseded)",
    scope: "Previously dealt with accounting for construction contracts.",
    keyPrinciples: ["Originally prescribed the accounting treatment of revenue and costs associated with construction contracts"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 15 from 1 January 2018.",
    objective: "To prescribe the accounting for construction contracts.",
    effectiveDate: "1979-01-01",
    status: "superseded",
    supersededBy: "IFRS 15",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 13",
    title: "Presentation of Current Assets and Current Liabilities (Superseded)",
    scope: "Previously dealt with the presentation of current assets and current liabilities.",
    keyPrinciples: ["Originally prescribed the presentation requirements for current assets and current liabilities"],
    ukRelevance: "Historical relevance only.",
    objective: "To prescribe the presentation of current assets and current liabilities.",
    effectiveDate: "1979-01-01",
    status: "superseded",
    supersededBy: "IAS 1",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 14",
    title: "Segment Reporting (Superseded)",
    scope: "Previously dealt with reporting financial information by segment.",
    keyPrinciples: ["Originally required disclosure of segment information based on business and geographical segments"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 8 from 1 January 2009.",
    objective: "To prescribe segment reporting for entities whose securities are publicly traded.",
    effectiveDate: "1981-01-01",
    status: "superseded",
    supersededBy: "IFRS 8",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 15",
    title: "Information Reflecting the Effects of Changing Prices (Withdrawn)",
    scope: "Previously dealt with the disclosure of the effects of changing prices on financial reporting.",
    keyPrinciples: ["Encouraged disclosure of the effects of changing prices on the measurement of results and financial position"],
    ukRelevance: "Historical relevance only. Withdrawn in 2003.",
    objective: "To prescribe disclosure of the effects of changing prices.",
    effectiveDate: "1981-01-01",
    status: "superseded",
    supersededBy: "Withdrawn (2003)",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 17",
    title: "Leases (Superseded)",
    scope: "Previously dealt with the accounting for leases by lessees and lessors.",
    keyPrinciples: ["Originally classified leases as finance leases or operating leases for both lessees and lessors"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 16 from 1 January 2019.",
    objective: "To prescribe the appropriate accounting policies and disclosure for finance and operating leases.",
    effectiveDate: "2005-01-01",
    status: "superseded",
    supersededBy: "IFRS 16",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 18",
    title: "Revenue (Superseded)",
    scope: "Previously dealt with revenue arising from the sale of goods, rendering of services, and the use by others of entity assets yielding interest, royalties and dividends.",
    keyPrinciples: ["Originally prescribed recognition criteria for revenue from sales of goods, rendering of services, and interest/royalties/dividends"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 15 from 1 January 2018.",
    objective: "To prescribe the accounting treatment of revenue arising from certain types of transactions and events.",
    effectiveDate: "1995-01-01",
    status: "superseded",
    supersededBy: "IFRS 15",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 22",
    title: "Business Combinations (Superseded)",
    scope: "Previously dealt with accounting for business combinations.",
    keyPrinciples: ["Originally prescribed the purchase method and pooling of interests method for business combinations"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 3 from 2004.",
    objective: "To prescribe the accounting treatment for business combinations.",
    effectiveDate: "1983-01-01",
    status: "superseded",
    supersededBy: "IFRS 3",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 25",
    title: "Accounting for Investments (Superseded)",
    scope: "Previously dealt with accounting for investments.",
    keyPrinciples: ["Originally prescribed accounting for various types of investments"],
    ukRelevance: "Historical relevance only. Superseded by IAS 39 and IAS 40.",
    objective: "To prescribe the accounting for investments.",
    effectiveDate: "1986-01-01",
    status: "superseded",
    supersededBy: "IAS 39 / IAS 40",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 30",
    title: "Disclosures in the Financial Statements of Banks and Similar Financial Institutions (Superseded)",
    scope: "Previously dealt with disclosures specific to banks and similar financial institutions.",
    keyPrinciples: ["Originally prescribed specific disclosure requirements for banks and similar financial institutions"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 7 from 2007.",
    objective: "To prescribe disclosure requirements for banks and similar financial institutions.",
    effectiveDate: "1991-01-01",
    status: "superseded",
    supersededBy: "IFRS 7",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 31",
    title: "Interests in Joint Ventures (Superseded)",
    scope: "Previously dealt with accounting for interests in joint ventures.",
    keyPrinciples: ["Originally permitted proportionate consolidation or the equity method for jointly controlled entities"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 11 from 2013.",
    objective: "To prescribe the accounting for interests in joint ventures.",
    effectiveDate: "1992-01-01",
    status: "superseded",
    supersededBy: "IFRS 11",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 35",
    title: "Discontinuing Operations (Superseded)",
    scope: "Previously dealt with the presentation and disclosure of discontinuing operations.",
    keyPrinciples: ["Originally prescribed presentation and disclosure requirements for discontinuing operations"],
    ukRelevance: "Historical relevance only. Superseded by IFRS 5 from 2005.",
    objective: "To prescribe the presentation and disclosure for discontinuing operations.",
    effectiveDate: "1998-01-01",
    status: "superseded",
    supersededBy: "IFRS 5",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IAS 39",
    title: "Financial Instruments: Recognition and Measurement (Superseded)",
    scope: "Previously dealt with the recognition and measurement of financial instruments.",
    keyPrinciples: ["Originally prescribed classification and measurement of financial instruments, impairment (incurred loss model), and hedge accounting"],
    ukRelevance: "Historical relevance only. Largely superseded by IFRS 9 from 1 January 2018. Certain hedge accounting provisions may still be applied as a policy choice under IFRS 9.",
    objective: "To establish principles for recognising and measuring financial assets, financial liabilities and some contracts to buy or sell non-financial items.",
    effectiveDate: "2001-01-01",
    status: "superseded",
    supersededBy: "IFRS 9",
    recognitionCriteria: [],
    measurementInitial: [],
    measurementSubsequent: [],
    presentationRequirements: [],
    disclosureRequirements: [],
    recentAmendments: [],
    transitionProvisions: [],
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  }
];

// ---------------------------------------------------------------------------
// IFRIC & SIC INTERPRETATIONS
// ---------------------------------------------------------------------------

export const IFRIC_INTERPRETATIONS = [
  {
    number: "IFRIC 1",
    title: "Changes in Existing Decommissioning, Restoration and Similar Liabilities",
    relatedStandard: "IAS 37 / IAS 16 / IFRS 16",
    summary: "Addresses how to account for changes in the measurement of existing decommissioning, restoration and similar liabilities recognised as part of the cost of an item of property, plant and equipment or a right-of-use asset, and as a provision under IAS 37.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 2",
    title: "Members' Shares in Co-operative Entities and Similar Instruments",
    relatedStandard: "IAS 32",
    summary: "Addresses how to classify members' shares in co-operative entities as financial liabilities or equity, considering the terms and conditions of those instruments including any relevant local law, regulation or the entity's governing charter.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 5",
    title: "Rights to Interests arising from Decommissioning, Restoration and Environmental Rehabilitation Funds",
    relatedStandard: "IAS 37 / IFRS 9",
    summary: "Addresses how a contributor should account for its interest in a fund established to fund decommissioning, restoration or environmental rehabilitation obligations, and whether the contributor should recognise its obligation gross or net of its interest in the fund.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 6",
    title: "Liabilities arising from Participating in a Specific Market — Waste Electrical and Electronic Equipment",
    relatedStandard: "IAS 37",
    summary: "Addresses when the obligating event for the recognition of a provision for waste management costs under the EU WEEE Directive arises, specifically determining whether the liability arises from participation in the market during the measurement period or from the manufacture or sale of historical household equipment.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 10",
    title: "Interim Financial Reporting and Impairment",
    relatedStandard: "IAS 34 / IAS 36 / IFRS 9",
    summary: "Addresses the interaction between IAS 34 and the impairment recognition requirements in IAS 36 and IFRS 9, confirming that an entity shall not reverse an impairment loss recognised in a previous interim period in respect of goodwill.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 12",
    title: "Service Concession Arrangements",
    relatedStandard: "IFRS 15 / IFRS 9 / IAS 38",
    summary: "Provides guidance on accounting by operators for public-to-private service concession arrangements where the government (grantor) controls the infrastructure and the operator provides public services. Addresses whether to recognise a financial asset, an intangible asset, or both.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 14",
    title: "IAS 19 — The Limit on a Defined Benefit Asset, Minimum Funding Requirements and their Interaction",
    relatedStandard: "IAS 19",
    summary: "Provides guidance on assessing the limit on the amount of surplus in a defined benefit plan that can be recognised as an asset under IAS 19, and how minimum funding requirements may affect the measurement of the defined benefit asset or liability.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 16",
    title: "Hedges of a Net Investment in a Foreign Operation",
    relatedStandard: "IAS 21 / IFRS 9",
    summary: "Addresses the application of hedge accounting to a hedge of a net investment in a foreign operation, identifying what risk can be hedged, which entity within the group can hold the hedging instrument, and how recycling of the cumulative gain or loss should be applied on disposal.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 17",
    title: "Distributions of Non-cash Assets to Owners",
    relatedStandard: "IAS 1 / IFRS 5 / IFRS 13",
    summary: "Addresses how an entity should measure a distribution of non-cash assets (e.g., items of property, plant and equipment, or ownership interests in another entity) as a dividend to its owners, and how to account for any difference between the carrying amount and the fair value of the assets distributed.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 19",
    title: "Extinguishing Financial Liabilities with Equity Instruments",
    relatedStandard: "IFRS 9 / IAS 32",
    summary: "Addresses the accounting by a debtor when the terms of a financial liability are renegotiated and result in the debtor issuing equity instruments to the creditor to extinguish all or part of the financial liability (debt-for-equity swap). The equity instruments issued are measured at fair value.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 20",
    title: "Stripping Costs in the Production Phase of a Surface Mine",
    relatedStandard: "IAS 16 / IAS 2",
    summary: "Addresses the accounting for the costs of waste removal (stripping costs) in the production phase of a surface mining operation, determining when to recognise a stripping activity asset and how to measure it both initially and subsequently.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 21",
    title: "Levies",
    relatedStandard: "IAS 37",
    summary: "Provides guidance on when to recognise a liability to pay a levy imposed by a government. The obligating event that gives rise to the liability is the activity that triggers the payment of the levy, as identified by the legislation.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 22",
    title: "Foreign Currency Transactions and Advance Consideration",
    relatedStandard: "IAS 21",
    summary: "Addresses which exchange rate to use when reporting foreign currency transactions that involve advance consideration paid or received before the related asset, expense or income is recognised. The exchange rate is the rate at the date of the advance consideration (date of initial recognition of the non-monetary prepayment asset or deferred income liability).",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "IFRIC 23",
    title: "Uncertainty over Income Tax Treatments",
    relatedStandard: "IAS 12",
    summary: "Addresses how to reflect uncertainty in the accounting for income taxes when it is uncertain whether a particular tax treatment will be accepted by the taxation authority. Requires an entity to consider whether it is probable that the taxation authority will accept the uncertain tax treatment and, if not, to measure the tax position using the most likely amount or expected value method.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "SIC 7",
    title: "Introduction of the Euro",
    relatedStandard: "IAS 21",
    summary: "Addresses the application of IAS 21 to the changeover from the national currencies of participating EU Member States to the Euro. Clarifies that the requirements of IAS 21 regarding the translation of foreign currency transactions and financial statements of foreign operations are to be strictly applied to the changeover.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "SIC 10",
    title: "Government Assistance — No Specific Relation to Operating Activities",
    relatedStandard: "IAS 20",
    summary: "Addresses whether government assistance directed at entities operating in certain regions or industry sectors meets the definition of government grants under IAS 20 and should therefore be accounted for accordingly.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "SIC 25",
    title: "Income Taxes — Changes in the Tax Status of an Entity or its Shareholders",
    relatedStandard: "IAS 12",
    summary: "Addresses how an entity should account for the current and deferred tax consequences of a change in tax status of the entity or its shareholders. The current and deferred tax consequences are recognised in profit or loss unless they relate to transactions or events recognised outside profit or loss.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "SIC 29",
    title: "Service Concession Arrangements: Disclosures",
    relatedStandard: "IFRIC 12",
    summary: "Prescribes the disclosure requirements for service concession arrangements from the perspective of the operator, including a description of the arrangement, significant terms that may affect the amount, timing and certainty of future cash flows, and the nature and extent of rights to use specified assets, obligations to provide services, and obligations to deliver or rights to receive specified assets at the end of the concession period.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  },
  {
    number: "SIC 32",
    title: "Intangible Assets — Web Site Costs",
    relatedStandard: "IAS 38",
    summary: "Addresses the accounting for costs incurred in developing or operating a website for internal or external access, applying the principles in IAS 38. Planning stage costs are expensed, application and infrastructure development costs are capitalised when recognition criteria are met, and operating costs are expensed as incurred.",
    status: "current",
    source: "IFRS Foundation",
    lastVerified: "2026-03-12"
  }
];
