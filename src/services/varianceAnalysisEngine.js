/**
 * Variance Analysis Engine
 * Comprehensive variance analysis with automatic narrative generation
 * Analyzes budget vs. actual, prior year comparison, and identifies significant items
 *
 * Regulatory Frameworks:
 * - IFRS 8 (Operating Segments)
 * - IAS 1 (Presentation of Financial Statements)
 * - IAS 36 (Impairment of Assets)
 * - FRS 102 (Disclosure Requirements)
 */

export class VarianceAnalysisEngine {
  constructor(options = {}) {
    this.materiality = options.materiality || 0.05; // 5% default
    this.performanceMateriality = options.performanceMateriality || 0.75 * this.materiality;
    this.clearlyTrivilThreshold = options.clearlyTrivilThreshold || 0.05 * this.materiality;
    this.variances = [];
  }

  /**
   * Calculate variance between budget and actual
   * Framework: IFRS 8 - Segment Reporting & Variance Analysis
   */
  calculateBudgetVariance(budgetData, actualData) {
    const analysis = {
      timestamp: new Date().toISOString(),
      variances: [],
      summary: {},
      recommendations: []
    };

    // Revenue Variance Analysis
    const revenueVariance = actualData.revenue - budgetData.revenue;
    analysis.variances.push({
      category: 'Revenue',
      budgeted: budgetData.revenue,
      actual: actualData.revenue,
      variance: revenueVariance,
      variancePercentage: (revenueVariance / budgetData.revenue) * 100,
      isMaterial: this._checkMateriality(Math.abs(revenueVariance), budgetData.revenue),
      significance: this._calculateSignificance(revenueVariance, budgetData.revenue),
      narrative: this._generateVarianceNarrative('Revenue', revenueVariance, budgetData.revenue, actualData),
      drivers: this._identifyRevenueDrivers(budgetData, actualData),
      riskLevel: this._assessVarianceRisk(revenueVariance, budgetData.revenue)
    });

    // Expense Variance Analysis
    if (budgetData.expenses || actualData.expenses) {
      const expenseVariance = actualData.expenses - budgetData.expenses;
      analysis.variances.push({
        category: 'Operating Expenses',
        budgeted: budgetData.expenses,
        actual: actualData.expenses,
        variance: expenseVariance,
        variancePercentage: (expenseVariance / budgetData.expenses) * 100,
        isMaterial: this._checkMateriality(Math.abs(expenseVariance), budgetData.expenses),
        significance: this._calculateSignificance(expenseVariance, budgetData.expenses),
        narrative: this._generateExpenseNarrative(expenseVariance, budgetData.expenses),
        breakdown: this._breakdownExpenses(budgetData, actualData),
        controlsAssessment: this._assessExpenseControls(actualData)
      });
    }

    // COGS Variance Analysis
    if (budgetData.costOfGoodsSold && actualData.costOfGoodsSold) {
      const cogsVariance = actualData.costOfGoodsSold - budgetData.costOfGoodsSold;
      analysis.variances.push({
        category: 'Cost of Goods Sold',
        budgeted: budgetData.costOfGoodsSold,
        actual: actualData.costOfGoodsSold,
        variance: cogsVariance,
        variancePercentage: (cogsVariance / budgetData.costOfGoodsSold) * 100,
        isMaterial: this._checkMateriality(Math.abs(cogsVariance), budgetData.costOfGoodsSold),
        narrative: this._generateCogsNarrative(cogsVariance, budgetData, actualData),
        grossMarginAnalysis: this._analyzeGrossMargin(budgetData, actualData)
      });
    }

    // Asset Variance Analysis
    if (budgetData.assets && actualData.assets) {
      const assetVariance = actualData.assets - budgetData.assets;
      analysis.variances.push({
        category: 'Total Assets',
        budgeted: budgetData.assets,
        actual: actualData.assets,
        variance: assetVariance,
        variancePercentage: (assetVariance / budgetData.assets) * 100,
        isMaterial: this._checkMateriality(Math.abs(assetVariance), budgetData.assets),
        narrative: this._generateAssetNarrative(assetVariance, budgetData.assets),
        impairmentRisk: actualData.assets < budgetData.assets * 0.9 ? 'HIGH' : 'NORMAL'
      });
    }

    // Calculate summary metrics
    analysis.summary = {
      totalVariances: analysis.variances.length,
      materialVariances: analysis.variances.filter(v => v.isMaterial).length,
      positiveVariances: analysis.variances.filter(v => v.variance > 0).length,
      negativeVariances: analysis.variances.filter(v => v.variance < 0).length,
      averageVariancePercentage: (
        analysis.variances.reduce((sum, v) => sum + Math.abs(v.variancePercentage), 0) /
        analysis.variances.length
      ).toFixed(2)
    };

    return analysis;
  }

