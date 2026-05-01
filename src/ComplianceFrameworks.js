// ═══════════════════════════════════════════════════════════════════════
// COMPLIANCE FRAMEWORKS — AML, GDPR, Bribery Act, Modern Slavery, Sanctions
// UK-specific regulatory compliance for audit engagements
// ═══════════════════════════════════════════════════════════════════════

// ─── AML FRAMEWORK (MLR 2017) ───────────────────────────────────────

export const AML_FRAMEWORK = {
  title: 'Anti-Money Laundering Framework',
  legislation: 'Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (as amended)',
  regulator: 'HMRC (for accountancy service providers) / FCA (for authorised firms)',
  source: 'legislation.gov.uk',
  lastVerified: '2026-03-12',
  components: [
    {
      area: 'Customer Due Diligence (CDD)',
      regulation: 'MLR 2017 Reg 28-30',
      requirements: [
        'Identify the customer and verify identity from reliable, independent sources',
        'Identify beneficial owners (>25% ownership or control) and take reasonable measures to verify',
        'Assess and obtain information on the purpose and intended nature of the business relationship',
        'Conduct ongoing monitoring of the relationship including scrutiny of transactions',
        'CDD must be completed before establishing a business relationship (Reg 30)',
      ],
      auditProcedures: [
        'Verify CDD file maintained for client: ID documents, proof of address, company searches',
        'Confirm beneficial ownership identified via Companies House PSC register and verified',
        'Review source of funds documentation where risk warrants',
        'Check ongoing monitoring has been performed (annual review as minimum)',
      ],
    },
    {
      area: 'Enhanced Due Diligence (EDD)',
      regulation: 'MLR 2017 Reg 33-35',
      requirements: [
        'Required for high-risk situations including PEPs, high-risk third countries (Reg 33)',
        'Complex or unusually large transactions without apparent economic purpose',
        'Where the firm assesses the customer relationship as high risk',
        'Additional measures: establishing source of wealth and source of funds',
        'Senior management approval for establishing or continuing the relationship',
      ],
      triggers: [
        'Customer or beneficial owner is a PEP (Politically Exposed Person) or family member/close associate',
        'Customer established in high-risk third country (per EU/UK list)',
        'Transaction is complex or unusually large',
        'Unusual patterns of transactions with no apparent purpose',
        'Customer connected to countries with higher corruption indices',
      ],
    },
    {
      area: 'Suspicious Activity Reporting (SAR)',
      regulation: 'Proceeds of Crime Act 2002 s330-331',
      requirements: [
        'Report to NCA if you know, suspect, or have reasonable grounds to suspect money laundering',
        'Report must be made as soon as practicable',
        'Tipping off is a criminal offence (POCA s333A)',
        'Nominated officer must be appointed to receive internal disclosures',
        'Failure to report is a criminal offence carrying up to 5 years imprisonment',
      ],
      considerations: [
        'Auditor is in the "regulated sector" and has a legal obligation to report',
        'Privilege reporting exemption may apply for legal professional privilege (limited)',
        'Defence SARs required before proceeding with a transaction where suspicion exists',
        'Consider impact on audit engagement if SAR is filed — can audit continue?',
      ],
    },
    {
      area: 'PEP Screening',
      regulation: 'MLR 2017 Reg 35',
      requirements: [
        'Screen all customers and beneficial owners against PEP lists',
        'PEP includes: heads of state, ministers, senior civil servants, military officers, judiciary, ambassadors',
        'Family members and known close associates of PEPs are also covered',
        'Enhanced CDD measures required — source of wealth, senior management approval',
        'UK domestic PEPs subject to EDD but risk-based approach applies (not automatic EDD)',
      ],
    },
    {
      area: 'Sanctions Screening',
      regulation: 'Sanctions and Anti-Money Laundering Act 2018',
      requirements: [
        'Screen against OFSI Consolidated List of Financial Sanctions Targets',
        'Screen against HMT Financial Sanctions list',
        'Criminal offence to deal with or make funds available to designated persons',
        'No threshold — any dealing is prohibited',
        'Report any match to OFSI within appropriate timeframe',
      ],
    },
    {
      area: 'Record Keeping',
      regulation: 'MLR 2017 Reg 40',
      requirements: [
        'Retain CDD records for 5 years after end of business relationship',
        'Retain transaction records for 5 years from completion of transaction',
        'Records must be sufficient to permit reconstruction of individual transactions',
        'Electronic or physical records acceptable',
      ],
    },
  ],
};

