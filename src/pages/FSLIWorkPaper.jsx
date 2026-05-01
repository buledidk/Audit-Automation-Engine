import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Upload, FileText, Link2, Check, AlertTriangle,
  Shield, Eye, Pen, ClipboardCheck, AlertCircle
} from "lucide-react";

const FSLI_REGISTRY = {
  REV: { name: "Revenue", section: "FRS 102 §23", isa: "ISA 240, ISA 500, ISA 520" },
  COS: { name: "Cost of Sales", section: "FRS 102 §13", isa: "ISA 500, ISA 530" },
  CSH: { name: "Cash & Bank", section: "FRS 102 §7", isa: "ISA 500, ISA 505" },
  TRD: { name: "Trade Receivables", section: "FRS 102 §11", isa: "ISA 505, ISA 540" },
  INV: { name: "Inventory", section: "FRS 102 §13", isa: "ISA 501, ISA 500" },
  PPE: { name: "Property, Plant & Equipment", section: "FRS 102 §17", isa: "ISA 500, ISA 540" },
  INT: { name: "Intangible Assets", section: "FRS 102 §18", isa: "ISA 500, ISA 540" },
  TRP: { name: "Trade Payables", section: "FRS 102 §11", isa: "ISA 500, ISA 505" },
  ACR: { name: "Accruals & Deferred Income", section: "FRS 102 §21", isa: "ISA 540" },
  TAX: { name: "Taxation", section: "FRS 102 §29", isa: "ISA 500, ISA 540" },
  BRW: { name: "Borrowings", section: "FRS 102 §11", isa: "ISA 500, ISA 505" },
  PRV: { name: "Provisions", section: "FRS 102 §21", isa: "ISA 540" },
  EQY: { name: "Equity & Reserves", section: "FRS 102 §22", isa: "ISA 500" },
  PEN: { name: "Pensions", section: "FRS 102 §28", isa: "ISA 500, ISA 540, ISA 620" },
  LEA: { name: "Leases", section: "FRS 102 §20", isa: "ISA 500" },
  GCN: { name: "Going Concern", section: "FRS 102 §3", isa: "ISA 570" },
  RPT: { name: "Related Parties", section: "FRS 102 §33", isa: "ISA 550" },
  SEV: { name: "Subsequent Events", section: "FRS 102 §32", isa: "ISA 560" },
  PAY: { name: "Payroll & Employment", section: "FRS 102 §28", isa: "ISA 500, ISA 530" },
  DEP: { name: "Depreciation & Amortisation", section: "FRS 102 §17/18", isa: "ISA 540" },
};

const ASSERTIONS = [
  { key: "existence", label: "Existence / Occurrence", desc: "Assets, liabilities, and equity interests exist; transactions occurred" },
  { key: "completeness", label: "Completeness", desc: "All transactions and events have been recorded" },
  { key: "valuation", label: "Valuation / Accuracy", desc: "Amounts and disclosures are accurately recorded" },
  { key: "rights", label: "Rights & Obligations", desc: "The entity holds or controls rights to the assets" },
  { key: "presentation", label: "Presentation & Disclosure", desc: "Information is properly classified and disclosed" },
];

const SAMPLE_CONTROLS = [
  { id: 1, control: "Segregation of duties in sales order processing", status: "effective", tested: true },
  { id: 2, control: "Automated three-way matching (PO / GRN / Invoice)", status: "effective", tested: true },
  { id: 3, control: "Monthly management review of aged debtor analysis", status: "effective", tested: false },
  { id: 4, control: "Authorisation limits for credit notes >£5,000", status: "deficiency", tested: true },
  { id: 5, control: "System access controls — finance module", status: "effective", tested: false },
];

const SAMPLE_PROCEDURES = [
  { id: 1, name: "Obtain and review bank confirmations", status: "complete" },
  { id: 2, name: "Perform analytical review of revenue trends", status: "complete" },
  { id: 3, name: "Test sample of sales transactions to invoices/contracts", status: "in_progress" },
  { id: 4, name: "Evaluate credit note authorisation process", status: "in_progress" },
  { id: 5, name: "Review cutoff testing around year end", status: "not_started" },
  { id: 6, name: "Assess adequacy of disclosures per FRS 102", status: "not_started" },
];

const CROSS_REFS = [
  { code: "COS", name: "Cost of Sales", reason: "Revenue/COS margin analysis" },
  { code: "TRD", name: "Trade Receivables", reason: "Revenue completeness via receivables" },
  { code: "TAX", name: "Taxation", reason: "CT on reported revenue" },
];

