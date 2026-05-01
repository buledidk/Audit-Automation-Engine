import { useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import useEngagement from "../Shared/hooks/useEngagement";
import { DARK_COLORS as C, FRAMEWORKS, ENTITY_SIZES, WP_TYPE_COLORS } from "../Shared/utils/constants";

// Import WPS list from the monolith (read-only reference)
// We re-declare the WP categories here to avoid importing the full monolith
const WP_SECTIONS = [ // eslint-disable-line no-unused-vars
  { label: "Planning", type: "planning", color: WP_TYPE_COLORS.planning },
  { label: "Risk", type: "risk", color: WP_TYPE_COLORS.risk },
  { label: "Lead Schedules", type: "lead", color: WP_TYPE_COLORS.lead },
  { label: "Financial Stmts", type: "fs", color: WP_TYPE_COLORS.fs },
  { label: "Testing", type: "testing", color: WP_TYPE_COLORS.testing },
  { label: "Completion", type: "completion", color: WP_TYPE_COLORS.completion },
  { label: "Reporting", type: "reporting", color: WP_TYPE_COLORS.reporting },
];

export default function OverviewTab() {
  const { CC } = useOutletContext() || { CC: C };
  const navigate = useNavigate();
  const { cfg, signOffs, cellData, reviewNotes, changeLog, signOffLog } = useEngagement();

  const fw = cfg.framework ? FRAMEWORKS[cfg.framework] : null;
  const sz = cfg.entitySize ? ENTITY_SIZES[cfg.entitySize] : null;

  const stats = useMemo(() => {
    const prepared = Object.values(signOffs).filter(s => s?.preparedBy).length;
    const reviewed = Object.values(signOffs).filter(s => s?.reviewedBy).length;
    const approved = Object.values(signOffs).filter(s => s?.approvedBy).length;
    const totalCells = Object.keys(cellData).length;
    const totalNotes = Object.values(reviewNotes).flat().length;
    const openNotes = Object.values(reviewNotes).flat().filter(n => n.status !== "cleared").length;
    return { prepared, reviewed, approved, totalCells, totalNotes, openNotes };
  }, [signOffs, cellData, reviewNotes]);

  if (!cfg.configured) {
    return (
      <div style={{ padding: "32px", maxWidth: 1100 }}>
        <div style={{ textAlign: "center", padding: 60, color: CC.dim }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Engagement not configured</div>
          <div style={{ fontSize: 12, marginBottom: 24 }}>Set up your engagement details to get started.</div>
          <button
            onClick={() => navigate("settings")}
            style={{
              padding: "12px 24px", borderRadius: 8,
              background: CC.acc, border: "none", color: "#000",
              cursor: "pointer", fontSize: 13, fontWeight: 700
            }}
          >Configure Engagement</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: CC.tx }}>
          {cfg.entityName}
        </div>
        <div style={{ fontSize: 11, color: CC.dim, marginTop: 4, display: "flex", gap: 16 }}>
          <span>FYE: {cfg.fye}</span>
          <span>{fw?.l}</span>
          <span>{sz?.l}</span>
          <span>Materiality: {cfg.materiality ? "£" + cfg.materiality : "TBD"}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatsCard icon="✎" value={stats.prepared} label="Prepared" color={CC.org} CC={CC} />
        <StatsCard icon="✓" value={stats.reviewed} label="Reviewed" color={CC.grn} CC={CC} />
        <StatsCard icon="★" value={stats.approved} label="Approved" color={CC.acc} CC={CC} />
        <StatsCard icon="📝" value={stats.openNotes} label="Open Notes" color={stats.openNotes > 0 ? CC.red : CC.grn} CC={CC} />
      </div>

      {/* Data Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div style={{ background: CC.card, border: "1px solid " + CC.brd, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Engagement Details
          </div>
          {[
            ["Entity", cfg.entityName],
            ["Industry", cfg.industry],
            ["Framework", fw?.l],
            ["Size", sz?.l],
            ["FYE", cfg.fye],
            ["Partner", cfg.partner],
            ["Manager", cfg.manager],
            ["Firm", cfg.firmName],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid " + CC.brd + "44", fontSize: 11 }}>
              <span style={{ color: CC.dim }}>{k}</span>
              <span style={{ color: CC.tx, fontWeight: 500 }}>{v || "—"}</span>
            </div>
          ))}
        </div>

        <div style={{ background: CC.card, border: "1px solid " + CC.brd, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Quick Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionBtn label="Open Full Audit File" icon="📂" onClick={() => navigate("full")} CC={CC} />
            <ActionBtn label="View Procedures" icon="📋" onClick={() => navigate("procedures")} CC={CC} />
            <ActionBtn label="View Evidence" icon="📎" onClick={() => navigate("evidence")} CC={CC} />
            <ActionBtn label="View Findings" icon="⚠️" onClick={() => navigate("findings")} CC={CC} />
            <ActionBtn label="Edit Settings" icon="⚙️" onClick={() => navigate("settings")} CC={CC} />
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div style={{ background: CC.card, border: "1px solid " + CC.brd, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
          Activity Summary
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: CC.tx }}>{stats.totalCells}</div>
            <div style={{ fontSize: 9, color: CC.dim }}>Data Entries</div>
          </div>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: CC.tx }}>{changeLog.length}</div>
            <div style={{ fontSize: 9, color: CC.dim }}>Change Log Entries</div>
          </div>
          <div style={{ textAlign: "center", padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: CC.tx }}>{signOffLog.length}</div>
            <div style={{ fontSize: 9, color: CC.dim }}>Sign-off Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, icon, onClick, CC }) { // eslint-disable-line no-unused-vars
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid " + CC.brd,
        color: CC.tx, cursor: "pointer",
        fontSize: 12, fontWeight: 500,
        textAlign: "left", width: "100%"
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
