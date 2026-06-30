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
      {/* 3D Animation Container Workspace */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-64 perspective-1000 cursor-pointer group"
      >
        <div
          className={`w-full h-full duration-500 transform-style-3d relative ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT SIDE: Question View */}
          {/* 💡 FIXED: Converted static white frame to toggle fluidly into deep slate grids */}
          <div className="absolute inset-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-2xs backface-hidden group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Question
              </span>
              {/* 💡 FIXED: Injected prose dark parameters to parse question markdown patterns perfectly */}
              <div className="text-gray-900 dark:text-slate-100 font-bold text-lg md:text-xl leading-relaxed prose prose-sm dark:prose-invert">
                <ReactMarkdown>{flashcard.question}</ReactMarkdown>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 self-center">
              <RefreshCw className="w-3.5 h-3.5" />
              Click card to flip
            </div>
          </div>

          {/* BACK SIDE: Answer View */}
          {/* 💡 FIXED: Preserved high contrast dark styling frame while syncing typography matching v4 rules */}
          <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white rounded-2xl p-8 flex flex-col justify-between shadow-md rotate-y-180 backface-hidden transition-colors duration-200">
            <div className="space-y-2 overflow-y-auto max-h-[160px] pr-2 scrollbar-thin">
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                Answer Summary
              </span>
              <div className="text-slate-100 dark:text-slate-200 text-base md:text-lg leading-relaxed font-medium prose prose-invert prose-sm">
                <ReactMarkdown>{flashcard.answer}</ReactMarkdown>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-gray-500 self-center">
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              Click card to flip front
            </div>
          </div>
        </div>
      </div>

      {/* Verification Quality Metric Action Deck */}
      {onStatusAction && (
        /* 💡 FIXED: Replaced default opacity transitions with native Tailwind v4 animation attributes */
        <div className="flex items-center justify-center gap-3 animate-in fade-in duration-200">
          <button
            onClick={() => {
              setIsFlipped(false);
              onStatusAction(flashcard._id, false);
            }}
            className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            Still Reviewing
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              onStatusAction(flashcard._id, true);
            }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Got It Right
          </button>
        </div>
      )}
    </div>
  );
}
