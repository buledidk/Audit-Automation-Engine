/**
 * FinancialModels.js
 *
 * Pure calculation functions and data templates for 8 financial calculators.
 * No React dependencies — only math helpers and data structures.
 *
 * Covers: IAS 36 Impairment DCF, Standalone DCF, IFRS 9 EIR,
 *         IAS 37 Provision Unwinding, IFRS 16 Leases, IFRS 2 Black-Scholes,
 *         IFRS 9 ECL, and IFRS 15 Revenue Recognition.
 */

// ---------------------------------------------------------------------------
// 1. MATH HELPERS
// ---------------------------------------------------------------------------

/**
 * Cumulative standard normal distribution using the Abramowitz & Stegun
 * rational approximation of the error function (erf).
 *
 * Maximum absolute error ~1.5 x 10^-7, which is more than sufficient for
 * Black-Scholes pricing in an audit context.
 *
 * @param {number} x - z-score
 * @returns {number} P(Z <= x)
 */
export function cumulativeNormal(x) {
  // Constants for the A&S erf approximation (equation 7.1.26)
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.SQRT2;

  const t = 1.0 / (1.0 + p * absX);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;

  const erf = 1.0 - (a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) *
    Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

/**
 * Generic Newton-Raphson root finder.
 *
 * Used primarily to solve for the Effective Interest Rate (EIR) under IFRS 9,
 * where we need the rate that equates the present value of contractual cash
 * flows to the net carrying amount of the financial instrument.
 *
 * @param {Function} fn     - f(x), the function whose root we seek
 * @param {Function} dfn    - f'(x), the derivative of f
 * @param {number}   x0     - initial guess
 * @param {number}   tol    - convergence tolerance (default 1e-10)
 * @param {number}   maxIter - maximum iterations (default 200)
 * @returns {number} approximate root
 * @throws {Error} if the solver does not converge
 */
export function newtonRaphson(fn, dfn, x0, tol = 1e-10, maxIter = 200) {
  let x = x0;

  for (let i = 0; i < maxIter; i++) {
    const fVal = fn(x);
    const fPrime = dfn(x);

    if (Math.abs(fPrime) < 1e-15) {
      throw new Error('Newton-Raphson: derivative near zero — singular point');
    }

    const xNext = x - fVal / fPrime;

    if (Math.abs(xNext - x) < tol) {
      return xNext;
    }

    x = xNext;
  }

  throw new Error(
    `Newton-Raphson: failed to converge after ${maxIter} iterations ` +
    `(last value ${x})`
  );
}

/**
 * Net Present Value.
 *
 * Cash flows are assumed to occur at the END of each period.
 * cashFlows[0] is the cash flow at the end of period 1.
 * If you need to include a time-0 outlay, add it separately.
 *
 * @param {number}   rate      - discount rate per period (e.g. 0.10 for 10%)
 * @param {number[]} cashFlows - array of periodic cash flows
 * @returns {number} net present value
 */
export function npv(rate, cashFlows) {
  if (rate <= -1) {
    throw new Error('NPV: discount rate must be greater than -100% to avoid division by zero or sign inversion');
  }

  return cashFlows.reduce((pv, cf, idx) => {
    return pv + cf / Math.pow(1 + rate, idx + 1);
  }, 0);
}

/**
 * Weighted Average Cost of Capital.
 *
 * @param {number} ke       - cost of equity (decimal)
 * @param {number} kd       - pre-tax cost of debt (decimal)
 * @param {number} equity   - market value of equity
 * @param {number} debt     - market value of debt
 * @param {number} taxRate  - corporate tax rate (decimal)
 * @returns {number} WACC (decimal)
 */
export function wacc(ke, kd, equity, debt, taxRate) {
  const totalCapital = equity + debt;

  if (totalCapital === 0) {
    throw new Error('WACC: total capital (equity + debt) must be > 0');
  }

  const equityWeight = equity / totalCapital;
  const debtWeight = debt / totalCapital;

  return equityWeight * ke + debtWeight * kd * (1 - taxRate);
}

/**
 * Capital Asset Pricing Model — cost of equity.
 *
 * @param {number} rf   - risk-free rate (decimal)
 * @param {number} beta - equity beta
 * @param {number} erp  - equity risk premium (decimal)
 * @param {number} sp   - size premium / company-specific premium (decimal)
 * @returns {number} cost of equity (decimal)
 */
export function capm(rf, beta, erp, sp = 0) {
  return rf + beta * erp + sp;
}


// ---------------------------------------------------------------------------
// 2. DATA TEMPLATES / CALCULATOR CONFIGS
// ---------------------------------------------------------------------------

/**
 * IAS 36 Impairment — Discounted Cash Flow config.
 *
 * Provides labels and defaults for a 5-year explicit forecast period
 * followed by a terminal value using the Gordon Growth Model.
 */
export const IAS36_CONFIG = {
  id: 'ias36_impairment',
  title: 'IAS 36 Impairment Test — Value in Use',
  standard: 'IAS 36',
  description:
    'Estimates the recoverable amount of a cash-generating unit (CGU) by ' +
    'discounting projected cash flows over a 5-year explicit forecast period ' +
    'and a terminal value using the Gordon Growth Model.',
  fields: [
    { key: 'cashFlow_yr1', label: 'Year 1 Cash Flow', type: 'currency', default: 0 },
    { key: 'cashFlow_yr2', label: 'Year 2 Cash Flow', type: 'currency', default: 0 },
    { key: 'cashFlow_yr3', label: 'Year 3 Cash Flow', type: 'currency', default: 0 },
    { key: 'cashFlow_yr4', label: 'Year 4 Cash Flow', type: 'currency', default: 0 },
    { key: 'cashFlow_yr5', label: 'Year 5 Cash Flow', type: 'currency', default: 0 },
    { key: 'discountRate', label: 'Pre-tax Discount Rate (%)', type: 'percent', default: 12 },
    { key: 'terminalGrowth', label: 'Terminal Growth Rate (%)', type: 'percent', default: 2 },
  ],
  notes: [
    'IAS 36.33: Cash flow projections shall not exceed 5 years unless a longer period can be justified.',
    'IAS 36.55: The discount rate shall be a pre-tax rate that reflects current market assessments.',
    'IAS 36.33(c): Growth rate for extrapolating beyond the forecast period shall not exceed the long-term average.',
  ],
};

/**
 * Standalone DCF — full WACC-based enterprise valuation.
 */
export const DCF_CONFIG = {
  id: 'dcf_valuation',
  title: 'DCF Valuation (WACC Method)',
  standard: 'General / IAS 36 / IFRS 13',
  description:
    'Full discounted cash flow model using CAPM-derived cost of equity, ' +
    'after-tax cost of debt, and WACC as the discount rate.',
  fields: [
    { key: 'rf', label: 'Risk-Free Rate (%)', type: 'percent', default: 4.5 },
    { key: 'beta', label: 'Equity Beta', type: 'number', default: 1.0 },
    { key: 'erp', label: 'Equity Risk Premium (%)', type: 'percent', default: 6.0 },
    { key: 'sp', label: 'Size Premium (%)', type: 'percent', default: 0.0 },
    { key: 'kd', label: 'Pre-tax Cost of Debt (%)', type: 'percent', default: 5.0 },
    { key: 'debtRatio', label: 'Debt / (Debt + Equity) (%)', type: 'percent', default: 30 },
    { key: 'taxRate', label: 'Corporate Tax Rate (%)', type: 'percent', default: 25 },
    { key: 'cashFlow_yr1', label: 'FCFF Year 1', type: 'currency', default: 0 },
    { key: 'cashFlow_yr2', label: 'FCFF Year 2', type: 'currency', default: 0 },
    { key: 'cashFlow_yr3', label: 'FCFF Year 3', type: 'currency', default: 0 },
    { key: 'cashFlow_yr4', label: 'FCFF Year 4', type: 'currency', default: 0 },
    { key: 'cashFlow_yr5', label: 'FCFF Year 5', type: 'currency', default: 0 },
    { key: 'terminalGrowth', label: 'Terminal Growth Rate (%)', type: 'percent', default: 2 },
    { key: 'netDebt', label: 'Net Debt', type: 'currency', default: 0 },
  ],
  notes: [
    'FCFF = Free Cash Flow to the Firm = EBIT(1-t) + D&A - CapEx - Change in WC.',
    'Terminal value uses the Gordon Growth Model: TV = FCF_n * (1+g) / (WACC - g).',
    'Equity Value = Enterprise Value - Net Debt.',
  ],
};

/**
 * IFRS 9 Effective Interest Rate.
 */
export const EIR_CONFIG = {
  id: 'ifrs9_eir',
  title: 'IFRS 9 Effective Interest Rate',
  standard: 'IFRS 9',
  description:
    'Calculates the rate that exactly discounts estimated future cash payments ' +
    'or receipts through the expected life of the financial instrument to the ' +
    'gross carrying amount (IFRS 9.B5.4.1).',
  fields: [
    { key: 'nominalAmount', label: 'Nominal / Face Value', type: 'currency', default: 1000000 },
    { key: 'fees', label: 'Transaction Costs / Fees', type: 'currency', default: 0 },
    { key: 'cashFlows', label: 'Periodic Cash Flows (comma-separated)', type: 'array', default: [] },
  ],
  notes: [
    'IFRS 9.B5.4.1: The EIR includes all fees and points paid or received, transaction costs, and all other premiums or discounts.',
    'Transaction costs are included in the initial carrying amount and amortised over the life using the EIR.',
    'The EIR is used to calculate interest revenue/expense under the amortised cost measurement category.',
  ],
};

/**
 * IAS 37 Provision Unwinding.
 */
export const IAS37_CONFIG = {
  id: 'ias37_provision',
  title: 'IAS 37 Provision Unwinding',
  standard: 'IAS 37',
  description:
    'Models the unwinding of discount on a provision recognised at present value. ' +
    'The increase each period is recognised as a finance cost (IAS 37.60).',
  fields: [
    { key: 'initialProvision', label: 'Initial Provision (PV)', type: 'currency', default: 0 },
    { key: 'discountRate', label: 'Discount Rate (%)', type: 'percent', default: 5 },
    { key: 'term', label: 'Term (years)', type: 'integer', default: 5 },
  ],
  notes: [
    'IAS 37.45: Where the effect of the time value of money is material, the provision shall be the present value of the expected expenditure.',
    'IAS 37.60: The unwinding of the discount shall be recognised as a finance cost.',
    'The discount rate should be a pre-tax rate reflecting current market assessments of the time value of money and risks specific to the liability.',
  ],
};

/**
 * IFRS 16 Lease Calculator.
 */
export const IFRS16_CONFIG = {
  id: 'ifrs16_lease',
  title: 'IFRS 16 Lease Calculator',
  standard: 'IFRS 16',
  description:
    'Calculates the right-of-use asset, lease liability, and period-by-period ' +
    'amortisation schedule for a lessee under IFRS 16.',
  fields: [
    { key: 'payments', label: 'Lease Payment per Period', type: 'currency', default: 0 },
    { key: 'rate', label: 'Incremental Borrowing Rate (%)', type: 'percent', default: 5 },
    { key: 'term', label: 'Lease Term (periods)', type: 'integer', default: 12 },
    { key: 'startDate', label: 'Commencement Date', type: 'date', default: '' },
    { key: 'paymentsInAdvance', label: 'Payments in Advance?', type: 'boolean', default: false },
  ],
  notes: [
    'IFRS 16.26: The lease liability is the present value of lease payments not yet paid at commencement.',
    'IFRS 16.23: The ROU asset equals the lease liability + initial direct costs + prepaid lease payments - incentives.',
    'IFRS 16.36: The ROU asset is depreciated on a straight-line basis over the shorter of the lease term and useful life.',
    'IFRS 16.5: Short-term leases (<=12 months) and low-value asset leases may be exempt.',
  ],
};

/**
 * IFRS 2 Share-based Payment — Black-Scholes Config.
 */
export const BLACK_SCHOLES_CONFIG = {
  id: 'ifrs2_black_scholes',
  title: 'IFRS 2 Share-based Payment — Black-Scholes',
  standard: 'IFRS 2',
  description:
    'Values share options granted to employees using the Black-Scholes-Merton ' +
    'option pricing model as commonly applied under IFRS 2.',
  fields: [
    { key: 'S', label: 'Spot Price (Share Price at Grant Date)', type: 'currency', default: 0 },
    { key: 'K', label: 'Strike / Exercise Price', type: 'currency', default: 0 },
    { key: 'T', label: 'Expected Life (years)', type: 'number', default: 3 },
    { key: 'r', label: 'Risk-Free Rate (%)', type: 'percent', default: 4 },
    { key: 'sigma', label: 'Expected Volatility (%)', type: 'percent', default: 30 },
    { key: 'q', label: 'Dividend Yield (%)', type: 'percent', default: 0 },
  ],
  notes: [
    'IFRS 2.B5: The entity shall consider factors including the exercise price, current share price, expected volatility, dividends, risk-free rate, and expected life.',
    'IFRS 2.B6: Expected volatility should be based on historical volatility over a period commensurate with the expected life.',
    'IFRS 2.B4: The expected life should reflect exercise patterns, including the effect of vesting conditions.',
  ],
};

/**
 * IFRS 9 Expected Credit Loss.
 */
export const ECL_CONFIG = {
  id: 'ifrs9_ecl',
  title: 'IFRS 9 Expected Credit Loss',
  standard: 'IFRS 9',
  description:
    'Calculates Expected Credit Losses across the three-stage impairment model ' +
    'defined by IFRS 9.5.5.',
  fields: [
    { key: 'stage1_pd', label: 'Stage 1 — 12-month PD (%)', type: 'percent', default: 1 },
    { key: 'stage1_lgd', label: 'Stage 1 — LGD (%)', type: 'percent', default: 40 },
    { key: 'stage1_ead', label: 'Stage 1 — EAD', type: 'currency', default: 0 },
    { key: 'stage2_pd', label: 'Stage 2 — Lifetime PD (%)', type: 'percent', default: 5 },
    { key: 'stage2_lgd', label: 'Stage 2 — LGD (%)', type: 'percent', default: 45 },
    { key: 'stage2_ead', label: 'Stage 2 — EAD', type: 'currency', default: 0 },
    { key: 'stage3_pd', label: 'Stage 3 — Lifetime PD (%)', type: 'percent', default: 100 },
    { key: 'stage3_lgd', label: 'Stage 3 — LGD (%)', type: 'percent', default: 50 },
    { key: 'stage3_ead', label: 'Stage 3 — EAD', type: 'currency', default: 0 },
  ],
  notes: [
    'IFRS 9.5.5.3: Stage 1 — 12-month ECL for instruments with no significant increase in credit risk since initial recognition.',
    'IFRS 9.5.5.3: Stage 2 — Lifetime ECL for instruments with a significant increase in credit risk.',
    'IFRS 9.5.5.3: Stage 3 — Lifetime ECL for credit-impaired instruments. Interest revenue on gross carrying amount ceases.',
    'ECL = PD x LGD x EAD (simplified). In practice, ECL should reflect probability-weighted scenarios (IFRS 9.5.5.17).',
  ],
};

/**
 * IFRS 15 Revenue Recognition — 5-step model checklist.
 */
export const IFRS15_CONFIG = {
  id: 'ifrs15_revenue',
  title: 'IFRS 15 Revenue Recognition — 5-Step Model',
  standard: 'IFRS 15',
  description:
    'Structured checklist for applying the five-step revenue recognition model ' +
    'under IFRS 15.',
  fields: [],
  notes: [
    'IFRS 15 replaces IAS 18, IAS 11, and related interpretations.',
    'The core principle is that an entity recognises revenue to depict the transfer of promised goods or services to the customer in an amount that reflects the consideration to which the entity expects to be entitled.',
  ],
};


// ---------------------------------------------------------------------------
// 3. CALCULATOR FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * IAS 36 Impairment DCF — Value in Use calculation.
 *
 * Discounts projected cash flows over the explicit forecast period and adds
 * a terminal value calculated using the Gordon Growth Model.
 *
 * @param {Object}   params
 * @param {number[]} params.cashFlows      - array of annual cash flow projections
 * @param {number}   params.discountRate   - pre-tax discount rate (decimal, e.g. 0.12)
 * @param {number}   params.terminalGrowth - perpetuity growth rate (decimal, e.g. 0.02)
 * @returns {Object} { pvCashFlows, terminalValue, pvTerminal, recoverableAmount, annualPVs }
 */
export function calcImpairmentDCF({ cashFlows, discountRate, terminalGrowth }) {
  if (discountRate <= terminalGrowth) {
    throw new Error(
      'IAS 36 DCF: discount rate must exceed terminal growth rate for a valid Gordon Growth Model terminal value.'
    );
  }

  if (!cashFlows || cashFlows.length === 0) {
    throw new Error('IAS 36 DCF: at least one year of cash flows is required.');
  }

  const annualPVs = cashFlows.map((cf, i) => ({
    year: i + 1,
    cashFlow: cf,
    discountFactor: 1 / Math.pow(1 + discountRate, i + 1),
    presentValue: cf / Math.pow(1 + discountRate, i + 1),
  }));

  const pvCashFlows = annualPVs.reduce((sum, row) => sum + row.presentValue, 0);

  // Terminal value at end of last forecast year using Gordon Growth Model
  const lastCF = cashFlows[cashFlows.length - 1];
  const n = cashFlows.length;
  const terminalValue = (lastCF * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + discountRate, n);

  const recoverableAmount = pvCashFlows + pvTerminal;

  return {
    pvCashFlows: round(pvCashFlows, 2),
    terminalValue: round(terminalValue, 2),
    pvTerminal: round(pvTerminal, 2),
    recoverableAmount: round(recoverableAmount, 2),
    annualPVs: annualPVs.map(row => ({
      ...row,
      discountFactor: round(row.discountFactor, 6),
      presentValue: round(row.presentValue, 2),
    })),
  };
}

/**
 * Standalone DCF Valuation using WACC.
 *
 * Derives cost of equity via CAPM, computes WACC, discounts free cash flows,
 * adds terminal value, and subtracts net debt to arrive at equity value.
 *
 * @param {Object}   params
 * @param {number}   params.rf             - risk-free rate (decimal)
 * @param {number}   params.beta           - equity beta
 * @param {number}   params.erp            - equity risk premium (decimal)
 * @param {number}   params.sp             - size premium (decimal)
 * @param {number}   params.kd             - pre-tax cost of debt (decimal)
 * @param {number}   params.debtRatio      - D / (D+E) as a decimal
 * @param {number}   params.taxRate        - corporate tax rate (decimal)
 * @param {number[]} params.cashFlows      - FCFF for each forecast year
 * @param {number}   params.terminalGrowth - perpetuity growth rate (decimal)
 * @param {number}   [params.netDebt=0]    - net debt to subtract from EV
 * @returns {Object} { ke, waccRate, enterpriseValue, equityValue, pvs, terminalValue, pvTerminal }
 */
export function calcDCF({
  rf, beta, erp, sp = 0, kd, debtRatio, taxRate, cashFlows, terminalGrowth, netDebt = 0,
}) {
  const ke = capm(rf, beta, erp, sp);

  const equityRatio = 1 - debtRatio;
  const waccRate = wacc(ke, kd, equityRatio, debtRatio, taxRate);

  if (waccRate <= terminalGrowth) {
    throw new Error(
      'DCF: WACC must exceed terminal growth rate for a valid terminal value.'
    );
  }

  if (!cashFlows || cashFlows.length === 0) {
    throw new Error('DCF: at least one year of cash flows is required.');
  }

  const pvs = cashFlows.map((cf, i) => ({
    year: i + 1,
    cashFlow: cf,
    discountFactor: 1 / Math.pow(1 + waccRate, i + 1),
    presentValue: cf / Math.pow(1 + waccRate, i + 1),
  }));

  const pvCashFlows = pvs.reduce((sum, row) => sum + row.presentValue, 0);

  const lastCF = cashFlows[cashFlows.length - 1];
  const n = cashFlows.length;
  const terminalValue = (lastCF * (1 + terminalGrowth)) / (waccRate - terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + waccRate, n);

  const enterpriseValue = pvCashFlows + pvTerminal;
  const equityValue = enterpriseValue - netDebt;

  return {
    ke: round(ke, 6),
    waccRate: round(waccRate, 6),
    enterpriseValue: round(enterpriseValue, 2),
    equityValue: round(equityValue, 2),
    terminalValue: round(terminalValue, 2),
    pvTerminal: round(pvTerminal, 2),
    pvs: pvs.map(row => ({
      ...row,
      discountFactor: round(row.discountFactor, 6),
      presentValue: round(row.presentValue, 2),
    })),
  };
}

/**
 * IFRS 9 Effective Interest Rate calculator.
 *
 * Solves for the rate that equates the present value of all future contractual
 * cash flows to the net amount advanced (nominal - fees, where fees are costs
 * TO the lender, e.g. origination costs that reduce the initial carrying amount).
 *
 * Then builds the amortised cost schedule period by period.
 *
 * @param {Object}   params
 * @param {number}   params.nominalAmount - face value / principal
 * @param {number}   params.fees          - transaction costs (positive = cost to holder)
 * @param {number[]} params.cashFlows     - periodic cash flows (positive = receipt)
 * @returns {Object} { eir, amortisedCostSchedule }
 */
export function calcEIR({ nominalAmount, fees = 0, cashFlows }) {
  if (!cashFlows || cashFlows.length === 0) {
    throw new Error('EIR: at least one cash flow is required.');
  }

  // Net amount advanced: the initial carrying amount on the balance sheet.
  // For a lender: principal disbursed less origination costs received,
  //               plus origination costs paid.
  // Simplified: netAmount = nominalAmount - fees
  const netAmount = nominalAmount - fees;

  if (netAmount <= 0) {
    throw new Error('EIR: net amount (nominal - fees) must be positive.');
  }

  // f(r) = netAmount - PV(cashFlows, r) = 0
  // We solve for r using Newton-Raphson.
  const f = (r) => {
    let pvSum = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      pvSum += cashFlows[i] / Math.pow(1 + r, i + 1);
    }
    return netAmount - pvSum;
  };

  const df = (r) => {
    let dSum = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      dSum += (i + 1) * cashFlows[i] / Math.pow(1 + r, i + 2);
    }
    return dSum;
  };

  // Initial guess: simple coupon rate
  const totalCF = cashFlows.reduce((s, c) => s + c, 0);
  const avgCF = totalCF / cashFlows.length;
  const initialGuess = avgCF / netAmount;
  const clampedGuess = Math.max(0.0001, Math.min(initialGuess, 0.5));

  const eir = newtonRaphson(f, df, clampedGuess, 1e-10, 300);

  // Build amortised cost schedule
  const amortisedCostSchedule = [];
  let openingBalance = netAmount;

  for (let i = 0; i < cashFlows.length; i++) {
    const interest = openingBalance * eir;
    const cashFlow = cashFlows[i];
    const closingBalance = openingBalance + interest - cashFlow;

    amortisedCostSchedule.push({
      period: i + 1,
      openingBalance: round(openingBalance, 2),
      interest: round(interest, 2),
      cashFlow: round(cashFlow, 2),
      closingBalance: round(closingBalance, 2),
    });

    openingBalance = closingBalance;
  }

  return {
    eir: round(eir, 8),
    netAmount: round(netAmount, 2),
    amortisedCostSchedule,
  };
}

