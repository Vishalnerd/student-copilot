"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecentChatHistory } from "@/services/chatApi";
import { RecentChat } from "@/types/chat";
import { MessageSquare } from "lucide-react";

export default function RecentChats() {
  const router = useRouter();

  const [chats, setChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getRecentChatHistory();
        setChats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // 🚀 FIXED: Safely extracts the destination ID whether it's a flat string or a nested object reference
  const handleChatView = (noteIdContext: any) => {
    const cleanId =
      noteIdContext && typeof noteIdContext === "object"
        ? noteIdContext._id
        : noteIdContext;

    if (cleanId) {
      router.push(`/notes/${cleanId}`);
    }
  };

  const visibleChats = showAll ? chats : chats.slice(0, 8);

  const groupedChats = useMemo(() => {
    const today: RecentChat[] = [];
    const yesterday: RecentChat[] = [];
    const older: RecentChat[] = [];

    const now = new Date();

    visibleChats.forEach((chat) => {
      const date = new Date(chat.createdAt);
      const diff = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diff === 0) today.push(chat);
      else if (diff === 1) yesterday.push(chat);
      else older.push(chat);
    });

    return { today, yesterday, older };
  }, [visibleChats]);

  const renderSection = (title: string, items: RecentChat[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="px-3 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {title}
        </h3>

        <div className="space-y-0.5">
          {items.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleChatView(chat.noteId)} // 💡 Triggers corrected reference router method
              className="group w-full flex items-start gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {chat.question}
                </p>
                <p className="truncate text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                  {chat.fileName
                    ? chat.fileName.replace(/\.[^/.]+$/, "")
                    : "Study Notebook"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-3 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 italic">
        Loading chats...
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="px-3 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 italic">
        No recent chats found.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {renderSection("Today", groupedChats.today)}
      {renderSection("Yesterday", groupedChats.yesterday)}
      {renderSection("Older Links", groupedChats.older)}

      {chats.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-1 text-center font-bold text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer block"
        >
          {showAll ? "Show less threads" : `Show more (+${chats.length - 8})`}
        </button>
      )}
    </div>
  );
}
