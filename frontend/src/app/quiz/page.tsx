"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar"; // Casing matched with your layout folder typo
import QuizCard from "../components/quiz/QuizCard";
import QuizSummary from "../components/quiz/QuizSummary";
import { getMyNotes } from "@/services/noteApi";
import { generateQuiz } from "@/services/aiApi";
import { Note } from "@/types/note";
import toast from "react-hot-toast";
import {
  CheckSquare,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Award,
  Menu, // Imported for the mobile menu trigger action
} from "lucide-react";

export default function GlobalQuizPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // 🧪 Stepper Session Tracking States
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    getMyNotes()
      .then(setNotes)
      .catch((err) => {
        toast.error("Failed to sync note registry logs");
        console.error(err);
      })
      .finally(() => setLoadingNotes(false));
  }, []);

  const handleStartQuiz = async (noteId: string, forceRegen = false) => {
    const selectedNote = notes.find((n) => n._id === noteId);
    if (!selectedNote) return;

    setActiveNote(selectedNote);
    setLoadingQuiz(true);
    try {
      const data = await generateQuiz(noteId);
      setQuizzes(data.quizzes || data);

      // Reset stepper metrics on initialization
      setCurrentQuizIndex(0);
      setUserAnswers({});
      setQuizSubmitted(false);
    } catch (error) {
      toast.error("Failed to compile quiz sheet questions");
      setActiveNote(null);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (!quizzes[currentQuizIndex]) return;
    const currentQuizId = quizzes[currentQuizIndex]._id;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuizId]: option,
    }));
  };

  const handleExitQuiz = () => {
    setActiveNote(null);
    setQuizzes([]);
    setQuizSubmitted(false);
  };

  const progressPercentage =
    quizzes.length > 0
      ? Math.round((currentQuizIndex / quizzes.length) * 100)
      : 0;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* Main Content Layout Container */}
        {/* 💡 Adjusted structural padding class variables using fluid margins (ml-0 lg:ml-64) */}
        <div className="flex flex-1 flex-col bg-white dark:bg-slate-900 transition-colors duration-200 ml-0 lg:ml-64">
          {/* Connected Navbar containing the responsive MobileSidebar Primitives Trigger */}
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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-gray-900 dark:text-slate-100">
                  <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Exam Mode Dashboard
                </h1>

                <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  Select a document workspace resource below to generate and
                  take simulated knowledge gap tests.
                </p>
              </div>

              {activeNote && (
                <button
                  onClick={handleExitQuiz}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-gray-200 dark:border-gray-700/60 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700 sm:self-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Exit Quiz Mode
                </button>
              )}
            </div>

            {/* Loading */}
            {loadingNotes ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Synchronizing Workspace Decks...
                </p>
              </div>
            ) : !activeNote ? (
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Available Notebook Question Sheets ({notes.length})
                </h2>

                {notes.length === 0 ? (
                  <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-12 text-center shadow-2xs">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-900 text-gray-400 dark:text-gray-500">
                      <HelpCircle className="h-5 w-5" />
                    </div>

                    <p className="mx-auto max-w-[280px] text-xs font-medium leading-relaxed text-gray-400 dark:text-gray-500">
                      You must upload notes before taking quiz exams.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {notes.map((noteItem) => (
                      <div
                        key={noteItem._id}
                        className="group flex flex-col gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-slate-800/80 p-5 shadow-3xs transition-all duration-200 hover:border-blue-500 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 dark:border-blue-900/30 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            <BookOpen className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate pr-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                              {noteItem.fileName.replace(/\.[^/.]+$/, "")}
                            </h3>

                            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                              Modified{" "}
                              {new Date(
                                noteItem.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartQuiz(noteItem._id)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-xs font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:text-blue-400 dark:group-hover:bg-blue-600"
                        >
                          Take Quiz
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto w-full max-w-xl py-4">
                {loadingQuiz ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Assembling Dynamic Evaluation Matrix...
                    </p>
                  </div>
                ) : quizSubmitted ? (
                  <QuizSummary
                    quizzes={quizzes}
                    userAnswers={userAnswers}
                    onRetry={() => setQuizSubmitted(false)}
                    onRegenerate={() => handleStartQuiz(activeNote._id, true)}
                    loadingRegen={loadingQuiz}
                  />
                ) : quizzes.length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-gray-500">
                        <span className="font-mono text-[10px]">
                          QUESTION {currentQuizIndex + 1} OF {quizzes.length}
                        </span>

                        <span className="text-[10px]">
                          {progressPercentage}% COMPLETION
                        </span>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <QuizCard
                      quiz={quizzes[currentQuizIndex]}
                      selectedOption={
                        userAnswers[quizzes[currentQuizIndex]._id] || null
                      }
                      onSelectOption={handleSelectOption}
                    />

                    <div className="flex items-center justify-between">
                      <button
                        disabled={currentQuizIndex === 0}
                        onClick={() => setCurrentQuizIndex((prev) => prev - 1)}
                        className="text-xs font-bold text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-slate-100 disabled:pointer-events-none disabled:opacity-30"
                      >
                        Previous
                      </button>

                      {currentQuizIndex < quizzes.length - 1 ? (
                        <button
                          onClick={() =>
                            setCurrentQuizIndex((prev) => prev + 1)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                        >
                          Next Question
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizSubmitted(true);
                            toast.success("Exam Grading Completed!");
                          }}
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                          Finish & Submit
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-8 text-center shadow-2xs">
                    <Sparkles className="mx-auto h-8 w-8 animate-pulse text-gray-300 dark:text-gray-600" />

                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      No quiz sheets generated for this workbook.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
