// lib/badgeStatus.ts

import { BadgeKey } from "./badgeMap";

export type BadgeStatus = "locked" | "in_progress" | "earned";

export function resolveBadgeStatus(
  badge: BadgeKey,
  state: {
    uploadedDocs: number;
    approvedDocs: number;
    analysisReady: boolean;
    actionPlanReady: boolean;
    disputeStarted: boolean;
  }
): BadgeStatus {
  switch (badge) {
    case "documents_uploaded":
      return state.uploadedDocs > 0 ? "in_progress" : "locked";

    case "documents_verified":
      return state.approvedDocs > 0 ? "earned" : "locked";

    case "analysis_complete":
      return state.analysisReady ? "earned" : "locked";

    case "action_plan_ready":
      return state.actionPlanReady ? "earned" : "locked";

    case "dispute_started":
      return state.disputeStarted ? "earned" : "locked";

    default:
      return "locked";
  }
}
