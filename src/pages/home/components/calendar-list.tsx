import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/kibo-ui/mini-calendar";
import { addDays, differenceInDays } from "date-fns";
import { useState } from "react";

const DAYS_IN_FUTURE = 1;
const MAX_DAYS = 6;

export default function CalendarList({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const today = new Date();
  const endDate = addDays(today, DAYS_IN_FUTURE);

  const [currentStartDate, setCurrentStartDate] = useState<Date>(
    addDays(today, -MAX_DAYS + DAYS_IN_FUTURE + 1)
  );
  const isThisWeek = differenceInDays(endDate, currentStartDate) < MAX_DAYS;

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
            />
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
