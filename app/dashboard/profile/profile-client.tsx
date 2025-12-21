"use client";

import { useEffect, useMemo, useState } from "react";
import { BADGES, type BadgeId } from "../components/badges";
import { BadgePicker } from "../components/BadgePicker";
import {
  calcLevel,
  loadProfileState,
  saveProfileState,
  xpToNext,
  type ProfileLoadout,
} from "./profile-state";

function getBadge(id: BadgeId | null) {
  if (!id) return null;
  return BADGES.find((b) => b.id === id) ?? null;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ProfileClient() {
  // Placeholder identity until auth
  const displayName = "3B Member";
  const handle = "@3bmember";

  // Placeholder progress until MFSN pull exists in profile
  const [avg] = useState<number>(0);
  const [hasSnapshot] = useState<boolean>(false);

  const [state, setState] = useState<ProfileLoadout | null>(null);

  useEffect(() => {
    const s = loadProfileState();
    setState(s);
  }, []);

  const primaryBadge = useMemo(
    () => getBadge(state?.primaryBadgeId ?? null),
    [state?.primaryBadgeId]
  );

  const secondaryBadge = useMemo(
    () => getBadge(state?.secondaryBadgeId ?? null),
    [state?.secondaryBadgeId]
  );

  const glow = primaryBadge?.glow ?? ["#06b6d4", "#14b8a6", "#d946ef"];
  const level = state?.level ?? 1;
  const xp = state?.xp ?? 0;
  const nextAt = xpToNext(level);
  const pct = Math.min(100, Math.round((xp / nextAt) * 100));

  function awardXp(amount: number) {
    if (!state) return;
    const next = { ...state, xp: state.xp + amount };
    next.level = calcLevel(next.xp);
    saveProfileState(next);
    setState(next);
  }

  function checkIn() {
    if (!state) return;

    const now = new Date();
    const last = state.lastCheckinISO ? new Date(state.lastCheckinISO) : null;

    // If already checked in today, do nothing
    if (last && sameDay(now, last)) return;

    // If checked in yesterday -> streak continues
    let nextStreak = state.streakDays;
    if (last) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      if (sameDay(last, yesterday)) nextStreak = state.streakDays + 1;
      else nextStreak = 1;
    } else {
      nextStreak = 1;
    }

    const next = { ...state, streakDays: nextStreak, lastCheckinISO: now.toISOString() };
    // Award XP for check-in
    next.xp = next.xp + 25;
    next.level = calcLevel(next.xp);

    saveProfileState(next);
    setState(next);
  }

  if (!state) return null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black text-slate-100">
      {/* Dynamic banner glow pulled from badge */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl opacity-25"
          style={{ background: glow[0] }}
        />
        <div
          className="absolute -top-24 right-[-150px] h-[560px] w-[560px] rounded-full blur-3xl opacity-20"
          style={{ background: glow[2] }}
        />
        <div
          className="absolute bottom-[-260px] left-[-170px] h-[680px] w-[680px] rounded-full blur-3xl opacity-20"
          style={{ background: glow[1] }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      <header className="relative z-10 border-b border-slate-800/50 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
                3B
              </span>{" "}
              <span className="text-white">Profile</span>
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-400 truncate">
              Loadout • Level • Streak • Support
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="rounded-full border border-slate-700/70 bg-black/40 px-4 py-2 text-xs md:text-sm font-semibold hover:border-cyan-400/40 hover:bg-cyan-500/10 transition"
            >
              ← Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Profile card */}
        <section className="rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-900/70 to-black/80 p-6 md:p-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex gap-5 items-start">
              <div className="relative">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl border border-slate-700/70 bg-black/35 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.12)]">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                    3B
                  </span>
                </div>

                {primaryBadge ? (
                  <img
                    src={primaryBadge.img}
                    alt={primaryBadge.name}
                    className="absolute -bottom-3 -right-3 h-12 w-12 rounded-xl border border-slate-700/70 bg-black/30"
                  />
                ) : null}

                {secondaryBadge ? (
                  <img
                    src={secondaryBadge.img}
                    alt={secondaryBadge.name}
                    className="absolute -bottom-3 -left-3 h-10 w-10 rounded-xl border border-slate-700/70 bg-black/30 opacity-90"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="text-2xl md:text-3xl font-black text-white truncate">{displayName}</div>
                <div className="text-sm text-slate-400 truncate">{handle}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-200">
                    Level {level}
                  </span>
                  <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-black text-fuchsia-200">
                    Streak {state.streakDays}d
                  </span>
                  <span className="rounded-full border border-slate-700/70 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
                    Avg {avg || "--"}
                  </span>
                  <span className="rounded-full border border-slate-700/70 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
                    Snapshot {hasSnapshot ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* XP panel */}
            <div className="w-full md:w-[360px] rounded-2xl border border-slate-800/60 bg-black/25 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-black text-slate-200">XP Progress</div>
                <div className="text-xs font-bold text-slate-400 tabular-nums">
                  {xp}/{nextAt}
                </div>
              </div>

              <div className="mt-3 h-3 rounded-full bg-slate-800/70 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-fuchsia-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={checkIn}
                  className="rounded-xl bg-cyan-500/15 border border-cyan-400/25 px-3 py-2 text-xs font-black text-cyan-200 hover:bg-cyan-500/25 hover:border-cyan-300/60 transition"
                >
                  Daily Check-in (+25)
                </button>

                <button
                  type="button"
                  onClick={() => awardXp(10)}
                  className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 px-3 py-2 text-xs font-black text-fuchsia-200 hover:bg-fuchsia-500/15 hover:border-fuchsia-300/60 transition"
                >
                  Test XP (+10)
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Later: XP will award automatically when they connect snapshot, generate letters, complete rounds, etc.
              </p>
            </div>
          </div>
        </section>

        {/* Badge Loadout picker */}
        <BadgePicker badges={BADGES} ctx={{ hasSnapshot, avg }} />

        {/* Support Bot CTA */}
        <section className="rounded-3xl border border-slate-800/60 bg-black/25 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-black">Telegram Support Bot</div>
              <div className="mt-2 text-sm text-slate-400">
                Click to chat. Fast answers. Ticket creation. Status updates.
              </div>
            </div>
            <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-black text-fuchsia-200">
              Wiring Next
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-2 text-sm font-black text-fuchsia-200 hover:border-fuchsia-300/60 hover:bg-fuchsia-500/15 transition"
              onClick={() => alert("Next: link your real Telegram bot deep link here.")}
            >
              Open Telegram Bot →
            </button>

            <a
              href="/dashboard"
              className="rounded-full border border-slate-700/70 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10 hover:border-slate-500/80 transition"
            >
              Back to Dashboard →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