  /**
   * Prior Year Comparison & Trend Analysis
   * Framework: IAS 1 - Comparative Statements
   */
  calculatePriorYearVariance(currentYear, priorYear, twoYearsAgo = null) {
    const analysis = {
      timestamp: new Date().toISOString(),
      yearOverYearVariances: [],
      trends: [],
      growthRate: {},
      riskIndicators: []
    };

    // Year-over-Year Comparison
    const keyMetrics = ['revenue', 'expenses', 'netIncome', 'totalAssets', 'equity'];

    keyMetrics.forEach(metric => {
      if (currentYear[metric] && priorYear[metric]) {
        const yoyVariance = currentYear[metric] - priorYear[metric];
        const yoyPercentage = (yoyVariance / priorYear[metric]) * 100;

        analysis.yearOverYearVariances.push({
          metric: metric,
          priorYear: priorYear[metric],
          currentYear: currentYear[metric],
          variance: yoyVariance,
          variancePercentage: yoyPercentage,
          narrative: this._generateTrendNarrative(metric, yoyVariance, priorYear[metric]),
          isMaterial: this._checkMateriality(Math.abs(yoyVariance), priorYear[metric])
        });

        // Calculate growth metrics for investor ratios
        analysis.growthRate[metric] = yoyPercentage;
      }
    });

    // Two-Year Trend Analysis
    if (twoYearsAgo) {
      keyMetrics.forEach(metric => {
        if (currentYear[metric] && priorYear[metric] && twoYearsAgo[metric]) {
          const cagr = this._calculateCAGR(twoYearsAgo[metric], currentYear[metric], 2);
          const trend = this._identifyTrend(twoYearsAgo[metric], priorYear[metric], currentYear[metric]);

          analysis.trends.push({
            metric: metric,
            cagr: cagr,
            trend: trend,
            consistency: this._assessTrendConsistency(twoYearsAgo[metric], priorYear[metric], currentYear[metric]),
            narrative: this._generateTrendNarrative(metric, cagr, priorYear[metric], true)
          });
        }
      });
    }

    return analysis;
  }

  /**
   * Variance Analysis by Account / Department
   */
  analyzeAccountVariances(accounts, budgetedAccounts) {
    const analysis = {
      accounts: [],
      summary: {},
      significantItems: [],
      recommendations: []
    };

    accounts.forEach((account, index) => {
      const budgeted = budgetedAccounts[index] || 0;
      const actual = account.balance || 0;
      const variance = actual - budgeted;
      const variancePercentage = budgeted !== 0 ? (variance / budgeted) * 100 : 0;

      const accountAnalysis = {
        account: account.name,
        accountNumber: account.number,
        budgeted: budgeted,
        actual: actual,
        variance: variance,
        variancePercentage: variancePercentage,
        isMaterial: this._checkMateriality(Math.abs(variance), budgeted),
        significance: this._calculateSignificance(variance, budgeted),
        narrative: this._generateAccountNarrative(account.name, variance, budgeted),
        explanation: account.explanation || null,
        investigationRequired: Math.abs(variancePercentage) > 10
      };

      analysis.accounts.push(accountAnalysis);

      if (Math.abs(variancePercentage) > 5) {
        analysis.significantItems.push(accountAnalysis);
      }
    });

    // Summary calculations
    analysis.summary = {
      totalAccounts: analysis.accounts.length,
      accountsWithVariance: analysis.accounts.filter(a => a.variance !== 0).length,
      significantVariances: analysis.significantItems.length,
      largestUnfavorableVariance: Math.min(...analysis.accounts.map(a => a.variance)),
      largestFavorableVariance: Math.max(...analysis.accounts.map(a => a.variance))
    };

    // Generate recommendations
    analysis.recommendations = this._generateVarianceRecommendations(analysis.significantItems);

    return analysis;
  }

