# Sentry Error Monitoring Setup

Complete guide to setting up Sentry error monitoring for GhostIndex.

---

## Step 1: Create Sentry Account

1. Go to https://sentry.io
2. Sign up for a free account (50k errors/month free)
3. Verify your email address

---

## Step 2: Create New Project

1. Click **"Create Project"**
2. Select platform: **Next.js**
3. Set alert frequency: **On every new issue** (recommended for beta)
4. Project name: `ghostindex`
5. Click **"Create Project"**

---

## Step 3: Get Your DSN

After creating the project, Sentry will show you a **DSN** (Data Source Name).

It looks like:
```
https://abc123def456@o123456.ingest.sentry.io/7890123
```

**Copy this DSN** - you'll need it for environment variables.

---

## Step 4: Get Organization and Project Slugs

1. Go to **Settings** → **General Settings**
2. Find your **Organization Slug** (e.g., `your-username` or `ghostindex-org`)
3. Find your **Project Slug** (should be `ghostindex`)

---

## Step 5: Update Environment Variables

### Local Development (.env.local)

Add these to your `.env.local` file:

```env
# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7890123
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=ghostindex
```

### Vercel Production

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add the three Sentry variables:
   - `NEXT_PUBLIC_SENTRY_DSN` (Production, Preview, Development)
   - `SENTRY_ORG` (Production, Preview, Development)
   - `SENTRY_PROJECT` (Production, Preview, Development)
3. Redeploy: **Deployments** → **...** → **Redeploy**

---

## Step 6: Configure Sentry Auth Token (Optional - for Source Maps)

To upload source maps for better stack traces:

1. Go to Sentry → **Settings** → **Account** → **API** → **Auth Tokens**
2. Click **"Create New Token"**
3. Scopes needed:
   - `project:read`
   - `project:releases`
   - `org:read`
4. Copy the token
5. Add to Vercel as `SENTRY_AUTH_TOKEN` (mark as sensitive)

---

## Step 7: Test Error Monitoring

### Create a Test Error

Add a test button to any page:

```tsx
<button onClick={() => {
  throw new Error("Sentry Test Error");
}}>
  Trigger Test Error
</button>
```

### Verify in Sentry

1. Click the button
2. Go to Sentry dashboard → **Issues**
3. You should see the error appear within seconds
4. Click on the error to see:
   - Stack trace
   - User context
   - Request details
   - Breadcrumbs (user actions leading to error)

---

## What Sentry Monitors

### Automatic Error Tracking

- **Client-side errors** (React component errors, unhandled exceptions)
- **Server-side errors** (API route errors, server component errors)
- **Edge runtime errors** (middleware errors)
- **Unhandled promise rejections**

### Performance Monitoring (Optional)

- Page load times
- API response times
- Database query performance
- Custom transactions

### Session Replay (Enabled)

- Records user sessions when errors occur
- See exactly what the user did before the error
- Privacy-safe (masks sensitive data)

---

## Sentry Features Configured

### ✅ Error Monitoring
- Captures all unhandled errors
- Automatic error grouping
- Email alerts on new issues

### ✅ Session Replay
- 10% of all sessions recorded
- 100% of sessions with errors recorded
- Sensitive data masked automatically

### ✅ Performance Tracking
- 100% in development
- 10% in production (adjust based on traffic)

### ✅ Source Maps
- Uploaded automatically on build
- Better stack traces in production
- Hidden from client bundles

### ✅ Cron Monitoring
- Automatic monitoring of Vercel cron jobs
- Alerts if cron jobs fail

---

## Alert Configuration

### Recommended Alert Settings

1. Go to **Alerts** → **Create Alert**
2. Set up alerts for:

**High Priority:**
- New issues (immediate email)
- Error rate > 5% (within 5 minutes)
- Cron job failures (immediate)

**Medium Priority:**
- Unresolved issues > 24 hours
- Performance degradation > 20%

**Low Priority:**
- Weekly summary of all issues

---

## Privacy & GDPR Compliance

### Data Scrubbing (Enabled)

Sentry automatically scrubs:
- Passwords
- Credit card numbers
- Social security numbers
- API keys

### Additional Privacy Settings

In Sentry dashboard:
1. Go to **Settings** → **Security & Privacy**
2. Enable:
   - ✅ Data Scrubbing
   - ✅ Prevent Storing of IP Addresses
   - ✅ Use Relay for Data Forwarding

### Session Replay Privacy

Configured to:
- Mask all text by default
- Block all media (images, videos)
- Only capture DOM structure and user interactions

---

## Monitoring Best Practices

### 1. Set Up Slack Integration

1. Go to **Settings** → **Integrations** → **Slack**
2. Connect your Slack workspace
3. Configure channel for error notifications

### 2. Create Custom Dashboards

Monitor key metrics:
- Error rate by page
- Most common errors
- User impact (affected users)
- Performance trends

### 3. Regular Review

- **Daily:** Check for new critical errors
- **Weekly:** Review error trends
- **Monthly:** Analyze performance metrics

---

## Troubleshooting

### Errors not appearing in Sentry

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify Sentry is initialized (check browser console)
3. Test with a manual error: `throw new Error("test")`
4. Check browser network tab for Sentry requests

### Source maps not uploading

1. Verify `SENTRY_AUTH_TOKEN` is set in Vercel
2. Check build logs for Sentry upload errors
3. Ensure `SENTRY_ORG` and `SENTRY_PROJECT` match exactly

### Too many errors

1. Adjust sample rates in config files
2. Add error filtering in Sentry dashboard
3. Set up error ignoring for known issues

---

## Cost Optimization

### Free Tier (50k errors/month)
- Suitable for beta and early production
- ~1,600 errors/day
- Unlimited team members

### Team Plan ($26/month)
- 100k errors included
- $0.00045 per additional error
- Advanced features (custom alerts, data retention)

### Monitoring Usage

1. Go to **Stats** in Sentry dashboard
2. Monitor error volume
3. Set up usage alerts at 80% of quota

---

## Integration with Existing Tools

### Vercel Integration

Sentry automatically integrates with:
- Vercel deployments (links errors to commits)
- Vercel cron jobs (monitors execution)
- Vercel preview deployments (separate environments)

### GitHub Integration

1. Go to **Settings** → **Integrations** → **GitHub**
2. Connect your repository
3. Benefits:
   - Link errors to commits
   - Suggested assignees based on code ownership
   - Automatic issue creation

---

## Next Steps After Setup

1. ✅ Deploy to production with Sentry enabled
2. ✅ Monitor for first 24 hours
3. ✅ Set up Slack alerts
4. ✅ Create custom dashboard
5. ✅ Configure alert rules
6. ✅ Test session replay on an error

---

## Support Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Sentry Discord:** https://discord.gg/sentry
- **Status Page:** https://status.sentry.io/

---

Error monitoring is now set up! 🎯

**Next:** Get your Sentry DSN and add it to environment variables.
