'use client';

import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search giveaways...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative max-w-md mx-auto mb-8 ${className}`}>
      <form onSubmit={handleSubmit} role="search" aria-label="Search giveaways">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-alt-text-color)]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200
              bg-[var(--color-primary-color)] border-[var(--color-secondary-color)] text-[var(--color-highlight-color)]
              placeholder-[var(--color-alt-text-color)] focus:border-[var(--color-accent-color)] focus:ring-2
              focus:ring-[var(--color-accent-color)] focus:ring-opacity-20 focus:outline-none
              ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            `}
            aria-describedby="search-help"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--color-secondary-color)] transition-colors duration-200"
              aria-label="Clear search"
            >
              <X
                className="h-4 w-4 text-[var(--color-alt-text-color)]"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <div id="search-help" className="sr-only">
          Search through available game giveaways. Press Escape to clear.
        </div>
      </form>
    </div>
  );
}
