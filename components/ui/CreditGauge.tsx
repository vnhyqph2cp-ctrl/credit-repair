"use client";

import { motion } from "framer-motion";

interface CreditGaugeProps {
  value: number; // 300–850
  label?: string;
}

export function CreditGauge({ value, label }: CreditGaugeProps) {
  const percent = Math.min(Math.max((value - 300) / 550, 0), 1);
  const dash = 314; // circumference approximation

  return (
    <div className="relative w-48 h-28 flex flex-col items-center justify-end">
      <svg viewBox="0 0 200 120" className="absolute top-0">
        {/* Track */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
        />

        {/* Progress */}
        <motion.path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - percent)}
          initial={{ strokeDashoffset: dash }}
          animate={{ strokeDashoffset: dash * (1 - percent) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 10px rgba(0,255,200,0.8))" }}
        />

        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Number */}
      <div className="relative z-10 text-3xl font-bold glow-neon">
        {value}
      </div>

      {label && (
        <div className="text-xs opacity-70 mt-1">{label}</div>
      )}
    </div>
  );
}
