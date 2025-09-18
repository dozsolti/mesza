import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Habit, HabitHistoryLog } from "@/habit.types";
import { format, isSameDay, isToday } from "date-fns";
import { useMemo, useState } from "react";
import { DayButtonProps, getDefaultClassNames } from "react-day-picker";
import HabitLogHistoryItem from "@/components/habit/habit-history/habit-history-list-item";

const defaultClassNames = getDefaultClassNames();

export default function CalendarTab({ habit }: { habit: Habit }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const logs: HabitHistoryLog[] = useMemo(
    () =>
      date
        ? habit.logs
            .filter((log) => isSameDay(log.date, date!))
            .map((log) => ({ habit, log }))
        : [],
    [date, habit]
  );

  return (
    <>
      <Calendar
        mode="single"
        showOutsideDays
        selected={date}
        onSelect={(date) => setDate((old) => date || old)}
        className="mx-auto p-4 border rounded-lg w-full"
        classNames={{
          today: `${defaultClassNames.today} border-1 border-zinc-700`,
          selected: `${defaultClassNames.selected} bg-zinc-500 hover:bg-zinc-700`,

          root: `${defaultClassNames.root} shadow-lg p-5`,
          chevron: `${defaultClassNames.chevron} fill-amber-500`,
        }}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Day: (props: any) => <DayButton {...props} habit={habit} />,
        }}
      />

      <div className="mt-4">
        <LogList logs={logs} date={date} />
      </div>
    </>
  );
}

function DayButton(props: DayButtonProps & { habit: Habit }) {
  const { day, habit, ...buttonProps } = props;
  const logs = habit.logs.filter(
    (log) => isSameDay(log.date, day.date) && !isToday(log.date)
  );

  const className = cn(
    buttonProps.className,
    "relative m-0.5 rounded-lg",
    logs.length > 0 && "border-1 "
  );

  return (
    <td
      className={className}
      style={{
        borderColor: logs.length > 0 ? habit.color.slice(0, -2) : undefined,
        backgroundColor: logs.length > 0 ? habit.color : undefined,
      }}
    >
      <span className="flex flex-col">
        {props.children}
        {logs.length > 0 && (
          <span className="right-0 bottom-0 left-0 absolute font-medium text-[10px] text-muted-foreground pointer-events-none">
            {logs.length}
          </span>
        )}
      </span>
    </td>
  );
}

function LogList({
  logs,
  date,
}: {
  logs: HabitHistoryLog[];
  date: Date | undefined;
}) {
  if (!date) return null;

  if (logs.length === 0)
    return <p className="text-muted-foreground">No logs for this day.</p>;
  return (
    <>
      <h2 className="font-semibold text-muted-foreground text-lg">
        Logs for{" "}
        <span className="text-foreground italic">
          {isToday(date) ? "today" : format(date, "PPP")}
        </span>
      </h2>
      {logs.map((log) => (
        <HabitLogHistoryItem
          key={log.log.date.toISOString()}
          log={log}
          className="py-2 not-last:border-b-1"
        />
      ))}
    </>
  );
}
