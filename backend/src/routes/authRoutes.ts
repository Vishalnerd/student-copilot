import express
from "express";

import { registerUser,loginUser, getUserProfile,refreshToken,logoutUser } from "../controllers/authController";
import {protect} from "../middleware/authMiddleware";
import {authLimiter}  from "../middleware/rateLimiter";

const router =
 express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post(
 "/register",
 authLimiter,
 registerUser
);
/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post(
    "/login",
    authLimiter,
     loginUser);
/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
router.post(
    "/refresh-token",
    refreshToken);
/**
 *  @route POST /api/auth/logout
 *  @desc Logout user and clear cookies
 *  @access Public
 */
router.post(
    "/logout",
    logoutUser);
/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get("/profile",
    protect,
    getUserProfile);

export default router;