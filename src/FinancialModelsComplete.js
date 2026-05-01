// ═══════════════════════════════════════════════════════════════
// FINANCIAL MODELS COMPLETE — Extended Suite
// AuditEngine v10 AURA
// Supplements existing FinancialModels.js with additional calculators
// Research-informed: BDO IAS 36 guide, PKF Littlejohn ECL, ACCA IFRS 16,
// IFRS Foundation guidance, FRC technical articles
// ═══════════════════════════════════════════════════════════════

function round(v, dp) { const f = Math.pow(10, dp); return Math.round(v * f) / f; }

// ─── A) IMPAIRMENT SENSITIVITY MATRIX ───
export function calcImpairmentSensitivity({ cashFlows, baseDiscount, baseGrowth, carryingAmount }) {
  const discountSteps = [-0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02];
  const growthSteps = [-0.01, -0.005, 0, 0.005, 0.01];
  const matrix = [];
  discountSteps.forEach(ds => {
    const row = { discountRate: round((baseDiscount + ds) * 100, 1) };
    growthSteps.forEach(gs => {
      const dr = baseDiscount + ds;
      const gr = baseGrowth + gs;
      if (dr <= gr) { row["g" + round(gr * 100, 1)] = "N/A"; return; }
      const pvCFs = cashFlows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + dr, i + 1), 0);
      const lastCF = cashFlows[cashFlows.length - 1];
      const tv = (lastCF * (1 + gr)) / (dr - gr);
      const pvTV = tv / Math.pow(1 + dr, cashFlows.length);
      const recoverable = round(pvCFs + pvTV, 0);
      row["g" + round(gr * 100, 1)] = recoverable;
    });
    row.headroom = typeof row["g" + round(baseGrowth * 100, 1)] === "number" ? round(row["g" + round(baseGrowth * 100, 1)] - carryingAmount, 0) : "N/A";
    matrix.push(row);
  });
  // Reverse stress test
  let breakEvenDiscount = null;
  for (let r = baseDiscount; r < 0.50; r += 0.001) {
    if (r <= baseGrowth) continue;
    const pvCFs = cashFlows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + r, i + 1), 0);
    const lastCF = cashFlows[cashFlows.length - 1];
    const tv = (lastCF * (1 + baseGrowth)) / (r - baseGrowth);
    const pvTV = tv / Math.pow(1 + r, cashFlows.length);
    if (pvCFs + pvTV <= carryingAmount) { breakEvenDiscount = round(r * 100, 2); break; }
  }
  return { matrix, growthSteps: growthSteps.map(g => round((baseGrowth + g) * 100, 1)), breakEvenDiscount };
}

// ─── B) ECL PROVISION MATRIX (Simplified for Trade Receivables) ───
export function calcECLProvisionMatrix({ agingBuckets, historicalLossRates, forwardLookingAdjustment = 0 }) {
  // agingBuckets: [{label, balance}], historicalLossRates: [rate per bucket]
  const results = agingBuckets.map((bucket, i) => {
    const baseRate = historicalLossRates[i] || 0;
    const adjustedRate = Math.min(1, baseRate * (1 + forwardLookingAdjustment));
    const provision = round(bucket.balance * adjustedRate, 2);
    return { label: bucket.label, balance: bucket.balance, historicalRate: round(baseRate * 100, 2), adjustedRate: round(adjustedRate * 100, 2), provision };
  });
  return { results, totalBalance: round(results.reduce((s, r) => s + r.balance, 0), 2), totalProvision: round(results.reduce((s, r) => s + r.provision, 0), 2), coverageRatio: results.reduce((s, r) => s + r.balance, 0) > 0 ? round(results.reduce((s, r) => s + r.provision, 0) / results.reduce((s, r) => s + r.balance, 0) * 100, 2) : 0 };
}

// ECL Movement Table
export function calcECLMovement({ opening, newOriginations, stageTransfers, derecognitions, writeOffs, modelChanges }) {
  const closing = opening + (newOriginations || 0) + (stageTransfers || 0) - (derecognitions || 0) - (writeOffs || 0) + (modelChanges || 0);
  return { opening: round(opening, 2), newOriginations: round(newOriginations || 0, 2), stageTransfers: round(stageTransfers || 0, 2), derecognitions: round(derecognitions || 0, 2), writeOffs: round(writeOffs || 0, 2), modelChanges: round(modelChanges || 0, 2), closing: round(closing, 2), movement: round(closing - opening, 2) };
}

