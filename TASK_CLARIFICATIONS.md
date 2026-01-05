# GhostIndex Task List - Q&A Reference

**Date:** January 4, 2026  
**Purpose:** Clarifications on implementation tasks for moving GhostIndex from 40% to MVP-ready

---

## 1. Email Infrastructure Setup - Economic Alternatives

### Question
Are there any more economic alternatives to Postmark for email infrastructure?

### Answer

**Postmark Alternatives (Cheaper/Free Options):**

| Service | Free Tier | Paid Pricing | Inbound Email | Pros/Cons |
|---------|-----------|--------------|---------------|-----------|
| **Postmark** | None | $15/mo (10k emails) | ✅ Yes | Best deliverability, easy parsing |
| **SendGrid** | 100/day free | $20/mo (40k emails) | ✅ Yes (Inbound Parse) | Cheaper, good docs, more complex setup |
| **Mailgun** | 5k/mo free (3 months) | $35/mo after | ✅ Yes (Routes API) | Best free tier, good for MVP |
| **AWS SES** | 62k/mo free (EC2) | $0.10 per 1k | ✅ Yes (via SNS/Lambda) | Cheapest at scale, complex setup |
| **Resend** | 3k/mo free | $20/mo (50k) | ❌ No inbound yet | Modern, simple, but no inbound |

**Recommendation for MVP:**
- **Mailgun** (Free tier for 3 months, then $35/mo)
  - 5,000 emails/month free initially
  - Built-in inbound routing
  - Simpler than AWS SES
  - Good documentation

**Alternative Approach (Zero Cost for Testing):**
- Use **Gmail API** with a dedicated Gmail account
- Poll inbox every 5 minutes via cron
- Parse emails manually
- **Cons:** Less reliable, rate limits, not production-ready
- **Use case:** Testing/prototype only

---

## 2. Webhook API Endpoint - Postmark Signature Verification

### Question
In what context are we implementing postmark signature verification?

### Answer

**What is Postmark Signature Verification?**

When Postmark (or any email service) sends a webhook to your API, they include a **cryptographic signature** to prove the request actually came from them, not a malicious actor.

**Why You Need It:**
```
Without verification:
❌ Attacker sends fake webhook → Creates fake verified reports → Pollutes your data

With verification:
✅ Your API checks signature → Rejects fake requests → Only real emails processed
```

**Implementation Example:**

```typescript
// /app/api/webhooks/postmark/route.ts
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('X-Postmark-Signature');
  
  // Verify signature using your Postmark webhook secret
  const expectedSignature = crypto
    .createHmac('sha256', process.env.POSTMARK_WEBHOOK_SECRET!)
    .update(body)
    .digest('base64');
  
  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Signature valid - process email
  const email = JSON.parse(body);
  // ... parse and store
}
```

**Context:** This is a **security measure** to prevent spam/fraud. Every email service provider (Postmark, SendGrid, Mailgun) has a similar mechanism.

---

## 3. Email Parser Logic - For Users or Companies?

### Question
Is the email parser for users or companies listed in the database?

### Answer

**FOR USERS (Job Seekers)**

**The Flow:**

1. **User applies to a job** at Company X
2. **Company X sends confirmation email** to user: `"Thank you for applying to Software Engineer at Acme Corp"`
3. **User forwards that email** to `verify@ghostindex.com`
4. **Your parser extracts:**
   - `From:` header → `recruiting@acme.com` → Company domain = `acme.com`
   - Email body → "applied on December 29, 2024" → Application date
   - Subject line → "Software Engineer" → Job title
5. **System links email to user's report:**
   - Match by `user_id` (from forwarding email) + `company_domain`
   - Set `is_verified = true` on the report
   - Store parsed data in `email_verifications` table

**Example Email to Parse:**

```
From: recruiting@acme.com
To: john@gmail.com
Subject: Application Received - Software Engineer

Dear John,

Thank you for applying to the Software Engineer position at Acme Corp.
We received your application on December 29, 2024.

Our team will review your resume and contact you within 2 weeks.

Best regards,
Acme Recruiting Team
```

