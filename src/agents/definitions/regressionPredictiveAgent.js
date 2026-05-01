// ═══════════════════════════════════════════════════════════════
// Regression & Predictive Analytics Agent — ISA 520
// ═══════════════════════════════════════════════════════════════

export const regressionPredictiveAgent = {
  id: 'regression_predictive',
  name: 'Regression & Predictive Analytics Agent',
  description: 'ISA 520 analytical procedures: OLS regression, revenue/cost/margin prediction models, seasonal decomposition, and expectation development with formal ISA 520 narrative output.',
  category: 'analytical_procedures',
  isaReferences: ['ISA 520', 'ISA 315', 'ISA 330'],

  analyze(historicalData, context = {}) {
    const data = historicalData || {};
    const ctx = context || {};
    const results = {
      revenueModel: {},
      costModel: {},
      marginPrediction: {},
      seasonalAnalysis: {},
      expectations: [],
      overallStatus: 'GREEN',
      warnings: [],
    };

    // ─── 1. REVENUE PREDICTION MODEL ─────────────────────────────────
    if (data.revenueSeries && data.revenueSeries.length >= 4) {
      results.revenueModel = _buildRevenuePredictionModel(data, ctx);
      if (results.revenueModel.status === 'RED') {
        results.warnings.push('Revenue prediction model: actual deviates from expectation by more than 2 standard deviations. Investigation required per ISA 520.');
      }
    }

    // ─── 2. COST PREDICTION MODEL ────────────────────────────────────
    if (data.costSeries && data.costSeries.length >= 4) {
      results.costModel = _buildCostPredictionModel(data);
    }

    // ─── 3. MARGIN PREDICTION ────────────────────────────────────────
    results.marginPrediction = _buildMarginPrediction(data, results.revenueModel, results.costModel);

    // ─── 4. SEASONAL PATTERN ANALYSIS ────────────────────────────────
    if (data.monthlySeries && data.monthlySeries.length >= 12) {
      results.seasonalAnalysis = _analyseSeasonalPatterns(data.monthlySeries);
    }

    // ─── 5. ISA 520 EXPECTATION DEVELOPMENT ──────────────────────────
    results.expectations = _developExpectations(data, ctx, results);

    // ─── 6. OVERALL STATUS ───────────────────────────────────────────
    const failedExpectations = results.expectations.filter(e => e.varianceExceedsThreshold);
    if (failedExpectations.length >= 3) results.overallStatus = 'RED';
    else if (failedExpectations.length >= 1) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      `ISA 520 ANALYTICAL PROCEDURES — REGRESSION & PREDICTIVE ANALYTICS`,
      `Overall Status: [${r.overallStatus}]`,
      '',
    ];

    if (r.revenueModel && r.revenueModel.rSquared !== undefined) {
      lines.push('REVENUE PREDICTION MODEL:');
      lines.push(`  • R-squared: ${r.revenueModel.rSquared} (${r.revenueModel.rSquared >= 0.8 ? 'Strong predictive model' : r.revenueModel.rSquared >= 0.6 ? 'Moderate model' : 'Weak — consider additional drivers'})`);
      lines.push(`  • Predicted revenue (current year): £${(r.revenueModel.predictedCurrent || 0).toLocaleString()}`);
      lines.push(`  • Actual revenue: £${(r.revenueModel.actualCurrent || 0).toLocaleString()}`);
      lines.push(`  • Variance: £${((r.revenueModel.variance || 0)).toLocaleString()} (${r.revenueModel.variancePct}%)`);
      lines.push(`  • Prediction interval: ±£${(r.revenueModel.predictionInterval || 0).toLocaleString()} (±2 std dev)`);
      lines.push(`  • Status: [${r.revenueModel.status}]`);
      lines.push('');
    }

    if (r.costModel && r.costModel.variableCost) {
      lines.push('COST PREDICTION MODEL:');
      lines.push(`  • Variable cost relationship: R² = ${r.costModel.variableCost.rSquared} [${r.costModel.variableCost.status}]`);
      lines.push(`  • Fixed cost base: £${(r.costModel.fixedCostBase || 0).toLocaleString()}`);
      lines.push('');
    }

    if (r.marginPrediction) {
      lines.push('MARGIN PREDICTION:');
      lines.push(`  • Predicted gross margin: ${r.marginPrediction.predictedGrossMarginPct}%`);
      lines.push(`  • Predicted operating margin: ${r.marginPrediction.predictedOperatingMarginPct}%`);
      lines.push(`  • Margin trend direction: ${r.marginPrediction.trendDirection}`);
      lines.push('');
    }

    if (r.seasonalAnalysis && r.seasonalAnalysis.seasonalIndices) {
      lines.push('SEASONAL PATTERN ANALYSIS:');
      lines.push(`  • Peak month: Month ${r.seasonalAnalysis.peakMonth} (index: ${r.seasonalAnalysis.peakIndex})`);
      lines.push(`  • Trough month: Month ${r.seasonalAnalysis.troughMonth} (index: ${r.seasonalAnalysis.troughIndex})`);
      lines.push(`  • Seasonal variation: ±${r.seasonalAnalysis.seasonalVariationPct}%`);
      lines.push(`  • Months deviating from seasonal pattern: ${r.seasonalAnalysis.deviatingMonths?.length || 0}`);
      lines.push('');
    }

    if (r.expectations && r.expectations.length > 0) {
      lines.push('ISA 520 EXPECTATION DEVELOPMENT:');
      r.expectations.forEach(exp => {
        lines.push('');
        lines.push(_formatExpectationNarrative(exp));
      });
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 520 paras 5-7`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['revenue', 'trade_debtors', 'inventory', 'ppe', 'payroll', 'trade_creditors'];
    const r = results || {};

    if (r.overallStatus === 'RED') sections.push('audit_differences', 'going_concern');
    if (r.revenueModel?.status === 'RED') sections.push('cut_off', 'related_parties');

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Regression & Predictive Analytics',
      isaReference: 'ISA 520',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Revenue Prediction Model',
          columns: ['Parameter', 'Value'],
          rows: [
            ['Model type', 'OLS Linear Regression'],
            ['R-squared', r.revenueModel?.rSquared],
            ['Intercept (b0)', r.revenueModel?.intercept],
            ['Slope (b1)', r.revenueModel?.slope],
            ['Predicted revenue (£)', r.revenueModel?.predictedCurrent],
            ['Actual revenue (£)', r.revenueModel?.actualCurrent],
            ['Variance (£)', r.revenueModel?.variance],
            ['Variance %', r.revenueModel?.variancePct],
            ['Prediction interval (±2 sd)', r.revenueModel?.predictionInterval],
            ['Status', r.revenueModel?.status],
          ],
        },
        {
          title: 'ISA 520 Expectations',
          columns: ['Procedure', 'Expected (£)', 'Actual (£)', 'Variance (£)', 'Threshold (£)', 'Exceeds?', 'Conclusion'],
          rows: (r.expectations || []).map(e => [
            e.procedureName, e.expectedAmount, e.actualAmount, e.variance,
            e.threshold, e.varianceExceedsThreshold ? 'YES' : 'No', e.conclusion,
          ]),
        },
        {
          title: 'Seasonal Analysis',
          columns: ['Month', 'Seasonal Index', 'Deviation from Expected', 'Flagged'],
          rows: r.seasonalAnalysis?.monthlyData
            ? r.seasonalAnalysis.monthlyData.map((m, i) => [
                `Month ${i + 1}`, m.seasonalIndex, m.deviationFromExpected, m.flagged ? 'YES' : ''
              ])
            : [],
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },

  // OLS Regression — from scratch implementation per spec
  _olsRegression(x, y) {
    const n = x.length;
    if (n < 2 || n !== y.length) return { b0: 0, b1: 0, rSquared: 0 };

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return { b0: sumY / n, b1: 0, rSquared: 0 };

    const b1 = (n * sumXY - sumX * sumY) / denom;
    const b0 = (sumY - b1 * sumX) / n;

    const yMean = sumY / n;
    const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (b0 + b1 * x[i]), 2), 0);
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    // Standard error of the estimate
    const se = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

    return { b0, b1, rSquared: _round(rSquared, 4), se };
  },
};

// ─── Revenue Prediction Model ────────────────────────────────────
function _buildRevenuePredictionModel(data, ctx) {
  const revSeries = data.revenueSeries || [];
  const n = revSeries.length;

  // Use time index as x, revenue as y
  const x = revSeries.map((_, i) => i + 1);
  const y = revSeries.map(r => r.value || r);

  const reg = regressionPredictiveAgent._olsRegression(x, y);

  // Predict current period (n+1)
  const predictedCurrent = reg.b0 + reg.b1 * (n + 1);
  const actualCurrent = data.currentRevenue || y[n - 1];
  const variance = actualCurrent - predictedCurrent;
  const variancePct = predictedCurrent !== 0 ? _round((variance / Math.abs(predictedCurrent)) * 100, 1) : null;

  // Prediction interval ±2 std deviations of residuals
  const predictionInterval = reg.se * 2;

  const deviationsFromPrediction = y.map((yi, i) => yi - (reg.b0 + reg.b1 * (i + 1)));
  const residualStdDev = _stdDev(deviationsFromPrediction);
  const zScore = residualStdDev > 0 ? Math.abs(variance) / residualStdDev : 0;

  let status = 'GREEN';
  if (zScore > 2) status = 'RED';
  else if (zScore > 1.5) status = 'AMBER';

  // Generate 12-month forward predictions
  const monthlyPredictions = [];
  for (let m = 1; m <= 12; m++) {
    const predicted = (reg.b0 + reg.b1 * (n + m / 12)) / 12;
    monthlyPredictions.push({ month: m, predicted: _round(predicted, 0) });
  }

  return {
    intercept: _round(reg.b0, 0),
    slope: _round(reg.b1, 0),
    rSquared: reg.rSquared,
    predictedCurrent: _round(predictedCurrent, 0),
    actualCurrent: _round(actualCurrent, 0),
    variance: _round(variance, 0),
    variancePct,
    predictionInterval: _round(predictionInterval, 0),
    zScore: _round(zScore, 2),
    status,
    monthlyPredictions,
    driverVariable: ctx.revenueDriver || 'Time trend',
    note: `R² = ${reg.rSquared}. ${reg.rSquared >= 0.8 ? 'Strong model.' : 'Consider additional driver variables to improve model fit.'}`,
  };
}

// ─── Cost Prediction Model ───────────────────────────────────────
function _buildCostPredictionModel(data) {
  const costSeries = data.costSeries || [];
  const revSeries = data.revenueSeries || [];
  const n = Math.min(costSeries.length, revSeries.length);

  if (n < 3) return { status: 'N/A', note: 'Insufficient data' };

  const y = costSeries.slice(0, n).map(c => c.value || c);
  const x = revSeries.slice(0, n).map(r => r.value || r);

  const variableReg = regressionPredictiveAgent._olsRegression(x, y);

  // Fixed costs are the intercept when revenue is zero
  const fixedCostBase = variableReg.b0;
  const variableCostRatio = variableReg.b1;

  // Semi-variable: if R² < 0.7 costs have a fixed component
  const costType = variableReg.rSquared > 0.85
    ? 'Predominantly variable — moves with revenue (R²=' + variableReg.rSquared + ')'
    : variableReg.rSquared > 0.5
      ? 'Semi-variable — partial correlation with revenue (R²=' + variableReg.rSquared + ')'
      : 'Predominantly fixed — little relationship with revenue (R²=' + variableReg.rSquared + ')';

  // Flag costs that don't follow expected relationship
  const residuals = y.map((yi, i) => yi - (variableReg.b0 + variableReg.b1 * x[i]));
  const residualSd = _stdDev(residuals);
  const anomalousMonths = residuals.map((r, i) => ({ period: i + 1, residual: _round(r, 0), flagged: Math.abs(r) > residualSd * 2 })).filter(m => m.flagged);

  return {
    variableCost: {
      rSquared: variableReg.rSquared,
      slope: _round(variableCostRatio, 4),
      interpretation: `${_round(variableCostRatio * 100, 1)}p per £1 of revenue`,
      status: variableReg.rSquared > 0.7 ? 'GREEN' : 'AMBER',
    },
    fixedCostBase: _round(fixedCostBase, 0),
    costType,
    anomalousMonths,
    status: anomalousMonths.length > 0 ? 'AMBER' : 'GREEN',
  };
}

// ─── Margin Prediction ───────────────────────────────────────────
function _buildMarginPrediction(data, _revenueModel, _costModel) {
  const marginSeries = data.grossMarginSeries || [];
  const opMarginSeries = data.operatingMarginSeries || [];

  const grossMarginTrend = marginSeries.length >= 3 ? _calculateTrend(marginSeries.map(m => m.value || m)) : null;
  const opMarginTrend = opMarginSeries.length >= 3 ? _calculateTrend(opMarginSeries.map(m => m.value || m)) : null;

  const lastGrossMargin = marginSeries.length > 0 ? marginSeries[marginSeries.length - 1] : null;
  const lastOpMargin = opMarginSeries.length > 0 ? opMarginSeries[opMarginSeries.length - 1] : null;

  const predictedGrossMarginPct = grossMarginTrend !== null
    ? _round((lastGrossMargin?.value || lastGrossMargin || 0) + grossMarginTrend, 1)
    : _round(lastGrossMargin?.value || lastGrossMargin || 0, 1);

  const predictedOperatingMarginPct = opMarginTrend !== null
    ? _round((lastOpMargin?.value || lastOpMargin || 0) + opMarginTrend, 1)
    : _round(lastOpMargin?.value || lastOpMargin || 0, 1);

  let trendDirection = 'Stable';
  if (grossMarginTrend !== null) {
    if (grossMarginTrend > 0.5) trendDirection = 'Improving';
    else if (grossMarginTrend < -0.5) trendDirection = 'Deteriorating';
  }

  return {
    predictedGrossMarginPct,
    predictedOperatingMarginPct,
    grossMarginTrend: _round(grossMarginTrend, 2),
    opMarginTrend: _round(opMarginTrend, 2),
    trendDirection,
    status: trendDirection === 'Deteriorating' ? 'AMBER' : 'GREEN',
  };
}

// ─── Seasonal Pattern Analysis ───────────────────────────────────
function _analyseSeasonalPatterns(monthlySeries) {
  if (!monthlySeries || monthlySeries.length < 12) return { status: 'N/A', note: 'Minimum 12 months required' };

  const values = monthlySeries.map(m => m.value || m);
  const n = values.length;
  const numYears = Math.floor(n / 12);

  // Calculate monthly averages across years
  const monthlyAverages = Array(12).fill(0).map((_, month) => {
    const monthValues = [];
    for (let y = 0; y < numYears; y++) {
      if (values[y * 12 + month] !== undefined) monthValues.push(values[y * 12 + month]);
    }
    return monthValues.length > 0 ? monthValues.reduce((a, b) => a + b, 0) / monthValues.length : 0;
  });

  const overallAverage = monthlyAverages.reduce((a, b) => a + b, 0) / 12;
  const seasonalIndices = monthlyAverages.map(avg => overallAverage > 0 ? _round(avg / overallAverage, 3) : 1);

  const peakIdx = seasonalIndices.indexOf(Math.max(...seasonalIndices));
  const troughIdx = seasonalIndices.indexOf(Math.min(...seasonalIndices));
  const seasonalVariationPct = _round((Math.max(...seasonalIndices) - Math.min(...seasonalIndices)) * 100, 1);

  // Compare latest year to expected seasonal pattern
  const latestYearStart = numYears > 1 ? (numYears - 1) * 12 : 0;
  const latestYearValues = values.slice(latestYearStart, latestYearStart + 12);
  const latestYearAvg = latestYearValues.length > 0 ? latestYearValues.reduce((a, b) => a + b, 0) / latestYearValues.length : 0;

  const monthlyData = latestYearValues.map((actual, i) => {
    const expected = latestYearAvg * seasonalIndices[i];
    const deviation = expected > 0 ? ((actual - expected) / expected) * 100 : 0;
    return {
      month: i + 1,
      actual: _round(actual, 0),
      expected: _round(expected, 0),
      seasonalIndex: seasonalIndices[i],
      deviationFromExpected: _round(deviation, 1),
      flagged: Math.abs(deviation) > 20,
    };
  });

  const deviatingMonths = monthlyData.filter(m => m.flagged);

  return {
    seasonalIndices,
    peakMonth: peakIdx + 1,
    peakIndex: seasonalIndices[peakIdx],
    troughMonth: troughIdx + 1,
    troughIndex: seasonalIndices[troughIdx],
    seasonalVariationPct,
    monthlyData,
    deviatingMonths,
    status: deviatingMonths.length > 2 ? 'AMBER' : 'GREEN',
  };
}

// ─── ISA 520 Expectation Development ─────────────────────────────
function _developExpectations(data, ctx, modelResults) {
  const expectations = [];
  const materiality = ctx.performanceMateriality || ctx.materiality || 0;
  const threshold = materiality > 0 ? materiality : null;

  // Revenue expectation
  if (modelResults.revenueModel?.predictedCurrent && data.currentRevenue) {
    const expected = modelResults.revenueModel.predictedCurrent;
    const actual = data.currentRevenue;
    const variance = actual - expected;
    const variancePct = expected !== 0 ? _round(Math.abs(variance / expected) * 100, 1) : null;
    const thr = threshold || Math.abs(expected * 0.05);
    expectations.push({
      procedureName: 'Revenue — Regression-based expectation (ISA 520)',
      basis: `OLS regression of revenue on ${ctx.revenueDriver || 'time trend'} (R²=${modelResults.revenueModel.rSquared})`,
      fsli: 'Revenue',
      expectedAmount: expected,
      actualAmount: actual,
      variance: _round(variance, 0),
      variancePct,
      threshold: _round(thr, 0),
      varianceExceedsThreshold: Math.abs(variance) > thr,
      investigationRequired: Math.abs(variance) > thr,
      explanation: Math.abs(variance) > thr
        ? 'Variance exceeds threshold — management explanation required and corroborating audit evidence to be obtained'
        : 'Variance within acceptable threshold',
      corroboratingEvidence: Math.abs(variance) > thr
        ? 'Inspect sales invoices, customer contracts, delivery notes for period. Review post year-end cash receipts.'
        : 'N/A',
      conclusion: Math.abs(variance) > thr ? 'Further procedures required' : 'Satisfactory',
      isaReference: 'ISA 520 para 5-7',
    });
  }

  // Cost expectations based on cost model
  if (modelResults.costModel?.variableCost && data.currentCost && data.currentRevenue) {
    const expectedCost = (modelResults.costModel.fixedCostBase || 0) + (modelResults.costModel.variableCost.slope || 0) * data.currentRevenue;
    const actualCost = data.currentCost;
    const costVariance = actualCost - expectedCost;
    const thr = threshold || Math.abs(expectedCost * 0.05);
    expectations.push({
      procedureName: 'Cost of Sales — Variable cost regression model (ISA 520)',
      basis: `Cost of sales modelled as function of revenue. Variable cost ratio: ${_round((modelResults.costModel.variableCost.slope || 0) * 100, 1)}p per £1 revenue`,
      fsli: 'Cost of Sales',
      expectedAmount: _round(expectedCost, 0),
      actualAmount: _round(actualCost, 0),
      variance: _round(costVariance, 0),
      variancePct: expectedCost !== 0 ? _round(Math.abs(costVariance / expectedCost) * 100, 1) : null,
      threshold: _round(thr, 0),
      varianceExceedsThreshold: Math.abs(costVariance) > thr,
      investigationRequired: Math.abs(costVariance) > thr,
      explanation: Math.abs(costVariance) > thr
        ? 'Cost variance exceeds threshold — consider cut-off issues, accruals, inventory obsolescence'
        : 'Cost variance within threshold',
      corroboratingEvidence: Math.abs(costVariance) > thr
        ? 'Inspect purchase invoices and GRNs near year end. Review accruals schedule. Test inventory valuation.'
        : 'N/A',
      conclusion: Math.abs(costVariance) > thr ? 'Further procedures required' : 'Satisfactory',
      isaReference: 'ISA 520 para 5-7',
    });
  }

  return expectations;
}

function _formatExpectationNarrative(exp) {
  return [
    `ANALYTICAL PROCEDURE: ${exp.procedureName}`,
    `Expectation: Based on ${exp.basis}, we expected ${exp.fsli} to be approximately £${(exp.expectedAmount || 0).toLocaleString()} ± £${(exp.threshold || 0).toLocaleString()}.`,
    `Actual: £${(exp.actualAmount || 0).toLocaleString()}`,
    `Variance: £${(exp.variance || 0).toLocaleString()} (${exp.variancePct}%)`,
    `Threshold: £${(exp.threshold || 0).toLocaleString()}`,
    `Variance exceeds threshold: ${exp.varianceExceedsThreshold ? 'Yes — investigation required' : 'No'}`,
    exp.varianceExceedsThreshold ? `Investigation explanation: ${exp.explanation}` : '',
    `Corroborating evidence: ${exp.corroboratingEvidence}`,
    `Conclusion: ${exp.conclusion}`,
    `ISA Reference: ${exp.isaReference}`,
  ].filter(Boolean).join('\n');
}

// ─── Statistical Helpers ─────────────────────────────────────────
function _stdDev(arr) {
  if (!arr || arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function _calculateTrend(series) {
  if (!series || series.length < 2) return null;
  const n = series.length;
  const x = series.map((_, i) => i + 1);
  const y = series;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
  const denom = n * sumXX - sumX * sumX;
  return denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
}

function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
