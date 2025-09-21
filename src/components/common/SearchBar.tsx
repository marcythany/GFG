'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (onSearch) {
          onSearch(value);
        }
      }, 300); // 300ms debounce
    },
    [onSearch],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
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
      <div className="search-bar">
        <Search
          className="h-5 w-5 text-primary flex-shrink-0"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="search"
          id="search-input"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 py-3 rounded-lg transition-all duration-200
            text-primary placeholder:text-primary
          `}
          aria-describedby="search-help"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-secondary transition-colors duration-200 flex-shrink-0"
            aria-label="Clear search"
          ></button>
        )}
      </div>
      <div id="search-help" className="sr-only">
        Search through available game giveaways. Press Escape to clear.
      </div>
    </form>
  );
}