  /**
   * Variance Bridging - Explain movement from opening to closing balance
   * Framework: IAS 7 - Cash Flow Statement
   */
  createVarianceBridge(openingBalance, closingBalance, transactions = []) {
    const bridge = {
      openingBalance: openingBalance,
      closingBalance: closingBalance,
      totalVariance: closingBalance - openingBalance,
      transactions: [],
      unexplainedVariance: closingBalance - openingBalance
    };

    if (transactions.length === 0) {
      bridge.unexplainedVariance = closingBalance - openingBalance;
    } else {
      let explainedAmount = 0;

      transactions.forEach(tx => {
        bridge.transactions.push({
          description: tx.description,
          amount: tx.amount,
          type: tx.type || (tx.amount > 0 ? 'INCREASE' : 'DECREASE'),
          narrative: tx.narrative || `${tx.description}: ${tx.amount > 0 ? '+' : ''}${tx.amount}`
        });
        explainedAmount += tx.amount;
      });

      bridge.unexplainedVariance = closingBalance - openingBalance - explainedAmount;
      bridge.explanationRate = ((explainedAmount / (closingBalance - openingBalance)) * 100).toFixed(2);
    }

    return bridge;
  }

  /**
   * Calculate Rolling Forecast Variance
   */
  analyzeRollingForecast(actualData, forecastData, timeperiods) {
    const analysis = {
      periods: [],
      accuracy: {},
      improvements: []
    };

    timeperiods.forEach((period, index) => {
      const actual = actualData[index];
      const forecast = forecastData[index];
      const variance = actual - forecast;
      const accuracyPercentage = forecast !== 0 ? (1 - Math.abs(variance / forecast)) * 100 : 0;

      analysis.periods.push({
        period: period,
        actual: actual,
        forecast: forecast,
        variance: variance,
        accuracy: accuracyPercentage.toFixed(2),
        narrative: `Period ${period}: Actual ${actual}, Forecast ${forecast}, Variance ${variance}`
      });
    });

    // Calculate forecast accuracy
    const averageAccuracy = analysis.periods.reduce((sum, p) => sum + parseFloat(p.accuracy), 0) / analysis.periods.length;
    analysis.accuracy = {
      averageAccuracy: averageAccuracy.toFixed(2),
      forecastQuality: averageAccuracy > 95 ? 'EXCELLENT' : averageAccuracy > 90 ? 'GOOD' : averageAccuracy > 85 ? 'ACCEPTABLE' : 'POOR',
      recommendations: this._getForecastImprovements(averageAccuracy)
    };

    return analysis;
  }

  // ========== HELPER METHODS ==========

  _checkMateriality(variance, base) {
    const variancePercentage = Math.abs(variance) / Math.abs(base);
    return variancePercentage > this.performanceMateriality;
  }

  _calculateSignificance(variance, base) {
    const percentage = Math.abs(variance / base);
    if (percentage > 0.20) return 'CRITICAL';
    if (percentage > 0.10) return 'HIGH';
    if (percentage > 0.05) return 'MODERATE';
    if (percentage > 0.02) return 'LOW';
    return 'TRIVIAL';
  }

