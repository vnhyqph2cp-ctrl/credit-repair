"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface ArcGaugeProps {
  value: number;
  max?: number;
  size?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  durationMs?: number;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  value,
  max = 100,
  size = 180,
  colorFrom = "#14b8a6",
  colorTo = "#9333ea",
  className = "",
  durationMs = 1200,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  // 🔒 Safety clamps
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = clampedValue / safeMax;

  // 🎞️ Animate count-up
  useEffect(() => {
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setDisplayValue(Math.round(progress * clampedValue));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampedValue, durationMs]);

  // 🧮 Arc math
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;
  const angle = Math.PI * percentage;

  const startX = cx - radius;
  const startY = cy;

  const endX = cx - radius * Math.cos(Math.PI - angle);
  const endY = cy - radius * Math.sin(Math.PI - angle);

  const largeArcFlag = percentage > 0.5 ? 1 : 0;

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

  return (
    <div
      className={clsx("arc-gauge relative", className)}
      style={{ width: size, height: size / 1.2 }}
      aria-label={`Gauge value ${displayValue} out of ${safeMax}`}
    >
      <svg
        width={size}
        height={size / 1.2}
        viewBox={`0 0 ${size} ${size / 1.2}`}
      >
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${
            cx + radius
          } ${cy}`}
          stroke="#1f2933"
          strokeWidth={18}
          fill="none"
        />

        <defs>
          <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>

          <filter id="arc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Active arc */}
        <path
          d={arcPath}
          stroke="url(#arc-gradient)"
          strokeWidth={18}
          fill="none"
          filter="url(#arc-glow)"
          strokeLinecap="round"
        />
      </svg>

      {/* Center value */}
      <div className="absolute inset-0 flex items-end justify-center pb-2">
        <span className="text-3xl font-bold neon-text">
          {displayValue}
        </span>
      </div>
    </div>
  );
};
