/**
 * GuidanceSidePanel.jsx
 *
 * Side panel component for displaying audit guidance
 * Shows ISA standards, procedures, compliance requirements
 * Auto-populated when a section/FSLI is opened
 * Collapsible sections for clean UI
 *
 * Version: 1.0.0
 * Created: March 2026
 */

import { useState, useEffect } from 'react';
import './GuidanceSidePanel.css';

export default function GuidanceSidePanel({ sectionId, guidanceData, agentAssignments, procedures }) {
  const [expandedSections, setExpandedSections] = useState({
    isaGuidance: true,
    frsRequirements: true,
    ifrsRequirements: false,
    keyAuditMatters: true,
    commonRisks: false,
    assignedAgents: true,
    procedures: true
  });

  const [selectedISA, setSelectedISA] = useState(null);
  const [filterProceduresByPhase, setFilterProceduresByPhase] = useState('All');

  useEffect(() => {
    // Auto-scroll to top when section changes
    const panel = document.querySelector('.guidance-side-panel');
    if (panel) {
      panel.scrollTop = 0;
    }
  }, [sectionId]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredProcedures = filterProceduresByPhase === 'All'
    ? procedures
    : procedures.filter(p => p.phase === filterProceduresByPhase);

  if (!guidanceData) {
    return (
      <div className="guidance-side-panel loading">
        <div className="loading-spinner">Loading guidance...</div>
      </div>
    );
  }

  return (
    <div className="guidance-side-panel">
      <div className="panel-header">
        <h2>📚 Audit Guidance</h2>
        <p className="section-label">{guidanceData.label}</p>
        <div className="section-meta">
          <span className="section-id">{sectionId}</span>
          <span className="timestamp">Opened: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="panel-content">
        {/* ISA Standards Guidance Section */}
        <div className="guidance-section">
          <div
            className="section-header"
            onClick={() => toggleSection('isaGuidance')}
          >
            <h3>📋 ISA Standards & Guidance</h3>
            <span className={`toggle-icon ${expandedSections.isaGuidance ? 'expanded' : ''}`}>▶</span>
          </div>

          {expandedSections.isaGuidance && (
            <div className="section-content">
              <div className="isa-tabs">
                {guidanceData.isaStandards.map(isa => (
                  <button
                    key={isa}
                    className={`isa-tab ${selectedISA === isa ? 'active' : ''}`}
                    onClick={() => setSelectedISA(selectedISA === isa ? null : isa)}
                  >
                    {isa}
                  </button>
                ))}
              </div>

              {selectedISA && guidanceData.isaGuidance[selectedISA] && (
                <div className="isa-detail">
                  <h4>{guidanceData.isaGuidance[selectedISA].title}</h4>
                  <p className="guidance-text">{guidanceData.isaGuidance[selectedISA].guidance}</p>

                  <div className="key-requirements">
                    <h5>Key Requirements:</h5>
                    <ul>
                      {guidanceData.isaGuidance[selectedISA].keyRequirements?.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {guidanceData.isaGuidance[selectedISA].documentationRequirements && (
                    <div className="documentation">
                      <h5>Documentation Required:</h5>
                      <ul>
                        {guidanceData.isaGuidance[selectedISA].documentationRequirements.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {!selectedISA && (
                <div className="isa-overview">
                  <p>Click on an ISA standard above to view guidance</p>
                  <div className="isa-list">
                    {guidanceData.isaStandards.map(isa => (
                      <div key={isa} className="isa-item">
                        <strong>{isa}:</strong> {guidanceData.isaGuidance[isa]?.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FRS Requirements Section */}
        {Object.keys(guidanceData.frsRequirements).length > 0 && (
          <div className="guidance-section">
            <div
              className="section-header"
              onClick={() => toggleSection('frsRequirements')}
            >
              <h3>📄 FRS Requirements</h3>
              <span className={`toggle-icon ${expandedSections.frsRequirements ? 'expanded' : ''}`}>▶</span>
            </div>

            {expandedSections.frsRequirements && (
              <div className="section-content">
                {Object.entries(guidanceData.frsRequirements).map(([key, req]) => (
                  <div key={key} className="requirement-block frs">
                    <h4>{req.title}</h4>
                    <p className="requirement-scope"><strong>Scope:</strong> {req.scope}</p>
                    <div className="key-items">
                      <h5>Key Requirements:</h5>
                      <ul>
                        {req.keyRequirements?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="guidance-note"><strong>Guidance:</strong> {req.guidance}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* IFRS Requirements Section */}
        {guidanceData.ifrsRequirements.length > 0 && (
          <div className="guidance-section">
            <div
              className="section-header"
              onClick={() => toggleSection('ifrsRequirements')}
            >
              <h3>🌍 IFRS Requirements</h3>
              <span className={`toggle-icon ${expandedSections.ifrsRequirements ? 'expanded' : ''}`}>▶</span>
            </div>

            {expandedSections.ifrsRequirements && (
              <div className="section-content">
                {guidanceData.ifrsRequirements.map((req, idx) => (
                  <div key={idx} className="requirement-block ifrs">
                    <div className="requirement-header">
                      <h4>{req.standard}: {req.title}</h4>
                      {req.updateDate && (
                        <span className="update-badge">Updated: {new Date(req.updateDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="requirement-text"><strong>Requirement:</strong> {req.requirement}</p>
                    <p className="audit-impact"><strong>Audit Implications:</strong> {req.auditImplications}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Key Audit Matters Section */}
        <div className="guidance-section">
          <div
            className="section-header"
            onClick={() => toggleSection('keyAuditMatters')}
          >
            <h3>⚠️ Key Audit Matters</h3>
            <span className={`toggle-icon ${expandedSections.keyAuditMatters ? 'expanded' : ''}`}>▶</span>
          </div>

          {expandedSections.keyAuditMatters && (
            <div className="section-content">
              <ul className="key-matters-list">
                {guidanceData.keyAuditMatters?.map((matter, idx) => (
                  <li key={idx} className="matter-item">
                    <span className="matter-icon">→</span>
                    {matter}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Common Risks Section */}
        <div className="guidance-section">
          <div
            className="section-header"
            onClick={() => toggleSection('commonRisks')}
          >
            <h3>🚨 Common Audit Risks</h3>
            <span className={`toggle-icon ${expandedSections.commonRisks ? 'expanded' : ''}`}>▶</span>
          </div>

          {expandedSections.commonRisks && (
            <div className="section-content">
              <ul className="risks-list">
                {guidanceData.commonRisks?.map((risk, idx) => (
                  <li key={idx} className="risk-item">
                    <span className="risk-icon">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Assigned Agents Section */}
        {agentAssignments && agentAssignments.length > 0 && (
          <div className="guidance-section">
            <div
              className="section-header"
              onClick={() => toggleSection('assignedAgents')}
            >
              <h3>👥 Assigned Agents</h3>
              <span className="agent-count badge">{agentAssignments.length}</span>
              <span className={`toggle-icon ${expandedSections.assignedAgents ? 'expanded' : ''}`}>▶</span>
            </div>

            {expandedSections.assignedAgents && (
              <div className="section-content">
                {agentAssignments.map((agent, idx) => (
                  <div key={idx} className="agent-card">
                    <div className="agent-header">
                      <h4>{agent.agentName}</h4>
                      <span className={`role-badge ${agent.role.toLowerCase()}`}>{agent.role}</span>
                      {agent.required && <span className="required-badge">Required</span>}
                    </div>
                    <p className="agent-rationale">{agent.rationale}</p>
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="specialties">
                        <strong>Specialties:</strong>
                        <div className="specialty-tags">
                          {agent.specialties.map((spec, sIdx) => (
                            <span key={sIdx} className="specialty-tag">{spec}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="agent-status">Status: <span className="status-badge assigned">Assigned</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Procedures Checklist Section */}
        {procedures && procedures.length > 0 && (
          <div className="guidance-section">
            <div
              className="section-header"
              onClick={() => toggleSection('procedures')}
            >
              <h3>✓ Procedures Checklist</h3>
              <span className="procedure-count badge">{filteredProcedures.length}</span>
              <span className={`toggle-icon ${expandedSections.procedures ? 'expanded' : ''}`}>▶</span>
            </div>

            {expandedSections.procedures && (
              <div className="section-content">
                <div className="filter-procedures">
                  <label>Filter by Phase:</label>
                  <select
                    value={filterProceduresByPhase}
                    onChange={(e) => setFilterProceduresByPhase(e.target.value)}
                  >
                    <option>All</option>
                    <option>Planning</option>
                    <option>Risk Assessment</option>
                    <option>Interim</option>
                    <option>Final Audit</option>
                  </select>
                </div>

                <div className="procedures-list">
                  {filteredProcedures.map((proc, idx) => (
                    <div key={idx} className={`procedure-item priority-${proc.priority || 'medium'}`}>
                      <div className="procedure-checkbox">
                        <input type="checkbox" disabled />
                      </div>
                      <div className="procedure-details">
                        <p className="procedure-name">{proc.procedure}</p>
                        <div className="procedure-meta">
                          <span className={`priority-badge priority-${proc.priority || 'medium'}`}>
                            {proc.priority || 'Medium'} Priority
                          </span>
                          <span className="phase-badge">{proc.phase}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <button className="btn-primary">Start Working</button>
        <button className="btn-secondary">View Full Guidance</button>
      </div>
    </div>
  );
}
