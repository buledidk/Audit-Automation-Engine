import useEngagement from "../Shared/hooks/useEngagement";

export default function EngagementForm({ CC }) {
  const { cfg, setCfg } = useEngagement();

  return (
    <EngagementPlanning
      cfg={cfg}
      onConfigChange={setCfg}
      onComplete={(c) => setCfg({ ...c, configured: true })}
      colors={CC}
    />
  );
}
