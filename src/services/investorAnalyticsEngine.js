/**
 * INVESTOR ANALYTICS ENGINE
 * Intelligence-based investor analysis with web search integration,
 * industry analysis, and annual report data collection
 *
 * Integrates with: Claude API (web search), Companies House API, FTSE 250 data
 */

import { FinancialRatioEngine } from './financialRatioEngine.js';
import { matchCompanyToSector, getSectorBenchmarks, FTSE_250_INDEX_STATS } from '../data/ftse250Data.js';
import { COMPANIES_HOUSE_API } from '../data/standardsEncyclopedia/companiesHouse.js';

export class InvestorAnalyticsEngine {
  // S1-00: removed an unused field that pulled the legacy Vite-prefixed Anthropic
  // env var (which would have been baked into the client bundle), plus the dead
  // SDK import. AI calls in this file flow through claudeClient.js.
  constructor() {
    this.ratioEngine = new FinancialRatioEngine();
    this.cache = new Map();
    this.cacheTTL = 1800000; // 30 minutes
  }

  // ==========================================================================
  // AI-POWERED INDUSTRY ANALYSIS WITH WEB SEARCH
  // ==========================================================================

  /**
   * Perform AI-powered industry analysis with live web search
   * @param {string} companyName - Entity name
   * @param {string} sicCode - SIC code
   * @param {string} sector - Industry sector
   * @param {object} financialData - Entity financial data
   * @returns {object} Comprehensive industry analysis
   */
  async performIndustryAnalysis(companyName, sicCode, sector, financialData = {}) {
    const cacheKey = `industry_${companyName}_${sicCode}`;
    const cached = this._getCache(cacheKey);
    if (cached) return cached;

    const sectorData = getSectorBenchmarks(sector || matchCompanyToSector(sicCode));

    const prompt = `You are a financial analyst. Provide a comprehensive industry analysis for audit planning purposes.

Company: ${companyName}
SIC Code: ${sicCode || 'Unknown'}
Sector: ${sectorData?.name || sector || 'General'}
${financialData.revenue ? `Revenue: £${financialData.revenue.toLocaleString()}` : ''}
${financialData.totalAssets ? `Total Assets: £${financialData.totalAssets.toLocaleString()}` : ''}

Search for and provide:
1. INDUSTRY OVERVIEW: Current state of the ${sectorData?.name || 'relevant'} sector in the UK (2025-2026)
2. KEY TRENDS: Top 5 industry trends affecting this sector
3. REGULATORY CHANGES: Recent or upcoming regulatory changes (UK-specific)
4. COMPETITIVE LANDSCAPE: Market structure, key players, barriers to entry
5. RISK FACTORS: Top 5 risks specific to this industry (mapped to ISA audit risks)
6. FINANCIAL BENCHMARKS: Typical financial metrics for this sector (margins, ratios, growth rates)
7. ESG FACTORS: Material ESG risks for this sector
8. OUTLOOK: 12-24 month industry outlook

Return as JSON with these exact keys: industryOverview, keyTrends (array of 5), regulatoryChanges (array), competitiveLandscape, riskFactors (array of {risk, isaReference, likelihood, impact}), financialBenchmarks (object), esgFactors (array), outlook`;

    try {
      const { default: claudeClient } = await import('./claudeClient.js');

      const { text } = await claudeClient.sendMessage({
        prompt,
        model: 'claude-sonnet-4-6',
        maxTokens: 4000,
        tools: [{ type: 'web_search_20250305' }],
      });

      let analysis;

      try {
        analysis = claudeClient.parseJSON(text);
      } catch {
        analysis = this._getFallbackIndustryAnalysis(sectorData);
      }

      const result = {
        companyName,
        sicCode,
        sector: sectorData?.name || sector,
        analysisDate: new Date().toISOString(),
        source: 'AI-powered web search analysis',
        ...analysis,
        sectorBenchmarks: sectorData?.typicalRatios || {},
        sectorRisks: sectorData?.keyRisks || [],
        regulatoryConsiderations: sectorData?.regulatoryConsiderations || []
      };

      this._setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('AI industry analysis failed, using fallback:', error.message);
      return {
        companyName,
        sector: sectorData?.name || sector,
        ...this._getFallbackIndustryAnalysis(sectorData),
        sectorBenchmarks: sectorData?.typicalRatios || {},
        error: error.message
      };
    }
  }

