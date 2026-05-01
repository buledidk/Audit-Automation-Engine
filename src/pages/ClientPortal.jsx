import { useState, useMemo } from "react";
import {
  Upload, FileText, MessageSquare, Clock, CheckCircle2,
  AlertCircle, Search, Filter, Send, Download, Shield,
  Eye, Lock, Trash2, HelpCircle
} from "lucide-react";

// ─── PBC Request Statuses ───────────────────────────────────────────────────
const STATUS_CONFIG = {
  outstanding: { label: "Outstanding", color: "#EF5350", variant: "destructive", icon: AlertCircle },
  uploaded: { label: "Uploaded", color: "#FFA726", variant: "warning", icon: Upload },
  under_review: { label: "Under Review", color: "#42A5F5", variant: "info", icon: Eye },
  accepted: { label: "Accepted", color: "#66BB6A", variant: "success", icon: CheckCircle2 },
  query: { label: "Query Raised", color: "#CE93D8", variant: "secondary", icon: HelpCircle },
};

// ─── Demo PBC Requests ──────────────────────────────────────────────────────
const PBC_REQUESTS = [
  { id: 1, item: "Year-end bank statements (all accounts)", category: "Cash & Bank", fsli: "CSH", deadline: "2026-04-10", status: "outstanding", priority: "high" },
  { id: 2, item: "Trade receivables aged analysis", category: "Receivables", fsli: "TRD", deadline: "2026-04-10", status: "outstanding", priority: "high" },
  { id: 3, item: "Fixed asset register with additions/disposals", category: "Fixed Assets", fsli: "PPE", deadline: "2026-04-15", status: "uploaded", priority: "medium", uploadedBy: "Sarah FD", uploadedAt: "2026-03-28" },
  { id: 4, item: "Inventory count sheets and valuation", category: "Inventory", fsli: "INV", deadline: "2026-04-15", status: "under_review", priority: "high", uploadedBy: "Sarah FD", uploadedAt: "2026-03-25" },
  { id: 5, item: "Sales invoices sample (20 items)", category: "Revenue", fsli: "REV", deadline: "2026-04-12", status: "accepted", priority: "medium", uploadedBy: "John Bookkeeper", uploadedAt: "2026-03-20" },
  { id: 6, item: "Bank confirmation letters (signed)", category: "Cash & Bank", fsli: "CSH", deadline: "2026-04-08", status: "query", priority: "critical", uploadedBy: "Sarah FD", uploadedAt: "2026-03-22" },
  { id: 7, item: "Payroll summary & P11D returns", category: "Payroll", fsli: "PAY", deadline: "2026-04-20", status: "outstanding", priority: "medium" },
  { id: 8, item: "Loan agreements and amortisation schedules", category: "Borrowings", fsli: "BRW", deadline: "2026-04-18", status: "uploaded", priority: "low", uploadedBy: "Sarah FD", uploadedAt: "2026-03-30" },
  { id: 9, item: "Related party transaction listing", category: "Related Parties", fsli: "RPT", deadline: "2026-04-22", status: "outstanding", priority: "medium" },
  { id: 10, item: "Board minutes (all meetings in period)", category: "Governance", fsli: "GCN", deadline: "2026-04-25", status: "outstanding", priority: "low" },
  { id: 11, item: "Corporation tax computation & CT600", category: "Taxation", fsli: "TAX", deadline: "2026-04-15", status: "uploaded", priority: "high", uploadedBy: "Tax Advisor", uploadedAt: "2026-03-29" },
  { id: 12, item: "Subsequent events confirmation letter", category: "Subsequent Events", fsli: "SEV", deadline: "2026-05-01", status: "outstanding", priority: "low" },
];

const QUERY_THREADS = [
  {
    id: 6,
    item: "Bank confirmation letters (signed)",
    messages: [
      { id: 1, from: "auditor", name: "Sarah Khan", text: "The bank confirmation for Barclays account ending 4521 appears to have a different balance (£142,350) to the year-end TB (£145,200). Could you clarify?", time: "2026-03-28 14:30" },
      { id: 2, from: "client", name: "Sarah FD", text: "The difference of £2,850 relates to three cheques issued on 31 March that hadn't cleared the bank yet. I'll send you the cheque listing.", time: "2026-03-28 16:15" },
      { id: 3, from: "auditor", name: "Sarah Khan", text: "Thank you. Please upload the cheque listing and we'll reconcile. Also need the HSBC confirmation — has it been returned?", time: "2026-03-29 09:00" },
    ],
  },
];

