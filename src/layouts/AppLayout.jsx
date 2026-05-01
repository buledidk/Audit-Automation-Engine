import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, Users, BarChart3, ShieldCheck, // eslint-disable-line no-unused-vars
  GanttChart, Globe, Settings, ChevronLeft, ChevronRight, Bell,
  Menu, X, LogOut, FileText, ClipboardList, Folder,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/engagement/new", icon: Briefcase, label: "New Engagement" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/partner", icon: ShieldCheck, label: "Partner" },
  { to: "/portal", icon: Globe, label: "Client Portal" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const ENGAGEMENT_NAV = (engId) => [
  { to: `/engagements/${engId}`, icon: LayoutDashboard, label: "Overview", end: true },
  { to: `/engagements/${engId}/procedures`, icon: ClipboardList, label: "Procedures" },
  { to: `/engagements/${engId}/evidence`, icon: Folder, label: "Evidence" },
  { to: `/engagements/${engId}/findings`, icon: FileText, label: "Findings" },
  { to: `/engagements/${engId}/materiality`, icon: BarChart3, label: "Materiality" },
  { to: `/engagements/${engId}/risk`, icon: ShieldCheck, label: "Risk" },
  { to: `/engagements/${engId}/review`, icon: GanttChart, label: "Review" },
  { to: `/engagements/${engId}/full`, icon: Briefcase, label: "Full Audit File" },
];

export default function AppLayout() {
  const params = useParams();
  const engId = params.engId; // legacy route
  const engagementId = params.id; // new unified route (EngagementShell handles its own sidebar)
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setTimeout(() => { setMobileOpen(false); }, 0);
  }, [engId]);

  const sidebarWidth = collapsed ? 64 : 260;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group cursor-pointer ${
      isActive
        ? "bg-brand/15 text-brand border-l-2 border-brand"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent"
    }`;

  const renderNav = (items) =>
    items.map((item) => {
      const ItemIcon = item.icon;
      return (
        <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
          <ItemIcon className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      );
    });

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-ae-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
          AE
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-white leading-tight">
              Audit<span className="text-brand">Engine</span>
            </div>
            <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em]">Enterprise Platform</div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Platform
          </div>
        )}
        <nav className="space-y-1">
          {renderNav(NAV_ITEMS)}
        </nav>

        {/* Engagement Context Nav */}
        {engId && !engagementId && (
          <>
            <div className="my-4 border-t border-ae-border" />
            {!collapsed && (
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Engagement
              </div>
            )}
            <nav className="space-y-1">
              {renderNav(ENGAGEMENT_NAV(engId))}
            </nav>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-ae-border px-3 py-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">JP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">James Parker</div>
              <Badge variant="default" className="text-[8px] px-1.5 py-0 h-4 mt-0.5">Partner</Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-300">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">JP</AvatarFallback>
            </Avatar>
          </div>
        )}
        {!collapsed && (
          <div className="text-[9px] text-slate-600 px-2 mt-2">
            AuditEngine v10 &middot; Indus Nexus Ltd
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ae-bg font-['DM_Sans',sans-serif] text-slate-100">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-ae-border bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-300">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-['Cormorant_Garamond',serif] text-lg font-semibold">
            Audit<span className="text-brand">Engine</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-400">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-ae-red text-[8px] flex items-center justify-center text-white font-bold">3</span>
          </Button>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px]">JP</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full bg-slate-900 border-r border-ae-border flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r border-ae-border bg-slate-900/95 backdrop-blur-sm z-40 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-slate-800 border border-ae-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer z-50"
        >
          {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
        </button>
      </aside>

      {/* Top bar (desktop) */}
      <header
        className="hidden lg:flex items-center justify-between h-14 border-b border-ae-border bg-ae-bg/80 backdrop-blur-sm sticky top-0 z-30 px-6 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="text-sm text-slate-400">
          {(engId || engagementId) ? (
            <span>Engagement: <span className="text-white font-medium">{engId.slice(0, 12)}</span></span>
          ) : (
            <span>auditengine.agency</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-ae-red text-[8px] flex items-center justify-center text-white font-bold">3</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main
        className="transition-all duration-300 min-h-screen lg:pt-0 pt-0"
        style={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 1024 ? sidebarWidth : 0 }}
      >
        <Outlet context={{ collapsed }} />
      </main>
    </div>
  );
}
