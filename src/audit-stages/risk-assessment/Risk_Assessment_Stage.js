/**
 * Risk Assessment Phase of Audit Engagement
 * =========================================
 * ISA Alignment: ISA 315, 330, 402
 * Duration: 1-2 weeks
 * Key Objective: Obtain comprehensive understanding of entity, identify and assess risks
 */

export const riskAssessmentStage = {
  phaseName: 'Risk Assessment',
  isaAlignment: ['ISA 315', 'ISA 330', 'ISA 402'],
  duration: '1-2 weeks',
  objective: 'Identify and assess risks of misstatement in financial statements',

  keyActivities: {
    '1_entity_understanding': {
      name: 'Obtain Deep Understanding of Entity',
      description: 'Develop comprehensive knowledge of business, operations, and environment',
      subActivities: [
        {
          name: 'Business Model Analysis',
          description: 'Understand how entity creates value and generates revenue',
          requirements: [
            'Revenue streams identification',
            'Business model documentation',
            'Customer base analysis',
            'Supplier relationships',
            'Distribution channels'
          ],
          expectedOutput: 'Business model overview document'
        },
        {
          name: 'Organizational Structure',
          description: 'Document organizational structure and reporting lines',
          requirements: [
            'Entity structure diagram',
            'Subsidiary relationships',
            'Key management bios',
            'Board composition',
            'Governance structure'
          ],
          expectedOutput: 'Organizational structure chart and matrix'
        },
        {
          name: 'Accounting and IT Systems',
          description: 'Understand systems, processes, and data flows',
          requirements: [
            'ERP system overview',
            'Key modules and functions',
            'System interfaces',
            'Data security measures',
            'IT governance structure'
          ],
          expectedOutput: 'IT systems documentation'
        },
        {
          name: 'Key Business Processes',
          description: 'Map critical accounting and operational processes',
          processes: [
            'Order-to-cash (revenue cycle)',
            'Procure-to-pay (purchasing cycle)',
            'Record-to-report (financial close)',
            'Fixed asset management',
            'Payroll processing'
          ],
          expectedOutput: 'Process flow documentation'
        }
      ]
    },

    '2_regulatory_environment': {
      name: 'Assess Regulatory and Compliance Environment',
      description: 'Identify all applicable laws, regulations, and compliance obligations',
      subActivities: [
        {
          name: 'Regulatory Requirements Mapping',
          description: 'Identify all applicable regulations and standards',
          areas: [
            'Accounting standards (IFRS/GAAP)',
            'Industry-specific regulations',
            'Tax laws and requirements',
            'Data protection (GDPR, etc.)',
            'Environmental regulations',
            'Labor and employment laws'
          ],
          expectedOutput: 'Compliance requirements matrix'
        },
        {
          name: 'Regulatory Compliance Assessment',
          description: 'Evaluate compliance with identified regulations',
          requirements: [
            'Prior audit findings',
            'Management compliance procedures',
            'Regulatory correspondence',
            'Compliance audit results',
            'Non-compliance incidents'
          ],
          expectedOutput: 'Compliance assessment report'
        },
        {
          name: 'Going Concern Preliminary Assessment',
          description: 'Preliminarily assess going concern assumptions',
          requirements: [
            'Financial condition review',
            'Cash flow projections',
            'Debt covenants analysis',
            'Related party relationships',
            'Subsequent events'
          ],
          expectedOutput: 'Going concern preliminary assessment'
        }
      ]
    },

    '3_inherent_risk_assessment': {
      name: 'Assess Inherent Risks of Misstatement',
      description: 'Identify and evaluate inherent risks at assertion level',
      subActivities: [
        {
          name: 'Financial Statement Area Risk Assessment',
          description: 'Evaluate inherent risk for each accounting area',
          areas: {
            'Revenue': {
              riskFactors: [
                'Complex revenue arrangements',
                'Channel length',
                'Judgment in recognition',
                'Side agreements',
                'Returns/allowances'
              ],
              typicalRisks: [
                'Overstating revenue',
                'Cutoff errors',
                'Fictitious transactions',
                'Returns not recorded'
              ]
            },
            'Inventory': {
              riskFactors: [
                'Valuation complexity',
                'Obsolescence risk',
                'Inventory management',
                'Count procedures',
                'Lower of cost/NRV'
              ],
              typicalRisks: [
                'Overstating inventory value',
                'Obsolete inventory not written down',
                'Count discrepancies',
                'Valuation errors'
              ]
            },
            'Fixed Assets': {
              riskFactors: [
                'Capitalization judgments',
                'Depreciation methodology',
                'Impairment risk',
                'Disposals and retirements',
                'Maintenance vs. capital'
              ],
              typicalRisks: [
                'Capitalizing expenses',
                'Not recording retirements',
                'Inappropriate depreciation',
                'Impairment not recognized'
              ]
            },
            'Debt and Equity': {
              riskFactors: [
                'Complex debt arrangements',
                'Related party transactions',
                'Covenant compliance',
                'Equity transactions',
                'Derivatives and hedging'
              ],
              typicalRisks: [
                'Off-balance sheet financing',
                'Debt classification',
                'Covenant breach not disclosed',
                'Equity transactions misstated'
              ]
            },
            'Estimates and Judgments': {
              riskFactors: [
                'Fair value measurements',
                'Allowances for doubtful debts',
                'Warranty provisions',
                'Pension obligations',
                'Tax provisions'
              ],
              typicalRisks: [
                'Management bias in estimates',
                'Inadequate supporting documentation',
                'Methodologies not applied consistently',
                'Changes not disclosed'
              ]
            }
          },
          expectedOutput: 'Inherent risk assessment schedule'
        },
        {
          name: 'Fraud Risk Assessment',
          description: 'Assess risk of material misstatement due to fraud',
          riskAreas: [
            'Management override of controls',
            'Inflated revenue recognition',
            'Asset misappropriation',
            'Disclosure manipulation',
            'Related party fraud'
          ],
          expectedOutput: 'Fraud risk assessment memo'
        },
        {
          name: 'Non-Compliance Risk Assessment',
          description: 'Assess risk of non-compliance with laws and regulations',
          requirements: [
            'Anti-bribery (FCPA, UK Bribery Act)',
            'Sanctions and export controls',
            'Environmental compliance',
            'Data protection',
            'Tax compliance'
          ],
          expectedOutput: 'Non-compliance risk matrix'
        }
      ]
    },

    '4_control_environment': {
      name: 'Evaluate Control Environment',
      description: 'Assess tone at top, values, accountability, and competence',
      subActivities: [
        {
          name: 'Tone at Top Assessment',
          description: 'Evaluate management\'s commitment to integrity',
          requirements: [
            'Board/audit committee minutes review',
            'Code of conduct existence and communication',
            'Whistleblower procedures',
            'Ethics training and enforcement',
            'Management philosophy observations'
          ],
          expectedOutput: 'Tone at top assessment'
        },
        {
          name: 'Organizational Competence',
          description: 'Evaluate competence and experience of key personnel',
          requirements: [
            'CFO and finance team experience',
            'Accounting staff turnover',
            'Training and development programs',
            'Authority and responsibility clarity',
            'Succession planning'
          ],
          expectedOutput: 'Competence assessment matrix'
        },
        {
          name: 'Accountability and Authority',
          description: 'Evaluate organizational accountability mechanisms',
          requirements: [
            'Performance metrics and reviews',
            'Compensation structure',
            'Consequence application',
            'Segregation of duties',
            'Authority limits'
          ],
          expectedOutput: 'Accountability framework document'
        }
      ]
    },

    '5_control_design_evaluation': {
      name: 'Evaluate Control Design and Operating Effectiveness',
      description: 'Assess design and current effectiveness of key controls',
      subActivities: [
        {
          name: 'Control Identification and Documentation',
          description: 'Document all significant controls in key areas',
          controlTypes: [
            'Preventive controls (prevent errors before occurrence)',
            'Detective controls (identify errors after occurrence)',
            'Corrective controls (remediate identified issues)',
            'Compensating controls (alternative control mechanisms)'
          ],
          expectedOutput: 'Control documentation and matrix'
        },
        {
          name: 'Control Walkthrough Procedures',
          description: 'Trace transactions through systems and processes',
          requirements: [
            'Select sample transactions',
            'Trace through key controls',
            'Identify control gaps',
            'Document control effectiveness indicators',
            'Note control deviations'
          ],
          expectedOutput: 'Walkthrough memo and findings'
        },
        {
          name: 'Preliminary Control Effectiveness Assessment',
          description: 'Preliminarily assess control operating effectiveness',
          requirements: [
            'Control design review',
            'Manual vs. automated control assessment',
            'Frequency of control execution',
            'Evidence of control operation',
            'Control owner involvement'
          ],
          expectedOutput: 'Preliminary control effectiveness assessment'
        }
      ]
    },

    '6_risk_response_planning': {
      name: 'Plan Audit Responses to Identified Risks',
      description: 'Design procedures responsive to identified risks',
      subActivities: [
        {
          name: 'Control Reliance Assessment',
          description: 'Determine which controls support audit procedures',
          requirements: [
            'Risk mitigation through controls',
            'Control effectiveness reliance decision',
            'Interim testing plan',
            'Final testing approach',
            'Scope of control testing'
          ],
          expectedOutput: 'Control reliance matrix'
        },
        {
          name: 'Substantive Procedure Design',
          description: 'Design substantive procedures for identified risks',
          requirements: [
            'Risk-based sample sizes',
            'Analytical procedure design',
            'Detailed testing procedures',
            'Evidence collection strategy',
            'Timing and extent'
          ],
          expectedOutput: 'Substantive procedure schedules'
        },
        {
          name: 'Specialized Risk Responses',
          description: 'Plan procedures for significant risks',
          riskCategories: [
            'Fraud risk procedures',
            'Going concern procedures',
            'Related party procedures',
            'Compliance procedures',
            'Estimate procedures'
          ],
          expectedOutput: 'Specialized risk procedure plans'
        }
      ]
    },

    '7_documentation_and_approval': {
      name: 'Risk Assessment Documentation and Approval',
      description: 'Finalize and approve risk assessment documentation',
      subActivities: [
        {
          name: 'Risk Assessment Summary',
          description: 'Prepare comprehensive risk assessment summary',
          requirements: [
            'All identified risks documented',
            'Risk ratings assigned',
            'Planned responses documented',
            'Control reliance assessed',
            'Resource implications noted'
          ],
          expectedOutput: 'Risk assessment summary document'
        },
        {
          name: 'Approval and Materialization',
          description: 'Obtain approvals and formalize approach',
          requirements: [
            'Engagement partner review',
            'Engagement Quality Reviewer approval',
            'Updated audit program finalization',
            'Team briefing and communication',
            'Resource allocation confirmation'
          ],
          expectedOutput: 'Approved risk assessment and updated audit plan'
        }
      ]
    }
  },

  keyDocumentation: [
    'Business Model and Entity Overview',
    'Regulatory Compliance Matrix',
    'Inherent Risk Assessment',
    'Fraud Risk Assessment',
    'Control Environment Evaluation',
    'Control Documentation and Walkthrough Memos',
    'Preliminary Control Effectiveness Assessment',
    'Updated Audit Plan and Programs',
    'Engagement Quality Review Sign-off'
  ],

  controlPoints: [
    'Business model understanding confirmation',
    'Regulatory requirements matrix completion',
    'Inherent risk assessment completion and approval',
    'Fraud risk assessment completion',
    'Control documentation review and approval',
    'Walkthrough procedure completion',
    'Risk response plan approval',
    'Updated audit program approval'
  ],

  timelineEstimates: {
    entityUnderstanding: '3-4 days',
    regulatoryAssessment: '2-3 days',
    inherentRiskAssessment: '3-4 days',
    controlEnvironment: '2-3 days',
    controlDesignEvaluation: '3-4 days',
    riskResponsePlanning: '2-3 days',
    documentationAndApproval: '1-2 days',
    total: '7-14 days'
  }
};

export default riskAssessmentStage;
