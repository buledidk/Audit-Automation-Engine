import { useOutletContext } from "react-router-dom";
import useEngagement from "../components/Shared/hooks/useEngagement";
import { DARK_COLORS as C } from "../components/Shared/utils/constants";

export default function SettingsPage() {
  const { CC } = useOutletContext() || { CC: C };
  const { cfg, setCfg } = useEngagement();

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: CC.tx, marginBottom: 16 }}>
        Engagement Settings
      </div>
      <EngagementPlanning
        cfg={cfg}
        onConfigChange={setCfg}
        onComplete={(c) => setCfg({ ...c, configured: true })}
        colors={CC}
      />
    </div>
  );
}
