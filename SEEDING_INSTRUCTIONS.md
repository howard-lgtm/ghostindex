# Database Seeding Instructions

## Prerequisites

You need your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## How to Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create one if needed)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** The `service_role` key bypasses Row Level Security. Keep it secret!

## Running the Seed Script

Once `.env.local` is configured:

```bash
npm run seed:companies
```

This will:
- Insert 75+ top companies (FAANG, startups, finance, consulting)
- Add company logos via Clearbit API
- Use `upsert` to avoid duplicates (safe to run multiple times)

## Expected Output

```
Starting company seed...
✓ Seeded Meta
✓ Seeded Apple
✓ Seeded Amazon
...
✓ Seeded PayPal

=== Seed Complete ===
Success: 75
Errors: 0
Total: 75
```

## Verification

After seeding, verify in Supabase:
1. Go to **Table Editor** → **companies**
2. You should see 75+ rows
3. Check that `logo` URLs are populated
4. Verify `domain` values are correct

## Troubleshooting

### Error: "supabaseUrl is required"
- Make sure `.env.local` exists in project root
- Check variable names match exactly (case-sensitive)
- Restart your terminal after creating `.env.local`

### Error: "Invalid API key"
- Verify you copied the **service_role** key, not the **anon** key
- Check for extra spaces or quotes in the key

### Error: "duplicate key value violates unique constraint"
- This is normal if companies already exist
- The script uses `upsert` so it will update existing records

## Next Steps

After seeding:
1. ✅ Companies populated
2. ⏭️ Run database migrations (if not already done)
3. ⏭️ Test search functionality
4. ⏭️ Create demo reports
5. ⏭️ Set up email verification
