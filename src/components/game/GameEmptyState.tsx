'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface GameEmptyStateProps {
  onResetFilters: () => void;
}

export default function GameEmptyState({}: GameEmptyStateProps) {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const searchQuery = searchParams.get('search');
  const sortBy = searchParams.get('sort-by');

  // Determine the message based on active filters
  const hasFilters = Boolean(platform || searchQuery || sortBy);
  const platformName = platform
    ? platform
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

  let title = 'No giveaways found';
  let message = 'No giveaways match your current filters.';

  if (searchQuery && platform) {
    title = 'No results found';
    message = `No giveaways found for "${searchQuery}" on ${platformName}. Try a different search term or platform.`;
  } else if (searchQuery) {
    title = 'No results found';
    message = `No giveaways found for "${searchQuery}". Try a different search term or browse all giveaways.`;
  } else if (platform) {
    title = `No ${platformName} giveaways available`;
    message = `There are currently no active giveaways for ${platformName}. Check back later or browse other platforms.`;
  } else if (hasFilters) {
    message =
      'No giveaways match your current filters. Try adjusting your criteria.';
  } else {
    title = 'No giveaways available';
    message =
      'There are currently no active giveaways. Please check back later!';
  }

  const handleResetFilters = () => {
    // Force a full page reload to reset all state
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="flex items-center justify-center min-h-[60vh] px-4 py-12 sm:px-6 sm:py-16"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-2xl text-center">
        <motion.div
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: 'easeInOut',
          }}
          className="relative mb-8 flex justify-center"
        >
          <div className="text-6xl sm:text-7xl md:text-8xl mb-6" aria-hidden="true">
            🎮
          </div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-5">
          {title}
        </h2>
        <p className="text-muted mb-8 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          {message}
        </p>

        {hasFilters && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResetFilters}
            className="px-6 py-3.5 text-primary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[200px]"
            style={{
              background:
                'linear-gradient(to right, var(--color-accent), color-mix(in srgb, var(--color-accent), transparent 20%))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(to right, color-mix(in srgb, var(--color-accent), transparent 10%), color-mix(in srgb, var(--color-accent), transparent 30%))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(to right, var(--color-accent), color-mix(in srgb, var(--color-accent), transparent 20%))';
            }}
            aria-label="Clear all filters and show all giveaways"
          >
            Show All Giveaways
          </motion.button>
        )}

        {!hasFilters && (
          <div className="text-sm sm:text-base text-muted mt-8 space-y-2">
            <p>💡 Tip: New giveaways are added regularly.</p>
            <p>Bookmark this page and check back soon!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
