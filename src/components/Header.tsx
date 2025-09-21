import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="bg-primary border-b border-secondary"
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="block text-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg transition-all duration-200 hover:scale-105"
          aria-label="Go to homepage - GFG Game Freebie Grabber"
        >
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent hover:text-muted transition-colors duration-200"
            aria-label="GFG - Game Freebie Grabber"
          >
            🎮 GFG - Game Freebie Grabber
          </h1>
          <p
            className="text-muted text-sm sm:text-base mt-2 opacity-80"
            aria-label="Site tagline"
          >
            Discover the latest free games and exclusive giveaways
          </p>
        </Link>
      </div>
    </header>
  );
}
