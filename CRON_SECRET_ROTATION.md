# CRON_SECRET Rotation Schedule

Security best practice guide for rotating the CRON_SECRET used to authenticate cron endpoints.

---

## Why Rotate CRON_SECRET?

- **Security:** Limits exposure if the secret is compromised
- **Compliance:** Required for SOC2 and similar certifications
- **Best Practice:** Industry standard is 90-day rotation for API secrets

---

## Rotation Schedule

**Recommended:** Every 90 days (quarterly)

**Next Rotation Dates:**
- Q2 2026: May 1, 2026
- Q3 2026: August 1, 2026
- Q4 2026: November 1, 2026
- Q1 2027: February 1, 2027

---

## Rotation Process

### Step 1: Generate New Secret

```bash
# Generate a new base64 secret
openssl rand -base64 32
```

Copy the output (e.g., `new_secret_here_abc123xyz...`)

### Step 2: Update Local Environment

Update `.env.local`:

```env
CRON_SECRET=new_secret_here_abc123xyz...
```

### Step 3: Update Vercel Environment Variables

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Find `CRON_SECRET`
3. Click **Edit**
4. Paste the new secret
5. Select all environments: **Production**, **Preview**, **Development**
6. Click **Save**

### Step 4: Redeploy

**Important:** You must redeploy for the new secret to take effect.

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **...** → **Redeploy**
4. Wait for deployment to complete (~2 minutes)

### Step 5: Test Cron Endpoints

Run the test script to verify all endpoints work with the new secret:

```bash
npm run test:cron
```

Expected output:
```
✅ Auto-ghost endpoint: Working
✅ Update scores endpoint: Working
✅ Ghost jobs endpoint: Working
```

### Step 6: Document Rotation

Update this file with:
- Date of rotation
- Who performed it
- Any issues encountered

---

## Rotation Log

| Date | Rotated By | Status | Notes |
|------|------------|--------|-------|
| Feb 26, 2026 | System | ⏳ Pending | Initial setup - rotation scheduled for May 1, 2026 |
| May 1, 2026 | - | 📅 Scheduled | First quarterly rotation |
| Aug 1, 2026 | - | 📅 Scheduled | Q3 rotation |
| Nov 1, 2026 | - | 📅 Scheduled | Q4 rotation |

---

## Automation (Future Enhancement)

### Option 1: Vercel Secrets Manager

When available, use Vercel's built-in secret rotation:
1. Enable automatic rotation
2. Set rotation period to 90 days
3. Configure webhook for rotation notifications

### Option 2: Custom Rotation Script

Create a script to automate rotation:

```typescript
// scripts/rotate-cron-secret.ts
import { execSync } from 'child_process';

async function rotateCronSecret() {
  // 1. Generate new secret
  const newSecret = execSync('openssl rand -base64 32').toString().trim();
  
  // 2. Update Vercel via API
  // (requires VERCEL_TOKEN)
  
  // 3. Trigger redeployment
  
  // 4. Test endpoints
  
  // 5. Log rotation
}
```

---

## Emergency Rotation

If you suspect the CRON_SECRET has been compromised:

1. **Immediately** generate and deploy a new secret (follow steps above)
2. Review access logs in Vercel for unauthorized requests
3. Check Sentry for any suspicious cron job executions
4. Document the incident in the rotation log

### Signs of Compromise

- Unexpected cron job executions in Vercel logs
- Cron endpoints returning success from unknown IPs
- Unusual database activity during cron windows
- Alerts from Sentry about cron job errors

---

## Calendar Reminders

Set up calendar reminders for rotation dates:

**Google Calendar:**
1. Create event: "Rotate CRON_SECRET"
2. Set to recur every 3 months
3. Add checklist from this document
4. Invite team members responsible for rotation

**Slack Reminder:**
```
/remind #engineering to rotate CRON_SECRET on May 1, 2026
```

---

## Verification Checklist

After each rotation, verify:

- [ ] New secret generated (32+ characters, base64)
- [ ] `.env.local` updated
- [ ] Vercel environment variable updated (all environments)
- [ ] Redeployment completed successfully
- [ ] All 3 cron endpoints tested and working
- [ ] Rotation logged in this document
- [ ] Next rotation date scheduled in calendar

---

## Related Documentation

- `CRON_TEST_RESULTS.md` - How to test cron endpoints
- `CRON_ENDPOINT_TESTING.md` - Detailed testing guide
- `SECURITY_AUDIT_REPORT.md` - Overall security status

---

## Support

If you encounter issues during rotation:

1. Check Vercel deployment logs
2. Review Sentry for error details
3. Test with old secret to verify it's a rotation issue
4. Rollback if necessary (restore old secret temporarily)

---

**Next Rotation:** May 1, 2026 📅
