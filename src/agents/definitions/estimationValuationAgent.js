// ═══════════════════════════════════════════════════════════════
// Estimation & Valuation Agent — ISA 540 Accounting Estimates
// ═══════════════════════════════════════════════════════════════

// Default PD rates by aging bucket (IFRS 9 simplified approach)
const ECL_PD_RATES = {
  current: 0.005,    // 0-30 days
  days31_60: 0.02,   // 31-60 days
  days61_90: 0.08,   // 61-90 days
  days91_120: 0.20,  // 91-120 days
  days120_180: 0.45, // 120-180 days
  over180: 0.80,     // >180 days
  dispute: 0.95,     // In dispute/legal
};

const INDUSTRY_UEL = {
  it_equipment: { min: 3, max: 5, typical: 4 },
  machinery: { min: 10, max: 15, typical: 12 },
  buildings: { min: 25, max: 50, typical: 40 },
  vehicles: { min: 3, max: 5, typical: 4 },
  fixtures: { min: 5, max: 10, typical: 7 },
  office_equipment: { min: 5, max: 10, typical: 7 },
  intangibles_software: { min: 3, max: 7, typical: 5 },
  intangibles_brand: { min: 10, max: 20, typical: 15 },
};

const SUSTAINABLE_GROWTH_RATE = 0.025; // 2.5% UK GDP long-run

