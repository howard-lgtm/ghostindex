# Emergency Rollback Plan

## Current Situation
Production is completely broken - all API routes returning 500 errors.

## Immediate Rollback Option

Go to Vercel and rollback to a previous working deployment:

1. **Go to:** https://vercel.com/howard-duffys-projects/ghostindex/deployments
2. **Find:** A deployment from before today (before we started making changes)
3. **Look for:** One that says "Implement live search with autocomplete" or similar
4. **Click:** The "..." menu on that deployment
5. **Select:** "Promote to Production"

This will instantly restore the working version while we debug the issue locally.

## What Broke

We made 3 deployments today:
1. `e544b15` - Fix autocomplete: Add Upstash to CSP
2. `ad8aed2` - Add fallback for rate limiting

One of these broke production. Most likely the rate limiting changes.

## Root Cause Hypothesis

The issue is probably one of:

1. **Async/await issue** - The `createClient()` function uses `await cookies()` which might not work in Vercel's serverless environment with Next.js 16
2. **Module initialization** - The rate limiting code initializes at module load time, which might fail in serverless
3. **Environment variables** - Despite being set in Vercel, they might not be accessible to the function

## Quick Fix to Test Locally

Remove rate limiting entirely from the search route:

```typescript
// app/api/search/route.ts
export async function GET(request: NextRequest) {
  try {
    // Skip rate limiting for now
    const rateLimit = 10;
    const remaining = 10;
    const reset = Date.now() + 10000;

    // Get and validate query parameter
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // ... rest of the code
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
```

## Better Solution

Check Vercel logs to see the actual error, then fix the root cause.

## Recommendation

**ROLLBACK NOW** to restore service, then debug locally before redeploying.
