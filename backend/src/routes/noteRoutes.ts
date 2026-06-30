import express from "express";
import { uploadNote,getMyNotes,getNoteById,deleteNote,searchNotes } from "../controllers/noteController";
import { askQuestion,getChatHistory } from "../controllers/chatController";
import {protect} from "../middleware/authMiddleware";
import { aiLimiter } from "../middleware/rateLimiter";
import multer from "../config/multer"

const router = express.Router();

/**
 * @route POST /api/notes/upload
 * @desc Upload a note file
 * @access Private
 */
router.post(
 "/upload",
 protect,
 multer.single("file"),
 uploadNote
);

/**
 * @route GET /api/notes/my-notes
 * @desc Get all notes uploaded by the authenticated user
 * @access Private
 */
router.get(
  "/my-notes",
  protect,
  getMyNotes
);

/**
 * @route GET /api/notes/search
 * @desc Search notes based on a query
 * @access Private
 */

router.get(
 "/search",
 protect,
 searchNotes
);
/**
 * @route GET /api/notes/:id
 * @desc Get a note by ID
 * @access Private
 */

router.get(
 "/:id",
 protect,
 getNoteById
);
/**
 * @route POST /api/notes/:id/ask
 * @desc Ask a question about a specific note
 * @access Private
 */
router.post(
 "/:id/ask",
 protect,
 aiLimiter,
 askQuestion
);

/**
 * @route GET /api/notes/:id/chats
 * @desc Get chat history for a specific note
 * @access Private
 */
router.get(
 "/:id/chats",
 protect,
 getChatHistory
);

/**
 * @route DELETE /api/notes/:id
 * @desc Delete a note by ID
 * @access Private
 */
router.delete(
  "/:id",
  protect,
  deleteNote
);


export default router;