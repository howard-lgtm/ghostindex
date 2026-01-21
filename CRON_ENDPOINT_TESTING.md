# Cron Endpoint Testing Guide

## Overview

This guide explains how to test the three automated cron endpoints that power GhostIndex's automation features.

## Cron Endpoints

### 1. Auto-Ghost Detection (`/api/cron/auto-ghost`)
**Purpose:** Automatically marks applications as "ghosted" if no response after 30 days  
**Database Function:** `auto_ghost_stale_applications()`  
**Frequency:** Should run daily  

### 2. Score Updates (`/api/cron/update-scores`)
**Purpose:** Recalculates Ghost Index Scores for all companies  
**Database Function:** `calculate_ghost_index_score(company_uuid)`  
**Frequency:** Should run daily or after significant report changes  

### 3. Ghost Job Detection (`/api/cron/ghost-jobs`)
**Purpose:** Detects job postings that may be fake/ghost positions  
**Database Function:** `detect_ghost_jobs()`  
**Frequency:** Should run weekly  

## Security

All cron endpoints are protected by:
- **Authorization Header:** `Bearer ${CRON_SECRET}`
- **401 Response:** If secret is missing or incorrect
- **Environment Variable:** `CRON_SECRET` (stored in Vercel)

## Testing Methods

### Method 1: Automated Test Script (Recommended)

Run the comprehensive test suite:

```bash
npm run test:cron
```

This will:
- ✅ Test all three endpoints
- ✅ Verify authentication works
- ✅ Test unauthorized access is blocked
- ✅ Measure response times
- ✅ Display detailed results

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║         GhostIndex Cron Endpoint Testing Suite            ║
╚════════════════════════════════════════════════════════════╝

📍 Testing against: https://getghostindex.com
🔑 Using CRON_SECRET: abc12345...

🔄 Testing: Auto-ghost stale applications
   Endpoint: /api/cron/auto-ghost
✅ Success (200) - 1234ms
   Response: {
     "success": true,
     "message": "Auto-ghost detection completed",
     "timestamp": "2026-01-21T14:30:00.000Z"
   }

...

📊 Functionality Tests: 3/3 passed
🔒 Security Tests: PASSED
✅ All tests passed! Cron endpoints are working correctly.
```

### Method 2: Manual cURL Testing

Test individual endpoints manually:

#### Auto-Ghost Endpoint
```bash
curl -X GET https://getghostindex.com/api/cron/auto-ghost \
  -H "Authorization: Bearer $CRON_SECRET"
```

#### Update Scores Endpoint
```bash
curl -X GET https://getghostindex.com/api/cron/update-scores \
  -H "Authorization: Bearer $CRON_SECRET"
```

#### Ghost Jobs Endpoint
```bash
curl -X GET https://getghostindex.com/api/cron/ghost-jobs \
  -H "Authorization: Bearer $CRON_SECRET"
```

#### Test Unauthorized Access (Should Return 401)
```bash
curl -X GET https://getghostindex.com/api/cron/auto-ghost \
  -H "Authorization: Bearer wrong-secret"
```

### Method 3: Vercel Logs

After running cron jobs, check Vercel logs:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ghostindex`
3. Click "Logs" tab
4. Filter by function: `/api/cron/*`
5. Look for success/error messages

## Setting Up Scheduled Cron Jobs

### Option 1: Vercel Cron (Recommended)

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-ghost",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/update-scores",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/ghost-jobs",
      "schedule": "0 4 * * 0"
    }
  ]
}
```

**Schedule Explanation:**
- `0 2 * * *` - Daily at 2:00 AM UTC
- `0 3 * * *` - Daily at 3:00 AM UTC
- `0 4 * * 0` - Weekly on Sunday at 4:00 AM UTC

### Option 2: External Cron Service

Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **GitHub Actions** (free for public repos)

Example GitHub Action (`.github/workflows/cron.yml`):

```yaml
name: Scheduled Cron Jobs

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  run-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Auto-ghost detection
        run: |
          curl -X GET https://getghostindex.com/api/cron/auto-ghost \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      
      - name: Update scores
        run: |
          curl -X GET https://getghostindex.com/api/cron/update-scores \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Monitoring

### Success Indicators

✅ **Auto-Ghost:**
- Response: `{ "success": true, "message": "Auto-ghost detection completed" }`
- Database: Reports marked as `auto_ghosted = true` after 30 days

✅ **Update Scores:**
- Response: `{ "success": true, "updated": X, "total": Y }`
- Database: `ghost_index_score` updated for companies with verified reports

✅ **Ghost Jobs:**
- Response: `{ "success": true, "message": "Ghost job detection completed" }`
- Database: Jobs flagged based on detection criteria

### Error Indicators

❌ **401 Unauthorized:**
- Issue: Wrong or missing CRON_SECRET
- Fix: Check environment variable in Vercel

❌ **500 Internal Server Error:**
- Issue: Database function error
- Fix: Check Vercel logs for details, verify database functions exist

❌ **Timeout:**
- Issue: Function taking too long (>10s default)
- Fix: Optimize database queries or increase timeout in Vercel

## Troubleshooting

### Issue: "Unauthorized" Response

**Cause:** CRON_SECRET mismatch  
**Solution:**
1. Check `.env.local` has correct secret
2. Verify Vercel environment variable matches
3. Redeploy after changing environment variables

### Issue: Database Function Not Found

**Cause:** Database migrations not run  
**Solution:**
```bash
# Check if functions exist in Supabase
# Go to SQL Editor and run:
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_name LIKE '%ghost%';
```

### Issue: Slow Response Times

**Cause:** Large dataset or inefficient queries  
**Solution:**
- Add database indexes
- Optimize SQL functions
- Consider pagination for large updates

## Performance Benchmarks

**Expected Response Times:**
- Auto-ghost: 500-2000ms (depends on report count)
- Update scores: 1000-5000ms (depends on company count)
- Ghost jobs: 500-1500ms (depends on job count)

**Acceptable Limits:**
- < 5s: Good
- 5-10s: Acceptable
- > 10s: Needs optimization

## Next Steps

1. ✅ Test all endpoints with `npm run test:cron`
2. ⏳ Set up Vercel Cron or external scheduler
3. ⏳ Monitor first few runs in Vercel logs
4. ⏳ Set up alerts for failures (optional)
5. ⏳ Document any issues or optimizations needed

## Environment Variables Required

```bash
# In .env.local and Vercel
CRON_SECRET=your_secure_random_string_here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Additional Resources

- [Vercel Cron Jobs Docs](https://vercel.com/docs/cron-jobs)
- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)
- [Cron Expression Generator](https://crontab.guru/)
