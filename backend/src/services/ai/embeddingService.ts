import { getCachedEmbedding, cacheEmbedding } from "../cache/embeddingCache";

const JINA_API_KEY = process.env.JINA_API_KEY!;
const JINA_API_URL = "https://api.jina.ai/v1/embeddings";

/**
 * Direct call to Jina AI to fetch an embedding array for a single string.
 */
export const generateEmbedding = async (
  text: string
): Promise<number[]> => {
  if (!JINA_API_KEY) {
    throw new Error("Missing JINA_API_KEY in environment variables.");
  }

  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "jina-embeddings-v4",
      task: "retrieval.passage", 
      dimensions: 1024,          
      input: [text],             
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Jina API error: ${response.statusText}`);
    (error as any).status = response.status;
    throw error;
  }

  const result = await response.json();
  const embedding = result.data?.[0]?.embedding;

  if (!embedding) {
    throw new Error("Embedding generation failed: Jina response format mismatch.");
  }

  return embedding;
};

/**
 * Direct call to Jina AI to process an entire array of text strings simultaneously.
 */
export const generateBatchEmbeddings = async (
  chunks: string[]
): Promise<number[][]> => {
  if (!JINA_API_KEY) {
    throw new Error("Missing JINA_API_KEY in environment variables.");
  }

  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "jina-embeddings-v4",
      task: "retrieval.passage",
      dimensions: 1024, // Matches default 1024 vector space configuration
      input: chunks,    // Directly passing our batch array of chunks
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Jina API error: ${response.statusText}`);
    (error as any).status = response.status;
    throw error;
  }

  const result = await response.json();
  const embeddings = result.data?.map((item: any) => item.embedding);

  if (!embeddings || embeddings.length !== chunks.length) {
    throw new Error("Batch embedding failed: Received response vector mismatch.");
  }

  return embeddings;
};

/**
 * Checks cache layer before invoking live generation.
 */
export const generateEmbeddingCached = async (text: string): Promise<number[]> => {
  const embedding = await getCachedEmbedding(text);
  if (embedding) {
    return JSON.parse(embedding) as number[];
  }
  const newEmbedding = await generateEmbeddingWithRetry(text);
  await cacheEmbedding(text, newEmbedding);
  return newEmbedding;
};

/**
 * Standard backoff/retry wrapper that listens for 429 Rate Limits on single text queries.
 */
export const generateEmbeddingWithRetry = async (
  text: string,
  retries = 3
): Promise<number[]> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateEmbedding(text);
    } catch (error: any) {
      if (error.status !== 429) throw error;

      const delay = (i + 1) * 5000;
      console.log(`Jina AI Rate limited. Retrying in ${delay} ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Embedding generation failed after retries.");
};

/**
 * Standard backoff/retry wrapper that listens for 429 Rate Limits during large batch parsing.
 */
export const generateBatchEmbeddingsWithRetry = async (
  chunks: string[],
  retries = 3
): Promise<number[][]> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateBatchEmbeddings(chunks);
    } catch (error: any) {
      if (error.status !== 429) throw error;

      const delay = (i + 1) * 5000;
      console.log(`Jina AI Batch rate limited. Retrying batch in ${delay} ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Batch embedding generation failed after retries.");
};