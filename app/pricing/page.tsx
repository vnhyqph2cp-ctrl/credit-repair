"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) =>
    setOpenFaq((prev) => (prev === id ? null : id));

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {/* Header */}
        <header className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neon-teal hover:underline"
          >
            ← Back to Home
          </Link>

          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Simple, transparent plans
          </p>

          <h1 className="text-3xl font-semibold">
            Choose your 3B plan
          </h1>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Connect your MyFreeScoreNow monitoring, unlock the 3B Analyzer, and
            choose how much help you want with disputes.
          </p>
        </header>

        {/* Pricing */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Plan
            title="3B Dashboard"
            price="$0/mo*"
            description="Bring your MyFreeScoreNow monitoring into 3B."
            features={[
              "Requires active MyFreeScoreNow monitoring",
              "3-bureau Snapshot inside 3B",
              "Score tracking & alerts",
            ]}
            disabled={[
              "3B Analyzer",
              "Dispute tools",
            ]}
            cta="Start free"
          />

          <Plan
            title="Analyzer & DIY"
            price="$49.99 / run"
            description="One deep-dive Analyzer session with a DIY action plan."
            features={[
              "Full 3B Analyzer",
              "Personalized strategy",
              "DIY dispute builder",
              "Smart pacing (3–5 items)",
            ]}
            cta="Unlock Analyzer"
          />

          <Plan
            highlight
            title="3B Co-Pilot"
            price="$89 / mo"
            description="We prepare disputes, you approve every move."
            features={[
              "Everything in Analyzer & DIY",
              "3–5 disputes per round",
              "Approval before sending",
              "Optional LetterStream add-on",
            ]}
            cta="Start with Co-Pilot"
          />

          <Plan
            title="Full Service"
            price="$149 / mo"
            description="End-to-end enforcement management."
            features={[
              "Everything in Co-Pilot",
              "We choose highest-impact items",
              "LetterStream included",
              "CFPB escalation if needed",
            ]}
            cta="Go Full Service"
          />
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Common questions
          </h2>

          <Faq
            id="cancel"
            title="Can I cancel anytime?"
            openFaq={openFaq}
            toggleFaq={toggleFaq}
          >
            Yes. You can cancel future months at any time. Completed work is
            non-refundable.
          </Faq>

          <Faq
            id="mfsn"
            title="Do I need MyFreeScoreNow?"
            openFaq={openFaq}
            toggleFaq={toggleFaq}
          >
            Yes. Live 3-bureau data from MyFreeScoreNow powers the Analyzer.
          </Faq>

          <Faq
            id="disputes"
            title="How many items do you dispute?"
            openFaq={openFaq}
            toggleFaq={toggleFaq}
          >
            We focus on 3–5 high-impact items per bureau per round.
          </Faq>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-white/10 bg-black/30 p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Ready to start your 90-day run?
          </h2>
          <p className="text-sm text-muted-foreground">
            Connect monitoring, unlock the Analyzer, and choose your support
            level.
          </p>
          <Link
            href="/register"
            className="inline-flex rounded-full bg-neon-teal px-6 py-3 font-semibold text-black hover:brightness-110"
          >
            Get started today
          </Link>
        </section>

      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

function Plan({
  title,
  price,
  description,
  features,
  disabled = [],
  cta,
  highlight,
}: any) {
  return (
    <div
      className={`rounded-xl border p-6 space-y-4 ${
        highlight
          ? "border-neon-teal bg-black/40"
          : "border-white/10 bg-black/30"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{price}</p>
      <p className="text-sm text-muted-foreground">{description}</p>

      <ul className="text-sm space-y-1">
        {features.map((f: string) => (
          <li key={f}>• {f}</li>
        ))}
        {disabled.map((d: string) => (
          <li key={d} className="opacity-40">
            • {d} (not included)
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className="inline-flex justify-center w-full rounded-lg bg-neon-teal px-4 py-2 font-semibold text-black"
      >
        {cta}
      </Link>
    </div>
  );
}

function Faq({
  id,
  title,
  children,
  openFaq,
  toggleFaq,
}: any) {
  const open = openFaq === id;

  return (
    <button
      onClick={() => toggleFaq(id)}
      className="w-full text-left rounded-xl border border-white/10 bg-black/30 p-4"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      {open && (
        <p className="text-sm text-muted-foreground">{children}</p>
      )}
    </button>
  );
}
