/**
 * HMRC & UK Regulatory Compliance Engine
 * Corporation Tax, VAT, PAYE/NIC, Companies Act, AML/MLR
 * All rates current as at April 2025 / Companies Act 2006 (as amended)
 * References embedded per HMRC guidance and FRC standards
 */

// ═══════════════════════════════════════════════════════════════════
// RATES & THRESHOLDS (update annually)
// ═══════════════════════════════════════════════════════════════════

export const UK_TAX_RATES = {
  // Corporation Tax — Finance Act 2023 (effective April 2023)
  ct: {
    mainRate:             0.25,   // 25% on profits above £250,000
    smallProfitsRate:     0.19,   // 19% on profits up to £50,000
    smallProfitsLimit:    50_000,
    marginalReliefUpper:  250_000,
    largeCompanyThreshold: 1_500_000, // quarterly instalment payments
    marginalReliefFraction: 3/200,   // F = 3/200 per Finance Act 2023
    taxYear: '2025/26',
  },
  // R&D Tax Relief — HMRC RDEC / Enhanced Deduction (from 1 April 2024)
  rd: {
    smeEnhancedDeduction: 0.86,   // 86% (was 130%, reduced April 2023, further April 2024)
    smeMinimumProfitRate: 0.10,   // 10% minimum profit rate for SME scheme
    rdecRate:             0.20,   // 20% above-the-line credit from April 2024
    mergedSchemeRate:     0.20,   // Merged R&D scheme from April 2024 (replaces SME + RDEC for most)
    lossMakingCashRate:   0.1429, // Cash credit for loss-making SMEs in merged scheme
    taxYear:              '2025/26',
  },
  // Capital Allowances
  ca: {
    aiaLimit:          1_000_000, // Annual Investment Allowance
    fullExpensing:     1.00,      // 100% FYA on qualifying plant & machinery (no end date)
    specialRateFYA:    0.50,      // 50% FYA on special rate pool
    mainPoolWDA:       0.18,      // 18% Writing Down Allowance — main pool
    specialPoolWDA:    0.06,      // 6% Writing Down Allowance — special rate pool
    structuresWDA:     0.03,      // 3% Structures and Buildings Allowance
    taxYear:           '2025/26',
  },
  // VAT
  vat: {
    standardRate:           0.20,
    reducedRate:            0.05,
    registrationThreshold:  90_000,  // From 1 April 2024
    deregistrationThreshold: 88_000,
    flatRateRegThreshold:   150_000, // Can join flat rate scheme
    cashAccountingThreshold: 1_350_000,
    taxYear:                '2025/26',
  },
  // Income Tax Bands (England/Wales/NI) 2025/26
  incomeTax: {
    personalAllowance:  12_570,
    basicRateLimit:     50_270,
    higherRateLimit:    125_140,
    basicRate:          0.20,
    higherRate:         0.40,
    additionalRate:     0.45,
    personalAllowanceTaper: 100_000, // PA tapered above this
    taxYear:            '2025/26',
  },
  // National Insurance (from April 2025)
  nic: {
    employee: {
      primaryThreshold:   12_570,
      upperEarningsLimit: 50_270,
      rate:               0.08,      // 8% on earnings between PT and UEL
      aboveUEL:           0.02,      // 2% above UEL
    },
    employer: {
      secondaryThreshold: 5_000,     // From April 2025 (was £9,100)
      rate:               0.15,      // From April 2025 (was 13.8%)
      employmentAllowance: 10_500,   // From April 2025 (was £5,000)
      exemptThreshold:    100_000,   // Connected companies threshold for EA
    },
    taxYear: '2025/26',
  },
  // Auto-enrolment pension
  pension: {
    qualifyingEarningsMin: 6_240,
    qualifyingEarningsMax: 50_270,
    employerMinPct:        0.03,
    employeeMinPct:        0.05,
    totalMinPct:           0.08,
  },
};

// ═══════════════════════════════════════════════════════════════════
// 1. CORPORATION TAX CALCULATOR
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate CT liability including marginal relief
 * @param {number} profitBeforeTax    accounting profit
 * @param {Object} adjustments        { capitalAllowances, disallowedExpenses, rdEnhancement, lossRelief }
 * @param {number} associatedCompanies  number of associated companies (divides thresholds)
 * @param {boolean} largeCo             true if profits > £1.5m (QIPs apply)
 */
