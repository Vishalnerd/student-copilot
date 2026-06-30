import { Note } from "./note";

export interface DashboardData {

  totalNotes: number;

  totalQuestions: number;

  recentNotes: Note[];

  totalFlashcards: number;

  totalQuizzes: number;

}