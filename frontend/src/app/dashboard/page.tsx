"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboardApi";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import RecentNotes from "@/app/components/dashboard/RecentNotes";
import DashboardSkeleton from "@/app/components/dashboard/DashboardSkeleton";
import { DashboardData } from "@/types/dashboard";
import Link from "next/link";
import AIConversations from "@/app/components/dashboard/AIConversations";
import StatCard from "@/app/components/dashboard/StatCard";
import toast from "react-hot-toast";
import {
  FileText,
  MessageSquare,
  Layers,
  ClipboardCheck,
  Plus,
} from "lucide-react";

const quotes = [
  "The beautiful thing about learning is that no one can take it away from you.",
  "Success is not final, failure is not fatal.",
  "Knowledge is power.",
  "Keep learning and growing every day.",
  "Education is the most powerful weapon.",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute>
      {/* 💡 Upgraded background container using v4 semantic design tokens */}
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* 💡 Fluid slate/zinc content layer responsive to dark theme states */}
        <div className="flex-1 ml-64 flex flex-col bg-slate-50 dark:bg-slate-900/40 overflow-y-auto min-h-screen transition-colors duration-200">
          <Navbar />

          <main className="p-8 max-w-7xl mx-auto w-full">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Hero Banner Section */}
                {/* 💡 Updated gradients syntax to match modern v4 standards */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden transition-all">
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, {user?.name || "Alex"}!
                    </h1>
                    <p className="text-blue-100/90 text-sm mb-6 leading-relaxed">
                      "{randomQuote}" You've mastered{" "}
                      {dashboard?.totalFlashcards
                        ? Math.round(dashboard.totalFlashcards * 0.3)
                        : 0}{" "}
                      new concepts this week. Ready to study?
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/upload"
                        className="px-5 py-2.5 bg-white dark:bg-slate-100 text-blue-600 dark:text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-50 transition flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Upload New PDF
                      </Link>
                    </div>
                  </div>
                </div>

                {dashboard && (
                  <>
                    {/* Stat Cards Grid Group */}
                    {/* 💡 Nested child sub-components (StatCard) should be checked internally to ensure they use dark variants or transparent frames */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        icon={FileText}
                        label="Total Notes"
                        value={dashboard.totalNotes}
                        badge={`${dashboard.totalNotes} today`}
                        badgeColor="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                        iconBg="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      />
                      <StatCard
                        icon={MessageSquare}
                        label="AI Questions"
                        value={dashboard.totalQuestions}
                        badge={`${dashboard.totalQuestions} today`}
                        badgeColor="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                        iconBg="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                      />
                      <StatCard
                        icon={Layers}
                        label="Flashcards"
                        value={dashboard?.totalFlashcards || 0}
                        badge={`${dashboard?.totalFlashcards || 0} active`}
                        badgeColor="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40"
                        iconBg="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      />
                      <StatCard
                        icon={ClipboardCheck}
                        label="Quizzes"
                        value={dashboard?.totalQuizzes || 0}
                        badge={`${dashboard?.totalQuizzes || 0} available`}
                        badgeColor="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40"
                        iconBg="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      />
                    </div>

                    {/* Split Content Column Grid Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Left: Recent Notes Panel */}
                      <div className="lg:col-span-2">
                        <RecentNotes notes={dashboard.recentNotes} />
                      </div>

                      {/* Right: Sidebar Activity Column */}
                      <div className="space-y-6">
                        <AIConversations />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
