/**
 * Centralized Claude API Client
 * Provides unified access to Anthropic's Claude API with:
 * - Opus 4.7 adaptive thinking for deep reasoning
 * - Sonnet 4.6 for standard analysis tasks
 * - Haiku 4.5 for fast, real-time responses
 * - Batch API for bulk procedure processing (50% cheaper)
 * - Few-shot training prompts for audit domain expertise
 * - Unified response parsing (handles thinking + text blocks)
 *
 * @version 2.0.0 — Opus 4.7 with adaptive thinking
 */

import Anthropic from "@anthropic-ai/sdk";

// ═══════════════════════════════════════════════════════════════════
// MODEL CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const MODELS = {
  /** Deep reasoning — complex audit judgments, risk assessment, report generation */
  OPUS: "claude-opus-4-7",
  /** Standard analysis — procedures, compliance, evidence evaluation */
  SONNET: "claude-sonnet-4-6",
  /** Fast responses — real-time workflow guidance, quick questions */
  HAIKU: "claude-haiku-4-5-20251001",
};

/** Effort levels for adaptive thinking (controls reasoning depth) */
export const EFFORT = {
  LOW: "low",       // Quick answers, simple lookups
  MEDIUM: "medium", // Standard analysis
  HIGH: "high",     // Complex reasoning, multi-factor analysis
  MAX: "max",       // Deep audit judgments, going concern, materiality
};

// ═══════════════════════════════════════════════════════════════════
// FEW-SHOT TRAINING EXAMPLES (Audit Domain)
// ═══════════════════════════════════════════════════════════════════

const AUDIT_TRAINING_EXAMPLES = {
  materiality: `SUCCESSFUL EXAMPLES (learn from these):

1. MATERIALITY CALCULATION:
   Input: Revenue £100M, Earnings £10M, Total Assets £80M
   Process:
   - Calculate @ 5% of pre-tax profit = £500K
   - Calculate @ 0.5-1% of revenue = £500K-£1M
   - Calculate @ 1-2% of total assets = £800K-£1.6M
   - Benchmark average = £600K (conservative)
   - Performance materiality = 75% × £600K = £450K
   - Trivial threshold = 5% × £600K = £30K
   Decision: Use £600K (reasonable, justified per ISA 320)
   Output: Overall Materiality = £600K, PM = £450K, Trivial = £30K

2. MATERIALITY REVISION (ISA 450):
   Input: Mid-audit — discovered misstatements totalling £400K
   Process:
   - £400K is 67% of overall materiality (£600K) — concerning
   - Assess if original basis still appropriate
   - Adjust PM downward to £350K to capture additional risk
   Output: Revised PM = £350K, communicate to engagement team`,

  riskAssessment: `SUCCESSFUL EXAMPLES (learn from these):

1. RISK ASSESSMENT (ISA 315):
   Input: Tech company, new ERP system, high-growth, £200M revenue
   Process:
   - Inherent risk: HIGH (new systems, tech industry, rapid growth)
   - Control risk: MEDIUM (ERP implementation ongoing, some manual workarounds)
   - Detection risk: Set LOW (compensate for high IR × medium CR)
   - Significant risks: Revenue recognition (ISA 240), management override
   Output: Audit Risk = HIGH, increase sample sizes 30%, mandatory fraud discussion

2. RISK ASSESSMENT — GOING CONCERN (ISA 570):
   Input: Manufacturing company, negative cash flow, debt covenant breach
   Process:
   - Cash flow forecast: negative for next 12 months
   - Debt covenant breached — bank waiver not yet obtained
   - Order book declining 15% YoY
   - Going concern indicators: 3 of 5 financial indicators triggered
   Output: Material uncertainty exists, require ISA 570 paragraph disclosure`,

  procedures: `SUCCESSFUL EXAMPLES (learn from these):

1. PROCEDURE SELECTION (ISA 330):
   Input: Revenue — HIGH risk, manufacturing sector, £50M
   Process:
   - Substantive approach required (high risk = cannot rely solely on controls)
   - Mandatory: cutoff testing, analytical procedures, detail testing
   - Sample: 25 items (statistical, 95% confidence, 5% tolerable error)
   - ISA 505: External confirmation for top 10 customers (60% of revenue)
   Output: 4 substantive procedures, sample of 25, confirmations for top 10

2. EVIDENCE EVALUATION (ISA 500):
   Input: Bank confirmation received, £2.3M balance confirmed
   Process:
   - Source: External (high reliability per ISA 500.A31)
   - Relevance: Directly supports existence and rights assertions
   - Sufficiency: Covers 85% of cash balances
   - Corroborating: Agrees to year-end bank reconciliation
   Output: Sufficient appropriate evidence for cash assertion`,

  compliance: `SUCCESSFUL EXAMPLES (learn from these):

1. ISA COMPLIANCE CHECK:
   Input: Planning phase completed, medium-sized private company
   Process:
   - ISA 210: Engagement letter — signed ✓
   - ISA 220: Quality management — EQCR not required (not listed) ✓
   - ISA 240: Fraud discussion with team — documented ✓
   - ISA 315: Risk assessment — completed with 12 significant risks ✓
   - ISA 320: Materiality — calculated and documented ✓
   Gaps: ISA 250 compliance review not yet documented
   Output: 5/6 standards addressed, 1 gap requiring attention

2. REGULATORY COMPLIANCE (UK):
   Input: Companies Act 2006, private limited, FYE 31 March 2026
   Process:
   - Filing deadline: 31 December 2026 (9 months)
   - Audit exemption: Turnover > £10.2M — audit required
   - FRC Ethical Standard: Independence confirmed
   - AML: Customer due diligence current
   Output: Compliant, filing deadline in 9 months, no exemptions apply`,
};

