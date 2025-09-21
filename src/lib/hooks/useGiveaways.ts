'use client';

import { fetchGiveaways } from '@/lib/api';
import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from 'react';

const GAMES_PER_PAGE = 12;

export function useGiveaways(initialFilters: GiveawayFilters = {}) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GiveawayFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Optimistic search for instant UI feedback
  const [optimisticSearch, setOptimisticSearch] = useOptimistic('');
  const optimisticSearchRef = useRef('');

  useEffect(() => {
    optimisticSearchRef.current = optimisticSearch;
  }, [optimisticSearch]);

  useEffect(() => {
    console.log('useEffect running with filters:', filters);
    async function loadGiveaways() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGiveaways(filters);
        console.log('Fetched giveaways, setting state');
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
    console.log('updateFilters called with:', newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const searchGiveaways = useCallback(
    (query: string) => {
      console.log('searchGiveaways called with query:', query);
      startTransition(() => {
        if (query !== optimisticSearchRef.current) {
          setOptimisticSearch(query);
        }
      });
    },
    [setOptimisticSearch],
  );

  // Filter giveaways based on search query
  const filteredGiveaways = useMemo(() => {
    console.log(
      'useMemo running with giveaways length:',
      giveaways.length,
      'optimisticSearch:',
      optimisticSearch,
    );
    console.time('filter-giveaways');
    const result = giveaways.filter((giveaway) => {
      if (!optimisticSearch.trim()) return true;

      const searchTerm = optimisticSearch.toLowerCase();
      return (
        giveaway.title.toLowerCase().includes(searchTerm) ||
        giveaway.description.toLowerCase().includes(searchTerm) ||
        giveaway.platforms.toLowerCase().includes(searchTerm) ||
        giveaway.type.toLowerCase().includes(searchTerm)
      );
    });
    console.timeEnd('filter-giveaways');
    console.log(
      `Filtered ${giveaways.length} giveaways to ${result.length} results for query: "${optimisticSearch}"`,
    );
    return result;
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
