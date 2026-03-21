/**
 * COMPLIANCE & COMPLAINT REPORTING ENCYCLOPEDIA
 * Covers all UK regulatory reporting obligations relevant to audit
 * Last updated: March 2026
 *
 * Includes: FRC complaints, HMRC reporting, SAR/AML, whistleblowing,
 * regulatory bodies, professional misconduct, audit quality reviews
 */

// ============================================================================
// FRC (FINANCIAL REPORTING COUNCIL) COMPLAINTS & ENFORCEMENT
// ============================================================================
export const FRC_COMPLAINTS = {
  id: 'FRC_COMPLAINTS',
  title: 'FRC Complaints, Conduct, and Enforcement',
  regulator: 'Financial Reporting Council (FRC)',
  description: 'The FRC oversees audit quality and can investigate and sanction auditors and audit firms in the UK',

  complaintProcess: {
    whoCanComplain: [
      'Members of the public',
      'Shareholders and investors',
      'Other regulatory bodies',
      'Company directors',
      'Professional accountancy bodies',
      'Whistleblowers',
      'FRC own-initiative (monitoring and inspection findings)'
    ],
    howToComplain: {
      online: 'https://www.frc.org.uk/library/supervision/complaints/',
      email: 'complaints@frc.org.uk',
      post: 'Financial Reporting Council, 8th Floor, 125 London Wall, London EC2Y 5AS',
      anonymousComplaints: 'Accepted but may limit investigation scope'
    },
    stages: [
      {
        stage: 1,
        name: 'Initial Assessment',
        description: 'FRC assesses whether complaint falls within jurisdiction and merits investigation',
        timeframe: '28 days for initial acknowledgement',
        outcomes: ['Proceed to investigation', 'Refer to another body', 'No further action']
      },
      {
        stage: 2,
        name: 'Investigation',
        description: 'Formal investigation by FRC Conduct Committee',
        powers: ['Require production of documents', 'Require explanations', 'Obtain information from third parties'],
        timeframe: 'Typically 12-24 months'
      },
      {
        stage: 3,
        name: 'Enforcement',
        description: 'Formal proceedings before FRC Tribunal',
        sanctions: [
          'Financial penalty (up to £10 million or unlimited for serious cases)',
          'Reprimand or severe reprimand',
          'Conditions on practice',
          'Suspension or exclusion from professional body',
          'Requirement to take remedial action',
          'Declaration that audit report is unsatisfactory'
        ]
      }
    ]
  },

  auditEnforcementProcedure: {
    title: 'Audit Enforcement Procedure (AEP)',
    applicableTo: 'Statutory auditors and audit firms',
    triggers: [
      'Findings from FRC Audit Quality Review (AQR) inspections',
      'Complaints from stakeholders',
      'Own-initiative investigation following corporate failure',
      'Referrals from other regulators'
    ],
    standard: 'Breach of "Relevant Requirements" — ISAs, Ethical Standards, ISQM, Companies Act provisions relating to audit',
    outcomes: [
      'No further action',
      'Non-financial sanction (reprimand, conditions)',
      'Financial sanction (fine)',
      'Referral to Tribunal for serious matters'
    ]
  },

  corporateReportingReview: {
    title: 'FRC Corporate Reporting Review (CRR)',
    description: 'Reviews annual reports and accounts of public interest entities to check compliance with reporting requirements',
    scope: [
      'Premium and Standard listed companies on London Stock Exchange',
      'AIM companies with market cap > £100m',
      'Large private companies (by selection)',
      'UK-adopted IFRS compliance',
      'Companies Act 2006 requirements',
      'Strategic report and directors report content'
    ],
    outcomes: [
      'No action required',
      'Letter requesting clarification',
      'Undertaking to improve future reporting',
      'Public announcement of review findings (rare, serious cases)',
      'Application to court for revision of defective accounts (s456 CA 2006)'
    ],
    defectiveAccountsApplication: {
      legislation: 's455-458 Companies Act 2006',
      description: 'FRC (or Secretary of State) can apply to court to declare accounts defective and require revision',
      voluntaryRevision: 's454 — directors may voluntarily revise defective accounts'
    }
  },

  auditQualityReview: {
    title: 'FRC Audit Quality Review (AQR)',
    description: 'Annual inspection of audit firms performing PIE audits',
    inspectionCycle: {
      majorFirms: 'Annual — Big 4 and other major firms',
      otherPIEFirms: 'Cyclical — typically every 3 years',
      scope: 'Individual audit engagements selected for review'
    },
    gradingSystem: [
      { grade: 'Good', description: 'No improvements necessary or only limited improvements needed' },
      { grade: 'Limited improvements required', description: 'Some areas for improvement identified but overall acceptable' },
      { grade: 'Improvements required', description: 'Significant areas for improvement that require action' },
      { grade: 'Significant improvements required', description: 'Fundamental concerns about audit quality — may trigger enforcement' }
    ],
    consequencesOfPoorGrades: [
      'Mandatory root cause analysis by firm',
      'Action plan required',
      'Follow-up inspection',
      'Potential referral to Enforcement Committee',
      'Publication of inspection results (firm-level)',
      'Potential restriction on PIE audit registrations'
    ]
  }
};

