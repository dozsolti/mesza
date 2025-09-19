import Navbar from "@/components/navbar";
import CalendarList from "./components/calendar-list";
import Fab from "@/components/fab";
import { Button } from "@/components/ui/button";
import {
  CalendarDaysIcon,
  ListTodoIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import HabitList from "./states/habit-list";
import HabitHistoryList from "../../components/habit/habit-history/habit-history-list";
import { useUserStore } from "@/store/useUser";
import { getHabitLogCompletedToday, useHabitStore } from "@/store/useHabits";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUserStore();
  const { habits } = useHabitStore();

  const [isFilterOn, setIsFilterOn] = useState(false);
  const [tab, setTab] = useState<"today" | "history" | "future">("today");

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
          <Button
            asChild
            variant="ghost"
            className="max-sm:p-0 max-sm:aspect-square"
            key="navbar-settings-button"
          >
            <Link to="/settings">
              <SettingsIcon
                className="opacity-60 sm:-ms-1"
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">Settings</span>
            </Link>
          </Button>,
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
              {tab == "today" && (
                <Button
                  variant={"ghost"}
                  onClick={onFilterPressed}
                  className={`p-2  ${
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
          {tab === "today" ? (
            <HabitList habits={filteredHabits} />
          ) : tab === "history" ? (
            <HabitHistoryList date={selectedDate} />
          ) : tab === "future" ? (
            <p className="mt-10 text-muted-foreground text-center">
              Sorry. I can't see the future.
            </p>
          ) : null}
        </div>
      </div>
      {(isToday(selectedDate) || isFuture(selectedDate)) && (
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
