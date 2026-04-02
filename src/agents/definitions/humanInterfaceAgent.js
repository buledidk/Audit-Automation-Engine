/**
 * Human Interface Agent — NL query routing and response generation
 * Routes natural language questions to the appropriate specialist agent
 */

import { EVENT_TYPES } from '../../services/agentEventBus';

const QUERY_ROUTES = [
  { pattern: /outstand|incomplet|remain|todo|pending|what.?s left/i, agent: 'orchestrator', description: 'Incomplete work papers and pending tasks' },
  { pattern: /risk|z.?score|altman|going concern|deteriorat/i, agent: 'riskIntelligence', description: 'Risk analysis and going concern indicators' },
  { pattern: /quality|frc|readiness|isa 220|isa 230|review/i, agent: 'qualityGuardian', description: 'Quality and FRC readiness assessment' },
  { pattern: /evidence|upload|document|proof|support/i, agent: 'evidenceLinker', description: 'Evidence mapping and sufficiency' },
  { pattern: /narrative|working paper|write|draft|prose/i, agent: 'narrativeWriter', description: 'Working paper narrative generation' },
  { pattern: /deadline|filing|companies house|hmrc|due date/i, agent: 'deadline', description: 'Filing deadlines and countdowns' },
  { pattern: /pattern|learn|history|recurring|trend/i, agent: 'learning', description: 'Pattern analysis and learning insights' },
  { pattern: /match|corroborat|confirm|reconcil|three.?way/i, agent: 'evidenceCorroboration', description: 'Evidence corroboration and matching' },
  { pattern: /material|sample|threshold/i, agent: 'orchestrator', description: 'Materiality and sampling guidance' },
  { pattern: /ipv|invest|valuat|fair value|ifrs 13/i, agent: 'orchestrator', description: 'Investment valuation queries' }
];

export const humanInterfaceAgent = {
  id: 'humanInterface',
  name: 'Human Interface Agent',
  description: 'Routes natural language questions to specialist agents and synthesizes responses',
  category: 'operational',
  isaReferences: [],

  _eventBus: null,
  _status: 'idle',
  _lastRun: null,
  _alertCount: 0,
  _queryHistory: [],

  init(eventBus) {
    this._eventBus = eventBus;
    this._setStatus('idle');
  },

  getStatus() {
    return { status: this._status, lastRun: this._lastRun, alertCount: this._alertCount };
  },

  getInsights() {
    const recentQueries = this._queryHistory.slice(-5);
    if (recentQueries.length === 0) {
      return [{ severity: 'info', message: 'Ready for queries — ask anything about the engagement', isaRef: '', recommendation: 'Try: "What\'s outstanding?" or "Show risk analysis"' }];
    }

    return [{
      severity: 'low',
      message: `${this._queryHistory.length} queries processed`,
      isaRef: '',
      recommendation: `Recent: ${recentQueries.map(q => q.query.slice(0, 30)).join(', ')}`
    }];
  },

  analyze(data) {
    this._setStatus('thinking');
    this._lastRun = new Date().toISOString();

    const query = data?.query || '';
    if (!query.trim()) {
      this._setStatus('idle');
      return { error: 'Empty query', suggestions: ['What\'s outstanding?', 'Show risk analysis', 'Check deadlines'] };
    }

    // Route to best matching agent
    const route = QUERY_ROUTES.find(r => r.pattern.test(query));
    const result = {
      query,
      routedTo: route?.agent || 'general',
      description: route?.description || 'General query — no specific agent match',
      timestamp: new Date().toISOString(),
      suggestions: this._generateFollowUps(route?.agent)
    };

    this._queryHistory.push({ query, route: result.routedTo, timestamp: result.timestamp });
    if (this._queryHistory.length > 100) this._queryHistory.shift();

    this._setStatus('idle');
    return result;
  },

  _generateFollowUps(agentId) {
    const followUps = {
      orchestrator: ['What should I do next?', 'Show all incomplete items', 'Prioritize my work'],
      riskIntelligence: ['Calculate Z-score', 'Compare to prior year', 'Going concern assessment'],
      qualityGuardian: ['FRC readiness score', 'What docs are missing?', 'Review coverage gaps'],
      evidenceLinker: ['Evidence sufficiency check', 'Unlinked FSLIs', 'Reliability analysis'],
      narrativeWriter: ['Draft all narratives', 'Generate cash narrative', 'Update receivables WP'],
      deadline: ['Next filing deadline', 'All upcoming deadlines', 'Overdue filings'],
      learning: ['Show patterns', 'Recurring findings', 'Efficiency recommendations'],
      evidenceCorroboration: ['Three-way match check', 'Confirmation status', 'Reconciliation gaps']
    };
    return followUps[agentId] || ['What\'s outstanding?', 'Show risk analysis', 'Check quality score'];
  },

  _setStatus(status) {
    this._status = status;
    if (this._eventBus) {
      this._eventBus.publish(EVENT_TYPES.AGENT_STATUS_CHANGED, { agentId: this.id, status });
    }
  }
};
