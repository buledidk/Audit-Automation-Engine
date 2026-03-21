/**
 * Smart Risk Engine v2.0
 * =======================
 * Intelligent risk assessment powered by trial balance data and entity characteristics
 * Automatically identifies risks, calculates risk scores, and recommends audit procedures
 *
 * Features:
 * - Trial balance analysis for risk indicators
 * - Trend analysis and ratio calculations
 * - Industry-specific risk library integration
 * - Automatic audit procedure recommendation
 * - Risk score calculation
 */

import industryRiskLibrary from '../risk-library/RiskLibraryIndex.js';

export class SmartRiskEngineV2 {
  constructor(entityDetails, trialBalance, priorYearData = null) {
    this.entityDetails = entityDetails;
    this.trialBalance = trialBalance;
    this.priorYearData = priorYearData;
    this.riskAssessments = {};
    this.auditProcedures = [];
    this.indicators = {};
  }

  /**
   * Execute comprehensive risk assessment
   */
  async performRiskAssessment() {
    const results = {
      entityAnalysis: this.analyzeEntityCharacteristics(),
      trialBalanceAnalysis: this.analyzeTrialBalance(),
      riskIndicators: this.identifyRiskIndicators(),
      inherentRisks: this.assessInherentRisks(),
      riskScores: this.calculateRiskScores(),
      auditProcedures: this.recommendAuditProcedures(),
      focusAreas: this.identifyFocusAreas()
    };

    return results;
  }

  /**
   * Analyze entity characteristics to identify risk factors
   */
  analyzeEntityCharacteristics() {
    const analysis = {
      entity: this.entityDetails.entityName || 'Unknown',
      industry: this.entityDetails.industry || 'Unspecified',
      fiscalYearEnd: this.entityDetails.fiscalYearEnd,
      entitySize: this.classifyEntitySize(),
      ownership: this.entityDetails.ownership || 'Unknown',
      industryRisks: this.getIndustryRisks(),
      riskFactors: []
    };

    // Identify risk factors
    if (this.entityDetails.isFirstTimeAudit) {
      analysis.riskFactors.push('First-time audit - limited prior knowledge');
    }
    if (this.entityDetails.significantChanges) {
      analysis.riskFactors.push('Significant organizational changes');
    }
    if (this.entityDetails.newAccounting) {
      analysis.riskFactors.push('New accounting standards implementation');
    }
    if (this.entityDetails.relatedPartyTransactions) {
      analysis.riskFactors.push('Significant related party activity');
    }

    return analysis;
  }

  /**
   * Classify entity size based on criteria
   */
  classifyEntitySize() {
    const totalAssets = this.getTotalAssets();
    const revenue = this.getRevenue();

    if (totalAssets > 1000000000 || revenue > 500000000) {
      return { size: 'Large', threshold: 'PIE considerations apply' };
    } else if (totalAssets > 100000000 || revenue > 50000000) {
      return { size: 'Medium', threshold: 'Significant audit procedures required' };
    } else if (totalAssets > 10000000 || revenue > 5000000) {
      return { size: 'Small', threshold: 'Standard audit procedures' };
    } else {
      return { size: 'Micro', threshold: 'Limited scope audit' };
    }
  }

  /**
   * Analyze trial balance for risk indicators
   */
  analyzeTrialBalance() {
    const analysis = {
      totalAssets: this.getTotalAssets(),
      totalLiabilities: this.getTotalLiabilities(),
      totalEquity: this.getTotalEquity(),
      revenue: this.getRevenue(),
      netIncome: this.getNetIncome(),
      accountBalances: {},
      largestAccounts: this.identifyLargestAccounts(),
      ratios: this.calculateFinancialRatios(),
      trends: this.priorYearData ? this.analyzeTrends() : null
    };

    return analysis;
  }

  /**
   * Get total assets from trial balance
   */
  getTotalAssets() {
    if (!this.trialBalance) return 0;
    return this.trialBalance.reduce((sum, account) => {
      if (account.type === 'Asset') return sum + (account.balance || 0);
      return sum;
    }, 0);
  }

  /**
   * Get total liabilities from trial balance
   */
  getTotalLiabilities() {
    if (!this.trialBalance) return 0;
    return this.trialBalance.reduce((sum, account) => {
      if (account.type === 'Liability') return sum + (account.balance || 0);
      return sum;
    }, 0);
  }

  /**
   * Get total equity from trial balance
   */
  getTotalEquity() {
    if (!this.trialBalance) return 0;
    return this.trialBalance.reduce((sum, account) => {
      if (account.type === 'Equity') return sum + (account.balance || 0);
      return sum;
    }, 0);
  }

