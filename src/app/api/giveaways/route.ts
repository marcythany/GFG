import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const sortBy = searchParams.get('sort-by');

  const baseUrl = 'https://www.gamerpower.com/api/giveaways';
  let apiUrl = baseUrl;

  const queryParams = new URLSearchParams();
  if (platform && platform !== 'all') {
    queryParams.append('platform', platform);
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
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Handle empty responses gracefully
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);

    // Return empty array instead of error for better UX
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}
