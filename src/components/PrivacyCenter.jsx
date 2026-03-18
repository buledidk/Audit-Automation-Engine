/**
 * GDPR PRIVACY CENTER COMPONENT
 * User data access, export, and deletion (Art. 15, 20, 17 GDPR)
 */

import { useState } from "react";

export function PrivacyCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Request data export (GDPR Art. 20 - Right to Data Portability)
  async function requestDataExport() {
    setLoading(true);
    setMessage(null);
    try {
      // In production, call API to generate and send export
      const response = await fetch("/api/user/data-export", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✅ Data export requested. You'll receive an email with your data in 7 days."
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  }

  // Request account deletion (GDPR Art. 17 - Right to Erasure)
  async function requestAccountDeletion() {
    if (!window.confirm("⚠️ Are you sure? This will delete all your data permanently.")) {
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/user/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✅ Account deletion requested. Your data will be removed within 30 days."
        });
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="privacy-center" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>🔐 Privacy Center</h1>
      <p>Manage your data in compliance with GDPR regulations</p>

      {message && (
        <div style={{
          padding: "10px 15px",
          marginBottom: "20px",
          borderRadius: "4px",
          background: message.type === "success" ? "#10b981" : "#ef4444",
          color: "white"
        }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "2px solid #e5e7eb", marginBottom: "20px" }}>
        {["overview", "export", "delete"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 15px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: activeTab === tab ? "bold" : "normal",
              borderBottom: activeTab === tab ? "3px solid #2563eb" : "none",
              color: activeTab === tab ? "#2563eb" : "#666"
            }}
          >
            {tab === "overview" && "📋 Overview"}
            {tab === "export" && "📥 Export Data"}
            {tab === "delete" && "🗑️ Delete Account"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <h2>Your Data Rights Under GDPR</h2>
          <div style={{ background: "#f9fafb", padding: "15px", borderRadius: "4px", marginBottom: "20px" }}>
            <h3>✅ Right to Access (Art. 15)</h3>
            <p>You can access all personal data we hold about you</p>

            <h3>✅ Right to Data Portability (Art. 20)</h3>
            <p>You can request your data in a machine-readable format (JSON, CSV)</p>

            <h3>✅ Right to Erasure (Art. 17)</h3>
            <p>You can request deletion of your account and data</p>

            <h3>✅ Right to Rectification (Art. 16)</h3>
            <p>You can correct inaccurate personal data in your account</p>

            <h3>✅ Right to Object (Art. 21)</h3>
            <p>You can object to processing for marketing purposes</p>
          </div>

          <h3>📊 Your Current Data Usage:</h3>
          <ul>
            <li>✓ Email for authentication and communication</li>
            <li>✓ Activity logs for audit trail compliance</li>
            <li>✓ Engagement data for service delivery</li>
            <li>✓ Audit trail data for legal compliance (7 years)</li>
          </ul>
        </div>
      )}

      {/* Export Data Tab */}
      {activeTab === "export" && (
        <div>
          <h2>📥 Export Your Data</h2>
          <p>Download all your personal data in a portable format (GDPR Art. 20)</p>

          <div style={{
            background: "#f0f9ff",
            padding: "20px",
            borderRadius: "4px",
            borderLeft: "4px solid #3b82f6",
            marginBottom: "20px"
          }}>
            <h3>What's included:</h3>
            <ul>
              <li>Personal profile information</li>
              <li>All engagement records you created/manage</li>
              <li>Your activity and audit logs</li>
              <li>Comments and annotations</li>
            </ul>

            <p>Format: <strong>JSON + CSV</strong></p>
            <p>Processing time: <strong>Up to 7 days</strong></p>
          </div>

          <button
            onClick={requestDataExport}
            disabled={loading}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "⏳ Processing..." : "📥 Request Data Export"}
          </button>

          <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
            📧 A download link will be sent to your registered email within 7 days
          </p>
        </div>
      )}

      {/* Delete Account Tab */}
      {activeTab === "delete" && (
        <div>
          <h2>🗑️ Delete Account & Data</h2>
          <p>Permanently delete your account and all associated data (GDPR Art. 17)</p>

          <div style={{
            background: "#fee2e2",
            padding: "20px",
            borderRadius: "4px",
            borderLeft: "4px solid #ef4444",
            marginBottom: "20px"
          }}>
            <h3>⚠️ Warning: This action is irreversible</h3>
            <ul>
              <li>❌ Your account will be permanently deleted</li>
              <li>❌ All personal data will be erased from our servers</li>
              <li>✓ Audit logs will be retained for legal compliance (7 years)</li>
              <li>✓ You will not be able to recover your account</li>
            </ul>

            <p>Deletion completes: <strong>30 days after request</strong></p>
          </div>

          <button
            onClick={requestAccountDeletion}
            disabled={loading}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "⏳ Processing..." : "🗑️ Request Account Deletion"}
          </button>

          <p style={{ marginTop: "15px", color: "#666", fontSize: "14px" }}>
            📧 A confirmation email will be sent. You have 30 days to cancel.
          </p>
        </div>
      )}
    </div>
  );
}

export default PrivacyCenter;
