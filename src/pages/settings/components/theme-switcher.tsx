import HabitCard from '@/components/habit/habit-card';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { useHabitStore } from '@/stores/use-habit-store';

export default function ThemeSwitcher() {
  const { habits } = useHabitStore();

  const { theme, availableThemes, setThemeName, setThemeMode } = useTheme();

  if (habits.length == 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-end mb-2">
        <p className="font-medium">Themes</p>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            size="sm"
            variant={theme.mode === "light" ? "default" : "outline"}
            onClick={() => setThemeMode("light")}
          >
            Light
          </Button>
          <Button
            size="sm"
            variant={
              !theme.mode || theme.mode === "dark" ? "default" : "outline"
            }
            onClick={() => setThemeMode("dark")}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {availableThemes.map((themeName) => (
          <Button
            key={themeName}
            variant={theme.name === themeName ? "default" : "outline"}
            onClick={() => setThemeName(themeName)}
          >
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-2 p-4 border border-border rounded-lg pointer-events-none">
        <HabitCard habit={habits[0]} onLog={() => {}} />
        {habits.length > 1 && <HabitCard habit={habits[1]} onLog={() => {}} />}
        {habits.length > 2 && <HabitCard habit={habits[2]} onLog={() => {}} />}
      </div>
    </div>
  );
}
