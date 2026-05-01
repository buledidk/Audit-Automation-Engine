import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, // eslint-disable-line no-unused-vars
  Zap, ShieldCheck, BarChart3, Users, Calendar, Brain
} from "lucide-react";

import { useEngagement } from "@/context/EngagementContext";

const PHASE_LABELS = { A: "Acceptance", B: "Planning", C: "Execution", D: "Completion" };
const PHASE_COLORS = { A: "#42A5F5", B: "#FFA726", C: "#CE93D8", D: "#66BB6A" };

const GATES = [
  { id: 1, gate: "Client acceptance", phase: "A", wpId: "a2" },
  { id: 2, gate: "Independence confirmation", phase: "A", wpId: "a1" },
  { id: 3, gate: "Audit strategy sign-off", phase: "B", wpId: "a3" },
  { id: 4, gate: "Risk assessment approval", phase: "B", wpId: "b1" },
  { id: 5, gate: "Materiality approval", phase: "B", wpId: "a4" },
  { id: 6, gate: "Interim work review", phase: "C", wpId: null },
  { id: 7, gate: "Key judgments review", phase: "C", wpId: null },
  { id: 8, gate: "Going concern assessment", phase: "D", wpId: "a7" },
  { id: 9, gate: "Final analytical review", phase: "D", wpId: "e2" },
  { id: 10, gate: "Audit report sign-off", phase: "D", wpId: "e6" },
];

