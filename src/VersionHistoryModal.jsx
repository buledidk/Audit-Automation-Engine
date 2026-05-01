// ═══════════════════════════════════════════════════════════════
// VERSION HISTORY MODAL — Cell Change History Viewer
// AuditEngine v10 AURA — Phase 2 Batch 6
// Shows immutable audit trail of cell edits
// ═══════════════════════════════════════════════════════════════

const VersionHistoryModal = ({ cellKey, changeLog, onClose, colors: C }) => {
  if (!cellKey) return null;

  const entries = changeLog.filter(e => e.cellKey === cellKey && e.type === "cell_edit");

  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#151D30", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), borderRadius: 16, padding: 24, width: 560, maxWidth: "90vw", maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: C.tx || "#E0E7FF", fontWeight: 700 }}>🕐 Version History</div>
          <div style={{ fontSize: 10, color: C.fnt || "#666", marginTop: 2 }}>Cell: {cellKey}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.dim || "#999", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
      </div>

      {entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: C.fnt || "#666", fontSize: 11 }}>No edit history for this cell.</div>
      ) : (
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.acc || "#6366F1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Timestamp</th>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.acc || "#6366F1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>User</th>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.acc || "#6366F1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Old Value</th>
                <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.acc || "#6366F1", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>New Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const ts = e.timestamp ? new Date(e.timestamp) : null;
                const fmtTs = ts ? ts.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " " + ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "Unknown";
                return <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "6px 8px", color: C.dim || "#999", whiteSpace: "nowrap" }}>{fmtTs}</td>
                  <td style={{ padding: "6px 8px", color: C.tx || "#E0E7FF", fontWeight: 500 }}>{e.user || "Unknown"}</td>
                  <td style={{ padding: "6px 8px", color: C.red || "#EF5350", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.oldValue || '""'}</td>
                  <td style={{ padding: "6px 8px", color: C.grn || "#66BB6A", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.newValue || '""'}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 9, color: C.fnt || "#666", borderTop: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), paddingTop: 8 }}>
        {entries.length} edit{entries.length !== 1 ? "s" : ""} recorded · Right-click any cell to view history
      </div>
    </div>
  </div>;
};

export default VersionHistoryModal;
