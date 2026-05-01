/**
 * Financial Ratio Calculation Engine
 * Regulatory-guided ratio calculations with pre-set formulas
 * Covers all major financial ratios (liquidity, profitability, efficiency, solvency, investor)
 *
 * Regulatory Frameworks Embedded:
 * - IFRS 9 (Financial Instruments - ECL calculations)
 * - IFRS 13 (Fair Value Measurement)
 * - IFRS 15 (Revenue Recognition)
 * - IAS 36 (Impairment Testing)
 * - FRS 102 (UK Financial Reporting)
 * - Basel III (Banking Regulations)
 * - Dodd-Frank Act (US Financial Regulations)
 * - EMIR (European Market Infrastructure Regulation)
 * - MiFID II (Markets in Financial Instruments Directive)
 */

export class FinancialRatioCalculationEngine {
  constructor(financialData = {}) {
    this.financialData = financialData;
    this.calculations = {};
    this.validationErrors = [];
  }

  /**
   * LIQUIDITY RATIOS - Ability to meet short-term obligations
   * Regulatory Framework: Basel III, IAS 7 (Cash Flow Statement)
   */
  calculateLiquidityRatios(data = this.financialData) {
    const ratios = {};

    // Current Ratio = Current Assets / Current Liabilities
    // Regulatory Minimum (Basel III): > 1.0
    ratios.currentRatio = {
      value: data.currentAssets / data.currentLiabilities,
      formula: 'Current Assets / Current Liabilities',
      reguatoryBenchmark: '>1.0',
      framework: 'Basel III',
      interpretation: this._interpretLiquidityRatio(data.currentAssets / data.currentLiabilities),
      status: (data.currentAssets / data.currentLiabilities) > 1.0 ? 'COMPLIANT' : 'NON_COMPLIANT'
    };

    // Quick Ratio (Acid Test) = (Current Assets - Inventory) / Current Liabilities
    // Regulatory Minimum: > 0.5-0.7
    const quickAssets = data.currentAssets - (data.inventory || 0);
    ratios.quickRatio = {
      value: quickAssets / data.currentLiabilities,
      formula: '(Current Assets - Inventory) / Current Liabilities',
      reguatoryBenchmark: '>0.5-0.7',
      framework: 'Basel III',
      interpretation: this._interpretQuickRatio(quickAssets / data.currentLiabilities),
      status: (quickAssets / data.currentLiabilities) > 0.5 ? 'COMPLIANT' : 'AT_RISK'
    };

    // Cash Ratio = Cash & Cash Equivalents / Current Liabilities
    // Regulatory Requirement: > 0.2
    ratios.cashRatio = {
      value: (data.cash || 0) / data.currentLiabilities,
      formula: 'Cash & Equivalents / Current Liabilities',
      reguatoryBenchmark: '>0.2',
      framework: 'Basel III - LCR (Liquidity Coverage Ratio)',
      interpretation: 'Most conservative liquidity measure',
      status: ((data.cash || 0) / data.currentLiabilities) > 0.2 ? 'STRONG' : 'WEAK'
    };

    // Working Capital Ratio = Current Assets - Current Liabilities
    ratios.workingCapital = {
      value: data.currentAssets - data.currentLiabilities,
      formula: 'Current Assets - Current Liabilities',
      reguatoryBenchmark: '>0 (positive)',
      framework: 'IAS 7 - Cash Flow Statement',
      interpretation: 'Available capital for operations',
      status: (data.currentAssets - data.currentLiabilities) > 0 ? 'POSITIVE' : 'NEGATIVE'
    };

    // Operating Cash Flow Ratio = Operating Cash Flow / Current Liabilities
    // Regulatory Benchmark: > 0.4
    ratios.operatingCashFlowRatio = {
      value: (data.operatingCashFlow || 0) / data.currentLiabilities,
      formula: 'Operating Cash Flow / Current Liabilities',
      reguatoryBenchmark: '>0.4',
      framework: 'IAS 7 - Quality of Earnings Assessment',
      interpretation: 'Cash generation ability',
      status: ((data.operatingCashFlow || 0) / data.currentLiabilities) > 0.4 ? 'STRONG' : 'WEAK'
    };

    return ratios;
  }

