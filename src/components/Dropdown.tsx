'use client';

interface DropdownProps {
  onSortChange: (criteria: string) => void;
  onTypeChange?: (type: string) => void;
  sortCriteria?: string;
  type?: string;
}

const sortingOptions = {
  SortBy: ['Date', 'Value', 'Popularity'],
  Types: ['All', 'Game', 'DLC', 'Early Access', 'Beta'],
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
    <>
      {/* Sort Options */}
      <div className="relative">
        <label htmlFor="sort-select" className="sr-only">
          Sort giveaways by
        </label>
        <select
          id="sort-select"
          value={sortCriteria}
          onChange={(e) => handleSortClick(e.target.value)}
          className="appearance-none bg-primary border border-secondary text-accent px-4 py-2 pr-8 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none transition-all duration-200"
          aria-describedby="sort-help"
          aria-label="Sort giveaways by criteria"
          aria-expanded="false"
          role="combobox"
        >
          {sortingOptions.SortBy.map((criteria) => (
            <option key={criteria} value={criteria}>
              {criteria}
            </option>
          ))}
        </select>
        <div
          className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 text-muted"
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
            className="appearance-none bg-primary border border-secondary text-accent px-4 py-2 pr-8 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none transition-all duration-200"
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
              className="w-4 h-4 text-muted"
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
