"use client";

import { useEffect, useState } from "react";
import { getMyNotes, deleteNote, searchNotes } from "@/services/noteApi";
import { Note } from "../../types/note";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar"; // Casing matched with your layout folder
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Trash2,
  Plus,
  FolderOpen,
  Search,
  X,
  Menu, // Imported for the mobile menu trigger action
} from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getFileBadge = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toUpperCase() || "PDF";
    return extension.length > 4 ? "FILE" : extension;
  };

  const getNoteTitle = (fileName: string) => {
    const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
    return withoutExtension.length > 28
      ? `${withoutExtension.slice(0, 28)}...`
      : withoutExtension;
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

  // Debounced Search Synchronization Logic
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        getMyNotes()
          .then(setNotes)
          .catch(() => toast.error("Failed to load notes"))
          .finally(() => setLoading(false));
      } else {
        searchNotes(search)
          .then(setNotes)
          .catch(() => toast.error("Search failed"))
          .finally(() => setLoading(false));
      }
    }, 500); // 500ms debounce buffer delay

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this note?")) {
        return;
      }
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  return (
    <ProtectedRoute>
      {/* 💡 Upgraded background container using v4 semantic design tokens */}
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* 💡 Fluid canvas shell handling dark-mode background blend filters and responsive width alignments */}
        <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900/40 transition-colors duration-200 ml-0 lg:ml-64">
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

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              {/* Integrated Modern Search Bar Box Container */}
              <div className="relative w-full max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search your knowledge base..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-gray-900 dark:text-slate-100 block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700/60 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Title Header Section */}
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {search.trim() !== "" ? "Search Results" : "My Notes"}
                  </h1>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    {search.trim() !== ""
                      ? `Showing results matching "${search}"`
                      : "Manage and analyze your uploaded study materials."}
                  </p>
                </div>

                <Link
                  href="/upload"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  New Note
                </Link>
              </div>

              {/* View Output Layer */}
              {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : notes.length === 0 ? (
                /* Empty Fallback Wrapper */
                <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-slate-800 p-12 text-center shadow-2xs max-w-xl mx-auto mt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    {search.trim() !== ""
                      ? "No matching notes found"
                      : "No notes yet"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-normal">
                    {search.trim() !== ""
                      ? "Try tweaking your keywords or verify the spelling."
                      : "Upload your first note to start generating summaries and questions."}
                  </p>
                  {search.trim() === "" && (
                    <Link
                      href="/upload"
                      className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition shadow-xs cursor-pointer"
                    >
                      Upload a note
                    </Link>
                  )}
                </div>
              ) : (
                /* Active Notes Card Layout Grid */
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {notes.map((note) => {
                    const { Icon, bg } = getFileIconConfig(note.fileName);
                    const chatCount = (note as any).chatCount ?? 0;

                    return (
                      <article
                        key={note._id}
                        className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800/80 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:hover:border-blue-500/40 flex flex-col justify-between"
                      >
                        <div>
                          <div className="mb-4 flex items-start justify-between">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/30">
                              {getFileBadge(note.fileName)}
                            </span>
                          </div>

                          <Link
                            href={`/notes/${note._id}`}
                            className="block group/link cursor-pointer"
                          >
                            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 transition line-clamp-1 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {getNoteTitle(note.fileName)}
                            </h2>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 font-medium">
                              Uploaded on{" "}
                              {new Date(note.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </Link>
                        </div>

                        {/* Bottom Action Section Container */}
                        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-700/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span>{chatCount} Chats</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(note._id);
                              }}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition hover:text-red-600 cursor-pointer"
                              aria-label={`Delete ${note.fileName}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <Link
                              href={`/notes/${note._id}`}
                              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20 transition hover:bg-blue-100 dark:hover:bg-blue-900/40"
                            >
                              Open
                            </Link>
                          </div>
                        </div>
                      </article>
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
