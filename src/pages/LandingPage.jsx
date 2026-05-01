import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, BarChart3, Users, Globe, Zap, CheckCircle2,
  ArrowRight, Lock, Brain, FileText, Calculator, Briefcase,
  ChevronRight, Star
} from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "35 AI Agents", desc: "Planning, risk, fraud detection, testing, completion — all ISA-compliant with confidence scoring" },
  { icon: ShieldCheck, title: "FRC Inspection Ready", desc: "59 FRC AQR findings mapped to work papers. Real-time quality scoring across 8 themes" },
  { icon: BarChart3, title: "76 Audit Engines", desc: "Materiality, DCF, journal testing, Benford's Law, financial ratios, HMRC compliance" },
  { icon: FileText, title: "87 Working Papers", desc: "ISA (UK) compliant across 12 sections — auto-populated with industry-specific procedures" },
  { icon: Calculator, title: "IPV Dashboard", desc: "IFRS 13 Level 1/2/3 verification, ISA 540/620, credit ratings, sensitivity analysis" },
  { icon: Globe, title: "Client Portal", desc: "PBC requests, secure document exchange, query threads, GDPR compliant with 5 role types" },
  { icon: Lock, title: "Enterprise Security", desc: "HSTS, CSP headers, AES-256 encryption, role-based access, full audit trail" },
  { icon: Users, title: "Team Workflow", desc: "3-stage sign-off (Prepare → Review → Approve), review notes, partner gates, one-click batch approval" },
];

const PRICING = [
  { tier: "Solo", price: "£99", period: "/mo", annual: "£990/yr", users: "1 user", engagements: "20 engagements", features: ["All 76 engines", "87 working papers", "ISA compliance", "Export to Excel/Word/PDF"] },
  { tier: "Small Firm", price: "£499", period: "/mo", annual: "£4,990/yr", users: "10 users", engagements: "100 engagements", features: ["Everything in Solo", "Client Portal", "Team collaboration", "Real-time sync"], popular: true },
  { tier: "Mid-Tier", price: "£1,999", period: "/mo", annual: "£19,990/yr", users: "50 users", engagements: "500 engagements", features: ["Everything in Small Firm", "35 AI agents", "ML risk prediction", "API access"] },
  { tier: "Enterprise", price: "Custom", period: "", annual: "From £49,990/yr", users: "Unlimited", engagements: "Unlimited", features: ["Everything in Mid-Tier", "SSO & white-label", "On-premise option", "Dedicated support"] },
];

const COMPETITORS = [
  { name: "CaseWare", price: "£2,500/user/yr" },
  { name: "AuditBoard", price: "£40-150K/yr" },
  { name: "DataSnipper", price: "£1,000/user/yr" },
  { name: "Inflo", price: "£2,000/user/yr" },
];

const STATS = [
  { value: "140K+", label: "Lines of Code" },
  { value: "305", label: "Tests Passing" },
  { value: "76", label: "Audit Engines" },
  { value: "35", label: "AI Agents" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ae-bg text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-ae-border/50 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-slate-900 font-bold text-sm">AE</div>
          <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold">Audit<span className="text-brand">Engine</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button size="sm" onClick={() => navigate("/")}>Launch Platform</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <Badge className="mb-6 text-xs px-4 py-1.5">UK's Most Comprehensive Audit Automation Platform</Badge>
        <h1 className="font-['Cormorant_Garamond',serif] text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Enterprise audit automation<br />
          <span className="text-brand">powered by 35 AI agents</span>
        </h1>
        <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          76 audit engines. 87 ISA-compliant working papers. FRC inspection ready.
          From micro-entities to Main Market listed — one platform for the entire audit lifecycle.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button size="lg" onClick={() => navigate("/")} className="gap-2 text-base px-8">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/demo")} className="gap-2 text-base px-8">
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold">Everything you need to run a world-class audit</h2>
          <p className="text-slate-400 mt-3">Built by auditors, for auditors. Every ISA reference embedded.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            return (
              <Card key={f.title} className="hover:border-brand/30 transition-colors">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="success" className="mb-4">UK Regulatory Compliance</Badge>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold mb-4">
              Built for the UK audit market
            </h2>
            <div className="space-y-3">
              {[
                "ISA (UK) 200-720 — full International Standards on Auditing coverage",
                "FRS 102 / FRS 105 / IFRS — all UK GAAP frameworks supported",
                "FRC AQR 2020-2025 — 59 findings mapped to specific work papers",
                "Companies Act 2006 — audit exemption thresholds, filing deadlines",
                "HMRC — CT600, VAT, PAYE/NIC rates current to April 2025/26",
                "MLR 2017 — AML/KYC compliance built into client acceptance",
                "FCA Handbook — CASS 7, MIFIDPRU for financial services audits",
                "Charities SORP — charity-specific procedures and disclosures",
                "ISQM 1/2 — quality management system monitoring",
                "UK GDPR — data protection, consent management, right to deletion",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-ae-green mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ISA Standards", count: "50+", desc: "Referenced" },
              { label: "Working Papers", count: "87", desc: "Auto-generated" },
              { label: "Industries", count: "8", desc: "With procedures" },
              { label: "FRC Findings", count: "59", desc: "Mapped to WPs" },
              { label: "FSLI Codes", count: "80", desc: "Tracked" },
              { label: "Entity Types", count: "9", desc: "Supported" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand">{s.count}</div>
                  <div className="text-xs text-white font-medium">{s.label}</div>
                  <div className="text-[10px] text-slate-500">{s.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="text-slate-400 mt-3">No hidden fees. Cancel anytime. All plans include all 76 engines.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING.map((p) => (
            <Card key={p.tier} className={p.popular ? "border-brand ring-1 ring-brand relative" : ""}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-[10px] px-3 gap-1"><Star className="h-2.5 w-2.5" /> Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-white mb-1">{p.tier}</div>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="text-3xl font-bold text-white">{p.price}</span>
                  <span className="text-sm text-slate-400">{p.period}</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-4">{p.annual}</div>
                <div className="text-xs text-slate-400 mb-1">{p.users} &middot; {p.engagements}</div>
                <div className="border-t border-ae-border my-3" />
                <div className="space-y-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3 w-3 text-ae-green flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant={p.popular ? "default" : "outline"} size="sm" onClick={() => navigate("/")}>
                  {p.tier === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Competitor comparison */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Compare: {COMPETITORS.map((c) => `${c.name} (${c.price})`).join(" · ")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold mb-4">
          Ready to transform your audit practice?
        </h2>
        <p className="text-slate-400 mb-8">Join the firms using AI-powered audit automation to deliver higher quality, faster.</p>
        <Button size="lg" onClick={() => navigate("/")} className="gap-2 text-base px-10">
          Launch AuditEngine <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-ae-border max-w-7xl mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-brand/20 flex items-center justify-center text-brand text-[9px] font-bold">AE</div>
            <span>AuditEngine v10 &middot; Indus Nexus Limited</span>
          </div>
          <div className="flex gap-4">
            <span>auditengine.agency</span>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
