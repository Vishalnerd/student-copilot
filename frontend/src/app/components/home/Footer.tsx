"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    { name: "Features", path: "#features" },
    { name: "Steps", path: "#steps" },
    { name: "Log In", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-900/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200 antialiased">
      <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12">
        {/* Top Section */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start text-white dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4 fill-white" />
              </div>

              <span className="text-base font-bold tracking-tight">
                Student Copilot
              </span>
            </div>

            <p className="leading-relaxed font-medium text-slate-400">
              Empowering the next generation of scholars with cutting-edge AI.
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer Navigation"
            className="flex justify-center lg:justify-end"
          >
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="transition-colors text-slate-300 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 dark:border-slate-900/40 pt-6 text-center sm:flex-row sm:text-left">
          <p className="font-medium text-slate-500 dark:text-slate-600">
            © 2026 Student Copilot. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] font-medium text-slate-500 dark:text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
              All systems operational
            </span>

            <button className="transition-colors hover:text-white dark:hover:text-slate-300 cursor-pointer">
              English (US)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
