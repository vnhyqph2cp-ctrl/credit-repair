// app/dashboard/analyzer/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { runAnalyzer, saveAnalyzerResults } from "@/lib/analyzer/analyzer-engine";

export async function completeAnalyzer(customerId: string) {
  try {
    const customer = await requireAuth();

    if (customer.id !== customerId) {
      return { success: false, error: "Unauthorized" };
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

    // Run analyzer
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

    // Mark analyzer as completed
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        lastAction: "analyzer_completed",
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Analyzer completion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete analyzer",
    };
  }
}
