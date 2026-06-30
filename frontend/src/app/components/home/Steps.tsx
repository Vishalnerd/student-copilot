"use client";

import { TrendingUp } from "lucide-react";

export default function Steps() {
  return (
    /* 💡 FIXED: Configured layout borders and canvas nodes to react cleanly under dark mode rules */
    <section
      id="steps"
      className="py-24 px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800/60 transition-colors duration-200 antialiased"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Media Graphic Widget */}
          <div className="relative order-2 lg:order-1 select-none">
            {/* Main Feature Graphic Imagery */}
            <div
              className="w-full h-[400px] rounded-2xl bg-cover bg-center shadow-md border border-gray-200 dark:border-gray-800 transition-colors duration-200"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80')",
              }}
            />

            {/* Floating Metric Statistical Callout Bubble */}
            {/* 💡 FIXED: Remapped box frame settings to shift cleanly into dark backgrounds */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700/50 hidden sm:block max-w-[240px] transition-colors duration-200">
              <div className="flex items-center gap-2 mb-1.5 text-blue-600 dark:text-blue-400 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm tracking-tight">Efficiency +40%</span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
                Students using Copilot report saving over 6 hours of study time
                weekly.
              </p>
            </div>
          </div>

          {/* Right Workflow Instruction Text Columns */}
          <div className="order-1 lg:order-2 space-y-8 text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
              From Chaos to Clarity in 3 Steps
            </h2>

            {/* Step-by-Step Interactive Workflow Tracking Stack */}
            <div className="space-y-6">
              {/* Step 1 Item */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-600 text-white text-sm font-bold shadow-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Upload
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mt-0.5 leading-relaxed">
                    Drag and drop your PDFs, lecture recordings, or hand-written
                    notes (OCR ready).
                  </p>
                </div>
              </div>

              {/* Step 2 Item */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-600 text-white text-sm font-bold shadow-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Analyze
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mt-0.5 leading-relaxed">
                    Our AI scans your documents to understand the unique
                    terminology and structure of your course.
                  </p>
                </div>
              </div>

              {/* Step 3 Item */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 dark:bg-blue-600 text-white text-sm font-bold shadow-xs flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-slate-200">
                    Excel
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-400 font-medium mt-0.5 leading-relaxed">
                    Generate study materials and start interacting with your
                    personalized AI coach immediately.
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
