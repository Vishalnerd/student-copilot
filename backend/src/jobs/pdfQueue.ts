import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const pdfQueue = new Queue(
  "pdf-processing",
  {
    connection: redisConnection as any,
  }
);