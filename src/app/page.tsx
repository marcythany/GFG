import GiveawayContainer from '@/components/game/GiveawayContainer';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { fetchGiveaways } from '@/lib/api';
import {
  Giveaway,
  GiveawayFilters,
  PLATFORM_OPTIONS,
  SORT_OPTIONS,
} from '@/types/giveaway';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{
    platform?: string;
    'sort-by'?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters: GiveawayFilters = {
    platform:
      params.platform &&
      PLATFORM_OPTIONS.includes(
        params.platform as (typeof PLATFORM_OPTIONS)[number],
      )
        ? (params.platform as (typeof PLATFORM_OPTIONS)[number])
        : undefined,
    'sort-by':
      params['sort-by'] &&
      SORT_OPTIONS.includes(params['sort-by'] as (typeof SORT_OPTIONS)[number])
        ? (params['sort-by'] as (typeof SORT_OPTIONS)[number])
        : undefined,
  };

  // Fetch all giveaways based on platform/sort filters
  const allGiveaways = await fetchGiveaways(filters);

  // Apply search query filtering on the server
  const searchQuery = params.search || '';
  const filteredGiveaways = searchQuery
    ? allGiveaways.filter((giveaway: Giveaway) =>
        giveaway.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allGiveaways;

  const currentPage = parseInt(params.page || '1', 10);

  return (
    <div className="min-h-screen bg-background">
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
          <Suspense fallback={<div>Loading...</div>}>
            <GiveawayContainer
              initialGiveaways={filteredGiveaways}
              initialUnfilteredCount={allGiveaways.length}
              searchQuery={searchQuery}
              currentPage={currentPage}
            />
          </Suspense>
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Free Game Giveaways & Gaming Deals | GFG',
    description:
      'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more. Your ultimate destination for gaming deals!',
    openGraph: {
      title: 'Free Game Giveaways & Gaming Deals | GFG',
      description:
        'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more.',
      type: 'website',
    },
  };
}
