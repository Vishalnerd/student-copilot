export interface ChatMessage {
  _id: string;
  question: string | null;
  answer: string | null;
  isWelcome?: boolean;
}