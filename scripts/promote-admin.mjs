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
 * Promote a user to admin status
 */
async function promoteToAdmin(email) {
  try {
    console.log(`→ Looking up user: ${email}`);
    
    // Find customer by email
    const { data: customer, error: findError } = await supabase
      .from("Customer")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (findError || !customer) {
      console.error("❌ Customer not found:", findError?.message || "No customer with that email");
      process.exit(1);
    }

    // Check if already an admin
    if (customer.role === "admin") {
      console.log("⚠️  User is already an admin");
      return;
    }

    console.log(`→ Promoting to admin...`);

    // Update customer
    const { error: updateError } = await supabase
      .from("Customer")
      .update({ role: "admin" })
      .eq("id", customer.id);

    if (updateError) {
      console.error("❌ Update failed:", updateError);
      process.exit(1);
    }

    console.log("✅ Successfully promoted to admin");
    console.log(`   Email: ${email}`);
    console.log(`   Previous role: ${customer.role || 'user'}`);
    console.log(`   Access: /dashboard/admin`);

  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  console.error("Example: node scripts/promote-admin.mjs admin@example.com");
  process.exit(1);
}

promoteToAdmin(email);
