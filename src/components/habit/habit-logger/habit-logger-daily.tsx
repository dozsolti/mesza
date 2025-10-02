import { SwipeToConfirm } from '@/components/swipe-to-confirm';
import { Habit, HabitLog } from '@/habit.types';
import { formatDate } from '@/lib/date.utils';
import { getHabitLogCompletedOnDate } from '@/lib/habit.utils';

export default function HabitLoggerDaily({
  habit,
  onLog,
  height,
  date,
}: {
  height: number;
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"], date?: Date) => void;
  date: Date;
}) {
  const habitLog = getHabitLogCompletedOnDate(habit, date);
  const isConfirmed = habitLog !== undefined;

  if (isConfirmed) {
    return <p>Completed {formatDate(habitLog.date, "datetime")}.</p>;
  }

  return (
    <SwipeToConfirm
      height={height}
      knobIconColor={habit.color.slice(0, -2)}
      bgColor={habit.color}
      label="Swipe to confirm"
      confirmedLabel={"Magic is loading..."}
      isConfirmed={isConfirmed}
      restartDelay={350}
      onConfirm={onLog}
    />
  );
}
