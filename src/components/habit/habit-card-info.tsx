import { isThisWeek, isToday } from 'date-fns';

import { Habit } from '@/habit.types';
import { formatDateRelativeToday, formatTimeSince } from '@/lib/date.utils';
import { cn } from '@/lib/utils';

const defaultTextClass = "text-foreground/60 text-sm";

export default function HabitCardInfo({
  habit,
  customText,
}: {
  habit: Habit;
  customText?: string;
}) {
  if (customText) return <p className={defaultTextClass}>{customText}</p>;

  const todayLogs = habit.logs.filter((log) => isToday(log.date));
  const totalLogs = habit.logs.length;
  const hasTodayLog = todayLogs.length > 0;

  const textColorClass = cn(
    hasTodayLog ? "text-foreground/85 italic" : "text-foreground/60",
    "text-sm"
  );

  // #region Counter
  if (habit.type.value === "counter") {
    return (
      <p className={textColorClass}>
        Today: {todayLogs.length} {totalLogs > 0 ? `Total: ${totalLogs}` : null}
      </p>
    );
  }
  // #endregion

  // #region Daily
  if (habit.type.value === "daily") {
    if (totalLogs === 0) {
      return <p className={defaultTextClass}>Not done yet.</p>;
    }
    const countThisWeek = habit.logs.filter((log) =>
      isThisWeek(log.date)
    ).length;

    return (
      <p className={textColorClass}>
        This week {countThisWeek} time{countThisWeek === 1 ? "" : "s"}.
      </p>
    );
  }
  // #endregion

  // #region Measure
  if (habit.type.value === "measure") {
    if (totalLogs === 0) {
      return <p className={defaultTextClass}>No measurements yet.</p>;
    }
    const lastLog = habit.logs.reduce((latest, log) =>
      log.date > latest.date ? log : latest
    );
    return (
      <p className={textColorClass}>
        {lastLog.meta ? Object.values(lastLog.meta).join(", ") : "N/A"} -{" "}
        {formatDateRelativeToday(lastLog.date)}
      </p>
    );
  }
  // #endregion

  // #region Interval
  if (habit.type.value === "interval") {
    if(totalLogs === 0) {
      return <p className={defaultTextClass}>No checks yet.</p>;
    }

    const lastLog = habit.logs[habit.logs.length - 1];

    return (
      <p className={textColorClass}>
        Time since last check: {formatTimeSince(lastLog.date)}
      </p>
    );
  }
  // #endregion

  // #region Choice
  if (habit.type.value === "choice") {
    if (totalLogs === 0) {
      return <p className={defaultTextClass}>No choices yet.</p>;
    }
    const lastLog = habit.logs[habit.logs.length - 1];
    return (
      <p className={textColorClass}>
        {lastLog.meta ? Object.values(lastLog.meta).join(", ") : "N/A"}
        {" - "}
        {formatDateRelativeToday(lastLog.date)}
      </p>
    );
  }
  // #endregion

  return null;
}
