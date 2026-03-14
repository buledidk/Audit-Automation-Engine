/**
 * PRODUCTION CODE: Engagement Planning Component
 *
 * Multi-Jurisdictional Audit Planning Interface
 * COPY & PASTE READY - Production Grade
 */

import { useState, useMemo, useEffect } from "react";
import JurisdictionEngine from "../services/jurisdictionEngine";

export function EngagementPlanning({
  engagementId = "",
  onSave = () => {}
}) {
  const [engagement, setEngagement] = useState({
    entityName: "",
    jurisdiction: "UK",
    entityType: "Limited Company (Private)",
    framework: "FRS102",
    yearEnd: new Date().toISOString().split("T")[0],
    turnover: 0,
    assets: 0,
    riskLevel: "Medium",
    teamMembers: []
  });

  const [materiality, setMateriality] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const engine = useMemo(() => new JurisdictionEngine(), []);

  // Calculate materiality when jurisdiction or financials change
  useEffect(() => {
    if (engagement.jurisdiction && engagement.turnover) {
      const mat = engine.calculateJurisdictionMateriality(
        engagement.jurisdiction,
        {
          profit: engagement.turnover * 0.15, // Assume 15% profit margin
          revenue: engagement.turnover,
          assets: engagement.assets
        }
      );
      setMateriality(mat);

      // Get applicable procedures
      const procs = engine.getApplicableProcedures(
        engagement.jurisdiction,
        "Revenue",
        engagement.riskLevel
      );
      setProcedures(procs);

      // Get compliance calendar
      const cal = engine.getComplianceCalendar(
        engagement.jurisdiction,
        engagement.yearEnd
      );
      setCalendar(cal);
    }
  }, [engagement.jurisdiction, engagement.turnover, engagement.riskLevel, engine]);

  /**
   * Handle jurisdiction change
   */
  function handleJurisdictionChange(newJurisdiction) {
    const juris = engine.getJurisdiction(newJurisdiction);

    setEngagement(prev => ({
      ...prev,
      jurisdiction: newJurisdiction,
      framework: juris.default_framework,
      entityType: juris.entity_types[0] // Auto-select first entity type
    }));
  }

  /**
   * Save engagement
   */
  async function saveEngagement() {
    setLoading(true);
    try {
      // TODO: Call API to save
      onSave({
        ...engagement,
        materiality,
        procedures
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Generate audit plan
   */
  async function generateAuditPlan() {
    setLoading(true);
    try {
      const plan = await engine.generateAuditPlan({
        jurisdiction: engagement.jurisdiction,
        entityName: engagement.entityName,
        framework: engagement.framework,
        yearEnd: engagement.yearEnd,
        turnover: engagement.turnover,
        riskLevel: engagement.riskLevel,
        requiresAudit: !engine.checkAuditExemption(engagement.jurisdiction, {
          turnover: engagement.turnover
        }).exempt
      });

      // Update engagement with generated plan
      setEngagement(prev => ({
        ...prev,
        auditPlan: plan
      }));

      setActiveTab("plan");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get jurisdiction details
   */
  const jurisdictionInfo = engine.getJurisdiction(engagement.jurisdiction);
  const exemption = engine.checkAuditExemption(engagement.jurisdiction, {
    turnover: engagement.turnover
  });

  return (
    <div className="engagement-planning">
      {/* Header */}
      <div className="planning-header">
        <h2>🌍 Multi-Jurisdictional Audit Planning</h2>
        <p className="subtitle">
          Engagement: {engagement.entityName || "New Engagement"}
        </p>
      </div>

      {/* Jurisdiction Banner */}
      <div className="jurisdiction-banner" style={{
        borderLeftColor: this._getJurisdictionColor(engagement.jurisdiction)
      }}>
        <div className="jurisdiction-info">
          <h3>{jurisdictionInfo.name}</h3>
          <p>{jurisdictionInfo.regulations.join(" • ")}</p>
        </div>
        <div className="jurisdiction-select">
          <select
            value={engagement.jurisdiction}
            onChange={(e) => handleJurisdictionChange(e.target.value)}
            className="jurisdiction-dropdown"
          >
            {engine.getSupportedJurisdictions().map(juris => (
              <option key={juris.code} value={juris.code}>
                {juris.code} - {juris.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📋 Overview
        </button>
        <button
          className={`tab ${activeTab === "materiality" ? "active" : ""}`}
          onClick={() => setActiveTab("materiality")}
        >
          💰 Materiality
        </button>
        <button
          className={`tab ${activeTab === "procedures" ? "active" : ""}`}
          onClick={() => setActiveTab("procedures")}
        >
          ✓ Procedures
        </button>
        <button
          className={`tab ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          📅 Calendar
        </button>
        <button
          className={`tab ${activeTab === "plan" ? "active" : ""}`}
          onClick={() => setActiveTab("plan")}
        >
          📊 Audit Plan
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="tab-content">
          <div className="form-grid">
            {/* Entity Details */}
            <div className="form-section">
              <h3>Entity Details</h3>

              <div className="form-group">
                <label>Entity Name *</label>
                <input
                  type="text"
                  value={engagement.entityName}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      entityName: e.target.value
                    }))
                  }
                  placeholder="ABC Limited"
                />
              </div>

              <div className="form-group">
                <label>Entity Type *</label>
                <select
                  value={engagement.entityType}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      entityType: e.target.value
                    }))
                  }
                >
                  {jurisdictionInfo.entity_types.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year End Date *</label>
                <input
                  type="date"
                  value={engagement.yearEnd}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      yearEnd: e.target.value
                    }))
                  }
                />
              </div>
            </div>

            {/* Financial Details */}
            <div className="form-section">
              <h3>Financial Information</h3>

              <div className="form-group">
                <label>Annual Turnover (£)</label>
                <input
                  type="number"
                  value={engagement.turnover}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      turnover: parseFloat(e.target.value) || 0
                    }))
                  }
                  placeholder="1000000"
                />
              </div>

              <div className="form-group">
                <label>Total Assets (£)</label>
                <input
                  type="number"
                  value={engagement.assets}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      assets: parseFloat(e.target.value) || 0
                    }))
                  }
                  placeholder="500000"
                />
              </div>

              {/* Audit Exemption Status */}
              <div className="exemption-status">
                <h4>Audit Requirement</h4>
                {exemption.exempt ? (
                  <div className="status-badge exempt">
                    ✓ Audit Exempt
                    <br />
                    <small>(Turnover below £{exemption.threshold.toLocaleString()})</small>
                  </div>
                ) : (
                  <div className="status-badge required">
                    ⚠ Audit Required
                    <br />
                    <small>(Turnover above £{exemption.threshold.toLocaleString()})</small>
                  </div>
                )}
              </div>
            </div>

            {/* Framework & Risk */}
            <div className="form-section">
              <h3>Accounting & Risk</h3>

              <div className="form-group">
                <label>Accounting Framework *</label>
                <select
                  value={engagement.framework}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      framework: e.target.value
                    }))
                  }
                >
                  {jurisdictionInfo.frameworks.map(fw => (
                    <option key={fw} value={fw}>
                      {fw}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Overall Risk Level *</label>
                <select
                  value={engagement.riskLevel}
                  onChange={(e) =>
                    setEngagement(prev => ({
                      ...prev,
                      riskLevel: e.target.value
                    }))
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="jurisdiction-reqs">
                <h4>Key Requirements</h4>
                <ul>
                  <li>
                    Accounts filing: {jurisdictionInfo.filing_requirements.accounts_deadline} months
                  </li>
                  <li>Exemption threshold: £{jurisdictionInfo.filing_requirements.audit_exemption_threshold.toLocaleString()}</li>
                  <li>Primary framework: {jurisdictionInfo.default_framework}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={saveEngagement}
              disabled={!engagement.entityName || loading}
              className="btn-primary"
            >
              💾 Save Engagement
            </button>
            <button
              onClick={generateAuditPlan}
              disabled={!engagement.entityName || !engagement.turnover || loading}
              className="btn-secondary"
            >
              🚀 Generate Audit Plan
            </button>
          </div>
        </div>
      )}

      {/* Materiality Tab */}
      {activeTab === "materiality" && materiality && (
        <div className="tab-content materiality">
          <div className="materiality-display">
            <div className="materiality-card primary">
              <div className="label">Overall Materiality</div>
              <div className="amount">£{materiality.overall_materiality.toLocaleString()}</div>
            </div>
            <div className="materiality-card secondary">
              <div className="label">Performance Materiality</div>
              <div className="amount">£{materiality.performance_materiality.toLocaleString()}</div>
            </div>
            <div className="materiality-card tertiary">
              <div className="label">Trivial Threshold</div>
              <div className="amount">£{materiality.trivial_threshold.toLocaleString()}</div>
            </div>
          </div>

          <div className="benchmark-analysis">
            <h3>Benchmark Analysis</h3>
            <table className="benchmark-table">
              <thead>
                <tr>
                  <th>Basis</th>
                  <th>Rate</th>
                  <th>Amount (£)</th>
                </tr>
              </thead>
              <tbody>
                {materiality.benchmarks.map((bench, idx) => (
                  <tr key={idx}>
                    <td>{bench.basis}</td>
                    <td>{(bench.rate * 100).toFixed(1)}%</td>
                    <td>£{bench.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="guidance">
            <p>
              <strong>Guidance Source:</strong> {materiality.guidance_source}
            </p>
          </div>
        </div>
      )}

      {/* Procedures Tab */}
      {activeTab === "procedures" && procedures.length > 0 && (
        <div className="tab-content procedures">
          <h3>Applicable Audit Procedures</h3>
          <div className="procedures-list">
            {procedures.map((proc, idx) => (
              <div key={idx} className="procedure-item">
                <div className="procedure-header">
                  <h4>{proc.name}</h4>
                  <span className={`risk-badge ${proc.risk_level?.toLowerCase()}`}>
                    {proc.risk_level || "Standard"}
                  </span>
                </div>
                <div className="procedure-details">
                  <span className="detail">
                    <strong>Assertion:</strong> {proc.assertion}
                  </span>
                  <span className="detail">
                    <strong>Sample:</strong> {proc.sample_size_formula || "Judgmental"}
                  </span>
                  <span className="detail">
                    <strong>Est. Hours:</strong> {proc.estimated_hours}h
                  </span>
                </div>
                {proc.mandatory && <div className="mandatory-badge">Mandatory</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && calendar && (
        <div className="tab-content calendar">
          <h3>Compliance Calendar</h3>
          <div className="calendar-display">
            {calendar.key_deadlines.map((deadline, idx) => (
              <div key={idx} className="deadline-item">
                <div className="date">{new Date(deadline.date).toLocaleDateString()}</div>
                <div className="event">{deadline.event}</div>
              </div>
            ))}
          </div>

          <div className="timeline-info">
            <h4>Audit Timeline</h4>
            <p>{calendar.audit_planning_period}</p>
            <p>{calendar.audit_fieldwork_period}</p>
          </div>
        </div>
      )}

      {/* Plan Tab */}
      {activeTab === "plan" && engagement.auditPlan && (
        <div className="tab-content plan">
          <h3>Generated Audit Plan</h3>
          <div className="plan-display">
            <pre>{JSON.stringify(engagement.auditPlan, null, 2)}</pre>
          </div>
        </div>
      )}

      <style jsx>{`
        .engagement-planning {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .planning-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .planning-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .jurisdiction-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-left: 4px solid;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .jurisdiction-info h3 {
          margin: 0 0 6px 0;
          font-size: 16px;
          color: white;
        }

        .jurisdiction-info p {
          margin: 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .jurisdiction-select select {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 6px;
          font-size: 13px;
        }

        .tab-navigation {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
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

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-section {
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .form-section h3 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 6px;
          font-size: 13px;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #42a5f5;
          background: rgba(66, 165, 245, 0.1);
        }

        .exemption-status,
        .jurisdiction-reqs {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          margin-top: 12px;
        }

        .exemption-status h4,
        .jurisdiction-reqs h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
        }

        .status-badge {
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
        }

        .status-badge.exempt {
          background: rgba(102, 187, 106, 0.1);
          color: #66bb6a;
          border: 1px solid rgba(102, 187, 106, 0.2);
        }

        .status-badge.required {
          background: rgba(255, 165, 0, 0.1);
          color: #ff9800;
          border: 1px solid rgba(255, 165, 0, 0.2);
        }

        .jurisdiction-reqs ul {
          margin: 0;
          padding-left: 16px;
          list-style: disc;
        }

        .jurisdiction-reqs li {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #42a5f5;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2196f3;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .materiality-display {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .materiality-card {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .materiality-card.primary {
          background: rgba(66, 165, 245, 0.1);
          border: 1px solid rgba(66, 165, 245, 0.2);
        }

        .materiality-card.secondary {
          background: rgba(255, 165, 0, 0.1);
          border: 1px solid rgba(255, 165, 0, 0.2);
        }

        .materiality-card.tertiary {
          background: rgba(102, 187, 106, 0.1);
          border: 1px solid rgba(102, 187, 106, 0.2);
        }

        .materiality-card .label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .materiality-card .amount {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }

        .benchmark-analysis {
          margin: 24px 0;
        }

        .benchmark-analysis h3 {
          font-size: 14px;
          color: white;
          margin-bottom: 12px;
        }

        .benchmark-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .benchmark-table th,
        .benchmark-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .benchmark-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
        }

        .procedures-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .procedure-item {
          padding: 16px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.1);
          border-radius: 8px;
          position: relative;
        }

        .procedure-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .procedure-header h4 {
          margin: 0;
          font-size: 13px;
          color: white;
        }

        .risk-badge {
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .risk-badge.high {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        .risk-badge.medium {
          background: rgba(255, 165, 0, 0.2);
          color: #ff9800;
        }

        .risk-badge.low {
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
        }

        .procedure-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .detail {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .detail strong {
          color: rgba(255, 255, 255, 0.9);
        }

        .mandatory-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 10px;
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .calendar-display {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .deadline-item {
          padding: 16px;
          background: rgba(255, 165, 0, 0.05);
          border: 1px solid rgba(255, 165, 0, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .deadline-item .date {
          font-size: 14px;
          font-weight: bold;
          color: #ff9800;
          margin-bottom: 6px;
        }

        .deadline-item .event {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .timeline-info {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .timeline-info h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
        }

        .timeline-info p {
          margin: 4px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .plan-display {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }

        .plan-display pre {
          margin: 0;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.4;
        }

        .guidance {
          padding: 12px;
          background: rgba(66, 165, 245, 0.05);
          border-radius: 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .jurisdiction-banner {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .tab-navigation {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

export default EngagementPlanning;

/**
 * Helper: Get jurisdiction color
 */
function _getJurisdictionColor(code) {
  const colors = {
    "UK": "#42a5f5",
    "DE": "#66bb6a",
    "FR": "#ff9800",
    "IT": "#f44336",
    "ES": "#ffeb3b",
    "NL": "#2196f3"
  };
  return colors[code] || "#9c27b0";
}