// ─── GDPR AUDIT FRAMEWORK ──────────────────────────────────────────

export const GDPR_AUDIT_FRAMEWORK = {
  title: 'GDPR Audit Framework',
  legislation: 'UK General Data Protection Regulation (UK GDPR) & Data Protection Act 2018',
  regulator: 'Information Commissioner\'s Office (ICO)',
  source: 'ico.org.uk',
  lastVerified: '2026-03-12',
  components: [
    {
      area: 'Data Mapping & Inventory',
      article: 'UK GDPR Art 30',
      requirements: [
        'Record of processing activities (ROPA) maintained',
        'Categories of data subjects and personal data documented',
        'Purpose of processing clearly stated for each activity',
        'Data sharing arrangements with third parties documented',
        'Retention periods defined for each category of data',
      ],
      auditProcedures: [
        'Obtain and review the ROPA for completeness',
        'Sample test processing activities against ROPA entries',
        'Verify data flows match documented arrangements',
        'Check retention schedules are being followed (sample deletion logs)',
      ],
    },
    {
      area: 'Data Protection Impact Assessment (DPIA)',
      article: 'UK GDPR Art 35',
      requirements: [
        'DPIA required before processing likely to result in high risk to individuals',
        'Must include: systematic description, necessity assessment, risk assessment, mitigation measures',
        'Mandatory for: large-scale profiling, systematic monitoring, sensitive data processing',
        'Consult ICO if residual high risk cannot be mitigated',
      ],
    },
    {
      area: 'Breach Reporting',
      article: 'UK GDPR Art 33-34',
      requirements: [
        'Report personal data breaches to ICO within 72 hours of becoming aware',
        'Notify affected individuals without undue delay if high risk',
        'Maintain internal breach register regardless of whether reportable',
        'Document: nature of breach, categories affected, likely consequences, measures taken',
      ],
      auditProcedures: [
        'Review breach register for completeness and timeliness of response',
        'Test sample of breaches for ICO notification compliance (72-hour rule)',
        'Verify breach response procedures are documented and tested',
      ],
    },
    {
      area: 'Data Retention',
      article: 'UK GDPR Art 5(1)(e)',
      requirements: [
        'Personal data must not be kept longer than necessary for its purpose',
        'Retention schedule must be documented and followed',
        'Regular review of data held against retention policy',
        'Secure deletion or anonymisation when retention period expires',
      ],
    },
    {
      area: 'Lawful Basis',
      article: 'UK GDPR Art 6',
      bases: [
        { basis: 'Consent', article: 'Art 6(1)(a)', notes: 'Must be freely given, specific, informed, unambiguous. Can be withdrawn.' },
        { basis: 'Contract', article: 'Art 6(1)(b)', notes: 'Necessary for performance of contract with data subject.' },
        { basis: 'Legal obligation', article: 'Art 6(1)(c)', notes: 'Required to comply with UK law.' },
        { basis: 'Vital interests', article: 'Art 6(1)(d)', notes: 'Life or death situations only.' },
        { basis: 'Public task', article: 'Art 6(1)(e)', notes: 'Official functions or tasks in public interest.' },
        { basis: 'Legitimate interests', article: 'Art 6(1)(f)', notes: 'Balancing test required. Not available to public authorities.' },
      ],
    },
    {
      area: 'International Transfers',
      article: 'UK GDPR Art 44-49',
      requirements: [
        'Transfers to non-adequate countries require appropriate safeguards',
        'UK adequacy decisions recognise certain countries as providing adequate protection',
        'Standard Contractual Clauses (UK SCCs) for transfers to non-adequate countries',
        'Transfer Impact Assessment required for UK SCCs',
        'Binding Corporate Rules for intra-group transfers',
      ],
    },
  ],
};

