/**
 * AgentGrid.jsx - Phase 8 Day 2
 * Grid view of all 18 agents with real-time health metrics
 * Shows status, CPU, memory, response time, uptime for each agent
 */
import { useState } from 'react';

const COLORS = {
  bg: '#0A0E17', surface: '#0F1622', card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)', accent: '#F5A623', text: '#F8F8F8',
  success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#1E88E5'
};

const STATUS_CONFIG = {
  healthy: { color: COLORS.success, label: 'Healthy', icon: '\u2705' },
  warning: { color: COLORS.warning, label: 'Warning', icon: '\u26A0\uFE0F' },
  critical: { color: COLORS.error, label: 'Critical', icon: '\u{1F6A8}' },
  offline: { color: '#666', label: 'Offline', icon: '\u26AB' }
};

export default function AgentGrid({ agents = [] }) {
  const [filter, setFilter] = useState('all');
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const filteredAgents = filter === 'all' ? agents : agents.filter(a => a.status === filter);

  const statusCounts = {
    all: agents.length,
    healthy: agents.filter(a => a.status === 'healthy').length,
    warning: agents.filter(a => a.status === 'warning').length,
    critical: agents.filter(a => a.status === 'critical').length
  };

  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 24) return Math.floor(hrs / 24) + 'd ' + (hrs % 24) + 'h';
    if (hrs > 0) return hrs + 'h ' + mins + 'm';
    return mins + 'm';
  };

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds.critical) return COLORS.error;
    if (value >= thresholds.warning) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <div>
      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(statusCounts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              padding: '6px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer',
              border: filter === key ? 'none' : '1px solid ' + COLORS.border,
              backgroundColor: filter === key ? (key === 'all' ? COLORS.accent : (STATUS_CONFIG[key]?.color || COLORS.accent)) : 'transparent',
              color: filter === key ? '#000' : COLORS.text,
              fontWeight: filter === key ? 600 : 400
            }}>
            {key === 'all' ? 'All' : STATUS_CONFIG[key]?.label || key} ({count})
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button onClick={() => setViewMode('grid')}
            style={{ padding: '6px 10px', backgroundColor: viewMode === 'grid' ? COLORS.card : 'transparent',
              border: '1px solid ' + COLORS.border, borderRadius: '6px', color: COLORS.text, cursor: 'pointer', fontSize: '14px' }}>
            {'\u{1F532}'}
          </button>
          <button onClick={() => setViewMode('list')}
            style={{ padding: '6px 10px', backgroundColor: viewMode === 'list' ? COLORS.card : 'transparent',
              border: '1px solid ' + COLORS.border, borderRadius: '6px', color: COLORS.text, cursor: 'pointer', fontSize: '14px' }}>
            {'\u{1F4CB}'}
          </button>
        </div>
      </div>

      {/* Agent Grid/List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
        gap: '10px'
      }}>
        {filteredAgents.map(agent => {
          const status = STATUS_CONFIG[agent.status] || STATUS_CONFIG.offline;
          const isExpanded = expandedAgent === agent.id;

          return (
            <div key={agent.id} onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              style={{
                backgroundColor: COLORS.card,
                border: '1px solid ' + (isExpanded ? status.color : COLORS.border),
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              {/* Agent Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: status.color, display: 'inline-block',
                    boxShadow: '0 0 6px ' + status.color
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    {agent.agent_name || 'Unknown Agent'}
                  </span>
                </div>
                <span style={{ fontSize: '14px' }}>{status.icon}</span>
              </div>

              {/* Metric Bars */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <MetricBar label="CPU" value={agent.cpu_usage || 0} max={100} unit="%"
                  color={getMetricColor(agent.cpu_usage || 0, { warning: 60, critical: 85 })} />
                <MetricBar label="MEM" value={agent.memory_usage || 0} max={100} unit="%"
                  color={getMetricColor(agent.memory_usage || 0, { warning: 70, critical: 90 })} />
              </div>

              {/* Quick Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                <span>{'\u26A1'} {agent.response_time_ms || 0}ms</span>
                <span>{'\u23F1\uFE0F'} {formatUptime(agent.uptime_seconds)}</span>
                <span>{agent.error_count > 0 ? '\u{1F534}' : '\u{1F7E2}'} {agent.error_count || 0} err</span>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid ' + COLORS.border
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Status: </span>
                      <span style={{ color: status.color }}>{status.label}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>CPU: </span>
                      <span>{agent.cpu_usage || 0}%</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Memory: </span>
                      <span>{agent.memory_usage || 0}%</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Response: </span>
                      <span>{agent.response_time_ms || 0}ms</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Uptime: </span>
                      <span>{formatUptime(agent.uptime_seconds)}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Errors: </span>
                      <span style={{ color: agent.error_count > 0 ? COLORS.error : COLORS.success }}>{agent.error_count || 0}</span>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Last Heartbeat: </span>
                      <span>{agent.last_heartbeat ? new Date(agent.last_heartbeat).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
          No agents found with filter "{filter}"
        </div>
      )}
    </div>
  );
}

function MetricBar({ label, value, max, unit, color }) { // eslint-disable-line no-unused-vars
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
        <span>{label}</span>
        <span style={{ color }}>{value}{unit}</span>
      </div>
      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: Math.min(100, (value / max) * 100) + '%',
          backgroundColor: color,
          borderRadius: '2px',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  );
}
