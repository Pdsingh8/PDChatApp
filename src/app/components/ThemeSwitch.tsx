"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []); // Fix: should be true, not false

  if (!mounted)
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={36}
        height={36}
        sizes="36x36"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle"
      />
    );

  if (resolvedTheme === "dark") {
    return (
      <FiSun
        onClick={() => setTheme("light")}
        className=" h-6 cursor-pointer text-yellow-500 hover:text-yellow-400 transition-colors "
        title="Switch to light mode"
      />
    );
  }

  if (resolvedTheme === "light") {
    return (
      <FiMoon
        onClick={() => setTheme("dark")}
        className=" h-6  cursor-pointer text-white-700 hover:text-slate-100 transition-colors"
        title="Switch to dark mode"
      />
    );
  }

  // Fallback for system theme or other cases
  return (
    <FiSun
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 cursor-pointer text-slate-700 dark:text-yellow-500 hover:text-slate-600 dark:hover:text-yellow-400 transition-colors"
      title="Toggle theme"
    />
  );
}
