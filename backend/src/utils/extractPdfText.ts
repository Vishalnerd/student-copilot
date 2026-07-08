import fs from "fs";
import { PDFParse } from "pdf-parse";

/**
 * Reads a local PDF file path, parses its structural buffer using pdf-parse v2,
 * and extracts the raw plain text.
 */
const extractPdfText = async (filePath: string): Promise<string> => {
  // Read the local file into a Node.js Buffer
  const buffer = fs.readFileSync(filePath);

  // Initialize the v2 parser with the data buffer
  const parser = new PDFParse({ data: buffer });

  try {
    // Extract the text content from the document
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error("Error parsing PDF via pdf-parse v2:", error);
    throw error;
  } finally {
    // Important: Always call destroy() to free memory allocation as per v2 docs
    await parser.destroy();
  }
};

export default extractPdfText;