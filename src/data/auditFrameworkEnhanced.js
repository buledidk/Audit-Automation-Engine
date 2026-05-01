/**
 * Enhanced Audit Workflow Framework
 * 8-Phase Audit Process Based on Professional Standards
 * Inspired by Modern Audit Methodologies (Similar to PwC Aura)
 */

export const AUDIT_WORKFLOW_PHASES = [
  {
    id: 'engagement_planning',
    name: 'Engagement Planning & Client Onboarding',
    icon: '📋',
    order: 1,
    duration: '3-5 days',
    description: 'Initial engagement setup, risk profile assessment, and engagement letter execution',
    color: '#1E88E5',
    activities: [
      {
        id: 'accept_engagement',
        name: 'Accept Engagement & Create File',
        description: 'Establish engagement parameters and initial client information',
        duration: '4 hours',
        tasks: [
          'Client background research',
          'Industry and regulatory analysis',
          'Create engagement file',
          'Assign audit team',
          'Establish budget and timeline'
        ]
      },
      {
        id: 'understand_entity',
        name: 'Understand the Entity (Phase 1)',
        description: 'Comprehensive understanding of business, operations, and risk environment',
        duration: '16 hours',
        tasks: [
          'Analyze business model and value chain',
          'Identify industry dynamics and competitive factors',
          'Understand organizational structure and governance',
          'Review previous audit findings and management letters',
          'Perform preliminary analytical procedures',
          'Document entity-level controls and IT systems'
        ],
        smartFeatures: [
          'AI entity profiling from Companies House',
          'Industry benchmark comparison',
          'Automated risk categorization',
          'Smart document collection'
        ]
      },
      {
        id: 'execute_engagement_letter',
        name: 'Execute Engagement Letter',
        description: 'Finalize and sign engagement letter with client',
        duration: '8 hours',
        tasks: [
          'Prepare engagement letter',
          'Agree audit scope and fees',
          'Define management responsibilities',
          'Establish communication protocols',
          'Obtain formal acceptance'
        ]
      },
      {
        id: 'initial_planning_meeting',
        name: 'Initial Planning Meeting',
        description: 'Kick-off meeting with management and those charged with governance',
        duration: '4 hours',
        tasks: [
          'Present audit strategy and approach',
          'Discuss materiality and significant audit areas',
          'Identify key contacts and access requirements',
          'Establish communication schedule',
          'Address management concerns'
        ]
      }
    ]
  },

  {
    id: 'risk_assessment',
    name: 'Risk Assessment & Control Design Evaluation',
    icon: '⚠️',
    order: 2,
    duration: '4-6 days',
    description: 'Comprehensive risk identification and control environment assessment',
    color: '#E53935',
    activities: [
      {
        id: 'assess_fraud_risk',
        name: 'Assess Fraud Risk & Going Concern',
        description: 'Identify fraud risks and going concern indicators',
        duration: '8 hours',
        tasks: [
          'Perform fraud brainstorming session',
          'Assess fraud risk factors (incentives, pressures, opportunities)',
          'Evaluate going concern indicators',
          'Assess management override of controls',
          'Identify management estimates and judgments'
        ],
        smartFeatures: [
          'AI fraud pattern detection',
          'Industry fraud database comparison',
          'Going concern risk scoring',
          'Management incentive analysis'
        ]
      },
      {
        id: 'understand_internal_control',
        name: 'Understand Internal Control (COSO Framework)',
        description: 'Evaluate control environment, risk assessment, and control activities',
        duration: '20 hours',
        tasks: [
          'Assess control environment (tone at top, ethics, competence)',
          'Evaluate risk assessment process at entity level',
          'Review segregation of duties and authorization controls',
          'Test key preventive and detective controls',
          'Document control deficiencies',
          'Evaluate IT general controls (access, change management)'
        ],
        smartFeatures: [
          'AI control gap analysis',
          'Control matrix generation',
          'Segregation of duties visualization',
          'IT control assessment automation'
        ]
      },
      {
        id: 'assess_significant_risks',
        name: 'Assess Significant Risks & Materiality',
        description: 'Identify significant audit areas and determine materiality thresholds',
        duration: '12 hours',
        tasks: [
          'Perform preliminary materiality calculation',
          'Identify significant account balances and transactions',
          'Assess control risk per significant area',
          'Evaluate financial statement risk factors',
          'Determine significant audit areas (SAAs)',
          'Plan audit scope per area'
        ],
        smartFeatures: [
          'AI materiality benchmarking',
          'Risk heat map generation',
          'Automated SAA identification',
          'Scope optimization AI'
        ]
      },
      {
        id: 'develop_audit_strategy',
        name: 'Develop Detailed Audit Strategy',
        description: 'Document overall audit approach and procedures per area',
        duration: '12 hours',
        tasks: [
          'Define overall response to significant risks',
          'Plan audit procedures for each SAA',
          'Determine nature, timing, and extent of procedures',
          'Plan substantive analytical procedures',
          'Identify sample sizes and testing methodology',
          'Document resource allocation'
        ],
        smartFeatures: [
          'AI procedure recommendation engine',
          'Sample size optimization',
          'Procedure timing optimization',
          'Resource allocation AI'
        ]
      }
    ]
  },

  {
    id: 'interim_audit',
    name: 'Interim Audit Work (Preliminary Procedures)',
    icon: '🔍',
    order: 3,
    duration: '5-7 days',
    description: 'Interim testing and preliminary audit procedures before year-end',
    color: '#FB8C00',
    activities: [
      {
        id: 'test_controls',
        name: 'Test Design & Operating Effectiveness of Controls',
        description: 'Validate that controls are designed and operating effectively',
        duration: '20 hours',
        tasks: [
          'Test preventive controls through observation and inquiry',
          'Test detective controls through re-performance',
          'Perform walkthroughs of key processes',
          'Test system-generated reports and data',
          'Document control testing results',
          'Evaluate control design and implementation',
          'Identify control gaps and workarounds'
        ],
        smartFeatures: [
          'AI control testing recommendation',
          'Automated testing documentation',
          'Control effectiveness scoring',
          'Process walkthrough automation'
        ]
      },
      {
        id: 'interim_substantive',
        name: 'Interim Substantive Procedures',
        description: 'Perform substantive procedures before year-end',
        duration: '16 hours',
        tasks: [
          'Analyze revenue and expense trends',
          'Test significant transactions recorded in interim period',
          'Reconcile key account balances',
          'Perform analytical procedures for trend analysis',
          'Test period-end adjusting entries',
          'Review and test management estimates'
        ],
        smartFeatures: [
          'AI analytical procedure generation',
          'Trend analysis automation',
          'Anomaly detection system',
          'Management estimate validation'
        ]
      },
      {
        id: 'systems_assessment',
        name: 'IT Systems & Data Assessment',
        description: 'Evaluate IT controls and data integrity',
        duration: '12 hours',
        tasks: [
          'Map IT systems and data flows',
          'Assess system access controls',
          'Review system change management',
          'Test data integrity controls',
          'Evaluate segregation of duties in systems',
          'Review audit trails and logging'
        ],
        smartFeatures: [
          'AI system mapping automation',
          'Access control analysis',
          'Data flow visualization',
          'IT risk scoring'
        ]
      },
      {
        id: 'compliance_testing',
        name: 'Regulatory & Compliance Testing',
        description: 'Test compliance with relevant regulations and requirements',
        duration: '8 hours',
        tasks: [
          'Review regulatory compliance requirements',
          'Test compliance with local regulations',
          'Review tax compliance positions',
          'Test data protection (GDPR) controls',
          'Evaluate legal and regulatory matters'
        ],
        smartFeatures: [
          'AI regulatory requirements mapping',
          'Compliance testing automation',
          'Legal matter identification AI',
          'Risk alerting system'
        ]
      }
    ]
  },

  {
    id: 'financial_position',
    name: 'Financial Position & Assertion Testing',
    icon: '💰',
    order: 4,
    duration: '8-10 days',
    description: 'Detailed testing of significant account balances and transactions',
    color: '#43A047',
    activities: [
      {
        id: 'revenue_testing',
        name: 'Revenue Assertion Testing',
        description: 'Test revenue recognition and completeness assertions',
        duration: '16 hours',
        tasks: [
          'Understand revenue recognition policies (IFRS 15)',
          'Test revenue existence through sales orders and delivery',
          'Verify revenue valuation and pricing',
          'Test revenue cutoff (period boundaries)',
          'Verify revenue completeness',
          'Test revenue related disclosures'
        ],
        smartFeatures: [
          'AI revenue model validation',
          'Contract complexity scoring',
          'Performance obligation mapping',
          'Cutoff testing automation'
        ]
      },
      {
        id: 'receivables_testing',
        name: 'Receivables & Collections Testing',
        description: 'Test receivables balances and allowance for credit losses',
        duration: '12 hours',
        tasks: [
          'Confirm receivables (bank and customer confirmations)',
          'Test receivables aging and collectibility',
          'Evaluate allowance for doubtful debts (ECL under IFRS 9)',
          'Test receivables cutoff',
          'Analyze receivables trends',
          'Test revenue recorded after period-end',
          'Review related party transactions'
        ],
        smartFeatures: [
          'AI ECL model validation (IFRS 9)',
          'Confirmation automation',
          'Aging analysis AI',
          'Related party detection'
        ]
      },
      {
        id: 'inventory_testing',
        name: 'Inventory & COGS Testing',
        description: 'Test inventory balances and cost of goods sold',
        duration: '12 hours',
        tasks: [
          'Observe physical inventory count',
          'Test inventory pricing and valuation',
          'Evaluate inventory obsolescence provision',
          'Test inventory cutoff (purchases and sales)',
          'Analyze inventory turnover and aging',
          'Test COGS transactions and standard costs',
          'Evaluate inventory disclosures'
        ],
        smartFeatures: [
          'AI inventory valuation modeling',
          'Obsolescence risk scoring',
          'Cycle time analysis',
          'Variance analysis AI'
        ]
      },
      {
        id: 'fixed_assets_testing',
        name: 'Fixed Assets & Depreciation Testing',
        description: 'Test fixed asset balances and depreciation',
        duration: '12 hours',
        tasks: [
          'Test fixed asset additions (authorization and valuation)',
          'Test depreciation calculations and methods',
          'Evaluate impairment indicators (IAS 36)',
          'Test disposals and retirements',
          'Verify ownership and physical existence',
          'Review leases (IFRS 16 ROU assets)',
          'Test asset disclosures'
        ],
        smartFeatures: [
          'AI impairment testing automation',
          'Lease accounting automation (IFRS 16)',
          'Depreciation method analysis',
          'Asset register reconciliation AI'
        ]
      },
      {
        id: 'payables_testing',
        name: 'Payables & Accruals Testing',
        description: 'Test payables and accrued expenses',
        duration: '10 hours',
        tasks: [
          'Test payables cutoff and completeness',
          'Analyze payables aging',
          'Test supplier invoices and supporting documentation',
          'Evaluate payables accruals and estimates',
          'Test payables after period-end',
          'Review related party payables',
          'Test employee accruals and payroll'
        ],
        smartFeatures: [
          'AI payables cutoff automation',
          'Unmatched invoice detection',
          'Accrual adequacy scoring',
          'Fraud pattern detection'
        ]
      },
      {
        id: 'financial_statement_assertions',
        name: 'Other Assertions (Cash, Debt, Equity)',
        description: 'Test remaining financial statement assertions',
        duration: '10 hours',
        tasks: [
          'Confirm bank balances and reconcile',
          'Test cash and cash equivalents',
          'Confirm debt balances (bank confirmations)',
          'Test debt covenants and compliance',
          'Verify equity transactions and completeness',
          'Test subsequent events',
          'Review bank reconciliations'
        ],
        smartFeatures: [
          'Bank confirmation automation',
          'Covenant compliance scoring',
          'Subsequent event detection AI',
          'Reconciliation automation'
        ]
      }
    ]
  },

  {
    id: 'accounting_impact',
    name: 'Accounting Concepts & Impact Assessment',
    icon: '📊',
    order: 5,
    duration: '4-6 days',
    description: 'Evaluate significant accounting policies and their impact',
    color: '#7B1FA2',
    activities: [
      {
        id: 'accounting_policies',
        name: 'Accounting Policies & Standards Compliance',
        description: 'Review and validate accounting policies against IFRS',
        duration: '12 hours',
        tasks: [
          'Document all significant accounting policies',
          'Verify compliance with applicable IFRS standards',
          'Evaluate appropriateness of accounting methods',
          'Compare policies year-over-year',
          'Test policy application in transactions',
          'Evaluate policy disclosures'
        ],
        smartFeatures: [
          'AI IFRS standard mapper',
          'Policy compliance validator',
          'Accounting treatment analyzer',
          'Standard impact assessor'
        ]
      },
      {
        id: 'management_estimates',
        name: 'Management Estimates & Judgments',
        description: 'Test significant accounting estimates and judgments',
        duration: '12 hours',
        tasks: [
          'Identify all significant estimates (provisions, ECL, impairments)',
          'Validate estimation methodologies',
          'Test underlying data and assumptions',
          'Evaluate estimate reasonableness',
          'Review estimate changes year-over-year',
          'Test estimate disclosures'
        ],
        smartFeatures: [
          'AI estimate model validation',
          'Assumption sensitivity analysis',
          'Historical accuracy tracking',
          'Bias detection system'
        ]
      },
      {
        id: 'lease_accounting',
        name: 'Lease Accounting (IFRS 16)',
        description: 'Evaluate right-of-use assets and lease liabilities',
        duration: '8 hours',
        tasks: [
          'Identify all leases (operating and finance)',
          'Test ROU asset calculation',
          'Validate lease liability measurements',
          'Test lease modifications',
          'Evaluate lease terminations',
          'Test lease disclosures'
        ],
        smartFeatures: [
          'AI lease identification engine',
          'ROU asset calculator',
          'Lease accounting automator',
          'Lease impact analyzer'
        ]
      },
      {
        id: 'financial_instruments',
        name: 'Financial Instruments & Fair Values (IFRS 9, 13)',
        description: 'Test financial instrument classification and fair values',
        duration: '12 hours',
        tasks: [
          'Classify financial instruments per IFRS 9',
          'Evaluate impairment under IFRS 9 ECL model',
          'Test fair value measurements (IFRS 13)',
          'Validate valuation models and inputs',
          'Test derivative accounting',
          'Evaluate hedge accounting',
          'Review financial instrument disclosures'
        ],
        smartFeatures: [
          'AI instrument classifier',
          'Fair value model validator',
          'ECL calculation automator',
          'Derivative accounting expert'
        ]
      },
      {
        id: 'consolidation',
        name: 'Consolidation & Group Accounting',
        description: 'Evaluate consolidation adjustments and group transactions',
        duration: '10 hours',
        tasks: [
          'Test consolidation scope determination',
          'Validate elimination entries',
          'Test goodwill impairment calculations',
          'Evaluate intercompany transactions',
          'Test minority interest calculations',
          'Evaluate investment disclosures'
        ],
        smartFeatures: [
          'AI consolidation mapper',
          'Elimination entry generator',
          'Impairment testing automator',
          'Group transaction analyzer'
        ]
      }
    ]
  },

  {
    id: 'completion',
    name: 'Audit Completion & Review',
    icon: '✅',
    order: 6,
    duration: '3-4 days',
    description: 'Final audit procedures, reviews, and assessment',
    color: '#8E24AA',
    activities: [
      {
        id: 'final_procedures',
        name: 'Final Substantive Procedures',
        description: 'Perform final testing and obtain final confirmations',
        duration: '8 hours',
        tasks: [
          'Perform final analytical review',
          'Review significant transactions after year-end',
          'Obtain final management letter of representation',
          'Confirm final contingencies and commitments',
          'Review final financial statements',
          'Test final journal entries and adjustments'
        ],
        smartFeatures: [
          'AI analytical review automation',
          'Subsequent event detection',
          'Contingency assessment AI',
          'Adjustment validation'
        ]
      },
      {
        id: 'disclosure_review',
        name: 'Disclosure & Financial Statement Review',
        description: 'Comprehensive review of disclosures and financial statements',
        duration: '12 hours',
        tasks: [
          'Review all financial statement disclosures for completeness',
          'Verify presentation and format compliance with standards',
          'Test cross-references between statements and notes',
          'Evaluate segment reporting',
          'Review related party disclosures',
          'Validate numerical accuracy',
          'Review management discussion & analysis'
        ],
        smartFeatures: [
          'AI disclosure completeness checker',
          'Presentation validator',
          'Cross-reference checker',
          'Disclosure gap analyzer'
        ]
      },
      {
        id: 'review_evaluation',
        name: 'Audit Quality Review & Evaluation',
        description: 'Senior review of audit work and conclusions',
        duration: '12 hours',
        tasks: [
          'Review all significant audit findings',
          'Evaluate adequacy of audit procedures',
          'Assess audit evidence sufficiency',
          'Review risk assessments and responses',
          'Evaluate overall audit quality',
          'Assess compliance with auditing standards',
          'Review team performance'
        ],
        smartFeatures: [
          'AI audit quality scorer',
          'Evidence adequacy analyzer',
          'Standard compliance checker',
          'Finding significance evaluator'
        ]
      },
      {
        id: 'exception_resolution',
        name: 'Exception & Finding Resolution',
        description: 'Address audit findings and exceptions',
        duration: '8 hours',
        tasks: [
          'Document all identified exceptions and findings',
          'Assess quantitative and qualitative significance',
          'Determine impact on audit opinion',
          'Discuss findings with management',
          'Evaluate management responses',
          'Determine required adjustments',
          'Update audit risk assessment'
        ],
        smartFeatures: [
          'AI finding severity scorer',
          'Impact calculator',
          'Finding trend analyzer',
          'Resolution tracker'
        ]
      }
    ]
  },

  {
    id: 'reporting',
    name: 'Reporting & Sign-Off',
    icon: '📄',
    order: 7,
    duration: '2-3 days',
    description: 'Prepare audit reports and obtain final approvals',
    color: '#5D4037',
    activities: [
      {
        id: 'audit_report',
        name: 'Prepare Audit Report',
        description: 'Draft and finalize audit opinion and report',
        duration: '8 hours',
        tasks: [
          'Draft audit opinion (qualified, unqualified, adverse, disclaimer)',
          'Document basis for audit opinion',
          'Draft key audit matters (if applicable)',
          'Prepare audit report including TCWG',
          'Review compliance with auditing standards',
          'Obtain partner approval',
          'Prepare report for issuance'
        ],
        smartFeatures: [
          'AI opinion determiner',
          'KAM identifier and documenter',
          'Report generator',
          'Standard compliance checker'
        ]
      },
      {
        id: 'communication_tcwg',
        name: 'Communicate with TCWG',
        description: 'Present findings to audit committee or board',
        duration: '4 hours',
        tasks: [
          'Prepare management letter and findings summary',
          'Document control deficiencies and recommendations',
          'Present to audit committee/board',
          'Discuss key risks and responses',
          'Present internal control matters',
          'Discuss audit findings and implications'
        ],
        smartFeatures: [
          'AI management letter generator',
          'Finding summary creator',
          'Presentation builder',
          'Communication tracker'
        ]
      },
      {
        id: 'final_adjustments',
        name: 'Process Final Adjustments',
        description: 'Record final adjustments and get client approval',
        duration: '4 hours',
        tasks: [
          'Prepare final adjustment journal entries',
          'Ensure all audit adjustments are reflected',
          'Obtain management approval',
          'Test final numbers post-adjustment',
          'Reconcile adjusted financials',
          'Prepare final versions'
        ],
        smartFeatures: [
          'Adjustment entry automator',
          'Reconciliation validator',
          'Final number cross-checker'
        ]
      },
      {
        id: 'sign_off',
        name: 'Audit Sign-Off & Issuance',
        description: 'Final approvals and report issuance',
        duration: '2 hours',
        tasks: [
          'Obtain partner sign-off',
          'Final quality control review',
          'Prepare report for client delivery',
          'Arrange report signing',
          'Issue audit report',
          'Complete audit file'
        ],
        smartFeatures: [
          'Approval workflow automator',
          'Quality gate validator',
          'Report issuance tracker'
        ]
      }
    ]
  },

  {
    id: 'post_audit',
    name: 'Post-Audit & Continuous Learning',
    icon: '📚',
    order: 8,
    duration: 'Ongoing',
    description: 'Client service, learning, and continuous improvement',
    color: '#00897B',
    activities: [
      {
        id: 'client_service',
        name: 'Client Service & Follow-Up',
        description: 'Provide ongoing client support and services',
        duration: 'Ongoing',
        tasks: [
          'Address client questions on audit findings',
          'Provide accounting recommendations',
          'Support financial statement preparation',
          'Assist with regulatory filings',
          'Respond to regulator inquiries'
        ],
        smartFeatures: [
          'Client issue tracker',
          'Recommendation engine',
          'Q&A automation'
        ]
      },
      {
        id: 'lessons_learned',
        name: 'Lessons Learned & Improvement',
        description: 'Capture learnings and improve processes',
        duration: 'Ongoing',
        tasks: [
          'Document lessons learned',
          'Identify process improvements',
          'Update methodologies',
          'Share knowledge with team',
          'Contribute to knowledge base'
        ],
        smartFeatures: [
          'Learning capture system',
          'Process improvement tracker',
          'Knowledge sharing platform'
        ]
      },
      {
        id: 'quality_monitoring',
        name: 'Quality Monitoring & Compliance',
        description: 'Monitor audit quality and regulatory compliance',
        duration: 'Ongoing',
        tasks: [
          'Monitor quality control metrics',
          'Track compliance with auditing standards',
          'Review client feedback',
          'Manage risk register',
          'Support audit inspections'
        ],
        smartFeatures: [
          'Quality dashboard',
          'Compliance tracker',
          'Risk monitor',
          'Feedback analyzer'
        ]
      }
    ]
  }
];