export const estimationValuationAgent = {
  id: 'estimation_valuation',
  name: 'Estimation & Valuation Agent',
  description: 'ISA 540 accounting estimates: ECL (IFRS 9), depreciation/UEL assessment, impairment (IAS 36), fair value hierarchy (IFRS 13), provisions (IAS 37), and goodwill impairment (Gordon Growth Model).',
  category: 'valuation',
  isaReferences: ['ISA 540', 'IFRS 9', 'IAS 36', 'IFRS 13', 'IAS 37', 'FRS 102'],

  analyze(financials, estimateData, context = {}) {
    const f = financials || {};
    const ed = estimateData || {};
    const ctx = context || {};
    const results = {
      ecl: {},
      depreciation: {},
      impairment: {},
      fairValueHierarchy: {},
      provisions: {},
      goodwillImpairment: {},
      overallStatus: 'GREEN',
      warnings: [],
      highUncertaintyEstimates: [],
    };

    // ─── 1. EXPECTED CREDIT LOSS (IFRS 9) ───────────────────────────
    results.ecl = _calculateECL(f, ed, ctx);
    if (results.ecl.status === 'RED') {
      results.warnings.push(`ECL: Management provision of £${(ed.managementEclProvision || 0).toLocaleString()} differs from model by ${results.ecl.differenceFromManagementPct}% (>15% threshold).`);
      results.highUncertaintyEstimates.push('Expected Credit Loss (IFRS 9)');
    }

    // ─── 2. DEPRECIATION / USEFUL LIFE ASSESSMENT ───────────────────
    results.depreciation = _assessDepreciation(f, ed);
    if (results.depreciation.overallStatus === 'RED') {
      results.highUncertaintyEstimates.push('Depreciation / Useful Economic Lives');
    }

    // ─── 3. IMPAIRMENT ASSESSMENT (IAS 36) ──────────────────────────
    results.impairment = _assessImpairment(f, ed, ctx);
    if (results.impairment.indicatorsPresent) {
      results.warnings.push('IAS 36 impairment indicators present — recoverable amount assessment required.');
      results.highUncertaintyEstimates.push('Asset Impairment (IAS 36)');
    }

    // ─── 4. FAIR VALUE HIERARCHY (IFRS 13) ──────────────────────────
    results.fairValueHierarchy = _assessFairValueHierarchy(f, ed);
    if (results.fairValueHierarchy.level3Present) {
      results.warnings.push('Level 3 fair value instruments identified — highest estimation uncertainty. Key assumption sensitivity analysis required (ISA 540).');
      results.highUncertaintyEstimates.push('Level 3 Fair Value Instruments (IFRS 13)');
    }

    // ─── 5. PROVISIONS (IAS 37) ─────────────────────────────────────
    results.provisions = _assessProvisions(f, ed, ctx);
    if (results.provisions.overallStatus === 'AMBER' || results.provisions.overallStatus === 'RED') {
      results.highUncertaintyEstimates.push('Provisions (IAS 37)');
    }

    // ─── 6. GOODWILL IMPAIRMENT (IAS 36 / FRS 102 s27) ──────────────
    results.goodwillImpairment = _assessGoodwillImpairment(f, ed, ctx);
    if (results.goodwillImpairment.headroomPct !== null && results.goodwillImpairment.headroomPct < 20) {
      results.warnings.push(`Goodwill impairment headroom of ${results.goodwillImpairment.headroomPct}% is below 20% ISA 540 high uncertainty threshold.`);
      results.highUncertaintyEstimates.push('Goodwill Impairment (IAS 36)');
    }

    // ─── 7. OVERALL STATUS ───────────────────────────────────────────
    const statuses = [
      results.ecl.status, results.depreciation.overallStatus,
      results.provisions.overallStatus, results.goodwillImpairment.status,
    ].filter(s => s && s !== 'N/A');

    if (statuses.includes('RED')) results.overallStatus = 'RED';
    else if (statuses.includes('AMBER') || results.highUncertaintyEstimates.length >= 2) results.overallStatus = 'AMBER';

    return results;
  },

  generateFindings(results) {
    const r = results || {};
    const lines = [
      `ISA 540 ACCOUNTING ESTIMATES & VALUATION ANALYSIS`,
      `Overall Status: [${r.overallStatus}]`,
      '',
    ];

    if (r.highUncertaintyEstimates && r.highUncertaintyEstimates.length > 0) {
      lines.push(`HIGH ESTIMATION UNCERTAINTY AREAS (ISA 540.18):`);
      r.highUncertaintyEstimates.forEach(e => lines.push(`  • ${e}`));
      lines.push('');
    }

    // ECL
    if (r.ecl && r.ecl.modelECL !== undefined) {
      lines.push('EXPECTED CREDIT LOSS (IFRS 9 — Simplified Approach):');
      lines.push(`  • Model ECL: £${(r.ecl.modelECL || 0).toLocaleString()}`);
      lines.push(`  • Management provision: £${(r.ecl.managementProvision || 0).toLocaleString()}`);
      lines.push(`  • Difference: £${Math.abs((r.ecl.differenceFromManagement || 0)).toLocaleString()} (${r.ecl.differenceFromManagementPct}%) [${r.ecl.status}]`);
      lines.push(`  • ${r.ecl.differenceFromManagementPct > 15 ? 'Difference >15% — potential misstatement. Discuss with management.' : 'Within acceptable range of management estimate.'}`);
      lines.push('');
    }

    // Depreciation
    if (r.depreciation && r.depreciation.assetClasses) {
      lines.push('DEPRECIATION / USEFUL ECONOMIC LIFE ASSESSMENT:');
      r.depreciation.assetClasses.forEach(ac => {
        lines.push(`  • ${ac.class}: UEL ${ac.impliedRemainingLife}yr remaining [${ac.status}] — ${ac.note}`);
      });
      if (r.depreciation.sensitivity) {
        lines.push(`  • UEL sensitivity (20% reduction): P&L impact £${(r.depreciation.sensitivity.plImpact || 0).toLocaleString()}, Net asset impact £${(r.depreciation.sensitivity.netAssetImpact || 0).toLocaleString()}`);
      }
      lines.push('');
    }

    // Impairment
    if (r.impairment) {
      lines.push('IMPAIRMENT INDICATORS (IAS 36):');
      lines.push(`  • External indicators: ${r.impairment.externalIndicators?.join(', ') || 'None identified'}`);
      lines.push(`  • Internal indicators: ${r.impairment.internalIndicators?.join(', ') || 'None identified'}`);
      lines.push(`  • Indicators present: ${r.impairment.indicatorsPresent ? 'YES — recoverable amount testing required' : 'No'}`);
      if (r.impairment.recoverable) {
        lines.push(`  • Recoverable amount (VIU): £${(r.impairment.recoverable.viu || 0).toLocaleString()}`);
        lines.push(`  • Carrying amount: £${(r.impairment.recoverable.carryingAmount || 0).toLocaleString()}`);
        lines.push(`  • Impairment required: ${r.impairment.recoverable.impairmentRequired ? `YES — £${(r.impairment.recoverable.impairmentAmount || 0).toLocaleString()}` : 'No'}`);
      }
      lines.push('');
    }

    // Fair value
    if (r.fairValueHierarchy) {
      lines.push('FAIR VALUE HIERARCHY (IFRS 13):');
      lines.push(`  • Level 1 instruments: £${(r.fairValueHierarchy.level1Total || 0).toLocaleString()}`);
      lines.push(`  • Level 2 instruments: £${(r.fairValueHierarchy.level2Total || 0).toLocaleString()}`);
      lines.push(`  • Level 3 instruments: £${(r.fairValueHierarchy.level3Total || 0).toLocaleString()} [${r.fairValueHierarchy.level3Present ? 'HIGH UNCERTAINTY' : 'N/A'}]`);
      lines.push('');
    }

    // Provisions
    if (r.provisions && r.provisions.items) {
      lines.push('PROVISIONS (IAS 37):');
      r.provisions.items.forEach(p => {
        lines.push(`  • ${p.description}: £${(p.managementAmount || 0).toLocaleString()} (model: £${(p.modelAmount || 0).toLocaleString()}) [${p.status}]`);
      });
      lines.push('');
    }

    // Goodwill
    if (r.goodwillImpairment && r.goodwillImpairment.carryingAmount > 0) {
      lines.push('GOODWILL IMPAIRMENT (Gordon Growth Model):');
      lines.push(`  • Carrying amount: £${(r.goodwillImpairment.carryingAmount || 0).toLocaleString()}`);
      lines.push(`  • Value in use (VIU): £${(r.goodwillImpairment.viu || 0).toLocaleString()}`);
      lines.push(`  • Headroom: £${(r.goodwillImpairment.headroom || 0).toLocaleString()} (${r.goodwillImpairment.headroomPct}%) [${r.goodwillImpairment.status}]`);
      if (r.goodwillImpairment.sensitivity) {
        lines.push(`  • Sensitivity: ±1% growth rate → VIU change ±£${(r.goodwillImpairment.sensitivity.growthRateImpact || 0).toLocaleString()}`);
        lines.push(`  • Sensitivity: ±0.5% WACC → VIU change ±£${(r.goodwillImpairment.sensitivity.waccImpact || 0).toLocaleString()}`);
      }
    }

    if (r.warnings && r.warnings.length > 0) {
      lines.push('', 'WARNINGS / MATTERS FOR AUDIT ATTENTION:');
      r.warnings.forEach(w => lines.push(`  ! ${w}`));
    }

    lines.push('', `ISA References: ISA 540, IFRS 9, IAS 36, IFRS 13, IAS 37`);
    lines.push(`Date of assessment: ${new Date().toISOString().split('T')[0]}`);

    return lines.join('\n');
  },

  getAffectedSections(results) {
    const sections = ['trade_debtors', 'ppe', 'intangibles', 'provisions', 'financial_instruments', 'goodwill', 'audit_differences'];
    const r = results || {};

    if (r.overallStatus === 'RED') sections.push('going_concern');
    if (r.fairValueHierarchy?.level3Present) sections.push('investments');
    if (r.goodwillImpairment?.headroomPct < 20) sections.push('intangibles');

    return [...new Set(sections)];
  },

  getExportData(results) {
    const r = results || {};
    return {
      sheetName: 'Estimates & Valuation',
      isaReference: 'ISA 540',
      overallStatus: r.overallStatus,
      sections: [
        {
          title: 'ECL Model vs Management Provision',
          columns: ['Aging Bucket', 'Balance (£)', 'PD Rate', 'LGD', 'ECL (£)'],
          rows: r.ecl?.bucketDetail ? Object.entries(r.ecl.bucketDetail).map(([bucket, d]) => [bucket, d.balance, `${_round(d.pdRate * 100, 1)}%`, `${_round(d.lgd * 100, 0)}%`, d.ecl]) : [],
        },
        {
          title: 'ECL Summary',
          columns: ['Item', 'Value'],
          rows: [
            ['Model ECL (£)', r.ecl?.modelECL],
            ['Management Provision (£)', r.ecl?.managementProvision],
            ['Difference (£)', r.ecl?.differenceFromManagement],
            ['Difference (%)', `${r.ecl?.differenceFromManagementPct}%`],
            ['Status', r.ecl?.status],
          ],
        },
        {
          title: 'Depreciation / UEL Assessment',
          columns: ['Asset Class', 'NBV (£)', 'Annual Dep (£)', 'Implied Remaining Life (yr)', 'Industry UEL (yr)', 'Status', 'Notes'],
          rows: (r.depreciation?.assetClasses || []).map(ac => [
            ac.class, ac.nbv, ac.annualDepreciation, ac.impliedRemainingLife, ac.industryUEL, ac.status, ac.note,
          ]),
        },
        {
          title: 'Goodwill Impairment',
          columns: ['Parameter', 'Value'],
          rows: [
            ['Carrying Amount (£)', r.goodwillImpairment?.carryingAmount],
            ['Terminal Cash Flow (£)', r.goodwillImpairment?.terminalCF],
            ['Growth Rate (g)', `${_round((r.goodwillImpairment?.growthRate || 0) * 100, 2)}%`],
            ['WACC', `${_round((r.goodwillImpairment?.wacc || 0) * 100, 2)}%`],
            ['Terminal Value (£)', r.goodwillImpairment?.terminalValue],
            ['PV of Forecast CFs (£)', r.goodwillImpairment?.pvForecastCFs],
            ['Value in Use (£)', r.goodwillImpairment?.viu],
            ['Headroom (£)', r.goodwillImpairment?.headroom],
            ['Headroom %', `${r.goodwillImpairment?.headroomPct}%`],
            ['Status', r.goodwillImpairment?.status],
          ],
        },
        {
          title: 'Management Assumptions vs Auditor Range',
          columns: ['Estimate', 'Management Assumption', 'Auditor Point Estimate', 'Reasonable Range Low', 'Reasonable Range High', 'Within Range?', 'Misstatement?'],
          rows: _buildAssumptionTable(r),
        },
      ],
      findings: this.generateFindings(results),
      affectedSections: this.getAffectedSections(results),
    };
  },
};

