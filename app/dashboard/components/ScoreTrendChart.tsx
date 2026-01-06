"use client";

/**
 * Score Trend Chart
 * 
 * Visualizes credit score progression over time.
 * Pure CSS implementation, no chart library dependencies.
 */

import { AnalyzerRunWithDelta } from "@/app/dashboard/analyzer/lib/analyzer-runs";
import { format } from "date-fns";

interface ScoreTrendChartProps {
  runs: AnalyzerRunWithDelta[];
  metric?: 'scoreAvg' | 'scoreEq' | 'scoreEx' | 'scoreTu';
}

export default function ScoreTrendChart({ 
  runs, 
  metric = 'scoreAvg' 
}: ScoreTrendChartProps) {
  if (runs.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-gray-400">
          No analyzer runs yet. Re-run the analyzer to start tracking trends.
        </p>
      </div>
    );
  }

  // Extract score data
  const dataPoints = runs.map(run => ({
    date: run.createdAt,
    score: run.snapshot[metric] ?? 0,
    runNumber: run.runNumber,
  })).filter(point => point.score > 0);

  if (dataPoints.length === 0) {
    return null;
  }

  // Calculate min/max for scaling
  const scores = dataPoints.map(p => p.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 100; // Avoid division by zero
  const padding = scoreRange * 0.1; // 10% padding

  const chartMin = Math.floor(minScore - padding);
  const chartMax = Math.ceil(maxScore + padding);
  const chartRange = chartMax - chartMin;

  // Calculate positions (0-100%)
  const points = dataPoints.map((point, index) => {
    const x = (index / Math.max(dataPoints.length - 1, 1)) * 100;
    const y = 100 - ((point.score - chartMin) / chartRange) * 100;
    return { ...point, x, y };
  });

  // Generate SVG path
  const pathData = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    })
    .join(' ');

  // Generate area path (for gradient fill)
  const areaPath = `${pathData} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  const metricLabels = {
    scoreAvg: 'Average Score',
    scoreEq: 'Equifax',
    scoreEx: 'Experian',
    scoreTu: 'TransUnion',
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{metricLabels[metric]} Trend</h3>
          <p className="text-sm text-gray-400">
            {dataPoints.length} check{dataPoints.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {dataPoints[dataPoints.length - 1].score}
            </span>
            {dataPoints.length > 1 && (
              <ScoreDelta
                current={dataPoints[dataPoints.length - 1].score}
                previous={dataPoints[dataPoints.length - 2].score}
              />
            )}
          </div>
          <p className="text-xs text-gray-500">
            Current score
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1="25"
            x2="100"
            y2="25"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.2"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.2"
          />
          <line
            x1="0"
            y1="75"
            x2="100"
            y2="75"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.2"
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(20, 184, 166)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path
            d={areaPath}
            fill="url(#scoreGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="rgb(20, 184, 166)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1"
              fill="rgb(20, 184, 166)"
              className="hover:r-2 transition-all"
            >
              <title>
                Run {point.runNumber}: {point.score} ({format(new Date(point.date), 'MMM d, yyyy')})
              </title>
            </circle>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
          <span>{chartMax}</span>
          <span>{Math.round((chartMax + chartMin) / 2)}</span>
          <span>{chartMin}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>{format(new Date(dataPoints[0].date), 'MMM d')}</span>
        {dataPoints.length > 2 && (
          <span>{format(new Date(dataPoints[Math.floor(dataPoints.length / 2)].date), 'MMM d')}</span>
        )}
        <span>{format(new Date(dataPoints[dataPoints.length - 1].date), 'MMM d, yyyy')}</span>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-500">
        Historical data only. Credit changes depend on many factors beyond disputes.
      </p>
    </div>
  );
}

function ScoreDelta({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous;
  
  if (delta === 0) {
    return (
      <span className="text-sm text-gray-400">
        No change
      </span>
    );
  }

  return (
    <span
      className={`text-sm font-semibold ${
        delta > 0 ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}
    </span>
  );
}
