/**
 * complianceContentService.js
 *
 * Centralized compliance content framework for ISA, FRS, and IFRS requirements
 * Organizes guidance, procedures, and compliance requirements by FSLI/Section
 * Provides dynamic guidance based on engagement characteristics
 *
 * Version: 1.0.0
 * Created: March 2026
 */


/**
 * Comprehensive compliance content organized by FSLI
 * Each FSLI contains ISA standards, FRS/IFRS requirements, procedures, and guidance
 */
const COMPLIANCE_CONTENT_BY_FSLI = {
  'C1': {
    label: 'Trial Balance & Lead Schedules',
    isaStandards: ['ISA 500', 'ISA 320', 'ISA 330'],
    isaGuidance: {
      'ISA 500': {
        title: 'Audit Evidence',
        guidance: 'The auditor must obtain sufficient, appropriate audit evidence to draw conclusions and support the audit opinion.',
        keyRequirements: [
          'Develop an overall audit strategy for gathering evidence',
          'Determine nature, timing, and extent of procedures based on assessed risks',
          'Obtain sufficient appropriate evidence to determine if assertions are fairly presented'
        ],
        documentationRequirements: ['Evidence collection procedures', 'Cross-references to support', 'Exception analysis']
      },
      'ISA 320': {
        title: 'Materiality in Planning and Performing an Audit',
        guidance: 'Determine overall materiality, performance materiality, and trivial threshold to guide audit procedures.',
        keyRequirements: [
          'Establish overall materiality based on benchmark (typically 5% PBT or 2% revenue)',
          'Set performance materiality at 75% of overall materiality',
          'Identify trivial threshold items',
          'Reassess materiality throughout the audit'
        ],
        documentationRequirements: ['Materiality calculation', 'Benchmark justification', 'Reassessment memo']
      },
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design and perform audit procedures whose nature, timing, and extent are responsive to the assessed risks.',
        keyRequirements: [
          'Consider assessed risks when designing procedures',
          'Perform substantive procedures for each material account',
          'Evaluate whether procedures provide sufficient evidence',
          'Document rationale for procedures selected'
        ],
        documentationRequirements: ['Procedure design rationale', 'Risk-to-procedure linkage', 'Procedure execution evidence']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - The Financial Reporting Standard for Smaller Entities',
        scope: 'Trial balance must reconcile to general ledger and support financial statement line items',
        keyRequirements: [
          'All transactions recorded in general ledger and summarized in trial balance',
          'Trial balance reconciles without exceptions',
          'Accounting policies consistently applied',
          'All adjusting entries properly recorded'
        ],
        guidance: 'For FRS 102 entities, ensure trial balance is properly reconciled and all adjusting entries are documented.'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS 8',
        title: 'Operating Segments',
        requirement: 'If multiple segments, ensure segment reporting is properly reflected in trial balance structure',
        auditImplications: 'Trial balance should include segment-level detail for testing segment allocation'
      }
    ],
    keyAuditMatters: [
      'Mathematical accuracy of trial balance totals',
      'Completeness of all general ledger accounts',
      'Proper cutoff of period-end transactions',
      'Account classification consistency'
    ],
    commonRisks: [
      'Trial balance does not reconcile to general ledger',
      'Missing accounts or transactions',
      'Incorrect account classifications',
      'Period cutoff errors',
      'Duplicate accounts or entries'
    ],
    proceduresChecklist: [
      { procedure: 'Obtain trial balance from ERP system', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Reconcile to general ledger master', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Test mathematical accuracy', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Compare to prior year for unusual changes', priority: 'Medium', phase: 'Final Audit' },
      { procedure: 'Verify account classifications are appropriate', priority: 'Medium', phase: 'Final Audit' }
    ],
    sampleProcedures: {
      testingApproaches: ['100% recalculation', 'Analytical review', 'Account-by-account reconciliation'],
      extent: 'All material accounts (>5% of performance materiality)',
      timing: 'Final audit phase'
    }
  },

  'D1': {
    label: 'Engagement & Controls Testing',
    isaStandards: ['ISA 220', 'ISA 315', 'ISA 330'],
    isaGuidance: {
      'ISA 220': {
        title: 'Quality Management for an Audit of Financial Statements',
        guidance: 'Establish quality control procedures throughout the engagement to ensure compliance with ISAs.',
        keyRequirements: [
          'Assign appropriate engagement partner and quality reviewer',
          'Establish engagement team policies and procedures',
          'Address significant findings and issues',
          'Maintain audit file and documentation',
          'Conduct engagement quality review before report issuance'
        ],
        documentationRequirements: ['Team assignments', 'Quality control procedures', 'EQR sign-off', 'Significant issues log']
      },
      'ISA 315': {
        title: 'Identifying and Assessing the Risks of Material Misstatement',
        guidance: 'Perform risk assessment procedures to understand the entity and identify risks of material misstatement.',
        keyRequirements: [
          'Obtain understanding of the entity and its environment',
          'Identify business risks that affect financial reporting',
          'Understand the internal control structure',
          'Perform risk assessment procedures',
          'Assess risks at assertion level'
        ],
        documentationRequirements: ['Entity understanding memo', 'Risk matrix', 'Controls narrative', 'Risk assessment documentation']
      },
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design audit procedures that respond to identified and assessed risks.',
        keyRequirements: [
          'Design procedures responsive to identified risks',
          'Consider nature, timing, and extent of procedures',
          'Perform tests of controls for high-risk areas',
          'Evaluate effectiveness of controls tested'
        ],
        documentationRequirements: ['Control testing procedures', 'Test results and conclusions', 'Deficiency documentation']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - Control Environment',
        scope: 'Evaluate control environment and governance for FRS 102 compliance',
        keyRequirements: [
          'Understand management structure and reporting lines',
          'Assess integrity and competence of personnel',
          'Evaluate code of conduct and ethics policies',
          'Assess segregation of duties and authorization procedures'
        ],
        guidance: 'Controls should prevent or detect material misstatements in financial reporting'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS General',
        title: 'Entity-Level Controls',
        requirement: 'Entity must have controls to prevent or detect and correct misstatements',
        auditImplications: 'Assess effectiveness of entity-level controls including monitoring activities'
      }
    ],
    keyAuditMatters: [
      'Quality of management and governance',
      'Integrity of control environment',
      'Segregation of duties effectiveness',
      'Management override risk assessment'
    ],
    commonRisks: [
      'Weak control environment',
      'Poor segregation of duties',
      'Management override of controls',
      'Lack of documented procedures',
      'Inadequate monitoring activities'
    ],
    proceduresChecklist: [
      { procedure: 'Document control environment assessment', priority: 'High', phase: 'Planning' },
      { procedure: 'Evaluate segregation of duties', priority: 'High', phase: 'Risk Assessment' },
      { procedure: 'Test key controls over transaction processing', priority: 'High', phase: 'Interim' },
      { procedure: 'Assess management override risk', priority: 'High', phase: 'Risk Assessment' },
      { procedure: 'Evaluate monitoring controls and procedures', priority: 'Medium', phase: 'Interim' }
    ],
    sampleProcedures: {
      testingApproaches: ['Inquiry and observation', 'Document review', 'Walkthrough testing', 'Detailed control testing'],
      extent: 'All key controls',
      timing: 'Risk assessment and interim phases'
    }
  },

  'D3': {
    label: 'Revenue & Receivables',
    isaStandards: ['ISA 240', 'ISA 330', 'ISA 501', 'ISA 505'],
    isaGuidance: {
      'ISA 240': {
        title: 'The Auditor\'s Responsibilities Relating to Fraud',
        guidance: 'Assess fraud risks in revenue recognition and perform procedures targeting revenue manipulation.',
        keyRequirements: [
          'Consider fraud risk factors in revenue process',
          'Perform audit procedures targeting revenue fraud',
          'Test management override in revenue transactions',
          'Assess completeness of revenue recording'
        ],
        documentationRequirements: ['Fraud risk assessment', 'Revenue manipulation procedures', 'Management override testing']
      },
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design substantive procedures responsive to revenue and receivables risks.',
        keyRequirements: [
          'Perform substantive procedures on material revenue transactions',
          'Test operating effectiveness of revenue controls',
          'Evaluate receivables valuation and existence',
          'Assess revenue cutoff procedures'
        ],
        documentationRequirements: ['Substantive procedure design', 'Sample testing results', 'Conclusions documentation']
      },
      'ISA 501': {
        title: 'Audit Evidence - Specific Considerations',
        guidance: 'Obtain specific audit evidence for revenue and receivables including confirmations.',
        keyRequirements: [
          'Obtain external confirmations for receivables where possible',
          'Evaluate completeness of receivables listing',
          'Test revenue transactions selected for high-risk areas',
          'Assess allowance for credit losses appropriateness'
        ],
        documentationRequirements: ['Confirmation requests and responses', 'Aging analysis', 'Allowance adequacy assessment']
      },
      'ISA 505': {
        title: 'External Confirmations',
        guidance: 'Design and perform external confirmation procedures for receivables.',
        keyRequirements: [
          'Send confirmations for material receivables',
          'Evaluate response rates and exceptions',
          'Follow up on non-responses and exceptions',
          'Document confirmation procedures and results'
        ],
        documentationRequirements: ['Confirmation lists', 'Response letters', 'Exception analysis', 'Follow-up procedures']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - Revenue Recognition',
        scope: 'Revenue must be recognized when earned, measured at fair value of consideration received',
        keyRequirements: [
          'Revenue recognized only when entitled to consideration',
          'Recognition at point of transfer of control or consumption of benefits',
          'Measurement at fair value of consideration',
          'Related costs matched to revenue'
        ],
        guidance: 'Evaluate timing of revenue recognition and appropriateness of revenue policies'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS 15',
        title: 'Revenue from Contracts with Customers',
        requirement: 'Revenue recognized when control of promised goods/services transferred to customer for amount of consideration expected',
        auditImplications: 'Test key judgments: identification of performance obligations, transaction price determination, timing of control transfer'
      }
    ],
    keyAuditMatters: [
      'Appropriateness of revenue recognition policy and compliance with IFRS 15',
      'Completeness of revenue transactions recorded',
      'Validity of customer relationships and performance obligations',
      'Appropriateness of period cutoff',
      'Adequacy of allowance for credit losses',
      'Fraud risk assessment - revenue manipulation'
    ],
    commonRisks: [
      'Revenue recognized before customer acceptance',
      'Understatement of returns and allowances',
      'Fictitious revenue transactions',
      'Cutoff errors at period end',
      'Uncollectible receivables not fully provided',
      'Unusual or complex revenue arrangements not properly evaluated'
    ],
    proceduresChecklist: [
      { procedure: 'Assess fraud risk in revenue process', priority: 'High', phase: 'Risk Assessment' },
      { procedure: 'Evaluate revenue recognition policy for IFRS 15 compliance', priority: 'High', phase: 'Planning' },
      { procedure: 'Test revenue controls and procedures', priority: 'High', phase: 'Interim' },
      { procedure: 'Send receivables confirmations', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Test revenue transactions selected for high-risk areas', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Analyze revenue cutoff at year-end', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Evaluate allowance for credit losses', priority: 'Medium', phase: 'Final Audit' },
      { procedure: 'Review unusual or complex revenue transactions', priority: 'Medium', phase: 'Final Audit' }
    ],
    sampleProcedures: {
      testingApproaches: ['External confirmations', 'Detailed transaction testing', 'Cutoff testing', 'Statistical sampling'],
      extent: 'Significant transactions and balances plus risk-based selections',
      timing: 'Interim for controls; final audit for substantive procedures'
    }
  },

  'D4': {
    label: 'Inventory & WIP',
    isaStandards: ['ISA 330', 'ISA 501', 'ISA 540'],
    isaGuidance: {
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design procedures to address inventory valuation and completeness risks.',
        keyRequirements: [
          'Perform procedures to evaluate inventory existence and completeness',
          'Test valuation methodologies and calculations',
          'Evaluate obsolescence and net realizable value assessments',
          'Assess inventory cutoff procedures'
        ],
        documentationRequirements: ['Inventory procedure design', 'Valuation analysis', 'Testing results']
      },
      'ISA 501': {
        title: 'Audit Evidence - Specific Considerations',
        guidance: 'Obtain audit evidence specific to inventory and work-in-process.',
        keyRequirements: [
          'Observe inventory count or perform alternative procedures',
          'Obtain inventory costing schedules and recalculate',
          'Evaluate inventory aging and obsolescence',
          'Test lower of cost or NRV calculations'
        ],
        documentationRequirements: ['Count observation memo', 'Inventory costing analysis', 'Obsolescence assessment']
      },
      'ISA 540': {
        title: 'Auditing Accounting Estimates',
        guidance: 'Test inventory estimates including obsolescence provisions and valuation methods.',
        keyRequirements: [
          'Challenge assumptions used in inventory estimates',
          'Evaluate obsolescence reserve methodology',
          'Test lower of cost or NRV calculations',
          'Assess management bias in estimates'
        ],
        documentationRequirements: ['Estimate challenge documentation', 'Assumption analysis', 'Bias assessment']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - Inventories',
        scope: 'Inventories valued at lower of cost or net realizable value; cost includes allocated overheads',
        keyRequirements: [
          'Cost determined on consistent basis (FIFO, LIFO, or weighted average)',
          'Includes all costs of purchase and conversion',
          'Excludes abnormal waste and administrative expenses',
          'NRV assessed for slow-moving and obsolete items',
          'Appropriate cost allocation if work-in-process'
        ],
        guidance: 'Verify inventory costing method is appropriate and consistently applied; assess NRV adequately'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS 2',
        title: 'Share-based Payments',
        requirement: 'If applicable, inventory-related share-based payments disclosed',
        auditImplications: 'If entity has share-based compensation in production, assess appropriate allocation to inventory'
      }
    ],
    keyAuditMatters: [
      'Existence and completeness of inventory',
      'Appropriateness of inventory costing method',
      'Completeness of overhead allocation to inventory',
      'Adequacy of obsolescence provision',
      'Proper cutoff of inventory transactions',
      'Work-in-process valuation and completeness'
    ],
    commonRisks: [
      'Inventory count errors or incompleteness',
      'Obsolete or slow-moving items not provided for',
      'Incorrect costing method application',
      'Excessive overhead allocation',
      'Cutoff errors at year-end',
      'Inventory held for sale not separately identified'
    ],
    proceduresChecklist: [
      { procedure: 'Observe year-end inventory count', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Evaluate inventory costing policies for FRS 102 compliance', priority: 'High', phase: 'Planning' },
      { procedure: 'Test inventory costing calculations', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Assess obsolescence reserve adequacy', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Verify cutoff at year-end', priority: 'Medium', phase: 'Final Audit' },
      { procedure: 'Test work-in-process overhead allocation', priority: 'Medium', phase: 'Final Audit' }
    ],
    sampleProcedures: {
      testingApproaches: ['Physical observation', 'Valuation testing', 'Obsolescence analysis', 'Cutoff testing'],
      extent: 'Significant inventory items and high-risk categories',
      timing: 'Year-end observation; valuation testing in final audit'
    }
  },

  'D5': {
    label: 'Fixed Assets & Leases',
    isaStandards: ['ISA 330', 'ISA 501', 'ISA 540'],
    isaGuidance: {
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design procedures for fixed asset additions, disposals, valuations, and lease accounting.',
        keyRequirements: [
          'Test additions and disposals against supporting documentation',
          'Evaluate asset impairment assessments',
          'Assess lease classification and accounting',
          'Verify depreciation calculations and useful lives'
        ],
        documentationRequirements: ['Fixed asset procedure design', 'Testing results', 'Lease analysis']
      },
      'ISA 501': {
        title: 'Audit Evidence - Specific Considerations',
        guidance: 'Obtain specific evidence for fixed assets and evaluate impairment indicators.',
        keyRequirements: [
          'Observe physical condition of material assets',
          'Evaluate impairment indicators and fair value assessments',
          'Test depreciation methods and useful life assumptions',
          'Assess lease accounting for right-of-use assets'
        ],
        documentationRequirements: ['Asset observation memo', 'Impairment analysis', 'Depreciation testing']
      },
      'ISA 540': {
        title: 'Auditing Accounting Estimates',
        guidance: 'Challenge estimates related to depreciation, useful lives, and impairment.',
        keyRequirements: [
          'Challenge useful life assumptions',
          'Evaluate impairment testing methodology',
          'Assess asset fair value determinations',
          'Test assumptions against historical results'
        ],
        documentationRequirements: ['Assumption challenge', 'Estimate validation', 'Bias assessment']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - Property, Plant & Equipment and Leases',
        scope: 'Fixed assets carried at cost less accumulated depreciation; leases accounted for per IFRS 16 adapted',
        keyRequirements: [
          'Depreciation calculated on systematic basis over useful life',
          'Residual values assessed appropriately',
          'Impairment indicators evaluated',
          'Leases assessed for right-of-use asset recognition',
          'Lease classification: finance vs. operating (now ROU asset per IFRS 16)'
        ],
        guidance: 'Test depreciation methodology; assess impairment; verify lease right-of-use asset calculations'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS 16',
        title: 'Leases',
        requirement: 'All leases result in recognition of right-of-use asset and lease liability; exceptions: short-term and low-value leases',
        auditImplications: 'Test lease identification, ROU asset calculation, lease liability, and interest expense accrual'
      },
      {
        standard: 'IFRS 36',
        title: 'Impairment of Assets',
        requirement: 'Assets tested for impairment if indicators present; goodwill tested annually',
        auditImplications: 'Evaluate impairment testing methodology, key assumptions, and fair value calculations'
      }
    ],
    keyAuditMatters: [
      'Completeness and authorization of fixed asset additions and disposals',
      'Appropriateness of depreciation methods and useful lives',
      'Lease identification and right-of-use asset recognition',
      'Impairment assessment and provision adequacy',
      'Capitalization vs. expense classification',
      'Related party asset transactions'
    ],
    commonRisks: [
      'Unrecorded asset disposals',
      'Repairs expensed that should be capitalized',
      'Incorrect depreciation rates or useful lives',
      'Unidentified leases or incorrect ROU asset calculation',
      'Asset impairment indicators not assessed',
      'Assets fully depreciated but still in use',
      'Related party transactions at inappropriate values'
    ],
    proceduresChecklist: [
      { procedure: 'Evaluate depreciation policies for consistency and FRS 102 compliance', priority: 'High', phase: 'Planning' },
      { procedure: 'Identify all leases and test ROU asset calculation', priority: 'High', phase: 'Risk Assessment' },
      { procedure: 'Test fixed asset additions and disposals', priority: 'High', phase: 'Interim' },
      { procedure: 'Assess asset impairment indicators', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Verify depreciation calculations', priority: 'Medium', phase: 'Final Audit' },
      { procedure: 'Test lease liability and interest expense', priority: 'High', phase: 'Final Audit' }
    ],
    sampleProcedures: {
      testingApproaches: ['Document review', 'Recalculation', 'Lease analysis', 'Impairment testing'],
      extent: 'All additions and disposals; significant assets; all material leases',
      timing: 'Interim for controls and policy review; final for substantive testing'
    }
  },

  'D6': {
    label: 'Payables & Accruals',
    isaStandards: ['ISA 330', 'ISA 501', 'ISA 505'],
    isaGuidance: {
      'ISA 330': {
        title: 'The Auditor\'s Responses to Assessed Risks',
        guidance: 'Design procedures for payables completeness and accrual appropriateness.',
        keyRequirements: [
          'Test completeness of recorded payables',
          'Perform cutoff procedures for year-end',
          'Evaluate accrual calculations and estimates',
          'Assess related payables to subsequent invoice receipt'
        ],
        documentationRequirements: ['Payables procedure design', 'Cutoff testing', 'Accrual testing results']
      },
      'ISA 501': {
        title: 'Audit Evidence - Specific Considerations',
        guidance: 'Obtain audit evidence for completeness of payables and appropriateness of accruals.',
        keyRequirements: [
          'Request unpaid invoice listing from vendor statements',
          'Perform subsequent payment testing',
          'Evaluate accrual adequacy and support',
          'Assess potential unrecorded liabilities'
        ],
        documentationRequirements: ['Payables confirmations', 'Subsequent payment analysis', 'Accrual support']
      },
      'ISA 505': {
        title: 'External Confirmations',
        guidance: 'Consider confirmations from major suppliers to verify payables.',
        keyRequirements: [
          'Select major suppliers for confirmation requests',
          'Evaluate reconciling differences',
          'Follow up on non-responses',
          'Consider confirmations from other vendors (utilities, tax, etc.)'
        ],
        documentationRequirements: ['Confirmation requests and responses', 'Reconciliation analysis', 'Follow-up documentation']
      }
    },
    frsRequirements: {
      'FRS 102': {
        title: 'FRS 102 - Provisions and Payables',
        scope: 'Payables recorded at agreed amounts; provisions for obligations recorded when criteria met',
        keyRequirements: [
          'Payables recorded when goods received or services rendered',
          'Provisions recorded only when present obligation exists',
          'Accruals for period costs (wages, utilities, professional fees)',
          'Accruals supported by agreements, invoices, or estimates',
          'Related party payables disclosed separately'
        ],
        guidance: 'Verify payables completeness; assess accrual appropriateness; ensure proper cutoff'
      }
    },
    ifrsRequirements: [
      {
        standard: 'IFRS 37',
        title: 'Provisions, Contingent Liabilities and Contingent Assets',
        requirement: 'Provisions recognized only when: present obligation exists, probable outflow expected, reliable estimate possible',
        auditImplications: 'Challenge provision estimates; evaluate contingent liability disclosures; assess management bias'
      }
    ],
    keyAuditMatters: [
      'Completeness of recorded payables',
      'Appropriateness of period accruals',
      'Accuracy of accrual calculations',
      'Proper period cutoff',
      'Adequacy of provisions for known obligations',
      'Disclosure of contingent liabilities'
    ],
    commonRisks: [
      'Unrecorded payables or accruals',
      'Cutoff errors at period end',
      'Inaccurate accrual calculations',
      'Inappropriate provision amounts',
      'Failure to accrue known obligations',
      'Accruals not supported by appropriate documentation',
      'Contingent liabilities not disclosed'
    ],
    proceduresChecklist: [
      { procedure: 'Evaluate payables recording policies', priority: 'High', phase: 'Planning' },
      { procedure: 'Request major supplier confirmations', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Perform cutoff testing on year-end invoices and GRN', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Test subsequent payments post year-end', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Review and test accrual calculations', priority: 'High', phase: 'Final Audit' },
      { procedure: 'Assess provisions and contingent liabilities', priority: 'Medium', phase: 'Final Audit' },
      { procedure: 'Analyze payables aging and significant balances', priority: 'Medium', phase: 'Final Audit' }
    ],
    sampleProcedures: {
      testingApproaches: ['External confirmations', 'Subsequent payment review', 'Cutoff testing', 'Accrual testing'],
      extent: 'Significant payables and suppliers; all accruals; selected period-end invoices',
      timing: 'Interim for policy review; final audit for cutoff and accrual testing'
    }
  }
};

