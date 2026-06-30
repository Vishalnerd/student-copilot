"use client";

import { useEffect, useState } from "react";
import { getMyNotes } from "@/services/noteApi";
import { Note } from "@/types/note";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
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
      {/* 💡 Upgraded background shell using v4 token */}
      <div className="flex min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* 💡 Managed body block structural backgrounds */}
        <div className="flex-1 ml-64 bg-slate-50 dark:bg-slate-900/40 min-h-screen flex flex-col">
          <Navbar />

          <main className="p-8 max-w-5xl mx-auto w-full flex-1">
            <div className="space-y-6">
              {/* Context Header Area */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {/* 💡 Upgraded text-gray-900 to text-foreground */}
                  <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-8 h-8 text-blue-600 fill-blue-500/10" />
                    AI Chat Hub
                  </h1>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    Select a knowledge base file below to start an interactive
                    study assistant chat session.
                  </p>
                </div>

                {/* Inline filter block */}
                <div className="relative max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  {/* 💡 Upgraded Input fields for full v4 dark support */}
                  <input
                    type="text"
                    placeholder="Filter notebooks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/60 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Central Conditional View Grid Processing Engine */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="text-xs font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                    Indexing Chat Rooms...
                  </p>
                </div>
              ) : filteredNotes.length === 0 ? (
                /* 💡 Dry empty view placeholder card dark inversion */
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-12 text-center shadow-3xs max-w-lg mx-auto mt-10">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">
                    {searchQuery
                      ? "No matching notebooks found"
                      : "No study notes available"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-normal">
                    {searchQuery
                      ? "Check the spelling or try filtering with another keyword query stack parameter."
                      : "You must upload a document file workbook sequence into the hub registry before engaging with the AI."}
                  </p>
                </div>
              ) : (
                /* 💡 ACTIVE COMPILED NOTEBOOKS GRID CHANNELS */
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {filteredNotes.map((note) => {
                    const { Icon, bg } = getFileIconConfig(note.fileName);
                    const cleanTitle = note.fileName.replace(/\.[^/.]+$/, "");

                    return (
                      <div
                        key={note._id}
                        /* 💡 Added dark:bg-slate-800/80 and dark:border-gray-800 */
                        className="group bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-3xs flex items-center justify-between transition hover:border-blue-200 dark:hover:border-blue-500/40 hover:shadow-xs"
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          {/* Left dynamic badge component */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="overflow-hidden">
                            {/* 💡 Swapped text-gray-900 to text-gray-900 dark:text-slate-100 */}
                            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate pr-2">
                              {cleanTitle}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* 💡 Sub-badges dark theme alignment mapping */}
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 rounded-md text-gray-500 dark:text-gray-400 border border-slate-200/40 dark:border-gray-700/30">
                                {getFileBadge(note.fileName)}
                              </span>
                              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                Modified{" "}
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Push action button context adjustments */}
                        <button
                          onClick={() => router.push(`/notes/${note._id}`)}
                          /* 💡 Added dark action parameters (dark:bg-blue-950/40) */
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 rounded-xl transition flex-shrink-0 shadow-3xs group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white"
                        >
                          Open Chat
                          <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
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
