/**
 * Audit Progress Tracker & Timeline
 * Real-time progress tracking across all audit phases with time management
 */

import React, { useState, useMemo } from 'react';

const AuditProgressTracker = ({ auditData, phases }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [timeBreakdown, setTimeBreakdown] = useState({});

  /**
   * Calculate phase progress
   */
  const getPhaseProgress = (phase) => {
    if (!phase.activities) return 0;
    const completed = phase.activities.filter(a => a.completed).length;
    return Math.round((completed / phase.activities.length) * 100);
  };

  /**
   * Calculate timeline metrics
   */
  const timelineMetrics = useMemo(() => {
    let totalHours = 0;
    let completedHours = 0;

    phases.forEach(phase => {
      phase.activities?.forEach(activity => {
        const hours = parseInt(activity.duration) || 0;
        totalHours += hours;
        if (activity.completed) {
          completedHours += hours;
        }
      });
    });

    return {
      totalHours,
      completedHours,
      remainingHours: totalHours - completedHours,
      percentageComplete: Math.round((completedHours / totalHours) * 100) || 0,
      estimatedCompletionDays: Math.ceil((totalHours - completedHours) / 8)
    };
  }, [phases]);

  /**
   * Render overall progress bar
   */
  const renderOverallProgress = () => {
    return (
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Overall Audit Progress</span>
            </div>
            <div style={{ color: '#666', fontSize: '13px' }}>
              {timelineMetrics.percentageComplete}%
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div
              style={{
                width: `${timelineMetrics.percentageComplete}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {timelineMetrics.percentageComplete > 20 && `${timelineMetrics.percentageComplete}%`}
            </div>
          </div>
        </div>

        {/* Time Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Completed</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
              {timelineMetrics.completedHours}h
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Remaining</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>
              {timelineMetrics.remainingHours}h
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Total Budget</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0' }}>
              {timelineMetrics.totalHours}h
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Est. Completion</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6a1b9a' }}>
              {timelineMetrics.estimatedCompletionDays} days
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render phase timeline
   */
  const renderPhaseTimeline = () => {
    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>📅 Audit Phase Timeline</div>

        {phases.map((phase, idx) => {
          const progress = getPhaseProgress(phase);
          const isSelected = selectedPhase?.id === phase.id;

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedPhase(isSelected ? null : phase)}
              style={{
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: isSelected ? '#f3e5f5' : '#fafafa',
                border: `2px solid ${isSelected ? phase.color : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ fontSize: '20px' }}>{phase.icon}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: phase.color }}>
                    {phase.order}. {phase.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999' }}>
                    {phase.duration} • {phase.description}
                  </div>
                </div>

                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: progress === 100 ? '#4CAF50' : '#666'
                }}>
                  {progress}%
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: phase.color,
                    transition: 'width 0.3s'
                  }}
                />
              </div>

              {/* Expanded View */}
              {isSelected && phase.activities && (
                <div style={{ marginTop: '12px', borderTop: `1px solid ${phase.color}30`, paddingTop: '12px' }}>
                  {phase.activities.map(activity => (
                    <div
                      key={activity.id}
                      style={{
                        padding: '8px',
                        marginBottom: '8px',
                        backgroundColor: 'white',
                        borderLeft: `3px solid ${activity.completed ? '#4CAF50' : '#bbb'}`,
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{
                          textDecoration: activity.completed ? 'line-through' : 'none',
                          color: activity.completed ? '#999' : '#333'
                        }}>
                          {activity.completed ? '✓' : '○'} {activity.name}
                        </span>
                        <span style={{ color: '#666' }}>{activity.duration}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginLeft: '16px' }}>
                        {activity.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Render resource allocation
   */
  const renderResourceAllocation = () => {
    const resourceData = [
      { role: 'Senior Partner', allocation: 8, hours: 40 },
      { role: 'Manager', allocation: 16, hours: 120 },
      { role: 'Senior Auditor', allocation: 32, hours: 240 },
      { role: 'Junior Auditor', allocation: 40, hours: 300 },
      { role: 'IT Specialist', allocation: 4, hours: 30 }
    ];

    return (
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>👥 Resource Allocation</div>

        {resourceData.map((resource, idx) => (
          <div key={idx} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
              <span style={{ fontWeight: '500' }}>{resource.role}</span>
              <span style={{ color: '#666' }}>{resource.hours}h ({resource.allocation}%)</span>
            </div>
            <div style={{
              height: '6px',
              backgroundColor: '#e0e0e0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${resource.allocation}%`,
                  height: '100%',
                  backgroundColor: ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2'][idx]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render completion dashboard
   */
  const renderCompletionDashboard = () => {
    const completionByPhase = phases.map(phase => ({
      phase: phase.name,
      progress: getPhaseProgress(phase)
    }));

    const phaseStatuses = {
      notStarted: completionByPhase.filter(p => p.progress === 0).length,
      inProgress: completionByPhase.filter(p => p.progress > 0 && p.progress < 100).length,
      completed: completionByPhase.filter(p => p.progress === 100).length
    };

    return (
      <div style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>✅ Completion Status</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
              {phaseStatuses.completed}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF9800' }}>
              {phaseStatuses.inProgress}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#999' }}>
              {phaseStatuses.notStarted}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>Not Started</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
        ⏱️ Audit Progress & Timeline
      </div>

      {/* Overall Progress */}
      {renderOverallProgress()}

      {/* Completion Status */}
      {renderCompletionDashboard()}

      {/* Phase Timeline */}
      {renderPhaseTimeline()}

      {/* Resource Allocation */}
      {renderResourceAllocation()}

      {/* Time Management Tips */}
      <div style={{ padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px', fontSize: '12px', color: '#1565c0' }}>
        <strong>💡 Time Management Tips:</strong>
        <div style={{ marginTop: '8px' }}>
          • Track hours against budget regularly<br/>
          • Front-load complex procedures<br/>
          • Identify time-saving opportunities early<br/>
          • Schedule team reviews mid-engagement<br/>
          • Buffer 10-15% for unexpected issues
        </div>
      </div>
    </div>
  );
};

export default AuditProgressTracker;
