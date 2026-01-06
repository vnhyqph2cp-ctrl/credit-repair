# Scripts Directory

Administrative and testing utilities for the 3B Credit Repair platform.

## Setup

All scripts require environment variables:

```powershell
# PowerShell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Or set in `.env.local` (scripts will auto-read `NEXT_PUBLIC_SUPABASE_URL`).

## Available Scripts

### 1. verify-snapshots.mjs

**Purpose:** Verify service-role access to Snapshot table (MFSN Epic Report)

**Usage:**

```powershell
$env:TEST_USER_ID="customer-uuid"
node scripts/verify-snapshots.mjs
```

**What it does:**

- Tests INSERT into Snapshot table
- Tests SELECT by customerId
- Confirms service-role permissions
- Validates RLS configuration

**Output:**

```text
✅ Inserted Epic Report id: <uuid>
✅ Retrieved 1 Epic Report(s).
   MFSN Epic Report = Single Source of Truth
```

---

### 2. promote-reseller.mjs

**Purpose:** Promote a customer to reseller status with referral code

**Usage:**

```powershell
node scripts/promote-reseller.mjs user@example.com
```

**What it does:**

- Looks up customer by email
- Sets `role = 'reseller'`
- Generates unique `referral_code`
- Displays referral URL for sharing

**Output:**

```text
✅ Successfully promoted to reseller
   Email: user@example.com
   Referral Code: USER8A9B2C
   Referral URL: https://app.yourdomain.com/register?ref=USER8A9B2C
```

**Referral Code Format:**

- First 4 chars of email (uppercase)
- 6 random hex characters (uppercase)
- Example: `JOHN3F82A1`

---

### 3. test-referral-flow.mjs

**Purpose:** Verify the complete referral system end-to-end

**Usage:**

```powershell
node scripts/test-referral-flow.mjs
```

**What it does:**

- Finds an existing reseller
- Generates referral URL
- Lists current clients
- Tests referral code validation
- Provides manual testing instructions

**Output:**

```text
✅ Found reseller: reseller@example.com
   Referral code: RESE8B4C2A

✅ Found 3 existing client(s)
   1. client1@example.com
   2. client2@example.com
   3. client3@example.com

Next steps to test end-to-end:
1. Visit: https://app.yourdomain.com/register?ref=RESE8B4C2A
2. Create a new account
3. Check that the new user appears in reseller's client list
```

---

### 4. promote-admin.mjs

**Purpose:** Promote a customer to admin status for platform oversight

**Usage:**

```powershell
node scripts/promote-admin.mjs admin@example.com
```

**What it does:**

- Looks up customer by email
- Sets `role = 'admin'`
- Grants access to admin dashboard

**Output:**

```text
✅ Successfully promoted to admin
   Email: admin@example.com
   Previous role: user
   Access: /dashboard/admin
```

**Admin Capabilities:**

- View all users and resellers
- Inspect Epic Reports across all customers
- Access analyzer rules and effectiveness tracking
- Override dispute profiles when needed
- Audit referral chains and commissions

---

### 5. test-enroll.js

**Purpose:** Test MFSN enrollment API integration

**Usage:**

```powershell
node scripts/test-enroll.js
```

**Note:** Legacy script - may need updates

---

## Common Workflows

### Setting Up Platform Admin

```powershell
# 1. Promote user to admin
node scripts/promote-admin.mjs admin@example.com

# 2. Admin can now access /dashboard/admin
# - View all users, resellers, reports
# - Manage analyzer rules
# - Track effectiveness metrics
```

### Setting Up a New Reseller

```powershell
# 1. Promote user to reseller
node scripts/promote-reseller.mjs partner@example.com

# 2. Test the referral flow
node scripts/test-referral-flow.mjs

# 3. Share the referral URL with the partner
```

### Debugging Snapshot/Report Issues

```powershell
# Set a test customer ID
$env:TEST_USER_ID="624ff84b-7b8f-47dd-89ef-a8fcc47f9c3d"

# Run verification
node scripts/verify-snapshots.mjs
```

### Verifying Database Permissions

```powershell
# All scripts use service-role key
# If any fail, check:
# 1. SUPABASE_SERVICE_ROLE_KEY is correct
# 2. RLS policies allow service-role
# 3. Tables exist in public schema
```

---

## Security Notes

⚠️ **Service Role Key**

- These scripts use the service-role key
- Never commit `.env.local` to git
- Never expose service-role key to client-side code
- Only use in server environments

⚠️ **Production Safety**

- Test in development first
- Verify customer emails before promoting to reseller
- Check referral codes are unique
- Monitor logs for errors

---

## Troubleshooting

### "No customers found"

- Run `promote-reseller.mjs` first
- Verify user exists in database
- Check email is exact match

### "Invalid referral code"

- Ensure reseller has `role = 'reseller'`
- Verify `referral_code` is not null
- Check code matches exactly (case-sensitive)

### "Permission denied"

- Verify service-role key is correct
- Check RLS policies allow service-role
- Ensure tables exist

### Import errors (Node.js)

- All scripts use ESM format (`.mjs`)
- Require Node 18+ for native ESM support
- Install dependencies: `npm install @supabase/supabase-js uuid`

---

## Adding New Scripts

Template for new admin scripts:

```javascript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function run() {
  try {
    // Your logic here
    console.log("✅ Success");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

run();
```

Save as `scripts/your-script.mjs` and run with `node scripts/your-script.mjs`.
