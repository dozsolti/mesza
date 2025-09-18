import { useId } from "react";

import { Label } from "@/components/ui/label";
import { ListBox, ListBoxItem } from "react-aria-components";
import { HABIT_TYPES_ARRAY, HabitType } from "@/habit.types";

export default function HabitTypeSelect({
  type,
  setType,
}: {
  type: HabitType;
  setType: (type: HabitType) => void;
}) {
  const id = useId();
  const onChange = (value: HabitType) => {
    setType({
      value: value.value,
      config: value.config,
    });
  };
  return (
    <div className="justify-between items-center *:not-first:mt-2 w-full">
      <Label htmlFor={id}>Habit Type</Label>
      <div className="border border-input rounded-md overflow-hidden">
        <ListBox
          className="space-y-1 bg-background shadow-xs p-1 text-sm transition-[color,box-shadow]"
          aria-label="Select habit type"
          selectionMode="single"
          defaultSelectedKeys={[type.value]}
        >
          {HABIT_TYPES_ARRAY.map((t) => (
            <ListBoxItem
              key={t.value}
              id={t.value}
              className="relative data-[selected=true]:bg-accent px-2 py-1.5 data-focus-visible:border-ring rounded outline-none data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 data-[selected=true]:text-accent-foreground"
              onClick={() => onChange(t)}
              textValue={t.value}
            >
              <div>
                {t.name}

                <span
                  className="block mt-1 text-muted-foreground text-sm"
                  data-desc
                >
                  {t.description}
                </span>
              </div>
            </ListBoxItem>
          ))}
        </ListBox>
      </div>
    </div>
  );
}
