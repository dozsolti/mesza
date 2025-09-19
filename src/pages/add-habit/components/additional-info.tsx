import { Habit, HABIT_TYPES_ARRAY, HabitLogConfig } from "@/habit.types";
import HabitAdditionalInfoChoice from "./additional-infos/addition-info-choice";

export default function HabitAdditionalInfo({
  habit,
  onConfigChange,
}: {
  habit: Habit;
  onConfigChange: (config: HabitLogConfig) => void;
}) {
  const typeName = habit.type;
  const type = HABIT_TYPES_ARRAY.find((t) => t.value === typeName.value);

  if (!type) return null; // type not found
  if (type.config === undefined) return null; // no additional info needed

  if (typeName.value === "choice")
    return (
      <HabitAdditionalInfoChoice
        defaultOptions={habit.type.config}
        onOptionsChange={(options) => onConfigChange(options)}
      />
    );

  return null;
}
