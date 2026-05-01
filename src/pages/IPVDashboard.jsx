import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RTooltip, RadialBarChart, RadialBar
} from "recharts";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Download, FileText, Search, Eye
} from "lucide-react";
import { IPV_CONTROLS, ISA_620_CHECKLIST, IFRS13_HIERARCHY } from "@/services/ipvEngine";

const DEMO_PORTFOLIO = [
  { id: "sec1", name: "Vodafone Group PLC", type: "listed_security", ifrs13Level: 1, clientValue: 125000, independentValue: 124750, variancePct: 0.20, status: "agreed", ticker: "VOD.L", exchange: "LSE" },
  { id: "sec2", name: "UK Gilt 4.25% 2034", type: "listed_security", ifrs13Level: 1, clientValue: 985000, independentValue: 983200, variancePct: 0.18, status: "agreed", ticker: "UKT4.25", exchange: "LSE" },
  { id: "sec3", name: "HSBC Holdings PLC", type: "listed_security", ifrs13Level: 1, clientValue: 340000, independentValue: 342100, variancePct: 0.61, status: "agreed", ticker: "HSBA.L", exchange: "LSE" },
  { id: "sec4", name: "iShares Core FTSE 100 ETF", type: "listed_security", ifrs13Level: 1, clientValue: 250000, independentValue: 253500, variancePct: 1.40, status: "exception", ticker: "ISF.L", exchange: "LSE" },
  { id: "semi1", name: "Regional REIT Bond 6.5% 2027", type: "semi_listed", ifrs13Level: 2, clientValue: 180000, independentValue: 175000, variancePct: 2.86, status: "agreed", daysSinceLastTrade: 12 },
  { id: "semi2", name: "AIM Micro-Cap Holdings", type: "semi_listed", ifrs13Level: 2, clientValue: 95000, independentValue: 88000, variancePct: 7.95, status: "exception", daysSinceLastTrade: 45, isInactiveMarket: true },
  { id: "unl1", name: "Meridian PE Fund III", type: "unlisted", ifrs13Level: 3, clientValue: 520000, independentValue: 520000, variancePct: 0, status: "pending", methodology: "NAV" },
  { id: "unl2", name: "TechStart Ventures Ltd", type: "unlisted", ifrs13Level: 3, clientValue: 180000, independentValue: 180000, variancePct: 0, status: "pending", methodology: "Earnings multiple" },
  { id: "loan1", name: "Term Loan — Barclays", type: "loan_receivable", ifrs13Level: null, clientValue: 750000, independentValue: 748200, variancePct: 0.24, status: "agreed", creditRating: "A" },
  { id: "loan2", name: "Revolving Credit Facility", type: "loan_receivable", ifrs13Level: null, clientValue: 350000, independentValue: 352100, variancePct: 0.60, status: "agreed", creditRating: "BBB" },
  { id: "loan3", name: "Mortgage Book (secured)", type: "loan_receivable", ifrs13Level: null, clientValue: 1200000, independentValue: 1195000, variancePct: 0.42, status: "agreed", creditRating: "AA" },
  { id: "deriv1", name: "IRS 5yr Pay Fixed 4.5%", type: "derivative", ifrs13Level: 2, clientValue: 45000, independentValue: 42300, variancePct: 6.38, status: "exception", counterparty: "Barclays" },
  { id: "deriv2", name: "GBP/EUR FX Forward Jun-26", type: "derivative", ifrs13Level: 2, clientValue: 18000, independentValue: 17500, variancePct: 2.86, status: "agreed", counterparty: "HSBC" },
  { id: "prop1", name: "42 Chancery Lane, London", type: "investment_property", ifrs13Level: 3, clientValue: 2800000, independentValue: 2650000, variancePct: 5.66, status: "exception", methodology: "Yield-based" },
  { id: "prop2", name: "Unit 7, Meridian Business Park", type: "investment_property", ifrs13Level: 3, clientValue: 950000, independentValue: 920000, variancePct: 3.26, status: "agreed", methodology: "Comparable" },
];

