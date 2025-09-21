import { icons } from 'lucide-react';

import { HabitIcon as HabitIconType } from '@/habit.types';
import { cn } from '@/lib/utils';

export default function HabitIcon({
  iconName,
  color,
  className,
}: {
  className?: string;
  iconName: HabitIconType;
  color?: string;
}) {
  const LucideIcon = icons[iconName] as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <div
      className={cn(
        "flex items-center bg-blue-100/10 px-2 rounded-lg aspect-square",
        className
      )}
    >
      <LucideIcon className="w-5 h-5" style={{ color }} />
    </div>
  );
}
