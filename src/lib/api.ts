import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import { headers } from 'next/headers';

// Cache base URL to avoid repeated async calls
let cachedBaseUrl: string | null = null;

async function getBaseUrl(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    return null; // Client side - use relative URLs
  }

  if (cachedBaseUrl !== null) {
    return cachedBaseUrl;
  }

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  cachedBaseUrl = `${protocol}://${host}`;
  return cachedBaseUrl;
}

const API_BASE_URL = '/api/giveaways';

function buildUrl(
  baseUrl: string | null,
  params: Record<string, string | number | boolean | undefined> = {},
): string {
  const url = baseUrl
    ? new URL(API_BASE_URL, baseUrl)
    : new URL(API_BASE_URL, 'http://localhost:3000');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== 'all') {
      url.searchParams.append(key, value.toString());
    }
  });

  return baseUrl ? url.toString() : url.pathname + url.search;
}

export async function fetchGiveaways(
  filters: GiveawayFilters = {},
): Promise<Giveaway[]> {
  const baseUrl = await getBaseUrl();
  const url = buildUrl(baseUrl, {
    platform: filters.platform,
    type: filters.type,
    'sort-by': filters['sort-by'],
  });

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch giveaways: ${response.status}`,
    );
  }

  const data = await response.json();

  // Handle empty responses gracefully
  if (
    response.status === 201 ||
    !data ||
    (Array.isArray(data) && data.length === 0)
  ) {
    return [];
  }

  return data as Giveaway[];
}

export async function fetchGiveawayById(id: number): Promise<Giveaway | null> {
  const baseUrl = await getBaseUrl();
  const url = buildUrl(baseUrl, { id });

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch giveaway: ${response.status}`,
    );
  }

  return (await response.json()) as Giveaway;
}

export async function fetchGiveawayStats(): Promise<{
  totalWorth: string;
  totalCount: number;
} | null> {
  const baseUrl = await getBaseUrl();
  const url = buildUrl(baseUrl, { stats: true });

  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as { totalWorth: string; totalCount: number };
}
