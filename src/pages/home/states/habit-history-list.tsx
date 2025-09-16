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
import { format } from "date-fns";

export default function HabitHistoryList({ date }: { date: Date }) {
  const habitLogs = getLogsByDate(date);
  if (habitLogs.length === 0) {
    return (
      <p className="mt-10 text-muted-foreground text-center">
        No habits were completed on this day.
      </p>
    );
  }
  return (
    <div className="pt-3">
      <Timeline defaultValue={habitLogs.length}>
        {habitLogs.map((log, i) => (
          <TimelineItem
            key={log.log.date.toISOString()}
            step={i + 1}
            className="group-data-[orientation=vertical]/timeline:not-last:pb-6"
          >
            <TimelineHeader>
              <TimelineSeparator
                style={{ backgroundColor: "white", borderColor: "white" }}
              />
              <TimelineDate>
                {format(log.log.date, "MMM dd, yyyy 'at' h:mm a")}
              </TimelineDate>
              <TimelineTitle>{log.habit.name}</TimelineTitle>
              <TimelineIndicator
                style={{
                  backgroundColor: log.habit.color.slice(0, -2),
                  borderColor: "white",
                }}
              />
            </TimelineHeader>
            {/* <TimelineContent>{""}</TimelineContent> */}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
