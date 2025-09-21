import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="bg-primary-color border-b border-secondary-color"
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="block text-center focus:outline-none focus:ring-2 focus:ring-accent-color focus:ring-offset-2 rounded-lg"
          aria-label="Go to homepage - GFG Game Freebie Grabber"
        >
          <h1
            className="text-responsive-3xl font-bold text-accent-color hover:text-highlight-color transition-colors duration-200"
            aria-label="GFG - Game Freebie Grabber"
          >
            🎮 GFG - Game Freebie Grabber
          </h1>
          <p
            className="text-highlight-color text-responsive-sm mt-2 opacity-80"
            aria-label="Site tagline"
          >
            Discover the latest free games and exclusive giveaways
          </p>
        </Link>
      </div>
    </header>
  );
}
