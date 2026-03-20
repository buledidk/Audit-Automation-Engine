/**
 * COMPLETE FRS (Financial Reporting Standards) ENCYCLOPEDIA
 * Issued by the Financial Reporting Council (FRC), UK
 * Last updated: March 2026 — reflects all amendments through Periodic Review 2024
 *
 * Covers: FRS 100, 101, 102 (all 35 sections + Section 1A), 103, 104, 105
 */

// ============================================================================
// FRS 100 — APPLICATION OF FINANCIAL REPORTING REQUIREMENTS
// ============================================================================
export const FRS_100 = {
  id: 'FRS_100',
  title: 'Application of Financial Reporting Requirements',
  effectiveDate: '2015-01-01',
  lastAmended: '2024-01-01',
  issuer: 'FRC',
  scope: 'Determines which financial reporting framework applies to entities in the UK and Republic of Ireland',
  keyProvisions: [
    'Sets out the overall framework for financial reporting in the UK and RoI',
    'Entities reporting under EU-adopted IFRS apply IAS Regulation',
    'Entities not reporting under IFRS apply FRS 102 (or FRS 105 for micro-entities)',
    'Qualifying entities may apply FRS 101 Reduced Disclosure Framework',
    'Small entities may apply FRS 102 Section 1A',
    'Insurance entities apply FRS 103 for insurance contracts'
  ],
  frameworkHierarchy: {
    tier1_IFRS: {
      applicableTo: 'Listed companies, AIM-listed, banks, insurers (consolidated)',
      standard: 'UK-adopted IFRS (post-Brexit)',
      notes: 'Mandatory for all entities with securities admitted to trading on a UK regulated market'
    },
    tier2_FRS101: {
      applicableTo: 'Qualifying entities (subsidiaries of IFRS reporters)',
      standard: 'FRS 101 Reduced Disclosure Framework',
      notes: 'IFRS recognition and measurement with FRS 102-level disclosures'
    },
    tier3_FRS102: {
      applicableTo: 'All other entities not using IFRS or FRS 101/105',
      standard: 'FRS 102 The Financial Reporting Standard applicable in the UK and RoI',
      notes: 'Default UK GAAP standard, based on IFRS for SMEs'
    },
    tier4_FRS102_1A: {
      applicableTo: 'Small entities qualifying under Companies Act 2006 s382-384',
      standard: 'FRS 102 Section 1A Small Entities',
      notes: 'Simplified recognition, measurement, and disclosure'
    },
    tier5_FRS105: {
      applicableTo: 'Micro-entities qualifying under Companies Act 2006 s384A-384B',
      standard: 'FRS 105 The Financial Reporting Standard applicable to the Micro-entities Regime',
      notes: 'Highly simplified, no fair value, no revaluation, no deferred tax'
    }
  }
};

// ============================================================================
// FRS 101 — REDUCED DISCLOSURE FRAMEWORK
// ============================================================================
export const FRS_101 = {
  id: 'FRS_101',
  title: 'Reduced Disclosure Framework',
  effectiveDate: '2015-01-01',
  lastAmended: '2024-01-01',
  issuer: 'FRC',
  scope: 'Provides disclosure exemptions for qualifying entities that otherwise apply IFRS recognition and measurement',
  qualifyingConditions: [
    'Entity is a member of a group where the parent prepares publicly available consolidated financial statements under IFRS or equivalent',
    'Entity is not required by any statutory framework to prepare financial statements under IFRS',
    'Entity must notify shareholders in writing and no shareholders holding 5%+ have objected',
    'Entity must disclose in its accounts the parent that includes its results and where those accounts can be obtained'
  ],
  disclosureExemptions: {
    IFRS2: 'Share-based payment — exemption from paragraphs 45(b) and 46-52',
    IFRS3: 'Business combinations — exemption from disclosures in paragraphs 59-63 and B64-B67',
    IFRS7: 'Financial instruments disclosures — full exemption',
    IFRS13: 'Fair value measurement — exemption from paragraphs 91-99',
    IFRS15: 'Revenue — exemption from paragraphs 110-129',
    IFRS16: 'Leases — exemption from paragraphs 51-60 (lessee disclosures)',
    IAS1: 'Presentation — exemption from capital management disclosures (paragraphs 134-136)',
    IAS7: 'Statement of cash flows — full exemption',
    IAS8: 'Accounting policies — exemption from IFRSs issued but not yet effective',
    IAS24: 'Related party disclosures — exemption from key management compensation (paragraph 17)',
    IAS36: 'Impairment — exemption from paragraphs 134(d)-(f) and 135(c)-(e)',
    IAS38: 'Intangibles — exemption from reconciliation of carrying amount (paragraph 118(e))',
    IAS40: 'Investment property — exemption from reconciliation (paragraph 76)',
    IFRS17: 'Insurance contracts — exemption from paragraphs 94-132'
  },
  retainedRequirements: [
    'All recognition and measurement requirements of adopted IFRS',
    'Companies Act 2006 format requirements',
    'Related party transactions disclosure (not key management compensation)',
    'True and fair override disclosure',
    'FRS 101 basis for preparation note'
  ]
};