/**
 * IAS 37 Provision Unwinding schedule.
 *
 * Models the year-by-year increase in a provision that was recognised at
 * present value due to the time value of money.
 *
 * @param {Object} params
 * @param {number} params.initialProvision - provision at day 1 (PV)
 * @param {number} params.discountRate     - discount rate (decimal)
 * @param {number} params.term             - number of years until settlement
 * @returns {Object} { undiscountedAmount, schedule }
 */
export function calcProvisionUnwinding({ initialProvision, discountRate, term }) {
  if (initialProvision <= 0) {
    throw new Error('IAS 37: initial provision must be positive.');
  }
  if (term <= 0 || !Number.isFinite(term)) {
    throw new Error('IAS 37: term must be a positive integer.');
  }

  const schedule = [];
  let opening = initialProvision;

  for (let year = 1; year <= term; year++) {
    const unwinding = opening * discountRate;
    const closing = opening + unwinding;

    schedule.push({
      year,
      opening: round(opening, 2),
      unwinding: round(unwinding, 2),
      closing: round(closing, 2),
    });

    opening = closing;
  }

  // The undiscounted amount is the final closing balance (= FV at settlement).
  const undiscountedAmount = round(opening, 2);

  return {
    undiscountedAmount,
    totalUnwinding: round(undiscountedAmount - initialProvision, 2),
    schedule,
  };
}

