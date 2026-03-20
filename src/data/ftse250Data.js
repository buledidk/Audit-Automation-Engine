/**
 * FTSE 250 SECTOR BENCHMARKS & COMPANY REFERENCE DATA
 * Sector-level financial benchmarks derived from FTSE 250 constituents
 * For peer comparison and investor analysis
 *
 * Sectors aligned with ICB (Industry Classification Benchmark)
 * Last updated: March 2026
 */

// ============================================================================
// FTSE 250 SECTOR BENCHMARKS
// ============================================================================
export const FTSE_250_SECTOR_BENCHMARKS = {
  // ---------------------------------------------------------------------------
  // INDUSTRIALS
  // ---------------------------------------------------------------------------
  industrials: {
    name: 'Industrials',
    icbCode: '2000',
    sampleSize: 38,
    ftseWeight: 14.2,
    representativeCompanies: [
      'Rolls-Royce Holdings', 'BAE Systems', 'Smiths Group', 'IMI', 'Rotork',
      'Morgan Advanced Materials', 'Vesuvius', 'Spirax Group', 'Weir Group', 'Spectris'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 25, median: 33, high: 45 },
      operatingProfitMargin: { low: 6, median: 12, high: 20 },
      netProfitMargin: { low: 4, median: 8, high: 15 },
      returnOnEquity: { low: 8, median: 16, high: 28 },
      returnOnCapitalEmployed: { low: 8, median: 14, high: 24 },
      currentRatio: { low: 1.0, median: 1.4, high: 2.0 },
      quickRatio: { low: 0.7, median: 1.0, high: 1.5 },
      debtToEquity: { low: 0.3, median: 0.7, high: 1.2 },
      interestCover: { low: 3.0, median: 7.0, high: 15.0 },
      debtorDays: { low: 35, median: 55, high: 75 },
      inventoryDays: { low: 40, median: 70, high: 110 },
      creditorDays: { low: 30, median: 50, high: 70 },
      assetTurnover: { low: 0.6, median: 0.9, high: 1.3 },
      ebitdaMargin: { low: 10, median: 18, high: 28 },
      priceEarningsRatio: { low: 10, median: 18, high: 28 },
      dividendYield: { low: 1.5, median: 2.8, high: 4.5 },
      priceToBookValue: { low: 1.0, median: 2.5, high: 5.0 },
      enterpriseValueToEbitda: { low: 7, median: 12, high: 18 }
    },
    keyRisks: ['Cyclical demand', 'Supply chain disruption', 'Currency exposure', 'Capex intensity'],
    regulatoryConsiderations: ['Health & Safety at Work Act 1974', 'Environmental regulations', 'Export controls']
  },

  // ---------------------------------------------------------------------------
  // TECHNOLOGY
  // ---------------------------------------------------------------------------
  technology: {
    name: 'Technology',
    icbCode: '1010',
    sampleSize: 22,
    ftseWeight: 8.5,
    representativeCompanies: [
      'Sage Group', 'Softcat', 'Computacenter', 'Kainos Group', 'Bytes Technology',
      'FDM Group', 'Alfa Financial', 'Auction Technology', 'Oxford Instruments', 'Spirent Communications'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 45, median: 62, high: 82 },
      operatingProfitMargin: { low: 8, median: 18, high: 32 },
      netProfitMargin: { low: 6, median: 14, high: 26 },
      returnOnEquity: { low: 12, median: 25, high: 45 },
      returnOnCapitalEmployed: { low: 12, median: 22, high: 40 },
      currentRatio: { low: 1.0, median: 1.5, high: 2.5 },
      quickRatio: { low: 0.9, median: 1.4, high: 2.2 },
      debtToEquity: { low: 0.0, median: 0.3, high: 0.8 },
      interestCover: { low: 5.0, median: 15.0, high: 40.0 },
      debtorDays: { low: 25, median: 45, high: 70 },
      creditorDays: { low: 20, median: 35, high: 55 },
      assetTurnover: { low: 0.8, median: 1.2, high: 2.0 },
      ebitdaMargin: { low: 12, median: 25, high: 40 },
      revenuePerEmployee: { low: 120000, median: 200000, high: 400000 },
      priceEarningsRatio: { low: 18, median: 30, high: 50 },
      dividendYield: { low: 0.5, median: 1.5, high: 3.0 },
      priceToBookValue: { low: 3.0, median: 6.0, high: 15.0 },
      enterpriseValueToEbitda: { low: 12, median: 20, high: 35 }
    },
    additionalMetrics: {
      arrGrowthRate: { low: 5, median: 15, high: 30, unit: '%' },
      netRevenueRetention: { low: 100, median: 110, high: 130, unit: '%' },
      ruleOf40: { low: 20, median: 35, high: 55, note: 'Revenue growth % + EBITDA margin %' }
    },
    keyRisks: ['Rapid technology change', 'Customer concentration', 'Key person dependency', 'IP protection'],
    regulatoryConsiderations: ['UK GDPR / Data Protection Act 2018', 'Computer Misuse Act 1990', 'PECR']
  },

  // ---------------------------------------------------------------------------
  // FINANCIAL SERVICES
  // ---------------------------------------------------------------------------
  financialServices: {
    name: 'Financial Services',
    icbCode: '3000',
    sampleSize: 30,
    ftseWeight: 18.5,
    representativeCompanies: [
      'IG Group', 'Intermediate Capital', 'Investec', 'Close Brothers', 'Man Group',
      'Quilter', 'Jupiter Fund Management', 'Rathbones Group', 'Ashmore Group', 'CMC Markets'
    ],
    typicalRatios: {
      operatingProfitMargin: { low: 15, median: 28, high: 45 },
      netProfitMargin: { low: 10, median: 22, high: 38 },
      returnOnEquity: { low: 6, median: 12, high: 20 },
      returnOnAssets: { low: 0.3, median: 0.8, high: 1.5 },
      currentRatio: { low: 1.0, median: 1.3, high: 2.0 },
      debtToEquity: { low: 1.0, median: 3.0, high: 8.0 },
      priceEarningsRatio: { low: 8, median: 14, high: 22 },
      dividendYield: { low: 2.0, median: 4.0, high: 7.0 },
      priceToBookValue: { low: 0.6, median: 1.2, high: 2.5 },
      enterpriseValueToEbitda: { low: 6, median: 10, high: 16 }
    },
    additionalMetrics: {
      costToIncomeRatio: { low: 45, median: 60, high: 75, unit: '%' },
      netInterestMargin: { low: 1.5, median: 2.5, high: 4.0, unit: '%' },
      capitalAdequacyRatio: { low: 12, median: 16, high: 22, unit: '%' },
      aumGrowth: { low: -5, median: 8, high: 20, unit: '%' }
    },
    keyRisks: ['Credit risk', 'Market risk', 'Regulatory capital', 'Conduct risk', 'Operational risk'],
    regulatoryConsiderations: ['FCA/PRA regulation', 'FSMA 2000', 'CASS rules', 'MiFID II', 'Basel III/IV']
  },

  // ---------------------------------------------------------------------------
  // REAL ESTATE
  // ---------------------------------------------------------------------------
  realEstate: {
    name: 'Real Estate',
    icbCode: '3500',
    sampleSize: 20,
    ftseWeight: 6.8,
    representativeCompanies: [
      'Segro', 'Unite Group', 'Derwent London', 'Workspace Group', 'Hammerson',
      'Capital & Counties', 'Helical', 'Great Portland Estates', 'Shaftesbury Capital', 'Big Yellow Group'
    ],
    typicalRatios: {
      operatingProfitMargin: { low: 20, median: 45, high: 70 },
      netProfitMargin: { low: 15, median: 35, high: 60 },
      returnOnEquity: { low: 3, median: 8, high: 15 },
      currentRatio: { low: 0.5, median: 1.0, high: 2.0 },
      debtToEquity: { low: 0.2, median: 0.5, high: 1.0 },
      interestCover: { low: 1.5, median: 3.0, high: 6.0 },
      assetTurnover: { low: 0.03, median: 0.08, high: 0.15 },
      priceEarningsRatio: { low: 10, median: 20, high: 35 },
      dividendYield: { low: 2.0, median: 3.5, high: 6.0 },
      priceToBookValue: { low: 0.5, median: 0.8, high: 1.3 }
    },
    additionalMetrics: {
      netAssetValuePerShare: { note: 'Primary valuation metric for REITs' },
      occupancyRate: { low: 85, median: 93, high: 98, unit: '%' },
      netInitialYield: { low: 3.0, median: 4.5, high: 7.0, unit: '%' },
      loanToValue: { low: 15, median: 30, high: 45, unit: '%' }
    },
    keyRisks: ['Valuation risk', 'Tenant default', 'Interest rate sensitivity', 'Planning risk'],
    regulatoryConsiderations: ['REIT regime (CTA 2010)', 'Property Misdescriptions Act', 'Landlord & Tenant Act']
  },

  // ---------------------------------------------------------------------------
  // CONSUMER DISCRETIONARY (RETAIL)
  // ---------------------------------------------------------------------------
  consumerDiscretionary: {
    name: 'Consumer Discretionary / Retail',
    icbCode: '4000',
    sampleSize: 25,
    ftseWeight: 10.2,
    representativeCompanies: [
      'JD Sports', 'Watches of Switzerland', 'WH Smith', 'Dunelm', 'Currys',
      'Howden Joinery', 'Halfords', 'Pets at Home', 'Vistry Group', 'Bellway'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 30, median: 42, high: 55 },
      operatingProfitMargin: { low: 4, median: 9, high: 16 },
      netProfitMargin: { low: 2, median: 6, high: 12 },
      returnOnEquity: { low: 10, median: 20, high: 35 },
      currentRatio: { low: 0.8, median: 1.2, high: 1.8 },
      quickRatio: { low: 0.3, median: 0.6, high: 1.0 },
      debtToEquity: { low: 0.3, median: 0.8, high: 1.5 },
      interestCover: { low: 3.0, median: 7.0, high: 15.0 },
      debtorDays: { low: 5, median: 15, high: 30 },
      inventoryDays: { low: 30, median: 55, high: 90 },
      creditorDays: { low: 25, median: 40, high: 60 },
      assetTurnover: { low: 1.0, median: 1.8, high: 3.0 },
      priceEarningsRatio: { low: 8, median: 15, high: 25 },
      dividendYield: { low: 1.0, median: 2.5, high: 4.5 },
      priceToBookValue: { low: 1.5, median: 3.5, high: 8.0 }
    },
    additionalMetrics: {
      likeForLikeSalesGrowth: { low: -2, median: 3, high: 10, unit: '%' },
      onlineSalesMix: { low: 10, median: 25, high: 50, unit: '%' },
      rentToRevenue: { low: 3, median: 6, high: 12, unit: '%' }
    },
    keyRisks: ['Consumer confidence', 'Online competition', 'Lease obligations (IFRS 16)', 'Inventory obsolescence'],
    regulatoryConsiderations: ['Consumer Rights Act 2015', 'SECR requirements']
  },

  // ---------------------------------------------------------------------------
  // CONSUMER STAPLES
  // ---------------------------------------------------------------------------
  consumerStaples: {
    name: 'Consumer Staples',
    icbCode: '4500',
    sampleSize: 12,
    ftseWeight: 5.5,
    representativeCompanies: [
      'Greggs', 'Cranswick', 'Premier Foods', 'Britvic', 'AG Barr',
      'Hilton Food Group', 'Bakkavor', 'Devro'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 25, median: 35, high: 50 },
      operatingProfitMargin: { low: 5, median: 10, high: 18 },
      netProfitMargin: { low: 3, median: 7, high: 14 },
      returnOnEquity: { low: 10, median: 18, high: 30 },
      currentRatio: { low: 0.8, median: 1.2, high: 1.6 },
      debtToEquity: { low: 0.2, median: 0.6, high: 1.2 },
      interestCover: { low: 4.0, median: 8.0, high: 15.0 },
      inventoryDays: { low: 15, median: 30, high: 50 },
      debtorDays: { low: 20, median: 35, high: 55 },
      priceEarningsRatio: { low: 12, median: 18, high: 28 },
      dividendYield: { low: 1.5, median: 2.8, high: 4.5 }
    },
    keyRisks: ['Input cost inflation', 'Consumer spending patterns', 'Supply chain', 'Regulatory (food safety)'],
    regulatoryConsiderations: ['Food Safety Act 1990', 'Food Standards Agency', 'Packaging regulations']
  },

  // ---------------------------------------------------------------------------
  // HEALTHCARE
  // ---------------------------------------------------------------------------
  healthcare: {
    name: 'Healthcare',
    icbCode: '2000',
    sampleSize: 15,
    ftseWeight: 5.8,
    representativeCompanies: [
      'Hikma Pharmaceuticals', 'ConvaTec', 'Genus', 'Dechra Pharmaceuticals',
      'Spire Healthcare', 'Mediclinic', 'PureTech Health', 'Indivior'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 40, median: 55, high: 72 },
      operatingProfitMargin: { low: 8, median: 16, high: 28 },
      netProfitMargin: { low: 5, median: 12, high: 22 },
      returnOnEquity: { low: 8, median: 15, high: 28 },
      currentRatio: { low: 1.2, median: 1.8, high: 2.8 },
      debtToEquity: { low: 0.2, median: 0.5, high: 1.0 },
      interestCover: { low: 4.0, median: 10.0, high: 20.0 },
      assetTurnover: { low: 0.4, median: 0.7, high: 1.1 },
      priceEarningsRatio: { low: 15, median: 25, high: 40 },
      dividendYield: { low: 0.5, median: 1.8, high: 3.5 },
      priceToBookValue: { low: 2.0, median: 4.0, high: 8.0 }
    },
    additionalMetrics: {
      rdToRevenue: { low: 5, median: 12, high: 25, unit: '%' }
    },
    keyRisks: ['Regulatory approval risk', 'Patent expiry', 'Clinical trial outcomes', 'Pricing regulation'],
    regulatoryConsiderations: ['MHRA regulation', 'NHS procurement', 'Patent protection']
  },

  // ---------------------------------------------------------------------------
  // ENERGY & UTILITIES
  // ---------------------------------------------------------------------------
  energyUtilities: {
    name: 'Energy & Utilities',
    icbCode: '6000',
    sampleSize: 12,
    ftseWeight: 6.5,
    representativeCompanies: [
      'Centrica', 'Drax Group', 'SSE', 'Pennon Group', 'Severn Trent',
      'United Utilities', 'Harbour Energy', 'Energean', 'Diversified Energy'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 15, median: 30, high: 50 },
      operatingProfitMargin: { low: 8, median: 18, high: 30 },
      netProfitMargin: { low: 5, median: 12, high: 22 },
      returnOnEquity: { low: 6, median: 12, high: 20 },
      currentRatio: { low: 0.8, median: 1.1, high: 1.5 },
      debtToEquity: { low: 0.5, median: 1.2, high: 2.5 },
      interestCover: { low: 2.0, median: 4.0, high: 8.0 },
      priceEarningsRatio: { low: 8, median: 14, high: 22 },
      dividendYield: { low: 3.0, median: 5.0, high: 7.5 },
      priceToBookValue: { low: 0.8, median: 1.5, high: 2.5 }
    },
    keyRisks: ['Commodity price volatility', 'Regulatory price controls', 'Environmental liabilities', 'Decommissioning'],
    regulatoryConsiderations: ['Ofgem/Ofwat regulation', 'Environment Act 2021', 'Climate Change Act 2008', 'Energy Act 2023']
  },

  // ---------------------------------------------------------------------------
  // CONSTRUCTION & MATERIALS
  // ---------------------------------------------------------------------------
  construction: {
    name: 'Construction & Materials',
    icbCode: '5000',
    sampleSize: 14,
    ftseWeight: 5.2,
    representativeCompanies: [
      'Balfour Beatty', 'Morgan Sindall', 'Kier Group', 'Galliford Try',
      'Costain Group', 'Marshalls', 'Ibstock', 'Breedon Group', 'Genuit Group'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 10, median: 18, high: 28 },
      operatingProfitMargin: { low: 2, median: 5, high: 10 },
      netProfitMargin: { low: 1, median: 3, high: 7 },
      returnOnEquity: { low: 8, median: 15, high: 25 },
      currentRatio: { low: 1.0, median: 1.2, high: 1.6 },
      quickRatio: { low: 0.8, median: 1.0, high: 1.3 },
      debtToEquity: { low: 0.1, median: 0.4, high: 0.9 },
      interestCover: { low: 3.0, median: 6.0, high: 12.0 },
      debtorDays: { low: 30, median: 50, high: 75 },
      creditorDays: { low: 35, median: 55, high: 80 },
      assetTurnover: { low: 1.0, median: 1.8, high: 3.0 },
      priceEarningsRatio: { low: 6, median: 12, high: 20 },
      dividendYield: { low: 2.0, median: 3.5, high: 5.5 }
    },
    additionalMetrics: {
      orderBook: { note: 'Revenue visibility metric — years of secured work' },
      retentionAgeing: { note: 'Track retention receivables by age' }
    },
    keyRisks: ['Contract profitability', 'Retentions recoverability', 'Subcontractor risk', 'H&S provisions'],
    regulatoryConsiderations: ['Building Safety Act 2022', 'CDM Regulations 2015', 'CIS scheme']
  },

  // ---------------------------------------------------------------------------
  // PROFESSIONAL SERVICES
  // ---------------------------------------------------------------------------
  professionalServices: {
    name: 'Professional & Business Services',
    icbCode: '2700',
    sampleSize: 18,
    ftseWeight: 7.8,
    representativeCompanies: [
      'Hays', 'PageGroup', 'Robert Walters', 'SThree', 'Sanne Group',
      'Alpha FMC', 'Impax Asset Management', 'RWS Holdings', 'Kforce'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 30, median: 45, high: 65 },
      operatingProfitMargin: { low: 5, median: 12, high: 22 },
      netProfitMargin: { low: 3, median: 8, high: 16 },
      returnOnEquity: { low: 12, median: 22, high: 38 },
      currentRatio: { low: 1.0, median: 1.4, high: 2.0 },
      debtToEquity: { low: 0.1, median: 0.4, high: 0.9 },
      debtorDays: { low: 30, median: 50, high: 75 },
      creditorDays: { low: 20, median: 35, high: 55 },
      assetTurnover: { low: 1.0, median: 1.6, high: 2.5 },
      revenuePerEmployee: { low: 80000, median: 140000, high: 250000 },
      priceEarningsRatio: { low: 8, median: 15, high: 25 },
      dividendYield: { low: 1.5, median: 3.0, high: 5.0 }
    },
    additionalMetrics: {
      utilisationRate: { low: 65, median: 75, high: 85, unit: '%' },
      lockUpDays: { low: 60, median: 90, high: 130, unit: 'days' },
      feeEarnerRatio: { low: 3, median: 5, high: 8, unit: 'per support FTE' }
    },
    keyRisks: ['Key person dependency', 'WIP recoverability', 'PI claims', 'Contract profitability'],
    regulatoryConsiderations: ['Professional body regulation', 'Employment law', 'IR35']
  },

  // ---------------------------------------------------------------------------
  // MEDIA & ENTERTAINMENT
  // ---------------------------------------------------------------------------
  media: {
    name: 'Media & Entertainment',
    icbCode: '4040',
    sampleSize: 10,
    ftseWeight: 3.5,
    representativeCompanies: [
      'ITV', 'Future', 'Bloomsbury Publishing', 'Ascential', 'Informa',
      'Hyve Group', 'Reach', 'Centaur Media'
    ],
    typicalRatios: {
      grossProfitMargin: { low: 35, median: 50, high: 70 },
      operatingProfitMargin: { low: 5, median: 15, high: 28 },
      netProfitMargin: { low: 3, median: 10, high: 22 },
      returnOnEquity: { low: 8, median: 15, high: 25 },
      currentRatio: { low: 0.8, median: 1.2, high: 1.8 },
      debtToEquity: { low: 0.2, median: 0.6, high: 1.5 },
      priceEarningsRatio: { low: 8, median: 16, high: 28 },
      dividendYield: { low: 1.0, median: 2.5, high: 5.0 }
    },
    keyRisks: ['Digital disruption', 'Advertising revenue cyclicality', 'Content valuation', 'Goodwill impairment'],
    regulatoryConsiderations: ['Ofcom regulation', 'Copyright legislation', 'Advertising Standards']
  }
};

