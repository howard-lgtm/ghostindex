# GhostIndex: Business Strategy & Justification

**Domain:** getghostindex.com  
**Created:** January 5, 2026  
**Status:** Pre-Launch MVP

---

## 🎯 Mission Statement

> **"Bring transparency to the job market by holding companies accountable for their hiring practices. Empower job seekers with verified data to make informed decisions about where to apply."**

---

## 💡 The Problem

**Job seekers face a broken hiring process:**
- Companies ghost applicants after interviews with no explanation
- No accountability for bad hiring practices
- Candidates waste time on "ghost jobs" (fake postings that are never filled)
- No transparency into which companies actually respond to applicants
- Hiring process is a black box with no feedback loop

**Current solutions are inadequate:**
- **Glassdoor:** Focuses on employee reviews, not hiring process transparency
- **Blind:** Anonymous but unverified, prone to fake reviews
- **LinkedIn:** Controlled by companies, no adversarial accountability
- **Indeed/ZipRecruiter:** Job boards with no quality control on employer behavior

**Market Size:**
- 150M+ job seekers in US annually
- 70% report being ghosted by employers
- Average job seeker applies to 50+ jobs
- $500B+ recruiting industry

---

## 🚀 The Solution: GhostIndex

**A transparency platform that:**

1. **Tracks company ghosting behavior** through verified, real-world reports
2. **Calculates Ghost Index Scores (0-100)** based on objective data
3. **Empowers job seekers** to avoid companies with poor hiring practices
4. **Incentivizes companies** to improve by making behavior public and searchable

**Key Innovation: Email Verification System**
- Users forward application confirmation emails to `verify@getghostindex.com`
- System automatically parses and verifies reports using email metadata
- Prevents fake/spam reports through domain validation
- Creates trustworthy, defensible, data-driven scores

---

## 📊 Data Collection Strategy

### **Primary Method: Email Verification (Core Innovation)**

**The Flow:**

1. **User submits report** (company, job, date, status)
2. **Report enters "unverified" state** (not counted in scores)
3. **User forwards confirmation email** to `verify@getghostindex.com`
4. **Mailgun receives and forwards** to webhook endpoint
5. **System auto-verifies:**
   - Extracts company domain from `From:` header
   - Validates legitimate company domain (not Gmail/Yahoo)
   - Extracts application date from email body
   - Matches to user's pending report
   - Marks as `is_verified = true`
6. **Verified report counts toward Ghost Index Score**

### **What Gets Collected:**

**From User Submission:**
- Company name and domain
- Job title (optional)
- Application date
- Current status (pending/ghosted/rejected/accepted)
- Optional notes

**From Email Verification:**
- Email sender domain (proves company legitimacy)
- Email subject and body (extracts application details)
- Email timestamp (tracks application timeline)
- Email metadata (headers, routing info for audit trail)

**Tracked Over Time:**
- Last contact date (updated when user forwards follow-ups)
- Days since contact (calculated automatically)
- Auto-ghost detection (after 30 days of no response)
- Activity timeline (application → confirmation → follow-ups → ghosted)

### **Ghost Index Score Calculation:**

**Formula (0-100, higher = worse):**
```
Score = (Ghost Rate × 100) + (Auto-Ghost Penalty × 20) + (Response Bonus × -15)

Where:
- Ghost Rate = (Ghosted Reports / Total Verified Reports)
- Auto-Ghost Penalty = (Auto-Ghosted / Total) - reports that hit 30-day threshold
- Response Bonus = (Responded Reports / Total) - companies that actually reply
```

**Score Interpretation:**
- **0-30:** ✅ Good (responsive, rarely ghosts)
- **30-70:** ⚠️ Moderate (mixed behavior)
- **70-100:** ❌ Poor (frequent ghosting, avoid)

### **Data Quality & Anti-Spam:**

**Email Verification Prevents Fake Reports:**
- Can't verify without legitimate company email
- Blocks spam/fake submissions automatically
- Creates audit trail (emails stored for 90 days)

