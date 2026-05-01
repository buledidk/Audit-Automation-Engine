// =============================================================================
// RegulatoryData.js
// Comprehensive UK Regulatory Body Data for Audit Engine Application
// =============================================================================

// =============================================================================
// 1. PROFESSIONAL BODIES
// =============================================================================

export const PROFESSIONAL_BODIES = {
  icaew: {
    fullName: "Institute of Chartered Accountants in England and Wales",
    abbreviation: "ICAEW",
    founded: 1880,
    royalCharter: true,
    membershipNumbers: "Approximately 200,000 members and students worldwide",
    recognisedSupervisoryBody: true,
    recognisedQualifyingBody: true,
    practisingCertReqs: [
      "Hold ACA or FCA qualification from ICAEW",
      "Obtain a practising certificate from ICAEW",
      "Demonstrate relevant practical experience in public practice",
      "Maintain professional indemnity insurance at adequate levels",
      "Comply with ICAEW regulations for practising members",
      "Submit annual return confirming compliance with regulatory requirements",
      "Hold an audit qualification if conducting statutory audit work",
      "Complete fit and proper person assessment",
      "Provide evidence of continuity of professional education",
      "Maintain adequate arrangements for professional work including staff supervision"
    ],
    auditQualification: {
      requirements: [
        "Pass all ACA professional examinations including Advanced Level",
        "Complete minimum 3 years of supervised practical training",
        "Obtain at least 2 years of audit experience under a registered auditor",
        "Demonstrate competence in audit methodology and procedures",
        "Pass the audit and assurance examination components",
        "Complete authorised training office requirements"
      ],
      auditExemptions: "No exemptions from audit qualification requirements for statutory audit work",
      internationalRecognition: "Mutual recognition agreements with various international bodies"
    },
    amlSupervisionRole: "ICAEW acts as an AML supervisor under the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017. It supervises members and firms for AML compliance, conducts risk-based supervisory visits, issues guidance on AML obligations, and reports suspicious activity trends to HM Treasury and the Office for Professional Body Anti-Money Laundering Supervision (OPBAS).",
    amlObligations: {
      firmRegistration: "All firms providing services within the regulated sector must register with ICAEW for AML supervision",
      riskAssessment: "Firms must conduct and document a practice-wide risk assessment",
      customerDueDiligence: "Standard CDD, Enhanced CDD for high-risk situations, Simplified CDD where appropriate",
      suspiciousActivityReporting: "Report to NCA via SAR regime; firms must have nominated officer",
      recordKeeping: "Maintain CDD records for 5 years after relationship ends",
      staffTraining: "Regular AML training for all relevant staff",
      policiesAndProcedures: "Written AML policies, controls, and procedures required",
      independentAudit: "Regular independent review of AML systems where appropriate"
    },
    cpdRequirements: {
      structured: "Minimum of 21 hours of structured CPD per year including verifiable learning activities with defined learning outcomes",
      unstructured: "Remaining hours may be unstructured learning relevant to professional development",
      annual: "Minimum 40 hours total CPD per year, with at least 21 hours structured. Members in public practice must include ethics and professional standards content. CPD must be relevant to the member's role and responsibilities.",
      specialistAreas: "Additional CPD may be required for specialist areas such as audit, insolvency, and investment business",
      monitoring: "ICAEW monitors CPD compliance through annual returns and spot checks",
      nonCompliance: "Failure to meet CPD requirements may result in regulatory action including removal from practising certificate"
    },
    practiceAssurance: "ICAEW operates a Practice Assurance scheme requiring all member firms to undergo periodic quality assurance reviews. Reviews assess compliance with professional standards, ethical requirements, client engagement procedures, AML compliance, and quality control systems. Firms are selected for review on a risk-based cycle, typically every 3-6 years depending on the nature and risk profile of the firm's work. Reviews cover engagement files, firm-wide procedures, independence and ethics, and client money handling where applicable.",
    practiceAssuranceProcess: {
      selectionCriteria: "Risk-based selection considering firm size, nature of work, previous review outcomes, and complaints history",
      reviewScope: [
        "Compliance with ISQM (UK) 1 quality management standards",
        "Ethical standards compliance including independence",
        "Engagement performance quality across service lines",
        "AML policies and procedures",
        "Client money handling (where applicable)",
        "CPD compliance of principals and staff",
        "Professional indemnity insurance adequacy",
        "Complaints handling procedures"
      ],
      outcomes: [
        "Satisfactory - no significant issues identified",
        "Generally acceptable - minor improvements needed",
        "Improvement required - significant issues needing attention",
        "Unsatisfactory - major deficiencies requiring immediate action",
        "Referral to Investigation Committee for serious matters"
      ],
      followUp: "Firms receiving adverse outcomes are subject to follow-up visits and may face regulatory sanctions"
    },
    disciplinary: "ICAEW operates a comprehensive disciplinary scheme with investigation and adjudication functions. Complaints are assessed by the Professional Conduct Department, investigated where appropriate, and may be referred to the Investigation Committee. Serious cases proceed to the Disciplinary Tribunal which can impose sanctions including fines, conditions on practising certificates, suspension, and exclusion from membership. Appeals are heard by the Appeal Committee. The process is compliant with principles of natural justice and proportionality.",
    disciplinaryProcess: {
      stages: [
        "Initial assessment of complaint by Professional Conduct Department",
        "Preliminary investigation and evidence gathering",
        "Investigation Committee consideration",
        "Disciplinary Tribunal hearing (if referred)",
        "Appeal Committee (if appeal lodged)"
      ],
      sanctions: [
        "Reprimand",
        "Severe reprimand",
        "Fine (up to unlimited amount for firms)",
        "Conditions on practising certificate",
        "Suspension from membership",
        "Exclusion from membership",
        "Withdrawal of practising certificate",
        "Withdrawal of audit registration"
      ],
      publishedDecisions: "Tribunal decisions are published on ICAEW website for transparency"
    },
    ethicalCode: "ICAEW members are bound by the ICAEW Code of Ethics, which is based on the IESBA International Code of Ethics for Professional Accountants. The code establishes fundamental principles of integrity, objectivity, professional competence and due care, confidentiality, and professional behaviour. It adopts a threats and safeguards approach consistent with FRC Ethical Standard requirements for audit and assurance engagements.",
    fundamentalPrinciples: [
      "Integrity - straightforward and honest in all professional and business relationships",
      "Objectivity - not allowing bias, conflict of interest, or undue influence to override professional judgements",
      "Professional competence and due care - maintaining professional knowledge and skill at required level",
      "Confidentiality - respecting confidentiality of information acquired through professional relationships",
      "Professional behaviour - complying with relevant laws and regulations and avoiding discrediting the profession"
    ],
    qualificationStructure: {
      certificateLevel: {
        modules: ["Accounting", "Assurance", "Business, Technology and Finance", "Law", "Management Information", "Principles of Tax"],
        description: "Foundation level covering core accounting and business knowledge"
      },
      professionalLevel: {
        modules: ["Audit and Assurance", "Business Strategy and Technology", "Financial Accounting and Reporting", "Financial Management", "Tax Compliance", "Business Planning: Taxation"],
        description: "Intermediate level building technical competence"
      },
      advancedLevel: {
        modules: ["Corporate Reporting", "Strategic Business Management", "Case Study"],
        description: "Advanced level demonstrating integrated professional judgement"
      }
    },
    source: "icaew.com",
    lastVerified: "2026-03-12"
  },

  acca: {
    fullName: "Association of Chartered Certified Accountants",
    abbreviation: "ACCA",
    founded: 1904,
    membershipNumbers: "Approximately 241,000 members and 542,000 students in 178 countries",
    recognisedSupervisoryBody: true,
    recognisedQualifyingBody: true,
    qualificationRoutes: [
      "ACCA Qualification (full professional qualification leading to ACCA membership)",
      "Foundations in Accountancy (entry-level qualification suite)",
      "Certified Accounting Technician (CAT) pathway",
      "BSc (Hons) in Applied Accounting through Oxford Brookes University partnership",
      "MSc in Professional Accountancy through University of London partnership",
      "MBA pathway through strategic university alliances",
      "Strategic Professional qualification (advanced diploma stage)",
      "Ethics and Professional Skills module (mandatory for all qualification routes)"
    ],
    qualificationStructure: {
      appliedKnowledge: {
        papers: ["Business and Technology (BT)", "Management Accounting (MA)", "Financial Accounting (FA)"],
        description: "Foundation knowledge of core accounting and business principles"
      },
      appliedSkills: {
        papers: ["Corporate and Business Law (LW)", "Performance Management (PM)", "Taxation (TX)", "Financial Reporting (FR)", "Audit and Assurance (AA)", "Financial Management (FM)"],
        description: "Application of technical knowledge in practical scenarios"
      },
      strategicProfessional: {
        essentials: ["Strategic Business Leader (SBL)", "Strategic Business Reporting (SBR)"],
        options: ["Advanced Financial Management (AFM)", "Advanced Performance Management (APM)", "Advanced Taxation (ATX)", "Advanced Audit and Assurance (AAA)"],
        optionsRequired: 2,
        description: "Strategic and professional level demonstrating high-level competence"
      },
      ethicsModule: "Ethics and Professional Skills module must be completed before membership",
      practicalExperience: "36 months of relevant practical experience with performance objectives"
    },
    practisingCerts: [
      "ACCA Practising Certificate - required for members in public practice offering accountancy services",
      "ACCA Audit Qualification - additional qualification required for statutory audit work",
      "Insolvency Licence - for members undertaking insolvency work",
      "Investment Business Certificate - for members providing investment business services"
    ],
    practisingCertRequirements: {
      general: [
        "Current ACCA membership in good standing",
        "Appropriate practical experience in public practice environment",
        "Professional indemnity insurance at adequate levels",
        "Compliance with ACCA Rulebook including Global Practising Regulations",
        "Completion of annual practising certificate renewal",
        "Satisfactory fitness and propriety assessment"
      ],
      auditSpecific: [
        "ACCA audit qualification obtained through approved route",
        "Minimum practical audit experience under supervision of registered auditor",
        "Registration of the firm as a registered auditor",
        "Compliance with audit regulations and ISQM requirements",
        "Designated audit principals meeting competence requirements"
      ]
    },
    globalVsUK: "ACCA operates globally with a single qualification framework but applies UK-specific regulatory requirements for members practising in the UK. UK-specific provisions include compliance with FRC standards (ISAs (UK), Ethical Standard, ISQM (UK)), recognition as an RSB/RQB under the Companies Act 2006, AML supervision under UK MLR 2017, and adherence to UK-specific tax and company law requirements. The global ACCA Qualification includes UK-variant papers for taxation and law. ACCA's global reach provides UK firms access to international talent and methodology while maintaining full UK regulatory compliance.",
    amlSupervision: {
      role: "ACCA is a designated AML supervisor under the Money Laundering Regulations 2017",
      scope: "Supervises all ACCA members and firms in the UK regulated sector",
      opbasCompliance: "Subject to oversight by OPBAS for effectiveness of AML supervision",
      guidanceIssued: "Publishes sector-specific AML guidance for accountancy service providers"
    },
    cpdRequirements: {
      annualHours: "40 hours per year minimum",
      structured: "21 hours minimum must be verifiable/structured learning",
      unstructured: "Remaining hours through relevant unstructured development activities",
      relevance: "CPD must be relevant to member's current role or career development",
      monitoring: "Annual CPD declaration with random sampling for detailed review",
      rollingRequirement: "Assessed on annual basis with compliance monitored through declarations"
    },
    disciplinary: {
      process: "Complaints assessed by ACCA staff, investigated and referred to committees as appropriate",
      committees: ["Assessment of Complaints", "Health Committee", "Consent Orders Committee", "Disciplinary Committee", "Appeal Committee"],
      sanctions: ["Admonishment", "Reprimand", "Severe reprimand", "Fine", "Conditions", "Suspension", "Removal from register", "Exclusion from membership"],
      transparency: "Findings and sanctions published for public accountability"
    },
    source: "accaglobal.com",
    lastVerified: "2026-03-12"
  },

  icas: {
    fullName: "Institute of Chartered Accountants of Scotland",
    abbreviation: "ICAS",
    founded: 1854,
    historicalNote: "ICAS is the world's oldest professional body of accountants, receiving its Royal Charter in 1854",
    royalCharter: true,
    membershipNumbers: "Approximately 23,000 members worldwide",
    recognisedSupervisoryBody: true,
    recognisedQualifyingBody: true,
    qualification: "The CA qualification from ICAS is a highly respected professional designation. The qualification comprises three levels: Test of Competence (TC), Test of Professional Skills (TPS), and Test of Professional Expertise (TPE). Candidates must complete a minimum three-year training contract with an ICAS Authorised Training Office. The qualification covers financial accounting, audit and assurance, taxation, business management, and ethics. The CA designation from ICAS carries international recognition and reciprocal arrangements with bodies in several jurisdictions.",
    qualificationStructure: {
      testOfCompetence: {
        subjects: ["Accounting", "Assurance, Finance and Business Management", "Business Law", "Taxation", "Principles of Auditing"],
        description: "Foundation technical knowledge assessment"
      },
      testOfProfessionalSkills: {
        subjects: ["Financial Accounting", "Audit and Assurance", "Taxation", "Finance"],
        description: "Application of technical knowledge in professional scenarios"
      },
      testOfProfessionalExpertise: {
        subjects: ["Multi-disciplinary case study integrating all subject areas"],
        description: "Demonstration of professional judgement and integrated competence"
      },
      trainingContract: "Minimum 3 years with an ICAS Authorised Training Office",
      ethicsRequirement: "Ethics content integrated throughout all levels"
    },
    regulatoryRole: "ICAS acts as a Recognised Supervisory Body (RSB) and Recognised Qualifying Body (RQB) under the Companies Act 2006 for statutory audit purposes. ICAS regulates its members in public practice, oversees audit quality through its monitoring programme, acts as an AML supervisor, and operates disciplinary procedures for professional misconduct. ICAS also contributes to UK and international standard-setting through responses to consultations and representation on key committees. ICAS has specific responsibility for the regulation of audit and accountancy in Scotland while operating UK-wide for its members.",
    practiceMonitoring: {
      auditMonitoring: "Regular review of registered auditors on a risk-based cycle",
      practiceAssurance: "Review of general practice compliance with professional standards",
      amlMonitoring: "Assessment of AML policies, procedures, and compliance",
      outcomes: ["Satisfactory", "Improvement required", "Significant improvement required", "Unsatisfactory"]
    },
    cpdRequirements: {
      annual: "Minimum 40 hours CPD per year",
      structured: "At least 21 hours must be structured/verifiable",
      auditSpecific: "Additional requirements for those holding audit qualifications",
      monitoring: "Annual return with compliance monitoring"
    },
    disciplinary: {
      investigationProcess: "Complaints investigated by ICAS Conduct Department",
      tribunal: "Discipline Tribunal hears serious cases",
      sanctions: ["Caution", "Reprimand", "Fine", "Conditions", "Suspension", "Exclusion"],
      appeals: "Appeal Tribunal available for contested decisions"
    },
    source: "icas.com",
    lastVerified: "2026-03-12"
  },

  ciot: {
    fullName: "Chartered Institute of Taxation",
    abbreviation: "CIOT",
    founded: 1930,
    royalCharter: true,
    membershipDesignation: "CTA (Chartered Tax Adviser)",
    membershipNumbers: "Approximately 19,000 members",
    taxRelevanceToAudit: "CIOT is the leading UK professional body for taxation. While not directly involved in audit regulation, tax expertise is critical to audit engagements in several ways: (1) Assessment of tax provisions and deferred tax balances in financial statements, (2) Evaluation of tax compliance and exposure to tax risks, (3) Transfer pricing considerations for multinational groups, (4) R&D tax relief claims verification, (5) Capital allowances computations review, (6) VAT treatment of complex transactions, (7) Share schemes and employment tax matters, (8) Tax authority enquiries and their impact on financial statements, (9) Tax planning arrangements requiring disclosure under DOTAS/MDR, (10) International tax considerations including withholding taxes, DTAs, and BEPS/Pillar Two. Audit teams frequently consult CTA-qualified specialists for complex tax matters affecting financial statement assertions.",
    qualification: {
      cta: {
        description: "Chartered Tax Adviser qualification - gold standard for UK tax professionals",
        examinations: [
          "Awareness papers (Principles of Accounting, Law, Ethics)",
          "Application papers covering direct tax, indirect tax, and advisory",
          "Advisory paper integrating technical knowledge with practical advice"
        ],
        experienceRequirement: "Relevant practical tax experience required",
        ethicsModule: "Professional Responsibilities and Ethics module mandatory"
      }
    },
    specialistAreas: [
      "Corporation tax including international aspects",
      "Personal tax and estate planning",
      "VAT and indirect taxes",
      "Employment taxes",
      "Transfer pricing",
      "Tax disputes and investigations",
      "R&D tax reliefs",
      "Capital allowances"
    ],
    amlRole: "CIOT acts as an AML supervisor for members providing tax advisory services within the regulated sector",
    pcrt: "CIOT (with other professional bodies) has published Professional Conduct in Relation to Taxation (PCRT) guidance setting standards for tax professionals in dealing with HMRC and advising clients on tax matters. Key principles include acting with integrity, not assisting tax evasion, and promoting compliance.",
    source: "tax.org.uk",
    lastVerified: "2026-03-12"
  },

  att: {
    fullName: "Association of Taxation Technicians",
    abbreviation: "ATT",
    founded: 1989,
    membershipDesignation: "ATT (Taxation Technician)",
    membershipNumbers: "Approximately 9,500 members",
    relationshipWithCIOT: "ATT is a sister body of CIOT, providing the tax technician level qualification. Many ATT members progress to CTA qualification.",
    taxRelevanceToAudit: "ATT members provide tax compliance and advisory services relevant to audit engagements. Their expertise is particularly relevant to: (1) Preparation and review of routine tax computations including corporation tax returns (CT600), (2) Self-assessment tax return compliance, (3) VAT return preparation and MTD compliance, (4) PAYE and payroll compliance matters, (5) Capital gains tax computations, (6) Basic capital allowances calculations, (7) Tax compliance for smaller entities subject to audit, (8) Identification of tax compliance issues during audit fieldwork. ATT-qualified staff often support audit teams in verifying tax compliance aspects of financial statements and providing tax computation review services.",
    qualification: {
      papers: [
        "Personal Taxation",
        "Business Taxation",
        "Corporate Taxation",
        "IHT, Trusts and Estates",
        "VAT",
        "Business Compliance"
      ],
      requirementToPass: "Pass 2 mandatory papers (Personal Tax and Business Tax) plus 2 optional papers",
      practicalExperience: "Relevant practical tax experience required for membership",
      ethicsModule: "Professional Responsibilities and Ethics of Taxation module mandatory"
    },
    amlRole: "ATT acts as an AML supervisor for members in the regulated sector",
    pcrtAdherence: "ATT members bound by Professional Conduct in Relation to Taxation (PCRT) guidance",
    source: "att.org.uk",
    lastVerified: "2026-03-12"
  },

  iia: {
    fullName: "Chartered Institute of Internal Auditors",
    abbreviation: "IIA",
    uKAndIreland: true,
    membershipNumbers: "Approximately 15,000 members in the UK and Ireland",
    internalAuditStandards: "The IIA sets and promotes the Global Internal Audit Standards (formerly the International Professional Practices Framework - IPPF). These standards are mandatory for all internal auditors globally and cover: (1) Purpose, Authority and Responsibility of the internal audit function, (2) Ethics and Professionalism including integrity, objectivity, confidentiality, and competency, (3) Governing the Internal Audit Function including board oversight and chief audit executive responsibilities, (4) Managing the Internal Audit Function covering planning, resource management, and quality assurance, (5) Performing Internal Audit Services including engagement planning, fieldwork, and reporting. The standards are particularly relevant to external audit when auditors seek to rely on internal audit work under ISA (UK) 610 'Using the Work of Internal Auditors'. External auditors must assess the objectivity, competence, and systematic approach of the internal audit function before placing reliance on their work.",
    globalInternalAuditStandards2024: {
      effectiveDate: "January 2025",
      domains: [
        {
          name: "Purpose of Internal Auditing",
          description: "Internal auditing strengthens the organisation's ability to create, protect, and sustain value"
        },
        {
          name: "Ethics and Professionalism",
          principles: ["Integrity", "Objectivity", "Confidentiality", "Competency"],
          requirements: "All internal auditors must demonstrate and maintain these principles"
        },
        {
          name: "Governing the Internal Audit Function",
          keyElements: ["Board oversight", "Organisational independence", "CAE role and responsibilities", "Audit charter"]
        },
        {
          name: "Managing the Internal Audit Function",
          keyElements: ["Strategic planning", "Resource management", "Quality assurance and improvement programme", "Communication with stakeholders"]
        },
        {
          name: "Performing Internal Audit Services",
          keyElements: ["Engagement planning", "Performing engagement work", "Communicating results", "Monitoring outcomes"]
        }
      ]
    },
    relevanceToExternalAudit: {
      isa610: "ISA (UK) 610 establishes requirements for external auditors when they plan to use internal audit work",
      assessmentCriteria: [
        "Objectivity of the internal audit function",
        "Technical competence of internal auditors",
        "Application of systematic and disciplined approach",
        "Quality of internal audit documentation and reports",
        "Whether internal audit function has adequate resources"
      ],
      directAssistance: "ISA (UK) 610 also addresses direct assistance from internal auditors to external audit team with specific conditions and prohibitions",
      pieRestrictions: "For PIE audits, the use of direct assistance from internal auditors is prohibited under FRC Ethical Standard"
    },
    qualifications: {
      cia: "Certified Internal Auditor - globally recognised professional certification",
      cfsa: "Certified Financial Services Auditor",
      ccsa: "Certification in Control Self-Assessment",
      crma: "Certification in Risk Management Assurance",
      qial: "Qualification in Internal Audit Leadership"
    },
    ukFinancialServicesCode: "The IIA UK Financial Services Code provides a framework for effective internal audit in financial services, emphasising independence, resourcing, and board reporting",
    source: "iia.org.uk",
    lastVerified: "2026-03-12"
  },

  aat: {
    fullName: "Association of Accounting Technicians",
    abbreviation: "AAT",
    founded: 1980,
    membershipNumbers: "Approximately 140,000 members and students",
    roleInAuditTeams: "AAT-qualified accounting technicians play a vital role in audit teams performing: (1) Preparation and reconciliation of working papers, (2) Vouching and verifying transactions to source documentation, (3) Bank reconciliation testing, (4) Accounts receivable and payable circularisation assistance, (5) Inventory count observation and testing, (6) Fixed asset verification procedures, (7) Preparation of audit schedules and lead sheets, (8) Basic analytical review procedures, (9) Documentation of walk-through tests and controls testing, (10) Assistance with accounts preparation from accounting records. AAT members provide essential support within audit teams under the supervision of qualified auditors, contributing to efficient audit delivery. Many AAT members progress to chartered-level qualifications (ACA, ACCA, CIMA) to advance their careers.",
    qualificationStructure: {
      level2: {
        name: "Foundation Certificate in Accounting",
        modules: ["Introduction to Bookkeeping", "Principles of Bookkeeping Controls", "Principles of Costing", "Business Environment"],
        description: "Entry-level qualification covering basic bookkeeping and accounting principles"
      },
      level3: {
        name: "Advanced Diploma in Accounting",
        modules: ["Advanced Bookkeeping", "Final Accounts Preparation", "Management Accounting: Costing", "Indirect Tax", "Ethics for Accountants", "Spreadsheets for Accounting"],
        description: "Intermediate level covering advanced bookkeeping and management accounting"
      },
      level4: {
        name: "Professional Diploma in Accounting",
        modules: ["Management Accounting: Budgeting", "Management Accounting: Decision and Control", "Financial Statements of Limited Companies", "Accounting Systems and Controls", "Business Tax", "Personal Tax", "External Auditing", "Credit and Debt Management", "Cash and Financial Management"],
        mandatoryCount: 4,
        optionalCount: 2,
        description: "Professional level with specialism options including external auditing"
      }
    },
    amlSupervision: {
      role: "AAT acts as an AML supervisor for members in bookkeeping and accounting services",
      scope: "Supervises members providing accountancy services within the regulated sector",
      requirements: "Members must comply with AAT AML guidance and complete AML-specific CPD"
    },
    cpdRequirements: {
      annual: "Members must maintain CPD relevant to their role",
      structure: "Mixture of structured and reflective learning activities",
      monitoring: "Annual CPD return with random compliance checks"
    },
    licenceToProvideServices: "AAT members wishing to provide services to the public must hold an AAT licence. Licensed members are subject to monitoring visits and must maintain professional indemnity insurance.",
    source: "aat.org.uk",
    lastVerified: "2026-03-12"
  }
};