// ═══════════════════════════════════════════════════════════════════
// STATIC SYSTEM PROMPT (Cached — 90% token savings on repeat calls)
// ═══════════════════════════════════════════════════════════════════

const AUDIT_SYSTEM_PROMPT = `You are AuditEngine AI, a UK statutory audit specialist.
You operate within the ISA (UK) 200-810 framework (37 standards), FRS 102, Companies Act 2006, and FRC Ethical Standard 2024.

Core principles:
- Professional skepticism (ISA 200.15): Question all evidence, consider fraud risk, challenge management assertions.
- Sufficient appropriate evidence (ISA 500): Prioritise external over internal, corroborate representations, assess reliability.
- Materiality-driven (ISA 320): All judgments reference overall materiality, performance materiality, and trivial threshold.
- Risk-based approach (ISA 315): Inherent risk × control risk drives detection risk and procedure design.
- Documentation standard (ISA 230): Every output must be traceable — who, what, when, why, evidence source, conclusion.

Output requirements:
- Always cite the specific ISA (UK) paragraph (e.g. ISA 315.12, ISA 540.13).
- Express numerical results with currency (£), percentages, and basis of calculation.
- Flag any area where professional judgment was exercised, with reasoning documented.
- Distinguish between facts (verified), estimates (ISA 540), and representations (ISA 580).
- Rate confidence: HIGH (>90% evidence coverage), MEDIUM (60-90%), LOW (<60%).`;

// ═══════════════════════════════════════════════════════════════════
// CLAUDE CLIENT CLASS
// ═══════════════════════════════════════════════════════════════════

