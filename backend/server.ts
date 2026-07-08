import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import connectDB from "./src/config/db";
import {redis} from "./src/config/redis";
import { pdfQueue } from "./src/jobs/pdfQueue";
import "./src/jobs/pdfWorker";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await redis.ping();
    console.log("✅ Redis Ping Successful");
    await pdfQueue.add('test', {hello: 'world'});
    console.log("✅ Test job added to pdfQueue");

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Database connection failure on startup:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}