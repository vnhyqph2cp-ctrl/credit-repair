// app/dashboard/profile/profile-state.ts
import type { BadgeId } from "../components/badges";

export type ProfileLoadout = {
  primaryBadgeId: BadgeId | null;
  secondaryBadgeId: BadgeId | null;
  xp: number;        // simple XP
  level: number;     // derived
  streakDays: number;
  lastCheckinISO: string | null;
};

export const PROFILE_KEY = "bb_profile_state_v1";

export const defaultProfileState: ProfileLoadout = {
  primaryBadgeId: "700-club-neon-1",
  secondaryBadgeId: null,
  xp: 0,
  level: 1,
  streakDays: 0,
  lastCheckinISO: null,
};

export function calcLevel(xp: number) {
  // clean curve: level grows every 250xp
  return Math.max(1, Math.floor(xp / 250) + 1);
}

export function xpToNext(level: number) {
  // next level threshold
  return level * 250;
}

export function loadProfileState(): ProfileLoadout {
  if (typeof window === "undefined") return defaultProfileState;

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfileState;

    const parsed = JSON.parse(raw) as Partial<ProfileLoadout>;
    const merged: ProfileLoadout = { ...defaultProfileState, ...parsed };
    merged.level = calcLevel(merged.xp ?? 0);
    return merged;
  } catch {
    return defaultProfileState;
  }
}

export function saveProfileState(state: ProfileLoadout) {
  if (typeof window === "undefined") return;
  const next = { ...state, level: calcLevel(state.xp) };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
}
