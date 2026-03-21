/**
 * Auditor Wellness & Fatigue Monitor
 * Monitors auditor health, fatigue, and provides recommendations for breaks
 * Designed for long-hour audit engagement sessions
 */

import React, { useState, useCallback, useEffect } from 'react';

const AuditorWellnessMonitor = ({ auditSession }) => {
  const [sessionStats, setSessionStats] = useState({
    hoursWorked: 0,
    tasksCompleted: 0,
    decisionsCount: 0,
    lastBreakTime: null,
    currentTaskComplexity: 'medium'
  });

  const [fatigueLevel, setFatigueLevel] = useState('none');
  const [recommendations, setRecommendations] = useState([]);
  const [wellnessMetrics, setWellnessMetrics] = useState({
    productivityScore: 100,
    focusLevel: 100,
    errorRate: 0,
    breakNeeded: false
  });

  /**
   * Calculate fatigue level based on work session metrics
   */
  const calculateFatigueLevel = useCallback(() => {
    const indicators = [];
    const recommendations_list = [];

    // Extended work hours
    if (sessionStats.hoursWorked >= 8) {
      indicators.push('extended_hours');
      recommendations_list.push({
        priority: 'high',
        type: 'Break',
        message: `You've been working for ${sessionStats.hoursWorked} hours.`,
        action: 'Take a 15-minute break',
        icon: '⏰'
      });
    }

    if (sessionStats.hoursWorked >= 10) {
      indicators.push('very_long_hours');
      recommendations_list.push({
        priority: 'critical',
        type: 'Rest',
        message: `${sessionStats.hoursWorked} hours is significant. Consider wrapping up for the day.`,
        action: 'Plan to stop soon and rest',
        icon: '😴'
      });
    }

    // Decision fatigue
    if (sessionStats.decisionsCount >= 50 && sessionStats.hoursWorked >= 6) {
      indicators.push('decision_fatigue');
      recommendations_list.push({
        priority: 'high',
        type: 'Cognitive Load',
        message: `${sessionStats.decisionsCount} decisions made. Decision quality may decline.`,
        action: 'Defer non-critical decisions until tomorrow',
        icon: '🧠'
      });
    }

    // Complex work + fatigue
    if (sessionStats.currentTaskComplexity === 'high' && sessionStats.hoursWorked > 6) {
      indicators.push('complex_work_fatigue');
      recommendations_list.push({
        priority: 'high',
        type: 'Task Switching',
        message: 'Complex work requires high concentration when fatigued.',
        action: 'Switch to simpler task or take a break',
        icon: '⚠️'
      });
    }

    // Break time
    if (sessionStats.lastBreakTime) {
      const timeSinceBreak = (Date.now() - sessionStats.lastBreakTime) / (1000 * 60);
      if (timeSinceBreak > 120) {
        indicators.push('overdue_break');
        recommendations_list.push({
          priority: 'high',
          type: 'Break',
          message: `No break for ${Math.round(timeSinceBreak)} minutes.`,
          action: 'Take a break now',
          icon: '☕'
        });
      }
    }

    // Determine overall fatigue level
    let level = 'none';
    if (indicators.length === 0) level = 'none';
    else if (indicators.includes('very_long_hours') || indicators.includes('decision_fatigue')) level = 'critical';
    else if (indicators.includes('extended_hours') || indicators.includes('complex_work_fatigue')) level = 'high';
    else level = 'moderate';

    setFatigueLevel(level);
    setRecommendations(recommendations_list);

    // Update productivity metrics based on fatigue
    const productivityDecline = {
      none: 0,
      moderate: 5,
      high: 15,
      critical: 30
    };

    const errorIncrement = {
      none: 0,
      moderate: 2,
      high: 5,
      critical: 10
    };

    setWellnessMetrics(prev => ({
      ...prev,
      productivityScore: Math.max(70, 100 - productivityDecline[level]),
      errorRate: errorIncrement[level],
      breakNeeded: level !== 'none'
    }));
  }, [sessionStats]);

  useEffect(() => {
    calculateFatigueLevel();
  }, [sessionStats, calculateFatigueLevel]);

  /**
   * Get color based on fatigue level
   */
  const getFatigueColor = () => {
    const colors = {
      none: '#4CAF50',
      moderate: '#FF9800',
      high: '#FF5722',
      critical: '#D32F2F'
    };
    return colors[fatigueLevel] || '#757575';
  };

  /**
   * Render wellness indicator
   */
  const renderWellnessIndicator = () => {
    const fatigueEmojis = {
      none: '😊',
      moderate: '😐',
      high: '😰',
      critical: '😵'
    };

    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        borderLeft: `4px solid ${getFatigueColor()}`,
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>
              {fatigueEmojis[fatigueLevel]}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              Fatigue Level: {fatigueLevel.toUpperCase()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Productivity Score
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: getFatigueColor() }}>
              {wellnessMetrics.productivityScore}%
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Hours Worked</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{sessionStats.hoursWorked}h</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Tasks Completed</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{sessionStats.tasksCompleted}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#666' }}>Error Rate</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f44336' }}>
              {wellnessMetrics.errorRate}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render recommendations
   */
  const renderRecommendations = () => {
    if (recommendations.length === 0) {
      return (
        <div style={{
          padding: '16px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#2e7d32'
        }}>
          ✅ You're doing great! Keep maintaining good work-life balance.
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px',
              backgroundColor: rec.priority === 'critical' ? '#ffebee' : '#fff3e0',
              borderLeft: `4px solid ${rec.priority === 'critical' ? '#d32f2f' : '#ff9800'}`,
              borderRadius: '4px',
              display: 'flex',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '20px', minWidth: '24px' }}>{rec.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
                {rec.type}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                {rec.message}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: rec.priority === 'critical' ? '#d32f2f' : '#ff9800',
                backgroundColor: 'rgba(0,0,0,0.05)',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                → {rec.action}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render wellness tips
   */
  const renderWellnessTips = () => {
    const tips = [
      {
        category: 'Movement',
        items: [
          'Stand up and stretch every 60 minutes',
          'Take a 10-minute walk every 2 hours',
          'Do neck and shoulder rolls regularly'
        ]
      },
      {
        category: 'Hydration & Nutrition',
        items: [
          'Drink water throughout the session',
          'Avoid excessive caffeine after 3 PM',
          'Take proper breaks for meals'
        ]
      },
      {
        category: 'Focus & Quality',
        items: [
          'Review complex work when fresh',
          'Defer decisions when fatigued',
          'Have a peer review key findings'
        ]
      },
      {
        category: 'Sleep & Recovery',
        items: [
          'Aim for 7-9 hours of sleep',
          'Maintain consistent sleep schedule',
          'Take rest days during intensive engagements'
        ]
      }
    ];

    return (
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>
          💪 Wellness Tips for Extended Audit Sessions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {tips.map((tipGroup, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#1976d2' }}>
                {tipGroup.category}
              </div>
              {tipGroup.items.map((item, itemIdx) => (
                <div key={itemIdx} style={{ marginBottom: '4px', color: '#666' }}>
                  • {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render focus mode indicator
   */
  const renderFocusMode = () => {
    return (
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f3e5f5',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '13px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          🎯 <strong>Suggested Focus Session:</strong>
        </div>
        <div style={{ color: '#666', marginBottom: '8px' }}>
          Work for 50-90 minutes, then take 10-20 minute break
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          <button style={{
            padding: '6px 12px',
            backgroundColor: '#7b1fa2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Start 50-Min Focus
          </button>
          <button style={{
            padding: '6px 12px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Take Break Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
        🏥 Auditor Wellness Monitor
      </div>

      {/* Wellness Indicator */}
      {renderWellnessIndicator()}

      {/* Recommendations */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
          📋 Recommendations
        </div>
        {renderRecommendations()}
      </div>

      {/* Focus Mode */}
      {fatigueLevel !== 'none' && renderFocusMode()}

      {/* Wellness Tips */}
      {renderWellnessTips()}

      {/* Daily Limits Information */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1565c0'
      }}>
        <strong>📌 Recommended Daily Work Limits:</strong>
        <div style={{ marginTop: '8px' }}>
          • <strong>Optimal:</strong> 6-8 hours focused work<br/>
          • <strong>Maximum:</strong> 10 hours including breaks<br/>
          • <strong>Critical:</strong> Stop at 10 hours, full rest day after<br/>
          • <strong>Weekly:</strong> Max 50 hours audit work
        </div>
      </div>
    </div>
  );
};

export default AuditorWellnessMonitor;
