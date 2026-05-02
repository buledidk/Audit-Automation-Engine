// ═══════════════════════════════════════════════════════════════
// Sampling Agent — ISA 530 specialist
// Calculates sample sizes, selects items, evaluates results
// ═══════════════════════════════════════════════════════════════

export const samplingAgent = {
  name: 'Sampling Agent',
  description: 'Calculates statistical and judgmental sample sizes per ISA 530, recommends selection methods, and evaluates sample results against materiality.',
  icon: '🎯',
  wpScope: ['b2'],
  steps: [
    {
      name: 'Determine sampling approach per FSLI (ISA 530.5)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const riskAreas = [
          { fsli: 'Revenue', risk: cfg.revenueRisk || 'high', population: cfg.revenueTransactions || 500 },
          { fsli: 'Payables', risk: cfg.payablesRisk || 'medium', population: cfg.payablesTransactions || 200 },
          { fsli: 'Receivables', risk: cfg.receivablesRisk || 'medium', population: cfg.receivablesTransactions || 150 },
          { fsli: 'Payroll', risk: cfg.payrollRisk || 'low', population: cfg.payrollTransactions || 12 },
          { fsli: 'PPE', risk: cfg.ppeRisk || 'low', population: cfg.ppeTransactions || 30 },
        ];

        return riskAreas.map(area => {
          const { size, method, confidence } = calculateSample(area.population, area.risk);
          return cell('b2', `sample_${area.fsli.toLowerCase()}`,
            `${area.fsli}: ${size} items from ${area.population} (${method}, ${confidence} confidence)`,
            `Risk: ${area.risk.toUpperCase()} — ISA 530.7`
          );
        });
      },
    },
    {
      name: 'High-value item selection (ISA 530.A13)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const om = parseFloat(cfg.overallMateriality || cfg.materiality || '0');
        const pm = parseFloat(cfg.performanceMateriality || '0') || om * 0.70;

        return [
          cell('b2', 'high_value_threshold', om > 0 ? `Items > £${pm.toLocaleString()} selected for 100% testing` : 'Determine after materiality calculation', 'ISA 530.A13 — items individually significant'),
          cell('b2', 'key_items_approach', 'All items exceeding performance materiality are tested individually. Remaining population sampled statistically.', 'ISA 530.A14 — stratification approach'),
          cell('b2', 'sampling_risk', 'Sampling risk accepted at 5% (95% confidence) for high-risk areas, 10% (90% confidence) for medium-risk areas.', 'ISA 530.5(c) — tolerable level of sampling risk'),
        ];
      },
    },
    {
      name: 'Evaluate sample results (ISA 530.12-14)',
      type: 'analyze',
      analyze: (state) => {
        const { cfg } = extractState(state);
        const exceptionsFound = parseInt(cfg.exceptionsFound || '0');
        const sampleSize = parseInt(cfg.sampleSize || '25');
        const populationSize = parseInt(cfg.populationSize || '500');

        const exceptionRate = sampleSize > 0 ? (exceptionsFound / sampleSize) : 0;
        const projectedMisstatement = Math.round(exceptionRate * populationSize * (parseFloat(cfg.avgExceptionValue || '0') || 1000));

        return [
          cell('b2', 'exception_rate', `${exceptionsFound} exceptions in ${sampleSize} items (${(exceptionRate * 100).toFixed(1)}%)`, 'ISA 530.12 — nature and cause of exceptions'),
          cell('b2', 'projected_misstatement', projectedMisstatement > 0 ? `£${projectedMisstatement.toLocaleString()} projected to population` : 'No projected misstatement', 'ISA 530.13 — projection to population'),
          cell('b2', 'sample_conclusion', exceptionRate > 0.10 ? 'Exception rate exceeds tolerable — extend procedures or qualify conclusion' : exceptionRate > 0.04 ? 'Moderate exceptions — investigate causes, consider extending sample' : 'Exception rate within tolerable limits — sample supports population assertion', 'ISA 530.14 — evaluation'),
        ];
      },
    },
  ],
};

function calculateSample(population, risk) {
  const r = risk.toLowerCase();
  if (r === 'high') return { size: Math.min(population, Math.max(40, Math.ceil(population * 0.08))), method: 'Statistical', confidence: '95%' };
  if (r === 'medium') return { size: Math.min(population, Math.max(25, Math.ceil(population * 0.05))), method: 'Statistical', confidence: '90%' };
  return { size: Math.min(population, Math.max(10, Math.ceil(population * 0.03))), method: 'Judgmental', confidence: '80%' };
}

function extractState(state) {
  return { cfg: state.cfg || {} };
}

function cell(wp, field, value, reason) {
  return { type: 'cell_suggestion', wp, field, value: value || '', reason: reason || '', cellKey: `${wp}_${field}` };
}
