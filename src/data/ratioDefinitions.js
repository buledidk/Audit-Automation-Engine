/**
 * COMPREHENSIVE FINANCIAL RATIO DEFINITIONS
 * Complete library of ratios used in audit, investor, and credit analysis
 * Organised by category with formulas, benchmarks, interpretation, and ISA/FRS references
 *
 * Categories: Profitability, Liquidity, Solvency, Efficiency, Investor/Market, Cash Flow
 */

// ============================================================================
// PROFITABILITY RATIOS
// ============================================================================
export const PROFITABILITY_RATIOS = {
  grossProfitMargin: {
    id: 'grossProfitMargin',
    name: 'Gross Profit Margin',
    category: 'Profitability',
    formula: '(Revenue - Cost of Sales) / Revenue × 100',
    formulaFn: (data) => data.revenue ? ((data.revenue - data.costOfSales) / data.revenue) * 100 : null,
    inputs: ['revenue', 'costOfSales'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      manufacturing: { low: 20, median: 30, high: 45 },
      retail: { low: 25, median: 35, high: 50 },
      technology: { low: 50, median: 65, high: 80 },
      services: { low: 40, median: 55, high: 70 },
      construction: { low: 10, median: 18, high: 30 },
      financialServices: { low: 30, median: 45, high: 65 },
      property: { low: 25, median: 40, high: 60 },
      healthcare: { low: 35, median: 50, high: 65 }
    },
    interpretation: {
      increasing: 'Improving pricing power, cost control, or mix shift to higher-margin products',
      decreasing: 'Rising input costs, pricing pressure, or adverse product mix changes',
      auditSignificance: 'ISA 520 — significant year-on-year changes may indicate revenue recognition or cost of sales misstatement'
    },
    redFlags: [
      'Margin significantly above industry norm — possible revenue overstatement or cost understatement',
      'Sudden margin improvement near period end — potential cutoff manipulation',
      'Gross margin inconsistent with pricing analysis — investigate side agreements'
    ],
    references: { isa: ['ISA 520', 'ISA 240'], frs: ['FRS 102 s5', 'FRS 102 s23'] }
  },

  operatingProfitMargin: {
    id: 'operatingProfitMargin',
    name: 'Operating Profit Margin (EBIT Margin)',
    category: 'Profitability',
    formula: 'Operating Profit / Revenue × 100',
    formulaFn: (data) => data.revenue ? (data.operatingProfit / data.revenue) * 100 : null,
    inputs: ['operatingProfit', 'revenue'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      manufacturing: { low: 5, median: 10, high: 18 },
      retail: { low: 3, median: 6, high: 12 },
      technology: { low: 10, median: 20, high: 35 },
      services: { low: 8, median: 15, high: 25 },
      construction: { low: 2, median: 5, high: 10 },
      financialServices: { low: 15, median: 25, high: 40 },
      property: { low: 15, median: 30, high: 50 },
      healthcare: { low: 8, median: 15, high: 25 }
    },
    interpretation: {
      increasing: 'Improved operational efficiency, overhead control, or scale benefits',
      decreasing: 'Rising overheads, restructuring costs, or operational inefficiency',
      auditSignificance: 'Compare to gross margin trend — divergence indicates overhead issues vs trading issues'
    },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s5'] }
  },

  netProfitMargin: {
    id: 'netProfitMargin',
    name: 'Net Profit Margin',
    category: 'Profitability',
    formula: 'Profit After Tax / Revenue × 100',
    formulaFn: (data) => data.revenue ? (data.profitAfterTax / data.revenue) * 100 : null,
    inputs: ['profitAfterTax', 'revenue'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      manufacturing: { low: 3, median: 7, high: 12 },
      retail: { low: 1, median: 4, high: 8 },
      technology: { low: 8, median: 15, high: 25 },
      services: { low: 5, median: 10, high: 20 },
      construction: { low: 1, median: 3, high: 7 },
      financialServices: { low: 10, median: 20, high: 35 },
      property: { low: 10, median: 20, high: 40 },
      healthcare: { low: 5, median: 10, high: 18 }
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: ['FRS 102 s5'] }
  },

  returnOnEquity: {
    id: 'returnOnEquity',
    name: 'Return on Equity (ROE)',
    category: 'Profitability',
    formula: 'Profit After Tax / Total Equity × 100',
    formulaFn: (data) => data.totalEquity ? (data.profitAfterTax / data.totalEquity) * 100 : null,
    inputs: ['profitAfterTax', 'totalEquity'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 8, median: 15, high: 25 },
      financialServices: { low: 8, median: 12, high: 18 },
      technology: { low: 15, median: 25, high: 40 }
    },
    interpretation: {
      increasing: 'Improved profitability or efficient use of shareholders funds',
      decreasing: 'Declining profits or excessive equity base',
      auditSignificance: 'High ROE from high leverage warrants going concern consideration'
    },
    dupontDecomposition: {
      formula: 'Net Profit Margin × Asset Turnover × Equity Multiplier',
      components: ['netProfitMargin', 'assetTurnover', 'equityMultiplier'],
      note: 'DuPont analysis separates profitability, efficiency, and leverage contributions to ROE'
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: ['FRS 102 s6'] }
  },

  returnOnAssets: {
    id: 'returnOnAssets',
    name: 'Return on Assets (ROA)',
    category: 'Profitability',
    formula: 'Profit After Tax / Total Assets × 100',
    formulaFn: (data) => data.totalAssets ? (data.profitAfterTax / data.totalAssets) * 100 : null,
    inputs: ['profitAfterTax', 'totalAssets'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 3, median: 6, high: 12 },
      financialServices: { low: 0.5, median: 1, high: 2 },
      property: { low: 2, median: 5, high: 10 }
    },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s4'] }
  },

  returnOnCapitalEmployed: {
    id: 'returnOnCapitalEmployed',
    name: 'Return on Capital Employed (ROCE)',
    category: 'Profitability',
    formula: 'EBIT / (Total Assets - Current Liabilities) × 100',
    formulaFn: (data) => {
      const capitalEmployed = data.totalAssets - data.currentLiabilities;
      return capitalEmployed ? (data.operatingProfit / capitalEmployed) * 100 : null;
    },
    inputs: ['operatingProfit', 'totalAssets', 'currentLiabilities'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 8, median: 15, high: 25 },
      manufacturing: { low: 10, median: 18, high: 28 },
      retail: { low: 10, median: 20, high: 35 }
    },
    interpretation: {
      auditSignificance: 'Key measure for assessing going concern viability — compare to cost of capital'
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: ['FRS 102 s4'] }
  },

  ebitdaMargin: {
    id: 'ebitdaMargin',
    name: 'EBITDA Margin',
    category: 'Profitability',
    formula: '(Operating Profit + Depreciation + Amortisation) / Revenue × 100',
    formulaFn: (data) => data.revenue ? ((data.operatingProfit + (data.depreciation || 0) + (data.amortisation || 0)) / data.revenue) * 100 : null,
    inputs: ['operatingProfit', 'depreciation', 'amortisation', 'revenue'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      manufacturing: { low: 8, median: 15, high: 25 },
      technology: { low: 15, median: 30, high: 45 },
      property: { low: 40, median: 55, high: 75 },
      services: { low: 10, median: 20, high: 35 }
    },
    references: { isa: ['ISA 520'], frs: [] }
  }
};

