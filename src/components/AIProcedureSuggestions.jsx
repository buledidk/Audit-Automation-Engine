/**
 * AI-Powered Procedure Suggestions Component
 *
 * Displays Claude API-generated procedure recommendations
 * with effectiveness scores and justifications.
 *
 * Features:
 * - Real-time procedure suggestions
 * - Effectiveness scoring
 * - User selection & override
 * - Feedback tracking
 */

import { useState, useEffect, useMemo } from "react";
import AIProcedureEngine from "../services/aiProcedureEngine";

export function AIProcedureSuggestions({
  fsli = "",
  riskLevel = "Medium",
  priorExceptions = [],
  industry = "",
  complexity = "Medium",
  materiality = 50000,
  availableProcedures = [],
  onSelectProcedures = () => {},
  onSuggestionsReady = () => {}
}) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [showJustification, setShowJustification] = useState(null);
  const [userFeedback, setUserFeedback] = useState({});

  // Initialize AI engine
  const engine = useMemo(() => {
    return new AIProcedureEngine();
  }, []);

  // Fetch suggestions when context changes
  useEffect(() => {
    if (!fsli || !riskLevel) return;

    fetchSuggestions();
  }, [fsli, riskLevel, industry, complexity]);

  /**
   * Fetch procedure suggestions from AI engine
   */
  async function fetchSuggestions() {
    setLoading(true);
    setError(null);

    try {
      const context = {
        fsli,
        riskLevel,
        priorYearExceptions: priorExceptions,
        industry,
        complexity,
        materiality
      };

      const recommendations = await engine.suggestProcedures(
        context,
        availableProcedures
      );

      setSuggestions(recommendations);
      onSuggestionsReady(recommendations);
    } catch (err) {
      setError(
        err.message || "Failed to generate suggestions. Please try again."
      );
      console.error("AI Procedure Suggestion Error:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Toggle procedure selection
   */
  function toggleProcedure(procedureId) {
    setSelectedProcedures((prev) => {
      if (prev.includes(procedureId)) {
        return prev.filter((id) => id !== procedureId);
      } else {
        return [...prev, procedureId];
      }
    });
  }

  /**
   * Accept all recommended procedures
   */
  function acceptAllSuggestions() {
    if (!suggestions) return;

    const procedureIds = suggestions.map((s) => s.id).filter(Boolean);
    setSelectedProcedures(procedureIds);
    onSelectProcedures(procedureIds, suggestions);

    setUserFeedback({
      action: "accepted_all",
      timestamp: new Date().toISOString(),
      count: procedureIds.length
    });
  }

  /**
   * Accept top N procedures
   */
  function acceptTopN(n) {
    if (!suggestions) return;

    const topProcedures = suggestions.slice(0, n);
    const procedureIds = topProcedures.map((s) => s.id).filter(Boolean);
    setSelectedProcedures(procedureIds);
    onSelectProcedures(procedureIds, topProcedures);

    setUserFeedback({
      action: "accepted_top_n",
      n,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Apply current selection
   */
  function applySelection() {
    const selectedSuggestions = suggestions?.filter((s) =>
      selectedProcedures.includes(s.id)
    );

    onSelectProcedures(selectedProcedures, selectedSuggestions);

    setUserFeedback({
      action: "custom_selection",
      count: selectedProcedures.length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="ai-suggestions loading">
        <div className="spinner" />
        <p>Generating AI recommendations...</p>
        <small>Analyzing context and procedures</small>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="ai-suggestions error">
        <div className="error-icon">⚠️</div>
        <p>Unable to Generate Suggestions</p>
        <small>{error}</small>
        <button onClick={fetchSuggestions} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  /**
   * Render suggestions
   */
  return (
    <div className="ai-suggestions">
      {/* Header */}
      <div className="suggestions-header">
        <h3>🤖 AI-Powered Procedure Recommendations</h3>
        <p className="subtitle">
          Based on {fsli} | Risk: {riskLevel} | {industry}
        </p>
      </div>

      {/* Suggestions Grid */}
      {suggestions && suggestions.length > 0 ? (
        <>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion.id} className="suggestion-card">
                {/* Rank Badge */}
                <div className="rank-badge">#{index + 1}</div>

                {/* Effectiveness Score */}
                <div className="effectiveness-score">
                  <div className="score-value">{suggestion.effectiveness}%</div>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${suggestion.effectiveness}%` }}
                    />
                  </div>
                </div>

                {/* Procedure Info */}
                <div className="procedure-info">
                  <h4>{suggestion.name}</h4>
                  <div className="meta">
                    <span className="type">{suggestion.type}</span>
                    <span className="assertion">{suggestion.assertion}</span>
                    <span className="standard">{suggestion.standard}</span>
                  </div>
                </div>

                {/* Justification */}
                <div className="justification">
                  <p>{suggestion.justification}</p>
                  {suggestion.key_risks_addressed && (
                    <div className="risks">
                      <strong>Addresses:</strong>
                      <ul>
                        {suggestion.key_risks_addressed.map((risk) => (
                          <li key={risk}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Selection Checkbox */}
                <label className="selection-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(suggestion.id)}
                    onChange={() => toggleProcedure(suggestion.id)}
                  />
                  <span>Select</span>
                </label>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="suggestions-actions">
            <div className="action-group">
              <button
                onClick={() => acceptTopN(3)}
                className="btn btn-primary"
              >
                ✅ Accept Top 3
              </button>
              <button
                onClick={acceptAllSuggestions}
                className="btn btn-primary"
              >
                ✅ Accept All
              </button>
            </div>

            <div className="action-group">
              <button onClick={applySelection} className="btn btn-secondary">
                📋 Apply Selection
              </button>
              <button
                onClick={fetchSuggestions}
                className="btn btn-secondary"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedProcedures.length > 0 && (
            <div className="selection-summary">
              <p>
                <strong>{selectedProcedures.length} procedures selected</strong>
              </p>
              <p className="avg-effectiveness">
                Average Effectiveness:{" "}
                {Math.round(
                  suggestions
                    .filter((s) => selectedProcedures.includes(s.id))
                    .reduce((sum, s) => sum + s.effectiveness, 0) /
                    selectedProcedures.length
                )}
                %
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="no-suggestions">
          <p>No procedures available for {fsli}</p>
          <small>Check procedure library or adjust filters</small>
        </div>
      )}

      {/* Feedback Hidden */}
      {Object.keys(userFeedback).length > 0 && (
        <div className="feedback-log">{JSON.stringify(userFeedback)}</div>
      )}

      <style jsx>{`
        .ai-suggestions {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .suggestions-header {
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .suggestions-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #42a5f5;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .suggestion-card {
          background: rgba(66, 165, 245, 0.05);
          border: 1px solid rgba(66, 165, 245, 0.2);
          border-radius: 8px;
          padding: 16px;
          position: relative;
          transition: all 0.3s ease;
        }

        .suggestion-card:hover {
          background: rgba(66, 165, 245, 0.1);
          border-color: rgba(66, 165, 245, 0.4);
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #42a5f5;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .effectiveness-score {
          margin-bottom: 12px;
        }

        .score-value {
          font-weight: bold;
          font-size: 16px;
          color: #42a5f5;
          margin-bottom: 4px;
        }

        .score-bar {
          background: rgba(255, 255, 255, 0.1);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }

        .score-fill {
          background: linear-gradient(90deg, #42a5f5, #66bb6a);
          height: 100%;
          transition: width 0.3s ease;
        }

        .procedure-info h4 {
          margin: 12px 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .meta span {
          font-size: 11px;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          color: rgba(255, 255, 255, 0.7);
        }

        .justification {
          margin: 12px 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .justification p {
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .risks {
          margin-top: 8px;
        }

        .risks strong {
          display: block;
          font-size: 11px;
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.9);
        }

        .risks ul {
          margin: 0;
          padding-left: 16px;
        }

        .risks li {
          font-size: 11px;
          margin: 2px 0;
        }

        .selection-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .selection-checkbox input {
          cursor: pointer;
        }

        .suggestions-actions {
          display: flex;
          gap: 16px;
          margin: 24px 0;
          flex-wrap: wrap;
        }

        .action-group {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #42a5f5;
          color: white;
        }

        .btn-primary:hover {
          background: #2196f3;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .selection-summary {
          background: rgba(102, 187, 106, 0.1);
          border: 1px solid rgba(102, 187, 106, 0.2);
          border-radius: 6px;
          padding: 12px 16px;
          margin-top: 16px;
        }

        .selection-summary p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }

        .avg-effectiveness {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        .loading,
        .error,
        .no-suggestions {
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

        .feedback-log {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default AIProcedureSuggestions;
