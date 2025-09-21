'use client';

import { useCallback, useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import Dropdown from './Dropdown';
import GameItem from './GameItem';
import Pagination from './Pagination';

// Define the type for a single giveaway
interface Giveaway {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  end_date: string;
  platforms: string;
  users: number;
  type: string;
}

const GAMES_PER_PAGE = 12;

// Mapping for platform names to API slugs
const platformApiMap: { [key: string]: string } = {
  'Show all': 'all',
  PC: 'pc',
  Steam: 'steam',
  'Epic Games': 'epic-games-store',
  GOG: 'gog',
  'Nintendo Switch': 'switch',
  'Playstation 5': 'ps5',
  'Xbox Series X|S': 'xbox-series-xs',
  'Playstation 4': 'ps4',
  'Xbox One': 'xbox-one',
  Android: 'android',
  iOS: 'ios',
  'Itch.io': 'itchio',
  'Xbox 360': 'xbox-360',
};

interface GameListProps {
  onSearch?: (query: string) => void;
}

export default function GameList({ onSearch }: GameListProps = {}) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortCriteria, setSortCriteria] = useState('date');
  const [platform, setPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchGiveaways() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          'sort-by': sortCriteria,
          platform: platform,
        });

        const response = await fetch(`/api/giveaways?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch giveaways');
        }

        const data = await response.json();
        // The API returns a 204 with an empty body if no giveaways are found
        if (response.status === 204 || !data) {
          setGiveaways([]);
        } else {
          setGiveaways(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGiveaways();
  }, [sortCriteria, platform]);

  // Reset search when filters change
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [sortCriteria, platform]);

  // Filter giveaways based on search query
  const filteredGiveaways = giveaways.filter((giveaway) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      giveaway.title.toLowerCase().includes(query) ||
      giveaway.description.toLowerCase().includes(query) ||
      giveaway.platforms.toLowerCase().includes(query) ||
      giveaway.type.toLowerCase().includes(query)
    );
  });

  const paginatedGiveaways = filteredGiveaways.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
  );

  const handlePlatformChange = (selectedPlatform: string) => {
    setPlatform(platformApiMap[selectedPlatform] || 'all');
    setCurrentPage(1);
  };

  const handleSortChange = (selectedSort: string) => {
    setSortCriteria(selectedSort);
    setCurrentPage(1);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      if (onSearch) {
        onSearch(query);
      }
    },
    [onSearch],
  );

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center py-12"
        role="status"
        aria-live="polite"
        aria-label="Loading game giveaways"
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"
          aria-hidden="true"
        ></div>
        <p className="text-muted text-sm">Loading giveaways...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="assertive">
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-muted text-sm mt-2">
          Please try again later or refresh the page.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="giveaways-section-heading" role="region">
      <h2 id="giveaways-section-heading" className="sr-only">
        Game Giveaways List
      </h2>

      <div
        className="flex flex-col gap-6 mb-8"
        role="toolbar"
        aria-label="Filter and sort controls"
      >
        <Breadcrumb
          selectedPlatform={platform}
          onPlatformChange={handlePlatformChange}
        />
        <Dropdown onSortChange={handleSortChange} sortCriteria={sortCriteria} />
      </div>

      {loading && (
        <div
          className="flex justify-center items-center py-12"
          role="status"
          aria-live="polite"
          aria-label="Loading game giveaways"
        >
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"
            aria-hidden="true"
          ></div>
          <span className="sr-only">Loading giveaways...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8" role="alert" aria-live="assertive">
          <p className="text-destructive font-medium">Error: {error}</p>
          <p className="text-muted text-sm mt-2">
            Please try again later or refresh the page.
          </p>
        </div>
      )}

      {!loading && !error && giveaways.length > 0 && (
        <>
          <div className="mb-4 text-center" aria-live="polite">
            <p className="text-accent text-sm" id="results-count">
              Showing {paginatedGiveaways.length} of {filteredGiveaways.length}{' '}
              giveaways
              {searchQuery && (
                <span className="text-muted">
                  {' '}
                  (filtered from {giveaways.length} total)
                </span>
              )}
            </p>
          </div>

          <div
            className="card-grid"
            role="list"
            aria-label="Game giveaways"
            aria-describedby="results-count"
          >
            {paginatedGiveaways.map((giveaway) => (
              <div key={giveaway.id} role="listitem">
                <GameItem giveaway={giveaway} />
              </div>
            ))}
          </div>

          <Pagination
            totalItems={filteredGiveaways.length}
            itemsPerPage={GAMES_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {!loading && !error && giveaways.length === 0 && (
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="text-6xl mb-4" aria-hidden="true">
            🎮
          </div>
          <h2 className="text-xl font-semibold text-accent mb-2">
            No giveaways found
          </h2>
          <p className="text-muted">
            No giveaways match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      )}
    </section>
  );
}
