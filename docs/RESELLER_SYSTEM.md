# Reseller System Implementation

## Overview
The reseller system allows partners to refer clients and track their progress through a dedicated dashboard.

## Architecture

### Data Model
```prisma
model Customer {
  role          String?   @default("user")     // user | reseller | admin
  referralCode  String?   @unique              // Unique code for resellers
  resellerId    String?                        // Points to referring reseller
  reseller      Customer? @relation(...)       // Self-referential relation
  clients       Customer[] @relation(...)      // All referred clients
}
```

### Edge Function Extension
The existing `/functions/v1/badges` endpoint supports reseller scope:

**Request:**
```
GET /functions/v1/badges?scope=reseller
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "version": "1.1",
  "scope": "reseller",
  "summary": {
    "clients": 12,
    "avg_progress": 46,
    "earned_badges": 31
  },
  "clients": [
    {
      "user_id": "uuid",
      "email": "client@email.com",
      "progress": 62,
      "badges_earned": 4
    }
  ]
}
```

## UI Components

### Reseller Dashboard (`/dashboard/reseller`)
- Summary cards (total clients, avg progress, total badges)
- Referral link with copy button
- Client list with individual progress rings

### Reused Components
- `ProgressRing` - Circular progress indicator
- Badge system logic (server-side)

## Setup Instructions

### 1. Run Database Migration
```bash
# Apply the migration to add reseller fields
npx prisma migrate deploy
```

### 2. Promote a User to Reseller
```bash
# Set environment variables
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Promote user
node scripts/promote-reseller.mjs user@example.com
```

This will:
- Set `role = 'reseller'`
- Generate a unique `referral_code`
- Display the referral URL

### 3. Client Signup Flow
When a new user signs up with `?ref=CODE`:

**Frontend (`/register`):**
1. Reads `ref` parameter from URL
2. Displays confirmation UI (optional)
3. After successful signup, calls `/api/auth/attach-referral`

**Backend API (`/api/auth/attach-referral`):**
1. Validates referral code exists
2. Confirms referral code belongs to active reseller
3. Sets new customer's `reseller_id` to reseller's ID
4. Returns success (silent failure if invalid code)

**Data Flow:**
```
User clicks referral link
  ↓
/register?ref=ABC123
  ↓
User signs up (email/password or magic link)
  ↓
POST /api/auth/attach-referral
  - user_id: new_user_uuid
  - ref: ABC123
  ↓
Validate ref → Look up reseller
  ↓
UPDATE Customer SET reseller_id = reseller.id
  ↓
Referral attribution complete
  ↓
Reseller dashboard auto-updates
```

**Security:**
- ✅ Server-side validation only (service role)
- ✅ Silent failure if invalid code (doesn't block signup)
- ✅ Idempotent (safe to call multiple times)
- ✅ RLS policy prevents user tampering

## Edge Function Implementation

### Server-Side Logic (conceptual)
```typescript
// Inside /functions/v1/badges

if (scope === "reseller") {
  // 1. Verify user has reseller role
  assertRole(user, "reseller");

  // 2. Get all clients
  const clients = await supabase
    .from("Customer")
    .select("id, email")
    .eq("reseller_id", user.id);

  // 3. For each client, compute badges using existing logic
  const clientProgress = await Promise.all(
    clients.map(async (client) => {
      const badges = await resolveBadgeStatus(client.id);
      return {
        user_id: client.id,
        email: client.email,
        progress: calculateProgress(badges),
        badges_earned: badges.filter(b => b.status === "earned").length
      };
    })
  );

  // 4. Aggregate summary
  const summary = {
    clients: clients.length,
    avg_progress: Math.round(
      clientProgress.reduce((sum, c) => sum + c.progress, 0) / clients.length
    ),
    earned_badges: clientProgress.reduce((sum, c) => sum + c.badges_earned, 0)
  };

  return { scope: "reseller", summary, clients: clientProgress };
}
```

## Security

### RLS (Row Level Security)
```sql
-- Resellers can only see their own clients
CREATE POLICY "resellers_see_own_clients" ON "Customer"
  FOR SELECT
  USING (
    auth.uid() = id OR 
    (reseller_id = auth.uid() AND 
     EXISTS (SELECT 1 FROM "Customer" WHERE id = auth.uid() AND role = 'reseller'))
  );

-- Prevent users from changing reseller attribution
CREATE POLICY "prevent_reseller_change" ON "Customer"
  FOR UPDATE
  TO authenticated
  USING (reseller_id IS NULL)
  WITH CHECK (reseller_id IS NULL);
```

**What this prevents:**
- Users cannot switch resellers after initial assignment
- Users cannot see other customers' data
- Users cannot assign themselves to a reseller manually
- Only service role (backend) can modify `reseller_id`

### Edge Function Auth
- Validates JWT from Supabase auth
- Checks user role before returning reseller data
- Never exposes sensitive client data beyond email and progress

## Future Enhancements

1. **Commission tracking** - Track revenue per client
2. **Client notifications** - Alert resellers when clients hit milestones
3. **Referral analytics** - Track conversion rates, signup sources
4. **Tiered reseller levels** - Bronze, Silver, Gold based on client count
5. **Client messaging** - Allow resellers to send messages to clients

## Testing

### Manual Test Flow
1. Promote a user to reseller: `node scripts/promote-reseller.mjs test@example.com`
2. Copy referral URL from output
3. Create new account using referral URL
4. Login as reseller and verify client appears in dashboard
5. Check that progress updates as client completes actions

### Verification Queries
```sql
-- List all resellers
SELECT id, email, referral_code FROM "Customer" WHERE role = 'reseller';

-- List clients for a reseller
SELECT email FROM "Customer" WHERE reseller_id = '<reseller-id>';

-- Check referral chain
SELECT 
  c.email as client,
  r.email as reseller
FROM "Customer" c
LEFT JOIN "Customer" r ON c.reseller_id = r.id
WHERE c.reseller_id IS NOT NULL;
```

## Key Principles

✅ **Server decides scope** - UI is just a lens on server data  
✅ **Reuse badge logic** - No duplication between user/reseller views  
✅ **Security first** - RLS + JWT auth on all queries  
✅ **Simple data model** - Self-referential relation, minimal fields  
✅ **Progressive enhancement** - Works with existing badge system  
