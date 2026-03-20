/**
 * FINANCIAL RATIO ANALYSIS ENGINE
 * Comprehensive ratio computation, scoring, trend analysis, and benchmarking
 * Integrates with FTSE 250 sector data and ISA-aligned audit intelligence
 */

import {
  ALL_RATIOS,
  RATIO_CATEGORIES,
  PROFITABILITY_RATIOS,
  LIQUIDITY_RATIOS,
  SOLVENCY_RATIOS,
  EFFICIENCY_RATIOS,
  INVESTOR_RATIOS,
  CASH_FLOW_RATIOS,
  COMPOSITE_SCORES,
  getBenchmarks
} from '../data/ratioDefinitions.js';

import { FTSE_250_SECTOR_BENCHMARKS, getSectorBenchmarks, matchCompanyToSector } from '../data/ftse250Data.js';

export class FinancialRatioEngine {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 3600000; // 1 hour
  }

  // ==========================================================================
  // CORE: Compute all ratios from financial data
  // ==========================================================================

  /**
   * Calculate all applicable ratios from financial data
   * @param {object} financialData - Financial statement data
   * @param {object} priorYear - Prior year data (for trend/composite scores)
   * @param {object} options - { sector, entityType, includeInvestor }
   * @returns {object} Complete ratio analysis
   */
  calculateAllRatios(financialData, priorYear = null, options = {}) {
    const results = {
      timestamp: new Date().toISOString(),
      entityType: options.entityType || 'private',
      sector: options.sector || 'general',
      ratios: {},
      categories: {},
      scores: {},
      alerts: [],
      goingConcernIndicators: [],
      auditFocusAreas: []
    };

    // Calculate each category
    results.categories.Profitability = this._calculateCategory(PROFITABILITY_RATIOS, financialData);
    results.categories.Liquidity = this._calculateCategory(LIQUIDITY_RATIOS, financialData);
    results.categories.Solvency = this._calculateCategory(SOLVENCY_RATIOS, financialData);
    results.categories.Efficiency = this._calculateCategory(EFFICIENCY_RATIOS, financialData);
    results.categories['Cash Flow'] = this._calculateCategory(CASH_FLOW_RATIOS, financialData);

    // Investor ratios only for listed/large entities
    if (options.includeInvestor || options.entityType === 'plc' || options.entityType === 'large') {
      results.categories.Investor = this._calculateCategory(INVESTOR_RATIOS, financialData);
    }

    // Composite scores
    if (COMPOSITE_SCORES.altmanZScore) {
      const zScore = COMPOSITE_SCORES.altmanZScore.formulaFn(financialData);
      results.scores.altmanZScore = {
        value: Math.round(zScore * 100) / 100,
        interpretation: zScore > 3 ? 'Safe Zone' : zScore > 1.8 ? 'Grey Zone' : 'Distress Zone',
        color: zScore > 3 ? '#22c55e' : zScore > 1.8 ? '#f59e0b' : '#ef4444'
      };
    }

    if (priorYear && COMPOSITE_SCORES.piotroskiFScore) {
      const fScore = COMPOSITE_SCORES.piotroskiFScore.formulaFn(financialData, priorYear);
      results.scores.piotroskiFScore = {
        value: fScore,
        maxScore: 9,
        interpretation: fScore >= 8 ? 'Strong' : fScore >= 5 ? 'Moderate' : 'Weak'
      };
    }

    // Flatten all ratios
    for (const [, categoryRatios] of Object.entries(results.categories)) {
      for (const [key, ratio] of Object.entries(categoryRatios)) {
        results.ratios[key] = ratio;
      }
    }

    // Benchmark comparison
    results.benchmarkComparison = this._benchmarkAgainstSector(results.ratios, options.sector || 'general');

    // Detect alerts and going concern indicators
    results.alerts = this._detectAlerts(results.ratios, financialData);
    results.goingConcernIndicators = this._detectGoingConcernIndicators(results.ratios, financialData);
    results.auditFocusAreas = this._identifyAuditFocusAreas(results);

    // Trend analysis if prior year provided
    if (priorYear) {
      results.trendAnalysis = this.calculateTrendAnalysis(financialData, priorYear, options);
    }

    // Overall health score
    results.overallHealthScore = this._calculateHealthScore(results);

    return results;
  }

  // ==========================================================================
  // CATEGORY COMPUTATION
  // ==========================================================================

  _calculateCategory(ratioDefinitions, data) {
    const results = {};
    for (const [key, definition] of Object.entries(ratioDefinitions)) {
      try {
        const value = definition.formulaFn(data);
        if (value !== null && value !== undefined && isFinite(value)) {
          results[key] = {
            id: definition.id,
            name: definition.name,
            value: Math.round(value * 100) / 100,
            unit: definition.unit,
            formula: definition.formula,
            category: definition.category,
            higherIsBetter: definition.higherIsBetter,
            references: definition.references
          };
        }
      } catch {
        // Skip ratios that can't be calculated with available data
      }
    }
    return results;
  }

  // ==========================================================================
  // BENCHMARKING
  // ==========================================================================

  /**
   * Compare calculated ratios against sector benchmarks
   */
  _benchmarkAgainstSector(ratios, sector) {
    const comparison = {};

    for (const [key, ratio] of Object.entries(ratios)) {
      const benchmark = getBenchmarks(key, sector);
      if (!benchmark) continue;

      let position;
      if (ALL_RATIOS[key]?.higherIsBetter === false) {
        // Lower is better (e.g., debtor days, gearing)
        position = ratio.value <= benchmark.low ? 'excellent'
          : ratio.value <= benchmark.median ? 'good'
          : ratio.value <= benchmark.high ? 'below_average'
          : 'poor';
      } else if (ALL_RATIOS[key]?.higherIsBetter === true) {
        position = ratio.value >= benchmark.high ? 'excellent'
          : ratio.value >= benchmark.median ? 'good'
          : ratio.value >= benchmark.low ? 'below_average'
          : 'poor';
      } else {
        // Neutral — just show where it falls
        position = ratio.value >= benchmark.low && ratio.value <= benchmark.high ? 'within_range' : 'outside_range';
      }

      comparison[key] = {
        ratioName: ratio.name,
        value: ratio.value,
        unit: ratio.unit,
        benchmark,
        position,
        percentile: this._estimatePercentile(ratio.value, benchmark),
        color: position === 'excellent' ? '#22c55e' : position === 'good' ? '#3b82f6' : position === 'below_average' ? '#f59e0b' : position === 'poor' ? '#ef4444' : '#6b7280'
      };
    }

    return comparison;
  }

  _estimatePercentile(value, benchmark) {
    if (!benchmark) return null;
    const range = benchmark.high - benchmark.low;
    if (range === 0) return 50;
    const pct = ((value - benchmark.low) / range) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  }

  /**
   * Compare entity ratios against FTSE 250 sector benchmarks
   */
  benchmarkAgainstFTSE250(ratios, companyName, sicCode) {
    const sector = matchCompanyToSector(sicCode);
    const sectorBenchmarks = getSectorBenchmarks(sector);

    if (!sectorBenchmarks) return null;

    const comparison = {};
    const sectorRatios = sectorBenchmarks.typicalRatios;

    for (const [key, sectorValue] of Object.entries(sectorRatios)) {
      if (ratios[key]) {
        const deviation = ratios[key].value - sectorValue.median;
        const deviationPct = sectorValue.median ? (deviation / Math.abs(sectorValue.median)) * 100 : 0;

        comparison[key] = {
          entityValue: ratios[key].value,
          sectorMedian: sectorValue.median,
          sectorRange: { low: sectorValue.low, high: sectorValue.high },
          deviation: Math.round(deviation * 100) / 100,
          deviationPercent: Math.round(deviationPct * 10) / 10,
          signal: Math.abs(deviationPct) < 15 ? 'inline' : deviationPct > 0 === ratios[key].higherIsBetter ? 'outperforming' : 'underperforming'
        };
      }
    }

    return {
      sector,
      sectorName: sectorBenchmarks.name,
      sampleSize: sectorBenchmarks.sampleSize,
      comparison
    };
  }

  // ==========================================================================
  // TREND ANALYSIS
  // ==========================================================================

  /**
   * Year-on-year trend analysis
   */
  calculateTrendAnalysis(currentYear, priorYear, options = {}) {
    const currentRatios = this._calculateCategory({ ...PROFITABILITY_RATIOS, ...LIQUIDITY_RATIOS, ...SOLVENCY_RATIOS, ...EFFICIENCY_RATIOS, ...CASH_FLOW_RATIOS }, currentYear);
    const priorRatios = this._calculateCategory({ ...PROFITABILITY_RATIOS, ...LIQUIDITY_RATIOS, ...SOLVENCY_RATIOS, ...EFFICIENCY_RATIOS, ...CASH_FLOW_RATIOS }, priorYear);

    const trends = {};

    for (const [key, current] of Object.entries(currentRatios)) {
      const prior = priorRatios[key];
      if (!prior) continue;

      const absoluteChange = current.value - prior.value;
      const percentChange = prior.value !== 0 ? (absoluteChange / Math.abs(prior.value)) * 100 : null;

      const definition = ALL_RATIOS[key];
      let direction = 'stable';
      if (Math.abs(absoluteChange) > 0.5) {
        direction = absoluteChange > 0 ? 'improving' : 'deteriorating';
        if (definition?.higherIsBetter === false) {
          direction = absoluteChange > 0 ? 'deteriorating' : 'improving';
        }
      }

      const materialThreshold = options.materialityThreshold || 10; // % change
      const isMaterial = percentChange !== null && Math.abs(percentChange) > materialThreshold;

      trends[key] = {
        name: current.name,
        currentValue: current.value,
        priorValue: prior.value,
        absoluteChange: Math.round(absoluteChange * 100) / 100,
        percentChange: percentChange !== null ? Math.round(percentChange * 10) / 10 : null,
        direction,
        isMaterial,
        unit: current.unit,
        auditImplication: isMaterial ? this._getAuditImplication(key, direction) : null
      };
    }

    return {
      periodComparison: `${options.currentYear || 'Current'} vs ${options.priorYear || 'Prior'}`,
      trends,
      materialChanges: Object.entries(trends).filter(([, t]) => t.isMaterial).map(([key, t]) => ({ ratioId: key, ...t })),
      improvingCount: Object.values(trends).filter(t => t.direction === 'improving').length,
      deterioratingCount: Object.values(trends).filter(t => t.direction === 'deteriorating').length,
      stableCount: Object.values(trends).filter(t => t.direction === 'stable').length
    };
  }

  _getAuditImplication(ratioKey, direction) {
    const implications = {
      grossProfitMargin: direction === 'deteriorating'
        ? 'Investigate cost pressures, pricing changes, or possible misclassification between COS and operating expenses (ISA 520)'
        : 'Verify no revenue overstatement or cost understatement near period end (ISA 240)',
      currentRatio: direction === 'deteriorating'
        ? 'Going concern indicator — assess liquidity position and cash flow forecasts (ISA 570)'
        : null,
      debtorDays: direction === 'deteriorating'
        ? 'Test receivables recoverability; review aged debtor analysis; assess bad debt provision adequacy (ISA 540)'
        : null,
      interestCover: direction === 'deteriorating'
        ? 'Check loan covenant compliance; assess refinancing risk; going concern consideration (ISA 570)'
        : null,
      cashConversionRatio: direction === 'deteriorating'
        ? 'Low cash conversion may indicate earnings management — investigate working capital movements (ISA 240)'
        : null,
      inventoryDays: direction === 'deteriorating'
        ? 'Test for obsolete/slow-moving stock; verify NRV write-down adequacy (ISA 501, ISA 540)'
        : null
    };

    return implications[ratioKey] || `Material ${direction} trend — investigate as part of ISA 520 analytical procedures`;
  }

  // ==========================================================================
  // ALERT DETECTION
  // ==========================================================================

  _detectAlerts(ratios, data) {
    const alerts = [];

    // Current ratio < 1
    if (ratios.currentRatio?.value < 1.0) {
      alerts.push({
        severity: 'critical',
        ratio: 'currentRatio',
        message: `Current ratio is ${ratios.currentRatio.value}x — below 1.0 indicates potential inability to meet short-term obligations`,
        isaReference: 'ISA 570.A3',
        action: 'Perform going concern procedures; assess management cash flow forecasts'
      });
    }

    // Interest cover < 1.5
    if (ratios.interestCover?.value < 1.5) {
      alerts.push({
        severity: 'critical',
        ratio: 'interestCover',
        message: `Interest cover is ${ratios.interestCover.value}x — entity may not be able to service debt`,
        isaReference: 'ISA 570',
        action: 'Review loan covenant terms; assess renewal/refinancing prospects'
      });
    }

    // Negative working capital
    if (ratios.workingCapital?.value < 0) {
      alerts.push({
        severity: 'high',
        ratio: 'workingCapital',
        message: `Negative working capital of £${Math.abs(ratios.workingCapital.value).toLocaleString()}`,
        isaReference: 'ISA 570.A3',
        action: 'Assess whether normal for sector (e.g., supermarkets); otherwise going concern consideration'
      });
    }

    // Gross margin anomaly
    if (ratios.grossProfitMargin?.value > 90) {
      alerts.push({
        severity: 'medium',
        ratio: 'grossProfitMargin',
        message: `Unusually high gross margin (${ratios.grossProfitMargin.value}%) — verify revenue/COS classification`,
        isaReference: 'ISA 240, ISA 520',
        action: 'Test COS completeness; verify no operating expenses misclassified as below gross profit'
      });
    }

    // Debtor days > 90
    if (ratios.debtorDays?.value > 90) {
      alerts.push({
        severity: 'high',
        ratio: 'debtorDays',
        message: `Debtor days of ${ratios.debtorDays.value} — significantly above normal collection period`,
        isaReference: 'ISA 540, ISA 505',
        action: 'Review aged debtor analysis; send confirmations; assess provision adequacy'
      });
    }

    // Cash conversion ratio < 50%
    if (ratios.cashConversionRatio?.value < 50) {
      alerts.push({
        severity: 'high',
        ratio: 'cashConversionRatio',
        message: `Low cash conversion (${ratios.cashConversionRatio.value}%) — profits not converting to cash`,
        isaReference: 'ISA 240, ISA 520',
        action: 'Investigate working capital movements; test for earnings management'
      });
    }

    // Altman Z-Score distress
    if (ratios.altmanZScore?.value < 1.8) {
      alerts.push({
        severity: 'critical',
        ratio: 'altmanZScore',
        message: `Altman Z-Score is ${ratios.altmanZScore.value} — Distress Zone (bankruptcy risk)`,
        isaReference: 'ISA 570',
        action: 'Comprehensive going concern assessment required'
      });
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ==========================================================================
  // GOING CONCERN INDICATORS
  // ==========================================================================

  _detectGoingConcernIndicators(ratios, data) {
    const indicators = [];

    const checks = [
      { condition: ratios.currentRatio?.value < 1.0, indicator: 'Net current liability position', severity: 'high' },
      { condition: ratios.interestCover?.value < 1.5, indicator: 'Inability to service debt from operating profits', severity: 'high' },
      { condition: ratios.workingCapital?.value < 0, indicator: 'Negative working capital', severity: 'high' },
      { condition: data.operatingCashFlow < 0, indicator: 'Negative operating cash flow', severity: 'high' },
      { condition: ratios.debtToEquity?.value > 3.0, indicator: 'Excessive gearing (D/E > 3.0)', severity: 'medium' },
      { condition: ratios.quickRatio?.value < 0.5, indicator: 'Very low quick ratio — limited liquid assets', severity: 'medium' },
      { condition: data.profitAfterTax < 0, indicator: 'Loss-making entity', severity: 'medium' },
      { condition: ratios.cashRatio?.value < 0.05, indicator: 'Minimal cash reserves', severity: 'medium' },
      { condition: ratios.defensiveInterval?.value < 30, indicator: 'Less than 30 days operating cash cover', severity: 'high' },
      { condition: ratios.dividendCover?.value < 1.0 && ratios.dividendCover?.value > 0, indicator: 'Dividends exceed earnings — unsustainable', severity: 'medium' }
    ];

    for (const check of checks) {
      if (check.condition) {
        indicators.push({
          indicator: check.indicator,
          severity: check.severity,
          isaReference: 'ISA 570.A3',
          auditAction: 'Include in going concern assessment; evaluate management response and plans'
        });
      }
    }

    return indicators;
  }

  // ==========================================================================
  // AUDIT FOCUS AREAS
  // ==========================================================================

  _identifyAuditFocusAreas(results) {
    const focusAreas = [];

    const criticalAlerts = results.alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      focusAreas.push({
        area: 'Going Concern',
        priority: 'Critical',
        rationale: `${criticalAlerts.length} critical alert(s) detected`,
        procedures: ['Evaluate management going concern assessment', 'Review cash flow forecasts', 'Assess loan covenant compliance', 'Obtain management representations'],
        isaReference: 'ISA 570'
      });
    }

    if (results.ratios.grossProfitMargin && results.trendAnalysis?.trends?.grossProfitMargin?.isMaterial) {
      focusAreas.push({
        area: 'Revenue & Cost Recognition',
        priority: 'High',
        rationale: 'Material change in gross profit margin detected',
        procedures: ['Extended revenue cut-off testing', 'COS completeness verification', 'Analytical review of margin by product/service line'],
        isaReference: 'ISA 240, ISA 520'
      });
    }

    if (results.ratios.debtorDays?.value > 60) {
      focusAreas.push({
        area: 'Trade Receivables',
        priority: 'High',
        rationale: `Debtor days at ${results.ratios.debtorDays.value} — above standard`,
        procedures: ['Aged debtor analysis review', 'External confirmations (ISA 505)', 'Post-year-end cash receipts testing', 'Bad debt provision assessment (ISA 540)'],
        isaReference: 'ISA 505, ISA 540'
      });
    }

    if (results.ratios.inventoryDays?.value > 80) {
      focusAreas.push({
        area: 'Inventory',
        priority: 'Medium',
        rationale: `Inventory days at ${results.ratios.inventoryDays.value} — possible slow-moving stock`,
        procedures: ['Attend year-end stock count (ISA 501)', 'NRV testing', 'Obsolescence provision review', 'Test slow-moving report'],
        isaReference: 'ISA 501, ISA 540'
      });
    }

    return focusAreas;
  }

  // ==========================================================================
  // HEALTH SCORE
  // ==========================================================================

  _calculateHealthScore(results) {
    let score = 100;
    const factors = [];

    // Deduct for critical alerts
    const criticalCount = results.alerts.filter(a => a.severity === 'critical').length;
    const highCount = results.alerts.filter(a => a.severity === 'high').length;
    score -= criticalCount * 20;
    score -= highCount * 10;

    // Going concern indicators
    score -= results.goingConcernIndicators.length * 8;

    // Positive signals
    if (results.ratios.currentRatio?.value > 1.5) { score += 5; factors.push('Healthy liquidity'); }
    if (results.ratios.interestCover?.value > 3.0) { score += 5; factors.push('Strong debt service capacity'); }
    if (results.ratios.grossProfitMargin?.value > 30) { score += 3; factors.push('Good margins'); }
    if (results.ratios.cashConversionRatio?.value > 80) { score += 5; factors.push('Strong cash conversion'); }

    // Z-Score adjustment
    if (results.scores.altmanZScore) {
      if (results.scores.altmanZScore.value > 3) { score += 10; factors.push('Altman Safe Zone'); }
      else if (results.scores.altmanZScore.value < 1.8) { score -= 15; factors.push('Altman Distress Zone'); }
    }

    score = Math.min(100, Math.max(0, score));

    let grade;
    if (score >= 80) grade = 'A';
    else if (score >= 65) grade = 'B';
    else if (score >= 50) grade = 'C';
    else if (score >= 35) grade = 'D';
    else grade = 'F';

    return {
      score,
      grade,
      label: grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Adequate' : grade === 'D' ? 'Weak' : 'Critical',
      color: grade === 'A' ? '#22c55e' : grade === 'B' ? '#3b82f6' : grade === 'C' ? '#f59e0b' : grade === 'D' ? '#f97316' : '#ef4444',
      factors
    };
  }

  // ==========================================================================
  // DuPont ANALYSIS
  // ==========================================================================

  /**
   * Perform DuPont decomposition of ROE
   */
  dupontAnalysis(data) {
    const netProfitMargin = data.revenue ? (data.profitAfterTax / data.revenue) * 100 : null;
    const assetTurnover = data.totalAssets ? data.revenue / data.totalAssets : null;
    const equityMultiplier = data.totalEquity ? data.totalAssets / data.totalEquity : null;
    const roe = data.totalEquity ? (data.profitAfterTax / data.totalEquity) * 100 : null;

    // 5-way decomposition
    const taxBurden = data.profitBeforeTax ? data.profitAfterTax / data.profitBeforeTax : null;
    const interestBurden = data.operatingProfit ? data.profitBeforeTax / data.operatingProfit : null;
    const operatingMargin = data.revenue ? (data.operatingProfit / data.revenue) * 100 : null;

    return {
      threeWay: {
        netProfitMargin: netProfitMargin ? Math.round(netProfitMargin * 100) / 100 : null,
        assetTurnover: assetTurnover ? Math.round(assetTurnover * 100) / 100 : null,
        equityMultiplier: equityMultiplier ? Math.round(equityMultiplier * 100) / 100 : null,
        roe: roe ? Math.round(roe * 100) / 100 : null,
        formula: 'ROE = Net Profit Margin × Asset Turnover × Equity Multiplier'
      },
      fiveWay: {
        taxBurden: taxBurden ? Math.round(taxBurden * 1000) / 1000 : null,
        interestBurden: interestBurden ? Math.round(interestBurden * 1000) / 1000 : null,
        operatingMargin: operatingMargin ? Math.round(operatingMargin * 100) / 100 : null,
        assetTurnover: assetTurnover ? Math.round(assetTurnover * 100) / 100 : null,
        equityMultiplier: equityMultiplier ? Math.round(equityMultiplier * 100) / 100 : null,
        formula: 'ROE = Tax Burden × Interest Burden × Operating Margin × Asset Turnover × Equity Multiplier'
      },
      interpretation: {
        primaryDriver: !netProfitMargin ? 'Insufficient data' :
          netProfitMargin < 5 ? 'Low profitability is the main constraint on ROE' :
          assetTurnover < 0.5 ? 'Low asset utilisation is limiting ROE' :
          equityMultiplier > 3 ? 'High leverage is inflating ROE — assess sustainability' :
          'Balanced ROE composition'
      }
    };
  }

  // ==========================================================================
  // PEER COMPARISON
  // ==========================================================================

  /**
   * Compare entity against peer group
   * @param {object} entityRatios - Entity's calculated ratios
   * @param {Array} peerRatios - Array of peer company ratio objects
   * @returns {object} Peer comparison
   */
  peerComparison(entityRatios, peerRatios) {
    const comparison = {};
    const keyMetrics = ['grossProfitMargin', 'operatingProfitMargin', 'returnOnEquity', 'currentRatio',
      'debtToEquity', 'debtorDays', 'assetTurnover', 'interestCover'];

    for (const metric of keyMetrics) {
      if (!entityRatios[metric]) continue;

      const peerValues = peerRatios
        .map(p => p[metric]?.value)
        .filter(v => v !== null && v !== undefined)
        .sort((a, b) => a - b);

      if (peerValues.length === 0) continue;

      const median = peerValues[Math.floor(peerValues.length / 2)];
      const q1 = peerValues[Math.floor(peerValues.length * 0.25)];
      const q3 = peerValues[Math.floor(peerValues.length * 0.75)];
      const min = peerValues[0];
      const max = peerValues[peerValues.length - 1];

      const rank = peerValues.filter(v => v <= entityRatios[metric].value).length;
      const percentileRank = Math.round((rank / peerValues.length) * 100);

      comparison[metric] = {
        entityValue: entityRatios[metric].value,
        peerMedian: Math.round(median * 100) / 100,
        peerQ1: Math.round(q1 * 100) / 100,
        peerQ3: Math.round(q3 * 100) / 100,
        peerMin: Math.round(min * 100) / 100,
        peerMax: Math.round(max * 100) / 100,
        percentileRank,
        peerCount: peerValues.length,
        position: percentileRank >= 75 ? 'top_quartile' : percentileRank >= 50 ? 'above_median' : percentileRank >= 25 ? 'below_median' : 'bottom_quartile'
      };
    }

    return comparison;
  }

  // ==========================================================================
  // ENTITY-TYPE SPECIFIC ANALYSIS
  // ==========================================================================

  /**
   * Get appropriate ratio set for entity type
   * Micro/small entities get simplified; PLC/large get full investor ratios
   */
  getRatioSetForEntityType(entityType) {
    const base = ['Profitability', 'Liquidity', 'Solvency', 'Efficiency', 'Cash Flow'];

    switch (entityType) {
      case 'micro':
        return {
          categories: ['Profitability', 'Liquidity'],
          keyRatios: ['grossProfitMargin', 'netProfitMargin', 'currentRatio', 'quickRatio', 'debtorDays', 'creditorDays'],
          label: 'Micro-entity Simplified Analysis'
        };
      case 'small':
        return {
          categories: ['Profitability', 'Liquidity', 'Efficiency'],
          keyRatios: ['grossProfitMargin', 'netProfitMargin', 'returnOnEquity', 'currentRatio', 'quickRatio',
            'debtToEquity', 'debtorDays', 'creditorDays', 'inventoryDays', 'cashConversionCycle'],
          label: 'Small Entity Analysis'
        };
      case 'medium':
        return {
          categories: base,
          keyRatios: Object.keys({ ...PROFITABILITY_RATIOS, ...LIQUIDITY_RATIOS, ...SOLVENCY_RATIOS, ...EFFICIENCY_RATIOS, ...CASH_FLOW_RATIOS }),
          includeComposites: true,
          label: 'Medium Entity Full Analysis'
        };
      case 'large':
        return {
          categories: [...base, 'Investor'],
          keyRatios: Object.keys(ALL_RATIOS),
          includeComposites: true,
          includeDupont: true,
          label: 'Large Entity Comprehensive Analysis'
        };
      case 'plc':
        return {
          categories: [...base, 'Investor', 'Composite'],
          keyRatios: Object.keys(ALL_RATIOS),
          includeComposites: true,
          includeDupont: true,
          includeFTSEBenchmark: true,
          label: 'PLC / Listed Entity Full Investor Analysis'
        };
      default:
        return {
          categories: base,
          keyRatios: Object.keys({ ...PROFITABILITY_RATIOS, ...LIQUIDITY_RATIOS, ...SOLVENCY_RATIOS, ...EFFICIENCY_RATIOS }),
          label: 'Standard Analysis'
        };
    }
  }
}

export default FinancialRatioEngine;
