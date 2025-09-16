import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HABIT_COLORS } from "@/types";

export default function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <fieldset className="contain-inline-size space-y-4">
      <legend className="font-medium text-foreground text-sm leading-none">
        Choose a color
      </legend>
      <div className="mx-[-16px] px-4 pb-2 max-w-svw overflow-x-scroll">
        <RadioGroup
          className="flex gap-2"
          defaultValue={HABIT_COLORS[0]}
          value={color}
          onValueChange={setColor}
        >
          {HABIT_COLORS.map((c) => (
            <RadioGroupItem
              key={c}
              value={c}
              aria-label={c}
              className={`shadow-none size-7 border-zinc-400`}
              style={{ backgroundColor: c.slice(0, -2),  }}
            />
          ))}
        </RadioGroup>
      </div>
    </fieldset>
  );
}
