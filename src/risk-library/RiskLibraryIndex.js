/**
 * Industry Risk Library Index
 * =========================
 * Comprehensive risk catalog for all sectors
 * Organized by industry with inherent risks, control risks, and materiality drivers
 */

export const industryRiskLibrary = {
  version: '2026.1',
  lastUpdated: '2026-03-20',
  description: 'Comprehensive risk library across all industries',

  sectors: {
    banking: {
      name: 'Banking and Financial Services',
      riskAreas: [
        'Loan portfolio quality',
        'Asset impairment',
        'Interest rate risk',
        'Credit risk',
        'Liquidity risk',
        'Regulatory compliance',
        'Fair value measurements',
        'Trading activities',
        'Market risk',
        'Operational risk'
      ],
      inherentRisks: [
        'Complex financial instruments',
        'Significant estimates (loan loss allowances)',
        'Regulatory sensitivity',
        'Large transaction volumes',
        'Fair value measurements',
        'Related party transactions'
      ],
      keyAuditAreas: [
        { area: 'Loan Loss Allowance', risk: 'Understated provisions', indicator: 'NPL ratio > industry average' },
        { area: 'Interest Income', risk: 'Cutoff, completeness', indicator: 'High loan growth' },
        { area: 'Trading Securities', risk: 'Fair value, existence', indicator: 'Volatile market conditions' },
        { area: 'Deposit Liabilities', risk: 'Completeness', indicator: 'High deposit growth' },
        { area: 'Regulatory Capital', risk: 'Compliance breach', indicator: 'Ratio near minimum' }
      ]
    },

    manufacturing: {
      name: 'Manufacturing',
      riskAreas: [
        'Inventory valuation',
        'Revenue recognition',
        'Asset impairment',
        'Production complexity',
        'Cost allocation',
        'Supply chain',
        'Capital equipment',
        'Warranty obligations',
        'Commodity price exposure',
        'Labor productivity'
      ],
      inherentRisks: [
        'Significant inventory holdings',
        'Complex cost allocations',
        'Judgmental estimates (obsolescence)',
        'Long production cycles',
        'Related party supply relationships',
        'Capital-intensive operations'
      ],
      keyAuditAreas: [
        { area: 'Inventory', risk: 'Overvaluation, obsolescence', indicator: 'Slow-moving items, old stock' },
        { area: 'COGS', risk: 'Cutoff, allocation', indicator: 'Significant adjustments' },
        { area: 'Fixed Assets', risk: 'Impairment', indicator: 'Underutilized assets' },
        { area: 'Accruals', risk: 'Warranty, returns', indicator: 'Product quality issues' },
        { area: 'Revenue', risk: 'Side agreements', indicator: 'Large contracts' }
      ]
    },

    retail: {
      name: 'Retail and E-Commerce',
      riskAreas: [
        'Revenue recognition',
        'Inventory management',
        'Return and allowance',
        'Supply chain disruption',
        'Receivables quality',
        'Store closures',
        'Online fraud',
        'Promotional discounts',
        'Goodwill impairment',
        'Same-store sales decline'
      ],
      inherentRisks: [
        'High-volume, low-value transactions',
        'Inventory cutoff complexity',
        'Seasonal variations',
        'Return and exchange complexity',
        'Point-of-sale system dependency',
        'Customer fraud risk'
      ],
      keyAuditAreas: [
        { area: 'Inventory', risk: 'Cutoff, shrinkage', indicator: 'Physical count variances' },
        { area: 'Revenue', risk: 'Completeness, cutoff', indicator: 'Month-end adjustments' },
        { area: 'Receivables', risk: 'Collectibility', indicator: 'Aging analysis' },
        { area: 'Returns', risk: 'Completeness, timing', indicator: 'Post-period adjustments' },
        { area: 'Impairment', risk: 'Asset carrying values', indicator: 'Store closures, performance' }
      ]
    },

    technology: {
      name: 'Technology and Software',
      riskAreas: [
        'Revenue recognition (SaaS, licensing)',
        'Capitalization vs expensing',
        'Impairment risk',
        'Cybersecurity incidents',
        'Intangible assets',
        'R&D spending',
        'Employee stock compensation',
        'Customer concentration',
        'Subscription churn',
        'Going concern (pre-revenue)'
      ],
      inherentRisks: [
        'Complex revenue contracts',
        'Significant capitalized software',
        'High-growth volatility',
        'Judgment in capitalization',
        'Rapidly changing technology',
        'Customer concentration risk'
      ],
      keyAuditAreas: [
        { area: 'Revenue', risk: 'Completeness, recognition timing', indicator: 'Deferred revenue increasing' },
        { area: 'Capitalized Software', risk: 'Recoverability', indicator: 'Asset impairment indicators' },
        { area: 'Stock Compensation', risk: 'Valuation accuracy', indicator: 'Volatile stock price' },
        { area: 'Going Concern', risk: 'Cash burn rate', indicator: 'Pre-revenue, limited runway' },
        { area: 'Cybersecurity', risk: 'Undisclosed incidents', indicator: 'Data breach incidents' }
      ]
    },

    healthcare: {
      name: 'Healthcare Providers and Hospitals',
      riskAreas: [
        'Patient revenue recognition',
        'Charity care and bad debt',
        'Malpractice reserves',
        'Pension obligations',
        'Medicare/Medicaid compliance',
        'Patient safety incidents',
        'Equipment valuations',
        'Clinical trial accounting',
        'Regulatory penalties',
        'Provider consolidation'
      ],
      inherentRisks: [
        'Significant estimates (bad debt, claims)',
        'Regulatory complexity',
        'Multiple revenue streams',
        'Complex payer arrangements',
        'Patient confidentiality requirements',
        'Significant litigation exposure'
      ],
      keyAuditAreas: [
        { area: 'Patient Receivables', risk: 'Collectibility, valuation', indicator: 'Days sales outstanding' },
        { area: 'Charity Care', risk: 'Completeness, valuation', indicator: 'Volume of uninsured patients' },
        { area: 'Malpractice Reserve', risk: 'Adequacy, measurement', indicator: 'Pending claims' },
        { area: 'Medicare Compliance', risk: 'Billing accuracy, penalties', indicator: 'Audit findings' },
        { area: 'Pension Obligations', risk: 'Significant liabilities', indicator: 'Overfunded/underfunded status' }
      ]
    },

    insurance: {
      name: 'Insurance and Reinsurance',
      riskAreas: [
        'Loss reserves adequacy',
        'Premium revenue recognition',
        'Reinsurance accounting',
        'Investment portfolio',
        'Catastrophe losses',
        'Valuation of intangibles',
        'Policy lapse rates',
        'Actuarial estimates',
        'Regulatory capital',
        'Claims management'
      ],
      inherentRisks: [
        'Highly judgmental estimates (loss reserves)',
        'Significant underwriting risk',
        'Complex reinsurance arrangements',
        'Investment market exposure',
        'Regulatory requirements',
        'Catastrophic loss exposure'
      ],
      keyAuditAreas: [
        { area: 'Loss Reserves', risk: 'Understatement, weakness', indicator: 'Adverse loss development' },
        { area: 'Premium Revenue', risk: 'Completeness, timing', indicator: 'Policy mix changes' },
        { area: 'Reinsurance', risk: 'Collectibility, existence', indicator: 'Significant reinsurance asset' },
        { area: 'Investments', risk: 'Fair value, impairment', indicator: 'Market volatility' },
        { area: 'Actuarial Assumptions', risk: 'Unrealistic assumptions', indicator: 'Reserve releases' }
      ]
    },

    energy: {
      name: 'Oil, Gas and Utilities',
      riskAreas: [
        'Reserve estimation',
        'Depreciation and depletion',
        'Asset impairment',
        'Commodity price fluctuation',
        'Environmental liabilities',
        'Pipeline integrity',
        'Regulatory compliance',
        'Derivative accounting',
        'Abandonments',
        'Project cost escalation'
      ],
      inherentRisks: [
        'Complex reserve estimates',
        'Long useful lives and judgment',
        'Environmental exposure',
        'Commodity price volatility',
        'Large capital projects',
        'Regulatory sensitivity'
      ],
      keyAuditAreas: [
        { area: 'Reserve Estimates', risk: 'Overstatement', indicator: 'Commodity price volatility' },
        { area: 'DD&A', risk: 'Inappropriate useful lives', indicator: 'Reserve revisions' },
        { area: 'Impairment Testing', risk: 'Fair value challenges', indicator: 'Asset write-downs' },
        { area: 'Environmental', risk: 'Undisclosed liabilities', indicator: 'Regulatory actions' },
        { area: 'Derivatives', risk: 'Ineffective hedges', indicator: 'Volatility in fair values' }
      ]
    },

    realestate: {
      name: 'Real Estate and Construction',
      riskAreas: [
        'Revenue recognition (percentage of completion)',
        'Contract profitability',
        'Property impairment',
        'Joint venture accounting',
        'Lease classification',
        'Development costs',
        'Environmental issues',
        'Warranty reserves',
        'Refinancing risk',
        'Tenant concentration'
      ],
      inherentRisks: [
        'Significant estimates (POC, impairment)',
        'Complex contract terms',
        'Joint venture complications',
        'Large transaction values',
        'Long project cycles',
        'Environmental risks'
      ],
      keyAuditAreas: [
        { area: 'Revenue (POC)', risk: 'Overstatement, cutoff', indicator: 'Large projects, new contracts' },
        { area: 'Property Valuation', risk: 'Impairment, fair value', indicator: 'Market downturn' },
        { area: 'Joint Ventures', risk: 'Accounting treatment', indicator: 'Control assessment changes' },
        { area: 'Development Costs', risk: 'Capitalization appropriateness', indicator: 'Project delays' },
        { area: 'Warranty Reserves', risk: 'Adequacy', indicator: 'Defect claims, litigation' }
      ]
    },

    utilities: {
      name: 'Water, Electricity, and Gas Utilities',
      riskAreas: [
        'Rate regulation',
        'Asset valuation',
        'Infrastructure maintenance',
        'Environmental compliance',
        'Pension obligations',
        'Customer deposits',
        'Unbilled revenue',
        'Commodity costs',
        'Aging infrastructure',
        'Cybersecurity (critical infrastructure)'
      ],
      inherentRisks: [
        'Regulatory framework dependency',
        'Large fixed asset base',
        'Estimation complexity',
        'Environmental sensitivity',
        'Significant pension liabilities',
        'Infrastructure aging'
      ],
      keyAuditAreas: [
        { area: 'Rate Base', risk: 'Compliance with regulations', indicator: 'Regulatory changes' },
        { area: 'Asset Valuation', risk: 'Depreciation appropriateness', indicator: 'Asset lives' },
        { area: 'Environmental', risk: 'Compliance, remediation costs', indicator: 'Regulatory actions' },
        { area: 'Unbilled Revenue', risk: 'Completeness, cutoff', indicator: 'Estimation accuracy' },
        { area: 'Pension Liability', risk: 'Significant obligations', indicator: 'Funded status' }
      ]
    },

    government: {
      name: 'Government and Public Sector',
      riskAreas: [
        'Grant compliance',
        'Appropriation limits',
        'Interfund transactions',
        'Debt restrictions',
        'Pension liabilities',
        'Tax revenue volatility',
        'Budget compliance',
        'Internal control weaknesses',
        'Federal audit requirements',
        'Fraud and corruption'
      ],
      inherentRisks: [
        'Complex grant requirements',
        'Political environment',
        'Public accountability pressure',
        'Limited financial resources',
        'Significant pension obligations',
        'Multiple funding sources'
      ],
      keyAuditAreas: [
        { area: 'Grant Compliance', risk: 'Non-compliance with terms', indicator: 'Grant requirements' },
        { area: 'Budget Compliance', risk: 'Appropriation overruns', indicator: 'Spending analysis' },
        { area: 'Pension Liability', risk: 'Significant unfunded obligations', indicator: 'Funded status' },
        { area: 'Interfund Transfers', risk: 'Accounting treatment', indicator: 'Transfer analysis' },
        { area: 'Fraud Risk', risk: 'Misappropriation of funds', indicator: 'Segregation of duties' }
      ]
    },

    nonprofit: {
      name: 'Non-Profit Organizations',
      riskAreas: [
        'Revenue recognition (contributions, grants)',
        'Functional expense allocation',
        'Donor restrictions',
        'Going concern',
        'Board governance',
        'Related party transactions',
        'Compliance with tax law',
        'Pension obligations',
        'Endowment management',
        'Fraud and embezzlement'
      ],
      inherentRisks: [
        'Limited donor diversification',
        'Subjective revenue recognition',
        'Complex restriction tracking',
        'Volunteer management',
        'Limited financial controls',
        'Management expertise gaps'
      ],
      keyAuditAreas: [
        { area: 'Contribution Revenue', risk: 'Completeness, valuation', indicator: 'Large grants, pledges' },
        { area: 'Donor Restrictions', risk: 'Accuracy of classification', indicator: 'Complex restrictions' },
        { area: 'Functional Allocation', risk: 'Reasonableness of allocation', indicator: 'Admin ratio' },
        { area: 'Going Concern', risk: 'Financial sustainability', indicator: 'Donor concentration, cash flow' },
        { area: 'Fraud Risk', risk: 'Misappropriation', indicator: 'Weak controls, override risk' }
      ]
    }
  },

  /**
   * Get industry-specific risks
   */
  getIndustryRisks: function(industry) {
    return this.sectors[industry] || null;
  },

  /**
   * Get all industries
   */
  getAllIndustries: function() {
    return Object.keys(this.sectors).map(key => ({
      key: key,
      name: this.sectors[key].name
    }));
  },

  /**
   * Get risk areas for industry
   */
  getRiskAreas: function(industry) {
    const sector = this.sectors[industry];
    return sector ? sector.riskAreas : [];
  },

  /**
   * Get key audit areas with indicators
   */
  getKeyAuditAreas: function(industry) {
    const sector = this.sectors[industry];
    return sector ? sector.keyAuditAreas : [];
  },

  /**
   * Get materiality drivers for industry
   */
  getMaterialityDrivers: function(industry) {
    const sector = this.sectors[industry];
    if (!sector) return [];

    return sector.keyAuditAreas.map(area => ({
      area: area.area,
      driver: `${area.area} - ${area.risk}`,
      benchmark: this.getMaterialityBenchmark(industry, area.area)
    }));
  },

  /**
   * Get industry-specific materiality benchmarks
   */
  getMaterialityBenchmark: function(industry, area) {
    const benchmarks = {
      banking: { 'Loan Loss Allowance': '0.5-1% of loans', 'Interest Income': '5% of revenue' },
      manufacturing: { 'Inventory': '0.5% of inventory', 'COGS': '1% of revenue' },
      retail: { 'Inventory': '0.25% of inventory', 'Sales Returns': '0.5% of revenue' },
      technology: { 'Revenue': '5-10% of revenue', 'R&D': '2-3% of R&D' },
      healthcare: { 'Patient Revenue': '1% of revenue', 'Malpractice': '0.5% of expected claims' },
      insurance: { 'Loss Reserves': '5% of reserves', 'Premium Revenue': '1% of revenue' },
      energy: { 'Reserve Estimates': '5% of reserves', 'Depreciation': '1% of gross PP&E' },
      realestate: { 'Revenue (POC)': '2-3% of revenue', 'Property Valuation': '1-2% of assets' },
      utilities: { 'Rate Base': '0.5% of rate base', 'Unbilled Revenue': '0.5% of revenue' },
      government: { 'Grant Compliance': '0.5% of grants', 'Appropriation': '0.5% of budget' },
      nonprofit: { 'Contributions': '2-3% of contributions', 'Functional Allocation': '1% of operating expenses' }
    };

    return benchmarks[industry]?.[area] || 'Industry standard benchmarks';
  }
};

export default industryRiskLibrary;
