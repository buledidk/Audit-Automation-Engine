import { useParams, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { setActiveEngagementId } from "../StorageEngine";
import { DARK_COLORS as C } from "../components/Shared/utils/constants";

export default function EngagementPage() {
  const { engId } = useParams();
  const parentContext = useOutletContext() || { CC: C };

  useEffect(() => {
    if (engId) setActiveEngagementId(engId);
  }, [engId]);

  return (
    <EngagementProvider engId={engId}>
      <Outlet context={parentContext} />
    </EngagementProvider>
  );
}
