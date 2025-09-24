import { isSameDay, isToday } from 'date-fns';

import { Habit, HabitHistoryLog, HabitLog } from '@/habit.types';
import { useHabitStore } from '@/stores/use-habit-store';

import { formatTimeSince } from './date.utils';

export function getHabitLogCompletedToday(habit: Habit): HabitLog | undefined {
  return habit.logs.find((log) => isToday(log.date));
}

export function getLogsByDate(date: Date): HabitHistoryLog[] {
  const data = useHabitStore.getState().habits.flatMap((habit) =>
    habit.logs
      .filter((log) => isSameDay(log.date, date))
      .map((log) => {
        const h = { ...habit };
        h.logs = [];
        return { habit: h, log };
      })
  );
  data.sort((a, b) => a.log.date.getTime() - b.log.date.getTime());
  return data;
}

export function getTimeSinceLastLog(log: HabitHistoryLog): string {
  const { habits } = useHabitStore.getState();
  const habit = habits.find((h) => h.id === log.habit.id);
  if (!habit) return "Error: Habit not found";

  const logIndex = habit.logs.findIndex(
    (l) => l.date.valueOf() === log.log.date.valueOf()
  );

  if (logIndex == 0) {
    return "No previous log"; // LATER: habit.createdAt
  }

  return formatTimeSince(habit.logs[logIndex - 1].date, log.log.date);
}
