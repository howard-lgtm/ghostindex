# Complete Verification & Auto-Ghost Flow

## 📧 Email Notification System

### **Email 1: Verification Request (Immediate)**
**Sent:** Right after user submits report  
**Trigger:** Report creation  
**Template:** `getVerificationEmailTemplate()`

```
Subject: Verify your GhostIndex report for [Company]

Hi [User],

Your report is now live on GhostIndex!

To verify, simply reply to this email with:
- Your application confirmation email (forward it), OR
- A screenshot of your application

Reply to: verify+abc123@mg.getghostindex.com

Why verify?
✓ Verified reports carry more weight
✓ Enables auto-ghost detection (30 days)
✓ Helps others trust the data
```

---

### **Email 2: Verification Confirmation (When User Replies)**
**Sent:** When user replies with proof  
**Trigger:** Mailgun webhook receives reply  
**Template:** `getVerificationConfirmationTemplate()`

```
Subject: ✅ Report Verified - [Company]

Hi [User],

Great news! Your report has been verified.

What happens next:
✓ Report carries full weight in Ghost Index Scores
✓ Auto-ghost detection enabled (30-day timer started)
✓ Other job seekers can trust your data

AUTO-GHOST DETECTION:
If you don't hear back from [Company] within 30 days, 
we'll automatically mark your report as "Ghosted" and 
update their Ghost Index Score.

View dashboard: https://getghostindex.com/dashboard
```

---

### **Email 3: Auto-Ghost Notification (After 30 Days - Future)**
**Sent:** When cron job detects 30+ days with no response  
**Trigger:** Daily cron job `auto_ghost_stale_applications()`  
**Status:** Not yet implemented

```
Subject: Your application to [Company] has been marked as ghosted

Hi [User],

It's been 30 days since you applied to [Company] for [Job Title] 
with no response.

We've automatically marked this as ghosted.

Company Ghost Index Score updated: [Score] → [New Score]

HEARD BACK FROM THEM?
If you received a response, update your report:
https://getghostindex.com/dashboard/reports/[ID]

Thanks for helping expose ghosting in tech hiring.
```

---

## 🔄 Complete User Journey

### **Phase 1: Submission (Current - Implemented)**

```
User submits report
    ↓
Report goes live immediately (status: pending, is_verified: false)
    ↓
Verification code generated (e.g., "abc123")
    ↓
Email 1 sent: "Verify your report"
    ↓
User sees report in dashboard with "Pending Verification" badge
```

### **Phase 2: Verification (Current - Implemented)**

```
User replies to verify+abc123@mg.getghostindex.com
    ↓
Mailgun receives email → forwards to webhook
    ↓
Webhook extracts verification code from recipient
    ↓
Finds report by code, verifies sender matches owner
    ↓
Updates report: email_verified=true, is_verified=true, status=approved
    ↓
Logs activity: "confirmation_received"
    ↓
Email 2 sent: "✅ Report Verified"
    ↓
User sees "✅ Verified" badge in dashboard
    ↓
30-day auto-ghost timer starts
```

### **Phase 3: Auto-Ghost Detection (Implemented, needs testing)**

```
Daily cron job runs at 2 AM UTC
    ↓
Checks all verified reports where:
  - application_date exists
  - days_since_contact >= 30
  - status = 'pending'
  - auto_ghosted = false
    ↓
Marks matching reports as ghosted:
  - auto_ghosted = true
  - status = 'rejected'
    ↓
Logs activity: "ghosted"
    ↓
Recalculates company Ghost Index Score
    ↓
Email 3 sent: "Marked as ghosted" (TODO)
```

---

## 🤖 Future AI Agent Capabilities

### **Phase 4: Email Monitoring (Future)**

**Concept:** AI agent monitors user's inbox for company responses

**Implementation:**
1. User grants OAuth permission (Gmail/Outlook)
2. AI scans emails from companies user applied to
3. Detects:
   - Interview invitations
   - Rejection emails
   - Follow-up requests
   - Offer letters
4. Auto-updates report status
5. Sends notification to user

**Example:**
```
Subject: 🎉 We detected a response from [Company]!

Hi [User],

Good news! We detected an email from [Company] about your 
application for [Job Title].

Email type: Interview Invitation
Received: 2 hours ago

We've updated your report status to "Interview Scheduled"

View email: [Link to email]
Update report: [Link to dashboard]
```

---

### **Phase 5: Predictive Ghosting (Future)**

**Concept:** AI analyzes patterns to predict ghosting probability

**Data Points:**
- Company's historical response time
- Industry averages
- Job posting age
- Application volume
- Time of year (hiring freezes)
- Company size & funding status

**Example Notifications:**

**Day 7:**
```
📊 Ghosting Probability Update

Company: [Company]
Days since application: 7
Ghosting probability: 25%

Based on 500 reports, [Company] typically responds within 14 days.
You're still in the normal response window.
```

