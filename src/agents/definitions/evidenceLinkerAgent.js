/**
 * Evidence Linker Agent — Maps uploads to FSLIs, ISA 500 sufficiency scoring
 * ISA 500 (Audit Evidence), ISA 501 (Specific Items)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

// ISA 500 reliability hierarchy: external > internal, original > copy
const RELIABILITY_TIERS = {
  external_original: { tier: 1, weight: 1.0, label: 'External original (e.g., bank confirmation)' },
  external_copy: { tier: 2, weight: 0.8, label: 'External copy (e.g., supplier statement)' },
  internal_strong: { tier: 3, weight: 0.6, label: 'Internal with strong controls (e.g., system-generated)' },
  internal_weak: { tier: 4, weight: 0.4, label: 'Internal with weak controls (e.g., manual schedule)' },
  verbal: { tier: 5, weight: 0.2, label: 'Verbal/management representation' }
};

// FSLI-to-evidence keyword mapping
const FSLI_KEYWORDS = {
  'cash': ['bank', 'statement', 'confirmation', 'reconciliation', 'cash'],
  'receivables': ['debtor', 'receivable', 'confirmation', 'aged', 'customer', 'invoice'],
  'inventory': ['stock', 'inventory', 'count', 'valuation', 'nrv', 'warehouse'],
  'fixed_assets': ['asset', 'depreciation', 'addition', 'disposal', 'register', 'ppe'],
  'payables': ['creditor', 'payable', 'supplier', 'statement', 'accrual'],
  'revenue': ['revenue', 'sales', 'income', 'contract', 'cutoff'],
  'expenses': ['expense', 'cost', 'invoice', 'payment', 'receipt'],
  'tax': ['tax', 'hmrc', 'corporation', 'vat', 'deferred'],
  'provisions': ['provision', 'contingent', 'litigation', 'estimate'],
  'equity': ['share', 'dividend', 'capital', 'equity', 'reserve']
};

export const evidenceLinkerAgent = {
  id: 'evidenceLinker',
  name: 'Evidence Linker Agent',
  description: 'Maps uploaded evidence to FSLIs and scores sufficiency per ISA 500',
  category: 'operational',
  isaReferences: ['ISA 500', 'ISA 501'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _evidenceMap: {},

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.EVIDENCE_UPLOADED, (event) => this._linkEvidence(event.payload));
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const insights = [];
    const mappedFSLIs = Object.keys(this._evidenceMap);

    if (mappedFSLIs.length === 0) {
      return [{ severity: 'info', message: 'No evidence linked to FSLIs yet', isaRef: 'ISA 500', recommendation: 'Upload audit evidence to auto-link to financial statement line items' }];
    }

    // Check coverage
    const allFSLIs = Object.keys(FSLI_KEYWORDS);
    const uncovered = allFSLIs.filter(f => !this._evidenceMap[f] || this._evidenceMap[f].length === 0);
    if (uncovered.length > 0) {
      insights.push({
        severity: 'medium',
        message: `${uncovered.length} FSLIs lack evidence: ${uncovered.slice(0, 3).join(', ')}`,
        isaRef: 'ISA 500',
        recommendation: 'Obtain sufficient appropriate audit evidence for all material FSLIs'
      });
    }

    return insights;
  },

  analyze(data) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const files = data?.files || [];
    const results = files.map(f => this._classifyFile(f));

    // Sufficiency scoring per FSLI
    const sufficiency = {};
    Object.keys(FSLI_KEYWORDS).forEach(fsli => {
      const evidence = this._evidenceMap[fsli] || [];
      const totalWeight = evidence.reduce((sum, e) => sum + (RELIABILITY_TIERS[e.reliabilityTier]?.weight || 0.2), 0);
      sufficiency[fsli] = {
        evidenceCount: evidence.length,
        weightedScore: Math.round(totalWeight * 100) / 100,
        sufficient: totalWeight >= 1.0,
        tier1Count: evidence.filter(e => e.reliabilityTier === 'external_original').length,
        tier2Count: evidence.filter(e => e.reliabilityTier === 'external_copy').length
      };
    });

    this._setStatus('idle');
    return { linkedFiles: results, sufficiency, totalMapped: Object.values(this._evidenceMap).flat().length };
  },

  _linkEvidence(payload) {
    const fileName = (payload.fileName || '').toLowerCase();
    const matchedFSLIs = [];

    Object.entries(FSLI_KEYWORDS).forEach(([fsli, keywords]) => {
      if (keywords.some(kw => fileName.includes(kw))) {
        if (!this._evidenceMap[fsli]) this._evidenceMap[fsli] = [];
        this._evidenceMap[fsli].push({
          fileId: payload.fileId,
          fileName: payload.fileName,
          hash: payload.hash,
          reliabilityTier: this._inferReliability(fileName),
          linkedAt: new Date().toISOString()
        });
        matchedFSLIs.push(fsli);
      }
    });

    if (matchedFSLIs.length === 0) {
      this._alertCount++;
    }
  },

  _classifyFile(file) {
    const name = (file.name || file.fileName || '').toLowerCase();
    const matched = [];
    Object.entries(FSLI_KEYWORDS).forEach(([fsli, keywords]) => {
      if (keywords.some(kw => name.includes(kw))) matched.push(fsli);
    });
    return { fileName: file.name || file.fileName, matchedFSLIs: matched, reliabilityTier: this._inferReliability(name) };
  },

  _inferReliability(fileName) {
    if (fileName.includes('confirmation') || fileName.includes('bank statement')) return 'external_original';
    if (fileName.includes('supplier') || fileName.includes('statement')) return 'external_copy';
    if (fileName.includes('system') || fileName.includes('generated')) return 'internal_strong';
    return 'internal_weak';
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
