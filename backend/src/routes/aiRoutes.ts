import express from "express";
import {protect} from "../middleware/authMiddleware";
import {recentChats} from "../controllers/chatController";
import {generateSummary} from "../controllers/ai/summaryController";
import {generateFlashcardsController,getFlashcardsController} from "../controllers/ai/flashcardController";
import {generateQuizController,getQuizzesController} from "../controllers/ai/quizController";
import { aiLimiter } from "../middleware/rateLimiter";

const router = express.Router();


/**
 * @route GET /api/ai/flashcards
 * @desc Get all flashcards for a user
 * @access Private
 */
router.get(
  "/flashcards",
  protect,
  getFlashcardsController
);
/**
 * @route GET /api/ai/quizzes
 * @desc Get all quizzes for a user
 * @access Private
 */
router.get(
  "/quizzes",
  protect,
  getQuizzesController
);
/**
 * @route GET /api/ai/recent
 * @desc Get recent chat history for a user
 * @access Private
 */
router.get(
  "/recent",
  protect,
  recentChats
);
/**
 * @route POST /api/ai/:id/quiz
 * @desc Generate a quiz for a specific note using AI
 * @access Private
 */
router.post(
  "/:id/quiz",
  protect,
  aiLimiter,
  generateQuizController
);
/**
 * @route POST /api/ai/:id/summary
 * @desc Generate a summary for a specific note using AI
 * @access Private
 */
router.post(
  "/:id/summary",
  protect,
  aiLimiter,
  generateSummary
);

/**
 * @route POST /api/ai/:id/flashcards
 * @desc Generate flashcards for a note using AI
 * @access Private
 */

router.post(
  "/:id/flashcards",
  protect,
  aiLimiter,
  generateFlashcardsController
);



export default router;