import Pagination from '@/components/common/Pagination';
import { Giveaway } from '@/types/giveaway';
import { motion } from 'framer-motion';
import React from 'react';
import GameItem from './GameItem';

interface GameResultsProps {
  giveaways: Giveaway[];
  totalFiltered: number;
  totalAll: number;
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default React.memo(function GameResults({
  giveaways,
  totalFiltered,
  totalAll,
  searchQuery = '',
  currentPage,
  itemsPerPage,
  onPageChange,
}: GameResultsProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 text-center"
        aria-live="polite"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-accent rounded-full"
          />
          <p className="text-accent text-sm font-medium" id="results-count">
            Showing {giveaways.length} of {totalFiltered} giveaways
            {searchQuery && (
              <span className="text-muted">
                {' '}
                (filtered from {totalAll} total)
              </span>
            )}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card-grid"
        role="list"
        aria-label="Game giveaways"
        aria-describedby="results-count"
      >
        {giveaways.map((giveaway, index) => (
          <motion.div
            key={giveaway.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}
            role="listitem"
          >
            <GameItem giveaway={giveaway} index={index} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Pagination
          totalItems={totalFiltered}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </motion.div>
    </>
  );
});
