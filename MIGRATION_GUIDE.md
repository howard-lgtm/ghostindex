# Database Migration Guide - Ghost Index Score System

## Overview
These migrations add automatic Ghost Index Score calculation based on verified reports.

## Migrations to Run

### 1. Ghost Score Calculation Functions
**File**: `supabase/migrations/20260109_ghost_score_calculation.sql`

**What it does**:
- Creates `calculate_ghost_index_score(company_uuid)` - Calculates score (0-100) based on verified reports
- Creates `update_company_ghost_score(company_uuid)` - Updates a single company's score
- Creates `recalculate_all_ghost_scores()` - Recalculates all companies' scores

**Score Logic**:
- 0-39: Low Risk (good response rate)
- 40-69: Moderate Risk
- 70-100: High Risk (high ghosting rate)
- Small sample sizes weighted toward neutral (50)

### 2. Automatic Score Update Triggers
**File**: `supabase/migrations/20260109_ghost_score_triggers.sql`

**What it does**:
- Auto-updates company scores when reports are:
  - Inserted (and verified)
  - Updated (verification status or status changes)
  - Deleted

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql)
2. Click **"New Query"**
3. Copy the contents of `20260109_ghost_score_calculation.sql`
4. Paste and click **"Run"**
5. Verify success (should see "Success. No rows returned")
6. Repeat for `20260109_ghost_score_triggers.sql`

### Option 2: Command Line

```bash
# Make sure you have Supabase CLI installed
npm install -g supabase

# Link to your project (if not already linked)
supabase link --project-ref kovcfugvlwrxkoacgbtg

# Run migrations
supabase db push
```

## Testing the Migrations

### 1. Verify Functions Exist

Run this query in Supabase SQL Editor:

```sql
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%ghost%'
ORDER BY routine_name;
```

**Expected output**: Should show 4 functions:
- `calculate_ghost_index_score`
- `recalculate_all_ghost_scores`
- `trigger_update_ghost_score`
- `update_company_ghost_score`

### 2. Verify Triggers Exist

```sql
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%score%'
ORDER BY trigger_name;
```

**Expected output**: Should show 3 triggers:
- `report_deleted_update_score`
- `report_inserted_update_score`
- `report_updated_update_score`

### 3. Test Score Calculation

```sql
-- Recalculate all scores and see results
SELECT * FROM recalculate_all_ghost_scores();
```

This will show old vs new scores for all companies.

### 4. Test with a Sample Report

```sql
-- Insert a test report (replace with real company_id and user_id)
INSERT INTO reports (
  company_id,
  user_id,
  position_title,
  application_date,
  last_contact_date,
  ghosting_duration_days,
  interview_stages_completed,
  had_interview,
  status,
  is_verified
) VALUES (
  (SELECT id FROM companies LIMIT 1), -- First company
  (SELECT id FROM auth.users LIMIT 1), -- First user
  'Test Position',
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '35 days',
  35,
  1,
  true,
  'approved',
  true
);

-- Check if the company's score was updated
SELECT 
  name,
  ghost_index_score,
  updated_at
FROM companies
WHERE id = (SELECT id FROM companies LIMIT 1);
```

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS report_inserted_update_score ON reports;
DROP TRIGGER IF EXISTS report_updated_update_score ON reports;
DROP TRIGGER IF EXISTS report_deleted_update_score ON reports;

-- Drop functions
DROP FUNCTION IF EXISTS trigger_update_ghost_score();
DROP FUNCTION IF EXISTS recalculate_all_ghost_scores();
DROP FUNCTION IF EXISTS update_company_ghost_score(UUID);
DROP FUNCTION IF EXISTS calculate_ghost_index_score(UUID);
```

## Post-Migration Steps

1. ✅ Run both migration files
2. ✅ Verify functions and triggers exist
3. ✅ Run `recalculate_all_ghost_scores()` to update existing companies
4. ✅ Test with a sample report
5. ✅ Monitor production for any errors
6. ✅ Update `SYSTEM_STATUS.md` to mark migrations as complete

## Monitoring

After migrations, monitor:
- Company score updates in real-time
- Trigger execution (check Supabase logs)
- Score distribution across companies
- Performance impact (should be minimal)

## Notes

- Migrations are **idempotent** - safe to run multiple times
- Triggers only fire for **verified and approved** reports
- Scores are **automatically recalculated** when reports change
- Small sample sizes (< 20 reports) are weighted toward neutral (50)
- Scores update immediately when reports are verified

## Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify environment variables are set
3. Ensure RLS policies allow function execution
4. Check that reports table has verified data
