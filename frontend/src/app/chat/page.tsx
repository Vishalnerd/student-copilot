"use client";

import { useEffect, useState } from "react";
import { getMyNotes } from "@/services/noteApi";
import { Note } from "@/types/note";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar"; // Casing matched with your layout folder typo
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  Search,
  Sparkles,
  Loader2,
  Menu, // Imported for the mobile menu trigger action
} from "lucide-react";

export default function GlobalChatPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getMyNotes()
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getFileBadge = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || "PDF";
    return extension.length > 4 ? "FILE" : extension;
  };

  const getFileIconConfig = (fileName: string) => {
    const ext = getFileBadge(fileName);
    if (ext === "DOCX" || ext === "DOC") {
      return {
        Icon: FileText,
        bg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      };
    }
    if (ext === "JPG" || ext === "PNG" || ext === "JPEG") {
      return {
        Icon: ImageIcon,
        bg: "bg-amber-50 text-amber-600 border border-amber-100",
      };
    }
    return {
      Icon: FileText,
      bg: "bg-blue-50 text-blue-600 border border-blue-100",
    };
  };

  // Filters workspace cards dynamically based on inline criteria search strings
  const filteredNotes = notes.filter((note) =>
    note.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* Main Content Layout Container */}
        {/* 💡 Note: Adjusted to responsive template spacing 'ml-0 lg:ml-64' to complement side sheet layout break points */}
        <div className="flex-1 ml-0 lg:ml-64 min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/40 transition-colors duration-200">
          {/* Connected Navbar containing the responsive MobileSidebar Primitive Trigger */}
          <Navbar
            mobileMenuTrigger={
              <MobileSidebar
                trigger={
                  <button className="lg:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition focus:outline-none">
                    <Menu className="h-5 w-5" />
                  </button>
                }
              />
            }
          />

          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 fill-blue-500/10 flex-shrink-0" />
                    AI Chat Hub
                  </h1>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Select a knowledge base file below to start an interactive
                    study assistant chat session.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:max-w-xs">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>

                  <input
                    type="text"
                    placeholder="Filter notebooks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-slate-800 py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 shadow-2xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Indexing Chat Rooms...
                  </p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-6 sm:p-10 text-center shadow-3xs">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-gray-500">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">
                    {searchQuery
                      ? "No matching notebooks found"
                      : "No study notes available"}
                  </h2>

                  <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                    {searchQuery
                      ? "Check the spelling or try filtering with another keyword."
                      : "Upload a document first before starting an AI chat session."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredNotes.map((note) => {
                    const { Icon, bg } = getFileIconConfig(note.fileName);
                    const cleanTitle = note.fileName.replace(/\.[^/.]+$/, "");

                    return (
                      <div
                        key={note._id}
                        className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800/80 p-4 sm:p-5 shadow-3xs transition hover:border-blue-200 dark:hover:border-blue-500/40 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <div
                            className={`h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center ${bg}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h3 className="truncate pr-2 text-sm font-bold text-gray-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              {cleanTitle}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-md border border-slate-200/40 dark:border-gray-700/30 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                {getFileBadge(note.fileName)}
                              </span>

                              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                Modified{" "}
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => router.push(`/notes/${note._id}`)}
                          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100/80 dark:text-blue-400 dark:hover:bg-blue-900/60 group-hover:bg-blue-600 group-hover:text-white"
                        >
                          Open Chat
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
