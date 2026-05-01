/**
 * SMART METHODOLOGY API ROUTES
 * Express router for the ISA 330 methodology pipeline endpoints.
 * Mounted at /api/methodology/*
 *
 * ISA References: ISA 330, ISA 315, ISA 500
 */

import { Router } from "express";
import {
  requireSmartMethodology,
  validateSectionCode,
} from "../middleware/smartMethodologyMiddleware.js";
import auditSectionsService from "../services/auditSectionsService.js";
import controlsTestingAgent from "../services/controlsTestingAgent.js";
import substantiveProceduresAgent from "../services/substantiveProceduresAgent.js";
import smartProceduresEngine from "../services/smartProceduresEngine.js";

const router = Router();

// Apply feature gate to all routes
router.use(requireSmartMethodology);

// ============================================================================
// CONTROLS EVALUATION (ISA 315 + ISA 330.8)
// ============================================================================

router.post("/controls-evaluation", async (req, res) => {
  try {
    const { engagementId, sectionCode, industry, entitySize, entityType, priorIssues, riskLevel } = req.body;

    if (!engagementId) {
      return res.status(400).json({ error: "Missing engagementId" });
    }

    const result = await controlsTestingAgent.evaluateControls({
      engagementId,
      sectionCode,
      industry,
      entitySize,
      entityType,
      priorIssues,
      riskLevel,
    });

    res.json({
      success: true,
      engagementId,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Controls evaluation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SUBSTANTIVE PROGRAMME (ISA 330.18-21)
// ============================================================================

router.post("/substantive-programme", async (req, res) => {
  try {
    const {
      engagementId,
      sectionCode,
      assessedRisk,
      auditApproach,
      controlReliance,
      industry,
      entitySize,
      materiality,
      financialYearEnd,
      assertionsAtRisk,
    } = req.body;

    if (!engagementId || !sectionCode) {
      return res.status(400).json({ error: "Missing engagementId or sectionCode" });
    }

    const result = await substantiveProceduresAgent.generateSubstantiveProgramme({
      engagementId,
      sectionCode,
      assessedRisk,
      auditApproach,
      controlReliance,
      industry,
      entitySize,
      materiality,
      financialYearEnd,
      assertionsAtRisk,
    });

    res.json({
      success: true,
      engagementId,
      sectionCode,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Substantive programme error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/substantive-programme/full", async (req, res) => {
  try {
    const { engagementId, sections, industry, entitySize, materiality, financialYearEnd } = req.body;

    if (!engagementId) {
      return res.status(400).json({ error: "Missing engagementId" });
    }

    const result = await substantiveProceduresAgent.generateFullEngagementProgramme({
      engagementId,
      sections,
      industry,
      entitySize,
      materiality,
      financialYearEnd,
    });

    res.json({
      success: true,
      engagementId,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Full substantive programme error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SECTIONS MANAGEMENT
// ============================================================================

router.post("/sections/initialize", async (req, res) => {
  try {
    const { engagementId, entityType, industry } = req.body;

    if (!engagementId) {
      return res.status(400).json({ error: "Missing engagementId" });
    }

    const result = auditSectionsService.initializeSections(engagementId, {
      entityType,
      industry,
    });

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sections initialize error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/sections/:engagementId", (req, res) => {
  try {
    const { engagementId } = req.params;
    const sections = auditSectionsService.getAllSections(engagementId);

    if (sections.length === 0) {
      return res.status(404).json({
        error: "No sections found",
        message: `No sections initialized for engagement ${engagementId}. POST /sections/initialize first.`,
      });
    }

    res.json({
      success: true,
      engagementId,
      sections,
      total: sections.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sections/:engagementId/:code", validateSectionCode, (req, res) => {
  try {
    const { engagementId, code } = req.params;
    const section = auditSectionsService.getSection(engagementId, code);

    if (!section) {
      return res.status(404).json({
        error: `Section ${code} not found for engagement ${engagementId}`,
      });
    }

    res.json({ success: true, section });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/sections/:engagementId/:code/risk", validateSectionCode, (req, res) => {
  try {
    const { engagementId, code } = req.params;
    const { inherentRisk, controlRisk, assessedRisk } = req.body;

    const result = auditSectionsService.updateSectionRisk(engagementId, code, {
      inherentRisk,
      controlRisk,
      assessedRisk,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/sections/:engagementId/:code/status", validateSectionCode, (req, res) => {
  try {
    const { engagementId, code } = req.params;
    const { status } = req.body;

    const result = auditSectionsService.updateSectionStatus(engagementId, code, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sections/:engagementId/summary", (req, res) => {
  try {
    const { engagementId } = req.params;
    const summary = auditSectionsService.getSectionSummary(engagementId);

    if (!summary) {
      return res.status(404).json({
        error: "No sections found for this engagement",
      });
    }

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sections/:engagementId/assertion-matrix", (req, res) => {
  try {
    const { engagementId } = req.params;
    const matrix = auditSectionsService.getAssertionMatrix(engagementId);

    if (!matrix) {
      return res.status(404).json({
        error: "No assertion matrix available",
        message: "Initialize sections and run procedures first",
      });
    }

    res.json({ success: true, ...matrix });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SMART PROCEDURES - FULL ISA 330 PIPELINE
// ============================================================================

router.post("/smart-procedures", async (req, res) => {
  try {
    const {
      engagementId,
      industry,
      entityType,
      entitySize,
      materiality,
      financialYearEnd,
      priorIssues,
    } = req.body;

    if (!engagementId) {
      return res.status(400).json({ error: "Missing engagementId" });
    }

    console.log(`\n🔬 Smart Procedures Pipeline started for engagement ${engagementId}`);

    const result = await smartProceduresEngine.executeMethodologySuite({
      engagementId,
      industry,
      entityType,
      entitySize,
      materiality,
      financialYearEnd,
      priorIssues,
    });

    res.json({
      success: result.success,
      engagementId,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Smart procedures pipeline error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/smart-procedures/:engagementId", (req, res) => {
  try {
    const { engagementId } = req.params;
    const execution = smartProceduresEngine.getExecution(engagementId);

    if (!execution) {
      return res.status(404).json({
        error: "No execution found",
        message: `No smart procedures result found for engagement ${engagementId}. POST /smart-procedures first.`,
      });
    }

    res.json({ success: true, execution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
