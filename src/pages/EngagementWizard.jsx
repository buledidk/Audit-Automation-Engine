import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Check, Building2, Users, ShieldAlert,
  Calculator, ClipboardList, Save // eslint-disable-line no-unused-vars
} from "lucide-react";
import { calculateMateriality } from "@/services/materialityEngine";
import { createEngagement, setActiveEngagementId, createStorageEngine } from "../StorageEngine";

const ENTITY_TYPES = [
  { value: "micro", label: "Micro Entity", desc: "Turnover ≤ £1m, Assets ≤ £500k, Employees ≤ 10" },
  { value: "small", label: "Small Company", desc: "Turnover ≤ £15m, Assets ≤ £7.5m, Employees ≤ 50" },
  { value: "medium", label: "Medium Company", desc: "Turnover ≤ £54m, Assets ≤ £27m, Employees ≤ 250" },
  { value: "large", label: "Large Private", desc: "Turnover > £54m, Assets > £27m, Employees > 250" },
  { value: "aim", label: "AIM Listed", desc: "AIM market — ISA (UK) with PIE considerations" },
  { value: "main_market", label: "Main Market Listed", desc: "Full PIE — FRC inspection scope" },
  { value: "financial_services", label: "Financial Services", desc: "FCA regulated — CASS, MIFIDPRU, Client Money" },
  { value: "charity", label: "Charity", desc: "Charities SORP (FRS 102) — Charity Commission" },
  { value: "pension", label: "Pension Scheme", desc: "TPR regulated — SORP compliance" },
];

const INDUSTRIES = [
  "Manufacturing", "Retail & Consumer", "Technology", "Financial Services",
  "Healthcare", "Real Estate & Construction", "Energy & Utilities",
  "Professional Services", "Education", "Hospitality", "Transportation",
  "Agriculture", "Media & Entertainment", "Not-for-Profit", "Other",
];

const KYC_CHECKLIST = [
  { id: "aml_check", label: "AML/KYC verification completed (MLR 2017)" },
  { id: "sanctions", label: "Sanctions screening clear (OFSI)" },
  { id: "pep_check", label: "PEP (Politically Exposed Persons) check" },
  { id: "conflict_check", label: "Independence confirmed — no conflicts of interest" },
  { id: "ethical_threats", label: "Ethical threats assessed (FRC Ethical Standard 2024)" },
  { id: "engagement_letter", label: "Engagement letter issued and signed" },
  { id: "predecessor_comm", label: "Communication with predecessor auditor (ISA 300)" },
  { id: "fees_agreed", label: "Fee arrangements agreed and documented" },
  { id: "insurance", label: "PI insurance coverage confirmed for engagement" },
  { id: "data_protection", label: "Data protection agreement in place (UK GDPR)" },
];

const BENCHMARK_OPTIONS = [
  { value: "pbt", label: "Profit Before Tax (5%)" },
  { value: "revenue", label: "Revenue (0.5% - 1%)" },
  { value: "assets", label: "Total Assets (1% - 2%)" },
  { value: "equity", label: "Equity (2% - 5%)" },
];

const STEPS = [
  { icon: Building2, label: "Entity Type", short: "Type" },
  { icon: ClipboardList, label: "Client Details", short: "Details" },
  { icon: ShieldAlert, label: "Independence & KYC", short: "KYC" },
  { icon: ShieldAlert, label: "Risk Assessment", short: "Risk" },
  { icon: Calculator, label: "Materiality", short: "Materiality" },
  { icon: Users, label: "Team Assignment", short: "Team" },
];

const FSLI_RISK_CATEGORIES = [
  { code: "REV", name: "Revenue", inherentRisk: "High", assertions: ["Occurrence", "Completeness", "Accuracy", "Cutoff"] },
  { code: "COS", name: "Cost of Sales", inherentRisk: "Medium", assertions: ["Completeness", "Accuracy", "Cutoff"] },
  { code: "CSH", name: "Cash & Bank", inherentRisk: "Low", assertions: ["Existence", "Completeness", "Rights"] },
  { code: "TRD", name: "Trade Receivables", inherentRisk: "Medium", assertions: ["Existence", "Valuation", "Rights"] },
  { code: "INV", name: "Inventory", inherentRisk: "High", assertions: ["Existence", "Valuation", "Completeness"] },
  { code: "PPE", name: "Property, Plant & Equipment", inherentRisk: "Medium", assertions: ["Existence", "Valuation", "Rights"] },
  { code: "TRP", name: "Trade Payables", inherentRisk: "Medium", assertions: ["Completeness", "Existence", "Accuracy"] },
  { code: "TAX", name: "Taxation", inherentRisk: "Medium", assertions: ["Accuracy", "Completeness", "Valuation"] },
  { code: "BRW", name: "Borrowings", inherentRisk: "Medium", assertions: ["Completeness", "Accuracy", "Classification"] },
  { code: "EQY", name: "Equity", inherentRisk: "Low", assertions: ["Completeness", "Accuracy", "Presentation"] },
];

