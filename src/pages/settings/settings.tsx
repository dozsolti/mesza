import { useState } from 'react';
import { useNavigate } from 'react-router';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHabitStore } from '@/stores/use-habit-store';
import { useUserStore } from '@/stores/use-user-store';

import ThemeSwitcher from './components/theme-switcher';

export default function SettingsPage() {
  const navigation = useNavigate();
  const { user, clearUser, setUser } = useUserStore();
  const { clearHabits } = useHabitStore();
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    if (!name.trim()) return;
    setUser({ name });
    navigation(-1);
  };

  const handleClearData = () => {
    if (
      !confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    )
      return;

    clearUser();
    clearHabits();
    window.location.href = "/";
    localStorage.clear();
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar title="Settings" withBackButton />
      <div className="relative flex flex-col mx-auto px-4 pb-20 max-w-md h-full container">
        <div className="flex flex-col gap-4 mt-6">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        {name !== user.name ? (
          <Button className="mt-4" onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        ) : (
          <Button
            className="absolute inset-0 m-4 mt-auto"
            variant={"destructive"}
            onClick={handleClearData}
          >
            Clear all data
          </Button>
        )}

        <ThemeSwitcher />
      </div>
    </div>
  );
}
