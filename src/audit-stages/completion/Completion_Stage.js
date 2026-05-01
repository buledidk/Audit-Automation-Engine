/**
 * Completion/Finalization Phase
 * ============================
 * ISA Alignment: ISA 560, 570, 580, 620, 700
 * Duration: 1 week
 * Key Objective: Finalize audit work and prepare for reporting
 */

export const completionStage = {
  phaseName: 'Completion',
  isaAlignment: ['ISA 560', 'ISA 570', 'ISA 580', 'ISA 620', 'ISA 700'],
  duration: '1 week',
  objective: 'Complete audit procedures and finalize all documentation',

  keyActivities: {
    '1_final_analytical_review': {
      name: 'Final Analytical Procedures and Review',
      description: 'Overall financial statement review and analytical procedures',
      subActivities: [
        {
          name: 'Overall Reasonableness Check',
          description: 'Final review of overall financial statement reasonableness',
          procedures: [
            'Statement of financial position reasonableness',
            'Income statement trends',
            'Cash flow statement logic',
            'Ratio analysis reasonableness',
            'Significant balance changes'
          ],
          expectedOutput: 'Final analytical procedures memo'
        },
        {
          name: 'Disclosure and Presentation Review',
          description: 'Review completeness and appropriateness of disclosures',
          requirements: [
            'IAS 1 / ASC 235 compliance (presentation)',
            'Accounting policy disclosures',
            'Related party transaction disclosures',
            'Contingency disclosures',
            'Subsequent event disclosures',
            'Segment disclosures (if applicable)',
            'Going concern disclosures'
          ],
          expectedOutput: 'Disclosure review checklist'
        }
      ]
    },

    '2_specialist_reports': {
      name: 'Review Specialist Reports (if applicable)',
      description: 'Evaluate and integrate specialist work',
      subActivities: [
        {
          name: 'Valuation Specialist Review',
          description: 'Review and evaluate valuation specialist reports',
          requirements: [
            'Engagement letter review',
            'Methodology appropriateness',
            'Assumptions validation',
            'Conclusions alignment',
            'Fair value hierarchy classification'
          ],
          expectedOutput: 'Specialist report evaluation memo'
        },
        {
          name: 'IT Specialist Review',
          description: 'Review IT specialist control assessment',
          requirements: [
            'IT general controls testing results',
            'System reliability for audit purposes',
            'Control deficiency assessment',
            'Implications for substantive procedures'
          ],
          expectedOutput: 'IT specialist assessment'
        },
        {
          name: 'Other Specialist Reviews',
          description: 'Review work of actuaries, environmental specialists, etc.',
          requirements: [
            'Competence and objectivity assessment',
            'Scope and methodology review',
            'Assumptions validation',
            'Conclusions alignment'
          ],
          expectedOutput: 'Specialist reports summary'
        }
      ]
    },

    '3_audit_team_correspondence': {
      name: 'Component and Team Member Correspondence Review',
      description: 'Review communications with component auditors and team members',
      subActivities: [
        {
          name: 'Component Auditor Review',
          description: 'Review and accept component auditor conclusions',
          procedures: [
            'Component audit report review',
            'Significant findings follow-up',
            'Component materiality assessment',
            'Modifications to component opinion',
            'Intra-group transactions review'
          ],
          expectedOutput: 'Component auditor summary'
        },
        {
          name: 'Audit Team Findings Discussion',
          description: 'Review all significant findings from audit team',
          requirements: [
            'Team member memos and findings',
            'Unusual items and exceptions',
            'Accounting judgments',
            'Audit adjustments',
            'Control deficiencies'
          ],
          expectedOutput: 'Audit team findings summary'
        }
      ]
    },

    '4_final_management_discussion': {
      name: 'Final Management Discussion and Clearing',
      description: 'Final discussion with management on audit conclusions',
      subActivities: [
        {
          name: 'Audit Findings Discussion',
          description: 'Discuss all significant audit findings with management',
          topics: [
            'Proposed adjustments and reclassifications',
            'Accounting policy changes',
            'Disclosure additions',
            'Internal control recommendations',
            'Going concern assessment',
            'Significant estimates and judgments'
          ],
          expectedOutput: 'Management discussion meeting notes'
        },
        {
          name: 'Adjustment Processing',
          description: 'Process management\'s response to proposed adjustments',
          procedures: [
            'Adjustments agreed and made',
            'Adjustments not made - rationale',
            'Revised trial balance preparation',
            'Reconciliation to final financials',
            'Re-testing of adjustments'
          ],
          expectedOutput: 'Audit adjustment summary'
        },
        {
          name: 'Final Representations Confirmation',
          description: 'Confirm final representations letter execution',
          requirements: [
            'All representations obtained',
            'Subsequent events addressed',
            'Going concern assessment confirmed',
            'Amendment of prior representations',
            'Management signature'
          ],
          expectedOutput: 'Final representation letter'
        }
      ]
    },

    '5_audit_committee_communication': {
      name: 'Audit Committee Communication Preparation',
      description: 'Prepare communications for audit committee/governance',
      subActivities: [
        {
          name: 'Key Audit Matters Determination',
          description: 'Determine key audit matters (KAM) for reporting',
          requirements: [
            'Significant risks identified',
            'Areas requiring significant auditor attention',
            'Significant judgments and estimates',
            'Complex or unusual transactions',
            'Audit adjustments'
          ],
          expectedOutput: 'Key audit matters listing'
        },
        {
          name: 'Audit Committee Letter Preparation',
          description: 'Prepare management letter for audit committee',
          topics: [
            'Audit scope and timing',
            'Materiality assessment',
            'Key audit matters',
            'Control deficiencies and recommendations',
            'Non-compliance issues',
            'Management estimates and judgments',
            'Going concern assessment',
            'Independence confirmation'
          ],
          expectedOutput: 'Draft audit committee letter'
        },
        {
          name: 'Audit Findings Summary',
          description: 'Summarize all audit findings for governance',
          requirements: [
            'Significant findings',
            'Control recommendations',
            'Audit adjustments',
            'Disclosure issues',
            'Management responses'
          ],
          expectedOutput: 'Audit findings summary'
        }
      ]
    },

    '6_going_concern_finalization': {
      name: 'Going Concern Assessment Finalization',
      description: 'Final going concern conclusion',
      subActivities: [
        {
          name: 'Material Uncertainty Assessment',
          description: 'Assess need for material uncertainty disclosure',
          procedures: [
            'Management plans review',
            'Financial projections',
            'Financing arrangements',
            'Covenant compliance',
            'Subsequent events',
            'Management commitment'
          ],
          expectedOutput: 'Going concern final conclusion memo'
        },
        {
          name: 'Adequate Disclosure Assessment',
          description: 'Assess adequacy of going concern disclosures',
          requirements: [
            'Disclosure completeness',
            'Clarity and transparency',
            'IFRS/GAAP compliance',
            'Judgment communication'
          ],
          expectedOutput: 'Disclosure adequacy assessment'
        }
      ]
    },

    '7_consolidated_audit_conclusion': {
      name: 'Consolidated Audit Conclusion Assessment',
      description: 'Form overall audit conclusion',
      subActivities: [
        {
          name: 'Financial Statement Opinion Assessment',
          description: 'Assess basis for audit opinion',
          procedures: [
            'Sufficient appropriate evidence obtained',
            'Misstatement evaluation',
            'Going concern assessment',
            'Estimate appropriateness',
            'Disclosure completeness',
            'Fair presentation conclusion'
          ],
          expectedOutput: 'Opinion basis memo'
        },
        {
          name: 'Opinion Type Determination',
          description: 'Determine appropriate opinion type',
          options: [
            'Unqualified opinion (clean opinion)',
            'Qualified opinion (except for)',
            'Adverse opinion (do not fairly present)',
            'Disclaimer of opinion (unable to form opinion)'
          ],
          considerations: [
            'Scope limitations',
            'Material misstatements',
            'Uncertainties',
            'Pervasiveness of issues'
          ],
          expectedOutput: 'Opinion type determination memo'
        },
        {
          name: 'Other Audit Conclusion Areas',
          description: 'Assess other areas requiring opinion/reporting',
          areas: [
            'Internal controls over financial reporting (if applicable)',
            'Compliance with laws and regulations',
            'Other information review (management discussion)',
            'Subsequent events reporting'
          ],
          expectedOutput: 'Other conclusion areas assessment'
        }
      ]
    },

    '8_audit_documentation_finalization': {
      name: 'Audit Documentation Review and Finalization',
      description: 'Complete and finalize audit documentation',
      subActivities: [
        {
          name: 'Audit File Completion',
          description: 'Ensure audit file is complete and organized',
          requirements: [
            'All working papers present',
            'Cross-references complete',
            'Conclusion memos signed',
            'Review marks cleared',
            'File organization per standards'
          ],
          expectedOutput: 'Audit file sign-off'
        },
        {
          name: 'Audit Trail and Cross-References',
          description: 'Verify audit trail and cross-references',
          procedures: [
            'Cross-reference validation',
            'Audit trail documentation',
            'Adjustment tracing',
            'Account reconciliation to financials',
            'Exception follow-up completion'
          ],
          expectedOutput: 'Audit file completeness checklist'
        },
        {
          name: 'Compliance with Documentation Standards',
          description: 'Ensure compliance with audit standards',
          requirements: [
            'ISA 230 compliance (documentation)',
            'Adequate detail documentation',
            'Significant judgments recorded',
            'Unusual matters documented',
            'Archiving procedures compliance'
          ],
          expectedOutput: 'Documentation standards checklist'
        }
      ]
    },

    '9_engagement_quality_review': {
      name: 'Final Engagement Quality Review',
      description: 'Comprehensive engagement quality review',
      subActivities: [
        {
          name: 'Quality Review Completion',
          description: 'Senior auditor comprehensive quality review',
          procedures: [
            'Audit plan review',
            'Risk assessment review',
            'Significant accounts testing',
            'Accounting treatments',
            'Estimates and judgments',
            'Disclosures completeness',
            'Opinion appropriateness',
            'Going concern assessment'
          ],
          expectedOutput: 'Engagement quality review sign-off'
        },
        {
          name: 'Firm Quality Control Review',
          description: 'Firm-level quality control procedures',
          procedures: [
            'Independence verification',
            'Quality control review',
            'Fee independence assessment',
            'Ethical standards compliance',
            'Professional standards compliance'
          ],
          expectedOutput: 'Firm quality control approval'
        }
      ]
    }
  },

  keyDocumentation: [
    'Final analytical procedures memo',
    'Disclosure review checklist',
    'Specialist reports evaluation',
    'Management discussion notes',
    'Audit adjustment summary',
    'Final representation letter',
    'Key audit matters list',
    'Going concern assessment memo',
    'Opinion basis memo',
    'Engagement quality review sign-off'
  ],

  controlPoints: [
    'All substantive procedures reviewed and cleared',
    'Specialist reports reviewed and integrated',
    'Management adjustments processed',
    'Final management discussion completed',
    'Going concern finalized',
    'Opinion basis documentation complete',
    'Engagement quality review sign-off',
    'Audit file finalized and archived'
  ],

  timelineEstimates: {
    finalAnalyticalReview: '1-2 days',
    specialistReports: '1-2 days',
    auditTeamCorrespondence: '1 day',
    managementDiscussion: '2-3 days',
    auditCommitteeComm: '2-3 days',
    goingConcernFinalization: '1-2 days',
    auditConclusion: '1-2 days',
    documentationFinalization: '1-2 days',
    qualityReview: '2-3 days',
    total: '5-7 days'
  }
};

export default completionStage;
