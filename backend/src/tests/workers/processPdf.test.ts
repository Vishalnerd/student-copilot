import mongoose from "mongoose";
import Note from "../../models/note";
import NoteChunk from "../../models/NoteChunk";
import { processPdf } from "../../jobs/pdfProcessor"; 
import extractPdfText from "../../utils/extractPdfText";
import { generateBatchEmbeddingsWithRetry } from "../../services/ai/embeddingService";
import { progressManager } from "../../services/bullmq/progressManager";

// 💡 Fix the keyPrefix crash by providing a structurally compatible ioredis mock
jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      options: { keyPrefix: "" }, // ⚡ This satisfies BullMQ's constructor inspection safely!
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue("OK"),
    };
  });
});

// Mock out heavy extraction operations, progress dispatchers and remote network APIs
jest.mock("../../utils/extractPdfText");
jest.mock("../../services/ai/embeddingService");
jest.mock("../../services/bullmq/progressManager", () => ({
  progressManager: {
    send: jest.fn(),
    get: jest.fn().mockReturnValue({ status: "processing" }),
  },
}));

const mockedExtract = extractPdfText as jest.Mock;
const mockedBatchEmbedding = generateBatchEmbeddingsWithRetry as jest.Mock;

describe("BullMQ Worker: processPdf() Pipeline", () => {
  let targetNoteId: string;
  let mockUserId: string;

  beforeEach(async () => {
    await Note.deleteMany({});
    await NoteChunk.deleteMany({});
    jest.clearAllMocks();

    mockUserId = new mongoose.Types.ObjectId().toString();
    
    // Create pre-staged note shell inside test sandbox database
    const note = await Note.create({
      userId: mockUserId,
      fileName: "sample.pdf",
      filePath: "/uploads/sample.pdf",
      status: "processing",
    });
    
    targetNoteId = (note._id).toString();
  });

  it("should extract pdf text, break chunks, calculate vectors and save fragments successfully", async () => {
    mockedExtract.mockResolvedValue("This is Java. Java is OOP.");
    mockedBatchEmbedding.mockResolvedValue([[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]); 

    // Invoke standalone compute worker algorithm directly bypass HTTP router layers
    await processPdf(targetNoteId);

    // 1. Verify structural source Note properties updated
    const updatedNote = await Note.findById(targetNoteId);
    expect(updatedNote!.status).toBe("completed");
    expect(updatedNote!.content).toContain("Java");

    // 2. Verify collection splits compiled
    const chunks = await NoteChunk.find({ noteId: targetNoteId });
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].content).toBeTruthy();
    expect(chunks[0].embedding).toEqual(expect.any(Array));

    // 3. Verify socket progression stream checkpoints fired
    expect(progressManager.send).toHaveBeenCalledWith(
      targetNoteId,
      expect.objectContaining({ status: "completed", progress: 100 })
    );
  });

  it("should update note status field to failed when extraction hits an error block", async () => {
    mockedExtract.mockRejectedValue(new Error("PDF Error"));
    
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(processPdf(targetNoteId)).rejects.toThrow("PDF Error");

    const failedNote = await Note.findById(targetNoteId);
    expect(failedNote!.status).toBe("failed");
    
    expect(progressManager.send).toHaveBeenCalledWith(
      targetNoteId,
      expect.objectContaining({ status: "failed" })
    );

    spy.mockRestore();
  });

  it("should update note status field to failed when embedding calculations blow up", async () => {
    mockedExtract.mockResolvedValue("Valid text output paragraphs");
    mockedBatchEmbedding.mockRejectedValue(new Error("Embedding Error"));

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(processPdf(targetNoteId)).rejects.toThrow("Embedding Error");

    const failedNote = await Note.findById(targetNoteId);
    expect(failedNote!.status).toBe("failed");

    expect(progressManager.send).toHaveBeenCalledWith(
      targetNoteId,
      expect.objectContaining({ status: "failed" })
    );

    spy.mockRestore();
  });
});