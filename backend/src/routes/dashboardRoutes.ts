import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const router = express.Router();

/**
 * @route GET /api/dashboard
 * @desc Get dashboard data for the authenticated user
 * @access Private
 */

router.get("/", protect, getDashboard);

export default router;