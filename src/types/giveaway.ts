/**
 * Represents a giveaway item from the API.
 */
export interface Giveaway {
  /** Unique identifier for the giveaway */
  id: number;
  /** Title of the giveaway */
  title: string;
  /** Monetary value or "Free" */
  worth: string;
  /** Thumbnail image URL */
  thumbnail: string;
  /** Full image URL */
  image: string;
  /** Description of the giveaway */
  description: string;
  /** Instructions for claiming the giveaway */
  instructions: string;
  /** URL to open the giveaway */
  open_giveaway_url: string;
  /** Publication date as ISO string */
  published_date: string;
  /** End date as ISO string */
  end_date: string;
  /** Comma-separated string of supported platforms */
  platforms: string;
  /** Number of users participating */
  users: number;
  /** Type of giveaway */
  type: TypeOption;
}

/**
 * Filters for querying giveaways.
 */
export interface GiveawayFilters {
  /** Filter by platform */
  platform?: PlatformOption;
  /** Filter by giveaway type */
  type?: TypeOption;
  /** Sort option */
  'sort-by'?: SortOption;
}

/**
 * Paginated response containing giveaways.
 */
export interface PaginatedGiveaways {
  /** Array of giveaway items */
  giveaways: Giveaway[];
  /** Total number of giveaways */
  totalCount: number;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
}

/** Available sort options for giveaways */
export const SORT_OPTIONS = ['date', 'value', 'popularity'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/** Available platform options */
export const PLATFORM_OPTIONS = [
  'all',
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
] as const;
export type PlatformOption = (typeof PLATFORM_OPTIONS)[number];

/** Available giveaway type options */
export const TYPE_OPTIONS = ['all', 'game', 'loot', 'beta'] as const;
export type TypeOption = (typeof TYPE_OPTIONS)[number];
