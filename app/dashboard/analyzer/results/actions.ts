"use server";

/**
 * Analyzer Re-run Server Actions
 */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canRerunAnalyzer, saveAnalyzerRun } from "../lib/analyzer-runs";
import { runAnalyzer, saveAnalyzerResults } from "@/lib/analyzer/analyzer-engine";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * Re-run the analyzer and save a new snapshot
 */
export async function rerunAnalyzer(memberId: string) {
  try {
    const customer = await requireAuth();

    if (customer.id !== memberId) {
      return { success: false, error: "Unauthorized" };
    }

    // Check throttle
    const { allowed, nextAllowedDate } = await canRerunAnalyzer(memberId);

    if (!allowed && nextAllowedDate) {
      const daysUntil = Math.ceil(
        (nextAllowedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return {
        success: false,
        error: `You can re-run the analyzer in ${daysUntil} days (${nextAllowedDate.toLocaleDateString()})`,
      };
    }

    // Get latest snapshot data
    const latestSnapshot = await prisma.snapshot.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
    });

    // Extract data from the snapshot's extractedJson or use defaults
    const extractedData = latestSnapshot?.extractedJson as any;
    const disputableItems = extractedData?.disputable_items || [];
    const negativesCount = disputableItems.length;

    const snapshot = {
      scoreAvg: customer.scoreAvg,
      scoreEq: customer.scoreEq,
      scoreEx: customer.scoreEx,
      scoreTu: customer.scoreTu,
      negativesCount,
      utilizationPct: 0, // TODO: Calculate from credit data
      inquiriesCount: 0, // TODO: Calculate from credit data
    };

    // Run analyzer engine
    const results = await runAnalyzer({
      customerId: customer.id,
      snapshot,
    });

    // Save results
    // Save results with Epic Report scores
    await saveAnalyzerResults(customer.id, results, {
      scoreAvg: customer.scoreAvg,
      scoreEq: customer.scoreEq,
      scoreEx: customer.scoreEx,
      scoreTu: customer.scoreTu,
    });

    // Save the run record
    await saveAnalyzerRun(memberId, snapshot);

    return { success: true, results };
  } catch (error) {
    console.error("Analyzer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to run analyzer",
    };
  }
}
