"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoteById, askQuestion, getChatHistory } from "@/services/noteApi";
import { generateSummary } from "@/services/aiApi";
import { generateFlashcards } from "@/services/aiApi";
import { Note } from "@/types/note";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar"; // Casing matched with your layout folder
import FlashcardList from "../../components/flashcards/FlashcardList";
import FlashcardSkeleton from "../../components/flashcards/FlashcardSkeleton";

// Modular Sub-Components
import ExtractedTextSidebar from "@/app/components/notes/ExtractedTextSidebar";
import ChatTerminal from "@/app/components/notes/ChatTerminal";
import ActionDockPanel from "@/app/components/notes/ActionDockPanel";

import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Loader2,
  MessageSquare,
  Layers,
  Sparkles,
  Menu, // Imported for the mobile menu trigger action
} from "lucide-react";

export default function NoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [askingQuestion, setAskingQuestion] = useState(false);

  const [viewMode, setViewMode] = useState<"chat" | "flashcards">("chat");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  // 💡 Centralized processing flag to lock all interactive pathways uniformly
  const isProcessing = askingQuestion || loadingSummary || loadingFlashcards;

  useEffect(() => {
    const fetchNoteAndHistory = async () => {
      if (!params.id) return;
      try {
        const [noteData, chatHistory] = await Promise.all([
          getNoteById(params.id as string),
          getChatHistory(params.id as string),
        ]);
        setNote(noteData);

        if (chatHistory.length === 0) {
          setChats([
            {
              _id: "welcome",
              isWelcome: true,
              answer: `Hello! I've analyzed **${noteData.fileName}**. How can I help you study today?`,
            },
          ]);
        } else {
          setChats(chatHistory);
        }
      } catch (error) {
        toast.error("Failed to load workbook logs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndHistory();
  }, [params.id]);

  useEffect(() => {
    if (viewMode === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, askingQuestion, viewMode]);

  const handleAsk = async () => {
    if (!question.trim() || !note || isProcessing) return;

    const userPrompt = question.trim();
    setQuestion("");
    setViewMode("chat");
    setAskingQuestion(true);

    const temporaryUserChat = {
      _id: `temp-user-${Date.now()}`,
      question: userPrompt,
      answer: null,
    };

    setChats((prev) => [...prev, temporaryUserChat]);

    try {
      await askQuestion(note._id, userPrompt);
      const updatedChats = await getChatHistory(note._id);
      setChats(updatedChats);
      toast.success("AI response ready");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "AI failed to respond");
      setChats((prev) => prev.filter((c) => c._id !== temporaryUserChat._id));
    } finally {
      setAskingQuestion(false);
    }
  };

  const handleSummary = async () => {
    if (!note || isProcessing) return;
    setLoadingSummary(true);
    setViewMode("chat");

    try {
      const data = await generateSummary(note._id);
      setSummary(data.summary);

      setChats((prev) => [
        ...prev,
        {
          _id: `summary-${Date.now()}`,
          question: "Generate Summary",
          answer: data.summary,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success("Summary generated");
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!note || isProcessing) return;
    setLoadingFlashcards(true);
    setViewMode("flashcards");

    try {
      const data = await generateFlashcards(note._id);
      const cardsDeck = data.flashcards || [];
      setFlashcards(cardsDeck);

      setChats((prev) => [
        ...prev,
        {
          _id: `flashcards-${Date.now()}`,
          question: "Generate Flashcards",
          answer: `✨ Successfully generated **${cardsDeck.length} study flashcards**. You can interact with them directly inside your right workspace tab panel layout!`,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success("Flashcard Deck Compiled");
    } catch (error) {
      toast.error("Failed to generate flashcards");
      setViewMode("chat");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleCopy = async (textToCopy: string) => {
    if (!textToCopy) return;
    const cleanText = textToCopy.replace(/\*\*|\*/g, "");
    try {
      await navigator.clipboard.writeText(cleanText);
      toast.success("Copied to clipboard! 📋");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  /* 1. LOADING TIMELINE STATE */
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
          <Sidebar />

          <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 lg:ml-64">
            <Navbar />

            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Analyzing Document Blocks...
                </p>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  /* 2. EMPTY WORKSPACE FALLBACK VIEW */
  if (!note) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
          <Sidebar />

          <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 lg:ml-64">
            <Navbar />

            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
              <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-6 sm:p-8 text-center shadow-2xs">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />

                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Document Registry Empty
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400 dark:text-gray-500">
                  The note workspace you are trying to visit does not exist.
                </p>

                <button
                  onClick={() => router.push("/notes")}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  /* 3. ACTIVE INTERACTIVE STUDY WORKSPACE */
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        <div className="flex flex-1 flex-col bg-white dark:bg-slate-900 transition-colors duration-200 ml-0 lg:ml-64">
          {/* Connected Navbar containing the responsive MobileSidebar Primitive Trigger */}
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

          {/* Workspace Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-4 py-4 sm:px-6 transition-colors duration-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  disabled={isProcessing}
                  onClick={() => router.push("/notes")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <h2 className="truncate text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100">
                  {note.fileName || "Untitled Document"}
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex w-full overflow-x-auto rounded-xl border border-slate-200/40 dark:border-gray-700/60 bg-slate-100 dark:bg-slate-800 p-1 shadow-inner sm:w-auto">
                <button
                  disabled={isProcessing}
                  onClick={() => setViewMode("chat")}
                  className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-50 ${
                    viewMode === "chat"
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border border-gray-200/50 dark:border-gray-600/30 shadow-2xs"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  AI Copilot
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => {
                    if (flashcards.length === 0 && !loadingFlashcards) {
                      handleGenerateFlashcards();
                    } else {
                      setViewMode("flashcards");
                    }
                  }}
                  className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-50 ${
                    viewMode === "flashcards"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-gray-200/50 dark:border-gray-600/30 shadow-2xs"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Study Flashcards
                  {flashcards.length > 0 && (
                    <span className="rounded-md border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[9px] font-black text-blue-600 dark:text-blue-400">
                      {flashcards.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Workspace Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop Only Side Drawer Content */}
            <div className="hidden lg:block">
              <ExtractedTextSidebar content={note.content} />
            </div>

            {/* Main Workspace Area Layout Engine */}
            <div className="flex min-w-0 flex-1 flex-col bg-slate-50/30 dark:bg-slate-900/20 transition-colors duration-200">
              {viewMode === "flashcards" ? (
                <div className="flex flex-1 flex-col justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
                  {loadingFlashcards ? (
                    <FlashcardSkeleton />
                  ) : (
                    <div className="mx-auto w-full max-w-xl space-y-4">
                      <div className="mb-2 text-center">
                        <h3 className="flex items-center justify-center gap-1.5 text-base font-bold text-gray-900 dark:text-slate-100">
                          <Sparkles className="h-4 w-4 fill-amber-100 text-amber-500 dark:fill-amber-950/20" />
                          Interactive Study Deck
                        </h3>

                        <p className="mt-0.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          Test your active recall mastery retention blocks
                        </p>
                      </div>

                      <FlashcardList flashcards={flashcards} />
                    </div>
                  )}
                </div>
              ) : (
                <ChatTerminal
                  disabledInput={isProcessing}
                  chats={chats}
                  chatEndRef={chatEndRef}
                  handleCopy={handleCopy}
                />
              )}

              <ActionDockPanel
                question={question}
                setQuestion={setQuestion}
                handleAsk={handleAsk}
                handleSummary={handleSummary}
                handleGenerateFlashcards={handleGenerateFlashcards}
                askingQuestion={askingQuestion}
                loadingSummary={loadingSummary}
                loadingFlashcards={loadingFlashcards}
                viewMode={viewMode}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
