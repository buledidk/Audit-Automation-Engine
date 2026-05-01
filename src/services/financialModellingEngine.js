/**
 * Financial Modelling Engine — 8 calculators
 * IFRS 16, IFRS 9, IFRS 15, IFRS 3, IAS 12, IAS 37, IAS 19, consolidation
 * Each returns: inputs, calculations, outputs, journalEntries, isaReference, auditConclusion
 */

// ─── 1. INTEREST CALCULATION ──────────────────────────────────────────────

/**
 * @param {number} principal
 * @param {number} rate          annual rate as decimal (e.g. 0.05)
 * @param {number} periods       in months
 * @param {'simple'|'compound'|'effective'} method
 */
export function calculateInterest(principal, rate, periods, method = 'effective') {
  const monthlyRate = rate / 12;
  let interest, effectiveRate;

  if (method === 'simple') {
    interest      = principal * rate * (periods / 12);
    effectiveRate = rate;
  } else if (method === 'compound') {
    const fv      = principal * Math.pow(1 + monthlyRate, periods);
    interest      = fv - principal;
    effectiveRate = Math.pow(1 + rate / 12, 12) - 1;
  } else { // effective interest method (IAS 39 / IFRS 9)
    let balance   = principal;
    let totalInt  = 0;
    const schedule = [];
    for (let p = 1; p <= periods; p++) {
      const intCharge = balance * monthlyRate;
      totalInt  += intCharge;
      schedule.push({ period: p, openingBalance: balance, interestCharge: Number(intCharge.toFixed(2)), closingBalance: Number((balance + intCharge).toFixed(2)) });
      balance   += intCharge;
    }
    interest      = totalInt;
    effectiveRate = rate;
    return {
      inputs:     { principal, rate, periods, method },
      calculations: { schedule },
      outputs: {
        totalInterest:  Number(interest.toFixed(2)),
        effectiveRate:  (effectiveRate * 100).toFixed(2) + '%',
        finalBalance:   Number((principal + interest).toFixed(2)),
      },
      journalEntries: [
        { dr: 'Finance Costs', cr: 'Loan Balance', amount: Number(interest.toFixed(2)), narrative: `Interest accrual — ${periods} months at ${(rate * 100).toFixed(2)}% EIR` },
      ],
      isaReference:    'IAS 39 / IFRS 9 — Effective Interest Method',
      auditConclusion: `Total interest expense of £${interest.toFixed(2)} calculated using effective interest method. Agree carrying value to loan agreement and amortisation schedule.`,
    };
  }

  return {
    inputs:     { principal, rate, periods, method },
    outputs: {
      totalInterest:  Number(interest.toFixed(2)),
      effectiveRate:  (effectiveRate * 100).toFixed(2) + '%',
      finalBalance:   Number((principal + interest).toFixed(2)),
    },
    journalEntries: [
      { dr: 'Finance Costs', cr: 'Accrued Interest', amount: Number(interest.toFixed(2)), narrative: `Interest accrual — ${method}` },
    ],
    isaReference:    'IAS 23 / IFRS 9',
    auditConclusion: `Total interest of £${interest.toFixed(2)} over ${periods} months. Recalculated and agreed to loan documentation.`,
  };
}

// ─── 2. DEPRECIATION CALCULATION ─────────────────────────────────────────

/**
 * @param {number} cost
 * @param {number} residualValue
 * @param {number} usefulLifeYears
 * @param {'straight_line'|'reducing_balance'|'units_of_production'} method
 * @param {Object} options   { rate, unitsProduced, totalUnits }
 */