export function calculateCorporationTax(profitBeforeTax, adjustments = {}, associatedCompanies = 0, largeCo = false) {
  const rates = UK_TAX_RATES.ct;
  const { capitalAllowances = 0, disallowedExpenses = 0, rdEnhancement = 0, lossRelief = 0 } = adjustments;

  // Adjust thresholds for associated companies
  const assocFactor = associatedCompanies + 1;
  const smallLimit  = rates.smallProfitsLimit / assocFactor;
  const upperLimit  = rates.marginalReliefUpper / assocFactor;

  // Taxable profit
  const taxableProfit = Math.max(0, profitBeforeTax + disallowedExpenses - capitalAllowances - rdEnhancement - lossRelief);

  let ctLiability, effectiveRate;

  if (taxableProfit <= smallLimit) {
    ctLiability   = taxableProfit * rates.smallProfitsRate;
    effectiveRate = rates.smallProfitsRate;
  } else if (taxableProfit <= upperLimit) {
    // Marginal relief: CT = (taxable × main rate) − MR
    // MR = (upper limit − taxable) × upper limit / taxable × F
    const grossCT   = taxableProfit * rates.mainRate;
    const mr        = (upperLimit - taxableProfit) * (upperLimit / taxableProfit) * rates.marginalReliefFraction;
    ctLiability     = Math.max(0, grossCT - mr);
    effectiveRate   = ctLiability / taxableProfit;
  } else {
    ctLiability   = taxableProfit * rates.mainRate;
    effectiveRate = rates.mainRate;
  }

  // Payment dates
  // Note: year-end not passed to this function; use deadline calculator for dates

  return {
    profitBeforeTax,
    adjustments:     { capitalAllowances, disallowedExpenses, rdEnhancement, lossRelief },
    taxableProfit,
    ctLiability:     Number(ctLiability.toFixed(2)),
    effectiveRate:   Number((effectiveRate * 100).toFixed(2)) + '%',
    marginalRelief:  taxableProfit > smallLimit && taxableProfit <= upperLimit,
    rateBand:        taxableProfit <= smallLimit ? 'Small profits rate (19%)' : taxableProfit <= upperLimit ? 'Marginal relief band' : 'Main rate (25%)',
    associatedCompanies,
    adjustedThresholds: { small: smallLimit, upper: upperLimit },
    quarterlyInstalments: largeCo || taxableProfit > rates.largeCompanyThreshold,
    reference: 'Corporation Tax Act 2010 / Finance Act 2023',
    auditNote: `CT liability of £${ctLiability.toFixed(2)} at effective rate of ${(effectiveRate * 100).toFixed(2)}%. Recalculate capital allowances schedule and verify R&D claim support.`,
  };
}

// ─── R&D Tax Relief ───────────────────────────────────────────────────────

export function calculateRDRelief(rdExpenditure, taxableProfit, _isSME = true, periodFrom = '2024-04-01') {
  const r = UK_TAX_RATES.rd;
  const usesMergedScheme = new Date(periodFrom) >= new Date('2024-04-01');

  if (usesMergedScheme) {
    // Merged scheme — RDEC credit at 20% above the line
    const credit    = rdExpenditure * r.mergedSchemeRate;
    const netBenefit = credit * (1 - UK_TAX_RATES.ct.mainRate); // net of CT
    return {
      scheme:     'Merged R&D scheme (from April 2024)',
      rdExpenditure,
      creditRate:  '20%',
      grossCredit: Number(credit.toFixed(2)),
      netBenefit:  Number(netBenefit.toFixed(2)),
      taxSaving:   Number(credit.toFixed(2)),
      aboveLine:   true,
      reference:   'Finance Act 2023 — Merged R&D scheme',
    };
  }

  // SME Enhanced Deduction (pre April 2024 / or CSOP exceptions)
  const enhancedDeduction = rdExpenditure * r.smeEnhancedDeduction;
  const taxSaving         = enhancedDeduction * UK_TAX_RATES.ct.mainRate;
  const cashCredit        = taxableProfit < 0 ? rdExpenditure * 1.86 * r.lossMakingCashRate : null;

  return {
    scheme:           'SME Enhanced Deduction',
    rdExpenditure,
    enhancedDeduction: Number(enhancedDeduction.toFixed(2)),
    taxSaving:         Number(taxSaving.toFixed(2)),
    cashCreditIfLoss:  cashCredit ? Number(cashCredit.toFixed(2)) : null,
    reference:         'CTA 2009 Part 13 — SME R&D scheme',
  };
}

