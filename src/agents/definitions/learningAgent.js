/**
 * Learning Agent — Pattern extraction from engagement data
 * ISA 315 (Understanding the Entity), ISA 520 (Analytical Procedures)
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

export const learningAgent = {
  id: 'learning',
  name: 'Learning Agent',
  description: 'Extracts patterns from engagement history to improve future audit planning',
  category: 'operational',
  isaReferences: ['ISA 315', 'ISA 520'],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _patterns: [],

  init(eventBus) {
    this._eventBus = eventBus;
    eventBus.subscribe(EVENT_TYPES.FINDING_LOGGED, (event) => this._recordPattern('finding', event.payload));
    eventBus.subscribe(EVENT_TYPES.CONTROL_FAILED, (event) => this._recordPattern('control_failure', event.payload));
    eventBus.subscribe(EVENT_TYPES.PROCEDURE_COMPLETED, (event) => this._recordPattern('procedure', event.payload));
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights() {
    if (this._patterns.length === 0) {
      return [{ severity: 'info', message: 'Collecting patterns — more data needed', isaRef: 'ISA 315', recommendation: 'Continue working through the engagement to build pattern library' }];
    }

    const insights = [];

    // Frequency analysis
    const typeCounts = {};
    this._patterns.forEach(p => { typeCounts[p.type] = (typeCounts[p.type] || 0) + 1; });

    const findingCount = typeCounts.finding || 0;
    const controlFailures = typeCounts.control_failure || 0;

    if (controlFailures > 2) {
      insights.push({
        severity: 'high',
        message: `${controlFailures} control failures detected — pattern indicates systemic weakness`,
        isaRef: 'ISA 315',
        recommendation: 'Consider expanding substantive procedures and reducing reliance on controls'
      });
    }

    if (findingCount > 5) {
      insights.push({
        severity: 'medium',
        message: `${findingCount} findings logged — review for recurring themes`,
        isaRef: 'ISA 520',
        recommendation: 'Analyze findings for common root causes to improve audit efficiency'
      });
    }

    if (insights.length === 0) {
      insights.push({
        severity: 'low',
        message: `${this._patterns.length} patterns captured — no anomalies detected`,
        isaRef: 'ISA 315',
        recommendation: 'Continue normal audit procedures'
      });
    }

    return insights;
  },

  analyze(data) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    // Analyze collected patterns
    const typeCounts = {};
    const fsliCounts = {};
    const timeline = [];

    this._patterns.forEach(p => {
      typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
      if (p.data?.fsli) fsliCounts[p.data.fsli] = (fsliCounts[p.data.fsli] || 0) + 1;
      timeline.push({ type: p.type, timestamp: p.timestamp });
    });

    // Historical engagement patterns (if provided)
    const priorEngagements = data?.priorEngagements || [];
    const recurringFindings = [];
    if (priorEngagements.length > 0) {
      const pyFindings = priorEngagements.flatMap(e => e.findings || []);
      const pyFSLIs = {};
      pyFindings.forEach(f => { pyFSLIs[f.fsli] = (pyFSLIs[f.fsli] || 0) + 1; });
      Object.entries(pyFSLIs).forEach(([fsli, count]) => {
        if (count > 1) recurringFindings.push({ fsli, occurrences: count });
      });
    }

    this._setStatus('idle');
    return {
      totalPatterns: this._patterns.length,
      byType: typeCounts,
      byFSLI: fsliCounts,
      recurringFindings,
      recommendations: this._generateRecommendations(typeCounts, fsliCounts)
    };
  },

  _recordPattern(type, data) {
    this._patterns.push({ type, data, timestamp: Date.now() });
    // Keep last 500 patterns
    if (this._patterns.length > 500) this._patterns.shift();
  },

  _generateRecommendations(typeCounts, fsliCounts) {
    const recs = [];
    if ((typeCounts.control_failure || 0) > 2) {
      recs.push('Increase sample sizes for control testing in areas with repeated failures');
    }
    const topFSLI = Object.entries(fsliCounts).sort((a, b) => b[1] - a[1])[0];
    if (topFSLI && topFSLI[1] > 3) {
      recs.push(`Focus additional procedures on ${topFSLI[0]} — highest pattern concentration`);
    }
    return recs;
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
