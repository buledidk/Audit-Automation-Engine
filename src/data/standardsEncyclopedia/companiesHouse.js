/**
 * COMPLETE COMPANIES HOUSE UK ENCYCLOPEDIA
 * Filing requirements, thresholds, deadlines, entity classifications,
 * and API integration reference
 * Last updated: March 2026
 */

// ============================================================================
// ENTITY SIZE CLASSIFICATION — COMPANIES ACT 2006
// ============================================================================
export const ENTITY_CLASSIFICATIONS = {
  micro: {
    id: 'micro',
    label: 'Micro-entity',
    legislation: 'Companies Act 2006, s384A-384B',
    thresholds: {
      turnover: { max: 632000, label: '≤ £632,000' },
      balanceSheetTotal: { max: 316000, label: '≤ £316,000' },
      employees: { max: 10, label: '≤ 10' },
      requirement: 'Must not exceed 2 of 3 thresholds in current AND prior year'
    },
    reportingFramework: 'FRS 105',
    auditRequired: false,
    auditExemptionBasis: 's477 Companies Act 2006 — small company audit exemption (micro qualifies as small)',
    filingRequirements: {
      annualAccounts: {
        content: 'Micro-entity minimum accounts — abridged balance sheet only',
        notes: 'No P&L, no notes, no directors report required',
        deadline: '9 months after accounting reference date',
        latePenalties: { upTo1Month: 150, upTo3Months: 375, upTo6Months: 750, over6Months: 1500 }
      },
      confirmationStatement: {
        content: 'CS01 — annual confirmation of company details',
        deadline: '14 days after review period end (anniversary of incorporation or last CS)',
        fee: 13,
        onlineFee: 13
      },
      changeForms: 'AD01 (registered office), AP01/AP02/AP03/AP04 (directors), SH01 (allotment), TM01 (termination)',
      accountsDelivery: 'Online via Companies House WebFiling or Software Filing, or paper'
    },
    excludedEntities: [
      'Public companies',
      'Companies authorised under Financial Services and Markets Act 2000',
      'Members of ineligible groups',
      'Charitable companies',
      'Companies whose securities admitted to regulated market in EEA'
    ]
  },

  small: {
    id: 'small',
    label: 'Small company',
    legislation: 'Companies Act 2006, s382-384',
    thresholds: {
      turnover: { max: 10200000, label: '≤ £10.2 million' },
      balanceSheetTotal: { max: 5100000, label: '≤ £5.1 million' },
      employees: { max: 50, label: '≤ 50' },
      requirement: 'Must not exceed 2 of 3 thresholds in current AND prior year'
    },
    reportingFramework: 'FRS 102 Section 1A (or full FRS 102 voluntarily)',
    auditRequired: false,
    auditExemptionBasis: 's477 Companies Act 2006',
    auditExemptionConditions: [
      'Company qualifies as small under s382',
      'Not a public company (s475)',
      'Not a member of a group that does not qualify as small (s479)',
      'Not excluded by s478 (banking, insurance, FSMA authorised, e-money issuer)',
      'No shareholder request under s476 (holders of 10%+ shares or share capital can require audit)'
    ],
    filingRequirements: {
      annualAccounts: {
        content: 'Abbreviated or filleted accounts permitted',
        options: [
          'Full accounts (balance sheet, P&L, notes) — filed with Companies House',
          'Filleted accounts (omit P&L and directors report from CH filing) — s444(1)',
          'Abridged accounts (simplified balance sheet and P&L) — s444A'
        ],
        deadline: '9 months after accounting reference date',
        latePenalties: { upTo1Month: 150, upTo3Months: 375, upTo6Months: 750, over6Months: 1500 }
      },
      confirmationStatement: {
        content: 'CS01',
        deadline: '14 days after review period end',
        fee: 13
      },
      directorsReport: 'Required by law but may be omitted from CH filing (s415A)',
      accountsDelivery: 'Online or paper'
    },
    smallGroupQualification: {
      legislation: 's383 Companies Act 2006',
      aggregateThresholds: {
        turnover: { max: 10200000, net: true },
        balanceSheetTotal: { max: 5100000, net: true },
        employees: { max: 50 }
      },
      grossThresholds: {
        turnover: { max: 12200000 },
        balanceSheetTotal: { max: 6100000 }
      },
      note: 'Net = after consolidation adjustments; Gross = before adjustments. Meet net OR gross thresholds.'
    }
  },

  medium: {
    id: 'medium',
    label: 'Medium-sized company',
    legislation: 'Companies Act 2006, s465-467',
    thresholds: {
      turnover: { max: 36000000, label: '≤ £36 million' },
      balanceSheetTotal: { max: 18000000, label: '≤ £18 million' },
      employees: { max: 250, label: '≤ 250' },
      requirement: 'Must not exceed 2 of 3 thresholds in current AND prior year'
    },
    reportingFramework: 'FRS 102 (full) or UK-adopted IFRS',
    auditRequired: true,
    filingRequirements: {
      annualAccounts: {
        content: 'Full accounts required (but may file abbreviated P&L for CH)',
        options: [
          'Full accounts with complete notes',
          'May start P&L at gross profit line for CH filing (s445)',
          'Must include auditors report',
          'Must include directors report'
        ],
        deadline: '9 months after accounting reference date',
        latePenalties: { upTo1Month: 150, upTo3Months: 375, upTo6Months: 750, over6Months: 1500 }
      },
      confirmationStatement: {
        content: 'CS01',
        deadline: '14 days after review period end',
        fee: 13
      },
      strategicReport: 'Required (s414A) unless company qualifies as small',
      directorsReport: 'Required (s415)',
      auditorsReport: 'Required — must be filed with accounts',
      accountsDelivery: 'Online or paper'
    }
  },

  large: {
    id: 'large',
    label: 'Large private company',
    legislation: 'Companies Act 2006 (exceeds medium thresholds)',
    thresholds: {
      turnover: { min: 36000001, label: '> £36 million' },
      balanceSheetTotal: { min: 18000001, label: '> £18 million' },
      employees: { min: 251, label: '> 250' },
      requirement: 'Exceeds 2 of 3 medium-sized thresholds'
    },
    reportingFramework: 'FRS 102 (full) or UK-adopted IFRS',
    auditRequired: true,
    filingRequirements: {
      annualAccounts: {
        content: 'Full unabbreviated accounts',
        includes: [
          'Balance sheet',
          'Profit and loss account (full)',
          'Statement of changes in equity',
          'Cash flow statement',
          'Complete notes to the accounts',
          'Strategic report',
          'Directors report',
          'Auditors report'
        ],
        deadline: '9 months after accounting reference date (private), 6 months (public)',
        latePenalties: {
          private: { upTo1Month: 150, upTo3Months: 375, upTo6Months: 750, over6Months: 1500 },
          public: { upTo1Month: 750, upTo3Months: 1500, upTo6Months: 3000, over6Months: 7500 }
        }
      },
      confirmationStatement: {
        content: 'CS01',
        deadline: '14 days after review period end',
        fee: 13
      },
      additionalRequirements: [
        'Energy and Carbon Report (SECR) if qualifying — s414CB',
        'Payment Practices and Performance reporting if applicable',
        'Modern Slavery statement (if turnover ≥ £36m)',
        'Gender Pay Gap reporting (if ≥ 250 employees)',
        'Directors Remuneration Report (quoted companies only)'
      ]
    }
  },

  plc: {
    id: 'plc',
    label: 'Public limited company (PLC) / Listed / PIE',
    legislation: 'Companies Act 2006, FCA Listing Rules, DTR',
    thresholds: {
      note: 'No size exemptions — all PLCs must have audit regardless of size'
    },
    reportingFramework: 'UK-adopted IFRS (mandatory for consolidated accounts of listed entities)',
    auditRequired: true,
    isPIE: true,
    filingRequirements: {
      annualAccounts: {
        content: 'Full IFRS accounts with all additional listed entity disclosures',
        includes: [
          'Full financial statements per UK-adopted IFRS',
          'Strategic report (enhanced)',
          'Directors report (enhanced)',
          'Directors remuneration report',
          'Corporate governance statement',
          'Audit committee report',
          'Auditors report (enhanced — KAMs, going concern, viability)',
          'Section 172 statement',
          'Non-financial information statement (if applicable)'
        ],
        companiesHouseDeadline: '6 months after accounting reference date',
        latePenalties: { upTo1Month: 750, upTo3Months: 1500, upTo6Months: 3000, over6Months: 7500 }
      },
      interimReports: {
        content: 'Half-yearly financial reports per DTR 4.2',
        deadline: '3 months after end of half-year period',
        review: 'ISRE 2410 review recommended (required for Premium Listed)'
      },
      confirmationStatement: {
        content: 'CS01',
        deadline: '14 days after review period end',
        fee: 13
      },
      continuousDisclosure: 'Inside information must be disclosed per MAR (Market Abuse Regulation)',
      annualReport: 'Publish within 4 months of year-end (DTR 4.1)',
      additionalPIERequirements: [
        'Engagement Quality Review (ISA 220 / ISQM 2)',
        'Key Audit Matters in audit report (ISA 701)',
        'Enhanced going concern and viability reporting',
        'Mandatory audit firm rotation (20 years max, with retendering at 10 years)',
        'Non-audit services cap (70% of 3-year average audit fee)',
        'Audit committee pre-approval of non-audit services',
        'Extended audit report (work done, materiality, scope)'
      ]
    }
  },

  llp: {
    id: 'llp',
    label: 'Limited Liability Partnership (LLP)',
    legislation: 'Limited Liability Partnerships Act 2000; LLP (Accounts and Audit) Regulations 2008',
    thresholds: {
      note: 'Same size thresholds as companies for audit exemption and filing',
      small: 'Same as small company thresholds — audit exempt if qualifies',
      medium: 'Same as medium company thresholds',
      large: 'Same as large company thresholds'
    },
    reportingFramework: 'FRS 102 (same as companies; adapted for LLP format)',
    filingRequirements: {
      annualAccounts: {
        content: 'Accounts similar to company accounts but with member information instead of directors',
        deadline: '9 months after accounting reference date',
        latePenalties: 'Same as companies'
      },
      confirmationStatement: {
        content: 'LL CS01',
        deadline: '14 days after review period end',
        fee: 13
      },
      memberChanges: 'LL AP01/LL AP02 (appointment), LL TM01 (cessation)',
      designatedMembers: 'Must have at least 2 designated members'
    }
  },

  charity: {
    id: 'charity',
    label: 'Charitable company / CIO',
    legislation: 'Charities Act 2011, Companies Act 2006',
    thresholds: {
      auditRequired: {
        income: { min: 1000000, label: 'Gross income > £1 million' },
        or: 'Gross income > £250,000 AND total assets > £3.26 million'
      },
      independentExamination: {
        income: { range: '£25,000 - £1,000,000' },
        note: 'Below £25,000 gross income — no scrutiny requirement'
      }
    },
    reportingFramework: 'FRS 102 with Charities SORP (FRS 102)',
    filingRequirements: {
      charitiesCommission: {
        annualReturn: 'Required within 10 months of financial year end',
        accounts: 'Trustees Annual Report + Accounts (SOFA, Balance Sheet)',
        thresholdForFilingAccounts: 'Must file if gross income > £25,000',
        auditorsReport: 'File with accounts if audit required'
      },
      companiesHouse: {
        note: 'Charitable companies must file at both Companies House AND Charity Commission',
        deadline: '9 months (CH) and 10 months (CC) after year-end'
      }
    },
    specialRequirements: [
      'Statement of Financial Activities (SOFA) instead of P&L',
      'Fund accounting: restricted, unrestricted, endowment',
      'Trustees Annual Report (enhanced directors report)',
      'Public benefit reporting',
      'Related party transactions with trustees — specific disclosure',
      'Serious incident reporting to Charity Commission'
    ]
  }
};

