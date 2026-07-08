import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty text chunk returned from Gemini engine");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Core Generation Error:", error);
    throw error;
  }
};

export const generateAIStream = async (prompt: string) => {
  const PRIMARY_MODEL = "gemini-2.5-flash";
  const FALLBACK_MODEL = "gemini-1.5-flash";
  try {
    const stream = await ai.models.generateContentStream({
      model: PRIMARY_MODEL,
      contents: prompt,
    });

    return stream;
  } catch (error:any) {
   if (error.status === 503 || error.message?.includes("503") || error.message?.includes("high demand")) {
      console.warn(`⚠️ Primary model ${PRIMARY_MODEL} overloaded. Falling back to ${FALLBACK_MODEL}...`);
      
      return await ai.models.generateContentStream({
        model: FALLBACK_MODEL,
        contents: prompt,
      });
    }
    
    // Forward any other legitimate structural errors
    throw error;
  }
};