// ============================================================================
// FRS 102 — ALL 35 SECTIONS + SECTION 1A
// ============================================================================
export const FRS_102 = {
  id: 'FRS_102',
  title: 'The Financial Reporting Standard applicable in the UK and Republic of Ireland',
  effectiveDate: '2015-01-01',
  lastAmended: '2026-01-01',
  issuer: 'FRC',
  basedOn: 'IFRS for SMEs (2015)',
  scope: 'Default UK GAAP for entities not applying IFRS, FRS 101, or FRS 105',
  sections: {
    '1': {
      title: 'Scope of FRS 102',
      content: 'Applies to all entities preparing financial statements under FRS 102',
      keyPoints: [
        'Applies to all entities that are not required to apply EU-adopted IFRS',
        'Entities choosing to apply IFRS may not use FRS 102',
        'Financial institutions may apply FRS 102 with additional requirements'
      ],
      auditRelevance: 'Confirm entity qualifies for FRS 102 application'
    },
    '1A': {
      title: 'Small Entities',
      content: 'Simplified requirements for entities qualifying as small under Companies Act 2006',
      keyPoints: [
        'Must meet at least 2 of 3 thresholds: turnover ≤£10.2m, total assets ≤£5.1m, employees ≤50',
        'Simplified balance sheet and P&L formats (Schedule 1, Companies Act 2006)',
        'Reduced disclosure requirements — see Appendix C/D to Section 1A',
        'Filleted accounts option for Companies House filing',
        'No requirement for cash flow statement or directors report (if small)',
        'Audit exemption available (subject to conditions in s477-479)',
        'Can still voluntarily provide full FRS 102 disclosures',
        'Must disclose: accounting policies, related party transactions with directors, guarantees, financial commitments, contingent liabilities'
      ],
      thresholds: {
        turnover: 10200000,
        totalAssets: 5100000,
        employees: 50,
        mustMeet: '2 of 3 in current and prior year'
      },
      auditRelevance: 'Verify small entity qualification; check s477 audit exemption eligibility'
    },
    '2': {
      title: 'Concepts and Pervasive Principles',
      content: 'Underlying assumptions and qualitative characteristics of financial statements',
      keyPoints: [
        'Going concern assumption (s2.4)',
        'Accrual basis of accounting (s2.6)',
        'Qualitative characteristics: understandability, relevance, materiality, reliability, substance over form, prudence, completeness, comparability, timeliness, balance between benefit and cost',
        'Fair presentation and compliance with FRS 102',
        'True and fair override (s2.7)',
        'Offsetting only when required or permitted by FRS 102'
      ],
      auditRelevance: 'Foundation for ISA 200 overall objectives; going concern per ISA 570'
    },
    '3': {
      title: 'Financial Statement Presentation',
      content: 'Components and general features of financial statements',
      keyPoints: [
        'Complete set: statement of financial position, income statement (or statement of comprehensive income), statement of changes in equity, statement of cash flows, notes',
        'Comparative information required for all amounts',
        'Consistency of presentation between periods',
        'True and fair view requirement',
        'Materiality and aggregation principles',
        'Companies Act formats: Schedule 1 (adapted) or IFRS-style'
      ],
      auditRelevance: 'ISA 700 opinion covers presentation compliance'
    },
    '4': {
      title: 'Statement of Financial Position',
      content: 'Balance sheet classification and presentation',
      keyPoints: [
        'Current/non-current distinction required',
        'Order of liquidity permitted as alternative',
        'Line items per Companies Act Schedule 1',
        'Additional line items when material',
        'Sub-classifications in notes'
      ],
      auditRelevance: 'Classification testing; current/non-current split testing'
    },
    '5': {
      title: 'Statement of Comprehensive Income and Income Statement',
      content: 'Presentation of profit or loss and other comprehensive income',
      keyPoints: [
        'Single statement or two-statement approach permitted',
        'Analysis of expenses: by nature or by function',
        'Minimum line items required',
        'Other comprehensive income items: revaluation gains, defined benefit remeasurements, hedging gains/losses, foreign exchange differences',
        'Extraordinary items prohibited',
        'Separately disclosed items (material/non-recurring)'
      ],
      auditRelevance: 'Revenue recognition testing; expense classification; ISA 520 analytical procedures'
    },
    '6': {
      title: 'Statement of Changes in Equity and Statement of Income and Retained Earnings',
      content: 'Movements in equity components',
      keyPoints: [
        'Reconciliation of each component of equity',
        'Total comprehensive income for the period',
        'Transactions with owners (dividends, share issues)',
        'Simplified statement of income and retained earnings permitted if changes only from P&L, dividends, corrections, and policy changes'
      ],
      auditRelevance: 'Equity completeness testing; dividend legality (s830 CA 2006)'
    },
    '7': {
      title: 'Statement of Cash Flows',
      content: 'Cash flow presentation and classification',
      keyPoints: [
        'Three categories: operating, investing, financing',
        'Indirect method generally used (direct method permitted)',
        'Interest and dividends classification policy',
        'Non-cash transactions excluded but disclosed',
        'Foreign currency cash flows',
        'Small entities applying Section 1A exempt from preparing cash flow statement'
      ],
      auditRelevance: 'Cash flow verification; ISA 570 going concern cash flow forecasts'
    },
    '8': {
      title: 'Notes to the Financial Statements',
      content: 'Structure and content of notes disclosures',
      keyPoints: [
        'Basis of preparation statement',
        'Accounting policies for each material area',
        'Judgments in applying accounting policies (s8.6)',
        'Key sources of estimation uncertainty (s8.7)',
        'Cross-referencing between statements and notes',
        'Systematic ordering of notes'
      ],
      auditRelevance: 'ISA 540 estimates; ISA 700 true and fair opinion; disclosure completeness'
    },
    '9': {
      title: 'Consolidated and Separate Financial Statements',
      content: 'Group accounting requirements',
      keyPoints: [
        'Parent must prepare consolidated accounts unless exempted (s400-401 CA 2006)',
        'Control definition: power to govern financial and operating policies',
        'All subsidiaries consolidated unless held exclusively for resale',
        'Uniform accounting policies across the group',
        'Intra-group eliminations required',
        'Non-controlling interests presentation',
        'Investment in subsidiaries in separate accounts: cost or fair value'
      ],
      auditRelevance: 'ISA 600 group audit considerations; consolidation testing'
    },
    '10': {
      title: 'Accounting Policies, Estimates and Errors',
      content: 'Selection, changes, and corrections of accounting information',
      keyPoints: [
        'Accounting policies selected per FRS 102 hierarchy',
        'Change in policy: retrospective application with restatement',
        'Change in estimate: prospective application only',
        'Prior period errors: retrospective restatement',
        'Impracticability exemption for retrospective application'
      ],
      auditRelevance: 'ISA 540 estimates; consistency testing; prior year adjustments'
    },
    '11': {
      title: 'Basic Financial Instruments',
      content: 'Simple financial instruments measurement and recognition',
      keyPoints: [
        'Debt instruments at amortised cost (effective interest method)',
        'Commitments to receive/make a loan at amortised cost',
        'Investments in non-convertible preference shares at fair value through P&L or cost less impairment',
        'Derecognition when rights expire or substantially all risks/rewards transferred',
        'Impairment of financial assets: incurred loss model',
        'Bad debt provisions and expected credit losses',
        'Hedge accounting available under Section 12'
      ],
      auditRelevance: 'Bank confirmation testing (ISA 505); receivables/payables valuation; impairment assessment'
    },
    '12': {
      title: 'Other Financial Instruments Issues',
      content: 'Complex financial instruments and hedge accounting',
      keyPoints: [
        'Fair value through P&L for instruments not qualifying as basic under s11',
        'Derivatives always at fair value through P&L',
        'Hedge accounting: fair value hedges, cash flow hedges, net investment hedges',
        'Hedge effectiveness testing requirements',
        'Embedded derivatives in non-financial host contracts',
        'Compound instruments (convertible debt)',
        'Disclosure of risks: credit, liquidity, market (interest rate, currency, other price)'
      ],
      auditRelevance: 'ISA 540 fair value estimates; specialist involvement for complex instruments'
    },
    '13': {
      title: 'Inventories',
      content: 'Measurement, costing methods, and write-downs',
      keyPoints: [
        'Measure at lower of cost and estimated selling price less costs to complete and sell (NRV)',
        'Cost includes: purchase costs, conversion costs, other costs to bring to present location/condition',
        'Cost formulas: FIFO or weighted average (LIFO prohibited)',
        'Standard cost or retail method acceptable approximations',
        'Write-down to NRV item by item or by groups',
        'Reversal of write-downs when conditions no longer exist',
        'Agricultural produce: fair value less estimated point-of-sale costs at harvest'
      ],
      auditRelevance: 'ISA 501 inventory attendance; NRV testing; obsolescence provisions; cost build-up verification'
    },
    '14': {
      title: 'Investments in Associates',
      content: 'Equity method accounting for significant influence investments',
      keyPoints: [
        'Significant influence: power to participate (not control) in financial/operating decisions',
        'Presumed at 20%+ holding unless clearly demonstrated otherwise',
        'Equity method in consolidated accounts',
        'Cost model or fair value model in individual accounts',
        'Impairment testing when indicators exist',
        'Transactions with associates: profit elimination to extent of interest'
      ],
      auditRelevance: 'Significant influence assessment; equity method calculations; impairment testing'
    },
    '15': {
      title: 'Investments in Joint Ventures',
      content: 'Accounting for joint arrangements',
      keyPoints: [
        'Joint control: contractually agreed sharing of control',
        'Three types: jointly controlled operations, jointly controlled assets, jointly controlled entities',
        'Jointly controlled entities: equity method (or cost/fair value in separate accounts)',
        'Jointly controlled operations/assets: recognise own share of assets, liabilities, income, expenses',
        'Disclosure of commitments and contingencies relating to joint ventures'
      ],
      auditRelevance: 'Joint control assessment; arrangement classification; share of results verification'
    },
    '16': {
      title: 'Investment Property',
      content: 'Property held for rental income or capital appreciation',
      keyPoints: [
        'Measured at fair value through P&L (if determinable without undue cost/effort)',
        'Otherwise, cost model under Section 17 with investment property disclosures',
        'Mixed-use property: split if portions can be sold/leased separately',
        'Transfers to/from investment property when use changes',
        'No depreciation when measured at fair value',
        'Annual fair value determination required'
      ],
      auditRelevance: 'ISA 540 fair value estimates; valuation specialist; property market evidence'
    },
    '17': {
      title: 'Property, Plant and Equipment',
      content: 'Tangible fixed assets recognition, measurement, and depreciation',
      keyPoints: [
        'Recognition when future economic benefits probable and cost reliably measurable',
        'Initial measurement at cost (purchase price + directly attributable costs)',
        'Subsequent measurement: cost model or revaluation model',
        'Component depreciation required for significant components',
        'Depreciation: systematic allocation over useful life',
        'Methods: straight-line, diminishing balance, units of production',
        'Residual value and useful life reviewed at least at each reporting date',
        'Revaluation: entire class revalued; surplus to revaluation reserve',
        'Derecognition on disposal or when no future benefits expected'
      ],
      auditRelevance: 'Existence testing; valuation/depreciation policy; additions/disposals verification; impairment indicators (s27)'
    },
    '18': {
      title: 'Intangible Assets other than Goodwill',
      content: 'Recognition and measurement of intangible assets',
      keyPoints: [
        'Recognition: identifiable, controlled by entity, future economic benefits',
        'Separately acquired: at cost',
        'Business combination: at fair value at acquisition date',
        'Internally generated: development costs capitalised only if 6 criteria met (s18.8H)',
        'Research costs always expensed',
        'Amortisation over useful life (maximum 10 years if cannot be reliably estimated under FRS 102)',
        'Indefinite life not permitted under FRS 102 (unlike IAS 38)',
        'Impairment testing per Section 27',
        'Website development costs: partially capitalisable (application/infrastructure development stage)'
      ],
      developmentCapitalisationCriteria: [
        'Technical feasibility of completing the asset',
        'Intention to complete and use or sell',
        'Ability to use or sell the asset',
        'How the asset will generate probable future economic benefits',
        'Availability of adequate resources to complete',
        'Ability to measure expenditure reliably'
      ],
      auditRelevance: 'Capitalisation criteria testing; amortisation rates; impairment review; R&D classification'
    },
    '19': {
      title: 'Business Combinations and Goodwill',
      content: 'Purchase method accounting for acquisitions',
      keyPoints: [
        'Purchase method (acquisition method) required for all business combinations',
        'Cost: fair value of consideration at acquisition date',
        'Identifiable net assets at fair value at acquisition date',
        'Goodwill = cost of combination less net fair value of identifiable assets/liabilities',
        'Negative goodwill: first review allocation, then recognise in P&L below line',
        'Goodwill amortised over useful life (max 10 years if cannot be reliably estimated)',
        'Annual impairment review if amortised over >10 years or if indicators',
        'Contingent consideration: recognised at fair value at acquisition date',
        'Acquisition-related costs: expensed (not capitalised)'
      ],
      auditRelevance: 'Purchase price allocation; goodwill impairment; fair value of acquired assets; contingent consideration'
    },
    '20': {
      title: 'Leases',
      content: 'Classification and accounting for lease arrangements',
      keyPoints: [
        'Finance lease: transfers substantially all risks and rewards of ownership',
        'Operating lease: all other leases',
        'Indicators of finance lease: transfer of ownership, bargain purchase option, lease term = major part of economic life, PV of payments ≈ fair value, specialised asset',
        'Lessee — finance lease: recognise asset and liability at lower of fair value and PV of minimum lease payments',
        'Lessee — operating lease: recognise payments on straight-line basis (or systematic basis)',
        'Lessor — finance lease: recognise receivable at net investment',
        'Lessor — operating lease: recognise asset; rental income on straight-line basis',
        'Sale and leaseback: depends on resulting lease classification',
        'Note: FRS 102 retains IAS 17-style classification (unlike IFRS 16 single model)'
      ],
      auditRelevance: 'Lease classification testing; lease liability calculations; right-of-use assets (if IFRS 16 option used); operating lease commitment disclosures'
    },
    '21': {
      title: 'Provisions and Contingencies',
      content: 'Recognition and measurement of provisions, contingent liabilities and contingent assets',
      keyPoints: [
        'Provision recognised when: present obligation from past event, probable outflow, reliably estimable',
        'Best estimate: amount entity would rationally pay to settle or transfer',
        'Discounting required when effect of time value is material (pre-tax discount rate)',
        'Contingent liability: disclosed unless remote; not recognised',
        'Contingent asset: disclosed when inflow probable; recognised only when virtually certain',
        'Specific provisions: restructuring (detailed formal plan announced), onerous contracts, legal claims, warranty, decommissioning',
        'Annual review and adjustment required',
        'Reimbursement assets recognised separately if virtually certain'
      ],
      auditRelevance: 'ISA 540 estimates; lawyers letters; management representations; completeness of provisions'
    },
    '22': {
      title: 'Liabilities and Equity',
      content: 'Classification of instruments as liabilities or equity',
      keyPoints: [
        'Liability: contractual obligation to deliver cash or another financial asset',
        'Equity: residual interest in assets after deducting liabilities',
        'Compound instruments: split liability and equity components',
        'Shares redeemable at holder option: liability',
        'Dividends: recognised when obligation established (declared)',
        'Own shares: deducted from equity, not assets',
        'Issue costs of equity instruments: deducted from equity'
      ],
      auditRelevance: 'Instrument classification testing; dividend legality; compound instrument splitting'
    },
    '23': {
      title: 'Revenue',
      content: 'Recognition and measurement of revenue from contracts',
      keyPoints: [
        'Revenue from sale of goods: recognised when risks/rewards transferred, revenue measurable, economic benefits probable',
        'Revenue from services: percentage of completion method',
        'Construction contracts: percentage of completion method (s23.17-23.20)',
        'Interest: effective interest method',
        'Royalties: accrual basis per substance of agreement',
        'Dividends: when right to receive established',
        'Multiple-element arrangements: allocate to separately identifiable components',
        'Bill-and-hold, consignment, instalment sales: specific guidance',
        'Government grants: Section 24',
        'Note: FRS 102 retains IAS 18-style approach (unlike IFRS 15 five-step model)'
      ],
      auditRelevance: 'ISA 240 presumed fraud risk in revenue; cut-off testing; completeness; occurrence; contract analysis'
    },
    '24': {
      title: 'Government Grants',
      content: 'Recognition and measurement of government grants',
      keyPoints: [
        'Two models available: performance model or accrual model',
        'Performance model: recognise when performance conditions met',
        'Accrual model: recognise systematically over periods to match related costs',
        'Grants for assets: deferred income or deduction from asset carrying amount',
        'Grants without specific conditions: recognise when receivable',
        'Repayment: adjustment to grant previously recognised',
        'Disclose: nature, amounts, unfulfilled conditions, other forms of government assistance'
      ],
      auditRelevance: 'Grant conditions testing; clawback risk assessment; R&D tax credits'
    },
    '25': {
      title: 'Borrowing Costs',
      content: 'Accounting for interest and other borrowing costs',
      keyPoints: [
        'Default: expense all borrowing costs as incurred',
        'Accounting policy choice: capitalise borrowing costs directly attributable to qualifying assets',
        'Qualifying asset: substantial period of time to get ready for intended use/sale',
        'Capitalisation begins when expenditure incurred, borrowing costs incurred, and activities to prepare asset underway',
        'Cease capitalisation when substantially all activities complete',
        'Disclose: accounting policy, amount capitalised, capitalisation rate'
      ],
      auditRelevance: 'Policy consistency; capitalisation rate calculation; qualifying asset identification'
    },
    '26': {
      title: 'Share-based Payment',
      content: 'Equity-settled and cash-settled share-based payment transactions',
      keyPoints: [
        'Equity-settled: measure at fair value of equity instruments granted at grant date',
        'Cash-settled: measure at fair value of liability at each reporting date',
        'Goods/services: fair value of goods/services received (or fair value of equity instruments if goods/services cannot be reliably measured)',
        'Vesting conditions: service and performance conditions affect number of instruments expected to vest',
        'Market conditions: reflected in fair value measurement at grant date',
        'Expense recognition over vesting period',
        'Group share-based payment: guidance on allocation within group',
        'Modifications, cancellations, and settlements: additional charge for beneficial modifications',
        'Disclosure: description of arrangements, movements, fair value assumptions'
      ],
      auditRelevance: 'Fair value measurement (ISA 540); vesting condition assessment; expense calculation verification'
    },
    '27': {
      title: 'Impairment of Assets',
      content: 'Indicators, measurement, and reversal of impairment losses',
      keyPoints: [
        'Assess at each reporting date whether indicators of impairment exist',
        'External indicators: decline in market value, adverse changes in environment/markets, increase in interest rates',
        'Internal indicators: obsolescence/damage, adverse changes in use, worse-than-expected performance',
        'Recoverable amount: higher of fair value less costs to sell and value in use',
        'Value in use: present value of future cash flows (pre-tax discount rate)',
        'Cash-generating units (CGUs): smallest group of assets generating independent cash flows',
        'Goodwill impairment: allocate to CGUs, test at least annually',
        'Reversal of impairment: permitted (except for goodwill)',
        'Disclosure: impairment losses/reversals by class of asset, events and circumstances'
      ],
      auditRelevance: 'ISA 540 estimates; discount rate assessment; CGU identification; goodwill annual testing'
    },
    '28': {
      title: 'Employee Benefits',
      content: 'All forms of consideration given by entity in exchange for services',
      keyPoints: [
        'Short-term benefits: recognise when employee has rendered service (wages, salaries, paid absences)',
        'Post-employment benefits — defined contribution: expense when contributions due',
        'Post-employment benefits — defined benefit: recognise net defined benefit liability/asset',
        'Defined benefit measurement: projected unit credit method (actuarial valuation)',
        'Actuarial gains/losses: recognise in other comprehensive income',
        'Plan assets measured at fair value',
        'Multi-employer plans: defined contribution accounting if cannot identify share',
        'Other long-term benefits (long-service, sabbatical): recognise obligation',
        'Termination benefits: recognise when entity demonstrably committed (detailed plan announced)',
        'Disclosure: nature of plans, amounts recognised, key assumptions, funding status'
      ],
      auditRelevance: 'ISA 540 actuarial estimates; specialist involvement; funding obligations; multi-employer plan classification'
    },
    '29': {
      title: 'Income Tax',
      content: 'Current and deferred tax accounting',
      keyPoints: [
        'Current tax: based on taxable profit at enacted/substantively enacted rates',
        'Deferred tax: recognised on all timing differences using the timing differences approach',
        'Timing difference: difference between taxable profits and total comprehensive income that originate in one period and reverse in another',
        'Deferred tax asset: recognise only to extent that recovery is probable',
        'Tax rate: enacted or substantively enacted rate expected to apply when timing difference reverses',
        'Deferred tax on revaluation gains: provided on basis of recovery through use or sale',
        'Deferred tax on business combinations: recognised on fair value adjustments',
        'Uncertain tax positions: recognise based on best estimate of probable amount',
        'Offset: only when legal right and intention to settle net',
        'Note: FRS 102 uses "timing differences" approach (not IAS 12 "temporary differences")'
      ],
      auditRelevance: 'Tax rate verification; timing difference calculations; loss carry-forward recoverability; uncertain positions'
    },
    '30': {
      title: 'Foreign Currency Translation',
      content: 'Transactions and translation of foreign operations',
      keyPoints: [
        'Functional currency: currency of primary economic environment',
        'Transactions: translate at spot rate (or average rate for period if rates do not fluctuate significantly)',
        'Monetary items at period-end: translate at closing rate',
        'Non-monetary items at historical cost: translate at transaction date rate',
        'Exchange differences: recognised in P&L (except hedging and net investment in foreign operation)',
        'Foreign operations: translate using closing rate method (assets/liabilities at closing rate, income/expenses at average)',
        'Exchange differences on net investment: recognised in other comprehensive income',
        'Disposal of foreign operation: cumulative exchange difference recycled to P&L'
      ],
      auditRelevance: 'Exchange rate testing; functional currency determination; translation reserve movements'
    },
    '31': {
      title: 'Hyperinflation',
      content: 'Financial reporting in hyperinflationary economies',
      keyPoints: [
        'Applies when functional currency is of hyperinflationary economy',
        'Indicators: general population uses stable foreign currency, prices quoted in stable currency, sales prices adjusted for inflation, cumulative 3-year inflation approaching or exceeding 100%',
        'Restate financial statements for changes in general purchasing power',
        'Use general price index',
        'All amounts restated at current reporting date purchasing power'
      ],
      auditRelevance: 'Rarely applicable for UK entities; relevant for foreign subsidiaries in hyperinflationary economies'
    },
    '32': {
      title: 'Events after the End of the Reporting Period',
      content: 'Adjusting and non-adjusting events',
      keyPoints: [
        'Adjusting events: conditions existed at reporting date — adjust financial statements',
        'Non-adjusting events: conditions arose after reporting date — disclose if material',
        'Examples of adjusting: settlement of court case, bankruptcy of customer, discovery of fraud/error, sale of inventory below cost',
        'Examples of non-adjusting: business combination, major restructuring plan, major fire/flood, abnormal currency movements',
        'Going concern: if deterioration after reporting date, may need to change basis of preparation',
        'Dividends declared after reporting date: not a liability at period end',
        'Authorisation date for issue: disclose'
      ],
      auditRelevance: 'ISA 560 subsequent events procedures; post-balance-sheet review'
    },
    '33': {
      title: 'Related Party Disclosures',
      content: 'Identification and disclosure of related party relationships and transactions',
      keyPoints: [
        'Related parties include: parent, subsidiaries, fellow subsidiaries, associates, joint ventures, key management personnel and their close family, entities controlled by key management',
        'Disclose: nature of relationship, description of transactions, amounts, outstanding balances, terms, guarantees, provisions for doubtful debts, expense for bad debts',
        'Key management personnel compensation: disclosed in total',
        'Parent-subsidiary relationship: always disclosed (even if no transactions)',
        'Government-related entities: modified disclosure requirements',
        'Small entity exemption (Section 1A): reduced disclosure but must still disclose transactions with directors and their close family'
      ],
      auditRelevance: 'ISA 550 related party identification and testing; completeness of disclosure; management representations'
    },
    '34': {
      title: 'Specialised Activities',
      content: 'Agriculture, extractive activities, service concessions, financial institutions, retirement benefit plans, heritage assets',
      keyPoints: [
        'Agriculture: biological assets at fair value less costs to sell (or cost model if fair value not readily determinable)',
        'Extractive activities: capitalise exploration/evaluation costs, impairment testing',
        'Service concession arrangements: operator accounting depends on arrangement type',
        'Financial institutions: additional disclosure requirements for loans, credit risk, capital',
        'Retirement benefit plans (entity-level): separate guidance for plan financial statements',
        'Heritage assets: cost or valuation; depreciation not required if indefinite useful life; FRS 102 para 34.52+',
        'Public benefit entities (PBEs): additional module with guidance on concessionary loans, incoming resources, entity combinations'
      ],
      auditRelevance: 'Industry-specific audit procedures; fair value of biological assets; heritage asset registers'
    },
    '35': {
      title: 'Transition to FRS 102',
      content: 'First-time adoption requirements and exemptions',
      keyPoints: [
        'Opening balance sheet at date of transition (beginning of earliest comparative period)',
        'Apply FRS 102 recognition and measurement to all items',
        'Exemptions available: business combinations (prior to transition date), share-based payment, fair value as deemed cost, compound financial instruments, deferred tax, service concessions, borrowing costs, dormant companies',
        'Mandatory exceptions: derecognition of financial instruments, hedge accounting, estimates, non-controlling interests, government loans',
        'Disclose reconciliation of equity at date of transition and end of latest period under previous framework',
        'Disclose reconciliation of total comprehensive income for latest period under previous framework'
      ],
      auditRelevance: 'Transition adjustments verification; opening balance sheet; exemption eligibility; comparative restatement'
    }
  }
};

