import { Habit, HabitLog } from '@/habit.types';

import HabitLoggerChoice from './habit-logger-choice';
import HabitLoggerCounter from './habit-logger-counter';
import HabitLoggerDaily from './habit-logger-daily';
import HabitLoggerMeasure from './habit-logger-measure';

const HEIGHT = 48;
export default function HabitLogger({
  habit,
  onLog,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  // #region Daily
  if (habit.type.value === "daily") {
    return <HabitLoggerDaily habit={habit} onLog={onLog} height={HEIGHT} />;
  }
  // #endregion

  // #region Counter
  if (habit.type.value === "counter") {
    return (
      <HabitLoggerCounter
        onLog={onLog}
        height={HEIGHT}
        knobIconColor={habit.color.slice(0, -2)}
      />
    );
  }
  // #endregion

  // #region Measure
  if (habit.type.value === "measure") {
    return <HabitLoggerMeasure height={HEIGHT} onLog={onLog} />;
  }
  // #endregion

  // #region Choice
  if (habit.type.value === "choice") {
    return <HabitLoggerChoice habit={habit} onLog={onLog} height={HEIGHT} />;
  }
  // #endregion

  return <p>Unsupported habit type {habit.type.value}</p>;
}
