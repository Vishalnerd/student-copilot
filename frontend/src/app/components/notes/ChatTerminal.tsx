"use client";

import { RefObject } from "react";
import { User, Bot, Copy } from "lucide-react";
import Markdown from "react-markdown";
import { ChatMessage } from "@/types/ChatMessage";

interface ChatTerminalProps {
  disabledInput: boolean; // 💡 Managed from parent layout container during async streams
  chats: ChatMessage[];
  chatEndRef: RefObject<HTMLDivElement | null>;
  handleCopy: (text: string) => void;
}

export default function ChatTerminal({
  disabledInput, // 💡 FIXED: Missing destructured param added here to match TypeScript definition contract
  chats,
  chatEndRef,
  handleCopy,
}: ChatTerminalProps) {
  return (
    <div
      className={`flex-1 overflow-y-auto p-6 space-y-6 bg-transparent ${
        disabledInput ? "select-none" : ""
      }`}
    >
      {chats.map((chat) => (
        <div key={chat._id} className="space-y-4 max-w-3xl mx-auto">
          {/* User Question Bubble */}
          {chat.question && (
            <div className="flex gap-4 items-start justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-gray-700/60 rounded-2xl px-5 py-3.5 text-sm text-gray-800 dark:text-slate-200 font-medium max-w-xl leading-relaxed shadow-3xs transition-colors duration-200">
                <p>{chat.question}</p>
                <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mt-2 text-right">
                  Delivered
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-300/40 dark:border-gray-600/40 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* AI Response Bubble */}
          <div className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>

            {/* AI Core Dialogue Interface */}
            <div className="bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100/80 dark:border-gray-800 rounded-2xl p-5 text-sm text-gray-800 dark:text-slate-200 leading-relaxed max-w-xl shadow-2xs relative group flex-1 transition-colors duration-200">
              {chat.answer === null ? (
                /* Loading Pulse State Framework */
                <div className="space-y-2 py-1 min-w-50">
                  <div className="h-4 bg-blue-200/40 dark:bg-slate-700/60 rounded-sm w-full animate-pulse" />
                  <div className="h-4 bg-blue-200/40 dark:bg-slate-700/60 rounded-sm w-5/6 animate-pulse" />
                  <div className="h-4 bg-blue-200/40 dark:bg-slate-700/60 rounded-sm w-2/3 animate-pulse" />
                </div>
              ) : (
                /* Compiled Content Markdown Display Port */
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  <div className="markdown-content">
                    <Markdown>{chat.answer}</Markdown>
                  </div>
                </div>
              )}

              {/* Utility Clipboard Deck Actions Toolbar */}
              {chat.answer !== null && (
                <div className="flex items-center gap-3 mt-4 pt-2.5 border-t border-blue-100/30 dark:border-gray-700/40 text-gray-400 dark:text-gray-500 text-xs">
                  <button
                    disabled={disabledInput} // Locks interactions if active updates take place concurrently
                    onClick={() => handleCopy(chat.answer!)}
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 disabled:pointer-events-none transition font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Scroll anchor tracking node */}
      <div ref={chatEndRef} />
    </div>
  );
}
