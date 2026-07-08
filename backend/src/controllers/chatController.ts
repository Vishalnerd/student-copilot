import { Request, Response } from "express";
import { generateAIStream } from "../services/ai/geminiService";
import  {buildRagPrompt}  from "../services/ai/ragService";
import Chat from "../models/Chat";
import { AuthRequest } from "../middleware/authMiddleware";
import { getCachedAnswer, cacheAnswer } from "../services/cache/cacheService";

export const streamChat = async (
  req: AuthRequest,
  res: Response
) => {
  const { question } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({
      message: "Question is required",
    });
  }

  try {
    // 1. Establish SSE headers immediately up front so the browser connection locks in cleanly
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("content-encoding", "Identity");
    res.flushHeaders();

    // 2. Look for your Redis cache hit
    const cachedAnswer = await getCachedAnswer(
      req.userId!,
      String(req.params.id),
      question
    );

    if (cachedAnswer) {
      console.log("⚡ Redis Cache Hit");

      // Write your custom event indicator matching your frontend subscription rules
      res.write(`event:token\n`);
      res.write(`data: ${JSON.stringify({ token: cachedAnswer })}\n\n`);

      // Flush your finish completion boundary handles
      res.write("event: done\n");
      res.write("data: {}\n\n");
      res.end();
      return;
    }

    console.log("❌ Cache Miss");
    const {
      prompt,
      note,
    } = await buildRagPrompt(
      String(req.params.id),
      req.userId!,
      question
    );

    let disconnected = false;

    req.on("close", () => {
      disconnected = true;
    });

    const stream = await generateAIStream(prompt);
    let fullAnswer = "";

    for await (const chunk of stream) {
      if (disconnected) break;

      const text = chunk.text;
      if (!text) continue;

      fullAnswer += text;

      res.write(`event:token\n`);
      res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
    }

    if (!disconnected) {
      await Chat.create({
        userId: req.userId,
        noteId: note._id,
        question,
        answer: fullAnswer,
      });

      res.write("event: done\n");
      res.write("data: {}\n\n");

      await cacheAnswer(
        req.userId!,
        note._id.toString(),
        question,
        fullAnswer
      );
    }

    res.end();
  } catch (error) {
    console.error(error);
    // Since headers are flushed at the top, we just end the open request channel cleanly
    res.end();
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