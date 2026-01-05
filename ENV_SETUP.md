# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service (Mailgun)
MAILGUN_WEBHOOK_SIGNING_KEY=your_mailgun_webhook_signing_key
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.getghostindex.com

# Cron Job Security
CRON_SECRET=generate_random_secret_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Setup Instructions

### 1. Supabase
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings > API
4. Copy `URL` → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 2. Mailgun (Email Verification)
1. Create account at https://mailgun.com
2. Add domain: `mg.getghostindex.com` (or use sandbox for testing)
3. Go to Sending > Domains > [Your Domain]
4. Copy `HTTP webhook signing key` → `MAILGUN_WEBHOOK_SIGNING_KEY`
5. Go to Settings > API Keys
6. Copy `Private API key` → `MAILGUN_API_KEY`
7. Set up inbound route:
   - Go to Receiving > Routes
   - Create route for `verify@mg.getghostindex.com`
   - Forward to: `https://getghostindex.com/api/webhooks/mailgun`

### 3. Cron Secret
Generate a random secret for cron job authentication:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use any random string generator
```

Copy the output → `CRON_SECRET`

### 4. Vercel Deployment
When deploying to Vercel:
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Set `CRON_SECRET` as a secret
4. Redeploy

## Testing Email Verification Locally

1. Use Mailgun's sandbox domain for testing
2. Add your email to authorized recipients
3. Forward test emails to `verify@sandbox[xxx].mailgun.org`
4. Use ngrok to expose local webhook:
   ```bash
   ngrok http 3000
   # Copy HTTPS URL to Mailgun route
   ```

## Security Notes

- **Never commit `.env.local` to git**
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (bypass RLS)
- Rotate `CRON_SECRET` if exposed
- Use environment-specific keys (dev/staging/prod)
