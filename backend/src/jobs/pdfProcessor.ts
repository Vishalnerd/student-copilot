import Note from "../models/note";
import NoteChunk from "../models/NoteChunk";
import fs from "fs/promises";
import extractPdfText from "../utils/extractPdfText";
import chunkText from "../utils/chunkText";

import {
  generateBatchEmbeddingsWithRetry,
} from "../services/ai/embeddingService";
import {downloadPdf} from "../utils/downloadPdf";
import { progressManager } from "../services/bullmq/progressManager";

export const processPdf = async (noteId: string) => {
  console.log(`📄 Processing note ${noteId}`);

  const note = await Note.findById(noteId);
  if (!note) {
    throw new Error("Note not found");
  }

  try {
    progressManager.send(noteId, {
      status: "extracting",
      progress: 5,
      message: "Extracting PDF...",
    });
    
    console.log(`📄 Extracting text from note ${noteId}`);
    const tempFilePath = await downloadPdf(note.fileUrl, noteId);
    const content = await extractPdfText(tempFilePath);
    await fs.unlink(tempFilePath);
    progressManager.send(noteId, {
      status: "chunking",
      progress: 20,
      message: "Chunking PDF...",
    });
    
    console.log(`📄 Chunking text for note ${noteId}`);
    
    const chunks = chunkText(content);

    progressManager.send(noteId, {
      status: "embedding",
      progress: 30,
      message: "Generating embeddings...",
    });
    

    // 💡 Changed type to explicit document properties to bypass required timestamp checks
    const chunkDocuments: Array<{
      noteId: any;
      userId: any;
      chunkIndex: number;
      content: string;
      embedding: number[];
    }> = [];
    
    console.log(`📄 Generating batch embeddings for note ${noteId} (Total Chunks: ${chunks.length})`);
    
    // Configured optimal batch size for Jina free tier limits
    const BATCH_SIZE = 25; 

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const currentBatch = chunks.slice(i, i + BATCH_SIZE);
      
      // Fetch vectors for 25 chunks simultaneously in 1 network call
      const embeddings = await generateBatchEmbeddingsWithRetry(currentBatch);

      // Map vectors back to original document layout structure
      currentBatch.forEach((chunk, index) => {
        const globalIndex = i + index;
        chunkDocuments.push({
          noteId: note._id as any,
          userId: note.userId as any,
          chunkIndex: globalIndex,
          content: chunk,
          embedding: embeddings[index],
        });
      });

      // Update progress gracefully based on the processing batch index count
      const processedCount = Math.min(i + BATCH_SIZE, chunks.length);
      progressManager.send(noteId, {
        status: "embedding",
        progress: 30 + (processedCount / chunks.length) * 50,
        message: `Embedding ${processedCount}/${chunks.length}`,
      });
    }

    await NoteChunk.deleteMany({ noteId: note._id });
    
    progressManager.send(noteId, {
      status: "saving",
      progress: 90,
      message: "Saving vectors...",
    });
    
    console.log(`📄 Saving embeddings for note ${noteId}`);
    
    await NoteChunk.insertMany(chunkDocuments);
    
    progressManager.send(noteId, {
      status: "completed",
      progress: 100,
      message: "Completed",
    });
    setTimeout(() => {
    progressManager.clear(noteId);
    }, 10000);
    

    await Note.findByIdAndUpdate(note._id, {
      content,
      status: "completed",
    });

  } catch (error) {
    progressManager.send(noteId, {
      status: "failed",
      progress: 100,
      message: "Processing failed",
    });
    
    
    await Note.findByIdAndUpdate(note._id, {
      status: "failed",
    });

    throw error;
  }
};