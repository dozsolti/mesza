import HabitCard from "@/components/habit/habit-card";
import { Habit, HABIT_COLORS } from "@/types";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "./components/color-picker";
import IconPicker from "./components/icon-picker";
import HabitTypeSelect from "./components/habit-type-select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useHabitStore } from "@/store/useHabits";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function AddHabitPage() {
  const navigate = useNavigate();

  const { addHabit } = useHabitStore();

  const [habit, setHabit] = useState<Habit>({
    id: "",
    name: "",
    description: "",
    type: "daily",
    icon: "Search",
    color: HABIT_COLORS[0],
    logs: [],
  });

  const previewHabit = {
    ...habit,
    name: habit.name || "New Habit",
    description: habit.description || "Description",
  };

  const onSave = () => {
    try {
      if (!habit.name.trim()) {
        alert("Please enter a habit name.");
        return;
      }
      addHabit({ ...habit, id: uuidv4() });
      navigate(-1);
    } catch (e) {
      alert("Failed to save habit. Please try again." + e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar title="Add Habit" withBackButton />
      <div className="flex flex-col mx-auto px-4 pb-20 max-w-md h-full container">
        <div className="mt-3 mb-6 pointer-events-none">
          <HabitCard habit={previewHabit} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <ColorPicker
            color={habit.color}
            setColor={(color) => setHabit({ ...habit, color })}
          />
          <div className="flex items-center gap-2">
            <IconPicker
              icon={habit.icon}
              setIcon={(icon) => setHabit({ ...habit, icon })}
            />
            <Input
              type="text"
              placeholder="Habit Name"
              value={habit.name}
              onChange={(e) => setHabit({ ...habit, name: e.target.value })}
            />
          </div>
          <Textarea placeholder="Description (optional)" className="h-24" />
          <HabitTypeSelect
            type={habit.type}
            setType={(type) => setHabit({ ...habit, type })}
          />
        </div>

        <div className="mt-16">
          <Button className="w-full text-lg" size={"lg"} onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
