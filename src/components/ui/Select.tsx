'use client';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useId, useRef, useState } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

interface SelectOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0,
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1,
          );
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        } else {
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      highlightedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current && listRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const dropdownHeight =
        listRef.current.getBoundingClientRect().height || 200;

      if (spaceBelow >= dropdownHeight) {
        setDirection('down');
      } else if (spaceAbove >= dropdownHeight) {
        setDirection('up');
      } else {
        // Default to down if neither has enough space
        setDirection('down');
      }
    }
  }, [isOpen]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${id}-option-${highlightedIndex}`
            : undefined
        }
        role="combobox"
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium text-sm',
          'bg-gradient-to-r from-primary to-secondary/50 border-2 border-secondary',
          'hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none',
          'transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/10',
          'min-w-[180px]',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-accent',
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">
              {typeof selectedOption.icon === 'string' ? (
                <span
                  dangerouslySetInnerHTML={{ __html: selectedOption.icon }}
                />
              ) : (
                selectedOption.icon
              )}
            </span>
          )}
          <span className="text-accent">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn(
            'w-4 h-4 text-accent transition-transform duration-300 flex-shrink-0',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          className={cn(
            'absolute z-999 w-full bg-background border-2 border-secondary rounded-xl shadow-lg',
            'max-h-60 overflow-auto focus:outline-none',
            direction === 'up' ? 'mb-2' : 'mt-2',
          )}
          style={
            direction === 'up' ? { bottom: '100%', top: 'auto' } : undefined
          }
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-200',
                'hover:bg-accent/10 focus:bg-accent/10',
                index === highlightedIndex && 'bg-accent/20',
                option.value === value &&
                  'bg-accent/30 text-accent font-semibold',
              )}
              role="option"
              aria-selected={option.value === value}
            >
              {option.icon && (
                <span className="flex-shrink-0 ">
                  {typeof option.icon === 'string' ? (
                    <span dangerouslySetInnerHTML={{ __html: option.icon }} />
                  ) : (
                    option.icon
                  )}
                </span>
              )}
              <span className="truncate text-text">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
