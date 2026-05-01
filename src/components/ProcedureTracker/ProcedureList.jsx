import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C, WP_TYPE_COLORS } from "../Shared/utils/constants";

// WP list reference — subset of the monolith's WPS
const WP_CATEGORIES = [
  {
    label: "PLANNING & ACCEPTANCE", color: "#1565C0",
    items: [
      { id: "a1", ref: "A1", label: "Engagement Letter", type: "planning" },
      { id: "a2", ref: "A2", label: "Client Acceptance", type: "planning" },
      { id: "a3", ref: "A3", label: "Audit Strategy", type: "planning" },
      { id: "a4", ref: "A4", label: "Materiality", type: "planning" },
      { id: "a5", ref: "A5", label: "Understanding the Entity", type: "planning" },
      { id: "a6", ref: "A6", label: "Fraud Risk Assessment", type: "planning" },
      { id: "a8", ref: "A8", label: "Analytical Review (Planning)", type: "planning" },
      { id: "a9", ref: "A9", label: "Laws & Regulations", type: "planning" },
    ]
  },
  {
    label: "RISK ASSESSMENT", color: "#C62828",
    items: [
      { id: "b1", ref: "B1", label: "Risk Assessment Matrix", type: "risk" },
      { id: "b2", ref: "B2", label: "Controls Assessment", type: "risk" },
      { id: "b3", ref: "B3", label: "Significant Risks", type: "risk" },
      { id: "b4", ref: "B4", label: "Entity-Level Controls", type: "risk" },
    ]
  },
  {
    label: "TESTING PROGRAMMES", color: "#E65100",
    items: [
      { id: "d1", ref: "D1", label: "Revenue", type: "testing" },
      { id: "d2", ref: "D2", label: "Receivables", type: "testing" },
      { id: "d3", ref: "D3", label: "Inventory / WIP", type: "testing" },
      { id: "d4", ref: "D4", label: "Payables", type: "testing" },
      { id: "d5", ref: "D5", label: "Payroll", type: "testing" },
      { id: "d6", ref: "D6", label: "Cash & Bank", type: "testing" },
      { id: "d7", ref: "D7", label: "Fixed Assets", type: "testing" },
      { id: "d12", ref: "D12", label: "Provisions & Contingencies", type: "testing" },
      { id: "d13", ref: "D13", label: "Taxation", type: "testing" },
      { id: "d15", ref: "D15", label: "Related Parties", type: "testing" },
    ]
  },
  {
    label: "COMPLETION", color: "#6A1B9A",
    items: [
      { id: "e1", ref: "E1", label: "Completion Checklist", type: "completion" },
      { id: "e2", ref: "E2", label: "Final Analytical Review", type: "completion" },
      { id: "a7", ref: "A7", label: "Going Concern", type: "completion" },
      { id: "e4", ref: "E4", label: "Written Representations", type: "completion" },
      { id: "e6", ref: "E6", label: "Audit Completion Memo", type: "completion" },
    ]
  },
];

export default function ProcedureList() {
  const { CC } = useOutletContext() || { CC: C };
  const { signOffs, reviewNotes } = useEngagement();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getStatus = (id) => {
    const so = signOffs[id] || {};
    if (so.approvedBy) return { label: "Approved", icon: "★", color: CC.acc };
    if (so.preparedBy && so.reviewedBy) return { label: "Reviewed", icon: "✓", color: CC.grn };
    if (so.preparedBy) return { label: "Prepared", icon: "◐", color: CC.org };
    return { label: "Open", icon: "○", color: CC.fnt };
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: CC.tx }}>
            Procedures
          </div>
          <div style={{ fontSize: 11, color: CC.dim }}>Working paper status and sign-off tracker</div>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search working papers..."
          style={{
            width: 240, padding: "8px 14px", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd,
            color: CC.tx, fontSize: 12, outline: "none"
          }}
        />
      </div>

      {WP_CATEGORIES.map((cat) => {
        const filtered = cat.items.filter(w =>
          !search || w.label.toLowerCase().includes(search.toLowerCase()) || w.ref.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length === 0) return null;

        const done = filtered.filter(w => signOffs[w.id]?.preparedBy).length;
        return (
          <div key={cat.label} style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid " + CC.brd
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {cat.label}
              </span>
              <span style={{ fontSize: 9, color: done === filtered.length ? CC.grn : CC.dim, fontWeight: 600 }}>
                {done}/{filtered.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {filtered.map((wp) => {
                const status = getStatus(wp.id);
                const openNotes = (reviewNotes[wp.id] || []).filter(n => n.status !== "cleared").length;
                return (
                  <button
                    key={wp.id}
                    onClick={() => navigate(`${wp.id}`)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px", borderRadius: 8,
                      background: CC.card, border: "1px solid " + CC.brd,
                      cursor: "pointer", width: "100%", textAlign: "left"
                    }}
                  >
                    <span style={{ fontFamily: "monospace", color: WP_TYPE_COLORS[wp.type], fontSize: 11, fontWeight: 700, width: 36 }}>
                      {wp.ref}
                    </span>
                    <span style={{ flex: 1, fontSize: 12, color: CC.tx }}>{wp.label}</span>
                    {openNotes > 0 && (
                      <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: CC.red + "22", color: CC.red, fontWeight: 700 }}>
                        {openNotes}
                      </span>
                    )}
                    <span style={{ fontSize: 9, color: status.color, fontWeight: 600 }}>
                      {status.icon} {status.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          onClick={() => navigate("../full")}
          style={{
            padding: "10px 20px", borderRadius: 8,
            background: CC.acc + "18", border: "1px solid " + CC.acc + "44",
            color: CC.acc, cursor: "pointer", fontSize: 11, fontWeight: 600
          }}
        >Open Full Audit File for detailed WP editing</button>
      </div>
    </div>
  );
}
