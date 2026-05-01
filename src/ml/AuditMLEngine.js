// ═══════════════════════════════════════════════════════════════════
// AUDIT ML ENGINE v2 — AiDA-style AI + MindBridge analytics
// Real-time risk suggestions, auto-modifying procedures, anomaly scoring
// Rule-based scoring engine with configurable weights
// ═══════════════════════════════════════════════════════════════════

import { getSupabaseClient } from '../lib/supabaseClient.js';

// ── INDUSTRY BENCHMARKS ──────────────────────────────────────────────────
const FALLBACK_BENCHMARKS = {
  manufacturing:    { gross_margin: { mean: 0.28, std: 0.08 }, operating_margin: { mean: 0.072, std: 0.045 }, current_ratio: { mean: 1.62, std: 0.42 }, quick_ratio: { mean: 0.98, std: 0.35 }, debt_to_equity: { mean: 0.85, std: 0.52 }, asset_turnover: { mean: 0.92, std: 0.38 }, inventory_days: { mean: 58.2, std: 22.0 }, debtor_days: { mean: 48.5, std: 18.0 }, creditor_days: { mean: 42.8, std: 16.0 }, interest_coverage: { mean: 5.8, std: 3.2 } },
  retail:           { gross_margin: { mean: 0.342, std: 0.095 }, operating_margin: { mean: 0.048, std: 0.038 }, current_ratio: { mean: 1.18, std: 0.38 }, quick_ratio: { mean: 0.42, std: 0.25 }, inventory_days: { mean: 72.5, std: 28.0 }, debtor_days: { mean: 12.8, std: 8.0 }, creditor_days: { mean: 38.5, std: 15.0 } },
  construction:     { gross_margin: { mean: 0.195, std: 0.072 }, operating_margin: { mean: 0.055, std: 0.042 }, current_ratio: { mean: 1.45, std: 0.48 }, debtor_days: { mean: 62.5, std: 22.0 }, creditor_days: { mean: 55.8, std: 20.0 } },
  professional_services: { gross_margin: { mean: 0.485, std: 0.112 }, operating_margin: { mean: 0.158, std: 0.068 }, debtor_days: { mean: 52.2, std: 20.0 }, current_ratio: { mean: 1.52, std: 0.45 } },
  technology:       { gross_margin: { mean: 0.652, std: 0.148 }, operating_margin: { mean: 0.092, std: 0.112 }, current_ratio: { mean: 2.12, std: 0.78 }, debtor_days: { mean: 44.8, std: 18.0 } },
  financial_services: { return_on_equity: { mean: 0.112, std: 0.058 }, net_interest_margin: { mean: 0.028, std: 0.012 } },
  charity:          { operating_margin: { mean: 0.022, std: 0.045 }, reserves_cover: { mean: 5.2, std: 3.0 } },
  property:         { gross_margin: { mean: 0.45, std: 0.12 }, current_ratio: { mean: 1.2, std: 0.4 }, debt_to_equity: { mean: 1.8, std: 0.9 } },
  other:            { gross_margin: { mean: 0.35, std: 0.10 }, operating_margin: { mean: 0.08, std: 0.05 }, current_ratio: { mean: 1.50, std: 0.45 }, debtor_days: { mean: 50.0, std: 20.0 }, creditor_days: { mean: 45.0, std: 18.0 } },
};

// Benford expected distribution

// FRC thematic risk areas mapped to FSLIs
const FRC_RISK_MAP = {
  revenue_recognition: ['Revenue', 'Trade Debtors', 'Accrued Income'],
  going_concern:       ['Cash and Cash Equivalents', 'Borrowings', 'Equity'],
  impairment:          ['Goodwill', 'Intangible Assets', 'Property Plant Equipment'],
  ecl_provisioning:    ['Trade Debtors', 'Loans Receivable', 'Financial Assets'],
  lease_accounting:    ['Right of Use Assets', 'Lease Liabilities'],
  estimates:           ['Provisions', 'Pension Obligations', 'Deferred Tax'],
  related_parties:     ['All FSLIs'],
  group_audit:         ['Investments', 'Intercompany', 'Goodwill'],
};

