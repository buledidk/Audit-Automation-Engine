import React, { useState, useCallback } from 'react';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE AUDIT WORKSHEET TEMPLATES
 * Professional audit workpapers compliant with ISA standards
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * This module provides production-quality worksheet templates for 5 key FSLI areas:
 * 1. C1 - Trial Balance & Lead Schedules (ISA 500)
 * 2. D3 - Revenue & Receivables (ISA 240, 501, 505)
 * 3. D4 - Inventory & WIP (ISA 501, 540)
 * 4. D5 - Fixed Assets & Leases (ISA 500, 540)
 * 5. D6 - Payables & Accruals (ISA 500, 501, 505)
 *
 * Each worksheet includes:
 * - Header section with engagement details and sign-off
 * - Objective & scope with materiality
 * - Procedure execution with pre-populated dropdowns
 * - Results summary with exception tracking
 * - Assertion testing matrix
 * - Evidence documentation
 * - Sensitive areas & judgments
 * - Risk assessment & control testing
 * - Integrated comments with threading
 */

const COLORS = {
  bg: '#0A0E17',
  sidebar: '#0F1622',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  accent: '#F5A623',
  text: '#F8F8F8',
  dim: 'rgba(255,255,255,0.6)',
  faint: 'rgba(255,255,255,0.3)',
  green: '#66BB6A',
  red: '#EF5350',
  orange: '#FFA726',
  blue: '#42A5F5',
  yellow: '#FFD54F',
  purple: '#CE93D8'
};

// ═════════════════════════════════════════════════════════════════════════════
// WORKSHEET HEADER COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