// ============================================================================
// FILING DEADLINES CALCULATOR
// ============================================================================
export const FILING_DEADLINES = {
  /**
   * Calculate filing deadline from accounting reference date
   * @param {Date|string} accountingReferenceDate - Year-end date
   * @param {string} entityType - 'private' | 'public' | 'llp' | 'charity'
   * @returns {object} Deadline information
   */
  calculateDeadline(accountingReferenceDate, entityType = 'private') {
    const ard = new Date(accountingReferenceDate);
    const months = entityType === 'public' ? 6 : 9;
    const deadline = new Date(ard);
    deadline.setMonth(deadline.getMonth() + months);

    return {
      accountingReferenceDate: ard.toISOString().split('T')[0],
      entityType,
      filingDeadline: deadline.toISOString().split('T')[0],
      monthsAllowed: months,
      charityCommissionDeadline: entityType === 'charity'
        ? (() => { const d = new Date(ard); d.setMonth(d.getMonth() + 10); return d.toISOString().split('T')[0]; })()
        : null
    };
  },

  latePenalties: {
    private: {
      description: 'Late filing penalties for private companies and LLPs',
      penalties: [
        { period: 'Not more than 1 month', amount: 150 },
        { period: 'More than 1 month but not more than 3 months', amount: 375 },
        { period: 'More than 3 months but not more than 6 months', amount: 750 },
        { period: 'More than 6 months', amount: 1500 }
      ],
      doubledForRepeat: true,
      note: 'Penalties DOUBLED if accounts were also late in preceding year'
    },
    public: {
      description: 'Late filing penalties for public companies',
      penalties: [
        { period: 'Not more than 1 month', amount: 750 },
        { period: 'More than 1 month but not more than 3 months', amount: 1500 },
        { period: 'More than 3 months but not more than 6 months', amount: 3000 },
        { period: 'More than 6 months', amount: 7500 }
      ],
      doubledForRepeat: true
    }
  }
};

