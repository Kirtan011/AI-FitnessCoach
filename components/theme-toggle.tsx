"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-16 items-center rounded-full border border-border bg-muted px-1 transition-all hover:bg-muted/80"
    >
      {/* Sliding pill */}
      <div
        className={`absolute h-6 w-6 rounded-full bg-background shadow-md transition-all duration-300 ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      />

      {/* Sun */}
      <div className="flex h-6 w-6 items-center justify-center">
        <SunIcon
          className={`h-4 w-4 transition ${
            theme === "dark" ? "opacity-40" : "opacity-100 text-amber-500"
          }`}
        />
      </div>

      {/* Moon */}
      <div className="flex h-6 w-6 items-center justify-center ml-auto">
        <MoonIcon
          className={`h-4 w-4 transition ${
            theme === "dark" ? "opacity-100 text-blue-400" : "opacity-40"
          }`}
        />
      </div>
    </button>
  );
}
