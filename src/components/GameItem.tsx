import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faWindows,
  faSteam,
  faPlaystation,
  faXbox,
  faAndroid,
  faApple,
  faItchIo,
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
  // GOG icon is not available in the free set, so it's removed.
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
    <div className="border border-secondary-color rounded-lg overflow-hidden bg-primary-color flex flex-col">
      <div className="relative">
        <a
          href={giveaway.open_giveaway_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={giveaway.thumbnail}
            alt={giveaway.title}
            width={400}
            height={250}
            className="w-full h-auto"
          />
        </a>
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
          {timeLeft && (
            <div className="bg-secondary-color text-text-color text-xs font-bold px-2 py-1 rounded-full">
              {timeLeft}
            </div>
          )}
          <div className="flex gap-2">
            {giveaway.platforms.split(', ').map((platform) => {
              const icon = platformIcons[platform.trim()];
              return icon ? (
                <FontAwesomeIcon
                  key={platform}
                  icon={icon}
                  className="text-text-color h-5 w-5"
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-accent-color truncate">
          {giveaway.title}
        </h2>
        <p className="text-sm text-highlight-color mt-1 truncate flex-grow">
          {giveaway.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-accent-color line-through">
            {giveaway.worth}
          </span>
          <span className="text-lg font-bold text-accent-color">Free</span>
          <span className="text-sm text-alt-text-color bg-background-color px-2 py-1 rounded">
            {giveaway.type}
          </span>
        </div>
        <div className="mt-2 text-sm text-highlight-color flex items-center">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          {giveaway.users} Claimed this loot!
        </div>
        <a
          href={giveaway.open_giveaway_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-transparent border border-accent-color text-accent-color font-bold py-2 px-4 rounded mt-4 hover:bg-accent-color hover:text-primary-color transition-colors"
        >
          Claim Loot
        </a>
      </div>
    </div>
  );
}
