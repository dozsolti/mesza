import { Habit } from "@/types";
import { isToday, isThisWeek } from "date-fns";

export default function HabitCardInfo({ habit }: { habit: Habit }) {
  const todayLogs = habit.logs.filter((log) => isToday(log.date));
  const totalLogs = habit.logs.length;
  //   const isHabitCompletedToday = todayLogs.length > 0;

  if (habit.type === "counter") {
    return (
      <p className="text-white/60 text-sm">
        Today: {todayLogs.length}   {totalLogs > 0 ? `Total: ${totalLogs}` : null}
      </p>
    );
  }

  if (habit.type === "daily") {
    if (totalLogs === 0) {
      return <p className="text-white/60 text-sm">Not done yet.</p>;
    }
    const countThisWeek = habit.logs.filter((log) =>
      isThisWeek(log.date)
    ).length;

    return (
      <p className="text-white/60 text-sm">
        This week {countThisWeek} time{countThisWeek === 1 ? "" : "s"}.
      </p>
    );
  }

  if (habit.type === "measure") {
    if (totalLogs === 0) {
      return <p className="text-white/60 text-sm">No measurements yet.</p>
    }
    const lastLog = habit.logs.reduce((latest, log) =>
      log.date > latest.date ? log : latest
    );
    return (
      <p className="text-white/60 text-sm">
        Last: {lastLog.meta ? Object.values(lastLog.meta).join(", ") : "N/A"} on{" "}
        {lastLog.date.toLocaleDateString()}
      </p>
    );
  }

  return null;
}
