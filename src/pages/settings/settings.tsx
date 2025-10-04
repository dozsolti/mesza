import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { download } from '@/lib/exporter.utils';
import { useHabitStore } from '@/stores/use-habit-store';
import { useUserStore } from '@/stores/use-user-store';

import ThemeSwitcher from './components/theme-switcher';

export default function SettingsPage() {
  const navigation = useNavigate();
  const { user, clearUser, setUser } = useUserStore();
  const { habits, clearHabits } = useHabitStore();
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

  function handleExportData(): void {
    const fileName = `mesza-exported-${format(
      new Date(),
      "yyy-MMM-d-hh-mm"
    )}.json`;
    const fileContent = {
      name: "Mesza exported data.",
      exportedAt: new Date().valueOf(),
      user,
      habits,
    };
    download(JSON.stringify(fileContent, null, 2), fileName);
  }

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
          <div className="right-0 bottom-0 left-0 absolute flex gap-2 m-4">
            <Button
              className="flex-2"
              variant={"outline"}
              onClick={handleExportData}
            >
              Export data
            </Button>
            <Button
              className="flex-1"
              variant={"destructive"}
              onClick={handleClearData}
            >
              Clear all data
            </Button>
          </div>
        )}

        <ThemeSwitcher />
      </div>
    </div>
  );
}
