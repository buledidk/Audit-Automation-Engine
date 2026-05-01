// ═══════════════════════════════════════════════════════════════
// Market & Competitive Agent — Market Position & Competitive Analysis
// ═══════════════════════════════════════════════════════════════

export const marketCompetitiveAgent = {
  id: 'market_competitive',
  name: 'Market & Competitive Agent',
  description: 'Analyses revenue growth, margin trends, competitive positioning, customer/supplier concentration, and industry benchmarking.',
  category: 'financial_analysis',
  isaReferences: ['ISA 315', 'ISA 520', 'ISA 550', 'ISA 570'],

  analyze(financials, context = {}) {
    const f = financials || {};
    const ctx = context || {};
    const results = {
      growthMetrics: {},
      marginTrends: {},
      efficiency: {},
      concentration: {},
      industryBenchmark: {},
      marketShare: {},
      overallStatus: 'GREEN',
      warnings: [],
    };

    const revenue = f.revenue || f.turnover || 0;
    const priorRevenue = f.priorRevenue || f.priorYearRevenue || 0;
    const revenue3YrAgo = f.revenueThreeYearsAgo || priorRevenue;
    const grossProfit = f.grossProfit || 0;
    const operatingProfit = f.operatingProfit || f.ebit || 0;
    const ebitda = f.ebitda || (operatingProfit + (f.depreciation || 0) + (f.amortisation || 0));
    const headcount = f.headcount || f.numberOfEmployees || 0;
    const totalAssets = f.totalAssets || 0;
    const debtors = f.tradeDebtors || f.tradeReceivables || 0;
    const inventory = f.inventory || f.stock || 0;
    const creditors = f.tradeCreditors || f.tradePayables || 0;
    const priorGrossProfit = f.priorGrossProfit || grossProfit;
    const prior3YrGrossProfit = f.grossProfitThreeYearsAgo || priorGrossProfit;
    const priorOperatingProfit = f.priorOperatingProfit || operatingProfit;

    // ─── 1. REVENUE GROWTH ──────────────────────────────────────────
    const revenueGrowthYoY = priorRevenue > 0 ? ((revenue - priorRevenue) / priorRevenue) * 100 : null;
    const cagr3yr = revenue3YrAgo > 0 && revenue > 0
      ? (Math.pow(revenue / revenue3YrAgo, 1 / 3) - 1) * 100
      : null;

    let growthStatus = 'GREEN';
    if (revenueGrowthYoY !== null) {
      if (revenueGrowthYoY < -10) growthStatus = 'RED';
      else if (revenueGrowthYoY < 0) growthStatus = 'AMBER';
    }

    results.growthMetrics.revenueGrowthYoY = { value: _round(revenueGrowthYoY, 1), pct: true, status: growthStatus };
    results.growthMetrics.cagr3yr = { value: _round(cagr3yr, 1), pct: true };

    // ─── 2. MARGIN TRENDS ───────────────────────────────────────────
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : null;
    const priorGrossMargin = priorRevenue > 0 ? (priorGrossProfit / priorRevenue) * 100 : null;
    const avg3yrGrossMargin = priorRevenue > 0
      ? ((grossProfit + priorGrossProfit + prior3YrGrossProfit) / (revenue + priorRevenue + (f.revenueThreeYearsAgo || priorRevenue))) * 100
      : grossMargin;

    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : null;
    const priorOperatingMargin = priorRevenue > 0 ? (priorOperatingProfit / priorRevenue) * 100 : null;

    const grossMarginChange = grossMargin !== null && priorGrossMargin !== null ? grossMargin - priorGrossMargin : null;
    let grossMarginStatus = 'GREEN';
    if (grossMarginChange !== null) {
      if (grossMarginChange < -3) grossMarginStatus = 'RED';
      else if (grossMarginChange < 0) grossMarginStatus = 'AMBER';
    }

    results.marginTrends.grossMargin = {
      current: _round(grossMargin, 1),
      prior: _round(priorGrossMargin, 1),
      avg3yr: _round(avg3yrGrossMargin, 1),
      change: _round(grossMarginChange, 1),
      status: grossMarginStatus,
    };
    results.marginTrends.operatingMargin = {
      current: _round(operatingMargin, 1),
      prior: _round(priorOperatingMargin, 1),
      change: _round(operatingMargin !== null && priorOperatingMargin !== null ? operatingMargin - priorOperatingMargin : null, 1),
    };

    // ─── 3. EFFICIENCY METRICS ───────────────────────────────────────
    const revenuePerEmployee = headcount > 0 ? revenue / headcount : null;
    const ebitdaPerEmployee = headcount > 0 ? ebitda / headcount : null;
    const assetTurnover = totalAssets > 0 ? revenue / totalAssets : null;
    const wcIntensity = revenue > 0 ? ((debtors + inventory - creditors) / revenue) * 100 : null;

    results.efficiency = {
      revenuePerEmployee: { value: _round(revenuePerEmployee, 0), currency: '£' },
      ebitdaPerEmployee: { value: _round(ebitdaPerEmployee, 0), currency: '£' },
      assetTurnover: { value: _round(assetTurnover, 2), note: 'Revenue / Total Assets' },
      workingCapitalIntensity: { value: _round(wcIntensity, 1), pct: true, note: '(Debtors + Inventory - Creditors) / Revenue' },
    };

    // ─── 4. CUSTOMER CONCENTRATION ──────────────────────────────────
    const topCustomers = ctx.topCustomers || f.topCustomers || [];
    if (topCustomers.length > 0 && revenue > 0) {
      const top5Revenue = topCustomers.slice(0, 5).reduce((sum, c) => sum + (c.revenue || 0), 0);
      const top5Pct = (top5Revenue / revenue) * 100;
      const largestCustomerPct = topCustomers.length > 0 ? ((topCustomers[0].revenue || 0) / revenue) * 100 : 0;

      // Herfindahl-Hirschman Index (HHI)
      const hhi = topCustomers.reduce((sum, c) => {
        const share = (c.revenue || 0) / revenue * 100;
        return sum + share * share;
      }, 0);

      let concentrationStatus = 'GREEN';
      if (largestCustomerPct > 40) {
        concentrationStatus = 'RED';
        results.warnings.push(`Customer concentration risk: largest customer represents ${_round(largestCustomerPct, 1)}% of revenue (>40% threshold — RED). ISA 550 and going concern risk.`);
      } else if (largestCustomerPct > 20) {
        concentrationStatus = 'AMBER';
        results.warnings.push(`Customer concentration: largest customer represents ${_round(largestCustomerPct, 1)}% of revenue (>20% threshold — AMBER).`);
      }

      results.concentration.customers = {
        top5RevenuePct: _round(top5Pct, 1),
        largestCustomerPct: _round(largestCustomerPct, 1),
        hhi: _round(hhi, 0),
        hhiInterpretation: hhi < 1500 ? 'Low concentration' : hhi < 2500 ? 'Moderate concentration' : 'High concentration',
        status: concentrationStatus,
        topCustomers: topCustomers.slice(0, 5).map(c => ({
          name: c.name || 'Unnamed',
          revenuePct: _round((c.revenue || 0) / revenue * 100, 1),
        })),
      };
    }

    // ─── 5. SUPPLIER CONCENTRATION ──────────────────────────────────
    const topSuppliers = ctx.topSuppliers || f.topSuppliers || [];
    const totalPurchases = f.totalPurchases || f.costOfSales || 0;
    if (topSuppliers.length > 0 && totalPurchases > 0) {
      const top5Purchases = topSuppliers.slice(0, 5).reduce((sum, s) => sum + (s.purchases || 0), 0);
      const top5SupplierPct = (top5Purchases / totalPurchases) * 100;
      const largestSupplierPct = topSuppliers.length > 0 ? ((topSuppliers[0].purchases || 0) / totalPurchases) * 100 : 0;

      let supplierStatus = 'GREEN';
      if (largestSupplierPct > 40) { supplierStatus = 'RED'; results.warnings.push(`Supplier concentration risk: largest supplier ${_round(largestSupplierPct, 1)}% of purchases — supply chain vulnerability.`); }
      else if (largestSupplierPct > 20) { supplierStatus = 'AMBER'; }

      results.concentration.suppliers = {
        top5PurchasesPct: _round(top5SupplierPct, 1),
        largestSupplierPct: _round(largestSupplierPct, 1),
        status: supplierStatus,
      };
    }

    // ─── 6. INDUSTRY BENCHMARK COMPARISON ───────────────────────────
    const benchmarks = ctx.industryBenchmarks || _getIndustryBenchmarks(ctx.industry || f.industry);
    results.industryBenchmark = {
      source: benchmarks.source,
      comparisons: {
        grossMargin: _benchmark(grossMargin, benchmarks.grossMargin, 'higher_better', 'Gross Margin %'),
        operatingMargin: _benchmark(operatingMargin, benchmarks.operatingMargin, 'higher_better', 'Operating Margin %'),
        revenueGrowth: _benchmark(revenueGrowthYoY, benchmarks.revenueGrowth, 'higher_better', 'Revenue Growth %'),
        assetTurnover: _benchmark(assetTurnover, benchmarks.assetTurnover, 'higher_better', 'Asset Turnover'),
      },
      summary: _generateBenchmarkSummary(grossMargin, operatingMargin, benchmarks),
    };

    // ─── 7. MARKET SHARE ─────────────────────────────────────────────
    const industryRevenue = ctx.totalIndustryRevenue || 0;
    if (industryRevenue > 0 && revenue > 0) {
      const marketSharePct = (revenue / industryRevenue) * 100;
      const priorMarketSharePct = priorRevenue > 0 ? (priorRevenue / (ctx.priorTotalIndustryRevenue || industryRevenue)) * 100 : null;
      results.marketShare = {
        currentPct: _round(marketSharePct, 2),
        priorPct: _round(priorMarketSharePct, 2),
        change: priorMarketSharePct !== null ? _round(marketSharePct - priorMarketSharePct, 2) : null,
        direction: priorMarketSharePct !== null
          ? (marketSharePct > priorMarketSharePct ? 'Gaining share' : marketSharePct < priorMarketSharePct ? 'Losing share' : 'Stable')
          : 'Prior data not available',
      };
    }

    // ─── 8. OVERALL STATUS ───────────────────────────────────────────
    const statuses = [growthStatus, grossMarginStatus].filter(s => s !== 'N/A');
    if (results.concentration.customers?.status === 'RED') statuses.push('RED');
    if (statuses.includes('RED')) results.overallStatus = 'RED';
    else if (statuses.includes('AMBER')) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      `MARKET POSITION & COMPETITIVE ANALYSIS`,
      `Overall Status: [${r.overallStatus}]`,
      '',
      'GROWTH METRICS:',
      `  • Revenue growth YoY: ${r.growthMetrics?.revenueGrowthYoY?.value ?? 'N/A'}% [${r.growthMetrics?.revenueGrowthYoY?.status}]`,
      `  • 3-year CAGR: ${r.growthMetrics?.cagr3yr?.value ?? 'N/A'}%`,
      '',
      'MARGIN TRENDS:',
      `  • Gross margin: ${r.marginTrends?.grossMargin?.current ?? 'N/A'}% (prior: ${r.marginTrends?.grossMargin?.prior ?? 'N/A'}%, 3yr avg: ${r.marginTrends?.grossMargin?.avg3yr ?? 'N/A'}%) [${r.marginTrends?.grossMargin?.status}]`,
      `  • Operating margin: ${r.marginTrends?.operatingMargin?.current ?? 'N/A'}% (prior: ${r.marginTrends?.operatingMargin?.prior ?? 'N/A'}%)`,
      '',
      'EFFICIENCY:',
      `  • Revenue per employee: £${(r.efficiency?.revenuePerEmployee?.value || 0).toLocaleString()}`,
      `  • EBITDA per employee: £${(r.efficiency?.ebitdaPerEmployee?.value || 0).toLocaleString()}`,
      `  • Asset turnover: ${r.efficiency?.assetTurnover?.value ?? 'N/A'}x`,
      `  • Working capital intensity: ${r.efficiency?.workingCapitalIntensity?.value ?? 'N/A'}%`,
    ];

    if (r.concentration?.customers) {
      lines.push('', 'CUSTOMER CONCENTRATION:');
      lines.push(`  • Top 5 customers: ${r.concentration.customers.top5RevenuePct}% of revenue`);
      lines.push(`  • Largest customer: ${r.concentration.customers.largestCustomerPct}% of revenue [${r.concentration.customers.status}]`);
      lines.push(`  • HHI: ${r.concentration.customers.hhi} (${r.concentration.customers.hhiInterpretation})`);
    }

    if (r.concentration?.suppliers) {
      lines.push('', 'SUPPLIER CONCENTRATION:');
      lines.push(`  • Top 5 suppliers: ${r.concentration.suppliers.top5PurchasesPct}% of purchases`);
      lines.push(`  • Largest supplier: ${r.concentration.suppliers.largestSupplierPct}% of purchases [${r.concentration.suppliers.status}]`);
    }

    if (r.industryBenchmark?.summary) {
      lines.push('', `INDUSTRY BENCHMARK POSITIONING (${r.industryBenchmark.source}):`);
      lines.push(`  ${r.industryBenchmark.summary}`);
    }

    if (r.marketShare?.currentPct !== undefined) {
      lines.push('', `MARKET SHARE: ${r.marketShare.currentPct}% (${r.marketShare.direction})`);
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 315, ISA 520, ISA 550`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['revenue', 'trade_debtors', 'inventory', 'going_concern', 'related_parties'];
    const r = results || {};

    if (r.concentration?.customers?.status === 'RED') sections.push('audit_differences', 'provisions');
    if (r.marginTrends?.grossMargin?.status === 'RED') sections.push('cost_of_sales', 'inventory');

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Market & Competitive Analysis',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Growth & Margins',
          columns: ['Metric', 'Current', 'Prior Year', '3yr Avg/CAGR', 'Status'],
          rows: [
            ['Revenue Growth YoY %', r.growthMetrics?.revenueGrowthYoY?.value, '', r.growthMetrics?.cagr3yr?.value, r.growthMetrics?.revenueGrowthYoY?.status],
            ['Gross Margin %', r.marginTrends?.grossMargin?.current, r.marginTrends?.grossMargin?.prior, r.marginTrends?.grossMargin?.avg3yr, r.marginTrends?.grossMargin?.status],
            ['Operating Margin %', r.marginTrends?.operatingMargin?.current, r.marginTrends?.operatingMargin?.prior, '', ''],
          ],
        },
        {
          title: 'Efficiency Metrics',
          columns: ['Metric', 'Value'],
          rows: [
            ['Revenue per Employee (£)', r.efficiency?.revenuePerEmployee?.value],
            ['EBITDA per Employee (£)', r.efficiency?.ebitdaPerEmployee?.value],
            ['Asset Turnover', r.efficiency?.assetTurnover?.value],
            ['Working Capital Intensity %', r.efficiency?.workingCapitalIntensity?.value],
          ],
        },
        {
          title: 'Concentration Analysis',
          columns: ['Metric', 'Value', 'Status'],
          rows: [
            ['Top 5 Customers % of Revenue', r.concentration?.customers?.top5RevenuePct, r.concentration?.customers?.status],
            ['Largest Customer % of Revenue', r.concentration?.customers?.largestCustomerPct, r.concentration?.customers?.status],
            ['Customer HHI', r.concentration?.customers?.hhi, ''],
            ['Top 5 Suppliers % of Purchases', r.concentration?.suppliers?.top5PurchasesPct, r.concentration?.suppliers?.status],
            ['Largest Supplier % of Purchases', r.concentration?.suppliers?.largestSupplierPct, r.concentration?.suppliers?.status],
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

function _getIndustryBenchmarks(industry) {
  const benchmarks = {
    manufacturing: { grossMargin: 28, operatingMargin: 7, revenueGrowth: 4, assetTurnover: 0.9, source: 'UK Manufacturing sector median' },
    retail: { grossMargin: 35, operatingMargin: 5, revenueGrowth: 3, assetTurnover: 1.8, source: 'UK Retail sector median' },
    technology: { grossMargin: 65, operatingMargin: 18, revenueGrowth: 12, assetTurnover: 0.7, source: 'UK Technology sector median' },
    construction: { grossMargin: 18, operatingMargin: 4, revenueGrowth: 5, assetTurnover: 1.2, source: 'UK Construction sector median' },
    professional_services: { grossMargin: 55, operatingMargin: 15, revenueGrowth: 6, assetTurnover: 1.1, source: 'UK Professional Services median' },
    hospitality: { grossMargin: 72, operatingMargin: 8, revenueGrowth: 3, assetTurnover: 0.6, source: 'UK Hospitality sector median' },
    default: { grossMargin: 40, operatingMargin: 8, revenueGrowth: 5, assetTurnover: 1.0, source: 'UK cross-sector median' },
  };
  return benchmarks[industry] || benchmarks.default;
}

function _benchmark(actual, benchmarkValue, direction, label) {
  if (actual === null || actual === undefined || benchmarkValue === undefined) return { label, status: 'N/A', vs: 'No benchmark' };
  const diff = actual - benchmarkValue;
  const diffPct = benchmarkValue !== 0 ? (diff / Math.abs(benchmarkValue)) * 100 : 0;
  const betterIfHigher = direction === 'higher_better';
  const isBetter = betterIfHigher ? diff > 0 : diff < 0;
  const isSignificantlyWorse = betterIfHigher ? diffPct < -20 : diffPct > 20;
  const isSlightlyWorse = betterIfHigher ? diffPct < -5 : diffPct > 5;
  let status = 'GREEN';
  if (isSignificantlyWorse) status = 'RED';
  else if (isSlightlyWorse) status = 'AMBER';
  return { label, actual: _round(actual, 1), benchmark: _round(benchmarkValue, 1), diffPct: _round(diffPct, 1), status, vs: isBetter ? 'Above benchmark' : 'Below benchmark' };
}

function _generateBenchmarkSummary(grossMargin, operatingMargin, benchmarks) {
  const results = [];
  if (grossMargin !== null && benchmarks.grossMargin !== undefined) {
    const diff = grossMargin - benchmarks.grossMargin;
    results.push(`Gross margin ${diff >= 0 ? 'above' : 'below'} industry median by ${Math.abs(_round(diff, 1))}pp`);
  }
  if (operatingMargin !== null && benchmarks.operatingMargin !== undefined) {
    const diff = operatingMargin - benchmarks.operatingMargin;
    results.push(`operating margin ${diff >= 0 ? 'above' : 'below'} median by ${Math.abs(_round(diff, 1))}pp`);
  }
  return results.length > 0 ? results.join('; ') + '.' : 'Insufficient data for benchmark comparison.';
}
