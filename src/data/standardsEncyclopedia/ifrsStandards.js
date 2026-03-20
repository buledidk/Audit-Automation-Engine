/**
 * COMPLETE IFRS & IAS STANDARDS ENCYCLOPEDIA
 * Issued by the International Accounting Standards Board (IASB)
 * Last updated: March 2026 — includes IFRS 18 (effective 2027), IFRS 19 (effective 2027)
 *
 * Covers: IFRS 1-19, IAS 1-41 (active), IFRIC/SIC interpretations index
 */

// ============================================================================
// IFRS STANDARDS (IFRS 1 — IFRS 19)
// ============================================================================
export const IFRS_STANDARDS = {
  IFRS_1: {
    id: 'IFRS_1',
    title: 'First-time Adoption of International Financial Reporting Standards',
    effectiveDate: '2004-01-01',
    lastAmended: '2024-01-01',
    objective: 'Ensure first IFRS financial statements contain high-quality information that is transparent, comparable, and provides a suitable starting point',
    keyRequirements: [
      'Opening IFRS statement of financial position at date of transition',
      'Apply all IFRSs effective at first IFRS reporting date',
      'Retrospective application with mandatory exceptions and optional exemptions',
      'Mandatory exceptions: derecognition of financial assets/liabilities, hedge accounting, estimates, classification of financial instruments, NCI measurement, embedded derivatives, government loans',
      'Optional exemptions include: business combinations, share-based payment, insurance contracts, deemed cost, leases, cumulative translation differences, investments in subsidiaries/associates/JVs, compound instruments, assets/liabilities of subsidiaries',
      'Reconciliation disclosures: equity at transition date, equity at end of last period under previous GAAP, total comprehensive income for last period under previous GAAP',
      'Explanation of material adjustments to cash flow statement'
    ],
    frs102Equivalent: 'FRS 102 Section 35'
  },

  IFRS_2: {
    id: 'IFRS_2',
    title: 'Share-based Payment',
    effectiveDate: '2005-01-01',
    lastAmended: '2023-01-01',
    objective: 'Specify financial reporting for share-based payment transactions',
    keyRequirements: [
      'Equity-settled: measure at grant-date fair value of equity instruments',
      'Cash-settled: measure at fair value of liability at each reporting date',
      'Transactions with employees: fair value of equity instruments granted',
      'Transactions with non-employees: fair value of goods/services received (rebuttable presumption)',
      'Vesting conditions: service conditions and performance conditions (market and non-market)',
      'Non-market performance conditions: adjust number of instruments expected to vest',
      'Market conditions: reflected in grant-date fair value (no subsequent adjustment)',
      'Modifications: recognise incremental fair value; never reduce total expense below original',
      'Cancellations: accelerate remaining unrecognised expense',
      'Group arrangements: entity receiving services recognises expense'
    ],
    frs102Equivalent: 'FRS 102 Section 26'
  },

  IFRS_3: {
    id: 'IFRS_3',
    title: 'Business Combinations',
    effectiveDate: '2009-01-01',
    lastAmended: '2024-01-01',
    objective: 'Improve relevance, reliability, and comparability of information about business combinations',
    keyRequirements: [
      'Acquisition method for all business combinations (except under common control)',
      'Identify acquirer (entity obtaining control)',
      'Determine acquisition date (date control obtained)',
      'Recognise and measure identifiable assets acquired and liabilities assumed at fair value',
      'Recognise and measure non-controlling interest (NCI): choice per transaction — fair value or proportionate share of net assets',
      'Recognise and measure goodwill (or gain from bargain purchase)',
      'Goodwill = consideration + NCI + previously held equity interest - fair value of net identifiable assets',
      'Bargain purchase (negative goodwill): reassess, then recognise gain in P&L',
      'Contingent consideration: at fair value at acquisition date; subsequent changes in P&L (if financial liability) or equity (if equity)',
      'Acquisition-related costs: expensed as incurred (not capitalised)',
      'Measurement period: up to 12 months for provisional amounts',
      'Step acquisitions: remeasure previously held interest at acquisition-date fair value through P&L',
      'Goodwill: NOT amortised under IFRS — tested annually for impairment (IAS 36)',
      'Common control transactions: outside scope — apply policy choice (predecessor or acquisition method)'
    ],
    frs102Equivalent: 'FRS 102 Section 19 (key difference: FRS 102 amortises goodwill)'
  },

  IFRS_4: {
    id: 'IFRS_4',
    title: 'Insurance Contracts (superseded by IFRS 17)',
    effectiveDate: '2005-01-01',
    supersededBy: 'IFRS 17 (effective 2023-01-01)',
    status: 'SUPERSEDED — no longer applicable for periods beginning on or after 1 January 2023',
    frs102Equivalent: 'FRS 103'
  },

  IFRS_5: {
    id: 'IFRS_5',
    title: 'Non-current Assets Held for Sale and Discontinued Operations',
    effectiveDate: '2005-01-01',
    lastAmended: '2023-01-01',
    objective: 'Specify accounting for assets held for sale and presentation/disclosure of discontinued operations',
    keyRequirements: [
      'Held for sale criteria: available for immediate sale, sale highly probable, management committed to plan, actively marketed, expected to complete within 12 months',
      'Measurement: lower of carrying amount and fair value less costs to sell',
      'No depreciation once classified as held for sale',
      'Presented separately on balance sheet',
      'Discontinued operation: component disposed of or classified as held for sale, represents separate major line of business or geographical area',
      'P&L disclosure: single amount for post-tax profit/loss of discontinued operations',
      'Cash flow disclosure: operating, investing, financing of discontinued operations',
      'Assets held for distribution to owners: similar treatment'
    ],
    frs102Equivalent: 'No direct equivalent in FRS 102 (similar principles may apply under general provisions)'
  },

  IFRS_6: {
    id: 'IFRS_6',
    title: 'Exploration for and Evaluation of Mineral Resources',
    effectiveDate: '2006-01-01',
    lastAmended: '2023-01-01',
    objective: 'Specify financial reporting for exploration and evaluation of mineral resources',
    keyRequirements: [
      'Develop accounting policy for E&E expenditures',
      'Measure E&E assets at cost initially',
      'Subsequent measurement: cost model or revaluation model',
      'Reclassify when technical feasibility and commercial viability demonstrable',
      'Impairment: test when facts/circumstances suggest carrying amount exceeds recoverable amount',
      'Impairment indicators: rights to explore have expired, no further E&E planned, sufficient data to conclude that asset will not lead to discovery'
    ],
    frs102Equivalent: 'FRS 102 Section 34 (Specialised Activities — extractive)'
  },

  IFRS_7: {
    id: 'IFRS_7',
    title: 'Financial Instruments: Disclosures',
    effectiveDate: '2007-01-01',
    lastAmended: '2024-01-01',
    objective: 'Require disclosures enabling users to evaluate significance of financial instruments and nature/extent of risks',
    keyRequirements: [
      'Significance of financial instruments: carrying amounts by category (FVTPL, amortised cost, FVOCI), reclassifications, offsetting, collateral',
      'Nature and extent of risks: credit risk (ECL disclosures, credit quality, collateral), liquidity risk (maturity analysis), market risk (sensitivity analysis)',
      'Hedge accounting: hedging strategy, how hedging affects financial statements, amounts/timing/uncertainty of future cash flows',
      'Transferred financial assets: nature, risks retained, carrying amounts',
      'Fair value hierarchy: Level 1 (quoted prices), Level 2 (observable inputs), Level 3 (unobservable inputs)',
      'Reconciliation of Level 3 fair value measurements',
      'Credit risk: maximum exposure, credit quality analysis, loss allowance analysis'
    ],
    frs102Equivalent: 'FRS 102 Section 11-12 (much less detailed disclosure requirements)'
  },

  IFRS_8: {
    id: 'IFRS_8',
    title: 'Operating Segments',
    effectiveDate: '2009-01-01',
    lastAmended: '2023-01-01',
    objective: 'Require disclosure enabling users to evaluate nature and financial effects of business activities and economic environments',
    keyRequirements: [
      'Applies to entities with equity or debt instruments traded publicly (or in process of filing)',
      'Operating segment: component engaging in revenue-earning activities, whose results are reviewed by CODM',
      'CODM (Chief Operating Decision Maker): function, not necessarily individual',
      'Reportable segments: quantitative thresholds (10% of revenue, profit/loss, or assets)',
      'Disclose: products/services, geographical areas, major customers',
      'Measurement: consistent with internal reporting to CODM',
      'Reconciliation to IFRS amounts required',
      'Entity-wide disclosures: revenue by product/geography, major customer concentration'
    ],
    frs102Equivalent: 'No equivalent in FRS 102 (not required for non-listed entities)'
  },

  IFRS_9: {
    id: 'IFRS_9',
    title: 'Financial Instruments',
    effectiveDate: '2018-01-01',
    lastAmended: '2024-01-01',
    objective: 'Establish principles for financial reporting of financial assets and liabilities',
    keyRequirements: [
      'Classification based on business model and contractual cash flow characteristics',
      'Three categories: amortised cost, FVOCI, FVTPL',
      'Amortised cost: hold to collect contractual cash flows that are SPPI (solely payments of principal and interest)',
      'FVOCI: hold to collect and sell, contractual cash flows are SPPI',
      'FVTPL: all other financial assets (or fair value option)',
      'Equity investments: irrevocable election to present fair value changes in OCI (no recycling)',
      'Impairment: expected credit loss (ECL) model',
      'ECL stages: Stage 1 (12-month ECL), Stage 2 (lifetime ECL — significant increase in credit risk), Stage 3 (credit-impaired — lifetime ECL)',
      'Simplified approach for trade receivables: always lifetime ECL (provision matrix)',
      'Hedge accounting: more closely aligned with risk management',
      'Hedge types: fair value, cash flow, net investment',
      'Effectiveness testing: economic relationship, credit risk not dominant, hedge ratio',
      'Derecognition: when contractual rights expire or substantially all risks/rewards transferred'
    ],
    frs102Equivalent: 'FRS 102 Sections 11-12 (simpler classification; incurred loss not ECL)'
  },

  IFRS_10: {
    id: 'IFRS_10',
    title: 'Consolidated Financial Statements',
    effectiveDate: '2013-01-01',
    lastAmended: '2023-01-01',
    objective: 'Establish principles for presentation and preparation of consolidated financial statements',
    keyRequirements: [
      'Control: investor has power over investee, exposure to variable returns, ability to use power to affect returns',
      'Power: existing rights giving current ability to direct relevant activities',
      'Relevant activities: activities significantly affecting investee returns',
      'All subsidiaries consolidated (no exclusion for dissimilar activities)',
      'Uniform accounting policies',
      'NCI presented in equity, separately from parent equity',
      'Loss of control: derecognise assets/liabilities of subsidiary, recognise gain/loss, retained interest at fair value',
      'Investment entities: exception — measure subsidiaries at FVTPL instead of consolidating',
      'Protective rights vs substantive rights distinction'
    ],
    frs102Equivalent: 'FRS 102 Section 9'
  },

  IFRS_11: {
    id: 'IFRS_11',
    title: 'Joint Arrangements',
    effectiveDate: '2013-01-01',
    lastAmended: '2023-01-01',
    objective: 'Establish principles for financial reporting by entities with joint arrangements',
    keyRequirements: [
      'Joint control: contractually agreed sharing of control (unanimous consent required for relevant activities)',
      'Two types only: joint operations and joint ventures',
      'Classification based on structure, legal form, contractual terms, and other facts',
      'Joint operation: parties have rights to assets and obligations for liabilities — recognise own share of assets, liabilities, revenue, expenses',
      'Joint venture: parties have rights to net assets — equity method only (no proportionate consolidation)',
      'Acquisition of interest in joint operation: IFRS 3 principles apply if it constitutes a business'
    ],
    frs102Equivalent: 'FRS 102 Section 15'
  },

  IFRS_12: {
    id: 'IFRS_12',
    title: 'Disclosure of Interests in Other Entities',
    effectiveDate: '2013-01-01',
    lastAmended: '2023-01-01',
    objective: 'Require disclosure enabling users to evaluate nature, risks, and financial effects of interests in other entities',
    keyRequirements: [
      'Significant judgments and assumptions: determining control, joint control, significant influence',
      'Subsidiaries: NCI summarised information, significant restrictions, nature of risks from consolidated structured entities',
      'Associates and joint ventures: summarised financial information, significant restrictions',
      'Unconsolidated structured entities: nature of interests, risks, maximum exposure to loss',
      'Investment entities: nature and risks of interests in unconsolidated subsidiaries'
    ],
    frs102Equivalent: 'FRS 102 Sections 9, 14, 15 (less detailed disclosure requirements)'
  },

  IFRS_13: {
    id: 'IFRS_13',
    title: 'Fair Value Measurement',
    effectiveDate: '2013-01-01',
    lastAmended: '2023-01-01',
    objective: 'Define fair value, provide framework for measuring fair value, require disclosures',
    keyRequirements: [
      'Fair value: price that would be received to sell an asset or paid to transfer a liability in orderly transaction between market participants at measurement date (exit price)',
      'Market participant assumptions (not entity-specific)',
      'Highest and best use for non-financial assets',
      'Principal market (or most advantageous market)',
      'Valuation techniques: market approach, income approach, cost approach',
      'Fair value hierarchy: Level 1 (quoted prices in active markets), Level 2 (other observable inputs), Level 3 (unobservable inputs)',
      'Maximise use of observable inputs, minimise unobservable inputs',
      'Day 1 gains/losses: recognised only if based on observable inputs',
      'Disclosure: measurement techniques, inputs used, effect of Level 3 measurements on P&L',
      'Transaction costs: not included in fair value (included in cost of acquisition)'
    ],
    frs102Equivalent: 'FRS 102 — fair value guidance embedded in relevant sections; no standalone fair value standard'
  },

  IFRS_14: {
    id: 'IFRS_14',
    title: 'Regulatory Deferral Accounts',
    effectiveDate: '2016-01-01',
    status: 'Interim standard — limited application',
    objective: 'Permit first-time IFRS adopters in rate-regulated activities to continue recognising regulatory deferral account balances',
    keyRequirements: [
      'Only for first-time adopters of IFRS that conduct rate-regulated activities',
      'Continue to apply previous GAAP for regulatory deferral accounts',
      'Present separately on balance sheet and in P&L',
      'Existing IFRS preparers cannot apply this standard'
    ],
    frs102Equivalent: 'No equivalent in FRS 102'
  },

  IFRS_15: {
    id: 'IFRS_15',
    title: 'Revenue from Contracts with Customers',
    effectiveDate: '2018-01-01',
    lastAmended: '2024-01-01',
    objective: 'Establish principles for reporting useful information about nature, amount, timing, and uncertainty of revenue',
    keyRequirements: [
      'Five-step model: (1) Identify contract, (2) Identify performance obligations, (3) Determine transaction price, (4) Allocate transaction price, (5) Recognise revenue when obligation satisfied',
      'Contract criteria: commercial substance, parties approved, rights identifiable, payment terms identifiable, probable collection',
      'Performance obligation: promise to transfer distinct good/service (or series)',
      'Distinct: customer can benefit on its own (or with readily available resources) and separately identifiable in context of contract',
      'Transaction price: fixed, variable (constrained estimate), significant financing, non-cash, consideration payable to customer',
      'Variable consideration: expected value or most likely amount (constrained)',
      'Allocation: standalone selling prices (observable, or estimated using adjusted market, expected cost + margin, residual approaches)',
      'Point in time: control transfers at specific point (indicators: right to payment, legal title, physical possession, risks/rewards, customer acceptance)',
      'Over time: customer receives/consumes benefits, entity creates asset with no alternative use and has right to payment, customer controls asset as created',
      'Contract costs: incremental costs of obtaining (capitalise if expect to recover), costs to fulfil (capitalise if relate directly, generate resources, expected to be recovered)',
      'Contract modifications: separate contract, prospective, or cumulative catch-up',
      'Specific application: warranties, principal vs agent, bill-and-hold, consignment, repurchase, licensing, non-refundable fees'
    ],
    frs102Equivalent: 'FRS 102 Section 23 (risks and rewards model, not five-step model)'
  },

  IFRS_16: {
    id: 'IFRS_16',
    title: 'Leases',
    effectiveDate: '2019-01-01',
    lastAmended: '2024-01-01',
    objective: 'Ensure lessees and lessors provide relevant information faithfully representing lease transactions',
    keyRequirements: [
      'Lease definition: contract conveying right to control use of identified asset for a period in exchange for consideration',
      'Lessee accounting: SINGLE MODEL — recognise right-of-use (ROU) asset and lease liability for all leases (except short-term ≤12m and low-value)',
      'ROU asset: initial measurement = lease liability + prepayments + initial direct costs + restoration costs - incentives',
      'Lease liability: present value of lease payments (discount at rate implicit in lease, or incremental borrowing rate)',
      'Subsequent: ROU asset — cost model (or revaluation/fair value for investment property), depreciate over shorter of useful life and lease term',
      'Subsequent: lease liability — effective interest method, reduce by payments',
      'Reassessment: when change in lease term assessment, purchase option assessment, or residual value guarantee amounts',
      'Modification: separate lease or remeasurement depending on whether modification grants additional right of use',
      'Lessor accounting: DUAL MODEL retained — finance lease (derecognise asset, recognise receivable) or operating lease (retain asset, straight-line income)',
      'Sale and leaseback: apply IFRS 15 to determine if transfer is a sale',
      'Disclosure — lessee: depreciation, interest, expenses for short-term/low-value, variable lease payments, maturity analysis',
      'Disclosure — lessor: lease income, maturity analysis, risk management strategy'
    ],
    frs102Equivalent: 'FRS 102 Section 20 (retains IAS 17 finance/operating classification for lessees)'
  },

  IFRS_17: {
    id: 'IFRS_17',
    title: 'Insurance Contracts',
    effectiveDate: '2023-01-01',
    lastAmended: '2024-01-01',
    objective: 'Ensure entity provides relevant information faithfully representing insurance contracts',
    keyRequirements: [
      'Replaces IFRS 4 for periods beginning on or after 1 January 2023',
      'General measurement model (building block approach): fulfilment cash flows + contractual service margin (CSM)',
      'Fulfilment cash flows: probability-weighted expected cash flows, discounted, plus risk adjustment for non-financial risk',
      'CSM: unearned profit to be recognised as service is provided',
      'Premium allocation approach (PAA): simplified model for short-duration contracts (coverage period ≤12 months or qualifying)',
      'Variable fee approach (VFA): for direct participating contracts (substantial share of fair value returns)',
      'Groups of insurance contracts: portfolios with similar risks, managed together',
      'Profitability groups: onerous, no significant possibility of becoming onerous, remaining',
      'Revenue: insurance revenue (not premiums written) — excludes investment components',
      'Presentation: insurance revenue, insurance service expenses, insurance finance income/expenses',
      'Transition: full retrospective, modified retrospective, or fair value approach',
      'Reinsurance contracts held: measured separately from underlying insurance contracts'
    ],
    frs102Equivalent: 'FRS 103'
  },

  IFRS_18: {
    id: 'IFRS_18',
    title: 'Presentation and Disclosure in Financial Statements',
    effectiveDate: '2027-01-01',
    status: 'Issued April 2024 — replaces IAS 1',
    objective: 'Improve communication in financial statements through better structure and transparency',
    keyRequirements: [
      'Replaces IAS 1 Presentation of Financial Statements',
      'New categories in profit or loss: operating, investing, financing, income taxes, discontinued operations',
      'Operating category: default category (not residual)',
      'Management-defined performance measures (MPMs): entity-specific subtotals in profit or loss — must be reconciled and explained',
      'Enhanced aggregation and disaggregation principles: information aggregated based on shared characteristics',
      'New disclosure requirements for grouping items in financial statements',
      'Statement of cash flows: largely unchanged (follows IAS 7)',
      'Comparative information requirements updated',
      'Early adoption permitted'
    ],
    frs102Equivalent: 'Not yet reflected in FRS 102 (FRC will consider alignment in future periodic review)'
  },

  IFRS_19: {
    id: 'IFRS_19',
    title: 'Subsidiaries without Public Accountability: Disclosures',
    effectiveDate: '2027-01-01',
    status: 'Issued May 2024',
    objective: 'Permit eligible subsidiaries to apply reduced IFRS disclosures while retaining full IFRS recognition and measurement',
    keyRequirements: [
      'Eligible: subsidiary without public accountability (no listed securities, not a financial institution holding assets in fiduciary capacity)',
      'Parent must prepare consolidated financial statements using full IFRS Accounting Standards',
      'Reduced disclosure requirements (similar concept to FRS 101)',
      'Full IFRS recognition and measurement requirements retained',
      'Reduced disclosures cover: financial instruments, fair value, revenue, leases, employee benefits, share-based payment, related parties, and more',
      'Must state in basis of preparation that IFRS 19 is applied',
      'Early adoption permitted'
    ],
    frs102Equivalent: 'FRS 101 (very similar concept)'
  }
};

