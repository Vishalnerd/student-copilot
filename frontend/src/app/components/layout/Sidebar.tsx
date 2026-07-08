"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import RecentChats from "./RecentChats";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Layers,
  ClipboardCheck,
  LogOut,
  GraduationCap,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: FileText,
      label: "My Notes",
      href: "/notes",
    },
    {
      icon: UploadCloud,
      label: "Upload Notes",
      href: "/upload",
    },
    {
      icon: Layers,
      label: "Flashcards",
      href: "/flashcards",
    },
    {
      icon: ClipboardCheck,
      label: "Quizzes",
      href: "/quiz",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Logo */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-bold leading-none text-gray-900 dark:text-slate-100">
              Student
            </h1>
            <h2 className="text-lg font-bold leading-none text-gray-900 dark:text-slate-100">
              Copilot
            </h2>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
              AI Study Assistant
            </p>
          </div>
        </Link>
      </div>

      {/* 🚀 Core Persistent Navigation (Anchored Safely at Top) */}
      <div className="px-2 pt-4 pb-3 border-b border-gray-100 dark:border-gray-900/60">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${active
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${active
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600"
                    }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 📱 Dynamic Scroll Workspace Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">


        {/* Scrollable Container dedicated exclusively to Recent Chats tracking */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
          <div className="px-3 mt-2 mb-2">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Recent Chats
            </h3>
          </div>

          <RecentChats />
        </div>
      </div>

      {/* Footer Actions Panel */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-slate-950">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-red-600 cursor-pointer transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
