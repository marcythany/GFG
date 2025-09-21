'use client';

import { motion } from 'framer-motion';

interface GameEmptyStateProps {
  onResetFilters: () => void;
}

export default function GameEmptyState({
  onResetFilters,
}: GameEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-6"
      role="status"
      aria-live="polite"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="relative mb-6"
        >
          <div className="text-8xl mb-4" aria-hidden="true">
            🎮
          </div>
        </motion.div>
        <h2 className="text-2xl font-semibold text-accent mb-3">
          No giveaways found
        </h2>
        <p className="text-muted mb-6">
          No giveaways match your current filters. Try adjusting your search
          criteria or browse all platforms.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onResetFilters}
          className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-primary rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Show All Giveaways
        </motion.button>
      </div>
    </motion.div>
  );
}
