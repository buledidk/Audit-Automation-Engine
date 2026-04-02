/**
 * Narrative Writer Agent — Auto-drafts ISA-compliant prose per FSLI
 * ISA 230 (Audit Documentation), ISA 700 (Forming an Opinion)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

// Per-FSLI narrative templates (ISA 230 compliant)
const NARRATIVE_TEMPLATES = {
  cash: {
    title: 'Cash & Bank Balances',
    template: `We performed the following procedures over cash and bank balances as at {fye}:
- Obtained bank confirmations directly from all banking institutions
- Agreed closing balances per bank statements to the general ledger
- Reviewed bank reconciliations for unusual reconciling items
- Tested a sample of {sampleSize} transactions post year-end for cutoff
- Assessed management's classification of cash equivalents per IAS 7

Conclusion: {conclusion}`
  },
  receivables: {
    title: 'Trade Receivables',
    template: `Substantive procedures over trade receivables at {fye}:
- Circularised {sampleSize} customer balances (ISA 505 external confirmations)
- Reviewed aged receivables analysis and assessed allowance for expected credit losses (IFRS 9)
- Tested subsequent cash receipts to assess recoverability
- Evaluated management's estimate of doubtful debt provision
- Performed cutoff testing around the year-end date

Conclusion: {conclusion}`
  },
  inventory: {
    title: 'Inventory',
    template: `Audit procedures over inventory at {fye} (ISA 501):
- Attended physical inventory count on {countDate}
- Performed test counts and agreed to final inventory records
- Assessed net realisable value against selling prices (IAS 2)
- Reviewed obsolescence provisions and slow-moving items
- Tested pricing of a sample of {sampleSize} items to purchase invoices

Conclusion: {conclusion}`
  },
  fixed_assets: {
    title: 'Property, Plant & Equipment',
    template: `Procedures over PPE at {fye}:
- Verified additions > materiality to supporting invoices and board approvals
- Recalculated depreciation charges using stated policies (IAS 16)
- Inspected significant assets for existence
- Reviewed disposals for completeness and gain/loss calculation
- Assessed indicators of impairment per IAS 36

Conclusion: {conclusion}`
  },
  payables: {
    title: 'Trade & Other Payables',
    template: `Substantive procedures over payables at {fye}:
- Obtained and reconciled supplier statements to the purchase ledger
- Searched for unrecorded liabilities post year-end
- Tested cutoff around year-end for goods received / invoices posted
- Reviewed accruals for completeness and reasonableness
- Assessed related party balances per IAS 24

Conclusion: {conclusion}`
  },
  revenue: {
    title: 'Revenue',
    template: `Revenue recognition testing for the year ended {fye} (IFRS 15):
- Assessed revenue recognition policies against the five-step model
- Tested a sample of {sampleSize} revenue transactions to contracts and delivery evidence
- Performed analytical review of revenue trends (ISA 520)
- Tested credit notes issued post year-end for cutoff
- Evaluated management judgments on variable consideration

Conclusion: {conclusion}`
  }
};

export const narrativeWriterAgent = {
  id: 'narrativeWriter',
  name: 'Narrative Writer Agent',
  description: 'Auto-drafts ISA-compliant working paper narratives per FSLI',
  category: 'operational',
  isaReferences: ['ISA 230', 'ISA 700'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _generatedNarratives: {},

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.PROCEDURE_COMPLETED, (event) => {
      if (event.payload?.fsli) this._queueNarrative(event.payload.fsli);
    });
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const generated = Object.keys(this._generatedNarratives).length;
    const total = Object.keys(NARRATIVE_TEMPLATES).length;
    return [{
      severity: generated < total ? 'medium' : 'low',
      message: `${generated}/${total} FSLI narratives drafted`,
      isaRef: 'ISA 230',
      recommendation: generated < total
        ? 'Complete procedures to auto-generate remaining narratives'
        : 'All FSLI narratives drafted — review for accuracy'
    }];
  },

  analyze(data, context) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const engagement = data?.engagement || context?.engagement || {};
    const fsliId = data?.fsliId;
    const narratives = {};

    const fslis = fsliId ? [fsliId] : Object.keys(NARRATIVE_TEMPLATES);

    fslis.forEach(id => {
      const template = NARRATIVE_TEMPLATES[id];
      if (!template) return;

      const fye = engagement.financialYearEnd || '[FYE]';
      const sampleSize = engagement.sampleSizes?.[id] || 25;
      const conclusion = engagement.conclusions?.[id] || 'Based on our procedures, we are satisfied that the balance is materially correct.';

      const text = template.template
        .replace(/{fye}/g, fye)
        .replace(/{sampleSize}/g, String(sampleSize))
        .replace(/{conclusion}/g, conclusion)
        .replace(/{countDate}/g, engagement.inventoryCountDate || '[Count Date]');

      narratives[id] = { title: template.title, text, fsliId: id, generatedAt: new Date().toISOString() };
      this._generatedNarratives[id] = narratives[id];
    });

    this._setStatus('idle');
    return { narratives, count: Object.keys(narratives).length };
  },

  _queueNarrative(fsliId) {
    if (NARRATIVE_TEMPLATES[fsliId]) {
      this._status = 'thinking';
      setTimeout(() => { this._status = 'idle'; }, 300);
    }
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