// ─── ECL Calculation ─────────────────────────────────────────────
function _calculateECL(f, ed, ctx) {
  const aging = ed.debtorAging || {};
  const lgd = ed.lgd || ctx.lgd || 0.6; // Default LGD 60%
  const sectorStress = ed.sectorStress || false;
  const economicDownturn = ed.economicDownturn || false;

  const adjustmentFactor = 1 + (sectorStress ? 0.10 : 0) + (economicDownturn ? 0.05 : 0);

  const buckets = [
    { key: 'current', label: '0-30 days', balance: aging.current || aging.days0_30 || 0, pdBase: ECL_PD_RATES.current },
    { key: 'days31_60', label: '31-60 days', balance: aging.days31_60 || 0, pdBase: ECL_PD_RATES.days31_60 },
    { key: 'days61_90', label: '61-90 days', balance: aging.days61_90 || 0, pdBase: ECL_PD_RATES.days61_90 },
    { key: 'days91_120', label: '91-120 days', balance: aging.days91_120 || 0, pdBase: ECL_PD_RATES.days91_120 },
    { key: 'days120_180', label: '120-180 days', balance: aging.days120_180 || 0, pdBase: ECL_PD_RATES.days120_180 },
    { key: 'over180', label: '>180 days', balance: aging.over180 || 0, pdBase: ECL_PD_RATES.over180 },
    { key: 'dispute', label: 'In dispute / legal', balance: aging.dispute || aging.inDispute || 0, pdBase: ECL_PD_RATES.dispute },
  ];

  let totalECL = 0;
  const bucketDetail = {};

  buckets.forEach(bucket => {
    const pd = Math.min(bucket.pdBase * adjustmentFactor, 1.0);
    const ecl = bucket.balance * pd * lgd;
    totalECL += ecl;
    bucketDetail[bucket.label] = {
      balance: bucket.balance,
      pdRate: _round(pd, 4),
      lgd: lgd,
      ecl: _round(ecl, 0),
    };
  });

  const managementProvision = ed.managementEclProvision || f.badDebtProvision || f.provisionsTradeDebtors || 0;
  const difference = totalECL - managementProvision;
  const differenceFromManagementPct = managementProvision > 0 ? _round(Math.abs(difference / managementProvision) * 100, 1) : null;

  const status = differenceFromManagementPct !== null && differenceFromManagementPct > 15 ? 'RED' : 'GREEN';

  return {
    modelECL: _round(totalECL, 0),
    managementProvision,
    differenceFromManagement: _round(difference, 0),
    differenceFromManagementPct,
    bucketDetail,
    adjustmentFactor: _round(adjustmentFactor, 2),
    forwardLookingAdjustments: { sectorStress, economicDownturn },
    lgd,
    status,
    note: status === 'RED'
      ? `Management provision of £${managementProvision.toLocaleString()} differs from IFRS 9 model by ${differenceFromManagementPct}% — exceeds 15% tolerance. Potential understatement of £${Math.abs(_round(difference, 0)).toLocaleString()}.`
      : 'Management provision is within 15% of model output.',
  };
}