// ─── BRIBERY ACT FRAMEWORK ─────────────────────────────────────────

export const BRIBERY_ACT_FRAMEWORK = {
  title: 'Bribery Act 2010 Framework',
  legislation: 'Bribery Act 2010',
  regulator: 'Serious Fraud Office (SFO)',
  source: 'legislation.gov.uk',
  lastVerified: '2026-03-12',
  offences: [
    { section: 's1', title: 'Bribing another person', description: 'Offering, promising or giving a financial or other advantage to induce improper performance of a function.' },
    { section: 's2', title: 'Being bribed', description: 'Requesting, agreeing to receive or accepting a financial or other advantage in connection with improper performance.' },
    { section: 's6', title: 'Bribery of foreign public officials', description: 'Offering, promising or giving a financial advantage to a foreign public official to obtain or retain business.' },
    { section: 's7', title: 'Failure to prevent bribery', description: 'Commercial organisation fails to prevent bribery by associated persons. Defence: adequate procedures.' },
  ],
  adequateProcedures: {
    title: 'Six Principles of Adequate Procedures (Ministry of Justice Guidance)',
    principles: [
      { principle: 'Proportionate procedures', description: 'Procedures proportionate to bribery risks faced and nature/size/complexity of the organisation.' },
      { principle: 'Top-level commitment', description: 'Top-level management committed to preventing bribery, fostering culture of zero tolerance.' },
      { principle: 'Risk assessment', description: 'Periodic, informed and documented assessment of nature and extent of bribery risk exposure.' },
      { principle: 'Due diligence', description: 'Risk-based due diligence on persons performing or seeking to perform services on behalf of the organisation.' },
      { principle: 'Communication and training', description: 'Bribery prevention policies and procedures communicated, embedded and understood through training.' },
      { principle: 'Monitoring and review', description: 'Procedures monitored and reviewed and improvements made where necessary.' },
    ],
  },
  auditConsiderations: [
    'Review gifts and hospitality register for unusual patterns or values',
    'Assess facilitation payments policy and compliance',
    'Review agent/intermediary arrangements for bribery risk indicators',
    'Test expense claims for indicators of improper payments',
    'Consider country risk where entity operates in high-risk jurisdictions (Transparency International CPI)',
    'Evaluate adequacy of anti-bribery policies and training records',
  ],
};

// ─── MODERN SLAVERY FRAMEWORK ──────────────────────────────────────

export const MODERN_SLAVERY_FRAMEWORK = {
  title: 'Modern Slavery Act 2015 Framework',
  legislation: 'Modern Slavery Act 2015',
  regulator: 'Home Office / Independent Anti-Slavery Commissioner',
  source: 'legislation.gov.uk',
  lastVerified: '2026-03-12',
  applicability: {
    threshold: 'Annual turnover of £36 million or more',
    entities: 'Commercial organisations (body corporate or partnership) carrying on business in the UK',
    section: 's54',
  },
  requirements: [
    {
      area: 'Annual Statement',
      detail: [
        'Publish a slavery and human trafficking statement for each financial year',
        'Statement must set out steps taken to ensure slavery is not occurring in business or supply chains',
        'Approved by board of directors and signed by a director',
        'Published on website with prominent link on homepage',
        'Must be published within 6 months of year end',
      ],
    },
    {
      area: 'Due Diligence',
      detail: [
        'Assess modern slavery risk in supply chains',
        'Conduct risk assessments of suppliers by country, sector and type of labour',
        'Implement monitoring and remediation processes',
        'Require contractual commitments from suppliers',
      ],
    },
    {
      area: 'Supply Chain Transparency',
      detail: [
        'Map supply chains and identify high-risk areas',
        'Consider: geographical risk, sector risk, transaction risk, business partnership risk',
        'Tier 1 suppliers minimum; best practice extends to Tier 2+',
        'Consider forced labour, child labour, debt bondage indicators',
      ],
    },
  ],
  auditConsiderations: [
    'Verify s54 statement published on website and approved by board',
    'Assess whether statement content meets statutory requirements',
    'Review supply chain due diligence documentation',
    'Consider reputational risk if entity not compliant',
    'For entities below threshold: voluntary statement encouraged but not required',
  ],
};

