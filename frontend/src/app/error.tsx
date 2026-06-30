"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user } = useAuth();

  // 💡 Dynamically resolve home boundary based on user session state maps
  const homePath = user ? "/notes" : "/";

  useEffect(() => {
    // 🧠 Log operational exceptions to downstream error reporting utilities (e.g. Sentry)
    console.error("Runtime Exception Core Hook Boundary Catch:", error);
  }, [error]);

  return (
    /* 💡 FIXED: Shifted context background to leverage universal design variables */
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-200 antialiased">
      {/* Structural Card Container */}
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xs space-y-6 transition-all duration-200">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center border border-rose-100/40 dark:border-rose-900/30 mx-auto shadow-3xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            An unexpected structural runtime exception crashed the viewport
            context stack.
          </p>

          {/* Optional: Render token digest metadata if available */}
          {error.digest && (
            <p className="text-[10px] font-mono font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest pt-1">
              Digest Code: {error.digest}
            </p>
          )}
        </div>

        {/* Operational Flow Restoration Triggers */}
        <div className="space-y-3 pt-2">
          {/* 🚀 Try Again attempts to reset the Next.js Error boundary loop natively */}
          <button
            onClick={reset}
            className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs cursor-pointer active:scale-[0.98]"
          >
            Try Again
          </button>

          <Link
            href={homePath}
            className="w-full inline-flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs py-3 rounded-xl transition shadow-3xs cursor-pointer"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
