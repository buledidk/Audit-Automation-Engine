import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { formatSignOff } from "../Shared/utils/formatters";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function ProcedureDetail() {
  const { wpId } = useParams();
  const { CC } = useOutletContext() || { CC: C };
  const navigate = useNavigate();
  const { signOffs, wpNotes, setWpNotes, reviewNotes } = useEngagement();

  const so = signOffs[wpId] || {};
  const openNotes = (reviewNotes[wpId] || []).filter(n => n.status !== "cleared").length;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "6px 12px", borderRadius: 6,
            background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd,
            color: CC.dim, cursor: "pointer", fontSize: 11
          }}
        >Back</button>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: CC.tx }}>
          Working Paper: {wpId?.toUpperCase()}
        </div>
      </div>

      {/* Status */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24
      }}>
        {["preparedBy", "reviewedBy", "approvedBy"].map((role) => {
          const val = so[role];
          const labels = { preparedBy: "Prepared", reviewedBy: "Reviewed", approvedBy: "Approved" };
          return (
            <div key={role} style={{
              padding: 16, borderRadius: 10,
              background: val ? CC.grn + "0D" : CC.card,
              border: "1px solid " + (val ? CC.grn + "33" : CC.brd),
              textAlign: "center"
            }}>
              <div style={{ fontSize: 11, color: val ? CC.grn : CC.dim, fontWeight: 600, marginBottom: 4 }}>
                {labels[role]}
              </div>
              <div style={{ fontSize: 12, color: CC.tx }}>
                {val ? formatSignOff(val) : "Not yet"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Notes Summary */}
      {openNotes > 0 && (
        <div style={{
          padding: 14, borderRadius: 8, marginBottom: 20,
          background: CC.red + "0D", border: "1px solid " + CC.red + "33"
        }}>
          <span style={{ fontSize: 11, color: CC.red, fontWeight: 600 }}>
            {openNotes} open review note{openNotes > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Notes */}
      <div style={{
        background: CC.card, border: "1px solid " + CC.brd,
        borderRadius: 10, padding: 16, marginBottom: 20
      }}>
        <div style={{ fontSize: 10, color: CC.acc, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>
          Working Paper Notes
        </div>
        <textarea
          value={wpNotes[wpId] || ""}
          onChange={(e) => setWpNotes(p => ({ ...p, [wpId]: e.target.value }))}
          placeholder="Add notes..."
          style={{
            width: "100%", minHeight: 80, resize: "vertical",
            padding: "10px 14px", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd,
            color: CC.tx, fontSize: 12, outline: "none"
          }}
        />
      </div>

      {/* Link to full WP */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => navigate(`../../full`)}
          style={{
            padding: "10px 20px", borderRadius: 8,
            background: CC.acc + "18", border: "1px solid " + CC.acc + "44",
            color: CC.acc, cursor: "pointer", fontSize: 11, fontWeight: 600
          }}
        >Open in Full Audit File</button>
      </div>
    </div>
  );
}
