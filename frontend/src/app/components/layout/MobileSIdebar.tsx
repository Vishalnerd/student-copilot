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
  GraduationCap,
  LogOut,
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
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-6">
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

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                      ${
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    />

                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <SheetClose asChild>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