// ============================================================================
// ANTI-MONEY LAUNDERING (AML) REPORTING
// ============================================================================
export const AML_REPORTING = {
  id: 'AML_REPORTING',
  title: 'Anti-Money Laundering Obligations for Auditors',
  legislation: [
    'Proceeds of Crime Act 2002 (POCA)',
    'Terrorism Act 2000',
    'Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (MLR 2017)',
    'Money Laundering Regulations 2019 (amendments)',
    'Sanctions and Anti-Money Laundering Act 2018'
  ],

  suspiciousActivityReport: {
    id: 'SAR',
    title: 'Suspicious Activity Report (SAR)',
    reportTo: 'National Crime Agency (NCA) — UK Financial Intelligence Unit',
    howToReport: {
      online: 'SAR Online portal (https://www.ukciu.gov.uk)',
      method: 'SAR Online is the mandatory reporting method',
      mlro: 'Report first to firm MLRO (Money Laundering Reporting Officer) who decides whether to file SAR with NCA'
    },
    whenToReport: [
      'Knowledge or suspicion that person is engaged in money laundering',
      'Knowledge or suspicion that person is engaged in terrorist financing',
      'Knowledge or reasonable grounds for knowing/suspecting criminal property involvement',
      'Information comes to you in the course of business in the regulated sector'
    ],
    tippingOff: {
      offence: 's333A POCA / s21D Terrorism Act 2000',
      description: 'Criminal offence to disclose to ANY person that a SAR has been made or that a criminal investigation is being/contemplated',
      penalties: 'Up to 5 years imprisonment and/or unlimited fine',
      exceptions: [
        'Disclosure to another person in same undertaking (e.g., fellow partners)',
        'Disclosure to professional legal adviser for purpose of obtaining legal advice',
        'Disclosure between institutions for joint investigation'
      ]
    },
    consentSAR: {
      description: 'Defence Disclosure Against Money Laundering (DAML) — request consent from NCA to proceed with transaction',
      process: 'File SAR seeking consent → NCA has 7 working days to respond → If no response, 31 days moratorium → After moratorium, can proceed',
      note: 'Required when you know or suspect property is criminal but need to continue acting'
    },
    failureToReport: {
      offence: 's330 POCA — failure to disclose (regulated sector)',
      penalties: 'Up to 5 years imprisonment and/or unlimited fine',
      defence: 'Reasonable excuse for not making disclosure, or did not have training as required by employer'
    }
  },

  clientDueDiligence: {
    title: 'Customer Due Diligence (CDD)',
    regulation: 'MLR 2017, Regulations 27-38',
    requirements: {
      standard: [
        'Identify the client and verify identity using reliable independent sources',
        'Identify beneficial owner(s) and take reasonable measures to verify identity',
        'Assess and obtain information on purpose and intended nature of business relationship',
        'Conduct ongoing monitoring (transactions consistent with knowledge of client)'
      ],
      enhanced: {
        triggers: ['High-risk country', 'PEP (politically exposed person)', 'Complex/unusual transaction', 'Non face-to-face', 'High risk assessed by firm'],
        additionalMeasures: [
          'Obtain additional information on source of funds and source of wealth',
          'Enhanced ongoing monitoring',
          'Senior management approval for relationship',
          'First payment through account in client name at UK/EU bank'
        ]
      },
      simplified: {
        triggers: ['Listed company on regulated market', 'UK public authority', 'Low risk assessed by firm'],
        note: 'Firm must document risk assessment justifying simplified CDD'
      }
    },
    recordRetention: '5 years from end of business relationship or date of occasional transaction',
    penalties: {
      civil: 'Up to £1 million fine from professional body / OPBAS',
      criminal: 'Unlimited fine and/or 2 years imprisonment (for officers of firm)'
    }
  },

  firmObligations: {
    title: 'Firm-level AML Obligations',
    requirements: [
      'Appoint a nominated officer (MLRO) — Regulation 21(3)',
      'Establish policies, controls, and procedures — Regulation 19',
      'Risk assessment: identify and assess money laundering and terrorist financing risks — Regulation 18',
      'Staff training: all relevant employees must receive AML training — Regulation 24',
      'Record keeping: maintain records of CDD and transactions — Regulation 40',
      'Independent audit of AML systems: regular review by independent person — Regulation 21(1)(c)',
      'Registration with professional body supervisor (ICAEW, ACCA, ICAS etc.) or HMRC'
    ],
    supervision: {
      professionalBodies: ['ICAEW', 'ACCA', 'ICAS', 'ICAI', 'CIOT', 'AAT'],
      oversight: 'Office for Professional Body Anti-Money Laundering Supervision (OPBAS) — part of FCA',
      hmrcSupervision: 'For firms not supervised by professional body'
    }
  }
};

