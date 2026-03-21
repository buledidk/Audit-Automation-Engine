/**
 * Interim Audit Phase
 * ==================
 * ISA Alignment: ISA 330, 500, 501, 505, 510
 * Duration: 1-3 weeks (typically before year-end)
 * Key Objective: Test controls and gather preliminary evidence
 */

export const interimStage = {
  phaseName: 'Interim Audit',
  isaAlignment: ['ISA 330', 'ISA 500', 'ISA 501', 'ISA 505', 'ISA 510'],
  duration: '1-3 weeks',
  objective: 'Test control operating effectiveness and gather preliminary evidence',

  keyActivities: {
    '1_control_testing': {
      name: 'Test Operating Effectiveness of Controls',
      description: 'Execute control testing procedures planned in risk assessment phase',
      subActivities: [
        {
          name: 'Control Walkthrough Execution',
          description: 'Execute walkthrough procedures for all significant controls',
          requirements: [
            'Transaction sample selection',
            'Complete control execution trace',
            'Evidence collection',
            'Control deviation documentation',
            'Remediation assessment'
          ],
          expectedOutput: 'Walkthrough testing memos'
        },
        {
          name: 'Compliance Testing',
          description: 'Test compliance with identified controls',
          procedures: [
            'Testing transaction authorization',
            'Approval chain verification',
            'System access controls verification',
            'Segregation of duties testing',
            'Supporting documentation verification'
          ],
          expectedOutput: 'Compliance testing schedules'
        },
        {
          name: 'IT General Controls Testing',
          description: 'Test IT controls supporting financial reporting',
          areas: [
            'System access and authentication',
            'Change management procedures',
            'System backup and recovery',
            'Segregation of IT duties',
            'Monitoring and logging'
          ],
          expectedOutput: 'IT control testing documentation'
        }
      ]
    },

    '2_revenue_cycle': {
      name: 'Interim Revenue Cycle Procedures',
      description: 'Test revenue cycle controls and gather preliminary evidence',
      subActivities: [
        {
          name: 'Order-to-Cash Process Testing',
          description: 'Test controls in order processing, invoicing, collections',
          procedures: [
            'Order approval and authorization',
            'Pricing accuracy and authorization',
            'Invoice accuracy and completeness',
            'Receivable recording accuracy',
            'Collection procedures'
          ],
          expectedOutput: 'Revenue cycle testing memo'
        },
        {
          name: 'Receivable Preliminaries',
          description: 'Gather preliminary evidence on receivables',
          procedures: [
            'Aging analysis review',
            'Bad debt provision analysis',
            'Related party transaction identification',
            'Unusual transaction identification',
            'Confirmation request preparation'
          ],
          expectedOutput: 'Preliminary receivables assessment'
        },
        {
          name: 'Cutoff Testing',
          description: 'Preliminary cutoff testing around interim period',
          procedures: [
            'Revenue recognition cutoff review',
            'Journal entry review around period end',
            'Adjustment identification',
            'Supporting documentation review'
          ],
          expectedOutput: 'Cutoff testing memo'
        }
      ]
    },

    '3_purchasing_cycle': {
      name: 'Interim Purchasing Cycle Procedures',
      description: 'Test purchasing cycle controls and gather preliminary evidence',
      subActivities: [
        {
          name: 'Procure-to-Pay Testing',
          description: 'Test controls in purchasing, receiving, and payment',
          procedures: [
            'Purchase authorization and approval',
            'Vendor master maintenance',
            'Receiving controls',
            'Invoice matching (3-way match)',
            'Payment processing and approval'
          ],
          expectedOutput: 'Purchasing cycle testing memo'
        },
        {
          name: 'Payable Preliminaries',
          description: 'Gather preliminary evidence on payables',
          procedures: [
            'Aging analysis review',
            'Unusual vendor transaction identification',
            'Unpaid invoice completeness',
            'Accruals testing',
            'Related party transaction review'
          ],
          expectedOutput: 'Preliminary payables assessment'
        },
        {
          name: 'Inventory and Purchases',
          description: 'Preliminary inventory and purchases procedures',
          procedures: [
            'Physical count observation planning',
            'Cut-off procedures',
            'Obsolescence assessment',
            'Valuation methodology review',
            'Inventory reconciliation'
          ],
          expectedOutput: 'Inventory procedures plan'
        }
      ]
    },

    '4_payroll_cycle': {
      name: 'Interim Payroll Cycle Procedures',
      description: 'Test payroll controls and gather preliminary evidence',
      subActivities: [
        {
          name: 'Payroll System Controls Testing',
          description: 'Test payroll processing controls',
          procedures: [
            'Hiring and termination authorization',
            'Rate authorization and changes',
            'Time tracking accuracy',
            'Payroll calculation accuracy',
            'Tax and deduction calculations',
            'Payment processing controls'
          ],
          expectedOutput: 'Payroll control testing memo'
        },
        {
          name: 'Payroll Preliminaries',
          description: 'Gather preliminary payroll evidence',
          procedures: [
            'Payroll register reconciliation',
            'Compensation analysis for reasonableness',
            'Benefits accrual testing',
            'Compliance with employment laws',
            'Related party compensation review'
          ],
          expectedOutput: 'Preliminary payroll assessment'
        }
      ]
    },

    '5_financial_statement_procedures': {
      name: 'Interim Financial Statement Procedures',
      description: 'Review interim financial statements and account reconciliations',
      subActivities: [
        {
          name: 'Trial Balance and Reconciliations',
          description: 'Review trial balance and key account reconciliations',
          procedures: [
            'Trial balance review for unusual items',
            'Account reconciliation review',
            'Journal entry review and authorization',
            'Intercompany transaction review',
            'Consolidation adjustment review (if applicable)'
          ],
          expectedOutput: 'Reconciliation testing memo'
        },
        {
          name: 'Analytical Procedures - Interim',
          description: 'Perform preliminary analytical procedures',
          procedures: [
            'Revenue trends analysis',
            'Expense ratio analysis',
            'Gross margin analysis',
            'Key ratio analysis',
            'Variance from expectations'
          ],
          expectedOutput: 'Interim analytical procedures memo'
        },
        {
          name: 'Fixed Assets and Depreciation',
          description: 'Review fixed assets and depreciation schedules',
          procedures: [
            'Fixed asset register review',
            'Depreciation calculation accuracy',
            'Accumulated depreciation review',
            'Disposals and retirements testing',
            'Impairment assessment'
          ],
          expectedOutput: 'Fixed assets testing memo'
        }
      ]
    },

    '6_external_confirmations': {
      name: 'External Confirmation Procedures',
      description: 'Request and process external confirmations',
      subActivities: [
        {
          name: 'Bank Confirmation Requests',
          description: 'Send bank confirmations',
          requirements: [
            'All bank accounts identified',
            'Confirmation requests prepared',
            'Direct mailing by auditor',
            'Response tracking',
            'Discrepancy resolution'
          ],
          expectedOutput: 'Bank confirmation summary'
        },
        {
          name: 'Accounts Receivable Confirmations',
          description: 'Request customer confirmations',
          procedures: [
            'Customer list preparation',
            'Sample selection (positive/negative)',
            'Confirmation request preparation',
            'Follow-up procedures',
            'Exception resolution'
          ],
          expectedOutput: 'Receivable confirmation summary'
        },
        {
          name: 'Other Confirmations',
          description: 'Request confirmations from other parties',
          confirmationTypes: [
            'Lenders (debt confirmations)',
            'Insurance brokers (policy confirmations)',
            'Attorneys (litigation confirmations)',
            'Legal counsel (contingent liability confirmations)'
          ],
          expectedOutput: 'Confirmation tracking schedule'
        }
      ]
    },

    '7_compliance_and_contingencies': {
      name: 'Compliance and Contingency Procedures',
      description: 'Assess compliance and identify contingencies',
      subActivities: [
        {
          name: 'Compliance Documentation Review',
          description: 'Review compliance with significant regulations',
          requirements: [
            'Board/committee minutes review',
            'Regulatory correspondence review',
            'Compliance certifications',
            'Audit findings follow-up',
            'Non-compliance incidents'
          ],
          expectedOutput: 'Compliance review memo'
        },
        {
          name: 'Going Concern Preliminary Assessment Update',
          description: 'Update going concern assessment with interim data',
          procedures: [
            'Cash flow projections review',
            'Debt covenant compliance',
            'Loan renewal/refinance status',
            'Management representations',
            'Financial condition monitoring'
          ],
          expectedOutput: 'Interim going concern assessment'
        },
        {
          name: 'Legal and Contingent Liability Review',
          description: 'Review for legal issues and contingencies',
          procedures: [
            'Attorney correspondence review',
            'Litigation matter assessment',
            'Contingent liability identification',
            'Warranty and guarantee review',
            'Environmental/compliance issues'
          ],
          expectedOutput: 'Legal contingency summary'
        }
      ]
    },

    '8_management_discussions': {
      name: 'Management Discussions and Observations',
      description: 'Discuss findings with management and capture observations',
      subActivities: [
        {
          name: 'Control Deficiency Discussion',
          description: 'Discuss any control deficiencies identified',
          topics: [
            'Control design improvements',
            'Operating effectiveness issues',
            'Preventive vs. detective control balance',
            'Remediation plans',
            'Timeline for implementation'
          ],
          expectedOutput: 'Control deficiency discussion memo'
        },
        {
          name: 'Significant Risk Updates',
          description: 'Update risk assessment with interim findings',
          requirements: [
            'New risks identified',
            'Risk mitigation status',
            'Control effectiveness updates',
            'Revised audit plan implications'
          ],
          expectedOutput: 'Updated risk assessment'
        }
      ]
    }
  },

  keyDocumentation: [
    'Control Testing Memos',
    'Revenue Cycle Testing',
    'Purchasing Cycle Testing',
    'Payroll Cycle Testing',
    'Financial Statement Procedures',
    'Confirmation Summaries',
    'Compliance Review Memo',
    'Going Concern Assessment Update',
    'Interim Analytical Procedures'
  ],

  controlPoints: [
    'Control testing completion',
    'Walkthrough memo sign-off',
    'Confirmation requests sent and tracked',
    'Management discussion completion',
    'Interim findings documented',
    'Revised final audit plan approved'
  ],

  timelineEstimates: {
    controlTesting: '3-5 days',
    revenueCycleProcedures: '2-3 days',
    purchasingCycleProcedures: '2-3 days',
    payrollCycleProcedures: '1-2 days',
    financialStatementProcedures: '2-3 days',
    externalConfirmations: '3-5 days',
    complianceReview: '1-2 days',
    managementDiscussions: '1-2 days',
    total: '7-21 days'
  }
};

export default interimStage;