function WorksheetHeader({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `2px solid ${COLORS.accent}`,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column - Engagement Details */}
        <div>
          <h3 style={{ color: COLORS.accent, margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase' }}>
            Engagement Details
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <Field label="Entity Name" value={wsData.entityName} onChange={(v) => updateWS('entityName', v)} />
            <Field label="Financial Year End" value={wsData.yearEnd} onChange={(v) => updateWS('yearEnd', v)} type="date" />
            <Field label="Reporting Period" value={wsData.period} onChange={(v) => updateWS('period', v)} placeholder="12 months ended 31/12/2024" />
          </div>
        </div>

        {/* Right Column - Working Paper Ref & Title */}
        <div>
          <h3 style={{ color: COLORS.accent, margin: '0 0 16px 0', fontSize: '12px', textTransform: 'uppercase' }}>
            Working Paper Reference
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <Field label="WP Reference" value={wsData.wpRef} onChange={(v) => updateWS('wpRef', v)} placeholder="C1, D3, D4, etc." readonly={true} />
            <Field label="Worksheet Title" value={wsData.wsTitle} onChange={(v) => updateWS('wsTitle', v)} />
            <Field label="Risk Level" value={wsData.riskLevel} onChange={(v) => updateWS('riskLevel', v)}
              type="select" options={['High', 'Medium', 'Low']} />
          </div>
        </div>
      </div>

      {/* Sign-off Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        borderTop: `1px solid ${COLORS.border}`,
        paddingTop: '16px'
      }}>
        {/* Preparer */}
        <div>
          <p style={{ color: COLORS.dim, fontSize: '11px', margin: '0 0 8px 0' }}>PREPARED BY</p>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="Name" value={wsData.preparer.name}
              onChange={(v) => updateWS('preparer', { ...wsData.preparer, name: v })}
              placeholder="Auditor name" size="small" />
            <Field label="Initials" value={wsData.preparer.initials}
              onChange={(v) => updateWS('preparer', { ...wsData.preparer, initials: v })}
              placeholder="AA" size="small" maxLength={2} />
            <Field label="Date" value={wsData.preparer.date}
              onChange={(v) => updateWS('preparer', { ...wsData.preparer, date: v })}
              type="date" size="small" />
          </div>
        </div>

        {/* Reviewer */}
        <div>
          <p style={{ color: COLORS.dim, fontSize: '11px', margin: '0 0 8px 0' }}>REVIEWED BY</p>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="Name" value={wsData.reviewer.name}
              onChange={(v) => updateWS('reviewer', { ...wsData.reviewer, name: v })}
              placeholder="Manager name" size="small" />
            <Field label="Initials" value={wsData.reviewer.initials}
              onChange={(v) => updateWS('reviewer', { ...wsData.reviewer, initials: v })}
              placeholder="JD" size="small" maxLength={2} />
            <Field label="Date" value={wsData.reviewer.date}
              onChange={(v) => updateWS('reviewer', { ...wsData.reviewer, date: v })}
              type="date" size="small" />
          </div>
        </div>

        {/* Assertion Being Tested */}
        <div>
          <p style={{ color: COLORS.dim, fontSize: '11px', margin: '0 0 8px 0' }}>ASSERTION TESTED</p>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="Primary Assertion" value={wsData.assertion}
              onChange={(v) => updateWS('assertion', v)}
              type="select"
              options={['Existence', 'Completeness', 'Accuracy', 'Cutoff', 'Valuation', 'Classification', 'Rights & Obligations']}
              size="small" />
            <Field label="Partner Approval" value={wsData.partnerApproval}
              onChange={(v) => updateWS('partnerApproval', v)}
              placeholder="Initials & date" size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// OBJECTIVE & SCOPE SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ObjectiveAndScope({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        2. OBJECTIVE & SCOPE
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            AUDIT OBJECTIVE
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '12px',
            fontFamily: 'monospace',
            minHeight: '80px',
            resize: 'vertical'
          }} value={wsData.objective} onChange={(e) => updateWS('objective', e.target.value)}
            placeholder="State the specific audit objective, what we're testing, and why (reference ISA and risk)" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            ACCOUNT/FSLI BEING TESTED
          </label>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="GL Account(s)" value={wsData.glAccounts}
              onChange={(v) => updateWS('glAccounts', v)}
              placeholder="e.g., 4000-4999 Revenue accounts" />
            <Field label="Balance Sheet Description" value={wsData.bsDescription}
              onChange={(v) => updateWS('bsDescription', v)}
              placeholder="Trade receivables - net of allowance" />
          </div>
        </div>
      </div>

      {/* Assertion & Materiality */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            ASSERTION(S) TESTED
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '60px'
          }} value={wsData.assertionsTested} onChange={(e) => updateWS('assertionsTested', e.target.value)}
            placeholder="e.g., Existence - sales recorded actually happened; Completeness - all sales recorded" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            MATERIALITY THRESHOLD
          </label>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="Overall Materiality" value={wsData.overallMateriality}
              onChange={(v) => updateWS('overallMateriality', v)}
              placeholder="£250,000" />
            <Field label="Performance Materiality (75%)" value={wsData.performanceMateriality}
              onChange={(v) => updateWS('performanceMateriality', v)}
              placeholder="£187,500" />
            <Field label="Trivial Threshold (5%)" value={wsData.trivialThreshold}
              onChange={(v) => updateWS('trivialThreshold', v)}
              placeholder="£12,500" />
          </div>
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            CONTROL RELIANCE & TESTING APPROACH
          </label>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Field label="Rely on Controls? (Y/N)" value={wsData.reliedOnControls}
              onChange={(v) => updateWS('reliedOnControls', v)}
              type="select" options={['Yes', 'No']} />
            <Field label="Key Controls" value={wsData.keyControls}
              onChange={(v) => updateWS('keyControls', v)}
              placeholder="e.g., monthly AR reconciliation, approval authority" />
            <Field label="Testing Approach" value={wsData.testingApproach}
              onChange={(v) => updateWS('testingApproach', v)}
              type="select" options={['100% Testing', 'Statistical Sample', 'Stratified Sample', 'Risk-Based Sample']} />
          </div>
        </div>
      </div>

      {/* Comment Button */}
      <CommentButton section="objective" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PROCEDURE EXECUTION SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ProcedureExecution({ wsData, updateWS, procedures }) {
  const [selectedProcedures, setSelectedProcedures] = useState(wsData.procedures || []);

  const handleAddProcedure = useCallback((procId) => {
    const procedure = procedures.find(p => p.id === procId);
    const newProc = {
      ...procedure,
      plannedSampleSize: '',
      actualSampleSize: '',
      selectionMethod: '',
      populationTotal: '',
      populationValue: '',
      evidenceReference: '',
      exceptionsFound: 0,
      exceptionTypes: '',
      conclusion: 'Y'
    };
    const updated = [...selectedProcedures, newProc];
    setSelectedProcedures(updated);
    updateWS('procedures', updated);
  }, [procedures, selectedProcedures, updateWS]);

  const handleUpdateProcedure = useCallback((index, field, value) => {
    const updated = [...selectedProcedures];
    updated[index][field] = value;
    setSelectedProcedures(updated);
    updateWS('procedures', updated);
  }, [selectedProcedures, updateWS]);

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        3. PROCEDURE EXECUTION
      </h3>

      {/* Procedure Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
          ADD AUDIT PROCEDURES FROM LIBRARY
        </label>
        <select style={{
          width: '100%',
          padding: '8px',
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '6px',
          color: COLORS.text,
          fontSize: '12px'
        }} onChange={(e) => {
          if (e.target.value) {
            handleAddProcedure(e.target.value);
            e.target.value = '';
          }
        }}>
          <option value="">-- Select a procedure to add --</option>
          {procedures.map(p => (
            <option key={p.id} value={p.id}>
              {p.id}: {p.description.substring(0, 60)}...
            </option>
          ))}
        </select>
      </div>

      {/* Procedure Details Table */}
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
          background: COLORS.bg,
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: COLORS.sidebar, borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 600 }}>Proc ID</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 600 }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 600 }}>Assertion</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 600 }}>Planned Sample</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 600 }}>Actual Sample</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 600 }}>Exceptions</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedProcedures.map((proc, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '8px', color: COLORS.accent, fontWeight: 600 }}>{proc.id}</td>
                <td style={{ padding: '8px', color: COLORS.dim }}>{proc.description}</td>
                <td style={{ padding: '8px', color: COLORS.faint, fontSize: '10px' }}>
                  {proc.assertion?.substring(0, 20)}...
                </td>
                <td style={{ padding: '8px' }}>
                  <input style={{
                    width: '60px',
                    padding: '4px',
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '4px',
                    color: COLORS.text,
                    fontSize: '11px'
                  }} type="number" value={proc.plannedSampleSize}
                    onChange={(e) => handleUpdateProcedure(idx, 'plannedSampleSize', e.target.value)}
                    placeholder="50" />
                </td>
                <td style={{ padding: '8px' }}>
                  <input style={{
                    width: '60px',
                    padding: '4px',
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '4px',
                    color: COLORS.text,
                    fontSize: '11px'
                  }} type="number" value={proc.actualSampleSize}
                    onChange={(e) => handleUpdateProcedure(idx, 'actualSampleSize', e.target.value)}
                    placeholder="50" />
                </td>
                <td style={{ padding: '8px' }}>
                  <input style={{
                    width: '50px',
                    padding: '4px',
                    background: proc.exceptionsFound > 0 ? COLORS.red + '30' : COLORS.card,
                    border: `1px solid ${proc.exceptionsFound > 0 ? COLORS.red : COLORS.border}`,
                    borderRadius: '4px',
                    color: proc.exceptionsFound > 0 ? COLORS.red : COLORS.text,
                    fontSize: '11px'
                  }} type="number" value={proc.exceptionsFound}
                    onChange={(e) => handleUpdateProcedure(idx, 'exceptionsFound', parseInt(e.target.value) || 0)}
                    placeholder="0" />
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button style={{
                    padding: '4px 8px',
                    background: COLORS.red,
                    border: 'none',
                    borderRadius: '4px',
                    color: COLORS.text,
                    cursor: 'pointer',
                    fontSize: '11px'
                  }} onClick={() => {
                    const updated = selectedProcedures.filter((_, i) => i !== idx);
                    setSelectedProcedures(updated);
                    updateWS('procedures', updated);
                  }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Population & Sample Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            POPULATION DEFINITION
          </label>
          <Field label="Total Items in Population" value={wsData.populationItems}
            onChange={(v) => updateWS('populationItems', v)}
            type="number" placeholder="e.g., 1,250" />
          <Field label="Total Population Value" value={wsData.populationValue}
            onChange={(v) => updateWS('populationValue', v)}
            placeholder="e.g., £5,250,000" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            SAMPLE METHODOLOGY
          </label>
          <Field label="Selection Method" value={wsData.selectionMethod}
            onChange={(v) => updateWS('selectionMethod', v)}
            type="select" options={['Random', 'Stratified', 'Systematic', 'Judgmental', 'Risk-Based']} />
          <Field label="Sampling Software/Tool Used" value={wsData.samplingTool}
            onChange={(v) => updateWS('samplingTool', v)}
            placeholder="e.g., ACL, Deloitte Samples" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            EVIDENCE DOCUMENTATION
          </label>
          <Field label="Evidence Reference" value={wsData.evidenceReference}
            onChange={(v) => updateWS('evidenceReference', v)}
            placeholder="File attachments, email trails, etc." />
          <Field label="Testing Completed By" value={wsData.testedBy}
            onChange={(v) => updateWS('testedBy', v)}
            placeholder="Auditor name and date" />
        </div>
      </div>

      <CommentButton section="procedures" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// RESULTS SUMMARY TABLE
// ═════════════════════════════════════════════════════════════════════════════

function ResultsSummary({ wsData, updateWS }) {
  // Auto-calculate exception percentages
  const calculateExceptionRate = (exceptions, sample) => {
    if (!sample || sample === 0) return '0.00%';
    const rate = (exceptions / sample) * 100;
    return rate.toFixed(2) + '%';
  };

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        4. TESTING RESULTS SUMMARY
      </h3>

      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px',
          background: COLORS.bg,
          borderRadius: '6px'
        }}>
          <thead>
            <tr style={{ background: COLORS.sidebar, borderBottom: `2px solid ${COLORS.accent}` }}>
              <th style={{ padding: '10px', textAlign: 'left', color: COLORS.accent, fontWeight: 700 }}>Procedure</th>
              <th style={{ padding: '10px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Population</th>
              <th style={{ padding: '10px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Sample Size</th>
              <th style={{ padding: '10px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Exceptions</th>
              <th style={{ padding: '10px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Exception %</th>
              <th style={{ padding: '10px', textAlign: 'center', color: COLORS.accent, fontWeight: 700 }}>Conclusion</th>
            </tr>
          </thead>
          <tbody>
            {wsData.procedures?.map((proc, idx) => {
              const exceptionRate = calculateExceptionRate(proc.exceptionsFound, proc.actualSampleSize);
              const exceptionPercent = parseFloat(exceptionRate);
              const isMaterial = exceptionPercent > 2; // Exceeded 2% threshold

              return (
                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '10px', color: COLORS.accent, fontWeight: 600 }}>{proc.id}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: COLORS.dim }}>
                    {proc.populationTotal || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: COLORS.text }}>
                    {proc.actualSampleSize || 0}
                  </td>
                  <td style={{
                    padding: '10px',
                    textAlign: 'center',
                    color: proc.exceptionsFound > 0 ? COLORS.red : COLORS.green,
                    fontWeight: 600
                  }}>
                    {proc.exceptionsFound || 0}
                  </td>
                  <td style={{
                    padding: '10px',
                    textAlign: 'center',
                    color: isMaterial ? COLORS.red : COLORS.green,
                    fontWeight: isMaterial ? 700 : 400,
                    background: isMaterial ? COLORS.red + '10' : 'transparent'
                  }}>
                    {exceptionRate}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 6px',
                      background: proc.conclusion === 'Y' ? COLORS.green + '30' : COLORS.red + '30',
                      color: proc.conclusion === 'Y' ? COLORS.green : COLORS.red,
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600
                    }}>
                      {proc.conclusion === 'Y' ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Exception Details */}
      <div>
        <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
          EXCEPTION DETAILS & EVALUATION
        </label>
        <textarea style={{
          width: '100%',
          padding: '8px',
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '6px',
          color: COLORS.text,
          fontSize: '11px',
          minHeight: '80px'
        }} value={wsData.exceptionDetails} onChange={(e) => updateWS('exceptionDetails', e.target.value)}
          placeholder="Detail each exception: type (e.g., cutoff, pricing), description, amount, evaluation (trivial/significant/material), and management response" />
      </div>

      <CommentButton section="results" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ASSERTION TESTING MATRIX
// ═════════════════════════════════════════════════════════════════════════════

function AssertionMatrix({ wsData, updateWS, assertions }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        5. ASSERTION TESTING MATRIX (ISA 315/330)
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '10px',
          background: COLORS.bg,
          borderRadius: '6px'
        }}>
          <thead>
            <tr style={{ background: COLORS.sidebar, borderBottom: `2px solid ${COLORS.accent}` }}>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '15%' }}>Assertion</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '25%' }}>Procedures Linking</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '20%' }}>Evidence Obtained</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '15%' }}>Risk Addressed</th>
              <th style={{ padding: '8px', textAlign: 'center', color: COLORS.accent, fontWeight: 700, width: '10%' }}>Conclusion</th>
              <th style={{ padding: '8px', textAlign: 'left', color: COLORS.accent, fontWeight: 700, width: '15%' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {assertions.map((assertion, idx) => {
              const matrixData = wsData.assertionMatrix?.[idx] || {};

              return (
                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '8px', color: COLORS.accent, fontWeight: 600 }}>{assertion}</td>
                  <td style={{ padding: '8px', color: COLORS.dim, fontSize: '10px' }}>
                    <textarea style={{
                      width: '100%',
                      padding: '4px',
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '4px',
                      color: COLORS.text,
                      fontSize: '9px',
                      minHeight: '40px',
                      resize: 'none'
                    }} placeholder={`e.g., ${assertion === 'Existence' ? 'D3.1, D3.5' : 'D3.2, D3.3'}`}
                      value={matrixData.procedures || ''}
                      onChange={(e) => {
                        const updated = [...(wsData.assertionMatrix || [])];
                        updated[idx] = { ...updated[idx], procedures: e.target.value };
                        updateWS('assertionMatrix', updated);
                      }} />
                  </td>
                  <td style={{ padding: '8px', color: COLORS.dim, fontSize: '10px' }}>
                    <textarea style={{
                      width: '100%',
                      padding: '4px',
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '4px',
                      color: COLORS.text,
                      fontSize: '9px',
                      minHeight: '40px',
                      resize: 'none'
                    }} placeholder="Summary of evidence obtained (confirmations, tests, analysis)"
                      value={matrixData.evidence || ''}
                      onChange={(e) => {
                        const updated = [...(wsData.assertionMatrix || [])];
                        updated[idx] = { ...updated[idx], evidence: e.target.value };
                        updateWS('assertionMatrix', updated);
                      }} />
                  </td>
                  <td style={{ padding: '8px', color: COLORS.dim, fontSize: '9px' }}>
                    <textarea style={{
                      width: '100%',
                      padding: '4px',
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '4px',
                      color: COLORS.text,
                      fontSize: '9px',
                      minHeight: '40px',
                      resize: 'none'
                    }} placeholder="Which risk does this address?"
                      value={matrixData.risk || ''}
                      onChange={(e) => {
                        const updated = [...(wsData.assertionMatrix || [])];
                        updated[idx] = { ...updated[idx], risk: e.target.value };
                        updateWS('assertionMatrix', updated);
                      }} />
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <select style={{
                      padding: '4px 6px',
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '4px',
                      color: matrixData.conclusion === 'Y' ? COLORS.green : matrixData.conclusion === 'N' ? COLORS.red : COLORS.dim,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }} value={matrixData.conclusion || ''}
                      onChange={(e) => {
                        const updated = [...(wsData.assertionMatrix || [])];
                        updated[idx] = { ...updated[idx], conclusion: e.target.value };
                        updateWS('assertionMatrix', updated);
                      }}>
                      <option value="">--</option>
                      <option value="Y">Y - Satisfied</option>
                      <option value="N">N - Not Satisfied</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <CommentButton section={`assertion_${idx}`} wsData={wsData} updateWS={updateWS} inline={true} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ color: COLORS.dim, fontSize: '10px', marginTop: '12px' }}>
        Note: All assertions must be satisfied ("Y") for the worksheet to be concluded. If any assertion is "N", document the reason below.
      </p>

      <CommentButton section="assertions" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EVIDENCE DOCUMENTATION
// ═════════════════════════════════════════════════════════════════════════════

function EvidenceDocumentation({ wsData, updateWS }) {
  const [evidenceList, setEvidenceList] = useState(wsData.evidence || []);

  const addEvidence = () => {
    const newEvidence = {
      type: '',
      source: '',
      summary: '',
      dateObtained: new Date().toISOString().split('T')[0],
      reliability: 'Reliable',
      fileRef: ''
    };
    const updated = [...evidenceList, newEvidence];
    setEvidenceList(updated);
    updateWS('evidence', updated);
  };

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: COLORS.text, margin: 0, fontSize: '13px', fontWeight: 600 }}>
          6. EVIDENCE DOCUMENTATION (ISA 500)
        </h3>
        <button onClick={addEvidence} style={{
          padding: '6px 12px',
          background: COLORS.green,
          border: 'none',
          borderRadius: '6px',
          color: COLORS.text,
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600
        }}>
          + ADD EVIDENCE
        </button>
      </div>

      {evidenceList.map((evidence, idx) => (
        <div key={idx} style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <Field label="Evidence Type"
              value={evidence.type}
              onChange={(v) => {
                const updated = [...evidenceList];
                updated[idx].type = v;
                setEvidenceList(updated);
                updateWS('evidence', updated);
              }}
              type="select"
              options={['External Confirmation', 'Recalculation', 'Document Review', 'Observation', 'Inquiry', 'Analytical Procedure', 'Management Representation']} />

            <Field label="Source/Reference"
              value={evidence.source}
              onChange={(v) => {
                const updated = [...evidenceList];
                updated[idx].source = v;
                setEvidenceList(updated);
                updateWS('evidence', updated);
              }}
              placeholder="e.g., bank confirmation letter, invoice, contract" />

            <Field label="Date Obtained"
              value={evidence.dateObtained}
              onChange={(v) => {
                const updated = [...evidenceList];
                updated[idx].dateObtained = v;
                setEvidenceList(updated);
                updateWS('evidence', updated);
              }}
              type="date" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                EVIDENCE SUMMARY
              </label>
              <textarea style={{
                width: '100%',
                padding: '8px',
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                color: COLORS.text,
                fontSize: '11px',
                minHeight: '60px',
                resize: 'vertical'
              }} value={evidence.summary}
                onChange={(e) => {
                  const updated = [...evidenceList];
                  updated[idx].summary = e.target.value;
                  setEvidenceList(updated);
                  updateWS('evidence', updated);
                }}
                placeholder="What does this evidence show? How does it support the assertion?" />
            </div>

            <div>
              <div style={{ marginBottom: '12px' }}>
                <Field label="Reliability Assessment"
                  value={evidence.reliability}
                  onChange={(v) => {
                    const updated = [...evidenceList];
                    updated[idx].reliability = v;
                    setEvidenceList(updated);
                    updateWS('evidence', updated);
                  }}
                  type="select"
                  options={['Reliable', 'Conditional', 'Limited']} />
              </div>
              <div>
                <Field label="File Attachment Ref"
                  value={evidence.fileRef}
                  onChange={(v) => {
                    const updated = [...evidenceList];
                    updated[idx].fileRef = v;
                    setEvidenceList(updated);
                    updateWS('evidence', updated);
                  }}
                  placeholder="e.g., H:\Evidence\AR_Confirmations.xlsx" />
              </div>
            </div>
          </div>

          <button onClick={() => {
            const updated = evidenceList.filter((_, i) => i !== idx);
            setEvidenceList(updated);
            updateWS('evidence', updated);
          }} style={{
            padding: '4px 8px',
            background: COLORS.red + '30',
            border: `1px solid ${COLORS.red}`,
            borderRadius: '4px',
            color: COLORS.red,
            cursor: 'pointer',
            fontSize: '10px',
            marginTop: '8px'
          }}>Remove</button>
        </div>
      ))}

      <CommentButton section="evidence" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SENSITIVE AREAS & JUDGMENTS
// ═════════════════════════════════════════════════════════════════════════════

function SensitiveAreas({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        7. SENSITIVE AREAS & KEY JUDGMENTS
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            KEY JUDGMENTS MADE
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.keyJudgments} onChange={(e) => updateWS('keyJudgments', e.target.value)}
            placeholder="Document key judgments (e.g., estimate reliability assessment, cutoff testing method, sample size rationale)" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            ASSUMPTIONS DOCUMENTED
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.assumptions} onChange={(e) => updateWS('assumptions', e.target.value)}
            placeholder="E.g., inflation rate 3%, completion percentage 85%, discount rates used" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            ALTERNATIVE APPROACHES CONSIDERED
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.alternativeApproaches} onChange={(e) => updateWS('alternativeApproaches', e.target.value)}
            placeholder="What alternatives were considered and why was the chosen method selected?" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            MANAGEMENT CHALLENGE POINTS
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.challengePoints} onChange={(e) => updateWS('challengePoints', e.target.value)}
            placeholder="Areas where management judgment was high or we had different perspectives; management representations obtained (Y/N)" />
        </div>
      </div>

      <CommentButton section="sensitive" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// RISKS & CONTROLS ASSESSMENT
