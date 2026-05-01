import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";
import {
  LayoutDashboard, Plus, BarChart3, ShieldCheck, Bell, Clock, Users,
  FileCheck, AlertTriangle, CheckCircle2, ArrowRight, TrendingUp, Briefcase
} from "lucide-react";
import { listEngagements, createEngagement, setActiveEngagementId, createStorageEngine } from "../StorageEngine";
import { DEMO_ENGAGEMENT } from "@/data/demoEngagement";

const STATUS_COLORS = {
  planning: "#42A5F5",
  execution: "#FFA726",
  completion: "#CE93D8",
  review: "#66BB6A",
  draft: "#B0B8C8",
};

const DEMO_ACTIVITY = [
  { id: 1, action: "Risk assessment completed", engagement: "Acme Holdings Ltd", user: "SK", time: "2 hours ago", type: "success" },
  { id: 2, action: "Partner approval pending — Gate 3", engagement: "Meridian Finance PLC", user: "JP", time: "4 hours ago", type: "warning" },
  { id: 3, action: "Journal testing flagged 3 anomalies", engagement: "Oakhaven Charity", user: "AI", time: "5 hours ago", type: "destructive" },
  { id: 4, action: "Materiality recalculated", engagement: "BuildRight Construction", user: "RM", time: "6 hours ago", type: "info" },
  { id: 5, action: "FSLI Revenue — review complete", engagement: "Acme Holdings Ltd", user: "SK", time: "1 day ago", type: "success" },
  { id: 6, action: "New engagement created", engagement: "TechVenture Ltd", user: "JP", time: "1 day ago", type: "info" },
];

const OVERDUE_ITEMS = [
  { name: "Bank confirmations", engagement: "Meridian Finance", days: 5 },
  { name: "Inventory count attendance", engagement: "BuildRight", days: 3 },
  { name: "Going concern assessment", engagement: "Oakhaven Charity", days: 2 },
];

const demoNow = Date.now();

