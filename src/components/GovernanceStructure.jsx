import { useState, useCallback, useMemo } from "react";

const COLORS = {
  bg: "#0A0E17",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  accent: "#F5A623",
  text: "#F8F8F8",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  green: "#66BB6A",
  red: "#EF5350",
  orange: "#FFA726",
  blue: "#42A5F5",
  purple: "#CE93D8",
  planning: "#1E88E5",
  teal: "#26A69A",
};

// Default governance hierarchy template
const DEFAULT_GOVERNANCE = {
  shareholders: [],
  board: {
    chair: { name: "", independent: true },
    nonExecutive: [],
    executive: [],
    committees: [
      { name: "Audit Committee", chair: "", members: [], independent: true },
      { name: "Risk Committee", chair: "", members: [], independent: true },
      { name: "Remuneration Committee", chair: "", members: [], independent: true },
      { name: "Nomination Committee", chair: "", members: [], independent: false },
    ],
  },
  management: {
    ceo: { name: "", title: "Chief Executive Officer" },
    cfo: { name: "", title: "Chief Financial Officer" },
    coo: { name: "", title: "Chief Operating Officer" },
    other: [],
  },
  internalAudit: {
    exists: false,
    head: "",
    reportsTo: "Audit Committee",
    scope: "",
  },
  externalRegulators: [],
  notes: "",
};

// GDPR-safe: no PII leaves client state
// ISA 315.A77-A85: Understanding governance structure

