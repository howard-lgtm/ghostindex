# Mailgun Email Verification Setup

Complete guide to setting up email verification for GhostIndex using Mailgun.

---

## Step 1: Create Mailgun Account

1. Go to https://mailgun.com
2. Sign up for free account (1,000 emails/month free)
3. Verify your email address
4. Complete account setup

---

## Step 2: Add Your Domain

### 2.1 Add Domain in Mailgun

1. Go to **Sending** → **Domains**
2. Click **"Add New Domain"**
3. Enter: `mg.getghostindex.com`
4. Select region: **US** (or EU if preferred)
5. Click **"Add Domain"**

### 2.2 Get DNS Records

Mailgun will show you DNS records to add. You'll need:

**TXT Records (2):**
```
Type: TXT
Host: mg.getghostindex.com
Value: v=spf1 include:mailgun.org ~all

Type: TXT  
Host: k1._domainkey.mg.getghostindex.com
Value: [long DKIM key provided by Mailgun]
```

**MX Records (2):**
```
Type: MX
Host: mg.getghostindex.com
Value: mxa.mailgun.org
Priority: 10

Type: MX
Host: mg.getghostindex.com
Value: mxb.mailgun.org
Priority: 10
```

**CNAME Record:**
```
Type: CNAME
Host: email.mg.getghostindex.com
Value: mailgun.org
```

---

## Step 3: Configure DNS in Squarespace

1. Go to your Squarespace domain settings
2. Navigate to **DNS Settings**
3. Add all the records from Step 2.2
4. **Save changes**
5. **Wait 10-60 minutes** for DNS propagation

### Verify DNS

Back in Mailgun:
1. Go to **Sending** → **Domains** → **mg.getghostindex.com**
2. Click **"Verify DNS Settings"**
3. Wait for all records to show green checkmarks ✓

---

## Step 4: Set Up Inbound Email Routing

### 4.1 Create Route

1. Go to **Receiving** → **Routes**
2. Click **"Create Route"**
3. Configure:

**Priority:** 0  
**Expression Type:** Match Recipient  
**Recipient:** `verify@mg.getghostindex.com`  
**Actions:**
- ✓ Forward to URL: `https://getghostindex.com/api/webhooks/mailgun`
- ✓ Stop processing further routes

4. Click **"Create Route"**

### 4.2 Test Inbound Routing

Mailgun provides a test feature:
1. Go to **Receiving** → **Routes**
2. Click your route
3. Click **"Test Route"**
4. Send test email to `verify@mg.getghostindex.com`

---

## Step 5: Get API Credentials

### 5.1 Get Webhook Signing Key

1. Go to **Sending** → **Domains** → **mg.getghostindex.com**
2. Scroll to **"HTTP webhook signing key"**
3. Click **"Show"** and copy the key
4. Save as: `MAILGUN_WEBHOOK_SIGNING_KEY`

### 5.2 Get API Key

1. Go to **Settings** → **API Keys**
2. Copy your **Private API key**
3. Save as: `MAILGUN_API_KEY`

---

## Step 6: Update Environment Variables

### Local Development (.env.local)

```env
MAILGUN_WEBHOOK_SIGNING_KEY=your_webhook_signing_key_here
MAILGUN_API_KEY=your_private_api_key_here
MAILGUN_DOMAIN=mg.getghostindex.com
```

### Vercel Production

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add the three Mailgun variables
3. Mark them as **sensitive**
4. Redeploy: `Deployments` → **...** → **Redeploy**

---

## Step 7: Set Up Email Forwarding Alias

To make `verify@getghostindex.com` work (instead of `verify@mg.getghostindex.com`):

### Option A: Email Forwarding in Squarespace

1. Go to Squarespace → **Email** → **Email Forwarding**
2. Create forwarding rule:
   - From: `verify@getghostindex.com`
   - To: `verify@mg.getghostindex.com`

### Option B: Additional Mailgun Route

