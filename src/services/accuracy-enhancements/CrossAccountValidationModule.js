/**
 * CROSS-ACCOUNT VALIDATION MODULE (ISA 520)
 * Hybrid: computational core + AI for anomaly interpretation.
 * Validates inter-account relationships, ratio consistency,
 * balance sheet equation, and common-size analysis.
 */

import claudeClient, { MODELS } from '../claudeClient.js';

export class CrossAccountValidationModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Validate inter-account relationships (e.g., depreciation vs. asset balances).
   * @param {Array<{account: string, balance: number, category: string, priorBalance?: number}>} accounts
   * @returns {{relationships: Array, alerts: Array}}
   */
  validateInterAccountRelationships(accounts) {
    this.checksPerformed++;

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return { relationships: [], alerts: [] };
    }

    const byCategory = {};
    for (const acct of accounts) {
      const cat = acct.category || 'uncategorized';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(acct);
    }

    const relationships = [];
    const alerts = [];

    // Check: Total Assets = Total Liabilities + Equity (if categories exist)
    const assets = (byCategory['assets'] || []).reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const liabilities = (byCategory['liabilities'] || []).reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const equity = (byCategory['equity'] || []).reduce((s, a) => s + (Number(a.balance) || 0), 0);

    if (assets > 0 || liabilities > 0 || equity > 0) {
      const diff = Math.round((assets - liabilities - equity) * 100) / 100;
      relationships.push({
        type: 'balance_sheet_equation',
        description: 'Assets = Liabilities + Equity',
        assets: Math.round(assets * 100) / 100,
        liabilities: Math.round(liabilities * 100) / 100,
        equity: Math.round(equity * 100) / 100,
        difference: diff,
        valid: Math.abs(diff) < 1,
      });
      if (Math.abs(diff) >= 1) {
        alerts.push({
          type: 'equation_imbalance',
          severity: Math.abs(diff) > 1000 ? 'HIGH' : 'MEDIUM',
          message: `Balance sheet imbalance of ${diff}`,
          isaReference: 'ISA 520',
        });
      }
    }

    // Check: Prior year comparisons — flag significant movements
    for (const acct of accounts) {
      if (acct.priorBalance !== undefined && acct.priorBalance !== null) {
        const prior = Number(acct.priorBalance) || 0;
        const current = Number(acct.balance) || 0;
        const change = current - prior;
        const percentChange = prior !== 0 ? Math.round((change / Math.abs(prior)) * 10000) / 100 : null;

        if (percentChange !== null && Math.abs(percentChange) > 25) {
          relationships.push({
            type: 'significant_movement',
            account: acct.account,
            currentBalance: current,
            priorBalance: prior,
            change: Math.round(change * 100) / 100,
            percentChange,
          });

          if (Math.abs(percentChange) > 50) {
            alerts.push({
              type: 'large_movement',
              severity: 'HIGH',
              account: acct.account,
              percentChange,
              message: `${acct.account} moved ${percentChange}% year-on-year`,
              isaReference: 'ISA 520.A7',
            });
          }
        }
      }
    }

    return {
      relationships,
      alerts,
      accountsAnalyzed: accounts.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verify ratio consistency between current and prior year.
   * @param {Object} current - { revenue, cogs, grossProfit, netIncome, totalAssets, totalLiabilities, equity, currentAssets, currentLiabilities }
   * @param {Object} prior - Same structure for prior year
   * @param {number} [materialityThreshold=0.1] - Ratio deviation threshold (10% default)
   * @returns {{consistent: boolean, deviations: Array}}
   */
  verifyRatioConsistency(current, prior, materialityThreshold = 0.1) {
    this.checksPerformed++;

    if (!current || !prior) {
      return { consistent: true, deviations: [] };
    }

    const ratios = [
      { name: 'Gross Margin', calc: d => d.revenue ? (d.grossProfit || (d.revenue - (d.cogs || 0))) / d.revenue : null },
      { name: 'Net Margin', calc: d => d.revenue ? d.netIncome / d.revenue : null },
      { name: 'Current Ratio', calc: d => d.currentLiabilities ? d.currentAssets / d.currentLiabilities : null },
      { name: 'Debt to Equity', calc: d => d.equity ? d.totalLiabilities / d.equity : null },
      { name: 'Asset Turnover', calc: d => d.totalAssets ? d.revenue / d.totalAssets : null },
      { name: 'Return on Assets', calc: d => d.totalAssets ? d.netIncome / d.totalAssets : null },
    ];

    const deviations = [];

    for (const ratio of ratios) {
      const currentVal = ratio.calc(current);
      const priorVal = ratio.calc(prior);

      if (currentVal === null || priorVal === null) continue;

      const deviation = priorVal !== 0 ? Math.abs((currentVal - priorVal) / priorVal) : 0;

      if (deviation > materialityThreshold) {
        deviations.push({
          ratio: ratio.name,
          currentValue: Math.round(currentVal * 10000) / 10000,
          priorValue: Math.round(priorVal * 10000) / 10000,
          deviation: Math.round(deviation * 10000) / 100,
          exceedsMateriality: true,
          isaReference: 'ISA 520',
        });
      }
    }

    return {
      consistent: deviations.length === 0,
      deviations,
      ratiosChecked: ratios.length,
      materialityThreshold: materialityThreshold * 100 + '%',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Perform common-size analysis (express all items as % of a basis).
   * @param {Array<{account: string, balance: number}>} data
   * @param {string} basis - 'revenue' or 'totalAssets' or a numeric value
   * @returns {{commonSize: Array}}
   */
  performCommonSizeAnalysis(data, basis) {
    this.checksPerformed++;

    if (!Array.isArray(data) || data.length === 0) {
      return { commonSize: [] };
    }

    let basisAmount;
    if (typeof basis === 'number') {
      basisAmount = basis;
    } else {
      const basisEntry = data.find(d => d.account?.toLowerCase() === basis?.toLowerCase());
      basisAmount = basisEntry ? Number(basisEntry.balance) : null;
    }

    if (!basisAmount || basisAmount === 0) {
      return { commonSize: data.map(d => ({ ...d, percentage: null })), basis, error: 'Basis amount is zero or not found' };
    }

    const commonSize = data.map(d => ({
      account: d.account,
      balance: Number(d.balance) || 0,
      percentage: Math.round(((Number(d.balance) || 0) / basisAmount) * 10000) / 100,
    }));

    return {
      commonSize,
      basis,
      basisAmount,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate the balance sheet equation: Assets = Liabilities + Equity.
   * @param {{assets: number, liabilities: number, equity: number}} data
   * @returns {{balanced: boolean, assets: number, liabilities: number, equity: number, difference: number}}
   */
  validateBalanceSheetEquation(data) {
    this.checksPerformed++;

    const assets = Math.round((Number(data?.assets) || 0) * 100) / 100;
    const liabilities = Math.round((Number(data?.liabilities) || 0) * 100) / 100;
    const equity = Math.round((Number(data?.equity) || 0) * 100) / 100;
    const difference = Math.round((assets - liabilities - equity) * 100) / 100;

    return {
      balanced: Math.abs(difference) < 0.01,
      assets,
      liabilities,
      equity,
      difference,
      equation: `${assets} = ${liabilities} + ${equity}`,
      isaReference: 'ISA 520',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Use AI to interpret anomalies in analytical procedures (ISA 520).
   * @param {Array<Object>} anomalies - Detected anomalies from other methods
   * @param {Object} ctx - Engagement context (industry, entity type, etc.)
   * @returns {Promise<{interpretations: Array}>}
   */
  async interpretAnomalies(anomalies, ctx = {}) {
    this.checksPerformed++;

    if (!Array.isArray(anomalies) || anomalies.length === 0) {
      return { interpretations: [] };
    }

    const prompt = `You are an experienced auditor performing analytical procedures under ISA 520.

Context:
- Industry: ${ctx.industry || 'Not specified'}
- Entity type: ${ctx.entityType || 'Not specified'}
- Period: ${ctx.period || 'Current year'}
- Materiality: ${ctx.materiality || 'Not specified'}

The following anomalies were detected during cross-account validation:
${JSON.stringify(anomalies, null, 2)}

For each anomaly, provide:
1. Likely explanation (business reason or potential misstatement)
2. Risk level (HIGH/MEDIUM/LOW)
3. Recommended follow-up procedures (ISA reference)
4. Whether further investigation is required

Return JSON: {
  "interpretations": [
    {
      "anomaly": "<description>",
      "explanation": "<likely cause>",
      "riskLevel": "HIGH|MEDIUM|LOW",
      "followUpProcedures": ["<procedure>"],
      "requiresInvestigation": true|false,
      "isaReference": "ISA XXX"
    }
  ]
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 2048,
      thinking: false,
      system: 'You are an ISA 520 analytical procedures specialist. Return valid JSON only.',
    });

    return this.claude.parseJSON(text);
  }

  getMetrics() {
    return {
      module: 'CrossAccountValidation',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      isaReference: 'ISA 520',
      aiRequired: true,
      model: MODELS.SONNET,
    };
  }
}

export default new CrossAccountValidationModule();
