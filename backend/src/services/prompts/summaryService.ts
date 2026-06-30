import { generateAIResponse } from "../ai/geminiService";

export const generateSummaryService = async (
    content: string
) => {

    const prompt = `
You are an expert study assistant.

Summarize these study notes.

Requirements:

- Maximum 250 words
- Use bullet points
- Highlight important concepts
- Explain difficult topics simply
- Mention formulas if present
- Finish with a revision checklist

NOTES:

${content}
`;

    return await generateAIResponse(prompt);
};