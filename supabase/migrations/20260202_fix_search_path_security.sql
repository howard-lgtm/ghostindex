-- Migration: Fix function search_path security warnings
-- All functions must have explicit search_path to prevent injection attacks
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- Drop all functions first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.verify_report_by_code(TEXT);
DROP FUNCTION IF EXISTS public.recalculate_all_ghost_scores();

-- 1. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. generate_verification_code
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  RETURN code;
END;
$$;

-- 3. set_verification_code
CREATE OR REPLACE FUNCTION public.set_verification_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := public.generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$;

-- 4. verify_report_by_code
CREATE OR REPLACE FUNCTION public.verify_report_by_code(p_code TEXT)
RETURNS TABLE(success BOOLEAN, report_id UUID, company_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH updated AS (
    UPDATE public.reports r
    SET 
      is_verified = TRUE,
      status = 'approved',
      updated_at = NOW()
    WHERE r.verification_code = p_code
      AND r.is_verified = FALSE
    RETURNING r.id, r.company_id
  )
  SELECT 
    TRUE as success,
    u.id as report_id,
    c.name as company_name
  FROM updated u
  JOIN public.companies c ON c.id = u.company_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT;
  END IF;
END;
$$;

-- 5. update_days_since_contact
CREATE OR REPLACE FUNCTION public.update_days_since_contact()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.reports
  SET days_since_contact = EXTRACT(DAY FROM (NOW() - COALESCE(last_contact_date, application_date)))::INTEGER
  WHERE application_date IS NOT NULL;
END;
$$;

-- 6. auto_ghost_stale_applications
CREATE OR REPLACE FUNCTION public.auto_ghost_stale_applications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- First update days_since_contact
  PERFORM public.update_days_since_contact();
  
  -- Then mark as ghosted
  UPDATE public.reports
  SET 
    auto_ghosted = TRUE,
    status = 'rejected'
  WHERE 
    is_verified = TRUE
    AND auto_ghosted = FALSE
    AND days_since_contact >= 30
    AND status = 'pending';
    
  -- Log the ghosting activity
  INSERT INTO public.activity_logs (report_id, activity_type, activity_date)
  SELECT 
    id,
    'ghosted',
    NOW()
  FROM public.reports
  WHERE 
    auto_ghosted = TRUE
    AND NOT EXISTS (
      SELECT 1 FROM public.activity_logs 
      WHERE public.activity_logs.report_id = public.reports.id 
      AND public.activity_logs.activity_type = 'ghosted'
    );
END;
$$;

-- 7. calculate_ghost_index_score
CREATE OR REPLACE FUNCTION public.calculate_ghost_index_score(company_uuid UUID)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  total_verified_reports INTEGER;
  ghosted_reports INTEGER;
  avg_days_to_ghost DECIMAL;
  response_rate DECIMAL;
  calculated_score DECIMAL(5,2);
BEGIN
  -- Count total verified reports for this company
  SELECT COUNT(*) INTO total_verified_reports
  FROM public.reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved';

  -- If no verified reports, return NULL
  IF total_verified_reports = 0 THEN
    RETURN NULL;
  END IF;

  -- Count reports marked as ghosted (no response after 30+ days)
  SELECT COUNT(*) INTO ghosted_reports
  FROM public.reports
  WHERE company_id = company_uuid
    AND is_verified = true
    AND status = 'approved'
    AND created_at < NOW() - INTERVAL '30 days';

  -- Calculate ghosting rate (0-1)
  response_rate := 1.0 - (ghosted_reports::DECIMAL / total_verified_reports::DECIMAL);

  -- Base score calculation
  calculated_score := (1.0 - response_rate) * 100;

  -- Apply adjustments based on sample size
  IF total_verified_reports < 5 THEN
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
$$;

-- 8. update_company_ghost_score
CREATE OR REPLACE FUNCTION public.update_company_ghost_score(company_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  new_score DECIMAL(5,2);
BEGIN
  new_score := public.calculate_ghost_index_score(company_uuid);
  
  UPDATE public.companies
  SET ghost_index_score = new_score,
      updated_at = NOW()
  WHERE id = company_uuid;
END;
$$;

-- 9. recalculate_all_ghost_scores
CREATE OR REPLACE FUNCTION public.recalculate_all_ghost_scores()
RETURNS TABLE(company_id UUID, company_name TEXT, old_score DECIMAL(5,2), new_score DECIMAL(5,2))
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH score_updates AS (
    SELECT 
      c.id,
      c.name,
      c.ghost_index_score as old_score,
      public.calculate_ghost_index_score(c.id) as new_score
    FROM public.companies c
  )
  UPDATE public.companies c
  SET ghost_index_score = su.new_score,
      updated_at = NOW()
  FROM score_updates su
  WHERE c.id = su.id
  RETURNING c.id, c.name, su.old_score, su.new_score;
END;
$$;

-- 10. trigger_update_ghost_score
CREATE OR REPLACE FUNCTION public.trigger_update_ghost_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM public.update_company_ghost_score(NEW.company_id);
  RETURN NEW;
END;
$$;

-- 11. detect_ghost_jobs
CREATE OR REPLACE FUNCTION public.detect_ghost_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update days_active for all job postings that have both dates
  UPDATE public.job_postings
  SET days_active = EXTRACT(DAY FROM (last_seen_date - first_seen_date))::INTEGER
  WHERE first_seen_date IS NOT NULL 
    AND last_seen_date IS NOT NULL;
  
  -- Flag ghost jobs
  UPDATE public.job_postings jp
  SET is_ghost_job = TRUE
  FROM public.companies c
  WHERE 
    jp.company_id = c.id
    AND jp.days_active >= 60
    AND c.ghost_index_score < 30
    AND jp.is_ghost_job = FALSE;
END;
$$;

-- 12. update_company_score (trigger function)
CREATE OR REPLACE FUNCTION public.update_company_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Update days_since_contact first
  IF NEW.application_date IS NOT NULL THEN
    NEW.days_since_contact := EXTRACT(DAY FROM (NOW() - COALESCE(NEW.last_contact_date, NEW.application_date)))::INTEGER;
  END IF;
  
  -- Update company score
  UPDATE public.companies
  SET ghost_index_score = public.calculate_ghost_index_score(NEW.company_id)
  WHERE id = NEW.company_id;
  
  RETURN NEW;
END;
$$;

-- Fix RLS policy on activity_logs
-- Drop the overly permissive policy and create a more secure one
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;

-- Create a more secure policy that allows service role to insert
-- This uses SECURITY DEFINER functions for system operations
CREATE POLICY "Service role can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to insert activity logs for their own reports
CREATE POLICY "Users can insert activity logs for own reports"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reports 
      WHERE public.reports.id = report_id 
      AND public.reports.user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON FUNCTION public.update_updated_at_column IS 'Trigger function to auto-update updated_at timestamp. Search path secured.';
COMMENT ON FUNCTION public.generate_verification_code IS 'Generates 8-character verification code. Search path secured.';
COMMENT ON FUNCTION public.set_verification_code IS 'Trigger to set verification code on new reports. Search path secured.';
COMMENT ON FUNCTION public.verify_report_by_code IS 'Verifies a report using verification code. Search path secured.';
COMMENT ON FUNCTION public.calculate_ghost_index_score IS 'Calculates Ghost Index Score (0-100). Search path secured.';
COMMENT ON FUNCTION public.update_company_ghost_score IS 'Updates a company ghost score. Search path secured.';
COMMENT ON FUNCTION public.recalculate_all_ghost_scores IS 'Recalculates all company scores. Search path secured.';
COMMENT ON FUNCTION public.auto_ghost_stale_applications IS 'Auto-ghosts applications after 30 days. Search path secured.';
COMMENT ON FUNCTION public.detect_ghost_jobs IS 'Detects ghost job postings. Search path secured.';
