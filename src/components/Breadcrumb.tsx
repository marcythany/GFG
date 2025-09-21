'use client';

import { ChevronRight } from 'lucide-react';

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

interface BreadcrumbProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export default function Breadcrumb({
  selectedPlatform,
  onPlatformChange,
}: BreadcrumbProps) {
  // Get the display name for the selected platform
  const getSelectedPlatformName = (platformSlug: string): string => {
    const entry = Object.entries(platformApiMap).find(
      ([, slug]) => slug === platformSlug,
    );
    return entry ? entry[0] : 'Show all';
  };

  return (
    <nav
      aria-label="Platform navigation"
      className="flex items-center space-x-2 text-sm mb-6"
    >
      <span className="text-muted">Platforms:</span>

      <div className="flex items-center space-x-2 flex-wrap">
        {/* Show all platforms as clickable items */}
        {Object.entries(platformApiMap).map(([displayName, slug]) => (
          <div key={slug} className="flex items-center">
            <button
              onClick={() => onPlatformChange(slug)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedPlatform === slug
                  ? 'bg-accent text-primary shadow-sm'
                  : 'bg-secondary text-accent hover:bg-secondary/80 hover:text-accent/80'
              }`}
              aria-current={selectedPlatform === slug ? 'page' : undefined}
              aria-label={`Filter by ${displayName}`}
            >
              {displayName}
            </button>

            {/* Add separator except for the last item */}
            {displayName !== 'Xbox 360' && (
              <ChevronRight
                className="w-4 h-4 text-muted mx-1"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
