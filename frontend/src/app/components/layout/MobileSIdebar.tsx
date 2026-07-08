"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import RecentChats from "./RecentChats"; // 💡 Import the recent chat loop module
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Layers,
  ClipboardCheck,
  GraduationCap,
  LogOut,
  Plus,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  trigger: React.ReactNode;
}

export default function MobileSidebar({ trigger }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "My Notes", href: "/notes" },
    { icon: UploadCloud, label: "Upload Notes", href: "/upload" },
    { icon: Layers, label: "Flashcards", href: "/flashcards" },
    { icon: ClipboardCheck, label: "Quizzes", href: "/quiz" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-6 flex-shrink-0">
            <SheetClose asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
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
            </SheetClose>
          </div>

          {/* 🚀 Dynamic Scroll Workspace Section for Mobile Viewports */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Mobile New Chat Action Button */}
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
              <SheetClose asChild>
                <button
                  onClick={() => router.push("/notes")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  New Chat
                </button>
              </SheetClose>
            </div>

            {/* Scrollable Center containing Recent Chats Feed */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 border-b border-gray-100 dark:border-gray-900/60 [&::-webkit-scrollbar]:w-1">
              <div className="px-3 mt-2 mb-2">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Recent Chats
                </h3>
              </div>

              {/* Wrapping component with SheetClose ensures clicking a chat closes the mobile drawer immediately */}
              <SheetClose asChild>
                <div>
                  <RecentChats />
                </div>
              </SheetClose>
            </div>

            {/* Primary Navigation links underneath */}
            <nav className="p-4 space-y-1 max-h-[35vh] overflow-y-auto flex-shrink-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                        ${active ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60"}`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
                      />
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </div>

          {/* Logout Footer Layout Panel */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-slate-950 flex-shrink-0">
            <SheetClose asChild>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-red-600 cursor-pointer transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                <span>Logout</span>
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
