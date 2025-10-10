import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type ThemeMode = "dark" | "light" | "system";
type ThemeName =
  | "default"
  | "notebook"
  | "darkmatter"
  | "bubblegum"
  | "doom64"
  | "kodama"
  | "mono"
  | "neobrutalism"
  | "starrynight";
type Theme = {
  name: ThemeName;
  mode: ThemeMode;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  availableThemes?: ThemeName[];
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeName: (themeName: ThemeName) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  availableThemes: ThemeName[];
};

const initialState: ThemeProviderState = {
  theme: { name: "default", mode: "system" },
  setTheme: () => null,
  setThemeName: () => null,
  setThemeMode: () => null,
  availableThemes: [],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = { name: "default", mode: "system" },
  storageKey = "vite-ui-theme",
  availableThemes = [
    "default",
    "notebook",
    "bubblegum",
    "doom64",
    "darkmatter",
    "kodama",
    "mono",
    "neobrutalism",
    "starrynight",
  ],
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as Theme;
      } catch {
        // fallback to defaultTheme
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all theme and mode classes
    if (root.classList.length > 0)
      root.classList.remove(
        ...availableThemes.flatMap((t) => [t + "-light", t + "-dark"]),
        "light",
        "dark",
        ...root.classList.value.split(" ")
      );

    let mode = theme.mode || defaultTheme.mode;
    if (mode === "system") {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    // Add theme class: e.g. bubblegum-light, retro-dark
    root.classList.add(`${theme.name}-${mode}`);
  }, [theme, availableThemes, defaultTheme.mode]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, JSON.stringify(newTheme));
      setTheme(newTheme);
    },
    setThemeName: (themeName: ThemeName) => {
      const newTheme = { ...theme, name: themeName };
      localStorage.setItem(storageKey, JSON.stringify(newTheme));
      setTheme(newTheme);
    },
    setThemeMode: (themeMode: ThemeMode) => {
      const newTheme = { ...theme, mode: themeMode };
      localStorage.setItem(storageKey, JSON.stringify(newTheme));
      setTheme(newTheme);
    },
    availableThemes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
