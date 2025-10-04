import { useId } from 'react';
import { ListBox, ListBoxItem } from 'react-aria-components';

import HabitIcon from '@/components/habit/habit-icon';
import { Label } from '@/components/ui/label';
import { HABIT_TYPES_ARRAY, HabitType } from '@/habit.types';

export default function HabitTypeSelect({
  type,
  setType,
  disabled,
}: {
  type: HabitType;
  setType: (type: HabitType) => void;
  disabled?: boolean;
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
              className={`relative mb-1.5 data-[selected=true]:bg-accent px-2 py-1.5 data-focus-visible:border-ring rounded outline-none data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 data-[selected=true]:text-accent-foreground ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              } data-[selected=true]:opacity-100`}
              onClick={() => onChange(t)}
              textValue={t.value}
              isDisabled={disabled}
            >
              <span className="flex items-center gap-2">
                <HabitIcon iconName={t.icon} />
                <div className="flex flex-col">
                  <span className="text-lg">{t.name}</span>
                  {/* <p className="text-muted-foreground text-sm" data-desc>
                    {t.description}
                  </p> */}
                  <p className="text-muted-foreground/60 text-xs">
                    Ex. {t.example}
                  </p>
                </div>
              </span>
            </ListBoxItem>
          ))}
        </ListBox>
      </div>
      <p className="text-muted-foreground text-sm">
        Note: You can't change the habit TYPE after creation.
        <br />
        But you can edit it's configuration.
      </p>
    </div>
  );
}
