# Cron Endpoint Testing Guide

## Status: Ready for Testing

The cron endpoints are implemented and ready to test. They require configuration in Vercel.

---

## Environment Setup

### 1. Add CRON_SECRET to Vercel

Go to: https://vercel.com/howard-duffys-projects/ghostindex/settings/environment-variables

Add:
```
Name: CRON_SECRET
Value: 2U0a4WBmI8Zg9Uc1Vdgp7dZQCfQv0XlbLIvuELLVkf0=
Environment: Production, Preview, Development
```

**Important:** This secret is required for all cron endpoints to authenticate requests.

---

## Available Cron Endpoints

### 1. Auto-Ghost Detection
**Endpoint:** `/api/cron/auto-ghost`
**Purpose:** Marks verified reports as "auto-ghosted" if no response after 30 days
**Database Function:** `auto_ghost_stale_applications()`

**Test Command:**
```bash
curl -X GET "https://getghostindex.com/api/cron/auto-ghost" \
  -H "Authorization: Bearer 2U0a4WBmI8Zg9Uc1Vdgp7dZQCfQv0XlbLIvuELLVkf0="
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Auto-ghost detection completed",
  "timestamp": "2026-01-14T12:00:00.000Z"
}
```

---

### 2. Score Update
**Endpoint:** `/api/cron/update-scores`
**Purpose:** Recalculates Ghost Index Scores for all companies
**Database Function:** `calculate_ghost_index_score(company_uuid)`

**Test Command:**
```bash
curl -X GET "https://getghostindex.com/api/cron/update-scores" \
  -H "Authorization: Bearer 2U0a4WBmI8Zg9Uc1Vdgp7dZQCfQv0XlbLIvuELLVkf0="
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Score update completed",
  "updated": 91,
  "total": 91,
  "timestamp": "2026-01-14T12:00:00.000Z"
}
```

---

### 3. Ghost Jobs Detection
**Endpoint:** `/api/cron/ghost-jobs`
**Purpose:** Identifies job postings that have been open for 60+ days
**Database Function:** `detect_ghost_jobs()`

**Test Command:**
```bash
curl -X GET "https://getghostindex.com/api/cron/ghost-jobs" \
  -H "Authorization: Bearer 2U0a4WBmI8Zg9Uc1Vdgp7dZQCfQv0XlbLIvuELLVkf0="
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Ghost jobs detection completed",
  "timestamp": "2026-01-14T12:00:00.000Z"
}
```

---

## Vercel Cron Configuration

The cron schedule is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-ghost",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/update-scores",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/ghost-jobs",
      "schedule": "0 4 * * *"
    }
  ]
}
```

**Schedule:**
- Auto-ghost: Daily at midnight UTC
- Update scores: Daily at 2 AM UTC
- Ghost jobs: Daily at 4 AM UTC

**Note:** Vercel Cron requires a Pro plan ($20/month)

---

## Testing Steps

### Step 1: Add CRON_SECRET to Vercel
1. Go to Vercel project settings
2. Add environment variable
3. Redeploy (or wait for next deployment)

### Step 2: Test Each Endpoint
Run the curl commands above for each endpoint.

### Step 3: Verify Results

**Auto-Ghost:**
- Check database: `SELECT COUNT(*) FROM reports WHERE auto_ghosted = true;`
- Should increase if any reports are >30 days old

**Update Scores:**
- Check database: `SELECT name, ghost_index_score FROM companies WHERE ghost_index_score IS NOT NULL;`
- Scores should be recalculated

**Ghost Jobs:**
- Check database: `SELECT * FROM ghost_jobs;` (if table exists)
- Should detect stale job postings

---

## Troubleshooting

### 401 Unauthorized
- CRON_SECRET not set in Vercel
- Wrong secret value in request

### 500 Internal Server Error
- Database function doesn't exist
- Database connection issue
- Check Vercel function logs

### No Response
- Endpoint doesn't exist
- Deployment failed
- Check Vercel deployment status

---

## Current Status

✅ Cron endpoints implemented
✅ Authentication configured
✅ Local CRON_SECRET generated
❌ CRON_SECRET not in Vercel (needs to be added)
❌ Endpoints not tested yet
❌ Vercel Cron schedule not active (requires Pro plan)

---

## Next Steps

1. **Add CRON_SECRET to Vercel** (required)
2. **Test endpoints manually** using curl commands above
3. **Verify database changes** after each test
4. **Upgrade to Vercel Pro** (optional, for automatic scheduling)
5. **Monitor cron job execution** in Vercel logs
