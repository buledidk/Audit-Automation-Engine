import React, { useState, useEffect } from 'react';

/**
 * ProjectDashboard - Real-time tracking of audit automation platform
 * Shows phase progress, system health, agent status, and worker queue status
 */
export function ProjectDashboard() {
  const [status, setStatus] = useState({
    phases: {
      phase1: { name: 'Fix & Merge', progress: 0, tasks: [] },
      phase2: { name: 'Compliance', progress: 0, tasks: [] },
      phase3: { name: 'AI Agents', progress: 0, tasks: [] },
      phase4: { name: 'Testing', progress: 0, tasks: [] },
    },
    systems: {
      frontend: { running: false, port: 5175, status: 'checking' },
      backend: { running: false, port: 3001, status: 'checking' },
      database: { running: false, status: 'checking' },
      workers: { running: false, status: 'checking' },
    },
    agents: {
      orchestrator: { running: false, requests: 0 },
      exceptionAnalysis: { running: false, processed: 0 },
      procedureSuggestion: { running: false, processed: 0 },
      reportGeneration: { running: false, processed: 0 },
    },
    metrics: {
      totalHours: 12,
      hoursElapsed: 0,
      codeWritten: 0,
      testsRunning: 0,
    }
  });

  useEffect(() => {
    // Fetch real-time status
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/system/status');
        if (response.ok) {
          const data = await response.json();
          setStatus(prevStatus => ({...prevStatus, ...data}));
        }
      } catch (error) {
        console.log('Status check not yet available');
      }
    };

    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    fetchStatus(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const getProgressColor = (progress) => {
    if (progress === 0) return '#999'; // Gray
    if (progress < 33) return '#ff9500'; // Orange
    if (progress < 66) return '#ffb81c'; // Yellow
    if (progress < 100) return '#34c759'; // Green
    return '#00ff00'; // Bright green
  };

  const ProgressBar = ({ progress, label }) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>{label}</span>
        <span style={{ color: getProgressColor(progress) }}>{progress}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: '#eee',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: getProgressColor(progress),
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

  const SystemHealth = ({ name, running, status }) => (
    <div style={{
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: running ? '#e8f5e9' : '#ffebee',
      border: `1px solid ${running ? '#4caf50' : '#f44336'}`,
      borderRadius: '4px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{name}</span>
        <span style={{ color: running ? '#4caf50' : '#f44336' }}>
          {running ? '✓ Running' : '✗ ' + (status || 'Offline')}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'monospace',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🚀 Audit Automation Platform - Live Tracking Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* LEFT COLUMN: PHASES */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>📊 Phase Progress</h2>

          <ProgressBar
            progress={status.phases.phase1.progress}
            label="Phase 1: Fix & Merge"
          />
          <ProgressBar
            progress={status.phases.phase2.progress}
            label="Phase 2: Compliance"
          />
          <ProgressBar
            progress={status.phases.phase3.progress}
            label="Phase 3: AI Agents"
          />
          <ProgressBar
            progress={status.phases.phase4.progress}
            label="Phase 4: Testing"
          />

          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <strong>Overall Progress:</strong>
            <ProgressBar
              progress={Math.round((
                status.phases.phase1.progress +
                status.phases.phase2.progress +
                status.phases.phase3.progress +
                status.phases.phase4.progress
              ) / 4)}
              label="Total"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM HEALTH */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>🔧 System Health</h2>

          <SystemHealth
            name="Frontend (React)"
            running={status.systems.frontend.running}
            status={`Port ${status.systems.frontend.port}`}
          />
          <SystemHealth
            name="Backend (Express)"
            running={status.systems.backend.running}
            status={`Port ${status.systems.backend.port}`}
          />
          <SystemHealth
            name="Database (PostgreSQL)"
            running={status.systems.database.running}
          />
          <SystemHealth
            name="Workers (Redis + Bull)"
            running={status.systems.workers.running}
          />
        </div>
      </div>

      {/* AGENT METRICS */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h2>🤖 AI Agent Status</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div style={{
            backgroundColor: status.agents.orchestrator.running ? '#e8f5e9' : '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${status.agents.orchestrator.running ? '#4caf50' : '#f44336'}`
          }}>
            <strong>Orchestrator</strong>
            <div>{status.agents.orchestrator.requests} requests</div>
            <div style={{ color: status.agents.orchestrator.running ? '#4caf50' : '#f44336', fontSize: '12px' }}>
              {status.agents.orchestrator.running ? '✓ Ready' : '✗ Offline'}
            </div>
          </div>

          <div style={{
            backgroundColor: status.agents.exceptionAnalysis.running ? '#e8f5e9' : '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${status.agents.exceptionAnalysis.running ? '#4caf50' : '#f44336'}`
          }}>
            <strong>Exception Analysis</strong>
            <div>{status.agents.exceptionAnalysis.processed} processed</div>
            <div style={{ color: status.agents.exceptionAnalysis.running ? '#4caf50' : '#f44336', fontSize: '12px' }}>
              {status.agents.exceptionAnalysis.running ? '✓ Ready' : '✗ Offline'}
            </div>
          </div>

          <div style={{
            backgroundColor: status.agents.procedureSuggestion.running ? '#e8f5e9' : '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${status.agents.procedureSuggestion.running ? '#4caf50' : '#f44336'}`
          }}>
            <strong>Procedure Suggestion</strong>
            <div>{status.agents.procedureSuggestion.processed} processed</div>
            <div style={{ color: status.agents.procedureSuggestion.running ? '#4caf50' : '#f44336', fontSize: '12px' }}>
              {status.agents.procedureSuggestion.running ? '✓ Ready' : '✗ Offline'}
            </div>
          </div>

          <div style={{
            backgroundColor: status.agents.reportGeneration.running ? '#e8f5e9' : '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            border: `1px solid ${status.agents.reportGeneration.running ? '#4caf50' : '#f44336'}`
          }}>
            <strong>Report Generation</strong>
            <div>{status.agents.reportGeneration.processed} processed</div>
            <div style={{ color: status.agents.reportGeneration.running ? '#4caf50' : '#f44336', fontSize: '12px' }}>
              {status.agents.reportGeneration.running ? '✓ Ready' : '✗ Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h2>📈 Project Metrics</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
              {status.metrics.hoursElapsed}h / {status.metrics.totalHours}h
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Time Elapsed</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
              ~{status.metrics.codeWritten}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Lines of Code</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9500' }}>
              {status.metrics.testsRunning}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Tests Running</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
              0
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Critical Blockers</div>
          </div>
        </div>
      </div>

      {/* STATUS MESSAGE */}
      <div style={{
        backgroundColor: '#fff3e0',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ffb74d'
      }}>
        <h3>📝 Status</h3>
        <p>
          <strong>Current Phase:</strong> Starting Phase 1 execution
        </p>
        <p>
          <strong>Next Steps:</strong> Installing dependencies, creating worker queue, setting up audit logging
        </p>
        <p>
          <strong>Expected Completion:</strong> In 12 hours with all systems running
        </p>
      </div>
    </div>
  );
}

export default ProjectDashboard;