/**
 * IFRS 16 Lease Calculator.
 *
 * Computes the initial right-of-use (ROU) asset and lease liability, then
 * builds a period-by-period schedule showing interest on the liability,
 * payments, and straight-line depreciation of the ROU asset.
 *
 * Supports both payments in arrears (default) and payments in advance.
 *
 * @param {Object} params
 * @param {number} params.payments         - fixed lease payment per period
 * @param {number} params.rate             - incremental borrowing rate per period (decimal)
 * @param {number} params.term             - total number of periods
 * @param {string} [params.startDate]      - commencement date (ISO string, informational)
 * @param {boolean} [params.paymentsInAdvance=false] - true if payments made at start of period
 * @returns {Object} { rouAsset, leaseLiability, schedule }
 */
export function calcIFRS16Lease({ payments, rate, term, startDate = '', paymentsInAdvance = false }) {
  if (payments <= 0) {
    throw new Error('IFRS 16: lease payment must be positive.');
  }
  if (rate < 0) {
    throw new Error('IFRS 16: borrowing rate cannot be negative. A negative discount rate produces unreliable present values.');
  }
  if (term <= 0 || !Number.isFinite(term)) {
    throw new Error('IFRS 16: lease term must be a positive integer.');
  }

  // Calculate the PV of lease payments (the initial lease liability).
  // Payments in arrears: PV = PMT * [ (1 - (1+r)^-n) / r ]
  // Payments in advance:  PV = PMT * [ (1 - (1+r)^-n) / r ] * (1+r)
  let leaseLiability;

  if (rate === 0) {
    leaseLiability = payments * term;
  } else {
    const annuityFactor = (1 - Math.pow(1 + rate, -term)) / rate;
    leaseLiability = payments * annuityFactor;
    if (paymentsInAdvance) {
      leaseLiability *= (1 + rate);
    }
  }

  const rouAsset = leaseLiability;
  const depreciation = rouAsset / term;

  const schedule = [];
  let liabilityOpening = leaseLiability;
  let rouNBV = rouAsset;

  for (let period = 1; period <= term; period++) {
    let interest, payment, liabilityClosing;

    if (paymentsInAdvance) {
      // Payment at start of period reduces liability first
      if (period === 1) {
        // First payment at commencement was already accounted for differently;
        // using the annuity-due approach: payment first, then interest accrues.
        payment = payments;
        const afterPayment = liabilityOpening - payment;
        interest = afterPayment * rate;
        liabilityClosing = afterPayment + interest;
      } else {
        payment = payments;
        const afterPayment = liabilityOpening - payment;
        interest = afterPayment * rate;
        liabilityClosing = afterPayment + interest;
      }
    } else {
      // Payments in arrears: interest accrues, then payment at end of period
      interest = liabilityOpening * rate;
      payment = payments;
      liabilityClosing = liabilityOpening + interest - payment;
    }

    // Avoid floating-point dust on the last period
    if (period === term) {
      liabilityClosing = 0;
    }

    const rouDepreciation = depreciation;
    rouNBV -= rouDepreciation;

    // Clamp ROU NBV to zero on final period
    if (period === term) {
      rouNBV = 0;
    }

    schedule.push({
      period,
      opening: round(liabilityOpening, 2),
      interest: round(interest, 2),
      payment: round(payment, 2),
      closing: round(liabilityClosing, 2),
      rouNBV: round(Math.max(rouNBV, 0), 2),
      depreciation: round(rouDepreciation, 2),
    });

    liabilityOpening = liabilityClosing;
  }

  return {
    rouAsset: round(rouAsset, 2),
    leaseLiability: round(leaseLiability, 2),
    startDate: startDate || null,
    paymentsInAdvance,
    schedule,
  };
}

