import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip as RTooltip,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid
} from "recharts";
import {
  CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck,
  ChevronRight, Users, FileText, BarChart3, Lock, Unlock
} from "lucide-react";

const PHASES = [
  { key: "A", label: "Acceptance", color: "#42A5F5" },
  { key: "B", label: "Planning", color: "#FFA726" },
  { key: "C", label: "Execution", color: "#CE93D8" },
  { key: "D", label: "Completion", color: "#66BB6A" },
];

const PARTNER_GATES = [
  { id: 1, gate: "Client acceptance", phase: "A", status: "approved" },
  { id: 2, gate: "Independence confirmation", phase: "A", status: "approved" },
  { id: 3, gate: "Audit strategy sign-off", phase: "B", status: "approved" },
  { id: 4, gate: "Risk assessment approval", phase: "B", status: "pending" },
  { id: 5, gate: "Materiality approval", phase: "B", status: "pending" },
  { id: 6, gate: "Interim work review", phase: "C", status: "locked" },
  { id: 7, gate: "Key judgments review", phase: "C", status: "locked" },
  { id: 8, gate: "Going concern assessment", phase: "D", status: "locked" },
  { id: 9, gate: "Final analytical review", phase: "D", status: "locked" },
  { id: 10, gate: "Audit report sign-off", phase: "D", status: "locked" },
];

const FSLI_DATA = [
  { code: "REV", name: "Revenue", status: "reviewed", completion: 92 },
  { code: "COS", name: "Cost of Sales", status: "in_progress", completion: 65 },
  { code: "CSH", name: "Cash & Bank", status: "approved", completion: 100 },
  { code: "TRD", name: "Trade Receivables", status: "reviewed", completion: 88 },
  { code: "INV", name: "Inventory", status: "in_progress", completion: 45 },
  { code: "PPE", name: "Property, Plant & Equipment", status: "in_progress", completion: 55 },
  { code: "INT", name: "Intangible Assets", status: "not_started", completion: 0 },
  { code: "TRP", name: "Trade Payables", status: "reviewed", completion: 90 },
  { code: "ACR", name: "Accruals & Deferred Income", status: "in_progress", completion: 40 },
  { code: "TAX", name: "Taxation", status: "in_progress", completion: 30 },
  { code: "BRW", name: "Borrowings", status: "reviewed", completion: 85 },
  { code: "PRV", name: "Provisions", status: "not_started", completion: 0 },
  { code: "EQY", name: "Equity & Reserves", status: "approved", completion: 100 },
  { code: "PEN", name: "Pensions", status: "not_started", completion: 0 },
  { code: "LEA", name: "Leases (IFRS 16)", status: "in_progress", completion: 50 },
  { code: "GCN", name: "Going Concern", status: "not_started", completion: 0 },
  { code: "RPT", name: "Related Parties", status: "in_progress", completion: 35 },
  { code: "SEV", name: "Subsequent Events", status: "not_started", completion: 0 },
  { code: "PAY", name: "Payroll & Employment", status: "reviewed", completion: 82 },
  { code: "DEP", name: "Depreciation & Amortisation", status: "in_progress", completion: 60 },
];

const STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "#6B7A90", icon: Clock },
  in_progress: { label: "In Progress", color: "#FFA726", icon: AlertTriangle },
  reviewed: { label: "Reviewed", color: "#42A5F5", icon: FileText },
  approved: { label: "Approved", color: "#66BB6A", icon: CheckCircle2 },
};

const RISK_MATRIX_DATA = [
  { x: 2, y: 3, z: 200, name: "Revenue", risk: "High" },
  { x: 1, y: 2, z: 150, name: "Cash", risk: "Low" },
  { x: 3, y: 3, z: 180, name: "Inventory", risk: "High" },
  { x: 2, y: 2, z: 120, name: "Receivables", risk: "Medium" },
  { x: 1, y: 1, z: 100, name: "Equity", risk: "Low" },
  { x: 2, y: 1, z: 130, name: "PPE", risk: "Medium" },
  { x: 3, y: 2, z: 160, name: "Payables", risk: "Medium" },
  { x: 3, y: 1, z: 140, name: "Tax", risk: "Medium" },
];

