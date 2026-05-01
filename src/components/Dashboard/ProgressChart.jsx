import { memo } from "react";

const ProgressChart = memo(function ProgressChart({ sections, signOffs, CC }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sections.map((sec) => {
        const done = sec.wps.filter(w => signOffs[w.id]?.preparedBy).length;
        const total = sec.wps.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const color = pct === 100 ? CC.grn : pct > 0 ? CC.org : CC.fnt;
        return (
          <div key={sec.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 120, fontSize: 9, color: sec.color || CC.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {sec.label}
            </div>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <div style={{ width: 50, fontSize: 10, color, fontWeight: 600, textAlign: "right" }}>
              {done}/{total}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ProgressChart;
