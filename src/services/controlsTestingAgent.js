/**
 * CONTROLS TESTING AGENT (ISA 315 + ISA 330.8)
 * AI agent that evaluates controls and recommends Tests of Controls.
 * Maps transaction cycles to control library, then uses Claude to assess
 * design/operating effectiveness and recommend audit approach.
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet
 * ISA References: ISA 315, ISA 330.8, ISA 265
 */

import { Anthropic } from "@anthropic-ai/sdk";
import { CONTROL_LIBRARY } from "../data/controlLibrary.js";

// Map audit sections to transaction cycle keys in CONTROL_LIBRARY
const SECTION_TO_CYCLE = {
  D3: "REVENUE_CYCLE",
  D4: "EXPENDITURE_CYCLE", // Inventory links to purchases
  D5: "EXPENDITURE_CYCLE",
  D6: "EXPENDITURE_CYCLE",
  D7: "FINANCE_CONTROLS",
  D8: "FINANCE_CONTROLS",
  D9: "FINANCE_CONTROLS",
  D10: "FINANCE_CONTROLS",
  D11: "FINANCE_CONTROLS",
  D12: "FINANCE_CONTROLS",
  D13: null, // Subsequent events — no direct control cycle
  D14: null, // Related parties — no direct control cycle
};

// ISA 330.8 audit approaches
const AUDIT_APPROACH = {
  COMBINED: "COMBINED",
  SUBSTANTIVE_ONLY: "SUBSTANTIVE_ONLY",
};

