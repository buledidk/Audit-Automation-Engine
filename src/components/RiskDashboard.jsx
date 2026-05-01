/**
 * RISK DASHBOARD COMPONENT
 * Interactive risk visualization and assessment
 *
 * Features:
 * - Risk heatmaps by area
 * - Inherent/Control/Detection risk display
 * - ISA 315/330 alignment
 * - Real-time risk updates
 * - Drill-down to procedures
 */

import { useState, useMemo } from 'react';

const getRiskColor = (riskLevel) => {
  if (riskLevel >= 0.7) return '#ff4757'; // RED
  if (riskLevel >= 0.4) return '#ffa502'; // ORANGE
  if (riskLevel >= 0.2) return '#ffd93d'; // YELLOW
  return '#2ed573'; // GREEN
};

const getRiskLabel = (riskLevel) => {
  if (riskLevel >= 0.7) return 'HIGH';
  if (riskLevel >= 0.4) return 'MEDIUM-HIGH';
  if (riskLevel >= 0.2) return 'MEDIUM';
  return 'LOW';
};

const RiskBar = ({ risk, label, width = '100%' }) => ( // eslint-disable-line no-unused-vars
  <div className="risk-bar-container" style={{ width }}>
    <div className="risk-bar-label">{label}</div>
    <div className="risk-bar-track">
      <div
        className="risk-bar-fill"
        style={{
          width: `${Math.max(risk * 100, 5)}%`,
          backgroundColor: getRiskColor(risk)
        }}
      >
        <span className="risk-bar-text">{(risk * 100).toFixed(0)}%</span>
      </div>
    </div>
    <div className="risk-bar-label">{getRiskLabel(risk)}</div>
  </div>
);

