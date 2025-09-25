import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HabitLog } from '@/habit.types';

export default function HabitLoggerText({
  color,
  height,
  onLog,
}: {
  color: string;
  height: number;
  onLog?: (meta?: HabitLog["meta"]) => void;
}) {
  const [text, setText] = useState<string>("");
  const isEmpty = text.trim() === "";

  return (
    <div className="flex shadow-xs rounded-md">
      <Textarea
        placeholder={"Enter text"}
        className="focus-visible:z-10 flex-1 shadow-none -me-px border-none rounded-e-none w-full"
        value={text}
        maxLength={80}
        onChange={(e) => {
          setText(e.target.value);
        }}
        style={{
          backgroundColor: color,
          height: isEmpty ? height : "auto",
          maxHeight: height * 5,
        }}
      />
      {!isEmpty && (
        <Button
          className="inline-flex justify-center items-center px-3 border border-input border-l-0 rounded-e-md rounded-s-none size-auto text-sm"
          variant="outline"
          size={"icon"}
          onClick={() => {
            onLog?.({
              text: text.trim(),
            });
            setText("");
          }}
        >
          Add
        </Button>
      )}
    </div>
  );
}