// ─── Depreciation / UEL Assessment ──────────────────────────────
function _assessDepreciation(f, ed) {
  const assetSchedule = ed.assetSchedule || f.assetSchedule || [];
  const assetClasses = [];
  let totalSensitivityPlImpact = 0;
  let totalSensitivityNetAsset = 0;
  let overallStatus = 'GREEN';

  const defaultClasses = [
    { class: 'IT Equipment', nbv: f.itEquipmentNBV || 0, annualDep: f.itEquipmentDepreciation || 0, type: 'it_equipment' },
    { class: 'Machinery', nbv: f.machineryNBV || 0, annualDep: f.machineryDepreciation || 0, type: 'machinery' },
    { class: 'Buildings', nbv: f.buildingsNBV || 0, annualDep: f.buildingsDepreciation || 0, type: 'buildings' },
    { class: 'Vehicles', nbv: f.vehiclesNBV || 0, annualDep: f.vehiclesDepreciation || 0, type: 'vehicles' },
    { class: 'Fixtures & Fittings', nbv: f.fixturesNBV || 0, annualDep: f.fixturesDepreciation || 0, type: 'fixtures' },
  ];

  const classes = assetSchedule.length > 0 ? assetSchedule : defaultClasses;

  classes.forEach(asset => {
    if (asset.annualDep === 0 || !asset.nbv) return;

    const impliedRemainingLife = _round(asset.nbv / asset.annualDep, 1);
    const uelBenchmark = INDUSTRY_UEL[asset.type] || INDUSTRY_UEL[_mapAssetType(asset.class)];
    const industryUEL = uelBenchmark ? `${uelBenchmark.min}-${uelBenchmark.max}` : 'N/A';
    const maxUEL = uelBenchmark ? uelBenchmark.max : null;

    let status = 'GREEN';
    let note = 'Implied remaining life within industry norms.';

    if (maxUEL !== null && impliedRemainingLife > maxUEL * 1.2) {
      status = 'RED';
      note = `Implied remaining life of ${impliedRemainingLife}yr exceeds industry maximum of ${maxUEL}yr — potential understatement of depreciation charge.`;
      overallStatus = 'RED';
    } else if (maxUEL !== null && impliedRemainingLife > maxUEL) {
      status = 'AMBER';
      note = `Implied remaining life of ${impliedRemainingLife}yr slightly exceeds industry norm of ${maxUEL}yr — review useful life estimate.`;
      if (overallStatus !== 'RED') overallStatus = 'AMBER';
    }

    // Sensitivity: 20% reduction in UEL → increase in annual charge
    const sensitivityAdditionalCharge = asset.annualDep * 0.25; // 20% shorter life = 25% more annual charge
    totalSensitivityPlImpact += sensitivityAdditionalCharge;
    totalSensitivityNetAsset -= sensitivityAdditionalCharge;

    // Fully depreciated but still in use flag
    if (asset.nbv === 0 && asset.grossCost > 0 && asset.stillInUse) {
      note += ' Asset fully depreciated but still in use — review useful life.';
      if (status === 'GREEN') status = 'AMBER';
    }

    assetClasses.push({
      class: asset.class,
      nbv: asset.nbv,
      annualDepreciation: asset.annualDep,
      impliedRemainingLife,
      industryUEL,
      status,
      note,
    });
  });

  return {
    assetClasses,
    overallStatus,
    sensitivity: {
      description: 'Impact of 20% reduction in useful economic lives across all asset classes',
      plImpact: _round(totalSensitivityPlImpact, 0),
      netAssetImpact: _round(totalSensitivityNetAsset, 0),
    },
  };
}

