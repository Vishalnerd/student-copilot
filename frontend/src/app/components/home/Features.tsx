"use client";

import { useEffect } from "react";
import { FileText, MessageSquare, ClipboardCheck } from "lucide-react";

export default function Features() {
  useEffect(() => {
    const cards = document.querySelectorAll(".bento-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => {
      card.classList.add(
        "opacity-0",
        "translate-y-10",
        "transition-all",
        "duration-700",
      );
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const featureItems = [
    {
      icon: FileText,
      colorClass:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white",
      title: "Smart Summarization",
      desc: "Instantly distill lengthy lecture transcripts and PDFs into clear, actionable bullet points that highlight key concepts and definitions.",
    },
    {
      icon: MessageSquare,
      colorClass:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 dark:group-hover:text-white",
      title: "AI Study Chat",
      desc: "Ask questions about your specific materials. Our AI contextualizes answers using only your uploaded content for 100% accuracy.",
    },
    {
      icon: ClipboardCheck,
      colorClass:
        "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-600 group-hover:text-white dark:group-hover:bg-slate-400 dark:group-hover:text-slate-900",
      title: "Instant Quizzes",
      desc: "Generate practice exams and multiple-choice questions on the fly. Track your progress and master your subjects before the big day.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-50 dark:bg-slate-900 border-y border-gray-200/60 dark:border-gray-800/50 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200 antialiased"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 sm:mb-16 space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Supercharge Your Study Flow
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed font-medium text-gray-500 dark:text-gray-400">
            We've built a suite of tools designed specifically for the unique
            demands of higher education. No fluff, just results.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="bento-card group flex flex-col items-start rounded-2xl border border-gray-200 dark:border-gray-800/80 bg-white dark:bg-slate-800/80 p-5 sm:p-6 text-left shadow-2xs transition-all duration-300 hover:scale-[1.01] hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md"
              >
                <div
                  className={`mb-5 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-transparent dark:border-gray-700/40 transition-all duration-300 ${item.colorClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-slate-100">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-xs leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
