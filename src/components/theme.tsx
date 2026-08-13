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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const initialTheme = saved === "light" || saved === "dark" ? saved : "dark";

    // The pre-paint script has already applied this theme to <html>.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeRoot({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("portfolio-web", className)}>{children}</div>;
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
