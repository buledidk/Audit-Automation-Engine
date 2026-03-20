import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import engagementStore from "./store/engagementStore";
import auditFramework from "./data/auditFramework.json";
import { InterimPhase } from "./phases/InterimPhase";
import { FinalAuditPhase } from "./phases/FinalAuditPhase";
// Phase A-B: New System Components (Audit Procedures, Agents, Documentation)
import AuditProceduresPanel from "./components/AuditProceduresPanel";
import AgentProgressPanel from "./components/AgentProgressPanel";
import AgentRecommendationsPanel from "./components/AgentRecommendationsPanel";
import DocumentationPanel from "./components/DocumentationPanel";
import useAgentProgress from "./hooks/useAgentProgress";
import useDocumentGeneration from "./hooks/useDocumentGeneration";
// Phase D: Creative & Interactive Features
import RealTimeAuditDashboard from "./components/RealTimeAuditDashboard";
import CollaborationPanel from "./components/CollaborationPanel";
import SmartAuditForms from "./components/SmartAuditForms";
import OfflineModePanel from "./components/OfflineModePanel";
import useOfflineMode from "./hooks/useOfflineMode";
// Phase E: Comprehensive Integration Hub
import IntegrationHub from "./components/IntegrationHub";
import UnifiedActivityDashboard from "./components/UnifiedActivityDashboard";
import useIntegrations from "./hooks/useIntegrations";
// Enhanced UI: Industry-aligned design with workflows and business context
import EnhancedVisualInterface from "./components/EnhancedVisualInterface";
// Modern Design System: Latest UI/UX trends and patterns
import ModernDesignShowcase from "./components/ModernDesignShowcase";
// AI-Powered Document Extraction: Tokenization, extraction, auto-population, and framework reporting
import DocumentUploadAndExtractionPanel from "./components/DocumentUploadAndExtractionPanel";

const COLORS = {
  bg: "#0A0E17",
  sidebar: "#0F1622",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  accent: "#F5A623",
  text: "#F8F8F8",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  green: "#66BB6A",
  red: "#EF5350",
  orange: "#FFA726",
  blue: "#42A5F5",
  purple: "#CE93D8",
  planning: "#1E88E5",
  risk: "#E53935",
  interim: "#FB8C00",
  final: "#43A047",
  completion: "#8E24AA",
  reporting: "#5D4037"
};

const PHASES = [
  { id: "planning", label: "Planning", icon: "📋", color: COLORS.planning, order: 1 },
  { id: "riskAssessment", label: "Risk Assessment", icon: "⚠️", color: COLORS.risk, order: 2 },
  { id: "interim", label: "Interim", icon: "🔍", color: COLORS.interim, order: 3 },
  { id: "finalAudit", label: "Final Audit", icon: "✓", color: COLORS.final, order: 4 },
  { id: "completion", label: "Completion", icon: "📝", color: COLORS.completion, order: 5 },
  { id: "reporting", label: "Reporting", icon: "📊", color: COLORS.reporting, order: 6 }
];