**Domain Validation:**
- Blocks personal email domains (Gmail, Yahoo, Outlook, etc.)
- Only accepts emails from company domains
- Validates domain exists and is legitimate

**User Accountability:**
- Reports tied to verified user accounts
- Email verification creates paper trail
- Can ban users who submit fake reports
- DMCA process for false claims

**Rate Limiting:**
- Max 5 reports per user per day
- Max 1 verification email per report
- Prevents automated abuse

**Key Point:** Only **verified** data counts toward Ghost Index Scores. Unverified reports are visible to the user but don't affect company scores until email verification is complete.

---

## 🛡️ Legal Protection

**Platform is protected by:**

1. **Section 230 (CDA):** User-generated content immunity
   - Platform not liable for user reports
   - Good faith moderation doesn't remove protection
   - Established legal precedent (Yelp, Glassdoor, Reddit)

2. **DMCA Compliance:** Takedown process for false claims
   - Companies can request removal of false reports
   - Counter-notice process for users
   - Documented procedures in `/dmca` page

3. **Verification Required:** Reduces liability
   - Email verification proves legitimacy
   - Audit trail for all verified reports
   - Can produce evidence if challenged

4. **Terms of Service:** Users agree to accuracy
   - Users certify reports are truthful
   - Agree to verification requirements
   - Accept consequences for false reports

**Companies can:**
- Request DMCA takedown of false reports
- Respond publicly to reports (when B2B features launch)
- Improve scores through better hiring practices
- Contact users who opt-in to communication

---

## 🎯 Core Values

**1. Transparency**
- All scores based on verified, real data
- Methodology publicly documented
- No hidden algorithms or bias
- Open about limitations and data sources

**2. Accountability**
- Companies can't hide bad hiring practices
- Public scores create incentive to improve
- Data-driven, not opinion-based
- Verifiable audit trail for all reports

**3. Fairness**
- Both sides protected (users and companies)
- DMCA process for disputes
- Verification prevents fake reports
- Companies can respond and improve

**4. Privacy**
- User data protected (GDPR/CCPA compliant)
- Reports can be anonymous (email verified but identity hidden)
- Email data stored securely, deleted after 90 days
- No selling of user data

---

## 🚀 Competitive Advantage

### **vs. Glassdoor:**
- ✅ Focused specifically on hiring process, not employment
- ✅ Verified data through email confirmation (not just anonymous reviews)
- ✅ Real-time scoring based on response rates
- ✅ Objective metrics, not subjective opinions

### **vs. Blind:**
- ✅ Public platform (not just for employees)
- ✅ Verified reports (not anonymous speculation)
- ✅ Quantitative scores (not just anecdotes)
- ✅ Accessible to all job seekers

### **vs. LinkedIn:**
- ✅ Adversarial to companies (holds them accountable)
- ✅ Independent platform (not controlled by recruiters)
- ✅ Data-driven transparency (not just networking)
- ✅ Job seeker focused, not employer focused

### **Unique Value Proposition:**
- **Only platform** with verified, email-based ghosting data
- **Only platform** with quantitative Ghost Index Scores
- **Only platform** focused exclusively on hiring transparency
- **Only platform** with auto-ghost detection (30-day threshold)

---

## 💰 Monetization Strategy

### **Phase 1 (Months 1-6): 100% Free**
- **Goal:** Build network effects and credibility
- **Focus:** User growth, data collection, platform stability
- **Revenue:** $0
- **Cost:** ~$500/month (Vercel, Supabase, Mailgun free tiers)

### **Phase 2 (Months 7-12): Freemium Model**

**Free Tier (Always):**
- ✅ Search companies and view Ghost Index Scores
- ✅ Submit unlimited reports
- ✅ Email verification
- ✅ View your own reports and timeline
- ✅ Basic company profiles

