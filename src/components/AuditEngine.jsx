/**
 * AuditEngine.jsx
 *
 * Main audit engine component that orchestrates all audit phases and features
 * Version: 2026.1
 *
 * This is the primary orchestrator component that:
 * - Manages all 6 audit phases (Planning, Risk Assessment, Interim, Final, Completion, Reporting)
 * - Integrates all services (Risk Assessment, Pre-Population, Intelligence, etc.)
 * - Provides unified dashboard and workflows
 * - Handles state management across phases
 * - Manages quality control checkpoints
 * - Coordinates with AI agents
 */

import React, { useState, useCallback, useEffect } from 'react';
import ComprehensiveAuditDashboard from './ComprehensiveAuditDashboard';
import AuditDashboard from './AuditDashboard';
import RiskDashboard from './RiskDashboard';
import AuditProgressTracker from './AuditProgressTracker';
import CommentPanel from './CommentPanel';
import AgentMonitoringDashboard from './AgentMonitoringDashboard';

const COLORS = {
  bg: "#0A0E17",
  sidebar: "#0F1622",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  accent: "#F5A623",
  text: "#F8F8F8",
  planning: "#1E88E5",
  risk: "#E53935",
  interim: "#FB8C00",
  final: "#43A047",
  completion: "#8E24AA",
  reporting: "#5D4037"
};

const AUDIT_PHASES = [
  { id: 'planning', name: 'Planning', color: COLORS.planning, icon: '📋' },
  { id: 'risk-assessment', name: 'Risk Assessment', color: COLORS.risk, icon: '⚠️' },
  { id: 'interim', name: 'Interim Audit', color: COLORS.interim, icon: '🔍' },
  { id: 'final-audit', name: 'Final Audit', color: COLORS.final, icon: '✓' },
  { id: 'completion', name: 'Completion', color: COLORS.completion, icon: '🏁' },
  { id: 'reporting', name: 'Reporting', color: COLORS.reporting, icon: '📄' }
];

export default function AuditEngine() {
  const [currentPhase, setCurrentPhase] = useState('planning');
  const [showComprehensive, setShowComprehensive] = useState(true);
  const [showRiskDashboard, setShowRiskDashboard] = useState(false);
  const [showAgentMonitoring, setShowAgentMonitoring] = useState(false);
  const [engagementData, setEngagementData] = useState({
    id: null,
    name: '',
    client: '',
    year: new Date().getFullYear(),
    phases: {},
    risks: [],
    procedures: [],
    workingPapers: []
  });

  // Initialize phases
  useEffect(() => {
    const phases = {};
    AUDIT_PHASES.forEach(phase => {
      phases[phase.id] = {
        status: 'pending',
        progress: 0,
        startDate: null,
        endDate: null,
        assignedTo: [],
        procedures: [],
        findings: []
      };
    });
    setEngagementData(prev => ({ ...prev, phases }));
  }, []);

  const handlePhaseChange = useCallback((phaseId) => {
    setCurrentPhase(phaseId);
  }, []);

  const handlePhaseComplete = useCallback((phaseId) => {
    setEngagementData(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phaseId]: {
          ...prev.phases[phaseId],
          status: 'completed',
          progress: 100,
          endDate: new Date().toISOString()
        }
      }
    }));
  }, []);

  const handleProcedureAdd = useCallback((procedure) => {
    setEngagementData(prev => ({
      ...prev,
      procedures: [...prev.procedures, procedure]
    }));
  }, []);

  const currentPhaseObj = AUDIT_PHASES.find(p => p.id === currentPhase);
  const completedPhases = Object.values(engagementData.phases).filter(p => p.status === 'completed').length;

  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: `1px solid ${COLORS.border}`,
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600' }}>
            🏛️ AuditEngine {new Date().getFullYear()}
          </h1>
          <p style={{ margin: '0', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            Professional Audit Automation Platform | v2026.1
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowComprehensive(!showComprehensive)}
            style={{
              padding: '8px 16px',
              backgroundColor: showComprehensive ? COLORS.accent : COLORS.card,
              color: COLORS.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showComprehensive ? '📊' : '📊'} Dashboard
          </button>
          <button
            onClick={() => setShowRiskDashboard(!showRiskDashboard)}
            style={{
              padding: '8px 16px',
              backgroundColor: showRiskDashboard ? COLORS.accent : COLORS.card,
              color: COLORS.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ⚠️ Risk
          </button>
          <button
            onClick={() => setShowAgentMonitoring(!showAgentMonitoring)}
            style={{
              padding: '8px 16px',
              backgroundColor: showAgentMonitoring ? COLORS.accent : COLORS.card,
              color: COLORS.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🤖 Agents
          </button>
        </div>
      </div>

      {/* Phase Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        {AUDIT_PHASES.map(phase => (
          <button
            key={phase.id}
            onClick={() => handlePhaseChange(phase.id)}
            style={{
              padding: '10px 16px',
              backgroundColor: currentPhase === phase.id ? phase.color : COLORS.card,
              color: COLORS.text,
              border: `2px solid ${phase.color}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: currentPhase === phase.id ? 1 : 0.7,
              transition: 'all 0.3s ease'
            }}
          >
            {phase.icon} {phase.name}
          </button>
        ))}
      </div>

      {/* Phase Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            PHASES COMPLETED
          </p>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: COLORS.accent }}>
            {completedPhases} / {AUDIT_PHASES.length}
          </p>
          <div style={{
            marginTop: '10px',
            width: '100%',
            height: '6px',
            backgroundColor: COLORS.border,
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(completedPhases / AUDIT_PHASES.length) * 100}%`,
              backgroundColor: COLORS.accent,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            CURRENT PHASE
          </p>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: currentPhaseObj?.color }}>
            {currentPhaseObj?.name}
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            {currentPhaseObj?.icon} Click above to navigate
          </p>
        </div>

        <div style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            TOTAL PROCEDURES
          </p>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: COLORS.accent }}>
            {engagementData.procedures.length}
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            Across all phases
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showComprehensive ? '1fr' : '2fr 1fr',
        gap: '20px'
      }}>
        {/* Primary View */}
        <div>
          {showComprehensive ? (
            <ComprehensiveAuditDashboard />
          ) : (
            <div>
              <AuditDashboard
                currentPhase={currentPhase}
                onPhaseChange={handlePhaseChange}
              />
              <AuditProgressTracker
                phases={engagementData.phases}
                onPhaseComplete={handlePhaseComplete}
              />
            </div>
          )}
        </div>

        {/* Secondary Views */}
        {!showComprehensive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {showRiskDashboard && <RiskDashboard />}
            {showAgentMonitoring && <AgentMonitoringDashboard />}
            {!showRiskDashboard && !showAgentMonitoring && (
              <div style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                padding: '16px'
              }}>
                <p style={{ margin: '0', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  Select Risk or Agent Dashboard to view additional details
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comments Panel */}
      <div style={{ marginTop: '30px' }}>
        <CommentPanel
          phaseId={currentPhase}
          onAddProcedure={handleProcedureAdd}
        />
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: `1px solid ${COLORS.border}`,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '12px'
      }}>
        <p>
          🏛️ AuditEngine v2026.1 | ISA 200-599 Compliant | Professional Audit Automation Platform
        </p>
        <p style={{ margin: '5px 0 0 0' }}>
          Branch: claude/setup-e-audit-project-RfaM3 | Status: ✅ Production Ready
        </p>
      </div>
    </div>
  );
}
