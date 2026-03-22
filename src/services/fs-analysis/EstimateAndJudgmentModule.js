/**
 * ESTIMATE AND JUDGMENT MODULE (ISA 540 Revised)
 * AI-heavy — uses OPUS with thinking for deepest professional judgment.
 * Identifies estimates/judgments, evaluates reasonableness, assesses management bias.
 *
 * Framework: IAS 36/37/19, IFRS 9/13, FRS 102 Sections 11/21/27/28
 * ISA: ISA 540 (entire standard), ISA 315.32, ISA 700.13(d)
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class EstimateAndJudgmentModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Identify all significant estimates and judgments from the financial statements.
   * @param {Object} financialStatements - Full extracted FS data
   * @param {Object} context - { framework, industry, entityType, materiality }
   * @returns {Promise<{estimates: Array, judgments: Array, totalEstimateExposure: number}>}
   */
  async identifyEstimatesAndJudgments(financialStatements, context = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior audit partner identifying accounting estimates and significant judgments under ISA 540 (Revised).

FINANCIAL STATEMENTS:
${JSON.stringify(financialStatements, null, 2).slice(0, 6000)}

CONTEXT:
- Framework: ${context.framework || 'IFRS'}
- Industry: ${context.industry || 'Not specified'}
- Entity type: ${context.entityType || 'Not specified'}
- Materiality: ${context.materiality || 'Not specified'}

Systematically identify:

A) ACCOUNTING ESTIMATES (ISA 540.2) — monetary amounts subject to measurement uncertainty:
- Bad debt provisions / expected credit losses (IFRS 9 / FRS 102 S.11)
- Inventory write-downs to NRV (IAS 2 / FRS 102 S.13)
- Impairment of goodwill/intangibles/PPE (IAS 36 / FRS 102 S.27)
- Depreciation/amortisation useful lives and residual values
- Provisions (IAS 37 / FRS 102 S.21) — warranty, legal, restructuring, decommissioning
- Pension obligations — discount rates, mortality, salary growth (IAS 19 / FRS 102 S.28)
- Fair values of financial instruments, investment property, biological assets
- Revenue recognition estimates — variable consideration, contract costs (IFRS 15)
- Lease discount rates / incremental borrowing rates (IFRS 16)
- Deferred tax recoverability (IAS 12 / FRS 102 S.29)
- Share-based payment valuations (IFRS 2 / FRS 102 S.26)

B) SIGNIFICANT JUDGMENTS (IAS 1.122) — key decisions that significantly affect amounts:
- Going concern assessment
- Control / significant influence determination
- Revenue recognition timing / method
- Lease classification (operating vs finance, if applicable)
- Capitalisation vs expensing decisions
- Fair value hierarchy classification
- Functional currency determination

For each, provide the risk level, ISA reference, and recommended audit procedures.