export default function FSLIWorkPaper() {
  const { id, code } = useParams();
  const navigate = useNavigate();
  const fsli = FSLI_REGISTRY[code?.toUpperCase()] || FSLI_REGISTRY.REV;
  const fsliCode = code?.toUpperCase() || "REV";

  const [assertions, setAssertions] = useState({
    existence: "medium",
    completeness: "high",
    valuation: "medium",
    rights: "low",
    presentation: "low",
  });

  const [procedures, setProcedures] = useState(SAMPLE_PROCEDURES);
  const [controls, _setControls] = useState(SAMPLE_CONTROLS);
  const [findings, _setFindings] = useState([
    { id: 1, title: "Revenue cutoff — 2 invoices dated post year-end included", severity: "medium", status: "open" },
  ]);
  const [signOff, setSignOff] = useState({
    preparedBy: "",
    preparedDate: "",
    reviewedBy: "",
    reviewedDate: "",
    approvedBy: "",
    approvedDate: "",
  });

  const toggleProcedure = (procId) => {
    setProcedures((prev) =>
      prev.map((p) => {
        if (p.id !== procId) return p;
        const next = p.status === "not_started" ? "in_progress" : p.status === "in_progress" ? "complete" : "not_started";
        return { ...p, status: next };
      })
    );
  };

  const completionPct = Math.round(
    (procedures.filter((p) => p.status === "complete").length / procedures.length) * 100
  );

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-ae-dim">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Engagement
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-sm px-3 py-1">{fsliCode}</Badge>
          <h1 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-white">
            {fsli.name}
          </h1>
        </div>
        <p className="text-ae-dim text-sm mt-1">{fsli.section} &middot; {fsli.isa}</p>
        <div className="flex items-center gap-3 mt-3">
          <Progress value={completionPct} className="flex-1 h-2 max-w-xs" />
          <span className="text-sm text-ae-dim">{completionPct}% complete</span>
        </div>
      </div>

      <Tabs defaultValue="narrative" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-2xl">
          <TabsTrigger value="narrative">Narrative</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="signoff">Sign-off</TabsTrigger>
        </TabsList>

        {/* Narrative Tab */}
        <TabsContent value="narrative">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Audit Narrative</CardTitle>
              <CardDescription>Auto-populated template from fsliMasterRegistry — edit as needed</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[200px] font-mono text-xs leading-relaxed"
                defaultValue={`AUDIT WORK PAPER — ${fsli.name} (${fsliCode})
Engagement: ${id || 'ENG-001'}
Framework: ${fsli.section}
Standards: ${fsli.isa}

OBJECTIVE:
To obtain sufficient appropriate audit evidence that ${fsli.name.toLowerCase()} is fairly stated in the financial statements, free from material misstatement.

SCOPE:
This work paper covers the audit procedures performed on the ${fsli.name.toLowerCase()} balance as at the year-end date. Testing was performed in accordance with the approved audit strategy and risk assessment.

APPROACH:
A combined approach (substantive + controls) was adopted based on the assessed risk level. The key assertions tested are existence, completeness, valuation, rights & obligations, and presentation & disclosure.

CONCLUSION:
[To be completed upon finalisation of procedures]
Based on the audit procedures performed and evidence obtained, the ${fsli.name.toLowerCase()} balance is / is not fairly stated in all material respects.`}
              />
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <AISuggestionsPanel
            className="mt-4"
            suggestions={[
              {
                title: `Recommended: Extended sample for ${fsli.name}`,
                description: `Based on the assessed risk level and prior year exceptions, consider increasing the sample size from 20 to 30 items. The prior year had 2 exceptions in this area.`,
                confidence: "high",
                source: "FSLIRegistry",
                isaRef: "ISA 530.7",
              },
              {
                title: "FRC Finding: Ensure sufficient challenge of management estimates",
                description: "FRC AQR 2024/25 highlighted insufficient auditor challenge of management's key estimates. Document your independent assessment and any contrary evidence considered.",
                confidence: "medium",
                source: "FRCAqrFindings",
                isaRef: "ISA 540.13",
              },
              {
                title: `Consider related party impact on ${fsli.name}`,
                description: "Cross-reference with RPT work paper to ensure related party transactions affecting this balance are appropriately tested.",
                confidence: "low",
                source: "RiskEngine",
                isaRef: "ISA 550.16",
              },
            ]}
          />

          {/* FRC Alert Panel */}
          <Card className="mt-4 border-ae-orange/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-ae-orange">
                <AlertCircle className="h-4 w-4" /> FRC Relevant Findings
              </CardTitle>
              <CardDescription>From FRC AQR reports — findings relevant to {fsli.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { year: "2024/25", finding: "Insufficient evidence of auditor challenge on key accounting estimates", theme: "Estimates & Valuations" },
                  { year: "2023/24", finding: "Inadequate evaluation of management's going concern assessment", theme: "Going Concern" },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-ae-orange/20 bg-ae-orange/5">
                    <Badge variant="warning" className="text-[9px] flex-shrink-0">{f.year}</Badge>
                    <div>
                      <div className="text-xs text-white">{f.finding}</div>
                      <div className="text-[10px] text-ae-dim mt-0.5">Theme: {f.theme}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cross References */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-4 w-4" /> Cross-References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {CROSS_REFS.map((ref) => (
                  <button
                    key={ref.code}
                    onClick={() => navigate(`/engagement/${id}/fsli/${ref.code}`)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg border border-ae-border hover:bg-white/[0.03] transition-colors text-left cursor-pointer"
                  >
                    <Badge variant="outline" className="font-mono text-[10px]">{ref.code}</Badge>
                    <div className="flex-1">
                      <div className="text-sm text-white">{ref.name}</div>
                      <div className="text-[10px] text-ae-dim">{ref.reason}</div>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-ae-dim rotate-180" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Assessment per Assertion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ASSERTIONS.map((a) => (
                  <div key={a.key} className="p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-white">{a.label}</div>
                        <div className="text-[10px] text-ae-dim">{a.desc}</div>
                      </div>
                      <div className="flex gap-2">
                        {["low", "medium", "high"].map((level) => (
                          <button
                            key={level}
                            onClick={() => setAssertions((prev) => ({ ...prev, [a.key]: level }))}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                              assertions[a.key] === level
                                ? level === "high"
                                  ? "bg-ae-red/20 text-ae-red border border-ae-red/40"
                                  : level === "medium"
                                  ? "bg-ae-orange/20 text-ae-orange border border-ae-orange/40"
                                  : "bg-ae-green/20 text-ae-green border border-ae-green/40"
                                : "bg-white/5 text-ae-dim border border-ae-border hover:bg-white/10"
                            }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Controls Tab */}
        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Controls Testing</CardTitle>
              <CardDescription>Relevant controls with test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {controls.map((ctrl) => (
                  <div key={ctrl.id} className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      ctrl.status === "effective" ? "bg-ae-green" : "bg-ae-red"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white">{ctrl.control}</div>
                    </div>
                    <Badge variant={ctrl.status === "effective" ? "success" : "destructive"} className="text-[10px]">
                      {ctrl.status === "effective" ? "Effective" : "Deficiency"}
                    </Badge>
                    <Badge variant={ctrl.tested ? "info" : "secondary"} className="text-[10px]">
                      {ctrl.tested ? "Tested" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procedures Tab */}
        <TabsContent value="procedures">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Audit Procedures</CardTitle>
              <CardDescription>Click to cycle status: Not Started → In Progress → Complete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {procedures.map((proc) => (
                  <div
                    key={proc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-ae-border hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => toggleProcedure(proc.id)}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      proc.status === "complete" ? "bg-ae-green text-white" :
                      proc.status === "in_progress" ? "bg-ae-orange text-white" :
                      "bg-white/10 text-ae-dim"
                    }`}>
                      {proc.status === "complete" ? <Check className="h-3 w-3" /> :
                       proc.status === "in_progress" ? <Pen className="h-3 w-3" /> :
                       <span className="text-[10px]">{proc.id}</span>}
                    </div>
                    <span className={`text-sm flex-1 ${proc.status === "complete" ? "text-ae-dim line-through" : "text-white"}`}>
                      {proc.name}
                    </span>
                    <Badge
                      variant={proc.status === "complete" ? "success" : proc.status === "in_progress" ? "warning" : "secondary"}
                      className="text-[10px]"
                    >
                      {proc.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidence Upload */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-4 w-4" /> Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-ae-border rounded-lg p-8 text-center hover:border-brand/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-ae-dim mx-auto mb-3" />
                <p className="text-sm text-ae-dim">Drag & drop files or click to browse</p>
                <p className="text-[10px] text-ae-dim/60 mt-1">PDF, Excel, Word, images — max 25MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Findings</CardTitle>
                <CardDescription>Issues identified during audit procedures</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> Log Finding
              </Button>
            </CardHeader>
            <CardContent>
              {findings.length === 0 ? (
                <div className="text-center py-8 text-ae-dim">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No findings logged</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {findings.map((f) => (
                    <div key={f.id} className="p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-white">{f.title}</div>
                        <div className="flex gap-2">
                          <Badge variant={f.severity === "high" ? "destructive" : f.severity === "medium" ? "warning" : "info"}>
                            {f.severity}
                          </Badge>
                          <Badge variant={f.status === "open" ? "warning" : "success"}>
                            {f.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sign-off Tab */}
        <TabsContent value="signoff">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" /> Sign-off Chain
              </CardTitle>
              <CardDescription>ISA 220 compliant review chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { key: "prepared", label: "Prepared By", icon: Pen, color: "ae-blue" },
                  { key: "reviewed", label: "Reviewed By", icon: Eye, color: "ae-orange" },
                  { key: "approved", label: "Approved By", icon: Shield, color: "ae-green" },
                ].map((stage) => {
                  return (
                    <div key={stage.key} className="p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`h-4 w-4 text-${stage.color}`} />
                        <span className="text-sm font-medium text-white">{stage.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px]">Name</Label>
                          <Input
                            placeholder="Enter name"
                            value={signOff[`${stage.key}By`]}
                            onChange={(e) => setSignOff((prev) => ({ ...prev, [`${stage.key}By`]: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px]">Date</Label>
                          <Input
                            type="date"
                            value={signOff[`${stage.key}Date`]}
                            onChange={(e) => setSignOff((prev) => ({ ...prev, [`${stage.key}Date`]: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
