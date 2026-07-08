import mongoose from "mongoose";
import NoteChunk from "../../models/NoteChunk";

export const vectorSearch = async (
  embedding: number[],
  noteId: string,
  userId: string
) => {
  return NoteChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 100,
        limit: 5,

        filter: {
          noteId: new mongoose.Types.ObjectId(noteId),
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
    },

    {
      $project: {
        content: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);
};