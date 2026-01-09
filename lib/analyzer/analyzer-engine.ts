// lib/analyzer/analyzer-engine.ts
/**
 * Credit Report Analyzer Engine
 * 
 * Analyzes credit reports and generates dispute suggestions
 * based on rules and AI analysis
 */

import { prisma } from "@/lib/prisma";
import { analyzeWithAI } from "@/lib/ai/openai";

export interface AnalyzerInput {
  customerId: string;
  snapshot: {
    scoreAvg?: number | null;
    scoreEq?: number | null;
    scoreEx?: number | null;
    scoreTu?: number | null;
    negativesCount?: number;
    utilizationPct?: number;
    inquiriesCount?: number;
  };
  creditData?: any; // Raw credit report data from MFSN
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
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  status?: string;
  issueType: string;
  aiAnalysis?: string;
  priority: number;
  defaultRound: number;
}

/**
 * Main analyzer function
 */
export async function runAnalyzer(input: AnalyzerInput): Promise<AnalyzerResult> {
  const suggestions: DisputeSuggestion[] = [];
  const analyzerItems: AnalyzerItemData[] = [];

  // Get active analyzer rules
  const rules = await prisma.analyzerRule.findMany({
    where: { enabled: true },
    orderBy: { defaultRound: "asc" },
  });

  // Analyze based on snapshot data
  if (input.snapshot.negativesCount && input.snapshot.negativesCount > 0) {
    // High priority - negative items
    suggestions.push({
      bureau: "All Bureaus",
      creditor: "Multiple",
      reason: `${input.snapshot.negativesCount} negative items detected - review for inaccuracies`,
      analyzerSection: "A",
      priority: "high",
    });
  }

  if (input.snapshot.utilizationPct && input.snapshot.utilizationPct > 30) {
    // Medium priority - utilization
    suggestions.push({
      bureau: "All Bureaus",
      creditor: "Credit Card Accounts",
      reason: `High credit utilization at ${Math.round(input.snapshot.utilizationPct)}% - verify balances`,
      analyzerSection: "B",
      priority: "medium",
    });
  }

  if (input.snapshot.inquiriesCount && input.snapshot.inquiriesCount > 3) {
    // Low priority - inquiries
    suggestions.push({
      bureau: "All Bureaus",
      creditor: "Multiple",
      reason: `${input.snapshot.inquiriesCount} recent inquiries - dispute unauthorized pulls`,
      analyzerSection: "C",
      priority: "low",
    });
  }

  // Note: Epic Report data processing happens separately
  // Snapshot data is for lead generation only
  // The main credit analysis uses disputable_items from normalized data

  // Calculate summary
  const summary = {
    totalIssues: suggestions.length,
    highPriorityCount: suggestions.filter(s => s.priority === "high").length,
    mediumPriorityCount: suggestions.filter(s => s.priority === "medium").length,
    lowPriorityCount: suggestions.filter(s => s.priority === "low").length,
  };

  return { suggestions, analyzerItems, summary };
}

/**
 * Determine analyzer section based on issue type
 */
function determineSection(issueType: string): "A" | "B" | "C" {
  const sectionA = ["late_payment", "collection", "charge_off", "bankruptcy"];
  const sectionB = ["balance_error", "account_status", "duplicate"];
  
  if (sectionA.some(type => issueType.toLowerCase().includes(type))) return "A";
  if (sectionB.some(type => issueType.toLowerCase().includes(type))) return "B";
  return "C";
}

/**
 * Determine priority level
 */
function determinePriority(priorityScore: number): "high" | "medium" | "low" {
  if (priorityScore >= 70) return "high";
  if (priorityScore >= 40) return "medium";
  return "low";
}

/**
 * Save analyzer results to database
 * Note: Uses Epic Report data, not snapshot (snapshot is for lead gen only)
 */
export async function saveAnalyzerResults(
  customerId: string,
  results: AnalyzerResult,
  snapshotScores?: {
    scoreAvg?: number | null;
    scoreEq?: number | null;
    scoreEx?: number | null;
    scoreTu?: number | null;
  }
): Promise<void> {
  // Save analyzer run with Epic Report scores
  const run = await prisma.analyzerRun.create({
    data: {
      memberId: customerId,
      runNumber: 1, // TODO: Increment based on existing runs
      scoreAvg: snapshotScores?.scoreAvg || null,
      scoreEq: snapshotScores?.scoreEq || null,
      scoreEx: snapshotScores?.scoreEx || null,
      scoreTu: snapshotScores?.scoreTu || null,
      negativesCount: results.suggestions.length,
      utilizationPct: null, // TODO: Calculate from Epic Report data
      inquiriesCount: null, // TODO: Calculate from Epic Report data
    },
  });

  // Save dispute suggestions
  for (const suggestion of results.suggestions) {
    await prisma.disputeSuggestion.create({
      data: {
        customerId,
        bureau: suggestion.bureau,
        creditor: suggestion.creditor,
        reason: suggestion.reason,
        analyzerSection: suggestion.analyzerSection,
      },
    });
  }

  // Save analyzer items for enforcement tracking
  for (const item of results.analyzerItems) {
    await prisma.analyzerItem.create({
      data: {
        memberId: customerId,
        bureau: item.bureau,
        creditor: item.creditor,
        accountNumber: item.accountNumber || '',
        itemType: item.accountType || 'tradeline',
        disputeReason: item.issueType || 'inaccuracy',
        roundNumber: item.defaultRound,
        roundStatus: 'IDENTITY_VERIFICATION',
        disputeFiledAt: new Date(),
        responseDeadline: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), // 31 days
        analyzerSection: 'A', // TODO: Determine from rule
        ruleKey: null,
      },
    });
  }
}
