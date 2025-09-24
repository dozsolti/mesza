import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HabitLog } from '@/habit.types';

export default function HabitLoggerMeasure({
  color,
  height,
  onLog,
}: {
  color: string;
  height: number;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  const [value, setValue] = useState<number | "">("");

  return (
    <div className="flex shadow-xs rounded-md" style={{ height }}>
      <Input
        type="number"
        placeholder={"Enter value"}
        className="focus-visible:z-10 flex-1 shadow-none -me-px border-none rounded-e-none w-full"
        value={value}
        pattern="^\d*\.?\d*$"
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9.]/g, "");
          setValue(val === "" ? "" : Number(val));
        }}
        style={{
          backgroundColor: color,
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
