import { useMemo } from "react";
import {
  listEngagements,
  createEngagement,
  deleteEngagement,
  exportEngagement,
  importEngagement,
  getActiveEngagementId,
  setActiveEngagementId,
  getTotalUsageBytes
} from "../../../StorageEngine";

export default function useStorage() {
  return useMemo(() => ({
    listEngagements,
    createEngagement,
    deleteEngagement,
    exportEngagement,
    importEngagement,
    getActiveEngagementId,
    setActiveEngagementId,
    getTotalUsageBytes
  }), []);
}
