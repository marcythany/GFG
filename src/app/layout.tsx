import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GFG - Game Freebie Grabber',
  description:
    'The latest free games from platforms like Epic Games, GOG, Steam, and more!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
