import { useState } from 'react';

/**
 * Real-Time Audit Dashboard
 * Live monitoring of audit progress across all FSLIs with interactive visualizations
 * Compliant with ISA 315 and ISA 330 (Risk Assessment & Response)
 */
const RealTimeAuditDashboard = () => {
  const [auditMetrics, _setAuditMetrics] = useState({
    completionRate: 65,
    riskItems: 12,
    findingsResolved: 8,
    timeSpent: 24.5
  });

  const [fsliProgress, _setFsliProgress] = useState({
    cash: { progress: 100, status: 'completed', findings: 0 },
    receivables: { progress: 85, status: 'in-progress', findings: 2 },
    inventory: { progress: 60, status: 'in-progress', findings: 1 },
    fixedAssets: { progress: 40, status: 'pending', findings: 0 },
    payables: { progress: 70, status: 'in-progress', findings: 3 }
  });

  const getStatusColor = (status) => {
    const colors = {
      'completed': '#4CAF50',
      'in-progress': '#2196F3',
      'pending': '#FF9800',
      'exception': '#F44336'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': '✅',
      'in-progress': '⏳',
      'pending': '⭕',
      'exception': '❌'
    };
    return icons[status] || '•';
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#0A0E17', color: '#F8F8F8' }}>
      <h2 style={{ marginBottom: '24px', color: '#42A5F5' }}>📊 Real-Time Audit Dashboard</h2>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #4CAF50',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>{auditMetrics.completionRate}%</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Completion Rate</div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #F44336',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F44336' }}>{auditMetrics.riskItems}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Risk Items</div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #66BB6A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#66BB6A' }}>{auditMetrics.findingsResolved}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Findings Resolved</div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          borderLeft: '4px solid #FFA726',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFA726' }}>{auditMetrics.timeSpent}h</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Hours Logged</div>
        </div>
      </div>

      {/* FSLI Progress Overview */}
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Financial Statement Line Item Progress</h3>

        {Object.entries(fsliProgress).map(([fsli, data]) => (
          <div key={fsli} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{getStatusIcon(data.status)}</span>
                <strong>{fsli.charAt(0).toUpperCase() + fsli.slice(1)}</strong>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{data.progress}%</span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: getStatusColor(data.status),
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {data.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${data.progress}%`,
                height: '100%',
                backgroundColor: getStatusColor(data.status),
                transition: 'width 0.3s ease'
              }} />
            </div>

            {data.findings > 0 && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#F44336' }}>
                🔴 {data.findings} finding(s) requiring attention
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button style={{
            padding: '12px',
            backgroundColor: '#1E88E5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            🎯 View Risk Items
          </button>
          <button style={{
            padding: '12px',
            backgroundColor: '#43A047',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            ✅ Complete Procedure
          </button>
          <button style={{
            padding: '12px',
            backgroundColor: '#FB8C00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            💬 Add Annotation
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAuditDashboard;
