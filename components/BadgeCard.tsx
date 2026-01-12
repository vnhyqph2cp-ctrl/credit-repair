"use client";

import { BadgeStatus } from "@/lib/badgeStatus";
import clsx from "clsx";

type BadgeCardProps = {
  icon: string;
  title: string;
  description: string;
  status: BadgeStatus;
  explanation: string;
};

const STATUS_MAP: Record<
  BadgeStatus,
  { label: string; color: string; ring: string }
> = {
  earned: {
    label: "Earned",
    color: "text-emerald-400",
    ring: "ring-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.35)]",
  },
  in_progress: {
    label: "In progress",
    color: "text-yellow-400",
    ring: "ring-yellow-400/40 shadow-[0_0_25px_rgba(250,204,21,0.35)]",
  },
  locked: {
    label: "Locked",
    color: "text-gray-400",
    ring: "ring-white/10",
  },
};

export function BadgeCard({
  icon,
  title,
  description,
  status,
  explanation,
}: BadgeCardProps) {
  const meta = STATUS_MAP[status];

  return (
    <div
      className={clsx(
        "rounded-2xl bg-glass-dark/90 backdrop-blur-xl p-5",
        "ring-1 transition-all duration-200 hover:-translate-y-[1px]",
        meta.ring
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 ring-1 ring-white/10 text-xl">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>

      {/* Status */}
      <div className={clsx("text-xs font-semibold uppercase tracking-wide", meta.color)}>
        Status · {meta.label}
      </div>

      {/* Explanation */}
      <p className="mt-2 text-sm text-gray-400">{explanation}</p>
    </div>
  );
}
