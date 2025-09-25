import { isSameDay } from 'date-fns';
import { truncate, uniqWith } from 'lodash';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Habit, HabitLogMetaChoice } from '@/habit.types';
import { formatDate } from '@/lib/date.utils';

import StatisticCard from '../statistic-card';
import { Statistic } from './statistics.types';

export default function StatisticChoice({ habit }: { habit: Habit }) {
  const total = habit.logs.length;

  const options = habit.type.config || [];

  if (options.length === 0) {
    return <div>No options available for this habit.</div>;
  }

  const optionsCountMap = options.reduce((acc, choice) => {
    acc[choice] = 0;
    return acc;
  }, {} as Record<string, number>);

  habit.logs.forEach((log) => {
    const choice = (log.meta as HabitLogMetaChoice).choice;
    optionsCountMap[choice] = (optionsCountMap[choice] || 0) + 1;
  });

  const sortedChoices = Object.entries(optionsCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([choice, count]) => ({ choice, count }));

  const color = habit.color.slice(0, -2);
  const stats: Statistic[] = [
    {
      title: "Most Chosen",
      color,
      isImportant: true,
      value: `${sortedChoices[0].choice} (x${sortedChoices[0].count})`,
      hint: "",
    },
    {
      title: "Least Chosen",
      color,
      value: `${sortedChoices[sortedChoices.length - 1].choice} (x${
        sortedChoices[sortedChoices.length - 1].count
      })`,
      hint: "",
    },

    { title: "Total", color, value: total },
    {
      title: "Active Days",
      color,
      value: uniqWith(habit.logs, (a, b) => isSameDay(a.date, b.date)).length,
      hint: "",
    },
    {
      title: "Last Choice",
      color,
      value: (habit.logs[habit.logs.length - 1].meta as HabitLogMetaChoice)
        .choice,
      hint: formatDate(habit.logs[habit.logs.length - 1].date, "datetime"),
    },
    {
      title: "First Choice",
      color,
      value: (habit.logs[0].meta as HabitLogMetaChoice).choice,
      hint: formatDate(habit.logs[0].date, "datetime"),
    },
  ];

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
          data={sortedChoices.filter((x) => x.count > 0)}
          margin={{ left: -20, right: 0 }}
        >
          <CartesianGrid />
          <YAxis dataKey="count" domain={[0, "dataMax + 1"]} />
          <XAxis
            dataKey="choice"
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
          <StatisticCard key={i} stat={stat} />
        ))}
      </div>
    </>
  );
}