// ============================================================================
// WHISTLEBLOWING FRAMEWORK
// ============================================================================
export const WHISTLEBLOWING = {
  id: 'WHISTLEBLOWING',
  title: 'Whistleblowing Protection and Reporting',

  publicInterestDisclosure: {
    legislation: 'Public Interest Disclosure Act 1998 (PIDA) — amends Employment Rights Act 1996',
    protectedDisclosures: [
      'Criminal offence committed, being committed, or likely to be committed',
      'Failure to comply with legal obligation',
      'Miscarriage of justice',
      'Danger to health and safety of any individual',
      'Damage to the environment',
      'Deliberate concealment of any of the above'
    ],
    protectedPersons: 'Workers, employees, agency workers, contractors, trainees, NHS practitioners, police officers',
    protections: [
      'Protection from dismissal (automatically unfair)',
      'Protection from detriment (loss of pay, demotion, harassment)',
      'No qualifying period of employment needed',
      'No cap on compensation',
      'Interim relief available'
    ],
    disclosureTo: {
      employer: { requirement: 'Good faith', description: 'Disclosure to employer or person responsible for matter' },
      legalAdviser: { requirement: 'In course of obtaining legal advice', description: 'Always protected' },
      prescribedPerson: {
        requirement: 'Reasonable belief matter falls within prescribed persons competence',
        examples: [
          'FRC — matters relating to accounts, audit, corporate governance',
          'HMRC — matters relating to tax, NI, customs, excise',
          'FCA — matters relating to financial services',
          'Health and Safety Executive — matters relating to H&S',
          'Charity Commission — matters relating to charities',
          'Environment Agency — matters relating to environment',
          'Information Commissioner — matters relating to data protection',
          'National Audit Office — matters relating to proper conduct of public business'
        ]
      },
      widerDisclosure: {
        requirement: 'Reasonable belief, not for personal gain, reasonable in all circumstances',
        additionalConditions: 'Reasonably believed employer would subject to detriment OR evidence would be concealed/destroyed OR previously disclosed to employer/prescribed person'
      }
    }
  },

  auditorWhistleblowing: {
    title: 'Auditor-specific Whistleblowing Obligations',
    obligations: [
      {
        legislation: 'Companies Act 2006, s498',
        duty: 'Report in audit report on: proper books of account, FS agree with books, received all information/explanations',
        consequence: 'Qualified opinion if not satisfied'
      },
      {
        legislation: 'Financial Services and Markets Act 2000',
        duty: 'Report to FCA/PRA if regulated entity — duty of auditor to report matters of material significance',
        note: 'No permission from client needed; protected from breach of confidence'
      },
      {
        legislation: 'Proceeds of Crime Act 2002',
        duty: 'Report suspicious activities to NCA (SAR)',
        note: 'Legal obligation — failure is criminal offence'
      },
      {
        legislation: 'Terrorism Act 2000',
        duty: 'Report knowledge or suspicion of terrorist property/financing',
        note: 'Legal obligation — failure is criminal offence'
      },
      {
        legislation: 'Companies Act 2006, s519-525',
        duty: 'Auditor ceasing to hold office: statement of circumstances connected with ceasing to hold office',
        note: 'Must deposit statement at company registered office and notify relevant audit authority'
      },
      {
        legislation: 'FRC Ethical Standard (Revised 2019), s1.60-1.69',
        duty: 'Report to appropriate authority if entity engages in illegal acts',
        note: 'Auditor must consider public interest duty'
      }
    ]
  }
};

