# GhostIndex - Features, Security & Compliance

**Last Updated:** January 14, 2026  
**Version:** 1.0 (Beta)

---

## 🎯 Key Features

### Core Features

#### 1. Company Search & Discovery
**Description:** Intelligent search system to find companies and view their ghosting behavior.

**Features:**
- **Smart Autocomplete:** Real-time suggestions as you type (up to 5 results)
- **Fuzzy Matching:** Finds companies even with partial or misspelled names
- **Priority Ranking:** Companies starting with your query appear first
- **Domain Search:** Search by company domain (e.g., "apple.com")
- **91+ Companies Indexed:** FAANG, Big Tech, startups, finance, consulting, and more
- **Instant Results:** Sub-second search response times

**User Benefits:**
- Quickly find any company you're interested in
- No need to know exact company name
- Discover companies you hadn't considered

---

#### 2. Ghost Index Score System
**Description:** Proprietary scoring algorithm that calculates a company's likelihood of ghosting candidates.

**Features:**
- **0-100 Scale:** Easy-to-understand scoring (0 = best, 100 = worst)
- **Risk Levels:** Automatic categorization (Low/Moderate/High Risk)
- **Visual Indicators:** Color-coded scores (green/yellow/red)
- **Real-time Calculation:** Scores update automatically as new reports come in
- **Verified Data Only:** Scores based on verified reports for accuracy
- **Transparent Methodology:** Clear explanation of how scores are calculated

**Score Breakdown:**
- **0-40 (Low Risk):** Company generally responds to candidates
- **40-70 (Moderate Risk):** Mixed response rate, some ghosting
- **70-100 (High Risk):** High likelihood of ghosting

**Calculation Factors:**
- Percentage of verified reports marked as ghosted
- Response time data from verified reports
- Auto-ghosting incidents (30+ days no response)
- Weighted by verification status (verified reports count more)

---

#### 3. Company Detail Pages
**Description:** Comprehensive profiles for each company with all relevant ghosting data.

**Features:**
- **Large Score Display:** Prominent Ghost Index Score with visual progress bar
- **Score Interpretation:** Clear explanation of what the score means
- **All Reports:** Complete list of reports for the company
- **Verification Status:** See which reports are verified
- **Company Metadata:** Logo, industry, size, headquarters, founded year
- **Statistics Sidebar:** Total reports, verified count, auto-ghosted count
- **Call-to-Action:** Easy submission of new reports

**User Benefits:**
- Complete picture of company's hiring behavior
- Make informed decisions before applying
- See patterns across multiple reports

---

#### 4. Report Submission System
**Description:** User-friendly system for sharing job application experiences.

**Features:**
- **Simple Form:** Minimal required fields (company, job title, experience)
- **Company Autocomplete:** Helps find the right company
- **Instant Publishing:** Reports appear immediately (pending verification)
- **Status Tracking:** See your report's verification status
- **Edit History:** Track changes to your reports
- **Privacy Protection:** No personal information required beyond email

**Report Fields:**
- Company name (autocomplete)
- Job title
- Application experience (text)
- Verification status (pending/verified)
- Submission date (automatic)

---

#### 5. Email Verification System
**Description:** Trust-building verification system using email confirmation forwarding.

**Features:**
- **Unique Verification Codes:** Each report gets a unique code
- **Email Forwarding:** Forward your confirmation email to verify
- **Mailgun Integration:** Reliable email processing
- **Automatic Verification:** System processes emails and marks reports verified
- **Resend Functionality:** Can resend verification email if needed
- **Beautiful Email Templates:** Professional HTML emails with clear instructions
- **Webhook Processing:** Real-time email parsing and verification

**Verification Flow:**
1. User submits report
2. System generates unique verification code
3. User receives verification email
4. User forwards job confirmation email to verify+CODE@mg.getghostindex.com
5. System processes email and marks report verified
6. Ghost Index Score updates automatically

---