// ─── C) LEASE CALCULATOR ENHANCED ───
export function calcLeaseEnhanced({ annualPayment, escalationRate = 0, leaseTerm, ibr, directCosts = 0, usefulLife = null }) {
  const depLife = usefulLife && usefulLife < leaseTerm ? usefulLife : leaseTerm;
  const payments = [];
  for (let i = 0; i < leaseTerm; i++) {
    payments.push(annualPayment * Math.pow(1 + escalationRate, i));
  }
  const leaseLiability = payments.reduce((pv, pmt, i) => pv + pmt / Math.pow(1 + ibr, i + 1), 0);
  const rouAsset = leaseLiability + directCosts;
  const annualDep = rouAsset / depLife;
  const schedule = [];
  let liabBal = leaseLiability;
  let rouNBV = rouAsset;
  let totalInterest = 0;
  let totalRent = 0;
  for (let i = 0; i < leaseTerm; i++) {
    const interest = liabBal * ibr;
    const payment = payments[i];
    const closing = liabBal + interest - payment;
    const dep = i < depLife ? annualDep : 0;
    rouNBV = Math.max(0, rouNBV - dep);
    totalInterest += interest;
    totalRent += payment;
    schedule.push({ year: i + 1, payment: round(payment, 2), openingLiab: round(liabBal, 2), interest: round(interest, 2), closingLiab: round(Math.max(0, closing), 2), depreciation: round(dep, 2), rouNBV: round(rouNBV, 2), plImpact: round(interest + dep, 2), oldRentExpense: round(payment, 2), plDifference: round(interest + dep - payment, 2) });
    liabBal = Math.max(0, closing);
  }
  return { rouAsset: round(rouAsset, 2), leaseLiability: round(leaseLiability, 2), annualDepreciation: round(annualDep, 2), totalInterest: round(totalInterest, 2), totalRent: round(totalRent, 2), schedule };
}

// ─── D) BLACK-SCHOLES SBP WITH VESTING ───
export function calcSBPCharge({ fairValuePerOption, numberOfOptions, vestingPeriod, expectedForfeitures = 0, gradedVesting = false }) {
  const adjustedOptions = numberOfOptions * (1 - expectedForfeitures);
  const totalFairValue = fairValuePerOption * adjustedOptions;
  const charges = [];
  if (gradedVesting) {
    // Graded vesting per IFRS 2.IG11 — each tranche treated as separate grant
    const trancheSize = adjustedOptions / vestingPeriod;
    for (let yr = 1; yr <= vestingPeriod; yr++) {
      let charge = 0;
      for (let tranche = yr; tranche <= vestingPeriod; tranche++) {
        charge += (fairValuePerOption * trancheSize) / tranche;
      }
      charges.push({ year: yr, charge: round(charge, 2), cumulative: 0 });
    }
  } else {
    const annualCharge = totalFairValue / vestingPeriod;
    for (let yr = 1; yr <= vestingPeriod; yr++) {
      charges.push({ year: yr, charge: round(annualCharge, 2), cumulative: 0 });
    }
  }
  let cum = 0;
  charges.forEach(c => { cum += c.charge; c.cumulative = round(cum, 2); });
  return { totalFairValue: round(totalFairValue, 2), adjustedOptions: round(adjustedOptions, 0), charges };
}

// ─── E) EIR WITH VARIABLE RATE ───
export function calcEIRAmortisedCost({ nominalAmount, fees = 0, nominalRate, term, repaymentType = "amortising" }) {
  const netAmount = nominalAmount - fees;
  const cashFlows = [];
  if (repaymentType === "bullet") {
    for (let i = 0; i < term - 1; i++) cashFlows.push(nominalAmount * nominalRate);
    cashFlows.push(nominalAmount * (1 + nominalRate));
  } else if (repaymentType === "interest_only") {
    for (let i = 0; i < term - 1; i++) cashFlows.push(nominalAmount * nominalRate);
    cashFlows.push(nominalAmount * (1 + nominalRate));
  } else {
    // Guard against division by zero when nominalRate is 0 (zero-coupon amortising)
    const pmt = nominalRate > 0
      ? nominalAmount * nominalRate / (1 - Math.pow(1 + nominalRate, -term))
      : nominalAmount / term;
    for (let i = 0; i < term; i++) cashFlows.push(pmt);
  }
  // Solve for EIR using bisection (more robust than Newton-Raphson for edge cases)
  let lo = 0.0001, hi = 1.0;
  for (let iter = 0; iter < 200; iter++) {
    const mid = (lo + hi) / 2;
    const pv = cashFlows.reduce((s, cf, i) => s + cf / Math.pow(1 + mid, i + 1), 0);
    if (pv > netAmount) lo = mid; else hi = mid;
    if (Math.abs(pv - netAmount) < 0.001) break;
  }
  const eir = (lo + hi) / 2;
  const schedule = [];
  let balance = netAmount;
  for (let i = 0; i < cashFlows.length; i++) {
    const interest = balance * eir;
    const closing = balance + interest - cashFlows[i];
    schedule.push({ period: i + 1, opening: round(balance, 2), interestAtEIR: round(interest, 2), cashFlow: round(cashFlows[i], 2), closing: round(Math.max(0, closing), 2) });
    balance = Math.max(0, closing);
  }
  return { eir: round(eir * 100, 4), netAmount: round(netAmount, 2), schedule };
}

