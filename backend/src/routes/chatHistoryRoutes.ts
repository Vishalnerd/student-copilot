import express from "express";
import { getChatHistory,getRecentChatHistory ,getChatsByNote, deleteChatHistory } from "../controllers/chatHistoryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @route GET /api/chat/history
 * @desc Get chat history for the authenticated user
 * @access Private
 */
router.get("/history",protect, getChatHistory);
/**
 * @route GET /api/chat/recent
 * @desc Get recent chat history for the authenticated user
 * @access Private
 */
router.get("/recent", protect, getRecentChatHistory);
/**
 * @route GET /api/chat/:id
 * @desc Get chat history for a specific note
 * @access Private
 */
router.get("/:noteId", protect, getChatsByNote);
/**
 * @route DELETE /api/chat/:id
 * @desc Delete chat history for a specific note
 * @access Private
 */
router.delete("/:noteId", protect, deleteChatHistory);


export default router;
