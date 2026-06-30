import {api} from "@/lib/axios";

export const generateSummary = async (
    id: string
) => {

    const response =
        await api.post(
            `/ai/${id}/summary`
        );

    return response.data;
};

export const generateFlashcards = async (noteId: string) => {
  try {
    const response = await api.post(`/ai/${noteId}/flashcards`);
    return response.data;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

export const getFlashcards = async () => {
  try {
    const response = await api.get(`/ai/flashcards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

export const generateQuiz = async (noteId: string) => {
    try {
        const response = await api.post(`/ai/${noteId}/quiz`);
        return response.data;
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw error;
    }
};

export const getQuizzes = async () => {
    try {
        const response = await api.get(`/ai/quizzes`);
    return response.data;
}catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
}
};

export const getRecentChats = async () => {
    try {
        const response = await api.get(`/ai/recent`);
    return response.data;
}catch (error) {
    console.error('Error fetching recent chats:', error);
    throw error;
}
};

