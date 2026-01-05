# GitHub Repository Setup

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `ghostindex`
3. Description: "Transparency platform for job market hiring practices"
4. Visibility: **Private** (change to public when ready to launch)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Push Code to GitHub

After creating the repository, run these commands:

```bash
cd /Users/howardduffy/CascadeProjects/ghostindex

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ghostindex.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all 52 files uploaded
3. Verify these key files are present:
   - ✅ `BUSINESS_STRATEGY.md`
   - ✅ `DEPLOYMENT_GUIDE.md`
   - ✅ `MAILGUN_SETUP.md`
   - ✅ `app/` directory with all pages
   - ✅ `components/` directory
   - ✅ `supabase/migrations/` directory
   - ✅ `package.json`
   - ✅ `.gitignore` (should exclude `.env.local`)

## Step 4: Verify .env.local is NOT Uploaded

**IMPORTANT:** Check that `.env.local` is NOT in your GitHub repository.

This file contains sensitive credentials and should never be committed.

If you see it in GitHub:
1. Remove it: `git rm --cached .env.local`
2. Commit: `git commit -m "Remove .env.local from tracking"`
3. Push: `git push`

## Next: Deploy to Vercel

Once your code is on GitHub, follow `DEPLOYMENT_GUIDE.md` to deploy to Vercel.
