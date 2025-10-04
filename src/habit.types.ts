type HabitTypeStructure = {
  name: string;
  icon: keyof typeof import("lucide-react").icons;
  description: string;
  example?: string;
  config?: HabitLogConfig;
};

export type HabitTypeKeys =
  | "daily"
  | "counter"
  | "measure"
  | "interval"
  | "choice"
  | "text";

export const HABIT_TYPES: Record<HabitTypeKeys, HabitTypeStructure> = {
  daily: {
    name: "Daily",
    icon: "CalendarCheck",
    description: "Occurs every day.",
    example: "Read 20 pages of a book.",
  },
  counter: {
    name: "Counter",
    icon: "CirclePlus",
    description: "Count occurrences.",
    example: "Number of glasses of water.",
  },
  measure: {
    name: "Measure",
    icon: "Ruler",
    description: "Measure something through out time.",
    example: "Weight, steps, hours slept, etc.",
  },
  interval: {
    name: "Interval",
    icon: "Timer",
    description: "Track the time between occurrences.",
    example: "Time between workouts.",
  },
  choice: {
    name: "Choice",
    icon: "LayoutList",
    description: "Choose from predefined options.",
    config: ["", ""],
    example: "Mood (Happy, Sad, Neutral).",
  },
  text: {
    name: "Text",
    icon: "FileText",
    description: "Log custom texts like movies watched, books read, etc.",
    example: "Watched 'Inception'.",
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
  "#34d3991a", // Green
  "#ef44441a", // Red
  "#fbbf241a", // Yellow
  "#f973161a", // Orange
  "#a78bfa1a", // Purple
  "#4f4f4f1a", // Dark Gray
  "#8686861a", // Gray
  "#ffffff1a", // White
  // Red shades
  "#f871711a", "#fca5a51a",
  // Orange shades
  "#fb923c1a", "#fdba741a",
  // Yellow shades
  "#fde0471a",
  // Green shades
  "#84cc161a", "#22c55e1a", "#4ade801a",
  // Cyan shades
  "#06b6d41a", "#67e8f91a", "#a5f3fc1a", 
  // Blue shades
  "#60a5fa1a", "#93c5fd1a",
  // Indigo shades
  "#6366f11a", "#818cf81a", "#a5b4fc1a",
  // Violet shades
  "#8b5cf61a",
  // Pink shades
  "#ec48991a", "#f472b61a", "#f9a8d41a",
  // Rose shades
  "#f43f5e1a", "#fb71851a", "#fda4af1a",
];

/// Habit Log

export type HabitLog = {
  date: Date;
  meta: undefined | HabitLogMetaMeasure | HabitLogMetaChoice | HabitLogMetaText;
};

export type HabitHistoryLog = { habit: Habit; log: HabitLog };

export type HabitLogMetaMeasure = {
  value: number;
};

export type HabitLogMetaChoice = {
  choice: string;
};

export type HabitLogMetaText = {
  text: string;
};

/// Habit Log Config

export type HabitLogConfig = undefined | HabitLogConfigChoice;

export type HabitLogConfigChoice = string[];
