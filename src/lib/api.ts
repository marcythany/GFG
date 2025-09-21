import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import { headers } from 'next/headers';

async function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client side - use relative URLs
    return '';
  }
  // Server side - construct absolute URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  return `${protocol}://${host}`;
}

const API_BASE_URL = '/api/giveaways';

export async function fetchGiveaways(
  filters: GiveawayFilters = {},
): Promise<Giveaway[]> {
  const params = new URLSearchParams();

  if (filters.platform && filters.platform !== 'all') {
    params.append('platform', filters.platform);
  }

  if (filters.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }

  if (filters['sort-by']) {
    params.append('sort-by', filters['sort-by']);
  }

  const queryString = params.toString();
  const baseUrl = await getBaseUrl();
  const url = baseUrl
    ? `${baseUrl}${API_BASE_URL}${queryString ? `?${queryString}` : ''}`
    : `${API_BASE_URL}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch giveaways');
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

  return data;
}

export async function fetchGiveawayById(id: number): Promise<Giveaway | null> {
  const baseUrl = await getBaseUrl();
  const url = baseUrl
    ? `${baseUrl}${API_BASE_URL}?id=${id}`
    : `${API_BASE_URL}?id=${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch giveaway');
  }

  return await response.json();
}

export async function fetchGiveawayStats(): Promise<{
  totalWorth: string;
  totalCount: number;
} | null> {
  const baseUrl = await getBaseUrl();
  const url = baseUrl
    ? `${baseUrl}${API_BASE_URL}?stats=true`
    : `${API_BASE_URL}?stats=true`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
