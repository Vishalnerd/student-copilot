"use client";

import { useEffect } from "react";
import { FileText, MessageSquare, ClipboardCheck } from "lucide-react";

export default function Features() {
  // Retains original Intersection Observer logic for graceful entrance reveal scripts
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
    /* 💡 FIXED: Configured section frame layer using unified v4 design system tokens */
    <section
      id="features"
      className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-slate-900 border-y border-gray-200/60 dark:border-gray-800/50 transition-colors duration-200 antialiased"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header Text Stack */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
            Supercharge Your Study Flow
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            We've built a suite of tools designed specifically for the unique
            demands of higher education. No fluff, just results.
          </p>
        </div>

        {/* Bento Grid Layout Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {featureItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                /* 💡 FIXED: Configured structural card wrappers to morph cleanly into slate panels */
                className="bento-card group bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-800/80 flex flex-col items-start text-left shadow-2xs hover:scale-[1.01] hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-300"
              >
                {/* Visual Icon Badge Component Wrapper */}
                <div
                  className={`w-12 h-12 rounded-xl border border-transparent dark:border-gray-700/40 flex items-center justify-center transition-all duration-300 mb-6 ${item.colorClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 dark:text-gray-400 font-medium leading-relaxed transition-colors">
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
