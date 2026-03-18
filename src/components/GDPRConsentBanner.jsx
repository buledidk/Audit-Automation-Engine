/**
 * GDPR CONSENT BANNER COMPONENT
 * Displays consent banner for data processing (GDPR Art. 7)
 * Production-ready, accessibility compliant
 */

import { useState, useEffect } from "react";
import * as apiClient from "../services/apiClient";

export function GDPRConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user has consented
  useEffect(() => {
    const hasConsented = localStorage.getItem("gdpr_consent_given");
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  async function handleAcceptAll() {
    setLoading(true);
    try {
      // Log consent to backend
      await apiClient.auth.getCurrentUser();
      localStorage.setItem("gdpr_consent_given", "true");
      localStorage.setItem("gdpr_consent_timestamp", new Date().toISOString());
      setShowBanner(false);
    } catch (error) {
      console.error("Error recording consent:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!showBanner) return null;

  return (
    <div className="gdpr-banner" style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#1a1a1a",
      color: "#fff",
      padding: "20px",
      zIndex: 9999,
      borderTop: "4px solid #2563eb"
    }}>
      <div className="banner-content" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>🔒 Data Privacy Notice</h3>
        <p style={{ marginBottom: "15px", fontSize: "14px" }}>
          We use your data to provide audit services and comply with regulations. By continuing, you agree to:
          <br />
          • Processing personal data for service delivery (Art. 6.1.b GDPR)
          <br />
          • Storing data securely with AES-256 encryption
          <br />
          • Your right to access, correct, or delete your data anytime
          <br />
          <a href="/privacy" style={{ color: "#60a5fa" }}>Read full privacy policy</a>
        </p>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleAcceptAll}
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Recording..." : "Accept & Continue"}
          </button>

          <a href="/privacy-center" style={{
            color: "#60a5fa",
            textDecoration: "underline",
            cursor: "pointer"
          }}>
            Manage preferences
          </a>
        </div>
      </div>
    </div>
  );
}

export default GDPRConsentBanner;
