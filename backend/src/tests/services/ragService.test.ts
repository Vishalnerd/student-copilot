import mongoose from "mongoose";
import Note from "../../models/note";
import NoteChunk from "../../models/NoteChunk";
import { buildRagPrompt } from "../../services/ai/ragService";
import { generateEmbeddingCached } from "../../services/ai/embeddingService";
import { vectorSearch } from "../../services/ai/vectorSearch"; // Import your search provider

jest.mock("../../services/ai/embeddingService", () => ({
  generateEmbeddingCached: jest.fn(),
}));

// 💡 Fix 1: Mock your vector search database provider file directly
jest.mock("../../services/ai/vectorSearch", () => ({
  vectorSearch: jest.fn(),
}));

const mockCacheEmbedding = generateEmbeddingCached as jest.Mock;
const mockVectorSearch = vectorSearch as jest.Mock;

describe("RAG Engine Service Sandbox: buildRagPrompt()", () => {
  let noteId: mongoose.Types.ObjectId;
  let userId: string;

  beforeEach(async () => {
    await Note.deleteMany({});
    await NoteChunk.deleteMany({});
    jest.clearAllMocks();

    userId = new mongoose.Types.ObjectId().toString();
    noteId = new mongoose.Types.ObjectId();

    mockCacheEmbedding.mockResolvedValue(new Array(1024).fill(0.12));

    await Note.create({
      _id: noteId,
      userId: userId,
      fileName: "computer-science.pdf",
      fileUrl: "/uploads/cs.pdf",
      cloudinaryId: "cs-id",
      status: "completed",
    });
  });

  it("should successfully build a RAG prompt payload matching the found vector chunks", async () => {
    // 💡 Fix 2: Provide required schema attributes (chunkIndex, userId)
    const mockChunks = [
      { content: "Chunk content 1.", chunkIndex: 0, userId, noteId },
      { content: "Chunk content 2.", chunkIndex: 1, userId, noteId },
    ];
    
    // Intercept database pipeline execution layers safely
    mockVectorSearch.mockResolvedValue(mockChunks);

    const result = await buildRagPrompt(noteId.toString(), userId, "Test inquiry string text");

    expect(result).toHaveProperty("prompt");
    expect(result.prompt).toContain("You are a study AI assistant");
    expect(result.prompt).toContain("Chunk content 1.");
    expect(result.chunksUsed).toBe(2);
  });

  it("should cap context window and return up to a max of 5 closest matching data blocks", async () => {
    const bulkChunks = Array.from({ length: 7 }, (_, i) => ({
      noteId,
      userId,
      chunkIndex: i,
      content: `Paragraph block ${i}`,
    }));
    
    mockVectorSearch.mockResolvedValue(bulkChunks);

    const result = await buildRagPrompt(noteId.toString(), userId, "Fetch matching maximum arrays");
    expect(result.chunksUsed).toBeLessThanOrEqual(5);
  });

  it("should throw an validation error when the base reference note does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    await expect(buildRagPrompt(fakeId, userId, "Valid text")).rejects.toThrow("Note not found");
  });

  it("should return clear contextual fallbacks when no relevant chunks match the target question bounds", async () => {
    mockVectorSearch.mockResolvedValue([]); // Simulate clean empty query block match

    const result = await buildRagPrompt(noteId.toString(), userId, "Obscure text question thread");
    expect(result.chunksUsed).toBe(0);
    expect(result.prompt).toContain("Context:\n\n");
  });
});