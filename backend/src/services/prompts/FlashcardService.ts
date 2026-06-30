import {generateAIResponse} from "../ai/geminiService";

export const generateFlashcardService = async (
    content: string
) => { const prompt = `You are an expert teacher.

Generate exactly 10 flashcards.

Return ONLY valid JSON.

Format:

[
 {
   "question":"...",
   "answer":"..."
 }
]

Rules:

- Short questions.
- Concise answers.
- Cover the most important concepts.
- No markdown.
- No explanation.

NOTES:

${content}
`;
     // Remove markdown if Gemini returns ```json
    const response = await generateAIResponse(prompt)
    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    //json parse
    return JSON.parse(cleanedResponse);
};