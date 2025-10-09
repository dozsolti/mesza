import {
  Habit,
  HabitLog,
} from '@/habit.types';

import HabitLoggerChoice from './habit-logger-choice';
import HabitLoggerCounter from './habit-logger-counter';
import HabitLoggerDaily from './habit-logger-daily';
import HabitLoggerInterval from './habit-logger-interval';
import HabitLoggerMeasure from './habit-logger-measure';
import HabitLoggerText from './habit-logger-text';

const HEIGHT = 48;
export default function HabitLogger({
  habit,
  onLog,
  date,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"], date?: Date) => void;
  date: Date;
}) {
  // #region Daily
  if (habit.type.value === "daily") {
    return (
      <HabitLoggerDaily
        habit={habit}
        onLog={onLog}
        height={HEIGHT}
        date={date}
      />
    );
  }
  // #endregion

  // #region Counter
  if (habit.type.value === "counter") {
    return (
      <HabitLoggerCounter
        onLog={onLog}
        height={HEIGHT}
        backgroundColor={habit.color}
        knobIconColor={habit.color.slice(0, -2)}
      />
    );
  }
  // #endregion

  // #region Measure
  if (habit.type.value === "measure") {
    return (
      <HabitLoggerMeasure color={habit.color} height={HEIGHT} onLog={onLog} />
    );
  }
  // #endregion

  //#region Interval
  if (habit.type.value === "interval") {
    return (
      <HabitLoggerInterval
        onLog={onLog}
        height={HEIGHT}
        backgroundColor={habit.color}
        knobIconColor={habit.color.slice(0, -2)}
      />
    );
  }
  //#endregion

  // #region Choice
  if (habit.type.value === "choice") {
    return (
      <HabitLoggerChoice
        habit={habit}
        onLog={onLog}
        height={HEIGHT}
        date={date}
      />
    );
  }
  // #endregion

  // #region Text
  if (habit.type.value === "text") {
    return (
      <HabitLoggerText color={habit.color} height={HEIGHT} onLog={onLog} />
    );
  }
  // #endregion

  return <p>Unsupported habit type {habit.type.value}</p>;
}
