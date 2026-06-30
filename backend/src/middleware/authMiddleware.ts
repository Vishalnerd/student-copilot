import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // 💡 Support both HTTP-Only Cookies (recommended) AND Authorization headers for ultimate flexibility
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no access token is present, reject early
  if (!token) {
    return res.status(401).json({
      message: "Access denied: No authentication token provided",
    });
  }

  try {
    // 💡 Verify using the ACCESS secret, not the REFRESH secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    // Attach the validated userId payload to the request object context wrapper
    req.userId = decoded.userId;
    
    return next();
  } catch (error: any) {
    console.error("Authorization Middleware Token Failure:", error.message);

    // If the access token is explicitly expired, tell the client cleanly so they can refresh it
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED" // Great handle marker flag for your frontend Axios interceptors to listen to
      });
    }

    return res.status(401).json({
      message: "Authentication failed: Invalid token signature",
    });
  }
};