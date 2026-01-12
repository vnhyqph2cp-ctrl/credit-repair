import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { ArcGauge } from "@/components/ArcGauge";
import { NeonButton } from "@/components/NeonButton";

type AnalyzerCardProps = {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  link: string;
  disabled?: boolean;
};

export function AnalyzerCard({
  title,
  score,
  maxScore,
  description,
  link,
  disabled = false,
}: AnalyzerCardProps) {
  const safeMax = maxScore > 0 ? maxScore : 1;
  const rawPercentage = (score / safeMax) * 100;
  const percentage = Math.min(100, Math.max(0, rawPercentage));

  return (
    <GlassCard
      className={`p-6 transition-all ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-cyan-400"
      }`}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <h3 className="text-xl font-bold text-cyan-400">{title}</h3>

        <ArcGauge value={percentage} size={120} />

        <div>
          <p
            className="text-3xl font-bold neon-text"
            aria-label={`${score} out of ${maxScore}`}
          >
            {score}/{maxScore}
          </p>
          <p className="mt-2 text-sm text-gray-400">{description}</p>
        </div>

        {disabled ? (
          <NeonButton className="w-full" disabled>
            Locked
          </NeonButton>
        ) : (
          <Link href={link} className="w-full">
            <NeonButton className="w-full">View Details</NeonButton>
          </Link>
        )}
      </div>
    </GlassCard>
  );
}
