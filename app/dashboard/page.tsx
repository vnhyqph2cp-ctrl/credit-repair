// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Bureau = { name: string; score: number; change30d: number };

type Readiness = {
  status: string;
  scoreBand: string;
  color: string;
  note: string;
};

const readinessDefaults: Readiness = {
  status: "BUILDING",
  scoreBand: "620–659",
  color: "yellow",
  note: "Improve to 660+ to unlock better funding offers.",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bureaus, setBureaus] = useState<Bureau[]>([
    { name: "Experian", score: 0, change30d: 0 },
    { name: "Equifax", score: 0, change30d: 0 },
    { name: "TransUnion", score: 0, change30d: 0 },
  ]);
  const [readiness, setReadiness] =
    useState<Readiness>(readinessDefaults);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/credit-summary");
        if (!res.ok) throw new Error("Failed to load credit summary");
        const data = await res.json();

        setProgress(data.progressPercent ?? 32);
        setBureaus(
          data.bureaus ?? [
            { name: "Experian", score: 682, change30d: 12 },
            { name: "Equifax", score: 682, change30d: 12 },
            { name: "TransUnion", score: 682, change30d: 12 },
          ]
        );
        setReadiness(data.mfsnReadiness ?? readinessDefaults);
      } catch (e) {
        console.error(e);
        // fallback demo data
        setProgress(32);
        setBureaus([
          { name: "Experian", score: 682, change30d: 12 },
          { name: "Equifax", score: 682, change30d: 12 },
          { name: "TransUnion", score: 682, change30d: 12 },
        ]);
        setReadiness(readinessDefaults);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const quickLinks = [
    { name: "Credit Monitoring", href: "/dashboard/credit-monitoring" },
    { name: "Disputes & AI Letters", href: "/dashboard/disputes" },
    { name: "Credit Builder Plan", href: "/dashboard/credit-builder" },
    { name: "Funding Path (MFSN)", href: "/dashboard/funding-path" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Your 3B Credit Builder Dashboard
          </h1>
          <p className="text-sm text-[--color-text-muted]">
            Track your 3‑bureau progress, monitoring, and funding
            readiness in one place.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-md border border-[--color-border] px-3 py-1 text-xs text-[--color-text-muted] hover:bg-[--color-secondary]"
        >
          Back to landing
        </Link>
      </header>

      {/* Score + progress row */}
      <section className="grid gap-4 md:grid-cols-4">
        {/* Progress card */}
        <div className="col-span-1 rounded-xl border border-[--color-border] bg-[--color-secondary] p-4 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          <h2 className="text-sm font-medium text-[--color-text-muted]">
            Rebuild progress
          </h2>
          <p className="mt-3 text-3xl font-bold text-[--color-primary]">
            {loading ? "…" : `${progress}%`}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-[--color-border] overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[--color-primary] to-[#34D399] transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[--color-text-muted]">
            On track toward your target score and funding goals.
          </p>
        </div>

        {/* Bureau cards */}
        {bureaus.map((bureau) => (
          <div
            key={bureau.name}
            className="rounded-xl border border-[--color-border] bg-[--color-secondary] p-4 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <h2 className="text-sm font-medium text-[--color-text-muted]">
              {bureau.name}
            </h2>
            <p className="mt-2 text-3xl font-bold text-[--color-primary]">
              {loading ? "…" : bureau.score}
            </p>
            <p className="mt-1 text-xs text-[--color-highlight]">
              {loading ? "" : `+${bureau.change30d} in last 30 days`}
            </p>
          </div>
        ))}
      </section>

      {/* Funding readiness card */}
      <section className="rounded-xl border border-[--color-border] bg-[--color-secondary] p-4">
        <h2 className="text-sm font-semibold text-white">
          MFSN Funding Readiness
        </h2>
        <p className="mt-2 text-sm text-[--color-text-muted]">
          Status:{" "}
          <span className="font-semibold text-[--color-primary]">
            {readiness.status}
          </span>{" "}
          ({readiness.scoreBand})
        </p>
        <p className="mt-1 text-xs text-[--color-text-muted]">
          {readiness.note}
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-[--color-border] overflow-hidden">
          <div
            className={`h-2 w-1/2 rounded-full ${
              readiness.color === "green"
                ? "bg-emerald-500"
                : readiness.color === "yellow"
                ? "bg-amber-400"
                : "bg-rose-500"
            }`}
          />
        </div>
      </section>

      {/* Today’s moves */}
      <section className="rounded-xl border border-[--color-border] bg-[--color-secondary] p-4">
        <h2 className="text-sm font-semibold text-white">
          Today’s 3 Moves
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-[--color-text-muted]">
          <li>• Confirm MyFreeScoreNow monitoring is connected</li>
          <li>• Review negative items flagged for dispute</li>
          <li>• Add a positive tradeline or builder account to your plan</li>
        </ul>
      </section>

      {/* Quick link tiles */}
      <section className="grid gap-6 md:grid-cols-4">
        {quickLinks.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="rounded-xl border border-[--color-border] bg-[--color-secondary] p-6 text-sm transition-shadow hover:shadow-[0_0_10px_rgba(254,194,124,0.3)]"
          >
            <div className="font-semibold text-white">{tile.name}</div>
            <div className="mt-1 text-xs text-[--color-text-muted]">
              Open section →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
