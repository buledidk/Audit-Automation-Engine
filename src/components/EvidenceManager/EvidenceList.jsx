import { useOutletContext } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function EvidenceList() {
  const { CC } = useOutletContext() || { CC: C };
  const { uploads, setUploads } = useEngagement();

  const allUploads = Object.entries(uploads)
    .flatMap(([wpId, files]) => (files || []).map(f => ({ ...f, wpId })))
    .sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));

  const handleDelete = (wpId, fileId) => {
    setUploads(p => ({
      ...p,
      [wpId]: (p[wpId] || []).filter(f => f.id !== fileId)
    }));
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: CC.tx }}>
          Evidence
        </div>
        <div style={{ fontSize: 11, color: CC.dim }}>
          {allUploads.length} file{allUploads.length !== 1 ? "s" : ""} uploaded across all working papers
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <EvidenceUpload wpId="general" CC={CC} />
      </div>

      {allUploads.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: CC.dim }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📎</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>No evidence uploaded yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {allUploads.map((file) => (
            <div key={file.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 8,
              background: CC.card, border: "1px solid " + CC.brd
            }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: CC.tx, fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: 9, color: CC.dim }}>
                  WP: {file.wpId?.toUpperCase()} | {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : ""}
                  {file.size && ` | ${(file.size / 1024).toFixed(1)} KB`}
                </div>
              </div>
              <span style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 4,
                background: file.status === "approved" ? CC.grn + "15" : CC.blu + "15",
                color: file.status === "approved" ? CC.grn : CC.blu,
                fontWeight: 600
              }}>
                {file.status || "uploaded"}
              </span>
              <button
                onClick={() => handleDelete(file.wpId, file.id)}
                style={{
                  padding: "4px 8px", borderRadius: 4,
                  background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.25)",
                  color: CC.red, cursor: "pointer", fontSize: 9
                }}
              >Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