  // ==========================================================================
  // COMPANIES HOUSE DATA COLLECTION
  // ==========================================================================

  /**
   * Fetch company data from Companies House API
   * @param {string} companyNumber - Companies House registration number
   * @returns {object} Company profile and filing data
   */
  async fetchCompaniesHouseData(companyNumber) {
    const cacheKey = `ch_${companyNumber}`;
    const cached = this._getCache(cacheKey);
    if (cached) return cached;

    const baseUrl = COMPANIES_HOUSE_API.baseUrl;
    const apiKey = import.meta.env?.VITE_COMPANIES_HOUSE_API_KEY;

    if (!apiKey) {
      return { error: 'Companies House API key not configured', companyNumber };
    }

    const headers = {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
      'Content-Type': 'application/json'
    };

    try {
      const [profileRes, filingRes, officersRes, pscRes] = await Promise.allSettled([
        fetch(`${baseUrl}/company/${companyNumber}`, { headers }),
        fetch(`${baseUrl}/company/${companyNumber}/filing-history?items_per_page=10&category=accounts`, { headers }),
        fetch(`${baseUrl}/company/${companyNumber}/officers`, { headers }),
        fetch(`${baseUrl}/company/${companyNumber}/persons-with-significant-control`, { headers })
      ]);

      const profile = profileRes.status === 'fulfilled' ? await profileRes.value.json() : null;
      const filings = filingRes.status === 'fulfilled' ? await filingRes.value.json() : null;
      const officers = officersRes.status === 'fulfilled' ? await officersRes.value.json() : null;
      const pscs = pscRes.status === 'fulfilled' ? await pscRes.value.json() : null;

      const result = {
        companyNumber,
        profile: profile ? {
          companyName: profile.company_name,
          status: profile.company_status,
          type: profile.type,
          dateOfCreation: profile.date_of_creation,
          registeredOffice: profile.registered_office_address,
          sicCodes: profile.sic_codes,
          accountsNextDue: profile.accounts?.next_due,
          lastAccountsType: profile.accounts?.last_accounts?.type,
          confirmationStatementNextDue: profile.confirmation_statement?.next_due,
          hasCharges: profile.has_charges,
          hasInsolvencyHistory: profile.has_insolvency_history,
          hasBeenLiquidated: profile.has_been_liquidated
        } : null,
        recentFilings: filings?.items?.map(f => ({
          date: f.date,
          type: f.type,
          description: f.description,
          category: f.category
        })) || [],
        officers: officers?.items?.filter(o => !o.resigned_on).map(o => ({
          name: o.name,
          role: o.officer_role,
          appointedOn: o.appointed_on,
          nationality: o.nationality,
          occupation: o.occupation
        })) || [],
        pscs: pscs?.items?.map(p => ({
          name: p.name,
          naturesOfControl: p.natures_of_control,
          notifiedOn: p.notified_on
        })) || [],
        fetchedAt: new Date().toISOString()
      };

      this._setCache(cacheKey, result);
      return result;
    } catch (error) {
      return { error: error.message, companyNumber };
    }
  }

  // ==========================================================================
  // ANNUAL REPORT INTELLIGENCE
  // ==========================================================================

