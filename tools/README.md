# GhostIndex Utility Tools

This directory contains utility scripts for managing and monitoring the GhostIndex platform.

---

## 📊 check-mailgun-status.ts

**Purpose:** Check the verification status of Mailgun DNS records and domain configuration.

**Usage:**
```bash
# From project root
npm run check:mailgun

# Or directly with tsx
tsx tools/check-mailgun-status.ts
```

**What it checks:**
- Domain state and status
- SPF record verification
- DKIM record verification
- MX records verification
- CNAME record verification
- Overall domain readiness

**Output:**
- ✅ Green checkmarks for verified records
- ⏳ Pending status for unverified records
- Detailed information about each DNS record
- Final summary of domain readiness

**When to use:**
- After adding/updating DNS records
- To check if DKIM verification has completed
- Before testing email verification flow
- Troubleshooting email delivery issues

---

## Adding the Script to package.json

Add this to your `package.json` scripts section:

```json
"check:mailgun": "tsx tools/check-mailgun-status.ts"
```

---

## Requirements

- Node.js environment variables configured in `.env.local`
- `MAILGUN_API_KEY` must be set
- `MAILGUN_DOMAIN` (defaults to `mg.getghostindex.com`)
- `tsx` package installed (already in dependencies)