// ─── Tree Node Component ───────────────────────────────────────────
function TreeNode({ label, role, color, children, level = 0, isLast = false, connectorColor }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = children && children.length > 0;
  const nodeColor = color || COLORS.blue;
  const lineColor = connectorColor || nodeColor;

  return (
    <div style={{ position: "relative", marginLeft: level > 0 ? "32px" : 0 }}>
      {/* Connector lines */}
      {level > 0 && (
        <>
          {/* Horizontal line */}
          <div style={{
            position: "absolute", left: "-20px", top: "20px",
            width: "20px", height: "1px",
            background: lineColor + "50",
          }} />
          {/* Vertical line */}
          {!isLast && (
            <div style={{
              position: "absolute", left: "-20px", top: "20px",
              width: "1px", height: "calc(100%)",
              background: lineColor + "30",
            }} />
          )}
        </>
      )}

      {/* Node box */}
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 14px", marginBottom: "6px",
          background: nodeColor + "15",
          border: `1px solid ${nodeColor}40`,
          borderRadius: "8px",
          cursor: hasChildren ? "pointer" : "default",
          transition: "all 0.2s",
          maxWidth: "100%",
        }}
      >
        {hasChildren && (
          <span style={{ color: nodeColor, fontSize: "10px", fontWeight: 700, width: "12px" }}>
            {expanded ? "▼" : "▶"}
          </span>
        )}
        <div>
          <div style={{ color: nodeColor, fontSize: "12px", fontWeight: 700 }}>
            {label || "(unnamed)"}
          </div>
          {role && (
            <div style={{ color: COLORS.dim, fontSize: "10px", marginTop: "2px" }}>
              {role}
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div style={{ position: "relative" }}>
          {children.map((child, i) => (
            <div key={i} style={{ position: "relative" }}>
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Editable field inline ─────────────────────────────────────────
function InlineEdit({ value, onChange, placeholder, width = "180px" }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: COLORS.bg, border: `1px solid ${COLORS.border}`,
        borderRadius: "4px", color: COLORS.text, fontSize: "12px",
        padding: "4px 8px", width, boxSizing: "border-box",
      }}
    />
  );
}

// ─── Main Component ────────────────────────────────────────────────
export default function GovernanceStructure({ engagement, updateEngagement }) {
  const [activeTab, setActiveTab] = useState("tree");
  const [governance, setGovernance] = useState(() => {
    return engagement?.governance || { ...DEFAULT_GOVERNANCE };
  });

  const updateGovernance = useCallback((path, value) => {
    setGovernance((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      // Persist to engagement state
      updateEngagement?.("governance", updated);
      return updated;
    });
  }, [updateEngagement]);

  const addMember = useCallback((path) => {
    setGovernance((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = updated;
      for (const key of keys) {
        current = current[key];
      }
      current.push({ name: "", title: "", independent: false });
      updateEngagement?.("governance", updated);
      return updated;
    });
  }, [updateEngagement]);

  const removeMember = useCallback((path, index) => {
    setGovernance((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = updated;
      for (const key of keys) {
        current = current[key];
      }
      current.splice(index, 1);
      updateEngagement?.("governance", updated);
      return updated;
    });
  }, [updateEngagement]);

  // Build tree data for visualization
  const treeData = useMemo(() => {
    const g = governance;
    return {
      shareholders: g.shareholders || [],
      board: g.board || {},
      management: g.management || {},
      internalAudit: g.internalAudit || {},
      externalRegulators: g.externalRegulators || [],
    };
  }, [governance]);

  const tabs = ["tree", "board", "management", "committees", "internal audit", "GDPR & controls"];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: COLORS.teal, marginBottom: "4px" }}>
          🏛️ Entity Governance Structure
        </h2>
        <p style={{ color: COLORS.dim, margin: 0 }}>
          ISA 315.A77-A85 — Understanding those charged with governance (TCWG), management oversight, and the control environment
        </p>
        <div style={{
          marginTop: "8px", padding: "8px 12px",
          background: COLORS.green + "12",
          border: `1px solid ${COLORS.green}30`,
          borderRadius: "6px",
        }}>
          <p style={{ color: COLORS.green, margin: 0, fontSize: "11px" }}>
            🔒 GDPR Compliant — All governance data is stored locally in browser state. No personal data is transmitted to external services.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "8px", marginBottom: "24px",
        borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "12px",
        flexWrap: "wrap",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              background: activeTab === tab ? COLORS.teal + "30" : "transparent",
              border: `1px solid ${activeTab === tab ? COLORS.teal + "60" : COLORS.border}`,
              color: activeTab === tab ? COLORS.teal : COLORS.dim,
              borderRadius: "6px", cursor: "pointer",
              fontSize: "12px", fontWeight: 600, textTransform: "uppercase",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── TREE VISUALIZATION ─────────────────────────────── */}
      {activeTab === "tree" && (
        <div style={{
          background: COLORS.card, borderRadius: "12px", padding: "24px",
          border: `1px solid ${COLORS.border}`, overflow: "auto",
        }}>
          <h3 style={{ color: COLORS.text, marginTop: 0, marginBottom: "4px" }}>
            Governance Hierarchy Tree
          </h3>
          <p style={{ color: COLORS.dim, fontSize: "11px", marginTop: 0, marginBottom: "20px" }}>
            Click nodes to expand/collapse. This tree maps reporting lines for ISA 315 risk assessment.
          </p>

          {/* SHAREHOLDERS → BOARD → MANAGEMENT tree */}
          <TreeNode
            label={engagement?.entityName || "Entity"}
            role="Audited Entity"
            color={COLORS.accent}
            level={0}
          >
            {/* Shareholders */}
            <TreeNode label="Shareholders / Owners" role="Ultimate oversight" color={COLORS.purple} level={1}>
              {(treeData.shareholders.length > 0 ? treeData.shareholders : [{ name: "(Add shareholders in Board tab)" }]).map((s, i) => (
                <TreeNode
                  key={i}
                  label={s.name || "(unnamed)"}
                  role={s.percentage ? `${s.percentage}% ownership` : "Shareholder"}
                  color={COLORS.purple}
                  level={2}
                  isLast={i === (treeData.shareholders.length || 1) - 1}
                  connectorColor={COLORS.purple}
                />
              ))}
            </TreeNode>

            {/* Board of Directors */}
            <TreeNode label="Board of Directors" role="Those Charged With Governance (TCWG)" color={COLORS.blue} level={1}>
              {/* Chair */}
              <TreeNode
                label={treeData.board.chair?.name || "(Chair not set)"}
                role="Board Chair"
                color={COLORS.blue}
                level={2}
                connectorColor={COLORS.blue}
              />

              {/* Non-Executive Directors */}
              {(treeData.board.nonExecutive || []).length > 0 && (
                <TreeNode label="Non-Executive Directors" role="Independent oversight" color={COLORS.teal} level={2} connectorColor={COLORS.blue}>
                  {treeData.board.nonExecutive.map((d, i) => (
                    <TreeNode
                      key={i}
                      label={d.name || "(unnamed)"}
                      role={d.independent ? "Independent NED" : "Non-Executive Director"}
                      color={COLORS.teal}
                      level={3}
                      isLast={i === treeData.board.nonExecutive.length - 1}
                      connectorColor={COLORS.teal}
                    />
                  ))}
                </TreeNode>
              )}

              {/* Committees */}
              <TreeNode label="Board Committees" role="Delegated authority" color={COLORS.orange} level={2} connectorColor={COLORS.blue}>
                {(treeData.board.committees || []).map((c, i) => (
                  <TreeNode
                    key={i}
                    label={c.name}
                    role={c.chair ? `Chair: ${c.chair}` : "Chair not assigned"}
                    color={c.name.includes("Audit") ? COLORS.green : COLORS.orange}
                    level={3}
                    isLast={i === (treeData.board.committees || []).length - 1}
                    connectorColor={COLORS.orange}
                  />
                ))}
              </TreeNode>
            </TreeNode>

            {/* Executive Management */}
            <TreeNode label="Executive Management" role="Day-to-day operations" color={COLORS.red} level={1}>
              <TreeNode
                label={treeData.management.ceo?.name || "(CEO not set)"}
                role="Chief Executive Officer"
                color={COLORS.red}
                level={2}
                connectorColor={COLORS.red}
              >
                <TreeNode
                  label={treeData.management.cfo?.name || "(CFO not set)"}
                  role="Chief Financial Officer"
                  color={COLORS.red}
                  level={3}
                  connectorColor={COLORS.red}
                />
                <TreeNode
                  label={treeData.management.coo?.name || "(COO not set)"}
                  role="Chief Operating Officer"
                  color={COLORS.red}
                  level={3}
                  connectorColor={COLORS.red}
                />
                {(treeData.management.other || []).map((m, i) => (
                  <TreeNode
                    key={i}
                    label={m.name || "(unnamed)"}
                    role={m.title || "Executive"}
                    color={COLORS.red}
                    level={3}
                    isLast={i === (treeData.management.other || []).length - 1}
                    connectorColor={COLORS.red}
                  />
                ))}
              </TreeNode>
            </TreeNode>

            {/* Internal Audit */}
            {treeData.internalAudit.exists && (
              <TreeNode
                label="Internal Audit Function"
                role={`Reports to: ${treeData.internalAudit.reportsTo || "Audit Committee"}`}
                color={COLORS.green}
                level={1}
                isLast
              >
                <TreeNode
                  label={treeData.internalAudit.head || "(Head not set)"}
                  role="Head of Internal Audit"
                  color={COLORS.green}
                  level={2}
                  isLast
                  connectorColor={COLORS.green}
                />
              </TreeNode>
            )}
          </TreeNode>

          {/* External Regulators */}
          {(treeData.externalRegulators || []).length > 0 && (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px dashed ${COLORS.border}` }}>
              <TreeNode label="External Regulators" role="Regulatory oversight" color={COLORS.faint} level={0}>
                {treeData.externalRegulators.map((r, i) => (
                  <TreeNode
                    key={i}
                    label={r.name || "(unnamed)"}
                    role={r.jurisdiction || "Regulator"}
                    color={COLORS.faint}
                    level={1}
                    isLast={i === treeData.externalRegulators.length - 1}
                    connectorColor={COLORS.faint}
                  />
                ))}
              </TreeNode>
            </div>
          )}
        </div>
      )}

      {/* ─── BOARD TAB ──────────────────────────────────────── */}
      {activeTab === "board" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Board of Directors & Shareholders</h3>

          {/* Shareholders */}
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ color: COLORS.purple, margin: "0 0 12px 0", fontSize: "13px" }}>
              Shareholders / Owners
            </h4>
            {(governance.shareholders || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <InlineEdit
                  value={s.name} placeholder="Shareholder name"
                  onChange={(v) => updateGovernance(`shareholders.${i}.name`, v)}
                />
                <InlineEdit
                  value={s.percentage} placeholder="% ownership" width="100px"
                  onChange={(v) => updateGovernance(`shareholders.${i}.percentage`, v)}
                />
                <button
                  onClick={() => removeMember("shareholders", i)}
                  style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(governance));
                updated.shareholders.push({ name: "", percentage: "" });
                setGovernance(updated);
                updateEngagement?.("governance", updated);
              }}
              style={{ background: COLORS.purple + "20", border: `1px solid ${COLORS.purple}40`, color: COLORS.purple, borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
            >+ Add Shareholder</button>
          </div>

          {/* Board Chair */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: COLORS.blue, margin: "0 0 12px 0", fontSize: "13px" }}>Board Chair</h4>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <InlineEdit
                value={governance.board.chair.name} placeholder="Chair name"
                onChange={(v) => updateGovernance("board.chair.name", v)}
              />
              <label style={{ color: COLORS.dim, fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={governance.board.chair.independent}
                  onChange={(e) => updateGovernance("board.chair.independent", e.target.checked)}
                />
                Independent
              </label>
            </div>
          </div>

          {/* Non-Executive Directors */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: COLORS.teal, margin: "0 0 12px 0", fontSize: "13px" }}>
              Non-Executive Directors
            </h4>
            {(governance.board.nonExecutive || []).map((d, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <InlineEdit
                  value={d.name} placeholder="Director name"
                  onChange={(v) => updateGovernance(`board.nonExecutive.${i}.name`, v)}
                />
                <label style={{ color: COLORS.dim, fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <input
                    type="checkbox"
                    checked={d.independent}
                    onChange={(e) => updateGovernance(`board.nonExecutive.${i}.independent`, e.target.checked)}
                  />
                  Independent
                </label>
                <button
                  onClick={() => removeMember("board.nonExecutive", i)}
                  style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => addMember("board.nonExecutive")}
              style={{ background: COLORS.teal + "20", border: `1px solid ${COLORS.teal}40`, color: COLORS.teal, borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
            >+ Add NED</button>
          </div>

          {/* Executive Directors */}
          <div>
            <h4 style={{ color: COLORS.red, margin: "0 0 12px 0", fontSize: "13px" }}>
              Executive Directors
            </h4>
            {(governance.board.executive || []).map((d, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <InlineEdit
                  value={d.name} placeholder="Director name"
                  onChange={(v) => updateGovernance(`board.executive.${i}.name`, v)}
                />
                <InlineEdit
                  value={d.title} placeholder="Title" width="140px"
                  onChange={(v) => updateGovernance(`board.executive.${i}.title`, v)}
                />
                <button
                  onClick={() => removeMember("board.executive", i)}
                  style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => addMember("board.executive")}
              style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
            >+ Add Executive Director</button>
          </div>
        </div>
      )}

      {/* ─── MANAGEMENT TAB ─────────────────────────────────── */}
      {activeTab === "management" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Executive Management Team</h3>
          <p style={{ color: COLORS.dim, fontSize: "12px", marginBottom: "20px" }}>
            ISA 315.14 — Key management personnel and their responsibilities
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                Chief Executive Officer (CEO)
              </label>
              <InlineEdit
                value={governance.management.ceo.name} placeholder="CEO name" width="100%"
                onChange={(v) => updateGovernance("management.ceo.name", v)}
              />
            </div>
            <div>
              <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                Chief Financial Officer (CFO)
              </label>
              <InlineEdit
                value={governance.management.cfo.name} placeholder="CFO name" width="100%"
                onChange={(v) => updateGovernance("management.cfo.name", v)}
              />
            </div>
            <div>
              <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                Chief Operating Officer (COO)
              </label>
              <InlineEdit
                value={governance.management.coo.name} placeholder="COO name" width="100%"
                onChange={(v) => updateGovernance("management.coo.name", v)}
              />
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h4 style={{ color: COLORS.orange, margin: "0 0 12px 0", fontSize: "13px" }}>
              Other Key Management
            </h4>
            {(governance.management.other || []).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <InlineEdit
                  value={m.name} placeholder="Name"
                  onChange={(v) => updateGovernance(`management.other.${i}.name`, v)}
                />
                <InlineEdit
                  value={m.title} placeholder="Title / Role" width="200px"
                  onChange={(v) => updateGovernance(`management.other.${i}.title`, v)}
                />
                <button
                  onClick={() => removeMember("management.other", i)}
                  style={{ background: COLORS.red + "20", border: `1px solid ${COLORS.red}40`, color: COLORS.red, borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "11px" }}
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => addMember("management.other")}
              style={{ background: COLORS.orange + "20", border: `1px solid ${COLORS.orange}40`, color: COLORS.orange, borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
            >+ Add Key Management</button>
          </div>
        </div>
      )}

      {/* ─── COMMITTEES TAB ─────────────────────────────────── */}
      {activeTab === "committees" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Board Committees</h3>
          <p style={{ color: COLORS.dim, fontSize: "12px", marginBottom: "20px" }}>
            ISA 260 — Communication with those charged with governance
          </p>

          <div style={{ display: "grid", gap: "16px" }}>
            {(governance.board.committees || []).map((c, i) => (
              <div key={i} style={{
                padding: "16px", background: COLORS.bg,
                borderRadius: "8px", border: `1px solid ${COLORS.border}`,
              }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{
                    color: c.name.includes("Audit") ? COLORS.green : COLORS.orange,
                    fontSize: "14px", fontWeight: 700,
                  }}>
                    {c.name}
                  </span>
                  <label style={{ color: COLORS.dim, fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
                    <input
                      type="checkbox"
                      checked={c.independent}
                      onChange={(e) => updateGovernance(`board.committees.${i}.independent`, e.target.checked)}
                    />
                    Majority Independent
                  </label>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <label style={{ color: COLORS.accent, fontSize: "10px", fontWeight: 700, minWidth: "40px" }}>CHAIR</label>
                  <InlineEdit
                    value={c.chair} placeholder="Committee chair"
                    onChange={(v) => updateGovernance(`board.committees.${i}.chair`, v)}
                    width="220px"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const updated = JSON.parse(JSON.stringify(governance));
              updated.board.committees.push({ name: "New Committee", chair: "", members: [], independent: false });
              setGovernance(updated);
              updateEngagement?.("governance", updated);
            }}
            style={{ marginTop: "12px", background: COLORS.orange + "20", border: `1px solid ${COLORS.orange}40`, color: COLORS.orange, borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
          >+ Add Committee</button>
        </div>
      )}

      {/* ─── INTERNAL AUDIT TAB ─────────────────────────────── */}
      {activeTab === "internal audit" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Internal Audit Function</h3>
          <p style={{ color: COLORS.dim, fontSize: "12px", marginBottom: "20px" }}>
            ISA 610 — Using the work of internal auditors
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: COLORS.dim, fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={governance.internalAudit.exists}
                onChange={(e) => updateGovernance("internalAudit.exists", e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontWeight: 600 }}>Entity has an internal audit function</span>
            </label>
          </div>

          {governance.internalAudit.exists && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Head of Internal Audit
                </label>
                <InlineEdit
                  value={governance.internalAudit.head} placeholder="Name" width="100%"
                  onChange={(v) => updateGovernance("internalAudit.head", v)}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Reports To
                </label>
                <select
                  value={governance.internalAudit.reportsTo}
                  onChange={(e) => updateGovernance("internalAudit.reportsTo", e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: "4px", color: COLORS.text, fontSize: "12px" }}
                >
                  <option value="Audit Committee">Audit Committee</option>
                  <option value="Board">Board of Directors</option>
                  <option value="CEO">CEO</option>
                  <option value="CFO">CFO</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Scope of Internal Audit Work
                </label>
                <textarea
                  value={governance.internalAudit.scope || ""}
                  onChange={(e) => updateGovernance("internalAudit.scope", e.target.value)}
                  placeholder="Areas covered by internal audit, planned audits, key findings..."
                  style={{
                    width: "100%", minHeight: "100px", padding: "10px",
                    background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                    borderRadius: "6px", color: COLORS.text, fontSize: "12px",
                    fontFamily: "monospace", resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          {!governance.internalAudit.exists && (
            <div style={{
              padding: "16px", background: COLORS.orange + "10",
              borderRadius: "8px", border: `1px solid ${COLORS.orange}30`,
            }}>
              <p style={{ color: COLORS.orange, margin: 0, fontSize: "12px" }}>
                ⚠️ No internal audit function — consider increased reliance on external substantive procedures (ISA 610.A4)
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── GDPR & CONTROLS TAB ───────────────────────────── */}
      {activeTab === "GDPR & controls" && (
        <div style={{ background: COLORS.card, borderRadius: "12px", padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, marginTop: 0 }}>Data Governance & GDPR Controls</h3>
          <p style={{ color: COLORS.dim, fontSize: "12px", marginBottom: "20px" }}>
            GDPR Article 5, 24, 25, 28, 32 — Data protection controls assessment
          </p>

          <div style={{ display: "grid", gap: "16px" }}>
            {/* Data protection assessment cards */}
            {[
              { title: "Data Protection Officer (DPO)", desc: "Art. 37-39 — Mandatory for public authorities and large-scale processing", field: "dpo" },
              { title: "Data Processing Agreements", desc: "Art. 28 — Agreements with all third-party processors", field: "dpa" },
              { title: "Privacy Impact Assessments", desc: "Art. 35 — DPIA for high-risk processing activities", field: "dpia" },
              { title: "Breach Notification Process", desc: "Art. 33-34 — 72-hour notification to ICO", field: "breach" },
              { title: "Data Retention Policy", desc: "Art. 5(1)(e) — Storage limitation principle", field: "retention" },
              { title: "Subject Access Request Process", desc: "Art. 15 — Right of access by the data subject", field: "sar" },
            ].map((item) => (
              <div key={item.field} style={{
                padding: "14px", background: COLORS.bg,
                borderRadius: "8px", border: `1px solid ${COLORS.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ color: COLORS.text, fontSize: "13px", fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: COLORS.dim, fontSize: "10px", marginTop: "2px" }}>{item.desc}</div>
                </div>
                <select
                  value={governance[item.field] || "not_assessed"}
                  onChange={(e) => updateGovernance(item.field, e.target.value)}
                  style={{
                    padding: "6px 10px", background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`, borderRadius: "4px",
                    color: COLORS.text, fontSize: "11px", minWidth: "130px",
                  }}
                >
                  <option value="not_assessed">Not Assessed</option>
                  <option value="compliant">Compliant</option>
                  <option value="partial">Partially Compliant</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="not_applicable">N/A</option>
                </select>
              </div>
            ))}
          </div>

          {/* Compliance summary */}
          <div style={{
            marginTop: "20px", padding: "14px",
            background: COLORS.green + "10",
            borderRadius: "8px", border: `1px solid ${COLORS.green}30`,
          }}>
            <h4 style={{ color: COLORS.green, margin: "0 0 8px 0", fontSize: "12px" }}>
              🔒 Security Assurance
            </h4>
            <ul style={{ color: COLORS.dim, margin: 0, paddingLeft: "16px", fontSize: "11px", lineHeight: "1.8" }}>
              <li>All governance data stored in browser localStorage only — no server transmission</li>
              <li>No PII processed through external AI services</li>
              <li>Credential and security tests passed before data handling</li>
              <li>GDPR Art. 5(1)(f) — integrity and confidentiality maintained</li>
              <li>Data minimisation applied — only audit-relevant fields collected</li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── NOTES ──────────────────────────────────────────── */}
      <div style={{ marginTop: "24px" }}>
        <label style={{ display: "block", color: COLORS.accent, fontSize: "10px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
          Governance Notes / Observations
        </label>
        <textarea
          value={governance.notes || ""}
          onChange={(e) => updateGovernance("notes", e.target.value)}
          placeholder="Document key governance observations, control environment assessment, tone at the top..."
          style={{
            width: "100%", minHeight: "80px", padding: "12px",
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: "8px", color: COLORS.text, fontSize: "12px",
            fontFamily: "monospace", resize: "vertical", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
