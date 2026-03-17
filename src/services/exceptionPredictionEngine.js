/**
 * Exception Prediction & Root Cause Analysis Engine
 * Predicts exception likelihood and analyzes root causes using Claude API
 *
 * Features:
 * - Exception probability prediction
 * - Root cause analysis
 * - Sample size recommendations
 * - Preventive procedure mapping
 */

import { Anthropic } from "@anthropic-ai/sdk";

export class ExceptionPredictionEngine {
  constructor(apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY) {
    this.client = new Anthropic({ apiKey });
    this.model = "claude-3-5-sonnet-20241022";
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }

  /**
   * Predict exception likelihood for an FSLI
   * @param {Object} context - Engagement context
   * @returns {Promise<Object>} Prediction results
   */
  async predictExceptions(context) {
    this._validateContext(context);

    // Check cache
    const cacheKey = this._generateCacheKey(context);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    // Build prediction prompt
    const prompt = this._buildPredictionPrompt(context);

    // Call Claude API
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    // Parse response
    const predictions = this._parseJSON(response.content[0].text);

    // Enrich with additional analysis
    const enriched = {
      ...predictions,
      timestamp: new Date().toISOString(),
      fsli: context.fsli,
      industry: context.industry
    };

    // Cache result
    this.cache.set(cacheKey, {
      data: enriched,
      timestamp: Date.now()
    });

    return enriched;
  }

  /**
   * Analyze root causes of prior exceptions
   * @param {Object} context - Context with prior exceptions
   * @returns {Promise<Array>} Root cause analysis
   */
  async analyzeRootCauses(context) {
    this._validateContext(context);

    if (!context.priorYearExceptions || context.priorYearExceptions.length === 0) {
      return {
        root_causes: [],
        patterns: [],
        recommendations: []
      };
    }

    const prompt = `
You are an experienced audit expert analyzing root causes of prior exceptions.

ENGAGEMENT CONTEXT:
- FSLI: ${context.fsli}
- Industry: ${context.industry}
- Entity Complexity: ${context.complexity}
- Prior Year Exceptions: ${context.priorYearExceptions.join(", ")}

TASK: Analyze the root causes of these exceptions.

Consider:
1. Common patterns in the exceptions
2. Underlying control weaknesses
3. Process inefficiencies
4. Resource constraints
5. Complexity factors

Identify:
- Root causes (not symptoms)
- Likelihood of recurrence (0-1)
- System/process weakness areas
- Control improvements needed

Return JSON:
{
  "root_causes": [
    {
      "cause": "Root cause description",
      "likelihood_of_recurrence": 0.0-1.0,
      "affected_areas": ["area1", "area2"],
      "control_weakness": "Specific weakness",
      "improvement": "Recommended improvement"
    }
  ],
  "patterns": [
    {
      "pattern": "Identified pattern",
      "occurrences": number,
      "severity": "High|Medium|Low"
    }
  ],
  "critical_control_areas": ["area1", "area2"]
}
`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    return this._parseJSON(response.content[0].text);
  }

