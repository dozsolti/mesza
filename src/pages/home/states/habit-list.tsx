import HabitCard from "@/components/habit/habit-card";
import { useHabitStore } from "@/store/useHabits";

export default function HabitList() {
  const { habits, logHabit, undoLogHabit } = useHabitStore();

  if (habits.length === 0) {
    return (
      <p className="mt-10 font-thin text-muted-foreground text-3xl text-center">
        No habits yet.
      </p>
    );
  }

  return (
    <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onLog={() => logHabit(habit.id)}
          onUndo={() => undoLogHabit(habit.id)}
        />
      ))}
    </div>
  );
}
