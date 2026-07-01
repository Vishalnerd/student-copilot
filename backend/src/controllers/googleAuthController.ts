import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import { hashToken } from "../utils/hashToken";
import {
  COOKIE_OPTIONS_ACCESS,
  COOKIE_OPTIONS_REFRESH,
} from "../utils/cookieOptions";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const {credential} = req.body;
    if(!credential){
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        return res.status(401).json({
        message: "Invalid Google token",
        });
    }

    const {
    sub,
    email,
    name,
    picture,
    } = payload;

    if (!email) {
  return res.status(400).json({
    message: "Google account has no email",
  });
}

// Look for an existing account by email
let user = await User.findOne({
  email,
});

if (user) {

  if (!user.googleId) {
    user.googleId = sub;
  }

  user.provider = "google";

  if (picture) {
    user.avatar = picture;
  }

  await user.save();

} else {

  // Create a brand new Google account
  user = await User.create({
    name,
    email,
    googleId: sub,
    avatar: picture,
    provider: "google",
  });

}
const accessToken =
  generateAccessToken(
    user._id.toString()
  );

const refreshToken =
  generateRefreshToken(
    user._id.toString()
  );

  const hashedToken =
  await hashToken(refreshToken);

await User.findByIdAndUpdate(
  user._id,
  {
    $push: {
      refreshTokens: hashedToken,
    },
  },
  {new: true}
);

await user.save();

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
  message: "Google login successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
  },
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Google authentication failed",
    });
  }
};