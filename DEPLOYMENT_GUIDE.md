# GhostIndex Deployment Guide

## Prerequisites

- ✅ Domain purchased: **getghostindex.com**
- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase project configured
- ⏳ Mailgun account (for email verification)

---

## Step 1: Push to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
cd /Users/howardduffy/CascadeProjects/ghostindex

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - GhostIndex MVP"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ghostindex.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `ghostindex`
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Environment Variables

Before deploying, add these environment variables in Vercel:

**Settings → Environment Variables**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kovcfugvlwrxkoacgbtg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cron Security
CRON_SECRET=your_cron_secret_here

# Email (add later when Mailgun is set up)
MAILGUN_WEBHOOK_SIGNING_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=mg.getghostindex.com
```

**Important:** Mark `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` as **sensitive**.

### 2.3 Deploy

Click **"Deploy"** - Vercel will build and deploy your app (~2-3 minutes).

---

## Step 3: Configure Custom Domain

### 3.1 Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Add domain: `getghostindex.com`
3. Add www subdomain: `www.getghostindex.com` (optional)

### 3.2 Configure DNS (Squarespace)

In your Squarespace domain settings, add these DNS records:

**A Record:**
```
Type: A
Host: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME Record (for www):**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Wait 10-60 minutes** for DNS propagation.

### 3.3 Verify Domain

Once DNS propagates, Vercel will automatically issue an SSL certificate.

Visit: https://getghostindex.com - should show your app! 🎉

---

## Step 4: Enable Cron Jobs (Vercel Pro Required)

**Note:** Vercel Cron requires Pro plan ($20/mo). For free tier, skip this or use alternatives.

### 4.1 Upgrade to Vercel Pro (Optional)

1. Go to **Settings** → **Billing**
2. Upgrade to Pro plan

### 4.2 Verify Cron Configuration

The `vercel.json` file already configures cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-ghost",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/update-scores",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/ghost-jobs",
      "schedule": "0 4 * * *"
    }
  ]
}
```

Cron jobs will run automatically:
- **2:00 AM UTC:** Auto-ghost stale applications (30+ days)
- **3:00 AM UTC:** Recalculate Ghost Index Scores
- **4:00 AM UTC:** Detect ghost jobs

### 4.3 Alternative: Manual Cron (Free)

If you don't want to pay for Vercel Pro, use external cron services:

**Option A: Cron-job.org (Free)**
1. Sign up at https://cron-job.org
2. Create 3 jobs pointing to:
   - `https://getghostindex.com/api/cron/auto-ghost`
   - `https://getghostindex.com/api/cron/update-scores`
   - `https://getghostindex.com/api/cron/ghost-jobs`
3. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
4. Set schedules as above

**Option B: GitHub Actions (Free)**
Create `.github/workflows/cron.yml`:

```yaml
name: Cron Jobs
on:
  schedule:
    - cron: '0 2 * * *'  # Auto-ghost
    - cron: '0 3 * * *'  # Update scores
    - cron: '0 4 * * *'  # Ghost jobs

jobs:
  run-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Auto-ghost
        if: github.event.schedule == '0 2 * * *'
        run: |
          curl -X POST https://getghostindex.com/api/cron/auto-ghost \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      
      - name: Update scores
        if: github.event.schedule == '0 3 * * *'
        run: |
          curl -X POST https://getghostindex.com/api/cron/update-scores \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      
      - name: Ghost jobs
        if: github.event.schedule == '0 4 * * *'
        run: |
          curl -X POST https://getghostindex.com/api/cron/ghost-jobs \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## Step 5: Set Up Mailgun (Email Verification)

See `MAILGUN_SETUP.md` for detailed instructions.

**Quick steps:**
1. Sign up at https://mailgun.com
2. Add domain: `mg.getghostindex.com`
3. Configure DNS records in Squarespace
4. Set up inbound routing to webhook
5. Add Mailgun env vars to Vercel

---

## Step 6: Post-Deployment Checklist

- [ ] Visit https://getghostindex.com - app loads
- [ ] Test user signup and login
- [ ] Test company search
- [ ] Test report submission
- [ ] Verify dashboard displays correctly
- [ ] Check legal pages (Terms, Privacy, DMCA)
- [ ] Test on mobile devices
- [ ] Set up monitoring (Vercel Analytics, Sentry)
- [ ] Configure email verification (Mailgun)
- [ ] Test cron jobs (manually trigger endpoints)

---

## Troubleshooting

### Domain not resolving
- Check DNS propagation: https://dnschecker.org
- Verify A record points to 76.76.21.21
- Wait up to 48 hours for full propagation

### Build failures
- Check Vercel build logs
- Verify all environment variables are set
- Check for TypeScript errors locally: `npm run build`

### 500 errors
- Check Vercel function logs
- Verify Supabase connection
- Check environment variables are correct

### Cron jobs not running
- Verify Vercel Pro subscription (or use alternatives)
- Check cron secret is correct
- Manually test endpoints with curl

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Go to project → **Analytics**
- View page views, performance, etc.

### Supabase Monitoring
- Go to Supabase → **Database** → **Logs**
- Monitor queries and errors

### Error Tracking (Optional)
Set up Sentry for error monitoring:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Next Steps

1. **Test everything** on production
2. **Set up email verification** (Mailgun)
3. **Create demo reports** with verified data
4. **Launch marketing:**
   - Post on Hacker News
   - Share on LinkedIn/Twitter
   - Submit to Product Hunt
5. **Build Chrome extension** (Phase 2)
6. **Add analytics** and monitor usage

---

## Cost Breakdown

**Monthly Costs:**
- Domain: ~$1/mo (annual)
- Vercel: $0 (Hobby) or $20 (Pro for cron)
- Supabase: $0 (Free tier, 500MB)
- Mailgun: $0 (Free tier, 1k emails/mo) or $35/mo

**Total: $0-56/month** depending on tier choices

---

## Support

- **Documentation:** Check markdown files in project root
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Mailgun Docs:** https://documentation.mailgun.com

Good luck with your launch! 🚀