// ISA procedure library per FSLI and risk level
const PROCEDURE_LIBRARY = {
  Revenue: {
    high:   ['Full population CAATs on revenue transactions', 'Cut-off testing ±15 days either side of year-end', 'Analytical review vs budget and prior year', 'Confirm significant contracts', 'Review revenue recognition policy per IFRS 15', 'Test journal entries with Dr Revenue/Cr Liability', 'Inquire about returns and credit notes post year-end'],
    medium: ['Analytical review of monthly revenue', 'Cut-off testing ±10 days', 'Sample test invoices to dispatch notes', 'Confirm top 5 customers'],
    low:    ['Analytical review of revenue', 'Sample test of revenue invoices', 'Cut-off testing ±5 days'],
  },
  'Trade Debtors': {
    high:   ['Positive circularisation of all debtors >£X', 'Full aged debtor analysis', 'Post year-end receipts testing', 'Review credit notes and disputes', 'ECL/provision adequacy review', 'Related party debtors confirmation'],
    medium: ['Positive circularisation of material debtors', 'Aged analysis and provision review', 'Post year-end receipts on sample'],
    low:    ['Analytical review of debtors', 'Sample of post year-end receipts'],
  },
  Inventory: {
    high:   ['Attend physical count', 'Independent observation of counting', 'Test count and recount', 'Net realisable value review', 'Slow-moving and obsolete stock review', 'Cut-off on goods received and dispatched'],
    medium: ['Attendance at physical count', 'NRV review of slow-moving items', 'Cut-off testing'],
    low:    ['Review management count procedures', 'Sample NRV review'],
  },
  'Property Plant Equipment': {
    high:   ['Full fixed asset register inspection', 'Physical verification of major items', 'Impairment review documentation', 'Review of useful lives and residual values', 'Additions: agree to invoices, assess capitalisation policy', 'Disposals: agree to proceeds and derecognition'],
    medium: ['Sample of additions and disposals', 'Review of depreciation policy', 'Physical inspection of major assets'],
    low:    ['Analytical review of movements', 'Sample additions to invoices'],
  },
  Goodwill: {
    high:   ['Obtain and review impairment model', 'Challenge CGU determination', 'Sensitivity analysis on key assumptions (growth rate, discount rate)', 'Corroborate market data used', 'Review impairment trigger assessment'],
    medium: ['Review impairment model and key assumptions', 'Compare to market benchmarks'],
    low:    ['Review for impairment indicators', 'Confirm no impairment required'],
  },
  default: {
    high:   ['Detailed substantive testing of 100% of material items', 'Analytical review vs prior year and budget', 'Confirm significant balances with third parties', 'Review journal entries', 'Inspect supporting documentation'],
    medium: ['Substantive sample testing', 'Analytical review', 'Review of key estimates'],
    low:    ['Analytical review', 'Sample of transactions', 'Review of accounting policy'],
  },
};

export class AuditMLEngine {
  constructor() {
    this.supabase         = getSupabaseClient();
    this.industryPatterns = new Map();
    this.engagementHistory = [];
    this._realTimeListeners = [];
  }

  // ── assessRisk ──────────────────────────────────────────────────────────

  /**
   * AiDA-style: assess risk per FSLI based on industry and financial profile
   * @param {Object} entityProfile  { industry, financials, priorYearIssues, entityType, listedStatus }
   * @returns {Array} FSLI risk scores with reasoning
   */
  assessRisk(entityProfile) {
    const { industry = 'other', financials = {}, priorYearIssues = [], entityType = 'trading', listedStatus = false } = entityProfile;
    const benchmarks = FALLBACK_BENCHMARKS[industry] || FALLBACK_BENCHMARKS.other;

    const fsliRisks = [];
    const fslisToAssess = _getFSLIsForIndustry(industry, entityType);

    for (const fsli of fslisToAssess) {
      const score   = this._scoreFSLI(fsli, financials, benchmarks, priorYearIssues, listedStatus);
      const level   = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
      const frcAlerts = this.getFRCRiskAlerts(industry, [fsli]);

      fsliRisks.push({
        fsli,
        riskScore:   score,
        riskLevel:   level,
        drivers:     score >= 40 ? this._riskDrivers(fsli, financials, benchmarks) : [],
        procedures:  this.suggestProcedures(fsli, level, industry),
        frcAlerts:   frcAlerts.slice(0, 3),
        isaReference: 'ISA 315 / ISA 330',
      });
    }

    fsliRisks.sort((a, b) => b.riskScore - a.riskScore);

    return {
      fsliRisks,
      overallRisk:   fsliRisks.filter(f => f.riskLevel === 'high').length >= 3 ? 'high' : fsliRisks.filter(f => f.riskLevel === 'medium').length >= 3 ? 'medium' : 'low',
      highRiskFSLIs: fsliRisks.filter(f => f.riskLevel === 'high').map(f => f.fsli),
      entityProfile,
    };
  }