// =============================================================================
// 2. FRC DETAIL
// =============================================================================

export const FRC_DETAIL = {
  fullName: "Financial Reporting Council",
  role: "The FRC is the UK's independent regulator responsible for regulating auditors, accountants and actuaries, and setting the UK's Corporate Governance and Stewardship Codes. It promotes transparency and integrity in business through high standards of corporate reporting, audit, and corporate governance.",
  transitionToARGA: {
    status: "The FRC is planned to transition to the Audit, Reporting and Governance Authority (ARGA) following legislative reform",
    keyChanges: [
      "Stronger enforcement powers",
      "Direct regulation of directors of large companies for corporate reporting",
      "Enhanced oversight of audit quality",
      "New powers over resilience statements and fraud reporting",
      "Expanded scope to cover largest private companies"
    ]
  },
  structure: {
    divisions: [
      {
        name: "Audit Quality Review (AQR)",
        role: "Monitors the quality of statutory audits of public interest entities and other major public interest audits through inspection of individual audit engagements and firm-wide quality management systems",
        scope: "PIE audits and AIM-listed company audits, major public interest audits",
        inspectionApproach: "Risk-based selection of engagements for review, annual thematic reviews, firm-wide quality management system reviews"
      },
      {
        name: "Supervision Division",
        role: "Proactive oversight of the largest audit firms through a continuous supervisory approach",
        activities: [
          "Regular engagement with firm leadership",
          "Review of governance and culture",
          "Assessment of quality management systems",
          "Monitoring of remediation of identified deficiencies",
          "Thematic and cross-firm reviews"
        ]
      },
      {
        name: "Enforcement Division",
        role: "Investigates and takes action against accountants, auditors and actuaries for misconduct",
        procedures: {
          auditEnforcementProcedure: "Statutory scheme for investigating and sanctioning statutory auditors and audit firms",
          accountancyScheme: "Voluntary scheme operated with the participation of professional bodies",
          actuarialScheme: "Scheme for investigating and sanctioning actuaries"
        },
        sanctions: [
          "Unlimited financial penalties",
          "Prohibition from audit work",
          "Conditions on audit work",
          "Reprimands and severe reprimands",
          "Requirement for additional training or education",
          "Exclusion from professional body membership"
        ]
      },
      {
        name: "Corporate Reporting Review (CRR)",
        role: "Reviews corporate reports and accounts of public and large private companies to ensure compliance with relevant reporting requirements",
        approach: "Risk-based selection of annual reports for thematic and company-specific review",
        powers: [
          "Corresponding with companies on reporting concerns",
          "Seeking voluntary revision of defective accounts",
          "Applying to court for order requiring revision of accounts"
        ]
      },
      {
        name: "Codes and Standards Division",
        role: "Sets and maintains UK standards for audit, assurance, ethics, corporate governance, stewardship, and actuarial work",
        standardsIssued: [
          "International Standards on Auditing (UK) - ISAs (UK)",
          "International Standards on Quality Management (UK) - ISQM (UK)",
          "Ethical Standard for auditors",
          "Practice Notes providing guidance on applying standards",
          "UK Corporate Governance Code",
          "UK Stewardship Code",
          "Technical Actuarial Standards"
        ]
      }
    ]
  },

  ethicalStandard2024: {
    title: "Revised Ethical Standard 2024",
    effectiveDate: "Applicable to audit engagements for periods commencing on or after 15 March 2024",
    objective: "To establish requirements and guidance for auditors on integrity, objectivity and independence in connection with the audit of financial statements",
    overarchingPrinciples: [
      "The auditor shall behave with integrity in all professional and business relationships",
      "The auditor shall be objective and not allow bias, conflict of interest or undue influence of others to override professional judgement",
      "The auditor of an entity shall be independent of that entity"
    ],

    partA: {
      title: "General Requirements and Guidance",
      scope: "Applies to all engagements to report on financial statements including statutory audit, voluntary audit, and review engagements",
      fundamentalPrinciples: {
        integrity: "The auditor shall be straightforward and honest in all professional and business relationships, shall not be associated with reports or information believed to contain materially false or misleading statements",
        objectivity: "The auditor shall not allow bias, conflict of interest, or undue influence to override professional or business judgement",
        independence: {
          description: "Independence comprises both independence of mind and independence in appearance",
          independenceOfMind: "The state of mind that permits the expression of a conclusion without being affected by influences that compromise professional judgement, allowing an individual to act with integrity, objectivity and professional scepticism",
          independenceInAppearance: "The avoidance of facts and circumstances that are so significant that a reasonable and informed third party would be likely to conclude that integrity, objectivity or professional scepticism had been compromised"
        }
      },
      coveragePeriod: {
        description: "Independence is required during the engagement period and the period covered by the financial statements",
        engagementPeriod: "Starts when the audit team begins to perform audit services and ends when the audit report is issued or engagement terminated",
        financialStatementPeriod: "The period covered by the financial statements subject to audit"
      },
      firmWideSafeguards: [
        "Quality management systems in accordance with ISQM (UK) 1",
        "Policies and procedures for identifying threats to independence",
        "Internal consultation on independence matters",
        "Periodic independence confirmations from all partners and staff",
        "Partner rotation policies and procedures",
        "Monitoring of compliance with ethical requirements",
        "Disciplinary mechanisms for non-compliance"
      ]
    },

    partB: {
      title: "Financial, Business, Employment and Personal Relationships",
      financialInterests: {
        prohibited: [
          "Direct financial interests in an audit client by covered persons",
          "Material indirect financial interests in an audit client by covered persons",
          "Financial interests in entities that have controlling interest in audit client"
        ],
        definitions: {
          directFinancialInterest: "A financial interest directly owned or controlled, including through nominee arrangements",
          indirectFinancialInterest: "A financial interest beneficially owned through a pooled investment vehicle, estate, trust, or other intermediary over which the individual has no control",
          coveredPersons: "Partners and staff on the engagement team, their immediate family members, and others able to influence the audit opinion"
        },
        procedures: [
          "Pre-engagement client and conflict checking procedures",
          "Annual independence declarations covering financial interests",
          "Procedures for managing inadvertent acquisitions",
          "Monitoring of investment portfolios for relevant interests"
        ]
      },
      businessRelationships: {
        prohibited: "Close business relationships between the firm or audit team and audit client that involve common commercial interests unless clearly insignificant",
        examples: [
          "Joint ventures or similar arrangements",
          "Material commercial transactions on non-arm's length terms",
          "Cross-selling arrangements beyond normal professional services"
        ],
        permittedWithSafeguards: "Arm's length commercial transactions in the normal course of business may be permitted with appropriate safeguards"
      },
      employmentRelationships: {
        coolingOffRequirements: {
          formerPartner: "A former engagement partner must not join an audit client as a director or in a key audit-relevant role for at least 2 years (PIE: enhanced requirements apply)",
          formerStaff: "Other former audit team members should observe appropriate cooling-off before joining audit client in a senior position",
          auditClientStaff: "Former officers or employees of an audit client should not participate in the audit until appropriate time has elapsed"
        },
        concurrentEmployment: "Concurrent employment with audit client is prohibited for audit team members",
        recruitmentServices: "The firm shall not provide management recruitment services to audit clients for director or key management positions"
      },
      personalRelationships: {
        prohibitions: [
          "Immediate family of engagement partner holding director or senior role at audit client",
          "Immediate family of engagement team member holding position to exert significant influence over financial statements",
          "Close personal relationships between audit team members and senior personnel of audit client"
        ],
        definitions: {
          immediateFamily: "Spouse, civil partner, cohabitant, or dependent child",
          closeFamilyMember: "Parent, non-dependent child, or sibling"
        }
      }
    },

    nonAuditServices: {
      overarchingPrinciple: "The provision of non-audit services to an audit client creates potential threats to independence. The Ethical Standard sets out a framework of permitted and prohibited services.",
      whitelist: [
        {
          service: "Audit-related services required by law or regulation",
          description: "Services required by law or regulation to be provided by the auditor, including reporting required by the Companies Act or by regulators such as FCA, PRA, or Charity Commission",
          conditions: "Must be performed by the audit team with appropriate quality controls"
        },
        {
          service: "Other audit-related assurance services",
          description: "Review of interim financial information, reporting on regulatory returns, agreed-upon procedures engagements specified by regulators",
          conditions: "Must be closely related to the audit or required by law or regulation"
        },
        {
          service: "Reporting required by law or regulation to be performed by the auditor",
          description: "Auditor reports on corporate governance, strategic report and directors report consistency checks",
          conditions: "Must be a statutory or regulatory requirement for the auditor to provide"
        },
        {
          service: "Non-audit services that are trivial or inconsequential",
          description: "Services that have no material impact on the financial statements and where the fee is clearly trivial",
          conditions: "Both the nature and fees must be clearly trivial and inconsequential"
        },
        {
          service: "Compilation of financial statements for non-PIE entities",
          description: "Assistance with preparation of financial statements where management takes responsibility for all decisions",
          conditions: "Not permitted for PIE audit clients. Management must take responsibility for all decisions and judgements."
        },
        {
          service: "Accounting services in emergency situations for non-PIE entities",
          description: "Accounting services in emergency or unusual situations where it is impractical for the entity to make other arrangements",
          conditions: "Only for non-PIE clients, only in emergency situations, with specific safeguards"
        }
      ],
      blacklist: [
        {
          service: "Bookkeeping and preparing accounting records or financial statements (PIE)",
          description: "Recording transactions, maintaining accounting records, preparing financial statements for PIE audit clients",
          reason: "Creates self-review and management threats that cannot be reduced to acceptable levels",
          scope: "Absolute prohibition for PIE audit clients; restricted for non-PIE"
        },
        {
          service: "Internal audit services involving management functions",
          description: "Internal audit services that involve performing management functions or making management decisions",
          reason: "Creates management and self-review threats",
          scope: "Prohibited for all audit clients where it involves management functions"
        },
        {
          service: "Tax services involving tax planning with material uncertainty",
          description: "Tax advisory services where the effectiveness depends on a particular accounting treatment and there is reasonable doubt about appropriateness",
          reason: "Creates advocacy and self-review threats",
          scope: "Prohibited where outcome is dependent on uncertain accounting treatment"
        },
        {
          service: "Valuation services with material effect on financial statements (PIE)",
          description: "Valuation services where the result would have a material effect on the financial statements being audited",
          reason: "Creates self-review threat",
          scope: "Prohibited for PIE audit clients; restricted for non-PIE"
        },
        {
          service: "Legal services in advocacy role",
          description: "Acting as advocate for the audit client in resolving disputes or litigation",
          reason: "Creates advocacy threat fundamentally incompatible with auditor objectivity",
          scope: "Prohibited for all audit clients"
        },
        {
          service: "Management decision-making",
          description: "Taking decisions on behalf of management or assuming a management role at audit client",
          reason: "Creates management threat that is fundamental and cannot be safeguarded",
          scope: "Absolute prohibition for all audit clients"
        },
        {
          service: "Recruitment of senior management (PIE)",
          description: "Recruiting senior management or directors for PIE audit clients",
          reason: "Creates familiarity and management threats",
          scope: "Prohibited for PIE audit clients"
        },
        {
          service: "Designing or implementing IT systems related to financial reporting (PIE)",
          description: "Design or implementation of financial information technology systems for PIE audit clients",
          reason: "Creates self-review threat given impact on financial statements",
          scope: "Prohibited for PIE audit clients"
        },
        {
          service: "Corporate finance advice involving underwriting or promotion of shares (PIE)",
          description: "Corporate finance services involving promotion, dealing in, or underwriting shares of PIE audit client",
          reason: "Creates self-interest and advocacy threats",
          scope: "Prohibited for PIE audit clients"
        }
      ],
      feeConsiderations: {
        totalNonAuditFees: "Non-audit fees should not exceed 70% of the average audit fee for the three consecutive financial periods (PIE)",
        reportingRequirements: "Fees for non-audit services must be disclosed in the audit report for PIE audits",
        auditCommitteeApproval: "All non-audit services to PIE audit clients must be pre-approved by the audit committee",
        significanceAssessment: "The significance of fees relative to the audit fee and to the firm's total revenue should be considered"
      }
    },

    partnerRotation: {
      pieRequirements: {
        engagementPartner: {
          maxTenure: "5 years",
          coolingOffPeriod: "3 years",
          description: "The audit engagement partner for a PIE must rotate after 5 years and observe a 3-year cooling-off period before returning to the engagement"
        },
        engagementQualityReviewer: {
          maxTenure: "7 years",
          coolingOffPeriod: "3 years",
          description: "The EQR partner for a PIE must rotate after 7 years with a 3-year cooling-off period"
        },
        keyAuditPartner: {
          maxTenure: "7 years",
          coolingOffPeriod: "2 years",
          description: "Other key audit partners for a PIE must rotate after 7 years with a 2-year cooling-off period"
        },
        totalConnectionLimit: "No individual should be connected with the audit of a PIE for more than a cumulative total period that would create a familiarity threat"
      },
      nonPieRequirements: {
        engagementPartner: {
          maxTenure: "10 years as engagement partner, though good practice suggests a shorter rotation",
          coolingOffPeriod: "5 years after 10-year tenure, shorter period if voluntarily rotated earlier",
          description: "Non-PIE engagement partners should rotate after 10 years with appropriate cooling-off"
        },
        significantNonPie: "For significant non-PIE entities, more frequent rotation may be appropriate"
      },
      coolingOff: {
        description: "During cooling-off period, the partner must not participate in the audit, be consulted on technical or industry-specific issues, be responsible for quality management for the engagement, or have any other role on the engagement",
        permittedActivities: "Limited to firm-wide roles not directly related to the specific audit engagement"
      }
    },

    threatsAndSafeguards: {
      framework: "The Ethical Standard employs a threats and safeguards approach. Auditors must identify threats to independence, evaluate their significance, and apply safeguards to reduce threats to acceptable levels.",
      threatCategories: [
        {
          name: "Self-interest threat",
          description: "The threat that a financial or other interest will inappropriately influence the auditor's judgement or behaviour",
          examples: [
            "Financial interest in the audit client",
            "Undue dependence on fees from the audit client",
            "Concern about losing the audit engagement",
            "Potential employment with the audit client",
            "Contingent fees for non-audit services",
            "Loans to or from the audit client"
          ]
        },
        {
          name: "Self-review threat",
          description: "The threat that the auditor will not appropriately evaluate the results of a previous judgement made or service performed",
          examples: [
            "Auditing financial statements the firm helped prepare",
            "Reviewing internal controls the firm designed",
            "Auditing valuations the firm prepared",
            "Auditing tax computations the firm calculated"
          ]
        },
        {
          name: "Management threat",
          description: "The threat that the auditor will take on the role of management or otherwise assume management responsibilities",
          examples: [
            "Making management decisions for the audit client",
            "Authorising transactions or accounting entries",
            "Preparing source documents for the audit client",
            "Having custody of audit client assets"
          ]
        },
        {
          name: "Advocacy threat",
          description: "The threat that the auditor will promote the client's position to the point of compromising objectivity",
          examples: [
            "Acting as advocate for the client in legal proceedings",
            "Promoting the client's shares or securities",
            "Representing the client in tax disputes with HMRC"
          ]
        },
        {
          name: "Familiarity threat",
          description: "The threat that due to a long or close relationship the auditor will be too sympathetic or not sufficiently challenging",
          examples: [
            "Long association with audit client",
            "Close personal relationships with client directors",
            "Former audit team member now employed by client",
            "Regular gift or hospitality acceptance from client"
          ]
        },
        {
          name: "Intimidation threat",
          description: "The threat that the auditor will be deterred from acting objectively because of actual or perceived pressures",
          examples: [
            "Threat of dismissal or replacement as auditor",
            "Pressure regarding inappropriate accounting treatment",
            "Threat of litigation against the firm",
            "Dominant personality within the client exerting influence"
          ]
        }
      ],
      safeguards: {
        firmLevel: [
          "Quality management system in accordance with ISQM (UK) 1",
          "Independence monitoring and compliance function",
          "Policies for identifying threats and evaluating safeguards",
          "Partner rotation policies",
          "Independence training and confirmations",
          "Internal disciplinary mechanisms"
        ],
        engagementLevel: [
          "Engagement quality review",
          "Consultation with individuals outside the engagement team",
          "Rotation of engagement personnel",
          "Independent partner or professional review",
          "Discussion with audit committee regarding independence matters",
          "Modification of engagement plan to address identified threats"
        ]
      }
    },

    pieAdditionalRequirements: {
      definition: "Public Interest Entities include entities whose transferable securities are admitted to trading on a UK regulated market, credit institutions, and insurance undertakings",
      extendedBlacklist: "More extensive list of prohibited non-audit services for PIE audit clients",
      feeCapOnNonAuditServices: "70% cap on non-audit service fees relative to average audit fees over three years",
      mandatoryTendering: "PIE audit engagements must be put out to tender at least every 10 years",
      mandatoryRotation: "Maximum 20-year engagement of the same audit firm with tendering at 10 years",
      auditCommitteeRole: [
        "Pre-approval of all non-audit services",
        "Recommendation on appointment and remuneration of auditor",
        "Monitoring of auditor independence",
        "Oversight of audit process and audit quality",
        "Assessment of threats to auditor independence"
      ],
      transparencyReport: "Audit firms that audit PIEs must publish annual transparency reports covering governance, QMS, independence practices, and financial information",
      auditReport: "Enhanced audit reporting for PIEs including key audit matters, assessment of going concern, and independence confirmation"
    }
  },

  isqmUK1: {
    title: "International Standard on Quality Management (UK) 1",
    effectiveDate: "Effective for all firms from 15 December 2022",
    objective: "Requires firms to design, implement, and operate a system of quality management providing reasonable assurance that engagements are performed in accordance with professional standards and applicable legal and regulatory requirements",
    approach: "Risk-based approach requiring firms to identify quality risks, design and implement responses, and monitor effectiveness through continuous improvement",
    components: [
      {
        name: "Governance and Leadership",
        description: "The firm's leadership is responsible for quality through culture, actions, and communications reflecting commitment to quality",
        requirements: [
          "Establish and communicate the firm's commitment to quality through a quality-oriented culture",
          "Assign ultimate responsibility and accountability for the QMS to the firm's managing partner or board",
          "Assign operational responsibility for the QMS to a suitably experienced and authorised individual",
          "Ensure leadership demonstrates commitment through actions, behaviours, and communications",
          "Evaluate performance and reward systems to ensure they support quality objectives",
          "Ensure appropriate organisational structure that supports the QMS",
          "Allocate sufficient resources for the design, implementation, and operation of the QMS",
          "Address the firm's financial and operational priorities so they do not adversely affect quality",
          "Establish policies promoting a culture of consultation and speaking up on quality matters",
          "Ensure leadership reviews the effectiveness of the QMS at least annually"
        ]
      },
      {
        name: "Ethical Requirements",
        description: "The firm and its personnel fulfil responsibilities in accordance with ethical requirements including independence",
        requirements: [
          "Establish policies and procedures to identify, evaluate, and address threats to compliance with ethical requirements",
          "Establish policies requiring all personnel to comply with the FRC Ethical Standard",
          "Implement independence monitoring procedures for all audit and assurance engagements",
          "Maintain processes for obtaining annual independence confirmations from partners and staff",
          "Establish policies for identifying and managing conflicts of interest",
          "Maintain records of independence and ethics consultations and conclusions reached",
          "Implement procedures for the prompt identification and resolution of independence breaches",
          "Monitor compliance with ethical requirements and take appropriate action for non-compliance",
          "Communicate ethical requirements to all personnel and provide training",
          "Establish policies on the acceptance of gifts and hospitality"
        ]
      },
      {
        name: "Acceptance and Continuance",
        description: "Provides firm with reasonable assurance that it will only accept or continue engagements where it is competent and capable",
        requirements: [
          "Establish policies for assessing whether the firm is competent to perform the engagement",
          "Evaluate the integrity and ethical values of the prospective client or engagement",
          "Assess the risk profile of the engagement and whether it is within the firm's risk appetite",
          "Determine whether the firm has sufficient resources to perform the engagement to required standards",
          "Evaluate the appropriateness of the terms of engagement",
          "Consider potential independence and conflict of interest issues before acceptance",
          "Perform AML customer due diligence before accepting the engagement",
          "Establish procedures for determining whether to continue an existing engagement",
          "Document the rationale for accepting or continuing high-risk engagements",
          "Establish policies for withdrawing from engagements where quality cannot be maintained"
        ]
      },
      {
        name: "Engagement Performance",
        description: "Audit engagements are performed and reports issued in accordance with professional standards and applicable requirements",
        requirements: [
          "Establish policies requiring compliance with ISAs (UK) and other applicable standards",
          "Implement procedures for the direction, supervision, and review of engagement work",
          "Establish requirements for engagement documentation that supports the audit opinion",
          "Implement consultation procedures for difficult or contentious matters",
          "Establish policies for resolving differences of opinion within the engagement team",
          "Implement engagement quality review procedures for applicable engagements",
          "Establish requirements for assembling and retaining engagement files",
          "Implement procedures for timely completion and archiving of engagement files within 60 days of audit report date",
          "Establish policies for using the work of experts, other auditors, and service organisations",
          "Establish procedures for identifying significant risks and ensuring appropriate responses",
          "Implement technology quality controls for audit software and tools",
          "Establish policies for the appropriate exercise of professional judgement and scepticism"
        ]
      },
      {
        name: "Resources",
        description: "Appropriate resources are obtained, allocated, and assigned to enable the QMS and engagement performance",
        requirements: [
          "Establish policies for the recruitment and hiring of competent personnel",
          "Maintain appropriate level of staff competence through training and development",
          "Implement performance evaluation systems that reflect quality objectives",
          "Allocate engagement teams with appropriate competence, capabilities, and time",
          "Ensure intellectual resources including methodology, guidance, and templates are current and appropriate",
          "Implement and maintain appropriate technological resources including audit software and data analytics",
          "Establish policies for the use of external service providers and their quality management",
          "Allocate financial resources sufficient to support quality objectives",
          "Implement succession planning for key roles including engagement partners",
          "Maintain resources for specialist expertise available to engagement teams"
        ]
      },
      {
        name: "Information and Communication",
        description: "The firm obtains, generates, and communicates information regarding the QMS on a timely basis",
        requirements: [
          "Establish an information system that supports the QMS and engagement performance",
          "Communicate quality expectations and policies to all personnel clearly and consistently",
          "Establish internal reporting channels for quality-related concerns and matters",
          "Implement a culture where personnel feel empowered to raise quality concerns without fear of retaliation",
          "Communicate results of QMS monitoring to appropriate levels within the firm",
          "Establish procedures for external communication on quality matters with regulators and audit committees",
          "Maintain up-to-date policies and procedures manuals accessible to all relevant personnel",
          "Communicate findings from AQR inspections and regulatory interactions to relevant personnel",
          "Establish processes for identifying and communicating relevant external information including standards changes",
          "Implement confidentiality procedures for information obtained during engagements"
        ]
      },
      {
        name: "Monitoring and Remediation",
        description: "The firm monitors the design, implementation, and operation of the QMS and responds to findings",
        requirements: [
          "Design and implement monitoring activities covering all components of the QMS",
          "Perform engagement inspections (cold file reviews) on a selection of completed engagements",
          "Select engagements for inspection using a risk-based approach with a cyclical element",
          "Evaluate the root causes of identified deficiencies to prevent recurrence",
          "Design and implement remedial actions that are responsive to the identified deficiencies",
          "Monitor the effectiveness of remedial actions to ensure they address the underlying issues",
          "Evaluate annually whether the QMS provides reasonable assurance that quality objectives are achieved",
          "Report the results of the monitoring and remediation process to firm leadership",
          "Consider the results of external inspections (AQR, RSB reviews) in the monitoring process",
          "Document the monitoring activities performed, findings identified, and remedial actions taken",
          "Assess whether identified deficiencies individually or in aggregate indicate the QMS may not be achieving quality objectives",
          "Communicate monitoring findings to engagement teams and personnel for continuous improvement"
        ]
      }
    ]
  },

  isqmUK2: {
    title: "International Standard on Quality Management (UK) 2 - Engagement Quality Reviews",
    effectiveDate: "Effective from 15 December 2022",
    objective: "To establish requirements regarding the appointment and eligibility of the engagement quality reviewer, and the performance and documentation of the engagement quality review",
    criteria: {
      mandatoryEQR: [
        "All audits of public interest entities (PIEs)",
        "Audits of entities where law or regulation requires an EQR",
        "Audits for which the firm determines an EQR is required based on quality risk assessment",
        "Engagements specified by ISQM (UK) 1 policies as requiring an EQR"
      ],
      firmDetermined: [
        "Listed entity audits on non-regulated markets such as AIM",
        "Significant entities due to size, public interest, or risk profile",
        "First-year audit engagements",
        "Engagements involving complex or unusual accounting treatments",
        "Engagements where there have been significant difficulties or disagreements",
        "Engagements in high-risk sectors including financial services and public sector"
      ]
    },
    eqcrTriggers: [
      "Entity is a public interest entity as defined by UK regulations",
      "Entity has transferable securities admitted to trading on a regulated market",
      "Entity is a credit institution or insurance undertaking",
      "Engagement involves a significant public interest dimension",
      "Audit engagement with a significant risk of material misstatement",
      "First audit engagement for the firm (new client acceptance)",
      "Engagement where a significant disagreement has arisen within the team",
      "Going concern uncertainties identified during the audit",
      "Engagement involving significant related party transactions",
      "Request from the engagement partner for an EQR",
      "Engagement where the firm has identified indicators of fraud risk",
      "Complex group audit with multiple component auditors"
    ],
    reviewerEligibility: {
      requirements: [
        "Must be a registered auditor for audit engagements",
        "Must not have been a member of the engagement team",
        "Must be independent of the audit client",
        "Must have appropriate competence and experience including industry knowledge",
        "Must have authority to perform the review independently",
        "Subject to rotation requirements for PIE engagements"
      ],
      prohibitions: [
        "Must not make decisions for the engagement team",
        "Must not have provided consultation on the engagement on matters subject to EQR",
        "Must not allow personal relationships to impair objectivity"
      ]
    },
    reviewScope: {
      mandatoryElements: [
        "Significant risks identified and responses to those risks",
        "Significant judgements made including accounting estimates",
        "Significance and disposition of corrected and uncorrected misstatements",
        "Matters to be communicated to management, TCWG, and regulators",
        "Whether the audit documentation supports the conclusions reached",
        "Going concern assessment and conclusions",
        "Appropriateness of the audit report including any modifications",
        "Independence and ethics conclusions"
      ],
      process: [
        "Review of key engagement documentation and working papers",
        "Discussion with the engagement partner on significant matters",
        "Review of financial statements and proposed audit report",
        "Assessment of engagement team's response to significant risks",
        "Evaluation of the basis for key audit judgements",
        "Consideration of findings from the engagement team's consultation with others"
      ]
    },
    documentation: "The EQR must be documented including the scope of the review, the procedures performed, the conclusions reached, and the basis for those conclusions"
  },

  auditQualityReview: {
    inspectionProcess: {
      description: "The FRC's Audit Quality Review team inspects the quality of statutory audits of PIEs and other significant audits",
      scope: [
        "Statutory audits of FTSE 100 and FTSE 250 companies",
        "Statutory audits of other public interest entities",
        "Statutory audits of AIM-listed companies (selected major audits)",
        "Other audits of significant public interest",
        "Firm-wide quality management system reviews"
      ],
      process: [
        "Risk-based selection of engagements for inspection",
        "Advance notification to the audit firm",
        "On-site review of engagement working papers and documentation",
        "Meetings with engagement team including engagement partner",
        "Assessment of key audit judgements and responses to risks",
        "Evaluation of independence and ethical compliance",
        "Assessment of group audit procedures for multinational entities",
        "Consideration of the firm's quality management system operation",
        "Draft findings report shared with firm for factual accuracy review",
        "Final grading and findings report issued"
      ],
      gradingScale: [
        {
          grade: "Good or limited improvements required",
          description: "The audit was performed to a good standard with no significant deficiencies or only limited improvements needed"
        },
        {
          grade: "Improvements required",
          description: "There were areas where improvements are required to enhance audit quality but no key judgement was at risk"
        },
        {
          grade: "Significant improvements required",
          description: "There were significant deficiencies that require prompt attention"
        }
      ]
    },
    recentResults: {
      period: "2024/25 inspection cycle",
      keyFindings: [
        "Audit quality at the largest firms continues to show improvement but inconsistency remains",
        "Most common findings relate to challenge of management estimates, testing of revenue, group audit oversight, going concern assessment, and impairment testing",
        "Root cause analysis of audit deficiencies needs to be more rigorous at some firms",
        "Quality management systems generally well-designed but implementation varies",
        "Use of technology and data analytics improving but application inconsistent",
        "Professional scepticism remains an area requiring continued focus"
      ],
      areasOfFocus: [
        "Quality of challenge of management in areas of significant judgement",
        "Effectiveness of direction, supervision and review",
        "Going concern assessment including cash flow forecasts and stress testing",
        "Audit of revenue including contract accounting and cut-off",
        "Impairment of goodwill and intangible assets",
        "Expected credit loss models for financial institutions",
        "Climate-related financial disclosures and their impact on financial statements",
        "Group audit planning and oversight of component auditors"
      ],
      thematicReviews: [
        "Climate-related financial disclosures in audit",
        "Technology and innovation in audit",
        "Fraud risk assessment and procedures",
        "Professional judgement and scepticism",
        "Root cause analysis effectiveness"
      ]
    }
  },

  ukCorporateGovernanceCode: {
    version: "2024 UK Corporate Governance Code",
    effectiveDate: "Applicable to financial years beginning on or after 1 January 2025",
    applicability: "All companies with a premium listing on the London Stock Exchange on a comply or explain basis",
    principles: [
      {
        section: "Board Leadership and Company Purpose",
        principles: [
          "Effective and entrepreneurial board providing long-term sustainable success",
          "Established company purpose, values and strategy aligned with culture",
          "Board ensures necessary resources for meeting objectives and measuring performance",
          "Effective engagement with stakeholders and shareholders"
        ]
      },
      {
        section: "Division of Responsibilities",
        principles: [
          "Clear division of responsibilities between board leadership and executive management",
          "Chair leads board and responsible for overall effectiveness",
          "Non-executive directors provide constructive challenge and strategic guidance",
          "Company secretary supports the board in its governance functions"
        ]
      },
      {
        section: "Composition, Succession and Evaluation",
        principles: [
          "Board and committees have appropriate combination of skills, experience and knowledge",
          "Formal, rigorous and transparent procedures for appointment of new directors",
          "Annual evaluation of board effectiveness with external evaluation at least every three years",
          "Succession planning for board and senior management"
        ]
      },
      {
        section: "Audit, Risk and Internal Control",
        principles: [
          "Formal and transparent policies and procedures for audit, risk management and internal control",
          "Audit committee with appropriate independence, competence and authority",
          "Board establishes risk management and internal control framework and reviews effectiveness annually",
          "Board maintains sound risk management and internal control systems"
        ]
      },
      {
        section: "Remuneration",
        principles: [
          "Remuneration policies and practices designed to support strategy and promote long-term sustainable success",
          "Formal and transparent procedure for developing remuneration policy",
          "No director involved in deciding their own remuneration",
          "Exercise of independent judgement and discretion in remuneration decisions"
        ]
      }
    ]
  },

  source: "FRC",
  lastVerified: "2026-03-12"
};


