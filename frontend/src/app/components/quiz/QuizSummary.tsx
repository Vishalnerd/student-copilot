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
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score Panel Billboard */}
      {/* 💡 FIXED: Configured dynamic dark frame changes with unified smooth transitions */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-2xs space-y-6 transition-colors duration-200">
        <div className="w-14 h-14 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 mx-auto shadow-3xs">
          <Award className="w-7 h-7 fill-blue-50/20 dark:fill-transparent" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            Quiz Submitted!
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
            Your exam attempt session results have been cataloged.
          </p>
        </div>

        {/* Dashboard Grid Statistics */}
        {/* 💡 FIXED: Inverted background grid blocks to remain readable on midnight layouts */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-gray-100 dark:border-gray-800/60 grid grid-cols-3 gap-2 transition-colors">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              Grade Score
            </span>
            <p
              className={`text-2xl font-black mt-0.5 ${scorePercentage >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}`}
            >
              {scorePercentage}%
            </p>
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              Correct
            </span>
            <p className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-0.5">
              {correctCount}/{totalQuestions}
            </p>
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
              Incorrect
            </span>
            <p className="text-2xl font-black text-rose-500 dark:text-rose-400 mt-0.5">
              {totalIncorrect}
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs py-3 rounded-xl transition shadow-3xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Retry Answers
          </button>

          <button
            onClick={onRegenerate}
            disabled={loadingRegen}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs cursor-pointer active:scale-[0.98]"
          >
            {loadingRegen ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Regenerate Quiz
          </button>
        </div>
      </div>

      {/* Collapsible Mistakes Review Feed */}
      {totalIncorrect > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowReviewFeed(!showReviewFeed)}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between shadow-3xs cursor-pointer text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-slate-400">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Review Incorrect Concepts ({totalIncorrect})
            </div>
            {showReviewFeed ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {showReviewFeed && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {quizzes
                .filter((q) => userAnswers[q._id] !== q.correctAnswer)
                .map((quiz, idx) => (
                  <div key={quiz._id} className="space-y-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-rose-500 dark:text-rose-400 block uppercase px-1">
                      Misstep Analysis {idx + 1}
                    </span>
                    <QuizCard
                      quiz={quiz}
                      selectedOption={userAnswers[quiz._id] || null}
                      onSelectOption={() => {}}
                      showReview={true}
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
