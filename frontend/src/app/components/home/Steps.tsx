"use client";

import { TrendingUp } from "lucide-react";

export default function Steps() {
  return (
    <section
      id="steps"
      className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800/60 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200 antialiased"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative order-2 lg:order-1 select-none">
            <div
              className="h-72 sm:h-80 md:h-[400px] w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-cover bg-center shadow-md transition-colors duration-200"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80')",
              }}
            />

            {/* Floating Card */}
            <div className="absolute -bottom-4 right-4 sm:-bottom-6 sm:-right-6 hidden sm:block max-w-[240px] rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-slate-800 p-5 shadow-xl transition-colors duration-200">
              <div className="mb-2 flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Efficiency +40%</span>
              </div>

              <p className="text-[11px] font-medium leading-relaxed text-gray-400 dark:text-gray-400">
                Students using Copilot report saving over 6 hours of study time
                every week.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
              From Chaos to Clarity in 3 Steps
            </h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  1
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Upload
                  </h4>

                  <p className="mt-1 text-sm sm:text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                    Drag and drop your PDFs, Chat with your AI tutor, and generate summaries, quizzes, and flashcards instantly.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  2
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Analyze
                  </h4>

                  <p className="mt-1 text-sm sm:text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                    Our AI understands your course material, terminology, and
                    document structure automatically.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                  3
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Excel
                  </h4>

                  <p className="mt-1 text-sm sm:text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                    Instantly generate summaries, quizzes, flashcards, and chat
                    with your personalized AI tutor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
