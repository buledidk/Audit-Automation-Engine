import React from "react";

const COLORS = {
  final: "#43A047",
  bg: "#0A0E17",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#F8F8F8",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  green: "#66BB6A",
  orange: "#FFA726"
};

// FSLI (Financial Statement Line Items) definitions
const FSLI_AREAS = [
  { ref: "C1", label: "Trial Balance & Lead Schedules", isa: "ISA 500", description: "TB reconciliation and financial statement link" },
  { ref: "D3", label: "Revenue & Receivables", isa: "ISA 500, 240, 501, 505", description: "Revenue recognition, AR aging, confirmations" },
  { ref: "D4", label: "Inventory & WIP", isa: "ISA 501", description: "Inventory attendance, NRV, cost allocation" },
  { ref: "D5", label: "Fixed Assets & Leases", isa: "ISA 500, 540", description: "Additions, depreciation, impairment, lease classification" },
  { ref: "D6", label: "Payables & Accruals", isa: "ISA 500, 501", description: "Payables confirmation, cut-off, accrual testing" },
  { ref: "D7", label: "Loans & Covenants", isa: "ISA 500, 505", description: "Loan confirmations, covenant compliance" },
  { ref: "D8", label: "Tax & Deferred Tax", isa: "ISA 500, 540", description: "Tax provision, deferred tax, losses" },
  { ref: "D9", label: "Provisions & Contingencies", isa: "ISA 540", description: "Legal claims, warranty, onerous contracts" },
  { ref: "D10", label: "Equity", isa: "ISA 500", description: "Share capital, movements, dividend testing" },
  { ref: "D11", label: "Cash & Equivalents", isa: "ISA 500, 505", description: "Bank confirmations, reconciliations" },
  { ref: "D12", label: "Journal Entries & Consolidation", isa: "ISA 500, 240", description: "JE testing, consolidation, intercompany" },
  { ref: "D13", label: "Post-Balance Sheet Events", isa: "ISA 560", description: "Post year-end events" },
  { ref: "D14", label: "Related Party Transactions", isa: "ISA 550", description: "Related party testing, disclosures" }
];

