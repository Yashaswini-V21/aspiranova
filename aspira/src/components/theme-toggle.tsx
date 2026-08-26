import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const THEME_STORAGE_KEY = "aspira-theme";

/** Inline, render-blocking script that applies the stored theme before paint. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

function applyTheme(next: "light" | "dark") {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* storage unavailable — theme is still applied for this session */
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  // Server render is neutral; the real value is read after hydration.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card/60 text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isDark ? "translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isDark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-6 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
