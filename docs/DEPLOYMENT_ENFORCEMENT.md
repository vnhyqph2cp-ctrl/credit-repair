# 3B Enforcement System - Deployment Guide

## Quick Start (Day-1 Production)

### 1. Database Migration

The schema is already complete in `prisma/schema.prisma`. Run the migration:

```bash
npx prisma migrate dev --name enforcement_system
npx prisma generate
```

### 2. Environment Setup

Ensure these variables are set in `.env`:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"

# Supabase (for Edge Functions)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# File Storage (optional - for envelope/document uploads)
# S3 Example:
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="credit-repair-evidence"
```

### 3. Deploy Edge Function (Automated Scanner)

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the enforcement scanner
supabase functions deploy enforcement-scanner

# Set environment variables
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Configure Cron Schedule

**Option A: Supabase Dashboard**
1. Go to Supabase Dashboard > Edge Functions
2. Select `enforcement-scanner`
3. Enable cron trigger
4. Set schedule: `0 9 * * *` (Daily at 9:00 AM EST)

**Option B: Manual Trigger**
```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/enforcement-scanner \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

**Option C: Next.js API Cron (if no Supabase cron)**
Use a service like Vercel Cron, Upstash QStash, or cron-job.org:
```
POST https://your-domain.com/api/enforcement/scan-violations
```

### 5. Build & Deploy

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy (example: Vercel)
vercel --prod
```

### 6. Access the System

Navigate to: `https://your-domain.com/dashboard/enforcement`

---

## File Upload Configuration (Optional Enhancement)

For production envelope/document image uploads, integrate a storage provider:

### Supabase Storage

```typescript
// lib/storage/upload.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadEvidence(
  file: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('mail-evidence')
    .upload(path, file);
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('mail-evidence')
    .getPublicUrl(data.path);
  
  return publicUrl;
}
```

### AWS S3

```typescript
// lib/storage/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadToS3(
  file: Buffer,
  key: string
): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg'
  }));
  
  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
```

Then update `MailEvidenceUpload.tsx` to handle file uploads before API submission.

---

## Testing the System

### 1. Create Test Dispute Item

```bash
curl -X POST http://localhost:3000/api/enforcement/analyzer-items \
  -H "Content-Type: application/json" \
  -d '{
    "bureau": "EQ",
    "creditor": "Test Bank",
    "disputeReason": "Account not mine",
    "itemType": "tradeline"
  }'
```

### 2. Upload Test Evidence

```bash
curl -X POST http://localhost:3000/api/enforcement/mail-evidence \
  -H "Content-Type: application/json" \
  -d '{
    "analyzerItemId": "your-item-id",
    "rawText": "We need more time to investigate",
    "bureau": "EQ",
    "roundNumber": 1,
    "receivedAt": "2026-01-03"
  }'
```

### 3. Trigger Manual Violation Scan

```bash
curl -X POST http://localhost:3000/api/enforcement/scan-violations
```

### 4. View Enforcement Dashboard

Open: `http://localhost:3000/dashboard/enforcement`

---

## Production Monitoring

### Key Metrics to Track

1. **Violation Detection Rate**
   - Query: `SELECT COUNT(*) FROM "analyzerItems" WHERE "proceduralViolation" = true`

2. **Average Days to Resolution**
   - Query: `SELECT AVG(EXTRACT(DAY FROM ("resolvedAt" - "disputeFiledAt"))) FROM "analyzerItems" WHERE "resolvedAt" IS NOT NULL`

3. **Scanner Success Rate**
   - Monitor Edge Function logs for successful daily scans

4. **Evidence Upload Volume**
   - Query: `SELECT COUNT(*) FROM "mailEvidence" WHERE "createdAt" > NOW() - INTERVAL '24 hours'`

### Alerting

Set up alerts for:
- Scanner failures (no run in 25 hours)
- High violation detection rate (>50% of items)
- Evidence upload failures
- Database connection issues

### Logging

Enable structured logging in production:

```typescript
// lib/logger.ts
export function logEnforcementEvent(event: {
  type: 'violation_detected' | 'evidence_uploaded' | 'scan_complete';
  itemId?: string;
  details: any;
}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    system: 'enforcement',
    ...event
  }));
}
```

---

## Troubleshooting

### Issue: Scanner not running automatically

**Check:**
1. Supabase Edge Function deployed? `supabase functions list`
2. Cron schedule configured? Check Supabase dashboard
3. Service role key set? `supabase secrets list`

**Manual trigger:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/enforcement-scanner \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

### Issue: Classification not working

**Check:**
1. `rawText` field has actual letter content
2. Text is lowercase-normalized in classification logic
3. Check logs for classification errors

**Debug:**
```typescript
// Test classification locally
import { classifyMailEvidence } from '@/lib/enforcement/enforcement-engine';

const result = await classifyMailEvidence({
  memberId: 'test',
  analyzerItemId: null,
  rawText: 'We need more time to investigate',
  bureau: 'EQ',
  roundNumber: 1,
  receivedAt: new Date()
});

console.log(result); // Should show classification + violation detection
```

### Issue: Evidence not updating item status

**Check:**
1. `analyzerItemId` is correctly linked
2. Database transaction completed
3. Item exists and is in valid state

**Query:**
```sql
SELECT * FROM "analyzerItems" WHERE id = 'your-item-id';
SELECT * FROM "mailEvidence" WHERE "analyzerItemId" = 'your-item-id';
```

---

## Security Considerations

### Access Control

- ✅ All enforcement endpoints require authentication
- ✅ Manual scan endpoint requires admin role
- ✅ Evidence upload restricted to item owner

### Data Protection

- ⚠️ Envelope/document images may contain PII
- ⚠️ Use encrypted storage (S3 SSE, Supabase encryption)
- ⚠️ Implement access logging for compliance

### Evidence Integrity

- ✅ Timestamps are immutable (createdAt)
- ✅ Classification is logged (manualClassification flag)
- ✅ Evidence cannot be deleted (only marked inactive if needed)

---

## Next Steps (Optional Enhancements)

1. **OCR Integration**
   - Auto-extract text from document images
   - Services: AWS Textract, Google Vision API, Tesseract.js

2. **CFPB Complaint Automation**
   - Auto-generate complaint forms
   - API integration with CFPB submission portal

3. **SMS/Email Notifications**
   - Alert on violation detection
   - Notify when evidence uploaded
   - Deadline reminders (day 25, day 28, day 30)

4. **Evidence Timeline Visualization**
   - Graphical timeline of all mail events
   - Postmark date vs. received date comparison
   - Violation markers on timeline

5. **Batch Operations**
   - Upload multiple evidences at once
   - Bulk item creation from report import
   - Mass violation scan across all bureaus

---

## Support Resources

- **Documentation:** `/docs/ENFORCEMENT_DOCTRINE.md`
- **Source Code:** `/lib/enforcement/enforcement-engine.ts`
- **API Reference:** See individual route files in `/app/api/enforcement/`
- **UI Components:** `/app/dashboard/components/`

---

**Deployment Checklist:**

- [ ] Database migrated
- [ ] Environment variables set
- [ ] Edge function deployed
- [ ] Cron schedule configured
- [ ] File storage configured (optional)
- [ ] Application built and deployed
- [ ] Tested with sample dispute
- [ ] Monitoring/alerting configured

**Status:** Ready for Production ✅
