import { memo } from "react";

const StatsCard = memo(function StatsCard({ icon, value, label, color, CC }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      background: color + "0D",
      border: "1px solid " + color + "33",
      textAlign: "center"
    }}>
      {icon && <div style={{ fontSize: 20 }}>{icon}</div>}
      <div style={{ fontSize: 24, fontWeight: 700, color: CC?.tx || "#F0F0F0", marginTop: icon ? 4 : 0 }}>{value}</div>
      <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
});

export default StatsCard;
