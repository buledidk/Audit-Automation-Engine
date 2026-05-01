import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEngagement } from "@/context/EngagementContext";
import { setActiveEngagementId } from "@/StorageEngine";
import {
  LayoutDashboard, ClipboardList, Folder, FileText, BarChart3,
  ShieldCheck, GanttChart, CheckCircle2, ChevronRight, ChevronDown,
  Briefcase, AlertTriangle, PanelLeftClose, PanelLeftOpen,
  Calculator, Globe, Zap, BookOpen
} from "lucide-react";

const WP_SECTIONS = [
  { key: "planning", label: "A: Planning & Acceptance", icon: ClipboardList, color: "#42A5F5",
    items: [
      { id: "a1", ref: "A1", label: "Engagement Letter", isa: "ISA 210" },
      { id: "a2", ref: "A2", label: "Client Acceptance", isa: "ISA 220" },
      { id: "a3", ref: "A3", label: "Audit Strategy", isa: "ISA 300" },
      { id: "a4", ref: "A4", label: "Materiality", isa: "ISA 320" },
      { id: "a5", ref: "A5", label: "Understanding Entity", isa: "ISA 315" },
      { id: "a6", ref: "A6", label: "Fraud Risk", isa: "ISA 240" },
    ]},
  { key: "risk", label: "B: Risk Assessment", icon: ShieldCheck, color: "#EF5350",
    items: [
      { id: "b1", ref: "B1", label: "Risk Matrix", isa: "ISA 315" },
      { id: "b2", ref: "B2", label: "Controls Assessment", isa: "ISA 315.14" },
      { id: "b3", ref: "B3", label: "Significant Risks", isa: "ISA 315.28" },
    ]},
  { key: "testing", label: "C: Execution & Testing", icon: BarChart3, color: "#FFA726",
    items: [
      { id: "d1", ref: "D1", label: "Revenue", isa: "ISA 240", fsli: "REV" },
      { id: "d2", ref: "D2", label: "Receivables", isa: "ISA 505", fsli: "TRD" },
      { id: "d3", ref: "D3", label: "Inventory", isa: "ISA 501", fsli: "INV" },
      { id: "d4", ref: "D4", label: "Payables", isa: "ISA 505", fsli: "TRP" },
      { id: "d6", ref: "D6", label: "Cash & Bank", isa: "ISA 505", fsli: "CSH" },
      { id: "d7", ref: "D7", label: "Fixed Assets", isa: "ISA 540", fsli: "PPE" },
      { id: "d9", ref: "D9", label: "Investments", isa: "FRS 102", fsli: "FIN" },
      { id: "d11", ref: "D11", label: "Loans & Borrowings", isa: "FRS 102", fsli: "BRW" },
      { id: "d13", ref: "D13", label: "Taxation", isa: "FRS 102 s29", fsli: "TAX" },
      { id: "d15", ref: "D15", label: "Related Parties", isa: "ISA 550", fsli: "RPT" },
    ]},
  { key: "completion", label: "D: Completion", icon: CheckCircle2, color: "#66BB6A",
    items: [
      { id: "e1", ref: "E1", label: "Completion Checklist", isa: "ISA 220" },
      { id: "e2", ref: "E2", label: "Final Analytical Review", isa: "ISA 520" },
      { id: "a7", ref: "A7", label: "Going Concern", isa: "ISA 570" },
      { id: "e3", ref: "E3", label: "Subsequent Events", isa: "ISA 560" },
      { id: "e4", ref: "E4", label: "Written Representations", isa: "ISA 580" },
      { id: "e6", ref: "E6", label: "Audit Completion Memo", isa: "ISA 230" },
    ]},
];

/** Outer shell — wraps with EngagementProvider */
export default function EngagementShell() {
  const { id } = useParams();

  useEffect(() => {
    if (id) setActiveEngagementId(id);
  }, [id]);

  return (
    <EngagementProvider initialEngId={id}>
      <EngagementShellInner engId={id} />
    </EngagementProvider>
  );
}