// ============================================================================
// COMPANIES HOUSE API REFERENCE
// ============================================================================
export const COMPANIES_HOUSE_API = {
  baseUrl: 'https://api.company-information.service.gov.uk',
  authMethod: 'HTTP Basic Authentication (API key as username, no password)',
  rateLimit: '600 requests per 5 minutes',
  documentation: 'https://developer-specs.company-information.service.gov.uk/',

  endpoints: {
    companySearch: {
      method: 'GET',
      path: '/search/companies',
      params: ['q (search term)', 'items_per_page', 'start_index'],
      description: 'Search for companies by name or number'
    },
    companyProfile: {
      method: 'GET',
      path: '/company/{company_number}',
      description: 'Get company profile including registered address, SIC codes, status, type, date of creation',
      responseFields: [
        'company_name', 'company_number', 'company_status', 'type',
        'date_of_creation', 'registered_office_address', 'sic_codes',
        'accounts.next_due', 'accounts.last_accounts.type',
        'confirmation_statement.next_due', 'has_been_liquidated',
        'has_charges', 'has_insolvency_history'
      ]
    },
    filingHistory: {
      method: 'GET',
      path: '/company/{company_number}/filing-history',
      description: 'List of documents filed at Companies House',
      params: ['items_per_page', 'start_index', 'category'],
      categories: ['accounts', 'annual-return', 'confirmation-statement', 'officers', 'charges', 'incorporation', 'resolution']
    },
    officers: {
      method: 'GET',
      path: '/company/{company_number}/officers',
      description: 'Current and resigned officers (directors, secretaries)',
      responseFields: ['name', 'officer_role', 'appointed_on', 'resigned_on', 'nationality', 'occupation', 'date_of_birth']
    },
    pscs: {
      method: 'GET',
      path: '/company/{company_number}/persons-with-significant-control',
      description: 'Persons with significant control (25%+ ownership/voting/control)',
      responseFields: ['name', 'natures_of_control', 'nationality', 'country_of_residence', 'notified_on']
    },
    charges: {
      method: 'GET',
      path: '/company/{company_number}/charges',
      description: 'Mortgage charges and security registered',
      responseFields: ['charge_number', 'status', 'created_on', 'delivered_on', 'classification', 'persons_entitled']
    },
    insolvency: {
      method: 'GET',
      path: '/company/{company_number}/insolvency',
      description: 'Insolvency cases and appointments'
    },
    registeredOffice: {
      method: 'GET',
      path: '/company/{company_number}/registered-office-address',
      description: 'Current registered office address'
    },
    accounts: {
      method: 'GET',
      path: '/company/{company_number}/filing-history?category=accounts',
      description: 'Filed accounts documents (download links available)'
    },
    documentDownload: {
      method: 'GET',
      path: '/document/{document_id}/content',
      description: 'Download a specific filing document (PDF or XHTML)',
      headers: { Accept: 'application/pdf' }
    }
  },

  streamingApi: {
    baseUrl: 'https://stream.companieshouse.gov.uk',
    description: 'Real-time streaming of Companies House data events',
    endpoints: [
      '/companies', '/filings', '/officers', '/charges', '/insolvency-cases', '/persons-with-significant-control'
    ],
    note: 'Requires separate streaming API key'
  },

  xmlGateway: {
    description: 'For filing documents electronically (Software Filing)',
    formTypes: [
      'AA — Annual Accounts',
      'CS01 — Confirmation Statement',
      'AP01-04 — Appointment of director/secretary',
      'TM01-02 — Termination of director/secretary',
      'CH01-04 — Change of director/secretary details',
      'AD01-04 — Change of registered office/SAIL address',
      'SH01 — Return of allotment of shares',
      'PSC01-09 — Persons with significant control',
      'DS01 — Application to strike off'
    ]
  }
};