// ============================================================================
// FRS 103 — INSURANCE CONTRACTS
// ============================================================================
export const FRS_103 = {
  id: 'FRS_103',
  title: 'Insurance Contracts',
  effectiveDate: '2015-01-01',
  lastAmended: '2024-01-01',
  issuer: 'FRC',
  scope: 'Insurance contracts issued and reinsurance contracts held by any entity',
  keyProvisions: [
    'Defines insurance contract: contract under which one party (insurer) accepts significant insurance risk from another party (policyholder)',
    'Existing accounting practices for insurance contracts retained (grandfathered)',
    'Insurer may change accounting policies only if result is more relevant and no less reliable',
    'Adequacy test for insurance liabilities required',
    'If liability inadequacy identified, additional liability recognised in P&L',
    'Reinsurance assets: impairment testing required',
    'Embedded derivatives in insurance contracts: separation required unless closely related',
    'Disclosure: nature and extent of risks arising from insurance contracts, effect of regulatory frameworks'
  ],
  auditRelevance: 'Specialist sector; actuarial involvement; adequacy testing of reserves; reinsurance recoverability'
};

// ============================================================================
// FRS 104 — INTERIM FINANCIAL REPORTING
// ============================================================================
export const FRS_104 = {
  id: 'FRS_104',
  title: 'Interim Financial Reporting',
  effectiveDate: '2015-01-01',
  lastAmended: '2024-01-01',
  issuer: 'FRC',
  scope: 'Entities that publish interim financial reports under FRS 102',
  keyProvisions: [
    'Minimum content: condensed balance sheet, condensed income statement, condensed statement of changes in equity, condensed cash flow statement, selected explanatory notes',
    'Same accounting policies as annual financial statements',
    'Materiality assessed relative to interim period data (not annualised)',
    'Revenue recognition: same criteria as annual; seasonal revenue not anticipated or deferred',
    'Costs incurred unevenly: anticipated or deferred only if also at year-end',
    'Tax expense: best estimate of weighted average annual effective rate',
    'Comparative information: same interim period of prior year',
    'Disclosure of significant events and transactions since last annual report'
  ],
  auditRelevance: 'Interim review engagement (ISRE 2410); half-year reports for listed entities'
};

