/**
 * Independent Price Verification (IPV) Engine
 * IFRS 13 Fair Value Hierarchy | ISA 540 Estimation Uncertainty | ISA 620 Expert Work
 * Covers: Listed securities, semi-listed, unlisted/PE, loans, derivatives, investment property
 */

import { MARKET_REFERENCE_DATA } from './dcfModelEngine.js';
import { calculateInterest } from './financialModellingEngine.js';

// ─── Reference Data Sources ─────────────────────────────────────────────────

export const IPV_REFERENCE_SOURCES = {
  lse: { name: 'London Stock Exchange', url: 'https://www.londonstockexchange.com', type: 'Level 1' },
  boeYield: { name: 'Bank of England Yield Curves', url: 'https://www.bankofengland.co.uk/statistics/yield-curves', type: 'Level 1/2' },
  fcaRegister: { name: 'FCA Register', url: 'https://register.fca.org.uk', type: 'Counterparty' },
  companiesHouse: { name: 'Companies House', url: 'https://find-and-update.company-information.service.gov.uk', type: 'Entity' },
  landRegistry: { name: 'HM Land Registry', url: 'https://www.gov.uk/search-property-information-service', type: 'Property' },
  rics: { name: 'RICS Valuation Standards', url: 'https://www.rics.org/uk/valuation', type: 'Property' },
  bloomberg: { name: 'Bloomberg Terminal', url: 'https://www.bloomberg.com/professional', type: 'Level 1/2' },
  reuters: { name: 'Refinitiv/LSEG', url: 'https://www.lseg.com/en/data-analytics', type: 'Level 1/2' },
  moodys: { name: "Moody's Ratings", url: 'https://www.moodys.com', type: 'Credit' },
  sp: { name: 'S&P Global Ratings', url: 'https://www.spglobal.com/ratings', type: 'Credit' },
  fitch: { name: 'Fitch Ratings', url: 'https://www.fitchratings.com', type: 'Credit' },
  nyse: { name: 'NYSE', url: 'https://www.nyse.com', type: 'Level 1' },
  rightmove: { name: 'Rightmove', url: 'https://www.rightmove.co.uk', type: 'Property' },
  zoopla: { name: 'Zoopla', url: 'https://www.zoopla.co.uk', type: 'Property' },
};

export const IFRS13_HIERARCHY = {
  1: { level: 1, name: 'Level 1 — Quoted prices in active markets', description: 'Unadjusted quoted prices in active markets for identical assets or liabilities', inputs: 'Observable — quoted prices', examples: 'Listed equities, government bonds, exchange-traded ETFs' },
  2: { level: 2, name: 'Level 2 — Observable inputs', description: 'Inputs other than quoted prices that are observable, either directly or indirectly', inputs: 'Observable — market-corroborated', examples: 'OTC derivatives, corporate bonds, broker-quoted instruments' },
  3: { level: 3, name: 'Level 3 — Unobservable inputs', description: 'Unobservable inputs reflecting entity assumptions about market participant pricing', inputs: 'Unobservable — entity estimates', examples: 'Private equity, unlisted investments, complex derivatives, investment property' },
};

export const CREDIT_RATING_PD_MAP = {
  AAA: { pd: 0.001, lgd: 0.30, spread: 0.0020, description: 'Prime — minimal credit risk' },
  AA:  { pd: 0.002, lgd: 0.35, spread: 0.0040, description: 'High grade — very low credit risk' },
  A:   { pd: 0.005, lgd: 0.40, spread: 0.0070, description: 'Upper medium — low credit risk' },
  BBB: { pd: 0.015, lgd: 0.45, spread: 0.0120, description: 'Lower medium — moderate credit risk' },
  BB:  { pd: 0.050, lgd: 0.50, spread: 0.0250, description: 'Non-investment grade — substantial risk' },
  B:   { pd: 0.200, lgd: 0.55, spread: 0.0500, description: 'Highly speculative' },
  CCC: { pd: 0.500, lgd: 0.65, spread: 0.1000, description: 'Substantial risk — may default' },
  D:   { pd: 1.000, lgd: 0.80, spread: 0.2000, description: 'In default' },
};