// =============================================================================
// 3. HMRC DETAIL
// =============================================================================

export const HMRC_DETAIL = {
  fullName: "His Majesty's Revenue and Customs",
  role: "HMRC is the UK's tax, payments and customs authority responsible for collecting revenue, administering tax credits, and enforcing tax compliance. HMRC collects over £700 billion annually through various taxes and duties.",
  relevanceToAudit: "Auditors must understand the UK tax system to properly assess tax provisions, deferred tax, compliance obligations, and tax-related disclosures in financial statements. Key areas include verification of tax computations, assessment of tax risks and contingencies, and evaluation of transfer pricing for multinational groups.",

  corporationTax: {
    overview: "Corporation tax is charged on the profits of UK-resident companies and non-UK resident companies carrying on a trade through a UK permanent establishment",
    ct600: {
      description: "Corporation Tax Return (CT600) - the main return for declaring company profits, tax liability, and claiming reliefs",
      structure: {
        ct600Main: "Main return covering trading profits, investment income, chargeable gains, and total profits chargeable to corporation tax",
        ct600a: "CT600A - Loans and advances to participators by close companies (S455 CTA 2010)",
        ct600b: "CT600B - R&D enhanced expenditure",
        ct600c: "CT600C - Group and consortium relief",
        ct600d: "CT600D - Insurance",
        ct600e: "CT600E - Charities and CASCs",
        ct600f: "CT600F - Tonnage tax",
        ct600g: "CT600G - Corporate venturing scheme",
        ct600h: "CT600H - Cross-border royalties",
        ct600i: "CT600I - Supplementary charge on ring fence profits (oil and gas)",
        ct600j: "CT600J - Disclosure of avoidance schemes",
        ct600l: "CT600L - Restitution tax",
        computations: "Full tax computation must accompany the CT600 showing the reconciliation from accounting profit to taxable profit",
        iXBRL: "Accounts and computations must be filed in inline XBRL (iXBRL) tagged format"
      },
      keySchedules: [
        "Trading profit computation with capital allowances",
        "Loan relationship debits and credits",
        "Intangible fixed assets amortisation adjustments",
        "Property income computation",
        "Chargeable gains computation",
        "Group relief claims and surrenders",
        "Loss relief claims (carry forward, carry back, group)",
        "R&D enhanced expenditure computation",
        "Transfer pricing adjustments",
        "Capital allowances computation"
      ]
    },
    rates: {
      mainRate: "25% for profits exceeding upper limit of £250,000",
      smallProfitsRate: "19% for profits not exceeding lower limit of £50,000",
      marginalReliefFraction: "3/200 for profits between £50,000 and £250,000",
      associatedCompanies: "Upper and lower limits divided by number of associated companies plus one",
      ringFenceRate: "30% for ring fence profits (oil and gas)",
      ringFenceSupplementaryCharge: "10% supplementary charge on ring fence profits",
      bankSurcharge: "3% surcharge on banking company profits over £100 million",
      pillarTwo: {
        description: "Multinational Top-up Tax (MTT) and Domestic Top-up Tax (DTT) implementing OECD Pillar Two rules",
        effectiveFrom: "Accounting periods beginning on or after 31 December 2023",
        minimumRate: "15% effective minimum tax rate for groups with consolidated revenue of EUR 750 million or more",
        qualifiedDomesticMinimumTopUpTax: "DTT applies to UK constituent entities where ETR is below 15%",
        multinationalTopUpTax: "MTT applies to low-taxed profits of overseas entities in the group"
      }
    },
    filingDeadline: {
      ct600: "12 months after the end of the accounting period",
      accounts: "Must accompany the CT600 filing",
      electronicFiling: "Mandatory for all companies",
      amendmentPeriod: "12 months from the filing deadline to amend the return",
      discoveryAssessment: "HMRC may make discovery assessments within 4 years (6 years for carelessness, 20 years for deliberate behaviour)"
    },
    paymentDeadline: {
      standard: "9 months and 1 day after the end of the accounting period",
      largeCompanies: "Quarterly instalment payments required for companies with profits exceeding £1.5 million (divided by number of associated companies plus one)",
      veryLargeCompanies: "Quarterly instalment payments in months 3, 6, 9, and 12 of the accounting period for companies with profits exceeding £20 million",
      interestCharges: "Late payment interest charged at Bank of England base rate plus 2.5%",
      repaymentInterest: "Interest paid on overpayments at Bank of England base rate minus 1%"
    },
    lossRelief: {
      tradingLosses: {
        carryForward: "Unlimited carry forward against future total profits of the same trade, subject to 50% restriction on profits exceeding £5 million",
        carryBack: "Carry back against total profits of the preceding 12 months",
        extendedCarryBack: "Special provisions for terminal losses (carry back 3 years) and early trade losses",
        groupRelief: "Surrender to other group companies for the corresponding accounting period"
      },
      capitalLosses: {
        carryForward: "Against future capital gains only (no carry back for companies)",
        restriction: "Capital losses carried forward restricted to 50% of gains exceeding £5 million annual deductions allowance"
      },
      propertyLosses: "Set against total profits of the same period; excess carried forward against future total profits"
    }
  },

  paye: {
    overview: "Pay As You Earn is the system used by employers to deduct income tax and National Insurance contributions from employees' pay and remit them to HMRC",
    rti: {
      description: "Real Time Information - employers must report payroll information to HMRC on or before each payment date",
      fps: {
        name: "Full Payment Submission",
        description: "Submitted each time an employee is paid, reporting gross pay, tax deducted, NICs, student loan deductions, and other statutory deductions",
        frequency: "On or before each payment date",
        contents: [
          "Employee details (name, NI number, tax code)",
          "Pay period and payment date",
          "Gross pay for the period",
          "Tax deducted (income tax)",
          "Employee and employer National Insurance contributions",
          "Student loan and postgraduate loan deductions",
          "Statutory payments (SSP, SMP, SPP, SAP, ShPP)",
          "Pension contributions under auto-enrolment",
          "Payrolled benefits in kind",
          "Starter and leaver information"
        ],
        penalties: {
          lateSubmission: "Penalties based on number of employees: £100 per month for 1-9 employees, £200 for 10-49, £300 for 50-249, £400 for 250+",
          threshold: "Penalties apply if FPS is late more than 3 times in a tax year",
          additionalPenalty: "5% of tax and NICs unpaid at 6 months, further 5% at 12 months"
        }
      },
      eps: {
        name: "Employer Payment Summary",
        description: "Submitted to report any statutory payment recoveries, CIS deductions, or to indicate no employees were paid in a period",
        frequency: "Monthly by the 19th of the following tax month (or by the 19th following the tax month to which it relates)",
        contents: [
          "Statutory payment recoveries (SSP, SMP, SPP, SAP, ShPP)",
          "CIS deductions suffered by the employer as a subcontractor",
          "Apprenticeship levy reduction for connected companies",
          "Employment allowance claim",
          "No payment indicator where no FPS due",
          "Final EPS submission for the tax year (declaration)"
        ]
      }
    },
    p11d: {
      name: "P11D Return of Benefits and Expenses",
      description: "Annual return reporting benefits in kind and expenses provided to employees and directors where not payrolled",
      filingDeadline: "6 July following the end of the tax year",
      paymentDeadline: "Class 1A NICs due by 22 July (electronic) or 19 July (cheque)",
      commonBenefits: [
        "Company cars and fuel benefit",
        "Private medical insurance",
        "Interest-free or low-interest loans above £10,000",
        "Living accommodation",
        "Subscriptions and professional fees",
        "Mileage allowance in excess of approved rates",
        "Non-qualifying relocation expenses over £8,000",
        "Childcare benefit in excess of exempt amount",
        "Assets placed at disposal of employee",
        "Vouchers and credit cards for non-business expenditure"
      ],
      payrollingBenefits: "Employers may opt to payroll most benefits in kind through PAYE, eliminating the need for P11D reporting for those benefits. Registration required before the start of the tax year.",
      class1ANICs: "Employer Class 1A NICs at 13.8% due on benefits in kind reported on P11D or payrolled"
    },
    p60: {
      name: "P60 End of Year Certificate",
      description: "Annual statement provided to each employee showing total pay and deductions for the tax year",
      issueDeadline: "By 31 May following the end of the tax year",
      contents: [
        "Employee name and National Insurance number",
        "Tax code at year end",
        "Total pay and tax deducted in the tax year",
        "National Insurance contributions (employee and employer)",
        "Student loan and postgraduate loan deductions",
        "Statutory payments received",
        "Pension contributions"
      ],
      format: "May be issued electronically or in hard copy"
    },
    employerNICs: {
      rates: {
        class1Primary: "8% on earnings between primary threshold and upper earnings limit; 2% above UEL",
        class1Secondary: "13.8% on earnings above secondary threshold (no upper limit)",
        class1A: "13.8% on benefits in kind",
        class1B: "13.8% on items included in a PAYE Settlement Agreement",
        employmentAllowance: "Up to £10,500 per year for eligible employers to offset against employer NICs liability"
      },
      thresholds: {
        primaryThreshold: "£242 per week (2025/26)",
        upperEarningsLimit: "£967 per week (2025/26)",
        secondaryThreshold: "£175 per week (2025/26)",
        lowerEarningsLimit: "£125 per week (2025/26)"
      }
    },
    apprenticeshipLevy: {
      rate: "0.5% of total pay bill",
      allowance: "£15,000 annual allowance offsetting the levy (equivalent to a pay bill of £3 million)",
      applicability: "Employers with annual pay bill exceeding £3 million",
      reporting: "Reported through EPS on a monthly basis",
      digitalApprenticeshipService: "Levy funds available through the digital apprenticeship service for funding apprenticeship training"
    }
  },

  vat: {
    overview: "Value Added Tax is a consumption tax charged on most goods and services supplied in the UK by VAT-registered businesses",
    registration: {
      compulsoryThreshold: "£90,000 taxable turnover in rolling 12-month period (must register within 30 days)",
      voluntaryRegistration: "Businesses below the threshold may voluntarily register",
      deregistrationThreshold: "£88,000 - may deregister if taxable turnover falls below this level",
      groupRegistration: "Connected companies may form a VAT group with a single registration and representative member",
      divisionalRegistration: "Separate registration for divisions of a body corporate (by direction or request)"
    },
    returns: {
      frequency: "Quarterly VAT returns (monthly option available for regular repayment traders)",
      deadline: "1 month and 7 days after the end of the VAT period (electronic filing and payment)",
      annualAccounting: "Annual return scheme available for businesses with taxable turnover up to £1.35 million",
      flatRateScheme: "Simplified scheme for small businesses with taxable turnover up to £150,000 (to join)",
      cashAccounting: "Account for VAT on cash received/paid basis for businesses with taxable turnover up to £1.35 million",
      contents: [
        "Box 1: VAT due on sales and other outputs",
        "Box 2: VAT due on acquisitions from other EU member states (historical, pre-Brexit provisions)",
        "Box 3: Total VAT due (sum of Box 1 and Box 2)",
        "Box 4: VAT reclaimed on purchases and other inputs including imports",
        "Box 5: Net VAT to pay or reclaim",
        "Box 6: Total value of sales and other outputs excluding VAT",
        "Box 7: Total value of purchases and other inputs excluding VAT",
        "Box 8: Total value of supplies of goods to EU member states (historical)",
        "Box 9: Total value of acquisitions of goods from EU member states (historical)"
      ]
    },
    mtdObligations: {
      description: "Making Tax Digital for VAT requires VAT-registered businesses to keep digital records and submit VAT returns using compatible software",
      applicability: "All VAT-registered businesses regardless of turnover",
      requirements: [
        "Maintain digital records of all VAT transactions",
        "Use functional compatible software to record and submit VAT returns",
        "Digital links between software programs where multiple systems are used",
        "Submit VAT returns through MTD-compatible software via HMRC's API",
        "Preserve digital records for at least 6 years"
      ],
      digitalRecords: [
        "Business name, address, and VAT registration number",
        "Date, net value, and VAT rate for each supply made and received",
        "Total output tax and input tax for each return period",
        "Adjustments including partial exemption, capital goods scheme, and annual adjustments"
      ],
      penalties: {
        lateSubmission: "Points-based penalty system: 1 point per late return, penalty of £200 when threshold reached (threshold varies by return frequency)",
        latePayment: "Penalty calculated on outstanding tax: first penalty at day 16 (2% on tax outstanding), second penalty at day 31 (additional 2%), daily penalty at 4% per annum from day 31",
        interestCharges: "Late payment interest at Bank of England base rate plus 2.5%"
      }
    },
    rates: {
      standard: {
        rate: "20%",
        description: "Applied to most goods and services"
      },
      reduced: {
        rate: "5%",
        description: "Applied to specific goods and services including domestic fuel and power, children's car seats, smoking cessation products, and installation of energy-saving materials"
      },
      zero: {
        rate: "0%",
        description: "Applied to essential goods and services including most food items, children's clothing, books and newspapers, public transport, and new residential construction",
        note: "Zero-rated supplies are taxable supplies so input VAT is recoverable"
      },
      exempt: {
        description: "Certain supplies are exempt from VAT including financial services, insurance, education, health services, and land and buildings (with option to tax)",
        note: "Input VAT attributable to exempt supplies is generally not recoverable, subject to partial exemption rules"
      }
    },
    partialExemption: {
      description: "Businesses making both taxable and exempt supplies must apportion input VAT using the partial exemption method",
      standardMethod: "Input VAT apportioned based on the ratio of taxable to total supplies (excluding VAT)",
      specialMethods: "HMRC may agree a special partial exemption method that provides a fairer result",
      deMinimis: "If exempt input VAT is below de minimis limits (£625 per month on average and less than 50% of total input VAT), all input VAT is recoverable",
      annualAdjustment: "Annual adjustment required to compare provisional monthly/quarterly recovery with actual annual figures"
    },
    capitalGoodsScheme: {
      description: "Requires adjustments to initial VAT recovery on certain capital items over a specified period",
      items: [
        "Land and buildings (or parts thereof) with a value of £250,000 or more (adjustment period 10 years)",
        "Computers and computer equipment with a value of £50,000 or more (adjustment period 5 years)",
        "Aircraft, ships, and other vessels with a value of £50,000 or more (adjustment period 5 years)"
      ]
    },
    importVAT: {
      description: "VAT is charged on imports of goods into the UK",
      postponedAccounting: "Import VAT can be accounted for on the VAT return rather than paid at the border (postponed VAT accounting)",
      customsDeclarations: "Customs declarations required for goods imported from outside the UK"
    }
  },

  cis: {
    scheme: {
      description: "The Construction Industry Scheme (CIS) requires contractors in the construction industry to deduct tax from payments made to subcontractors and remit deductions to HMRC",
      applicability: "Contractors in the construction industry making payments to subcontractors for construction operations",
      constructionOperations: [
        "Site preparation and clearance",
        "Building work including alterations, repairs, extensions, and demolition",
        "Installation of heating, lighting, power, water, and ventilation systems",
        "Internal and external cleaning during construction",
        "Painting and decorating",
        "Civil engineering works",
        "Installation of telecommunications, security, and computer systems in the course of construction"
      ],
      excludedOperations: [
        "Professional work by architects, surveyors, and consultants",
        "Manufacturing and delivery of materials, plant, and machinery",
        "Work on oil and gas extraction",
        "Mining and tunnelling"
      ]
    },
    monthlyReturn: {
      name: "CIS300 Monthly Return",
      description: "Monthly return submitted by contractors declaring payments made to subcontractors and deductions applied",
      deadline: "19th of each month following the tax month (6th to 5th)",
      electronicDeadline: "22nd of each month for electronic payment",
      contents: [
        "Details of all subcontractors paid in the period",
        "Gross payment amounts",
        "Deductions made at applicable rate",
        "Net payment amounts",
        "Verification status of each subcontractor",
        "Nil return required if no payments made"
      ],
      penalties: {
        lateReturn: "£100 for each month up to 2 months late, £200 per month from 3-6 months late, then £300 or 5% of CIS deductions (whichever is higher) for 7-12 months late"
      }
    },
    deductionRates: {
      registered: {
        rate: "20%",
        description: "Standard deduction rate for subcontractors registered with CIS but not qualifying for gross payment status"
      },
      gross: {
        rate: "0%",
        description: "Gross payment status - no deductions. Subcontractor must meet turnover test, compliance test, and business test",
        turnoverTest: "Net construction turnover of £30,000 or more per year (excluding materials) for sole traders; higher thresholds for partnerships and companies",
        complianceTest: "Up-to-date tax returns, payments, and CIS returns",
        businessTest: "Business is carried on in the UK through a bank account; business is run largely through an account with a financial institution"
      },
      unregistered: {
        rate: "30%",
        description: "Higher deduction rate for subcontractors not registered with CIS"
      }
    },
    verification: {
      description: "Contractors must verify all subcontractors with HMRC before making first payment",
      methods: ["Online via HMRC's CIS online service", "Telephone verification with HMRC"],
      information: "HMRC will confirm the subcontractor's name, UTR, and applicable deduction rate"
    },
    auditRelevance: "CIS deductions affect both the contractor's liability reporting and the subcontractor's tax position. Auditors must verify proper application of CIS rules, correct deduction rates, timely filing of returns, and appropriate accounting treatment. CIS deductions suffered by subcontractors can be offset against their PAYE liability or CT liability."
  },

  rdRelief: {
    overview: "R&D tax relief incentivises UK companies to invest in innovation by providing enhanced deductions or tax credits for qualifying research and development expenditure",
    qualifyingCriteria: {
      description: "To qualify for R&D relief, a project must seek an advance in science or technology by resolving scientific or technological uncertainty",
      requirements: [
        "The project must seek to achieve an advance in overall knowledge or capability in a field of science or technology",
        "The advance must not be readily deducible by a competent professional in the field",
        "The project must involve the resolution of scientific or technological uncertainty",
        "Uncertainty exists when it is not readily deducible whether something is scientifically possible or technologically feasible"
      ],
      qualifyingExpenditure: [
        "Staff costs (salary, NIC, pension contributions) for employees directly engaged in R&D",
        "Externally provided workers engaged directly in R&D",
        "Consumable materials used up or transformed in R&D",
        "Software used directly in R&D",
        "Utilities (power, water, fuel) used directly in R&D",
        "Relevant payments to clinical trial volunteers",
        "Contributions to independent R&D",
        "Subcontracted R&D expenditure (subject to specific rules depending on scheme)"
      ]
    },
    mergedSchemeApril2024: {
      name: "Merged R&D Expenditure Credit Scheme",
      effectiveDate: "Accounting periods beginning on or after 1 April 2024",
      description: "Single merged scheme replacing the previous separate SME and RDEC schemes, providing a consistent above-the-line expenditure credit",
      creditRate: "20% of qualifying R&D expenditure (above-the-line credit)",
      effectiveBenefitRate: "Approximately 15% net benefit after corporation tax for profitable companies",
      accounting: "The credit is recognised above the line in profit and loss, either as a reduction in cost of sales, other income, or offset against tax liability",
      lossmaking: "Loss-making companies can claim a payable tax credit (net of corporation tax)",
      subcontracting: {
        inHouse: "Full relief on in-house R&D expenditure",
        subcontracted: "Relief limited to 65% of the payment to unconnected subcontractors for expenditure on externally provided workers",
        overseas: "Expenditure on overseas workers and subcontractors generally not qualifying unless specific conditions met"
      },
      intensiveCompanies: {
        description: "R&D intensive SMEs (R&D expenditure of 30% or more of total expenditure) receive enhanced support",
        enhancedRate: "Enhanced credit rate of 27% for qualifying R&D intensive companies",
        lossRelief: "Additional payable credit available for loss-making R&D intensive companies"
      },
      notification: "Companies must notify HMRC in advance of making their first R&D claim or after a gap in claims of more than 3 years. Notification must be within 6 months of the end of the accounting period.",
      additionalInformationForm: "All R&D claims must be accompanied by an Additional Information Form providing details of R&D projects, qualifying expenditure breakdown, and competent professional details"
    },
    smeScheme: {
      name: "SME R&D Relief (historical, for periods before 1 April 2024)",
      description: "Enhanced deduction scheme for small and medium-sized enterprises",
      enhancedDeduction: "86% additional deduction on qualifying expenditure (total deduction 186% for periods from 1 April 2023)",
      payableTaxCredit: "10% of surrenderable loss for loss-making SMEs (for periods from 1 April 2023)",
      smeDefinition: {
        employees: "Fewer than 500 staff",
        turnover: "Not more than EUR 100 million, or",
        balanceSheet: "Not more than EUR 86 million gross assets"
      },
      subsidisedExpenditure: "Where R&D is subsidised (e.g., by grants), SME scheme relief may be restricted and RDEC claimed instead",
      stateAidImplications: "SME R&D relief was subject to state aid rules (now subsidy control rules post-Brexit)"
    },
    rdec: {
      name: "R&D Expenditure Credit (historical, for periods before 1 April 2024)",
      description: "Above-the-line tax credit for large companies and SMEs with subsidised or subcontracted expenditure",
      creditRate: "20% for accounting periods beginning on or after 1 April 2023",
      accountingTreatment: "Recognised as income in profit and loss account before tax",
      netBenefit: "Approximately 15% net of corporation tax for profitable companies"
    },
    auditConsiderations: [
      "Verify that R&D claims meet the qualifying criteria (advance in science/technology, uncertainty)",
      "Check completeness and accuracy of qualifying expenditure calculations",
      "Assess whether the correct scheme has been applied (merged scheme, SME intensive, etc.)",
      "Verify notification and additional information form requirements have been met",
      "Review the accounting treatment of R&D credits (above the line, below the line, payable credits)",
      "Consider the impact of R&D claims on deferred tax calculations",
      "Assess the risk of HMRC enquiry into R&D claims",
      "Review subcontracting arrangements and their impact on qualifying expenditure",
      "Verify that R&D expenditure is not duplicated with capital allowances claims"
    ]
  },

  capitalAllowances: {
    overview: "Capital allowances provide tax relief for expenditure on qualifying plant and machinery, structures and buildings, and certain other capital assets used in a trade or business",
    aia: {
      name: "Annual Investment Allowance",
      amount: "£1,000,000 permanent annual limit",
      description: "100% first-year allowance on qualifying plant and machinery expenditure up to the AIA limit. Available to most businesses but limited to one AIA per group of companies.",
      exclusions: ["Cars", "Assets given to the business", "Assets purchased for non-business use"],
      groupRestriction: "One AIA shared between companies under common control or in the same group"
    },
    fullExpensing: {
      description: "100% first-year capital allowance for qualifying new (unused) plant and machinery from 1 April 2023",
      mainPoolAssets: "100% first-year allowance for main rate pool assets (general plant and machinery)",
      specialRateAssets: "50% first-year allowance for special rate pool assets (integral features, long-life assets)",
      conditions: [
        "Must be new and unused assets (not second-hand)",
        "Must be for use in a qualifying activity",
        "Must not be a car",
        "Companies only (not available to unincorporated businesses)"
      ],
      permanentStatus: "Made permanent from 1 April 2023 onwards"
    },
    mainPool: {
      name: "Main Rate Pool",
      rate: "18% writing down allowance per year on reducing balance",
      qualifyingItems: [
        "General plant and machinery",
        "Office equipment and furniture",
        "Computers and IT equipment",
        "Vans and trucks",
        "Tools and equipment",
        "Fixtures and fittings in commercial buildings",
        "Safety equipment",
        "Movable partitions"
      ]
    },
    specialRate: {
      name: "Special Rate Pool",
      rate: "6% writing down allowance per year on reducing balance",
      qualifyingItems: [
        "Integral features (electrical systems, cold water systems, space and water heating, lifts and escalators, external solar shading)",
        "Long-life assets (useful economic life of 25 years or more)",
        "Thermal insulation of buildings",
        "Cars with CO2 emissions exceeding 50g/km",
        "Certain fixtures in buildings that are integral features"
      ]
    },
    sba: {
      name: "Structures and Buildings Allowance",
      rate: "3% per year on a straight-line basis",
      qualifyingExpenditure: "Construction, renovation, or conversion costs of non-residential structures and buildings",
      period: "Relief available over approximately 33.33 years",
      conditions: [
        "Must be a non-residential structure or building",
        "Must be used for a qualifying activity",
        "Land cost excluded from qualifying expenditure",
        "SBA allowance statement must be obtained by the first owner",
        "Relief passes to subsequent owners on sale"
      ],
      exclusions: [
        "Residential property",
        "Land costs",
        "Planning permission costs (unless integral to construction)",
        "Items that qualify for plant and machinery allowances"
      ]
    },
    cars: {
      newLowEmission: {
        co2Threshold: "0g/km",
        allowance: "100% first-year allowance for zero emission cars"
      },
      mainRate: {
        co2Threshold: "Up to 50g/km",
        rate: "18% writing down allowance (main pool)"
      },
      specialRate: {
        co2Threshold: "Over 50g/km",
        rate: "6% writing down allowance (special rate pool)"
      },
      electricVehicles: "100% first-year allowance for new zero emission cars and zero emission goods vehicles"
    },
    balancingChargesAndAllowances: {
      description: "When an asset is sold or disposed of, a balancing adjustment may arise",
      balancingCharge: "Arises when disposal proceeds exceed the tax written down value of the pool, bringing the excess back into taxable profits",
      balancingAllowance: "Arises when a single-asset pool is disposed of for less than its tax written down value, giving relief for the shortfall",
      mainPoolException: "No balancing allowance on the main pool unless the trade ceases; small balance write-off available where pool balance is £1,000 or less"
    }
  },

  groupRelief: {
    overview: "Group relief allows trading losses and certain other amounts to be surrendered between companies in the same group",
    conditions: {
      groupDefinition: "75% parent-subsidiary relationship (ordinary share capital) either directly or indirectly",
      consortiumRelief: "Available for consortium-owned companies where each member holds at least 5% and collectively at least 75%",
      correspondingPeriods: "Relief only available for corresponding accounting periods of the claimant and surrendering company",
      surrenderableAmounts: [
        "Trading losses of the current period",
        "Excess property business losses",
        "Excess management expenses",
        "Excess charges on income",
        "Non-trading loan relationship deficits",
        "Qualifying charitable donations treated as charges"
      ]
    },
    restrictions: {
      amountRestriction: "Relief limited to the lower of the surrenderable amount and the claimant's available total profits",
      overlappingPeriods: "Where accounting periods do not coincide, amounts must be time-apportioned",
      ukPermanentEstablishment: "Non-UK resident companies can participate if they have a UK permanent establishment",
      crossBorderGroupRelief: "Limited cross-border group relief available in specific circumstances (Marks & Spencer ruling legacy)"
    },
    claimProcess: {
      timeLimit: "Claims must be made within 2 years of the end of the claimant company's accounting period",
      consent: "Both claimant and surrendering company must consent to the claim",
      ct600: "Claims submitted on the CT600 return (supplementary page CT600C)"
    }
  },

  transferPricing: {
    overview: "UK transfer pricing rules require transactions between connected parties to be priced at arm's length for tax purposes",
    legislation: "Part 4 of TIOPA 2010 (Taxation International and Other Provisions Act 2010)",
    scope: {
      connectedParties: "Companies under common control or where one has the ability to exercise control over the other",
      transactionsCovered: [
        "Sale and purchase of goods",
        "Provision of services",
        "Licensing of intellectual property",
        "Financing arrangements including intra-group loans",
        "Cost sharing and contribution arrangements",
        "Management charges"
      ],
      smeExemption: "Small enterprises (fewer than 50 employees and turnover/assets under EUR 10 million) are exempt. Medium enterprises (fewer than 250 employees) exempt unless transacting with entities in non-qualifying territories."
    },
    documentation: {
      requirement: "Large multinational groups must maintain contemporaneous transfer pricing documentation",
      countryByCountryReporting: "Groups with consolidated revenue of EUR 750 million or more must file CbCR with HMRC (UK parent) or notify HMRC of the reporting entity",
      masterFile: "High-level overview of the group's global operations, transfer pricing policies, and allocation of income and economic activity",
      localFile: "Detailed information about specific intercompany transactions involving UK entities",
      benchmarking: "Arm's length pricing supported by economic analysis and comparability studies"
    },
    advancePricingAgreements: "HMRC offers unilateral, bilateral, and multilateral APAs to provide certainty on transfer pricing arrangements",
    pillarTwoInteraction: "Transfer pricing outcomes feed into the Pillar Two GloBE calculations, so accurate transfer pricing is critical for both UK tax and top-up tax purposes"
  },

  sdlt: {
    fullName: "Stamp Duty Land Tax",
    overview: "SDLT is a tax on the purchase of land and property in England and Northern Ireland (Scotland has LBTT, Wales has LTT)",
    rates: {
      residential: {
        thresholds: [
          { band: "Up to £250,000", rate: "0%", note: "Standard nil-rate band" },
          { band: "£250,001 to £925,000", rate: "5%" },
          { band: "£925,001 to £1,500,000", rate: "10%" },
          { band: "Over £1,500,000", rate: "12%" }
        ],
        firstTimeBuyers: {
          nilRateBand: "£425,000",
          nextBand: "5% on portion from £425,001 to £625,000",
          restriction: "First-time buyer relief not available for purchases over £625,000"
        },
        additionalProperties: {
          surcharge: "5% surcharge on all bands for additional residential properties (second homes, buy-to-let)",
          refund: "Refund available if previous main residence sold within 36 months"
        },
        nonResident: {
          surcharge: "2% surcharge on all bands for non-UK resident purchasers of residential property"
        }
      },
      nonResidential: {
        thresholds: [
          { band: "Up to £150,000", rate: "0%" },
          { band: "£150,001 to £250,000", rate: "2%" },
          { band: "Over £250,000", rate: "5%" }
        ]
      },
      mixedUse: "Where a property includes both residential and non-residential elements, the non-residential rates apply"
    },
    filingAndPayment: {
      deadline: "SDLT return and payment due within 14 days of completion",
      electronicFiling: "Returns filed electronically through HMRC's SDLT online service",
      penalties: "£100 immediate penalty for late filing, £200 after 3 months, tax-geared penalty after 12 months"
    },
    reliefs: [
      "Multiple dwellings relief (abolished from 1 June 2024)",
      "Group relief for intra-group transfers",
      "Reconstruction and acquisition relief",
      "Charities relief",
      "Right to buy relief",
      "Compulsory purchase facilitation relief",
      "Shared ownership relief"
    ],
    auditRelevance: "SDLT must be correctly accounted for in property transactions. Auditors should verify correct rates applied, reliefs claimed, and timely filing. SDLT affects the carrying value of investment properties and should be considered in property acquisition accounting."
  },

  ated: {
    fullName: "Annual Tax on Enveloped Dwellings",
    description: "ATED is an annual charge on UK residential properties worth over £500,000 owned by non-natural persons (companies, partnerships with company members, collective investment schemes)",
    bands: [
      { propertyValue: "£500,001 to £1,000,000", annualCharge: "£4,400 (2025/26)" },
      { propertyValue: "£1,000,001 to £2,000,000", annualCharge: "£9,000 (2025/26)" },
      { propertyValue: "£2,000,001 to £5,000,000", annualCharge: "£30,550 (2025/26)" },
      { propertyValue: "£5,000,001 to £10,000,000", annualCharge: "£71,500 (2025/26)" },
      { propertyValue: "£10,000,001 to £20,000,000", annualCharge: "£143,550 (2025/26)" },
      { propertyValue: "Over £20,000,000", annualCharge: "£287,500 (2025/26)" }
    ],
    filingDeadline: "Returns due by 30 April at the start of each ATED period (1 April to 31 March)",
    paymentDeadline: "Payment due by 30 April at the start of the ATED period",
    reliefs: [
      "Property rental business relief",
      "Property development relief",
      "Property trading relief",
      "Farmhouses relief",
      "Registered social landlord relief",
      "Employee accommodation relief",
      "Open to the public relief"
    ],
    revaluation: "Properties must be revalued every 5 years for ATED purposes (current valuation date 1 April 2022)",
    relatedCGTCharge: "ATED-related capital gains are charged at 28% on disposal of ATED properties by non-natural persons (where not relieved)",
    auditRelevance: "Auditors must verify ATED compliance for companies holding UK residential property, ensure correct valuation band applied, and verify relief claims are properly supported"
  },

  source: "gov.uk/hmrc",
  lastVerified: "2026-03-12"
};


