/**
 * FRAMEWORK COMPLIANCE MODULE
 * AI-heavy — uses OPUS with thinking for "true and fair view" assessment.
 * Assesses overall compliance with IFRS/FRS 102, going concern basis,
 * accounting treatments, and audit opinion implications.
 *
 * Framework: IAS 1 (entire), IAS 8, IAS 10, IFRS 1, FRS 102 Sections 2-3
 * ISA: ISA 700/705/706/710/720, ISA 570, ISA 250
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class FrameworkComplianceModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Assess overall framework compliance of the financial statements.
   * @param {Object} financialStatements - Full extracted FS data
   * @param {Object} context - { framework, jurisdiction, entityType, industry, goingConcernStatus, firstYearAdoption }
   * @returns {Promise<{compliant: boolean, overallAssessment: string, complianceIssues: Array, trueFairView: boolean, goingConcernAssessment: Object, recommendedOpinionModifications: Array}>}
   */
  async assessFrameworkCompliance(financialStatements, context = {}) {
    this.checksPerformed++;

    const prompt = `You are an engagement partner performing the ISA 700 overall assessment of the financial statements.

FINANCIAL STATEMENTS SUMMARY:
${JSON.stringify(financialStatements, null, 2).slice(0, 6000)}

CONTEXT:
- Framework: ${context.framework || 'IFRS'}
- Jurisdiction: ${context.jurisdiction || 'UK'}
- Entity type: ${context.entityType || 'Private limited company'}
- Industry: ${context.industry || 'Not specified'}
- Going concern status: ${context.goingConcernStatus || 'Not assessed'}
- First year adoption: ${context.firstYearAdoption || false}

Perform the ISA 700.10-15 assessment:

1. PRESENTATION AND STRUCTURE (IAS 1 / FRS 102 S.3):
   - Complete set of financial statements? (BS, P&L, SCE, CF, Notes)
   - Correct format for entity type?
   - Comparative information presented? (ISA 710)
   - Consistent accounting policies?

2. MEASUREMENT AND RECOGNITION:
   - Appropriate measurement bases applied?
   - Recognition criteria properly applied?
   - Correct application of accrual basis?

3. CLASSIFICATION:
   - Current/non-current distinction appropriate?
   - Operating/financing/investing classification in cash flow?
   - Material items separately presented?

4. TRUE AND FAIR VIEW / FAIR PRESENTATION:
   - Do the FS as a whole give a true and fair view? (UK)
   - Is additional disclosure beyond minimum required for true and fair? (IAS 1.17)

5. GOING CONCERN (ISA 570):
   - Appropriate basis of preparation?
   - If material uncertainty exists, adequately disclosed?

6. OPINION CONSIDERATIONS:
   - Any issues requiring qualification (ISA 705)?
   - Any emphasis of matter needed (ISA 706)?
   - Other information consistency (ISA 720)?

Return JSON: {
  "compliant": true|false,
  "overallAssessment": "<detailed assessment>",
  "complianceIssues": [
    {
      "standard": "<IAS/IFRS/FRS ref>",
      "section": "<specific paragraph>",
      "issue": "<description>",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "impact": "<impact on FS and audit opinion>"
    }
  ],
  "trueFairView": true|false,
  "trueFairViewAssessment": "<assessment of whether FS give true and fair view>",
  "goingConcernAssessment": {
    "basisAppropriate": true|false,
    "materialUncertainty": true|false,
    "disclosuresAdequate": true|false
  },
  "recommendedOpinionModifications": [
    {
      "type": "qualified|adverse|disclaimer|emphasis_of_matter|other_matter",
      "reason": "<why modification needed>",
      "isaReference": "ISA 705/706"
    }
  ],
  "comparativeInformation": { "presented": true|false, "consistent": true|false },
  "overallComplianceScore": <0-100>
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 700 engagement partner forming an audit opinion. Apply the highest professional judgment. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Evaluate going concern basis and adequacy of disclosures (ISA 570).
   * @param {Object} data - { cashFlowForecasts, debtCovenants, orderBook, indicators, managementAssessment, disclosures }
   * @returns {Promise<{appropriateBasis: boolean, materialUncertainty: boolean, disclosuresAdequate: boolean, indicatorsTriggered: Array, recommendation: string}>}
   */
  async assessGoingConcern(data) {
    this.checksPerformed++;

    const prompt = `You are assessing going concern under ISA 570.

DATA PROVIDED:
- Cash flow forecasts: ${JSON.stringify(data.cashFlowForecasts || 'Not provided')}
- Debt covenants: ${JSON.stringify(data.debtCovenants || 'Not provided')}
- Order book: ${JSON.stringify(data.orderBook || 'Not provided')}
- Financial indicators: ${JSON.stringify(data.indicators || {})}
- Management's assessment: ${JSON.stringify(data.managementAssessment || 'Not provided')}
- Going concern disclosures: ${JSON.stringify(data.disclosures || 'Not provided')}

Evaluate against ISA 570 indicators:

FINANCIAL INDICATORS:
- Net liability position or negative current ratio?
- Fixed-term borrowings approaching maturity without realistic prospect of renewal?
- Excessive reliance on short-term borrowings?
- Adverse key financial ratios?
- Substantial operating losses or cash flow deterioration?
- Inability to pay creditors on due dates?
- Debt covenant breach (actual or anticipated)?

OPERATING INDICATORS:
- Management intention to liquidate or cease operations?
- Loss of key management without replacement?
- Loss of major market, customer, or supplier?
- Labour difficulties?

OTHER INDICATORS:
- Non-compliance with capital or other statutory requirements?
- Pending legal proceedings that may result in claims entity cannot satisfy?
- Changes in legislation or government policy?

Return JSON: {
  "appropriateBasis": true|false,
  "materialUncertainty": true|false,
  "disclosuresAdequate": true|false,
  "indicatorsTriggered": [{"indicator": "<description>", "category": "financial|operating|other", "severity": "HIGH|MEDIUM|LOW"}],
  "mitigatingFactors": ["<factor>"],
  "recommendation": "<unmodified|emphasis_of_matter|qualified|adverse>",
  "rationale": "<detailed reasoning>",
  "periodAssessed": "<12 months or longer from reporting date>",
  "isaReference": "ISA 570"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.OPUS,
      maxTokens: 3000,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 570 going concern specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Validate specific accounting treatment against framework requirements.
   * @param {string} fsli - e.g., 'revenue', 'leases', 'financial_instruments'
   * @param {Object} treatment - { policy, measurement, recognition, disclosure }
   * @param {string} framework
   * @returns {Promise<{compliant: boolean, issues: Array, alternativeTreatments: Array, frameworkReferences: Array}>}
   */
  async validateAccountingTreatment(fsli, treatment, framework = 'IFRS') {
    this.checksPerformed++;

    const prompt = `You are validating the accounting treatment for "${fsli}" under ${framework}.

CURRENT TREATMENT:
- Policy: ${treatment.policy || 'Not disclosed'}
- Measurement: ${treatment.measurement || 'Not disclosed'}
- Recognition: ${treatment.recognition || 'Not disclosed'}
- Disclosure: ${treatment.disclosure || 'Not disclosed'}

Validate against ${framework} requirements:
1. Is the measurement basis correct for this FSLI?
2. Are recognition criteria properly applied?
3. Are there alternative acceptable treatments?
4. What are the specific framework references?

Return JSON: {
  "compliant": true|false,
  "issues": [{"issue": "<description>", "severity": "HIGH|MEDIUM|LOW", "frameworkRef": "<specific paragraph>"}],
  "alternativeTreatments": [{"treatment": "<description>", "frameworkRef": "<ref>"}],
  "frameworkReferences": ["<IAS/IFRS/FRS ref with paragraph>"],
  "recommendation": "<what the auditor should do>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: true,
      effort: EFFORT.MEDIUM,
      system: `You are an ${framework} accounting treatment specialist. Return valid JSON only.`,
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'FrameworkCompliance',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 700/705/706/570',
      aiRequired: true,
      model: MODELS.OPUS,
      thinkingEnabled: true,
    };
  }
}

export default new FrameworkComplianceModule();
