import { Habit } from '@/habit.types';
import {
  formatDate,
  formatTimeSince,
} from '@/lib/date.utils';

import StatisticCard from '../statistic-card';
import { Statistic } from './statistics.types';

export default function StatisticInterval({ habit }: { habit: Habit }) {
  const logs = habit.logs;

  const total = logs.length;

  const intervals = [...logs].reduce(
    (
      acc: {
        interval: number;
        log: (typeof logs)[0];
        formatted: string;
        isNow: boolean;
      }[],
      log,
      i,
      arr
    ) => {
      const nextDate = i === arr.length - 1 ? new Date() : arr[i + 1].date;

      const diff = nextDate.getTime() - log.date.getTime();
      acc.push({
        interval: diff / (1000 * 60 * 60), // convert ms to days
        log,
        formatted: formatTimeSince(log.date, nextDate),
        isNow: i === arr.length - 1,
      });

      return acc;
    },
    []
  );

  intervals.sort((a, b) => b.interval - a.interval);

  const longestInterval = intervals[0];
  const shortestInterval = intervals[intervals.length - 1].isNow
    ? intervals[intervals.length - 2]
    : intervals[intervals.length - 1];

  const color = habit.color.slice(0, -2);
  const stats: Statistic[] = [
    {
      title: "Longest interval",
      value: longestInterval.formatted,
      hint: formatDate(longestInterval.log.date, "datetime"),
      isImportant: true,
      color,
    },
    {
      title: "Shortest interval",
      isImportant: true,
      value: shortestInterval.formatted,
      hint: formatDate(shortestInterval.log.date, "datetime"),
      color,
    },
    {
      title: "Total Logs",
      value: total,
      color,
    },
    {
      title: "Average interval",
      value: `${(
        intervals.reduce((acc, cur) => acc + cur.interval, 0) /
        intervals.length /
        24
      ).toFixed(1)} days`,
      hint: "",
      color,
    },
  ];

  return (
    <div>
      <h3 className="mt-6 font-medium text-muted-foreground text-lg">
        Statistics
      </h3>
      <div className="gap-2 grid grid-cols-2">
        {stats.map((stat, i) => (
          <StatisticCard key={i} stat={stat} />
        ))}
      </div>
    </div>
  );
}