// =============================================================================
// 4. FCA DETAIL
// =============================================================================

export const FCA_DETAIL = {
  fullName: "Financial Conduct Authority",
  role: "The FCA is the conduct regulator for financial services firms and financial markets in the UK. It aims to ensure that financial markets work well for individuals, for businesses and for the economy as a whole, by regulating the conduct of approximately 50,000 firms.",
  objectives: {
    strategicObjective: "Ensuring that the relevant markets function well",
    operationalObjectives: [
      "Securing an appropriate degree of protection for consumers",
      "Protecting and enhancing the integrity of the UK financial system",
      "Promoting effective competition in the interests of consumers"
    ],
    secondaryObjective: "Facilitating the international competitiveness of the UK economy and its growth in the medium to long term"
  },
  handbook: {
    description: "The FCA Handbook contains the complete record of FCA legal instruments and sets out the detailed rules and guidance that firms must follow",
    structure: [
      "High Level Standards (PRIN, SYSC, COND, APER, COCON, FIT, GEN)",
      "Prudential Standards (GENPRU, BIPRU, MIPRU, IPRU, MIFIDPRU)",
      "Business Standards (COBS, ICOBS, MCOB, BCOBS, CASS, MAR)",
      "Regulatory Processes (SUP, DEPP, EG, AUTH, FEES, COLL, FUND, PROF)",
      "Redress (DISP, COMP)",
      "Specialist Sourcebooks (CONC, FPCOB)"
    ]
  },

  cass: {
    overview: "Client Assets sourcebook - rules governing how firms hold and protect client money and custody assets to ensure they are properly safeguarded",
    cass5ClientMoney: [
      "CASS 5.1 - Application: Applies to firms that receive or hold money in the course of or in connection with insurance mediation activity",
      "CASS 5.2 - Statutory trust: Client money is held on statutory trust for clients, separate from the firm's own money",
      "CASS 5.3 - Segregation: Client money must be segregated from firm money and held in designated client money accounts with approved banks",
      "CASS 5.4 - Client money calculations: Daily calculation to ensure adequate funds in client money accounts. Either the normal approach (accruals) or the alternative approach (received and paid) may be used",
      "CASS 5.5 - Records and accounts: Adequate records must be maintained to distinguish client money held for each client and from the firm's own money",
      "CASS 5.6 - Acknowledgement letters: Written acknowledgement must be obtained from each bank or third party holding client money confirming the terms of the arrangement and the trust status",
      "CASS 5.7 - Client money distribution: Rules for the distribution of client money in the event of a firm's failure, ensuring equitable distribution based on individual client entitlements",
      "CASS 5.8 - CASS resolution pack: Information required to facilitate orderly distribution of client money in the event of insolvency"
    ],
    cass6Custody: [
      "CASS 6.1 - Application and general provisions: Applies to firms that hold financial instruments belonging to clients (safe custody assets)",
      "CASS 6.2 - Holding of client assets: Client custody assets must be registered or held in accounts that are designated as client accounts and segregated from firm assets",
      "CASS 6.3 - Depositing assets with and using third party custodians: Due diligence required when selecting and appointing custodians. Regular assessment of custodian suitability and monitoring of arrangements.",
      "CASS 6.4 - Reconciliation of custody assets: Regular reconciliation of internal records with external records from custodians and registrars. Internal reconciliation at least every 10 business days; external reconciliation at least every 6 months.",
      "CASS 6.5 - Records, accounts and notifications: Adequate records identifying the nature and amount of all custody assets held for each client. Records must be sufficient to reconstruct each client's holding.",
      "CASS 6.6 - Use of safe custody assets: Firm must not use a client's safe custody assets for its own account or the account of another client without express prior consent. Stock lending arrangements must comply with specific conditions.",
      "CASS 6.7 - CASS resolution pack for custody assets: Information required to facilitate the orderly return of custody assets to clients in the event of firm failure",
      "CASS 6.8 - Mandate rules: Rules covering situations where a firm can control client assets without holding them, through having a mandate or standing authority"
    ],
    cass7ClientMoneyRules: {
      description: "CASS 7 contains the main client money rules for investment firms (non-insurance)",
      keyRequirements: [
        "Statutory trust over client money held by the firm",
        "Segregation of client money from firm money in designated client bank accounts",
        "Daily client money calculation (resource or requirement method)",
        "Client money acknowledgement letters from approved banks",
        "Adequate records and reconciliation procedures",
        "Client money distribution rules for primary pooling events",
        "CASS resolution pack maintained and regularly updated"
      ]
    },
    auditRequirements: {
      cassAuditReport: "Firms subject to the CASS rules must obtain an annual CASS audit report from their statutory auditor or an alternative CASS auditor",
      reportTypes: [
        "CASS large: Full scope CASS audit for firms holding £1 million or more in client money or £10 million or more in safe custody assets",
        "CASS medium: Intermediate scope CASS audit",
        "CASS small: Limited scope CASS audit for smaller firms"
      ],
      filingDeadline: "Filed with the FCA within 4 months of the firm's accounting reference date",
      scope: "The auditor reports on whether the firm has maintained adequate systems and controls to comply with CASS requirements throughout the year"
    }
  },

  sup3: {
    title: "SUP 3 - Auditors",
    auditorRequirements: [
      "Every firm required to appoint an auditor must ensure the auditor is eligible under the Companies Act 2006 and is registered with an RSB",
      "The firm must notify the FCA of the appointment of an auditor within 1 month",
      "The auditor must be given right of access to all information and explanations needed to perform the audit",
      "The firm must not appoint an auditor who is not independent as required by FRC Ethical Standard and the FCA's own rules",
      "The auditor has a statutory duty to report certain matters to the FCA under s342 FSMA 2000",
      "The auditor must report to the FCA any matter that gives reasonable cause to believe the firm has contravened requirements, is not meeting threshold conditions, or that information provided to the FCA is materially misleading",
      "The auditor's duty to report to the FCA overrides any duty of confidentiality to the client firm",
      "The firm must notify the FCA within 1 month if the auditor ceases to hold office, with reasons",
      "Auditors must have appropriate skills and experience in financial services audit",
      "The FCA may require a firm to commission a skilled person report under s166 FSMA (at the firm's cost)",
      "The auditor may be required to attend meetings with the FCA or provide additional information as requested"
    ],
    whistleblowing: {
      description: "Auditors have both a right and a duty to communicate information to the FCA",
      protectedDisclosure: "Auditors are protected from claims of breach of confidentiality when reporting to the FCA in good faith",
      mandatoryReporting: [
        "Breach of FCA requirements that is material to the regulator's functions",
        "Failure to meet threshold conditions for authorisation",
        "Matters of regulatory concern arising during the audit",
        "Material inaccuracies in regulatory returns",
        "Matters affecting the firm's ability to continue as a going concern where relevant to regulatory status"
      ]
    }
  },

  sup16: {
    title: "SUP 16 - Reporting Requirements",
    reportingRequirements: [
      "Annual audited financial statements submitted through Gabriel/RegData",
      "Regulatory capital adequacy returns (frequency depends on firm category)",
      "Client money and assets returns (CMAR - monthly for CASS large firms)",
      "Transaction reports under MiFIR Article 26",
      "Controllers and close links notifications",
      "Complaints data returns (biannual)",
      "Appointed representatives annual return",
      "Annual financial crime return",
      "Annual questionnaire for certain firm types",
      "Product sales data for relevant firms",
      "Retail Mediation Activities Return (RMAR) for intermediaries",
      "Section 166 skilled person reports when required by FCA"
    ],
    gabrielDeadlines: [
      "Annual financial return: 80 business days after accounting reference date (or 3 months for certain firms)",
      "Half-yearly financial return: 30 business days after half-year end",
      "Quarterly capital return: 20 business days after quarter end",
      "Monthly CMAR: 15 business days after month end",
      "Complaints return: 30 business days after half-year end",
      "Annual controllers report: 4 months after accounting reference date",
      "FIN return: 30 business days after quarter end for MIFIDPRU investment firms"
    ],
    regData: {
      description: "RegData has replaced the Gabriel reporting system for submission of regulatory returns to the FCA",
      features: [
        "Online submission portal for all regulatory returns",
        "Validation checks on submission",
        "Audit trail of submissions and amendments",
        "Automated reminders of upcoming deadlines"
      ]
    }
  },

  sysc: {
    title: "SYSC - Senior Management Arrangements, Systems and Controls",
    organisationalRequirements: [
      "SYSC 4 - General organisational requirements: Robust governance arrangements including clear organisational structure with well-defined, transparent and consistent lines of responsibility",
      "SYSC 5 - Employees, agents and other relevant persons: Adequate policies and procedures to ensure compliance by employees and agents",
      "SYSC 6 - Compliance, internal audit and financial crime: Compliance function, internal audit function (where proportionate), and adequate systems and controls to counter the risk of financial crime",
      "SYSC 7 - Risk control: Adequate risk management systems to identify, measure, manage and report all risks. Appropriate risk limits and risk monitoring.",
      "SYSC 8 - Outsourcing: When outsourcing critical or important operational functions, the firm must ensure the quality of the outsourced function is maintained and operational risk is not unduly increased",
      "SYSC 9 - Record-keeping: Adequate records of its business and internal organisation including all services, activities, transactions, and arrangements",
      "SYSC 10 - Conflicts of interest: Effective arrangements to identify and manage conflicts of interest including between the firm and its clients and between clients",
      "SYSC 12 - Group risk systems and controls: Appropriate systems and controls for managing risks at a group level",
      "SYSC 18 - Whistleblowing: Appropriate internal arrangements for employees to report concerns about potential regulatory breaches",
      "SYSC 19 - Remuneration requirements: Remuneration policies and practices consistent with effective risk management"
    ],
    smcr: {
      title: "Senior Managers and Certification Regime",
      description: "SMCR applies to all FCA solo-regulated firms (extended from banks in 2019)",
      components: {
        seniorManagers: "Individuals performing senior management functions must be approved by the FCA. Each SMF has a Statement of Responsibilities.",
        certificationRegime: "Firms must certify annually that employees performing certification functions are fit and proper",
        conductRules: "Basic conduct rules apply to all staff; senior management conduct rules apply to SMFs"
      },
      seniorManagementFunctions: [
        "SMF1 - Chief Executive function",
        "SMF2 - Chief Finance function",
        "SMF3 - Executive Director",
        "SMF9 - Chair",
        "SMF10 - Chair of Risk Committee",
        "SMF11 - Chair of Audit Committee",
        "SMF12 - Chair of Remuneration Committee",
        "SMF13 - Chair of Nominations Committee",
        "SMF14 - Senior Independent Director",
        "SMF16 - Compliance Oversight",
        "SMF17 - Money Laundering Reporting Officer",
        "SMF21 - EEA Branch Senior Manager",
        "SMF24 - Chief Operations function",
        "SMF27 - Partner",
        "SMF29 - Limited Scope function"
      ],
      conductRules: {
        individual: [
          "Rule 1: Act with integrity",
          "Rule 2: Act with due skill, care and diligence",
          "Rule 3: Be open and cooperative with the FCA, PRA and other regulators",
          "Rule 4: Pay due regard to the interests of customers and treat them fairly",
          "Rule 5: Observe proper standards of market conduct"
        ],
        seniorManager: [
          "SC1: Take reasonable steps to ensure the business is controlled effectively",
          "SC2: Take reasonable steps to ensure the business complies with regulatory requirements",
          "SC3: Take reasonable steps to ensure any delegation of responsibilities is to an appropriate person and oversee discharge effectively",
          "SC4: Disclose information to the FCA of which the FCA would reasonably expect notice"
        ]
      }
    }
  },

  prin: {
    title: "PRIN - Principles for Businesses",
    description: "The FCA's Principles for Businesses are fundamental obligations that all authorised firms must observe. They are expressed in general terms and serve as the foundation for FCA regulation.",
    principlesForBusiness: [
      {
        number: 1,
        name: "Integrity",
        text: "A firm must conduct its business with integrity"
      },
      {
        number: 2,
        name: "Skill, care and diligence",
        text: "A firm must conduct its business with due skill, care and diligence"
      },
      {
        number: 3,
        name: "Management and control",
        text: "A firm must take reasonable care to organise and control its affairs responsibly and effectively, with adequate risk management systems"
      },
      {
        number: 4,
        name: "Financial prudence",
        text: "A firm must maintain adequate financial resources"
      },
      {
        number: 5,
        name: "Market conduct",
        text: "A firm must observe proper standards of market conduct"
      },
      {
        number: 6,
        name: "Customers' interests",
        text: "A firm must pay due regard to the interests of its customers and treat them fairly"
      },
      {
        number: 7,
        name: "Communications with clients",
        text: "A firm must pay due regard to the information needs of its clients, and communicate information to them in a way which is clear, fair and not misleading"
      },
      {
        number: 8,
        name: "Conflicts of interest",
        text: "A firm must manage conflicts of interest fairly, both between itself and its customers and between a customer and another client"
      },
      {
        number: 9,
        name: "Customers: relationships of trust",
        text: "A firm must take reasonable care to ensure the suitability of its advice and discretionary decisions for any customer who is entitled to rely upon its judgement"
      },
      {
        number: 10,
        name: "Clients' assets",
        text: "A firm must arrange adequate protection for clients' assets when it is responsible for them"
      },
      {
        number: 11,
        name: "Relations with regulators",
        text: "A firm must deal with its regulators in an open and cooperative way, and must disclose to the FCA appropriately anything relating to the firm of which that regulator would reasonably expect notice"
      },
      {
        number: 12,
        name: "Consumer Duty",
        text: "A firm must act to deliver good outcomes for retail customers. This cross-cutting consumer duty overarching principle was introduced in July 2023 and requires firms to put consumer outcomes at the heart of their business.",
        effectiveDate: "31 July 2023 for new and existing products/services; 31 July 2024 for closed products/services",
        keyElements: [
          "Consumer understanding outcome - communications support and enable consumers to make effective, timely and properly informed decisions",
          "Products and services outcome - products and services are designed to meet the needs, characteristics and objectives of a target group of consumers",
          "Price and value outcome - the price of products and services represents fair value",
          "Consumer support outcome - firms provide a level of support that meets consumers' needs"
        ]
      }
    ]
  },

  consumerDuty: {
    title: "FCA Consumer Duty (PS22/9 — Principle 12)",
    description: "The Consumer Duty sets higher and clearer standards of consumer protection across financial services. It requires firms to act to deliver good outcomes for retail customers. The Duty comprises the Consumer Principle (Principle 12), cross-cutting rules, and four outcomes.",
    reference: "PS22/9",
    principle: {
      number: 12,
      name: "Consumer Duty",
      text: "A firm must act to deliver good outcomes for retail customers."
    },
    effectiveDates: {
      newAndExistingProducts: "31 July 2023",
      closedProducts: "31 July 2024",
      description: "The Duty applied from 31 July 2023 for new and existing products and services open to sale or renewal. From 31 July 2024 it extends to closed products and services no longer available for sale or renewal."
    },
    crossCuttingRules: [
      {
        rule: "Act in good faith",
        description: "Firms must act in good faith toward retail customers. This is an overarching behavioural standard requiring firms to act consistently with reasonable expectations of retail customers.",
        auditConsiderations: [
          "Review policies and procedures for evidence of good faith principles embedded in decision-making",
          "Assess whether product governance processes consider customer interests at each stage of the product lifecycle",
          "Evaluate incentive structures for evidence they do not conflict with acting in good faith"
        ]
      },
      {
        rule: "Avoid causing foreseeable harm",
        description: "Firms must avoid causing foreseeable harm to retail customers. Firms should not act in ways — or fail to act — where doing so could reasonably be foreseen to cause harm.",
        auditConsiderations: [
          "Review risk assessments for identification of potential customer harms",
          "Assess whether the firm has adequate processes to identify, monitor, and mitigate foreseeable harms",
          "Evaluate complaints data and root cause analysis for patterns indicating foreseeable harm"
        ]
      },
      {
        rule: "Enable and support customers to pursue their financial objectives",
        description: "Firms must enable and support retail customers to pursue their financial objectives. This includes ensuring that customers can act in their own interests.",
        auditConsiderations: [
          "Assess whether customer journeys support informed decision-making at key interaction points",
          "Evaluate whether vulnerable customer policies are adequate and implemented effectively",
          "Review processes for enabling customers to switch or exit products without unreasonable barriers"
        ]
      }
    ],
    outcomes: [
      {
        outcome: "Products and Services",
        reference: "PRIN 2A.2 / FG22/5 Chapter 4",
        description: "Products and services are designed to meet the needs, characteristics and objectives of a specified target market of customers.",
        requirements: [
          "Manufacturers must identify a target market at a sufficiently granular level",
          "Product approval processes must assess whether the product meets the identified needs of the target market",
          "Distribution strategy must be appropriate for the target market",
          "Products must be reviewed throughout their lifecycle to ensure they continue to meet target market needs"
        ],
        auditConsiderations: [
          "Review product governance framework and target market assessments",
          "Test whether products approved during the year had documented target market analysis",
          "Assess distribution arrangements for alignment with identified target markets",
          "Evaluate product review cycle and evidence of ongoing monitoring"
        ]
      },
      {
        outcome: "Price and Value",
        reference: "PRIN 2A.3 / FG22/5 Chapter 5",
        description: "The price of products and services represents fair value for retail customers. There must be a reasonable relationship between the price paid and the benefit received.",
        requirements: [
          "Fair value assessments must be conducted for each product and service",
          "Assessments must consider all elements of price including non-financial costs such as time and effort",
          "Firms must consider the value provided to different groups of customers including vulnerable customers",
          "Manufacturing and distribution charges in the value chain must be assessed for cumulative impact on value"
        ],
        auditConsiderations: [
          "Review fair value assessment methodology and documentation",
          "Assess whether all cost components are included in value assessments",
          "Evaluate differential pricing and whether value is delivered across all customer cohorts",
          "Test whether remediation has been triggered where poor value is identified"
        ]
      },
      {
        outcome: "Consumer Understanding",
        reference: "PRIN 2A.4 / FG22/5 Chapter 6",
        description: "Communications equip consumers to make effective, timely and properly informed decisions about financial products and services.",
        requirements: [
          "Communications must be clear, fair and not misleading, with key information prominent",
          "Firms must tailor communications to the characteristics of the target market including any identified vulnerabilities",
          "Timing of communications must support effective decision-making",
          "Firms must test and monitor whether communications are achieving consumer understanding"
        ],
        auditConsiderations: [
          "Review sample of customer-facing communications for clarity and prominence of key information",
          "Assess consumer testing evidence and whether results drive improvements",
          "Evaluate whether communications are tailored for identified vulnerable customer groups",
          "Test whether communications are timed to support key decision points in the customer journey"
        ]
      },
      {
        outcome: "Consumer Support",
        reference: "PRIN 2A.5 / FG22/5 Chapter 7",
        description: "Firms provide a level of support that meets consumers' needs throughout the lifecycle of the product or service.",
        requirements: [
          "Support must enable customers to realise the benefits of the product and act in their own interests",
          "Support processes must not create unreasonable barriers for customers including those wishing to switch or exit",
          "The same level of support must be available to customers seeking to complain, switch, cancel or claim as to those purchasing",
          "Firms must take account of the needs of customers with characteristics of vulnerability"
        ],
        auditConsiderations: [
          "Evaluate customer support channel availability and accessibility across the product lifecycle",
          "Test average response times and compare purchase journey support to post-sale and exit support",
          "Review complaints data for evidence of unreasonable barriers to switching, cancelling or claiming",
          "Assess vulnerable customer support processes and staff training adequacy"
        ]
      }
    ],
    monitoringRequirements: {
      outcomesTesting: {
        description: "Firms must monitor and regularly review outcomes being received by customers across all four outcome areas.",
        requirements: [
          "Regular outcomes testing using appropriate data and MI",
          "Testing must cover all products and services and all four outcomes",
          "Identification and remediation of any poor outcomes",
          "Root cause analysis where poor outcomes are identified"
        ]
      },
      miDashboards: {
        description: "Firms should maintain management information dashboards that provide senior leadership with visibility of customer outcomes.",
        requirements: [
          "MI must cover each of the four Consumer Duty outcomes",
          "MI should include lead and lag indicators of potential harm",
          "Appropriate data sources including complaints, product performance, value assessments, and communications testing results",
          "Regular reporting cadence with escalation triggers for adverse trends"
        ]
      },
      boardReporting: {
        description: "The board (or equivalent governing body) must review and approve an annual assessment of the firm's compliance with the Consumer Duty.",
        requirements: [
          "Annual board report on Consumer Duty compliance",
          "Assessment must cover delivery of good outcomes across all four outcome areas",
          "Board must satisfy itself that actions are being taken to address any identified shortcomings",
          "Board members must have adequate understanding of Consumer Duty requirements"
        ]
      }
    }
  },

  cobs: {
    title: "COBS - Conduct of Business Sourcebook",
    conductOfBusiness: [
      {
        section: "COBS 2 - Conduct of business obligations",
        requirements: [
          "Acting honestly, fairly and professionally in the best interests of clients",
          "Fair, clear and not misleading communications",
          "Information disclosure to clients about services, costs and associated risks",
          "Client categorisation (retail, professional, eligible counterparty)"
        ]
      },
      {
        section: "COBS 4 - Communicating with clients",
        requirements: [
          "Financial promotions must be fair, clear and not misleading",
          "Adequate risk warnings on investment products",
          "Past performance disclaimers and presentation rules",
          "Restrictions on cold calling",
          "Social media and digital communications standards"
        ]
      },
      {
        section: "COBS 6 - Information about the firm and compensation information",
        requirements: [
          "Disclosure of firm status, regulatory authorisation, and services provided",
          "Costs and charges disclosure including all product costs and service charges",
          "Disclosure of inducements received or paid",
          "Compensation scheme information (FSCS coverage)"
        ]
      },
      {
        section: "COBS 9 - Suitability",
        requirements: [
          "Suitability assessment required before making personal recommendations",
          "Knowledge and experience assessment",
          "Financial situation assessment including ability to bear losses",
          "Investment objectives and risk tolerance assessment",
          "Suitability report to retail clients explaining recommendation"
        ]
      },
      {
        section: "COBS 10 - Appropriateness",
        requirements: [
          "Appropriateness assessment for non-advised services",
          "Assessment of client's knowledge and experience relevant to the specific product",
          "Warning if product deemed not appropriate",
          "Execution-only exemptions for non-complex instruments"
        ]
      },
      {
        section: "COBS 11 - Dealing and managing",
        requirements: [
          "Best execution obligations",
          "Client order handling and aggregation rules",
          "Allocation of aggregated orders on a fair basis",
          "Personal account dealing restrictions for relevant persons"
        ]
      },
      {
        section: "COBS 14 - Providing product information to clients",
        requirements: [
          "Key Information Documents (KIDs) for PRIIPs",
          "Key Features Documents for certain products",
          "Cancellation rights information",
          "Ongoing reporting to clients on portfolio positions and costs"
        ]
      }
    ]
  },

  mifidpru: {
    title: "MIFIDPRU - Prudential Sourcebook for MiFID Investment Firms",
    effectiveDate: "1 January 2022",
    description: "MIFIDPRU implements the UK Investment Firms Prudential Regime (IFPR) for FCA-regulated investment firms, replacing previous prudential sourcebooks",
    capitalRequirements: {
      permanentMinimumCapital: {
        sniFirm: "£75,000 for small and non-interconnected (SNI) firms",
        nonSniFirm: "£150,000 for non-SNI firms that do not hold client money or assets",
        fullScope: "£750,000 for firms that deal on own account or underwrite",
        description: "Minimum capital requirement based on firm's permissions and activities"
      },
      fixedOverheadRequirement: {
        description: "One quarter of the firm's relevant fixed overheads expenditure from the most recent audited annual financial statements",
        calculation: "Total expenses from P&L less variable costs (discretionary bonuses, profit shares, shared commission, interest paid, losses on trading) divided by 4",
        applicability: "All MIFIDPRU investment firms"
      },
      kFactorRequirement: {
        description: "Risk-based capital requirement calculated using K-factors reflecting client, market, and firm risks",
        clientRisk: [
          "K-AUM: Assets under management",
          "K-CMH: Client money held",
          "K-ASA: Assets safeguarded and administered",
          "K-COH: Client orders handled"
        ],
        marketRisk: [
          "K-NPR: Net position risk (standardised approach)",
          "K-CMG: Clearing margin given (alternative approach)"
        ],
        firmRisk: [
          "K-TCD: Trading counterparty default",
          "K-DTF: Daily trading flow",
          "K-CON: Concentration risk"
        ]
      },
      ownFundsThresholdRequirement: {
        description: "The own funds requirement is the highest of: permanent minimum capital, fixed overhead requirement, and K-factor requirement",
        ownFundsComposition: {
          cet1: "Common Equity Tier 1 capital - share capital, share premium, retained earnings, other reserves",
          at1: "Additional Tier 1 - perpetual instruments meeting AT1 criteria",
          tier2: "Tier 2 capital - subordinated debt and instruments meeting Tier 2 criteria"
        }
      }
    },
    liquidityRequirements: {
      basicRequirement: "One third of the fixed overhead requirement held in liquid assets",
      liquidAssets: [
        "Cash held at central banks",
        "Cash held at authorised credit institutions (subject to restrictions)",
        "Short-term government bonds (UK gilts)",
        "Money market fund shares meeting specific criteria"
      ],
      windDownTrigger: "Firms must plan for adequate liquidity to fund an orderly wind-down"
    },
    concentrationRisk: {
      description: "Limits on exposure to a single counterparty or group of connected counterparties",
      limit: "25% of own funds for exposure to a single counterparty or group",
      reporting: "Large exposures exceeding 10% of own funds must be reported"
    },
    icara: {
      name: "Internal Capital Adequacy and Risk Assessment",
      description: "Firms must conduct an ICARA to assess whether their own funds and liquid assets are adequate given the nature and risk of their business",
      components: [
        "Assessment of material harms the firm could cause",
        "Evaluation of whether own funds adequately cover risks",
        "Stress testing and scenario analysis",
        "Recovery and wind-down planning",
        "Documentation of assessment methodology and conclusions"
      ]
    },
    reporting: {
      mifReturn: "MIF001 - quarterly own funds and capital requirements return",
      annualReport: "Annual ICARA submission to FCA on request",
      publicDisclosure: "Annual public disclosure of risk management, own funds, and remuneration policies"
    }
  },

  source: "handbook.fca.org.uk",
  lastVerified: "2026-03-12"
};


