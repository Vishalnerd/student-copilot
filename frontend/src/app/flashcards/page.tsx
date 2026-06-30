"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Sidebar from "@/app/components/layout/Sidebar";
import Navbar from "@/app/components/layout/Navbar";
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

  // Grouping individual cards by their parent Note ID natively
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
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Main Application Sidebar Linkage */}
        <Sidebar />

        <div className="flex-1 ml-64 flex flex-col bg-background overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-8">
            {/* Page Header Introduction */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <BrainCircuit className="w-6 h-6 text-blue-600" />
                  Study Mode Deck Registry
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Review generated flashcards to strengthen your long-term
                  memory metrics.
                </p>
              </div>

              {selectedNoteId && (
                <button
                  onClick={() => setSelectedNoteId(null)}
                  className="text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-200 text-gray-700 rounded-xl transition cursor-pointer self-start md:self-auto"
                >
                  ← Back to All Decks
                </button>
              )}
            </div>

            {/* LOADING STATE BOUNDARY */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-slate-50 animate-pulse border border-gray-100 rounded-2xl"
                  />
                ))}
              </div>
            ) : selectedNoteId ? (
              /* ACTIVE STUDY BLOCK VIEWPORT */
              <div className="space-y-6 max-w-xl mx-auto w-full py-6">
                <div className="text-center bg-blue-50/40 border border-blue-100 rounded-xl p-3 mb-2">
                  <span className="text-[9px] font-mono font-black text-blue-600 tracking-widest uppercase">
                    Currently Practicing
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 truncate max-w-md mx-auto mt-0.5">
                    {selectedNoteTitle}
                  </h3>
                </div>
                <FlashcardList flashcards={activeDeckCards} />
              </div>
            ) : decksArray.length === 0 ? (
              /* REGISTRY DRY EMPTY FALLBACK WINDOW */
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-slate-50 border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    No Flashcard Decks Found
                  </h3>
                  <p className="text-xs text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                    Decks will appear here automatically once generated inside
                    your notebook worklogs.
                  </p>
                </div>
              </div>
            ) : (
              /* COMPILED GRID SELECTOR GRID LIST */
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">
                  Available Study Sessions ({decksArray.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decksArray.map((deck) => (
                    <div
                      key={deck.noteId}
                      onClick={() => {
                        setSelectedNoteId(deck.noteId);
                        setSelectedNoteTitle(deck.title);
                      }}
                      className="bg-white dark:bg-slate-900/50 border border-gray-200/80 dark:border-gray-800 hover:border-blue-500 rounded-2xl p-5 shadow-3xs hover:shadow-md group transition-all duration-200 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl border border-blue-100/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground truncate pr-2 group-hover:text-blue-600 transition-colors">
                            {deck.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
                            {deck.cards.length} Mastery Flashcards Compiled
                          </p>
                        </div>
                      </div>

                      <div className="p-1 bg-slate-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 rounded-lg border border-gray-100 transition-all ml-2">
                        <ChevronRight className="w-4 h-4" />
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
