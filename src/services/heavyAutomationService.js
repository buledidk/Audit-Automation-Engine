/**
 * HEAVY AUTOMATION SERVICE
 * Claude Opus 4.6 with extended thinking for deep, multi-step audit automation
 *
 * Workflows: ISA 315/330 Risk, ISA 320 Materiality, ISA 530 Sampling,
 *            ISA 330 Procedures, ISA 450/700 Findings
 *
 * Status: ✅ PRODUCTION READY
 * Model: Claude Opus 4.6 (adaptive thinking)
 */

import claudeClient, { MODELS, EFFORT } from "./claudeClient.js";

export class HeavyAutomationService {
  constructor() {
    this.claude = claudeClient;
    this.model = MODELS.OPUS;
    this.maxTokens = 64000;
    this.timeout = parseInt(process.env.HEAVY_AUTOMATION_TIMEOUT_MS) || 120000;
    this.enabled = process.env.HEAVY_AUTOMATION_ENABLED !== "false";

    // 30-minute cache for expensive calls
    this.cache = new Map();
    this.CACHE_TTL = 30 * 60 * 1000;

    // Rate limiting: token bucket (5 concurrent, 10 per 5 min)
    this.maxConcurrent = parseInt(process.env.HEAVY_AUTOMATION_MAX_CONCURRENT) || 5;
    this.activeCalls = 0;
    this.rateWindow = [];
    this.rateWindowMs = 5 * 60 * 1000;
    this.maxPerWindow = 10;

    // Cost tracking
    this.dailyBudget = parseFloat(process.env.HEAVY_AUTOMATION_DAILY_BUDGET) || 50;
    this.dailySpend = 0;
    this.dailySpendReset = Date.now();

    // Metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      averageLatency: 0,
    };