1. In Mailgun, create another route:
   - Recipient: `verify@getghostindex.com`
   - Forward to: Same webhook URL

**Note:** Option A is simpler and recommended.

---

## Step 8: Test Email Verification Flow

### 8.1 Create Test Report

1. Go to https://getghostindex.com
2. Sign up / log in
3. Submit a test report for "Google"

### 8.2 Send Verification Email

Create a test email and send to `verify@getghostindex.com`:

```
From: recruiting@google.com (use your email for testing)
To: verify@getghostindex.com
Subject: Application Received - Software Engineer

Dear Applicant,

Thank you for applying to the Software Engineer position at Google.

We received your application on January 5, 2026.

Best regards,
Google Recruiting Team
```

### 8.3 Verify Processing

1. Check Mailgun logs: **Sending** → **Logs**
2. Check Vercel function logs for webhook processing
3. Check your dashboard - report should be marked "Verified"
4. Check Supabase - `email_verifications` table should have entry

---

## Troubleshooting

### DNS not verifying
- Wait longer (up to 48 hours)
- Use https://dnschecker.org to check propagation
- Verify records are exactly as Mailgun specifies

### Emails not being received
- Check Mailgun logs for delivery attempts
- Verify route is active and correct
- Test with Mailgun's built-in test feature

### Webhook not triggering
- Check Vercel function logs for errors
- Verify webhook URL is correct: `https://getghostindex.com/api/webhooks/mailgun`
- Test webhook manually with curl:

```bash
curl -X POST https://getghostindex.com/api/webhooks/mailgun \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Signature verification failing
- Verify `MAILGUN_WEBHOOK_SIGNING_KEY` is correct
- Check it matches the key in Mailgun dashboard
- Ensure no extra spaces or quotes in env var

---

## Email Parsing Logic

The webhook endpoint parses emails to extract:

**Company Domain:**
- From `From:` header (e.g., `recruiting@google.com` → `google.com`)
- Validates it's not Gmail, Yahoo, etc.

**Application Date:**
- Searches email body for date patterns
- Falls back to email received date

**Job Title:**
- Extracts from subject line
- Searches body for job title patterns

**Matching:**
- Looks up user by email
- Finds or creates company by domain
- Links to existing report or creates new one
- Marks report as `is_verified = true`

---

## Security Best Practices

1. **Never expose API keys** - Keep them in environment variables
2. **Verify webhook signatures** - Already implemented in code
3. **Rate limit** - Mailgun has built-in rate limiting
4. **Monitor logs** - Check for suspicious activity
5. **Rotate keys** - Change API keys if compromised

---

## Monitoring & Maintenance

### Check Email Delivery

Mailgun dashboard shows:
- **Accepted:** Emails received successfully
- **Delivered:** Forwarded to webhook
- **Failed:** Delivery errors

### Monitor Webhook Performance

Vercel function logs show:
- Successful parses
- Failed parses
- Error details

### Database Checks

Regularly check Supabase:
- `email_verifications` table for parsed emails
- `reports` table for verified reports
- `activity_logs` for verification events

---

## Cost Optimization

**Free Tier (1,000 emails/month):**
- Suitable for MVP and early users
- ~30 verifications/day

**Flex Plan ($35/month):**
- 50,000 emails included
- $0.80 per 1,000 additional
- Recommended when you hit 1,000/month

**Alternatives:**
- **SendGrid:** Similar pricing, different API
- **Postmark:** $15/month for 10k emails
- **AWS SES:** $0.10 per 1,000 emails (more complex setup)

---

## Next Steps

After email verification is working:

1. **Test thoroughly** with various email formats
2. **Monitor for edge cases** and improve parsing
3. **Add email templates** for user notifications
4. **Set up alerts** for failed verifications
5. **Document** common email formats for users

---

## Support

- **Mailgun Docs:** https://documentation.mailgun.com
- **Mailgun Support:** support@mailgun.com
- **Community:** https://www.mailgun.com/community

Email verification is now set up! 📧✅
