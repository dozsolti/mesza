import HabitCard from "@/components/habit/habit-card";
import { useHabitStore } from "@/store/useHabits";
import { Habit, HabitLog } from "@/habit.types";
import { useNavigate } from "react-router";
import { Reorder } from "motion/react";
import HabitIcon from "@/components/habit/habit-icon";
import { cn } from "@/lib/utils";

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
      className={cn(
        "gap-3 grid pt-2",
        isDraggable
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
      drag={false}
    >
      {habits.map((habit) => (
        <Reorder.Item
          key={habit.id}
          value={habit}
          drag={isDraggable ? "y" : false}
          className={
            isDraggable
              ? "border-2 border-dashed border-zinc-400 rounded mx-8"
              : ""
          }
        >
          {isDraggable ? (
            <div
              className="flex flex-col gap-3 p-3 border rounded-lg text-card-foreground"
              style={{
                backgroundColor: habit.color,
              }}
            >
              <div className="flex gap-3">
                <HabitIcon iconName={habit.icon} />
                <h2 className="font-semibold text-xl">{habit.name}</h2>
              </div>
            </div>
          ) : (
            <HabitCard
              key={habit.id}
              habit={habit}
              onLog={
                isDraggable
                  ? undefined
                  : (meta?: HabitLog["meta"]) => logHabit(habit.id, meta)
              }
              onUndo={() => undoLogHabit(habit.id)}
              onMore={
                isDraggable
                  ? undefined
                  : () =>
                      navigate(`/habit/${habit.id}`, {
                        preventScrollReset: true,
                      })
              }
            />
          )}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
