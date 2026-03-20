import { Suspense, lazy } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// New comprehensive AuditEngine component
const AuditEngine = lazy(() => import("./src/AuditEngine"));

// Loading fallback
function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0A0E17",
      color: "#F8F8F8",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h1 style={{ margin: "0 0 8px 0" }}>AuditEngine</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>Loading audit lifecycle system...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuditEngine />
      <SpeedInsights />
    </Suspense>
  );
}
