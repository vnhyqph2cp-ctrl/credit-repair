// lib/badgeExplanations.ts

import { BadgeKey } from "./badgeMap";

type UserState = {
  hasSnapshot: boolean;
  uploadedDocs: number;
  approvedDocs: number;
  analysisReady: boolean;
  actionPlanReady: boolean;
  disputeStarted: boolean;
};

export const badgeExplanations: Record<
  BadgeKey,
  (state: UserState) => string
> = {
  snapshot_complete: (s) =>
    s.hasSnapshot
      ? "Your credit snapshot is complete. This gives us the raw data needed to build accurate next steps."
      : "Complete your credit snapshot to unlock analysis and planning.",

  documents_uploaded: (s) =>
    s.uploadedDocs > 0
      ? `You’ve uploaded ${s.uploadedDocs} document(s). Upload all required documents to continue.`
      : "Upload required documents to move forward.",

  documents_verified: (s) =>
    s.approvedDocs > 0
      ? `Your documents are verified. This strengthens dispute credibility.`
      : "Documents must be reviewed and approved before disputes can proceed.",

  analysis_complete: (s) =>
    s.analysisReady
      ? "Your credit analysis is complete and ready to be used."
      : "We’re still reviewing your information. Analysis will unlock next steps.",

  action_plan_ready: (s) =>
    s.actionPlanReady
      ? "Your personalized action plan is ready."
      : "Your action plan will appear once analysis is complete.",

  dispute_started: (s) =>
    s.disputeStarted
      ? "Disputes are now in progress. We’ll guide you through each phase."
      : "Disputes begin after your action plan is reviewed.",
};
