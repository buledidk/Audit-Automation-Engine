import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function FindingList() {
  const { CC } = useOutletContext() || { CC: C };
  const { customItems, setCustomItems } = useEngagement();
  const [showForm, setShowForm] = useState(false);

  const findings = customItems.risks || [];

  const severityColor = (level) => {
    if (level === "SIGNIFICANT") return CC.red;
    if (level === "ELEVATED") return CC.org;
    return CC.grn;
  };

  const handleAdd = (finding) => {
    setCustomItems(p => ({
      ...p,
      risks: [...(p.risks || []), {
        id: "CR" + String((p.risks || []).length + 1).padStart(2, "0"),
        t: finding.description,
        lv: finding.severity,
        isa: finding.isa || "",
        rs: finding.response || ""
      }]
    }));
    setShowForm(false);
  };

  const handleDelete = (idx) => {
    if (!window.confirm("Remove this finding?")) return;
    setCustomItems(p => ({
      ...p,
      risks: (p.risks || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: CC.tx }}>
            Findings
          </div>
          <div style={{ fontSize: 11, color: CC.dim }}>
            {findings.length} custom risk{findings.length !== 1 ? "s" : ""} / finding{findings.length !== 1 ? "s" : ""} logged
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "8px 16px", borderRadius: 8,
            background: CC.acc + "18", border: "1px solid " + CC.acc + "44",
            color: CC.acc, cursor: "pointer", fontSize: 11, fontWeight: 600
          }}
        >{showForm ? "Cancel" : "+ New Finding"}</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <FindingForm CC={CC} onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {findings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: CC.dim }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>No findings logged</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Click "New Finding" to log audit exceptions or risks.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {findings.map((f, idx) => (
            <div key={f.id || idx} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "14px 16px", borderRadius: 10,
              background: CC.card, border: "1px solid " + CC.brd
            }}>
              <span style={{
                display: "inline-block", padding: "3px 10px", borderRadius: 20,
                background: severityColor(f.lv) + "22",
                border: "1px solid " + severityColor(f.lv) + "55",
                color: severityColor(f.lv),
                fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                flexShrink: 0
              }}>{f.lv}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: CC.tx, fontWeight: 500 }}>{f.t}</div>
                <div style={{ fontSize: 10, color: CC.dim, marginTop: 4 }}>
                  {f.isa && <span>ISA: {f.isa} | </span>}
                  {f.rs && <span>Response: {f.rs}</span>}
                </div>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: CC.fnt }}>{f.id}</span>
              <button
                onClick={() => handleDelete(idx)}
                style={{
                  padding: "4px 8px", borderRadius: 4,
                  background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.25)",
                  color: CC.red, cursor: "pointer", fontSize: 9
                }}
              >Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
