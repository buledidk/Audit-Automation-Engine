/**
 * FINANCIAL STATEMENT EXTRACTION MODULE
 * Hybrid: structured parsing (pure compute) + AI for unstructured data.
 * Extracts line items, note references, FSLI categorisation, and cross-references
 * from financial statement data.
 *
 * Framework: IAS 1.10, IAS 1.113-116, FRS 102 Section 3
 * ISA: ISA 500 (evidence), ISA 230 (documentation)
 */

import claudeClient, { MODELS, EFFORT } from '../claudeClient.js';

// Standard FSLI categories by framework
const FSLI_CATEGORIES = {
  IFRS: {
    balance_sheet: [
      'property_plant_equipment', 'intangible_assets', 'goodwill', 'investment_property',
      'investments_in_associates', 'financial_assets', 'deferred_tax_assets', 'inventories',
      'trade_receivables', 'other_receivables', 'cash_and_equivalents',
      'trade_payables', 'other_payables', 'borrowings', 'provisions',
      'deferred_tax_liabilities', 'employee_benefit_obligations', 'lease_liabilities',
      'share_capital', 'share_premium', 'retained_earnings', 'other_reserves',
    ],
    income_statement: [
      'revenue', 'cost_of_sales', 'gross_profit', 'distribution_costs',
      'administrative_expenses', 'other_operating_income', 'operating_profit',
      'finance_income', 'finance_costs', 'share_of_associate_profit',
      'profit_before_tax', 'tax_expense', 'profit_for_year',
    ],
    cash_flow: [
      'operating_activities', 'investing_activities', 'financing_activities',
      'net_change_in_cash', 'opening_cash', 'closing_cash', 'fx_effects',
    ],
  },
  FRS102: {
    balance_sheet: [
      'tangible_fixed_assets', 'intangible_assets', 'investments',
      'stocks', 'debtors', 'cash_at_bank', 'creditors_within_one_year',
      'creditors_after_one_year', 'provisions_for_liabilities',
      'called_up_share_capital', 'profit_and_loss_account', 'other_reserves',
    ],
    income_statement: [
      'turnover', 'cost_of_sales', 'gross_profit', 'distribution_costs',
      'administrative_expenses', 'other_operating_income', 'operating_profit',
      'interest_receivable', 'interest_payable', 'profit_before_tax',
      'tax_on_profit', 'profit_for_financial_year',
    ],
    cash_flow: [
      'operating_activities', 'investing_activities', 'financing_activities',
      'net_change_in_cash', 'opening_cash', 'closing_cash',
    ],
  },
};

export class FSExtractionModule {
  constructor() {
    this.claude = claudeClient;
    this.checksPerformed = 0;
  }

  /**
   * Extract structured data from financial statement input.
   * For structured data (JSON/arrays), uses pure computation.
   * For unstructured text, uses AI extraction.
   * @param {Object} document - { content, format: 'json'|'text', type: 'balance_sheet'|'income_statement'|'cash_flow'|'notes'|'trial_balance' }
   * @param {Object} context - { framework: 'IFRS'|'FRS102', period, currency }
   * @returns {Promise<{lineItems: Array, totals: Object, metadata: Object}>}
   */
  async extractFinancialData(document, context = {}) {
    this.checksPerformed++;

    // Structured data — parse directly
    if (document.format === 'json' || Array.isArray(document.content)) {
      return this._extractFromStructured(document.content, document.type, context);
    }

    // Unstructured text — use AI
    return this._extractFromUnstructured(document.content, document.type, context);
  }

