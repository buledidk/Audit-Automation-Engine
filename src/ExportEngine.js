// ═══════════════════════════════════════════════════════════════
// EXPORT ENGINE — Orchestrator routing WPs to correct exporter
// AuditEngine v10 AURA
// ═══════════════════════════════════════════════════════════════

import {
  exportTestingWP,
  exportLeadSchedule,
  exportFinancialModel,
  exportFinancialStatement,
  exportPlanningWP,
  exportRiskWP,
  exportCompletionWP,
  exportRegulatoryWP,
  exportResearchWP,
  exportChartOfAccountsWP,
  exportStandardsBrowserWP,
  exportReportingWP,
  exportTrailWP,
  exportGenericWP,
} from "./XlsxExporter";

import {
  generateEngagementLetter,
  generateRepresentationsLetter,
  generateManagementLetter,
  generateAuditReport,
  generatePlanningMemo,
  generateCompletionMemo,
} from "./DocxExporter";

import {
  generateApproachPaperDocx,
  generateConfirmationLettersDocx,
  generatePlanningMemoDocx,
  generateCompletionMemoDocx,
} from "./WordGenerator";

import JSZip from "jszip";
import { saveAs } from "file-saver";

// ═══ FORMAT ROUTING ═══

const DOCX_WPS = new Set(["a1", "a3", "a5", "e4", "e6", "f1", "f2", "conf1"]);

/**
 * Get the export format for a working paper.
 * @returns {'docx'|'xlsx'}
 */
export function getExportFormat(wp) {
  if (DOCX_WPS.has(wp.id)) return "docx";
  return "xlsx";
}

/**
 * Get a human-readable label for the export format.
 */
export function getExportLabel(wp) {
  const fmt = getExportFormat(wp);
  return fmt === "docx" ? "Word" : "Excel";
}

/**
 * Get the icon for the export format.
 */
export function getExportIcon(wp) {
  const fmt = getExportFormat(wp);
  return fmt === "docx" ? "📄" : "📊";
}

/**
 * Build a standardised filename: entityName_FYE_WPRef_YYYYMMDD.ext
 */
