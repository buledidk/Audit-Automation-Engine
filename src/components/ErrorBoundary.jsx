import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const level = this.props.level || "page";

    return (
      <div style={{
        padding: level === "app" ? 60 : 32,
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
        color: "#B0B8C8",
        minHeight: level === "app" ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: level === "app" ? "#0B1120" : "transparent"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {level === "app" ? "Something went wrong" : "Error loading section"}
        </div>
        <p style={{ fontSize: 13, maxWidth: 500, lineHeight: 1.6, marginBottom: 20, color: "#6B7A90" }}>
          {this.state.error?.message || "An unexpected error occurred."}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={this.handleReset}
            style={{
              padding: "10px 20px", borderRadius: 8,
              background: "#00E5A0", border: "none",
              color: "#000", cursor: "pointer", fontSize: 12, fontWeight: 700
            }}
          >
            Try Again
          </button>
          {level === "app" && (
            <button
              onClick={() => window.location.href = "/"}
              style={{
                padding: "10px 20px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#B0B8C8", cursor: "pointer", fontSize: 12, fontWeight: 600
              }}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }
}
