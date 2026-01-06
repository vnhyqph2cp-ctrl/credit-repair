# Commission System

Lightweight, accounting-safe commission tracking for reseller partnerships.

## Architecture

### Data Model
```sql
reseller_commissions (
  id              UUID PRIMARY KEY
  reseller_id     UUID → Customer(id)
  user_id         UUID → Customer(id)
  amount          NUMERIC(10,2)
  reason          TEXT
  metadata        JSONB
  status          TEXT (pending | approved | paid | cancelled)
  created_at      TIMESTAMPTZ
  paid_at         TIMESTAMPTZ
)
```

### Commission Rates
Defined in `lib/commissions.ts`:

| Milestone | Amount |
|-----------|--------|
| Epic Report Completed | $25.00 |
| Analyzer Completed | $15.00 |
| Subscription - Basic | $10.00 |
| Subscription - Analyzer | $25.00 |
| Subscription - Welcome | $50.00 |
| Subscription - Ultimate | $100.00 |
| Funding Ready | $50.00 |

## Usage

### Server-Side Only
All commission operations must be server-side with service role:

```typescript
import {
  awardCommissionIfReferred,
  COMMISSION_RATES,
} from "@/lib/commissions";

// After Epic Report completion
await awardCommissionIfReferred(
  userId,
  COMMISSION_RATES.EPIC_REPORT_COMPLETED,
  "Epic Report Completed",
  { reportId: snapshot.id }
);
```

### Integration Points

#### 1. Epic Report Completion
```typescript
// In your MFSN callback or snapshot completion handler
const { data: snapshot } = await supabase
  .from("Snapshot")
  .update({ status: "ready" })
  .eq("id", snapshotId)
  .select()
  .single();

if (snapshot) {
  await awardCommissionIfReferred(
    snapshot.customerId,
    COMMISSION_RATES.EPIC_REPORT_COMPLETED,
    "Epic Report Completed",
    { snapshotId: snapshot.id }
  );
}
```

#### 2. Analyzer Completion
```typescript
// After analyzer finishes successfully
await awardCommissionIfReferred(
  userId,
  COMMISSION_RATES.ANALYZER_COMPLETED,
  "Analyzer Completed"
);
```

#### 3. Subscription Creation
```typescript
// In Stripe webhook handler
await awardCommissionIfReferred(
  userId,
  COMMISSION_RATES.SUBSCRIPTION_ANALYZER,
  "Subscription - Analyzer Plan",
  { subscriptionId: subscription.id }
);
```

#### 4. Funding Readiness
```typescript
// When user reaches funding-ready status
await awardCommissionIfReferred(
  userId,
  COMMISSION_RATES.FUNDING_READY,
  "Funding Ready Milestone",
  { fundingScore: score }
);
```

### Utility Functions

```typescript
import {
  awardCommission,
  getResellerCommissions,
  calculateResellerEarnings,
  updateCommissionStatus,
} from "@/lib/commissions";

// Award commission directly (if you already know reseller ID)
await awardCommission({
  resellerId: "uuid",
  userId: "uuid",
  amount: 25.00,
  reason: "Custom milestone",
  metadata: { custom: "data" }
});

// Get all commissions for a reseller
const commissions = await getResellerCommissions(resellerId);
const pending = await getResellerCommissions(resellerId, "pending");

// Calculate total earnings
const earnings = await calculateResellerEarnings(resellerId);
// Returns: { total, pending, paid, count }

// Mark commission as paid
await updateCommissionStatus(commissionId, "paid", new Date());
```

## Reseller Dashboard

Resellers can view earnings in their dashboard at `/dashboard/reseller`.

The earnings card shows:
- **Total Earnings** - All-time commission total
- **Pending** - Commissions awaiting payment

### Edge Function Extension

To return earnings data, extend `/functions/v1/badges?scope=reseller`:

```typescript
// In your badges Edge Function
if (scope === "reseller") {
  // ... existing logic ...

  // Add earnings
  const earnings = await calculateResellerEarnings(user.id);

  return {
    scope: "reseller",
    summary,
    clients,
    earnings // { total, pending, paid, count }
  };
}
```

## Payment Workflow

