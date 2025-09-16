export type HabitTypes = "counter" | "daily" | "measure"; // | "weekly" | "monthly" 

export type HabitIcon = keyof typeof import("lucide-react").icons;
export type HabitLog = {
  date: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
};

export type HabitHistoryLog = { habit: Habit; log: HabitLog };

export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: HabitTypes;
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

export interface User {
  name: string;
}