  /**
   * AI-powered analysis of annual report data using web search
   * Gathers public financial data for FTSE 250 companies
   * @param {string} companyName
   * @param {string} ticker - Stock ticker (optional)
   * @returns {object} Annual report intelligence
   */
  async gatherAnnualReportIntelligence(companyName, ticker = '') {
    const cacheKey = `annual_${companyName}`;
    const cached = this._getCache(cacheKey);
    if (cached) return cached;

    const prompt = `Search for the most recent annual report data for ${companyName}${ticker ? ` (${ticker})` : ''}, a UK listed company.

Provide the following financial data from their latest published accounts:
1. Revenue (£ millions)
2. Cost of Sales (£ millions)
3. Operating Profit/EBIT (£ millions)
4. Profit Before Tax (£ millions)
5. Profit After Tax (£ millions)
6. Total Assets (£ millions)
7. Current Assets (£ millions)
8. Current Liabilities (£ millions)
9. Total Equity (£ millions)
10. Total Debt / Borrowings (£ millions)
11. Cash and Cash Equivalents (£ millions)
12. Trade Receivables (£ millions)
13. Inventories (£ millions)
14. Trade Payables (£ millions)
15. Operating Cash Flow (£ millions)
16. Capital Expenditure (£ millions)
17. Dividends per share (pence)
18. Shares outstanding (millions)
19. Average employees
20. Market capitalisation (£ millions)

Also provide:
- Financial year end date
- Reporting framework (IFRS/UK GAAP)
- Auditor name
- Audit opinion (unmodified/qualified)
- Key audit matters (if listed)

Return as JSON with keys: financialYear, reportingFramework, auditor, auditOpinion, keyAuditMatters (array), financials (object with numeric values in millions)`;

    try {
      const { default: claudeClient } = await import('./claudeClient.js');

      const { text } = await claudeClient.sendMessage({
        prompt,
        model: 'claude-sonnet-4-6',
        maxTokens: 3000,
        tools: [{ type: 'web_search_20250305' }],
      });

      let reportData;

      try {
        reportData = claudeClient.parseJSON(text);
      } catch {
        reportData = null;
      }

      if (reportData) {
        const result = {
          companyName,
          ticker,
          dataSource: 'AI web search — latest published annual report',
          fetchedAt: new Date().toISOString(),
          ...reportData
        };
        this._setCache(cacheKey, result);
        return result;
      }

      return { companyName, error: 'Could not extract financial data' };
    } catch (error) {
      return { companyName, error: error.message };
    }
  }

  // ==========================================================================
  // COMPREHENSIVE INVESTOR ANALYSIS
  // ==========================================================================

  /**
   * Full investor analysis combining all data sources
   * @param {object} params
   * @returns {object} Complete investor analysis report
   */
  async performComprehensiveAnalysis({
    companyName,
    companyNumber,
    sicCode,
    sector,
    financialData,
    priorYearData,
    sharePrice,
    marketCap,
    entityType = 'large'
  }) {
    // Step 1: Calculate all ratios
    const enrichedData = {
      ...financialData,
      sharePrice,
      marketCap: marketCap || (sharePrice && financialData.sharesOutstanding ? sharePrice * financialData.sharesOutstanding : null)
    };

    const ratioAnalysis = this.ratioEngine.calculateAllRatios(
      enrichedData,
      priorYearData,
      { sector: sector || matchCompanyToSector(sicCode), entityType, includeInvestor: true }
    );

    // Step 2: DuPont decomposition
    const dupont = this.ratioEngine.dupontAnalysis(enrichedData);

    // Step 3: FTSE 250 benchmarking
    const ftse250Comparison = this.ratioEngine.benchmarkAgainstFTSE250(
      ratioAnalysis.ratios, companyName, sicCode
    );

    // Step 4: Parallel async data gathering
    const [industryAnalysis, companiesHouseData] = await Promise.allSettled([
      this.performIndustryAnalysis(companyName, sicCode, sector, financialData),
      companyNumber ? this.fetchCompaniesHouseData(companyNumber) : Promise.resolve(null)
    ]);

    // Step 5: Investment scoring
    const investmentScore = this._calculateInvestmentScore(ratioAnalysis, dupont, ftse250Comparison);

    return {
      companyName,
      companyNumber,
      analysisDate: new Date().toISOString(),
      entityType,
      sector: sector || matchCompanyToSector(sicCode),

      // Financial Analysis
      ratioAnalysis,
      dupontAnalysis: dupont,
      overallHealth: ratioAnalysis.overallHealthScore,

      // Benchmarking
      ftse250Comparison,
      ftse250IndexStats: FTSE_250_INDEX_STATS,

      // Intelligence
      industryAnalysis: industryAnalysis.status === 'fulfilled' ? industryAnalysis.value : null,
      companiesHouseData: companiesHouseData.status === 'fulfilled' ? companiesHouseData.value : null,

      // Investment Scoring
      investmentScore,

      // Alerts
      alerts: ratioAnalysis.alerts,
      goingConcernIndicators: ratioAnalysis.goingConcernIndicators,
      auditFocusAreas: ratioAnalysis.auditFocusAreas,

      // Trend Analysis
      trendAnalysis: ratioAnalysis.trendAnalysis || null
    };
  }

