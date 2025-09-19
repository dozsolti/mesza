import { Habit, HabitLog } from "@/habit.types";
import { SwipeToConfirm } from "../ui/swipe-to-confirm";
import { getHabitLogCompletedToday } from "@/store/useHabits";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListBox, ListBoxItem } from "react-aria-components";

const HEIGHT = 48;
export default function HabitCardLogger({
  habit,
  onLog,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  const commonSwipeProps = {
    height: HEIGHT,
    bgColor: "bg-card-foreground/10",
    confirmedBgColor: "transparent",
    knobIconColor: habit.color.slice(0, -2),
    onConfirm: onLog,
  };

  if (habit.type.value === "daily") {
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

  if (habit.type.value === "counter")
    return (
      <SwipeToConfirm
        label="Swipe for +1"
        confirmedLabel="+1"
        restartable={habit.type.value === "counter"}
        {...commonSwipeProps}
      />
    );

  if (habit.type.value === "measure") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<number | "">("");

    return (
      <div className="flex shadow-xs rounded-md" style={{ height: HEIGHT }}>
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

  if (habit.type.value === "choice") {
    const options = habit.type.config ?? [];
    if (options.length < 2)
      return (
        <p className="text-muted-foreground text-sm text-center">
          Not enough options
        </p>
      );

    if (options.length < 4) {
      return (
        <div className="flex gap-3 shadow-xs rounded-md" style={{ height: 36 }}>
          {options.map((option) => (
            <Button
              key={option}
              className={"flex-1 rounded-md h-full"}
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                onLog?.({ choice: option });
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedOption, setSelectedOption] = useState("");

    const onSubmit = () => {
      onLog?.({ choice: selectedOption });
      setSelectedOption("");
    };

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Select</Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="gap-2 mx-auto max-h-10/12 container"
        >
          <SheetHeader>
            <SheetTitle>{habit.name}</SheetTitle>
            <SheetDescription>
              {habit.description && (
                <>
                  {habit.description}
                  <br />
                </>
              )}
              {habit.logs.length > 0 && (
                <>
                  Last one{" "}
                  <span className="underline">
                    {(() => {
                      const meta = habit.logs[habit.logs.length - 1].meta;
                      return meta && "choice" in meta ? meta.choice : "";
                    })()}
                  </span>{" "}
                  on{" "}
                  <span className="underline">
                    {format(habit.logs[habit.logs.length - 1].date, "PPpp")}
                  </span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 gap-6 grid auto-rows-min px-4 overflow-y-scroll">
            <ListBox
              className="space-y-1 shadow-xs p-1 text-sm transition-[color,box-shadow]"
              aria-label="Select habit type"
              selectionMode="single"
              defaultSelectedKeys={[selectedOption]}
            >
              {options.map((t) => (
                <ListBoxItem
                  key={t}
                  id={t}
                  className="relative data-[selected=true]:bg-accent my-1.5 px-2 py-2 data-focus-visible:border-ring not-last:border-b-2 outline-none data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 data-[selected=true]:text-accent-foreground"
                  onClick={() => setSelectedOption(t)}
                  textValue={t}
                >
                  <div className="text-lg">{t}</div>
                </ListBoxItem>
              ))}
            </ListBox>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={!selectedOption}
              >
                Save
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return null;
}
