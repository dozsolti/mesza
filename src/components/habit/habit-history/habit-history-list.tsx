import UbiSmileNoMouth from '@/components/ubi/UbiSmileNoMouth';
import {
  Timeline,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from '@/components/ui/timeline';
import { HabitHistoryLog } from '@/habit.types';
import { getLogsByDate } from '@/lib/habit.utils';
import { useHabitStore } from '@/stores/use-habit-store';

import HabitLogHistoryItem from './habit-history-list-item';

export default function HabitHistoryList({
  date,
  logs,
}: {
  date: Date;
  logs?: HabitHistoryLog[];
}) {
  const { deleteLog } = useHabitStore();

  const askToDeleteLog = (log: HabitHistoryLog) => {
    if (confirm("Are you sure you want to delete this log?")) {
      deleteLog(log.habit.id, log.log.date);
    }
  };

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
      <div className='flex justify-evenly items-center bg-accent/5 mb-4 p-1 border rounded-lg'>
        <UbiSmileNoMouth className="w-30 h-30" />
        <p className="text-muted-foreground text-xl">Keep going, you're doing great!</p>
      </div>

      <Timeline defaultValue={habitLogs.length}>
        {habitLogs.map((log, i) => (
          <TimelineItem
            key={log.log.date.toISOString()}
            step={i + 1}
            className="group-data-[orientation=vertical]/timeline:not-last:pb-6"
          >
            <TimelineHeader>
              <TimelineSeparator className="bg-background border border-border" />
              <div className="flex gap-2">
                <HabitLogHistoryItem
                  log={log}
                  onDelete={() => askToDeleteLog(log)}
                />
              </div>
              <TimelineIndicator
                className="border-none"
                style={{
                  backgroundColor: log.habit.color.slice(0, -2),
                }}
              />
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
