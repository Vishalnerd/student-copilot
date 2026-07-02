"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800/60 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200 antialiased">
      <div className="mx-auto max-w-7xl">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-500/20 dark:border-indigo-600/30 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-indigo-800 px-6 py-10 sm:px-10 sm:py-12 lg:p-12 text-center shadow-xl shadow-blue-600/10 dark:shadow-indigo-950/20">
          {/* Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 space-y-5 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Ready to Ace Your Semester?
            </h2>

            <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed font-medium text-blue-100 dark:text-slate-200">
              Join thousands of students who are reclaiming their time and
              improving their grades with AI.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white px-6 py-3 text-sm sm:text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-700 shadow-xs transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Start Now
              </Link>
            </div>

            <p className="pt-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-blue-200 dark:text-blue-300 opacity-80">
              No Credit Card Required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
