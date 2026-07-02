"use client";

import Link from "next/link";
import { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import {
  FileText,
  MoreVertical,
  Plus,
  MessageSquare,
  Brain,
  Clipboard,
} from "lucide-react";

interface RecentNotesProps {
  notes: Note[];
}

export default function RecentNotes({ notes }: RecentNotesProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-2xs transition-colors duration-200">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100">
          Recent Notes
        </h3>

        <Link
          href="/notes"
          className="flex-shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No notes yet
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => router.push(`/notes/${note._id}`)}
              className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/10 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/10 sm:flex-row sm:items-start sm:justify-between cursor-pointer"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {note.fileName}
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Modified {new Date(note.createdAt).toLocaleDateString()} •
                    12MB
                  </p>

                  {/* Action Buttons */}
                  <div
                    className="mt-3 flex flex-wrap gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/notes/${note._id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <MessageSquare className="h-3 w-3 text-blue-500" />
                      Chat
                    </Link>

                    <Link
                      href="/flashcards"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Brain className="h-3 w-3 text-violet-500" />
                      Study
                    </Link>

                    <Link
                      href="/quizzes"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Clipboard className="h-3 w-3 text-emerald-500" />
                      Quiz
                    </Link>
                  </div>
                </div>
              </div>

              {/* More Button */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="self-end sm:self-start rounded-lg p-1.5 text-gray-400 transition hover:bg-slate-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/upload"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm sm:text-xs font-bold text-gray-700 transition hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-slate-900 shadow-3xs"
      >
        <Plus className="h-4 w-4 text-gray-400" />
        Upload More
      </Link>
    </div>
  );
}
