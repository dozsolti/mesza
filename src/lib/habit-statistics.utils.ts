import {
  Habit,
  HabitLogMetaChoice,
} from '@/habit.types';

export function getChoiceStatisticsData(
  habit: Habit,
  filterFunc?: (log: (typeof habit.logs)[0]) => boolean
) {
  const options = habit.type.config || [];

  if (options.length === 0) {
    return [];
  }

  const filteredLogs = filterFunc ? habit.logs.filter(filterFunc) : habit.logs;

  const optionsCountMap = options.reduce((acc, choice) => {
    acc[choice] = 0;
    return acc;
  }, {} as Record<string, number>);

  filteredLogs.forEach((log) => {
    const choice = (log.meta as HabitLogMetaChoice).choice;
    optionsCountMap[choice] = (optionsCountMap[choice] || 0) + 1;
  });

  const sortedChoices = Object.entries(optionsCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([choice, count]) => ({ choice, count }));

  return sortedChoices;
}
