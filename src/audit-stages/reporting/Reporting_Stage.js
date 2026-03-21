/**
 * Reporting Phase
 * ==============
 * ISA Alignment: ISA 700, 705, 706, 710, 720
 * Duration: 1-2 weeks
 * Key Objective: Form opinion and report findings to appropriate parties
 */

export const reportingStage = {
  phaseName: 'Reporting',
  isaAlignment: ['ISA 700', 'ISA 705', 'ISA 706', 'ISA 710', 'ISA 720'],
  duration: '1-2 weeks',
  objective: 'Form audit opinion and communicate findings to stakeholders',

  keyActivities: {
    '1_opinion_formation': {
      name: 'Form Audit Opinion',
      description: 'Form opinion on fair presentation of financial statements',
      subActivities: [
        {
          name: 'Opinion Conclusion Assessment',
          description: 'Final assessment of basis for opinion',
          procedures: [
            'Sufficient appropriate audit evidence assessment',
            'Fair presentation evaluation',
            'Going concern conclusion',
            'Subsequent events assessment',
            'Disclosure adequacy',
            'Accounting standard compliance'
          ],
          expectedOutput: 'Opinion conclusion memo'
        },
        {
          name: 'Opinion Type Finalization',
          description: 'Finalize opinion type and basis',
          opinionTypes: {
            'Unqualified Opinion': {
              conditions: [
                'Financial statements fairly present in all material respects',
                'No scope limitations',
                'No material misstatements',
                'Adequate disclosures'
              ],
              structure: ['Opinion paragraph', 'Basis for opinion', 'Key audit matters (if applicable)']
            },
            'Qualified Opinion': {
              conditions: [
                'Limited scope or minor misstatement',
                'Not pervasive to financial statements',
                'Specific accounts/areas affected'
              ],
              structure: ['Basis for qualified opinion', 'Qualified opinion paragraph']
            },
            'Adverse Opinion': {
              conditions: [
                'Material misstatement affecting fair presentation',
                'Pervasive to financial statements',
                'Do not fairly present'
              ],
              structure: ['Basis for adverse opinion', 'Adverse opinion paragraph']
            },
            'Disclaimer of Opinion': {
              conditions: [
                'Unable to form any opinion',
                'Significant scope limitation',
                'Inability to obtain sufficient evidence'
              ],
              structure: ['Basis for disclaimer', 'Disclaimer paragraph']
            }
          },
          expectedOutput: 'Opinion determination memo'
        }
      ]
    },

    '2_auditor_report_preparation': {
      name: 'Prepare Auditor\'s Report',
      description: 'Draft and finalize auditor\'s report per ISA 700',
      subActivities: [
        {
          name: 'Auditor Report Structure',
          description: 'Prepare complete auditor report',
          requiredSections: {
            title: {
              requirement: 'Clearly indicate it is an independent auditor\'s report'
            },
            addressee: {
              requirement: 'Addressed to shareholders, board, or audit committee'
            },
            opinionParagraph: {
              requirement: 'Clear statement of opinion on financial statements',
              content: [
                'Whether statements fairly present',
                'Accounting standards compliance',
                'Materiality declaration',
                'Basis for opinion reference'
              ]
            },
            basisForOpinionSection: {
              requirement: 'ISA compliance, independence, and quality control',
              content: [
                'ISA compliance statement',
                'Independence statement',
                'Quality control statement',
                'Professional skepticism',
                'Sufficient appropriate evidence'
              ]
            },
            keyAuditMatters: {
              requirement: 'For PIEs (Public Interest Entities) - if applicable',
              content: [
                '3-5 most significant audit matters',
                'Why considered significant',
                'How addressed in audit',
                'Related disclosures reference'
              ]
            },
            otherInformation: {
              requirement: 'Review and reporting on other information',
              content: [
                'MD&A review (if applicable)',
                'Consistency with financial statements',
                'Misstatement identification',
                'Opinion on other information (if required)'
              ]
            },
            responsibilitiesOfManagement: {
              requirement: 'Describe management\'s responsibilities',
              content: [
                'Preparation and fair presentation responsibility',
                'Internal controls establishment',
                'Estimates and judgments',
                'Fraud prevention'
              ]
            },
            responsibilitiesOfAuditor: {
              requirement: 'Describe auditor\'s responsibilities',
              content: [
                'Audit objective',
                'Risk-based approach',
                'Sufficient appropriate evidence',
                'Reasonable assurance definition',
                'Internal controls evaluation'
              ]
            },
            auditorsSignature: {
              requirement: 'Manual or digital signature',
              requirement2: 'Senior Statutory Auditor name (UK/EU if applicable)'
            },
            auditFirm: {
              requirement: 'Name of auditing firm'
            },
            auditDate: {
              requirement: 'Date of audit report'
            },
            auditLocation: {
              requirement: 'Place of audit completion'
            }
          },
          expectedOutput: 'Draft auditor report'
        },
        {
          name: 'Report Customization by Jurisdiction',
          description: 'Customize report per jurisdiction requirements',
          jurisdictionConsiderations: {
            UK: [
              'UK Corporate Governance Code compliance',
              'FCA Handbook requirements',
              'Going concern statement',
              'Viability statement assessment (FTSE 350)',
              'Listed company format'
            ],
            EU: [
              'EU Audit Regulation compliance',
              'Extended auditor report',
              'Audit fee disclosure',
              'Auditor rotation statement',
              'Safeguards against independence threats'
            ],
            US: [
              'PCAOB standards compliance',
              'Public company format (if applicable)',
              'Internal control opinion (if applicable)',
              'SOX 404 compliance'
            ],
            Pakistan: [
              'ISA compliance',
              'Local format requirements',
              'Tax compliance statement',
              'FBR notification'
            ]
          },
          expectedOutput: 'Jurisdiction-specific auditor report'
        },
        {
          name: 'Key Audit Matters Development (if applicable)',
          description: 'Develop detailed KAM descriptions',
          kamProcess: [
            'Identify 3-5 most significant matters',
            'Consider auditor attention required',
            'Consider management judgments',
            'Consider complex or unusual transactions',
            'Provide sufficient context',
            'Describe how addressed',
            'Clear and transparent communication'
          ],
          expectedOutput: 'Key audit matters descriptions'
        }
      ]
    },

    '3_internal_control_reporting': {
      name: 'Internal Control Reporting (if applicable)',
      description: 'Report on internal controls (for public companies/SOX)',
      subActivities: [
        {
          name: 'Internal Control Opinion Formation',
          description: 'Form opinion on internal controls over financial reporting',
          isaAlignment: 'ISA 265 / PCAOB AS 1305',
          procedures: [
            'Control environment assessment',
            'Risk assessment procedures',
            'Control design evaluation',
            'Control operating effectiveness',
            'Compensating controls evaluation',
            'Material weakness identification'
          ],
          expectedOutput: 'Internal control opinion basis'
        },
        {
          name: 'Control Deficiency Classification',
          description: 'Classify identified control deficiencies',
          classifications: {
            'Deficiency': {
              definition: 'Control design or operation flaw preventing errors',
              examples: ['Missing approval', 'Lack of segregation', 'Weak oversight']
            },
            'Significant Deficiency': {
              definition: 'Deficiency or combination more than trivial, less than material',
              examples: ['Preventive control weakness', 'Detective control issue']
            },
            'Material Weakness': {
              definition: 'Reasonable possibility of material misstatement',
              examples: ['Critical control bypass', 'No evidence of operation', 'Override capability']
            }
          },
          expectedOutput: 'Control deficiency summary'
        },
        {
          name: 'Management Letter of Recommendations',
          description: 'Prepare management letter with control improvements',
          recommendations: [
            'Significant deficiencies to address',
            'Operational improvements',
            'System enhancements',
            'Policy modifications',
            'Training needs'
          ],
          expectedOutput: 'Management letter with recommendations'
        }
      ]
    },

    '4_management_communications': {
      name: 'Management and Governance Communications',
      description: 'Communicate audit conclusions to governance',
      subActivities: [
        {
          name: 'Audit Committee Report',
          description: 'Prepare comprehensive report for audit committee',
          contents: [
            'Audit scope and objectives',
            'Materiality levels',
            'Audit risks identified',
            'Key audit matters',
            'Significant accounting judgments',
            'Management estimates evaluation',
            'Going concern assessment',
            'Accounting policy changes',
            'Internal control findings',
            'Audit adjustments (recorded and not recorded)',
            'Non-compliance with laws/regulations',
            'Independence confirmation',
            'Quality control procedures'
          ],
          expectedOutput: 'Audit committee communication'
        },
        {
          name: 'Management Letter',
          description: 'Formal letter to management with findings',
          contents: [
            'Audit scope and objectives',
            'System and control observations',
            'Operational recommendations',
            'Accounting and disclosure observations',
            'Best practices recommendations',
            'Management responses request',
            'Follow-up timelines'
          ],
          expectedOutput: 'Management letter'
        },
        {
          name: 'Verbal Debriefing',
          description: 'Conduct verbal briefings with key stakeholders',
          participants: [
            'Audit committee chair',
            'CFO and finance leadership',
            'Board of directors (as appropriate)',
            'Internal audit (if applicable)'
          ],
          topics: [
            'Audit results and opinion',
            'Significant findings',
            'Control recommendations',
            'Financial statement impacts',
            'Next year\'s considerations'
          ],
          expectedOutput: 'Meeting notes and attendance'
        }
      ]
    },

    '5_financial_statements_finalization': {
      name: 'Financial Statements Finalization',
      description: 'Work with management to finalize financial statements',
      subActivities: [
        {
          name: 'Final Financial Statements Review',
          description: 'Review and approve final financial statements',
          procedures: [
            'All audited amounts agree to working papers',
            'Audit adjustments reflected',
            'Management adjustments reflected',
            'Accounting standards compliance',
            'Disclosure completeness',
            'Cross-reference validation',
            'Reasonableness check'
          ],
          expectedOutput: 'Final financial statements sign-off'
        },
        {
          name: 'Financial Statement Presentation',
          description: 'Ensure proper presentation and format',
          requirements: [
            'Consistent formatting',
            'Clear headings and labels',
            'Proper alignment',
            'Disclosure organization',
            'Cross-reference accuracy',
            'Footnote clarity',
            'Comparative figures'
          ],
          expectedOutput: 'Final formatted financial statements'
        }
      ]
    },

    '6_other_reporting_requirements': {
      name: 'Other Reporting Requirements',
      description: 'Fulfill additional reporting obligations',
      subActivities: [
        {
          name: 'Regulatory Reporting',
          description: 'Submit reports to regulatory authorities (if required)',
          examples: [
            'SEC filings (Form 10-K/20-F for US companies)',
            'FCA reporting (UK listed companies)',
            'ESMA reporting (EU)',
            'Tax audit certificates (Pakistan/other jurisdictions)',
            'Stock exchange notifications'
          ],
          expectedOutput: 'Regulatory submission confirmation'
        },
        {
          name: 'Other Stakeholder Communications',
          description: 'Provide reports to other stakeholders',
          recipients: [
            'Banks (if required by credit agreements)',
            'Regulatory bodies requiring auditor communication',
            'Specified users (in restricted use audits)',
            'Component auditors (group audits)',
            'Predecessor auditors (if applicable)'
          ],
          expectedOutput: 'Stakeholder communication confirmation'
        },
        {
          name: 'Subsequent Events - Final Check',
          description: 'Final check for subsequent events after report signing',
          procedures: [
            'Events through report sign date',
            'Subsequent disclosure adequacy',
            'Adjustment necessity',
            'Disclosure assessment'
          ],
          expectedOutput: 'Subsequent events final sign-off'
        }
      ]
    },

    '7_publication_and_delivery': {
      name: 'Publication and Delivery of Reports',
      description: 'Manage publication and distribution of audit report',
      subActivities: [
        {
          name: 'Report Distribution',
          description: 'Coordinate distribution of audit report',
          recipients: [
            'Audit committee',
            'Board of directors',
            'Management',
            'Regulatory authorities (as required)',
            'Financial statement users (as appropriate)',
            'Custodial arrangements'
          ],
          procedures: [
            'Distribution list preparation',
            'Delivery method confirmation',
            'Recipient acknowledgment',
            'Record retention',
            'Confidentiality management'
          ],
          expectedOutput: 'Distribution confirmation'
        },
        {
          name: 'Public Company Filings',
          description: 'Manage SEC and exchange filings (if applicable)',
          procedures: [
            'EDGAR filing preparation (if applicable)',
            'Attestation provider signature',
            'Filing timeline management',
            'SOX compliance verification',
            'Stock exchange notification'
          ],
          expectedOutput: 'Filing confirmation'
        },
        {
          name: 'Press Release and Announcements',
          description: 'Coordinate public announcements (if applicable)',
          procedures: [
            'Management press release review',
            'Auditor name/opinion consistency',
            'Material information disclosure',
            'Regulatory announcement'
          ],
          expectedOutput: 'Announcement coordination memo'
        }
      ]
    },

    '8_post_report_responsibilities': {
      name: 'Post-Report Responsibilities',
      description: 'Complete audit engagement',
      subActivities: [
        {
          name: 'Auditor Report Signing',
          description: 'Execute auditor report signature',
          procedures: [
            'Manual or digital signature',
            'Senior Statutory Auditor signature (where required)',
            'Firm authorization',
            'Date of report completion',
            'Location of audit completion'
          ],
          expectedOutput: 'Signed audit report'
        },
        {
          name: 'Post-Issuance Subsequent Events Procedures',
          description: 'Subsequent event procedures after report issuance',
          isaAlignment: 'ISA 560',
          procedures: [
            'Procedures through report date',
            'Procedures between report date and issuance',
            'Procedures after issuance (if applicable)',
            'New information assessment',
            'Financial statement amendment requirement',
            'New disclosure requirement'
          ],
          expectedOutput: 'Post-issuance procedures memo'
        },
        {
          name: 'Audit File Finalization',
          description: 'Complete and finalize audit file',
          procedures: [
            'All working papers assembled',
            'Audit file organization',
            'Documentation completeness checklist',
            'Review sign-off completion',
            'Archiving procedures',
            'Records retention policy'
          ],
          expectedOutput: 'Final audit file sign-off'
        },
        {
          name: 'Engagement Closeout',
          description: 'Close out audit engagement',
          procedures: [
            'Time tracking finalization',
            'Fee billing',
            'Expense documentation',
            'Confidentiality agreements',
            'Successor auditor transition (if applicable)',
            'Client satisfaction feedback'
          ],
          expectedOutput: 'Engagement closeout checklist'
        }
      ]
    }
  },

  keyDocumentation: [
    'Opinion conclusion memo',
    'Auditor report (draft and final)',
    'Key audit matters descriptions (if applicable)',
    'Internal control opinion (if applicable)',
    'Management letter',
    'Audit committee communication',
    'Final financial statements',
    'Regulatory submissions',
    'Post-report procedures memo',
    'Engagement closeout checklist'
  ],

  controlPoints: [
    'Opinion type finalized',
    'Auditor report completed and reviewed',
    'Key audit matters identified (if applicable)',
    'Audit committee communication prepared',
    'Management letter completed',
    'Financial statements finalized and agreed',
    'Regulatory submissions completed',
    'Report signed by authorized auditor',
    'Engagement quality review final sign-off',
    'Audit file complete and archived'
  ],

  timelineEstimates: {
    opinionFormation: '1-2 days',
    auditReportPreparation: '2-3 days',
    internalControlReporting: '2-3 days',
    managementCommunications: '2-3 days',
    financialStatementsFinalization: '1-2 days',
    otherReporting: '1-2 days',
    publicationAndDelivery: '1-2 days',
    postReportResponsibilities: '2-3 days',
    total: '7-14 days'
  }
};

export default reportingStage;
