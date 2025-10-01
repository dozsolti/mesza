import { format, isToday } from 'date-fns';
import { useState } from 'react';
import { ListBox, ListBoxItem } from 'react-aria-components';

import { Button } from '@/components/ui/button';
import {
    Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { Habit, HabitLog } from '@/habit.types';

export default function HabitLoggerChoice({
  habit,
  onLog,
  height,
}: {
  height: number;
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"], date?: Date) => void;
}) {
  const options = habit.type.config ?? [];

  const [selectedOption, setSelectedOption] = useState("");

  if (options.length < 2)
    return (
      <p className="text-muted-foreground text-sm text-center">
        Not enough options
      </p>
    );

  if (options.length < 4) {
    const isOptionSelected = (option: string) => {
      return habit.logs.some(
        (log) =>
          isToday(log.date) &&
          log.meta &&
          "choice" in log.meta &&
          log.meta.choice === option
      );
    };
    return (
      <div className="flex gap-3 shadow-xs rounded-md" style={{ height }}>
        {options.map((option, i) => (
          <Button
            key={option || i}
            className="flex-1 border-none rounded-md h-full"
            variant={"outline"}
            onClick={() => {
              onLog?.({ choice: option });
            }}
            style={{
              backgroundColor: isOptionSelected(option)
                ? habit.color
                : undefined,
            }}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  const onSubmit = () => {
    onLog?.({ choice: selectedOption });
    setSelectedOption("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={"border-none"}
          style={{ backgroundColor: habit.color }}
        >
          Select
        </Button>
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
            <Button type="submit" onClick={onSubmit} disabled={!selectedOption}>
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
