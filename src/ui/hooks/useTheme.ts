import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  // inizializza tema
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  function toggleTheme() {
    const html = document.documentElement;

    const next = !html.classList.contains("dark");

    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  }

  return { isDark, toggleTheme };
}