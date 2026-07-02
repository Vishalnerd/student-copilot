"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentChats } from "@/services/aiApi";
import { MessageSquare, ArrowRight, Loader2, Bot } from "lucide-react";
import { ConversationItem } from "@/types/ConversationItem";

export default function AIConversations() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const data = await getRecentChats();

        const rawList = Array.isArray(data) ? data : data.conversations || [];

        // 💡 FIX: Map the MongoDB keys to match the frontend property names exactly
        // 💡 Update the .map loop in your useEffect to look exactly like this:
        const formattedConversations = rawList.map((conv: any) => ({
          id: conv._id, // 🚀 FIX: Unique message ID ensures React keys remain completely unique
          noteId: conv.noteId, // 🚀 Keep the parent Note ID separate for clicking routing purposes
          title: conv.question || "Untitled Chat",
          preview: conv.answer || "Awaiting AI response...",
          time: conv.createdAt
            ? new Date(conv.createdAt).toLocaleDateString()
            : "Recent",
        }));

        setConversations(formattedConversations.slice(0, 3));
      } catch (error) {
        console.error("Failed to query recent AI chat activity stream:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  // 1. ISOLATED INITIALIZER LOADING RUNTIME BOUNDARY
  if (loading) {
    return (
      <div className="flex min-h-[280px] sm:min-h-[320px] flex-col items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 sm:p-6 transition-colors duration-200">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="mt-2 text-center text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Syncing chat logs...
        </p>
      </div>
    );
  }

  // EMPTY STATE
  if (conversations.length === 0) {
    return (
      <div className="flex min-h-[280px] sm:min-h-[320px] flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 sm:p-6 text-left transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            AI Conversations
          </h3>
        </div>

        <div className="space-y-3 py-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-900 text-gray-300 dark:text-gray-500">
            <MessageSquare className="h-5 w-5" />
          </div>

          <p className="mx-auto max-w-[220px] text-xs font-medium leading-normal text-gray-400 dark:text-gray-500">
            No recent AI activity sessions cataloged yet.
          </p>
        </div>

        <Link
          href="/notes"
          className="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-gray-500 transition hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-slate-900"
        >
          Open Notes to Start Chatting
        </Link>
      </div>
    );
  }

  // MAIN VIEW
  return (
    <div className="flex min-h-[280px] sm:min-h-[320px] flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-2xs transition-colors duration-200">
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            AI Conversations
          </h3>

          <Link
            href="/chat"
            className="flex flex-shrink-0 items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
          >
            Open Live
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {conversations.map((conv: any) => (
            <Link
              key={conv.id || conv._id}
              href={`/notes/${conv.noteId}`}
              className="block rounded-xl border border-gray-100 dark:border-gray-700/50 bg-slate-50/30 dark:bg-slate-900/30 p-3 sm:p-3.5 text-left transition hover:border-blue-200 hover:bg-blue-50/20 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/20 group"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {conv.title}
                  </p>

                  <p className="mt-1 truncate text-xs font-medium leading-normal text-gray-400 dark:text-gray-500">
                    {conv.preview || "No message overview provided..."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/notes"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-xs font-bold text-gray-600 shadow-3xs transition hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-slate-900/60"
      >
        View All History Logs
      </Link>
    </div>
  );
}
