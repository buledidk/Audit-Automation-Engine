import React from "react";

const COLORS = {
  interim: "#FB8C00",
  bg: "#0A0E17",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#F8F8F8",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  green: "#66BB6A",
  red: "#EF5350"
};

// ═══════════════════════════════════════════════════════════════════
// INTERIM PHASE - CONTROL TESTING
// ISA 315, ISA 330 - Design effectiveness and operating effectiveness
// ═══════════════════════════════════════════════════════════════════
export function InterimPhase({ engagement, updateEngagement, onAdvance, canAdvance }) {
  const [activeTab, setActiveTab] = React.useState("designEffectiveness");
  const [controls, setControls] = React.useState([
    { id: "C001", area: "Revenue Cycle", control: "Revenue authorized by manager", design: "Yes", operating: "No", tested: false },
    { id: "C002", area: "Purchases Cycle", control: "PO approval before goods receipt", design: "Yes", operating: "No", tested: false },
    { id: "C003", area: "Payroll Cycle", control: "Timesheet approval by supervisor", design: "Yes", operating: "No", tested: false },
    { id: "C004", area: "Cash Cycle", control: "Bank reconciliation monthly", design: "Yes", operating: "No", tested: false },
    { id: "C005", area: "Fixed Assets", control: "Asset register maintenance", design: "Yes", operating: "No", tested: false }
  ]);

  const updateControl = (id, field, value) => {
    setControls(controls.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const designEffectiveCount = controls.filter(c => c.design === "Yes").length;
  const operatingEffectiveCount = controls.filter(c => c.operating === "Yes").length;
  const designEffectiveness = Math.round((designEffectiveCount / controls.length) * 100);
  const operatingEffectiveness = Math.round((operatingEffectiveCount / controls.length) * 100);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.interim, marginBottom: "4px" }}>🔍 Interim Phase - Control Testing</h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>ISA 315, ISA 330 - Evaluate control design and operating effectiveness</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.dim, margin: "0 0 8px 0", fontSize: "11px", fontWeight: 700 }}>DESIGN EFFECTIVENESS</p>
          <p style={{ color: COLORS.green, margin: 0, fontSize: "24px", fontWeight: 700 }}>{designEffectiveness}%</p>
          <div style={{ background: COLORS.bg, borderRadius: "4px", height: "6px", overflow: "hidden", marginTop: "8px" }}>
            <div style={{ height: "100%", background: COLORS.green, width: `${designEffectiveness}%` }} />
          </div>
        </div>
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.dim, margin: "0 0 8px 0", fontSize: "11px", fontWeight: 700 }}>OPERATING EFFECTIVENESS</p>
          <p style={{ color: COLORS.red, margin: 0, fontSize: "24px", fontWeight: 700 }}>{operatingEffectiveness}%</p>
          <div style={{ background: COLORS.bg, borderRadius: "4px", height: "6px", overflow: "hidden", marginTop: "8px" }}>
            <div style={{ height: "100%", background: COLORS.red, width: `${operatingEffectiveness}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "12px" }}>
        {["designEffectiveness", "operatingTesting", "summary"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              background: activeTab === tab ? COLORS.interim + "30" : "transparent",
              border: `1px solid ${activeTab === tab ? COLORS.interim + "60" : COLORS.border}`,
              color: activeTab === tab ? COLORS.interim : COLORS.dim,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase"
            }}
          >
            {tab === "designEffectiveness" && "Design Effectiveness"}
            {tab === "operatingTesting" && "Operating Effectiveness"}
            {tab === "summary" && "Control Assessment"}
          </button>
        ))}
      </div>

      {/* Control Testing Table */}
      {(activeTab === "designEffectiveness" || activeTab === "operatingTesting") && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}`, marginBottom: "24px", overflowX: "auto" }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>
            {activeTab === "designEffectiveness" ? "Control Design Testing (ISA 330.8)" : "Control Operating Effectiveness (ISA 330.8)"}
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Control ID</th>
                <th style={{ textAlign: "left", padding: "10px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Area</th>
                <th style={{ textAlign: "left", padding: "10px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>Control Description</th>
                <th style={{ textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim, fontWeight: 700 }}>
                  {activeTab === "designEffectiveness" ? "Design Effective?" : "Operating Effective?"}
                </th>
              </tr>
            </thead>
            <tbody>
              {controls.map(control => (
                <tr key={control.id}>
                  <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text }}>{control.id}</td>
                  <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text }}>{control.area}</td>
                  <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.dim }}>{control.control}</td>
                  <td style={{ padding: "10px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                    <select
                      value={activeTab === "designEffectiveness" ? control.design : control.operating}
                      onChange={(e) => updateControl(control.id, activeTab === "designEffectiveness" ? "design" : "operating", e.target.value)}
                      style={{
                        padding: "6px 8px",
                        background: COLORS.bg,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "4px",
                        color: COLORS.text,
                        fontSize: "11px"
                      }}
                    >
                      <option value="No">Not Effective</option>
                      <option value="Yes">Effective</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {activeTab === "summary" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Control Assessment Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: COLORS.interim + "12", border: `1px solid ${COLORS.interim}33`, borderRadius: "8px", padding: "16px" }}>
              <p style={{ color: COLORS.dim, margin: "0 0 8px 0", fontSize: "11px" }}>DESIGN EFFECTIVENESS</p>
              <p style={{ color: COLORS.interim, margin: 0, fontSize: "18px", fontWeight: 700 }}>{designEffectiveCount}/{controls.length} Controls Effective</p>
              <p style={{ color: COLORS.faint, margin: "6px 0 0 0", fontSize: "10px" }}>Controls are properly designed to prevent/detect misstatement</p>
            </div>
            <div style={{ background: COLORS.interim + "12", border: `1px solid ${COLORS.interim}33`, borderRadius: "8px", padding: "16px" }}>
              <p style={{ color: COLORS.dim, margin: "0 0 8px 0", fontSize: "11px" }}>OPERATING EFFECTIVENESS</p>
              <p style={{ color: COLORS.interim, margin: 0, fontSize: "18px", fontWeight: 700 }}>{operatingEffectiveCount}/{controls.length} Controls Operating</p>
              <p style={{ color: COLORS.faint, margin: "6px 0 0 0", fontSize: "10px" }}>Controls operated as designed throughout the period</p>
            </div>
          </div>
          <div style={{ background: COLORS.bg, padding: "16px", borderRadius: "8px", border: `1px solid ${COLORS.border}` }}>
            <h4 style={{ color: COLORS.interim, margin: "0 0 12px 0", fontSize: "12px" }}>Risk Response Strategy</h4>
            {operatingEffectiveCount >= controls.length * 0.75 ? (
              <p style={{ color: COLORS.green, margin: 0 }}>✓ Controls operating effectively - can rely on controls and reduce substantive testing</p>
            ) : (
              <p style={{ color: COLORS.red, margin: 0 }}>⚠ Controls not fully operating - require increased substantive testing in Final Audit phase</p>
            )}
          </div>
        </div>
      )}

      {canAdvance && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            onClick={onAdvance}
            style={{
              padding: "12px 32px",
              background: `linear-gradient(135deg, ${COLORS.interim}, ${COLORS.interim}dd)`,
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
            ✓ Complete Interim & Advance to Final Audit
          </button>
        </div>
      )}
    </div>
  );
}

export default InterimPhase;
