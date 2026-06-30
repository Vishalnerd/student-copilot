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
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col min-h-[320px] justify-center items-center transition-colors duration-200">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-[11px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-2">
          Syncing chat logs...
        </p>
      </div>
    );
  }

  // 2. EMPTY REGISTRY DRY FALLBACK VIEWPORT
  if (conversations.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col min-h-[320px] justify-between text-left transition-colors duration-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            AI Conversations
          </h3>
        </div>

        <div className="text-center py-6 space-y-3">
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-700/60 text-gray-300 dark:text-gray-500 rounded-xl flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium max-w-[200px] mx-auto leading-normal">
            No recent AI activity sessions cataloged yet.
          </p>
        </div>

        <Link
          href="/notes"
          className="w-full py-2.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 text-gray-500 dark:text-gray-400 font-bold text-xs text-center transition tracking-wide uppercase cursor-pointer"
        >
          Open Notes to Start Chatting
        </Link>
      </div>
    );
  }

  // 3. COMPILED FEED TIMELINE SCREEN DISPLAY
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col shadow-2xs min-h-[320px] justify-between transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            AI Conversations
          </h3>
          <Link
            href="/chat"
            className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-0.5 group"
          >
            Open Live
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Mapping Layout Frame Container */}
        <div className="space-y-3">
          {conversations.map((conv: any) => (
            <Link
              key={conv.id || conv._id}
              href={`/notes/${conv.noteId}`}
              className="block border border-gray-100 dark:border-gray-700/50 bg-slate-50/30 dark:bg-slate-900/30 rounded-xl p-3.5 hover:border-blue-200 dark:hover:border-blue-500/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition group text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-slate-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {conv.title}
                  </p>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 truncate mt-0.5 leading-normal">
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
        className="w-full mt-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition flex items-center justify-center gap-2 text-xs font-bold shadow-3xs cursor-pointer"
      >
        View All History Logs
      </Link>
    </div>
  );
}