/**
 * Get compliance content for a specific FSLI
 * @param {string} fsliId - FSLI identifier (e.g., 'C1', 'D3', 'D5')
 * @returns {object} Compliance content for the FSLI
 */
export function getComplianceContentByFSLI(fsliId) {
  return COMPLIANCE_CONTENT_BY_FSLI[fsliId] || null;
}

/**
 * Get all ISA standards applicable to a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Array of ISA standard IDs
 */
export function getISAStandardsByFSLI(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.isaStandards : [];
}

/**
 * Get detailed guidance for an ISA standard within a specific FSLI context
 * @param {string} fsliId - FSLI identifier
 * @param {string} isaStandard - ISA standard (e.g., 'ISA 500')
 * @returns {object} ISA guidance for the FSLI
 */
export function getISAGuidance(fsliId, isaStandard) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  if (!content || !content.isaGuidance) return null;
  return content.isaGuidance[isaStandard] || null;
}

/**
 * Get FRS requirements for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {object} FRS requirements (FRS 102, etc.)
 */
export function getFRSRequirements(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.frsRequirements : {};
}

/**
 * Get IFRS requirements for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Array of IFRS requirements
 */
export function getIFRSRequirements(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.ifrsRequirements : [];
}

/**
 * Get key audit matters for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Array of key audit matters
 */