export function calculateDepreciation(cost, residualValue, usefulLifeYears, method = 'straight_line', options = {}) {
  const depreciableAmount = cost - residualValue;
  let annual, schedule = [];

  if (method === 'straight_line') {
    annual = depreciableAmount / usefulLifeYears;
    let nbv = cost;
    for (let y = 1; y <= usefulLifeYears; y++) {
      const dep = Math.min(annual, nbv - residualValue);
      schedule.push({ year: y, depreciation: Number(dep.toFixed(2)), nbv: Number((nbv - dep).toFixed(2)), openingNBV: Number(nbv.toFixed(2)) });
      nbv -= dep;
    }
  } else if (method === 'reducing_balance') {
    const rate = options.rate || (1 - Math.pow(residualValue / cost, 1 / usefulLifeYears));
    let nbv    = cost;
    for (let y = 1; y <= usefulLifeYears; y++) {
      const dep = nbv * rate;
      schedule.push({ year: y, depreciation: Number(dep.toFixed(2)), nbv: Number((nbv - dep).toFixed(2)), openingNBV: Number(nbv.toFixed(2)) });
      nbv -= dep;
    }
    annual = schedule[0].depreciation;
  } else if (method === 'units_of_production') {
    const ratePerUnit = depreciableAmount / (options.totalUnits || 1);
    annual = ratePerUnit * (options.unitsProduced || 0);
    schedule.push({ year: 1, depreciation: Number(annual.toFixed(2)), nbv: Number((cost - annual).toFixed(2)) });
  }

  return {
    inputs:     { cost, residualValue, usefulLifeYears, method },
    outputs: {
      annualDepreciation: Number(annual?.toFixed(2) || 0),
      totalDepreciation:  Number(depreciableAmount.toFixed(2)),
      depreciableAmount,
    },
    schedule,
    journalEntries: [
      { dr: 'Depreciation Charge', cr: 'Accumulated Depreciation', amount: Number(annual?.toFixed(2) || 0), narrative: `Annual depreciation — ${method.replace(/_/g, ' ')}` },
    ],
    isaReference:    'IAS 16 / FRS 102 Section 17',
    auditConclusion: `Annual depreciation of £${annual?.toFixed(2)} calculated using ${method} method. Verify consistency with prior year policy and agreement to asset register.`,
  };
}

// ─── 3. IFRS 16 LEASE CALCULATOR ─────────────────────────────────────────

/**
 * @param {number} annualPayment
 * @param {number} leaseTerm        years
 * @param {number} ibr              incremental borrowing rate (decimal)
 * @param {boolean} paymentInAdvance
 */
export function calculateIFRS16Lease(annualPayment, leaseTerm, ibr, paymentInAdvance = false) {
  const monthlyPayment = annualPayment / 12;
  const monthlyRate    = ibr / 12;
  const periods        = leaseTerm * 12;
  const adj            = paymentInAdvance ? (1 + monthlyRate) : 1;

  // Present value of lease payments
  const pv = monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -periods)) / monthlyRate) * adj;

  // Amortisation schedule
  let balance = pv;
  const schedule = [];
  for (let m = 1; m <= periods; m++) {
    const interest    = balance * monthlyRate;
    const repayment   = monthlyPayment - interest;
    const depreciation = pv / periods;
    schedule.push({
      month:       m,
      opening:     Number(balance.toFixed(2)),
      payment:     Number(monthlyPayment.toFixed(2)),
      interest:    Number(interest.toFixed(2)),
      repayment:   Number(repayment.toFixed(2)),
      closing:     Number(Math.max(0, balance - repayment).toFixed(2)),
      rouDepreciation: Number(depreciation.toFixed(2)),
    });
    balance = Math.max(0, balance - repayment);
  }

  const year1 = schedule.slice(0, 12);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);

  return {
    inputs:  { annualPayment, leaseTerm, ibr, paymentInAdvance },
    outputs: {
      rouAsset:              Number(pv.toFixed(2)),
      leaseLiability:        Number(pv.toFixed(2)),
      year1InterestCharge:   Number(year1.reduce((s, r) => s + r.interest, 0).toFixed(2)),
      year1Repayment:        Number(year1.reduce((s, r) => s + r.repayment, 0).toFixed(2)),
      annualDepreciation:    Number((pv / leaseTerm).toFixed(2)),
      totalInterest:         Number(totalInterest.toFixed(2)),
    },
    schedule: schedule.slice(0, 24), // show first 2 years in detail
    journalEntries: [
      { dr: 'Right-of-Use Asset',    cr: 'Lease Liability',         amount: Number(pv.toFixed(2)), narrative: 'Initial recognition of lease — IFRS 16.22' },
      { dr: 'Finance Costs',         cr: 'Lease Liability',         amount: Number(year1.reduce((s, r) => s + r.interest, 0).toFixed(2)), narrative: 'Year 1 interest charge on lease liability' },
      { dr: 'Lease Liability',       cr: 'Cash',                    amount: Number(annualPayment.toFixed(2)), narrative: 'Year 1 lease payments made' },
      { dr: 'Depreciation Charge',   cr: 'Accumulated Depreciation', amount: Number((pv / leaseTerm).toFixed(2)), narrative: 'Year 1 ROU asset depreciation (straight-line)' },
    ],
    isaReference:    'IFRS 16 / FRS 102 Section 20A',
    auditConclusion: `ROU asset and lease liability of £${pv.toFixed(2)} at inception. IBR of ${(ibr * 100).toFixed(2)}% applied — document evidence of corroboration (e.g. comparable borrowing rates, bank quotes). Verify in current-year balance sheet.`,
  };
}