  /**
   * Map line items to standard FSLI categories.
   * @param {Array<{description: string, currentYear: number, priorYear?: number, noteRef?: string}>} lineItems
   * @param {string} framework - 'IFRS'|'FRS102'
   * @returns {{categorised: Array, unmapped: Array}}
   */
  categoriseLineItems(lineItems, framework = 'IFRS') {
    this.checksPerformed++;

    if (!Array.isArray(lineItems)) return { categorised: [], unmapped: [] };

    const categories = FSLI_CATEGORIES[framework] || FSLI_CATEGORIES.IFRS;
    const allFSLIs = Object.values(categories).flat();
    const categorised = [];
    const unmapped = [];

    for (const item of lineItems) {
      const desc = (item.description || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const matchedFSLI = allFSLIs.find(fsli => {
        const fsliWords = fsli.split('_');
        return fsliWords.every(word => desc.includes(word));
      });

      if (matchedFSLI) {
        // Find which statement section this belongs to
        let section = 'other';
        for (const [sectionName, fslis] of Object.entries(categories)) {
          if (fslis.includes(matchedFSLI)) { section = sectionName; break; }
        }
        categorised.push({ ...item, fsli: matchedFSLI, section, assertion: this._getAssertions(matchedFSLI) });
      } else {
        unmapped.push(item);
      }
    }

    return {
      categorised,
      unmapped,
      totalItems: lineItems.length,
      categorisedCount: categorised.length,
      unmappedCount: unmapped.length,
      framework,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract note references and cross-reference to disclosure requirements.
   * @param {Array} lineItems - Extracted line items with noteRef fields
   * @param {Object} notes - { noteNumber: { title, content, total? } }
   * @returns {{crossReferences: Array, missingNotes: Array}}
   */
  extractNoteReferences(lineItems, notes = {}) {
    this.checksPerformed++;

    if (!Array.isArray(lineItems)) return { crossReferences: [], missingNotes: [] };

    const crossReferences = [];
    const missingNotes = [];

    for (const item of lineItems) {
      if (item.noteRef) {
        const noteKey = String(item.noteRef);
        const note = notes[noteKey];

        if (note) {
          const faceAmount = Number(item.currentYear) || 0;
          const noteTotal = Number(note.total) || null;
          crossReferences.push({
            lineItem: item.description,
            amount: faceAmount,
            noteNumber: noteKey,
            noteTitle: note.title || '',
            noteTotal,
            agrees: noteTotal !== null ? Math.abs(faceAmount - noteTotal) < 0.01 : null,
            disclosurePresent: true,
          });
        } else {
          missingNotes.push({
            lineItem: item.description,
            amount: Number(item.currentYear) || 0,
            expectedNote: noteKey,
            severity: Math.abs(Number(item.currentYear) || 0) > 10000 ? 'HIGH' : 'MEDIUM',
          });
        }
      }
    }

    return {
      crossReferences,
      missingNotes,
      totalReferences: crossReferences.length,
      missingCount: missingNotes.length,
      timestamp: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────

  _extractFromStructured(content, type, context) {
    const items = Array.isArray(content) ? content : (content?.lineItems || content?.rows || []);
    const lineItems = items.map((item, i) => ({
      index: i,
      code: item.code || item.accountCode || null,
      description: item.description || item.account || item.label || `Line ${i + 1}`,
      currentYear: Number(item.currentYear ?? item.balance ?? item.amount ?? item.debit ?? 0),
      priorYear: item.priorYear !== undefined ? Number(item.priorYear) : null,
      noteRef: item.noteRef || item.note || null,
      debit: Number(item.debit) || 0,
      credit: Number(item.credit) || 0,
    }));

    const totals = {
      currentYearTotal: Math.round(lineItems.reduce((s, i) => s + i.currentYear, 0) * 100) / 100,
      priorYearTotal: lineItems.some(i => i.priorYear !== null)
        ? Math.round(lineItems.reduce((s, i) => s + (i.priorYear || 0), 0) * 100) / 100
        : null,
    };

    return {
      lineItems,
      totals,
      metadata: {
        type: type || 'unknown',
        format: 'structured',
        framework: context.framework || 'IFRS',
        period: context.period || null,
        currency: context.currency || 'GBP',
        itemCount: lineItems.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async _extractFromUnstructured(content, type, context) {
    const prompt = `You are an audit data extraction specialist. Extract all financial line items from the following ${type || 'financial statement'} text.

Framework: ${context.framework || 'IFRS'}
Period: ${context.period || 'Current year'}
Currency: ${context.currency || 'GBP'}

TEXT:
${String(content).slice(0, 8000)}

Return JSON: {
  "lineItems": [
    {
      "description": "<account name>",
      "currentYear": <number>,
      "priorYear": <number or null>,
      "noteRef": "<note number or null>",
      "section": "balance_sheet|income_statement|cash_flow|equity|notes"
    }
  ],
  "totals": { "currentYearTotal": <number>, "priorYearTotal": <number or null> },
  "metadata": { "type": "${type || 'unknown'}", "itemCount": <number> }
}`;

    const { text } = await this.claude.sendMessage({
      prompt,
      model: MODELS.SONNET,
      maxTokens: 4096,
      thinking: true,
      effort: EFFORT.MEDIUM,
      system: 'Extract financial data accurately. Return valid JSON only.',
    });

    const result = this.claude.parseJSON(text);
    result.metadata = { ...result.metadata, format: 'unstructured', framework: context.framework || 'IFRS' };
    result.timestamp = new Date().toISOString();
    return result;
  }

  _getAssertions(fsli) {
    // Map FSLIs to relevant financial statement assertions
    const assertionMap = {
      revenue: ['occurrence', 'completeness', 'accuracy', 'cutoff'],
      cost_of_sales: ['occurrence', 'completeness', 'accuracy'],
      turnover: ['occurrence', 'completeness', 'accuracy', 'cutoff'],
      trade_receivables: ['existence', 'rights', 'valuation', 'completeness'],
      debtors: ['existence', 'rights', 'valuation', 'completeness'],
      inventories: ['existence', 'valuation', 'rights'],
      stocks: ['existence', 'valuation', 'rights'],
      cash_and_equivalents: ['existence', 'completeness'],
      cash_at_bank: ['existence', 'completeness'],
      trade_payables: ['completeness', 'accuracy', 'existence'],
      creditors_within_one_year: ['completeness', 'accuracy', 'existence'],
      borrowings: ['completeness', 'classification', 'valuation'],
      provisions: ['completeness', 'valuation', 'obligation'],
      goodwill: ['existence', 'valuation'],
      intangible_assets: ['existence', 'valuation', 'rights'],
      property_plant_equipment: ['existence', 'valuation', 'rights', 'completeness'],
      tangible_fixed_assets: ['existence', 'valuation', 'rights', 'completeness'],
    };
    return assertionMap[fsli] || ['existence', 'completeness', 'valuation'];
  }

  getMetrics() {
    return {
      module: 'FSExtraction',
      status: 'READY',
      checksPerformed: this.checksPerformed,
      supportedFrameworks: Object.keys(FSLI_CATEGORIES),
      isaReference: 'ISA 500/230',
      aiRequired: true,
      model: MODELS.SONNET,
    };
  }
}

export default new FSExtractionModule();
