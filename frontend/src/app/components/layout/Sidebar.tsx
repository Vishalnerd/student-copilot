"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  MessageSquare,
  Layers,
  ClipboardCheck,
  User,
  Settings,
  LogOut,
  GraduationCap,
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
      icon: MessageSquare,
      label: "AI Chat",
      href: "/chat",
    },
    {
      icon: Layers, // Good fit for flashcard stacks
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
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col transition-colors duration-200">
      {/* Brand Header */}
      <div className="space-y-1 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-foreground leading-tight">Student</h1>
            <h2 className="font-bold text-foreground leading-tight">Copilot</h2>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-mono tracking-wider pt-1">
          AI STUDY ASSISTANT
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon; // Dynamic component assignment

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium group"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
