/**
 * Companies House Connector
 * Integrates with UK Companies House API for entity verification and data enrichment
 * Retrieves company information, filing history, officers, and financial data
 * Uses browser-native Fetch API for HTTP requests
 */

export class CompaniesHouseConnector {
  constructor() {
    this.apiKey = process.env.COMPANIES_HOUSE_API_KEY;
    this.baseUrl = 'https://api.companieshouse.gov.uk';
    this.cache = new Map();
    this.cacheExpiry = 86400000; // 24 hours
    this.eventListeners = [];
  }

  /**
   * Search for company by name or company number
   * @param {string} query - Company name or registration number
   * @returns {Promise<Object>} Search results with company details
   */
  async searchCompany(query) {
    console.log(`🔍 Searching Companies House for: ${query}`);

    try {
      this.emit('search:started', { query });

      // Check cache first
      const cacheKey = `company:${query}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`📦 Using cached result for ${query}`);
        return cached;
      }

      // Search API
      const response = await this.makeRequest('/search/companies', {
        q: query,
        items_per_page: 10
      });

      const results = {
        query,
        timestamp: new Date().toISOString(),
        companies: (response.data.items || []).map(item => ({
          companyNumber: item.company_number,
          companyName: item.title,
          status: item.company_status,
          type: item.company_type,
          incorporation: item.date_of_creation,
          address: item.address_snippet,
          link: item.links?.self
        }))
      };

      // Cache results
      this.setInCache(cacheKey, results);

      this.emit('search:completed', {
        query,
        resultCount: results.companies.length
      });

      console.log(`✅ Found ${results.companies.length} companies`);
      return results;
    } catch (error) {
      console.error('❌ Companies House search failed:', error);
      this.emit('search:error', { query, error: error.message });
      throw error;
    }
  }

  /**
   * Get detailed company information
   * @param {string} companyNumber - UK company registration number
   * @returns {Promise<Object>} Detailed company data
   */
  async getCompanyDetails(companyNumber) {
    console.log(`📋 Fetching details for company: ${companyNumber}`);

    try {
      const cacheKey = `details:${companyNumber}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.makeRequest(`/company/${companyNumber}`);

      const details = {
        companyNumber,
        companyName: response.data.company_name,
        status: response.data.company_status,
        type: response.data.type,
        incorporated: response.data.date_of_creation,
        dissolved: response.data.date_of_dissolution,
        jurisdiction: response.data.jurisdiction,
        country: response.data.registered_office_address?.country,
        sic: response.data.sic_codes || [],
        accounts: {
          nextDueDate: response.data.accounts?.next_due_on,
          lastFiledDate: response.data.accounts?.last_accounts?.made_up_to,
          nextAccountsDueDate: response.data.accounts?.next_accounts?.due_on
        },
        officers: {
          count: response.data.officer_summary?.total_count || 0,
          activeCount: response.data.officer_summary?.active_count || 0
        },
        mortgages: {
          total: response.data.mortgage_summary?.total_count || 0,
          satisfied: response.data.mortgage_summary?.satisfied_count || 0
        }
      };

      // Add risk indicators
      details.riskIndicators = this.assessCompanyRisk(details);

      this.setInCache(cacheKey, details);
      return details;
    } catch (error) {
      console.error('❌ Failed to get company details:', error);
      throw error;
    }
  }

  /**
   * Get company officers and persons with significant control
   */
  async getCompanyOfficers(companyNumber) {
    console.log(`👥 Fetching officers for: ${companyNumber}`);

    try {
      const response = await this.makeRequest(`/company/${companyNumber}/officers`, {
        items_per_page: 100
      });

      return {
        companyNumber,
        officers: (response.data.items || []).map(officer => ({
          name: officer.name,
          position: officer.officer_role,
          appointed: officer.appointed_on,
          resigned: officer.resigned_on,
          nationality: officer.nationality,
          countryOfResidence: officer.country_of_residence,
          officerDetails: officer.links?.officer?.appointments || null
        }))
      };
    } catch (error) {
      console.error('❌ Failed to get officers:', error);
      throw error;
    }
  }