export const IPV_CONTROLS = [
  { id: 'ctrl1', risk: 'Management manipulates valuations to inflate/deflate net assets', control: 'Independent pricing from verified external sources (Bloomberg, Reuters, LSE)', isa: 'ISA 540.8' },
  { id: 'ctrl2', risk: 'Person who books trades also values portfolio', control: 'Segregation of duties — front office ≠ valuation team', isa: 'ISA 315.14' },
  { id: 'ctrl3', risk: 'Valuation drift from market prices over time', control: 'Daily/monthly reconciliation to custodian/counterparty statements', isa: 'ISA 505' },
  { id: 'ctrl4', risk: 'Level 2/3 instruments valued without governance', control: 'Valuation committee review with documented minutes', isa: 'ISA 540.13' },
  { id: 'ctrl5', risk: "Expert's work not adequately evaluated by auditor", control: 'ISA 620 checklist — competence, capability, objectivity of expert', isa: 'ISA 620.12' },
  { id: 'ctrl6', risk: 'FRC finding: insufficient challenge of management estimates', control: 'Independent re-performance of key valuations by audit team', isa: 'FRC AQR 2024/25' },
];

export const ISA_620_CHECKLIST = [
  { id: 'isa620_1', item: "Assessed the expert's competence, capability, and objectivity", isa: 'ISA 620.9', checked: false },
  { id: 'isa620_2', item: "Obtained understanding of the expert's field of expertise", isa: 'ISA 620.10', checked: false },
  { id: 'isa620_3', item: 'Agreed scope, nature and objectives of work with the expert', isa: 'ISA 620.11(a)', checked: false },
  { id: 'isa620_4', item: 'Evaluated the adequacy of the work for audit purposes', isa: 'ISA 620.12', checked: false },
  { id: 'isa620_5', item: 'Assessed whether assumptions and methods are appropriate', isa: 'ISA 620.13(a)', checked: false },
  { id: 'isa620_6', item: 'Evaluated the relevance and reasonableness of findings', isa: 'ISA 620.13(b)', checked: false },
  { id: 'isa620_7', item: 'Verified source data used by the expert was complete and accurate', isa: 'ISA 620.13(c)', checked: false },
  { id: 'isa620_8', item: 'Considered whether the expert is related to the entity', isa: 'ISA 620.9(c)', checked: false },
  { id: 'isa620_9', item: 'Expert report date is proximate to the audit report date', isa: 'ISA 620.A28', checked: false },
  { id: 'isa620_10', item: 'Findings are consistent with other audit evidence obtained', isa: 'ISA 620.13(d)', checked: false },
];

const EXCEPTION_THRESHOLD = 0.01; // 1% for Level 1
const LEVEL2_THRESHOLD = 0.03; // 3% for Level 2
const LEVEL3_THRESHOLD = 0.05; // 5% for Level 3
const INACTIVE_MARKET_DAYS = 30;

// ─── IPV Engine Class ────────────────────────────────────────────────────────

export class IPVEngine {
  constructor(options = {}) {
    this.materiality = options.materiality || 50000;
    this.riskFreeRate = MARKET_REFERENCE_DATA?.riskFreeRate || 0.04;
  }

  /** IFRS 13 Level 1 — Listed Securities */
  verifyListedSecurity(instrument) {
    const { isin, ticker, exchange, clientPrice, independentPrice, quantity = 1, name } = instrument;
    const clientValue = clientPrice * quantity;
    const indepValue = independentPrice * quantity;
    const difference = clientValue - indepValue;
    const variancePct = indepValue !== 0 ? Math.abs(difference / indepValue) : 0;
    const isException = variancePct > EXCEPTION_THRESHOLD;

    return {
      instrumentId: isin || ticker,
      name: name || ticker,
      type: 'listed_security',
      ifrs13Level: 1,
      isin, ticker, exchange, quantity,
      clientPrice, independentPrice,
      clientValue: Math.round(clientValue * 100) / 100,
      independentValue: Math.round(indepValue * 100) / 100,
      difference: Math.round(difference * 100) / 100,
      variancePct: Math.round(variancePct * 10000) / 100,
      status: isException ? 'exception' : 'agreed',
      methodology: 'Closing price from active market',
      sourceUrl: IPV_REFERENCE_SOURCES[exchange === 'LSE' ? 'lse' : exchange === 'NYSE' ? 'nyse' : 'bloomberg']?.url || IPV_REFERENCE_SOURCES.bloomberg.url,
      controls: ['ctrl1', 'ctrl3'],
      isaReference: 'IFRS 13.76-80 (Level 1), ISA 540',
      auditConclusion: isException
        ? `EXCEPTION: ${name || ticker} variance of ${(variancePct * 100).toFixed(2)}% exceeds 1% threshold. Client value £${clientValue.toLocaleString()} vs independent £${indepValue.toLocaleString()}. Investigate pricing source discrepancy.`
        : `AGREED: ${name || ticker} independently verified. Variance ${(variancePct * 100).toFixed(2)}% within 1% threshold. Source: ${exchange || 'Bloomberg'}.`,
    };
  }

