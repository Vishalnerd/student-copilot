import { Request, Response } from "express";
import Note from "../../models/note";
import Quiz from "../../models/Quiz"; 
import { generateQuizService } from "../../services/prompts/quizService"; 
import { AuthRequest } from "../../middleware/authMiddleware";


export const generateQuizController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // 1. Find Note context parameters validation criteria
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // 2. Check Cache registry in MongoDB
    const existingQuizzes = await Quiz.find({
      noteId: note._id,
      userId: req.userId,
    });

    // 3. Already Exists? YES -> Return MongoDB Cache Block
    if (existingQuizzes.length > 0) {
      return res.status(200).json({
        cached: true,
        quizzes: existingQuizzes,
      });
    }

    // 4. NO -> Generate content text with Gemini AI Service Engine
    const aiResponse = await generateQuizService(note.content);

    // 5. Remove markdown code fence signatures if Gemini returns formatting wraps
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let quizData;

    // 6. Parse String stream into structured JSON array models
    try {
      quizData = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Quiz JSON Parse Error:", err);
      return res.status(500).json({
        message: "Failed to parse AI response structures",
      });
    }

    // 7. Save parsed collection array in MongoDB
    // Assuming your quiz structure contains properties for: question, options[], and correctOptionIndex/answer
    const quizPayloadArray = Array.isArray(quizData) ? quizData : quizData.quizzes || [];

    const savedQuizzes = await Quiz.insertMany(
      quizPayloadArray.map(
        (quizItem: {
          question: string;
          options: string[];
          answer?: string | number;
          correctAnswer?: string | number;
        }) => ({
          noteId: note._id,
          userId: req.userId,
          question: quizItem.question,
          options: quizItem.options,
          answer: quizItem.answer,
          correctAnswer: quizItem.correctAnswer,
        })
      )
    );

    // 8. Return newly created dataset status back down the network stream pipe
    return res.status(201).json({
      cached: false,
      quizzes: savedQuizzes,
    });

  } catch (error) {
    console.error("Generate Quiz Controller Error:", error);
    return res.status(500).json({
      message: "Server Error during quiz compiling process pipeline",
    });
  }
};

export const getQuizzesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.userId,
    });

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Get Global User Quizzes Error Stack:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};