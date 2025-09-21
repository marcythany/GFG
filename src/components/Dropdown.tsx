'use client';

interface DropdownProps {
  onSortChange: (criteria: string) => void;
  onPlatformChange: (platform: string) => void;
  onTypeChange?: (type: string) => void;
  platform?: string;
  sortCriteria?: string;
  type?: string;
}

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
  Types: ['All', 'Game', 'DLC', 'Early Access', 'Beta'],
};

export default function Dropdown({
  onSortChange,
  onPlatformChange,
  onTypeChange,
  platform = 'all',
  sortCriteria = 'date',
  type = 'all',
}: DropdownProps) {
  const handleSortClick = (criteria: string) => {
    onSortChange(criteria);
  };

  const handlePlatformClick = (platform: string) => {
    onPlatformChange(platform);
  };

  const handleTypeClick = (selectedType: string) => {
    if (onTypeChange) {
      onTypeChange(selectedType);
    }
  };

  return (
    <>
      {/* Platform Filter */}
      <div className="relative">
        <label htmlFor="platform-select" className="sr-only">
          Filter by gaming platform
        </label>
        <select
          id="platform-select"
          value={platform}
          onChange={(e) => handlePlatformClick(e.target.value)}
          className="appearance-none bg-primary-color border border-secondary-color text-highlight-color px-4 py-2 pr-8 rounded-lg focus:border-accent-color focus:ring-2 focus:ring-accent-color focus:ring-offset-2 focus:outline-none transition-all"
          aria-describedby="platform-help"
          aria-label="Filter giveaways by gaming platform"
          aria-expanded="false"
          role="combobox"
        >
          {sortingOptions.Platforms.map((platform) => (
            <option key={platform} value={platformApiMap[platform] || 'all'}>
              {platform}
            </option>
          ))}
        </select>
        <div
          className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-alt-text-color"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div id="platform-help" className="sr-only">
          Select a gaming platform to filter giveaways. Current selection:{' '}
          {platform}
        </div>
      </div>

      {/* Sort Options */}
      <div className="relative">
        <label htmlFor="sort-select" className="sr-only">
          Sort giveaways by
        </label>
        <select
          id="sort-select"
          value={sortCriteria}
          onChange={(e) => handleSortClick(e.target.value)}
          className="appearance-none bg-primary-color border border-secondary-color text-highlight-color px-4 py-2 pr-8 rounded-lg focus:border-accent-color focus:ring-2 focus:ring-accent-color focus:ring-offset-2 focus:outline-none transition-all"
          aria-describedby="sort-help"
          aria-label="Sort giveaways by criteria"
          aria-expanded="false"
          role="combobox"
        >
          {sortingOptions.SortBy.map((criteria) => (
            <option key={criteria} value={criteria.toLowerCase()}>
              {criteria}
            </option>
          ))}
        </select>
        <div
          className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-alt-text-color"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div id="sort-help" className="sr-only">
          Choose how to sort the giveaways. Current sorting: {sortCriteria}
        </div>
      </div>

      {/* Type Filter */}
      {onTypeChange && (
        <div className="relative">
          <label htmlFor="type-select" className="sr-only">
            Filter by giveaway type
          </label>
          <select
            id="type-select"
            value={type}
            onChange={(e) => handleTypeClick(e.target.value)}
            className="appearance-none bg-primary-color border border-secondary-color text-highlight-color px-4 py-2 pr-8 rounded-lg focus:border-accent-color focus:ring-2 focus:ring-accent-color focus:ring-offset-2 focus:outline-none transition-all"
            aria-describedby="type-help"
            aria-label="Filter giveaways by type"
            aria-expanded="false"
            role="combobox"
          >
            {sortingOptions.Types.map((typeOption) => (
              <option key={typeOption} value={typeOption.toLowerCase()}>
                {typeOption}
              </option>
            ))}
          </select>
          <div
            className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 text-alt-text-color"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div id="type-help" className="sr-only">
            Select a giveaway type to filter results. Current type: {type}
          </div>
        </div>
      )}
    </>
  );
}
