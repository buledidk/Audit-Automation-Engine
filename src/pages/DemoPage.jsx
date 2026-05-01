import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { // eslint-disable-next-line no-unused-vars
  Play, ArrowRight, Download, Building2, Landmark, Heart,
  Brain, FileText, ShieldCheck, BarChart3
} from "lucide-react";
import { generateDemoState, generateDemoFinancialServices, generateDemoCharity } from "../demoSeed";
import DemoTour from "../components/DemoTour/DemoTour"; // eslint-disable-line no-unused-vars
import AgentShowcase from "../components/DemoTour/AgentShowcase"; // eslint-disable-line no-unused-vars

const DEMO_OPTIONS = [
  {
    id: "construction",
    icon: Building2,
    title: "Construction",
    entity: "Meridian Construction Ltd",
    desc: "Medium-sized FRS 102 entity. Revenue £8.2m. 14 risks including significant revenue recognition and WIP valuation.",
    color: "#F5A623",
    generator: generateDemoState,
  },
  {
    id: "financial_services",
    icon: Landmark,
    title: "Financial Services",
    entity: "Nexus Financial Services Ltd",
    desc: "Large IFRS PIE entity. AUM £2.4bn. FCA regulated. CASS 7 client money, complex fee income, regulatory capital.",
    color: "#8B5CF6",
    generator: generateDemoFinancialServices,
  },
  {
    id: "charity",
    icon: Heart,
    title: "Charity",
    desc: "Charitable entity under Charities SORP (FRS 102). Restricted funds, grant income, trustee obligations.",
    entity: "Hope Foundation",
    color: "#10B981",
    generator: generateDemoCharity,
  },
];

const STATS = [
  { icon: ShieldCheck, value: "37", label: "ISA Standards" },
  { icon: FileText, value: "97", label: "Working Papers" },
  { icon: Brain, value: "23", label: "AI Agents" },
  { icon: BarChart3, value: "8", label: "Industries" },
];

function loadDemoIntoStorage(generator) {
  const data = generator();
  const prefix = "ae_";
  if (data.cfg) localStorage.setItem(prefix + "cfg", JSON.stringify(data.cfg));
  if (data.cellData) localStorage.setItem(prefix + "cellData", JSON.stringify(data.cellData));
  if (data.signOffs) localStorage.setItem(prefix + "signOffs", JSON.stringify(data.signOffs));
  if (data.wpNotes) localStorage.setItem(prefix + "wpNotes", JSON.stringify(data.wpNotes));
  if (data.customItems) localStorage.setItem(prefix + "customItems", JSON.stringify(data.customItems));
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [tourActive, setTourActive] = useState(false);
  const [_selectedIndustry, setSelectedIndustry] = useState(null);
  const [showAgentStandalone, setShowAgentStandalone] = useState(false);

  const handleStartTour = useCallback((option) => {
    loadDemoIntoStorage(option.generator);
    setSelectedIndustry(option.id);
    setTourActive(true);
  }, []);

  const handleExploreFree = useCallback((option) => {
    loadDemoIntoStorage(option.generator);
    navigate("/");
  }, [navigate]);

  const handleTourComplete = useCallback(() => {
    setTourActive(false);
  }, []);

  return (
    <div className="min-h-screen bg-ae-bg text-white">
      {/* Tour overlay */}
      {tourActive && (
        <DemoTour active={tourActive} onComplete={handleTourComplete} />
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-ae-border/50 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/welcome")}>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-slate-900 font-bold text-sm">AE</div>
          <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold">Audit<span className="text-brand">Engine</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/welcome")}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-brand text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold mb-6">
          <Play className="h-3 w-3" /> Interactive Demo
        </div>
        <h1 className="font-['Cormorant_Garamond',serif] text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
          See AuditEngine in action
        </h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
          Walk through a complete statutory audit engagement — from risk assessment
          to signed report. Watch AI agents populate working papers in real time.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-2xl mx-auto">
          {STATS.map((s) => {
            const Icon = s.icon; // eslint-disable-line no-unused-vars
            return (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[#0f1729] border border-ae-border/30">
                <Icon className="h-4 w-4 text-brand mb-1" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industry Selector */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-center mb-8">
          Choose an industry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {DEMO_OPTIONS.map((opt) => {
            const Icon = opt.icon; // eslint-disable-line no-unused-vars
            return (
              <div
                key={opt.id}
                className="group bg-[#1a2235] border border-ae-border/50 rounded-xl p-6 hover:border-brand/40 transition-all"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: opt.color + "15", border: `1px solid ${opt.color}33` }}
                >
                  <Icon className="h-6 w-6" style={{ color: opt.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{opt.title}</h3>
                <p className="text-[11px] text-slate-500 mb-1">{opt.entity}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">{opt.desc}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStartTour(opt)}
                    className="w-full flex items-center justify-center gap-2 bg-brand text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-light transition-colors"
                  >
                    <Play className="h-3 w-3" /> Start Guided Tour
                  </button>
                  <button
                    onClick={() => handleExploreFree(opt)}
                    className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white border border-ae-border/50 px-4 py-2.5 rounded-lg hover:border-brand/30 transition-colors"
                  >
                    Explore Freely <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Agent Preview */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-center mb-3">
          Watch AI audit intelligence
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          See how our planning agent analyses a construction audit engagement in real time.
        </p>
        {showAgentStandalone ? (
          <AgentShowcase />
        ) : (
          <div className="bg-[#0a0f1e] border border-ae-border/50 rounded-lg p-8 text-center">
            <Brain className="h-8 w-8 text-brand mx-auto mb-3" />
            <button
              onClick={() => setShowAgentStandalone(true)}
              className="bg-brand text-slate-900 text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-light transition-colors inline-flex items-center gap-2"
            >
              <Play className="h-3 w-3" /> Launch AI Agent Demo
            </button>
          </div>
        )}
      </section>

      {/* Download Samples */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-center mb-3">
          Download sample outputs
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          Generated from the Construction demo engagement — real working paper content, not templates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Audit Planning Memo", format: "Word (.docx)", desc: "Full planning memo with ISA references, risk assessment, and audit strategy", icon: FileText },
            { label: "Lead Schedule Workbook", format: "Excel (.xlsx)", desc: "P&L and balance sheet lead schedules with prior year comparatives and WP references", icon: BarChart3 },
            { label: "Audit Report", format: "PDF", desc: "Independent auditor's report with unmodified opinion under FRS 102", icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon; // eslint-disable-line no-unused-vars
            return (
              <button
                key={item.label}
                onClick={() => {
                  // Load demo data first, then trigger export
                  loadDemoIntoStorage(generateDemoState);
                  // Export functionality will be wired to useExportHandlers
                  alert(`Export: ${item.label}\n\nTo generate this document, load the Construction demo from the main dashboard and use the Export menu.\n\nFull export integration coming in the next update.`);
                }}
                className="bg-[#1a2235] border border-ae-border/50 rounded-xl p-5 text-left hover:border-brand/40 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.format}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.desc}</p>
                <div className="flex items-center gap-1 text-brand text-xs font-semibold group-hover:text-brand-light transition-colors">
                  <Download className="h-3 w-3" /> Download Sample
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 border-t border-ae-border/30 text-center">
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold mb-4">
          Ready to transform your audit practice?
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Start with a free trial. No credit card required.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="bg-brand text-slate-900 text-sm font-semibold px-8 py-3 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate("/welcome")}
            className="text-sm text-slate-400 hover:text-white border border-ae-border/50 px-8 py-3 rounded-lg hover:border-brand/30 transition-colors"
          >
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