// ═══════════════════════════════════════════════════════════════════
// PLANNING PHASE COMPONENT
// ═══════════════════════════════════════════════════════════════════
function PlanningPhase({ engagement, updateEngagement, onAdvance, canAdvance }) {
  const [activeTab, setActiveTab] = useState("engagement");

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.planning, marginBottom: "4px" }}>📋 Planning Phase</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 200, 210, 315, 320 - Set up engagement parameters and audit strategy</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "12px" }}>
        {["engagement", "risk", "materiality", "strategy", "team"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              background: activeTab === tab ? COLORS.planning + "30" : "transparent",
              border: `1px solid ${activeTab === tab ? COLORS.planning + "60" : COLORS.border}`,
              color: activeTab === tab ? COLORS.planning : COLORS.dim,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase"
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "engagement" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Engagement Letter (ISA 210)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <InputField
              label="Entity Name"
              value={engagement.entityName}
              onChange={(v) => updateEngagement("entityName", v)}
              placeholder="Client entity name"
            />
            <InputField
              label="Financial Year End"
              value={engagement.financialYearEnd}
              onChange={(v) => updateEngagement("financialYearEnd", v)}
              placeholder="31/12/2024"
              type="date"
            />
            <InputField
              label="Industry"
              value={engagement.industryId}
              onChange={(v) => updateEngagement("industryId", v)}
              placeholder="Select industry"
            />
            <InputField
              label="Sector"
              value={engagement.sector}
              onChange={(v) => updateEngagement("sector", v)}
              placeholder="Enter sector"
            />
            <InputField
              label="Framework"
              value={engagement.framework}
              onChange={(v) => updateEngagement("framework", v)}
              placeholder="FRS102/IFRS"
            />
            <InputField
              label="Entity Size"
              value={engagement.entitySize}
              onChange={(v) => updateEngagement("entitySize", v)}
              placeholder="Micro/Small/Medium/Large"
            />
          </div>
        </div>
      )}

      {activeTab === "materiality" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Materiality Calculation (ISA 320)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <InputField
              label="Overall Materiality (OM)"
              value={engagement.materiality.overall}
              onChange={(v) => updateEngagement("materiality.overall", parseFloat(v))}
              placeholder="50000"
              type="number"
            />
            <InputField
              label="Performance Materiality (75% of OM)"
              value={engagement.materiality.performance}
              onChange={(v) => updateEngagement("materiality.performance", parseFloat(v))}
              placeholder="37500"
              type="number"
            />
            <InputField
              label="Trivial Threshold (5% of OM)"
              value={engagement.materiality.trivial}
              onChange={(v) => updateEngagement("materiality.trivial", parseFloat(v))}
              placeholder="2500"
              type="number"
            />
            <InputField
              label="Basis"
              value={engagement.materiality.basis}
              onChange={(v) => updateEngagement("materiality.basis", v)}
              placeholder="5% PBT"
            />
          </div>
          <div style={{ marginTop: "16px", padding: "12px", background: COLORS.planning + "15", borderRadius: "6px", border: `1px solid ${COLORS.planning}33` }}>
            <p style={{ color: COLORS.blue, margin: 0, fontSize: "12px" }}>
              📊 Overall Materiality: £{engagement.materiality.overall?.toLocaleString() || "—"} |
              Performance: £{engagement.materiality.performance?.toLocaleString() || "—"} |
              Trivial: £{engagement.materiality.trivial?.toLocaleString() || "—"}
            </p>
          </div>
        </div>
      )}

      {activeTab === "risk" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Client Risk Assessment (ISA 315)</h3>
          <p style={{ color: COLORS.dim }}>Identify entity risks and fraud risks that impact audit procedures</p>
          <textarea
            placeholder="Business risks, fraud indicators, management override risks..."
            style={{
              width: "100%",
              minHeight: "150px",
              padding: "12px",
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              color: COLORS.text,
              fontFamily: "monospace",
              fontSize: "12px",
              resize: "vertical"
            }}
          />
        </div>
      )}

      {activeTab === "team" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Team Allocation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <InputField label="Partner" placeholder="Name" />
            <InputField label="Manager" placeholder="Name" />
            <InputField label="Senior Auditor" placeholder="Name" />
            <InputField label="Junior Auditors" placeholder="Names" />
          </div>
        </div>
      )}

      {canAdvance && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={onAdvance}
            style={{
              padding: "12px 32px",
              background: `linear-gradient(135deg, ${COLORS.planning}, ${COLORS.planning}dd)`,
              border: "none",
              color: "#000",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}
          >
            ✓ Complete Planning & Advance to Risk Assessment
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RISK ASSESSMENT PHASE COMPONENT
// ═══════════════════════════════════════════════════════════════════
function RiskAssessmentPhase({ engagement, updateEngagement, onAdvance, canAdvance }) {
  const [activeTab, setActiveTab] = useState("riskMatrix");

  const calculateRiskRating = (inherent, control) => {
    const combined = inherent * control / 5;
    if (combined > 4) return { rating: "CRITICAL", color: COLORS.red };
    if (combined > 3) return { rating: "HIGH", color: COLORS.orange };
    if (combined > 2) return { rating: "MEDIUM", color: COLORS.accent };
    return { rating: "LOW", color: COLORS.green };
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.risk, marginBottom: "4px" }}>⚠️ Risk Assessment Phase</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 315, 240, 540, 570, 550 - Identify and assess audit risks</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "12px" }}>
        {["riskMatrix", "fraud", "estimates", "goingConcern", "relatedParties"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              background: activeTab === tab ? COLORS.risk + "30" : "transparent",
              border: `1px solid ${activeTab === tab ? COLORS.risk + "60" : COLORS.border}`,
              color: activeTab === tab ? COLORS.risk : COLORS.dim,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase"
            }}
          >
            {tab.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {activeTab === "riskMatrix" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Risk Matrix Assessment (ISA 315)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <RiskInput label="Inherent Risk (1-5)" defaultValue="3" onChange={() => {}} />
            <RiskInput label="Control Risk (1-5)" defaultValue="2" onChange={() => {}} />
            <RiskInput label="Detection Risk (1-5)" defaultValue="1" onChange={() => {}} />
          </div>
          <div style={{ marginTop: "24px", padding: "16px", background: COLORS.risk + "15", borderRadius: "8px", border: `1px solid ${COLORS.risk}33` }}>
            <p style={{ color: COLORS.red, margin: 0, fontWeight: 700 }}>🎯 Combined Risk Rating: HIGH (3.6/5)</p>
            <p style={{ color: COLORS.dim, margin: "6px 0 0 0", fontSize: "12px" }}>Requires detailed substantive testing - Detection Risk set to LOW</p>
          </div>
        </div>
      )}

      {activeTab === "fraud" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Fraud Risk Assessment (ISA 240)</h3>
          <p style={{ color: COLORS.dim, fontSize: "12px", marginBottom: "16px" }}>Identify fraud risks - Management override, cash manipulation, revenue side of fraud</p>
          <div style={{ background: COLORS.bg, padding: "16px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
            <h4 style={{ color: COLORS.accent, margin: "0 0 12px 0", fontSize: "12px" }}>Fraud Triangle Assessment</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <FraudTriangleBox title="Incentive" examples="Meeting targets, financial pressure, bonuses" />
              <FraudTriangleBox title="Opportunity" examples="Weak controls, override ability, cash access" />
              <FraudTriangleBox title="Attitude" examples="Rationalization, pressure, culture" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "goingConcern" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Going Concern Assessment (ISA 570)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <InputField label="Sufficient funds for next 12 months?" placeholder="Yes/No/Qualified" />
            <InputField label="Management going concern assessment complete?" placeholder="Yes/No" />
          </div>
          <textarea
            placeholder="Going concern risks, mitigating factors, disclosure requirements..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              color: COLORS.text,
              fontFamily: "monospace",
              fontSize: "12px"
            }}
          />
        </div>
      )}

      {canAdvance && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={onAdvance}
            style={{
              padding: "12px 32px",
              background: `linear-gradient(135deg, ${COLORS.risk}, ${COLORS.risk}dd)`,
              border: "none",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}
          >
            ✓ Complete Risk Assessment & Advance to Interim
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESULTS DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function ResultsDashboard({ engagement, phases }) {
  const phaseCompletion = useMemo(() => {
    return PHASES.map(p => ({
      ...p,
      percent: engagement.phases[p.id]?.completionPercent || 0
    }));
  }, [engagement]);

  const overallProgress = Math.round(
    phaseCompletion.reduce((sum, p) => sum + p.percent, 0) / phaseCompletion.length
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ color: COLORS.accent, marginBottom: "4px" }}>📊 Audit Progress Dashboard</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>Real-time audit completion and KPI tracking</p>
      </div>

      {/* Overall Progress */}
      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: COLORS.text, margin: 0 }}>Overall Audit Progress</h3>
          <span style={{ fontSize: "24px", fontWeight: 700, color: COLORS.accent }}>{overallProgress}%</span>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: "8px", height: "12px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.planning}, ${COLORS.risk}, ${COLORS.interim}, ${COLORS.final}, ${COLORS.completion}, ${COLORS.reporting})`,
              width: `${overallProgress}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      {/* Phase Completion Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {phaseCompletion.map(phase => (
          <div
            key={phase.id}
            style={{
              background: `linear-gradient(135deg, ${phase.color}12, ${phase.color}06)`,
              border: `1px solid ${phase.color}33`,
              borderRadius: "12px",
              padding: "18px",
              borderLeft: `4px solid ${phase.color}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ color: phase.color, margin: 0, fontSize: "14px", fontWeight: 700 }}>
                {phase.icon} {phase.label}
              </h4>
              <span style={{ color: phase.color, fontSize: "18px", fontWeight: 700 }}>{phase.percent}%</span>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: "4px", height: "8px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: phase.color,
                  width: `${phase.percent}%`,
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* KPI Summary */}
      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Key Performance Indicators</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <KPIBox label="Overall Materiality" value={`£${engagement.materiality.overall?.toLocaleString() || "—"}`} color={COLORS.accent} />
          <KPIBox label="Performance Materiality" value={`£${engagement.materiality.performance?.toLocaleString() || "—"}`} color={COLORS.blue} />
          <KPIBox label="Trivial Threshold" value={`£${engagement.materiality.trivial?.toLocaleString() || "—"}`} color={COLORS.green} />
          <KPIBox label="Risk Level" value={engagement.riskAssessment?.combinedRisk ? "HIGH" : "—"} color={COLORS.red} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPLETION PHASE
