'use client';

import { useEffect, useState } from 'react';
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

export default function GameList() {
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

  const paginatedGiveaways = giveaways.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
  );

  const handlePlatformChange = (selectedPlatform: string) => {
    setPlatform(platformApiMap[selectedPlatform] || 'all');
    setCurrentPage(1);
  };

  const handleSortChange = (selectedSort: string) => {
    setSortCriteria(selectedSort.toLowerCase());
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center py-12"
        role="status"
        aria-live="polite"
        aria-label="Loading game giveaways"
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading giveaways...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="assertive">
        <p className="text-danger-color font-medium">Error: {error}</p>
        <p className="text-alt-text-color text-sm mt-2">
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
        className="flex-responsive mb-8"
        role="toolbar"
        aria-label="Filter and sort controls"
      >
        <Dropdown
          onSortChange={handleSortChange}
          onPlatformChange={handlePlatformChange}
          platform={platform}
          sortCriteria={sortCriteria}
        />
      </div>

      {loading && (
        <div
          className="flex justify-center items-center py-12"
          role="status"
          aria-live="polite"
          aria-label="Loading game giveaways"
        >
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color"
            aria-hidden="true"
          ></div>
          <span className="sr-only">Loading giveaways...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8" role="alert" aria-live="assertive">
          <p className="text-danger-color font-medium">Error: {error}</p>
          <p className="text-alt-text-color text-sm mt-2">
            Please try again later or refresh the page.
          </p>
        </div>
      )}

      {!loading && !error && giveaways.length > 0 && (
        <>
          <div className="mb-4 text-center" aria-live="polite">
            <p className="text-highlight-color text-sm" id="results-count">
              Showing {paginatedGiveaways.length} of {giveaways.length}{' '}
              giveaways
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
            totalItems={giveaways.length}
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
          <h2 className="text-xl font-semibold text-highlight-color mb-2">
            No giveaways found
          </h2>
          <p className="text-alt-text-color">
            No giveaways match your current filters. Try adjusting your search
            criteria.
          </p>
        </div>
      )}
    </section>
  );
}
