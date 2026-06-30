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
              answer: `Hello! I've analyzed **${noteData.fileName}**. This document focuses heavily on process scheduling, deadlocks, and virtual memory. How can I help you study today?`,
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
    if (!question.trim() || !note) return;

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
    if (!note) return;
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
    if (!note) return;
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
        <div className="flex bg-background text-foreground transition-colors duration-200">
          <Sidebar />
          <div className="flex-1 ml-64 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-mono font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                Analyzing Document Blocks...
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  /* 2. EMPTY WORKSPACE FALLBACK VIEW */
  if (!note) {
    return (
      <ProtectedRoute>
        <div className="flex bg-background text-foreground transition-colors duration-200">
          <Sidebar />
          <div className="flex-1 ml-64 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
            <Navbar />
            <main className="p-8 max-w-md mx-auto text-center mt-20">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xs">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                  Document Registry Empty
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  The note workspace you are trying to visit does not exist.
                </p>
                <button
                  onClick={() => router.push("/notes")}
                  className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        <div className="flex-1 ml-64 flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
          {/* Workspace Action Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-6 py-3.5 flex items-center justify-between transition-colors duration-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/notes")}
                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate max-w-xs">
                {note.fileName || "Untitled Document"}
              </h2>
            </div>

            {/* View Mode Tabs Selector Wrapper */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200/40 dark:border-gray-700/60 shadow-inner">
              <button
                onClick={() => setViewMode("chat")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "chat"
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-2xs border border-gray-200/50 dark:border-gray-600/30"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                AI Copilot
              </button>
              <button
                onClick={() => {
                  if (flashcards.length === 0 && !loadingFlashcards) {
                    handleGenerateFlashcards();
                  } else {
                    setViewMode("flashcards");
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "flashcards"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs border border-gray-200/50 dark:border-gray-600/30"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Study Flashcards
                {flashcards.length > 0 && (
                  <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-black px-1.5 py-0.5 text-[9px] rounded-md border border-blue-100 dark:border-blue-900/40">
                    {flashcards.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Workspace Body Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Ensure your ExtractedTextSidebar component handles inner dark:bg adjustments */}
            <ExtractedTextSidebar content={note.content} />

            <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-900/20 overflow-hidden transition-colors duration-200">
              {viewMode === "flashcards" ? (
                <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center min-h-0">
                  {loadingFlashcards ? (
                    <FlashcardSkeleton />
                  ) : (
                    <div className="space-y-4 max-w-xl mx-auto w-full">
                      <div className="text-center mb-2">
                        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100 dark:fill-amber-950/20" />
                          Interactive Study Deck
                        </h3>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                          Test your active recall mastery retention blocks
                        </p>
                      </div>
                      <FlashcardList flashcards={flashcards} />
                    </div>
                  )}
                </div>
              ) : (
                <ChatTerminal
                  chats={chats}
                  chatEndRef={chatEndRef}
                  handleCopy={handleCopy}
                />
              )}

              {/* Bottom Input Dock Panel */}
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
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
