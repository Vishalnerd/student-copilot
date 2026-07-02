"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Flashcard } from "@/types/flashcard";

interface FlashcardCardProps {
  flashcard: Flashcard;
  onStatusAction?: (id: string, mastered: boolean) => void;
}

export default function FlashcardCard({
  flashcard,
  onStatusAction,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 select-none">
      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="group w-full h-[280px] sm:h-72 perspective-1000 cursor-pointer"
      >
        <div
          className={`relative h-full w-full transform-style-3d duration-500 ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-5 sm:p-8 shadow-2xs backface-hidden transition-colors duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-700">
            <div className="space-y-2 overflow-y-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Question
              </span>

              <div className="prose prose-sm dark:prose-invert max-w-none text-base sm:text-lg md:text-xl font-bold leading-relaxed text-gray-900 dark:text-slate-100">
                <ReactMarkdown>{flashcard.question}</ReactMarkdown>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
              <RefreshCw className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Tap card to flip</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-5 sm:p-8 text-white shadow-md rotate-y-180 backface-hidden transition-colors duration-200">
            <div className="max-h-[170px] sm:max-h-[180px] overflow-y-auto pr-2 scrollbar-thin space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                Answer Summary
              </span>

              <div className="prose prose-sm prose-invert max-w-none text-sm sm:text-base md:text-lg font-medium leading-relaxed text-slate-100 dark:text-slate-200">
                <ReactMarkdown>{flashcard.answer}</ReactMarkdown>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-400">
              <RefreshCw className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
              <span>Tap card to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {onStatusAction && (
        <div className="animate-in fade-in duration-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={() => {
              setIsFlipped(false);
              onStatusAction(flashcard._id, false);
            }}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            <AlertCircle className="h-4 w-4" />
            Still Reviewing
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              onStatusAction(flashcard._id, true);
            }}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
          >
            <CheckCircle2 className="h-4 w-4" />
            Got It Right
          </button>
        </div>
      )}
    </div>
  );
}
