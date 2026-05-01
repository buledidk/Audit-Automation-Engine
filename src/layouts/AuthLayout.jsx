
export default function AuthLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0B1120",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        width: 440,
        maxWidth: "95vw",
        padding: 32,
        borderRadius: 16,
        background: "#151D30",
        border: "1px solid rgba(255,255,255,0.12)"
      }}>
        <Outlet />
      </div>
    </div>
  );
}
