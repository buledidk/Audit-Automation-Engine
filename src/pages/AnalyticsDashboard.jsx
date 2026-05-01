import { useState } from "react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter,
  ZAxis, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

// ─── Ratio Gauges Data ──────────────────────────────────────────────────────
const RATIO_DATA = [
  { name: "Current Ratio", value: 1.85, benchmark: 1.5, status: "good", category: "liquidity" },
  { name: "Quick Ratio", value: 1.12, benchmark: 1.0, status: "good", category: "liquidity" },
  { name: "Cash Ratio", value: 0.35, benchmark: 0.2, status: "good", category: "liquidity" },
  { name: "Working Capital", value: 2.1, benchmark: 1.0, status: "good", category: "liquidity" },
  { name: "Gross Margin", value: 42.5, benchmark: 35, status: "good", category: "profitability" },
  { name: "Net Margin", value: 8.2, benchmark: 5, status: "good", category: "profitability" },
  { name: "ROE", value: 14.8, benchmark: 12, status: "good", category: "profitability" },
  { name: "ROA", value: 6.5, benchmark: 5, status: "good", category: "profitability" },
  { name: "ROCE", value: 18.3, benchmark: 15, status: "good", category: "profitability" },
  { name: "EBITDA Margin", value: 15.7, benchmark: 12, status: "good", category: "profitability" },
  { name: "Receivables Days", value: 45, benchmark: 60, status: "good", category: "efficiency" },
  { name: "Payables Days", value: 38, benchmark: 45, status: "good", category: "efficiency" },
  { name: "Inventory Days", value: 62, benchmark: 55, status: "warning", category: "efficiency" },
  { name: "Asset Turnover", value: 1.45, benchmark: 1.2, status: "good", category: "efficiency" },
  { name: "Revenue/Employee", value: 125, benchmark: 100, status: "good", category: "efficiency" },
  { name: "Debt-to-Equity", value: 0.65, benchmark: 1.0, status: "good", category: "solvency" },
  { name: "Gearing", value: 39.4, benchmark: 50, status: "good", category: "solvency" },
  { name: "Interest Cover", value: 8.5, benchmark: 3.0, status: "good", category: "solvency" },
  { name: "Debt Service", value: 2.1, benchmark: 1.5, status: "good", category: "solvency" },
  { name: "Equity Ratio", value: 60.6, benchmark: 50, status: "good", category: "solvency" },
  { name: "EPS", value: 2.45, benchmark: 0, status: "info", category: "investor" },
  { name: "P/E Ratio", value: 18.2, benchmark: 0, status: "info", category: "investor" },
  { name: "Dividend Yield", value: 3.2, benchmark: 0, status: "info", category: "investor" },
  { name: "Dividend Cover", value: 2.8, benchmark: 2.0, status: "good", category: "investor" },
  { name: "Book Value/Share", value: 12.5, benchmark: 0, status: "info", category: "investor" },
];

// ─── Benford's Law Data ─────────────────────────────────────────────────────
const BENFORDS_DATA = [
  { digit: "1", expected: 30.1, actual: 28.5 },
  { digit: "2", expected: 17.6, actual: 18.2 },
  { digit: "3", expected: 12.5, actual: 13.1 },
  { digit: "4", expected: 9.7, actual: 10.4 },
  { digit: "5", expected: 7.9, actual: 7.2 },
  { digit: "6", expected: 6.7, actual: 6.9 },
  { digit: "7", expected: 5.8, actual: 5.1 },
  { digit: "8", expected: 5.1, actual: 5.8 },
  { digit: "9", expected: 4.6, actual: 4.8 },
];

// ─── Journal Entry Scatter Data ─────────────────────────────────────────────
const JOURNAL_SCATTER = Array.from({ length: 50 }, (_, i) => ({
  amount: Math.round(Math.random() * 200000 - 50000),
  hour: Math.floor(Math.random() * 24),
  flags: Math.floor(Math.random() * 5),
  id: `JE-${1000 + i}`,
}));

