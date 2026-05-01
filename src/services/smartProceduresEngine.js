/**
 * SMART PROCEDURES ENGINE (ISA 330 Methodology Orchestrator)
 * Chains all methodology services into the full 6-step ISA 330 pipeline:
 *   Risk Assessment → Section Identification → Assertion Mapping →
 *   Control Evaluation → Substantive Programme → Gap Analysis
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude 3.5 Sonnet (gap analysis step only)
 * ISA References: ISA 330, ISA 315, ISA 240, ISA 500
 */

import { Anthropic } from "@anthropic-ai/sdk";
import auditSectionsService from "./auditSectionsService.js";
import controlsTestingAgent from "./controlsTestingAgent.js";
import substantiveProceduresAgent from "./substantiveProceduresAgent.js";
import { AUDIT_AREA_CONFIG } from "../data/procedureLibraryConfig.js";

// Pipeline step identifiers
const PIPELINE_STEPS = {
  RISK_ASSESSMENT: "RISK_ASSESSMENT",
  SECTION_IDENTIFICATION: "SECTION_IDENTIFICATION",
  ASSERTION_MAPPING: "ASSERTION_MAPPING",
  CONTROL_EVALUATION: "CONTROL_EVALUATION",
  SUBSTANTIVE_PROGRAMME: "SUBSTANTIVE_PROGRAMME",
  GAP_ANALYSIS: "GAP_ANALYSIS",
};