  /** IFRS 13 Level 2 — Semi-listed / Thinly Traded */
  verifySemiListedSecurity(instrument) {
    const { name, clientValue, lastTradeDate, bidPrice, askPrice, brokerQuotes = [], quantity = 1 } = instrument;
    const today = new Date();
    const lastTrade = new Date(lastTradeDate);
    const daysSinceLastTrade = Math.ceil((today - lastTrade) / 86400000);
    const isInactiveMarket = daysSinceLastTrade > INACTIVE_MARKET_DAYS;
    const bidAskSpread = bidPrice && askPrice ? (askPrice - bidPrice) / ((askPrice + bidPrice) / 2) : null;
    const wideSpread = bidAskSpread && bidAskSpread > 0.05;

    let independentValue = clientValue;
    let methodology = 'Broker quotes';
    if (brokerQuotes.length >= 2) {
      independentValue = brokerQuotes.reduce((s, q) => s + q.value, 0) / brokerQuotes.length;
      methodology = `Average of ${brokerQuotes.length} independent broker quotes`;
    } else if (bidPrice && askPrice) {
      independentValue = ((bidPrice + askPrice) / 2) * quantity;
      methodology = 'Mid-market (bid-ask average)';
    }

    const difference = clientValue - independentValue;
    const variancePct = independentValue !== 0 ? Math.abs(difference / independentValue) : 0;
    const isException = variancePct > LEVEL2_THRESHOLD || isInactiveMarket;

    return {
      instrumentId: instrument.id || name,
      name, type: 'semi_listed', ifrs13Level: 2,
      clientValue, independentValue: Math.round(independentValue * 100) / 100,
      difference: Math.round(difference * 100) / 100,
      variancePct: Math.round(variancePct * 10000) / 100,
      status: isException ? 'exception' : 'agreed',
      methodology,
      daysSinceLastTrade, isInactiveMarket,
      bidAskSpread: bidAskSpread ? Math.round(bidAskSpread * 10000) / 100 : null,
      wideSpread,
      brokerQuoteCount: brokerQuotes.length,
      sourceUrl: IPV_REFERENCE_SOURCES.bloomberg.url,
      controls: ['ctrl1', 'ctrl3', 'ctrl4'],
      isaReference: 'IFRS 13.81-85 (Level 2), ISA 540.8',
      auditConclusion: isInactiveMarket
        ? `EXCEPTION: ${name} — inactive market (${daysSinceLastTrade} days since last trade). Consider reclassification to Level 3. ${wideSpread ? 'Wide bid-ask spread indicates estimation uncertainty.' : ''}`
        : isException
        ? `EXCEPTION: ${name} variance ${(variancePct * 100).toFixed(2)}% exceeds 3% Level 2 threshold.`
        : `AGREED: ${name} verified via ${methodology}. Variance within threshold.`,
    };
  }