// ─── F) DERIVATIVES — Interest Rate Swap ───
export function calcIRSwapValuation({ notional, fixedRate, floatingRates, paymentFrequency = "semi-annual", maturityYears, _dayCount = "ACT/365" }) {
  const periodsPerYear = paymentFrequency === "quarterly" ? 4 : paymentFrequency === "annual" ? 1 : 2;
  const totalPeriods = maturityYears * periodsPerYear;
  const fixedPerPeriod = fixedRate / periodsPerYear;
  let fixedLegPV = 0, floatingLegPV = 0;
  // Build cumulative discount factors from per-period forward rates (bootstrap approach)
  const discountFactors = [];
  let cumulativeDF = 1.0;
  for (let i = 0; i < totalPeriods; i++) {
    const floatRate = (floatingRates[Math.min(i, floatingRates.length - 1)] || floatingRates[floatingRates.length - 1]) / periodsPerYear;
    cumulativeDF /= (1 + floatRate);
    discountFactors.push(cumulativeDF);
    fixedLegPV += notional * fixedPerPeriod * cumulativeDF;
    floatingLegPV += notional * floatRate * cumulativeDF;
  }
  // Add notional exchange at maturity (for PV calculation)
  const lastDF = discountFactors[totalPeriods - 1];
  fixedLegPV += notional * lastDF;
  floatingLegPV += notional * lastDF;
  const mtm = round(floatingLegPV - fixedLegPV, 2);
  return { fixedLegPV: round(fixedLegPV, 2), floatingLegPV: round(floatingLegPV, 2), mtm, isAsset: mtm > 0 };
}

// Hedge effectiveness
export function calcHedgeEffectiveness({ hedgingChanges, hedgedChanges }) {
  if (!hedgingChanges.length || hedgingChanges.length !== hedgedChanges.length) return { effective: false };
  // Dollar offset
  const cumHedging = hedgingChanges.reduce((s, v) => s + v, 0);
  const cumHedged = hedgedChanges.reduce((s, v) => s + v, 0);
  const ratio = cumHedged !== 0 ? Math.abs(cumHedging / cumHedged) : 0;
  const effective = ratio >= 0.80 && ratio <= 1.25;
  // Regression
  const n = hedgingChanges.length;
  const sumX = hedgedChanges.reduce((s, v) => s + v, 0);
  const sumY = hedgingChanges.reduce((s, v) => s + v, 0);
  const sumXY = hedgedChanges.reduce((s, v, i) => s + v * hedgingChanges[i], 0);
  const sumX2 = hedgedChanges.reduce((s, v) => s + v * v, 0);
  const sumY2 = hedgingChanges.reduce((s, v) => s + v * v, 0);
  const rNum = n * sumXY - sumX * sumY;
  const rDen = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const rSquared = rDen !== 0 ? round((rNum / rDen) * (rNum / rDen), 4) : 0;
  return { dollarOffsetRatio: round(ratio, 4), effective, rSquared, regressionEffective: rSquared >= 0.80 };
}

