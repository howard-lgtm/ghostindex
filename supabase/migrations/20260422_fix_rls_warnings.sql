-- Migration: Fix RLS warnings for public tables
-- Date: April 22, 2026
-- Issue: Supabase Advisor found 2 CRITICAL issues - RLS disabled on public tables

-- =============================================================================
-- CRITICAL FIX: Enable RLS on public.job_snapshots
-- =============================================================================

-- Check if table exists and enable RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'job_snapshots'
    ) THEN
        -- Enable RLS
        ALTER TABLE public.job_snapshots ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Public read access for job snapshots" ON public.job_snapshots;
        DROP POLICY IF EXISTS "Service role full access to job snapshots" ON public.job_snapshots;
        
        -- Create read-only policy for public access
        CREATE POLICY "Public read access for job snapshots"
            ON public.job_snapshots
            FOR SELECT
            TO anon, authenticated
            USING (true);
        
        -- Create full access policy for service role
        CREATE POLICY "Service role full access to job snapshots"
            ON public.job_snapshots
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true);
            
        RAISE NOTICE 'RLS enabled on public.job_snapshots';
    ELSE
        RAISE NOTICE 'Table public.job_snapshots does not exist - skipping';
    END IF;
END $$;

-- =============================================================================
-- CRITICAL FIX: Enable RLS on public.ghost_signals
-- =============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'ghost_signals'
    ) THEN
        -- Enable RLS
        ALTER TABLE public.ghost_signals ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Public read access for ghost signals" ON public.ghost_signals;
        DROP POLICY IF EXISTS "Service role full access to ghost signals" ON public.ghost_signals;
        DROP POLICY IF EXISTS "Users can insert ghost signals" ON public.ghost_signals;
        
        -- Create read-only policy for public access
        CREATE POLICY "Public read access for ghost signals"
            ON public.ghost_signals
            FOR SELECT
            TO anon, authenticated
            USING (true);
        
        -- Create insert policy for authenticated users
        CREATE POLICY "Users can insert ghost signals"
            ON public.ghost_signals
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
        
        -- Create full access policy for service role
        CREATE POLICY "Service role full access to ghost signals"
            ON public.ghost_signals
            FOR ALL
            TO service_role
            USING (true)
            WITH CHECK (true);
            
        RAISE NOTICE 'RLS enabled on public.ghost_signals';
    ELSE
        RAISE NOTICE 'Table public.ghost_signals does not exist - skipping';
    END IF;
END $$;

-- =============================================================================
-- VERIFICATION: Check all public tables have RLS enabled
-- =============================================================================

-- This query will show any public tables without RLS enabled
DO $$
DECLARE
    table_record RECORD;
    tables_without_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        -- Check if RLS is enabled
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
            AND c.relname = table_record.tablename
            AND c.relrowsecurity = true
        ) THEN
            tables_without_rls := array_append(tables_without_rls, table_record.tablename);
        END IF;
    END LOOP;
    
    IF array_length(tables_without_rls, 1) > 0 THEN
        RAISE WARNING 'Tables without RLS enabled: %', array_to_string(tables_without_rls, ', ');
    ELSE
        RAISE NOTICE 'All public tables have RLS enabled ✓';
    END IF;
END $$;

-- =============================================================================
-- OPTIONAL: Drop unused tables if they exist
-- =============================================================================

-- Uncomment these lines if you want to drop the tables instead of securing them
-- WARNING: This will delete all data in these tables

-- DROP TABLE IF EXISTS public.job_snapshots CASCADE;
-- DROP TABLE IF EXISTS public.ghost_signals CASCADE;

-- =============================================================================
-- DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.job_snapshots IS 'Job posting snapshots for tracking changes over time. RLS enabled for security.';
COMMENT ON TABLE public.ghost_signals IS 'User-submitted signals about potential ghost jobs. RLS enabled for security.';
