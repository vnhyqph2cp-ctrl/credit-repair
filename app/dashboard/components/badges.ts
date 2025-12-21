// app/dashboard/components/badges.ts

export type BadgeId =
  | "700-club-neon-1"
  | "700-club-neon-2"
  | "700-club-neon-3"
  | "700-club-neon-4";

export type Badge = {
  id: BadgeId;
  name: string;
  img: string;          // /public path
  glow?: [string, string, string]; // cyan/teal/fuchsia style
};

export const BADGES: Badge[] = [
  {
    id: "700-club-neon-1",
    name: "700+ Club Neon 1",
    img: "/brand/badge/700-club/700-club-neon-1.png",
    glow: ["#06b6d4", "#14b8a6", "#d946ef"],
  },
  {
    id: "700-club-neon-2",
    name: "700+ Club Neon 2",
    img: "/brand/badge/700-club/700-club-neon-2.png",
    glow: ["#22d3ee", "#2dd4bf", "#e879f9"],
  },
  {
    id: "700-club-neon-3",
    name: "700+ Club Neon 3",
    img: "/brand/badge/700-club/700-club-neon-3.png",
    glow: ["#38bdf8", "#34d399", "#c084fc"],
  },
  {
    id: "700-club-neon-4",
    name: "700+ Club Neon 4",
    img: "/brand/badge/700-club/700-club-neon-4.png",
    glow: ["#06b6d4", "#5eead4", "#a855f7"],
  },
];