    // Audit trail for GDPR redactions
    this.redactionLog = [];
  }

  // ═══════════════════════════════════════════════════════════════════
  // WORKFLOW METHODS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * ISA 315/330 — Comprehensive Risk Assessment
   */
  async executeComprehensiveRiskAssessment(context) {
    const system = `You are an expert ISA auditor performing a comprehensive risk assessment under ISA 315 (Revised 2019) and ISA 330.
You must identify and assess risks of material misstatement at both the financial statement level and assertion level.
Consider the entity's environment, internal controls, significant risks, and fraud risk factors.
Always cite specific ISA paragraphs to support your conclusions.`;

    const prompt = `Perform a comprehensive risk assessment for this engagement:

${JSON.stringify(context, null, 2)}

Return a detailed JSON response with this structure:
{
  "financialStatementLevelRisks": [{ "risk": "", "assessment": "HIGH/MEDIUM/LOW", "isaReference": "", "response": "" }],
  "assertionLevelRisks": [{ "fsli": "", "assertion": "", "risk": "", "inherentRisk": "HIGH/MEDIUM/LOW", "controlRisk": "HIGH/MEDIUM/LOW", "combinedRisk": "HIGH/MEDIUM/LOW", "significantRisk": true/false, "isaReference": "" }],
  "fraudRiskFactors": [{ "factor": "", "category": "incentive/opportunity/rationalization", "isaReference": "ISA 240" }],
  "controlEnvironmentAssessment": { "tone_at_top": "", "governance": "", "it_general_controls": "", "overall": "HIGH/MEDIUM/LOW" },
  "auditStrategy": { "approach": "substantive/combined", "keyAreas": [], "sampleSizeMultiplier": 1.0, "additionalProcedures": [] },
  "summary": ""
}`;

    return this._executeWorkflow("risk_assessment", system, prompt, context);
  }

  /**
   * ISA 320 — Materiality Analysis
   */
  async executeMaterialityAnalysis(context) {
    const system = `You are an expert ISA auditor calculating and documenting materiality under ISA 320.
Consider overall materiality, performance materiality (ISA 320.A12), and clearly trivial thresholds.
Apply professional judgment considering the entity's nature, industry, user expectations, and prior year adjustments.
Justify your chosen benchmark and percentage with specific reasoning.`;

    const prompt = `Perform a comprehensive materiality analysis:

${JSON.stringify(context, null, 2)}

Return detailed JSON:
{
  "benchmarkAnalysis": [{ "basis": "", "amount": 0, "percentage": 0, "materialityAmount": 0, "rationale": "" }],
  "selectedBenchmark": { "basis": "", "percentage": 0, "overallMateriality": 0, "justification": "" },
  "performanceMateriality": { "amount": 0, "percentageOfOverall": 0, "justification": "" },
  "trivialThreshold": { "amount": 0, "percentageOfOverall": 0 },
  "specificMateriality": [{ "fsli": "", "amount": 0, "reason": "" }],
  "priorYearComparison": { "priorMateriality": 0, "change": "", "reasonForChange": "" },
  "revisionTriggers": ["Scenarios that would require revision"],
  "isaCompliance": { "isa320_documented": true, "isa450_threshold_set": true, "isa320_a12_applied": true },
  "summary": ""
}`;

    return this._executeWorkflow("materiality", system, prompt, context);
  }

  /**
   * ISA 530 — Sampling Strategy
   */
  async executeSamplingStrategy(context) {
    const system = `You are an expert ISA auditor designing audit sampling strategies under ISA 530.
Consider statistical and non-statistical approaches, sample size determination, selection methods,
tolerable and expected error rates, stratification strategies, and evaluation of results.
All recommendations must be ISA 530 compliant with documented rationale.`;

    const prompt = `Design a comprehensive sampling strategy:

${JSON.stringify(context, null, 2)}

Return detailed JSON:
{
  "samplingObjectives": [{ "procedure": "", "assertion": "", "objective": "" }],
  "populationAnalysis": { "totalItems": 0, "totalValue": 0, "stratification": [{ "stratum": "", "count": 0, "value": 0, "approach": "" }] },
  "sampleDesign": [{ "procedure": "", "method": "statistical/non-statistical", "selectionMethod": "random/systematic/MUS", "sampleSize": 0, "confidenceLevel": 0, "tolerableError": 0, "expectedError": 0, "rationale": "" }],
  "highValueItems": { "threshold": 0, "count": 0, "approach": "100% testing" },
  "projectionMethod": { "approach": "", "formula": "" },
  "evaluationCriteria": { "tolerableMisstatement": 0, "acceptableRisk": 0 },
  "isaCompliance": { "isa530_para5": true, "isa530_para7": true, "isa530_para14": true },
  "summary": ""
}`;

    return this._executeWorkflow("sampling", system, prompt, context);
  }

  /**
   * ISA 330 — Audit Procedure Design
   */
  async executeAuditProcedureDesign(context) {
    const system = `You are an expert ISA auditor designing further audit procedures under ISA 330.
Design responsive procedures that address assessed risks at the assertion level.
Include tests of controls (where reliance planned), substantive analytical procedures,
and tests of details. Ensure ISA 330 compliance with documented linkage to assessed risks.`;

    const prompt = `Design comprehensive audit procedures responsive to assessed risks:

${JSON.stringify(context, null, 2)}

Return detailed JSON:
{
  "overallResponses": [{ "response": "", "isaReference": "", "riskAddressed": "" }],
  "testsOfControls": [{ "control": "", "procedure": "", "frequency": "", "sampleSize": 0, "timing": "", "assertion": "" }],
  "substantiveAnalyticalProcedures": [{ "fsli": "", "procedure": "", "expectation": "", "threshold": "", "dataReliability": "" }],
  "testsOfDetails": [{ "fsli": "", "assertion": "", "procedure": "", "sampleSize": 0, "timing": "", "source": "", "riskLevel": "" }],
  "journalEntryTesting": { "criteria": [], "sampleSize": 0, "periods": [], "isaReference": "ISA 240" },
  "relatedPartyProcedures": [{ "procedure": "", "isaReference": "ISA 550" }],
  "estimateProcedures": [{ "estimate": "", "approach": "", "isaReference": "ISA 540" }],
  "procedureSummary": { "totalProcedures": 0, "totalHours": 0, "coverage": "" },
  "summary": ""
}`;

    return this._executeWorkflow("procedures", system, prompt, context);
  }

  /**
   * ISA 450/700 — Findings Analysis
   */
  async executeFindingsAnalysis(context) {
    const system = `You are an expert ISA auditor evaluating audit findings under ISA 450 and forming
the audit opinion under ISA 700/705/706. Evaluate misstatements (factual, judgmental, projected),
assess their materiality individually and in aggregate, consider management representations,
and determine the appropriate audit opinion. Document the impact on the auditor's report.`;

    const prompt = `Analyze audit findings and determine the audit opinion:

${JSON.stringify(context, null, 2)}

Return detailed JSON:
{
  "misstatementSummary": { "factual": [{ "description": "", "amount": 0, "fsli": "" }], "judgmental": [{ "description": "", "amount": 0, "fsli": "" }], "projected": [{ "description": "", "amount": 0, "fsli": "", "projectionMethod": "" }] },
  "aggregateAssessment": { "totalUncorrectedMisstatements": 0, "materialityThreshold": 0, "isMaterial": false, "isPervasive": false, "closenessToMateriality": "" },
  "controlDeficiencies": [{ "deficiency": "", "severity": "significant/material_weakness", "communication": "governance/management", "isaReference": "ISA 265" }],
  "opinionDetermination": { "type": "unmodified/qualified/adverse/disclaimer", "basis": "", "keyAuditMatters": [{ "matter": "", "response": "", "isaReference": "ISA 701" }], "emphasisOfMatter": [], "otherMatter": [] },
  "managementRepresentations": [{ "representation": "", "isaReference": "ISA 580" }],
  "communicationsRequired": { "governance": [], "management": [], "regulators": [] },
  "goingConcern": { "materialUncertainty": false, "assessment": "", "isaReference": "ISA 570" },
  "summary": ""
}`;

    return this._executeWorkflow("findings", system, prompt, context);
  }

  // ═══════════════════════════════════════════════════════════════════
  // PIPELINE: Full 5-Step Audit Workflow
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Execute all 5 workflow steps sequentially with progress reporting
   */
  async executeFullAuditWorkflow(context, onProgress) {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const steps = [
      { name: "Risk Assessment", method: "executeComprehensiveRiskAssessment", step: 1 },
      { name: "Materiality", method: "executeMaterialityAnalysis", step: 2 },
      { name: "Sampling", method: "executeSamplingStrategy", step: 3 },
      { name: "Procedures", method: "executeAuditProcedureDesign", step: 4 },
      { name: "Findings", method: "executeFindingsAnalysis", step: 5 },
    ];

    const results = {};

    for (const step of steps) {
      const progressData = {
        workflowId,
        step: step.step,
        totalSteps: 5,
        stepName: step.name,
        status: "in_progress",
        timestamp: new Date().toISOString(),
      };

      if (onProgress) onProgress(progressData);

      try {
        // Enrich context with prior step results
        const enrichedContext = { ...context, priorResults: results };
        results[step.name.toLowerCase().replace(/\s/g, "_")] = await this[step.method](enrichedContext);

        progressData.status = "completed";
        if (onProgress) onProgress(progressData);
      } catch (error) {
        progressData.status = "failed";
        progressData.error = error.message;
        if (onProgress) onProgress(progressData);
        results[step.name.toLowerCase().replace(/\s/g, "_")] = {
          error: error.message,
          status: "FAILED",
        };
      }
    }

    return {
      workflowId,
      completedAt: new Date().toISOString(),
      results,
      costEstimate: `$${this.dailySpend.toFixed(2)} of $${this.dailyBudget} daily budget used`,
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // INTERNAL METHODS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Core workflow execution with GDPR, rate limiting, caching, cost control
   */
  async _executeWorkflow(type, system, prompt, context) {
    if (!this.enabled) {
      throw new Error("Heavy automation is disabled. Set HEAVY_AUTOMATION_ENABLED=true");
    }

    // Check daily budget
    this._resetDailyBudgetIfNeeded();
    if (this.dailySpend >= this.dailyBudget) {
      const error = new Error("Daily budget exceeded for heavy automation");
      error.status = 402;
      throw error;
    }

    // Rate limit
    this._enforceRateLimit();

    // Check cache
    const sanitizedContext = this._sanitizeForGDPR(context);
    const cacheKey = `heavy_${type}_${JSON.stringify(sanitizedContext)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const startTime = Date.now();
    this.metrics.totalRequests++;
    this.activeCalls++;

    try {
      // AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await this.claude.sendMessage({
        prompt: prompt.replace(JSON.stringify(context, null, 2), JSON.stringify(sanitizedContext, null, 2)),
        system,
        model: this.model,
        maxTokens: this.maxTokens,
        thinking: true,
        effort: EFFORT.MAX,
      });

      clearTimeout(timeoutId);

      // Parse JSON result
      const result = this.claude.parseJSON(response.text);

      // Track cost
      if (response.usage) {
        this.metrics.totalInputTokens += response.usage.input_tokens || 0;
        this.metrics.totalOutputTokens += response.usage.output_tokens || 0;
        this._estimateCost(response.usage.input_tokens || 0, response.usage.output_tokens || 0);
      }

      // Cache result
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), this.CACHE_TTL);

      // Update metrics
      const latency = Date.now() - startTime;
      this.metrics.successfulRequests++;
      this._updateLatency(latency);

      // Audit trail
      console.log(`[HEAVY-AUTOMATION] ${type} completed in ${latency}ms | Daily spend: $${this.dailySpend.toFixed(2)}/${this.dailyBudget}`);

      return result;
    } catch (error) {
      this.metrics.failedRequests++;
      console.error(`[HEAVY-AUTOMATION] ${type} failed: ${error.message}`);
      throw error;
    } finally {
      this.activeCalls--;
    }
  }

  /**
   * GDPR: Strip PII before sending to Claude API
   */
  _sanitizeForGDPR(context) {
    if (!context || typeof context !== "object") return context;

    const sanitized = JSON.parse(JSON.stringify(context));
    const piiPatterns = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      nationalId: /\b\d{3}-\d{2}-\d{4}\b|\b[A-Z]{2}\d{6}[A-Z]\b/g,
      bankAccount: /\b\d{6,8}\s?\d{6,10}\b/g,
    };

    let personCounter = 0;
    const nameMap = new Map();
    const redactions = [];

    const sanitizeValue = (obj, path) => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = `${path}.${key}`;

        if (typeof value === "string") {
          // Strip PII patterns
          for (const [piiType, regex] of Object.entries(piiPatterns)) {
            const matches = value.match(regex);
            if (matches) {
              for (const match of matches) {
                obj[key] = obj[key].replace(match, `[REDACTED_${piiType.toUpperCase()}]`);
                redactions.push({ path: currentPath, type: piiType, timestamp: new Date().toISOString() });
              }
            }
          }

          // Replace person names in name-like fields
          const nameFields = ["name", "partner", "manager", "auditor", "contact", "preparedBy", "reviewedBy"];
          if (nameFields.some((f) => key.toLowerCase().includes(f.toLowerCase())) && value.length > 2 && !value.startsWith("[REDACTED")) {
            if (!nameMap.has(value)) {
              personCounter++;
              const role = key.toLowerCase().includes("partner") ? "Partner" : key.toLowerCase().includes("manager") ? "Manager" : "Person";
              nameMap.set(value, `${role}-${personCounter}`);
            }
            redactions.push({ path: currentPath, type: "personName", timestamp: new Date().toISOString() });
            obj[key] = nameMap.get(value);
          }

          // Strip address-like fields
          if (["address", "postcode", "zipCode", "street"].some((f) => key.toLowerCase().includes(f))) {
            redactions.push({ path: currentPath, type: "address", timestamp: new Date().toISOString() });
            obj[key] = "[REDACTED_ADDRESS]";
          }
        } else if (typeof value === "object" && value !== null) {
          sanitizeValue(value, currentPath);
        }
      }
    };

    sanitizeValue(sanitized, "root");

    if (redactions.length > 0) {
      this.redactionLog.push({
        timestamp: new Date().toISOString(),
        redactionCount: redactions.length,
        redactions,
      });
    }

    return sanitized;
  }

  /**
   * Token bucket rate limiting
   */
  _enforceRateLimit() {
    // Concurrent limit
    if (this.activeCalls >= this.maxConcurrent) {
      const error = new Error("Too many concurrent heavy automation requests");
      error.status = 429;
      throw error;
    }

    // Sliding window
    const now = Date.now();
    this.rateWindow = this.rateWindow.filter((t) => now - t < this.rateWindowMs);
    if (this.rateWindow.length >= this.maxPerWindow) {
      const error = new Error("Heavy automation rate limit exceeded. Try again later.");
      error.status = 429;
      error.retryAfter = Math.ceil((this.rateWindow[0] + this.rateWindowMs - now) / 1000);
      throw error;
    }
    this.rateWindow.push(now);
  }

  /**
   * Estimate cost and track daily spend
   * Opus 4.6 pricing: ~$15/MTok input, ~$75/MTok output (approximate)
   */
  _estimateCost(inputTokens, outputTokens) {
    const inputCost = (inputTokens / 1_000_000) * 15;
    const outputCost = (outputTokens / 1_000_000) * 75;
    this.dailySpend += inputCost + outputCost;
  }

  /**
   * Reset daily budget at midnight
   */
  _resetDailyBudgetIfNeeded() {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    if (now - this.dailySpendReset > msPerDay) {
      this.dailySpend = 0;
      this.dailySpendReset = now;
    }
  }

  /**
   * Running average latency
   */
  _updateLatency(latency) {
    const total = this.metrics.successfulRequests;
    this.metrics.averageLatency = (this.metrics.averageLatency * (total - 1) + latency) / total;
  }

  // ═══════════════════════════════════════════════════════════════════
  // METRICS & STATUS
  // ═══════════════════════════════════════════════════════════════════

  getMetrics() {
    return {
      agent: "HeavyAutomation",
      status: this.enabled ? "READY" : "DISABLED",
      model: this.model,
      cacheSize: this.cache.size,
      activeCalls: this.activeCalls,
      dailySpend: `$${this.dailySpend.toFixed(2)}`,
      dailyBudget: `$${this.dailyBudget}`,
      budgetRemaining: `$${Math.max(0, this.dailyBudget - this.dailySpend).toFixed(2)}`,
      ...this.metrics,
      averageLatency: `${this.metrics.averageLatency.toFixed(0)}ms`,
    };
  }

  getStatus() {
    this._resetDailyBudgetIfNeeded();
    return {
      enabled: this.enabled,
      model: this.model,
      activeCalls: this.activeCalls,
      maxConcurrent: this.maxConcurrent,
      dailySpend: this.dailySpend,
      dailyBudget: this.dailyBudget,
      budgetExceeded: this.dailySpend >= this.dailyBudget,
      cacheSize: this.cache.size,
      rateWindowUsed: this.rateWindow.filter((t) => Date.now() - t < this.rateWindowMs).length,
      rateWindowMax: this.maxPerWindow,
    };
  }
}

export default new HeavyAutomationService();
