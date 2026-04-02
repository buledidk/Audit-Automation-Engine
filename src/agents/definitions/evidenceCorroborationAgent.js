/**
 * Evidence Corroboration Agent — Three-way matching, ISA 500 reliability tiers
 * ISA 500 (Audit Evidence), ISA 505 (External Confirmations)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

// ISA 500: Reliability tiers for corroboration scoring
const RELIABILITY_WEIGHTS = {
  external_confirmation: 1.0,    // Bank confirmation, debtor confirmation
  external_document: 0.8,        // Supplier statement, bank statement
  internal_strong_control: 0.6,  // System-generated report with good controls
  internal_weak_control: 0.4,    // Manual schedule, spreadsheet
  management_representation: 0.2 // Verbal confirmation only
};

export const evidenceCorroborationAgent = {
  id: 'evidenceCorroboration',
  name: 'Evidence Corroboration Agent',
  description: 'Three-way matching (GL/bank/confirmation) and ISA 500 reliability tier assessment',
  category: 'operational',
  isaReferences: ['ISA 500', 'ISA 505'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _matchResults: {},

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.EVIDENCE_UPLOADED, () => this._scheduleCheck());
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const matched = Object.keys(this._matchResults);
    if (matched.length === 0) {
      return [{ severity: 'info', message: 'No corroboration checks performed yet', isaRef: 'ISA 500', recommendation: 'Upload evidence from multiple sources to enable three-way matching' }];
    }

    const insights = [];
    const failedMatches = Object.entries(this._matchResults).filter(([, r]) => !r.matched);
    if (failedMatches.length > 0) {
      insights.push({
        severity: 'high',
        message: `${failedMatches.length} item(s) failed three-way match`,
        isaRef: 'ISA 500',
        recommendation: 'Investigate discrepancies — may indicate misstatement or incomplete evidence'
      });
    }

    const lowReliability = Object.entries(this._matchResults)
      .filter(([, r]) => r.reliabilityScore < 0.5);
    if (lowReliability.length > 0) {
      insights.push({
        severity: 'medium',
        message: `${lowReliability.length} item(s) have low evidence reliability`,
        isaRef: 'ISA 500',
        recommendation: 'Obtain higher-quality evidence (external confirmations preferred)'
      });
    }

    return insights;
  },

  analyze(data) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const items = data?.items || [];
    const results = [];

    items.forEach(item => {
      const result = this._performThreeWayMatch(item);
      this._matchResults[item.id || item.fsli] = result;
      results.push(result);

      if (!result.matched) {
        this._alertCount++;
        if (this._eventBus) {
          this._eventBus.publish(EVENT_TYPES.FINDING_LOGGED, {
            agentId: this.id,
            description: `Corroboration failure: ${item.fsli || item.id} — ${result.discrepancy}`,
            severity: 'medium',
            fsli: item.fsli
          });
        }
      }
    });

    // Aggregate reliability
    const avgReliability = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.reliabilityScore, 0) / results.length * 100) / 100
      : 0;

    this._setStatus('idle');
    return {
      results,
      summary: {
        totalChecked: results.length,
        matched: results.filter(r => r.matched).length,
        failed: results.filter(r => !r.matched).length,
        averageReliability: avgReliability
      }
    };
  },

  _performThreeWayMatch(item) {
    const sources = item.sources || [];
    // Three sources: GL balance, bank/external record, confirmation/third-party
    const glBalance = item.glBalance ?? null;
    const externalBalance = item.externalBalance ?? null;
    const confirmationBalance = item.confirmationBalance ?? null;

    const availableSources = [glBalance, externalBalance, confirmationBalance].filter(v => v !== null);
    const allEqual = availableSources.length >= 2 && availableSources.every(v => Math.abs(v - availableSources[0]) < 0.01);

    // Reliability scoring
    const evidenceTypes = item.evidenceTypes || [];
    const reliabilityScore = evidenceTypes.length > 0
      ? evidenceTypes.reduce((sum, type) => sum + (RELIABILITY_WEIGHTS[type] || 0.2), 0) / evidenceTypes.length
      : 0.2;

    let discrepancy = null;
    if (!allEqual && availableSources.length >= 2) {
      const max = Math.max(...availableSources);
      const min = Math.min(...availableSources);
      discrepancy = `Variance of ${(max - min).toFixed(2)} between sources`;
    }

    return {
      itemId: item.id || item.fsli,
      fsli: item.fsli,
      matched: allEqual,
      sourcesAvailable: availableSources.length,
      reliabilityScore: Math.round(reliabilityScore * 100) / 100,
      reliabilityTier: reliabilityScore >= 0.8 ? 'high' : reliabilityScore >= 0.5 ? 'medium' : 'low',
      discrepancy,
      glBalance,
      externalBalance,
      confirmationBalance
    };
  },

  _scheduleCheck() {
    this._status = 'thinking';
    setTimeout(() => { this._status = 'idle'; }, 300);
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