// ─── Impairment Assessment ───────────────────────────────────────
function _assessImpairment(f, ed, ctx) {
  const externalIndicators = [];
  const internalIndicators = [];

  // External indicators
  if (ed.assetValueDecline || ctx.assetValueDecline) externalIndicators.push('Significant decline in asset market value');
  if (ed.adverseTechnologyChange) externalIndicators.push('Adverse changes in technology');
  if (ed.marketInterestRateIncrease) externalIndicators.push('Market interest rates increased (discount rate effect)');
  const netAssets = f.totalAssets - (f.totalLiabilities || 0);
  const marketCap = f.marketCap || ctx.marketCap || 0;
  if (marketCap > 0 && netAssets > marketCap) externalIndicators.push('Net assets exceed market capitalisation');

  // Internal indicators
  if (ed.assetObsolescence) internalIndicators.push('Evidence of asset obsolescence');
  if (ed.physicalDamage) internalIndicators.push('Physical damage to assets');
  if (ed.assetUnderperformance) internalIndicators.push('Asset underperforming versus internal budget');
  if (ed.disposalPlans) internalIndicators.push('Plans to dispose of asset before end of economic life');

  const indicatorsPresent = externalIndicators.length > 0 || internalIndicators.length > 0;

  let recoverable = null;
  if (indicatorsPresent && ed.assetCashFlows) {
    const cashFlows = ed.assetCashFlows || [];
    const discountRate = ctx.discountRate || 0.08;
    const viu = cashFlows.reduce((pv, cf, t) => pv + cf / Math.pow(1 + discountRate, t + 1), 0);
    const fairValueLessCosts = ed.fairValueLessCosts || viu * 0.95;
    const recoverableAmount = Math.max(viu, fairValueLessCosts);
    const carryingAmount = ed.assetCarryingAmount || f.ppe || 0;
    const impairmentRequired = carryingAmount > recoverableAmount;
    recoverable = {
      viu: _round(viu, 0),
      fairValueLessCosts: _round(fairValueLessCosts, 0),
      recoverableAmount: _round(recoverableAmount, 0),
      carryingAmount,
      impairmentRequired,
      impairmentAmount: impairmentRequired ? _round(carryingAmount - recoverableAmount, 0) : 0,
      discountRateUsed: discountRate,
    };
  }

  return {
    externalIndicators,
    internalIndicators,
    indicatorsPresent,
    recoverable,
    status: indicatorsPresent ? (recoverable?.impairmentRequired ? 'RED' : 'AMBER') : 'GREEN',
  };
}

