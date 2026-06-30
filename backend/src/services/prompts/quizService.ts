import {generateAIResponse} from "../ai/geminiService";

export const generateQuizService = async (
    content: string
) => { const prompt =`You are an expert professor.

Generate exactly 10 multiple choice questions.

Return ONLY JSON.

Format:

[
 {
   "question":"",

   "options":[
      "...",
      "...",
      "...",
      "..."
   ],

   "correctAnswer":"..."
 }
]

Rules

- Four options.

- Exactly one correct answer.

- No markdown.

- Cover all major topics.

- Medium difficulty.

NOTES

${content}`;

    return await generateAIResponse(prompt);
};


