import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as RTooltip, RadialBarChart, RadialBar, LineChart, Line, Legend
} from "recharts";
import {
  CheckCircle2, XCircle, Clock, ShieldCheck, AlertTriangle,
  Calendar, PoundSterling, Users, TrendingUp, ArrowRight
} from "lucide-react";

const PARTNER_ENGAGEMENTS = [
  { id: "eng-001", name: "Acme Holdings Ltd", phase: "Execution", progress: 62, quality: 85, team: ["SK", "RM", "AW"], deadline: "2026-06-30", status: "on_track" },
  { id: "eng-002", name: "Meridian Finance PLC", phase: "Planning", progress: 35, quality: 78, team: ["DC", "LT"], deadline: "2026-07-31", status: "on_track" },
  { id: "eng-003", name: "BuildRight Construction", phase: "Completion", progress: 88, quality: 92, team: ["SK", "AW", "TJ"], deadline: "2026-05-15", status: "at_risk" },
  { id: "eng-004", name: "Oakhaven Charity", phase: "Execution", progress: 45, quality: 70, team: ["RM", "DC"], deadline: "2026-08-31", status: "on_track" },
  { id: "eng-005", name: "TechVenture Ltd", phase: "Planning", progress: 20, quality: 0, team: ["LT"], deadline: "2026-09-30", status: "on_track" },
];

const PENDING_APPROVALS = [
  { id: 1, engagement: "Acme Holdings Ltd", gate: "Risk assessment approval", phase: "B", urgency: "high", submitted: "2 days ago", submittedBy: "Sarah Khan" },
  { id: 2, engagement: "Acme Holdings Ltd", gate: "Materiality approval", phase: "B", urgency: "high", submitted: "2 days ago", submittedBy: "Sarah Khan" },
  { id: 3, engagement: "BuildRight Construction", gate: "Going concern assessment", phase: "D", urgency: "critical", submitted: "5 hours ago", submittedBy: "Robert Miles" },
  { id: 4, engagement: "Oakhaven Charity", gate: "Audit strategy sign-off", phase: "B", urgency: "medium", submitted: "1 day ago", submittedBy: "David Chen" },
];

const TEAM_PERFORMANCE = [
  { name: "Sarah Khan", role: "Manager", engagements: 3, utilisation: 92, quality: 88, onTime: 95 },
  { name: "Robert Miles", role: "Senior", engagements: 2, utilisation: 85, quality: 82, onTime: 90 },
  { name: "Alice Wong", role: "Assistant", engagements: 2, utilisation: 78, quality: 75, onTime: 88 },
  { name: "David Chen", role: "Assistant", engagements: 2, utilisation: 70, quality: 80, onTime: 85 },
  { name: "Lisa Thompson", role: "Senior", engagements: 2, utilisation: 82, quality: 85, onTime: 92 },
  { name: "Tom Jones", role: "Assistant", engagements: 1, utilisation: 65, quality: 78, onTime: 90 },
];

const REVENUE_DATA = [
  { engagement: "Acme Holdings", quoted: 45000, actual: 42000, billed: 35000 },
  { engagement: "Meridian Finance", quoted: 85000, actual: 32000, billed: 20000 },
  { engagement: "BuildRight", quoted: 35000, actual: 38000, billed: 36000 },
  { engagement: "Oakhaven Charity", quoted: 22000, actual: 15000, billed: 10000 },
  { engagement: "TechVenture", quoted: 55000, actual: 8000, billed: 0 },
];