// ============================================================================
// SIC CODES — MOST COMMON FOR UK AUDIT CLIENTS
// ============================================================================
export const COMMON_SIC_CODES = {
  '01110': 'Growing of cereals and other crops',
  '10710': 'Manufacture of bread; fresh pastry goods and cakes',
  '41100': 'Development of building projects',
  '41201': 'Construction of commercial buildings',
  '41202': 'Construction of domestic buildings',
  '43210': 'Electrical installation',
  '45111': 'Sale of new cars and light motor vehicles',
  '46900': 'Non-specialised wholesale trade',
  '47110': 'Retail sale in non-specialised stores with food/beverages predominating',
  '47910': 'Retail sale via mail order houses or via Internet',
  '55100': 'Hotels and similar accommodation',
  '56101': 'Licensed restaurants',
  '56302': 'Public houses and bars',
  '62011': 'Ready-made interactive leisure and entertainment software development',
  '62012': 'Business and domestic software development',
  '62020': 'Information technology consultancy activities',
  '62090': 'Other information technology service activities',
  '64110': 'Central banking',
  '64191': 'Banks',
  '64209': 'Activities of other holding companies',
  '64301': 'Activities of investment trusts',
  '64999': 'Activities of other financial service companies',
  '65110': 'Life insurance',
  '65120': 'Non-life insurance',
  '66110': 'Administration of financial markets',
  '66190': 'Other activities auxiliary to financial services',
  '68100': 'Buying and selling of own real estate',
  '68201': 'Renting and operating of Housing Association real estate',
  '68202': 'Letting and operating of conference and exhibition centres',
  '68209': 'Other letting and operating of own or leased real estate',
  '68310': 'Real estate agencies',
  '69101': 'Barristers at law',
  '69102': 'Solicitors',
  '69201': 'Accounting and auditing activities',
  '69202': 'Bookkeeping activities',
  '69203': 'Tax consultancy',
  '70100': 'Activities of head offices',
  '70210': 'Public relations and communications activities',
  '70229': 'Management consultancy activities (other than financial management)',
  '71111': 'Architectural activities',
  '71121': 'Engineering design activities for industrial process and production',
  '71129': 'Other engineering activities',
  '72110': 'Research and experimental development on biotechnology',
  '72190': 'Other research and experimental development on natural sciences and engineering',
  '73110': 'Advertising agencies',
  '74100': 'Specialised design activities',
  '74209': 'Other photographic activities',
  '77110': 'Renting and leasing of cars and light motor vehicles',
  '78200': 'Temporary employment agency activities',
  '80100': 'Private security activities',
  '82110': 'Combined office administrative service activities',
  '82990': 'Other business support service activities',
  '84110': 'General public administration activities',
  '85100': 'Pre-primary education',
  '85200': 'Primary education',
  '85310': 'General secondary education',
  '85320': 'Technical and vocational secondary education',
  '85421': 'First-degree level higher education',
  '86101': 'Hospital activities',
  '86210': 'General medical practice activities',
  '86220': 'Specialist medical practice activities',
  '86230': 'Dental practice activities',
  '86900': 'Other human health activities',
  '87100': 'Residential nursing care activities',
  '87900': 'Other residential care activities',
  '88100': 'Social work activities without accommodation for the elderly and disabled',
  '88990': 'Other social work activities without accommodation',
  '90010': 'Performing arts',
  '93110': 'Operation of sports facilities',
  '94110': 'Activities of business and employers membership organisations',
  '94200': 'Activities of trade unions',
  '96020': 'Hairdressing and other beauty treatment',
  '96090': 'Other service activities'
};

