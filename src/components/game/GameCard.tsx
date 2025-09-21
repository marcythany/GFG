'use client';

import { Giveaway } from '@/types/giveaway';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

interface GameCardProps {
  giveaway: Giveaway;
  timeLeft: string | null;
  index?: number;
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

export default React.memo(function GameCard({
  giveaway,
  timeLeft,
  index = 0,
}: GameCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="border border-secondary rounded-lg overflow-hidden bg-primary flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 hover:border-accent group"
      role="article"
      aria-labelledby={`giveaway-title-${giveaway.id}`}
    >
      <div className="relative">
        <motion.a
          href={giveaway.open_giveaway_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-t-lg"
          aria-label={`View giveaway for ${giveaway.title} - opens in new tab`}
          aria-describedby={`giveaway-description-${giveaway.id}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
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
        </motion.a>
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {timeLeft && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full shadow-md"
              role="timer"
              aria-label={`Time remaining: ${timeLeft}`}
              aria-live="polite"
            >
              {timeLeft}
            </motion.div>
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
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            id={`giveaway-title-${giveaway.id}`}
            className="text-lg sm:text-xl font-bold text-accent line-clamp-2 mb-2 group-hover:text-muted transition-colors duration-200"
          >
            {giveaway.title}
          </motion.h2>
        </header>
        <p
          id={`giveaway-description-${giveaway.id}`}
          className="text-sm text-muted line-clamp-3 flex-grow mb-4 leading-relaxed"
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
                className="text-base sm:text-lg font-bold text-accent line-through"
                aria-label={`Original price: ${giveaway.worth}`}
              >
                {giveaway.worth}
              </span>
              <span
                className="text-base sm:text-lg font-bold text-accent"
                aria-label="Current price: Free"
              >
                Free
              </span>
            </div>
            <span
              className="text-sm text-secondary bg-background px-2 py-1 rounded-full self-start"
              aria-label={`Giveaway type: ${giveaway.type}`}
            >
              {giveaway.type}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted" role="text">
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
          <motion.a
            href={giveaway.open_giveaway_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-accent text-primary font-bold py-3 px-4 rounded-lg hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-md hover:shadow-lg"
            aria-label={`Claim giveaway for ${giveaway.title} - opens in new tab`}
            role="button"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Claim Giveaway
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
});
