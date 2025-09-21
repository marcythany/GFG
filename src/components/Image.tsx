'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faAndroid,
  faApple,
  faPlaystation,
  faSteam,
  faXbox,
} from '@fortawesome/free-brands-svg-icons';
import { faDesktop, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { loadSvgContent } from '../lib/svgLoader';

interface ImageProps {
  platform: string;
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  alt?: string;
}

const fontAwesomeIcons: { [key: string]: IconDefinition } = {
  'Show all': faGlobe,
  PC: faDesktop,
  Steam: faSteam,
  'Playstation 5': faPlaystation,
  'Xbox Series X|S': faXbox,
  'Playstation 4': faPlaystation,
  'Xbox One': faXbox,
  Android: faAndroid,
  iOS: faApple,
  'Xbox 360': faXbox,
};

const svgIcons: { [key: string]: string } = {
  'Epic Games': '/epic-games.svg',
  Ubisoft: '/ubisoft.svg',
  GOG: '/gog.svg',
  'Nintendo Switch': '/switch.svg',
  'Itch.io': '/itch-io.svg',
  VR: '/vr.svg',
  'Battle.net': '/battle-net.svg',
  Origin: '/origin.svg',
  'DRM-Free': '/DRM-free.svg',
};

const Image = ({
  platform,
  className = '',
  width = 24,
  height = 24,
  color,
  alt,
}: ImageProps) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    if (svgIcons[platform]) {
      loadSvgContent(svgIcons[platform]).then(setSvgContent);
    }
  }, [platform]);

  if (fontAwesomeIcons[platform]) {
    return (
      <FontAwesomeIcon
        icon={fontAwesomeIcons[platform]}
        className={`${className} ${color || ''}`.trim()}
        aria-label={alt}
        aria-hidden={!alt}
      />
    );
  }

  if (svgIcons[platform]) {
    if (!svgContent) {
      // Loading state - render a placeholder
      return (
        <div
          className={`${className} ${color || ''}`.trim()}
          style={{ width, height }}
          role="img"
          aria-label={alt || `${platform} icon loading`}
        />
      );
    }

    return (
      <span
        className={`${className} ${color || ''}`.trim()}
        style={{ width, height, display: 'inline-block' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        role="img"
        aria-label={alt}
        aria-hidden={!alt}
      />
    );
  }

  // Fallback, though all platforms should be covered
  return null;
};

export default Image;
