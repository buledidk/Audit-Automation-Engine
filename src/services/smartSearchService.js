/**
 * Smart Search Service
 * Unified search across documents, Companies House, directories, and audit data
 * Returns context-aware results with audit relevance scoring
 */

import documentTokenizationService from './documentTokenizationService';
import companiesHouseConnector from './connectors/companiesHouseConnector';

export class SmartSearchService {
  constructor() {
    this.searchIndex = new Map();
    this.searchHistory = [];
    this.relevanceWeights = {
      exact: 1.0,
      contains: 0.7,
      fuzzy: 0.5
    };
    this.eventListeners = [];
  }

  /**
   * Unified search across all sources
   * @param {string} query - Search query
   * @param {Object} filters - Filter options (source, type, dateRange)
   * @returns {Promise<Object>} Unified search results
   */
  async search(query, filters = {}) {
    console.log(`🔍 Smart Search: "${query}"`);

    try {
      this.emit('search:started', { query, filters });

      const results = {
        query,
        timestamp: new Date().toISOString(),
        sources: {
          documents: [],
          companiesHouse: [],
          auditData: [],
          compliance: []
        },
        totalResults: 0,
        searchTime: 0
      };

      const startTime = Date.now();

      // Parallel searches
      const [docResults, chResults, auditResults] = await Promise.allSettled([
        filters.source !== 'companiesHouse' ? this.searchDocuments(query, filters) : Promise.resolve([]),
        filters.source !== 'documents' ? this.searchCompaniesHouse(query, filters) : Promise.resolve([]),
        filters.source !== 'companiesHouse' ? this.searchAuditData(query, filters) : Promise.resolve([])
      ]);

      // Merge results
      results.sources.documents = docResults.value || [];
      results.sources.companiesHouse = chResults.value || [];
      results.sources.auditData = auditResults.value || [];

      // Score and rank by relevance
      results.sources.documents = this.scoreAndRank(results.sources.documents, query, 'document');
      results.sources.companiesHouse = this.scoreAndRank(results.sources.companiesHouse, query, 'company');
      results.sources.auditData = this.scoreAndRank(results.sources.auditData, query, 'audit');

      // Combine and sort by relevance
      const allResults = [
        ...results.sources.documents.map(r => ({ ...r, source: 'document' })),
        ...results.sources.companiesHouse.map(r => ({ ...r, source: 'companiesHouse' })),
        ...results.sources.auditData.map(r => ({ ...r, source: 'auditData' }))
      ];

      results.combinedResults = allResults
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, filters.limit || 50);

      results.totalResults = results.combinedResults.length;
      results.searchTime = Date.now() - startTime;

      this.searchHistory.push({
        query,
        timestamp: results.timestamp,
        resultCount: results.totalResults,
        searchTime: results.searchTime
      });

      this.emit('search:completed', {
        query,
        totalResults: results.totalResults,
        searchTime: results.searchTime
      });

      console.log(`✅ Search complete: ${results.totalResults} results in ${results.searchTime}ms`);
      return results;
    } catch (error) {
      console.error('❌ Search failed:', error);
      this.emit('search:error', { query, error: error.message });
      throw error;
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(query, filters) {
    console.log(`📄 Searching documents...`);

    const documents = documentTokenizationService.listDocuments();
    const results = [];

    for (const doc of documents) {
      if (filters.documentId && doc.documentId !== filters.documentId) continue;

      // Search in document text
      const matches = this.findMatches(doc.fullText, query);

      if (matches.length > 0) {
        results.push({
          type: 'document',
          id: doc.documentId,
          title: doc.filename,
          description: `${matches.length} matches found in ${doc.filename}`,
          matches: matches.slice(0, 5), // Top 5 matches
          fileType: doc.fileType,
          uploadedAt: doc.uploadedAt,
          totalTokens: doc.totalTokens
        });
      }
    }

    return results;
  }

  /**
   * Search Companies House
   */
  async searchCompaniesHouse(query, filters) {
    console.log(`🏢 Searching Companies House...`);

    try {
      const searchResults = await companiesHouseConnector.searchCompany(query);

      return searchResults.companies.map(company => ({
        type: 'companiesHouse',
        id: company.companyNumber,
        title: company.companyName,
        description: `Status: ${company.status} | Type: ${company.type}`,
        companyNumber: company.companyNumber,
        status: company.status,
        incorporated: company.incorporation,
        address: company.address,
        auditRelevance: this.assessAuditRelevance(company)
      }));
    } catch (error) {
      console.error('Companies House search error:', error);
      return [];
    }
  }

  /**
   * Search internal audit data
   */
  async searchAuditData(query, filters) {
    console.log(`📋 Searching audit data...`);

    // This would search against stored audit findings, procedures, and test results
    // For now, return mock data structure
    return [
      {
        type: 'audit',
        id: `audit-${Date.now()}`,
        title: `Audit procedure matching "${query}"`,
        description: 'Search audit procedures, findings, and test results',
        relevantFields: ['procedures', 'findings', 'test_results']
      }
    ];
  }

  /**
   * Find text matches with context
   */
  findMatches(text, query) {
    const matches = [];
    const regex = new RegExp(`([^.!?]*${this.escapeRegex(query)}[^.!?]*)`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[1].trim().substring(0, 150),
        position: match.index,
        relevance: this.calculateMatchRelevance(match[1], query)
      });
    }

    return matches.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Escape regex special characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Score and rank results by relevance
   */
  scoreAndRank(results, query, type) {
    return results.map(result => ({
      ...result,
      relevanceScore: this.calculateRelevance(result, query, type)
    }));
  }

  /**
   * Calculate relevance score for a result
   */
  calculateRelevance(result, query, type) {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Exact title match
    if (result.title?.toLowerCase().includes(queryLower)) {
      score += 1.0;
    }

    // Description match
    if (result.description?.toLowerCase().includes(queryLower)) {
      score += 0.5;
    }

    // Type-specific scoring
    switch (type) {
      case 'document':
        score += (result.matches?.length || 0) * 0.1;
        break;
      case 'company':
        if (result.status === 'Active') score += 0.2;
        score += (result.auditRelevance || 0) * 0.5;
        break;
      case 'audit':
        score += 0.3; // Base score for audit data
        break;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate match relevance in context
   */
  calculateMatchRelevance(context, query) {
    const queryWords = query.toLowerCase().split(' ');
    let relevance = 0;

    queryWords.forEach(word => {
      if (context.toLowerCase().includes(word)) {
        relevance += 1;
      }
    });

    return Math.min(relevance / queryWords.length, 1.0);
  }

  /**
   * Assess audit relevance of a company
   */
  assessAuditRelevance(company) {
    let relevance = 0;

    // Active companies are more relevant
    if (company.status === 'Active') relevance += 0.3;

    // Large companies are more audit-relevant
    if (company.incorporation) {
      const yearsOld = (new Date() - new Date(company.incorporation)) / (365.25 * 24 * 60 * 60 * 1000);
      if (yearsOld > 3) relevance += 0.2;
    }

    return Math.min(relevance, 1.0);
  }

  /**
   * Get search history
   */
  getSearchHistory(limit = 50) {
    return this.searchHistory.slice(-limit);
  }

  /**
   * Clear search history
   */
  clearSearchHistory() {
    this.searchHistory = [];
  }

  /**
   * Event system
   */
  on(event, callback) {
    this.eventListeners.push({ event, callback });
  }

  emit(event, data) {
    this.eventListeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }
}

export default new SmartSearchService();
