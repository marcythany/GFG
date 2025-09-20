'use client';

import { useState } from 'react';

interface DropdownProps {
  onSortChange: (criteria: string) => void;
  onPlatformChange: (platform: string) => void;
}

const sortingOptions = {
  Platforms: [
    'Show all',
    'PC',
    'Steam',
    'Epic Games',
    'GOG',
    'Nintendo Switch',
    'Playstation 5',
    'Xbox Series X|S',
    'Playstation 4',
    'Xbox One',
    'Android',
    'iOS',
    'Itch.io',
    'Xbox 360',
  ],
  SortBy: ['Date', 'Value', 'Popularity'],
};

export default function Dropdown({
  onSortChange,
  onPlatformChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortClick = (criteria: string) => {
    onSortChange(criteria);
    setIsOpen(false);
  };

  const handlePlatformClick = (platform: string) => {
    onPlatformChange(platform);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-secondary-color shadow-sm px-4 py-2 bg-primary-color text-sm font-medium text-highlight-color hover:bg-secondary-color focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
        >
          Sort by
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-auto rounded-md shadow-lg bg-primary-color ring-1 ring-black ring-opacity-5 flex"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-2">
              <h3 className="font-bold text-lg text-accent-color">Platforms</h3>
              <div className="flex flex-col">
                {sortingOptions.Platforms.map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="block px-4 py-2 text-sm text-highlight-color hover:bg-secondary-color"
                    onClick={() => handlePlatformClick(platform)}
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
            <div className="px-4 py-2">
              <h3 className="font-bold text-lg text-accent-color">Sort By</h3>
              <div className="flex flex-col">
                {sortingOptions.SortBy.map((criteria) => (
                  <a
                    key={criteria}
                    href="#"
                    className="block px-4 py-2 text-sm text-highlight-color hover:bg-secondary-color"
                    onClick={() => handleSortClick(criteria)}
                  >
                    {criteria}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
