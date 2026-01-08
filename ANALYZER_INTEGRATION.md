# Analyzer Integration Guide (Smitty/Daraine)

## Overview
The Analyzer system uses AI (Smitty for technical grading, Daraine for strategic coaching) to evaluate credit report items and recommend dispute actions.

---

## Setup Steps

### 1. Database Migration

Run the migration to create `analyzer_items` table:

```powershell
# Option A: Run migration through Prisma
npx prisma migrate dev --name analyzer_items

# Option B: Run directly in Supabase SQL Editor
# Copy content from: prisma/migrations/20260103_analyzer_items/migration.sql
```

### 2. Deploy Edge Function

```powershell
# Deploy the analyzer function
supabase functions deploy analyzer

# Add secrets in Supabase Dashboard
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Test the Function

```typescript
// Example call from your app
const { data, error } = await supabase.functions.invoke('analyzer', {
  body: {
    mode: 'smitty', // or 'daraine'
    item: {
      item_id: 'ex-123-collection-001',
      item_type: 'collection',
      bureau: 'EX',
      furnisher_name: 'ACME MEDICAL COLLECTIONS',
      account_open_date: null,
      date_of_first_delinquency: '2023-06-15T00:00:00Z',
      raw_report_snippet: '...full bureau data...',
      client_context: {
        primary_goal: 'mortgage_12_months',
        notes: 'first-time buyer, borderline score',
        documents_available: ['insurance_eob', 'provider_letter']
      },
      round_number: 1
    }
  }
});

console.log('Analysis result:', data);
```

---

## Integration Points

### 1. Epic Report Processing
When Epic Report (`Snapshot` table) is ready:
- Extract tradelines, collections, public records, inquiries
- For each item, call analyzer Edge Function
- Store results in `analyzer_items` table

### 2. Dashboard Display
Show analyzer results on `/dashboard/analyzer/results`:
- Filter by `ai_action`:
  - `auto_dispute` → Auto-submit disputes
  - `recommend_dispute` → Show for manual review
  - `monitor` → Add to watchlist
  - `ignore` → Hide or show as "No action needed"

### 3. Action Plan Generation
Use `analyzer_items` to populate action plan sections:
- High impact + high strength → Priority disputes
- Monitor items → "Watch & wait" section
- Ignore items → Education/context only

### 4. Dispute Automation
Items with `auto_dispute_eligible === true`:
- Generate dispute letter using `dispute_ground`
- Submit to bureau automatically
- Track in `DisputeRound` table
- Update `round_status` based on bureau response

---

## Analyzer Modes

### Smitty (Technical)
- **Use when:** Need objective, audit-ready grading
- **Focus:** Data integrity, FCRA compliance, facts only
- **Tone:** Zero emotion, conservative strength ratings
- **Best for:** Automated processing, compliance review

### Daraine (Strategic)
- **Use when:** Need client-facing recommendations
- **Focus:** Client goals, energy management, realistic outcomes
- **Tone:** Coaching, honest about tradeoffs
- **Best for:** Manual review, edge cases, client communication

---

## Data Flow

```
Epic Report (Snapshot)
  ↓
Extract Items (tradelines, collections, etc.)
  ↓
Call /analyzer Edge Function (Smitty or Daraine)
  ↓
Store in analyzer_items table
  ↓
Display in Dashboard/Action Plan
  ↓
Auto-dispute or Manual Review
  ↓
Update round_status & outcome
```

---

## API Contract

### Request
```typescript
{
  mode: 'smitty' | 'daraine',
  item: {
    item_id: string,
    item_type: 'tradeline' | 'collection' | 'chargeoff' | 'public_record' | 'inquiry',
    bureau: 'EX' | 'EQ' | 'TU' | 'MERGE',
    furnisher_name: string,
    account_open_date: string | null,
    date_of_first_delinquency: string | null,
    raw_report_snippet: string,
    client_context: {
      primary_goal?: string,
      notes?: string,
      documents_available?: string[]
    },
    round_number: 1 | 2 | 3 | 4
  }
}
```

### Response
```typescript
{
  id: number, // analyzer_items row ID
  analyzer_item: {
    // Full AnalyzerItem object
    item_id: string,
    impact_score: 1-5,
    dispute_strength: 1-5,
    auto_dispute_eligible: boolean,
    ai_action: 'auto_dispute' | 'recommend_dispute' | 'monitor' | 'ignore',
    explanation: {
      impact_reason: string,
      strength_reason: string,
      dispute_ground_reason: string,
      eligibility_reason: string
    },
    // ... all other fields
  }
}
```

---

## Scoring Logic

### Impact Score (1-5)
- **5:** Severe, recent, high balance, blocks major goals
- **4:** Significant impact on approvals/rates
- **3:** Moderate impact, affects score but not critical
- **2:** Minor impact, old or small
- **1:** Negligible impact

### Dispute Strength (1-5)
- **5:** Strong evidence, clear FCRA violation
- **4:** Good documentation, clear inconsistency
- **3:** Moderate evidence, some support
- **2:** Weak documentation, unclear
- **1:** No evidence, unlikely to succeed

### Auto-Dispute Eligibility
```typescript
auto_dispute_eligible = 
  (impact_score >= 3 && dispute_strength >= 3 && evidence_status !== 'none')
  || dispute_ground === 'obsolete_information'
  || dispute_ground === 'cannot_be_verified'
```

---

## Next Steps

1. **Wire Epic Report → Analyzer:**
   - Add item extraction logic in `/snapshot` callback
   - Call analyzer function for each item
   - Display results in `/dashboard/analyzer`

2. **Build Auto-Dispute Pipeline:**
   - Filter `auto_dispute_eligible === true`
   - Generate letters from `dispute_ground`
   - Submit via MFSN or bureau APIs
   - Track in `DisputeRound`/`DisputeOutcome`

3. **Manual Review UI:**
   - Display `recommend_dispute` items
   - Show explanation fields
   - Allow user to approve/reject

4. **Monitoring Dashboard:**
   - Display `monitor` items
   - Show why monitoring is recommended
   - Auto-transition to dispute when conditions improve

---

**Platform is ready for AI-powered dispute analysis.**
