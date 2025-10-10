import { useState } from 'react';

import {
  differenceInCalendarDays,
  isSameDay,
  isSameYear,
} from 'date-fns';
import { truncate } from 'lodash';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import GraphPeriodDropdown from '@/components/graph-period-dropdown';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Habit } from '@/habit.types';
import { getChoiceStatisticsData } from '@/lib/habit-statistics.utils';
import { cn } from '@/lib/utils';

const MIN_BARS_FOR_SCROLL = 5;

export default function StatisticChoiceChart({ habit }: { habit: Habit }) {
  const [period, setPeriod] = useState<string>("All");

  const now = new Date();

  const data = getChoiceStatisticsData(
    habit,
    period === "All"
      ? undefined
      : (log) => {
          switch (period) {
            case "Today":
              return isSameDay(log.date, now);
            case "Last 7 Days":
              return differenceInCalendarDays(now, log.date) <= 7;
            case "Last 30 Days":
              return differenceInCalendarDays(now, log.date) <= 30;
            case "This Year":
              return isSameYear(log.date, now);
            default:
              return false;
          }
        }
  ).filter((x) => x.count > 0);

  const graphWidth =
    data.length <= MIN_BARS_FOR_SCROLL
      ? "100%"
      : (window.innerWidth / MIN_BARS_FOR_SCROLL) * data.length;

  return (
    <>
      <div className="text-right">
        <GraphPeriodDropdown period={period} setPeriod={setPeriod} />
      </div>
      <div
        className={cn(
          "rounded-lg w-full overflow-x-auto",
          data.length === 0 && "bg-accent"
        )}
      >
        {data.length === 0 ? (
          <div className="my-4 text-sm text-center text-accent-foreground">
            No data for the selected period.
          </div>
        ) : (
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "var(--primary)",
              },
            }}
            className="min-h-[300px] aspect-[6/1]"
            style={{
              width: graphWidth,
            }}
          >
            <BarChart
              accessibilityLayer
              data={data}
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
        )}
      </div>
    </>
  );
}