// ─── SANCTIONS FRAMEWORK ───────────────────────────────────────────

export const SANCTIONS_FRAMEWORK = {
  title: 'UK Sanctions Framework',
  legislation: 'Sanctions and Anti-Money Laundering Act 2018 (SAMLA)',
  regulator: 'Office of Financial Sanctions Implementation (OFSI)',
  source: 'gov.uk/ofsi',
  lastVerified: '2026-03-12',
  keyElements: [
    {
      area: 'OFSI Consolidated List',
      description: 'Master list of all individuals and entities subject to UK financial sanctions.',
      requirements: [
        'All UK persons and entities must check the consolidated list',
        'No financial dealings with designated persons or entities',
        'Screening required at onboarding and on ongoing basis',
        'Includes UN, EU-origin (retained), and autonomous UK sanctions designations',
      ],
    },
    {
      area: 'Asset Freezing',
      description: 'Prohibition on dealing with funds or economic resources of designated persons.',
      requirements: [
        'Freeze all funds and economic resources owned, held or controlled by designated persons',
        'Do not make funds or economic resources available to designated persons',
        'Report to OFSI if you know or suspect you are holding assets of a designated person',
        'Strict liability — no threshold, no knowledge requirement for the prohibition itself',
      ],
    },
    {
      area: 'Screening Obligations',
      description: 'Requirement to screen clients, transactions, and counterparties.',
      requirements: [
        'Screen against OFSI Consolidated List at client onboarding',
        'Ongoing screening when list is updated (updated regularly)',
        'Screen payment counterparties and beneficiaries',
        'Document screening results and retain records',
        'Consider name matching challenges — fuzzy matching recommended',
      ],
    },
    {
      area: 'Reporting & Penalties',
      description: 'Obligations to report breaches and penalties for non-compliance.',
      requirements: [
        'Report suspected breaches to OFSI immediately',
        'Civil monetary penalties of up to £1 million or 50% of value of breach (whichever greater)',
        'Criminal penalties: up to 7 years imprisonment and/or unlimited fine',
        'OFSI can impose monetary penalties on strict liability basis',
        'Reasonable cause defence available for criminal offences',
      ],
    },
  ],
  auditConsiderations: [
    'Review entity\'s sanctions screening procedures and technology',
    'Sample test screening results against OFSI consolidated list',
    'Verify that screening covers all relevant parties (customers, suppliers, beneficiaries)',
    'Check frequency of rescreening against list updates',
    'Review any reported matches or near-matches and resolution',
    'Consider sanctions risk in relation to entity\'s geographical exposure',
  ],
};

// ─── COMBINED INDEX ─────────────────────────────────────────────────

export const COMPLIANCE_FRAMEWORKS = {
  aml: AML_FRAMEWORK,
  gdpr: GDPR_AUDIT_FRAMEWORK,
  briberyAct: BRIBERY_ACT_FRAMEWORK,
  modernSlavery: MODERN_SLAVERY_FRAMEWORK,
  sanctions: SANCTIONS_FRAMEWORK,
};

export const COMPLIANCE_FRAMEWORK_LIST = [
  { key: 'aml', title: 'Anti-Money Laundering', icon: '🏦', color: '#EF4444', count: AML_FRAMEWORK.components.length },
  { key: 'gdpr', title: 'GDPR / Data Protection', icon: '🔒', color: '#3B82F6', count: GDPR_AUDIT_FRAMEWORK.components.length },
  { key: 'briberyAct', title: 'Bribery Act 2010', icon: '⚖️', color: '#F59E0B', count: BRIBERY_ACT_FRAMEWORK.offences.length + 1 },
  { key: 'modernSlavery', title: 'Modern Slavery Act', icon: '🔗', color: '#8B5CF6', count: MODERN_SLAVERY_FRAMEWORK.requirements.length },
  { key: 'sanctions', title: 'UK Sanctions', icon: '🚫', color: '#EC4899', count: SANCTIONS_FRAMEWORK.keyElements.length },
];
