import { api } from "@/lib/axios";
import { ChatHistoryItem, ChatMessage } from "@/types/chat";

export const getChatHistory = async () => {
  const res = await api.get<ChatHistoryItem[]>("/chat/history");
  return res.data;
};

export const getRecentChatHistory = async () => {
  const res = await api.get("/chat/recent");
  return res.data;
}

export const getChatsByNote = async (noteId: string) => {
  const res = await api.get<ChatMessage[]>(`/chat/${noteId}`);
  return res.data;
};

export const deleteChatHistory = async (noteId: string) => {
  const res = await api.delete(`/chat/${noteId}`);
  return res.data;
};