// ============================================================================
// FRS 105 — MICRO-ENTITIES REGIME
// ============================================================================
export const FRS_105 = {
  id: 'FRS_105',
  title: 'The Financial Reporting Standard applicable to the Micro-entities Regime',
  effectiveDate: '2016-01-01',
  lastAmended: '2024-01-01',
  issuer: 'FRC',
  scope: 'Micro-entities qualifying under Companies Act 2006 s384A-384B',
  thresholds: {
    turnover: 632000,
    totalAssets: 316000,
    employees: 10,
    mustMeet: '2 of 3 in current and prior year'
  },
  exclusions: [
    'Companies excluded from small companies regime (s384)',
    'Investment undertakings',
    'Charitable companies',
    'Companies that are part of an ineligible group',
    'Financial institutions'
  ],
  keyProvisions: [
    'Highly simplified financial statements — balance sheet and P&L only',
    'No notes required (only limited footnote information on balance sheet)',
    'No fair value accounting — all items at cost less impairment',
    'No revaluation of assets',
    'No deferred tax recognition',
    'No financial instrument disclosures',
    'No directors report required',
    'No cash flow statement',
    'No statement of changes in equity',
    'Development costs must be expensed (no capitalisation)',
    'Investment property at cost (not fair value)',
    'Government grants: performance model (recognise when conditions met)',
    'Share-based payment: intrinsic value method (not fair value)',
    'Goodwill: amortised over useful life (max 5 years if cannot estimate)',
    'No going concern disclosure required unless material uncertainty'
  ],
  filingRequirements: {
    companiesHouse: 'Micro-entity accounts — simplified balance sheet only',
    hmrc: 'iXBRL tagged accounts for Corporation Tax return',
    auditExemption: 'Exempt from audit (s477-479 CA 2006)'
  },
  auditRelevance: 'Typically audit-exempt; relevant for accounts preparation and compilation engagements'
};

