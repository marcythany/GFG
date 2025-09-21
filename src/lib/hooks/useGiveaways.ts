'use client';

import { fetchGiveaways } from '@/lib/api';
import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import { startTransition, useEffect, useOptimistic, useState } from 'react';

const GAMES_PER_PAGE = 12;

export function useGiveaways(initialFilters: GiveawayFilters = {}) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GiveawayFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Optimistic search for instant UI feedback
  const [optimisticSearch, setOptimisticSearch] = useOptimistic('');

  useEffect(() => {
    async function loadGiveaways() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGiveaways(filters);
        setGiveaways(data);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    }

    loadGiveaways();
  }, [filters]);

  const updateFilters = (newFilters: Partial<GiveawayFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const searchGiveaways = (query: string) => {
    startTransition(() => {
      setOptimisticSearch(query);
    });
  };

  // Filter giveaways based on search query
  const filteredGiveaways = giveaways.filter((giveaway) => {
    if (!optimisticSearch.trim()) return true;

    const searchTerm = optimisticSearch.toLowerCase();
    return (
      giveaway.title.toLowerCase().includes(searchTerm) ||
      giveaway.description.toLowerCase().includes(searchTerm) ||
      giveaway.platforms.toLowerCase().includes(searchTerm) ||
      giveaway.type.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedGiveaways = filteredGiveaways.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
  );

  const totalPages = Math.ceil(filteredGiveaways.length / GAMES_PER_PAGE);

  return {
    giveaways: paginatedGiveaways,
    allGiveaways: giveaways,
    filteredGiveaways,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    updateFilters,
    searchGiveaways,
    setCurrentPage,
  };
}
