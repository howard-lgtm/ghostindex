# Analytics Setup Guide

## Overview

GhostIndex now uses **Plausible Analytics** for privacy-friendly, GDPR-compliant analytics tracking.

## Why Plausible?

- ✅ Privacy-friendly (no cookies, GDPR compliant)
- ✅ Lightweight (< 1KB script)
- ✅ Simple, beautiful dashboard
- ✅ No impact on page performance
- ✅ Open source

## Setup Instructions

### 1. Create Plausible Account

1. Go to [https://plausible.io](https://plausible.io)
2. Sign up for an account (free trial available)
3. Add your domain: `getghostindex.com`

### 2. Environment Variables

Add to your `.env.local` and Vercel environment variables:

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=getghostindex.com
```

### 3. Deploy to Production

The analytics script is already integrated and will automatically load in production.

## Tracked Events

### Automatic Page Views
- All page views are tracked automatically
- No additional code needed

### Custom Events

#### Search Events
- **Event:** `Search`
- **Props:** `query`, `results` (count)
- **Triggered:** When user performs a search

#### Company Views
- **Event:** `Company View`
- **Props:** `domain`
- **Triggered:** When user views a company detail page

#### Report Submissions
- **Event:** `Report Submit`
- **Props:** `domain`
- **Triggered:** When user submits a ghosting report

#### Report Verification
- **Event:** `Report Verify`
- **Props:** `reportId`
- **Triggered:** When user verifies a report via email

#### User Authentication
- **Event:** `Signup`
- **Props:** `method` (email/oauth)
- **Triggered:** When user creates an account

- **Event:** `Login`
- **Props:** `method` (email/oauth)
- **Triggered:** When user logs in

#### Email Actions
- **Event:** `Resend Verification`
- **Triggered:** When user requests verification email resend

- **Event:** `Email Verification Click`
- **Triggered:** When user clicks verification link in email

## Viewing Analytics

### Plausible Dashboard

1. Log in to [https://plausible.io](https://plausible.io)
2. Select `getghostindex.com`
3. View real-time and historical data

### Key Metrics to Monitor

#### User Metrics
- **Unique visitors** - Total unique users
- **Pageviews** - Total page views
- **Bounce rate** - % of single-page sessions
- **Visit duration** - Average time on site

#### Engagement Metrics
- **Top pages** - Most visited pages
- **Entry pages** - Where users land
- **Exit pages** - Where users leave

#### Custom Event Metrics
- **Search** - How many searches performed
- **Company View** - Which companies are viewed most
- **Report Submit** - How many reports submitted
- **Signup** - New user registrations

#### Traffic Sources
- **Direct** - Direct URL visits
- **Referral** - From other websites
- **Social** - From social media
- **Search** - From search engines

## Beta Testing Metrics

### Week 1 Goals
- [ ] 50+ unique visitors
- [ ] 10+ searches performed
- [ ] 5+ report submissions
- [ ] 3+ signups

### Week 2 Goals
- [ ] 100+ unique visitors
- [ ] 25+ searches performed
- [ ] 10+ report submissions
- [ ] 10+ signups

### Month 1 Goals
- [ ] 500+ unique visitors
- [ ] 100+ searches performed
- [ ] 25+ report submissions
- [ ] 50+ signups

## Privacy Compliance

Plausible is fully GDPR, CCPA, and PECR compliant:
- No cookies used
- No personal data collected
- No cross-site tracking
- All data owned by you
- EU-hosted option available

## Cost

- **Free Trial:** 30 days
- **Starter Plan:** $9/month (up to 10k pageviews)
- **Growth Plan:** $19/month (up to 100k pageviews)

For beta phase, the Starter plan should be sufficient.

## Implementation Details

### Files Modified

1. **`components/Analytics.tsx`** - Plausible script loader
2. **`lib/analytics.ts`** - Analytics tracking utilities
3. **`app/layout.tsx`** - Added Analytics component
4. **`app/search/page.tsx`** - Track search events
5. **`app/companies/[domain]/page.tsx`** - Track company views
6. **`app/submit/page.tsx`** - Track report submissions
7. **`app/signup/page.tsx`** - Track signups

### Usage Example

```typescript
import { analytics } from '@/lib/analytics';

// Track a search
analytics.trackSearch('google', 5);

// Track a company view
analytics.trackCompanyView('google.com');

// Track a report submission
analytics.trackReportSubmit('google.com');

// Track a signup
analytics.trackSignup('email');
```

## Next Steps

1. ✅ Analytics code integrated
2. ⏳ Create Plausible account
3. ⏳ Add domain to Plausible
4. ⏳ Set environment variable in Vercel
5. ⏳ Deploy to production
6. ⏳ Verify tracking works
7. ⏳ Monitor beta metrics

## Testing

To test analytics in development:
1. Analytics only loads in production (`NODE_ENV === 'production'`)
2. To test locally, temporarily remove the environment check in `components/Analytics.tsx`
3. Open browser console and check for Plausible script load
4. Perform actions and verify events in Plausible dashboard

## Support

- **Plausible Docs:** https://plausible.io/docs
- **Event Tracking Guide:** https://plausible.io/docs/custom-event-goals
- **API Reference:** https://plausible.io/docs/events-api
