import { subDays, subHours } from 'date-fns';
import { del, get, set } from 'idb-keyval';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Habit, HABIT_TYPES, HabitLog, HabitTypeKeys } from '@/habit.types';
import { JSONExtended } from '@/lib/json-extended';

const IS_TESTING_HISTORY = false;

type State = {
  habits: Habit[];
};

type Actions = {
  addHabit: (habit: Habit) => void;
  setHabits: (habits: Habit[]) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updatedHabit: Partial<Habit>) => void;
  logHabit: (id: string, meta?: HabitLog["meta"], date?: Date) => void;
  undoLogHabit: (id: string) => void;
  clearHabits: () => void;
};

export const useHabitStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      habits: [],
      addHabit: (habit: Habit) =>
        set((state) => {
          state.habits.unshift(habit);
        }),
      setHabits: (habits: Habit[]) => set({ habits }),

      updateHabit: (id: string, updatedHabit: Partial<Habit>) =>
        set((state) => {
          const habit = state.habits.find((habit) => habit.id === id);

          if (habit) {
            Object.assign(habit, updatedHabit);
          }
        }),

      logHabit: (id: string, meta?: HabitLog["meta"], date?: Date) =>
        set((state) => {
          const habit = state.habits.find((habit) => habit.id === id);
          if (habit) {
            const logDate =
              date ||
              subHours(
                subDays(new Date(), IS_TESTING_HISTORY ? 1 : 0),
                IS_TESTING_HISTORY ? Math.floor(Math.random() * 8) : 0
              );
            habit.logs.push({
              date: logDate,
              meta,
            });
          }
        }),

      removeHabit: (id: string) =>
        set((state) => {
          state.habits = state.habits.filter((habit) => habit.id !== id);
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
        getItem: async (name) => {
          const item = (await get(name)) || localStorage.getItem(name) || null;
          return item
            ? Promise.resolve(JSONExtended.parse(item))
            : Promise.resolve(null);
        },
        setItem: async (name, value) => {
          await set(name, JSONExtended.stringify(value));
          return Promise.resolve();
        },
        removeItem: async (name) => {
          await del(name);
          return Promise.resolve();
        },
      },

      version: 1,
      migrate: (
        persistedState: unknown,
        version: number
      ): (State & Actions) | Promise<State & Actions> => {
        if (version === 0) {
          // console.log("Migrating habit store from version 0 to 1");
          let { habits } = persistedState as State;

          habits = habits.map((habit) => {
            if (typeof habit.type === "string") {
              const value = habit.type as unknown as HabitTypeKeys;
              const t = HABIT_TYPES[value];

              habit.type = {
                value: value,
                config: t?.config,
              };
            }
            return habit;
          });

          persistedState = { ...(persistedState as State), habits };
        }

        return persistedState as State & Actions;
      },
    }
  )
);
