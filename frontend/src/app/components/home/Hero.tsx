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
    <section className="relative overflow-hidden pt-24 pb-16 px-6 md:px-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-200 antialiased">
      {/* Abstract geometric background line nodes for texture */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side Content */}
        <div className="text-center lg:text-left">
          {/* Badge Trigger Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-3xs">
            <Bolt className="w-3.5 h-3.5 fill-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Now with Gemini Integration
            </span>
          </div>

          {/* Headline Title */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-slate-100 mb-4 leading-tight tracking-tight">
            Your AI-Powered <br />
            <span className="text-transparent dark:text-blue-400 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Academic Edge
            </span>
          </h1>

          {/* Description Prose */}
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Transform your chaotic lecture notes into structured summaries,
            interactive flashcards, and personalized quizzes in seconds. Focus
            on learning, not formatting.
          </p>

          {/* Action Call Controls Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/register"
              className="w-full sm:w-auto text-center font-bold text-sm px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.98]"
            >
              Get Started for Free
            </Link>

            <Link
              href="#steps"
              className="w-full sm:w-auto font-bold text-sm px-6 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
            >
              <PlayCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              See how it works
            </Link>
          </div>
        </div>

        {/* Right Side Hero Visual (UI Mockup Frame) */}
        <div className="relative lg:h-[600px] flex items-center justify-center">
          {/* Ambient Glow Backdrop Layer */}
          <div className="absolute inset-0 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl transform scale-125 pointer-events-none" />

          {/* Main Card View Frame Mockup Layout */}
          {/* 💡 FIXED: Rewritten structural frame states to update clean on light/dark modes */}
          <div className="relative w-full max-w-[460px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800/80 overflow-hidden p-2 transform lg:rotate-2 hover:rotate-0 transition-all duration-500 select-none">
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
            <div className="p-6 space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
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
          <div className="absolute -top-6 -right-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-bounce hidden sm:flex transition-colors">
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
