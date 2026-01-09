# Production Fix Steps - Search API 500 Error

## Issue
Production search API is returning 500 errors because Upstash Redis environment variables are missing.

## Fix Steps

### 1. Add Upstash Redis Environment Variables to Vercel

Go to: https://vercel.com/howard-duffys-projects/ghostindex/settings/environment-variables

Add these two variables (for **All Environments**):

**Variable 1:**
- Key: `UPSTASH_REDIS_REST_URL`
- Value: `https://renewed-zebra-9918.upstash.io`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- Key: `UPSTASH_REDIS_REST_TOKEN`
- Value: `ASa-AAImcDFjM2FiMjI4MzRjOTY0ZWFmYTk3ZDA4ZGRhZmJiYjI2ZXAxOTkxOA`
- Environments: ✅ Production, ✅ Preview, ✅ Development

### 2. Deploy Local Fixes to Production

Commit and push the autocomplete fixes:

```bash
cd /Users/howardduffy/CascadeProjects/ghostindex

# Check what files changed
git status

# Add the changed files
git add next.config.ts app/search/page.tsx

# Commit with descriptive message
git commit -m "Fix autocomplete: Add Upstash to CSP, optimize debounce, fix flickering"

# Push to GitHub (triggers automatic Vercel deployment)
git push origin main
```

### 3. Wait for Deployment

After pushing:
1. Vercel will automatically deploy (takes ~2-3 minutes)
2. Check deployment status: https://vercel.com/howard-duffys-projects/ghostindex/deployments
3. Once deployed, test: https://getghostindex.com/search

### 4. Verify Production Works

Test the search API:
```bash
curl "https://getghostindex.com/api/search?q=apple&limit=10"
```

Should return company data, not a 500 error.

Test autocomplete in browser:
1. Go to https://getghostindex.com/search
2. Type "app" in the search box
3. Autocomplete dropdown should appear with Apple, etc.

## Files Modified Locally (Need to Deploy)

1. **next.config.ts** - Added `https://*.upstash.io` to CSP
2. **app/search/page.tsx** - Fixed flickering, optimized debounce (150ms)

## After Production is Fixed

1. ✅ Test autocomplete performance (should be fast)
2. ✅ Run database migrations for Ghost Index Score calculation
3. ✅ Test score calculation with sample data
4. ✅ Update system documentation

---

**Estimated Time:** 10 minutes total (5 min for env vars + 5 min for deployment)
