"use client";

/**
 * Outcomes Table - Display and manage dispute outcomes
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DisputeOutcome, getOutcomeLabel, getOutcomeColor, DisputeOutcomeStatus } from "@/lib/dispute-outcomes";
import { updateOutcome } from "../actions";
import { format } from "date-fns";

interface OutcomesTableProps {
  outcomes: DisputeOutcome[];
}

export default function OutcomesTable({ outcomes }: OutcomesTableProps) {
  if (outcomes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Creditor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Bureau
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Reason
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Round
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Disputed
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Outcome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((outcome) => (
              <OutcomeRow key={outcome.id} outcome={outcome} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutcomeRow({ outcome }: { outcome: DisputeOutcome }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DisputeOutcomeStatus>(outcome.outcome as DisputeOutcomeStatus);
  const [notes, setNotes] = useState(outcome.notes || '');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    const result = await updateOutcome(outcome.id, selectedStatus, notes);
    
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert('Failed to update outcome');
    }
    setIsLoading(false);
  }

  const daysSinceDispute = Math.floor(
    (new Date().getTime() - new Date(outcome.disputedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="px-4 py-3 text-sm font-medium">{outcome.creditor}</td>
      <td className="px-4 py-3">
        <span className="inline-block rounded bg-white/10 px-2 py-1 text-xs font-semibold">
          {outcome.bureau}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">
        {outcome.disputeReason}
      </td>
      <td className="px-4 py-3 text-center text-sm">
        Round {outcome.roundNumber}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {format(new Date(outcome.disputedAt), 'MMM d, yyyy')}
        <div className="text-xs text-gray-500">{daysSinceDispute} days ago</div>
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as DisputeOutcomeStatus)}
            className="rounded border border-white/20 bg-white/5 px-2 py-1 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="removed">Removed ✓</option>
            <option value="verified">Verified (No Change)</option>
            <option value="updated">Updated</option>
            <option value="no_response">No Response (30+ days)</option>
          </select>
        ) : (
          <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getOutcomeColor(outcome.outcome)}`}>
            {getOutcomeLabel(outcome.outcome)}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded bg-green-600 px-3 py-1 text-xs font-semibold hover:bg-green-500 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedStatus(outcome.outcome as DisputeOutcomeStatus);
                setNotes(outcome.notes || '');
              }}
              disabled={isLoading}
              className="rounded bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/15"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold hover:bg-blue-500"
          >
            Update
          </button>
        )}
      </td>
    </tr>
  );
}
