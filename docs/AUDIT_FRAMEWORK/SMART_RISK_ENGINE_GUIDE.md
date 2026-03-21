# Smart Risk Engine v2.0 - User Guide

## Overview

The Smart Risk Engine v2.0 is an intelligent, data-driven risk assessment system that automatically:
- Analyzes trial balance data to identify red flags
- Applies industry-specific risk frameworks
- Calculates risk scores and metrics
- Recommends tailored audit procedures
- Generates focus areas for audit engagement

---

## Quick Start

### 1. Import and Initialize

```javascript
import SmartRiskEngineV2 from './src/services/smartRiskEngineV2.js';

// Initialize with entity details and trial balance
const engine = new SmartRiskEngineV2(
  {
    entityName: 'ACME Manufacturing Inc.',
    industry: 'Manufacturing',
    fiscalYearEnd: '2026-12-31',
    ownership: 'Publicly Traded',
    isFirstTimeAudit: false,
    significantChanges: false,
    newAccounting: false,
    relatedPartyTransactions: true
  },
  trialBalanceData, // Array of account objects
  priorYearData    // Optional prior year data for trend analysis
);
```

### 2. Execute Full Risk Assessment

```javascript
const results = await engine.performRiskAssessment();

// Results include:
// - entityAnalysis: Entity classification and risk factors
// - trialBalanceAnalysis: Financial position and ratios
// - riskIndicators: Specific red flags identified
// - inherentRisks: Industry-specific risks
// - riskScores: Overall and area-specific risk ratings
// - auditProcedures: Recommended procedures with estimates
// - focusAreas: Primary audit focus areas
```

---

## Trial Balance Format

Expected structure for trial balance data:

```javascript
const trialBalance = [
  {
    accountNumber: '1000',
    name: 'Cash and Cash Equivalents',
    type: 'Asset',
    balance: 5000000,
    priorYearBalance: 3000000  // Optional
  },
  {
    accountNumber: '1200',
    name: 'Accounts Receivable',
    type: 'Asset',
    balance: 15000000,
    allowanceForDoubtful: 500000
  },
  {
    accountNumber: '1300',
    name: 'Inventory',
    type: 'Asset',
    balance: 20000000
  },
  {
    accountNumber: '2000',
    name: 'Accounts Payable',
    type: 'Liability',
    balance: 8000000
  },
  {
    accountNumber: '4000',
    name: 'Sales Revenue',
    type: 'Revenue',
    balance: -100000000  // Negative for revenue
  },
  {
    accountNumber: '5000',
    name: 'Cost of Goods Sold',
    type: 'Expense',
    balance: 60000000
  }
  // ... more accounts
];
```

---

## Analysis Modules

### 1. Entity Analysis

**What it does**: Classifies entity by size, identifies risk factors

```javascript
const entityAnalysis = engine.analyzeEntityCharacteristics();

// Returns:
{
  entity: 'ACME Manufacturing',
  industry: 'Manufacturing',
  entitySize: { size: 'Large', threshold: 'PIE considerations apply' },
  industryRisks: {
    name: 'Manufacturing',
    riskAreas: ['Inventory valuation', 'Revenue recognition', ...],
    inherentRisks: [...]
  },
  riskFactors: ['Significant related party activity']
}
```

**Use Case**: Understand entity risk profile before detailed testing

---

### 2. Trial Balance Analysis

**What it does**: Analyzes financial position and identifies largest accounts

```javascript
const tbAnalysis = engine.analyzeTrialBalance();

// Returns:
{
  totalAssets: 150000000,
  totalLiabilities: 50000000,
  totalEquity: 100000000,
  revenue: 100000000,
  netIncome: 5000000,
  largestAccounts: [
    {
      account: 'Inventory',
      type: 'Asset',
      balance: 20000000,
      percentage: '13.33%',
      riskLevel: 'HIGH'
    },
    // Top 10 accounts...
  ],
  ratios: {
    'Debt-to-Equity': '0.50',
    'Current Ratio': '1.50',
    'ROA': '3.33%',
    'Days Sales Outstanding': '55 days',
    'Days Inventory Outstanding': '122 days'
    // More ratios...
  }
}
```

**Use Case**: Quickly identify where the money is and materiality thresholds

---

### 3. Risk Indicators

**What it does**: Identifies specific red flags from trial balance

