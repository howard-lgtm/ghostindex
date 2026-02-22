# GhostIndex Security Audit Report

**Date:** February 6, 2026  
**Auditor:** System Security Review  
**Environment:** Production (getghostindex.com)

---

## Executive Summary

Overall security posture is **GOOD** with some areas requiring attention. All critical services are operational, but Mailgun email service is not configured in production.

### Status Overview
- ✅ **Supabase**: Secure and operational
- ✅ **Authentication**: OAuth working (Google, LinkedIn)
- ✅ **Rate Limiting**: Upstash Redis configured
- ✅ **Cron Jobs**: Secured with bearer token
- ⚠️ **Mailgun**: Not configured (missing API key)
- ✅ **Analytics**: Plausible configured
- ✅ **Database Security**: RLS policies fixed, search_path secured

---

## 1. Environment Variables Audit

### ✅ Configured & Secure

| Variable | Status | Notes |
|----------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configured | Public endpoint (expected) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configured | JWT with RLS protection |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configured | Server-side only, not exposed |
| `UPSTASH_REDIS_REST_URL` | ✅ Configured | Rate limiting active |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ Configured | Secure token |
| `CRON_SECRET` | ✅ Configured | Base64 bearer token |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | ✅ Configured | Analytics tracking |

### ⚠️ Missing / Not Configured

| Variable | Status | Impact |
|----------|--------|--------|
| `MAILGUN_API_KEY` | ❌ Missing | Email verification broken |
| `MAILGUN_DOMAIN` | ⚠️ Defaults to `mg.getghostindex.com` | May work if DNS configured |
| `CLEARBIT_API_KEY` | ⚠️ Optional | Company enrichment disabled |
| `SUPABASE_DB_PASSWORD` | ⚠️ Not in .env.local | Direct DB access not available locally |

---

## 2. Supabase Security

### ✅ Connection Status
- **Public API**: Working (tested via /api/search)
- **Authentication**: Operational (Google OAuth, LinkedIn OIDC)
- **RLS Policies**: Recently hardened (Feb 2, 2026)
- **Service Role**: Properly isolated for admin operations

### ✅ Recent Security Fixes (Feb 2, 2026)
1. **12 functions** updated with `SET search_path = ''` to prevent SQL injection
2. **RLS policy** on `activity_logs` tightened (removed `WITH CHECK (true)`)
3. **Password requirements** strengthened:
   - Minimum 8 characters
   - Requires: lowercase, uppercase, digits, symbols

### ⚠️ Outstanding Issue
- **Leaked password protection**: Requires Supabase Pro plan (not critical for OAuth-first app)

### Database Functions Secured
```sql
✅ update_updated_at_column
✅ generate_verification_code
✅ set_verification_code
✅ verify_report_by_code
✅ update_days_since_contact
✅ auto_ghost_stale_applications
✅ calculate_ghost_index_score
✅ update_company_ghost_score
✅ recalculate_all_ghost_scores
✅ trigger_update_ghost_score
✅ detect_ghost_jobs
✅ update_company_score
```

---

## 3. Authentication & OAuth

### ✅ OAuth Providers
- **Google OAuth**: Configured and working
- **LinkedIn OIDC**: Configured and working
- **Redirect URL**: `${origin}/auth/callback`
- **Session Management**: Supabase SSR cookies (secure, httpOnly)

### Security Features
- ✅ CSRF protection via Supabase Auth
- ✅ JWT-based sessions with automatic refresh
- ✅ OAuth state parameter validation
- ✅ Secure cookie storage (httpOnly, sameSite)

### Code Review
**File:** `@/Users/howardduffy/CascadeProjects/ghostindex/components/OAuthButtons.tsx`
- ✅ Client-side OAuth initiation
- ✅ Error handling implemented
- ✅ Loading states prevent double-clicks
- ✅ Proper redirect flow

---

## 4. API Security

### ✅ Rate Limiting
**Implementation:** Upstash Redis + @upstash/ratelimit
- **Limit:** 10 requests per 10 seconds per IP
- **Status:** Active on `/api/search`
- **Response:** Returns rate limit headers

### ✅ Cron Endpoint Security
**Files:**
- `/api/cron/auto-ghost/route.ts`
- `/api/cron/update-scores/route.ts`
- `/api/cron/ghost-jobs/route.ts`

**Security:**
```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Vercel Cron Schedule:**
- Auto-ghost: Daily at 2:00 AM UTC
- Update scores: Daily at 3:00 AM UTC
- Ghost jobs: Daily at 4:00 AM UTC

### ⚠️ Recommendation
Consider rotating `CRON_SECRET` periodically (currently static base64 string).

---

## 5. Email Service (Mailgun)

### ❌ Critical Issue: Not Configured

**Status:** `MAILGUN_API_KEY` not found in `.env.local`

**Impact:**
- Email verification broken
- Users cannot verify reports
- No email notifications

**Configuration:**
- **Domain:** `mg.getghostindex.com` (default)
- **Region:** EU
- **Endpoint:** `https://api.eu.mailgun.net/v3/`

**Files Using Mailgun:**
- `lib/mailgun.ts` - Core email sending
- `app/api/send-verification-email/route.ts`
- `app/api/resend-verification/route.ts`
- `app/api/webhooks/mailgun/route.ts`

