/**
 * Regional Audit Standards Framework
 * ==================================
 * Integrates multiple regional compliance requirements
 * Supports: UK, EU, US, Pakistan, and other jurisdictions
 */

export const regionalStandards = {
  UK: {
    name: 'United Kingdom Auditing Standards',
    authority: 'Financial Reporting Council (FRC)',
    standards: ['ISA (UK)', 'UK Company Law', 'FCA Handbook'],
    specificRequirements: {
      auditReport: {
        requirementName: 'Auditor\'s Report - UK Format',
        elements: [
          'Opinion on fair presentation',
          'Basis for opinion section',
          'Key audit matters (for PIEs)',
          'Conclusions on going concern',
          'Material uncertainty disclosure',
          'Auditor responsibilities',
          'Other information review'
        ]
      },
      corporateGovernance: {
        requirements: [
          'Compliance with UK Corporate Governance Code',
          'Audit Committee independence assessment',
          'Non-audit services restrictions',
          'Auditor rotation requirements (10-20 years)',
          'Engagement letter confirmation'
        ]
      },
      specificConsiderations: {
        'FCA Regulated Entities': ['Enhanced reporting', 'Senior Statutory Auditor sign-off'],
        'Public Interest Entities': ['Key audit matters', 'Viability statement assessment'],
        'Small Companies': ['Simplified audit exemptions', 'Audit thresholds ($750k)']
      }
    }
  },
  EU: {
    name: 'European Union Audit Regulations',
    authority: 'European Audit Regulation (EU) 537/2014',
    standards: ['ISA', 'EU Audit Directive 2014/56/EU'],
    specificRequirements: {
      publicInterestEntities: {
        definition: 'Listed companies, credit institutions, insurance companies',
        requirements: [
          'Statutory Auditor appointment minimum 3 years',
          'Safeguards against auditor independence threats',
          'Key audit matters disclosure',
          'Communication with audit committees',
          'Compliance with GDPR for auditor data processing'
        ]
      },
      auditFees: {
        disclosure: 'Must disclose audit and non-audit fees',
        restrictions: [
          'Non-audit fees max 70% of audit fees (average 3 years)',
          'Prohibited services: bookkeeping, internal audit',
          'Restricted services require pre-approval'
        ]
      },
      auditorRotation: {
        mandatory: true,
        principalAuditorRotation: '10-20 years for PIEs',
        qualityAssuranceReview: 'At least every 6 years'
      }
    }
  },
  US: {
    name: 'United States Auditing Standards',
    authority: 'PCAOB (Public Company Accounting Oversight Board) / AICPA',
    standards: ['PCAOB AS (Auditing Standards)', 'AICPA GAAS'],
    specificRequirements: {
      publicCompanies: {
        framework: 'PCAOB Standards',
        requirements: [
          'Attestation on internal control over financial reporting (AS 1305)',
          'Audit committee pre-approval of all services (Sarbanes-Oxley)',
          'Partner rotation (5 years)',
          'Quality control standards (AS 1015)',
          'Audit committee communication (AS 1301)'
        ]
      },
      nonPublicCompanies: {
        framework: 'AICPA GAAS',
        requirements: [
          'Single standard setters framework',
          'Risk assessment procedures',
          'Materiality and performance materiality',
          'Audit documentation standards'
        ]
      },
      specificAreas: {
        internalControls: [
          'COSO Framework alignment',
          'SOX 404 compliance (for public companies)',
          'Control environment assessment',
          'Risk evaluation procedures'
        ]
      }
    }
  },
  Pakistan: {
    name: 'Pakistan Auditing Standards',
    authority: 'International Islamic University / ICAP',
    standards: ['ISA', 'Local Companies Ordinance 2017', 'FBR Regulations'],
    specificRequirements: {
      regulatoryCompliance: {
        taxAudits: [
          'Form A Audit Certificate',
          'Sales Tax audit',
          'Income Tax audit procedures',
          'FBR regulatory compliance'
        ]
      },
      localConsiderations: {
        requirements: [
          'Compliance with SBP (State Bank) guidelines',
          'Foreign exchange transaction audit',
          'Zakat audit procedures',
          'Local government tax compliance'
        ]
      },
      auditReporting: {
        elements: [
          'Statutory auditor opinion',
          'Limited review opinion',
          'Management letter recommendations',
          'Tax compliance statement'
        ]
      }
    }
  },
  regionSpecificRisks: {
    UK: ['Economic downturn, post-Brexit implications', 'FCA enforcement actions'],
    EU: ['GDPR compliance', 'Cross-border operations'],
    US: ['SOX compliance', 'SEC enforcement', 'NASDAQ requirements'],
    Pakistan: ['FBR inquiries', 'Currency volatility', 'Regulatory changes']
  }
};

export const complianceMatrix = {
  auditPhases: {
    'Planning Phase': {
      UK: {
        requirements: ['Assess FRC requirements', 'Engagement letter review', 'Fee independence check'],
        documentation: ['Independence confirmation', 'Fees policy document', 'Quality control procedures']
      },
      EU: {
        requirements: ['PIE classification', 'Rotation check', 'GDPR compliance'],
        documentation: ['PIE letter', 'Audit committee confirmation']
      },
      US: {
        requirements: ['PCAOB compliance', 'Partner rotation check', 'SOX assessment (if applicable)'],
        documentation: ['Audit committee communication', 'Partner independence letter']
      },
      Pakistan: {
        requirements: ['Tax audit planning', 'FBR notification', 'Materiality assessment'],
        documentation: ['Materiality memo', 'FBR letter']
      }
    },
    'Reporting Phase': {
      UK: {
        requirements: ['KAM disclosure', 'Going concern statement', 'FCA compliance'],
        documentation: ['Audit report in FRC format', 'KAM summary', 'Auditor sign-off']
      },
      EU: {
        requirements: ['Extended auditor report', 'Audit committee letter', 'Fee disclosure'],
        documentation: ['EU format report', 'Extended KAM', 'Fee schedule']
      },
      US: {
        requirements: ['PCAOB format', 'COSO compliance statement', 'Internal control opinion'],
        documentation: ['US format report', 'Control assessment summary']
      },
      Pakistan: {
        requirements: ['Statutory opinion', 'Tax compliance letter', 'FBR notification'],
        documentation: ['Audit report', 'Tax certificate', 'Management letter']
      }
    }
  }
};

export default regionalStandards;