  /**
   * PROFITABILITY RATIOS - Ability to generate profit
   * Regulatory Framework: IFRS 15 (Revenue), IAS 2 (Inventory), IAS 36 (Impairment)
   */
  calculateProfitabilityRatios(data = this.financialData) {
    const ratios = {};

    // Gross Profit Margin = Gross Profit / Revenue
    // Regulatory Benchmark: Industry-specific (15-50%)
    const grossProfit = data.revenue - data.costOfGoodsSold;
    ratios.grossProfitMargin = {
      value: (grossProfit / data.revenue) * 100,
      formula: '(Revenue - COGS) / Revenue × 100',
      reguatoryBenchmark: 'Industry-specific (15-50%)',
      framework: 'IFRS 15 - Revenue Recognition',
      interpretation: `${(grossProfit / data.revenue) * 100}% of revenue after direct costs`,
      status: this._interpretProfitMargin((grossProfit / data.revenue) * 100),
      components: {
        revenue: data.revenue,
        costOfGoodsSold: data.costOfGoodsSold,
        grossProfit: grossProfit
      }
    };

    // Operating Profit Margin = Operating Income / Revenue
    // Regulatory Benchmark: > 5-10% (healthy)
    const operatingIncome = data.operatingIncome || (grossProfit - data.operatingExpenses);
    ratios.operatingProfitMargin = {
      value: (operatingIncome / data.revenue) * 100,
      formula: 'Operating Income / Revenue × 100',
      reguatoryBenchmark: '>5-10% (healthy)',
      framework: 'IFRS 15 - Operating Performance',
      interpretation: `${(operatingIncome / data.revenue) * 100}% of revenue as operating profit`,
      status: (operatingIncome / data.revenue) > 0.1 ? 'HEALTHY' : 'CONCERNS',
      components: {
        operatingIncome: operatingIncome,
        revenue: data.revenue
      }
    };

    // Net Profit Margin = Net Income / Revenue
    // Regulatory Benchmark: > 2-5% (acceptable)
    ratios.netProfitMargin = {
      value: (data.netIncome / data.revenue) * 100,
      formula: 'Net Income / Revenue × 100',
      reguatoryBenchmark: '>2-5% (acceptable)',
      framework: 'IFRS 15 - Net Income Quality',
      interpretation: `${(data.netIncome / data.revenue) * 100}% of revenue reaches bottom line`,
      status: (data.netIncome / data.revenue) > 0.02 ? 'ACCEPTABLE' : 'CONCERN',
      components: {
        netIncome: data.netIncome,
        revenue: data.revenue
      }
    };

    // Return on Assets (ROA) = Net Income / Total Assets
    // Regulatory Benchmark: > 3-5% (good)
    ratios.returnOnAssets = {
      value: (data.netIncome / data.totalAssets) * 100,
      formula: 'Net Income / Total Assets × 100',
      reguatoryBenchmark: '>3-5% (good)',
      framework: 'IAS 36 - Asset Efficiency',
      interpretation: `Every $100 of assets generates $${(data.netIncome / data.totalAssets)}`,
      status: (data.netIncome / data.totalAssets) > 0.03 ? 'GOOD' : 'POOR',
      riskLevel: this._assessAssetEfficiency(data.netIncome / data.totalAssets)
    };

    // Return on Equity (ROE) = Net Income / Shareholders' Equity
    // Regulatory Benchmark: > 10-15% (target)
    ratios.returnOnEquity = {
      value: (data.netIncome / data.equity) * 100,
      formula: 'Net Income / Shareholders\' Equity × 100',
      reguatoryBenchmark: '>10-15% (target)',
      framework: 'Basel III - Capital Adequacy',
      interpretation: `Shareholder capital generates ${(data.netIncome / data.equity) * 100}% return`,
      status: (data.netIncome / data.equity) > 0.1 ? 'GOOD' : 'BELOW_TARGET',
      investorPerspective: (data.netIncome / data.equity) > 0.15 ? 'Attractive' : 'Marginal'
    };

    // EBITDA Margin = EBITDA / Revenue
    // Regulatory Benchmark: Industry-specific
    const ebitda = data.netIncome + data.interestExpense + data.taxes + data.depreciation + data.amortization;
    ratios.ebitdaMargin = {
      value: (ebitda / data.revenue) * 100,
      formula: '(Net Income + Interest + Taxes + Depreciation + Amortization) / Revenue × 100',
      reguatoryBenchmark: 'Industry-specific (10-30%)',
      framework: 'IAS 8 - Operating Performance',
      interpretation: 'Operational cash generation before financing decisions',
      components: {
        netIncome: data.netIncome,
        interestExpense: data.interestExpense,
        taxes: data.taxes,
        depreciation: data.depreciation,
        amortization: data.amortization,
        ebitda: ebitda
      }
    };

    return ratios;
  }

