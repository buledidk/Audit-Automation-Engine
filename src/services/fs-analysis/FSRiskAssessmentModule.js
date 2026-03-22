/**
 * FS-LEVEL RISK ASSESSMENT MODULE
 * AI-heavy — uses OPUS with MAX thinking.
 * Performs financial-statement-level risk assessment, identifies unusual items,
 * presumed fraud risks, and generates audit focus areas.
 *
 * ISA: ISA 315 (Revised 2019), ISA 240.26-27, ISA 260.16, ISA 320
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class FSRiskAssessmentModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Perform comprehensive FS-level risk assessment.
   * @param {Object} financialStatements - Extracted FS data
   * @param {Object} context - { framework, industry, entityType, materiality, priorYearIssues, controlEnvironment, firstYearAudit }
   * @returns {Promise<{overallRisk: string, financialStatementLevelRisks: Array, assertionLevelRisks: Array, significantRisks: Array, presumedFraudRisks: Array, riskMatrix: Object, auditStrategyRecommendation: Object}>}
   */
  async performFSRiskAssessment(financialStatements, context = {}) {
    this.checksPerformed++;

    const prompt = `You are performing a financial-statement-level risk assessment under ISA 315 (Revised 2019).

FINANCIAL STATEMENTS:
${JSON.stringify(financialStatements, null, 2).slice(0, 6000)}

CONTEXT:
- Framework: ${context.framework || 'IFRS'}
- Industry: ${context.industry || 'Not specified'}
- Entity type: ${context.entityType || 'Not specified'}
- Materiality: ${context.materiality || 'Not specified'}
- Prior year issues: ${JSON.stringify(context.priorYearIssues || [])}
- Control environment: ${context.controlEnvironment || 'Not assessed'}
- First year audit: ${context.firstYearAudit || false}

Perform ISA 315.25-31 assessment:

1. FINANCIAL STATEMENT LEVEL RISKS (ISA 315.25):
   - Risks that relate pervasively to the FS as a whole
   - Management integrity and competence
   - Quality of governance and oversight
   - Complexity of transactions and events
   - Degree of subjectivity in measurements
   - Economic and industry conditions

2. ASSERTION LEVEL RISKS (ISA 315.26-28):
   For each material FSLI, assess risks to:
   - Existence/Occurrence
   - Completeness
   - Accuracy/Valuation
   - Cutoff
   - Classification/Presentation
   - Rights and Obligations

3. SIGNIFICANT RISKS (ISA 315.28):
   - Revenue recognition (presumed fraud risk per ISA 240.26)
   - Management override of controls (presumed fraud risk per ISA 240.27)
   - Significant estimates with high uncertainty
   - Related party transactions outside normal business
   - Unusual or complex transactions near period end

4. SPECTRUM OF INHERENT RISK (ISA 315.A128-A148):
   Rate each risk on the spectrum: LOW → MEDIUM → HIGH → VERY HIGH

Return JSON: {
  "overallRisk": "HIGH|MEDIUM|LOW",
  "financialStatementLevelRisks": [
    {
      "risk": "<description>",
      "category": "pervasive|governance|complexity|subjectivity|economic",
      "inherentRisk": "HIGH|MEDIUM|LOW",
      "auditResponse": "<planned response>"
    }
  ],
  "assertionLevelRisks": [
    {
      "fsli": "<line item>",
      "assertion": "<assertion>",
      "riskLevel": "VERY_HIGH|HIGH|MEDIUM|LOW",
      "rationale": "<why this risk level>",
      "significantRisk": true|false,
      "recommendedProcedures": ["<procedure>"]
    }
  ],
  "significantRisks": [
    {
      "risk": "<description>",
      "fsli": "<affected line item>",
      "assertions": ["<assertion>"],
      "rationale": "<why significant>",
      "fraudRisk": true|false,
      "isaReference": "ISA 315.XX or ISA 240.XX"
    }
  ],
  "presumedFraudRisks": [
    {
      "risk": "Revenue recognition fraud|Management override",
      "rebutted": false,
      "rationale": "<why not rebutted or why rebutted>",
      "isaReference": "ISA 240.26|ISA 240.27"
    }
  ],
  "riskMatrix": {
    "highRiskAreas": ["<area>"],
    "mediumRiskAreas": ["<area>"],
    "lowRiskAreas": ["<area>"]
  },
  "auditStrategyRecommendation": {
    "approach": "substantive|combined|controls_reliance",
    "rationale": "<why this approach>",
    "keyFocusAreas": ["<area>"],
    "estimatedComplexity": "HIGH|MEDIUM|LOW"
  }
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.MAX,
      system: 'You are an ISA 315 risk assessment specialist performing the highest-stakes assessment in the audit. Apply maximum professional skepticism. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Identify unusual transactions and items requiring special attention.
   * @param {Object} financialStatements
   * @param {Object} context
   * @returns {Promise<{unusualTransactions: Array, largeAdjustments: Array, oneOffItems: Array, relatedPartyFlags: Array}>}
   */
  async identifyUnusualItems(financialStatements, context = {}) {
    this.checksPerformed++;

    const prompt = `You are identifying unusual transactions and items requiring special audit attention under ISA 240 and ISA 315.

FINANCIAL STATEMENTS:
${JSON.stringify(financialStatements, null, 2).slice(0, 5000)}

CONTEXT:
- Industry: ${context.industry || 'Not specified'}
- Entity type: ${context.entityType || 'Not specified'}
- Materiality: ${context.materiality || 'Not specified'}

Identify:
1. Unusual transactions (ISA 240.32) — outside normal course of business, unusually large, complex
2. Large year-end adjustments — journal entries near period end
3. One-off items — non-recurring items that may distort trends
4. Related party transaction flags — transactions that may not be on arm's length terms
5. Inconsistencies — items that don't align with industry norms or prior periods

Return JSON: {
  "unusualTransactions": [{"description": "<description>", "amount": <number or null>, "risk": "HIGH|MEDIUM|LOW", "fsli": "<line item>", "auditProcedure": "<recommended action>"}],
  "largeAdjustments": [{"description": "<description>", "amount": <number or null>, "timing": "<when booked>", "suspicious": true|false}],
  "oneOffItems": [{"description": "<description>", "amount": <number or null>, "impact": "<effect on FS>"}],
  "relatedPartyFlags": [{"description": "<description>", "risk": "HIGH|MEDIUM|LOW", "isaReference": "ISA 550"}],
  "overallConcern": "HIGH|MEDIUM|LOW",
  "summaryForPartner": "<2-3 sentence summary for engagement partner>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 3000,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 240/315 specialist identifying fraud indicators and unusual items. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Generate audit focus areas from all module results (aggregation step).
   * @param {Object} allModuleResults - Combined results from modules 1-6
   * @param {Object} context
   * @returns {Promise<{prioritisedAreas: Array, summaryForPartner: string, communicationPoints: Array}>}
   */
  async generateAuditFocusAreas(allModuleResults, context = {}) {
    this.checksPerformed++;

    const prompt = `You are the engagement partner synthesising all financial statement analysis results to determine audit focus areas.

MODULE RESULTS SUMMARY:
${JSON.stringify(allModuleResults, null, 2).slice(0, 6000)}

CONTEXT:
- Framework: ${context.framework || 'IFRS'}
- Materiality: ${context.materiality || 'Not specified'}
- Entity: ${context.entityType || 'Not specified'}

Based on ALL module findings, produce:
1. Prioritised audit focus areas ranked by risk
2. A concise partner summary (for the engagement partner meeting)
3. Points to communicate to those charged with governance (ISA 260)

Return JSON: {
  "prioritisedAreas": [
    {
      "area": "<FSLI or topic>",
      "riskLevel": "CRITICAL|HIGH|MEDIUM|LOW",
      "reason": "<why this needs focus based on module findings>",
      "modulesContributing": ["<which modules flagged this>"],
      "recommendedProcedures": ["<specific procedure>"],
      "estimatedEffort": "HIGH|MEDIUM|LOW"
    }
  ],
  "summaryForPartner": "<concise 3-5 sentence summary of key findings and recommended approach>",
  "communicationPoints": [
    {
      "point": "<what to communicate>",
      "audience": "governance|management|audit_committee",
      "isaReference": "ISA 260/265",
      "timing": "planning|interim|completion"
    }
  ],
  "overallRiskProfile": "HIGH|MEDIUM|LOW",
  "auditHoursImpact": "<estimated impact on audit hours>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 3000,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are a senior engagement partner synthesising audit findings. Be concise and action-oriented. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'FSRiskAssessment',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 315/240/260',
      aiRequired: true,
      model: MODELS.OPUS,
      thinkingEnabled: true,
      effortLevel: 'MAX',
    };
  }
}

export default new FSRiskAssessmentModule();