```javascript
const indicators = engine.identifyRiskIndicators();

// Returns array of indicators:
[
  {
    type: 'INVENTORY',
    indicator: 'High Days Inventory Outstanding',
    value: '122 days',
    risk: 'HIGH',
    recommendation: 'Test for obsolescence and valuation appropriateness'
  },
  {
    type: 'RECEIVABLES',
    indicator: 'High Days Sales Outstanding',
    value: '65 days',
    risk: 'MEDIUM',
    recommendation: 'Consider increasing receivable reserves'
  },
  // More indicators...
]
```

**Red Flags Detected**:
- **DSO > 90 days**: Collection risk
- **DIO > 120 days**: Obsolescence risk
- **Negative ROA**: Profitability concern
- **Current Ratio < 1.0**: Liquidity crisis
- **Debt-to-Equity > 2**: Solvency concern

**Use Case**: Validate preliminary risk assessment with concrete data

---

### 4. Risk Scores

**What it does**: Calculates overall and area-specific risk ratings

```javascript
const scores = engine.calculateRiskScores();

// Returns:
{
  overall: {
    score: 58,  // 0-100
    level: 'MEDIUM'  // LOW, MEDIUM, HIGH
  },
  byArea: {
    'Inventory': 'HIGH',
    'Accounts Receivable': 'MEDIUM',
    'Fixed Assets': 'LOW',
    // Risk level per major account...
  }
}
```

**Risk Levels**:
- **LOW**: Score < 40 - Standard procedures
- **MEDIUM**: Score 40-70 - Expanded procedures
- **HIGH**: Score > 70 - Comprehensive procedures

**Use Case**: Determine scope and depth of audit procedures

---

### 5. Recommended Audit Procedures

**What it does**: Generates specific, prioritized procedures

```javascript
const procedures = engine.recommendAuditProcedures();

// Returns:
[
  {
    area: 'INVENTORY',
    procedure: 'Test for obsolescence and valuation appropriateness',
    priority: 'P1',  // P1=Urgent, P2=Important
    estimatedHours: 30,
    controlTesting: true,
    substantiveTesting: true
  },
  {
    area: 'Inventory',
    procedure: 'Detailed testing of Inventory (13.33% of assets)',
    priority: 'P1',
    estimatedHours: 40,
    controlTesting: true,
    substantiveTesting: true
  },
  // More procedures...
]
```

**Priority Mapping**:
- **P1**: High-risk areas requiring immediate attention
- **P2**: Important but lower-risk areas

**Use Case**: Auto-generate audit programs and estimate hours

---

### 6. Industry Risk Library

**What it does**: Applies industry-specific risk knowledge

```javascript
const industryRisks = engine.getIndustryRisks();

// For Manufacturing:
{
  name: 'Manufacturing',
  riskAreas: [
    'Inventory valuation',
    'Revenue recognition',
    'Asset impairment',
    // ...
  ],
  keyAuditAreas: [
    {
      area: 'Inventory',
      risk: 'Overvaluation, obsolescence',
      indicator: 'Slow-moving items, old stock'
    },
    {
      area: 'COGS',
      risk: 'Cutoff, allocation',
      indicator: 'Significant adjustments'
    },
    // More areas...
  ]
}
```

**Supported Industries**:
- Banking and Financial Services
- Manufacturing
- Retail and E-Commerce
- Technology and Software
- Healthcare
- Insurance
- Oil, Gas and Utilities
- Real Estate
- Government and Public Sector
- Non-Profit Organizations

**Use Case**: Leverage industry expertise without specialist knowledge

---

## Advanced Usage

### Trend Analysis

```javascript
// Pass prior year data for trend analysis
const engine = new SmartRiskEngineV2(
  entityDetails,
  currentTrialBalance,
  {
    revenue: 95000000,
    totalAssets: 140000000,
    totalLiabilities: 45000000
  }
);

const trends = engine.analyzeTrends();
// Returns revenue growth, asset growth, and trend indicators
```

### Custom Risk Assessment

```javascript
// Get risks for specific account
const accountRisk = engine.assessAccountRisk({
  name: 'Goodwill',
  type: 'Asset',
  balance: 10000000
});

// Returns: HIGH/MEDIUM/LOW

// Get financial ratios
const ratios = engine.calculateFinancialRatios();

// Get account balance
const receivables = engine.getAccountBalance('Accounts Receivable');
```

---

## Integration with AuditEngine

### 1. Auto-Population of Audit Programs

