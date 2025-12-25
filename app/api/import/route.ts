// app/api/admin/import/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeMfsnEpicTo3BStandard } from "@/lib/mfsn-normalizer";

export async function POST(req: Request) {
  const form = await req.formData();
  const customer_id = String(form.get("customer_id") || "").trim();
  const raw_json_str = String(form.get("raw_json") || "").trim();

  if (!customer_id || !raw_json_str) {
    return NextResponse.json({ ok: false, error: "Missing customer_id or raw_json" }, { status: 400 });
  }

  let raw: any;
  try {
    raw = JSON.parse(raw_json_str);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const extracted = normalizeMfsnEpicTo3BStandard(raw);

  const score_tu = extracted?.scores?.TU ?? null;
  const score_eq = extracted?.scores?.EQF ?? null;
  const score_ex = extracted?.scores?.EXP ?? null;
  const disputable_item_count = Array.isArray(extracted?.disputable_items) ? extracted.disputable_items.length : 0;

  await prisma.creditReport.create({
    data: {
      customer_id,
      raw_mfsn_json: raw,
      extracted_json: extracted,
      score_tu,
      score_eq,
      score_ex,
      disputable_item_count,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL));
}
