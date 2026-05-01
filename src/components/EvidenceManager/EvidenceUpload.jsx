import { useState, useRef } from "react";
import useEngagement from "../Shared/hooks/useEngagement";

export default function EvidenceUpload({ wpId, CC, onUpload }) {
  const { _uploads, setUploads } = useEngagement();
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = (files) => {
    const newUploads = Array.from(files).map(f => ({
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString(),
      status: "uploaded"
    }));

    setUploads(p => ({
      ...p,
      [wpId]: [...(p[wpId] || []), ...newUploads]
    }));

    if (onUpload) onUpload(newUploads);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => fileRef.current?.click()}
      style={{
        padding: 20,
        borderRadius: 8,
        border: "2px dashed " + (dragOver ? CC.acc : CC.brd),
        background: dragOver ? CC.acc + "08" : "transparent",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
    >
      <input
        ref={fileRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div style={{ fontSize: 24, marginBottom: 8 }}>📎</div>
      <div style={{ fontSize: 11, color: CC.dim }}>Drop files here or click to upload</div>
      <div style={{ fontSize: 9, color: CC.fnt, marginTop: 4 }}>Evidence for {wpId?.toUpperCase() || "this WP"}</div>
    </div>
  );
}
