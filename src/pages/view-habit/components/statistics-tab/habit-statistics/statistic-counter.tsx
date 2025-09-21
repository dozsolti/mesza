import { differenceInCalendarDays, format } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Habit } from '@/habit.types';

import StatisticCard from '../statistic-card';

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

  // const firstLog = habit.logs.reduce((a, b) => (a.date < b.date ? a : b));

  const daysFromFirstLog =
    differenceInCalendarDays(new Date(), firstLog.date) + 1;
  const totalDays = Object.keys(logsByDate).length;

  const orderByActive = [...formattedChartData].sort(
    (a, b) => b.count - a.count
  );

  const stats = [
    { label: "Total", value: total },
    {
      label: "Avg per Day",
      value: (total / (totalDays || 1)).toFixed(2),
    },
    {
      label: "Active Days",
      value: totalDays,
    },
    {
      label: "Days without Completion",
      value: daysFromFirstLog - totalDays,
    },
    {
      label: "Most Active Day",
      value: `x${orderByActive[0].count}`,
      date: format(orderByActive[0].month, "dd MMM yy HH:mm"),
    },
    {
      label: "Least Active Day",
      value: `x${orderByActive[orderByActive.length - 1].count}`,
      date: format(
        orderByActive[orderByActive.length - 1].month,
        "dd MMM yy HH:mm"
      ),
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
      >
        <LineChart
          accessibilityLayer
          data={formattedChartData}
          margin={{ left: -20, right: 0 }}
        >
          <CartesianGrid />
          <YAxis dataKey="count" domain={["dataMin - 5", "dataMax + 5"]} />
          <XAxis dataKey="month" />
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
          <StatisticCard
            key={i}
            title={stat.label}
            value={stat.value}
            date={stat.date}
            color={habit.color.slice(0, -2)}
            isImportant={i == 0}
          />
        ))}
      </div>
    </div>
  );
}
