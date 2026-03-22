/**
 * SKEPTICISM BOT COMPONENT
 * Devil's advocate for professional skepticism (ISA 200 requirement)
 *
 * Features:
 * - Challenges audit assertions
 * - Suggests alternative explanations
 * - Identifies potential gaps
 * - Documents skepticism for audit trail
 * - ISA 200 compliant
 */

import React, { useState, useRef, useEffect } from 'react';
import { Anthropic } from '@anthropic-ai/sdk';

const SkepticismBot = ({ assertion, materiality, confidence, evidenceReliability, onChallengeRaised }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    clientRef.current = new Anthropic({
      apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    });
  }, []);

  const buildSystemPrompt = () => {
    return `You are a devil's advocate assistant for audit skepticism (ISA 200 requirement).

Your role is to challenge audit assertions and identify potential gaps, risks, and misstatements.

Audit Context:
- Assertion: ${assertion}
- Materiality: ${materiality}
- Confidence Level: ${confidence} (0-1)
- Evidence Reliability: ${evidenceReliability}

Your responsibilities:
1. Challenge the assertion from multiple angles
2. Identify assumptions that could be wrong
3. Suggest alternative explanations
4. Identify potential misstatements
5. Highlight control failures
6. Assess evidence reliability
7. Suggest additional procedures

Format your response with:
1. Key challenge to the assertion
2. What could make this assertion wrong
3. Evidence that would prove you wrong
4. Control failures that could lead to misstatement
5. Recommended additional procedures
6. Risk assessment (LOW/MEDIUM/HIGH)

Be specific, actionable, and think critically. Document professional skepticism.`;
  };

  const generateChallenges = async () => {
    setLoading(true);
    try {
      const response = await clientRef.current.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        temperature: 0.7, // Higher for creative skepticism
        system: buildSystemPrompt(),
        messages: [{
          role: 'user',
          content: `Please challenge this assertion with 3-4 specific skepticism points:

          Assertion: ${assertion}
          Materiality: £${materiality?.toLocaleString()}
          Confidence: ${(confidence * 100).toFixed(0)}%

          What should we be skeptical about?`
        }]
      });

      const response_text = response.content[0].text;
      const newChallenges = parseResponseIntoChallenges(response_text);
      setChallenges(newChallenges);

      // Callback with challenge raised
      if (onChallengeRaised) {
        onChallengeRaised({
          assertion,
          challengesSuggested: newChallenges,
          totalChallenges: newChallenges.length,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error generating challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseResponseIntoChallenges = (text) => {
    // Parse challenges from the AI response
    const challenges = [];
    const parts = text.split(/\d\.\s+/);

    for (const part of parts.slice(1)) {
      const lines = part.split('\n');
      const title = lines[0] || 'Challenge';
      const description = lines.slice(1).join('\n').trim();

      // Assess risk level
      const riskLevel = assessRiskLevel(description, assertion);

      challenges.push({
        id: `challenge-${challenges.length + 1}`,
        title: title.substring(0, 100),
        description,
        riskLevel,
        alternative: extractAlternativeExplanation(description),
        suggestedProcedure: extractSuggestedProcedure(description),
        timestamp: new Date()
      });
    }

    return challenges;
  };

  const assessRiskLevel = (description, assertion) => {
    if (description.includes('material') || description.includes('high risk')) {
      return 'HIGH';
    }
    if (description.includes('control') && description.includes('failure')) {
      return 'HIGH';
    }
    if (description.includes('moderate') || description.includes('medium')) {
      return 'MEDIUM';
    }
    return 'LOW';
  };

  const extractAlternativeExplanation = (text) => {
    const match = text.match(/(?:could be|might be|alternative:?)\s*([^\.]+)/i);
    return match ? match[1].trim() : null;
  };

  const extractSuggestedProcedure = (text) => {
    const match = text.match(/(?:recommend|suggest|perform:?)\s*([^\.]+)/i);
    return match ? match[1].trim() : null;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH':
        return '#ff4757';
      case 'MEDIUM':
        return '#ffa502';
      case 'LOW':
        return '#2ed573';
      default:
        return '#999';
    }
  };

  return (
    <div className="skepticism-bot">
      <div className="bot-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🤨 Skepticism Bot</h3>
        <p className="confidence-indicator">
          Confidence: {(confidence * 100).toFixed(0)}% | {challenges.length} challenges
        </p>
        <button className="toggle-btn">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="bot-container">
          {challenges.length === 0 ? (
            <div className="empty-state">
              <p>🤔 Click below to generate skepticism challenges for this assertion</p>
              <p className="fine-print">
                Professional skepticism is a requirement under ISA 200
              </p>
            </div>
          ) : (
            <div className="challenges-list">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="challenge-item">
                  <div className="challenge-header">
                    <h4>{challenge.title}</h4>
                    <span
                      className="risk-badge"
                      style={{ background: getRiskColor(challenge.riskLevel) }}
                    >
                      {challenge.riskLevel} RISK
                    </span>
                  </div>

                  <p className="challenge-description">{challenge.description}</p>

                  {challenge.alternative && (
                    <div className="alternative-section">
                      <strong>Alternative Explanation:</strong>
                      <p>{challenge.alternative}</p>
                    </div>
                  )}

                  {challenge.suggestedProcedure && (
                    <div className="procedure-section">
                      <strong>Suggested Procedure:</strong>
                      <p>{challenge.suggestedProcedure}</p>
                    </div>
                  )}

                  <div className="challenge-meta">
                    Raised: {challenge.timestamp?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={generateChallenges}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? '🤔 Thinking...' : '🤔 Generate Skepticism Challenges'}
          </button>
        </div>
      )}

      <style jsx>{`
        .skepticism-bot {
          background: white;
          border: 2px solid #ffa502;
          border-radius: 8px;
          margin: 16px 0;
          overflow: hidden;
        }

        .bot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: linear-gradient(135deg, #ffa502 0%, #ff6348 100%);
          color: white;
          cursor: pointer;
          user-select: none;
        }

        .bot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .confidence-indicator {
          margin: 4px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .toggle-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .toggle-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .bot-container {
          padding: 16px;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .fine-print {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
        }

        .challenges-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          max-height: 400px;
          overflow-y: auto;
        }

        .challenge-item {
          background: #fff8f6;
          border-left: 4px solid #ffa502;
          padding: 12px;
          border-radius: 4px;
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .challenge-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .risk-badge {
          padding: 2px 8px;
          border-radius: 3px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .challenge-description {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.5;
          color: #555;
        }

        .alternative-section {
          margin: 8px 0;
          padding: 8px;
          background: #fff;
          border-left: 2px solid #ffa502;
          font-size: 13px;
        }

        .alternative-section strong {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .alternative-section p {
          margin: 0;
          color: #555;
        }

        .procedure-section {
          margin: 8px 0;
          padding: 8px;
          background: #fff;
          border-left: 2px solid #2ed573;
          font-size: 13px;
        }

        .procedure-section strong {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .procedure-section p {
          margin: 0;
          color: #555;
        }

        .challenge-meta {
          margin-top: 8px;
          font-size: 11px;
          color: #999;
        }

        .generate-btn {
          width: 100%;
          padding: 10px 16px;
          background: #ffa502;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
          background: #ff6348;
        }

        .generate-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SkepticismBot;