/**
 * Audit Assertion Categories
 */
export const AUDIT_ASSERTIONS = {
  existence: {
    name: 'Existence or Occurrence',
    description: 'Assets, liabilities, and equity items exist at the balance sheet date, and transactions occurred during the period',
    categories: ['Cash', 'Receivables', 'Inventory', 'Fixed Assets', 'Investments', 'Liabilities', 'Equity']
  },
  completeness: {
    name: 'Completeness',
    description: 'All assets, liabilities, equity, and transactions are included in the financial statements',
    categories: ['Revenue', 'Expenses', 'Payables', 'Accruals', 'Contingencies']
  },
  accuracy: {
    name: 'Accuracy or Valuation',
    description: 'Amounts and other data relating to recorded assets, liabilities, and equity are stated at appropriate values',
    categories: ['Journal Entries', 'Valuations', 'Estimates', 'Calculations']
  },
  cutoff: {
    name: 'Cutoff',
    description: 'Transactions and events have been recorded in the correct accounting period',
    categories: ['Revenue', 'Purchases', 'Accruals', 'Estimates']
  },
  classification: {
    name: 'Classification',
    description: 'Transactions and events have been recorded in the correct account',
    categories: ['Revenue', 'Expenses', 'Liabilities', 'Equity']
  },
  presentation: {
    name: 'Presentation and Disclosure',
    description: 'Financial statement items are appropriately presented and disclosed',
    categories: ['Disclosures', 'Presentation', 'Format', 'Segment Reporting']
  }
};

