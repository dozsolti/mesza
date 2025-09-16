import { Habit, HabitLog } from "@/types";
import { SwipeToConfirm } from "../ui/swipe-to-confirm";
import { getHabitLogCompletedToday } from "@/store/useHabits";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";

export default function HabitCardLogger({
  habit,
  onLog,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  const commonSwipeProps = {
    height: 48,
    bgColor: "bg-card-foreground/10",
    confirmedBgColor: "transparent",
    knobIconColor: habit.color.slice(0, -2),
    onConfirm: onLog,
  };

  if (habit.type === "daily") {
    const habitLog = getHabitLogCompletedToday(habit);
    const isConfirmed = !!habitLog;

    return (
      <SwipeToConfirm
        label="Swipe to confirm"
        confirmedLabel={
          habitLog
            ? `Completed ${format(habitLog.date, "p")}`
            : "Magic is loading..."
        }
        restartable={
          !isConfirmed // in case of undo
        }
        isConfirmed={isConfirmed}
        restartDelay={350}
        {...commonSwipeProps}
      />
    );
  }
  if (habit.type === "counter")
    return (
      <SwipeToConfirm
        label="Swipe for +1"
        confirmedLabel="+1"
        restartable={habit.type === "counter"}
        {...commonSwipeProps}
      />
    );

  if (habit.type === "measure") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<number | "">("");

    return (
      <div className="flex shadow-xs rounded-md">
        <Input
          type="number"
          placeholder={"Enter value"}
          className="focus-visible:z-10 flex-1 shadow-none -me-px rounded-e-none w-full"
          value={value}
          pattern="^\d*\.?\d*$"
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            setValue(val === "" ? "" : Number(val));
          }}
        />
        {value !== "" && (
          <Button
            className="inline-flex justify-center items-center px-3 border border-input border-l-0 rounded-e-md rounded-s-none size-auto text-sm"
            variant="outline"
            size={"icon"}
            onClick={() => {
              onLog?.({
                value: Number(value),
              });
              setValue("");
            }}
          >
            Add
          </Button>
        )}
      </div>
    );
  }

  return null;
}
