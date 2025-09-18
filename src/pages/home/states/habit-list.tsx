import HabitCard from "@/components/habit/habit-card";
import { useHabitStore } from "@/store/useHabits";
import { HabitLog } from "@/habit.types";
import { useNavigate } from "react-router";

export default function HabitList() {
  const navigate = useNavigate();
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
          onLog={(meta?: HabitLog["meta"]) => logHabit(habit.id, meta)}
          onUndo={() => undoLogHabit(habit.id)}
          onMore={() => navigate(`/habit/${habit.id}`)}
        />
      ))}
    </div>
  );
}