// ============================================================================
// HMRC REPORTING OBLIGATIONS
// ============================================================================
export const HMRC_REPORTING = {
  id: 'HMRC_REPORTING',
  title: 'HMRC Reporting and Tax Compliance',

  corporationTax: {
    title: 'Corporation Tax Reporting',
    filingRequirements: {
      ct600: {
        form: 'CT600 — Corporation Tax Return',
        deadline: '12 months after end of accounting period',
        paymentDeadline: '9 months and 1 day after end of accounting period (for companies not paying in instalments)',
        largeCompanyInstalments: 'Quarterly payments starting month 7 of accounting period (for profits > £1.5m)',
        veryLargeInstalments: 'Quarterly payments starting month 3 of accounting period (for profits > £20m)',
        iXBRL: 'Accounts must be filed in iXBRL format (inline XBRL) with CT600',
        computations: 'Tax computations must also be filed in iXBRL format'
      },
      penalties: {
        lateFilingCT600: [
          { period: '1 day late', amount: '£100 fixed penalty' },
          { period: '3 months late', amount: '£100 additional fixed penalty' },
          { period: '6 months late', amount: 'HMRC estimate of tax due (minimum 10% of unpaid tax)' },
          { period: '12 months late', amount: 'Additional 10% of unpaid tax' }
        ],
        latePayment: 'Interest from due date + surcharge (5% at 30 days, 5% at 6 months, 5% at 12 months)'
      }
    }
  },

  vatReporting: {
    title: 'VAT Reporting',
    makingTaxDigital: {
      description: 'All VAT-registered businesses must use MTD-compatible software',
      requirements: [
        'Keep digital records of VAT transactions',
        'Submit VAT returns via MTD-compatible software (not HMRC online portal)',
        'Digital links between software systems (no manual data transfer)',
        'Quarterly VAT returns within 1 month + 7 days of quarter end'
      ],
      penalties: {
        lateSubmission: 'Points-based system — 1 point per late submission; financial penalty at threshold (2 for annual, 4 for quarterly)',
        latePayment: 'Percentage penalty: 2% at 15 days, +2% at 30 days, then 4% per annum daily'
      }
    }
  },

  payeReporting: {
    title: 'PAYE/RTI Reporting',
    rti: {
      description: 'Real Time Information — employers report PAYE information to HMRC on or before each payment',
      submissions: [
        'FPS (Full Payment Submission) — each payment run',
        'EPS (Employer Payment Summary) — monthly if nil payments or corrections',
        'P11D / P11D(b) — benefits in kind (due 6 July after tax year end)',
        'P60 — annual summary to employees (due 31 May after tax year end)'
      ]
    }
  },

  taxEvasionReporting: {
    title: 'Criminal Finances Act 2017 — Failure to Prevent Tax Evasion',
    description: 'Corporate criminal offence if associated person criminally facilitates tax evasion',
    relevanceToAudit: 'Auditor should consider whether entity has reasonable prevention procedures',
    requirements: [
      'Risk assessment of tax evasion facilitation risks',
      'Proportionate prevention procedures (due diligence, communication, monitoring)',
      'Top-level commitment',
      'Training for relevant employees'
    ]
  },

  DAC6_MDR: {
    title: 'Mandatory Disclosure Rules (MDR) — formerly DAC6',
    description: 'Obligation to report certain cross-border tax arrangements to HMRC',
    deadline: '30 days from arrangement being made available, ready for implementation, or first step implemented',
    hallmarks: [
      'Confidentiality arrangements',
      'Premium fee arrangements',
      'Standardised documentation/structures',
      'Loss buying / converting income',
      'Circular transactions',
      'Transfer pricing arrangements',
      'Arrangements undermining CRS reporting'
    ],
    penalties: {
      initialPenalty: 'Up to £600 per day of non-compliance',
      continuingPenalty: 'Up to £600 per day after initial penalty',
      deliberateConcealment: 'Higher penalties including potential criminal prosecution'
    }
  }
};

