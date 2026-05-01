import { useEngagement } from "../context/EngagementContext";
import { useAuditHelpers } from "../hooks/useAuditHelpers";
import { C, WPS } from "../data";

export default function ReviewDashboard() {
  const {
    reviewNotes, signOffLog, changeLog, uploads, setActiveWP, CC
  } = useEngagement();
  const { tc } = useAuditHelpers();

  const allOpenNotes = WPS.filter(w => w.type !== "separator").flatMap(w =>
    (reviewNotes[w.id] || []).map(n => ({ ...n, wpId: w.id, wpRef: w.ref, wpLabel: w.label }))
  );
  const raised = allOpenNotes.filter(n => n.status === "raised").length;
  const responded = allOpenNotes.filter(n => n.status === "responded").length;
  const cleared = allOpenNotes.filter(n => n.status === "cleared").length;
  const total = allOpenNotes.length;
  const wpsWithOpen = WPS.filter(w => w.type !== "separator" && (reviewNotes[w.id] || []).some(n => n.status !== "cleared"));
  const totalEdits = changeLog.filter(e => e.type === "cell_edit").length;
  const postReviewEdits = changeLog.filter(e => e.type === "cell_edit" && signOffLog.some(s => s.wpId === e.wpId && s.role === "reviewedBy" && s.action === "cleared_by_edit")).length;
  const uniqueUsers = [...new Set(changeLog.map(e => e.user).filter(Boolean))];
  const userBreakdown = uniqueUsers.map(u => ({ name: u, edits: changeLog.filter(e => e.user === u && e.type === "cell_edit").length, signoffs: signOffLog.filter(s => s.signOff?.name === u).length }));

  return <div style={{ animation: "fadeUp 0.4s ease-out" }}>
    <div style={{ marginBottom: 24 }}><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: CC.tx, marginBottom: 4 }}>📋 Manager Review Dashboard</div><div style={{ fontSize: 11, color: CC.dim }}>Overview of all review notes and FRC compliance metrics</div></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
      {[{ icon: "🔴", val: raised, label: "Raised", c: C.red }, { icon: "🟡", val: responded, label: "Responded", c: C.org }, { icon: "🟢", val: cleared, label: "Cleared", c: C.grn }, { icon: "📋", val: total, label: "Total Notes", c: C.acc }].map(s => <div key={s.label} style={{ padding: 16, borderRadius: 10, background: s.c + "0D", border: "1px solid " + s.c + "33", textAlign: "center" }}>
        <div style={{ fontSize: 20 }}>{s.icon}</div><div style={{ fontSize: 24, fontWeight: 700, color: CC.tx, marginTop: 4 }}>{s.val}</div><div style={{ fontSize: 10, color: s.c, fontWeight: 600 }}>{s.label}</div>
      </div>)}
    </div>
    {wpsWithOpen.length > 0 && <><div style={{ fontSize: 12, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid " + CC.brd }}>Open Review Notes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {wpsWithOpen.map(w => { const notes = reviewNotes[w.id] || []; const rCt = notes.filter(n => n.status === "raised").length; const resCt = notes.filter(n => n.status === "responded").length;
          return <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd }}>
            <span style={{ fontFamily: "monospace", color: tc(w.type), fontSize: 11, fontWeight: 700 }}>{w.ref}</span>
            <span style={{ flex: 1, fontSize: 11, color: CC.tx }}>{w.label}</span>
            {rCt > 0 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: C.red + "22", color: C.red, fontWeight: 600 }}>{rCt} raised</span>}
            {resCt > 0 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: C.org + "22", color: C.org, fontWeight: 600 }}>{resCt} responded</span>}
            <button onClick={() => setActiveWP(w.id)} style={{ fontSize: 9, padding: "4px 10px", borderRadius: 4, background: CC.acc + "22", border: "1px solid " + CC.acc + "44", color: CC.acc, cursor: "pointer", fontWeight: 600 }}>Go to WP</button>
          </div>; })}
      </div></>}
    <div style={{ fontSize: 12, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, paddingBottom: 6, borderBottom: "1px solid " + CC.brd }}>FRC Compliance Dashboard</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
      {[{ l: "Total Cell Edits", v: totalEdits }, { l: "Unique Users", v: uniqueUsers.length }, { l: "Documents Uploaded", v: Object.values(uploads).flat().length }, { l: "Review Notes", v: total }, { l: "Sign-offs", v: signOffLog.filter(s => s.action === "sign").length }, { l: "Post-Review Edits", v: postReviewEdits }].map(m => <div key={m.l} style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700, color: CC.tx }}>{m.v}</div><div style={{ fontSize: 9, color: CC.dim, fontWeight: 600, marginTop: 2 }}>{m.l}</div></div>)}
    </div>
    {userBreakdown.length > 0 && <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, color: CC.dim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Changes by User</div>
      {userBreakdown.map(u => <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 12px", borderRadius: 6, background: CC.card, border: "1px solid " + CC.brd, marginBottom: 4, fontSize: 11 }}>
        <span style={{ flex: 1, color: CC.tx, fontWeight: 500 }}>{u.name}</span>
        <span style={{ color: CC.dim }}>{u.edits} edits</span>
        <span style={{ color: CC.dim }}>{u.signoffs} sign-offs</span>
      </div>)}
    </div>}
  </div>;
}