  // ==========================================================================
  // INVESTMENT SCORING
  // ==========================================================================

  _calculateInvestmentScore(ratioAnalysis, dupont, ftse250Comparison) {
    const scores = {
      profitability: 0,
      liquidity: 0,
      solvency: 0,
      efficiency: 0,
      valuation: 0,
      quality: 0
    };

    const ratios = ratioAnalysis.ratios;

    // Profitability (0-25)
    if (ratios.grossProfitMargin?.value > 30) scores.profitability += 5;
    if (ratios.operatingProfitMargin?.value > 10) scores.profitability += 5;
    if (ratios.netProfitMargin?.value > 5) scores.profitability += 5;
    if (ratios.returnOnEquity?.value > 12) scores.profitability += 5;
    if (ratios.returnOnCapitalEmployed?.value > 10) scores.profitability += 5;

    // Liquidity (0-15)
    if (ratios.currentRatio?.value > 1.0) scores.liquidity += 5;
    if (ratios.quickRatio?.value > 0.7) scores.liquidity += 5;
    if (ratios.cashRatio?.value > 0.1) scores.liquidity += 5;

    // Solvency (0-20)
    if (ratios.debtToEquity?.value < 1.5) scores.solvency += 5;
    if (ratios.interestCover?.value > 3.0) scores.solvency += 5;
    if (ratios.gearingRatio?.value < 50) scores.solvency += 5;
    if (ratios.debtServiceCoverageRatio?.value > 1.5) scores.solvency += 5;

    // Efficiency (0-15)
    if (ratios.assetTurnover?.value > 0.8) scores.efficiency += 5;
    if (ratios.debtorDays?.value < 60) scores.efficiency += 5;
    if (ratios.cashConversionCycle?.value < 60) scores.efficiency += 5;

    // Quality (0-15)
    if (ratios.cashConversionRatio?.value > 80) scores.quality += 5;
    if (dupont?.threeWay?.equityMultiplier < 3.0) scores.quality += 5;
    if (ratioAnalysis.scores?.piotroskiFScore?.value >= 6) scores.quality += 5;

    // Z-Score bonus (0-10)
    if (ratioAnalysis.scores?.altmanZScore?.value > 3.0) scores.solvency += 5;
    if (ratioAnalysis.scores?.altmanZScore?.value > 2.5) scores.solvency += 5;

    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const maxPossible = 100;
    const percentage = Math.round((total / maxPossible) * 100);

    let recommendation;
    if (percentage >= 80) recommendation = 'Strong — high quality, well-managed entity';
    else if (percentage >= 60) recommendation = 'Good — fundamentally sound with some areas to monitor';
    else if (percentage >= 40) recommendation = 'Moderate — mixed signals; deeper analysis warranted';
    else if (percentage >= 20) recommendation = 'Weak — significant concerns across multiple dimensions';
    else recommendation = 'Critical — severe financial stress indicators';

    return {
      totalScore: total,
      maxScore: maxPossible,
      percentage,
      recommendation,
      breakdown: scores,
      color: percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#f59e0b' : percentage >= 20 ? '#f97316' : '#ef4444'
    };
  }

  // ==========================================================================
  // FALLBACK INDUSTRY ANALYSIS (when API unavailable)
  // ==========================================================================