// ============================================================================
// IAS STANDARDS (IAS 1 — IAS 41, currently active)
// ============================================================================
export const IAS_STANDARDS = {
  IAS_1: {
    id: 'IAS_1',
    title: 'Presentation of Financial Statements',
    status: 'Will be superseded by IFRS 18 from 1 January 2027',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Complete set of financial statements: statement of financial position, P&L and OCI, changes in equity, cash flows, notes',
      'Fair presentation and compliance with IFRS',
      'Going concern assessment',
      'Accrual basis of accounting',
      'Materiality and aggregation',
      'Offsetting: only when IFRS requires or permits',
      'Comparative information for prior period minimum',
      'Current/non-current classification',
      'Minimum line items on face of statements'
    ],
    frs102Equivalent: 'FRS 102 Sections 3-6'
  },

  IAS_2: {
    id: 'IAS_2',
    title: 'Inventories',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Measure at lower of cost and net realisable value',
      'Cost: purchase costs + conversion costs + other costs to bring to present location/condition',
      'Cost formulas: FIFO or weighted average cost (LIFO prohibited)',
      'NRV: estimated selling price less estimated costs of completion and costs to make sale',
      'Write-down to NRV recognised in P&L; reversal recognised as reduction of cost of sales',
      'Standard cost or retail method: acceptable approximations'
    ],
    frs102Equivalent: 'FRS 102 Section 13'
  },

  IAS_7: {
    id: 'IAS_7',
    title: 'Statement of Cash Flows',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Operating, investing, financing classification',
      'Operating: direct or indirect method',
      'Interest and dividends: classify consistently (policy choice)',
      'Tax: operating unless specifically identified with financing or investing',
      'Non-cash transactions: excluded but disclosed',
      'Changes in liabilities arising from financing activities: reconciliation required'
    ],
    frs102Equivalent: 'FRS 102 Section 7'
  },

  IAS_8: {
    id: 'IAS_8',
    title: 'Accounting Policies, Changes in Accounting Estimates and Errors',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Accounting policy selection hierarchy: IFRS, then by analogy to similar IFRS, then Conceptual Framework',
      'Change in policy: retrospective application (restate comparatives)',
      'Change in estimate: prospective application',
      'Distinction: policy change vs estimate change (if uncertain, treat as estimate change)',
      'Prior period error: retrospective restatement',
      'Impracticability exemption'
    ],
    frs102Equivalent: 'FRS 102 Section 10'
  },

  IAS_10: {
    id: 'IAS_10',
    title: 'Events after the Reporting Period',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Adjusting events: conditions existed at reporting date — adjust',
      'Non-adjusting events: conditions arose after — disclose if material',
      'Going concern: if deterioration after reporting date, do not prepare on going concern basis if entity intends to liquidate or cease',
      'Dividends declared after reporting date: not a liability',
      'Disclose: date financial statements authorised for issue, events after reporting period'
    ],
    frs102Equivalent: 'FRS 102 Section 32'
  },

  IAS_12: {
    id: 'IAS_12',
    title: 'Income Taxes',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Current tax: based on taxable profit at enacted/substantively enacted rates',
      'Deferred tax: temporary differences approach (balance sheet liability method)',
      'Temporary difference: difference between carrying amount and tax base',
      'Deferred tax liability: recognised for all taxable temporary differences (with limited exceptions)',
      'Deferred tax asset: recognised to extent probable that taxable profit will be available',
      'Tax rate: enacted or substantively enacted at reporting date',
      'Deferred tax on investments in subsidiaries/associates: provide unless parent can control timing and reversal not probable',
      'Pillar Two / global minimum tax: temporary mandatory exception from deferred tax recognition',
      'Uncertain tax positions: IFRIC 23 guidance (most likely amount or expected value)',
      'Note: IAS 12 uses "temporary differences" (balance sheet) vs FRS 102 "timing differences" (P&L)'
    ],
    frs102Equivalent: 'FRS 102 Section 29 (timing differences approach, not temporary differences)'
  },

  IAS_16: {
    id: 'IAS_16',
    title: 'Property, Plant and Equipment',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Recognition: future economic benefits probable and cost reliably measurable',
      'Initial measurement: cost (purchase + directly attributable + dismantling/restoration estimate)',
      'Subsequent: cost model or revaluation model',
      'Component depreciation required',
      'Depreciation: systematic over useful life; begins when available for use',
      'Residual value and useful life reviewed at least annually',
      'Revaluation: fair value at revaluation date less subsequent depreciation; entire class revalued',
      'Derecognition: on disposal or when no future benefits expected'
    ],
    frs102Equivalent: 'FRS 102 Section 17'
  },

  IAS_19: {
    id: 'IAS_19',
    title: 'Employee Benefits',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Short-term: recognise when employee renders service',
      'Post-employment — defined contribution: expense when contribution due',
      'Post-employment — defined benefit: recognise net defined benefit liability/asset',
      'Projected unit credit method for defined benefit obligation',
      'Plan assets at fair value',
      'Remeasurements (actuarial gains/losses, return on plan assets excluding net interest): in OCI (not recycled)',
      'Net interest on net defined benefit liability/asset: in P&L',
      'Past service cost: recognise immediately in P&L when plan amendment/curtailment occurs',
      'Other long-term benefits: similar to defined benefit but remeasurements in P&L',
      'Termination benefits: recognise at earlier of when entity can no longer withdraw offer and when entity recognises restructuring costs'
    ],
    frs102Equivalent: 'FRS 102 Section 28'
  },

  IAS_20: {
    id: 'IAS_20',
    title: 'Accounting for Government Grants and Disclosure of Government Assistance',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Recognise when reasonable assurance that conditions will be met and grant received',
      'Income approach: recognise systematically over periods to match related costs',
      'Grants related to assets: deferred income or deduction from asset carrying amount',
      'Grants related to income: income or deduction from related expense',
      'Non-monetary grants: at fair value (or nominal amount)',
      'Repayment: adjustment to grant (change in estimate)'
    ],
    frs102Equivalent: 'FRS 102 Section 24'
  },

  IAS_21: {
    id: 'IAS_21',
    title: 'The Effects of Changes in Foreign Exchange Rates',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Functional currency determination (primary economic environment)',
      'Transactions at spot rate (or average if rates stable)',
      'Monetary items: closing rate',
      'Non-monetary (historical cost): transaction date rate',
      'Non-monetary (revalued): revaluation date rate',
      'Foreign operation translation: closing rate for assets/liabilities, average for income/expenses',
      'Exchange differences on net investment: OCI',
      'Disposal of foreign operation: recycle cumulative exchange differences to P&L'
    ],
    frs102Equivalent: 'FRS 102 Section 30'
  },

  IAS_23: {
    id: 'IAS_23',
    title: 'Borrowing Costs',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Borrowing costs directly attributable to qualifying assets: MUST capitalise (no choice)',
      'Qualifying asset: substantial period to get ready for intended use/sale',
      'General borrowings: capitalisation rate = weighted average cost of borrowings',
      'Specific borrowings: actual cost less any investment income on temporary surplus',
      'Commence capitalisation when expenditure incurred, borrowing costs incurred, activities underway',
      'Suspend capitalisation during extended periods of inactivity',
      'Cease capitalisation when substantially all activities complete'
    ],
    frs102Equivalent: 'FRS 102 Section 25 (accounting policy CHOICE — expense or capitalise)'
  },

  IAS_24: {
    id: 'IAS_24',
    title: 'Related Party Disclosures',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Related party: person or entity related to reporting entity (control, joint control, significant influence, key management, close family)',
      'Disclose: nature of relationship, transactions, outstanding balances, commitments',
      'Key management personnel compensation: short-term, post-employment, other long-term, termination, share-based',
      'Government-related entities: modified disclosure',
      'Parent-subsidiary: always disclosed even if no transactions'
    ],
    frs102Equivalent: 'FRS 102 Section 33'
  },

  IAS_26: {
    id: 'IAS_26',
    title: 'Accounting and Reporting by Retirement Benefit Plans',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Financial statements of retirement benefit plans (not employer)',
      'Defined contribution plans: statement of net assets, statement of changes, description of plan, investment policy',
      'Defined benefit plans: includes actuarial present value of promised retirement benefits',
      'All plan investments at fair value'
    ],
    frs102Equivalent: 'FRS 102 Section 34 (retirement benefit plans)'
  },

  IAS_27: {
    id: 'IAS_27',
    title: 'Separate Financial Statements',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Separate (individual) financial statements of parent/investor',
      'Investments in subsidiaries, associates, JVs: cost, IFRS 9 (fair value), or equity method',
      'Policy applied consistently to each category',
      'Dividends from subsidiaries: recognised in P&L when right to receive established',
      'Entity forming new parent (reorganisation): cost = carrying amount of equity items'
    ],
    frs102Equivalent: 'FRS 102 Section 9 (individual accounts)'
  },

  IAS_28: {
    id: 'IAS_28',
    title: 'Investments in Associates and Joint Ventures',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Significant influence: power to participate (presumed at 20%+)',
      'Equity method: initial recognition at cost, adjusted for post-acquisition share of profit/loss, OCI, distributions',
      'Uniform accounting policies',
      'Losses: reduce investment to zero, then stop (unless obligations)',
      'Impairment: IAS 36 indicators — test investment as single asset',
      'Loss of significant influence: discontinue equity method, measure retained at fair value'
    ],
    frs102Equivalent: 'FRS 102 Section 14'
  },

  IAS_29: {
    id: 'IAS_29',
    title: 'Financial Reporting in Hyperinflationary Economies',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Restate financial statements when functional currency is hyperinflationary',
      'Indicators: general population uses stable foreign currency, cumulative 3-year inflation ≈100%',
      'Restate using general price index',
      'Gain/loss on net monetary position in P&L',
      'Comparatives restated to current purchasing power'
    ],
    frs102Equivalent: 'FRS 102 Section 31'
  },

  IAS_32: {
    id: 'IAS_32',
    title: 'Financial Instruments: Presentation',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Liability vs equity classification: based on substance of contractual arrangement',
      'Obligation to deliver cash/financial asset = financial liability',
      'Settled in own equity instruments: liability if variable number, equity if fixed for fixed',
      'Compound instruments: split liability and equity components',
      'Treasury shares: deducted from equity',
      'Offsetting: legal right to set off AND intention to settle net or simultaneously'
    ],
    frs102Equivalent: 'FRS 102 Section 22'
  },

  IAS_33: {
    id: 'IAS_33',
    title: 'Earnings per Share',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Applies to entities with ordinary shares or potential ordinary shares traded publicly',
      'Basic EPS: profit attributable to ordinary equity holders / weighted average ordinary shares outstanding',
      'Diluted EPS: adjusted profit / weighted average shares including dilutive potential shares',
      'Dilutive instruments: options, warrants, convertible instruments, contingently issuable shares',
      'Anti-dilutive: excluded from diluted EPS calculation',
      'Presentation: basic and diluted on face of P&L for continuing operations and total'
    ],
    frs102Equivalent: 'No equivalent in FRS 102 (not required for non-listed entities)'
  },

  IAS_34: {
    id: 'IAS_34',
    title: 'Interim Financial Reporting',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Minimum content: condensed financial statements and selected explanatory notes',
      'Same accounting policies as annual',
      'Materiality based on interim data',
      'Revenue seasonal: do not anticipate or defer',
      'Tax expense: best estimate of weighted average annual effective rate',
      'Significant events and transactions since last annual report'
    ],
    frs102Equivalent: 'FRS 104'
  },

  IAS_36: {
    id: 'IAS_36',
    title: 'Impairment of Assets',
    lastAmended: '2024-01-01',
    keyRequirements: [
      'Test when indicators exist (annually for goodwill, indefinite-life intangibles, intangibles not yet available for use)',
      'Recoverable amount: higher of fair value less costs of disposal and value in use',
      'Value in use: PV of expected future cash flows (pre-tax discount rate reflecting current market assessment)',
      'Cash-generating units (CGUs): smallest group generating independent cash inflows',
      'Goodwill allocated to CGUs expected to benefit from synergies',
      'Impairment loss: first reduce goodwill, then pro rata to other assets in CGU',
      'Reversal: permitted for assets other than goodwill',
      'Disclosure: impairment losses/reversals, key assumptions for CGU testing, discount rates, growth rates'
    ],
    frs102Equivalent: 'FRS 102 Section 27'
  },

  IAS_37: {
    id: 'IAS_37',
    title: 'Provisions, Contingent Liabilities and Contingent Assets',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Provision: present obligation, probable outflow, reliable estimate',
      'Best estimate: amount entity would rationally pay to settle at reporting date',
      'Risk and uncertainties reflected in measurement',
      'Discounting when effect of time value is material',
      'Restructuring provision: detailed formal plan announced/started',
      'Onerous contracts: unavoidable costs exceed expected economic benefits',
      'Contingent liabilities: disclosed unless remote',
      'Contingent assets: disclosed when probable'
    ],
    frs102Equivalent: 'FRS 102 Section 21'
  },

  IAS_38: {
    id: 'IAS_38',
    title: 'Intangible Assets',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Recognition: identifiable, controlled, future economic benefits',
      'Separately acquired: at cost',
      'Business combination: fair value at acquisition date',
      'Internally generated: research phase expensed; development capitalised if 6 criteria met',
      'Internally generated brands, mastheads, customer lists etc: CANNOT be recognised',
      'Subsequent: cost model or revaluation model (revaluation only if active market exists)',
      'Finite life: amortise over useful life',
      'Indefinite life: do not amortise; annual impairment test (IAS 36)',
      'Useful life assessed each period'
    ],
    frs102Equivalent: 'FRS 102 Section 18 (no indefinite life permitted under FRS 102)'
  },

  IAS_40: {
    id: 'IAS_40',
    title: 'Investment Property',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Investment property: held for rental income and/or capital appreciation',
      'Not owner-occupied, not held for sale in ordinary course',
      'Initial measurement: at cost (including transaction costs)',
      'Subsequent: cost model or fair value model (policy for entire class)',
      'Fair value model: changes in fair value in P&L; no depreciation',
      'Cost model: IAS 16 cost less depreciation less impairment with fair value disclosed',
      'Transfers: when change in use evidenced',
      'Mixed-use property: separate components if can be sold/leased separately'
    ],
    frs102Equivalent: 'FRS 102 Section 16'
  },

  IAS_41: {
    id: 'IAS_41',
    title: 'Agriculture',
    lastAmended: '2023-01-01',
    keyRequirements: [
      'Biological assets: fair value less costs to sell at each reporting date',
      'Agricultural produce at harvest: fair value less costs to sell (becomes cost for IAS 2)',
      'Government grants for agriculture: recognise when receivable',
      'If fair value not reliably measurable: cost less impairment (biological assets only)',
      'Bearer plants: IAS 16 scope (cost or revaluation), produce is IAS 41'
    ],
    frs102Equivalent: 'FRS 102 Section 34'
  }
};

