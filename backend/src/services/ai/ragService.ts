import Note from "../../models/note";
import { vectorSearch } from "./vectorSearch";
import { generateEmbeddingCached } from "./embeddingService";

export const buildRagPrompt = async (
  noteId: string,
  userId: string,
  question: string
) => {

  try{
   
  const embedding = await  generateEmbeddingCached(question);

  const note = await Note.findOne({
    _id: noteId,
    userId,
  });

  if (!note) {
    throw new Error("Note not found");
  }

 const chunks = await vectorSearch(
    embedding,
    noteId,
    userId
);

const context = chunks
    .map(chunk => chunk.content)
    .join("\n\n");

  return {
    prompt: `You are a study AI assistant.

Rules:

1. Answer ONLY from the context.
2. If the answer isn't in the context, say "I don't know."
3. Combine information from multiple chunks when needed.

Question:

${question}

Context:

${context}`,

    chunksUsed: Math.min(chunks.length, 5),

    note,
  };
}catch (error) {
  console.error("Error in buildRagPrompt:", error);
  throw error;
}
};

