import { isSameDay, isToday } from 'date-fns';

import { Habit, HabitHistoryLog, HabitLog } from '@/habit.types';
import { useHabitStore } from '@/stores/use-habit-store';

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