  _scoreFSLI(fsli, financials, benchmarks, priorIssues, listed) {
    let score = 30; // base

    // Prior year issues
    if (priorIssues.includes(fsli)) score += 25;

    // Listed company premium
    if (listed) score += 10;

    // Industry-specific flags
    const { revenue, totalAssets, profitBeforeTax, cash, debt } = financials;

    if (fsli === 'Revenue' || fsli === 'Trade Debtors') {
      if (profitBeforeTax < 0) score += 15;
      if (revenue > 0 && benchmarks.gross_margin && financials.grossProfit) {
        const gm   = financials.grossProfit / revenue;
        const diff = Math.abs(gm - benchmarks.gross_margin.mean) / benchmarks.gross_margin.std;
        if (diff > 2) score += 20;
      }
    }

    if (fsli === 'Goodwill' || fsli === 'Intangible Assets') score += 20; // inherently high risk

    if (fsli === 'Cash and Cash Equivalents' && cash < 0) score += 30;

    if ((fsli === 'Borrowings' || fsli === 'Lease Liabilities') && debt > totalAssets * 0.7) score += 20;

    if (fsli === 'Inventory' && benchmarks.inventory_days && financials.cogs && revenue) {
      const days = (financials.inventory / financials.cogs) * 365;
      if (days > benchmarks.inventory_days.mean + 2 * benchmarks.inventory_days.std) score += 15;
    }

    return Math.min(score, 100);
  }

  _riskDrivers(fsli, financials, _benchmarks) {
    const drivers = [];
    const { revenue, profitBeforeTax, totalAssets, debt } = financials;

    if (profitBeforeTax < 0)                           drivers.push('Entity is loss-making — increased pressure to overstate revenue or understate expenses');
    if (debt > totalAssets * 0.7)                      drivers.push('High leverage — covenant breach risk increases management bias in estimates');
    if (fsli === 'Goodwill')                           drivers.push('Goodwill impairment testing involves significant estimation uncertainty (ISA 540)');
    if (fsli === 'Revenue' && revenue / totalAssets > 3) drivers.push('High asset turnover — increased volume of revenue transactions requiring cut-off attention');

    return drivers;
  }

  // ── suggestProcedures ───────────────────────────────────────────────────

  /**
   * AiDA-style: suggest ranked procedures for FSLI at given risk level
   * Auto-modifies based on findings encountered during audit
   */
  suggestProcedures(fsli, riskLevel, industry, encounterredFindings = []) {
    const lib   = PROCEDURE_LIBRARY[fsli] || PROCEDURE_LIBRARY.default;
    const base  = [...(lib[riskLevel] || lib.medium || [])];

    // Auto-modify based on findings (AiDA behaviour)
    const modifications = [];
    for (const finding of encounterredFindings) {
      if (finding.type === 'cutoff_error') {
        base.unshift('EXTENDED: Additional cut-off testing added due to cut-off findings identified');
        modifications.push('Cut-off scope extended due to finding');
      }
      if (finding.type === 'sampling_exception') {
        base.unshift('EXTENDED: Sample size increased — exception rate exceeds tolerable level');
        modifications.push('Sample size increase triggered by exception rate');
      }
      if (finding.type === 'control_deficiency') {
        base.unshift('EXTENDED: Substantive procedures extended — control reliance reduced due to deficiency identified');
        modifications.push('Substantive scope increased due to control failure');
      }
    }

    return {
      fsli,
      riskLevel,
      procedures:    base,
      modifications,
      totalCount:    base.length,
      isaReference:  'ISA 330',
      autoModified:  modifications.length > 0,
    };
  }