export default function MainDashboard() {
  const navigate = useNavigate();
  const [engagements, setEngagements] = useState([]);

  useEffect(() => {
    setTimeout(() => { setEngagements(listEngagements()); }, 0);
  }, []);

  const stats = {
    total: engagements.length || 12,
    planning: 3,
    execution: 5,
    completion: 2,
    review: 2,
  };

  const frcScore = 78;
  const teamUtilisation = 72;

  const statusData = [
    { name: "Planning", value: stats.planning, color: STATUS_COLORS.planning },
    { name: "Execution", value: stats.execution, color: STATUS_COLORS.execution },
    { name: "Completion", value: stats.completion, color: STATUS_COLORS.completion },
    { name: "Review", value: stats.review, color: STATUS_COLORS.review },
  ];

  const monthlyData = [
    { month: "Oct", engagements: 4 },
    { month: "Nov", engagements: 6 },
    { month: "Dec", engagements: 8 },
    { month: "Jan", engagements: 12 },
    { month: "Feb", engagements: 10 },
    { month: "Mar", engagements: 14 },
  ];

  const handleNewEngagement = () => {
    navigate("/engagement/new");
  };

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-ae-dim text-sm mt-1">Welcome back. Here's your audit practice overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-ae-red text-[10px] flex items-center justify-center text-white font-bold">3</span>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button onClick={handleNewEngagement} className="gap-2">
          <Plus className="h-4 w-4" /> New Engagement
        </Button>
        <Button variant="outline" onClick={() => {
          const demoId = createEngagement("BuildRight Construction Ltd (Demo)");
          const engine = createStorageEngine(demoId);
          Object.entries(DEMO_ENGAGEMENT).forEach(([key, value]) => {
            engine.saveImmediate(key, value);
          });
          setActiveEngagementId(demoId);
          navigate(`/engagement/${demoId}`);
        }} className="gap-2 border-brand/40 text-brand hover:bg-brand/10">
          <Briefcase className="h-4 w-4" /> Launch Demo
        </Button>
        <Button variant="outline" onClick={() => navigate("/analytics")} className="gap-2">
          <BarChart3 className="h-4 w-4" /> Run Analytics
        </Button>
        <Button variant="outline" onClick={() => navigate("/partner")} className="gap-2">
          <ShieldCheck className="h-4 w-4" /> Partner Approvals
        </Button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-ae-blue/20 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-ae-blue" />
              </div>
              <Badge variant="info">{stats.execution} active</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-ae-dim text-sm mt-1">Total Engagements</p>
            <div className="flex gap-2 mt-3">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10px] text-ae-dim">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-ae-green/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-ae-green" />
              </div>
              <Badge variant={frcScore >= 75 ? "success" : frcScore >= 50 ? "warning" : "destructive"}>
                {frcScore >= 75 ? "Good" : frcScore >= 50 ? "Fair" : "Poor"}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white">{frcScore}%</div>
            <p className="text-ae-dim text-sm mt-1">FRC Readiness Score</p>
            <Progress value={frcScore} className="mt-3 h-2" indicatorClassName="bg-ae-green" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-ae-red/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-ae-red" />
              </div>
              <Badge variant="destructive">{OVERDUE_ITEMS.length} items</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{OVERDUE_ITEMS.length}</div>
            <p className="text-ae-dim text-sm mt-1">Overdue Items</p>
            <div className="mt-3 space-y-1">
              {OVERDUE_ITEMS.map((item, i) => (
                <div key={i} className="text-[10px] text-ae-red/80 truncate">
                  {item.name} — {item.days}d overdue
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-ae-purple/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-ae-purple" />
              </div>
              <Badge variant="secondary">{teamUtilisation}%</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{teamUtilisation}%</div>
            <p className="text-ae-dim text-sm mt-1">Team Utilisation</p>
            <Progress value={teamUtilisation} className="mt-3 h-2" indicatorClassName="bg-ae-purple" />
          </CardContent>
        </Card>
      </div>

      {/* Charts + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Engagement by Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagements by Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-ae-dim">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RTooltip
                    contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                  />
                  <Bar dataKey="engagements" fill="#F5A623" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-56">
              <div className="space-y-3">
                {DEMO_ACTIVITY.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Avatar className="h-7 w-7 mt-0.5">
                      <AvatarFallback className="text-[10px]">{a.user}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 leading-relaxed">{a.action}</p>
                      <p className="text-[10px] text-ae-dim mt-0.5 truncate">{a.engagement}</p>
                    </div>
                    <span className="text-[10px] text-ae-dim whitespace-nowrap">{a.time}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Engagements Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Active Engagements</CardTitle>
            <CardDescription>Your current audit engagements</CardDescription>
          </div>
          <Button size="sm" onClick={handleNewEngagement} className="gap-1">
            <Plus className="h-3 w-3" /> New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(engagements.length > 0 ? engagements : [
              { id: "demo-1", name: "Acme Holdings Ltd", created: demoNow - 86400000 * 30 },
              { id: "demo-2", name: "Meridian Finance PLC", created: demoNow - 86400000 * 15 },
              { id: "demo-3", name: "BuildRight Construction", created: demoNow - 86400000 * 7 },
              { id: "demo-4", name: "Oakhaven Charity", created: demoNow - 86400000 * 3 },
            ]).map((eng, i) => {
              const phases = ["Planning", "Execution", "Completion", "Review"];
              const phase = phases[i % 4];
              const progress = [35, 62, 88, 95][i % 4];
              return (
                <div
                  key={eng.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors group"
                  onClick={() => {
                    if (eng.id.startsWith("demo-")) {
                      // Create a real engagement from demo data
                      const realId = createEngagement(eng.name);
                      setActiveEngagementId(realId);
                      navigate(`/engagement/${realId}`);
                    } else {
                      setActiveEngagementId(eng.id);
                      navigate(`/engagement/${eng.id}`);
                    }
                  }}
                >
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: STATUS_COLORS[phase.toLowerCase()] + "22", color: STATUS_COLORS[phase.toLowerCase()] }}>
                    {(eng.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{eng.name}</div>
                    <div className="text-[10px] text-ae-dim mt-0.5">
                      Created {new Date(eng.created).toLocaleDateString()} &middot; Phase: {phase}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-white font-medium">{progress}%</div>
                      <Progress value={progress} className="w-20 h-1.5 mt-1" />
                    </div>
                    <Badge variant={phase === "Review" ? "success" : phase === "Execution" ? "warning" : "secondary"} className="text-[10px]">
                      {phase}
                    </Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ae-dim group-hover:text-brand transition-colors" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