// ─── G) BOND VALUATION ───
export function calcBondValuation({ faceValue, couponRate, couponFrequency = 2, yearsToMaturity, marketYield }) {
  const n = yearsToMaturity * couponFrequency;
  const c = faceValue * couponRate / couponFrequency;
  const y = marketYield / couponFrequency;
  let cleanPrice = 0;
  for (let i = 1; i <= n; i++) cleanPrice += c / Math.pow(1 + y, i);
  cleanPrice += faceValue / Math.pow(1 + y, n);
  // Accrued interest: assume mid-period (half of one coupon period elapsed)
  // For production use, replace with actual day-count fraction (e.g., ACT/ACT, 30/360)
  const dayCountFraction = 0.5; // proportion of current coupon period elapsed
  const accruedInterest = c * dayCountFraction;
  const dirtyPrice = cleanPrice + accruedInterest;
  const currentYield = (couponRate * faceValue) / cleanPrice;
  // Duration
  let macDur = 0, modDur = 0;
  for (let i = 1; i <= n; i++) macDur += (i / couponFrequency) * (c / Math.pow(1 + y, i));
  macDur += (n / couponFrequency) * (faceValue / Math.pow(1 + y, n));
  macDur /= cleanPrice;
  modDur = macDur / (1 + y);
  // Convexity
  let convexity = 0;
  for (let i = 1; i <= n; i++) convexity += (i * (i + 1)) * c / Math.pow(1 + y, i + 2);
  convexity += (n * (n + 1)) * faceValue / Math.pow(1 + y, n + 2);
  convexity /= (cleanPrice * couponFrequency * couponFrequency);
  const dv01 = modDur * cleanPrice * 0.0001;
  return { cleanPrice: round(cleanPrice, 2), dirtyPrice: round(dirtyPrice, 2), accruedInterest: round(accruedInterest, 2), currentYield: round(currentYield * 100, 4), ytm: round(marketYield * 100, 4), macaulayDuration: round(macDur, 4), modifiedDuration: round(modDur, 4), convexity: round(convexity, 4), dv01: round(dv01, 4) };
}

// ─── H) INVESTMENT PROPERTY VALUATION ───
export function calcInvestmentPropertyValuation({ passingRent, erv, capRate, targetRate, exitYield, voidAllowance = 0.05, capex = 0, managementFee = 0.03, years = 10 }) {
  // Method 1: Income capitalisation
  const incomeCapValue = erv / capRate;
  // Method 2: DCF
  const cashFlows = [];
  for (let i = 0; i < years; i++) {
    const grossRent = i === 0 ? passingRent : erv; // assumes reversion to ERV after year 1
    const netRent = grossRent * (1 - voidAllowance) * (1 - managementFee) - (i === 0 ? capex : 0);
    cashFlows.push(netRent);
  }
  const pvCFs = cashFlows.reduce((s, cf, i) => s + cf / Math.pow(1 + targetRate, i + 1), 0);
  const terminalValue = (erv * (1 - voidAllowance) * (1 - managementFee)) / exitYield;
  const pvTV = terminalValue / Math.pow(1 + targetRate, years);
  const dcfValue = pvCFs + pvTV;
  return { incomeCapValue: round(incomeCapValue, 0), dcfValue: round(dcfValue, 0), pvCashFlows: round(pvCFs, 0), terminalValue: round(terminalValue, 0), pvTerminal: round(pvTV, 0), cashFlows: cashFlows.map((cf, i) => ({ year: i + 1, cashFlow: round(cf, 2) })) };
}

// ─── I) PENSION IAS 19 / FRS 102 s28 ───
export function calcPensionDBO({ currentServiceCost, pastServiceCost = 0, discountRate, salaryGrowth, pensionIncrease = 0, averageAge, averageSalary, yearsOfService, normalRetirementAge, planAssets = 0, accrualRate = 1 / 60, lifeExpectancy = 85 }) {
  const yearsToRetirement = normalRetirementAge - averageAge;
  const projectedSalary = averageSalary * Math.pow(1 + salaryGrowth, yearsToRetirement);
  const annualPension = projectedSalary * yearsOfService * accrualRate;
  // Retirement duration from life expectancy minus retirement age (actuarial basis)
  const expectedRetirementYears = Math.max(1, lifeExpectancy - normalRetirementAge);
  // Discount rate for pension annuity adjusted for pension increases (real rate)
  const realDiscountRate = pensionIncrease > 0
    ? (1 + discountRate) / (1 + pensionIncrease) - 1
    : discountRate;
  const pvAnnuity = realDiscountRate > 0
    ? (1 - Math.pow(1 + realDiscountRate, -expectedRetirementYears)) / realDiscountRate
    : expectedRetirementYears;
  const dboAtRetirement = annualPension * pvAnnuity;
  const dbo = dboAtRetirement / Math.pow(1 + discountRate, yearsToRetirement);
  const netLiability = dbo - planAssets;
  const interestCost = dbo * discountRate;
  const interestOnAssets = planAssets * discountRate;
  const netInterest = interestCost - interestOnAssets;
  const plCharge = currentServiceCost + pastServiceCost + netInterest;
  return { dbo: round(dbo, 0), planAssets: round(planAssets, 0), netLiability: round(netLiability, 0), currentServiceCost: round(currentServiceCost, 0), interestCost: round(interestCost, 0), interestOnAssets: round(interestOnAssets, 0), netInterest: round(netInterest, 0), plCharge: round(plCharge, 0), projectedSalary: round(projectedSalary, 0), annualPension: round(annualPension, 0) };
}

