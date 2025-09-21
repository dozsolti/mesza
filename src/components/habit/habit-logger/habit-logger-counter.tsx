import { SwipeToConfirm } from '@/components/swipe-to-confirm';
import { HabitLog } from '@/habit.types';

export default function HabitLoggerCounter({
  knobIconColor,
  height,
  onLog,
}: {
  knobIconColor: string;
  height: number;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  return (
    <SwipeToConfirm
      height={height}
      knobIconColor={knobIconColor}
      label="Swipe for +1"
      confirmedLabel="+1"
      restartable={true}
      onConfirm={onLog}
    />
  );
}
