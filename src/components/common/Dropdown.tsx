'use client';

import { Select } from '@/components/ui/Select';

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
        <Select
          options={sortingOptions.SortBy}
          value={sortCriteria}
          onChange={handleSortClick}
          aria-label="Sort giveaways by criteria"
          aria-describedby="sort-help"
          className="min-w-[180px]"
        />

        <div id="sort-help" className="sr-only">
          Choose how to sort the giveaways. Current sorting: {sortCriteria}
        </div>
      </div>

      {/* Type Filter */}
      {onTypeChange && (
        <div className="relative">
          <Select
            options={sortingOptions.Types}
            value={type}
            onChange={handleTypeClick}
            aria-label="Filter giveaways by type"
            aria-describedby="type-help"
            className="min-w-[160px]"
          />

          <div id="type-help" className="sr-only">
            Select a giveaway type to filter results. Current type: {type}
          </div>
        </div>
      )}
    </div>
  );
}
