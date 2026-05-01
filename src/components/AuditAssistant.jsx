/**
 * AUDIT ASSISTANT COMPONENT
 * Real-time conversational AI guidance for auditors
 *
 * Features:
 * - Real-time chat interface
 * - ISA-aware guidance
 * - Context-aware responses
 * - Auto-logging to audit trail
 * - Multi-language support
 */

import { useState, useRef, useEffect } from 'react';
import { Anthropic } from '@anthropic-ai/sdk';

const AuditAssistant = ({ engagementId, currentPhase, procedureName, onGuidanceProvided }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const clientRef = useRef(null);

  // Initialize Anthropic client
  useEffect(() => {
    clientRef.current = new Anthropic({ dangerouslyAllowBrowser: true,
      apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
    });
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build system prompt with audit context
  const buildSystemPrompt = () => {
    return `You are an expert audit assistant specializing in ISA (International Standards on Auditing) compliance and professional judgment.

Audit Context:
- Engagement: ${engagementId}
- Current Phase: ${currentPhase} (PLANNING, INTERIM, FIELDWORK, or REPORTING)
- Current Procedure: ${procedureName}

Your responsibilities:
1. Provide ISA-compliant guidance for audit procedures
2. Assess evidence quality and sufficiency
3. Help identify and evaluate risks
4. Support professional judgment with skepticism
5. Suggest additional procedures when needed
6. Reference specific ISA standards in responses

Guidelines:
- Keep responses concise (under 200 words)
- Always reference relevant ISA standards
- Include actionable next steps
- Challenge assumptions appropriately
- Document professional skepticism
- Consider materiality in guidance
- Be aware of the audit phase context

Format responses to include:
1. Direct answer to the question
2. ISA reference (e.g., ISA 330)
3. Key evidence requirements
4. Potential risks or gaps
5. Recommended next steps`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      // Call Claude Haiku for fast response
      const response = await clientRef.current.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        temperature: 0.5, // Balanced for audit guidance
        system: buildSystemPrompt(),
        messages: [
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: 'user', content: userMessage }
        ]
      });

      const assistantMessage = response.content[0].text;

      // Add assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
        isaReference: extractISAReference(assistantMessage),
        suggestedActions: extractSuggestedActions(assistantMessage)
      }]);

      // Callback with guidance provided
      if (onGuidanceProvided) {
        onGuidanceProvided({
          question: userMessage,
          guidance: assistantMessage,
          phase: currentPhase,
          procedure: procedureName,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const extractISAReference = (text) => {
    const isaMatch = text.match(/ISA\s*(\d+)/g);
    return isaMatch || [];
  };

  const extractSuggestedActions = (text) => {
    const actionRegex = /(?:recommend|suggest|consider|perform|obtain):\s*([^\.]+)/gi;
    const actions = [];
    let match;
    while ((match = actionRegex.exec(text)) !== null) {
      actions.push(match[1].trim());
    }
    return actions;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`audit-assistant ${isExpanded ? 'expanded' : 'minimized'}`}>
      <div className="assistant-header">
        <h3>🤖 Audit Assistant</h3>
        <p className="context-info">
          {currentPhase} → {procedureName}
        </p>
        <button onClick={toggleExpanded} className="toggle-btn">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="assistant-container">
          {/* Messages View */}
          <div className="messages-area">
            {messages.length === 0 && (
              <div className="empty-state">
                <p>👋 Hi! I'm your audit assistant. Ask me anything about:</p>
                <ul>
                  <li>ISA procedures and requirements</li>
                  <li>Evidence evaluation and sufficiency</li>
                  <li>Risk assessment guidance</li>
                  <li>Professional judgment challenges</li>
                  <li>Next steps for this procedure</li>
                </ul>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.role === 'assistant' && msg.isError && (
                    <div className="error-badge">Error</div>
                  )}
                  <p>{msg.content}</p>

                  {msg.isaReference && msg.isaReference.length > 0 && (
                    <div className="isa-reference">
                      <strong>ISA Reference:</strong> {msg.isaReference.join(', ')}
                    </div>
                  )}

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="suggested-actions">
                      <strong>Suggested Next Steps:</strong>
                      <ul>
                        {msg.suggestedActions.map((action, i) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {msg.timestamp?.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant loading">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about procedures, evidence, risks, or next steps..."
              disabled={loading}
              className="input-field"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              {loading ? '...' : '→'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .audit-assistant {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .assistant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          cursor: pointer;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px 8px 0 0;
        }

        .assistant-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .context-info {
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

        .assistant-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          border-radius: 0 0 8px 8px;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-state {
          color: #666;
          font-size: 14px;
          padding: 20px;
          text-align: center;
        }

        .empty-state ul {
          text-align: left;
          margin: 12px 0;
          padding-left: 20px;
        }

        .message {
          display: flex;
          justify-content: flex-start;
          gap: 8px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          justify-content: flex-end;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 14px;
          border-radius: 8px;
          word-wrap: break-word;
        }

        .message.assistant .message-content {
          background: #f5f5f5;
          border-left: 3px solid #667eea;
        }

        .message.user .message-content {
          background: #667eea;
          color: white;
        }

        .isa-reference {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(0,0,0,0.1);
          font-size: 12px;
          color: #667eea;
          font-weight: 500;
        }

        .suggested-actions {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(0,0,0,0.1);
          font-size: 12px;
        }

        .suggested-actions ul {
          margin: 4px 0 0 0;
          padding-left: 16px;
          list-style: none;
        }

        .suggested-actions li {
          color: #555;
          margin: 4px 0;
        }

        .message-time {
          font-size: 11px;
          color: #999;
          align-self: flex-end;
          margin-top: 4px;
        }

        .loading .message-content {
          background: #f5f5f5;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.5; }
          40% { opacity: 1; }
        }

        .input-area {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid #e0e0e0;
          background: #fafafa;
          border-radius: 0 0 8px 8px;
        }

        .input-field {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-field:focus {
          border-color: #667eea;
        }

        .input-field:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .send-btn {
          padding: 10px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #764ba2;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-badge {
          display: inline-block;
          background: #ff4757;
          color: white;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default AuditAssistant;
