import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchRateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
    
    // Apply rate limiting
    const { success, limit: rateLimit, remaining, reset } = await searchRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          limit: rateLimit,
          remaining: 0,
          reset
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    // Get and validate query parameter
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query too long' },
        { status: 400 }
      );
    }

    // Sanitize input to prevent injection attacks
    const sanitizedQuery = sanitizeInput(query.trim());

    // Get limit parameter (for suggestions vs full search)
    const limitParam = searchParams.get('limit');
    const resultLimit = limitParam ? Math.min(parseInt(limitParam), 50) : 20;

    // Query database
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${sanitizedQuery}%,domain.ilike.%${sanitizedQuery}%`)
      .limit(resultLimit);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // Smart ranking: prioritize starts-with matches
    const sorted = (data || []).sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(sanitizedQuery.toLowerCase());
      const bNameStarts = b.name.toLowerCase().startsWith(sanitizedQuery.toLowerCase());
      const aDomainStarts = a.domain.toLowerCase().startsWith(sanitizedQuery.toLowerCase());
      const bDomainStarts = b.domain.toLowerCase().startsWith(sanitizedQuery.toLowerCase());
      
      if (aNameStarts && !bNameStarts) return -1;
      if (!aNameStarts && bNameStarts) return 1;
      if (aDomainStarts && !bDomainStarts) return -1;
      if (!aDomainStarts && bDomainStarts) return 1;
      
      const aScore = a.ghost_index_score ?? -1;
      const bScore = b.ghost_index_score ?? -1;
      return bScore - aScore;
    });

    return NextResponse.json(
      { 
        data: sorted,
        meta: {
          query: sanitizedQuery,
          count: sorted.length,
          rateLimit: {
            limit: rateLimit,
            remaining,
            reset
          }
        }
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
