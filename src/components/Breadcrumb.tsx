'use client';

import { faGamepad, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from './Image';

// Mapping for platform names to API slugs
const platformApiMap: { [key: string]: string } = {
  'Show all': 'all',
  PC: 'pc',
  Steam: 'steam',
  'Epic Games': 'epic-games-store',
  Ubisoft: 'ubisoft',
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
  VR: 'vr',
  'Battle.net': 'battlenet',
  Origin: 'origin',
  'DRM-Free': 'drm-free',
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
    <nav aria-label="Platform navigation" className="relative mb-8">
      {/* Modern header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGamepad}
            className="w-5 h-5 text-accent"
            aria-hidden="true"
          />
          <h3 className="text-lg font-semibold text-accent">
            Gaming Platforms
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent"></div>
      </div>

      {/* Modern platform selector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(platformApiMap).map(([displayName, slug]) => {
          const isSelected = selectedPlatform === slug;
          const icon = (
            <Image
              platform={displayName}
              alt={displayName}
              className="w-6 h-6"
              color={isSelected ? 'text-text' : 'text-accent'}
            />
          );

          return (
            <button
              key={slug}
              onClick={() => onPlatformChange(slug)}
              className={`
                group relative overflow-hidden
                flex flex-col items-center gap-2
                p-4 rounded-xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-accent/20
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                focus:scale-105 focus:shadow-lg focus:shadow-accent/20
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-accent to-accent/80 text-text border-accent shadow-lg shadow-accent/30'
                    : 'bg-secondary/50 text-accent border-secondary hover:border-accent/50 hover:bg-secondary/70 focus:border-accent/50 focus:bg-secondary/70'
                }
              `}
              aria-current={isSelected ? 'page' : undefined}
              aria-label={`Filter by ${displayName}`}
            >
              {/* Platform icon */}
              <div
                className={`
                  relative z-10 transition-transform duration-300
                  ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                `}
              >
                {icon}
              </div>

              {/* Platform name */}
              <span
                className={`
                 relative z-10 text-sm font-medium text-center transition-all duration-300
                 ${isSelected ? 'text-text' : 'text-accent group-hover:text-accent/90'}
               `}
              >
                {displayName}
              </span>

              {/* Active indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 z-20">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-4 h-4 text-text animate-pulse"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Hover effect overlay - WCAG AAA compliant */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br from-accent/25 to-transparent
                  overlay-transition
                  ${
                    isSelected
                      ? 'opacity-40'
                      : 'opacity-0 group-hover:opacity-100 group-focus:opacity-100'
                  }
                `}
                aria-hidden="true"
                style={{
                  // Ensure minimum contrast ratio for WCAG AAA
                  background: isSelected
                    ? 'linear-gradient(to bottom right, rgba(200, 213, 134, 0.4), transparent)'
                    : 'linear-gradient(to bottom right, rgba(200, 213, 134, 0.25), transparent)',
                }}
              ></div>
            </button>
          );
        })}
      </div>

      {/* Selected platform indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        <span>
          Currently showing:{' '}
          <span className="font-medium text-accent">
            {getSelectedPlatformName(selectedPlatform)}
          </span>
        </span>
      </div>
    </nav>
  );
}
