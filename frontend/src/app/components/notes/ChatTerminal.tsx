"use client";

import { RefObject } from "react";
import { User, Bot, Copy } from "lucide-react";
import Markdown from "react-markdown";
import { ChatMessage } from "@/types/ChatMessage";

interface ChatTerminalProps {
  disabledInput: boolean;
  chats: ChatMessage[];
  chatEndRef: RefObject<HTMLDivElement | null>;
  handleCopy: (text: string) => void;
  askingQuestion: boolean;
}

export default function ChatTerminal(
  {
    disabledInput,
    chats,
    chatEndRef,
    handleCopy,
    askingQuestion,
  }: ChatTerminalProps) {

  return (
    <div
      className={`flex-1 overflow-y-auto bg-transparent px-3 py-4 sm:px-5 sm:py-6 lg:p-6 space-y-5 ${disabledInput ? "select-none" : ""
        }`}
    >
      {chats.map((chat) => (

        <div
          id={chat._id}
          key={chat._id}
          className={`mx-auto max-w-3xl space-y-5 scroll-mt-6 rounded-2xl transition-all duration-500 ${chat.answer === null ? "animate-pulse" : ""
            }`}
        >

          {/* User Message */}
          {chat.question && (
            <div className="flex justify-end items-start gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="max-w-[85%] sm:max-w-xl rounded-2xl border border-slate-200/60 dark:border-gray-700/60 bg-slate-100 dark:bg-slate-800 px-4 sm:px-5 py-3 text-sm font-medium leading-relaxed text-gray-800 dark:text-slate-200 shadow-3xs">
                <p className="break-words">{chat.question}</p>

                <span className="mt-2 block text-right text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Delivered
                </span>
              </div>

              <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-300/40 dark:border-gray-600/40 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                <User className="h-4 w-4" />
              </div>
            </div>
          )}

          {/* AI Message */}
          <div className="flex items-start gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Bot className="h-4 w-4" />
            </div>

            <div className="group relative flex-1 rounded-2xl border border-blue-100/80 dark:border-gray-800 bg-blue-50/50 dark:bg-slate-800/40 p-4 sm:p-5 shadow-2xs transition-colors duration-200">
              {chat.answer === null ? (
                <div className="min-w-0 space-y-2 py-1">
                  <div className="h-4 w-full animate-pulse rounded-sm bg-blue-200/40 dark:bg-slate-700/60" />
                  <div className="h-4 w-5/6 animate-pulse rounded-sm bg-blue-200/40 dark:bg-slate-700/60" />
                  <div className="h-4 w-2/3 animate-pulse rounded-sm bg-blue-200/40 dark:bg-slate-700/60" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 font-medium leading-relaxed overflow-hidden">
                  <div className="markdown-content break-words overflow-x-auto">
                    <Markdown>
                      {chat.answer}
                    </Markdown>
                    {askingQuestion && chat.answer !== null && (
                      <span className="ml-1 animate-pulse text-blue-600">
                        ▋
                      </span>
                    )}
                  </div>
                </div>
              )}

              {chat.answer !== null && (
                <div className="mt-4 flex items-center border-t border-blue-100/30 dark:border-gray-700/40 pt-3">
                  <button
                    disabled={disabledInput}
                    onClick={() => handleCopy(chat.answer!)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:pointer-events-none disabled:opacity-40"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div ref={chatEndRef} />
    </div>
  );
}
