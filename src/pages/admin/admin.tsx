/*logs = uniqWith(
    habit.logs,
    (x, y) => x.date.toDateString() === y.date.toDateString()
  ).sort((a, b) => b.date.getTime() - a.date.getTime())*/

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useHabitStore } from '@/stores/use-habit-store';

export default function AdminPage() {
  const { habits } = useHabitStore();

  const handleOrderLogs = (habitId: string) => {
    const habitIndex = habits.findIndex((h) => h.id === habitId);
    if (habitIndex === -1) return;

    habits[habitIndex].logs.sort(
      (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
    );

    useHabitStore.getState().setHabits(habits);
  };

  return (
    <>
      <Navbar title="Admin Page" withBackButton />
      <div className="flex flex-col gap-4 mx-auto p-4 max-w-3xl">
        <div className="flex flex-col gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="p-2 border">
              <p>{habit.id}</p>
              <h3 className="font-semibold text-2xl">{habit.name}</h3>
              {habit.description && <p>Description: {habit.description}</p>}
              <p>
                Color: {habit.color}{" "}
                <span
                  className="inline-block w-4 h-4"
                  style={{ backgroundColor: habit.color.slice(0, -2) }}
                ></span>
              </p>
              <div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOrderLogs(habit.id)}
                  >
                    Order logs
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {habit.logs.map((log, i) => (
                  <div
                    key={log.date.valueOf()}
                    className={cn("p-2 border", {
                      "bg-amber-700":
                        i != 0 &&
                        new Date(log.date).valueOf() <
                          new Date(habit.logs[i - 1].date).valueOf(),
                    })}
                  >
                    <p>Date: {new Date(log.date).toISOString()}</p>
                    {log.meta && <p>Meta: {JSON.stringify(log.meta)}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