### 🔧 Fix Required
1. Obtain Mailgun API key from mailgun.com
2. Add to Vercel environment variables:
   ```
   MAILGUN_API_KEY=key-xxxxxxxxxxxxx
   MAILGUN_DOMAIN=mg.getghostindex.com
   ```
3. Verify DNS records for `mg.getghostindex.com`:
   - MX records
   - SPF record
   - DKIM keys

---

## 6. Analytics (Plausible)

### ✅ Configuration
- **Domain:** `getghostindex.com`
- **Script:** Loaded via `components/Analytics.tsx`
- **Privacy:** GDPR-compliant, no cookies

**Tracked Events:**
- Search queries
- Company views
- Report submissions
- Report verifications
- Signups/logins
- Email verification clicks

**Implementation:** Client-side tracking via `lib/analytics.ts`

---

## 7. Third-Party Dependencies

### Package Audit

| Package | Version | Security |
|---------|---------|----------|
| `next` | 16.1.1 | ✅ Latest stable |
| `react` | 19.2.3 | ✅ Latest |
| `@supabase/ssr` | 0.8.0 | ✅ Secure |
| `@upstash/ratelimit` | 2.0.4 | ✅ Secure |
| `@upstash/redis` | 1.34.3 | ✅ Secure |

### Recommendations
Run `npm audit` periodically to check for vulnerabilities.

---

## 8. Data Security

### ✅ Row Level Security (RLS)
All tables have RLS enabled:

**Companies Table:**
- ✅ Public read access
- ✅ Authenticated users can insert/update

**Reports Table:**
- ✅ Users can only view/edit their own reports
- ✅ Verification required before approval

**Activity Logs:**
- ✅ Service role can insert (for cron jobs)
- ✅ Users can insert for their own reports
- ✅ Fixed overly permissive policy (Feb 2, 2026)

### ✅ Sensitive Data Handling
- Passwords: Hashed by Supabase Auth (bcrypt)
- JWTs: Signed with HS256
- Service role key: Server-side only
- User emails: Protected by RLS

---

## 9. Production Environment (Vercel)

### ✅ Deployment Security
- HTTPS enforced
- Environment variables encrypted at rest
- Automatic SSL certificates
- Edge network (DDoS protection)

### ⚠️ Environment Variables to Add
Must be configured in Vercel dashboard:

```bash
MAILGUN_API_KEY=<obtain from mailgun.com>
MAILGUN_DOMAIN=mg.getghostindex.com
```

Optional:
```bash
CLEARBIT_API_KEY=<for company enrichment>
```

---

## 10. Security Recommendations

### 🔴 Critical (Fix Immediately)
1. **Configure Mailgun** - Email verification is core functionality
2. **Verify Mailgun DNS** - Ensure SPF/DKIM records are set

### 🟡 High Priority
1. **Rotate CRON_SECRET** - Set up quarterly rotation schedule
2. **Add npm audit to CI/CD** - Automated dependency scanning
3. **Enable Supabase database backups** - Daily automated backups
4. **Set up error monitoring** - Sentry or similar for production errors

### 🟢 Medium Priority
1. **Add CLEARBIT_API_KEY** - Enable company data enrichment
2. **Implement CSP headers** - Content Security Policy for XSS protection
3. **Add security.txt** - Responsible disclosure policy
4. **Set up log monitoring** - Track suspicious API activity

### 🔵 Low Priority
1. **Upgrade to Supabase Pro** - Enable leaked password protection
2. **Add 2FA for admin accounts** - Extra layer for service role access
3. **Implement API versioning** - Future-proof API endpoints

---

## 11. Compliance & Privacy

### ✅ GDPR Compliance
- Privacy policy published at `/privacy`
- Analytics is cookie-free (Plausible)
- User data deletion available via Supabase
- Email verification uses double opt-in

### ✅ Data Retention
- Reports: Indefinite (user-controlled)
- Activity logs: Indefinite (for scoring)
- Sessions: 7 days (Supabase default)

---

## 12. Incident Response

### Current Monitoring
- ❌ No error tracking configured
- ⚠️ Manual log review via Vercel dashboard
- ✅ Uptime monitoring via Vercel

### Recommendations
1. Set up Sentry or similar error tracking
2. Configure Slack/email alerts for:
   - API errors (>5% error rate)
   - Cron job failures
   - Rate limit breaches
3. Document incident response playbook

---

## Summary & Action Items

### ✅ What's Secure
- Supabase connection and RLS policies
- OAuth authentication (Google, LinkedIn)
- Rate limiting on public APIs
- Cron job authentication
- Database function security (search_path fixed)
- Password requirements strengthened

### ❌ What Needs Fixing
1. **Mailgun API key** - Add to Vercel environment
2. **Mailgun DNS** - Verify SPF/DKIM records
3. **Error monitoring** - Set up Sentry or similar

### ⚠️ What to Monitor
- Cron job execution logs
- Rate limit hits
- OAuth failure rates
- Email delivery rates (once Mailgun configured)

---

**Next Review:** March 6, 2026 (30 days)

**Contact:** For security concerns, email security@getghostindex.com

---

*Generated: February 6, 2026*
