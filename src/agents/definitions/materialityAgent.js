// ═══════════════════════════════════════════════════════════════
// Materiality Agent — ISA 320/450 specialist
// Calculates, revises, and documents materiality across all benchmarks
// ═══════════════════════════════════════════════════════════════

export const materialityAgent = {
  name: 'Materiality Agent',
  description: 'Calculates overall, performance, and specific materiality using ISA 320 benchmarks. Assesses revision triggers and evaluates misstatements against thresholds (ISA 450).',
  icon: '📊',
  wpScope: ['a3'],
  steps: [
    {
      name: 'Calculate multi-benchmark materiality (ISA 320.10)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const revenue = parseFloat(cfg.revenue || cfg.turnover || '0') || 0;
        const pbt = parseFloat(cfg.profitBeforeTax || cfg.pbt || '0') || 0;
        const totalAssets = parseFloat(cfg.totalAssets || '0') || 0;
        const netAssets = parseFloat(cfg.netAssets || '0') || 0;

        const benchmarks = [];
        if (revenue > 0) benchmarks.push({ name: 'Revenue', base: revenue, pct: 0.0075, result: Math.round(revenue * 0.0075) });
        if (pbt > 0) benchmarks.push({ name: 'Profit before tax', base: pbt, pct: 0.05, result: Math.round(pbt * 0.05) });
        if (totalAssets > 0) benchmarks.push({ name: 'Total assets', base: totalAssets, pct: 0.01, result: Math.round(totalAssets * 0.01) });
        if (netAssets > 0) benchmarks.push({ name: 'Net assets', base: netAssets, pct: 0.02, result: Math.round(netAssets * 0.02) });

        if (benchmarks.length === 0) return [cell('a3', 'materiality_status', 'Insufficient financial data — manual calculation required', 'No benchmark data available')];

        // Select primary benchmark (revenue for trading, total assets for investment, PBT for profitable)
        const entityType = (cfg.entitySize || '').toLowerCase();
        let primary;
        if (entityType === 'investment' || entityType === 'holding') {
          primary = benchmarks.find(b => b.name === 'Net assets') || benchmarks[0];
        } else if (pbt > 0) {
          primary = benchmarks.find(b => b.name === 'Profit before tax') || benchmarks[0];
        } else {
          primary = benchmarks.find(b => b.name === 'Revenue') || benchmarks[0];
        }

        const om = primary.result;
        const pm = Math.round(om * 0.70);
        const trivial = Math.round(om * 0.05);

        return [
          cell('a3', 'overall_materiality', `£${om.toLocaleString()}`, `${(primary.pct * 100).toFixed(2)}% of ${primary.name} (£${primary.base.toLocaleString()}) per ISA 320.10`),
          cell('a3', 'performance_materiality', `£${pm.toLocaleString()}`, '70% of overall materiality (ISA 320.11) — allows buffer for undetected misstatements'),
          cell('a3', 'trivial_threshold', `£${trivial.toLocaleString()}`, '5% of overall materiality — clearly trivial (ISA 450.A2)'),
          cell('a3', 'primary_benchmark', primary.name, `Selected based on entity profile: ${entityType || 'trading entity'}`),
          cell('a3', 'all_benchmarks', benchmarks.map(b => `${b.name}: £${b.result.toLocaleString()} (${(b.pct * 100).toFixed(2)}%)`).join(' | '), 'Multi-benchmark comparison for cross-check'),
          cell('a3', 'specific_materiality', cfg.specificMateriality ? `£${parseFloat(cfg.specificMateriality).toLocaleString()}` : 'Not applicable — no related party or sensitive disclosures requiring lower threshold', 'ISA 320.A11 — lower materiality for specific items'),
        ];
      },
    },
    {
      name: 'Assess revision triggers (ISA 320.12-13)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const triggers = [];

        if (cfg.significantMisstatements) triggers.push('Misstatements identified approaching materiality — consider revising downward');
        if (cfg.newRisksIdentified) triggers.push('New risks identified since planning — reassess whether current materiality is appropriate');
        if (cfg.revisedFinancials) triggers.push('Revised financial information available — recalculate using updated figures');
        if (cfg.acquisitionDisposal) triggers.push('Significant acquisition or disposal — assess impact on benchmark selection');

        return [
          cell('a3', 'revision_triggers', triggers.length > 0 ? triggers.join('; ') : 'No revision triggers identified at this stage', 'ISA 320.12-13 — materiality must be revised when circumstances change'),
          cell('a3', 'revision_required', triggers.length > 0 ? 'YES — document revised calculation and reasoning' : 'NO — original assessment remains appropriate', 'Revision assessment'),
        ];
      },
    },
    {
      name: 'Evaluate accumulated misstatements (ISA 450.5)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const misstatements = parseFloat(cfg.accumulatedMisstatements || '0');
        const om = parseFloat(cfg.overallMateriality || '0');

        if (!om) return [cell('a3', 'isa450_assessment', 'Overall materiality not yet determined — complete A3 first', 'Prerequisite')];

        const pctOfMateriality = om > 0 ? ((misstatements / om) * 100).toFixed(1) : '0';
        const assessment = misstatements >= om ? 'MATERIAL — qualified or adverse opinion to be considered (ISA 705)'
          : misstatements >= om * 0.75 ? 'APPROACHING MATERIALITY — discuss with management, consider adjustment'
          : misstatements >= om * 0.5 ? 'SIGNIFICANT — monitor closely, evaluate with further audit procedures'
          : 'ACCEPTABLE — below threshold, no further action required';

        return [
          cell('a3', 'accumulated_misstatements', `£${misstatements.toLocaleString()} (${pctOfMateriality}% of overall materiality)`, 'ISA 450.5 — evaluate effect of uncorrected misstatements'),
          cell('a3', 'misstatement_assessment', assessment, 'ISA 450.11 assessment'),
        ];
      },
    },
  ],
};

function extractState(state) {
  return { cfg: state.cfg || {}, ind: state.ind || null };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
