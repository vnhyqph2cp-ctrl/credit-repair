import { supabaseServer } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const stats = {
    analyzerRuns: 3,
    enforcementActions: 5,
    resolvedActions: 2,
    memberSince: "Dec 2025",
  };

  const badges = [
    {
      id: 1,
      title: "First Analyzer Run",
      description: "Completed your first credit analysis",
      icon: "🔍",
      earned: true,
    },
    {
      id: 2,
      title: "Enforcement Started",
      description: "Generated enforcement actions",
      icon: "⚡",
      earned: true,
    },
    {
      id: 3,
      title: "First Resolution",
      description: "Closed an enforcement action",
      icon: "✅",
      earned: true,
    },
    {
      id: 4,
      title: "30-Day Compliance Trigger",
      description: "Triggered a statutory response window",
      icon: "⏱️",
      earned: false,
    },
  ];

  return (
    <div className="max-w-6xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Your activity, progress, and account status.
        </p>
      </header>

      {/* ACTIVITY SUMMARY */}
      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Analyzer Runs" value={stats.analyzerRuns} />
        <Stat label="Enforcement Actions" value={stats.enforcementActions} />
        <Stat label="Resolved Actions" value={stats.resolvedActions} />
        <Stat label="Member Since" value={stats.memberSince} />
      </section>

      {/* ACHIEVEMENTS */}
      <GlassSection title="Achievements">
        <div className="grid gap-4 md:grid-cols-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 transition ${
                badge.earned
                  ? "border-neon-teal bg-black/30"
                  : "border-white/10 bg-black/20 opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{badge.icon}</span>
                <div>
                  <p
                    className={`font-semibold ${
                      badge.earned ? "text-neon-teal" : "text-muted-foreground"
                    }`}
                  >
                    {badge.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassSection>

      {/* ACCOUNT INFO */}
      <GlassSection title="Account Information">
        <p className="text-sm text-muted-foreground">
          Email: {session?.user?.email}
        </p>
        <p className="text-sm text-muted-foreground">
          Member Since: {stats.memberSince}
        </p>
      </GlassSection>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function GlassSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/30 p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