/**
 * Revenue Recognition Model (IFRS 15)
 */
export const REVENUE_RECOGNITION_IFRS15 = {
  model: 'Five-Step Revenue Recognition Model',
  steps: [
    {
      step: 1,
      name: 'Identify the Contract',
      description: 'Determine if an arrangement is a contract with a customer',
      procedures: [
        'Identify party obligations',
        'Determine payment terms',
        'Assess contract enforceability',
        'Document contract terms'
      ]
    },
    {
      step: 2,
      name: 'Identify Performance Obligations',
      description: 'Identify distinct goods or services promised in the contract',
      procedures: [
        'List all promised goods/services',
        'Assess if items are separately identifiable',
        'Group items if not separately identifiable',
        'Document performance obligations'
      ]
    },
    {
      step: 3,
      name: 'Determine Transaction Price',
      description: 'Determine the total consideration for the contract',
      procedures: [
        'Identify fixed consideration',
        'Estimate variable consideration',
        'Evaluate constraining estimates',
        'Assess financing component',
        'Consider non-cash consideration'
      ]
    },
    {
      step: 4,
      name: 'Allocate Transaction Price',
      description: 'Allocate transaction price to performance obligations',
      procedures: [
        'Determine standalone selling prices',
        'Apply adjustment methods if needed',
        'Allocate based on proportionate weights',
        'Document allocation methodology'
      ]
    },
    {
      step: 5,
      name: 'Recognize Revenue',
      description: 'Recognize revenue as performance obligations are satisfied',
      procedures: [
        'Determine satisfaction method (point in time vs. over time)',
        'Monitor performance progress',
        'Record revenue transactions',
        'Evaluate contract modifications'
      ]
    }
  ],
  revenueTypes: [
    {
      type: 'Product Sales',
      recognitionPoint: 'Control of goods transfer',
      indicators: ['Title transfer', 'Risk/reward transfer', 'Customer acceptance'],
      commonAreas: ['Inventory shipped', 'FOB terms', 'Delivery conditions']
    },
    {
      type: 'Service Revenue',
      recognitionPoint: 'Over time or point in time',
      indicators: ['Performance completion', 'Milestones achieved', 'Time-based'],
      commonAreas: ['Consulting', 'Support contracts', 'Maintenance']
    },
    {
      type: 'Subscription/Membership',
      recognitionPoint: 'Over time',
      indicators: ['Monthly/annual membership', 'Access provision', 'Continuous service'],
      commonAreas: ['SaaS', 'Memberships', 'Subscriptions']
    },
    {
      type: 'Construction Contracts',
      recognitionPoint: 'Over time',
      indicators: ['Progress to completion', 'Percentage of completion', 'Effort-based'],
      commonAreas: ['Project completion', 'Milestone achievement']
    }
  ]
};

