/**
 * ISA_Compliance_Checklist.js
 *
 * Complete ISA 200-599 compliance checklist framework
 * Maps all ISA standards to specific audit phase requirements
 * Provides compliance validation against international standards
 *
 * Version: 2026.1
 * Last Updated: March 20, 2026
 */

export const ISA_COMPLIANCE_FRAMEWORK = {
  // ISA 200-250: General Principles & Responsibilities
  GENERAL_PRINCIPLES: {
    ISA_200: {
      title: 'Overall Objectives of the Independent Auditor',
      phase: 'PLANNING',
      key_requirements: [
        'Form opinion on financial statements',
        'Conduct audit in accordance with ISAs',
        'Consider applicable law & regulations',
        'Maintain professional skepticism',
        'Obtain reasonable assurance',
        'Report in accordance with ISA 700'
      ],
      compliance_checklist: [
        { item: 'Audit engagement letter signed', status: 'NOT_STARTED' },
        { item: 'Applicable financial reporting framework identified', status: 'NOT_STARTED' },
        { item: 'Engagement team understands ISA requirements', status: 'NOT_STARTED' },
        { item: 'Professional skepticism demonstrated in planning', status: 'NOT_STARTED' },
        { item: 'Engagement quality review assigned', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Engagement letter', 'Planning memo', 'Team briefing notes', 'EQR assignment']
    },

    ISA_210: {
      title: 'Agreeing the Terms of Audit Engagements',
      phase: 'PLANNING',
      key_requirements: [
        'Obtain agreement on engagement terms',
        'Clarify audit scope & responsibilities',
        'Identify reporting obligations',
        'Address compliance requirements',
        'Confirm management cooperation'
      ],
      compliance_checklist: [
        { item: 'Engagement letter addresses all ISA 210 requirements', status: 'NOT_STARTED' },
        { item: 'Management responsibilities clearly stated', status: 'NOT_STARTED' },
        { item: 'Auditor responsibilities clearly stated', status: 'NOT_STARTED' },
        { item: 'Report format & timing agreed', status: 'NOT_STARTED' },
        { item: 'Fees & billing discussed', status: 'NOT_STARTED' },
        { item: 'Engagement letter signed & dated', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Signed engagement letter', 'Client acceptance email']
    },

    ISA_220: {
      title: 'Quality Management for an Audit of Financial Statements',
      phase: 'THROUGHOUT_ALL_PHASES',
      key_requirements: [
        'Establish quality control policies',
        'Assign engagement partner',
        'Determine engagement quality review',
        'Monitor compliance with ISAs',
        'Address significant findings'
      ],
      compliance_checklist: [
        { item: 'Engagement partner assigned & capable', status: 'NOT_STARTED' },
        { item: 'EQR partner assigned independently', status: 'NOT_STARTED' },
        { item: 'Team members have appropriate competence', status: 'NOT_STARTED' },
        { item: 'Significant judgments documented', status: 'NOT_STARTED' },
        { item: 'Significant issues reviewed by partner', status: 'NOT_STARTED' },
        { item: 'EQR conducted before report issued', status: 'NOT_STARTED' }
      ],
      evidence_required: ['EQR memo', 'Team skill assessments', 'Significant issues log', 'Final review sign-off']
    },

    ISA_230: {
      title: 'Audit Documentation',
      phase: 'THROUGHOUT_ALL_PHASES',
      key_requirements: [
        'Document audit procedures performed',
        'Record evidence obtained',
        'Document conclusions reached',
        'Support audit opinion',
        'Enable engagement review',
        'Demonstrate compliance with ISAs'
      ],
      compliance_checklist: [
        { item: 'Audit file organization documented', status: 'NOT_STARTED' },
        { item: 'All procedures documented per ISA', status: 'NOT_STARTED' },
        { item: 'All evidence attached & cross-referenced', status: 'NOT_STARTED' },
        { item: 'Conclusions recorded with supporting detail', status: 'NOT_STARTED' },
        { item: 'Sign-offs from appropriate team members', status: 'NOT_STARTED' },
        { item: 'Audit file assembly completed before report issue', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Complete audit file', 'Documentation index', 'Cross-reference log']
    },

    ISA_240: {
      title: 'The Auditor\'s Responsibilities Relating to Fraud',
      phase: 'RISK_ASSESSMENT',
      key_requirements: [
        'Identify fraud risk factors',
        'Assess risk of material misstatement due to fraud',
        'Respond to identified fraud risks',
        'Evaluate evidence for fraud',
        'Report fraud to appropriate parties'
      ],
      compliance_checklist: [
        { item: 'Fraud risk assessment documented', status: 'NOT_STARTED' },
        { item: 'Fraud triangle factors evaluated', status: 'NOT_STARTED' },
        { item: 'Management override risk considered', status: 'NOT_STARTED' },
        { item: 'Fraud response procedures designed', status: 'NOT_STARTED' },
        { item: 'Journal entry testing performed', status: 'NOT_STARTED' },
        { item: 'Unusual/significant transactions evaluated', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Fraud risk memo', 'Risk factors assessment', 'Response procedures', 'Test results']
    },

    ISA_250: {
      title: 'Consideration of Laws and Regulations',
      phase: 'THROUGHOUT_ALL_PHASES',
      key_requirements: [
        'Identify applicable laws & regulations',
        'Assess compliance with laws & regulations',
        'Respond to identified non-compliance',
        'Report non-compliance appropriately',
        'Document audit procedures performed'
      ],
      compliance_checklist: [
        { item: 'Applicable laws & regulations identified', status: 'NOT_STARTED' },
        { item: 'Compliance testing procedures designed', status: 'NOT_STARTED' },
        { item: 'Management representations on compliance obtained', status: 'NOT_STARTED' },
        { item: 'No material non-compliance identified', status: 'NOT_STARTED' },
        { item: 'Non-compliance (if any) properly reported', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Compliance assessment', 'Testing procedures', 'Management letter']
    }
  },

  // ISA 300-320: Planning
  PLANNING_PHASE: {
    ISA_300: {
      title: 'Planning an Audit of Financial Statements',
      phase: 'PLANNING',
      key_requirements: [
        'Develop overall audit strategy',
        'Develop detailed audit plan',
        'Establish materiality levels',
        'Assess risks of material misstatement',
        'Determine overall audit approach'
      ],
      compliance_checklist: [
        { item: 'Overall audit strategy documented', status: 'NOT_STARTED' },
        { item: 'Materiality calculated per ISA 320', status: 'NOT_STARTED' },
        { item: 'Performance materiality determined', status: 'NOT_STARTED' },
        { item: 'Audit plan addresses all FSLIs', status: 'NOT_STARTED' },
        { item: 'Team communicates strategy & plan', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Planning memo', 'Materiality schedule', 'Audit program']
    },

    ISA_310: {
      title: 'Assembling an Audit Team',
      phase: 'PLANNING',
      key_requirements: [
        'Assign competent & independent team',
        'Consider team member expertise',
        'Document team composition',
        'Plan team supervision',
        'Consider consultation needs'
      ],
      compliance_checklist: [
        { item: 'Audit team members identified & assigned', status: 'NOT_STARTED' },
        { item: 'Team members have required experience', status: 'NOT_STARTED' },
        { item: 'Specialist requirements identified (if any)', status: 'NOT_STARTED' },
        { item: 'Team supervision plan documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Team roster', 'Role assignments', 'Supervision plan']
    },

    ISA_320: {
      title: 'Materiality in Planning and Performing an Audit',
      phase: 'PLANNING',
      key_requirements: [
        'Determine overall materiality',
        'Determine performance materiality',
        'Establish clearly trivial threshold',
        'Reassess materiality throughout audit',
        'Consider qualitative factors'
      ],
      compliance_checklist: [
        { item: 'Benchmark selected (revenue, profit, etc.)', status: 'NOT_STARTED' },
        { item: 'Overall materiality % applied per ISA 320 guidance', status: 'NOT_STARTED' },
        { item: 'Performance materiality calculated (typically 50-75%)', status: 'NOT_STARTED' },
        { item: 'Clearly trivial threshold set', status: 'NOT_STARTED' },
        { item: 'Materiality clearly documented with rationale', status: 'NOT_STARTED' },
        { item: 'Qualitative factors considered', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Materiality schedule', 'Benchmark analysis', 'Rationale memo']
    }
  },

  // ISA 315-330: Risk Assessment
  RISK_ASSESSMENT_PHASE: {
    ISA_315: {
      title: 'Identifying and Assessing the Risks of Material Misstatement',
      phase: 'RISK_ASSESSMENT',
      key_requirements: [
        'Obtain understanding of entity & environment',
        'Identify and assess risks of material misstatement',
        'Consider management override of controls',
        'Document significant risks',
        'Assess control design effectiveness'
      ],
      compliance_checklist: [
        { item: 'Entity understanding memo documented', status: 'NOT_STARTED' },
        { item: 'Industry analysis completed', status: 'NOT_STARTED' },
        { item: 'Business model & strategy understood', status: 'NOT_STARTED' },
        { item: 'Internal control environment assessed', status: 'NOT_STARTED' },
        { item: 'Risk of material misstatement identified per assertion', status: 'NOT_STARTED' },
        { item: 'Significant risks documented per ISA 315', status: 'NOT_STARTED' },
        { item: 'Control design effectiveness evaluated', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Entity understanding memo', 'Risk assessment', 'Control evaluation', 'Significant risks log']
    },

    ISA_330: {
      title: 'The Auditor\'s Response to Assessed Risks',
      phase: 'INTERIM_AND_FINAL',
      key_requirements: [
        'Design audit procedures to respond to identified risks',
        'Perform tests of controls where reliance planned',
        'Perform substantive procedures',
        'Obtain sufficient appropriate audit evidence',
        'Document procedures & results'
      ],
      compliance_checklist: [
        { item: 'Audit procedures designed per ISA 330', status: 'NOT_STARTED' },
        { item: 'Overall response to identified risks documented', status: 'NOT_STARTED' },
        { item: 'Control test procedures designed & performed', status: 'NOT_STARTED' },
        { item: 'Control operating effectiveness documented', status: 'NOT_STARTED' },
        { item: 'Substantive procedures designed', status: 'NOT_STARTED' },
        { item: 'Substantive procedure results documented', status: 'NOT_STARTED' },
        { item: 'Sufficient appropriate evidence obtained', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Audit program', 'Control test workpapers', 'Substantive procedure workpapers', 'Evidence summary']
    }
  },

  // ISA 500-510: Audit Evidence
  EVIDENCE_PHASE: {
    ISA_500: {
      title: 'Audit Evidence',
      phase: 'INTERIM_AND_FINAL',
      key_requirements: [
        'Obtain sufficient appropriate audit evidence',
        'Evaluate evidence quality & relevance',
        'Consider evidence contradictions',
        'Document audit evidence',
        'Support all conclusions'
      ],
      compliance_checklist: [
        { item: 'Evidence obtained is sufficient per ISA 500', status: 'NOT_STARTED' },
        { item: 'Evidence obtained is appropriate (relevant & reliable)', status: 'NOT_STARTED' },
        { item: 'Evidence hierarchy considered (internal vs external)', status: 'NOT_STARTED' },
        { item: 'Contradictory evidence evaluated', status: 'NOT_STARTED' },
        { item: 'All material items evidenced', status: 'NOT_STARTED' },
        { item: 'Evidence attached to workpapers', status: 'NOT_STARTED' }
      ],
      evidence_required: ['All workpapers', 'Evidence attachments', 'Summary of audit evidence']
    },

    ISA_501: {
      title: 'Audit Evidence—Specific Considerations for Selected Items',
      phase: 'INTERIM_AND_FINAL',
      key_requirements: [
        'Perform inventory procedures (observation)',
        'Evaluate accounting estimates',
        'Test related party transactions',
        'Obtain external confirmations',
        'Document specific procedures'
      ],
      compliance_checklist: [
        { item: 'Inventory observation performed & documented', status: 'NOT_STARTED' },
        { item: 'Management estimates evaluated per ISA 501', status: 'NOT_STARTED' },
        { item: 'Related party transactions identified & tested', status: 'NOT_STARTED' },
        { item: 'External confirmations obtained (bank, AR, etc.)', status: 'NOT_STARTED' },
        { item: 'Confirmation procedures documented', status: 'NOT_STARTED' },
        { item: 'Estimates evaluation documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Inventory observation memo', 'Estimates evaluation', 'Related party schedule', 'Confirmations']
    },

    ISA_505: {
      title: 'External Confirmations',
      phase: 'FINAL_AUDIT',
      key_requirements: [
        'Determine confirmation necessity',
        'Determine confirmation method',
        'Control confirmation process',
        'Evaluate confirmation responses',
        'Address non-responses'
      ],
      compliance_checklist: [
        { item: 'Confirmation design documented per ISA 505', status: 'NOT_STARTED' },
        { item: 'Confirmation population identified & tested', status: 'NOT_STARTED' },
        { item: 'Confirmation procedures controlled', status: 'NOT_STARTED' },
        { item: 'Responses received & evaluated', status: 'NOT_STARTED' },
        { item: 'Non-responses followed up appropriately', status: 'NOT_STARTED' },
        { item: 'Confirmation summary documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Confirmation template', 'Confirmation listing', 'Response summary', 'Follow-up evidence']
    },

    ISA_510: {
      title: 'Initial Audit Engagements—Opening Balances',
      phase: 'RISK_ASSESSMENT',
      key_requirements: [
        'Obtain sufficient evidence for opening balances',
        'Evaluate consistency with prior year',
        'Address prior year adjustments',
        'Document procedures performed',
        'Consider change in scope'
      ],
      compliance_checklist: [
        { item: 'Opening balance verification performed (if applicable)', status: 'NOT_STARTED' },
        { item: 'Prior year audit file reviewed', status: 'NOT_STARTED' },
        { item: 'Changes in accounting policies identified', status: 'NOT_STARTED' },
        { item: 'Opening balance procedures documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Opening balance testing', 'Prior year conclusion', 'Accounting policy changes']
    }
  },

  // ISA 520-540: Audit Procedures
  AUDIT_PROCEDURES: {
    ISA_520: {
      title: 'Analytical Procedures',
      phase: 'THROUGHOUT_ALL_PHASES',
      key_requirements: [
        'Perform analytics during planning',
        'Perform analytics during testing',
        'Perform analytics before forming opinion',
        'Evaluate unexpected results',
        'Document procedures & conclusions'
      ],
      compliance_checklist: [
        { item: 'Preliminary analytics performed in planning', status: 'NOT_STARTED' },
        { item: 'Key ratios & trends analyzed', status: 'NOT_STARTED' },
        { item: 'Unexpected relationships identified & investigated', status: 'NOT_STARTED' },
        { item: 'Final analytics performed before opinion', status: 'NOT_STARTED' },
        { item: 'Analytics conclusions documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Analytical procedure workpaper', 'Ratio analysis', 'Trend analysis']
    },

    ISA_530: {
      title: 'Audit Sampling',
      phase: 'INTERIM_AND_FINAL',
      key_requirements: [
        'Design sample appropriately',
        'Select sample items',
        'Evaluate sample results',
        'Project results to population',
        'Document sampling methodology'
      ],
      compliance_checklist: [
        { item: 'Sample design documented per ISA 530', status: 'NOT_STARTED' },
        { item: 'Population defined appropriately', status: 'NOT_STARTED' },
        { item: 'Sample size calculated', status: 'NOT_STARTED' },
        { item: 'Sample items selected appropriately', status: 'NOT_STARTED' },
        { item: 'Sample tested & results documented', status: 'NOT_STARTED' },
        { item: 'Results projected to population', status: 'NOT_STARTED' },
        { item: 'Sampling conclusions documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Sample design', 'Sample listing', 'Test results', 'Projection calculation']
    },

    ISA_540: {
      title: 'Auditing Accounting Estimates',
      phase: 'FINAL_AUDIT',
      key_requirements: [
        'Identify accounting estimates',
        'Evaluate estimate reasonableness',
        'Consider subsequent events',
        'Evaluate disclosure adequacy',
        'Document procedures & conclusions'
      ],
      compliance_checklist: [
        { item: 'Significant estimates identified', status: 'NOT_STARTED' },
        { item: 'Estimate methodology evaluated', status: 'NOT_STARTED' },
        { item: 'Estimate inputs & assumptions tested', status: 'NOT_STARTED' },
        { item: 'Estimate point estimate or range evaluated', status: 'NOT_STARTED' },
        { item: 'Management estimates vs auditor point estimate compared', status: 'NOT_STARTED' },
        { item: 'Estimate disclosure evaluated per IFRS', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Estimate evaluation workpaper', 'Supporting calculations', 'Disclosure review']
    }
  },

  // ISA 560-620: Completion
  COMPLETION_PHASE: {
    ISA_560: {
      title: 'Subsequent Events',
      phase: 'COMPLETION',
      key_requirements: [
        'Perform subsequent events procedures',
        'Identify adjusting & non-adjusting events',
        'Evaluate disclosure adequacy',
        'Consider going concern',
        'Document procedures performed'
      ],
      compliance_checklist: [
        { item: 'Subsequent events procedures performed', status: 'NOT_STARTED' },
        { item: 'Management representation on subsequent events obtained', status: 'NOT_STARTED' },
        { item: 'Board minutes reviewed post-year end', status: 'NOT_STARTED' },
        { item: 'Bank & legal confirmations received', status: 'NOT_STARTED' },
        { item: 'Significant events identified & classified', status: 'NOT_STARTED' },
        { item: 'Event disclosures evaluated per IFRS', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Subsequent events memo', 'Board minutes', 'Confirmations', 'Event disclosures review']
    },

    ISA_570: {
      title: 'Going Concern',
      phase: 'COMPLETION',
      key_requirements: [
        'Assess entity\'s ability to continue as going concern',
        'Evaluate management\'s assessment',
        'Perform going concern procedures',
        'Evaluate disclosure adequacy',
        'Form going concern conclusion'
      ],
      compliance_checklist: [
        { item: 'Management\'s going concern assessment obtained', status: 'NOT_STARTED' },
        { item: 'Financial indicators evaluated (liquidity, solvency, etc.)', status: 'NOT_STARTED' },
        { item: 'Covenant compliance assessed', status: 'NOT_STARTED' },
        { item: 'Management plans for addressing concerns evaluated', status: 'NOT_STARTED' },
        { item: 'Going concern conclusion documented', status: 'NOT_STARTED' },
        { item: 'Going concern disclosure evaluated per IFRS', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Going concern memo', 'Financial analysis', 'Management plans', 'Disclosure review']
    },

    ISA_580: {
      title: 'Management Representations',
      phase: 'COMPLETION',
      key_requirements: [
        'Obtain management representation letter',
        'Cover all significant matters',
        'Date letter as of audit report date',
        'Evaluate inconsistencies',
        'Document all representations'
      ],
      compliance_checklist: [
        { item: 'Management representation letter obtained', status: 'NOT_STARTED' },
        { item: 'Letter covers all significant matters per ISA 580', status: 'NOT_STARTED' },
        { item: 'Letter includes specific representations (completeness, accuracy, etc.)', status: 'NOT_STARTED' },
        { item: 'Letter dated as of audit report date', status: 'NOT_STARTED' },
        { item: 'Letter signed by management at appropriate level', status: 'NOT_STARTED' },
        { item: 'Representations evaluated for consistency with evidence', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Signed management representation letter']
    },

    ISA_620: {
      title: 'Using the Work of an Auditor\'s Expert',
      phase: 'THROUGHOUT_ALL_PHASES',
      key_requirements: [
        'Determine if specialist needed',
        'Evaluate expert competence',
        'Obtain sufficient evidence from expert',
        'Evaluate expert conclusions',
        'Document expert involvement'
      ],
      compliance_checklist: [
        { item: 'Specialist needs identified (if any)', status: 'NOT_STARTED' },
        { item: 'Specialist competence & independence evaluated', status: 'NOT_STARTED' },
        { item: 'Specialist engagement terms documented', status: 'NOT_STARTED' },
        { item: 'Specialist work reviewed & evaluated', status: 'NOT_STARTED' },
        { item: 'Specialist conclusions incorporated into audit', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Expert engagement', 'Expert report', 'Review conclusions']
    }
  },

  // ISA 700-720: Reporting
  REPORTING_PHASE: {
    ISA_700: {
      title: 'Forming an Opinion and Reporting on Financial Statements',
      phase: 'REPORTING',
      key_requirements: [
        'Form opinion on financial statements',
        'Consider all evidence obtained',
        'Report appropriately per ISA 700',
        'Include required elements in report',
        'Ensure report is dated & signed'
      ],
      compliance_checklist: [
        { item: 'Opinion formed per ISA 700 requirements', status: 'NOT_STARTED' },
        { item: 'Audit evidence supports opinion', status: 'NOT_STARTED' },
        { item: 'Audit report includes all ISA 700 elements', status: 'NOT_STARTED' },
        { item: 'Report format complies with applicable regulations', status: 'NOT_STARTED' },
        { item: 'Report dated & signed by partner', status: 'NOT_STARTED' },
        { item: 'Report addressed to appropriate party', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Final audit report', 'Opinion memo', 'Partner sign-off']
    },

    ISA_705: {
      title: 'Modifications to the Opinion in the Independent Auditor\'s Report',
      phase: 'REPORTING',
      key_requirements: [
        'Determine if modification to opinion required',
        'Evaluate basis for modification',
        'Form appropriate modified opinion',
        'Report modification in accordance with ISA',
        'Document modification rationale'
      ],
      compliance_checklist: [
        { item: 'Modified opinion determined (if applicable)', status: 'NOT_STARTED' },
        { item: 'Basis for modification documented', status: 'NOT_STARTED' },
        { item: 'Modified report format per ISA 705', status: 'NOT_STARTED' },
        { item: 'Modification clearly communicated', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Modification memo', 'Modified report']
    },

    ISA_706: {
      title: 'Emphasis of Matter Paragraphs and Other Matter Paragraphs',
      phase: 'REPORTING',
      key_requirements: [
        'Determine if emphasis of matter required',
        'Determine if other matter paragraph required',
        'Include paragraph in appropriate format',
        'Ensure does not modify opinion',
        'Document judgment'
      ],
      compliance_checklist: [
        { item: 'Emphasis of matter matters identified (if any)', status: 'NOT_STARTED' },
        { item: 'Other matter matters identified (if any)', status: 'NOT_STARTED' },
        { item: 'Paragraphs included in appropriate format', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Report with emphasis/other matter']
    },

    ISA_710: {
      title: 'Comparative Information',
      phase: 'REPORTING',
      key_requirements: [
        'Determine if comparative statements required',
        'Audit comparative information (if required)',
        'Evaluate consistency with prior year',
        'Consider prior year audit evidence',
        'Report appropriately on comparatives'
      ],
      compliance_checklist: [
        { item: 'Comparative information requirements identified', status: 'NOT_STARTED' },
        { item: 'Prior year audit conclusion obtained', status: 'NOT_STARTED' },
        { item: 'Comparative data tested as required', status: 'NOT_STARTED' },
        { item: 'Consistency with prior year verified', status: 'NOT_STARTED' },
        { item: 'Reporting on comparatives per ISA 710', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Prior year file', 'Comparative testing', 'Report on comparatives']
    },

    ISA_720: {
      title: 'The Auditor\'s Responsibilities Relating to Other Information',
      phase: 'REPORTING',
      key_requirements: [
        'Read other information',
        'Identify material inconsistencies',
        'Evaluate material misstatements',
        'Address inconsistencies/misstatements',
        'Document procedures performed'
      ],
      compliance_checklist: [
        { item: 'Other information identified & read', status: 'NOT_STARTED' },
        { item: 'Other information reviewed for inconsistencies', status: 'NOT_STARTED' },
        { item: 'Material misstatements identified & addressed', status: 'NOT_STARTED' },
        { item: 'Other information conclusion documented', status: 'NOT_STARTED' }
      ],
      evidence_required: ['Other information memo', 'Consistency review']
    }
  }
};

/**
 * Helper function to get all ISA standards for a specific phase
 */
export function getISAsForPhase(phase) {
  const phaseISAs = [];

  for (const category of Object.values(ISA_COMPLIANCE_FRAMEWORK)) {
    for (const [isa_code, details] of Object.entries(category)) {
      if (details.phase === phase || details.phase === 'THROUGHOUT_ALL_PHASES') {
        phaseISAs.push({
          code: isa_code,
          ...details
        });
      }
    }
  }

  return phaseISAs;
}

/**
 * Helper function to get compliance status for an engagement
 */
export function calculateComplianceStatus(engagementData) {
  let totalItems = 0;
  let completedItems = 0;

  for (const category of Object.values(ISA_COMPLIANCE_FRAMEWORK)) {
    for (const [isa_code, details] of Object.entries(category)) {
      if (details.compliance_checklist) {
        details.compliance_checklist.forEach(item => {
          totalItems++;
          if (item.status === 'COMPLETED') {
            completedItems++;
          }
        });
      }
    }
  }

  return {
    total: totalItems,
    completed: completedItems,
    percentage: Math.round((completedItems / totalItems) * 100),
    status: completedItems === totalItems ? 'COMPLIANT' : 'IN_PROGRESS'
  };
}

export default ISA_COMPLIANCE_FRAMEWORK;