/**
 * IFRS 2 Black-Scholes-Merton option pricing with Greeks.
 *
 * Extended to support continuous dividend yield (q) for completeness.
 *
 * @param {Object} params
 * @param {number} params.S     - current share price (spot)
 * @param {number} params.K     - exercise / strike price
 * @param {number} params.T     - time to expiry in years
 * @param {number} params.r     - risk-free interest rate (decimal)
 * @param {number} params.sigma - expected volatility (decimal, e.g. 0.30)
 * @param {number} [params.q=0] - continuous dividend yield (decimal)
 * @returns {Object} { d1, d2, callValue, putValue, delta, gamma, theta, vega, rho }
 */
export function calcBlackScholes({ S, K, T, r, sigma, q = 0 }) {
  if (S <= 0) throw new Error('Black-Scholes: spot price S must be > 0.');
  if (K <= 0) throw new Error('Black-Scholes: strike price K must be > 0.');
  if (T <= 0) throw new Error('Black-Scholes: time to expiry T must be > 0.');
  if (sigma <= 0) throw new Error('Black-Scholes: volatility sigma must be > 0.');

  const sqrtT = Math.sqrt(T);

  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const Nd1 = cumulativeNormal(d1);
  const Nd2 = cumulativeNormal(d2);
  const NNegd1 = cumulativeNormal(-d1);
  const NNegd2 = cumulativeNormal(-d2);

  const discountFactor = Math.exp(-r * T);
  const dividendDiscount = Math.exp(-q * T);

  // Option values
  const callValue = S * dividendDiscount * Nd1 - K * discountFactor * Nd2;
  const putValue = K * discountFactor * NNegd2 - S * dividendDiscount * NNegd1;

  // Standard normal PDF for Greeks
  const nd1 = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * d1 * d1);

  // Greeks
  const deltaCall = dividendDiscount * Nd1;
  const deltaPut = -dividendDiscount * NNegd1;

  const gamma = (dividendDiscount * nd1) / (S * sigma * sqrtT);

  // Theta (per calendar day = divide annual theta by 365)
  const thetaCallAnnual =
    -(S * dividendDiscount * nd1 * sigma) / (2 * sqrtT)
    - r * K * discountFactor * Nd2
    + q * S * dividendDiscount * Nd1;
  const thetaPutAnnual =
    -(S * dividendDiscount * nd1 * sigma) / (2 * sqrtT)
    + r * K * discountFactor * NNegd2
    - q * S * dividendDiscount * NNegd1;

  const thetaCall = thetaCallAnnual / 365;
  const thetaPut = thetaPutAnnual / 365;

  // Vega (for 1% change in volatility, per convention divide by 100)
  const vegaRaw = S * dividendDiscount * nd1 * sqrtT;
  const vega = vegaRaw / 100;

  // Rho (for 1% change in rate, per convention divide by 100)
  const rhoCall = K * T * discountFactor * Nd2 / 100;
  const rhoPut = -K * T * discountFactor * NNegd2 / 100;

  return {
    d1: round(d1, 6),
    d2: round(d2, 6),
    callValue: round(callValue, 4),
    putValue: round(putValue, 4),
    delta: {
      call: round(deltaCall, 6),
      put: round(deltaPut, 6),
    },
    gamma: round(gamma, 6),
    theta: {
      call: round(thetaCall, 6),
      put: round(thetaPut, 6),
    },
    vega: round(vega, 4),
    rho: {
      call: round(rhoCall, 4),
      put: round(rhoPut, 4),
    },
  };
}

