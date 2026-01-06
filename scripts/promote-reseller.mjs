import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

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
 * Generate a unique referral code
 */
function generateReferralCode(email) {
  const prefix = email.split("@")[0].substring(0, 4).toUpperCase();
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}${random}`;
}

/**
 * Promote a user to reseller status
 */
async function promoteToReseller(email) {
  try {
    console.log(`→ Looking up user: ${email}`);
    
    // Find customer by email
    const { data: customer, error: findError } = await supabase
      .from("Customer")
      .select("id, email, role, referral_code")
      .eq("email", email)
      .single();

    if (findError || !customer) {
      console.error("❌ Customer not found:", findError?.message || "No customer with that email");
      process.exit(1);
    }

    // Check if already a reseller
    if (customer.role === "reseller") {
      console.log("⚠️  User is already a reseller");
      console.log("   Referral code:", customer.referral_code);
      return;
    }

    // Generate referral code if needed
    const referralCode = customer.referral_code || generateReferralCode(customer.email);

    console.log(`→ Promoting to reseller with code: ${referralCode}`);

    // Update customer
    const { error: updateError } = await supabase
      .from("Customer")
      .update({
        role: "reseller",
        referral_code: referralCode,
      })
      .eq("id", customer.id);

    if (updateError) {
      console.error("❌ Update failed:", updateError);
      process.exit(1);
    }

    console.log("✅ Successfully promoted to reseller");
    console.log(`   Email: ${email}`);
    console.log(`   Referral Code: ${referralCode}`);
    console.log(`   Referral URL: ${SUPABASE_URL.replace('//', '//').split('.supabase')[0].replace('https://', 'https://app.')}/register?ref=${referralCode}`);

  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/promote-reseller.mjs <email>");
  console.error("Example: node scripts/promote-reseller.mjs user@example.com");
  process.exit(1);
}

promoteToReseller(email);
