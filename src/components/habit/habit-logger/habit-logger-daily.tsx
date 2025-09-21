import { format } from 'date-fns';

import { SwipeToConfirm } from '@/components/swipe-to-confirm';
import { Habit, HabitLog } from '@/habit.types';
import { getHabitLogCompletedToday } from '@/lib/habit.utils';

export default function HabitLoggerDaily({
  habit,
  onLog,
  height,
}: {
  height: number;
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  const habitLog = getHabitLogCompletedToday(habit);
  const isConfirmed = !!habitLog;

  return (
    <SwipeToConfirm
      height={height}
      knobIconColor={habit.color.slice(0, -2)}
      label="Swipe to confirm"
      confirmedLabel={
        habitLog
          ? `Completed ${format(habitLog.date, "p")}`
          : "Magic is loading..."
      }
      restartable={
        !isConfirmed // in case of undo
      }
      isConfirmed={isConfirmed}
      restartDelay={350}
      onConfirm={onLog}
    />
  );
}
