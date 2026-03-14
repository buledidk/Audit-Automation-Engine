/**
 * Exception Prediction & Root Cause Analysis Panel
 *
 * Displays predicted exceptions, confidence scores, and preventive procedures
 */

import { useState, useEffect, useMemo } from "react";
import ExceptionPredictionEngine from "../services/exceptionPredictionEngine";

export function ExceptionPredictionPanel({
  fsli = "",
  industry = "",
  priorYearExceptions = [],
  complexity = "Medium",
  riskLevel = "Medium",
  materiality = 50000,
  populationSize = 1000,
  onPredictionsReady = () => {}
}) {
  const [predictions, setPredictions] = useState(null);
  const [rootCauses, setRootCauses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Initialize engine
  const engine = useMemo(() => {
    return new ExceptionPredictionEngine();
  }, []);

  // Fetch predictions when context changes
  useEffect(() => {
    if (!fsli) return;
    fetchPredictions();
  }, [fsli, industry, complexity, riskLevel]);

  /**
   * Fetch exception predictions
   */
  async function fetchPredictions() {
    setLoading(true);
    setError(null);

    try {
      const context = {
        fsli,
        industry,
        priorYearExceptions,
        complexity,
        riskLevel,
        materiality,
        populationSize
      };

      const preds = await engine.predictExceptions(context);
      setPredictions(preds);

      const causes = await engine.analyzeRootCauses(context);
      setRootCauses(causes);

      onPredictionsReady(preds);
    } catch (err) {
      setError(err.message || "Failed to generate predictions");
      console.error("Exception Prediction Error:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get risk level color
   */
  function getRiskColor(probability) {
    if (probability > 0.7) return "#ff6b6b"; // Red
    if (probability > 0.5) return "#ffa500"; // Orange
    return "#66bb6a"; // Green
  }

  /**
   * Get risk level label
   */
  function getRiskLabel(probability) {
    if (probability > 0.7) return "HIGH RISK";
    if (probability > 0.5) return "MEDIUM RISK";
    return "LOW RISK";
  }

  // Loading state
  if (loading) {
    return (
      <div className="exception-panel loading">
        <div className="spinner" />
        <p>Analyzing exception patterns...</p>
        <small>Training AI model on historical data</small>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="exception-panel error">
        <div className="error-icon">⚠️</div>
        <p>Prediction Failed</p>
        <small>{error}</small>
        <button onClick={fetchPredictions} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  // Main content
  return (
    <div className="exception-panel">
      {/* Header */}
      <div className="panel-header">
        <h3>🔮 Exception Prediction & Root Cause Analysis</h3>
        <p className="subtitle">
          Predicted exception likelihood for {fsli} in {industry || "N/A"}
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === "causes" ? "active" : ""}`}
          onClick={() => setActiveTab("causes")}
        >
          🔍 Root Causes
        </button>
        <button
          className={`tab ${activeTab === "procedures" ? "active" : ""}`}
          onClick={() => setActiveTab("procedures")}
        >
          ✓ Preventive Procedures
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && predictions && (
        <div className="tab-content overview">
          {/* Risk Gauge */}
          <div className="risk-gauge-container">
            <div className="risk-gauge">
              <div
                className="gauge-fill"
                style={{
                  background: `conic-gradient(${getRiskColor(
                    predictions.exception_probability
                  )} 0deg ${
                    predictions.exception_probability * 360
                  }deg, rgba(255,255,255,0.1) ${
                    predictions.exception_probability * 360
                  }deg 360deg)`
                }}
              >
                <div className="gauge-center">
                  <div className="gauge-value">
                    {Math.round(predictions.exception_probability * 100)}%
                  </div>
                  <div className="gauge-label">Exception Probability</div>
                </div>
              </div>
            </div>

            <div className="risk-level" style={{ color: getRiskColor(predictions.exception_probability) }}>
              {getRiskLabel(predictions.exception_probability)}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="score-card">
            <div className="score-label">Confidence Level</div>
            <div className="score-bar">
              <div
                className="score-fill confidence"
                style={{
                  width: `${(predictions.confidence || 0.8) * 100}%`
                }}
              />
            </div>
            <div className="score-value">{Math.round((predictions.confidence || 0.8) * 100)}%</div>
          </div>

          {/* Predicted Exception Types */}
          {predictions.predicted_types && predictions.predicted_types.length > 0 && (
            <div className="predicted-types">
              <h4>Predicted Exception Types</h4>
              <div className="types-grid">
                {predictions.predicted_types.map((type, idx) => (
                  <div key={idx} className="type-card">
                    <div className="type-name">{type.type}</div>
                    <div className="type-likelihood">
                      <span className="label">Likelihood:</span>
                      <span className="value">{Math.round(type.likelihood * 100)}%</span>
                    </div>
                    <div className={`type-severity severity-${type.severity?.toLowerCase()}`}>
                      {type.severity}
                    </div>
                    <p className="type-description">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Risk Factors */}
          {predictions.key_risk_factors && predictions.key_risk_factors.length > 0 && (
            <div className="risk-factors">
              <h4>Key Risk Factors</h4>
              <ul>
                {predictions.key_risk_factors.map((factor, idx) => (
                  <li key={idx}>
                    <span className="factor-icon">⚡</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Root Causes Tab */}
      {activeTab === "causes" && rootCauses && (
        <div className="tab-content causes">
          {rootCauses.root_causes && rootCauses.root_causes.length > 0 ? (
            <div className="causes-list">
              {rootCauses.root_causes.map((rc, idx) => (
                <div key={idx} className="cause-card">
                  <div className="cause-header">
                    <h4>{rc.cause}</h4>
                    <div className="recurrence-risk">
                      Recurrence Risk: {Math.round(rc.likelihood_of_recurrence * 100)}%
                    </div>
                  </div>

                  {rc.control_weakness && (
                    <div className="control-weakness">
                      <strong>Control Weakness:</strong> {rc.control_weakness}
                    </div>
                  )}

                  {rc.affected_areas && rc.affected_areas.length > 0 && (
                    <div className="affected-areas">
                      <strong>Affected Areas:</strong>
                      <ul>
                        {rc.affected_areas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rc.improvement && (
                    <div className="improvement">
                      <strong>Recommended Improvement:</strong>
                      <p>{rc.improvement}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No root causes identified</p>
          )}

          {rootCauses.patterns && rootCauses.patterns.length > 0 && (
            <div className="patterns">
              <h4>Identified Patterns</h4>
              {rootCauses.patterns.map((pattern, idx) => (
                <div key={idx} className="pattern-item">
                  <strong>{pattern.pattern}</strong> ({pattern.occurrences} occurrences)
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preventive Procedures Tab */}
      {activeTab === "procedures" && predictions && (
        <div className="tab-content procedures">
          {predictions.preventive_procedures && predictions.preventive_procedures.length > 0 ? (
            <div className="procedures-list">
              {predictions.preventive_procedures.map((proc, idx) => (
                <div key={idx} className="procedure-card">
                  <div className="procedure-header">
                    <h4>{proc.procedure}</h4>
                    <div className="effectiveness">
                      Effectiveness: {Math.round(proc.effectiveness * 100)}%
                    </div>
                  </div>

                  <div className="prevents">
                    <strong>Prevents:</strong> {proc.prevents}
                  </div>

                  <div className="effectiveness-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${proc.effectiveness * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No preventive procedures available</p>
          )}
        </div>
      )}

      <style jsx>{`
        .exception-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .panel-header {
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .panel-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .tab-navigation {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .tab {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .tab.active {
          color: #42a5f5;
          border-bottom-color: #42a5f5;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .risk-gauge-container {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-radius: 12px;
        }

        .risk-gauge {
          flex-shrink: 0;
        }

        .gauge-fill {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .gauge-center {
          width: 100px;
          height: 100px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .gauge-value {
          font-size: 28px;
          font-weight: bold;
          color: white;
        }

        .gauge-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        .risk-level {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .score-card {
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .score-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .score-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .score-fill {
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
          height: 100%;
          transition: width 0.3s ease;
        }

        .score-value {
          font-size: 12px;
          font-weight: bold;
          color: #42a5f5;
        }

        .predicted-types {
          margin-bottom: 32px;
        }

        .predicted-types h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: white;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .type-card {
          padding: 12px;
          background: rgba(255, 152, 0, 0.05);
          border: 1px solid rgba(255, 152, 0, 0.2);
          border-radius: 8px;
        }

        .type-name {
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
        }

        .type-likelihood {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.7);
        }

        .type-severity {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .severity-high {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        .severity-medium {
          background: rgba(255, 165, 0, 0.2);
          color: #ffa500;
        }

        .severity-low {
          background: rgba(102, 187, 106, 0.2);
          color: #66bb6a;
        }

        .type-description {
          margin: 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }

        .risk-factors {
          background: rgba(255, 107, 107, 0.05);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 8px;
          padding: 16px;
        }

        .risk-factors h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: white;
        }

        .risk-factors ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .risk-factors li {
          padding: 6px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .factor-icon {
          color: #ff6b6b;
        }

        .causes-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cause-card {
          padding: 16px;
          background: rgba(102, 187, 106, 0.05);
          border: 1px solid rgba(102, 187, 106, 0.2);
          border-radius: 8px;
        }

        .cause-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .cause-header h4 {
          margin: 0;
          color: white;
          font-size: 14px;
        }

        .recurrence-risk {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }

        .control-weakness,
        .improvement {
          margin: 12px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .affected-areas {
          margin: 12px 0;
          font-size: 12px;
        }

        .affected-areas ul {
          margin: 6px 0 0 16px;
          padding: 0;
          list-style: disc;
        }

        .affected-areas li {
          color: rgba(255, 255, 255, 0.7);
        }

        .patterns {
          margin-top: 24px;
        }

        .patterns h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: white;
        }

        .pattern-item {
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          margin-bottom: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        .procedures-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .procedure-card {
          padding: 16px;
          background: rgba(66, 187, 245, 0.05);
          border: 1px solid rgba(66, 187, 245, 0.2);
          border-radius: 8px;
        }

        .procedure-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .procedure-header h4 {
          margin: 0;
          color: white;
          font-size: 14px;
        }

        .effectiveness {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .prevents {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 12px;
        }

        .effectiveness-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .bar-fill {
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
          height: 100%;
          transition: width 0.3s ease;
        }

        .no-data {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 24px;
        }

        .loading,
        .error {
          text-align: center;
          padding: 40px 20px;
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

        .error-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .retry-btn {
          margin-top: 12px;
          padding: 8px 16px;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .retry-btn:hover {
          background: #f57c00;
        }
      `}</style>
    </div>
  );
}

export default ExceptionPredictionPanel;