const CLIENT_ROLES = [
  { role: "Finance Director", access: "Full access — all items", badge: "default" },
  { role: "CEO", access: "View only — cannot upload", badge: "secondary" },
  { role: "Bookkeeper", access: "Upload only — assigned items", badge: "secondary" },
  { role: "Solicitor", access: "Legal items only", badge: "outline" },
  { role: "Banker", access: "Bank-related items only", badge: "outline" },
];

export default function ClientPortal() {
  const [requests, _setRequests] = useState(PBC_REQUESTS);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(true);

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    return diff;
  };

  const deadlineColor = (days) => {
    if (days < 3) return "text-ae-red";
    if (days <= 7) return "text-ae-orange";
    return "text-ae-green";
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (searchTerm && !r.item.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [requests, filter, searchTerm]);

  const statusCounts = useMemo(() => {
    const counts = { all: requests.length };
    Object.keys(STATUS_CONFIG).forEach((s) => {
      counts[s] = requests.filter((r) => r.status === s).length;
    });
    return counts;
  }, [requests]);

  const completionPct = Math.round(
    (requests.filter((r) => r.status === "accepted").length / requests.length) * 100
  );

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8">
      {/* GDPR Banner */}
      {!gdprConsent && (
        <div className="mb-6 p-4 rounded-lg border border-ae-blue/30 bg-ae-blue/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-ae-blue" />
              <div>
                <p className="text-sm text-white font-medium">Data Processing Agreement</p>
                <p className="text-xs text-ae-dim">By using this portal you agree to our data processing terms under UK GDPR.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">View DPA</Button>
              <Button size="sm" onClick={() => setGdprConsent(true)} className="text-xs">Accept</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">Client Portal</h1>
          <p className="text-ae-dim text-sm mt-1">Secure document exchange &mdash; Prepared by Client (PBC) requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" /> End-to-end encrypted
          </Badge>
          <Badge variant="info">{completionPct}% complete</Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Total Requests", count: statusCounts.all, variant: "secondary" },
          { label: "Outstanding", count: statusCounts.outstanding, variant: "destructive" },
          { label: "Uploaded", count: statusCounts.uploaded, variant: "warning" },
          { label: "Under Review", count: statusCounts.under_review, variant: "info" },
          { label: "Accepted", count: statusCounts.accepted, variant: "success" },
          { label: "Queries", count: statusCounts.query, variant: "secondary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.count}</div>
              <Badge variant={s.variant} className="text-[9px] mt-1">{s.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="requests">PBC Requests</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="settings">Access</TabsTrigger>
        </TabsList>

        {/* PBC Request List */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">PBC Request List</CardTitle>
                  <CardDescription>{filteredRequests.length} items &middot; {completionPct}% complete</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ae-dim" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <div className="flex gap-1">
                    {["all", "outstanding", "uploaded", "under_review", "accepted", "query"].map((f) => (
                      <Button
                        key={f}
                        size="sm"
                        variant={filter === f ? "default" : "ghost"}
                        onClick={() => setFilter(f)}
                        className="text-[10px] h-7 px-2"
                      >
                        {f === "all" ? "All" : f === "under_review" ? "Review" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completionPct} className="mb-4 h-2" indicatorClassName="bg-ae-green" />
              <div className="space-y-2">
                {filteredRequests.map((req) => {
                  const cfg = STATUS_CONFIG[req.status];
                  const days = daysUntil(req.deadline);
                  return (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg border border-ae-border bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <StatusIcon className="h-4 w-4 flex-shrink-0" style={{ color: cfg.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white">{req.item}</div>
                        <div className="text-[10px] text-ae-dim mt-0.5 flex items-center gap-2">
                          <span>{req.category}</span>
                          <span className="text-slate-600">&middot;</span>
                          <Badge variant="outline" className="font-mono text-[8px] px-1 py-0 h-3.5">{req.fsli}</Badge>
                          {req.uploadedBy && (
                            <>
                              <span className="text-slate-600">&middot;</span>
                              <span>by {req.uploadedBy}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-xs font-medium ${deadlineColor(days)}`}>
                          {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : `${days}d left`}
                        </div>
                        <div className="text-[9px] text-ae-dim">
                          {new Date(req.deadline).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <Badge variant={cfg.variant} className="text-[10px] w-24 justify-center">
                        {cfg.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-4 w-4" /> Document Upload
              </CardTitle>
              <CardDescription>Upload documents against outstanding PBC requests. All uploads are logged with SHA-256 hash.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter((r) => r.status === "outstanding").map((req) => (
                  <div key={req.id} className="p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-white">{req.item}</div>
                        <div className="text-[10px] text-ae-dim">{req.category} &middot; FSLI: {req.fsli}</div>
                      </div>
                      <div className={`text-xs font-medium ${deadlineColor(daysUntil(req.deadline))}`}>
                        {daysUntil(req.deadline)}d left
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-ae-border rounded-lg p-6 text-center hover:border-brand/40 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 text-ae-dim mx-auto mb-2" />
                      <p className="text-xs text-ae-dim">Drag & drop or click to upload</p>
                      <p className="text-[9px] text-ae-dim/60 mt-1">PDF, Excel, Word, CSV, images &middot; Max 50MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Log */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Upload Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {[
                  { file: "CT600_2025-26.pdf", user: "Tax Advisor", time: "2026-03-29 11:42", size: "1.2MB", hash: "a3f8...c912" },
                  { file: "Fixed_Asset_Register.xlsx", user: "Sarah FD", time: "2026-03-28 09:15", size: "342KB", hash: "b7e2...d451" },
                  { file: "Inventory_Count_Sheets.pdf", user: "Sarah FD", time: "2026-03-25 16:30", size: "4.8MB", hash: "c4d1...f823" },
                  { file: "Sales_Invoice_Sample.zip", user: "John Bookkeeper", time: "2026-03-20 14:22", size: "12.1MB", hash: "d9a3...e156" },
                  { file: "Bank_Confirmation_Barclays.pdf", user: "Sarah FD", time: "2026-03-22 10:05", size: "89KB", hash: "e2f4...a789" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded border border-ae-border/50">
                    <FileText className="h-3.5 w-3.5 text-ae-dim" />
                    <span className="text-slate-200 flex-1 truncate">{log.file}</span>
                    <span className="text-ae-dim">{log.user}</span>
                    <span className="text-ae-dim">{log.time}</span>
                    <span className="text-ae-dim">{log.size}</span>
                    <span className="font-mono text-slate-500">{log.hash}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Query Threads Tab */}
        <TabsContent value="queries">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Query Threads
              </CardTitle>
              <CardDescription>Communication between audit team and client &middot; per PBC request item</CardDescription>
            </CardHeader>
            <CardContent>
              {QUERY_THREADS.map((thread) => (
                <div key={thread.id} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-ae-border">
                    <Badge variant="secondary" className="text-[10px]">#{thread.id}</Badge>
                    <span className="text-sm font-medium text-white">{thread.item}</span>
                  </div>

                  <ScrollArea className="max-h-64">
                    <div className="space-y-3">
                      {thread.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.from === "client" ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarFallback className="text-[9px]">
                              {msg.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`max-w-[70%] ${msg.from === "client" ? "text-right" : ""}`}>
                            <div className="text-[10px] text-ae-dim mb-1">
                              {msg.name} &middot; {msg.time}
                            </div>
                            <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                              msg.from === "client"
                                ? "bg-brand/10 border border-brand/20 text-slate-200"
                                : "bg-white/5 border border-ae-border text-slate-300"
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" className="gap-1">
                      <Send className="h-3 w-3" /> Send
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access & GDPR Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Client Roles & Access
                </CardTitle>
                <CardDescription>Completely isolated from audit work papers and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CLIENT_ROLES.map((cr) => (
                    <div key={cr.role} className="flex items-center gap-3 p-3 rounded-lg border border-ae-border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px]">{cr.role.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{cr.role}</div>
                        <div className="text-[10px] text-ae-dim">{cr.access}</div>
                      </div>
                      <Badge variant={cr.badge} className="text-[9px]">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" /> GDPR Compliance
                </CardTitle>
                <CardDescription>UK GDPR data protection controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ae-green/10 border border-ae-green/30">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-ae-green" />
                      <span className="text-sm font-medium text-ae-green">Consent Recorded</span>
                    </div>
                    <p className="text-[10px] text-ae-dim">Data processing consent received 15 March 2026</p>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2 text-xs">
                      <FileText className="h-3.5 w-3.5" /> View Data Processing Agreement
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-xs">
                      <Download className="h-3.5 w-3.5" /> Export My Data (ZIP)
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-xs text-ae-red border-ae-red/30 hover:bg-ae-red/10">
                      <Trash2 className="h-3.5 w-3.5" /> Request Data Deletion
                    </Button>
                  </div>

                  <div className="text-[9px] text-ae-dim leading-relaxed">
                    All data is processed in accordance with the UK General Data Protection Regulation
                    (UK GDPR) and the Data Protection Act 2018. Your data is stored securely on
                    EU-hosted Supabase infrastructure with AES-256 encryption at rest.
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-[9px] text-slate-600 w-full text-center">
                  Powered by AuditEngine &middot; auditengine.agency
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