  /**
   * Recommend sample size based on predictions
   * @param {Object} context - Context with risk assessment
   * @param {Object} predictions - Exception predictions
   * @returns {Promise<Object>} Sample size recommendation
   */
  async recommendSampleSize(context, predictions) {
    const prompt = `
You are an audit sampling methodology expert.

ENGAGEMENT CONTEXT:
- FSLI: ${context.fsli}
- Inherent Risk: ${context.riskLevel}
- Control Risk: ${context.controlRisk || "Not assessed"}
- Materiality: $${context.materiality}
- Population Size: ${context.populationSize || "Not specified"}

PREDICTION DATA:
- Exception Probability: ${predictions.exception_probability}
- Predicted Exceptions: ${predictions.predicted_types?.join(", ") || "Unknown"}
- Risk Score: ${predictions.risk_score}

TASK: Recommend optimal sample size for this audit.

Consider:
1. Predicted exception probability
2. Desired confidence level (typically 95%)
3. Tolerable error rate
4. Materiality threshold
5. Population size

Return JSON:
{
  "sample_size_percentage": 0-100,
  "sample_size_units": number,
  "confidence_level": 0.95,
  "tolerable_error_percentage": 0-5,
  "precision_level": "$amount",
  "methodology": "Statistical|Judgmental|Stratified",
  "justification": "explanation"
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
   * Generate comprehensive exception report
   * @param {Object} context - Engagement context
   * @param {Object} predictions - Predictions
   * @returns {Promise<Object>} Report data
   */
  async generateExceptionReport(context, predictions) {
    const rootCauses = await this.analyzeRootCauses(context);
    const sampleSize = await this.recommendSampleSize(context, predictions);

    return {
      summary: {
        fsli: context.fsli,
        industry: context.industry,
        exception_probability: predictions.exception_probability,
        risk_level: predictions.risk_score ? "High" : "Medium"
      },
      predictions,
      rootCauses,
      sampleSize,
      recommendations: this._generateRecommendations(predictions, rootCauses),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Build prediction prompt for Claude
   * @private
   */
  _buildPredictionPrompt(context) {
    return `
You are an expert audit risk assessor with deep knowledge of exception patterns across industries.

ENGAGEMENT PROFILE:
- Financial Statement Line Item (FSLI): ${context.fsli}
- Industry: ${context.industry}
- Entity Complexity: ${context.complexity}
- Entity Age: ${context.entityAge || "Not specified"}
- Prior Year Exceptions: ${context.priorYearExceptions?.join(", ") || "None"}
- Recent Changes: ${context.changeHistory?.join(", ") || "None"}
- Materiality: $${context.materiality}
- Inherent Risk: ${context.riskLevel}

TASK: Predict the likelihood and type of exceptions that may occur in this FSLI.

Analyze:
1. Historical patterns for this FSLI
2. Industry-specific exception trends
3. Complexity impact on exception likelihood
4. Prior exception recurrence patterns
5. Control environment effectiveness

Provide prediction in JSON format:
{
  "exception_probability": 0.0-1.0,
  "confidence": 0.0-1.0,
  "risk_score": 0-100,
  "predicted_types": [
    {
      "type": "Exception type (e.g., 'Valuation Error')",
      "likelihood": 0.0-1.0,
      "severity": "High|Medium|Low",
      "description": "Description of this exception type"
    }
  ],
  "root_causes": [
    {
      "cause": "Root cause",
      "likelihood": 0.0-1.0,
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "preventive_procedures": [
    {
      "procedure": "Recommended procedure",
      "prevents": "Exception type it prevents",
      "effectiveness": 0.0-1.0
    }
  ],
  "key_risk_factors": ["factor1", "factor2"],
  "assessment": "Overall assessment and reasoning"
}
`;
  }

  /**
   * Generate recommendations based on predictions and root causes
   * @private
   */
  _generateRecommendations(predictions, rootCauses) {
    const recommendations = [];

    // High probability exceptions
    if (predictions.exception_probability > 0.7) {
      recommendations.push({
        priority: "High",
        type: "Increase Testing",
        description: "High exception probability detected. Increase substantive testing."
      });
    }

    // Root cause improvements
    if (rootCauses.root_causes) {
      rootCauses.root_causes.forEach((rc) => {
        if (rc.improvement) {
          recommendations.push({
            priority: "High",
            type: "Process Improvement",
            description: rc.improvement
          });
        }
      });
    }

    // Preventive procedures
    if (predictions.preventive_procedures) {
      predictions.preventive_procedures.forEach((pp) => {
        if (pp.effectiveness > 0.8) {
          recommendations.push({
            priority: "Medium",
            type: "Procedure",
            description: `Perform ${pp.procedure} to prevent ${pp.prevents}`
          });
        }
      });
    }

    return recommendations;
  }

  /**
   * Parse Claude's JSON response
   * @private
   */
  _parseJSON(text) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON in Claude response");
    }
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Validate context object
   * @private
   */
  _validateContext(context) {
    const required = ["fsli"];
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
    return `pred_${context.fsli}_${context.industry || ""}_${
      context.priorYearExceptions?.join("-") || ""
    }`;
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

export default ExceptionPredictionEngine;
