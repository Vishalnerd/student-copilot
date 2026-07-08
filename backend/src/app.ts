import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { apiLimiter } from "./middleware/rateLimiter";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import aiRoutes from "./routes/aiRoutes";
import chatHistoryRoutes from "./routes/chatHistoryRoutes";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL!,
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatHistoryRoutes);

app.get("/", (_, res) => {
  res.send("API is running");
});

export default app;