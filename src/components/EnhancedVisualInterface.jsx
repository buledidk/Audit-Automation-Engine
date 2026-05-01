import { useState } from 'react';

/**
 * Enhanced Visual Interface
 * Industry-aligned colors, animations, workflows, and business context
 * Shows narrow to broad scope with visual hierarchy
 */
const EnhancedVisualInterface = () => {
  const [selectedContext, setSelectedContext] = useState('mid');

  const contexts = {
    narrow: {
      title: "🔍 Transaction Level (Narrow Scope)",
      color: "#60A5FA",
      description: "Individual transactions and journal entries",
      icon: "📝",
      workflows: [
        { name: "Journal Entry Testing", progress: 85, procedures: 12 },
        { name: "Transaction Sampling", progress: 70, procedures: 8 },
        { name: "Exception Analysis", progress: 60, procedures: 6 }
      ]
    },
    mid: {
      title: "📊 Account/FSLI Level (Mid Scope)",
      color: "#3B82F6",
      description: "Financial statement line items and account balances",
      icon: "💼",
      workflows: [
        { name: "Receivables Confirmation", progress: 90, procedures: 10 },
        { name: "Inventory Valuation", progress: 75, procedures: 9 },
        { name: "Fixed Assets Review", progress: 65, procedures: 8 }
      ]
    },
    broad: {
      title: "📄 Statement Level (Broad Scope)",
      color: "#1D4ED8",
      description: "Complete financial statement analysis",
      icon: "📋",
      workflows: [
        { name: "Statement Completeness", progress: 85, procedures: 15 },
        { name: "Reasonableness Review", progress: 80, procedures: 12 },
        { name: "Disclosure Review", progress: 70, procedures: 10 }
      ]
    },
    widest: {
      title: "🏢 Entity Level (Widest Scope)",
      color: "#1E3A8A",
      description: "Group/consolidated entity oversight",
      icon: "🌐",
      workflows: [
        { name: "Group Consolidation", progress: 60, procedures: 20 },
        { name: "Intragroup Procedures", progress: 55, procedures: 18 },
        { name: "Compliance Monitoring", progress: 50, procedures: 12 }
      ]
    }
  };

  const currentContext = contexts[selectedContext];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f7ff' }}>
      <h1 style={{ marginBottom: '24px', color: '#0052CC' }}>🎯 Audit Workflow & Business Context</h1>

      {/* Scope Level Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {Object.entries(contexts).map(([key, context]) => (
          <button
            key={key}
            onClick={() => setSelectedContext(key)}
            style={{
              padding: '16px',
              backgroundColor: selectedContext === key ? context.color : 'white',
              color: selectedContext === key ? 'white' : '#333',
              border: `3px solid ${context.color}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.3s ease',
              transform: selectedContext === key ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{context.icon}</div>
            {context.title.split(' ')[1]} Level
          </button>
        ))}
      </div>

      {/* Current Context Details */}
      <div style={{
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: `4px solid ${currentContext.color}`,
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '36px' }}>{currentContext.icon}</span>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: currentContext.color }}>{currentContext.title}</h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{currentContext.description}</p>
          </div>
        </div>

        {/* Workflows Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {currentContext.workflows.map((workflow, idx) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              borderLeft: `4px solid ${currentContext.color}`
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>{workflow.name}</h4>
              
              {/* Progress Bar */}
              <div style={{
                marginBottom: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
                height: '8px'
              }}>
                <div style={{
                  width: `${workflow.progress}%`,
                  backgroundColor: currentContext.color,
                  height: '100%',
                  transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#666'
              }}>
                <span><strong>{workflow.progress}%</strong> Complete</span>
                <span><strong>{workflow.procedures}</strong> Procedures</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Timeline */}
      <div style={{
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginTop: '0', marginBottom: '16px', color: '#0052CC' }}>📅 Audit Project Timeline</h3>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { phase: 'Planning & Strategy', duration: '5 days', progress: 100, status: 'Completed', color: '#28A745' },
            { phase: 'Risk Assessment', duration: '7 days', progress: 100, status: 'Completed', color: '#28A745' },
            { phase: 'Interim Audit', duration: '10 days', progress: 65, status: 'In Progress', color: '#FFC107' },
            { phase: 'Final Audit', duration: '15 days', progress: 0, status: 'Pending', color: '#DC3545' },
            { phase: 'Completion & Review', duration: '5 days', progress: 0, status: 'Pending', color: '#DC3545' },
            { phase: 'Reporting & Delivery', duration: '3 days', progress: 0, status: 'Pending', color: '#DC3545' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ minWidth: '180px' }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>{item.phase}</div>
                <small style={{ color: '#999' }}>{item.duration}</small>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  height: '20px',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.color,
                    height: '100%',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
                <small style={{ color: '#666' }}>{item.progress}%</small>
              </div>

              <div style={{
                padding: '4px 12px',
                backgroundColor: item.color,
                color: 'white',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '100px',
                textAlign: 'center'
              }}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team & Resources */}
      <div style={{
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{ marginTop: '0', marginBottom: '16px', color: '#0052CC' }}>👥 Audit Team Resources</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { role: 'Engagement Partner', allocation: '20%', icon: '👔' },
            { role: 'Audit Manager', allocation: '50%', icon: '📊' },
            { role: 'Senior Auditors', allocation: '100%', count: '2', icon: '👨‍💼' },
            { role: 'Junior Auditors', allocation: '100%', count: '3', icon: '👨‍💻' },
            { role: 'Specialist', allocation: '30%', icon: '🔧' }
          ].map((member, idx) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: '#f0f7ff',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #0052CC'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{member.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>{member.role}</div>
              {member.count && <small style={{ color: '#666' }}>({member.count} people)</small>}
              <div style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#0052CC',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {member.allocation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVisualInterface;
