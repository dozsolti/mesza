import HabitCard from "@/components/habit/habit-card";
import { useHabitStore } from "@/store/useHabits";
import { Habit, HabitLog } from "@/habit.types";
import { useNavigate } from "react-router";
import { Reorder } from "motion/react";

export default function HabitList({
  habits,
  isDraggable = true,
}: {
  habits: Habit[];
  isDraggable: boolean;
}) {
  const navigate = useNavigate();
  const { logHabit, undoLogHabit, setHabits } = useHabitStore();

  return (
    <Reorder.Group
      axis="y"
      values={habits}
      onReorder={setHabits}
      className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2"
      drag={false}
    >
      {habits.map((habit) => (
        <Reorder.Item
          key={habit.id}
          value={habit}
          drag={isDraggable ? "y" : false}
          className={
            isDraggable
              ? "border-2 border-dashed border-zinc-300 rounded"
              : ""
          }
        >
          <div className={isDraggable ? "pointer-events-none" : ""}>
            <HabitCard
              key={habit.id}
              habit={habit}
              onLog={(meta?: HabitLog["meta"]) => logHabit(habit.id, meta)}
              onUndo={() => undoLogHabit(habit.id)}
              onMore={() =>
                navigate(`/habit/${habit.id}`, { preventScrollReset: true })
              }
            />
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
