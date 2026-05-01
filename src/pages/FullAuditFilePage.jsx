import { useParams } from "react-router-dom";

export default function FullAuditFilePage() {
  const { engId } = useParams();
  // Pass engId to monolith — it will load its own state from StorageEngine
  return <AuditEngine initialEngId={engId} />;
}
