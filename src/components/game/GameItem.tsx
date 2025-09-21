import { Giveaway } from '@/types/giveaway';
import GameCard from './GameCard';

interface GameItemProps {
  giveaway: Giveaway;
  index?: number;
}

function calculateTimeLeft(endDate: string): string | null {
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

export default function GameItem({ giveaway, index = 0 }: GameItemProps) {
  const timeLeft = calculateTimeLeft(giveaway.end_date);

  return <GameCard giveaway={giveaway} timeLeft={timeLeft} index={index} />;
}
