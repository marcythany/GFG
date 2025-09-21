'use client';

import { useEffect, useState } from 'react';
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GameListProps {
  // No props needed currently
}

export default function GameList({}: GameListProps = {}) {
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
        // The API returns a 201 with an empty array if no giveaways are found
        if (
          response.status === 201 ||
          !data ||
          (Array.isArray(data) && data.length === 0)
        ) {
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
  const filteredGiveaways = (Array.isArray(giveaways) ? giveaways : []).filter(
    (giveaway) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        giveaway.title.toLowerCase().includes(query) ||
        giveaway.description.toLowerCase().includes(query) ||
        giveaway.platforms.toLowerCase().includes(query) ||
        giveaway.type.toLowerCase().includes(query)
      );
    },
  );

  const paginatedGiveaways = filteredGiveaways.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
  );

  const handlePlatformChange = (selectedPlatform: string) => {
    // selectedPlatform is already a slug (e.g., 'steam', 'epic-games-store')
    // so we can use it directly
    setPlatform(selectedPlatform);
    setCurrentPage(1);
  };

  const handleSortChange = (selectedSort: string) => {
    setSortCriteria(selectedSort.toLowerCase());
    setCurrentPage(1);
  };

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
    <section
      aria-labelledby="giveaways-section-heading"
      role="region"
      className="animate-fade-in-up"
    >
      <h2 id="giveaways-section-heading" className="sr-only">
        Game Giveaways List
      </h2>

      {/* Modern filter and sort controls */}
      <div
        className="flex flex-col gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-secondary/30 to-primary/20 border border-secondary/50 backdrop-blur-sm"
        role="toolbar"
        aria-label="Filter and sort controls"
      >
        <Breadcrumb
          selectedPlatform={platform}
          onPlatformChange={handlePlatformChange}
        />
        <Dropdown onSortChange={handleSortChange} sortCriteria={sortCriteria} />
      </div>

      {/* Modern loading state */}
      {loading && (
        <div
          className="flex flex-col justify-center items-center py-16"
          role="status"
          aria-live="polite"
          aria-label="Loading game giveaways"
        >
          <div className="relative">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 border-secondary/30 border-t-accent"
              aria-hidden="true"
            ></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-transparent animate-pulse"></div>
          </div>
          <p className="text-muted text-sm mt-4 animate-pulse">
            Loading amazing giveaways...
          </p>
        </div>
      )}

      {/* Modern error state */}
      {error && (
        <div
          className="text-center py-12 px-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4" aria-hidden="true">
              ⚠️
            </div>
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-muted text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Modern results display */}
      {!loading && !error && giveaways.length > 0 && (
        <>
          <div
            className="mb-6 text-center animate-fade-in-up stagger-1"
            aria-live="polite"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <p className="text-accent text-sm font-medium" id="results-count">
                Showing {paginatedGiveaways.length} of{' '}
                {filteredGiveaways.length} giveaways
                {searchQuery && (
                  <span className="text-muted">
                    {' '}
                    (filtered from {giveaways.length} total)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div
            className="card-grid animate-fade-in-up stagger-2"
            role="list"
            aria-label="Game giveaways"
            aria-describedby="results-count"
          >
            {paginatedGiveaways.map((giveaway, index) => (
              <div
                key={giveaway.id}
                role="listitem"
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GameItem giveaway={giveaway} />
              </div>
            ))}
          </div>

          <div className="mt-8 animate-fade-in-up stagger-3">
            <Pagination
              totalItems={filteredGiveaways.length}
              itemsPerPage={GAMES_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* Modern empty state */}
      {!loading && !error && giveaways.length === 0 && (
        <div
          className="text-center py-16 px-6 animate-fade-in-up"
          role="status"
          aria-live="polite"
        >
          <div className="max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="text-8xl mb-4 animate-bounce" aria-hidden="true">
                🎮
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-full blur-xl"></div>
            </div>
            <h2 className="text-2xl font-semibold text-accent mb-3">
              No giveaways found
            </h2>
            <p className="text-muted mb-6">
              No giveaways match your current filters. Try adjusting your search
              criteria or browse all platforms.
            </p>
            <button
              onClick={() => {
                setPlatform('all');
                setSortCriteria('date');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-primary rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Show All Giveaways
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
