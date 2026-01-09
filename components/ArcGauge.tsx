import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface ArcGaugeProps {
  value: number;
  max?: number;
  size?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  value,
  max = 100,
  size = 180,
  colorFrom = "#14b8a6",
  colorTo = "#9333ea",
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const arcRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [value]);

  // Arc math
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = Math.PI * (value / max);
  const x1 = cx - radius * Math.cos(startAngle);
  const y1 = cy - radius * Math.sin(startAngle);
  const x2 = cx - radius * Math.cos(startAngle - angle);
  const y2 = cy - radius * Math.sin(startAngle - angle);
  const largeArcFlag = value / max > 0.5 ? 1 : 0;
  const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

  return (
    <div className={clsx("arc-gauge", className)} style={{ width: size, height: size / 1.2 }}>
      <svg width={size} height={size / 1.2} viewBox={`0 0 ${size} ${size / 1.2}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy}`}
          stroke="#22292f"
          strokeWidth={18}
          fill="none"
        />
        {/* Neon arc */}
        <defs>
          <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={arcRef}
          d={arcPath}
          stroke="url(#arc-gradient)"
          strokeWidth={18}
          fill="none"
          filter="url(#glow)"
          strokeLinecap="round"
        />
      </svg>
      <div className="arc-gauge-value">
        <span>{displayValue}</span>
      </div>
    </div>
  );
};