  /**
   * Get revenue from trial balance
   */
  getRevenue() {
    if (!this.trialBalance) return 0;
    return this.trialBalance.reduce((sum, account) => {
      if (account.type === 'Revenue') return sum + Math.abs(account.balance || 0);
      return sum;
    }, 0);
  }

  /**
   * Get net income from trial balance
   */
  getNetIncome() {
    if (!this.trialBalance) return 0;
    const revenue = this.getRevenue();
    const expenses = this.trialBalance.reduce((sum, account) => {
      if (account.type === 'Expense') return sum + (account.balance || 0);
      return sum;
    }, 0);
    return revenue - expenses;
  }

  /**
   * Identify largest accounts requiring attention
   */
  identifyLargestAccounts() {
    if (!this.trialBalance) return [];

    const sorted = [...this.trialBalance]
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
      .slice(0, 10)
      .map(account => ({
        account: account.name,
        type: account.type,
        balance: account.balance,
        percentage: ((Math.abs(account.balance) / this.getTotalAssets()) * 100).toFixed(2) + '%',
        riskLevel: this.assessAccountRisk(account)
      }));

    return sorted;
  }

  /**
   * Assess risk level for specific account
   */
  assessAccountRisk(account) {
    const totalAssets = this.getTotalAssets();
    const percentageOfAssets = (Math.abs(account.balance) / totalAssets) * 100;

    // High risk accounts based on type and materiality
    const highRiskAccountTypes = [
      'Accounts Receivable',
      'Inventory',
      'Investments',
      'Goodwill',
      'Deferred Tax',
      'Fair Value Assets',
      'Related Party Receivables'
    ];

    const mediumRiskAccountTypes = [
      'Fixed Assets',
      'Long-term Debt',
      'Pension Liabilities',
      'Warranty Reserves',
      'Contingent Liabilities'
    ];

    if (percentageOfAssets > 5 || highRiskAccountTypes.some(type => account.name.includes(type))) {
      return 'HIGH';
    } else if (percentageOfAssets > 2 || mediumRiskAccountTypes.some(type => account.name.includes(type))) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * Calculate financial ratios for risk assessment
   */
  calculateFinancialRatios() {
    const totalAssets = this.getTotalAssets();
    const totalLiabilities = this.getTotalLiabilities();
    const totalEquity = this.getTotalEquity();
    const revenue = this.getRevenue();
    const netIncome = this.getNetIncome();

    const receivables = this.getAccountBalance('Accounts Receivable');
    const inventory = this.getAccountBalance('Inventory');
    const currentAssets = this.getAccountBalance('Current Assets');
    const currentLiabilities = this.getAccountBalance('Current Liabilities');

    return {
      'Debt-to-Equity': totalEquity !== 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A',
      'Debt-to-Assets': totalAssets !== 0 ? (totalLiabilities / totalAssets).toFixed(2) : 'N/A',
      'Current Ratio': currentLiabilities !== 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A',
      'ROA': totalAssets !== 0 ? ((netIncome / totalAssets) * 100).toFixed(2) + '%' : 'N/A',
      'ROE': totalEquity !== 0 ? ((netIncome / totalEquity) * 100).toFixed(2) + '%' : 'N/A',
      'Profit Margin': revenue !== 0 ? ((netIncome / revenue) * 100).toFixed(2) + '%' : 'N/A',
      'Asset Turnover': totalAssets !== 0 ? (revenue / totalAssets).toFixed(2) : 'N/A',
      'Days Sales Outstanding': receivables !== 0 ? ((receivables / revenue) * 365).toFixed(0) + ' days' : 'N/A',
      'Days Inventory Outstanding': inventory !== 0 ? ((inventory / this.getCOGS()) * 365).toFixed(0) + ' days' : 'N/A'
    };
  }

  /**
   * Get account balance by name
   */
  getAccountBalance(accountName) {
    if (!this.trialBalance) return 0;
    const account = this.trialBalance.find(acc =>
      acc.name.toLowerCase().includes(accountName.toLowerCase())
    );
    return account ? account.balance : 0;
  }

  /**
   * Get COGS
   */
  getCOGS() {
    if (!this.trialBalance) return 0;
    const cogs = this.trialBalance.find(acc =>
      acc.name.toLowerCase().includes('cost of goods') || acc.name.toLowerCase().includes('cogs')
    );
    return cogs ? cogs.balance : 0;
  }

  /**
   * Analyze year-over-year trends
   */
  analyzeTrends() {
    if (!this.priorYearData || !this.trialBalance) return null;

    const currentRevenue = this.getRevenue();
    const priorRevenue = this.priorYearData.revenue || 0;
    const revenueChange = priorRevenue !== 0 ? ((currentRevenue - priorRevenue) / priorRevenue) * 100 : 0;

    const currentAssets = this.getTotalAssets();
    const priorAssets = this.priorYearData.totalAssets || 0;
    const assetChange = priorAssets !== 0 ? ((currentAssets - priorAssets) / priorAssets) * 100 : 0;

    return {
      revenueGrowth: revenueChange.toFixed(2) + '%',
      assetGrowth: assetChange.toFixed(2) + '%',
      trendIndicators: [
        revenueChange > 20 ? { indicator: 'Significant revenue growth', risk: 'HIGH' } : null,
        assetChange > 20 ? { indicator: 'Significant asset growth', risk: 'HIGH' } : null,
        revenueChange < -10 ? { indicator: 'Revenue decline', risk: 'MEDIUM' } : null,
        assetChange < -10 ? { indicator: 'Asset decline', risk: 'MEDIUM' } : null
      ].filter(Boolean)
    };
  }

  /**
   * Get industry-specific risks
   */
  getIndustryRisks() {
    const industry = this.entityDetails.industry?.toLowerCase();
    if (!industry) return null;

    // Match industry to risk library
    const industryMap = {
      banking: 'banking',
      finance: 'banking',
      manufacturing: 'manufacturing',
      retail: 'retail',
      ecommerce: 'retail',
      technology: 'technology',
      software: 'technology',
      healthcare: 'healthcare',
      insurance: 'insurance',
      energy: 'energy',
      oil: 'energy',
      realstate: 'realestate',
      realestate: 'realestate',
      utilities: 'utilities',
      government: 'government',
      nonprofit: 'nonprofit'
    };

    const mappedIndustry = Object.keys(industryMap).find(key =>
      industry.includes(key)
    );

    if (mappedIndustry) {
      return industryRiskLibrary.getIndustryRisks(industryMap[mappedIndustry]);
    }
    return null;
  }

  /**
   * Identify risk indicators from trial balance
   */
  identifyRiskIndicators() {
    const indicators = [];

    // Revenue red flags
    const revenue = this.getRevenue();
    const receivables = this.getAccountBalance('Accounts Receivable');
    const dso = revenue !== 0 ? (receivables / revenue) * 365 : 0;
    if (dso > 90) {
      indicators.push({
        type: 'RECEIVABLES',
        indicator: 'High Days Sales Outstanding',
        value: dso.toFixed(0) + ' days',
        risk: 'MEDIUM',
        recommendation: 'Consider increasing receivable reserves and testing collectibility'
      });
    }

    // Inventory red flags
    const inventory = this.getAccountBalance('Inventory');
    const cogs = this.getCOGS();
    const dio = cogs !== 0 ? (inventory / cogs) * 365 : 0;
    if (dio > 120) {
      indicators.push({
        type: 'INVENTORY',
        indicator: 'High Days Inventory Outstanding',
        value: dio.toFixed(0) + ' days',
        risk: 'HIGH',
        recommendation: 'Test for obsolescence and valuation appropriateness'
      });
    }

    // Profitability red flags
    const netIncome = this.getNetIncome();
    const totalAssets = this.getTotalAssets();
    const roa = totalAssets !== 0 ? (netIncome / totalAssets) : 0;
    if (roa < -0.05) {
      indicators.push({
        type: 'PROFITABILITY',
        indicator: 'Negative profitability',
        value: (roa * 100).toFixed(2) + '%',
        risk: 'HIGH',
        recommendation: 'Assess going concern assumption'
      });
    }

    // Liquidity red flags
    const currentAssets = this.getAccountBalance('Current Assets');
    const currentLiabilities = this.getAccountBalance('Current Liabilities');
    const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
    if (currentRatio < 1.0) {
      indicators.push({
        type: 'LIQUIDITY',
        indicator: 'Poor liquidity position',
        value: currentRatio.toFixed(2),
        risk: 'HIGH',
        recommendation: 'Assess going concern and refinancing plans'
      });
    }

    // Debt burden red flags
    const totalLiabilities = this.getTotalLiabilities();
    const totalEquity = this.getTotalEquity();
    const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;
    if (debtToEquity > 2) {
      indicators.push({
        type: 'DEBT',
        indicator: 'High leverage',
        value: debtToEquity.toFixed(2),
        risk: 'MEDIUM',
        recommendation: 'Review debt covenants and compliance'
      });
    }

    return indicators;
  }

  /**
   * Assess inherent risks from industry and entity characteristics
   */
  assessInherentRisks() {
    const industryRisks = this.getIndustryRisks();
    const assessments = [];

    if (!industryRisks) {
      return [
        {
          riskArea: 'Industry Not Classified',
          inherentRisk: 'MEDIUM',
          description: 'Unable to apply industry-specific risk assessment'
        }
      ];
    }

    // Add industry-specific risks
    industryRisks.inherentRisks.forEach(risk => {
      assessments.push({
        riskArea: risk,
        inherentRisk: 'MEDIUM-HIGH',
        description: `Industry-specific risk: ${risk}`,
        auditFocus: `Develop specific procedures for ${risk}`
      });
    });

    return assessments;
  }

  /**
   * Calculate risk scores for accounts
   */
  calculateRiskScores() {
    const scores = {
      overall: { score: 0, level: 'MEDIUM' },
      byArea: {}
    };

    let totalScore = 0;
    const indicators = this.identifyRiskIndicators();

    // Calculate based on indicators
    indicators.forEach(indicator => {
      const riskValue = indicator.risk === 'HIGH' ? 30 : 20;
      totalScore += riskValue;
    });

    // Calculate based on financial metrics
    const ratios = this.calculateFinancialRatios();
    // Add ratio-based scoring logic
    // ...

    scores.overall.score = Math.min((totalScore / 100) * 100, 100);
    scores.overall.level = scores.overall.score > 70 ? 'HIGH' : scores.overall.score > 40 ? 'MEDIUM' : 'LOW';

    // Add area-specific scores
    const largestAccounts = this.identifyLargestAccounts();
    largestAccounts.forEach(account => {
      scores.byArea[account.account] = account.riskLevel;
    });

    return scores;
  }

  /**
   * Recommend audit procedures based on risks identified
   */
  recommendAuditProcedures() {
    const procedures = [];
    const indicators = this.identifyRiskIndicators();
    const largestAccounts = this.identifyLargestAccounts();

    // Add procedures for each high-risk indicator
    indicators.forEach(indicator => {
      procedures.push({
        area: indicator.type,
        procedure: indicator.recommendation,
        priority: indicator.risk === 'HIGH' ? 'P1' : 'P2',
        estimatedHours: indicator.risk === 'HIGH' ? 20 : 10,
        controlTesting: true,
        substantiveTesting: true
      });
    });

    // Add procedures for large accounts
    largestAccounts.filter(acc => acc.riskLevel !== 'LOW').forEach(account => {
      procedures.push({
        area: account.account,
        procedure: `Detailed testing of ${account.account} (${account.percentage} of assets)`,
        priority: account.riskLevel === 'HIGH' ? 'P1' : 'P2',
        estimatedHours: account.riskLevel === 'HIGH' ? 30 : 15,
        controlTesting: true,
        substantiveTesting: true
      });
    });

    return procedures.sort((a, b) => a.priority.localeCompare(b.priority));
  }

  /**
   * Identify primary focus areas for audit
   */
  identifyFocusAreas() {
    const focusAreas = [];
    const indicators = this.identifyRiskIndicators();
    const largestAccounts = this.identifyLargestAccounts();
    const riskScores = this.calculateRiskScores();

    if (riskScores.overall.level === 'HIGH') {
      focusAreas.push({
        area: 'Overall Risk Assessment',
        focus: 'Significant audit risks identified - comprehensive procedures required',
        procedures: ['Expanded substantive testing', 'Increased management consultation', 'Enhanced quality control review']
      });
    }

    // Add focus areas for each high-risk indicator
    indicators.filter(ind => ind.risk === 'HIGH').forEach(indicator => {
      focusAreas.push({
        area: indicator.indicator,
        focus: indicator.recommendation,
        procedures: this.getRelatedProcedures(indicator.type)
      });
    });

    return focusAreas;
  }

  /**
   * Get related procedures for risk type
   */
  getRelatedProcedures(riskType) {
    const procedures = {
      RECEIVABLES: [
        'Test receivable aging and collectibility',
        'Evaluate bad debt reserve adequacy',
        'Request customer confirmations',
        'Test post-period collections',
        'Evaluate related party receivables'
      ],
      INVENTORY: [
        'Observe physical inventory count',
        'Test pricing and valuation',
        'Evaluate obsolescence reserve',
        'Test inventory cutoff',
        'Review inventory movement analysis'
      ],
      PROFITABILITY: [
        'Perform analytical procedures on revenue',
        'Evaluate accounting estimates',
        'Test revenue transactions',
        'Assess going concern assumption',
        'Review subsequent period performance'
      ],
      LIQUIDITY: [
        'Review liquidity analysis',
        'Assess financing arrangements',
        'Evaluate covenant compliance',
        'Review cash flow projections',
        'Consider going concern implications'
      ],
      DEBT: [
        'Verify debt terms and conditions',
        'Test covenant compliance',
        'Evaluate debt classification',
        'Review refinancing plans',
        'Test interest calculations'
      ]
    };

    return procedures[riskType] || [];
  }
}

export default SmartRiskEngineV2;
