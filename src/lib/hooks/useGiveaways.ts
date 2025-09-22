'use client';

import { fetchGiveaways } from '@/lib/api';
import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from 'react';

export const GAMES_PER_PAGE = 12;

export function useGiveaways(initialFilters: GiveawayFilters = {}) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GiveawayFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Optimistic search for instant UI feedback
  const [optimisticSearch, setOptimisticSearch] = useOptimistic('');

  useEffect(() => {
    startTransition(async () => {
      setError(null);
      try {
        const data = await fetchGiveaways(filters);
        setGiveaways(data);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      }
    });
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<GiveawayFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const searchGiveaways = useCallback(
    (query: string) => {
      startTransition(() => {
        setOptimisticSearch(query);
      });
    },
    [setOptimisticSearch],
  );

  // Filter giveaways based on search query
  const filteredGiveaways = useMemo(() => {
    if (!optimisticSearch.trim()) return giveaways;

    const searchTerm = optimisticSearch.toLowerCase();
    return giveaways.filter(
      (giveaway) =>
        giveaway.title.toLowerCase().includes(searchTerm) ||
        giveaway.description.toLowerCase().includes(searchTerm) ||
        giveaway.platforms.toLowerCase().includes(searchTerm) ||
        giveaway.type.toLowerCase().includes(searchTerm),
    );
  }, [giveaways, optimisticSearch]);

  const paginatedGiveaways = useMemo(
    () =>
      filteredGiveaways.slice(
        (currentPage - 1) * GAMES_PER_PAGE,
        currentPage * GAMES_PER_PAGE,
      ),
    [filteredGiveaways, currentPage],
  );

  const totalPages = Math.ceil(filteredGiveaways.length / GAMES_PER_PAGE);

  return {
    giveaways: paginatedGiveaways, // This is the paginated list for the current page
    unfilteredGiveaways: giveaways, // This is the list from the API, before client-side search
    filteredGiveaways, // This is the full list after client-side search
    loading: isPending,
    error,
    filters,
    currentPage,
    totalPages,
    updateFilters,
    searchGiveaways,
    setCurrentPage,
  };
}
