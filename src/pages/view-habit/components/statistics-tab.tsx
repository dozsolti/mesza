import { Habit } from '@/habit.types';

import StatisticChoice
  from './statistics-tab/habit-statistics/choice/statistic-choice';
import StatisticCounter
  from './statistics-tab/habit-statistics/counter/statistic-counter';
import StatisticMeasure
  from './statistics-tab/habit-statistics/measure/statistic-measure';
import StatisticDaily from './statistics-tab/habit-statistics/statistic-daily';
import StatisticText from './statistics-tab/habit-statistics/statistic-text';
import StatisticInterval
  from './statistics-tab/habit-statistics/statitic-interval';

export default function StatisticsTab({ habit }: { habit: Habit }) {
  if (habit.logs.length < 2) {
    return (
      <p className="p-4 text-muted-foreground text-2xl text-center">
        Start logging to see statistics.
      </p>
    );
  }

  if (habit.type.value === "counter") {
    return <StatisticCounter habit={habit} />;
  }

  if (habit.type.value === "daily") {
    return <StatisticDaily habit={habit} />;
  }

  if (habit.type.value === "measure") {
    return <StatisticMeasure habit={habit} />;
  }

  if (habit.type.value === "interval") {
    return <StatisticInterval habit={habit} />;
  }

  if (habit.type.value === "choice") {
    return <StatisticChoice habit={habit} />;
  }

  if (habit.type.value === "text") {
    return <StatisticText habit={habit} />;
  }

  return (
    <p className="text-muted-foreground">
      This habit type does not have statistics.
    </p>
  );
}
