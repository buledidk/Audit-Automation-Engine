import { useState } from 'react';

/**
 * Integration Hub
 * Unified control center for all external integrations
 * Slack, GitHub, Email, AWS S3 connectors
 */
const IntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, _setIntegrations] = useState({
    slack: { connected: true, messagesSent: 47, lastSyncText: '2 minutes ago', status: 'active' },
    github: { connected: true, issuesCreated: 12, lastSyncText: '5 minutes ago', status: 'active' },
    email: { connected: true, reportsSent: 8, lastSyncText: 'Just now', status: 'active' },
    aws: { connected: true, filesUploaded: 156, lastSyncText: '1 hour ago', status: 'active' }
  });

  const getStatusColor = (status) => {
    return status === 'active' ? '#4CAF50' : status === 'pending' ? '#FF9800' : '#F44336';
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f0f0' }}>
      <h2 style={{ marginBottom: '24px' }}>🔗 Integration Hub</h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #ddd', paddingBottom: '12px' }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'slack', label: '💬 Slack', icon: '💬' },
          { id: 'github', label: '🐙 GitHub', icon: '🐙' },
          { id: 'email', label: '📧 Email', icon: '📧' },
          { id: 'aws', label: '☁️ AWS', icon: '☁️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              backgroundColor: activeTab === tab.id ? '#0066cc' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              fontSize: '13px'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {Object.entries(integrations).map(([key, data]) => (
            <div key={key} style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: `2px solid ${getStatusColor(data.status)}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{key}</h3>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: getStatusColor(data.status),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  ● {data.status.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                Last sync: {data.lastSyncText}
              </div>

              <div style={{
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
                  {key === 'slack' ? data.messagesSent : 
                   key === 'github' ? data.issuesCreated :
                   key === 'email' ? data.reportsSent :
                   data.filesUploaded}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                  {key === 'slack' ? 'Messages Sent' : 
                   key === 'github' ? 'Issues Created' :
                   key === 'email' ? 'Reports Sent' :
                   'Files Uploaded'}
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                Configure
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Slack Tab */}
      {activeTab === 'slack' && (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>Slack Integration</h3>
          <p>Send audit notifications and findings to Slack channels</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>Webhook URL:</strong></label>
            <input type="password" placeholder="https://hooks.slack.com/..." style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>Channel:</strong></label>
            <input type="text" placeholder="#audit-team" style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: '#36C5F0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Connection
          </button>
        </div>
      )}

      {/* GitHub Tab */}
      {activeTab === 'github' && (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>GitHub Integration</h3>
          <p>Create issues for audit findings and track remediation</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>Access Token:</strong></label>
            <input type="password" placeholder="ghp_..." style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>Repository:</strong></label>
            <input type="text" placeholder="org/audit-findings" style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Connection
          </button>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>Email Integration</h3>
          <p>Send audit reports and notifications via email</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>SMTP Server:</strong></label>
            <input type="text" placeholder="smtp.gmail.com" style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>From Email:</strong></label>
            <input type="email" placeholder="audit@company.com" style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: '#EA4335',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Connection
          </button>
        </div>
      )}

      {/* AWS Tab */}
      {activeTab === 'aws' && (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>AWS S3 Integration</h3>
          <p>Upload audit working papers and evidence to AWS S3</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>S3 Bucket:</strong></label>
            <input type="text" placeholder="audit-bucket-2026" style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><strong>AWS Region:</strong></label>
            <select style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <option>eu-west-1</option>
              <option>us-east-1</option>
              <option>ap-southeast-1</option>
            </select>
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: '#FF9900',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Test Connection
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationHub;
