import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'GFG - Game Freebie Grabber',
    template: '%s | GFG',
  },
  description:
    'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more. Your ultimate destination for gaming deals!',
  keywords: [
    'free games',
    'game giveaways',
    'gaming deals',
    'Epic Games',
    'Steam',
    'GOG',
    'freebies',
  ],
  authors: [{ name: 'Marcy' }],
  creator: 'Marcy',
  publisher: 'GFG',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'GFG - Game Freebie Grabber',
    description:
      'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more.',
    siteName: 'GFG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GFG - Game Freebie Grabber',
    description:
      'Discover the latest free games and giveaways from platforms like Epic Games, Steam, GOG, and more.',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1633' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