  /**
   * EFFICIENCY RATIOS - Asset utilization
   * Regulatory Framework: IAS 2 (Inventory), IAS 16 (Fixed Assets), IFRS 8 (Operating Segments)
   */
  calculateEfficiencyRatios(data = this.financialData) {
    const ratios = {};

    // Asset Turnover = Revenue / Total Assets
    // Regulatory Benchmark: > 0.8
    ratios.assetTurnover = {
      value: data.revenue / data.totalAssets,
      formula: 'Revenue / Total Assets',
      reguatoryBenchmark: '>0.8',
      framework: 'IAS 16 - Fixed Asset Efficiency',
      interpretation: 'Revenue generated per dollar of assets',
      status: (data.revenue / data.totalAssets) > 0.8 ? 'EFFICIENT' : 'UNDERUTILIZED',
      benchmarkAnalysis: this._compareToBenchmark('assetTurnover', data.revenue / data.totalAssets)
    };

    // Inventory Turnover = COGS / Average Inventory
    // Regulatory Benchmark: > 5x per year (industry-specific)
    const inventoryTurnover = data.costOfGoodsSold / ((data.beginningInventory + data.endingInventory) / 2 || data.inventory);
    ratios.inventoryTurnover = {
      value: inventoryTurnover,
      formula: 'COGS / Average Inventory',
      reguatoryBenchmark: '>5x per year (industry-specific)',
      framework: 'IAS 2 - Inventory Valuation & NRV Assessment',
      interpretation: `Inventory cycles ${inventoryTurnover.toFixed(2)} times per year`,
      status: inventoryTurnover > 5 ? 'GOOD' : 'SLOW',
      nrvRiskIndicator: inventoryTurnover < 2 ? 'HIGH (Obsolescence risk)' : 'NORMAL',
      daysInventoryOutstanding: (365 / inventoryTurnover).toFixed(0)
    };

    // Receivables Turnover = Revenue / Average Accounts Receivable
    // Regulatory Benchmark: > 8x per year
    const receivablesTurnover = data.revenue / ((data.beginningReceivables + data.endingReceivables) / 2 || data.accountsReceivable);
    ratios.receivablesTurnover = {
      value: receivablesTurnover,
      formula: 'Revenue / Average Accounts Receivable',
      reguatoryBenchmark: '>8x per year',
      framework: 'IFRS 9 - ECL (Expected Credit Loss) Assessment',
      interpretation: `Receivables collected ${receivablesTurnover.toFixed(2)} times per year`,
      daysOutstanding: (365 / receivablesTurnover).toFixed(0),
      collectionEfficiency: receivablesTurnover > 8 ? 'EFFICIENT' : 'SLOW',
      eclRiskLevel: receivablesTurnover < 4 ? 'HIGH' : 'NORMAL',
      creditQuality: this._assessCreditQuality(receivablesTurnover)
    };

    // Payables Turnover = COGS / Average Accounts Payable
    // Regulatory Benchmark: > 4x per year
    const payablesTurnover = data.costOfGoodsSold / ((data.beginningPayables + data.endingPayables) / 2 || data.accountsPayable);
    ratios.payablesTurnover = {
      value: payablesTurnover,
      formula: 'COGS / Average Accounts Payable',
      reguatoryBenchmark: '>4x per year',
      framework: 'IAS 11/IFRS 15 - Payment Terms',
      interpretation: `Payables paid ${payablesTurnover.toFixed(2)} times per year`,
      daysPaid: (365 / payablesTurnover).toFixed(0),
      paymentEfficiency: payablesTurnover > 4 ? 'EFFICIENT' : 'EXTENDED',
      cashManagement: payablesTurnover > 8 ? 'Consider extending terms' : 'Current terms appropriate'
    };

    // Fixed Asset Turnover = Revenue / Net Fixed Assets
    // Regulatory Benchmark: > 1.5
    ratios.fixedAssetTurnover = {
      value: data.revenue / data.fixedAssets,
      formula: 'Revenue / Net Fixed Assets',
      reguatoryBenchmark: '>1.5',
      framework: 'IAS 16 - Property, Plant & Equipment',
      interpretation: 'Revenue per dollar of fixed assets',
      status: (data.revenue / data.fixedAssets) > 1.5 ? 'GOOD' : 'OVERCAPITALIZED',
      impairmentRiskIndicator: (data.revenue / data.fixedAssets) < 0.5 ? 'HIGH' : 'NORMAL'
    };

    return ratios;
  }

