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
      className="flex items-center justify-center min-h-screen px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full text-center">
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
          className="px-6 py-3 text-primary rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
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
        >
          Show All Giveaways
        </motion.button>
      </div>
    </motion.div>
  );
}