// ─── J) GOODWILL IMPAIRMENT WITH MULTIPLES ───
export function calcGoodwillImpairment({ carryingAmount, goodwill, ebitda, revenue, comparableMultiples = {}, dcfRecoverable = 0 }) {
  const evEbitda = comparableMultiples.evEbitda || 8;
  const evRevenue = comparableMultiples.evRevenue || 1.5;
  const fvByEbitda = ebitda * evEbitda;
  const fvByRevenue = revenue * evRevenue;
  const fairValue = Math.max(fvByEbitda, fvByRevenue);
  const recoverable = Math.max(fairValue, dcfRecoverable);
  const headroom = recoverable - carryingAmount;
  const impairment = headroom < 0 ? Math.min(Math.abs(headroom), goodwill) : 0;
  const goodwillPostImpairment = goodwill - impairment;
  const headroomPct = carryingAmount > 0 ? round(headroom / carryingAmount * 100, 1) : 0;
  return { recoverable: round(recoverable, 0), carryingAmount: round(carryingAmount, 0), headroom: round(headroom, 0), headroomPct, impairment: round(impairment, 0), goodwillPostImpairment: round(goodwillPostImpairment, 0), fvByEbitda: round(fvByEbitda, 0), fvByRevenue: round(fvByRevenue, 0) };
}

// ─── K) DEFERRED TAX ───
export function calcDeferredTax({ items, mainRate = 0.25, smallRate = 0.19, profits = 300000 }) {
  const effectiveRate = profits <= 50000 ? smallRate : profits >= 250000 ? mainRate : smallRate + (mainRate - smallRate) * (profits - 50000) / 200000;
  const results = items.map(item => {
    // For assets: accounting > tax = taxable temp diff = DTL
    // For liabilities: accounting > tax = deductible temp diff = DTA (reversed sign convention)
    const tempDiff = item.accountingBase - item.taxBase;
    const isLiabilityItem = item.isLiability || item.type === 'liability';
    const effectiveTempDiff = isLiabilityItem ? -tempDiff : tempDiff;
    const dtl = effectiveTempDiff > 0 ? round(effectiveTempDiff * effectiveRate, 2) : 0;
    const dta = effectiveTempDiff < 0 ? round(Math.abs(effectiveTempDiff) * effectiveRate, 2) : 0;
    return { ...item, tempDiff: round(tempDiff, 2), effectiveTempDiff: round(effectiveTempDiff, 2), dtl, dta };
  });
  const totalDTL = round(results.reduce((s, r) => s + r.dtl, 0), 2);
  const totalDTA = round(results.reduce((s, r) => s + r.dta, 0), 2);
  const netDT = round(totalDTL - totalDTA, 2);
  return { results, totalDTL, totalDTA, netDT, effectiveRate: round(effectiveRate * 100, 2), isLiability: netDT > 0 };
}

// ─── L) FOREIGN CURRENCY TRANSLATION ───
export function calcForeignCurrencyTranslation({ bsItems, plItems, closingRate, averageRate, historicalRates = {} }) {
  const translatedBS = bsItems.map(item => {
    const rate = item.isEquity ? (historicalRates[item.name] || closingRate) : closingRate;
    return { ...item, foreignAmount: item.amount, rate, translatedAmount: round(item.amount / rate, 2) };
  });
  const translatedPL = plItems.map(item => ({ ...item, foreignAmount: item.amount, rate: averageRate, translatedAmount: round(item.amount / averageRate, 2) }));
  const bsTotal = translatedBS.reduce((s, i) => s + i.translatedAmount * (i.isAsset ? 1 : -1), 0);
  return { translatedBS, translatedPL, translationReserve: round(bsTotal, 2), closingRate, averageRate };
}

// ─── M) CONSTRUCTION CONTRACTS ───
export function calcConstructionContract({ contractValue, variations = 0, claims = 0, claimsProbability = 0.5, costsToDate, estimatedCostsToComplete, retention = 0 }) {
  const totalValue = contractValue + variations + (claims * claimsProbability);
  const estimatedTotalCost = costsToDate + estimatedCostsToComplete;
  const stageOfCompletion = estimatedTotalCost > 0 ? costsToDate / estimatedTotalCost : 0;
  const cumulativeRevenue = totalValue * stageOfCompletion;
  const cumulativeProfit = (totalValue - estimatedTotalCost) * stageOfCompletion;
  const estimatedProfit = totalValue - estimatedTotalCost;
  const isLossMaking = estimatedProfit < 0;
  const lossProvision = isLossMaking ? Math.abs(estimatedProfit) - Math.abs(cumulativeProfit) : 0;
  const wip = costsToDate + Math.max(0, cumulativeProfit);
  return { totalValue: round(totalValue, 2), estimatedTotalCost: round(estimatedTotalCost, 2), stageOfCompletion: round(stageOfCompletion * 100, 1), cumulativeRevenue: round(cumulativeRevenue, 2), cumulativeProfit: round(cumulativeProfit, 2), estimatedProfit: round(estimatedProfit, 2), isLossMaking, lossProvision: round(Math.max(0, lossProvision), 2), wip: round(wip, 2), retention: round(cumulativeRevenue * retention, 2) };
}