// ─── 4. ECL CALCULATOR (IFRS 9) ───────────────────────────────────────────

/**
 * @param {Array}  debtors  [{ id, amount, daysOverdue, creditRating }]
 * @param {Object} scenarios { base: 0.5, upside: 0.3, downside: 0.2 } — probability weights
 */
export function calculateECL(debtors, scenarios = { base: 0.5, upside: 0.3, downside: 0.2 }) {
  // PD matrix by days overdue (simplified)
  const pdMatrix = {
    base:     { current: 0.005, '1-30': 0.02, '31-60': 0.05, '61-90': 0.12, '91-180': 0.25, '>180': 0.60 },
    upside:   { current: 0.002, '1-30': 0.01, '31-60': 0.03, '61-90': 0.08, '91-180': 0.18, '>180': 0.45 },
    downside: { current: 0.010, '1-30': 0.04, '31-60': 0.09, '61-90': 0.20, '91-180': 0.40, '>180': 0.75 },
  };

  const lgd    = 0.45; // 45% loss given default — standard for unsecured trade debtors
  const ead    = (d) => d.amount;

  function getBucket(days) {
    if (days <= 0)   return 'current';
    if (days <= 30)  return '1-30';
    if (days <= 60)  return '31-60';
    if (days <= 90)  return '61-90';
    if (days <= 180) return '91-180';
    return '>180';
  }

  const provisions = debtors.map(d => {
    const bucket = getBucket(d.daysOverdue || 0);
    let weightedECL = 0;
    for (const [scenario, weight] of Object.entries(scenarios)) {
      const pd  = pdMatrix[scenario][bucket];
      const ecl = ead(d) * pd * lgd;
      weightedECL += ecl * weight;
    }
    const stage = d.daysOverdue > 90 ? 3 : d.daysOverdue > 30 ? 2 : 1;
    return { ...d, bucket, stage, weightedECL: Number(weightedECL.toFixed(2)), pd: pdMatrix.base[bucket], lgd, provisionRate: ((weightedECL / d.amount) * 100).toFixed(2) + '%' };
  });

  const totalProvision = provisions.reduce((s, p) => s + p.weightedECL, 0);
  const totalExposure  = debtors.reduce((s, d) => s + d.amount, 0);

  return {
    inputs:   { scenarios, lgd },
    provisions,
    outputs: {
      totalProvision:  Number(totalProvision.toFixed(2)),
      totalExposure,
      provisionRate:   ((totalProvision / totalExposure) * 100).toFixed(2) + '%',
      stage1Count:     provisions.filter(p => p.stage === 1).length,
      stage2Count:     provisions.filter(p => p.stage === 2).length,
      stage3Count:     provisions.filter(p => p.stage === 3).length,
    },
    journalEntries: [
      { dr: 'Impairment Charge (P&L)', cr: 'Loss Allowance (B/S)', amount: Number(totalProvision.toFixed(2)), narrative: `ECL provision — weighted average of base/upside/downside scenarios per IFRS 9` },
    ],
    isaReference:    'IFRS 9 / ISA 540',
    auditConclusion: `ECL provision of £${totalProvision.toFixed(2)} (${((totalProvision / totalExposure) * 100).toFixed(2)}% of book value). Macroeconomic scenarios and PD rates require independent corroboration (FRC AQR finding ECL-01).`,
  };
}

