import HabitIcon from "@/components/habit/habit-icon";
import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { getLogsByDate } from "@/store/useHabits";
import { type HabitHistoryLog } from "@/types";
import { format } from "date-fns";

export default function HabitHistoryList({ date, logs }: { date: Date; logs?: HabitHistoryLog[] }) {
  const habitLogs = logs || getLogsByDate(date);
  if (habitLogs.length === 0) {
    return (
      <p className="mt-10 text-muted-foreground text-center">
        No habits were completed on this day.
      </p>
    );
  }
  return (
    <div className="pt-5 pb-20">
      <Timeline defaultValue={habitLogs.length}>
        {habitLogs.map((log, i) => (
          <TimelineItem
            key={log.log.date.toISOString()}
            step={i + 1}
            className="group-data-[orientation=vertical]/timeline:not-last:pb-6"
          >
            {log.habit.type === "counter" || log.habit.type === "daily" ? (
              <HabitLogHistoryItemCounter log={log} />
            ) : log.habit.type === "measure" ? (
              <HabitLogHistoryItemMeasure log={log} />
            ) : null}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

function HabitLogHistoryItemCounter({ log }: { log: HabitHistoryLog }) {
  return (
    <TimelineHeader>
      <TimelineSeparator
        style={{ backgroundColor: "white", borderColor: "white" }}
      />
      <TimelineTitle className="flex gap-2">
        <HabitIcon iconName={log.habit.icon} />

        <div className="flex flex-col">
          {log.habit.name}
          <TimelineDate>{format(log.log.date, "p")}</TimelineDate>
        </div>
      </TimelineTitle>
      <TimelineIndicator
        style={{
          backgroundColor: log.habit.color.slice(0, -2),
          borderColor: "white",
        }}
      />
    </TimelineHeader>
  );
}

function HabitLogHistoryItemMeasure({ log }: { log: HabitHistoryLog }) {
  return (
    <TimelineHeader>
      <TimelineSeparator
        style={{ backgroundColor: "white", borderColor: "white" }}
      />
      <TimelineTitle className="flex gap-2">
        <HabitIcon iconName={log.habit.icon} />

        <div className="flex flex-col">
          <p>
            {log.habit.name}
            {log.log.meta ? ` ⚬ ${log.log.meta.value}` : null}

          </p>
          <TimelineDate>{format(log.log.date, "p")}</TimelineDate>
        </div>
      </TimelineTitle>
      <TimelineIndicator
        style={{
          backgroundColor: log.habit.color.slice(0, -2),
          borderColor: "white",
        }}
      />
    </TimelineHeader>
  );
}