// =============================================================================
// 5. PRA DETAIL
// =============================================================================

export const PRA_DETAIL = {
  fullName: "Prudential Regulation Authority",
  role: "The PRA is part of the Bank of England and is responsible for the prudential regulation and supervision of banks, building societies, credit unions, insurers and major investment firms. Its primary objective is to promote the safety and soundness of the firms it regulates, with an additional objective for insurance firms to contribute to securing an appropriate degree of protection for policyholders.",
  supervisedFirms: "Approximately 1,500 firms including banks, building societies, credit unions, insurers, and PRA-designated investment firms",
  supervisoryApproach: {
    description: "The PRA uses a forward-looking, judgement-based supervisory approach. It assesses firms against the risk they pose to the PRA's objectives and focuses supervisory resources on the most significant firms.",
    categories: [
      "Category 1: Firms whose size, interconnectedness and complexity mean failure would have the greatest impact on financial stability and/or policyholders",
      "Category 2: Firms whose failure could have a significant impact, though less than Category 1",
      "Category 3: Firms whose failure could have some impact on financial stability and/or policyholders",
      "Category 4: Smaller firms whose failure would have a limited impact",
      "Category 5: Firms in run-off or being wound down"
    ],
    proactiveSupervisoryMonitoring: "Continuous assessment of firm viability, business model sustainability, and risk management effectiveness"
  },

  capitalRequirements: {
    overview: "The PRA implements the Basel III framework for banking capital requirements through the Capital Requirements Regulation (CRR) and PRA Rulebook",
    cet1: {
      name: "Common Equity Tier 1 Capital",
      minimumRatio: "4.5% of risk-weighted assets",
      components: [
        "Ordinary shares (fully paid up)",
        "Share premium accounts",
        "Retained earnings",
        "Accumulated other comprehensive income",
        "Other reserves"
      ],
      deductions: [
        "Goodwill and other intangible assets",
        "Deferred tax assets that rely on future profitability",
        "Investments in own CET1 instruments",
        "Defined benefit pension fund assets (net of associated deferred tax liability)",
        "Significant investments in financial sector entities exceeding thresholds"
      ],
      qualityCriteria: "CET1 must be the highest quality capital - fully loss-absorbing, permanent, with no fixed maturity and no incentive to redeem"
    },
    at1: {
      name: "Additional Tier 1 Capital",
      minimumRatio: "1.5% of risk-weighted assets",
      components: [
        "Perpetual instruments with no fixed maturity",
        "Instruments with discretionary, non-cumulative distributions",
        "Instruments that convert to CET1 or are written down at a trigger point (usually 7% CET1 ratio)"
      ],
      features: [
        "Must be perpetual with no incentive to redeem",
        "Distributions must be fully discretionary and non-cumulative",
        "Must contain a loss absorption mechanism (conversion or write-down)",
        "Trigger point for loss absorption at 7% CET1 ratio for going-concern instruments",
        "Call option only after minimum 5 years, subject to PRA approval"
      ]
    },
    tier2: {
      name: "Tier 2 Capital",
      minimumRatio: "2% of risk-weighted assets",
      components: [
        "Subordinated debt instruments with original maturity of at least 5 years",
        "Instruments that amortise on a straight-line basis during the last 5 years before maturity",
        "General credit risk adjustments (standard approach) up to 1.25% of credit risk-weighted assets"
      ],
      features: [
        "Subordinated to depositors and general creditors",
        "Minimum original maturity of 5 years",
        "Amortisation in final 5 years reduces regulatory recognition",
        "No incentive to redeem before maturity",
        "Call option after 5 years subject to PRA approval"
      ]
    },
    buffers: [
      {
        name: "Capital Conservation Buffer (CCoB)",
        rate: "2.5% of RWAs",
        capitalType: "CET1",
        description: "Designed to ensure firms build up capital outside periods of stress that can be drawn upon during periods of stress. Distribution restrictions apply when breached."
      },
      {
        name: "Countercyclical Capital Buffer (CCyB)",
        rate: "Variable, set by the FPC (currently 2% for UK exposures)",
        capitalType: "CET1",
        description: "Set by the Financial Policy Committee (FPC) based on assessment of systemic risks. Varies between 0% and 2.5% (or higher in exceptional circumstances). Designed to ensure the banking system has sufficient capital to maintain credit supply in downturns.",
        fpSetting: "The FPC reviews the CCyB rate quarterly and may adjust based on credit growth, leverage indicators, and other systemic risk measures"
      },
      {
        name: "Global Systemically Important Institution (G-SII) Buffer",
        rate: "1% to 3.5% depending on systemic importance score",
        capitalType: "CET1",
        description: "Additional buffer for globally systemically important banks based on BCBS methodology. UK G-SIIs include HSBC, Barclays, and Standard Chartered.",
        buckets: [
          { bucket: 1, rate: "1.0%" },
          { bucket: 2, rate: "1.5%" },
          { bucket: 3, rate: "2.0%" },
          { bucket: 4, rate: "2.5%" },
          { bucket: 5, rate: "3.5%" }
        ]
      },
      {
        name: "Other Systemically Important Institution (O-SII) Buffer",
        rate: "Up to 3% of RWAs",
        capitalType: "CET1",
        description: "Buffer for domestically systemically important institutions that are not G-SIIs"
      },
      {
        name: "Systemic Risk Buffer (SRB)",
        rate: "Variable, currently applicable to ring-fenced bodies",
        capitalType: "CET1",
        description: "Applied to ring-fenced banks and building societies based on their total assets. Rates range from 0% to 3% based on total assets thresholds."
      },
      {
        name: "PRA Buffer (Pillar 2B)",
        rate: "Firm-specific, set by PRA as part of supervisory review",
        capitalType: "CET1",
        description: "Confidential buffer set as part of the PRA's supervisory review and evaluation process. Covers risks not fully captured by Pillar 1 and the systemic buffers."
      }
    ],
    pillar2A: {
      description: "Additional capital requirements set by the PRA following supervisory review (SREP) to cover risks not adequately captured by Pillar 1",
      risksCovered: [
        "Credit concentration risk",
        "Interest rate risk in the banking book (IRRBB)",
        "Pension obligation risk",
        "Operational risk not captured by Pillar 1",
        "Market risk model deficiencies",
        "Securitisation risks",
        "Settlement risk"
      ],
      setting: "Firm-specific, determined through PRA's internal capital adequacy assessment and supervisory review process"
    },
    riskWeightedAssets: {
      creditRisk: {
        standardisedApproach: "Risk weights assigned based on asset class and external credit ratings",
        internalRatingsBased: "Foundation IRB and Advanced IRB using internal models to estimate probability of default, loss given default, and exposure at default",
        assetClasses: [
          "Central governments and central banks",
          "Institutions (banks and investment firms)",
          "Corporates",
          "Retail",
          "Secured by mortgages on immovable property",
          "Exposures in default",
          "Equity exposures",
          "Securitisation positions"
        ]
      },
      marketRisk: {
        standardisedApproach: "Prescribed risk weights for interest rate, equity, foreign exchange, and commodity positions",
        internalModelsApproach: "VaR and stressed VaR models subject to PRA approval",
        fundamentalReviewOfTradingBook: "Implementation of Basel 3.1 revised market risk framework (FRTB)"
      },
      operationalRisk: {
        basicIndicator: "15% of average gross income over 3 years",
        standardised: "12-18% of gross income by business line",
        advancedMeasurement: "Internal models (being replaced by standardised measurement approach under Basel 3.1)"
      }
    }
  },

  liquidity: {
    lcr: {
      name: "Liquidity Coverage Ratio",
      requirement: "100% minimum - stock of high-quality liquid assets must be at least equal to total net cash outflows over a 30-day stress scenario",
      hqla: {
        level1: {
          description: "Cash, central bank reserves, certain sovereign bonds",
          haircut: "0%",
          examples: ["Cash", "Central bank reserves", "UK gilts", "Other qualifying sovereign bonds with 0% risk weight"]
        },
        level2a: {
          description: "Certain sovereign, covered bond, and corporate debt securities",
          haircut: "15%",
          cap: "Maximum 40% of total HQLA",
          examples: ["Government bonds with 20% risk weight", "Qualifying covered bonds", "Corporate bonds rated AA- or better"]
        },
        level2b: {
          description: "Lower quality corporate bonds, RMBS, and certain equities",
          haircut: "25-50%",
          cap: "Maximum 15% of total HQLA",
          examples: ["Corporate bonds rated A+ to BBB-", "Qualifying RMBS", "Common equity shares in major indices"]
        }
      },
      cashOutflows: [
        "Retail deposit run-off (stable: 5%, less stable: 10%, high run-off: higher rates)",
        "Unsecured wholesale funding outflows (operational: 25%, non-operational: various rates up to 100%)",
        "Secured funding outflows (rate depends on collateral quality)",
        "Additional liquidity needs from derivative exposures",
        "Committed credit and liquidity facilities drawdowns"
      ],
      cashInflows: "Capped at 75% of total outflows to ensure minimum HQLA holding"
    },
    nsfr: {
      name: "Net Stable Funding Ratio",
      requirement: "100% minimum - available stable funding must be at least equal to required stable funding over a 1-year horizon",
      availableStableFunding: [
        "Regulatory capital instruments (100% ASF factor)",
        "Stable retail deposits (95% ASF factor)",
        "Less stable retail deposits (90% ASF factor)",
        "Wholesale funding with residual maturity of 1 year or more (100% ASF factor)",
        "Operational deposits (50% ASF factor)",
        "Other wholesale funding less than 1 year (0-50% ASF factor)"
      ],
      requiredStableFunding: [
        "Cash and central bank reserves (0% RSF factor)",
        "Performing loans to financial institutions less than 6 months (10-15% RSF factor)",
        "Performing loans to non-financial corporates over 1 year (65-85% RSF factor)",
        "Residential mortgages (65% RSF factor)",
        "Other assets (various RSF factors up to 100%)",
        "Off-balance sheet exposures (5% RSF factor for committed credit facilities)"
      ]
    },
    internalLiquidityAdequacy: {
      name: "Internal Liquidity Adequacy Assessment Process (ILAAP)",
      description: "Firms must conduct an ILAAP to assess whether their liquidity resources are adequate",
      components: [
        "Assessment of overall liquidity adequacy",
        "Liquidity stress testing under multiple scenarios",
        "Identification of liquidity risk drivers",
        "Assessment of intraday liquidity needs",
        "Contingency funding plan",
        "Documentation of governance and controls over liquidity risk"
      ]
    }
  },

  leverageRatio: {
    requirement: "3.25% minimum for major UK firms (Tier 1 capital as a percentage of total leverage exposure)",
    additionalBuffer: "Countercyclical leverage ratio buffer (currently 35% of the CCyB rate) and G-SII leverage ratio buffer (35% of the G-SII capital buffer rate)",
    exposureMeasure: "Total on-balance sheet assets plus off-balance sheet exposures (loan commitments, letters of credit, derivatives exposure measure, securities financing transactions)",
    supplementary: "The leverage ratio serves as a backstop to the risk-weighted capital framework, preventing excessive leverage regardless of risk weights"
  },

  mrel: {
    fullName: "Minimum Requirement for own funds and Eligible Liabilities",
    description: "MREL ensures that banks and building societies have sufficient loss-absorbing capacity to support an orderly resolution without recourse to public funds",
    settingAuthority: "Set by the Bank of England as UK resolution authority",
    components: {
      lossAbsorption: "Amount needed to absorb losses in resolution (typically equal to minimum capital requirements)",
      recapitalisation: "Amount needed to restore capital ratios post-resolution to a level sufficient to maintain market confidence and authorisation"
    },
    eligibleInstruments: [
      "CET1 capital instruments",
      "AT1 capital instruments",
      "Tier 2 capital instruments",
      "Senior unsecured debt meeting eligibility criteria (minimum 1 year residual maturity, issued by resolution entity, governed by UK law or containing contractual recognition of bail-in)"
    ],
    calibration: {
      gSIIs: "2 x (Pillar 1 + Pillar 2A) plus applicable capital buffers",
      otherSystemicallyImportant: "2 x (Pillar 1 + Pillar 2A) plus applicable capital buffers",
      otherFirms: "Set at a firm-specific level based on resolution strategy",
      transitionPeriods: "Firms have been given transition periods to build up MREL resources"
    }
  },

  stressTesting: {
    annualCyclicalScenario: {
      description: "The Bank of England conducts an annual concurrent stress test of the major UK banks",
      participants: "Typically the 8 largest UK banks and building societies",
      scenarios: {
        baseline: "Central economic forecast scenario",
        adverse: "Severe but plausible economic downturn scenario designed by the Bank of England",
        exploratory: "Additional scenarios exploring specific risks (e.g., climate change, cyber risk)"
      },
      outputs: [
        "Impact on CET1 capital ratio",
        "Impact on leverage ratio",
        "Impact on profitability",
        "Impact on risk-weighted assets",
        "Assessment of capital adequacy under stress",
        "Qualitative assessment of stress testing capabilities"
      ],
      consequences: "Results may inform PRA buffer settings and capital distribution restrictions"
    },
    firmSpecific: {
      description: "Firms must conduct their own internal stress testing as part of ICAAP/ILAAP",
      requirements: [
        "Board-approved stress testing framework",
        "Range of scenarios including severe but plausible",
        "Reverse stress testing to identify business model breaking points",
        "Integration of stress testing results into capital and liquidity planning",
        "Regular review and update of stress testing methodology"
      ]
    }
  },

  solvencyII: {
    overview: "Solvency II is the prudential framework for insurance and reinsurance undertakings. The UK retained the Solvency II framework post-Brexit and is implementing reforms through the Solvency UK regime.",
    solvencyUKReforms: {
      description: "Reforms to the UK Solvency II regime to make it more tailored to UK market conditions",
      keyChanges: [
        "Reduction in risk margin (approximately 65% reduction)",
        "Reform of matching adjustment including broadening eligible assets",
        "Introduction of new investment flexibility for infrastructure and green projects",
        "Enhanced role of PRA in supervising model approval",
        "Simplified solvency requirements for smaller insurers",
        "New mobilisation regime for new entrants"
      ]
    },
    scr: {
      name: "Solvency Capital Requirement",
      description: "The SCR is the amount of capital required to ensure the insurer can meet its obligations over the next 12 months with a confidence level of 99.5% (1-in-200 year event)",
      calculation: {
        standardFormula: "Prescribed calculation using risk modules: market risk, counterparty default risk, life underwriting risk, non-life underwriting risk, health underwriting risk, and operational risk",
        internalModel: "Firm-specific model approved by PRA that better reflects the firm's risk profile",
        partialInternalModel: "Combination of standard formula and internal model for different risk modules"
      },
      riskModules: [
        {
          name: "Market risk",
          subModules: ["Interest rate risk", "Equity risk", "Property risk", "Spread risk", "Currency risk", "Concentration risk"]
        },
        {
          name: "Counterparty default risk",
          description: "Risk of default by reinsurers, intermediaries, and other counterparties"
        },
        {
          name: "Life underwriting risk",
          subModules: ["Mortality risk", "Longevity risk", "Disability-morbidity risk", "Lapse risk", "Expense risk", "Revision risk", "Catastrophe risk"]
        },
        {
          name: "Non-life underwriting risk",
          subModules: ["Premium and reserve risk", "Catastrophe risk", "Lapse risk"]
        },
        {
          name: "Health underwriting risk",
          subModules: ["SLT health risk", "Non-SLT health risk", "Health catastrophe risk"]
        },
        {
          name: "Operational risk",
          description: "Based on a percentage of technical provisions and earned premiums"
        }
      ],
      diversificationBenefit: "Correlation matrices applied between risk modules to recognise diversification effects",
      lossAbsorbingCapacity: "Adjustment for loss-absorbing capacity of technical provisions and deferred taxes"
    },
    mcr: {
      name: "Minimum Capital Requirement",
      description: "The absolute floor of capital below which the insurer's authorisation will be withdrawn",
      calculation: "Linear formula based on net technical provisions and net premiums written, subject to a floor (25% of SCR) and a cap (45% of SCR)",
      absoluteFloor: {
        lifeInsurer: "EUR 3.7 million (or GBP equivalent)",
        nonLifeInsurer: "EUR 2.5 million (or GBP equivalent)",
        reinsurer: "EUR 3.6 million (or GBP equivalent)"
      },
      consequences: "Breach of MCR triggers immediate supervisory intervention and potential withdrawal of authorisation"
    },
    ownFunds: {
      description: "Own funds are the capital resources available to meet the SCR and MCR",
      tiers: [
        {
          tier: "Tier 1 unrestricted",
          description: "Highest quality capital - ordinary shares, retained earnings, reconciliation reserve",
          scrLimit: "At least 50% of SCR must be met by Tier 1 unrestricted"
        },
        {
          tier: "Tier 1 restricted",
          description: "Perpetual subordinated instruments with principal loss absorption features",
          scrLimit: "Tier 1 restricted limited to 20% of total Tier 1"
        },
        {
          tier: "Tier 2",
          description: "Subordinated liabilities with minimum 10-year maturity or 5-year call option",
          scrLimit: "Tier 1 + Tier 2 must be at least 50% of SCR"
        },
        {
          tier: "Tier 3",
          description: "Subordinated liabilities with maturity less than specified; other items such as net deferred tax assets",
          scrLimit: "Tier 3 limited to 15% of SCR"
        }
      ],
      mcrEligibility: "MCR must be covered at least 80% by Tier 1 items; Tier 3 items not eligible to cover MCR"
    },
    technicalProvisions: {
      description: "Technical provisions represent the current amount that insurers would have to pay to transfer their insurance obligations to another undertaking",
      components: {
        bestEstimate: "Probability-weighted average of future cash flows discounted using the relevant risk-free interest rate term structure",
        riskMargin: "Cost of providing eligible own funds equal to the SCR necessary to support the insurance obligations over their lifetime. Calculated using a cost-of-capital approach at a rate of 4% (reduced from 6% under Solvency UK reforms)."
      },
      discounting: {
        riskFreeRate: "Based on EIOPA/PRA published risk-free rate curves",
        volatilityAdjustment: "Adjustment to risk-free rate to prevent artificial volatility in own funds caused by spread movements",
        matchingAdjustment: "Adjustment available for portfolios of assets closely matched to insurance liabilities, allowing a higher discount rate. Subject to strict eligibility criteria including asset-liability matching, separate management, and PRA approval."
      }
    }
  },

  reportingTemplates: {
    quantitativeReportingTemplates: {
      description: "Insurance firms must submit Quantitative Reporting Templates (QRTs) to the PRA",
      annual: [
        "S.02.01 - Balance sheet",
        "S.05.01 - Premiums, claims and expenses by line of business",
        "S.12.01 - Life and health SLT technical provisions",
        "S.17.01 - Non-life technical provisions",
        "S.22.01 - Impact of long-term guarantees and transitional measures",
        "S.23.01 - Own funds",
        "S.25.01 - SCR (standard formula or internal model)",
        "S.28.01/02 - MCR",
        "S.32.01 - Undertakings in scope of the group"
      ],
      quarterly: [
        "S.02.01 - Balance sheet (quarterly)",
        "S.05.01 - Premiums, claims and expenses (quarterly)",
        "S.12.01 - Life technical provisions (quarterly)",
        "S.23.01 - Own funds (quarterly)"
      ]
    },
    narrativeReporting: {
      regularSupervisoryReport: "Annual narrative report covering business and performance, system of governance, risk profile, valuation for solvency purposes, and capital management",
      sfcr: "Solvency and Financial Condition Report - public disclosure document covering similar areas with specific prescribed content",
      orsa: "Own Risk and Solvency Assessment - internal assessment of the firm's overall solvency needs"
    }
  },

  bankingReforms: {
    ringFencing: {
      description: "UK ring-fencing regime requires the largest UK banks to separate core retail banking services from investment banking activities",
      applicability: "Banks with more than £25 billion of core deposits",
      requirements: [
        "Ring-fenced body (RFB) must not conduct excluded activities (e.g., dealing in investments as principal)",
        "RFB must be legally, economically, and operationally independent",
        "Separate board and governance for the RFB",
        "Independent treasury and risk management",
        "Restrictions on intra-group exposures and transactions"
      ]
    },
    basel31: {
      description: "Implementation of Basel 3.1 reforms (finalisation of Basel III) in the UK",
      timeline: "Implementation from 1 January 2026 with transitional arrangements",
      keyChanges: [
        "Output floor limiting benefit of internal models to 72.5% of standardised approach",
        "Revised standardised approaches for credit risk",
        "Revised credit valuation adjustment (CVA) framework",
        "Revised operational risk framework (standardised measurement approach)",
        "Revised market risk framework (FRTB)"
      ]
    }
  },

  source: "pra.bankofengland.co.uk",
  lastVerified: "2026-03-12"
};