// ─── Capital Allowances ───────────────────────────────────────────────────

export function calculateCapitalAllowances(assets, periodMonths = 12) {
  const ca = UK_TAX_RATES.ca;
  const claims = [];
  let totalAllowances = 0;

  for (const asset of assets) {
    const { description, cost, type } = asset;
    let allowance, rate, basis;

    if (type === 'main_pool' && cost <= ca.aiaLimit) {
      allowance = cost;   basis = 'AIA (100%)';     rate = 1.0;
    } else if (type === 'main_pool') {
      allowance = cost * ca.fullExpensing; basis = 'Full Expensing (100%)'; rate = 1.0;
    } else if (type === 'special_rate') {
      allowance = cost * ca.specialRateFYA; basis = '50% FYA — special rate'; rate = 0.5;
    } else if (type === 'structures') {
      allowance = cost * ca.structuresWDA * (periodMonths / 12); basis = 'SBA (3%)'; rate = ca.structuresWDA;
    } else {
      allowance = cost * ca.mainPoolWDA * (periodMonths / 12); basis = 'WDA (18%)'; rate = ca.mainPoolWDA;
    }

    totalAllowances += allowance;
    claims.push({ description, cost, type, allowance: Number(allowance.toFixed(2)), rate: (rate * 100).toFixed(0) + '%', basis });
  }

  return {
    claims,
    totalAllowances: Number(totalAllowances.toFixed(2)),
    taxSaving:       Number((totalAllowances * UK_TAX_RATES.ct.mainRate).toFixed(2)),
    reference:       'Capital Allowances Act 2001 / Finance Act 2021',
    auditNote:       `Total capital allowances of £${totalAllowances.toFixed(2)}. Verify each asset qualifies (not excluded, used in trade, correctly pooled). Full expensing requires main pool — verify no special rate items misclassified.`,
  };
}

// ─── Loss Relief ──────────────────────────────────────────────────────────

export function evaluateLossRelief(currentYearLoss, priorYearProfit, futureYearForecast, groupMember = false) {
  const options = [];

  if (priorYearProfit > 0) {
    options.push({
      type:   'carry_back',
      limit:  Math.min(currentYearLoss, priorYearProfit, 2_000_000), // 1 year, £2m limit for extended carry-back
      relief: Math.min(currentYearLoss, priorYearProfit) * UK_TAX_RATES.ct.mainRate,
      note:   'Carry-back to prior year — CTSA claim required within 2 years of period end',
      ref:    'CTA 2010 s.37',
    });
  }

  if (futureYearForecast > 0) {
    options.push({
      type:   'carry_forward',
      limit:  currentYearLoss,
      relief: Math.min(currentYearLoss, futureYearForecast) * UK_TAX_RATES.ct.mainRate,
      note:   'Carry-forward is unlimited in time but capped at 50% of taxable profits above £5m (deductions allowance)',
      ref:    'CTA 2010 s.45',
    });
  }

  if (groupMember) {
    options.push({
      type:  'group_relief',
      note:  'Group relief available — surrender current year losses to profitable group members',
      ref:   'CTA 2010 Part 5',
    });
  }

  return { currentYearLoss, options, reference: 'CTA 2010 — Loss Relief' };
}

// ═══════════════════════════════════════════════════════════════════
// 2. VAT COMPLIANCE
// ═══════════════════════════════════════════════════════════════════

/**
 * VAT position analysis — registration, returns, partial exemption
 */