  _generateVarianceNarrative(category, variance, base, actualData) {
    const percentage = (Math.abs(variance) / base * 100).toFixed(2);
    const direction = variance > 0 ? 'increased' : 'decreased';
    const magnitude = Math.abs(variance);

    let narrative = `${category} ${direction} by $${magnitude.toFixed(0)} or ${percentage}% `;

    if (Math.abs(percentage) > 20) {
      narrative += '(SIGNIFICANT VARIANCE). ';
    } else if (Math.abs(percentage) > 10) {
      narrative += '(MATERIAL VARIANCE). ';
    } else {
      narrative += '(ACCEPTABLE VARIANCE). ';
    }

    // Add context based on category
    if (variance > 0 && category === 'Revenue') {
      narrative += 'The positive variance may be due to higher sales volume, pricing increases, or new customer acquisition.';
    } else if (variance < 0 && category === 'Revenue') {
      narrative += 'The negative variance requires investigation into lost sales, market conditions, or timing differences.';
    }

    return narrative;
  }

  _identifyRevenueDrivers(budgetData, actualData) {
    const drivers = [];

    if (actualData.salesVolume && budgetData.salesVolume) {
      const volumeVariance = ((actualData.salesVolume - budgetData.salesVolume) / budgetData.salesVolume) * 100;
      drivers.push({
        driver: 'Sales Volume',
        variance: volumeVariance.toFixed(2) + '%',
        impact: 'PRIMARY' if Math.abs(volumeVariance) > 10 else 'SECONDARY'
      });
    }

    if (actualData.pricePerUnit && budgetData.pricePerUnit) {
      const priceVariance = ((actualData.pricePerUnit - budgetData.pricePerUnit) / budgetData.pricePerUnit) * 100;
      drivers.push({
        driver: 'Average Selling Price',
        variance: priceVariance.toFixed(2) + '%',
        impact: 'PRIMARY' if Math.abs(priceVariance) > 10 else 'SECONDARY'
      });
    }

    return drivers.length > 0 ? drivers : null;
  }

  _generateExpenseNarrative(variance, base) {
    const percentage = (Math.abs(variance) / base * 100).toFixed(2);
    const direction = variance > 0 ? 'overrun' : 'under budget';

    return `Operating expenses ${direction} by $${Math.abs(variance).toFixed(0)} or ${percentage}%. ` +
           `This represents a ${variance > 0 ? 'higher' : 'lower'} cost structure than anticipated. ` +
           `Detailed breakdown by cost center should be reviewed.`;
  }

  _generateCogsNarrative(variance, budgetData, actualData) {
    const percentage = (Math.abs(variance) / budgetData.costOfGoodsSold * 100).toFixed(2);
    const grossMarginBudget = ((budgetData.revenue - budgetData.costOfGoodsSold) / budgetData.revenue * 100).toFixed(2);
    const grossMarginActual = ((actualData.revenue - actualData.costOfGoodsSold) / actualData.revenue * 100).toFixed(2);

    return `Cost of goods sold variance: $${Math.abs(variance).toFixed(0)} or ${percentage}%. ` +
           `Budgeted gross margin: ${grossMarginBudget}%. Actual gross margin: ${grossMarginActual}%. ` +
           `Material cost inflation, efficiency changes, or product mix variations may explain the difference.`;
  }

  _generateAssetNarrative(variance, base) {
    const percentage = (Math.abs(variance) / base * 100).toFixed(2);

    if (variance > 0) {
      return `Total assets increased by $${variance.toFixed(0)} (${percentage}%). ` +
             `Investigate acquisition of major fixed assets, goodwill, or other non-current asset additions.`;
    } else {
      return `Total assets decreased by $${Math.abs(variance).toFixed(0)} (${percentage}%). ` +
             `Assess whether impairment charges, asset disposals, or depreciation are the primary drivers.`;
    }
  }

  _generateAccountNarrative(accountName, variance, budgeted) {
    const percentage = budgeted !== 0 ? (variance / budgeted * 100).toFixed(2) : 'N/A';
    const direction = variance > 0 ? 'higher' : 'lower';

    return `${accountName} is ${direction} than budgeted by $${Math.abs(variance).toFixed(0)} (${percentage}%). ` +
           `Review supporting documentation and transactions to understand the variance drivers.`;
  }