### Manual Payment (Current)
1. Admin reviews pending commissions in admin dashboard
2. Process payment via external system (PayPal, bank transfer, etc.)
3. Mark commission as paid:
```typescript
await updateCommissionStatus(commissionId, "paid", new Date());
```

### Future: Automated Payments
- Integrate Stripe Connect or PayPal Payouts
- Schedule automatic monthly payouts
- Minimum threshold (e.g., $100)
- Automated tax form generation

## Security

### RLS Policies
```sql
-- Resellers can only view their own commissions
CREATE POLICY "resellers_view_own_commissions"
ON reseller_commissions FOR SELECT
TO authenticated
USING (reseller_id = auth.uid());

-- Only service role can insert/update
-- (No policy = blocked by default for authenticated users)
```

### Constraints
- Amount must be >= 0
- Reseller must have `role = 'reseller'`
- Status limited to: pending, approved, paid, cancelled

## Reporting

### Admin Queries

```sql
-- Total commissions by reseller
SELECT 
  r.email,
  COUNT(*) as commission_count,
  SUM(c.amount) as total_earned,
  SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END) as pending,
  SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END) as paid
FROM reseller_commissions c
JOIN "Customer" r ON c.reseller_id = r.id
GROUP BY r.email
ORDER BY total_earned DESC;

-- Recent commissions
SELECT 
  r.email as reseller,
  u.email as client,
  c.amount,
  c.reason,
  c.status,
  c.created_at
FROM reseller_commissions c
JOIN "Customer" r ON c.reseller_id = r.id
JOIN "Customer" u ON c.user_id = u.id
ORDER BY c.created_at DESC
LIMIT 50;

-- Monthly commission summary
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as commissions,
  SUM(amount) as total
FROM reseller_commissions
WHERE status != 'cancelled'
GROUP BY month
ORDER BY month DESC;
```

## Best Practices

### 1. Always Use Helper Functions
```typescript
// ✅ Good - safe, checks for reseller
await awardCommissionIfReferred(userId, 25.00, "Milestone");

// ❌ Bad - manual insert, error-prone
await supabase.from("reseller_commissions").insert(...);
```

### 2. Include Metadata
```typescript
await awardCommissionIfReferred(
  userId,
  amount,
  reason,
  {
    snapshotId: "abc",
    tier: "analyzer",
    timestamp: new Date().toISOString()
  }
);
```

### 3. Log Commission Events
All helper functions automatically log to console:
```
✅ Commission awarded: $25.00 to <uuid> for Epic Report Completed
```

### 4. Handle Failures Gracefully
```typescript
const commission = await awardCommissionIfReferred(...);
if (!commission) {
  // User has no reseller - this is fine
  console.log("No reseller to award commission");
}
```

### 5. Prevent Duplicates
Check before awarding:
```typescript
// Example: Don't award twice for same snapshot
const existing = await supabase
  .from("reseller_commissions")
  .select("id")
  .eq("user_id", userId)
  .eq("reason", "Epic Report Completed")
  .single();

if (!existing.data) {
  await awardCommissionIfReferred(...);
}
```

## Future Enhancements

1. **Tiered Commission Rates**
   - Higher rates for high-volume resellers
   - Bonuses for milestones (e.g., 50 clients)

2. **Commission Caps**
   - Max per client
   - Max per month

3. **Recurring Commissions**
   - Monthly subscription commissions
   - Lifetime value tracking

4. **Tax Reporting**
   - 1099 generation for US resellers
   - Export for accounting systems

5. **Fraud Prevention**
   - Rate limiting
   - Manual approval for high amounts
   - Suspicious pattern detection

## Testing

```powershell
# 1. Create test reseller
node scripts/promote-reseller.mjs reseller@test.com

# 2. Create test client with referral
# Visit /register?ref=<code>

# 3. Award test commission
$env:TEST_USER_ID="<client-uuid>"
node -e "
  import('./lib/commissions.js').then(m => {
    m.awardCommissionIfReferred(
      process.env.TEST_USER_ID,
      25.00,
      'Test Commission'
    );
  });
"

# 4. Verify in database
# SELECT * FROM reseller_commissions;
```

## Migration

Run the migration to create the table:
```bash
npx prisma migrate deploy
```

Or manually:
```sql
-- Run: prisma/migrations/20260103000002_add_commission_tracking/migration.sql
```
