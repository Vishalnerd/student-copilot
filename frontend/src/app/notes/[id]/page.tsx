"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoteById, getChatHistory } from "@/services/noteApi";
import { streamChat } from "@/services/noteApi";
import { generateSummary } from "@/services/aiApi";
import { generateFlashcards } from "@/services/aiApi";
import { Note } from "@/types/note";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar";

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
  Menu,
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

  // 📱 Simplified viewport views tracking active layout columns responsively
  const [viewMode, setViewMode] = useState<"chat" | "text">("chat");
  const [showFullText, setShowFullText] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

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

    const chatId = `chat-${Date.now()}`;

    setChats((prev) => [
      ...prev,
      {
        _id: chatId,
        question: userPrompt,
        answer: "",
      },
    ]);

    let streamedAnswer = "";

    try {
      await streamChat(
        note._id,
        userPrompt,
        (token) => {
          streamedAnswer += token;
          setChats((prev) => {
            return prev.map((chat) =>
              chat._id === chatId
                ? {
                  ...chat,
                  answer: streamedAnswer,
                }
                : chat
            );
          });

          chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }
      );
      toast.success("Response complete");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
        "AI failed to respond"
      );
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

  // 💡 Redirection hook firing perfectly after network generation completes
  const handleGenerateFlashcards = async () => {
    if (!note || isProcessing) return;
    setLoadingFlashcards(true);

    try {
      await generateFlashcards(note._id);
      toast.success("Flashcard Deck Compiled! Redirecting... 🧠");

      // Navigate users directly out to the dedicated main flashcards layout dashboard page
      router.push("/flashcards");
    } catch (error) {
      toast.error("Failed to generate flashcards");
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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        <div className="flex flex-1 flex-col bg-white dark:bg-slate-900 transition-colors duration-200 ml-0 lg:ml-64">
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

          {/* Workspace Header Panel */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-4 py-4 sm:px-6 transition-colors duration-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  disabled={isProcessing}
                  onClick={() => router.push("/notes")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 transition disabled:pointer-events-none disabled:opacity-40 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="truncate text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100">
                  {note.fileName || "Untitled Document"}
                </h2>
              </div>

              {/* Tabs Controller Layout */}
              <div className="flex w-full overflow-x-auto rounded-xl border border-slate-200/40 dark:border-gray-700/60 bg-slate-100 dark:bg-slate-800 p-1 shadow-inner md:w-auto">
                <button
                  onClick={() => setViewMode("chat")}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${viewMode === "chat"
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-2xs"
                      : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  AI Copilot
                </button>

                {/* 📱 Mobile Responsive View Selector Toggle */}
                <button
                  onClick={() => setViewMode("text")}
                  className={`lg:hidden flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${viewMode === "text"
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-2xs"
                      : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Source Text
                </button>
              </div>
            </div>
          </div>

          {/* Core Workspace Layout Panel Grid */}
          <div className="flex flex-1 overflow-hidden">
            {/* 🖥️ Desktop Permanent Component Views */}
            <div className="hidden lg:flex flex-shrink-0 border-r border-gray-100 dark:border-gray-800">
              <ExtractedTextSidebar content={note.content} />
            </div>

            {/* 📱 Responsive Workspace Dynamic Routing Engine */}
            <div className="flex min-w-0 flex-1 flex-col bg-slate-50/30 dark:bg-slate-900/20">
              {/* 💡 Mobile Text View Tab Panel with Global Scope Truncation */}
              {viewMode === "text" && (
                <div className="flex-1 overflow-y-auto p-4 lg:hidden animate-in fade-in duration-200">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-xs flex flex-col">
                    <h3 className="text-xs font-mono font-bold mb-3 uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Extracted Note Content
                    </h3>

                    <div className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                      <p>
                        {note.content && note.content.length > 600 && !showFullText
                          ? `${note.content.slice(0, 600)}...`
                          : note.content}
                      </p>

                      {note.content && note.content.length > 600 && (
                        <button
                          onClick={() => setShowFullText(!showFullText)}
                          className="mt-3 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer self-start"
                        >
                          {showFullText ? "See Less" : "See More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === "chat" && (
                <ChatTerminal
                  disabledInput={isProcessing}
                  chats={chats}
                  chatEndRef={chatEndRef}
                  handleCopy={handleCopy}
                  askingQuestion={askingQuestion}
                />
              )}

              {/* Dock input bar layout panels contextually safely */}
              {viewMode !== "text" && (
                <ActionDockPanel
                  question={question}
                  setQuestion={setQuestion}
                  handleAsk={handleAsk}
                  handleSummary={handleSummary}
                  handleGenerateFlashcards={handleGenerateFlashcards}
                  askingQuestion={askingQuestion}
                  loadingSummary={loadingSummary}
                  loadingFlashcards={loadingFlashcards}
                  viewMode="chat"
                  disabled={isProcessing}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}