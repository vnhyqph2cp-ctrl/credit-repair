"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Badge = {
  badge_id: string;
  badges: {
    name: string;
    description: string;
  };
};

export default function ProgressPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  async function loadBadges() {
    const { data, error } = await supabase
      .from("user_badges")
      .select("badge_id, badges(name, description)");

    if (!error && data) setBadges(data as unknown as Badge[]);
    setLoading(false);
  }

  if (loading) return <p>Loading progress…</p>;

  return (
    <main>
      <div className="container col">
        <h1>Your Progress</h1>
        <p>Earn badges by completing real steps — not busywork.</p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {badges.map((b) => (
            <div key={b.badge_id} className="surface card glow-soft col">
              <strong>{b.badges.name}</strong>
              <p>{b.badges.description}</p>
              <span className="badge">Earned</span>
            </div>
          ))}
        </section>

        {badges.length === 0 && (
          <p className="muted">
            No badges yet — upload documents to get started.
          </p>
        )}
      </div>
    </main>
  );
}
