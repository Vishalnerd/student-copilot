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
}: ActionDockPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800/80 p-4 space-y-3 shadow-lg transition-colors duration-200">
      <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
        {/* Dynamic Prompt Chips */}
        {["Explain this concept", "List key terms"].map((chip, i) => (
          <button
            key={i}
            onClick={() => setQuestion(chip)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-slate-300 rounded-full transition shadow-3xs cursor-pointer"
          >
            {chip}
          </button>
        ))}

        {/* Summary Generation Trigger */}
        <button
          onClick={handleSummary}
          disabled={loadingSummary}
          className="text-xs font-semibold px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-full transition shadow-3xs cursor-pointer"
        >
          {loadingSummary && viewMode === "chat" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Generate Summary"
          )}
        </button>

        {/* Flashcard Generation Trigger */}
        <button
          onClick={handleGenerateFlashcards}
          disabled={loadingFlashcards}
          className="text-xs font-semibold px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-full transition shadow-3xs cursor-pointer"
        >
          {loadingFlashcards ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Generate Flashcards"
          )}
        </button>
      </div>

      {/* Central Console Message Input Group */}
      <div className="relative max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700/80 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-xl transition flex items-center px-3 py-1.5 shadow-inner">
        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-slate-300 transition rounded-lg cursor-pointer">
          <Paperclip className="w-4 h-4" />
        </button>

        {/* 💡 FIXED: Configured font text assignment to automatically adapt via text-foreground patterns */}
        <input
          type="text"
          placeholder="Ask anything about these notes..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
          className="w-full bg-transparent border-0 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />

        {/* Message Transmission Send Trigger */}
        <button
          onClick={handleAsk}
          disabled={askingQuestion || !question.trim()}
          className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-xl transition shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Disclaimer Tag */}
      <p className="text-[10px] text-center font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase pt-1">
        Student Copilot AI can make mistakes. Verify critical information.
      </p>
    </div>
  );
}
