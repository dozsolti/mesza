import HabitCardInfo from "@/components/habit/habit-card-info";
import HabitIcon from "@/components/habit/habit-icon";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useHabitStore } from "@/store/useHabits";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarTab from "./components/calendar-tab";
import { HABIT_TYPES } from "@/habit.types";

export default function ViewHabitPage() {
  const { id } = useParams();
  const { habits, removeHabit } = useHabitStore();
  const navigate = useNavigate();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar withBackButton />
        <div className="flex flex-col mx-auto px-4 pb-20 max-w-md h-full container">
          <p className="mt-10 text-muted-foreground text-center">
            Habit with id {id}, not found.
          </p>
        </div>
      </div>
    );
  }

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this habit?")) {
      return;
    }
    removeHabit(id!);
    navigate(-1);
  };

  return (
    <div>
      <div className="flex flex-col h-screen">
        <Navbar
          withBackButton
          title={habit.name}
          rightActions={[
            <Button
              key="navbar-delete-habit-button"
              variant="ghost"
              className="max-sm:p-0 max-sm:aspect-square"
              onClick={onDelete}
            >
              <TrashIcon />
            </Button>,
          ]}
        />

        <div className="flex flex-col gap-4 mx-auto p-4 max-w-md h-full container">
          <div className="flex gap-3">
            <HabitIcon iconName={habit.icon} />
            <div className="flex flex-col flex-1">
              <HabitCardInfo
                habit={habit}
                customText={HABIT_TYPES[habit.type.value].name}
              />
              <HabitCardInfo
                habit={habit}
                customText={
                  habit.logs.length === 0
                    ? "No logs yet."
                    : format(habit.logs[0].date, "PPpp")
                }
              />
            </div>
          </div>
          <div>
            {
              <p className="text-white/60 text-sm">
                {habit.description || "No description."}
              </p>
            }
          </div>

          <Tabs defaultValue="calendar">
            <TabsList className="bg-transparent w-full">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              {/* <TabsTrigger value="history" disabled>
                History
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="calendar">
              <CalendarTab habit={habit} />
            </TabsContent>
            <TabsContent value="history">work in progress...</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
