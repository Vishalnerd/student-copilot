/**
 * Splits raw string text into semantic chunks along word boundaries 
 * to preserve complete concepts for the Jina embedding model.
 */
const chunkText = (text: string, chunkSize: number = 1000): string[] => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentLength += word.length + 1; // Word length + the trailing space

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
      currentLength = 0;
    }
  }

  // Pick up any leftover words at the end
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
};

export default chunkText;