// ─── N) INSURANCE RESERVES (simplified PAA) ───
export function calcInsuranceReserves({ classes }) {
  // classes: [{name, earnedPremium, paidClaims, outstandingClaims, ibnrFactor, expenseRatio}]
  const results = classes.map(c => {
    const incurredClaims = c.paidClaims + c.outstandingClaims;
    const ibnr = round(incurredClaims * (c.ibnrFactor || 0.10), 2);
    const totalReserve = round(c.outstandingClaims + ibnr, 2);
    const lossRatio = c.earnedPremium > 0 ? round((incurredClaims + ibnr) / c.earnedPremium * 100, 1) : 0;
    const combinedRatio = lossRatio + (c.expenseRatio || 30);
    return { name: c.name, earnedPremium: c.earnedPremium, incurredClaims: round(incurredClaims, 2), ibnr, totalReserve, lossRatio, combinedRatio: round(combinedRatio, 1) };
  });
  return { results, totalReserves: round(results.reduce((s, r) => s + r.totalReserve, 0), 2), totalIBNR: round(results.reduce((s, r) => s + r.ibnr, 0), 2) };
}

// ─── O) IFRS 15 FIVE-STEP WORKBOOK ───
export function calcIFRS15FiveStep({ contracts }) {
  return contracts.map(contract => {
    // Step 1: Contract existence
    const step1 = { approved: contract.approved || false, identifiableRights: contract.identifiableRights || false, paymentTerms: contract.paymentTerms || false, commercialSubstance: contract.commercialSubstance || false, collectabilityProbable: contract.collectabilityProbable || false };
    step1.met = Object.values(step1).every(v => v);
    // Step 2: Performance obligations
    const obligations = (contract.obligations || []).map(ob => ({ ...ob, distinct: ob.distinctOnOwn && ob.distinctInContext }));
    // Step 3: Transaction price
    const basePrice = contract.fixedConsideration || 0;
    const variableConsideration = contract.variableConsideration || 0;
    const financingComponent = contract.financingComponent || 0;
    const transactionPrice = basePrice + variableConsideration - financingComponent;
    // Step 4: Allocation — use exact ratio to avoid intermediate rounding
    const totalSSP = obligations.reduce((s, ob) => s + (ob.standaloneSellingPrice || 0), 0);
    obligations.forEach(ob => {
      ob.allocationPercent = totalSSP > 0 ? round(ob.standaloneSellingPrice / totalSSP * 100, 2) : 0;
      // Allocate using exact ratio, not the rounded percentage
      ob.allocatedPrice = totalSSP > 0 ? round(transactionPrice * (ob.standaloneSellingPrice || 0) / totalSSP, 2) : 0;
    });
    // Step 5: Recognition
    obligations.forEach(ob => {
      ob.recognitionPattern = ob.overTime ? "Over time" : "Point in time";
    });
    return { contractName: contract.name, step1, obligations, transactionPrice: round(transactionPrice, 2) };
  });
}

// ─── P) PROVISION UNWINDING ENHANCED ───
export function calcProvisionUnwindingEnhanced({ expectedCashOutflow, expectedTiming, discountRate, probabilityWeighting = 1.0 }) {
  const weightedOutflow = expectedCashOutflow * probabilityWeighting;
  const initialProvision = weightedOutflow / Math.pow(1 + discountRate, expectedTiming);
  const schedule = [];
  let balance = initialProvision;
  for (let yr = 1; yr <= expectedTiming; yr++) {
    const unwinding = balance * discountRate;
    const closing = balance + unwinding;
    schedule.push({ year: yr, opening: round(balance, 2), unwinding: round(unwinding, 2), closing: round(closing, 2) });
    balance = closing;
  }
  // Sensitivity
  const sensitivities = [-0.01, 0, 0.01].map(dr => {
    const rate = discountRate + dr;
    const pv = weightedOutflow / Math.pow(1 + rate, expectedTiming);
    return { rateChange: dr * 100, rate: round(rate * 100, 2), provision: round(pv, 2) };
  });
  const timingSens = [-1, 0, 1].map(dt => {
    const t = Math.max(1, expectedTiming + dt);
    const pv = weightedOutflow / Math.pow(1 + discountRate, t);
    return { timingChange: dt, timing: t, provision: round(pv, 2) };
  });
  return { initialProvision: round(initialProvision, 2), undiscountedAmount: round(weightedOutflow, 2), totalUnwinding: round(weightedOutflow - initialProvision, 2), schedule, rateSensitivity: sensitivities, timingSensitivity: timingSens };
}

