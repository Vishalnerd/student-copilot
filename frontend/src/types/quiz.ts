export interface QuizItem {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizCardProps {
  quiz: QuizItem;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  showReview?: boolean; // Used to reveal answers on the final summary card
}

export interface QuizSummaryProps {
  quizzes?: QuizItem[];
  userAnswers?: Record<string, string>;
  onRetry: () => void;
  onRegenerate: () => void;
  loadingRegen: boolean;
}