// ─── Fair Value Hierarchy ────────────────────────────────────────
function _assessFairValueHierarchy(f, ed) {
  const instruments = ed.financialInstruments || [];

  const level1 = instruments.filter(i => i.level === 1 || i.fvLevel === 1);
  const level2 = instruments.filter(i => i.level === 2 || i.fvLevel === 2);
  const level3 = instruments.filter(i => i.level === 3 || i.fvLevel === 3);

  const level1Total = level1.reduce((s, i) => s + (i.fairValue || 0), 0);
  const level2Total = level2.reduce((s, i) => s + (i.fairValue || 0), 0);
  const level3Total = level3.reduce((s, i) => s + (i.fairValue || 0), 0);
  const totalFV = level1Total + level2Total + level3Total;

  const level3Pct = totalFV > 0 ? _round((level3Total / totalFV) * 100, 1) : 0;

  return {
    level1Total: _round(level1Total, 0),
    level2Total: _round(level2Total, 0),
    level3Total: _round(level3Total, 0),
    level3Pct,
    level3Present: level3Total > 0,
    level3Items: level3.map(i => ({
      name: i.name || i.description || 'Unnamed instrument',
      fairValue: i.fairValue,
      keyAssumptions: i.keyAssumptions || 'Not provided',
      sensitivityRange: i.sensitivityRange || 'Not provided',
    })),
    status: level3Total > 0 ? 'AMBER' : 'GREEN',
  };
}