// ============================================================================
// COMPANY TYPES
// ============================================================================
export const COMPANY_TYPES = {
  'ltd': { label: 'Private Limited by Shares', description: 'Most common UK company type' },
  'plc': { label: 'Public Limited Company', description: 'Can offer shares to public; min £50,000 share capital' },
  'llp': { label: 'Limited Liability Partnership', description: 'Members have limited liability; transparent for tax' },
  'unlimited': { label: 'Unlimited Company', description: 'No limit on member liability; no requirement to file accounts publicly' },
  'guarantee': { label: 'Company Limited by Guarantee', description: 'Common for charities/not-for-profit; no share capital' },
  'cic': { label: 'Community Interest Company', description: 'Social enterprise; asset lock; regulated by CIC Regulator' },
  'se': { label: 'Societas Europaea', description: 'European public limited company (grandfathered post-Brexit)' },
  'scottish-partnership': { label: 'Scottish Limited Partnership', description: 'Has legal personality in Scotland' },
  'royal-charter': { label: 'Royal Charter Body', description: 'Chartered by sovereign; professional bodies, universities' },
  'industrial-provident': { label: 'Industrial and Provident Society / Co-operative', description: 'Registered with FCA Mutuals Register' },
  'overseas': { label: 'Overseas Company', description: 'Non-UK company with UK establishment (must register under s1046 CA 2006)' },
  'cio': { label: 'Charitable Incorporated Organisation', description: 'Registered with Charity Commission only (not Companies House)' }
};

