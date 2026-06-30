"use client";

import Link from "next/link";

export default function CTA() {
  return (
    /* 💡 FIXED: Adjusted section base parameters to support smooth dark canvas reversals */
    <section className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800/60 transition-colors duration-200 antialiased">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Core Conversion Billboard Call-Out Box Panel */}
        {/* 💡 FIXED: Configured dynamic v4 background gradients with high contrast border overlays */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-12 text-center relative overflow-hidden shadow-xl shadow-blue-600/10 dark:shadow-indigo-950/20 max-w-5xl mx-auto border border-blue-500/20 dark:border-indigo-600/30">
          {/* Subtle grid background mesh pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Ambient lighting decorative glows */}
          <div className="absolute top-[-30%] left-[-10%] w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-30%] right-[-10%] w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Ready to Ace Your Semester?
            </h2>
            <p className="text-blue-100 dark:text-slate-200 text-sm max-w-md mx-auto leading-relaxed font-medium">
              Join thousands of students who are reclaiming their time and
              improving their grades with AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto text-xs font-bold px-6 py-3 bg-white text-blue-600 dark:text-blue-700 rounded-xl shadow-xs hover:bg-slate-50 transition active:scale-[0.98] uppercase tracking-wide"
              >
                Start Now
              </Link>
            </div>

            <p className="text-[10px] font-mono font-bold text-blue-200 dark:text-blue-300 uppercase tracking-widest opacity-80 pt-1">
              No Credit Card Required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
