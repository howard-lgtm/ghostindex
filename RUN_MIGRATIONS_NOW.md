# Run Database Migrations - Quick Guide

## Step 1: Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql

## Step 2: Run Migration 1 - Ghost Score Functions

Click **"New Query"** and paste this entire SQL:

```sql
-- Ghost Index Score Calculation Function
CREATE OR REPLACE FUNCTION calculate_ghost_index_score(company_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_verified_reports INTEGER;
  ghosted_reports INTEGER;
  avg_days_to_ghost DECIMAL;
  response_rate DECIMAL;
  calculated_score DECIMAL(5,2);
BEGIN
  SELECT COUNT(*) INTO total_verified_reports
  FROM reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved';

  IF total_verified_reports = 0 THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*) INTO ghosted_reports
  FROM reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved'
    AND created_at < NOW() - INTERVAL '30 days';

  response_rate := 1.0 - (ghosted_reports::DECIMAL / total_verified_reports::DECIMAL);
  calculated_score := (1.0 - response_rate) * 100;

  IF total_verified_reports < 5 THEN
    calculated_score := (calculated_score * 0.5) + (50 * 0.5);
  ELSIF total_verified_reports < 10 THEN
    calculated_score := (calculated_score * 0.7) + (50 * 0.3);
  ELSIF total_verified_reports < 20 THEN
    calculated_score := (calculated_score * 0.85) + (50 * 0.15);
  END IF;

  calculated_score := GREATEST(0, LEAST(100, calculated_score));
  RETURN calculated_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_company_ghost_score(company_uuid UUID)
RETURNS VOID AS $$
DECLARE
  new_score DECIMAL(5,2);
BEGIN
  new_score := calculate_ghost_index_score(company_uuid);
  UPDATE companies
  SET ghost_index_score = new_score,
      updated_at = NOW()
  WHERE id = company_uuid;
END;
$$ LANGUAGE plpgsql;

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
```

Click **"Run"** → Should see "Success. No rows returned"

## Step 3: Run Migration 2 - Auto-Update Triggers

Click **"New Query"** again and paste:

```sql
-- Triggers to automatically update Ghost Index Scores
CREATE OR REPLACE FUNCTION trigger_update_ghost_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_company_ghost_score(NEW.company_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_inserted_update_score
  AFTER INSERT ON reports
  FOR EACH ROW
  WHEN (NEW.is_verified = true AND NEW.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();

CREATE TRIGGER report_updated_update_score
  AFTER UPDATE ON reports
  FOR EACH ROW
  WHEN (
    (NEW.is_verified = true AND NEW.status = 'approved') AND
    (OLD.is_verified != NEW.is_verified OR OLD.status != NEW.status)
  )
  EXECUTE FUNCTION trigger_update_ghost_score();

CREATE TRIGGER report_deleted_update_score
  AFTER DELETE ON reports
  FOR EACH ROW
  WHEN (OLD.is_verified = true AND OLD.status = 'approved')
  EXECUTE FUNCTION trigger_update_ghost_score();
```

Click **"Run"** → Should see "Success. No rows returned"

## Step 4: Verify Migrations

Run this to check everything is installed:

```sql
-- Check functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name LIKE '%ghost%';

-- Check triggers
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_schema = 'public' AND trigger_name LIKE '%score%';
```

Should see 4 functions and 3 triggers.

## Step 5: Test Score Calculation

Recalculate all company scores:

```sql
SELECT * FROM recalculate_all_ghost_scores();
```

This will update all companies with calculated scores based on their verified reports.

---

**Total Time:** ~5 minutes

Let me know when you've completed these steps!