  _breakdownExpenses(budgetData, actualData) {
    const breakdown = [];

    const expenseCategories = ['salaries', 'rent', 'utilities', 'marketing', 'maintenance'];
    expenseCategories.forEach(category => {
      if (budgetData[category] && actualData[category]) {
        breakdown.push({
          category: category,
          budgeted: budgetData[category],
          actual: actualData[category],
          variance: actualData[category] - budgetData[category],
          variancePercentage: ((actualData[category] - budgetData[category]) / budgetData[category] * 100).toFixed(2)
        });
      }
    });

    return breakdown.length > 0 ? breakdown : null;
  }

  _assessExpenseControls(actualData) {
    if (!actualData.discrepancies || actualData.discrepancies.length === 0) {
      return 'STRONG - No control issues identified';
    }
    return actualData.discrepancies.length > 5 ? 'WEAK' : 'MODERATE';
  }

  _analyzeGrossMargin(budgetData, actualData) {
    const budgetedMargin = ((budgetData.revenue - budgetData.costOfGoodsSold) / budgetData.revenue) * 100;
    const actualMargin = ((actualData.revenue - actualData.costOfGoodsSold) / actualData.revenue) * 100;
    const marginVariance = actualMargin - budgetedMargin;

    return {
      budgeted: budgetedMargin.toFixed(2) + '%',
      actual: actualMargin.toFixed(2) + '%',
      variance: marginVariance.toFixed(2) + '%',
      assessment: Math.abs(marginVariance) > 5 ? 'SIGNIFICANT_CHANGE' : 'WITHIN_TOLERANCE'
    };
  }

  _generateTrendNarrative(metric, variance, base, isCagr = false) {
    if (isCagr) {
      return `${metric} growing at ${variance.toFixed(2)}% CAGR over the period.`;
    }
    const percentage = (variance / base * 100).toFixed(2);
    const direction = variance > 0 ? 'increased' : 'decreased';
    return `${metric} ${direction} by ${percentage}% year-over-year.`;
  }

  _calculateCAGR(beginning, ending, years) {
    return (Math.pow(ending / beginning, 1 / years) - 1) * 100;
  }

  _identifyTrend(twoYearsAgo, priorYear, current) {
    if (current > priorYear && priorYear > twoYearsAgo) return 'INCREASING';
    if (current < priorYear && priorYear < twoYearsAgo) return 'DECREASING';
    if (Math.abs(current - priorYear) < Math.abs(priorYear - twoYearsAgo)) return 'STABILIZING';
    return 'VOLATILE';
  }

  _assessTrendConsistency(twoYearsAgo, priorYear, current) {
    const change1 = priorYear - twoYearsAgo;
    const change2 = current - priorYear;
    const consistency = Math.abs(change1 - change2) / Math.max(Math.abs(change1), Math.abs(change2));
    return consistency < 0.2 ? 'CONSISTENT' : 'VARIABLE';
  }

  _assessVarianceRisk(variance, base) {
    const percentage = Math.abs(variance / base);
    if (percentage > 0.30) return 'CRITICAL';
    if (percentage > 0.20) return 'HIGH';
    if (percentage > 0.10) return 'MODERATE';
    return 'LOW';
  }

  _generateVarianceRecommendations(significantItems) {
    const recommendations = [];

    significantItems.forEach(item => {
      if (item.variancePercentage > 15) {
        recommendations.push(`${item.account}: Investigate root causes and implement corrective action plan.`);
      } else if (item.variancePercentage > 10) {
        recommendations.push(`${item.account}: Monitor closely and adjust forecasts accordingly.`);
      }
    });

    return recommendations.length > 0 ? recommendations : ['All variances within acceptable ranges.'];
  }

  _getForecastImprovements(averageAccuracy) {
    if (averageAccuracy > 95) return ['Forecast accuracy is excellent. Maintain current forecasting methodology.'];
    if (averageAccuracy > 90) return ['Forecast accuracy is good. Continue monitoring and minor adjustments recommended.'];
    if (averageAccuracy > 85) return ['Implement improved forecasting techniques', 'Review assumption accuracy', 'Increase forecast frequency'];
    return ['Significant improvement needed', 'Review and revise forecasting methodology', 'Increase management oversight', 'Consider external data sources'];
  }
}

export default VarianceAnalysisEngine;