// ============================================================================
// LIQUIDITY RATIOS
// ============================================================================
export const LIQUIDITY_RATIOS = {
  currentRatio: {
    id: 'currentRatio',
    name: 'Current Ratio',
    category: 'Liquidity',
    formula: 'Current Assets / Current Liabilities',
    formulaFn: (data) => data.currentLiabilities ? data.currentAssets / data.currentLiabilities : null,
    inputs: ['currentAssets', 'currentLiabilities'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 1.0, median: 1.5, high: 2.5 },
      manufacturing: { low: 1.2, median: 1.8, high: 2.5 },
      retail: { low: 0.8, median: 1.2, high: 1.8 },
      services: { low: 1.0, median: 1.5, high: 2.0 },
      construction: { low: 1.0, median: 1.3, high: 2.0 }
    },
    interpretation: {
      below1: 'CRITICAL — entity may be unable to meet short-term obligations; going concern risk (ISA 570)',
      between1and15: 'Adequate but tight — monitor cash flow closely',
      above2: 'Strong liquidity — but very high ratios may indicate inefficient use of assets',
      auditSignificance: 'Key ISA 570 going concern indicator; significant changes warrant investigation'
    },
    redFlags: [
      'Current ratio < 1.0 — immediate going concern consideration',
      'Sudden decline from prior year — investigate large current liability increases',
      'Ratio artificially inflated by year-end window dressing'
    ],
    references: { isa: ['ISA 570', 'ISA 520'], frs: ['FRS 102 s4'] }
  },

  quickRatio: {
    id: 'quickRatio',
    name: 'Quick Ratio (Acid Test)',
    category: 'Liquidity',
    formula: '(Current Assets - Inventories) / Current Liabilities',
    formulaFn: (data) => data.currentLiabilities ? (data.currentAssets - (data.inventories || 0)) / data.currentLiabilities : null,
    inputs: ['currentAssets', 'inventories', 'currentLiabilities'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 0.7, median: 1.0, high: 1.5 },
      manufacturing: { low: 0.6, median: 0.9, high: 1.3 },
      retail: { low: 0.3, median: 0.5, high: 0.8 },
      services: { low: 0.8, median: 1.2, high: 1.8 }
    },
    interpretation: {
      auditSignificance: 'More conservative than current ratio — excludes inventory which may be slow-moving or obsolete'
    },
    references: { isa: ['ISA 570', 'ISA 520'], frs: ['FRS 102 s4'] }
  },

  cashRatio: {
    id: 'cashRatio',
    name: 'Cash Ratio',
    category: 'Liquidity',
    formula: 'Cash and Cash Equivalents / Current Liabilities',
    formulaFn: (data) => data.currentLiabilities ? data.cashAndEquivalents / data.currentLiabilities : null,
    inputs: ['cashAndEquivalents', 'currentLiabilities'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 0.1, median: 0.3, high: 0.6 }
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s7'] }
  },

  workingCapital: {
    id: 'workingCapital',
    name: 'Working Capital',
    category: 'Liquidity',
    formula: 'Current Assets - Current Liabilities',
    formulaFn: (data) => data.currentAssets - data.currentLiabilities,
    inputs: ['currentAssets', 'currentLiabilities'],
    unit: '£',
    higherIsBetter: true,
    interpretation: {
      negative: 'Net current liability position — key ISA 570 going concern indicator',
      auditSignificance: 'Negative working capital is explicitly listed as going concern indicator in ISA 570.A3'
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s4'] }
  },

  defensiveInterval: {
    id: 'defensiveInterval',
    name: 'Defensive Interval (Days)',
    category: 'Liquidity',
    formula: '(Cash + Short-term Investments + Receivables) / Daily Operating Expenses',
    formulaFn: (data) => {
      const liquidAssets = (data.cashAndEquivalents || 0) + (data.shortTermInvestments || 0) + (data.tradeReceivables || 0);
      const dailyExpenses = data.totalOperatingExpenses / 365;
      return dailyExpenses ? liquidAssets / dailyExpenses : null;
    },
    inputs: ['cashAndEquivalents', 'shortTermInvestments', 'tradeReceivables', 'totalOperatingExpenses'],
    unit: 'days',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 30, median: 60, high: 120 }
    },
    interpretation: {
      auditSignificance: 'Number of days entity can operate from liquid assets without additional revenue — critical for going concern'
    },
    references: { isa: ['ISA 570'], frs: [] }
  }
};

