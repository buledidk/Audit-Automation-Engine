import { useState } from 'react';

/**
 * Unified Activity Dashboard
 * Central monitoring of all integrations and system activity
 */
const UnifiedActivityDashboard = () => {
  const [activityLog] = useState([
    { id: 1, type: 'slack', icon: '💬', message: 'Sent audit completion notice to #audit-team', timestamp: '2 min ago', status: 'success' },
    { id: 2, type: 'github', icon: '🐙', message: 'Created issue #1247 for Finding-001', timestamp: '5 min ago', status: 'success' },
    { id: 3, type: 'email', icon: '📧', message: 'Sent weekly progress report to stakeholders', timestamp: '15 min ago', status: 'success' },
    { id: 4, type: 'aws', icon: '☁️', message: 'Uploaded 156 files to S3 bucket', timestamp: '1 hour ago', status: 'success' },
    { id: 5, type: 'system', icon: '⚙️', message: 'Agent orchestration completed 6/6 agents', timestamp: '3 hours ago', status: 'success' },
    { id: 6, type: 'slack', icon: '💬', message: 'Failed to send notification (retry queued)', timestamp: '4 hours ago', status: 'warning' }
  ]);

  const [metrics] = useState({
    integrationHealth: 98,
    averageResponseTime: '245ms',
    totalTransactions: 447,
    activeConnections: 4
  });

  const getTypeColor = (type) => {
    const colors = {
      slack: '#36C5F0',
      github: '#333333',
      email: '#EA4335',
      aws: '#FF9900',
      system: '#2196F3'
    };
    return colors[type] || '#999';
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#0A0E17', color: '#F8F8F8' }}>
      <h2 style={{ marginBottom: '24px', color: '#42A5F5' }}>📊 Unified Activity Dashboard</h2>

      {/* Health Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #4CAF50'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Integration Health</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50', marginTop: '8px' }}>
            {metrics.integrationHealth}%
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #2196F3'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Response Time</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3', marginTop: '8px' }}>
            {metrics.averageResponseTime}
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #FFA726'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFA726', marginTop: '8px' }}>
            {metrics.totalTransactions}
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #66BB6A'
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Active Connections</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#66BB6A', marginTop: '8px' }}>
            {metrics.activeConnections}/4
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Recent Activity</h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {activityLog.map(activity => (
            <div key={activity.id} style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: '4px',
              borderLeft: `3px solid ${getTypeColor(activity.type)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                <div>
                  <div style={{ color: '#F8F8F8' }}>{activity.message}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    {activity.timestamp}
                  </div>
                </div>
              </div>

              <span style={{
                padding: '4px 10px',
                backgroundColor: activity.status === 'success' ? '#4CAF50' : '#FF9800',
                color: 'white',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {activity.status === 'success' ? '✓' : '⚠'} {activity.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Status Overview */}
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Integration Status</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { name: 'Slack', emoji: '💬', status: 'Active', lastSync: '2 min ago' },
            { name: 'GitHub', emoji: '🐙', status: 'Active', lastSync: '5 min ago' },
            { name: 'Email', emoji: '📧', status: 'Active', lastSync: '15 min ago' },
            { name: 'AWS', emoji: '☁️', status: 'Active', lastSync: '1 hour ago' }
          ].map((integration, idx) => (
            <div key={idx} style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{integration.emoji}</span>
                <div>
                  <div>{integration.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    {integration.lastSync}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '4px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                ● {integration.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedActivityDashboard;
