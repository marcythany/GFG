'use client';

import Image from '@/components/Image';
import { faGamepad, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  return (
    <nav aria-label="Platform navigation" className="relative mb-4 md:mb-6">
      <div className="flex items-center gap-3 mb-2 md:mb-3">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faGamepad}
            className="w-4 h-4 md:w-5 md:h-5 text-accent"
            aria-hidden="true"
          />
          <h3 className="text-base md:text-lg font-semibold text-accent">
            Gaming Platforms
          </h3>
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background:
              'linear-gradient(to right, color-mix(in srgb, var(--color-accent), transparent 70%), transparent)',
          }}
        ></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
        {Object.entries(platformApiMap).map(([displayName, slug]) => {
          const isSelected = selectedPlatform === slug;

          return (
            <button
              key={slug}
              onClick={() => onPlatformChange(slug)}
              className={`
                group relative overflow-hidden w-36 h-16 md:h-20
                flex flex-col items-center gap-1 md:gap-2
                p-2 md:p-3 rounded-xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:shadow-accent/20
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                focus:scale-105 focus:shadow-lg focus:shadow-accent/20
                ${
                  isSelected
                    ? 'text-primary border-accent shadow-lg shadow-accent/30'
                    : 'bg-secondary/50 text-accent border-secondary hover:border-accent/50 hover:bg-secondary/70 focus:border-accent/50 focus:bg-secondary/70'
                }
              `}
              style={
                isSelected
                  ? {
                      background:
                        'linear-gradient(to bottom right, var(--color-accent), color-mix(in srgb, var(--color-accent), transparent 20%))',
                    }
                  : undefined
              }
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
                <Image
                  platform={displayName}
                  alt={displayName}
                  className="w-5 h-5 md:w-6 md:h-6"
                  color={isSelected ? 'text-primary' : 'text-accent'}
                />
              </div>

              {/* Platform name */}
              <span
                className={`
                  relative z-10 text-xs md:text-sm font-medium text-center transition-all duration-300
                  ${isSelected ? 'text-primary' : 'text-accent group-hover:text-accent/90'}
                `}
              >
                {displayName}
              </span>

              {/* Active indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 md:top-2 md:right-2 z-20">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Hover effect overlay - WCAG AAA compliant */}
              <div
                className={`
                  absolute inset-0 overlay-transition
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
                    ? 'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent), transparent 60%), transparent)'
                    : 'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent), transparent 75%), transparent)',
                }}
              ></div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