**Day 21:**
```
⚠️ Ghosting Probability Update

Company: [Company]
Days since application: 21
Ghosting probability: 65%

[Company] has a 70% ghost rate after 21 days.
Similar applicants who heard back received responses by day 14.

Consider following up or moving on.
```

---

### **Phase 6: Proactive Status Updates (Future)**

**Concept:** AI proactively suggests status updates based on user behavior

**Triggers:**
- User searches for other jobs at same company
- User updates LinkedIn with new job
- User marks other applications as "Accepted offer"
- Time patterns (e.g., user typically checks dashboard after interviews)

**Example:**
```
Subject: Did you hear back from [Company]?

Hi [User],

We noticed you accepted an offer at [Other Company] - congrats! 🎉

Quick question: Did you ever hear back from [Company] about 
the [Job Title] position you applied for 45 days ago?

Update your report:
→ Yes, they rejected me
→ Yes, I withdrew
→ No, they ghosted me (auto-update)

This helps other job seekers!
```

---

## 🎯 Implementation Roadmap

### **✅ Phase 1: Trust-First Verification (DONE)**
- [x] Database schema with verification codes
- [x] Email templates (verification request)
- [x] Mailgun webhook handler
- [x] Instant report submission
- [x] Email reply verification

### **✅ Phase 2: Confirmation Emails (DONE)**
- [x] Verification confirmation template
- [x] Send confirmation after verification
- [x] Explain auto-ghost detection

### **🔄 Phase 3: Auto-Ghost Notifications (IN PROGRESS)**
- [x] Auto-ghost detection function (exists)
- [x] Daily cron job (exists)
- [ ] Ghost notification email template
- [ ] Send email when auto-ghosted
- [ ] Allow users to dispute auto-ghost

### **📋 Phase 4: Email Monitoring (PLANNED)**
- [ ] OAuth integration (Gmail, Outlook)
- [ ] Email scanning service
- [ ] Response detection AI
- [ ] Auto-status updates
- [ ] User notification system

### **📋 Phase 5: Predictive Analytics (PLANNED)**
- [ ] Historical data analysis
- [ ] Probability calculation model
- [ ] Proactive notification system
- [ ] Industry benchmarking
- [ ] Company behavior patterns

### **📋 Phase 6: Smart Suggestions (PLANNED)**
- [ ] User behavior tracking
- [ ] Context-aware notifications
- [ ] Follow-up reminders
- [ ] Application strategy tips
- [ ] Job search optimization

---

## 🔐 Privacy & Security

### **Email Monitoring (Phase 4+)**

**User Control:**
- Explicit OAuth consent required
- Can revoke access anytime
- Only scans emails from companies in reports
- No email content stored (only metadata)
- GDPR/CCPA compliant

**Data Retention:**
- Email metadata: 90 days
- Detection results: Permanent (anonymized)
- User can request full deletion

---

## 📊 Success Metrics

### **Current System (Phase 1-2)**
- Submission completion rate: Target 80%+
- Verification rate: Target 50%+ within 7 days
- Email open rate: Target 60%+
- Reply rate: Target 40%+

### **Future System (Phase 4+)**
- Auto-detection accuracy: Target 95%+
- False positive rate: <5%
- User satisfaction: 4.5/5 stars
- Time saved per user: 10+ minutes/week

---

## 🛠️ Technical Stack

**Current:**
- Mailgun (email sending & receiving)
- Supabase (database & auth)
- Next.js API routes (webhooks)
- PostgreSQL functions (auto-ghost detection)

**Future:**
- Gmail/Outlook OAuth APIs
- OpenAI GPT-4 (email classification)
- Temporal/Inngest (workflow orchestration)
- Redis (caching & rate limiting)
- Segment (analytics & tracking)

---

## 💡 Key Insights

**Why Trust-First Works:**
1. **Removes friction** - Users submit instantly
2. **Async verification** - Verify when convenient
3. **Familiar action** - Everyone knows how to reply
4. **Mobile-friendly** - Easier than file uploads
5. **Scalable** - Automated verification process

**Why AI Monitoring is Powerful:**
1. **Zero user effort** - Fully automated
2. **Real-time updates** - Instant status changes
3. **Predictive insights** - Know before you're ghosted
4. **Personalized** - Tailored to user's situation
5. **Actionable** - Suggests next steps

**Why This Matters:**
- **For users:** Save time, reduce anxiety, make better decisions
- **For platform:** Better data quality, higher engagement, viral growth
- **For industry:** Transparency forces accountability, improves hiring practices

---

## 🚀 Next Steps

1. **Complete Phase 3** - Add auto-ghost notification emails
2. **Test end-to-end** - Submit → Verify → Auto-ghost (30-day test)
3. **Deploy to production** - Launch trust-first verification
4. **Gather feedback** - Monitor metrics & user responses
5. **Plan Phase 4** - Design OAuth integration & AI monitoring
