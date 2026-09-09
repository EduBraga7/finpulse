"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-zinc-800/30 dark:bg-zinc-800 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema claro/escuro"
      className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer shadow-xs"
      title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 stroke-[2.2]" />
      )}
    </button>
  );
}
