import { useState } from 'react';

import {
  differenceInCalendarDays,
  format,
} from 'date-fns';
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

export default function StatisticCounterChart({ habit }: { habit: Habit }) {
  const [period, setPeriod] = useState<string>("All");

  const firstLog = habit.logs.reduce((a, b) => (a.date < b.date ? a : b));
  const startDate =
    period === "All"
      ? firstLog.date
      : (() => {
          const now = new Date();
          switch (period) {
            case "This Week":
              return new Date(now.setDate(now.getDate() - now.getDay()));
            case "Last 2 Weeks":
              return new Date(now.setDate(now.getDate() - now.getDay() - 7));
            case "This Month":
              return new Date(now.getFullYear(), now.getMonth(), 1);
            case "This Year":
              return new Date(now.getFullYear(), 0, 1);
            default:
              return firstLog.date;
          }
        })();

  const formattedChartData = new Array<{ month: string; count: number }>(
    differenceInCalendarDays(new Date(), startDate) + 1
  )
    .fill({ month: "", count: 0 })
    .map((_, i) => {
      const date = new Date(startDate);
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

  
  return (
    <>
      <div className="text-right">
        <GraphPeriodDropdown
          period={period}
          setPeriod={setPeriod}
          options={[
            "All",
            "This Week",
            "Last 2 Weeks",
            "This Month",
            "This Year",
          ]}
        />
      </div>

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
            <YAxis dataKey="count" domain={[0, "dataMax + 1"]} />
            <XAxis dataKey="month" />
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
      </div>
    </>
  );
}
