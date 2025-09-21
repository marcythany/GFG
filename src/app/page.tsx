'use client';

import SearchBar from '@/components/common/SearchBar';
import GameList from '@/components/game/GameList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { useCallback, useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <Navigation />

      <main
        id="main-content"
        className="container mx-auto px-4 py-6"
        role="main"
        aria-label="Free game giveaways and promotions"
      >
        <section
          aria-labelledby="giveaways-heading"
          className="mb-8"
          role="region"
        >
          <h1 id="giveaways-heading" className="sr-only">
            Free Game Giveaways and Promotions
          </h1>

          {/* Live region for dynamic content announcements */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="announcements"
          >
            Page loaded with latest game giveaways
          </div>

          {/* Search functionality */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search giveaways by title, platform, or type..."
            className="mb-6"
          />

          <GameList searchQuery={searchQuery} />
        </section>
      </main>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'GFG - Game Freebie Grabber',
            description:
              'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more.',
            url: 'https://your-domain.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://your-domain.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: 'GFG',
              url: 'https://your-domain.com',
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GFG - Game Freebie Grabber',
            url: 'https://your-domain.com',
            logo: 'https://your-domain.com/logo.png',
            description:
              'Your ultimate destination for free game giveaways and gaming deals',
            founder: {
              '@type': 'Person',
              name: 'Marcy',
            },
            sameAs: ['https://github.com/marcythany'],
          }),
        }}
      />
    </div>
  );
}
