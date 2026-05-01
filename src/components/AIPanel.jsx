import { useEngagement } from "../context/EngagementContext";
import { WPS } from "../data";
import { getSession } from "../lib/supabaseClient";

// ═══ AI ENGINE HOOK — Claude Intelligence Layer ═══
export function useAIEngine() {
  const {
    _aiOpen, _setAiOpen, _aiLoading, setAiLoading,
    aiMessages, setAiMessages, aiInput, setAiInput, // eslint-disable-line no-unused-vars
    _aiMode, _setAiMode, aiAuditTrail, setAiAuditTrail,
    cfg, activeWP, showToast, CC // eslint-disable-line no-unused-vars
  } = useEngagement();

  const { ind, fw, sz } = useEngagement();

  const getAuditContext = () => {
    const wp = WPS.find(w => w.id === activeWP);
    return `You are an expert UK statutory auditor working inside AuditEngine v10 AURA. Current engagement context:
- Entity: ${cfg.entityName || "[Not set]"} | FYE: ${cfg.fye || "[Not set]"}
- Industry: ${ind?.l || "[Not set]"} | Sector: ${cfg.sector || "[Not set]"}
- Framework: ${fw?.l || "[Not set]"} | Size: ${sz?.l || "[Not set]"}
- Materiality: £${cfg.materiality || "TBD"} | Perf Mat: £${cfg.perfMateriality || "TBD"} | Trivial: £${cfg.trivial || "TBD"}
- Current Working Paper: ${wp?.ref || "Dashboard"} — ${wp?.label || "Dashboard"} (${wp?.isa || ""})
- Significant Risks: ${ind?.r?.filter(r => r.lv === "SIGNIFICANT").map(r => r.t).join("; ") || "None loaded"}

Standards in scope: ISA (UK), FRS 102 (Revised Jan 2026 — IFRS 15 revenue model, IFRS 16 lease model), Companies Act 2006 (April 2025 thresholds), ISQM (UK) 1/2, FRC Ethical Standard 2024.

Respond as a senior audit manager. Be specific with ISA paragraph references. Format with clear headers. Keep responses practical and directly applicable to this engagement.`;
  };

  const logAIUsage = (wpRef, prompt, response) => {
    setAiAuditTrail(prev => [...prev, {
      id: "AI-" + String(prev.length + 1).padStart(4, "0"),
      timestamp: new Date().toISOString(),
      wpRef,
      prompt: prompt.slice(0, 500),
      responseSummary: response?.slice(0, 300) || "",
      responseLength: response?.length || 0,
      approvedBy: cfg.partner || "[Not set]",
      modifications: "None",
      status: "Pending review"
    }]);
  };

  const callAI = async (userMsg) => {
    setAiLoading(true);
    const newMsgs = [...aiMessages, { role: "user", content: userMsg }];
    setAiMessages(newMsgs);
    setAiInput("");
    try {
      const session = await getSession();
      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;
      const resp = await fetch("/api/orchestrator/request", {
        method: "POST", headers,
        body: JSON.stringify({
          type: "AI_CHAT",
          engagementId: cfg.engagementId || "default",
          params: { system: getAuditContext(), messages: newMsgs.slice(-6) }
        })
      });
      const data = await resp.json();
      const aiText = data.result?.text || data.error || "No response received.";
      setAiMessages(prev => [...prev, { role: "assistant", content: aiText }]);
      logAIUsage(WPS.find(w => w.id === activeWP)?.ref || "N/A", userMsg, aiText);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: "assistant", content: "AI connection error: " + err.message }]);
    }
    setAiLoading(false);
  };

  const aiQuickActions = [
    { label: "🎯 Risk Assessment", prompt: "Analyse the key audit risks for this engagement given the industry, sector and entity size. For each risk, state: the risk description, risk level (Significant/Elevated/Normal), relevant ISA reference, key assertions affected, and recommended audit response. Consider FRS 102 (Revised 2026) implications including new lease and revenue recognition requirements." },
    { label: "📋 Audit Procedures", prompt: `Generate detailed substantive audit procedures for the current working paper (${WPS.find(w => w.id === activeWP)?.label || "this section"}). For each procedure include: the test description, assertion being addressed, ISA reference, sample size guidance based on materiality £${cfg.materiality || "TBD"}, and expected evidence to obtain. Consider industry-specific factors for ${ind?.l || "this industry"}.` },
    { label: "📐 Materiality Calc", prompt: `Calculate suggested materiality levels for ${cfg.entityName || "this entity"} (${ind?.l || "unknown industry"}, ${sz?.l || "unknown size"}). Provide benchmarks (revenue 0.5-1%, total assets 1-2%, PBT 5-10%, gross profit 1-2%), recommend the most appropriate benchmark for this industry, and calculate performance materiality (typically 50-75% of overall) and trivial threshold (typically 3-5% of overall). Reference ISA 320.10-11 and ISA 450.A2.` },
    { label: "⚠️ Fraud Indicators", prompt: `Identify fraud risk indicators specific to ${ind?.l || "this industry"} (${cfg.sector || "this sector"}). Address: (1) Revenue recognition fraud risks per ISA 240.26 presumption, (2) Management override indicators per ISA 240.31, (3) Industry-specific fraud schemes, (4) Red flags from the entity profile. For each, recommend specific journal entry testing criteria and substantive procedures.` },
    { label: "🔄 Going Concern", prompt: `Draft a going concern assessment framework for ${cfg.entityName || "this entity"} (${ind?.l || "this industry"}). Cover: (1) Financial indicators to assess, (2) Operating indicators specific to ${cfg.sector || "this sector"}, (3) Cash flow forecast requirements, (4) ISA 570 requirements including the 12-month assessment period, (5) Management's responsibilities vs auditor's responsibilities, (6) Reporting implications if material uncertainty exists.` },
    { label: "✍️ Draft Mgmt Letter", prompt: `Draft management letter points (ISA 265) for a ${ind?.l || "typical"} entity in the ${cfg.sector || "unknown"} sector. Include 3-5 common internal control deficiencies found in this industry, with: (1) Finding description, (2) Risk/impact, (3) Recommendation, (4) Priority rating. Format as a professional table ready for the management letter.` },
    { label: "📜 Review WP", prompt: `Review the current working paper (${WPS.find(w => w.id === activeWP)?.ref || ""} ${WPS.find(w => w.id === activeWP)?.label || ""}) and provide: (1) Completeness check — what documentation is typically missing, (2) Common audit findings in this area for ${ind?.l || "this industry"}, (3) Cross-references that should be included to other working papers, (4) ISA compliance points to verify, (5) Reviewer questions a manager would typically raise.` },
    { label: "📊 Analytical Review", prompt: `Design analytical review procedures (ISA 520) for ${cfg.entityName || "this entity"} (${ind?.l || "this industry"}, ${cfg.sector || "this sector"}). Include: (1) Key ratios and KPIs to calculate with industry benchmarks, (2) Trend analysis expectations, (3) Investigation thresholds, (4) Plausibility assessment framework. Distinguish between planning analytical review (ISA 520.6) and final analytical review (ISA 520.6) requirements.` },
  ];

  const exportAITrail = () => {
    const rows = ["AuditEngine v10 AURA — AI Usage Audit Trail", "Entity: " + (cfg.entityName || "N/A"), "FYE: " + (cfg.fye || "N/A"), "Generated: " + new Date().toISOString(), "", "ID,Timestamp,WP Ref,Prompt (truncated),Response Length,Approved By,Modifications,Status"];
    aiAuditTrail.forEach(a => rows.push([a.id, a.timestamp, a.wpRef, '"' + a.prompt.replace(/"/g, '""') + '"', a.responseLength, a.approvedBy, a.modifications, a.status].join(",")));
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (cfg.entityName || "Entity").replace(/[^a-zA-Z0-9]/g, "_") + "_AI_Audit_Trail.csv"; a.click();
    showToast("AI audit trail exported", "export");
  };

  return { getAuditContext, callAI, aiQuickActions, logAIUsage, exportAITrail };
}

// ═══ AI PANEL COMPONENT ═══
export default function AIPanel() {
  const {
    aiOpen, setAiOpen, aiLoading, setAiLoading, // eslint-disable-line no-unused-vars
    aiMessages, setAiMessages, aiInput, setAiInput, // eslint-disable-line no-unused-vars
    _aiMode, _setAiMode, _aiAuditTrail, _setAiAuditTrail,
    _cfg, _CC
  } = useEngagement();

  const { callAI, aiQuickActions, _exportAITrail } = useAIEngine();

  return (
    <div style={{ position: "fixed", right: 0, top: 0, width: aiOpen ? 420 : 0, height: "100vh", background: "#0D1229", borderLeft: aiOpen ? "1px solid rgba(99,102,241,0.3)" : "none", transition: "width 0.3s ease", overflow: "hidden", zIndex: 200, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: "#E0E7FF" }}>AURA Intelligence</div><div style={{ fontSize: 9, color: "rgba(165,180,252,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Claude Sonnet · Live</div></div>
        </div>
        <button onClick={() => setAiOpen(false)} aria-label="Close AI panel (Escape)" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
      </div>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0, maxHeight: 200, overflowY: "auto" }}>
        {aiQuickActions.map((qa, i) => <button key={i} onClick={() => callAI(qa.prompt)} disabled={aiLoading} style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", cursor: aiLoading ? "wait" : "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.2s" }}>{qa.label}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {aiMessages.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(165,180,252,0.4)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>AURA AI Assistant</div>
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>Click a quick action above or type a question below. I have full context of your engagement — entity, industry, materiality, current working paper.</div>
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.2)", fontSize: 9, color: "rgba(239,83,80,0.7)", lineHeight: 1.5 }}>FRC AI Compliance: All AI outputs require professional review and approval before incorporation into audit working papers. AI-generated content is logged in the AI Audit Trail.</div>
        </div>}
        {aiMessages.map((msg, i) => <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: msg.role === "user" ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)", border: "1px solid " + (msg.role === "user" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"), fontSize: 12, color: msg.role === "user" ? "#C7D2FE" : "#E5E7EB", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: msg.role === "user" ? "#818CF8" : "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 }}>{msg.role === "user" ? "You" : "AURA"}</div>
          {msg.content}
        </div>)}
        {aiLoading && <div style={{ padding: "16px", textAlign: "center" }}><div style={{ display: "inline-block", width: 24, height: 24, border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><div style={{ fontSize: 11, color: "rgba(165,180,252,0.5)", marginTop: 8 }}>AURA is analysing...</div></div>}
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(99,102,241,0.15)", flexShrink: 0, display: "flex", gap: 8 }}>
        <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && aiInput.trim() && !aiLoading) callAI(aiInput.trim()) }} placeholder="Ask AURA anything about this audit..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)", color: "#E5E7EB", fontSize: 12, outline: "none" }} />
        <button onClick={() => { if (aiInput.trim() && !aiLoading) callAI(aiInput.trim()) }} disabled={aiLoading || !aiInput.trim()} style={{ padding: "10px 16px", borderRadius: 8, background: aiInput.trim() ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.05)", border: "none", color: aiInput.trim() ? "#fff" : "rgba(255,255,255,0.2)", cursor: aiInput.trim() ? "pointer" : "default", fontSize: 12, fontWeight: 700 }}>Send</button>
      </div>
    </div>
  );
}