// ═════════════════════════════════════════════════════════════════════════════

function RisksAndControls({ wsData, updateWS }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: COLORS.text, margin: '0 0 16px 0', fontSize: '13px', fontWeight: 600 }}>
        8. RISKS & CONTROLS ASSESSMENT (ISA 315/330)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            KEY CONTROLS OVER THIS AREA
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '70px'
          }} value={wsData.keyControls} onChange={(e) => updateWS('keyControls', e.target.value)}
            placeholder="Describe key preventive and detective controls (e.g., segregation of duties, authorization, reconciliations)" />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            IDENTIFIED CONTROL GAPS
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '70px'
          }} value={wsData.controlGaps} onChange={(e) => updateWS('controlGaps', e.target.value)}
            placeholder="Describe any control gaps or weaknesses identified; whether they are compensating controls" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div>
          <Field label="Design Effectiveness (Y/N)"
            value={wsData.designEffectiveness}
            onChange={(v) => updateWS('designEffectiveness', v)}
            type="select" options={['Yes', 'No']} />
          <p style={{ color: COLORS.faint, fontSize: '10px', marginTop: '4px' }}>
            Is control designed to prevent/detect misstatement?
          </p>
        </div>

        <div>
          <Field label="Operating Effectiveness (Y/N)"
            value={wsData.operatingEffectiveness}
            onChange={(v) => updateWS('operatingEffectiveness', v)}
            type="select" options={['Yes', 'No']} />
          <p style={{ color: COLORS.faint, fontSize: '10px', marginTop: '4px' }}>
            Did control operate as designed throughout period?
          </p>
        </div>

        <div>
          <Field label="Reliance Decision (Y/N)"
            value={wsData.relianceDecision}
            onChange={(v) => updateWS('relianceDecision', v)}
            type="select" options={['Yes', 'No']} />
          <p style={{ color: COLORS.faint, fontSize: '10px', marginTop: '4px' }}>
            Will we rely on these controls?
          </p>
        </div>
      </div>

      <CommentButton section="controls" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// WORKPAPER CONCLUSION