class SmartProceduresEngine {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY,
    });
    this.model = "claude-sonnet-4-6";
    this.executions = new Map(); // Store completed executions
  }

  /**
   * Execute the full ISA 330 methodology pipeline.
   * 6 steps, each building on the previous.
   *
   * @param {Object} context - Engagement context
   * @param {Function} onProgress - Optional callback for step progress
   */
  async executeMethodologySuite(context, onProgress) {
    const { engagementId } = context;
    const startTime = Date.now();
    const stepResults = {};
    const errors = [];

    const reportProgress = (step, status, data) => {
      if (onProgress) {
        onProgress({ step, status, data, timestamp: new Date().toISOString() });
      }
      console.log(`   [${step}] ${status}`);
    };

    try {
      // ── STEP 1: RISK ASSESSMENT (ISA 315.25-27) ──────────────────────────
      reportProgress(PIPELINE_STEPS.RISK_ASSESSMENT, "STARTED");

      const riskResults = await this._executeRiskAssessment(context);
      stepResults.riskAssessment = riskResults;
      reportProgress(PIPELINE_STEPS.RISK_ASSESSMENT, "COMPLETED", {
        sectionsAssessed: riskResults.length,
      });

      // ── STEP 2: SECTION IDENTIFICATION ────────────────────────────────────
      reportProgress(PIPELINE_STEPS.SECTION_IDENTIFICATION, "STARTED");

      const sectionResult = auditSectionsService.initializeSections(engagementId, context);
      stepResults.sections = sectionResult;

      // Apply risk results to sections
      for (const risk of riskResults) {
        auditSectionsService.updateSectionRisk(engagementId, risk.sectionCode, {
          inherentRisk: risk.inherentRisk,
          controlRisk: risk.controlRisk || "MEDIUM",
          assessedRisk: risk.assessedRisk,
        });
      }

      reportProgress(PIPELINE_STEPS.SECTION_IDENTIFICATION, "COMPLETED", {
        sectionsCreated: sectionResult.sectionsCreated,
        sectionsExcluded: sectionResult.sectionsExcluded,
      });

      // ── STEP 3: ASSERTION MAPPING ─────────────────────────────────────────
      reportProgress(PIPELINE_STEPS.ASSERTION_MAPPING, "STARTED");

      const assertionMapping = this._mapAssertionsToRisk(engagementId, riskResults);
      stepResults.assertionMapping = assertionMapping;

      reportProgress(PIPELINE_STEPS.ASSERTION_MAPPING, "COMPLETED", {
        totalAssertionsAtRisk: assertionMapping.totalAtRisk,
      });

      // ── STEP 4: CONTROL EVALUATION (ISA 330.8) ───────────────────────────
      reportProgress(PIPELINE_STEPS.CONTROL_EVALUATION, "STARTED");

      const controlEvaluation = await controlsTestingAgent.evaluateControls({
        engagementId,
        industry: context.industry,
        entitySize: context.entitySize,
        entityType: context.entityType,
        priorIssues: context.priorIssues,
      });
      stepResults.controlEvaluation = controlEvaluation;

      // Apply control conclusions to sections
      const approach = controlEvaluation.overallConclusion?.approach || "SUBSTANTIVE_ONLY";
      for (const assessment of controlEvaluation.controlAssessments || []) {
        // Find which sections this control affects
        for (const fsli of assessment.fslisAffected || []) {
          const sectionCode = this._fsliToSectionCode(fsli);
          if (sectionCode) {
            auditSectionsService.addControlToSection(engagementId, sectionCode, {
              controlCode: assessment.controlCode,
              reliance: assessment.relianceRecommendation,
              result: assessment.designEffectiveness,
            });
          }
        }
      }

      reportProgress(PIPELINE_STEPS.CONTROL_EVALUATION, "COMPLETED", {
        controlsEvaluated: controlEvaluation.controlAssessments?.length || 0,
        approach,
      });

      // ── STEP 5: SUBSTANTIVE PROGRAMME (ISA 330.18) ────────────────────────
      reportProgress(PIPELINE_STEPS.SUBSTANTIVE_PROGRAMME, "STARTED");

      const activeSections = auditSectionsService.getAllSections(engagementId).map((s) => s.code);

      const substantiveResult = await substantiveProceduresAgent.generateFullEngagementProgramme({
        engagementId,
        sections: activeSections,
        industry: context.industry,
        entitySize: context.entitySize,
        materiality: context.materiality,
        financialYearEnd: context.financialYearEnd,
        auditApproach: approach,
        controlReliance: approach === "COMBINED" ? "PARTIAL" : "NO_RELIANCE",
      });
      stepResults.substantiveProgramme = substantiveResult;

      // Register procedures with sections
      for (const programme of substantiveResult.programmes || []) {
        if (programme.procedures) {
          for (const proc of programme.procedures) {
            auditSectionsService.addProcedureToSection(engagementId, programme.sectionCode, {
              id: proc.id,
              type: "SUBSTANTIVE",
              status: "NOT_STARTED",
              assertions: proc.assertions,
            });
          }
        }
      }

      reportProgress(PIPELINE_STEPS.SUBSTANTIVE_PROGRAMME, "COMPLETED", {
        totalProcedures: substantiveResult.totalProcedures,
        totalHours: substantiveResult.totalEstimatedHours,
      });

      // ── STEP 6: GAP ANALYSIS (ISA 330.25-26) ─────────────────────────────
      reportProgress(PIPELINE_STEPS.GAP_ANALYSIS, "STARTED");

      const assertionMatrix = auditSectionsService.getAssertionMatrix(engagementId);
      const gapAnalysis = await this._executeGapAnalysis(engagementId, context, {
        assertionMatrix,
        controlEvaluation,
        substantiveResult,
        riskResults,
      });
      stepResults.gapAnalysis = gapAnalysis;

      reportProgress(PIPELINE_STEPS.GAP_ANALYSIS, "COMPLETED", {
        gaps: gapAnalysis.gaps?.length || 0,
        isaCompliance: gapAnalysis.isaCompliance,
      });
    } catch (error) {
      errors.push({
        step: "PIPELINE",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      console.error(`   ❌ Pipeline error: ${error.message}`);
    }

    // Build final result
    const duration = Date.now() - startTime;
    const summary = auditSectionsService.getSectionSummary(engagementId);

    const result = {
      engagementId,
      success: errors.length === 0,
      pipelineSteps: Object.keys(PIPELINE_STEPS).length,
      stepsCompleted: Object.keys(stepResults).length,
      duration: `${(duration / 1000).toFixed(1)}s`,
      stepResults,
      summary,
      assertionCoverageMatrix: auditSectionsService.getAssertionMatrix(engagementId),
      statistics: {
        totalSections: summary?.totalSections || 0,
        totalProcedures: stepResults.substantiveProgramme?.totalProcedures || 0,
        totalEstimatedHours: stepResults.substantiveProgramme?.totalEstimatedHours || 0,
        controlsEvaluated: stepResults.controlEvaluation?.controlAssessments?.length || 0,
        auditApproach: stepResults.controlEvaluation?.overallConclusion?.approach || "SUBSTANTIVE_ONLY",
        gaps: stepResults.gapAnalysis?.gaps?.length || 0,
      },
      errors,
      timestamp: new Date().toISOString(),
      isaReference: "ISA 330 — Auditor's Responses to Assessed Risks",
    };

    // Store execution for later retrieval
    this.executions.set(engagementId, result);

    return result;
  }

  /**
   * Retrieve a saved execution result
   */
  getExecution(engagementId) {
    return this.executions.get(engagementId) || null;
  }

  // ── Private pipeline steps ──────────────────────────────────────────────

  /**
   * Step 1: Execute risk assessment per section using inline assessment
   * (Uses Claude directly rather than requiring riskAssessmentAgent dependency)
   */
  async _executeRiskAssessment(context) {
    const results = [];
    const sectionCodes = Object.keys(AUDIT_AREA_CONFIG);
    const BATCH_SIZE = 3;

    for (let i = 0; i < sectionCodes.length; i += BATCH_SIZE) {
      const batch = sectionCodes.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (code) => {
          const config = AUDIT_AREA_CONFIG[code];
          try {
            const prompt = `You are a UK audit risk assessor per ISA 315.25-27.

Assess inherent risk for audit section ${code} — ${config.name}.

Context:
- Industry: ${context.industry || "General"}
- Entity: ${context.entityType || "Limited Company"}
- Known risk areas: ${config.riskAreas.join(", ")}
- Typical risk level: ${config.typicalRisk}

Return ONLY valid JSON:
{
  "sectionCode": "${code}",
  "inherentRisk": "HIGH/MEDIUM/LOW",
  "controlRisk": "HIGH/MEDIUM/LOW",
  "assessedRisk": "HIGH/MEDIUM/LOW",
  "keyRiskFactors": ["factor1", "factor2"],
  "rationale": "Brief explanation"
}`;

            const message = await this.client.messages.create({
              model: this.model,
              max_tokens: 500,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
            });

            const text = message.content[0].type === "text" ? message.content[0].text : "{}";
            return JSON.parse(text);
          } catch {
            // Fallback to typical risk from config
            return {
              sectionCode: code,
              inherentRisk: config.typicalRisk.includes("HIGH") ? "HIGH" : "MEDIUM",
              controlRisk: "MEDIUM",
              assessedRisk: config.typicalRisk.includes("HIGH") ? "HIGH" : "MEDIUM",
              keyRiskFactors: config.riskAreas.slice(0, 3),
              rationale: `Fallback: based on typical risk level (${config.typicalRisk})`,
              fallback: true,
            };
          }
        })
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Step 3: Map assertions at risk per section
   */
  _mapAssertionsToRisk(engagementId, riskResults) {
    let totalAtRisk = 0;
    const mapping = {};

    for (const risk of riskResults) {
      const config = AUDIT_AREA_CONFIG[risk.sectionCode];
      if (!config) continue;

      const assertionsAtRisk = [];
      for (const assertion of config.keyAssertions) {
        // All assertions at risk for HIGH, key ones for MEDIUM
        if (risk.assessedRisk === "HIGH" || (risk.assessedRisk === "MEDIUM" && this._isKeyAssertion(risk.sectionCode, assertion))) {
          assertionsAtRisk.push(assertion);
          totalAtRisk++;
        }
      }

      mapping[risk.sectionCode] = {
        name: config.name,
        assessedRisk: risk.assessedRisk,
        assertionsAtRisk,
      };
    }

    return { mapping, totalAtRisk };
  }

  /**
   * Step 6: Gap analysis using Claude (ISA 330.25-26)
   * Checks ISA 240.26 (revenue fraud) and ISA 240.31 (management override) addressed.
   */
  async _executeGapAnalysis(engagementId, context, pipelineData) {
    const { assertionMatrix, controlEvaluation, substantiveResult, riskResults } = pipelineData;

    const prompt = `You are an audit quality reviewer performing a gap analysis per ISA 330.25-26.

ENGAGEMENT SUMMARY:
- Industry: ${context.industry || "General"}
- Entity: ${context.entityType || "Limited Company"}
- Sections: ${assertionMatrix?.coverage?.totalCells || 0} assertion cells
- Coverage: ${assertionMatrix?.coverage?.coveragePercentage || 0}%
- Uncovered at-risk assertions: ${assertionMatrix?.coverage?.atRiskUncovered || 0}

CONTROL EVALUATION RESULT:
- Approach: ${controlEvaluation?.overallConclusion?.approach || "SUBSTANTIVE_ONLY"}
- Deficiencies: ${JSON.stringify(controlEvaluation?.overallConclusion?.deficiencies || [])}

SUBSTANTIVE PROGRAMME:
- Total procedures: ${substantiveResult?.totalProcedures || 0}
- Sections processed: ${substantiveResult?.sectionsProcessed || 0}

HIGH RISK SECTIONS:
${riskResults.filter((r) => r.assessedRisk === "HIGH").map((r) => `- ${r.sectionCode}: ${r.keyRiskFactors?.join(", ") || "No factors"}`).join("\n") || "None"}

MANDATORY ISA REQUIREMENTS TO VERIFY:
1. ISA 240.26 — Revenue recognition fraud risk presumption addressed?
2. ISA 240.31 — Management override of controls addressed (journal entry testing)?
3. ISA 330.18 — Substantive procedures for all material classes of transactions?
4. ISA 330.21 — External confirmations for receivables/bank?
5. ISA 570 — Going concern indicators assessed?

Identify gaps and provide recommendations.

Return ONLY valid JSON:
{
  "gaps": [
    {
      "type": "UNCOVERED_ASSERTION",
      "sectionCode": "D3",
      "assertion": "CUTOFF",
      "severity": "HIGH/MEDIUM/LOW",
      "recommendation": "Add cutoff testing procedure"
    }
  ],
  "isaCompliance": {
    "isa240_26_revenueFraud": { "addressed": true, "notes": "" },
    "isa240_31_managementOverride": { "addressed": true, "notes": "" },
    "isa330_18_substantiveAll": { "addressed": true, "notes": "" },
    "isa330_21_confirmations": { "addressed": true, "notes": "" },
    "isa570_goingConcern": { "addressed": true, "notes": "" }
  },
  "overallAssessment": "COMPLETE/GAPS_IDENTIFIED/SIGNIFICANT_GAPS",
  "additionalProceduresNeeded": [
    { "sectionCode": "D3", "procedure": "Description", "reason": "ISA requirement" }
  ]
}`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "{}";
      const analysis = JSON.parse(text);
      analysis.timestamp = new Date().toISOString();
      return analysis;
    } catch (error) {
      return {
        gaps: [],
        isaCompliance: {},
        overallAssessment: "UNABLE_TO_ASSESS",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  _fsliToSectionCode(fsli) {
    const map = {
      Revenue: "D3",
      Receivables: "D3",
      Inventory: "D4",
      "Fixed Assets": "D5",
      "Property, Plant & Equipment": "D5",
      Payables: "D6",
      Accruals: "D6",
      Loans: "D7",
      Borrowings: "D7",
      Tax: "D8",
      Provisions: "D9",
      Equity: "D10",
      Cash: "D11",
      Bank: "D11",
    };
    return map[fsli] || null;
  }

  _isKeyAssertion(sectionCode, assertion) {
    // First 2 assertions in key list are always "key"
    const config = AUDIT_AREA_CONFIG[sectionCode];
    if (!config) return false;
    const idx = config.keyAssertions.indexOf(assertion);
    return idx >= 0 && idx < 2;
  }

  /**
   * Get service metrics
   */
  getMetrics() {
    return {
      agent: "SmartProceduresEngine",
      status: "READY",
      executionsStored: this.executions.size,
      model: this.model,
      pipelineSteps: Object.keys(PIPELINE_STEPS).length,
    };
  }
}

export { SmartProceduresEngine, PIPELINE_STEPS };
export default new SmartProceduresEngine();
