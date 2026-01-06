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
 * Seed demo data for showcase account
 */
async function seedDemoAccount(email) {
  try {
    console.log(`\n🎯 Seeding demo data for: ${email}\n`);
    
    // Find customer
    const { data: customer, error: findError } = await supabase
      .from("Customer")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (findError || !customer) {
      console.error("❌ Customer not found:", findError?.message || "No customer with that email");
      console.log("💡 Please register the account first at /register");
      process.exit(1);
    }

    console.log(`✅ Found customer: ${customer.email}`);
    console.log(`   Role: ${customer.role || 'user'}`);

    // 1. Set role to admin + reseller
    console.log("\n→ Setting role to admin + reseller...");
    await supabase
      .from("Customer")
      .update({ 
        role: "admin",
        resellerStatus: "active",
        joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
      })
      .eq("id", customer.id);

    // 2. Create credit snapshots (showing progress)
    console.log("→ Creating credit history snapshots...");
    
    const snapshots = [
      // 6 months ago - Initial snapshot
      {
        customerId: customer.id,
        equifax: 542,
        experian: 538,
        transunion: 545,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // 4 months ago
      {
        customerId: customer.id,
        equifax: 578,
        experian: 571,
        transunion: 582,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // 2 months ago
      {
        customerId: customer.id,
        equifax: 612,
        experian: 605,
        transunion: 618,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // Current - Great improvement!
      {
        customerId: customer.id,
        equifax: 687,
        experian: 693,
        transunion: 681,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const snapshot of snapshots) {
      await supabase.from("CreditSnapshot").insert(snapshot);
    }

    // 3. Create dispute history
    console.log("→ Creating dispute history...");
    
    const disputes = [
      {
        customerId: customer.id,
        bureau: "Equifax",
        accountName: "Capital One - Late Payment",
        disputeReason: "Inaccurate reporting - payment was on time",
        status: "resolved",
        outcome: "deleted",
        filedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        bureau: "Experian",
        accountName: "Discover Card - Collection Account",
        disputeReason: "Account does not belong to me",
        status: "resolved",
        outcome: "deleted",
        filedAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        bureau: "TransUnion",
        accountName: "Medical Collection - $850",
        disputeReason: "Debt was paid - should be removed",
        status: "resolved",
        outcome: "deleted",
        filedAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        bureau: "Equifax",
        accountName: "Chase - Incorrect Credit Limit",
        disputeReason: "Credit limit reported incorrectly",
        status: "resolved",
        outcome: "corrected",
        filedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        bureau: "Experian",
        accountName: "Student Loan - Incorrect Balance",
        disputeReason: "Balance amount is inaccurate",
        status: "in_progress",
        filedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        bureau: "TransUnion",
        accountName: "Utility Company - Duplicate Entry",
        disputeReason: "Duplicate account showing twice",
        status: "pending",
        filedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const dispute of disputes) {
      await supabase.from("Dispute").insert(dispute);
    }

    // 4. Create reseller data (downline & commissions)
    console.log("→ Creating reseller downline...");
    
    // Create 3 demo downline members
    const downlineMembers = [
      {
        email: "demo.client1@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        referredBy: customer.id,
        role: "user",
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        email: "demo.client2@example.com",
        firstName: "Michael",
        lastName: "Chen",
        referredBy: customer.id,
        role: "user",
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        email: "demo.client3@example.com",
        firstName: "Jessica",
        lastName: "Martinez",
        referredBy: customer.id,
        role: "user",
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const downlineIds = [];
    for (const member of downlineMembers) {
      const { data, error } = await supabase
        .from("Customer")
        .upsert(member, { onConflict: "email" })
        .select()
        .single();
      
      if (data) downlineIds.push(data.id);
    }

    // 5. Create commission records
    console.log("→ Creating commission records...");
    
    const commissions = [
      {
        resellerId: customer.id,
        customerId: downlineIds[0],
        amount: 79.00,
        commissionRate: 0.30,
        paidAmount: 23.70,
        status: "paid",
        earnedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        resellerId: customer.id,
        customerId: downlineIds[1],
        amount: 149.00,
        commissionRate: 0.30,
        paidAmount: 44.70,
        status: "paid",
        earnedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        resellerId: customer.id,
        customerId: downlineIds[2],
        amount: 79.00,
        commissionRate: 0.30,
        paidAmount: 23.70,
        status: "pending",
        earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        resellerId: customer.id,
        customerId: downlineIds[0],
        amount: 79.00,
        commissionRate: 0.30,
        paidAmount: 23.70,
        status: "pending",
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const commission of commissions) {
      if (commission.customerId) {
        await supabase.from("Commission").insert(commission);
      }
    }

    // 6. Create achievement badges
    console.log("→ Unlocking achievement badges...");
    
    const badges = [
      {
        customerId: customer.id,
        badgeId: "first_dispute",
        unlockedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        badgeId: "score_increase_50",
        unlockedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        badgeId: "score_increase_100",
        unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        customerId: customer.id,
        badgeId: "dispute_master",
        unlockedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const badge of badges) {
      await supabase.from("CustomerBadge").insert(badge);
    }

    console.log("\n✅ Demo account seeded successfully!");
    console.log("\n📊 Account Summary:");
    console.log("   Credit Score: 542 → 687 (+145 points)");
    console.log("   Disputes Filed: 6");
    console.log("   Items Removed: 3");
    console.log("   Items Corrected: 1");
    console.log("   Downline Members: 3");
    console.log("   Total Commissions: $115.80");
    console.log("   Paid Out: $68.40");
    console.log("   Pending: $47.40");
    console.log("   Badges Unlocked: 4");
    console.log("\n🎯 Ready for showcase demos!");
    console.log(`   Login: ${email}`);
    console.log("   Access: /dashboard (all features unlocked)");

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
  }
}

// Get email from command line args
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/seed-demo-account.mjs <email>");
  console.error("Example: node scripts/seed-demo-account.mjs credit@bouncebackbrian.com");
  process.exit(1);
}

seedDemoAccount(email);