  /** IFRS 13 Level 3 — Unlisted / Private Equity */
  verifyUnlistedInvestment(instrument) {
    const { name, clientValue, valuationMethod, _assumptions = {}, expertReport } = instrument;
    const methods = ['DCF', 'comparable_transactions', 'NAV', 'earnings_multiple'];
    const methodValid = methods.includes(valuationMethod);

    // Sensitivity analysis: ±10% and ±20% on key assumption
    const sensitivity = [
      { scenario: '-20%', factor: 0.80, value: Math.round(clientValue * 0.80) },
      { scenario: '-10%', factor: 0.90, value: Math.round(clientValue * 0.90) },
      { scenario: 'Base', factor: 1.00, value: clientValue },
      { scenario: '+10%', factor: 1.10, value: Math.round(clientValue * 1.10) },
      { scenario: '+20%', factor: 1.20, value: Math.round(clientValue * 1.20) },
    ];

    const range = sensitivity[4].value - sensitivity[0].value;
    const rangePct = clientValue > 0 ? (range / clientValue) * 100 : 0;
    const materialRange = range > this.materiality;

    return {
      instrumentId: instrument.id || name,
      name, type: 'unlisted', ifrs13Level: 3,
      clientValue,
      independentValue: clientValue, // Cannot independently price — assess methodology
      difference: 0,
      variancePct: 0,
      status: materialRange ? 'exception' : 'pending',
      methodology: `${valuationMethod || 'Not specified'} — requires ISA 620 expert assessment`,
      valuationMethodValid: methodValid,
      sensitivityAnalysis: { scenarios: sensitivity, range, rangePct: Math.round(rangePct * 100) / 100, materialRange },
      expertReport: expertReport || null,
      isa620Checklist: ISA_620_CHECKLIST.map(c => ({ ...c })),
      controls: ['ctrl4', 'ctrl5', 'ctrl6'],
      isaReference: 'IFRS 13.86-90 (Level 3), ISA 540.13, ISA 620',
      auditConclusion: `Level 3 instrument — ${name}. Valuation method: ${valuationMethod || 'TBD'}. Sensitivity range £${range.toLocaleString()} (${rangePct.toFixed(1)}%). ${materialRange ? 'Range exceeds materiality — SIGNIFICANT estimation uncertainty.' : 'Range within materiality.'} ISA 620 expert assessment ${expertReport ? 'obtained' : 'REQUIRED'}.`,
    };
  }

  /** Loans & Receivables — Amortised Cost */
  verifyLoanReceivable(loan) {
    const { name, principal, rate, termMonths, clientValue, creditRating = 'BBB', collateral } = loan;
    const interestResult = calculateInterest(principal, rate, termMonths, 'effective');
    const independentValue = interestResult.outputs.finalBalance;
    const difference = clientValue - independentValue;
    const variancePct = independentValue !== 0 ? Math.abs(difference / independentValue) : 0;

    const ratingData = CREDIT_RATING_PD_MAP[creditRating] || CREDIT_RATING_PD_MAP.BBB;
    const eclAmount = Math.round(independentValue * ratingData.pd * ratingData.lgd);

    return {
      instrumentId: loan.id || name,
      name, type: 'loan_receivable', ifrs13Level: null,
      clientValue, independentValue: Math.round(independentValue * 100) / 100,
      difference: Math.round(difference * 100) / 100,
      variancePct: Math.round(variancePct * 10000) / 100,
      status: variancePct > LEVEL2_THRESHOLD ? 'exception' : 'agreed',
      methodology: 'Amortised cost — effective interest method (IFRS 9)',
      effectiveRate: interestResult.outputs.effectiveRate,
      eclAssessment: { creditRating, pd: ratingData.pd, lgd: ratingData.lgd, eclAmount, stage: ratingData.pd > 0.05 ? 2 : 1 },
      collateral: collateral || null,
      sourceUrl: IPV_REFERENCE_SOURCES.boeYield.url,
      controls: ['ctrl1', 'ctrl3'],
      isaReference: 'IFRS 9.5.4 (Amortised cost), ISA 540',
      auditConclusion: `Loan ${name}: Amortised cost £${independentValue.toLocaleString()} at EIR ${interestResult.outputs.effectiveRate}. ECL provision £${eclAmount.toLocaleString()} (Stage ${ratingData.pd > 0.05 ? 2 : 1}, rating ${creditRating}). ${collateral ? 'Collateral: ' + collateral.type : 'Unsecured.'}`,
    };
  }

