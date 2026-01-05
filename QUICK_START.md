# GhostIndex Quick Start Guide

## 🚀 Get Running in 15 Minutes

### Step 1: Supabase Setup (5 min)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: `ghostindex`
   - Database Password: (save this!)
   - Region: Choose closest to you
   - Wait for project to initialize (~2 min)

2. **Run Database Migrations**
   - In Supabase dashboard, go to **SQL Editor**
   - Click "New Query"
   - Copy/paste contents of `supabase/migrations/20241229_initial_schema.sql`
   - Click "Run"
   - Repeat for `20241229_verification_system.sql`
   - Verify tables created: **Table Editor** should show `companies`, `reports`, etc.

3. **Get API Credentials**
   - Go to **Settings** → **API**
   - Copy **Project URL** and **service_role key**

### Step 2: Environment Setup (2 min)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CRON_SECRET=generate_random_string_here
```

Generate `CRON_SECRET`:
```bash
openssl rand -base64 32
```

### Step 3: Install & Seed (3 min)

```bash
# Install dependencies (if not already done)
npm install

# Seed companies database
npm run seed:companies

# Start dev server
npm run dev
```

Open http://localhost:3000

### Step 4: Create Test Account (2 min)

1. Click "Get Started"
2. Sign up with your email
3. Check email for confirmation link
4. Click link to verify
5. You're in!

### Step 5: Test Basic Flow (3 min)

1. **Submit a Report**
   - Click "Report Ghosting"
   - Enter: Company = "Google", Domain = "google.com", Job = "Software Engineer"
   - Submit

2. **Search Companies**
   - Click "Search Companies"
   - Search for "Google"
   - Should see company (no score yet - needs verified reports)

3. **View Dashboard**
   - Click "Dashboard"
   - See your report (status: pending, not verified)

---

## ✅ You're Running!

**What Works:**
- ✅ User authentication
- ✅ Report submission
- ✅ Company search
- ✅ Dashboard

**What's Next:**
- ⏭️ Set up email verification (Mailgun)
- ⏭️ Deploy to Vercel
- ⏭️ Enable cron jobs
- ⏭️ Test auto-ghost detection

---

## 🔧 Common Issues

### "Supabase connection error"
- Check `.env.local` exists and has correct values
- Verify Supabase project is active (not paused)
- Check URL format: `https://xxxxx.supabase.co` (no trailing slash)

### "Email confirmation not received"
- Check spam folder
- In Supabase: **Authentication** → **Email Templates** → Enable confirmations
- For testing: Disable email confirmation in **Authentication** → **Settings**

### "Companies not showing in search"
- Run seeding script: `npm run seed:companies`
- Check Supabase **Table Editor** → **companies** has data
- Try searching for "Google" or "Meta"

### "Port 3000 already in use"
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 📚 Next Steps

1. **Read Implementation Status**: `IMPLEMENTATION_STATUS.md`
2. **Set Up Email Verification**: `ENV_SETUP.md`
3. **Deploy to Production**: Follow Vercel deployment guide
4. **Review Task Clarifications**: `TASK_CLARIFICATIONS.md`

---

## 🆘 Need Help?

- **Documentation**: Check markdown files in project root
- **Database Issues**: Verify migrations ran successfully in Supabase SQL Editor
- **Auth Issues**: Check Supabase Authentication settings
- **General Issues**: Review browser console and terminal logs