// ============================================================================
// IFRIC / SIC INTERPRETATIONS INDEX
// ============================================================================
export const INTERPRETATIONS_INDEX = {
  IFRIC_23: { title: 'Uncertainty over Income Tax Treatments', relatesTo: 'IAS 12', status: 'Active' },
  IFRIC_22: { title: 'Foreign Currency Transactions and Advance Consideration', relatesTo: 'IAS 21', status: 'Active' },
  IFRIC_21: { title: 'Levies', relatesTo: 'IAS 37', status: 'Active' },
  IFRIC_20: { title: 'Stripping Costs in Production Phase of Surface Mine', relatesTo: 'IAS 16', status: 'Active' },
  IFRIC_19: { title: 'Extinguishing Financial Liabilities with Equity Instruments', relatesTo: 'IAS 32/IFRS 9', status: 'Active' },
  IFRIC_17: { title: 'Distributions of Non-cash Assets to Owners', relatesTo: 'IAS 10/IFRS 5', status: 'Active' },
  IFRIC_16: { title: 'Hedges of Net Investment in Foreign Operation', relatesTo: 'IAS 21/IFRS 9', status: 'Active' },
  IFRIC_14: { title: 'IAS 19 — Limit on Defined Benefit Asset, Minimum Funding Requirements', relatesTo: 'IAS 19', status: 'Active' },
  IFRIC_12: { title: 'Service Concession Arrangements', relatesTo: 'Multiple', status: 'Active' },
  IFRIC_10: { title: 'Interim Financial Reporting and Impairment', relatesTo: 'IAS 34/IAS 36', status: 'Active' },
  IFRIC_7: { title: 'Applying Restatement Approach under IAS 29', relatesTo: 'IAS 29', status: 'Active' },
  IFRIC_6: { title: 'Liabilities from Participating in Specific Market — WEEE', relatesTo: 'IAS 37', status: 'Active' },
  IFRIC_5: { title: 'Rights to Interests in Decommissioning, Restoration and Environmental Funds', relatesTo: 'IAS 37/IAS 28', status: 'Active' },
  IFRIC_2: { title: 'Members Shares in Co-operative Entities', relatesTo: 'IAS 32', status: 'Active' },
  IFRIC_1: { title: 'Changes in Decommissioning, Restoration and Similar Liabilities', relatesTo: 'IAS 16/IAS 37', status: 'Active' },
  SIC_32: { title: 'Intangible Assets — Web Site Costs', relatesTo: 'IAS 38', status: 'Active' },
  SIC_29: { title: 'Service Concession Arrangements: Disclosures', relatesTo: 'IFRIC 12', status: 'Active' },
  SIC_25: { title: 'Income Taxes — Changes in Tax Status', relatesTo: 'IAS 12', status: 'Active' },
  SIC_7: { title: 'Introduction of the Euro', relatesTo: 'IAS 21', status: 'Active' }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Look up any IFRS or IAS standard by number
 * @param {string} standardId - e.g. 'IFRS_9', 'IAS_36', 'IFRS 15'
 * @returns {object|null}
 */
export function lookupStandard(standardId) {
  const normalised = standardId.replace(/\s+/g, '_').toUpperCase();
  return IFRS_STANDARDS[normalised] || IAS_STANDARDS[normalised] || null;
}

/**
 * Search IFRS/IAS standards by keyword
 * @param {string} keyword - e.g. 'revenue', 'impairment', 'lease'
 * @returns {Array}
 */
export function searchIFRSStandards(keyword) {
  const lower = keyword.toLowerCase();
  const results = [];

  for (const [key, std] of Object.entries({ ...IFRS_STANDARDS, ...IAS_STANDARDS })) {
    if (
      std.title?.toLowerCase().includes(lower) ||
      std.objective?.toLowerCase().includes(lower) ||
      std.keyRequirements?.some(r => r.toLowerCase().includes(lower))
    ) {
      results.push({ id: key, ...std });
    }
  }
  return results;
}

/**
 * Get the FRS 102 equivalent of an IFRS/IAS standard
 * @param {string} standardId
 * @returns {string|null}
 */
export function getFRS102Equivalent(standardId) {
  const std = lookupStandard(standardId);
  return std?.frs102Equivalent || null;
}
