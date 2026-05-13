// ═══════════════════════════════════════════════════════════════
// Valuation Review Agent — Checks Valuations Against Comps & Standards
// Inspired by Anthropic Financial Services Valuation Reviewer plugin
// Complements the existing estimationValuationAgent
// ═══════════════════════════════════════════════════════════════

import { generateAINarrative } from './financeAgentUtils.js';

const ACCEPTABLE_VARIANCE_PCT = 15; // ISA 540 reasonable range tolerance

export const valuationReviewAgent = {
  id: 'valuation_review',
  name: 'Valuation Review Agent',
  description: 'Reviews management valuations against comparable market data, methodology standards, and firm review policies. Flags valuation bias, sensitivity gaps, and methodology inconsistencies. ISA 540 / ISA 620 / IFRS 13.',
  category: 'finance_ops',
  wpScope: ['d1', 'd2', 'e1', 'e2'],
  isaReferences: ['ISA 540', 'ISA 620', 'IFRS 13', 'IAS 36', 'FRS 102 s27'],

  async runWithAI(valuationData, comparables, context) {
    const results = this.analyze(valuationData, comparables, context);
    results.aiNarrative = await generateAINarrative(this, results, context);
    return results;
  },

  analyze(valuationData, comparables, context = {}) {
    const vd = valuationData || {};
    const comps = comparables || {};
    const ctx = context || {};
    const materiality = ctx.performanceMateriality || ctx.materiality || 0;

    const results = {
      valuations: [],
      methodologyChecks: [],
      biasIndicators: [],
      sensitivityGaps: [],
      comparableAnalysis: [],
      overallStatus: 'GREEN',
      warnings: [],
      reviewDate: new Date().toISOString().split('T')[0],
    };

    // 1. Review each valuation
    const items = vd.items || vd.valuations || [];
    items.forEach(item => _reviewValuation(item, comps, results, materiality, ctx));

    // 2. Methodology consistency check
    _checkMethodologyConsistency(items, results);

    // 3. Bias detection
    _detectBias(items, results);

    // 4. Sensitivity gap analysis
    _checkSensitivityGaps(items, results);

    // Overall
    if (results.biasIndicators.length >= 3) {
      results.overallStatus = 'RED';
      results.warnings.push(`${results.biasIndicators.length} bias indicators — systematic management bias suspected (ISA 540.32).`);
    } else if (results.biasIndicators.length > 0 || results.sensitivityGaps.length > 0) {
      results.overallStatus = 'AMBER';
      if (results.biasIndicators.length > 0) results.warnings.push(`${results.biasIndicators.length} bias indicator(s) noted.`);
      if (results.sensitivityGaps.length > 0) results.warnings.push(`${results.sensitivityGaps.length} valuation(s) missing required sensitivity analysis.`);
    }

    const materialDiffs = results.valuations.filter(v => v.status === 'OUTSIDE_RANGE');
    if (materialDiffs.length > 0) {
      results.overallStatus = 'RED';
      results.warnings.push(`${materialDiffs.length} valuation(s) outside auditor's reasonable range.`);
    }

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      'VALUATION REVIEW ANALYSIS',
      `Overall Status: [${r.overallStatus}]`,
      `Review Date: ${r.reviewDate}`,
      '',
      `SUMMARY:`,
      `  Valuations reviewed: ${(r.valuations || []).length}`,
      `  Within range: ${(r.valuations || []).filter(v => v.status === 'WITHIN_RANGE').length}`,
      `  Outside range: ${(r.valuations || []).filter(v => v.status === 'OUTSIDE_RANGE').length}`,
      `  Bias indicators: ${(r.biasIndicators || []).length}`,
      `  Sensitivity gaps: ${(r.sensitivityGaps || []).length}`,
      '',
    ];

    const outside = (r.valuations || []).filter(v => v.status === 'OUTSIDE_RANGE');
    if (outside.length > 0) {
      lines.push('VALUATIONS OUTSIDE AUDITOR RANGE:');
      outside.forEach(v => {
        lines.push(`  ${v.assetName}: Management £${(v.managementValue || 0).toLocaleString()} vs Auditor range £${(v.auditorRangeLow || 0).toLocaleString()} - £${(v.auditorRangeHigh || 0).toLocaleString()} (Diff: ${v.variancePct}%)`);
        if (v.note) lines.push(`    ${v.note}`);
      });
      lines.push('');
    }

    if ((r.biasIndicators || []).length > 0) {
      lines.push('MANAGEMENT BIAS INDICATORS (ISA 540.32):');
      r.biasIndicators.forEach(b => lines.push(`  ! ${b}`));
      lines.push('');
    }

    if ((r.methodologyChecks || []).filter(m => m.status === 'FAIL').length > 0) {
      lines.push('METHODOLOGY ISSUES:');
      r.methodologyChecks.filter(m => m.status === 'FAIL').forEach(m => lines.push(`  [FAIL] ${m.check}: ${m.note}`));
      lines.push('');
    }

    if ((r.warnings || []).length > 0) {
      lines.push('AUDIT ATTENTION POINTS:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', 'ISA References: ISA 540, ISA 620, IFRS 13');

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['financial_instruments', 'intangibles', 'ppe'];
    if ((results?.biasIndicators || []).length > 0) sections.push('management_bias', 'audit_differences');
    if ((results?.valuations || []).filter(v => v.status === 'OUTSIDE_RANGE').length > 0) sections.push('audit_differences');
    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Valuation Review',
      isaReference: 'ISA 540 / IFRS 13',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'Valuation Summary',
          columns: ['Asset', 'Methodology', 'Management Value (£)', 'Auditor Low (£)', 'Auditor High (£)', 'Variance %', 'FV Level', 'Status'],
          rows: (r.valuations || []).map(v => [v.assetName, v.methodology, v.managementValue, v.auditorRangeLow, v.auditorRangeHigh, `${v.variancePct}%`, v.fvLevel, v.status]),
        },
        {
          title: 'Methodology Checks',
          columns: ['Check', 'Status', 'Notes'],
          rows: (r.methodologyChecks || []).map(m => [m.check, m.status, m.note]),
        },
        {
          title: 'Bias Indicators',
          columns: ['Indicator'],
          rows: (r.biasIndicators || []).map(b => [b]),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

function _reviewValuation(item, comps, results, materiality, ctx) {
  const mgmtValue = parseFloat(item.managementValue || item.fairValue || item.value || 0);
  const methodology = item.methodology || item.method || 'unspecified';
  const assetName = item.name || item.assetName || item.description || 'Unnamed';
  const fvLevel = item.fvLevel || item.fairValueLevel || 'N/A';

  // Build auditor range from comparables or independent estimate
  let auditorRangeLow = 0;
  let auditorRangeHigh = 0;
  let auditorPointEstimate = 0;

  const assetComps = comps[item.id] || comps[assetName] || item.comparables || [];

  if (assetComps.length > 0) {
    const compValues = assetComps.map(c => parseFloat(c.value || c.amount || 0)).filter(v => v > 0);
    if (compValues.length > 0) {
      compValues.sort((a, b) => a - b);
      auditorRangeLow = compValues[0];
      auditorRangeHigh = compValues[compValues.length - 1];
      auditorPointEstimate = compValues.reduce((s, v) => s + v, 0) / compValues.length;

      results.comparableAnalysis.push({
        assetName,
        comparablesCount: compValues.length,
        rangeLow: auditorRangeLow,
        rangeHigh: auditorRangeHigh,
        mean: _round(auditorPointEstimate, 0),
        managementValue: mgmtValue,
      });
    }
  } else if (item.auditorEstimate) {
    auditorPointEstimate = parseFloat(item.auditorEstimate);
    auditorRangeLow = _round(auditorPointEstimate * (1 - ACCEPTABLE_VARIANCE_PCT / 100), 0);
    auditorRangeHigh = _round(auditorPointEstimate * (1 + ACCEPTABLE_VARIANCE_PCT / 100), 0);
  } else {
    // No comparables and no auditor estimate — flag
    auditorRangeLow = _round(mgmtValue * 0.85, 0);
    auditorRangeHigh = _round(mgmtValue * 1.15, 0);
    auditorPointEstimate = mgmtValue;
  }

  const variance = mgmtValue - auditorPointEstimate;
  const variancePct = auditorPointEstimate !== 0 ? _round((variance / auditorPointEstimate) * 100, 1) : 0;
  const withinRange = mgmtValue >= auditorRangeLow && mgmtValue <= auditorRangeHigh;

  let status = withinRange ? 'WITHIN_RANGE' : 'OUTSIDE_RANGE';
  let note = '';

  if (!withinRange && Math.abs(mgmtValue - auditorPointEstimate) <= materiality) {
    status = 'OUTSIDE_RANGE_IMMATERIAL';
    note = 'Outside auditor range but difference is below materiality.';
  } else if (!withinRange) {
    note = `Management value £${mgmtValue.toLocaleString()} is ${variancePct}% from auditor point estimate — exceeds reasonable range.`;
  }

  results.valuations.push({
    assetName,
    methodology,
    fvLevel,
    managementValue: mgmtValue,
    auditorPointEstimate,
    auditorRangeLow,
    auditorRangeHigh,
    variance: _round(variance, 0),
    variancePct,
    status,
    note,
    hasSensitivity: !!(item.sensitivity || item.sensitivityAnalysis),
  });
}

function _checkMethodologyConsistency(items, results) {
  // Same asset class should use same methodology
  const methodByClass = {};
  items.forEach(item => {
    const cls = item.assetClass || item.category || 'general';
    const method = item.methodology || item.method || 'unspecified';
    if (!methodByClass[cls]) methodByClass[cls] = new Set();
    methodByClass[cls].add(method);
  });

  Object.entries(methodByClass).forEach(([cls, methods]) => {
    if (methods.size > 1) {
      results.methodologyChecks.push({
        check: `Consistency: ${cls}`,
        status: 'FAIL',
        note: `Multiple methodologies used for ${cls}: ${[...methods].join(', ')} — justify or standardise.`,
      });
    } else {
      results.methodologyChecks.push({
        check: `Consistency: ${cls}`,
        status: 'PASS',
        note: `Consistent methodology: ${[...methods][0]}`,
      });
    }
  });

  // PY consistency
  const pyMethodChange = items.filter(i => i.priorYearMethodology && i.priorYearMethodology !== (i.methodology || i.method));
  if (pyMethodChange.length > 0) {
    results.methodologyChecks.push({
      check: 'Prior year methodology consistency',
      status: 'FAIL',
      note: `${pyMethodChange.length} item(s) changed methodology from prior year — justification required per ISA 540.`,
    });
  }
}

function _detectBias(items, results) {
  if (items.length < 3) return;

  // All valuations at top of range?
  const atTopOfRange = items.filter(i => {
    const mgmt = parseFloat(i.managementValue || i.value || 0);
    const high = parseFloat(i.rangeHigh || i.auditorRangeHigh || mgmt * 1.15);
    const low = parseFloat(i.rangeLow || i.auditorRangeLow || mgmt * 0.85);
    const midpoint = (high + low) / 2;
    return mgmt > midpoint;
  });

  if (atTopOfRange.length > items.length * 0.75) {
    results.biasIndicators.push('Majority of valuations sit above the midpoint of reasonable ranges — upward bias suspected.');
  }

  // Consistent overstatement direction
  const overstated = items.filter(i => {
    const mgmt = parseFloat(i.managementValue || i.value || 0);
    const est = parseFloat(i.auditorEstimate || mgmt);
    return mgmt > est;
  });

  if (overstated.length === items.length && items.length >= 3) {
    results.biasIndicators.push('All management valuations exceed auditor estimates — systematic overstatement bias (ISA 540.32).');
  }

  // Assumptions always optimistic
  const optimisticAssumptions = items.filter(i => i.assumptionBias === 'optimistic' || i.growthRate > 0.05);
  if (optimisticAssumptions.length > items.length * 0.5) {
    results.biasIndicators.push('Growth rate assumptions consistently above market consensus — optimism bias in forward-looking estimates.');
  }
}

function _checkSensitivityGaps(items, results) {
  items.forEach(item => {
    if (!item.sensitivity && !item.sensitivityAnalysis) {
      const mgmt = parseFloat(item.managementValue || item.value || 0);
      if (mgmt > 0) {
        results.sensitivityGaps.push({
          assetName: item.name || item.assetName || 'Unnamed',
          managementValue: mgmt,
          note: 'No sensitivity analysis provided — required for ISA 540 high estimation uncertainty.',
        });
      }
    }
  });
}

function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
