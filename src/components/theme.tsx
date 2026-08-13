"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeRoot({ children, className }: { children: ReactNode; className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={cn("portfolio-web", theme, className)}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="flex items-center justify-center opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 cursor-pointer p-[calc(4*var(--u))]"
    >
      {theme === "light" ? (
        <Moon style={{ height: "calc(24 * var(--u))", width: "auto" }} />
      ) : (
        <Sun style={{ height: "calc(24 * var(--u))", width: "auto" }} />
      )}
    </button>
  );
}
