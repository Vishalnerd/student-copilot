"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
import MobileSidebar from "@/app/components/layout/MobileSIdebar"; // Casing matched with your layout folder typo
import FlashcardList from "@/app/components/flashcards/FlashcardList";
import FlashcardSkeleton from "@/app/components/flashcards/FlashcardSkeleton";
import { getFlashcards } from "@/services/aiApi";
import toast from "react-hot-toast";
import {
  Layers,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  HelpCircle,
  Menu, // Imported for the mobile menu trigger action
} from "lucide-react";
import { Flashcard } from "@/types/flashcard";

export default function GlobalFlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  // Track which deck/note is currently selected for live active recall testing
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteTitle, setSelectedNoteTitle] = useState<string>("");

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        const data = await getFlashcards();
        setFlashcards(data.flashcards || data);
      } catch (error) {
        toast.error("Failed to load your study decks");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCards();
  }, []);

  // 💡 Grouping individual cards by their parent Note ID cleanly
  const groupedDecks = flashcards.reduce(
    (acc, card: any) => {
      // 1. Safe extraction: check if noteId is populated as an object or a flat string identifier
      const key =
        card.noteId && typeof card.noteId === "object"
          ? card.noteId._id
          : card.noteId;

      if (!key) return acc; // Skip orphaned cards safely

      if (!acc[key]) {
        // 2. Extract your camelCase fileName property from the populated object context
        const dynamicTitle =
          (card.noteId &&
            typeof card.noteId === "object" &&
            card.noteId.fileName) ||
          card.noteTitle ||
          "Untitled Document Deck";

        acc[key] = {
          noteId: key,
          title: dynamicTitle,
          cards: [],
        };
      }

      acc[key].cards.push(card);
      return acc;
    },
    {} as Record<string, { noteId: string; title: string; cards: Flashcard[] }>,
  );

  const decksArray = Object.values(groupedDecks);
  const activeDeckCards = selectedNoteId
    ? groupedDecks[selectedNoteId]?.cards
    : [];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen overflow-hidden bg-background">
        <Sidebar />

        {/* Main Content Canvas */}
        {/* 💡 Note: Adjusted to 'ml-0 lg:ml-64' to complement structural grid breakouts smoothly on smaller break targets */}
        <div className="flex flex-1 flex-col bg-background ml-0 lg:ml-64 transition-colors duration-200">
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

          <main className="mx-auto flex-1 w-full max-w-5xl overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  <BrainCircuit className="h-6 w-6 text-blue-600" />
                  Study Mode Deck Registry
                </h1>

                <p className="text-xs sm:text-sm font-medium text-gray-400">
                  Review generated flashcards to strengthen your long-term
                  memory metrics.
                </p>
              </div>

              {selectedNoteId && (
                <button
                  onClick={() => setSelectedNoteId(null)}
                  className="self-start rounded-xl border border-gray-200 bg-slate-100 dark:bg-slate-800 dark:border-gray-700 dark:text-slate-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-slate-200 dark:hover:bg-slate-700 md:self-auto"
                >
                  ← Back to All Decks
                </button>
              )}
            </div>

            {/* Loading Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-800/40"
                  />
                ))}
              </div>
            ) : selectedNoteId ? (
              /* Flashcards Viewer Panel */
              <div className="mx-auto w-full max-w-xl space-y-6 py-4 sm:py-6">
                <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-3 text-center">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    Currently Practicing
                  </span>

                  <h3 className="mx-auto mt-1 max-w-md truncate text-sm font-bold text-gray-900 dark:text-slate-100">
                    {selectedNoteTitle}
                  </h3>
                </div>

                <FlashcardList flashcards={activeDeckCards} />
              </div>
            ) : decksArray.length === 0 ? (
              /* Empty Fallback Wrapper Layout */
              <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-8 sm:p-12 text-center shadow-3xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700 bg-slate-50 dark:bg-slate-900 text-gray-400 dark:text-gray-500">
                  <Layers className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                    No Flashcard Decks Found
                  </h3>

                  <p className="mx-auto max-w-[280px] text-xs font-medium leading-relaxed text-gray-400 dark:text-gray-500">
                    Decks will appear here automatically once generated inside
                    your notebook worklogs.
                  </p>
                </div>
              </div>
            ) : (
              /* Deck List Matrix Grid Selection */
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Available Study Sessions ({decksArray.length})
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {decksArray.map((deck) => (
                    <div
                      key={deck.noteId}
                      onClick={() => {
                        setSelectedNoteId(deck.noteId);
                        setSelectedNoteTitle(deck.title);
                      }}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-slate-900/30 p-4 sm:p-5 shadow-3xs transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 dark:border-blue-900/30 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-blue-400">
                          <BookOpen className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <h3 className="truncate pr-2 text-sm font-bold text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {deck.title}
                          </h3>

                          <p className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                            <HelpCircle className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
                            {deck.cards.length} Mastery Flashcards Compiled
                          </p>
                        </div>
                      </div>

                      <div className="ml-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-slate-50 dark:bg-slate-800 p-1 text-gray-400 transition-all group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
