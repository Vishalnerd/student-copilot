import crypto from "crypto";
import { redis } from "../../config/redis";

export function getChatCacheKey(
  userId: string,
  noteId: string,
  question: string
) {
  const hash = crypto
    .createHash("sha256")
    .update(question.trim().toLowerCase())
    .digest("hex");

  return `chat:${userId}:${noteId}:${hash}`;
}

export async function getCachedAnswer(
  userId: string,
  noteId: string,
  question: string
) {
  const key = getChatCacheKey(userId, noteId, question);

  return redis.get(key);
}

export async function cacheAnswer(
  userId: string,
  noteId: string,
  question: string,
  answer: string
) {
  const key = getChatCacheKey(userId, noteId, question);

  // Cache for 1 hour
  await redis.set(key, answer, "EX", 60 * 60);
}