// ═════════════════════════════════════════════════════════════════════════════

function WorkpaperConclusion({ wsData, updateWS, assertions }) {
  const allAssertionsSatisfied = wsData.assertionMatrix?.every(m => m.conclusion === 'Y');

  return (
    <div style={{
      background: COLORS.card,
      border: `2px solid ${allAssertionsSatisfied ? COLORS.green : COLORS.red}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: allAssertionsSatisfied ? COLORS.green : COLORS.red,
        margin: '0 0 16px 0',
        fontSize: '13px',
        fontWeight: 600
      }}>
        9. WORKPAPER CONCLUSION
      </h3>

      <div style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontFamily: 'monospace',
        fontSize: '11px'
      }}>
        <p style={{ color: COLORS.text, margin: '0 0 8px 0' }}>Based on our procedures:</p>

        <p style={{
          color: allAssertionsSatisfied ? COLORS.green : COLORS.red,
          margin: '8px 0',
          fontWeight: 600
        }}>
          {allAssertionsSatisfied
            ? '✓ All assertions have been satisfied'
            : '✗ The following assertions were not satisfied:'}
        </p>

        {!allAssertionsSatisfied && (
          <ul style={{ margin: '8px 0 8px 20px', color: COLORS.red }}>
            {wsData.assertionMatrix?.map((m, idx) =>
              m.conclusion === 'N' ? <li key={idx}>{assertions[idx]}</li> : null
            )}
          </ul>
        )}

        <p style={{ color: COLORS.text, margin: '8px 0' }}>
          <strong>Exceptions:</strong> {wsData.procedures?.reduce((sum, p) => sum + (p.exceptionsFound || 0), 0) || 0} exceptions found
        </p>

        <p style={{ color: COLORS.text, margin: '8px 0' }}>
          <strong>Evidence Basis:</strong> {wsData.procedures?.length || 0} audit procedures performed, {wsData.evidence?.length || 0} types of evidence obtained
        </p>

        <p style={{ color: COLORS.text, margin: '8px 0' }}>
          <strong>Conclusion:</strong> {allAssertionsSatisfied
            ? 'Assertion satisfied based on audit procedures'
            : 'Assertion NOT satisfied - see exception details above'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            OVERALL CONCLUSION TEXT
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.conclusionText} onChange={(e) => updateWS('conclusionText', e.target.value)}
            placeholder="Based on sufficient appropriate audit evidence, the assertion [X] is [SATISFIED / NOT SATISFIED]..." />
        </div>

        <div>
          <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            NEXT STEPS (IF REQUIRED)
          </label>
          <textarea style={{
            width: '100%',
            padding: '8px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '11px',
            minHeight: '80px'
          }} value={wsData.nextSteps} onChange={(e) => updateWS('nextSteps', e.target.value)}
            placeholder="Describe any outstanding procedures, follow-up required, or matters for further discussion" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Field label="Status"
          value={wsData.status}
          onChange={(v) => updateWS('status', v)}
          type="select"
          options={['Complete', 'Pending Review', 'Requires Further Work']} />

        <Field label="Sign-off (Reviewer Initials & Date)"
          value={wsData.signOff}
          onChange={(v) => updateWS('signOff', v)}
          placeholder="e.g., JD, 15/03/2025" />
      </div>

      <CommentButton section="conclusion" wsData={wsData} updateWS={updateWS} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMMENT SYSTEM (INTEGRATED THROUGHOUT)
// ═════════════════════════════════════════════════════════════════════════════

function CommentButton({ section, wsData, updateWS, inline }) {
  const [showComments, setShowComments] = useState(false);
  const comments = wsData.comments?.[section] || [];

  return (
    <div style={{ marginTop: inline ? 0 : '12px' }}>
      <button onClick={() => setShowComments(!showComments)} style={{
        padding: inline ? '2px 6px' : '8px 12px',
        background: COLORS.blue + '30',
        border: `1px solid ${COLORS.blue}`,
        borderRadius: '4px',
        color: COLORS.blue,
        cursor: 'pointer',
        fontSize: inline ? '9px' : '11px',
        fontWeight: 600
      }}>
        💬 {comments.length} Comments {showComments ? '▼' : '▶'}
      </button>

      {showComments && (
        <div style={{ marginTop: '12px', padding: '12px', background: COLORS.bg, borderRadius: '6px' }}>
          {comments.map((comment, idx) => (
            <div key={idx} style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '8px',
              fontSize: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: COLORS.accent }}>{comment.author}</strong>
                <span style={{ color: COLORS.faint }}>{comment.date}</span>
              </div>
              <p style={{ color: COLORS.text, margin: '4px 0' }}>{comment.text}</p>
            </div>
          ))}

          <input type="text" placeholder="Add comment..." style={{
            width: '100%',
            padding: '8px',
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '4px',
            color: COLORS.text,
            fontSize: '11px'
          }} onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              const updated = wsData.comments || {};
              updated[section] = [
                ...(updated[section] || []),
                {
                  author: 'Current User',
                  date: new Date().toISOString().split('T')[0],
                  text: e.target.value
                }
              ];
              updateWS('comments', updated);
              e.target.value = '';
            }
          }} />
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function Field({ label, value, onChange, type = 'text', options, placeholder, readonly, size, maxLength }) {
  const styles = {
    label: {
      color: COLORS.dim,
      fontSize: size === 'small' ? '10px' : '11px',
      fontWeight: 600,
      display: 'block',
      marginBottom: '4px'
    },
    input: {
      width: '100%',
      padding: size === 'small' ? '4px 6px' : '8px',
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '6px',
      color: COLORS.text,
      fontSize: size === 'small' ? '10px' : '11px',
      fontFamily: type === 'date' ? 'inherit' : 'inherit'
    }
  };

  return (
    <div>
      {label && <label style={styles.label}>{label}</label>}
      {type === 'select' ? (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, cursor: 'pointer' }}>
          <option value="">-- Select --</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} readonly={readonly} maxLength={maxLength}
          style={{ ...styles.input, cursor: readonly ? 'not-allowed' : 'auto' }} />
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TEMPLATE VARIANTS FOR SPECIFIC FSLI
// ═════════════════════════════════════════════════════════════════════════════

export const WORKSHEET_TEMPLATES = {
  C1: {
    title: 'Trial Balance & Lead Schedules',
    assertions: ['Existence', 'Completeness', 'Accuracy', 'Cutoff'],
    description: 'Reconcile trial balance to GL and financial statements. Test lead schedule completeness and accuracy.',
    procedures: [
      { id: 'C1.1', description: 'Cast trial balance (add all debits and credits)', assertion: 'Accuracy' },
      { id: 'C1.2', description: 'Trace TB to GL and verify accounts', assertion: 'Existence, Accuracy' },
      { id: 'C1.3', description: 'Reconcile TB to FS - debit and credit columns, movement schedule', assertion: 'Completeness, Accuracy' },
      { id: 'C1.4', description: 'Review unusual or non-standard GL accounts', assertion: 'Classification, Existence' },
      { id: 'C1.5', description: 'Verify movement analysis (opening → closing balances)', assertion: 'Completeness, Accuracy' }
    ]
  },

  D3: {
    title: 'Revenue & Receivables',
    assertions: ['Existence', 'Completeness', 'Accuracy', 'Cutoff', 'Valuation'],
    description: 'Test revenue recognition, AR aging, confirmations, and cutoff. Evaluate allowance for doubtful debts.',
    procedures: [
      { id: 'D3.1', description: 'Test revenue recognition policy compliance with IFRS 15', assertion: 'Accuracy, Classification' },
      { id: 'D3.2', description: 'Analytical review - revenue trends by product/period', assertion: 'Reasonableness' },
      { id: 'D3.3', description: 'Sample revenue transactions ±10 days year-end for cutoff', assertion: 'Cutoff, Existence, Accuracy' },
      { id: 'D3.4', description: 'AR aging analysis and collectibility assessment', assertion: 'Valuation' },
      { id: 'D3.5', description: 'Perform AR confirmations (positive and negative)', assertion: 'Existence, Accuracy' },
      { id: 'D3.6', description: 'Evaluate allowance for doubtful debts adequacy', assertion: 'Valuation' }
    ]
  },

  D4: {
    title: 'Inventory & Work-in-Progress',
    assertions: ['Existence', 'Completeness', 'Accuracy', 'Valuation'],
    description: 'Test inventory count, cost build-up, NRV, and obsolescence. Evaluate appropriateness of cost allocation.',
    procedures: [
      { id: 'D4.1', description: 'Attend inventory count - observe procedures and test samples', assertion: 'Existence, Completeness' },
      { id: 'D4.2', description: 'Verify inventory cost build-up (materials, labor, overhead)', assertion: 'Valuation, Accuracy' },
      { id: 'D4.3', description: 'NRV testing - trace to post year-end selling prices', assertion: 'Valuation' },
      { id: 'D4.4', description: 'Identify and test slow-moving and obsolete stock', assertion: 'Valuation' },
      { id: 'D4.5', description: 'Test allocation of overhead to inventory (reasonableness)', assertion: 'Valuation, Accuracy' }
    ]
  },

  D5: {
    title: 'Fixed Assets & Leases',
    assertions: ['Existence', 'Completeness', 'Accuracy', 'Cutoff', 'Valuation', 'Rights & Obligations'],
    description: 'Test additions, disposals, depreciation, useful lives, impairment, and lease classification per IFRS 16.',
    procedures: [
      { id: 'D5.1', description: 'Verify additions - trace to invoices, contracts, authorization', assertion: 'Existence, Accuracy, Cutoff' },
      { id: 'D5.2', description: 'Test disposals - gain/loss calculation and cutoff', assertion: 'Accuracy, Completeness, Cutoff' },
      { id: 'D5.3', description: 'Recalculate depreciation (rate, useful life, residual value)', assertion: 'Valuation, Accuracy' },
      { id: 'D5.4', description: 'Assess impairment triggers - test fair value if required', assertion: 'Valuation' },
      { id: 'D5.5', description: 'Review lease classification - finance vs operating per IFRS 16', assertion: 'Classification, Valuation' },
      { id: 'D5.6', description: 'Test lease accounting - ROU asset, lease liability, interest expense', assertion: 'Accuracy, Valuation' }
    ]
  },

  D6: {
    title: 'Payables & Accruals',
    assertions: ['Existence', 'Completeness', 'Accuracy', 'Cutoff', 'Valuation'],
    description: 'Test payables, confirmations, accruals, and cutoff. Verify completeness of year-end liabilities.',
    procedures: [
      { id: 'D6.1', description: 'Perform payables confirmations (bank, major suppliers)', assertion: 'Existence, Accuracy' },
      { id: 'D6.2', description: 'Test accruals - select sample and verify to supporting documentation', assertion: 'Existence, Accuracy, Completeness' },
      { id: 'D6.3', description: 'Cutoff testing - verify goods receipt/invoice dating in post year-end period', assertion: 'Cutoff, Completeness' },
      { id: 'D6.4', description: 'Assess unrecorded liabilities - review post year-end invoices and commitments', assertion: 'Completeness' },
      { id: 'D6.5', description: 'Evaluate long-term payables - terms, rates, covenants', assertion: 'Valuation, Classification' }
    ]
  }
};

export default WORKSHEET_TEMPLATES;
