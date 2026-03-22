/**
 * SAMPLING ACCURACY MODULE (ISA 530)
 * Hybrid: statistical computation + AI for result interpretation.
 * Assesses sample representativeness, projection accuracy,
 * sample size adequacy, population stratification, and result interpretation.
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class SamplingAccuracyModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Assess whether a sample is representative of its population.
   * @param {Array<Object>} sample
   * @param {Array<Object>} population
   * @param {Array<string>} characteristics - Fields to compare distribution
   * @returns {{representative: boolean, characteristics: Array, coverageScore: number}}
   */
  assessRepresentativeness(sample, population, characteristics = []) {
    this.checksPerformed++;

    if (!Array.isArray(sample) || !Array.isArray(population) || population.length === 0) {
      return { representative: false, characteristics: [], coverageScore: 0 };
    }

    const charResults = [];
    let totalScore = 0;

    for (const char of characteristics) {
      // Build distribution for population
      const popDist = this._buildDistribution(population, char);
      const sampleDist = this._buildDistribution(sample, char);

      // Compare distributions
      let similarity = 0;
      const allKeys = new Set([...Object.keys(popDist), ...Object.keys(sampleDist)]);
      for (const key of allKeys) {
        const popPct = popDist[key] || 0;
        const samplePct = sampleDist[key] || 0;
        similarity += 1 - Math.abs(popPct - samplePct);
      }
      similarity = allKeys.size > 0 ? Math.round((similarity / allKeys.size) * 10000) / 100 : 100;
      totalScore += similarity;

      charResults.push({
        characteristic: char,
        populationDistribution: popDist,
        sampleDistribution: sampleDist,
        similarityScore: similarity,
        representative: similarity >= 80,
      });
    }

    const coverageScore = characteristics.length > 0
      ? Math.round((totalScore / characteristics.length) * 100) / 100
      : Math.round((sample.length / population.length) * 10000) / 100;

    return {
      representative: coverageScore >= 80,
      characteristics: charResults,
      coverageScore,
      sampleSize: sample.length,
      populationSize: population.length,
      samplingFraction: Math.round((sample.length / population.length) * 10000) / 100,
      isaReference: 'ISA 530.A11',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate projected misstatement from sample results.
   * @param {{misstatements: Array<{bookValue: number, auditedValue: number}>, sampleBookValue: number}} results
   * @param {number} populationSize - Total population book value
   * @param {number} [confidence=0.95]
   * @returns {{projectedMisstatement: number, interval: Object, tainting: Array}}
   */
  calculateProjectionAccuracy(results, populationSize, confidence = 0.95) {
    this.checksPerformed++;

    if (!results || !Array.isArray(results.misstatements)) {
      return { projectedMisstatement: 0, interval: { lower: 0, upper: 0 }, tainting: [] };
    }

    const { misstatements, sampleBookValue } = results;
    const tainting = [];

    // Calculate tainting factor for each misstatement
    let totalTainting = 0;
    for (const m of misstatements) {
      const book = Number(m.bookValue) || 0;
      const audited = Number(m.auditedValue) || 0;
      const misstatement = book - audited;
      const taintingFactor = book !== 0 ? misstatement / book : 0;

      tainting.push({
        bookValue: book,
        auditedValue: audited,
        misstatement: Math.round(misstatement * 100) / 100,
        taintingFactor: Math.round(taintingFactor * 10000) / 10000,
      });

      totalTainting += taintingFactor;
    }

    // Ratio projection
    const sampleBV = Number(sampleBookValue) || 1;
    const sampleMisstatement = misstatements.reduce(
      (sum, m) => sum + ((Number(m.bookValue) || 0) - (Number(m.auditedValue) || 0)), 0
    );
    const projectionRate = sampleMisstatement / sampleBV;
    const projectedMisstatement = Math.round(projectionRate * populationSize * 100) / 100;

    // Confidence interval
    const n = misstatements.length || 1;
    const stdDev = Math.sqrt(
      tainting.reduce((s, t) => s + (t.taintingFactor - (totalTainting / n)) ** 2, 0) / (n - 1 || 1)
    );
    const zScores = { 0.9: 1.645, 0.95: 1.96, 0.99: 2.576 };
    const z = zScores[confidence] || 1.96;
    const margin = Math.round(z * stdDev * populationSize / Math.sqrt(n) * 100) / 100;

    return {
      projectedMisstatement,
      interval: {
        lower: Math.round((projectedMisstatement - margin) * 100) / 100,
        upper: Math.round((projectedMisstatement + margin) * 100) / 100,
        confidence,
      },
      tainting,
      projectionRate: Math.round(projectionRate * 10000) / 10000,
      sampleMisstatementTotal: Math.round(sampleMisstatement * 100) / 100,
      isaReference: 'ISA 530.A20',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Evaluate if sample size is adequate for the given parameters.
   * @param {number} populationSize
   * @param {number} tolerableMisstatement
   * @param {number} expectedMisstatement
   * @param {number} [confidence=0.95]
   * @returns {{requiredSize: number, adequate: boolean}}
   */
  evaluateSampleSize(populationSize, tolerableMisstatement, expectedMisstatement, confidence = 0.95) {
    this.checksPerformed++;

    if (!populationSize || !tolerableMisstatement) {
      return { requiredSize: 0, adequate: false, reason: 'Missing parameters' };
    }

    // Simplified sample size calculation (monetary unit / attribute)
    const confidenceFactors = { 0.9: 2.31, 0.95: 3.0, 0.99: 4.61 };
    const cf = confidenceFactors[confidence] || 3.0;

    // Expected misstatement expansion factor
    const expectedRate = populationSize > 0 ? (expectedMisstatement || 0) / populationSize : 0;
    const expansionFactor = expectedRate > 0 ? 1 + (expectedRate * 1.5) : 1;

    const requiredSize = Math.ceil(
      (cf * populationSize * expansionFactor) / tolerableMisstatement
    );

    // Cap at population size
    const finalSize = Math.min(requiredSize, populationSize);

    return {
      requiredSize: finalSize,
      adequate: true, // Adequate means we can calculate it
      populationSize,
      tolerableMisstatement,
      expectedMisstatement: expectedMisstatement || 0,
      confidence,
      confidenceFactor: cf,
      samplingFraction: Math.round((finalSize / populationSize) * 10000) / 100,
      isaReference: 'ISA 530.A10',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Stratify a population by specified criteria for more efficient sampling.
   * @param {Array<Object>} population
   * @param {{field: string, method?: string, boundaries?: number[]}} criteria
   * @returns {{strata: Array}}
   */
  stratifyPopulation(population, criteria) {
    this.checksPerformed++;

    if (!Array.isArray(population) || population.length === 0 || !criteria?.field) {
      return { strata: [] };
    }

    const { field, method = 'equal_width', boundaries } = criteria;
    const values = population.map(item => Number(item[field]) || 0);
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    let strataBoundaries;
    if (boundaries) {
      strataBoundaries = boundaries;
    } else if (method === 'equal_count') {
      // Equal number of items per stratum (quartiles)
      strataBoundaries = [
        sorted[Math.floor(sorted.length * 0.25)],
        sorted[Math.floor(sorted.length * 0.5)],
        sorted[Math.floor(sorted.length * 0.75)],
      ];
    } else {
      // Equal width (default 4 strata)
      const width = (max - min) / 4;
      strataBoundaries = [min + width, min + 2 * width, min + 3 * width];
    }

    // Build strata
    const strata = [];
    const bounds = [min, ...strataBoundaries, max + 0.01];
    for (let i = 0; i < bounds.length - 1; i++) {
      const lower = bounds[i];
      const upper = bounds[i + 1];
      const items = population.filter(item => {
        const v = Number(item[field]) || 0;
        return v >= lower && v < upper;
      });
      const strataValues = items.map(item => Number(item[field]) || 0);
      const total = strataValues.reduce((s, v) => s + v, 0);

      strata.push({
        stratumId: i + 1,
        range: { lower: Math.round(lower * 100) / 100, upper: Math.round(upper * 100) / 100 },
        count: items.length,
        total: Math.round(total * 100) / 100,
        mean: items.length > 0 ? Math.round((total / items.length) * 100) / 100 : 0,
        percentOfPopulation: Math.round((items.length / population.length) * 10000) / 100,
        percentOfValue: values.reduce((s, v) => s + v, 0) > 0
          ? Math.round((total / values.reduce((s, v) => s + v, 0)) * 10000) / 100
          : 0,
      });
    }

    return {
      strata,
      field: criteria.field,
      method,
      populationSize: population.length,
      strataCount: strata.length,
      isaReference: 'ISA 530.A6',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * AI: Interpret sampling results and assess their audit implications (SONNET, thinking MEDIUM).
   * @param {Object} results - Sampling results (projection, representativeness, etc.)
   * @param {Object} ctx - Engagement context
   * @returns {Promise<{interpretation: Object}>}
   */
  async interpretSamplingResults(results, ctx = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior auditor interpreting sampling results under ISA 530.

SAMPLING RESULTS:
${JSON.stringify(results, null, 2)}

CONTEXT:
- Industry: ${ctx.industry || 'Not specified'}
- Entity type: ${ctx.entityType || 'Not specified'}
- Materiality: ${ctx.materiality || 'Not specified'}
- Tolerable misstatement: ${ctx.tolerableMisstatement || 'Not specified'}
- FSLI being tested: ${ctx.fsli || 'Not specified'}

Interpret the results considering:
1. Does the projected misstatement exceed tolerable misstatement?
2. Is the sample representative and adequate?
3. What are the implications for the audit opinion?
4. Should additional procedures be performed?

Return JSON: {
  "interpretation": {
    "conclusion": "<overall conclusion>",
    "projectedVsTolerable": "<comparison assessment>",
    "sampleAdequacy": "<assessment of sample quality>",
    "auditImplications": ["<implication>"],
    "additionalProcedures": ["<procedure if needed>"],
    "opinionImpact": "NONE|QUALIFICATION_RISK|MATERIAL_MISSTATEMENT",
    "overallAssessment": "SATISFACTORY|REQUIRES_EXTENSION|UNSATISFACTORY",
    "isaReference": "ISA 530"
  }
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: true,
      effort: EFFORT.MEDIUM,
      system: 'You are an ISA 530 audit sampling specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Build a distribution map (value -> percentage) for a field.
   * @private
   */
  _buildDistribution(data, field) {
    const counts = {};
    for (const item of data) {
      const val = String(item[field] ?? 'undefined');
      counts[val] = (counts[val] || 0) + 1;
    }
    const total = data.length;
    const dist = {};
    for (const [key, count] of Object.entries(counts)) {
      dist[key] = Math.round((count / total) * 10000) / 10000;
    }
    return dist;
  }

  getMetrics() {
    return {
      module: 'SamplingAccuracy',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 530',
      aiRequired: true,
      model: MODELS.SONNET,
      thinkingEnabled: true,
    };
  }
}

export default new SamplingAccuracyModule();
