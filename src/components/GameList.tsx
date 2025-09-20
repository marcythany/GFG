'use client';

import { useState, useEffect } from 'react';
import GameItem from './GameItem';
import Dropdown from './Dropdown';
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

  if (loading) {
    return <p className="text-center">Loading giveaways...</p>;
  }

  if (error) {
    return <p className="text-center text-danger-color">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <Dropdown
          onSortChange={handleSortChange}
          onPlatformChange={handlePlatformChange}
        />
      </div>
      {giveaways.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedGiveaways.map((giveaway) => (
              <GameItem key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
          <Pagination
            totalItems={giveaways.length}
            itemsPerPage={GAMES_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center">
          No giveaways found for the selected criteria.
        </p>
      )}
    </div>
  );
}
