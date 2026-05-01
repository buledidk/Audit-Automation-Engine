/**
 * SUBSTANTIVE PROCEDURES AGENT (ISA 330.18-21)
 * AI agent that generates risk-responsive substantive audit programmes per section.
 * Tailors nature, timing, and extent of procedures to assessed risk levels.
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet
 * ISA References: ISA 330.18-21, ISA 500, ISA 530
 */

import { Anthropic } from "@anthropic-ai/sdk";
import {
  PROCEDURE_D3_REVENUE,
  PROCEDURE_D4_INVENTORY,
  PROCEDURE_D5_FIXED_ASSETS,
} from "../data/auditProcedureLibrary.js";
import { AUDIT_AREA_CONFIG } from "../data/procedureLibraryConfig.js";
import { SUBSTANTIVE_PROCEDURES } from "../AuditMethodology.js";

// Map section codes to available procedure library arrays
const SECTION_PROCEDURE_MAP = {
  D3: { library: PROCEDURE_D3_REVENUE, methodology: "d1_revenue" },
  D4: { library: PROCEDURE_D4_INVENTORY, methodology: "d3_inventory" },
  D5: { library: PROCEDURE_D5_FIXED_ASSETS, methodology: "d7_fixed_assets" },
  D6: { library: null, methodology: "d4_payables" },
  D7: { library: null, methodology: "d11_loans" },
  D8: { library: null, methodology: "d13_tax" },
  D9: { library: null, methodology: "d12_provisions" },
  D10: { library: null, methodology: "d10_equity" },
  D11: { library: null, methodology: "d6_cash" },
  D12: { library: null, methodology: null },
  D13: { library: null, methodology: null },
  D14: { library: null, methodology: "d15_related_parties" },
};

class SubstantiveProceduresAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-sonnet-4-6";
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Generate a substantive programme for a single audit section.
   * Looks up base procedures from library, then calls Claude to tailor
   * nature/timing/extent to the risk level.
   */
  async generateSubstantiveProgramme(context) {
    const { sectionCode, engagementId } = context;
    const cacheKey = `subst_prog_${engagementId}_${sectionCode}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const areaConfig = AUDIT_AREA_CONFIG[sectionCode];
    if (!areaConfig) {
      return { success: false, error: `Unknown section code: ${sectionCode}` };
    }

    // Gather base procedures from library + methodology
    const baseProcedures = this._getBaseProcedures(sectionCode);
    const riskLevel = context.assessedRisk || areaConfig.typicalRisk || "MEDIUM";

    const prompt = `You are an expert UK auditor generating a substantive audit programme per ISA 330.18-21.

AUDIT SECTION: ${areaConfig.code} — ${areaConfig.name}
ASSESSED RISK: ${riskLevel}
AUDIT APPROACH: ${context.auditApproach || "SUBSTANTIVE_ONLY"}
CONTROL RELIANCE: ${context.controlReliance || "NO_RELIANCE"}

ENTITY CONTEXT:
- Industry: ${context.industry || "General"}
- Entity Size: ${context.entitySize || "SME"}
- Materiality: ${context.materiality || "Not set"}
- Financial Year End: ${context.financialYearEnd || "Not specified"}
- Key Assertions at Risk: ${(context.assertionsAtRisk || areaConfig.keyAssertions).join(", ")}

RISK AREAS FOR THIS SECTION:
${areaConfig.riskAreas.map((r) => `- ${r}`).join("\n")}

BASE PROCEDURES FROM LIBRARY (to tailor):
${baseProcedures.map((p, i) => `${i + 1}. ${p.title || p.name || p.description || p}`).join("\n")}

ISA REFERENCES: ${areaConfig.isaReferences.join(", ")}

Generate a tailored substantive programme. For each procedure, specify:
1. Nature of test (inspection, observation, inquiry, recalculation, reperformance, analytical, confirmation)
2. Timing (interim, year-end, post year-end)
3. Sample size with method and rationale (adjust for risk level)
4. Evidence requirements
5. Priority (HIGH/MEDIUM/LOW)

Return ONLY valid JSON:
{
  "sectionCode": "${sectionCode}",
  "auditApproach": "COMBINED or SUBSTANTIVE_ONLY",
  "assertionsAtRisk": [],
  "procedures": [
    {
      "id": "${sectionCode}_SP_001",
      "title": "Procedure title",
      "assertions": ["EXISTENCE", "ACCURACY"],
      "isaRef": "ISA 330.18",
      "natureOfTest": "Recalculation",
      "timing": "Year-end",
      "sampleSize": {
        "method": "STRATIFIED",
        "size": 25,
        "rationale": "Based on HIGH assessed risk"
      },
      "evidence": ["Invoice", "Delivery note"],
      "priority": "HIGH"
    }
  ],
  "gapAnalysis": {
    "uncoveredAssertions": [],
    "additionalProceduresNeeded": []
  },
  "totalEstimatedHours": number
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const programme = JSON.parse(text);

    programme.timestamp = new Date().toISOString();
    programme.isaReference = "ISA 330.18-21 — Substantive procedures responsive to assessed risks";

    this.cache.set(cacheKey, programme);
    setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

    return programme;
  }

  /**
   * Generate substantive programmes for ALL active sections in an engagement.
   * Batches 3 concurrent calls to respect API rate limits.
   */
  async generateFullEngagementProgramme(context) {
    const { sections, engagementId } = context;
    const activeSections = sections || Object.keys(AUDIT_AREA_CONFIG);

    const results = [];
    const BATCH_SIZE = 3;

    // Process in batches of 3 to respect rate limits
    for (let i = 0; i < activeSections.length; i += BATCH_SIZE) {
      const batch = activeSections.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((sectionCode) =>
          this.generateSubstantiveProgramme({
            ...context,
            sectionCode,
            engagementId,
          }).catch((err) => ({
            sectionCode,
            success: false,
            error: err.message,
          }))
        )
      );
      results.push(...batchResults);
    }

    // Aggregate statistics
    const successful = results.filter((r) => !r.error);
    const totalProcedures = successful.reduce((sum, r) => sum + (r.procedures?.length || 0), 0);
    const totalHours = successful.reduce((sum, r) => sum + (r.totalEstimatedHours || 0), 0);

    return {
      engagementId,
      sectionsProcessed: results.length,
      sectionsSuccessful: successful.length,
      sectionsFailed: results.length - successful.length,
      totalProcedures,
      totalEstimatedHours: totalHours,
      programmes: results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Adjust procedures for a new risk level (recalibrate sample sizes).
   */
  adjustProceduresForRisk(procedures, newRiskLevel) {
    const sizeMultipliers = { HIGH: 1.5, MEDIUM: 1.0, LOW: 0.7 };
    const multiplier = sizeMultipliers[newRiskLevel] || 1.0;

    return procedures.map((proc) => ({
      ...proc,
      sampleSize: proc.sampleSize
        ? {
            ...proc.sampleSize,
            size: Math.ceil((proc.sampleSize.size || 25) * multiplier),
            rationale: `Adjusted for ${newRiskLevel} risk (×${multiplier})`,
          }
        : proc.sampleSize,
      _adjustedForRisk: newRiskLevel,
    }));
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  _getBaseProcedures(sectionCode) {
    const mapping = SECTION_PROCEDURE_MAP[sectionCode];
    const procedures = [];

    // From procedure library (detailed D3/D4/D5)
    if (mapping?.library) {
      for (const proc of mapping.library) {
        procedures.push({
          id: proc.id,
          title: proc.title || proc.name,
          assertions: proc.assertions,
          description: proc.description,
        });
      }
    }

    // From AuditMethodology SUBSTANTIVE_PROCEDURES
    if (mapping?.methodology && SUBSTANTIVE_PROCEDURES[mapping.methodology]) {
      const methodProcs = SUBSTANTIVE_PROCEDURES[mapping.methodology];
      if (Array.isArray(methodProcs)) {
        for (const proc of methodProcs) {
          procedures.push({ title: proc.name || proc.step || proc, source: "methodology" });
        }
      } else if (methodProcs.procedures) {
        for (const proc of methodProcs.procedures) {
          procedures.push({ title: proc.name || proc.step || proc, source: "methodology" });
        }
      }
    }

    // If no library procedures found, use area config risk areas as basis
    if (procedures.length === 0) {
      const config = AUDIT_AREA_CONFIG[sectionCode];
      if (config) {
        for (const risk of config.riskAreas) {
          procedures.push({ title: `Address risk: ${risk}`, source: "riskArea" });
        }
      }
    }

    return procedures;
  }

  /**
   * Get service metrics
   */
  getMetrics() {
    return {
      agent: "SubstantiveProceduresAgent",
      status: "READY",
      cacheSize: this.cache.size,
      model: this.model,
      sectionsSupported: Object.keys(AUDIT_AREA_CONFIG).length,
    };
  }
}

export { SubstantiveProceduresAgent };
export default new SubstantiveProceduresAgent();
