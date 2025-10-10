import { isSameDay } from 'date-fns';
import { uniqWith } from 'lodash';

import {
  Habit,
  HabitLogMetaChoice,
} from '@/habit.types';
import { formatDate } from '@/lib/date.utils';
import { getChoiceStatisticsData } from '@/lib/habit-statistics.utils';

import StatisticCard from '../../statistic-card';
import { Statistic } from '../statistics.types';
import StatisticChoiceChart from './statistic-choice-chart';

export default function StatisticChoice({ habit }: { habit: Habit }) {
  
  const total = habit.logs.length;
  const data = getChoiceStatisticsData(habit);

  if (data.length === 0) {
    return <div>No options available for this habit.</div>;
  }

  const color = habit.color.slice(0, -2);
  const stats: Statistic[] = [
    {
      title: "Most Chosen",
      color,
      isImportant: true,
      value: `${data[0].choice} (x${data[0].count})`,
      hint: "",
    },
    {
      title: "Least Chosen",
      color,
      value: `${data[data.length - 1].choice} (x${
        data[data.length - 1].count
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
      <StatisticChoiceChart habit={habit} />

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