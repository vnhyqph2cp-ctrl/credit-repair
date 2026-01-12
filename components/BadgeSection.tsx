"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { BadgeCard } from "@/components/BadgeCard";
import ProgressRing from "@/components/ProgressRing";
import { BadgeStatus } from "@/lib/badgeStatus";

type BadgeApiItem = {
  key: string;
  title: string;
  description: string;
  status: BadgeStatus;
  explanation: string;
};

export default function BadgeSection() {
  const [badges, setBadges] = useState<BadgeApiItem[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBadges() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Not authenticated");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/badges`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load badge data");
        }

        const json = await res.json();

        if (!mounted) return;

        setBadges(json.badges ?? []);
        setProgress(json.progress?.percent ?? 0);
      } catch (err) {
        console.error("BadgeSection error:", err);
        if (mounted) {
          setError("Unable to load progress at this time.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBadges();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- loading ---------------- */

  if (loading) {
    return (
      <section className="rounded-3xl bg-glass-dark/90 shadow-glass backdrop-blur-xl ring-1 ring-white/10 p-6">
        <p className="text-sm text-gray-400">Loading progress…</p>
      </section>
    );
  }

  /* ---------------- error ---------------- */

  if (error) {
    return (
      <section className="rounded-3xl bg-glass-dark/90 shadow-glass backdrop-blur-xl ring-1 ring-white/10 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </section>
    );
  }

  /* ---------------- content ---------------- */

  return (
    <section className="rounded-3xl bg-glass-black/90 shadow-glass backdrop-blur-2xl ring-1 ring-white/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Progress & Achievements
          </h2>
          <p className="text-xs text-gray-400">
            Milestones unlocked through verified activity
          </p>
        </div>

        <ProgressRing percent={progress} />
      </div>

      {/* Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.key}
            icon="🏅"
            title={badge.title}
            description={badge.description}
            status={badge.status}
            explanation={badge.explanation}
          />
        ))}
      </div>
    </section>
  );
}
