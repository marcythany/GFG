export interface Giveaway {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  end_date: string;
  platforms: string;
  users: number;
  type: string;
}

export interface GiveawayFilters {
  platform?: string;
  type?: string;
  'sort-by'?: string;
}

export interface PaginatedGiveaways {
  giveaways: Giveaway[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type SortOption = 'date' | 'value' | 'popularity';
export type PlatformOption =
  | 'all'
  | 'pc'
  | 'steam'
  | 'epic-games-store'
  | 'ubisoft'
  | 'gog'
  | 'itchio'
  | 'ps4'
  | 'ps5'
  | 'xbox-one'
  | 'xbox-series-xs'
  | 'switch'
  | 'android'
  | 'ios'
  | 'vr'
  | 'battlenet'
  | 'origin'
  | 'drm-free'
  | 'xbox-360';
export type TypeOption = 'all' | 'game' | 'loot' | 'beta';