Return JSON: {
  "estimates": [
    {
      "description": "<name of estimate>",
      "fsli": "<financial statement line item>",
      "value": <estimated monetary value or null>,
      "method": "<measurement methodology>",
      "keyAssumptions": ["<assumption>"],
      "riskLevel": "HIGH|MEDIUM|LOW",
      "estimationUncertainty": "HIGH|MEDIUM|LOW",
      "isaReference": "ISA 540.XX",
      "frameworkReference": "<IAS/IFRS/FRS ref>",
      "recommendedProcedures": ["<procedure>"]
    }
  ],
  "judgments": [
    {
      "description": "<judgment area>",
      "area": "<FSLI or disclosure area>",
      "impact": "<how it affects the FS>",
      "alternatives": ["<alternative treatment>"],
      "riskLevel": "HIGH|MEDIUM|LOW"
    }
  ],
  "totalEstimateExposure": <total monetary value of all estimates>,
  "highRiskEstimateCount": <number>,
  "overallAssessment": "<summary of estimation risk profile>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 540 specialist with deep IFRS/FRS 102 knowledge. Be exhaustive in identifying estimates. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Evaluate reasonableness of a specific management estimate.
   * @param {Object} estimate - { description, value, method, assumptions, supportingData, historicalComparison }
   * @param {Object} context - { industry, framework, materiality, marketConditions }
   * @returns {Promise<{reasonable: boolean, assessment: string, biasIndicators: Array, sensitivityRange: Object, recommendedProcedures: Array, overallRisk: string}>}
   */
  async evaluateEstimateReasonableness(estimate, context = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior audit partner evaluating a management estimate under ISA 540 (Revised).

ESTIMATE DETAILS:
- Description: ${estimate.description}
- Value: ${estimate.value}
- Method: ${estimate.method || 'Not disclosed'}
- Key assumptions: ${JSON.stringify(estimate.assumptions || {})}
- Supporting data: ${JSON.stringify(estimate.supportingData || {})}
- Historical comparison: ${JSON.stringify(estimate.historicalComparison || {})}

CONTEXT:
- Industry: ${context.industry || 'Not specified'}
- Framework: ${context.framework || 'IFRS'}
- Materiality: ${context.materiality || 'Not specified'}
- Market conditions: ${context.marketConditions || 'Not specified'}

Evaluate under ISA 540.22-23 and 540.32:
1. Is the method appropriate for the framework?
2. Are the assumptions reasonable and internally consistent?
3. Is the data used reliable and relevant?
4. What is the sensitivity to key assumptions?
5. Are there indicators of management bias? (ISA 540.32)
   - Consistent direction of estimates (optimistic/pessimistic)?
   - Cherry-picking of assumptions?
   - Narrow point estimate when range is wide?
   - Changes in method without justification?

Return JSON: {
  "reasonable": true|false,
  "assessment": "<detailed assessment>",
  "biasIndicators": [{"indicator": "<description>", "direction": "optimistic|pessimistic", "evidence": "<what suggests bias>", "severity": "HIGH|MEDIUM|LOW"}],
  "sensitivityRange": {"low": <number>, "pointEstimate": <number>, "high": <number>, "rangeWidth": <number>},
  "recommendedProcedures": ["<specific ISA 540 procedure>"],
  "overallRisk": "HIGH|MEDIUM|LOW",
  "opinionImplication": "<any impact on audit opinion>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.MAX,
      system: 'You are an ISA 540 specialist. Apply maximum professional skepticism to management estimates. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Assess management bias across all estimates in the financial statements.
   * @param {Array<{description: string, value: number, direction?: string, variance?: number}>} estimates
   * @returns {Promise<{biasDetected: boolean, direction: string, evidence: Array, overallAssessment: string, isaReference: string}>}
   */
  async assessManagementBias(estimates) {
    this.checksPerformed++;

    if (!Array.isArray(estimates) || estimates.length === 0) {
      return { biasDetected: false, direction: 'neutral', evidence: [], overallAssessment: 'Insufficient data', isaReference: 'ISA 540.32' };
    }

    const prompt = `You are assessing management bias across all accounting estimates in the financial statements under ISA 540.32.

ALL ESTIMATES AND THEIR OUTCOMES:
${JSON.stringify(estimates, null, 2)}

ISA 540.32 requires the auditor to evaluate whether the judgments and decisions made by management in making the accounting estimates indicate possible management bias.

Assess:
1. Is there a consistent directional pattern (all optimistic or all pessimistic)?
2. Are individual estimates at the aggressive end of reasonable ranges?
3. Have there been recent changes in estimation methods without business justification?
4. Is the cumulative effect of estimates material even if individually immaterial?
5. Does the pattern suggest earnings management?
6. What is the effect on profit/equity if all estimates were at the conservative end?

Return JSON: {
  "biasDetected": true|false,
  "direction": "optimistic|pessimistic|mixed|neutral",
  "evidence": [{"observation": "<what was observed>", "significance": "HIGH|MEDIUM|LOW"}],
  "cumulativeEffect": { "onProfit": <number or null>, "onEquity": <number or null> },
  "overallAssessment": "<professional conclusion>",
  "communicateToGovernance": true|false,
  "isaReference": "ISA 540.32-33"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 2048,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 540 management bias specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'EstimateAndJudgment',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 540',
      aiRequired: true,
      model: MODELS.OPUS,
      thinkingEnabled: true,
      effortLevel: 'MAX',
    };
  }
}

export default new EstimateAndJudgmentModule();