export function getKeyAuditMatters(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.keyAuditMatters : [];
}

/**
 * Get common audit risks for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Array of common risks
 */
export function getCommonRisks(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.commonRisks : [];
}

/**
 * Get procedures checklist for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {array} Array of procedures with priority and phase
 */
export function getProceduresChecklist(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.proceduresChecklist : [];
}

/**
 * Get sample procedures guidance for a specific FSLI
 * @param {string} fsliId - FSLI identifier
 * @returns {object} Sample procedures guidance including testing approaches, extent, timing
 */
export function getSampleProcedures(fsliId) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];
  return content ? content.sampleProcedures : {};
}

/**
 * Get comprehensive content package for a section when it's opened
 * Includes all guidance, procedures, ISA, FRS, IFRS requirements
 * @param {string} fsliId - FSLI identifier
 * @param {object} engagementContext - Optional engagement characteristics (industry, risk level, entity size)
 * @returns {object} Complete compliance content package
 */
export function getComprehensiveGuidancePackage(fsliId, engagementContext = {}) {
  const content = COMPLIANCE_CONTENT_BY_FSLI[fsliId];

  if (!content) {
    return {
      success: false,
      message: `No compliance content found for FSLI: ${fsliId}`,
      data: null
    };
  }

  return {
    success: true,
    data: {
      fsliId,
      label: content.label,
      isaStandards: content.isaStandards,
      isaGuidance: content.isaGuidance,
      frsRequirements: content.frsRequirements,
      ifrsRequirements: content.ifrsRequirements,
      keyAuditMatters: content.keyAuditMatters,
      commonRisks: content.commonRisks,
      proceduresChecklist: content.proceduresChecklist,
      sampleProcedures: content.sampleProcedures,
      generatedAt: new Date().toISOString(),
      engagementContext
    }
  };
}

/**
 * Get list of all available FSLIs with their labels
 * @returns {array} Array of FSLIs and labels
 */
export function getAllFSLILabels() {
  return Object.entries(COMPLIANCE_CONTENT_BY_FSLI).map(([id, content]) => ({
    id,
    label: content.label,
    isaStandards: content.isaStandards
  }));
}

export default {
  getComplianceContentByFSLI,
  getISAStandardsByFSLI,
  getISAGuidance,
  getFRSRequirements,
  getIFRSRequirements,
  getKeyAuditMatters,
  getCommonRisks,
  getProceduresChecklist,
  getSampleProcedures,
  getComprehensiveGuidancePackage,
  getAllFSLILabels
};
