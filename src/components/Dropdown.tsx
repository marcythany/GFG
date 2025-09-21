'use client';

import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons/faArrowsUpDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DropdownProps {
  onSortChange: (criteria: string) => void;
  onTypeChange?: (type: string) => void;
  sortCriteria?: string;
  type?: string;
}

const sortingOptions = {
  SortBy: [
    { label: 'Date', value: 'date', icon: '📅' },
    { label: 'Value', value: 'value', icon: '💰' },
    { label: 'Popularity', value: 'popularity', icon: '🔥' },
  ],
  Types: [
    { label: 'All', value: 'all', icon: '🎮' },
    { label: 'Game', value: 'game', icon: '🎯' },
    { label: 'DLC', value: 'dlc', icon: '📦' },
    { label: 'Early Access', value: 'early-access', icon: '🚀' },
    { label: 'Beta', value: 'beta', icon: '🧪' },
  ],
};

export default function Dropdown({
  onSortChange,
  onTypeChange,
  sortCriteria = 'date',
  type = 'all',
}: DropdownProps) {
  const handleSortClick = (criteria: string) => {
    onSortChange(criteria.toLowerCase());
  };

  const handleTypeClick = (selectedType: string) => {
    if (onTypeChange) {
      onTypeChange(selectedType);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Sort Options */}
      <div className="relative">
        <label htmlFor="sort-select" className="sr-only">
          Sort giveaways by
        </label>

        {/* Modern dropdown container */}
        <div className="relative group">
          <select
            id="sort-select"
            value={sortCriteria}
            onChange={(e) => handleSortClick(e.target.value)}
            className="
              appearance-none bg-gradient-to-r from-primary to-secondary/50
              border-2 border-secondary hover:border-accent/50
              text-accent px-4 py-3 pr-12 rounded-xl
              focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none
              transition-all duration-300 cursor-pointer
              hover:shadow-lg hover:shadow-accent/10
              min-w-[180px]
            "
            aria-describedby="sort-help"
            aria-label="Sort giveaways by criteria"
            aria-expanded="false"
            role="combobox"
          >
            {sortingOptions.SortBy.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <FontAwesomeIcon
              icon={faArrowsUpDown}
              className="w-5 h-5 text-accent transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
          </div>

          {/* Dropdown glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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

          {/* Modern dropdown container */}
          <div className="relative group">
            <select
              id="type-select"
              value={type}
              onChange={(e) => handleTypeClick(e.target.value)}
              className="
                appearance-none bg-gradient-to-r from-primary to-secondary/50
                border-2 border-secondary hover:border-accent/50
                text-accent px-4 py-3 pr-12 rounded-xl
                focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none
                transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:shadow-accent/10
                min-w-[160px]
              "
              aria-describedby="type-help"
              aria-label="Filter giveaways by type"
              aria-expanded="false"
              role="combobox"
            >
              {sortingOptions.Types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <FontAwesomeIcon
                icon={faFilter}
                className="w-5 h-5 text-accent transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
            </div>

            {/* Dropdown glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div id="type-help" className="sr-only">
            Select a giveaway type to filter results. Current type: {type}
          </div>
        </div>
      )}
    </div>
  );
}
