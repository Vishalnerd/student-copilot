export interface ChatHistoryItem {
  noteId: string;
  fileName: string;
  questionCount: number;
  lastQuestion: string;
  lastAnswer: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface RecentChat {
    _id:string;
    question:string;
    noteId:string;
    fileName:string;
    createdAt:string;
}