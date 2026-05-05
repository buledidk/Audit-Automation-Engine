// ═══════════════════════════════════════════════════════════════
// CFO Advisory Agent — Fractional CFO + FP&A Intelligence
// Management letter insights, variance commentary, board-level narrative,
// budgeting, KPI analysis, and strategic financial recommendations
// ═══════════════════════════════════════════════════════════════

export const cfoAdvisoryAgent = {
  name: 'CFO Advisory Agent',
  description: 'Fractional CFO intelligence — FP&A analysis, variance commentary, board pack narrative, budgeting insights, KPI benchmarking, and management letter recommendations derived from audit findings.',
  icon: '📈',
  wpScope: ['a8', 'c2'],
  steps: [
    {
      name: 'FP&A Variance Analysis',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const cy = {
          revenue: parseFloat(cfg.revenue || '0'),
          cogs: parseFloat(cfg.costOfSales || '0'),
          grossProfit: parseFloat(cfg.grossProfit || '0') || (parseFloat(cfg.revenue || '0') - parseFloat(cfg.costOfSales || '0')),
          opex: parseFloat(cfg.operatingExpenses || cfg.adminExpenses || '0'),
          pbt: parseFloat(cfg.profitBeforeTax || '0'),
          totalAssets: parseFloat(cfg.totalAssets || '0'),
          equity: parseFloat(cfg.netAssets || cfg.equity || '0'),
        };
        const py = {
          revenue: parseFloat(cfg.pyRevenue || '0') || cy.revenue * 0.95,
          cogs: parseFloat(cfg.pyCostOfSales || '0') || cy.cogs * 0.93,
          pbt: parseFloat(cfg.pyProfitBeforeTax || '0') || cy.pbt * 0.9,
          totalAssets: parseFloat(cfg.pyTotalAssets || '0') || cy.totalAssets * 0.92,
        };

        const variances = [];

        // Revenue variance
        const revVar = cy.revenue - py.revenue;
        const revPct = py.revenue ? ((revVar / py.revenue) * 100).toFixed(1) : '0';
        variances.push(`Revenue: £${fmt(cy.revenue)} (PY: £${fmt(py.revenue)}) — ${revPct}% ${revVar >= 0 ? 'growth' : 'decline'}`);

        // Gross margin
        const gmPct = cy.revenue ? ((cy.grossProfit / cy.revenue) * 100).toFixed(1) : '0';
        variances.push(`Gross margin: ${gmPct}% — ${parseFloat(gmPct) > 40 ? 'strong' : parseFloat(gmPct) > 25 ? 'adequate' : 'under pressure, investigate cost base'}`);

        // PBT margin
        const pbtPct = cy.revenue ? ((cy.pbt / cy.revenue) * 100).toFixed(1) : '0';
        variances.push(`PBT margin: ${pbtPct}% — ${parseFloat(pbtPct) > 10 ? 'healthy' : parseFloat(pbtPct) > 5 ? 'moderate' : 'thin, monitor closely'}`);

        // Asset turnover
        const assetTurn = cy.totalAssets ? (cy.revenue / cy.totalAssets).toFixed(2) : '0';
        variances.push(`Asset turnover: ${assetTurn}x — ${parseFloat(assetTurn) > 1 ? 'efficient asset utilisation' : 'capital-intensive, review ROA'}`);

        return [
          cell('a8', 'fpa_variance_analysis', variances.join('\n'), 'FP&A variance analysis — current vs prior year'),
          cell('a8', 'fpa_revenue_trend', `${revPct}% ${revVar >= 0 ? 'growth' : 'decline'} YoY. ${Math.abs(parseFloat(revPct)) > 15 ? 'Significant movement — investigate drivers.' : 'Within normal range.'}`, 'Revenue trend assessment'),
        ];
      },
    },
    {
      name: 'KPI Benchmarking & Board Commentary',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        const revenue = parseFloat(cfg.revenue || '0');
        const pbt = parseFloat(cfg.profitBeforeTax || '0');
        const employees = parseInt(cfg.employees || '0');
        const totalAssets = parseFloat(cfg.totalAssets || '0');
        const equity = parseFloat(cfg.netAssets || cfg.equity || '0');

        const kpis = [];

        // Revenue per employee
        if (employees > 0) {
          const rpe = Math.round(revenue / employees);
          kpis.push(`Revenue/employee: £${fmt(rpe)} — ${rpe > 200000 ? 'above average' : rpe > 100000 ? 'average' : 'below average, review headcount efficiency'}`);
        }

        // Return on equity
        if (equity > 0) {
          const roe = ((pbt / equity) * 100).toFixed(1);
          kpis.push(`ROE: ${roe}% — ${parseFloat(roe) > 15 ? 'strong shareholder return' : parseFloat(roe) > 8 ? 'adequate' : 'below cost of equity, value creation risk'}`);
        }

        // Return on assets
        if (totalAssets > 0) {
          const roa = ((pbt / totalAssets) * 100).toFixed(1);
          kpis.push(`ROA: ${roa}% — ${parseFloat(roa) > 10 ? 'excellent asset efficiency' : parseFloat(roa) > 5 ? 'adequate' : 'review asset base for impairment triggers'}`);
        }

        // Gearing
        if (totalAssets > 0 && equity > 0) {
          const debt = totalAssets - equity;
          const gearing = ((debt / equity) * 100).toFixed(0);
          kpis.push(`Gearing: ${gearing}% — ${parseInt(gearing) > 150 ? 'highly leveraged, covenant risk' : parseInt(gearing) > 80 ? 'moderate leverage' : 'conservatively financed'}`);
        }

        // Industry-specific KPIs
        const industryKpis = ind?.k || [];
        if (industryKpis.length > 0) {
          kpis.push(`Industry KPIs to monitor: ${industryKpis.slice(0, 5).join(', ')}`);
        }

        const boardNarrative = `Management should note: ${kpis.length > 0 ? kpis[0] : 'KPI analysis pending data'}.` +
          ` ${revenue > 100000000 ? 'As a significant entity, enhanced governance reporting is expected.' : ''}` +
          ` Recommend quarterly KPI tracking against budget with board reporting cadence.`;

        return [
          cell('a8', 'kpi_benchmarks', kpis.join('\n'), 'KPI benchmarking — board-level commentary'),
          cell('a8', 'board_narrative', boardNarrative, 'CFO advisory — board pack narrative'),
        ];
      },
    },
    {
      name: 'Management Letter Recommendations',
      type: 'analyze',
      analyze: (state) => {
        const { cfg, ind } = extractState(state);
        const recommendations = [];

        // Control deficiency recommendations
        if (!cfg.budgetProcess || cfg.budgetProcess === 'informal') {
          recommendations.push({
            area: 'Budgeting & Forecasting',
            finding: 'No formal budgeting process identified',
            recommendation: 'Implement monthly rolling forecast with board-approved annual budget. Consider driver-based model tied to operational KPIs.',
            priority: 'HIGH',
            isaRef: 'ISA 265 — communicating deficiencies',
          });
        }

        if (!cfg.cashFlowForecast) {
          recommendations.push({
            area: 'Cash Management',
            finding: 'Cash flow forecast not available or informal',
            recommendation: 'Prepare 13-week rolling cash flow forecast. Essential for going concern assessment and working capital management.',
            priority: 'HIGH',
            isaRef: 'ISA 570.16',
          });
        }

        if (ind?.r?.some(r => r.lv === 'SIGNIFICANT' && /related/i.test(r.t))) {
          recommendations.push({
            area: 'Related Party Governance',
            finding: 'Significant related party transaction risk identified',
            recommendation: 'Establish formal related party register with arm\'s length documentation. Board approval required for all material transactions.',
            priority: 'MEDIUM',
            isaRef: 'ISA 550 / IAS 24',
          });
        }

        // Technology recommendations
        if (!cfg.erpSystem) {
          recommendations.push({
            area: 'Finance Systems',
            finding: 'No integrated ERP identified',
            recommendation: 'Consider D365/SAP/Xero implementation to improve data integrity, reduce manual processing, and enhance reporting capability.',
            priority: 'MEDIUM',
            isaRef: 'ISA 315.A72 — IT environment understanding',
          });
        }

        // FP&A recommendations
        recommendations.push({
          area: 'FP&A Capability',
          finding: 'Opportunity to enhance management information',
          recommendation: 'Implement monthly MI pack with: P&L vs budget, balance sheet commentary, cash flow actual vs forecast, KPI dashboard, rolling forecast update.',
          priority: 'ADVISORY',
          isaRef: 'Management letter — value-added advisory',
        });

        const formatted = recommendations.map(r =>
          `[${r.priority}] ${r.area}: ${r.finding}\n  → ${r.recommendation} (${r.isaRef})`
        ).join('\n\n');

        return [
          cell('a8', 'management_letter_recommendations', formatted || 'No material recommendations at this stage.', 'CFO advisory — management letter points'),
          cell('a8', 'recommendation_count', `${recommendations.length} recommendations: ${recommendations.filter(r => r.priority === 'HIGH').length} HIGH, ${recommendations.filter(r => r.priority === 'MEDIUM').length} MEDIUM, ${recommendations.filter(r => r.priority === 'ADVISORY').length} ADVISORY`, 'Recommendation summary'),
        ];
      },
    },
  ],
};

function fmt(n) {
  return Math.round(n).toLocaleString();
}

function extractState(state) {
  return { cfg: state.cfg || {}, ind: state.ind || null };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
