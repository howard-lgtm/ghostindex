# Quick Migration Instructions

## Step 1: Add Upstash Redis to Vercel (In Progress)

You're currently adding these environment variables in Vercel:

1. **UPSTASH_REDIS_REST_URL**: `https://renewed-zebra-9918.upstash.io`
2. **UPSTASH_REDIS_REST_TOKEN**: `ASa-AAImcDFjM2FiMjI4MzRjOTY0ZWFmYTk3ZDA4ZGRhZmJiYjI2ZXAxOTkxOA`

After adding, click **"Redeploy"** to apply changes.

---

## Step 2: Run Database Migrations

### Migration 1: Ghost Score Functions

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql)
2. Click **"New Query"**
3. Copy and paste this entire SQL:

```sql
-- Ghost Index Score Calculation Function
-- Calculates score based on verified reports for a company
-- Score ranges from 0-100 where higher = more ghosting

CREATE OR REPLACE FUNCTION calculate_ghost_index_score(company_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_verified_reports INTEGER;
  ghosted_reports INTEGER;
  avg_days_to_ghost DECIMAL;
  response_rate DECIMAL;
  calculated_score DECIMAL(5,2);
BEGIN
  -- Count total verified reports for this company
  SELECT COUNT(*) INTO total_verified_reports
  FROM reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved';

  -- If no verified reports, return NULL
  IF total_verified_reports = 0 THEN
    RETURN NULL;
  END IF;

  -- Count reports marked as ghosted (no response after 30+ days)
  -- For now, we'll use a simple heuristic: reports older than 30 days without rejection
  SELECT COUNT(*) INTO ghosted_reports
  FROM reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved'
    AND created_at < NOW() - INTERVAL '30 days';

  -- Calculate ghosting rate (0-1)
  response_rate := 1.0 - (ghosted_reports::DECIMAL / total_verified_reports::DECIMAL);

  -- Base score calculation:
  -- - High ghosting rate = high score (bad)
  -- - Low ghosting rate = low score (good)
  -- Formula: (1 - response_rate) * 100
  calculated_score := (1.0 - response_rate) * 100;

  -- Apply adjustments based on sample size
  -- Smaller sample sizes get pulled toward 50 (neutral)
  IF total_verified_reports < 5 THEN
    -- Weight toward neutral for small samples
    calculated_score := (calculated_score * 0.5) + (50 * 0.5);
  ELSIF total_verified_reports < 10 THEN
    calculated_score := (calculated_score * 0.7) + (50 * 0.3);
  ELSIF total_verified_reports < 20 THEN
    calculated_score := (calculated_score * 0.85) + (50 * 0.15);
  END IF;

  -- Ensure score is within bounds
  calculated_score := GREATEST(0, LEAST(100, calculated_score));

  RETURN calculated_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update a company's ghost index score
CREATE OR REPLACE FUNCTION update_company_ghost_score(company_uuid UUID)
RETURNS VOID AS $$
DECLARE
  new_score DECIMAL(5,2);
BEGIN
  -- Calculate the new score
  new_score := calculate_ghost_index_score(company_uuid);
  
  -- Update the company record
  UPDATE companies
  SET ghost_index_score = new_score,
      updated_at = NOW()
  WHERE id = company_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate all company scores
CREATE OR REPLACE FUNCTION recalculate_all_ghost_scores()
RETURNS TABLE(company_id UUID, company_name TEXT, old_score DECIMAL(5,2), new_score DECIMAL(5,2)) AS $$
BEGIN
  RETURN QUERY
  WITH score_updates AS (
    SELECT 
      c.id,
      c.name,
      c.ghost_index_score as old_score,
      calculate_ghost_index_score(c.id) as new_score
    FROM companies c
  )
  UPDATE companies c
  SET ghost_index_score = su.new_score,
      updated_at = NOW()
  FROM score_updates su
  WHERE c.id = su.id
  RETURNING c.id, c.name, su.old_score, su.new_score;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION calculate_ghost_index_score IS 'Calculates Ghost Index Score (0-100) based on verified reports. Higher score = more ghosting.';
COMMENT ON FUNCTION update_company_ghost_score IS 'Updates a single company''s ghost index score based on current verified reports.';
COMMENT ON FUNCTION recalculate_all_ghost_scores IS 'Recalculates ghost index scores for all companies. Returns old and new scores for comparison.';
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: **"Success. No rows returned"**

---

### Migration 2: Auto-Update Triggers

1. In the same SQL Editor, click **"New Query"** again
2. Copy and paste this entire SQL:

```sql
-- Triggers to automatically update Ghost Index Scores when reports change

-- Trigger function to update company score when a report is verified
CREATE OR REPLACE FUNCTION trigger_update_ghost_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the company's ghost index score
  PERFORM update_company_ghost_score(NEW.company_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger when a report is inserted
CREATE TRIGGER report_inserted_update_score
  AFTER INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.is_verified = true AND NEW.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Trigger when a report is updated (e.g., verified or status changed)
CREATE TRIGGER report_updated_update_score
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (
    (NEW.is_verified = true AND NEW.status = 'approved') AND
    (OLD.is_verified != NEW.is_verified OR OLD.status != NEW.status)
  )
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Trigger when a report is deleted
CREATE TRIGGER report_deleted_update_score
  AFTER DELETE ON reports
  FOR EACH ROW
  WHEN (OLD.is_verified = true AND OLD.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();

-- Add comments for documentation
COMMENT ON FUNCTION trigger_update_ghost_score IS 'Trigger function that recalculates company ghost score when reports change';
COMMENT ON TRIGGER report_inserted_update_score ON reports IS 'Recalculates ghost score when a verified report is inserted';
COMMENT ON TRIGGER report_updated_update_score ON reports IS 'Recalculates ghost score when a report is verified or status changes';
COMMENT ON TRIGGER report_deleted_update_score ON reports IS 'Recalculates ghost score when a verified report is deleted';
```

3. Click **"Run"**
4. You should see: **"Success. No rows returned"**

---

## Step 3: Verify Migrations

Run this query to verify everything is installed:

```sql
-- Check functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%ghost%'
ORDER BY routine_name;

-- Check triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%score%'
ORDER BY trigger_name;
```

Expected: 4 functions and 3 triggers

---

## Step 4: Test Score Calculation

Run this to recalculate all existing company scores:

```sql
SELECT * FROM recalculate_all_ghost_scores();
```

This will show old vs new scores for all companies.

---

## Next Steps After Migrations

1. ✅ Redeploy Vercel after adding Upstash variables
2. ✅ Test rate limiting on production
3. ✅ Submit a test report to verify auto-score updates
4. ✅ Monitor Supabase logs for any errors

---

## Quick Links

- [Vercel Environment Variables](https://vercel.com/howard-duffys-projects/ghostindex/settings/environment-variables)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql)
- [Production Site](https://getghostindex.com)
