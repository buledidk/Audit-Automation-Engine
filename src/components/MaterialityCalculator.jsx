/**
 * Advanced Materiality Calculator Component
 *
 * Multi-benchmark materiality calculation with sensitivity analysis
 */

import { useState, useMemo } from "react";
import MaterialityEngine from "../services/materialityEngine";

export function MaterialityCalculator({
  entityName = "",
  industry = "",
  preTextProfit = 0,
  revenue = 0,
  assets = 0,
  equity = 0,
  populationSize = 1000,
  onCalculateComplete = () => {}
}) {
  const [results, setResults] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const [sampleSize, setSampleSize] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const engine = useMemo(() => {
    return new MaterialityEngine();
  }, []);

  /**
   * Calculate materiality
   */
  async function calculateMateriality() {
    setLoading(true);
    setError(null);

    try {
      const context = {
        entityName,
        industry,
        preTextProfit,
        revenue,
        assets,
        equity,
        populationSize
      };

      // Calculate materiality
      const matResults = engine.calculateBaseMateriality(context);
      setResults(matResults);

      // Sensitivity analysis
      const sens = engine.performSensitivityAnalysis(matResults.overall_materiality);
      setSensitivity(sens);

      // Scenarios
      const scens = engine.planScenarios(context);
      setScenarios(scens);

      // Sample size
      const sample = engine.calculateSampleSize(context);
      setSampleSize(sample);

      onCalculateComplete(matResults);
    } catch (err) {
      setError(err.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format currency
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value);
  }

  return (
    <div className="materiality-calculator">
      {/* Header */}
      <div className="calculator-header">
        <h3>💰 Advanced Materiality Calculator</h3>
        <p className="subtitle">{entityName || "Engagement"}</p>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <h4>Financial Benchmarks</h4>
        <div className="input-grid">
          <div className="input-group">
            <label>Pre-Tax Profit</label>
            <input
              type="number"
              value={preTextProfit}
              onChange={(e) => {}}
              disabled
            />
          </div>

          <div className="input-group">
            <label>Revenue</label>
            <input type="number" value={revenue} onChange={(e) => {}} disabled />
          </div>

          <div className="input-group">
            <label>Total Assets</label>
            <input type="number" value={assets} onChange={(e) => {}} disabled />
          </div>

          <div className="input-group">
            <label>Equity</label>
            <input type="number" value={equity} onChange={(e) => {}} disabled />
          </div>
        </div>

        <button
          className="calculate-btn"
          onClick={calculateMateriality}
          disabled={loading}
        >
          {loading ? "Calculating..." : "📊 Calculate Materiality"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Tabs */}
          <div className="tab-navigation">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === "sensitivity" ? "active" : ""}`}
              onClick={() => setActiveTab("sensitivity")}
            >
              Sensitivity Analysis
            </button>
            <button
              className={`tab ${activeTab === "scenarios" ? "active" : ""}`}
              onClick={() => setActiveTab("scenarios")}
            >
              Scenarios
            </button>
            <button
              className={`tab ${activeTab === "sampling" ? "active" : ""}`}
              onClick={() => setActiveTab("sampling")}
            >
              Sample Size
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="tab-content overview">
              {/* Main Materiality Metrics */}
              <div className="metrics-container">
                <div className="metric-card primary">
                  <div className="metric-value">
                    {formatCurrency(results.overall_materiality)}
                  </div>
                  <div className="metric-label">Overall Materiality</div>
                  <div className="metric-description">
                    Auditor's benchmark for planning and evaluation
                  </div>
                </div>

                <div className="metric-card secondary">
                  <div className="metric-value">
                    {formatCurrency(results.performance_materiality)}
                  </div>
                  <div className="metric-label">Performance Materiality</div>
                  <div className="metric-description">75% of overall materiality</div>
                </div>

                <div className="metric-card tertiary">
                  <div className="metric-value">
                    {formatCurrency(results.trivial_threshold)}
                  </div>
                  <div className="metric-label">Trivial Threshold</div>
                  <div className="metric-description">5% of overall materiality</div>
                </div>
              </div>

              {/* Basis and Justification */}
              <div className="justification-section">
                <h4>Calculation Basis</h4>
                <p className="basis">{results.basis}</p>

                <h4>Method</h4>
                <p className="method">{results.calculation_method}</p>

                <h4>Justification</h4>
                <p className="justification">{results.justification}</p>
              </div>

              {/* Benchmark Results */}
              {results.benchmark_results && (
                <div className="benchmark-results">
                  <h4>Benchmark Analysis</h4>
                  <div className="benchmark-grid">
                    {results.benchmark_results.map((bench, idx) => (
                      <div key={idx} className="benchmark-item">
                        <div className="benchmark-name">{bench.benchmark}</div>
                        <div className="benchmark-value">
                          {formatCurrency(bench.value)}
                        </div>
                        <div className="benchmark-basis">{bench.basis}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sensitivity Analysis Tab */}
          {activeTab === "sensitivity" && sensitivity && (
            <div className="tab-content sensitivity">
              <h4>Sensitivity Analysis - Materiality Tolerance</h4>
              <p className="description">
                Shows impact of ±10% and ±20% variations in materiality
              </p>

              <div className="scenarios-list">
                {sensitivity.sensitivity_scenarios.map((scenario, idx) => (
                  <div key={idx} className="scenario-card">
                    <div className="scenario-header">
                      <h5>{scenario.scenario}</h5>
                      <div className="change-badge" style={{color: scenario.change > 0 ? '#ff9800' : scenario.change < 0 ? '#ff6b6b' : '#66bb6a'}}>
                        {scenario.change > 0 ? '+' : ''}{scenario.change}%
                      </div>
                    </div>

                    <div className="scenario-value">
                      {formatCurrency(scenario.materiality)}
                    </div>

                    <p className="scenario-impact">{scenario.impact}</p>
                  </div>
                ))}
              </div>

              {sensitivity.recommended_range && (
                <div className="recommended-range">
                  <h4>Recommended Range</h4>
                  <div className="range-display">
                    <div className="range-low">{formatCurrency(sensitivity.recommended_range.low)}</div>
                    <div className="range-bar">
                      <div className="range-fill" />
                    </div>
                    <div className="range-high">{formatCurrency(sensitivity.recommended_range.high)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scenarios Tab */}
          {activeTab === "scenarios" && scenarios && (
            <div className="tab-content scenarios">
              <h4>Scenario Planning</h4>
              <p className="description">
                Materiality under different business scenarios
              </p>

              <div className="scenario-cards">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <div key={key} className="scenario-card full-width">
                    <div className="scenario-title">{scenario.description}</div>
                    <div className="scenario-materiality">
                      {formatCurrency(scenario.materiality)}
                    </div>
                    <div className="scenario-likelihood">{scenario.likelihood}</div>

                    <div className="assumptions">
                      <strong>Assumptions:</strong>
                      <ul>
                        {scenario.assumptions.map((assumption, idx) => (
                          <li key={idx}>{assumption}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Size Tab */}
          {activeTab === "sampling" && sampleSize && (
            <div className="tab-content sampling">
              <h4>Sample Size Recommendation</h4>

              <div className="sample-metrics">
                <div className="sample-card">
                  <div className="sample-label">Recommended Sample Size</div>
                  <div className="sample-value">{sampleSize.recommended_sample_size}</div>
                  <div className="sample-subtitle">
                    {sampleSize.sample_percentage}% of population
                  </div>
                </div>

                <div className="sample-card">
                  <div className="sample-label">Confidence Level</div>
                  <div className="sample-value">{sampleSize.confidence_level}</div>
                  <div className="sample-subtitle">{sampleSize.methodology}</div>
                </div>
              </div>

              <div className="sampling-info">
                <h4>Basis</h4>
                <p>{sampleSize.materiality_basis}</p>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .materiality-calculator {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .calculator-header {
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .calculator-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .input-section {
          margin-bottom: 32px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .input-section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: white;
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
        }

        .input-group input {
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          font-size: 13px;
        }

        .input-group input:disabled {
          opacity: 0.6;
        }

        .calculate-btn {
          padding: 12px 24px;
          background: #42a5f5;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .calculate-btn:hover:not(:disabled) {
          background: #2196f3;
          transform: translateY(-1px);
        }

        .calculate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          margin-top: 12px;
          padding: 12px;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 6px;
          color: #ff6b6b;
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

        .metrics-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .metric-card {
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .metric-card.primary {
          background: rgba(66, 165, 245, 0.05);
          border-left-color: #42a5f5;
        }

        .metric-card.secondary {
          background: rgba(255, 152, 0, 0.05);
          border-left-color: #ff9800;
        }

        .metric-card.tertiary {
          background: rgba(102, 187, 106, 0.05);
          border-left-color: #66bb6a;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .metric-description {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .justification-section {
          margin-bottom: 32px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .justification-section h4 {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .basis,
        .method,
        .justification {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        .benchmark-results {
          margin-bottom: 32px;
        }

        .benchmark-results h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: white;
        }

        .benchmark-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .benchmark-item {
          padding: 12px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.1);
          border-radius: 6px;
          text-align: center;
        }

        .benchmark-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
        }

        .benchmark-value {
          font-size: 16px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 4px;
        }

        .benchmark-basis {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .scenarios-list,
        .scenario-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .scenario-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }

        .scenario-card.full-width {
          border-left: 4px solid #42a5f5;
        }

        .scenario-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .scenario-header h5 {
          margin: 0;
          font-size: 14px;
          color: white;
        }

        .change-badge {
          font-size: 12px;
          font-weight: bold;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .scenario-title {
          font-weight: bold;
          color: white;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .scenario-value {
          font-size: 24px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 6px;
        }

        .scenario-materiality {
          font-size: 20px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 6px;
        }

        .scenario-likelihood {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }

        .scenario-impact {
          margin: 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .assumptions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .assumptions strong {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
          display: block;
          margin-bottom: 6px;
        }

        .assumptions ul {
          margin: 0;
          padding-left: 16px;
          list-style: disc;
        }

        .assumptions li {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .recommended-range {
          margin-top: 24px;
          padding: 20px;
          background: rgba(102, 187, 106, 0.05);
          border: 1px solid rgba(102, 187, 106, 0.2);
          border-radius: 8px;
        }

        .recommended-range h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: white;
        }

        .range-display {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .range-low,
        .range-high {
          font-weight: bold;
          color: white;
          min-width: 100px;
          font-size: 13px;
        }

        .range-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .range-fill {
          width: 70%;
          height: 100%;
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
        }

        .sample-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .sample-card {
          padding: 20px;
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .sample-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
        }

        .sample-value {
          font-size: 28px;
          font-weight: bold;
          color: #42a5f5;
          margin-bottom: 6px;
        }

        .sample-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }

        .sampling-info {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
        }

        .sampling-info h4 {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }

        .sampling-info p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .description {
          margin: 0 0 16px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default MaterialityCalculator;