// ============================================================================
// SIC CODE TO SECTOR MAPPING
// ============================================================================
export const SIC_TO_SECTOR_MAP = {
  // Manufacturing / Industrials
  '10': 'industrials', '11': 'industrials', '12': 'industrials', '13': 'industrials',
  '14': 'industrials', '15': 'industrials', '16': 'industrials', '17': 'industrials',
  '18': 'industrials', '19': 'industrials', '20': 'industrials', '21': 'healthcare',
  '22': 'industrials', '23': 'construction', '24': 'industrials', '25': 'industrials',
  '26': 'technology', '27': 'industrials', '28': 'industrials', '29': 'industrials',
  '30': 'industrials', '31': 'industrials', '32': 'industrials', '33': 'industrials',
  // Construction
  '41': 'construction', '42': 'construction', '43': 'construction',
  // Retail
  '45': 'consumerDiscretionary', '46': 'consumerDiscretionary', '47': 'consumerDiscretionary',
  // Transport
  '49': 'industrials', '50': 'industrials', '51': 'industrials', '52': 'industrials',
  // Hospitality
  '55': 'consumerDiscretionary', '56': 'consumerStaples',
  // Technology / IT
  '58': 'technology', '59': 'media', '60': 'media', '61': 'technology',
  '62': 'technology', '63': 'technology',
  // Financial Services
  '64': 'financialServices', '65': 'financialServices', '66': 'financialServices',
  // Real Estate
  '68': 'realEstate',
  // Professional Services
  '69': 'professionalServices', '70': 'professionalServices', '71': 'professionalServices',
  '72': 'healthcare', '73': 'media', '74': 'professionalServices',
  // Administrative Services
  '77': 'professionalServices', '78': 'professionalServices', '79': 'consumerDiscretionary',
  '80': 'professionalServices', '81': 'professionalServices', '82': 'professionalServices',
  // Public Administration
  '84': 'industrials',
  // Education
  '85': 'professionalServices',
  // Healthcare
  '86': 'healthcare', '87': 'healthcare', '88': 'healthcare',
  // Arts / Entertainment
  '90': 'media', '91': 'media', '92': 'media', '93': 'consumerDiscretionary',
  // Other Services
  '94': 'professionalServices', '95': 'industrials', '96': 'consumerDiscretionary',
  // Utilities
  '35': 'energyUtilities', '36': 'energyUtilities', '37': 'energyUtilities',
  '38': 'energyUtilities', '39': 'energyUtilities',
  // Agriculture
  '01': 'consumerStaples', '02': 'consumerStaples', '03': 'consumerStaples',
  // Mining
  '05': 'energyUtilities', '06': 'energyUtilities', '07': 'energyUtilities',
  '08': 'energyUtilities', '09': 'energyUtilities'
};

