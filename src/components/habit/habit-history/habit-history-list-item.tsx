import HabitIcon from '@/components/habit/habit-icon';
import { TimelineDate } from '@/components/ui/timeline';
import { HabitHistoryLog } from '@/habit.types';
import { formatDate } from '@/lib/date.utils';
import { getTimeSinceLastLog } from '@/lib/habit.utils';

export default function HabitLogHistoryItem({
  log,
  className,
}: {
  log: HabitHistoryLog;
  className?: string;
}) {
  return (
    <HabitLogHistoryItemWrapper log={log} className={className}>
      {log.habit.type.value === "counter" ||
      log.habit.type.value === "daily" ? (
        <HabitLogHistoryItemCounter log={log} />
      ) : log.habit.type.value === "measure" ? (
        <HabitLogHistoryItemMeasure log={log} />
      ) : log.habit.type.value === "interval" ? (
        <HabitLogHistoryItemInterval log={log} />
      ) : log.habit.type.value === "choice" ? (
        <HabitLogHistoryItemChoice log={log} />
      ) : (
        <p>Unsupported habit type {log.habit.type.value}</p>
      )}
    </HabitLogHistoryItemWrapper>
  );
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
        <TimelineDate>{formatDate(log.log.date, "time")}</TimelineDate>
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
        ? ` - ${log.log.meta.value}`
        : null}
    </p>
  );
}

function HabitLogHistoryItemInterval({ log }: { log: HabitHistoryLog }) {
  return (
    <>
      {log.habit.name} - {getTimeSinceLastLog(log)}
    </>
  );
}

function HabitLogHistoryItemChoice({ log }: { log: HabitHistoryLog }) {
  return (
    <p>
      {log.habit.name}
      {log.log.meta && "choice" in log.log.meta
        ? ` - ${log.log.meta.choice}`
        : null}
    </p>
  );
}
