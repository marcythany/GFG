import { NextResponse } from 'next/server';

// Simple in-memory rate limiter (4 requests per second as per API docs)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const windowMs = 1000; // 1 second window
  const maxRequests = 4; // 4 requests per second

  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (clientData.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  clientData.count++;
  return true;
}

// Valid platforms according to GamerPower API documentation
const VALID_PLATFORMS = [
  'pc',
  'steam',
  'epic-games-store',
  'ubisoft',
  'gog',
  'itchio',
  'ps4',
  'ps5',
  'xbox-one',
  'xbox-series-xs',
  'switch',
  'android',
  'ios',
  'vr',
  'battlenet',
  'origin',
  'drm-free',
  'xbox-360',
];

// Valid giveaway types
const VALID_TYPES = ['game', 'loot', 'beta'];

// Valid sort options
const VALID_SORT_OPTIONS = ['date', 'value', 'popularity'];

export async function GET(request: Request) {
  // Get client IP for rate limiting
  const clientIP =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json(
      {
        error:
          'Rate limit exceeded. Please wait before making another request.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '1',
          'X-RateLimit-Limit': '4',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 1000).toISOString(),
        },
      },
    );
  }

  const url = new URL(request.url);
  const stats = url.searchParams.get('stats');
  const giveawayId = url.searchParams.get('id');

  // Handle specific giveaway by ID
  if (giveawayId) {
    return handleSpecificGiveaway(giveawayId);
  }

  // Handle stats endpoint for total giveaway worth and count
  if (stats === 'true') {
    return handleStatsEndpoint();
  }

  // Continue with regular giveaways endpoint
  return handleGiveawaysList(url.searchParams);
}

async function handleSpecificGiveaway(giveawayId: string) {
  const apiUrl = `https://gamerpower.com/api/giveaway?id=${giveawayId}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GFG-Game-Freebie-Grabber/1.0.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'Giveaway not found' },
          { status: 404 },
        );
      }
      throw new Error(
        `Failed to fetch giveaway: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Specific Giveaway API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giveaway details' },
      { status: 500 },
    );
  }
}

async function handleStatsEndpoint() {
  const statsUrl = 'https://gamerpower.com/api/worth';

  try {
    const res = await fetch(statsUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GFG-Game-Freebie-Grabber/1.0.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch stats API: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giveaway statistics' },
      { status: 500 },
    );
  }
}

async function handleGiveawaysList(searchParams: URLSearchParams) {
  const platform = searchParams.get('platform');
  const type = searchParams.get('type');
  const sortBy = searchParams.get('sort-by');

  // Validate parameters
  if (platform && platform !== 'all' && !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json(
      {
        error: `Invalid platform. Valid options: ${VALID_PLATFORMS.join(', ')}`,
      },
      { status: 400 },
    );
  }

  if (type && type !== 'all' && !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Valid options: ${VALID_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  if (sortBy && !VALID_SORT_OPTIONS.includes(sortBy)) {
    return NextResponse.json(
      {
        error: `Invalid sort option. Valid options: ${VALID_SORT_OPTIONS.join(', ')}`,
      },
      { status: 400 },
    );
  }

  // Build API URL
  const baseUrl = 'https://gamerpower.com/api/giveaways';
  let apiUrl = baseUrl;

  const queryParams = new URLSearchParams();

  // Add filters
  if (platform && platform !== 'all') {
    queryParams.append('platform', platform);
  }

  if (type && type !== 'all') {
    queryParams.append('type', type);
  }

  if (sortBy) {
    queryParams.append('sort-by', sortBy);
  }

  const queryString = queryParams.toString();
  if (queryString) {
    apiUrl += `?${queryString}`;
  }

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GFG-Game-Freebie-Grabber/1.0.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'Giveaways endpoint not found' },
          { status: 404 },
        );
      }
      if (res.status === 500) {
        return NextResponse.json(
          { error: 'GamerPower API server error' },
          { status: 500 },
        );
      }
      throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Handle empty responses gracefully (201 status indicates no giveaways)
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json([], {
        status: 201, // No giveaways found
        headers: {
          'Cache-Control': 'public, s-maxage=60', // Cache empty results for 1 minute
        },
      });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Giveaways API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    // Return a proper error response
    return NextResponse.json(
      { message: `Failed to fetch giveaways: ${errorMessage}` },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    );
  }
}
