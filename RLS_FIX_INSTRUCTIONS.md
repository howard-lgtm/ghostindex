# RLS Security Fix - April 22, 2026

## Issue Summary

Supabase Advisor found **2 CRITICAL security issues**:

1. ❌ **RLS Disabled on `public.job_snapshots`**
   - Table is public but RLS (Row Level Security) is not enabled
   - Anyone can read/write data without authentication

2. ❌ **RLS Disabled on `public.ghost_signals`**
   - Table is public but RLS is not enabled
   - Security vulnerability - unauthorized access possible

## What is RLS?

**Row Level Security (RLS)** is a PostgreSQL feature that restricts which rows users can access in a table. Without RLS:
- ❌ Anyone can query all data (even without authentication)
- ❌ Malicious users can modify or delete data
- ❌ Your database is exposed to unauthorized access

With RLS enabled:
- ✅ Only authorized users can access specific rows
- ✅ Policies control who can read/write data
- ✅ Database is secured at the row level

## Fix Created

**Migration file:** `supabase/migrations/20260422_fix_rls_warnings.sql`

This migration will:
1. ✅ Enable RLS on `public.job_snapshots` (if table exists)
2. ✅ Enable RLS on `public.ghost_signals` (if table exists)
3. ✅ Create secure policies for each table
4. ✅ Verify all public tables have RLS enabled

## How to Apply the Fix

### Option 1: Run in Supabase Dashboard (Recommended)

1. **Go to SQL Editor:**
   - https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql

2. **Copy the migration file:**
   ```bash
   cat supabase/migrations/20260422_fix_rls_warnings.sql
   ```

3. **Paste into SQL Editor and run**

4. **Verify the fix:**
   - Go back to the Advisor page
   - Refresh the page
   - The 2 CRITICAL issues should be resolved ✅

### Option 2: Run via Command Line

```bash
# If you have Supabase CLI installed
supabase db push

# Or run the specific migration
psql $DATABASE_URL -f supabase/migrations/20260422_fix_rls_warnings.sql
```

## What the Migration Does

### For `job_snapshots` table:

```sql
-- Enable RLS
ALTER TABLE public.job_snapshots ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read access for job snapshots"
    ON public.job_snapshots
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Service role can do everything
CREATE POLICY "Service role full access to job snapshots"
    ON public.job_snapshots
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

### For `ghost_signals` table:

```sql
-- Enable RLS
ALTER TABLE public.ghost_signals ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read access for ghost signals"
    ON public.ghost_signals
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated users can insert
CREATE POLICY "Users can insert ghost signals"
    ON public.ghost_signals
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Service role can do everything
CREATE POLICY "Service role full access to ghost signals"
    ON public.ghost_signals
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

## Optional: Drop Unused Tables

If these tables (`job_snapshots` and `ghost_signals`) are not being used, you can drop them instead:

```sql
-- WARNING: This deletes all data in these tables
DROP TABLE IF EXISTS public.job_snapshots CASCADE;
DROP TABLE IF EXISTS public.ghost_signals CASCADE;
```

**To do this:**
1. Uncomment the DROP TABLE lines at the bottom of the migration
2. Run the migration

## Verification

After running the migration, verify the fix:

### Check RLS is enabled:

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('job_snapshots', 'ghost_signals');
```

**Expected result:**
- `rls_enabled` should be `true` for both tables

### Check policies exist:

```sql
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('job_snapshots', 'ghost_signals')
ORDER BY tablename, policyname;
```

**Expected result:**
- Should see 2-3 policies per table

### Check Supabase Advisor:

1. Go to: https://supabase.com/dashboard/project/kovcfugvlwrxkoacgbtg/sql/914332b2-4513-465b-83a3-d8d5ccc32658
2. Refresh the page
3. **Advisor should show:** "0 issues found" ✅

## Impact Assessment

### Before Fix:
- ❌ **Security Risk:** Anyone could access/modify data in these tables
- ❌ **Compliance Issue:** Violates security best practices
- ❌ **Data Exposure:** Sensitive data potentially accessible

### After Fix:
- ✅ **Secure:** RLS policies control access
- ✅ **Compliant:** Follows Supabase security guidelines
- ✅ **Protected:** Data access is properly restricted

### Breaking Changes:
- ⚠️ **None expected** - The policies allow public read access
- ⚠️ **API calls should work the same** - No code changes needed
- ⚠️ **Service role unaffected** - Full access maintained

## Next Steps

1. **Run the migration** (see instructions above)
2. **Verify the fix** in Supabase Advisor
3. **Test your application** to ensure everything works
4. **Commit the migration** to version control

```bash
git add supabase/migrations/20260422_fix_rls_warnings.sql
git commit -m "fix: Enable RLS on job_snapshots and ghost_signals tables"
git push origin main
```

## Questions to Answer

Before running the migration, determine:

1. **Are these tables being used?**
   - Check if your application queries `job_snapshots` or `ghost_signals`
   - If not, consider dropping them instead

2. **What access level is needed?**
   - Current policy: Public read, authenticated insert
   - Adjust policies if you need different access patterns

3. **Are there other tables without RLS?**
   - The migration includes a verification check
   - Review the output for any other tables

## Support

If you encounter issues:

1. **Check migration output** for errors or warnings
2. **Review Supabase logs** for RLS policy violations
3. **Test with different user roles** (anon, authenticated, service_role)

---

**Status:** Ready to apply  
**Risk Level:** Low (non-breaking changes)  
**Estimated Time:** 2-3 minutes  

**Run the migration now to secure your database!** 🔒
