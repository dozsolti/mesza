import { SwipeToConfirm } from '@/components/swipe-to-confirm';
import { HabitLog } from '@/habit.types';

export default function HabitLoggerCounter({
  backgroundColor,
  knobIconColor,
  height,
  onLog,
}: {
  backgroundColor: string;
  knobIconColor: string;
  height: number;
  onLog?: (meta?: HabitLog["meta"], date?: Date) => void;
}) {
  return (
    <SwipeToConfirm
      height={height}
      knobIconColor={knobIconColor}
      bgColor={backgroundColor}
      label="Swipe for +1"
      confirmedLabel="+1"
      restartable={true}
      onConfirm={onLog}
    />
  );
}