// ============================================================================
// FTSE 250 INDEX STATISTICS
// ============================================================================
export const FTSE_250_INDEX_STATS = {
  name: 'FTSE 250',
  description: 'Mid-cap UK listed companies — 101st to 350th largest by market cap on LSE',
  totalConstituents: 250,
  aggregateStats: {
    medianMarketCap: { value: 1800000000, unit: '£', label: '£1.8bn median market cap' },
    medianPE: { value: 16, unit: 'x' },
    medianDividendYield: { value: 2.8, unit: '%' },
    medianROE: { value: 14, unit: '%' },
    medianGearing: { value: 35, unit: '%' },
    medianCurrentRatio: { value: 1.3, unit: 'x' }
  },
  sectorBreakdown: {
    financialServices: 18.5,
    industrials: 14.2,
    consumerDiscretionary: 10.2,
    technology: 8.5,
    professionalServices: 7.8,
    realEstate: 6.8,
    energyUtilities: 6.5,
    healthcare: 5.8,
    consumerStaples: 5.5,
    construction: 5.2,
    media: 3.5,
    other: 7.5
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get sector benchmarks by sector name
 */
export function getSectorBenchmarks(sectorKey) {
  return FTSE_250_SECTOR_BENCHMARKS[sectorKey] || null;
}

/**
 * Match a SIC code to FTSE 250 sector
 * @param {string} sicCode - 2-5 digit SIC code
 * @returns {string} Sector key
 */
export function matchCompanyToSector(sicCode) {
  if (!sicCode) return 'industrials';
  const prefix = String(sicCode).substring(0, 2);
  return SIC_TO_SECTOR_MAP[prefix] || 'industrials';
}

/**
 * Get all FTSE 250 sectors with summary info
 */
export function getAllSectors() {
  return Object.entries(FTSE_250_SECTOR_BENCHMARKS).map(([key, data]) => ({
    key,
    name: data.name,
    sampleSize: data.sampleSize,
    ftseWeight: data.ftseWeight,
    companies: data.representativeCompanies.length,
    keyRisks: data.keyRisks
  }));
}

/**
 * Search for a sector matching a keyword
 */
export function findSector(keyword) {
  const lower = keyword.toLowerCase();
  return Object.entries(FTSE_250_SECTOR_BENCHMARKS)
    .filter(([key, data]) =>
      key.toLowerCase().includes(lower) ||
      data.name.toLowerCase().includes(lower) ||
      data.representativeCompanies.some(c => c.toLowerCase().includes(lower))
    )
    .map(([key, data]) => ({ key, name: data.name, data }));
}