const TEAM_MEMBERS = [
  { name: "James Parker", role: "Partner", initials: "JP" },
  { name: "Sarah Khan", role: "Manager", initials: "SK" },
  { name: "Robert Miles", role: "Senior", initials: "RM" },
  { name: "Alice Wong", role: "Assistant", initials: "AW" },
  { name: "David Chen", role: "Assistant", initials: "DC" },
];

const MATERIALITY_TABLE = [
  { benchmark: "PBT (5%)", value: 25000, pm: 15625, trivial: 1250 },
  { benchmark: "Revenue (0.5%)", value: 50000, pm: 31250, trivial: 2500 },
  { benchmark: "Revenue (1%)", value: 100000, pm: 62500, trivial: 5000 },
  { benchmark: "Assets (1%)", value: 75000, pm: 46875, trivial: 3750 },
];

export default function EngagementDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gates, setGates] = useState(PARTNER_GATES);
  const [activePhase, setActivePhase] = useState("B");

  const completionPct = useMemo(() => {
    const total = FSLI_DATA.reduce((sum, f) => sum + f.completion, 0);
    return Math.round(total / FSLI_DATA.length);
  }, []);

  const completionRadial = [{ name: "Completion", value: completionPct, fill: "#F5A623" }];

  const handleGateAction = (gateId, action) => {
    setGates((prev) =>
      prev.map((g) =>
        g.id === gateId ? { ...g, status: action === "approve" ? "approved" : "rejected" } : g
      )
    );
  };

  const fsliStatusCounts = useMemo(() => {
    const counts = { not_started: 0, in_progress: 0, reviewed: 0, approved: 0 };
    FSLI_DATA.forEach((f) => counts[f.status]++);
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8">
      {/* Phase Indicators */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {PHASES.map((phase, i) => {
          const isActive = phase.key === activePhase;
          const isDone = PHASES.findIndex((p) => p.key === activePhase) > i;
          return (
            <div key={phase.key} className="flex items-center gap-2">
              <button
                onClick={() => setActivePhase(phase.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "border-brand bg-brand/10"
                    : isDone
                    ? "border-ae-green/30 bg-ae-green/5"
                    : "border-ae-border bg-white/[0.02]"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive ? "bg-brand text-slate-900" : isDone ? "bg-ae-green text-white" : "bg-white/10 text-ae-dim"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : phase.key}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-brand" : isDone ? "text-ae-green" : "text-ae-dim"}`}>
                  {phase.label}
                </span>
              </button>
              {i < PHASES.length - 1 && (
                <ChevronRight className="h-4 w-4 text-ae-dim/50 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fsli">FSLIs</TabsTrigger>
          <TabsTrigger value="gates">Gates</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Completion Ring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overall Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="70%" outerRadius="90%"
                      startAngle={90} endAngle={-270}
                      data={completionRadial}
                    >
                      <RadialBar
                        background={{ fill: "rgba(255,255,255,0.05)" }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <div className="text-3xl font-bold text-white">{completionPct}%</div>
                    <div className="text-xs text-ae-dim">Complete</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FSLI Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">FSLI Status</CardTitle>
                <CardDescription>{FSLI_DATA.length} line items tracked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(fsliStatusCounts).map(([status, count]) => {
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-200">{cfg.label}</span>
                            <span className="text-sm font-semibold text-white">{count}</span>
                          </div>
                          <Progress
                            value={(count / FSLI_DATA.length) * 100}
                            className="h-1.5 mt-1"
                            indicatorClassName="rounded-full"
                            style={{ "--indicator-color": cfg.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Materiality */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Materiality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-brand/10 border border-brand/30 text-center">
                    <div className="text-xs text-ae-dim">Overall Materiality</div>
                    <div className="text-2xl font-bold text-brand">£25,000</div>
                    <div className="text-[10px] text-ae-dim">Benchmark: PBT (5%)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-ae-blue/10 border border-ae-blue/30 text-center">
                      <div className="text-[10px] text-ae-dim">PM</div>
                      <div className="text-lg font-bold text-ae-blue">£15,625</div>
                    </div>
                    <div className="p-3 rounded-lg bg-ae-orange/10 border border-ae-orange/30 text-center">
                      <div className="text-[10px] text-ae-dim">Trivial</div>
                      <div className="text-lg font-bold text-ae-orange">£1,250</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-ae-dim">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-ae-border/50">
                          <th className="text-left py-1 font-medium text-brand">Sensitivity</th>
                          <th className="text-right py-1 font-medium text-brand">OM</th>
                          <th className="text-right py-1 font-medium text-brand">PM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MATERIALITY_TABLE.map((row) => (
                          <tr key={row.benchmark} className="border-b border-ae-border/30">
                            <td className="py-1 text-slate-300">{row.benchmark}</td>
                            <td className="py-1 text-right text-slate-300">£{row.value.toLocaleString()}</td>
                            <td className="py-1 text-right text-slate-300">£{row.pm.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FSLI Grid Tab */}
        <TabsContent value="fsli">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Statement Line Items</CardTitle>
              <CardDescription>Click any FSLI to open its work paper</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {FSLI_DATA.map((fsli) => {
                  const cfg = STATUS_CONFIG[fsli.status];
                  return (
                    <button
                      key={fsli.code}
                      onClick={() => navigate(`/engagement/${id}/fsli/${fsli.code}`)}
                      className="text-left p-3 rounded-lg border border-ae-border bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono text-[10px]">{fsli.code}</Badge>
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: cfg.color }} />
                      </div>
                      <div className="text-xs font-medium text-white truncate group-hover:text-brand transition-colors">
                        {fsli.name}
                      </div>
                      <Progress value={fsli.completion} className="h-1 mt-2" />
                      <div className="text-[10px] text-ae-dim mt-1">{fsli.completion}% &middot; {cfg.label}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partner Gates Tab */}
        <TabsContent value="gates">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Partner Approval Gates</CardTitle>
              <CardDescription>10 gates across 4 audit phases (partnerAuthorityEngine)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gates.map((gate) => {
                  const phase = PHASES.find((p) => p.key === gate.phase);
                  return (
                    <div
                      key={gate.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02]"
                    >
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: phase.color + "22", color: phase.color }}>
                        {gate.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{gate.gate}</div>
                        <div className="text-[10px] text-ae-dim">Phase {gate.phase}: {phase.label}</div>
                      </div>
                      <div>
                        {gate.status === "approved" && (
                          <Badge variant="success">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                          </Badge>
                        )}
                        {gate.status === "rejected" && (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" /> Rejected
                          </Badge>
                        )}
                        {gate.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success" onClick={() => handleGateAction(gate.id, "approve")} className="text-xs h-7 bg-ae-green hover:bg-ae-green/80 text-white">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleGateAction(gate.id, "reject")} className="text-xs h-7">
                              Reject
                            </Button>
                          </div>
                        )}
                        {gate.status === "locked" && (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" /> Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Matrix</CardTitle>
              <CardDescription>Interactive risk-control-procedure mapping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Likelihood"
                      domain={[0, 4]}
                      tick={{ fill: "#B0B8C8", fontSize: 11 }}
                      axisLine={false}
                      label={{ value: "Likelihood", position: "bottom", fill: "#B0B8C8", fontSize: 11 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Impact"
                      domain={[0, 4]}
                      tick={{ fill: "#B0B8C8", fontSize: 11 }}
                      axisLine={false}
                      label={{ value: "Impact", angle: -90, position: "left", fill: "#B0B8C8", fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <RTooltip
                      contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                      formatter={(value, name, props) => {
                        if (name === "z") return [props.payload.name, "FSLI"];
                        return [value, name];
                      }}
                    />
                    <Scatter
                      data={RISK_MATRIX_DATA}
                      fill="#F5A623"
                      fillOpacity={0.7}
                      stroke="#F5A623"
                      strokeWidth={1}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <Avatar>
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-white">{member.name}</div>
                      <Badge variant={member.role === "Partner" ? "default" : "secondary"} className="text-[10px] mt-1">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
