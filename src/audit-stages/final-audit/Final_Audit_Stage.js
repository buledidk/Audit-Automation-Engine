/**
 * Final Audit Phase
 * ================
 * ISA Alignment: ISA 500, 501, 560, 570, 580, 600
 * Duration: 1-3 weeks (at/after year-end)
 * Key Objective: Perform substantive procedures and evaluate misstatements
 */

export const finalAuditStage = {
  phaseName: 'Final Audit',
  isaAlignment: ['ISA 500', 'ISA 501', 'ISA 560', 'ISA 570', 'ISA 580', 'ISA 600'],
  duration: '1-3 weeks',
  objective: 'Perform substantive procedures and obtain sufficient appropriate audit evidence',

  keyActivities: {
    '1_substantive_procedures': {
      name: 'Execute Substantive Procedures',
      description: 'Perform substantive testing on all material accounts',
      subActivities: [
        {
          name: 'Revenue and Receivables - Final Testing',
          description: 'Complete testing of revenue and receivables',
          procedures: [
            'Year-end receivables detail testing',
            'Revenue cutoff validation',
            'Bad debt provision adequacy',
            'Related party sales review',
            'Subsequent collections testing'
          ],
          expectedOutput: 'Revenue and receivables testing file'
        },
        {
          name: 'Inventory - Final Testing',
          description: 'Complete testing of inventory',
          procedures: [
            'Physical count observation',
            'Inventory cutoff testing',
            'Pricing and valuation testing',
            'Obsolescence assessment',
            'Inventory reserve adequacy',
            'COGS analysis'
          ],
          expectedOutput: 'Inventory testing file'
        },
        {
          name: 'Fixed Assets - Final Testing',
          description: 'Complete testing of fixed assets',
          procedures: [
            'Year-end additions testing',
            'Disposals and retirements testing',
            'Depreciation recalculation',
            'Impairment assessment',
            'Maintenance vs. capital distinction',
            'Useful life assessment'
          ],
          expectedOutput: 'Fixed assets testing file'
        },
        {
          name: 'Debt and Equity - Final Testing',
          description: 'Complete testing of debt and equity',
          procedures: [
            'Long-term debt schedule reconciliation',
            'Interest expense calculation',
            'Covenant compliance verification',
            'New debt authorization',
            'Equity transaction review',
            'Dividend compliance testing'
          ],
          expectedOutput: 'Debt and equity testing file'
        },
        {
          name: 'Accruals and Estimates - Final Testing',
          description: 'Testing of estimates and accruals',
          procedures: [
            'Warranty provision testing',
            'Pension obligation assessment',
            'Contingent liability review',
            'Environmental liabilities',
            'Tax provision testing',
            'Fair value measurement review'
          ],
          expectedOutput: 'Estimates and accruals testing file'
        },
        {
          name: 'Payables - Final Testing',
          description: 'Complete testing of payables',
          procedures: [
            'Year-end payables cutoff',
            'Unrecorded liability testing',
            'Related party transaction review',
            'Debt/operating lease distinction',
            'Warranty and guarantee obligations',
            'Accrual adequacy review'
          ],
          expectedOutput: 'Payables testing file'
        }
      ]
    },

    '2_analytical_procedures': {
      name: 'Final Analytical Procedures',
      description: 'Comprehensive analytical review at year-end',
      subActivities: [
        {
          name: 'Account Level Analytics',
          description: 'Detailed analytics for each account',
          procedures: [
            'Month-to-month trend analysis',
            'Year-over-year comparison',
            'Budget vs. actual analysis',
            'Ratio analysis and trends',
            'Variance investigation'
          ],
          expectedOutput: 'Analytical procedures summary'
        },
        {
          name: 'Consolidated Financial Statement Analytics',
          description: 'Overall financial statement analysis',
          procedures: [
            'Key financial metrics review',
            'Profitability trend analysis',
            'Liquidity and solvency analysis',
            'ROA/ROE analysis',
            'Earnings quality assessment'
          ],
          expectedOutput: 'Financial statement analytics memo'
        }
      ]
    },

    '3_estimates_and_fair_value': {
      name: 'Evaluate Accounting Estimates and Fair Values',
      description: 'Comprehensively evaluate management estimates and fair value measurements',
      subActivities: [
        {
          name: 'Estimate Identification and Evaluation',
          description: 'Evaluate all significant management estimates',
          estimates: [
            'Allowance for doubtful accounts',
            'Inventory obsolescence reserve',
            'Depreciation and amortization',
            'Pension obligations',
            'Warranty reserves',
            'Contingent liabilities',
            'Tax provisions'
          ],
          procedures: [
            'Methodology review',
            'Historical accuracy assessment',
            'Assumptions validation',
            'Supporting documentation review',
            'Subsequent event consideration',
            'Management bias identification'
          ],
          expectedOutput: 'Estimates evaluation schedule'
        },
        {
          name: 'Fair Value Measurement Review',
          description: 'Review fair value measurements (if applicable)',
          requirements: [
            'IFRS 13 / ASC 820 compliance',
            'Valuation methodology appropriateness',
            'Level of fair value hierarchy',
            'Specialist work review (if used)',
            'Subsequent event impact'
          ],
          expectedOutput: 'Fair value assessment memo'
        }
      ]
    },

    '4_subsequent_events': {
      name: 'Review Subsequent Events',
      description: 'Identify and evaluate events occurring after year-end',
      subActivities: [
        {
          name: 'Subsequent Events Procedures',
          description: 'Execute procedures to identify subsequent events',
          procedures: [
            'Post year-end bank reconciliation review',
            'Post year-end journal entries review',
            'Minutes of meetings review',
            'Debt schedules update review',
            'Confirmations follow-up',
            'Press releases and announcements review',
            'Lawsuit and contingency follow-up'
          ],
          expectedOutput: 'Subsequent events memo'
        },
        {
          name: 'Going Concern Final Assessment',
          description: 'Final going concern assessment',
          procedures: [
            'Financial projections review',
            'Covenant compliance verification',
            'Refinancing plans review',
            'Management representations',
            'Disclosure adequacy assessment'
          ],
          expectedOutput: 'Going concern final assessment'
        }
      ]
    },

    '5_management_representations': {
      name: 'Obtain Management Representations',
      description: 'Obtain written representations from management',
      subActivities: [
        {
          name: 'Representation Letter Preparation',
          description: 'Prepare and obtain management representation letter',
          representations: [
            'Fair presentation of financial statements',
            'Completeness of transactions and events',
            'Contingent liabilities completeness',
            'Related party transaction disclosure',
            'Fraud and non-compliance',
            'Estimates appropriateness',
            'Going concern assessments',
            'Subsequent events disclosure',
            'Truth of representations'
          ],
          expectedOutput: 'Signed representation letter'
        },
        {
          name: 'Specific Area Representations',
          description: 'Obtain specific representations for significant areas',
          areas: [
            'Revenue cutoff and side agreements',
            'Inventory completeness and obsolescence',
            'Investment valuations',
            'Compliance with laws and regulations',
            'Related party transactions',
            'Commitments and contingencies'
          ],
          expectedOutput: 'Specific representations documentation'
        }
      ]
    },

    '6_misstatement_evaluation': {
      name: 'Identify, Accumulate, and Evaluate Misstatements',
      description: 'Track and evaluate all identified errors and misstatements',
      subActivities: [
        {
          name: 'Misstatement Accumulation',
          description: 'Document all misstatements identified during audit',
          types: [
            'Factual misstatements (clearly incorrect)',
            'Judgmental misstatements (management judgment)',
            'Projected misstatements (extrapolated errors)'
          ],
          requirements: [
            'Quantitative assessment',
            'Qualitative factors',
            'Materiality evaluation',
            'Correction recommendations',
            'Management discussion'
          ],
          expectedOutput: 'Misstatement summary schedule'
        },
        {
          name: 'Materiality Reassessment',
          description: 'Reassess materiality based on actual year-end results',
          procedures: [
            'Actual vs. planned materiality',
            'Adjustments to materiality',
            'Performance materiality review',
            'Clear and obviously trivial threshold',
            'Accumulated misstatement assessment'
          ],
          expectedOutput: 'Final materiality assessment'
        },
        {
          name: 'Management Adjustment Evaluation',
          description: 'Evaluate management\'s response to proposed adjustments',
          requirements: [
            'Adjustment proposed vs. made',
            'Rationale for not recording adjustments',
            'Management bias assessment',
            'Overall qualitative assessment'
          ],
          expectedOutput: 'Misstatement evaluation memo'
        }
      ]
    },

    '7_consolidation_procedures': {
      name: 'Consolidation and Group Procedures (if applicable)',
      description: 'Consolidation and group audit procedures',
      subActivities: [
        {
          name: 'Group Audit Coordination',
          description: 'Coordinate with component auditors',
          procedures: [
            'Component auditor instructions',
            'Reporting package review',
            'Consolidation adjustment review',
            'Intercompany transaction testing',
            'Intra-group elimination verification'
          ],
          expectedOutput: 'Group audit coordination memo'
        },
        {
          name: 'Consolidation Testing',
          description: 'Test consolidation process and adjustments',
          procedures: [
            'Trial balance reconciliation',
            'Intercompany balances verification',
            'Consolidation adjustment authorization',
            'Fair value measurement adjustment review',
            'Goodwill and impairment testing'
          ],
          expectedOutput: 'Consolidation testing memo'
        }
      ]
    },

    '8_quality_control_review': {
      name: 'Final Quality Control Review',
      description: 'Comprehensive review of audit work and conclusions',
      subActivities: [
        {
          name: 'Engagement Quality Review',
          description: 'Senior auditor quality control review',
          procedures: [
            'Audit file completeness review',
            'Key areas review',
            'Risk assessment alignment',
            'Procedures adequacy',
            'Evidence sufficiency',
            'Accounting treatment appropriateness',
            'Disclosure adequacy',
            'Going concern assessment review'
          ],
          expectedOutput: 'Engagement quality review sign-off'
        },
        {
          name: 'Peer Review',
          description: 'Independent peer review (if required)',
          procedures: [
            'Methodology review',
            'Conclusions validation',
            'Disclosure assessment',
            'Risk-appropriate procedures',
            'Documentation completeness'
          ],
          expectedOutput: 'Peer review memo'
        }
      ]
    }
  },

  keyDocumentation: [
    'Substantive procedure testing files',
    'Analytical procedures summary',
    'Estimates and fair value evaluation',
    'Subsequent events memo',
    'Management representation letter',
    'Misstatement summary schedule',
    'Quality control review sign-off',
    'Final audit conclusions memo'
  ],

  controlPoints: [
    'All substantive procedures completed',
    'Misstatement evaluation and accumulation',
    'Management representation letter signed',
    'Subsequent events procedures completed',
    'Going concern final assessment',
    'Quality control review completion',
    'Audit conclusions reached'
  ],

  timelineEstimates: {
    substantiveProcedures: '5-10 days',
    analyticalProcedures: '2-3 days',
    estimatesAndFairValue: '2-3 days',
    subsequentEvents: '2-3 days',
    managementRepresentations: '1-2 days',
    misstatementEvaluation: '2-3 days',
    consolidationProcedures: '2-3 days',
    qualityControlReview: '2-3 days',
    total: '7-21 days'
  }
};

export default finalAuditStage;
