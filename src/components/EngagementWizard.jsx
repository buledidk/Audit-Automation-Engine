/**
 * EngagementWizard — 6-step audit engagement setup
 * Step 1: Client Details
 * Step 2: Acceptance & Independence
 * Step 3: Risk Assessment
 * Step 4: Materiality
 * Step 5: Team Assignment
 * Step 6: Planning Summary
 *
 * Each step builds the audit narrative progressively
 */

import React, { useState, useCallback } from 'react';
import { calculateMateriality } from '../services/materialityEngine';

// ─── Step definitions ─────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Client Details',   icon: '🏢' },
  { id: 2, label: 'Acceptance',       icon: '✅' },
  { id: 3, label: 'Risk Assessment',  icon: '⚠️' },
  { id: 4, label: 'Materiality',      icon: '📊' },
  { id: 5, label: 'Team',             icon: '👥' },
  { id: 6, label: 'Planning Summary', icon: '📋' },
];

const INDUSTRIES = [
  'Manufacturing', 'Retail', 'Construction', 'Professional Services',
  'Technology', 'Financial Services', 'Property', 'Charity / NFP',
  'Healthcare', 'Hospitality', 'Agriculture', 'Other',
];

const FRAMEWORKS = ['FRS 102', 'FRS 102 (Small Company)', 'FRS 105 (Micro)', 'IFRS', 'UK GAAP (pre-2015)', 'Charity SORP'];

const ENTITY_TYPES = ['Private Limited Company', 'Public Limited Company', 'LLP', 'Partnership', 'Sole Trader', 'Charity', 'Trust', 'Other'];

const RISK_FACTORS = [
  { key: 'first_year',          label: 'First year engagement / opening balances',    weight: 15 },
  { key: 'management_change',   label: 'Key management or ownership change in year',  weight: 10 },
  { key: 'industry_risk',       label: 'High-risk industry',                          weight: 10 },
  { key: 'going_concern',       label: 'Going concern uncertainty',                   weight: 20 },
  { key: 'fraud_risk',          label: 'Prior fraud or irregularity',                 weight: 25 },
  { key: 'complex_transactions', label: 'Complex or unusual transactions',            weight: 15 },
  { key: 'related_parties',     label: 'Significant related party transactions',      weight: 10 },
  { key: 'litigation',          label: 'Litigation or regulatory investigation',       weight: 15 },
  { key: 'prior_year_issues',   label: 'Prior year misstatements or audit issues',    weight: 15 },
  { key: 'volatile_financials', label: 'Volatile or unusual financial results',       weight: 10 },
];

// ─── Initial state ────────────────────────────────────────────────────────

const initialState = {
  // Step 1
  clientName:         '',
  companyReg:         '',
  yearEnd:            '',
  framework:          'FRS 102',
  entityType:         'Private Limited Company',
  industry:           '',
  listedStatus:       false,
  groupStructure:     false,
  // Step 2
  independence:       {},
  ethicsConfirmed:    false,
  conflictsChecked:   false,
  amlComplete:        false,
  engagementAccepted: null,
  // Step 3
  riskFactors:        {},
  riskLevel:          'medium',
  goingConcernFlag:   false,
  fraudRiskFlag:      false,
  // Step 4
  financials:         { revenue: '', totalAssets: '', profitBeforeTax: '', grossProfit: '', equity: '' },
  materiality:        null,
  // Step 5
  team:               [],
  partnerName:        '',
  managerName:        '',
  plannedStart:       '',
  plannedCompletion:  '',
  // Step 6 — generated
  planningNarrative:  '',
};

// ─── Sub-components ───────────────────────────────────────────────────────

function StepIndicator({ currentStep }) { // eslint-disable-line no-unused-vars
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              background: step.id < currentStep ? '#10b981' : step.id === currentStep ? '#3b82f6' : '#e5e7eb',
              color: step.id <= currentStep ? '#fff' : '#6b7280',
              fontWeight: 'bold',
            }}>
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span style={{ fontSize: 11, marginTop: 4, color: step.id === currentStep ? '#3b82f6' : '#6b7280', textAlign: 'center' }}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: step.id < currentStep ? '#10b981' : '#e5e7eb', margin: '0 4px', marginBottom: 16 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FormField({ label, children, required, hint }) { // eslint-disable-line no-unused-vars
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14, color: '#374151' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, background: '#fff' };

// ─── Step 1: Client Details ───────────────────────────────────────────────

