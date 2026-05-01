/**
 * AUDIT SECTIONS SERVICE
 * Manages audit sections (D3-D14) as first-class entities with lifecycle tracking.
 * No AI dependency — structural spine for the ISA 330 methodology pipeline.
 *
 * Status: ✅ PRODUCTION READY
 * ISA References: ISA 330, ISA 315, ISA 500
 */

import { AUDIT_AREA_CONFIG } from "../data/procedureLibraryConfig.js";
import { ASSERTIONS } from "../data/auditProcedureLibrary.js";

// Section lifecycle statuses
const SECTION_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  TESTING: "TESTING",
  COMPLETED: "COMPLETED",
  REVIEWED: "REVIEWED",
};

// Control reliance conclusions
const CONTROL_CONCLUSION = {
  RELY: "RELY",
  PARTIAL: "PARTIAL",
  NO_RELIANCE: "NO_RELIANCE",
};

// Valid status transitions
const STATUS_TRANSITIONS = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["TESTING", "NOT_STARTED"],
  TESTING: ["COMPLETED", "IN_PROGRESS"],
  COMPLETED: ["REVIEWED", "TESTING"],
  REVIEWED: ["COMPLETED"],
};

class AuditSectionsService {
  constructor() {
    // In-memory storage keyed by engagementId
    this.engagements = new Map();
  }

