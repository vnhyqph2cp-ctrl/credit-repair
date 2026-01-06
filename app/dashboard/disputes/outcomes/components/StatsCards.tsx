"use client";

/**
 * Stats Cards - Outcome statistics overview
 */

import { OutcomeStats } from "@/lib/dispute-outcomes";

interface StatsCardsProps {
  stats: OutcomeStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        label="Total Disputes"
        value={stats.total}
        color="blue"
      />
      <StatCard
        label="Removed"
        value={stats.removed}
        color="green"
        subtitle="Success"
      />
      <StatCard
        label="Verified"
        value={stats.verified}
        color="red"
        subtitle="No change"
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        color="gray"
        subtitle="Awaiting response"
      />
      <StatCard
        label="Success Rate"
        value={`${stats.successRate.toFixed(0)}%`}
        color="teal"
        subtitle="Win rate"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'red' | 'gray' | 'teal';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    green: 'border-green-500/30 bg-green-500/10',
    red: 'border-red-500/30 bg-red-500/10',
    gray: 'border-gray-500/30 bg-gray-500/10',
    teal: 'border-teal-500/30 bg-teal-500/10',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
