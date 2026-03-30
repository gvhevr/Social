"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="inline-block h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800" />;
  }

  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="!px-2"
      onClick={() => setTheme(next)}
      title={`Switch to ${next} mode`}
      aria-label={`Switch to ${next} mode`}
    >
      {theme === "system" ? "Auto" : resolvedTheme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
