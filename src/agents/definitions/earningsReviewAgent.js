// ═══════════════════════════════════════════════════════════════
// Earnings Review Agent — Analytical Procedures (ISA 520)
// Inspired by Anthropic Financial Services Earnings Reviewer plugin
// ═══════════════════════════════════════════════════════════════

import { generateAINarrative } from './financeAgentUtils.js';

const RATIO_THRESHOLDS = {
  grossMargin: { low: -5, high: 5 },      // ±5pp change triggers investigation
  operatingMargin: { low: -5, high: 5 },
  currentRatio: { low: -0.3, high: 0.3 },
  quickRatio: { low: -0.3, high: 0.3 },
  debtorDays: { low: -15, high: 15 },
  creditorDays: { low: -15, high: 15 },
  stockDays: { low: -15, high: 15 },
  gearing: { low: -10, high: 10 },
};

export const earningsReviewAgent = {
  id: 'earnings_review',
  name: 'Earnings Review Agent',
  description: 'Performs ISA 520 analytical procedures on financial data: ratio analysis, trend analysis, earnings quality indicators, and expectation-based comparisons. Flags anomalies for substantive follow-up.',
  category: 'finance_ops',
  wpScope: ['a4', 'a5', 'b1', 'c1'],
  isaReferences: ['ISA 520', 'ISA 315', 'ISA 330', 'ISA 240'],

  async runWithAI(financials, priorYear, context) {
    const results = this.analyze(financials, priorYear, context);
    results.aiNarrative = await generateAINarrative(this, results, context);
    return results;
  },

  analyze(financials, priorYear, context = {}) {
    const cy = financials || {};
    const py = priorYear || {};
    const ctx = context || {};
    const materiality = ctx.performanceMateriality || ctx.materiality || 0;

    const results = {
      ratios: { current: {}, prior: {}, movements: {} },
      trendAnalysis: [],
      earningsQuality: [],
      expectationComparisons: [],
      anomalies: [],
      overallStatus: 'GREEN',
      warnings: [],
      analysisDate: new Date().toISOString().split('T')[0],
    };

    // 1. Calculate ratios (current and prior year)
    results.ratios.current = _calculateRatios(cy);
    results.ratios.prior = _calculateRatios(py);
    results.ratios.movements = _calculateMovements(results.ratios.current, results.ratios.prior);

    // 2. Flag ratio anomalies
    _flagRatioAnomalies(results);

    // 3. Earnings quality indicators
    _assessEarningsQuality(cy, py, results);

    // 4. Expectation-based comparisons
    _runExpectationComparisons(cy, py, results, materiality, ctx);

    // 5. Trend analysis (if multi-year data available)
    if (ctx.historicalData) {
      _runTrendAnalysis(cy, ctx.historicalData, results);
    }

    // Overall
    const highRiskAnomalies = results.anomalies.filter(a => a.risk === 'HIGH');
    if (highRiskAnomalies.length > 0) {
      results.overallStatus = 'RED';
      results.warnings.push(`${highRiskAnomalies.length} high-risk anomaly(ies) — extended substantive procedures required.`);
    } else if (results.anomalies.length > 0) {
      results.overallStatus = 'AMBER';
      results.warnings.push(`${results.anomalies.length} anomaly(ies) identified for investigation.`);
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const cur = r.ratios?.current || {};
    const pri = r.ratios?.prior || {};
    const mov = r.ratios?.movements || {};
    const lines = [
      'EARNINGS REVIEW — ANALYTICAL PROCEDURES (ISA 520)',
      `Overall Status: [${r.overallStatus}]`,
      `Analysis Date: ${r.analysisDate}`,
      '',
      'KEY RATIOS:',
      `  Gross Margin:     CY ${_fmt(cur.grossMargin)}%  PY ${_fmt(pri.grossMargin)}%  Mvt ${_fmt(mov.grossMargin)}pp`,
      `  Operating Margin: CY ${_fmt(cur.operatingMargin)}%  PY ${_fmt(pri.operatingMargin)}%  Mvt ${_fmt(mov.operatingMargin)}pp`,
      `  Current Ratio:    CY ${_fmt(cur.currentRatio)}x  PY ${_fmt(pri.currentRatio)}x  Mvt ${_fmt(mov.currentRatio)}`,
      `  Quick Ratio:      CY ${_fmt(cur.quickRatio)}x  PY ${_fmt(pri.quickRatio)}x  Mvt ${_fmt(mov.quickRatio)}`,
      `  Debtor Days:      CY ${_fmt(cur.debtorDays)}  PY ${_fmt(pri.debtorDays)}  Mvt ${_fmt(mov.debtorDays)}`,
      `  Creditor Days:    CY ${_fmt(cur.creditorDays)}  PY ${_fmt(pri.creditorDays)}  Mvt ${_fmt(mov.creditorDays)}`,
      `  Stock Days:       CY ${_fmt(cur.stockDays)}  PY ${_fmt(pri.stockDays)}  Mvt ${_fmt(mov.stockDays)}`,
      `  Gearing:          CY ${_fmt(cur.gearing)}%  PY ${_fmt(pri.gearing)}%  Mvt ${_fmt(mov.gearing)}pp`,
      '',
    ];

    if ((r.anomalies || []).length > 0) {
      lines.push('ANOMALIES:');
      r.anomalies.forEach(a => lines.push(`  [${a.risk}] ${a.ratio || a.indicator}: ${a.description}`));
      lines.push('');
    }

    if ((r.earningsQuality || []).length > 0) {
      lines.push('EARNINGS QUALITY INDICATORS:');
      r.earningsQuality.forEach(e => lines.push(`  [${e.status}] ${e.indicator}: ${e.description}`));
      lines.push('');
    }

    if ((r.expectationComparisons || []).length > 0) {
      const unexpected = r.expectationComparisons.filter(e => e.status === 'UNEXPECTED');
      if (unexpected.length > 0) {
        lines.push('UNEXPECTED RESULTS (ISA 520.7):');
        unexpected.forEach(e => lines.push(`  ${e.item}: Expected £${(e.expected || 0).toLocaleString()}, Actual £${(e.actual || 0).toLocaleString()} (Diff: £${(e.difference || 0).toLocaleString()})`));
        lines.push('');
      }
    }

    if ((r.warnings || []).length > 0) {
      lines.push('AUDIT ATTENTION POINTS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', 'ISA References: ISA 520, ISA 315, ISA 330, ISA 240');

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['analytical_procedures'];
    if ((results?.anomalies || []).filter(a => a.risk === 'HIGH').length > 0) sections.push('audit_differences', 'fraud_risk');
    const earningsIssues = (results?.earningsQuality || []).filter(e => e.status === 'RED');
    if (earningsIssues.length > 0) sections.push('going_concern', 'revenue');
    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    const cur = r.ratios?.current || {};
    const pri = r.ratios?.prior || {};
    const mov = r.ratios?.movements || {};
    const ratioNames = Object.keys(cur);

    return {
      sheetName: 'Earnings Review',
      isaReference: 'ISA 520',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Ratio Analysis',
          columns: ['Ratio', 'Current Year', 'Prior Year', 'Movement', 'Status'],
          rows: ratioNames.map(name => {
            const anomaly = (r.anomalies || []).find(a => a.ratio === name);
            return [name, cur[name], pri[name], mov[name], anomaly ? `[${anomaly.risk}]` : 'OK'];
          }),
        },
        {
          title: 'Anomalies',
          columns: ['Ratio/Indicator', 'Risk', 'Description'],
          rows: (r.anomalies || []).map(a => [a.ratio || a.indicator, a.risk, a.description]),
        },
        {
          title: 'Earnings Quality',
          columns: ['Indicator', 'Status', 'Description'],
          rows: (r.earningsQuality || []).map(e => [e.indicator, e.status, e.description]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

function _calculateRatios(fin) {
  const f = fin || {};
  const revenue = parseFloat(f.revenue || f.turnover || 0);
  const costOfSales = parseFloat(f.costOfSales || 0);
  const grossProfit = parseFloat(f.grossProfit || (revenue - costOfSales) || 0);
  const operatingProfit = parseFloat(f.operatingProfit || 0);
  const currentAssets = parseFloat(f.currentAssets || 0);
  const currentLiabilities = parseFloat(f.currentLiabilities || 0);
  const inventory = parseFloat(f.inventory || f.stock || 0);
  const tradeDebtors = parseFloat(f.tradeDebtors || f.receivables || 0);
  const tradeCreditors = parseFloat(f.tradeCreditors || f.payables || 0);
  const totalDebt = parseFloat(f.totalDebt || f.borrowings || 0);
  const totalEquity = parseFloat(f.totalEquity || f.netAssets || 0);
  const cashFromOps = parseFloat(f.cashFromOperations || f.operatingCashFlow || 0);
  const netProfit = parseFloat(f.netProfit || f.profitForYear || 0);

  return {
    grossMargin: revenue > 0 ? _round((grossProfit / revenue) * 100, 1) : null,
    operatingMargin: revenue > 0 ? _round((operatingProfit / revenue) * 100, 1) : null,
    currentRatio: currentLiabilities > 0 ? _round(currentAssets / currentLiabilities, 2) : null,
    quickRatio: currentLiabilities > 0 ? _round((currentAssets - inventory) / currentLiabilities, 2) : null,
    debtorDays: revenue > 0 ? _round((tradeDebtors / revenue) * 365, 0) : null,
    creditorDays: costOfSales > 0 ? _round((tradeCreditors / costOfSales) * 365, 0) : null,
    stockDays: costOfSales > 0 ? _round((inventory / costOfSales) * 365, 0) : null,
    gearing: totalEquity > 0 ? _round((totalDebt / totalEquity) * 100, 1) : null,
    returnOnEquity: totalEquity > 0 ? _round((netProfit / totalEquity) * 100, 1) : null,
    cashConversion: netProfit !== 0 ? _round((cashFromOps / netProfit) * 100, 1) : null,
  };
}

function _calculateMovements(current, prior) {
  const movements = {};
  Object.keys(current).forEach(key => {
    const c = current[key];
    const p = prior[key];
    movements[key] = (c !== null && p !== null) ? _round(c - p, 2) : null;
  });
  return movements;
}

function _flagRatioAnomalies(results) {
  const mov = results.ratios.movements || {};

  Object.entries(RATIO_THRESHOLDS).forEach(([ratio, thresholds]) => {
    const movement = mov[ratio];
    if (movement === null || movement === undefined) return;

    if (movement < thresholds.low || movement > thresholds.high) {
      const risk = Math.abs(movement) > Math.abs(thresholds.high) * 2 ? 'HIGH' : 'MEDIUM';
      results.anomalies.push({
        ratio,
        movement,
        risk,
        description: `${ratio} moved ${movement > 0 ? '+' : ''}${movement} (threshold: ${thresholds.low} to ${thresholds.high}). Investigate cause and corroborate.`,
      });
    }
  });
}

function _assessEarningsQuality(cy, py, results) {
  const revenue = parseFloat(cy.revenue || cy.turnover || 0);
  const cashFromOps = parseFloat(cy.cashFromOperations || cy.operatingCashFlow || 0);
  const netProfit = parseFloat(cy.netProfit || cy.profitForYear || 0);
  const tradeDebtors = parseFloat(cy.tradeDebtors || cy.receivables || 0);
  const pyTradeDebtors = parseFloat(py.tradeDebtors || py.receivables || 0);
  const pyRevenue = parseFloat(py.revenue || py.turnover || 0);

  // Cash conversion quality
  if (netProfit > 0 && cashFromOps < netProfit * 0.5) {
    results.earningsQuality.push({
      indicator: 'Cash conversion',
      status: 'RED',
      description: `Operating cash flow (£${cashFromOps.toLocaleString()}) is less than 50% of net profit (£${netProfit.toLocaleString()}) — poor earnings quality, accrual-driven profit.`,
    });
  } else if (netProfit > 0 && cashFromOps >= netProfit * 0.8) {
    results.earningsQuality.push({
      indicator: 'Cash conversion',
      status: 'GREEN',
      description: `Strong cash conversion: ${_round((cashFromOps / netProfit) * 100, 0)}% of net profit backed by operating cash flow.`,
    });
  }

  // Revenue vs receivables growth divergence
  if (pyRevenue > 0 && pyTradeDebtors > 0) {
    const revenueGrowth = ((revenue - pyRevenue) / pyRevenue) * 100;
    const debtorGrowth = ((tradeDebtors - pyTradeDebtors) / pyTradeDebtors) * 100;
    if (debtorGrowth > revenueGrowth + 15) {
      results.earningsQuality.push({
        indicator: 'Revenue vs receivables',
        status: 'AMBER',
        description: `Receivables growing ${_round(debtorGrowth, 1)}% vs revenue ${_round(revenueGrowth, 1)}% — may indicate premature revenue recognition or collectibility issues (ISA 240).`,
      });
      results.anomalies.push({
        indicator: 'Revenue/Receivables divergence',
        risk: 'HIGH',
        description: `Receivables growth outpacing revenue by ${_round(debtorGrowth - revenueGrowth, 1)}pp — fraud risk indicator per ISA 240.`,
      });
    }
  }

  // Profit direction vs cash direction
  if (netProfit > 0 && cashFromOps < 0) {
    results.earningsQuality.push({
      indicator: 'Profit/Cash divergence',
      status: 'RED',
      description: 'Reporting profit but negative operating cash flow — significant earnings quality concern.',
    });
  }
}

function _runExpectationComparisons(cy, py, results, materiality, ctx) {
  const expectations = ctx.expectations || {};

  // Revenue expectation
  if (expectations.revenue) {
    const actual = parseFloat(cy.revenue || cy.turnover || 0);
    const expected = parseFloat(expectations.revenue);
    const diff = actual - expected;
    const status = Math.abs(diff) > materiality ? 'UNEXPECTED' : 'EXPECTED';
    results.expectationComparisons.push({ item: 'Revenue', expected, actual, difference: diff, status });
  }

  // Cost expectation based on PY + inflation
  const pyRevenue = parseFloat(py.revenue || py.turnover || 0);
  const cyRevenue = parseFloat(cy.revenue || cy.turnover || 0);
  if (pyRevenue > 0) {
    const pyAdminExpenses = parseFloat(py.adminExpenses || py.administrativeExpenses || 0);
    const inflationRate = ctx.inflationRate || 0.035;
    const expectedAdmin = pyAdminExpenses * (1 + inflationRate) * (cyRevenue / pyRevenue);
    const actualAdmin = parseFloat(cy.adminExpenses || cy.administrativeExpenses || 0);
    if (expectedAdmin > 0 && actualAdmin > 0) {
      const diff = actualAdmin - expectedAdmin;
      const status = Math.abs(diff) > materiality ? 'UNEXPECTED' : 'EXPECTED';
      results.expectationComparisons.push({ item: 'Administrative expenses', expected: _round(expectedAdmin, 0), actual: actualAdmin, difference: _round(diff, 0), status });
    }
  }
}

function _runTrendAnalysis(cy, historicalData, results) {
  const years = historicalData || [];
  if (years.length < 2) return;

  const revenueHistory = years.map(y => parseFloat(y.revenue || y.turnover || 0)).filter(v => v > 0);
  const cyRevenue = parseFloat(cy.revenue || cy.turnover || 0);

  if (revenueHistory.length >= 2) {
    const avgGrowth = revenueHistory.reduce((s, v, i) => {
      if (i === 0) return 0;
      return s + ((v - revenueHistory[i - 1]) / revenueHistory[i - 1]);
    }, 0) / (revenueHistory.length - 1);

    const expectedCY = revenueHistory[revenueHistory.length - 1] * (1 + avgGrowth);
    const deviation = ((cyRevenue - expectedCY) / expectedCY) * 100;

    results.trendAnalysis.push({
      metric: 'Revenue',
      historicalGrowthRate: _round(avgGrowth * 100, 1),
      expectedCurrentYear: _round(expectedCY, 0),
      actualCurrentYear: cyRevenue,
      deviationPct: _round(deviation, 1),
      note: Math.abs(deviation) > 15 ? 'Significant deviation from historical trend — investigate.' : 'Consistent with historical trend.',
    });
  }
}

function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}

function _fmt(val) {
  if (val === null || val === undefined) return 'N/A';
  return val.toLocaleString();
}