// ─── Q) DISTRIBUTABLE PROFITS — s830-831 CA06 ───
export function calcDistributableProfits({ realisedProfits, realisedLosses, shareCapital = 0, sharePremium = 0 }) {
  // Companies Act 2006 s830: distributable profits = accumulated realised profits - accumulated realised losses
  // s831 (public companies): net assets must also exceed aggregate of called-up share capital + undistributable reserves
  const distributable = round(realisedProfits - realisedLosses, 2);
  const undistributableReserves = round(shareCapital + sharePremium, 2);
  const dividendLegal = distributable > 0;
  const maxDividend = dividendLegal ? round(distributable, 2) : 0;
  return {
    realisedProfits: round(realisedProfits, 2),
    realisedLosses: round(realisedLosses, 2),
    distributable,
    undistributableReserves,
    dividendLegal,
    maxDividend,
    shareCapital: round(shareCapital, 2),
    sharePremium: round(sharePremium, 2)
  };
}

// ─── R) CONSTRUCTION REVENUE — Multi-contract per IAS 11 / FRS 102 s23 ───
export function calcConstructionRevenue({ contracts }) {
  // Per-contract: cost-to-cost method, completion %, revenue recognised, WIP, over/under billing
  const results = contracts.map(c => {
    const contractValue = c.contractValue || 0;
    const variations = c.variations || 0;
    const totalValue = contractValue + variations;
    const costsToDate = c.costsToDate || 0;
    const estimatedTotalCost = c.estimatedTotalCost || 0;
    const billingsToDate = c.billingsToDate || 0;
    // Cost-to-cost method
    const completionPct = estimatedTotalCost > 0 ? round(costsToDate / estimatedTotalCost * 100, 2) : 0;
    // Revenue recognised to date
    const revenueToDate = round(totalValue * completionPct / 100, 2);
    // Prior period revenue (for current year calculation)
    const priorCosts = c.priorCostsToDate || 0;
    const priorCompletionPct = estimatedTotalCost > 0 ? round(priorCosts / estimatedTotalCost * 100, 2) : 0;
    const priorRevenue = round(totalValue * priorCompletionPct / 100, 2);
    const currentYearRevenue = round(revenueToDate - priorRevenue, 2);
    // Profit
    const estimatedProfit = round(totalValue - estimatedTotalCost, 2);
    const profitToDate = round(estimatedProfit * completionPct / 100, 2);
    const isLossMaking = estimatedProfit < 0;
    const lossProvision = isLossMaking ? round(Math.abs(estimatedProfit) - Math.abs(profitToDate), 2) : 0;
    // WIP
    const wip = round(costsToDate + Math.max(0, profitToDate), 2);
    // Over/under billing
    const overUnderBilling = round(revenueToDate - billingsToDate, 2);
    const billingStatus = overUnderBilling > 0 ? "under-billed" : overUnderBilling < 0 ? "over-billed" : "matched";
    return {
      name: c.name || "",
      contractValue: round(contractValue, 2),
      variations: round(variations, 2),
      totalValue: round(totalValue, 2),
      costsToDate: round(costsToDate, 2),
      estimatedTotalCost: round(estimatedTotalCost, 2),
      completionPct,
      revenueToDate,
      currentYearRevenue,
      estimatedProfit,
      profitToDate,
      isLossMaking,
      lossProvision: round(Math.max(0, lossProvision), 2),
      wip,
      billingsToDate: round(billingsToDate, 2),
      overUnderBilling,
      billingStatus
    };
  });
  return {
    results,
    totalRevenue: round(results.reduce((s, r) => s + r.revenueToDate, 0), 2),
    totalCurrentYearRevenue: round(results.reduce((s, r) => s + r.currentYearRevenue, 0), 2),
    totalCosts: round(results.reduce((s, r) => s + r.costsToDate, 0), 2),
    totalWIP: round(results.reduce((s, r) => s + r.wip, 0), 2),
    totalLossProvision: round(results.reduce((s, r) => s + r.lossProvision, 0), 2),
    lossMakingCount: results.filter(r => r.isLossMaking).length,
    contractCount: results.length
  };
}

