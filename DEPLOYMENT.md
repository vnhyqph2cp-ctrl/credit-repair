# 🚀 Deployment Guide

## Quick Deploy (Recommended)

```powershell
.\deploy.ps1
```

This script will:
1. ✅ Check environment variables
2. 🔨 Run production build
3. 🔍 Type check
4. 📦 Commit changes
5. ⬆️ Push to Git
6. 🚀 Deploy to Vercel

---

## Manual Deployment

### 1. Install Vercel CLI
```powershell
npm i -g vercel
```

### 2. Deploy
```powershell
vercel --prod
```

### 3. Add Environment Variables in Vercel Dashboard
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- Any Stripe/MFSN keys

### 4. Run Migrations
```powershell
npx prisma migrate deploy
```

---

## Post-Deployment Checklist

- [ ] Test `/login` - auth flow works
- [ ] Pull Epic Report at `/snapshot`
- [ ] Access `/dashboard/admin` as non-admin (should redirect)
- [ ] Access `/dashboard/reseller` as non-reseller (should redirect)
- [ ] Trigger error boundary (force DB error)
- [ ] Verify loading states appear
- [ ] Check progress bar logic (20% → 45% → 70% → 100%)
- [ ] Test analyzer unlock after Epic Report
- [ ] Test action plan unlock after analyzer

---

## Critical Environment Variables

### Supabase (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Database (Required)
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### Optional (Add as needed)
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
MFSN_API_KEY=...
```

---

## Troubleshooting

**Build fails:**
- Check TypeScript errors: `npx tsc --noEmit`
- Check ESLint: `npm run lint`

**Deployment succeeds but pages crash:**
- Check Vercel logs
- Verify all env vars are set in Vercel dashboard
- Ensure RLS policies allow service-role access

**Middleware not working:**
- Check `middleware.ts` exports `config` with `matcher`
- Verify Supabase client creation uses request cookies

**Database queries fail:**
- Run migrations: `npx prisma migrate deploy`
- Check table names match Prisma schema exactly
- Verify RLS policies are configured

---

## Architecture Reference

```
Epic Credit Report (Snapshot table)
  ↓ status === "ready"
Analyzer (resolve_dispute_profile RPC)
  ↓ plan.length > 0
Action Plan (sorted sections)
  ↓
Disputes (when recommended)
```

**Progress Levels:**
- No Epic Report: 20%
- Epic Report ready: 45%
- Analyzer complete: 70%
- Action Plan ready: 100%

---

**Platform is production-ready. Deploy with confidence.**
