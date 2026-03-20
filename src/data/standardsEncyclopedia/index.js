/**
 * STANDARDS ENCYCLOPEDIA — CENTRAL INDEX
 * Unified access point for all FRS, IFRS, ISA, Companies House,
 * and Compliance/Complaint Reporting data
 *
 * Usage:
 *   import { standardsEncyclopedia } from './standardsEncyclopedia';
 *   const section = standardsEncyclopedia.frs.lookupSection('17'); // PP&E
 *   const isa = standardsEncyclopedia.isa.lookup(315);            // Risk Assessment
 *   const ifrs = standardsEncyclopedia.ifrs.lookup('IFRS_16');    // Leases
 *   const classification = standardsEncyclopedia.companiesHouse.classifyEntity(5000000, 2000000, 30);
 */

// FRS Standards
export {
  FRS_100,
  FRS_101,
  FRS_102,
  FRS_103,
  FRS_104,
  FRS_105,
  FRS_STANDARDS_INDEX,
  lookupFRS102Section,
  searchFRSSections
} from './frsStandards.js';

// IFRS & IAS Standards
export {
  IFRS_STANDARDS,
  IAS_STANDARDS,
  INTERPRETATIONS_INDEX,
  lookupStandard,
  searchIFRSStandards,
  getFRS102Equivalent
} from './ifrsStandards.js';

// ISA Standards
export {
  QUALITY_MANAGEMENT,
  ISA_GENERAL_PRINCIPLES,
  ISA_RISK_ASSESSMENT,
  ISA_AUDIT_EVIDENCE,
  ISA_USING_OTHERS,
  ISA_REPORTING,
  ISRE_2410,
  ISA_STANDARDS_INDEX,
  lookupISA,
  getISAsByPhase,
  searchISAs
} from './isaStandards.js';

// Companies House
export {
  ENTITY_CLASSIFICATIONS,
  FILING_DEADLINES,
  COMPANIES_HOUSE_API,
  COMMON_SIC_CODES,
  COMPANY_TYPES,
  CONFIRMATION_STATEMENT,
  PSC_REQUIREMENTS,
  classifyEntity,
  checkAuditExemption,
  lookupSICCode
} from './companiesHouse.js';

// Compliance & Complaint Reporting
export {
  FRC_COMPLAINTS,
  AML_REPORTING,
  WHISTLEBLOWING,
  HMRC_REPORTING,
  PROFESSIONAL_BODY_COMPLAINTS,
  OTHER_REGULATORY_REPORTING,
  REGULATORY_CONTACTS,
  getApplicableReportingObligations,
  getAuditorReportingObligations
} from './complianceReporting.js';

// ============================================================================
// UNIFIED ENCYCLOPEDIA OBJECT
// ============================================================================
import { FRS_100, FRS_101, FRS_102, FRS_103, FRS_104, FRS_105, FRS_STANDARDS_INDEX, lookupFRS102Section, searchFRSSections } from './frsStandards.js';
import { IFRS_STANDARDS, IAS_STANDARDS, INTERPRETATIONS_INDEX, lookupStandard, searchIFRSStandards, getFRS102Equivalent } from './ifrsStandards.js';
import { QUALITY_MANAGEMENT, ISA_GENERAL_PRINCIPLES, ISA_RISK_ASSESSMENT, ISA_AUDIT_EVIDENCE, ISA_USING_OTHERS, ISA_REPORTING, ISRE_2410, ISA_STANDARDS_INDEX, lookupISA, getISAsByPhase, searchISAs } from './isaStandards.js';
import { ENTITY_CLASSIFICATIONS, FILING_DEADLINES, COMPANIES_HOUSE_API, COMMON_SIC_CODES, COMPANY_TYPES, CONFIRMATION_STATEMENT, PSC_REQUIREMENTS, classifyEntity, checkAuditExemption, lookupSICCode } from './companiesHouse.js';
import { FRC_COMPLAINTS, AML_REPORTING, WHISTLEBLOWING, HMRC_REPORTING, PROFESSIONAL_BODY_COMPLAINTS, OTHER_REGULATORY_REPORTING, REGULATORY_CONTACTS, getApplicableReportingObligations, getAuditorReportingObligations } from './complianceReporting.js';

export const standardsEncyclopedia = {
  // ---- FRS ----
  frs: {
    FRS_100, FRS_101, FRS_102, FRS_103, FRS_104, FRS_105,
    index: FRS_STANDARDS_INDEX,
    lookupSection: lookupFRS102Section,
    search: searchFRSSections
  },

  // ---- IFRS / IAS ----
  ifrs: {
    standards: IFRS_STANDARDS,
    ias: IAS_STANDARDS,
    interpretations: INTERPRETATIONS_INDEX,
    lookup: lookupStandard,
    search: searchIFRSStandards,
    getFRS102Equivalent
  },

  // ---- ISA ----
  isa: {
    qualityManagement: QUALITY_MANAGEMENT,
    generalPrinciples: ISA_GENERAL_PRINCIPLES,
    riskAssessment: ISA_RISK_ASSESSMENT,
    auditEvidence: ISA_AUDIT_EVIDENCE,
    usingOthers: ISA_USING_OTHERS,
    reporting: ISA_REPORTING,
    reviewEngagements: ISRE_2410,
    index: ISA_STANDARDS_INDEX,
    lookup: lookupISA,
    getByPhase: getISAsByPhase,
    search: searchISAs
  },

  // ---- Companies House ----
  companiesHouse: {
    classifications: ENTITY_CLASSIFICATIONS,
    deadlines: FILING_DEADLINES,
    api: COMPANIES_HOUSE_API,
    sicCodes: COMMON_SIC_CODES,
    companyTypes: COMPANY_TYPES,
    confirmationStatement: CONFIRMATION_STATEMENT,
    pscRequirements: PSC_REQUIREMENTS,
    classifyEntity,
    checkAuditExemption,
    lookupSICCode
  },

  // ---- Compliance & Complaints ----
  compliance: {
    frcComplaints: FRC_COMPLAINTS,
    aml: AML_REPORTING,
    whistleblowing: WHISTLEBLOWING,
    hmrc: HMRC_REPORTING,
    professionalBodies: PROFESSIONAL_BODY_COMPLAINTS,
    otherRegulatory: OTHER_REGULATORY_REPORTING,
    contacts: REGULATORY_CONTACTS,
    getApplicableObligations: getApplicableReportingObligations,
    getAuditorObligations: getAuditorReportingObligations
  },

  // ---- Cross-reference utilities ----
  /**
   * Universal search across all standards
   * @param {string} keyword
   * @returns {object} Results grouped by standard type
   */
  search(keyword) {
    return {
      frs: searchFRSSections(keyword),
      ifrs: searchIFRSStandards(keyword),
      isa: searchISAs(keyword)
    };
  },

  /**
   * Get complete framework guidance for an entity type
   * @param {string} entityType - 'micro', 'small', 'medium', 'large', 'plc'
   * @returns {object} Framework, filing, and audit requirements
   */
  getEntityGuidance(entityType) {
    const classification = ENTITY_CLASSIFICATIONS[entityType];
    if (!classification) return null;

    return {
      classification,
      reportingFramework: classification.reportingFramework,
      auditRequired: classification.auditRequired,
      filingDeadlines: classification.filingRequirements,
      auditExemption: entityType === 'micro' || entityType === 'small'
        ? checkAuditExemption(entityType)
        : { exempt: false, reason: 'Audit required for this entity type' }
    };
  }
};

export default standardsEncyclopedia;
