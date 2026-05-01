// ═══════════════════════════════════════════════════════════════
// Capital Gearing Agent — Capital Structure & WACC Analysis
// ═══════════════════════════════════════════════════════════════

const UK_RISK_FREE_RATE = 0.04;      // 10-year gilt ~4.0%
const UK_EQUITY_RISK_PREMIUM = 0.055; // UK ERP ~5.5%
const DEFAULT_BETA = 1.0;
const DEFAULT_TAX_RATE = 0.25;       // UK Corporation Tax 25%

export const capitalGearingAgent = {
  id: 'capital_gearing',
  name: 'Capital Gearing Agent',
  description: 'Analyses capital structure, gearing ratios, WACC, covenant compliance, and leverage trends vs industry benchmarks.',
  category: 'financial_analysis',
  isaReferences: ['ISA 570', 'ISA 315', 'IFRS 9', 'IAS 32'],

  analyze(financials, context = {}) {
    const f = financials || {};
    const ctx = context || {};
    const results = {
      ratios: {},
      wacc: {},
      covenantCompliance: {},
      leverageTrend: {},
      industryComparison: {},
      overallStatus: 'GREEN',
      warnings: [],
    };

    const totalDebt = f.totalDebt || f.totalBorrowings || 0;
    const equity = f.shareholdersEquity || f.bookValueEquity || 0;
    const totalAssets = f.totalAssets || 0;
    const ebit = f.ebit || f.operatingProfit || 0;
    const interestExpense = f.interestExpense || 0;
    const ebitda = f.ebitda || (ebit + (f.depreciation || 0) + (f.amortisation || 0));
    const netDebt = totalDebt - (f.cashAndEquivalents || f.cash || 0);

    // ─── 1. GEARING RATIOS ──────────────────────────────────────────

    // Debt-to-equity
    const debtToEquity = equity !== 0 ? totalDebt / equity : null;
    let dteStatus = 'GREEN';
    if (debtToEquity !== null) {
      if (debtToEquity > 2.0) dteStatus = 'RED';
      else if (debtToEquity >= 1.0) dteStatus = 'AMBER';
    }
    results.ratios.debtToEquity = { value: _round(debtToEquity, 2), status: dteStatus };

    // Debt-to-assets
    const debtToAssets = totalAssets > 0 ? totalDebt / totalAssets : null;
    let dtaStatus = 'GREEN';
    if (debtToAssets !== null) {
      if (debtToAssets > 0.6) dtaStatus = 'RED';
      else if (debtToAssets >= 0.4) dtaStatus = 'AMBER';
    }
    results.ratios.debtToAssets = { value: _round(debtToAssets, 3), status: dtaStatus };

    // Interest cover
    const interestCover = interestExpense > 0 ? ebit / interestExpense : null;
    let icStatus = 'GREEN';
    if (interestCover !== null) {
      if (interestCover < 2.0) icStatus = 'RED';
      else if (interestCover < 3.0) icStatus = 'AMBER';
    }
    results.ratios.interestCover = { value: _round(interestCover, 2), status: icStatus };

    // Net debt / EBITDA
    const netDebtToEbitda = ebitda > 0 ? netDebt / ebitda : null;
    let ndEbitdaStatus = 'GREEN';
    if (netDebtToEbitda !== null) {
      if (netDebtToEbitda > 4.0) ndEbitdaStatus = 'RED';
      else if (netDebtToEbitda >= 2.0) ndEbitdaStatus = 'AMBER';
    }
    results.ratios.netDebtToEbitda = { value: _round(netDebtToEbitda, 2), status: ndEbitdaStatus };
    results.ratios.netDebt = { value: _round(netDebt, 0) };

    // ─── 2. WACC ESTIMATION ─────────────────────────────────────────
    const beta = ctx.equityBeta || DEFAULT_BETA;
    const rf = ctx.riskFreeRate || UK_RISK_FREE_RATE;
    const erp = ctx.equityRiskPremium || UK_EQUITY_RISK_PREMIUM;
    const taxRate = ctx.taxRate || DEFAULT_TAX_RATE;

    const costOfEquity = rf + beta * erp;

    const costOfDebt = totalDebt > 0 ? interestExpense / totalDebt : 0;

    const totalCapital = equity + totalDebt;
    const weightEquity = totalCapital > 0 ? equity / totalCapital : 0.5;
    const weightDebt = totalCapital > 0 ? totalDebt / totalCapital : 0.5;

    const wacc = (weightEquity * costOfEquity) + (weightDebt * costOfDebt * (1 - taxRate));

    results.wacc = {
      costOfEquity: _round(costOfEquity * 100, 2),
      costOfDebtPreTax: _round(costOfDebt * 100, 2),
      costOfDebtPostTax: _round(costOfDebt * (1 - taxRate) * 100, 2),
      weightEquity: _round(weightEquity * 100, 1),
      weightDebt: _round(weightDebt * 100, 1),
      wacc: _round(wacc * 100, 2),
      inputs: {
        beta,
        riskFreeRate: _round(rf * 100, 2),
        equityRiskPremium: _round(erp * 100, 2),
        taxRate: _round(taxRate * 100, 1),
      },
      note: 'CAPM used for cost of equity. Effective interest rate used for cost of debt.',
    };

    // ─── 3. COVENANT COMPLIANCE ─────────────────────────────────────
    const covenants = ctx.covenants || f.covenants || {};
    const covenantResults = {};

    const covenantChecks = [
      { key: 'netDebtEbitda', label: 'Net Debt / EBITDA', actual: netDebtToEbitda, threshold: covenants.maxNetDebtEbitda, type: 'max' },
      { key: 'interestCover', label: 'Interest Cover', actual: interestCover, threshold: covenants.minInterestCover, type: 'min' },
      { key: 'currentRatio', label: 'Current Ratio', actual: (f.currentAssets || 0) / (f.currentLiabilities || 1), threshold: covenants.minCurrentRatio, type: 'min' },
    ];

    covenantChecks.forEach(check => {
      if (check.threshold !== undefined && check.threshold !== null && check.actual !== null) {
        const headroom = check.type === 'max'
          ? ((check.threshold - check.actual) / check.threshold) * 100
          : ((check.actual - check.threshold) / check.threshold) * 100;

        let status = 'GREEN';
        if (headroom < 0) status = 'RED';
        else if (headroom < 5) status = 'RED';
        else if (headroom < 20) status = 'AMBER';

        covenantResults[check.key] = {
          label: check.label,
          actual: _round(check.actual, 2),
          threshold: check.threshold,
          headroomPct: _round(headroom, 1),
          status,
          breached: headroom < 0,
        };

        if (headroom < 0) {
          results.warnings.push(`COVENANT BREACH: ${check.label} — actual ${_round(check.actual, 2)}, covenant threshold ${check.threshold}`);
        } else if (headroom < 20) {
          results.warnings.push(`Covenant headroom warning: ${check.label} — only ${_round(headroom, 1)}% headroom to breach`);
        }
      }
    });
    results.covenantCompliance = covenantResults;

    // ─── 4. LEVERAGE TREND ──────────────────────────────────────────
    const historicalDte = f.historicalDebtToEquity || [];
    results.leverageTrend = _assessLeverageTrend(historicalDte, debtToEquity);

    // ─── 5. INDUSTRY PEER COMPARISON ────────────────────────────────
    const industryBenchmarks = ctx.industryBenchmarks || _getDefaultBenchmarks(ctx.industry || f.industry);
    results.industryComparison = {
      debtToEquity: _compareToBenchmark(debtToEquity, industryBenchmarks.debtToEquity, 'lower_better'),
      debtToAssets: _compareToBenchmark(debtToAssets, industryBenchmarks.debtToAssets, 'lower_better'),
      interestCover: _compareToBenchmark(interestCover, industryBenchmarks.interestCover, 'higher_better'),
      netDebtToEbitda: _compareToBenchmark(netDebtToEbitda, industryBenchmarks.netDebtToEbitda, 'lower_better'),
      benchmarkSource: industryBenchmarks.source || 'UK industry median (hardcoded)',
    };

    // ─── 6. OVERALL STATUS ──────────────────────────────────────────
    const allStatuses = [dteStatus, dtaStatus, icStatus, ndEbitdaStatus];
    const hasBreachedCovenant = Object.values(covenantResults).some(c => c.breached);
    if (allStatuses.includes('RED') || hasBreachedCovenant) results.overallStatus = 'RED';
    else if (allStatuses.includes('AMBER')) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const ratios = r.ratios || {};
    const wacc = r.wacc || {};
    const covenants = r.covenantCompliance || {};
    const status = r.overallStatus || 'GREEN';

    const lines = [
      `CAPITAL STRUCTURE & GEARING ANALYSIS`,
      `Overall Status: [${status}]`,
      '',
      'GEARING RATIOS:',
      `  • Debt-to-equity: ${ratios.debtToEquity?.value ?? 'N/A'}x [${ratios.debtToEquity?.status}]`,
      `  • Debt-to-assets: ${ratios.debtToAssets?.value ?? 'N/A'} [${ratios.debtToAssets?.status}]`,
      `  • Interest cover: ${ratios.interestCover?.value ?? 'N/A'}x [${ratios.interestCover?.status}]`,
      `  • Net debt / EBITDA: ${ratios.netDebtToEbitda?.value ?? 'N/A'}x [${ratios.netDebtToEbitda?.status}]`,
      `  • Net debt: £${(ratios.netDebt?.value || 0).toLocaleString()}`,
      '',
      'WACC ESTIMATION (CAPM):',
      `  • Cost of equity (CAPM): ${wacc.costOfEquity}% (Rf=${wacc.inputs?.riskFreeRate}%, β=${wacc.inputs?.beta}, ERP=${wacc.inputs?.equityRiskPremium}%)`,
      `  • Cost of debt (effective, post-tax): ${wacc.costOfDebtPostTax}%`,
      `  • Capital structure: ${wacc.weightEquity}% equity / ${wacc.weightDebt}% debt`,
      `  • WACC: ${wacc.wacc}%`,
    ];

    if (Object.keys(covenants).length > 0) {
      lines.push('', 'COVENANT COMPLIANCE:');
      Object.values(covenants).forEach(c => {
        lines.push(`  • ${c.label}: actual ${c.actual}, threshold ${c.threshold}, headroom ${c.headroomPct}% [${c.status}]${c.breached ? ' *** BREACH ***' : ''}`);
      });
    }

    if (r.leverageTrend?.direction) {
      lines.push('', `LEVERAGE TREND (3-year): ${r.leverageTrend.direction} [${r.leverageTrend.status}]`);
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 570, ISA 315`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['loans_borrowings', 'cash_bank', 'equity'];
    const r = results || {};

    if (r.overallStatus === 'RED') sections.push('going_concern', 'audit_differences');
    if (Object.values(r.covenantCompliance || {}).some(c => c.breached)) {
      sections.push('going_concern', 'provisions');
    }

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Capital Structure & Gearing',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Gearing Ratios',
          columns: ['Ratio', 'Value', 'Thresholds', 'Status'],
          rows: [
            ['Debt-to-Equity', r.ratios?.debtToEquity?.value, '<1.0 GREEN / 1.0-2.0 AMBER / >2.0 RED', r.ratios?.debtToEquity?.status],
            ['Debt-to-Assets', r.ratios?.debtToAssets?.value, '<0.4 GREEN / 0.4-0.6 AMBER / >0.6 RED', r.ratios?.debtToAssets?.status],
            ['Interest Cover', r.ratios?.interestCover?.value, '>3.0 GREEN / 2.0-3.0 AMBER / <2.0 RED', r.ratios?.interestCover?.status],
            ['Net Debt / EBITDA', r.ratios?.netDebtToEbitda?.value, '<2.0 GREEN / 2.0-4.0 AMBER / >4.0 RED', r.ratios?.netDebtToEbitda?.status],
            ['Net Debt (£)', r.ratios?.netDebt?.value, '', ''],
          ],
        },
        {
          title: 'WACC Estimation',
          columns: ['Component', 'Value'],
          rows: [
            ['Cost of Equity (CAPM)', `${r.wacc?.costOfEquity}%`],
            ['Cost of Debt (pre-tax)', `${r.wacc?.costOfDebtPreTax}%`],
            ['Cost of Debt (post-tax)', `${r.wacc?.costOfDebtPostTax}%`],
            ['Weight of Equity', `${r.wacc?.weightEquity}%`],
            ['Weight of Debt', `${r.wacc?.weightDebt}%`],
            ['WACC', `${r.wacc?.wacc}%`],
          ],
        },
        {
          title: 'Covenant Compliance',
          columns: ['Covenant', 'Actual', 'Threshold', 'Headroom %', 'Status'],
          rows: Object.values(r.covenantCompliance || {}).map(c => [c.label, c.actual, c.threshold, `${c.headroomPct}%`, c.status]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

// ─── Helpers ────────────────────────────────────────────────────
function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}

function _assessLeverageTrend(historicalDte, currentDte) {
  const series = [...(historicalDte || []), currentDte].filter(v => v !== null && v !== undefined);
  if (series.length < 2) return { status: 'GREEN', direction: 'Insufficient historical data' };
  const first = series[0];
  const last = series[series.length - 1];
  const change = last - first;
  if (change > 1.0) return { status: 'RED', direction: 'Critical — leverage increasing rapidly' };
  if (change > 0.3) return { status: 'AMBER', direction: 'Deteriorating — leverage increasing' };
  if (change < -0.3) return { status: 'GREEN', direction: 'Improving — leverage decreasing' };
  return { status: 'GREEN', direction: 'Stable' };
}

function _getDefaultBenchmarks(industry) {
  const benchmarks = {
    manufacturing: { debtToEquity: 0.8, debtToAssets: 0.45, interestCover: 5.0, netDebtToEbitda: 2.0, source: 'UK Manufacturing median' },
    retail: { debtToEquity: 1.2, debtToAssets: 0.55, interestCover: 4.0, netDebtToEbitda: 2.5, source: 'UK Retail median' },
    technology: { debtToEquity: 0.4, debtToAssets: 0.30, interestCover: 10.0, netDebtToEbitda: 1.0, source: 'UK Technology median' },
    construction: { debtToEquity: 1.0, debtToAssets: 0.50, interestCover: 4.5, netDebtToEbitda: 1.8, source: 'UK Construction median' },
    default: { debtToEquity: 0.8, debtToAssets: 0.45, interestCover: 5.0, netDebtToEbitda: 2.0, source: 'UK cross-sector median' },
  };
  return benchmarks[industry] || benchmarks.default;
}

function _compareToBenchmark(actual, benchmark, direction) {
  if (actual === null || actual === undefined || benchmark === undefined) return { status: 'N/A', vs: 'No benchmark available' };
  const diff = ((actual - benchmark) / benchmark) * 100;
  const betterIfLower = direction === 'lower_better';
  const betterThanBenchmark = betterIfLower ? actual < benchmark : actual > benchmark;
  const significantlyWorse = betterIfLower ? diff > 30 : diff < -30;
  const slightlyWorse = betterIfLower ? diff > 10 : diff < -10;
  let status = 'GREEN';
  if (significantlyWorse) status = 'RED';
  else if (slightlyWorse) status = 'AMBER';
  return {
    actual: _round(actual, 2),
    benchmark: _round(benchmark, 2),
    differenceVsBenchmarkPct: _round(diff, 1),
    status,
    vs: betterThanBenchmark ? 'Better than benchmark' : 'Worse than benchmark',
  };
}
