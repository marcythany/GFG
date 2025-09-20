import type { Metadata } from 'next';
import GameList from '@/components/GameList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GFG - Good Free Games for you!',
  description:
    'The latest free games from platforms like Epic Games, GOG, Steam, and more!',
};

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Header />

      <main>
        <GameList />
      </main>

      <Footer />
    </div>
  );
}
