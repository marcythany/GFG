'use client';

import { useGiveaways, GAMES_PER_PAGE } from '@/lib/hooks/useGiveaways';
import { PlatformOption, SortOption } from '@/types/giveaway';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import GameEmptyState from './GameEmptyState';
import GameFilters from './GameFilters';
import GameResults from './GameResults';

interface GameListProps {
  searchQuery?: string;
}

export default function GameList({ searchQuery = '' }: GameListProps = {}) {
  const {
    giveaways, // Now paginated
    unfilteredGiveaways,
    filteredGiveaways, // Full filtered list
    loading,
    error,
    filters,
    currentPage,
    updateFilters,
    searchGiveaways,
    setCurrentPage,
  } = useGiveaways();

  // Update search when prop changes
  useEffect(() => {
    searchGiveaways(searchQuery);
  }, [searchQuery, searchGiveaways]);

  const handlePlatformChange = (selectedPlatform: string) => {
    updateFilters({ platform: selectedPlatform as PlatformOption });
    // Resetting page is handled by the hook
  };

  const handleSortChange = (selectedSort: string) => {
    updateFilters({ 'sort-by': selectedSort.toLowerCase() as SortOption });
    // Resetting page is handled by the hook
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center py-12"
        role="status"
        aria-live="polite"
        aria-label="Loading game giveaways"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-8 w-8 border-b-2 border-accent mb-4"
          aria-hidden="true"
        />
        <p className="text-muted text-sm">Loading giveaways...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-muted text-sm mt-2">
          Please try again later or refresh the page.
        </p>
      </motion.div>
    );
  }

  // Show empty state if there are no giveaways after filtering,
  // or if the initial fetch returns nothing.
  const showEmptyState = !loading && !error && filteredGiveaways.length === 0;

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

      <GameFilters
        selectedPlatform={filters.platform || 'all'}
        sortCriteria={filters['sort-by'] || 'date'}
        onPlatformChange={handlePlatformChange}
        onSortChange={handleSortChange}
      />

      {showEmptyState ? (
        <GameEmptyState
          onResetFilters={() => {
            updateFilters({ platform: 'all', 'sort-by': 'date' });
            searchGiveaways(''); // Also clear search
          }}
        />
      ) : (
        <GameResults
          giveaways={giveaways} // Pass the paginated giveaways
          totalFiltered={filteredGiveaways.length}
          totalAll={unfilteredGiveaways.length} // Pass the total from before client search
          searchQuery={searchQuery}
          currentPage={currentPage}
          itemsPerPage={GAMES_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.section>
  );
}