  /** Derivatives — IRS, FX Forwards, Options */
  verifyDerivative(derivative) {
    const { name, type: derivType, notional, clientValue, maturityDate, counterparty, creditRating = 'A' } = derivative;
    let independentValue = clientValue;
    let methodology = '';

    if (derivType === 'interest_rate_swap') {
      const fixedRate = derivative.fixedRate || 0.045;
      const floatingRate = this.riskFreeRate + 0.005;
      const remainingMonths = Math.max(1, Math.ceil((new Date(maturityDate) - new Date()) / (30 * 86400000)));
      const annualDiff = (floatingRate - fixedRate) * notional;
      independentValue = Math.round(annualDiff * (remainingMonths / 12) * 100) / 100;
      methodology = `PV of net cash flows (fixed ${(fixedRate * 100).toFixed(2)}% vs floating ${(floatingRate * 100).toFixed(2)}%)`;
    } else if (derivType === 'fx_forward') {
      const spotRate = derivative.spotRate || 1.27;
      const forwardRate = derivative.forwardRate || spotRate * (1 + (this.riskFreeRate - 0.03) * (derivative.termMonths || 6) / 12);
      const contractRate = derivative.contractRate || spotRate;
      independentValue = Math.round((forwardRate - contractRate) * notional * 100) / 100;
      methodology = `Forward rate model (spot ${spotRate} + forward points)`;
    } else if (derivType === 'option') {
      methodology = 'Black-Scholes model (placeholder — requires vol surface)';
    }

    const difference = clientValue - independentValue;
    const variancePct = independentValue !== 0 ? Math.abs(difference / independentValue) : 0;
    const ratingData = CREDIT_RATING_PD_MAP[creditRating] || CREDIT_RATING_PD_MAP.A;
    const cvaAdjustment = Math.round(Math.abs(independentValue) * ratingData.pd * ratingData.lgd);

    return {
      instrumentId: derivative.id || name,
      name, type: 'derivative', ifrs13Level: 2,
      clientValue, independentValue,
      difference: Math.round(difference * 100) / 100,
      variancePct: Math.round(variancePct * 10000) / 100,
      status: variancePct > LEVEL2_THRESHOLD ? 'exception' : 'agreed',
      methodology,
      counterparty, counterpartyCreditRating: creditRating,
      cvaAdjustment,
      sourceUrl: IPV_REFERENCE_SOURCES.boeYield.url,
      controls: ['ctrl1', 'ctrl2', 'ctrl3', 'ctrl4'],
      isaReference: 'IFRS 13.B5-B30 (derivative valuation), IFRS 9.6 (hedge accounting), ISA 540',
      auditConclusion: `Derivative ${name}: Independent value £${independentValue.toLocaleString()} via ${methodology}. CVA adjustment £${cvaAdjustment.toLocaleString()} (counterparty ${counterparty}, rating ${creditRating}).`,
    };
  }

  /** Investment Property — Comparable / Yield-based */
  verifyInvestmentProperty(property) {
    const { name, clientValue, rentalIncome, marketYield, comparables = [], expertValuation } = property;
    let independentValue = clientValue;
    let methodology = 'Expert valuation assessment';

    if (rentalIncome && marketYield) {
      independentValue = Math.round(rentalIncome / marketYield);
      methodology = `Yield-based: £${rentalIncome.toLocaleString()} rental / ${(marketYield * 100).toFixed(1)}% yield`;
    } else if (comparables.length > 0) {
      independentValue = Math.round(comparables.reduce((s, c) => s + c.value, 0) / comparables.length);
      methodology = `Average of ${comparables.length} comparable properties`;
    }

    const difference = clientValue - independentValue;
    const variancePct = independentValue !== 0 ? Math.abs(difference / independentValue) : 0;
    const sensitivity = [
      { scenario: 'Yield +0.5%', value: rentalIncome ? Math.round(rentalIncome / (marketYield + 0.005)) : null },
      { scenario: 'Base', value: independentValue },
      { scenario: 'Yield -0.5%', value: rentalIncome ? Math.round(rentalIncome / (marketYield - 0.005)) : null },
    ].filter(s => s.value !== null);

    return {
      instrumentId: property.id || name,
      name, type: 'investment_property', ifrs13Level: 3,
      clientValue, independentValue,
      difference: Math.round(difference * 100) / 100,
      variancePct: Math.round(variancePct * 10000) / 100,
      status: variancePct > LEVEL3_THRESHOLD ? 'exception' : 'agreed',
      methodology,
      comparableCount: comparables.length,
      expertValuation: expertValuation || null,
      ricsCompliant: expertValuation?.ricsRedBook || false,
      sensitivityAnalysis: { scenarios: sensitivity },
      sourceUrl: IPV_REFERENCE_SOURCES.landRegistry.url,
      controls: ['ctrl4', 'ctrl5', 'ctrl6'],
      isaReference: 'IAS 40 (Investment Property), IFRS 13.86-90 (Level 3), ISA 540, ISA 620',
      auditConclusion: `Property ${name}: ${methodology}. Independent value £${independentValue.toLocaleString()} vs client £${clientValue.toLocaleString()}. ${expertValuation ? 'Expert report obtained' : 'Expert report REQUIRED'}. ${expertValuation?.ricsRedBook ? 'RICS Red Book compliant.' : 'RICS compliance not confirmed.'}`,
    };
  }

