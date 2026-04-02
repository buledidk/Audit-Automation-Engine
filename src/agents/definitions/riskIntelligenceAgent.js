/**
 * Risk Intelligence Agent — Ratio monitoring, Altman Z-score, deterioration flags
 * ISA 315 (Identifying and Assessing Risks), ISA 570 (Going Concern)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

// Altman Z-Score: Z = 1.2A + 1.4B + 3.3C + 0.6D + 1.0E
function computeAltmanZ(financials) {
  if (!financials) return null;
  const ta = financials.totalAssets || 1;
  const A = (financials.workingCapital || 0) / ta;           // Working Capital / Total Assets
  const B = (financials.retainedEarnings || 0) / ta;         // Retained Earnings / Total Assets
  const C = (financials.ebit || 0) / ta;                     // EBIT / Total Assets
  const D = (financials.marketCapOrEquity || 0) /
            (financials.totalLiabilities || 1);               // Market Cap / Total Liabilities
  const E = (financials.revenue || 0) / ta;                  // Revenue / Total Assets
  return Math.round((1.2 * A + 1.4 * B + 3.3 * C + 0.6 * D + 1.0 * E) * 100) / 100;
}

function classifyZScore(z) {
  if (z === null) return 'unknown';
  if (z > 2.99) return 'safe';
  if (z > 1.81) return 'grey';
  return 'distress';
}

export const riskIntelligenceAgent = {
  id: 'riskIntelligence',
  name: 'Risk Intelligence Agent',
  description: 'Monitors financial ratios, computes Altman Z-score, flags CY vs PY deterioration >10%',
  category: 'operational',
  isaReferences: ['ISA 315', 'ISA 570', 'ISA 520'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.ENGAGEMENT_UPDATED, () => this._checkRatios());
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const insights = [];
    const { financialData, priorYearData } = context || {};
    if (!financialData) {
      return [{ severity: 'info', message: 'No financial data available for analysis', isaRef: 'ISA 315', recommendation: 'Enter financial data in the Planning phase' }];
    }

    const zScore = computeAltmanZ(financialData);
    if (zScore !== null) {
      const zone = classifyZScore(zScore);
      insights.push({
        severity: zone === 'distress' ? 'high' : zone === 'grey' ? 'medium' : 'low',
        message: `Altman Z-Score: ${zScore} (${zone} zone)`,
        isaRef: 'ISA 570',
        recommendation: zone === 'distress'
          ? 'Going concern assessment required — consider ISA 570 procedures'
          : zone === 'grey'
            ? 'Monitor closely — entity in grey zone, assess management plans'
            : 'No going concern indicators from Z-score analysis'
      });
    }

    return insights;
  },

  analyze(data, context) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const cy = data?.financialData || context?.financialData || {};
    const py = data?.priorYearData || context?.priorYearData || {};

    // Altman Z-Score
    const zScore = computeAltmanZ(cy);
    const zZone = classifyZScore(zScore);

    // Ratio monitoring: CY vs PY deterioration >10%
    const deteriorationFlags = [];
    const ratioChecks = [
      { name: 'Revenue', cy: cy.revenue, py: py.revenue },
      { name: 'Gross Profit', cy: cy.grossProfit, py: py.grossProfit },
      { name: 'Net Profit', cy: cy.netProfit, py: py.netProfit },
      { name: 'Total Assets', cy: cy.totalAssets, py: py.totalAssets },
      { name: 'Working Capital', cy: cy.workingCapital, py: py.workingCapital },
      { name: 'Current Ratio', cy: cy.currentRatio, py: py.currentRatio }
    ];

    ratioChecks.forEach(({ name, cy: cyVal, py: pyVal }) => {
      if (cyVal != null && pyVal != null && pyVal !== 0) {
        const change = ((cyVal - pyVal) / Math.abs(pyVal)) * 100;
        if (change < -10) {
          deteriorationFlags.push({
            ratio: name,
            cyValue: cyVal,
            pyValue: pyVal,
            changePercent: Math.round(change * 10) / 10,
            severity: change < -25 ? 'high' : 'medium'
          });
        }
      }
    });

    if (deteriorationFlags.length > 0) {
      this._alertCount += deteriorationFlags.length;
      if (this._eventBus) {
        this._eventBus.publish(EVENT_TYPES.RISK_CHANGED, {
          agentId: this.id,
          deteriorationFlags,
          zScore,
          zZone
        });
      }
    }

    this._setStatus('idle');
    return { zScore, zZone, deteriorationFlags, ratiosChecked: ratioChecks.length };
  },

  _checkRatios() {
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
