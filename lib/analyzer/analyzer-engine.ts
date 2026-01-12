// lib/analyzer/analyzer-engine.ts

import { prisma } from "@/lib/prisma";

export interface AnalyzerInput {
  customerId: string;
  creditReportId: string;
  creditReport: {
    scoreAvg?: number | null;
    scoreEq?: number | null;
    scoreEx?: number | null;
    scoreTu?: number | null;
    disputableItemCount?: number;
  };
}

export interface AnalyzerResult {
  suggestions: DisputeSuggestion[];
  analyzerItems: AnalyzerItemData[];
  summary: {
    totalIssues: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
  };
}

interface DisputeSuggestion {
  bureau: string;
  creditor: string;
  reason: string;
  analyzerSection: "A" | "B" | "C";
  priority: "high" | "medium" | "low";
}

interface AnalyzerItemData {
  bureau: string;
  creditor: string;
  issueType: string;
  priority: number;
  defaultRound: number;
}

/**
 * Core analyzer — Epic report only
 */
export async function runAnalyzer(
  input: AnalyzerInput
): Promise<AnalyzerResult> {
  const suggestions: DisputeSuggestion[] = [];
  const analyzerItems: AnalyzerItemData[] = [];

  if (input.creditReport.disputableItemCount && input.creditReport.disputableItemCount > 0) {
    suggestions.push({
      bureau: "ALL",
      creditor: "MULTIPLE",
      reason: `${input.creditReport.disputableItemCount} disputable items detected`,
      analyzerSection: "A",
      priority: "high",
    });
  }

  const summary = {
    totalIssues: suggestions.length,
    highPriorityCount: suggestions.filter(s => s.priority === "high").length,
    mediumPriorityCount: suggestions.filter(s => s.priority === "medium").length,
    lowPriorityCount: suggestions.filter(s => s.priority === "low").length,
  };

  return { suggestions, analyzerItems, summary };
}
