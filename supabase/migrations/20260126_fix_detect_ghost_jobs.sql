-- Fix detect_ghost_jobs function to include WHERE clause
-- The original function failed with "UPDATE requires a WHERE clause" due to RLS

CREATE OR REPLACE FUNCTION detect_ghost_jobs()
RETURNS void AS $$
BEGIN
  -- Update days_active for all job postings that have both dates
  UPDATE job_postings
  SET days_active = EXTRACT(DAY FROM (last_seen_date - first_seen_date))::INTEGER
  WHERE first_seen_date IS NOT NULL 
    AND last_seen_date IS NOT NULL;
  
  -- Flag ghost jobs (jobs open 60+ days at companies with good scores)
  UPDATE job_postings jp
  SET is_ghost_job = TRUE
  FROM companies c
  WHERE 
    jp.company_id = c.id
    AND jp.days_active >= 60
    AND c.ghost_index_score < 30
    AND jp.is_ghost_job = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION detect_ghost_jobs IS 'Detects ghost job postings - jobs that stay open 60+ days at companies with low ghost scores';
