/**
 * AI-Powered Procedure Suggestion Engine
 * Integrates Claude API for intelligent procedure ranking
 *
 * Features:
 * - Context-aware procedure ranking
 * - Risk-based recommendations
 * - Effectiveness scoring
 * - Justification generation
 * - Result caching
 */

import Anthropic from "@anthropic-ai/sdk";

export class AIProcedureEngine {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY) {
    this.client = new Anthropic({ apiKey });
    this.model = "claude-3-5-sonnet-20241022";
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }

  /**
   * Get AI-powered procedure suggestions
   * @param {Object} context - Engagement context
   * @param {Array} procedures - Available audit procedures
   * @returns {Promise<Array>} Ranked procedure recommendations
   */
  async suggestProcedures(context, procedures) {
    // Validate context
    this._validateContext(context);
    if (!Array.isArray(procedures) || procedures.length === 0) {
      throw new Error("Procedures array is required");
    }

    // Check cache
    const cacheKey = this._generateCacheKey(context);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    // Filter procedures by FSLI
    const relevantProcedures = this._filterByFsli(procedures, context.fsli);

    // Build Claude prompt
    const prompt = this._buildRankingPrompt(context, relevantProcedures);

    // Call Claude API
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2 // Consistent, deterministic
    });

    // Parse response
    const recommendations = this._parseRecommendations(
      response.content[0].text,
      relevantProcedures
    );

    // Cache result
    this.cache.set(cacheKey, {
      data: recommendations,
      timestamp: Date.now()
    });

    return recommendations;
  }

  /**
   * Evaluate exception risk for an FSLI
   * @param {Object} context - Risk context
   * @returns {Promise<Object>} Risk assessment
   */
  async evaluateExceptionRisk(context) {
    this._validateContext(context);

    const prompt = `
You are an experienced audit risk assessor.

ENGAGEMENT CONTEXT:
- Financial Statement Line Item (FSLI): ${context.fsli}
- Inherent Risk: ${context.riskLevel}
- Prior Year Exceptions: ${context.priorYearExceptions?.join(", ") || "None"}
- Industry: ${context.industry}
- Entity Complexity: ${context.complexity}

TASK: Assess the likelihood and potential impact of exceptions in this FSLI.

Consider:
1. Nature of the FSLI
2. Industry-specific risks
3. Historical exception patterns
4. Entity complexity factors
5. Management override risks

Provide assessment in JSON format:
{
  "exception_probability": 0.0-1.0,
  "potential_impact": "High|Medium|Low",
  "key_risk_factors": ["factor1", "factor2"],
  "recommended_sample_size": "percentage of population",
  "critical_areas": ["area1", "area2"],
  "risk_score": 0-100
}
`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    return this._parseJSON(response.content[0].text);
  }

  /**
   * Suggest preventive procedures based on risk factors
   * @param {Object} context - Risk context
   * @param {Array} procedures - Available procedures
   * @returns {Promise<Array>} Preventive procedure recommendations
   */
  async suggestPreventiveProcedures(context, procedures) {
    // Get risk assessment first
    const riskAssessment = await this.evaluateExceptionRisk(context);

    const prompt = `
You are an audit procedures expert.

RISK ASSESSMENT:
- Exception Probability: ${riskAssessment.exception_probability}
- Potential Impact: ${riskAssessment.potential_impact}
- Key Risk Factors: ${riskAssessment.key_risk_factors.join(", ")}

AVAILABLE PROCEDURES:
${procedures
  .map((p) => `- ${p.name} (${p.type}): ${p.description}`)
  .join("\n")}

TASK: Identify the most effective preventive procedures to reduce exception risk.

Return JSON with:
{
  "preventive_procedures": [
    {
      "procedure_id": "id",
      "name": "procedure name",
      "reason": "why it prevents exceptions",
      "expected_effectiveness": 0-100
    }
  ]
}
`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    return this._parseJSON(response.content[0].text).preventive_procedures || [];
  }

  /**
   * Generate audit strategy recommendation
   * @param {Object} context - Engagement context
   * @param {Array} procedures - Available procedures
   * @returns {Promise<Object>} Strategy recommendation
   */
  async recommendAuditStrategy(context, procedures) {
    const prompt = `
You are a senior audit partner designing audit strategy.

ENGAGEMENT PROFILE:
- FSLI: ${context.fsli}
- Risk Level: ${context.riskLevel}
- Industry: ${context.industry}
- Entity Complexity: ${context.complexity}
- Prior Exceptions: ${context.priorYearExceptions?.join(", ") || "None"}
- Materiality: $${context.materiality}

TASK: Recommend an optimal audit strategy.

Consider:
1. Overall audit approach (substantive vs combined assurance)
2. Sampling methodology
3. Reliance on controls (if any)
4. Expected exception rate
5. Resource allocation

Return JSON:
{
  "overall_approach": "Substantive|Combined Assurance|Control Reliance",
  "sampling_methodology": "Statistical|Judgmental|Stratified",
  "expected_exception_rate": 0-10,
  "suggested_sample_size_percentage": 0-100,
  "justification": "explanation",
  "critical_procedures": ["proc1", "proc2"]
}
`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    return this._parseJSON(response.content[0].text);
  }

  /**
   * Build ranking prompt for Claude
   * @private
   */
  _buildRankingPrompt(context, procedures) {
    return `
You are an expert audit procedures selection advisor with 20+ years of experience.

ENGAGEMENT CONTEXT:
- Financial Statement Line Item (FSLI): ${context.fsli}
- Inherent Risk Level: ${context.riskLevel}
- Prior Year Exceptions: ${context.priorYearExceptions?.join(", ") || "None"}
- Industry: ${context.industry}
- Entity Complexity: ${context.complexity}
- Materiality: $${context.materiality}

AVAILABLE PROCEDURES:
${procedures
  .map(
    (p, i) => `
${i + 1}. ${p.name}
   Type: ${p.type}
   Assertion: ${p.assertion}
   ISA Standard: ${p.standard}
   Description: ${p.description}
`
  )
  .join("\n")}

YOUR TASK:
Rank the top 3-5 procedures by effectiveness for this specific engagement.

Consider:
1. Prior year exception patterns
2. Risk level of the FSLI
3. Entity complexity factors
4. Industry-specific risks
5. Audit materiality thresholds

For each recommended procedure, provide:
- Effectiveness score (0-100%)
- Justification
- Key risks it addresses

Return JSON format:
{
  "recommendations": [
    {
      "rank": 1,
      "name": "procedure name",
      "effectiveness": 95,
      "justification": "explanation",
      "key_risks_addressed": ["risk1", "risk2"]
    }
  ]
}
`;
  }

  /**
   * Parse Claude's JSON response
   * @private
   */
  _parseJSON(text) {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON in Claude response");
    }
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Parse procedure recommendations from Claude response
   * @private
   */
  _parseRecommendations(text, procedures) {
    const data = this._parseJSON(text);
    const recommendations = data.recommendations || [];

    // Enrich with original procedure data
    return recommendations.map((rec) => {
      const originalProc = procedures.find((p) => p.name === rec.name);
      return {
        ...rec,
        id: originalProc?.id,
        type: originalProc?.type,
        assertion: originalProc?.assertion,
        standard: originalProc?.standard
      };
    });
  }

  /**
   * Filter procedures by FSLI
   * @private
   */
  _filterByFsli(procedures, fsli) {
    return procedures.filter(
      (p) =>
        !p.fsliList || // Include procedures with no FSLI restriction
        p.fsliList.includes(fsli) || // Include if FSLI is in list
        p.fsliList.includes("All") // Include if applies to all
    );
  }

  /**
   * Validate context object
   * @private
   */
  _validateContext(context) {
    const required = ["fsli", "riskLevel"];
    for (const field of required) {
      if (!context[field]) {
        throw new Error(`Missing required context field: ${field}`);
      }
    }
  }

  /**
   * Generate cache key
   * @private
   */
  _generateCacheKey(context) {
    return `${context.fsli}_${context.riskLevel}_${context.industry || ""}`;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export default AIProcedureEngine;
