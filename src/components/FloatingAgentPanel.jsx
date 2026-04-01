/**
 * Floating Agent Panel — FAB + expandable panel overlay
 * Shows 9 operational agents in a 3x3 grid, alerts, and NL query box
 * Subscribes to event bus for real-time agent status
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEventSubscription, useEventBus } from '../hooks/useEventBus';
import { EVENT_TYPES } from '../services/agentEventBus';

const COLORS = {
  bg: '#0A0E17', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8', dim: 'rgba(255,255,255,0.6)', faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A', red: '#EF5350', orange: '#FFA726', blue: '#42A5F5',
  accent: '#F5A623', sidebar: '#0F1622', purple: '#CE93D8'
};

const AGENT_DEFINITIONS = [
  { id: 'orchestrator', name: 'Orchestrator', icon: '🎯', desc: 'Prioritized next actions' },
  { id: 'riskIntelligence', name: 'Risk Intel', icon: '📊', desc: 'Ratio & Z-score monitoring' },
  { id: 'qualityGuardian', name: 'Quality Guard', icon: '🛡️', desc: 'FRC readiness scoring' },
  { id: 'evidenceLinker', name: 'Evidence Linker', icon: '🔗', desc: 'FSLI evidence mapping' },
  { id: 'narrativeWriter', name: 'Narrative', icon: '✍️', desc: 'ISA-compliant prose' },
  { id: 'deadline', name: 'Deadlines', icon: '⏰', desc: 'Filing countdowns' },
  { id: 'learning', name: 'Learning', icon: '🧠', desc: 'Pattern extraction' },
  { id: 'humanInterface', name: 'Ask Agents', icon: '💬', desc: 'Natural language queries' },
  { id: 'evidenceCorroboration', name: 'Corroboration', icon: '✅', desc: 'Three-way matching' }
];

export default function FloatingAgentPanel({ engagement }) {
  const [expanded, setExpanded] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [agentStatuses, setAgentStatuses] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const panelRef = useRef(null);
  const { getRecentEvents } = useEventBus();

  const hasEngagement = !!(engagement?.entityName);
  const alertCount = alerts.filter(a => !a.acknowledged).length;

  // Subscribe to alert-worthy events
  useEventSubscription(EVENT_TYPES.AGENT_STATUS_CHANGED, useCallback((event) => {
    setAgentStatuses(prev => ({
      ...prev,
      [event.payload.agentId]: event.payload.status
    }));
  }, []));

  useEventSubscription(EVENT_TYPES.FINDING_LOGGED, useCallback((event) => {
    setAlerts(prev => [...prev.slice(-49), {
      id: event.id, type: 'finding', message: `Finding: ${event.payload.description || 'New finding logged'}`,
      severity: event.payload.severity || 'medium', timestamp: event.timestamp, acknowledged: false
    }]);
  }, []));

  useEventSubscription(EVENT_TYPES.CONTROL_FAILED, useCallback((event) => {
    setAlerts(prev => [...prev.slice(-49), {
      id: event.id, type: 'control', message: `Control failure: ${event.payload.controlName || 'Unknown'}`,
      severity: 'high', timestamp: event.timestamp, acknowledged: false
    }]);
  }, []));

  useEventSubscription(EVENT_TYPES.DEADLINE_APPROACHING, useCallback((event) => {
    setAlerts(prev => [...prev.slice(-49), {
      id: event.id, type: 'deadline', message: `Deadline: ${event.payload.description || 'Approaching'}`,
      severity: event.payload.daysRemaining <= 7 ? 'high' : 'medium', timestamp: event.timestamp, acknowledged: false
    }]);
  }, []));

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (expanded && panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const getStatusColor = (agentId) => {
    const status = agentStatuses[agentId] || 'idle';
    if (status === 'thinking' || status === 'running') return COLORS.orange;
    if (status === 'alert' || status === 'error') return COLORS.red;
    return COLORS.green;
  };

  const handleQuery = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    let result = '';

    if (q.includes('outstanding') || q.includes('incomplete')) {
      result = 'The Orchestrator agent tracks incomplete work papers. Open the Agents view in the sidebar for full details.';
    } else if (q.includes('risk') || q.includes('z-score')) {
      result = 'The Risk Intelligence agent monitors financial ratios and Altman Z-scores. Check the Risk Assessment phase for current analysis.';
    } else if (q.includes('deadline') || q.includes('filing')) {
      result = 'The Deadline agent tracks Companies House (9 months) and HMRC (12 months) filing deadlines from the FYE date.';
    } else if (q.includes('quality') || q.includes('frc')) {
      result = 'The Quality Guardian scores FRC readiness based on ISA 230 documentation completeness and ISA 220 review coverage.';
    } else if (q.includes('evidence') || q.includes('upload')) {
      result = 'Use the file upload areas to attach evidence. The Evidence Linker agent maps uploads to FSLIs automatically.';
    } else {
      result = `Query received: "${query}". The Human Interface agent routes questions to the appropriate specialist agent. Detailed NL processing requires the Claude API to be active.`;
    }

    setQueryResult(result);
    setQuery('');
  };

  // FAB button (collapsed)
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 48, height: 48,
          borderRadius: '50%', background: COLORS.accent, border: 'none',
          color: '#000', fontSize: '20px', cursor: 'pointer', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        🤖
        {alertCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4, background: COLORS.red,
            color: '#fff', borderRadius: '50%', width: 20, height: 20,
            fontSize: '10px', fontWeight: 700, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            {alertCount > 9 ? '9+' : alertCount}
          </span>
        )}
      </button>
    );
  }

  // Expanded panel
  return (
    <div ref={panelRef} style={{
      position: 'fixed', bottom: 24, right: 24, width: 360,
      maxHeight: 480, background: COLORS.sidebar, border: `1px solid ${COLORS.border}`,
      borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>🤖 Audit Agents</div>
        <button
          onClick={() => setExpanded(false)}
          style={{ background: 'none', border: 'none', color: COLORS.dim, cursor: 'pointer', fontSize: '16px' }}
        >
          ✕
        </button>
      </div>

      {!hasEngagement ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: COLORS.faint, fontSize: '12px' }}>
          Open an engagement to activate agents
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Agent Grid or Detail */}
          {selectedAgent ? (
            <div style={{ padding: '12px 16px' }}>
              <button
                onClick={() => { setSelectedAgent(null); setQueryResult(null); }}
                style={{ background: 'none', border: 'none', color: COLORS.blue, cursor: 'pointer', fontSize: '11px', marginBottom: '8px', padding: 0 }}
              >
                ← Back to agents
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>{selectedAgent.icon}</span>
                <div>
                  <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>{selectedAgent.name}</div>
                  <div style={{ color: COLORS.dim, fontSize: '11px' }}>{selectedAgent.desc}</div>
                </div>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: getStatusColor(selectedAgent.id), marginLeft: 'auto'
                }} />
              </div>
              <div style={{ color: COLORS.faint, fontSize: '11px' }}>
                Status: {agentStatuses[selectedAgent.id] || 'idle'} • Last run: —
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', padding: '12px'
            }}>
              {AGENT_DEFINITIONS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: '10px 6px', background: COLORS.card,
                    border: `1px solid ${COLORS.border}`, borderRadius: '8px',
                    cursor: 'pointer', textAlign: 'center', position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                    borderRadius: '50%', background: getStatusColor(agent.id)
                  }} />
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{agent.icon}</div>
                  <div style={{ color: COLORS.text, fontSize: '10px', fontWeight: 600, lineHeight: '1.2' }}>
                    {agent.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Alerts */}
          {alerts.length > 0 && !selectedAgent && (
            <div style={{ padding: '0 12px 8px' }}>
              <div style={{ color: COLORS.dim, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                Recent Alerts
              </div>
              <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                {alerts.filter(a => !a.acknowledged).slice(-5).reverse().map(alert => (
                  <div key={alert.id} style={{
                    padding: '6px 8px', background: alert.severity === 'high' ? COLORS.red + '15' : COLORS.orange + '15',
                    border: `1px solid ${alert.severity === 'high' ? COLORS.red : COLORS.orange}30`,
                    borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ flex: 1, color: COLORS.text, fontSize: '10px' }}>{alert.message}</div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      style={{ background: 'none', border: 'none', color: COLORS.faint, cursor: 'pointer', fontSize: '10px', flexShrink: 0 }}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query result */}
          {queryResult && (
            <div style={{
              margin: '0 12px 8px', padding: '8px 10px', background: COLORS.blue + '15',
              border: `1px solid ${COLORS.blue}30`, borderRadius: '6px',
              color: COLORS.text, fontSize: '11px', lineHeight: '1.4'
            }}>
              {queryResult}
            </div>
          )}
        </div>
      )}

      {/* Query box */}
      {hasEngagement && (
        <div style={{
          padding: '10px 12px', borderTop: `1px solid ${COLORS.border}`,
          display: 'flex', gap: '6px'
        }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Ask the agents..."
            style={{
              flex: 1, padding: '8px 10px', background: COLORS.card,
              border: `1px solid ${COLORS.border}`, borderRadius: '6px',
              color: COLORS.text, fontSize: '11px', outline: 'none'
            }}
          />
          <button
            onClick={handleQuery}
            style={{
              padding: '8px 12px', background: COLORS.accent + '20',
              border: `1px solid ${COLORS.accent}40`, borderRadius: '6px',
              color: COLORS.accent, fontSize: '11px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