  /**
   * Initialize sections from AUDIT_AREA_CONFIG for an engagement.
   * Filters irrelevant sections based on entity context (e.g., no inventory for service companies).
   */
  initializeSections(engagementId, context = {}) {
    if (this.engagements.has(engagementId)) {
      return {
        success: true,
        message: "Sections already initialized",
        sections: this.getAllSections(engagementId),
        alreadyInitialized: true,
      };
    }

    const sections = new Map();
    const excluded = [];

    for (const [code, config] of Object.entries(AUDIT_AREA_CONFIG)) {
      // Filter irrelevant sections based on entity context
      if (this._shouldExcludeSection(code, context)) {
        excluded.push({ code, name: config.name, reason: this._getExclusionReason(code, context) });
        continue;
      }

      const section = {
        code: config.code,
        name: config.name,
        status: SECTION_STATUS.NOT_STARTED,
        riskAssessment: {
          inherentRisk: null,
          controlRisk: null,
          assessedRisk: null,
        },
        assertions: this._initializeAssertions(config.keyAssertions),
        controls: [],
        procedures: [],
        conclusion: null,
        materialityBenchmark: config.materialityBenchmark,
        typicalRisk: config.typicalRisk,
        isaReferences: config.isaReferences,
        estimatedHours: config.estimatedHours,
        riskAreas: config.riskAreas,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      sections.set(code, section);
    }

    this.engagements.set(engagementId, {
      sections,
      context,
      initializedAt: new Date().toISOString(),
    });

    return {
      success: true,
      engagementId,
      sectionsCreated: sections.size,
      sectionsExcluded: excluded.length,
      excluded,
      sections: Array.from(sections.values()),
    };
  }

  /**
   * Get a single section by code
   */
  getSection(engagementId, code) {
    const engagement = this.engagements.get(engagementId);
    if (!engagement) return null;
    return engagement.sections.get(code) || null;
  }

  /**
   * Get all sections for an engagement
   */
  getAllSections(engagementId) {
    const engagement = this.engagements.get(engagementId);
    if (!engagement) return [];
    return Array.from(engagement.sections.values());
  }

  /**
   * Get a dashboard summary of all sections
   */
  getSectionSummary(engagementId) {
    const sections = this.getAllSections(engagementId);
    if (sections.length === 0) return null;

    const statusCounts = {};
    let totalEstimatedHours = 0;
    let highRiskCount = 0;
    let completedCount = 0;

    for (const section of sections) {
      statusCounts[section.status] = (statusCounts[section.status] || 0) + 1;
      totalEstimatedHours += section.estimatedHours || 0;
      if (section.riskAssessment.assessedRisk === "HIGH") highRiskCount++;
      if (section.status === SECTION_STATUS.COMPLETED || section.status === SECTION_STATUS.REVIEWED) {
        completedCount++;
      }
    }

    return {
      engagementId,
      totalSections: sections.length,
      statusCounts,
      completionPercentage: ((completedCount / sections.length) * 100).toFixed(1),
      totalEstimatedHours,
      highRiskSections: highRiskCount,
      sectionsNeedingAttention: sections
        .filter((s) => s.riskAssessment.assessedRisk === "HIGH" && s.status === SECTION_STATUS.NOT_STARTED)
        .map((s) => ({ code: s.code, name: s.name, risk: s.riskAssessment.assessedRisk })),
    };
  }

  /**
   * Update risk assessment for a section (ISA 315.25-27)
   */
  updateSectionRisk(engagementId, code, riskAssessment) {
    const section = this.getSection(engagementId, code);
    if (!section) return { success: false, error: `Section ${code} not found` };

    const { inherentRisk, controlRisk, assessedRisk } = riskAssessment;

    if (inherentRisk) section.riskAssessment.inherentRisk = inherentRisk;
    if (controlRisk) section.riskAssessment.controlRisk = controlRisk;

    // Calculate assessed risk if both components provided
    if (section.riskAssessment.inherentRisk && section.riskAssessment.controlRisk) {
      section.riskAssessment.assessedRisk =
        assessedRisk || this._calculateAssessedRisk(section.riskAssessment.inherentRisk, section.riskAssessment.controlRisk);
    } else if (assessedRisk) {
      section.riskAssessment.assessedRisk = assessedRisk;
    }

    // Mark assertions at risk based on assessed risk level
    if (section.riskAssessment.assessedRisk === "HIGH") {
      for (const assertion of Object.values(section.assertions)) {
        assertion.atRisk = true;
      }
    }

    section.updatedAt = new Date().toISOString();

    return {
      success: true,
      code,
      riskAssessment: section.riskAssessment,
    };
  }

  /**
   * Update section status with valid transition checking
   */
  updateSectionStatus(engagementId, code, newStatus) {
    const section = this.getSection(engagementId, code);
    if (!section) return { success: false, error: `Section ${code} not found` };

    if (!SECTION_STATUS[newStatus]) {
      return { success: false, error: `Invalid status: ${newStatus}` };
    }

    const validTransitions = STATUS_TRANSITIONS[section.status];
    if (!validTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition: ${section.status} → ${newStatus}. Valid: ${validTransitions.join(", ")}`,
      };
    }

    section.status = newStatus;
    section.updatedAt = new Date().toISOString();

    return { success: true, code, previousStatus: section.status, newStatus };
  }

  /**
   * Assign a control conclusion to a section (ISA 330.8)
   */
  assignControlConclusion(engagementId, code, conclusion) {
    const section = this.getSection(engagementId, code);
    if (!section) return { success: false, error: `Section ${code} not found` };

    if (!CONTROL_CONCLUSION[conclusion]) {
      return { success: false, error: `Invalid conclusion: ${conclusion}. Valid: ${Object.keys(CONTROL_CONCLUSION).join(", ")}` };
    }

    section.conclusion = conclusion;
    section.updatedAt = new Date().toISOString();

    return { success: true, code, conclusion };
  }

  /**
   * Add a control evaluation result to a section
   */
  addControlToSection(engagementId, sectionCode, controlResult) {
    const section = this.getSection(engagementId, sectionCode);
    if (!section) return { success: false, error: `Section ${sectionCode} not found` };

    section.controls.push({
      controlCode: controlResult.controlCode,
      reliance: controlResult.reliance,
      result: controlResult.result,
      addedAt: new Date().toISOString(),
    });

    section.updatedAt = new Date().toISOString();
    return { success: true, sectionCode, controlsCount: section.controls.length };
  }

  /**
   * Add a procedure to a section
   */
  addProcedureToSection(engagementId, sectionCode, procedure) {
    const section = this.getSection(engagementId, sectionCode);
    if (!section) return { success: false, error: `Section ${sectionCode} not found` };

    section.procedures.push({
      id: procedure.id,
      type: procedure.type || "SUBSTANTIVE",
      status: procedure.status || "NOT_STARTED",
      addedAt: new Date().toISOString(),
    });

    // Mark covered assertions
    if (procedure.assertions) {
      for (const assertionKey of procedure.assertions) {
        if (section.assertions[assertionKey]) {
          section.assertions[assertionKey].covered = true;
          section.assertions[assertionKey].procedures.push(procedure.id);
        }
      }
    }

    section.updatedAt = new Date().toISOString();
    return { success: true, sectionCode, proceduresCount: section.procedures.length };
  }

  /**
   * Get assertion coverage matrix across all sections (ISA 330.25-26)
   */
  getAssertionMatrix(engagementId) {
    const sections = this.getAllSections(engagementId);
    if (sections.length === 0) return null;

    const matrix = {};
    const assertionKeys = Object.keys(ASSERTIONS);
    let totalCells = 0;
    let coveredCells = 0;
    let atRiskUncovered = 0;

    for (const section of sections) {
      matrix[section.code] = {
        name: section.name,
        assessedRisk: section.riskAssessment.assessedRisk,
        assertions: {},
      };

      for (const key of assertionKeys) {
        const assertion = section.assertions[key];
        if (assertion) {
          totalCells++;
          matrix[section.code].assertions[key] = {
            atRisk: assertion.atRisk,
            covered: assertion.covered,
            procedureCount: assertion.procedures.length,
          };
          if (assertion.covered) coveredCells++;
          if (assertion.atRisk && !assertion.covered) atRiskUncovered++;
        }
      }
    }

    return {
      engagementId,
      matrix,
      coverage: {
        totalCells,
        coveredCells,
        coveragePercentage: totalCells > 0 ? ((coveredCells / totalCells) * 100).toFixed(1) : "0",
        atRiskUncovered,
        gapStatus: atRiskUncovered === 0 ? "COMPLETE" : "GAPS_IDENTIFIED",
      },
    };
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  _initializeAssertions(keyAssertions) {
    const assertions = {};
    for (const key of keyAssertions) {
      assertions[key] = {
        atRisk: false,
        covered: false,
        procedures: [],
      };
    }
    return assertions;
  }

  _shouldExcludeSection(code, context) {
    if (!context.entityType && !context.industry) return false;

    const type = (context.entityType || "").toLowerCase();
    const industry = (context.industry || "").toLowerCase();

    // Service companies typically don't have inventory
    if (code === "D4" && (type.includes("service") || industry.includes("service") || industry.includes("saas"))) {
      return true;
    }

    // Simple entities may not have complex equity structures
    if (code === "D10" && type.includes("sole trader")) {
      return true;
    }

    return false;
  }

  _getExclusionReason(code, _context) {
    if (code === "D4") return "Service entity — inventory section not applicable";
    if (code === "D10") return "Sole trader — equity section not applicable";
    return "Not applicable for entity type";
  }

  _calculateAssessedRisk(inherentRisk, controlRisk) {
    const riskMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const inherentScore = riskMap[inherentRisk] || 2;
    const controlScore = riskMap[controlRisk] || 2;
    const combined = (inherentScore + controlScore) / 2;

    if (combined >= 2.5) return "HIGH";
    if (combined >= 1.5) return "MEDIUM";
    return "LOW";
  }

  /**
   * Get service metrics
   */
  getMetrics() {
    return {
      agent: "AuditSectionsService",
      status: "READY",
      engagementsTracked: this.engagements.size,
    };
  }
}

export { AuditSectionsService, SECTION_STATUS, CONTROL_CONCLUSION };
export default new AuditSectionsService();
