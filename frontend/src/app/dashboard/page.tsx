"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboardApi";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar";
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
  Menu, // Added Menu icon for the responsive trigger button
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
      <div className="flex min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        {/* Desktop Sidebar (hidden on mobile via internal responsive classes like hidden lg:block) */}
        <Sidebar />

        {/* Main Content Layout Container */}
        {/* 💡 Note: Removed absolute margins and added responsive template spacing 'ml-0 lg:ml-64' */}
        <div className="flex min-h-screen flex-1 flex-col bg-slate-50 dark:bg-slate-900/40 ml-0 lg:ml-64 transition-colors duration-200">
          {/* Navbar layout containing the dynamic trigger instance. 
            The MobileSidebar uses shadcn/ui primitives under the hood to automatically handle toggle listeners.
          */}
          <Navbar
            mobileMenuTrigger={
              <MobileSidebar
                trigger={
                  <button className="lg:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition focus:outline-none">
                    <Menu className="h-5 w-5" />
                  </button>
                }
              />
            }
          />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-indigo-800 p-5 sm:p-6 lg:p-8 text-white shadow-sm">
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      Welcome back, {user?.name || "Alex"}!
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-blue-100/90">
                      "{randomQuote}" You've mastered{" "}
                      {dashboard?.totalFlashcards
                        ? Math.round(dashboard.totalFlashcards * 0.3)
                        : 0}{" "}
                      new concepts this week. Ready to study?
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/upload"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 dark:bg-slate-100 dark:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Upload New PDF
                      </Link>
                    </div>
                  </div>
                </div>

                {dashboard && (
                  <>
                    {/* Stats Layout */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                        value={dashboard.totalFlashcards || 0}
                        badge={`${dashboard.totalFlashcards || 0} active`}
                        badgeColor="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40"
                        iconBg="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      />

                      <StatCard
                        icon={ClipboardCheck}
                        label="Quizzes"
                        value={dashboard.totalQuizzes || 0}
                        badge={`${dashboard.totalQuizzes || 0} available`}
                        badgeColor="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40"
                        iconBg="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      />
                    </div>

                    {/* Split Grid Content Blocks */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
                      <div className="lg:col-span-2">
                        <RecentNotes notes={dashboard.recentNotes} />
                      </div>

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