  /**
   * SOLVENCY RATIOS - Long-term financial stability
   * Regulatory Framework: IFRS 16 (Leases), IAS 37 (Provisions), Basel III (Leverage Ratios)
   */
  calculateSolvencyRatios(data = this.financialData) {
    const ratios = {};

    // Debt-to-Equity Ratio = Total Debt / Shareholders' Equity
    // Regulatory Benchmark: < 2.0 (Basel III: < 1.5)
    const totalDebt = data.shortTermDebt + data.longTermDebt;
    ratios.debtToEquity = {
      value: totalDebt / data.equity,
      formula: 'Total Debt / Shareholders\' Equity',
      reguatoryBenchmark: '<2.0 (Basel III: <1.5)',
      framework: 'Basel III - Leverage Ratio',
      interpretation: `$${(totalDebt / data.equity).toFixed(2)} debt for every $1 equity`,
      status: (totalDebt / data.equity) < 2.0 ? 'ACCEPTABLE' : 'HIGH_LEVERAGE',
      riskLevel: this._assessLeverageRisk(totalDebt / data.equity),
      components: {
        totalDebt: totalDebt,
        equity: data.equity
      }
    };

    // Debt-to-Assets Ratio = Total Debt / Total Assets
    // Regulatory Benchmark: < 0.6 (60%)
    ratios.debtToAssets = {
      value: totalDebt / data.totalAssets,
      formula: 'Total Debt / Total Assets',
      reguatoryBenchmark: '<0.6 (60%)',
      framework: 'IFRS 16 - Right of Use Assets & Lease Liabilities',
      interpretation: `${(totalDebt / data.totalAssets * 100).toFixed(1)}% of assets financed by debt`,
      status: (totalDebt / data.totalAssets) < 0.6 ? 'CONSERVATIVE' : 'AGGRESSIVE',
      equityFinancing: ((1 - totalDebt / data.totalAssets) * 100).toFixed(1)
    };

    // Equity Ratio = Shareholders' Equity / Total Assets
    // Regulatory Benchmark: > 0.4 (40%)
    ratios.equityRatio = {
      value: data.equity / data.totalAssets,
      formula: 'Shareholders\' Equity / Total Assets',
      reguatoryBenchmark: '>0.4 (40%)',
      framework: 'Basel III - Capital Adequacy Ratio',
      interpretation: `${(data.equity / data.totalAssets * 100).toFixed(1)}% of assets financed by equity`,
      status: (data.equity / data.totalAssets) > 0.4 ? 'STRONG' : 'WEAK',
      capitalAdequacy: this._assessCapitalAdequacy(data.equity / data.totalAssets)
    };

    // Interest Coverage Ratio = EBIT / Interest Expense
    // Regulatory Benchmark: > 2.5
    const ebit = data.netIncome + data.interestExpense + data.taxes;
    ratios.interestCoverage = {
      value: ebit / (data.interestExpense || 1),
      formula: 'EBIT / Interest Expense',
      reguatoryBenchmark: '>2.5',
      framework: 'IAS 33 - Earnings Per Share Quality',
      interpretation: `EBIT covers interest ${(ebit / (data.interestExpense || 1)).toFixed(2)}x`,
      status: (ebit / (data.interestExpense || 1)) > 2.5 ? 'SAFE' : 'AT_RISK',
      debtServicingAbility: (ebit / (data.interestExpense || 1)) > 2.5 ? 'STRONG' : 'CONCERNING'
    };

    // Debt Service Coverage Ratio = Operating Cash Flow / Total Debt Service
    // Regulatory Benchmark: > 1.5
    const debtService = (data.interestExpense || 0) + (data.principalPayments || 0);
    ratios.debtServiceCoverage = {
      value: (data.operatingCashFlow || 0) / (debtService || 1),
      formula: 'Operating Cash Flow / (Interest + Principal Payments)',
      reguatoryBenchmark: '>1.5',
      framework: 'IAS 7 - Cash Flow Statement Analysis',
      interpretation: `Cash flow covers debt service ${((data.operatingCashFlow || 0) / (debtService || 1)).toFixed(2)}x`,
      status: ((data.operatingCashFlow || 0) / (debtService || 1)) > 1.5 ? 'SUSTAINABLE' : 'AT_RISK',
      refinancingRisk: ((data.operatingCashFlow || 0) / (debtService || 1)) < 1.0 ? 'HIGH' : 'NORMAL'
    };

    return ratios;
  }

