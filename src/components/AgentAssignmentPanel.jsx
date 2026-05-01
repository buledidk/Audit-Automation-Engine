/**
 * AgentAssignmentPanel.jsx
 *
 * Component for managing agent assignments to audit sections
 * Shows auto-assigned agents and allows manual reassignment
 * Displays agent specializations, workload, and availability
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import { useState } from 'react';
import './AgentAssignmentPanel.css';

export default function AgentAssignmentPanel({ sectionId, assignments, onAssignmentChange, agentWorkload }) {
  const [showReassignMenu, setShowReassignMenu] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterByRole, setFilterByRole] = useState('All');

  const filteredAssignments = filterByRole === 'All'
    ? assignments
    : assignments.filter(a => a.role === filterByRole);

  const handleReassign = (agentId, newAgentId) => { // eslint-disable-line no-unused-vars
    if (onAssignmentChange) {
      onAssignmentChange({
        action: 'reassign',
        fromAgent: agentId,
        toAgent: newAgentId,
        sectionId
      });
    }
    setShowReassignMenu(null);
  };

  const handleRemoveOptional = (agentId) => {
    const agent = assignments.find(a => a.agentId === agentId);
    if (agent && !agent.required) {
      if (onAssignmentChange) {
        onAssignmentChange({
          action: 'remove',
          agentId,
          sectionId
        });
      }
    }
  };

  const getAgentWorkloadColor = (agentId) => {
    const workload = agentWorkload?.[agentId];
    if (!workload) return 'neutral';
    if (workload.isAvailable) return 'available';
    return 'busy';
  };

  const getAgentWorkloadText = (agentId) => {
    const workload = agentWorkload?.[agentId];
    if (!workload) return 'Unknown';
    return `${workload.totalAssignments} assignments`;
  };

  return (
    <div className="agent-assignment-panel">
      <div className="panel-header">
        <h3>👥 Agent Assignments</h3>
        <div className="header-meta">
          <span className="total-count">{filteredAssignments.length} agents</span>
          <span className="required-count">{assignments.filter(a => a.required).length} required</span>
        </div>
      </div>

      <div className="panel-toolbar">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <select
            value={filterByRole}
            onChange={(e) => setFilterByRole(e.target.value)}
          >
            <option>All</option>
            <option>Primary</option>
            <option>Secondary</option>
            <option>Specialist</option>
          </select>
        </div>
      </div>

      <div className="assignments-container">
        {filteredAssignments.length === 0 ? (
          <div className="no-assignments">
            <p>No agents assigned with selected filter</p>
          </div>
        ) : (
          filteredAssignments.map((agent) => (
            <div
              key={agent.agentId}
              className={`agent-card ${agent.role.toLowerCase()} ${agent.required ? 'required' : 'optional'}`}
              onClick={() => setSelectedAgent(selectedAgent === agent.agentId ? null : agent.agentId)}
            >
              <div className="card-header">
                <div className="agent-info">
                  <h4>{agent.agentName}</h4>
                  <div className="agent-badges">
                    <span className={`role-badge ${agent.role.toLowerCase()}`}>
                      {agent.role}
                    </span>
                    {agent.required && (
                      <span className="required-badge" title="Required agent - cannot be removed">
                        Required
                      </span>
                    )}
                    {agent.status && (
                      <span className={`status-badge ${agent.status}`}>
                        {agent.status === 'assigned' ? '✓ Assigned' : agent.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  {!agent.required && (
                    <button
                      className="btn-remove"
                      title="Remove this optional agent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOptional(agent.agentId);
                      }}
                    >
                      ✕
                    </button>
                  )}
                  {agent.canReassign && (
                    <div className="reassign-menu-wrapper">
                      <button
                        className="btn-reassign"
                        title="Reassign this agent to another section"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReassignMenu(showReassignMenu === agent.agentId ? null : agent.agentId);
                        }}
                      >
                        ⟳
                      </button>
                      {showReassignMenu === agent.agentId && (
                        <div className="reassign-menu">
                          <p>Reassign to section:</p>
                          <button className="reassign-option">D1</button>
                          <button className="reassign-option">D3</button>
                          <button className="reassign-option">D4</button>
                          <button className="reassign-option">D5</button>
                          <button className="reassign-option">D6</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedAgent === agent.agentId && (
                <div className="card-details">
                  <div className="detail-section">
                    <h5>Rationale</h5>
                    <p>{agent.rationale}</p>
                  </div>

                  {agent.specialties && agent.specialties.length > 0 && (
                    <div className="detail-section">
                      <h5>Specialties</h5>
                      <div className="specialties-list">
                        {agent.specialties.map((spec, idx) => (
                          <span key={idx} className="specialty-tag">{spec}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-section">
                    <h5>Workload & Availability</h5>
                    <div className="workload-info">
                      <div className="workload-bar">
                        <div
                          className={`workload-fill ${getAgentWorkloadColor(agent.agentId)}`}
                          style={{
                            width: `${(agentWorkload?.[agent.agentId]?.totalAssignments || 0) * 20}%`
                          }}
                        ></div>
                      </div>
                      <p className="workload-text">
                        {getAgentWorkloadText(agent.agentId)}
                      </p>
                      <p className={`availability-text ${getAgentWorkloadColor(agent.agentId)}`}>
                        {getAgentWorkloadColor(agent.agentId) === 'available' ? '✓ Available' : '⚠ Limited capacity'}
                      </p>
                    </div>
                  </div>

                  {agent.assignedDate && (
                    <div className="detail-section">
                      <h5>Assignment Details</h5>
                      <p className="assignment-detail">
                        <strong>Assigned:</strong> {new Date(agent.assignedDate).toLocaleDateString()}
                      </p>
                      <p className="assignment-detail">
                        <strong>Type:</strong> {agent.assignedAutomatically ? 'Automatic' : 'Manual'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="panel-info">
        <p className="info-text">
          <strong>Note:</strong> Required agents cannot be removed or reassigned.
          Optional agents can be reassigned to manage workload.
        </p>
      </div>
    </div>
  );
}