// ─── Provisions ──────────────────────────────────────────────────
function _assessProvisions(f, ed, ctx) {
  const provisions = ed.provisions || [];
  const riskFreeRate = ctx.riskFreeRate || 0.04;
  const items = [];
  let overallStatus = 'GREEN';

  provisions.forEach(prov => {
    let modelAmount = 0;

    if (prov.type === 'single_outcome') {
      modelAmount = prov.amount || 0;
    } else if (prov.type === 'probability_weighted') {
      const outcomes = prov.outcomes || [];
      modelAmount = outcomes.reduce((sum, o) => sum + (o.probability || 0) * (o.amount || 0), 0);
    } else if (prov.type === 'legal') {
      modelAmount = (prov.probability || 0) * (prov.exposure || 0);
    } else {
      modelAmount = prov.amount || 0;
    }

    // Discount if material time value
    let discountedAmount = modelAmount;
    const yearsToSettlement = prov.yearsToSettlement || 0;
    if (yearsToSettlement > 1 && modelAmount > (ctx.materiality || 0)) {
      discountedAmount = modelAmount / Math.pow(1 + riskFreeRate, yearsToSettlement);
    }

    const managementAmount = prov.managementAmount || prov.bookValue || 0;
    const difference = discountedAmount - managementAmount;
    const differenceIsSignificant = ctx.performanceMateriality
      ? Math.abs(difference) > ctx.performanceMateriality
      : Math.abs(difference) > modelAmount * 0.15;

    const status = differenceIsSignificant ? 'AMBER' : 'GREEN';
    if (status === 'AMBER' && overallStatus === 'GREEN') overallStatus = 'AMBER';

    // Sensitivity: ±20% probability
    const sensitivityHigh = prov.type === 'legal' || prov.type === 'probability_weighted'
      ? (prov.probability ? Math.min(prov.probability + 0.2, 1.0) : 1) * (prov.exposure || prov.amount || 0)
      : modelAmount * 1.2;
    const sensitivityLow = prov.type === 'legal' || prov.type === 'probability_weighted'
      ? Math.max((prov.probability || 0) - 0.2, 0) * (prov.exposure || prov.amount || 0)
      : modelAmount * 0.8;

    items.push({
      description: prov.description || prov.name || 'Provision',
      type: prov.type,
      modelAmount: _round(modelAmount, 0),
      discountedAmount: _round(discountedAmount, 0),
      managementAmount,
      difference: _round(difference, 0),
      status,
      sensitivity: { high: _round(sensitivityHigh, 0), low: _round(sensitivityLow, 0), impactOfChange: _round(sensitivityHigh - sensitivityLow, 0) },
      yearsToSettlement,
      discountRateUsed: yearsToSettlement > 1 ? riskFreeRate : null,
    });
  });

  return { items, overallStatus };
}

