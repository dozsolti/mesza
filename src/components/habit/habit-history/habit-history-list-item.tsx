import HabitIcon from "@/components/habit/habit-icon";
import { TimelineDate } from "@/components/ui/timeline";
import { type HabitHistoryLog } from "@/habit.types";
import { format } from "date-fns";

export default function HabitLogHistoryItem({
  log,
  className,
}: {
  log: HabitHistoryLog;
  className?: string;
}) {
  if (log.habit.type.value === "counter" || log.habit.type.value === "daily") {
    return (
      <HabitLogHistoryItemWrapper log={log} className={className}>
        <HabitLogHistoryItemCounter log={log} />
      </HabitLogHistoryItemWrapper>
    );
  }
  if (log.habit.type.value === "measure") {
    return (
      <HabitLogHistoryItemWrapper log={log} className={className}>
        <HabitLogHistoryItemMeasure log={log} />
      </HabitLogHistoryItemWrapper>
    );
  }

  if (log.habit.type.value === "choice") {
    return (
      <HabitLogHistoryItemWrapper log={log} className={className}>
        <HabitLogHistoryItemChoice log={log} />
      </HabitLogHistoryItemWrapper>
    );
  }

  return <p>Unsupported habit type {log.habit.type.value}</p>;
}

function HabitLogHistoryItemWrapper({
  log,
  children,
  className,
}: {
  log: HabitHistoryLog;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HabitIcon iconName={log.habit.icon} />
      <div className="flex flex-col">
        {children}
        <TimelineDate>{format(log.log.date, "p")}</TimelineDate>
      </div>
    </div>
  );
}

function HabitLogHistoryItemCounter({ log }: { log: HabitHistoryLog }) {
  return <>{log.habit.name}</>;
}
function HabitLogHistoryItemMeasure({ log }: { log: HabitHistoryLog }) {
  return (
    <p>
      {log.habit.name}
      {log.log.meta && "value" in log.log.meta
        ? ` ⚬ ${log.log.meta.value}`
        : null}
    </p>
  );
}

function HabitLogHistoryItemChoice({ log }: { log: HabitHistoryLog }) {
  return (
    <p>
      {log.habit.name}
      {log.log.meta && "choice" in log.log.meta
        ? ` ⚬ ${log.log.meta.choice}`
        : null}
    </p>
  );
}
