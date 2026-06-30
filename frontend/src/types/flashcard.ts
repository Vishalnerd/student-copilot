export interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  noteId: string;
  fileName?: string; // Optional property for the note's title
}