/**
 * Control Environment Assessment
 */
export const CONTROL_ENVIRONMENT = {
  components: [
    {
      component: 'Governance & Independence',
      description: 'Board of Directors and Audit Committee effectiveness',
      factors: [
        'Board composition and independence',
        'Audit committee effectiveness',
        'Management accountability',
        'Oversight of controls',
        'Independence from management'
      ]
    },
    {
      component: 'Ethical Values & Integrity',
      description: 'Tone at the top and ethical standards',
      factors: [
        'Code of conduct',
        'Management example',
        'Whistleblower process',
        'Discipline for violations',
        'Ethical decision-making'
      ]
    },
    {
      component: 'Commitment to Competence',
      description: 'Competence and training of staff',
      factors: [
        'Job descriptions and requirements',
        'Recruitment standards',
        'Training programs',
        'Performance evaluations',
        'Development opportunities'
      ]
    },
    {
      component: 'Accountability',
      description: 'Clear assignments of responsibility',
      factors: [
        'Organizational structure',
        'Clear roles and responsibilities',
        'Performance targets',
        'Accountability mechanisms',
        'Authority and delegation'
      ]
    },
    {
      component: 'Management Philosophy & Operating Style',
      description: 'Management approach to business and risks',
      factors: [
        'Risk appetite',
        'Business strategy',
        'Approach to change',
        'Decision-making culture',
        'Financial reporting emphasis'
      ]
    }
  ]
};