/**
 * IFRS 9 Expected Credit Loss calculation across the three-stage model.
 *
 * Simplified ECL = PD x LGD x EAD per stage.
 *
 * @param {Object}   params
 * @param {Object[]} params.stages - array of { pd, lgd, ead } per stage (decimals for pd/lgd)
 * @returns {Object} { stageResults, totalECL }
 */
export function calcECL({ stages }) {
  if (!stages || stages.length === 0) {
    throw new Error('ECL: at least one stage must be provided.');
  }

  const stageResults = stages.map((s, i) => {
    const { pd, lgd, ead } = s;

    if (pd < 0 || pd > 1) {
      throw new Error(`ECL Stage ${i + 1}: PD must be between 0 and 1.`);
    }
    if (lgd < 0 || lgd > 1) {
      throw new Error(`ECL Stage ${i + 1}: LGD must be between 0 and 1.`);
    }
    if (ead < 0) {
      throw new Error(`ECL Stage ${i + 1}: EAD must be non-negative.`);
    }

    const ecl = pd * lgd * ead;

    return {
      stage: i + 1,
      pd: round(pd, 6),
      lgd: round(lgd, 6),
      ead: round(ead, 2),
      ecl: round(ecl, 2),
    };
  });

  const totalECL = stageResults.reduce((sum, sr) => sum + sr.ecl, 0);

  return {
    stageResults,
    totalECL: round(totalECL, 2),
  };
}