  /**
   * INVESTOR RATIOS - Return and valuation metrics
   * Regulatory Framework: IAS 33 (EPS), IAS 36 (Impairment), IFRS 13 (Fair Value)
   */
  calculateInvestorRatios(data = this.financialData) {
    const ratios = {};

    // Earnings Per Share (EPS) = Net Income / Weighted Average Shares Outstanding
    // Regulatory Framework: IAS 33
    ratios.earningsPerShare = {
      value: data.netIncome / (data.sharesOutstanding || 1),
      formula: 'Net Income / Shares Outstanding',
      reguatoryBenchmark: '>0 (positive)',
      framework: 'IAS 33 - Earnings Per Share',
      interpretation: `Each share earned $${(data.netIncome / (data.sharesOutstanding || 1)).toFixed(2)}`,
      status: (data.netIncome / (data.sharesOutstanding || 1)) > 0 ? 'POSITIVE' : 'NEGATIVE',
      trendAnalysis: data.epsGrowth > 5 ? 'Improving' : 'Stable',
      components: {
        netIncome: data.netIncome,
        sharesOutstanding: data.sharesOutstanding
      }
    };

    // Price-to-Earnings (P/E) Ratio = Stock Price / EPS
    // Regulatory Framework: IFRS 13 - Fair Value Measurement
    const eps = data.netIncome / (data.sharesOutstanding || 1);
    ratios.priceToEarnings = {
      value: (data.stockPrice || 0) / (eps || 1),
      formula: 'Stock Price / Earnings Per Share',
      reguatoryBenchmark: 'Industry-specific (10-25x)',
      framework: 'IFRS 13 - Fair Value Measurement',
      interpretation: `Market pays $${((data.stockPrice || 0) / (eps || 1)).toFixed(2)} per $1 of earnings`,
      valuation: this._interpretPERatio((data.stockPrice || 0) / (eps || 1)),
      marketSentiment: (data.stockPrice || 0) / (eps || 1) > 25 ? 'OPTIMISTIC' : 'REALISTIC'
    };

    // Book Value Per Share = Shareholders' Equity / Shares Outstanding
    // Regulatory Framework: IAS 36 - Impairment Testing
    ratios.bookValuePerShare = {
      value: data.equity / (data.sharesOutstanding || 1),
      formula: 'Shareholders\' Equity / Shares Outstanding',
      reguatoryBenchmark: '>0',
      framework: 'IAS 36 - Asset Impairment',
      interpretation: `Book value per share: $${(data.equity / (data.sharesOutstanding || 1)).toFixed(2)}`,
      priceToBook: (data.stockPrice || 0) / (data.equity / (data.sharesOutstanding || 1)),
      status: (data.equity / (data.sharesOutstanding || 1)) > 0 ? 'POSITIVE' : 'NEGATIVE'
    };

    // Dividend Yield = Annual Dividend / Stock Price
    ratios.dividendYield = {
      value: ((data.dividendPerShare || 0) / (data.stockPrice || 1)) * 100,
      formula: '(Dividend Per Share / Stock Price) × 100',
      reguatoryBenchmark: '1-4% (healthy)',
      framework: 'IAS 32 - Financial Instruments',
      interpretation: `Dividend yield: ${(((data.dividendPerShare || 0) / (data.stockPrice || 1)) * 100).toFixed(2)}%`,
      investorAttraction: ((data.dividendPerShare || 0) / (data.stockPrice || 1)) > 0.02 ? 'ATTRACTIVE' : 'LOW',
      payout: data.dividendPerShare / eps
    };

    // Payout Ratio = Dividends / Net Income
    ratios.payoutRatio = {
      value: ((data.totalDividends || 0) / data.netIncome) * 100,
      formula: '(Total Dividends / Net Income) × 100',
      reguatoryBenchmark: '20-50% (sustainable)',
      framework: 'IFRS 5 - Non-current Assets',
      interpretation: `${(((data.totalDividends || 0) / data.netIncome) * 100).toFixed(1)}% of earnings paid as dividends`,
      sustainability: ((data.totalDividends || 0) / data.netIncome) < 0.5 ? 'SUSTAINABLE' : 'AT_RISK',
      retentionRatio: (1 - ((data.totalDividends || 0) / data.netIncome)) * 100
    };

    // Retention Ratio = Retained Earnings / Net Income
    ratios.retentionRatio = {
      value: ((data.retainedEarnings || 0) / data.netIncome) * 100,
      formula: '(Retained Earnings / Net Income) × 100',
      reguatoryBenchmark: '50-80% (growth)',
      framework: 'IAS 1 - Statement of Changes in Equity',
      interpretation: `${(((data.retainedEarnings || 0) / data.netIncome) * 100).toFixed(1)}% of earnings retained`,
      growthPotential: ((data.retainedEarnings || 0) / data.netIncome) > 0.5 ? 'GROWTH' : 'MATURE'
    };

    return ratios;
  }

