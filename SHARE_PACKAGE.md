# GhostIndex - Share Package

**Beta Launch - January 14, 2026**

---

## 🔗 Share Link

### Primary URL
**https://getghostindex.com**

### With UTM Tracking (for analytics)
- Personal share: `https://getghostindex.com?utm_source=personal&utm_medium=share&utm_campaign=beta_launch`
- LinkedIn: `https://getghostindex.com?utm_source=linkedin&utm_medium=social&utm_campaign=beta_launch`
- Twitter: `https://getghostindex.com?utm_source=twitter&utm_medium=social&utm_campaign=beta_launch`
- Reddit: `https://getghostindex.com?utm_source=reddit&utm_medium=social&utm_campaign=beta_launch`

---

## 📖 The GhostIndex Story

### The Problem (Relatable Hook)
Every year, millions of job seekers spend hours crafting perfect applications, only to be met with complete silence. No rejection email. No feedback. Nothing. This is "ghosting," and it's become the norm in hiring.

**The frustration is real:**
- You spend 2-3 hours on a thoughtful application
- You never hear back - not even a rejection
- You don't know if they received it, reviewed it, or just ignored it
- You waste time on companies that never respond

### The Insight (The "Aha" Moment)
Companies have all the data about candidates (credit scores, background checks, references), but candidates have ZERO data about companies' hiring practices. This information asymmetry hurts job seekers.

**What if we could flip this?**

### The Solution (GhostIndex)
GhostIndex is a transparency platform that tracks which companies ghost job applicants. We calculate a "Ghost Index Score" (0-100) for each company based on verified reports from real job seekers.

**Think of it as:**
- Glassdoor, but specifically for ghosting behavior
- Yelp for hiring practices
- A credit score for companies' responsiveness

### How It Works (Simple & Clear)
1. **Search** - Look up any company (90+ indexed)
2. **See Score** - View their Ghost Index Score (0 = best, 100 = worst)
3. **Read Reports** - See what other applicants experienced
4. **Submit Your Own** - Share your experience to help others
5. **Verification** - Forward your confirmation email to verify (ensures data quality)

### The Impact (Why It Matters)
- **For Job Seekers:** Stop wasting time on companies that won't respond
- **For Companies:** Incentive to improve hiring practices (transparency drives accountability)
- **For The Industry:** Makes hiring more respectful and efficient

### The Vision (Where We're Going)
**Short-term:** Build the largest database of verified hiring experiences
**Mid-term:** Chrome extension showing scores on job sites (LinkedIn, Indeed)
**Long-term:** Industry standard for hiring transparency, partnerships with job boards

---

## 🧪 What to Test - Beta Tester Guide

### Quick Start (5 minutes)
1. **Visit:** https://getghostindex.com
2. **Sign In:** Click "Sign In" → Use LinkedIn OAuth
3. **Search:** Type a company name (try "Apple" or "Google")
4. **Explore:** Click company name to see full profile
5. **Feedback:** What's confusing? What's missing?

### Core Features to Test

#### 1. Search Functionality ⭐ HIGH PRIORITY
**What to do:**
- Search for various companies (tech, finance, startups)
- Try partial names (e.g., "face" for Facebook)
- Try full domains (e.g., "apple.com")
- Search for companies NOT in database

**What to check:**
- ✅ Autocomplete suggestions appear quickly
- ✅ Results are relevant
- ✅ Ghost Index Scores display correctly
- ✅ Rate limiting works (try 11+ searches rapidly)

**Expected behavior:**
- Autocomplete shows up to 5 suggestions
- Results prioritize companies starting with your query
- After 10 searches in 10 seconds, you'll see rate limit message

#### 2. Company Detail Pages ⭐ HIGH PRIORITY
**What to do:**
- Click on any company from search results
- View their Ghost Index Score
- Read the score interpretation (Low/Moderate/High Risk)
- Scroll through all reports
- Check company metadata (logo, industry, size)

**What to check:**
- ✅ Page loads without errors
- ✅ Ghost Index Score displays prominently
- ✅ Score color matches risk level (green=low, yellow=moderate, red=high)
- ✅ Reports show verification status
- ✅ Company logo loads correctly

**Expected behavior:**
- Score 0-40 = Low Risk (green)
- Score 40-70 = Moderate Risk (yellow)
- Score 70-100 = High Risk (red)
- Verified reports show checkmark icon

#### 3. Report Submission (If You Have Experience)
**What to do:**
- Click "Submit a Report"
- Fill out the form
- Submit your experience
- Check dashboard for your report

**What to check:**
- ✅ Form validation works
- ✅ Company autocomplete helps you find the right company
- ✅ Submission succeeds
- ✅ Report appears in dashboard

