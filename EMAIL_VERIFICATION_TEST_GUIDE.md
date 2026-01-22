# Email Verification Flow - Test Guide

**Date:** January 22, 2026  
**Purpose:** Verify end-to-end email verification functionality

---

## 📋 Overview

The email verification flow has two paths:

### Path 1: Manual Report Submission (What we'll test)
1. User submits report via `/submit` page
2. System sends verification email with unique code
3. User forwards confirmation email to `verify+CODE@mg.getghostindex.com`
4. Mailgun webhook processes the forwarded email
5. Report marked as verified, user receives confirmation

### Path 2: Direct Email Forwarding (Alternative)
1. User forwards application confirmation directly to their GhostIndex email
2. System extracts company domain and creates report automatically
3. Report marked as verified immediately

---

## 🧪 Test Plan - Path 1 (Manual Submission)

### Prerequisites
- [ ] User account created and logged in
- [ ] Access to email inbox for the test user
- [ ] Mailgun webhook configured and working
- [ ] Database access to verify changes

### Step 1: Submit a Test Report

**Action:**
1. Go to https://getghostindex.com/submit
2. Log in if not already logged in
3. Fill out the form:
   - **Company Name:** Test Company Inc
   - **Company Domain:** testcompany.com
   - **Job Title:** Senior Software Engineer
   - **Application Date:** (today's date)
4. Click "Submit Report"

**Expected Result:**
- ✅ Success message appears
- ✅ Report created in database with `is_verified: false`
- ✅ Verification email sent to user's email address
- ✅ Report has a unique `verification_code` generated

**Database Check:**
```sql
SELECT id, company_id, status, is_verified, email_verified, verification_code
FROM reports
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 1;
```

---

### Step 2: Check Verification Email

**Action:**
1. Check the email inbox for the test user
2. Look for email from GhostIndex
3. Verify email content

**Expected Email Content:**
- **Subject:** "Verify Your GhostIndex Report - [Company Name]"
- **From:** noreply@mg.getghostindex.com
- **Body Contains:**
  - Greeting with user's name
  - Company name and job title
  - Instructions to forward confirmation email
  - Verification email address: `verify+[CODE]@mg.getghostindex.com`
  - The unique verification code

**What to Note:**
- Copy the verification email address (verify+CODE@mg.getghostindex.com)
- This is where you'll forward the confirmation email

---

### Step 3: Forward Confirmation Email

**Action:**
1. Find or create a mock application confirmation email
2. Forward it to the verification email address from Step 2
3. The email should contain:
   - Company domain in the sender or body
   - Application details
   - Job title (optional)

**Mock Confirmation Email Example:**
```
From: recruiting@testcompany.com
Subject: Application Received - Senior Software Engineer

Dear Applicant,

Thank you for applying to the Senior Software Engineer position at Test Company Inc.

We have received your application and will review it shortly.

Best regards,
Test Company Recruiting Team
recruiting@testcompany.com
```

**Expected Result:**
- ✅ Email received by Mailgun
- ✅ Webhook triggered
- ✅ Report updated in database

---

### Step 4: Verify Database Updates

**Action:**
Check the database to confirm the report was verified

**Database Checks:**

1. **Check Report Status:**
```sql
SELECT 
  id, 
  status, 
  is_verified, 
  email_verified,
  verification_code,
  updated_at
FROM reports
WHERE verification_code = 'YOUR_CODE'
LIMIT 1;
```

**Expected Values:**
- `is_verified: true`
- `email_verified: true`
- `status: approved`
- `updated_at: [recent timestamp]`

2. **Check Email Verification Record:**
```sql
SELECT 
  id,
  user_id,
  company_domain,
  verification_status,
  email_subject,
  created_at
FROM email_verifications
WHERE report_id = 'YOUR_REPORT_ID'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Values:**
- `verification_status: verified`
- `company_domain: testcompany.com`
- Record exists with email details

3. **Check Activity Log:**
```sql
SELECT 
  id,
  report_id,
  activity_type,
  activity_date,
  email_source
FROM activity_logs
WHERE report_id = 'YOUR_REPORT_ID'
AND activity_type = 'confirmation_received'
ORDER BY activity_date DESC
LIMIT 1;
```

**Expected Values:**
- Activity log entry created
- `activity_type: confirmation_received`
- `email_source: [your email]`

---

### Step 5: Check Confirmation Email

**Action:**
Check the user's email inbox for confirmation

**Expected Email:**
- **Subject:** "Report Verified - [Company Name]"
- **From:** noreply@mg.getghostindex.com
- **Body Contains:**
  - Confirmation that report was verified
  - Company name and job title
  - Link to view the company's Ghost Index Score
  - Thank you message

---

### Step 6: Verify Ghost Index Score Update

**Action:**
1. Go to https://getghostindex.com/companies/testcompany.com
2. Check if the Ghost Index Score has been calculated

**Expected Result:**
- ✅ Company page loads
- ✅ Ghost Index Score displayed (or "Calculating..." if cron hasn't run yet)
- ✅ Report count shows at least 1 verified report

**Note:** Score calculation happens via cron job, so it may take up to 24 hours unless you manually trigger the score update cron.

**Manual Score Update (Optional):**
```bash
npm run test:cron
# Or trigger directly:
curl -X GET https://getghostindex.com/api/cron/update-scores \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## ✅ Success Criteria

All of the following must be true:

- [x] Report submitted successfully via UI
- [x] Verification email received with unique code
- [x] Forwarded email processed by webhook
- [x] Report marked as `is_verified: true` and `email_verified: true`
- [x] Report status changed to `approved`
- [x] Email verification record created
- [x] Activity log entry created
- [x] Confirmation email sent to user
- [x] Company Ghost Index Score updated (after cron runs)

---

## 🐛 Troubleshooting

### Issue: Verification email not received

**Possible Causes:**
1. Mailgun API key not configured
2. Email sending failed (check Vercel logs)
3. Email in spam folder

**Debug Steps:**
```bash
# Check Vercel logs
# Visit: https://vercel.com/howard-duffys-projects/ghostindex/logs
# Look for "send-verification-email" API calls

# Check Mailgun dashboard
# Visit: https://app.eu.mailgun.com/dashboard
# Check "Logs" section for sent emails
```

### Issue: Forwarded email not processed

**Possible Causes:**
1. Mailgun webhook not configured
2. Webhook signature verification failing
3. Email parsing failed

**Debug Steps:**
```bash
# Check Mailgun webhook logs
# Visit: https://app.eu.mailgun.com/app/sending/domains/mg.getghostindex.com/webhooks

# Check Vercel logs for webhook errors
# Look for "/api/webhooks/mailgun" calls

# Test webhook manually
curl -X POST https://getghostindex.com/api/webhooks/mailgun \
  -F "recipient=verify+TESTCODE@mg.getghostindex.com" \
  -F "sender=test@example.com" \
  -F "from=recruiting@testcompany.com" \
  -F "subject=Application Received" \
  -F "body-plain=Thank you for applying to testcompany.com"
```

### Issue: Report not marked as verified

**Possible Causes:**
1. Verification code mismatch
2. Email sender doesn't match report owner
3. Database update failed

**Debug Steps:**
```sql
-- Check report verification code
SELECT id, verification_code, user_id, is_verified
FROM reports
WHERE id = 'YOUR_REPORT_ID';

-- Check user email
SELECT id, email
FROM auth.users
WHERE id = 'YOUR_USER_ID';

-- Check webhook logs in Vercel
```

### Issue: Ghost Index Score not updated

**Possible Causes:**
1. Cron job hasn't run yet
2. Score calculation function error

**Debug Steps:**
```bash
# Manually trigger score update
npm run test:cron

# Or directly:
curl -X GET https://getghostindex.com/api/cron/update-scores \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Check Supabase logs for RPC function errors
```

---

## 📊 Test Results Template

```markdown
## Email Verification Test Results

**Date:** [DATE]
**Tester:** [NAME]
**Test User Email:** [EMAIL]

### Step 1: Submit Report
- [ ] Report submitted successfully
- [ ] Report ID: ___________
- [ ] Verification code: ___________

### Step 2: Verification Email
- [ ] Email received
- [ ] Contains verification address
- [ ] Email content correct

### Step 3: Forward Email
- [ ] Email forwarded to verify+CODE@mg.getghostindex.com
- [ ] Webhook triggered (check logs)

### Step 4: Database Verification
- [ ] Report is_verified: true
- [ ] Report email_verified: true
- [ ] Report status: approved
- [ ] Email verification record created
- [ ] Activity log entry created

### Step 5: Confirmation Email
- [ ] Confirmation email received
- [ ] Email content correct

### Step 6: Score Update
- [ ] Company page accessible
- [ ] Ghost Index Score displayed

### Overall Result
- [ ] ✅ PASS - All steps completed successfully
- [ ] ❌ FAIL - Issues found (see notes below)

### Notes:
[Add any issues, observations, or recommendations]
```

---

## 🔄 Next Steps After Testing

If test passes:
1. ✅ Mark email verification as production-ready
2. Update documentation with any findings
3. Move to next beta task (support infrastructure)

If test fails:
1. Document specific failure points
2. Fix identified issues
3. Re-test until passing
4. Update code and documentation

---

## 📝 Additional Test Scenarios (Optional)

### Scenario 2: Invalid Verification Code
- Forward email to verify+INVALID@mg.getghostindex.com
- Expected: 404 error, report not verified

### Scenario 3: Wrong User Email
- Forward email from different email address
- Expected: 401 error, report not verified

### Scenario 4: Multiple Verifications
- Forward email twice to same verification address
- Expected: Only first one processes, second is idempotent

### Scenario 5: Company Domain Extraction
- Test various email formats to ensure domain extraction works
- Test with different company email patterns

---

**Ready to begin testing!** 🚀
