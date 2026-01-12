#!/usr/bin/env pwsh
# Production Deployment Script
# Run: .\deploy.ps1

Write-Host "🚀 Starting production deployment..." -ForegroundColor Cyan

# 1. Environment Check
Write-Host "`n📋 Checking environment variables..." -ForegroundColor Yellow
$required = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL"
)

$missing = @()
foreach ($var in $required) {
    if (-not (Test-Path env:$var)) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Missing environment variables:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "`nAdd them to .env.local or Vercel dashboard" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All required environment variables present" -ForegroundColor Green

# 2. Build Check
Write-Host "`n🔨 Running production build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

# 3. Type Check
Write-Host "`n🔍 Running type check..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  TypeScript errors found (continuing anyway)" -ForegroundColor Yellow
} else {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
}

# 4. Commit Changes
Write-Host "`n📦 Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Production deployment - Day 1 launch"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
}

# 5. Push to Remote
Write-Host "`n⬆️  Pushing to remote..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Push failed - you may need to pull first" -ForegroundColor Yellow
    Read-Host "Press Enter to continue anyway or Ctrl+C to abort"
}

# 6. Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "`n📋 Post-deployment checklist:" -ForegroundColor Cyan
    Write-Host "   1. Test login at /login" -ForegroundColor White
    Write-Host "   2. Pull Epic Report at /snapshot" -ForegroundColor White
    Write-Host "   3. Try accessing /dashboard/admin (should block non-admins)" -ForegroundColor White
    Write-Host "   4. Verify middleware protection" -ForegroundColor White
    Write-Host "   5. Check error boundaries" -ForegroundColor White
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check Vercel dashboard for details" -ForegroundColor Yellow
    exit 1
}