**Expected behavior:**
- Report shows as "pending" and "unverified" initially
- You should see a "Resend Verification Email" button

#### 4. Verification Email (Advanced)
**What to do:**
- Submit a report
- Click "Resend Verification Email"
- Check your email inbox
- Forward your job application confirmation to the address in the email

**What to check:**
- ✅ Verification email arrives
- ✅ Email has clear instructions
- ✅ Forward-to address is correct (verify+CODE@mg.getghostindex.com)

**Expected behavior:**
- Email arrives within 1-2 minutes
- Contains unique verification code
- Beautiful HTML formatting

#### 5. Dashboard
**What to do:**
- View your submitted reports
- Check statistics (total reports, verified, pending)
- Click on individual reports to see details

**What to check:**
- ✅ All your reports display
- ✅ Statistics are accurate
- ✅ Verification status is clear
- ✅ Can navigate to report details

#### 6. User Experience
**What to test:**
- Navigation between pages
- Theme toggle (dark/light mode)
- Mobile responsiveness (if on mobile)
- Loading states
- Error messages

**What to check:**
- ✅ Navigation is intuitive
- ✅ Theme persists across pages
- ✅ Works on mobile devices
- ✅ Loading indicators show during waits
- ✅ Error messages are helpful

---

## 🐛 What to Report

### Critical Issues (Report Immediately)
- ❌ Pages don't load / show errors
- ❌ Can't sign in
- ❌ Search doesn't work
- ❌ Data looks incorrect
- ❌ Security concerns

### Important Issues
- ⚠️ Confusing UI/UX
- ⚠️ Missing features you expected
- ⚠️ Slow performance
- ⚠️ Mobile issues

### Nice-to-Have Feedback
- 💡 Feature suggestions
- 💡 Design improvements
- 💡 Content suggestions
- 💡 Additional companies to add

### How to Report
**For now:** Reply with your feedback including:
1. What you were trying to do
2. What happened
3. What you expected to happen
4. Screenshots (if applicable)

---

## 💬 Sample Feedback Questions

**After testing, please answer:**

1. **First Impression:** What was your immediate reaction when you landed on the site?

2. **Value Proposition:** Is it clear what GhostIndex does and why it's useful?

3. **Ease of Use:** How easy was it to search for companies and view their scores?

4. **Trust:** Do you trust the data? What would make you trust it more?

5. **Missing Features:** What features did you expect that weren't there?

6. **Would You Use It?** Would you use this when job searching? Why or why not?

7. **Would You Share It?** Would you recommend this to friends? Why or why not?

8. **Biggest Issue:** What's the #1 thing that needs to be fixed?

9. **Favorite Feature:** What did you like most?

10. **Overall Rating:** On a scale of 1-10, how would you rate the experience?

---

## 🎯 Success Criteria

**We consider the beta successful if:**
- ✅ Users can search and find companies
- ✅ Ghost Index Scores display correctly
- ✅ Users can submit reports
- ✅ No critical bugs
- ✅ Positive feedback on core value proposition

**Bonus wins:**
- 🎉 Users submit their own reports
- 🎉 Users share with friends
- 🎉 Users bookmark for future use
- 🎉 Feature requests (means they see potential)

---

## 📊 Current Status

### What's Working
- ✅ 91 companies indexed
- ✅ 35 verified reports
- ✅ Ghost Index Scores calculated
- ✅ Search with autocomplete
- ✅ Company detail pages
- ✅ Report submission
- ✅ Email verification system
- ✅ Security (rate limiting, input sanitization)

### What's In Progress
- 🔄 Gathering beta feedback
- 🔄 Testing email verification flow
- 🔄 Monitoring for bugs

### What's Next (Post-Beta)
- 📅 Chrome extension
- 📅 Score trend charts
- 📅 Company response feature
- 📅 Public API
- 📅 Mobile app

---

## 🚀 The Ask

**We need your help to:**
1. **Test thoroughly** - Break things, find edge cases
2. **Be honest** - Brutal feedback is the most valuable
3. **Think like a user** - Would you actually use this?
4. **Share ideas** - What would make this 10x better?
5. **Spread the word** - If you like it, tell others!

**This is a beta.** Things might break. Features might be missing. That's okay! Your feedback will shape the final product.

---

## 📞 Contact

**Questions? Issues? Feedback?**
- Reply to this message
- GitHub Issues: https://github.com/howard-lgtm/ghostindex/issues
- Email: (support email TBD)

---

## 🎁 Thank You!

Thank you for being an early beta tester. Your feedback is invaluable and will directly influence the product roadmap.

Let's make hiring more transparent together! 👻

---

**Share Link:** https://getghostindex.com  
**Tagline:** "Know before you apply. See which companies ghost job seekers."  
**Beta Launch:** January 14, 2026

