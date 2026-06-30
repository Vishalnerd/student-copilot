import { Request, Response } from "express";

import Note from "../../models/note";
import Flashcard from "../../models/Flashcard";
import { generateFlashcardService } from "../../services/prompts/FlashcardService";
import { AuthRequest } from "../../middleware/authMiddleware";


export const generateFlashcardsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Check cache
    const existingFlashcards =
      await Flashcard.find({
        noteId: note._id,
        userId: req.userId,
      });

    if (existingFlashcards.length > 0) {
      return res.status(200).json({
        cached: true,
        flashcards: existingFlashcards,
      });
    }

    // Generate with AI
    const aiResponse =
      await generateFlashcardService(note.content);


    // Save in MongoDB
    const savedFlashcards =
      await Flashcard.insertMany(
        aiResponse.map(
          (card: {
            question: string;
            answer: string;
          }) => ({
            noteId: note._id,
            userId: req.userId,
            question: card.question,
            answer: card.answer,
          })
        )
      );

    return res.status(201).json({
      cached: false,
      flashcards: savedFlashcards,
    });

  } catch (error) {
    console.error(
      "Generate Flashcards Error:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getFlashcardsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.userId,
    }).populate("noteId", "fileName");

    return res.status(200).json(flashcards);
  } catch (error) {
    console.error(
      "Get Flashcards Error:",
      error
    );
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
