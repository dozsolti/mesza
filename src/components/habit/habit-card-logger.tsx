import { Habit } from "@/types";
import { SwipeToConfirm } from "../ui/swipe-to-confirm";
import { isHabitCompletedToday } from "@/store/useHabits";
import { Input } from "../ui/input";

export default function HabitCardLogger({
  habit,
  onLog,
}: {
  habit: Habit;
  onLog?: () => void;
}) {
  const commonSwipeProps = {
    height: 48,
    bgColor: "bg-card-foreground/10",
    confirmedBgColor: "transparent",
    knobIconColor: habit.color.slice(0, -2),
    onConfirm: onLog,
  };

  if (habit.type === "daily") {
    const isDone = isHabitCompletedToday(habit);
    return (
      <SwipeToConfirm
        label="Swipe to confirm"
        restartable={
          !isDone // in case of undo
        }
        isConfirmed={isDone}
        restartDelay={500}
        {...commonSwipeProps}
      />
    );
  }
  if (habit.type === "counter")
    return (
      <SwipeToConfirm
        label="Swipe for +1"
        restartable={habit.type === "counter"}
        {...commonSwipeProps}
      />
    );

  if (habit.type === "measure") {
    return (
      <Input type="number" placeholder="Enter value..." className="w-full" />
    );
  }

  return null;
}