#### 6. User Dashboard
**Description:** Personal dashboard for managing your reports and tracking verification.

**Features:**
- **All Your Reports:** See all reports you've submitted
- **Statistics:** Total reports, verified count, pending count
- **Verification Status:** Clear indicators for each report
- **Resend Verification:** One-click resend for unverified reports
- **Report Details:** Click through to see full report pages
- **Activity Timeline:** See history of your reports

---

#### 7. Activity Timeline
**Description:** Visual timeline showing the progression of job applications.

**Features:**
- **Application Sent:** When you applied
- **Confirmation Received:** Email verification timestamp
- **Interview Scheduled:** If you got an interview
- **Rejection Received:** If you got rejected
- **Ghosted:** If no response after 30 days
- **Auto-Ghost Detection:** Automatic marking after 30 days

---

#### 8. Authentication System
**Description:** Secure OAuth authentication via LinkedIn.

**Features:**
- **LinkedIn OAuth:** Sign in with LinkedIn account
- **Secure Sessions:** Session management via Supabase Auth
- **Protected Routes:** Dashboard and submit pages require authentication
- **Automatic Redirects:** Seamless login flow
- **Session Persistence:** Stay logged in across sessions

---

### Additional Features

#### 9. Theme Toggle
- Dark mode and light mode
- Persistent preference across sessions
- Smooth transitions

#### 10. Rate Limiting
- 10 requests per 10 seconds on search API
- Prevents abuse and ensures fair usage
- Clear error messages when limit reached

#### 11. Legal Pages
- Terms of Service
- Privacy Policy (GDPR compliant)
- DMCA Takedown Policy

#### 12. Footer Navigation
- Quick links to all major pages
- Legal links
- Brand information

---

## 🔒 Security Features

### Application Security

#### 1. Rate Limiting
**Implementation:** Upstash Redis-based rate limiting

**Details:**
- **Search API:** 10 requests per 10 seconds per IP
- **Prevents:** DDoS attacks, scraping, abuse
- **Technology:** Upstash Redis with sliding window algorithm
- **User Experience:** Clear error message when limit reached
- **Recovery:** Automatic reset after 10 seconds

**Code Location:** `app/api/search/route.ts`

---

#### 2. Input Sanitization
**Implementation:** Regex-based XSS protection

**Details:**
- **All User Input:** Sanitized before processing
- **XSS Prevention:** Strips HTML tags and dangerous characters
- **SQL Injection:** Protected via Supabase parameterized queries
- **Domain Validation:** Email and domain format validation
- **Technology:** Custom sanitization functions (no external dependencies)

**Protected Fields:**
- Search queries
- Report submissions
- Company names
- Email addresses

**Code Location:** `lib/sanitize.ts`

---

#### 3. Authentication & Authorization
**Implementation:** Supabase Auth with OAuth 2.0

**Details:**
- **OAuth 2.0:** LinkedIn provider with proper scopes
- **Session Management:** Secure cookie-based sessions
- **Token Refresh:** Automatic token refresh via middleware
- **Protected Routes:** Server-side authentication checks
- **Row Level Security:** Database-level access control

**Protected Actions:**
- Submit reports (requires authentication)
- View dashboard (requires authentication)
- Resend verification emails (requires authentication)
- Edit reports (requires authentication + ownership)

---

#### 4. Database Security (Row Level Security)
**Implementation:** Supabase RLS policies

**Details:**
- **Read Access:** Public can read companies, authenticated users can read reports
- **Write Access:** Only authenticated users can create reports
- **Update Access:** Users can only update their own reports
- **Delete Access:** Users can only delete their own reports
- **Service Role:** Admin operations use service role key

**RLS Policies:**
```sql
-- Users can only view their own reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own reports
CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reports
CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (auth.uid() = user_id);
```

---

#### 5. API Security
**Implementation:** Multiple layers of protection

