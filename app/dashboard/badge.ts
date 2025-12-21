export type BadgeId =
  | "700-club"
  | "snapshot-connected"
  | "round-1-sent";

export type BadgeDef = {
  id: BadgeId;
  name: string;
  description: string;
  img: string;
  unlock: (ctx: { hasSnapshot: boolean; avg: number }) => boolean;
};

export const BADGES: BadgeDef[] = [
  {
    id: "snapshot-connected",
    name: "Snapshot Connected",
    description: "Your report data is linked.",
    img: "/brand/badge/snapshot-connected/snapshot-connected-1.png",
    unlock: ({ hasSnapshot }) => hasSnapshot,
  },
  {
    id: "round-1-sent",
    name: "Round 1 Sent",
    description: "First dispute round submitted.",
    img: "/brand/badge/round-1/round-1-1.png",
    unlock: () => false, // wire later when you track disputes
  },
  {
    id: "700-club",
    name: "700+ Club",
    description: "Average score hits 700+.",
    img: "/brand/badge/700-club/700-club-neon-3.png",
    unlock: ({ avg }) => avg >= 700,
  },
];
