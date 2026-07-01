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
  disabled, // 💡 Received from your NoteDetailsPage context state wrapper
}: ActionDockPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800/80 p-4 space-y-3 shadow-lg transition-colors duration-200">
      <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
        {/* Dynamic Prompt Chips */}
        {["Explain this concept", "List key terms"].map((chip, i) => (
          <button
            key={i}
            disabled={disabled} // 💡 FIXED: Locks suggestion text insertion during active async loads
            onClick={() => setQuestion(chip)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-slate-300 rounded-full transition shadow-3xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            {chip}
          </button>
        ))}

        {/* Summary Generation Trigger */}
        <button
          onClick={handleSummary}
          disabled={disabled || loadingSummary} // 💡 FIXED: Unified lock coverage mapping rules
          className="text-xs font-semibold px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-full transition shadow-3xs cursor-pointer disabled:pointer-events-none"
        >
          {loadingSummary && viewMode === "chat" ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Summarizing...
            </span>
          ) : (
            "Generate Summary"
          )}
        </button>

        {/* Flashcard Generation Trigger */}
        <button
          onClick={handleGenerateFlashcards}
          disabled={disabled || loadingFlashcards} // 💡 FIXED: Unified lock coverage mapping rules
          className="text-xs font-semibold px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-full transition shadow-3xs cursor-pointer disabled:pointer-events-none"
        >
          {loadingFlashcards ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Compiling Deck...
            </span>
          ) : (
            "Generate Flashcards"
          )}
        </button>
      </div>

      {/* Central Console Message Input Group */}
      <div
        className={`relative max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-gray-700/80 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-xl transition flex items-center px-3 py-1.5 shadow-inner ${
          disabled ? "opacity-60 cursor-not-allowed select-none" : ""
        }`}
      >
        {/* Clip Attachment Button */}
        <button
          disabled={disabled}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-slate-300 transition rounded-lg cursor-pointer disabled:pointer-events-none"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Entry Field Box */}
        <input
          type="text"
          placeholder={
            disabled
              ? "AI is processing your request..."
              : "Ask anything about these notes..."
          }
          value={question}
          disabled={disabled} // 💡 FIXED: Strict field lock prevents entering keyboard values during requests
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !disabled) {
              e.preventDefault();
              handleAsk();
            }
          }}
          className="w-full bg-transparent border-0 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed"
        />

        {/* Message Transmission Send Trigger */}
        <button
          onClick={handleAsk}
          disabled={disabled || askingQuestion || !question.trim()} // 💡 FIXED: Complete logic block coverage
          className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-xl transition shadow-sm cursor-pointer disabled:pointer-events-none"
        >
          {askingQuestion ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Footer Disclaimer Tag */}
      <p className="text-[10px] text-center font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase pt-1">
        Student Copilot AI can make mistakes. Verify critical information.
      </p>
    </div>
  );
}