export function analyseVATPosition(revenue, taxableSupplies, exemptSupplies, _vatQuarters = []) {
  const vat = UK_TAX_RATES.vat;
  const alerts = [];

  // Registration threshold monitoring
  const last12Months = revenue; // Caller should pass rolling 12-month figure
  if (last12Months >= vat.registrationThreshold && !taxableSupplies.registered) {
    alerts.push({ type: 'registration_required', severity: 'high', message: `Taxable supplies of £${last12Months.toLocaleString()} exceed VAT registration threshold of £${vat.registrationThreshold.toLocaleString()}. Registration required within 30 days of month-end in which threshold breached.`, ref: 'VATA 1994 s.3' });
  } else if (last12Months >= vat.registrationThreshold * 0.9) {
    alerts.push({ type: 'threshold_approach', severity: 'medium', message: `Taxable supplies of £${last12Months.toLocaleString()} within 10% of registration threshold (£${vat.registrationThreshold.toLocaleString()}). Monitor monthly.` });
  }

  // Partial exemption calculation
  const totalInput     = taxableSupplies.inputVAT || 0;
  const taxableTurnover = taxableSupplies.taxableTurnover || 0;
  const totalTurnover   = taxableTurnover + (exemptSupplies?.turnover || 0);
  const taxableRatio    = totalTurnover > 0 ? taxableTurnover / totalTurnover : 1;
  const recoverableInputVAT = totalInput * taxableRatio;
  const blockedInputVAT     = totalInput - recoverableInputVAT;

  // De minimis test (if blocked VAT < £625/month average and < 50% of all input tax)
  const avgMonthlyBlocked = blockedInputVAT / 12;
  const deMinimis = avgMonthlyBlocked <= 625 && taxableRatio >= 0.5;

  // MTD compliance
  alerts.push({ type: 'mtd_compliance', severity: 'info', message: 'Making Tax Digital (MTD) for VAT: digital records and software submission required for all VAT-registered businesses.', ref: 'SI 2018/261' });

  return {
    registrationStatus: last12Months >= vat.registrationThreshold ? 'Required' : last12Months >= vat.deregistrationThreshold ? 'Registered' : 'Below threshold',
    last12MonthsTaxable: last12Months,
    threshold:           vat.registrationThreshold,
    partialExemption: {
      taxableRatio:         Number((taxableRatio * 100).toFixed(1)) + '%',
      recoverableInput:     Number(recoverableInputVAT.toFixed(2)),
      blockedInput:         Number(blockedInputVAT.toFixed(2)),
      deMinimisTest:        deMinimis,
      deMinimisResult:      deMinimis ? 'PASS — all input VAT recoverable' : 'FAIL — partial exemption applies',
    },
    alerts,
    reference: 'VATA 1994 / HMRC VAT Notice 706 (Partial Exemption)',
  };
}

// ─── VAT Return deadlines ─────────────────────────────────────────────────