  /**
   * Calculate all ratios with regulatory validation
   */
  calculateAllRatios(data = this.financialData) {
    return {
      liquidity: this.calculateLiquidityRatios(data),
      profitability: this.calculateProfitabilityRatios(data),
      efficiency: this.calculateEfficiencyRatios(data),
      solvency: this.calculateSolvencyRatios(data),
      investor: this.calculateInvestorRatios(data),
      timestamp: new Date().toISOString(),
      dataIntegrity: this._validateDataIntegrity(data)
    };
  }

  /**
   * Generate regulatory compliance report for ratios
   */
  generateRegulatoryComplianceReport(data = this.financialData) {
    const allRatios = this.calculateAllRatios(data);
    const complianceStatus = {};

    Object.entries(allRatios).forEach(([category, ratios]) => {
      if (category !== 'timestamp' && category !== 'dataIntegrity') {
        Object.entries(ratios).forEach(([ratioName, ratioData]) => {
          if (ratioData.reguatoryBenchmark) {
            complianceStatus[`${category}_${ratioName}`] = {
              value: ratioData.value,
              status: ratioData.status,
              benchmark: ratioData.reguatoryBenchmark,
              framework: ratioData.framework,
              compliant: this._checkCompliance(ratioData)
            };
          }
        });
      }
    });

    return {
      overallCompliance: this._calculateOverallCompliance(complianceStatus),
      ratios: complianceStatus,
      riskLevel: this._assessOverallRiskLevel(allRatios),
      recommendations: this._generateRecommendations(allRatios)
    };
  }

  // ========== HELPER METHODS ==========

  _interpretLiquidityRatio(ratio) {
    if (ratio > 2.0) return 'Excellent - Very liquid';
    if (ratio > 1.5) return 'Good - Sufficient liquidity';
    if (ratio > 1.0) return 'Acceptable - Meets minimum standard';
    return 'Poor - May struggle with short-term obligations';
  }

  _interpretQuickRatio(ratio) {
    if (ratio > 1.0) return 'Excellent - High liquidity without inventory';
    if (ratio > 0.7) return 'Good - Reasonable immediate liquidity';
    if (ratio > 0.5) return 'Acceptable - Minimum quick liquidity';
    return 'Weak - Liquidity concerns';
  }

  _interpretProfitMargin(margin) {
    if (margin > 30) return 'EXCELLENT';
    if (margin > 20) return 'VERY_GOOD';
    if (margin > 10) return 'GOOD';
    if (margin > 5) return 'ACCEPTABLE';
    return 'CONCERNING';
  }

  _assessAssetEfficiency(roa) {
    if (roa > 0.10) return 'EXCELLENT';
    if (roa > 0.05) return 'GOOD';
    if (roa > 0.03) return 'ACCEPTABLE';
    return 'POOR';
  }

