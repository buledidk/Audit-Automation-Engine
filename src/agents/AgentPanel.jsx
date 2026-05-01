// ═══════════════════════════════════════════════════════════════
// Agent Panel — UI for autonomous audit agent execution
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEngagement } from '../context/EngagementContext.jsx';
import { useAgents } from '../hooks/useAgents.js';

export default function AgentPanel() {
  const { agentPanelOpen, setAgentPanelOpen, _CC } = useEngagement();
  const {
    runAgent, abortAgent, agentStatus, agentResults,
    currentStep, stepLog, totalSteps, currentStepIndex,
    lastRunAgent, acceptResult, rejectResult, acceptAll,
    getAgentList, reset,
  } = useAgents();

  const [selectedAgent, setSelectedAgent] = useState('planning');
  const agents = getAgentList();

  if (!agentPanelOpen) return null;

  const pending = agentResults.filter(r => r.status === 'pending');
  const accepted = agentResults.filter(r => r.status === 'accepted');
  const rejected = agentResults.filter(r => r.status === 'rejected');
  const progress = totalSteps > 0 ? Math.round(((currentStepIndex + (agentStatus === 'complete' ? 1 : 0)) / totalSteps) * 100) : 0;

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, width: 440, height: '100vh',
      background: '#0D1229', borderLeft: '1px solid rgba(16,185,129,0.3)',
      zIndex: 200, display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(16,185,129,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg,#10B981,#059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🤖</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#D1FAE5' }}>Audit Agents</div>
            <div style={{ fontSize: 9, color: 'rgba(16,185,129,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Autonomous Workflows
            </div>
          </div>
        </div>
        <button onClick={() => setAgentPanelOpen(false)} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer', fontSize: 18, padding: 4,
        }}>✕</button>
      </div>

      {/* Agent Selection */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(16,185,129,0.1)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: '#6EE7B7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Select Agent
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {agents.map(a => (
            <button
              key={a.key}
              onClick={() => setSelectedAgent(a.key)}
              disabled={agentStatus === 'running'}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 6, border: 'none',
                background: selectedAgent === a.key ? 'rgba(16,185,129,0.15)' : 'transparent',
                borderLeft: selectedAgent === a.key ? '3px solid #10B981' : '3px solid transparent',
                color: selectedAgent === a.key ? '#D1FAE5' : 'rgba(255,255,255,0.5)',
                cursor: agentStatus === 'running' ? 'wait' : 'pointer',
                textAlign: 'left', fontSize: 12, fontWeight: selectedAgent === a.key ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div>{a.name}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                  {a.description.slice(0, 60)}...
                </div>
              </div>
              <span style={{ fontSize: 9, color: '#6EE7B7', opacity: 0.6 }}>{a.estimatedSteps} steps</span>
            </button>
          ))}
        </div>

        {/* Run / Abort Button */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {agentStatus === 'running' ? (
            <button onClick={abortAgent} style={{
              flex: 1, padding: '10px 16px', borderRadius: 8,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>Stop Agent</button>
          ) : (
            <button onClick={() => runAgent(selectedAgent)} style={{
              flex: 1, padding: '10px 16px', borderRadius: 8,
              background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none',
              color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>Run {agents.find(a => a.key === selectedAgent)?.name || 'Agent'}</button>
          )}
          {agentStatus === 'complete' && (
            <button onClick={reset} style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12,
            }}>Clear</button>
          )}
        </div>
      </div>

      {/* Progress */}
      {agentStatus === 'running' && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(16,185,129,0.1)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: '#6EE7B7', fontWeight: 600 }}>
              {currentStep || 'Starting...'}
            </span>
            <span style={{ fontSize: 10, color: '#6EE7B7' }}>
              {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2, width: progress + '%',
              background: 'linear-gradient(90deg,#10B981,#34D399)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}

      {/* Step Log */}
      {stepLog.length > 0 && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(16,185,129,0.1)', flexShrink: 0, maxHeight: 120, overflowY: 'auto' }}>
          {stepLog.map((s, i) => (
            <div key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', padding: '2px 0', display: 'flex', gap: 6 }}>
              <span style={{ color: s.status === 'ok' ? '#10B981' : '#EF4444' }}>
                {s.status === 'ok' ? '✓' : '✗'}
              </span>
              <span>{s.name}</span>
              {s.suggestionsCount > 0 && (
                <span style={{ color: '#6EE7B7', marginLeft: 'auto' }}>+{s.suggestionsCount}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {agentStatus === 'idle' && agentResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(16,185,129,0.4)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Audit Agents</div>
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              Select an agent above and click Run. Agents analyse your engagement data and generate
              suggestions that you can accept or reject individually.
            </div>
          </div>
        )}

        {agentStatus === 'complete' && agentResults.length > 0 && (
          <>
            {/* Summary Bar */}
            <div style={{
              display: 'flex', gap: 8, marginBottom: 12, padding: '8px 12px',
              borderRadius: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <span style={{ fontSize: 10, color: '#6EE7B7', fontWeight: 600 }}>
                {lastRunAgent}: {agentResults.length} suggestions
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                {pending.length} pending · {accepted.length} accepted · {rejected.length} rejected
              </span>
            </div>

            {/* Accept All */}
            {pending.length > 0 && (
              <button onClick={acceptAll} style={{
                width: '100%', padding: '8px', borderRadius: 6, marginBottom: 12,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                color: '#6EE7B7', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}>
                Accept All ({pending.length})
              </button>
            )}

            {/* Individual Results */}
            {agentResults.map(r => (
              <div key={r.id} style={{
                marginBottom: 8, padding: '10px 12px', borderRadius: 8,
                background: r.status === 'accepted' ? 'rgba(16,185,129,0.08)' :
                  r.status === 'rejected' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
                border: '1px solid ' + (r.status === 'accepted' ? 'rgba(16,185,129,0.2)' :
                  r.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'),
                opacity: r.status === 'rejected' ? 0.5 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 3,
                    background: r.severity === 'critical' ? 'rgba(239,68,68,0.15)' :
                      r.severity === 'warning' ? 'rgba(251,191,36,0.15)' : 'rgba(16,185,129,0.15)',
                    color: r.severity === 'critical' ? '#FCA5A5' :
                      r.severity === 'warning' ? '#FCD34D' : '#6EE7B7',
                    fontWeight: 700,
                  }}>
                    {r.wp?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{r.field}</span>
                  {r.status !== 'pending' && (
                    <span style={{
                      marginLeft: 'auto', fontSize: 9, fontWeight: 600,
                      color: r.status === 'accepted' ? '#10B981' : '#EF4444',
                    }}>
                      {r.status === 'accepted' ? '✓ Applied' : '✗ Rejected'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#E5E7EB', lineHeight: 1.6, marginBottom: 4 }}>
                  {r.value?.length > 200 ? r.value.slice(0, 200) + '...' : r.value}
                </div>
                {r.reason && (
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                    {r.reason}
                  </div>
                )}
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => acceptResult(r.id)} style={{
                      padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                      color: '#6EE7B7', cursor: 'pointer',
                    }}>Accept</button>
                    <button onClick={() => rejectResult(r.id)} style={{
                      padding: '4px 12px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#FCA5A5', cursor: 'pointer',
                    }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px', borderTop: '1px solid rgba(16,185,129,0.1)',
        fontSize: 9, color: 'rgba(255,255,255,0.2)', flexShrink: 0,
      }}>
        Agent results are logged in the AI Audit Trail. All suggestions require manual review before acceptance.
      </div>
    </div>
  );
}
