"use client";

import Markdown from "react-markdown";
import { CheckCircle2, Circle } from "lucide-react";
import { QuizItem, QuizCardProps } from "@/types/quiz";

export default function QuizCard({
  quiz,
  selectedOption,
  onSelectOption,
  showReview = false,
}: QuizCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xs transition-all duration-300">
      {/* Question Header Layout */}
      <div className="text-gray-900 dark:text-slate-100 font-bold text-base md:text-lg leading-relaxed mb-6 prose prose-sm dark:prose-invert max-w-none">
        <Markdown>{quiz.question}</Markdown>
      </div>

      {/* Multiple Choice Options Deck List */}
      <div className="space-y-3">
        {quiz.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === quiz.correctAnswer;

          // 💡 FIXED: Completely rewritten semantic variable layers to sync seamlessly under dark execution runs
          let optionStyles =
            "bg-slate-50 dark:bg-slate-900/40 border-gray-200 dark:border-gray-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-300";

          if (isSelected && !showReview) {
            optionStyles =
              "bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500 text-blue-700 dark:text-blue-400 font-semibold ring-2 ring-blue-500/10 dark:ring-blue-400/10";
          } else if (showReview) {
            if (isCorrect) {
              optionStyles =
                "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold";
            } else if (isSelected && !isCorrect) {
              optionStyles =
                "bg-rose-50 dark:bg-rose-950/30 border-rose-500 dark:border-rose-500 text-rose-700 dark:text-rose-400 font-semibold";
            } else {
              optionStyles =
                "bg-slate-50 dark:bg-slate-900/20 border-gray-100 dark:border-gray-800 opacity-40 text-gray-400 dark:text-gray-600 pointer-events-none";
            }
          }

          return (
            <button
              key={index}
              disabled={showReview}
              onClick={() => onSelectOption(option)}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer group ${optionStyles}`}
            >
              <span className="pr-4">{option}</span>

              <div className="shrink-0">
                {showReview && isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isSelected ? (
                  <CheckCircle2
                    className={`w-4 h-4 ${showReview ? "text-rose-500" : "text-blue-600 dark:text-blue-400"}`}
                  />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
