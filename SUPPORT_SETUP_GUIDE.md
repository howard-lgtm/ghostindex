# Support Infrastructure Setup Guide

**Date:** January 22, 2026  
**Purpose:** Set up support@getghostindex.com for beta user assistance

---

## ✅ Completed

### 1. Footer Updated
- Added "Support" section to footer
- Three support links:
  - **Contact Us:** `support@getghostindex.com`
  - **Report a Bug:** Pre-filled subject line
  - **Feature Request:** Pre-filled subject line
- Changed footer grid from 4 to 5 columns
- Ready to deploy

---

## 📧 Mailgun Setup - support@getghostindex.com

### Option 1: Route to Your Personal Email (Recommended for Beta)

**Steps:**
1. Go to Mailgun Dashboard: https://app.eu.mailgun.com/dashboard
2. Navigate to **Sending** → **Routes**
3. Click **Create Route**
4. Configure:
   - **Priority:** 1
   - **Filter Expression:** `match_recipient("support@mg.getghostindex.com")`
   - **Actions:** 
     - Forward to: `your-personal-email@example.com`
     - Store message: Yes (optional, for backup)
   - **Description:** "Forward support emails to personal inbox"
5. Click **Create Route**

**Result:** All emails to `support@getghostindex.com` will forward to your personal email.

---

### Option 2: Create Dedicated Support Inbox

**If you want a separate inbox:**

1. **Use Gmail/Google Workspace:**
   - Create `support@yourdomain.com` in Google Workspace
   - Or use Gmail alias forwarding

2. **Configure Mailgun:**
   - Same as Option 1, but forward to the dedicated inbox
   - Set up auto-responder (optional)

3. **Set up Email Client:**
   - Configure support inbox in your email client
   - Set up labels/folders for organization

---

## 🔧 Mailgun Route Configuration

### Basic Route (Forward Only)
```
Priority: 1
Expression: match_recipient("support@mg.getghostindex.com")
Actions:
  - forward("your-email@example.com")
Description: Forward support emails
```

### Advanced Route (Forward + Store)
```
Priority: 1
Expression: match_recipient("support@mg.getghostindex.com")
Actions:
  - forward("your-email@example.com")
  - store(notify="https://getghostindex.com/api/webhooks/support")
Description: Forward and store support emails
```

---

## 📝 Support Email Templates (Optional)

### Auto-Response Template

**Subject:** We received your message - GhostIndex Support

**Body:**
```
Hi there,

Thank you for contacting GhostIndex support!

We've received your message and will get back to you within 24-48 hours during our beta phase.

In the meantime, you might find these resources helpful:
- How It Works: https://getghostindex.com/#how-it-works
- FAQ: https://getghostindex.com/#faq
- Terms of Service: https://getghostindex.com/terms

Best regards,
The GhostIndex Team

---
This is an automated response. Please do not reply to this email.
For urgent matters, please email support@getghostindex.com directly.
```

---

## 📋 Support Workflow (Beta Phase)

### When You Receive Support Email

1. **Acknowledge Receipt (within 24 hours)**
   - Thank them for reaching out
   - Confirm you're looking into it
   - Set expectations for response time

2. **Categorize the Issue**
   - Bug report → Investigate and fix
   - Feature request → Add to roadmap
   - General question → Provide answer
   - Account issue → Resolve directly

3. **Respond with Solution**
   - Clear explanation
   - Steps to resolve (if applicable)
   - Follow-up if needed

4. **Track Issues**
   - Keep a simple spreadsheet or use GitHub Issues
   - Note common questions for FAQ
   - Track bugs for prioritization

---

## 🎯 Common Support Scenarios

### Bug Reports

**Response Template:**
```
Hi [Name],

Thank you for reporting this issue! I've investigated and [found the problem/need more information].

[If fixed:]
The bug has been fixed and deployed. You should see the changes within a few minutes.

[If investigating:]
I'm currently investigating this issue. Could you provide:
- What browser you're using
- Steps to reproduce the issue
- Any error messages you saw

I'll keep you updated on the progress.

Best regards,
Howard
GhostIndex Team
```

### Feature Requests

**Response Template:**
```
Hi [Name],

Thanks for the great suggestion! I really appreciate you taking the time to share this idea.

I've added "[Feature Name]" to our product roadmap. We're currently in beta, so we're collecting feedback like this to prioritize what to build next.

I'll keep you posted on when this feature is being developed.

In the meantime, here's a workaround you might find helpful: [if applicable]

Best regards,
Howard
GhostIndex Team
```

### General Questions

**Response Template:**
```
Hi [Name],

Great question! [Answer their question clearly]

[Provide additional context or links if helpful]

Let me know if you have any other questions!

Best regards,
Howard
GhostIndex Team
```

---

## 📊 Support Metrics to Track

During beta, track:
- **Response time:** How quickly you respond
- **Resolution time:** How long to fix issues
- **Common questions:** What to add to FAQ
- **Bug frequency:** Which bugs are most common
- **Feature requests:** What users want most

**Simple Tracking Spreadsheet:**
```
Date | From | Type | Subject | Status | Response Time | Notes
-----|------|------|---------|--------|---------------|------
1/22 | user@example.com | Bug | Can't login | Resolved | 2 hours | Password reset issue
1/23 | user2@example.com | Feature | Export reports | Noted | 1 hour | Added to roadmap
```

---

## 🚀 Deployment Steps

### 1. Deploy Footer Changes
```bash
git add components/Footer.tsx
git commit -m "Add support section to footer with contact links"
git push
```

Vercel will automatically deploy the changes.

### 2. Set Up Mailgun Route
- Follow Option 1 steps above
- Test by sending email to support@getghostindex.com
- Verify you receive it in your inbox

### 3. Test Support Links
- Visit https://getghostindex.com
- Scroll to footer
- Click "Contact Us" link
- Verify email client opens with correct address

---

## ✅ Verification Checklist

- [ ] Footer updated with Support section
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel deployment completed
- [ ] Support links visible on production site
- [ ] Mailgun route configured
- [ ] Test email sent to support@getghostindex.com
- [ ] Test email received in your inbox
- [ ] Email client opens correctly from footer links

---

## 🎉 Success Criteria

Support infrastructure is complete when:
1. ✅ Footer shows Support section on all pages
2. ✅ support@getghostindex.com forwards to your email
3. ✅ You can receive and respond to support emails
4. ✅ Links work correctly from the website

---

## 📝 Next Steps After Setup

1. **Monitor support emails** during beta
2. **Create FAQ page** based on common questions
3. **Document common issues** for future reference
4. **Consider support tools** (Intercom, Zendesk) for public launch
5. **Set up social media** for additional support channels

---

## 🔗 Useful Links

- **Mailgun Dashboard:** https://app.eu.mailgun.com/dashboard
- **Mailgun Routes:** https://app.eu.mailgun.com/app/sending/domains/mg.getghostindex.com/routes
- **Vercel Dashboard:** https://vercel.com/howard-duffys-projects/ghostindex
- **Production Site:** https://getghostindex.com

---

**Setup Time:** ~15 minutes  
**Status:** Ready to deploy and configure
