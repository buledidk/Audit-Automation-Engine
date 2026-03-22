/**
 * ESTIMATE ACCURACY MODULE (ISA 540)
 * AI-heavy — uses OPUS with thinking for professional judgment.
 * Reperforms estimate calculations, sensitivity analysis,
 * uncertainty assessment, and independent estimate development.
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class EstimateAccuracyModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Reperform an estimate calculation (pure math).
   * @param {{description: string, originalValue: number, method: string, inputs: Object, formula: string}} estimate
   * @returns {{originalValue: number, reperformedValue: number, variance: number, variancePercent: number}}
   */
  reperformCalculation(estimate) {
    this.checksPerformed++;

    const original = Number(estimate.originalValue) || 0;
    let reperformed = 0;

    // Apply formula if provided
    if (estimate.formula && estimate.inputs) {
      try {
        let expr = estimate.formula;
        for (const [key, value] of Object.entries(estimate.inputs)) {
          expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), String(Number(value) || 0));
        }
        if (/^[\d\s+\-*/().]+$/.test(expr)) {
          // eslint-disable-next-line no-new-func
          reperformed = new Function(`return (${expr})`)();
        }
      } catch {
        reperformed = 0;
      }
    }

    reperformed = Math.round(reperformed * 100) / 100;
    const variance = Math.round((original - reperformed) * 100) / 100;
    const variancePercent = original !== 0 ? Math.round((variance / Math.abs(original)) * 10000) / 100 : 0;

    return {
      description: estimate.description,
      method: estimate.method,
      originalValue: original,
      reperformedValue: reperformed,
      variance,
      variancePercent,
      withinTolerance: Math.abs(variancePercent) < 5,
      isaReference: 'ISA 540',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Perform sensitivity analysis on an estimate.
   * @param {{description: string, baseValue: number, method: string}} estimate
   * @param {Array<{name: string, baseValue: number, low: number, high: number}>} assumptions
   * @returns {{scenarios: Array, sensitivityRange: Object}}
   */
  sensitivityAnalysis(estimate, assumptions) {
    this.checksPerformed++;

    if (!Array.isArray(assumptions) || assumptions.length === 0) {
      return { scenarios: [], sensitivityRange: { low: estimate.baseValue, high: estimate.baseValue, range: 0 } };
    }

    const baseValue = Number(estimate.baseValue) || 0;
    const scenarios = [];

    // Test each assumption independently
    for (const assumption of assumptions) {
      const baseAssumption = Number(assumption.baseValue) || 0;
      if (baseAssumption === 0) continue;

      const lowFactor = (Number(assumption.low) || 0) / baseAssumption;
      const highFactor = (Number(assumption.high) || 0) / baseAssumption;

      scenarios.push({
        assumption: assumption.name,
        baseAssumption,
        lowValue: assumption.low,
        highValue: assumption.high,
        estimateAtLow: Math.round(baseValue * lowFactor * 100) / 100,
        estimateAtHigh: Math.round(baseValue * highFactor * 100) / 100,
        impactRange: Math.round(Math.abs(baseValue * highFactor - baseValue * lowFactor) * 100) / 100,
        sensitivity: Math.round(Math.abs(highFactor - lowFactor) * 10000) / 100,
      });
    }

    // Combined scenario — all low and all high
    const allValues = scenarios.flatMap(s => [s.estimateAtLow, s.estimateAtHigh]);
    const minValue = Math.min(baseValue, ...allValues);
    const maxValue = Math.max(baseValue, ...allValues);

    return {
      scenarios,
      sensitivityRange: {
        low: Math.round(minValue * 100) / 100,
        high: Math.round(maxValue * 100) / 100,
        range: Math.round((maxValue - minValue) * 100) / 100,
        baseValue: Math.round(baseValue * 100) / 100,
      },
      isaReference: 'ISA 540.A113-A119',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Assess estimation uncertainty from historical estimates vs. outcomes.
   * @param {Array<{period: string, estimate: number, actual: number}>} historicalEstimates
   * @returns {{accuracy: number, biasTrend: string, analysis: Array}}
   */
  assessEstimationUncertainty(historicalEstimates) {
    this.checksPerformed++;

    if (!Array.isArray(historicalEstimates) || historicalEstimates.length === 0) {
      return { accuracy: 0, biasTrend: 'insufficient_data', analysis: [] };
    }

    const analysis = [];
    let totalVariance = 0;
    let overestimates = 0;
    let underestimates = 0;

    for (const h of historicalEstimates) {
      const estimate = Number(h.estimate) || 0;
      const actual = Number(h.actual) || 0;
      const variance = estimate - actual;
      const percentVariance = actual !== 0 ? Math.round((variance / Math.abs(actual)) * 10000) / 100 : 0;

      if (variance > 0) overestimates++;
      else if (variance < 0) underestimates++;

      totalVariance += Math.abs(percentVariance);
      analysis.push({
        period: h.period,
        estimate,
        actual,
        variance: Math.round(variance * 100) / 100,
        percentVariance,
        direction: variance > 0 ? 'overestimate' : variance < 0 ? 'underestimate' : 'exact',
      });
    }

    const accuracy = Math.max(0, Math.round((100 - totalVariance / historicalEstimates.length) * 100) / 100);

    let biasTrend = 'neutral';
    if (overestimates > historicalEstimates.length * 0.7) biasTrend = 'consistently_overestimating';
    else if (underestimates > historicalEstimates.length * 0.7) biasTrend = 'consistently_underestimating';
    else if (overestimates > underestimates + 1) biasTrend = 'tendency_to_overestimate';
    else if (underestimates > overestimates + 1) biasTrend = 'tendency_to_underestimate';

    return {
      accuracy,
      biasTrend,
      analysis,
      periodsAnalyzed: historicalEstimates.length,
      overestimates,
      underestimates,
      isaReference: 'ISA 540.A12-A14',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * AI: Evaluate reasonableness of a management estimate (OPUS, thinking HIGH).
   * @param {Object} estimate - { description, value, method, assumptions, supportingData }
   * @param {Object} ctx - { industry, entityType, materiality, period }
   * @returns {Promise<{reasonable: boolean, concerns: Array, managementBiasIndicators: Array}>}
   */
  async evaluateReasonableness(estimate, ctx = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior audit partner evaluating a management accounting estimate under ISA 540 (Revised).

ESTIMATE:
- Description: ${estimate.description || 'Not provided'}
- Value: ${estimate.value}
- Method: ${estimate.method || 'Not provided'}
- Key assumptions: ${JSON.stringify(estimate.assumptions || {})}
- Supporting data: ${JSON.stringify(estimate.supportingData || {})}

CONTEXT:
- Industry: ${ctx.industry || 'Not specified'}
- Entity type: ${ctx.entityType || 'Not specified'}
- Materiality: ${ctx.materiality || 'Not specified'}
- Period: ${ctx.period || 'Current year'}

Evaluate:
1. Is the estimate reasonable given the method and assumptions?
2. Are there indicators of management bias (ISA 540.32)?
3. What specific concerns exist?
4. What additional procedures would you recommend?

Return JSON: {
  "reasonable": true|false,
  "reasonablenessAssessment": "<detailed assessment>",
  "concerns": [{"concern": "<description>", "severity": "HIGH|MEDIUM|LOW", "isaReference": "ISA 540.XX"}],
  "managementBiasIndicators": [{"indicator": "<description>", "direction": "optimistic|pessimistic", "evidence": "<what suggests bias>"}],
  "recommendedProcedures": ["<procedure>"],
  "overallRisk": "HIGH|MEDIUM|LOW"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 540 specialist with deep expertise in auditing accounting estimates. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * AI: Develop an independent estimate for comparison (OPUS, thinking MAX).
   * @param {string} type - Type of estimate (e.g., 'bad_debt_provision', 'depreciation', 'inventory_nrv')
   * @param {Object} data - Supporting data for the estimate
   * @param {Object} ctx - Engagement context
   * @returns {Promise<{independentEstimate: number, methodology: string, comparison: Object}>}
   */
  async developIndependentEstimate(type, data, ctx = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior audit partner developing an independent estimate under ISA 540.

ESTIMATE TYPE: ${type}

DATA PROVIDED:
${JSON.stringify(data, null, 2)}

CONTEXT:
- Industry: ${ctx.industry || 'Not specified'}
- Entity type: ${ctx.entityType || 'Not specified'}
- Management's estimate: ${ctx.managementEstimate || 'Not provided'}
- Materiality: ${ctx.materiality || 'Not specified'}

Develop an independent estimate using:
1. Industry benchmarks and norms
2. Historical patterns in the data
3. Professional judgment based on the specific circumstances
4. Alternative methodologies where appropriate

Return JSON: {
  "independentEstimate": <number>,
  "methodology": "<detailed description of approach>",
  "assumptions": [{"assumption": "<description>", "basis": "<justification>"}],
  "comparison": {
    "managementEstimate": <number or null>,
    "auditorEstimate": <number>,
    "difference": <number>,
    "percentDifference": <number>,
    "withinAcceptableRange": true|false,
    "acceptableRangeExplanation": "<why this range is acceptable or not>"
  },
  "confidenceLevel": "HIGH|MEDIUM|LOW",
  "limitations": ["<limitation>"],
  "isaReference": "ISA 540"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.MAX,
      system: 'You are an ISA 540 specialist developing independent audit estimates. Apply maximum professional skepticism. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'EstimateAccuracy',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 540',
      aiRequired: true,
      model: MODELS.OPUS,
      thinkingEnabled: true,
    };
  }
}

export default new EstimateAccuracyModule();
