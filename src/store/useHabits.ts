import { Habit, HabitHistoryLog, HabitLog } from "@/types";
import { isSameDay, isToday, subDays } from "date-fns";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { JSONExtended } from "@/utils/json-extended";

const IS_TESTING_HISTORY = true;

type State = {
  habits: Habit[];
};

type Actions = {
  addHabit: (habit: Habit) => void;
  //   removeHabit: (id: string) => void;
  //   updateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  logHabit: (id: string, meta?: object) => void;
  undoLogHabit: (id: string) => void;
  clearHabits: () => void;
};

export const useHabitStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      habits: [
        {
          id: "1",
          name: "Drink Water",
          type: "counter",
          icon: "GlassWater",
          color: "#3b82f622",
          logs: [],
        },
        {
          id: "2",
          name: "Coding",
          type: "daily",
          icon: "Code",
          color: "#34d39922",
          logs: [],
        },
        {
          id: "3",
          name: "My Weight",
          type: "measure",
          icon: "Scale",
          color: "#e879f91a",
          logs: [],
        },
      ],
      addHabit: (habit: Habit) =>
        set((state) => {
          state.habits.push(habit);
        }),

      logHabit: (id: string, meta?: object) =>
        set((state) => {
          const habit = state.habits.find((habit) => habit.id === id);
          if (habit) {
            habit.logs.push({
              date: subDays(new Date(), IS_TESTING_HISTORY ? 1 : 0),
              meta,
            });
          }
        }),

      undoLogHabit: (id: string) =>
        set((state) => {
          const habit = state.habits.find((habit) => habit.id === id);
          if (habit) {
            habit.logs.pop();
          }
        }),

      clearHabits: () => set({ habits: [] }),
    })),
    {
      name: "habit-storage", // name of the item in the storage (must be unique)
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item
            ? Promise.resolve(JSONExtended.parse(item))
            : Promise.resolve(null);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSONExtended.stringify(value));
          return Promise.resolve();
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          return Promise.resolve();
        },
      },
    }
  )
);

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
