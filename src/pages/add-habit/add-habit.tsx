import { Habit, HABIT_COLORS, HABIT_TYPES_ARRAY } from "@/habit.types";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "./components/color-picker";
import IconPicker from "./components/icon-picker";
import HabitTypeSelect from "./components/habit-type-select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useHabitStore } from "@/stores/use-habit-store";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import HabitAdditionalInfo from "./components/additional-info";
import HabitCard from "@/components/habit/habit-card";

export default function AddHabitPage() {
  const navigate = useNavigate();

  const { addHabit } = useHabitStore();

  const [habit, setHabit] = useState<Habit>({
    id: "",
    name: "",
    description: "",
    type: {
      value: HABIT_TYPES_ARRAY[0].value,
      config: HABIT_TYPES_ARRAY[0].config,
    },
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
    <div className="flex flex-col">
      <Navbar title="Add Habit" withBackButton />
      <div className="flex flex-col mx-auto px-4 pb-10 max-w-lg container">
        <div className="mt-3 mb-6 pointer-events-none">
          <HabitCard habit={previewHabit} onLog={() => {}} />
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
              maxLength={20}
            />
          </div>
          <Textarea
            placeholder="Description (optional)"
            className="h-24"
            value={habit.description}
            onChange={(e) =>
              setHabit({ ...habit, description: e.target.value })
            }
          />
          <HabitTypeSelect
            type={habit.type}
            setType={(type) => setHabit({ ...habit, type })}
          />

          <HabitAdditionalInfo
            habit={habit}
            onConfigChange={(config) =>
              setHabit({ ...habit, type: { ...habit.type, config } })
            }
          />
        </div>

        <div className="mt-16 mb-6">
          <Button className="w-full text-lg" size={"lg"} onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