  /**
   * Get company filing history
   */
  async getFilingHistory(companyNumber, limit = 50) {
    console.log(`📄 Fetching filing history for: ${companyNumber}`);

    try {
      const response = await this.makeRequest(`/company/${companyNumber}/filing-history`, {
        items_per_page: limit
      });

      return {
        companyNumber,
        filings: (response.data.items || []).map(filing => ({
          type: filing.type,
          date: filing.date,
          description: filing.description,
          category: filing.category,
          actionDate: filing.action_date,
          documentMetadata: filing.links?.document_metadata
        })),
        totalCount: response.data.total_count
      };
    } catch (error) {
      console.error('❌ Failed to get filing history:', error);
      throw error;
    }
  }

  /**
   * Get company's annual accounts
   */
  async getAnnualAccounts(companyNumber) {
    console.log(`💰 Fetching accounts for: ${companyNumber}`);

    try {
      const response = await this.makeRequest(`/company/${companyNumber}/filing-history`, {
        category: 'accounts'
      });

      return {
        companyNumber,
        accounts: (response.data.items || []).map(account => ({
          date: account.date,
          description: account.description,
          type: this.parseAccountType(account.description),
          documentMetadata: account.links?.document_metadata
        }))
      };
    } catch (error) {
      console.error('❌ Failed to get accounts:', error);
      throw error;
    }
  }

  /**
   * Assess company risk based on Companies House data
   */
  assessCompanyRisk(details) {
    const riskIndicators = [];
    const riskFactors = [];

    // Dissolved company
    if (details.dissolved) {
      riskFactors.push({
        factor: 'Dissolved Company',
        level: 'critical',
        description: `Company dissolved on ${details.dissolved}`,
        implication: 'Financial statements may not be relevant'
      });
    }

    // Accounts overdue
    if (details.accounts?.nextDueDate) {
      const dueDate = new Date(details.accounts.nextDueDate);
      if (dueDate < new Date()) {
        riskFactors.push({
          factor: 'Overdue Accounts',
          level: 'high',
          description: `Accounts due on ${details.accounts.nextDueDate}`,
          implication: 'Potential compliance breach with Companies House'
        });
      }
    }

    // Director changes
    if (details.officers?.activeCount === 0) {
      riskFactors.push({
        factor: 'No Active Officers',
        level: 'critical',
        description: 'No active directors on record',
        implication: 'Company may not be operating normally'
      });
    }

    // Mortgages
    if (details.mortgages?.total > 0) {
      const unsatisfiedMortgages = details.mortgages.total - (details.mortgages.satisfied || 0);
      if (unsatisfiedMortgages > 0) {
        riskFactors.push({
          factor: 'Outstanding Mortgages',
          level: 'medium',
          description: `${unsatisfiedMortgages} unsatisfied mortgages`,
          implication: 'Potential security interests in company assets'
        });
      }
    }

    return riskFactors;
  }

  /**
   * Parse account type from description
   */
  parseAccountType(description) {
    const lower = description.toLowerCase();
    if (lower.includes('micro')) return 'micro-entity';
    if (lower.includes('small')) return 'small-entity';
    if (lower.includes('abbreviated')) return 'abbreviated';
    if (lower.includes('dormant')) return 'dormant';
    return 'full-accounts';
  }

  /**
   * Make authenticated request to Companies House API
   */
  async makeRequest(endpoint, params = {}) {
    // Create base64 auth header
    const auth = btoa(`${this.apiKey}:`);

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = queryString
      ? `${this.baseUrl}${endpoint}?${queryString}`
      : `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 404) {
        throw new Error(`Company not found`);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Return in axios-compatible format
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      };
    } catch (error) {
      console.error('Companies House API error:', error);
      throw error;
    }
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  setInCache(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
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

export default new CompaniesHouseConnector();
