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
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-16 px-6 md:px-12 border-t border-slate-800 dark:border-slate-900/50 text-xs transition-colors duration-200 antialiased">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 💡 FIXED: Converted multi-column grid into a clean, distributed 3-zone flex container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-4">
          {/* Zone 1: Brand Identity */}
          <div className="space-y-3 max-w-xs">
            <div className="flex items-center gap-3 text-white dark:text-slate-100">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Student Copilot
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-400 font-medium leading-relaxed">
              Empowering the next generation of scholars with cutting-edge AI.
            </p>
          </div>

          {/* Zone 2: Centered Horizontal Navigation Links */}
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 font-semibold text-sm">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    className="text-slate-300 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    href={link.path}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Lower Row Metadata Copyright Layer */}
        <div className="pt-6 border-t border-slate-800/60 dark:border-slate-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-600 font-medium">
          <p>© 2026 Student Copilot. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 selection:bg-transparent">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
            <button className="hover:text-white dark:hover:text-slate-300 transition-colors cursor-pointer">
              English (US)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
