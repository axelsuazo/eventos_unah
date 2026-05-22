"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldUseDark = savedTheme
      ? savedTheme === "dark"
      : prefersDark;

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className={`relative flex h-8 w-16 items-center rounded-full p-1 transition-all duration-300 ${isDark
          ? " bg-[#00076e]"
          : " bg-[#ffcc00]"
        }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-md transition-transform duration-300 ${isDark ? "translate-x-8 text-[#183972]" : "translate-x-0 text-[#183972]"
          }`}
      >
        {isDark ? "☾" : "☀"}
      </span>
    </button>
  );
}