// ============================================================================
// CONFIRMATION STATEMENT (CS01) REQUIREMENTS
// ============================================================================
export const CONFIRMATION_STATEMENT = {
  description: 'Annual confirmation that company information at Companies House is up to date',
  replacedAnnualReturn: '2016-06-30 (replaced AR01)',
  deadline: '14 days after the end of each review period (12 months from incorporation or last CS)',
  fee: 13,
  informationConfirmed: [
    'Registered office address',
    'Directors and secretaries (if applicable)',
    'Persons with significant control (PSCs)',
    'Statement of capital (for companies with share capital)',
    'SIC code(s)',
    'Trading status of shares (traded or DTR5 issuer)',
    'Shareholder information (exempt private company optional)',
    'Register of members exemption election (if applicable)'
  ],
  penalties: {
    failure: 'Criminal offence — unlimited fine and/or 2 years imprisonment',
    strikeOff: 'Companies House may start strike-off proceedings if CS not filed'
  }
};

// ============================================================================
// PSC (PERSONS WITH SIGNIFICANT CONTROL) REGISTER
// ============================================================================
export const PSC_REQUIREMENTS = {
  description: 'Register of Persons with Significant Control (PSC Register)',
  legislation: 'Part 21A, Companies Act 2006 (inserted by Small Business, Enterprise and Employment Act 2015)',
  significantControl: {
    conditions: [
      'Holds directly or indirectly more than 25% of shares',
      'Holds directly or indirectly more than 25% of voting rights',
      'Holds directly or indirectly the right to appoint or remove majority of board',
      'Has right to exercise or actually exercises significant influence or control',
      'Has right to exercise or actually exercises significant influence or control over a trust or firm that meets any of the above conditions'
    ],
    bands: ['Over 25% up to 50%', 'Over 50% up to 75%', '75% or more'],
    votingRightBands: ['Over 25% up to 50%', 'Over 50% up to 75%', '75% or more']
  },
  filingForms: {
    PSC01: 'Notification of individual person with significant control',
    PSC02: 'Notification of relevant legal entity with significant control',
    PSC04: 'Change of details of individual PSC',
    PSC07: 'Cessation of individual PSC',
    PSC08: 'Notification that company has no PSC',
    PSC09: 'Update of PSC statement'
  },
  penaltiesForNonCompliance: 'Criminal offence — failure to maintain register or file notifications; fine and/or imprisonment'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine entity classification based on financial data
 * @param {number} turnover - Annual turnover in GBP
 * @param {number} totalAssets - Balance sheet total in GBP
 * @param {number} employees - Average number of employees
 * @returns {object} Classification result
 */
export function classifyEntity(turnover, totalAssets, employees) {
  const thresholdsMet = (t, a, e) => {
    let count = 0;
    if (turnover <= t) count++;
    if (totalAssets <= a) count++;
    if (employees <= e) count++;
    return count >= 2;
  };

  if (thresholdsMet(632000, 316000, 10)) {
    return { classification: 'micro', ...ENTITY_CLASSIFICATIONS.micro };
  }
  if (thresholdsMet(10200000, 5100000, 50)) {
    return { classification: 'small', ...ENTITY_CLASSIFICATIONS.small };
  }
  if (thresholdsMet(36000000, 18000000, 250)) {
    return { classification: 'medium', ...ENTITY_CLASSIFICATIONS.medium };
  }
  return { classification: 'large', ...ENTITY_CLASSIFICATIONS.large };
}

/**
 * Check if entity is audit exempt
 * @param {string} classification - 'micro', 'small', 'medium', 'large', 'plc'
 * @param {object} options - Additional factors
 * @returns {object} Exemption result
 */
export function checkAuditExemption(classification, options = {}) {
  const { isPublic = false, isRegulated = false, isCharitable = false, shareholderRequest = false, isGroupMember = false, groupQualifiesAsSmall = true } = options;

  if (isPublic) return { exempt: false, reason: 'Public companies cannot claim audit exemption (s475)' };
  if (isRegulated) return { exempt: false, reason: 'Regulated entities (banking, insurance, FSMA) excluded from exemption (s478)' };
  if (shareholderRequest) return { exempt: false, reason: 'Shareholders holding 10%+ have requested audit (s476)' };
  if (isGroupMember && !groupQualifiesAsSmall) return { exempt: false, reason: 'Member of group that does not qualify as small (s479)' };

  if (classification === 'micro' || classification === 'small') {
    return {
      exempt: true,
      reason: `${classification} company qualifies for audit exemption under s477 CA 2006`,
      conditions: 'Must include s475 statement on balance sheet confirming exemption relied upon'
    };
  }

  if (isCharitable && classification === 'small') {
    return {
      exempt: true,
      reason: 'Small charitable company — independent examination may suffice if income ≤ £1m',
      alternativeScrutiny: 'Independent examination under Charities Act 2011 s145'
    };
  }

  return { exempt: false, reason: `${classification} companies must have a statutory audit` };
}

/**
 * Look up SIC code description
 */
export function lookupSICCode(code) {
  return COMMON_SIC_CODES[code] || null;
}
