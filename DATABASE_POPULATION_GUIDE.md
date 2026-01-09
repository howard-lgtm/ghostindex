# Database Population Guide

## How Ghost Index Scores Work

Ghost Index Scores (0-100) are calculated from **verified reports**:
- **0-39**: Low ghosting risk (good companies)
- **40-69**: Moderate ghosting risk
- **70-100**: High ghosting risk (companies that frequently ghost)

## What's Needed for Search Results

For companies to appear in search with data, you need:

### 1. Company Record
```sql
INSERT INTO companies (name, domain) VALUES
  ('Apple', 'apple.com');
```

### 2. Verified Reports (to calculate scores)
Reports must be:
- Submitted by authenticated users
- Verified via email confirmation
- Status: 'approved'
- `is_verified = true`

## Production Workflow

### When Users Submit Reports:
1. User submits report via `/submit` page
2. Company is auto-created if it doesn't exist
3. Report is created with `status = 'pending'`
4. Verification email is sent
5. User verifies via email → `is_verified = true`
6. Ghost Index Score is recalculated

### Current Issue:
Apple shows "No Data" because:
- Company exists in database
- But has **zero verified reports**
- Ghost Index Score is NULL

## Quick Fix Options

### Option 1: Add Sample Data (Testing)
Run `/tools/seed-sample-companies.sql` in Supabase SQL Editor:
```sql
INSERT INTO companies (name, domain, ghost_index_score) VALUES
  ('Apple', 'apple.com', 45.5),
  ('Google', 'google.com', 32.0);
```

### Option 2: Submit Real Reports (Production)
1. Go to `/submit`
2. Submit reports for companies
3. Verify via email
4. Scores will calculate automatically

### Option 3: Bulk Import with Reports
Create companies AND verified reports:
```sql
-- 1. Insert company
INSERT INTO companies (name, domain) VALUES ('Apple', 'apple.com')
RETURNING id;

-- 2. Insert verified reports (need real user_id)
INSERT INTO reports (user_id, company_id, status, is_verified, job_title) VALUES
  ('user-uuid-here', 'company-uuid-here', 'approved', true, 'Software Engineer');
```

## Database Schema Reference

### Companies Table
- `id` (UUID) - Primary key
- `name` (TEXT) - Company name
- `domain` (TEXT) - Unique domain
- `logo` (TEXT) - Optional, auto-fetched via Clearbit
- `ghost_index_score` (DECIMAL) - 0-100, NULL if no verified reports

### Reports Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to auth.users
- `company_id` (UUID) - Foreign key to companies
- `status` (TEXT) - 'pending', 'approved', 'rejected'
- `is_verified` (BOOLEAN) - Email verification status
- `job_title` (TEXT) - Optional job title

## Next Steps

1. **For Testing**: Run `seed-sample-companies.sql` to populate search results
2. **For Production**: Implement ghost index score calculation function
3. **Future**: Add cron job to recalculate scores nightly

## Score Calculation Logic (TODO)

Ghost Index Score should be calculated from:
- Total verified reports
- Percentage of reports marked as "ghosted"
- Time since last contact
- Response rate metrics

Currently manual, needs automated calculation function.
