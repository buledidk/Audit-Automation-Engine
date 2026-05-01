import { useState, useEffect } from 'react';

/**
 * Agent Progress Panel
 * Real-time visualization of agent execution with progress bars and status
 * Compliant with ISA 220 Quality Control standards
 */
const AgentProgressPanel = ({ agents = {} }) => {
  const [animatedProgress, setAnimatedProgress] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        const updated = { ...prev };
        Object.keys(agents).forEach(agentName => {
          const current = agents[agentName];
          if (current.status === 'running' && current.progress < 100) {
            updated[agentName] = (prev[agentName] || 0) + Math.random() * 15;
          } else {
            updated[agentName] = current.progress || 0;
          }
        });
        return updated;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [agents]);

  const getStatusBadgeColor = (status) => {
    const colors = {
      idle: '#ddd',
      running: '#2196F3',
      completed: '#4CAF50',
      failed: '#F44336',
      pending: '#FF9800'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      idle: '⏸️',
      running: '⚙️',
      completed: '✅',
      failed: '❌',
      pending: '⏳'
    };
    return icons[status] || '•';
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '2px solid #0066cc' }}>
      <h3>🤖 Agent Execution Monitor</h3>
      
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <span><strong>Active Agents:</strong> {Object.values(agents).filter(a => a.status === 'running').length} / {Object.keys(agents).length}</span>
          <span style={{ color: '#0066cc', fontWeight: 'bold' }}>Real-time Updates</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {Object.entries(agents).map(([agentName, agent]) => (
          <div key={agentName} style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '4px',
            borderLeft: `4px solid ${getStatusBadgeColor(agent.status)}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{getStatusIcon(agent.status)}</span>
                <strong>{agentName}</strong>
              </div>
              <div style={{
                padding: '4px 12px',
                backgroundColor: getStatusBadgeColor(agent.status),
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {agent.status.toUpperCase()}
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                width: `${Math.min(animatedProgress[agentName] || agent.progress || 0, 100)}%`,
                height: '100%',
                backgroundColor: getStatusBadgeColor(agent.status),
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Details */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#666'
            }}>
              <span>{agent.currentTask || 'Waiting...'}</span>
              <span>
                {agent.progress || 0}% | 🔑 {agent.tokensUsed || 0} tokens
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentProgressPanel;
