-- Test Ghost Index Score Calculation
-- Run this to test the score calculation functions

-- 1. Test calculate_ghost_index_score for a specific company
SELECT 
  c.name,
  c.domain,
  c.ghost_index_score as current_score,
  calculate_ghost_index_score(c.id) as calculated_score,
  (SELECT COUNT(*) FROM reports WHERE company_id = c.id AND is_verified = true) as verified_reports
FROM companies c
WHERE c.name = 'Apple'
LIMIT 1;

-- 2. Preview what recalculate_all_ghost_scores would do
SELECT 
  c.id,
  c.name,
  c.ghost_index_score as old_score,
  calculate_ghost_index_score(c.id) as new_score,
  (SELECT COUNT(*) FROM reports WHERE company_id = c.id AND is_verified = true AND status = 'approved') as verified_count
FROM companies c
ORDER BY c.name;

-- 3. Actually recalculate all scores (uncomment to run)
-- SELECT * FROM recalculate_all_ghost_scores();

-- 4. Test trigger by inserting a test report (requires valid user_id)
-- Replace 'YOUR_USER_ID_HERE' with an actual user UUID from auth.users
/*
DO $$
DECLARE
  test_company_id UUID;
  test_user_id UUID;
BEGIN
  -- Get a company ID
  SELECT id INTO test_company_id FROM companies WHERE name = 'Apple' LIMIT 1;
  
  -- Get a user ID (you'll need to replace this with a real user)
  -- SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- Insert test report
  -- INSERT INTO reports (user_id, company_id, status, is_verified, job_title)
  -- VALUES (test_user_id, test_company_id, 'approved', true, 'Test Engineer');
  
  RAISE NOTICE 'Test report inserted. Check company ghost_index_score.';
END $$;
*/