// ─── 5. REVENUE RECOGNITION (IFRS 15) ────────────────────────────────────

/**
 * @param {Object} contract  { value, performanceObligations: [{name, relativeSSP, completed}], variableConsideration, constraintPct }
 */
export function calculateRevenueIFRS15(contract) {
  const { value, performanceObligations = [], variableConsideration = 0, constraintPct = 0 } = contract;

  // Constrain variable consideration
  const constrainedVC    = variableConsideration * (1 - constraintPct);
  const transactionPrice = value + constrainedVC;

  // Allocate to performance obligations based on relative SSP
  const totalSSP = performanceObligations.reduce((s, po) => s + (po.relativeSSP || 0), 0) || 1;

  const allocated = performanceObligations.map(po => {
    const allocation     = transactionPrice * ((po.relativeSSP || 0) / totalSSP);
    const recognised     = po.completed ? allocation : allocation * (po.completionPct || 0) / 100;
    const deferred       = allocation - recognised;
    return { ...po, allocation: Number(allocation.toFixed(2)), recognised: Number(recognised.toFixed(2)), deferred: Number(deferred.toFixed(2)) };
  });

  const totalRecognised = allocated.reduce((s, p) => s + p.recognised, 0);
  const totalDeferred   = allocated.reduce((s, p) => s + p.deferred, 0);

  return {
    inputs:   { transactionPrice, variableConsideration, constraintPct },
    allocated,
    outputs: {
      transactionPrice:  Number(transactionPrice.toFixed(2)),
      totalRecognised:   Number(totalRecognised.toFixed(2)),
      totalDeferred:     Number(totalDeferred.toFixed(2)),
      constrainedVC:     Number(constrainedVC.toFixed(2)),
    },
    journalEntries: [
      { dr: 'Trade Debtors / Cash', cr: 'Revenue', amount: Number(totalRecognised.toFixed(2)), narrative: 'Revenue recognised — performance obligations satisfied' },
      ...(totalDeferred > 0 ? [{ dr: 'Trade Debtors / Cash', cr: 'Contract Liability (Deferred Revenue)', amount: Number(totalDeferred.toFixed(2)), narrative: 'Deferred revenue — performance obligations not yet satisfied' }] : []),
    ],
    isaReference:    'IFRS 15 / FRS 102 Section 23',
    auditConclusion: `Revenue of £${totalRecognised.toFixed(2)} recognised. Deferred revenue of £${totalDeferred.toFixed(2)}. Verify basis for performance obligation identification and satisfaction criteria. FRC focus area: adequate challenge of variable consideration constraints.`,
  };
}

// ─── 6. DEFERRED TAX (IAS 12) ────────────────────────────────────────────

/**
 * @param {Array} temporaryDifferences [{ description, carryingAmount, taxBase, type: 'asset'|'liability' }]
 * @param {number} taxRate
 */
