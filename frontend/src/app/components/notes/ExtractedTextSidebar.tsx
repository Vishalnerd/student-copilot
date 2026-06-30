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
    setExpandedPages((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const pages = content
    ? content
        .trim()
        .split("\n\n")
        .filter((p) => p.trim() !== "")
    : [];

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 overflow-y-auto flex flex-col gap-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Extracted Text
        </h4>
      </div>

      <div className="space-y-4">
        {pages.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-xs text-center py-8 font-medium">
            No extracted content available.
          </p>
        ) : (
          <div className="space-y-4">
            {pages.slice(0, visiblePages).map((pageText, index) => {
              const isLongText = pageText.length > 250;
              const isCurrentPageExpanded = !!expandedPages[index];

              return (
                <div
                  key={index}
                  /* 💡 FIXED: Configured card container frames for complete v4 theme support */
                  className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-2xs transition hover:border-gray-200 dark:hover:border-gray-700 flex flex-col transition-colors duration-200"
                >
                  <h5 className="text-[10px] font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-2">
                    PAGE {index + 1}
                  </h5>

                  <p
                    /* 💡 FIXED: Inverted hardcoded body text to match deep workspace backgrounds */
                    className={`text-xs text-gray-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line ${
                      !isCurrentPageExpanded && isLongText ? "line-clamp-4" : ""
                    }`}
                  >
                    {pageText}
                  </p>

                  {isLongText && (
                    <button
                      onClick={() => togglePageExpand(index)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition mt-2 self-start cursor-pointer"
                    >
                      {isCurrentPageExpanded ? "See Less" : "See More..."}
                    </button>
                  )}
                </div>
              );
            })}

            {pages.length > visiblePages && (
              <button
                onClick={() => setVisiblePages((prev) => prev + 1)}
                /* 💡 FIXED: Converted 'Load More' pagination button to blend perfectly */
                className="w-full text-center py-2.5 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition shadow-3xs cursor-pointer"
              >
                Load Next Page Block
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
