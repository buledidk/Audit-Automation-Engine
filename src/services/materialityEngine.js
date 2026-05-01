/**
 * Materiality Engine — ISA 320 / ISA 450 compliant
 * Auto-selects benchmark, applies risk multiplier, computes PM and trivial threshold
 */

// ─── Benchmark selectors ───────────────────────────────────────────────────

const BENCHMARKS = {
  pbt:     { label: 'Profit Before Tax',  rate: 0.05 },
  revenue: { label: 'Revenue',            rateMin: 0.005, rateMax: 0.01 },
  assets:  { label: 'Total Assets',       rateMin: 0.01,  rateMax: 0.02 },
  equity:  { label: 'Equity',             rateMin: 0.02,  rateMax: 0.05 },
};

const RISK_MULTIPLIERS = { low: 1.0, medium: 0.75, high: 0.5 };
const PM_RATES         = { low: 0.75, medium: 0.625, high: 0.5 };
const TRIVIAL_RATE     = 0.05;

// ─── Auto-benchmark logic ──────────────────────────────────────────────────

function _selectBenchmark(financialData) {
  const { revenue, totalAssets, profitBeforeTax, equity } = financialData;

  // PBT: only if stable and positive
  if (profitBeforeTax > 0 && revenue > 0 && profitBeforeTax / revenue >= 0.03) {
    return {
      key: 'pbt',
      value: profitBeforeTax,
      rate: BENCHMARKS.pbt.rate,
      label: BENCHMARKS.pbt.label,
      reasoning: 'Entity is profit-oriented with stable positive PBT (≥3% margin). ISA 320 recommends 5% of PBT as default benchmark.',
    };
  }

  // Revenue: PBT volatile or loss-making
  if (revenue > 0 && (profitBeforeTax <= 0 || profitBeforeTax / revenue < 0.03)) {
    const rate = profitBeforeTax < 0 ? BENCHMARKS.revenue.rateMax : BENCHMARKS.revenue.rateMin;
    return {
      key: 'revenue',
      value: revenue,
      rate,
      label: BENCHMARKS.revenue.label,
      reasoning: profitBeforeTax < 0
        ? 'Entity is loss-making — revenue provides a more stable benchmark. Applied 1% rate.'
        : 'PBT margin <3% indicates volatility — revenue benchmark (0.5%) preferred.',
    };
  }

  // Assets: asset-heavy entities
  if (totalAssets > 0 && totalAssets > revenue * 2) {
    return {
      key: 'assets',
      value: totalAssets,
      rate: BENCHMARKS.assets.rateMin,
      label: BENCHMARKS.assets.label,
      reasoning: 'Asset-heavy entity (total assets >2× revenue) — typical for property, investment, or holding companies. Applied 1% of total assets.',
    };
  }

  // Equity: financial institutions or equity-driven entities
  if (equity > 0) {
    return {
      key: 'equity',
      value: equity,
      rate: BENCHMARKS.equity.rateMin,
      label: BENCHMARKS.equity.label,
      reasoning: 'Equity benchmark applied — appropriate for financial institutions, investment funds, or where equity is the primary metric for users.',
    };
  }

  return {
    key: 'revenue',
    value: revenue || 0,
    rate: BENCHMARKS.revenue.rateMin,
    label: BENCHMARKS.revenue.label,
    reasoning: 'Fallback to revenue benchmark — insufficient data to apply primary benchmarks.',
  };
}

// ─── Main export: calculateMateriality ────────────────────────────────────

/**
 * @param {Object} financialData  { revenue, totalAssets, profitBeforeTax, grossProfit, equity }
 * @param {'low'|'medium'|'high'} riskLevel
 */