// ============================================================================
// PROFESSIONAL BODY COMPLAINTS (ICAEW, ACCA, ICAS)
// ============================================================================
export const PROFESSIONAL_BODY_COMPLAINTS = {
  id: 'PROFESSIONAL_BODY_COMPLAINTS',
  title: 'Complaints to Professional Accountancy Bodies',

  ICAEW: {
    title: 'Institute of Chartered Accountants in England and Wales',
    complaintProcess: {
      howToComplain: 'Online complaint form at icaew.com/complaints',
      initialAssessment: 'Professional Conduct Department reviews complaint within 14 working days',
      investigation: 'Formal investigation if warranting further action',
      disciplinary: 'Disciplinary Committee hearing — public hearings for serious cases',
      appeal: 'Appeal Committee — within 21 days of decision'
    },
    sanctions: [
      'Admonishment',
      'Reprimand',
      'Severe reprimand',
      'Fine (up to £100,000 for individual, £500,000 for firm)',
      'Conditions on practice',
      'Suspension from membership',
      'Exclusion from membership',
      'Withdrawal of practising certificate or audit registration'
    ],
    regulatoryRole: 'Recognised Supervisory Body (RSB) and Recognised Qualifying Body (RQB) for statutory audit under Companies Act 2006'
  },

  ACCA: {
    title: 'Association of Chartered Certified Accountants',
    complaintProcess: {
      howToComplain: 'Online form at accaglobal.com/complaints',
      initialAssessment: 'Assessor reviews within 21 days',
      investigation: 'Investigation if complaint discloses misconduct',
      disciplinary: 'Disciplinary Committee or Consent Order',
      appeal: 'Appeal Committee'
    },
    sanctions: [
      'Admonishment',
      'Reprimand',
      'Severe reprimand',
      'Fine (up to £50,000)',
      'Conditions on membership',
      'Suspension',
      'Exclusion from membership'
    ],
    regulatoryRole: 'RSB and RQB for statutory audit'
  },

  ICAS: {
    title: 'Institute of Chartered Accountants of Scotland',
    complaintProcess: {
      howToComplain: 'complaints@icas.com',
      process: 'Similar stages to ICAEW — assessment, investigation, disciplinary tribunal',
      timeframe: 'Initial response within 14 days'
    },
    sanctions: 'Similar to ICAEW — fines, conditions, suspension, exclusion',
    regulatoryRole: 'RSB and RQB for statutory audit'
  },

  commonGrounds: [
    'Professional incompetence',
    'Breach of fundamental principles (integrity, objectivity, competence, confidentiality, professional behaviour)',
    'Breach of ethical standards',
    'Non-compliance with technical standards (ISAs, FRS)',
    'Conviction of criminal offence',
    'Dishonesty or fraud',
    'Failure to comply with AML obligations',
    'Failure to maintain CPD requirements'
  ]
};

