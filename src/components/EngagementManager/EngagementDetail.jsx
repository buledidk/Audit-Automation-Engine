import useEngagement from "../Shared/hooks/useEngagement";
import { FRAMEWORKS, ENTITY_SIZES, ENGAGEMENT_TYPES } from "../Shared/utils/constants";

export default function EngagementDetail({ CC }) {
  const { cfg, signOffs } = useEngagement();
  const fw = cfg.framework ? FRAMEWORKS[cfg.framework] : null;
  const sz = cfg.entitySize ? ENTITY_SIZES[cfg.entitySize] : null;
  const et = ENGAGEMENT_TYPES.find(e => e.k === cfg.engagementType);

  const prepared = Object.values(signOffs).filter(s => s?.preparedBy).length;
  const reviewed = Object.values(signOffs).filter(s => s?.reviewedBy).length;

  return (
    <div style={{
      background: CC.card, border: "1px solid " + CC.brd,
      borderRadius: 12, padding: 20
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: CC.tx, marginBottom: 4 }}>
        {cfg.entityName || "Unconfigured Engagement"}
      </div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {fw && <span>{fw.l}</span>}
        {sz && <span>{sz.l}</span>}
        {et && <span>{et.l}</span>}
        {cfg.fye && <span>FYE: {cfg.fye}</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Stat label="Materiality" value={cfg.materiality ? "£" + cfg.materiality : "TBD"} CC={CC} />
        <Stat label="Prepared" value={prepared} CC={CC} />
        <Stat label="Reviewed" value={reviewed} CC={CC} />
      </div>
    </div>
  );
}

function Stat({ label, value, CC }) { // eslint-disable-line no-unused-vars
  return (
    <div style={{ textAlign: "center", padding: 8, borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: CC.tx }}>{value}</div>
      <div style={{ fontSize: 9, color: CC.dim }}>{label}</div>
    </div>
  );
}