export function calculateMateriality(financialData, riskLevel = 'medium') {
  const { value, rate, label, key, reasoning } = _selectBenchmark(financialData);
  const multiplier = RISK_MULTIPLIERS[riskLevel] ?? 0.75;
  const pmRate     = PM_RATES[riskLevel] ?? 0.625;

  const overall                = Math.round(value * rate * multiplier);
  const performanceMateriality = Math.round(overall * pmRate);
  const trivialThreshold       = Math.round(overall * TRIVIAL_RATE);

  return {
    overall,
    performanceMateriality,
    trivialThreshold,
    benchmark:           label,
    benchmarkKey:        key,
    benchmarkValue:      value,
    benchmarkPercentage: rate * 100,
    riskMultiplier:      multiplier,
    pmPercentage:        pmRate * 100,
    reasoning,
    isaReference: 'ISA 320 / ISA 450',
    notes: [
      `Overall materiality: ${overall.toLocaleString()} (${(rate * 100).toFixed(2)}% × ${label} × ${multiplier} risk multiplier)`,
      `Performance materiality: ${performanceMateriality.toLocaleString()} (${(pmRate * 100).toFixed(0)}% of overall — ${riskLevel} risk)`,
      `Trivial threshold: ${trivialThreshold.toLocaleString()} (5% of overall materiality per ISA 450.A3)`,
    ],
  };
}

// ─── evaluateMisstatements ─────────────────────────────────────────────────

/**
 * Classify aggregate uncorrected misstatements against materiality thresholds
 * @param {Array}  findings   [{ description, amount, adjustedByClient }]
 * @param {Object} materiality  result of calculateMateriality
 */
export function evaluateMisstatements(findings, materiality) {
  const uncorrected = findings.filter(f => !f.adjustedByClient);
  const aggregate   = uncorrected.reduce((sum, f) => sum + Math.abs(f.amount || 0), 0);

  let classification, implication, action;

  if (aggregate < materiality.trivialThreshold) {
    classification = 'below_trivial';
    implication    = 'Aggregate misstatements are below trivial threshold — no further action required.';
    action         = 'No accumulation required (ISA 450.A3)';
  } else if (aggregate < materiality.performanceMateriality) {
    classification = 'above_trivial_below_pm';
    implication    = 'Aggregate misstatements exceed trivial threshold but remain below performance materiality.';
    action         = 'Accumulate and monitor. Consider impact on audit opinion if further misstatements arise.';
  } else if (aggregate < materiality.overall) {
    classification = 'above_pm_below_overall';
    implication    = 'Aggregate misstatements exceed performance materiality — consider extending procedures.';
    action         = 'Extend audit procedures. Consider requesting management to correct misstatements.';
  } else {
    classification = 'above_overall';
    implication    = 'Aggregate misstatements exceed overall materiality — financial statements may be materially misstated.';
    action         = 'Require material adjustments or modify audit opinion (ISA 705).';
  }

  return {
    findings: uncorrected,
    aggregate,
    classification,
    implication,
    action,
    isaReference: 'ISA 450',
    thresholds: {
      trivial:                materiality.trivialThreshold,
      performanceMateriality: materiality.performanceMateriality,
      overall:                materiality.overall,
    },
  };
}

// ─── materialitySensitivity ────────────────────────────────────────────────

/**
 * Show how materiality varies across all 4 benchmarks
 * @param {Object} financialData
 */
export function materialitySensitivity(financialData) {
  const { revenue, totalAssets, profitBeforeTax, equity } = financialData;

  const scenarios = [
    { label: 'PBT (5%)',           value: profitBeforeTax, rate: 0.05 },
    { label: 'Revenue (0.5%)',     value: revenue,         rate: 0.005 },
    { label: 'Revenue (1%)',       value: revenue,         rate: 0.01 },
    { label: 'Total Assets (1%)',  value: totalAssets,     rate: 0.01 },
    { label: 'Total Assets (2%)',  value: totalAssets,     rate: 0.02 },
    { label: 'Equity (2%)',        value: equity,          rate: 0.02 },
    { label: 'Equity (5%)',        value: equity,          rate: 0.05 },
  ];

  return scenarios
    .filter(s => s.value > 0)
    .map(s => ({
      label:                   s.label,
      benchmarkValue:          s.value,
      rate:                    s.rate,
      overall:                 Math.round(s.value * s.rate),
      performanceMateriality:  Math.round(s.value * s.rate * 0.75),
      trivialThreshold:        Math.round(s.value * s.rate * 0.05),
    }))
    .sort((a, b) => a.overall - b.overall);
}

// ─── Cascading recalculation helper ───────────────────────────────────────

/**
 * When materiality changes, recalculate sample sizes and re-evaluate findings
 */