const RiskDashboard = ({ _engagementId, format = 'HEATMAP', riskData = null }) => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [viewMode, setViewMode] = useState(format);

  // Default risk data for demo
  const defaultRiskData = {
    overall: {
      inherentRisk: 0.8,
      controlRisk: 0.5,
      detectionRisk: 0.3,
    },
    byArea: {
      'Revenue Recognition': {
        inherentRisk: 0.8,
        controlRisk: 0.6,
        proceduresCount: 5,
        proceduresDone: 2,
        detectedExceptions: 0,
      },
      'Expense Recording': {
        inherentRisk: 0.5,
        controlRisk: 0.4,
        proceduresCount: 3,
        proceduresDone: 1,
        detectedExceptions: 0,
      },
      'Inventory Valuation': {
        inherentRisk: 0.3,
        controlRisk: 0.2,
        proceduresCount: 2,
        proceduresDone: 1,
        detectedExceptions: 0,
      },
      'Receivables': {
        inherentRisk: 0.8,
        controlRisk: 0.5,
        proceduresCount: 8,
        proceduresDone: 3,
        detectedExceptions: 1,
      },
      'Payables': {
        inherentRisk: 0.4,
        controlRisk: 0.3,
        proceduresCount: 4,
        proceduresDone: 2,
        detectedExceptions: 0,
      },
      'Fixed Assets': {
        inherentRisk: 0.6,
        controlRisk: 0.4,
        proceduresCount: 3,
        proceduresDone: 1,
        detectedExceptions: 0,
      },
    }
  };

  const data = riskData || defaultRiskData;

  const overallRisk = useMemo(() => {
    const { inherentRisk, controlRisk } = data.overall;
    return inherentRisk * controlRisk;
  }, [data]);



  return (
    <div className="risk-dashboard">
      <div className="dashboard-header">
        <h2>📊 Risk Assessment Dashboard</h2>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'HEATMAP' ? 'active' : ''}`}
            onClick={() => setViewMode('HEATMAP')}
          >
            Heatmap
          </button>
          <button
            className={`view-btn ${viewMode === 'WATERFALL' ? 'active' : ''}`}
            onClick={() => setViewMode('WATERFALL')}
          >
            Waterfall
          </button>
          <button
            className={`view-btn ${viewMode === 'TIMELINE' ? 'active' : ''}`}
            onClick={() => setViewMode('TIMELINE')}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* OVERALL RISK SUMMARY */}
      <div className="risk-summary">
        <div className="summary-card">
          <h3>Inherent Risk (ISA 315)</h3>
          <RiskBar
            risk={data.overall.inherentRisk}
            label="Risk of misstatement before controls"
          />
          <p className="summary-note">
            Assessed considering business complexity, changes, and transactions
          </p>
        </div>

        <div className="summary-card">
          <h3>Control Risk (ISA 315)</h3>
          <RiskBar
            risk={data.overall.controlRisk}
            label="Risk control fails to prevent/detect"
          />
          <p className="summary-note">
            Assessed through control design and operation testing
          </p>
        </div>

        <div className="summary-card">
          <h3>Detection Risk Required (ISA 330)</h3>
          <RiskBar
            risk={data.overall.detectionRisk}
            label="Acceptable audit risk tolerance"
          />
          <p className="summary-note">
            Based on inherent and control risk assessment
          </p>
        </div>

        <div className="summary-card overall">
          <h3>Overall Audit Risk</h3>
          <div className="overall-risk-display">
            {(overallRisk * 100).toFixed(1)}%
          </div>
          <p className="summary-note">
            Risk of expressing wrong audit opinion
          </p>
        </div>
      </div>

      {/* RISKS BY AREA */}
      <div className="risks-by-area">
        <h3>Risks by Process Area (ISA 320 - Materiality Consideration)</h3>

        {viewMode === 'HEATMAP' && (
          <div className="heatmap-grid">
            {Object.entries(data.byArea).map(([area, risk]) => (
              <div
                key={area}
                className={`heatmap-cell ${selectedArea === area ? 'selected' : ''}`}
                onClick={() => setSelectedArea(area)}
                style={{
                  backgroundColor: getRiskColor(risk.inherentRisk),
                  opacity: 0.8,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="cell-title">{area}</div>
                <div className="cell-risk">
                  {getRiskLabel(risk.inherentRisk)}
                </div>
                <div className="cell-procedures">
                  {risk.proceduresDone}/{risk.proceduresCount} procedures
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'WATERFALL' && (
          <div className="waterfall-chart">
            {Object.entries(data.byArea).map(([area, risk], _idx) => (
              <div key={area} className="waterfall-bar">
                <div className="waterfall-label">{area}</div>
                <div className="waterfall-values">
                  <div className="waterfall-value-item">
                    <span className="label">Inherent</span>
                    <div
                      className="value-bar"
                      style={{
                        width: `${risk.inherentRisk * 200}px`,
                        backgroundColor: getRiskColor(risk.inherentRisk)
                      }}
                    />
                    <span className="number">{(risk.inherentRisk * 100).toFixed(0)}%</span>
                  </div>
                  <div className="waterfall-value-item">
                    <span className="label">Control</span>
                    <div
                      className="value-bar"
                      style={{
                        width: `${risk.controlRisk * 200}px`,
                        backgroundColor: getRiskColor(risk.controlRisk)
                      }}
                    />
                    <span className="number">{(risk.controlRisk * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'TIMELINE' && (
          <div className="timeline-view">
            {Object.entries(data.byArea).map(([area, risk]) => (
              <div key={area} className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: getRiskColor(risk.inherentRisk) }} />
                <div className="timeline-content">
                  <h4>{area}</h4>
                  <p>
                    Risk Level: <strong>{getRiskLabel(risk.inherentRisk)}</strong> |
                    Progress: <strong>{risk.proceduresDone}/{risk.proceduresCount}</strong> procedures
                  </p>
                </div>
                {risk.detectedExceptions > 0 && (
                  <div className="exceptions-badge">
                    {risk.detectedExceptions} exception
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTED AREA DETAILS */}
      {selectedArea && data.byArea[selectedArea] && (
        <div className="area-details">
          <h3>{selectedArea} - Detailed Risk Assessment</h3>

          <div className="details-grid">
            <div className="detail-card">
              <h4>Inherent Risk (ISA 315)</h4>
              <RiskBar risk={data.byArea[selectedArea].inherentRisk} label="" />
              <p>
                Based on complexity, judgment, and susceptibility to misstatement
              </p>
            </div>

            <div className="detail-card">
              <h4>Control Risk (ISA 315)</h4>
              <RiskBar risk={data.byArea[selectedArea].controlRisk} label="" />
              <p>
                Based on design and effectiveness of internal controls
              </p>
            </div>

            <div className="detail-card">
              <h4>Procedures Planned & Done (ISA 330)</h4>
              <div className="procedure-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(data.byArea[selectedArea].proceduresDone / data.byArea[selectedArea].proceduresCount) * 100}%`
                    }}
                  />
                </div>
                <p>
                  {data.byArea[selectedArea].proceduresDone} of {data.byArea[selectedArea].proceduresCount} procedures
                </p>
              </div>
            </div>

            <div className="detail-card">
              <h4>Exceptions Found</h4>
              <div className="exceptions-count">
                {data.byArea[selectedArea].detectedExceptions}
              </div>
              <p>
                Total exceptions identified in testing
              </p>
            </div>
          </div>

          <button
            className="close-details"
            onClick={() => setSelectedArea(null)}
          >
            Close Details
          </button>
        </div>
      )}

      <style jsx>{`
        .risk-dashboard {
          padding: 20px;
          background: white;
          border-radius: 8px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-header h2 {
          margin: 0;
        }

        .view-controls {
          display: flex;
          gap: 8px;
        }

        .view-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .risk-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: #f9f9f9;
          padding: 16px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .summary-card h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .summary-card.overall {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .overall-risk-display {
          font-size: 48px;
          font-weight: bold;
          color: #ff4757;
        }

        .summary-note {
          margin: 8px 0 0 0;
          font-size: 12px;
          color: #666;
        }

        .risk-bar-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .risk-bar-label {
          font-size: 12px;
          color: #666;
          min-width: 60px;
          flex-shrink: 0;
        }

        .risk-bar-track {
          flex: 1;
          height: 20px;
          background: #eee;
          border-radius: 10px;
          overflow: hidden;
        }

        .risk-bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.3s;
        }

        .risk-bar-text {
          font-size: 11px;
          color: white;
          font-weight: 600;
        }

        .risks-by-area {
          margin-bottom: 32px;
        }

        .risks-by-area h3 {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .heatmap-cell {
          padding: 16px;
          border-radius: 6px;
          color: white;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .heatmap-cell.selected {
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transform: scale(1.05);
        }

        .cell-title {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .cell-risk {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .cell-procedures {
          font-size: 11px;
          opacity: 0.8;
        }

        .waterfall-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .waterfall-bar {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .waterfall-label {
          min-width: 150px;
          font-weight: 500;
        }

        .waterfall-values {
          display: flex;
          gap: 24px;
          flex: 1;
        }

        .waterfall-value-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .waterfall-value-item .label {
          font-size: 12px;
          min-width: 50px;
        }

        .value-bar {
          height: 16px;
          border-radius: 2px;
        }

        .waterfall-value-item .number {
          font-weight: 600;
          min-width: 40px;
        }

        .timeline-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .timeline-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
        }

        .timeline-content p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        .exceptions-badge {
          background: #ff4757;
          color: white;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 600;
        }

        .area-details {
          margin-top: 32px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .area-details h3 {
          margin: 0 0 16px 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .detail-card {
          background: white;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .detail-card h4 {
          margin: 0 0 8px 0;
          font-size: 13px;
        }

        .detail-card p {
          margin: 8px 0 0 0;
          font-size: 12px;
          color: #666;
        }

        .procedure-progress {
          margin: 8px 0;
        }

        .progress-bar {
          height: 12px;
          background: #eee;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: #667eea;
        }

        .exceptions-count {
          font-size: 28px;
          font-weight: bold;
          color: #ff4757;
          margin: 8px 0;
        }

        .close-details {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }

        .close-details:hover {
          background: #764ba2;
        }
      `}</style>
    </div>
  );
};

export default RiskDashboard;
