import { isFuture, isPast, isToday } from 'date-fns';
import {
    CalendarDaysIcon, ListOrderedIcon, ListTodoIcon, PlusIcon, SettingsIcon
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import Fab from '@/components/fab';
import Navbar from '@/components/navbar';
import NavbarButton from '@/components/navbar-button';
import { Button } from '@/components/ui/button';
import { getHabitLogCompletedToday } from '@/lib/habit.utils';
import { useHabitStore } from '@/stores/use-habit-store';
import { useUserStore } from '@/stores/use-user-store';

import HabitHistoryList from '../../components/habit/habit-history/habit-history-list';
import CalendarList from './components/calendar-list';
import HabitList from './states/habit-list';

export default function DashboardPage() {
  const { user } = useUserStore();
  const { habits } = useHabitStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [tab, setTab] = useState<"today" | "history" | "future">("today");
  const [isReordering, setIsReordering] = useState(false);

  const filteredHabits = isFilterOn
    ? habits.filter((h) => getHabitLogCompletedToday(h) == null)
    : habits;

  const onDatePressed = (date: Date) => {
    if (isToday(date)) {
      setTab("today");
    } else if (isFuture(date)) {
      setTab("future");
    } else if (isPast(date)) {
      setTab("history");
    }
    setSelectedDate(date);
  };

  const onFilterPressed = () => {
    setIsFilterOn((f) => !f);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        title={`Hey, ${user.name}!`}
        rightActions={[
          <NavbarButton
            label="Settings"
            config={{ type: "link", to: "/settings" }}
            Icon={SettingsIcon}
            key="navbar-settings-button"
          />,
        ]}
      />
      <div className="flex flex-col flex-1 mx-auto px-4 pb-4 container">
        <CalendarList
          selectedDate={selectedDate}
          setSelectedDate={onDatePressed}
        />
        <div className="pb-20 overflow-y-auto scroll-smooth">
          {isToday(selectedDate) && (
            <div className="flex justify-between gap-4">
              {!isReordering && (
                <Button
                  variant={"ghost"}
                  className="bg-card hover:bg-accent px-0 py-2 hover:text-accent-foreground"
                  onClick={() =>
                    setTab((t) => (t === "today" ? "history" : "today"))
                  }
                >
                  {tab === "today" ? (
                    <>
                      <CalendarDaysIcon />
                      Today
                    </>
                  ) : (
                    <>
                      <ListTodoIcon />
                      Habits
                    </>
                  )}
                </Button>
              )}
              {tab == "today" && (
                <div className="flex flex-1 justify-end gap-2">
                  {!isFilterOn ? (
                    <Button
                      variant={"ghost"}
                      size={isReordering ? "lg" : "default"}
                      className={
                        "bg-card/50 hover:bg-accent px-0 py-2 hover:text-accent-foreground " +
                        (isReordering
                          ? "bg-primary text-primary-foreground fixed bottom-0 left-0 right-0 m-4 z-50"
                          : "")
                      }
                      onClick={() => setIsReordering((r) => !r)}
                    >
                      <ListOrderedIcon /> {isReordering ? "Done" : "Reorder"}
                    </Button>
                  ) : null}

                  {!isReordering && (
                    <Button
                      variant={"ghost"}
                      onClick={onFilterPressed}
                      className={`p-2 hover:text-accent-foreground  ${
                        isFilterOn ? "" : "text-muted-foreground"
                      }`}
                    >
                      {isFilterOn ? (
                        <span>Uncompleted today</span>
                      ) : (
                        <span>All</span>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          {tab === "today" ? (
            <HabitList habits={filteredHabits} isDraggable={isReordering} />
          ) : tab === "history" ? (
            <HabitHistoryList date={selectedDate} />
          ) : tab === "future" ? (
            <p className="mt-10 text-muted-foreground text-center">
              Sorry. I can't see the future.
            </p>
          ) : null}
        </div>
      </div>
      {(isToday(selectedDate) || isFuture(selectedDate)) && !isReordering && (
        <Fab>
          <Button
            size="lg"
            asChild
            className="shadow-md p-0 rounded-full w-12 h-12"
          >
            <Link to="/add">
              <PlusIcon strokeWidth={3} />
            </Link>
          </Button>
        </Fab>
      )}
    </div>
  );
}
