import Breadcrumb from '@/components/common/Breadcrumb';
import Dropdown from '@/components/common/Dropdown';
import { motion } from 'framer-motion';

interface GameFiltersProps {
  selectedPlatform: string;
  sortCriteria: string;
  onPlatformChange: (platform: string) => void;
  onSortChange: (sort: string) => void;
}

export default function GameFilters({
  selectedPlatform,
  sortCriteria,
  onPlatformChange,
  onSortChange,
}: GameFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-secondary/30 to-primary/20 border border-secondary/50 backdrop-blur-sm"
      role="toolbar"
      aria-label="Filter and sort controls"
    >
      <Breadcrumb
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
      />
      <Dropdown onSortChange={onSortChange} sortCriteria={sortCriteria} />
    </motion.div>
  );
}