**Premium Tier ($9.99/month or $99/year):**
- ⭐ Advanced search filters (industry, location, size)
- ⭐ Email alerts for companies you're tracking
- ⭐ Chrome extension with auto-detection
- ⭐ Detailed analytics and trends
- ⭐ Export data and reports
- ⭐ Priority support

**Revenue Projection:**
- 100,000 users × 5% conversion = 5,000 premium
- 5,000 × $9.99/month = **$50,000/month**

### **Phase 3 (Year 2+): B2B Revenue**

**Company Profiles:**

**Basic ($99/month):**
- Claim company profile
- Respond publicly to reports
- Add company statement
- View analytics dashboard
- Contact users who opt-in

**Pro ($299/month):**
- Everything in Basic
- Dispute resolution tools
- Priority DMCA review
- Verified company badge
- API access to own data

**Enterprise ($499/month):**
- Everything in Pro
- Dedicated account manager
- ATS integration
- Bulk report management
- White-label reports

**Revenue Projection:**
- 100 companies @ $99 = $9,900/month
- 50 companies @ $299 = $14,950/month
- 10 companies @ $499 = $4,990/month
- **Total: ~$30,000/month**

**API Access (Job Boards & Recruiters):**

**Starter ($299/month):**
- 10,000 API calls/month
- Basic Ghost Index Score data
- Company lookup by domain

**Professional ($999/month):**
- 100,000 API calls/month
- Full report data (anonymized)
- Real-time score updates
- Webhook notifications

**Enterprise (Custom):**
- Unlimited API calls
- White-label integration
- Dedicated infrastructure
- SLA guarantees

**Use Cases:**
- Indeed/LinkedIn show Ghost Index on job postings
- Recruiters check company reputation
- Career coaches advise clients
- ATS providers integrate transparency data

**Revenue Projection:**
- 10 job boards @ $999 = $9,990/month
- 5 enterprise @ $2,500 = $12,500/month
- **Total: ~$22,500/month**

### **Total Revenue Projection (Year 2-3):**

| Revenue Stream | Monthly | Annual |
|----------------|---------|--------|
| Premium Users | $50,000 | $600,000 |
| Company Profiles | $30,000 | $360,000 |
| API Access | $22,500 | $270,000 |
| **Total** | **$102,500** | **$1,230,000** |

### **Why NOT Sponsorships:**

**Rejected: Company Sponsorships**
- ❌ Conflicts with mission (transparency)
- ❌ Credibility damage ("Are scores influenced?")
- ❌ User trust erosion
- ❌ Legal risk (could lose Section 230 protection)

**Acceptable: Non-Conflicting Sponsors**
- ✅ Job boards (not individual companies)
- ✅ Career services (resume writing, coaching)
- ✅ Clearly labeled, no influence on scores

---

## 📈 Growth Strategy

### **Year 1: Build Network (Free)**
- **Goal:** 100,000 users, 50,000 verified reports, 1,000 companies scored
- **Tactics:**
  - Launch on Hacker News, Product Hunt
  - Share on LinkedIn, Twitter, Reddit (r/jobs, r/cscareerquestions)
  - PR outreach to tech media (TechCrunch, The Verge)
  - Word-of-mouth from frustrated job seekers
  - SEO optimization for "company ghosting" searches
- **Metrics:** User signups, verified reports, search volume

### **Year 2: Monetize & Scale**
- **Goal:** 500,000 users, 5% premium conversion, 200 paying companies
- **Tactics:**
  - Launch Chrome extension
  - Premium features rollout
  - Company profile outreach
  - API partnerships with job boards
  - Content marketing (blog, guides, reports)
- **Metrics:** Premium conversions, B2B revenue, API partnerships

### **Year 3: Expand & Dominate**
- **Goal:** 2M users, 10,000 premium, 500 paying companies, 20 API partners
- **Tactics:**
  - International expansion
  - Mobile app launch
  - Industry-specific features
  - Enterprise sales team
  - Media coverage of "worst ghosters" lists
- **Metrics:** Market share, revenue growth, brand recognition

