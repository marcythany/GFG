'use client';

import { Input } from '@/components/ui/input';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
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
    <form className={`mx-auto mb-8 ${className}`} role="search">
      <fieldset>
        <legend className="sr-only">Search Controls</legend>
        <div className="search-bar">
          <Search
            className="h-5 w-5 text-secondary flex-shrink-0"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="search"
            id="search-input"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              flex-1 py-3 rounded-lg transition-all duration-200
              text-muted placeholder-secondary focus:ring-opacity-20
              ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            `}
            aria-describedby="search-help"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-secondary transition-colors duration-200 flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-secondary" aria-hidden="true" />
            </button>
          )}
        </div>
      </fieldset>
      <div id="search-help" className="sr-only">
        Search through available game giveaways. Press Escape to clear.
      </div>
    </form>
  );
}
