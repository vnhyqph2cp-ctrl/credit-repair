"use client";

type ProgressRingProps = {
  percent: number;
  size?: number;
};

export default function ProgressRing({
  percent,
  size = 64,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`Progress: ${clamped}%`}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(34,211,238)" /* neon aqua */
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-neon-aqua">
          {clamped}%
        </span>
      </div>
    </div>
  );
}
