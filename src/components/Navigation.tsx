'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const breadcrumbs = [{ name: 'Home', href: '/', icon: Home }];

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="bg-[var(--color-secondary-color)] border-b border-[var(--color-secondary-color)]"
      role="navigation"
    >
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <ol
          className="flex items-center gap-2 text-sm"
          role="list"
          aria-label="Breadcrumb trail"
        >
          {breadcrumbs.map((crumb, index) => {
            const Icon = crumb.icon;
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li
                key={crumb.href}
                className="flex items-center"
                role="listitem"
              >
                {index > 0 && (
                  <ChevronRight
                    className="h-4 w-4 text-[var(--color-alt-text-color)] mx-2 flex-shrink-0"
                    aria-hidden="true"
                    aria-label="Breadcrumb separator"
                  />
                )}
                {isLast ? (
                  <span
                    className="flex items-center text-[var(--color-highlight-color)] font-medium"
                    aria-current="page"
                    role="text"
                  >
                    <Icon
                      className="h-4 w-4 mr-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span aria-label={`Current page: ${crumb.name}`}>
                      {crumb.name}
                    </span>
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center text-[var(--color-alt-text-color)] hover:text-[var(--color-highlight-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-color)] focus:ring-offset-2 rounded px-1 py-0.5 group"
                    aria-label={`Navigate to ${crumb.name}`}
                  >
                    <Icon
                      className="h-4 w-4 mr-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    />
                    <span aria-label={`Breadcrumb link: ${crumb.name}`}>
                      {crumb.name}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
