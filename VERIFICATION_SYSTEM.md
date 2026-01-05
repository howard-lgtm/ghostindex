# GhostIndex Verification System Architecture

## Overview
GhostIndex uses a **verification-first** approach where reports are only considered valid if backed by email evidence from corporate domains.

## Core Components

### 1. Email Verification Flow
```
User forwards email → Postmark Inbound Parse → email_verifications table → Auto-link to report
```

**Key Tables:**
- `email_verifications`: Stores parsed emails from corporate domains
- `activity_logs`: Tracks application lifecycle events
- `reports`: Enhanced with verification fields

### 2. Auto-Ghost Detection (30-Day Rule)

**Function:** `auto_ghost_stale_applications()`

Automatically flags applications as "ghosted" if:
- Report is verified (`is_verified = true`)
- 30+ days since last contact
- Status is still "pending"

**Triggered by:** Scheduled job (run daily via cron or Supabase Edge Function)

### 3. Ghost Index Score Calculation

**Function:** `calculate_ghost_index_score(company_uuid)`

**Formula:**
```
Score = (1 - ghost_rate) × 70 + response_time_score × 30
```

**Response Time Scoring:**
- ≤3 days: 30 points
- ≤7 days: 20 points
- ≤14 days: 10 points
- >14 days: 0 points

**Result:** 0-100 scale where:
- **100** = Instant responses, zero ghosting
- **0** = Total silence, 100% ghost rate

### 4. Ghost Job Detector

**Function:** `detect_ghost_jobs()`

Flags job postings as "ghost jobs" if:
- Job active for **60+ days**
- Company's Ghost Index Score **< 30**

**Table:** `job_postings`
- Tracks job listing duration
- Links to company scores
- Flags high-risk postings

## Database Schema Changes

### New Fields on `reports`:
```sql
email_verification_id TEXT         -- Links to email proof
application_date TIMESTAMP          -- When user applied
last_contact_date TIMESTAMP         -- Last company response
days_since_contact INTEGER          -- Auto-calculated
auto_ghosted BOOLEAN                -- System-flagged ghost
```

### New Tables:

**`activity_logs`**
- Tracks: application_sent, confirmation_received, interview_scheduled, rejection_received, ghosted
- Enables timeline visualization

**`email_verifications`**
- Stores raw email data from Postmark
- Links to reports after parsing
- Status: pending/verified/rejected

**`job_postings`**
- Tracks job listing lifecycle
- Calculates days_active
- Flags ghost jobs

## Verification Workflow

### Step 1: User Forwards Email
User forwards application confirmation to: `verify@ghostindex.com`

### Step 2: Postmark Inbound Parse
Webhook receives email as JSON:
```json
{
  "From": "recruiting@company.com",
  "Subject": "Application Received - Software Engineer",
  "TextBody": "Thank you for applying...",
  "Date": "2024-12-29T12:00:00Z"
}
```

### Step 3: Email Parser (Node.js)
- Extract company domain from `From` address
- Parse application date from email body
- Create `email_verifications` record
- Auto-link to existing report or create new one

### Step 4: Verification Status
- **Verified**: Email from corporate domain, valid format
- **Pending**: Needs manual review
- **Rejected**: Spam or invalid source

### Step 5: Auto-Ghost Monitoring
Daily cron job runs `auto_ghost_stale_applications()`:
- Checks all verified reports
- Flags those with 30+ days silence
- Updates Ghost Index Scores

## API Endpoints (To Build)

### POST /api/webhooks/postmark
Receives inbound emails from Postmark

### POST /api/cron/auto-ghost
Runs auto-ghost detection (triggered by Vercel Cron)

### POST /api/cron/ghost-jobs
Runs ghost job detection

### GET /api/companies/:domain/score
Returns calculated Ghost Index Score

## Next Steps

1. **Run Migration**: Execute `20241229_verification_system.sql` in Supabase
2. **Set up Postmark**: Configure inbound webhook
3. **Build Email Parser**: Node.js service to parse emails
4. **Create Cron Jobs**: Schedule auto-ghost and ghost-job detection
5. **Update UI**: Show verification status and activity timelines