// ============================================================================
// OTHER REGULATORY REPORTING
// ============================================================================
export const OTHER_REGULATORY_REPORTING = {
  FCA_PRA: {
    title: 'FCA / PRA Reporting (Regulated Entities)',
    description: 'Auditors of FCA/PRA regulated entities have additional duties',
    auditorDuties: [
      'Report matters of material significance to FCA/PRA (SUP 3.8)',
      'Provide client assets (CASS) report (if applicable)',
      'Long-form audit report on internal controls (if required by regulator)',
      'Report immediately on matters threatening solvency or going concern'
    ],
    reportableMatters: [
      'Financial statements not giving true and fair view',
      'Material uncertainty regarding going concern',
      'Loss of qualifying audit partner',
      'Circumstances connected with auditor ceasing to hold office',
      'Material weaknesses in internal controls',
      'Significant non-compliance with FCA/PRA rules',
      'Evidence of fraud or financial crime'
    ]
  },

  charityCommission: {
    title: 'Charity Commission Reporting',
    description: 'Reporting obligations for auditors and independent examiners of charities',
    seriousIncidentReporting: {
      who: 'Charity trustees must report; auditors should consider whether trustees have reported',
      whatToReport: [
        'Fraud or theft of charity funds',
        'Significant financial loss',
        'Terrorism/extremism-related incidents',
        'Serious harm to beneficiaries',
        'Data breaches involving charity data',
        'Regulatory actions by other bodies',
        'Insolvency or significant going concern'
      ],
      deadline: 'As soon as reasonably possible after becoming aware',
      howToReport: 'Online via Charity Commission website or by email'
    },
    auditorReporting: {
      qualifiedReport: 'Must send copy of qualified audit report to Charity Commission',
      mattersOfMaterialSignificance: 'Must report matters of material significance relating to charity — Charities Act 2011, s169-169A'
    }
  },

  insolvencyPractitioner: {
    title: 'Insolvency-related Reporting',
    auditRelevance: [
      'Going concern assessment may indicate insolvency risk',
      'Directors duties when company near insolvency: duty to consider creditor interests (s172(3) CA 2006)',
      'Wrongful trading: directors may be personally liable if continued to trade knowing no reasonable prospect of avoiding insolvent liquidation (s214 Insolvency Act 1986)',
      'Fraudulent trading: criminal offence if intent to defraud (s213 IA 1986)',
      'Misfeasance: proceedings against directors for breach of fiduciary duty (s212 IA 1986)',
      'Directors disqualification: grounds under Company Directors Disqualification Act 1986'
    ],
    auditorActions: [
      'Assess going concern appropriately (ISA 570)',
      'Consider whether directors are meeting their duties',
      'Report in audit report if material uncertainty regarding going concern',
      'Consider SAR filing if evidence of wrongful/fraudulent trading'
    ]
  },

  dataProtection: {
    title: 'Data Protection (UK GDPR / Data Protection Act 2018)',
    relevanceToAudit: [
      'Audit working papers contain personal data — must comply with UK GDPR',
      'Consider entity compliance with data protection as part of laws and regulations (ISA 250)',
      'Data breach notification: entity must notify ICO within 72 hours if personal data breach',
      'SAR requests: individuals can request access to personal data held about them'
    ],
    penalties: {
      standard: 'Up to £8.7 million or 2% of worldwide turnover (whichever higher)',
      serious: 'Up to £17.5 million or 4% of worldwide turnover (whichever higher)'
    }
  },

  modernSlavery: {
    title: 'Modern Slavery Act 2015',
    requirement: 'Commercial organisations with turnover ≥ £36 million must publish annual modern slavery statement',
    content: [
      'Organisation structure, business, and supply chains',
      'Policies in relation to slavery and human trafficking',
      'Due diligence processes',
      'Risk assessment and management',
      'Effectiveness measurement (KPIs)',
      'Training availability'
    ],
    auditRelevance: 'Consider as part of ISA 250 — laws and regulations; part of annual report review under ISA 720'
  },

  SECR: {
    title: 'Streamlined Energy and Carbon Reporting (SECR)',
    legislation: `Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2013 (as amended 2018)`,
    applicableTo: [
      'Quoted companies',
      'Large unquoted companies (meeting 2 of 3: turnover >£36m, balance sheet >£18m, >250 employees)',
      'Large LLPs'
    ],
    reportingRequirements: [
      'UK energy use (electricity, gas, transport)',
      'Associated greenhouse gas emissions (tCO2e)',
      'At least one intensity ratio',
      'Energy efficiency narrative',
      'Methodology description',
      'Previous year comparative'
    ],
    auditRelevance: 'Review as part of directors report/strategic report (ISA 720); not subject to audit opinion but consistency check required'
  }
};