/**
 * IFRS 15 Revenue Recognition — 5-step model checklist and guidance.
 *
 * Returns a structured template that can be used as an audit working paper
 * or engagement checklist for evaluating revenue recognition policies.
 *
 * @returns {Object} { steps }
 */
export function calcIFRS15Revenue() {
  return {
    standard: 'IFRS 15',
    title: 'Revenue from Contracts with Customers — 5-Step Model',
    steps: [
      {
        step: 1,
        title: 'Identify the Contract with a Customer',
        reference: 'IFRS 15.9-16',
        criteria: [
          'The parties have approved the contract and are committed to their obligations.',
          'Each party\'s rights regarding goods or services to be transferred can be identified.',
          'The payment terms for goods or services to be transferred can be identified.',
          'The contract has commercial substance (i.e., the risk, timing, or amount of future cash flows is expected to change).',
          'It is probable that the entity will collect the consideration to which it is entitled.',
        ],
        guidance:
          'A contract can be written, oral, or implied by customary business practices. ' +
          'If a contract does not meet all five criteria, consideration received is recognised ' +
          'as a liability until the criteria are met or specific conditions in IFRS 15.15 are satisfied. ' +
          'Contract modifications are assessed under IFRS 15.18-21.',
      },
      {
        step: 2,
        title: 'Identify the Performance Obligations in the Contract',
        reference: 'IFRS 15.22-30',
        criteria: [
          'The good or service is distinct — the customer can benefit from it on its own or together with other readily available resources (IFRS 15.27a).',
          'The promise to transfer the good or service is separately identifiable from other promises in the contract (IFRS 15.27b).',
          'A series of distinct goods or services that are substantially the same and have the same pattern of transfer is a single performance obligation.',
        ],
        guidance:
          'Factors indicating promises are NOT separately identifiable include: ' +
          '(a) the entity provides a significant integration service, ' +
          '(b) one or more goods/services significantly modify or customise another, or ' +
          '(c) the goods/services are highly interdependent or interrelated. ' +
          'Shipping and handling activities may be fulfilment activities rather than performance obligations.',
      },
      {
        step: 3,
        title: 'Determine the Transaction Price',
        reference: 'IFRS 15.47-72',
        criteria: [
          'Consider the effects of variable consideration (IFRS 15.50-58) and apply the constraint (IFRS 15.56-58).',
          'Assess whether a significant financing component exists (IFRS 15.60-65).',
          'Account for non-cash consideration at fair value (IFRS 15.66-69).',
          'Reduce the transaction price by consideration payable to the customer, unless payment is for a distinct good or service (IFRS 15.70-72).',
        ],
        guidance:
          'Variable consideration is estimated using either the expected value (probability-weighted) ' +
          'or the most likely amount method — whichever better predicts the amount of consideration. ' +
          'The constraint requires that variable consideration is included only to the extent it is ' +
          'highly probable that a significant reversal of cumulative revenue will not occur.',
      },
      {
        step: 4,
        title: 'Allocate the Transaction Price to Performance Obligations',
        reference: 'IFRS 15.73-90',
        criteria: [
          'Allocate on the basis of relative standalone selling prices (SSP) (IFRS 15.74-76).',
          'Determine SSP using observable evidence; if not directly observable, estimate using adjusted market assessment, expected cost plus margin, or residual approach (IFRS 15.77-80).',
          'Allocate discounts and variable consideration to specific performance obligations when criteria in IFRS 15.81-86 are met.',
          'Changes in transaction price after inception are allocated on the same basis as at inception (IFRS 15.87-90).',
        ],
        guidance:
          'The residual approach is permitted only when the SSP is highly variable or uncertain. ' +
          'A discount is allocated entirely to one or more (but not all) performance obligations ' +
          'only if specific conditions in IFRS 15.82 are met.',
      },
      {
        step: 5,
        title: 'Recognise Revenue When (or As) Performance Obligations Are Satisfied',
        reference: 'IFRS 15.31-45',
        criteria: [
          'Determine whether each performance obligation is satisfied over time (IFRS 15.35-37) or at a point in time (IFRS 15.38).',
          'For over-time recognition, select an appropriate method for measuring progress: output method or input method (IFRS 15.39-45).',
          'For point-in-time recognition, evaluate indicators of transfer of control: present right to payment, legal title, physical possession, risks and rewards, customer acceptance (IFRS 15.38).',
        ],
        guidance:
          'A performance obligation is satisfied over time if ONE of the following is met: ' +
          '(a) the customer simultaneously receives and consumes the benefits, ' +
          '(b) the entity\'s performance creates or enhances an asset controlled by the customer, or ' +
          '(c) the entity\'s performance does not create an asset with an alternative use and the entity ' +
          'has an enforceable right to payment for performance completed to date. ' +
          'If none of these criteria are met, revenue is recognised at a point in time.',
      },
    ],
  };
}


// ---------------------------------------------------------------------------
// INTERNAL UTILITY
// ---------------------------------------------------------------------------

/**
 * Rounds a number to the specified number of decimal places.
 * @param {number} value - the number to round
 * @param {number} dp    - decimal places
 * @returns {number}
 */
function round(value, dp) {
  const factor = Math.pow(10, dp);
  return Math.round(value * factor) / factor;
}
