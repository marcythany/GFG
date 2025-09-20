"use client";

import { useState, useEffect, useMemo } from "react";
import GameItem from "./GameItem";
import Dropdown from "./Dropdown";
import Pagination from "./Pagination";

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

export default function GameList() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState("Date");
  const [platform, setPlatform] = useState("Show all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchGiveaways() {
      try {
        const response = await fetch(
          "https://gfg-proxy-kohl.vercel.app/api/liveGiveaways"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch giveaways");
        }
        const data = await response.json();
        setGiveaways(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchGiveaways();
  }, []);

  const filteredAndSortedGiveaways = useMemo(() => {
    let result = [...giveaways];

    // Filter by platform
    if (platform !== "Show all") {
      result = result.filter((giveaway) =>
        giveaway.platforms.toLowerCase().includes(platform.toLowerCase())
      );
    }

    // Sort by criteria
    switch (sortCriteria) {
      case "Date":
        result.sort(
          (a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
        );
        break;
      case "Value":
        result.sort((a, b) => {
          const worthA = parseFloat(a.worth.replace("$", ""));
          const worthB = parseFloat(b.worth.replace("$", ""));
          return worthB - worthA;
        });
        break;
      case "Popularity":
        result.sort((a, b) => b.users - a.users);
        break;
    }

    return result;
  }, [giveaways, sortCriteria, platform]);

  const paginatedGiveaways = useMemo(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    return filteredAndSortedGiveaways.slice(startIndex, startIndex + GAMES_PER_PAGE);
  }, [filteredAndSortedGiveaways, currentPage]);

  if (loading) {
    return <p className="text-center">Loading giveaways...</p>;
  }

  if (error) {
    return <p className="text-center text-danger-color">Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <Dropdown onSortChange={setSortCriteria} onPlatformChange={setPlatform} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedGiveaways.map((giveaway) => (
          <GameItem key={giveaway.id} giveaway={giveaway} />
        ))}
      </div>
      <Pagination
        totalItems={filteredAndSortedGiveaways.length}
        itemsPerPage={GAMES_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
