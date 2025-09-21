import { format, isSameDay } from 'date-fns';
import { truncate, uniqWith } from 'lodash';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Habit, HabitLogMetaChoice } from '@/habit.types';

import StatisticCard from '../statistic-card';

export default function StatisticChoice({ habit }: { habit: Habit }) {
  const total = habit.logs.length;

  const stats = [
    {
      label: "Most Chosen",
      value: (() => {
        const choiceCount = habit.type.config!.reduce((acc, choice) => {
          acc[choice] = 0;
          return acc;
        }, {} as Record<string, number>);
        habit.logs.forEach((log) => {
          const choice = (log.meta as HabitLogMetaChoice).choice;
          choiceCount[choice] = (choiceCount[choice] || 0) + 1;
        });
        const sortedChoices = Object.entries(choiceCount).sort(
          (a, b) => b[1] - a[1]
        );
        return `${sortedChoices[0][0]} (x${sortedChoices[0][1]})`;
      })(),
      date: "",
    },
    {
      label: "Least Chosen",
      value: (() => {
        const choiceCount = habit.type.config!.reduce((acc, choice) => {
          acc[choice] = 0;
          return acc;
        }, {} as Record<string, number>);
        habit.logs.forEach((log) => {
          const choice = (log.meta as HabitLogMetaChoice).choice;
          choiceCount[choice] = (choiceCount[choice] || 0) + 1;
        });
        const sortedChoices = Object.entries(choiceCount).sort(
          (a, b) => a[1] - b[1]
        );
        return `${sortedChoices[0][0]} (x${sortedChoices[0][1]})`;
      })(),
      date: "",
    },

    { label: "Total", value: total },
    {
      label: "Active Days",
      value: uniqWith(habit.logs, (a, b) => isSameDay(a.date, b.date)).length,
      date: "",
    },
    {
      label: "Last Choice",
      value: (habit.logs[habit.logs.length - 1].meta as HabitLogMetaChoice)
        .choice,
      date: format(habit.logs[habit.logs.length - 1].date, "dd MMM yy HH:mm"),
    },
    {
      label: "First Choice",
      value: (habit.logs[0].meta as HabitLogMetaChoice).choice,
      date: format(habit.logs[0].date, "dd MMM yy HH:mm"),
    },
  ];

  const chartData = habit.logs.reduce((acc, log) => {
    const choice = (log.meta as HabitLogMetaChoice).choice
      ? (log.meta as HabitLogMetaChoice).choice
      : "Unknown";
    const key = choice;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formattedChartData = Object.entries(chartData).map(([month, count]) => {
    return { month, count };
  });

  return (
    <>
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "var(--primary)",
          },
        }}
        className="w-full min-h-[200px]"
      >
        <BarChart
          accessibilityLayer
          data={formattedChartData}
          margin={{ left: -20, right: 0 }}
        >
          <CartesianGrid />
          <YAxis dataKey="count" domain={[0, "dataMax"]} />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => truncate(value, { length: 10 })}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            type="linear"
            stroke={habit.color.slice(0, -2) || "var(--primary)"}
            fill={habit.color || "var(--primary)"}
            strokeWidth={2}
          />
        </BarChart>
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
    </>
  );
}
