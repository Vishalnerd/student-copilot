"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

// Define the interface to accept the sheet primitive trigger slot
interface NavbarProps {
  mobileMenuTrigger?: React.ReactNode;
}

export default function Navbar({ mobileMenuTrigger }: NavbarProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Actions / Mobile Trigger Slot */}
        <div className="flex-1 flex items-center">
          {/* 📱 Render the sheet component trigger on viewports below 'lg' */}
          <div className="lg:hidden">{mobileMenuTrigger}</div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </button>

          {user && (
            <div className="text-right">
              <p className="max-w-[120px] truncate text-sm font-bold leading-tight text-gray-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 sm:max-w-none">
                {user.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
