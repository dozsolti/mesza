import {
  differenceInCalendarDays,
  format,
  isToday,
} from 'date-fns';

import { Habit } from '@/habit.types';
import { formatDate } from '@/lib/date.utils';

import StatisticCard from '../../statistic-card';
import { Statistic } from '../statistics.types';
import StatisticCounterChart from './statistic-counter-chart';

export default function StatisticCounter({ habit }: { habit: Habit }) {
  const firstLog = habit.logs.reduce((a, b) => (a.date < b.date ? a : b));

  const formattedChartData = new Array<{ month: string; count: number }>(
    differenceInCalendarDays(new Date(), firstLog.date) + 1
  )
    .fill({ month: "", count: 0 })
    .map((_, i) => {
      const date = new Date(firstLog.date);
      date.setDate(date.getDate() + i);
      return { month: format(date, "dd MMM yy"), count: 0 };
    });

  habit.logs.forEach((log) => {
    const date = format(log.date, "dd MMM yy");
    const existing = formattedChartData.find((d) => d.month === date);
    if (existing) {
      existing.count += 1;
    }
  });

  const total = habit.logs.length;

  const logsByDate = habit.logs.reduce((acc, log) => {
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

  const totalToday = logsByDate.filter((log) => isToday(log.date)).length;

  const daysFromFirstLog =
    differenceInCalendarDays(new Date(), firstLog.date) + 1;
  const totalDays = Object.keys(logsByDate).length;

  const orderByActive = [...formattedChartData].sort(
    (a, b) => b.count - a.count
  );

  const color = habit.color.slice(0, -2);
  const stats: Statistic[] = [
    { title: "Total", color, value: total, isImportant: true },
    { title: "Total Today", color, value: totalToday, isImportant: true },
    {
      title: "Avg per Day",
      color,
      value: (total / (totalDays || 1)).toFixed(2),
    },
    {
      title: "Active Days",
      color,
      value: totalDays,
    },
    {
      title: "Days without Completion",
      color,
      value: daysFromFirstLog - totalDays,
    },
    {
      title: "Most Active Day",
      color,
      value: `x${orderByActive[0].count}`,
      hint: formatDate(orderByActive[0].month, "datetime"),
    },
    {
      title: "Least Active Day",
      color,
      value: `x${orderByActive[orderByActive.length - 1].count}`,
      hint: formatDate(
        orderByActive[orderByActive.length - 1].month,
        "datetime"
      ),
    },
  ];

  return (
    <div>
      <StatisticCounterChart habit={habit} />
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
