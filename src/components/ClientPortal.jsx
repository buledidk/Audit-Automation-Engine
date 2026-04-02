/**
 * Client Portal — PBC requests by phase, dialogue threads, @mentions, GDPR consent
 * Left sidebar with Phase A-D tabs, PBC request cards, dialogue threads
 */

import { useState, useCallback, useMemo } from 'react';
import clientPortalService, { PBC_PHASE_CONFIG } from '../services/clientPortalService';
import FileUpload from './FileUpload';

const COLORS = {
  bg: '#0A0E17', card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8', dim: 'rgba(255,255,255,0.6)', faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A', red: '#EF5350', orange: '#FFA726', blue: '#42A5F5',
  accent: '#F5A623', purple: '#CE93D8', sidebar: '#0F1622'
};

const STATUS_COLORS = {
  requested: COLORS.orange, uploaded: COLORS.blue,
  reviewed: COLORS.green, rejected: COLORS.red, overdue: COLORS.red
};

function PBCCard({ item, engId, onStatusChange, onOpenThread }) {
  return (
    <div style={{
      padding: '12px 16px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: '8px', marginBottom: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: COLORS.text, fontSize: '13px', fontWeight: 600 }}>{item.label}</div>
          <div style={{ color: COLORS.faint, fontSize: '10px', marginTop: '2px' }}>
            {item.isaRef} • Phase {item.phase}
          </div>
        </div>
        <span style={{
          padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
          background: (STATUS_COLORS[item.status] || COLORS.faint) + '20',
          color: STATUS_COLORS[item.status] || COLORS.faint
        }}>
          {item.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        {item.status === 'requested' && (
          <FileUpload
            compact
            context="pbc"
            contextId={`${engId}_${item.id}`}
            label="Upload"
            onUploadComplete={() => onStatusChange(item.id, 'uploaded')}
          />
        )}
        {item.status === 'uploaded' && (
          <>
            <button onClick={() => onStatusChange(item.id, 'reviewed')} style={{
              padding: '4px 10px', background: COLORS.green + '20', border: `1px solid ${COLORS.green}40`,
              color: COLORS.green, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600
            }}>✓ Accept</button>
            <button onClick={() => onStatusChange(item.id, 'rejected')} style={{
              padding: '4px 10px', background: COLORS.red + '20', border: `1px solid ${COLORS.red}40`,
              color: COLORS.red, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600
            }}>✕ Reject</button>
          </>
        )}
        <button onClick={() => onOpenThread(item.id)} style={{
          padding: '4px 10px', background: 'transparent', border: `1px solid ${COLORS.border}`,
          color: COLORS.dim, borderRadius: '4px', fontSize: '10px', cursor: 'pointer'
        }}>💬 Discuss</button>
      </div>
    </div>
  );
}

function DialogueThread({ requestId, onClose }) {
  const [messages, setMessages] = useState(() => clientPortalService.getMessages(requestId));
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const mentions = [];
    const mentionRegex = /@(\w+)/g;
    let match;
    while ((match = mentionRegex.exec(newMsg)) !== null) mentions.push(match[1]);

    clientPortalService.postMessage({ requestId, senderId: 'auditor', text: newMsg, mentions });
    setMessages(clientPortalService.getMessages(requestId));
    setNewMsg('');
  };

  return (
    <div style={{
      padding: '16px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: '8px', marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ color: COLORS.text, fontSize: '13px', fontWeight: 600 }}>💬 Discussion: {requestId}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.dim, cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ maxHeight: '200px', overflow: 'auto', marginBottom: '10px' }}>
        {messages.length === 0 ? (
          <div style={{ color: COLORS.faint, fontSize: '11px', padding: '12px', textAlign: 'center' }}>No messages yet</div>
        ) : (
          messages.map(msg => (
            <div key={msg.messageId} style={{
              padding: '8px', marginBottom: '6px', background: msg.senderId === 'auditor' ? COLORS.blue + '10' : COLORS.accent + '10',
              borderRadius: '6px', borderLeft: `3px solid ${msg.senderId === 'auditor' ? COLORS.blue : COLORS.accent}`
            }}>
              <div style={{ color: COLORS.dim, fontSize: '10px', marginBottom: '2px' }}>
                {msg.senderId} • {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
              <div style={{ color: COLORS.text, fontSize: '12px' }}>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message... (@mention to tag)"
          style={{
            flex: 1, padding: '8px 10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
            borderRadius: '6px', color: COLORS.text, fontSize: '11px', outline: 'none'
          }}
        />
        <button onClick={sendMessage} style={{
          padding: '8px 12px', background: COLORS.blue + '20', border: `1px solid ${COLORS.blue}40`,
          color: COLORS.blue, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600
        }}>Send</button>
      </div>
    </div>
  );
}

export default function ClientPortal({ engagement, updateEngagement }) {
  const [activePhase, setActivePhase] = useState('A');
  const [activeThread, setActiveThread] = useState(null);
  const [showGDPR, setShowGDPR] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);

  const engId = engagement?.entityName || 'default';

  const pbcRequests = useMemo(() => {
    return clientPortalService.getPBCRequests(engId);
  }, [engId, activePhase]);

  const currentPhasePBC = pbcRequests[`phase${activePhase}`] || [];

  const handleStatusChange = useCallback((itemId, status) => {
    clientPortalService.updatePBCStatus(engId, itemId, { status });
  }, [engId]);

  const handleInvite = useCallback(() => {
    if (!inviteEmail) return;
    const result = clientPortalService.createInvitation({
      engId, clientEmail: inviteEmail, partnerId: engagement?.partner || 'partner'
    });
    setInviteStatus(result);
    setInviteEmail('');
  }, [inviteEmail, engId, engagement]);

  const handleExportData = useCallback(() => {
    const data = clientPortalService.exportClientData(engId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client_data_export_${engId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [engId]);

  // Phase completion stats
  const phaseStats = useMemo(() => {
    const stats = {};
    Object.entries(PBC_PHASE_CONFIG).forEach(([key]) => {
      const items = pbcRequests[`phase${key}`] || [];
      const done = items.filter(i => i.status === 'reviewed').length;
      stats[key] = { total: items.length, done, pct: items.length > 0 ? Math.round((done / items.length) * 100) : 0 };
    });
    return stats;
  }, [pbcRequests]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left sidebar: Phase tabs */}
      <div style={{
        width: 220, background: COLORS.sidebar, borderRight: `1px solid ${COLORS.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'auto', flexShrink: 0
      }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.accent, fontSize: '14px', fontWeight: 700 }}>🏢 Client Portal</div>
          <div style={{ color: COLORS.faint, fontSize: '10px', marginTop: '2px' }}>{engagement?.entityName || 'No engagement'}</div>
        </div>

        {Object.entries(PBC_PHASE_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActivePhase(key)}
            style={{
              padding: '12px 16px', textAlign: 'left', cursor: 'pointer',
              background: activePhase === key ? COLORS.accent + '15' : 'transparent',
              border: 'none', borderBottom: `1px solid ${COLORS.border}`,
              color: activePhase === key ? COLORS.accent : COLORS.dim
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{config.label}</div>
            <div style={{ fontSize: '10px', marginTop: '4px', color: COLORS.faint }}>
              {phaseStats[key]?.done}/{phaseStats[key]?.total} items ({phaseStats[key]?.pct}%)
            </div>
            <div style={{
              height: 3, borderRadius: 2, marginTop: '4px',
              background: COLORS.border, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${phaseStats[key]?.pct || 0}%`,
                background: COLORS.green, transition: 'width 0.3s'
              }} />
            </div>
          </button>
        ))}

        {/* Portal actions */}
        <div style={{ padding: '12px', marginTop: 'auto' }}>
          <button onClick={() => setShowGDPR(!showGDPR)} style={{
            width: '100%', padding: '8px', background: COLORS.purple + '15', border: `1px solid ${COLORS.purple}30`,
            color: COLORS.purple, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600, marginBottom: '6px'
          }}>🔒 GDPR</button>
          <button onClick={handleExportData} style={{
            width: '100%', padding: '8px', background: COLORS.blue + '15', border: `1px solid ${COLORS.blue}30`,
            color: COLORS.blue, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600
          }}>📦 Export Data</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '900px' }}>
          {/* Invite client */}
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '20px', padding: '12px',
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '8px'
          }}>
            <input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Client email address"
              style={{
                flex: 1, padding: '8px 10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: '6px', color: COLORS.text, fontSize: '12px', outline: 'none'
              }}
            />
            <button onClick={handleInvite} style={{
              padding: '8px 16px', background: COLORS.accent + '20', border: `1px solid ${COLORS.accent}40`,
              color: COLORS.accent, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
            }}>📧 Invite Client</button>
          </div>
          {inviteStatus && (
            <div style={{
              padding: '8px 12px', background: COLORS.green + '10', border: `1px solid ${COLORS.green}30`,
              borderRadius: '6px', marginBottom: '16px', color: COLORS.green, fontSize: '11px'
            }}>
              Invitation sent ({inviteStatus.status}) — awaiting partner approval
            </div>
          )}

          {/* Phase header */}
          <h3 style={{ color: COLORS.text, fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
            {PBC_PHASE_CONFIG[activePhase]?.label} — PBC Requests
          </h3>

          {/* Dialogue thread */}
          {activeThread && (
            <DialogueThread requestId={activeThread} onClose={() => setActiveThread(null)} />
          )}

          {/* PBC request cards */}
          {currentPhasePBC.map(item => (
            <PBCCard
              key={item.id}
              item={item}
              engId={engId}
              onStatusChange={handleStatusChange}
              onOpenThread={setActiveThread}
            />
          ))}

          {currentPhasePBC.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: COLORS.faint }}>
              No PBC requests for this phase
            </div>
          )}

          {/* GDPR Panel */}
          {showGDPR && (
            <div style={{
              marginTop: '24px', padding: '20px', background: COLORS.purple + '08',
              border: `1px solid ${COLORS.purple}30`, borderRadius: '8px'
            }}>
              <h4 style={{ color: COLORS.purple, margin: '0 0 12px 0' }}>🔒 GDPR & Data Protection</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={() => clientPortalService.collectConsent(engId, 'client', 'audit_processing')} style={{
                  padding: '10px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  color: COLORS.text, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 600 }}>✅ Collect Consent</div>
                  <div style={{ color: COLORS.faint, fontSize: '10px' }}>GDPR Art. 6 — lawful basis</div>
                </button>
                <button onClick={() => {
                  const dpa = clientPortalService.generateDPA(engId);
                  const blob = new Blob([JSON.stringify(dpa, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `DPA_${engId}.json`; a.click();
                  URL.revokeObjectURL(url);
                }} style={{
                  padding: '10px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  color: COLORS.text, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 600 }}>📋 Generate DPA</div>
                  <div style={{ color: COLORS.faint, fontSize: '10px' }}>Data Processing Agreement</div>
                </button>
                <button onClick={handleExportData} style={{
                  padding: '10px', background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  color: COLORS.text, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 600 }}>📦 Export Client Data</div>
                  <div style={{ color: COLORS.faint, fontSize: '10px' }}>GDPR Art. 20 — data portability</div>
                </button>
                <button onClick={() => {
                  if (window.confirm('This will permanently delete all client dialogue data. Continue?')) {
                    clientPortalService.processDataDeletion(engId, 'client');
                  }
                }} style={{
                  padding: '10px', background: COLORS.red + '10', border: `1px solid ${COLORS.red}30`,
                  color: COLORS.red, borderRadius: '6px', fontSize: '11px', cursor: 'pointer', textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 600 }}>🗑️ Delete Client Data</div>
                  <div style={{ color: COLORS.faint, fontSize: '10px' }}>GDPR Art. 17 — right to erasure</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