export default function EngagementOverview() {
  const navigate = useNavigate();
  const { _engId } = useOutletContext() || {};

  const ctx = useEngagement();

  const cfg = ctx?.cfg || {};
  const signOffs = ctx?.signOffs || {};
  const changeLog = ctx?.changeLog || [];
  const reviewNotes = ctx?.reviewNotes || {};
  const customItems = ctx?.customItems || { risks: [] };
  const uploads = ctx?.uploads || {};

  // Compute stats from real data
  const stats = useMemo(() => {
    const allWPs = Object.keys(signOffs);
    const prepared = allWPs.filter(k => signOffs[k]?.preparedBy).length;
    const reviewed = allWPs.filter(k => signOffs[k]?.reviewedBy).length;
    const approved = allWPs.filter(k => signOffs[k]?.approvedBy).length;
    const openNotes = Object.values(reviewNotes).flat().filter(n => n?.status === "raised" || n?.status === "responded").length;
    const findings = customItems.risks?.length || 0;
    const evidenceFiles = Object.values(uploads).flat().length;
    return { prepared, reviewed, approved, openNotes, findings, evidenceFiles, totalWPs: Math.max(allWPs.length, 25) };
  }, [signOffs, reviewNotes, customItems, uploads]);

  const completionPct = stats.totalWPs > 0 ? Math.round((stats.prepared / stats.totalWPs) * 100) : 0;

  // Determine current phase
  const currentPhase = useMemo(() => {
    if (stats.approved > 15) return "D";
    if (stats.prepared > 10) return "C";
    if (stats.prepared > 3) return "B";
    return "A";
  }, [stats]);

  // Gate status from sign-offs
  const gateStatuses = useMemo(() => {
    return GATES.map(g => {
      if (g.wpId && signOffs[g.wpId]?.approvedBy) return { ...g, status: "approved" };
      if (g.wpId && signOffs[g.wpId]?.reviewedBy) return { ...g, status: "pending" };
      return { ...g, status: "locked" };
    });
  }, [signOffs]);

  const pendingGates = gateStatuses.filter(g => g.status === "pending").length;

  // Action items
  const actionItems = useMemo(() => {
    const items = [];
    if (stats.openNotes > 0) items.push({ label: `${stats.openNotes} open review notes`, action: () => navigate("review"), icon: AlertTriangle, color: "text-ae-red" });
    if (pendingGates > 0) items.push({ label: `${pendingGates} gates awaiting partner approval`, action: () => {}, icon: ShieldCheck, color: "text-ae-orange" });
    if (!cfg.configured) items.push({ label: "Configure engagement details", action: () => navigate("settings"), icon: FileText, color: "text-ae-blue" });
    if (stats.prepared < 5) items.push({ label: "Start working paper preparation", action: () => navigate("procedures"), icon: Clock, color: "text-ae-dim" });
    return items;
  }, [stats, pendingGates, cfg, navigate]);

  // Recharts data
  const completionRadial = [{ name: "Done", value: completionPct, fill: "#F5A623" }];
  const phaseData = [
    { name: "Acceptance", value: gateStatuses.filter(g => g.phase === "A" && g.status === "approved").length, color: PHASE_COLORS.A },
    { name: "Planning", value: gateStatuses.filter(g => g.phase === "B" && g.status === "approved").length, color: PHASE_COLORS.B },
    { name: "Execution", value: Math.max(1, stats.prepared - 5), color: PHASE_COLORS.C },
    { name: "Completion", value: gateStatuses.filter(g => g.phase === "D" && g.status === "approved").length, color: PHASE_COLORS.D },
  ];

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-6">
      {/* Welcome Banner */}
      <Card className="mb-6 border-brand/20 bg-gradient-to-r from-brand/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-white">
                {cfg.entityName || "New Engagement"}
              </h1>
              <p className="text-ae-dim text-sm mt-1">
                {cfg.fye ? `Year End: ${cfg.fye}` : ""} {cfg.industry ? `· ${cfg.industry}` : ""} {cfg.framework ? `· ${cfg.framework.toUpperCase()}` : ""}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="default" className="text-xs">Phase {currentPhase}: {PHASE_LABELS[currentPhase]}</Badge>
                <Badge variant="secondary" className="text-xs">{completionPct}% complete</Badge>
                {stats.openNotes > 0 && <Badge variant="destructive" className="text-xs">{stats.openNotes} open notes</Badge>}
              </div>
            </div>
            <div className="h-20 w-20 hidden sm:block">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="95%" startAngle={90} endAngle={-270} data={completionRadial}>
                  <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required */}
      {actionItems.length > 0 && (
        <Card className="mb-6 border-ae-orange/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-ae-orange">
              <Zap className="h-4 w-4" /> Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {actionItems.map((item, i) => {
                return (
                  <button key={i} onClick={item.action} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm text-slate-200 flex-1">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-ae-dim" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Prepared", value: stats.prepared, icon: FileText, color: "text-ae-orange", bg: "bg-ae-orange/10" },
          { label: "Reviewed", value: stats.reviewed, icon: CheckCircle2, color: "text-ae-blue", bg: "bg-ae-blue/10" },
          { label: "Approved", value: stats.approved, icon: ShieldCheck, color: "text-ae-green", bg: "bg-ae-green/10" },
          { label: "Open Notes", value: stats.openNotes, icon: AlertTriangle, color: "text-ae-red", bg: "bg-ae-red/10" },
        ].map((stat) => {
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-ae-dim">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Phase Progress + Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Audit Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {["A", "B", "C", "D"].map((p, i) => (
                <div key={p} className="flex items-center gap-2 flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentPhase === p ? "ring-2 ring-brand" : ""
                  }`} style={{
                    background: p <= currentPhase ? PHASE_COLORS[p] + "33" : "rgba(255,255,255,0.05)",
                    color: p <= currentPhase ? PHASE_COLORS[p] : "#6B7A90"
                  }}>
                    {p <= currentPhase ? <CheckCircle2 className="h-4 w-4" /> : p}
                  </div>
                  {i < 3 && <div className="flex-1 h-0.5 rounded" style={{ background: p < currentPhase ? PHASE_COLORS[p] : "rgba(255,255,255,0.1)" }} />}
                </div>
              ))}
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={phaseData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                    {phaseData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Partner Gates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Partner Approval Gates</CardTitle>
            <CardDescription>{pendingGates} pending · {gateStatuses.filter(g => g.status === "approved").length} approved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {gateStatuses.map((g) => (
                <div key={g.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-white/5">
                  <span className="w-5 text-center">
                    {g.status === "approved" ? <CheckCircle2 className="h-3.5 w-3.5 text-ae-green inline" /> :
                     g.status === "pending" ? <Clock className="h-3.5 w-3.5 text-ae-orange inline" /> :
                     <span className="text-ae-dim">○</span>}
                  </span>
                  <span className={`flex-1 ${g.status === "approved" ? "text-ae-dim" : "text-slate-300"}`}>{g.gate}</span>
                  <Badge variant={g.status === "approved" ? "success" : g.status === "pending" ? "warning" : "secondary"} className="text-[8px] h-4">
                    {g.status === "approved" ? "Done" : g.status === "pending" ? "Pending" : "Locked"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Procedures", to: "procedures", icon: BarChart3, count: `${stats.prepared}/${stats.totalWPs}` },
          { label: "Evidence", to: "evidence", icon: FileText, count: `${stats.evidenceFiles} files` },
          { label: "Findings", to: "findings", icon: AlertTriangle, count: `${stats.findings} items` },
          { label: "Full Audit File", to: "full", icon: Users, count: "Export" },
        ].map((item) => {
          return (
            <button key={item.label} onClick={() => navigate(item.to)} className="p-4 rounded-lg border border-ae-border bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left cursor-pointer group">
              <Icon className="h-5 w-5 text-ae-dim group-hover:text-brand transition-colors mb-2" />
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-[10px] text-ae-dim">{item.count}</div>
            </button>
          );
        })}
      </div>

      {/* AI Suggestions */}
      <AISuggestionsPanel
        className="mb-6"
        suggestions={[
          { title: "Next step: Prepare Revenue testing (D1)", description: "Revenue is the highest-risk FSLI. Start with ISA 240.26 procedures — sample selection, cutoff testing, and analytical review.", confidence: "high", source: "AuditPhasesEngine", isaRef: "ISA 240.26" },
          { title: "FRC focus: Challenge management estimates", description: "FRC AQR 2024/25 highlighted insufficient auditor challenge of estimates. Ensure independent assessment documented for all Level 3 valuations.", confidence: "medium", source: "FRCAqrFindings", isaRef: "ISA 540.13" },
        ]}
      />

      {/* AI Agents Status */}
      <Card className="mb-6 border-ae-purple/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-ae-purple" /> AI Agents — Active on this Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Planning Agent", status: "complete", recommendation: "Audit strategy generated", isa: "ISA 300" },
              { name: "Risk Agent", status: "active", recommendation: "3 significant risks identified", isa: "ISA 315" },
              { name: "Fraud Agent", status: "active", recommendation: "Revenue recognition flagged", isa: "ISA 240" },
              { name: "Testing Agent", status: "pending", recommendation: "Sample sizes calculated", isa: "ISA 530" },
              { name: "Estimation Agent", status: "pending", recommendation: "WIP valuation needs review", isa: "ISA 540" },
              { name: "Going Concern", status: "pending", recommendation: "Altman Z-Score: 2.85 (Safe)", isa: "ISA 570" },
              { name: "Journal Testing", status: "active", recommendation: "Benford's Law — no anomalies", isa: "ISA 240.32" },
              { name: "Review Agent", status: "waiting", recommendation: "Awaiting completion phase", isa: "ISA 220" },
            ].map((agent) => (
              <div key={agent.name} className="p-3 rounded-lg border border-ae-border bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`h-2 w-2 rounded-full ${
                    agent.status === "complete" ? "bg-ae-green" :
                    agent.status === "active" ? "bg-brand animate-pulse" :
                    agent.status === "pending" ? "bg-ae-orange" :
                    "bg-ae-dim"
                  }`} />
                  <span className="text-[10px] font-medium text-white">{agent.name}</span>
                </div>
                <p className="text-[9px] text-ae-dim leading-relaxed">{agent.recommendation}</p>
                <Badge variant="outline" className="text-[8px] mt-1 px-1 py-0 h-3.5">{agent.isa}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Materiality + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Materiality</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-brand/10 border border-brand/30 text-center">
                <div className="text-[10px] text-ae-dim">Overall</div>
                <div className="text-lg font-bold text-brand">{cfg.materiality ? `£${Number(cfg.materiality).toLocaleString()}` : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-ae-blue/10 border border-ae-blue/30 text-center">
                <div className="text-[10px] text-ae-dim">PM</div>
                <div className="text-lg font-bold text-ae-blue">{cfg.perfMateriality ? `£${Number(cfg.perfMateriality).toLocaleString()}` : "—"}</div>
              </div>
              <div className="p-3 rounded-lg bg-ae-orange/10 border border-ae-orange/30 text-center">
                <div className="text-[10px] text-ae-dim">Trivial</div>
                <div className="text-lg font-bold text-ae-orange">{cfg.trivial ? `£${Number(cfg.trivial).toLocaleString()}` : "—"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Team</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { role: "Partner", name: cfg.partner },
                { role: "Manager", name: cfg.manager },
                { role: "Firm", name: cfg.firmName },
              ].filter(t => t.name).map((t) => (
                <div key={t.role} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[9px]">{(t.name || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-white">{t.name}</span>
                  <Badge variant="secondary" className="text-[8px] ml-auto">{t.role}</Badge>
                </div>
              ))}
              {!cfg.partner && !cfg.manager && (
                <p className="text-xs text-ae-dim">No team assigned. <button onClick={() => navigate("settings")} className="text-brand underline cursor-pointer">Configure</button></p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {changeLog.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {changeLog.slice(-8).reverse().map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-ae-dim p-1">
                  <Clock className="h-3 w-3" />
                  <span className="flex-1 truncate">{entry.action || entry.field || "Edit"}: {entry.wpId || entry.key}</span>
                  <span className="text-[10px]">{entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : ""}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
