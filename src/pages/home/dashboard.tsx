import Navbar from "@/components/navbar";
import CalendarList from "./components/calendar-list";
import Fab from "@/components/fab";
import { Button } from "@/components/ui/button";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import HabitList from "./states/habit-list";
import HabitHistoryList from "../../components/habit/habit-history/habit-history-list";
import { useUserStore } from "@/store/useUser";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useUserStore();

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
      <div className="flex flex-col flex-1 mx-auto px-4 pb-4 min-h-0 container">
        <CalendarList
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="overflow-y-auto scroll-smooth">
          {isToday(selectedDate) ? (
            <HabitList />
          ) : isPast(selectedDate) ? (
            <HabitHistoryList date={selectedDate} />
          ) : isFuture(selectedDate) ? (
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
