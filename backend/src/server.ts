import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

// Configuration & Middlewares
import connectDB from "./config/db";
import { apiLimiter } from "./middleware/rateLimiter";

// Route Blueprints
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import aiRoutes from "./routes/aiRoutes";



const app = express();

// 1. GLOBAL BASE SECURITY & CONFIGURATION LAYER (Must sit at top)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true // Required for secure access/refresh token cookie exchanges
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. RATE LIMITER GUARD
app.use(apiLimiter);

// 3. CENTRALIZED ROUTE MAPPING
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// Base Landing Status Route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

// 4. CONDITIONAL LIFECYCLE RUNTIME WRAPPER
// This structure prevents port collisions when Supertest imports 'app' inside test suites.
if (process.env.NODE_ENV !== "test") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      });
    } catch (error) {
      console.error("Database connection failure on startup:", error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;