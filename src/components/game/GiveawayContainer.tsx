'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Giveaway, PlatformOption, SortOption } from '@/types/giveaway';
import SearchBar from '@/components/common/SearchBar';
import GameFilters from './GameFilters';
import GameResults from './GameResults';
import GameEmptyState from './GameEmptyState';
import { motion } from 'framer-motion';

const GAMES_PER_PAGE = 12;

interface GiveawayContainerProps {
  initialGiveaways: Giveaway[];
  initialUnfilteredCount: number;
  searchQuery: string;
  currentPage: number;
}

export default function GiveawayContainer({
  initialGiveaways,
  initialUnfilteredCount,
  searchQuery,
  currentPage,
}: GiveawayContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);

  const handleUrlUpdate = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset page for new filters/search
    if (params.platform || params['sort-by'] || params.search !== undefined) {
      newParams.delete('page');
    }
    startTransition(() => {
      router.push(`${pathname}?${newParams.toString()}`);
    });
  };

  const handlePlatformChange = (platform: string) => {
    handleUrlUpdate({ platform: platform === 'all' ? '' : platform });
  };

  const handleSortChange = (sort: string) => {
    handleUrlUpdate({ 'sort-by': sort === 'date' ? '' : sort });
  };

  const handleSearch = (query: string) => {
    setInternalSearchQuery(query);
    handleUrlUpdate({ search: query });
  };

  const handlePageChange = (page: number) => {
    handleUrlUpdate({ page: page.toString() });
  };

  const showEmptyState = initialGiveaways.length === 0;
  const totalPages = Math.ceil(initialGiveaways.length / GAMES_PER_PAGE);
  const paginatedGiveaways = initialGiveaways.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="giveaways-section-heading"
      role="region"
    >
      <h2 id="giveaways-section-heading" className="sr-only">
        Game Giveaways List
      </h2>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search giveaways by title..."
        className="mb-6"
        initialValue={internalSearchQuery}
      />

      <GameFilters
        selectedPlatform={searchParams.get('platform') || 'all'}
        sortCriteria={searchParams.get('sort-by') || 'date'}
        onPlatformChange={handlePlatformChange}
        onSortChange={handleSortChange}
      />

      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {showEmptyState ? (
          <GameEmptyState
            onResetFilters={() => {
              // Clear all filters
              router.push(pathname);
            }}
          />
        ) : (
          <GameResults
            giveaways={paginatedGiveaways}
            totalFiltered={initialGiveaways.length}
            totalAll={initialUnfilteredCount}
            searchQuery={searchQuery}
            currentPage={currentPage}
            itemsPerPage={GAMES_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </motion.section>
  );
}
