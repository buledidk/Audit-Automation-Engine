/**
 * Real-Time Audit Dashboard
 *
 * Live progress tracking, metrics, and team collaboration view
 */

import { useState, useEffect, useMemo } from "react";
import AuditDashboardService from "../services/auditDashboardService";

export function AuditDashboard({ engagementId = "" }) {
  const [metrics, setMetrics] = useState(null);
  const [heatMap, setHeatMap] = useState(null);
  const [activities, setActivities] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const service = useMemo(() => {
    return new AuditDashboardService();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!engagementId) {
      setError("Engagement ID required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Initial load
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = service.subscribeToUpdates(engagementId, (data) => {
      setMetrics(data.metrics);
      setHeatMap(data.heatMap);
      setActivities(data.activity);
    });

    return () => {
      unsubscribe();
    };
  }, [engagementId, service]);

  /**
   * Load initial data
   */
  async function loadData() {
    try {
      const [metricsData, heatMapData, activitiesData, teamDataData] =
        await Promise.all([
          service.getProgressMetrics(engagementId),
          service.getFsliHeatMap(engagementId),
          service.getActivityFeed(engagementId, 10),
          service.getTeamMetrics(engagementId)
        ]);

      setMetrics(metricsData);
      setHeatMap(heatMapData);
      setActivities(activitiesData);
      setTeamData(teamDataData);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      setLoading(false);
    }
  }

  /**
   * Get risk color
   */
  function getRiskColor(riskLevel) {
    switch (riskLevel) {
      case "High":
        return "#ff6b6b";
      case "Medium":
        return "#ffa500";
      default:
        return "#66bb6a";
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="spinner" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard error">
        <p>⚠️ {error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>📊 Real-Time Audit Dashboard</h2>
        <p className="subtitle">Engagement: {engagementId}</p>
      </div>

      {/* Progress Metrics */}
      {metrics && (
        <div className="metrics-section">
          <h3>Progress Overview</h3>
          <div className="metrics-grid">
            {/* Overall Completion */}
            <div className="metric-card">
              <div className="metric-value">{metrics.overall_completion}%</div>
              <div className="metric-label">Overall Completion</div>
              <div className="metric-bar">
                <div
                  className="bar-fill"
                  style={{ width: `${metrics.overall_completion}%` }}
                />
              </div>
            </div>

            {/* Procedures */}
            <div className="metric-card">
              <div className="metric-value">{metrics.procedures_completed}</div>
              <div className="metric-label">Procedures Completed</div>
              <div className="metric-subtitle">
                {metrics.procedures_remaining} remaining
              </div>
            </div>

            {/* Exceptions */}
            <div className="metric-card">
              <div className="metric-value">{metrics.exceptions_logged}</div>
              <div className="metric-label">Exceptions Logged</div>
              <div className="metric-subtitle">Under review</div>
            </div>

            {/* Time */}
            <div className="metric-card">
              <div className="metric-value">
                {Math.round((metrics.time_spent_hours / metrics.budget_hours) * 100)}%
              </div>
              <div className="metric-label">Budget Utilized</div>
              <div className="metric-subtitle">
                {metrics.time_spent_hours}/{metrics.budget_hours} hours
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heat Map */}
      {heatMap && (
        <div className="heatmap-section">
          <h3>FSLI Status Heat Map</h3>
          <div className="heatmap-grid">
            {heatMap.map((item) => (
              <div
                key={item.fsli}
                className="heatmap-cell"
                style={{
                  borderLeftColor: getRiskColor(item.risk_level)
                }}
              >
                <div className="cell-header">
                  <strong>{item.fsli}</strong>
                  <span className="risk-badge" style={{ color: getRiskColor(item.risk_level) }}>
                    {item.risk_level} Risk
                  </span>
                </div>

                <div className="cell-content">
                  <div className="progress-item">
                    <span>Completion</span>
                    <span className="value">{item.completion}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>

                  <div className="stats-row">
                    <div className="stat">
                      <span className="stat-label">Exceptions</span>
                      <span className="stat-value">{item.exceptions}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Remaining</span>
                      <span className="stat-value">{item.procedures_remaining}</span>
                    </div>
                  </div>

                  <div className="status-badge" style={{ borderTopColor: getRiskColor(item.risk_level) }}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      {activities && (
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon">
                  {activity.type === "procedure_completed" && "✓"}
                  {activity.type === "exception_logged" && "⚠"}
                  {activity.type === "review_completed" && "👍"}
                  {activity.type === "procedure_started" && "▶"}
                </div>

                <div className="activity-content">
                  <div className="activity-title">
                    {activity.type === "procedure_completed" &&
                      `${activity.user} completed ${activity.procedure}`}
                    {activity.type === "exception_logged" &&
                      `${activity.user} logged exception in ${activity.fsli}`}
                    {activity.type === "review_completed" &&
                      `${activity.fsli} approved by ${activity.reviewer}`}
                    {activity.type === "procedure_started" &&
                      `${activity.user} started ${activity.procedure}`}
                  </div>

                  <div className="activity-time">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="activity-detail">
                  {activity.exceptions !== undefined && `Exceptions: ${activity.exceptions}`}
                  {activity.amount && `Amount: $${activity.amount.toLocaleString()}`}
                  {activity.sample_size && `Sample: ${activity.sample_size} items`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Metrics */}
      {teamData && (
        <div className="team-section">
          <h3>Team Workload</h3>
          <div className="team-grid">
            {teamData.map((member) => (
              <div key={member.team_member} className="team-card">
                <div className="member-header">
                  <h4>{member.team_member}</h4>
                  <span className="role">{member.role}</span>
                </div>

                <div className="utilization-bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${member.utilization}%`,
                      background:
                        member.utilization > 100
                          ? "#ff6b6b"
                          : member.utilization > 85
                            ? "#ffa500"
                            : "#66bb6a"
                    }}
                  />
                </div>

                <div className="member-stats">
                  <div className="stat">
                    <span className="label">Utilization</span>
                    <span className="value">{member.utilization}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Procedures</span>
                    <span className="value">
                      {member.procedures_completed}/{member.procedures_assigned}
                    </span>
                  </div>
                </div>

                <div className="current-task">{member.current_task}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .dashboard-header {
          margin-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .dashboard-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .metrics-section h3,
        .heatmap-section h3,
        .activity-section h3,
        .team-section h3 {
          margin: 24px 0 16px 0;
          font-size: 16px;
          color: white;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .metric-card {
          padding: 16px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-radius: 8px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .metric-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .metric-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .bar-fill {
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
          height: 100%;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .heatmap-cell {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 4px solid;
          border-radius: 8px;
        }

        .cell-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .cell-header strong {
          color: white;
          font-size: 14px;
        }

        .risk-badge {
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .cell-content {
          font-size: 12px;
        }

        .progress-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-bottom: 12px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .stat-value {
          font-size: 16px;
          font-weight: bold;
          color: white;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-top: 2px solid;
          border-radius: 4px;
          margin-top: 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          align-items: center;
        }

        .activity-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(66, 165, 245, 0.1);
          border-radius: 50%;
          font-weight: bold;
          color: #42a5f5;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          color: white;
          font-size: 13px;
          font-weight: 500;
        }

        .activity-time {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 4px;
        }

        .activity-detail {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .team-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }

        .member-header {
          margin-bottom: 12px;
        }

        .member-header h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: white;
        }

        .role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .utilization-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .member-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
          padding: 12px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .member-stats .stat {
          font-size: 11px;
        }

        .member-stats .label {
          color: rgba(255, 255, 255, 0.5);
        }

        .member-stats .value {
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .current-task {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          margin-top: 8px;
        }

        .loading,
        .error {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          border: 3px solid rgba(66, 165, 245, 0.2);
          border-top-color: #42a5f5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AuditDashboard;
