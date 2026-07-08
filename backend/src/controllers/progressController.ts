import { Request, Response } from "express";
import { progressManager } from "../services/bullmq/progressManager";

export const streamProgress = (
  req: Request,
  res: Response
) => {
  const noteId = String(req.params.noteId);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  // ⭐ Register this response as an SSE client
  progressManager.subscribe(noteId, res);

  // ⭐ Send the latest progress immediately
  const latest =
    progressManager.get(noteId) || {
      status: "queued",
      progress: 0,
      message: "Job queued",
    };

  res.write(`data: ${JSON.stringify(latest)}\n\n`);

  req.on("close", () => {
    progressManager.unsubscribe(noteId, res);
  });
};