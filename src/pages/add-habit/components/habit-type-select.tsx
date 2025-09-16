import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HabitTypes } from "@/types";

const HABIT_TYPES = [
  { value: "daily", label: "Daily", description: "Occurs every day." },
  {
    value: "counter",
    label: "Counter",
    description: "Count occurrences.",
  },
  {
    value: "measure",
    label: "Measure",
    description: "Measure something through out time."
  }
  //   { value: "weekly", label: "Weekly", description: "Occurs every week." },
  //   { value: "monthly", label: "Monthly", description: "Occurs every month." },
  //   { value: "measure", label: "Measure", description: "Track measurements." },
];
export default function HabitTypeSelect({
  type,
  setType,
}: {
  type: HabitTypes;
  setType: (type: HabitTypes) => void;
}) {
  const id = useId();
  return (
    <div className="justify-between items-center *:not-first:mt-2 w-full">
      <Label htmlFor={id}>Habit Type</Label>
      <Select
        defaultValue={type}
        onValueChange={(value) => setType(value as HabitTypes)}
      >
        <SelectTrigger id={id} className="**:data-desc:hidden w-full">
          <SelectValue placeholder="Choose a plan" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
          {HABIT_TYPES.map(({ value, label, description }) => (
            <SelectItem key={value} value={value}>
              <div>
                {label}

                <span
                  className="block mt-1 text-muted-foreground text-sm"
                  data-desc
                >
                  {description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
