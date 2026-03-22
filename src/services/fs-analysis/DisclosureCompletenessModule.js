/**
 * DISCLOSURE COMPLETENESS MODULE
 * AI-enhanced: checks financial statement disclosures against framework requirements.
 * Validates accounting policies, related party disclosures, and framework-specific checklists.
 *
 * Framework: IAS 1.112-138, IAS 8, IAS 10, IAS 24, IFRS 7/12/15/16, FRS 102 Sections 8/33
 * ISA: ISA 700.13(e), ISA 260.16(a), ISA 450.11
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class DisclosureCompletenessModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Check disclosure completeness against framework requirements.
   * @param {Object} financialStatements - Extracted FS data with notes
   * @param {string} framework - 'IFRS'|'FRS102'|'FRS102_1A'|'FRS105'
   * @param {Object} context - { entityType, industry, jurisdiction, materiality }
   * @returns {Promise<{completenessScore: number, requiredDisclosures: Array, presentDisclosures: Array, missingDisclosures: Array, recommendations: Array}>}
   */
  async checkDisclosureCompleteness(financialStatements, framework = 'IFRS', context = {}) {
    this.checksPerformed++;

    const prompt = `You are a senior auditor performing the disclosure completeness checklist under ISA 700.13(e).

FINANCIAL STATEMENTS:
${JSON.stringify(financialStatements, null, 2).slice(0, 6000)}

FRAMEWORK: ${framework}
ENTITY TYPE: ${context.entityType || 'Private limited company'}
INDUSTRY: ${context.industry || 'Not specified'}
JURISDICTION: ${context.jurisdiction || 'UK'}
MATERIALITY: ${context.materiality || 'Not specified'}

Based on the financial statement data, identify:
1. All disclosures REQUIRED by ${framework} for this entity
2. Which disclosures appear to be PRESENT in the notes
3. Which disclosures are MISSING or incomplete
4. Severity of each missing disclosure (HIGH = audit opinion impact, MEDIUM = management letter point, LOW = best practice)

Key areas to check:
- Accounting policies (IAS 1.117-124 / FRS 102 S.8)
- Revenue recognition policies and disaggregation (IFRS 15 / FRS 102 S.23)
- Financial instruments (IFRS 7 / FRS 102 S.11-12)
- Related parties (IAS 24 / FRS 102 S.33)
- Events after reporting period (IAS 10 / FRS 102 S.32)
- Going concern basis (IAS 1.25-26)
- Contingent liabilities (IAS 37 / FRS 102 S.21)
- Commitments (capital and operating)
- Employee benefits / pension disclosures (IAS 19 / FRS 102 S.28)
- Lease disclosures (IFRS 16 / FRS 102 S.20)
- Tax disclosures (IAS 12 / FRS 102 S.29)
- Directors' remuneration (Companies Act 2006)
- Auditor remuneration
- Share capital and reserves movements
- Comparative information (ISA 710)

Return JSON: {
  "completenessScore": <0-100>,
  "requiredDisclosures": [{"standard": "<IAS/IFRS/FRS ref>", "requirement": "<description>", "category": "<category>"}],
  "presentDisclosures": [{"standard": "<ref>", "requirement": "<description>", "quality": "adequate|partial|minimal"}],
  "missingDisclosures": [{"standard": "<ref>", "requirement": "<description>", "severity": "HIGH|MEDIUM|LOW", "impact": "<audit opinion impact>"}],
  "recommendations": ["<recommendation>"]
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 700 disclosure completeness specialist. Be thorough and framework-specific. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Validate accounting policy disclosures match actual accounting treatments.
   * @param {Object} policies - { policyName: description }
   * @param {Array<string>} transactionTypes - Identified transaction types in the FS
   * @param {string} framework
   * @returns {Promise<{consistent: boolean, gaps: Array, redundantPolicies: Array}>}
   */
  async validateAccountingPolicies(policies, transactionTypes, framework = 'IFRS') {
    this.checksPerformed++;

    const prompt = `You are validating accounting policy disclosures under IAS 1.117-124 / FRS 102 Section 8.

DISCLOSED POLICIES:
${JSON.stringify(policies, null, 2)}

IDENTIFIED TRANSACTION TYPES IN THE FINANCIAL STATEMENTS:
${JSON.stringify(transactionTypes)}

FRAMEWORK: ${framework}

Evaluate:
1. Are policies disclosed for all material transaction types and FSLI areas?
2. Are any disclosed policies not relevant (redundant)?
3. Do the policies correctly describe the ${framework} treatments?
4. Are there significant judgments in applying policies that should be disclosed (IAS 1.122)?

Return JSON: {
  "consistent": true|false,
  "gaps": [{"policy": "<missing policy area>", "issue": "<what's missing>", "standardRef": "<IAS/IFRS/FRS ref>"}],
  "redundantPolicies": [{"policy": "<name>", "reason": "<why redundant>"}],
  "significantJudgments": [{"area": "<area>", "judgmentRequired": "<description>", "disclosed": true|false}],
  "overallAssessment": "<summary>"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: true,
      effort: EFFORT.MEDIUM,
      system: 'You are an accounting policy disclosure specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  /**
   * Check related party disclosure completeness (ISA 550 / IAS 24 / FRS 102 S.33).
   * @param {Object} relatedPartyNote - { parties: Array, transactions: Array, balances: Array }
   * @param {Object} context - { knownRelatedParties, knownTransactions, knownBalances }
   * @returns {Promise<{complete: boolean, missingParties: Array, missingTransactions: Array, missingBalances: Array, armLengthAssessment: string}>}
   */
  async checkRelatedPartyDisclosures(relatedPartyNote, context = {}) {
    this.checksPerformed++;

    const prompt = `You are checking related party disclosures under IAS 24 / FRS 102 Section 33 / ISA 550.

DISCLOSED IN THE NOTES:
${JSON.stringify(relatedPartyNote, null, 2)}

KNOWN FROM AUDIT WORK:
- Known related parties: ${JSON.stringify(context.knownRelatedParties || [])}
- Known RP transactions: ${JSON.stringify(context.knownTransactions || [])}
- Known RP balances: ${JSON.stringify(context.knownBalances || [])}

Check:
1. Are ALL known related parties disclosed? (IAS 24.13)
2. Are ALL transactions with related parties disclosed with required details? (IAS 24.18)
   - Nature of relationship, transaction amounts, outstanding balances, terms, provisions for doubtful debts
3. Are year-end balances disclosed? (IAS 24.18(b))
4. For UK entities: is there an arm's length statement, and is it appropriate? (FRS 102.33.9A)
5. Are key management personnel compensation categories disclosed? (IAS 24.17)

Return JSON: {
  "complete": true|false,
  "missingParties": [{"party": "<name>", "relationship": "<type>"}],
  "missingTransactions": [{"party": "<name>", "transaction": "<description>", "amount": <number>}],
  "missingBalances": [{"party": "<name>", "balance": <number>}],
  "armLengthAssessment": "<appropriate|inappropriate|not_applicable>",
  "keyManagementCompensation": {"disclosed": true|false, "categories": ["<category>"]},
  "overallRisk": "HIGH|MEDIUM|LOW",
  "isaReference": "ISA 550"
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: true,
      effort: EFFORT.HIGH,
      system: 'You are an ISA 550 related party specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'DisclosureCompleteness',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 700/260/450',
      aiRequired: true,
      model: MODELS.SONNET,
      thinkingEnabled: true,
    };
  }
}

export default new DisclosureCompletenessModule();
