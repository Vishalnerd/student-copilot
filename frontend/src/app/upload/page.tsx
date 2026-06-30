"use client";

import { useState } from "react";
import { uploadNote } from "@/services/noteApi";
import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CloudUpload,
  FileText,
  Info,
  ShieldAlert,
  Sparkles,
  Plus,
  MoreVertical,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const router = useRouter();
  // Mocking recent uploads state to reflect the UI blueprint completely
  const recentUploads = [
    { id: "1", name: "Macroeconomics_C...", time: "Uploaded 2h ago" },
    { id: "2", name: "Cell_Biology_Lab.p...", time: "Uploaded Yesterday" },
  ];

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }
    try {
      setLoading(true);
      await uploadNote(file);
      toast.success("File uploaded successfully! 🎉");
      router.push("/notes");
      setFile(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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
      {/* 💡 Upgraded background container using v4 semantic design tokens */}
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        <Sidebar />

        {/* 💡 Fluid canvas shell handling dark-mode background blend filters */}
        <div className="flex-1 ml-64 flex flex-col bg-slate-50 dark:bg-slate-900/40 overflow-y-auto min-h-screen transition-colors duration-200">
          <Navbar />

          <main className="p-8 max-w-7xl mx-auto w-full">
            <div className="space-y-8">
              {/* Header section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                  Upload Study Materials
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Our AI will analyze your PDFs to create summaries, flashcards,
                  and practice quizzes in seconds.
                </p>
              </div>

              {/* Central Main Workspace Split Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Area: Spacious Drag and Drop Interaction Box Component */}
                <div className="lg:col-span-2 space-y-4">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    /* 💡 Dynamic frame changes with modern border mapping variants for v4 dark support */
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition flex flex-col items-center justify-center min-h-[420px] ${
                      dragActive
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                        : file
                          ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10"
                          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800/80 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    {file ? (
                      <div className="max-w-md w-full flex flex-col items-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-100/40 dark:border-emerald-900/40 shadow-sm">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <p className="text-base font-bold text-gray-900 dark:text-slate-100 truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        <button
                          onClick={() => setFile(null)}
                          className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100/40 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center max-w-sm">
                        {/* Cloud Visual Module Accent */}
                        <div className="w-16 h-16 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 relative border border-blue-100/50 dark:border-blue-900/30 shadow-xs">
                          <CloudUpload className="w-7 h-7" />
                          <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 text-blue-500 dark:text-blue-400 p-1 rounded-md shadow-sm">
                            <FileText className="w-3 h-3" />
                          </div>
                        </div>

                        <p className="text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                          Drag and drop your notes here
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1.5 leading-relaxed">
                          Support for scanned documents, lecture slides, and
                          handwritten notes (PDF only).
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
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-input"
                    />
                  </div>

                  {/* Trigger Upload Action */}
                  {file && (
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-bold text-sm py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing & Analyzing Document...
                        </>
                      ) : (
                        <>🚀 Upload & Analyze Note Structure</>
                      )}
                    </button>
                  )}
                </div>

                {/* Right Area: Contextual Guidelines & Assistant Tips Sidebar Stack */}
                <div className="space-y-4">
                  {/* Guidelines Box Wrapper */}
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
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">
                            PDF Format Only
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            We currently only support PDF files for
                            high-accuracy parsing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">
                            Max 5MB per file
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            Large textbooks might take a bit longer to process.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-slate-100">
                            Handwriting Support
                          </h4>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">
                            Clear, high-contrast scans of handwritten notes work
                            best.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestion Box Panel wrapper */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-slate-800/40 border border-blue-100/60 dark:border-gray-800 rounded-2xl p-5 shadow-2xs relative overflow-hidden transition-colors">
                    <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400 flex items-center gap-1.5">
                      AI Suggestion
                    </h3>
                    <p className="text-xs font-medium text-blue-800/90 dark:text-slate-300 leading-relaxed mt-2.5">
                      "Uploading your syllabus alongside your lecture notes
                      helps our AI better categorize topics and predict exam
                      questions."
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