const QUALITY_TREND = [
  { month: "Oct", score: 72 },
  { month: "Nov", score: 75 },
  { month: "Dec", score: 74 },
  { month: "Jan", score: 78 },
  { month: "Feb", score: 80 },
  { month: "Mar", score: 82 },
];

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);

  const handleApproval = (id, _action) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  const totalQuoted = REVENUE_DATA.reduce((s, r) => s + r.quoted, 0);
  const totalActual = REVENUE_DATA.reduce((s, r) => s + r.actual, 0);
  const totalBilled = REVENUE_DATA.reduce((s, r) => s + r.billed, 0);

  const deadlines = PARTNER_ENGAGEMENTS
    .map((e) => ({ ...e, daysLeft: Math.ceil((new Date(e.deadline) - new Date()) / 86400000) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">Partner Dashboard</h1>
          <p className="text-ae-dim text-sm mt-1">Oversight, approvals, and portfolio management</p>
        </div>
        <Badge variant="default" className="text-sm px-3 py-1">
          <ShieldCheck className="h-4 w-4 mr-1" /> {approvals.length} pending approvals
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-ae-blue/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-ae-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{PARTNER_ENGAGEMENTS.length}</div>
                <div className="text-xs text-ae-dim">Active Engagements</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-ae-orange/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-ae-orange" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{approvals.length}</div>
                <div className="text-xs text-ae-dim">Pending Approvals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-ae-green/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-ae-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">82%</div>
                <div className="text-xs text-ae-dim">Avg Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-ae-purple/20 flex items-center justify-center">
                <PoundSterling className="h-4 w-4 text-ae-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">£{(totalBilled / 1000).toFixed(0)}k</div>
                <div className="text-xs text-ae-dim">Billed / £{(totalQuoted / 1000).toFixed(0)}k quoted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="engagements">Engagements</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Approvals Tab */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Approvals</CardTitle>
              <CardDescription>From partnerAuthorityEngine — 10 gates across the audit lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              {approvals.length === 0 ? (
                <div className="text-center py-12 text-ae-dim">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-ae-green opacity-50" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs mt-1">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvals.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                      <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                        a.urgency === "critical" ? "bg-ae-red animate-pulse" : a.urgency === "high" ? "bg-ae-orange" : "bg-ae-blue"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{a.gate}</div>
                        <div className="text-[10px] text-ae-dim mt-0.5">
                          {a.engagement} &middot; Phase {a.phase} &middot; Submitted by {a.submittedBy} &middot; {a.submitted}
                        </div>
                      </div>
                      <Badge variant={a.urgency === "critical" ? "destructive" : a.urgency === "high" ? "warning" : "info"} className="text-[10px]">
                        {a.urgency}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproval(a.id, "approve")} className="text-xs h-8 bg-ae-green hover:bg-ae-green/80 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleApproval(a.id, "reject")} className="text-xs h-8">
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filing Deadlines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Filing Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deadlines.map((d) => (
                  <div key={d.id} className="flex items-center gap-4 p-3 rounded-lg border border-ae-border">
                    <div className={`text-xl font-bold w-12 text-center ${
                      d.daysLeft < 30 ? "text-ae-red" : d.daysLeft < 90 ? "text-ae-orange" : "text-ae-green"
                    }`}>
                      {d.daysLeft}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white">{d.name}</div>
                      <div className="text-[10px] text-ae-dim">
                        Deadline: {new Date(d.deadline).toLocaleDateString("en-GB")} &middot; {d.phase}
                      </div>
                    </div>
                    <Badge variant={d.status === "at_risk" ? "destructive" : "success"} className="text-[10px]">
                      {d.status === "at_risk" ? "At Risk" : "On Track"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagements Tab */}
        <TabsContent value="engagements">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Engagements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PARTNER_ENGAGEMENTS.map((eng) => (
                  <div
                    key={eng.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                    onClick={() => navigate(`/engagement/${eng.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{eng.name}</div>
                      <div className="text-[10px] text-ae-dim mt-0.5">
                        {eng.phase} &middot; Deadline: {new Date(eng.deadline).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {eng.team.map((t) => (
                        <Avatar key={t} className="h-6 w-6 -ml-1 first:ml-0 border-2 border-slate-900">
                          <AvatarFallback className="text-[8px]">{t}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="text-right w-20">
                      <div className="text-xs text-white font-medium">{eng.progress}%</div>
                      <Progress value={eng.progress} className="h-1.5 mt-1" />
                    </div>
                    <Badge variant={eng.quality >= 80 ? "success" : eng.quality >= 60 ? "warning" : "secondary"} className="text-[10px] w-16 justify-center">
                      Q: {eng.quality || "—"}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-ae-dim" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ae-border">
                      <th className="text-left py-3 text-xs text-brand uppercase tracking-wider font-semibold">Name</th>
                      <th className="text-left py-3 text-xs text-brand uppercase tracking-wider font-semibold">Role</th>
                      <th className="text-center py-3 text-xs text-brand uppercase tracking-wider font-semibold">Engagements</th>
                      <th className="text-center py-3 text-xs text-brand uppercase tracking-wider font-semibold">Utilisation</th>
                      <th className="text-center py-3 text-xs text-brand uppercase tracking-wider font-semibold">Quality</th>
                      <th className="text-center py-3 text-xs text-brand uppercase tracking-wider font-semibold">On-Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_PERFORMANCE.map((member) => (
                      <tr key={member.name} className="border-b border-ae-border/50 hover:bg-white/[0.03]">
                        <td className="py-3 text-slate-200 font-medium">{member.name}</td>
                        <td className="py-3"><Badge variant="secondary" className="text-[10px]">{member.role}</Badge></td>
                        <td className="py-3 text-center text-slate-300">{member.engagements}</td>
                        <td className="py-3 text-center">
                          <span className={member.utilisation > 85 ? "text-ae-orange" : "text-ae-green"}>
                            {member.utilisation}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={member.quality >= 80 ? "text-ae-green" : "text-ae-orange"}>
                            {member.quality}%
                          </span>
                        </td>
                        <td className="py-3 text-center text-slate-300">{member.onTime}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quality Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={QUALITY_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} />
                      <YAxis domain={[60, 100]} tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} />
                      <RTooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }} />
                      <Line type="monotone" dataKey="score" stroke="#F5A623" strokeWidth={2} dot={{ fill: "#F5A623" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quality by Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PARTNER_ENGAGEMENTS.filter((e) => e.quality > 0).map((eng) => (
                    <div key={eng.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-200">{eng.name}</span>
                        <span className={`text-sm font-medium ${eng.quality >= 80 ? "text-ae-green" : "text-ae-orange"}`}>
                          {eng.quality}%
                        </span>
                      </div>
                      <Progress
                        value={eng.quality}
                        className="h-2"
                        indicatorClassName={eng.quality >= 80 ? "bg-ae-green" : "bg-ae-orange"}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PoundSterling className="h-4 w-4" /> Revenue: Quoted vs Actual vs Billed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="engagement" tick={{ fill: "#B0B8C8", fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`} />
                    <RTooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }} formatter={(v) => `£${v.toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#B0B8C8" }} />
                    <Bar dataKey="quoted" fill="#42A5F5" radius={[3, 3, 0, 0]} name="Quoted" />
                    <Bar dataKey="actual" fill="#F5A623" radius={[3, 3, 0, 0]} name="Actual" />
                    <Bar dataKey="billed" fill="#66BB6A" radius={[3, 3, 0, 0]} name="Billed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-ae-blue/10 border border-ae-blue/30 text-center">
                  <div className="text-xs text-ae-dim">Total Quoted</div>
                  <div className="text-xl font-bold text-ae-blue">£{totalQuoted.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-brand/10 border border-brand/30 text-center">
                  <div className="text-xs text-ae-dim">Total Actual</div>
                  <div className="text-xl font-bold text-brand">£{totalActual.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-ae-green/10 border border-ae-green/30 text-center">
                  <div className="text-xs text-ae-dim">Total Billed</div>
                  <div className="text-xl font-bold text-ae-green">£{totalBilled.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