export function buildFilename(ctx, wpRef, ext) {
  const entity = (ctx.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_");
  const ref = (wpRef || "WP").replace(/[^a-zA-Z0-9]/g, "_");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `AE_${entity}_${ref}_${date}.${ext}`;
}

/**
 * Single entry point for exporting any working paper.
 * @param {Object} wp - The working paper object { id, label, ref, type, isa, fk }
 * @param {Object} ctx - Context object with all required data:
 *   - entityName, fye, industry, sector, framework, materiality, perfMateriality, trivial
 *   - firmName, partner, manager
 *   - cellData, signOffs, wpNotes, customItems
 *   - getCell(table, row, col) function
 *   - WPS, TESTS (the full data arrays — passed as params to avoid circular deps)
 *   - ind (industry object)
 *   - risks (array of risk objects)
 *   - fsliLines (array of FSLI line item strings for the WP)
 *   - tests (TESTS object)
 *   - customTests (customItems.tests)
 *   - leadHeaders, leadRows (for lead schedule WPs)
 *   - modelData (for financial model WPs)
 *   - engagementLetterData, representationsData, auditOpinions (for docx WPs)
 */
export async function exportWP(wp, ctx) {
  const fmt = getExportFormat(wp);

  if (fmt === "docx") {
    switch (wp.id) {
      case "a1":
        return generateEngagementLetter(ctx, ctx.engagementLetterData);
      case "a3":
        return generateApproachPaperDocx(ctx);
      case "a5":
        return generatePlanningMemoDocx(ctx);
      case "e4":
        return generateRepresentationsLetter(ctx, ctx.representationsData);
      case "e6":
        return generateCompletionMemoDocx(ctx);
      case "f1":
        return generateManagementLetter(ctx);
      case "f2":
        return generateAuditReport(ctx, ctx.auditOpinions);
      case "conf1":
        return generateConfirmationLettersDocx(ctx);
      default:
        // Shouldn't happen, but fallback to xlsx
        return exportGenericWP(wp, ctx);
    }
  }

  // ═══ Specific xlsx handling for WP IDs — ensures every WP has a dedicated handler ═══
  switch (wp.id) {
    // ─── RESEARCH ───
    case "res1":
      return exportResearchWP(wp, ctx);
    // ─── CHART OF ACCOUNTS ───
    case "coa1":
      return exportChartOfAccountsWP(wp, ctx);
    // ─── REGULATORY ───
    case "reg1":
    case "reg2":
    case "reg3":
    case "reg4":
      return exportRegulatoryWP(wp, ctx);
    // ─── STANDARDS BROWSER ───
    case "std1":
      return exportStandardsBrowserWP(wp, ctx);
    // ─── FINANCIAL MODELS (FM1-FM18) ───
    case "fm1": case "fm2": case "fm3": case "fm4": case "fm5":
    case "fm6": case "fm7": case "fm8": case "fm9": case "fm10":
    case "fm11": case "fm12": case "fm13": case "fm14": case "fm15":
    case "fm16": case "fm17": case "fm18":
      return exportFinancialModel(wp, ctx);
    // ─── REPORTING (non-docx) ───
    case "f3":
    case "f4":
      return exportReportingWP(wp, ctx);
    // ─── AUDIT TRAIL ───
    case "z1":
      return exportTrailWP(wp, ctx);
  }

  // xlsx export — route by WP type (catches any remaining WPs by type)
  switch (wp.type) {
    case "testing":
      return exportTestingWP(wp, ctx);
    case "lead":
      return exportLeadSchedule(wp, ctx);
    case "models":
      return exportFinancialModel(wp, ctx);
    case "fs":
      return exportFinancialStatement(wp, ctx);
    case "planning":
      return exportPlanningWP(wp, ctx);
    case "risk":
      return exportRiskWP(wp, ctx);
    case "completion":
      return exportCompletionWP(wp, ctx);
    case "regulatory":
      return exportRegulatoryWP(wp, ctx);
    case "reporting":
      return exportReportingWP(wp, ctx);
    case "research":
      return exportResearchWP(wp, ctx);
    case "trail":
      return exportTrailWP(wp, ctx);
    default:
      return exportGenericWP(wp, ctx);
  }
}

/**
 * Export Planning Memo (compiles A1-A10, B1-B3).
 */
export async function exportPlanningMemoDoc(ctx) {
  return generatePlanningMemo(ctx);
}

/**
 * Export Completion Memo (compiles E1-E6, A7).
 */
export async function exportCompletionMemoDoc(ctx) {
  return generateCompletionMemo(ctx);
}

/**
 * Generate a master ZIP file containing ALL working papers as individual files.
 * Each WP is exported in its appropriate format (docx or xlsx) and bundled into
 * a single ZIP archive for download.
 *
 * @param {Object} cfg - Configuration object with entityName, yearEnd, etc.
 * @param {Object} cellData - Cell data for all working papers
 * @param {Object} signOffs - Sign-off data for all working papers
 * @param {Object} wpNotes - Notes for all working papers
 * @param {Array} WPS - Array of all working paper objects
 */
export async function exportMasterZIP(cfg, cellData, signOffs, wpNotes, WPS) {
  const zip = new JSZip();

  const ctx = {
    entityName: cfg.entityName,
    yearEnd: cfg.yearEnd,
    fye: cfg.yearEnd,
    cellData,
    signOffs,
    wpNotes,
    ...cfg,
  };

  for (const wp of WPS) {
    const fmt = getExportFormat(wp);
    const ext = fmt === "docx" ? "docx" : "xlsx";
    const filename = buildFilename(ctx, wp.ref, ext);

    // Intercept the download by temporarily overriding the click/download mechanism
    let capturedBlob = null;
    const origCreate = document.createElement;
    document.createElement = function (tag) {
      if (tag === "a") {
        return {
          set href(val) { this._href = val; },
          get href() { return this._href; },
          set download(val) { this._download = val; },
          get download() { return this._download; },
          click() {
            // Intercept: extract blob from object URL
          },
        };
      }
      return origCreate.call(document, tag);
    };

    const origCreateObjectURL = URL.createObjectURL;
    const origRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = function (blob) {
      capturedBlob = blob;
      return "blob:captured";
    };
    URL.revokeObjectURL = function () {};

    try {
      await exportWP(wp, ctx);
    } catch (e) {
      // If individual WP export fails, skip it
      console.warn("Failed to export WP " + wp.ref + " for ZIP:", e);
    }

    // Restore originals
    document.createElement = origCreate;
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;

    if (capturedBlob) {
      const arrayBuf = await capturedBlob.arrayBuffer();
      zip.file(filename, arrayBuf);
    }
  }

  // Generate and download the ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const entityName = (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_");
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const zipFilename = `${entityName}_MasterAuditFile_${dateStamp}.zip`;
  saveAs(zipBlob, zipFilename);
}
