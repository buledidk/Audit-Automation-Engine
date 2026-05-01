// ═══════════════════════════════════════════════════════════════
// REVIEW NOTES PANEL — Review Query Workflow
// AuditEngine v10 AURA — Phase 2 Batch 3
// Raise/respond/clear workflow for review notes per WP
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";

const ReviewNotesPanel = ({ _wpId, notes, onAddNote, onRespond, onClear, onReopen, colors: C, archived, getUserIdentity }) => {
  const [adding, setAdding] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [cellRef, setCellRef] = useState("");
  const [respondingId, setRespondingId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const openCount = notes.filter(n => n.status !== "cleared").length;

  const handleAdd = () => {
    if (!noteText.trim()) return;
    const user = getUserIdentity();
    if (!user) return;
    const id = "rn_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    onAddNote({
      id,
      text: noteText.trim(),
      raisedBy: { name: user.name, date: new Date().toISOString().slice(0, 10) },
      raisedAt: new Date().toISOString(),
      status: "raised",
      cellRef: cellRef.trim() || null,
      respondedBy: null,
      respondedAt: null,
      response: null,
      clearedBy: null,
      clearedAt: null
    });
    setNoteText("");
    setCellRef("");
    setAdding(false);
  };

  const handleRespond = (noteId) => {
    if (!responseText.trim()) return;
    const user = getUserIdentity();
    if (!user) return;
    onRespond(noteId, {
      response: responseText.trim(),
      respondedBy: { name: user.name, date: new Date().toISOString().slice(0, 10) },
      respondedAt: new Date().toISOString()
    });
    setResponseText("");
    setRespondingId(null);
  };

  const handleClear = (noteId) => {
    const user = getUserIdentity();
    if (!user) return;
    onClear(noteId, {
      clearedBy: { name: user.name, date: new Date().toISOString().slice(0, 10) },
      clearedAt: new Date().toISOString()
    });
  };

  const statusIcon = (s) => s === "raised" ? "🔴" : s === "responded" ? "🟡" : "🟢";
  const statusBg = (s) => s === "raised" ? (C.red || "#EF5350") + "0A" : s === "responded" ? (C.org || "#FB8C00") + "0A" : (C.grn || "#66BB6A") + "0A";
  const statusBorder = (s) => s === "raised" ? (C.red || "#EF5350") + "22" : s === "responded" ? (C.org || "#FB8C00") + "22" : (C.grn || "#66BB6A") + "22";

  if (!notes.length && !adding) {
    return <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: C.acc || "#6366F1", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>📋 Review Notes</div>
        {!archived && <button onClick={() => setAdding(true)} style={{ fontSize: 9, padding: "3px 10px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer", fontWeight: 600 }}>+ Add Note</button>}
      </div>
      <div style={{ fontSize: 10, color: C.fnt || "#666", padding: "8px 0" }}>No review notes for this WP.</div>
    </div>;
  }

  return <div style={{ marginTop: 12 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: C.acc || "#6366F1", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
        📋 Review Notes {openCount > 0 && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: (C.red || "#EF5350") + "22", color: C.red || "#EF5350", fontWeight: 700, marginLeft: 4 }}>{openCount} open</span>}
      </div>
      {!archived && <button onClick={() => setAdding(true)} style={{ fontSize: 9, padding: "3px 10px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer", fontWeight: 600 }}>+ Add Note</button>}
    </div>

    {adding && <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), marginBottom: 8 }}>
      <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Enter review note..." style={{ width: "100%", padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.tx || "#E0E7FF", fontSize: 11, minHeight: 50, resize: "vertical", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
        <input value={cellRef} onChange={e => setCellRef(e.target.value)} placeholder="Cell ref (optional)" style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", fontSize: 9, width: 120, outline: "none" }} />
        <div style={{ flex: 1 }} />
        <button onClick={() => { setAdding(false); setNoteText(""); setCellRef(""); }} style={{ fontSize: 9, padding: "4px 10px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer" }}>Cancel</button>
        <button onClick={handleAdd} style={{ fontSize: 9, padding: "4px 10px", borderRadius: 4, background: (C.acc || "#6366F1") + "22", border: "1px solid " + (C.acc || "#6366F1") + "44", color: C.acc || "#6366F1", cursor: "pointer", fontWeight: 700 }}>Submit</button>
      </div>
    </div>}

    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {notes.map((n, i) => <div key={n.id} style={{ padding: "10px 12px", borderRadius: 8, background: statusBg(n.status), border: "1px solid " + statusBorder(n.status) }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <span style={{ fontSize: 10 }}>{statusIcon(n.status)}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.tx || "#E0E7FF", lineHeight: 1.5 }}>#{i + 1} {n.text}</div>
            <div style={{ fontSize: 9, color: C.fnt || "#666", marginTop: 4 }}>
              Raised by {n.raisedBy?.name || "Unknown"} · {n.raisedBy?.date || ""}
              {n.cellRef && <span style={{ marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.06)", fontSize: 8 }}>Cell: {n.cellRef}</span>}
            </div>

            {n.response && <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: "2px solid " + (C.org || "#FB8C00") + "44" }}>
              <div style={{ fontSize: 10, color: C.tx || "#E0E7FF", lineHeight: 1.5 }}>{n.response}</div>
              <div style={{ fontSize: 9, color: C.fnt || "#666", marginTop: 2 }}>— {n.respondedBy?.name || "Unknown"} · {n.respondedBy?.date || ""}</div>
            </div>}

            {n.status === "cleared" && n.clearedBy && <div style={{ fontSize: 9, color: C.grn || "#66BB6A", marginTop: 4 }}>
              Cleared by {n.clearedBy.name} · {n.clearedBy.date}
            </div>}

            {!archived && <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {n.status === "raised" && <>
                {respondingId === n.id ? <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
                  <textarea value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Enter response..." style={{ width: "100%", padding: "6px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.tx || "#E0E7FF", fontSize: 10, minHeight: 36, resize: "vertical", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
                  <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    <button onClick={() => { setRespondingId(null); setResponseText(""); }} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer" }}>Cancel</button>
                    <button onClick={() => handleRespond(n.id)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: (C.org || "#FB8C00") + "22", border: "1px solid " + (C.org || "#FB8C00") + "44", color: C.org || "#FB8C00", cursor: "pointer", fontWeight: 700 }}>Submit</button>
                  </div>
                </div> : <button onClick={() => { setRespondingId(n.id); setResponseText(""); }} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: (C.org || "#FB8C00") + "11", border: "1px solid " + (C.org || "#FB8C00") + "33", color: C.org || "#FB8C00", cursor: "pointer", fontWeight: 600 }}>Respond</button>}
              </>}
              {n.status === "responded" && <>
                <button onClick={() => handleClear(n.id)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: (C.grn || "#66BB6A") + "11", border: "1px solid " + (C.grn || "#66BB6A") + "33", color: C.grn || "#66BB6A", cursor: "pointer", fontWeight: 600 }}>Clear</button>
                <button onClick={() => onReopen(n.id)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer" }}>Reopen</button>
              </>}
              {n.status === "cleared" && <button onClick={() => onReopen(n.id)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, background: "rgba(255,255,255,0.05)", border: "1px solid " + (C.brd || "rgba(255,255,255,0.1)"), color: C.dim || "#999", cursor: "pointer" }}>Reopen</button>}
            </div>}
          </div>
        </div>
      </div>)}
    </div>
  </div>;
};

export default ReviewNotesPanel;
