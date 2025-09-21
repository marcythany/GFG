import { Giveaway, GiveawayFilters } from '@/types/giveaway';

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
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

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
  const response = await fetch(`${API_BASE_URL}?id=${id}`);

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
  const response = await fetch(`${API_BASE_URL}?stats=true`);

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
