/**
 * ISA (International Standards on Auditing) Framework
 * =====================================================
 * Defines the complete ISA audit lifecycle and requirements
 * Alignment: ISA 200-599 (General Principles and Responsibilities)
 *            ISA 600-699 (Audit Procedures)
 *            ISA 700-799 (Audit Conclusions and Reporting)
 */

export const isaFramework = {
  version: '2026.1',
  organization: 'IAASB (International Auditing and Assurance Standards Board)',
  standards: {
    general: {
      ISA200: {
        title: 'Overall Objectives of the Independent Auditor',
        description: 'Establishes the overall objectives and general responsibilities',
        keyRequirements: [
          'Plan and perform audit to obtain reasonable assurance',
          'Detect material misstatement due to fraud or error',
          'Report audit findings in accordance with laws/regulations',
          'Maintain professional skepticism throughout'
        ]
      },
      ISA210: {
        title: 'Agreeing the Terms of Audit Engagements',
        description: 'Defines engagement letter requirements',
        keyRequirements: [
          'Establish clear engagement terms in writing',
          'Define audit objectives and responsibilities',
          'Document scope and limitations',
          'Specify reporting arrangements'
        ]
      },
      ISA220: {
        title: 'Quality Control for Audits',
        description: 'Establishes quality control procedures',
        keyRequirements: [
          'Assign appropriate personnel',
          'Maintain professional competence',
          'Review work of team members',
          'Document quality control procedures'
        ]
      }
    },
    riskAssessment: {
      ISA315: {
        title: 'Identifying and Assessing Risks of Misstatement',
        description: 'Risk assessment procedures and controls testing',
        keyRequirements: [
          'Obtain understanding of entity and environment',
          'Identify risks of misstatement',
          'Assess control design and effectiveness',
          'Document all identified risks'
        ]
      },
      ISA330: {
        title: 'The Auditor\'s Responses to Assessed Risks',
        description: 'Responding to assessed risks',
        keyRequirements: [
          'Design substantive procedures',
          'Test operating effectiveness of controls',
          'Evaluate audit evidence obtained',
          'Determine necessity for specialist involvement'
        ]
      }
    },
    auditProcedures: {
      ISA500: {
        title: 'Audit Evidence',
        description: 'Guidelines for audit evidence sufficiency and appropriateness',
        keyRequirements: [
          'Obtain sufficient appropriate audit evidence',
          'Evaluate reliability of evidence',
          'Document all evidence obtained',
          'Assess completeness of evidence'
        ]
      },
      ISA501: {
        title: 'Audit Evidence — Specific Considerations',
        description: 'Specific considerations for various assertions',
        keyRequirements: [
          'Evaluate inventory assertions',
          'Test bank reconciliations',
          'Assess legal proceedings',
          'Review compliance matters'
        ]
      },
      ISA505: {
        title: 'External Confirmations',
        description: 'Procedures for external confirmations',
        keyRequirements: [
          'Determine relevance of confirmations',
          'Select items for confirmation',
          'Design confirmation requests',
          'Evaluate confirmation responses'
        ]
      }
    },
    reporting: {
      ISA700: {
        title: 'Forming an Opinion and Reporting on Financial Statements',
        description: 'Audit conclusion and reporting standards',
        keyRequirements: [
          'Conclude on fair presentation',
          'Form qualified/unqualified opinion',
          'Report material misstatements',
          'Communicate going concern issues'
        ]
      },
      ISA705: {
        title: 'Modifications to the Opinion in the Auditor\'s Report',
        description: 'Qualified, adverse, and disclaimer opinions',
        keyRequirements: [
          'Identify circumstances requiring modification',
          'Determine appropriate modification type',
          'Report material misstatements/uncertainties',
          'Disclose basis for modification'
        ]
      }
    }
  },
  auditPhases: [
    'Planning',
    'Risk Assessment',
    'Interim Audit',
    'Final Audit',
    'Completion',
    'Reporting'
  ],
  principalObjectives: [
    'Obtain reasonable assurance about whether financial statements are free from material misstatement',
    'Report on the financial statements in accordance with findings',
    'Communicate findings to those charged with governance',
    'Report on internal controls (where applicable)'
  ],
  professionalRequirements: [
    'Professional competence and due care',
    'Professional skepticism and independence',
    'Confidentiality and ethical conduct',
    'Compliance with quality control standards'
  ]
};

export const isaComplianceMap = {
  'Planning Phase': {
    applicableStandards: ['ISA 200', 'ISA 210', 'ISA 220'],
    keyActivities: [
      'Establish engagement terms',
      'Plan audit approach',
      'Assess materiality',
      'Assign qualified personnel'
    ]
  },
  'Risk Assessment Phase': {
    applicableStandards: ['ISA 315', 'ISA 320', 'ISA 330'],
    keyActivities: [
      'Obtain understanding of entity',
      'Identify risks of misstatement',
      'Assess control effectiveness',
      'Design audit procedures'
    ]
  },
  'Interim Audit Phase': {
    applicableStandards: ['ISA 330', 'ISA 500', 'ISA 501', 'ISA 505'],
    keyActivities: [
      'Test operating effectiveness of controls',
      'Obtain preliminary audit evidence',
      'Update risk assessments',
      'Request confirmations'
    ]
  },
  'Final Audit Phase': {
    applicableStandards: ['ISA 500', 'ISA 501', 'ISA 570', 'ISA 580'],
    keyActivities: [
      'Perform substantive procedures',
      'Evaluate audit evidence',
      'Test going concern',
      'Obtain management representations'
    ]
  },
  'Completion Phase': {
    applicableStandards: ['ISA 560', 'ISA 570', 'ISA 580', 'ISA 620'],
    keyActivities: [
      'Review subsequent events',
      'Obtain final representations',
      'Evaluate audit findings',
      'Engage specialists if needed'
    ]
  },
  'Reporting Phase': {
    applicableStandards: ['ISA 700', 'ISA 705', 'ISA 710', 'ISA 720'],
    keyActivities: [
      'Form audit opinion',
      'Prepare audit report',
      'Communicate key audit matters',
      'Report to governance bodies'
    ]
  }
};

export default isaFramework;
