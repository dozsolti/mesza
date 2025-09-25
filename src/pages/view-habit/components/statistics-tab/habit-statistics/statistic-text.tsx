import { differenceInCalendarDays, format } from 'date-fns';

import { Habit, HabitLog, HabitLogMetaText } from '@/habit.types';
import { formatDateRelativeToday } from '@/lib/date.utils';

import StatisticCard from '../statistic-card';
import { Statistic } from './statistics.types';

export default function StatisticText({ habit }: { habit: Habit }) {
  const logs = [...habit.logs] as (HabitLog & { meta: HabitLogMetaText })[];

  logs.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const logsByDate = logs.reduce((acc, log) => {
    const date = format(log.date, "dd MMM yy");
    const existing = acc.find((a) => a.date === date)
      ? acc.find((a) => a.date === date)!
      : null;
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]);

  const firstLog = logs.reduce((a, b) => (a.date < b.date ? a : b));

  const total = logs.length;
  const daysFromFirstLog =
    differenceInCalendarDays(new Date(), firstLog.date) + 1;
  const totalDays = Object.keys(logsByDate).length;

  const orderByActive = logsByDate.sort((a, b) => b.count - a.count);

  // Get text length statistics
  const orderedTextLengths = [...logs];

  orderedTextLengths.sort((a, b) => a.meta.text.length - b.meta.text.length);

  const maxText = orderedTextLengths[orderedTextLengths.length - 1];
  const minText = orderedTextLengths[0];

  // Get most recent entries
  const recentEntries = logs
    .slice(-5)
    .reverse()
    .map((log) => ({
      date: formatDateRelativeToday(log.date),
      text: log.meta && "text" in log.meta ? log.meta.text : "N/A",
    }));

  const color = habit.color.slice(0, -2);

  const statistics: Statistic[] = [
    {
      title: "Total entries",
      value: total.toString(),
      color,
    },
    {
      title: "Days active",
      value: totalDays.toString(),
      color,
    },
    {
      title: "Days since first entry",
      value: daysFromFirstLog.toString(),
      color,
    },
    {
      title: "Most active day",
      value: orderByActive.length > 0 ? orderByActive[0].date : "N/A",
      color,
    },
    {
      title: "Longest entry",
      value: `${maxText.meta.text.length} chars`,
      hint: maxText.meta.text,
      color,
    },
    {
      title: "Shortest entry",
      value: `${minText.meta.text.length} chars`,
      hint: minText.meta.text,
      color,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="gap-4 grid grid-cols-2">
        {statistics.map((stat, index) => (
          <StatisticCard key={index} stat={stat} />
        ))}
      </div>

      {recentEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Recent Entries</h3>
          <div className="space-y-2">
            {recentEntries.map((entry, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg"
                style={{ backgroundColor: habit.color }}
              >
                <div className="mb-1 text-muted-foreground text-xs">
                  {entry.date}
                </div>
                <div className="text-sm">"{entry.text}"</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
