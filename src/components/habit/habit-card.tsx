import { MoreHorizontalIcon } from "lucide-react";
import { Habit, HabitLog } from "../../habit.types";
import { Button } from "../ui/button";
import { useState } from "react";
import HabitCardInfo from "./habit-card-info";
import HabitIcon from "./habit-icon";
import HabitLogger from "./habit-logger/habit-logger";

export default function HabitCard({
  habit,
  onLog,
  onUndo,
  onMore,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"]) => void;
  onUndo?: () => void;
  onMore?: () => void;
}) {
  const [undoCountdown, setUndoCountdown] = useState(0);

  const handleOnLog = (meta?: HabitLog["meta"]) => {
    if (!onLog) return;
    onLog(meta);
    setUndoCountdown((old) => old + 1);
  };

  const handleUndo = () => {
    if (!onUndo) return;
    onUndo();
    setUndoCountdown((old) => (old > 0 ? old - 1 : 0));
  };

  return (
    <div
      className="flex flex-col gap-3 p-3 border rounded-lg text-card-foreground"
      style={{
        backgroundColor: habit.color,
      }}
    >
      <div className="flex gap-3">
        <HabitIcon iconName={habit.icon} />
        <div className="flex flex-col flex-1">
          <h2 className="font-semibold text-lg">{habit.name}</h2>
          <HabitCardInfo habit={habit} />
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

          {onMore && (
            <Button size="sm" variant="ghost" onClick={onMore}>
              <MoreHorizontalIcon />
            </Button>
          )}
        </div>
      </div>

      {onLog && <HabitLogger habit={habit} onLog={handleOnLog} />}
    </div>
  );
}
