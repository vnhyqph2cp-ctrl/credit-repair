// lib/badgeMap.ts

export type BadgeKey =
  | "snapshot_complete"
  | "documents_uploaded"
  | "documents_verified"
  | "analysis_complete"
  | "action_plan_ready"
  | "dispute_started";

export const badgeMap: Record<
  BadgeKey,
  {
    name: string;
    description: string;
    icon: string; // emoji for v1 (swap to lucide later)
  }
> = {
  snapshot_complete: {
    name: "Snapshot Complete",
    description: "Credit snapshot successfully completed.",
    icon: "📸",
  },
  documents_uploaded: {
    name: "Documents Uploaded",
    description: "Required documents have been uploaded.",
    icon: "📄",
  },
  documents_verified: {
    name: "Documents Verified",
    description: "Documents approved and verified.",
    icon: "✅",
  },
  analysis_complete: {
    name: "Analysis Complete",
    description: "Your credit analysis is finished.",
    icon: "🧠",
  },
  action_plan_ready: {
    name: "Action Plan Ready",
    description: "Your personalized action plan is available.",
    icon: "🗺️",
  },
  dispute_started: {
    name: "Dispute Started",
    description: "Dispute process has begun.",
    icon: "⚖️",
  },
};
