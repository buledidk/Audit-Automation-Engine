import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listEngagements,
  createEngagement,
  deleteEngagement,
  exportEngagement,
  importEngagement,
  setActiveEngagementId,
  createStorageEngine
} from "../../StorageEngine";
import { generateDemoState, generateDemoFinancialServices, generateDemoCharity } from "../../demoSeed";
import { DARK_COLORS as C } from "../Shared/utils/constants";

export default function EngagementList({ CC = C }) {
  const navigate = useNavigate();
  const [engagements, setEngagements] = useState([]);

  const refresh = () => setEngagements(listEngagements());
  useEffect(() => { setTimeout(() => { refresh(); }, 0); }, []);

  const handleCreate = () => {
    const name = window.prompt("Engagement name:", "New Engagement");
    if (!name || !name.trim()) return;
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
      if (file.size > 50 * 1024 * 1024) {
        alert("File too large (max 50MB)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const id = importEngagement(ev.target.result);
          setActiveEngagementId(id);
          refresh();
          navigate(`/engagements/${id}`);
        } catch (err) {
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
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={handleCreate} style={btnStyle(CC.acc)}>+ New Engagement</button>
        <button onClick={handleImport} style={btnStyle(CC.blu)}>Import JSON</button>
        <button onClick={() => handleLoadDemo(generateDemoState, "Demo — Construction")} style={btnStyle(CC.grn)}>Demo: Construction</button>
        <button onClick={() => handleLoadDemo(generateDemoFinancialServices, "Demo — FinServ")} style={btnStyle(CC.pur)}>Demo: Financial</button>
        <button onClick={() => handleLoadDemo(generateDemoCharity, "Demo — Charity")} style={btnStyle(CC.org)}>Demo: Charity</button>
      </div>

      {engagements.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: CC.dim }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>No engagements yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {engagements.map((eng) => (
            <div
              key={eng.id}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 8,
                background: CC.card, border: "1px solid " + CC.brd,
                cursor: "pointer"
              }}
              onClick={() => handleOpen(eng.id)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: CC.tx }}>{eng.name || "Unnamed"}</div>
                <div style={{ fontSize: 9, color: CC.dim }}>
                  {eng.created ? new Date(eng.created).toLocaleDateString() : ""}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleExport(eng.id); }} style={smallBtn(CC)}>Export</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(eng.id, eng.name); }} style={{ ...smallBtn(CC), color: CC.red, borderColor: CC.red + "44" }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({
  padding: "8px 14px", borderRadius: 6,
  background: color + "15", border: "1px solid " + color + "44",
  color, cursor: "pointer", fontSize: 10, fontWeight: 600
});

const smallBtn = (CC) => ({
  padding: "4px 10px", borderRadius: 4,
  background: "rgba(255,255,255,0.04)", border: "1px solid " + CC.brd,
  color: CC.dim, cursor: "pointer", fontSize: 9
});