class ClaudeClient {
  constructor() {
    // S1-00 (phase 1): drop the VITE_CLAUDE_API_KEY browser-bundled fallback.
    // Phase 2 will migrate this whole client to the AiProxyClient (`/api/ai`),
    // which also requires extending the proxy to support batches. Until then,
    // claudeClient.js must only be imported from server-side code paths.
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.metrics = {
      totalRequests: 0,
      thinkingRequests: 0,
      batchRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cachedInputTokens: 0,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // CORE: Send a message with optional adaptive thinking
  // ─────────────────────────────────────────────────────────────────

  /**
   * Send a message to Claude with full control over model and thinking.
   *
   * @param {Object} options
   * @param {string} options.prompt - User message content
   * @param {string} [options.system] - System prompt
   * @param {string} [options.model=MODELS.SONNET] - Model to use
   * @param {number} [options.maxTokens=4096] - Max output tokens
   * @param {number} [options.temperature] - Temperature (omit when thinking is enabled)
   * @param {boolean} [options.thinking=false] - Enable adaptive thinking
   * @param {string} [options.effort=EFFORT.HIGH] - Thinking effort level
   * @param {number} [options.budgetTokens] - Explicit thinking budget (overrides adaptive)
   * @param {string} [options.domain] - Audit domain for few-shot training injection
   * @param {Array} [options.tools] - Tools (e.g. web_search)
   * @returns {Promise<{text: string, thinking: string|null, usage: Object}>}
   */
  async sendMessage({
    prompt,
    system,
    model = MODELS.SONNET,
    maxTokens = 4096,
    temperature,
    thinking = false,
    effort = EFFORT.HIGH,
    budgetTokens,
    domain,
    tools,
  }) {
    this.metrics.totalRequests++;

    // Build request parameters
    const params = {
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    };

    // ── System prompt with prompt caching ──
    // Structure as array of content blocks so we can mark the static parts
    // (ISA framework + training examples) as cacheable. Repeated calls with
    // the same system prefix get a 90% input token discount.
    params.system = this._buildCachedSystemPrompt(system, domain);

    // Thinking configuration
    if (thinking) {
      this.metrics.thinkingRequests++;
      if (budgetTokens) {
        params.thinking = { type: "enabled", budget_tokens: budgetTokens };
      } else {
        params.thinking = { type: "enabled", budget_tokens: this._getDefaultBudget(effort) };
      }
    } else {
      if (temperature !== undefined) {
        params.temperature = temperature;
      }
    }

    // Tools (e.g. web search for investor analytics)
    if (tools) {
      params.tools = tools;
    }

    // Make the API call
    const response = await this.client.messages.create(params);

    // Track usage including cache metrics
    if (response.usage) {
      this.metrics.totalInputTokens += response.usage.input_tokens || 0;
      this.metrics.totalOutputTokens += response.usage.output_tokens || 0;
      if (response.usage.cache_read_input_tokens) {
        this.metrics.cacheHits++;
        this.metrics.cachedInputTokens += response.usage.cache_read_input_tokens;
      }
      if (response.usage.cache_creation_input_tokens) {
        this.metrics.cacheMisses++;
      }
    }

    // Parse response — handle both thinking and non-thinking formats
    return this._parseResponse(response);
  }

  // ─────────────────────────────────────────────────────────────────
  // BATCH: Process many requests at 50% cost
  // ─────────────────────────────────────────────────────────────────

  /**
   * Submit a batch of audit analysis requests for async processing.
   * 50% cheaper than real-time API calls. Results available within ~1 hour.
   *
   * @param {Array<{id: string, prompt: string, system?: string, model?: string, maxTokens?: number}>} requests
   * @returns {Promise<{batchId: string, status: string}>}
   */
  async sendBatch(requests) {
    this.metrics.batchRequests++;

    const batchRequests = requests.map((req) => ({
      custom_id: req.id,
      params: {
        model: req.model || MODELS.SONNET,
        max_tokens: req.maxTokens || 4096,
        messages: [{ role: "user", content: req.prompt }],
        ...(req.system ? { system: req.system } : {}),
      },
    }));

    const batch = await this.client.messages.batches.create({
      requests: batchRequests,
    });

    return {
      batchId: batch.id,
      status: batch.processing_status,
      requestCount: requests.length,
    };
  }

  /**
   * Poll a batch until complete and return results.
   *
   * @param {string} batchId
   * @param {number} [pollIntervalMs=30000] - Poll every N ms
   * @param {number} [timeoutMs=3600000] - Timeout after N ms (default 1 hour)
   * @returns {Promise<Array<{id: string, text: string|null, error: string|null}>>}
   */
  async awaitBatchResults(batchId, pollIntervalMs = 30000, timeoutMs = 3600000) {
    const startTime = Date.now();

    // Poll until complete
    let batch;
    do {
      batch = await this.client.messages.batches.retrieve(batchId);
      if (batch.processing_status === "ended") break;
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Batch ${batchId} timed out after ${timeoutMs}ms`);
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    } while (true);

    // Collect results
    const results = [];
    for await (const result of await this.client.messages.batches.results(batchId)) {
      if (result.result.type === "succeeded") {
        const parsed = this._parseResponse(result.result.message);
        results.push({ id: result.custom_id, ...parsed, error: null });
      } else {
        results.push({
          id: result.custom_id,
          text: null,
          thinking: null,
          error: result.result.error?.message || result.result.type,
        });
      }
    }

    return results;
  }

  // ─────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Build a structured system prompt with cache_control markers.
   * Static audit framework and training examples are cached (90% savings).
   * Dynamic per-request system instructions are appended uncached.
   * @private
   */
  _buildCachedSystemPrompt(userSystem, domain) {
    const blocks = [];

    // Block 1: Static ISA audit framework (cached across all requests)
    blocks.push({
      type: "text",
      text: AUDIT_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    });

    // Block 2: Domain-specific training examples (cached per domain)
    if (domain && AUDIT_TRAINING_EXAMPLES[domain]) {
      blocks.push({
        type: "text",
        text: `\n\n${AUDIT_TRAINING_EXAMPLES[domain]}\n\nApply this training to the following scenario.`,
        cache_control: { type: "ephemeral" },
      });
    }

    // Block 3: Per-request system instructions (not cached — changes each call)
    if (userSystem) {
      blocks.push({
        type: "text",
        text: userSystem,
      });
    }

    return blocks;
  }

  /**
   * Parse a Claude API response, extracting thinking and text blocks.
   * @private
   */
  _parseResponse(response) {
    let thinkingText = null;
    let outputText = "";

    for (const block of response.content) {
      if (block.type === "thinking") {
        thinkingText = block.thinking;
      } else if (block.type === "text") {
        outputText = block.text;
      }
    }

    return {
      text: outputText,
      thinking: thinkingText,
      model: response.model || null,
      usage: response.usage || null,
      stopReason: response.stop_reason || null,
    };
  }

  /**
   * Get default thinking budget based on effort level.
   * @private
   */
  _getDefaultBudget(effort) {
    switch (effort) {
      case EFFORT.LOW: return 1024;
      case EFFORT.MEDIUM: return 4096;
      case EFFORT.HIGH: return 8192;
      case EFFORT.MAX: return 16384;
      default: return 4096;
    }
  }

  /**
   * Parse JSON from Claude text response (handles markdown code blocks).
   * Shared utility so agents don't each need their own parser.
   */
  parseJSON(text) {
    // Try direct parse first
    try {
      return JSON.parse(text);
    } catch {
      // Extract JSON from markdown or surrounding text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Claude response");
      }
      return JSON.parse(jsonMatch[0]);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // ACCURACY VALIDATION — Verify AI output quality before use
  // ─────────────────────────────────────────────────────────────────

  /**
   * Validate an AI response for accuracy, completeness, and ISA compliance.
   * Returns a validation report with confidence score and any flags.
   *
   * @param {string} text - The AI-generated text to validate
   * @param {Object} [context] - Optional engagement context for cross-checks
   * @returns {{ confidence: number, flags: string[], isaRefs: string[], numericalValues: Object[], complete: boolean }}
   */
  validateResponse(text, context = {}) {
    const flags = [];

    // 1. ISA citation check — every audit output should reference standards
    const isaRefs = (text.match(/ISA\s*\(?UK\)?\s*\d{3}(?:\.\d+)?/gi) || []);
    const uniqueRefs = [...new Set(isaRefs)];
    if (uniqueRefs.length === 0) {
      flags.push("NO_ISA_CITATION: Output lacks ISA (UK) standard references");
    }

    // 2. Validate known ISA numbers (200-810 range)
    const VALID_ISA_RANGE = { min: 200, max: 810 };
    for (const ref of uniqueRefs) {
      const num = parseInt(ref.match(/\d{3}/)?.[0] || "0");
      if (num < VALID_ISA_RANGE.min || num > VALID_ISA_RANGE.max) {
        flags.push(`INVALID_ISA_REF: ${ref} is outside valid ISA range (200-810)`);
      }
    }

    // 3. Numerical cross-checks — extract monetary values and percentages
    const monetaryValues = (text.match(/£[\d,.]+[KMBkmb]?/g) || []).map(v => ({
      raw: v,
      value: this._parseMonetaryValue(v),
    }));
    const percentages = (text.match(/\d+\.?\d*\s*%/g) || []).map(p => ({
      raw: p,
      value: parseFloat(p),
    }));

    // 4. Check for percentage sanity (nothing > 100% unless valid context)
    for (const pct of percentages) {
      if (pct.value > 100 && !text.includes("coverage") && !text.includes("growth")) {
        flags.push(`PERCENTAGE_ANOMALY: ${pct.raw} exceeds 100% — verify calculation`);
      }
    }

    // 5. Materiality cross-check if context provides financials
    if (context.revenue && monetaryValues.length > 0) {
      const materialityValues = monetaryValues.filter(v =>
        v.value > 0 && v.value < context.revenue * 0.1
      );
      if (materialityValues.length === 0 && text.toLowerCase().includes("materiality")) {
        flags.push("MATERIALITY_RANGE: No materiality value falls within expected range (0.5-10% of revenue)");
      }
    }

    // 6. Completeness checks
    const hasConclusion = /conclusion|opinion|result|recommend/i.test(text);
    const hasEvidence = /evidence|source|document|confirm/i.test(text);

    if (!hasConclusion) flags.push("INCOMPLETE: Missing conclusion or recommendation");
    if (!hasEvidence) flags.push("INCOMPLETE: Missing evidence reference");
    if (!/risk|inherent|control|detection/i.test(text)) flags.push("INCOMPLETE: Missing risk assessment reference");

    // 7. Compute confidence score
    const baseConfidence = 1.0;
    const penalty = flags.length * 0.12;
    const boost = uniqueRefs.length * 0.03;
    const confidence = Math.max(0.1, Math.min(1.0, baseConfidence - penalty + boost));

    return {
      confidence: Math.round(confidence * 100) / 100,
      confidenceLabel: confidence >= 0.85 ? "HIGH" : confidence >= 0.6 ? "MEDIUM" : "LOW",
      flags,
      isaReferences: uniqueRefs,
      numericalValues: { monetary: monetaryValues, percentages },
      complete: hasConclusion && hasEvidence,
      humanReviewRequired: confidence < 0.7 || flags.length > 2,
    };
  }

  /**
   * Parse a monetary string like "£500K" or "£1.2M" to a number.
   * @private
   */
  _parseMonetaryValue(str) {
    const cleaned = str.replace(/[£,]/g, "");
    const multipliers = { k: 1_000, m: 1_000_000, b: 1_000_000_000 };
    const suffix = cleaned.slice(-1).toLowerCase();
    if (multipliers[suffix]) {
      return parseFloat(cleaned.slice(0, -1)) * multipliers[suffix];
    }
    return parseFloat(cleaned) || 0;
  }

  /**
   * Get available audit training domains for few-shot prompts.
   */
  getTrainingDomains() {
    return Object.keys(AUDIT_TRAINING_EXAMPLES);
  }

  /**
   * Get client metrics.
   */
  getMetrics() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return {
      ...this.metrics,
      cacheHitRate: total > 0 ? ((this.metrics.cacheHits / total) * 100).toFixed(1) + "%" : "N/A",
      estimatedSavings: `£${((this.metrics.cachedInputTokens / 1_000_000) * 2.7).toFixed(2)}`,
    };
  }

  /**
   * Get the raw Anthropic client (for advanced use cases).
   */
  getRawClient() {
    return this.client;
  }
}

// ═══════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════

const claudeClient = new ClaudeClient();
export default claudeClient;
export { ClaudeClient, AUDIT_TRAINING_EXAMPLES };
