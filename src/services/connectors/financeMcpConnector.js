/**
 * Finance MCP Data Connector
 * Stub for Anthropic Financial Services MCP data connectors.
 * Provides a unified interface to 11 finance data providers.
 * Each provider requires its own subscription/API key.
 *
 * Connectors auto-activate when their API key env var is set.
 * Until then, calls return a clear "not configured" response.
 */

import { EventEmitter } from 'events';

const MCP_PROVIDERS = {
  daloopa: { url: 'https://mcp.daloopa.com/server/mcp', envKey: 'DALOOPA_API_KEY', name: 'Daloopa', category: 'market_data' },
  morningstar: { url: 'https://mcp.morningstar.com/mcp', envKey: 'MORNINGSTAR_API_KEY', name: 'Morningstar', category: 'fund_equity' },
  spglobal: { url: 'https://kfinance.kensho.com/integrations/mcp', envKey: 'SPGLOBAL_API_KEY', name: 'S&P Global / Kensho', category: 'capital_iq' },
  factset: { url: 'https://mcp.factset.com/mcp', envKey: 'FACTSET_API_KEY', name: 'FactSet', category: 'financial_data' },
  moodys: { url: 'https://api.moodys.com/genai-ready-data/m1/mcp', envKey: 'MOODYS_API_KEY', name: "Moody's", category: 'credit_analytics' },
  mtnewswires: { url: 'https://vast-mcp.blueskyapi.com/mtnewswires', envKey: 'MTNEWSWIRES_API_KEY', name: 'MT Newswires', category: 'news_events' },
  aiera: { url: 'https://mcp-pub.aiera.com', envKey: 'AIERA_API_KEY', name: 'Aiera', category: 'earnings_calls' },
  lseg: { url: 'https://api.analytics.lseg.com/lfa/mcp', envKey: 'LSEG_API_KEY', name: 'LSEG', category: 'fixed_income_rates' },
  pitchbook: { url: 'https://premium.mcp.pitchbook.com/mcp', envKey: 'PITCHBOOK_API_KEY', name: 'PitchBook', category: 'ma_pe_data' },
  chronograph: { url: 'https://ai.chronograph.pe/mcp', envKey: 'CHRONOGRAPH_API_KEY', name: 'Chronograph', category: 'pe_software' },
  egnyte: { url: 'https://mcp-server.egnyte.com/mcp', envKey: 'EGNYTE_API_KEY', name: 'Egnyte', category: 'document_management' },
};

class FinanceMcpConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.providers = {};
    this._initProviders();
  }

  _initProviders() {
    Object.entries(MCP_PROVIDERS).forEach(([key, provider]) => {
      const apiKey = process.env[provider.envKey];
      this.providers[key] = {
        ...provider,
        configured: !!apiKey,
        apiKey: apiKey || null,
      };
    });
  }

  getStatus() {
    const configured = Object.values(this.providers).filter(p => p.configured);
    const unconfigured = Object.values(this.providers).filter(p => !p.configured);
    return {
      totalProviders: Object.keys(this.providers).length,
      configured: configured.map(p => p.name),
      unconfigured: unconfigured.map(p => ({ name: p.name, envKey: p.envKey })),
    };
  }

  isProviderConfigured(providerKey) {
    return this.providers[providerKey]?.configured || false;
  }

  async query(providerKey, params = {}) {
    const provider = this.providers[providerKey];
    if (!provider) {
      return { error: `Unknown provider: ${providerKey}`, availableProviders: Object.keys(this.providers) };
    }
    if (!provider.configured) {
      return {
        error: `${provider.name} is not configured. Set ${provider.envKey} in your environment variables.`,
        provider: provider.name,
        configured: false,
      };
    }

    try {
      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`${provider.name} returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.emit('query', { provider: providerKey, success: true });
      return { success: true, provider: provider.name, data };
    } catch (error) {
      this.emit('error', { provider: providerKey, error: error.message });
      return { error: error.message, provider: provider.name };
    }
  }
}

export default FinanceMcpConnector;
export { MCP_PROVIDERS };
