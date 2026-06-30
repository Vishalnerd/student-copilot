import { Response } from "express";
import Note from "../models/note";
import Chat from "../models/Chat";
import Flashcard from "../models/Flashcard";
import Quiz from "../models/Quiz";
import { AuthRequest } from "../middleware/authMiddleware";

export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const totalNotes =
      await Note.countDocuments({
        userId: req.userId,
      });

    const totalQuestions =
      await Chat.countDocuments({
        userId: req.userId,
      });

    const totalFlashcards =
      await Flashcard.countDocuments({
        userId: req.userId,
      });

    const totalQuizzes =
      await Quiz.countDocuments({
        userId: req.userId,
      });

    const recentNotes =
      await Note.find({
        userId: req.userId,
      })
      .sort({
        createdAt: -1,
      })
      .limit(5);
  
    res.status(200).json({
      totalNotes,
      totalQuestions,
      totalFlashcards,
      totalQuizzes,
      recentNotes,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};