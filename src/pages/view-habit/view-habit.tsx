import { format } from 'date-fns';
import { Edit2Icon } from 'lucide-react';
import { useParams } from 'react-router';

import HabitCardInfo from '@/components/habit/habit-card-info';
import HabitIcon from '@/components/habit/habit-icon';
import Navbar from '@/components/navbar';
import NavbarButton from '@/components/navbar-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HABIT_TYPES } from '@/habit.types';
import { useHabitStore } from '@/stores/use-habit-store';

import CalendarTab from './components/calendar-tab';
import StatisticsTab from './components/statistics-tab';

export default function ViewHabitPage() {
  const { id } = useParams();
  const { habits } = useHabitStore();
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

  return (
    <div>
      <div className="flex flex-col h-screen">
        <Navbar
          withBackButton
          title={habit.name}
          rightActions={[
            <NavbarButton
              label="Edit"
              config={{ type: "link", to: `/habit/${habit.id}/edit` }}
              Icon={Edit2Icon}
              key="navbar-edit-habit-button"
            />,
          ]}
        />

        <div className="flex flex-col gap-4 mx-auto p-4 pb-20 max-w-lg container">
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
              <p className="text-foreground/60 text-sm">
                {habit.description || "No description."}
              </p>
            }
          </div>
          {habit.type.value === "choice" && (
            <div>
              <p className="mb-1 text-foreground/60 text-sm">Options:</p>
              <div className="flex flex-wrap gap-2">
                {(habit.type.config ?? []).map((option) => (
                  <span
                    key={option}
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: habit.color,
                      borderColor: habit.color.slice(0, -2) + "80",
                      borderWidth: 1,
                    }}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue={"statistics"}>
            <TabsList className="w-full">
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="statistics">
              <StatisticsTab habit={habit} />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarTab habit={habit} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