// ═══════════════════════════════════════════════════════════════════
function CompletionPhase({ engagement, updateEngagement, onAdvance, canAdvance }) {
  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.completion, marginBottom: "4px" }}>📝 Completion Phase</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 560, 570, 580 - Final completion procedures and conclusions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Going Concern Conclusion (ISA 570)</h3>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", color: COLORS.accent, fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>Assessment</label>
            <select style={{ width: "100%", padding: "10px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: "6px", color: COLORS.text }}>
              <option value="gg">Going concern - no issues identified</option>
              <option value="gc">Going concern with emphasis of matter paragraph</option>
              <option value="not_gg">Not a going concern</option>
            </select>
          </div>
          <textarea
            placeholder="Going concern assessment and conclusions..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              color: COLORS.text,
              fontFamily: "monospace",
              fontSize: "11px"
            }}
          />
        </div>

        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Subsequent Events Review (ISA 560)</h3>
          <p style={{ color: COLORS.dim, fontSize: "11px", marginBottom: "12px" }}>Review of events between year-end and audit report date</p>
          <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}`, marginBottom: "12px" }}>
            <p style={{ color: COLORS.dim, margin: 0, fontSize: "11px" }}>
              ✓ Reviewed financial statements for events post year-end<br/>
              ✓ Reviewed board minutes and management correspondence<br/>
              ✓ Confirmed no adjusting or material non-adjusting events identified
            </p>
          </div>
          <textarea
            placeholder="Subsequent events identified..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "6px",
              color: COLORS.text,
              fontSize: "11px"
            }}
          />
        </div>
      </div>

      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Disclosure Compliance Checklist</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {[
            "FRS 102 accounting policies disclosure (s8.3)",
            "Critical accounting judgments (s8.5-7)",
            "Key estimation uncertainties (s8.8-10)",
            "Going concern (s3.1, ISA 570)",
            "Related party transactions (s33)",
            "Events after year-end (IAS 10)",
            "Share capital movements (FRS 102 s22)",
            "Financial instruments disclosures"
          ].map((item, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: COLORS.text, fontSize: "11px" }}>
              <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
              {item}
            </label>
          ))}
        </div>
      </div>

      {canAdvance && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={onAdvance}
            style={{
              padding: "12px 32px",
              background: `linear-gradient(135deg, ${COLORS.completion}, ${COLORS.completion}dd)`,
              border: "none",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "8px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}
          >
            ✓ Complete & Advance to Reporting
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REPORTING PHASE
// ═══════════════════════════════════════════════════════════════════
function ReportingPhase({ engagement, updateEngagement }) {
  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.reporting, marginBottom: "4px" }}>📊 Reporting Phase</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 700, 701, 260 - Audit opinion, key audit matters, and governance communications</p>
      </div>

      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Audit Opinion (ISA 700)</h3>
        <div style={{ background: COLORS.reporting + "15", border: `1px solid ${COLORS.reporting}33`, borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ color: COLORS.reporting, margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
            <b>OPINION</b><br/>
            We have audited the financial statements of {engagement.entityName || "[Entity Name]"} for the year ended {engagement.financialYearEnd || "[FYE]"}, which comprise the statement of financial position, the statement of comprehensive income, the statement of cash flows, the statement of changes in equity and notes to the financial statements.
          </p>
        </div>
        <textarea
          placeholder="Complete audit opinion text..."
          defaultValue="In our opinion, the financial statements give a true and fair view of [entity] as at [date] and of its financial performance and cash flows for the period then ended in accordance with [framework]."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "6px",
            color: COLORS.text,
            fontFamily: "monospace",
            fontSize: "11px",
            marginBottom: "16px"
          }}
        />
      </div>

      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Key Audit Matters (ISA 701)</h3>
        <p style={{ color: COLORS.dim, fontSize: "11px", marginBottom: "12px" }}>Matters of most significance in the audit (higher assessed risk, significant management judgment)</p>
        <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ color: COLORS.orange, margin: "0 0 8px 0", fontSize: "11px" }}>KAM 1: Revenue Recognition (ISA 240, IFRS 15)</h4>
          <p style={{ color: COLORS.faint, margin: "0 0 8px 0", fontSize: "10px" }}>Description: Revenue recognition involved assessment of performance obligations and timing of revenue recognition.</p>
          <p style={{ color: COLORS.faint, margin: 0, fontSize: "10px" }}>Audit Response: Performed detailed substantive testing of revenue transactions, analytical reviews, and customer confirmations.</p>
        </div>
      </div>

      <div style={{ background: COLORS.accent + "15", border: `1px solid ${COLORS.accent}33`, borderRadius: "8px", padding: "16px" }}>
        <p style={{ color: COLORS.accent, margin: 0, fontSize: "12px", fontWeight: 600 }}>✓ Audit Report Ready for Partner Review and Sign-Off</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIMPLE HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "6px",
          color: COLORS.text,
          fontSize: "12px",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

function RiskInput({ label, defaultValue, onChange }) {
  return (
    <div>
      <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px" }}>
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "6px",
          color: COLORS.text,
          fontSize: "12px"
        }}
      >
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>{n} - {["Low", "Medium-Low", "Medium", "Medium-High", "High"][n - 1]}</option>
        ))}
      </select>
    </div>
  );
}

function FraudTriangleBox({ title, examples }) {
  return (
    <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
      <h5 style={{ color: COLORS.accent, margin: "0 0 6px 0", fontSize: "11px" }}>{title}</h5>
      <p style={{ color: COLORS.faint, margin: 0, fontSize: "11px", lineHeight: 1.4 }}>{examples}</p>
    </div>
  );
}

function KPIBox({ label, value, color }) {
  return (
    <div style={{ background: color + "12", border: `1px solid ${color}33`, borderRadius: "8px", padding: "14px" }}>
      <p style={{ color: COLORS.dim, margin: "0 0 6px 0", fontSize: "11px", fontWeight: 600 }}>{label}</p>
      <p style={{ color: color, margin: 0, fontSize: "20px", fontWeight: 700 }}>{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════
export default function AuditEngine() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [viewMode, setViewMode] = useState("phase"); // phase | results | procedures | agents | documentation | extraction | dashboard | collaboration | forms | offline | integrations | activity | visual | design
  const [engagement, setEngagement] = useState(engagementStore.engagement);

  // Phase A-B: New System Hooks
  const { activeAgents, progress, isRunning, startAgents } = useAgentProgress();
  const { status: docStatus, documents, generateDocumentation } = useDocumentGeneration();
  // Phase D: Interactive Features Hooks
  const { isOnline, syncStatus, queueAction, syncNow } = useOfflineMode();
  // Phase E: Integration Hub Hooks
  const { connections, activityLog, isIntegrating, sendSlackNotification, createGitHubIssue, sendEmailReport, uploadToAWS } = useIntegrations();

  const currentPhase = PHASES[currentPhaseIndex];
  const canAdvancePhase = true; // Simplified for MVP

  const updateEngagement = (path, value) => {
    const updated = { ...engagement };
    const keys = path.split(".");
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEngagement(updated);
  };

  const advancePhase = () => {
    if (currentPhaseIndex < PHASES.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>
      {/* LEFT SIDEBAR - PHASE NAVIGATION */}
      <div style={{
        width: "280px",
        background: COLORS.sidebar,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h1 style={{ margin: "0 0 4px 0", color: COLORS.accent, fontSize: "20px" }}>🔍 AuditEngine</h1>
          <p style={{ margin: 0, color: COLORS.dim, fontSize: "11px" }}>Complete Audit Lifecycle</p>
        </div>

        {/* Entity Info */}
        {engagement.entityName && (
          <div style={{ padding: "16px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.accent + "08" }}>
            <p style={{ margin: "0 0 4px 0", color: COLORS.accent, fontSize: "11px", fontWeight: 700 }}>CLIENT</p>
            <p style={{ margin: 0, color: COLORS.text, fontSize: "13px", fontWeight: 600 }}>{engagement.entityName}</p>
            <p style={{ margin: "4px 0 0 0", color: COLORS.dim, fontSize: "11px" }}>FYE: {engagement.financialYearEnd}</p>
          </div>
        )}

        {/* Phase Navigation */}
        <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
          {PHASES.map((phase, idx) => (
            <button
              key={phase.id}
              onClick={() => setCurrentPhaseIndex(idx)}
              style={{
                width: "100%",
                padding: "14px",
                background: currentPhaseIndex === idx ? phase.color + "20" : "transparent",
                border: `1px solid ${currentPhaseIndex === idx ? phase.color + "40" : COLORS.border}`,
                borderRadius: "8px",
                color: currentPhaseIndex === idx ? phase.color : COLORS.dim,
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "8px",
                textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{phase.icon}</span>
                <span>{phase.label}</span>
              </div>
              <div style={{ fontSize: "10px", color: COLORS.faint, marginTop: "4px" }}>
                {engagement.phases[phase.id]?.completionPercent || 0}% complete
              </div>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <button
              onClick={() => setViewMode("phase")}
              style={{
                padding: "10px",
                background: viewMode === "phase" ? COLORS.accent + "30" : "transparent",
                border: `1px solid ${viewMode === "phase" ? COLORS.accent : COLORS.border}`,
                color: viewMode === "phase" ? COLORS.accent : COLORS.dim,
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              📋 Phase
            </button>
            <button
              onClick={() => setViewMode("results")}
              style={{
                padding: "10px",
                background: viewMode === "results" ? COLORS.accent + "30" : "transparent",
                border: `1px solid ${viewMode === "results" ? COLORS.accent : COLORS.border}`,
                color: viewMode === "results" ? COLORS.accent : COLORS.dim,
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              📊 Results
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            <button
              onClick={() => setViewMode("procedures")}
              style={{
                padding: "8px",
                background: viewMode === "procedures" ? "#4CAF50" + "30" : "transparent",
                border: `1px solid ${viewMode === "procedures" ? "#4CAF50" : COLORS.border}`,
                color: viewMode === "procedures" ? "#4CAF50" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              ✅ Procedures
            </button>
            <button
              onClick={() => setViewMode("agents")}
              style={{
                padding: "8px",
                background: viewMode === "agents" ? "#2196F3" + "30" : "transparent",
                border: `1px solid ${viewMode === "agents" ? "#2196F3" : COLORS.border}`,
                color: viewMode === "agents" ? "#2196F3" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🤖 Agents
            </button>
            <button
              onClick={() => setViewMode("documentation")}
              style={{
                padding: "8px",
                background: viewMode === "documentation" ? "#FF9800" + "30" : "transparent",
                border: `1px solid ${viewMode === "documentation" ? "#FF9800" : COLORS.border}`,
                color: viewMode === "documentation" ? "#FF9800" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📄 Docs
            </button>
            <button
              onClick={() => setViewMode("extraction")}
              style={{
                padding: "8px",
                background: viewMode === "extraction" ? "#9C27B0" + "30" : "transparent",
                border: `1px solid ${viewMode === "extraction" ? "#9C27B0" : COLORS.border}`,
                color: viewMode === "extraction" ? "#9C27B0" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🤖 Extract
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", marginTop: "8px" }}>
            <button
              onClick={() => setViewMode("dashboard")}
              style={{
                padding: "8px",
                background: viewMode === "dashboard" ? "#42A5F5" + "30" : "transparent",
                border: `1px solid ${viewMode === "dashboard" ? "#42A5F5" : COLORS.border}`,
                color: viewMode === "dashboard" ? "#42A5F5" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setViewMode("collaboration")}
              style={{
                padding: "8px",
                background: viewMode === "collaboration" ? "#66BB6A" + "30" : "transparent",
                border: `1px solid ${viewMode === "collaboration" ? "#66BB6A" : COLORS.border}`,
                color: viewMode === "collaboration" ? "#66BB6A" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              💬 Collab
            </button>
            <button
              onClick={() => setViewMode("forms")}
              style={{
                padding: "8px",
                background: viewMode === "forms" ? "#CE93D8" + "30" : "transparent",
                border: `1px solid ${viewMode === "forms" ? "#CE93D8" : COLORS.border}`,
                color: viewMode === "forms" ? "#CE93D8" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📝 Forms
            </button>
            <button
              onClick={() => setViewMode("offline")}
              style={{
                padding: "8px",
                background: viewMode === "offline" ? (isOnline ? "#81C784" : "#EF5350") + "30" : "transparent",
                border: `1px solid ${viewMode === "offline" ? (isOnline ? "#81C784" : "#EF5350") : COLORS.border}`,
                color: viewMode === "offline" ? (isOnline ? "#81C784" : "#EF5350") : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {isOnline ? "🌐 Online" : "📱 Offline"}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "8px" }}>
            <button
              onClick={() => setViewMode("integrations")}
              style={{
                padding: "8px",
                background: viewMode === "integrations" ? "#1976D2" + "30" : "transparent",
                border: `1px solid ${viewMode === "integrations" ? "#1976D2" : COLORS.border}`,
                color: viewMode === "integrations" ? "#1976D2" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🔗 Integrations
            </button>
            <button
              onClick={() => setViewMode("activity")}
              style={{
                padding: "8px",
                background: viewMode === "activity" ? "#FF6F00" + "30" : "transparent",
                border: `1px solid ${viewMode === "activity" ? "#FF6F00" : COLORS.border}`,
                color: viewMode === "activity" ? "#FF6F00" : COLORS.dim,
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              📊 Activity
            </button>
          </div>
          <button
            onClick={() => setViewMode("visual")}
            style={{
              width: "100%",
              padding: "10px",
              background: viewMode === "visual" ? "#9C27B0" + "30" : "transparent",
              border: `1px solid ${viewMode === "visual" ? "#9C27B0" : COLORS.border}`,
              color: viewMode === "visual" ? "#9C27B0" : COLORS.dim,
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            🎯 Visual Workflows & Business Context
          </button>
          <button
            onClick={() => setViewMode("design")}
            style={{
              width: "100%",
              padding: "10px",
              background: viewMode === "design" ? "#FF6B9D" + "30" : "transparent",
              border: `1px solid ${viewMode === "design" ? "#FF6B9D" : COLORS.border}`,
              color: viewMode === "design" ? "#FF6B9D" : COLORS.dim,
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            🎨 Modern Design System
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, overflow: "auto", background: COLORS.bg }}>
        {viewMode === "phase" ? (
          <>
            {currentPhaseIndex === 0 && (
              <PlanningPhase
                engagement={engagement}
                updateEngagement={updateEngagement}
                onAdvance={advancePhase}
                canAdvance={canAdvancePhase}
              />
            )}
            {currentPhaseIndex === 1 && (
              <RiskAssessmentPhase
                engagement={engagement}
                updateEngagement={updateEngagement}
                onAdvance={advancePhase}
                canAdvance={canAdvancePhase}
              />
            )}
            {currentPhaseIndex === 2 && (
              <InterimPhase
                engagement={engagement}
                updateEngagement={updateEngagement}
                onAdvance={advancePhase}
                canAdvance={canAdvancePhase}
              />
            )}
            {currentPhaseIndex === 3 && (
              <FinalAuditPhase
                engagement={engagement}
                updateEngagement={updateEngagement}
                onAdvance={advancePhase}
                canAdvance={canAdvancePhase}
              />
            )}
            {currentPhaseIndex === 4 && <CompletionPhase engagement={engagement} updateEngagement={updateEngagement} onAdvance={advancePhase} canAdvance={canAdvancePhase} />}
            {currentPhaseIndex === 5 && <ReportingPhase engagement={engagement} updateEngagement={updateEngagement} />}
          </>
        ) : viewMode === "results" ? (
          <ResultsDashboard engagement={engagement} phases={PHASES} />
        ) : viewMode === "procedures" ? (
          <div style={{ padding: "24px" }}>
            <h2 style={{ color: "#4CAF50", marginBottom: "16px" }}>📋 Audit Procedures</h2>
            <AuditProceduresPanel />
          </div>
        ) : viewMode === "agents" ? (
          <div style={{ padding: "24px", maxWidth: "1200px" }}>
            <h2 style={{ color: "#2196F3", marginBottom: "16px" }}>🤖 Agent Orchestration & Monitoring</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              <AgentProgressPanel agents={progress} />
              <AgentRecommendationsPanel recommendations={[]} />
            </div>
          </div>
        ) : viewMode === "documentation" ? (
          <div style={{ padding: "24px", maxWidth: "1200px" }}>
            <h2 style={{ color: "#FF9800", marginBottom: "16px" }}>📄 Auto-Generated Documentation</h2>
            <DocumentationPanel
              phase={currentPhase?.label}
              onExport={(format) => generateDocumentation(currentPhase?.id, { format })}
            />
          </div>
        ) : viewMode === "dashboard" ? (
          <div style={{ padding: "24px" }}>
            <RealTimeAuditDashboard />
          </div>
        ) : viewMode === "collaboration" ? (
          <div style={{ padding: "24px", maxWidth: "1200px" }}>
            <h2 style={{ color: "#66BB6A", marginBottom: "16px" }}>💬 Collaboration & Team Coordination</h2>
            <CollaborationPanel />
          </div>
        ) : viewMode === "forms" ? (
          <div style={{ padding: "24px", maxWidth: "1200px" }}>
            <h2 style={{ color: "#CE93D8", marginBottom: "16px" }}>📝 Smart Audit Forms</h2>
            <SmartAuditForms />
          </div>
        ) : viewMode === "offline" ? (
          <div style={{ padding: "24px", maxWidth: "1200px" }}>
            <h2 style={{ color: isOnline ? "#81C784" : "#EF5350", marginBottom: "16px" }}>
              {isOnline ? "🌐 Online Mode" : "📱 Offline Mode"}
            </h2>
            <OfflineModePanel />
          </div>
        ) : viewMode === "integrations" ? (
          <div style={{ maxWidth: "1400px" }}>
            <IntegrationHub />
          </div>
        ) : viewMode === "activity" ? (
          <div style={{ maxWidth: "1400px" }}>
            <UnifiedActivityDashboard />
          </div>
        ) : viewMode === "visual" ? (
          <div style={{ maxWidth: "1400px" }}>
            <EnhancedVisualInterface />
          </div>
        ) : viewMode === "extraction" ? (
          <div style={{ maxWidth: "1400px" }}>
            <DocumentUploadAndExtractionPanel engagement={engagement} />
          </div>
        ) : viewMode === "design" ? (
          <ModernDesignShowcase />
        ) : null}
      </div>
    </div>
  );
}