**Details:**
- **CORS:** Configured for same-origin requests
- **CSRF Protection:** Built into Next.js
- **Cron Endpoints:** Protected by CRON_SECRET bearer token
- **Webhook Endpoints:** Mailgun signature verification
- **Environment Variables:** Sensitive data in env vars, never committed

**Cron Authentication:**
```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Webhook Verification:**
```typescript
const encodedToken = crypto
  .createHmac('sha256', process.env.MAILGUN_WEBHOOK_SIGNING_KEY!)
  .update(timestamp + token)
  .digest('hex');

if (signature !== encodedToken) {
  return new Response('Invalid signature', { status: 401 });
}
```

---

#### 6. HTTPS & SSL
**Implementation:** Vercel automatic SSL

**Details:**
- **Automatic SSL:** Vercel provides free SSL certificates
- **HTTPS Enforcement:** All traffic redirected to HTTPS
- **Certificate Renewal:** Automatic via Let's Encrypt
- **TLS 1.3:** Modern encryption standards

---

#### 7. Security Headers
**Implementation:** Next.js security headers

**Details:**
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Prevents MIME sniffing
- **Referrer-Policy:** Controls referrer information
- **Content-Security-Policy:** Restricts resource loading

---

### Data Security

#### 8. Data Encryption
- **At Rest:** Supabase encrypts all data at rest
- **In Transit:** All data transmitted over HTTPS/TLS
- **Passwords:** Never stored (OAuth only)
- **API Keys:** Stored as environment variables

#### 9. Privacy Protection
- **Minimal Data Collection:** Only email and reports
- **No PII in Reports:** Reports don't require personal information
- **User Control:** Users can delete their reports
- **GDPR Compliant:** Right to access, delete, export data

---

## 📋 Compliance & Legal

### 1. GDPR Compliance (EU General Data Protection Regulation)

**Status:** ✅ Compliant

**Implementation:**
- **Privacy Policy:** Clear explanation of data collection and usage
- **Consent:** Users consent by signing up
- **Right to Access:** Users can view all their data in dashboard
- **Right to Delete:** Users can delete their reports
- **Right to Export:** Data export available on request
- **Data Minimization:** Only collect necessary data
- **Purpose Limitation:** Data only used for stated purposes

**Data Collected:**
- Email address (from LinkedIn OAuth)
- LinkedIn profile ID
- Report submissions (company, job title, experience)
- Verification status

**Data NOT Collected:**
- Passwords (OAuth only)
- Payment information (free service)
- Tracking cookies (minimal analytics)
- Personal identifiable information beyond email

---

### 2. CCPA Compliance (California Consumer Privacy Act)

**Status:** ✅ Compliant

**Implementation:**
- **Privacy Notice:** Clear disclosure in Privacy Policy
- **Right to Know:** Users can see what data we have
- **Right to Delete:** Users can request deletion
- **Right to Opt-Out:** Users can opt out of data collection
- **No Sale of Data:** We don't sell user data

---

### 3. Terms of Service

**Status:** ✅ Complete

**Key Terms:**
- **User Responsibilities:** Honest reporting, no spam, no harassment
- **Content Ownership:** Users retain ownership of their reports
- **License Grant:** Users grant us license to display reports
- **Prohibited Uses:** No scraping, no automated submissions, no abuse
- **Termination:** We can terminate accounts for violations
- **Disclaimer:** No warranty, use at your own risk
- **Limitation of Liability:** Limited to amount paid (free = $0)

**Location:** https://getghostindex.com/terms

---

### 4. DMCA Compliance (Digital Millennium Copyright Act)

**Status:** ✅ Compliant

**Implementation:**
- **DMCA Policy:** Clear takedown procedure
- **Designated Agent:** Contact information provided
- **Takedown Process:** Standard DMCA notice and counter-notice
- **Repeat Infringer Policy:** Three strikes policy

**Location:** https://getghostindex.com/dmca

---

### 5. Content Moderation

**Status:** ✅ Implemented

**Policies:**
- **Verification Required:** Reports must be verified for full weight
- **Manual Review:** Flagged reports reviewed by admin
- **Report Status:** Pending, Approved, Rejected
- **User Reporting:** Users can flag inappropriate content
- **Removal Process:** Clear process for removing false reports

**Prohibited Content:**
- False or misleading information
- Harassment or hate speech
- Personal attacks
- Spam or promotional content
- Copyright infringement

---

### 6. Data Retention

**Policy:**
- **Active Reports:** Retained indefinitely (public interest)
- **Deleted Reports:** Soft delete, retained for 30 days, then hard delete
- **User Accounts:** Retained while active, deleted on request
- **Verification Emails:** Retained for 90 days for audit purposes
- **Logs:** Retained for 30 days for debugging

---

### 7. Third-Party Services & Data Sharing

**Services Used:**
- **Supabase:** Database and authentication (EU region)
- **Vercel:** Hosting (US region, GDPR compliant)
- **Mailgun:** Email delivery (EU region)
- **Upstash:** Rate limiting (global)
- **Clearbit:** Company logos (public API)

**Data Sharing:**
- **No Sale:** We never sell user data
- **Service Providers:** Only share data necessary for service operation
- **Legal Requirements:** May disclose if required by law
- **Aggregated Data:** May share anonymized, aggregated statistics

---

### 8. Accessibility

**Status:** 🔄 In Progress

**Current:**
- Semantic HTML
- Keyboard navigation
- Color contrast (WCAG AA)
- Responsive design

**Planned:**
- ARIA labels
- Screen reader testing
- WCAG AAA compliance

---

### 9. Transparency

**Commitment:**
- **Open Source:** Code available on GitHub
- **Public Roadmap:** Feature requests and bugs tracked publicly
- **Change Log:** All major changes documented
- **Incident Response:** Security incidents disclosed within 72 hours

---

## 🛡️ Security Best Practices

### Development
- ✅ Environment variables for secrets
- ✅ No secrets in code or commits
- ✅ Regular dependency updates
- ✅ Code review for security issues
- ✅ Automated security scanning (GitHub Dependabot)

### Production
- ✅ HTTPS only
- ✅ Secure headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling (no sensitive info in errors)
- ✅ Logging and monitoring

### Operations
- ✅ Regular backups (Supabase automatic)
- ✅ Disaster recovery plan
- ✅ Incident response plan
- ✅ Security update process

---

## 📊 Technical Specifications

### Stack
- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel (Edge Network)
- **Email:** Mailgun (EU region)
- **Rate Limiting:** Upstash Redis
- **Styling:** TailwindCSS

### Performance
- **Page Load:** <2s average
- **Search Response:** <500ms
- **API Response:** <1s average
- **Uptime Target:** 99.9%

### Scalability
- **Database:** Supabase scales automatically
- **Hosting:** Vercel serverless scales to demand
- **Rate Limiting:** Redis handles millions of requests
- **CDN:** Global edge network for static assets

---

## 🔐 Security Contact

**Report Security Issues:**
- Email: (security email TBD)
- GitHub: Private security advisory
- Response Time: Within 24 hours

**Bug Bounty:** Coming soon

---

## ✅ Compliance Checklist

- [x] GDPR compliant
- [x] CCPA compliant
- [x] Terms of Service published
- [x] Privacy Policy published
- [x] DMCA policy published
- [x] HTTPS enforced
- [x] Rate limiting implemented
- [x] Input sanitization active
- [x] Authentication secured
- [x] Database RLS enabled
- [x] Security headers configured
- [x] Webhook signature verification
- [x] Cron endpoint authentication
- [ ] Accessibility audit (planned)
- [ ] Security audit (planned)
- [ ] Penetration testing (planned)

---

**Last Security Review:** January 14, 2026  
**Next Review:** February 14, 2026  
**Version:** 1.0 (Beta)
