// ═══════════════════════════════════════════════════════════════
// Investor Ratios Agent — Investor Returns & Shareholder Value
// ═══════════════════════════════════════════════════════════════

const DEFAULT_WACC = 0.10; // 10% default if not provided

export const investorRatiosAgent = {
  id: 'investor_ratios',
  name: 'Investor Ratios Agent',
  description: 'Analyses investor returns, earnings quality, EVA, and shareholder value metrics for ISA 315 risk assessment and analytical review.',
  category: 'financial_analysis',
  isaReferences: ['ISA 315', 'ISA 520', 'ISA 240', 'IAS 33'],

  analyze(financials, context = {}) {
    const f = financials || {};
    const ctx = context || {};
    const results = {
      returns: {},
      perShareMetrics: {},
      earningsQuality: {},
      shareholderValue: {},
      marketMultiples: {},
      overallStatus: 'GREEN',
      warnings: [],
    };

    const netIncome = f.netIncome || f.profitAfterTax || 0;
    const ebit = f.ebit || f.operatingProfit || 0;
    const revenue = f.revenue || f.turnover || 0;
    const equity = f.shareholdersEquity || f.bookValueEquity || 0;
    const priorEquity = f.priorYearEquity || equity;
    const avgEquity = (equity + priorEquity) / 2;
    const totalAssets = f.totalAssets || 0;
    const currentLiabilities = f.currentLiabilities || 0;
    const capitalEmployed = totalAssets - currentLiabilities;
    const ocf = f.operatingCashFlow || 0;
    const preferredDividends = f.preferredDividends || 0;
    const weightedAvgShares = f.weightedAvgShares || f.sharesInIssue || 0;
    const dilutedShares = f.dilutedWeightedAvgShares || weightedAvgShares;
    const dps = f.dividendsPerShare || 0;
    const sharePrice = f.sharePrice || ctx.sharePrice || 0;
    const marketCap = f.marketCap || (sharePrice * weightedAvgShares) || 0;
    const cashFromCustomers = f.cashReceivedFromCustomers || ocf;

    // ─── 1. RETURNS ─────────────────────────────────────────────────

    const roe = avgEquity !== 0 ? netIncome / avgEquity : null;
    const roce = capitalEmployed > 0 ? ebit / capitalEmployed : null;

    results.returns.roe = {
      value: _round(roe ? roe * 100 : null, 2),
      status: roe === null ? 'N/A' : roe > 0.15 ? 'GREEN' : roe > 0.08 ? 'AMBER' : 'RED',
      benchmark: ctx.industryROE ? `${(ctx.industryROE * 100).toFixed(1)}% (industry)` : 'Industry benchmark not provided',
    };
    results.returns.roce = {
      value: _round(roce ? roce * 100 : null, 2),
      status: roce === null ? 'N/A' : roce > 0.12 ? 'GREEN' : roce > 0.06 ? 'AMBER' : 'RED',
    };

    // ─── 2. PER SHARE METRICS ───────────────────────────────────────
    const eps = weightedAvgShares > 0 ? (netIncome - preferredDividends) / weightedAvgShares : null;
    const dilutedEps = dilutedShares > 0 ? (netIncome - preferredDividends) / dilutedShares : null;
    const dividendCover = dps > 0 && eps !== null ? eps / dps : null;
    const dividendYield = sharePrice > 0 && dps > 0 ? (dps / sharePrice) * 100 : null;
    const pe = eps && eps > 0 && sharePrice > 0 ? sharePrice / eps : null;
    const priceToBook = equity > 0 && marketCap > 0 ? marketCap / equity : null;
    const priceToSales = revenue > 0 && marketCap > 0 ? marketCap / revenue : null;

    results.perShareMetrics = {
      eps: { value: _round(eps, 4), currency: 'per share' },
      dilutedEps: { value: _round(dilutedEps, 4), currency: 'per share' },
      dps: { value: dps, currency: 'per share' },
      dividendCover: { value: _round(dividendCover, 2), status: dividendCover === null ? 'N/A' : dividendCover > 2 ? 'GREEN' : dividendCover > 1 ? 'AMBER' : 'RED' },
      dividendYield: { value: _round(dividendYield, 2), pct: true },
    };

    results.marketMultiples = {
      pe: { value: _round(pe, 1), note: sharePrice > 0 ? '' : 'Share price not available — not a listed entity or price not provided' },
      priceToBook: { value: _round(priceToBook, 2) },
      priceToSales: { value: _round(priceToSales, 2) },
      marketCap: { value: marketCap },
    };

    // ─── 3. EARNINGS QUALITY ────────────────────────────────────────

    // Accruals ratio = (Net Income - Operating CF) / Average Net Operating Assets
    const netOperatingAssets = capitalEmployed;
    const priorNOA = f.priorYearCapitalEmployed || netOperatingAssets;
    const avgNOA = (netOperatingAssets + priorNOA) / 2;
    const accrualsRatio = avgNOA !== 0 ? (netIncome - ocf) / avgNOA : null;

    let accrualsStatus = 'GREEN';
    let accrualsInterpretation = 'Earnings well-backed by cash (high quality)';
    if (accrualsRatio !== null) {
      if (accrualsRatio > 0.1) {
        accrualsStatus = 'RED';
        accrualsInterpretation = 'Earnings significantly not backed by cash — LOW quality indicator (ISA 240 fraud risk)';
        results.warnings.push('High accruals ratio — earnings quality concern per ISA 240. Investigate revenue recognition and expense timing.');
      } else if (accrualsRatio > 0) {
        accrualsStatus = 'AMBER';
        accrualsInterpretation = 'Moderate earnings quality — some accrual-based earnings';
      }
    }

    // Cash conversion
    const cashConversion = netIncome > 0 ? ocf / netIncome : null;
    const cashConversionStatus = cashConversion === null ? 'N/A' : cashConversion >= 0.8 ? 'GREEN' : cashConversion >= 0.5 ? 'AMBER' : 'RED';
    if (cashConversion !== null && cashConversion < 0.8) {
      results.warnings.push(`Cash conversion ratio of ${_round(cashConversion, 2)}x is below 0.8 threshold — earnings may not be converting to cash.`);
    }

    // Revenue recognition quality
    const revenueGrowthRate = f.priorRevenue && f.priorRevenue > 0 ? ((revenue - f.priorRevenue) / f.priorRevenue) * 100 : null;
    const cashRevenueGrowthRate = f.priorCashFromCustomers && f.priorCashFromCustomers > 0
      ? ((cashFromCustomers - f.priorCashFromCustomers) / f.priorCashFromCustomers) * 100
      : null;
    const revRecQualityGap = revenueGrowthRate !== null && cashRevenueGrowthRate !== null
      ? revenueGrowthRate - cashRevenueGrowthRate : null;

    let revRecStatus = 'GREEN';
    if (revRecQualityGap !== null && revRecQualityGap > 10) {
      revRecStatus = 'AMBER';
      results.warnings.push(`Revenue growth (${_round(revenueGrowthRate, 1)}%) significantly exceeds cash received from customers growth (${_round(cashRevenueGrowthRate, 1)}%) — revenue recognition quality risk.`);
    }

    // Operating leverage
    const priorEbit = f.priorEbit || f.priorOperatingProfit || ebit;
    const priorRevenue = f.priorRevenue || revenue;
    const revenueChange = priorRevenue > 0 ? (revenue - priorRevenue) / priorRevenue : 0;
    const ebitChange = priorEbit !== 0 ? (ebit - priorEbit) / Math.abs(priorEbit) : 0;
    const operatingLeverage = revenueChange !== 0 ? ebitChange / revenueChange : null;

    results.earningsQuality = {
      accrualsRatio: {
        value: _round(accrualsRatio, 3),
        status: accrualsStatus,
        interpretation: accrualsInterpretation,
      },
      cashConversion: {
        value: _round(cashConversion, 2),
        status: cashConversionStatus,
        threshold: 0.8,
      },
      revenueRecognitionQuality: {
        revenueGrowthPct: _round(revenueGrowthRate, 1),
        cashRevenueGrowthPct: _round(cashRevenueGrowthRate, 1),
        gapPct: _round(revRecQualityGap, 1),
        status: revRecStatus,
      },
      operatingLeverage: {
        value: _round(operatingLeverage, 2),
        interpretation: operatingLeverage !== null && operatingLeverage > 3
          ? 'High operating leverage — profits highly sensitive to revenue changes. Greater downside risk in economic downturn.'
          : 'Moderate operating leverage',
      },
    };

    // ─── 4. SHAREHOLDER VALUE — EVA ─────────────────────────────────
    const wacc = ctx.wacc || DEFAULT_WACC;
    const taxRate = ctx.taxRate || 0.25;
    const nopat = ebit * (1 - taxRate);
    const eva = nopat - (wacc * capitalEmployed);

    results.shareholderValue = {
      nopat: _round(nopat, 0),
      capitalEmployed: _round(capitalEmployed, 0),
      wacc: _round(wacc * 100, 2),
      eva: _round(eva, 0),
      evaStatus: eva > 0 ? 'GREEN' : 'RED',
      evaInterpretation: eva > 0
        ? 'Positive EVA — entity is creating shareholder value above its cost of capital.'
        : 'Negative EVA — entity is destroying shareholder value. Returns do not cover cost of capital.',
    };

    if (eva < 0) {
      results.warnings.push(`Negative EVA of £${Math.abs(_round(eva, 0)).toLocaleString()} — entity destroying value. WACC: ${_round(wacc * 100, 2)}%, Capital Employed: £${_round(capitalEmployed, 0).toLocaleString()}`);
    }

    // ─── 5. OVERALL STATUS ──────────────────────────────────────────
    const statusList = [
      results.returns.roe.status,
      results.earningsQuality.accrualsRatio.status,
      results.earningsQuality.cashConversion.status,
      results.shareholderValue.evaStatus,
    ].filter(s => s !== 'N/A');

    if (statusList.includes('RED')) results.overallStatus = 'RED';
    else if (statusList.includes('AMBER')) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      `INVESTOR RATIOS & EARNINGS QUALITY ANALYSIS`,
      `Overall Status: [${r.overallStatus}]`,
      '',
      'RETURNS:',
      `  • Return on Equity (ROE): ${r.returns?.roe?.value ?? 'N/A'}% [${r.returns?.roe?.status}]`,
      `  • Return on Capital Employed (ROCE): ${r.returns?.roce?.value ?? 'N/A'}% [${r.returns?.roce?.status}]`,
      '',
      'PER SHARE METRICS:',
      `  • EPS (basic): ${r.perShareMetrics?.eps?.value ?? 'N/A'} per share`,
      `  • EPS (diluted): ${r.perShareMetrics?.dilutedEps?.value ?? 'N/A'} per share`,
      `  • DPS: ${r.perShareMetrics?.dps?.value ?? 'N/A'} per share`,
      `  • Dividend cover: ${r.perShareMetrics?.dividendCover?.value ?? 'N/A'}x [${r.perShareMetrics?.dividendCover?.status}]`,
      `  • Dividend yield: ${r.perShareMetrics?.dividendYield?.value ?? 'N/A'}%`,
      '',
      'MARKET MULTIPLES:',
      `  • P/E ratio: ${r.marketMultiples?.pe?.value ?? 'N/A'}x`,
      `  • Price-to-book: ${r.marketMultiples?.priceToBook?.value ?? 'N/A'}x`,
      `  • Price-to-sales: ${r.marketMultiples?.priceToSales?.value ?? 'N/A'}x`,
      '',
      'EARNINGS QUALITY (ISA 240 indicators):',
      `  • Accruals ratio: ${r.earningsQuality?.accrualsRatio?.value ?? 'N/A'} [${r.earningsQuality?.accrualsRatio?.status}]`,
      `    ${r.earningsQuality?.accrualsRatio?.interpretation}`,
      `  • Cash conversion: ${r.earningsQuality?.cashConversion?.value ?? 'N/A'}x [${r.earningsQuality?.cashConversion?.status}] (threshold: ≥0.8)`,
      `  • Revenue recognition quality gap: ${r.earningsQuality?.revenueRecognitionQuality?.gapPct ?? 'N/A'}% [${r.earningsQuality?.revenueRecognitionQuality?.status}]`,
      `  • Operating leverage: ${r.earningsQuality?.operatingLeverage?.value ?? 'N/A'}x`,
      '',
      'ECONOMIC VALUE ADDED (EVA):',
      `  • NOPAT: £${(r.shareholderValue?.nopat || 0).toLocaleString()}`,
      `  • Capital Employed: £${(r.shareholderValue?.capitalEmployed || 0).toLocaleString()}`,
      `  • WACC: ${r.shareholderValue?.wacc}%`,
      `  • EVA: £${(r.shareholderValue?.eva || 0).toLocaleString()} [${r.shareholderValue?.evaStatus}]`,
      `  • ${r.shareholderValue?.evaInterpretation}`,
    ];

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 315, ISA 520, ISA 240, IAS 33`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['revenue', 'tax', 'provisions', 'related_parties'];
    const r = results || {};

    if (r.earningsQuality?.accrualsRatio?.status === 'RED') {
      sections.push('audit_differences', 'trade_debtors');
    }
    if (r.shareholderValue?.evaStatus === 'RED') {
      sections.push('going_concern', 'ppe', 'intangibles');
    }

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Investor Ratios',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Returns',
          columns: ['Metric', 'Value', 'Status'],
          rows: [
            ['ROE', `${r.returns?.roe?.value ?? 'N/A'}%`, r.returns?.roe?.status],
            ['ROCE', `${r.returns?.roce?.value ?? 'N/A'}%`, r.returns?.roce?.status],
          ],
        },
        {
          title: 'Per Share Metrics',
          columns: ['Metric', 'Value'],
          rows: [
            ['EPS (basic)', r.perShareMetrics?.eps?.value],
            ['EPS (diluted)', r.perShareMetrics?.dilutedEps?.value],
            ['DPS', r.perShareMetrics?.dps?.value],
            ['Dividend Cover', r.perShareMetrics?.dividendCover?.value],
            ['Dividend Yield %', r.perShareMetrics?.dividendYield?.value],
            ['P/E Ratio', r.marketMultiples?.pe?.value],
            ['Price-to-Book', r.marketMultiples?.priceToBook?.value],
            ['Price-to-Sales', r.marketMultiples?.priceToSales?.value],
          ],
        },
        {
          title: 'Earnings Quality',
          columns: ['Indicator', 'Value', 'Status', 'Interpretation'],
          rows: [
            ['Accruals Ratio', r.earningsQuality?.accrualsRatio?.value, r.earningsQuality?.accrualsRatio?.status, r.earningsQuality?.accrualsRatio?.interpretation],
            ['Cash Conversion', r.earningsQuality?.cashConversion?.value, r.earningsQuality?.cashConversion?.status, 'Threshold ≥0.8'],
            ['Rev Rec Quality Gap %', r.earningsQuality?.revenueRecognitionQuality?.gapPct, r.earningsQuality?.revenueRecognitionQuality?.status, ''],
            ['Operating Leverage', r.earningsQuality?.operatingLeverage?.value, '', r.earningsQuality?.operatingLeverage?.interpretation],
          ],
        },
        {
          title: 'Economic Value Added (EVA)',
          columns: ['Component', 'Value'],
          rows: [
            ['NOPAT (£)', r.shareholderValue?.nopat],
            ['Capital Employed (£)', r.shareholderValue?.capitalEmployed],
            ['WACC (%)', r.shareholderValue?.wacc],
            ['EVA (£)', r.shareholderValue?.eva],
            ['Assessment', r.shareholderValue?.evaInterpretation],
          ],
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
