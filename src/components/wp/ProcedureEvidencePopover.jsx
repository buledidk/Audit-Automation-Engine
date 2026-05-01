import { useRef, useEffect, memo } from "react";
import { useEngagement } from "../../context/EngagementContext";

export default memo(function ProcedureEvidencePopover({ procedureKey, wpId, onClose }) {
  const { uploads, procedureLinks, setProcedureLinks, CC } = useEngagement();
  const ref = useRef(null);
  const wpUploads = uploads[wpId] || [];
  const linked = procedureLinks[procedureKey] || [];

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const toggle = (fileId) => {
    setProcedureLinks(prev => {
      const cur = prev[procedureKey] || [];
      const next = cur.includes(fileId) ? cur.filter(id => id !== fileId) : [...cur, fileId];
      const updated = { ...prev };
      if (next.length) updated[procedureKey] = next; else delete updated[procedureKey];
      return updated;
    });
  };

  const allFiles = Array.isArray(wpUploads) ? wpUploads : Object.values(wpUploads);

  return <div ref={ref} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
    minWidth: 320, maxHeight: 400, overflow: "auto", padding: 16, borderRadius: 10,
    background: CC.card || "#1A2340", border: "1px solid " + (CC.brd || "rgba(255,255,255,0.15)"),
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 1000, color: CC.tx || "#E8ECF1" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: CC.acc || "#FFA726" }}>Link Evidence</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: CC.dim || "#B0B8C8", cursor: "pointer", fontSize: 16 }}>✕</button>
    </div>
    {allFiles.length === 0 ?
      <div style={{ fontSize: 11, color: CC.dim || "#B0B8C8", padding: "20px 0", textAlign: "center" }}>No uploads for this working paper.<br/>Upload evidence files first.</div> :
      allFiles.map((file, idx) => {
        const fid = file.id || file.name || ("file_" + idx);
        const fname = file.name || file.filename || fid;
        const isLinked = linked.includes(fid);
        return <div key={fid} onClick={() => toggle(fid)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 4, background: isLinked ? "rgba(76,175,80,0.1)" : "transparent", border: "1px solid " + (isLinked ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.06)") }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid " + (isLinked ? "#66BB6A" : "rgba(255,255,255,0.2)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#66BB6A", flexShrink: 0 }}>{isLinked ? "✓" : ""}</span>
          <span style={{ fontSize: 11, color: isLinked ? (CC.tx || "#E8ECF1") : (CC.dim || "#B0B8C8"), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fname}</span>
        </div>;
      })
    }
    {linked.length > 0 && <div style={{ marginTop: 8, fontSize: 10, color: CC.grn || "#66BB6A" }}>{linked.length} file{linked.length > 1 ? "s" : ""} linked</div>}
  </div>;
});
