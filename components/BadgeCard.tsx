// components/BadgeCard.tsx

import { BadgeStatus } from "@/lib/badgeStatus";

export function BadgeCard({
  icon,
  title,
  description,
  status,
  explanation,
}: {
  icon: string;
  title: string;
  description: string;
  status: BadgeStatus;
  explanation: string;
}) {
  const statusColor =
    status === "earned"
      ? "text-green-400"
      : status === "in_progress"
      ? "text-yellow-400"
      : "text-gray-400";

  return (
    <div className="surface card glow-soft col">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>

      <div className={`text-sm font-semibold ${statusColor}`}>
        Status: {status.replace("_", " ")}
      </div>

      <p className="text-sm text-muted">{explanation}</p>
    </div>
  );
}
