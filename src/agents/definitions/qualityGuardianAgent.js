/**
 * Quality Guardian Agent — FRC readiness score, ISA 230 completeness, ISA 220 review gaps
 * ISA 220 (Quality Management), ISA 230 (Audit Documentation)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

export const qualityGuardianAgent = {
  id: 'qualityGuardian',
  name: 'Quality Guardian Agent',
  description: 'Scores FRC readiness, checks ISA 230 documentation completeness and ISA 220 review coverage',
  category: 'operational',
  isaReferences: ['ISA 220', 'ISA 230'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.SIGN_OFF_CHANGED, () => this._recheck());
    eventBus.subscribe(EVENT_TYPES.PROCEDURE_COMPLETED, () => this._recheck());
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights(context) {
    const { engagement } = context || {};
    if (!engagement) return [{ severity: 'info', message: 'No engagement loaded', isaRef: 'ISA 220', recommendation: 'Load an engagement' }];

    const insights = [];
    const score = this._computeFRCScore(engagement);

    insights.push({
      severity: score >= 80 ? 'low' : score >= 60 ? 'medium' : 'high',
      message: `FRC Readiness Score: ${score}/100`,
      isaRef: 'ISA 220',
      recommendation: score < 60
        ? 'Critical quality gaps — review documentation, sign-offs, and risk assessments'
        : score < 80
          ? 'Some quality improvements needed before FRC inspection readiness'
          : 'Good quality posture — maintain documentation standards'
    });

    // ISA 230 check
    const signOffs = engagement.signOffs || {};
    const unsignedCount = Object.values(signOffs).filter(v => v?.status !== 'signed').length;
    if (unsignedCount > 0) {
      insights.push({
        severity: 'medium',
        message: `${unsignedCount} work papers lack proper sign-off (ISA 230)`,
        isaRef: 'ISA 230',
        recommendation: 'All working papers must be signed by preparer and reviewer before completion'
      });
    }

    return insights;
  },

  analyze(data, context) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const engagement = data?.engagement || context?.engagement || {};
    const frcScore = this._computeFRCScore(engagement);
    const gaps = [];

    // ISA 230: Documentation completeness
    const signOffs = engagement.signOffs || {};
    const totalFSLIs = Math.max(Object.keys(signOffs).length, 14);
    const signed = Object.values(signOffs).filter(v => v?.status === 'signed').length;
    const reviewed = Object.values(signOffs).filter(v => v?.reviewedBy).length;

    if (signed < totalFSLIs) {
      gaps.push({ area: 'Documentation Sign-Off', isaRef: 'ISA 230', detail: `${signed}/${totalFSLIs} signed`, severity: 'high' });
    }

    // ISA 220: Review coverage
    if (reviewed < signed) {
      gaps.push({ area: 'Review Coverage', isaRef: 'ISA 220', detail: `${reviewed}/${signed} reviewed`, severity: 'medium' });
    }

    // Materiality documentation
    if (!engagement.materiality?.overall_materiality) {
      gaps.push({ area: 'Materiality Documentation', isaRef: 'ISA 320', detail: 'Not documented', severity: 'high' });
    }

    // Risk assessment
    if (!engagement.risks || Object.keys(engagement.risks || {}).length === 0) {
      gaps.push({ area: 'Risk Assessment', isaRef: 'ISA 315', detail: 'No risks documented', severity: 'high' });
    }

    this._alertCount = gaps.filter(g => g.severity === 'high').length;
    this._setStatus('idle');
    return { frcScore, gaps, signOffCoverage: `${signed}/${totalFSLIs}`, reviewCoverage: `${reviewed}/${signed || 0}` };
  },

  _computeFRCScore(engagement) {
    let score = 0;
    const signOffs = engagement.signOffs || {};
    const totalFSLIs = Math.max(Object.keys(signOffs).length, 14);
    const signed = Object.values(signOffs).filter(v => v?.status === 'signed').length;
    const reviewed = Object.values(signOffs).filter(v => v?.reviewedBy).length;

    // Documentation completeness (30 points)
    score += Math.round((signed / totalFSLIs) * 30);

    // Review coverage (25 points)
    if (signed > 0) score += Math.round((reviewed / signed) * 25);

    // Materiality documented (15 points)
    if (engagement.materiality?.overall_materiality) score += 15;

    // Risk assessment present (15 points)
    if (engagement.risks && Object.keys(engagement.risks).length > 0) score += 15;

    // Team assignment (10 points)
    if (engagement.partner || engagement.teamMembers?.length > 0) score += 10;

    // Entity info complete (5 points)
    if (engagement.entityName && engagement.financialYearEnd) score += 5;

    return Math.min(100, score);
  },

  _recheck() {
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
