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
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching from GamerPower API' },
      { status: 500 },
    );
  }
}
