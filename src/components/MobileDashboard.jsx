/**
 * MobileDashboard.jsx - Phase 8 Day 2
 * Main mobile-responsive dashboard for agent monitoring and dispatch operations
 * Features: Real-time agent status, dispatch commands, notifications, performance metrics
 */
import { useState, useMemo } from 'react';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

const COLORS = {
  bg: '#0A0E17', surface: '#0F1622', card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)', accent: '#F5A623', text: '#F8F8F8',
  success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#1E88E5'
};

const TABLES = [
  'agent_health_checks', 'dispatch_operations', 'agent_incidents',
  'agent_rankings', 'dispatch_notifications'
];

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [commandInput, setCommandInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const { data, connected, lastUpdate, refresh } = useRealtimeSync(TABLES);

  const agents = data.agent_health_checks || [];
  const operations = data.dispatch_operations || [];
  const incidents = data.agent_incidents || [];
  const rankings = data.agent_rankings || [];
  const notifications = data.dispatch_notifications || [];

  const unreadCount = notifications.filter(n => !n.read).length;

  const stats = useMemo(() => {
    const healthy = agents.filter(a => a.status === 'healthy').length;
    const warning = agents.filter(a => a.status === 'warning').length;
    const critical = agents.filter(a => a.status === 'critical').length;
    const avgCpu = agents.length ? Math.round(agents.reduce((s, a) => s + (a.cpu_usage || 0), 0) / agents.length) : 0;
    const avgMem = agents.length ? Math.round(agents.reduce((s, a) => s + (a.memory_usage || 0), 0) / agents.length) : 0;
    const avgResponse = agents.length ? Math.round(agents.reduce((s, a) => s + (a.response_time_ms || 0), 0) / agents.length) : 0;
    const runningOps = operations.filter(o => o.status === 'running').length;
    const queuedOps = operations.filter(o => o.status === 'queued').length;
    return { healthy, warning, critical, avgCpu, avgMem, avgResponse, runningOps, queuedOps, total: agents.length };
  }, [agents, operations]);

  const handleCommand = (cmd) => {
    console.log('Dispatch command:', cmd || commandInput);
    setCommandInput('');
  };

  const quickCommands = [
    { label: 'Build', icon: '🔨', cmd: 'build' },
    { label: 'Test', icon: '🧪', cmd: 'test' },
    { label: 'Deploy', icon: '🚀', cmd: 'deploy' },
    { label: 'Git Pull', icon: '📥', cmd: 'git pull' },
    { label: 'Lint', icon: '✨', cmd: 'lint' },
    { label: 'Status', icon: '📊', cmd: 'status' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'dispatch', label: 'Dispatch', icon: '⚡' },
    { id: 'rankings', label: 'Rankings', icon: '🏆' }
  ];

  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.surface, borderBottom: '1px solid ' + COLORS.border, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {'\u{1F3DB}'} AuditEngine Mobile
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: connected ? COLORS.success : COLORS.warning, display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              {connected ? 'Live' : 'Demo'} {lastUpdate ? '\u2022 ' + new Date(lastUpdate).toLocaleTimeString() : ''}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={refresh} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' }} title="Refresh">
            {'\u{1F504}'}
          </button>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', position: 'relative' }}>
            {'\u{1F514}'}
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: COLORS.error, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div style={{ backgroundColor: COLORS.surface, borderBottom: '1px solid ' + COLORS.border, padding: '12px 16px', maxHeight: '200px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Notifications</h3>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>No notifications</p>
          ) : notifications.map(n => (
            <div key={n.id} style={{ padding: '8px', borderRadius: '6px', backgroundColor: n.read ? 'transparent' : 'rgba(245,166,35,0.1)', marginBottom: '6px', borderLeft: '3px solid ' + (COLORS[n.type] || COLORS.info) }}>
              <div style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{n.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid ' + COLORS.border, backgroundColor: COLORS.surface, position: 'sticky', top: '60px', zIndex: 99 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '10px 8px', backgroundColor: 'transparent', color: activeTab === tab.id ? COLORS.accent : 'rgba(255,255,255,0.5)',
              border: 'none', borderBottom: activeTab === tab.id ? '2px solid ' + COLORS.accent : '2px solid transparent',
              cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.id ? 600 : 400, transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <StatusCard title="Healthy Agents" value={stats.healthy} total={stats.total} color={COLORS.success} icon="\u2705" />
              <StatusCard title="Warnings" value={stats.warning} total={stats.total} color={COLORS.warning} icon="\u26A0\uFE0F" />
              <StatusCard title="Avg CPU" value={stats.avgCpu + '%'} color={stats.avgCpu > 80 ? COLORS.error : COLORS.info} icon="\u{1F4BB}" />
              <StatusCard title="Avg Memory" value={stats.avgMem + '%'} color={stats.avgMem > 80 ? COLORS.error : COLORS.info} icon="\u{1F4BE}" />
              <StatusCard title="Avg Response" value={stats.avgResponse + 'ms'} color={stats.avgResponse > 200 ? COLORS.warning : COLORS.success} icon="\u26A1" />
              <StatusCard title="Active Ops" value={stats.runningOps} subtitle={stats.queuedOps + ' queued'} color={COLORS.accent} icon="\u{1F3AF}" />
            </div>

            {/* Quick Commands */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Quick Commands</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {quickCommands.map(qc => (
                  <button key={qc.cmd} onClick={() => handleCommand(qc.cmd)}
                    style={{ padding: '12px 8px', backgroundColor: COLORS.card, border: '1px solid ' + COLORS.border,
                      borderRadius: '8px', color: COLORS.text, cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{qc.icon}</div>
                    {qc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Operations */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Recent Operations</h3>
              {operations.slice(0, 5).map(op => (
                <div key={op.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: COLORS.card, borderRadius: '8px', marginBottom: '8px', border: '1px solid ' + COLORS.border }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px',
                    backgroundColor: op.status === 'completed' ? COLORS.success : op.status === 'running' ? COLORS.accent : COLORS.info }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{op.command} {op.target}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{op.status} \u2022 {timeAgo(op.created_at)}</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                    backgroundColor: op.priority === 'high' ? 'rgba(229,57,53,0.2)' : op.priority === 'medium' ? 'rgba(251,140,0,0.2)' : 'rgba(30,136,229,0.2)',
                    color: op.priority === 'high' ? COLORS.error : op.priority === 'medium' ? COLORS.warning : COLORS.info }}>
                    {op.priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Incidents */}
            {incidents.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Recent Incidents</h3>
                {incidents.slice(0, 3).map(inc => (
                  <div key={inc.id} style={{ padding: '10px', backgroundColor: COLORS.card, borderRadius: '8px', marginBottom: '8px',
                    borderLeft: '3px solid ' + (inc.severity === 'warning' ? COLORS.warning : inc.severity === 'critical' ? COLORS.error : COLORS.info) }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{inc.agent_name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{inc.message}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{inc.status} \u2022 {timeAgo(inc.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && <AgentGrid agents={agents} />}

        {/* Dispatch Tab */}
        {activeTab === 'dispatch' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={commandInput} onChange={e => setCommandInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCommand()}
                  placeholder="Enter command..." style={{ flex: 1, padding: '10px 14px', backgroundColor: COLORS.card,
                    border: '1px solid ' + COLORS.border, borderRadius: '8px', color: COLORS.text, fontSize: '14px', outline: 'none' }} />
                <button onClick={() => handleCommand()}
                  style={{ padding: '10px 16px', backgroundColor: COLORS.accent, border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer' }}>
                  Run
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {quickCommands.map(qc => (
                <button key={qc.cmd} onClick={() => handleCommand(qc.cmd)}
                  style={{ padding: '10px', backgroundColor: COLORS.card, border: '1px solid ' + COLORS.border,
                    borderRadius: '8px', color: COLORS.text, cursor: 'pointer', fontSize: '12px' }}>
                  {qc.icon} {qc.label}
                </button>
              ))}
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Operation History</h3>
            {operations.map(op => (
              <div key={op.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: COLORS.card,
                borderRadius: '8px', marginBottom: '8px', border: '1px solid ' + COLORS.border }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px',
                  backgroundColor: op.status === 'completed' ? COLORS.success : op.status === 'running' ? COLORS.accent : COLORS.info }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{op.command} {op.target}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{op.status} \u2022 {timeAgo(op.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Agent Performance Rankings</h3>
            {rankings.sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0)).map((agent, idx) => (
              <div key={agent.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: COLORS.card,
                borderRadius: '8px', marginBottom: '8px', border: '1px solid ' + COLORS.border }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: idx === 0 ? 'rgba(245,166,35,0.2)' : idx === 1 ? 'rgba(192,192,192,0.2)' : idx === 2 ? 'rgba(205,127,50,0.2)' : COLORS.card,
                  color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : COLORS.text,
                  fontWeight: 700, fontSize: '14px', marginRight: '12px' }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{agent.agent_name}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Rel: {agent.reliability_score || 0}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Perf: {agent.performance_score || 0}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Eff: {agent.efficiency_score || 0}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: COLORS.accent }}>{agent.overall_score || 0}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>overall</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}
