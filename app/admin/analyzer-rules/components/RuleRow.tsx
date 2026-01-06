"use client";

/**
 * Rule Row Component - Inline editing for analyzer rules
 */

import { useState } from "react";
import { AnalyzerRule } from "@/lib/analyzer-rules";
import { updateAnalyzerRule, toggleRule } from "../actions";

interface RuleRowProps {
  rule: AnalyzerRule;
  onUpdate: () => void;
}

export default function RuleRow({ rule, onUpdate }: RuleRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rule);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);
    const result = await updateAnalyzerRule(rule.id, {
      description: editedRule.description,
      analyzerSection: editedRule.analyzerSection,
      defaultRound: editedRule.defaultRound,
    });

    if (result.success) {
      setIsEditing(false);
      onUpdate();
    } else {
      alert('Failed to update rule');
    }
    setIsLoading(false);
  }

  async function handleToggle() {
    setIsLoading(true);
    const result = await toggleRule(rule.id);
    if (result.success) {
      onUpdate();
    } else {
      alert('Failed to toggle rule');
    }
    setIsLoading(false);
  }

  function handleCancel() {
    setEditedRule(rule);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <tr className="border-b border-white/10">
        <td className="px-4 py-3">
          <code className="text-xs text-gray-400">{rule.ruleKey}</code>
        </td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editedRule.description}
            onChange={(e) => setEditedRule({ ...editedRule, description: e.target.value })}
            className="w-full rounded border border-white/20 bg-white/5 px-2 py-1 text-sm"
          />
        </td>
        <td className="px-4 py-3">
          <select
            value={editedRule.analyzerSection}
            onChange={(e) => setEditedRule({ ...editedRule, analyzerSection: e.target.value as 'A' | 'B' | 'C' })}
            className="rounded border border-white/20 bg-white/5 px-2 py-1 text-sm"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <select
            value={editedRule.defaultRound}
            onChange={(e) => setEditedRule({ ...editedRule, defaultRound: parseInt(e.target.value) as 1 | 2 | 3 })}
            className="rounded border border-white/20 bg-white/5 px-2 py-1 text-sm"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-1 rounded text-xs ${rule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {rule.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded bg-green-600 px-3 py-1 text-xs font-semibold hover:bg-green-500 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/15"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="px-4 py-3">
        <code className="text-xs text-gray-400">{rule.ruleKey}</code>
      </td>
      <td className="px-4 py-3 text-sm">{rule.description}</td>
      <td className="px-4 py-3 text-center">
        <span className="inline-block rounded bg-white/10 px-2 py-1 text-xs font-semibold">
          {rule.analyzerSection}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-sm">{rule.defaultRound}</td>
      <td className="px-4 py-3">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold transition ${
            rule.enabled 
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
          }`}
        >
          {rule.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => setIsEditing(true)}
          className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold hover:bg-blue-500"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}
