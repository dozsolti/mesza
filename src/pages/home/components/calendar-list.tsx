import { addDays, differenceInCalendarDays, isSameDay, isToday } from 'date-fns';
import { useMemo, useState } from 'react';

import {
    MiniCalendar, MiniCalendarDay, MiniCalendarDays, MiniCalendarNavigation
} from '@/components/ui/kibo-ui/mini-calendar';
import { useHabitStore } from '@/stores/use-habit-store';

const DAYS_IN_FUTURE = 1;
const MAX_DAYS = 6;

export default function CalendarList({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const { habits } = useHabitStore();

  const getHabitsForDate = useMemo(
    () => (date: Date) => {
      const dayHabits = habits.filter((h) =>
        h.logs.some((l) => isSameDay(new Date(l.date), date))
      );
      return dayHabits.slice(0, 4);
    },
    [habits]
  );

  const today = new Date();
  const endDate = addDays(today, DAYS_IN_FUTURE);

  const [currentStartDate, setCurrentStartDate] = useState<Date>(
    addDays(today, -MAX_DAYS + DAYS_IN_FUTURE + 1)
  );
  const isThisWeek =
    differenceInCalendarDays(endDate, currentStartDate) < MAX_DAYS;

  return (
    <div className="mt-2">
      <MiniCalendar
        value={selectedDate}
        onValueChange={(date) => setSelectedDate(date || new Date())}
        defaultStartDate={currentStartDate}
        onStartDateChange={(date) => setCurrentStartDate(date || new Date())}
        days={MAX_DAYS}
        className="justify-between border-0 rounded-none"
      >
        <MiniCalendarNavigation direction="prev" className="w-1/12" />
        <MiniCalendarDays className="flex-1">
          {(date) => (
            <MiniCalendarDay
              date={date}
              key={date.toISOString()}
              className="flex-1 min-w-0"
            >
              {!isToday(date) && (
                <span className="flex mt-0.5">
                  {getHabitsForDate(date).map((h) => (
                    <span
                      key={h.id}
                      className="first:ms-0.5 me-0.5 w-1 h-0.5" 
                      title={h.name}
                      style={{ backgroundColor: h.color.slice(0, -2) }}
                    />
                  ))}
                </span>
              )}
            </MiniCalendarDay>
          )}
        </MiniCalendarDays>
        <MiniCalendarNavigation
          direction="next"
          className="w-1/12"
          disabled={isThisWeek}
          style={{ opacity: isThisWeek ? 0.3 : 1 }}
        />
      </MiniCalendar>
    </div>
  );
}
