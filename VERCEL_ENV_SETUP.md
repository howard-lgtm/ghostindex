# Vercel Environment Variable Setup

## Add Plausible Analytics Domain

### Steps to Add Environment Variable

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select project: `ghostindex`

2. **Navigate to Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add New Variable**
   - Click **Add New** button
   - Fill in:
     - **Key:** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
     - **Value:** `getghostindex.com`
     - **Environment:** Check all three:
       - ✅ Production
       - ✅ Preview
       - ✅ Development

4. **Save**
   - Click **Save**
   - Vercel will automatically trigger a new deployment

5. **Wait for Deployment**
   - Go to **Deployments** tab
   - Wait for the new deployment to complete (~2-3 minutes)

6. **Verify**
   - Visit https://getghostindex.com
   - Open DevTools (F12) → Network tab
   - Reload page
   - Look for request to `plausible.io/js/script.js`
   - Should see status 200

---

## Alternative: Add to .env.local (Optional)

If you want to test locally with Plausible (though it only loads in production):

```bash
# Add to .env.local
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=getghostindex.com
```

---

## Verification Checklist

After adding the environment variable:

- [ ] Environment variable added in Vercel
- [ ] New deployment completed successfully
- [ ] Plausible script loads on production site
- [ ] Plausible dashboard shows visitor data
- [ ] Custom events are being tracked

---

## Troubleshooting

### Script Not Loading
- Check environment variable is spelled correctly
- Verify deployment completed
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### No Data in Plausible
- Wait 5-10 minutes for first data
- Verify domain in Plausible matches exactly: `getghostindex.com`
- Check browser console for errors

### Events Not Tracking
- Events only work in production
- Check browser console for `plausible is not defined` errors
- Verify script loaded before events fire