// ============================================================================
// REGULATORY BODY CONTACT DIRECTORY
// ============================================================================
export const REGULATORY_CONTACTS = {
  FRC: {
    name: 'Financial Reporting Council',
    address: '8th Floor, 125 London Wall, London EC2Y 5AS',
    website: 'https://www.frc.org.uk',
    complaints: 'complaints@frc.org.uk',
    phone: '+44 20 7492 2300'
  },
  NCA: {
    name: 'National Crime Agency (SARs)',
    sarOnline: 'https://www.ukciu.gov.uk',
    phone: '0370 496 7622',
    note: 'SARs must be submitted via SAR Online portal'
  },
  HMRC: {
    name: 'HM Revenue & Customs',
    corporationTax: '0300 200 3410',
    vat: '0300 200 3700',
    employerHelpline: '0300 200 3200',
    website: 'https://www.gov.uk/government/organisations/hm-revenue-customs'
  },
  CompaniesHouse: {
    name: 'Companies House',
    address: 'Crown Way, Cardiff CF14 3UZ',
    contactCentre: '0303 1234 500',
    website: 'https://www.gov.uk/government/organisations/companies-house',
    webFiling: 'https://www.gov.uk/file-your-company-accounts-and-tax-return',
    api: 'https://developer-specs.company-information.service.gov.uk/'
  },
  FCA: {
    name: 'Financial Conduct Authority',
    address: '12 Endeavour Square, London E20 1JN',
    phone: '0800 111 6768',
    website: 'https://www.fca.org.uk',
    whistleblowing: 'whistleblowing@fca.org.uk'
  },
  PRA: {
    name: 'Prudential Regulation Authority',
    address: '20 Moorgate, London EC2R 6DA',
    phone: '020 3461 4878',
    website: 'https://www.bankofengland.co.uk/prudential-regulation'
  },
  CharityCommission: {
    name: 'Charity Commission for England and Wales',
    address: 'PO Box 211, Bootle L20 7YX',
    phone: '0300 066 9197',
    website: 'https://www.gov.uk/government/organisations/charity-commission',
    seriousIncidents: 'https://www.gov.uk/guidance/how-to-report-a-serious-incident-in-your-charity'
  },
  ICO: {
    name: 'Information Commissioner\'s Office',
    address: 'Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF',
    phone: '0303 123 1113',
    website: 'https://ico.org.uk',
    breachReporting: 'https://ico.org.uk/for-organisations/report-a-breach/'
  },
  ICAEW: {
    name: 'Institute of Chartered Accountants in England and Wales',
    address: 'Chartered Accountants\' Hall, 1 Moorgate Place, London EC2R 6EA',
    phone: '020 7920 8100',
    website: 'https://www.icaew.com',
    complaints: 'https://www.icaew.com/about-icaew/complaints'
  },
  ACCA: {
    name: 'Association of Chartered Certified Accountants',
    address: 'The Adelphi, 1-11 John Adam Street, London WC2N 6AU',
    phone: '+44 141 582 2000',
    website: 'https://www.accaglobal.com',
    complaints: 'https://www.accaglobal.com/gb/en/footertoolbar/contact-us/make-a-complaint.html'
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all reporting obligations applicable to an entity
 * @param {object} entityProfile - { isRegulated, isCharity, isPIE, isListed, turnover, employees }
 * @returns {Array} List of applicable reporting obligations
 */
export function getApplicableReportingObligations(entityProfile) {
  const obligations = [
    { name: 'Companies House filing', always: true },
    { name: 'Corporation Tax (CT600)', always: true },
    { name: 'Confirmation Statement (CS01)', always: true },
    { name: 'AML/CDD obligations', always: true, note: 'On auditor — not entity' }
  ];

  if (entityProfile.isRegulated) {
    obligations.push({ name: 'FCA/PRA regulatory reporting', category: 'regulatory' });
    obligations.push({ name: 'CASS client assets report', category: 'regulatory', conditional: 'If holds client money/assets' });
  }

  if (entityProfile.isCharity) {
    obligations.push({ name: 'Charity Commission annual return', category: 'charity' });
    obligations.push({ name: 'Serious incident reporting', category: 'charity' });
  }

  if (entityProfile.isPIE || entityProfile.isListed) {
    obligations.push({ name: 'Half-yearly financial report (DTR 4.2)', category: 'listed' });
    obligations.push({ name: 'Inside information disclosure (MAR)', category: 'listed' });
    obligations.push({ name: 'Directors remuneration report', category: 'listed' });
    obligations.push({ name: 'Corporate governance statement', category: 'listed' });
    obligations.push({ name: 'Audit committee report', category: 'listed' });
    obligations.push({ name: 'KAM reporting in audit report', category: 'audit' });
  }

  if (entityProfile.turnover >= 36000000) {
    obligations.push({ name: 'Modern Slavery statement', category: 'compliance' });
  }

  if (entityProfile.employees >= 250) {
    obligations.push({ name: 'Gender Pay Gap reporting', category: 'compliance' });
  }

  // SECR
  if (entityProfile.isListed ||
    (entityProfile.turnover > 36000000 || entityProfile.employees > 250)) {
    obligations.push({ name: 'SECR energy and carbon reporting', category: 'environmental' });
  }

  obligations.push({ name: 'Payment Practices reporting', category: 'compliance', conditional: 'If qualifying large company/LLP' });

  return obligations;
}

/**
 * Determine which regulators an auditor must consider reporting to
 * @param {object} context - { nonComplianceFound, fraudSuspected, goingConcernRisk, isRegulated, isCharity }
 * @returns {Array} List of potential reporting obligations
 */
export function getAuditorReportingObligations(context) {
  const obligations = [];

  if (context.fraudSuspected) {
    obligations.push({
      body: 'NCA',
      obligation: 'SAR — Suspicious Activity Report',
      legislation: 'Proceeds of Crime Act 2002, s330',
      mandatory: true,
      tippingOff: true,
      urgency: 'IMMEDIATE — via firm MLRO'
    });
  }

  if (context.isRegulated && (context.nonComplianceFound || context.goingConcernRisk)) {
    obligations.push({
      body: 'FCA/PRA',
      obligation: 'Report matters of material significance',
      legislation: 'FSMA 2000, SUP 3.8',
      mandatory: true
    });
  }

  if (context.isCharity && context.nonComplianceFound) {
    obligations.push({
      body: 'Charity Commission',
      obligation: 'Report matters of material significance',
      legislation: 'Charities Act 2011, s169',
      mandatory: true
    });
  }

  obligations.push({
    body: 'Those Charged with Governance',
    obligation: 'Communicate significant findings',
    legislation: 'ISA 260',
    mandatory: true
  });

  return obligations;
}
