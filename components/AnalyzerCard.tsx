import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import ArcGauge from "@/components/ArcGauge";
import NeonButton from "@/components/NeonButton";

type AnalyzerCardProps = {
  hasEpicReport: boolean;
  hasAnalyzer: boolean;
};

export default function AnalyzerCard({
  hasEpicReport,
  hasAnalyzer,
}: AnalyzerCardProps) {
  // Only show when report exists but analyzer not yet run
  if (!hasEpicReport || hasAnalyzer) return null;

  return (
    <GlassCard className="mb-6 glow-soft">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* LEFT: Analyzer Gauge */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ArcGauge value={45} label="Analyzer Ready" />
        </div>

        {/* RIGHT: Analyzer Description */}
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 6,
            }}
          >
            Analyzer
          </p>

          <h2 style={{ margin: "0 0 6px 0" }}>3B Credit Analyzer</h2>

          <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 10 }}>
            Reviews your full 3-bureau report, detects reporting errors and
            compliance violations, and converts them into enforceable disputes
            and a step-by-step action plan.
          </p>

          <ul
            style={{
              fontSize: 13,
              opacity: 0.85,
              marginBottom: 14,
              paddingLeft: 16,
            }}
          >
            <li>• Classifies each negative item</li>
            <li>• Flags FCRA & Metro 2 violations</li>
            <li>• Builds your enforcement roadmap</li>
          </ul>

          <Link href="/dashboard/analyzer">
            <NeonButton>Run Analyzer</NeonButton>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