**Parser Output:**
```json
{
  "company_domain": "acme.com",
  "application_date": "2024-12-29",
  "job_title": "Software Engineer",
  "confirmation_type": "application_received",
  "user_id": "uuid-of-john",
  "verification_status": "verified"
}
```

**NOT for companies** - Companies don't use this system. Only job seekers forward their confirmation emails.

---

## 4. Verification UI Updates - Clarification

### Question
Clarify 'Verification' context in the UI updates.

### Answer

**"Verification" has TWO meanings in GhostIndex:**

### A. Email Verification (Primary Context - This is what we're building)

**What it means:** Proving a user actually applied to a company by forwarding the confirmation email.

**UI Elements Needed:**

1. **Verification Status Badge** (on each report in dashboard):
```
┌─────────────────────────────────────┐
│ Acme Corp - Software Engineer       │
│ ✅ Verified via email               │ ← Shows email was parsed
│ 📧 recruiting@acme.com              │ ← Source of verification
│ 📅 Applied: Dec 29, 2024            │ ← Extracted from email
│ ⏱️  30 days since last contact      │ ← Auto-calculated
└─────────────────────────────────────┘
```

2. **"How to Verify" Instructions** (in dashboard):
```
┌─────────────────────────────────────┐
│ 📧 Verify Your Reports              │
│                                     │
│ Forward application confirmation    │
│ emails to:                          │
│                                     │
│ verify@ghostindex.com               │
│                                     │
│ We'll automatically link them to    │
│ your reports and mark as verified.  │
└─────────────────────────────────────┘
```

3. **Activity Timeline** (shows verification history):
```
┌─────────────────────────────────────┐
│ Timeline for Acme Corp Report       │
│                                     │
│ ✅ Dec 29, 2024 - Email verified    │
│    Source: recruiting@acme.com      │
│                                     │
│ 📤 Dec 29, 2024 - Application sent  │
│                                     │
│ ⏰ Jan 28, 2025 - Auto-ghosted      │
│    (30 days no response)            │
└─────────────────────────────────────┘
```

### B. User Account Verification (Secondary - Already Handled)

**What it means:** Confirming user's email address when they sign up (standard auth flow).

**Already handled by Supabase Auth** - not part of this task.

---

## 5. Cron Job Endpoints - Clarification

### Question
Clarify what cron job endpoints are in this context.

### Answer

**What are Cron Jobs in this context?**

**Cron Jobs** = Scheduled tasks that run automatically at set intervals (e.g., daily at 2am).

**Three Cron Jobs Needed:**

### A. Auto-Ghost Detection (`/api/cron/auto-ghost`)
**Runs:** Daily at 2:00 AM UTC  
**Purpose:** Flag reports as "ghosted" if 30+ days since last contact

```typescript
// /app/api/cron/auto-ghost/route.ts
export async function GET(request: Request) {
  // Call Supabase function
  const { data, error } = await supabase.rpc('auto_ghost_stale_applications');
  
  // Log results
  console.log(`Auto-ghosted ${data?.count} applications`);
  
  return Response.json({ success: true, count: data?.count });
}
```

### B. Score Recalculation (`/api/cron/update-scores`)
**Runs:** Daily at 3:00 AM UTC  
**Purpose:** Recalculate Ghost Index Scores for all companies

```typescript
// /app/api/cron/update-scores/route.ts
export async function GET(request: Request) {
  // Get all companies
  const { data: companies } = await supabase.from('companies').select('id');
  
  // Recalculate each score
  for (const company of companies) {
    await supabase.rpc('calculate_ghost_index_score', { 
      company_uuid: company.id 
    });
  }
  
  return Response.json({ success: true });
}
```

### C. Ghost Job Detection (`/api/cron/ghost-jobs`)
**Runs:** Daily at 4:00 AM UTC  
**Purpose:** Flag job postings active 60+ days with low company scores

