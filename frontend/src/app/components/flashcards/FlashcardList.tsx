"use client";

import { useState } from "react";
import FlashcardCard from "./FlashcardCard";
import { ArrowLeft, ArrowRight, RotateCcw, Award } from "lucide-react";
import { Flashcard } from "@/types/flashcard";

interface FlashcardListProps {
  flashcards: Flashcard[];
}

export default function FlashcardList({ flashcards }: FlashcardListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-md mx-auto">
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
          No deck criteria generated yet.
        </p>
      </div>
    );
  }

  const handleAction = (id: string, mastered: boolean) => {
    if (mastered) setMasteredCount((prev) => prev + 1);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setMasteredCount(0);
    setCompleted(false);
  };

  const progressPercentage = Math.round(
    (currentIndex / flashcards.length) * 100,
  );

  /* 1. SESSION COMPLETION SCOREBOARD VIEWPORT */
  if (completed) {
    return (
      /* 💡 FIXED: Adjusted outer status wrapper card for unified v4 dark-mode transitions */
      <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-5 sm:p-8 text-center shadow-2xs animate-in fade-in duration-300 transition-colors">
        {/* Trophy */}
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-amber-100/40 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 shadow-xs">
          <Award className="h-6 w-6 sm:h-7 sm:w-7 fill-amber-50/20 dark:fill-transparent" />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100">
            Session Complete!
          </h3>

          <p className="mt-1 text-xs font-medium leading-relaxed text-gray-400 dark:text-gray-500">
            You successfully reviewed all {flashcards.length} items.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-slate-50 dark:bg-slate-900/60 p-4 transition-colors">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Mastery Accuracy
            </span>

            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-slate-100">
              {Math.round((masteredCount / flashcards.length) * 100)}%
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Cards Got Right
            </span>

            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-slate-100 break-words">
              {masteredCount}/{flashcards.length}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleReset}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm sm:text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Study Deck Again
        </button>
      </div>
    );
  }

  /* 2. ACTIVE PROGRESS TRACK TIMELINE WRAPPER */
  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Session Progress Deck Tracker */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-gray-500">
          <span className="font-mono">
            PROGRESS: {currentIndex + 1} OF {flashcards.length}
          </span>
          <span>{progressPercentage}% DONE</span>
        </div>
        {/* 💡 FIXED: Set background rails to support deep theme contexts cleanly */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/20 dark:border-gray-700/30">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Active Card Viewer Engine */}
      <FlashcardCard
        flashcard={flashcards[currentIndex]}
        onStatusAction={handleAction}
      />

      {/* Manual Core Lower Index Navigation Hotkeys */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={() => {
            if (currentIndex < flashcards.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            } else {
              setCompleted(true);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
        >
          Skip Card
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
