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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xs transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
          Recent Notes
        </h3>
        <Link
          href="/notes"
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
          No notes yet
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note._id}
              /* 💡 FIXED: Outer card is now a semantic div with an onClick route action */
              onClick={() => router.push(`/notes/${note._id}`)}
              className="border border-gray-200 dark:border-gray-700/70 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-500/40 hover:bg-blue-50/10 dark:hover:bg-blue-950/10 transition flex items-start justify-between group cursor-pointer"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {note.fileName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Modified {new Date(note.createdAt).toLocaleDateString()} •
                    12MB
                  </p>

                  {/* Inline Option Utility Triggers */}
                  {/* 💡 e.stopPropagation() prevents the parent div's onClick from triggering when clicking specific buttons */}
                  <div
                    className="flex gap-2 mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/notes/${note._id}`}
                      className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      Chat
                    </Link>
                    <Link
                      href="/flashcards"
                      className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Brain className="w-3 h-3 text-violet-500" />
                      Study
                    </Link>
                    <Link
                      href="/quizzes"
                      className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Clipboard className="w-3 h-3 text-emerald-500" />
                      Quiz
                    </Link>
                  </div>
                </div>
              </div>

              {/* 💡 Option Menu Button */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer self-start -mt-1 -mr-1"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/upload"
        className="w-full mt-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2 text-xs font-bold shadow-3xs cursor-pointer"
      >
        <Plus className="w-4 h-4 text-gray-400" />
        Upload More
      </Link>
    </div>
  );
}
