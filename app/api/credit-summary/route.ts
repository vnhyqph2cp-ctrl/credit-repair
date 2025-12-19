// app/api/credit-summary/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: swap this demo data for real MFSC + MFSN responses
  const data = {
    progressPercent: 32,
    bureaus: [
      { name: "Experian", score: 682, change30d: 12 },
      { name: "Equifax", score: 682, change30d: 12 },
      { name: "TransUnion", score: 682, change30d: 12 },
    ],
    mfsnReadiness: {
      status: "BUILDING",
      scoreBand: "620–659",
      color: "yellow",
      note: "Improve to 660+ to unlock better funding offers.",
    },
  };

  return NextResponse.json(data);
}