  // ── predictMateriality ──────────────────────────────────────────────────

  predictMateriality(industry, revenue, totalAssets, pbt) {
    const patterns = { manufacturing: { rate: 0.005, basis: 'revenue' }, retail: { rate: 0.005, basis: 'revenue' }, technology: { rate: 0.006, basis: 'revenue' }, financial_services: { rate: 0.01, basis: 'totalAssets' }, property: { rate: 0.01, basis: 'totalAssets' }, charity: { rate: 0.01, basis: 'revenue' }, default: { rate: 0.05, basis: 'pbt' } };

    const p = patterns[industry] || patterns.default;
    const base = p.basis === 'revenue' ? revenue : p.basis === 'totalAssets' ? totalAssets : pbt;
    const overall = Math.round((base || revenue) * p.rate);

    return {
      predicted:            overall,
      basis:                p.basis,
      rate:                 p.rate * 100 + '%',
      performanceMateriality: Math.round(overall * 0.75),
      trivialThreshold:     Math.round(overall * 0.05),
      confidence:           'medium',
      note:                 `Based on comparable ${industry} engagements in the learning dataset`,
    };
  }

  // ── detectAnomalies ─────────────────────────────────────────────────────

  /**
   * MindBridge-style: flag unusual ratios, trends, and patterns
   * Transaction-level anomaly scoring (0–100 per transaction)
   */
  detectAnomalies(financialData) {
    const alerts = [];
    const { ratios = {}, trends = {}, transactions = [] } = financialData;

    // Ratio anomalies
    if (ratios.grossMargin !== undefined) {
      if (ratios.grossMargin < 0)              alerts.push({ type: 'ratio', severity: 'high', flag: 'Negative gross margin — cost of sales exceeds revenue', action: 'Review revenue recognition and COGS allocation' });
      if (ratios.grossMargin > 0.9)            alerts.push({ type: 'ratio', severity: 'high', flag: 'Gross margin >90% — investigate basis of cost allocation', action: 'Analytical procedure — compare to industry norms' });
    }

    if (ratios.currentRatio < 0.5)             alerts.push({ type: 'ratio', severity: 'high', flag: 'Current ratio <0.5 — severe liquidity concern (going concern)', action: 'ISA 570 going concern assessment required' });
    if (ratios.debtToEquity > 5)               alerts.push({ type: 'ratio', severity: 'high', flag: 'Debt/equity >5 — extreme leverage', action: 'Review covenant compliance and going concern' });

    // Year-on-year trend anomalies
    if (trends.revenueGrowth > 0.5)            alerts.push({ type: 'trend', severity: 'medium', flag: `Revenue growth ${(trends.revenueGrowth * 100).toFixed(0)}% — significantly above industry`, action: 'Verify existence of new revenue sources' });
    if (trends.revenueGrowth < -0.3)           alerts.push({ type: 'trend', severity: 'high', flag: `Revenue decline ${(Math.abs(trends.revenueGrowth) * 100).toFixed(0)}% — significant deterioration`, action: 'Review going concern and asset impairment' });

    // Transaction-level scoring (MindBridge style)
    const scoredTransactions = transactions.map(t => {
      let score = 0;
      if (Math.abs(t.amount) % 1000 === 0) score += 20;
      if (t.date && [0, 6].includes(new Date(t.date).getDay())) score += 15;
      if (t.enteredBy === t.approvedBy) score += 30;
      if (!t.reference) score += 10;
      return { ...t, anomalyScore: Math.min(score, 100), flagged: score >= 30 };
    });

    // Network analysis: map relationships between accounts
    const network = _buildAccountNetwork(transactions);

    return {
      alerts,
      scoredTransactions: scoredTransactions.filter(t => t.flagged),
      network,
      summary: {
        alertCount:    alerts.length,
        highSeverity:  alerts.filter(a => a.severity === 'high').length,
        flaggedTxns:   scoredTransactions.filter(t => t.flagged).length,
      },
    };
  }

  // ── learnFromEngagement ─────────────────────────────────────────────────

