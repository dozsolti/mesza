// import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Habit } from "@/habit.types";
import HabitIcon from "./habit-icon";
import { Calendar } from "../ui/calendar";
import { DayButtonProps } from "react-day-picker";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

export default function HabitHistorySheet({ habit }: { habit: Habit }) {
//   const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <SheetContent side="bottom" className="max-h-3/4 sm:max-h-2/3">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          <HabitIcon iconName={habit.icon} />
          {habit.name}
        </SheetTitle>
      </SheetHeader>
      <div className="m-4">
        <Calendar
          mode="single"
          //   selected={date}
          //   onSelect={setDate}
          className="mx-auto p-4 border rounded-lg"
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Day: (props: any) => <DayButton {...props} habit={habit} />,
          }}
        />
      </div>
    </SheetContent>
  );
}

function DayButton(props: DayButtonProps & { habit: Habit }) {
  const { day, habit, ...buttonProps } = props;
  const logs = habit.logs.filter((log) => isSameDay(log.date, day.date));

  const className = cn(
    buttonProps.className,
    "relative m-0.5 rounded",
    logs.length > 0 && "bg-primary/80"
  );

  return (
    <td className={className}>
      <span className="flex flex-col">
        {props.children}
        {logs.length > 0 && (
          <span className="right-0 bottom-0 left-0 absolute font-medium text-[10px] text-muted">
            {logs.length}
          </span>
        )}
      </span>
    </td>
  );
}