**Configuration in `vercel.json`:**
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

**Note:** Vercel Cron is **free** on Hobby plan (1 job), **$20/mo** on Pro (unlimited).

---

## 7. Company Database - Does One Exist?

### Question
Does a company database exist, or do we create/harvest/scrape one?

### Answer

**Partially exists, needs completion**

### Current State:

You have a **migration file** at `supabase/migrations/20241229_seed_sp500_tech.sql` that contains SQL to seed S&P 500 tech companies.

**What You Need to Do:**

#### Option A: Run Existing Migration (Quick)
```bash
# In Supabase SQL Editor, run:
# supabase/migrations/20241229_seed_sp500_tech.sql
```
This will populate ~50-100 tech companies from S&P 500.

#### Option B: Build Comprehensive Database (Better)

**Sources to Scrape/Import:**

1. **Fortune 500 Companies** (Free CSV available)
   - Download from: `https://fortune.com/ranking/fortune500/`
   - Parse CSV, extract: name, domain, industry
   - ~500 companies

2. **YC Companies** (Startup focus)
   - Scrape: `https://www.ycombinator.com/companies`
   - API available: `https://api.ycombinator.com/v0.1/companies`
   - ~4,000 startups

3. **Clearbit Logo API** (Company logos)
   - Free tier: 100 requests/month
   - API: `https://logo.clearbit.com/{domain}`
   - Example: `https://logo.clearbit.com/google.com`

4. **Manual Seed (Top 100)**
   - Create CSV with top 100 employers:
     - FAANG (Meta, Apple, Amazon, Netflix, Google)
     - Big Tech (Microsoft, Tesla, Uber, Airbnb)
     - Consulting (McKinsey, BCG, Bain)
     - Finance (Goldman, JPMorgan, Citadel)

**Recommended Approach:**
```typescript
// scripts/seed-companies.ts
const companies = [
  { name: 'Google', domain: 'google.com', logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Meta', domain: 'meta.com', logo: 'https://logo.clearbit.com/meta.com' },
  // ... 100 more
];

for (const company of companies) {
  await supabase.from('companies').upsert(company);
}
```

**Answer:** No complete database exists yet. You need to either:
- Run existing S&P 500 migration (partial)
- Build/scrape a comprehensive list (recommended)

---

## 8. Demo Data - Clarification

### Question
Clarify what demo data is and how to create it.

### Answer

**What is "Demo Data"?**

Fake but realistic reports to populate the platform before real users arrive.

**Why You Need It:**
- Empty platform = no value for first visitors
- Need 50-100 reports to show how it works
- Demonstrates scoring algorithm
- Makes search results useful

**How to Create Demo Data:**

### Option A: Manual Creation (Recommended for MVP)

```typescript
// scripts/seed-demo-reports.ts
const demoReports = [
  {
    user_id: 'demo-user-1',
    company_id: 'google-uuid',
    job_title: 'Software Engineer',
    is_verified: true,
    application_date: '2024-11-15',
    last_contact_date: '2024-11-18', // Responded in 3 days
    status: 'approved',
    auto_ghosted: false
  },
  {
    user_id: 'demo-user-2',
    company_id: 'meta-uuid',
    job_title: 'Product Manager',
    is_verified: true,
    application_date: '2024-10-01',
    last_contact_date: null, // Never responded
    status: 'rejected',
    auto_ghosted: true // Ghosted after 30 days
  },
  // ... 50 more
];
```

### Option B: Use Your Network (Best for Credibility)

Ask friends/colleagues to:
1. Submit real reports (if they were ghosted)
2. Forward actual confirmation emails
3. Get 20-30 real verified reports

**Distribution Strategy:**
- 20 companies with high scores (responsive)
- 20 companies with low scores (ghosters)
- 10 companies with medium scores (mixed)
- Vary dates over last 6 months

---

## 9. Legal Documents - DMCA Explanation

### Question
Does DMCA apply to GhostIndex? How? Explain.

