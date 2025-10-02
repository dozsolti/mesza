import { TrashIcon } from 'lucide-react';

import HabitIcon from '@/components/habit/habit-icon';
import { Button } from '@/components/ui/button';
import { TimelineDate } from '@/components/ui/timeline';
import { HabitHistoryLog } from '@/habit.types';
import { formatDate } from '@/lib/date.utils';
import { getTimeSinceLastLog } from '@/lib/habit.utils';

export default function HabitLogHistoryItem({
  log,
  className,
  onDelete,
}: {
  log: HabitHistoryLog;
  className?: string;
  onDelete?: () => void;
}) {
  return (
    <HabitLogHistoryItemWrapper
      log={log}
      className={className}
      onDelete={onDelete}
    >
      {log.habit.type.value === "counter" ||
      log.habit.type.value === "daily" ? (
        <HabitLogHistoryItemCounter log={log} />
      ) : log.habit.type.value === "measure" ? (
        <HabitLogHistoryItemMeasure log={log} />
      ) : log.habit.type.value === "interval" ? (
        <HabitLogHistoryItemInterval log={log} />
      ) : log.habit.type.value === "choice" ? (
        <HabitLogHistoryItemChoice log={log} />
      ) : log.habit.type.value === "text" ? (
        <HabitLogHistoryItemText log={log} />
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
  onDelete,
}: {
  log: HabitHistoryLog;
  children: React.ReactNode;
  className?: string;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`flex flex-1 justify-between bg-accent p-2 rounded-xl  ${className}`}
    >
      <div className="flex flex-row gap-3">
        <HabitIcon
          iconName={log.habit.icon}
          className="text-accent-foreground"
        />
        <div className="flex flex-col">
          <div className="font-semibold text-accent-foreground">{children}</div>
          <TimelineDate>{formatDate(log.log.date, "time")}</TimelineDate>
        </div>
      </div>
      {onDelete && (
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent"
          onClick={onDelete}
        >
          <TrashIcon className="text-red-400" />
        </Button>
      )}
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

function HabitLogHistoryItemText({ log }: { log: HabitHistoryLog }) {
  return (
    <>
      <p className="font-semibold">{log.habit.name}</p>
      {log.log.meta && "text" in log.log.meta && (
        <pre className="text-card-foreground whitespace-pre-wrap">
          {log.log.meta.text}
        </pre>
      )}
    </>
  );
}
