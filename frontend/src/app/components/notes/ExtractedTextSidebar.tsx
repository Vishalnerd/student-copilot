"use client";

import { useState } from "react";

interface ExtractedTextSidebarProps {
  content?: string;
}

export default function ExtractedTextSidebar({
  content,
}: ExtractedTextSidebarProps) {
  const [visiblePages, setVisiblePages] = useState(2);
  const [expandedPages, setExpandedPages] = useState<Record<number, boolean>>(
    {},
  );

  const togglePageExpand = (index: number) => {
    setExpandedPages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const pages = content
    ? content
        .trim()
        .split("\n\n")
        .filter((p) => p.trim() !== "")
    : [];

  return (
    <aside className="hidden lg:flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 lg:p-5 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Extracted Text
        </h4>
      </div>

      {pages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
            No extracted content available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pages.slice(0, visiblePages).map((pageText, index) => {
            const isLongText = pageText.length > 250;
            const expanded = expandedPages[index];

            return (
              <div
                key={index}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-800/80 p-4 shadow-2xs transition hover:border-gray-200 dark:hover:border-gray-700"
              >
                <h5 className="mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Page {index + 1}
                </h5>

                <p
                  className={`whitespace-pre-line break-words text-xs font-medium leading-relaxed text-gray-600 dark:text-slate-300 ${
                    !expanded && isLongText ? "line-clamp-4" : ""
                  }`}
                >
                  {pageText}
                </p>

                {isLongText && (
                  <button
                    onClick={() => togglePageExpand(index)}
                    className="mt-2 text-[11px] font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {expanded ? "See Less" : "See More..."}
                  </button>
                )}
              </div>
            );
          })}

          {pages.length > visiblePages && (
            <button
              onClick={() => setVisiblePages((prev) => prev + 1)}
              className="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-gray-500 transition hover:border-gray-300 hover:text-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-blue-400 shadow-3xs"
            >
              Load Next Page
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
