import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorBoundary from "./components/ErrorBoundary";

// ─── Lazy-loaded pages ──────────────────────────────────────────────────────

// Platform pages
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const EngagementWizard = lazy(() => import("./pages/EngagementWizard"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const PartnerDashboard = lazy(() => import("./pages/PartnerDashboard"));
const SettingsFirmSetup = lazy(() => import("./pages/SettingsFirmSetup"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthLogin = lazy(() => import("./pages/AuthLogin"));
const DemoPage = lazy(() => import("./pages/DemoPage"));

// Engagement shell + pages
const EngagementShell = lazy(() => import("./layouts/EngagementShell"));
const EngagementOverview = lazy(() => import("./pages/EngagementOverview"));
const EngagementDashboard = lazy(() => import("./pages/EngagementDashboard"));
const FSLIWorkPaper = lazy(() => import("./pages/FSLIWorkPaper"));
const IPVDashboard = lazy(() => import("./pages/IPVDashboard"));

// Legacy pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EngagementPage = lazy(() => import("./pages/EngagementPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const MaterialityPage = lazy(() => import("./pages/MaterialityPage"));
const FullAuditFilePage = lazy(() => import("./pages/FullAuditFilePage"));

// Reused sub-views (work inside both new and legacy routes)
const OverviewTab = lazy(() => import("./components/Dashboard/OverviewTab"));
const ProcedureList = lazy(() => import("./components/ProcedureTracker/ProcedureList"));
const ProcedureDetail = lazy(() => import("./components/ProcedureTracker/ProcedureDetail"));
const EvidenceList = lazy(() => import("./components/EvidenceManager/EvidenceList"));
const FindingList = lazy(() => import("./components/FindingLogger/FindingList"));
const FindingDetail = lazy(() => import("./components/FindingLogger/FindingDetail"));
const RealTimeAuditDashboard = lazy(() => import("./components/RealTimeAuditDashboard"));
const CollaborationPanel = lazy(() => import("./components/CollaborationPanel"));
const IntegrationHub = lazy(() => import("./components/IntegrationHub"));
const ReviewDashboard = lazy(() => import("./components/ReviewDashboard"));
const RiskDashboard = lazy(() => import("./components/RiskDashboard"));

function LazyWrap({ children }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[200px] text-slate-500 text-sm">Loading...</div>}>
      <ErrorBoundary level="section">{children}</ErrorBoundary>
    </Suspense>
  );
}

function RouteErrorFallback() {
  return (
    <div style={{
      padding: 60, textAlign: "center", fontFamily: "'DM Sans', sans-serif",
      color: "#B0B8C8", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0B1120"
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>Page Error</div>
      <p style={{ fontSize: 13, color: "#6B7A90", marginBottom: 20 }}>Something went wrong loading this page.</p>
      <button onClick={() => window.location.href = "/"} style={{ padding: "10px 20px", borderRadius: 8, background: "#F5A623", border: "none", color: "#000", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
        Go to Dashboard
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      // ─── Platform pages ─────────────────────────────────────────────
      { index: true, element: <LazyWrap><MainDashboard /></LazyWrap> },
      { path: "engagement/new", element: <LazyWrap><EngagementWizard /></LazyWrap> },
      { path: "analytics", element: <LazyWrap><AnalyticsDashboard /></LazyWrap> },
      { path: "partner", element: <LazyWrap><PartnerDashboard /></LazyWrap> },
      { path: "portal", element: <LazyWrap><ClientPortal /></LazyWrap> },
      { path: "settings", element: <LazyWrap><SettingsFirmSetup /></LazyWrap> },

      // ─── Unified engagement route (EngagementShell with inner sidebar) ──
      {
        path: "engagement/:id",
        element: <LazyWrap><EngagementShell /></LazyWrap>,
        errorElement: <RouteErrorFallback />,
        children: [
          { index: true, element: <LazyWrap><EngagementOverview /></LazyWrap> },
          { path: "dashboard", element: <LazyWrap><EngagementDashboard /></LazyWrap> },
          { path: "fsli/:code", element: <LazyWrap><FSLIWorkPaper /></LazyWrap> },
          { path: "ipv", element: <LazyWrap><IPVDashboard /></LazyWrap> },
          { path: "procedures", element: <LazyWrap><ProcedureList /></LazyWrap> },
          { path: "procedures/:wpId", element: <LazyWrap><ProcedureDetail /></LazyWrap> },
          { path: "evidence", element: <LazyWrap><EvidenceList /></LazyWrap> },
          { path: "findings", element: <LazyWrap><FindingList /></LazyWrap> },
          { path: "findings/:findingId", element: <LazyWrap><FindingDetail /></LazyWrap> },
          { path: "materiality", element: <LazyWrap><MaterialityPage /></LazyWrap> },
          { path: "risk", element: <LazyWrap><RiskDashboard /></LazyWrap> },
          { path: "review", element: <LazyWrap><ReviewDashboard /></LazyWrap> },
          { path: "realtime", element: <LazyWrap><RealTimeAuditDashboard /></LazyWrap> },
          { path: "collaborate", element: <LazyWrap><CollaborationPanel /></LazyWrap> },
          { path: "integrations", element: <LazyWrap><IntegrationHub /></LazyWrap> },
          { path: "full", element: <LazyWrap><FullAuditFilePage /></LazyWrap> },
        ]
      },

      // ─── Legacy engagement routes (backward compatibility) ──────────
      {
        path: "engagements/:engId",
        element: <LazyWrap><EngagementPage /></LazyWrap>,
        errorElement: <RouteErrorFallback />,
        children: [
          { index: true, element: <LazyWrap><OverviewTab /></LazyWrap> },
          { path: "procedures", element: <LazyWrap><ProcedureList /></LazyWrap> },
          { path: "procedures/:wpId", element: <LazyWrap><ProcedureDetail /></LazyWrap> },
          { path: "evidence", element: <LazyWrap><EvidenceList /></LazyWrap> },
          { path: "findings", element: <LazyWrap><FindingList /></LazyWrap> },
          { path: "findings/:findingId", element: <LazyWrap><FindingDetail /></LazyWrap> },
          { path: "materiality", element: <LazyWrap><MaterialityPage /></LazyWrap> },
          { path: "risk", element: <LazyWrap><RiskDashboard /></LazyWrap> },
          { path: "review", element: <LazyWrap><ReviewDashboard /></LazyWrap> },
          { path: "realtime", element: <LazyWrap><RealTimeAuditDashboard /></LazyWrap> },
          { path: "collaborate", element: <LazyWrap><CollaborationPanel /></LazyWrap> },
          { path: "integrations", element: <LazyWrap><IntegrationHub /></LazyWrap> },
          { path: "settings", element: <LazyWrap><SettingsPage /></LazyWrap> },
          { path: "full", element: <LazyWrap><FullAuditFilePage /></LazyWrap> },
        ]
      },
      { path: "legacy", element: <LazyWrap><DashboardPage /></LazyWrap> },
    ]
  },
  {
    path: "/auth",
    element: <LazyWrap><AuthLogin /></LazyWrap>,
  },
  {
    path: "/welcome",
    element: <LazyWrap><LandingPage /></LazyWrap>,
  },
  {
    path: "/demo",
    element: <LazyWrap><DemoPage /></LazyWrap>,
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;