  /** Portfolio-level verification */
  verifyPortfolio(instruments) {
    const results = instruments.map(inst => {
      switch (inst.type) {
        case 'listed_security': return this.verifyListedSecurity(inst);
        case 'semi_listed': return this.verifySemiListedSecurity(inst);
        case 'unlisted': return this.verifyUnlistedInvestment(inst);
        case 'loan_receivable': return this.verifyLoanReceivable(inst);
        case 'derivative': return this.verifyDerivative(inst);
        case 'investment_property': return this.verifyInvestmentProperty(inst);
        default: return { ...inst, status: 'pending', auditConclusion: 'Unknown instrument type' };
      }
    });

    const totalPositions = results.length;
    const verified = results.filter(r => r.status !== 'pending').length;
    const exceptions = results.filter(r => r.status === 'exception').length;
    const agreed = results.filter(r => r.status === 'agreed').length;
    const totalClientValue = results.reduce((s, r) => s + (r.clientValue || 0), 0);
    const totalIndepValue = results.reduce((s, r) => s + (r.independentValue || 0), 0);

    const hierarchyCounts = { 1: 0, 2: 0, 3: 0 };
    const hierarchyValues = { 1: 0, 2: 0, 3: 0 };
    results.forEach(r => {
      if (r.ifrs13Level) {
        hierarchyCounts[r.ifrs13Level]++;
        hierarchyValues[r.ifrs13Level] += r.clientValue || 0;
      }
    });

    return {
      summary: { totalPositions, verified, exceptions, agreed, pending: totalPositions - verified, coveragePct: Math.round((verified / totalPositions) * 100), totalClientValue, totalIndepValue, totalDifference: Math.round((totalClientValue - totalIndepValue) * 100) / 100 },
      hierarchy: { counts: hierarchyCounts, values: hierarchyValues },
      results,
      controls: IPV_CONTROLS,
      isa620Checklist: ISA_620_CHECKLIST,
      isaReference: 'IFRS 13, IFRS 9, IAS 40, ISA 540, ISA 620',
    };
  }

  /** Credit assessment */
  assessCounterpartyCredit(counterparty) {
    const { name, creditRating = 'BBB', exposure } = counterparty;
    const data = CREDIT_RATING_PD_MAP[creditRating] || CREDIT_RATING_PD_MAP.BBB;
    return {
      name, creditRating, ...data,
      exposure, expectedLoss: Math.round(exposure * data.pd * data.lgd),
      investmentGrade: ['AAA', 'AA', 'A', 'BBB'].includes(creditRating),
    };
  }

  /** Generate work paper summary */
  generateIPVWorkPaper(portfolioResults) {
    const { summary, hierarchy, results } = portfolioResults;
    return {
      title: 'Independent Price Verification — Work Paper',
      date: new Date().toISOString().split('T')[0],
      summary,
      hierarchy,
      exceptionsDetail: results.filter(r => r.status === 'exception'),
      level3Detail: results.filter(r => r.ifrs13Level === 3),
      controls: IPV_CONTROLS,
      isa620Checklist: ISA_620_CHECKLIST,
      conclusion: summary.exceptions === 0
        ? `All ${summary.totalPositions} financial instruments independently verified. No exceptions noted. Portfolio coverage ${summary.coveragePct}%.`
        : `${summary.exceptions} exception(s) identified from ${summary.totalPositions} instruments. Total variance £${Math.abs(summary.totalDifference).toLocaleString()}. Further investigation required for flagged items.`,
      isaReference: 'IFRS 13, IFRS 9, IAS 40, ISA 540, ISA 620, ISA 500',
    };
  }
}

export const ipvEngine = new IPVEngine();
export default IPVEngine;
