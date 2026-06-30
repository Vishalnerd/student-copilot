import { Request, Response } from "express";
import Note from "../models/note";
import { generateAIResponse } from "../services/ai/geminiService";
import { generateEmbedding } from "../services/ai/embeddingService";
import NoteChunk from "../models/NoteChunk";
import Chat from "../models/Chat";
import { cosineSimilarity } from "../utils/cosineSimilarity";
import { AuthRequest } from "../middleware/authMiddleware";

export const askQuestion = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const questionEmbedding = await generateEmbedding(question);


    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const chunks = await NoteChunk.find({
      noteId: note._id,
      userId: req.userId,
    });

    if (!chunks.length) {
      return res.status(404).json({
        message: "No chunks found for this note",
      });
    }

   const scoredChunks =
    chunks.map(chunk => ({

    chunk,

    score: cosineSimilarity(
      questionEmbedding,
      chunk.embedding
    ),

    }));

    scoredChunks.sort(
    (a,b)=>

    b.score-a.score
    );

const context =
  scoredChunks

    .slice(0,5)

    .map(
      item =>
        item.chunk.content
    )

    .join("\n\n");

    const answer = await generateAIResponse(
      `You are a study AI assistant. Answer the question based on the following context as:-
        1. If the answer is not present in the context, say "I don't know".
        2. If the answer is present, provide a concise and clear answer.
        3. If the answer is present in multiple chunks, combine the information to provide a comprehensive answer.
        4. If the answer is present in one chunk, provide the answer from that chunk.
        5. If the answer is present in multiple chunks, provide the answer from the chunk that has the most relevant information.

Question: ${question}

Context: ${context}`
    );
    await Chat.create({

 userId:req.userId,

 noteId:
  note._id,

 question,

 answer,

});


    return res.status(200).json({
      question,
      answer,
      chunksUsed: Math.min(
        scoredChunks.length,
        5
      ),
    });

  } catch (error) {
    console.error(
      "Ask Question Error:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getChatHistory =
 async (
  req: AuthRequest,
  res: Response
 ) => {

 try {

  const chats =
   await Chat.find({

    noteId:
     req.params.id,

    userId:
     req.userId,

   })
   .sort({
    createdAt:1,
   });

  res.json(chats);

 } catch(error){

  console.error(error);

  res.status(500)
   .json({
    message:
     "Server Error",
   });

 }

};

export const recentChats = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const recentChats =
      await Chat.find({
        userId: req.userId,
      })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.json(recentChats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};