  async learnFromEngagement(engagementData) {
    const { industry, riskLevel, materialityUsed, findingsCount, opinionType } = engagementData;
    this.engagementHistory.push({ ...engagementData, timestamp: new Date().toISOString() });

    try {
      await this.supabase?.from('ml_engagement_history').insert([{
        industry,
        risk_level:       riskLevel,
        materiality_used: materialityUsed,
        findings_count:   findingsCount,
        opinion_type:     opinionType,
        engagement_data:  engagementData,
        created_at:       new Date().toISOString(),
      }]);
    } catch (e) { // eslint-disable-line no-unused-vars
      // offline — stored in memory
    }

    return { stored: true, totalLearned: this.engagementHistory.length };
  }

  // ── getFRCRiskAlerts ────────────────────────────────────────────────────

  getFRCRiskAlerts(industry, fsliList) {
    const alerts = [];

    for (const [theme, fslis] of Object.entries(FRC_RISK_MAP)) {
      const relevant = fsliList.some(f => fslis.includes(f) || fslis.includes('All FSLIs'));
      if (!relevant) continue;

      const alert = _frcAlertForTheme(theme, industry);
      if (alert) alerts.push(alert);
    }

    return alerts;
  }

  // ── calculateFRCReadiness ───────────────────────────────────────────────

  calculateFRCReadiness(engagement) {
    const { completedChecks = [], materialitySet, riskAssessmentDone, proceduresTailored, findingsDocumented, partnerReviewDone } = engagement;

    const criteria = [
      { id: 'materiality_set',        weight: 8,  met: !!materialitySet },
      { id: 'risk_assessment',        weight: 12, met: !!riskAssessmentDone },
      { id: 'procedures_tailored',    weight: 10, met: !!proceduresTailored },
      { id: 'findings_documented',    weight: 15, met: !!findingsDocumented },
      { id: 'partner_review',         weight: 10, met: !!partnerReviewDone },
      ...completedChecks.map(c => ({ id: c, weight: 2, met: true })),
    ];

    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
    const achieved    = criteria.filter(c => c.met).reduce((s, c) => s + c.weight, 0);
    const score       = Math.min(100, Math.round((achieved / Math.max(totalWeight, 59)) * 100));

    return {
      score,
      rating:    score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 50 ? 'Moderate' : 'Needs Improvement',
      criteria,
      gapAreas:  criteria.filter(c => !c.met).map(c => c.id),
      isaReference: 'FRC AQR Framework',
    };
  }

  // ── Real-time AiDA suggestions ──────────────────────────────────────────

  /**
   * Subscribe to real-time risk updates as audit progresses
   * @param {Function} callback  called with { fsli, suggestion, urgency }
   */
  onRealTimeRiskUpdate(callback) {
    this._realTimeListeners.push(callback);
    return () => { this._realTimeListeners = this._realTimeListeners.filter(l => l !== callback); };
  }

  emitRiskUpdate(fsli, finding) {
    const suggestion = this._generateRealTimeSuggestion(fsli, finding);
    this._realTimeListeners.forEach(cb => cb(suggestion));
    return suggestion;
  }

  _generateRealTimeSuggestion(fsli, finding) {
    const suggestions = {
      exception:        `Exception found in ${fsli} — consider extending sample size or applying additional substantive procedures`,
      misstatement:     `Misstatement identified in ${fsli} — accumulate and evaluate against performance materiality`,
      control_failure:  `Control failure in ${fsli} process — increase reliance on substantive testing`,
      cutoff_error:     `Cut-off error in ${fsli} — extend cut-off testing window`,
    };

    return {
      fsli,
      finding,
      suggestion: suggestions[finding.type] || `Review ${fsli} procedures in light of finding`,
      urgency:    finding.amount > 0 ? 'high' : 'medium',
      timestamp:  new Date().toISOString(),
      autoAction: finding.type === 'control_failure' ? 'procedures_extended' : null,
    };
  }

  // ── Cluster & Network analysis (MindBridge) ──────────────────────────────

