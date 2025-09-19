import { Habit, HabitLogMetaChoice, HabitLogMetaMeasure } from "@/habit.types";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  differenceInCalendarDays,
  format,
  isSameDay,
  subMonths,
} from "date-fns";
import { truncate, uniqWith } from "lodash";
import { Card, CardContent } from "@/components/ui/card";
import HeatMap from "@uiw/react-heat-map";
import { useState } from "react";

export default function StatisticsTab({ habit }: { habit: Habit }) {
  if (habit.logs.length < 2) {
    return (
      <p className="p-4 text-muted-foreground text-2xl text-center">
        Start logging to see statistics.
      </p>
    );
  }

  if (habit.type.value === "counter") {
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
          {stats.map((stat) => (
            <Card
              className="relative p-3 border-2"
              key={stat.label}
              style={{
                borderColor: habit.color.slice(0, -2) + "50",
                backgroundColor: habit.color.slice(0, -2) + "10",
              }}
            >
              <CardContent className="flex flex-col justify-between p-0">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="space-x-2.5 mt-2 text-end">
                  <p className="font-semibold text-foreground text-3xl">
                    {stat.value}
                  </p>
                  {stat.date && (
                    <p className="text-muted-foreground text-sm">{stat.date}</p>
                  )}
                </dd>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (habit.type.value === "daily") {
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
            <Card
              className="relative p-6 py-4 border-2"
              key={stat.label}
              style={{
                borderColor: habit.color.slice(0, -2) + "50",
                backgroundColor: habit.color.slice(0, -2) + "10",
              }}
            >
              <CardContent className="flex flex-col justify-between p-0">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="space-x-2.5 mt-2 text-end">
                  <span
                    className={
                      "font-semibold text-foreground text-3xl text-end " +
                      (i === 0 ? "text-6xl" : "")
                    }
                  >
                    {stat.value}
                  </span>
                </dd>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (habit.type.value === "measure") {
    const logs = [...habit.logs];

    logs.sort((a, b) => a.date.valueOf() - b.date.valueOf());

    const chartData = logs.map((x) => {
      console.log(x);
      return {
        month: format(x.date, "dd MMM yy HH:mm"),
        count: x.meta && "value" in x.meta ? x.meta.value : 0,
      };
    });

    const logsByDate = logs.reduce((acc, log) => {
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

    const firstLog = logs.reduce((a, b) => (a.date < b.date ? a : b));

    const total = logs.length;
    const daysFromFirstLog =
      differenceInCalendarDays(new Date(), firstLog.date) + 1;
    const totalDays = Object.keys(logsByDate).length;

    const orderByActive = logsByDate.sort((a, b) => b.count - a.count);

    const logsValueSorted = logs.sort((a, b) => {
      const aValue = (a.meta as HabitLogMetaMeasure).value;
      const bValue = (b.meta as HabitLogMetaMeasure).value;
      return aValue - bValue;
    });

    const stats = [
      {
        label: "Lowest",
        value: (logsValueSorted[0].meta as HabitLogMetaMeasure).value,
        date: format(logsValueSorted[0].date, "dd MMM yy HH:mm"),
      },
      {
        label: "Highest",
        value: (
          logsValueSorted[logsValueSorted.length - 1]
            .meta as HabitLogMetaMeasure
        ).value,
        date: format(
          logsValueSorted[logsValueSorted.length - 1].date,
          "dd MMM yy HH:mm"
        ),
      },
      {
        label: "Most Active Day",
        value: `${orderByActive[0].count}`,
        date: format(orderByActive[0].date, "dd MMM yy HH:mm"),
      },
      { label: "Total Completions", value: total },
      {
        label: "Active Days",
        value: totalDays,
      },
      {
        label: "Days without Completion",
        value: daysFromFirstLog - totalDays,
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
          className="w-full min-h-[200px]"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -20, right: 0 }}
          >
            <CartesianGrid />
            <YAxis dataKey="count" domain={["dataMin - 5", "dataMax + 5"]} />
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
            />
          </LineChart>
        </ChartContainer>
        <h3 className="mt-6 font-medium text-muted-foreground text-lg">
          Statistics
        </h3>
        <div className="gap-2 grid grid-cols-2">
          {stats.map((stat) => (
            <Card
              className="relative p-3 border-2"
              key={stat.label}
              style={{
                borderColor: habit.color.slice(0, -2) + "50",
                backgroundColor: habit.color.slice(0, -2) + "10",
              }}
            >
              <CardContent className="flex flex-col justify-between p-0">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="flex flex-col space-x-2.5 mt-2 text-end">
                  <p className="font-semibold text-foreground text-3xl">
                    {stat.value}
                  </p>
                  {stat.date && (
                    <p className="text-muted-foreground text-sm">{stat.date}</p>
                  )}
                </dd>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (habit.type.value === "choice") {
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

    const formattedChartData = Object.entries(chartData).map(
      ([month, count]) => {
        return { month, count };
      }
    );

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
          {stats.map((stat) => (
            <Card
              className="relative p-3 border-2"
              key={stat.label}
              style={{
                borderColor: habit.color.slice(0, -2) + "50",
                backgroundColor: habit.color.slice(0, -2) + "10",
              }}
            >
              <CardContent className="flex flex-col justify-between p-0">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="flex flex-col space-x-2.5 mt-2 text-end">
                  <p className="font-semibold text-foreground text-3xl">
                    {stat.value}
                  </p>
                  {stat.date && (
                    <p className="text-muted-foreground text-sm">{stat.date}</p>
                  )}
                </dd>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <p className="text-muted-foreground">
      This habit type does not have statistics.
    </p>
  );
}
