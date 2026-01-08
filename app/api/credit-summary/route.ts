// app/api/credit-summary/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customer = await requireAuth();

    // Get latest snapshot for detailed data
    const latestSnapshot = await prisma.snapshot.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
    });

    // Calculate progress based on score improvement
    const initialScore = 600; // Could store this as baselineScore in Customer
    const currentScore = customer.scoreAvg || 0;
    const targetScore = 750;
    const progressPercent = Math.min(
      100,
      Math.max(0, ((currentScore - initialScore) / (targetScore - initialScore)) * 100)
    );

    // Determine readiness status based on score
    let readinessStatus = "BUILDING";
    let scoreBand = "620–659";
    let readinessColor = "yellow";
    let readinessNote = "Improve to 660+ to unlock better funding offers.";

    if (currentScore >= 720) {
      readinessStatus = "READY";
      scoreBand = "720+";
      readinessColor = "green";
      readinessNote = "Excellent credit! You qualify for premium funding options.";
    } else if (currentScore >= 680) {
      readinessStatus = "STRONG";
      scoreBand = "680–719";
      readinessColor = "blue";
      readinessNote = "Good credit! You have access to most funding opportunities.";
    } else if (currentScore >= 660) {
      readinessStatus = "IMPROVING";
      scoreBand = "660–679";
      readinessColor = "teal";
      readinessNote = "Getting better! Continue monitoring and disputing.";
    }

    const data = {
      progressPercent: Math.round(progressPercent),
      bureaus: [
        { 
          name: "Experian", 
          score: customer.scoreEx || 0, 
          change30d: 0 // TODO: Calculate from historical snapshots
        },
        { 
          name: "Equifax", 
          score: customer.scoreEq || 0, 
          change30d: 0 // TODO: Calculate from historical snapshots
        },
        { 
          name: "TransUnion", 
          score: customer.scoreTu || 0, 
          change30d: 0 // TODO: Calculate from historical snapshots
        },
      ],
      mfsnReadiness: {
        status: readinessStatus,
        scoreBand,
        color: readinessColor,
        note: readinessNote,
      },
      lastUpdate: latestSnapshot?.createdAt || customer.updatedAt,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Credit summary error:", error);
    
    // Return demo data on error instead of failing
    return NextResponse.json({
      progressPercent: 0,
      bureaus: [
        { name: "Experian", score: 0, change30d: 0 },
        { name: "Equifax", score: 0, change30d: 0 },
        { name: "TransUnion", score: 0, change30d: 0 },
      ],
      mfsnReadiness: {
        status: "BUILDING",
        scoreBand: "No data",
        color: "gray",
        note: "Complete your credit report to see insights.",
      },
    });
  }
}
