import { differenceInCalendarDays, format } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Habit, HabitLogMetaMeasure } from '@/habit.types';

import StatisticCard from '../statistic-card';
import { Statistic } from './statistics.types';

export default function StatisticMeasure({ habit }: { habit: Habit }) {
  const logs = [...habit.logs];

  logs.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const chartData = logs.map((x) => {
    return {
      month: format(x.date, "dd MMM yy HH:mm"),
      count: x.meta && "value" in x.meta ? x.meta.value : 0,
    };
  });

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

  const logsValueSorted = logs.sort((a, b) => {
    const aValue = (a.meta as HabitLogMetaMeasure).value;
    const bValue = (b.meta as HabitLogMetaMeasure).value;
    return aValue - bValue;
  });

  const color = habit.color.slice(0, -2);
  const stats: Statistic[] = [
    {
      title: "Lowest",
      color,
      value: (logsValueSorted[0].meta as HabitLogMetaMeasure).value,
      hint: format(logsValueSorted[0].date, "dd MMM yy HH:mm"),
    },
    {
      title: "Highest",
      color,
      value: (
        logsValueSorted[logsValueSorted.length - 1].meta as HabitLogMetaMeasure
      ).value,
      hint: format(
        logsValueSorted[logsValueSorted.length - 1].date,
        "dd MMM yy HH:mm"
      ),
    },
    {
      title: "Most Active Day",
      color,
      value: `${orderByActive[0].count}`,
      hint: format(orderByActive[0].date, "dd MMM yy HH:mm"),
    },
    { title: "Total Completions", color, value: total },
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
  ];

  return (
    <div>
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "var(--primary)",
          },
        }}
        className="w-full min-h-[200px]"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -20, right: 0 }}
        >
          <CartesianGrid />
          <YAxis dataKey="count" domain={["dataMin - 1", "dataMax + 1"]} />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => value.slice(0, "dd MMM yy".length)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="count"
            type="linear"
            stroke={habit.color.slice(0, -2) || "var(--primary)"}
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
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
