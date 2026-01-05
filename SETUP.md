# GhostIndex Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env.local`
3. Run the migration file located at `supabase/migrations/20241229_initial_schema.sql` in your Supabase SQL Editor

## Database Schema

The migration creates three tables with Row Level Security enabled:

### Companies
- `id` (UUID, Primary Key)
- `name` (Text)
- `domain` (Text, Unique)
- `logo` (Text, optional)
- `ghost_index_score` (Decimal 0-100)
- `created_at`, `updated_at` (Timestamps)

### Reports
- `id` (UUID, Primary Key)
- `user_id` (UUID)
- `company_id` (UUID, Foreign Key to companies)
- `status` (Text: pending/approved/rejected)
- `is_verified` (Boolean)
- `job_title` (Text, optional)
- `created_at`, `updated_at` (Timestamps)

### Verification Queue
- `id` (UUID, Primary Key)
- `email_hash` (Text, Unique)
- `status` (Text: pending/verified/failed)
- `created_at`, `updated_at` (Timestamps)

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Theme

The project uses an "Authority Dashboard" color palette:
- **Primary**: Slate-950 (#020617)
- **Action**: Indigo-600 (#4f46e5)
- **Warning/Ghosting**: Amber-500 (#f59e0b)

Theme configuration is available in:
- `lib/theme.ts` - TypeScript theme constants
- `app/globals.css` - CSS custom properties
