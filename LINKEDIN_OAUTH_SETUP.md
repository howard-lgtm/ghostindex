# LinkedIn OAuth Setup Guide

## Overview
LinkedIn OAuth is already integrated in the UI (`OAuthButtons.tsx`) but needs configuration in LinkedIn Developer Portal and Supabase.

## Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **"Create app"**
3. Fill in app details:
   - **App name**: GhostIndex
   - **LinkedIn Page**: Your company page (or create one)
   - **App logo**: Upload GhostIndex logo
   - **Legal agreement**: Accept terms

## Step 2: Configure OAuth Settings

1. In your LinkedIn app, go to **"Auth"** tab
2. Add **Authorized redirect URLs**:
   ```
   https://kovcfugvlwrxkoacgbtg.supabase.co/auth/v1/callback
   https://prj-bhtqv0sbv0afjxmi1blkcbpao4qpn.supabase.co/auth/v1/callback
   ```

3. Request **OAuth 2.0 scopes**:
   - `openid` (required for OIDC)
   - `profile` (basic profile info)
   - `email` (user email address)

## Step 3: Get Credentials

1. In the **"Auth"** tab, copy:
   - **Client ID**
   - **Client Secret**

## Step 4: Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ghostindex`
3. Navigate to **Authentication > Providers**
4. Find **LinkedIn (OIDC)**
5. Enable the provider
6. Enter credentials:
   - **Client ID**: (from LinkedIn app)
   - **Client Secret**: (from LinkedIn app)
7. Click **Save**

## Step 5: Test OAuth Flow

1. Go to `https://getghostindex.com/login`
2. Click **"Continue with LinkedIn"**
3. Authorize the app
4. Should redirect to dashboard

## Current Status

✅ **UI Integration**: Complete
- LinkedIn button in `OAuthButtons.tsx`
- Uses `linkedin_oidc` provider
- Error handling implemented

❌ **Provider Configuration**: NOT CONFIGURED
- LinkedIn OAuth will fail with "invalid scope" error until configured
- Need LinkedIn Developer app
- Need Client ID and Secret
- **Must enable in Supabase before LinkedIn button will work**

## Current Error

If you see: `The requested permission scope is not valid`

**Cause**: LinkedIn provider is not enabled/configured in Supabase

**Solution**: Complete Steps 1-4 above to configure LinkedIn OAuth

## Configuration Checklist

- [ ] Create LinkedIn Developer app
- [ ] Add redirect URLs to LinkedIn app
- [ ] Request OAuth scopes (openid, profile, email)
- [ ] Copy Client ID and Secret
- [ ] Enable LinkedIn OIDC provider in Supabase
- [ ] Add credentials to Supabase
- [ ] Test sign-in flow
- [ ] Verify user data is captured correctly

## Troubleshooting

### "Provider not enabled" error
- Check Supabase Authentication > Providers
- Ensure LinkedIn (OIDC) is enabled
- Verify credentials are saved

### "Redirect URI mismatch" error
- Check LinkedIn app redirect URLs
- Must match Supabase callback URL exactly
- Include both Supabase URLs

### "Insufficient permissions" error
- Check OAuth scopes in LinkedIn app
- Must have: openid, profile, email
- May need to request additional scopes

## Notes

- LinkedIn uses **OIDC** (OpenID Connect), not basic OAuth
- Use `linkedin_oidc` provider in Supabase (not `linkedin`)
- LinkedIn requires a company page to create an app
- Scopes must be explicitly requested and approved
