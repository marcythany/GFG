'use client';

import { useGiveaways } from '@/lib/hooks/useGiveaways';
import { PlatformOption, SortOption } from '@/types/giveaway';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import GameEmptyState from './GameEmptyState';
import GameFilters from './GameFilters';
import GameResults from './GameResults';

interface GameListProps {
  searchQuery?: string;
}

const GAMES_PER_PAGE = 12;

export default function GameList({ searchQuery = '' }: GameListProps = {}) {
  const {
    giveaways,
    filteredGiveaways,
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
    setCurrentPage(1);
  };

  const handleSortChange = (selectedSort: string) => {
    updateFilters({ 'sort-by': selectedSort.toLowerCase() as SortOption });
    setCurrentPage(1);
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

      {!loading && !error && filteredGiveaways.length > 0 && (
        <GameResults
          giveaways={filteredGiveaways}
          totalFiltered={filteredGiveaways.length}
          totalAll={giveaways.length}
          searchQuery={searchQuery}
          currentPage={currentPage}
          itemsPerPage={GAMES_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {!loading && !error && giveaways.length === 0 && (
        <GameEmptyState
          onResetFilters={() => {
            updateFilters({ platform: 'all', 'sort-by': 'date' });
            setCurrentPage(1);
          }}
        />
      )}
    </motion.section>
  );
}
