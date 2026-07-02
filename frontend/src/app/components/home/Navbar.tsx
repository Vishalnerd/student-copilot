"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sparkles, Sun, Moon, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md shadow-xs transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4 fill-white" />
          </div>

          <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Student Copilot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="font-bold text-blue-600 dark:text-blue-400">
            Home
          </Link>

          <Link
            href="#features"
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </Link>

          <Link
            href="#steps"
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Steps
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition"
            aria-label="Toggle Theme"
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </button>

          {/* Desktop Buttons */}
          <Link
            href="/login"
            className="hidden md:inline-flex rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="hidden sm:inline-flex rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-[0.98]"
          >
            Get Started
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="lg:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-slate-200" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-0"
            >
              <div className="flex h-full flex-col">
                {/* Drawer Header */}
                <div className="border-b border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Sparkles className="h-4 w-4 fill-white" />
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-gray-900 dark:text-slate-100">
                        Student Copilot
                      </h2>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        AI Study Assistant
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 p-6">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Home
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="#features"
                      className="rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Features
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="#steps"
                      className="rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Steps
                    </Link>
                  </SheetClose>
                </nav>

                {/* Bottom Buttons */}
                <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-6 space-y-3">
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Log In
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/register"
                      className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Get Started
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
