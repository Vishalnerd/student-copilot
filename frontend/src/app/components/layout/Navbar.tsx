"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 💡 Prevent theme icon flickering on initial page boot hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 sticky top-0 z-30 transition-colors duration-200">
      {/* Main container spanning the full width */}
      <div className="flex items-center w-full gap-6">
        {/* Left side spacer - allows the page search bar or alignment to look proportional */}
        <div className="flex-1" />

        {/* Right side utilities and profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 transition cursor-pointer"
            aria-label="Toggle structural layout theme"
          >
            {!mounted ? (
              // Empty skeleton slot to reserve spacing layout bounds before mounting
              <div className="w-5 h-5" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </button>

          {/* Right side user component wrapper */}
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {user.name}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
