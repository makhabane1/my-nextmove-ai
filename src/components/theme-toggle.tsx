import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nextmove-theme");
    const initial =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("nextmove-theme", dark ? "dark" : "light");
  }, [dark, ready]);

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDark((d) => !d)}
      className="border-line text-mist hover:text-volt hover:border-volt grid size-9 place-items-center border transition-colors"
    >
      {ready && dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
