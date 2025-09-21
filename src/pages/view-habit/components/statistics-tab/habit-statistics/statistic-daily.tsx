import { differenceInCalendarDays, format, isSameDay, subMonths } from 'date-fns';
import { uniqWith } from 'lodash';
import { useState } from 'react';

import { Habit } from '@/habit.types';
import HeatMap from '@uiw/react-heat-map';

import StatisticCard from '../statistic-card';

export default function StatisticDaily({ habit }: { habit: Habit }) {
  const logs = uniqWith(
    habit.logs,
    (x, y) => x.date.toDateString() === y.date.toDateString()
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  const total = logs.length;

  const firstLog = logs[logs.length - 1];

  const totalDays = differenceInCalendarDays(new Date(), firstLog.date) + 1;

  const stats = [
    {
      label: "Current Streak",
      value: (() => {
        let streak = 0;

        for (let i = 0; i < logs.length; i++) {
          const logDate = logs[i].date;
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - streak);
          if (isSameDay(logDate, expectedDate)) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      })(),
    },
    {
      label: "Longest Streak",
      value: (() => {
        let longestStreak = 0;
        let currentStreak = 1;
        for (let i = logs.length - 1; i > 1; i--) {
          const prevLogDate = logs[i].date;
          const currentLogDate = logs[i - 1].date;
          const diffInDays = differenceInCalendarDays(
            currentLogDate,
            prevLogDate
          );
          if (diffInDays === 1) {
            currentStreak++;
          } else if (diffInDays > 1) {
            if (currentStreak >= longestStreak) {
              longestStreak = currentStreak;
            }
          }
        }
        return longestStreak;
      })(),
    },
    { label: "Total Days Tracked", value: total },
    {
      label: "Days without Completion",
      value: totalDays - total,
    },
  ];

  const value = logs.reduce((acc, log) => {
    const date = format(log.date, "yyyy/MM/dd");
    const existing = acc.find((a) => a.date === date);
    if (!existing) {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]);

  const startDate = subMonths(new Date(), 3);
  const panelColors = [
    habit.color.slice(0, -2) + "20",
    habit.color.slice(0, -2) + "b0",
  ];

  const [selected, setSelected] = useState("");

  return (
    <div>
      <HeatMap
        value={value}
        className="rounded-lg w-full h-full text-card-foreground"
        style={{ color: "white" }}
        panelColors={panelColors}
        strokeWidth="2"
        strokeLinejoin="round"
        startDate={startDate}
        rectSize={20}
        rectRender={(props, data) => {
          const date = format(data.date, "yyyy/MM/dd");
          const isSelected = selected === date;

          if (selected !== "") {
            props.fill = isSelected
              ? "var(--foreground)"
              : panelColors[data.count || 0];

            props.style = {
              stroke: isSelected ? habit.color.slice(0, -2) : "none",
            };
          }

          return (
            <rect
              {...props}
              onClick={() => {
                setSelected(date);
              }}
            />
          );
        }}
      />

      <p className="mb-3 text-muted-foreground text-sm text-end">
        {selected ? (
          <span>
            {value.some((v) => v.date === selected)
              ? "Completed"
              : "Uncompleted"}
            {" - "}
            {format(new Date(selected), "dd MMM yyyy")}
          </span>
        ) : (
          "Click a day"
        )}
      </p>

      <h3 className="mt-6 font-medium text-muted-foreground text-lg">
        Statistics
      </h3>
      <div className="gap-2 grid grid-cols-2">
        {stats.map((stat, i) => (
          <StatisticCard
            key={i}
            title={stat.label}
            value={stat.value}
            color={habit.color.slice(0, -2)}
            isImportant={i < 2}
          />
        ))}
      </div>
    </div>
  );
}