// ─── Period Comparison Data ─────────────────────────────────────────────────
const PERIOD_COMPARISON = [
  { item: "Revenue", cy: 10500000, py: 9800000 },
  { item: "Cost of Sales", cy: 6300000, py: 5900000 },
  { item: "Gross Profit", cy: 4200000, py: 3900000 },
  { item: "Operating Expenses", cy: 2800000, py: 2600000 },
  { item: "PBT", cy: 1400000, py: 1300000 },
  { item: "Total Assets", cy: 8500000, py: 7900000 },
  { item: "Net Assets", cy: 5200000, py: 4800000 },
];

const GOING_CONCERN_DATA = {
  altmanZ: 2.85,
  classification: "Safe Zone",
  factors: [
    { name: "Working Capital / TA", value: 0.24, weight: 1.2, weighted: 0.29 },
    { name: "Retained Earnings / TA", value: 0.35, weight: 1.4, weighted: 0.49 },
    { name: "EBIT / TA", value: 0.12, weight: 3.3, weighted: 0.40 },
    { name: "Market Cap / TL", value: 1.8, weight: 0.6, weighted: 1.08 },
    { name: "Revenue / TA", value: 1.24, weight: 1.0, weighted: 1.24 },
  ],
};

const CATEGORY_LABELS = {
  liquidity: "Liquidity Ratios",
  profitability: "Profitability Ratios",
  efficiency: "Efficiency Ratios",
  solvency: "Solvency Ratios",
  investor: "Investor Ratios",
};

