import { MoreHorizontalIcon, icons } from "lucide-react";
import { Habit } from "../../types";
import { Button } from "../ui/button";
import HabitCardLogger from "./habit-card-logger";
import { useState } from "react";
import HabitCardInfo from "./habit-card-info";

export default function HabitCard({
  habit,
  onLog,
  onUndo,
}: {
  habit: Habit;
  onLog?: () => void;
  onUndo?: () => void;
}) {
  const Icon = icons[habit.icon];

  const [undoCountdown, setUndoCountdown] = useState(0);

  const handleOnLog = () => {
    if (!onLog) return;
    onLog();
    setUndoCountdown((old) => old + 1);
  };

  const handleUndo = () => {
    if (!onUndo) return;
    onUndo();
    setUndoCountdown((old) => (old > 0 ? old - 1 : 0));
  };

  return (
    <div>
      <div
        className="flex flex-col gap-3 p-3 border rounded-lg text-card-foreground"
        style={{
          backgroundColor: habit.color,
        }}
      >
        <div className="flex gap-3">
          <div className="flex items-center bg-blue-100/10 p-2 rounded-lg aspect-square">
            <Icon />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="font-semibold text-lg">{habit.name}</h2>
            <HabitCardInfo habit={habit}/>
          </div>
          <div>
            {undoCountdown > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400"
                onClick={handleUndo}
              >
                Undo
              </Button>
            )}

            <Button size="sm" variant="ghost">
              <MoreHorizontalIcon />
            </Button>
          </div>
        </div>

        <HabitCardLogger habit={habit} onLog={handleOnLog} />
      </div>
    </div>
  );
}