### Answer

**What is DMCA?**

**DMCA** = Digital Millennium Copyright Act (US law)

**Section 512(c)** = "Safe Harbor" protection for platforms hosting user-generated content.

### Does DMCA Apply to GhostIndex?

**YES - Here's Why:**

Your platform hosts **user-generated content** (reports about companies). If a company claims a report is:
- Defamatory
- False information
- Violates their rights

They could sue you **unless** you have DMCA protection.

### How DMCA Protects You:

**Safe Harbor Provisions:**
1. You're not liable for user content **IF** you:
   - Designate a DMCA agent (register with US Copyright Office)
   - Respond to takedown notices within 24-48 hours
   - Remove infringing content when notified
   - Have a repeat infringer policy

### DMCA Takedown Process:

**Step 1: Company sends takedown notice**
```
To: dmca@ghostindex.com

I, [Company Legal], claim that the report at:
https://ghostindex.com/companies/acme.com/report/123

Contains false information that violates our rights.

Signed: [Legal Representative]
```

**Step 2: You respond within 48 hours**
```
Options:
A) Remove the report (if clearly spam/false)
B) Request counter-notice from user
C) Investigate and decide
```

**Step 3: User can file counter-notice**
```
User claims: "My report is true, I have email proof"
→ You restore content after 10 business days
→ Company must sue user directly (not you)
```

### Why This Matters:

**Without DMCA compliance:**
- Company sues you for defamation → You're liable
- Legal fees = $50k-$500k
- Platform shutdown risk

**With DMCA compliance:**
- Company must sue user, not platform
- You're protected as "neutral intermediary"
- Legal risk = minimal

### What You Need to Implement:

1. **DMCA Agent Registration**
   - File with US Copyright Office ($6 fee)
   - Designate email: `dmca@ghostindex.com`

2. **DMCA Policy Page** (`/dmca`)
   ```markdown
   # DMCA Takedown Policy
   
   If you believe content on GhostIndex infringes your rights:
   
   1. Send notice to: dmca@ghostindex.com
   2. Include: URL, description, contact info
   3. We'll respond within 48 hours
   
   Counter-Notice Process: [...]
   ```

3. **Takedown Workflow**
   - Monitor `dmca@ghostindex.com`
   - Review notices manually
   - Remove/flag content as needed
   - Log all actions (legal requirement)

4. **Terms of Service Update**
   ```markdown
   By submitting reports, you agree:
   - Content is truthful and accurate
   - You have evidence to support claims
   - You won't submit false/defamatory content
   
   Repeat offenders will be banned.
   ```

### Alternative: Section 230 (CDA)

**Communications Decency Act Section 230** also protects platforms:
- "No provider shall be treated as the publisher"
- Stronger protection than DMCA
- Applies to all user content (not just copyright)

**Both apply to GhostIndex** - use DMCA process for takedowns, cite Section 230 for general liability protection.

---

## Summary Table

| Question | Answer |
|----------|--------|
| **1. Email alternatives** | Mailgun (5k/mo free), SendGrid ($20/mo), AWS SES (cheapest at scale) |
| **2. Postmark signature** | Security measure to verify webhooks are from Postmark, not attackers |
| **3. Email parser for** | Users (job seekers) forwarding confirmation emails, not companies |
| **4. Verification context** | Email verification (proving user applied), not account verification |
| **5. Cron jobs** | Automated daily tasks: auto-ghost detection, score updates, ghost job flagging |
| **7. Company database** | Partial (S&P 500 migration exists), need to run + expand with Fortune 500/YC |
| **8. Demo data** | 50-100 fake reports to populate platform before real users |
| **9. DMCA** | YES - protects you from liability for user content, required for legal safety |

---

## Next Steps

Proceed with Phase 1 implementation:
1. Email verification system (Mailgun setup)
2. Webhook API endpoint with signature verification
3. Email parser for user-forwarded confirmation emails
4. Verification UI components in dashboard
5. Cron job endpoints for automation