// ============================================================================
// CENTRAL FRS INDEX
// ============================================================================
export const FRS_STANDARDS_INDEX = {
  FRS_100: { id: 'FRS_100', title: 'Application of Financial Reporting Requirements', category: 'Framework' },
  FRS_101: { id: 'FRS_101', title: 'Reduced Disclosure Framework', category: 'Framework' },
  FRS_102: { id: 'FRS_102', title: 'The Financial Reporting Standard applicable in the UK and RoI', category: 'Core Standard' },
  FRS_102_1A: { id: 'FRS_102_1A', title: 'FRS 102 Section 1A — Small Entities', category: 'Simplified' },
  FRS_103: { id: 'FRS_103', title: 'Insurance Contracts', category: 'Specialist' },
  FRS_104: { id: 'FRS_104', title: 'Interim Financial Reporting', category: 'Reporting' },
  FRS_105: { id: 'FRS_105', title: 'Micro-entities Regime', category: 'Simplified' }
};

/**
 * Lookup a specific FRS 102 section by number
 * @param {string|number} sectionNumber - e.g. '17' or 17 or '1A'
 * @returns {object|null} Section data or null if not found
 */
export function lookupFRS102Section(sectionNumber) {
  const key = String(sectionNumber);
  return FRS_102.sections[key] || null;
}

/**
 * Get all FRS 102 sections relevant to a specific audit area
 * @param {string} keyword - e.g. 'revenue', 'lease', 'tax'
 * @returns {Array} Matching sections
 */
export function searchFRSSections(keyword) {
  const lower = keyword.toLowerCase();
  return Object.entries(FRS_102.sections)
    .filter(([, section]) =>
      section.title.toLowerCase().includes(lower) ||
      section.content.toLowerCase().includes(lower) ||
      section.keyPoints.some(p => p.toLowerCase().includes(lower))
    )
    .map(([key, section]) => ({ sectionNumber: key, ...section }));
}
