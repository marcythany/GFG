import { NextResponse } from 'next/server';

// Valid platforms according to GamerPower API
const VALID_PLATFORMS = [
  'pc',
  'steam',
  'epic-games-store',
  'uplay',
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
];

// Valid giveaway types
const VALID_TYPES = ['game', 'loot', 'beta'];

// Valid sort options
const VALID_SORT_OPTIONS = ['date', 'value', 'popularity'];

export async function GET(request: Request) {
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
  const apiUrl = `https://www.gamerpower.com/api/giveaway?id=${giveawayId}`;

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
  const statsUrl = 'https://www.gamerpower.com/api/worth';

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
  const baseUrl = 'https://www.gamerpower.com/api/giveaways';
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
      throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Handle empty responses gracefully
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json([], {
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

    // Return empty array instead of error for better UX
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}
