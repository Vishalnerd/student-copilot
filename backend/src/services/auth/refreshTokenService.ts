import jwt from "jsonwebtoken";
import User from "../../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { compareToken, hashToken } from "../../utils/hashToken";
import { AuthError } from "../../utils/authError";

export const rotateRefreshToken = async (incomingRefreshToken: string) => {
  // 1. Verify JWT
  let decoded: { userId: string };

  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };
  } catch {
    throw new AuthError(401, "Invalid or expired refresh token");
  }

  // 2. Find user (Read snapshot)
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AuthError(404, "User not found");
  }

  // 3. Detect refresh token reuse
  let matchedHash: string | null = null;

  for (const hashedToken of user.refreshTokens) {
    const isMatch = await compareToken(incomingRefreshToken, hashedToken);
    if (isMatch) {
      matchedHash = hashedToken;
      break;
    }
  }

  // 🚨 REUSE PENALTY CODE REWRITE
  if (!matchedHash) {
    // 💡 FIXED: Instantly wipe using updateOne to prevent parallel save collisions
    await User.updateOne({ _id: user._id }, { $set: { refreshTokens: [] } });
    throw new AuthError(401, "Token reuse detected");
  }

  // 4. Prepare fresh token pairs
  const newRefreshToken = generateRefreshToken(user._id.toString());
  const accessToken = generateAccessToken(user._id.toString());
  const hashedRefreshToken = await hashToken(newRefreshToken);

  // 🚨 ROTATION CRITICAL ATOMIC REWRITE
  // 💡 FIXED: Replaced .save() with an atomic multi-operator update.
  // This pulls the old hash and pushes the new hash concurrently without touching Mongoose versioning tags!
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id, refreshTokens: matchedHash }, // Ensure token wasn't already rotated by a parallel request
    {
      $pull: { refreshTokens: matchedHash },
      $push: { refreshTokens: hashedRefreshToken },
    },
    { new: true } // Return the freshly updated document state
  );

  // 💡 Handshake Safety Fallback:
  // If updatedUser returns null, it means a parallel request already pulled "matchedHash" from the array
  if (!updatedUser) {
    throw new AuthError(401, "Session concurrency collision. Please try again.");
  }

  return {
    user: updatedUser,
    refreshToken: newRefreshToken,
    accessToken,
  };
};