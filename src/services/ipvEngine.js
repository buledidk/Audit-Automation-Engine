/**
 * IPV Engine — Independent Price Verification for Investment Valuation
 * IFRS 13 Fair Value Measurement, IFRS 9 Financial Instruments, IAS 40 Investment Property
 *
 * Supports: Listed (L1), Semi-Listed (L2), Unlisted (L3), Loans, Derivatives, Investment Property
 */

// IFRS 13 Fair Value Hierarchy
const IFRS_LEVELS = {
  1: { label: 'Level 1', description: 'Quoted prices in active markets' },
  2: { label: 'Level 2', description: 'Observable inputs other than quoted prices' },
  3: { label: 'Level 3', description: 'Unobservable inputs (entity-specific)' }
};

// WACC calculation helper
function calculateWACC({ equityWeight, debtWeight, costOfEquity, costOfDebt, taxRate }) {
  return (equityWeight * costOfEquity) + (debtWeight * costOfDebt * (1 - taxRate));
}

// DCF: Discount future cash flows
function discountCashFlows(cashFlows, discountRate, terminalGrowthRate) {
  let pv = 0;
  const n = cashFlows.length;
  cashFlows.forEach((cf, i) => {
    pv += cf / Math.pow(1 + discountRate, i + 1);
  });
  // Terminal value (Gordon Growth Model)
  if (n > 0 && terminalGrowthRate < discountRate) {
    const lastCF = cashFlows[n - 1];
    const tv = (lastCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
    pv += tv / Math.pow(1 + discountRate, n);
  }
  return Math.round(pv * 100) / 100;
}

export class IPVEngine {
  constructor() {
    this._portfolio = [];
    this._exceptions = [];
    this._tolerancePercent = 5; // 5% variance threshold
  }

  /**
   * Level 1: Verify listed price against market data
   */
  verifyListedPrice(instrument) {
    const { ticker, quantity, bookValue, marketPrice, currency = 'GBP' } = instrument;
    const fairValue = Math.round(quantity * marketPrice * 100) / 100;
    const variance = bookValue > 0 ? Math.round(((fairValue - bookValue) / bookValue) * 10000) / 100 : 0;
    const exception = Math.abs(variance) > this._tolerancePercent;

    const result = {
      ticker, quantity, marketPrice, currency, fairValue, bookValue, variance,
      ifrsLevel: 1, methodology: 'Quoted market price (active market)',
      exception, exceptionReason: exception ? `Variance ${variance}% exceeds ${this._tolerancePercent}% threshold` : null,
      verifiedAt: new Date().toISOString()
    };

    if (exception) this._exceptions.push(result);
    return result;
  }

  /**
   * Level 2: Semi-listed instruments — median of dealer quotes
   */
  valueSemiListed(instrument) {
    const { name, quantity, bookValue, quotes = [], currency = 'GBP' } = instrument;
    const sorted = [...quotes].sort((a, b) => a - b);
    const medianQuote = sorted.length > 0
      ? sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]
      : 0;

    const fairValue = Math.round(quantity * medianQuote * 100) / 100;
    const spread = sorted.length > 1 ? sorted[sorted.length - 1] - sorted[0] : 0;
    const spreadPercent = medianQuote > 0 ? Math.round((spread / medianQuote) * 10000) / 100 : 0;
    const variance = bookValue > 0 ? Math.round(((fairValue - bookValue) / bookValue) * 10000) / 100 : 0;
    const exception = Math.abs(variance) > this._tolerancePercent || spreadPercent > 10;

    const result = {
      name, quantity, medianQuote, currency, fairValue, bookValue, variance,
      spreadAnalysis: { min: sorted[0], max: sorted[sorted.length - 1], spread, spreadPercent, quotesUsed: quotes.length },
      ifrsLevel: 2, methodology: 'Median of dealer quotes (observable inputs)',
      exception, exceptionReason: exception ? `Variance ${variance}% or spread ${spreadPercent}%` : null,
      verifiedAt: new Date().toISOString()
    };

    if (exception) this._exceptions.push(result);
    return result;
  }

  /**
   * Level 3: Unlisted instruments — DCF + Multiples
   */
  valueUnlisted(instrument) {
    const {
      name, bookValue, currency = 'GBP',
      cashFlows = [], discountRate = 0.10, terminalGrowthRate = 0.02,
      ebitda, revenueMultiple, ebitdaMultiple,
      revenue, comparableMultiples = {}
    } = instrument;

    // DCF Valuation
    const dcfValue = cashFlows.length > 0
      ? discountCashFlows(cashFlows, discountRate, terminalGrowthRate)
      : null;

    // Multiples Valuation
    let multiplesValue = null;
    if (ebitda && ebitdaMultiple) {
      multiplesValue = Math.round(ebitda * ebitdaMultiple * 100) / 100;
    } else if (revenue && revenueMultiple) {
      multiplesValue = Math.round(revenue * revenueMultiple * 100) / 100;
    }

    // Fair value: average of available methods
    const values = [dcfValue, multiplesValue].filter(v => v !== null);
    const fairValue = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 100) / 100 : bookValue;
    const variance = bookValue > 0 ? Math.round(((fairValue - bookValue) / bookValue) * 10000) / 100 : 0;
    const exception = Math.abs(variance) > this._tolerancePercent;

    const result = {
      name, currency, fairValue, bookValue, variance,
      dcfResult: dcfValue !== null ? { value: dcfValue, discountRate, terminalGrowthRate, periods: cashFlows.length } : null,
      multiplesResult: multiplesValue !== null ? { value: multiplesValue, method: ebitdaMultiple ? 'EV/EBITDA' : 'EV/Revenue' } : null,
      ifrsLevel: 3, methodology: 'DCF and/or comparable multiples (unobservable inputs)',
      exception, exceptionReason: exception ? `Variance ${variance}% exceeds threshold` : null,
      verifiedAt: new Date().toISOString()
    };

    if (exception) this._exceptions.push(result);
    return result;
  }

  /**
   * Loan valuation — Amortised cost with ECL provision (IFRS 9)
   */
  valueLoan(loan) {
    const {
      name, principal, interestRate, termYears, bookValue,
      pdPercent = 1, lgdPercent = 45, ead, currency = 'GBP',
      stage = 1 // IFRS 9 stage: 1=12mo ECL, 2=lifetime, 3=credit-impaired
    } = loan;

    // Simple amortised cost
    const amortisedCost = principal; // Simplified: assuming measured at par

    // ECL: PD × LGD × EAD
    const eclBase = (ead || principal) * (pdPercent / 100) * (lgdPercent / 100);
    const eclProvision = stage === 1
      ? Math.round(eclBase * 100) / 100  // 12-month ECL
      : Math.round(eclBase * termYears * 100) / 100; // Lifetime ECL

    const netCarryingAmount = Math.round((amortisedCost - eclProvision) * 100) / 100;
    const variance = bookValue > 0 ? Math.round(((netCarryingAmount - bookValue) / bookValue) * 10000) / 100 : 0;

    return {
      name, currency, amortisedCost, eclProvision, netCarryingAmount,
      bookValue, variance, ifrs9Stage: stage,
      pdPercent, lgdPercent, ead: ead || principal,
      methodology: `IFRS 9 Stage ${stage} — ${stage === 1 ? '12-month' : 'lifetime'} ECL`,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Derivative valuation — Mark to market
   */
  valueDerivative(derivative) {
    const {
      name, notional, strikePrice, currentPrice, type = 'forward',
      maturityDate, bookValue, currency = 'GBP'
    } = derivative;

    let markToMarket = 0;
    let methodology = '';

    switch (type) {
      case 'forward':
        markToMarket = Math.round((currentPrice - strikePrice) * notional * 100) / 100;
        methodology = 'Forward contract: (spot - strike) × notional';
        break;
      case 'swap':
        markToMarket = Math.round(notional * (currentPrice - strikePrice) * 100) / 100;
        methodology = 'Interest rate swap: notional × (current rate - fixed rate)';
        break;
      case 'option':
        // Simplified intrinsic value only (Black-Scholes would need volatility)
        markToMarket = Math.max(0, (currentPrice - strikePrice)) * notional;
        markToMarket = Math.round(markToMarket * 100) / 100;
        methodology = 'Option intrinsic value (simplified)';
        break;
      default:
        markToMarket = bookValue;
        methodology = 'Carried at book value (methodology TBD)';
    }

    const variance = bookValue > 0 ? Math.round(((markToMarket - bookValue) / bookValue) * 10000) / 100 : 0;

    return {
      name, type, notional, strikePrice, currentPrice, currency,
      fairValue: markToMarket, bookValue, variance, maturityDate,
      methodology, ifrsLevel: type === 'option' ? 2 : 2,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Investment property valuation (IAS 40)
   */
  valueInvestmentProperty(property) {
    const {
      name, bookValue, currency = 'GBP',
      comparables = [], // [{ pricePerSqft, sqft }]
      annualRent, yieldRate = 0.06, sqft
    } = property;

    // Method 1: Comparable approach
    let comparablesValue = null;
    if (comparables.length > 0 && sqft) {
      const avgPricePerSqft = comparables.reduce((sum, c) => sum + c.pricePerSqft, 0) / comparables.length;
      comparablesValue = Math.round(avgPricePerSqft * sqft * 100) / 100;
    }

    // Method 2: Yield capitalisation
    let yieldCapValue = null;
    if (annualRent && yieldRate > 0) {
      yieldCapValue = Math.round((annualRent / yieldRate) * 100) / 100;
    }

    const values = [comparablesValue, yieldCapValue].filter(v => v !== null);
    const fairValue = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 100) / 100 : bookValue;
    const variance = bookValue > 0 ? Math.round(((fairValue - bookValue) / bookValue) * 10000) / 100 : 0;
    const exception = Math.abs(variance) > this._tolerancePercent;

    return {
      name, currency, fairValue, bookValue, variance,
      comparablesValue, yieldCapValue, sqft, annualRent, yieldRate,
      methodology: 'IAS 40: Comparables approach and/or yield capitalisation',
      exception, exceptionReason: exception ? `Variance ${variance}%` : null,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Build portfolio summary with IFRS 13 hierarchy breakdown
   */
  buildPortfolioSummary(instruments) {
    const hierarchyBreakdown = { 1: { count: 0, totalFV: 0, totalBV: 0 }, 2: { count: 0, totalFV: 0, totalBV: 0 }, 3: { count: 0, totalFV: 0, totalBV: 0 } };
    let totalFV = 0;
    let totalBV = 0;
    const exceptions = [];

    instruments.forEach(inst => {
      let result;
      switch (inst.type) {
        case 'listed': result = this.verifyListedPrice(inst); break;
        case 'semi-listed': result = this.valueSemiListed(inst); break;
        case 'unlisted': result = this.valueUnlisted(inst); break;
        case 'loan': result = this.valueLoan(inst); break;
        case 'derivative': result = this.valueDerivative(inst); break;
        case 'property': result = this.valueInvestmentProperty(inst); break;
        default: result = { fairValue: inst.bookValue || 0, bookValue: inst.bookValue || 0, ifrsLevel: 3 };
      }

      const level = result.ifrsLevel || 3;
      const fv = result.fairValue || result.netCarryingAmount || 0;
      const bv = result.bookValue || 0;

      hierarchyBreakdown[level].count++;
      hierarchyBreakdown[level].totalFV += fv;
      hierarchyBreakdown[level].totalBV += bv;
      totalFV += fv;
      totalBV += bv;

      if (result.exception) exceptions.push(result);
    });

    // Round
    Object.values(hierarchyBreakdown).forEach(h => {
      h.totalFV = Math.round(h.totalFV * 100) / 100;
      h.totalBV = Math.round(h.totalBV * 100) / 100;
    });

    return {
      totalFV: Math.round(totalFV * 100) / 100,
      totalBV: Math.round(totalBV * 100) / 100,
      totalVariance: totalBV > 0 ? Math.round(((totalFV - totalBV) / totalBV) * 10000) / 100 : 0,
      hierarchyBreakdown,
      exceptions,
      instrumentCount: instruments.length,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Export portfolio to Excel-compatible structure
   */
  exportToExcel(portfolio) {
    const headers = ['Name', 'Type', 'IFRS Level', 'Book Value', 'Fair Value', 'Variance %', 'Methodology', 'Exception'];
    const rows = portfolio.map(inst => {
      let result;
      switch (inst.type) {
        case 'listed': result = this.verifyListedPrice(inst); break;
        case 'semi-listed': result = this.valueSemiListed(inst); break;
        case 'unlisted': result = this.valueUnlisted(inst); break;
        case 'loan': result = this.valueLoan(inst); break;
        case 'derivative': result = this.valueDerivative(inst); break;
        case 'property': result = this.valueInvestmentProperty(inst); break;
        default: result = { fairValue: inst.bookValue, bookValue: inst.bookValue, variance: 0, methodology: 'N/A', exception: false };
      }

      return [
        inst.name || inst.ticker || 'Unknown',
        inst.type,
        result.ifrsLevel || 3,
        result.bookValue,
        result.fairValue || result.netCarryingAmount,
        result.variance,
        result.methodology,
        result.exception ? 'YES' : 'No'
      ];
    });

    return { headers, rows, sheetName: 'IPV Portfolio' };
  }
}

export default IPVEngine;