  _getFallbackIndustryAnalysis(sectorData) {
    return {
      industryOverview: `${sectorData?.name || 'The'} sector in the UK operates within a regulated environment with ongoing economic pressures including inflation, interest rates, and post-Brexit trade dynamics.`,
      keyTrends: [
        'Digital transformation and automation driving efficiency gains',
        'ESG and sustainability becoming central to business strategy',
        'Supply chain resilience and nearshoring trends',
        'Talent acquisition and retention challenges',
        'Regulatory compliance costs increasing'
      ],
      regulatoryChanges: [
        'UK Corporate Governance Code 2024 changes',
        'FRC to ARGA transition (Audit Reform)',
        'Streamlined Energy and Carbon Reporting (SECR)',
        'Economic Crime and Corporate Transparency Act 2023',
        'Building Safety Act 2022 (construction sector)'
      ],
      competitiveLandscape: 'Market structure varies by subsector. Competition primarily on quality, price, and innovation.',
      riskFactors: [
        { risk: 'Economic downturn / recession risk', isaReference: 'ISA 570', likelihood: 'Medium', impact: 'High' },
        { risk: 'Interest rate and inflation impact on margins', isaReference: 'ISA 540', likelihood: 'High', impact: 'Medium' },
        { risk: 'Regulatory non-compliance', isaReference: 'ISA 250', likelihood: 'Low', impact: 'High' },
        { risk: 'Cybersecurity and data breach', isaReference: 'ISA 315', likelihood: 'Medium', impact: 'High' },
        { risk: 'Key customer/supplier concentration', isaReference: 'ISA 570', likelihood: 'Medium', impact: 'Medium' }
      ],
      financialBenchmarks: sectorData?.typicalRatios || {},
      esgFactors: [
        'Carbon emissions and net zero commitments',
        'Workforce diversity and inclusion',
        'Supply chain ethical standards',
        'Board governance and independence',
        'Community impact and social value'
      ],
      outlook: 'Mixed outlook for 2026. GDP growth modest, inflation moderating but still above target. Interest rate trajectory uncertain. Companies with strong balance sheets and digital capabilities best positioned.'
    };
  }

  // ==========================================================================
  // MULTI-YEAR ANALYSIS
  // ==========================================================================

  /**
   * Analyse multiple years of financial data for trend identification
   * @param {Array} yearlyData - Array of { year, financialData } objects (newest first)
   * @returns {object} Multi-year trend analysis
   */
  multiYearAnalysis(yearlyData) {
    if (!yearlyData || yearlyData.length < 2) return null;

    const yearlyRatios = yearlyData.map(yd => ({
      year: yd.year,
      ratios: this.ratioEngine.calculateAllRatios(yd.financialData, null, yd.options || {}).ratios
    }));

    const keyMetrics = [
      'grossProfitMargin', 'operatingProfitMargin', 'netProfitMargin',
      'returnOnEquity', 'currentRatio', 'debtToEquity', 'interestCover',
      'debtorDays', 'creditorDays', 'assetTurnover', 'cashConversionRatio'
    ];

    const trends = {};

    for (const metric of keyMetrics) {
      const values = yearlyRatios
        .map(yr => ({ year: yr.year, value: yr.ratios[metric]?.value }))
        .filter(v => v.value !== undefined);

      if (values.length < 2) continue;

      // Calculate CAGR for percentage metrics
      const first = values[values.length - 1];
      const last = values[0];
      const years = values.length - 1;
      const cagr = first.value && last.value && years > 0
        ? (Math.pow(last.value / first.value, 1 / years) - 1) * 100
        : null;

      // Simple linear trend
      const avgChange = years > 0 ? (last.value - first.value) / years : 0;

      trends[metric] = {
        name: ALL_RATIOS_IMPORT?.[metric]?.name || metric,
        values,
        latestValue: last.value,
        earliestValue: first.value,
        totalChange: Math.round((last.value - first.value) * 100) / 100,
        averageAnnualChange: Math.round(avgChange * 100) / 100,
        cagr: cagr !== null ? Math.round(cagr * 10) / 10 : null,
        trend: avgChange > 0.5 ? 'improving' : avgChange < -0.5 ? 'deteriorating' : 'stable',
        yearsAnalysed: values.length
      };
    }

    return {
      periodCovered: `${yearlyData[yearlyData.length - 1].year} — ${yearlyData[0].year}`,
      yearsAnalysed: yearlyData.length,
      trends,
      overallTrajectory: this._assessOverallTrajectory(trends)
    };
  }

  _assessOverallTrajectory(trends) {
    const improving = Object.values(trends).filter(t => t.trend === 'improving').length;
    const deteriorating = Object.values(trends).filter(t => t.trend === 'deteriorating').length;
    const total = Object.keys(trends).length;

    if (improving > deteriorating * 2) return { label: 'Positive trajectory', score: 'A' };
    if (improving > deteriorating) return { label: 'Moderately positive', score: 'B' };
    if (deteriorating > improving * 2) return { label: 'Negative trajectory', score: 'D' };
    if (deteriorating > improving) return { label: 'Moderately negative', score: 'C' };
    return { label: 'Stable', score: 'B-' };
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  _getCache(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.cacheTTL) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache() {
    this.cache.clear();
  }
}

export default InvestorAnalyticsEngine;
