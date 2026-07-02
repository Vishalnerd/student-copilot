"use client";

import { useState } from "react";
import QuizCard from "./QuizCard";
import {
  Award,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { QuizItem, QuizSummaryProps } from "@/types/quiz";

export default function QuizSummary({
  quizzes = [],
  userAnswers = {},
  onRetry,
  onRegenerate,
  loadingRegen,
}: QuizSummaryProps) {
  const [showReviewFeed, setShowReviewFeed] = useState(false);

  // 💡 Defensive Guard: Ensure quizzes array exists before running reduce
  const correctCount = Array.isArray(quizzes)
    ? quizzes.reduce(
        (acc, q) => acc + (userAnswers[q._id] === q.correctAnswer ? 1 : 0),
        0,
      )
    : 0;

  const totalQuestions = quizzes?.length || 0;
  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const totalIncorrect = totalQuestions - correctCount;

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-5 sm:p-6 lg:p-8 text-center shadow-2xs transition-colors">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100/50 dark:border-blue-900/30 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-3xs">
          <Award className="h-7 w-7 fill-blue-50/20 dark:fill-transparent" />
        </div>

        <div className="mt-5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100">
            Quiz Submitted!
          </h3>

          <p className="mt-1 text-xs font-medium text-gray-400 dark:text-gray-500">
            Your exam attempt session results have been cataloged.
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-slate-50 dark:bg-slate-900/60 p-4 transition-colors">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Grade Score
            </span>

            <p
              className={`mt-1 text-2xl font-black ${
                scorePercentage >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-500 dark:text-amber-400"
              }`}
            >
              {scorePercentage}%
            </p>
          </div>

          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Correct
            </span>

            <p className="mt-1 text-2xl font-black text-gray-900 dark:text-slate-100">
              {correctCount}/{totalQuestions}
            </p>
          </div>

          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Incorrect
            </span>

            <p className="mt-1 text-2xl font-black text-rose-500 dark:text-rose-400">
              {totalIncorrect}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 shadow-3xs transition hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            Retry Answers
          </button>

          <button
            onClick={onRegenerate}
            disabled={loadingRegen}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600"
          >
            {loadingRegen ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Regenerate Quiz
          </button>
        </div>
      </div>

      {/* Review */}
      {totalIncorrect > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowReviewFeed(!showReviewFeed)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-4 shadow-3xs transition"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 dark:text-slate-400">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Review Incorrect Concepts ({totalIncorrect})
            </div>

            {showReviewFeed ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {showReviewFeed && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {quizzes
                .filter((q) => userAnswers[q._id] !== q.correctAnswer)
                .map((quiz, idx) => (
                  <div key={quiz._id} className="space-y-2">
                    <span className="block px-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                      Misstep Analysis {idx + 1}
                    </span>

                    <QuizCard
                      quiz={quiz}
                      selectedOption={userAnswers[quiz._id] || null}
                      onSelectOption={() => {}}
                      showReview
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
