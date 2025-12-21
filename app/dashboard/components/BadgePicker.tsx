"use client";

import { useEffect, useMemo, useState } from "react";
import type { Badge, BadgeId } from "./badges";
import { loadProfileState, saveProfileState } from "../profile/profile-state";

type Props = {
  badges: Badge[];
  ctx?: { hasSnapshot?: boolean; avg?: number };
};

export function BadgePicker({ badges }: Props) {
  const [primary, setPrimary] = useState<BadgeId | null>(null);
  const [secondary, setSecondary] = useState<BadgeId | null>(null);

  useEffect(() => {
    const state = loadProfileState();
    setPrimary(state.primaryBadgeId);
    setSecondary(state.secondaryBadgeId);
  }, []);

  const primaryBadge = useMemo(
    () => badges.find((b) => b.id === primary) ?? null,
    [badges, primary]
  );

  const secondaryBadge = useMemo(
    () => badges.find((b) => b.id === secondary) ?? null,
    [badges, secondary]
  );

  function setAsPrimary(id: BadgeId) {
    setPrimary(id);
    const state = loadProfileState();
    const next = { ...state, primaryBadgeId: id };
    saveProfileState(next);
  }

  function setAsSecondary(id: BadgeId) {
    setSecondary(id);
    const state = loadProfileState();
    const next = { ...state, secondaryBadgeId: id };
    saveProfileState(next);
  }

  function clearSecondary() {
    setSecondary(null);
    const state = loadProfileState();
    saveProfileState({ ...state, secondaryBadgeId: null });
  }

  return (
    <section className="rounded-3xl border border-slate-800/60 bg-black/25 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black">Badge Loadout</h2>
          <p className="mt-2 text-sm text-slate-400">
            Pick a Primary badge (shows on your profile) and an optional Secondary badge.
          </p>
        </div>

        <div className="flex gap-2">
          {primaryBadge ? (
            <img
              src={primaryBadge.img}
              alt={primaryBadge.name}
              className="h-12 w-12 rounded-xl border border-slate-700/70 bg-black/30"
            />
          ) : null}
          {secondaryBadge ? (
            <img
              src={secondaryBadge.img}
              alt={secondaryBadge.name}
              className="h-12 w-12 rounded-xl border border-slate-700/70 bg-black/30"
            />
          ) : (
            <button
              type="button"
              onClick={clearSecondary}
              className="h-12 w-12 rounded-xl border border-slate-800/70 bg-black/30 text-[10px] font-black text-slate-500 hover:text-slate-300 transition"
              title="Secondary empty"
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((b) => {
          const isPrimary = b.id === primary;
          const isSecondary = b.id === secondary;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 hover:border-cyan-400/30 hover:bg-black/35 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-200 truncate">{b.name}</div>
                  <div className="mt-1 flex gap-2">
                    {isPrimary ? (
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black text-cyan-200">
                        PRIMARY
                      </span>
                    ) : null}
                    {isSecondary ? (
                      <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-black text-fuchsia-200">
                        SECONDARY
                      </span>
                    ) : null}
                  </div>
                </div>

                <img
                  src={b.img}
                  alt={b.name}
                  className="h-12 w-12 rounded-xl border border-slate-700/70 bg-black/30"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAsPrimary(b.id)}
                  className="rounded-xl bg-cyan-500/15 border border-cyan-400/25 px-3 py-2 text-xs font-black text-cyan-200 hover:bg-cyan-500/25 hover:border-cyan-300/60 transition"
                >
                  Set Primary
                </button>

                <button
                  type="button"
                  onClick={() => setAsSecondary(b.id)}
                  className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 px-3 py-2 text-xs font-black text-fuchsia-200 hover:bg-fuchsia-500/15 hover:border-fuchsia-300/60 transition"
                >
                  Set Secondary
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
