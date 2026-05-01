import { useCallback, useMemo } from "react";
import { useEngagement } from "../context/EngagementContext";
import { isSupabaseConfigured, supabase } from "../supabaseClient";
import { WPS, C } from "../data";

export function useAuditHelpers() {
  const {
    cellData, setCellData, signOffs, setSignOffs,
    _signOffLog, setSignOffLog, _changeLog, setChangeLog,
    _wpNotes, _setWpNotes, archived, engId, CC, indAcc,
    showToast, cellHistoryKey, setCellHistoryKey // eslint-disable-line no-unused-vars
  } = useEngagement();

  const getUserIdentity = useCallback(() => {
    if (window.Clerk?.user?.fullName) return { name: window.Clerk.user.fullName, userId: window.Clerk.user.id };
    const name = window.prompt("Enter your name for sign-off:");
    if (!name) return null;
    return { name, userId: null };
  }, []);

  const formatSignOff = useCallback((val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.name + " (" + val.date + ")";
  }, []);

  const setCell = useCallback((t, r, c, v) => {
    const wpId = t.replace(/^(fsli_|sub_|proc_|test_|cyc_)/, "");
    const so = signOffs[wpId];
    if (so?.reviewedBy) {
      if (!window.confirm("This WP has been reviewed by " + formatSignOff(so.reviewedBy) + ".\n\nEditing will clear the review and approval sign-offs.\n\nProceed?")) {
        return;
      }
      setSignOffs(p => ({ ...p, [wpId]: { ...p[wpId], reviewedBy: null, approvedBy: null } }));
      setSignOffLog(p => [...p, { wpId, role: "reviewedBy", action: "cleared_by_edit", timestamp: new Date().toISOString(), cellKey: `${t}_${r}_${c}` }]);
      showToast("Review cleared — WP requires re-review", "warning");
    }
    const oldVal = cellData[`${t}_${r}_${c}`] || "";
    if (oldVal !== v) {
      const user = getUserIdentity();
      setChangeLog(p => {
        const log = [...p, { type: "cell_edit", wpId, cellKey: `${t}_${r}_${c}`, oldValue: oldVal, newValue: v, user: user?.name || "Unknown", timestamp: new Date().toISOString() }];
        return log.length > 10000 ? log.slice(-10000) : log;
      });
      if (isSupabaseConfigured()) {
        supabase.from('audit_trail').insert({
          engagement_id: engId, action: 'cell_edit',
          details: { wpId, cellKey: `${t}_${r}_${c}`, oldValue: oldVal, newValue: v, user: user?.name }
        }).then(null, e => console.warn('Audit trail:', e));
      }
    }
    setCellData(p => ({ ...p, [`${t}_${r}_${c}`]: v }));
  }, [signOffs, cellData, engId, getUserIdentity, formatSignOff, setCellData, setSignOffs, setSignOffLog, setChangeLog, showToast]);

  const getCell = useCallback((t, r, c) => cellData[`${t}_${r}_${c}`] || "", [cellData]);

  const doSign = useCallback((id, role) => {
    if (archived) return;
    const user = getUserIdentity();
    if (!user) return;
    const signOff = { name: user.name, userId: user.userId, date: new Date().toISOString().slice(0, 10), timestamp: new Date().toISOString() };
    setSignOffs(p => ({ ...p, [id]: { ...(p[id] || {}), [role]: signOff } }));
    setSignOffLog(p => [...p, { wpId: id, role, signOff, action: "sign", timestamp: signOff.timestamp }]);
  }, [archived, getUserIdentity, setSignOffs, setSignOffLog]);

  const BoundET = useMemo(() => function BoundETable(props) {
    return <ETable {...props} getCell={getCell} setCell={setCell} colors={CC} onCellContextMenu={setCellHistoryKey} />;
  }, [getCell, setCell, CC, setCellHistoryKey]);

  const ST = useMemo(() => function BoundSecTitle(props) {
    return <SecTitle {...props} indAcc={indAcc} />;
  }, [indAcc]);

  const getSectionName = useCallback((wp) => {
    if (!wp) return "";
    const idx = WPS.indexOf(wp);
    for (let i = idx - 1; i >= 0; i--) {
      if (WPS[i].type === "separator") return WPS[i].label;
    }
    return "";
  }, []);

  const tc = useCallback((t) =>
    t === "planning" ? C.pln : t === "risk" ? C.rsk : t === "lead" ? C.ld :
    t === "testing" ? C.tst : t === "completion" ? C.cmp : t === "reporting" ? C.rpt :
    t === "fs" ? "#00838F" : t === "regulatory" ? "#37474F" : t === "models" ? C.mdl :
    t === "research" ? "#0097A7" : t === "integration" ? "#00BFA5" : C.acc
  , []);

  // Style helpers
  const inp = useMemo(() => ({
    width: "100%", padding: "12px 14px", borderRadius: 8,
    background: CC.bg === "#F5F5F5" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)",
    border: "1px solid " + (CC.bg === "#F5F5F5" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)"),
    color: CC.tx, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none"
  }), [CC]);

  const lbl = useMemo(() => ({
    fontSize: 10, color: CC.acc || C.acc, textTransform: "uppercase",
    letterSpacing: "0.12em", marginBottom: 6, display: "block", fontWeight: 600
  }), [CC]);

  return {
    getCell, setCell, BoundET, ST, doSign,
    getUserIdentity, formatSignOff, getSectionName, tc,
    inp, lbl
  };
}
