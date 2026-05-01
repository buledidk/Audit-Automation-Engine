import { useState } from "react";

export default function FindingForm({ CC, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    description: "",
    severity: "ELEVATED",
    isa: "",
    response: ""
  });

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const VALID_SEVERITIES = ["SIGNIFICANT", "ELEVATED", "NORMAL"];

  const handleSubmit = () => {
    const desc = form.description.trim().slice(0, 5000);
    if (!desc) return;
    const severity = VALID_SEVERITIES.includes(form.severity) ? form.severity : "ELEVATED";
    onSubmit({
      description: desc,
      severity,
      isa: form.isa.trim().slice(0, 100),
      response: form.response.trim().slice(0, 2000)
    });
    setForm({ description: "", severity: "ELEVATED", isa: "", response: "" });
  };

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    background: "rgba(255,255,255,0.06)", border: "1px solid " + CC.brd,
    color: CC.tx, fontSize: 12, outline: "none"
  };

  const lbl = {
    fontSize: 10, color: CC.acc, textTransform: "uppercase",
    letterSpacing: "0.12em", marginBottom: 6, display: "block", fontWeight: 600
  };

  return (
    <div style={{
      background: CC.card, border: "1px solid " + CC.brd,
      borderRadius: 12, padding: 20
    }}>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 16 }}>New Finding</div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => upd("description", e.target.value)}
          placeholder="Describe the finding or exception..."
          style={{ ...inp, minHeight: 60, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Severity</label>
          <select
            value={form.severity}
            onChange={(e) => upd("severity", e.target.value)}
            style={{ ...inp, cursor: "pointer" }}
          >
            <option value="SIGNIFICANT">Significant</option>
            <option value="ELEVATED">Elevated</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>
        <div>
          <label style={lbl}>ISA Reference</label>
          <input
            value={form.isa}
            onChange={(e) => upd("isa", e.target.value)}
            placeholder="e.g. ISA 540"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Audit Response</label>
          <input
            value={form.response}
            onChange={(e) => upd("response", e.target.value)}
            placeholder="Planned response..."
            style={inp}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{
          padding: "8px 16px", borderRadius: 8,
          background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd,
          color: CC.dim, cursor: "pointer", fontSize: 11
        }}>Cancel</button>
        <button onClick={handleSubmit} disabled={!form.description.trim()} style={{
          padding: "8px 16px", borderRadius: 8,
          background: CC.acc, border: "none",
          color: "#000", cursor: "pointer", fontSize: 11, fontWeight: 700,
          opacity: form.description.trim() ? 1 : 0.5
        }}>Add Finding</button>
      </div>
    </div>
  );
}
