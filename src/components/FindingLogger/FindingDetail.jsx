import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function FindingDetail() {
  const { findingId } = useParams();
  const { CC } = useOutletContext() || { CC: C };
  const navigate = useNavigate();
  const { customItems } = useEngagement();

  const finding = (customItems.risks || []).find(r => r.id === findingId);

  if (!finding) {
    return (
      <div style={{ padding: "24px 32px" }}>
        <div style={{ color: CC.dim }}>Finding not found.</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: 12, padding: "6px 12px", borderRadius: 6, background: CC.card, border: "1px solid " + CC.brd, color: CC.dim, cursor: "pointer", fontSize: 11 }}>Back</button>
      </div>
    );
  }

  const severityColor = finding.lv === "SIGNIFICANT" ? CC.red : finding.lv === "ELEVATED" ? CC.org : CC.grn;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 800 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16, padding: "6px 12px", borderRadius: 6, background: CC.card, border: "1px solid " + CC.brd, color: CC.dim, cursor: "pointer", fontSize: 11 }}>Back</button>

      <div style={{ background: CC.card, border: "1px solid " + CC.brd, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: "monospace", fontSize: 14, color: CC.acc, fontWeight: 700 }}>{finding.id}</span>
          <span style={{
            padding: "4px 12px", borderRadius: 20,
            background: severityColor + "22",
            border: "1px solid " + severityColor + "55",
            color: severityColor, fontSize: 10, fontWeight: 700
          }}>{finding.lv}</span>
        </div>

        <div style={{ fontSize: 14, color: CC.tx, fontWeight: 600, marginBottom: 12 }}>{finding.t}</div>

        {finding.isa && (
          <div style={{ fontSize: 11, color: CC.dim, marginBottom: 8 }}>
            <span style={{ color: CC.acc, fontWeight: 600 }}>ISA Reference:</span> {finding.isa}
          </div>
        )}
        {finding.rs && (
          <div style={{ fontSize: 11, color: CC.dim }}>
            <span style={{ color: CC.acc, fontWeight: 600 }}>Audit Response:</span> {finding.rs}
          </div>
        )}
      </div>
    </div>
  );
}
