# Trust-First Verification System

## Overview

GhostIndex now uses a **trust-first verification approach** that removes all friction from report submission while still enabling verification for credibility.

---

## User Flow

### 1. **Submit Report (Instant)**
Users submit reports with minimal information:
- Company name
- Company domain
- Job title (optional)
- Application date (optional)

**Report goes live immediately** - no waiting, no verification required upfront.

### 2. **Verification Email Sent**
After submission, user receives an email with:
- Unique reply-to address: `verify+[CODE]@mg.getghostindex.com`
- Instructions to reply with proof
- Clear explanation of why verification matters

### 3. **User Replies (When Convenient)**
User can verify by replying to the email with:
- **Forwarded confirmation email** (easiest)
- **Screenshot attachment** (mobile-friendly)
- Any proof of application

### 4. **Automatic Verification**
When user replies:
- Mailgun webhook receives email
- System extracts verification code from recipient address
- Matches code to report
- Verifies sender email matches report owner
- Marks report as verified
- Updates Ghost Index Score

---

## Benefits

### For Users
- ✅ **Zero friction** - submit in 30 seconds
- ✅ **Familiar action** - everyone knows how to reply to email
- ✅ **Mobile-friendly** - easier than uploading files
- ✅ **Async verification** - verify whenever convenient
- ✅ **No technical knowledge** - no forwarding addresses to remember

### For Platform
- ✅ **Higher conversion** - no barriers to submission
- ✅ **Better data quality** - verified reports carry more weight
- ✅ **Scalable** - automated verification process
- ✅ **Fraud prevention** - email verification prevents spam
- ✅ **Existing infrastructure** - uses Mailgun already set up

---

## Technical Implementation

### Database Schema
```sql
-- New columns in reports table
ALTER TABLE reports ADD COLUMN verification_code TEXT UNIQUE;
ALTER TABLE reports ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE reports ADD COLUMN proof_image_url TEXT;

-- Auto-generate verification code on insert
CREATE TRIGGER trigger_set_verification_code
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_verification_code();
```

### Email Flow
1. **Report submitted** → Trigger generates unique verification code
2. **API endpoint** `/api/send-verification-email` sends email via Mailgun
3. **Email template** includes reply-to: `verify+[CODE]@mg.getghostindex.com`
4. **User replies** → Email sent to Mailgun
5. **Mailgun webhook** `/api/webhooks/mailgun` receives email
6. **Webhook extracts** verification code from recipient address
7. **System verifies** sender matches report owner
8. **Report updated** to verified status

### Verification Code Format
- 8-character alphanumeric code
- Lowercase for consistency
- Generated via MD5 hash of random value
- Unique constraint in database

### Security
- Verification code is unique per report
- Sender email must match report owner
- Mailgun signature verification on webhook
- Email verification stored for audit trail

---

## Email Template

**Subject:** Verify your GhostIndex report for [Company Name]

**Key Features:**
- Clear call-to-action (reply to this email)
- Two verification options (forward email or attach screenshot)
- Explains benefits of verification
- Beautiful HTML design with fallback text version
- Unique reply-to address per report

---

## Mailgun Configuration

### Inbound Route
- **Expression:** `match_recipient("verify\\+.*@mg.getghostindex.com")`
- **Action:** Forward to webhook
- **Webhook URL:** `https://getghostindex.com/api/webhooks/mailgun`

### Webhook Processing
1. Verify Mailgun signature
2. Extract recipient address
3. Check for verification code pattern: `verify+CODE@`
4. If match, call `handleVerificationReply()`
5. Otherwise, process as regular inbound email

---

## Status Indicators

### Report Badges
- **Pending** (gray) - Not verified
- **Verified** (green) - Email verified
- **Auto-Ghosted** (red) - 30+ days no response

### Ghost Index Score Weighting
- Unverified reports: 50% weight
- Verified reports: 100% weight
- Prevents spam while allowing community reports

---

## Future Enhancements

### Phase 2
- Screenshot upload to Supabase Storage
- Image OCR for automatic data extraction
- Attachment parsing from email replies

### Phase 3
- LinkedIn OAuth integration
- Gmail/Outlook OAuth for inbox scanning
- One-click verification from email list

### Phase 4
- Reputation system (trusted users skip verification)
- Community moderation (flag suspicious reports)
- AI-powered fraud detection

---

## Migration Path

### From Old System
1. Run migration: `20250107_trust_first_verification.sql`
2. Deploy new code with verification email system
3. Update Mailgun inbound route to catch `verify+*` addresses
4. Test verification flow end-to-end
5. Update user-facing documentation

### Backward Compatibility
- Existing reports without verification codes will get codes on next update
- Old verification queue system remains for legacy data
- Gradual migration of unverified reports

---

## Testing Checklist

- [ ] Submit new report → verify email sent
- [ ] Reply to verification email → report marked verified
- [ ] Check verification code uniqueness
- [ ] Test sender email mismatch (should fail)
- [ ] Test invalid verification code (should fail)
- [ ] Verify Ghost Index Score updates after verification
- [ ] Test with forwarded confirmation email
- [ ] Test with screenshot attachment
- [ ] Check activity log created on verification
- [ ] Verify email verification record stored

---

## Monitoring

### Key Metrics
- **Submission rate** - reports submitted per day
- **Verification rate** - % of reports verified
- **Time to verify** - median time from submission to verification
- **Verification method** - forward vs screenshot vs other

### Alerts
- Verification rate drops below 30%
- Verification emails failing to send
- Webhook errors processing replies
- Duplicate verification codes generated

---

## Support

### User FAQs

**Q: Do I have to verify my report?**
A: No! Your report is live immediately. Verification is optional but recommended.

**Q: How do I verify?**
A: Just reply to the verification email we sent you with your application confirmation.

**Q: What if I lost the confirmation email?**
A: You can attach a screenshot of your application portal or any proof you applied.

**Q: How long does verification take?**
A: Instant! As soon as you reply, your report is verified automatically.

**Q: Can I verify later?**
A: Yes! The verification email doesn't expire. Verify whenever convenient.

---

## Success Criteria

### Launch Goals
- 80%+ submission completion rate (vs 40% with old system)
- 50%+ verification rate within 7 days
- <5% support requests about verification
- Zero verification fraud detected

### Long-term Goals
- 90%+ submission completion rate
- 70%+ verification rate
- Verification becomes social proof (users want the badge)
- Community self-moderates unverified reports

---

## Documentation

- **User Guide:** Updated in `VerificationInstructions.tsx`
- **API Docs:** `/api/send-verification-email` and `/api/webhooks/mailgun`
- **Database Schema:** `20250107_trust_first_verification.sql`
- **Email Templates:** `lib/email-templates.ts`
- **Mailgun Utils:** `lib/mailgun.ts`
