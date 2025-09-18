type HabitTypeStructure = {
  name: string;
  description: string;
  config?: HabitLogConfig;
};

export type HabitTypeKeys = 'daily' | 'counter' | 'measure' | 'choice';

export const HABIT_TYPES: Record<HabitTypeKeys, HabitTypeStructure> = {
  daily: { name: "Daily", description: "Occurs every day." },
  counter: {
    name: "Counter",
    description: "Count occurrences.",
  },
  measure: {
    name: "Measure",
    description: "Measure something through out time.",
  },
  choice: {
    name: "Choice",
    description: "Choose from predefined options.",
    config: ["", ""],
  },
};

export const HABIT_TYPES_ARRAY = Object.entries(HABIT_TYPES).map(
  ([key, value]) => ({
    value: key as HabitTypeKeys,
    ...value,
  })
);

export type HabitType = {
  value: HabitTypeKeys;
  config?: (typeof HABIT_TYPES)[HabitTypeKeys]["config"];
};

export type HabitIcon = keyof typeof import("lucide-react").icons;

export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: HabitType;
  icon: HabitIcon;
  color: string;
  logs: HabitLog[];
}

export const HABIT_COLORS = [
  "#3b82f61a", // Blue
  "#ef44441a", // Red
  "#ec48991a", // Pink
  "#fb71851a", // Light Red
  "#f973161a", // Orange
  "#f59e0b1a", // Amber
  "#10b9811a", // Emerald
  "#22d3ee1a", // Cyan
  "#06b6d41a", // Sky
  "#8b5cf61a", // Violet
  "#a78bfa1a", // Purple
  "#f43f5e1a", // Rose
  "#6366f11a", // Indigo
  "#e879f91a", // Fuchsia
  "#f472b61a", // Pink
  "#fbbf241a", // Yellow
  "#84cc161a", // Lime
  "#4ade801a", // Light Green
  "#34d3991a", // Green
];

/// Habit Log

export type HabitLog = {
  date: Date;
  meta: undefined | HabitLogMetaMeasure | HabitLogMetaChoice;
};

export type HabitHistoryLog = { habit: Habit; log: HabitLog };

export type HabitLogMetaMeasure = {
  value: number;
};

export type HabitLogMetaChoice = {
  choice: string;
};

/// Habit Log Config

export type HabitLogConfig = undefined | HabitLogConfigChoice;

export type HabitLogConfigChoice = string[];