class ControlsTestingAgent {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-sonnet-4-6";
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Evaluate controls for an engagement context.
   * Maps transaction cycles to CONTROL_LIBRARY → Claude evaluates effectiveness.
   */
  async evaluateControls(context) {
    const cacheKey = `controls_eval_${context.engagementId}_${context.sectionCode || "all"}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Gather relevant controls based on section or all cycles
    const relevantControls = this._getRelevantControls(context.sectionCode);

    if (relevantControls.length === 0) {
      return {
        controlAssessments: [],
        testsOfControls: [],
        overallConclusion: {
          approach: AUDIT_APPROACH.SUBSTANTIVE_ONLY,
          deficiencies: [],
          weaknesses: ["No controls mapped for this section"],
        },
        isaReference: "ISA 330.8 — Substantive-only approach when controls not testable",
      };
    }

    const prompt = `You are an expert auditor evaluating internal controls per ISA 315 and ISA 330.8.

ENGAGEMENT CONTEXT:
- Industry: ${context.industry || "General"}
- Entity Size: ${context.entitySize || "SME"}
- Entity Type: ${context.entityType || "Limited Company"}
- Section: ${context.sectionCode || "All sections"}
- Prior Year Issues: ${context.priorIssues || "None known"}

CONTROLS TO EVALUATE:
${relevantControls.map((c) => `- ${c.code}: ${c.name}
  Description: ${c.description}
  Objectives: ${c.control_objectives.join(", ")}
  FSLIs: ${c.associated_fslis.join(", ")}
  Design Status: ${c.design_status}
  Operating Status: ${c.operating_status}`).join("\n\n")}

Evaluate each control for:
1. Design effectiveness (EFFECTIVE / PARTIALLY_EFFECTIVE / INEFFECTIVE)
2. Operating effectiveness (EFFECTIVE / PARTIALLY_EFFECTIVE / INEFFECTIVE)
3. Reliance recommendation (RELY / PARTIAL / NO_RELIANCE)
4. Assertions covered
5. FSLIs affected

Then provide an overall conclusion on audit approach.

Return ONLY valid JSON:
{
  "controlAssessments": [
    {
      "controlCode": "RC-001",
      "designEffectiveness": "EFFECTIVE",
      "operatingEffectiveness": "EFFECTIVE",
      "relianceRecommendation": "RELY",
      "assertionsCovered": ["EXISTENCE", "ACCURACY"],
      "fslisAffected": ["Revenue", "Receivables"],
      "rationale": "Brief reason"
    }
  ],
  "overallConclusion": {
    "approach": "COMBINED or SUBSTANTIVE_ONLY",
    "deficiencies": ["Any significant deficiencies per ISA 265"],
    "weaknesses": ["Any material weaknesses identified"]
  }
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const evaluation = JSON.parse(text);

    // Enrich with Tests of Controls
    evaluation.testsOfControls = this._generateTestsOfControls(
      evaluation.controlAssessments,
      context.riskLevel || "MEDIUM"
    );

    evaluation.isaReference = "ISA 330.8 — Determining audit approach based on control evaluation";
    evaluation.timestamp = new Date().toISOString();

    this.cache.set(cacheKey, evaluation);
    setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

    return evaluation;
  }

  /**
   * Evaluate a single control by code
   */
  async evaluateSingleControl(controlCode, context) {
    const control = this._findControlByCode(controlCode);
    if (!control) {
      return { success: false, error: `Control ${controlCode} not found in library` };
    }

    const prompt = `You are an expert auditor. Evaluate this single internal control per ISA 315:

CONTROL: ${control.code} — ${control.name}
Description: ${control.description}
Objectives: ${control.control_objectives.join(", ")}
FSLIs: ${control.associated_fslis.join(", ")}
Key Risks Addressed: ${control.key_risks_addressed.join(", ")}
Design Status: ${control.design_status}
Operating Status: ${control.operating_status}

CONTEXT:
- Industry: ${context.industry || "General"}
- Entity Size: ${context.entitySize || "SME"}
- Prior Issues: ${context.priorIssues || "None"}

Return ONLY valid JSON:
{
  "controlCode": "${control.code}",
  "designEffectiveness": "EFFECTIVE/PARTIALLY_EFFECTIVE/INEFFECTIVE",
  "operatingEffectiveness": "EFFECTIVE/PARTIALLY_EFFECTIVE/INEFFECTIVE",
  "relianceRecommendation": "RELY/PARTIAL/NO_RELIANCE",
  "assertionsCovered": [],
  "fslisAffected": [],
  "testProcedures": ["Specific test of control procedures"],
  "sampleSize": number,
  "rationale": "Explanation"
}`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    return JSON.parse(text);
  }

  /**
   * Generate Tests of Controls procedures per control
   */
  getTestOfControlsProcedures(controlCodes, riskLevel = "MEDIUM") {
    const procedures = [];

    for (const code of controlCodes) {
      const control = this._findControlByCode(code);
      if (!control) continue;

      // ISA 330 sample size: higher risk → more samples
      const sampleSizeMap = { HIGH: 40, MEDIUM: 25, LOW: 15 };
      const sampleSize = sampleSizeMap[riskLevel] || 25;

      procedures.push({
        controlCode: control.code,
        controlName: control.name,
        testDescription: control.testing_procedures.join("; "),
        sampleSize,
        timing: riskLevel === "HIGH" ? "Year-end with interim update" : "Interim with rollforward",
        evidence: control.evidence_required,
        isaRef: "ISA 330.8-10 — Tests of Controls",
      });
    }

    return procedures;
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  _getRelevantControls(sectionCode) {
    if (!sectionCode) {
      // Return all controls from all cycles
      return Object.values(CONTROL_LIBRARY).flatMap((cycle) => Object.values(cycle));
    }

    const cycleKey = SECTION_TO_CYCLE[sectionCode];
    if (!cycleKey || !CONTROL_LIBRARY[cycleKey]) return [];

    return Object.values(CONTROL_LIBRARY[cycleKey]);
  }

  _findControlByCode(controlCode) {
    // Normalize: accept both "RC-001" and "RC_001" formats
    const normalized = controlCode.replace("-", "_").toUpperCase();

    for (const cycle of Object.values(CONTROL_LIBRARY)) {
      for (const control of Object.values(cycle)) {
        if (control.code === controlCode || control.code.replace("-", "_") === normalized) {
          return control;
        }
      }
    }
    return null;
  }

  _generateTestsOfControls(assessments, riskLevel) {
    if (!assessments || assessments.length === 0) return [];

    return assessments
      .filter((a) => a.relianceRecommendation !== "NO_RELIANCE")
      .map((assessment) => {
        const control = this._findControlByCode(assessment.controlCode);
        const sampleSizeMap = { HIGH: 40, MEDIUM: 25, LOW: 15 };

        return {
          controlCode: assessment.controlCode,
          testDescription: control
            ? control.testing_procedures.join("; ")
            : `Test of control ${assessment.controlCode}`,
          sampleSize: sampleSizeMap[riskLevel] || 25,
          timing: riskLevel === "HIGH" ? "Year-end with interim update" : "Interim with rollforward",
          evidence: control ? control.evidence_required : ["Supporting documentation"],
          isaRef: "ISA 330.8-10",
        };
      });
  }

  /**
   * Get service metrics
   */
  getMetrics() {
    return {
      agent: "ControlsTestingAgent",
      status: "READY",
      cacheSize: this.cache.size,
      model: this.model,
      controlsInLibrary: Object.values(CONTROL_LIBRARY).reduce(
        (sum, cycle) => sum + Object.keys(cycle).length,
        0
      ),
    };
  }
}

export { ControlsTestingAgent, AUDIT_APPROACH };
export default new ControlsTestingAgent();
