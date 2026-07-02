"use client";

import { Paperclip, Send, Loader2 } from "lucide-react";
import { ActionDockPanelProps } from "@/types/ActionDockPanelProps";

export default function ActionDockPanel({
  question,
  setQuestion,
  handleAsk,
  handleSummary,
  handleGenerateFlashcards,
  askingQuestion,
  loadingSummary,
  loadingFlashcards,
  viewMode,
  disabled,
}: ActionDockPanelProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800/80 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-lg transition-colors duration-200">
      {/* Quick Actions */}
      <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
        {["Explain this concept", "List key terms"].map((chip, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => setQuestion(chip)}
            className="rounded-full border border-gray-200 dark:border-gray-700/60 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 shadow-3xs transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-40"
          >
            {chip}
          </button>
        ))}

        <button
          onClick={handleSummary}
          disabled={disabled || loadingSummary}
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-3xs transition hover:bg-blue-700 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600"
        >
          {loadingSummary && viewMode === "chat" ? (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Summarizing...
            </span>
          ) : (
            "Generate Summary"
          )}
        </button>

        <button
          onClick={handleGenerateFlashcards}
          disabled={disabled || loadingFlashcards}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-3xs transition hover:bg-emerald-700 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600"
        >
          {loadingFlashcards ? (
            <span className="flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Compiling...
            </span>
          ) : (
            "Generate Flashcards"
          )}
        </button>
      </div>

      {/* Input */}
      <div
        className={`mx-auto mt-3 flex max-w-3xl items-center rounded-xl border border-gray-200 dark:border-gray-700/80 bg-slate-50 dark:bg-slate-800/60 px-2 sm:px-3 py-1.5 shadow-inner transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${
          disabled ? "cursor-not-allowed select-none opacity-60" : ""
        }`}
      >
        <button
          disabled={disabled}
          className="rounded-lg p-2 text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-slate-300 disabled:pointer-events-none"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          type="text"
          value={question}
          disabled={disabled}
          placeholder={
            disabled
              ? "AI is processing..."
              : "Ask anything about these notes..."
          }
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !disabled) {
              e.preventDefault();
              handleAsk();
            }
          }}
          className="w-full border-0 bg-transparent px-2 sm:px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder-gray-500"
        />

        <button
          onClick={handleAsk}
          disabled={disabled || askingQuestion || !question.trim()}
          className="ml-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600"
        >
          {askingQuestion ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Footer */}
      <p className="pt-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Student Copilot AI can make mistakes. Verify critical information.
      </p>
    </div>
  );
}