/**
 * IT Systems Assessment Framework
 */
export const IT_SYSTEMS_ASSESSMENT = {
  generalControls: [
    {
      area: 'Access Controls',
      controls: [
        'User account creation and termination',
        'Segregation of duties in IT',
        'Password policies',
        'Multi-factor authentication',
        'System access logging'
      ]
    },
    {
      area: 'Change Management',
      controls: [
        'Change request process',
        'Testing requirements',
        'Approval workflows',
        'Emergency change procedures',
        'Version control'
      ]
    },
    {
      area: 'System Operations',
      controls: [
        'System monitoring',
        'Backup and recovery procedures',
        'System availability monitoring',
        'Performance monitoring',
        'Incident management'
      ]
    },
    {
      area: 'Data Security',
      controls: [
        'Data encryption',
        'Database security',
        'Data backup procedures',
        'Disaster recovery',
        'Data classification'
      ]
    },
    {
      area: 'Application Controls',
      controls: [
        'Input validation',
        'Data reconciliation',
        'Processing controls',
        'Output verification',
        'System configuration'
      ]
    }
  ]
};

export default {
  AUDIT_WORKFLOW_PHASES,
  AUDIT_ASSERTIONS,
  REVENUE_RECOGNITION_IFRS15,
  CONTROL_ENVIRONMENT,
  IT_SYSTEMS_ASSESSMENT
};