export function vatReturnDeadlines(vatQuarterEnds) {
  return vatQuarterEnds.map(qe => {
    const d        = new Date(qe);
    const deadline = new Date(d);
    deadline.setMonth(deadline.getMonth() + 1);
    deadline.setDate(deadline.getDate() + 7); // 1 month + 7 days
    const daysUntil = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    return {
      quarterEnd:  qe,
      deadline:    deadline.toLocaleDateString('en-GB'),
      daysUntil,
      urgent:      daysUntil <= 7,
      overdue:     daysUntil < 0,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// 3. PAYE / NIC CALCULATOR
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate PAYE and NIC for an individual employee
 * @param {number} grossSalary    annual gross
 * @param {number} benefitsInKind annual P11D value
 * @param {boolean} directorLoan  director loan balance (s455 tax)
 */
export function calculatePAYEAndNIC(grossSalary, benefitsInKind = 0, pensionEmployee = 0) {
  const it  = UK_TAX_RATES.incomeTax;
  const nic = UK_TAX_RATES.nic;
  const totalIncome = grossSalary + benefitsInKind;

  // Personal allowance taper
  let pa = it.personalAllowance;
  if (totalIncome > it.personalAllowanceTaper) {
    pa = Math.max(0, it.personalAllowance - (totalIncome - it.personalAllowanceTaper) / 2);
  }

  const taxable = Math.max(0, totalIncome - pa - pensionEmployee);

  // Income tax
  let incomeTax = 0;
  if (taxable > 0) {
    const basicBand     = Math.min(taxable, it.basicRateLimit - it.personalAllowance);
    const higherBand    = Math.max(0, Math.min(taxable - basicBand, it.higherRateLimit - it.basicRateLimit));
    const addlBand      = Math.max(0, taxable - basicBand - higherBand);
    incomeTax = (basicBand * it.basicRate) + (higherBand * it.higherRate) + (addlBand * it.additionalRate);
  }

  // Employee NIC
  const empNicBase   = Math.max(0, Math.min(grossSalary - nic.employee.primaryThreshold, nic.employee.upperEarningsLimit - nic.employee.primaryThreshold));
  const empNicAbove  = Math.max(0, grossSalary - nic.employee.upperEarningsLimit);
  const employeeNIC  = (empNicBase * nic.employee.rate) + (empNicAbove * nic.employee.aboveUEL);

  // Employer NIC
  const erNicBase    = Math.max(0, grossSalary - nic.employer.secondaryThreshold);
  const employerNIC  = erNicBase * nic.employer.rate;

  // Auto-enrolment pension (employer minimum)
  const p = UK_TAX_RATES.pension;
  const pensionBase      = Math.max(0, Math.min(grossSalary, p.qualifyingEarningsMax) - p.qualifyingEarningsMin);
  const pensionEmployer  = pensionBase * p.employerMinPct;

  return {
    grossSalary,
    benefitsInKind,
    totalIncome,
    personalAllowance:  pa,
    taxableIncome:      taxable,
    incomeTax:          Number(incomeTax.toFixed(2)),
    employeeNIC:        Number(employeeNIC.toFixed(2)),
    employerNIC:        Number(employerNIC.toFixed(2)),
    pensionEmployee:    Number(pensionEmployee.toFixed(2)),
    pensionEmployer:    Number(pensionEmployer.toFixed(2)),
    netPay:             Number((grossSalary - incomeTax - employeeNIC - pensionEmployee).toFixed(2)),
    totalEmployerCost:  Number((grossSalary + employerNIC + pensionEmployer).toFixed(2)),
    effectiveTaxRate:   grossSalary > 0 ? Number(((incomeTax / grossSalary) * 100).toFixed(1)) + '%' : '0%',
    reference:          'ITEPA 2003 / SSCBA 1992 / SI 2001/1004',
    auditNote:          `PAYE/NIC liability: employee total deductions £${(incomeTax + employeeNIC).toFixed(2)}, employer NIC £${employerNIC.toFixed(2)}. Verify P11D for benefits in kind and check employment allowance eligibility.`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 4. COMPANIES ACT 2006 — DEADLINES & EXEMPTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Check Companies Act filing requirements and deadlines
 */
export function companiesActCompliance(entity) {
  const {
    yearEnd, entityType = 'private', revenue = 0, balanceSheet = 0, employees = 0, // eslint-disable-line no-unused-vars
    isPublic = false, parentGuarantees = false, isGroup = false,
  } = entity;

  const ye        = new Date(yearEnd);
  const today     = new Date();
  const obligations = [];

  // ─ Audit exemption thresholds ─────────────────────────────────
  const micro     = revenue <= 632_000  && balanceSheet <= 316_000   && employees <= 10;
  const small     = revenue <= 10_200_000 && balanceSheet <= 5_100_000 && employees <= 50;
  const medium    = revenue <= 36_000_000 && balanceSheet <= 18_000_000 && employees <= 250;

  let thresholdMet = 0;
  if (revenue <= 10_200_000)    thresholdMet++;
  if (balanceSheet <= 5_100_000) thresholdMet++;
  if (employees <= 50)           thresholdMet++;

  const auditExempt = !isPublic && !isGroup && thresholdMet >= 2 && !parentGuarantees;

  // ─ Filing deadlines ────────────────────────────────────────────
  const addMonths = (d, m) => { const r = new Date(d); r.setMonth(r.getMonth() + m); return r; };
  const daysUntil = (d) => Math.ceil((d - today) / (1000 * 60 * 60 * 24));

  const accountsDeadline = isPublic ? addMonths(ye, 6) : addMonths(ye, 9);
  obligations.push({
    type:      'annual_accounts',
    deadline:  accountsDeadline.toLocaleDateString('en-GB'),
    daysUntil: daysUntil(accountsDeadline),
    penalties: isPublic ? 'Double the private company rates' : '£150 / £375 / £750 / £1,500',
    reference: 'CA 2006 s.394',
    urgent:    daysUntil(accountsDeadline) <= 30,
  });

  obligations.push({
    type:      'confirmation_statement',
    deadline:  addMonths(ye, 12).toLocaleDateString('en-GB'),
    daysUntil: daysUntil(addMonths(ye, 12)),
    penalties: 'Potential striking off',
    reference: 'CA 2006 s.853A',
    urgent:    daysUntil(addMonths(ye, 12)) <= 14,
  });

  // ─ Size thresholds ─────────────────────────────────────────────
  const sizeClassification = micro ? 'Micro-entity' : small ? 'Small company' : medium ? 'Medium company' : 'Large company';

  return {
    entity,
    sizeClassification,
    thresholds: { revenue, balanceSheet, employees, thresholdMet },
    auditExempt,
    auditExemptReason: auditExempt
      ? `Qualifies as ${sizeClassification} — meets 2 of 3 size criteria. Statutory audit not required under CA 2006 s.477/479.`
      : `Audit required. ${isPublic ? 'Public company.' : isGroup ? 'Group company — exemption requires parent guarantee (s.479A).' : 'Size criteria not met — check two consecutive years.'}`,
    obligations,
    filingRequirements: {
      fullAccounts:      !small && !micro,
      abbreviatedBSonly: small,
      microEntityFormat: micro,
      directorsReport:   !small && !micro,
      strategicReport:   !medium && !small && !micro,
    },
    reference: 'Companies Act 2006 (as amended by SI 2015/980)',
  };
}

// ═══════════════════════════════════════════════════════════════════
// 5. AML / MLR 2017 COMPLIANCE
// ═══════════════════════════════════════════════════════════════════

/**
 * CDD risk assessment and MLR requirements for audit firms
 * @param {Object} client  { entityType, jurisdiction, ownershipStructure, businessType, transactionValue }
 */
export function assessAMLRisk(client) {
  const { entityType, jurisdiction = 'UK', ownershipStructure, businessType, transactionValue = 0, pep = false, sanctioned = false } = client;

  if (sanctioned) {
    return { risk: 'refused', reason: 'Client or beneficial owner appears on sanctions list (OFSI/UN/EU). Report to NCA — potential SAR required.', action: 'Do not proceed. Consider SAR to NCA. Freeze assets if applicable.', ref: 'Sanctions and Anti-Money Laundering Act 2018' };
  }

  let riskScore = 0;
  const factors = [];

  // High-risk factors
  if (pep)                                    { riskScore += 30; factors.push('PEP — Politically Exposed Person or close associate'); }
  if (['high', 'very_high'].includes(jurisdiction)) { riskScore += 25; factors.push(`High-risk jurisdiction: ${jurisdiction}`); }
  if (!ownershipStructure || ownershipStructure === 'complex') { riskScore += 15; factors.push('Complex/opaque ownership structure'); }
  if (businessType === 'cash_intensive')      { riskScore += 20; factors.push('Cash-intensive business'); }
  if (transactionValue > 15_000)              { riskScore += 10; factors.push('Transaction value ≥ £15,000'); }
  if (entityType === 'trust')                 { riskScore += 10; factors.push('Trust — beneficial ownership verification required'); }

  // Low-risk factors
  if (['UK', 'EEA'].includes(jurisdiction))   { riskScore -= 10; }
  if (entityType === 'listed_company')        { riskScore -= 10; }

  const cddLevel = riskScore >= 40 ? 'enhanced' : riskScore >= 15 ? 'standard' : 'simplified';

  const cddRequirements = {
    simplified: ['Obtain entity name and address', 'Confirm business type', 'Document rationale for simplified CDD'],
    standard:   ['Verify entity identity (certificate of incorporation)', 'Verify beneficial owners (>25% ownership) — certified ID', 'Understand business purpose', 'Ongoing monitoring'],
    enhanced:   ['All standard CDD requirements', 'Senior management approval required', 'Source of funds verification', 'Enhanced ongoing monitoring', 'Board-level notification', ...(pep ? ['PEP screening — annual refresh'] : [])],
  };

  return {
    riskScore,
    riskLevel:    riskScore >= 40 ? 'high' : riskScore >= 15 ? 'medium' : 'low',
    cddLevel,
    factors,
    requirements: cddRequirements[cddLevel],
    sarRequired:  riskScore >= 70 || sanctioned,
    recordKeeping: '5 years from end of business relationship (MLR 2017 Reg.40)',
    reference:     'Money Laundering Regulations 2017 (as amended 2019, 2022) / JMLSG Guidance',
    auditNote:     `${cddLevel.toUpperCase()} CDD required. ${cddRequirements[cddLevel].length} requirements to complete before engagement commences.`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 6. FRC / IAASB REGULATORY UPDATES
// ═══════════════════════════════════════════════════════════════════

export const regulatoryUpdates = [
  {
    standard:    'ISA (UK) 600 (Revised)',
    area:        'Group Audits',
    effective:   '15 December 2024 (periods beginning on/after)',
    change:      'Significant revision — group engagement team has greater responsibilities for component work. New requirements for: scoping rationale, engagement team involvement, component auditor communication.',
    impact:      'high',
    action:      'Review all group audit engagements. Update planning documentation, component auditor instructions, and completion procedures.',
    ref:         'FRC ISA (UK) 600 (Revised 2023)',
  },
  {
    standard:    'IFRS 18',
    area:        'Presentation and Disclosure in Financial Statements',
    effective:   '1 January 2027',
    change:      'Replaces IAS 1. New subtotals required: Operating Profit and Profit Before Finance and Tax. Management Performance Measures require specific disclosures.',
    impact:      'medium',
    action:      'Brief clients on impact. Consider early adoption analysis. Assess systems for new subtotals.',
    ref:         'IASB IFRS 18 (April 2024)',
  },
  {
    standard:    'IFRS S1/S2 (ISSB)',
    area:        'Sustainability-related Disclosures',
    effective:   'UK listed companies — mandatory from January 2025 (as UK SRS)',
    change:      'S1: General requirements for sustainability disclosures. S2: Climate-related disclosures (TCFD-aligned). Material sustainability risks required in annual reports.',
    impact:      'high',
    action:      'Identify listed clients. Assess whether sustainability disclosures require audit/assurance. Update ISA 720 procedures.',
    ref:         'ISSB IFRS S1/S2 (June 2023) / UK Endorsement',
  },
  {
    standard:    'ISQM 1/2',
    area:        'Quality Management',
    effective:   'Effective — monitoring phase',
    change:      'ISQM 1: System of quality management at firm level. ISQM 2: Engagement quality reviews. Both now require annual evaluation of system of quality management.',
    impact:      'medium',
    action:      'Annual SOQM evaluation required. Document findings and remediation actions.',
    ref:         'FRC ISQM 1/2 (UK)',
  },
  {
    standard:    'Going Concern (FRC Guidance 2024)',
    area:        'Going Concern',
    effective:   'Issued 2024',
    change:      'Updated guidance clarifies: assessment must cover at least 12 months from date of approval. Stress testing and reverse stress testing expected for higher-risk entities.',
    impact:      'medium',
    action:      'Update planning templates and going concern checklists. Ensure stress tests documented.',
    ref:         'FRC Going Concern and Liquidity Risk Guidance 2024',
  },
];

export function getApplicableUpdates(entity) {
  const { isGroup, isListed, framework, _yearEnd } = entity;
  return regulatoryUpdates.filter(u => {
    if (u.standard.includes('600') && !isGroup) return false;
    if (u.standard.includes('IFRS 18') && framework?.includes('FRS')) return false;
    if (u.standard.includes('ISSB') && !isListed) return false;
    return true;
  });
}
