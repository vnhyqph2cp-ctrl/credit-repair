// lib/badgeMap.ts

export type BadgeKey =
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
    description: "Your Epic Credit Report has been analyzed.",
    icon: "🧠",
  },
  action_plan_ready: {
    name: "Action Plan Ready",
    description: "Your personalized dispute and enforcement plan is ready.",
    icon: "🗺️",
  },
  dispute_started: {
    name: "Dispute Started",
    description: "The dispute and enforcement process has begun.",
    icon: "⚖️",
  },
};
