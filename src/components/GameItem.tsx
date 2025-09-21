import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import {
  faAndroid,
  faApple,
  faItchIo,
  faPlaystation,
  faSteam,
  faWindows,
  faXbox,
} from '@fortawesome/free-brands-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

// Define the type for a single giveaway
interface Giveaway {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  end_date: string;
  platforms: string;
  users: number;
  type: string;
}

interface GameItemProps {
  giveaway: Giveaway;
}

function calculateTimeLeft(endDate: string) {
  if (!endDate || endDate === 'N/A') {
    return null;
  }
  const endDateTime = new Date(endDate).getTime();
  const now = new Date().getTime();
  const timeLeft = endDateTime - now;

  if (isNaN(timeLeft) || timeLeft <= 0) {
    return null;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  }
}

const platformIcons: { [key: string]: IconDefinition } = {
  PC: faWindows,
  Steam: faSteam,
  'Playstation 5': faPlaystation,
  'Xbox Series X|S': faXbox,
  'Playstation 4': faPlaystation,
  'Xbox One': faXbox,
  Android: faAndroid,
  iOS: faApple,
  'Itch.io': faItchIo,
  'Xbox 360': faXbox,
};
export default function GameItem({ giveaway }: GameItemProps) {
  const timeLeft = calculateTimeLeft(giveaway.end_date);

  return (
    <article
      className="border border-[var(--color-secondary-color)] rounded-lg overflow-hidden bg-[var(--color-primary-color)] flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[var(--color-accent-color)] group hover:-translate-y-1"
      role="article"
      aria-labelledby={`giveaway-title-${giveaway.id}`}
    >
      <div className="relative">
        <a
          href={giveaway.open_giveaway_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-color)] focus:ring-offset-2 rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          aria-label={`View giveaway for ${giveaway.title} - opens in new tab`}
          aria-describedby={`giveaway-description-${giveaway.id}`}
        >
          <Image
            src={giveaway.thumbnail || '/placeholder-game.svg'}
            alt=""
            width={400}
            height={250}
            className="w-full h-auto object-cover aspect-video"
            role="presentation"
            aria-hidden="true"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/placeholder-game.svg') {
                target.src = '/placeholder-game.svg';
              }
            }}
          />
          <div className="sr-only" id={`giveaway-image-${giveaway.id}`}>
            Game thumbnail for {giveaway.title}
          </div>
        </a>
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {timeLeft && (
            <div
              className="bg-[var(--color-secondary-color)] text-[var(--color-text-color)] text-xs font-bold px-2 py-1 rounded-full shadow-md"
              role="timer"
              aria-label={`Time remaining: ${timeLeft}`}
              aria-live="polite"
            >
              {timeLeft}
            </div>
          )}
          <div
            className="flex gap-1"
            role="list"
            aria-label="Available platforms"
          >
            {giveaway.platforms.split(', ').map((platform) => {
              const icon = platformIcons[platform.trim()];
              return icon ? (
                <div key={platform} role="listitem" className="sr-only">
                  Available on {platform}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <header className="mb-3">
          <h2
            id={`giveaway-title-${giveaway.id}`}
            className="text-lg sm:text-xl font-bold text-[var(--color-accent-color)] line-clamp-2 mb-2 group-hover:text-[var(--color-highlight-color)] transition-colors duration-200"
          >
            {giveaway.title}
          </h2>
        </header>
        <p
          id={`giveaway-description-${giveaway.id}`}
          className="text-sm text-[var(--color-highlight-color)] line-clamp-3 flex-grow mb-4 leading-relaxed"
        >
          {giveaway.description}
        </p>
        <div className="space-y-4" role="group" aria-label="Giveaway details">
          <div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
            role="group"
            aria-label="Pricing information"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-base sm:text-lg font-bold text-[var(--color-accent-color)] line-through"
                aria-label={`Original price: ${giveaway.worth}`}
              >
                {giveaway.worth}
              </span>
              <span
                className="text-base sm:text-lg font-bold text-[var(--color-accent-color)]"
                aria-label="Current price: Free"
              >
                Free
              </span>
            </div>
            <span
              className="text-sm text-[var(--color-alt-text-color)] bg-[var(--color-background-color)] px-2 py-1 rounded-full self-start"
              aria-label={`Giveaway type: ${giveaway.type}`}
            >
              {giveaway.type}
            </span>
          </div>
          <div
            className="flex items-center text-sm text-[var(--color-highlight-color)]"
            role="text"
          >
            <FontAwesomeIcon
              icon={faUsers}
              className="mr-2 flex-shrink-0"
              aria-hidden="true"
            />
            <span
              aria-label={`${giveaway.users} people have claimed this giveaway`}
            >
              {giveaway.users.toLocaleString()} claimed
            </span>
          </div>
          <a
            href={giveaway.open_giveaway_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[var(--color-accent-color)] text-[var(--color-primary-color)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--color-highlight-color)] focus:bg-[var(--color-highlight-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-color)] focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            aria-label={`Claim giveaway for ${giveaway.title} - opens in new tab`}
            role="button"
          >
            Claim Giveaway
          </a>
        </div>
      </div>
    </article>
  );
}
