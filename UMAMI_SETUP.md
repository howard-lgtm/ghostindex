# Umami Analytics Setup Guide

## Overview

GhostIndex now uses **two free analytics solutions**:
1. **Vercel Analytics** (built-in, automatic)
2. **Umami** (self-hosted, privacy-friendly, optional)

---

## Part 1: Vercel Analytics (Already Active!)

### ✅ What's Included
- **100% free** on Hobby plan
- Automatic page view tracking
- Top pages, referrers, devices
- Real-time data
- Privacy-friendly

### How to Access

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **ghostindex**
3. Click **Analytics** tab in the left sidebar
4. Click **Enable Analytics** if not already enabled

**That's it!** Data starts collecting immediately.

### What You'll See
- Page views (real-time and historical)
- Top pages
- Top referrers
- Devices (desktop vs mobile)
- Browsers
- Countries

### Limitations (Free Tier)
- 2,500 events/month
- Basic metrics only (no custom events)
- 7-day data retention

---

## Part 2: Umami Analytics (Self-Hosted, Free)

### Why Add Umami?
- **Unlimited events** (no monthly limits)
- **Custom event tracking** (searches, signups, reports)
- **Privacy-friendly** (GDPR compliant, no cookies)
- **You own the data** (hosted on your Vercel account)
- **Beautiful dashboard**

### Setup Time: ~30 minutes

---

## Step 1: Fork Umami Repository

1. Go to https://github.com/umami-software/umami
2. Click **Fork** (top right)
3. Fork to your GitHub account

---

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your forked `umami` repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`

5. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/umami
   ```

6. Click **Deploy**

---

## Step 3: Set Up Database

### Option A: Use Existing Supabase (Recommended)

1. Go to your Supabase project dashboard
2. Click **Database** → **Connection String**
3. Copy the connection string (format: `postgresql://...`)
4. Add to Vercel Umami deployment as `DATABASE_URL`

### Option B: Use Vercel Postgres (Free Tier)

1. In Vercel project → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Select **Hobby** (free tier)
4. Copy connection string
5. Add to Umami deployment as `DATABASE_URL`

### Option C: Use Supabase Free Tier (Separate Project)

1. Create new Supabase project: https://supabase.com/dashboard
2. Name it `ghostindex-analytics`
3. Get connection string from **Database Settings**
4. Add to Umami deployment

---

## Step 4: Initialize Umami

1. Visit your Umami deployment URL (e.g., `https://ghostindex-analytics.vercel.app`)
2. Default login:
   - **Username:** `admin`
   - **Password:** `umami`
3. **Change password immediately!**
4. Go to **Settings** → **Profile** → Change password

---

## Step 5: Add Your Website

1. In Umami dashboard, click **Settings** → **Websites**
2. Click **Add Website**
3. Fill in:
   - **Name:** GhostIndex
   - **Domain:** getghostindex.com
   - **Enable share URL:** No (keep private)
4. Click **Save**
5. **Copy the Website ID** (you'll need this)

---

## Step 6: Configure GhostIndex

### Add Environment Variables

Add to Vercel (your main GhostIndex project):

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-from-step-5
NEXT_PUBLIC_UMAMI_URL=https://your-umami-deployment.vercel.app
```

**Steps:**
1. Vercel Dashboard → GhostIndex project
2. **Settings** → **Environment Variables**
3. Add both variables to all environments (Production, Preview, Development)
4. **Redeploy** your site

---

## Step 7: Verify Tracking

1. Visit https://getghostindex.com in incognito mode
2. Navigate around (search, view companies)
3. Go to your Umami dashboard
4. Click **Realtime** tab
5. You should see your visit!

---

## What Gets Tracked

### Automatic (Page Views)
- All page views
- Referrers
- Devices, browsers, OS
- Countries
- Page paths

### Custom Events (Already Implemented)
- **Search** - When users search companies
- **Company View** - Company detail page views
- **Report Submit** - Ghosting report submissions
- **Report Verify** - Email verification clicks
- **Signup** - New user registrations
- **Login** - User logins
- **Resend Verification** - Verification email resends
- **Email Verification Click** - Verification link clicks

---

## Accessing Your Analytics

### Vercel Analytics
- **URL:** https://vercel.com/dashboard → Your Project → Analytics
- **Best for:** Quick overview, page views, basic metrics

### Umami Dashboard
- **URL:** Your Umami deployment URL (e.g., `https://ghostindex-analytics.vercel.app`)
- **Best for:** Custom events, detailed tracking, unlimited data

---

## Cost Breakdown

| Service | Plan | Cost | What You Get |
|---------|------|------|--------------|
| **Vercel Analytics** | Hobby | **$0/month** | 2,500 events/month, basic metrics |
| **Umami Hosting** | Vercel Hobby | **$0/month** | Unlimited events, custom tracking |
| **Database** | Supabase Free / Vercel Postgres | **$0/month** | Shared with main app or separate free tier |

**Total: $0/month** 🎉

---

## Comparison: Vercel vs Umami

| Feature | Vercel Analytics | Umami |
|---------|------------------|-------|
| **Cost** | Free (2,500 events/month) | Free (unlimited) |
| **Setup** | Automatic | 30 min setup |
| **Custom Events** | ❌ No | ✅ Yes |
| **Data Retention** | 7 days | Unlimited |
| **Privacy** | ✅ GDPR compliant | ✅ GDPR compliant |
| **Dashboard** | Basic | Advanced |
| **Real-time** | ✅ Yes | ✅ Yes |

**Recommendation:** Use **both**!
- Vercel for quick checks
- Umami for detailed analysis and custom events

---

## Troubleshooting

### Umami not tracking?
1. Check `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set in Vercel
2. Verify Umami deployment is running
3. Check browser console for script errors
4. Ensure you're testing in production (not localhost)

### Database connection errors?
1. Verify `DATABASE_URL` format is correct
2. Check database is accessible (not paused)
3. Ensure SSL mode is correct (add `?sslmode=require` if needed)

### Can't log in to Umami?
1. Default credentials: `admin` / `umami`
2. If changed and forgotten, reset via database
3. Check Umami deployment logs in Vercel

---

## Security Best Practices

1. ✅ **Change default password** immediately
2. ✅ **Don't share Umami URL publicly** (keep dashboard private)
3. ✅ **Use environment variables** (never hardcode IDs)
4. ✅ **Enable 2FA** on Vercel account
5. ✅ **Regularly backup** Umami database

---

## Next Steps

1. ✅ Vercel Analytics enabled (automatic)
2. ⏳ Deploy Umami to Vercel
3. ⏳ Set up database
4. ⏳ Add website to Umami
5. ⏳ Configure environment variables
6. ⏳ Redeploy GhostIndex
7. ⏳ Verify tracking works
8. ⏳ Monitor both dashboards

---

## Support Resources

- **Umami Docs:** https://umami.is/docs
- **Umami GitHub:** https://github.com/umami-software/umami
- **Vercel Analytics Docs:** https://vercel.com/docs/analytics
- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres

---

**Both analytics solutions are now free and privacy-friendly!** 🎉