export default function EngagementWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    entityType: "",
    clientName: "",
    companyNumber: "",
    industry: "",
    yearEnd: "",
    kycChecks: {},
    riskOverrides: {},
    benchmarkKey: "pbt",
    revenue: "",
    totalAssets: "",
    profitBeforeTax: "",
    equity: "",
    riskLevel: "medium",
    partner: "",
    manager: "",
    seniorAuditor: "",
    teamMembers: "",
  });

  const updateForm = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleKyc = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      kycChecks: { ...prev.kycChecks, [id]: !prev.kycChecks[id] },
    }));
  }, []);

  const materialityResult = (() => {
    const rev = parseFloat(form.revenue) || 0;
    const ta = parseFloat(form.totalAssets) || 0;
    const pbt = parseFloat(form.profitBeforeTax) || 0;
    const eq = parseFloat(form.equity) || 0;
    if (rev === 0 && ta === 0 && pbt === 0 && eq === 0) return null;
    return calculateMateriality({ revenue: rev, totalAssets: ta, profitBeforeTax: pbt, equity: eq }, form.riskLevel);
  })();

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  const canProceed = () => {
    if (step === 0) return !!form.entityType;
    if (step === 1) return !!form.clientName;
    return true;
  };

  const handleCreate = () => {
    const name = form.clientName || "New Engagement";
    const id = createEngagement(name);
    setActiveEngagementId(id);
    const engine = createStorageEngine(id);
    engine.saveImmediate("cfg", {
      entityName: form.clientName,
      companyNumber: form.companyNumber,
      industry: form.industry,
      fye: form.yearEnd,
      entitySize: form.entityType,
      partner: form.partner,
      manager: form.manager,
      materiality: materialityResult?.overall?.toString() || "",
      perfMateriality: materialityResult?.performanceMateriality?.toString() || "",
      trivial: materialityResult?.trivialThreshold?.toString() || "",
      configured: true,
    });
    navigate(`/engagement/${id}`);
  };

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4 text-ae-dim">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Button>
        <h1 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-white">
          New Engagement
        </h1>
        <p className="text-ae-dim text-sm mt-1">Step {step + 1} of {STEPS.length}: {STEPS[step].label}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={i}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive ? "text-brand" : isDone ? "text-ae-green" : "text-ae-dim/50"
                }`}
              >
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                  isActive ? "border-brand bg-brand/20 text-brand" : isDone ? "border-ae-green bg-ae-green/20 text-ae-green" : "border-ae-border bg-white/5 text-ae-dim"
                }`}>
                  {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className="hidden md:inline">{s.short}</span>
              </button>
            );
          })}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Step 0: Entity Type */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Select Entity Type</h2>
                <p className="text-sm text-ae-dim">This determines the regulatory framework, disclosure requirements, and audit approach.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ENTITY_TYPES.map((et) => (
                  <button
                    key={et.value}
                    onClick={() => updateForm("entityType", et.value)}
                    className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
                      form.entityType === et.value
                        ? "border-brand bg-brand/10 ring-1 ring-brand"
                        : "border-ae-border bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{et.label}</div>
                    <div className="text-[10px] text-ae-dim mt-1 leading-relaxed">{et.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Client Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Client Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entity Name *</Label>
                  <Input
                    placeholder="Acme Holdings Ltd"
                    value={form.clientName}
                    onChange={(e) => updateForm("clientName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Number</Label>
                  <Input
                    placeholder="12345678"
                    value={form.companyNumber}
                    onChange={(e) => updateForm("companyNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={form.industry} onValueChange={(v) => updateForm("industry", v)}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year End Date</Label>
                  <Input
                    type="date"
                    value={form.yearEnd}
                    onChange={(e) => updateForm("yearEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Independence & KYC */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Independence & KYC</h2>
                <p className="text-sm text-ae-dim">Confirm compliance before acceptance (ISA 220, FRC Ethical Standard).</p>
              </div>
              <div className="space-y-3">
                {KYC_CHECKLIST.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-ae-border hover:bg-white/[0.03] transition-colors"
                  >
                    <Checkbox
                      checked={!!form.kycChecks[item.id]}
                      onCheckedChange={() => toggleKyc(item.id)}
                    />
                    <label className="text-sm text-slate-200 cursor-pointer flex-1">
                      {item.label}
                    </label>
                    {form.kycChecks[item.id] && (
                      <Badge variant="success" className="text-[10px]">Done</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-ae-dim">
                {Object.values(form.kycChecks).filter(Boolean).length} / {KYC_CHECKLIST.length} checks completed
              </div>
            </div>
          )}

          {/* Step 3: Risk Assessment */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Risk Assessment</h2>
                <p className="text-sm text-ae-dim">Auto-populated per FSLI from the risk engine. Override as needed.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ae-border">
                      <th className="text-left py-3 px-3 text-xs text-brand uppercase tracking-wider font-semibold">Code</th>
                      <th className="text-left py-3 px-3 text-xs text-brand uppercase tracking-wider font-semibold">FSLI</th>
                      <th className="text-left py-3 px-3 text-xs text-brand uppercase tracking-wider font-semibold">Inherent Risk</th>
                      <th className="text-left py-3 px-3 text-xs text-brand uppercase tracking-wider font-semibold">Assertions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FSLI_RISK_CATEGORIES.map((fsli) => (
                      <tr key={fsli.code} className="border-b border-ae-border/50 hover:bg-white/[0.03]">
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="font-mono text-[10px]">{fsli.code}</Badge>
                        </td>
                        <td className="py-3 px-3 text-slate-200">{fsli.name}</td>
                        <td className="py-3 px-3">
                          <Badge variant={fsli.inherentRisk === "High" ? "destructive" : fsli.inherentRisk === "Medium" ? "warning" : "success"}>
                            {fsli.inherentRisk}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {fsli.assertions.map((a) => (
                              <span key={a} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-ae-dim">{a}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 4: Materiality */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Materiality Calculator</h2>
                <p className="text-sm text-ae-dim">ISA 320 compliant — auto-selects benchmark with risk multiplier.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Revenue (£)</Label>
                  <Input
                    type="number"
                    placeholder="10,000,000"
                    value={form.revenue}
                    onChange={(e) => updateForm("revenue", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Assets (£)</Label>
                  <Input
                    type="number"
                    placeholder="5,000,000"
                    value={form.totalAssets}
                    onChange={(e) => updateForm("totalAssets", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit Before Tax (£)</Label>
                  <Input
                    type="number"
                    placeholder="500,000"
                    value={form.profitBeforeTax}
                    onChange={(e) => updateForm("profitBeforeTax", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equity (£)</Label>
                  <Input
                    type="number"
                    placeholder="2,000,000"
                    value={form.equity}
                    onChange={(e) => updateForm("equity", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Benchmark</Label>
                  <Select value={form.benchmarkKey} onValueChange={(v) => updateForm("benchmarkKey", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BENCHMARK_OPTIONS.map((b) => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Overall Risk Level</Label>
                  <Select value={form.riskLevel} onValueChange={(v) => updateForm("riskLevel", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {materialityResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card className="border-brand/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-ae-dim mb-1">Overall Materiality</div>
                      <div className="text-2xl font-bold text-brand">
                        £{materialityResult.overall.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-ae-dim mt-1">{materialityResult.benchmark}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-ae-blue/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-ae-dim mb-1">Performance Materiality</div>
                      <div className="text-2xl font-bold text-ae-blue">
                        £{materialityResult.performanceMateriality.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-ae-dim mt-1">
                        {((materialityResult.performanceMateriality / materialityResult.overall) * 100).toFixed(1)}% of OM
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-ae-orange/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-ae-dim mb-1">Trivial Threshold</div>
                      <div className="text-2xl font-bold text-ae-orange">
                        £{materialityResult.trivialThreshold.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-ae-dim mt-1">5% of OM (ISA 450)</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Team Assignment */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Team Assignment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Engagement Partner</Label>
                  <Input
                    placeholder="John Partner"
                    value={form.partner}
                    onChange={(e) => updateForm("partner", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audit Manager</Label>
                  <Input
                    placeholder="Sarah Manager"
                    value={form.manager}
                    onChange={(e) => updateForm("manager", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senior Auditor</Label>
                  <Input
                    placeholder="Robert Senior"
                    value={form.seniorAuditor}
                    onChange={(e) => updateForm("seniorAuditor", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Team Members (comma-separated)</Label>
                  <Input
                    placeholder="Alice, Bob, Charlie"
                    value={form.teamMembers}
                    onChange={(e) => updateForm("teamMembers", e.target.value)}
                  />
                </div>
              </div>

              <Card className="border-ae-green/30 bg-ae-green/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-ae-green" />
                    <span className="text-sm font-medium text-ae-green">Ready to Create</span>
                  </div>
                  <p className="text-xs text-ae-dim">
                    Entity: {ENTITY_TYPES.find((e) => e.value === form.entityType)?.label || "—"} &middot;
                    Client: {form.clientName || "—"} &middot;
                    KYC: {Object.values(form.kycChecks).filter(Boolean).length}/{KYC_CHECKLIST.length} &middot;
                    Materiality: {materialityResult ? `£${materialityResult.overall.toLocaleString()}` : "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ae-dim">
            <Save className="h-3 w-3 inline mr-1" />Auto-saved
          </span>
        </div>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canProceed()}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleCreate} className="bg-ae-green hover:bg-ae-green/80 text-white">
            <Check className="h-4 w-4 mr-1" /> Create Engagement
          </Button>
        )}
      </div>
    </div>
  );
}