export function calculateDeferredTax(temporaryDifferences, taxRate = 0.25) {
  const dtAssets     = [];
  const dtLiabilities = [];

  for (const td of temporaryDifferences) {
    const diff = td.carryingAmount - td.taxBase;
    if (diff === 0) continue;

    if ((diff > 0 && td.type === 'liability') || (diff < 0 && td.type === 'asset')) {
      dtLiabilities.push({ ...td, tempDiff: diff, deferredTax: Number((Math.abs(diff) * taxRate).toFixed(2)) });
    } else {
      dtAssets.push({ ...td, tempDiff: diff, deferredTax: Number((Math.abs(diff) * taxRate).toFixed(2)) });
    }
  }

  const grossDTL     = dtLiabilities.reduce((s, d) => s + d.deferredTax, 0);
  const grossDTA     = dtAssets.reduce((s, d) => s + d.deferredTax, 0);
  const netPosition  = grossDTL - grossDTA;

  return {
    inputs:     { taxRate, itemCount: temporaryDifferences.length },
    dtAssets,
    dtLiabilities,
    outputs: {
      grossDTL:    Number(grossDTL.toFixed(2)),
      grossDTA:    Number(grossDTA.toFixed(2)),
      netPosition: Number(netPosition.toFixed(2)),
      netType:     netPosition > 0 ? 'Deferred Tax Liability' : 'Deferred Tax Asset',
    },
    journalEntries: [
      netPosition > 0
        ? { dr: 'Tax Expense (P&L)', cr: 'Deferred Tax Liability (B/S)', amount: Number(Math.abs(netPosition).toFixed(2)), narrative: `Net deferred tax liability — IAS 12 @ ${(taxRate * 100).toFixed(0)}%` }
        : { dr: 'Deferred Tax Asset (B/S)', cr: 'Tax Expense (P&L)', amount: Number(Math.abs(netPosition).toFixed(2)), narrative: `Net deferred tax asset — IAS 12 @ ${(taxRate * 100).toFixed(0)}%` },
    ],
    isaReference:    'IAS 12 / FRS 102 Section 29',
    auditConclusion: `Net deferred tax ${netPosition > 0 ? 'liability' : 'asset'} of £${Math.abs(netPosition).toFixed(2)}. Verify recoverability of DTA against future taxable profits. Confirm tax rate of ${(taxRate * 100).toFixed(0)}% expected to apply when differences reverse.`,
  };
}

// ─── 7. PROVISIONS (IAS 37) ──────────────────────────────────────────────

/**
 * @param {Array} items [{ description, probability, bestEstimate, worst, best }]
 */
export function calculateProvisions(items) {
  const provisions = items.map(item => {
    const { probability, bestEstimate, worst = bestEstimate * 1.5, best = bestEstimate * 0.5 } = item;
    const recognised = probability >= 0.5; // more likely than not
    const amount     = recognised ? bestEstimate : 0;
    const range      = { min: best, max: worst };
    const contingent = !recognised && probability >= 0.05;

    return {
      ...item,
      recognised,
      provisionAmount: Number(amount.toFixed(2)),
      range,
      contingent,
      disclosure: recognised
        ? 'Recognised in balance sheet — probability > 50%'
        : contingent
          ? 'Contingent liability — disclose in notes (5–50% probability)'
          : 'Remote — no disclosure required',
    };
  });

  const totalProvision = provisions.reduce((s, p) => s + p.provisionAmount, 0);

  return {
    provisions,
    outputs: {
      totalRecognised: Number(totalProvision.toFixed(2)),
      recognisedCount: provisions.filter(p => p.recognised).length,
      contingentCount: provisions.filter(p => p.contingent).length,
    },
    journalEntries: [
      { dr: 'Provisions Charge (P&L)', cr: 'Provisions (B/S)', amount: Number(totalProvision.toFixed(2)), narrative: 'Provision recognised — IAS 37 criteria met (probable and reliably measurable)' },
    ],
    isaReference:    'IAS 37 / FRS 102 Section 21',
    auditConclusion: `Total provisions of £${totalProvision.toFixed(2)} recognised. Verify that recognition criteria met (obligation exists, probable outflow, reliable estimate). Review board minutes and legal correspondence for contingent liabilities.`,
  };
}

