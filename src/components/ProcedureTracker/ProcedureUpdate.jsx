import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function ProcedureUpdate() {
  const { wpId } = useParams();
  const { CC } = useOutletContext() || { CC: C };
  const navigate = useNavigate();
  const { cellData, setCellData, _signOffs } = useEngagement();

  // Get all cell data keys for this WP
  const wpKeys = Object.keys(cellData).filter(k =>
    k.startsWith(wpId + "_") ||
    k.startsWith("fsli_" + wpId + "_") ||
    k.startsWith("sub_" + wpId + "_") ||
    k.startsWith("proc_" + wpId + "_") ||
    k.startsWith("test_" + wpId + "_")
  );

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{
          padding: "6px 12px", borderRadius: 6,
          background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd,
          color: CC.dim, cursor: "pointer", fontSize: 11
        }}>Back</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: CC.tx }}>
          Edit: {wpId?.toUpperCase()}
        </div>
      </div>

      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 16 }}>
        {wpKeys.length} data entries in this working paper.
        For full editing, use the <button onClick={() => navigate("../../full")} style={{ background: "none", border: "none", color: CC.acc, cursor: "pointer", fontSize: 11, fontWeight: 600, textDecoration: "underline" }}>Full Audit File</button>.
      </div>

      {wpKeys.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: CC.dim }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: 12 }}>No data entered yet for this working paper.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {wpKeys.slice(0, 50).map((key) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 12px", borderRadius: 6,
              background: CC.card, border: "1px solid " + CC.brd
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: CC.fnt, width: 160 }}>{key}</span>
              <input
                value={cellData[key] || ""}
                onChange={(e) => setCellData(p => ({ ...p, [key]: e.target.value }))}
                style={{
                  flex: 1, padding: "6px 10px", borderRadius: 4,
                  background: "rgba(255,255,255,0.04)", border: "1px solid " + CC.brd,
                  color: CC.tx, fontSize: 11, outline: "none"
                }}
              />
            </div>
          ))}
          {wpKeys.length > 50 && (
            <div style={{ fontSize: 10, color: CC.dim, padding: 8 }}>
              Showing 50 of {wpKeys.length} entries. Open the Full Audit File for complete editing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
