
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { hashToken,compareToken } from "../utils/hashToken";
import User from "../models/user";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";
import { COOKIE_OPTIONS_ACCESS, COOKIE_OPTIONS_REFRESH } from "../utils/cookieOptions";
import { registerSchema,loginSchema } from "../validators/authValidator";
import {rotateRefreshToken} from "../services/auth/refreshTokenService";
import {AuthError} from "../utils/authError";
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user workspace account & issue secure cookies
 */
export const registerUser = async (req: AuthRequest, res: Response) => {
  try {
    const result=registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors:result.error.issues,
      })
    }
    const { name, email, password } = result.data;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email address" });
    }

    // Hash user passwords safely using secure salt factors
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: "local",
    });

    // Generate token pairs
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    const hashedRefreshToken = await hashToken(refreshToken);

    // Sync state database reference persistently 
    user.refreshTokens.push(hashedRefreshToken);
    await user.save();

    // Attach security tokens directly inside HTTP-only cookies
    res.cookie("accessToken", accessToken, COOKIE_OPTIONS_ACCESS);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS_REFRESH);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration Controller Error:", error);
    return res.status(500).json({ message: "Server Error during account creation layout" });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials, update session pairs & set cookies
 */
export const loginUser = async (req: AuthRequest, res: Response) => {
  try {
    
    const result=loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors:result.error.issues,
      })
    }
    const { email, password } = result.data;

    const user = await User.findOne({
  email: email.toLowerCase().trim(),
});

if (!user) {
  return res.status(400).json({
    message: "Invalid credentials",
  });
}

// Google-only account
if (!user.password) {
  return res.status(400).json({
    message: "This account uses Google Sign-In. Please continue with Google.",
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid credentials",
  });
}

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    const hashedRefreshToken =
  await hashToken(refreshToken);

    user.refreshTokens.push(hashedRefreshToken);
    await user.save();

    res.cookie("accessToken", accessToken, COOKIE_OPTIONS_ACCESS);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS_REFRESH);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Controller Error Stack:", error);
    return res.status(500).json({ message: "Server Error during validation exchange" });
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Verify incoming refresh token cookie to cycle fresh access token layers
 */

export const refreshToken = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const {
      accessToken,
      refreshToken,
    } = await rotateRefreshToken(
      incomingRefreshToken
    );

    res.cookie(
      "accessToken",
      accessToken,
      COOKIE_OPTIONS_ACCESS
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      COOKIE_OPTIONS_REFRESH
    );

    return res.status(200).json({
      message: "Token refreshed successfully",
    });

  } catch (error) {

    if (error instanceof AuthError) {

      return res.status(error.statusCode).json({
        message: error.message,
      });
    }
    console.error(error);
    console.log(error instanceof AuthError);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
/**
 * @route   POST /api/auth/logout
 * @desc    Clear client cookie registries and explicitly wipe DB records
 */
export const logoutUser = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const incomingRefreshToken =
      req.cookies.refreshToken;

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "logged out successfully, user not found",
      });
    }

    let matchedHash: string | null = null;

for (const hashedToken of user.refreshTokens) {
  const match = await compareToken(
    incomingRefreshToken,
    hashedToken
  );

  if (match) {
    matchedHash = hashedToken;
    break;
  }
}
console.log("Before:", user.refreshTokens.length);

if (matchedHash) {
  user.refreshTokens = user.refreshTokens.filter(
    token => token !== matchedHash
  );

  console.log("After:", user.refreshTokens.length);
  await user.save();
}
    res.clearCookie(
      "accessToken",
      COOKIE_OPTIONS_ACCESS
    );

    res.clearCookie(
      "refreshToken",
      COOKIE_OPTIONS_REFRESH
    );

    return res.json({
      message:
        "Logged out successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Server Error",
    });

  }

};

/**
 * @route   GET /api/auth/profile
 * @desc    Retrieve profile parameters safely using middleware authentication injections
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized missing session validation" });
    }

    const user = await User.findById(req.userId).select("-password -refreshTokens -__v");
    if (!user) {
      return res.status(404).json({ message: "Profile schema context registry not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile Fetch Controller Exception:", error);
    return res.status(500).json({ message: "Server Error loading profile context blocks" });
  }
};
