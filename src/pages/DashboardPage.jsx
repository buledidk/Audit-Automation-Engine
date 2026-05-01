import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listEngagements,
  createEngagement,
  deleteEngagement,
  exportEngagement,
  importEngagement,
  setActiveEngagementId
} from "../StorageEngine";
import { generateDemoState, generateDemoFinancialServices, generateDemoCharity } from "../demoSeed";
import { createStorageEngine } from "../StorageEngine";
import { DARK_COLORS as C } from "../components/Shared/utils/constants";

export default function DashboardPage() {
  const { CC } = useOutletContext() || { CC: C };
  const navigate = useNavigate();
  const [engagements, setEngagements] = useState([]);

  const refresh = () => setEngagements(listEngagements());
  useEffect(() => { setTimeout(() => { refresh(); }, 0); }, []);

  const handleCreate = () => {
    const name = window.prompt("Engagement name:", "New Engagement");
    if (!name) return;
    const id = createEngagement(name);
    setActiveEngagementId(id);
    refresh();
    navigate(`/engagements/${id}`);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteEngagement(id);
    refresh();
  };

  const handleOpen = (id) => {
    setActiveEngagementId(id);
    navigate(`/engagements/${id}`);
  };

  const handleExport = (id) => {
    const data = exportEngagement(id);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (data?.cfg?.entityName || "Engagement").replace(/[^a-zA-Z0-9]/g, "_") + "_backup.json";
    a.click();
  };

  const handleImport = () => {
    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = ".json";
    fi.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const id = importEngagement(ev.target.result);
          setActiveEngagementId(id);
          refresh();
          navigate(`/engagements/${id}`);
        } catch (err) {
          console.error("Import failed:", err);
          alert("Import failed: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    fi.click();
  };

  const handleLoadDemo = (demoFn, label) => {
    const demo = (demoFn || generateDemoState)();
    const name = demo.cfg.entityName || label || "Demo Engagement";
    const id = createEngagement(name);
    setActiveEngagementId(id);
    const engine = createStorageEngine(id);
    engine.saveImmediate("cfg", demo.cfg);
    engine.saveImmediate("cellData", demo.cellData);
    engine.saveImmediate("signOffs", demo.signOffs);
    engine.saveImmediate("wpNotes", demo.wpNotes);
    engine.saveImmediate("customItems", demo.customItems);
    refresh();
    navigate(`/engagements/${id}`);
  };

  return (
    <div style={{ padding: "32px", maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: CC.tx, marginBottom: 4 }}>
          Audit<span style={{ color: CC.acc }}>Engine</span>
        </div>
        <div style={{ fontSize: 12, color: CC.dim }}>Select an engagement or create a new one</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={handleCreate} style={btnStyle(CC.acc)}>+ New Engagement</button>
        <button onClick={handleImport} style={btnStyle(CC.blu)}>Import JSON</button>
        <button onClick={() => handleLoadDemo(generateDemoState, "Demo — Construction")} style={btnStyle(CC.grn)}>Demo: Construction</button>
        <button onClick={() => handleLoadDemo(generateDemoFinancialServices, "Demo — FinServ")} style={btnStyle(CC.pur)}>Demo: Financial Services</button>
        <button onClick={() => handleLoadDemo(generateDemoCharity, "Demo — Charity")} style={btnStyle(CC.org)}>Demo: Charity</button>
      </div>

      {engagements.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: CC.dim }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No engagements yet</div>
          <div style={{ fontSize: 12 }}>Create a new engagement or load a demo to get started.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {engagements.map((eng) => (
            <div
              key={eng.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 18px",
                borderRadius: 10,
                background: CC.card,
                border: "1px solid " + CC.brd,
                cursor: "pointer"
              }}
              onClick={() => handleOpen(eng.id)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: CC.tx }}>{eng.name || "Unnamed"}</div>
                <div style={{ fontSize: 10, color: CC.dim, marginTop: 2 }}>
                  Created: {eng.created ? new Date(eng.created).toLocaleDateString() : "Unknown"}
                  {eng.id && <span style={{ marginLeft: 8, fontFamily: "monospace", fontSize: 9, color: CC.fnt }}>{eng.id.slice(0, 8)}</span>}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleExport(eng.id); }}
                style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid " + CC.brd, color: CC.dim, cursor: "pointer", fontSize: 10 }}
              >Export</button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(eng.id, eng.name); }}
                style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(239,83,80,0.08)", border: "1px solid rgba(239,83,80,0.25)", color: CC.red, cursor: "pointer", fontSize: 10 }}
              >Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({
  padding: "10px 18px",
  borderRadius: 8,
  background: color + "18",
  border: "1px solid " + color + "44",
  color,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600
});
