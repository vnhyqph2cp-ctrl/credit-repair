"use client";

/**
 * Rules Table Component
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalyzerRule } from "@/lib/analyzer-rules";
import RuleRow from "./RuleRow";

interface RulesTableProps {
  rules: AnalyzerRule[];
}

export default function RulesTable({ rules }: RulesTableProps) {
  const router = useRouter();
  const [filterSection, setFilterSection] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'enabled' | 'disabled'>('all');

  function handleUpdate() {
    router.refresh();
  }

  const filteredRules = rules.filter((rule) => {
    if (filterSection !== 'all' && rule.analyzerSection !== filterSection) {
      return false;
    }
    if (filterEnabled === 'enabled' && !rule.enabled) {
      return false;
    }
    if (filterEnabled === 'disabled' && rule.enabled) {
      return false;
    }
    return true;
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      {/* FILTERS */}
      <div className="border-b border-white/10 p-4">
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-gray-400">Section</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value as any)}
              className="ml-2 rounded border border-white/20 bg-white/5 px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="A">A - Accuracy</option>
              <option value="B">B - Structure</option>
              <option value="C">C - History</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400">Status</label>
            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e.target.value as any)}
              className="ml-2 rounded border border-white/20 bg-white/5 px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="enabled">Enabled Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-gray-400">
            Showing {filteredRules.length} of {rules.length} rules
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Rule Key
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Section
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400">
                Default Round
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No rules match the current filters
                </td>
              </tr>
            ) : (
              filteredRules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} onUpdate={handleUpdate} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