// ═══════════════════════════════════════════════════════════════════
// FINAL AUDIT PHASE - SUBSTANTIVE PROCEDURES & FSLI TESTING
// ISA 330 - Substantive Testing of Details
// ═══════════════════════════════════════════════════════════════════
export function FinalAuditPhase({ engagement, updateEngagement, onAdvance, canAdvance }) {
  const [activeFSLI, setActiveFSLI] = React.useState("C1");
  const [fsliStatus, setFsliStatus] = React.useState({
    "C1": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D3": { status: "in_progress", testedItems: 45, totalItems: 120, exceptions: 1, complete: false },
    "D4": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D5": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D6": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D7": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D8": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D9": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D10": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D11": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D12": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D13": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false },
    "D14": { status: "pending", testedItems: 0, totalItems: 0, exceptions: 0, complete: false }
  });

  const currentFSLI = FSLI_AREAS.find(f => f.ref === activeFSLI);
  const currentStatus = fsliStatus[activeFSLI];

  const completedFSLI = Object.values(fsliStatus).filter(s => s.complete).length;
  const overallProgress = Math.round((completedFSLI / FSLI_AREAS.length) * 100);

  const testingProcedures = {
    "D3": [
      { id: "D3.1", procedure: "Test revenue recognition policy and compliance with IFRS 15", assertion: "Completeness, Accuracy, Cutoff" },
      { id: "D3.2", procedure: "Analytical review: revenue trends by product/customer", assertion: "Reasonableness" },
      { id: "D3.3", procedure: "Sample testing of revenue transactions ±10 days year-end", assertion: "Cutoff, Existence, Accuracy" },
      { id: "D3.4", procedure: "AR aging analysis and collectibility assessment", assertion: "Valuation" },
      { id: "D3.5", procedure: "AR confirmations (positive and negative)", assertion: "Existence, Accuracy" }
    ],
    "D4": [
      { id: "D4.1", procedure: "Attend inventory count", assertion: "Existence, Completeness" },
      { id: "D4.2", procedure: "Test inventory cost build-up (materials, labor, overhead)", assertion: "Valuation" },
      { id: "D4.3", procedure: "NRV testing to post year-end selling prices", assertion: "Valuation" },
      { id: "D4.4", procedure: "Slow-moving and obsolete stock analysis", assertion: "Valuation" }
    ]
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.final, marginBottom: "4px" }}>✓ Final Audit Phase - Substantive Testing</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 330 - Detailed substantive procedures & FSLI testing across 11 financial statement areas</p>
      </div>

      {/* Overall Progress */}
      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "18px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ color: COLORS.text, margin: 0 }}>FSLI Testing Completion</h3>
          <span style={{ color: COLORS.final, fontSize: "20px", fontWeight: 700 }}>{overallProgress}%</span>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: "8px", height: "12px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: COLORS.final, width: `${overallProgress}%`, transition: "width 0.3s" }} />
        </div>
        <p style={{ color: COLORS.dim, margin: "12px 0 0 0", fontSize: "11px" }}>
          {completedFSLI} of {FSLI_AREAS.length} FSLI areas complete
        </p>
      </div>

      {/* FSLI Menu */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {FSLI_AREAS.map(area => {
          const status = fsliStatus[area.ref];
          const statusColor = status.complete ? COLORS.green : status.status === "in_progress" ? COLORS.orange : COLORS.dim;
          return (
            <button
              key={area.ref}
              onClick={() => setActiveFSLI(area.ref)}
              style={{
                padding: "14px",
                background: activeFSLI === area.ref ? COLORS.final + "20" : COLORS.card,
                border: `1px solid ${activeFSLI === area.ref ? COLORS.final + "40" : COLORS.border}`,
                borderRadius: "8px",
                color: activeFSLI === area.ref ? COLORS.final : COLORS.text,
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              <div>{area.ref}</div>
              <div style={{ fontSize: "10px", color: statusColor, marginTop: "4px" }}>
                {status.complete ? "✓ Complete" : status.status === "in_progress" ? "→ In Progress" : "○ Pending"}
              </div>
            </button>
          );
        })}
      </div>

      {/* FSLI Detail */}
      {currentFSLI && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>
            {currentFSLI.ref} - {currentFSLI.label}
          </h3>
          <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "11px" }}>ISA: {currentFSLI.isa}</p>
          <p style={{ color: COLORS.faint, margin: "0 0 16px 0", fontSize: "12px" }}>{currentFSLI.description}</p>

          {/* Status Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "10px" }}>Tested Items</p>
              <p style={{ color: COLORS.orange, margin: 0, fontSize: "16px", fontWeight: 700 }}>
                {currentStatus.testedItems}/{currentStatus.totalItems}
              </p>
            </div>
            <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "10px" }}>Exceptions Found</p>
              <p style={{ color: currentStatus.exceptions > 0 ? COLORS.orange : COLORS.green, margin: 0, fontSize: "16px", fontWeight: 700 }}>
                {currentStatus.exceptions}
              </p>
            </div>
            <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "10px" }}>Status</p>
              <p style={{ color: COLORS.final, margin: 0, fontSize: "13px", fontWeight: 700, textTransform: "capitalize" }}>
                {currentStatus.status}
              </p>
            </div>
            <div style={{ background: COLORS.bg, padding: "12px", borderRadius: "6px", border: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.dim, margin: "0 0 4px 0", fontSize: "10px" }}>Completion</p>
              <button
                onClick={() => setFsliStatus(prev => ({ ...prev, [activeFSLI]: { ...prev[activeFSLI], complete: !prev[activeFSLI].complete } }))}
                style={{
                  padding: "4px 8px",
                  background: currentStatus.complete ? COLORS.green + "20" : "transparent",
                  border: `1px solid ${currentStatus.complete ? COLORS.green : COLORS.border}`,
                  color: currentStatus.complete ? COLORS.green : COLORS.dim,
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {currentStatus.complete ? "✓ Complete" : "Mark Complete"}
              </button>
            </div>
          </div>

          {/* Testing Procedures */}
          {testingProcedures[activeFSLI] && (
            <div>
              <h4 style={{ color: COLORS.text, margin: "16px 0 12px 0" }}>Testing Procedures</h4>
              <div style={{ background: COLORS.bg, borderRadius: "8px", border: `1px solid ${COLORS.border}`, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Proc ID</th>
                      <th style={{ textAlign: "left", padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Procedure</th>
                      <th style={{ textAlign: "left", padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Assertion(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testingProcedures[activeFSLI].map(proc => (
                      <tr key={proc.id}>
                        <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text }}>{proc.id}</td>
                        <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim }}>{proc.procedure}</td>
                        <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.faint, fontSize: "10px" }}>{proc.assertion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
        <h4 style={{ color: COLORS.text, margin: "0 0 12px 0" }}>Working Paper Notes</h4>
        <textarea
          placeholder={`Notes for ${currentFSLI.ref} - Document findings, exceptions, conclusions...`}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "12px",
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "6px",
            color: COLORS.text,
            fontFamily: "monospace",
            fontSize: "11px",
            resize: "vertical"
          }}
        />
      </div>

      {canAdvance && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={onAdvance}
            style={{
              padding: "12px 32px",
              background: `linear-gradient(135deg, ${COLORS.final}, ${COLORS.final}dd)`,
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
            ✓ Complete Final Audit & Advance to Completion
          </button>
        </div>
      )}
    </div>
  );
}

export default FinalAuditPhase;