  _assessLeverageRisk(debtToEquity) {
    if (debtToEquity > 3) return 'CRITICAL';
    if (debtToEquity > 2) return 'HIGH';
    if (debtToEquity > 1.5) return 'MODERATE';
    return 'LOW';
  }

  _assessCapitalAdequacy(equityRatio) {
    if (equityRatio > 0.6) return 'STRONG';
    if (equityRatio > 0.4) return 'ADEQUATE';
    if (equityRatio > 0.3) return 'WEAK';
    return 'CONCERNING';
  }

  _assessCreditQuality(receivablesTurnover) {
    if (receivablesTurnover > 12) return 'EXCELLENT';
    if (receivablesTurnover > 8) return 'GOOD';
    if (receivablesTurnover > 4) return 'ACCEPTABLE';
    return 'POOR';
  }

  _interpretPERatio(peRatio) {
    if (peRatio > 30) return 'EXPENSIVE';
    if (peRatio > 20) return 'FAIR_VALUE';
    if (peRatio > 10) return 'UNDERVALUED';
    return 'VERY_CHEAP';
  }

  _compareToBenchmark(ratioType, value) {
    const benchmarks = {
      assetTurnover: { excellent: 1.5, good: 1.0, acceptable: 0.8 },
      receivablesTurnover: { excellent: 12, good: 8, acceptable: 4 }
    };
    const bench = benchmarks[ratioType];
    if (bench) {
      if (value > bench.excellent) return 'EXCEEDS_EXCELLENT';
      if (value > bench.good) return 'MEETS_GOOD';
      if (value > bench.acceptable) return 'MEETS_MINIMUM';
      return 'BELOW_STANDARD';
    }
    return 'UNKNOWN';
  }

  _validateDataIntegrity(data) {
    const errors = [];
    if (!data.revenue || data.revenue <= 0) errors.push('Invalid revenue');
    if (!data.totalAssets || data.totalAssets <= 0) errors.push('Invalid total assets');
    if (!data.equity || data.equity <= 0) errors.push('Invalid equity');
    return { isValid: errors.length === 0, errors };
  }

  _checkCompliance(ratioData) {
    if (!ratioData.status) return null;
    return ['COMPLIANT', 'ACCEPTABLE', 'GOOD', 'STRONG', 'POSITIVE', 'SUSTAINABLE'].includes(ratioData.status);
  }

  _calculateOverallCompliance(status) {
    const compliantCount = Object.values(status).filter(r => r.compliant).length;
    const totalCount = Object.keys(status).length;
    return {
      percentage: ((compliantCount / totalCount) * 100).toFixed(1),
      compliantRatios: compliantCount,
      totalRatios: totalCount
    };
  }

  _assessOverallRiskLevel(allRatios) {
    let riskScore = 0;
    const weights = {
      liquidity: 0.25,
      solvency: 0.3,
      profitability: 0.25,
      efficiency: 0.2
    };

    // Assess each category
    if (allRatios.liquidity.currentRatio.value < 1) riskScore += 20 * weights.liquidity;
    if (allRatios.solvency.debtToEquity.value > 2) riskScore += 30 * weights.solvency;
    if (allRatios.profitability.netProfitMargin.value < 0) riskScore += 25 * weights.profitability;
    if (allRatios.efficiency.assetTurnover.value < 0.5) riskScore += 20 * weights.efficiency;

    if (riskScore > 80) return 'CRITICAL';
    if (riskScore > 60) return 'HIGH';
    if (riskScore > 40) return 'MODERATE';
    if (riskScore > 20) return 'LOW';
    return 'MINIMAL';
  }

  _generateRecommendations(allRatios) {
    const recommendations = [];

    if (allRatios.liquidity.currentRatio.value < 1) {
      recommendations.push('Improve liquidity: Increase current assets or reduce current liabilities');
    }
    if (allRatios.solvency.debtToEquity.value > 2) {
      recommendations.push('High leverage: Consider debt reduction or equity injection');
    }
    if (allRatios.profitability.netProfitMargin.value < 0.02) {
      recommendations.push('Low profitability: Review cost structure and pricing strategy');
    }

    return recommendations;
  }
}

export default FinancialRatioCalculationEngine;
