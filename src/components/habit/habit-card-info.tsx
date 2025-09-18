import { Habit } from "@/habit.types";
import { isToday, isThisWeek, format } from "date-fns";

export default function HabitCardInfo({
  habit,
  customText,
}: {
  habit: Habit;
  customText?: string;
}) {
  if (customText) return <p className="text-white/60 text-sm">{customText}</p>;

  const todayLogs = habit.logs.filter((log) => isToday(log.date));
  const totalLogs = habit.logs.length;
  //   const isHabitCompletedToday = todayLogs.length > 0;

  if (habit.type.value === "counter") {
    return (
      <p className="text-white/60 text-sm">
        Today: {todayLogs.length} {totalLogs > 0 ? `Total: ${totalLogs}` : null}
      </p>
    );
  }

  if (habit.type.value === "daily") {
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

  if (habit.type.value === "measure") {
    if (totalLogs === 0) {
      return <p className="text-white/60 text-sm">No measurements yet.</p>;
    }
    const lastLog = habit.logs.reduce((latest, log) =>
      log.date > latest.date ? log : latest
    );
    return (
      <p className="text-white/60 text-sm">
        {lastLog.meta ? Object.values(lastLog.meta).join(", ") : "N/A"} on{" "}
        {isToday(lastLog.date) ? format(lastLog.date, "'today'") : format(lastLog.date, "PPpp")}
      </p>
    );
  }

  if (habit.type.value === "choice") {
    if (totalLogs === 0) {
      return <p className="text-white/60 text-sm">No choices yet.</p>;
    }
    const lastLog = habit.logs[habit.logs.length - 1];
    return (
      <p className="text-white/60 text-sm">
        {lastLog.meta ? Object.values(lastLog.meta).join(", ") : "N/A"} {" "}
        {isToday(lastLog.date) ? format(lastLog.date, "'at' pp") : format(lastLog.date, "''on' PPpp")}
      </p>
    );
  }

  return null;
}