const STATUS_CONFIG = {
  agreed: { label: "Agreed", color: "#66BB6A", icon: CheckCircle2 },
  exception: { label: "Exception", color: "#EF5350", icon: AlertTriangle },
  pending: { label: "Pending", color: "#FFA726", icon: Clock },
};

const TYPE_LABELS = {
  listed_security: "Listed Security",
  semi_listed: "Semi-Listed",
  unlisted: "Unlisted / PE",
  loan_receivable: "Loan / Receivable",
  derivative: "Derivative",
  investment_property: "Investment Property",
};

const SENSITIVITY_DATA = [
  { name: "Meridian PE Fund III", base: 520000, low20: 416000, low10: 468000, high10: 572000, high20: 624000 },
  { name: "TechStart Ventures", base: 180000, low20: 144000, low10: 162000, high10: 198000, high20: 216000 },
  { name: "42 Chancery Lane", base: 2800000, low20: 2240000, low10: 2520000, high10: 3080000, high20: 3360000 },
  { name: "Unit 7, Meridian BP", base: 950000, low20: 760000, low10: 855000, high10: 1045000, high20: 1140000 },
];

export default function IPVDashboard() {
  const { _id } = useParams();
  const [isa620Checks, setIsa620Checks] = useState(() => ISA_620_CHECKLIST.reduce((acc, c) => ({ ...acc, [c.id]: false }), {}));

  const portfolio = DEMO_PORTFOLIO;
  const totalPositions = portfolio.length;
  const verified = portfolio.filter(p => p.status !== "pending").length;
  const exceptions = portfolio.filter(p => p.status === "exception").length;
  const agreed = portfolio.filter(p => p.status === "agreed").length;
  const coveragePct = Math.round((verified / totalPositions) * 100);
  const totalClientValue = portfolio.reduce((s, p) => s + p.clientValue, 0);
  const totalIndepValue = portfolio.reduce((s, p) => s + p.independentValue, 0);

  const hierarchyData = (() => {
    const counts = { 1: 0, 2: 0, 3: 0 };
    const values = { 1: 0, 2: 0, 3: 0 };
    portfolio.forEach(p => { if (p.ifrs13Level) { counts[p.ifrs13Level]++; values[p.ifrs13Level] += p.clientValue; } });
    return [
      { name: "Level 1", count: counts[1], value: values[1], fill: "#42A5F5" },
      { name: "Level 2", count: counts[2], value: values[2], fill: "#FFA726" },
      { name: "Level 3", count: counts[3], value: values[3], fill: "#CE93D8" },
    ];
  })();

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-white">Independent Price Verification</h1>
          <p className="text-ae-dim text-sm mt-1">IFRS 13 Fair Value Hierarchy · ISA 540 · ISA 620</p>
        </div>
        <div className="flex gap-2">
          <Badge className="text-xs px-3 py-1">Phase C — Execution</Badge>
          <Button variant="outline" size="sm" className="gap-1"><Download className="h-3 w-3" /> Export</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-white">{totalPositions}</div><div className="text-[10px] text-ae-dim">Total Positions</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-ae-green">{agreed}</div><div className="text-[10px] text-ae-dim">Agreed</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-ae-red">{exceptions}</div><div className="text-[10px] text-ae-dim">Exceptions</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-ae-orange">{totalPositions - verified}</div><div className="text-[10px] text-ae-dim">Pending</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-brand">{coveragePct}%</div>
          <Progress value={coveragePct} className="h-1.5 mt-1" indicatorClassName="bg-brand" />
          <div className="text-[10px] text-ae-dim mt-1">Coverage</div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="hierarchy">IFRS 13</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Portfolio Overview</CardTitle>
              <CardDescription>Client value £{totalClientValue.toLocaleString()} · Independent £{totalIndepValue.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ae-border">
                      <th className="text-left py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Instrument</th>
                      <th className="text-left py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Type</th>
                      <th className="text-center py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Level</th>
                      <th className="text-right py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Client (£)</th>
                      <th className="text-right py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Indep. (£)</th>
                      <th className="text-right py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Var %</th>
                      <th className="text-center py-2 px-2 text-brand uppercase tracking-wider font-semibold text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((p) => {
                      const st = STATUS_CONFIG[p.status];
                      return (
                        <tr key={p.id} className="border-b border-ae-border/50 hover:bg-white/[0.03]">
                          <td className="py-2 px-2 text-slate-200 font-medium">{p.name}</td>
                          <td className="py-2 px-2 text-ae-dim">{TYPE_LABELS[p.type]}</td>
                          <td className="py-2 px-2 text-center">{p.ifrs13Level ? <Badge variant={p.ifrs13Level === 1 ? "info" : p.ifrs13Level === 2 ? "warning" : "secondary"} className="text-[9px]">L{p.ifrs13Level}</Badge> : "—"}</td>
                          <td className="py-2 px-2 text-right text-slate-300">£{p.clientValue.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-slate-300">£{p.independentValue.toLocaleString()}</td>
                          <td className={`py-2 px-2 text-right ${p.status === "exception" ? "text-ae-red font-medium" : "text-ae-dim"}`}>{p.variancePct.toFixed(2)}%</td>
                          <td className="py-2 px-2 text-center"><Badge variant={p.status === "agreed" ? "success" : p.status === "exception" ? "destructive" : "warning"} className="text-[9px] gap-1"><StIcon className="h-2.5 w-2.5" />{st.label}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-ae-border">
                      <td colSpan={3} className="py-2 px-2 text-xs font-semibold text-white">Total</td>
                      <td className="py-2 px-2 text-right text-white font-semibold">£{totalClientValue.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-white font-semibold">£{totalIndepValue.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-ae-dim">{totalIndepValue !== 0 ? (Math.abs((totalClientValue - totalIndepValue) / totalIndepValue) * 100).toFixed(2) : 0}%</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IFRS 13 Hierarchy Tab */}
        <TabsContent value="hierarchy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Fair Value Hierarchy — By Count</CardTitle></CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={hierarchyData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" stroke="none">{hierarchyData.map((d, i) => <Cell key={i} fill={d.fill} />)}</Pie><RTooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }} /></PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {hierarchyData.map(d => <div key={d.name} className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} /><span className="text-[10px] text-ae-dim">{d.name}: {d.count}</span></div>)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Fair Value Hierarchy — By Value</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hierarchyData.map(d => (
                    <div key={d.name}>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{d.name}</span><span className="text-white font-medium">£{d.value.toLocaleString()}</span></div>
                      <Progress value={(d.value / totalClientValue) * 100} className="h-2" indicatorClassName="rounded-full" style={{ "--tw-bg-opacity": 1 }} />
                      <div className="text-[9px] text-ae-dim mt-0.5">{((d.value / totalClientValue) * 100).toFixed(1)}% of portfolio</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-ae-border">
                  <div className="text-[10px] text-ae-dim leading-relaxed">
                    {Object.values(IFRS13_HIERARCHY).map(h => <div key={h.level} className="mb-1"><span className="font-semibold text-slate-300">{h.name}:</span> {h.examples}</div>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exceptions Tab */}
        <TabsContent value="exceptions">
          <Card>
            <CardHeader><CardTitle className="text-sm text-ae-red flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Exceptions — {exceptions} Items</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio.filter(p => p.status === "exception").map(p => (
                  <div key={p.id} className="p-4 rounded-lg border border-ae-red/20 bg-ae-red/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">{p.name}</div>
                      <Badge variant="destructive" className="text-[10px]">{p.variancePct.toFixed(2)}% variance</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                      <div><span className="text-ae-dim">Client:</span> <span className="text-white">£{p.clientValue.toLocaleString()}</span></div>
                      <div><span className="text-ae-dim">Independent:</span> <span className="text-white">£{p.independentValue.toLocaleString()}</span></div>
                      <div><span className="text-ae-dim">Difference:</span> <span className="text-ae-red">£{Math.abs(p.clientValue - p.independentValue).toLocaleString()}</span></div>
                    </div>
                    <div className="text-[10px] text-ae-dim">
                      {p.type === "listed_security" && "Closing price variance exceeds 1% Level 1 threshold. Verify pricing source and trade date."}
                      {p.type === "semi_listed" && p.isInactiveMarket && `Inactive market — ${p.daysSinceLastTrade} days since last trade. Consider Level 3 reclassification.`}
                      {p.type === "derivative" && "Derivative revaluation variance exceeds 3% Level 2 threshold. Verify model inputs."}
                      {p.type === "investment_property" && "Property valuation variance exceeds 5% Level 3 threshold. Obtain independent RICS valuation."}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity Tab */}
        <TabsContent value="sensitivity">
          <Card>
            <CardHeader><CardTitle className="text-sm">Level 3 Sensitivity Analysis — ±10% / ±20%</CardTitle><CardDescription>Impact of key assumption changes on Level 3 instrument valuations</CardDescription></CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SENSITIVITY_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" tick={{ fill: "#B0B8C8", fontSize: 10 }} axisLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#B0B8C8", fontSize: 10 }} axisLine={false} />
                    <RTooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 11, color: "#F0F0F0" }} formatter={v => `£${v.toLocaleString()}`} />
                    <Bar dataKey="low20" fill="#EF5350" radius={[0, 3, 3, 0]} name="-20%" />
                    <Bar dataKey="low10" fill="#FFA726" radius={[0, 3, 3, 0]} name="-10%" />
                    <Bar dataKey="base" fill="#42A5F5" radius={[0, 3, 3, 0]} name="Base" />
                    <Bar dataKey="high10" fill="#66BB6A" radius={[0, 3, 3, 0]} name="+10%" />
                    <Bar dataKey="high20" fill="#CE93D8" radius={[0, 3, 3, 0]} name="+20%" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Controls Tab */}
        <TabsContent value="controls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">IPV Controls & Risks</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {IPV_CONTROLS.map(c => (
                    <div key={c.id} className="p-3 rounded-lg border border-ae-border bg-white/[0.02]">
                      <div className="text-[10px] text-ae-red mb-1">Risk: {c.risk}</div>
                      <div className="text-xs text-slate-200">Control: {c.control}</div>
                      <Badge variant="outline" className="text-[8px] mt-1">{c.isa}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">ISA 620 — Expert Assessment Checklist</CardTitle><CardDescription>Evaluation of management's/auditor's expert</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ISA_620_CHECKLIST.map(c => (
                    <div key={c.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03]">
                      <Checkbox checked={isa620Checks[c.id]} onCheckedChange={(v) => setIsa620Checks(prev => ({ ...prev, [c.id]: v }))} />
                      <div className="flex-1"><div className="text-xs text-slate-200">{c.item}</div><div className="text-[9px] text-ae-dim">{c.isa}</div></div>
                    </div>
                  ))}
                  <div className="text-[10px] text-ae-dim mt-2">{Object.values(isa620Checks).filter(Boolean).length}/{ISA_620_CHECKLIST.length} items completed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Suggestions */}
      <AISuggestionsPanel className="mt-6" suggestions={[
        { title: "Request second broker quote for Regional REIT Bond", description: "Only 1 broker quote available for this Level 2 instrument. ISA 540 requires corroboration from multiple sources.", confidence: "high", source: "IPVEngine", isaRef: "ISA 540.8" },
        { title: "FRC finding: Obtain valuation committee minutes for Level 3", description: "FRC AQR 2024/25 identified lack of governance documentation for Level 3 valuations. Request and review valuation committee meeting minutes.", confidence: "medium", source: "FRCAqrFindings", isaRef: "ISA 540.13" },
        { title: "Sensitivity range on Chancery Lane exceeds materiality", description: "±20% sensitivity produces £1.12M range — exceeds overall materiality. Consider this a key audit matter (KAM) for the audit report.", confidence: "high", source: "MaterialityEngine", isaRef: "ISA 701" },
      ]} />
    </div>
  );
}
