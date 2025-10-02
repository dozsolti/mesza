import { format } from 'date-fns';
import { CalendarClockIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Habit, HabitLog } from '../../habit.types';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import {
    Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger
} from '../ui/sheet';
import HabitCardInfo from './habit-card-info';
import HabitIcon from './habit-icon';
import HabitLogger from './habit-logger/habit-logger';

export default function HabitCard({
  habit,
  onLog,
  onUndo,
  onMore,
}: {
  habit: Habit;
  onLog?: (meta?: HabitLog["meta"], date?: Date) => void;
  onUndo?: () => void;
  onMore?: () => void;
}) {
  const [undoCountdown, setUndoCountdown] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );


  const isDateSelected =
    selectedDate !== undefined && selectedTime !== undefined;

  const handleOnLog = (meta?: HabitLog["meta"], date?: Date) => {
    if (!onLog) return;
    const logDate = date || selectedDate || new Date();
    if (selectedTime !== undefined) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      logDate.setHours(hours, minutes, 0, 0);
    }

    onLog(meta, logDate);
    setUndoCountdown((old) => old + 1);

    clearDate();
  };

  const handleUndo = () => {
    if (!onUndo) return;
    
    onUndo();
    setUndoCountdown((old) => (old > 0 ? old - 1 : 0));
  };

  const clearDate = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  return (
    <div
      className="flex flex-col gap-3 p-3 border rounded-lg text-card-foreground"
      style={{
        backgroundColor: habit.color,
        borderColor: habit.color.slice(0, -2) + "50",
      }}
    >
      <div className="flex gap-3">
        <HabitIcon iconName={habit.icon} />
        <div className="flex flex-col flex-1">
          <h2 className="font-semibold text-lg">{habit.name}</h2>
          <HabitCardInfo habit={habit} />
        </div>
        <div
          className={cn(
            "flex justify-between gap-1",
            isDateSelected ? "flex-col items-end" : "flex-row-reverse"
          )}
        >
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

          {
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant={isDateSelected ? "outline" : "ghost"}
                  className="text-foreground/80"
                  onClick={() => {
                    if (isDateSelected) return;
                    setSelectedDate(new Date());
                    setSelectedTime(format(new Date(), "HH:mm"));
                  }}
                >
                  <CalendarClockIcon />
                  {isDateSelected && (
                    <span className="text-xs thin">
                      {format(selectedDate, "dd MMM")} {selectedTime}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[90vh]">
                <SheetHeader>
                  <SheetTitle>Select Date & Time</SheetTitle>
                </SheetHeader>

                <div className="space-y-6">
                  <div className="flex justify-center px-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate || new Date()}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      autoFocus
                      className="border rounded-md w-full"
                    />
                  </div>
                  <div className="px-4">
                    <label className="font-medium text-sm">Time</label>
                    <Input
                      type="time"
                      value={selectedTime || ""}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="[&::-webkit-calendar-picker-indicator]:hidden bg-background text-white appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  <SheetFooter className="flex flex-row gap-2">
                    <SheetClose asChild className="flex-1">
                      <Button
                        variant="outline"
                        onClick={clearDate}
                        disabled={selectedDate == null && selectedTime == null}
                      >
                        Clear
                      </Button>
                    </SheetClose>
                    <SheetClose asChild className="flex-3">
                      <Button disabled={!selectedDate || !selectedTime}>
                        Done
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
          }
        </div>
      </div>

      {onLog && (
        <HabitLogger
          habit={{ ...habit }}
          onLog={handleOnLog}
          date={selectedDate || new Date()}
        />
      )}
    </div>
  );
}