---

## 🎯 Success Metrics

### **Phase 1 (Months 1-3):**
- ✅ 1,000 verified reports
- ✅ 500 companies scored
- ✅ 10,000 monthly searches
- ✅ Featured on Hacker News front page

### **Phase 2 (Months 4-6):**
- ✅ 10,000 verified reports
- ✅ 2,000 companies scored
- ✅ 50,000 monthly searches
- ✅ Chrome extension launched

### **Phase 3 (Months 7-12):**
- ✅ 100,000 verified reports
- ✅ 10,000 companies scored
- ✅ 500,000 monthly searches
- ✅ First company responds to improve score
- ✅ Media coverage (TechCrunch, etc.)
- ✅ Monetization begins

### **Long-term (Year 2-3):**
- ✅ 1M+ verified reports
- ✅ 50,000+ companies scored
- ✅ 5M+ monthly searches
- ✅ $1M+ ARR
- ✅ Industry standard for hiring transparency

---

## 🔥 Why This Will Work

### **1. Network Effects**
- More users → More data → Better scores → More users
- Companies with good practices get rewarded with visibility
- Bad actors get exposed naturally through data
- Viral loop: Job seekers share bad experiences

### **2. Verification = Trust**
- Email forwarding is easy (one click in Gmail/Outlook)
- Prevents spam/fake reports automatically
- Creates credible, defensible data
- Legal protection through audit trail

### **3. Timing is Perfect**
- **Remote work explosion** → More applications, more ghosting
- **Tight job market** → Companies can ghost without consequences
- **Transparency trend** → Salary transparency laws, Glassdoor success
- **Tech adoption** → Everyone uses email, forwarding is trivial
- **Frustration peak** → Job seekers are fed up, ready for solution

### **4. Viral Potential**
- Job seekers naturally share bad experiences
- "Worst ghosters" lists will get media coverage
- Companies will want to improve scores publicly
- Chrome extension makes it frictionless

### **5. Monetization Aligned with Mission**
- Freemium keeps core features free
- Premium features add value without bias
- B2B revenue from companies wanting to improve
- No conflicts of interest

---

## 🎪 Target Audience

### **Primary: Job Seekers**
- Tech workers (initial focus - highest engagement)
- Recent grads (most frustrated by ghosting)
- Career changers (need transparency)
- Anyone frustrated with hiring process

**Psychographics:**
- Data-driven decision makers
- Frustrated with lack of feedback
- Want to avoid wasting time
- Value transparency and accountability

### **Secondary: Companies**
- Want to improve hiring reputation
- Compete for talent in tight market
- Demonstrate responsiveness
- Differentiate from competitors

### **Tertiary: Recruiters & Job Boards**
- Want to provide better data to candidates
- Differentiate their platform
- Help candidates make informed decisions
- Improve placement success rates

---

## 🛠️ Technical Stack

**Frontend:**
- Next.js 16 + React 19 (modern, fast, SEO-friendly)
- TailwindCSS (beautiful, responsive UI)
- TypeScript (type safety, maintainability)

**Backend:**
- Supabase (PostgreSQL, auth, real-time, free tier)
- Row Level Security (data protection)
- PostgreSQL functions (score calculation, auto-ghost)

**Email:**
- Mailgun (inbound email parsing, free tier 1k emails/month)
- Webhook signature verification (security)
- Email storage for audit trail (90 days)

**Deployment:**
- Vercel (free tier, automatic deployments)
- Custom domain: getghostindex.com
- SSL, CDN, edge functions included

**Monitoring:**
- Vercel Analytics (built-in)
- Supabase logs (database monitoring)
- Sentry (optional, error tracking)

**Cost:**
- **Free tier:** $0/month (Vercel + Supabase + Mailgun free tiers)
- **Scaled:** $50-500/month depending on usage
- **Highly scalable** to millions of users

---

## 🚧 Risks & Mitigations

