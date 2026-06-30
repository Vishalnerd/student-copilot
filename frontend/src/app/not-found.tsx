"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // 💡 Read directly from your existing auth state hook!
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const { user } = useAuth(); // 🧠 Grab the active user profile object block natively

  // If the user object is present, route them safely to the notes dashboard workspace, otherwise send them home
  const homePath = user ? "/notes" : "/";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-200 antialiased">
      {/* Dynamic Glassmorphism Shell Layer Container Box */}
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xs space-y-6 transition-all duration-200">
        {/* Visual Accent Icon */}
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100/40 dark:border-blue-900/30 mx-auto shadow-3xs animate-bounce">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-gray-900 dark:text-slate-100">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Oops! The interactive study notes workspace or chat log directory
            you are looking for doesn't exist.
          </p>
        </div>

        {/* Home Routing Dynamic Action Trigger */}
        <Link
          href={homePath}
          className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs cursor-pointer active:scale-[0.98]"
        >
          ← Go Home
        </Link>
      </div>
    </div>
  );
}