export function cascadeOnMaterialityChange(newMateriality, populationSize, existingFindings = []) {
  const { overall, performanceMateriality } = newMateriality;
  const tolerableRate       = performanceMateriality / (populationSize || 1);
  const suggestedSampleSize = Math.min(Math.ceil(1 / tolerableRate * 2.6), populationSize);
  const misstatementReview  = evaluateMisstatements(existingFindings, newMateriality);

  return {
    newMateriality,
    suggestedSampleSize,
    findingsImpact: misstatementReview,
    narrative: `With revised overall materiality of ${overall.toLocaleString()}, recommended sample size is ${suggestedSampleSize} items. ${misstatementReview.implication}`,
  };
}

// ─── MaterialityEngine class wrapper ─────────────────────────────────────
/**
 * Class wrapper around the functional API for consumers that
  * instantiate with `new MaterialityEngine()`.
   */
export class MaterialityEngine {
    calculateBaseMateriality(context) {
          const financialData = {
                  revenue: context.revenue || 0,
                  totalAssets: context.assets || 0,
                  profitBeforeTax: context.preTextProfit || 0,
                  equity: context.equity || 0,
          };
          const result = calculateMateriality(financialData, 'medium');
          return {
                  overall_materiality: result.overall,
                  performance_materiality: result.performanceMateriality,
                  trivial_threshold: result.trivialThreshold,
                  basis: result.benchmark,
                  calculation_method: `${result.benchmarkPercentage}% of ${result.benchmark}`,
                  justification: result.reasoning,
                  benchmark_results: Object.entries(BENCHMARKS).map(([key, b]) => ({
                            benchmark: b.label,
                            value: financialData[key === 'pbt' ? 'profitBeforeTax' : key === 'assets' ? 'totalAssets' : key] || 0,
                            basis: `${(b.rate || b.rateMin || 0) * 100}% of ${b.label}`,
                  })),
          };
    }

    performSensitivityAnalysis(overallMateriality) {
          const variations = [
            { label: '-20%', change: -20 },
            { label: '-10%', change: -10 },
            { label: 'Base', change: 0 },
            { label: '+10%', change: 10 },
            { label: '+20%', change: 20 },
                ];
          return {
                  sensitivity_scenarios: variations.map(v => ({
                            scenario: v.label,
                            change: v.change,
                            materiality: Math.round(overallMateriality * (1 + v.change / 100)),
                            impact: v.change === 0
                                        ? 'Current materiality level'
                                        : `${Math.abs(v.change)}% ${v.change > 0 ? 'increase' : 'decrease'} in materiality threshold`,
                  })),
                  recommended_range: {
                            low: Math.round(overallMateriality * 0.9),
                            high: Math.round(overallMateriality * 1.1),
                  },
          };
    }

    planScenarios(context) {
          const base = this.calculateBaseMateriality(context);
          return {
                  optimistic: {
                            description: 'Optimistic — Revenue growth 10%',
                            materiality: Math.round(base.overall_materiality * 1.1),
                            likelihood: 'Possible',
                            assumptions: ['Revenue grows 10%', 'Margins stable', 'No significant risks identified'],
                  },
                  base: {
                            description: 'Base case — Current financials',
                            materiality: base.overall_materiality,
                            likelihood: 'Most likely',
                            assumptions: ['Current year financials unchanged', 'Risk profile maintained'],
                  },
                  pessimistic: {
                            description: 'Pessimistic — Revenue decline 15%',
                            materiality: Math.round(base.overall_materiality * 0.85),
                            likelihood: 'Possible',
                            assumptions: ['Revenue declines 15%', 'Increased risk profile', 'Additional procedures needed'],
                  },
          };
    }

    calculateSampleSize(context) {
          const base = this.calculateBaseMateriality(context);
          const pop = context.populationSize || 1000;
          const tolerable = base.performance_materiality / pop;
          const sampleSize = Math.min(Math.ceil((1 / tolerable) * 2.6), pop);
          return {
                  recommended_sample_size: sampleSize,
                  sample_percentage: ((sampleSize / pop) * 100).toFixed(1),
                  confidence_level: '95%',
                  methodology: 'Monetary Unit Sampling (MUS)',
                  materiality_basis: `Based on performance materiality of ${base.performance_materiality.toLocaleString()}`,
          };
    }
}

export default MaterialityEngine;
