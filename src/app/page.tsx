import Footer from '@/components/Footer';
import GameList from '@/components/GameList';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GFG - Free Game Giveaways | Latest Gaming Deals & Promotions',
  description:
    'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more. Find exclusive gaming deals, promotions, and free game offers updated daily.',
  keywords:
    'free games, game giveaways, gaming deals, Epic Games free, Steam free games, GOG giveaways, gaming promotions',
  authors: [{ name: 'Marcy' }],
  creator: 'Marcy',
  publisher: 'GFG',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'GFG - Free Game Giveaways',
    description:
      'Discover the latest free games and giveaways from top gaming platforms',
    type: 'website',
    locale: 'en_US',
    siteName: 'GFG - Game Freebie Grabber',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GFG - Free Game Giveaways',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GFG - Free Game Giveaways',
    description:
      'Discover the latest free games and giveaways from top gaming platforms',
    images: ['/og-image.jpg'],
    creator: '@marcythany',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background-color">
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
            placeholder="Search giveaways by title, platform, or type..."
            className="mb-6"
          />

          <GameList />
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
