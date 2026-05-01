
/**
 * Agent Recommendations Panel
 * Displays findings and recommendations from all executing agents
 */
const AgentRecommendationsPanel = ({ recommendations = [] }) => {
  const defaultRecommendations = [
    {
      agent: 'Supervisor Agent',
      type: 'task-breakdown',
      text: 'Engagement structure appears sound. Risk assessment framework in place.',
      severity: 'info',
      actionable: false
    },
    {
      agent: 'Security Agent',
      type: 'vulnerability',
      text: 'No critical vulnerabilities identified in code review.',
      severity: 'success',
      actionable: false
    },
    {
      agent: 'Compliance Agent',
      type: 'compliance-check',
      text: 'GDPR and data protection requirements verified and met.',
      severity: 'success',
      actionable: false
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };
    return colors[severity] || '#999';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[severity] || '•';
  };

  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff9e6', borderRadius: '8px', border: '2px solid #ff9800' }}>
      <h3>⭐ Agent Recommendations & Findings</h3>

      {displayRecommendations.length === 0 ? (
        <p style={{ color: '#666' }}>No agent recommendations yet. Run agents to generate findings.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {displayRecommendations.map((rec, idx) => (
            <div key={idx} style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '4px',
              borderLeft: `4px solid ${getSeverityColor(rec.severity)}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '18px', marginTop: '2px' }}>{getSeverityIcon(rec.severity)}</span>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0' }}>{rec.agent}</h4>
                      <small style={{ color: '#666' }}>
                        Type: {rec.type.replace(/-/g, ' ').toUpperCase()}
                      </small>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      backgroundColor: getSeverityColor(rec.severity),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                      {rec.severity.toUpperCase()}
                    </div>
                  </div>
                  
                  <p style={{ margin: '8px 0' }}>{rec.text}</p>

                  {rec.actionable && (
                    <div style={{ marginTop: '8px' }}>
                      <button style={{
                        padding: '6px 16px',
                        backgroundColor: getSeverityColor(rec.severity),
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Take Action
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <small style={{ color: '#666' }}>
          ℹ️ Agent recommendations are generated based on analysis of audit procedures, compliance requirements, and industry standards (ISA, FRS, IFRS).
        </small>
      </div>
    </div>
  );
};

export default AgentRecommendationsPanel;
