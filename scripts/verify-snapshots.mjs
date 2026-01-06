import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("Please set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable.");
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Please set SUPABASE_SERVICE_ROLE_KEY environment variable.");
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function run() {
  // Replace this with a real existing auth.users.id value for a test user
  const userId = process.env.TEST_USER_ID ?? "PUT_A_REAL_AUTH_USER_UUID_HERE";
  
  if (!userId || userId.startsWith("PUT_")) {
    console.error("Please set TEST_USER_ID env var to a valid Customer.id UUID before running.");
    process.exit(1);
  }

  try {
    console.log("→ Inserting MFSN Epic Report as service role");
    const now = new Date().toISOString();
    const { data: insertData, error: insertError } = await supabase
      .from("Snapshot")
      .insert({
        id: uuidv4(),
        customerId: userId,
        rawData: { reportId: "verify_report_001", bureau: "experian" },
        status: "ready",
        scoreTu: 650,
        scoreEq: 655,
        scoreEx: 660,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ INSERT failed:", insertError);
      process.exit(1);
    }

    console.log("✅ Inserted Epic Report id:", insertData.id);

    console.log("→ Selecting Epic Reports as service role");
    const { data: selectData, error: selectError } = await supabase
      .from("Snapshot")
      .select("*")
      .eq("customerId", userId);

    if (selectError) {
      console.error("❌ SELECT failed:", selectError);
      process.exit(1);
    }

    console.log(`✅ Retrieved ${selectData.length} Epic Report(s).`);
    
    // show a brief sample
    if (selectData.length > 0) {
      console.log("Sample Epic Report:", {
        id: selectData[0].id,
        customerId: selectData[0].customerId,
        status: selectData[0].status,
        scoreTu: selectData[0].scoreTu,
        scoreEq: selectData[0].scoreEq,
        scoreEx: selectData[0].scoreEx,
        createdAt: selectData[0].createdAt,
      });
    }

    console.log("\n✅ All checks passed for service-role writes and reads.");
    console.log("   MFSN Epic Report = Single Source of Truth");
    console.log("   Client-side writes remain disallowed by design.");
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

run();
