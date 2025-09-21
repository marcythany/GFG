import { fetchGiveaways } from '@/lib/api';
import { Giveaway, GiveawayFilters } from '@/types/giveaway';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import GiveawayContainer from '@/components/game/GiveawayContainer';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: {
    platform?: string;
    'sort-by'?: string;
    search?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const filters: GiveawayFilters = {
    platform: searchParams.platform,
    'sort-by': searchParams['sort-by'],
  };

  // Fetch all giveaways based on platform/sort filters
  const allGiveaways = await fetchGiveaways(filters);

  // Apply search query filtering on the server
  const searchQuery = searchParams.search || '';
  const filteredGiveaways = searchQuery
    ? allGiveaways.filter((giveaway: Giveaway) =>
        giveaway.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allGiveaways;

  const currentPage = parseInt(searchParams.page || '1', 10);

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