```javascript
// In audit planning phase
const engine = new SmartRiskEngineV2(entityDetails, trialBalance);
const assessment = await engine.performRiskAssessment();

// Use recommended procedures to populate audit programs
assessment.auditProcedures.forEach(proc => {
  auditProgram.addProcedure({
    account: proc.area,
    procedure: proc.procedure,
    timeEstimate: proc.estimatedHours,
    priority: proc.priority
  });
});
```

### 2. Risk Assessment Documentation

```javascript
// Populate risk assessment memo
const riskMemo = {
  overallRisk: assessment.riskScores.overall.level,
  focusAreas: assessment.focusAreas,
  indicators: assessment.riskIndicators,
  procedures: assessment.auditProcedures.filter(p => p.priority === 'P1')
};
```

### 3. Materiality Determination

```javascript
// Get industry-specific materiality drivers
const materialityDrivers = industryRiskLibrary.getMaterialityDrivers(industry);

materialityDrivers.forEach(driver => {
  // Consider in materiality calculation
  // Example: Inventory at 0.5% threshold for manufacturing
});
```

---

## Best Practices

### 1. Data Quality

✓ Ensure trial balance is complete and accurate
✓ Include proper account classification (Asset/Liability/Equity/Revenue/Expense)
✓ Provide prior year data for trend analysis
✓ Include adjusted trial balance (post-close)

### 2. Industry Classification

✓ Correctly classify entity industry for risk library application
✓ Use standard industry names for mapping
✓ Consider multiple industries if conglomerate

### 3. Interpretation

✓ View risk scores as indicators, not absolutes
✓ Validate recommendations with professional judgment
✓ Consider industry benchmarks and entity-specific factors
✓ Update assessment as audit procedures progress

### 4. Procedure Planning

✓ Use P1 procedures for immediate planning
✓ Estimate hours based on entity size and complexity
✓ Validate recommendations with prior year audit program
✓ Adjust for entity-specific factors (management changes, system upgrades, etc.)

---

## Troubleshooting

### Issue: Risk scores seem incorrect

**Solution**:
- Verify trial balance accuracy
- Ensure proper account classification
- Check for unusual account balances
- Validate industry classification

### Issue: No procedures recommended

**Solution**:
- Ensure risk indicators were identified
- Check that industry is properly mapped
- Verify trial balance contains major accounts
- Check for data quality issues

### Issue: Industry not recognized

**Solution**:
- Use industry names from supported list
- Use mapping: Banking → Banking, Tech → Technology, etc.
- Contact administrator for new industry addition

---

## Supported Industries (Risk Library)

| Industry | Key Risk Areas |
|----------|---|
| **Banking** | Loan portfolio, interest rate, credit risk |
| **Manufacturing** | Inventory, COGS, asset impairment |
| **Retail** | Inventory cutoff, returns, goodwill |
| **Technology** | Revenue recognition, capitalization, impairment |
| **Healthcare** | Patient revenue, bad debt, malpractice reserves |
| **Insurance** | Loss reserves, premium recognition, reinsurance |
| **Energy** | Reserve estimates, depreciation, impairment |
| **Real Estate** | Revenue (POC), property valuation, JVs |
| **Utilities** | Rate regulation, infrastructure, unbilled revenue |
| **Government** | Grant compliance, appropriations, budgeting |
| **Non-Profit** | Contribution revenue, restrictions, functional allocation |

---

## Key Metrics Explained

### Days Sales Outstanding (DSO)
- Formula: (Receivables / Revenue) × 365
- High DSO (>90): Collection delays, allowance reserve needed
- Low DSO (<30): Possible aggressive revenue recognition

### Days Inventory Outstanding (DIO)
- Formula: (Inventory / COGS) × 365
- High DIO (>120): Obsolescence risk, slow-moving stock
- Low DIO (<30): Tight inventory management, possible stockouts

### Debt-to-Equity Ratio
- Formula: Total Liabilities / Total Equity
- >2: High leverage, covenant risk
- <0.5: Conservative capital structure

### Current Ratio
- Formula: Current Assets / Current Liabilities
- <1.0: Liquidity pressure, going concern risk
- 1.5-2.0: Healthy liquidity

### Return on Assets (ROA)
- Formula: (Net Income / Total Assets) × 100
- <0: Loss position, profitability concern
- 0-5%: Below average performance
- >10%: Strong profitability

---

**For more information, see**: [Complete Audit Framework Guide](./AUDIT_FRAMEWORK_COMPLETE_GUIDE.md)