// ─── S) COMBINED RATIO — Insurance ───
export function calcCombinedRatio({ premiums, claims, expenses }) {
  // premiums, claims, expenses can be single numbers or arrays (by class)
  const totalPremiums = Array.isArray(premiums) ? premiums.reduce((s, v) => s + v, 0) : premiums;
  const totalClaims = Array.isArray(claims) ? claims.reduce((s, v) => s + v, 0) : claims;
  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((s, v) => s + v, 0) : expenses;
  const lossRatio = totalPremiums > 0 ? round(totalClaims / totalPremiums * 100, 2) : 0;
  const expenseRatio = totalPremiums > 0 ? round(totalExpenses / totalPremiums * 100, 2) : 0;
  const combinedRatio = round(lossRatio + expenseRatio, 2);
  const underwritingResult = round(totalPremiums - totalClaims - totalExpenses, 2);
  const profitable = combinedRatio < 100;
  // Per-class breakdown if arrays provided
  let byClass = null;
  if (Array.isArray(premiums) && Array.isArray(claims) && Array.isArray(expenses)) {
    byClass = premiums.map((p, i) => {
      const cl = claims[i] || 0;
      const ex = expenses[i] || 0;
      const lr = p > 0 ? round(cl / p * 100, 2) : 0;
      const er = p > 0 ? round(ex / p * 100, 2) : 0;
      return { classIndex: i, premium: round(p, 2), claims: round(cl, 2), expenses: round(ex, 2), lossRatio: lr, expenseRatio: er, combinedRatio: round(lr + er, 2) };
    });
  }
  return {
    totalPremiums: round(totalPremiums, 2),
    totalClaims: round(totalClaims, 2),
    totalExpenses: round(totalExpenses, 2),
    lossRatio,
    expenseRatio,
    combinedRatio,
    underwritingResult,
    profitable,
    byClass
  };
}

// ─── CONFIG OBJECTS FOR UI ───
export const ADDITIONAL_MODEL_CONFIGS = {
  derivatives: { id: "derivatives", title: "Interest Rate Swap Valuation", standard: "IAS 39/IFRS 9", description: "Value interest rate swaps and test hedge effectiveness" },
  bond: { id: "bond", title: "Bond Valuation", standard: "IFRS 9", description: "Price bonds, calculate duration, convexity, and DV01" },
  investmentProperty: { id: "inv_property", title: "Investment Property Valuation", standard: "IAS 40/FRS 102 s16", description: "Income capitalisation and DCF approaches" },
  pension: { id: "pension", title: "Defined Benefit Pension", standard: "IAS 19/FRS 102 s28", description: "DBO calculation using projected unit credit method" },
  goodwillImpairment: { id: "goodwill", title: "Goodwill Impairment Test", standard: "IAS 36/FRS 102 s27", description: "CGU allocation, market multiples, headroom analysis" },
  deferredTax: { id: "deferred_tax", title: "Deferred Tax Computation", standard: "IAS 12/FRS 102 s29", description: "Temporary differences, DTL/DTA, marginal relief" },
  foreignCurrency: { id: "fx_translation", title: "Foreign Currency Translation", standard: "IAS 21/FRS 102 s30", description: "Translate subsidiary FS and compute translation reserve" },
  construction: { id: "construction", title: "Construction Contract Revenue", standard: "FRS 102 s23/IFRS 15", description: "Percentage of completion, WIP, loss-making provisions" },
  insurance: { id: "insurance", title: "Insurance Reserves", standard: "IFRS 17/FRS 103", description: "Premium allocation, IBNR, combined ratio" },
  ifrs15: { id: "ifrs15_5step", title: "IFRS 15 Five-Step Model", standard: "IFRS 15", description: "Complete five-step revenue recognition workbook" },
  provisionEnhanced: { id: "provision_enhanced", title: "Provision Unwinding (Enhanced)", standard: "IAS 37/FRS 102 s21", description: "PV of expected outflows with sensitivity analysis" },
  distributableProfits: { id: "distributable_profits", title: "Distributable Profits", standard: "CA06 s830-831", description: "Determine distributable reserves and maximum lawful dividend" },
  constructionRevenue: { id: "construction_revenue", title: "Construction Revenue (Multi-Contract)", standard: "IAS 11/FRS 102 s23", description: "Per-contract cost-to-cost, WIP, and over/under billing analysis" },
  combinedRatio: { id: "combined_ratio", title: "Insurance Combined Ratio", standard: "IFRS 17/FRS 103", description: "Loss ratio, expense ratio, and combined ratio analysis" },
};
