import NoteChunk from "../../models/NoteChunk";
import { generateEmbedding } from "../ai/embeddingService";

export const retrieveRelevantChunks = async (
  question: string,
  noteId: string,
  userId: string
): Promise<string> => {

  const questionEmbedding =
    await generateEmbedding(question);

  const chunks =
    await NoteChunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: questionEmbedding,
          numCandidates: 100,
          limit: 5,
          filter: {
            noteId: noteId,
            userId: userId,
          },
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

  console.table(chunks);

  return chunks
    .map((chunk) => chunk.content)
    .join("\n\n");
};