import { useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function EvidenceReview() {
  const { CC } = useOutletContext() || { CC: C };
  const { uploads, setUploads } = useEngagement();

  const pendingFiles = Object.entries(uploads)
    .flatMap(([wpId, files]) => (files || []).filter(f => f.status !== "approved").map(f => ({ ...f, wpId })))
    .sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));

  const approveFile = (wpId, fileId) => {
    setUploads(p => ({
      ...p,
      [wpId]: (p[wpId] || []).map(f =>
        f.id === fileId ? { ...f, status: "approved", approvedAt: new Date().toISOString() } : f
      )
    }));
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: CC.tx }}>
          Evidence Review
        </div>
        <div style={{ fontSize: 11, color: CC.dim }}>
          {pendingFiles.length} file{pendingFiles.length !== 1 ? "s" : ""} pending review
        </div>
      </div>

      {pendingFiles.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: CC.dim }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>All evidence reviewed</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pendingFiles.map((file) => (
            <div key={file.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 8,
              background: CC.card, border: "1px solid " + CC.brd
            }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: CC.tx, fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: 9, color: CC.dim }}>WP: {file.wpId?.toUpperCase()}</div>
              </div>
              <button
                onClick={() => approveFile(file.wpId, file.id)}
                style={{
                  padding: "6px 14px", borderRadius: 6,
                  background: CC.grn + "15", border: "1px solid " + CC.grn + "44",
                  color: CC.grn, cursor: "pointer", fontSize: 10, fontWeight: 600
                }}
              >Approve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