function StepClientDetails({ data, onChange }) { // eslint-disable-line no-unused-vars
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Client Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Client / Entity Name" required>
          <input style={inputStyle} value={data.clientName} onChange={e => onChange('clientName', e.target.value)} placeholder="ABC Limited" />
        </FormField>
        <FormField label="Company Registration Number">
          <input style={inputStyle} value={data.companyReg} onChange={e => onChange('companyReg', e.target.value)} placeholder="12345678" />
        </FormField>
        <FormField label="Year End Date" required>
          <input type="date" style={inputStyle} value={data.yearEnd} onChange={e => onChange('yearEnd', e.target.value)} />
        </FormField>
        <FormField label="Industry" required>
          <select style={selectStyle} value={data.industry} onChange={e => onChange('industry', e.target.value)}>
            <option value="">Select industry...</option>
            {INDUSTRIES.map(i => <option key={i} value={i.toLowerCase().replace(/ \/ /g, '_').replace(/ /g, '_')}>{i}</option>)}
          </select>
        </FormField>
        <FormField label="Reporting Framework">
          <select style={selectStyle} value={data.framework} onChange={e => onChange('framework', e.target.value)}>
            {FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
          </select>
        </FormField>
        <FormField label="Entity Type">
          <select style={selectStyle} value={data.entityType} onChange={e => onChange('entityType', e.target.value)}>
            {ENTITY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={data.listedStatus} onChange={e => onChange('listedStatus', e.target.checked)} />
          <span style={{ fontSize: 14 }}>Listed company / AIM</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={data.groupStructure} onChange={e => onChange('groupStructure', e.target.checked)} />
          <span style={{ fontSize: 14 }}>Group structure (ISA 600 applies)</span>
        </label>
      </div>
    </div>
  );
}

// ─── Step 2: Acceptance & Independence ───────────────────────────────────

function StepAcceptance({ data, onChange }) { // eslint-disable-line no-unused-vars
  const checks = [
    { key: 'ethicsConfirmed',    label: 'Ethics and independence confirmed for all team members (ISQM 1 / ISA 220)' },
    { key: 'conflictsChecked',   label: 'Conflicts of interest checked — no prohibited relationships identified' },
    { key: 'amlComplete',        label: 'AML/KYC checks completed — CDD performed and documented (MLR 2017)' },
    { key: 'capacityAssessed',   label: 'Firm has sufficient capacity and competence to accept/continue this engagement' },
    { key: 'feeAgreed',          label: 'Engagement letter and fee arrangement agreed with client' },
    { key: 'priorAuditorContacted', label: 'Previous auditor contacted (if first year engagement) — ISA 510' },
  ];

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Acceptance & Independence Checks</h3>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Complete all applicable checks before proceeding. All mandatory items must be confirmed to accept the engagement.
      </p>
      {checks.map(c => (
        <label key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            style={{ marginTop: 2 }}
            checked={!!data[c.key]}
            onChange={e => onChange(c.key, e.target.checked)}
          />
          <span style={{ fontSize: 14, lineHeight: 1.5 }}>{c.label}</span>
        </label>
      ))}

      <div style={{ marginTop: 20, padding: 16, background: data.ethicsConfirmed && data.conflictsChecked && data.amlComplete ? '#ecfdf5' : '#fef3c7', borderRadius: 8, border: `1px solid ${data.ethicsConfirmed && data.conflictsChecked && data.amlComplete ? '#10b981' : '#f59e0b'}` }}>
        <strong style={{ fontSize: 14 }}>
          {data.ethicsConfirmed && data.conflictsChecked && data.amlComplete
            ? '✓ Mandatory acceptance criteria met — engagement can proceed'
            : '⚠ Complete ethics, conflicts, and AML checks before proceeding'}
        </strong>
      </div>
    </div>
  );
}

// ─── Step 3: Risk Assessment ──────────────────────────────────────────────