/** Inner shell — consumes EngagementContext for real data */
function EngagementShellInner({ engId }) { // eslint-disable-line no-unused-vars
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ planning: false, risk: false, testing: true, completion: false });

  const ctx = useEngagement();

  const cfg = ctx?.cfg || {};
  const signOffs = ctx?.signOffs || {};
  const reviewNotes = ctx?.reviewNotes || {};
  const uploads = ctx?.uploads || {};
  const customItems = ctx?.customItems || { risks: [] };

  const getWpStatus = (wpId) => {
    const so = signOffs[wpId] || {};
    if (so.approvedBy) return { label: "Approved", color: "#66BB6A", icon: "★" };
    if (so.reviewedBy) return { label: "Reviewed", color: "#42A5F5", icon: "✓" };
    if (so.preparedBy) return { label: "Prepared", color: "#FFA726", icon: "◐" };
    return { label: "Open", color: "#6B7A90", icon: "○" };
  };

  const totalWPs = WP_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const doneWPs = WP_SECTIONS.reduce((s, sec) => s + sec.items.filter(wp => signOffs[wp.id]?.preparedBy).length, 0);
  const completionPct = totalWPs > 0 ? Math.round((doneWPs / totalWPs) * 100) : 0;

  const openNotes = Object.values(reviewNotes).flat().filter(n => n?.status === "raised" || n?.status === "responded").length;
  const findingsCount = customItems.risks?.length || 0;
  const evidenceCount = Object.values(uploads).flat().length;

  const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));


  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
      isActive ? "bg-brand/15 text-brand font-medium" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`;

  return (
    <div className="flex min-h-screen bg-ae-bg">
      {/* Inner Sidebar */}
      {!collapsed && (
        <aside className="w-[260px] flex-shrink-0 border-r border-ae-border bg-slate-900/80 flex flex-col h-screen sticky top-0 overflow-hidden">
          {/* Engagement Header */}
          <div className="p-4 border-b border-ae-border">
            <div className="text-sm font-semibold text-white truncate">{cfg.entityName || "New Engagement"}</div>
            <div className="text-[10px] text-ae-dim mt-0.5">
              {cfg.fye ? `Year End: ${cfg.fye}` : "Year end not set"} {cfg.framework ? `· ${cfg.framework.toUpperCase()}` : ""}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={completionPct} className="flex-1 h-1.5" />
              <span className="text-[10px] text-ae-dim">{completionPct}%</span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {/* Overview */}
              <NavLink to={`/engagement/${engId}`} end className={navClass}>
                <LayoutDashboard className="h-3.5 w-3.5" /> Overview
              </NavLink>

              {/* Phase Sections */}
              {WP_SECTIONS.map((section) => {
                const isExpanded = expandedSections[section.key];
                const sectionDone = section.items.filter(wp => signOffs[wp.id]?.preparedBy).length;
                return (
                  <div key={section.key}>
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ color: section.color }}
                    >
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      <Icon className="h-3.5 w-3.5" />
                      <span className="flex-1 text-left truncate">{section.label}</span>
                      <span className="text-[9px] text-ae-dim font-normal">{sectionDone}/{section.items.length}</span>
                    </button>
                    {isExpanded && (
                      <div className="ml-4 space-y-0.5 mb-2">
                        {section.items.map((wp) => {
                          const st = getWpStatus(wp.id);
                          const route = wp.fsli ? `fsli/${wp.fsli}` : `procedures/${wp.id}`;
                          return (
                            <NavLink key={wp.id} to={`/engagement/${engId}/${route}`} className={navClass}>
                              <span className="text-[10px] w-3 text-center" style={{ color: st.color }}>{st.icon}</span>
                              <span className="truncate flex-1">{wp.ref} {wp.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Quick Links */}
              <div className="border-t border-ae-border mt-3 pt-3 space-y-1">
                <NavLink to={`/engagement/${engId}/ipv`} className={navClass}>
                  <Calculator className="h-3.5 w-3.5" /> IPV Dashboard
                </NavLink>
                <NavLink to={`/engagement/${engId}/procedures`} className={navClass}>
                  <ClipboardList className="h-3.5 w-3.5" /> Procedures
                  <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3.5 ml-auto">{doneWPs}/{totalWPs}</Badge>
                </NavLink>
                <NavLink to={`/engagement/${engId}/evidence`} className={navClass}>
                  <Folder className="h-3.5 w-3.5" /> Evidence
                  {evidenceCount > 0 && <Badge variant="info" className="text-[8px] px-1 py-0 h-3.5 ml-auto">{evidenceCount}</Badge>}
                </NavLink>
                <NavLink to={`/engagement/${engId}/findings`} className={navClass}>
                  <AlertTriangle className="h-3.5 w-3.5" /> Findings
                  {findingsCount > 0 && <Badge variant="warning" className="text-[8px] px-1 py-0 h-3.5 ml-auto">{findingsCount}</Badge>}
                </NavLink>
                <NavLink to={`/engagement/${engId}/materiality`} className={navClass}>
                  <BarChart3 className="h-3.5 w-3.5" /> Materiality
                </NavLink>
                <NavLink to={`/engagement/${engId}/risk`} className={navClass}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Risk Assessment
                </NavLink>
                <NavLink to={`/engagement/${engId}/review`} className={navClass}>
                  <GanttChart className="h-3.5 w-3.5" /> Review
                  {openNotes > 0 && <Badge variant="destructive" className="text-[8px] px-1 py-0 h-3.5 ml-auto">{openNotes}</Badge>}
                </NavLink>
                <NavLink to={`/engagement/${engId}/full`} className={navClass}>
                  <Briefcase className="h-3.5 w-3.5" /> Full Audit File
                </NavLink>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-ae-border">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[9px]">{(cfg.partner || "JP").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-white truncate">{cfg.partner || "Partner"}</div>
                <div className="text-[8px] text-ae-dim">{cfg.manager || "Manager"}</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed bottom-4 z-50 h-7 w-7 rounded-full bg-slate-800 border border-ae-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        style={{ left: collapsed ? 8 : 252 }}
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </button>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <Outlet context={{ collapsed, engId }} />
      </main>
    </div>
  );
}
