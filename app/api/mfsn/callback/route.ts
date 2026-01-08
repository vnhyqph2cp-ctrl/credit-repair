import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("state");        // passed from /start
    const reportId = searchParams.get("report_id"); // MFSN report id
    const status = searchParams.get("status");       // complete | failed

    if (!userId || !reportId || !status) {
      return NextResponse.json(
        { error: "Missing required callback params" },
        { status: 400 }
      );
    }

    // Normalize status
    const normalizedStatus =
      status === "complete" ? "complete" : "failed";

    const { error } = await supabaseAdmin
      .from("credit_reports")
      .upsert(
        {
          user_id: userId,
          report_id: reportId,
          status: normalizedStatus,
          pulled_at: new Date().toISOString(),
        },
        {
          onConflict: "report_id",
        }
      );

    if (error) {
      console.error("MFSN callback insert failed:", error);
      return NextResponse.json(
        { error: "Failed to upsert Epic Report" },
        { status: 500 }
      );
    }

    // Redirect user back to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    );
  } catch (err) {
    console.error("MFSN callback error:", err);
    return NextResponse.json(
      { error: "Unexpected callback error" },
      { status: 500 }
    );
  }
}
