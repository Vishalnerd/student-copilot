export interface ActionDockPanelProps {
  question: string;
  setQuestion: (q: string) => void;
  handleAsk: () => void;
  handleSummary: () => void;
  handleGenerateFlashcards: () => void;
  askingQuestion: boolean;
  loadingSummary: boolean;
  loadingFlashcards: boolean;
  viewMode: "chat" | "flashcards";
  disabled: boolean; // 💡 Added to manage button states during async operations
}