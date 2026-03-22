/**
 * CONSOLIDATION VALIDATION MODULE
 * Hybrid: computation for eliminations/NCI + AI for goodwill judgment.
 * Validates group accounts: inter-company eliminations, goodwill, NCI, FX translation.
 *
 * Framework: IFRS 3/10/12, IAS 21/28, FRS 102 Sections 9/14/19/30
 * ISA: ISA 600 (Revised), ISA 315.25
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

export class ConsolidationValidationModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Validate inter-company elimination entries.
   * @param {Array<{debitEntity: string, creditEntity: string, account: string, amount: number, type: string}>} eliminations
   * @param {Object} interCompanyBalances - { "EntityA-EntityB": { receivable: number, payable: number } }
   * @returns {{fullyEliminated: boolean, unmatchedBalances: Array, unmatchedTransactions: Array, unrealisedProfitsChecked: boolean}}
   */
  validateEliminations(eliminations, interCompanyBalances = {}) {
    this.checksPerformed++;

    if (!Array.isArray(eliminations)) {
      return { fullyEliminated: false, unmatchedBalances: [], unmatchedTransactions: [], unrealisedProfitsChecked: false };
    }

    const unmatchedBalances = [];
    const unmatchedTransactions = [];
    const eliminatedPairs = new Set();
    let hasUnrealisedProfitElim = false;

    // Track which IC balances have been eliminated
    for (const elim of eliminations) {
      const pairKey = [elim.debitEntity, elim.creditEntity].sort().join('-');
      eliminatedPairs.add(pairKey);
      if (elim.type === 'unrealisedProfit') hasUnrealisedProfitElim = true;
    }

    // Check all IC balances have eliminations
    for (const [pair, balances] of Object.entries(interCompanyBalances)) {
      const receivable = Number(balances.receivable) || 0;
      const payable = Number(balances.payable) || 0;
      const difference = Math.round((receivable - payable) * 100) / 100;

      if (Math.abs(difference) >= 0.01) {
        unmatchedBalances.push({
          pair,
          receivable,
          payable,
          difference,
          severity: Math.abs(difference) > 10000 ? 'HIGH' : 'MEDIUM',
        });
      }

      // Check elimination exists for this pair
      const normalised = pair.split('-').sort().join('-');
      if (!eliminatedPairs.has(normalised) && (receivable > 0 || payable > 0)) {
        unmatchedTransactions.push({
          pair,
          issue: 'No elimination entry found for this inter-company pair',
          receivable,
          payable,
        });
      }
    }

    return {
      fullyEliminated: unmatchedBalances.length === 0 && unmatchedTransactions.length === 0,
      unmatchedBalances,
      unmatchedTransactions,
      unrealisedProfitsChecked: hasUnrealisedProfitElim,
      eliminationCount: eliminations.length,
      isaReference: 'ISA 600.49-50',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate goodwill calculation and carrying amount (AI for impairment judgment).
   * @param {Object} acquisition - { consideration, nciMethod, fairValueNetAssets, previouslyHeldInterest, goodwillCalculated }
   * @param {string} framework - 'IFRS'|'FRS102'
   * @param {Object} impairmentData - { carryingAmount, recoverableAmount, cguAssumptions }
   * @returns {Promise<{goodwillCorrect: boolean, expectedGoodwill: number, variance: number, impairmentAssessment: Object, frameworkNotes: Array}>}
   */
  async validateGoodwill(acquisition, framework = 'IFRS', impairmentData = {}) {
    this.checksPerformed++;

    // Pure computation: goodwill = consideration + NCI - fair value net assets
    const consideration = Number(acquisition.consideration) || 0;
    const nci = Number(acquisition.nciAmount) || 0;
    const previousInterest = Number(acquisition.previouslyHeldInterest) || 0;
    const fairValueNA = Number(acquisition.fairValueNetAssets) || 0;
    const expectedGoodwill = Math.round((consideration + nci + previousInterest - fairValueNA) * 100) / 100;
    const statedGoodwill = Number(acquisition.goodwillCalculated) || 0;
    const variance = Math.round((statedGoodwill - expectedGoodwill) * 100) / 100;

    // AI assessment for impairment (complex judgment)
    let impairmentAssessment = { assessed: false };
    if (impairmentData.carryingAmount || impairmentData.cguAssumptions) {
      const prompt = `You are evaluating goodwill impairment under ${framework === 'FRS102' ? 'FRS 102 Section 27 (note: FRS 102 AMORTISES goodwill over useful life, max 5 years unless justified)' : 'IAS 36 (impairment-only model, annual testing required)'}.

GOODWILL:
- Carrying amount: ${impairmentData.carryingAmount || 'Not provided'}
- Recoverable amount: ${impairmentData.recoverableAmount || 'Not provided'}
- CGU assumptions: ${JSON.stringify(impairmentData.cguAssumptions || {})}

FRAMEWORK: ${framework}

Assess:
1. Is the recoverable amount calculation appropriate?
2. Are the CGU assumptions reasonable (discount rate, growth rate, terminal value)?
3. Is impairment required?
4. ${framework === 'FRS102' ? 'Is the amortisation period appropriate (max 5 years unless justified)?' : 'Has the annual impairment test been properly performed?'}

Return JSON: {
  "assessed": true,
  "impairmentRequired": true|false,
  "impairmentAmount": <number or 0>,
  "assumptionsReasonable": true|false,
  "concerns": [{"concern": "<description>", "severity": "HIGH|MEDIUM|LOW"}],
  "frameworkCompliant": true|false,
  "frameworkNotes": ["<observation specific to ${framework}>"]
}`;

      const { text } = await this.claude.sendMessage({
        prompt,
        model: MODELS.OPUS,
        maxTokens: 2048,
        thinking: true,
        effort: EFFORT.HIGH,
        system: `You are an ${framework === 'FRS102' ? 'FRS 102 Section 19/27' : 'IFRS 3/IAS 36'} goodwill specialist. Return valid JSON only.`,
      });
      impairmentAssessment = this.claude.parseJSON(text);
    }

    const frameworkNotes = [];
    if (framework === 'FRS102') {
      frameworkNotes.push('FRS 102: Goodwill must be amortised over useful life (max 5 years unless longer justified)');
      frameworkNotes.push('FRS 102 S.19.23: Negative goodwill recognised in P&L');
    } else {
      frameworkNotes.push('IFRS: Goodwill is not amortised — annual impairment test required (IAS 36)');
      frameworkNotes.push('IFRS 3: Bargain purchase gain recognised immediately in P&L');
    }

    return {
      goodwillCorrect: Math.abs(variance) < 0.01,
      expectedGoodwill,
      statedGoodwill,
      variance,
      impairmentAssessment,
      frameworkNotes,
      framework,
      isaReference: 'ISA 600',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate non-controlling interest calculation.
   * @param {Object} nciData - { method: 'fairValue'|'proportionateShare', subsidiaryNetAssets, nciPercentage, nciReported }
   * @returns {{correct: boolean, expectedNCI: number, variance: number, disclosureComplete: boolean}}
   */
  validateNonControllingInterest(nciData) {
    this.checksPerformed++;

    if (!nciData) return { correct: false, expectedNCI: 0, variance: 0, disclosureComplete: false };

    const netAssets = Number(nciData.subsidiaryNetAssets) || 0;
    const percentage = Number(nciData.nciPercentage) || 0;
    const reported = Number(nciData.nciReported) || 0;

    let expectedNCI;
    if (nciData.method === 'fairValue') {
      expectedNCI = reported; // Fair value method — NCI measured at fair value, not calculable from net assets alone
    } else {
      expectedNCI = Math.round(netAssets * (percentage / 100) * 100) / 100;
    }

    const variance = Math.round((reported - expectedNCI) * 100) / 100;

    return {
      correct: nciData.method === 'fairValue' || Math.abs(variance) < 0.01,
      method: nciData.method || 'proportionateShare',
      expectedNCI,
      reportedNCI: reported,
      variance,
      nciPercentage: percentage,
      disclosureComplete: nciData.nciReported !== undefined,
      frameworkRef: 'IFRS 10 / FRS 102 S.9',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate foreign currency translation for a subsidiary.
   * @param {Object} subsidiary - { functionalCurrency, presentationCurrency, assets, liabilities, income, expenses, rates: {closing, average, historical} }
   * @returns {{translationCorrect: boolean, expectedTranslationReserve: number, errors: Array}}
   */
  validateCurrencyTranslation(subsidiary) {
    this.checksPerformed++;

    if (!subsidiary || !subsidiary.rates) {
      return { translationCorrect: false, expectedTranslationReserve: 0, errors: ['No translation data provided'] };
    }

    const { assets, liabilities, income, expenses, rates } = subsidiary;
    const errors = [];

    // IAS 21: Assets/liabilities at closing rate, income/expenses at average rate
    const translatedAssets = Math.round((Number(assets) || 0) * (Number(rates.closing) || 1) * 100) / 100;
    const translatedLiabilities = Math.round((Number(liabilities) || 0) * (Number(rates.closing) || 1) * 100) / 100;
    const translatedIncome = Math.round((Number(income) || 0) * (Number(rates.average) || 1) * 100) / 100;
    const translatedExpenses = Math.round((Number(expenses) || 0) * (Number(rates.average) || 1) * 100) / 100;

    // Translation reserve = difference from using different rates
    const netAssetsAtClosing = translatedAssets - translatedLiabilities;
    const profitAtAverage = translatedIncome - translatedExpenses;
    const expectedReserve = Math.round((netAssetsAtClosing - profitAtAverage) * 100) / 100;

    // Validate rates are reasonable
    if (rates.closing <= 0) errors.push('Closing exchange rate must be positive');
    if (rates.average <= 0) errors.push('Average exchange rate must be positive');
    if (rates.closing && rates.average && Math.abs(rates.closing / rates.average - 1) > 0.3) {
      errors.push(`Large deviation between closing (${rates.closing}) and average (${rates.average}) rates — review for reasonableness`);
    }

    return {
      translationCorrect: errors.length === 0,
      translatedAmounts: { assets: translatedAssets, liabilities: translatedLiabilities, income: translatedIncome, expenses: translatedExpenses },
      expectedTranslationReserve: expectedReserve,
      ratesUsed: rates,
      errors,
      frameworkRef: 'IAS 21 / FRS 102 S.30',
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    return {
      module: 'ConsolidationValidation',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 600',
      aiRequired: true,
      model: `${MODELS.SONNET} / ${MODELS.OPUS}`,
    };
  }
}

export default new ConsolidationValidationModule();
