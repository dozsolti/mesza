import { SwipeToConfirm } from '@/components/swipe-to-confirm';
import { HabitLog } from '@/habit.types';

export default function HabitLoggerInterval({
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
      label="Swipe to check"
      confirmedLabel="Check"
      restartable={true}
      onConfirm={onLog}
    />
  );
}