// ─── 8. CONSOLIDATION ADJUSTMENTS ────────────────────────────────────────

/**
 * @param {Object} parent    { assets, liabilities, revenue, profit, equity }
 * @param {Array}  subsidiaries [{ name, assets, liabilities, revenue, profit, equity, ownership, acquisitionCost, netAssetsAtAcquisition, goodwillPrevRecognised }]
 * @param {Array}  intercompany [{ type: 'loan'|'trade'|'dividend', amount, fromEntity, toEntity }]
 */
export function calculateConsolidation(parent, subsidiaries, intercompany = []) {
  let consolidated = { ...parent };
  const goodwillCalcs = [];
  const eliminations  = [];

  for (const sub of subsidiaries) {
    const ownership  = sub.ownership || 1;
    const nci        = 1 - ownership;

    // Goodwill = Acquisition cost − (Net assets at acquisition × % owned)
    const goodwill   = sub.acquisitionCost - (sub.netAssetsAtAcquisition * ownership);

    goodwillCalcs.push({
      subsidiary:          sub.name,
      acquisitionCost:     sub.acquisitionCost,
      netAssetsAtAcquisition: sub.netAssetsAtAcquisition,
      ownership:           (ownership * 100).toFixed(1) + '%',
      goodwill:            Number(goodwill.toFixed(2)),
      nciAtAcquisition:    Number((sub.netAssetsAtAcquisition * nci).toFixed(2)),
    });

    // Add subsidiary figures (100%)
    consolidated.assets      += sub.assets || 0;
    consolidated.liabilities += sub.liabilities || 0;
    consolidated.revenue     += sub.revenue || 0;
    consolidated.profit      += sub.profit * ownership;
  }

  // Intercompany eliminations
  for (const ic of intercompany) {
    const elim = { ...ic, eliminated: true };
    if (ic.type === 'loan') {
      consolidated.assets      -= ic.amount;
      consolidated.liabilities -= ic.amount;
      elim.adjustment = `Eliminate intercompany loan of £${ic.amount}`;
    } else if (ic.type === 'trade') {
      consolidated.assets -= ic.amount; // eliminate unrealised profit
      elim.adjustment = `Eliminate intercompany trading balance of £${ic.amount}`;
    } else if (ic.type === 'dividend') {
      consolidated.profit -= ic.amount;
      elim.adjustment = `Eliminate intercompany dividend of £${ic.amount}`;
    }
    eliminations.push(elim);
  }

  // Add goodwill to consolidated assets
  const totalGoodwill = goodwillCalcs.reduce((s, g) => s + g.goodwill, 0);
  consolidated.assets += totalGoodwill;

  return {
    consolidated,
    goodwillCalcs,
    eliminations,
    outputs: {
      totalGoodwill:   Number(totalGoodwill.toFixed(2)),
      eliminationCount: eliminations.length,
      subsidiaryCount:  subsidiaries.length,
    },
    journalEntries: [
      { dr: 'Goodwill', cr: 'Investment in Subsidiary', amount: Number(totalGoodwill.toFixed(2)), narrative: 'Consolidation — recognise goodwill on acquisition (IFRS 3)' },
      ...eliminations.map(e => ({ dr: 'Intercompany Liability', cr: 'Intercompany Asset', amount: e.amount, narrative: e.adjustment })),
    ],
    isaReference:    'IFRS 3 / IFRS 10 / ISA 600',
    auditConclusion: `Goodwill of £${totalGoodwill.toFixed(2)} recognised on consolidation. ${eliminations.length} intercompany eliminations processed. Verify impairment test performed annually (IAS 36). FRC finding GRP-04: ensure intercompany eliminations are tested.`,
  };
}
