import {
    Timeline, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle
} from '@/components/ui/timeline';
import { HabitHistoryLog } from '@/habit.types';
import { getLogsByDate } from '@/lib/habit.utils';

import HabitLogHistoryItem from './habit-history-list-item';

export default function HabitHistoryList({
  date,
  logs,
}: {
  date: Date;
  logs?: HabitHistoryLog[];
}) {
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
            <TimelineHeader>
              <TimelineSeparator
                style={{ backgroundColor: "white", borderColor: "white" }}
              />
              <TimelineTitle className="flex gap-2">
                <HabitLogHistoryItem log={log} />
              </TimelineTitle>
              <TimelineIndicator
                style={{
                  backgroundColor: log.habit.color.slice(0, -2),
                  borderColor: "white",
                }}
              />
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