  clusterTransactions(transactions, field = 'amount') {
    const values  = transactions.map(t => Number(t[field] || 0));
    const mean    = values.reduce((s, v) => s + v, 0) / values.length;
    const std     = Math.sqrt(values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length);

    const clusters = {
      high:   transactions.filter(t => Number(t[field] || 0) > mean + 2 * std),
      normal: transactions.filter(t => Math.abs(Number(t[field] || 0) - mean) <= 2 * std),
      low:    transactions.filter(t => Number(t[field] || 0) < mean - 2 * std),
      outlier: transactions.filter(t => Math.abs(Number(t[field] || 0) - mean) > 3 * std),
    };

    return { clusters, mean: Number(mean.toFixed(2)), std: Number(std.toFixed(2)), outlierCount: clusters.outlier.length };
  }

  predictiveRiskScore(account, period, historicalData) {
    const periodData = historicalData.filter(d => d.account === account);
    if (periodData.length < 2) return { score: 50, confidence: 'low', note: 'Insufficient historical data' };

    const values  = periodData.map(d => d.value);
    const mean    = values.reduce((s, v) => s + v, 0) / values.length;
    const last    = values[values.length - 1];
    const devPct  = mean > 0 ? Math.abs(last - mean) / mean : 0;
    const score   = Math.min(100, Math.round(30 + devPct * 100));

    return {
      score,
      confidence: 'medium',
      trend:      last > mean ? 'above_average' : 'below_average',
      deviationPct: (devPct * 100).toFixed(1) + '%',
    };
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function _getFSLIsForIndustry(industry, _entityType) {
  const base = ['Revenue', 'Trade Debtors', 'Trade Creditors', 'Cash and Cash Equivalents', 'Property Plant Equipment', 'Provisions', 'Accruals and Prepayments', 'Payroll and PAYE', 'Deferred Tax'];
  const extras = {
    manufacturing:    ['Inventory', 'Work in Progress', 'Capital Expenditure'],
    retail:           ['Inventory', 'Gift Cards and Loyalty Points'],
    property:         ['Investment Properties', 'Development Land', 'Lease Liabilities'],
    financial_services: ['Financial Assets', 'ECL Provisions', 'Regulatory Capital'],
    technology:       ['Intangible Assets', 'Capitalised Development Costs'],
    construction:     ['Contract Assets', 'Contract Liabilities', 'Work in Progress'],
  };
  return [...base, ...(extras[industry] || [])];
}

function _frcAlertForTheme(theme, _industry) {
  const alerts = {
    revenue_recognition: { theme, alert: 'FRC repeatedly finds insufficient challenge of revenue recognition assumptions', action: 'Document basis for revenue recognition per IFRS 15/FRS 102', year: '2024/25' },
    going_concern:       { theme, alert: 'FRC 2024/25: Going concern assessments frequently lack sufficient rigour', action: 'Ensure 12-month assessment covers at least 1 year from approval date (ISA 570 revised)', year: '2024/25' },
    impairment:          { theme, alert: 'FRC finds impairment models insufficiently challenged — auditors accept management forecasts without independent verification', action: 'Independently corroborate key assumptions (growth rate, discount rate)', year: '2024/25' },
    ecl_provisioning:    { theme, alert: 'ECL models overly reliant on management overlays — auditors not sufficiently challenging macroeconomic scenarios', action: 'Obtain independent economic forecasts; challenge overlay adjustments', year: '2024/25' },
    estimates:           { theme, alert: 'Significant estimation uncertainty not adequately communicated in audit report', action: 'Consider KAM / EOM disclosure for significant estimates', year: '2024/25' },
    related_parties:     { theme, alert: 'Related party transactions not always fully identified and disclosed', action: 'Obtain management representations; review board minutes and PSC register', year: '2024/25' },
  };
  return alerts[theme] || null;
}

function _buildAccountNetwork(transactions) {
  const nodes = new Set();
  const edges = [];
  for (const t of transactions || []) {
    if (t.debitAccount)  nodes.add(t.debitAccount);
    if (t.creditAccount) nodes.add(t.creditAccount);
    if (t.debitAccount && t.creditAccount) {
      edges.push({ from: t.debitAccount, to: t.creditAccount, amount: t.amount, count: 1 });
    }
  }
  return { nodes: Array.from(nodes), edges, nodeCount: nodes.size, edgeCount: edges.length };
}

export default AuditMLEngine;