function StepRiskAssessment({ data, onChange }) { // eslint-disable-line no-unused-vars
  const totalRiskScore = RISK_FACTORS
    .filter(rf => data.riskFactors?.[rf.key])
    .reduce((s, rf) => s + rf.weight, 0);

  const riskLevel = totalRiskScore >= 40 ? 'high' : totalRiskScore >= 20 ? 'medium' : 'low';
  const riskColour = riskLevel === 'high' ? '#dc2626' : riskLevel === 'medium' ? '#d97706' : '#16a34a';

  React.useEffect(() => {
    onChange('riskLevel', riskLevel);
    onChange('goingConcernFlag', !!data.riskFactors?.going_concern);
    onChange('fraudRiskFlag', !!data.riskFactors?.fraud_risk);
  }, [totalRiskScore]);

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Risk Assessment — ISA 315 (Revised)</h3>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Identify applicable risk factors. The risk level will auto-calculate and flow through to materiality.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {RISK_FACTORS.map(rf => (
          <label key={rf.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: data.riskFactors?.[rf.key] ? '#fef3c7' : '#f9fafb', borderRadius: 6, border: `1px solid ${data.riskFactors?.[rf.key] ? '#f59e0b' : '#e5e7eb'}`, cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ marginTop: 2 }}
              checked={!!data.riskFactors?.[rf.key]}
              onChange={e => onChange('riskFactors', { ...data.riskFactors, [rf.key]: e.target.checked })}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{rf.label}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Weight: +{rf.weight} points</div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ padding: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Risk Score</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: riskColour }}>{totalRiskScore}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Assessed Risk Level</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: riskColour, textTransform: 'uppercase' }}>{riskLevel}</div>
          </div>
        </div>
        {data.riskFactors?.going_concern && (
          <div style={{ marginTop: 12, padding: 8, background: '#fef2f2', borderRadius: 4, fontSize: 13, color: '#dc2626' }}>
            ⚠ Going concern flag raised — ISA 570 assessment required
          </div>
        )}
        {data.riskFactors?.fraud_risk && (
          <div style={{ marginTop: 8, padding: 8, background: '#fef2f2', borderRadius: 4, fontSize: 13, color: '#dc2626' }}>
            ⚠ Fraud risk flag raised — enhanced procedures required per ISA 240
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Materiality ──────────────────────────────────────────────────

function StepMateriality({ data, onChange }) { // eslint-disable-line no-unused-vars
  const handleCalculate = () => {
    const fin = Object.fromEntries(
      Object.entries(data.financials).map(([k, v]) => [k, parseFloat(v) || 0])
    );
    const m = calculateMateriality(fin, data.riskLevel);
    onChange('materiality', m);
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Materiality — ISA 320 / ISA 450</h3>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Enter financial data to auto-calculate materiality. The engine will auto-select the appropriate benchmark.
        Risk level: <strong style={{ color: data.riskLevel === 'high' ? '#dc2626' : data.riskLevel === 'medium' ? '#d97706' : '#16a34a' }}>{(data.riskLevel || 'medium').toUpperCase()}</strong>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { key: 'revenue',         label: 'Revenue (£)' },
          { key: 'totalAssets',     label: 'Total Assets (£)' },
          { key: 'profitBeforeTax', label: 'Profit Before Tax (£)' },
          { key: 'grossProfit',     label: 'Gross Profit (£)' },
          { key: 'equity',          label: 'Equity (£)' },
        ].map(f => (
          <FormField key={f.key} label={f.label}>
            <input
              type="number"
              style={inputStyle}
              value={data.financials?.[f.key] || ''}
              onChange={e => onChange('financials', { ...data.financials, [f.key]: e.target.value })}
              placeholder="0"
            />
          </FormField>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
      >
        Calculate Materiality
      </button>

      {data.materiality && (
        <div style={{ marginTop: 20, padding: 16, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 12px' }}>Materiality Results</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'Overall Materiality', value: `£${data.materiality.overall?.toLocaleString()}`, colour: '#1d4ed8' },
              { label: 'Performance Materiality', value: `£${data.materiality.performanceMateriality?.toLocaleString()}`, colour: '#7c3aed' },
              { label: 'Trivial Threshold', value: `£${data.materiality.trivialThreshold?.toLocaleString()}`, colour: '#6b7280' },
            ].map(m => (
              <div key={m.label} style={{ padding: 12, background: '#fff', borderRadius: 6, border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: m.colour }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#374151' }}>
            <strong>Benchmark:</strong> {data.materiality.benchmark} ({data.materiality.benchmarkPercentage}%)
            <br />
            <strong>Reasoning:</strong> {data.materiality.reasoning}
            <br />
            <strong>ISA Reference:</strong> {data.materiality.isaReference}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Team Assignment ──────────────────────────────────────────────

function StepTeam({ data, onChange }) { // eslint-disable-line no-unused-vars
  const roles = ['Engagement Partner', 'Manager', 'Senior Auditor', 'Junior Auditor', 'EQCR Reviewer', 'Specialist'];

  const addTeamMember = () => onChange('team', [...(data.team || []), { name: '', role: 'Senior Auditor', hours: '', areas: '' }]);
  const updateMember  = (i, field, val) => {
    const t = [...(data.team || [])];
    t[i] = { ...t[i], [field]: val };
    onChange('team', t);
  };
  const removeMember = (i) => onChange('team', (data.team || []).filter((_, idx) => idx !== i));

  // Auto-calculate filing deadlines
  const yearEnd = data.yearEnd ? new Date(data.yearEnd) : null;
  const deadlines = yearEnd ? [
    { label: 'Accounts filing (Companies House — 9 months)', date: new Date(yearEnd.setMonth(yearEnd.getMonth() + 9)) },
    { label: 'CT600 filing (HMRC — 12 months)',              date: new Date(new Date(data.yearEnd).setMonth(new Date(data.yearEnd).getMonth() + 12)) },
    { label: 'Corporation Tax payment (9 months + 1 day)',   date: new Date(new Date(data.yearEnd).setDate(new Date(data.yearEnd).getDate() + 274)) },
  ] : [];

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Team Assignment & Key Dates</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <FormField label="Planned Start">
          <input type="date" style={inputStyle} value={data.plannedStart || ''} onChange={e => onChange('plannedStart', e.target.value)} />
        </FormField>
        <FormField label="Planned Completion">
          <input type="date" style={inputStyle} value={data.plannedCompletion || ''} onChange={e => onChange('plannedCompletion', e.target.value)} />
        </FormField>
        <FormField label="Engagement Partner">
          <input style={inputStyle} value={data.partnerName || ''} onChange={e => onChange('partnerName', e.target.value)} placeholder="Partner name" />
        </FormField>
        <FormField label="Manager">
          <input style={inputStyle} value={data.managerName || ''} onChange={e => onChange('managerName', e.target.value)} placeholder="Manager name" />
        </FormField>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong style={{ fontSize: 14 }}>Audit Team</strong>
          <button onClick={addTeamMember} style={{ padding: '4px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>+ Add Member</button>
        </div>
        {(data.team || []).map((member, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 2fr 36px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input style={inputStyle} value={member.name} onChange={e => updateMember(i, 'name', e.target.value)} placeholder="Name" />
            <select style={selectStyle} value={member.role} onChange={e => updateMember(i, 'role', e.target.value)}>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
            <input type="number" style={inputStyle} value={member.hours} onChange={e => updateMember(i, 'hours', e.target.value)} placeholder="Hours" />
            <input style={inputStyle} value={member.areas} onChange={e => updateMember(i, 'areas', e.target.value)} placeholder="Assigned areas (e.g. Revenue, Debtors)" />
            <button onClick={() => removeMember(i)} style={{ padding: '6px 8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✕</button>
          </div>
        ))}
      </div>

      {deadlines.length > 0 && (
        <div style={{ padding: 12, background: '#fefce8', borderRadius: 8, border: '1px solid #fde047' }}>
          <strong style={{ fontSize: 13 }}>Auto-calculated Deadlines</strong>
          {deadlines.map(d => (
            <div key={d.label} style={{ fontSize: 13, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
              <span>{d.label}</span>
              <strong>{isNaN(d.date) ? '—' : d.date.toLocaleDateString('en-GB')}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 6: Planning Summary ─────────────────────────────────────────────

function StepPlanningSummary({ data }) { // eslint-disable-line no-unused-vars
  const mat = data.materiality;
  const riskFactorNames = RISK_FACTORS
    .filter(rf => data.riskFactors?.[rf.key])
    .map(rf => rf.label);

  const narrative = `
AUDIT PLANNING MEMORANDUM
Client: ${data.clientName || '[Client]'}
Year End: ${data.yearEnd || '[Date]'} | Framework: ${data.framework} | Industry: ${data.industry}

RISK ASSESSMENT
Overall risk level: ${(data.riskLevel || 'medium').toUpperCase()}
${riskFactorNames.length ? 'Risk factors identified:\n' + riskFactorNames.map(r => `• ${r}`).join('\n') : 'No significant risk factors identified beyond standard inherent risk.'}
${data.goingConcernFlag ? '\n⚠ GOING CONCERN: ISA 570 procedures required.' : ''}
${data.fraudRiskFlag ? '\n⚠ FRAUD RISK: Enhanced procedures per ISA 240 required.' : ''}

MATERIALITY
${mat ? `Overall materiality: £${mat.overall?.toLocaleString()}
Performance materiality: £${mat.performanceMateriality?.toLocaleString()} (${mat.pmPercentage?.toFixed(0)}% of overall)
Trivial threshold: £${mat.trivialThreshold?.toLocaleString()} (5% of overall)
Basis: ${mat.benchmark} — ${mat.reasoning}` : '[Materiality not yet calculated]'}

TEAM
Partner: ${data.partnerName || '[TBC]'} | Manager: ${data.managerName || '[TBC]'}
Planned fieldwork: ${data.plannedStart || '[TBC]'} to ${data.plannedCompletion || '[TBC]'}
${(data.team || []).map(m => `${m.role}: ${m.name} (${m.hours || '?'} hours) — ${m.areas}`).join('\n')}

ACCEPTANCE
Ethics/Independence: ${data.ethicsConfirmed ? '✓ Confirmed' : '✗ Not confirmed'}
AML/CDD: ${data.amlComplete ? '✓ Complete' : '✗ Incomplete'}
Conflicts: ${data.conflictsChecked ? '✓ Cleared' : '✗ Not checked'}

Prepared by: [Preparer] | Date: ${new Date().toLocaleDateString('en-GB')} | Engagement ref: [Ref]
  `.trim();

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Planning Summary</h3>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        Review the auto-generated planning memorandum. This will be saved to the engagement file.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Risk Level', value: (data.riskLevel || 'medium').toUpperCase(), colour: data.riskLevel === 'high' ? '#dc2626' : data.riskLevel === 'medium' ? '#d97706' : '#16a34a' },
          { label: 'Overall Materiality', value: mat ? `£${mat.overall?.toLocaleString()}` : 'Not set', colour: '#1d4ed8' },
          { label: 'Team Size', value: `${(data.team || []).length} members`, colour: '#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: s.colour, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <pre style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 400, overflow: 'auto', border: '1px solid #e2e8f0' }}>
        {narrative}
      </pre>
    </div>
  );
}

// ─── Main EngagementWizard ────────────────────────────────────────────────

export default function EngagementWizard({ onComplete, onCancel }) {
  const [step,    setStep]    = useState(1);
  const [formData, setFormData] = useState(initialState);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const canProceed = () => {
    if (step === 1) return formData.clientName && formData.yearEnd && formData.industry;
    if (step === 2) return formData.ethicsConfirmed && formData.conflictsChecked && formData.amlComplete;
    if (step === 4) return !!formData.materiality;
    return true;
  };

  const handleNext = () => { if (step < 6 && canProceed()) setStep(s => s + 1); };
  const handleBack = () => { if (step > 1) setStep(s => s - 1); };

  const handleComplete = () => {
    if (onComplete) onComplete(formData);
  };

  const stepProps = { data: formData, onChange: handleChange };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 860, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#111827' }}>New Audit Engagement</h2>
        {onCancel && <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 20 }}>✕</button>}
      </div>
      <p style={{ marginTop: 4, marginBottom: 20, color: '#6b7280', fontSize: 13 }}>ISA-compliant engagement setup wizard</p>

      <StepIndicator currentStep={step} />

      <div style={{ minHeight: 400 }}>
        {step === 1 && <StepClientDetails   {...stepProps} />}
        {step === 2 && <StepAcceptance      {...stepProps} />}
        {step === 3 && <StepRiskAssessment  {...stepProps} />}
        {step === 4 && <StepMateriality     {...stepProps} />}
        {step === 5 && <StepTeam            {...stepProps} />}
        {step === 6 && <StepPlanningSummary data={formData} />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleBack}
          disabled={step === 1}
          style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: step === 1 ? 'not-allowed' : 'pointer', color: step === 1 ? '#9ca3af' : '#374151', fontWeight: 500 }}
        >
          ← Back
        </button>

        <div style={{ fontSize: 13, color: '#6b7280', alignSelf: 'center' }}>
          Step {step} of {STEPS.length}
        </div>

        {step < 6 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{ padding: '10px 24px', background: canProceed() ? '#3b82f6' : '#93c5fd', color: '#fff', border: 'none', borderRadius: 6, cursor: canProceed() ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            style={{ padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            ✓ Create Engagement
          </button>
        )}
      </div>
    </div>
  );
}
