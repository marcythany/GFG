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

const GAMES_PER_PAGE = 12; // This seems to be handled by the proxy, but we'll keep it for pagination logic if needed.

// Mapping for platform names to API slugs
const platformApiMap: { [key: string]: string } = {
  'Show all': 'all', // Custom value for our logic
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
  const [sortCriteria, setSortCriteria] = useState('date'); // Default to API's 'date'
  const [platform, setPlatform] = useState('all');
  const [currentPage, setCurrentPage] = useState(1); // Pagination may need to be re-evaluated

  useEffect(() => {
    async function fetchGiveaways() {
      setLoading(true);
      setError(null);
      try {
        // Using the proxy URL from the original project
        const proxyUrl = 'https://gfg-proxy-kohl.vercel.app/api/liveGiveaways';

        // The proxy seems to handle the filtering, let's assume it forwards the params.
        // If not, we would construct the URL like this:
        // const baseUrl = "https://www.gamerpower.com/api/giveaways";
        // const platformParam = platform === "all" ? "" : `&platform=${platformApiMap[platform]}`;
        // const sortParam = `&sort-by=${sortCriteria}`;
        // const apiUrl = `${baseUrl}?${platformParam}${sortParam}`;

        const response = await fetch(proxyUrl); // For now, we stick to the simpler proxy call

        if (!response.ok) {
          throw new Error('Failed to fetch giveaways');
        }
        const data = await response.json();

        // The API doesn't seem to support pagination, so we'll do it on the client
        // Also, we need to filter and sort on the client since we are using a simple proxy endpoint
        let processedData = [...data];

        // Filter by platform
        if (platform !== 'all') {
          processedData = processedData.filter((giveaway) =>
            giveaway.platforms.toLowerCase().includes(platform.toLowerCase()),
          );
        }

        // Sort by criteria
        switch (sortCriteria) {
          case 'date':
            processedData.sort(
              (a, b) =>
                new Date(b.published_date).getTime() -
                new Date(a.published_date).getTime(),
            );
            break;
          case 'value':
            processedData.sort((a, b) => {
              const worthA = parseFloat(a.worth.replace('$', ''));
              const worthB = parseFloat(b.worth.replace('$', ''));
              return worthB - worthA;
            });
            break;
          case 'popularity':
            processedData.sort((a, b) => b.users - a.users);
            break;
        }

        setGiveaways(processedData);
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
    </div>
  );
}
