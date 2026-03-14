/**
 * COMPREHENSIVE AUDIT DASHBOARD
 * Complete engagement management interface
 * Real-time data binding with full functionality
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAudit } from "../context/AuditContext";

export function ComprehensiveAuditDashboard() {
  const audit = useAudit();
  const { state } = audit;
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const engagement = state.currentEngagement;
  const procedures = state.procedures;
  const findings = state.findings;
  const evidence = state.evidence;
  const materiality = state.materiality;

  // Real-time sync indicator
  useEffect(() => {
    if (state.syncStatus === "synced") {
      const timer = setTimeout(
        () => {},
        2000
      );
      return () => clearTimeout(timer);
    }
  }, [state.syncStatus]);

  // Calculate progress
  const procProgress = procedures.length
    ? Math.round(
        (procedures.filter(p => p.status === "completed").length /
          procedures.length) *
          100
      )
    : 0;

  const openFindings = findings.filter(f => f.status !== "closed").length;
  const criticalFindings = findings.filter(
    f => f.severity === "high" || f.severity === "critical"
  ).length;

  return (
    <div className="audit-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎯 Audit Engagement Dashboard</h1>
          {engagement && (
            <p className="subtitle">
              {engagement.entity?.name} • {engagement.entity?.jurisdiction} •{" "}
              {engagement.framework}
            </p>
          )}
        </div>

        {/* Sync Status */}
        <div className="sync-indicator">
          {state.syncStatus === "syncing" && (
            <span className="syncing">🔄 Syncing...</span>
          )}
          {state.syncStatus === "synced" && (
            <span className="synced">✓ Synced</span>
          )}
          {state.syncStatus === "error" && (
            <span className="sync-error">✗ Sync Error</span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {engagement && (
        <div className="quick-stats">
          <div className="stat-card">
            <h3>Progress</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${procProgress}%` }}
              />
            </div>
            <p>{procProgress}% Complete</p>
          </div>

          <div className="stat-card">
            <h3>Procedures</h3>
            <div className="stat-value">{procedures.length}</div>
            <p>
              {procedures.filter(p => p.status === "completed").length}{" "}
              completed
            </p>
          </div>

          <div className="stat-card">
            <h3>Findings</h3>
            <div className={`stat-value ${openFindings > 0 ? "alert" : ""}`}>
              {openFindings}
            </div>
            <p>{criticalFindings} critical</p>
          </div>

          <div className="stat-card">
            <h3>Materiality</h3>
            <div className="stat-value">
              £{materiality?.overall_materiality?.toLocaleString()}
            </div>
            <p>Overall materiality</p>
          </div>

          <div className="stat-card">
            <h3>Evidence</h3>
            <div className="stat-value">{evidence.length}</div>
            <p>
              {evidence.filter(e => e.review_status === "accepted").length}{" "}
              accepted
            </p>
          </div>

          <div className="stat-card">
            <h3>Hours</h3>
            <div className="stat-value">
              {engagement.hours?.actual || 0} /{engagement.hours?.estimated}
            </div>
            <p>Actual vs Budgeted</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === "procedures" ? "active" : ""}`}
          onClick={() => setActiveTab("procedures")}
        >
          ✓ Procedures ({procedures.length})
        </button>
        <button
          className={`tab ${activeTab === "findings" ? "active" : ""}`}
          onClick={() => setActiveTab("findings")}
        >
          ⚠ Findings ({openFindings})
        </button>
        <button
          className={`tab ${activeTab === "evidence" ? "active" : ""}`}
          onClick={() => setActiveTab("evidence")}
        >
          📄 Evidence ({evidence.length})
        </button>
        <button
          className={`tab ${activeTab === "risks" ? "active" : ""}`}
          onClick={() => setActiveTab("risks")}
        >
          🔴 Risks
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === "overview" && engagement && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="info-card">
                <h3>Engagement Details</h3>
                <dl>
                  <dt>Type:</dt>
                  <dd>{engagement.type}</dd>
                  <dt>Framework:</dt>
                  <dd>{engagement.framework}</dd>
                  <dt>Year End:</dt>
                  <dd>{engagement.financialYearEnd}</dd>
                  <dt>Status:</dt>
                  <dd>
                    <span className={`badge ${engagement.status}`}>
                      {engagement.status}
                    </span>
                  </dd>
                </dl>
              </div>

              <div className="info-card">
                <h3>Team</h3>
                <dl>
                  <dt>Partner:</dt>
                  <dd>{engagement.partner}</dd>
                  <dt>Manager:</dt>
                  <dd>{engagement.manager}</dd>
                </dl>
              </div>

              <div className="info-card">
                <h3>Materiality</h3>
                {materiality && (
                  <dl>
                    <dt>Overall:</dt>
                    <dd>£{materiality.overall_materiality?.toLocaleString()}</dd>
                    <dt>Performance:</dt>
                    <dd>
                      £{materiality.performance_materiality?.toLocaleString()}
                    </dd>
                    <dt>Trivial:</dt>
                    <dd>£{materiality.trivial_threshold?.toLocaleString()}</dd>
                  </dl>
                )}
              </div>

              <div className="info-card">
                <h3>Progress</h3>
                <dl>
                  <dt>Procedures:</dt>
                  <dd>
                    {procedures.filter(p => p.status === "completed").length} /{" "}
                    {procedures.length}
                  </dd>
                  <dt>Hours Used:</dt>
                  <dd>
                    {engagement.hours?.actual} / {engagement.hours?.estimated}
                  </dd>
                  <dt>Completion:</dt>
                  <dd>{procProgress}%</dd>
                </dl>
              </div>
            </div>

            {/* Top Findings */}
            {openFindings > 0 && (
              <div className="top-section">
                <h3>⚠ Outstanding Findings</h3>
                <div className="findings-summary">
                  {findings
                    .filter(f => f.status !== "closed")
                    .slice(0, 3)
                    .map(finding => (
                      <div
                        key={finding.id}
                        className={`finding-item ${finding.severity}`}
                      >
                        <h4>{finding.description}</h4>
                        <p>
                          <strong>{finding.fsli}</strong> • {finding.type}
                        </p>
                        {finding.impact_amount > 0 && (
                          <p>
                            Impact: £
                            {finding.impact_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Procedures Tab */}
        {activeTab === "procedures" && (
          <div className="procedures-section">
            <div className="procedures-list">
              {procedures.map(procedure => (
                <div
                  key={procedure.id}
                  className={`procedure-card ${procedure.status}`}
                  onClick={() => setSelectedProcedure(procedure)}
                >
                  <div className="procedure-header">
                    <h4>{procedure.procedure_name}</h4>
                    <span className={`status-badge ${procedure.status}`}>
                      {procedure.status}
                    </span>
                  </div>
                  <p className="fsli">{procedure.fsli} • {procedure.assertion}</p>

                  <div className="procedure-meta">
                    <span>📋 {procedure.evidence_count || 0} evidence</span>
                    <span>⏱ {procedure.actual_hours || 0}h used</span>
                    <span>📊 {procedure.estimated_hours}h estimated</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          procedure.status === "completed"
                            ? 100
                            : procedure.status === "in_progress"
                            ? 50
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {selectedProcedure && (
              <div className="procedure-detail">
                <h3>{selectedProcedure.procedure_name}</h3>
                <p>
                  Status: <strong>{selectedProcedure.status}</strong>
                </p>
                <button
                  onClick={() => {
                    audit.updateProcedureStatus(
                      selectedProcedure.id,
                      selectedProcedure.status === "completed"
                        ? "in_progress"
                        : "completed",
                      selectedProcedure.status === "completed" ? 50 : 100
                    );
                  }}
                  className="btn-primary"
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* Findings Tab */}
        {activeTab === "findings" && (
          <div className="findings-section">
            {findings.length === 0 ? (
              <p className="empty-state">✓ No findings recorded</p>
            ) : (
              <div className="findings-list">
                {findings.map(finding => (
                  <div
                    key={finding.id}
                    className={`finding-card ${finding.severity}`}
                  >
                    <div className="finding-header">
                      <h4>{finding.description}</h4>
                      <span className={`severity-badge ${finding.severity}`}>
                        {finding.severity}
                      </span>
                    </div>
                    <p>
                      <strong>{finding.fsli}</strong> • {finding.type}
                    </p>
                    {finding.impact_amount > 0 && (
                      <p>
                        Impact: £
                        {finding.impact_amount.toLocaleString()}
                      </p>
                    )}
                    <p className="status">Status: {finding.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === "evidence" && (
          <div className="evidence-section">
            {evidence.length === 0 ? (
              <p className="empty-state">No evidence uploaded yet</p>
            ) : (
              <div className="evidence-list">
                {evidence.map(item => (
                  <div
                    key={item.id}
                    className={`evidence-card ${item.status}`}
                  >
                    <div className="evidence-info">
                      <h4>{item.file_name}</h4>
                      <p>{item.type}</p>
                      <p className="date">Uploaded: {item.uploaded}</p>
                    </div>
                    <span className={`review-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === "risks" && (
          <div className="risks-section">
            <p>Risk assessments will be displayed here</p>
          </div>
        )}
      </div>

      {/* Notifications */}
      {state.notifications.length > 0 && (
        <div className="notifications">
          {state.notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {state.error && (
        <div className="error-alert">
          <p>{state.error}</p>
          <button onClick={audit.clearError}>×</button>
        </div>
      )}

      <style jsx>{`
        .audit-dashboard {
          padding: 24px;
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
          border-radius: 12px;
          color: #fff;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .header-content h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }

        .sync-indicator {
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
          font-size: 12px;
        }

        .syncing { color: #ff9800; }
        .synced { color: #66bb6a; }
        .sync-error { color: #f44336; }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 16px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 12px 0;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 4px;
        }

        .stat-value.alert {
          color: #f44336;
        }

        .stat-card p {
          margin: 0;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }

        .progress-bar {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
          transition: width 0.3s;
        }

        .tab-navigation {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 13px;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }

        .tab.active {
          color: #42a5f5;
          border-bottom-color: #42a5f5;
        }

        .tab-content {
          margin-bottom: 32px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-card {
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
        }

        .info-card h3 {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: white;
        }

        .info-card dl {
          margin: 0;
        }

        .info-card dt {
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          margin-top: 8px;
        }

        .info-card dd {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: rgba(255,255,255,0.9);
        }

        .badge {
          padding: 4px 8px;
          background: rgba(66, 165, 245, 0.2);
          color: #42a5f5;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
        }

        .procedures-list {
          display: grid;
          gap: 12px;
        }

        .procedure-card {
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .procedure-card:hover {
          background: rgba(66, 165, 245, 0.1);
          border-color: rgba(66, 165, 245, 0.2);
        }

        .procedure-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .procedure-header h4 {
          margin: 0;
          font-size: 13px;
          color: white;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .status-badge.completed {
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
        }

        .status-badge.in_progress {
          background: rgba(255, 165, 0, 0.2);
          color: #ff9800;
        }

        .status-badge.not_started {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
        }

        .fsli {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
        }

        .procedure-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }

        .findings-list, .evidence-list {
          display: grid;
          gap: 12px;
        }

        .finding-card, .evidence-card {
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-left: 4px solid;
          border-radius: 8px;
        }

        .finding-card.high,
        .finding-card.critical {
          border-left-color: #f44336;
          background: rgba(244, 67, 54, 0.05);
        }

        .finding-card.medium {
          border-left-color: #ff9800;
          background: rgba(255, 152, 0, 0.05);
        }

        .finding-card.low {
          border-left-color: #66bb6a;
          background: rgba(102, 187, 106, 0.05);
        }

        .finding-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }

        .finding-header h4 {
          margin: 0;
          font-size: 13px;
          color: white;
          flex: 1;
        }

        .severity-badge {
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: bold;
          margin-left: 8px;
        }

        .severity-badge.critical {
          background: rgba(244, 67, 54, 0.2);
          color: #ff6b6b;
        }

        .severity-badge.high {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }

        .severity-badge.medium {
          background: rgba(255, 165, 0, 0.2);
          color: #ff9800;
        }

        .severity-badge.low {
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
        }

        .evidence-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .evidence-info h4 {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: white;
        }

        .evidence-info p {
          margin: 0;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
        }

        .date {
          margin-top: 4px;
        }

        .review-badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .review-badge.accepted {
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
        }

        .review-badge.pending {
          background: rgba(255, 165, 0, 0.2);
          color: #ff9800;
        }

        .review-badge.rejected {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }

        .empty-state {
          text-align: center;
          color: rgba(255,255,255,0.6);
          padding: 32px;
        }

        .notifications {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          max-width: 400px;
        }

        .notification {
          padding: 12px 16px;
          background: rgba(66, 165, 245, 0.9);
          color: white;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 12px;
          animation: slideIn 0.3s ease;
        }

        .notification.error {
          background: rgba(244, 67, 54, 0.9);
        }

        .notification.success {
          background: rgba(102, 187, 106, 0.9);
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .error-alert {
          padding: 12px 16px;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 6px;
          color: #ff6b6b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .error-alert p {
          margin: 0;
          font-size: 12px;
        }

        .error-alert button {
          background: none;
          border: none;
          color: #ff6b6b;
          cursor: pointer;
          font-size: 18px;
        }

        .btn-primary {
          padding: 8px 16px;
          background: #42a5f5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          background: #2196f3;
        }
      `}</style>
    </div>
  );
}

export default ComprehensiveAuditDashboard;