// ─── Goodwill Impairment ──────────────────────────────────────────
function _assessGoodwillImpairment(f, ed, ctx) {
  const goodwill = f.goodwill || f.goodwillNBV || 0;
  if (goodwill === 0) return { carryingAmount: 0, status: 'N/A', note: 'No goodwill on balance sheet' };

  const wacc = ctx.wacc || ed.wacc || 0.10;
  const growthRate = ed.terminalGrowthRate || SUSTAINABLE_GROWTH_RATE;
  const forecastCFs = ed.goodwillCGUCashFlows || ed.forecastCashFlows || [];
  const carryingAmount = ed.cguCarryingAmount || goodwill;

  if (forecastCFs.length === 0) {
    return {
      carryingAmount,
      status: 'N/A',
      note: 'No CGU cash flow forecasts provided — impairment test cannot be performed. Management\'s VIU calculation required.',
    };
  }

  // PV of forecast cash flows
  const pvForecastCFs = forecastCFs.reduce((pv, cf, t) => pv + cf / Math.pow(1 + wacc, t + 1), 0);

  // Terminal value using Gordon Growth Model: TV = CF_n × (1+g) / (WACC - g)
  const lastCF = forecastCFs[forecastCFs.length - 1];
  const terminalCF = lastCF * (1 + growthRate);
  const terminalValueDenom = wacc - growthRate;
  const terminalValue = terminalValueDenom > 0 ? terminalCF / terminalValueDenom : 0;
  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, forecastCFs.length);

  const viu = pvForecastCFs + pvTerminalValue;
  const headroom = viu - carryingAmount;
  const headroomPct = carryingAmount > 0 ? _round((headroom / carryingAmount) * 100, 1) : null;

  let status = 'GREEN';
  if (headroom < 0) status = 'RED';
  else if (headroomPct !== null && headroomPct < 20) status = 'AMBER';

  // Sensitivity analysis
  const viuGrowthPlus1 = pvForecastCFs + (lastCF * (1 + growthRate + 0.01)) / ((wacc - growthRate - 0.01) * Math.pow(1 + wacc, forecastCFs.length));
  const viuGrowthMinus1 = pvForecastCFs + (lastCF * (1 + growthRate - 0.01)) / ((wacc - growthRate + 0.01) * Math.pow(1 + wacc, forecastCFs.length));
  const viuWaccPlus05 = forecastCFs.reduce((pv, cf, t) => pv + cf / Math.pow(1 + wacc + 0.005, t + 1), 0) + (terminalCF / ((wacc + 0.005 - growthRate) * Math.pow(1 + wacc + 0.005, forecastCFs.length)));
  const viuWaccMinus05 = forecastCFs.reduce((pv, cf, t) => pv + cf / Math.pow(1 + wacc - 0.005, t + 1), 0) + (terminalCF / ((wacc - 0.005 - growthRate) * Math.pow(1 + wacc - 0.005, forecastCFs.length)));

  return {
    carryingAmount,
    pvForecastCFs: _round(pvForecastCFs, 0),
    terminalCF: _round(terminalCF, 0),
    terminalValue: _round(terminalValue, 0),
    pvTerminalValue: _round(pvTerminalValue, 0),
    viu: _round(viu, 0),
    headroom: _round(headroom, 0),
    headroomPct,
    wacc,
    growthRate,
    status,
    impairmentRequired: headroom < 0,
    impairmentAmount: headroom < 0 ? _round(Math.abs(headroom), 0) : 0,
    sensitivity: {
      growthRateImpact: _round(Math.abs(viuGrowthPlus1 - viuGrowthMinus1) / 2, 0),
      waccImpact: _round(Math.abs(viuWaccPlus05 - viuWaccMinus05) / 2, 0),
      breakEvenGrowthRate: _round((wacc * carryingAmount - pvForecastCFs * (wacc - growthRate)) / (carryingAmount - pvForecastCFs) * 100, 2),
    },
    note: status === 'RED'
      ? `Carrying amount exceeds VIU — goodwill impairment of £${Math.abs(_round(headroom, 0)).toLocaleString()} required.`
      : headroomPct !== null && headroomPct < 20
        ? `Headroom of ${headroomPct}% is below 20% ISA 540 high uncertainty threshold. Sensitivity analysis and management challenge required.`
        : 'Goodwill impairment test passes. Adequate headroom.',
  };
}

// ─── Assumption Table Helper ─────────────────────────────────────
function _buildAssumptionTable(r) {
  const rows = [];

  if (r.ecl?.modelECL !== undefined) {
    const mgmt = r.ecl.managementProvision || 0;
    const model = r.ecl.modelECL;
    const rangeLow = _round(model * 0.85, 0);
    const rangeHigh = _round(model * 1.15, 0);
    const withinRange = mgmt >= rangeLow && mgmt <= rangeHigh;
    rows.push(['ECL Provision', `£${mgmt.toLocaleString()}`, `£${model.toLocaleString()}`, `£${rangeLow.toLocaleString()}`, `£${rangeHigh.toLocaleString()}`, withinRange ? 'Yes' : 'No', withinRange ? 'Not a misstatement' : 'Potential misstatement — investigate']);
  }

  if (r.goodwillImpairment?.viu) {
    rows.push(['Goodwill VIU', `${_round((r.goodwillImpairment.growthRate || 0) * 100, 2)}% growth`, `£${(r.goodwillImpairment.viu || 0).toLocaleString()}`, `±1% growth / ±0.5% WACC`, '', r.goodwillImpairment.status !== 'RED' ? 'Yes' : 'No', r.goodwillImpairment.note]);
  }

  return rows;
}

// ─── Asset Type Mapping ──────────────────────────────────────────
function _mapAssetType(className) {
  if (!className) return 'fixtures';
  const name = className.toLowerCase();
  if (name.includes('it') || name.includes('computer') || name.includes('software')) return 'it_equipment';
  if (name.includes('machine') || name.includes('plant')) return 'machinery';
  if (name.includes('build') || name.includes('property') || name.includes('freehold') || name.includes('leasehold')) return 'buildings';
  if (name.includes('vehicle') || name.includes('car') || name.includes('van')) return 'vehicles';
  if (name.includes('fixture') || name.includes('fitting') || name.includes('furniture')) return 'fixtures';
  return 'fixtures';
}

// ─── Helpers ────────────────────────────────────────────────────
function _round(val, dp) {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}
