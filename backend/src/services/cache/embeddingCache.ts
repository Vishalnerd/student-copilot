import crypto from "crypto";
import { redis } from "../../config/redis";

function getEmbeddingKey(question: string) {
  const hash = crypto
    .createHash("sha256")
    .update(question.trim().toLowerCase())
    .digest("hex");

  return `embedding:${hash}`;
}

export async function getCachedEmbedding(question: string) {
  const startTime = performance.now();
  const result=await redis.get(getEmbeddingKey(question));
  console.log(`cache retrieval finished in ${performance.now()-startTime} ms`);
  return result;
}

export async function cacheEmbedding(
  question: string,
  embedding: number[]
) {
  await redis.set(
    getEmbeddingKey(question),
    JSON.stringify(embedding),
    "EX",
    60 * 60 * 24 // 24 hours
  );
}