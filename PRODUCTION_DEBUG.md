# Production 500 Error Debug

## Issue
After deploying autocomplete fixes and adding Upstash Redis env vars, the production API is returning 500 Internal Server Error.

## Timeline
1. ✅ Added `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Vercel (2m ago)
2. ✅ Deployed commit e544b15 with CSP fix and autocomplete improvements (45s ago)
3. ❌ API still returns 500 errors

## Possible Causes

### 1. Environment Variables Not Loaded
**Most Likely:** Vercel deployments that were already building when env vars were added won't pick them up. Need to trigger a new deployment.

**Solution:** Redeploy the latest deployment in Vercel dashboard
- Go to: https://vercel.com/howard-duffys-projects/ghostindex/deployments
- Click on deployment "FBpQWYMmf" (e544b15)
- Click "..." menu → "Redeploy"
- Select "Use existing Build Cache" → Redeploy

### 2. Rate Limiting Code Error
The rate limiting code in `lib/rate-limit.ts` might be throwing an error when the Redis client initializes.

**Check:** Vercel Function Logs
- Go to: https://vercel.com/howard-duffys-projects/ghostindex/logs
- Filter by: `/api/search`
- Look for error messages

### 3. CSP Still Blocking in Production
The CSP update might not have taken effect properly.

**Check:** Browser DevTools Console
- Open https://getghostindex.com/search
- Open DevTools (F12)
- Type in search box
- Look for CSP errors in console

## Immediate Action

**Redeploy the current production deployment:**

1. Go to: https://vercel.com/howard-duffys-projects/ghostindex/deployments
2. Click on the top deployment (FBpQWYMmf - "Fix autocomplete...")
3. Click the "..." menu on the right
4. Select "Redeploy"
5. Choose "Use existing Build Cache" (faster)
6. Click "Redeploy"

This will create a fresh deployment that picks up the environment variables.

## Verification After Redeploy

```bash
# Test API
curl "https://getghostindex.com/api/search?q=apple&limit=5"

# Should return JSON with company data, not 500 error
```

## Alternative: Manual Trigger
If redeploy doesn't work, make a small commit to force a new build:

```bash
# Add a comment to trigger rebuild
echo "# Trigger rebuild" >> README.md
git add README.md
git commit -m "Trigger rebuild with env vars"
git push origin main
```
