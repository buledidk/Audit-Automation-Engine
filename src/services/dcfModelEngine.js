// ═══════════════════════════════════════════════════════════════════
// DCF MODEL ENGINE — Multiple Discounted Cash Flow Models
// Covers: Going Concern, Impairment (IAS 36), ECL (IFRS 9),
//         Lease Liability (IFRS 16), Fair Value (IFRS 13)
// All models produce audit-ready documentation with sensitivity analysis
// ═══════════════════════════════════════════════════════════════════

import { getSupabaseClient } from '../lib/supabaseClient.js';

// ── CAPM / MARKET REFERENCE DATA ────────────────────────────────────────
// Updated periodically — reference sources in comments
const MARKET_REFERENCE_DATA = {
  // UK 10-year gilt yield (approx March 2026)
  // Source: https://www.bankofengland.co.uk/statistics/yield-curves
  riskFreeRate: 0.040, // 4.0%

  // UK Equity Risk Premium (Duff & Phelps / Kroll Cost of Capital Navigator 2025)
  // Source: Kroll Cost of Capital Navigator — Annual Publication
  equityRiskPremium: 0.055, // 5.5%

  // Bank of England Base Rate (March 2026)
  // Source: https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp
  boeBaseRate: 0.0475, // 4.75%

  // Industry betas (unlevered, from Damodaran January 2026)
  // Source: https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html
  industryBetas: {
    manufacturing: 0.92,
    retail: 0.88,
    construction: 1.05,
    professional_services: 0.78,
    technology: 1.38,
    financial_services: 0.72,
    hospitality: 1.12,
    healthcare: 0.65,
    charity: 0.45,
    other: 0.90
  },

  // UK long-term sustainable growth rate
  sustainableGrowthRate: 0.020, // 2.0% (UK GDP trend growth)

  // UK Corporation Tax Rate (2026)
  corporateTaxRate: 0.25, // 25%

  // Reference dates (for audit evidence documentation)
  referenceDate: '2026-03-30',
  giltSourceUrl: 'https://www.bankofengland.co.uk/statistics/yield-curves',
  boeRateUrl: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
  damodaranUrl: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html',
  krollUrl: 'https://www.kroll.com/en/cost-of-capital',
};

// IFRS 9 ECL default PD rates by aging bucket (UK SME averages)
const ECL_DEFAULT_PD_RATES = {
  current_0_30: 0.005,    // 0.5%
  days_31_60: 0.020,      // 2.0%
  days_61_90: 0.080,      // 8.0%
  days_91_120: 0.200,     // 20.0%
  days_121_180: 0.450,    // 45.0%
  days_over_180: 0.800,   // 80.0%
  disputed: 0.950,        // 95.0%
  insolvent: 1.000,       // 100%
};

const ECL_DEFAULT_LGD = 0.45; // 45% Loss Given Default (UK average unsecured)

