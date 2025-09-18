import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

const MIN_CHOICE_COUNT = 2;
export default function HabitAdditionalInfoChoice({
  onOptionsChange,
}: {
  onOptionsChange: (options: string[]) => void;
}) {
  const [options, setOptions] = useState<string[]>(
    new Array(MIN_CHOICE_COUNT).fill("")
  );

  useEffect(() => {
    onOptionsChange(options.filter((opt) => opt.trim() !== ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const onInputChange = (option: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = option;
    if (index + 1 === newOptions.length && option.trim() !== "") {
      newOptions.push("");
    }
    setOptions(newOptions);
  };

  const onOptionRemove = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium">Options</Label>
      {options.map((option, index) => (
        <div key={index} className="flex gap-1">
          <Input
            key={index}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              onInputChange(e.target.value, index);
            }}
            className="px-3 py-5"
          />
          {index >= MIN_CHOICE_COUNT && (
            <Button
              size="sm"
              variant="ghost"
              className="inline-flex justify-center items-center px-3 border border-input rounded-md size-auto text-sm"
              onClick={() => onOptionRemove(index)}
            >
              <TrashIcon />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
