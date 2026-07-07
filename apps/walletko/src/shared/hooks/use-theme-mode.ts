import { useEffect, useState } from "react";

type ThemeMode = "light" | "auto" | "dark";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto")
    return stored;
  return "auto";
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
  document.documentElement.classList.remove("light", "dark");
  if (resolved === "dark") document.documentElement.classList.add("dark");
  document.documentElement.style.colorScheme = resolved;
}

export type { ThemeMode };

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(getInitialMode());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyThemeMode(mode);
    if (mode !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeMode("auto");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode, ready]);

  const select = (next: ThemeMode) => {
    setMode(next);
    window.localStorage.setItem("theme", next);
  };

  return { mode, select };
}
