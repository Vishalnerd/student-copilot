"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
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
      {/* 💡 Upgraded background shell using v4 semantic design tokens */}
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        {/* Main Application Sidebar */}
        <Sidebar />

        {/* 💡 Fluid canvas layout handling theme mode conversions across views */}
        <div className="flex-1 ml-64 flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-6">
            {/* Top Identity Meta Header Header Context Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Exam Mode Dashboard
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Select a document workspace resource below to generate and
                  take simulated knowledge gap tests.
                </p>
              </div>

              {activeNote && (
                <button
                  onClick={handleExitQuiz}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Exit Quiz Mode
                </button>
              )}
            </div>

            {/* CONDITIONAL RENDER AREA */}
            {loadingNotes ? (
              /* Global Sync Loading Indicator Viewport */
              <div className="flex flex-col items-center justify-center py-32 space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  Synchronizing Workspace Decks...
                </p>
              </div>
            ) : !activeNote ? (
              /* NOTE REGISTRY DASHBOARD DISPLAY GRID SELECTION */
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  Available Notebook Question Sheets ({notes.length})
                </h2>

                {notes.length === 0 ? (
                  /* Dry Empty State Card Inversion */
                  <div className="bg-white dark:bg-slate-800 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-xl flex items-center justify-center mx-auto">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                      You must upload notes into your centralized directory file
                      registry dashboard before taking quiz exams.
                    </p>
                  </div>
                ) : (
                  /* Decks Selection Component Mapping Grid Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((noteItem) => (
                      <div
                        key={noteItem._id}
                        className="bg-white dark:bg-slate-800/80 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-3xs hover:shadow-xs group transition-all duration-200 flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-500"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-colors">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {noteItem.fileName.replace(/\.[^/.]+$/, "")}
                            </h3>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                              Modified{" "}
                              {new Date(
                                noteItem.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartQuiz(noteItem._id)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 rounded-xl transition shadow-3xs flex-shrink-0 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white cursor-pointer"
                        >
                          Take Quiz
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE STEPPER SCREEN VIEW LAYER */
              <div className="w-full max-w-xl mx-auto py-4">
                {loadingQuiz ? (
                  /* Quiz Loading Frame State */
                  <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-xs font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                      Assembling Dynamic Evaluation Matrix...
                    </p>
                  </div>
                ) : quizSubmitted ? (
                  /* Ensure the sub-component internally leverages standard layout styles */
                  <QuizSummary
                    quizzes={quizzes}
                    userAnswers={userAnswers}
                    onRetry={() => setQuizSubmitted(false)}
                    onRegenerate={() => handleStartQuiz(activeNote._id, true)}
                    loadingRegen={loadingQuiz}
                  />
                ) : quizzes.length > 0 ? (
                  <div className="space-y-6 w-full">
                    {/* Stepper Progress Bar Tracking Component */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-gray-500">
                        <span className="font-mono text-[10px]">
                          QUESTION {currentQuizIndex + 1} OF {quizzes.length}
                        </span>
                        <span className="text-[10px]">
                          {progressPercentage}% COMPLETION
                        </span>
                      </div>
                      {/* Progress Rails */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Active Question Render Card */}
                    {/* Check your QuizCard component layout internally to support dark variables */}
                    <QuizCard
                      quiz={quizzes[currentQuizIndex]}
                      selectedOption={
                        userAnswers[quizzes[currentQuizIndex]._id] || null
                      }
                      onSelectOption={handleSelectOption}
                    />

                    {/* Lower Navigation Deck Buttons Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={currentQuizIndex === 0}
                        onClick={() => setCurrentQuizIndex((prev) => prev - 1)}
                        className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                      >
                        Previous
                      </button>

                      {currentQuizIndex < quizzes.length - 1 ? (
                        <button
                          onClick={() =>
                            setCurrentQuizIndex((prev) => prev + 1)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer"
                        >
                          Next Question
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizSubmitted(true);
                            toast.success("Exam Grading Completed!");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-[0.98]"
                        >
                          Finish & Submit
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback Blueprint Frame Node */
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-sm mx-auto space-y-3 shadow-2xs transition-colors">
                    <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto animate-pulse" />
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                      No quiz sheets generated for this workbook context path.
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
