"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import ProgressRing from "./ProgressRing";

type Badge = {
  key: string;
  title: string;
  description: string;
  status: "earned" | "locked";
};

export default function BadgeSection() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/badges`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const json = await res.json();
      setBadges(json.badges || []);
      setProgress(json.progress?.percent ?? 0);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="surface card glow-soft">
        <p>Loading progress…</p>
      </div>
    );
  }

  return (
    <section className="surface card col glow-soft">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Your Progress</h2>
        <ProgressRing percent={progress} />
      </div>

      <div className="row" style={{ flexWrap: "wrap", gap: 12 }}>
        {badges.map((badge) => (
          <div
            key={badge.key}
            className={`badge-tile ${
              badge.status === "earned" ? "earned" : "locked"
            }`}
          >
            <strong>{badge.title}</strong>
            <small>{badge.description}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
