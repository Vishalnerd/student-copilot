import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const generateEmbedding = async (
  text: string
): Promise<number[]> => {

  const response =
    await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: text,
    });

  const embedding =
    response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error(
      "Embedding generation failed."
    );
  }

  return embedding;
};