"use client";

import { useState, useEffect, useRef } from "react";
import { uploadNote } from "@/services/noteApi";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Progress } from "@/types/Progress";
import { subscribeToProgress } from "@/services/progressApi";
import Link from "next/link";
import {
  CloudUpload,
  FileText,
  Info,
  ShieldAlert,
  Sparkles,
  Plus,
  Loader2,
  CheckCircle2,
  X,
  Menu,
  Scissors,
  Brain,
  Database,
  CircleAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Strictly handles HTTP upload phase
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  const router = useRouter();

  // 🛡️ LIFECYCLE MANAGEMENT: EventSource ref to ensure clean close on unmount
  const eventSourceRef = useRef<any | null>(null);

  // Auto-cleanup socket connections if the component drops out of memory
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Centralized processing lockout flag to freeze the interactive UI sandbox
  const isProcessing = loading || (progress !== null && progress.status !== "failed" && progress.status !== "completed");

  // Dynamic icon state matrix reflecting current parsing phases
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
      case "extracting":
        return <FileText className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "chunking":
        return <Scissors className="w-4 h-4 text-indigo-500 animate-pulse" />;
      case "embedding":
        return <Brain className="w-4 h-4 text-purple-500 animate-pulse" />;
      case "saving":
        return <Database className="w-4 h-4 text-emerald-500 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "failed":
        return <CircleAlert className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const handleUpload = async () => {
    if (!file || isProcessing) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      setLoading(true);

      // Initialize an immediate deterministic queuing state before SSE fires
      setProgress({
        progress: 0,
        message: "Queueing workbook background tasks...",
        status: "queued"
      });

      const response = await uploadNote(file);
      const noteId = response.note._id;

      // 🚀 REST UPLOAD SUCCESS: Reset HTTP loading to release the primary button state
      setLoading(false);
      setFile(null);

      // Open persistent SSE channel and keep hook pointer reference
      eventSourceRef.current = subscribeToProgress(
        noteId,

        (progressUpdate) => {
          setProgress(() => progressUpdate);
        },
        () => {
          // Explicit completion state mapping handles 100% boundary criteria
          setProgress({
            progress: 100,
            message: "AI Processing Completed. Knowledge base successfully compiled!",
            status: "completed"
          });
          toast.success("PDF analysis complete! 🎉");

          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
        }
      );

      toast.success("Multipart upload successful! Beginning async parsing pipeline.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
      console.error(error);
      setLoading(false);
      setProgress(null);
    }
  };

  const handleResetWorkspace = () => {
    setProgress(null);
    setFile(null);
    setLoading(false);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Only PDF files are allowed");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        <div className="flex-1 ml-0 lg:ml-64 flex flex-col bg-slate-50 dark:bg-slate-900/40 overflow-y-auto min-h-screen transition-colors duration-200">
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

          <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                  Upload Study Materials
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                  Our AI will analyze your PDFs to create summaries, flashcards, and practice quizzes in seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-4 w-full">

                  {/* 💡 Progress Card with Dynamic Error/Success State Handling */}
                  {progress && (
                    <div
                      className={`rounded-2xl border p-5 bg-white dark:bg-slate-800/80 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300 transition-colors ${progress.status === "failed"
                        ? "border-red-200 dark:border-red-950/50 bg-red-50/20 dark:bg-red-950/10"
                        : progress.status === "completed"
                          ? "border-emerald-200 dark:border-emerald-950/50 bg-emerald-50/10 dark:bg-emerald-950/5"
                          : "border-gray-200 dark:border-gray-800"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                          {getStatusIcon(progress.status)}
                          {progress.status === "failed" && "Processing Pipeline Failed"}
                          {progress.status === "completed" && "AI Processing Completed!"}
                          {progress.status === "queued" && "Staging Background Jobs"}
                          {progress.status !== "failed" && progress.status !== "completed" && progress.status !== "queued" && "Processing Study Document"}
                        </h3>
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${progress.status === "failed"
                          ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                          : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          }`}>
                          {Math.round(progress.progress)}%
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                        {progress.message || "Parsing document structural components..."}
                      </p>

                      <div className="mt-4 h-2 w-full rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${progress.status === "failed"
                            ? "bg-red-500 dark:bg-red-600"
                            : progress.status === "completed"
                              ? "bg-emerald-500 dark:bg-emerald-600"
                              : "bg-blue-600 dark:bg-blue-500"
                            }`}
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>

                      {/* 💡 Contextual Post-Processing CTA Handles */}
                      {progress.status === "completed" && (
                        <div className="mt-5 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                          <button
                            onClick={() => router.push("/notes")}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-[0.98]"
                          >
                            Go to Notes
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleResetWorkspace}
                            className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
                          >
                            Upload Another File
                          </button>
                        </div>
                      )}

                      {progress.status === "failed" && (
                        <div className="mt-5 animate-in fade-in zoom-in-95 duration-200">
                          <button
                            onClick={handleResetWorkspace}
                            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-[0.98]"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry Staging Area
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Drag-and-drop interaction surface */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center transition flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px] w-full ${dragActive
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : file
                        ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800/80 hover:border-gray-300 dark:hover:border-gray-700"
                      } ${isProcessing ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    {file ? (
                      <div className="max-w-md w-full flex flex-col items-center animate-in fade-in duration-300 px-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-100/40 dark:border-emerald-900/40 shadow-sm">
                          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100 truncate max-w-[240px] sm:max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        <button
                          disabled={isProcessing}
                          onClick={() => setFile(null)}
                          className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100/40 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center max-w-sm px-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative border border-blue-100/50 dark:border-blue-900/30 shadow-xs">
                          <CloudUpload className="w-6 h-6 sm:w-7 sm:h-7" />
                          <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 text-blue-500 dark:text-blue-400 p-1 rounded-md shadow-sm">
                            <FileText className="w-3 h-3" />
                          </div>
                        </div>

                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                          Drag and drop your notes here
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1.5 leading-relaxed text-center">
                          Support for scanned documents, lecture slides, and handwritten notes (PDF only).
                        </p>

                        <label
                          htmlFor="file-input"
                          className="mt-6 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          Browse Files
                        </label>
                      </div>
                    )}

                    <input
                      type="file"
                      accept=".pdf"
                      disabled={isProcessing}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-input"
                    />
                  </div>

                  {file && (
                    <button
                      onClick={handleUpload}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-bold text-sm py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading Document to Server Staging...
                        </>
                      ) : (
                        <>🚀 Upload & Analyze Note Structure</>
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-2xs transition-colors">
                    <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200 font-bold text-sm mb-4">
                      <div className="p-1 bg-blue-50 dark:bg-slate-900 rounded-md text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                        <Info className="w-4 h-4" />
                      </div>
                      <h3>Upload Guidelines</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">PDF Format Only</h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            We currently only support PDF files for high-accuracy parsing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">Max 5MB per file</h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            Large textbooks might take a bit longer to process.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">Handwriting Support</h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            Clear, high-contrast scans of handwritten notes work best.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-slate-800/40 border border-blue-100/60 dark:border-gray-800 rounded-2xl p-5 shadow-2xs relative overflow-hidden transition-colors">
                    <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400 flex items-center gap-1.5">
                      AI Suggestion
                    </h3>
                    <p className="text-xs font-medium text-blue-800/90 dark:text-slate-300 leading-relaxed mt-2.5">
                      "Uploading your syllabus alongside your lecture notes helps our AI better categorize topics and predict exam questions."
                    </p>
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition mt-4"
                    >
                      Learn how it works <span className="text-xs">→</span>
                    </Link>

                    <div className="absolute right-2 bottom-2 text-blue-100 dark:text-slate-700/40 pointer-events-none opacity-40">
                      <Sparkles className="w-12 h-12 stroke-[1]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}