### **Risk 1: Network Effects (Need Critical Mass)**
- **Mitigation:** Start with tech companies (engaged audience)
- **Mitigation:** Viral potential through shared frustration
- **Mitigation:** Pre-seed with 73 top companies

### **Risk 2: Legal Challenges**
- **Mitigation:** Section 230 protection (established precedent)
- **Mitigation:** DMCA compliance (takedown process)
- **Mitigation:** Email verification (audit trail)
- **Mitigation:** Terms of Service (user accountability)

### **Risk 3: Fake Reports / Gaming**
- **Mitigation:** Email verification required for score impact
- **Mitigation:** Domain validation (no Gmail/Yahoo)
- **Mitigation:** Rate limiting (5 reports/day max)
- **Mitigation:** User bans for abuse

### **Risk 4: Company Pushback**
- **Mitigation:** DMCA process for false reports
- **Mitigation:** B2B features let companies respond
- **Mitigation:** Scores based on objective data
- **Mitigation:** Legal precedent (Glassdoor, Yelp survived)

### **Risk 5: Slow Growth**
- **Mitigation:** Low cost structure (can run on $0/month)
- **Mitigation:** Viral potential (frustrated job seekers share)
- **Mitigation:** SEO optimization (rank for "company ghosting")
- **Mitigation:** Chrome extension (frictionless adoption)

---

## 📊 Competitive Analysis

| Feature | GhostIndex | Glassdoor | Blind | LinkedIn |
|---------|-----------|-----------|-------|----------|
| **Focus** | Hiring process | Employment | Tech workers | Networking |
| **Verification** | Email required | None | Employment only | None |
| **Quantitative Scores** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Hiring Transparency** | ✅ Core focus | ⚠️ Secondary | ⚠️ Anecdotal | ❌ No |
| **Public Access** | ✅ Yes | ✅ Yes | ❌ Employees only | ✅ Yes |
| **Adversarial** | ✅ Yes | ⚠️ Neutral | ✅ Yes | ❌ No |
| **Data Quality** | ✅ Verified | ⚠️ Unverified | ⚠️ Unverified | ❌ N/A |

**Unique Position:** Only platform with verified, quantitative hiring transparency data.

---

## 🎯 Next Steps

### **Immediate (Week 1):**
1. ✅ MVP complete and tested locally
2. ⏳ Deploy to Vercel with custom domain
3. ⏳ Configure Mailgun for email verification
4. ⏳ Test full verification flow end-to-end
5. ⏳ Soft launch to friends/network

### **Short-term (Weeks 2-4):**
1. Launch on Hacker News
2. Post on Reddit (r/jobs, r/cscareerquestions)
3. Share on LinkedIn/Twitter
4. Collect first 100 verified reports
5. Iterate based on feedback

### **Medium-term (Months 2-6):**
1. Build Chrome extension
2. Add more companies to database
3. Improve email parsing logic
4. Add analytics and trends
5. Reach 10,000 users

### **Long-term (Year 1+):**
1. Launch premium features
2. Company profile outreach
3. API partnerships with job boards
4. Mobile app development
5. International expansion

---

## 💭 Final Assessment

**Viability: 8/10**
- Strong problem-market fit (70% of job seekers ghosted)
- Unique verification approach (email forwarding)
- Clear monetization path (freemium + B2B)
- Legal protection in place (Section 230, DMCA)

**Execution: 9/10**
- Clean, modern codebase
- Scalable tech stack
- Well-documented
- Ready to deploy

**Risk: Low-Medium**
- Main risk: Network effects (need critical mass)
- Mitigation: Start with tech, viral potential
- Legal risk: Low (established precedent)
- Technical risk: Low (proven stack)

**Recommendation: LAUNCH IT** 🚀

The worst case is you learn a ton about building a SaaS platform, email verification systems, and marketplace dynamics. The best case is you solve a real problem for millions of job seekers and build a valuable, defensible business.

---

**Next:** Follow `DEPLOYMENT_GUIDE.md` to deploy to production.
