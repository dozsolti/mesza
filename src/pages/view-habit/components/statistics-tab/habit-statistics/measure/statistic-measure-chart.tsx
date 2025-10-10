import { useState } from 'react';

import { format } from 'date-fns';
import {
  CartesianGrid,
  Line,
  LineChart,
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

export default function StatisticMeasureChart({ habit }: { habit: Habit }) {
  const [period, setPeriod] = useState<string>("All");

  const logs = [...habit.logs];

  logs.sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const data = logs
    .filter((x) => {
      if (period === "All") return true;
      const now = new Date();
      const start = new Date();
      const end = new Date();

      switch (period) {
        case "Last 7 Days":
          start.setDate(now.getDate() - 7);
          break;
        case "Last 30 Days":
          start.setDate(now.getDate() - 30);
          break;
        case "Last 2 Months":
          start.setMonth(now.getMonth() - 2);
          break;
        case "Last 3 Months":
          start.setMonth(now.getMonth() - 3);
          break;
        case "This Year":
          start.setFullYear(now.getFullYear());
          start.setMonth(0);
          start.setDate(1);
          break;
        default:
          return true;
      }

      return x.date >= start && x.date <= end;
    })
    .map((x) => {
      return {
        month: format(x.date, "dd MMM yy HH:mm"),
        count: x.meta && "value" in x.meta ? x.meta.value : 0,
      };
    });

  return (
    <>
      <div className="text-right">
        <GraphPeriodDropdown
          period={period}
          setPeriod={setPeriod}
          options={[
            "All",
            "Last 7 Days",
            "Last 30 Days",
            "Last 2 Months",
            "Last 3 Months",
            "This Year",
          ]}
        />
      </div>
      <div>
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
            className="w-full min-h-[200px]"
          >
            <LineChart
              accessibilityLayer
              data={data}
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
                animationDuration={500}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </>
  );
}