// =============================================================================
// 6. CHARITY COMMISSION DETAIL
// =============================================================================

export const CHARITY_COMMISSION_DETAIL = {
  fullName: "Charity Commission for England and Wales",
  role: "The Charity Commission is the independent, non-ministerial government department that registers and regulates charities in England and Wales. It provides guidance to charity trustees, maintains the Register of Charities, investigates mismanagement or misconduct, and takes regulatory action where necessary.",
  objectives: [
    "Increasing public trust and confidence in charities",
    "Promoting awareness and understanding of the operation of the public benefit requirement",
    "Promoting compliance by charity trustees with their legal obligations",
    "Promoting the effective use of charitable resources",
    "Enhancing the accountability of charities to donors, beneficiaries and the general public"
  ],

  sorp: {
    fullName: "Charities Statement of Recommended Practice (FRS 102)",
    description: "The Charities SORP provides recommendations on how charities should prepare their annual accounts and report on their finances. It applies to charities that prepare their accounts on an accruals basis in accordance with UK GAAP (FRS 102).",
    currentVersion: "Charities SORP (FRS 102) - Second Edition, effective 1 January 2019 (updated for Amendments to FRS 102)",
    applicability: "All charities preparing accruals accounts under FRS 102 that are not required or choose not to apply IFRS",
    sofaFormat: {
      name: "Statement of Financial Activities (SOFA)",
      description: "The primary performance statement for charities, replacing the conventional income statement. The SOFA shows all income and expenditure for the reporting period analysed between funds.",
      columns: [
        "Unrestricted funds",
        "Restricted income funds",
        "Endowment funds",
        "Total funds (current year)",
        "Total funds (prior year, comparative)"
      ],
      incomeCategories: [
        "Donations and legacies - voluntary income including donations, gifts, grants not for specific goods/services, and legacy income",
        "Charitable activities - income from the charity's primary charitable purposes and contracts for services",
        "Other trading activities - income from trading subsidiaries, fundraising events, sponsorships, and lettings",
        "Investments - investment income including dividends, interest, and rents from investment properties",
        "Other income - including profit on disposal of fixed assets, insurance claims, and sundry income"
      ],
      expenditureCategories: [
        "Raising funds - costs of generating voluntary income, fundraising trading costs, investment management costs",
        "Charitable activities - costs directly related to the charity's objects, analysed by activity/programme",
        "Other expenditure - including losses on disposal of assets and other items not classified elsewhere"
      ],
      recognitionPrinciples: {
        income: "Income is recognised when the charity has entitlement to the resource, when it is probable the resource will be received, and when the monetary value can be measured with sufficient reliability",
        expenditure: "Expenditure is recognised when a liability is incurred (accruals basis), including constructive obligations where a valid expectation has been created",
        legacyIncome: "Recognised when the charity is aware of the entitlement, receipt is probable, and the amount can be measured reliably. For pecuniary legacies this is typically at grant of probate; for residuary legacies when estate accounts are finalised or earlier if amounts can be reliably estimated.",
        grantsMade: "Recognised when the charity has a constructive or legal obligation to make the payment. Multi-year grants are recognised in full if a binding commitment exists."
      }
    },
    balanceSheetFormat: {
      name: "Balance Sheet",
      description: "Shows the charity's assets, liabilities, and funds at the reporting date",
      sections: [
        "Fixed assets - tangible, intangible, heritage assets, and investments",
        "Current assets - debtors, investments, cash at bank and in hand",
        "Current liabilities - creditors due within one year",
        "Net current assets (liabilities)",
        "Total assets less current liabilities",
        "Long-term liabilities - creditors due after more than one year, provisions",
        "Net assets (liabilities) including pension liability",
        "Funds - endowment, restricted income, unrestricted (designated and general)"
      ],
      heritageAssets: {
        description: "Heritage assets are tangible and intangible assets with historic, artistic, scientific, technological, geophysical or environmental qualities held principally for their contribution to knowledge and culture",
        accounting: "May be capitalised at cost or valuation, or where cost/valuation information is not available and cannot be obtained at reasonable cost, need not be recognised on the balance sheet but must be disclosed in the notes"
      }
    },
    fundAccounting: {
      description: "Fund accounting is a fundamental principle of charity accounting, requiring charities to account for resources according to the restrictions placed upon them",
      restricted: {
        description: "Restricted funds are held for specific purposes as specified by the donor or the terms of an appeal. The charity cannot use restricted funds for any purpose other than that specified.",
        types: [
          "Restricted income funds - income subject to specific conditions imposed by the donor as to how it may be spent",
          "Restricted capital funds - capital that must be retained for a specific purpose"
        ],
        transfers: "Transfers between restricted and unrestricted funds are only permissible where the restrictions have been met or where the donor agrees to a change of purpose"
      },
      unrestricted: {
        description: "Unrestricted funds are available for use at the discretion of the trustees in furtherance of the charity's general objects. They include designated funds.",
        designated: {
          description: "Designated funds are unrestricted funds that the trustees have earmarked for particular purposes. The designation has no legal effect and may be reversed by the trustees.",
          examples: [
            "Building fund - set aside for future capital expenditure",
            "Equipment replacement fund",
            "Working capital reserve",
            "Fixed asset fund - representing the value of charity's fixed assets"
          ]
        },
        generalFunds: "The residual unrestricted funds available for the charity's general purposes"
      },
      endowment: {
        description: "Endowment funds are funds where the capital is held permanently or for an extended period to generate income for the charity's purposes",
        permanentEndowment: {
          description: "Capital that must be held permanently by the charity and cannot be spent. Only the income generated can be used.",
          totalReturn: "Charities with permanent endowment may adopt a total return approach to investment, allowing allocation of both income and capital gains for spending, subject to maintaining the real value of the endowment and Charity Commission approval"
        },
        expendableEndowment: {
          description: "Capital that the trustees have the power to convert to income and spend at their discretion, though the expectation is that it will be retained"
        }
      }
    }
  },

  trusteeAnnualReport: {
    description: "The Trustees' Annual Report (TAR) is a narrative report that must accompany the charity's accounts. Its purpose is to help users of the accounts understand the charity's activities, achievements, and financial position.",
    requirements: {
      allCharities: [
        "Reference and administrative details of the charity (name, charity number, registered address)",
        "Names of all trustees during the reporting period",
        "Name of chief executive or equivalent if applicable",
        "Name of the independent examiner or auditor",
        "Objectives and activities - summary of the charity's objects and principal activities",
        "Achievements and performance - review of the charity's activities during the year",
        "Financial review - review of the charity's financial position at the end of the year",
        "Reserves policy - statement of the charity's policy on reserves and the amount held",
        "Structure, governance and management - description of charity's governing document, organisational structure, and trustee appointment methods",
        "Risk management - principal risks and uncertainties facing the charity and how they are managed"
      ],
      largerCharities: [
        "Plans for future periods",
        "Statement of public benefit including how activities have been carried out for the public benefit",
        "Grant-making policies where applicable",
        "Social investment policies where applicable",
        "Description of the charity's organisational structure and decision-making processes",
        "Relationships with related parties and connected organisations",
        "Policies and procedures for staff remuneration",
        "Details of any fundraising activities including approach and performance",
        "Statement of fundraising practice including compliance with recognised fundraising standards",
        "Information about serious incidents reported to the Charity Commission"
      ],
      sizeThresholds: {
        largerCharity: "Income exceeding £500,000 in the reporting period"
      }
    }
  },

  seriousIncidentReporting: {
    description: "Charities must report serious incidents to the Charity Commission promptly. A serious incident is an adverse event (whether actual or alleged) that results in or risks significant harm to the charity's beneficiaries, staff, or others, loss of charitable funds or assets, or damage to the charity's property or reputation.",
    criteria: [
      "Fraud or theft of charity funds or assets, or attempted fraud/theft",
      "Significant financial loss to the charity (whether through fraud, negligence, or other causes)",
      "Links to terrorism or proscribed organisations including financial support",
      "Safeguarding concerns including harm or abuse of beneficiaries (particularly children or vulnerable adults)",
      "Significant data breaches or cyber attacks affecting the charity or its beneficiaries",
      "Any incident that results in significant loss of charity funds or a significant risk to the charity's property, work, beneficiaries, or reputation",
      "Suspicion, allegation, or incident of abuse of beneficiaries by staff, trustees, or volunteers",
      "Charity trustee or senior staff member being charged with or convicted of a criminal offence",
      "Environmental disaster or significant health and safety incident related to charity operations",
      "Significant disputes between trustees that are affecting the charity's governance or operations",
      "Discovery of significant conflicts of interest that have not been properly managed",
      "Major operational failures that significantly affect the charity's ability to deliver its charitable purposes"
    ],
    process: {
      timing: "Report to the Charity Commission as soon as reasonably possible after the incident is discovered",
      method: "Online reporting through the Charity Commission's serious incident reporting form",
      followUp: "The Commission may request further information, open a regulatory case, or issue guidance",
      recordKeeping: "Charities should maintain records of all serious incidents and their resolution"
    }
  },

  cc3TrusteeResponsibilities: {
    fullTitle: "CC3 - The Essential Trustee: What You Need to Know, What You Need to Do",
    description: "CC3 is the Charity Commission's key guidance document for charity trustees, setting out their fundamental duties and responsibilities",
    sixKeyDuties: [
      {
        duty: "Ensure your charity is carrying out its purposes for the public benefit",
        description: "Trustees must ensure the charity's activities are consistent with its stated purposes and provide public benefit. They should regularly review the charity's aims, activities, and achievements to ensure they remain relevant and effective."
      },
      {
        duty: "Comply with your charity's governing document and the law",
        description: "Trustees must follow the charity's governing document (constitution, trust deed, or articles of association) and comply with charity law, company law (if applicable), and any other relevant legislation. They should be familiar with the governing document and ensure decisions are within its scope."
      },
      {
        duty: "Act in your charity's best interests",
        description: "Trustees must always act in the best interests of the charity, not in their own personal interests or the interests of any other person or organisation. They must manage conflicts of interest, not benefit from their role (unless expressly authorised), and make balanced and adequately informed decisions."
      },
      {
        duty: "Manage your charity's resources responsibly",
        description: "Trustees must act responsibly, reasonably, and honestly in managing the charity's resources. This includes implementing appropriate financial controls, managing risks, ensuring the charity is solvent and not overcommitted, and keeping proper accounting records."
      },
      {
        duty: "Act with reasonable care and skill",
        description: "Trustees must exercise reasonable care and skill in carrying out their duties, using their personal skills and experience as appropriate. Trustees with specialist knowledge (e.g., legal, financial) are expected to apply that expertise."
      },
      {
        duty: "Ensure your charity is accountable",
        description: "Trustees must ensure the charity complies with its reporting and accounting obligations. This includes preparing and filing annual returns and accounts with the Charity Commission, being open and transparent about the charity's work, and engaging with stakeholders."
      }
    ],
    personalLiability: {
      description: "Charity trustees can be personally liable for the charity's debts and obligations in certain circumstances",
      riskFactors: [
        "Acting outside the scope of the charity's governing document",
        "Acting in breach of trust or fiduciary duty",
        "Making decisions that are not in the charity's best interests",
        "Failure to exercise reasonable care and skill",
        "Liability for employment, health and safety, or other regulatory breaches"
      ],
      protection: "Trustees can seek protection through appropriate insurance (trustee indemnity insurance), acting reasonably and in good faith, and seeking professional advice where appropriate"
    }
  },

  annualReturn: {
    description: "All registered charities with income over £10,000 must complete and submit an annual return to the Charity Commission. This is in addition to filing their accounts and trustee annual report.",
    content: [
      "Confirmation of charity details (name, address, governing document, area of operation)",
      "Trustee information (names, dates of appointment and resignation)",
      "Financial summary (income, expenditure, assets, liabilities)",
      "Details of serious incidents reported during the period",
      "Confirmation of whether the charity's objects have changed",
      "Information about activities, beneficiaries, and geographic areas of operation",
      "Details of any fundraising activities",
      "Trading subsidiary information where applicable",
      "Safeguarding policy confirmation",
      "Details of any grants received from government bodies",
      "Overseas activities and expenditure",
      "Staff and volunteer numbers"
    ],
    deadline: "10 months after the end of the charity's financial year",
    lateFilingConsequences: [
      "Charity flagged as overdue on the Register of Charities (publicly visible)",
      "Formal warning and request for compliance",
      "Potential regulatory action including opening a regulatory compliance case",
      "In extreme cases, removal from the register"
    ]
  },

  thresholds: {
    accrualsRequired: {
      income: 250000,
      description: "Charities with gross income exceeding £250,000 must prepare their accounts on an accruals basis (charities below this may choose to use receipts and payments basis)"
    },
    auditRequired: {
      income: 1000000,
      assets: 3260000,
      description: "A charity must have its accounts audited if its gross income exceeds £1,000,000 OR if its gross income exceeds £250,000 and its gross assets exceed £3,260,000",
      groupThresholds: "For parent charities, the group thresholds apply: aggregate gross income exceeding £1,000,000 net (after consolidation adjustments) or aggregate gross income exceeding £250,000 net and aggregate gross assets exceeding £3,260,000 net"
    },
    independentExamination: {
      incomeRange: "Charities with gross income between £25,000 and the audit threshold",
      qualifications: "If income exceeds £250,000, the independent examiner must be a member of a specified professional body (ICAEW, ACCA, ICAS, or equivalent)",
      scope: "An independent examination is a less rigorous form of scrutiny than an audit, focusing on whether there is any material misstatement, proper accounting records have been kept, accounts are consistent with records, and the accounts comply with charity law requirements"
    },
    registrationThreshold: {
      income: 5000,
      description: "Charities with income over £5,000 must register with the Charity Commission (some charities are exempt or excepted from registration)"
    },
    reportingRequirements: {
      below10000: "Must file accounts and trustee annual report but not required to complete annual return",
      above10000: "Must file accounts, trustee annual report, and annual return",
      above25000: "Accounts must be independently examined or audited",
      above250000: "Accounts must be on accruals basis; independent examiner must be professionally qualified",
      above500000: "Enhanced trustee annual report requirements",
      above1000000: "Full audit required (or below £1m if asset threshold exceeded)"
    }
  },

  charityTypes: {
    charitableTrust: "Governed by a trust deed, managed by trustees. No separate legal personality; trustees are personally liable unless protected by the trust deed.",
    charitableCompany: "Incorporated charity registered with Companies House as a company limited by guarantee. Has separate legal personality. Subject to both charity law and company law.",
    cio: {
      name: "Charitable Incorporated Organisation",
      description: "A legal form specifically designed for charities, providing limited liability without the burden of dual regulation. Registered only with the Charity Commission (not Companies House).",
      types: [
        "Foundation CIO - only trustees are members",
        "Association CIO - wider membership beyond trustees"
      ]
    },
    unincorporatedAssociation: "Governed by a constitution. No separate legal personality. Trustees may be personally liable."
  },

  investmentPowers: {
    description: "Charity trustees have a duty to invest the charity's assets in a way that furthers the charity's purposes while meeting fiduciary duties",
    charitiesAct2011: {
      wideInvestmentPowers: "Subject to the charity's governing document, trustees have wide powers of investment under the Trustee Act 2000 and Charities Act 2011",
      dutyOfCare: "Trustees must exercise the standard of care that a prudent person would exercise when investing for the benefit of others for whom they feel morally bound to provide",
      investmentPolicy: "Trustees should have a clear investment policy that considers return requirements, risk tolerance, ethical considerations, and liquidity needs"
    },
    socialInvestment: {
      description: "The Charities (Protection and Social Investment) Act 2016 gave trustees an express power to make social investments",
      definition: "Social investments are made with a view to both directly furthering the charity's purposes and achieving a financial return"
    },
    ethicalInvestment: "Trustees may take ethical considerations into account in investment decisions, provided they do not significantly prejudice the financial interests of the charity. CC14 guidance addresses ethical investment for charities."
  },

  regulatoryPowers: {
    description: "The Charity Commission has a range of regulatory and protective powers under the Charities Act 2011",
    powers: [
      "Opening statutory inquiries into charities (s46)",
      "Suspending and removing trustees (s76-80)",
      "Appointing interim managers (s76)",
      "Directing application of charity property (s85)",
      "Restricting transactions by the charity pending investigation (s76)",
      "Making schemes to alter charity purposes where the original purposes are obsolete or impractical (cy-pres schemes)",
      "Requiring charities to change their name if it is misleading or offensive",
      "Issuing official warnings to charities for breach of duty",
      "Disqualifying individuals from acting as charity trustees",
      "Ordering the winding up of a charity"
    ]
  },

  source: "charitycommission.gov.uk",
  lastVerified: "2026-03-12"
};