export default function AnalyticsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const frcScore = 78;

  const filteredRatios = selectedCategory === "all"
    ? RATIO_DATA
    : RATIO_DATA.filter((r) => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">Analytics</h1>
          <p className="text-ae-dim text-sm mt-1">Financial analysis, forensic testing, and quality metrics</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="ratios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="ratios">Ratios</TabsTrigger>
          <TabsTrigger value="benfords">Benford's</TabsTrigger>
          <TabsTrigger value="journals">Journals</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Ratios Tab */}
        <TabsContent value="ratios">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-ae-dim">Filter:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratios</SelectItem>
                <SelectItem value="liquidity">Liquidity</SelectItem>
                <SelectItem value="profitability">Profitability</SelectItem>
                <SelectItem value="efficiency">Efficiency</SelectItem>
                <SelectItem value="solvency">Solvency</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary">{filteredRatios.length} ratios</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredRatios.map((ratio) => {
              const pct = Math.min(100, (ratio.value / (ratio.benchmark || ratio.value)) * 50);
              const gaugeData = [{ name: ratio.name, value: pct, fill: ratio.status === "warning" ? "#FFA726" : ratio.status === "good" ? "#66BB6A" : "#42A5F5" }];
              return (
                <Card key={ratio.name} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="h-24 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%" cy="50%"
                          innerRadius="65%" outerRadius="90%"
                          startAngle={180} endAngle={0}
                          data={gaugeData}
                        >
                          <RadialBar
                            background={{ fill: "rgba(255,255,255,0.05)" }}
                            dataKey="value"
                            cornerRadius={5}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pt-4">
                        <span className="text-lg font-bold text-white">
                          {typeof ratio.value === "number" && ratio.value > 10 ? ratio.value.toFixed(1) : ratio.value}
                        </span>
                      </div>
                    </div>
                    <div className="text-center mt-1">
                      <div className="text-[10px] font-medium text-white truncate">{ratio.name}</div>
                      <div className="text-[9px] text-ae-dim">
                        {ratio.benchmark > 0 ? `Benchmark: ${ratio.benchmark}` : CATEGORY_LABELS[ratio.category]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Benford's Law Tab */}
        <TabsContent value="benfords">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Benford's Law Analysis
                </CardTitle>
                <CardDescription>First-digit distribution — expected vs actual (ISA 240)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BENFORDS_DATA} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="digit" tick={{ fill: "#B0B8C8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                      <RTooltip
                        contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#B0B8C8" }} />
                      <Bar dataKey="expected" fill="#42A5F5" radius={[3, 3, 0, 0]} name="Expected" />
                      <Bar dataKey="actual" fill="#F5A623" radius={[3, 3, 0, 0]} name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ae-green/10 border border-ae-green/30">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-ae-green" />
                      <span className="text-sm font-medium text-ae-green">No Significant Deviations</span>
                    </div>
                    <p className="text-xs text-ae-dim">
                      The chi-squared statistic of 1.84 is below the critical value of 15.51
                      (df=8, p=0.05). The journal population conforms to Benford's Law.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-ae-dim font-semibold uppercase tracking-wider">Digit Deviations</div>
                    {BENFORDS_DATA.map((d) => {
                      const dev = Math.abs(d.actual - d.expected);
                      return (
                        <div key={d.digit} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Digit {d.digit}</span>
                          <span className={dev > 2 ? "text-ae-orange" : "text-ae-dim"}>
                            {d.actual > d.expected ? "+" : ""}{(d.actual - d.expected).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journals">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Journal Entry Analysis
              </CardTitle>
              <CardDescription>Scatter plot — amount vs posting time (ISA 240 risk indicators)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      type="number" dataKey="hour" name="Hour"
                      domain={[0, 24]}
                      tick={{ fill: "#B0B8C8", fontSize: 11 }}
                      axisLine={false}
                      label={{ value: "Posting Hour", position: "bottom", fill: "#B0B8C8", fontSize: 11 }}
                    />
                    <YAxis
                      type="number" dataKey="amount" name="Amount"
                      tick={{ fill: "#B0B8C8", fontSize: 11 }}
                      axisLine={false}
                      label={{ value: "Amount (£)", angle: -90, position: "left", fill: "#B0B8C8", fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="flags" range={[40, 200]} name="Flags" />
                    <RTooltip
                      contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                      formatter={(value, name) => {
                        if (name === "Amount") return [`£${value.toLocaleString()}`, name];
                        if (name === "Hour") return [`${value}:00`, "Posting Time"];
                        return [value, name];
                      }}
                    />
                    <Scatter data={JOURNAL_SCATTER.filter((j) => j.flags < 3)} fill="#42A5F5" fillOpacity={0.6} name="Normal" />
                    <Scatter data={JOURNAL_SCATTER.filter((j) => j.flags >= 3)} fill="#EF5350" fillOpacity={0.8} name="Flagged" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-ae-blue" />
                  <span className="text-xs text-ae-dim">Normal entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-ae-red" />
                  <span className="text-xs text-ae-dim">Flagged entries (3+ risk indicators)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality / FRC + Going Concern Tab */}
        <TabsContent value="quality">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FRC Readiness Gauge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">FRC Readiness Score</CardTitle>
                <CardDescription>Aggregate quality metric based on documentation, procedures, review chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-52 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="60%" outerRadius="85%"
                      startAngle={180} endAngle={0}
                      data={[{ name: "FRC", value: frcScore, fill: frcScore >= 75 ? "#66BB6A" : frcScore >= 50 ? "#FFA726" : "#EF5350" }]}
                    >
                      <RadialBar
                        background={{ fill: "rgba(255,255,255,0.05)" }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-4xl font-bold text-white">{frcScore}</span>
                    <span className="text-xs text-ae-dim">/ 100</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {[
                    { label: "Documentation completeness", score: 85 },
                    { label: "Procedure coverage", score: 72 },
                    { label: "Review chain compliance", score: 90 },
                    { label: "Evidence linking", score: 65 },
                    { label: "Timely sign-off", score: 78 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.score}%`,
                              background: item.score >= 80 ? "#66BB6A" : item.score >= 60 ? "#FFA726" : "#EF5350",
                            }}
                          />
                        </div>
                        <span className="text-ae-dim w-8 text-right">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Altman Z-Score / Going Concern */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Going Concern — Altman Z-Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="60%" outerRadius="85%"
                      startAngle={180} endAngle={0}
                      data={[{
                        name: "Z-Score",
                        value: Math.min(100, (GOING_CONCERN_DATA.altmanZ / 4) * 100),
                        fill: GOING_CONCERN_DATA.altmanZ > 2.99 ? "#66BB6A" : GOING_CONCERN_DATA.altmanZ > 1.81 ? "#FFA726" : "#EF5350"
                      }]}
                    >
                      <RadialBar
                        background={{ fill: "rgba(255,255,255,0.05)" }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-4xl font-bold text-white">{GOING_CONCERN_DATA.altmanZ}</span>
                    <Badge variant={GOING_CONCERN_DATA.altmanZ > 2.99 ? "success" : GOING_CONCERN_DATA.altmanZ > 1.81 ? "warning" : "destructive"} className="mt-1">
                      {GOING_CONCERN_DATA.classification}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-[10px] text-ae-dim font-semibold uppercase tracking-wider mb-2">Z-Score Components</div>
                  {GOING_CONCERN_DATA.factors.map((f) => (
                    <div key={f.name} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{f.name}</span>
                      <div className="flex gap-4">
                        <span className="text-ae-dim w-12 text-right">{f.value}</span>
                        <span className="text-ae-dim w-8 text-right">x{f.weight}</span>
                        <span className="text-white w-12 text-right font-medium">{f.weighted.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs border-t border-ae-border pt-2 mt-2">
                    <span className="text-white font-semibold">Total Z-Score</span>
                    <span className="text-brand font-bold text-base">{GOING_CONCERN_DATA.altmanZ}</span>
                  </div>
                  <div className="text-[9px] text-ae-dim mt-2">
                    &gt;2.99 = Safe | 1.81-2.99 = Grey Zone | &lt;1.81 = Distress Zone
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Period Comparison Tab */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Period Comparison
              </CardTitle>
              <CardDescription>Current year vs prior year analysis (ISA 520 analytical procedures)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERIOD_COMPARISON} layout="vertical" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      type="number"
                      tick={{ fill: "#B0B8C8", fontSize: 11 }}
                      axisLine={false}
                      tickFormatter={(v) => `£${(v / 1000000).toFixed(1)}m`}
                    />
                    <YAxis type="category" dataKey="item" width={130} tick={{ fill: "#B0B8C8", fontSize: 11 }} axisLine={false} />
                    <RTooltip
                      contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12, color: "#F0F0F0" }}
                      formatter={(v) => `£${v.toLocaleString()}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#B0B8C8" }} />
                    <Bar dataKey="py" fill="#42A5F5" radius={[0, 3, 3, 0]} name="Prior Year" />
                    <Bar dataKey="cy" fill="#F5A623" radius={[0, 3, 3, 0]} name="Current Year" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ae-border">
                      <th className="text-left py-2 text-xs text-brand uppercase tracking-wider">Item</th>
                      <th className="text-right py-2 text-xs text-brand uppercase tracking-wider">Current Year</th>
                      <th className="text-right py-2 text-xs text-brand uppercase tracking-wider">Prior Year</th>
                      <th className="text-right py-2 text-xs text-brand uppercase tracking-wider">Change</th>
                      <th className="text-right py-2 text-xs text-brand uppercase tracking-wider">% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERIOD_COMPARISON.map((row) => {
                      const change = row.cy - row.py;
                      const pctChange = ((change / row.py) * 100).toFixed(1);
                      return (
                        <tr key={row.item} className="border-b border-ae-border/50">
                          <td className="py-2 text-slate-200">{row.item}</td>
                          <td className="py-2 text-right text-slate-300">£{row.cy.toLocaleString()}</td>
                          <td className="py-2 text-right text-ae-dim">£{row.py.toLocaleString()}</td>
                          <td className={`py-2 text-right ${change >= 0 ? "text-ae-green" : "text-ae-red"}`}>
                            {change >= 0 ? "+" : ""}£{change.toLocaleString()}
                          </td>
                          <td className={`py-2 text-right ${change >= 0 ? "text-ae-green" : "text-ae-red"}`}>
                            {change >= 0 ? "+" : ""}{pctChange}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
