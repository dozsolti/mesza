import { useState } from "react";
import Navbar from "@/components/navbar";
import { Habit } from "@/habit.types";
import { useHabitStore } from "@/store/useHabits";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import HabitCard from "@/components/habit/habit-card";
import ColorPicker from "../add-habit/components/color-picker";
import IconPicker from "../add-habit/components/icon-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HabitTypeSelect from "../add-habit/components/habit-type-select";
import HabitAdditionalInfo from "../add-habit/components/additional-info";

export default function EditHabitPage() {
  const { id } = useParams();
  const { habits, updateHabit, removeHabit } = useHabitStore();
  const navigate = useNavigate();
  const habit = habits.find((h) => h.id === id);

  if (!habit || !id) {
    return <p>Habit not found</p>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editedHabit, setEditedHabit] = useState<Habit>(habit);
  const previewHabit = {
    ...editedHabit,
    name: editedHabit.name || "New Habit",
    description: editedHabit.description || "Description",
  };

  const onSave = () => {
    try {
      if (!editedHabit.name.trim()) {
        alert("Please enter a habit name.");
        return;
      }
      updateHabit(id, editedHabit);
      navigate(-1);
    } catch (e) {
      alert("Failed to save habit. Please try again." + e);
    }
  };

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this habit?")) {
      return;
    }
    removeHabit(id!);
    navigate("/");
  };

  return (
    <div className="flex flex-col">
      <Navbar
        withBackButton
        title="Edit Habit"
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
      <div className="flex flex-col mx-auto px-4 pb-10 max-w-lg container">
        <div className="mt-3 mb-6 pointer-events-none">
          <HabitCard habit={previewHabit} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <ColorPicker
            color={editedHabit.color}
            setColor={(color) => setEditedHabit({ ...editedHabit, color })}
          />

          <div className="flex items-center gap-2">
            <IconPicker
              icon={editedHabit.icon}
              setIcon={(icon) => setEditedHabit({ ...editedHabit, icon })}
            />
            <Input
              type="text"
              placeholder="Habit Name"
              value={editedHabit.name}
              onChange={(e) =>
                setEditedHabit({ ...editedHabit, name: e.target.value })
              }
              maxLength={20}
            />
          </div>

          <Textarea
            placeholder="Description (optional)"
            className="h-24"
            value={editedHabit.description}
            onChange={(e) =>
              setEditedHabit({ ...editedHabit, description: e.target.value })
            }
          />

          <HabitTypeSelect
            type={editedHabit.type}
            setType={() => {}}
            disabled
          />

          <HabitAdditionalInfo
            habit={editedHabit}
            onConfigChange={(config) =>
              setEditedHabit({
                ...editedHabit,
                type: { ...editedHabit.type, config },
              })
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
