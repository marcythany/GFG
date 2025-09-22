'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search giveaways...',
  className = '',
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | undefined>(undefined);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => {
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      className={`mx-auto mb-8 ${className}`}
      role="search"
      onSubmit={handleSubmit}
      aria-labelledby="search-help"
    >
      <div className="flex items-center gap-3 p-2 border border-border rounded-md bg-background transition-all duration-200 focus-within:ring-2 focus-within:ring-[var(--color-focus)]">
        <Search
          className="h-5 w-5 text-text flex-shrink-0"
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
          className="flex-1 border-none bg-transparent text-text placeholder:text-text focus:outline-none focus-visible:ring-0"
          aria-describedby="search-help"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-text hover:bg-secondary transition-colors duration-200 flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div id="search-help" className="sr-only">
        Search through available game giveaways. Press Escape to clear.
      </div>
    </form>
  );
}