// ============================================================================
// SOLVENCY / GEARING RATIOS
// ============================================================================
export const SOLVENCY_RATIOS = {
  debtToEquity: {
    id: 'debtToEquity',
    name: 'Debt to Equity Ratio',
    category: 'Solvency',
    formula: 'Total Debt / Total Equity',
    formulaFn: (data) => data.totalEquity ? data.totalDebt / data.totalEquity : null,
    inputs: ['totalDebt', 'totalEquity'],
    unit: 'x',
    higherIsBetter: false,
    benchmarks: {
      general: { low: 0.3, median: 0.8, high: 1.5 },
      property: { low: 0.5, median: 1.0, high: 2.0 },
      technology: { low: 0, median: 0.3, high: 0.8 },
      financialServices: { low: 2, median: 5, high: 10 }
    },
    interpretation: {
      auditSignificance: 'High gearing increases going concern risk; check loan covenants (ISA 570)'
    },
    references: { isa: ['ISA 570', 'ISA 520'], frs: ['FRS 102 s11'] }
  },

  gearingRatio: {
    id: 'gearingRatio',
    name: 'Gearing Ratio',
    category: 'Solvency',
    formula: 'Total Debt / (Total Debt + Total Equity) × 100',
    formulaFn: (data) => {
      const totalCapital = data.totalDebt + data.totalEquity;
      return totalCapital ? (data.totalDebt / totalCapital) * 100 : null;
    },
    inputs: ['totalDebt', 'totalEquity'],
    unit: '%',
    higherIsBetter: false,
    benchmarks: {
      general: { low: 20, median: 40, high: 60 }
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s11'] }
  },

  interestCover: {
    id: 'interestCover',
    name: 'Interest Cover',
    category: 'Solvency',
    formula: 'EBIT / Interest Expense',
    formulaFn: (data) => data.interestExpense ? data.operatingProfit / data.interestExpense : null,
    inputs: ['operatingProfit', 'interestExpense'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 2.0, median: 5.0, high: 10.0 },
      property: { low: 1.5, median: 3.0, high: 6.0 }
    },
    interpretation: {
      below1: 'CRITICAL — entity cannot cover interest from operating profits; covenant breach likely',
      between1and3: 'Tight — vulnerable to downturn; assess loan covenant headroom',
      above5: 'Comfortable interest cover',
      auditSignificance: 'Below 2x is ISA 570 going concern indicator — check loan covenants and renewal terms'
    },
    redFlags: [
      'Interest cover < 1.5x — immediate covenant breach risk',
      'Declining trend — assess headroom on covenants',
      'Interest cover propped up by one-off gains'
    ],
    references: { isa: ['ISA 570', 'ISA 520'], frs: ['FRS 102 s11'] }
  },

  debtServiceCoverageRatio: {
    id: 'debtServiceCoverageRatio',
    name: 'Debt Service Coverage Ratio (DSCR)',
    category: 'Solvency',
    formula: 'EBITDA / (Interest + Principal Repayments)',
    formulaFn: (data) => {
      const ebitda = data.operatingProfit + (data.depreciation || 0) + (data.amortisation || 0);
      const debtService = (data.interestExpense || 0) + (data.principalRepayments || 0);
      return debtService ? ebitda / debtService : null;
    },
    inputs: ['operatingProfit', 'depreciation', 'amortisation', 'interestExpense', 'principalRepayments'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 1.2, median: 1.8, high: 3.0 }
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s11'] }
  },

  debtToAssets: {
    id: 'debtToAssets',
    name: 'Debt to Assets',
    category: 'Solvency',
    formula: 'Total Debt / Total Assets × 100',
    formulaFn: (data) => data.totalAssets ? (data.totalDebt / data.totalAssets) * 100 : null,
    inputs: ['totalDebt', 'totalAssets'],
    unit: '%',
    higherIsBetter: false,
    benchmarks: {
      general: { low: 20, median: 40, high: 60 }
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s4'] }
  },

  equityMultiplier: {
    id: 'equityMultiplier',
    name: 'Equity Multiplier (Financial Leverage)',
    category: 'Solvency',
    formula: 'Total Assets / Total Equity',
    formulaFn: (data) => data.totalEquity ? data.totalAssets / data.totalEquity : null,
    inputs: ['totalAssets', 'totalEquity'],
    unit: 'x',
    higherIsBetter: false,
    benchmarks: { general: { low: 1.5, median: 2.0, high: 3.0 } },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s4'] }
  }
};

// ============================================================================
// EFFICIENCY / ACTIVITY RATIOS
// ============================================================================
export const EFFICIENCY_RATIOS = {
  debtorDays: {
    id: 'debtorDays',
    name: 'Debtor Days (DSO)',
    category: 'Efficiency',
    formula: '(Trade Receivables / Revenue) × 365',
    formulaFn: (data) => data.revenue ? (data.tradeReceivables / data.revenue) * 365 : null,
    inputs: ['tradeReceivables', 'revenue'],
    unit: 'days',
    higherIsBetter: false,
    benchmarks: {
      general: { low: 25, median: 45, high: 75 },
      manufacturing: { low: 30, median: 50, high: 70 },
      retail: { low: 5, median: 15, high: 30 },
      services: { low: 30, median: 50, high: 80 },
      construction: { low: 40, median: 65, high: 90 }
    },
    interpretation: {
      increasing: 'Slower collection — check credit terms, recoverability, provision adequacy',
      decreasing: 'Improved collection efficiency or tighter credit terms',
      auditSignificance: 'Significant increase warrants recoverability testing; may indicate revenue recognition issues (ISA 240)'
    },
    redFlags: [
      'Debtor days significantly above industry norm — possible fictitious revenue',
      'Increasing trend despite stable revenue — collection issues or overstatement',
      'Large concentration in aged brackets — provision may be understated'
    ],
    references: { isa: ['ISA 520', 'ISA 540', 'ISA 505'], frs: ['FRS 102 s11'] }
  },

  creditorDays: {
    id: 'creditorDays',
    name: 'Creditor Days (DPO)',
    category: 'Efficiency',
    formula: '(Trade Payables / Cost of Sales) × 365',
    formulaFn: (data) => data.costOfSales ? (data.tradePayables / data.costOfSales) * 365 : null,
    inputs: ['tradePayables', 'costOfSales'],
    unit: 'days',
    higherIsBetter: null,
    benchmarks: {
      general: { low: 25, median: 40, high: 65 },
      manufacturing: { low: 30, median: 45, high: 60 },
      retail: { low: 20, median: 35, high: 50 },
      construction: { low: 30, median: 50, high: 75 }
    },
    interpretation: {
      increasing: 'Stretching payments — may indicate cash flow problems or better negotiation',
      decreasing: 'Paying faster — improved liquidity or early payment discounts',
      auditSignificance: 'Very high creditor days may indicate unrecorded liabilities or going concern stress'
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: ['FRS 102 s11'] }
  },

  inventoryDays: {
    id: 'inventoryDays',
    name: 'Inventory Days (DIO)',
    category: 'Efficiency',
    formula: '(Inventories / Cost of Sales) × 365',
    formulaFn: (data) => data.costOfSales ? (data.inventories / data.costOfSales) * 365 : null,
    inputs: ['inventories', 'costOfSales'],
    unit: 'days',
    higherIsBetter: false,
    benchmarks: {
      manufacturing: { low: 30, median: 60, high: 100 },
      retail: { low: 20, median: 40, high: 70 },
      construction: { low: 15, median: 30, high: 60 }
    },
    interpretation: {
      auditSignificance: 'High inventory days — test for obsolescence, NRV write-downs (ISA 501)'
    },
    references: { isa: ['ISA 501', 'ISA 520', 'ISA 540'], frs: ['FRS 102 s13'] }
  },

  cashConversionCycle: {
    id: 'cashConversionCycle',
    name: 'Cash Conversion Cycle',
    category: 'Efficiency',
    formula: 'Debtor Days + Inventory Days - Creditor Days',
    formulaFn: (data) => {
      const debtorDays = data.revenue ? (data.tradeReceivables / data.revenue) * 365 : 0;
      const inventoryDays = data.costOfSales ? ((data.inventories || 0) / data.costOfSales) * 365 : 0;
      const creditorDays = data.costOfSales ? ((data.tradePayables || 0) / data.costOfSales) * 365 : 0;
      return debtorDays + inventoryDays - creditorDays;
    },
    inputs: ['tradeReceivables', 'revenue', 'inventories', 'costOfSales', 'tradePayables'],
    unit: 'days',
    higherIsBetter: false,
    benchmarks: {
      general: { low: 20, median: 50, high: 90 },
      retail: { low: -10, median: 10, high: 40 }
    },
    interpretation: {
      auditSignificance: 'Negative CCC means company is funded by suppliers — assess sustainability'
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: [] }
  },

  assetTurnover: {
    id: 'assetTurnover',
    name: 'Asset Turnover',
    category: 'Efficiency',
    formula: 'Revenue / Total Assets',
    formulaFn: (data) => data.totalAssets ? data.revenue / data.totalAssets : null,
    inputs: ['revenue', 'totalAssets'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 0.5, median: 0.8, high: 1.5 },
      retail: { low: 1.5, median: 2.0, high: 3.0 },
      services: { low: 1.0, median: 1.5, high: 2.5 },
      property: { low: 0.05, median: 0.1, high: 0.2 }
    },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s4'] }
  },

  fixedAssetTurnover: {
    id: 'fixedAssetTurnover',
    name: 'Fixed Asset Turnover',
    category: 'Efficiency',
    formula: 'Revenue / Net Fixed Assets',
    formulaFn: (data) => data.netFixedAssets ? data.revenue / data.netFixedAssets : null,
    inputs: ['revenue', 'netFixedAssets'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: { general: { low: 1.0, median: 3.0, high: 6.0 } },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s17'] }
  },

  revenuePerEmployee: {
    id: 'revenuePerEmployee',
    name: 'Revenue per Employee',
    category: 'Efficiency',
    formula: 'Revenue / Average Number of Employees',
    formulaFn: (data) => data.employees ? data.revenue / data.employees : null,
    inputs: ['revenue', 'employees'],
    unit: '£',
    higherIsBetter: true,
    benchmarks: {
      general: { low: 80000, median: 150000, high: 300000 },
      technology: { low: 150000, median: 250000, high: 500000 },
      services: { low: 60000, median: 120000, high: 200000 },
      manufacturing: { low: 80000, median: 150000, high: 250000 }
    },
    references: { isa: ['ISA 520'], frs: [] }
  }
};

// ============================================================================
// INVESTOR / MARKET RATIOS
// ============================================================================
export const INVESTOR_RATIOS = {
  earningsPerShare: {
    id: 'earningsPerShare',
    name: 'Earnings per Share (EPS)',
    category: 'Investor',
    formula: 'Profit After Tax / Weighted Average Shares Outstanding',
    formulaFn: (data) => data.sharesOutstanding ? data.profitAfterTax / data.sharesOutstanding : null,
    inputs: ['profitAfterTax', 'sharesOutstanding'],
    unit: 'p',
    higherIsBetter: true,
    note: 'Required disclosure for listed entities under IAS 33',
    references: { isa: ['ISA 520'], frs: ['IAS 33'] }
  },

  priceEarningsRatio: {
    id: 'priceEarningsRatio',
    name: 'Price/Earnings Ratio (P/E)',
    category: 'Investor',
    formula: 'Share Price / Earnings per Share',
    formulaFn: (data) => {
      const eps = data.sharesOutstanding ? data.profitAfterTax / data.sharesOutstanding : 0;
      return eps ? data.sharePrice / eps : null;
    },
    inputs: ['sharePrice', 'profitAfterTax', 'sharesOutstanding'],
    unit: 'x',
    higherIsBetter: null,
    benchmarks: {
      ftse250: { low: 8, median: 16, high: 30 },
      technology: { low: 20, median: 35, high: 60 },
      utilities: { low: 10, median: 14, high: 20 }
    },
    interpretation: {
      high: 'Market expects future earnings growth; or overvalued',
      low: 'Market expects earnings decline; or undervalued; or distressed',
      auditSignificance: 'Very low P/E may indicate market concern about going concern or earnings quality'
    },
    references: { isa: ['ISA 570'], frs: ['IAS 33'] }
  },

  dividendYield: {
    id: 'dividendYield',
    name: 'Dividend Yield',
    category: 'Investor',
    formula: 'Dividends per Share / Share Price × 100',
    formulaFn: (data) => data.sharePrice ? (data.dividendPerShare / data.sharePrice) * 100 : null,
    inputs: ['dividendPerShare', 'sharePrice'],
    unit: '%',
    higherIsBetter: null,
    benchmarks: {
      ftse250: { low: 1.0, median: 3.0, high: 6.0 }
    },
    references: { isa: [], frs: ['FRS 102 s6'] }
  },

  dividendCover: {
    id: 'dividendCover',
    name: 'Dividend Cover',
    category: 'Investor',
    formula: 'Profit After Tax / Total Dividends Paid',
    formulaFn: (data) => data.totalDividends ? data.profitAfterTax / data.totalDividends : null,
    inputs: ['profitAfterTax', 'totalDividends'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: { general: { low: 1.5, median: 2.5, high: 4.0 } },
    interpretation: {
      below1: 'Dividends exceed earnings — unsustainable; funded from reserves or borrowing',
      auditSignificance: 'Dividend legality under s830 CA 2006 — must be paid from distributable reserves'
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s6'] }
  },

  priceToBookValue: {
    id: 'priceToBookValue',
    name: 'Price to Book Value (P/B)',
    category: 'Investor',
    formula: 'Market Capitalisation / Total Equity (Net Assets)',
    formulaFn: (data) => data.totalEquity ? data.marketCap / data.totalEquity : null,
    inputs: ['marketCap', 'totalEquity'],
    unit: 'x',
    higherIsBetter: null,
    benchmarks: {
      ftse250: { low: 0.8, median: 2.0, high: 5.0 }
    },
    interpretation: {
      below1: 'Market values company below book value — possible asset impairment or distress',
      auditSignificance: 'P/B < 1.0 is impairment trigger indicator under IAS 36/FRS 102 s27'
    },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s27', 'IAS 36'] }
  },

  enterpriseValueToEbitda: {
    id: 'enterpriseValueToEbitda',
    name: 'EV/EBITDA',
    category: 'Investor',
    formula: '(Market Cap + Total Debt - Cash) / EBITDA',
    formulaFn: (data) => {
      const ev = (data.marketCap || 0) + (data.totalDebt || 0) - (data.cashAndEquivalents || 0);
      const ebitda = data.operatingProfit + (data.depreciation || 0) + (data.amortisation || 0);
      return ebitda ? ev / ebitda : null;
    },
    inputs: ['marketCap', 'totalDebt', 'cashAndEquivalents', 'operatingProfit', 'depreciation', 'amortisation'],
    unit: 'x',
    higherIsBetter: null,
    benchmarks: {
      ftse250: { low: 6, median: 12, high: 20 },
      technology: { low: 12, median: 20, high: 35 },
      property: { low: 10, median: 18, high: 28 }
    },
    references: { isa: [], frs: [] }
  },

  priceToSales: {
    id: 'priceToSales',
    name: 'Price to Sales (P/S)',
    category: 'Investor',
    formula: 'Market Capitalisation / Revenue',
    formulaFn: (data) => data.revenue ? data.marketCap / data.revenue : null,
    inputs: ['marketCap', 'revenue'],
    unit: 'x',
    higherIsBetter: null,
    benchmarks: {
      ftse250: { low: 0.5, median: 1.5, high: 4.0 }
    },
    references: { isa: [], frs: [] }
  },

  freeCashFlowYield: {
    id: 'freeCashFlowYield',
    name: 'Free Cash Flow Yield',
    category: 'Investor',
    formula: 'Free Cash Flow / Market Capitalisation × 100',
    formulaFn: (data) => data.marketCap ? (data.freeCashFlow / data.marketCap) * 100 : null,
    inputs: ['freeCashFlow', 'marketCap'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: {
      ftse250: { low: 2, median: 5, high: 10 }
    },
    references: { isa: [], frs: [] }
  },

  totalShareholderReturn: {
    id: 'totalShareholderReturn',
    name: 'Total Shareholder Return (TSR)',
    category: 'Investor',
    formula: '(Share Price End - Share Price Start + Dividends) / Share Price Start × 100',
    formulaFn: (data) => data.sharePriceStart ? ((data.sharePriceEnd - data.sharePriceStart + (data.dividendPerShare || 0)) / data.sharePriceStart) * 100 : null,
    inputs: ['sharePriceEnd', 'sharePriceStart', 'dividendPerShare'],
    unit: '%',
    higherIsBetter: true,
    references: { isa: [], frs: [] }
  }
};

// ============================================================================
// CASH FLOW RATIOS
// ============================================================================
export const CASH_FLOW_RATIOS = {
  operatingCashFlowRatio: {
    id: 'operatingCashFlowRatio',
    name: 'Operating Cash Flow Ratio',
    category: 'Cash Flow',
    formula: 'Cash Flow from Operations / Current Liabilities',
    formulaFn: (data) => data.currentLiabilities ? data.operatingCashFlow / data.currentLiabilities : null,
    inputs: ['operatingCashFlow', 'currentLiabilities'],
    unit: 'x',
    higherIsBetter: true,
    benchmarks: { general: { low: 0.4, median: 0.8, high: 1.5 } },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s7'] }
  },

  cashFlowToDebt: {
    id: 'cashFlowToDebt',
    name: 'Cash Flow to Debt',
    category: 'Cash Flow',
    formula: 'Cash Flow from Operations / Total Debt × 100',
    formulaFn: (data) => data.totalDebt ? (data.operatingCashFlow / data.totalDebt) * 100 : null,
    inputs: ['operatingCashFlow', 'totalDebt'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: { general: { low: 15, median: 30, high: 60 } },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s7'] }
  },

  freeCashFlow: {
    id: 'freeCashFlow',
    name: 'Free Cash Flow',
    category: 'Cash Flow',
    formula: 'Cash Flow from Operations - Capital Expenditure',
    formulaFn: (data) => data.operatingCashFlow - (data.capitalExpenditure || 0),
    inputs: ['operatingCashFlow', 'capitalExpenditure'],
    unit: '£',
    higherIsBetter: true,
    interpretation: {
      negative: 'Entity consumes more cash than it generates — may need external financing',
      auditSignificance: 'Negative FCF over multiple years is going concern indicator'
    },
    references: { isa: ['ISA 570'], frs: ['FRS 102 s7'] }
  },

  cashConversionRatio: {
    id: 'cashConversionRatio',
    name: 'Cash Conversion Ratio',
    category: 'Cash Flow',
    formula: 'Cash Flow from Operations / Operating Profit × 100',
    formulaFn: (data) => data.operatingProfit ? (data.operatingCashFlow / data.operatingProfit) * 100 : null,
    inputs: ['operatingCashFlow', 'operatingProfit'],
    unit: '%',
    higherIsBetter: true,
    benchmarks: { general: { low: 70, median: 90, high: 110 } },
    interpretation: {
      below70: 'Poor cash conversion — profits not translating to cash; investigate working capital movement',
      above100: 'Healthy — cash generation exceeds accrual profits (common with D&A)',
      auditSignificance: 'Low conversion may indicate earnings management (accrual manipulation) — ISA 240'
    },
    redFlags: [
      'Consistently low cash conversion with growing profits — potential revenue overstatement',
      'Sudden drop in conversion — investigate large working capital movements'
    ],
    references: { isa: ['ISA 240', 'ISA 520', 'ISA 570'], frs: ['FRS 102 s7'] }
  },

  capexToRevenue: {
    id: 'capexToRevenue',
    name: 'Capital Expenditure to Revenue',
    category: 'Cash Flow',
    formula: 'Capital Expenditure / Revenue × 100',
    formulaFn: (data) => data.revenue ? (data.capitalExpenditure / data.revenue) * 100 : null,
    inputs: ['capitalExpenditure', 'revenue'],
    unit: '%',
    higherIsBetter: null,
    benchmarks: {
      manufacturing: { low: 3, median: 6, high: 12 },
      technology: { low: 5, median: 10, high: 20 },
      retail: { low: 2, median: 5, high: 10 },
      property: { low: 10, median: 20, high: 40 }
    },
    references: { isa: ['ISA 520'], frs: ['FRS 102 s17'] }
  }
};

// ============================================================================
// ALTMAN Z-SCORE (BANKRUPTCY PREDICTION)
// ============================================================================
export const COMPOSITE_SCORES = {
  altmanZScore: {
    id: 'altmanZScore',
    name: 'Altman Z-Score (Bankruptcy Prediction)',
    category: 'Composite',
    formula: 'Z = 1.2×A + 1.4×B + 3.3×C + 0.6×D + 1.0×E',
    components: {
      A: { formula: 'Working Capital / Total Assets', weight: 1.2 },
      B: { formula: 'Retained Earnings / Total Assets', weight: 1.4 },
      C: { formula: 'EBIT / Total Assets', weight: 3.3 },
      D: { formula: 'Market Value of Equity / Total Liabilities', weight: 0.6 },
      E: { formula: 'Revenue / Total Assets', weight: 1.0 }
    },
    formulaFn: (data) => {
      const A = data.totalAssets ? (data.currentAssets - data.currentLiabilities) / data.totalAssets : 0;
      const B = data.totalAssets ? (data.retainedEarnings || 0) / data.totalAssets : 0;
      const C = data.totalAssets ? data.operatingProfit / data.totalAssets : 0;
      const totalLiabilities = (data.currentLiabilities || 0) + (data.nonCurrentLiabilities || 0);
      const D = totalLiabilities ? (data.marketCap || data.totalEquity) / totalLiabilities : 0;
      const E = data.totalAssets ? data.revenue / data.totalAssets : 0;
      return (1.2 * A) + (1.4 * B) + (3.3 * C) + (0.6 * D) + (1.0 * E);
    },
    inputs: ['currentAssets', 'currentLiabilities', 'totalAssets', 'retainedEarnings', 'operatingProfit', 'marketCap', 'totalEquity', 'nonCurrentLiabilities', 'revenue'],
    interpretation: {
      above3: { zone: 'Safe Zone', description: 'Low probability of bankruptcy', color: '#22c55e' },
      between18and3: { zone: 'Grey Zone', description: 'Some risk — monitor closely', color: '#f59e0b' },
      below18: { zone: 'Distress Zone', description: 'High probability of bankruptcy within 2 years', color: '#ef4444' }
    },
    privateCompanyVariant: {
      formula: 'Z\' = 0.717×A + 0.847×B + 3.107×C + 0.420×D\' + 0.998×E',
      note: 'D\' uses book value of equity instead of market value',
      thresholds: { safe: 2.9, grey: 1.23 }
    },
    auditSignificance: 'Z-Score < 1.8 is strong going concern indicator — requires ISA 570 procedures',
    references: { isa: ['ISA 570', 'ISA 520'], frs: ['FRS 102 s2', 'FRS 102 s32'] }
  },

  piotroskiFScore: {
    id: 'piotroskiFScore',
    name: 'Piotroski F-Score (Financial Strength)',
    category: 'Composite',
    formula: 'Score 0-9 based on 9 binary signals',
    signals: [
      { name: 'Positive ROA', test: 'ROA > 0', points: 1 },
      { name: 'Positive Operating Cash Flow', test: 'OCF > 0', points: 1 },
      { name: 'Improving ROA', test: 'ROA(t) > ROA(t-1)', points: 1 },
      { name: 'Cash Flow > Net Income', test: 'OCF > Net Income (quality of earnings)', points: 1 },
      { name: 'Decreasing Leverage', test: 'Long-term debt ratio decreased', points: 1 },
      { name: 'Improving Liquidity', test: 'Current ratio improved', points: 1 },
      { name: 'No Dilution', test: 'No new shares issued', points: 1 },
      { name: 'Improving Gross Margin', test: 'Gross margin increased', points: 1 },
      { name: 'Improving Asset Turnover', test: 'Asset turnover increased', points: 1 }
    ],
    formulaFn: (data, priorYear) => {
      let score = 0;
      if (data.totalAssets && data.profitAfterTax / data.totalAssets > 0) score++;
      if (data.operatingCashFlow > 0) score++;
      if (priorYear?.totalAssets && (data.profitAfterTax / data.totalAssets) > (priorYear.profitAfterTax / priorYear.totalAssets)) score++;
      if (data.operatingCashFlow > data.profitAfterTax) score++;
      if (priorYear?.totalDebt && data.totalDebt < priorYear.totalDebt) score++;
      if (priorYear?.currentLiabilities && (data.currentAssets / data.currentLiabilities) > (priorYear.currentAssets / priorYear.currentLiabilities)) score++;
      if (!data.newSharesIssued) score++;
      if (priorYear?.revenue && priorYear?.costOfSales) {
        const gmCurrent = (data.revenue - data.costOfSales) / data.revenue;
        const gmPrior = (priorYear.revenue - priorYear.costOfSales) / priorYear.revenue;
        if (gmCurrent > gmPrior) score++;
      }
      if (priorYear?.totalAssets && (data.revenue / data.totalAssets) > (priorYear.revenue / priorYear.totalAssets)) score++;
      return score;
    },
    interpretation: {
      score8to9: { label: 'Strong', description: 'High financial strength — potential value stock' },
      score5to7: { label: 'Moderate', description: 'Reasonable financial health' },
      score0to4: { label: 'Weak', description: 'Deteriorating financials — higher risk' }
    },
    references: { isa: ['ISA 520', 'ISA 570'], frs: [] }
  }
};

// ============================================================================
// COMPLETE RATIO INDEX
// ============================================================================
export const ALL_RATIOS = {
  ...PROFITABILITY_RATIOS,
  ...LIQUIDITY_RATIOS,
  ...SOLVENCY_RATIOS,
  ...EFFICIENCY_RATIOS,
  ...INVESTOR_RATIOS,
  ...CASH_FLOW_RATIOS,
  ...COMPOSITE_SCORES
};

export const RATIO_CATEGORIES = {
  Profitability: Object.keys(PROFITABILITY_RATIOS),
  Liquidity: Object.keys(LIQUIDITY_RATIOS),
  Solvency: Object.keys(SOLVENCY_RATIOS),
  Efficiency: Object.keys(EFFICIENCY_RATIOS),
  Investor: Object.keys(INVESTOR_RATIOS),
  'Cash Flow': Object.keys(CASH_FLOW_RATIOS),
  Composite: Object.keys(COMPOSITE_SCORES)
};

/**
 * Get all ratios with red flags (audit risk indicators)
 */
export function getRatiosWithRedFlags() {
  return Object.values(ALL_RATIOS).filter(r => r.redFlags?.length > 0);
}

/**
 * Get all ratios relevant to a specific ISA
 */
export function getRatiosByISA(isaNumber) {
  const target = `ISA ${isaNumber}`;
  return Object.values(ALL_RATIOS).filter(r =>
    r.references?.isa?.some(ref => ref.includes(String(isaNumber)))
  );
}

/**
 * Get industry benchmarks for a specific ratio
 */
export function getBenchmarks(ratioId, industry) {
  const ratio = ALL_RATIOS[ratioId];
  if (!ratio?.benchmarks) return null;
  return ratio.benchmarks[industry] || ratio.benchmarks.general || null;
}
