import { Giveaway } from '@/types/giveaway';
import GameCard from './GameCard';

interface GameItemProps {
  giveaway: Giveaway;
  index?: number;
}

export default function GameItem({ giveaway, index = 0 }: GameItemProps) {
  return (
    <GameCard giveaway={giveaway} endDate={giveaway.end_date} index={index} />
  );
}