export class DCFModelEngine {
  constructor(options = {}) {
    this.supabase = getSupabaseClient();
    this.marketData = { ...MARKET_REFERENCE_DATA, ...options.marketDataOverrides };
    this.corpTaxRate = options.corporateTaxRate || this.marketData.corporateTaxRate;
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODEL 1: GOING CONCERN DCF (ISA 570)
  // Free Cash Flow to Firm (FCFF) with terminal value
  // ══════════════════════════════════════════════════════════════════════
  /**
   * @param {Object} params
   * @param {Object} params.historicalFinancials - Last 3 years: { year: { revenue, ebit, depreciation, capex, workingCapitalChange } }
   * @param {Object} params.forecasts - Management's 3-5 year projections
   * @param {string} params.industry - Entity industry
   * @param {Object} params.capitalStructure - { totalDebt, equity, debtCost }
   * @param {Object} params.entity - { name, entitySize, registrationNumber }
   */
  goingConcernDCF(params) {
    const { historicalFinancials, forecasts, industry, capitalStructure, entity } = params;

    // ── Step 1: Calculate WACC ──
    const wacc = this.calculateWACC({ industry, capitalStructure });

    // ── Step 2: Build FCF projections (use management forecasts + auditor adjustments) ──
    const projectionYears = Object.keys(forecasts || {}).length || 5;
    const years = Array.from({ length: projectionYears }, (_, i) => i + 1);

    // If no explicit forecasts, extrapolate from historicals
    const historicalYears = Object.values(historicalFinancials || {});
    const avgRevGrowth = historicalYears.length >= 2
      ? historicalYears.reduce((acc, yr, i, arr) => {
          if (i === 0) return acc;
          return acc + (yr.revenue - arr[i-1].revenue) / arr[i-1].revenue;
        }, 0) / (historicalYears.length - 1)
      : 0.03;

    const lastYear = historicalYears[historicalYears.length - 1] || {};
    const projectedFCFs = years.map(yr => {
      const forecast = forecasts?.[yr] || {};
      const revenue = forecast.revenue || (lastYear.revenue || 1000000) * Math.pow(1 + avgRevGrowth, yr);
      const ebit = forecast.ebit || revenue * (lastYear.ebit / (lastYear.revenue || 1) || 0.08);
      const nopat = ebit * (1 - this.corpTaxRate);
      const depreciation = forecast.depreciation || lastYear.depreciation || revenue * 0.03;
      const capex = forecast.capex || lastYear.capex || depreciation * 1.1;
      const wcChange = forecast.workingCapitalChange || 0;
      const fcff = nopat + depreciation - capex - wcChange;

      return {
        year: yr,
        revenue: Math.round(revenue),
        ebit: Math.round(ebit),
        nopat: Math.round(nopat),
        depreciation: Math.round(depreciation),
        capex: Math.round(capex),
        workingCapitalChange: Math.round(wcChange),
        fcff: Math.round(fcff),
        discountFactor: Math.pow(1 + wacc.wacc, -yr),
        presentValue: Math.round(fcff * Math.pow(1 + wacc.wacc, -yr))
      };
    });

    // ── Step 3: Terminal Value (Gordon Growth Model) ──
    const g = this.marketData.sustainableGrowthRate;
    const terminalFCF = projectedFCFs[projectedFCFs.length - 1].fcff * (1 + g);
    const terminalValue = terminalFCF / (wacc.wacc - g);
    const pvTerminalValue = terminalValue * Math.pow(1 + wacc.wacc, -projectionYears);

    // ── Step 4: Enterprise Value ──
    const pvFCFs = projectedFCFs.reduce((sum, yr) => sum + yr.presentValue, 0);
    const enterpriseValue = pvFCFs + pvTerminalValue;
    const equityValue = enterpriseValue - (capitalStructure?.totalDebt || 0);

    // ── Step 5: Sensitivity Analysis ──
    const sensitivityMatrix = this._buildSensitivityMatrix(
      projectedFCFs, projectionYears, capitalStructure?.totalDebt || 0,
      wacc.wacc, g
    );

    // ── Step 6: Stress Tests ──
    const stressTests = this._runGoingConcernStressTests(
      historicalFinancials, projectedFCFs, wacc.wacc, g, capitalStructure
    );

    // ── Step 7: Going Concern Conclusion ──
    const conclusion = this._goingConcernConclusion(equityValue, stressTests, projectedFCFs);

    return {
      modelType: 'going_concern',
      entity,
      wacc,
      projections: projectedFCFs,
      terminalValue: Math.round(terminalValue),
      pvTerminalValue: Math.round(pvTerminalValue),
      pvFCFs: Math.round(pvFCFs),
      enterpriseValue: Math.round(enterpriseValue),
      equityValue: Math.round(equityValue),
      sensitivityMatrix,
      stressTests,
      conclusion,
      marketDataReferences: {
        riskFreeRate: { value: this.marketData.riskFreeRate, source: this.marketData.giltSourceUrl, date: this.marketData.referenceDate },
        equityRiskPremium: { value: this.marketData.equityRiskPremium, source: this.marketData.krollUrl, date: this.marketData.referenceDate },
        beta: { value: wacc.beta, source: this.marketData.damodaranUrl, date: this.marketData.referenceDate },
        boeBaseRate: { value: this.marketData.boeBaseRate, source: this.marketData.boeRateUrl, date: this.marketData.referenceDate }
      },
      isaReference: 'ISA 570 para 16-17',
      documentation: this._generateGoingConcernDocumentation({ entity, wacc, projectedFCFs, enterpriseValue, equityValue, conclusion, stressTests })
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODEL 2: IMPAIRMENT DCF — Value in Use (IAS 36)
  // ══════════════════════════════════════════════════════════════════════
  /**
   * @param {Object} params
   * @param {string} params.cguName - Cash Generating Unit name
   * @param {number} params.carryingAmount - Carrying amount of CGU
   * @param {Object} params.cashFlowForecasts - { year1..5: { cashFlow } }
   * @param {string} params.industry - For discount rate
   * @param {Object} params.capitalStructure - For WACC
   */
  impairmentVIU(params) {
    const { cguName, carryingAmount, cashFlowForecasts, industry, capitalStructure, managementAssumptions } = params;

    // IAS 36 requires PRE-TAX discount rate
    const wacc = this.calculateWACC({ industry, capitalStructure });
    const preTaxDiscountRate = wacc.wacc / (1 - this.corpTaxRate); // Gross-up to pre-tax

    const g = this.marketData.sustainableGrowthRate;
    const years = Object.keys(cashFlowForecasts || {}).map(Number).sort();

    // Discount forecast cash flows
    const discountedCFs = years.map(yr => {
      const cf = cashFlowForecasts[yr]?.cashFlow || 0;
      const df = Math.pow(1 + preTaxDiscountRate, -yr);
      return { year: yr, cashFlow: cf, discountFactor: Math.round(df * 10000) / 10000, presentValue: Math.round(cf * df) };
    });

    // Terminal value
    const lastCF = cashFlowForecasts[years[years.length - 1]]?.cashFlow || 0;
    const terminalValue = (lastCF * (1 + g)) / (preTaxDiscountRate - g);
    const pvTerminalValue = terminalValue * Math.pow(1 + preTaxDiscountRate, -years[years.length - 1]);

    // Value in Use
    const viu = discountedCFs.reduce((sum, yr) => sum + yr.presentValue, 0) + pvTerminalValue;

    // Headroom
    const headroom = viu - carryingAmount;
    const headroomPercentage = (headroom / carryingAmount * 100).toFixed(1);
    const impairmentRequired = headroom < 0;
    const impairmentAmount = impairmentRequired ? Math.abs(headroom) : 0;

    // Sensitivity: discount rate sensitivity
    const drSensitivity = [-0.010, -0.005, 0, 0.005, 0.010, 0.020].map(drDelta => {
      const adjRate = preTaxDiscountRate + drDelta;
      const adjPVs = years.reduce((sum, yr) => sum + (cashFlowForecasts[yr]?.cashFlow || 0) * Math.pow(1 + adjRate, -yr), 0);
      const adjTV = ((lastCF * (1 + g)) / (adjRate - g)) * Math.pow(1 + adjRate, -years[years.length - 1]);
      return {
        rateChange: (drDelta * 100).toFixed(1) + '%',
        adjustedRate: (adjRate * 100).toFixed(1) + '%',
        adjustedVIU: Math.round(adjPVs + adjTV),
        headroom: Math.round(adjPVs + adjTV - carryingAmount),
        impaired: (adjPVs + adjTV) < carryingAmount
      };
    });

    // Growth rate sensitivity
    const grSensitivity = [-0.010, -0.005, 0, 0.005, 0.010].map(grDelta => {
      const adjG = Math.max(0, g + grDelta);
      const adjTV = ((lastCF * (1 + adjG)) / (preTaxDiscountRate - adjG)) * Math.pow(1 + preTaxDiscountRate, -years[years.length - 1]);
      const adjVIU = discountedCFs.reduce((sum, yr) => sum + yr.presentValue, 0) + adjTV;
      return {
        growthChange: (grDelta * 100).toFixed(1) + '%',
        adjustedGrowth: (adjG * 100).toFixed(1) + '%',
        adjustedVIU: Math.round(adjVIU),
        headroom: Math.round(adjVIU - carryingAmount),
        impaired: adjVIU < carryingAmount
      };
    });

    // Identify breakeven discount rate
    let breakevenRate = null;
    for (let r = preTaxDiscountRate; r < preTaxDiscountRate + 0.15; r += 0.001) {
      const adjPVs = years.reduce((sum, yr) => sum + (cashFlowForecasts[yr]?.cashFlow || 0) * Math.pow(1 + r, -yr), 0);
      const adjTV = ((lastCF * (1 + g)) / (r - g)) * Math.pow(1 + r, -years[years.length - 1]);
      if (adjPVs + adjTV < carryingAmount) { breakevenRate = r; break; }
    }

    return {
      modelType: 'impairment_viu',
      cguName,
      carryingAmount,
      preTaxDiscountRate: Math.round(preTaxDiscountRate * 10000) / 10000,
      waccBeforeTax: wacc.wacc,
      discountedCashFlows: discountedCFs,
      terminalValue: Math.round(terminalValue),
      pvTerminalValue: Math.round(pvTerminalValue),
      valueInUse: Math.round(viu),
      headroom: Math.round(headroom),
      headroomPercentage: headroomPercentage + '%',
      impairmentRequired,
      impairmentAmount: Math.round(impairmentAmount),
      sensitivityAnalysis: { discountRate: drSensitivity, growthRate: grSensitivity },
      breakevenDiscountRate: breakevenRate ? (breakevenRate * 100).toFixed(1) + '%' : 'Not reached',
      estimationUncertainty: Math.abs(parseFloat(headroomPercentage)) < 20 ? 'HIGH' : Math.abs(parseFloat(headroomPercentage)) < 50 ? 'MEDIUM' : 'LOW',
      managementAssumptions,
      isaReference: 'IAS 36 para 30-57',
      documentation: this._generateImpairmentDocumentation({ cguName, carryingAmount, viu, headroom, impairmentRequired, drSensitivity, preTaxDiscountRate })
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODEL 3: EXPECTED CREDIT LOSS (IFRS 9)
  // ══════════════════════════════════════════════════════════════════════
  /**
   * @param {Object[]} debtorAgingSchedule - [{ bucket, outstandingBalance, pdOverride, lgdOverride }]
   * @param {Object} macroAdjustments - { sectorStress: 0.10, economicDownturn: 0.05 }
   * @param {string} approach - 'simplified' (trade debtors) or 'general' (3-stage)
   */
  calculateECL(debtorAgingSchedule, macroAdjustments = {}, approach = 'simplified') {
    const sectorStressAdj = macroAdjustments.sectorStress || 0;
    const economicDownturnAdj = macroAdjustments.economicDownturn || 0;
    const totalMacroAdj = sectorStressAdj + economicDownturnAdj;

    const eclByBucket = debtorAgingSchedule.map(bucket => {
      const pd = (bucket.pdOverride !== undefined ? bucket.pdOverride : ECL_DEFAULT_PD_RATES[bucket.bucket] || 0.5) + totalMacroAdj;
      const lgd = bucket.lgdOverride !== undefined ? bucket.lgdOverride : ECL_DEFAULT_LGD;
      const ead = bucket.outstandingBalance || 0;
      const ecl = pd * lgd * ead;
      return {
        bucket: bucket.bucket,
        label: this._getBucketLabel(bucket.bucket),
        outstandingBalance: ead,
        basePD: ECL_DEFAULT_PD_RATES[bucket.bucket] || pd,
        macroAdjustment: totalMacroAdj,
        adjustedPD: Math.min(1.0, pd),
        lgd,
        ead,
        ecl: Math.round(ecl),
        eclRate: (pd * lgd * 100).toFixed(2) + '%',
        stage: this._getIFRS9Stage(bucket.bucket)
      };
    });

    const totalEAD = eclByBucket.reduce((sum, b) => sum + b.ead, 0);
    const totalECL = eclByBucket.reduce((sum, b) => sum + b.ecl, 0);
    const effectiveRate = totalEAD > 0 ? (totalECL / totalEAD * 100).toFixed(2) + '%' : '0%';

    return {
      modelType: 'ecl',
      approach,
      macroAdjustments: { sectorStress: sectorStressAdj, economicDownturn: economicDownturnAdj, total: totalMacroAdj },
      eclByBucket,
      totalEAD: Math.round(totalEAD),
      totalECL: Math.round(totalECL),
      effectiveRate,
      stageBreakdown: {
        stage1: eclByBucket.filter(b => b.stage === 1).reduce((s, b) => ({ ead: s.ead + b.ead, ecl: s.ecl + b.ecl }), { ead: 0, ecl: 0 }),
        stage2: eclByBucket.filter(b => b.stage === 2).reduce((s, b) => ({ ead: s.ead + b.ead, ecl: s.ecl + b.ecl }), { ead: 0, ecl: 0 }),
        stage3: eclByBucket.filter(b => b.stage === 3).reduce((s, b) => ({ ead: s.ead + b.ead, ecl: s.ecl + b.ecl }), { ead: 0, ecl: 0 }),
      },
      defaultPDRates: ECL_DEFAULT_PD_RATES,
      defaultLGD: ECL_DEFAULT_LGD,
      ifrsReference: 'IFRS 9 para 5.5',
      documentation: this._generateECLDocumentation({ eclByBucket, totalEAD, totalECL, macroAdjustments })
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODEL 4: LEASE LIABILITY DCF (IFRS 16)
  // ══════════════════════════════════════════════════════════════════════
  calculateLeaseLiability(params) {
    const { leasePayments, discountRate, _commencementDate, _leaseTerm, incrementalBorrowingRate } = params;
    const ibr = incrementalBorrowingRate || discountRate || this.marketData.boeBaseRate + 0.015;

    // Build payment schedule
    const schedule = leasePayments.map((payment, index) => {
      const periodEnd = index + 1;
      const presentValue = payment / Math.pow(1 + ibr, periodEnd);
      return { period: periodEnd, payment: Math.round(payment), discountFactor: Math.round(Math.pow(1/(1+ibr), periodEnd) * 10000)/10000, presentValue: Math.round(presentValue) };
    });

    const leaseLiability = schedule.reduce((sum, p) => sum + p.presentValue, 0);

    // Amortisation schedule
    let openingBalance = leaseLiability;
    const amortisationSchedule = schedule.map(period => {
      const interestCharge = Math.round(openingBalance * ibr);
      const repayment = period.payment;
      const closingBalance = Math.round(openingBalance + interestCharge - repayment);
      const row = { period: period.period, openingBalance: Math.round(openingBalance), interestCharge, repayment, closingBalance };
      openingBalance = closingBalance;
      return row;
    });

    return {
      modelType: 'lease',
      leaseLiability: Math.round(leaseLiability),
      incrementalBorrowingRate: ibr,
      paymentSchedule: schedule,
      amortisationSchedule,
      rouAsset: Math.round(leaseLiability), // Initial ROU = lease liability (simplified)
      currentPortion: amortisationSchedule[0]?.repayment || 0,
      nonCurrentPortion: Math.round(leaseLiability - (amortisationSchedule[0]?.repayment || 0)),
      firstYearInterest: amortisationSchedule[0]?.interestCharge || 0,
      ibrsource: `Incremental borrowing rate of ${(ibr*100).toFixed(2)}% based on entity\'s marginal cost of borrowing at lease commencement`,
      ifrsReference: 'IFRS 16 para 26-28',
      documentation: this._generateLeaseDocumentation({ leaseLiability, ibr, schedule, amortisationSchedule })
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODEL 5: FAIR VALUE (IFRS 13)
  // ══════════════════════════════════════════════════════════════════════
  classifyFairValue(instrument) {
    const { marketPrice, comparableTransactions, entitySpecificInputs, name, type } = instrument;

    let level, inputs, dcfValue = null;

    if (marketPrice && marketPrice.source === 'active_market') {
      level = 1;
      inputs = `Quoted price from active market: £${marketPrice.value?.toLocaleString()} per ${marketPrice.unit}. Source: ${marketPrice.source}.`;
    } else if (comparableTransactions && comparableTransactions.length >= 2) {
      level = 2;
      inputs = `Observable market data from ${comparableTransactions.length} comparable transactions. Average: £${Math.round(comparableTransactions.reduce((s,t) => s + t.price, 0) / comparableTransactions.length).toLocaleString()}`;
    } else {
      level = 3;
      // Level 3: DCF with entity-specific assumptions
      if (entitySpecificInputs?.cashFlows && entitySpecificInputs?.discountRate) {
        const pvs = entitySpecificInputs.cashFlows.map((cf, i) => cf / Math.pow(1 + entitySpecificInputs.discountRate, i + 1));
        dcfValue = Math.round(pvs.reduce((s, v) => s + v, 0));
      }
      inputs = `Unobservable inputs — Level 3 measurement. ${entitySpecificInputs ? `Key assumptions: discount rate ${((entitySpecificInputs.discountRate || 0)*100).toFixed(1)}%, growth rate ${((entitySpecificInputs.growthRate || 0)*100).toFixed(1)}%` : ''}`;
    }

    return {
      modelType: 'fair_value',
      instrument: name,
      type,
      level,
      levelLabel: `Level ${level}: ${level === 1 ? 'Quoted prices' : level === 2 ? 'Observable inputs' : 'Unobservable inputs'}`,
      inputs,
      fairValue: level === 1 ? marketPrice?.value : level === 2 ? Math.round(comparableTransactions.reduce((s,t) => s + t.price, 0) / comparableTransactions.length) : dcfValue,
      estimationUncertainty: level === 3 ? 'HIGH' : level === 2 ? 'MEDIUM' : 'LOW',
      auditingChallenges: level === 3 ? 'ISA 540 heightened procedures required — significant estimation uncertainty' : level === 2 ? 'Verify observable inputs are from active, liquid markets' : 'Verify quoted price from authoritative source',
      ifrsReference: 'IFRS 13 para 72-90',
      disclosureRequired: level >= 2,
      level3SensitivityRequired: level === 3
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // WACC CALCULATOR
  // ══════════════════════════════════════════════════════════════════════
  calculateWACC({ industry, capitalStructure }) {
    const { totalDebt = 0, equity = 1, debtCost } = capitalStructure || {};
    const totalCapital = totalDebt + equity;
    const debtWeight = totalCapital > 0 ? totalDebt / totalCapital : 0;
    const equityWeight = totalCapital > 0 ? equity / totalCapital : 1;

    const unleveredBeta = this.marketData.industryBetas[industry] || this.marketData.industryBetas.other;
    // Levered beta using Hamada equation: βL = βU × (1 + (1-t) × D/E)
    const debtToEquity = equity > 0 ? totalDebt / equity : 0;
    const leveredBeta = unleveredBeta * (1 + (1 - this.corpTaxRate) * debtToEquity);

    // CAPM: Ke = Rf + β × ERP
    const costOfEquity = this.marketData.riskFreeRate + leveredBeta * this.marketData.equityRiskPremium;

    // Cost of debt (effective rate from financials or estimate)
    const costOfDebt = debtCost || (this.marketData.boeBaseRate + 0.025); // BOE + 250bps typical

    // After-tax cost of debt
    const afterTaxCostOfDebt = costOfDebt * (1 - this.corpTaxRate);

    // WACC
    const wacc = equityWeight * costOfEquity + debtWeight * afterTaxCostOfDebt;

    return {
      riskFreeRate: this.marketData.riskFreeRate,
      equityRiskPremium: this.marketData.equityRiskPremium,
      unleveredBeta,
      leveredBeta: Math.round(leveredBeta * 1000) / 1000,
      costOfEquity: Math.round(costOfEquity * 10000) / 10000,
      costOfDebt: Math.round(costOfDebt * 10000) / 10000,
      afterTaxCostOfDebt: Math.round(afterTaxCostOfDebt * 10000) / 10000,
      debtWeight: Math.round(debtWeight * 10000) / 10000,
      equityWeight: Math.round(equityWeight * 10000) / 10000,
      wacc: Math.round(wacc * 10000) / 10000,
      waccPercentage: (wacc * 100).toFixed(2) + '%',
      sources: {
        riskFreeRate: { value: this.marketData.riskFreeRate, source: this.marketData.giltSourceUrl },
        erp: { value: this.marketData.equityRiskPremium, source: this.marketData.krollUrl },
        beta: { value: unleveredBeta, source: this.marketData.damodaranUrl }
      }
    };
  }

  // ── HELPERS ──────────────────────────────────────────────────────────
  _buildSensitivityMatrix(projectedFCFs, years, totalDebt, wacc, g) {
    const waccRange = [-0.01, -0.005, 0, 0.005, 0.01];
    const gRange = [-0.005, 0, 0.005, 0.010];

    return {
      waccRange: waccRange.map(dw => (wacc + dw) * 100 + '%'),
      growthRange: gRange.map(dg => (g + dg) * 100 + '%'),
      values: waccRange.map(dw => {
        const adjWACC = wacc + dw;
        return gRange.map(dg => {
          const adjG = Math.max(0.005, g + dg);
          if (adjWACC <= adjG) return 'N/A';
          const pvFCFs = projectedFCFs.reduce((sum, yr) => sum + yr.fcff * Math.pow(1 + adjWACC, -yr.year), 0);
          const lastFCF = projectedFCFs[projectedFCFs.length - 1]?.fcff || 0;
          const tv = (lastFCF * (1 + adjG)) / (adjWACC - adjG);
          const pvTV = tv * Math.pow(1 + adjWACC, -years);
          const ev = pvFCFs + pvTV;
          return Math.round((ev - totalDebt) / 1000) + 'k';
        });
      })
    };
  }

  _runGoingConcernStressTests(historicals, projectedFCFs, wacc, g, capitalStructure) {
    const totalDebt = capitalStructure?.totalDebt || 0;
    const tests = [
      { name: 'Base Case', revenueShock: 0, description: 'Management\'s projections as presented' },
      { name: '10% Revenue Decline', revenueShock: 0.10, description: 'Moderate stress scenario — 10% revenue reduction' },
      { name: '25% Revenue Decline', revenueShock: 0.25, description: 'Severe stress scenario — 25% revenue reduction (COVID-equivalent shock)' },
    ];

    return tests.map(test => {
      const stressedFCFs = projectedFCFs.map(yr => ({
        ...yr,
        fcff: yr.fcff * (1 - test.revenueShock),
        presentValue: yr.presentValue * (1 - test.revenueShock)
      }));
      const pvFCFs = stressedFCFs.reduce((sum, yr) => sum + yr.presentValue, 0);
      const lastFCF = stressedFCFs[stressedFCFs.length - 1]?.fcff || 0;
      const tv = (lastFCF * (1 + g)) / (wacc - g);
      const pvTV = tv * Math.pow(1 + wacc, -stressedFCFs.length);
      const ev = pvFCFs + pvTV;
      const equity = ev - totalDebt;

      return {
        scenario: test.name,
        description: test.description,
        revenueShock: test.revenueShock,
        enterpriseValue: Math.round(ev),
        equityValue: Math.round(equity),
        goingConcernViable: equity > 0,
        ragStatus: equity > 0 ? 'GREEN' : equity > -totalDebt * 0.2 ? 'AMBER' : 'RED'
      };
    });
  }

  _goingConcernConclusion(equityValue, stressTests, _projectedFCFs) {
    const allPositive = stressTests.every(t => t.goingConcernViable);
    const basePositive = stressTests[0]?.equityValue > 0;
    const severeStressPositive = stressTests[stressTests.length - 1]?.goingConcernViable;

    if (allPositive) {
      return { conclusion: 'no_material_uncertainty', ragStatus: 'GREEN', narrative: 'DCF analysis supports the going concern basis. Under base case and all stress scenarios, enterprise value exceeds total debt. No material uncertainty identified from this analysis.' };
    } else if (basePositive && !severeStressPositive) {
      return { conclusion: 'material_uncertainty_disclosed', ragStatus: 'AMBER', narrative: 'DCF analysis indicates the going concern basis is supportable under base case conditions. However, under severe stress scenarios (25% revenue decline), equity value turns negative. A material uncertainty paragraph may be required if management cannot demonstrate adequate mitigating actions.' };
    } else {
      return { conclusion: 'material_uncertainty_not_disclosed', ragStatus: 'RED', narrative: 'DCF analysis raises significant concern about the going concern basis. Equity value is negative even under base case projections. Discuss with management and consider whether going concern basis is appropriate. Refer to ISA 570 para 22-24.' };
    }
  }

  _getBucketLabel(bucket) {
    const labels = {
      current_0_30: 'Current (0-30 days)', days_31_60: '31-60 days', days_61_90: '61-90 days',
      days_91_120: '91-120 days', days_121_180: '121-180 days', days_over_180: 'Over 180 days',
      disputed: 'Disputed', insolvent: 'Insolvent/Impaired'
    };
    return labels[bucket] || bucket;
  }

  _getIFRS9Stage(bucket) {
    if (['current_0_30', 'days_31_60'].includes(bucket)) return 1;
    if (['days_61_90', 'days_91_120', 'days_121_180'].includes(bucket)) return 2;
    return 3;
  }

  _generateGoingConcernDocumentation({ entity, wacc, _projectedFCFs, enterpriseValue, equityValue, conclusion, stressTests }) {
    return `GOING CONCERN DCF ANALYSIS — ISA 570
Entity: ${entity?.name || 'N/A'} | Date: ${new Date().toLocaleDateString('en-GB')}

OBJECTIVE: In accordance with ISA 570 para 16-17, we have performed an independent DCF analysis to assess the appropriateness of the going concern basis of accounting.

WACC: ${wacc.waccPercentage} (Ke=${(wacc.costOfEquity*100).toFixed(2)}%, β=${wacc.leveredBeta}, Rf=${(wacc.riskFreeRate*100).toFixed(1)}%, ERP=${(wacc.equityRiskPremium*100).toFixed(1)}%)
Data sources: Risk-free rate from Bank of England yield curves; ERP from Kroll Cost of Capital Navigator 2025; Beta from Damodaran (January 2026)

Enterprise Value: £${enterpriseValue.toLocaleString()}
Equity Value: £${equityValue.toLocaleString()}

STRESS TEST RESULTS:
${stressTests.map(t => `- ${t.scenario}: Equity Value £${t.equityValue.toLocaleString()} [${t.ragStatus}]`).join('\n')}

CONCLUSION: ${conclusion.narrative}
ISA Reference: ISA 570 para 16-17`;
  }

  _generateImpairmentDocumentation({ cguName, carryingAmount, viu, headroom, impairmentRequired, _drSensitivity, preTaxDiscountRate }) {
    return `IMPAIRMENT TEST — IAS 36 VALUE IN USE
CGU: ${cguName} | Date: ${new Date().toLocaleDateString('en-GB')}
Pre-tax Discount Rate: ${(preTaxDiscountRate*100).toFixed(2)}%
Carrying Amount: £${carryingAmount.toLocaleString()}
Value in Use: £${viu.toLocaleString()}
Headroom: £${headroom.toLocaleString()} (${headroom >= 0 ? 'No impairment required' : 'IMPAIRMENT REQUIRED: £' + Math.abs(headroom).toLocaleString()})
Estimation Uncertainty: ${Math.abs(headroom/carryingAmount) < 0.20 ? 'HIGH — headroom < 20%' : 'MODERATE'}
${impairmentRequired ? 'ACTION: Recognise impairment loss of £' + Math.abs(headroom).toLocaleString() + ' per IAS 36 para 59.' : 'No impairment charge required.'}`;
  }

  _generateECLDocumentation({ eclByBucket, totalEAD, totalECL, macroAdjustments }) {
    return `ECL PROVISION CALCULATION — IFRS 9
Date: ${new Date().toLocaleDateString('en-GB')}
Total Debtors (EAD): £${totalEAD.toLocaleString()}
Total ECL Provision: £${totalECL.toLocaleString()} (${(totalECL/totalEAD*100).toFixed(2)}% of debtors)
Macro Adjustments Applied: Sector stress ${(macroAdjustments.sectorStress*100||0).toFixed(1)}% + Economic downturn ${(macroAdjustments.economicDownturn*100||0).toFixed(1)}%
Methodology: IFRS 9 simplified approach using provision matrix
${eclByBucket.map(b => `- ${b.label}: Balance £${b.outstandingBalance.toLocaleString()} | PD ${(b.adjustedPD*100).toFixed(1)}% | LGD ${(b.lgd*100).toFixed(0)}% | ECL £${b.ecl.toLocaleString()}`).join('\n')}`;
  }

  _generateLeaseDocumentation({ leaseLiability, ibr, _schedule, amortisationSchedule }) {
    return `LEASE LIABILITY CALCULATION — IFRS 16
Date: ${new Date().toLocaleDateString('en-GB')}
Incremental Borrowing Rate: ${(ibr*100).toFixed(2)}%
Lease Liability at Commencement: £${leaseLiability.toLocaleString()}
Year 1 Interest Charge: £${amortisationSchedule[0]?.interestCharge.toLocaleString() || 0}
Year 1 Capital Repayment: £${amortisationSchedule[0]?.repayment.toLocaleString() || 0}
Closing Balance Year 1: £${amortisationSchedule[0]?.closingBalance.toLocaleString() || 0}`;
  }

  // ── SAVE TO SUPABASE ──────────────────────────────────────────────────
  async saveModel(modelResults, engagementId, userId) {
    if (!this.supabase) return modelResults;
    try {
      const { data, error } = await this.supabase
        .from('dcf_models')
        .insert({
          engagement_id: engagementId,
          model_type: modelResults.modelType,
          assumptions: modelResults,
          results: { value: modelResults.equityValue || modelResults.valueInUse || modelResults.leaseLiability || modelResults.totalECL },
          sensitivity_matrix: modelResults.sensitivityAnalysis || modelResults.sensitivityMatrix || {},
          wacc: modelResults.wacc?.wacc,
          terminal_growth_rate: this.marketData.sustainableGrowthRate,
          conclusion: modelResults.conclusion?.narrative || modelResults.documentation?.slice(0, 500),
          prepared_by: userId
        }).select().single();
      if (!error) modelResults.savedId = data.id;
    } catch (e) {
      console.warn('DCF: could not save to Supabase', e.message);
    }
    return modelResults;
  }
}

export const dcfModelEngine = new DCFModelEngine();
export { MARKET_REFERENCE_DATA, ECL_DEFAULT_PD_RATES };
export default DCFModelEngine;
