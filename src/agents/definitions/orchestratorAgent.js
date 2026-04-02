/**
 * Orchestrator Agent — Prioritized next actions from phase/deadlines/incomplete WPs
 * ISA 300 (Planning), ISA 220 (Quality Management)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

export const orchestratorAgent = {
  id: 'orchestrator',
  name: 'Orchestrator Agent',
  description: 'Coordinates workflow, prioritizes next actions based on phase, deadlines, and incomplete work papers',
  category: 'operational',
  isaReferences: ['ISA 300', 'ISA 220'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.PROCEDURE_COMPLETED, () => this._recalcPriorities());
    eventBus.subscribe(EVENT_TYPES.SIGN_OFF_CHANGED, () => this._recalcPriorities());
    eventBus.subscribe(EVENT_TYPES.DEADLINE_APPROACHING, () => { this._alertCount++; });
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const insights = [];
    const { engagement, currentPhase } = context || {};
    if (!engagement) return [{ severity: 'info', message: 'No engagement loaded', isaRef: 'ISA 300', recommendation: 'Open an engagement to receive workflow guidance' }];

    // Check incomplete WPs
    const signOffs = engagement.signOffs || {};
    const incomplete = Object.entries(signOffs).filter(([, v]) => v?.status !== 'signed');
    if (incomplete.length > 0) {
      insights.push({
        severity: 'medium',
        message: `${incomplete.length} work paper(s) remain unsigned`,
        isaRef: 'ISA 230',
        recommendation: `Prioritize signing: ${incomplete.slice(0, 3).map(([k]) => k).join(', ')}`
      });
    }

    // Phase progression advice
    if (currentPhase === 'planning' && engagement.materiality?.overall_materiality) {
      insights.push({
        severity: 'low',
        message: 'Materiality set — ready to advance to Risk Assessment',
        isaRef: 'ISA 300',
        recommendation: 'Review planning documentation completeness before advancing'
      });
    }

    return insights;
  },

  analyze(data, context) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const engagement = data?.engagement || context?.engagement || {};
    const priorities = [];

    // Priority 1: Unsigned WPs
    const signOffs = engagement.signOffs || {};
    Object.entries(signOffs).forEach(([fsli, info]) => {
      if (info?.status === 'prepared' && !info?.reviewedBy) {
        priorities.push({ priority: 1, action: `Review and sign WP: ${fsli}`, type: 'sign-off', fsli });
      }
    });

    // Priority 2: Missing materiality
    if (!engagement.materiality?.overall_materiality) {
      priorities.push({ priority: 2, action: 'Calculate and document materiality', type: 'planning', phase: 'planning' });
    }

    // Priority 3: Risk assessment gaps
    if (!engagement.risks || Object.keys(engagement.risks || {}).length === 0) {
      priorities.push({ priority: 3, action: 'Complete risk assessment for key FSLIs', type: 'risk', phase: 'riskAssessment' });
    }

    priorities.sort((a, b) => a.priority - b.priority);
    this._setStatus('idle');
    return { priorities, totalActions: priorities.length, topPriority: priorities[0] || null };
  },

  _recalcPriorities() {
    this._status = 'thinking';
    setTimeout(() => { this._status = 'idle'; }, 500);
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
