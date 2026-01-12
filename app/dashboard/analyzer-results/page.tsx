"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnalyzerResults } from "@/lib/hooks/useAnalyzerResults";
import { Suspense } from "react";

function AnalyzerResultsContent() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string | undefined;

  if (!sessionId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-2">Invalid Analyzer Session</h1>
        <p className="text-muted-foreground mb-4">
          We couldn’t determine which analysis to load.
        </p>
        <button
          onClick={() => router.push("/dashboard/analyzer")}
          className="rounded-lg bg-neon-teal px-4 py-2 text-black font-semibold"
        >
          Run Analyzer Again
        </button>
      </div>
    );
  }

  const { data, loading } = useAnalyzerResults(sessionId);

  if (loading) {
    return <AnalyzerLoading />;
  }

  if (!data || !data.results_json) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-2">
          Analyzer Results Unavailable
        </h1>
        <p className="text-muted-foreground mb-4">
          We couldn’t load your analysis. Please try again.
        </p>
        <button
          onClick={() => router.push("/dashboard/analyzer")}
          className="rounded-lg bg-neon-teal px-4 py-2 text-black font-semibold"
        >
          Run Analyzer Again
        </button>
      </div>
    );
  }

  const {
    summary,
    violation_categories,
    plan,
    requirements,
    next_recommended_action_date,
  } = data.results_json;

  return (
    <div className="max-w-6xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold">Credit Report Analysis</h1>
        <p className="text-muted-foreground">
          Generated enforcement blueprint based on detected reporting violations.
        </p>
      </header>

      {/* SUMMARY */}
      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Accounts" value={summary.total_accounts} />
        <Stat
          label="Violations"
          value={summary.total_violations}
          danger
        />
        <Stat label="Score Impact" value={summary.estimated_score_impact} />
        <Stat
          label="Next Review"
          value={new Date(summary.next_review_date).toLocaleDateString()}
        />
      </section>

      {/* VIOLATIONS */}
      <GlassSection title="Violations">
        {violation_categories.length === 0 ? (
          <p className="text-muted-foreground">No violations found.</p>
        ) : (
          <div className="space-y-4">
            {violation_categories.map((cat: any, idx: number) => (
              <div key={idx} className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold">{cat.category}</p>
                <p className="text-sm text-muted-foreground">
                  {cat.count} issues detected
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassSection>

      {/* PLAN */}
      <GlassSection title="Action Plan">
        <p className="text-sm text-muted-foreground mb-2">
          Phase: <span className="font-semibold">{plan.phase}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Estimated duration: {plan.estimated_duration_days} days
        </p>

        {plan.milestones?.length > 0 && (
          <div className="space-y-2">
            {plan.milestones.map((m: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-neon-teal" />
                <span>{m.title}</span>
              </div>
            ))}
          </div>
        )}
      </GlassSection>

      {/* REQUIREMENTS */}
      <GlassSection title="Requirements">
        {requirements.documentation_needed?.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">Documentation Needed</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              {requirements.documentation_needed.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </>
        )}

        {requirements.actions_required?.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">Actions Required</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {requirements.actions_required.map((a: string, i: number) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </>
        )}
      </GlassSection>

      {/* NEXT ACTION */}
      <div className="rounded-xl border border-white/10 bg-black/30 p-6">
        <p className="text-sm text-muted-foreground">
          Next recommended action date
        </p>
        <p className="text-lg font-semibold">
          {new Date(next_recommended_action_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

/* ------------------ helpers ------------------ */

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
  danger,
}: {
  label: string;
  value: any;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-2xl font-semibold ${
          danger ? "text-red-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function AnalyzerLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-3">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-neon-teal" />
        <p className="text-lg font-semibold">Analyzing Credit Report</p>
        <p className="text-sm text-muted-foreground">
          Generating enforcement blueprint…
        </p>
      </div>
    </div>
  );
}

export default function AnalyzerResultsPage() {
  return (
    <Suspense fallback={<AnalyzerLoading />}>
      <AnalyzerResultsContent />
    </Suspense>
  );
}
