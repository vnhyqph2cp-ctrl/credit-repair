import { createClient } from "@supabase/supabase-js";

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

/**
 * Test the complete referral flow
 */
async function testReferralFlow() {
  try {
    console.log("🧪 Testing Referral Flow\n");

    // Step 1: Find a reseller
    console.log("→ Step 1: Looking for a reseller...");
    const { data: reseller, error: resellerError } = await supabase
      .from("Customer")
      .select("id, email, referral_code")
      .eq("role", "reseller")
      .not("referral_code", "is", null)
      .limit(1)
      .maybeSingle();

    if (resellerError || !reseller) {
      console.error("❌ No resellers found. Run promote-reseller.mjs first.");
      process.exit(1);
    }

    console.log(`✅ Found reseller: ${reseller.email}`);
    console.log(`   Referral code: ${reseller.referral_code}\n`);

    // Step 2: Simulate referral link
    const referralUrl = `${SUPABASE_URL.replace('.supabase.co', '').replace('https://', 'https://app.')}/register?ref=${reseller.referral_code}`;
    console.log(`→ Step 2: Referral link would be:`);
    console.log(`   ${referralUrl}\n`);

    // Step 3: Check existing clients
    console.log("→ Step 3: Checking existing clients for this reseller...");
    const { data: clients, error: clientsError } = await supabase
      .from("Customer")
      .select("id, email, reseller_id")
      .eq("reseller_id", reseller.id);

    if (clientsError) {
      console.error("❌ Error fetching clients:", clientsError);
    } else {
      console.log(`✅ Found ${clients?.length || 0} existing client(s)\n`);
      if (clients && clients.length > 0) {
        clients.forEach((client, i) => {
          console.log(`   ${i + 1}. ${client.email}`);
        });
        console.log();
      }
    }

    // Step 4: Verify referral code lookup works
    console.log("→ Step 4: Testing referral code validation...");
    const { data: lookupResult, error: lookupError } = await supabase
      .from("Customer")
      .select("id, role")
      .eq("referral_code", reseller.referral_code)
      .eq("role", "reseller")
      .maybeSingle();

    if (lookupError || !lookupResult) {
      console.error("❌ Referral code lookup failed");
      process.exit(1);
    }

    console.log(`✅ Referral code lookup successful\n`);

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("✅ REFERRAL FLOW TEST COMPLETE");
    console.log("═══════════════════════════════════════");
    console.log("\nNext steps to test end-to-end:");
    console.log(`1. Visit: ${referralUrl}`);
    console.log("2. Create a new account");
    console.log("3. Check that the new user appears in reseller's client list");
    console.log("\nOr test the API directly:");
    console.log(`curl -X POST ${SUPABASE_URL.replace('.supabase.co', '')}/api/auth/attach-referral \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"user_id":"<new_user_id>","ref":"${reseller.referral_code}"}'`);

  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

testReferralFlow();
