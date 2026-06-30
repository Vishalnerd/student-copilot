"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sparkles, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 💡 Prevent theme icon flickering or hydration mismatches on page boot
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs px-6 h-16 flex justify-between items-center transition-colors duration-200">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4 fill-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
          Student Copilot
        </span>
      </div>

      {/* Navigation Layer Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          className="text-blue-600 dark:text-blue-400 font-bold transition-colors"
          href="#"
        >
          Home
        </Link>
        <Link
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#features"
        >
          Features
        </Link>
        <Link
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#steps"
        >
          Steps
        </Link>
      </nav>

      {/* Action Suite Buttons */}
      <div className="flex items-center gap-4">
        {/* Dynamic Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme contrast view"
        >
          {!mounted ? (
            <div className="w-5 h-5" /> // Reserve layout placeholder spacing bounds
          ) : theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 animate-in fade-in zoom-in-75 duration-200" />
          )}
        </button>

        <Link
          href="/login"
          className="hidden sm:block text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          Log In
        </Link>

        <Link
          href="/register"
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs active:scale-[0.98]"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
