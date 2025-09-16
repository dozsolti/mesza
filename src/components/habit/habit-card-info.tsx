import { Habit } from "@/types";
import { isToday, isThisWeek } from "date-fns";

export default function HabitCardInfo({ habit }: { habit: Habit }) {
  const todayLogs = habit.logs.filter((log) => isToday(log.date));
  const totalLogs = habit.logs.length;
  const isHabitCompletedToday = todayLogs.length > 0;

  if (habit.type === "counter") {
    return (
      <p className="text-white/80 text-sm">
        Today: {todayLogs.length} Total: {totalLogs}
      </p>
    );
  }

  if (habit.type === "daily") {
    if (!isHabitCompletedToday) {
      const countThisWeek = habit.logs.filter((log) =>
        isThisWeek(log.date)
      ).length;

      return (
        <p className="text-white/80 text-sm">
          This week: {countThisWeek} / {7}
        </p>
      );
    }

    const completedTime = new Date(todayLogs[0].date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <p className="text-white/80 text-sm">
        {todayLogs.length > 0 ? `Completed today at ${completedTime}` : ""}
      </p>
    );
  }

  return null;
}
