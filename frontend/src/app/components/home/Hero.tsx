"use client";

import Link from "next/link";
import {
  Bolt,
  PlayCircle,
  Bot,
  FileText,
  HelpCircle,
  Check,
} from "lucide-react";

export default function Hero() {
  return (
    /* 💡 FIXED: Stripped old heavy gray parameters to support robust v4 dark canvas themes */
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 transition-colors duration-200 antialiased">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Side Content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          {/* Badge Trigger Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-3xs">
            <Bolt className="w-3.5 h-3.5 fill-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Now with Gemini Integration
            </span>
          </div>

          {/* Headline Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-gray-900 dark:text-slate-100">
            Your AI-Powered <br />
            <span className="text-transparent dark:text-blue-400 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Academic Edge
            </span>
          </h1>

          {/* Description Prose */}
          <p className="mx-auto lg:mx-0 mt-5 mb-8 max-w-xl text-sm sm:text-base leading-relaxed font-medium text-gray-500 dark:text-gray-400">
            Transform your chaotic lecture notes into structured summaries,
            interactive flashcards, and personalized quizzes in seconds. Focus
            on learning, not formatting.
          </p>

          {/* Action Call Controls Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
            <Link
              href="/register"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            >
              Get Started for Free
            </Link>

            <Link
              href="#steps"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-6 py-3.5 text-sm font-bold text-gray-700 dark:text-slate-200 shadow-3xs transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <PlayCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              See how it works
            </Link>
          </div>
        </div>

        {/* Right Side Hero Visual (UI Mockup Frame) */}
        <div className="relative order-1 flex items-center justify-center lg:order-2 lg:h-[600px]">
          {/* Ambient Glow Backdrop Layer */}
          <div className="absolute inset-0 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl transform scale-125 pointer-events-none" />

          {/* Main Card View Frame Mockup Layout */}
          {/* 💡 FIXED: Rewritten structural frame states to update clean on light/dark modes */}
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-[460px] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800/80 bg-white dark:bg-slate-800 p-2 shadow-2xl transition-all duration-500 lg:rotate-2 hover:rotate-0">
            {/* Header Window Bar */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/50 bg-slate-50/60 dark:bg-slate-900/40 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded-full" />
              <div className="w-4 h-4 bg-gray-200/60 dark:bg-slate-700/60 rounded-sm" />
            </div>

            {/* Inner App Card Wireframe Nodes */}
            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-full animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-100/60 dark:bg-slate-700/40 rounded-full" />
                </div>
              </div>

              {/* Feature Box Grid Indicators */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="h-24 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/20 rounded-xl p-3 flex flex-col justify-between">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="h-2 w-3/4 bg-blue-200/40 dark:bg-blue-900/40 rounded-full" />
                </div>
                <div className="h-24 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/20 rounded-xl p-3 flex flex-col justify-between">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <div className="h-2 w-1/2 bg-indigo-200/40 dark:bg-indigo-900/40 rounded-full" />
                </div>
              </div>

              {/* Skeleton Text Lines Layout */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl space-y-2 border border-gray-100/50 dark:border-gray-800/40">
                <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full" />
                <div className="h-2 w-[90%] bg-gray-200 dark:bg-slate-700 rounded-full" />
                <div className="h-2 w-[80%] bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>

          {/* Floating Pill Accent Badge Component */}
          <div className="absolute -top-4 right-0 hidden sm:flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-2.5 shadow-xl transition-colors lg:-right-6">
            <div className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/40 dark:border-emerald-900/40 shadow-sm">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-slate-200">
              Flashcards Generated
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
